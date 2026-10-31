// How a competition's order of play is sorted: by its games, the winner's name
// and then the loser's, or by when they were added, which is the order they
// were played in and the one the page begins with. The headings are links of
// the page's own, so the page needs no scripting, and the sorting is
// remembered on the reader's device as every sortable list's is
// (rememberedSorting.ts). It is one sorting for every competition rather than
// one a competition, as the view chosen is (competitionPages.ts).
import type { FastifyRequest } from "fastify";

import { foldedForSearch } from "../../application/operations/tournaments/searching.js";
import { rememberedOf, type Sortable } from "../common/rememberedSorting.js";
import { typedIn } from "./search.js";

export type Order = "asc" | "desc";
export type Column = "game" | "date";

export const page = "order-of-play";
export const list = "games";

// The way a column is sorted when it is pressed and the games were not sorted
// by it: names from A to Z, and the oldest game first, which is how the page
// begins.
export const firstOrder: Readonly<Record<Column, Order>> = {
  game: "asc",
  date: "asc",
};

const columnIn = (written: unknown): Column | undefined =>
  written === "game" || written === "date" ? written : undefined;

// An order that is not one is ascending, as the other lists take it.
const orderIn = (written: unknown): Order =>
  written === "desc" ? "desc" : "asc";

export const gamesSortable: Sortable = {
  name: list,
  parameters: ["sort", "order"],
  writtenIn: (query) => {
    const column = columnIn(typedIn(query.sort));
    return column === undefined
      ? undefined
      : `${column}-${orderIn(typedIn(query.order))}`;
  },
};

const rememberedSortingOf = (
  written: string | undefined,
): { readonly column: Column; readonly order: Order } | undefined => {
  const [column, order] = (written ?? "").split("-");
  const known = columnIn(column);
  return known === undefined || (order !== "asc" && order !== "desc")
    ? undefined
    : { column: known, order };
};

/**
 * How the games are to be sorted: as the address says, and failing that as the
 * device remembers, and failing that the oldest first. `remembered` says
 * whether the device remembers a sorting other than the usual order, for the
 * way back to be offered.
 */
export const sortingOf = (
  request: FastifyRequest,
): { column: Column; order: Order; remembered: boolean } => {
  const query = (request.query ?? {}) as Readonly<Record<string, unknown>>;
  const chosen = columnIn(typedIn(query.sort));
  // An address that sorts by something the page does not have is the usual
  // order, not whatever the device remembers: it said how to sort.
  if (chosen === undefined && typedIn(query.sort) !== "") {
    return { column: "date", order: firstOrder.date, remembered: false };
  }
  const remembered = rememberedSortingOf(rememberedOf(request, page)[list]);
  return {
    column: chosen ?? remembered?.column ?? "date",
    order:
      chosen !== undefined
        ? orderIn(typedIn(query.order))
        : (remembered?.order ?? firstOrder.date),
    // The way back is offered when what is remembered is not the usual order.
    remembered:
      remembered !== undefined &&
      !(remembered.column === "date" && remembered.order === firstOrder.date),
  };
};

/**
 * `games`, which come oldest first, sorted. Alike in what they are sorted by,
 * a game keeps the place it was in, so that the newest first is the oldest
 * first turned round.
 */
export const sortedGames = <
  Played extends {
    readonly winner: { readonly name: string };
    readonly loser: { readonly name: string };
  },
>(
  games: readonly Played[],
  column: Column,
  order: Order,
  language: string,
): Played[] => {
  const place = new Map(games.map((game, at) => [game, at]));
  const placeOf = (game: Played): number => place.get(game) ?? 0;
  // Folded once a game rather than at every comparison, and compared by one
  // collator rather than a locale looked up each time.
  const collator = new Intl.Collator(language);
  const names = new Map(
    games.map((game) => [
      game,
      [
        foldedForSearch(game.winner.name),
        foldedForSearch(game.loser.name),
      ] as const,
    ]),
  );
  return [...games].sort((one, another) => {
    if (column === "date") {
      return order === "asc"
        ? placeOf(one) - placeOf(another)
        : placeOf(another) - placeOf(one);
    }
    const [oneWinner = "", oneLoser = ""] = names.get(one) ?? [];
    const [anotherWinner = "", anotherLoser = ""] = names.get(another) ?? [];
    const by =
      collator.compare(oneWinner, anotherWinner) ||
      collator.compare(oneLoser, anotherLoser);
    return (order === "asc" ? by : -by) || placeOf(one) - placeOf(another);
  });
};
