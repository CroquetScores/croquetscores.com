import { useEffect, useState } from "react";

// The shell. Screens arrive with the features that specify them; what this
// proves for now is that the SPA is built, served under /admin, reaches the API
// it shares with the mobile apps, and speaks the same vocabulary as the public
// pages.
export const App = (): React.JSX.Element => {
  const [status, setStatus] = useState("checking…");

  useEffect(() => {
    fetch("/api/v1/health")
      .then(async (response) => {
        const body: unknown = await response.json();
        setStatus(
          typeof body === "object" && body !== null && "status" in body
            ? String(body.status)
            : "unrecognised",
        );
      })
      .catch(() => {
        setStatus("unreachable");
      });
  }, []);

  // What goes between the public pages' header and footer, which the server
  // says in around the mount point (adminPage.ts). Set in the panel every
  // public page's content is set in. Its words are the admin's own, and in no
  // catalogue yet.
  return (
    <main id="content">
      <div className="page">
        <div className="panel stack">
          <h1>Admin</h1>
          <p className="lead">API: {status}</p>
        </div>
      </div>
    </main>
  );
};
