export type MPItem = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
};

export type MPPayer = {
  email?: string;
  name?: string;
  surname?: string;
};

export type CreatePreferenceResponse = {
  id: string;
  init_point: string;
  payment?: unknown;
};

export type PaymentRecord = {
  id: string;
  preferenceId?: string;
  paymentId?: string;
  status?: string;
  amount?: number;
  currency_id?: string;
  payerEmail?: string;
  fech_creacion?: string;
  fech_modif?: string;
};

export type ListPaymentsResult = {
  items: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
