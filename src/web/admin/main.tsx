import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

// The same file the public pages link. Vite bundles and hashes it as it does
// everything else here, so the two halves of the site cannot drift apart.
import "../../../assets/site.css";

const container = document.getElementById("root");
if (container === null) throw new Error("The admin SPA has no mount point.");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
