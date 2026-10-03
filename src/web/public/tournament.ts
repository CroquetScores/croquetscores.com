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
  type PlayerInGame,
} from "../../application/operations/tournaments/GamesOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import { Flags } from "../../domain/aggregates/tournaments/value-objects/Flags.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { type Speaking, speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { yearInPath } from "./year.js";

// How long ago `then` was, as a reader would say it: seconds under a minute,
// minutes under an hour and hours under a day, each counted down to the whole
// one, and from a day on the day itself, in UTC as a tournament's days are,
// with its month named in the reader's language. The day is marked as one, so
// that what reads a page for its words can tell it from them.
const ago = (then: ReadOnlyDate, now: Date, speaking: Speaking): string => {
  const { say } = speaking;
  const seconds = Math.floor((now.getTime() - then.toDate().getTime()) / 1000);
  if (seconds < 60) {
    return escape(say("tournament.ago.seconds", { count: String(seconds) }));
  }
  if (seconds < 60 * 60) {
    return escape(
      say("tournament.ago.minutes", {
        count: String(Math.floor(seconds / 60)),
      }),
    );
  }
  if (seconds < 24 * 60 * 60) {
    const hours = Math.floor(seconds / (60 * 60));
    return escape(
      hours === 1
        ? say("tournament.ago.hour")
        : say("tournament.ago.hours", { count: String(hours) }),
    );
  }
  const day = then.toDate();
  const month = new Intl.DateTimeFormat(speaking.language.tag, {
    month: "short",
    timeZone: "UTC",
  }).format(day);
  const written = `${String(day.getUTCDate()).padStart(2, "0")} ${month} ${String(day.getUTCFullYear())}`;
  return `<span class="game-day">${escape(written)}</span>`;
};

// A player as a line of a game names them: their name, what they represent in
// brackets, and the flag they fly, named by what it is the flag of. Nothing is
// left in the place of what they have none of.
const player = (
  { name, representing, flag }: PlayerInGame,
  speaking: Speaking,
  assets: Assets,
): string => {
  const flown = flag === undefined ? undefined : Flags.thereAre.find(flag);
  return [
    `<span class="game-name">${escape(name)}</span>`,
    ...(representing === undefined
      ? []
      : [`<span class="game-representing">(${escape(representing)})</span>`]),
    ...(flown === undefined
      ? []
      : [
          `<img class="game-flag" src="${escape(assets.url(`images/${flown.relativePath}`))}" alt="${escape(speaking.say(`country.${String(flown)}`))}" />`,
        ]),
  ].join(" ");
};

const game = (
  played: GameOfTournament,
  now: Date,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const result = say(played.drawn ? "tournament.drewWith" : "tournament.beat");
  return `            <li class="game">
              <p class="game-line game-winner">${player(played.winner, speaking, assets)} <span class="game-score">${escape(played.winnerScore)}</span> <span class="game-result">${escape(result)}</span></p>
              <p class="game-beside game-competition"><a href="/${escape(played.competition.address)}">${escape(played.competition.name)}</a></p>
              <p class="game-line game-loser">${player(played.loser, speaking, assets)} <span class="game-score">${escape(played.loserScore)}</span></p>
              <p class="game-beside game-ago">${ago(played.addedAt, now, speaking)}</p>
            </li>`;
};

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
        return reply.redirect(`/${asked.address}`, 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const here = `/${asked.address}`;
      const recent = say("tournament.recent");
      const sections = [
        { href: here, label: recent },
        { href: `${here}/players`, label: say("tournament.players") },
        { href: `${here}/notes`, label: say("tournament.notes") },
        { href: `${here}/commentary`, label: say("tournament.commentary") },
        ...asked.competitions.map((competition) => ({
          href: `/${competition.address}`,
          label: competition.name,
        })),
      ];
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
          title: asked.name,
          sections,
          currentSection: recent,
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
