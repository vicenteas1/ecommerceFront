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
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
