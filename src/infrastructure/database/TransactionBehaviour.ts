// What every command passes through on its way to its handler: a connection,
// and a transaction it can write in, committed when the handler answers and
// rolled back when it fails. Everything a command changes stands or falls
// together.
//
// A command sent while a request is already being served is refused rather
// than joined — the unit of work says why, since it is what knows whether
// anything is underway. A query asked inside a command is the other way round,
// and joins it: see ReadOnlyTransactionBehaviour.
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
