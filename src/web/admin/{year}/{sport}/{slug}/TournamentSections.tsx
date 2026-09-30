import { useEffect, useState } from "react";

import { say } from "../../../words.js";

// The section bar of a tournament's page and its competitions' pages
// (TournamentSections.feature): Tournament first, then each competition in
// use, in the tournament's order, the page being read marked. An archived
// competition is left out, since its page refuses to open.
//
// Its links are plain links, as the Competitions tab's are, rather than
// changing the address in place as the years do: each page asks for what it
// shows as it opens, so opening it afresh is what it is built for.

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
  readonly archived: boolean;
}

// The part of an id after its kind, which is how the API names a tournament,
// so that it is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const TournamentSections = ({
  tournament,
  address,
  reading,
}: Props): React.JSX.Element | null => {
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

  // Drawn once the competitions are known, so that the bar does not appear
  // with Tournament alone and then grow as the rest arrive.
  if (listed === undefined) return null;

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
                  href={`${tournamentPage}/competitions/${competition.slug}`}
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
