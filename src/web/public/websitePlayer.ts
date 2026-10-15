// A player's page, at "/players" followed by their slug: the tournaments they
// have played in, once each, with the days each runs and leading to their own
// page in it (websitePlayer.feature). The headings sort the table, from links
// of the page's own, so that it needs no scripting.
import type { FastifyInstance } from "fastify";

import { PlayerOfWebsite } from "../../application/operations/tournaments/PlayerOfWebsite.js";
import { foldedForSearch } from "../../application/operations/tournaments/searching.js";
import type { PlayerTournament } from "../../application/operations/tournaments/searching.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { datedWithYear } from "../common/dates.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { typedIn } from "./search.js";
import { sendPage } from "./tournamentLists.js";

type Order = "asc" | "desc";
type Column = "date" | "tournament";

// The way a column is sorted when it is pressed and the table was not sorted by
// it: names from A to Z, and dates with the most recent first, which is the
// order a player's tournaments are read in.
const firstOrder: Readonly<Record<Column, Order>> = {
  tournament: "asc",
  date: "desc",
};

// Drawn as words would be, so that it takes the colour of the heading it is in,
// and hidden from a screen reader, which is told by the heading itself.
const arrows: Readonly<Record<Order, string>> = { asc: "↑", desc: "↓" };

const ariaSort: Readonly<Record<Order, string>> = {
  asc: "ascending",
  desc: "descending",
};

const other = (order: Order): Order => (order === "asc" ? "desc" : "asc");

// Alike in what it is sorted by, a row keeps the place it was in, which is the
// most recently started first.
const sortedBy = (
  rows: readonly PlayerTournament[],
  column: Column,
  order: Order,
): PlayerTournament[] =>
  [...rows].sort((one, another) => {
    const by =
      column === "tournament"
        ? foldedForSearch(one.name).localeCompare(foldedForSearch(another.name))
        : one.starts.localeCompare(another.starts) ||
          one.finishes.localeCompare(another.finishes);
    return order === "asc" ? by : -by;
  });

export const registerWebsitePlayerPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{
    Params: { slug: string };
    Querystring: { sort?: unknown; order?: unknown };
  }>("/players/:slug", async (request, reply) => {
    const website = websiteOf(request);
    // A slug is the same in any case, since a link that is typed or shared is
    // not always written as the slug is.
    const slug = request.params.slug.toLowerCase();
    let asked;
    try {
      asked = await request.server.mediator.query(
        new PlayerOfWebsite(website.host, slug),
      );
    } catch (failure) {
      // No player the website has at the slug is a page that is not there.
      if (
        failure instanceof TournamentOperationRefused &&
        failure.code === "PlayerOfWebsite.NoSuchPlayer"
      ) {
        return reply.callNotFound();
      }
      throw failure;
    }
    const speaking = speakingOf(request);

    // Sorted only by what the page has to sort by. Anything else is the order
    // the page begins with, the most recently started first, which is the dates
    // from the newest, and is not a page that is not there. An order that is
    // not one is ascending.
    const chosenSort = typedIn(request.query.sort);
    const chosen: Column | undefined =
      chosenSort === "tournament" || chosenSort === "date"
        ? chosenSort
        : undefined;
    const column: Column = chosen ?? "date";
    const order: Order =
      chosen === undefined
        ? firstOrder.date
        : typedIn(request.query.order) === "desc"
          ? "desc"
          : "asc";
    const rows = sortedBy(asked.tournaments, column, order);

    const here = `/players/${encodeURIComponent(slug)}`;
    // Pressing the heading the table is sorted by sorts it the other way, and
    // any other sorts it the way that column is first sorted.
    const heading = (of: Column, words: string): string => {
      const now = of === column;
      const next = now ? other(order) : firstOrder[of];
      return `<th scope="col"${now ? ` aria-sort="${ariaSort[order]}"` : ""}><a href="${escape(`${here}?sort=${of}&order=${next}`)}">${
        now
          ? `<span class="sort-arrow" aria-hidden="true">${arrows[order]}</span>`
          : ""
      }${escape(words)}</a></th>`;
    };

    const lines = rows
      .map(
        (row) =>
          `            <tr><td class="tournament-dates">${escape(datedWithYear(row.starts, row.finishes, speaking.language.tag))}</td><td><a href="/${escape(row.playerAddress)}">${escape(row.name)}</a></td></tr>`,
      )
      .join("\n");

    return sendPage(
      reply,
      request,
      render(assets, {
        title: asked.name,
        // Of the players, as the page of them is, so that the navigation says
        // where a reader is.
        currentPath: "/players",
        theme: themeOf(request),
        signedIn: signedIn(request),
        hasPassword: hasPassword(request),
        speaking,
        siteName: siteNameOf(request),
        tryWebsite: website.isTry,
        path: request.url,
        body: `          <h1>${escape(asked.name)}</h1>
          <table class="player-tournaments">
            <thead>
              <tr>${heading("date", speaking.say("tournamentList.column.date"))}${heading("tournament", speaking.say("websitePlayer.tournament"))}</tr>
            </thead>
            <tbody>
${lines}
            </tbody>
          </table>`,
      }),
    );
  });
};
