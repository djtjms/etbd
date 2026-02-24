import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Remove initial loader before React renders
const loader = document.getElementById("initial-loader");
if (loader) loader.remove();

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
