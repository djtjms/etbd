import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Remove initial loader after React has painted
requestAnimationFrame(() => {
  const initialLoader = document.getElementById("initial-loader");
  if (initialLoader) {
    initialLoader.remove();
  }
});
