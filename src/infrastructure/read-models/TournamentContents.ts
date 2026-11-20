import type { Projection } from "../../application/common/Projection.js";
import type {
  CompetitionOfApps,
  TournamentContents as Asked,
} from "../../application/operations/tournaments/tournamentContents.js";
import type {
  CompetitionForApps,
  TournamentForAppsRead,
} from "../../application/operations/tournaments/TournamentForApps.js";
import { BlockAdded } from "../../domain/aggregates/tournaments/events/BlockAdded.js";
import { BlockUpdated } from "../../domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionArchived } from "../../domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionMoved } from "../../domain/aggregates/tournaments/events/CompetitionMoved.js";
import { CompetitionsSpacedOut } from "../../domain/aggregates/tournaments/events/CompetitionsSpacedOut.js";
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../domain/aggregates/tournaments/events/SwissUpdated.js";
import { TeamAdded } from "../../domain/aggregates/tournaments/events/TeamAdded.js";
import { TeamArchived } from "../../domain/aggregates/tournaments/events/TeamArchived.js";
import { TeamMoved } from "../../domain/aggregates/tournaments/events/TeamMoved.js";
import { TeamPlayerAdded } from "../../domain/aggregates/tournaments/events/TeamPlayerAdded.js";
import { TeamPlayerArchived } from "../../domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamPlayerMoved } from "../../domain/aggregates/tournaments/events/TeamPlayerMoved.js";
import { TeamPlayerRestored } from "../../domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamPlayersSpacedOut } from "../../domain/aggregates/tournaments/events/TeamPlayersSpacedOut.js";
import { TeamPlayerUpdated } from "../../domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TeamRestored } from "../../domain/aggregates/tournaments/events/TeamRestored.js";
import { TeamsSpacedOut } from "../../domain/aggregates/tournaments/events/TeamsSpacedOut.js";
import { TeamUpdated } from "../../domain/aggregates/tournaments/events/TeamUpdated.js";
import { TestAdded } from "../../domain/aggregates/tournaments/events/TestAdded.js";
import { TestUpdated } from "../../domain/aggregates/tournaments/events/TestUpdated.js";
import { TournamentPlayerAdded } from "../../domain/aggregates/tournaments/events/TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "../../domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerRestored } from "../../domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "../../domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TeamId } from "../../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { Team } from "../../domain/aggregates/tournaments/Team.js";
import { TeamPlayer } from "../../domain/aggregates/tournaments/TeamPlayer.js";
import { TournamentPlayer } from "../../domain/aggregates/tournaments/TournamentPlayer.js";
import { CompetitionName } from "../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Slug } from "../../domain/common/Slug.js";
import { ORDER_STEP } from "../../domain/common/orders.js";
import { TestGroup } from "../../domain/aggregates/tournaments/value-objects/TestGroup.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import { standCompetition } from "./CompetitionStandings.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

// In the order a reader looks for a name in a list, capitals or none.
const byName = new Intl.Collator("en");

// What an event says of a player or a team is made into the value its
// aggregate makes of it (a name written as the domain writes it, the name the
// world rankings know them by where none was given), so that what is kept is
// what the tournament says, and not what was typed. Its place and its address
// are not asked of what is made here.
const anywhere = { slug: Slug.from("anywhere"), order: ORDER_STEP };

const playerOf = (event: TournamentPlayerAdded | TournamentPlayerUpdated) =>
  TournamentPlayer.from(
    TournamentPlayerId.from(event.playerId),
    event,
    anywhere,
  );

const teamOf = (event: TeamAdded | TeamUpdated) =>
  Team.from(TeamId.from(event.teamId), event, anywhere);

const teamPlayerOf = (event: TeamPlayerAdded | TeamPlayerUpdated) =>
  TeamPlayer.from(TeamPlayerId.from(event.playerId), event, anywhere);

// What a test is called, as the tournament calls it: its two teams' short
// names, kept as the teams' are now.
const testNameOf = `(select f.short_name from tournament_teams f where f.team_id = $2)
                    || ' v ' ||
                    (select s.short_name from tournament_teams s where s.team_id = $3)`;

/**
 * What is in each tournament: its players, its teams and their players, and
 * what each of its competitions is called and is, kept as the tournament's
 * events say, so that the API asks nothing of the events
 * (`TournamentContents.feature`).
 *
 * Written event by event from the tournament's own stream, so that an event
 * changes only the rows it is about: a player added writes a player and
 * nothing else. The competitions' rows are held once for every read model of
 * tournaments (`Tournaments`), which makes them from the same events and so
 * has made a competition's row before what is written here is, in every
 * order the streams come in.
 *
 * Each is written so that writing it twice leaves what writing it once did.
 */
export class TournamentContents implements Projection, Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) await this.#project(stream.value, event);
  }

  /**
   * Empties its tables, so that every stream can be handed to it again. What it
   * keeps in the table of competitions is emptied with it by `Tournaments`,
   * which empties that table and is cleared in the same rebuild.
   */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(
        `truncate tournament_players, tournament_teams, tournament_team_players`,
      );
  }

  /** The tables made again from the streams it is handed, in any order. */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  async tournament(
    website: string,
    tournament: string,
  ): Promise<TournamentForAppsRead | undefined> {
    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<{
      tournament_id: string;
      name: string;
      starts: string;
      finishes: string;
      country: string;
      region: string | null;
      sport: string;
      address: string;
      national: boolean;
      international: boolean;
      changed_at: Date;
    }>(
      `select t.tournament_id, t.name,
              to_char(t.starts, 'YYYY-MM-DD') as starts,
              to_char(t.finishes, 'YYYY-MM-DD') as finishes,
              t.country, t.region, t.sport, t.address, t.national,
              t.international, t.changed_at
         from tournaments t
        where t.tournament_id = $1 and t.website = $2 and not t.archived`,
      [tournament, website],
    );
    const [row] = rows;
    if (row === undefined) return undefined;

    const competitions = await connection.query<{
      competition_id: string;
      name: string;
      kind: CompetitionForApps["kind"];
      slug: string;
      changed_at: Date;
    }>(
      `select competition_id, name, kind, slug, changed_at
         from competitions
        where tournament_id = $1 and not archived and kind is not null
        order by position, competition_id`,
      [tournament],
    );
    const players = await connection.query<{
      player_id: string;
      name: string;
      world_ranking_name: string;
      handicap: string | null;
      representing: string | null;
    }>(
      `select player_id, name, world_ranking_name, handicap, representing
         from tournament_players
        where tournament_id = $1 and not archived`,
      [tournament],
    );
    const teams = await connection.query<{
      team_id: string;
      name: string;
      short_name: string;
    }>(
      `select team_id, name, short_name from tournament_teams
        where tournament_id = $1 and not archived
        order by position, team_id`,
      [tournament],
    );
    const teamPlayers = await connection.query<{
      player_id: string;
      team_id: string;
      name: string;
      world_ranking_name: string;
    }>(
      `select p.player_id, p.team_id, p.name, p.world_ranking_name
         from tournament_team_players p
         join tournament_teams t on t.team_id = p.team_id
        where t.tournament_id = $1 and not p.archived`,
      [tournament],
    );

    return {
      id: row.tournament_id,
      name: row.name,
      starts: row.starts,
      finishes: row.finishes,
      country: row.country,
      region: row.region ?? undefined,
      sport: row.sport,
      address: row.address,
      national: row.national,
      international: row.international,
      changedAt: ReadOnlyDate.from(row.changed_at),
      competitions: competitions.rows.map((each): CompetitionForApps => ({
        id: each.competition_id,
        name: each.name,
        kind: each.kind,
        // A test has its own part of the tournament's address, as its page does.
        address: `${row.address}/${each.kind === "test" ? "tests" : "competitions"}/${each.slug}`,
        changedAt: ReadOnlyDate.from(each.changed_at),
      })),
      players: players.rows
        .map((each) => ({
          id: each.player_id,
          name: each.name,
          worldRankingName: each.world_ranking_name,
          handicap: each.handicap ?? undefined,
          representing: each.representing ?? undefined,
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
      teams: teams.rows.map((team) => ({
        id: team.team_id,
        name: team.name,
        shortName: team.short_name,
        players: teamPlayers.rows
          .filter((each) => each.team_id === team.team_id)
          .map((each) => ({
            id: each.player_id,
            name: each.name,
            worldRankingName: each.world_ranking_name,
          }))
          .sort((one, other) => byName.compare(one.name, other.name)),
      })),
    };
  }

  async competition(
    website: string,
    tournament: string,
    competition: string,
  ): Promise<CompetitionOfApps> {
    const { rows } = await this.unitOfWork.connection().query<{
      address: string;
      competition_id: string | null;
      name: string | null;
      kind: CompetitionForApps["kind"] | null;
      slug: string | null;
      archived: boolean | null;
      changed_at: Date | null;
    }>(
      `select t.address, c.competition_id, c.name, c.kind, c.slug, c.archived,
              c.changed_at
         from tournaments t
         left join competitions c
           on c.competition_id = $3 and c.tournament_id = t.tournament_id
        where t.tournament_id = $1 and t.website = $2 and not t.archived`,
      [tournament, website, competition],
    );
    const [row] = rows;
    if (row === undefined) return { found: "no tournament" };
    if (
      row.competition_id === null ||
      row.archived !== false ||
      row.name === null ||
      row.kind === null ||
      row.slug === null ||
      row.changed_at === null
    ) {
      return { found: "no competition" };
    }
    return {
      found: "competition",
      head: {
        id: row.competition_id,
        name: row.name,
        kind: row.kind,
        changedAt: ReadOnlyDate.from(row.changed_at),
      },
      address: `${row.address}/${row.kind === "test" ? "tests" : "competitions"}/${row.slug}`,
    };
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  // The moment of the event being projected, which is the moment of every
  // row it changes: the `occurredAt` of the last event that changed a row, and
  // never when it was written, so that a rebuild gives what the live
  // projection did.
  #at = "";

  async #project(stream: string, event: DomainEvent): Promise<void> {
    if (!stream.startsWith("tournament/")) return;
    this.#at = event.occurredAt.toISOString();
    await this.#write(stream, event);
    await this.#rulesWritten(event);
    // What a block is played as changes its places, which are kept
    // (`CompetitionStandings`), so they are worked out again; where the
    // competition's own events have not been projected yet, there is nothing
    // to work them out of, and the last of them will.
    if (
      event instanceof BlockAdded ||
      event instanceof BlockUpdated ||
      event instanceof SwissAdded ||
      event instanceof SwissUpdated
    ) {
      await standCompetition(
        this.unitOfWork.connection(),
        event.competitionId,
        this.#at,
      );
    }
  }

  // What a competition is played as, which every event that adds or updates
  // one says: the most hoops, Advantage Golf Croquet, and a block's rounds. A
  // test's group is said with it.
  async #rulesWritten(event: DomainEvent): Promise<void> {
    if (!(
      event instanceof BlockAdded ||
      event instanceof BlockUpdated ||
      event instanceof KnockoutAdded ||
      event instanceof KnockoutUpdated ||
      event instanceof SwissAdded ||
      event instanceof SwissUpdated ||
      event instanceof TestAdded ||
      event instanceof TestUpdated
    )) {
      return;
    }
    await this.#competitionWritten(
      `update competitions
          set maximum_hoops = $2, maximum_hoops_said = $3, advantage = $4
        where competition_id = $1`,
      [
        event.competitionId,
        event.maximumHoops ?? null,
        // Said as none is not said at all: the column is null for both.
        event.maximumHoops !== undefined,
        event.advantage ?? false,
      ],
    );
    if (event instanceof BlockAdded || event instanceof BlockUpdated) {
      await this.#competitionWritten(
        `update competitions set rounds = $2 where competition_id = $1`,
        [event.competitionId, event.rounds],
      );
    }
    if (event instanceof TestAdded || event instanceof TestUpdated) {
      await this.#competitionWritten(
        `update competitions set best_of = $2, expected_matches = $3
          where competition_id = $1`,
        [event.competitionId, event.bestOf, event.expectedMatches],
      );
      const group =
        event.group === undefined ? undefined : TestGroup.from(event.group);
      await this.#competitionWritten(
        `update competitions set group_name = $2 where competition_id = $1`,
        [event.competitionId, group?.toString() ?? null],
      );
    }
  }

  async #write(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();

    // The tournament itself ------------------------------------------------
    if (
      event instanceof TournamentCreated ||
      event instanceof TournamentUpdated
    ) {
      await connection.query(
        `update tournaments
            set subtitle = $2, format = $3, level_tests_drawn = $4
          where tournament_id = $1`,
        [stream, event.subtitle ?? null, event.format, event.levelTestsDrawn],
      );

      // Its players ----------------------------------------------------------
    } else if (
      event instanceof TournamentPlayerAdded ||
      event instanceof TournamentPlayerUpdated
    ) {
      const player = playerOf(event);
      const name = player.name.toString();
      await connection.query(
        `insert into tournament_players
           (player_id, tournament_id, name, world_ranking_name, handicap,
            representing, flag, slug, changed_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         on conflict (player_id) do update
           set changed_at = excluded.changed_at,
               name = excluded.name,
               world_ranking_name = excluded.world_ranking_name,
               handicap = excluded.handicap,
               representing = excluded.representing,
               flag = excluded.flag,
               slug = coalesce(tournament_players.slug, excluded.slug)`,
        [
          event.playerId,
          stream,
          name,
          player.worldRankingName?.toString() ?? name,
          player.handicap ?? null,
          player.representing ?? null,
          player.flag === undefined ? null : String(player.flag),
          // Only said when the player is added: updating keeps it.
          event instanceof TournamentPlayerAdded ? event.slug : null,
          this.#at,
        ],
      );
    } else if (event instanceof TournamentPlayerArchived) {
      await this.#setArchived("tournament_players", event.playerId, true);
    } else if (event instanceof TournamentPlayerRestored) {
      await this.#setArchived("tournament_players", event.playerId, false);

      // Its teams and their players ------------------------------------------
    } else if (event instanceof TeamAdded || event instanceof TeamUpdated) {
      const team = teamOf(event);
      await connection.query(
        `insert into tournament_teams
           (team_id, tournament_id, name, short_name, position, changed_at,
            flag)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (team_id) do update
           set name = excluded.name, short_name = excluded.short_name,
               changed_at = excluded.changed_at, flag = excluded.flag`,
        [
          event.teamId,
          stream,
          team.name.toString(),
          team.shortName.toString(),
          event instanceof TeamAdded ? event.order : ORDER_STEP,
          this.#at,
          team.flag === undefined ? null : String(team.flag),
        ],
      );
      if (event instanceof TeamUpdated) await this.#renameTestsOf(event.teamId);
    } else if (event instanceof TeamArchived) {
      await connection.query(
        `update tournament_teams
            set archived = true, position = $2, changed_at = $3
          where team_id = $1`,
        [event.teamId, event.order, this.#at],
      );
    } else if (event instanceof TeamRestored) {
      await this.#setArchived("tournament_teams", event.teamId, false);
    } else if (event instanceof TeamMoved) {
      await this.#setPosition("tournament_teams", event.teamId, event.order);
    } else if (event instanceof TeamsSpacedOut) {
      await this.#spacedOut("tournament_teams", event.teamIds);
    } else if (
      event instanceof TeamPlayerAdded ||
      event instanceof TeamPlayerUpdated
    ) {
      const player = teamPlayerOf(event);
      const name = player.name.toString();
      await connection.query(
        `insert into tournament_team_players
           (player_id, team_id, name, world_ranking_name,
            position, changed_at, slug)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (player_id) do update
           set name = excluded.name,
               world_ranking_name = excluded.world_ranking_name,
               changed_at = excluded.changed_at,
               slug = coalesce(tournament_team_players.slug, excluded.slug)`,
        [
          event.playerId,
          event.teamId,
          name,
          player.worldRankingName?.toString() ?? name,
          event instanceof TeamPlayerAdded ? event.order : ORDER_STEP,
          this.#at,
          // Only said when the player is added: updating keeps it.
          event instanceof TeamPlayerAdded ? event.slug : null,
        ],
      );
    } else if (event instanceof TeamPlayerArchived) {
      await connection.query(
        `update tournament_team_players
            set archived = true, position = $2, changed_at = $3
          where player_id = $1`,
        [event.playerId, event.order, this.#at],
      );
    } else if (event instanceof TeamPlayerRestored) {
      await this.#setArchived("tournament_team_players", event.playerId, false);
    } else if (event instanceof TeamPlayerMoved) {
      await this.#setPosition(
        "tournament_team_players",
        event.playerId,
        event.order,
      );
    } else if (event instanceof TeamPlayersSpacedOut) {
      await this.#spacedOut("tournament_team_players", event.playerIds);

      // Its competitions ---------------------------------------------------
    } else if (
      event instanceof BlockAdded ||
      event instanceof KnockoutAdded ||
      event instanceof SwissAdded
    ) {
      await this.#competitionWritten(
        `update competitions
            set name = $2, kind = $3, slug = $4, position = $5
          where competition_id = $1`,
        [
          event.competitionId,
          CompetitionName.from(event.name).toString(),
          event instanceof BlockAdded
            ? "block"
            : event instanceof KnockoutAdded
              ? "knockout"
              : "swiss",
          event.slug,
          event.order,
        ],
      );
      // What a block is played as is what its places are worked out by.
      if (event instanceof BlockAdded) {
        await this.#competitionWritten(
          `update competitions set best_of = $2, tie_break = $3
            where competition_id = $1`,
          [event.competitionId, event.bestOf, event.tieBreak],
        );
      }
      // A knockout's draw is what the games of it are played out against.
      if (event instanceof KnockoutAdded) {
        await this.#competitionWritten(
          `update competitions
              set draw_places = $2, draw_rounds = $3, placed_by_order = $4
            where competition_id = $1`,
          [
            event.competitionId,
            event.places,
            event.rounds,
            event.losersOfCompetitionId !== undefined,
          ],
        );
      }
    } else if (event instanceof TestAdded) {
      await this.#competitionWritten(
        `update competitions
            set name = ${testNameOf}, kind = 'test', slug = $4, position = $5,
                first_team_id = $2, second_team_id = $3
          where competition_id = $1`,
        [
          event.competitionId,
          event.firstTeamId,
          event.secondTeamId,
          event.slug,
          event.order,
        ],
      );
    } else if (
      event instanceof BlockUpdated ||
      event instanceof KnockoutUpdated ||
      event instanceof SwissUpdated
    ) {
      await this.#competitionWritten(
        `update competitions set name = $2 where competition_id = $1`,
        [event.competitionId, CompetitionName.from(event.name).toString()],
      );
      if (event instanceof BlockUpdated) {
        await this.#competitionWritten(
          `update competitions set best_of = $2, tie_break = $3
            where competition_id = $1`,
          [event.competitionId, event.bestOf, event.tieBreak],
        );
      }
      if (event instanceof KnockoutUpdated) {
        await this.#competitionWritten(
          `update competitions set draw_places = $2, draw_rounds = $3
            where competition_id = $1`,
          [event.competitionId, event.places, event.rounds],
        );
      }
    } else if (event instanceof TestUpdated) {
      await this.#competitionWritten(
        `update competitions
            set name = ${testNameOf}, first_team_id = $2, second_team_id = $3
          where competition_id = $1`,
        [event.competitionId, event.firstTeamId, event.secondTeamId],
      );
    } else if (event instanceof CompetitionArchived) {
      // An archived competition is given a number after its name, so that the
      // name can be used again, and goes after the rest.
      await this.#competitionWritten(
        `update competitions
            set position = $2, name = coalesce($3, name)
          where competition_id = $1`,
        [
          event.competitionId,
          event.order,
          event.name === undefined
            ? null
            : CompetitionName.from(event.name).toString(),
        ],
      );
    } else if (event instanceof CompetitionMoved) {
      await this.#setPosition(
        "competitions",
        event.competitionId,
        event.order,
        "competition_id",
      );
    } else if (event instanceof CompetitionsSpacedOut) {
      await this.#spacedOut(
        "competitions",
        event.competitionIds,
        "competition_id",
      );
    }
  }

  // Writes what an event says of a competition, to the row the table of
  // competitions every read model of tournaments is built on has made of it
  // (`Tournaments`), which is why this is projected after it. A row that is not
  // there says it was not, and is not skipped in silence: the competition would
  // never be told of, and nothing would say why.
  async #competitionWritten(
    sql: string,
    values: readonly unknown[],
  ): Promise<void> {
    const { rowCount } = await this.unitOfWork
      .connection()
      .query(sql, [...values]);
    if (rowCount !== 1) {
      throw new Error(
        "A competition has no row to write to: TournamentContents is projected after Tournaments.",
      );
    }
  }

  // A team called by another short name gives every test it is in another
  // name with it, as the tournament's own events do: the tests not archived,
  // which keep their slugs.
  async #renameTestsOf(team: string): Promise<void> {
    await this.unitOfWork.connection().query(
      `update competitions c
          set name = (select f.short_name from tournament_teams f
                       where f.team_id = c.first_team_id)
                     || ' v ' ||
                     (select s.short_name from tournament_teams s
                       where s.team_id = c.second_team_id)
        where c.kind = 'test' and not c.archived
          and (c.first_team_id = $1 or c.second_team_id = $1)`,
      [team],
    );
  }

  // The tables and columns named here are this class's own, never a reader's.
  async #setArchived(
    table:
      "tournament_players" | "tournament_teams" | "tournament_team_players",
    id: string,
    archived: boolean,
  ): Promise<void> {
    const key = table === "tournament_teams" ? "team_id" : "player_id";
    await this.unitOfWork
      .connection()
      .query(
        `update ${table} set archived = $2, changed_at = $3 where ${key} = $1`,
        [id, archived, this.#at],
      );
  }

  async #setPosition(
    table: "tournament_teams" | "tournament_team_players" | "competitions",
    id: string,
    position: number,
    key: "team_id" | "player_id" | "competition_id" = table ===
    "tournament_teams"
      ? "team_id"
      : "player_id",
  ): Promise<void> {
    // The table of competitions keeps its moment in `Tournaments`, which
    // moves it for every event of the tournament.
    const moment = table === "competitions" ? "" : ", changed_at = $3";
    await this.unitOfWork
      .connection()
      .query(
        `update ${table} set position = $2${moment} where ${key} = $1`,
        table === "competitions" ? [id, position] : [id, position, this.#at],
      );
  }

  // Every one is given the place its place in the list says, a step apart.
  async #spacedOut(
    table: "tournament_teams" | "tournament_team_players" | "competitions",
    ids: readonly string[],
    key: "team_id" | "player_id" | "competition_id" = table ===
    "tournament_teams"
      ? "team_id"
      : "player_id",
  ): Promise<void> {
    for (const [index, id] of ids.entries()) {
      await this.#setPosition(table, id, (index + 1) * ORDER_STEP, key);
    }
  }
}
