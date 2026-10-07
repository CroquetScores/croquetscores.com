// What the pages of a tournament a reader follows share, whichever section of
// it they show: the tournament found by the address a reader's browser names,
// and what its section bar leads to.
import type { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import type { PlayerInGame } from "./GamesOfTournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

/** A competition as a tournament's pages lead to it. */
export interface CompetitionOfTournament {
  readonly name: string;
  /** Where it is found, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
  /**
   * A test's two teams, by their short names as they are now, the first
   * team's first; nothing for any other competition.
   */
  readonly teams?:
    { readonly first: string; readonly second: string } | undefined;
  /**
   * The group a test is in, by its name as it was typed and the slug its page
   * is found at; nothing for a test in none, for one whose group makes no
   * slug, which has no page to be found at, and for any other competition.
   */
  readonly group?: { readonly name: string; readonly slug: string } | undefined;
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
 * address: a test under "tests", and any other kind under "competitions". A
 * test comes with its teams' short names as they are now, which its section
 * is said as.
 */
export const competitionsInUse = (
  tournament: Tournament,
): readonly CompetitionOfTournament[] => {
  const address = tournament.address.toString();
  return tournament.competitions
    .filter(({ reference }) => !reference.archived)
    .map(({ reference, shape }) => {
      const competition = {
        name: reference.name.toString(),
        address: `${address}/${shape.kind === "test" ? "tests" : "competitions"}/${reference.slug.toString()}`,
      };
      if (shape.kind !== "test") return competition;
      const shortNameOf = (team: TeamId): string =>
        tournament.teams
          .find((each) => each.id.equals(team))
          ?.shortName.toString() ?? "";
      const slug = shape.group?.slug;
      return {
        ...competition,
        teams: {
          first: shortNameOf(shape.firstTeam),
          second: shortNameOf(shape.secondTeam),
        },
        ...(shape.group === undefined || slug === undefined
          ? {}
          : { group: { name: shape.group.toString(), slug: slug.toString() } }),
      };
    });
};

// Each of the tournament's players by their id, as a game names them: a
// player entered in a competition by what the tournament calls them now, what
// they represent and the flag they fly; and a player of a team, in a test,
// by their name, representing their team and flying its flag, since a team's
// players are known by their team.
export const playersOf = (tournament: Tournament): Map<string, PlayerInGame> =>
  new Map([
    ...tournament.players.map(
      (player) =>
        [
          player.id.value,
          {
            name: player.name.toString(),
            representing: player.representing,
            flag: player.flag === undefined ? undefined : String(player.flag),
          },
        ] as const,
    ),
    ...tournament.teams.flatMap((team) =>
      team.players.map(
        (player) =>
          [
            player.id.value,
            {
              name: player.name.toString(),
              representing: team.name.toString(),
              flag: team.flag === undefined ? undefined : String(team.flag),
            },
          ] as const,
      ),
    ),
  ]);

/**
 * One of a tournament's notes as every page of the tournament knows it: enough
 * to tell whether a reader has read it as it is now, so that the page can mark
 * the Notes section while one is still to be read (notes.feature).
 */
export interface ManagerNoteChanged {
  /** The note's id, as "manager-note/0d1e2f3a-…". */
  readonly id: string;
  /** When it was last edited, or when it was written if it never has been. */
  readonly changedAt: ReadOnlyDate;
}

/**
 * Each of the notes of `tournament` with when it last changed, the most
 * recently written first, from the read model of its notes, which holds none
 * of what they say, since every page of the tournament asks for them.
 */
export const managerNotesChangedOf = async (
  notes: TournamentManagerNotes,
  tournament: Tournament,
): Promise<readonly ManagerNoteChanged[]> =>
  (await notes.of(tournament.id)).map(({ id, changedAt }) => ({
    id,
    changedAt,
  }));

/**
 * Where the page of the note found at `slug` among the notes of `tournament`
 * is found: the tournament's address followed by "notes" and the slug, as
 * "2026/ac/spring-open/notes/lunch-is-at-noon".
 */
export const noteAddressIn = (tournament: Tournament, slug: string): string =>
  `${tournament.address.toString()}/notes/${slug}`;

/**
 * One of a tournament's commentaries as every page of the tournament knows
 * it: enough to tell whether a reader has read it as it is now, so that the
 * page can mark the Commentary section while one is still to be read
 * (commentaries.feature).
 */
export interface CommentaryChanged {
  /** The commentary's id, as "commentary/0d1e2f3a-…". */
  readonly id: string;
  /**
   * When it was started, or when a comment was last added to it or edited in
   * it.
   */
  readonly changedAt: ReadOnlyDate;
}

/** One of a tournament's commentaries as a list of them shows it. */
export interface CommentaryListed extends CommentaryChanged {
  readonly title: string;
  /** Where it is found among its tournament's commentaries, as "day-one". */
  readonly slug: string;
  /** Its writer's account's id. */
  readonly writer: string;
}

/**
 * The commentaries of each tournament, without reading any comment
 * (CommentariesByTournament.feature). Where a list leaves out a commentary
 * whose writer has been forgotten, since a reader is shown nothing of it, its
 * title and slug are still taken.
 */
export interface TournamentCommentaries {
  /**
   * Each commentary of `tournament` with when it last changed, its writer
   * not forgotten.
   */
  of(tournament: TournamentId): Promise<readonly CommentaryChanged[]>;

  /**
   * The commentaries of `tournament`, the most recently started first, each
   * with its title, slug and writer, forgotten or not; a list asks its
   * writers' names, and leaves out those it cannot have.
   */
  listed(tournament: TournamentId): Promise<readonly CommentaryListed[]>;

  /** The id of the commentary of `tournament` found at `slug`, if any. */
  at(tournament: TournamentId, slug: string): Promise<string | undefined>;

  /**
   * The titles and slugs every commentary of `tournament` has taken, its
   * writer forgotten or not, apart from `except`'s own. Asked by a command
   * about to take one, so it holds every other asking of the tournament's
   * until the command's work is kept or not: two asked at once are then
   * answered one after the other, the second with what the first took, and
   * not both with the same title free (StartCommentary.feature).
   */
  taken(
    tournament: TournamentId,
    except?: string,
  ): Promise<{
    readonly titles: readonly string[];
    readonly slugs: readonly string[];
  }>;
}
