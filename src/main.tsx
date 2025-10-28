import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes/routes.component";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./main.scss";
import ErrorBoundary from "./components/error-boundary/error-boundary.component";
import { Provider } from "react-redux";
import { store } from "./store";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY as string, { locale: "es-CL" });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
