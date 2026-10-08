// The name each of a competition's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import type { EventRegistry } from "../../../../common/EventRegistry.js";
import { CompetitionByeMoved } from "./CompetitionByeMoved.js";
import { CompetitionByeRemoved } from "./CompetitionByeRemoved.js";
import { CompetitionGameAdded } from "./CompetitionGameAdded.js";
import { CompetitionGameArchived } from "./CompetitionGameArchived.js";
import { CompetitionGameCorrected } from "./CompetitionGameCorrected.js";
import { CompetitionGameMoved } from "./CompetitionGameMoved.js";
import { CompetitionGameRestored } from "./CompetitionGameRestored.js";
import { CompetitionGameWithdrawalReversed } from "./CompetitionGameWithdrawalReversed.js";
import { CompetitionGameWithdrawn } from "./CompetitionGameWithdrawn.js";
import { CompetitionPlayerCarryForwardChanged } from "./CompetitionPlayerCarryForwardChanged.js";
import { CompetitionPlayerEntered } from "./CompetitionPlayerEntered.js";
import { CompetitionPlayerMoved } from "./CompetitionPlayerMoved.js";
import { CompetitionPlayerRemoved } from "./CompetitionPlayerRemoved.js";
import { CompetitionPlayersSpacedOut } from "./CompetitionPlayersSpacedOut.js";
import { CompetitionPlayerWithdrawalReversed } from "./CompetitionPlayerWithdrawalReversed.js";
import { CompetitionPlayerWithdrawn } from "./CompetitionPlayerWithdrawn.js";

type Said = Readonly<Record<string, unknown>>;

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at,
// and one that is there but is not what the event says there is refused the
// same. The registry says which event it was.
const unreadable = (field: string): never => {
  throw new TypeError(`it has no ${field} that can be read`);
};

const text = (said: Said, field: string): string => {
  const value = said[field];
  return typeof value === "string" ? value : unreadable(field);
};

const texts = (said: Said, field: string): string[] => {
  const value = said[field];
  return Array.isArray(value) &&
    value.every((each): each is string => typeof each === "string")
    ? value
    : unreadable(field);
};

const number = (said: Said, field: string): number => {
  const value = said[field];
  return typeof value === "number" ? value : unreadable(field);
};

// A field an event can do without, which is nothing where it is not there,
// and refused as any is where it is there but is not text.
const optionalText = (said: Said, field: string): string | undefined =>
  said[field] === undefined ? undefined : text(said, field);

// The same, for a field that is a number when it is there.
const optionalNumber = (said: Said, field: string): number | undefined =>
  said[field] === undefined ? undefined : number(said, field);

const yesOrNo = (said: Said, field: string): boolean => {
  const value = said[field];
  return typeof value === "boolean" ? value : unreadable(field);
};

/** `registry`, knowing every one of a competition's events by its name. */
export const nameCompetitionEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      CompetitionPlayerEntered,
      "competition-player-entered",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerEntered(
          text(said, "playerId"),
          text(said, "tournamentPlayerId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayerMoved,
      "competition-player-moved",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerMoved(
          text(said, "playerId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayersSpacedOut,
      "competition-players-spaced-out",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayersSpacedOut(
          texts(said, "playerIds"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayerWithdrawn,
      "competition-player-withdrawn",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerWithdrawn(
          text(said, "playerId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayerWithdrawalReversed,
      "competition-player-withdrawal-reversed",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerWithdrawalReversed(
          text(said, "playerId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayerCarryForwardChanged,
      "competition-player-carry-forward-changed",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerCarryForwardChanged(
          text(said, "playerId"),
          {
            matchWins: optionalNumber(said, "matchWins"),
            matchLosses: optionalNumber(said, "matchLosses"),
            gameWins: optionalNumber(said, "gameWins"),
            gameLosses: optionalNumber(said, "gameLosses"),
            hoopsFor: optionalNumber(said, "hoopsFor"),
            hoopsAgainst: optionalNumber(said, "hoopsAgainst"),
          },
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionPlayerRemoved,
      "competition-player-removed",
      (said, { createdBy, occurredAt }) =>
        new CompetitionPlayerRemoved(
          text(said, "playerId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionByeMoved,
      "competition-bye-moved",
      (said, { createdBy, occurredAt }) =>
        new CompetitionByeMoved(
          number(said, "fromOrder"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionByeRemoved,
      "competition-bye-removed",
      (said, { createdBy, occurredAt }) =>
        new CompetitionByeRemoved(number(said, "order"), createdBy, occurredAt),
    )
    .name(
      CompetitionGameAdded,
      "competition-game-added",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameAdded(
          text(said, "gameId"),
          text(said, "winnerId"),
          text(said, "winnerScore"),
          yesOrNo(said, "winnerMarked"),
          text(said, "loserId"),
          text(said, "loserScore"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionGameArchived,
      "competition-game-archived",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameArchived(
          text(said, "gameId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionGameMoved,
      "competition-game-moved",
      (said, { createdBy, occurredAt }) => {
        const direction = text(said, "direction");
        return new CompetitionGameMoved(
          text(said, "gameId"),
          direction === "up" || direction === "down"
            ? direction
            : unreadable("direction"),
          createdBy,
          occurredAt,
        );
      },
    )
    .name(
      CompetitionGameRestored,
      "competition-game-restored",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameRestored(
          text(said, "gameId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionGameWithdrawn,
      "competition-game-withdrawn",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameWithdrawn(
          text(said, "gameId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionGameWithdrawalReversed,
      "competition-game-withdrawal-reversed",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameWithdrawalReversed(
          text(said, "gameId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionGameCorrected,
      "competition-game-corrected",
      (said, { createdBy, occurredAt }) =>
        new CompetitionGameCorrected(
          text(said, "gameId"),
          text(said, "winnerScore"),
          yesOrNo(said, "winnerMarked"),
          text(said, "loserScore"),
          optionalText(said, "winnerId"),
          optionalText(said, "loserId"),
          createdBy,
          occurredAt,
        ),
    );
