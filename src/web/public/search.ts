// The results of searching the website: the tournaments, the players and the
// competitions whose names the words typed are found in (search.feature). The
// search box is in the header of every page, a form that is sent as any is, so
// the page needs no scripting and what was asked is in its address.
import type { FastifyInstance } from "fastify";

import { Search } from "../../application/operations/tournaments/Search.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";

/** What was typed, as one piece of text however the address wrote it. */
export const typedIn = (given: unknown): string =>
  typeof given === "string" ? given : "";

export const registerSearchPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: { q?: unknown } }>(
    "/search",
    async (request, reply) => {
      const typed = typedIn(request.query.q);
      const website = websiteOf(request);
      const speaking = speakingOf(request);
      const { say } = speaking;
      const found = await request.server.mediator.query(
        new Search(website.host, typed),
      );
      const searched = typed.trim() !== "";
      const nothing =
        found.tournaments.length === 0 &&
        found.players.length === 0 &&
        found.competitions.length === 0;

      const list = (heading: string, items: readonly string[]): string =>
        items.length === 0
          ? ""
          : `          <section class="search-list">
            <h2>${escape(heading)}</h2>
            <ul>
${items.join("\n")}
            </ul>
          </section>
`;
      const results = !searched
        ? ""
        : nothing
          ? `          <p class="search-none">${escape(say("search.nothingFound"))}</p>`
          : [
              list(
                say("search.tournaments"),
                found.tournaments.map(
                  (each) =>
                    `              <li class="search-tournament"><a href="/${escape(each.address)}">${escape(each.name)}</a></li>`,
                ),
              ),
              list(
                say("tournament.players"),
                found.players.map(
                  (each) =>
                    `              <li class="search-player"><a href="/${escape(each.address)}">${escape(each.name)}</a></li>`,
                ),
              ),
              list(
                say("search.competitions"),
                found.competitions.map(
                  (each) =>
                    `              <li class="search-competition"><a href="/${escape(each.address)}">${escape(each.name)}</a> <a class="search-of" href="/${escape(each.tournament.address)}">${escape(each.tournament.name)}</a></li>`,
                ),
              ),
            ].join("");

      return sendPage(
        reply,
        request,
        render(assets, {
          title: say("search.label"),
          pageName: { name: say("search.label"), href: "/search" },
          searchText: typed,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: results,
        }),
      );
    },
  );
};
