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
//
// In a test, whose players are its two teams', the players are offered under
// their teams' names, and once the winner is chosen the loser is offered from
// the other team alone, since nobody plays their own team
// (test-score.feature).

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  /** Whether the competition is a test, whose players are its teams'. */
  readonly inATest?: boolean;
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

/** One of a test's two teams, with its players in use, as the API lists them. */
interface TeamInTest {
  readonly id: string;
  readonly name: string;
  readonly players: readonly { readonly id: string; readonly name: string }[];
}

type Part = "winner" | "winnerScore" | "loser" | "loserScore";

// What a test's player archived while the dialog is open is refused with.
const ARCHIVED = "TeamPlayer.Archived";

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
  inATest = false,
  correcting,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [players, setPlayers] = useState<readonly Player[]>([]);
  // A test's teams, which its players are offered under.
  const [teams, setTeams] = useState<readonly TeamInTest[] | undefined>();
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
    if (inATest) {
      void fetch(`${at}/teams`, { headers: { accept: "application/json" } })
        .then(async (response) =>
          response.ok
            ? ((await response.json()) as { teams: TeamInTest[] }).teams
            : [],
        )
        .catch(() => [])
        .then((answered) => {
          setTeams(answered);
          setPlayers(
            answered.flatMap(({ players: ofTeam }) =>
              ofTeam.map(({ id, name }) => ({
                id,
                name,
                withdrawn: false,
                bye: false,
              })),
            ),
          );
        });
    } else {
      void fetch(`${at}/players`, { headers: { accept: "application/json" } })
        .then(async (response) =>
          response.ok
            ? ((await response.json()) as { players: Player[] }).players
            : [],
        )
        .catch(() => [])
        .then(setPlayers);
    }
    fields.winner.current?.focus();
  }, [at, choosingPlayers, inATest]);

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
  // The team of a test's player, by their id.
  const teamOf = (id: string): string | undefined =>
    teams?.find(({ players: ofTeam }) => ofTeam.some((each) => each.id === id))
      ?.id;
  // A competition's players are named by the part of their ids after their
  // kind, and a test's by their whole ids, since they are its teams' rather
  // than its own (api/v1).
  const sentAs = (id: string): string => (inATest ? id : idInAddress(id));

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

  // Which of the players chosen in a test has been archived since the dialog
  // opened, asked again of the test, since the refusal says only that one
  // was: it is said beneath the field they were chosen in.
  const archivedPart = async (): Promise<Part | undefined> => {
    const now = await fetch(`${at}/teams`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { teams: TeamInTest[] }).teams
          : undefined,
      )
      .catch(() => undefined);
    if (now === undefined) return undefined;
    const inUse = new Set(
      now.flatMap(({ players: ofTeam }) => ofTeam.map(({ id }) => id)),
    );
    return !inUse.has(said.winner)
      ? "winner"
      : !inUse.has(said.loser)
        ? "loser"
        : undefined;
  };

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
                  winner: sentAs(said.winner),
                  winnerScore: said.winnerScore,
                  loser: sentAs(said.loser),
                  loserScore: said.loserScore,
                }
              : {
                  winnerScore: said.winnerScore,
                  loserScore: said.loserScore,
                  // Sent only where they can change: the game's own
                  // otherwise, which the correction keeps.
                  ...(choosingPlayers
                    ? {
                        winner: sentAs(said.winner),
                        loser: sentAs(said.loser),
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
        const code = answer.error ?? "Unknown";
        setRefused(
          answer.broken?.map(({ code: broken, fields: about }) =>
            refusal(broken, (about[0] as Part | undefined) ?? partOf[broken]),
          ) ?? [
            refusal(
              code,
              code === ARCHIVED ? await archivedPart() : partOf[code],
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
            // In a test nobody plays their own team, so a loser of the
            // winner's team is no longer chosen.
            const ownTeam =
              part === "winner" &&
              inATest &&
              said.loser !== "" &&
              teamOf(said.loser) === teamOf(chosen);
            setSaid({
              ...said,
              [part]: chosen,
              ...(opponent === undefined ? {} : { loser: opponent }),
              ...(ownTeam ? { loser: "" } : {}),
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
          {teams === undefined
            ? playing.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))
            : teams
                // The loser from the team the winner is not in, once the
                // winner is chosen, and from either until then.
                .filter(
                  ({ id }) =>
                    part === "winner" ||
                    said.winner === "" ||
                    teamOf(said.winner) !== id,
                )
                .map((team) => (
                  <optgroup key={team.id} label={team.name}>
                    {team.players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </optgroup>
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
