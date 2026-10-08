import { useEffect, useState } from "react";

import { say } from "../../../words.js";
import "./tournamentSections.css";
import { idInAddress } from "../../../api.js";

// The section bar of a tournament's page and its competitions' pages
// (TournamentSections.feature): Tournament first, then each competition in
// use, in the tournament's order, the page being read marked. An archived
// competition is left out, since its page refuses to open. A tournament played
// by teams has tests where a Standard one has competitions, and a test is one
// of its competitions, found under "tests" rather than "competitions". On a
// team's page the bar is Tournament and then each team in use in place of the
// tests, by its short name, since a manager there is moving between the
// teams; the team being read is marked.
//
// Its links are plain links, which the admin follows in place as it does
// every link to one of its pages (App.tsx).

interface Props {
  /** The tournament's id, as the API names it. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /**
   * The page being read: the tournament's, or a competition's or a team's by
   * its slug.
   */
  readonly reading:
    "tournament" | { readonly competition: string } | { readonly team: string };
}

/** A competition as the API lists it, with as much as the bar needs. */
interface Listed {
  readonly name: string;
  readonly slug: string;
  readonly kind: string;
  readonly archived: boolean;
}

/** A team as the API lists it, with as much as the bar needs. */
interface Team {
  readonly shortName: string;
  readonly slug: string;
  readonly archived: boolean;
}

/**
 * The bar's room, one row of tabs tall and empty, while what goes in it is
 * still being asked for. Without it the bar arrived after the page beneath it
 * and pushed the page down, which read as the page being loaded again. It is
 * not a nav, so that nothing mistakes it for the bar itself, and it is hidden
 * from a screen reader, which has nothing in it to read.
 */
export const HeldSections = (): React.JSX.Element => (
  <div className="site-sections site-sections-held" aria-hidden="true">
    <div className="page">
      <ul>
        <li>
          <span>{" "}</span>
        </li>
      </ul>
    </div>
  </div>
);

export const TournamentSections = ({
  tournament,
  address,
  reading,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<
    | {
        readonly competitions: readonly Listed[];
        readonly teams: readonly Team[];
      }
    | undefined
  >();
  const onATeam = typeof reading === "object" && "team" in reading;

  useEffect(() => {
    let current = true;
    const asked = async <T,>(path: string, empty: T): Promise<T> =>
      fetch(`/api/v1/tournaments/${idInAddress(tournament)}/${path}`, {
        headers: { accept: "application/json" },
      })
        .then(async (response) =>
          response.ok ? ((await response.json()) as T) : empty,
        )
        .catch(() => empty);
    // A team's page leads to the teams in place of the tests, and only a
    // manager has one.
    void Promise.all([
      onATeam
        ? Promise.resolve({ competitions: [] })
        : asked<{ competitions: Listed[] }>("competitions", {
            competitions: [],
          }),
      onATeam
        ? asked<{ teams: Team[] }>("teams", { teams: [] })
        : Promise.resolve({ teams: [] }),
    ]).then(([{ competitions }, { teams }]) => {
      if (current) setListed({ competitions, teams });
    });
    return () => {
      current = false;
    };
  }, [tournament, onATeam]);

  // Its tabs are drawn once the competitions are known, so that the bar does
  // not appear with Tournament alone and then grow as the rest arrive. Its
  // room is held meanwhile.
  if (listed === undefined) return <HeldSections />;

  const tournamentPage = `/admin/${address}`;
  const current = (isIt: boolean): "page" | undefined =>
    isIt ? "page" : undefined;

  return (
    <nav className="site-sections" aria-label={say("admin.sections.label")}>
      <div className="page">
        <ul>
          <li>
            <a
              href={tournamentPage}
              aria-current={current(reading === "tournament")}
            >
              {say("admin.sections.tournament")}
            </a>
          </li>
          {listed.competitions
            .filter(({ archived }) => !archived)
            .map((competition) => (
              <li key={competition.slug} className="section-competition">
                <a
                  href={`${tournamentPage}/${competition.kind === "test" ? "tests" : "competitions"}/${competition.slug}`}
                  aria-current={current(
                    typeof reading === "object" &&
                      "competition" in reading &&
                      reading.competition === competition.slug,
                  )}
                >
                  {competition.name}
                </a>
              </li>
            ))}
          {listed.teams
            .filter(({ archived }) => !archived)
            .map((team) => (
              <li key={`team-${team.slug}`}>
                <a
                  href={`${tournamentPage}/teams/${team.slug}`}
                  aria-current={current(
                    typeof reading === "object" &&
                      "team" in reading &&
                      reading.team === team.slug,
                  )}
                >
                  {team.shortName}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};
