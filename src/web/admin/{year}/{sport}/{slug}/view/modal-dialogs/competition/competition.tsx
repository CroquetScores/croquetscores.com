import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../words.js";
import "./competition.css";

// The competition dialog (competition.feature), over a tournament's page:
// opened by Add Competition to add competitions one after another. Adding
// keeps it open, says what was added and empties the name alone, since those
// added together are mostly alike, so that the next is its name alone.

type Kind = "block" | "knockout" | "swiss";

const kinds: readonly Kind[] = ["block", "knockout", "swiss"];

// The places a draw can have: those that halve round by round to a final. Any
// other could not be drawn, so is not offered to be refused.
const placesOffered = [2, 4, 8, 16, 32, 64, 128] as const;

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Once a competition is added, so that the list says so. */
  readonly added: () => void;
  readonly close: () => void;
}

// The part of an id after its kind, which is how the API names a tournament,
// so that it is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// A number as it was typed, or one that is no number where nothing was: the
// API refuses either as a best-of that is not whole or not enough.
const typedNumber = (typed: string): number =>
  typed.trim() === "" ? 0 : Number(typed);

// The field each refusal is about, where it is one field. A best-of refused
// in a knockout is about its rounds, and said beside each that breaks it.
const fieldOf = (
  code: string,
  kind: Kind,
): "name" | "bestOf" | "places" | "rounds" | undefined =>
  code.startsWith("CompetitionName.") ||
  code === "Tournament.CompetitionNameTaken"
    ? "name"
    : code.startsWith("BestOf.")
      ? kind === "knockout"
        ? "rounds"
        : "bestOf"
      : code === "KnockoutDraw.EvenBestOf"
        ? "rounds"
        : code.startsWith("KnockoutDraw.")
          ? "places"
          : undefined;

// The rules of a round's best-of that what was typed in it breaks, so that a
// refusal of the rounds is said beside the rounds that earned it.
const brokenByRound = (typed: string): readonly string[] => {
  const games = typedNumber(typed);
  return [
    ...(Number.isSafeInteger(games) ? [] : ["BestOf.NotWhole"]),
    ...(games < 1 ? ["BestOf.TooSmall"] : []),
    ...(Number.isSafeInteger(games) && games % 2 === 0
      ? ["KnockoutDraw.EvenBestOf"]
      : []),
  ];
};

// A round named as a draw's rounds are spoken of: the last three by what they
// are, and any before them by their number, counted from the first. Named from
// the final back because the final is the same round however big the draw.
const roundLabel = (round: number, count: number): string => {
  const fromTheFinal = count - 1 - round;
  return fromTheFinal === 0
    ? say("admin.competition.final")
    : fromTheFinal === 1
      ? say("admin.competition.semis")
      : fromTheFinal === 2
        ? say("admin.competition.quarters")
        : say("admin.competition.round", { number: String(round + 1) });
};

export const CompetitionDialog = ({
  tournament,
  added,
  close,
}: Props): React.JSX.Element => {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<Kind>("block");
  const [bestOf, setBestOf] = useState("1");
  const [places, setPlaces] = useState(8);
  const [rounds, setRounds] = useState<readonly string[]>(["1", "1", "1"]);
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // What was last added, said until the next name is typed.
  const [said, setSaid] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/competitions`;

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.competition.otherwise"),
  });
  const refusedFor = (field: ReturnType<typeof fieldOf>): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code, kind) === field);
  const refusedForRound = (round: number): Refusal[] => {
    const broken = brokenByRound(rounds[round] ?? "");
    return refusedFor("rounds").filter(({ code }) => broken.includes(code));
  };

  // As many rounds as halve the places to a final, those kept keeping what
  // was typed in them and those added beginning on the best of 1. Rounds come
  // and go at the start of the draw, so that the final is still the final and
  // what was typed for it is still its own.
  const choosePlaces = (chosen: number): void => {
    setPlaces(chosen);
    const needed = Math.log2(chosen);
    setRounds((typed) => {
      const added = needed - typed.length;
      return Array.from(
        { length: needed },
        (_, round) => typed[round - added] ?? "1",
      );
    });
  };

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(at, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(
          kind === "knockout"
            ? { kind, name, places, rounds: rounds.map(typedNumber) }
            : { kind, name, bestOf: typedNumber(bestOf) },
        ),
      });
      if (response.ok) {
        setRefused([]);
        added();
        // The name emptied for the next, and the rest left as the next alike
        // will want it, with the reader back in the name.
        setSaid(name.trim());
        setName("");
        nameField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setSaid(undefined);
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

  // The reader is taken to the first field refused, as every refused form
  // takes them.
  useEffect(() => {
    const first = document.querySelector<HTMLElement>(
      'dialog[open] [aria-invalid="true"]',
    );
    first?.focus();
  }, [refused]);

  const above = refusedFor(undefined);

  return (
    <ModalDialog
      title={say("admin.competition.addTitle")}
      action={say("admin.competition.add")}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      {/* Told to a screen reader as it changes, since nothing else on the
          dialog changes where the reader is. */}
      <p className="dialog-status" role="status">
        {said === undefined
          ? null
          : say("admin.competition.added", { name: said })}
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
        label={say("admin.competition.name")}
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
              // What was added is no longer the news once the next is typed.
              setSaid(undefined);
            }}
          />
        )}
      </Field>
      <fieldset className="field-kinds">
        <legend>{say("admin.competition.kind")}</legend>
        {kinds.map((each) => (
          <label key={each} htmlFor={`field-kind-${each}`}>
            <input
              id={`field-kind-${each}`}
              type="radio"
              name="kind"
              value={each}
              checked={kind === each}
              onChange={() => {
                setKind(each);
              }}
            />
            <span>{say(`admin.competitions.${each}`)}</span>
          </label>
        ))}
      </fieldset>
      {kind === "knockout" ? (
        <>
          <Field
            name="places"
            label={say("admin.competition.places")}
            refused={refusedFor("places")}
            lifted
          >
            {(tied) => (
              <select
                {...tied}
                value={places}
                onChange={(event) => {
                  choosePlaces(Number(event.target.value));
                }}
              >
                {placesOffered.map((offered) => (
                  <option key={offered} value={offered}>
                    {offered}
                  </option>
                ))}
              </select>
            )}
          </Field>
          {/* One group, named for what every field in it asks, so that
              each field need only say which round it is. */}
          <fieldset className="field-best-ofs">
            <legend>{say("admin.competition.bestOfs")}</legend>
            <div className="field-best-ofs-rounds">
              {rounds.map((typed, round) => (
                <Field
                  // Keyed by its place from the final, so that a round kept
                  // keeps its field as rounds come and go before it.
                  key={rounds.length - round}
                  name={`round-${String(round + 1)}`}
                  label={roundLabel(round, rounds.length)}
                  refused={refusedForRound(round)}
                  lifted
                >
                  {(tied) => (
                    <input
                      {...tied}
                      type="text"
                      inputMode="numeric"
                      placeholder=" "
                      autoComplete="off"
                      value={typed}
                      onChange={(event) => {
                        const now = event.target.value;
                        setRounds((all) =>
                          all.map((each, place) =>
                            place === round ? now : each,
                          ),
                        );
                      }}
                    />
                  )}
                </Field>
              ))}
            </div>
          </fieldset>
        </>
      ) : (
        <Field
          name="best-of"
          label={say("admin.competition.bestOf")}
          refused={refusedFor("bestOf")}
        >
          {(tied) => (
            <input
              {...tied}
              type="text"
              inputMode="numeric"
              placeholder=" "
              autoComplete="off"
              value={bestOf}
              onChange={(event) => {
                setBestOf(event.target.value);
              }}
            />
          )}
        </Field>
      )}
    </ModalDialog>
  );
};
