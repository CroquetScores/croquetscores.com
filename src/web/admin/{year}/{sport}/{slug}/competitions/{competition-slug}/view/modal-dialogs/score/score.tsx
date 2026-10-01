import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";
import "./score.css";

// The score dialog (score-modal-dialog.feature), over a competition's Scores
// tab: the winner and their score, "beat", the loser and theirs, as the result
// is said aloud. Scores come in a batch, so adding a game keeps it open, says
// which game was added and empties it for the next. Opened on a game, it
// corrects that game, and Save closes it, since a correction is one score and
// not a batch. Its players can be chosen again where the game could be
// archived; where it cannot, they are shown as they are and cannot be
// changed, since changing who won would leave a later game played by
// somebody who had not got there.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  /** The game to correct, as the Scores tab lists it, where one is. */
  readonly correcting?: Correcting | undefined;
  /** Once a game is added or corrected, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

/** A game as the Scores tab lists it, with as much as correcting it needs. */
export interface Correcting {
  readonly id: string;
  readonly winner: string;
  readonly winnerId: string;
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserId: string;
  readonly loserScore: string;
  /** Whether it could be archived, which is whether its players can change. */
  readonly archivable: boolean;
}

/** One of the competition's players, as the API lists them. */
interface Player {
  readonly id: string;
  readonly name: string;
  readonly withdrawn: boolean;
  /** In a knockout, who they are drawn to play now, by their id. */
  readonly drawnAgainst?: string;
  /** Whether this is a knockout's bye, which is nobody. */
  readonly bye: boolean;
}

type Part = "winner" | "winnerScore" | "loser" | "loserScore";

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// The part each refusal is about, where its code says. One about no one part
// is said above them all.
const partOf: Readonly<Record<string, Part>> = {
  "Game.WinnerMissing": "winner",
  "Game.WinnerScoreMissing": "winnerScore",
  "Game.WinnerNotAhead": "winnerScore",
  "Game.LoserMissing": "loser",
  "Game.SamePlayer": "loser",
  "Game.LoserScoreMissing": "loserScore",
  "Game.LoserMarked": "loserScore",
};

interface Refused extends Refusal {
  readonly part: Part | undefined;
}

export const ScoreDialog = ({
  tournament,
  competition,
  correcting,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [players, setPlayers] = useState<readonly Player[]>([]);
  // Whether the players are chosen, as they are when adding, rather than
  // shown as the game has them.
  const choosingPlayers = correcting === undefined || correcting.archivable;
  // A game corrected begins as it is, each score as it was typed.
  const [said, setSaid] = useState<Record<Part, string>>({
    winner: correcting?.winnerId ?? "",
    winnerScore: correcting?.winnerScore ?? "",
    loser: correcting?.loserId ?? "",
    loserScore: correcting?.loserScore ?? "",
  });
  const [refused, setRefused] = useState<readonly Refused[]>([]);
  // The game last added, said until the next winner is chosen.
  const [added, setAdded] = useState<
    { readonly winner: string; readonly loser: string } | undefined
  >();
  const [sending, setSending] = useState(false);
  const fields = {
    winner: useRef<HTMLSelectElement>(null),
    winnerScore: useRef<HTMLInputElement>(null),
    loser: useRef<HTMLSelectElement>(null),
    loserScore: useRef<HTMLInputElement>(null),
  };
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/competitions/${idInAddress(competition)}`;

  useEffect(() => {
    // A game that keeps its players has none to choose from, and begins on
    // what can be changed.
    if (!choosingPlayers) {
      fields.winnerScore.current?.focus();
      return;
    }
    void fetch(`${at}/players`, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { players: Player[] }).players
          : [],
      )
      .catch(() => [])
      .then(setPlayers);
    fields.winner.current?.focus();
  }, [at, choosingPlayers]);

  // A withdrawn player plays no more of the competition, and a bye is nobody.
  // A game corrected keeps its own players on offer even once they have
  // withdrawn, since it is still theirs, and its drop-downs would otherwise
  // begin on nobody while the correction kept them.
  const playing = players.filter(
    ({ id, withdrawn, bye }) =>
      !bye &&
      (!withdrawn || id === correcting?.winnerId || id === correcting?.loserId),
  );
  const nameOf = (id: string): string =>
    players.find((player) => player.id === id)?.name ?? "";

  const refusal = (code: string, part: Part | undefined): Refused => ({
    code,
    part,
    words: say(
      knows(code)
        ? code
        : correcting === undefined
          ? "admin.score.otherwise"
          : "admin.score.notCorrected",
    ),
  });

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        correcting === undefined
          ? `${at}/games`
          : `${at}/games/${idInAddress(correcting.id)}/correct`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(
            correcting === undefined
              ? {
                  winner: idInAddress(said.winner),
                  winnerScore: said.winnerScore,
                  loser: idInAddress(said.loser),
                  loserScore: said.loserScore,
                }
              : {
                  winnerScore: said.winnerScore,
                  loserScore: said.loserScore,
                  // Sent only where they can change: the game's own
                  // otherwise, which the correction keeps.
                  ...(choosingPlayers
                    ? {
                        winner: idInAddress(said.winner),
                        loser: idInAddress(said.loser),
                      }
                    : {}),
                },
          ),
        },
      );
      if (response.ok && correcting !== undefined) {
        kept();
        close();
        return;
      }
      if (response.ok) {
        setRefused([]);
        kept();
        // Emptied for the next, with the reader back on the winner.
        setAdded({ winner: nameOf(said.winner), loser: nameOf(said.loser) });
        setSaid({ winner: "", winnerScore: "", loser: "", loserScore: "" });
        fields.winner.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string; fields: string[] }[];
        };
        setAdded(undefined);
        setRefused(
          answer.broken?.map(({ code, fields: about }) =>
            refusal(code, (about[0] as Part | undefined) ?? partOf[code]),
          ) ?? [
            refusal(
              answer.error ?? "Unknown",
              partOf[answer.error ?? "Unknown"],
            ),
          ],
        );
      }
    } catch {
      setRefused([refusal("Unknown", undefined)]);
    }
    setSending(false);
  };

  // The reader is taken to the first part refused, as every refused form
  // takes them.
  useEffect(() => {
    const first = (["winner", "winnerScore", "loser", "loserScore"] as const)
      .filter((part) => refused.some((each) => each.part === part))
      .at(0);
    if (first !== undefined) fields[first].current?.focus();
  }, [refused]);

  const refusedFor = (part: Part | undefined): Refusal[] =>
    refused.filter((each) => each.part === part);

  const choosing = (part: "winner" | "loser", label: string) =>
    choosingPlayers ? (
      choosable(part, label)
    ) : (
      // Shown as the drop-down it is when adding, so that the dialog reads
      // the same either way, with the one player it has and nothing else.
      <Field name={part} label={say(label)} refused={refusedFor(part)} lifted>
        {(tied) => (
          <select {...tied} ref={fields[part]} disabled value="chosen">
            <option value="chosen">{correcting?.[part]}</option>
          </select>
        )}
      </Field>
    );

  const choosable = (part: "winner" | "loser", label: string) => (
    <Field name={part} label={say(label)} refused={refusedFor(part)} lifted>
      {(tied) => (
        <select
          {...tied}
          ref={fields[part]}
          value={said[part]}
          onChange={(event) => {
            const chosen = event.target.value;
            // In a knockout the winner's opponent is known, so it is chosen as
            // the loser, where the reader sees it and can choose another. Not
            // when correcting: who a player is drawn against is said with the
            // game being corrected counting, and its own loser is already
            // chosen.
            const opponent =
              part === "winner" && correcting === undefined
                ? players.find((player) => player.id === chosen)?.drawnAgainst
                : undefined;
            setSaid({
              ...said,
              [part]: chosen,
              ...(opponent === undefined ? {} : { loser: opponent }),
            });
            // Which game was added is no longer the news once the next winner
            // is chosen.
            if (part === "winner") setAdded(undefined);
          }}
        >
          {/* Nobody to begin with, so that a game is never put down against a
              player the reader did not choose. Not when correcting: the game
              already has its players, and the correction would keep its own
              in place of nobody. */}
          {correcting === undefined ? <option value="" /> : null}
          {playing.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      )}
    </Field>
  );

  const typing = (part: "winnerScore" | "loserScore", label: string) => (
    <Field name={part} label={say(label)} refused={refusedFor(part)}>
      {(tied) => (
        <input
          {...tied}
          ref={fields[part]}
          // What follows a score's number is typed as well, as "26tp", so it
          // is typed on a keyboard of letters rather than a keypad.
          type="text"
          placeholder=" "
          autoComplete="off"
          value={said[part]}
          onChange={(event) => {
            setSaid({ ...said, [part]: event.target.value });
          }}
        />
      )}
    </Field>
  );

  const above = refusedFor(undefined);

  return (
    <ModalDialog
      title={say(
        correcting === undefined
          ? "admin.score.title"
          : "admin.score.correctTitle",
      )}
      action={say(
        correcting === undefined ? "admin.score.add" : "admin.score.save",
      )}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      {/* Told to a screen reader as it changes, since nothing else on the
          dialog changes where the reader is. */}
      <p className="dialog-status" role="status">
        {added === undefined ? null : say("admin.score.added", added)}
      </p>
      {above.length > 0 ? (
        // The codes as well as the words, as a field's refusals carry them,
        // so that what was refused can be told apart from how it is said.
        <div
          className="dialog-problems"
          data-refused={above.map(({ code }) => code).join(" ")}
        >
          {above.map(({ code, words }) => (
            <p key={code}>{words}</p>
          ))}
        </div>
      ) : null}
      <div className="score-row">
        {choosing("winner", "admin.score.winner")}
        {typing("winnerScore", "admin.score.winnerScore")}
      </div>
      <p className="score-beat">{say("admin.score.beat")}</p>
      <div className="score-row">
        {choosing("loser", "admin.score.loser")}
        {typing("loserScore", "admin.score.loserScore")}
      </div>
    </ModalDialog>
  );
};
