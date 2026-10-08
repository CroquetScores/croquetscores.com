import { useEffect, useState } from "react";

import { go } from "../../../../../../navigation.js";
import { knows, say } from "../../../../../../words.js";
import { HeldPage } from "../../../HeldPage.js";
import { TournamentSections } from "../../../TournamentSections.js";
import { TeamPlayers } from "./players/players.js";
import "./view.css";

// A team's page (view.feature beneath the team): headed by the team's name
// with its short name in brackets, as the Teams tab shows a team, its flag
// beside it, and its players beneath, which are the one thing it shows, so it
// has no tabs. The section bar leads to every team in use as well, and marks
// this one. Only a manager sees it, since a team's players are theirs to say.

interface Props {
  /** Where its tournament was asked for, as "2026/ac/spring-tests". */
  readonly address: string;
  /** Where it was asked for beneath its tournament. */
  readonly slug: string;
}

/** What the page knows of the team, as the API answers it. */
interface Found {
  readonly id: string;
  readonly tournament: string;
  readonly name: string;
  readonly shortName: string;
  readonly flag:
    | { readonly code: string; readonly name: string; readonly image: string }
    | undefined;
  readonly tournamentAddress: string;
  readonly slug: string;
  /** Its sport, by its code, where it has world rankings, for its players' dialog. */
  readonly worldRankingSport?: string | undefined;
  /** Whether the reader manages its tournament, rather than ranking it alone. */
  readonly manages: boolean;
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly team: Found };

// What a refusal says in place of the players: its words, by its code, or the
// words for any where it has none.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.teamView.otherwise");

export const ViewTeam = ({ address, slug }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });

  useEffect(() => {
    void fetch(`/api/v1/tournaments/at/${address}/teams/${slug}/page`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        const answer = (await response.json()) as Found & { error?: string };
        if (!response.ok) {
          setAsked({ is: "refused", code: answer.error ?? "Unknown" });
          return;
        }
        // An address the tournament has moved on from sends the reader to the
        // team where it is now.
        if (answer.tournamentAddress !== address) {
          go(
            `/admin/${answer.tournamentAddress}/teams/${answer.slug}`,
            "replace",
          );
          return;
        }
        setAsked({ is: "found", team: answer });
      })
      .catch(() => {
        setAsked({ is: "refused", code: "Unknown" });
      });
  }, [address, slug]);

  if (asked.is === "asking") return <HeldPage />;

  if (asked.is === "refused") {
    return (
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <h1>{say("admin.title")}</h1>
            <p className="page-refused" data-refused={asked.code}>
              {wordsFor(asked.code)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { team } = asked;
  return (
    <>
      <TournamentSections
        tournament={team.tournament}
        address={team.tournamentAddress}
        reading={{ team: team.slug }}
      />
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <h1>
              {team.name} ({team.shortName})
            </h1>
            {team.flag === undefined ? null : (
              <p className="page-about">
                <img
                  className="page-flag"
                  src={team.flag.image}
                  alt={team.flag.name}
                  data-flag={team.flag.code}
                />
              </p>
            )}
            <div id="page-list">
              <TeamPlayers
                tournament={team.tournament}
                team={team.id}
                worldRankingSport={team.worldRankingSport}
                manages={team.manages}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
