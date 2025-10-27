// services/user/user.service.ts
import type {
  ApiResponse,
  SafeUser,
  Paged,
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
} from "../../models/services/user/user.model";
import { axiosClient } from "../../utils/interceptor/interceptor";

export async function listUsers(): Promise<SafeUser[]> {
  const { data } = await axiosClient.get<ApiResponse<Paged<SafeUser>>>("/api/users/listUsers");
  return data.data?.items ?? [];
}

export async function createUser(payload: CreateUserDTO): Promise<SafeUser> {
  const { data } = await axiosClient.post<ApiResponse<SafeUser>>("/api/users/createUser", payload);
  if (data.code >= 400) throw new Error(data.message);
  return data.data!;
}

export async function updateUser(id: string, payload: UpdateUserDTO): Promise<SafeUser> {
  const { data } = await axiosClient.patch<ApiResponse<SafeUser>>(`/api/users/updateUser/${id}`, payload);
  if (data.code >= 400) throw new Error(data.message);
  return data.data!;
}

export async function deleteUser(id: string): Promise<boolean> {
  const { data } = await axiosClient.delete<ApiResponse<{ deleted: boolean }>>(`/api/users/deleteUser/${id}`);
  if (data.code >= 400) throw new Error(data.message);
  return !!data.data?.deleted;
}

export async function changeMyPassword(payload: ChangePasswordDTO): Promise<boolean> {
  const { data } = await axiosClient.post<ApiResponse<{ changed: boolean }>>("/api/users/changePassword", payload);
  if (data.code >= 400) throw new Error(data.message);
  return !!data.data?.changed;
}

/** 🔹 Nuevo: actualizar mi propio correo */
export async function updateMyEmail(email: string): Promise<SafeUser> {
  // Ajusta la URL si tu backend expone otro endpoint (p.ej. /api/users/updateMe)
  const { data } = await axiosClient.post<ApiResponse<SafeUser>>("/api/users/updateMyEmail", { email });
  if (data.code >= 400) throw new Error(data.message);
  return data.data!;
}
