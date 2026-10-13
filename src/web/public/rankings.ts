// A tournament's rankings, at its address followed by "rankings": the file the
// world rankings are sent where it counts towards them (rankings.feature), and
// otherwise a page that says there are none and why. A file and not a page, so
// opening it saves it: a text file for Association Croquet and a spreadsheet
// for Golf Croquet and American 6 Wicket, each as that sport's rankings
// officers read them.
//
// An address the tournament has moved on from leads to the same address where
// it is now, whether it is a file or a page.
import type { FastifyInstance } from "fastify";

import {
  PublicRankingsOfTournament,
  type RankingsToRead,
} from "../../application/operations/tournaments/PublicRankingsOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { rankingsTextFile } from "./rankingsTextFile.js";
import { rankingsWorkbook } from "./rankingsWorkbook.js";
import { sendPage } from "./tournamentLists.js";
import { yearInPath } from "./year.js";

// A file name cannot have these, nor any control character.
const invalidInFileNames = /[\x00-\x1f"<>|:*?\\/]/g; // eslint-disable-line no-control-regex

/** The tournament's name as a file's, with `extension` after it. */
export const fileNameOf = (name: string, extension: string): string =>
  `${name.replace(invalidInFileNames, "-")}${extension}`;

// A header cannot carry a name outside Latin-1 as it is, so it is given twice:
// plainly for what cannot read the second, and encoded for what can.
const dispositionOf = (fileName: string): string => {
  const plain = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
  return `attachment; filename="${plain}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
};

const textFileTypes = new Set(["ac"]);

export const registerRankings = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug/rankings`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked: RankingsToRead;
      try {
        asked = await request.server.mediator.query(
          new PublicRankingsOfTournament(website.host, address),
        );
      } catch (failure) {
        if (
          failure instanceof TournamentOperationRefused &&
          failure.code === "PublicRankingsOfTournament.NoSuchTournament"
        ) {
          return reply.callNotFound();
        }
        throw failure;
      }
      // Encoded, since a slug keeps letters of any script and a Location
      // outside Latin-1 is refused.
      if (asked.address !== address) {
        return reply.redirect(encodeURI(`/${asked.address}/rankings`), 301);
      }

      const { rankings } = asked;
      if (rankings.is === "available") {
        // Never cached by whatever sits between, since what it holds changes
        // with every score entered.
        reply.header("cache-control", "no-store");
        if (textFileTypes.has(asked.sport)) {
          return reply
            .header(
              "content-disposition",
              dispositionOf(fileNameOf(asked.name, ".txt")),
            )
            .type("text/plain; charset=us-ascii")
            .send(Buffer.from(rankingsTextFile(asked), "latin1"));
        }
        return reply
          .header(
            "content-disposition",
            dispositionOf(fileNameOf(asked.name, ".xlsx")),
          )
          .type(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          )
          .send(rankingsWorkbook(asked));
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            subtitle: undefined,
          },
          title: say("rankings.notAvailable"),
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(say("rankings.notAvailable"))}</h1>
          <p class="rankings-tournament">${escape(asked.name)}</p>
          <p class="rankings-why">${escape(say(`rankings.notAvailable.${rankings.because}`))}</p>`,
        }),
      );
    },
  );
};
