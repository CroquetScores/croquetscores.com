// What the pages of a tournament a reader follows share, whichever section of
// it they show: the tournament found by the address a reader's browser names,
// and what its section bar leads to.
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

/** A competition as a tournament's pages lead to it. */
export interface CompetitionOfTournament {
  readonly name: string;
  /** Where it is found, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
}

/**
 * The tournament of `website` found at `address`, now or before, as a reader
 * may follow it, or refused as `operation`'s `NoSuchTournament`: where no
 * tournament has been found at the address, where the one found is another
 * website's, since an address is a website's own, and where it is archived,
 * since an archived tournament is not one a reader is sent to.
 */
export const tournamentForReaders = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  addresses: TournamentAddresses,
  website: Website,
  address: string,
  operation: string,
): Promise<Tournament> => {
  const id = await addresses.tournamentAt(address);
  const tournament = id === undefined ? undefined : await tournaments.load(id);
  if (
    tournament === undefined ||
    !tournament.website.equals(website) ||
    tournament.archived
  ) {
    throw new TournamentOperationRefused(
      `${operation}.NoSuchTournament`,
      "There is no such tournament.",
    );
  }
  return tournament;
};

/**
 * The competitions of `tournament` in use, in its order, each found under its
 * address: a test under "tests", and any other kind under "competitions".
 */
export const competitionsInUse = (
  tournament: Tournament,
): readonly CompetitionOfTournament[] => {
  const address = tournament.address.toString();
  return tournament.competitions
    .filter(({ reference }) => !reference.archived)
    .map(({ reference, shape }) => ({
      name: reference.name.toString(),
      address: `${address}/${shape.kind === "test" ? "tests" : "competitions"}/${reference.slug.toString()}`,
    }));
};
