import { useEffect, useState } from "react";

import { go } from "../../../../../../navigation.js";
import { TabControl } from "../../../../../../TabControl.js";
import { HeldPage } from "../../../HeldPage.js";
import { TournamentSections } from "../../../TournamentSections.js";
import { knows, say } from "../../../../../../words.js";
import { CompetitionPlayersTab } from "./tabs/players/players.js";
import { ScoresTab } from "./tabs/scores/scores.js";

// A competition's page (view.feature beneath the competition): headed by its
// name, with what there is to run in two tabs, laid out and chosen as the
// tournament's page's are, so they share its stylesheet. A manager is offered
// Players and Scores, and a scorer Scores alone, since who plays is the
// manager's to say; the page opens on the first the reader is offered. Each tab
// says what it holds in a feature of its own. Above it is its tournament's
// section bar, with the competition marked (TournamentSections.feature).

interface Props {
  /** Where its tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
  /** Where it was asked for beneath its tournament. */
  readonly slug: string;
}

/** What the page knows of the competition, as the API answers it. */
interface Found {
  readonly id: string;
  readonly tournament: string;
  readonly name: string;
  readonly kind: "block" | "knockout" | "swiss";
  readonly tournamentAddress: string;
  readonly slug: string;
  readonly part: "manager" | "scorer";
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly competition: Found };

const tabs = ["players", "scores"] as const;
type Tab = (typeof tabs)[number];

const offeredTo = (part: Found["part"]): readonly Tab[] =>
  part === "manager" ? tabs : ["scores"];

// What a refusal says in place of the tabs: its words, by its code, or the
// words for any where it has none.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.competitionView.otherwise");

export const ViewCompetition = ({
  address,
  slug,
}: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });
  const [chosen, setChosen] = useState<Tab>("players");

  useEffect(() => {
    void fetch(`/api/v1/tournaments/at/${address}/competitions/${slug}/page`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        const answer = (await response.json()) as Found & { error?: string };
        if (!response.ok) {
          setAsked({ is: "refused", code: answer.error ?? "Unknown" });
          return;
        }
        // An address the tournament has moved on from sends the reader to the
        // competition where it is now.
        if (answer.tournamentAddress !== address) {
          go(
            `/admin/${answer.tournamentAddress}/competitions/${answer.slug}`,
            "replace",
          );
          return;
        }
        setAsked({ is: "found", competition: answer });
        setChosen(offeredTo(answer.part)[0] ?? "scores");
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

  return (
    <>
      <TournamentSections
        tournament={asked.competition.tournament}
        address={asked.competition.tournamentAddress}
        reading={{ competition: asked.competition.slug }}
      />
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <h1>{asked.competition.name}</h1>
            <TabControl
              tabs={offeredTo(asked.competition.part)}
              chosen={chosen}
              choose={setChosen}
              wordsFor={(tab) => say(`admin.competitionView.${tab}`)}
              label={say("admin.competitionView.tabs")}
            >
              {chosen === "players" ? (
                <CompetitionPlayersTab
                  tournament={asked.competition.tournament}
                  competition={asked.competition.id}
                  kind={asked.competition.kind}
                />
              ) : (
                <ScoresTab
                  tournament={asked.competition.tournament}
                  competition={asked.competition.id}
                />
              )}
            </TabControl>
          </div>
        </div>
      </main>
    </>
  );
};
