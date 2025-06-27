import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import { ThemeProvider } from "./context/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => (window.location.href = "/")}
      >
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
