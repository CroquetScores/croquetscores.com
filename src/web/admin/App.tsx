import { useEffect, useState } from "react";

import { NewTournament } from "./tournaments/new/new.js";
import { EditTournament } from "./{year}/{sport}/{slug}/edit/edit.js";
import { ViewCompetition } from "./{year}/{sport}/{slug}/competitions/{competition-slug}/view/view.js";
import { ViewTournament } from "./{year}/{sport}/{slug}/view/view.js";
import { go, here, inPlace } from "./navigation.js";
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
    const moved = (): void => {
      setPath(window.location.pathname);
    };
    // Every link to one of the admin's pages, caught once here rather than on
    // each link, so that one added later cannot forget to be. The header's
    // are among them, and are not the admin's to draw, so the document is
    // listened to rather than the admin's own part of it.
    const clicked = (event: MouseEvent): void => {
      const to = inPlace(event);
      if (to === undefined) return;
      event.preventDefault();
      go(to);
    };
    window.addEventListener("popstate", moved);
    document.addEventListener("click", clicked);
    return () => {
      window.removeEventListener("popstate", moved);
      document.removeEventListener("click", clicked);
    };
  }, []);

  // The footer's choices of theme and language bring the reader back to the
  // address the server sent the page for, which it said into them then. It is
  // kept to the address the reader has moved to since.
  useEffect(() => {
    for (const going of document.querySelectorAll<HTMLInputElement>(
      'footer input[name="return"]',
    )) {
      going.value = here();
    }
  }, [path]);

  // Each page below is keyed by its address, so that moving from one page to
  // another of the same kind, as from one competition to the next, draws the
  // page afresh as loading it did, rather than showing the one left while the
  // one asked for is fetched.
  if (/^\/admin\/tournaments\/new\/?$/.test(path)) {
    return <NewTournament key={path} />;
  }

  // A tournament's address and then edit, as /admin/2026/ac/spring-open/edit.
  const editing = /^\/admin\/([1-9]\d{3}\/[^/]+\/[^/]+)\/edit\/?$/.exec(
    path,
  )?.[1];
  if (editing !== undefined) {
    return <EditTournament key={path} address={editing} />;
  }

  // A competition's address beneath its tournament's, as
  // /admin/2026/ac/spring-open/competitions/block-a, is its page.
  const competition =
    /^\/admin\/([1-9]\d{3}\/[^/]+\/[^/]+)\/competitions\/([^/]+)\/?$/.exec(
      path,
    );
  if (competition?.[1] !== undefined && competition[2] !== undefined) {
    return (
      <ViewCompetition
        key={path}
        address={competition[1]}
        slug={competition[2]}
      />
    );
  }

  // A tournament's own address, as /admin/2026/ac/spring-open, is its page.
  const viewing = /^\/admin\/([1-9]\d{3}\/[^/]+\/[^/]+)\/?$/.exec(path)?.[1];
  if (viewing !== undefined) {
    return <ViewTournament key={path} address={viewing} />;
  }

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
