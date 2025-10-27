import type {
  Type,
  TypeListResponse,
  TypeSingleResponse,
  DeleteEnvelope,
} from "../../models/services/type/types.model.js";
import { axiosClient } from "../../utils/interceptor/interceptor";

function isTypeArray(x: unknown): x is Type[] {
  return Array.isArray(x);
}
function hasItems(x: unknown): x is { items: Type[] } {
  return typeof x === "object" && x !== null && Array.isArray((x as any).items);
}

function normalizeList(resp: TypeListResponse): Type[] {
  const payload = resp?.data;
  if (!payload) return [];
  if (isTypeArray(payload)) return payload;
  if (hasItems(payload)) return payload.items;
  return [];
}

function unwrapOne<T>(resp: { data: T | null } | undefined): T | null {
  return resp?.data ?? null;
}


export async function getTypes(): Promise<Type[]> {
  const { data } = await axiosClient.get<TypeListResponse>("/api/types/getTypes");
  return normalizeList(data);
}

export async function createType(payload: { nombre: string }): Promise<Type> {
  const { data } = await axiosClient.post<TypeSingleResponse>("/api/types/createType", payload);
  const item = unwrapOne<Type>(data);
  if (!item) throw new Error("Respuesta inválida del servidor (sin data)");
  return item;
}

export async function getTypeById(id: string): Promise<Type | null> {
  try {
    const { data } = await axiosClient.get<TypeSingleResponse>(`/api/types/getType/${id}`);
    return unwrapOne<Type>(data) ?? null;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}

export async function updateType(id: string, payload: { nombre: string }): Promise<Type> {
  const { data } = await axiosClient.patch<TypeSingleResponse>(`/api/types/updateType/${id}`, payload);
  const item = unwrapOne<Type>(data);
  if (!item) throw new Error("Respuesta inválida del servidor (sin data)");
  return item;
}

export async function deleteType(id: string): Promise<boolean> {
  const { data } = await axiosClient.delete<DeleteEnvelope>(`/api/types/deleteType/${id}`);
  return !!data?.data?.deleted;
}
