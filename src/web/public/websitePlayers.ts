// The page of players, a search for players by name and nothing else
// (websitePlayers.feature). It lists nobody before one is made.
import type { FastifyInstance } from "fastify";

import { SearchPlayersOfWebsite } from "../../application/operations/tournaments/SearchPlayersOfWebsite.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { typedIn } from "./search.js";
import { sendPage } from "./tournamentLists.js";

export const registerWebsitePlayersPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: { search?: unknown } }>(
    "/players",
    async (request, reply) => {
      const typed = typedIn(request.query.search);
      const website = websiteOf(request);
      const speaking = speakingOf(request);
      const { say } = speaking;
      const searched = typed.trim() !== "";
      const found = searched
        ? await request.server.mediator.query(
            new SearchPlayersOfWebsite(website.host, typed),
          )
        : [];
      const label = escape(say("players.search.label"));

      const results = !searched
        ? `          <p class="players-search-prompt">${escape(say("players.search.prompt"))}</p>`
        : found.length === 0
          ? `          <p class="players-search-none">${escape(say("players.search.none"))}</p>`
          : `          <ul class="players-search-found">
${found
  .map(
    (each) =>
      `            <li class="player"><a class="player-name" href="/${escape(each.address)}">${escape(each.name)}</a></li>`,
  )
  .join("\n")}
          </ul>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          title: say("tournament.players"),
          currentPath: "/players",
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(say("tournament.players"))}</h1>
          <form class="players-search" role="search" action="/players" method="get">
            <input type="search" name="search" aria-label="${label}" value="${escape(typed)}" />
            <button type="submit">${label}</button>
          </form>
${results}`,
        }),
      );
    },
  );
};
