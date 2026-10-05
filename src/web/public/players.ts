// A tournament's players' page: every player of the tournament who is not
// archived, in alphabetical order of their names, each shown as the
// tournament's page shows a player and leading to their own page. Its sections
// are the tournament's, with Players marked.
//
// A tournament played by teams has no players of its own, only its teams', so
// it lists them team by team under each team's name. An address the
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
      // A tournament played by teams has no players of its own, only its
      // teams', listed team by team under each team's name, with no heading
      // of "Players" over them: the section bar says it already. A team's
      // player is their name alone, leading to their own page, since their
      // team is the heading above them.
      const teams = asked.teams
        .map(
          (
            team,
            at,
          ) => `          <section class="players-team" aria-labelledby="players-team-${String(at)}">
            <h3 class="players-team-name" id="players-team-${String(at)}">${escape(team.name)}</h3>
            <ul class="players">
${team.players.map((player) => `              <li class="player"><a class="player-name" href="/${escape(player.address)}">${escape(player.name)}</a></li>`).join("\n")}
            </ul>
          </section>`,
        )
        .join("\n");

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            notes: asked.notes,
          },
          title: asked.name,
          sections: sectionsOf(asked, speaking),
          currentSection: `/${asked.address}/players`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
${asked.playedByTeams ? teams : `          <h2 class="players-heading">${escape(say("tournament.players"))}</h2>\n${players}`}`,
        }),
      );
    },
  );
};
