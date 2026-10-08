import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// The same file the public pages link. Vite bundles and hashes it as it does
// everything else here, so the two halves of the site cannot drift apart.
//
// Imported ahead of App, because Vite lays stylesheets out in the order they
// are imported, and the admin's own stylesheets must come after this one to
// win a tie: behind it, a field's label at rest (.field-box .field-label) beat
// the label lifted onto the border (.field-box-lifted .field-label), and every
// drop-down list's label lay over the choice it showed.
import "../../../assets/site.css";
import { App } from "./App.js";
import { NewerBuild, watchForANewerBuild } from "./newerBuild.js";

const container = document.getElementById("root");
if (container === null) throw new Error("The admin SPA has no mount point.");

watchForANewerBuild();

createRoot(container).render(
  <StrictMode>
    <App />
    <NewerBuild />
  </StrictMode>,
);
