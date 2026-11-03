// A year's page: the twelve months of the year, each closed, and the way to
// load one month's tournaments alone when it is pressed (yearMonths.ts), with
// the filter that narrows them to a country, a region of it and a sport, and
// the years there are tournaments in as the secondary navigation and this one
// marked among them. How a month's tournaments are drawn, narrowed and sorted
// is shared with the home page (tournamentLists.ts).
//
// A year with no tournaments in it still has a page, since a link to it may
// have been kept from a year that had some, and its months open on saying so;
// an address that is not a year is not this page.
import type { FastifyInstance } from "fastify";

import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  askedOf,
  filter,
  keepingFilter,
  settledWhenPressed,
  sendPage,
  sendToDaysChosen,
  yearsOf,
} from "./tournamentLists.js";
import { monthPath, monthsOf, sendMonth, yearInPath } from "./yearMonths.js";

export { yearInPath };
const yearPath = `/${yearInPath}`;

export const registerYearPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string } }>(yearPath, async (request, reply) => {
    const toDays = sendToDaysChosen(request, reply);
    if (toDays !== undefined) return toDays;
    // The page lists no table of its own to sort, but a filter pressed on it is
    // still remembered, as the months' tables are asked for under it.
    const pressed = settledWhenPressed(request, reply, "year", []);
    if (pressed !== undefined) return pressed;
    const year = Number(request.params.year);
    const path = `/${request.params.year}`;
    const website = websiteOf(request);
    const speaking = speakingOf(request);
    const { say } = speaking;
    const asked = askedOf(request, path, "year", []);
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

    const years = await mediator.query(new TournamentYears(website.host));

    return sendPage(
      reply,
      request,
      render(assets, {
        ...shell,
        ...yearsOf(years, speaking, year, (each) =>
          keepingFilter(asked.inAddress, `/${String(each)}`),
        ),
        // Nothing is listed to be few, and the note on why there are few would
        // only mislead, so the filter is told there are enough.
        body: `${filter(request, asked, speaking, Number.POSITIVE_INFINITY)}
          <h1>${escape(heading)}</h1>
${monthsOf(speaking, year, path)}`,
      }),
    );
  });

  server.get<{ Params: { year: string; month: string } }>(
    monthPath(`/${yearInPath}`),
    (request, reply) =>
      sendMonth(request, reply, assets, speakingOf(request), {
        path: `/${request.params.year}`,
      }),
  );
};
