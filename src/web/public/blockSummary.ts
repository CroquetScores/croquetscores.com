// A block's summary: a short table for a phone, a row for each player ranked
// and three numbers beside them and their place, where the grid has a column
// for every player. Beneath it the page says how the players are ranked, and
// that a tournament's own regulations may place them otherwise, and how those
// level on matches won are told apart. What every view of
// a competition shares is competitionPages.ts's.
import type {
  BlockToRead,
  PlayerOfBlock,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import { pairSides } from "../../domain/aggregates/tournaments/value-objects/pairName.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { playersById } from "./block.js";
import { placeShown, tieBreakSaid } from "./blockPlacing.js";
import { aWordToALine, type DrawView } from "./competitionPages.js";
import { playerShown } from "./tournamentPages.js";

// Ahead and behind each carry their sign, so that they read as such down the
// column, and none carries none.
const signed = (count: number): string =>
  count > 0 ? `+${String(count)}` : String(count);

// The numbers beside each player, with the words they are headed by: the
// matches they have won and lost, then, where a match is more than one game,
// their net games, which decide a tie before hoops do, then their net hoops.
// Where each match is a single game there are no net games to give. The games
// won are left to the grid, which has the room, since a phone's table is only
// as wide as its window.
const columnsOf = (
  bestOf: number,
  advantage: boolean,
): readonly {
  word: string;
  of: (player: PlayerOfBlock) => string;
}[] => [
  { word: "block.wins", of: (player) => String(player.matchesWon) },
  { word: "block.losses", of: (player) => String(player.matchesLost) },
  ...(bestOf === 1
    ? []
    : [
        {
          word: "block.netGames",
          of: (player: PlayerOfBlock) => signed(player.netGames),
        },
      ]),
  // In an Advantage block the same sum is of percentage points (block.feature).
  {
    word: advantage ? "block.netSf" : "block.netHoops",
    of: (player) => signed(player.netHoops),
  },
  // The place is the last, which is where a reader looks for it.
  { word: "block.placing", of: placeShown },
];

// A name held together with no-break spaces, so that a narrow row never leaves
// a first name on one line and its last name on the next. A doubles pair is
// held together on each side of its ampersand, which stays with the first
// player and is followed by the one space a line may break at. Done here and
// not in playerShown, which other pages draw with room to spare.
const held = (name: string): string => {
  const together = (words: string): string =>
    words.split(/\s+/u).join("\u00a0");
  const sides = pairSides(name);
  return sides === undefined
    ? together(name)
    : `${together(sides[0])}\u00a0& ${together(sides[1])}`;
};

const summary = (
  asked: BlockToRead,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const columns = columnsOf(asked.block.bestOf, asked.block.advantage);
  const byId = playersById(asked);
  const rows = asked.ranked
    .flatMap((id) => {
      const player = byId.get(id);
      return player === undefined ? [] : [player];
    })
    .map((player) => {
      const withdrawn = player.withdrawn
        ? ` <span class="block-summary-withdrawn">${escape(say("block.withdrawn"))}</span>`
        : "";
      return `              <tr>
                <th scope="row" class="block-summary-player">${playerShown({ ...player, name: held(player.name) }, "player", speaking, assets, `/${player.address}`, player.withdrawn, withdrawn)}</th>
${columns.map(({ of }) => `                <td class="block-summary-total">${escape(of(player))}</td>`).join("\n")}
              </tr>`;
    })
    .join("\n");
  return `          <div class="block-summary-scroll" role="region" aria-labelledby="competition-heading" tabindex="0">
          <table class="block-summary">
            <thead>
              <tr>
                <td class="block-summary-corner"></td>
${columns.map(({ word }) => `                <th scope="col" class="block-summary-heading">${aWordToALine(escape(say(word)))}</th>`).join("\n")}
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          </div>
          ${tieBreakSaid(asked, speaking)}`;
};

/** What draws a block's summary. */
export const summaryView =
  (assets: Assets): DrawView<BlockToRead> =>
  (asked, speaking) =>
    summary(asked, speaking, assets);
