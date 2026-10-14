/** What a rebuild of the read models says of how far it has got, as it goes. */
export interface RebuildProgress {
  /** Told how many streams there are, before any read model is touched. */
  streams(total: number): void;
  /**
   * Told, as each stream has been handed to every read model, how many are
   * done. Waited for, so that what it does is done before the next stream is
   * begun.
   */
  streamDone(completed: number): void | Promise<void>;
}
