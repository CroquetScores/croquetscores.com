import { useEffect, useState } from "react";

import {
  type Begins,
  TournamentForm,
} from "../../../../tournaments/TournamentForm.js";
import { knows, say } from "../../../../words.js";

// Where a manager changes a tournament (edit.feature): the form every
// tournament is created and changed with, beginning as the tournament is.

interface Props {
  /** Where the tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
}

// What a refusal of the page says in place of the form: its words, by its
// code, or the words for any where it has none. The code is the contract; the
// words are only what it says.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.editTournament.otherwise");

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly tournament: Begins };

export const EditTournament = ({ address }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });
  const at = `/api/v1/tournaments/at/${address}`;

  useEffect(() => {
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) => {
        const answer = (await response.json()) as Begins & {
          address?: string;
          error?: string;
        };
        if (!response.ok) {
          setAsked({ is: "refused", code: answer.error ?? "Unknown" });
          return;
        }
        // An address the tournament has moved on from sends the reader to
        // where it is now, rather than changing it under an old name.
        if (answer.address !== undefined && answer.address !== address) {
          window.location.replace(`/admin/${answer.address}/edit`);
          return;
        }
        setAsked({ is: "found", tournament: answer });
      })
      .catch(() => {
        setAsked({ is: "refused", code: "Unknown" });
      });
  }, [at, address]);

  if (asked.is === "asking") return <main id="content" />;

  if (asked.is === "refused") {
    return (
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <h1>{say("admin.editTournament.title")}</h1>
            <p className="page-refused" data-refused={asked.code}>
              {wordsFor(asked.code)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <TournamentForm
      title={say("admin.editTournament.title")}
      button={say("admin.editTournament.submit")}
      begins={asked.tournament}
      send={(said) =>
        fetch(at, {
          method: "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(said),
        })
      }
    />
  );
};
