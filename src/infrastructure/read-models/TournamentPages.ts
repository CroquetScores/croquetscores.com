import type {
  CompetitionInUse,
  CompetitionOfPage,
  GameOfTestOfPage,
  PeopleOfTournament,
  PlayerOfPage,
  TeamOfPage,
  TeamsToStand,
  TestOfPage,
  TournamentOfPage,
  TournamentPages as Asked,
} from "../../application/operations/tournaments/tournamentPages.js";
import type { CompetitionOfTournament } from "../../application/operations/tournaments/tournamentForReaders.js";
import { TestGroup } from "../../domain/aggregates/tournaments/value-objects/TestGroup.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * What the public pages of a tournament show of it that no page's own data
 * says: its header, the competitions its section bar leads to, how a
 * competition is played and who is entered in it. It keeps nothing itself: it
 * asks what `Tournaments` and `TournamentContents` keep, in the request that
 * asks it (`TournamentPages.feature`).
 */
// A test's group as its page says it, with the slug the page is found at made
// of its name, and so never kept beside it to disagree. A name with nothing in
// it to make a slug from has no group page, and says none.
const groupOf = (
  name: string | null,
): { group?: { name: string; slug: string } } => {
  if (name === null) return {};
  const slug = TestGroup.from(name)?.slug?.toString();
  return slug === undefined ? {} : { group: { name, slug } };
};

export class TournamentPages implements Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async tournament(id: string): Promise<TournamentOfPage | undefined> {
    const connection = this.unitOfWork.connection();
    const found = await connection.query<{
      website: string;
      name: string;
      subtitle: string | null;
      address: string;
      archived: boolean;
      sport: string;
      country: string;
      // Cast to text in the query, since the driver would make a date of it
      // in the time zone of the machine, which can move it a day.
      starts: string;
      finishes: string;
      format: string | null;
      level_tests_drawn: boolean;
    }>(
      `select website, name, subtitle, address, archived, sport, country,
              starts::text as starts, finishes::text as finishes, format,
              level_tests_drawn
         from tournaments where tournament_id = $1`,
      [id],
    );
    const [row] = found.rows;
    if (row === undefined) return undefined;
    // The competitions in use, each with what its section is said as: a test by
    // its teams' short names as they are now, and its group.
    const competitions = await connection.query<{
      competition_id: string;
      name: string;
      kind: string;
      slug: string;
      first_short_name: string | null;
      second_short_name: string | null;
      group_name: string | null;
    }>(
      `select c.competition_id, n.name, c.kind, c.slug,
              f.short_name as first_short_name,
              s.short_name as second_short_name,
              c.group_name
         from competitions c
         join competition_names n on n.competition_id = c.competition_id
         left join tournament_teams f on f.team_id = c.first_team_id
         left join tournament_teams s on s.team_id = c.second_team_id
        where c.tournament_id = $1 and not c.archived and c.kind is not null
        order by c.position`,
      [id],
    );
    return {
      id,
      website: row.website,
      name: row.name,
      subtitle: row.subtitle ?? undefined,
      address: row.address,
      archived: row.archived,
      sport: row.sport,
      country: row.country,
      starts: row.starts,
      finishes: row.finishes,
      format: row.format ?? undefined,
      levelTestsDrawn: row.level_tests_drawn,
      competitions: competitions.rows.map((each): CompetitionOfTournament => {
        const competition = {
          id: each.competition_id,
          name: each.name,
          address: `${row.address}/${each.kind === "test" ? "tests" : "competitions"}/${each.slug}`,
        };
        if (each.kind !== "test") return competition;
        return {
          ...competition,
          teams: {
            first: each.first_short_name ?? "",
            second: each.second_short_name ?? "",
          },
          ...groupOf(each.group_name),
        };
      }),
    };
  }

  async competition(
    tournament: string,
    slug: string,
  ): Promise<CompetitionOfPage | undefined> {
    const found = await this.unitOfWork.connection().query<{
      competition_id: string;
      name: string;
      kind: "block" | "swiss" | "knockout" | "test";
      best_of: number | null;
      rounds: number | null;
      tie_break: string | null;
      maximum_hoops: number | null;
      maximum_hoops_said: boolean;
      advantage: boolean;
      first_team_id: string | null;
      second_team_id: string | null;
    }>(
      `select c.competition_id, n.name, c.kind, c.best_of, c.rounds,
              c.tie_break, c.maximum_hoops, c.maximum_hoops_said, c.advantage,
              c.first_team_id, c.second_team_id
         from competitions c
         join competition_names n on n.competition_id = c.competition_id
        where c.tournament_id = $1 and c.slug = $2 and not c.archived
          and c.kind is not null`,
      [tournament, slug],
    );
    const [row] = found.rows;
    if (row === undefined) return undefined;
    return {
      id: row.competition_id,
      name: row.name,
      kind: row.kind,
      bestOf: row.best_of ?? undefined,
      rounds: row.rounds ?? undefined,
      tieBreak: row.tie_break ?? undefined,
      maximumHoops: row.maximum_hoops_said ? row.maximum_hoops : undefined,
      advantage: row.advantage,
      teams:
        row.first_team_id === null || row.second_team_id === null
          ? undefined
          : { first: row.first_team_id, second: row.second_team_id },
    };
  }

  async team(id: string): Promise<TeamOfPage | undefined> {
    const found = await this.unitOfWork.connection().query<TeamRow>(
      `select team_id, name, short_name, archived
         from tournament_teams where team_id = $1`,
      [id],
    );
    const [row] = found.rows;
    return row === undefined ? undefined : teamOf(row);
  }

  async teamsToStand(tournament: string): Promise<TeamsToStand> {
    const connection = this.unitOfWork.connection();
    const teams = await connection.query<TeamRow>(
      `select team_id, name, short_name, archived
         from tournament_teams where tournament_id = $1
        order by position`,
      [tournament],
    );
    const players = await connection.query<{
      player_id: string;
      team_id: string;
    }>(
      `select p.player_id, p.team_id from tournament_team_players p
         join tournament_teams t on t.team_id = p.team_id
        where t.tournament_id = $1`,
      [tournament],
    );
    const tests = await connection.query<{
      competition_id: string;
      first_team_id: string;
      second_team_id: string;
      best_of: number | null;
      expected_matches: number | null;
      group_name: string | null;
    }>(
      `select competition_id, first_team_id, second_team_id, best_of,
              expected_matches, group_name
         from competitions
        where tournament_id = $1 and kind = 'test' and not archived
        order by position`,
      [tournament],
    );
    const games = await connection.query<{
      competition_id: string;
      winner_id: string;
      winner_score: string;
      loser_id: string;
      loser_score: string;
      drawn: boolean;
    }>(
      `select g.competition_id, g.winner_id, g.winner_score, g.loser_id,
              g.loser_score, g.drawn
         from competition_games g
         join competitions c on c.competition_id = g.competition_id
        where c.tournament_id = $1 and c.kind = 'test' and not c.archived
          and not g.archived
        order by g.competition_id, g.position`,
      [tournament],
    );
    const gamesOf = new Map<string, GameOfTestOfPage[]>();
    for (const row of games.rows) {
      const kept = gamesOf.get(row.competition_id) ?? [];
      kept.push({
        winner: row.winner_id,
        loser: row.loser_id,
        winnerScore: row.winner_score,
        loserScore: row.loser_score,
        drawn: row.drawn,
      });
      gamesOf.set(row.competition_id, kept);
    }
    return {
      teams: teams.rows.map(teamOf),
      teamOf: new Map(players.rows.map((row) => [row.player_id, row.team_id])),
      tests: tests.rows.map((row): TestOfPage => {
        // A test's rules are written with the test, so one without them is
        // one the read models were made before they were kept.
        if (row.best_of === null || row.expected_matches === null) {
          throw new Error(
            `The test ${row.competition_id} has no rules kept: the read models are to be made again.`,
          );
        }
        return {
          id: row.competition_id,
          firstTeam: row.first_team_id,
          secondTeam: row.second_team_id,
          bestOf: row.best_of,
          expectedMatches: row.expected_matches,
          group: groupOf(row.group_name).group?.slug,
          games: gamesOf.get(row.competition_id) ?? [],
        };
      }),
    };
  }

  async playersOf(competition: string): Promise<readonly PlayerOfPage[]> {
    const found = await this.unitOfWork.connection().query<{
      entry_id: string;
      player_id: string;
      name: string;
      representing: string | null;
      handicap: string | null;
      flag: string | null;
      slug: string | null;
      withdrawn: boolean;
    }>(
      `select e.entry_id, p.player_id, p.name, p.representing,
              trim_scale(p.handicap)::text as handicap,
              p.flag, p.slug, e.withdrawn
         from competition_entries e
         join tournament_players p on p.player_id = e.tournament_player_id
        where e.competition_id = $1
        order by e.position`,
      [competition],
    );
    return found.rows.map((each): PlayerOfPage => {
      // A page links to a player by it, so a player without one would link to
      // the players' page instead of theirs: the read models are not whole,
      // and are to be made again.
      if (each.slug === null) {
        throw new Error(
          `The player ${each.player_id} has no slug kept: the read models are to be made again.`,
        );
      }
      return {
        entryId: each.entry_id,
        playerId: each.player_id,
        name: each.name,
        representing: each.representing ?? undefined,
        handicap: each.handicap ?? undefined,
        flag: each.flag ?? undefined,
        slug: each.slug,
        withdrawn: each.withdrawn,
      };
    });
  }

  async namesOfPlayers(
    tournament: string,
  ): Promise<ReadonlyMap<string, string>> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ player_id: string; name: string }>(
        `select player_id, name from tournament_players
          where tournament_id = $1`,
        [tournament],
      );
    return new Map(rows.map((row) => [row.player_id, row.name]));
  }

  async peopleOf(tournament: string): Promise<PeopleOfTournament> {
    const connection = this.unitOfWork.connection();
    // A page links to a player by their slug, so a player a reader is sent to
    // without one would link to the wrong page: the read models are not whole,
    // and are to be made again. An archived player is sent to by nobody, so
    // one without a slug is no reason to refuse the page of everybody else.
    const slugOf = (
      player: string,
      slug: string | null,
      archived: boolean,
    ): string | undefined => {
      if (slug === null && archived) return undefined;
      if (slug === null) {
        throw new Error(
          `The player ${player} has no slug kept: the read models are to be made again.`,
        );
      }
      return slug;
    };
    const players = await connection.query<{
      player_id: string;
      name: string;
      world_ranking_name: string;
      representing: string | null;
      handicap: string | null;
      flag: string | null;
      slug: string | null;
      archived: boolean;
    }>(
      `select player_id, name, world_ranking_name, representing,
              trim_scale(handicap)::text as handicap, flag, slug, archived
         from tournament_players where tournament_id = $1`,
      [tournament],
    );
    const teams = await connection.query<{
      team_id: string;
      name: string;
      short_name: string;
      archived: boolean;
    }>(
      `select team_id, name, short_name, archived
         from tournament_teams where tournament_id = $1
        order by position`,
      [tournament],
    );
    const teamPlayers = await connection.query<{
      player_id: string;
      team_id: string;
      name: string;
      world_ranking_name: string;
      slug: string | null;
      archived: boolean;
    }>(
      `select p.player_id, p.team_id, p.name, p.world_ranking_name,
              p.slug, p.archived
         from tournament_team_players p
         join tournament_teams t on t.team_id = p.team_id
        where t.tournament_id = $1
        order by p.position`,
      [tournament],
    );
    return {
      players: players.rows.map((each) => ({
        playerId: each.player_id,
        name: each.name,
        worldRankingName: each.world_ranking_name,
        representing: each.representing ?? undefined,
        handicap: each.handicap ?? undefined,
        flag: each.flag ?? undefined,
        slug: slugOf(each.player_id, each.slug, each.archived),
        archived: each.archived,
      })),
      teams: teams.rows.map((team) => ({
        id: team.team_id,
        name: team.name,
        shortName: team.short_name,
        archived: team.archived,
        players: teamPlayers.rows
          .filter((each) => each.team_id === team.team_id)
          .map((each) => ({
            playerId: each.player_id,
            name: each.name,
            worldRankingName: each.world_ranking_name,
            slug: slugOf(each.player_id, each.slug, each.archived),
            archived: each.archived,
          })),
      })),
    };
  }

  async competitionsInUse(
    tournament: string,
  ): Promise<readonly CompetitionInUse[]> {
    const found = await this.unitOfWork.connection().query<{
      competition_id: string;
      kind: CompetitionInUse["kind"];
      first_team_id: string | null;
      second_team_id: string | null;
    }>(
      `select competition_id, kind, first_team_id, second_team_id
         from competitions
        where tournament_id = $1 and not archived and kind is not null
        order by position`,
      [tournament],
    );
    return found.rows.map((each) => ({
      id: each.competition_id,
      kind: each.kind,
      firstTeam: each.first_team_id ?? undefined,
      secondTeam: each.second_team_id ?? undefined,
    }));
  }
}

interface TeamRow {
  team_id: string;
  name: string;
  short_name: string;
  archived: boolean;
}

const teamOf = (row: TeamRow): TeamOfPage => ({
  id: row.team_id,
  name: row.name,
  shortName: row.short_name,
  archived: row.archived,
});
