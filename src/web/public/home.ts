// The home page: the recent results and the upcoming tournaments, each a table
// that can be sorted by any of its columns, both narrowed together by a
// country, a region of it and a sport, and the years there are tournaments in
// as the secondary navigation.
//
// It needs no scripting. A column is sorted by a link and the lists narrowed
// by a form sent with GET, so that everything the reader chose is in the
// page's address: it can be linked to, it is there when the page is opened
// again, and going back undoes it.
import { createHash } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { RecentResults } from "../../application/operations/tournaments/RecentResults.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type {
  FilterChosen,
  TournamentOfWebsite,
} from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { UpcomingTournaments } from "../../application/operations/tournaments/UpcomingTournaments.js";
import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../../domain/aggregates/tournaments/value-objects/Country.js";
import {
  croquetScoresSports,
  gateballScoresSports,
} from "../../domain/aggregates/tournaments/value-objects/sports.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";
import type { Assets } from "../common/assets.js";
import { dated } from "../common/dates.js";
import { escape } from "../common/escape.js";
import { type Speaking, speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";

export const homePath = "/";

const SPORTS_OFFERED = {
  croquetScores: croquetScoresSports,
  gateballScores: gateballScoresSports,
} as const;

// Sorting ------------------------------------------------------------------------

type Column = "date" | "name" | "country";
type Order = "up" | "down";

interface Sorting {
  readonly column: Column;
  readonly order: Order;
}

const columns: readonly Column[] = ["date", "name", "country"];

const columnWords: Readonly<Record<Column, string>> = {
  date: "home.column.date",
  name: "home.column.name",
  country: "home.column.country",
};

// Written into the address as the column and which way, as "name-up".
const sortingWritten = ({ column, order }: Sorting): string =>
  `${column}-${order}`;

// Anything that is not a sorting this page would write is taken as no sorting
// at all rather than refused: sorting is a convenience, and an address that
// says something odd about it still says what the reader came for.
const sortingRead = (written: string | undefined): Sorting | undefined => {
  const [column, order] = (written ?? "").split("-");
  return columns.includes(column as Column) &&
    (order === "up" || order === "down")
    ? { column: column as Column, order }
    : undefined;
};

// Pressing the column sorted by turns it round, and any other sorts by it from
// the smallest up.
const pressed = (column: Column, now: Sorting | undefined): Sorting =>
  now?.column === column
    ? { column, order: now.order === "up" ? "down" : "up" }
    : { column, order: "up" };

// The rows of `listed` sorted by `sorting`, rows alike in it keeping the order
// they were listed in, which a stable sort leaves them in.
const sorted = (
  listed: readonly TournamentOfWebsite[],
  sorting: Sorting | undefined,
  speaking: Speaking,
): readonly TournamentOfWebsite[] => {
  if (sorting === undefined) return listed;
  const byName = new Intl.Collator(speaking.language.tag);
  const compare: Readonly<
    Record<
      Column,
      (one: TournamentOfWebsite, other: TournamentOfWebsite) => number
    >
  > = {
    // A day is written as the year, the month and the day, so its writing
    // sorts as the day does.
    date: (one, other) =>
      one.starts < other.starts ? -1 : one.starts > other.starts ? 1 : 0,
    name: (one, other) => byName.compare(one.name, other.name),
    // By the country's name in the reader's language, which is how a reader
    // looks for one.
    country: (one, other) =>
      byName.compare(
        speaking.say(`country.${one.country}`),
        speaking.say(`country.${other.country}`),
      ),
  };
  const by = compare[sorting.column];
  return [...listed].sort((one, other) =>
    sorting.order === "up" ? by(one, other) : by(other, one),
  );
};

// What the reader asked for -----------------------------------------------------

type Table = "recent" | "upcoming";

interface Asked {
  readonly chose: FilterChosen;
  readonly sorting: Readonly<Record<Table, string | undefined>>;
}

// Each as the address gives it: an empty one is a choice left at "any", which
// is how the form sends it, and one given twice is taken as it was first given.
const oneOf = (query: unknown, name: string): string | undefined => {
  const given = (query as Record<string, unknown> | undefined)?.[name];
  const first = Array.isArray(given) ? (given[0] as unknown) : given;
  return typeof first === "string" && first !== "" ? first : undefined;
};

// A region is kept only where it is one of the country chosen. One left chosen
// when another country was chosen is still the old country's, since the form
// offered the old country's regions until it was sent, so it is dropped
// rather than refused.
const askedOf = (request: FastifyRequest): Asked => {
  const country = oneOf(request.query, "country");
  const region = oneOf(request.query, "region");
  const kept =
    region !== undefined &&
    country !== undefined &&
    Countries.thereAre.find(country)?.findRegion(region) !== undefined;
  return {
    chose: {
      country,
      region: kept ? region : undefined,
      sport: oneOf(request.query, "sport"),
    },
    sorting: {
      recent: oneOf(request.query, "recent"),
      upcoming: oneOf(request.query, "upcoming"),
    },
  };
};

// The page's address with `changed` said of it, and everything else as asked.
const addressWith = (
  asked: Asked,
  changed: Partial<Record<Table, string>>,
): string => {
  const said = new URLSearchParams();
  const each: [string, string | undefined][] = [
    ["country", asked.chose.country],
    ["region", asked.chose.region],
    ["sport", asked.chose.sport],
    ["recent", changed.recent ?? asked.sorting.recent],
    ["upcoming", changed.upcoming ?? asked.sorting.upcoming],
  ];
  for (const [name, value] of each) {
    if (value !== undefined) said.set(name, value);
  }
  const query = said.toString();
  return query === "" ? homePath : `${homePath}?${query}`;
};

// A table ---------------------------------------------------------------------------

const ariaSort: Readonly<Record<Order, string>> = {
  up: "ascending",
  down: "descending",
};

// Drawn as words would be, rather than as a picture, so that it takes the
// colour of the heading it is in. Hidden from a screen reader, which is told
// by aria-sort instead.
const arrows: Readonly<Record<Order, string>> = { up: "↑", down: "↓" };

interface Listing {
  readonly table: Table;
  readonly heading: string;
  readonly none: string;
  readonly listed: readonly TournamentOfWebsite[];
  // What the table is sorted by when the reader has said nothing, which no
  // column shows for the recent results: they are in the order they were
  // played.
  readonly sortedAtFirst: Sorting | undefined;
  // Anything said beneath the table, already escaped.
  readonly after?: string;
}

const table = (
  listing: Listing,
  asked: Asked,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const sorting =
    sortingRead(asked.sorting[listing.table]) ?? listing.sortedAtFirst;
  const headings = columns
    .map((column) => {
      const marked = sorting?.column === column ? sorting.order : undefined;
      const href = addressWith(asked, {
        [listing.table]: sortingWritten(pressed(column, sorting)),
      });
      return `                <th scope="col"${marked === undefined ? "" : ` aria-sort="${ariaSort[marked]}"`}><a href="${escape(href)}">${
        marked === undefined
          ? ""
          : `<span class="sort-arrow" aria-hidden="true">${arrows[marked]}</span>`
      }${escape(say(columnWords[column]))}</a></th>`;
    })
    .join("\n");
  const rows = sorted(listing.listed, sorting, speaking)
    .map((tournament) => {
      const flag = Countries.thereAre.find(tournament.country)?.flag;
      return `                <tr>
                  <td class="tournament-dates">${escape(dated(tournament.starts, tournament.finishes, speaking.language.tag))}</td>
                  <td><a class="tournament-name" href="/${escape(tournament.address)}">${escape(tournament.name)}</a></td>
                  <td class="tournament-flag">${
                    flag === undefined
                      ? ""
                      : `<img src="${escape(assets.url(`images/${flag.relativePath}`))}" alt="${escape(say(`country.${tournament.country}`))}" />`
                  }</td>
                </tr>`;
    })
    .join("\n");
  const id = `${listing.table}-heading`;
  return `          <section class="home-list home-${listing.table}" aria-labelledby="${id}">
            <h2 id="${id}">${escape(say(listing.heading))}</h2>
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
            </table>${
              listing.listed.length === 0
                ? `
            <p class="home-list-none">${escape(say(listing.none))}</p>`
                : ""
            }${listing.after ?? ""}
          </section>`;
};

// The filter --------------------------------------------------------------------------

const options = (
  choices: readonly { readonly value: string; readonly words: string }[],
  any: string,
  chosen: string | undefined,
): string =>
  [
    `                <option value="">${escape(any)}</option>`,
    ...choices.map(
      ({ value, words }) =>
        `                <option value="${escape(value)}"${value === chosen ? " selected" : ""}>${escape(words)}</option>`,
    ),
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
): string => `            <span class="home-filter-field">
              <label for="filter-${name}">${escape(label)}</label>
              <select id="filter-${name}" name="${name}">
${choices}
              </select>
            </span>`;

const filter = (
  request: FastifyRequest,
  asked: Asked,
  speaking: Speaking,
): string => {
  const { say } = speaking;
  const byName = new Intl.Collator(speaking.language.tag);
  const countries = Countries.thereAre.all
    .map((country) => ({
      value: country.code,
      words: say(`country.${country.code}`),
    }))
    .sort((one, other) => byName.compare(one.words, other.words));
  const country =
    asked.chose.country === undefined
      ? undefined
      : Countries.thereAre.find(asked.chose.country);
  const sports = SPORTS_OFFERED[websiteOf(request).site].map((sport) => ({
    value: sport.code,
    words: say(`sport.${sport.code}`),
  }));
  // Kept as the reader left them, since what sorts a table is not what the form
  // is about.
  const sortings = (["recent", "upcoming"] as const)
    .filter((each) => asked.sorting[each] !== undefined)
    .map(
      (each) =>
        `            <input type="hidden" name="${each}" value="${escape(asked.sorting[each] ?? "")}" />`,
    );
  return `          <form class="home-filter" method="get" action="${homePath}">
${[
  ...sortings,
  field(
    "country",
    say("home.filter.country"),
    options(countries, say("home.filter.anyCountry"), asked.chose.country),
  ),
  ...(country === undefined || !isDivided(country)
    ? []
    : [
        field(
          "region",
          say("home.filter.region"),
          options(
            country.regions.map((region) => ({
              value: region.code,
              words: region.name,
            })),
            say("home.filter.anyRegion"),
            asked.chose.region,
          ),
        ),
      ]),
  field(
    "sport",
    say("home.filter.sport"),
    options(sports, say("home.filter.anySport"), asked.chose.sport),
  ),
].join("\n")}
            <button type="submit">${escape(say("home.filter.submit"))}</button>
          </form>`;
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

const yearsFitted = (count: number): string => {
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

// Every year is a tab, and in the drop-down list as well, and the rules above
// show each in one or the other. With no scripting the drop-down list is a
// disclosure of links rather than a list to choose from, which needs a script
// to go anywhere. No year is marked, since the home page is not a year.
const yearsBar = (years: readonly number[], speaking: Speaking): string => {
  const { say } = speaking;
  const links = years.map(
    (year) => `<a href="/${String(year)}">${String(year)}</a>`,
  );
  return `
    <nav class="site-sections years" aria-label="${escape(say("home.years.label"))}">
      <div class="page">
        <div class="years-row years-fitted">
          <ul>
${links.map((link) => `            <li class="year-tab">${link}</li>`).join("\n")}
            <li class="years-earlier">
              <details class="years-earlier-list">
                <summary>${escape(say("home.years.earlier"))}</summary>
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

// The page ---------------------------------------------------------------------------

// A filter that cannot be is the reader's mistake, as a request that breaks
// its rules is (errors.ts): said on the page in the reader's language, with
// the code it was refused with for whatever reads the page rather than looks
// at it.
const refusedWith = (failure: unknown): string | undefined =>
  failure instanceof TournamentOperationRefused ||
  failure instanceof ValidationError
    ? (failure as { code: string }).code
    : undefined;

// An If-None-Match may carry several tags, and a weak validator's W/ prefix
// says only how the tag was derived, not which entity it names.
const matches = (header: string | undefined, etag: string): boolean =>
  header !== undefined &&
  header
    .split(",")
    .map((candidate) => candidate.trim().replace(/^W\//, ""))
    .some((candidate) => candidate === "*" || candidate === etag);

export const registerHomePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(homePath, async (request, reply) => {
    const website = websiteOf(request);
    const speaking = speakingOf(request);
    const { say } = speaking;
    const asked = askedOf(request);
    const { mediator } = request.server;

    const shell = {
      title: siteNameOf(request),
      currentPath: homePath,
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: website.isTry,
      path: request.url,
    };

    let recent: readonly TournamentOfWebsite[];
    let upcoming: readonly TournamentOfWebsite[];
    try {
      recent = await mediator.query(
        new RecentResults(website.host, request.requestedAt, asked.chose),
      );
      upcoming = await mediator.query(
        new UpcomingTournaments(website.host, request.requestedAt, asked.chose),
      );
    } catch (failure) {
      const code = refusedWith(failure);
      if (code === undefined) throw failure;
      request.log.info({ code }, "Request refused");
      return reply
        .code(422)
        .header("cache-control", "private, no-cache")
        .header("vary", "Cookie, Accept-Language")
        .type("text/html; charset=utf-8")
        .send(
          render(assets, {
            ...shell,
            body: `          <h1>${escape(say("errors.refused"))}</h1>
          <p class="page-refused" data-refused="${escape(code)}">${escape(say("errors.refusedDetail"))}</p>
          <p><a href="${homePath}">${escape(say("errors.backHome", { siteName: siteNameOf(request) }))}</a></p>`,
          }),
        );
    }
    const years = await mediator.query(new TournamentYears(website.host));
    // This year by the server's clock, in UTC, as the year of a tournament's
    // address is.
    const thisYear = String(request.requestedAt.toDate().getUTCFullYear());

    const html = render(assets, {
      ...shell,
      ...(years.length === 0
        ? {}
        : {
            secondary: yearsBar(years, speaking),
            styles: yearsFitted(years.length),
          }),
      body: `${filter(request, asked, speaking)}
          <div class="home-lists">
${table(
  {
    table: "recent",
    heading: "home.recentResults",
    none: "home.recentResults.none",
    listed: recent,
    sortedAtFirst: undefined,
  },
  asked,
  speaking,
  assets,
)}
${table(
  {
    table: "upcoming",
    heading: "home.upcomingTournaments",
    none: "home.upcomingTournaments.none",
    listed: upcoming,
    sortedAtFirst: { column: "date", order: "up" },
    // The way to every tournament this year, for a reader after one further
    // off or long finished.
    after: `
            <p class="home-every"><a href="/${thisYear}">${escape(say("home.allTournaments", { year: thisYear }))}</a></p>`,
  },
  asked,
  speaking,
  assets,
)}
          </div>`,
    });
    const etag = `"${createHash("sha256").update(html).digest("base64url").slice(0, 27)}"`;

    reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .header("etag", etag);

    // Without this the ETag costs a hash on every request and saves nothing:
    // Fastify does no conditional-request handling of its own.
    if (matches(request.headers["if-none-match"], etag)) {
      return reply.code(304).send();
    }

    return reply.type("text/html; charset=utf-8").send(html);
  });
};
