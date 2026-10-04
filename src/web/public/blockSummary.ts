// A block's summary: a short table for a phone, a row for each player ranked
// and three numbers beside them, where the grid has a column for every
// player. Beneath it the page says how the players are ranked, and that a
// tournament's own regulations may place them otherwise. What every view of
// a competition shares is competitionPages.ts's.
import type {
  BlockToRead,
  PlayerOfBlock,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { playersById } from "./block.js";
import { aWordToALine, type DrawView } from "./competitionPages.js";
import { playerShown } from "./tournamentPages.js";

// Ahead and behind each carry their sign, so that they read as such down the
// column, and none carries none.
const signed = (count: number): string =>
  count > 0 ? `+${String(count)}` : String(count);

// The numbers beside each player, with the words they are headed by. A game
// won is a match won where each match is a single game, so these serve a
// block of any best-of.
const columns: readonly {
  word: string;
  of: (player: PlayerOfBlock) => string;
}[] = [
  { word: "block.wins", of: (player) => String(player.matchesWon) },
  { word: "block.losses", of: (player) => String(player.matchesLost) },
  { word: "block.netHoops", of: (player) => signed(player.netHoops) },
];

const summary = (
  asked: BlockToRead,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
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
                <th scope="row" class="block-summary-player">${playerShown(player, "player", speaking, assets, `/${player.address}`)}${withdrawn}</th>
${columns.map(({ of }) => `                <td class="block-summary-total">${escape(of(player))}</td>`).join("\n")}
              </tr>`;
    })
    .join("\n");
  return `          <table class="block-summary">
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
          <p class="block-summary-ranking">${escape(say("blockSummary.ranking"))}</p>`;
};

/** What draws a block's summary. */
export const summaryView =
  (assets: Assets): DrawView<BlockToRead> =>
  (asked, speaking) =>
    summary(asked, speaking, assets);
