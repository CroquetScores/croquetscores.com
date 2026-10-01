import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";

// The team player dialog (team-player.feature), over a team's page: the player
// dialog of a Standard tournament without its Representing and its Flag, since
// a player in a team represents their team and the team flies the flag. It
// asks for a name the same way, so that a manager who has used one has used
// the other: Add keeps it open and empties it for the next, Save closes it. A
// name as a bye is refused beneath the name as any other broken rule is, since
// a test has no byes to point the reader to.

/** A player as they are, when one is being changed. */
export interface TeamPlayerAsTheyAre {
  readonly id: string;
  readonly name: string;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The team's id, which the player is added to and no other. */
  readonly team: string;
  /** Nothing when adding, and the player when changing one. */
  readonly player?: TeamPlayerAsTheyAre | undefined;
  /** Once a player is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// Whether a refusal is about the name, the one field. One that is not is said
// above it.
const aboutTheName = (code: string): boolean =>
  code.startsWith("PersonName.") ||
  code === "Team.PlayerNameTaken" ||
  code === "TeamPlayer.NamedBye";

export const TeamPlayerDialog = ({
  tournament,
  team,
  player,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [name, setName] = useState(player?.name ?? "");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // Who was last added, said until the next name is typed.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/teams/${idInAddress(team)}/players`;

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.player.otherwise"),
  });

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        player === undefined ? at : `${at}/${idInAddress(player.id)}`,
        {
          method: player === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );
      if (response.ok) {
        setRefused([]);
        kept();
        if (player !== undefined) {
          close();
          return;
        }
        // Emptied for the next, with the reader back in the name.
        setAdded(name.trim());
        setName("");
        nameField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setAdded(undefined);
        setRefused(
          answer.broken?.map(({ code }) => refusal(code)) ?? [
            refusal(answer.error ?? "Unknown"),
          ],
        );
      }
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  // The reader is taken to the name where it was refused, as every refused
  // form takes them.
  useEffect(() => {
    if (refused.some(({ code }) => aboutTheName(code))) {
      nameField.current?.focus();
    }
  }, [refused]);

  const above = refused.filter(({ code }) => !aboutTheName(code));

  return (
    <ModalDialog
      title={say(
        player === undefined
          ? "admin.player.addTitle"
          : "admin.player.editTitle",
      )}
      action={say(
        player === undefined ? "admin.player.add" : "admin.player.save",
      )}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      {/* Told to a screen reader as it changes, since nothing else on the
          dialog changes where the reader is. */}
      <p className="dialog-status" role="status">
        {added === undefined
          ? null
          : say("admin.player.added", { name: added })}
      </p>
      {above.length > 0 ? (
        <div
          className="dialog-problems"
          data-refused={above.map(({ code }) => code).join(" ")}
        >
          {above.map(({ code, words }) => (
            <p key={code}>{words}</p>
          ))}
        </div>
      ) : null}
      <Field
        name="name"
        label={say("admin.player.name")}
        refused={refused.filter(({ code }) => aboutTheName(code))}
      >
        {(tied) => (
          <input
            {...tied}
            ref={nameField}
            type="text"
            placeholder=" "
            autoComplete="off"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              // Who was added is no longer the news once the next is typed.
              setAdded(undefined);
            }}
          />
        )}
      </Field>
    </ModalDialog>
  );
};
