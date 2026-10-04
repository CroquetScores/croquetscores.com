// What a block's three views share (block.ts, blockSummary.ts,
// blockOrderOfPlay.ts): finding the block, what is not a page and where an
// old address leads, the heading, the views offered, the section bar with
// the block marked, and which view the block's own address shows. Each view
// draws only what is its own.
//
// A reader keeps the view they chose until they choose another, as on the old
// site. Opening a view at its own address is choosing it, and the block's own
// address, where the section bar and every other page lead, shows the view
// chosen last, or the grid where none has been. The pages have no scripting,
// so the choice is kept in a cookie the server reads, as the theme is
// (theme.ts), and it is one for every block rather than one a block, so that
// a reader who wants the summary on a phone chooses it once.
//
// An archived block, a slug no competition has, and a knockout or a Swiss,
// which are shown otherwise, are not pages, any more than a tournament a
// reader is not sent to is. An address the tournament has moved on from
// leads to the same view of the block where the tournament is now.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  type BlockToRead,
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
import { sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers a view as one that is not there.
const notThere: readonly string[] = [
  "PublicBlockOfTournament.NoSuchTournament",
  "PublicBlockOfTournament.NoSuchCompetition",
  "PublicBlockOfTournament.NotABlock",
];

/** A view of a block, and where it is found after the block's own address. */
export type BlockView = "grid" | "summary" | "orderOfPlay";

const views: readonly { view: BlockView; path: string; word: string }[] = [
  { view: "grid", path: "/grid", word: "block.view.grid" },
  { view: "summary", path: "/summary", word: "block.view.summary" },
  {
    view: "orderOfPlay",
    path: "/order-of-play",
    word: "block.view.orderOfPlay",
  },
];

// The three views, each leading to its own address, the one being read
// marked as such.
const viewsOffered = (
  block: string,
  current: BlockView,
  speaking: Speaking,
): string => `          <nav class="block-views" aria-label="${escape(speaking.say("block.views"))}">
            <ul>
${views
  .map(
    ({ view, path, word }) =>
      `              <li><a class="block-view" href="${escape(`${block}${path}`)}"${view === current ? ' aria-current="page"' : ""}>${escape(speaking.say(word))}</a></li>`,
  )
  .join("\n")}
            </ul>
          </nav>`;

const blockViewCookie = "blockView";

const aYear = 60 * 60 * 24 * 365;

// The view a reader chose last, or the grid where they have chosen none, which
// is also what a cookie that names no view means.
const chosenBy = (request: FastifyRequest): BlockView =>
  views.find(({ view }) => view === request.cookies[blockViewCookie])?.view ??
  "grid";

// Held to the standard the theme's cookie is, for the reasons given there:
// never sent in the clear, and not to be read by a script on the page.
const remember = (reply: FastifyReply, view: BlockView): void => {
  reply.setCookie(blockViewCookie, view, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: aYear,
  });
};

/** What draws a view of a block beneath its heading and the views beside it. */
export type DrawView = (
  asked: BlockToRead,
  speaking: Speaking,
  request: FastifyRequest,
) => string;

/** The players of `asked` by the id its games name each by. */
export const playersById = (
  asked: BlockToRead,
): ReadonlyMap<string, PlayerOfBlock> =>
  new Map(asked.players.map((player) => [player.id, player]));

/**
 * Serves a block's three views, each at its own address, where opening it
 * chooses it, and at the block's own address the view chosen last. Each is
 * drawn by its own of `draws`.
 */
export const registerBlockPages = (
  server: FastifyInstance,
  assets: Assets,
  draws: Readonly<Record<BlockView, DrawView>>,
): void => {
  const serve = (
    path: string,
    viewOf: (request: FastifyRequest) => BlockView,
    chooses: boolean,
  ): void => {
    server.get<{
      Params: { year: string; sport: string; slug: string; block: string };
    }>(
      `/${yearInPath}/:sport/:slug/competitions/:block${path}`,
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
        const here = `/${asked.address}/competitions/${block}`;
        // An address the tournament has moved on from leads to the same
        // address where it is now, for good, so that a link kept from before
        // still works. It chooses nothing until it is followed.
        if (asked.address !== address) {
          return reply.redirect(`${here}${path}`, 301);
        }

        const view = viewOf(request);
        if (chooses) remember(reply, view);
        const speaking = speakingOf(request);
        return sendPage(
          reply,
          request,
          render(assets, {
            tournament: { name: asked.name, address: asked.address },
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
            body: `          <div class="block-heading">
            <h1 id="block-heading">${escape(asked.block.name)}</h1>
${viewsOffered(here, view, speaking)}
          </div>
${draws[view](asked, speaking, request)}`,
          }),
        );
      },
    );
  };
  serve("", chosenBy, false);
  for (const { view, path } of views) serve(path, () => view, true);
};

/**
 * `words`, already escaped, with each space a line break, so that a heading
 * of more than one word has a word to a line and its column is no wider than
 * its numbers need.
 */
export const aWordToALine = (words: string): string =>
  words.split(" ").join("<br/>");
