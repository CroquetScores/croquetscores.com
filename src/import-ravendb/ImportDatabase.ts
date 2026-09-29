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
 * given the two tables of the import's own (ImportDatabase.feature).
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
   * applies every migration, and makes `import_errors` and `imported_users`.
   */
  async reset(): Promise<void> {
    await dropTables(this.#pool);

    await migrate(this.#pool);

    await this.#pool.query(`
      create table import_errors (
          document_id   text not null,
          error_message text not null
      )
    `);

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
        documentId,
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
      [website, documentId],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { accountId: row.account_id, emailAddress: row.email_address };
  }

  /**
   * Keeps what went wrong with one document. On the pool rather than in the
   * transaction the document was imported in, which has been rolled back.
   */
  async recordError(documentId: string, message: string): Promise<void> {
    await this.#pool.query(
      "insert into import_errors (document_id, error_message) values ($1, $2)",
      [documentId, message],
    );
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
