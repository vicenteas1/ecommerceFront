import axios from "axios";
import { environment } from "../../config/environment/environment";

const baseURL = environment.api?.url || import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    if (status === 401 && !path.startsWith("/admin")) {
      localStorage.removeItem("token");
      window.location.href = "/home";
    }
    return Promise.reject(error);
  }
);

