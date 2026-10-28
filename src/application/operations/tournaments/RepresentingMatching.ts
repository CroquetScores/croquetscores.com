import { Query } from "../../common/Query.js";

/** What players represent that a text typed may be the start of. */
export interface RepresentingFound {
  readonly representing: readonly string[];
}

/**
 * What players have been added representing that `typed` may be the start of
 * (RepresentingMatching.feature).
 */
export class RepresentingMatching extends Query<RepresentingFound> {
  constructor(
    /** What was typed, as it was typed. */
    readonly typed: string,
  ) {
    super();
  }
}
