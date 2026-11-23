import { useEffect, useRef, useState } from "react";

import { idInAddress, refusalOf } from "../../../../../../api.js";
import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { DialogProblems } from "../../../../../../DialogProblems.js";
import { knows, say } from "../../../../../../words.js";

// The dialog an administrator deletes a tournament from (delete.feature): the
// email its managers are to be sent, begun from words the administrator has
// used, and two ways to send it. The words are the administrator's to change
// before they go, since what is said differs with why the tournament is being
// removed. What is sent is the box's text and nothing else.

interface Props {
  /** The tournament's id, as the API names it. */
  readonly tournament: string;
  /** Its name, which the email begins by naming. */
  readonly name: string;
  /** Once the managers are told and the tournament is not archived. */
  readonly told: () => void;
  /** Once the managers are told and the tournament is archived. */
  readonly archived: () => void;
  readonly close: () => void;
}

export const DeleteTournamentDialog = ({
  tournament,
  name,
  told,
  archived,
  close,
}: Props): React.JSX.Element => {
  const [message, setMessage] = useState(() =>
    say("admin.deleteTournament.begun", {
      tryAddress: say("admin.site.tryAddress"),
      siteName: say("admin.site.name"),
      administratorName: say("admin.administrator.name"),
      tournament: name,
    }),
  );
  const [refused, setRefused] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  // Kept as well as the state, which a second press made before the page has
  // drawn again would still read as not busy, and each sends an email.
  const sending = useRef(false);

  useEffect(() => {
    field.current?.focus();
  }, []);

  const send = async (archive: boolean): Promise<void> => {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setRefused(undefined);
    try {
      const response = await fetch(
        `/api/site/tournaments/${idInAddress(tournament)}/delete`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message, archive }),
        },
      );
      if (response.ok) {
        if (archive) archived();
        else told();
        return;
      }
      setRefused(await refusalOf(response));
    } catch {
      setRefused("Unknown");
    }
    sending.current = false;
    setBusy(false);
  };

  const refusal: Refusal | undefined =
    refused === undefined
      ? undefined
      : {
          code: refused,
          words: say(
            knows(refused) ? refused : "admin.deleteTournament.otherwise",
          ),
        };
  // Said beside the box where it is about what was typed in it, and above it
  // where it is about anything else.
  const aboutMessage = refused === "DeleteTournament.MessageMissing";

  return (
    <ModalDialog
      title={say("admin.deleteTournament.title")}
      action={say("admin.deleteTournament.emailOnly")}
      hover={say("admin.hover.deleteTournament.emailOnly")}
      alternative={{
        action: say("admin.deleteTournament.emailAndArchive"),
        hover: say("admin.hover.deleteTournament.emailAndArchive"),
        act: () => void send(true),
      }}
      busy={busy}
      act={() => void send(false)}
      cancel={close}
      wide
    >
      <p>{say("admin.deleteTournament.explanation")}</p>
      <DialogProblems
        refused={refusal !== undefined && !aboutMessage ? [refusal] : []}
      />
      <Field
        name="message"
        label={say("admin.deleteTournament.message")}
        refused={refusal !== undefined && aboutMessage ? [refusal] : undefined}
        lifted
      >
        {(tied) => (
          <textarea
            {...tied}
            ref={field}
            rows={12}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setRefused(undefined);
            }}
          />
        )}
      </Field>
    </ModalDialog>
  );
};
