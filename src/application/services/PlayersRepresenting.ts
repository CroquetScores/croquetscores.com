/**
 * Where what players represent is found as it is typed, for the player dialog
 * (RepresentingMatching.feature).
 */
export interface PlayersRepresenting {
  /**
   * What players who are not archived represent in which `typed` begins a
   * word, whatever its case, in alphabetical order, no more than `most` of
   * them. A space or a hyphen begins a word, and no character in `typed`
   * stands for another. What differs only in case is found once, as it was
   * first kept.
   */
  beginning(typed: string, most: number): Promise<readonly string[]>;
}
