import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../words.js";

// The player dialog (player.feature), over a tournament's page: opened by Add
// Player to add players one after another, and by a player's name to change
// them. Adding and changing are the one dialog, so that the two cannot come to
// ask different things. Adding keeps it open, says who was added and empties
// it for the next; saving closes it.

/** A flag as the API offers it: its code, its name as the reader reads it. */
interface Flag {
  readonly code: string;
  readonly name: string;
}

/** A player as they are, when one is being changed. */
export interface PlayerAsTheyAre {
  readonly id: string;
  readonly name: string;
  readonly representing: string | undefined;
  readonly flag: { readonly code: string } | undefined;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Nothing when adding, and the player when changing one. */
  readonly player?: PlayerAsTheyAre | undefined;
  /** Once a player is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// The part of an id after its kind, which is how the API names a tournament
// or a player, so that each is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// What a name that makes a player a bye is refused with.
const BYE = "TournamentPlayer.NamedBye";

// The field each refusal is about. One about no one field is said above them.
const fieldOf = (code: string): "name" | "flag" | undefined =>
  code.startsWith("PersonName.") ||
  code === "TournamentPlayer.NoLetterOrDigit" ||
  code === "Tournament.PlayerNameTaken"
    ? "name"
    : code === "TournamentPlayer.NoSuchFlag"
      ? "flag"
      : undefined;

export const PlayerDialog = ({
  tournament,
  player,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [flags, setFlags] = useState<readonly Flag[]>([]);
  const [name, setName] = useState(player?.name ?? "");
  const [representing, setRepresenting] = useState(player?.representing ?? "");
  const [flag, setFlag] = useState(player?.flag?.code ?? "");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // Who was last added, said until the next name is typed.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  // Whether the reader is being told why a player is never a bye.
  const [explaining, setExplaining] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/players`;

  useEffect(() => {
    void fetch("/api/v1/flags", { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok ? ((await response.json()) as { flags: Flag[] }).flags : [],
      )
      .catch(() => [])
      .then(setFlags);
  }, []);

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.player.otherwise"),
  });
  // Back in the name, with what was typed still typed, to put it right. After
  // the dialog about byes has given the focus back to what opened it.
  const explained = (): void => {
    setExplaining(false);
    setTimeout(() => nameField.current?.focus());
  };

  const refusedFor = (field: "name" | "flag" | undefined): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code) === field);

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
          body: JSON.stringify({ name, representing, flag }),
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
        setRepresenting("");
        setFlag("");
        nameField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setAdded(undefined);
        // Told in a dialog of its own rather than beneath the name: what a
        // bye is, and where they are found, is more than a line can say.
        if (answer.broken?.some(({ code }) => code === BYE)) {
          setRefused([]);
          setExplaining(true);
        } else {
          setRefused(
            answer.broken?.map(({ code }) => refusal(code)) ?? [
              refusal(answer.error ?? "Unknown"),
            ],
          );
        }
      }
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  // The reader is taken to the first field refused, as every refused form
  // takes them.
  useEffect(() => {
    if (refused.some(({ code }) => fieldOf(code) === "name")) {
      nameField.current?.focus();
    }
  }, [refused]);

  const above = refusedFor(undefined);

  return (
    <>
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
          <div className="dialog-problems">
            {above.map(({ code, words }) => (
              <p key={code}>{words}</p>
            ))}
          </div>
        ) : null}
        <Field
          name="name"
          label={say("admin.player.name")}
          refused={refusedFor("name")}
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
        <Field
          name="representing"
          label={say("admin.player.representing")}
          refused={undefined}
        >
          {(tied) => (
            <input
              {...tied}
              type="text"
              placeholder=" "
              autoComplete="off"
              value={representing}
              onChange={(event) => {
                setRepresenting(event.target.value);
              }}
            />
          )}
        </Field>
        <Field
          name="flag"
          label={say("admin.player.flag")}
          refused={refusedFor("flag")}
          lifted
        >
          {(tied) => (
            <select
              {...tied}
              value={flag}
              onChange={(event) => {
                setFlag(event.target.value);
              }}
            >
              {/* None first, since most players fly none. */}
              <option value="" />
              {flags.map(({ code, name: called }) => (
                <option key={code} value={code}>
                  {called}
                </option>
              ))}
            </select>
          )}
        </Field>
      </ModalDialog>
      {explaining ? (
        <ModalDialog
          title={say("admin.player.byesTitle")}
          action={say("admin.modal.ok")}
          act={explained}
          cancel={explained}
          alone
        >
          <p className="dialog-byes">{say("admin.player.byes")}</p>
        </ModalDialog>
      ) : null}
    </>
  );
};
