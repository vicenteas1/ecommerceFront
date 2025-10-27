import type { ApiResponse } from "../../apiResponse/apiResponse.model";

export interface TypeRef {
  id: string;
  nombre: string;
  slug?: string;
}

export interface Category {
  id: string;
  nombre: string;
  slug?: string;
  type: TypeRef | string;
  fech_creacion?: string;
  fech_modif?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type CategoryItem = {
  _id: string;
  nombre: string;
  slug: string;
  type: { _id: string; nombre: string; slug: string } | string;
};


type CategoryListData = Category[] | { items: Category[] };


export type CategoryListResponse   = ApiResponse<CategoryListData>;
export type CategorySingleResponse = ApiResponse<Category>;
export type DeleteEnvelope         = ApiResponse<{ ok?: boolean; deleted?: boolean }>;
