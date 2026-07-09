import type { ApiResponse } from "./api.type";

export type LoginData = {
  accessToken: string;
  user: {
    id: number;
    firstName: string; 
    lastName: string;
    email: string;
    phoneNumber?: string;
    role?: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = ApiResponse<LoginData>;

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  organizationName?: string;
  teachingSubject?: string;
  teachingGrade?: string;
  avatarUrl?: string;
};

export type RegisterData = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type RegisterResponse = ApiResponse<RegisterData>;