// A competition's order of play, the same whatever the competition: every game
// of it in use, in the order it was played, the oldest first, so that it reads
// as it unfolded. A game is shown as the tournament's page shows one, but for
// the competition beside it, since every game here is the competition's. What
// every view of a competition shares is competitionPages.ts's.
import type { FastifyRequest } from "fastify";

import type { BlockToRead } from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import type { KnockoutToRead } from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import type { SwissToRead } from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import type { TestToRead } from "../../application/operations/tournaments/PublicTestOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { forget, keep } from "../common/rememberedSorting.js";
import { playersById } from "./block.js";
import type { DrawView } from "./competitionPages.js";
import {
  type Column,
  firstOrder,
  list,
  type Order,
  sortedGames,
  sortingOf,
} from "./gamesSorting.js";
import { type GameShown, gameShown } from "./tournamentPages.js";
import { ariaSort, arrows } from "./tournamentLists.js";

// The lists of tournaments say up and down where the games say ascending and
// descending, and draw and announce them the same.
const direction = (order: Order): "up" | "down" =>
  order === "asc" ? "up" : "down";

const other = (order: Order): Order => (order === "asc" ? "desc" : "asc");

// The page's own address, ending in the order of play even where the page was
// opened at the competition's own address, so that a heading pressed leads to
// the view it sorts.
const addressOf = (request: FastifyRequest): string => {
  // A path starting with two slashes would be taken for another site's address
  // when it is a link, so it is never written as it is.
  const path = `/${(request.url.split("?")[0] ?? "").replace(/^\/+|\/+$/g, "")}`;
  return path.endsWith("/order-of-play") ? path : `${path}/order-of-play`;
};

const orderOfPlay = (
  games: readonly GameShown[],
  request: FastifyRequest,
  speaking: Speaking,
  assets: Assets,
): string => {
  if (games.length === 0) {
    return `          <p class="games-none">${escape(speaking.say("orderOfPlay.none"))}</p>`;
  }
  const { column, order, remembered } = sortingOf(request);
  const here = addressOf(request);
  // Pressing the heading the games are sorted by sorts them the other way, and
  // the other sorts them the way it is first sorted.
  const heading = (of: Column, words: string): string => {
    const sortedBy = of === column;
    const next = sortedBy ? other(order) : firstOrder[of];
    return `<th scope="col" class="games-column games-column-${of}"${sortedBy ? ` aria-sort="${ariaSort[direction(order)]}"` : ""}><a href="${escape(`${here}?sort=${of}&order=${next}&${keep}=${list}`)}">${
      sortedBy
        ? `<span class="sort-arrow" aria-hidden="true">${arrows[direction(order)]}</span>`
        : ""
    }<span class="games-column-words">${escape(words)}</span></a></th>`;
  };
  const now = request.requestedAt.toDate();
  const sorted = sortedGames(games, column, order, speaking.language.tag);
  return `          <table class="games-table">
            <thead>
              <tr>${heading("game", speaking.say("orderOfPlay.column.game"))}${heading("date", speaking.say("orderOfPlay.column.date"))}</tr>
            </thead>
            <tbody>
${sorted.map((game) => gameShown(game, undefined, now, speaking, assets, true)).join("\n")}
            </tbody>
          </table>${
            remembered
              ? `
          <p class="tournament-list-usual games-usual"><a href="${escape(`${here}?${forget}=${list}`)}">${escape(speaking.say("tournamentList.usualOrder"))}</a></p>`
              : ""
          }`;
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
      request,
      speaking,
      assets,
    );
  };

// A knockout's and a test's games are never withdrawn: neither kind can
// withdraw a game, and a withdrawn player's games in a knockout decided
// matches that stand.
const neverWithdrawn = <Played extends object>(
  games: readonly Played[],
): (Played & { readonly withdrawn: false })[] =>
  games.map((game) => ({ ...game, withdrawn: false as const }));

/** What draws a knockout's order of play. */
export const knockoutOrderOfPlay =
  (assets: Assets): DrawView<KnockoutToRead> =>
  (asked, speaking, request) =>
    orderOfPlay(neverWithdrawn(asked.games), request, speaking, assets);

/** What draws a Swiss's order of play. */
export const swissOrderOfPlay =
  (assets: Assets): DrawView<SwissToRead> =>
  (asked, speaking, request) =>
    orderOfPlay(asked.games, request, speaking, assets);

/** What draws a test's order of play, its players shown as representing their teams. */
export const testOrderOfPlay =
  (assets: Assets): DrawView<TestToRead> =>
  (asked, speaking, request) =>
    orderOfPlay(neverWithdrawn(asked.games), request, speaking, assets);
