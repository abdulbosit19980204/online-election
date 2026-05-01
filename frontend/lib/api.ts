import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = res.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          original.headers.Authorization = `Bearer ${access_token}`;
          return api(original);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── API Methods ──────────────────────────────────────────

// Auth
export const authApi = {
  register: (data: { email: string; full_name: string; password: string }) =>
    api.post("/auth/register/", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login/", data),
  me: () => api.get("/auth/me/"),
  refresh: (refresh_token: string) => api.post("/auth/refresh/", { refresh_token }),
};

// Elections
export const electionApi = {
  list: (status?: string) => api.get("/elections/", { params: { status } }),
  get: (id: string) => api.get(`/elections/${id}/`),
  results: (id: string) => api.get(`/elections/${id}/results/`),
};

// Votes
export const voteApi = {
  cast: (election_id: string, candidate_id: string) =>
    api.post(`/votes/${election_id}/`, { election_id, candidate_id }),
  status: (election_id: string) => api.get(`/votes/status/${election_id}/`),
};

// Admin
export const adminApi = {
  stats: () => api.get("/admin/stats/"),
  listElections: () => api.get("/admin/elections/"),
  createElection: (data: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
  }) => api.post("/admin/elections/", data),
  updateElection: (id: string, data: object) =>
    api.patch(`/admin/elections/${id}/`, data),
  deleteElection: (id: string) => api.delete(`/admin/elections/${id}/`),
  addCandidate: (
    election_id: string,
    data: { name: string; party?: string; bio?: string; photo_url?: string }
  ) => api.post(`/admin/elections/${election_id}/candidates/`, data),
  updateCandidate: (id: string, data: object) =>
    api.patch(`/admin/candidates/${id}/`, data),
  deleteCandidate: (id: string) => api.delete(`/admin/candidates/${id}/`),
  publishResults: (id: string) => api.post(`/admin/elections/${id}/publish/`),
};

// Analytics
export const analyticsApi = {
  election: (id: string) => api.get(`/analytics/elections/${id}/`),
  system: () => api.get("/analytics/system/"),
};
