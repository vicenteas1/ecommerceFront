export const environment = {
  environment: {
    production: false,
    development: true,
    certification: false,
  },
  api: {
    url: import.meta.env.VITE_API_URL || "https://ecommerceback-6n3o.onrender.com",
  },
  login: {
    url:
      import.meta.env.VITE_LOGIN_API_URL || "https://nominatim.openstreetmap.org",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
  register: {
    url:
      import.meta.env.VITE_REGISTER_API_URL || "https://nominatim.openstreetmap.org",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
  navbar: {
    url:
      import.meta.env.VITE_NAVBAR_API_URL || "https://nominatim.openstreetmap.org",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
  product: {
    url:
      import.meta.env.VITE_NAVBAR_API_URL || "https://nominatim.openstreetmap.org",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
};
