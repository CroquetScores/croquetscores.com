/**
 * A command that opens and closes its own transactions, and so is to be given
 * none around it.
 *
 * Saying so is the command's rather than the handler's because what decides —
 * the transaction behaviour — is never given the handler. A command is all it
 * sees, so a command is what has to say it. A command that says nothing is
 * given one transaction around the whole of it, which is what nearly every
 * command wants.
 *
 * A command says this only where it has to. What it gives up is everything one
 * transaction around the whole of it guarantees — that what the command
 * changed stands or falls together — and its handler takes on the whole of
 * that itself.
 */
export interface RunsItsOwnTransactions {
  readonly runsItsOwnTransactions: boolean;
}

/**
 * Whether a command says it runs its own. Anything that does not say so, or
 * says anything but true, is given a transaction: this decides whether a
 * command is left without one, so only a command that plainly asks to be is.
 */
export const runsItsOwnTransactions = (request: object): boolean =>
  (request as Partial<RunsItsOwnTransactions>).runsItsOwnTransactions === true;
