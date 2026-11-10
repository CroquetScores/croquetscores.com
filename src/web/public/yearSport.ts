// A sport's page in a year: the twelve months of the year, each closed, and
// the way to load one month's tournaments of the sport alone when it is
// pressed (yearMonths.ts), with the filter that narrows them to a country and
// a region of it, and the years there are tournaments of the sport in as the
// secondary navigation and this one marked among them. How a month's
// tournaments are drawn, narrowed and sorted is shared with the home page and
// a year's (tournamentLists.ts).
//
// The sport is the page's, named by its address, so the filter offers none to
// choose, and every year leads to the sport's page in that year. An address
// whose sport is no sport, or one the website does not offer, is not found: no
// tournament of the website could be at it.
import type { FastifyInstance } from "fastify";

import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import { sportsOffered } from "../../domain/aggregates/tournaments/value-objects/sports.js";
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
import {
  latestFirst,
  monthPath,
  monthsOf,
  sendMonth,
  yearInPath,
} from "./yearMonths.js";

// Exactly as a sport's code is written, as it is in a tournament's address,
// and one the website offers.
const sportOf = (website: ReturnType<typeof websiteOf>, code: string) => {
  const sport = Sport.all.find((known) => known.code === code);
  return sport !== undefined &&
    sportsOffered[website.site].some((offered) => offered.equals(sport))
    ? sport
    : undefined;
};

export const registerYearSportPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string } }>(
    `/${yearInPath}/:sport`,
    async (request, reply) => {
      const website = websiteOf(request);
      const sport = sportOf(website, request.params.sport);
      if (sport === undefined) return reply.callNotFound();
      const toDays = sendToDaysChosen(request, reply, sport.code);
      if (toDays !== undefined) return toDays;
      // Only the filter: the months' tables are the ones sorted. The sport is the
      // page's own, so what was remembered of it is left as it was.
      const pressed = settledWhenPressed(request, reply, "sport", [], {
        offersSport: false,
      });
      if (pressed !== undefined) return pressed;
      const year = Number(request.params.year);
      const path = `/${request.params.year}/${sport.code}`;
      const speaking = speakingOf(request);
      const { say } = speaking;
      const asked = askedOf(request, path, "sport", [], {
        offersSport: false,
      });
      const { mediator } = request.server;
      const named = {
        sport: say(`sport.${sport.code}`),
        year: request.params.year,
      };
      const heading = say("yearSport.heading", named);

      const shell = {
        title: `${named.sport} ${named.year}`,
        description: heading,
        theme: themeOf(request),
        signedIn: signedIn(request),
        hasPassword: hasPassword(request),
        speaking,
        siteName: siteNameOf(request),
        tryWebsite: website.isTry,
        path: request.url,
      };

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
              { ...asked.inAddress, sport: undefined },
              `/${String(each)}/${sport.code}`,
            ),
          ),
          // Nothing is listed to be few, and the note on why there are few
          // would only mislead, so the filter is told there are enough.
          body: `${filter(request, asked, speaking, Number.POSITIVE_INFINITY)}
          <h1>${escape(heading)}</h1>
${monthsOf(speaking, year, path, latestFirst(request, asked))}`,
        }),
      );
    },
  );

  server.get<{ Params: { year: string; sport: string; month: string } }>(
    monthPath(`/${yearInPath}/:sport`),
    (request, reply) => {
      const sport = sportOf(websiteOf(request), request.params.sport);
      if (sport === undefined) return reply.callNotFound();
      const speaking = speakingOf(request);
      return sendMonth(request, reply, assets, speaking, {
        path: `/${request.params.year}/${sport.code}`,
        sport: { code: sport.code, name: speaking.say(`sport.${sport.code}`) },
      });
    },
  );
};
