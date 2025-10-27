import { axiosClient } from "../../utils/interceptor/interceptor";

export type Item = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  type?: string | { _id?: string; nombre?: string };
  category?: string | { _id?: string; nombre?: string };
  fech_creacion?: string;
  fech_modif?: string;
  createdBy?: string;
  updatedBy?: string;
};


export type ItemListPayload = {
  items: Item[];
  total: number;
  page: number;
  limit: number;
};

export type ItemResponse = {
  data: {
    items: Item[];
    total: number;
    page: number;
    limit: number;
  };
};

export async function getItems(): Promise<Item[]> {
  const { data } = await axiosClient.get<ItemResponse>("/api/items/getItems");
  return data.data?.items ?? [];
}

export async function createItem(item: {
  nombre: string;
  descripcion: string;
  precio: number;
  type: string;
  category: string;
}): Promise<Item> {
  const { data } = await axiosClient.post<{ data: Item }>(
    "/api/items/createItem",
    item
  );
  return data.data;
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const { data } = await axiosClient.get<{ data: Item }>(`/api/items/getItem/${id}`);
    return data.data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function updateItem(
  id: string,
  update: Partial<Pick<Item, "nombre" | "descripcion" | "precio" | "type" | "category">>
): Promise<Item> {
  const { data } = await axiosClient.patch<{ data: Item }>(
    `/api/items/updateItem/${id}`,
    update
  );
  return data.data;
}

export async function deleteItem(id: string): Promise<boolean> {
  const { data } = await axiosClient.delete<{ data: { deleted: boolean } }>(
    `/api/items/deleteItem/${id}`
  );
  return !!data.data?.deleted;
}

export async function getItemCategories(): Promise<string[]> {
  const { data } = await axiosClient.get<{ data: string[] }>("/api/items/categories");
  return data.data ?? [];
}

export async function getItemTypes(): Promise<string[]> {
  const { data } = await axiosClient.get<{ data: string[] }>("/api/items/types");
  return data.data ?? [];
}

export async function getItemsFiltered(params: {
  q?: string;
  type?: string; 
  category?: string;
  page?: number;
  limit?: number;
}): Promise<ItemListPayload> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.type) qs.set("type", params.type);
  if (params.category) qs.set("category", params.category);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const { data } = await axiosClient.get<{ data: ItemListPayload }>(
    `/api/items/getItems${qs.toString() ? `?${qs.toString()}` : ""}`
  );
  return data.data;
}
