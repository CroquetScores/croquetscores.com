import { useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { standardHelp } from "../../../../../../helpAddress.js";
import { knows, say } from "../../../../../../words.js";
import { idInAddress } from "../../../../../../api.js";
import "./competition.css";
import { DialogProblems } from "../../../../../../DialogProblems.js";
import { DialogStatus } from "../../../../../../DialogStatus.js";
import { useFocusFirstRefused } from "../../../../../../useFocusFirstRefused.js";
import { useRules } from "../../../../../../RulesTicks.js";
import {
  LosersDialog,
  type LosersAsked,
} from "../../../competitions/{competition-slug}/view/modal-dialogs/losers/losers.js";
import { TieBreak } from "../../../../../../../../domain/aggregates/tournaments/value-objects/TieBreak.js";

// The competition dialog (competition.feature), over a tournament's page:
// opened by Add Competition to add competitions one after another, and by Edit
// to change one. Adding and changing are the one dialog, so that the two
// cannot come to ask different things. Adding keeps it open, says what was
// added and empties the name alone, since those added together are mostly
// alike, so that the next is its name alone; saving closes it, since a
// competition is changed one at a time.

type Kind = "block" | "knockout" | "swiss";

const kinds: readonly Kind[] = ["block", "knockout", "swiss"];

// The places a draw can have: those that halve round by round to a final. Any
// other could not be drawn, so is not offered to be refused.
const placesOffered = [2, 4, 8, 16, 32, 64, 128] as const;

// The ways a block's players level on matches won can be told apart, in the
// order they are offered, the first being what a block goes by unless it is
// told otherwise. Taken from the tie breaks there are rather than written out
// again, so that one added there is offered here.
const tieBreaksOffered = TieBreak.all.map(({ code }) => code);

/** A competition as it is, when one is being changed. */
export type CompetitionAsItIs = {
  readonly id: string;
  readonly name: string;
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly worldRankings: boolean;
  readonly maximumHoops: number | null;
} & (
  | {
      readonly kind: "block";
      readonly bestOf: number;
      readonly rounds: number;
      /** How its players level on matches won are told apart, by code. */
      readonly tieBreak: string;
    }
  | { readonly kind: "swiss"; readonly bestOf: number }
  | {
      readonly kind: "knockout";
      readonly places: number;
      readonly rounds: readonly number[];
      /** Set for a losers knockout, whose places are however many lose the round. */
      readonly losersOf?: {
        readonly competition: string;
        readonly round: number;
      };
    }
);

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Whether the tournament's sport has world rankings, which a competition may count towards. */
  readonly ranked: boolean;
  /** The most hoops a game of the sport is played to unless one says otherwise. */
  readonly usualMaximumHoops: number;
  /** Nothing when adding, and the competition when changing one. */
  readonly competition?: CompetitionAsItIs | undefined;
  /** Once a competition is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// A number as it was typed, or one that is no number where nothing was: the
// API refuses either as a best-of that is not whole or not enough.
const typedNumber = (typed: string): number =>
  typed.trim() === "" ? 0 : Number(typed);

// The field each refusal is about, where it is one field. A best-of refused
// in a knockout is about its rounds, and said beside each that breaks it.
const fieldOf = (
  code: string,
  kind: Kind,
):
  | "name"
  | "bestOf"
  | "places"
  | "rounds"
  | "playedIn"
  | "maximumHoops"
  | "tieBreak"
  | undefined =>
  code === "Tournament.MaximumHoopsInvalid"
    ? "maximumHoops"
    : code.startsWith("CompetitionName.") ||
        code === "Tournament.CompetitionNameTaken"
      ? "name"
      : code.startsWith("BestOf.")
        ? kind === "knockout"
          ? "rounds"
          : "bestOf"
        : code.startsWith("Rounds.")
          ? "playedIn"
          : code.startsWith("TieBreak.")
            ? "tieBreak"
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
  ranked,
  usualMaximumHoops,
  competition,
  kept,
  close,
}: Props): React.JSX.Element => {
  // A competition being changed begins as it is; one being added begins as a
  // block, the best of 1, or a knockout of 8 places each round the best of 1.
  const [name, setName] = useState(competition?.name ?? "");
  const [kind, setKind] = useState<Kind>(competition?.kind ?? "block");
  const [bestOf, setBestOf] = useState(
    competition !== undefined && competition.kind !== "knockout"
      ? String(competition.bestOf)
      : "1",
  );
  // How many rounds a block is played in, a field of a block alone.
  const [playedIn, setPlayedIn] = useState(
    competition?.kind === "block" ? String(competition.rounds) : "1",
  );
  // How a block's players level on matches won are told apart, a field of a
  // block alone.
  const [tieBreak, setTieBreak] = useState<string>(
    competition?.kind === "block"
      ? competition.tieBreak
      : TieBreak.unlessTold.code,
  );
  const [places, setPlaces] = useState(
    competition?.kind === "knockout" ? competition.places : 8,
  );
  const [rounds, setRounds] = useState<readonly string[]>(
    competition?.kind === "knockout"
      ? competition.rounds.map(String)
      : ["1", "1", "1"],
  );
  // Whether the dialog that adds a losers knockout is open over this one.
  const [addingLosers, setAddingLosers] = useState(false);
  // The losers knockouts asked for while adding a knockout, kept here until it
  // is added and added with it, since they take the losers of a knockout that
  // is not there to be sent to yet.
  const [asked, setAsked] = useState<readonly LosersAsked[]>([]);
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // What was last added, said until the next name is typed.
  const [said, setSaid] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const at = `/api/site/tournaments/${idInAddress(tournament)}/competitions`;

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.competition.otherwise"),
  });
  const refusedFor = (field: ReturnType<typeof fieldOf>): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code, kind) === field);
  const rules = useRules(
    competition,
    ranked,
    usualMaximumHoops,
    refusedFor("maximumHoops"),
  );
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
    // A round asked for is still the same round of the draw, which is nearer
    // the final by as many as are taken from the start, and gone with it
    // where it is taken.
    const shift = needed - rounds.length;
    setAsked((all) =>
      all
        .map((each) => ({ ...each, round: each.round + shift }))
        .filter(({ round }) => round >= 0),
    );
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
      const response = await fetch(
        competition === undefined ? at : `${at}/${idInAddress(competition.id)}`,
        {
          method: competition === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(
            kind === "knockout"
              ? {
                  kind,
                  name,
                  places,
                  rounds: rounds.map(typedNumber),
                  ...rules.said,
                  // Changing a knockout adds its losers knockouts as it goes.
                  ...(competition === undefined ? { losers: asked } : {}),
                }
              : kind === "block"
                ? {
                    kind,
                    name,
                    bestOf: typedNumber(bestOf),
                    rounds: typedNumber(playedIn),
                    tieBreak,
                    ...rules.said,
                  }
                : {
                    kind,
                    name,
                    bestOf: typedNumber(bestOf),
                    ...rules.said,
                  },
          ),
        },
      );
      if (response.ok) {
        setRefused([]);
        setAsked([]);
        kept();
        if (competition !== undefined) {
          close();
          return;
        }
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

  useFocusFirstRefused(refused);

  const above = refusedFor(undefined);

  return (
    <>
      <ModalDialog
        help={standardHelp(
          "competitions",
          competition === undefined
            ? "adding-a-competition"
            : "changing-a-competition",
        )}
        title={say(
          competition === undefined
            ? "admin.competition.addTitle"
            : "admin.competition.editTitle",
        )}
        action={say(
          competition === undefined
            ? "admin.competition.add"
            : "admin.competition.save",
        )}
        hover={
          competition === undefined
            ? say("admin.hover.dialog.competition.add")
            : say("admin.hover.dialog.competition.save")
        }
        act={() => void send()}
        cancel={close}
        busy={sending}
      >
        <DialogStatus>
          {said === undefined
            ? null
            : say("admin.competition.added", { name: said })}
        </DialogStatus>
        <DialogProblems refused={above} />
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
        {/* Not asked of a competition being changed: no change makes a block a
          knockout, so a choice here could only be refused. */}
        {competition === undefined ? (
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
        ) : null}
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
                  // A losers knockout has as many places as the round it
                  // takes losers from has matches, which only that round can
                  // change.
                  disabled={
                    competition?.kind === "knockout" &&
                    competition.losersOf !== undefined
                  }
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
            {/* Of a knockout that exists, since it is its losers that play on,
              and of one with a round besides the final to take them from. */}
            {rounds.length > 1 ? (
              <p>
                <button
                  type="button"
                  className="button"
                  title={say("admin.hover.losers.add")}
                  onClick={() => {
                    setAddingLosers(true);
                  }}
                >
                  {say("admin.losers.add")}
                </button>
              </p>
            ) : null}
            {asked.length === 0 ? null : (
              <ul className="listed" data-listed="losers-asked">
                {asked.map((each, place) => (
                  <li
                    key={`${each.name}-${String(place)}`}
                    className="listed-item"
                  >
                    <span className="listed-name">{each.name}</span>
                    <span className="listed-about">
                      {say("admin.losers.option", {
                        round: roundLabel(each.round, rounds.length),
                        count: String(2 ** (rounds.length - 1 - each.round)),
                      })}
                    </span>
                    <span className="listed-options">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setAsked((all) =>
                            all.filter((_, at) => at !== place),
                          );
                        }}
                      >
                        {say("admin.losers.remove")}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
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
            {/* A block alone is played in rounds: a Swiss pairs its players as
              it goes. */}
            {kind === "block" ? (
              <Field
                name="rounds"
                label={say("admin.competition.rounds")}
                refused={refusedFor("playedIn")}
              >
                {(tied) => (
                  <input
                    {...tied}
                    type="text"
                    inputMode="numeric"
                    placeholder=" "
                    autoComplete="off"
                    value={playedIn}
                    onChange={(event) => {
                      setPlayedIn(event.target.value);
                    }}
                  />
                )}
              </Field>
            ) : null}
            {kind === "block" ? (
              <Field
                name="tie-break"
                label={say("admin.competition.tieBreaks")}
                refused={refusedFor("tieBreak")}
                lifted
              >
                {(tied) => (
                  <select
                    {...tied}
                    value={tieBreak}
                    onChange={(event) => {
                      setTieBreak(event.target.value);
                    }}
                  >
                    {tieBreaksOffered.map((offered) => (
                      <option key={offered} value={offered}>
                        {say(`admin.competition.tieBreak.${offered}`)}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            ) : null}
          </>
        )}
        {rules.ticks}
      </ModalDialog>
      {/* Beside the dialog and not in it: its own form must not be inside this
        one's, whose submit would be taken as this one's. */}
      {addingLosers && competition === undefined ? (
        <LosersDialog
          rounds={rounds.length - 1}
          keep={(each) => {
            setAsked((all) => [...all, each]);
          }}
          close={() => {
            setAddingLosers(false);
          }}
        />
      ) : null}
      {addingLosers && competition?.kind === "knockout" ? (
        <LosersDialog
          tournament={tournament}
          competition={competition.id}
          rounds={competition.rounds.length - 1}
          kept={kept}
          close={() => {
            setAddingLosers(false);
          }}
        />
      ) : null}
    </>
  );
};
