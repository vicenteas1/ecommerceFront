export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  type: string;
  category: string;
  fech_creacion?: string;
  fech_modif?: string;
}


export interface ProductResponse {
  code: number;
  message: string;
  data: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
  };
}

export type TypeItem = { 
  _id: string;
  nombre: string;
  slug: string
};
