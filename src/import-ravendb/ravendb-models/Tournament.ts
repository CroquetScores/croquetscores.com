/** Another document, named by its key, as the old sites kept a reference. */
export interface Reference {
  /** The key of the document referred to, such as `users/1`. */
  readonly Id: string;
}

/**
 * A `Tournament` document as the old sites kept it in RavenDB, as far as
 * importing one reads it. Its players are in a document of their own
 * (`TournamentPlayers`), and each competition in another.
 */
export interface Tournament {
  readonly Name: string;
  /**
   * The days it started and finished, each as Newtonsoft wrote a `DateTime`:
   * midnight, with no zone.
   */
  readonly Start: string;
  readonly Finish: string;
  /** The slug it was found at, after its year and its sport. */
  readonly Slug: string;
  readonly CreatedBy: Reference;
  /** Every manager, the user who created it among them. */
  readonly Managers: readonly Reference[];
  /** Every scorer, every manager among them. */
  readonly Scorers: readonly Reference[];
  /**
   * Its competitions, in the order its manager listed them. An archived
   * competition was taken out of the list.
   */
  readonly Competitions: readonly Reference[];
  /** "AC", "GC", "a6w", "rc" or "GB". */
  readonly SportType: string;
  /** "standard", "teams", "eirecup", "interstateshield" or "gcwtc". */
  readonly TournamentType: string;
  /** A Windows time zone, such as "AUS Eastern Standard Time". */
  readonly TimeZoneId: string | null;
  /**
   * With "<" and ">" written as "&lt;" and "&gt;". Nothing, or left out of the
   * document altogether, where there are none.
   */
  readonly Notes?: string | null;
  /** That a test level on matches is drawn rather than decided by net games and hoops. */
  readonly DrawnMatchesAreNotDecidedByNetHoops: boolean;
  readonly IsArchived: boolean;
}
