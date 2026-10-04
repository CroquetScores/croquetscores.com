// What the pages of a tournament a reader follows share, whichever section of
// it they show: the tournament found by the address a reader's browser names,
// and what its section bar leads to.
import type { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { Website } from "../../../domain/common/Website.js";
import type { PlayerInGame } from "./GamesOfTournament.js";
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
  /**
   * A test's two teams, by their short names as they are now, the first
   * team's first; nothing for any other competition.
   */
  readonly teams?:
    { readonly first: string; readonly second: string } | undefined;
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
      return {
        ...competition,
        teams: {
          first: shortNameOf(shape.firstTeam),
          second: shortNameOf(shape.secondTeam),
        },
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
