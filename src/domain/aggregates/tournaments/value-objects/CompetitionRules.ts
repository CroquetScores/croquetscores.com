/**
 * How a competition is played and counted, which each of a tournament's
 * competitions and tests says for itself, since one tournament can hold both a
 * handicap block and a level one, or a drawn test and a decided one.
 */
export interface CompetitionRules {
  /** Whether it is played with handicaps. */
  readonly handicap: boolean;
  /** Whether a game in it can be drawn. A knockout's cannot, whatever this says. */
  readonly drawsAllowed: boolean;
  /** Whether its results count towards the world rankings. */
  readonly worldRankings: boolean;
}

/**
 * What adding or updating a competition says of its rules. Each may be left
 * unsaid, and what it is then is the tournament's to decide, as it is for a
 * tournament's own.
 */
export interface CompetitionRulesSaid {
  readonly handicap?: boolean | undefined;
  readonly drawsAllowed?: boolean | undefined;
  readonly worldRankings?: boolean | undefined;
}
