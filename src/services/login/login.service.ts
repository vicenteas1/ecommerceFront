import { environment } from "../../config/environment/environment";
import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type { ILogin, LoginResult } from "../../models/services/login/login.model";

const loginApi = `${environment.login.url}/api/users/login`;

export async function login(loginData: ILogin): Promise<ApiResponse<LoginResult>> {
  try {
    const res = await fetch(loginApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const json: ApiResponse<LoginResult> = await res.json();

    if (!res.ok) {
      return {
        code: json.code ?? res.status,
        message: json.message ?? "Error en login",
        data: null,
      };
    }

    if (json.data?.accessToken) {
      localStorage.setItem("token", json.data.accessToken);
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
