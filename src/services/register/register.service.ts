import { environment } from "../../config/environment/environment";
import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type { INewUser } from "../../models/services/register/register.model";

const registerApi = `${environment.register.url}/api/users/createUser`;

export async function create(newUserData: INewUser): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(registerApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });

    const json: ApiResponse<any> = await res.json();

    if (!res.ok) {
      return {
        code: json.code ?? res.status,
        message: json.message ?? "Error en la creacion del usuario",
        data: null,
      };
    }

    return {
      code: json.code ?? 200,
      message: json.message ?? "OK",
      data: json.data ?? null,
    };
  } catch (err: any) {
    return { code: 500, message: err?.message ?? "Error de red", data: null };
  }
}
