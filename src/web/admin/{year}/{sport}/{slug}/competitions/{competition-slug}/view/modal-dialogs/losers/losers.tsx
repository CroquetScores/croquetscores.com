import { useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { DialogProblems } from "../../../../../../../../DialogProblems.js";
import { useFocusFirstRefused } from "../../../../../../../../useFocusFirstRefused.js";
import { idInAddress } from "../../../../../../../../api.js";
import { knows, say } from "../../../../../../../../words.js";

// The losers knockout dialog (losers.feature), over a knockout's Losers tab:
// the round whose losers play on, from the rounds that are not the final, and
// the new knockout's name. It has as many places as that round has matches, and
// the tournament works that out, so it is not asked for.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The knockout whose losers it takes, by its id. */
  readonly competition: string;
  /** How many rounds send their losers on: all but the final. */
  readonly rounds: number;
  /** Once the knockout is added, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// A round named as a draw's rounds are spoken of in the competition dialog:
// the last three by what they are, and any before them by their number. The
// final is never offered, so the last one here is the semi finals.
const roundLabel = (round: number, count: number): string => {
  const fromTheFinal = count - round;
  return fromTheFinal === 1
    ? say("admin.competition.semis")
    : fromTheFinal === 2
      ? say("admin.competition.quarters")
      : say("admin.competition.round", { number: String(round + 1) });
};

export const LosersDialog = ({
  tournament,
  competition,
  rounds,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [name, setName] = useState("");
  const [round, setRound] = useState(0);
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.competition.otherwise"),
  });
  const nameRefused = refused.filter(
    ({ code }) =>
      code.startsWith("CompetitionName.") ||
      code === "Tournament.CompetitionNameTaken",
  );
  const above = refused.filter((each) => !nameRefused.includes(each));

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        `/api/site/tournaments/${idInAddress(tournament)}/competitions`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            kind: "losers-knockout",
            name,
            from: idInAddress(competition),
            round,
          }),
        },
      );
      if (response.ok) {
        kept();
        close();
        return;
      }
      const answer = (await response.json()) as {
        error?: string;
        broken?: { code: string }[];
      };
      setRefused(
        answer.broken?.map(({ code }) => refusal(code)) ?? [
          refusal(answer.error ?? "Unknown"),
        ],
      );
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  useFocusFirstRefused(refused);

  return (
    <ModalDialog
      title={say("admin.losers.add")}
      action={say("admin.competition.add")}
      hover={say("admin.hover.losers.add")}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      <DialogProblems refused={above} />
      <Field name="round" label={say("admin.losers.round")} refused={[]} lifted>
        {(tied) => (
          <select
            {...tied}
            value={round}
            onChange={(event) => {
              setRound(Number(event.target.value));
            }}
          >
            {Array.from({ length: rounds }, (_, each) => (
              <option key={each} value={each}>
                {say("admin.losers.option", {
                  round: roundLabel(each, rounds),
                  // As many losers as the round has matches, which halve round by round.
                  count: String(2 ** (rounds - each)),
                })}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field name="name" label={say("admin.losers.name")} refused={nameRefused}>
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
            }}
          />
        )}
      </Field>
    </ModalDialog>
  );
};
