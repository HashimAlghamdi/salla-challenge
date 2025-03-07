import { apiClient } from "@/config/client";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  status: string;
}

interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface SignupResponse {
  message: string;
  status: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/user/signIn/",
        credentials
      );
      if (!response.data) {
        throw new Error("فشل تسجيل الدخول");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (credentials: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await apiClient.post<SignupResponse>(
        "/user/signup/",
        credentials
      );
      if (!response.data) {
        throw new Error("فشل إنشاء الحساب");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
