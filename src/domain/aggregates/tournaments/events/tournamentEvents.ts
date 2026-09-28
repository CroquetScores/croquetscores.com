// The name each of a tournament's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import type { EventRegistry } from "../../../common/EventRegistry.js";
import { BlockAdded } from "./BlockAdded.js";
import { BlockUpdated } from "./BlockUpdated.js";
import { CompetitionArchived } from "./CompetitionArchived.js";
import { CompetitionMoved } from "./CompetitionMoved.js";
import { CompetitionRestored } from "./CompetitionRestored.js";
import { CompetitionsSpacedOut } from "./CompetitionsSpacedOut.js";
import { KnockoutAdded } from "./KnockoutAdded.js";
import { KnockoutUpdated } from "./KnockoutUpdated.js";
import { ManagerAdded } from "./ManagerAdded.js";
import { ManagerRemoved } from "./ManagerRemoved.js";
import { ScorerAdded } from "./ScorerAdded.js";
import { ScorerRemoved } from "./ScorerRemoved.js";
import { SwissAdded } from "./SwissAdded.js";
import { SwissUpdated } from "./SwissUpdated.js";
import { TournamentArchived } from "./TournamentArchived.js";
import {
  TournamentCreated,
  type WrittenTournament,
} from "./TournamentCreated.js";
import { TournamentPlayerAdded } from "./TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "./TournamentPlayerArchived.js";
import { TournamentPlayerMoved } from "./TournamentPlayerMoved.js";
import { TournamentPlayerRestored } from "./TournamentPlayerRestored.js";
import { TournamentPlayersSpacedOut } from "./TournamentPlayersSpacedOut.js";
import { TournamentPlayerUpdated } from "./TournamentPlayerUpdated.js";
import { TournamentRestored } from "./TournamentRestored.js";
import { TournamentUpdated } from "./TournamentUpdated.js";

type Said = Readonly<Record<string, unknown>>;

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at, and
// one that is there but is not what the event says there is refused the same,
// since an order kept as text is no more an order than a missing one. The
// registry says which event it was.
const unreadable = (field: string): never => {
  throw new TypeError(`it has no ${field} that can be read`);
};

const text = (said: Said, field: string): string => {
  const value = said[field];
  return typeof value === "string" ? value : unreadable(field);
};

// A field an event can do without, and which JSON leaves out when it is.
const optionalText = (said: Said, field: string): string | undefined =>
  said[field] === undefined ? undefined : text(said, field);

const number = (said: Said, field: string): number => {
  const value = said[field];
  return typeof value === "number" ? value : unreadable(field);
};

const texts = (said: Said, field: string): string[] => {
  const value = said[field];
  return Array.isArray(value) &&
    value.every((each): each is string => typeof each === "string")
    ? value
    : unreadable(field);
};

const numbers = (said: Said, field: string): number[] => {
  const value = said[field];
  return Array.isArray(value) &&
    value.every((each): each is number => typeof each === "number")
    ? value
    : unreadable(field);
};

const yesOrNo = (said: Said, field: string): boolean => {
  const value = said[field];
  return typeof value === "boolean" ? value : unreadable(field);
};

// Everything creating a tournament and updating it both say.
const tournament = (said: Said): WrittenTournament => ({
  name: text(said, "name"),
  starts: text(said, "starts"),
  finishes: text(said, "finishes"),
  format: text(said, "format"),
  sport: text(said, "sport"),
  country: text(said, "country"),
  region: text(said, "region"),
  notes: optionalText(said, "notes"),
  handicap: yesOrNo(said, "handicap"),
  // Asked only since drawn games could be allowed, so a tournament kept before
  // says nothing of it, and allowed none.
  drawsAllowed:
    said["drawsAllowed"] === undefined ? false : yesOrNo(said, "drawsAllowed"),
  worldRankings: yesOrNo(said, "worldRankings"),
  national: yesOrNo(said, "national"),
  international: yesOrNo(said, "international"),
  address: text(said, "address"),
});

/** `registry`, knowing every kind of event a tournament records. */
export const nameTournamentEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      TournamentCreated,
      "tournament-created",
      (said, { createdBy, occurredAt }) =>
        new TournamentCreated(
          text(said, "website"),
          tournament(said),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentUpdated,
      "tournament-updated",
      (said, { createdBy, occurredAt }) =>
        new TournamentUpdated(tournament(said), createdBy, occurredAt),
    )
    .name(
      TournamentArchived,
      "tournament-archived",
      (_said, { createdBy, occurredAt }) =>
        new TournamentArchived(createdBy, occurredAt),
    )
    .name(
      TournamentRestored,
      "tournament-restored",
      (_said, { createdBy, occurredAt }) =>
        new TournamentRestored(createdBy, occurredAt),
    )
    .name(
      TournamentPlayerAdded,
      "tournament-player-added",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerAdded(
          text(said, "playerId"),
          text(said, "name"),
          optionalText(said, "representing"),
          optionalText(said, "flag"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerUpdated,
      "tournament-player-updated",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerUpdated(
          text(said, "playerId"),
          text(said, "name"),
          optionalText(said, "representing"),
          optionalText(said, "flag"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerArchived,
      "tournament-player-archived",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerArchived(
          text(said, "playerId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerMoved,
      "tournament-player-moved",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerMoved(
          text(said, "playerId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayersSpacedOut,
      "tournament-players-spaced-out",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayersSpacedOut(
          texts(said, "playerIds"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerRestored,
      "tournament-player-restored",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerRestored(
          text(said, "playerId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      BlockAdded,
      "tournament-block-added",
      (said, { createdBy, occurredAt }) =>
        new BlockAdded(
          text(said, "competitionId"),
          text(said, "name"),
          text(said, "slug"),
          number(said, "order"),
          number(said, "bestOf"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      BlockUpdated,
      "tournament-block-updated",
      (said, { createdBy, occurredAt }) =>
        new BlockUpdated(
          text(said, "competitionId"),
          text(said, "name"),
          number(said, "bestOf"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      KnockoutAdded,
      "tournament-knockout-added",
      (said, { createdBy, occurredAt }) =>
        new KnockoutAdded(
          text(said, "competitionId"),
          text(said, "name"),
          text(said, "slug"),
          number(said, "order"),
          number(said, "places"),
          numbers(said, "rounds"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      KnockoutUpdated,
      "tournament-knockout-updated",
      (said, { createdBy, occurredAt }) =>
        new KnockoutUpdated(
          text(said, "competitionId"),
          text(said, "name"),
          number(said, "places"),
          numbers(said, "rounds"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      SwissAdded,
      "tournament-swiss-added",
      (said, { createdBy, occurredAt }) =>
        new SwissAdded(
          text(said, "competitionId"),
          text(said, "name"),
          text(said, "slug"),
          number(said, "order"),
          number(said, "bestOf"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      SwissUpdated,
      "tournament-swiss-updated",
      (said, { createdBy, occurredAt }) =>
        new SwissUpdated(
          text(said, "competitionId"),
          text(said, "name"),
          number(said, "bestOf"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      ManagerAdded,
      "tournament-manager-added",
      (said, { createdBy, occurredAt }) =>
        new ManagerAdded(text(said, "account"), createdBy, occurredAt),
    )
    .name(
      ManagerRemoved,
      "tournament-manager-removed",
      (said, { createdBy, occurredAt }) =>
        new ManagerRemoved(text(said, "account"), createdBy, occurredAt),
    )
    .name(
      ScorerAdded,
      "tournament-scorer-added",
      (said, { createdBy, occurredAt }) =>
        new ScorerAdded(text(said, "account"), createdBy, occurredAt),
    )
    .name(
      ScorerRemoved,
      "tournament-scorer-removed",
      (said, { createdBy, occurredAt }) =>
        new ScorerRemoved(text(said, "account"), createdBy, occurredAt),
    )
    .name(
      CompetitionArchived,
      "tournament-competition-archived",
      (said, { createdBy, occurredAt }) =>
        new CompetitionArchived(
          text(said, "competitionId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionRestored,
      "tournament-competition-restored",
      (said, { createdBy, occurredAt }) =>
        new CompetitionRestored(
          text(said, "competitionId"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionMoved,
      "tournament-competition-moved",
      (said, { createdBy, occurredAt }) =>
        new CompetitionMoved(
          text(said, "competitionId"),
          number(said, "order"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionsSpacedOut,
      "tournament-competitions-spaced-out",
      (said, { createdBy, occurredAt }) =>
        new CompetitionsSpacedOut(
          texts(said, "competitionIds"),
          createdBy,
          occurredAt,
        ),
    );
