import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type { ListPaymentsResult, PaymentRecord } from "../../models/services/payment/payment.model";
import { axiosClient } from "../../utils/interceptor/interceptor";

type CreatePreferenceResult = { id: string; payment?: unknown };
export async function createMpPreference(
  items: Array<{ title: string; quantity: number; unit_price: number }>,
  payer?: { email?: string; name?: string; surname?: string }
): Promise<CreatePreferenceResult> {
  const { data } = await axiosClient.post("/api/payments/create-preference", { items, payer });
  const id = data?.data?.id as string | undefined;
  if (!id) throw new Error(data?.message || "No se pudo crear la preferencia.");
  return { id, payment: data?.data?.payment };
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
