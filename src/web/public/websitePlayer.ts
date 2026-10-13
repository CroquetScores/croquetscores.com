// A player's page, at "/players" followed by their slug: what they have
// played in, as the tournament's name, a hyphen and the competition's
// (websitePlayer.feature).
import type { FastifyInstance } from "fastify";

import { PlayerOfWebsite } from "../../application/operations/tournaments/PlayerOfWebsite.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";

export const registerWebsitePlayerPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { slug: string } }>(
    "/players/:slug",
    async (request, reply) => {
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PlayerOfWebsite(website.host, request.params.slug),
        );
      } catch (failure) {
        // No player the website has at the slug is a page that is not there.
        if (
          failure instanceof TournamentOperationRefused &&
          failure.code === "PlayerOfWebsite.NoSuchPlayer"
        ) {
          return reply.callNotFound();
        }
        throw failure;
      }
      const speaking = speakingOf(request);

      const lines = asked.entries
        .map((entry) =>
          entry.competition === undefined
            ? `            <li class="player-entry"><a href="/${escape(entry.tournament.address)}">${escape(entry.tournament.name)}</a></li>`
            : `            <li class="player-entry"><a href="/${escape(entry.competition.address)}">${escape(`${entry.tournament.name} - ${entry.competition.name}`)}</a></li>`,
        )
        .join("\n");

      return sendPage(
        reply,
        request,
        render(assets, {
          title: asked.name,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
          <ul class="player-entries">
${lines}
          </ul>`,
        }),
      );
    },
  );
};
