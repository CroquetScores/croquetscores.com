import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./countries.css";

// The tournaments played in a country the world rankings' list of their sport
// does not name (countries.feature): a row for each, the country, the
// tournament, and a link to where the old site shows it, in the order the API
// sends them, which is by country, then the day they started, then name.

interface TournamentInUnlistedCountry {
  readonly name: string;
  readonly country: string;
  readonly countryName: string;
  readonly address: string;
}

// Where the old site shows a tournament, which is the address the tournament
// has on the site too, at the old site's own host.
const oldSiteOf = (address: string): string =>
  `https://croquetscores.com/${address}`;

export const Countries = (): React.JSX.Element => {
  const [tournaments, setTournaments] = useState<
    readonly TournamentInUnlistedCountry[] | undefined
  >();
  const [refused, setRefused] = useState<string | undefined>();

  useEffect(() => {
    let current = true;
    void fetch("/api/v1/countries", {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const body = (await response.json()) as {
            tournaments: TournamentInUnlistedCountry[];
          };
          if (current) setTournaments(body.tournaments);
        } else {
          const code = await refusalOf(response);
          if (current) setRefused(code);
        }
      })
      .catch(() => {
        if (current) setRefused("Unknown");
      });
    return () => {
      current = false;
    };
  }, []);

  return (
    <div className="stack" aria-busy={tournaments === undefined && !refused}>
      <h1>{say("admin.countries.title")}</h1>
      {refused !== undefined ? (
        <p className="refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.countries.otherwise")}
        </p>
      ) : tournaments === undefined ? null : tournaments.length === 0 ? (
        <p data-none="">{say("admin.countries.none")}</p>
      ) : (
        <ul className="countries">
          {tournaments.map((tournament) => (
            <li key={tournament.address} className="country-tournament-row">
              <span className="country-name">{tournament.countryName}</span>
              <span className="country-tournament">{tournament.name}</span>
              <a
                className="country-old-site"
                href={oldSiteOf(tournament.address)}
              >
                {say("admin.countries.oldSite")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
