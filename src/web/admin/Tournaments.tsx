import { useEffect, useMemo, useState } from "react";

import { dated } from "../common/dates.js";
import { say } from "./words.js";
import { Years } from "./Years.js";
import "./tournaments.css";
import { idInAddress } from "./api.js";

// The admin's front door: the tournaments the reader manages or scores on this
// website, one year at a time, and what they can do with each. The months are
// in the page's language as its words are, since the browser names them.

/** A tournament as the API lists it. */
interface Listed {
  readonly id: string;
  readonly name: string;
  readonly starts: string;
  readonly finishes: string;
  readonly address: string;
  readonly archived: boolean;
  readonly part: "manager" | "scorer" | "rankingOfficer";
}

interface Props {
  readonly year: number;
  readonly go: (to: string) => void;
}

// Nothing, where the API could not be asked, which is shown as nothing rather
// than as a year with no tournaments in it: that would be saying something
// that nobody knows.
const asked = async <T,>(url: string): Promise<T | undefined> => {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
    });
    return response.ok ? ((await response.json()) as T) : undefined;
  } catch {
    return undefined;
  }
};

// The year by the reader's own clock, since that is the year they are after.
const thisYear = (): number => new Date().getFullYear();

// Every year the reader has a tournament in, and this year whether or not they
// have one in it, since this year is where the list starts. The newest first.
const offered = (years: readonly number[]): readonly number[] =>
  [...new Set([...years, thisYear()])].sort((one, other) => other - one);

export const Tournaments = ({ year, go }: Props): React.JSX.Element => {
  const [years, setYears] = useState<readonly number[]>([]);
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // Counted up to ask again, once something has been archived or restored.
  const [asking, setAsking] = useState(0);
  // What the list on the page was the answer to, and whether something the
  // reader pressed is still being done. Until the list is the answer to what
  // is being asked now, the panel says it is busy, for a reader who cannot see
  // it change: the list on the page is the last year's until then.
  const [answered, setAnswered] = useState<string | undefined>();
  const [acting, setActing] = useState(false);
  const question = `${String(year)} ${String(asking)}`;

  useEffect(() => {
    let current = true;
    void Promise.all([
      asked<{ years: number[] }>("/api/v1/my/tournament-years"),
      asked<{ tournaments: Listed[] }>(
        `/api/v1/my/tournaments?year=${String(year)}`,
      ),
    ]).then(([yearsAnswer, tournamentsAnswer]) => {
      if (!current) return;
      setYears(yearsAnswer?.years ?? []);
      setListed(tournamentsAnswer?.tournaments);
      setAnswered(question);
    });
    return () => {
      current = false;
    };
  }, [year, question]);

  // The same list until the years change, since the bar measures itself again
  // whenever it is handed a different one.
  const offering = useMemo(() => offered(years), [years]);

  const language = document.documentElement.lang || "en";

  // Neither asks to be confirmed: each is undone by the other in one press,
  // and a question before something that can be put back is a question the
  // reader learns to press through.
  const act = async (
    tournament: Listed,
    action: "archive" | "restore",
  ): Promise<void> => {
    setActing(true);
    // Asked again whether or not it was done, since the list is to say what
    // the tournament is now rather than what the reader pressed.
    try {
      await fetch(
        `/api/v1/tournaments/${idInAddress(tournament.id)}/${action}`,
        { method: "POST" },
      );
    } catch {
      // A request that never arrived is said by the list asked for again
      // below, which still shows the tournament as it is.
    } finally {
      setAsking((count) => count + 1);
      setActing(false);
    }
  };

  const options = (tournament: Listed): React.JSX.Element[] => {
    const at = `/admin/${tournament.address}`;
    // A world ranking officer's, whose players' world ranking names it looks
    // after, offers those players, on the tournament's page.
    if (tournament.part === "rankingOfficer") {
      return tournament.archived
        ? []
        : [
            <a key="players" className="button" href={at}>
              {say("admin.tournaments.players")}
            </a>,
          ];
    }
    if (tournament.part === "scorer") {
      return tournament.archived
        ? []
        : [
            <a key="scores" className="button" href={at}>
              {say("admin.tournaments.scores")}
            </a>,
          ];
    }
    if (tournament.archived) {
      return [
        <button
          key="restore"
          type="button"
          className="button"
          onClick={() => void act(tournament, "restore")}
        >
          {say("admin.tournaments.restore")}
        </button>,
      ];
    }
    return [
      <a key="manage" className="button" href={at}>
        {say("admin.tournaments.manage")}
      </a>,
      <a key="edit" className="button" href={`${at}/edit`}>
        {say("admin.tournaments.edit")}
      </a>,
      <button
        key="archive"
        type="button"
        className="button"
        onClick={() => void act(tournament, "archive")}
      >
        {say("admin.tournaments.archive")}
      </button>,
    ];
  };

  return (
    <>
      <Years
        years={offering}
        chosen={year}
        choose={(chosen) => {
          go(`/admin/${String(chosen)}`);
        }}
      />
      <main id="content">
        <div className="page">
          <div
            className="panel stack"
            aria-busy={acting || answered !== question}
          >
            {/* Above the list rather than beneath it, where a long one would
                push it off a phone's screen. Offered to every reader, since
                anybody signed in can create a tournament and manage it. */}
            <p>
              <a className="button" href="/admin/tournaments/new">
                {say("admin.tournaments.new")}
              </a>
            </p>
            {listed === undefined ? null : listed.length === 0 ? (
              <p className="tournaments-none">
                {say("admin.tournaments.none")}
              </p>
            ) : (
              <ul className="tournaments">
                {listed.map((tournament) => (
                  <li
                    key={tournament.id}
                    className="tournament"
                    data-archived={tournament.archived ? "" : undefined}
                  >
                    <span className="tournament-dates">
                      {dated(tournament.starts, tournament.finishes, language)}
                    </span>
                    <a
                      className="tournament-name"
                      href={`/admin/${tournament.address}`}
                    >
                      {tournament.name}
                    </a>
                    {/* A line through a name is not read out, so an archived
                        tournament says so in words as well. */}
                    {tournament.archived ? (
                      <span className="visually-hidden">
                        {say("admin.tournaments.archived")}
                      </span>
                    ) : null}
                    <span className="tournament-options">
                      {options(tournament)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
