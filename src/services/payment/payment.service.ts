import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type { CreatePreferenceResponse, ListPaymentsResult, MPItem, MPPayer, PaymentRecord } from "../../models/services/payment/payment.model";
import { axiosClient } from "../../utils/interceptor/interceptor";

export async function createMpPreference(
  items: MPItem[],
  payer?: MPPayer
): Promise<CreatePreferenceResponse> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No hay items para procesar el pago.");
  }

  const { data } = await axiosClient.post<ApiResponse<CreatePreferenceResponse>>(
    "/api/payments/create-preference",
    { items, payer }
  );

  if (!data?.data?.id || !data?.data?.init_point) {
    throw new Error(data?.message || "No se pudo crear la preferencia de pago.");
  }

  return data.data;
}

export async function listPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  user?: string;
}): Promise<ListPaymentsResult> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  if (params?.user) qs.set("user", params.user);

  const { data } = await axiosClient.get<ApiResponse<ListPaymentsResult>>(
    `/api/payments${qs.toString() ? `?${qs.toString()}` : ""}`
  );

  if (!data?.data) {
    throw new Error(data?.message || "No se pudo obtener la lista de pagos.");
  }
  return data.data;
}

export async function getPaymentById(id: string): Promise<PaymentRecord | null> {
  const { data } = await axiosClient.get<ApiResponse<PaymentRecord>>(`/api/payments/${id}`);
  return (data?.data as PaymentRecord) ?? null;
}

export async function updatePayment(
  id: string,
  payload: Partial<PaymentRecord>
): Promise<PaymentRecord> {
  const { data } = await axiosClient.patch<ApiResponse<PaymentRecord>>(`/api/payments/${id}`, payload);
  if (!data?.data) {
    throw new Error(data?.message || "No se pudo actualizar el pago.");
  }
  return data.data;
}
