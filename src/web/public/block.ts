// A block's page: its results as a grid, as the old site showed them. A row
// for each player in the block's order, and a column for each in the same
// order, so that where a player's row meets their opponent's column are the
// games between them; then each player's totals. Its sections are the
// tournament's, with the block marked.
//
// An archived block, a slug no competition has, and a knockout or a Swiss,
// which are shown otherwise, are not pages, any more than a tournament a
// reader is not sent to is. An address the tournament has moved on from
// leads to the block where the tournament is now.
import type { FastifyInstance } from "fastify";

import {
  type BlockToRead,
  type GameOfBlock,
  type PlayerOfBlock,
  PublicBlockOfTournament,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { type Speaking, speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { playerShown, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicBlockOfTournament.NoSuchTournament",
  "PublicBlockOfTournament.NoSuchCompetition",
  "PublicBlockOfTournament.NotABlock",
];

/**
 * The first letter or digit of each word of `name`, a word being what spaces
 * part, each as it was written: so "Kerri-Ann Organ" is "KO" and "Jan van
 * Dijk" is "JvD".
 */
export const initialsOf = (name: string): string =>
  name
    .split(/\s+/u)
    .map((word) => /[\p{L}\p{N}]/u.exec(word)?.[0] ?? "")
    .join("");

// A player's totals, with the words they are headed by. Where each match is a
// single game a game won is a match won, so the old site's wins and net hoops
// are all there is to say; otherwise matches decide a block before games, and
// games before hoops, and the totals are in that order.
const totalsOf = (
  bestOf: number,
): readonly { word: string; of: (player: PlayerOfBlock) => number }[] =>
  bestOf === 1
    ? [
        { word: "block.wins", of: (player) => player.gamesWon },
        { word: "block.netHoops", of: (player) => player.netHoops },
      ]
    : [
        { word: "block.matches", of: (player) => player.matchesWon },
        { word: "block.netGames", of: (player) => player.netGames },
        { word: "block.games", of: (player) => player.gamesWon },
        { word: "block.netHoops", of: (player) => player.netHoops },
      ];

// One score, the row player's, in a game against the column player, marked
// for the row player by more than its colour: a word for whatever reads the
// page aloud, and a weight or a slant for whoever sees it.
const scoreIn = (
  game: GameOfBlock,
  player: string,
  speaking: Speaking,
): string => {
  const won = game.winner === player;
  const result = game.drawn ? "drawn" : won ? "won" : "lost";
  const score = won ? game.winnerScore : game.loserScore;
  return `<span class="block-grid-score block-grid-${result}"><span class="block-grid-points">${escape(score)}</span> <span class="visually-hidden">${escape(speaking.say(`block.${result}`))}</span></span>`;
};

const grid = (
  asked: BlockToRead,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const totals = totalsOf(asked.block.bestOf);
  const heading = asked.players
    .map(
      (player) =>
        `                <th scope="col" class="block-grid-initials"><span aria-hidden="true">${escape(initialsOf(player.name))}</span><span class="visually-hidden">${escape(player.name)}</span></th>`,
    )
    .join("\n");
  const rows = asked.players
    .map((player) => {
      const cells = asked.players.map((opponent) => {
        if (opponent.id === player.id) {
          return `                <td class="block-grid-self"></td>`;
        }
        const between = asked.games.filter(
          (game) =>
            (game.winner === player.id && game.loser === opponent.id) ||
            (game.winner === opponent.id && game.loser === player.id),
        );
        return `                <td class="block-grid-cell">${between.map((game) => scoreIn(game, player.id, speaking)).join("")}</td>`;
      });
      const withdrawn = player.withdrawn
        ? ` <span class="block-grid-withdrawn">${escape(say("block.withdrawn"))}</span>`
        : "";
      return `              <tr class="block-grid-row">
                <th scope="row" class="block-grid-player">${playerShown(player, "player", speaking, assets, `/${player.address}`)}${withdrawn}</th>
${cells.join("\n")}
${totals.map(({ of }) => `                <td class="block-grid-total">${escape(String(of(player)))}</td>`).join("\n")}
              </tr>`;
    })
    .join("\n");
  return `          <div class="block-grid-scroll" role="region" aria-labelledby="block-heading" tabindex="0">
            <table class="block-grid">
              <thead>
              <tr>
                <td class="block-grid-corner"></td>
${heading}
${totals.map(({ word }) => `                <th scope="col" class="block-grid-total-heading">${escape(say(word)).split(" ").join("<br/>")}</th>`).join("\n")}
              </tr>
              </thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>`;
};

export const registerBlockPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{
    Params: { year: string; sport: string; slug: string; block: string };
  }>(
    `/${yearInPath}/:sport/:slug/competitions/:block`,
    async (request, reply) => {
      const { year, sport, slug, block } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicBlockOfTournament(website.host, address, block),
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
      // An address the tournament has moved on from leads to the block where
      // it is now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        return reply.redirect(`/${asked.address}/competitions/${block}`, 301);
      }

      const speaking = speakingOf(request);
      return sendPage(
        reply,
        request,
        render(assets, {
          title: asked.block.name,
          sections: sectionsOf({ ...asked, playedByTeams: false }, speaking),
          currentSection: asked.block.name,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1 id="block-heading">${escape(asked.block.name)}</h1>
${grid(asked, speaking, assets)}`,
        }),
      );
    },
  );
};
