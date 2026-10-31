import { useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import "../../../../../../tournaments/tournamentForm.css";
import { knows, say } from "../../../../../../words.js";
import { idInAddress } from "../../../../../../api.js";
import { useFlags } from "../../../../../../useFlags.js";

// The players dialog (players.feature), over a tournament's page: opened by Add
// Players to add a list of players at once. The first line of what is written
// names the fields and each line after it is a player.
//
// The dialog only cuts what is written into the fields named and each player's
// values. Whether the fields are ones there are, whether every line has a value
// for each, and what a value must be to be a player's, are the server's to say,
// as they are for the player dialog, so a list is refused in one place however
// it arrives. The refusals it returns are put back on the lines they are about.
// The list is kept all of it or none of it, so a refusal leaves nobody added
// and what was written stays written.
//
// A flag is written as the name of the place it is the flag of, in the reader's
// language, as the player dialog offers them. That is turned into the flag's
// code here, since the language is the reader's and the server's rules are
// about codes. A name that is no flag's is sent as it is, to be refused as an
// unknown flag.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Once the players are kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

/** What was written, cut into the fields named and each player's values. */
interface Cut {
  readonly fields: readonly string[];
  readonly rows: readonly (readonly string[])[];
  /** The line the fields are on, and the line of each row, counting from 1. */
  readonly fieldsLine: number | undefined;
  readonly lines: readonly number[];
}

// One line cut into its values at the commas, except where a value is in double
// quotes, as a spreadsheet writes one that has a comma in it; a quote inside
// one is written twice. A quote that does not begin a value is just a quote.
// A value stays on its line: lines are cut first, so a quoted value cannot run
// over two of them.
const valuesOf = (line: string): string[] => {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let place = 0; place < line.length; place += 1) {
    const each = line.charAt(place);
    if (quoted) {
      if (each !== '"') value += each;
      else if (line.charAt(place + 1) === '"') {
        value += '"';
        place += 1;
      } else quoted = false;
    } else if (each === '"' && value.trim() === "") {
      quoted = true;
      value = "";
    } else if (each === ",") {
      values.push(value);
      value = "";
    } else value += each;
  }
  values.push(value);
  return values;
};

// Only cut, not judged: whether the fields are ones there are and every line
// has a value for each is the server's to say, with the rest of what a player
// must be. A line with nothing on it is skipped, and every value is trimmed by
// the server along with the rest.
const cut = (text: string): Cut => {
  const written = text
    .split(/\r?\n/)
    .map((words, place) => ({ words, line: place + 1 }))
    .filter(({ words }) => words.trim() !== "");
  const [first, ...rest] = written;
  return {
    fields: first === undefined ? [] : valuesOf(first.words),
    rows: rest.map(({ words }) => valuesOf(words)),
    fieldsLine: first?.line,
    lines: rest.map(({ line }) => line),
  };
};

export const PlayersDialog = ({
  tournament,
  kept,
  close,
}: Props): React.JSX.Element => {
  const { whenKnown } = useFlags();
  const [text, setText] = useState("");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [sending, setSending] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const at = `/api/site/tournaments/${idInAddress(tournament)}/players/many`;

  const refusal = (code: string, line?: number): Refusal => {
    const words = say(knows(code) ? code : "admin.player.otherwise");
    return {
      code,
      line,
      words:
        line === undefined
          ? words
          : say("admin.players.line", { line: String(line), words }),
    };
  };

  const send = async (): Promise<void> => {
    if (sending) return;
    const made = cut(text);
    setSending(true);
    try {
      // Waited for, since a name can be turned into a flag only once the flags
      // have arrived, and one sent before then would be refused as no flag.
      const flags = (await whenKnown()).flat();
      const response = await fetch(at, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fields: made.fields,
          rows: made.rows.map((row) =>
            row.map((value, place) => {
              if (made.fields[place]?.trim().toLowerCase() !== "flag") {
                return value;
              }
              // A name that is no flag's is sent as it is, to be refused.
              const flag = flags.find(
                ({ name }) => name.toLowerCase() === value.trim().toLowerCase(),
              );
              return flag === undefined ? value : flag.code;
            }),
          ),
        }),
      });
      if (response.ok) {
        setRefused([]);
        kept();
        close();
        return;
      }
      const answer = (await response.json()) as {
        error?: string;
        broken?: { code: string; fields?: string[] }[];
      };
      setRefused(
        answer.broken?.map(({ code, fields }) => {
          // The line of what was written the refusal is about: the fields', or
          // a player's, by their place in the list.
          const place = /^rows\.(\d+)$/.exec(fields?.[0] ?? "")?.[1];
          return refusal(
            code,
            fields?.[0] === "fields"
              ? made.fieldsLine
              : place === undefined
                ? undefined
                : made.lines[Number(place)],
          );
        }) ?? [refusal(answer.error ?? "Unknown")],
      );
      box.current?.focus();
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  return (
    <ModalDialog
      title={say("admin.players.addManyTitle")}
      action={say("admin.player.add")}
      hover={say("admin.hover.dialog.players.add")}
      act={() => void send()}
      cancel={close}
      busy={sending}
      wide
    >
      <Field
        name="players"
        label={say("admin.players.many")}
        refused={refused}
        unlabelled
      >
        {(tied) => (
          <textarea
            {...tied}
            ref={box}
            rows={8}
            autoComplete="off"
            spellCheck={false}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        )}
      </Field>
    </ModalDialog>
  );
};
