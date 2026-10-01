import { useEffect, useState } from "react";

import { say } from "../../../words.js";
import "./tournamentSections.css";

// The section bar of a tournament's page and its competitions' pages
// (TournamentSections.feature): Tournament first, then each competition in
// use, in the tournament's order, the page being read marked. An archived
// competition is left out, since its page refuses to open. A tournament played
// by teams has tests where a Standard one has competitions, and a test is one
// of its competitions, found under "tests" rather than "competitions".
//
// Its links are plain links, which the admin follows in place as it does
// every link to one of its pages (App.tsx).

interface Props {
  /** The tournament's id, as the API names it. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** The page being read: the tournament's, or a competition's by its slug. */
  readonly reading: "tournament" | { readonly competition: string };
}

/** A competition as the API lists it, with as much as the bar needs. */
interface Listed {
  readonly name: string;
  readonly slug: string;
  readonly kind: string;
  readonly archived: boolean;
}

// The part of an id after its kind, which is how the API names a tournament,
// so that it is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

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
  const [listed, setListed] = useState<readonly Listed[] | undefined>();

  useEffect(() => {
    let current = true;
    void fetch(`/api/v1/tournaments/${idInAddress(tournament)}/competitions`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { competitions: Listed[] }).competitions
          : [],
      )
      .catch(() => [])
      .then((competitions) => {
        if (current) setListed(competitions);
      });
    return () => {
      current = false;
    };
  }, [tournament]);

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
          {listed
            .filter(({ archived }) => !archived)
            .map((competition) => (
              <li key={competition.slug}>
                <a
                  href={`${tournamentPage}/${competition.kind === "test" ? "tests" : "competitions"}/${competition.slug}`}
                  aria-current={current(
                    reading !== "tournament" &&
                      reading.competition === competition.slug,
                  )}
                >
                  {competition.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};
