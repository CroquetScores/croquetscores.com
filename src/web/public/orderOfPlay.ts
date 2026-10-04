// A competition's order of play, the same whatever the competition: every game
// of it in use, in the order it was played, the oldest first, so that it reads
// as it unfolded. A game is shown as the tournament's page shows one, but for
// the competition beside it, since every game here is the competition's. What
// every view of a competition shares is competitionPages.ts's.
import type { BlockToRead } from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import type { KnockoutToRead } from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import type { SwissToRead } from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { playersById } from "./block.js";
import type { DrawView } from "./competitionPages.js";
import { type GameShown, gameShown } from "./tournamentPages.js";

const orderOfPlay = (
  games: readonly GameShown[],
  now: Date,
  speaking: Speaking,
  assets: Assets,
): string => {
  if (games.length === 0) {
    return `          <p class="games-none">${escape(speaking.say("orderOfPlay.none"))}</p>`;
  }
  return `          <ol class="games">
${games.map((game) => gameShown(game, undefined, now, speaking, assets)).join("\n")}
          </ol>`;
};

/** What draws a block's order of play, its games naming players by their ids. */
export const blockOrderOfPlay =
  (assets: Assets): DrawView<BlockToRead> =>
  (asked, speaking, request) => {
    const byId = playersById(asked);
    const player = (id: string) => byId.get(id) ?? { name: "" };
    return orderOfPlay(
      asked.games.map((game) => ({
        ...game,
        winner: player(game.winner),
        loser: player(game.loser),
      })),
      request.requestedAt.toDate(),
      speaking,
      assets,
    );
  };

/** What draws a knockout's order of play. */
export const knockoutOrderOfPlay =
  (assets: Assets): DrawView<KnockoutToRead> =>
  (asked, speaking, request) =>
    orderOfPlay(asked.games, request.requestedAt.toDate(), speaking, assets);

/** What draws a Swiss's order of play. */
export const swissOrderOfPlay =
  (assets: Assets): DrawView<SwissToRead> =>
  (asked, speaking, request) =>
    orderOfPlay(asked.games, request.requestedAt.toDate(), speaking, assets);
