import type { Projection } from "../../application/common/Projection.js";
import type {
  TournamentOfAccount,
  TournamentsByAccount as Asked,
} from "../../application/operations/tournaments/TournamentsOfAccount.js";
import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { ManagerAdded } from "../../domain/aggregates/tournaments/events/ManagerAdded.js";
import { ManagerRemoved } from "../../domain/aggregates/tournaments/events/ManagerRemoved.js";
import { ScorerAdded } from "../../domain/aggregates/tournaments/events/ScorerAdded.js";
import { ScorerRemoved } from "../../domain/aggregates/tournaments/events/ScorerRemoved.js";
import { TournamentArchived } from "../../domain/aggregates/tournaments/events/TournamentArchived.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentRestored } from "../../domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { Website } from "../../domain/common/Website.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/**
 * The tournaments each account manages or scores, kept in step with every
 * append, so that the admin can list a reader's tournaments and the years they
 * are in without replaying every tournament there is.
 *
 * What a tournament is and who has a part in it are kept apart: a tournament
 * changed is one row changed, and an account made a manager has nothing to
 * copy from anybody else's row.
 */
export class TournamentsByAccount implements Projection, Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) await this.#project(stream.value, event);
  }

  /** Empties its tables, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate tournaments_by_account, tournaments_by_account_details`);
  }

  /**
   * The table made again from the streams it is handed, one at a time. Each tournament is
   * one stream and nothing in one tournament's rows depends on another's, so
   * the streams can come in any order, as long as each stream's own events
   * come in the order they were kept, which reading them back gives.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  async tournamentsOf(
    account: AccountId,
    website: Website,
    year: number,
  ): Promise<readonly TournamentOfAccount[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      tournament_id: string;
      name: string;
      starts: string;
      finishes: string;
      address: string;
      archived: boolean;
      part: "manager" | "scorer";
    }>(
      // The days as text, since pg makes a date into a moment at midnight
      // wherever the server happens to be, and a day is what is kept.
      `select d.tournament_id, d.name,
              to_char(d.starts, 'YYYY-MM-DD') as starts,
              to_char(d.finishes, 'YYYY-MM-DD') as finishes,
              d.address, d.archived, a.part
         from tournaments_by_account a
         join tournaments_by_account_details d using (tournament_id)
        where a.account_id = $1 and d.website = $2
          and extract(year from d.starts) = $3
        order by d.archived, d.starts desc, d.name`,
      [account.value, website.host, year],
    );
    return rows.map((row) => ({
      id: row.tournament_id,
      name: row.name,
      starts: row.starts,
      finishes: row.finishes,
      address: row.address,
      archived: row.archived,
      part: row.part,
    }));
  }

  async yearsOf(
    account: AccountId,
    website: Website,
  ): Promise<readonly number[]> {
    const { rows } = await this.unitOfWork.connection().query<{ year: number }>(
      `select distinct extract(year from d.starts)::int as year
           from tournaments_by_account a
           join tournaments_by_account_details d using (tournament_id)
          where a.account_id = $1 and d.website = $2
          order by year desc`,
      [account.value, website.host],
    );
    return rows.map(({ year }) => year);
  }

  // From the details alone, which hold each tournament once whoever has a
  // part in it, so that a tournament with several is listed once.
  async everyTournament(
    website: Website,
    year: number,
  ): Promise<readonly TournamentOfAccount[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      tournament_id: string;
      name: string;
      starts: string;
      finishes: string;
      address: string;
      archived: boolean;
    }>(
      `select tournament_id, name,
              to_char(starts, 'YYYY-MM-DD') as starts,
              to_char(finishes, 'YYYY-MM-DD') as finishes,
              address, archived
         from tournaments_by_account_details
        where website = $1 and extract(year from starts) = $2
        order by archived, starts desc, name`,
      [website.host, year],
    );
    return rows.map((row) => ({
      id: row.tournament_id,
      name: row.name,
      starts: row.starts,
      finishes: row.finishes,
      address: row.address,
      archived: row.archived,
      part: "manager",
    }));
  }

  async everyYear(website: Website): Promise<readonly number[]> {
    const { rows } = await this.unitOfWork.connection().query<{ year: number }>(
      `select distinct extract(year from starts)::int as year
         from tournaments_by_account_details
        where website = $1
        order by year desc`,
      [website.host],
    );
    return rows.map(({ year }) => year);
  }

  // From the details, as every tournament is, joined to the account's own part
  // where it has one: a tournament it has no part in is one whose rankings it
  // looks after where its sport, the second part of its address, is asked
  // about and it counts towards the world rankings, and is left out where it
  // is not. One that does not has no rankings to look after.
  async tournamentsOfRankingOfficer(
    account: AccountId,
    website: Website,
    year: number,
    sports: readonly string[],
  ): Promise<readonly TournamentOfAccount[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      tournament_id: string;
      name: string;
      starts: string;
      finishes: string;
      address: string;
      archived: boolean;
      part: "manager" | "scorer" | null;
    }>(
      `select d.tournament_id, d.name,
              to_char(d.starts, 'YYYY-MM-DD') as starts,
              to_char(d.finishes, 'YYYY-MM-DD') as finishes,
              d.address, d.archived, a.part
         from tournaments_by_account_details d
         left join tournaments_by_account a
           on a.tournament_id = d.tournament_id and a.account_id = $1
        where d.website = $2 and extract(year from d.starts) = $3
          and (a.part is not null
               or (split_part(d.address, '/', 2) = any($4)
                   and d.counts_towards_world_rankings))
        order by d.archived, d.starts desc, d.name`,
      [account.value, website.host, year, sports],
    );
    return rows.map((row) => ({
      id: row.tournament_id,
      name: row.name,
      starts: row.starts,
      finishes: row.finishes,
      address: row.address,
      archived: row.archived,
      part: row.part ?? "rankingOfficer",
    }));
  }

  async yearsOfRankingOfficer(
    account: AccountId,
    website: Website,
    sports: readonly string[],
  ): Promise<readonly number[]> {
    const { rows } = await this.unitOfWork.connection().query<{ year: number }>(
      `select distinct extract(year from d.starts)::int as year
         from tournaments_by_account_details d
         left join tournaments_by_account a
           on a.tournament_id = d.tournament_id and a.account_id = $1
        where d.website = $2
          and (a.part is not null
               or (split_part(d.address, '/', 2) = any($3)
                   and d.counts_towards_world_rankings))
        order by year desc`,
      [account.value, website.host, sports],
    );
    return rows.map(({ year }) => year);
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(tournament: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      await connection.query(
        `insert into tournaments_by_account_details
           (tournament_id, website, name, starts, finishes, address,
            counts_towards_world_rankings)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (tournament_id) do update
           set name = excluded.name, starts = excluded.starts,
               finishes = excluded.finishes, address = excluded.address,
               counts_towards_world_rankings
                 = excluded.counts_towards_world_rankings`,
        [
          tournament,
          event.website,
          event.name,
          event.starts,
          event.finishes,
          event.address,
          event.worldRankings,
        ],
      );
      await this.#takesPart(tournament, event.createdBy.value, "manager");
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update tournaments_by_account_details
            set name = $2, starts = $3, finishes = $4, address = $5,
                counts_towards_world_rankings = $6
          where tournament_id = $1`,
        [
          tournament,
          event.name,
          event.starts,
          event.finishes,
          event.address,
          event.worldRankings,
        ],
      );
    } else if (event instanceof TournamentArchived) {
      await this.#archived(tournament, true);
    } else if (event instanceof TournamentRestored) {
      await this.#archived(tournament, false);
    } else if (event instanceof ManagerAdded) {
      // A scorer made a manager stops being a scorer, as the tournament has
      // it, and nothing records that separately: so this takes the place of
      // whatever part the account had.
      await this.#takesPart(tournament, event.account, "manager");
    } else if (event instanceof ManagerRemoved) {
      await this.#takesNoPart(tournament, event.account, "manager");
    } else if (event instanceof ScorerAdded) {
      await this.#takesPart(tournament, event.account, "scorer");
    } else if (event instanceof ScorerRemoved) {
      await this.#takesNoPart(tournament, event.account, "scorer");
    }
  }

  async #takesPart(
    tournament: string,
    account: string,
    part: "manager" | "scorer",
  ): Promise<void> {
    await this.unitOfWork.connection().query(
      `insert into tournaments_by_account (tournament_id, account_id, part)
       values ($1, $2, $3)
       on conflict (tournament_id, account_id) do update set part = excluded.part`,
      [tournament, account, part],
    );
  }

  // Only where the account has that part: taking somebody off the scorers
  // leaves them as they are if they have since been made a manager.
  async #takesNoPart(
    tournament: string,
    account: string,
    part: "manager" | "scorer",
  ): Promise<void> {
    await this.unitOfWork.connection().query(
      `delete from tournaments_by_account
        where tournament_id = $1 and account_id = $2 and part = $3`,
      [tournament, account, part],
    );
  }

  async #archived(tournament: string, archived: boolean): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(
        `update tournaments_by_account_details set archived = $2 where tournament_id = $1`,
        [tournament, archived],
      );
  }
}
