// What the two answers about a competition for apps share (standings and
// games): finding the competition by the ids an app was given, and saying when
// it last changed.
import type { CompetitionReference } from "../../../domain/aggregates/tournaments/CompetitionReference.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type {
  CompetitionShape,
  Tournament,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import {
  TournamentOperationRefused,
  tournamentFor,
} from "./tournamentOperations.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/** Who a competition is, as an answer about it begins. */
export interface CompetitionHead {
  readonly id: string;
  readonly name: string;
  /** Block, Swiss, knockout, or test: the site's word for a match between two teams. */
  readonly kind: CompetitionShape["kind"];
  /** When anything was last kept of it. */
  readonly changedAt: ReadOnlyDate;
}

/** A competition found for an app, with its tournament. */
export interface CompetitionFound {
  readonly tournament: Tournament;
  readonly reference: CompetitionReference;
  readonly shape: CompetitionShape;
  readonly head: CompetitionHead;
}

/**
 * The competition `competition` of the tournament `tournament`, both by their
 * ids, of the website being read, or refused as `operation`'s
 * `NoSuchTournament` or `NoSuchCompetition`. An id that is none is refused as
 * one there is not, since an app that mistyped an address has no use for a
 * finer answer, and so is an archived tournament or competition, and a
 * competition of another tournament.
 *
 * Its `changedAt` is the read model's: when something was done in it, or its
 * tournament's events said something that changes what is told of it.
 */
export const competitionFoundFor = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  changes: Pick<TournamentsByWebsite, "changesOfTournament">,
  website: string,
  tournamentId: string,
  competitionId: string,
  operation: string,
): Promise<CompetitionFound> => {
  const tournament = await tournamentFor(
    tournaments,
    tournamentId,
    operation,
  ).catch((failure: unknown) => {
    if (!(failure instanceof ValidationError)) throw failure;
    throw noSuch(operation, "NoSuchTournament", "There is no such tournament.");
  });
  if (
    !tournament.website.equals(Website.from(website)) ||
    tournament.archived
  ) {
    throw noSuch(operation, "NoSuchTournament", "There is no such tournament.");
  }
  const found = tournament.competitions.find(
    ({ reference }) =>
      reference.id.value === competitionId && !reference.archived,
  );
  if (found === undefined) {
    throw noSuch(
      operation,
      "NoSuchCompetition",
      "There is no such competition.",
    );
  }
  const changed = await changes.changesOfTournament(tournament.id.value);
  if (changed === undefined) {
    throw new Error(`Nothing is kept of ${tournament.id.value}.`);
  }
  return {
    tournament,
    reference: found.reference,
    shape: found.shape,
    head: {
      id: found.reference.id.value,
      name: found.reference.name.toString(),
      kind: found.shape.kind,
      changedAt:
        changed.competitions.get(found.reference.id.value) ??
        changed.tournament,
    },
  };
};

const noSuch = (
  operation: string,
  which: "NoSuchTournament" | "NoSuchCompetition",
  sentence: string,
): TournamentOperationRefused =>
  new TournamentOperationRefused(`${operation}.${which}`, sentence);
