import type { ApiResponse } from "../../apiResponse/apiResponse.model";

export interface Type {
  id: string;
  nombre: string;
  slug: string;
  fech_creacion?: string;
  fech_modif?: string;
  createdBy?: string;
  updatedBy?: string;
}

type TypesListData = Type[] | { items: Type[] };

export type TypeListResponse   = ApiResponse<TypesListData>;
export type TypeSingleResponse = ApiResponse<Type>;
export type DeleteEnvelope     = ApiResponse<{ deleted: boolean }>;
