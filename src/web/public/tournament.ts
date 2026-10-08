// A tournament's page: every game played in it that is in use, the most
// recently added first, each as the winner on one line and the loser on the
// next, with the competition it was played in and how long ago it was added
// beside them. Its sections are the tournament's: Recent, which is this page,
// then Players, Notes and Commentary, then its competitions.
//
// It needs no scripting. How long ago is worked out as the page is drawn, by
// the server's clock, so it is as true as the page is fresh.
import type { FastifyInstance } from "fastify";

import {
  type GameOfTournament,
  GamesOfTournament,
} from "../../application/operations/tournaments/GamesOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { type Speaking, speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { readsOf } from "./read.js";
import { gameShown, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// A game as every page of a tournament that lists games shows it, with the
// competition it was played in beside the winner, since the tournament's
// games are of every competition.
const game = (
  played: GameOfTournament,
  now: Date,
  speaking: Speaking,
  assets: Assets,
): string =>
  gameShown(
    played,
    `<a href="/${escape(played.competition.address)}">${escape(played.competition.name)}</a>`,
    now,
    speaking,
    assets,
  );

export const registerTournamentPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new GamesOfTournament(website.host, address),
        );
      } catch (failure) {
        // No tournament a reader is sent to is at the address, which is a page
        // that is not there.
        if (
          failure instanceof TournamentOperationRefused &&
          failure.code === "GamesOfTournament.NoSuchTournament"
        ) {
          return reply.callNotFound();
        }
        throw failure;
      }
      // An address the tournament has moved on from leads to where it is
      // now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        // Encoded, since a slug keeps letters of any script and Fastify refuses a
        // Location with a character outside Latin-1.
        return reply.redirect(encodeURI(`/${asked.address}`), 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const sections = sectionsOf(asked, speaking, readsOf(request));
      const now = request.requestedAt.toDate();
      const games =
        asked.games.length === 0
          ? `          <p class="games-none">${escape(say("tournament.none"))}</p>`
          : `          <ol class="games">
${asked.games.map((each) => game(each, now, speaking, assets)).join("\n")}
          </ol>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            subtitle: asked.subtitle,
          },
          title: asked.name,
          sections,
          currentSection: `/${asked.address}`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
${games}`,
        }),
      );
    },
  );
};
