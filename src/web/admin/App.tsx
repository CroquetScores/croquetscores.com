import { useEffect, useState } from "react";

// What the site is called, which the server says into the page as it sends it
// (adminPage.ts), since a page built ahead of time cannot know. The admin's own
// development server has no server behind the page to say it, so there the bar
// falls back to the tab's title rather than to a name spelled out here.
const siteName =
  document.querySelector<HTMLMetaElement>('meta[name="application-name"]')
    ?.content ?? document.title;

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

  return (
    <>
      <header className="site-header">
        <div className="page">
          <a className="site-name" href="/admin/">
            {siteName}
          </a>
          <nav className="menu-links" aria-label="Primary">
            <ul>
              <li>
                <a href="/">Public site</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="content">
        <div className="page stack stack-loose">
          <h1>Admin</h1>
          <p className="lead">API: {status}</p>
        </div>
      </main>
    </>
  );
};
