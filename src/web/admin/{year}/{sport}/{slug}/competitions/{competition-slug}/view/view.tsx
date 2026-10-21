import { useEffect, useRef, useState } from "react";

import { go } from "../../../../../../navigation.js";
import { TabControl } from "../../../../../../TabControl.js";
import { HeldPage } from "../../../HeldPage.js";
import { TournamentSections } from "../../../TournamentSections.js";
import { say } from "../../../../../../words.js";
import { CompetitionPlayersTab } from "./tabs/players/players.js";
import { ScoresTab } from "./tabs/scores/scores.js";
import { idInAddress, refusalOf } from "../../../../../../api.js";
import { Pencil } from "../../../../../../Pencil.js";
import {
  CompetitionDialog,
  type CompetitionAsItIs,
} from "../../../view/modal-dialogs/competition/competition.js";
import { RefusedPage } from "../../../RefusedPage.js";

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

export const ViewCompetition = ({
  address,
  slug,
}: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });
  const [chosen, setChosen] = useState<Tab>("players");
  // The competition being changed, once the dialog is open, and a count of the
  // times it has been kept, so that the page asks for the competition again and
  // says what it is now.
  const [editing, setEditing] = useState<CompetitionAsItIs | undefined>();
  const [kept, setKept] = useState(0);
  // Whether the competition's list is being asked for, so that pressing the
  // pencil again meanwhile does not ask twice.
  const [opening, setOpening] = useState(false);
  // Whether the page has been drawn once, after which asking again keeps the
  // tab the reader is on.
  const drawn = useRef(false);

  useEffect(() => {
    // An answer that arrives after a newer question was asked is not the page
    // as it is now, so it is let go rather than drawn over it.
    let current = true;
    void fetch(`/api/v1/tournaments/at/${address}/competitions/${slug}/page`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          const code = await refusalOf(response);
          // A page already drawn is kept when asking again fails: the change
          // was kept, and a failure of the second question is not a reason
          // to take the page away.
          if (current && !drawn.current) setAsked({ is: "refused", code });
          return;
        }
        const answer = (await response.json()) as Found;
        if (!current) return;
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
        if (!drawn.current) setChosen(offeredTo(answer.part)[0] ?? "scores");
        drawn.current = true;
      })
      .catch(() => {
        if (current && !drawn.current) {
          setAsked({ is: "refused", code: "Unknown" });
        }
      });
    return () => {
      current = false;
    };
  }, [address, slug, kept]);

  if (asked.is === "asking") return <HeldPage />;

  if (asked.is === "refused") {
    return (
      <RefusedPage
        heading={say("admin.title")}
        code={asked.code}
        otherwise="admin.competitionView.otherwise"
      />
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
            <div className="page-heading">
              <h1>{asked.competition.name}</h1>
              {/* A manager's, as editing is: a scorer is there to enter
                  scores (view.feature). The dialog is given the competition
                  as the tournament lists it, which has its shape. */}
              {asked.competition.part === "manager" ? (
                <button
                  type="button"
                  className="button"
                  title={say("admin.hover.competitions.edit")}
                  aria-label={say("admin.competitions.edit")}
                  disabled={opening}
                  onClick={() => {
                    setOpening(true);
                    void fetch(
                      `/api/v1/tournaments/${idInAddress(asked.competition.tournament)}/competitions`,
                      { headers: { accept: "application/json" } },
                    )
                      .then(async (response) => {
                        // Left alone when the list cannot be had: the page is
                        // still good, and pressing the pencil again asks again.
                        if (!response.ok) return;
                        const listed = (await response.json()) as {
                          readonly competitions: readonly CompetitionAsItIs[];
                        };
                        setEditing(
                          listed.competitions.find(
                            ({ id }) => id === asked.competition.id,
                          ),
                        );
                      })
                      .catch(() => undefined)
                      .finally(() => {
                        setOpening(false);
                      });
                  }}
                >
                  <Pencil />
                </button>
              ) : null}
            </div>
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
                  kind={asked.competition.kind}
                />
              )}
            </TabControl>
          </div>
        </div>
      </main>
      {editing === undefined ? null : (
        <CompetitionDialog
          tournament={asked.competition.tournament}
          competition={editing}
          kept={() => {
            setKept((count) => count + 1);
          }}
          close={() => {
            setEditing(undefined);
          }}
        />
      )}
    </>
  );
};
