// The home page: the recent results and the upcoming tournaments, each a table
// that can be sorted by any of its columns, both narrowed together by a
// country, a region of it and a sport, and the years there are tournaments in
// as the secondary navigation. How each list is drawn, narrowed and sorted is
// shared with a year's page (tournamentLists.ts).
import type { FastifyInstance } from "fastify";

import { RecentResults } from "../../application/operations/tournaments/RecentResults.js";
import type { TournamentOfWebsite } from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { UpcomingTournaments } from "../../application/operations/tournaments/UpcomingTournaments.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import type { HelpLibrary } from "../common/helpLibrary.js";
import { releaseOf, whatsNewAlert } from "../common/whatsNew.js";
import {
  askedOf,
  filter,
  keepingFilter,
  refusedWith,
  sendPage,
  sendRefused,
  settledWhenPressed,
  table,
  yearsOf,
} from "./tournamentLists.js";

export const homePath = "/";

const tables = ["recent", "upcoming"];

export const registerHomePage = (
  server: FastifyInstance,
  assets: Assets,
  help: HelpLibrary,
): void => {
  server.get(homePath, async (request, reply) => {
    const pressed = settledWhenPressed(request, reply, "home", tables);
    if (pressed !== undefined) return pressed;
    const website = websiteOf(request);
    const speaking = speakingOf(request);
    const { say } = speaking;
    const asked = askedOf(request, homePath, "home", tables);
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
      return sendRefused(reply, request, assets, shell, code);
    }
    const years = await mediator.query(new TournamentYears(website.host));
    // This year by the server's clock, in UTC, as the year of a tournament's
    // address is.
    const thisYear = String(request.requestedAt.toDate().getUTCFullYear());

    // No year is marked, since the home page is not a year.
    return sendPage(
      reply,
      request,
      render(assets, {
        ...shell,
        ...yearsOf(years, speaking, undefined, (year) =>
          keepingFilter(asked.chose, `/${String(year)}`),
        ),
        body: `${whatsNewAlert(
          request,
          speaking,
          "public",
          await releaseOf(help, server.languages[0]?.tag, "public"),
          request.url,
        )}
${filter(request, asked, speaking, recent.length + upcoming.length)}
          <div class="home-lists">
${table(
  {
    table: "recent",
    heading: say("home.recentResults"),
    none: say("home.recentResults.none"),
    listed: recent,
    // In the order they were played, which no column shows.
    sortedAtFirst: undefined,
  },
  asked,
  speaking,
  assets,
)}
${table(
  {
    table: "upcoming",
    heading: say("home.upcomingTournaments"),
    none: say("home.upcomingTournaments.none"),
    listed: upcoming,
    sortedAtFirst: { column: "date", order: "up" },
    // The way to every tournament this year, for a reader after one further
    // off or long finished.
    after: `
            <p class="home-every"><a href="${escape(keepingFilter(asked.chose, `/${thisYear}`))}">${escape(say("home.allTournaments", { year: thisYear }))}</a></p>`,
  },
  asked,
  speaking,
  assets,
)}
          </div>`,
      }),
    );
  });
};
