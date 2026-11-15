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
  // What readers say of putting the site on their phone, and what the help says
  // (readers/home-screen). Each is paired with the help's words and none with
  // the others: an icon is not an app, and a reader asking about one should not
  // be sent to pages about the other. Each form a reader is likely to type is
  // named, since a synonym is not stemmed. Read from the reader's word to the
  // help's, since a synonym of two words is not matched to a question's single
  // ones.
  ["install", "home screen"],
  ["installed", "home screen"],
  ["installing", "home screen"],
  ["app", "home screen"],
  ["apps", "home screen"],
  ["icon", "home screen"],
  ["icons", "home screen"],
];
