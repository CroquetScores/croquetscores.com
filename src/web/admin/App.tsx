import { useEffect, useState } from "react";

import { NewTournament } from "./tournaments/new/new.js";
import { EditTournament } from "./{year}/{sport}/{slug}/edit/edit.js";
import { Tournaments } from "./Tournaments.js";
import { say } from "./words.js";

// What goes between the public pages' header and footer, which the server
// says in around the mount point (adminPage.ts). Which screen that is is read
// off the address, so that every screen can be linked to and the browser's
// back button goes back through them.

// /admin/ is this year's tournaments, and /admin/2025 another year's. A year
// is written as an address writes one: four digits, the first not a nought.
const yearIn = (path: string): number | "this year" | undefined => {
  if (/^\/admin\/?$/.test(path)) return "this year";
  const year = /^\/admin\/([1-9]\d{3})\/?$/.exec(path)?.[1];
  return year === undefined ? undefined : Number(year);
};

export const App = (): React.JSX.Element => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const back = (): void => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", back);
    return () => {
      window.removeEventListener("popstate", back);
    };
  }, []);

  const go = (to: string): void => {
    window.history.pushState(null, "", to);
    setPath(to);
  };

  if (/^\/admin\/tournaments\/new\/?$/.test(path)) return <NewTournament />;

  // A tournament's address and then edit, as /admin/2026/ac/spring-open/edit.
  const editing = /^\/admin\/([1-9]\d{3}\/[^/]+\/[^/]+)\/edit\/?$/.exec(
    path,
  )?.[1];
  if (editing !== undefined) return <EditTournament address={editing} />;

  const year = yearIn(path);
  if (year !== undefined) {
    return (
      <Tournaments
        year={year === "this year" ? new Date().getFullYear() : year}
        go={go}
      />
    );
  }

  // A tournament's own screens arrive with the features that specify them.
  // Set in the panel every public page's content is set in.
  return (
    <main id="content">
      <div className="page">
        <div className="panel stack">
          <h1>{say("admin.title")}</h1>
        </div>
      </div>
    </main>
  );
};
