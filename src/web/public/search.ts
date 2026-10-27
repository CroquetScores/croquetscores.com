// The results of searching the website: the tournaments, the players and the
// competitions whose names the words typed are found in (search.feature). The
// search box is in the header of every page, a form that is sent as any is, so
// the page needs no scripting and what was asked is in its address.
import type { FastifyInstance } from "fastify";

import { Search } from "../../application/operations/tournaments/Search.js";
import type { TournamentFound } from "../../application/operations/tournaments/searching.js";
import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Assets } from "../common/assets.js";
import { datedWithYear } from "../common/dates.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  arrows,
  ariaSort,
  type Column,
  columnWords,
  pressed,
  sendPage,
  sorted,
  type Sorting,
  sortingRead,
  sortingWritten,
} from "./tournamentLists.js";

/** What was typed, as one piece of text however the address wrote it. */
export const typedIn = (given: unknown): string =>
  typeof given === "string" ? given : "";

// The two lists that are tables keep how they are sorted in the address, each
// under its own name and beside what was typed, so that a sorted page can be
// linked to and is there when it is opened again. Their sorting is apart: a
// reader who sorts the tournaments has said nothing of the competitions.
type Table = "tournaments" | "competitions";

// A thing found, with the tournament whose days and country it is shown with:
// its own, or for a competition the one it is in.
interface Row {
  readonly name: string;
  readonly address: string;
  readonly tournament: TournamentFound;
  /** The tournament it is in, shown after a competition's name. */
  readonly of?: TournamentFound;
}

// Oldest first until a column is pressed, which is the order a reader looking
// for a tournament by its days reads in; alphabetical order was tried first
// and shows a reader nothing about where in time each is.
const firstSorting: Sorting = { column: "date", order: "up" };

export const registerSearchPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: Record<string, unknown> }>(
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

      // Anything that is not a sorting is taken as none, as it is on the
      // lists of tournaments (tournamentLists.ts): the lists begin in
      // alphabetical order, which no column shows.
      const sortings: Readonly<Record<Table, string | undefined>> = {
        tournaments: typedIn(request.query.tournaments) || undefined,
        competitions: typedIn(request.query.competitions) || undefined,
      };

      // The page's address with the sorting of `table` changed and the other
      // table's kept as it was asked.
      const addressWith = (table: Table, written: string): string => {
        const said = new URLSearchParams({ q: typed });
        for (const [name, value] of Object.entries({
          ...sortings,
          [table]: written,
        })) {
          if (value !== undefined) said.set(name, value);
        }
        return `/search?${said.toString()}`;
      };

      // The blurb is beneath the end of the list that was cut, and not
      // beneath the ones that were not.
      const more = (items: number, cut: boolean): string =>
        cut
          ? `\n            <p class="search-more">${escape(say("search.more", { count: String(items) }))}</p>`
          : "";

      // The flag names its country for a reader who cannot see it. It leads
      // nowhere, since a search is not narrowed by country.
      const flagOf = (tournament: TournamentFound): string => {
        const code = tournament.country;
        const flag =
          code === undefined ? undefined : Countries.thereAre.find(code)?.flag;
        return code === undefined || flag === undefined
          ? ""
          : `<img src="${escape(assets.url(`images/${flag.relativePath}`))}" alt="${escape(say(`country.${code}`))}" />`;
      };

      const byName = new Intl.Collator(speaking.language.tag);

      const table = (
        name: Table,
        heading: string,
        kind: "tournament" | "competition",
        rows: readonly Row[],
        cut: boolean,
      ): string => {
        if (rows.length === 0) return "";
        const sorting = sortingRead(sortings[name]) ?? firstSorting;
        const headed = (column: Column): string => {
          const marked = sorting.column === column ? sorting.order : undefined;
          const href = addressWith(
            name,
            sortingWritten(pressed(column, sorting)),
          );
          return `                <th scope="col"${marked === undefined ? "" : ` aria-sort="${ariaSort[marked]}"`}><a href="${escape(href)}">${
            marked === undefined
              ? ""
              : `<span class="sort-arrow" aria-hidden="true">${arrows[marked]}</span>`
          }${escape(say(columnWords[column]))}</a></th>`;
        };
        // The flags' column between the dates and the names has nothing over
        // it, as it has on the lists of tournaments. A competition's table
        // has the tournament it is in after its name, which is not sorted by.
        const headings = [
          headed("date"),
          `                <td class="search-flag"></td>`,
          headed("name"),
          ...(kind === "competition"
            ? [
                `                <th scope="col">${escape(say("websitePlayer.tournament"))}</th>`,
              ]
            : []),
        ].join("\n");
        // Rows of one tournament share its days, so those alike in the date
        // are put in order of their names first, which the stable sort keeps,
        // rather than left in the order the search chose them in. The address
        // settles two of one name, which would otherwise keep that order.
        const lines = sorted(
          [...rows].sort(
            (one, other) =>
              byName.compare(one.name, other.name) ||
              (one.address < other.address
                ? -1
                : one.address > other.address
                  ? 1
                  : 0),
          ),
          sorting,
          speaking,
          (row) => ({
            starts: row.tournament.starts,
            name: row.name,
          }),
        )
          .map(
            (row) => `                <tr class="search-${kind}">
                  <td class="tournament-dates">${escape(datedWithYear(row.tournament.starts, row.tournament.finishes, speaking.language.tag))}</td>
                  <td class="tournament-flag search-flag">${flagOf(row.tournament)}</td>
                  <td><a class="tournament-name search-name" href="/${escape(row.address)}">${escape(row.name)}</a></td>${
                    row.of === undefined
                      ? ""
                      : `
                  <td><a class="search-of" href="/${escape(row.of.address)}">${escape(row.of.name)}</a></td>`
                  }
                </tr>`,
          )
          .join("\n");
        return `          <section class="search-list tournament-list" data-list="${name}" aria-labelledby="${name}-heading">
            <h2 id="${name}-heading">${escape(heading)}</h2>
            <table>
              <thead>
                <tr>
${headings}
                </tr>
              </thead>
              <tbody>
${lines}
              </tbody>
            </table>${more(rows.length, cut)}
          </section>
`;
      };

      // The hundred are chosen with the names that begin with what was typed
      // first, but are listed in alphabetical order as the other lists were,
      // so that a reader looks down one order.
      const players =
        found.players.length === 0
          ? ""
          : `          <section class="search-list">
            <h2>${escape(say("tournament.players"))}</h2>
            <ul>
${[...found.players]
  .sort((one, other) => byName.compare(one.name, other.name))
  .map(
    (each) =>
      `              <li class="search-player"><a class="search-name" href="/${escape(each.address)}">${escape(each.name)}</a></li>`,
  )
  .join("\n")}
            </ul>${more(found.players.length, found.more.players)}
          </section>
`;

      const results = !searched
        ? ""
        : nothing
          ? `          <p class="search-none">${escape(say("search.nothingFound"))}</p>`
          : [
              table(
                "tournaments",
                say("search.tournaments"),
                "tournament",
                found.tournaments.map((each) => ({
                  name: each.name,
                  address: each.address,
                  tournament: each,
                })),
                found.more.tournaments,
              ),
              table(
                "competitions",
                say("search.competitions"),
                "competition",
                found.competitions.map((each) => ({
                  name: each.name,
                  address: each.address,
                  tournament: each.tournament,
                  of: each.tournament,
                })),
                found.more.competitions,
              ),
              players,
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
