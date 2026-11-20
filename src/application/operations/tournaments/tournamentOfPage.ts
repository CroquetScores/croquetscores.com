// What the pages that read the read models only share, as the pages that read
// the aggregates share `tournamentForReaders.ts`: the tournament found by the
// address a reader's browser names, and the competition found by its slug.
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentFormat } from "../../../domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import { Website } from "../../../domain/common/Website.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import type {
  CompetitionOfPage,
  TournamentOfPage,
  TournamentPages,
} from "./tournamentPages.js";
import type { ManagerNoteChanged } from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  type TournamentOperationErrorCode,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

/**
 * The tournament of `website` found at `address`, now or before, as a reader
 * may follow it, or refused as `operation`'s `NoSuchTournament`: where no
 * tournament has been found at the address, where the one found is another
 * website's, since an address is a website's own, and where it is archived,
 * since an archived tournament is not one a reader is sent to.
 */
export const tournamentOfPage = async (
  addresses: TournamentAddresses,
  pages: TournamentPages,
  website: string,
  address: string,
  operation: string,
): Promise<TournamentOfPage> => {
  const id = await addresses.tournamentAt(address);
  const found = id === undefined ? undefined : await pages.tournament(id.value);
  if (
    found === undefined ||
    !Website.from(website).equals(Website.from(found.website)) ||
    found.archived
  ) {
    throw new TournamentOperationRefused(
      `${operation}.NoSuchTournament`,
      "There is no such tournament.",
    );
  }
  return found;
};

/**
 * The competition of `tournament` a reader asked for by `slug`, which is of the
 * kind `kind`, or refused: as `refusals.noSuchCompetition` where there is none
 * by that slug, an archived one being none, and as `refusals.notOfKind`, saying
 * so in `refusals.sentence`, where there is one of another kind. The codes are
 * the caller's to give, whole, since they are the contract.
 */
export const competitionOfPage = async (
  pages: TournamentPages,
  tournament: TournamentOfPage,
  slug: string,
  kind: CompetitionOfPage["kind"],
  refusals: {
    readonly noSuchCompetition: TournamentOperationErrorCode;
    readonly notOfKind: TournamentOperationErrorCode;
    readonly sentence: string;
  },
): Promise<CompetitionOfPage> => {
  const found = await pages.competition(tournament.id, slug);
  if (found === undefined) {
    throw new TournamentOperationRefused(
      refusals.noSuchCompetition,
      "The tournament has no such competition.",
    );
  }
  if (found.kind !== kind) {
    throw new TournamentOperationRefused(refusals.notOfKind, refusals.sentence);
  }
  return found;
};

/**
 * The format of `tournament`. A tournament whose format was not kept, as one
 * is before the read models are made again, is not guessed at: a page that
 * counts by it would answer wrongly, so it is refused.
 */
export const formatOfPage = (
  tournament: TournamentOfPage,
): TournamentFormat => {
  if (tournament.format === undefined) {
    throw new Error(
      `The tournament ${tournament.id} has no format kept: the read models are to be made again.`,
    );
  }
  return TournamentFormat.from(tournament.format);
};

/**
 * Where a player's page is found. A player with no slug is an archived one kept
 * before it was said, whom nobody is sent to but who may still be named as an
 * opponent, so they lead to the players' page, where they are not.
 */
export const playerPageOf = (
  tournamentAddress: string,
  slug: string | undefined,
): string =>
  slug === undefined
    ? `${tournamentAddress}/players`
    : `${tournamentAddress}/players/${slug}`;

/** Each note of the tournament with when it last changed, the most recent first. */
export const managerNotesChangedFor = async (
  notes: TournamentManagerNotes,
  tournament: TournamentOfPage,
): Promise<readonly ManagerNoteChanged[]> =>
  (await notes.of(TournamentId.from(tournament.id))).map(
    ({ id, changedAt }) => ({ id, changedAt }),
  );
