import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";
import { idInAddress } from "../../../../../../../../api.js";
import "./carry-forward.css";

// The carry forward dialog (carry-forward.feature), over a competition's
// Players tab: the six counts a player brings into the competition from play
// it did not score, two to a row, what was won beside what was lost. It begins
// as the player's carry forward is, a count they carry nothing forward in
// empty rather than 0, and Save keeps all six and closes it.

// In the order they are laid out and asked, matches, then games, then hoops.
const COUNTS = [
  "matchWins",
  "matchLosses",
  "gameWins",
  "gameLosses",
  "hoopsFor",
  "hoopsAgainst",
] as const;

type Count = (typeof COUNTS)[number];

/** A competition's player, as the carry forward dialog changes them. */
export interface CarryingForward {
  readonly id: string;
  readonly name: string;
  readonly carryForward: { readonly [count in Count]?: number | undefined };
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  readonly player: CarryingForward;
  /** Once the carry forward is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// A refusal as the API says it: its code, and the counts it is about.
interface Broken {
  readonly code: string;
  readonly fields?: readonly string[];
}

const isCount = (field: string | undefined): field is Count =>
  (COUNTS as readonly (string | undefined)[]).includes(field);

export const CarryForwardDialog = ({
  tournament,
  competition,
  player,
  kept,
  close,
}: Props): React.JSX.Element => {
  // As typed, so that what was typed stays typed when it is refused. A count
  // carried forward as 0 begins as "0", and one carried as nothing empty.
  const [typed, setTyped] = useState<Readonly<Record<Count, string>>>(
    () =>
      Object.fromEntries(
        COUNTS.map((count) => [
          count,
          player.carryForward[count] === undefined
            ? ""
            : String(player.carryForward[count]),
        ]),
      ) as Record<Count, string>,
  );
  // Each refusal with the count it is about, or none where it is about no one.
  const [refused, setRefused] = useState<
    readonly (Refusal & { readonly count: Count | undefined })[]
  >([]);
  const [sending, setSending] = useState(false);
  const fields = useRef<Partial<Record<Count, HTMLInputElement | null>>>({});

  const refusal = (code: string, count: Count | undefined) => ({
    code,
    count,
    words: say(knows(code) ? code : "admin.carryForward.otherwise"),
  });

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        `/api/v1/tournaments/${idInAddress(tournament)}/competitions/${idInAddress(competition)}/players/${idInAddress(player.id)}/carry-forward`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          // As typed: the API makes a number of each, and nothing of one left
          // empty.
          body: JSON.stringify(typed),
        },
      );
      if (response.ok) {
        kept();
        close();
        return;
      }
      const answer = (await response.json().catch(() => ({}))) as {
        error?: string;
        broken?: Broken[];
      };
      setRefused(
        answer.broken?.map(({ code, fields: about }) => {
          const field = about?.[0];
          return refusal(code, isCount(field) ? field : undefined);
        }) ?? [refusal(answer.error ?? "Unknown", undefined)],
      );
    } catch {
      setRefused([refusal("Unknown", undefined)]);
    }
    setSending(false);
  };

  // The reader is taken to the first count refused, as every refused form
  // takes them.
  useEffect(() => {
    const first = COUNTS.find((count) =>
      refused.some((each) => each.count === count),
    );
    if (first !== undefined) fields.current[first]?.focus();
  }, [refused]);

  const above = refused.filter(({ count }) => count === undefined);

  return (
    <ModalDialog
      title={say("admin.carryForward.title", { name: player.name })}
      action={say("admin.carryForward.save")}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
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
      <div className="carry-forward-counts">
        {COUNTS.map((count) => (
          <Field
            key={count}
            name={count}
            label={say(`admin.carryForward.${count}`)}
            refused={refused.filter((each) => each.count === count)}
          >
            {(tied) => (
              <input
                {...tied}
                ref={(element) => {
                  fields.current[count] = element;
                }}
                type="text"
                inputMode="numeric"
                placeholder=" "
                autoComplete="off"
                value={typed[count]}
                onChange={(event) => {
                  setTyped((was) => ({ ...was, [count]: event.target.value }));
                }}
              />
            )}
          </Field>
        ))}
      </div>
    </ModalDialog>
  );
};
