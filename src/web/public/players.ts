// A tournament's players' page: every player of the tournament who is not
// archived, in alphabetical order of their names, each shown as the
// tournament's page shows a player and leading to their own page. Its sections
// are the tournament's, with Players marked.
//
// A tournament played by teams has no players of its own, and so no players'
// page, any more than a tournament a reader is not sent to has. An address the
// tournament has moved on from leads to its players' page where it is now.
import type { FastifyInstance } from "fastify";

import { PublicPlayersOfTournament } from "../../application/operations/tournaments/PublicPlayersOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { playerShown, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicPlayersOfTournament.NoSuchTournament",
  "PublicPlayersOfTournament.PlayedByTeams",
];

export const registerPlayersPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug/players`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicPlayersOfTournament(website.host, address),
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
      // An address the tournament has moved on from leads to its players
      // where it is now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        return reply.redirect(`/${asked.address}/players`, 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const players =
        asked.players.length === 0
          ? `          <p class="players-none">${escape(say("players.none"))}</p>`
          : `          <ul class="players">
${asked.players
  .map(
    (player) =>
      `            <li class="player">${playerShown(player, "player", speaking, assets, `/${player.address}`)}</li>`,
  )
  .join("\n")}
          </ul>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: { name: asked.name, address: asked.address },
          title: asked.name,
          sections: sectionsOf({ ...asked, playedByTeams: false }, speaking),
          currentSection: say("tournament.players"),
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
          <h2 class="players-heading">${escape(say("tournament.players"))}</h2>
${players}`,
        }),
      );
    },
  );
};
