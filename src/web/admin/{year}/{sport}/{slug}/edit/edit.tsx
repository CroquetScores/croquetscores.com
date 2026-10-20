import { useEffect, useState } from "react";

import { go } from "../../../../navigation.js";
import {
  type Begins,
  TournamentForm,
} from "../../../../tournaments/TournamentForm.js";
import { say } from "../../../../words.js";
import { refusalOf } from "../../../../api.js";
import { RefusedPage } from "../RefusedPage.js";

// Where a manager changes a tournament (edit.feature): the form every
// tournament is created and changed with, beginning as the tournament is.

interface Props {
  /** Where the tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
}

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
        if (!response.ok) {
          setAsked({ is: "refused", code: await refusalOf(response) });
          return;
        }
        const answer = (await response.json()) as Begins & {
          address?: string;
        };
        // An address the tournament has moved on from sends the reader to
        // where it is now, rather than changing it under an old name.
        if (answer.address !== undefined && answer.address !== address) {
          go(`/admin/${answer.address}/edit`, "replace");
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
      <RefusedPage
        heading={say("admin.editTournament.title")}
        code={asked.code}
        otherwise="admin.editTournament.otherwise"
      />
    );
  }

  return (
    <TournamentForm
      title={say("admin.editTournament.title")}
      button={say("admin.editTournament.submit")}
      hover={say("admin.hover.dialog.tournament.edit")}
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
