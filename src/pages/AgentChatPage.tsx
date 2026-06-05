import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Building2,
  MapPin,
  X,
  Home,
  User,
  AlertCircle,
  ArrowLeft,
  BedDouble,
  Maximize2,
  Sparkles,
} from "lucide-react";
import agentService from "@/services/agent.service";
import type { Agent, AgentChatMessage } from "@/types/agent";
import { createAgentRobotAvatar } from "@/lib/agentAvatar";

const TypingAnimation = () => (
  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-sm px-3.5 py-3">
    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
  </div>
);

const AgentChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
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
  // UI-ONLY: controls the mobile "Recommended Properties" bottom-sheet drawer.
  // Does not affect any chat/data logic.
  const [showProperties, setShowProperties] = useState(false);

  const lastAgentCards = useMemo(() => {
    const lastAgentMessage = [...messages].reverse().find(
      (message) => message.sender === "agent" && Array.isArray(message.propertyCards) && message.propertyCards.length > 0
    );
    return lastAgentMessage?.propertyCards || [];
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamReply]);

  // LAYOUT-ONLY: keep the app sized to the EXACT visible area.
  // CSS units (vh/svh/dvh) can't react to the on-screen keyboard, so we read
  // window.visualViewport (its height + offset shrink/move when the keyboard or
  // browser toolbars appear) and pin the root to it. This does NOT touch any
  // chat state, handlers, or API calls — it only sets size/position.
  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    const applyViewport = () => {
      const el = rootRef.current;
      if (!el) return;
      if (vv) {
        el.style.height = `${vv.height}px`;
        el.style.top = `${vv.offsetTop}px`;
      } else {
        el.style.height = `${window.innerHeight}px`;
        el.style.top = "0px";
      }
    };
    applyViewport();
    if (vv) {
      vv.addEventListener("resize", applyViewport);
      vv.addEventListener("scroll", applyViewport);
    }
    window.addEventListener("resize", applyViewport);
    window.addEventListener("orientationchange", applyViewport);
    return () => {
      if (vv) {
        vv.removeEventListener("resize", applyViewport);
        vv.removeEventListener("scroll", applyViewport);
      }
      window.removeEventListener("resize", applyViewport);
      window.removeEventListener("orientationchange", applyViewport);
    };
  }, [agent]);

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

  const sendChatMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!id || !text || sending) return;

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

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    void sendChatMessage(text);
  };

  // Back navigation — go to the previous history entry, or fall back to home
  // if the chat was opened directly (e.g. from a QR scan with no history).
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // Click handler for inline property cards — asks the bot about the property.
  const handlePropertyClick = (property: { id?: string; title?: string }) => {
    if (sending || quotaExceeded) return;
    const label = property.title || `property ${property.id}`;
    void sendChatMessage(`Tell me more about "${label}" — price, BHK, area, amenities.`);
  };

  // ---- UI helpers (presentation only) -------------------------------------

  const agentAvatar = () => (agent ? agent.avatarUrl || createAgentRobotAvatar(agent) : "");

  const renderProperty = (property: (typeof lastAgentCards)[number], index: number) => (
    <button
      type="button"
      key={`${property.id || index}-${index}`}
      onClick={() => handlePropertyClick(property)}
      disabled={sending || quotaExceeded}
      className="group flex w-full flex-col overflow-hidden text-left rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
      aria-label={`Ask about ${property.title || "this property"}`}
    >
      {/* Cover image with price chip overlay */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-100">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title || "Property"}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Building2 className="h-7 w-7 text-slate-300" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent" />
        <span className="absolute bottom-2 left-2 inline-flex items-center rounded-lg bg-white/95 px-2 py-1 text-[12.5px] font-bold text-slate-900 shadow-sm backdrop-blur">
          ₹ {Number(property.price || 0).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-[13.5px] font-semibold text-slate-900 leading-snug">
          {property.title || "Property"}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[11.5px] text-slate-500">
          <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
          <span className="truncate">{property.location || "Location unavailable"}</span>
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {property.bedrooms != null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              <BedDouble className="h-3 w-3 text-slate-400" />
              {property.bedrooms} BHK
            </span>
          )}
          {property.area != null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              <Maximize2 className="h-3 w-3 text-slate-400" />
              {property.area} {property.areaUnit || "sqft"}
            </span>
          )}
        </div>

        <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
          Tap to ask about this
          <Send className="h-3 w-3" />
        </span>
      </div>
    </button>
  );

  const emptyProperties = (
    <div className="text-center py-12">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Home className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-600">No matches yet</p>
      <p className="text-xs text-slate-400 mt-1">Start chatting to see matched properties.</p>
    </div>
  );

  // ---- Loading / error states ---------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-white px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="text-sm sm:text-base text-slate-500 font-medium text-center">Loading chat...</div>
        </div>
      </div>
    );
  }

  if (!id || !agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-white p-4">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Agent unavailable</h1>
          <p className="text-sm text-slate-500 mt-2">Please check the QR link and try again.</p>
        </div>
      </div>
    );
  }

  // ---- Main layout ---------------------------------------------------------

  return (
    /*
      Responsive, ChatGPT/Claude-style layout pinned to the LIVE visible
      viewport via position:fixed (+ the visualViewport effect above) so it
      always fills the exact area between toolbars / above the keyboard —
      no top clip, no bottom gap, no keyboard gap on phones or laptops.

      iOS NOTE: the composer <input> uses a 16px font on mobile. iOS Safari
      auto-zooms into any focused input whose font-size is < 16px, which is
      what pushed the send button off-screen before. Keeping it at 16px stops
      that zoom entirely.

      Two-pane on lg+: chat (left) + Recommended Properties (right).
      On mobile the sidebar collapses into a bottom-sheet drawer.
    */
    <div
      ref={rootRef}
      style={{ position: "fixed", left: 0, right: 0 }}
      className="flex flex-col h-[100dvh] overflow-hidden bg-white text-slate-800 antialiased"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 border-b border-slate-200 backdrop-blur-xl bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.02)] z-40"
      >
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              {/* Back navigation */}
              <button
                type="button"
                onClick={handleBack}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative flex-shrink-0">
                <img
                  src={agentAvatar()}
                  alt={agent.name}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-100 border border-slate-200 bg-slate-100"
                />
                {/* online dot */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <h1 className="text-sm sm:text-[15px] font-semibold text-slate-900 tracking-tight truncate">
                  {agent.name}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                  AI Property Consultant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Properties button — mobile / tablet only */}
              <button
                type="button"
                onClick={() => setShowProperties(true)}
                className="lg:hidden relative flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition-colors"
                aria-label="View recommended properties"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Properties</span>
                {lastAgentCards.length > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                    {lastAgentCards.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-green-50 rounded-full px-2 sm:px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] sm:text-xs text-green-700 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Body: chat column + desktop sidebar */}
      <div className="flex-1 min-h-0 flex">
        {/* Chat column */}
        <div className="flex-1 min-w-0 flex flex-col bg-slate-50">
          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-3 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-5">
              <AnimatePresence>
                {messages.map((message, idx) => {
                  const isUser = message.sender === "user";
                  const cards = !isUser && Array.isArray(message.propertyCards) ? message.propertyCards : [];
                  const hasCards = cards.length > 0;
                  return (
                    <motion.div
                      key={`${message.timestamp || idx}-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex items-start gap-2 sm:gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isUser ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </div>
                        ) : (
                          <img
                            src={agentAvatar()}
                            alt={agent.name}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                          />
                        )}
                      </div>

                      {/* Bubble */}
                      <div className={`flex flex-col gap-1 ${hasCards ? "w-full max-w-full items-start" : "max-w-[85%] sm:max-w-[78%]"} ${isUser ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                            hasCards ? "max-w-[85%] sm:max-w-[78%]" : ""
                          } ${
                            isUser
                              ? "bg-blue-600 text-white rounded-tr-md shadow-sm shadow-blue-600/20"
                              : "bg-white border border-slate-200 text-slate-800 rounded-tl-md shadow-sm"
                          }`}
                        >
                          {message.text}
                        </div>

                        {/* Inline property cards — only on agent messages that carry matches.
                            Cards are clickable: tapping sends a follow-up question to the bot.

                            Layout rule: up to 3 cards lay out in an even grid (all fully
                            visible, no scroll). With 4+ cards we switch to a horizontal
                            scroller sized so EXACTLY 3 cards are visible at once — the rest
                            are off-screen and reachable by swiping (no half-cut peek). */}
                        {hasCards && (
                          <div className="w-full mt-1.5">
                            <div className="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-medium text-slate-500">
                              <Sparkles className="h-3 w-3 text-blue-500" />
                              {cards.length} matched {cards.length === 1 ? "property" : "properties"}
                            </div>
                            {cards.length <= 3 ? (
                              <div
                                className="grid gap-2.5"
                                style={{
                                  gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))`,
                                  maxWidth: cards.length >= 3 ? "100%" : `${cards.length * 244}px`,
                                }}
                              >
                                {cards.map((card, cIdx) => (
                                  <div key={`${message.timestamp || idx}-card-${card.id || cIdx}`} className="min-w-0">
                                    {renderProperty(card, cIdx)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {cards.map((card, cIdx) => (
                                  <div
                                    key={`${message.timestamp || idx}-card-${card.id || cIdx}`}
                                    className="snap-start flex-shrink-0"
                                    style={{ width: "calc((100% - 1.25rem) / 3)" }}
                                  >
                                    {renderProperty(card, cIdx)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {message.timestamp && (
                          <span className="text-[10px] text-slate-400 px-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 sm:gap-2.5"
                >
                  <img
                    src={agentAvatar()}
                    alt={agent.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 bg-slate-100 flex-shrink-0 mt-0.5"
                  />
                  <div className="max-w-[85%] sm:max-w-[78%]">
                    {streamReply ? (
                      <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-md text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words bg-white border border-slate-200 text-slate-800 shadow-sm">
                        {streamReply}
                      </div>
                    ) : (
                      <TypingAnimation />
                    )}
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Footer: quota banner + input */}
          <div className="flex-shrink-0 border-t border-slate-200 backdrop-blur-xl bg-white/95 z-30 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto w-full max-w-3xl px-3 sm:px-5 pt-2.5 pb-3 sm:pb-4">
              {quotaExceeded && (
                <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] sm:text-[13px] text-amber-800 text-center">
                  This agent is currently not available — its owner has reached their monthly chat limit.
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-white border border-slate-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    quotaExceeded
                      ? "Chat unavailable — monthly limit reached"
                      : "Type your property requirement..."
                  }
                  /* text-[16px] on mobile prevents iOS focus auto-zoom */
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none h-9 text-[16px] sm:text-[15px] px-3 sm:px-4 text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
                  disabled={sending || quotaExceeded}
                  maxLength={500}
                  enterKeyHint="send"
                  autoComplete="off"
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={sending || quotaExceeded || !input.trim()}
                  className="h-9 w-9 p-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm shadow-blue-600/30 border-0 disabled:opacity-40 disabled:shadow-none transition-all duration-200 active:scale-95 flex-shrink-0 flex items-center justify-center text-white"
                  aria-label="Send message"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              {error && !quotaExceeded && (
                <p className="text-[12px] text-red-600 text-center mt-1.5">{error}</p>
              )}
              <p className="text-[10px] text-slate-400 text-center mt-1.5 hidden sm:block">
                Enter to send · Property matches update live
              </p>
            </div>
          </div>
        </div>

        {/* Desktop sidebar — Recommended Properties */}
        <aside className="hidden lg:flex flex-col w-[340px] xl:w-[380px] flex-shrink-0 border-l border-slate-200 bg-white">
          <div className="flex-shrink-0 px-4 py-3.5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </span>
                Recommended Properties
              </h2>
              {lastAgentCards.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                  {lastAgentCards.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Matches update live from your conversation.</p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3.5 space-y-3 bg-slate-50">
            {lastAgentCards.length === 0 ? emptyProperties : lastAgentCards.map(renderProperty)}
          </div>
        </aside>
      </div>

      {/* Mobile bottom-sheet drawer — Recommended Properties */}
      <AnimatePresence>
        {showProperties && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setShowProperties(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-t-2xl bg-white border-t border-slate-200 max-h-[80dvh] flex flex-col pb-[env(safe-area-inset-bottom)]"
            >
              {/* grab handle */}
              <div className="flex-shrink-0 flex justify-center pt-2.5">
                <span className="h-1 w-10 rounded-full bg-slate-300" />
              </div>
              <div className="flex-shrink-0 flex items-center justify-between px-5 pt-2.5 pb-3 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Recommended Properties
                </h2>
                <button
                  type="button"
                  onClick={() => setShowProperties(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
                {lastAgentCards.length === 0 ? emptyProperties : lastAgentCards.map(renderProperty)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentChatPage;