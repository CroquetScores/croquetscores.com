import { useEffect, useState } from "react";

import { go } from "../../../../../../navigation.js";
import { knows, say } from "../../../../../../words.js";
import { ScoresTab } from "../../../competitions/{competition-slug}/view/tabs/scores/scores.js";
import { HeldPage } from "../../../HeldPage.js";
import { TournamentSections } from "../../../TournamentSections.js";
import { TestPlayed } from "../../../view/tabs/tests/tests.js";
import "../../../teams/{team-slug}/view/view.css";

// A test's page (view.feature beneath the test): headed by its teams' names,
// as "Australia v England", and beneath that how it is played, as the Tests
// tab writes it, so that a reader who has come to the wrong test sees so at
// once. A test has no players entered in it, so its scores are the one thing
// it shows, and it has no tabs: the scores are listed as a competition's
// Scores tab lists them, set out by team. Managers and scorers see the same
// page. Its tournament's section bar is above, with the test marked.

interface Props {
  /** Where its tournament was asked for, as "2026/ac/spring-tests". */
  readonly address: string;
  /** Where it was asked for beneath its tournament. */
  readonly slug: string;
}

/** What the page knows of the test, as the API answers its page. */
interface Found {
  readonly id: string;
  readonly tournament: string;
  readonly name: string;
  readonly kind: string;
  readonly tournamentAddress: string;
  readonly slug: string;
}

/** The test as its tournament lists it, with what the heading says of it. */
interface Listed {
  readonly id: string;
  readonly teams: readonly {
    readonly id: string;
    readonly name: string;
    readonly shortName: string;
  }[];
  readonly expectedMatches: number;
  readonly bestOf: number;
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly test: Found; readonly listed: Listed };

// What a refusal says in place of the scores: its words, by its code, or the
// words for any where it has none.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.testView.otherwise");

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const ViewTest = ({ address, slug }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });

  useEffect(() => {
    const refused = (code: string): void => {
      setAsked({ is: "refused", code });
    };
    void (async () => {
      // Found as a competition's page is, since a test is one of its
      // tournament's competitions, and refused the same way.
      const response = await fetch(
        `/api/v1/tournaments/at/${address}/competitions/${slug}/page`,
        { headers: { accept: "application/json" } },
      );
      const answer = (await response.json()) as Found & { error?: string };
      if (!response.ok) {
        refused(answer.error ?? "Unknown");
        return;
      }
      // Any other competition is not a test, and there is no test here.
      if (answer.kind !== "test") {
        refused("Tournament.NoSuchCompetition");
        return;
      }
      // An address the tournament has moved on from sends the reader to the
      // test where it is now.
      if (answer.tournamentAddress !== address) {
        go(
          `/admin/${answer.tournamentAddress}/tests/${answer.slug}`,
          "replace",
        );
        return;
      }
      const all = await fetch(
        `/api/v1/tournaments/${idInAddress(answer.tournament)}/competitions`,
        { headers: { accept: "application/json" } },
      );
      const listed = all.ok
        ? ((await all.json()) as { competitions: Listed[] }).competitions.find(
            ({ id }) => id === answer.id,
          )
        : undefined;
      if (listed === undefined) {
        refused("Unknown");
        return;
      }
      setAsked({ is: "found", test: answer, listed });
    })().catch(() => {
      refused("Unknown");
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

  const { test, listed } = asked;
  const [first, second] = listed.teams;
  return (
    <>
      <TournamentSections
        tournament={test.tournament}
        address={test.tournamentAddress}
        reading={{ competition: test.slug }}
      />
      <main id="content">
        <div className="page">
          <div className="panel stack">
            {/* By its teams' names, where the section bar and the Tests tab
                call it by their short names. */}
            <h1>
              {first?.name} {say("admin.test.versus")} {second?.name}
            </h1>
            <p className="page-about">
              <TestPlayed
                expectedMatches={listed.expectedMatches}
                bestOf={listed.bestOf}
              />
            </p>
            <div id="page-list">
              <ScoresTab
                tournament={test.tournament}
                competition={test.id}
                kind="test"
                teams={
                  first === undefined || second === undefined
                    ? undefined
                    : [first, second]
                }
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
