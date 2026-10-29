// A sport's page in a year: every tournament of the sport starting in the year,
// as a table that can be sorted by its dates or its names and narrowed by a
// country and a region of it, with the years there are tournaments of the
// sport in as the secondary navigation and this one marked among them. How
// the list is drawn, narrowed and sorted is shared with the home page and a
// year's (tournamentLists.ts).
//
// The sport is the page's, named by its address, so the filter offers none to
// choose, and every year leads to the sport's page in that year. It begins
// sorted by date, earliest first, as a year's page does. An address whose
// sport is no sport, or one the website does not offer, is not found: no
// tournament of the website could be at it.
import type { FastifyInstance } from "fastify";

import type { TournamentOfWebsite } from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { TournamentsInYear } from "../../application/operations/tournaments/TournamentsInYear.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import { sportsOffered } from "../../domain/aggregates/tournaments/value-objects/sports.js";
import type { Assets } from "../common/assets.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  askedOf,
  filter,
  keepingFilter,
  refusedWith,
  sendPage,
  sendRefused,
  table,
  yearsOf,
} from "./tournamentLists.js";
import { yearInPath } from "./year.js";

export const registerYearSportPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string } }>(
    `/${yearInPath}/:sport`,
    async (request, reply) => {
      const website = websiteOf(request);
      // Exactly as a sport's code is written, as it is in a tournament's
      // address, and one the website offers.
      const sport = Sport.all.find(
        (known) => known.code === request.params.sport,
      );
      if (
        sport === undefined ||
        !sportsOffered[website.site].some((offered) => offered.equals(sport))
      ) {
        return reply.callNotFound();
      }
      const year = Number(request.params.year);
      const path = `/${request.params.year}/${sport.code}`;
      const speaking = speakingOf(request);
      const { say } = speaking;
      const asked = askedOf(request, path, ["tournaments"], {
        offersSport: false,
      });
      const { mediator } = request.server;
      const named = {
        sport: say(`sport.${sport.code}`),
        year: request.params.year,
      };
      const heading = say("yearSport.heading", named);

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
          new TournamentsInYear(website.host, year, {
            ...asked.chose,
            sport: sport.code,
          }),
        );
      } catch (failure) {
        const code = refusedWith(failure);
        if (code === undefined) throw failure;
        return sendRefused(reply, request, assets, shell, code);
      }
      const years = await mediator.query(
        new TournamentYears(website.host, sport.code),
      );

      return sendPage(
        reply,
        request,
        render(assets, {
          ...shell,
          ...yearsOf(years, speaking, year, (each) =>
            // The sport is in the path, so it is left out of what is kept and
            // not said twice, where the two could disagree.
            keepingFilter(
              { ...asked.chose, sport: undefined },
              `/${String(each)}/${sport.code}`,
            ),
          ),
          body: `${filter(request, asked, speaking, listed.length)}
${table(
  {
    table: "tournaments",
    heading,
    none: say("yearSport.none", named),
    listed,
    sortedAtFirst: { column: "date", order: "up" },
  },
  asked,
  speaking,
  assets,
)}`,
        }),
      );
    },
  );
};
