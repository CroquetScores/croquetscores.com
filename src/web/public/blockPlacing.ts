// What a block's grid and its summary say alike of where its players are
// placed: each player's place, and how players level on matches won are told
// apart. Said once here so that the two cannot come to disagree.
import type {
  BlockToRead,
  PlayerOfBlock,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";

/**
 * A player's place as a page shows it: "1", and "=2" where others share
 * second, since players who cannot be told apart share a place. Nothing where
 * the player has withdrawn, as they have no place.
 */
export const placeShown = ({ placing }: PlayerOfBlock): string =>
  placing === undefined
    ? ""
    : `${placing.shared ? "=" : ""}${String(placing.place)}`;

// The words that say what tells apart the players level on matches won, from
// what the answer says it was, so that the page can never say one thing and the
// ranking do another. The steps are always looked at in the same order and each
// begins a different sentence, so the first says which sentence it is. Every
// step is named, so that one added to `TellsApartBy` is refused here by the
// type check rather than worded as "no known way".
const wordsFor = ({ block }: BlockToRead): string => {
  const [first] = block.tellsApartBy;
  switch (first) {
    case undefined:
      return "block.tieBreak.other";
    case "netGames":
      return "block.tieBreak.netGamesNetHoopsWhoBeatWho";
    case "netHoops":
      return "block.tieBreak.netHoopsWhoBeatWho";
    case "whoBeatWho":
      return "block.tieBreak.whoBeatWho";
    default:
      return first satisfies never;
  }
};

/**
 * A paragraph saying how the block's players level on matches won are told
 * apart, on a line of its own to follow what it is put after, or nothing where
 * none are level, since there is then nothing for a tie break to have done.
 */
export const tieBreakSaid = (asked: BlockToRead, { say }: Speaking): string =>
  asked.block.levelOnMatchesWon
    ? `\n          <p class="block-tie-break">${escape(say(wordsFor(asked)))}</p>`
    : "";
