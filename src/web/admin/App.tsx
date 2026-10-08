import { useEffect, useState } from "react";

import { Accounts } from "./administrator/accounts/accounts.js";
import { AdministratorSections } from "./administrator/AdministratorSections.js";
import { ImportError } from "./administrator/import-errors/importError.js";
import { ImportErrors } from "./administrator/import-errors/importErrors.js";
import { ImportWorldRankingPlayers } from "./administrator/import-world-ranking-players/importWorldRankingPlayers.js";
import { NewTournament } from "./tournaments/new/new.js";
import { EditTournament } from "./{year}/{sport}/{slug}/edit/edit.js";
import { ViewCompetition } from "./{year}/{sport}/{slug}/competitions/{competition-slug}/view/view.js";
import { ViewTournament } from "./{year}/{sport}/{slug}/view/view.js";
import { ViewTeam } from "./{year}/{sport}/{slug}/teams/{team-slug}/view/view.js";
import { ViewTest } from "./{year}/{sport}/{slug}/tests/{test-slug}/view/view.js";
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

  // The administrator's pages, under their own section bar. Only an
  // administrator is sent the admin's page at one of their addresses
  // (administrator.feature), but a reader already in the admin can reach one
  // in place, without the server being asked. Nothing here asks again: what
  // these pages show is asked of the API, which refuses anybody who is not an
  // administrator, and the page says so (accounts.feature); what is drawn
  // before that is headings, which are no secret, being in the admin's
  // script for every reader. A page beneath the accounts that is not there
  // yet still marks Accounts, since it is one of theirs. The page where the
  // world ranking players are imported is the one address it is found at. The
  // documents the import refused are listed at theirs, and each is a page
  // beneath it, named by its id as one segment, which is why the address keeps
  // its %2F rather than reading it as a slash.
  const administrator =
    /^\/admin\/administrator(\/accounts|\/import-world-ranking-players|\/import-errors)?(\/.*)?$/.exec(
      path,
    );
  if (administrator !== null) {
    const onAccounts = administrator[1] === "/accounts";
    const theAccountsPage = onAccounts && (administrator[2] ?? "/") === "/";
    const theImportPage =
      administrator[1] === "/import-world-ranking-players" &&
      (administrator[2] ?? "/") === "/";
    const onImportErrors = administrator[1] === "/import-errors";
    const theImportErrorsPage =
      onImportErrors && (administrator[2] ?? "/") === "/";
    const importErrorOf = onImportErrors
      ? /^\/([^/]+)\/?$/.exec(administrator[2] ?? "")?.[1]
      : undefined;
    return (
      <>
        <AdministratorSections
          reading={
            onAccounts
              ? "accounts"
              : theImportPage
                ? "world-rankings"
                : onImportErrors
                  ? "import-errors"
                  : undefined
          }
        />
        <main id="content">
          <div className="page">
            <div className="panel stack">
              {theAccountsPage ? (
                <Accounts />
              ) : theImportPage ? (
                <ImportWorldRankingPlayers />
              ) : theImportErrorsPage ? (
                <ImportErrors />
              ) : importErrorOf !== undefined ? (
                <ImportError
                  key={importErrorOf}
                  document={decodeURIComponent(importErrorOf)}
                />
              ) : (
                <h1>{say("admin.administrator.title")}</h1>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

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

  // A team's or a test's address beneath its tournament's, as
  // /admin/2026/ac/spring-tests/teams/aus or .../tests/aus-v-eng, is its page.
  const beneath =
    /^\/admin\/([1-9]\d{3}\/[^/]+\/[^/]+)\/(teams|tests)\/([^/]+)\/?$/.exec(
      path,
    );
  if (beneath?.[1] !== undefined && beneath[3] !== undefined) {
    return beneath[2] === "teams" ? (
      <ViewTeam key={path} address={beneath[1]} slug={beneath[3]} />
    ) : (
      <ViewTest key={path} address={beneath[1]} slug={beneath[3]} />
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
