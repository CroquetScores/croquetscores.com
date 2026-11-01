// What the pages that list a website's tournaments share: the home page's two
// lists (home.ts) and a year's (year.ts). Each list is a table of the
// tournaments' dates, flags and names that can be sorted by its dates or its
// names; every list on a page is narrowed together by a country, a region of
// it and a sport, which a tournament's flag narrows to its own country; and
// the years there are tournaments in are the secondary navigation.
//
// None of it needs scripting. A column is sorted by a link and the lists
// narrowed by a form sent with GET, so that everything the reader chose is in
// the page's address: it can be linked to, it is there when the page is opened
// again, and going back undoes it.
import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type {
  FilterChosen,
  TournamentOfWebsite,
} from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../../domain/aggregates/tournaments/value-objects/Country.js";
import { sportsOffered } from "../../domain/aggregates/tournaments/value-objects/sports.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";
import type { Assets } from "../common/assets.js";
import { inCountryGroups } from "../common/countryOrder.js";
import { dated } from "../common/dates.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { render, type Shell } from "../common/layout.js";
import {
  forget,
  keep,
  rememberedOf,
  settleWhatWasPressed,
  type Sortable,
} from "../common/rememberedSorting.js";
import { siteNameOf, websiteOf } from "../common/site.js";

// Sorting ------------------------------------------------------------------------

// The flags' column is not among them: a flag says what it is, so its column
// has no heading to press.
export type Column = "date" | "name";
export type Order = "up" | "down";

export interface Sorting {
  readonly column: Column;
  readonly order: Order;
}

const columns: readonly Column[] = ["date", "name"];

export const columnWords: Readonly<Record<Column, string>> = {
  date: "tournamentList.column.date",
  name: "tournamentList.column.name",
};

// Written into the address as the column and which way, as "name-up".
export const sortingWritten = ({ column, order }: Sorting): string =>
  `${column}-${order}`;

// Anything that is not a sorting this page would write is taken as no sorting
// at all rather than refused: sorting is a convenience, and an address that
// says something odd about it still says what the reader came for.
export const sortingRead = (
  written: string | undefined,
): Sorting | undefined => {
  const [column, order] = (written ?? "").split("-");
  return columns.includes(column as Column) &&
    (order === "up" || order === "down")
    ? { column: column as Column, order }
    : undefined;
};

// Pressing the column sorted by turns it round, and any other sorts by it from
// the smallest up.
export const pressed = (column: Column, now: Sorting | undefined): Sorting =>
  now?.column === column
    ? { column, order: now.order === "up" ? "down" : "up" }
    : { column, order: "up" };

// The rows of `listed` sorted by `sorting`, rows alike in it keeping the order
// they were listed in, which a stable sort leaves them in. What a row is
// sorted by is read through `keys`, so that the lists of competitions, which
// are sorted by their tournament's days, are sorted as these are.
export const sorted = <T>(
  listed: readonly T[],
  sorting: Sorting | undefined,
  speaking: Speaking,
  keys: (row: T) => { readonly starts: string; readonly name: string },
): readonly T[] => {
  if (sorting === undefined) return listed;
  const byName = new Intl.Collator(speaking.language.tag);
  const compare: Readonly<Record<Column, (one: T, other: T) => number>> = {
    // A day is written as the year, the month and the day, so its writing
    // sorts as the day does.
    date: (one, other) => {
      const [first, second] = [keys(one).starts, keys(other).starts];
      return first < second ? -1 : first > second ? 1 : 0;
    },
    name: (one, other) => byName.compare(keys(one).name, keys(other).name),
  };
  const by = compare[sorting.column];
  return [...listed].sort((one, other) =>
    sorting.order === "up" ? by(one, other) : by(other, one),
  );
};

// What the reader asked for -----------------------------------------------------

/**
 * What the reader asked of a page: what they narrowed its lists by, and how
 * each of its lists is sorted, by the name the list's sorting is kept under in
 * the page's address.
 */
export interface Asked {
  readonly path: string;
  /**
   * Whether the reader chooses the sport, or the page has one of its own, as
   * a sport's page in a year has, and offers none to choose.
   */
  readonly offersSport: boolean;
  readonly chose: FilterChosen;
  readonly sorting: Readonly<Record<string, string | undefined>>;
  /**
   * How each list was last sorted on the reader's device, which sorts it where
   * the address says nothing it can use.
   */
  readonly remembered: Readonly<Record<string, string | undefined>>;
}

// Each as the address gives it: an empty one is a choice left at "any", which
// is how the form sends it, and one given twice is taken as it was first given.
const oneOf = (query: unknown, name: string): string | undefined => {
  const given = (query as Record<string, unknown> | undefined)?.[name];
  const first = Array.isArray(given) ? (given[0] as unknown) : given;
  return typeof first === "string" && first !== "" ? first : undefined;
};

/**
 * What `request` asked of the page at `path`, whose lists keep their sorting
 * under `tables`. A region is kept only where it is one of the country chosen.
 * One left chosen when another country was chosen is still the old country's,
 * since the form offered the old country's regions until it was sent, so it is
 * dropped rather than refused.
 */
export const askedOf = (
  request: FastifyRequest,
  path: string,
  page: string,
  tables: readonly string[],
  { offersSport = true }: { readonly offersSport?: boolean } = {},
): Asked => {
  const country = oneOf(request.query, "country");
  const region = oneOf(request.query, "region");
  const kept =
    region !== undefined &&
    country !== undefined &&
    Countries.thereAre.find(country)?.findRegion(region) !== undefined;
  return {
    path,
    offersSport,
    chose: {
      country,
      region: kept ? region : undefined,
      sport: offersSport ? oneOf(request.query, "sport") : undefined,
    },
    sorting: Object.fromEntries(
      tables.map((table) => [table, oneOf(request.query, table)]),
    ),
    remembered: rememberedOf(request, page),
  };
};

/**
 * Remembers a sorting the reader pressed, or forgets one they put back, and
 * sends them on to the page without it. Nothing is sent where they did
 * neither, and the page goes on to be drawn. See rememberedSorting.ts.
 */
export const settledWhenPressed = (
  request: FastifyRequest,
  reply: FastifyReply,
  page: string,
  tables: readonly string[],
): FastifyReply | undefined =>
  settleWhatWasPressed(
    request,
    reply,
    page,
    tables.map((table): Sortable => ({
      name: table,
      parameters: [table],
      writtenIn: (query) => {
        const written = oneOf(query, table);
        const sorting = sortingRead(written);
        return sorting === undefined ? undefined : sortingWritten(sorting);
      },
    })),
  );

// The address of the page at `path` with `chose` and `sorting` said of it.
const addressOf = (
  path: string,
  chose: FilterChosen,
  sorting: Readonly<Record<string, string | undefined>>,
): string => {
  const said = new URLSearchParams();
  const each: [string, string | undefined][] = [
    ["country", chose.country],
    ["region", chose.region],
    ["sport", chose.sport],
    ...Object.entries(sorting),
  ];
  for (const [name, value] of each) {
    if (value !== undefined) said.set(name, value);
  }
  const query = said.toString();
  return query === "" ? path : `${path}?${query}`;
};

// The page's address with the sorting `changed` and the filter `chose` said
// of it, and everything else as asked.
const addressWith = (
  asked: Asked,
  changed: Readonly<Record<string, string>>,
  chose: FilterChosen = asked.chose,
): string => addressOf(asked.path, chose, { ...asked.sorting, ...changed });

/**
 * `path` with what the reader narrowed by, for a link that moves to another
 * page of the same lists: a year's tournaments, say, from the home page, or
 * another year's from this one. The filter is what the reader is looking at, so
 * it goes with them. The sorting does not, since the lists of one page are not
 * the lists of another and a name kept for one means nothing to the next. It is
 * given the filter and not what else a page asked, so that something a page
 * comes to carry is not taken to another by accident.
 */
export const keepingFilter = (chose: FilterChosen, path: string): string =>
  addressOf(path, chose, {});

// A table ---------------------------------------------------------------------------

export const ariaSort: Readonly<Record<Order, string>> = {
  up: "ascending",
  down: "descending",
};

// Drawn as words would be, rather than as a picture, so that it takes the
// colour of the heading it is in. Hidden from a screen reader, which is told
// by aria-sort instead.
export const arrows: Readonly<Record<Order, string>> = { up: "↑", down: "↓" };

/** One of a page's lists, and what it is headed and says. */
export interface Listing {
  /** The name its sorting is kept under in the page's address. */
  readonly table: string;
  /** Its heading, already in the reader's language. */
  readonly heading: string;
  /** What it says when there is nothing in it, already in the reader's language. */
  readonly none: string;
  readonly listed: readonly TournamentOfWebsite[];
  /**
   * What it is sorted by when the reader has said nothing, or nothing where it
   * is in an order no column shows.
   */
  readonly sortedAtFirst: Sorting | undefined;
  /** Anything said beneath the table, already escaped. */
  readonly after?: string;
}

/** `listing`, as a table of its tournaments under its heading. */
export const table = (
  listing: Listing,
  asked: Asked,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  // What the address says, then what the device remembers, then the order the
  // list begins in.
  const remembered = sortingRead(asked.remembered[listing.table]);
  const sorting =
    sortingRead(asked.sorting[listing.table]) ??
    remembered ??
    listing.sortedAtFirst;
  const heading = (column: Column): string => {
    const marked = sorting?.column === column ? sorting.order : undefined;
    // "keep" is what tells the server the reader pressed it, and not that a
    // link to the page was followed (rememberedSorting.ts).
    const href = addressWith(asked, {
      [listing.table]: sortingWritten(pressed(column, sorting)),
      [keep]: listing.table,
    });
    return `                <th scope="col"${marked === undefined ? "" : ` aria-sort="${ariaSort[marked]}"`}><a href="${escape(href)}">${
      marked === undefined
        ? ""
        : `<span class="sort-arrow" aria-hidden="true">${arrows[marked]}</span>`
    }${escape(say(columnWords[column]))}</a></th>`;
  };
  // The sports' column after the dates and the flags' after that, with nothing
  // over either, and then the names.
  const headings = [
    heading("date"),
    `                <td class="tournament-sport"></td>`,
    `                <td class="tournament-flag"></td>`,
    heading("name"),
  ].join("\n");
  // A flag leads to the page narrowed to its country, keeping how each list is
  // sorted and the sport chosen. A region chosen is dropped, since the flag is
  // the whole country's. It is named by what pressing it does, and the
  // picture in it by nothing, so that a screen reader says it once.
  const flagOf = (tournament: TournamentOfWebsite): string => {
    const flag = Countries.thereAre.find(tournament.country)?.flag;
    if (flag === undefined) return "";
    const narrowed = addressWith(
      asked,
      {},
      { ...asked.chose, country: tournament.country, region: undefined },
    );
    const only = say("tournamentList.onlyIn", {
      country: say(`country.${tournament.country}`),
    });
    return `<a href="${escape(narrowed)}" aria-label="${escape(only)}"><img src="${escape(assets.url(`images/${flag.relativePath}`))}" alt="" /></a>`;
  };
  const rows = sorted(listing.listed, sorting, speaking, (row) => row)
    .map(
      (
        tournament,
      ) => `                <tr${tournament.national || tournament.international ? " data-bold" : ""}>
                  <td class="tournament-dates">${escape(dated(tournament.starts, tournament.finishes, speaking.language.tag))}</td>
                  <td class="tournament-sport"><span class="sport-code sport-${escape(tournament.sport)}">${escape(tournament.sport.toUpperCase())}</span></td>
                  <td class="tournament-flag">${flagOf(tournament)}</td>
                  <td><a class="tournament-name" href="/${escape(tournament.address)}">${escape(tournament.name)}</a></td>
                </tr>`,
    )
    .join("\n");
  const id = `${listing.table}-heading`;
  return `          <section class="tournament-list" data-list="${escape(listing.table)}" aria-labelledby="${id}">
            <h2 id="${id}">${escape(listing.heading)}</h2>
            <table>
              <thead>
                <tr>
${headings}
                </tr>
              </thead>${
                rows === ""
                  ? ""
                  : `
              <tbody>
${rows}
              </tbody>`
              }
            </table>${rowsScript}${
              remembered === undefined
                ? ""
                : `
            <p class="tournament-list-usual"><a href="${escape(addressWith(asked, { [forget]: listing.table }))}">${escape(say("tournamentList.usualOrder"))}</a></p>`
            }${
              listing.listed.length === 0
                ? `
            <p class="tournament-list-none">${escape(listing.none)}</p>`
                : ""
            }${listing.after ?? ""}
          </section>`;
};

// A press on a row beyond its link follows the name's link, in every browser.
// The name's link reaching over the whole row did that without scripting, but
// Safari does not make a row the box a link reaches over, and the link reached
// over the page: header and all (home.feature). So the link reaches over its own
// cell, and this does the rest. A press on a link is left to the link, and so
// is one that ends a selection of words, which is not a press to go anywhere.
const rowsScript = `
            <script>
              (function () {
                var list = document.currentScript.parentElement;
                list.classList.add("tournament-list-pressable");
                list.addEventListener("click", function (event) {
                  var row = event.target.closest("tbody tr");
                  if (row === null || event.target.closest("a") !== null) return;
                  if (String(window.getSelection()) !== "") return;
                  var link = row.querySelector(".tournament-name");
                  if (link !== null) link.click();
                });
              })();
            </script>`;

// The filter --------------------------------------------------------------------------

// Groups are told apart by a line, which a browser draws in its list.
const options = (
  groups: readonly (readonly {
    readonly value: string;
    readonly words: string;
  }[])[],
  any: string,
  chosen: string | undefined,
): string =>
  [
    `                <option value="">${escape(any)}</option>`,
    ...groups.flatMap((choices, at) => [
      ...(at === 0 ? [] : ["                <hr>"]),
      ...choices.map(
        ({ value, words }) =>
          `                <option value="${escape(value)}"${value === chosen ? " selected" : ""}>${escape(words)}</option>`,
      ),
    ]),
  ].join("\n");

// A country that is not divided into regions is its own one region, coded as
// the country is, and offers nothing to narrow it further by.
const isDivided = (country: Country): boolean =>
  country.regions.length > 1 || country.regions[0]?.code !== country.code;

// Labelled by a label of its own rather than one wrapped round it, which would
// name the list by what it has chosen as well as by what it is.
const field = (
  name: string,
  label: string,
  choices: string,
): string => `            <span class="tournament-filter-field">
              <label for="filter-${name}">${escape(label)}</label>
              <select id="filter-${name}" name="${name}">
${choices}
              </select>
            </span>`;

// Tournaments were given regions from November 2026, so a region chosen
// leaves out every earlier one. Below this many shown, the reader is more
// likely to be missing tournaments than to have found the few there are.
const FEW_TO_SHOW = 20;

/**
 * The form that narrows every list on the page, sent back to the page. With
 * a region chosen and fewer than twenty tournaments shown across the page's
 * lists, it is followed by a note on why there are so few.
 */
export const filter = (
  request: FastifyRequest,
  asked: Asked,
  speaking: Speaking,
  shown: number,
): string => {
  const { say } = speaking;
  const countries = inCountryGroups(
    Countries.thereAre.all.map((country) => ({
      code: country.code,
      name: say(`country.${country.code}`),
    })),
    speaking.language.tag,
  ).map((group) =>
    group.map(({ code, name }) => ({ value: code, words: name })),
  );
  const country =
    asked.chose.country === undefined
      ? undefined
      : Countries.thereAre.find(asked.chose.country);
  const sports = sportsOffered[websiteOf(request).site].map((sport) => ({
    value: sport.code,
    words: say(`sport.${sport.code}`),
  }));
  // Kept as the reader left them, since what sorts a table is not what the form
  // is about.
  const sortings = Object.entries(asked.sorting)
    .filter(([, written]) => written !== undefined)
    .map(
      ([table, written]) =>
        `            <input type="hidden" name="${escape(table)}" value="${escape(written ?? "")}" />`,
    );
  return `          <form class="tournament-filter" method="get" action="${escape(asked.path)}">
${[
  ...sortings,
  field(
    "country",
    say("tournamentList.filter.country"),
    options(
      countries,
      say("tournamentList.filter.anyCountry"),
      asked.chose.country,
    ),
  ),
  ...(country === undefined || !isDivided(country)
    ? []
    : [
        field(
          "region",
          say("tournamentList.filter.region"),
          options(
            [
              country.regions.map((region) => ({
                value: region.code,
                words: region.name,
              })),
            ],
            say("tournamentList.filter.anyRegion"),
            asked.chose.region,
          ),
        ),
      ]),
  ...(asked.offersSport
    ? [
        field(
          "sport",
          say("tournamentList.filter.sport"),
          options(
            [sports],
            say("tournamentList.filter.anySport"),
            asked.chose.sport,
          ),
        ),
      ]
    : []),
].join("\n")}
            <button type="submit">${escape(say("tournamentList.filter.submit"))}</button>
          </form>${
            asked.chose.region !== undefined && shown < FEW_TO_SHOW
              ? `
          <p class="notice tournament-filter-notice">${escape(say("tournamentList.filter.noRegionsBefore"))}</p>`
              : ""
          }`;
};

// The years ----------------------------------------------------------------------------

// What the years are fitted to the window by, with no scripting to measure
// anything: every tab is as wide as every other, since every year is four
// digits, and so is the drop-down list, so how many fit beside it is known
// from the width of the bar alone. The site's stylesheet shows the newest
// alone, and these rules show each further one once the bar is wide enough
// for it and the drop-down list, and all of them once it is wide enough for
// them without. Written here rather than in the stylesheet because the last
// rule depends on how many years there are. In rem, as the stylesheet sizes
// each tab, and with a tenth of one spare, since the bar's own inset is a
// pixel more than a whole number of them.
const TAB = 4.75;
const GAP = 0.5;
const EARLIER = 12;
const INSETS = 2 * 1.5 + 0.1;

const rem = (count: number): string =>
  `${String(Math.round(count * 100) / 100)}rem`;

/** The rules that fit `count` years to the window, for the page's styles. */
export const yearsFitted = (count: number): string => {
  const rules: string[] = [];
  for (let at = 2; at < count; at++) {
    rules.push(`      @container years (min-width: ${rem(at * (TAB + GAP) + EARLIER + INSETS)}) {
        .years-fitted .year-tab:nth-child(${String(at)}) { display: flex; }
        .years-fitted .years-earlier-list li:nth-child(${String(at)}) { display: none; }
      }`);
  }
  rules.push(`      @container years (min-width: ${rem(count * TAB + (count - 1) * GAP + INSETS)}) {
        .years-fitted .year-tab { display: flex; }
        .years-fitted .years-earlier { display: none; }
      }`);
  return rules.join("\n");
};

/**
 * The years as the secondary navigation, the newest first, with `chosen`
 * marked where it is among them. Every year is a tab, and in the drop-down
 * list as well, and the page's rules show each in one or the other, so the
 * year chosen is marked in both. With no scripting the drop-down list is a
 * disclosure of links rather than a list to choose from, which needs a script
 * to go anywhere. Each leads to the year's page, or to wherever `leadsTo`
 * says, as a sport's page leads to the sport's page in each year.
 */
export const yearsBar = (
  years: readonly number[],
  speaking: Speaking,
  chosen?: number,
  leadsTo: (year: number) => string = (year) => `/${String(year)}`,
): string => {
  const { say } = speaking;
  const links = years.map(
    (year) =>
      `<a href="${escape(leadsTo(year))}"${year === chosen ? ' aria-current="page"' : ""}>${String(year)}</a>`,
  );
  return `
    <nav class="site-sections years" aria-label="${escape(say("years.label"))}">
      <div class="page">
        <div class="years-row years-fitted">
          <ul>
${links.map((link) => `            <li class="year-tab">${link}</li>`).join("\n")}
            <li class="years-earlier">
              <details class="years-earlier-list">
                <summary>${escape(say("years.earlier"))}</summary>
                <ul>
${links.map((link) => `                  <li>${link}</li>`).join("\n")}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;
};

/** The years as the page's shell carries them, or nothing where there are none. */
export const yearsOf = (
  years: readonly number[],
  speaking: Speaking,
  chosen?: number,
  leadsTo?: (year: number) => string,
): Pick<Shell, "secondary" | "styles"> =>
  years.length === 0
    ? {}
    : {
        secondary: yearsBar(years, speaking, chosen, leadsTo),
        styles: yearsFitted(years.length),
      };

// Sending the page -------------------------------------------------------------------

/**
 * The code a filter that cannot be was refused with, or nothing where
 * `failure` is not that: a filter that cannot be is the reader's mistake, as a
 * request that breaks its rules is (errors.ts).
 */
export const refusedWith = (failure: unknown): string | undefined =>
  failure instanceof TournamentOperationRefused ||
  failure instanceof ValidationError
    ? (failure as { code: string }).code
    : undefined;

// A page is drawn from the reader's cookies and the languages their browser
// asks for, so it is sent with what every other page is sent with: a cache
// that kept one would hand the next reader a page saying they are somebody.
const asAPage = (reply: FastifyReply): FastifyReply =>
  reply
    .header("cache-control", "private, no-cache")
    .header("vary", "Cookie, Accept-Language");

/**
 * The page saying the reader's filter was refused with `code`, in the reader's
 * language, with the code for whatever reads the page rather than looks at it.
 */
export const sendRefused = (
  reply: FastifyReply,
  request: FastifyRequest,
  assets: Assets,
  shell: Omit<Shell, "body">,
  code: string,
): FastifyReply => {
  const { say } = shell.speaking;
  request.log.info({ code }, "Request refused");
  return asAPage(reply.code(422))
    .type("text/html; charset=utf-8")
    .send(
      render(assets, {
        ...shell,
        body: `          <h1>${escape(say("errors.refused"))}</h1>
          <p class="page-refused" data-refused="${escape(code)}">${escape(say("errors.refusedDetail"))}</p>
          <p><a href="/">${escape(say("errors.backHome", { siteName: siteNameOf(request) }))}</a></p>`,
      }),
    );
};

// An If-None-Match may carry several tags, and a weak validator's W/ prefix
// says only how the tag was derived, not which entity it names.
const matches = (header: string | undefined, etag: string): boolean =>
  header !== undefined &&
  header
    .split(",")
    .map((candidate) => candidate.trim().replace(/^W\//, ""))
    .some((candidate) => candidate === "*" || candidate === etag);

/** `html`, tagged by what it is so that a page unchanged is not sent again. */
export const sendPage = (
  reply: FastifyReply,
  request: FastifyRequest,
  html: string,
): FastifyReply => {
  const etag = `"${createHash("sha256").update(html).digest("base64url").slice(0, 27)}"`;
  asAPage(reply).header("etag", etag);
  // Without this the ETag costs a hash on every request and saves nothing:
  // Fastify does no conditional-request handling of its own.
  if (matches(request.headers["if-none-match"], etag)) {
    return reply.code(304).send();
  }
  return reply.type("text/html; charset=utf-8").send(html);
};
