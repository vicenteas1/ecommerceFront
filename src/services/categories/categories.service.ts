import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type {
  Category,
  CategoryListResponse,
  CategorySingleResponse,
  DeleteEnvelope,
} from "../../models/services/categories/categories.model";
import type { Type } from "../../models/services/type/types.model";
import { axiosClient } from "../../utils/interceptor/interceptor";

function normalizeList(resp: CategoryListResponse): Category[] {
  const payload = resp?.data;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray((payload as any).items)) return (payload as any).items;
  return [];
}

export async function getCategories(params?: { typeId?: string; typeSlug?: string }): Promise<Category[]> {
  const { data } = await axiosClient.get<CategoryListResponse>("/api/categories/getCategories", { params });
  return normalizeList(data);
}

export async function createCategory(payload: { nombre: string; typeId: string }): Promise<Category> {
  const { data } = await axiosClient.post<CategorySingleResponse>("/api/categories/createCategory", payload);
  if (!data?.data) throw new Error("Respuesta inválida del servidor (sin data)");
  return data.data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data } = await axiosClient.get<CategorySingleResponse>(`/api/categories/getCategory/${id}`);
    return data.data ?? null;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function updateCategory(
  id: string,
  payload: Partial<{ nombre: string; typeId: string }>
): Promise<Category> {
  console.log(1);
  const { data } = await axiosClient.patch<CategorySingleResponse>(`/api/categories/updateCategory/${id}`, payload);
  if (!data?.data) throw new Error("Respuesta inválida del servidor (sin data)");
  return data.data;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { data } = await axiosClient.delete<DeleteEnvelope>(`/api/categories/deleteCategory/${id}`);
  return Boolean(data?.data?.deleted ?? data?.data?.ok);
}

export async function getTypes(): Promise<Type[]> {
  const { data } = await axiosClient.get<ApiResponse<Type[]>>("/api/types/getTypes");
  return data.data ?? [];
}
