import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Remove initial loader robustly
function removeLoader() {
  const loader = document.getElementById("initial-loader");
  if (loader) loader.remove();
}

removeLoader();
// Double-check after microtask in case of race
queueMicrotask(removeLoader);

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
