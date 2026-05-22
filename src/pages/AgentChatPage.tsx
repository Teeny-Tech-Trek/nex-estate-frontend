import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import agentService from "@/services/agent.service";
import type { Agent, AgentChatMessage } from "@/types/agent";
import { createAgentRobotAvatar } from "@/lib/agentAvatar";

const TypingAnimation = () => (
  <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 shadow-sm border border-slate-200">
    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
  </div>
);

const AgentChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  // True after backend returns 429 QUOTA_EXCEEDED — the agent's owner has hit
  // their monthly chat-message limit. Composer freezes and a banner appears.
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamReply, setStreamReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const lastAgentCards = useMemo(() => {
    const lastAgentMessage = [...messages].reverse().find(
      (message) => message.sender === "agent" && Array.isArray(message.propertyCards) && message.propertyCards.length > 0
    );
    return lastAgentMessage?.propertyCards || [];
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        const agentData = await agentService.getPublicAgent(id);
        const historyResult = await agentService
          .getAgentChatHistory(id)
          .then((history) => ({ history }))
          .catch(() => ({ history: [] as AgentChatMessage[] }));

        if (!mounted) return;
        setAgent(agentData);
        setMessages(historyResult.history || []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void init();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);
    setIsTyping(true);
    setStreamReply("");
    setError(null);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text, timestamp: new Date().toISOString() },
    ]);

    // Helper: detect the backend's 429 QUOTA_EXCEEDED shape across both the
    // streaming (fetch) and non-streaming (axios) error variants.
    const isQuotaExceeded = (err: any): boolean => {
      const status = err?.status ?? err?.response?.status;
      const code = err?.code ?? err?.response?.data?.error;
      const msg = String(err?.message || '').toLowerCase();
      return status === 429 || code === 'QUOTA_EXCEEDED' || msg.includes('429');
    };

    try {
      const data = await agentService.streamChatWithAgent(
        id,
        text,
        (event) => {
          if (event.type === "chunk") {
            setStreamReply((prev) => `${prev}${event.content || ""}`);
          }
        }
      );
      setMessages(data.history || []);
      setStreamReply("");
    } catch (err) {
      // If the stream call hit the quota gate, the SSE error event surfaces
      // as a thrown error here. Skip the fallback non-stream call (it would
      // also 429) and freeze the composer.
      if (isQuotaExceeded(err)) {
        setQuotaExceeded(true);
        setError(
          "This agent is currently not available — its owner has reached their monthly chat limit."
        );
      } else {
        setError(err instanceof Error ? err.message : "Message failed");
        try {
          const fallback = await agentService.chatWithAgent(id, text);
          setMessages(fallback.history || []);
        } catch (fallbackErr) {
          if (isQuotaExceeded(fallbackErr)) {
            setQuotaExceeded(true);
            setError(
              "This agent is currently not available — its owner has reached their monthly chat limit."
            );
          }
        }
      }
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading chat...</div>
      </div>
    );
  }

  if (!id || !agent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Agent unavailable</h1>
          <p className="text-slate-600 mt-2">Please check the QR link and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100" style={{ padding: "clamp(8px, 1.5vw, 24px) clamp(8px, 1.5vw, 24px)" }}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4" style={{ maxWidth: "min(1280px, 100%)" }}>
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <header className="px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <img
              src={agent.avatarUrl || createAgentRobotAvatar(agent)}
              alt={agent.name}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="rounded-full object-cover bg-slate-200 flex-shrink-0"
              style={{ width: "clamp(36px, 3vw, 44px)", height: "clamp(36px, 3vw, 44px)" }}
            />
            <div className="min-w-0">
              <h1 className="font-semibold text-slate-900 truncate" style={{ fontSize: "clamp(13px, 1vw, 15px)" }}>{agent.name}</h1>
              <p className="text-slate-500" style={{ fontSize: "clamp(11px, 0.8vw, 12.5px)" }}>AI Property Consultant</p>
            </div>
          </header>

          <div className="overflow-y-auto space-y-3" style={{ height: "min(62vh, calc(100vh - 200px))", padding: "clamp(12px, 1.6vw, 20px)" }}>
            {messages.map((message, idx) => {
              const isUser = message.sender === "user";
              return (
                <div key={`${message.timestamp || idx}-${idx}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      isUser
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 border border-slate-200 text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                {streamReply ? (
                  <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap bg-slate-100 border border-slate-200 text-slate-800">
                    {streamReply}
                  </div>
                ) : (
                  <TypingAnimation />
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {quotaExceeded && (
            <div className="mx-3 mt-3 mb-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 text-center">
              This agent is currently not available — its owner has reached their monthly chat limit.
            </div>
          )}
          <form onSubmit={handleSend} className="border-t border-slate-200 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                quotaExceeded
                  ? "Chat unavailable — owner's monthly limit reached"
                  : "Type your property requirement..."
              }
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              disabled={sending || quotaExceeded}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={sending || quotaExceeded || !input.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
          {error && !quotaExceeded && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        </section>

        <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Recommended Properties</h2>
          <p className="text-xs text-slate-500 mb-3">Matches update live from your conversation.</p>

          <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
            {lastAgentCards.length === 0 && (
              <p className="text-sm text-slate-500">Start chatting to see matched properties.</p>
            )}
            {lastAgentCards.map((property, index) => (
              <article key={`${property.id || index}-${index}`} className="rounded-xl border border-slate-200 p-3">
                {property.image && (
                  <img
                    src={property.image}
                    alt={property.title || "Property"}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="h-28 w-full rounded-lg object-cover mb-2 bg-slate-100"
                  />
                )}
                <h3 className="text-sm font-semibold text-slate-900">{property.title || "Property"}</h3>
                <p className="text-xs text-slate-600 mt-1">{property.location || "Location unavailable"}</p>
                <p className="text-sm font-medium text-blue-700 mt-1">
                  Rs {Number(property.price || 0).toLocaleString("en-IN")}
                </p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AgentChatPage;
