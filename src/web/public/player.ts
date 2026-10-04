// A player's page: their games, the most recently added first, each said as
// they played it, and the competitions they are entered in, the last of the
// tournament's first. Its sections are the tournament's, with Players marked,
// since a player is one of the tournament's players.
//
// A player of a tournament played by teams is one of a team's, and their
// competitions are the tests their team plays in, each said as the section bar
// says it. A player who is archived, a player of an archived team, and a slug
// no player has are not pages, any more than a tournament a reader is not sent
// to is.
// An address the tournament has moved on from leads to the player where the
// tournament is now.
import type { FastifyInstance } from "fastify";

import {
  type GameOfPlayer,
  PublicPlayerOfTournament,
} from "../../application/operations/tournaments/PublicPlayerOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { type Speaking, speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { competitionNamed, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicPlayerOfTournament.NoSuchTournament",
  "PublicPlayerOfTournament.NoSuchPlayer",
];

const results: Readonly<Record<GameOfPlayer["result"], string>> = {
  won: "player.beat",
  lost: "player.lostTo",
  drawn: "player.drewWith",
};

// A game as the player played it: what they did, to whom, and the score, theirs
// first, as "beat Alex Another 26 to 17". The opponent leads to their own page.
const game = (played: GameOfPlayer, speaking: Speaking): string => {
  const { say } = speaking;
  return `                <li class="player-game"><span class="player-game-result">${escape(say(results[played.result]))}</span> <a class="player-game-opponent" href="/${escape(played.opponent.address)}">${escape(played.opponent.name)}</a> <span class="player-game-score">${escape(say("player.score", { score: played.score, opponent: played.opponentScore }))}</span></li>`;
};

export const registerPlayerPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{
    Params: { year: string; sport: string; slug: string; player: string };
  }>(`/${yearInPath}/:sport/:slug/players/:player`, async (request, reply) => {
    const { year, sport, slug, player } = request.params;
    const address = `${year}/${sport}/${slug}`;
    const website = websiteOf(request);
    let asked;
    try {
      asked = await request.server.mediator.query(
        new PublicPlayerOfTournament(website.host, address, player),
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
    // An address the tournament has moved on from leads to the player where
    // it is now, for good, so that a link kept from before still works.
    if (asked.address !== address) {
      return reply.redirect(`/${asked.address}/players/${player}`, 301);
    }

    const speaking = speakingOf(request);
    const { say } = speaking;
    const games =
      asked.games.length === 0
        ? `              <p class="player-games-none">${escape(say("player.noGames"))}</p>`
        : `              <ol class="player-games-list">
${asked.games.map((each) => game(each, speaking)).join("\n")}
              </ol>`;
    const competitions =
      asked.entered.length === 0
        ? `              <p class="player-competitions-none">${escape(say("player.noCompetitions"))}</p>`
        : `              <ul class="player-competitions-list">
${asked.entered
  .map(
    (competition) =>
      `                <li><a class="player-competition" href="/${escape(competition.address)}">${escape(competitionNamed(competition, speaking))}</a></li>`,
  )
  .join("\n")}
              </ul>`;

    return sendPage(
      reply,
      request,
      render(assets, {
        tournament: { name: asked.name, address: asked.address },
        title: asked.player.name,
        sections: sectionsOf(asked, speaking),
        currentSection: say("tournament.players"),
        theme: themeOf(request),
        signedIn: signedIn(request),
        hasPassword: hasPassword(request),
        speaking,
        siteName: siteNameOf(request),
        tryWebsite: website.isTry,
        path: request.url,
        body: `          <h1>${escape(asked.player.name)}</h1>
          <div class="player-page">
            <section class="player-games" aria-labelledby="player-games-heading">
              <h2 id="player-games-heading">${escape(say("player.games"))}</h2>
${games}
            </section>
            <section class="player-competitions" aria-labelledby="player-competitions-heading">
              <h2 id="player-competitions-heading">${escape(say("player.competitions"))}</h2>
${competitions}
            </section>
          </div>`,
      }),
    );
  });
};
