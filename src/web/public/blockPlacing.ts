// What a block's grid and its summary say alike of where its players are
// placed: each player's place, and how players level on matches won are told
// apart. Said once here so that the two cannot come to disagree.
import type {
  BlockToRead,
  PlayerOfBlock,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import { TieBreak } from "../../domain/aggregates/tournaments/value-objects/TieBreak.js";
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

// The words that say how a block's tie break tells players apart. Where each
// match is a single game net games are left out of what is said as they are
// out of the ranking, since a game won is then a match won.
const wordsFor = ({ block }: BlockToRead): string => {
  if (block.tieBreak === TieBreak.netGamesNetHoopsWhoBeatWho.code) {
    return block.bestOf === 1
      ? "block.tieBreak.netHoopsWhoBeatWho"
      : "block.tieBreak.netGamesNetHoopsWhoBeatWho";
  }
  return block.tieBreak === TieBreak.whoBeatWho.code
    ? "block.tieBreak.whoBeatWho"
    : "block.tieBreak.other";
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
