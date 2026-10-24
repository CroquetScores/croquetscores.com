import { useEffect, useState } from "react";

import { go } from "../../../../navigation.js";
import { TabControl } from "../../../../TabControl.js";
import { HeldPage } from "../HeldPage.js";
import { TournamentSections } from "../TournamentSections.js";
import { say } from "../../../../words.js";
import { CompetitionsTab } from "./tabs/competitions/competitions.js";
import { ManagersTab } from "./tabs/managers/managers.js";
import { NotesTab } from "./tabs/notes/notes.js";
import { PlayersTab } from "./tabs/players/players.js";
import { RankingsTab } from "./tabs/rankings/rankings.js";
import { ScorersTab } from "./tabs/scorers/scorers.js";
import { TeamsTab } from "./tabs/teams/teams.js";
import { TestsTab } from "./tabs/tests/tests.js";
import { refusalOf } from "../../../../api.js";
import { RefusedPage } from "../RefusedPage.js";
import { Pencil } from "../../../../Pencil.js";

// A tournament's page (view.feature): headed by its name, with what there is
// to run in six tabs beneath it, and the section bar leading to its
// competitions' pages above (TournamentSections.feature). The tabs are parts
// of the one page
// rather than pages of their own, so they have no addresses: the page opens on
// the first the reader is offered, and choosing another leaves the address as
// it was. A manager is offered all six, where the tournament counts towards
// the world rankings, and one fewer where it does not, since only one that
// counts has a rankings file (rankings-tab.feature). A scorer is offered the
// Competitions tab alone. A tournament played by teams has teams and tests where a Standard
// one has players and competitions, so its tabs are Teams, Tests, Notes,
// Managers, Scorers and Rankings, and a scorer is offered Tests alone. Each tab says
// what it holds in a feature of its own.

interface Props {
  /** Where the tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
}

/** What the page knows of the tournament, as the API answers it. */
interface Found {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  /** The reader's part in it, which is what the page offers them. */
  readonly part: "manager" | "scorer" | "rankingOfficer";
  /** Whether the reader may change its players' world ranking names. */
  readonly mayChangeWorldRankingNames: boolean;
  /** Whether the reader may write to its managers, from the Managers tab. */
  readonly mayWriteToManagers: boolean;
  /** Whether it is played by teams, which gives it other tabs. */
  readonly playedByTeams: boolean;
  /** Its sport, by its code, where it has world rankings, for its players' dialog. */
  readonly worldRankingSport?: string | undefined;
  /** Its sport, by its code, which says which kind of rankings file it has. */
  readonly sport: string;
  /** Whether it counts towards the world rankings, and so has a file. */
  readonly countsTowardsWorldRankings: boolean;
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly tournament: Found };

const standardTabs = [
  "players",
  "competitions",
  "notes",
  "managers",
  "scorers",
  "rankings",
] as const;
const teamTabs = [
  "teams",
  "tests",
  "notes",
  "managers",
  "scorers",
  "rankings",
] as const;
type Tab = (typeof standardTabs)[number] | (typeof teamTabs)[number];

// What a reader is offered: every tab to a manager, and the competitions
// alone to a scorer, since scores are entered in a tournament's competitions
// and the rest is the managers' to change. A world ranking officer is offered
// the players besides, whose world ranking names it may change: after the
// competitions where it scores, and where it has no part, with the managers it
// may write to after them. The page opens on the first.
const offeredTo = ({
  part,
  playedByTeams,
  mayChangeWorldRankingNames,
  mayWriteToManagers,
  countsTowardsWorldRankings,
}: Pick<
  Found,
  | "part"
  | "playedByTeams"
  | "mayChangeWorldRankingNames"
  | "mayWriteToManagers"
  | "countsTowardsWorldRankings"
>): readonly Tab[] => {
  if (part === "manager") {
    // The rankings file is only for a tournament that counts, so a manager of
    // one that does not is offered no tab to say so.
    return (playedByTeams ? teamTabs : standardTabs).filter(
      (tab) => tab !== "rankings" || countsTowardsWorldRankings,
    );
  }
  const players: readonly Tab[] = mayChangeWorldRankingNames
    ? [playedByTeams ? "teams" : "players"]
    : [];
  // The managers besides, to write to them, and to read and not change them
  // (managers-tab.feature): the one tab of the managers' an officer has,
  // whether or not it scores.
  const managers: readonly Tab[] = mayWriteToManagers ? ["managers"] : [];
  if (part === "rankingOfficer") return [...players, ...managers];
  return [playedByTeams ? "tests" : "competitions", ...players, ...managers];
};

// The part a reader has in the competitions and tests, which a world ranking
// officer with no part in the tournament is never offered.
const partInCompetitions = (part: Found["part"]): "manager" | "scorer" =>
  part === "manager" ? "manager" : "scorer";

export const ViewTournament = ({ address }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });
  const [chosen, setChosen] = useState<Tab>("players");

  useEffect(() => {
    // Asked as the page that edits it asks, and refused the same way: only a
    // manager runs a tournament, and an archived one can only be restored.
    void fetch(`/api/v1/tournaments/at/${address}/page`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          setAsked({ is: "refused", code: await refusalOf(response) });
          return;
        }
        const answer = (await response.json()) as Found;
        // An address the tournament has moved on from sends the reader to
        // where it is now.
        if (answer.address !== address) {
          go(`/admin/${answer.address}`, "replace");
          return;
        }
        setAsked({ is: "found", tournament: answer });
        setChosen(offeredTo(answer)[0] ?? "competitions");
      })
      .catch(() => {
        setAsked({ is: "refused", code: "Unknown" });
      });
  }, [address]);

  if (asked.is === "asking") return <HeldPage />;

  if (asked.is === "refused") {
    return (
      <RefusedPage
        heading={say("admin.title")}
        code={asked.code}
        otherwise="admin.view.otherwise"
      />
    );
  }

  return (
    <>
      <TournamentSections
        tournament={asked.tournament.id}
        address={asked.tournament.address}
        reading="tournament"
      />
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <div className="page-heading">
              <h1>{asked.tournament.name}</h1>
              {/* A manager's, as editing the tournament is: a scorer has no
                  tournament to edit (view.feature). */}
              {asked.tournament.part === "manager" ? (
                <a
                  className="button"
                  href={`/admin/${asked.tournament.address}/edit`}
                  title={say("admin.hover.tournaments.edit")}
                  aria-label={say("admin.tournaments.edit")}
                >
                  <Pencil />
                </a>
              ) : null}
            </div>
            <TabControl
              tabs={offeredTo(asked.tournament)}
              chosen={chosen}
              choose={setChosen}
              wordsFor={(tab) => say(`admin.view.${tab}`)}
              label={say("admin.view.tabs")}
            >
              {chosen === "players" ? (
                <PlayersTab
                  tournament={asked.tournament.id}
                  worldRankingSport={asked.tournament.worldRankingSport}
                  manages={asked.tournament.part === "manager"}
                />
              ) : null}
              {chosen === "competitions" ? (
                <CompetitionsTab
                  tournament={asked.tournament.id}
                  ranked={asked.tournament.worldRankingSport !== undefined}
                  address={asked.tournament.address}
                  part={partInCompetitions(asked.tournament.part)}
                />
              ) : null}
              {chosen === "teams" ? (
                <TeamsTab
                  tournament={asked.tournament.id}
                  address={asked.tournament.address}
                  manages={asked.tournament.part === "manager"}
                />
              ) : null}
              {chosen === "tests" ? (
                <TestsTab
                  tournament={asked.tournament.id}
                  ranked={asked.tournament.worldRankingSport !== undefined}
                  address={asked.tournament.address}
                  part={partInCompetitions(asked.tournament.part)}
                  toTeams={() => {
                    setChosen("teams");
                  }}
                />
              ) : null}
              {chosen === "notes" ? (
                <NotesTab tournament={asked.tournament.id} />
              ) : null}
              {chosen === "managers" ? (
                <ManagersTab tournament={asked.tournament.id} />
              ) : null}
              {chosen === "scorers" ? (
                <ScorersTab tournament={asked.tournament.id} />
              ) : null}
              {chosen === "rankings" ? (
                <RankingsTab address={asked.tournament.address} />
              ) : null}
            </TabControl>
          </div>
        </div>
      </main>
    </>
  );
};
