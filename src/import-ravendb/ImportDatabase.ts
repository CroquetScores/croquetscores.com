import type { Pool } from "pg";

import type { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { dropTables } from "../infrastructure/database/dropTables.js";
import { migrate } from "../infrastructure/database/migrate.js";

/** Where a document the import refused is kept, with why. */
export interface ImportErrors {
  /** Keeps `message` against `documentId`, which names its website too. */
  recordError(documentId: string, message: string): Promise<void>;
}

/**
 * The Postgres database an import writes into: emptied, migrated again, and
 * given the tables of the import's own (ImportDatabase.feature).
 *
 * Emptied because an import is run over and over while it is being written,
 * and what the last run left would be imported a second time on top of
 * itself.
 */
export class ImportDatabase implements ImportErrors {
  readonly #pool: Pool;
  readonly #unitOfWork: UnitOfWork;

  constructor(pool: Pool, unitOfWork: UnitOfWork) {
    this.#pool = pool;
    this.#unitOfWork = unitOfWork;
  }

  /**
   * Drops every table in the database, in every schema but Postgres's own,
   * applies every migration, and makes the import's own tables beside them.
   */
  async reset(): Promise<void> {
    await dropTables(this.#pool);

    await migrate(this.#pool);

    // The table of errors is the site's own, made by the migrations
    // (0023-import-errors.sql), so that the administrator's page for it finds
    // it on a site the import has never run on.

    // Which account each user became, so that a user on both old sites is one
    // account, and whatever is imported later can find the account a user's
    // document now means. The email address is kept as written, trimmed, which
    // nothing the site keeps does, because the table goes when importing is
    // finished.
    //
    // It is looked for by the form the site compares it in, worked out here
    // rather than by lower() in Postgres: lower() leaves an address with space
    // around it, or an accent written two ways, as a second address, where the
    // site would take it for the first and refuse the account made for it.
    await this.#pool.query(`
      create table imported_users (
          website                  text not null,
          document_id              text not null,
          account_id               text not null,
          email_address            text not null,
          comparable_email_address text not null,
          primary key (website, document_id)
      )
    `);
    await this.#pool.query(`
      create index imported_users_by_email_address
          on imported_users (comparable_email_address)
    `);

    // The forgotten account made for each user who became none and ran a
    // tournament, so that a user is one forgotten account however many
    // tournaments they ran.
    await this.#pool.query(`
      create table forgotten_users (
          website     text not null,
          document_id text not null,
          account_id  text not null,
          primary key (website, document_id)
      )
    `);

    // What each document became, by the website and the document, so that
    // whatever is imported after it can find it. The old sites wrote a key in
    // more than one case, "TeamMatches/513" in one place and "teammatches/513"
    // in another, so each is kept, and looked for, in small letters, as a
    // user's is in the tables above.
    await this.#pool.query(`
      create table imported_tournaments (
          website       text not null,
          document_id   text not null,
          tournament_id text not null,
          primary key (website, document_id)
      )
    `);
    // Every tournament document read, whatever became of it, so that what is
    // looked for last of all can tell a document whose tournament took it,
    // or left it behind, or was refused, from one whose tournament was never
    // there to take it.
    await this.#pool.query(`
      create table tournaments_read (
          website     text not null,
          document_id text not null,
          primary key (website, document_id)
      )
    `);
    // A player by the number the old sites gave them in their tournament, which
    // is how a competition names them: the tournament player they became, the
    // player of a team in a tournament played by teams, or a bye.
    await this.#pool.query(`
      create table imported_players (
          website                text not null,
          tournament_document_id text not null,
          player_number          integer not null,
          player_id              text not null,
          primary key (website, tournament_document_id, player_number)
      )
    `);
    await this.#pool.query(`
      create table imported_competitions (
          website        text not null,
          document_id    text not null,
          tournament_id  text not null,
          competition_id text not null,
          primary key (website, document_id)
      )
    `);
  }

  /** Keeps which account a user from one of the old sites became. */
  async recordImportedUser(
    website: string,
    documentId: string,
    accountId: string,
    emailAddress: EmailAddress,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into imported_users
           (website, document_id, account_id, email_address, comparable_email_address)
       values ($1, $2, $3, $4, $5)`,
      [
        website,
        documentId.toLowerCase(),
        accountId,
        emailAddress.toString(),
        emailAddress.comparable,
      ],
    );
  }

  /**
   * The account a user at `emailAddress` already became, if one did. Compared
   * as the site compares an email address.
   */
  async findImportedAccount(
    emailAddress: EmailAddress,
  ): Promise<string | undefined> {
    const { rows } = await this.#queryable().query<{ account_id: string }>(
      `select account_id from imported_users
       where comparable_email_address = $1
       limit 1`,
      [emailAddress.comparable],
    );
    return rows[0]?.account_id;
  }

  /** The account the user `documentId` on `website` became, if they became one. */
  async findAccountOf(
    website: string,
    documentId: string,
  ): Promise<{ accountId: string; emailAddress: string } | undefined> {
    const { rows } = await this.#queryable().query<{
      account_id: string;
      email_address: string;
    }>(
      `select account_id, email_address from imported_users
       where website = $1 and document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { accountId: row.account_id, emailAddress: row.email_address };
  }

  /** Keeps the forgotten account a user who became none was brought over as. */
  async recordForgottenUser(
    website: string,
    documentId: string,
    accountId: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into forgotten_users (website, document_id, account_id)
       values ($1, $2, $3)`,
      [website, documentId.toLowerCase(), accountId],
    );
  }

  /** The forgotten account the user `documentId` on `website` was brought over as, if any. */
  async findForgottenAccountOf(
    website: string,
    documentId: string,
  ): Promise<string | undefined> {
    const { rows } = await this.#queryable().query<{ account_id: string }>(
      `select account_id from forgotten_users
       where website = $1 and document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    return rows[0]?.account_id;
  }

  /** Keeps which tournament a tournament of the old sites became. */
  async recordImportedTournament(
    website: string,
    documentId: string,
    tournamentId: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into imported_tournaments (website, document_id, tournament_id)
       values ($1, $2, $3)`,
      [website, documentId.toLowerCase(), tournamentId],
    );
  }

  /** The tournament `documentId` on `website` became, if it became one. */
  async findTournamentOf(
    website: string,
    documentId: string,
  ): Promise<string | undefined> {
    const { rows } = await this.#queryable().query<{ tournament_id: string }>(
      `select tournament_id from imported_tournaments
       where website = $1 and document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    return rows[0]?.tournament_id;
  }

  /** Keeps that the tournament `documentId` on `website` was read. */
  async recordTournamentRead(
    website: string,
    documentId: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into tournaments_read (website, document_id)
       values ($1, $2)`,
      [website, documentId.toLowerCase()],
    );
  }

  /** Whether the tournament `documentId` on `website` was read. */
  async wasTournamentRead(
    website: string,
    documentId: string,
  ): Promise<boolean> {
    const { rows } = await this.#queryable().query(
      `select 1 from tournaments_read
       where website = $1 and document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    return rows.length > 0;
  }

  /**
   * Keeps what the player numbered `playerNumber` in the tournament
   * `tournamentDocumentId` on `website` became.
   */
  async recordImportedPlayer(
    website: string,
    tournamentDocumentId: string,
    playerNumber: number,
    playerId: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into imported_players
           (website, tournament_document_id, player_number, player_id)
       values ($1, $2, $3, $4)`,
      [website, tournamentDocumentId.toLowerCase(), playerNumber, playerId],
    );
  }

  /** What the player numbered `playerNumber` in a tournament became, if anything. */
  async findPlayerOf(
    website: string,
    tournamentDocumentId: string,
    playerNumber: number,
  ): Promise<string | undefined> {
    const { rows } = await this.#queryable().query<{ player_id: string }>(
      `select player_id from imported_players
       where website = $1 and tournament_document_id = $2 and player_number = $3`,
      [website, tournamentDocumentId.toLowerCase(), playerNumber],
    );
    return rows[0]?.player_id;
  }

  /** Keeps which competition of which tournament a competition of the old sites became. */
  async recordImportedCompetition(
    website: string,
    documentId: string,
    tournamentId: string,
    competitionId: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into imported_competitions
           (website, document_id, tournament_id, competition_id)
       values ($1, $2, $3, $4)`,
      [website, documentId.toLowerCase(), tournamentId, competitionId],
    );
  }

  /** The competition `documentId` on `website` became, if it became one. */
  async findCompetitionOf(
    website: string,
    documentId: string,
  ): Promise<{ tournamentId: string; competitionId: string } | undefined> {
    const { rows } = await this.#queryable().query<{
      tournament_id: string;
      competition_id: string;
    }>(
      `select tournament_id, competition_id from imported_competitions
       where website = $1 and document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { tournamentId: row.tournament_id, competitionId: row.competition_id };
  }

  /**
   * Keeps what went wrong with one document. On the pool rather than in the
   * transaction the document was imported in, which has been rolled back.
   */
  /**
   * Keeps `message` against `documentId`, unless an error of its code has
   * been accepted for the document (import_accepted_errors). A message says
   * its code first, or after what of the document it names, as
   * "game 12: Competition.NotDrawnToMeet: ...".
   */
  async recordError(documentId: string, message: string): Promise<void> {
    await this.#pool.query(
      `insert into import_errors (document_id, error_message)
       select $1::text, $2::text
        where not exists (
          select 1 from import_accepted_errors accepted
           where accepted.document_id = $1::text
             and ($2::text like accepted.code || ':%'
                  or $2::text like '%: ' || accepted.code || ':%')
        )`,
      [documentId, message],
    );
  }

  /** How many errors were kept, by whatever kept them. */
  async errorCount(): Promise<number> {
    const { rows } = await this.#pool.query<{ count: string }>(
      "select count(*) as count from import_errors",
    );
    return Number(rows[0]?.count ?? 0);
  }

  /** What was kept against `documentId`, in the order it was kept. */
  async errorsFor(documentId: string): Promise<string[]> {
    const { rows } = await this.#pool.query<{ error_message: string }>(
      "select error_message from import_errors where document_id = $1",
      [documentId],
    );
    return rows.map((row) => row.error_message);
  }

  // Inside the transaction a user is being imported in, where there is one, so
  // that the account and the record of it are kept together or not at all.
  #queryable(): Pick<Pool, "query"> {
    return this.#unitOfWork.isUnderway
      ? this.#unitOfWork.connection()
      : this.#pool;
  }
}
