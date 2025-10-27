export type UserRole = "buyer" | "admin";

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fech_creacion?: string;
  fech_modif?: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  role?: UserRole;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
