// A player's page, at "/players" followed by their slug: the tournaments they
// have played in, once each, each leading to their own page in it
// (websitePlayer.feature). The heading sorts the table by tournament name,
// from a link of the page's own, so that it needs no scripting.
import type { FastifyInstance } from "fastify";

import { PlayerOfWebsite } from "../../application/operations/tournaments/PlayerOfWebsite.js";
import { foldedForSearch } from "../../application/operations/tournaments/searching.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { typedIn } from "./search.js";
import { sendPage } from "./tournamentLists.js";

type Order = "asc" | "desc";

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
    // the page begins with, the most recently started first, and is not a page
    // that is not there. An order that is not one is ascending.
    const sorted = typedIn(request.query.sort) === "tournament";
    const order: Order =
      typedIn(request.query.order) === "desc" ? "desc" : "asc";
    const rows = sorted
      ? [...asked.tournaments].sort((one, other) => {
          const by = foldedForSearch(one.name).localeCompare(
            foldedForSearch(other.name),
          );
          return order === "asc" ? by : -by;
        })
      : asked.tournaments;

    // Pressing the heading the table is sorted by sorts it the other way.
    const headingOrder: Order = sorted && order === "asc" ? "desc" : "asc";
    const here = `/players/${encodeURIComponent(slug)}`;
    const aria = sorted
      ? ` aria-sort="${order === "asc" ? "ascending" : "descending"}"`
      : "";

    const lines = rows
      .map(
        (row) =>
          `            <tr><td><a href="/${escape(row.playerAddress)}">${escape(row.name)}</a></td></tr>`,
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
              <tr><th scope="col"${aria}><a href="${escape(`${here}?sort=tournament&order=${headingOrder}`)}">${escape(speaking.say("websitePlayer.tournament"))}</a></th></tr>
            </thead>
            <tbody>
${lines}
            </tbody>
          </table>`,
      }),
    );
  });
};
