import { environment } from "../../config/environment/environment";
import type { NavItem } from "../../models/components/navbar/NavItem.model";

export interface NavResponse {
  role: string;
  isAuthenticated: boolean;
  items: NavItem[];
}

export async function getNavbar(): Promise<NavResponse> {
  const baseUrl = environment.login.url.replace(/\/$/, "");
  const url = `${baseUrl}/api/navbar/menu`;

  const token = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  const response = await res.json();
  return response.data as NavResponse;
}
