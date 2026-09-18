// What every command passes through on its way to its handler: a connection,
// and a transaction it can write in, committed when the handler answers and
// rolled back when it fails. Everything a command changes stands or falls
// together.
//
// What holds this up so far is the rule in
// specs/infrastructure/database/read-only-transaction-behaviour/, where four
// scenarios need a command underway to ask a query inside: they hold it to
// opening one transaction, to a handler seeing what it has written, and to a
// failed command leaving nothing behind. Its own scenarios, in
// specs/infrastructure/database/transaction-behaviour/, cover the edges those
// do not reach — a commit that fails, a rollback that fails, and a command
// sent from inside a command, which is refused rather than joined. They are
// written and not yet running, and that refusal is not built here yet.
import type { Behaviour } from "../../application/common/Behaviour.js";
import type { UnitOfWork } from "./UnitOfWork.js";

export class TransactionBehaviour implements Behaviour {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  invoke<TResult>(
    _request: unknown,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    return this.unitOfWork.inTransaction(next);
  }
}
