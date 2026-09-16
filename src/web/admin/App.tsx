import { useEffect, useState } from "react";

// The shell. Screens arrive with the features that specify them; what this
// proves for now is that the SPA is built, served under /admin, and can reach
// the API it shares with the mobile apps.
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

  return (
    <main>
      <h1>Croquet Scores — Admin</h1>
      <p>API: {status}</p>
    </main>
  );
};
