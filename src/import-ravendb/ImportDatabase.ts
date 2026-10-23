import type { Pool } from "pg";

import type { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { dropTables } from "../infrastructure/database/dropTables.js";
import { migrate } from "../infrastructure/database/migrate.js";

/**
 * The tournament on the site a document the import refused is of, and the
 * competition it was, where the import knew them.
 */
export interface ErrorOf {
  /** The tournament's address, as "2014/ac/spring-open". */
  readonly tournamentAddress: string;
  readonly tournamentName: string;
  /** Where the document was a competition, what it is called. */
  readonly competitionName?: string;
  /** Where the document is on the site, without a leading slash. */
  readonly newSitePath: string;
  /** Where the document was on the old site, without a leading slash. */
  readonly oldSitePath: string;
}

/** Where a document the import refused is kept, with why. */
export interface ImportErrors {
  /**
   * Keeps `message` against `documentId`, which names its website too, and
   * the tournament and competition it is `of`, where they are known, and
   * what went wrong said for a person, its `summary`, where there is one.
   */
  recordError(
    documentId: string,
    message: string,
    of?: ErrorOf,
    summary?: string,
  ): Promise<void>;
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
    // (0001-initial.sql), so that the administrator's page for it finds
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
    // What a competition said a tournament player represents, by the first
    // competition to say it, so that a later competition saying otherwise is
    // the one that gives way (importCompetition.ts).
    await this.#pool.query(`
      create table competition_representing (
          website                text not null,
          tournament_document_id text not null,
          player_id              text not null,
          representing           text not null,
          primary key (website, tournament_document_id, player_id)
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

  /**
   * Keeps that a competition said the player `playerId` of the tournament
   * represents `representing`. Said already, it is kept as it was: the first
   * competition to say it is the one that counts.
   */
  async recordRepresentedBy(
    website: string,
    tournamentDocumentId: string,
    playerId: string,
    representing: string,
  ): Promise<void> {
    await this.#queryable().query(
      `insert into competition_representing
           (website, tournament_document_id, player_id, representing)
       values ($1, $2, $3, $4)
       on conflict do nothing`,
      [website, tournamentDocumentId.toLowerCase(), playerId, representing],
    );
  }

  /** What the first competition to say it said the player represents, if any has. */
  async findRepresentedBy(
    website: string,
    tournamentDocumentId: string,
    playerId: string,
  ): Promise<string | undefined> {
    const { rows } = await this.#queryable().query<{ representing: string }>(
      `select representing from competition_representing
       where website = $1 and tournament_document_id = $2 and player_id = $3`,
      [website, tournamentDocumentId.toLowerCase(), playerId],
    );
    return rows[0]?.representing;
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
  async recordError(
    documentId: string,
    message: string,
    of?: ErrorOf,
    summary?: string,
  ): Promise<void> {
    await this.#pool.query(
      `insert into import_errors
         (document_id, error_message,
          tournament_address, tournament_name, competition_name,
          new_site_path, old_site_path, summary)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        documentId,
        message,
        of?.tournamentAddress ?? null,
        of?.tournamentName ?? null,
        of?.competitionName ?? null,
        of?.newSitePath ?? null,
        of?.oldSitePath ?? null,
        summary ?? null,
      ],
    );
  }

  /**
   * The address and the name of the tournament the tournament document
   * `documentId` on `website` became, as the site has them, for an error of
   * something naming it once it is over. Nothing where it was not brought
   * over.
   */
  async tournamentOf(
    website: string,
    documentId: string,
  ): Promise<
    | { readonly tournamentAddress: string; readonly tournamentName: string }
    | undefined
  > {
    const { rows } = await this.#queryable().query<{
      address: string;
      name: string;
    }>(
      `select listed.address, listed.name
         from imported_tournaments imported
         join tournaments_by_website listed
           on listed.tournament_id = imported.tournament_id
        where imported.website = $1 and imported.document_id = $2`,
      [website, documentId.toLowerCase()],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { tournamentAddress: row.address, tournamentName: row.name };
  }

  /** How many errors were kept, by whatever kept them. */
  async errorCount(): Promise<number> {
    const { rows } = await this.#pool.query<{ count: string }>(
      "select count(*) as count from import_errors",
    );
    return Number(rows[0]?.count ?? 0);
  }

  /**
   * Whether any error was kept against `documentId`, in any case, as the old
   * sites compared their ids.
   */
  async hasErrorsFor(documentId: string): Promise<boolean> {
    const { rows } = await this.#pool.query(
      "select 1 from import_errors where lower(document_id) = lower($1) limit 1",
      [documentId],
    );
    return rows.length > 0;
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
