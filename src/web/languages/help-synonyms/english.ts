import type { HelpSynonyms } from "../../common/helpSynonyms.js";

// What readers ask with, and what the help says. Each pair is read both ways.
//
// "ranking" and "handicap" are not paired, though the issue that asked for
// synonyms listed them: here a ranking is the world ranking a tournament is
// entered in, which has nothing to do with a handicap, and a reader asking
// about one would be sent to the other.
export const english: HelpSynonyms = [
  ["visible", "publish"],
  ["live", "publish"],
  ["competition", "tournament"],
  ["competitor", "player"],
  ["bracket", "draw"],
];
