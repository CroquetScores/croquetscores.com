// The name each of a tournament's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import {
  type EventRegistry,
  EventRegistryRefused,
} from "../../../common/EventRegistry.js";
import { BlockAdded } from "./BlockAdded.js";
import { BlockUpdated } from "./BlockUpdated.js";
import { CompetitionArchived } from "./CompetitionArchived.js";
import { CompetitionRestored } from "./CompetitionRestored.js";
import { KnockoutAdded } from "./KnockoutAdded.js";
import { KnockoutUpdated } from "./KnockoutUpdated.js";
import { SwissAdded } from "./SwissAdded.js";
import { SwissUpdated } from "./SwissUpdated.js";
import { TournamentArchived } from "./TournamentArchived.js";
import {
  TournamentCreated,
  type WrittenTournament,
} from "./TournamentCreated.js";
import { TournamentPlayerAdded } from "./TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "./TournamentPlayerArchived.js";
import { TournamentPlayerRestored } from "./TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "./TournamentPlayerUpdated.js";
import { TournamentRestored } from "./TournamentRestored.js";
import { TournamentUpdated } from "./TournamentUpdated.js";

type Said = Readonly<Record<string, unknown>>;

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at, and
// one that is there but is not what the event says there is refused the same,
// since an order kept as text is no more an order than a missing one. Refused
// as the registry refuses what cannot say who caused it or when, so that
// whatever reads a stream has one code to answer for an unreadable event.
const unreadable = (name: string, field: string): never => {
  throw new EventRegistryRefused(
    "EventRegistry.Unreadable",
    `What was kept as "${name}" has no ${field} that can be read.`,
  );
};

const text = (said: Said, field: string, name: string): string => {
  const value = said[field];
  return typeof value === "string" ? value : unreadable(name, field);
};

// A field an event can do without, and which JSON leaves out when it is.
const optionalText = (
  said: Said,
  field: string,
  name: string,
): string | undefined =>
  said[field] === undefined ? undefined : text(said, field, name);

const number = (said: Said, field: string, name: string): number => {
  const value = said[field];
  return typeof value === "number" ? value : unreadable(name, field);
};

const numbers = (said: Said, field: string, name: string): number[] => {
  const value = said[field];
  return Array.isArray(value) &&
    value.every((each): each is number => typeof each === "number")
    ? value
    : unreadable(name, field);
};

const yesOrNo = (said: Said, field: string, name: string): boolean => {
  const value = said[field];
  return typeof value === "boolean" ? value : unreadable(name, field);
};

// Everything creating a tournament and updating it both say.
const tournament = (said: Said, name: string): WrittenTournament => ({
  name: text(said, "name", name),
  starts: text(said, "starts", name),
  finishes: text(said, "finishes", name),
  format: text(said, "format", name),
  sport: text(said, "sport", name),
  country: text(said, "country", name),
  region: text(said, "region", name),
  notes: optionalText(said, "notes", name),
  handicap: yesOrNo(said, "handicap", name),
  worldRankings: yesOrNo(said, "worldRankings", name),
  national: yesOrNo(said, "national", name),
  international: yesOrNo(said, "international", name),
  address: text(said, "address", name),
});

/** `registry`, knowing every kind of event a tournament records. */
export const nameTournamentEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      TournamentCreated,
      "tournament-created",
      (said, { createdBy, occurredAt }) =>
        new TournamentCreated(
          text(said, "website", "tournament-created"),
          tournament(said, "tournament-created"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentUpdated,
      "tournament-updated",
      (said, { createdBy, occurredAt }) =>
        new TournamentUpdated(
          tournament(said, "tournament-updated"),
          createdBy,
          occurredAt,
        ),
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
          text(said, "playerId", "tournament-player-added"),
          text(said, "name", "tournament-player-added"),
          optionalText(said, "represents", "tournament-player-added"),
          optionalText(said, "flag", "tournament-player-added"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerUpdated,
      "tournament-player-updated",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerUpdated(
          text(said, "playerId", "tournament-player-updated"),
          text(said, "name", "tournament-player-updated"),
          optionalText(said, "represents", "tournament-player-updated"),
          optionalText(said, "flag", "tournament-player-updated"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerArchived,
      "tournament-player-archived",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerArchived(
          text(said, "playerId", "tournament-player-archived"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      TournamentPlayerRestored,
      "tournament-player-restored",
      (said, { createdBy, occurredAt }) =>
        new TournamentPlayerRestored(
          text(said, "playerId", "tournament-player-restored"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      BlockAdded,
      "tournament-block-added",
      (said, { createdBy, occurredAt }) =>
        new BlockAdded(
          text(said, "competitionId", "tournament-block-added"),
          text(said, "name", "tournament-block-added"),
          text(said, "slug", "tournament-block-added"),
          number(said, "order", "tournament-block-added"),
          number(said, "bestOf", "tournament-block-added"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      BlockUpdated,
      "tournament-block-updated",
      (said, { createdBy, occurredAt }) =>
        new BlockUpdated(
          text(said, "competitionId", "tournament-block-updated"),
          text(said, "name", "tournament-block-updated"),
          number(said, "bestOf", "tournament-block-updated"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      KnockoutAdded,
      "tournament-knockout-added",
      (said, { createdBy, occurredAt }) =>
        new KnockoutAdded(
          text(said, "competitionId", "tournament-knockout-added"),
          text(said, "name", "tournament-knockout-added"),
          text(said, "slug", "tournament-knockout-added"),
          number(said, "order", "tournament-knockout-added"),
          number(said, "places", "tournament-knockout-added"),
          numbers(said, "rounds", "tournament-knockout-added"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      KnockoutUpdated,
      "tournament-knockout-updated",
      (said, { createdBy, occurredAt }) =>
        new KnockoutUpdated(
          text(said, "competitionId", "tournament-knockout-updated"),
          text(said, "name", "tournament-knockout-updated"),
          number(said, "places", "tournament-knockout-updated"),
          numbers(said, "rounds", "tournament-knockout-updated"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      SwissAdded,
      "tournament-swiss-added",
      (said, { createdBy, occurredAt }) =>
        new SwissAdded(
          text(said, "competitionId", "tournament-swiss-added"),
          text(said, "name", "tournament-swiss-added"),
          text(said, "slug", "tournament-swiss-added"),
          number(said, "order", "tournament-swiss-added"),
          number(said, "bestOf", "tournament-swiss-added"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      SwissUpdated,
      "tournament-swiss-updated",
      (said, { createdBy, occurredAt }) =>
        new SwissUpdated(
          text(said, "competitionId", "tournament-swiss-updated"),
          text(said, "name", "tournament-swiss-updated"),
          number(said, "bestOf", "tournament-swiss-updated"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionArchived,
      "tournament-competition-archived",
      (said, { createdBy, occurredAt }) =>
        new CompetitionArchived(
          text(said, "competitionId", "tournament-competition-archived"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      CompetitionRestored,
      "tournament-competition-restored",
      (said, { createdBy, occurredAt }) =>
        new CompetitionRestored(
          text(said, "competitionId", "tournament-competition-restored"),
          createdBy,
          occurredAt,
        ),
    );
