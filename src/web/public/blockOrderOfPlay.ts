// A block's order of play: every game of the block in use, in the order it
// was played, the oldest first, so that the block reads as it unfolded. A
// game is shown as the tournament's page shows one, but for the competition
// beside it, since every game here is the block's. What every view of a block
// shares is blockPages.ts's.
import type { PlayerInGame } from "../../application/operations/tournaments/GamesOfTournament.js";
import type { BlockToRead } from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { type DrawView, playersById } from "./blockPages.js";
import { gameShown } from "./tournamentPages.js";

const orderOfPlay = (
  asked: BlockToRead,
  now: Date,
  speaking: Speaking,
  assets: Assets,
): string => {
  if (asked.games.length === 0) {
    return `          <p class="games-none">${escape(speaking.say("blockOrderOfPlay.none"))}</p>`;
  }
  const byId = playersById(asked);
  const player = (id: string): PlayerInGame => byId.get(id) ?? { name: "" };
  return `          <ol class="games">
${asked.games
  .map((game) =>
    gameShown(
      { ...game, winner: player(game.winner), loser: player(game.loser) },
      undefined,
      now,
      speaking,
      assets,
    ),
  )
  .join("\n")}
          </ol>`;
};

/** What draws a block's order of play. */
export const orderOfPlayView =
  (assets: Assets): DrawView =>
  (asked, speaking, request) =>
    orderOfPlay(asked, request.requestedAt.toDate(), speaking, assets);
