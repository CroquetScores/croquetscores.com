// A group of a tournament's tests has a page of how its teams stand, at the
// tournament's address followed by "groups" and the group's slug, as the old
// site had a page for each of its groups: a table as the tournament's summary
// is (teamSummary.ts), of the group's teams and tests alone, headed by the
// group's name, and above it, in a row of their own, Summary and each of the
// group's tests. Its sections are the tournament's, with the group marked.
//
// A slug no group makes is not a page, nor is a group of a Standard
// tournament or of one a reader is not sent to. An address the tournament has
// moved on from leads to the group where it is now.
import type { FastifyInstance } from "fastify";

import { PublicGroupOfTournament } from "../../application/operations/tournaments/PublicGroupOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { readsOf } from "./read.js";
import { teamSummaryTable } from "./teamSummary.js";
import { sendPage } from "./tournamentLists.js";
import { groupAddress, groupLinks, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicGroupOfTournament.NoSuchTournament",
  "PublicGroupOfTournament.NotPlayedByTeams",
  "PublicGroupOfTournament.NoSuchGroup",
];

export const registerGroupPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{
    Params: { year: string; sport: string; slug: string; group: string };
  }>(`/${yearInPath}/:sport/:slug/groups/:group`, async (request, reply) => {
    const { year, sport, slug, group } = request.params;
    const address = `${year}/${sport}/${slug}`;
    const website = websiteOf(request);
    let asked;
    try {
      asked = await request.server.mediator.query(
        new PublicGroupOfTournament(website.host, address, group),
      );
    } catch (failure) {
      if (
        failure instanceof TournamentOperationRefused &&
        notThere.includes(failure.code)
      ) {
        return reply.callNotFound();
      }
      throw failure;
    }
    const here = groupAddress(asked.address, asked.group.slug);
    // An address the tournament has moved on from leads to the group where it
    // is now, for good, so that a link kept from before still works. Encoded,
    // since a slug keeps letters of any script, and a Location outside
    // Latin-1 is refused.
    if (asked.address !== address) {
      return reply.redirect(encodeURI(here), 301);
    }

    const speaking = speakingOf(request);
    return sendPage(
      reply,
      request,
      render(assets, {
        tournament: {
          name: asked.name,
          address: asked.address,
          subtitle: asked.subtitle,
        },
        title: `${asked.group.name} - ${asked.name}`,
        sections: sectionsOf(asked, speaking, readsOf(request)),
        currentSection: here,
        theme: themeOf(request),
        signedIn: signedIn(request),
        hasPassword: hasPassword(request),
        speaking,
        siteName: siteNameOf(request),
        tryWebsite: website.isTry,
        path: request.url,
        body: `${groupLinks(asked.address, asked.group, asked.tests, here, speaking)}
${teamSummaryTable(asked.group.name, asked, speaking)}`,
      }),
    );
  });
};
