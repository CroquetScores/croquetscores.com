/**
 * Running work inside a transaction, for the few commands that have to run
 * their own.
 *
 * Almost nothing needs this. A command is given one transaction around the
 * whole of it before its handler is called, and a handler that simply does its
 * work inside that one never has to know this exists. What needs it is a
 * handler that must let go of its connection partway through — because it has
 * to ask another site something, and a transaction held open across the
 * network holds a connection open with it.
 *
 * It says what is to happen and not what it happens on. No connection comes
 * back from it and no database is named in it, which is what keeps it
 * something the application may hold: the unit of work behind it is
 * infrastructure, and an application that named that, or took a connection out
 * of it, would be the layering broken. What asks for a connection is always an
 * adapter, and asks the unit of work directly.
 */
export interface Transactions {
  /**
   * Runs `work` inside a transaction it may write in, committed when it
   * answers and rolled back when it fails. Refused where a transaction is
   * already underway: one command is one unit of work, and a second inside the
   * first belongs to neither.
   */
  inTransaction<TResult>(work: () => Promise<TResult>): Promise<TResult>;

  /**
   * Runs `work` inside a read-only transaction, so that what it reads more
   * than once it reads as of one moment. Joins the transaction already
   * underway where there is one.
   */
  inReadOnlyTransaction<TResult>(
    work: () => Promise<TResult>,
  ): Promise<TResult>;
}
