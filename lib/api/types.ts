export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: { code?: string; details?: unknown };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface LoginResult {
  admin: AdminProfile;
  accessToken: string;
  refreshToken: string;
}
