import { useEffect, useMemo, useState } from "react";

import { inCountryGroups } from "../common/countryOrder.js";
import { dated } from "../common/dates.js";
import { say } from "./words.js";
import { NameChoice } from "./NameChoice.js";
import { Years } from "./Years.js";
import { idInAddress } from "./api.js";
import "./tournaments.css";
import { Pencil } from "./Pencil.js";
import { TrashCan } from "./TrashCan.js";

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
  // Nothing for a tournament the API has not been rebuilt to know the country
  // of, which no choice of country lists.
  readonly country?: string;
  readonly region?: string;
  // Whether a competition in use counts towards the world rankings.
  readonly worldRankings: boolean;
  readonly part: "manager" | "scorer" | "rankingOfficer";
}

/** What names the countries, their regions and the sports, as the API gives them. */
interface Names {
  readonly countries: readonly {
    readonly code: string;
    readonly name: string;
    readonly regions: readonly {
      readonly code: string;
      readonly name: string;
    }[];
  }[];
  readonly sports: readonly { readonly code: string; readonly name: string }[];
}

/**
 * Which of a world ranking officer's tournaments are listed: those they
 * manage or score, those with a competition counting towards the world
 * rankings, and those with none. A tournament is listed when any one that
 * applies to it is on.
 */
interface Shown {
  readonly managerScorer: boolean;
  readonly worldRanking: boolean;
  readonly notWorldRanking: boolean;
}

/** What the reader chose to narrow the list by, each by its code. */
interface Chosen {
  readonly country: string | undefined;
  readonly region: string | undefined;
  readonly sport: string | undefined;
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

// A tournament's sport is the second part of its address, as 2026/ac/spring-open
// has it.
const sportOf = (tournament: Listed): string =>
  tournament.address.split("/")[1] ?? "";

// Those the officer is there for, and those they run, are on to begin with;
// the rest of the world's tournaments are one press away.
const shownToBegin: Shown = {
  managerScorer: true,
  worldRanking: true,
  notWorldRanking: false,
};

const shownNames = {
  managerScorer: "managerScorer",
  worldRanking: "worldRanking",
  notWorldRanking: "notWorldRanking",
} as const;

// Each written into the address only where it is not as it begins, so that
// the address of an unfiltered list stays as it was.
const shownIn = (search: string): Shown => {
  const query = new URLSearchParams(search);
  const one = (name: keyof Shown): boolean => {
    const given = query.get(name);
    return given === "1" ? true : given === "0" ? false : shownToBegin[name];
  };
  return {
    managerScorer: one("managerScorer"),
    worldRanking: one("worldRanking"),
    notWorldRanking: one("notWorldRanking"),
  };
};

const chosenIn = (search: string): Chosen => {
  const query = new URLSearchParams(search);
  const one = (name: string): string | undefined => {
    const given = query.get(name);
    return given === null || given === "" ? undefined : given;
  };
  return {
    country: one("country"),
    region: one("region"),
    sport: one("sport"),
  };
};

// What is written into the address for `chosen` and `shown`, nothing where
// nothing is.
const searchOf = (chosen: Chosen, shown: Shown): string => {
  const query = new URLSearchParams();
  for (const name of ["country", "region", "sport"] as const) {
    const code = chosen[name];
    if (code !== undefined) query.set(name, code);
  }
  for (const name of Object.values(shownNames)) {
    if (shown[name] !== shownToBegin[name]) {
      query.set(name, shown[name] ? "1" : "0");
    }
  }
  const written = query.toString();
  return written === "" ? "" : `?${written}`;
};

const once = (codes: readonly (string | undefined)[]): string[] => [
  ...new Set(codes.filter((code): code is string => code !== undefined)),
];

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
  // The names of what the filter offers, asked for once. Until they come, or
  // if they never do, a choice is named by its code, which still works.
  const [names, setNames] = useState<Names | undefined>();
  // What is in the address after the year, which is where the choices are
  // kept, so that the back button undoes one.
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    let current = true;
    void Promise.all([
      asked<{ years: number[] }>("/api/site/my/tournament-years"),
      asked<{ tournaments: Listed[] }>(
        `/api/site/my/tournaments?year=${String(year)}`,
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

  useEffect(() => {
    let current = true;
    void asked<Names>("/api/site/tournaments/new").then((answer) => {
      if (current) setNames(answer);
    });
    const moved = (): void => {
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", moved);
    return () => {
      current = false;
      window.removeEventListener("popstate", moved);
    };
  }, []);

  // Only an officer is a reader with tournaments that are not theirs, and
  // only they have more than their own to narrow. Decided from the whole
  // list, so that turning every kind off does not take the toggles away.
  const officer = (listed ?? []).some((each) => each.part === "rankingOfficer");
  // Whether there is a list to narrow: the toggles beside New Tournament and
  // the filter beneath it are drawn for one and for no other.
  const hasList = listed !== undefined && listed.length > 0;
  const shown = shownIn(search);
  const shownList = (listed ?? []).filter(
    (each) =>
      !officer ||
      (shown.managerScorer && each.part !== "rankingOfficer") ||
      (shown.worldRanking && each.worldRankings) ||
      (shown.notWorldRanking && !each.worldRankings),
  );

  // Only what the list in front of the reader holds is offered, so a choice
  // never lists nothing and the filter never says that a tournament the reader
  // cannot see is there. A choice in the address that is not offered is
  // ignored, as is a region where its country is not chosen.
  const offeredCountries = once(shownList.map((each) => each.country));
  const wanted = chosenIn(search);
  const country =
    wanted.country !== undefined && offeredCountries.includes(wanted.country)
      ? wanted.country
      : undefined;
  const offeredRegions =
    country === undefined
      ? []
      : once(
          shownList
            .filter((each) => each.country === country)
            .map((each) => each.region),
        );
  const region =
    wanted.region !== undefined && offeredRegions.includes(wanted.region)
      ? wanted.region
      : undefined;
  const offeredSports = once(shownList.map(sportOf));
  const sport =
    wanted.sport !== undefined && offeredSports.includes(wanted.sport)
      ? wanted.sport
      : undefined;

  const narrowed = shownList.filter(
    (each) =>
      (country === undefined || each.country === country) &&
      (region === undefined || each.region === region) &&
      (sport === undefined || sportOf(each) === sport),
  );

  const choose = (chosen: Chosen, showing: Shown = shown): void => {
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${searchOf(chosen, showing)}`,
    );
    setSearch(window.location.search);
  };

  const countryNamed = (code: string): string =>
    names?.countries.find((each) => each.code === code)?.name ?? code;
  const regionNamed = (code: string): string =>
    names?.countries
      .find((each) => each.code === country)
      ?.regions.find((each) => each.code === code)?.name ?? code;
  const sportNamed = (code: string): string =>
    names?.sports.find((each) => each.code === code)?.name ?? code;

  // The order the website offers its sports in, as the home page's filter
  // does, rather than the order the list happens to meet them in; any the
  // names do not know follow, by code.
  const inSiteOrder = (codes: readonly string[]): string[] => {
    const site = (names?.sports ?? []).map((each) => each.code);
    const place = (code: string): number =>
      site.includes(code) ? site.indexOf(code) : site.length;
    return [...codes].sort(
      (one, other) => place(one) - place(other) || one.localeCompare(other),
    );
  };

  const byName = new Intl.Collator(document.documentElement.lang || "en");
  const sorted = (
    codes: readonly string[],
    named: (code: string) => string,
  ): { readonly code: string; readonly name: string }[] =>
    codes
      .map((code) => ({ code, name: named(code) }))
      .sort((one, other) => byName.compare(one.name, other.name));

  // One list to choose from, labelled by a label of its own rather than one
  // wrapped round it, which would name the list by what it has chosen as well.
  const choice = (
    field: "country" | "region" | "sport",
    label: string,
    any: string,
    from: readonly { readonly code: string; readonly name: string }[],
    chosen: string | undefined,
    changed: (code: string | undefined) => void,
  ): React.JSX.Element => (
    <span className="tournament-filter-field" key={field}>
      <label htmlFor={`filter-${field}`}>{label}</label>
      <NameChoice
        id={`filter-${field}`}
        name={field}
        placeholder={any}
        choices={from}
        value={chosen ?? ""}
        refusing={false}
        // A region is narrowed by words as often as chosen; a country and a
        // sport are chosen, and what names neither is not left in the box.
        mustChoose={
          field === "country"
            ? say("CreateTournament.NoSuchCountry")
            : field === "sport"
              ? say("Sport.Unknown")
              : undefined
        }
        onChange={(code) => {
          // Words that name nothing choose nothing, and a choice that is
          // already none is not made again, which would put a step in the
          // browser's history for every letter typed.
          if ((code === "" ? undefined : code) !== chosen) {
            changed(code === "" ? undefined : code);
          }
        }}
      />
    </span>
  );

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
        `/api/site/tournaments/${idInAddress(tournament.id)}/${action}`,
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
            <a
              key="players"
              className="button"
              href={at}
              title={say("admin.hover.tournaments.players")}
            >
              {say("admin.tournaments.players")}
            </a>,
          ];
    }
    if (tournament.part === "scorer") {
      return tournament.archived
        ? []
        : [
            <a
              key="scores"
              className="button"
              href={at}
              title={say("admin.hover.tournaments.scores")}
            >
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
          title={say("admin.hover.tournaments.restore")}
          onClick={() => void act(tournament, "restore")}
        >
          {say("admin.tournaments.restore")}
        </button>,
      ];
    }
    return [
      <a
        key="manage"
        className="button"
        href={at}
        title={say("admin.hover.tournaments.manage")}
      >
        {say("admin.tournaments.manage")}
      </a>,
      <a
        key="edit"
        className="button"
        href={`${at}/edit`}
        title={say("admin.hover.tournaments.edit")}
        aria-label={say("admin.tournaments.edit")}
      >
        <Pencil />
      </a>,
      <button
        key="archive"
        type="button"
        className="button"
        title={say("admin.hover.tournaments.archive")}
        aria-label={say("admin.tournaments.archive")}
        onClick={() => void act(tournament, "archive")}
      >
        <TrashCan />
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
            <div className="tournaments-bar">
              <a
                className="button"
                href="/admin/tournaments/new"
                title={say("admin.hover.tournaments.new")}
              >
                {say("admin.tournaments.new")}
              </a>
              {officer && hasList ? (
                <span
                  className="tournaments-toggles"
                  role="group"
                  aria-label={say("admin.tournaments.show")}
                >
                  {Object.values(shownNames).map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="button tournament-filter-toggle"
                      aria-pressed={shown[name]}
                      onClick={() => {
                        choose(
                          { country, region, sport },
                          { ...shown, [name]: !shown[name] },
                        );
                      }}
                    >
                      <span
                        className="tournament-toggle-tick"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {say(`admin.tournaments.${name}`)}
                    </button>
                  ))}
                </span>
              ) : null}
            </div>
            {hasList ? (
              <form
                className="tournament-filter"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                {choice(
                  "country",
                  say("tournamentList.filter.country"),
                  say("tournamentList.filter.anyCountry"),
                  inCountryGroups(
                    offeredCountries.map((code) => ({
                      code,
                      name: countryNamed(code),
                    })),
                    document.documentElement.lang || "en",
                  ).flat(),
                  country,
                  // The region belongs to the country, so another country
                  // chosen leaves none.
                  (code) => {
                    choose({ country: code, region: undefined, sport });
                  },
                )}
                {country === undefined || offeredRegions.length === 0
                  ? null
                  : choice(
                      "region",
                      say("tournamentList.filter.region"),
                      say("tournamentList.filter.anyRegion"),
                      sorted(offeredRegions, regionNamed),
                      region,
                      (code) => {
                        choose({ country, region: code, sport });
                      },
                    )}
                {choice(
                  "sport",
                  say("tournamentList.filter.sport"),
                  say("tournamentList.filter.anySport"),
                  inSiteOrder(offeredSports).map((code) => ({
                    code,
                    name: sportNamed(code),
                  })),
                  sport,
                  (code) => {
                    choose({ country, region, sport: code });
                  },
                )}
              </form>
            ) : null}
            {listed === undefined ? null : listed.length === 0 ? (
              <p className="tournaments-none">
                {say("admin.tournaments.none")}
              </p>
            ) : narrowed.length === 0 ? (
              <p className="tournaments-none" data-unmatched="">
                {say("admin.tournaments.filter.none")}
              </p>
            ) : (
              <ul className="tournaments">
                {narrowed.map((tournament) => (
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
