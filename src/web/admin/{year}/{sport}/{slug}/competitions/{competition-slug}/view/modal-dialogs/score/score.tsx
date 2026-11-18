import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import {
  standardHelp,
  teamsHelp,
} from "../../../../../../../../helpAddress.js";
import { knows, say } from "../../../../../../../../words.js";
import { idInAddress } from "../../../../../../../../api.js";
import "./score.css";
import { DialogProblems } from "../../../../../../../../DialogProblems.js";
import { DialogStatus } from "../../../../../../../../DialogStatus.js";

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
  /**
   * Whether it is played as Advantage Golf Croquet, whose games are entered as
   * the hoops each side made and its target in place of a score, and kept as
   * the scoring fractions they make (advantage.feature).
   */
  readonly advantage?: boolean;
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
  /** In an Advantage competition, what it was entered as, to correct it from. */
  readonly winnerHoops?: number | undefined;
  readonly winnerTarget?: number | undefined;
  readonly loserHoops?: number | undefined;
  readonly loserTarget?: number | undefined;
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

type Part =
  | "winner"
  | "winnerScore"
  | "winnerHoops"
  | "winnerTarget"
  | "loser"
  | "loserScore"
  | "loserHoops"
  | "loserTarget";

// The parts in the order the reader comes to them, which is the order the
// first refused is taken to.
const partsInOrder: readonly Part[] = [
  "winner",
  "winnerScore",
  "winnerHoops",
  "winnerTarget",
  "loser",
  "loserScore",
  "loserHoops",
  "loserTarget",
];

// What a scoring fraction refuses, with the part of a side it is about and
// what it is of the hoops and the target typed. A refusal says what was wrong
// and not whose it was, so the dialog works out which side broke it from what
// was typed, the winner's first, as the site asks them (ScoringFraction.ts).
const scoringFractionRefusals: Readonly<
  Record<
    string,
    {
      readonly part: "Hoops" | "Target";
      readonly brokenBy: (hoops: number, target: number) => boolean;
    }
  >
> = {
  "ScoringFraction.HoopsNotWhole": {
    part: "Hoops",
    brokenBy: (hoops) => !Number.isSafeInteger(hoops),
  },
  "ScoringFraction.HoopsNegative": {
    part: "Hoops",
    brokenBy: (hoops) => hoops < 0,
  },
  "ScoringFraction.TargetNotWhole": {
    part: "Target",
    brokenBy: (_hoops, target) => !Number.isSafeInteger(target),
  },
  "ScoringFraction.TargetTooSmall": {
    part: "Target",
    brokenBy: (_hoops, target) => target < 1,
  },
  "ScoringFraction.HoopsAboveTarget": {
    part: "Hoops",
    brokenBy: (hoops, target) => hoops > target,
  },
};

// What a test's player archived while the dialog is open is refused with.
const ARCHIVED = "TeamPlayer.Archived";

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
  advantage = false,
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
    winnerScore: advantage ? "" : (correcting?.winnerScore ?? ""),
    winnerHoops: String(correcting?.winnerHoops ?? ""),
    winnerTarget: String(correcting?.winnerTarget ?? ""),
    loser: correcting?.loserId ?? "",
    loserScore: advantage ? "" : (correcting?.loserScore ?? ""),
    loserHoops: String(correcting?.loserHoops ?? ""),
    loserTarget: String(correcting?.loserTarget ?? ""),
  });
  const emptied: Record<Part, string> = {
    winner: "",
    winnerScore: "",
    winnerHoops: "",
    winnerTarget: "",
    loser: "",
    loserScore: "",
    loserHoops: "",
    loserTarget: "",
  };
  const [refused, setRefused] = useState<readonly Refused[]>([]);
  // The game last added, said until the next winner is chosen.
  const [added, setAdded] = useState<
    { readonly winner: string; readonly loser: string } | undefined
  >();
  const [sending, setSending] = useState(false);
  const fields = {
    winner: useRef<HTMLSelectElement>(null),
    winnerScore: useRef<HTMLInputElement>(null),
    winnerHoops: useRef<HTMLInputElement>(null),
    winnerTarget: useRef<HTMLInputElement>(null),
    loser: useRef<HTMLSelectElement>(null),
    loserScore: useRef<HTMLInputElement>(null),
    loserHoops: useRef<HTMLInputElement>(null),
    loserTarget: useRef<HTMLInputElement>(null),
  };
  const at = `/api/site/tournaments/${idInAddress(tournament)}/competitions/${idInAddress(competition)}`;

  // What is refused, in its words: those it has of its own, or those for its
  // code where it has none.
  const refusal = (
    code: string,
    part: Part | undefined,
    words?: string,
  ): Refused => ({
    code,
    part,
    words:
      words ??
      say(
        knows(code)
          ? code
          : correcting === undefined
            ? "admin.score.otherwise"
            : "admin.score.notCorrected",
      ),
  });

  useEffect(() => {
    // A game that keeps its players has none to choose from, and begins on
    // what can be changed.
    if (!choosingPlayers) {
      (advantage ? fields.winnerHoops : fields.winnerScore).current?.focus();
      return;
    }
    // A list the site fails to answer is said, rather than offered as nobody,
    // which would look like a competition whose players had not yet arrived.
    // It says what could not be read and not that the game could not be added,
    // which the reader has not tried, and that the dialog is opened again to
    // ask again, since nothing asks again of itself. It is added to what is
    // already said, since the reader may have tried to add a game before the
    // list failed, and the answer of a dialog that has gone, or has asked
    // again, is not said at all.
    let asking = true;
    const unread = (): void => {
      if (!asking) return;
      const unreadRefusal = refusal(
        "Unknown",
        undefined,
        say("admin.score.playersUnread"),
      );
      setRefused((all) => [
        ...all.filter(({ words }) => words !== unreadRefusal.words),
        unreadRefusal,
      ]);
    };
    // A reply without the list asked for is no more a list than an error is.
    const asked = async <Item,>(
      list: "players" | "teams",
    ): Promise<Item[] | undefined> => {
      try {
        const response = await fetch(`${at}/${list}`, {
          headers: { accept: "application/json" },
        });
        if (!response.ok) return undefined;
        const body = (await response.json()) as Record<string, unknown>;
        const items = body[list];
        return Array.isArray(items) ? (items as Item[]) : undefined;
      } catch {
        return undefined;
      }
    };
    if (inATest) {
      void asked<TeamInTest>("teams").then((answered) => {
        if (!asking) return;
        if (answered === undefined) unread();
        const answeredTeams = answered ?? [];
        setTeams(answeredTeams);
        setPlayers(
          answeredTeams.flatMap(({ players: ofTeam }) =>
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
      void asked<Player>("players").then((answered) => {
        if (!asking) return;
        if (answered === undefined) unread();
        setPlayers(answered ?? []);
      });
    }
    fields.winner.current?.focus();
    return () => {
      asking = false;
    };
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
  // than its own (api/site).
  const sentAs = (id: string): string => (inATest ? id : idInAddress(id));

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

  // The part a refusal is about, where its code says: a winner not ahead is
  // about the winner's score, or in an Advantage competition their hoops, and a
  // scoring fraction's is about the hoops or the target of the side that broke
  // it.
  const partFor = (code: string): Part | undefined => {
    if (code === "Game.WinnerNotAhead")
      return advantage ? "winnerHoops" : "winnerScore";
    const asScoringFraction = scoringFractionRefusals[code];
    if (asScoringFraction === undefined) return partOf[code];
    const winnerBroke = asScoringFraction.brokenBy(
      Number(said.winnerHoops),
      Number(said.winnerTarget),
    );
    return `${winnerBroke ? "winner" : "loser"}${asScoringFraction.part}`;
  };

  // What is sent of the scores: the hoops and the target of each side in an
  // Advantage competition, and the scores as they were typed in any other.
  const sentScores = advantage
    ? {
        winnerHoops: said.winnerHoops,
        winnerTarget: said.winnerTarget,
        loserHoops: said.loserHoops,
        loserTarget: said.loserTarget,
      }
    : { winnerScore: said.winnerScore, loserScore: said.loserScore };

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
                  loser: sentAs(said.loser),
                  ...sentScores,
                }
              : {
                  ...sentScores,
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
        setSaid(emptied);
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
            refusal(broken, (about[0] as Part | undefined) ?? partFor(broken)),
          ) ?? [
            refusal(
              code,
              code === ARCHIVED ? await archivedPart() : partFor(code),
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
    const first = partsInOrder
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

  // A number of hoops or a target, typed on a keypad of numbers: unlike a
  // score it has nothing after its number.
  const typingANumber = (
    part: "winnerHoops" | "winnerTarget" | "loserHoops" | "loserTarget",
    label: string,
  ) => (
    <Field name={part} label={say(label)} refused={refusedFor(part)}>
      {(tied) => (
        <input
          {...tied}
          ref={fields[part]}
          type="text"
          inputMode="numeric"
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
      help={(inATest ? teamsHelp : standardHelp)(
        "scores",
        correcting === undefined ? "entering-a-score" : "correcting-a-score",
      )}
      title={say(
        correcting === undefined
          ? "admin.score.title"
          : "admin.score.correctTitle",
      )}
      action={say(
        correcting === undefined ? "admin.score.add" : "admin.score.save",
      )}
      hover={
        correcting === undefined
          ? say("admin.hover.dialog.score.add")
          : say("admin.hover.dialog.score.save")
      }
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      <DialogStatus>
        {added === undefined ? null : say("admin.score.added", added)}
      </DialogStatus>
      <DialogProblems refused={above} />
      <div className="score-row">
        {choosing("winner", "admin.score.winner")}
        {advantage ? (
          <>
            {typingANumber("winnerHoops", "admin.score.winnerHoops")}
            {typingANumber("winnerTarget", "admin.score.winnerTarget")}
          </>
        ) : (
          typing("winnerScore", "admin.score.winnerScore")
        )}
      </div>
      <p className="score-beat">{say("admin.score.beat")}</p>
      <div className="score-row">
        {choosing("loser", "admin.score.loser")}
        {advantage ? (
          <>
            {typingANumber("loserHoops", "admin.score.loserHoops")}
            {typingANumber("loserTarget", "admin.score.loserTarget")}
          </>
        ) : (
          typing("loserScore", "admin.score.loserScore")
        )}
      </div>
    </ModalDialog>
  );
};
