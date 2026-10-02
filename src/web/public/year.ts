// A year's page: every tournament starting in the year, as a table that can be
// sorted by any of its columns and narrowed by a country, a region of it and a
// sport, with the years there are tournaments in as the secondary navigation
// and this one marked among them. How the list is drawn, narrowed and sorted is
// shared with the home page (tournamentLists.ts).
//
// It begins sorted by date, earliest first, as a calendar of the year is read.
// A year with no tournaments in it still has a page, saying so, since a link
// to it may have been kept from a year that had some; an address that is not a
// year is not this page.
import type { FastifyInstance } from "fastify";

import type { TournamentOfWebsite } from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { TournamentsInYear } from "../../application/operations/tournaments/TournamentsInYear.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import type { Assets } from "../common/assets.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  askedOf,
  filter,
  refusedWith,
  sendPage,
  sendRefused,
  table,
  yearsOf,
} from "./tournamentLists.js";

// A year is four digits, the first not a nought, as it is in a tournament's
// address (TournamentAddress.ts), since no tournament can start in any other.
// Anything else is left to whatever else the address could be, and is not
// found where it is nothing. "0000" in particular is no year Postgres has, and
// asking it for the days of one would fail rather than find none.
const yearPath = "/:year(^[1-9]\\d{3}$)";

export const registerYearPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string } }>(yearPath, async (request, reply) => {
    const year = Number(request.params.year);
    const path = `/${request.params.year}`;
    const website = websiteOf(request);
    const speaking = speakingOf(request);
    const { say } = speaking;
    const asked = askedOf(request, path, ["tournaments"]);
    const { mediator } = request.server;
    const heading = say("year.heading", { year: request.params.year });

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

    let listed: readonly TournamentOfWebsite[];
    try {
      listed = await mediator.query(
        new TournamentsInYear(website.host, year, asked.chose),
      );
    } catch (failure) {
      const code = refusedWith(failure);
      if (code === undefined) throw failure;
      return sendRefused(reply, request, assets, shell, code);
    }
    const years = await mediator.query(new TournamentYears(website.host));

    return sendPage(
      reply,
      request,
      render(assets, {
        ...shell,
        ...yearsOf(years, speaking, year),
        body: `${filter(request, asked, speaking)}
${table(
  {
    table: "tournaments",
    heading,
    none: say("year.none", { year: request.params.year }),
    listed,
    sortedAtFirst: { column: "date", order: "up" },
  },
  asked,
  speaking,
  assets,
)}`,
      }),
    );
  });
};
