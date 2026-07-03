import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.type";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      payload
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};