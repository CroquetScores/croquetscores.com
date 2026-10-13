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
import { Refused } from "../../domain/common/Refused.js";
import { DatabaseUnreachable } from "../../application/common/DatabaseUnreachable.js";
import { isUnreachable } from "./unreachable.js";

/** Every reason asking for a connection can be refused. */
export type UnitOfWorkErrorCode =
  "UnitOfWork.NothingUnderway" | "UnitOfWork.AlreadyUnderway";

export class UnitOfWorkRefused extends Refused<UnitOfWorkErrorCode> {}

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
   * answers and rolled back when it fails. Refused with
   * `UnitOfWork.AlreadyUnderway` when a request is already being served here.
   */
  async inTransaction<TResult>(
    serve: () => Promise<TResult>,
  ): Promise<TResult> {
    // One command is one unit of work. Joining the transaction underway would
    // have an outer rollback undo work the inner command's sender was told was
    // recorded; a transaction of its own would let the outer one fail and leave
    // the inner one's work standing alone. Neither is worth having, so it is
    // refused here, where it is attempted, rather than found later in what the
    // two of them left behind.
    if (this.isUnderway) {
      throw new UnitOfWorkRefused(
        "UnitOfWork.AlreadyUnderway",
        "A command was sent while another request was being served, and one request is one unit of work.",
      );
    }
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

  // A connection that could not be had. It is the database being out of
  // reach unless the pool simply had none free: a pool whose every connection
  // is in use times out waiting for a slot exactly as one that cannot
  // connect does, and is the site being busy, not the database being gone.
  private connectionFailed(failure: unknown): unknown {
    const waitedForASlot =
      failure instanceof Error &&
      /timeout exceeded when trying to connect/i.test(failure.message) &&
      this.pool.totalCount >= (this.pool.options.max ?? 10);
    if (waitedForASlot || !isUnreachable(failure)) return failure;
    return failure instanceof DatabaseUnreachable
      ? failure
      : new DatabaseUnreachable(failure);
  }

  private async around<TResult>(
    begin: string,
    serve: () => Promise<TResult>,
  ): Promise<TResult> {
    // A database that cannot be reached is said as that, here, rather than
    // left to be recognised by whatever a page happens to catch: every
    // request reaches the database through this, so it is the one place that
    // sees them all.
    let connection: PoolClient;
    try {
      connection = await this.pool.connect();
    } catch (failure) {
      throw this.connectionFailed(failure);
    }
    listenForItsLoss(connection);
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
      const rollbackFailure = await connection.query("rollback").then(
        () => undefined,
        (rollbackFailed: unknown) => rollbackFailed ?? new Error("rollback"),
      );
      // Only a failure that says the database was lost, on a connection
      // that cannot even roll back, is the database being unreachable. One
      // that merely looks like it — an outside service timing out while the
      // request holds its connection — leaves the connection able to roll
      // back. And a rollback that fails after some other failure is that
      // failure's consequence, which is not to hide it (TransactionBehaviour).
      if (
        rollbackFailure !== undefined &&
        !(failure instanceof DatabaseUnreachable) &&
        isUnreachable(failure)
      ) {
        throw new DatabaseUnreachable(failure);
      }
      throw failure;
    } finally {
      // Before anything else can have it, and whether it committed, rolled back
      // or never got as far as either. Enough connections never given back is a
      // site that has stopped answering.
      connection.release();
    }
  }
}

// Connections that have been given a listener for their loss, so that each is
// given one for its whole life rather than another every time it is borrowed.
const listening = new WeakSet<PoolClient>();

// A connection lost while it is held — a backend restarted, a failover, an
// administrator ending it — is reported on the connection itself when no
// statement is running to report it on instead. An EventEmitter with nobody
// listening for `error` throws, which here would take the whole process down
// over one request's connection. The pool listens to the connections it holds
// idle (see pool.ts), and nothing listened to the ones held by a request.
//
// Nothing needs doing when it happens. The next statement on the connection
// fails in the ordinary way, and that failure goes wherever the request's
// failures go; the pool discards a connection that can no longer be used when
// it is given back.
const listenForItsLoss = (connection: PoolClient): void => {
  if (listening.has(connection)) return;
  connection.on("error", () => {});
  listening.add(connection);
};
