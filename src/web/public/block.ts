// A block's grid, at the block's own address: its results as the old site
// showed them. A row for each player in the block's order, and a column for
// each in the same order, so that where a player's row meets their
// opponent's column are the games between them; then each player's totals.
// What every view of a competition shares is competitionPages.ts's.
import type {
  BlockToRead,
  GameOfBlock,
  PlayerOfBlock,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { aWordToALine, type DrawView } from "./competitionPages.js";
import { playerShown } from "./tournamentPages.js";

/**
 * The first letter or digit of each word of `name`, a word being what spaces
 * part, each as it was written: so "Kerri-Ann Organ" is "KO" and "Jan van
 * Dijk" is "JvD".
 */
export const initialsOf = (name: string): string =>
  name
    .split(/\s+/u)
    .map((word) => /[\p{L}\p{N}]/u.exec(word)?.[0] ?? "")
    .join("");

// A player's totals, with the words they are headed by. Where each match is a
// single game a game won is a match won, so the old site's wins and net hoops
// are all there is to say; otherwise matches decide a block before games, and
// games before hoops, and the totals are in that order.
const totalsOf = (
  bestOf: number,
): readonly { word: string; of: (player: PlayerOfBlock) => number }[] =>
  bestOf === 1
    ? [
        { word: "block.wins", of: (player) => player.gamesWon },
        { word: "block.netHoops", of: (player) => player.netHoops },
      ]
    : [
        { word: "block.matches", of: (player) => player.matchesWon },
        { word: "block.netGames", of: (player) => player.netGames },
        { word: "block.games", of: (player) => player.gamesWon },
        { word: "block.netHoops", of: (player) => player.netHoops },
      ];

// One score, the row player's, in a game against the column player, marked
// for the row player by more than its colour: a word for whatever reads the
// page aloud, and a weight or a slant for whoever sees it. A withdrawn game
// is struck through, and said to be withdrawn, since it counts for nothing.
const scoreIn = (
  game: GameOfBlock,
  player: string,
  speaking: Speaking,
): string => {
  const won = game.winner === player;
  const result = game.drawn ? "drawn" : won ? "won" : "lost";
  const score = won ? game.winnerScore : game.loserScore;
  const said = [
    speaking.say(`block.${result}`),
    ...(game.withdrawn ? [speaking.say("block.gameWithdrawn")] : []),
  ].join(", ");
  const withdrawn = game.withdrawn ? " data-withdrawn" : "";
  return `<span class="block-grid-score block-grid-${result}"${withdrawn}><span class="block-grid-points">${escape(score)}</span> <span class="visually-hidden">${escape(said)}</span></span>`;
};

const grid = (
  asked: BlockToRead,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const totals = totalsOf(asked.block.bestOf);
  const heading = asked.players
    .map(
      (player) =>
        `                <th scope="col" class="block-grid-initials"><span aria-hidden="true">${escape(initialsOf(player.name))}</span><span class="visually-hidden">${escape(player.name)}</span></th>`,
    )
    .join("\n");
  const rows = asked.players
    .map((player) => {
      const cells = asked.players.map((opponent) => {
        if (opponent.id === player.id) {
          return `                <td class="block-grid-self"></td>`;
        }
        const between = asked.games.filter(
          (game) =>
            (game.winner === player.id && game.loser === opponent.id) ||
            (game.winner === opponent.id && game.loser === player.id),
        );
        return `                <td class="block-grid-cell">${between.map((game) => scoreIn(game, player.id, speaking)).join("")}</td>`;
      });
      const withdrawn = player.withdrawn
        ? ` <span class="block-grid-withdrawn">${escape(say("block.withdrawn"))}</span>`
        : "";
      return `              <tr class="block-grid-row">
                <th scope="row" class="block-grid-player">${playerShown(player, "player", speaking, assets, `/${player.address}`, player.withdrawn)}${withdrawn}</th>
${cells.join("\n")}
${totals.map(({ of }) => `                <td class="block-grid-total">${escape(String(of(player)))}</td>`).join("\n")}
              </tr>`;
    })
    .join("\n");
  return `          <div class="block-grid-scroll" role="region" aria-labelledby="competition-heading" tabindex="0">
            <table class="block-grid">
              <thead>
              <tr>
                <td class="block-grid-corner"></td>
${heading}
${totals.map(({ word }) => `                <th scope="col" class="block-grid-total-heading">${aWordToALine(escape(say(word)))}</th>`).join("\n")}
              </tr>
              </thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>`;
};

/** What draws a block's grid. */
export const gridView =
  (assets: Assets): DrawView<BlockToRead> =>
  (asked, speaking) =>
    grid(asked, speaking, assets);

/** The players of `asked` by the id its games name each by. */
export const playersById = (
  asked: BlockToRead,
): ReadonlyMap<string, PlayerOfBlock> =>
  new Map(asked.players.map((player) => [player.id, player]));
