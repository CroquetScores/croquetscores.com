// The connection the request being served is running on, and the transaction
// around it. A repository, the event store or a projection asks for the
// connection rather than being handed one, so that everything one request
// touches is on the same connection and inside the same transaction.
//
// It lives here rather than in src/application/services/ because nothing in the
// application or the domain has any use for it: what asks is always an adapter,
// and what it gets back is a Postgres client. An interface in the application
// naming a Postgres type would be the layering broken; one hiding it behind an
// opaque type would be every adapter casting its way back out.
import { AsyncLocalStorage } from "node:async_hooks";
import type { Pool, PoolClient } from "pg";

/** Every reason asking for a connection can be refused. */
export type UnitOfWorkErrorCode =
  "UnitOfWork.NothingUnderway" | "UnitOfWork.AlreadyUnderway";

export class UnitOfWorkRefused extends Error {
  readonly code: UnitOfWorkErrorCode;

  constructor(code: UnitOfWorkErrorCode, message: string) {
    super(message);
    this.name = "UnitOfWorkRefused";
    this.code = code;
  }
}

export class UnitOfWork {
  // Async local storage rather than a field, because a field would be one
  // connection shared by every request in flight: two requests being served at
  // the same time would take it in turns to overwrite it, and each would end up
  // writing inside the other's transaction. The store follows the request
  // instead, through every await in it and nowhere else.
  private readonly underway = new AsyncLocalStorage<PoolClient>();

  constructor(private readonly pool: Pool) {}

  /**
   * The connection the request being served is running on. Refused with
   * `UnitOfWork.NothingUnderway` where no request is being served, rather than
   * answered with a connection nobody is going to commit or give back.
   */
  connection(): PoolClient {
    const connection = this.underway.getStore();
    if (connection === undefined) {
      throw new UnitOfWorkRefused(
        "UnitOfWork.NothingUnderway",
        "Nothing is being served, so there is no connection to give out.",
      );
    }
    return connection;
  }

  /** Whether a request is being served on this connection already. */
  get isUnderway(): boolean {
    return this.underway.getStore() !== undefined;
  }

  /**
   * Runs `serve` inside a transaction it may write in, committed when it
   * answers and rolled back when it fails.
   */
  async inTransaction<TResult>(
    serve: () => Promise<TResult>,
  ): Promise<TResult> {
    return this.around("begin", serve);
  }

  /**
   * Runs `serve` inside a read-only transaction, or inside the transaction
   * already underway when there is one — see ReadOnlyTransactionBehaviour for
   * why a query joins a command rather than opening a second transaction.
   */
  async inReadOnlyTransaction<TResult>(
    serve: () => Promise<TResult>,
  ): Promise<TResult> {
    if (this.isUnderway) return serve();

    // Repeatable read, and not the read committed a transaction gets by
    // default, because read committed takes a fresh snapshot for every
    // statement: a query reading twice inside one of those still reads two
    // moments, and the transaction would be doing nothing a query wants. The
    // snapshot is taken at the first statement rather than here, so what a
    // query sees is the database as of its first read.
    //
    // A command gets read committed, because repeatable read would have it fail
    // on anything another command touched while it ran, and a command has to be
    // able to write what it decided.
    return this.around(
      "begin transaction isolation level repeatable read read only",
      serve,
    );
  }

  private async around<TResult>(
    begin: string,
    serve: () => Promise<TResult>,
  ): Promise<TResult> {
    const connection = await this.pool.connect();
    try {
      await connection.query(begin);
      const answer = await this.underway.run(connection, serve);
      await connection.query("commit");
      return answer;
    } catch (failure) {
      // Whatever went wrong, the caller is owed the reason it went wrong rather
      // than whatever the rollback made of it. A rollback fails when the
      // connection is already gone, which is usually the same thing that failed
      // a moment ago, and reporting that instead would hide the cause behind
      // its own consequence.
      await connection.query("rollback").catch(() => undefined);
      throw failure;
    } finally {
      // Before anything else can have it, and whether it committed, rolled back
      // or never got as far as either. Enough connections never given back is a
      // site that has stopped answering.
      connection.release();
    }
  }
}
