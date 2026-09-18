// What every query passes through on its way to its handler: a connection, and
// a read-only transaction around it.
//
// The transaction is not there to commit anything, because a query writes
// nothing. It is there so that a query reading more than once reads one
// database: a page of rows and the count of what it was drawn from, taken
// outside a transaction, are each as of the moment they were read, and can
// disagree. Read-only is the other half of it, so that a write on the read side
// is refused by Postgres rather than by a rule somebody has to remember.
//
// A query asked while a command is underway joins that command instead — its
// connection and its transaction, which is one that can be written in. The
// alternative is a query reading the database as it was before the command
// began, because nothing outside the command's transaction can see inside it,
// and the command recording a decision made on what it had already made out of
// date. That is decided in the unit of work, which is what knows whether
// anything is underway.
import type { Behaviour } from "../../application/common/Behaviour.js";
import type { UnitOfWork } from "./UnitOfWork.js";

export class ReadOnlyTransactionBehaviour implements Behaviour {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  invoke<TResult>(
    _request: unknown,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    return this.unitOfWork.inReadOnlyTransaction(next);
  }
}
