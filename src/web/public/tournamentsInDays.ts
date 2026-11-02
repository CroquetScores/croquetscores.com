// The page of the tournaments starting from one day to another, which the
// From and To of the filter on the home page, a year's and a sport's open. It
// is a table as a year's is, filtered by the country, region and sport the
// reader chose, a hundred to a page, with the years there are tournaments in as
// the secondary navigation and none marked, since a range is not a year.
//
// Paging is by links, as sorting is, so it needs no scripting and the page a
// reader is on is in the address. The sorting is of the whole range, which
// the application answers a page of at a time, so a page is sorted within
// itself; the soonest are on the first page, and what the reader sorts by
// orders the page they are looking at.
import type { FastifyInstance } from "fastify";

import {
  TournamentsInDays,
  type TournamentsPage,
} from "../../application/operations/tournaments/TournamentsInDays.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import type { Assets } from "../common/assets.js";
import { dayWritten } from "../common/dates.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  askedOf,
  daysPath,
  filter,
  refusedWith,
  sendPage,
  sendRefused,
  settledWhenPressed,
  table,
  yearsOf,
} from "./tournamentLists.js";

const tables = ["tournaments"];

// The page is a number written as the address gives it. Anything that is not a
// whole number is let through as it is, for the application to refuse, rather
// than turned into the first page, which would hide the reader's mistake.
const pageOf = (query: unknown): number => {
  const given = (query as Record<string, unknown> | undefined)?.page;
  const first = Array.isArray(given) ? (given[0] as unknown) : given;
  return typeof first === "string" && first !== "" ? Number(first) : 1;
};

// The address of this page, as asked, at page `page`. The days and the filter
// are written first, in the order every address on the public pages writes
// them, and the page last; the first page is the address without one.
const addressAt = (request: { url: string }, page: number): string => {
  const [path = daysPath, query = ""] = request.url.split("?", 2);
  const said = new URLSearchParams(query);
  said.delete("page");
  if (page > 1) said.set("page", String(page));
  const written = said.toString();
  return written === "" ? path : `${path}?${written}`;
};

export const registerTournamentsInDaysPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(daysPath, async (request, reply) => {
    const pressed = settledWhenPressed(request, reply, "tournaments", tables);
    if (pressed !== undefined) return pressed;
    const website = websiteOf(request);
    const speaking = speakingOf(request);
    const { say } = speaking;
    const asked = askedOf(request, daysPath, "tournaments", tables, {
      carries: ["from", "to"],
    });
    const { mediator } = request.server;
    const language = speaking.language.tag;
    const { from, to } = asked.carried;
    const heading =
      from !== undefined && to !== undefined
        ? say("tournamentsInDays.heading", {
            from: `${dayWritten(from, language)} ${from.slice(0, 4)}`,
            to: `${dayWritten(to, language)} ${to.slice(0, 4)}`,
          })
        : say("tournamentsInDays.headingAll");

    const shell = {
      title: heading,
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: website.isTry,
      path: request.url,
    };

    const page = pageOf(request.query);
    let answered: TournamentsPage;
    try {
      answered = await mediator.query(
        new TournamentsInDays(website.host, from, to, page, asked.chose),
      );
    } catch (failure) {
      const code = refusedWith(failure);
      if (code === undefined) throw failure;
      return sendRefused(reply, request, assets, shell, code);
    }
    // A reader whose list shrank under a link they kept is sent to where the
    // list now ends, not shown a page with nothing on it.
    if (page > answered.lastPage) {
      return reply.redirect(addressAt(request, answered.lastPage), 303);
    }
    const years = await mediator.query(new TournamentYears(website.host));

    const link = (words: string, at: number, rel: string): string =>
      `<a rel="${rel}" href="${escape(addressAt(request, at))}">${escape(words)}</a>`;
    const turning =
      answered.lastPage === 1
        ? ""
        : `
          <p class="tournament-pages">${[
            page > 1
              ? link(say("tournamentsInDays.previous"), page - 1, "prev")
              : "",
            `<span class="tournament-page">${escape(say("tournamentsInDays.page", { page: String(page), last: String(answered.lastPage) }))}</span>`,
            page < answered.lastPage
              ? link(say("tournamentsInDays.next"), page + 1, "next")
              : "",
          ]
            .filter((each) => each !== "")
            .join(" ")}</p>`;

    return sendPage(
      reply,
      request,
      render(assets, {
        ...shell,
        ...yearsOf(years, speaking),
        body: `${filter(request, asked, speaking, answered.total)}
${table(
  {
    table: "tournaments",
    heading,
    none: say("tournamentsInDays.none"),
    listed: answered.tournaments,
    sortedAtFirst: { column: "date", order: "up" },
    withYear: true,
    after: turning,
  },
  asked,
  speaking,
  assets,
)}`,
      }),
    );
  });
};
