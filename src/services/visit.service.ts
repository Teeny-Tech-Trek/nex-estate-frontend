import api from "@/config/apiConfig";
import {
  CreateVisitPayload,
  UpdateVisitPayload,
  Visit,
  VisitListResult,
  VisitStats,
} from "@/types/visit";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  page?: number;
  pages?: number;
};

const withDefaults = (visit: Visit): Visit => ({
  ...visit,
  status: visit.status || "scheduled",
  buyerName: visit.buyerName || "Unknown",
  sessionId: visit.sessionId || "",
  dateTime: visit.dateTime || new Date().toISOString(),
});

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosErr = error as any;
  if (axiosErr?.mapped?.message) {
    return axiosErr.mapped.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      "string"
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const visitService = {
  getVisits: async (params?: {
    status?: string;
    agent?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<VisitListResult> => {
    const response = await api.get<ApiEnvelope<Visit[]>>("/visits", { params });
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      total: Number(response.data?.total || raw.length || 0),
      page: Number(response.data?.page || 1),
      pages: Number(response.data?.pages || 1),
      data: raw.map(withDefaults),
    };
  },

  getVisit: async (id: string): Promise<Visit> => {
    const response = await api.get<ApiEnvelope<Visit>>(`/visits/${id}`);
    if (!response.data?.data) {
      throw new Error("Visit not found");
    }
    return withDefaults(response.data.data);
  },

  createVisit: async (payload: CreateVisitPayload): Promise<Visit> => {
    try {
      const response = await api.post<ApiEnvelope<Visit>>("/visits", payload);
      if (!response.data?.data) {
        throw new Error(response.data?.message || "Failed to create visit");
      }
      return withDefaults(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create visit"));
    }
  },

  updateVisit: async (id: string, payload: UpdateVisitPayload): Promise<Visit> => {
    try {
      const response = await api.put<ApiEnvelope<Visit>>(`/visits/${id}`, payload);
      if (!response.data?.data) {
        throw new Error(response.data?.message || "Failed to update visit");
      }
      return withDefaults(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update visit"));
    }
  },

  deleteVisit: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<ApiEnvelope<null>>(`/visits/${id}`);
      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Failed to delete visit");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to delete visit"));
    }
  },

  getUpcomingVisits: async (limit = 10): Promise<Visit[]> => {
    const response = await api.get<ApiEnvelope<Visit[]>>("/visits/upcoming", {
      params: { limit },
    });
    return (Array.isArray(response.data?.data) ? response.data.data : []).map(withDefaults);
  },

  getVisitStats: async (): Promise<VisitStats> => {
    const response = await api.get<ApiEnvelope<VisitStats>>("/visits/stats");
    return {
      total: Number(response.data?.data?.total || 0),
      scheduled: Number(response.data?.data?.scheduled || 0),
      completed: Number(response.data?.data?.completed || 0),
      cancelled: Number(response.data?.data?.cancelled || 0),
      no_show: Number(response.data?.data?.no_show || 0),
    };
  },
};

export default visitService;
