// What every competition's three views share, a block's (block.ts,
// blockSummary.ts), a knockout's (knockout.ts, knockoutSummary.ts) and a
// Swiss's (swiss.ts, swissSummary.ts) alike, and the order of play, which is
// the same for all three (orderOfPlay.ts): finding
// the competition, what is not a page and where an old address leads, the
// heading, the views offered, the section bar with the competition marked,
// and which view the competition's own address shows. Each view draws only
// what is its own.
//
// A reader keeps the view they chose until they choose another, as on the old
// site. Opening a view at its own address is choosing it, and a competition's
// own address, where the section bar and every other page lead, shows the
// view chosen last, or the grid where none has been. The pages have no
// scripting, so the choice is kept in a cookie the server reads, as the theme
// is (theme.ts), and it is one for every competition rather than one a
// competition, so that a reader who wants the summary on a phone chooses it
// once.
//
// An archived competition and a slug no competition has are not pages, any
// more than a tournament a reader is not sent to is. An address the tournament has moved on from leads to the same
// view of the competition where the tournament is now.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  type BlockToRead,
  PublicBlockOfTournament,
} from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import {
  type KnockoutToRead,
  PublicKnockoutOfTournament,
} from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import {
  PublicSwissOfTournament,
  type SwissToRead,
} from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import {
  PublicTestOfTournament,
  type TestToRead,
} from "../../application/operations/tournaments/PublicTestOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Mediator } from "../../application/common/Mediator.js";
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

/** A view of a competition, and where it is found after its own address. */
export type CompetitionView = "grid" | "summary" | "orderOfPlay";

const views: readonly {
  view: CompetitionView;
  path: string;
  word: string;
}[] = [
  { view: "grid", path: "/grid", word: "competition.view.grid" },
  { view: "summary", path: "/summary", word: "competition.view.summary" },
  {
    view: "orderOfPlay",
    path: "/order-of-play",
    word: "competition.view.orderOfPlay",
  },
];

// The views a competition offers, each leading to its own address, the one
// being read marked as such.
const viewsOffered = (
  competition: string,
  offered: readonly CompetitionView[],
  current: CompetitionView,
  speaking: Speaking,
): string => `          <nav class="competition-views" aria-label="${escape(speaking.say("competition.views"))}">
            <ul>
${views
  .filter(({ view }) => offered.includes(view))
  .map(
    ({ view, path, word }) =>
      `              <li><a class="competition-view" href="${escape(`${competition}${path}`)}"${view === current ? ' aria-current="page"' : ""}>${escape(speaking.say(word))}</a></li>`,
  )
  .join("\n")}
            </ul>
          </nav>`;

// Named for the block, whose pages had views first, and kept so, since a
// reader's choice made then is still theirs.
const viewCookie = "blockView";

const aYear = 60 * 60 * 24 * 365;

// The view a reader chose last, of those `offered`, or the grid where they
// have chosen none, or one this competition has not, as a test has no summary:
// a cookie that names no view it offers means as much.
const chosenBy = (
  request: FastifyRequest,
  offered: readonly CompetitionView[],
): CompetitionView =>
  offered.find((view) => view === request.cookies[viewCookie]) ?? "grid";

// Held to the standard the theme's cookie is, for the reasons given there:
// never sent in the clear, and not to be read by a script on the page.
const remember = (reply: FastifyReply, view: CompetitionView): void => {
  reply.setCookie(viewCookie, view, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: aYear,
  });
};

/** What draws a view of a competition beneath its heading and the views beside it. */
export type DrawView<Asked> = (
  asked: Asked,
  speaking: Speaking,
  request: FastifyRequest,
) => string;

/** What draws each view of each kind of competition that has them. */
export interface CompetitionDraws {
  readonly block: Readonly<Record<CompetitionView, DrawView<BlockToRead>>>;
  readonly knockout: Readonly<
    Record<CompetitionView, DrawView<KnockoutToRead>>
  >;
  readonly swiss: Readonly<Record<CompetitionView, DrawView<SwissToRead>>>;
  /** A test has no summary, its grid being already as short as one. */
  readonly test: Readonly<
    Record<Exclude<CompetitionView, "summary">, DrawView<TestToRead>>
  >;
}

// A competition of any kind that has pages, as its pages are given it.
type Found =
  | {
      readonly kind: "block";
      readonly asked: BlockToRead;
      readonly name: string;
    }
  | {
      readonly kind: "knockout";
      readonly asked: KnockoutToRead;
      readonly name: string;
    }
  | {
      readonly kind: "swiss";
      readonly asked: SwissToRead;
      readonly name: string;
    }
  | {
      readonly kind: "test";
      readonly asked: TestToRead;
      readonly name: string;
    };

// Whether `failure` says there is nothing at the address of the kind asked
// for, or nothing at all.
const refusedAs = (failure: unknown, codes: readonly string[]): boolean =>
  failure instanceof TournamentOperationRefused && codes.includes(failure.code);

// The competition found by `slug`, asked of as a block, then, where it is not
// one, as a knockout, and then as a Swiss; nothing where none is there.
const competitionAt = async (
  mediator: Mediator,
  website: string,
  address: string,
  slug: string,
): Promise<Found | undefined> => {
  try {
    const asked = await mediator.query(
      new PublicBlockOfTournament(website, address, slug),
    );
    return { kind: "block", asked, name: asked.block.name };
  } catch (failure) {
    if (
      refusedAs(failure, [
        "PublicBlockOfTournament.NoSuchTournament",
        "PublicBlockOfTournament.NoSuchCompetition",
      ])
    ) {
      return undefined;
    }
    if (!refusedAs(failure, ["PublicBlockOfTournament.NotABlock"])) {
      throw failure;
    }
  }
  try {
    const asked = await mediator.query(
      new PublicKnockoutOfTournament(website, address, slug),
    );
    return { kind: "knockout", asked, name: asked.knockout.name };
  } catch (failure) {
    if (
      refusedAs(failure, [
        "PublicKnockoutOfTournament.NoSuchTournament",
        "PublicKnockoutOfTournament.NoSuchCompetition",
      ])
    ) {
      return undefined;
    }
    if (!refusedAs(failure, ["PublicKnockoutOfTournament.NotAKnockout"])) {
      throw failure;
    }
  }
  try {
    const asked = await mediator.query(
      new PublicSwissOfTournament(website, address, slug),
    );
    return { kind: "swiss", asked, name: asked.swiss.name };
  } catch (failure) {
    if (
      refusedAs(failure, [
        "PublicSwissOfTournament.NoSuchTournament",
        "PublicSwissOfTournament.NoSuchCompetition",
        "PublicSwissOfTournament.NotASwiss",
      ])
    ) {
      return undefined;
    }
    throw failure;
  }
};

// The test found by `slug` among the tournament's tests; nothing where none
// is there, or what is there is not a test. It is said by its teams' names,
// as "Australia vs England", in the reader's language, where the section bar,
// which has less room, says it by their short names (`sectionsOf`).
const testAt = async (
  mediator: Mediator,
  website: string,
  address: string,
  slug: string,
  speaking: Speaking,
): Promise<Found | undefined> => {
  try {
    const asked = await mediator.query(
      new PublicTestOfTournament(website, address, slug),
    );
    const [first, second] = asked.test.teams;
    return {
      kind: "test",
      asked,
      name: speaking.say("tournament.test", {
        first: first.name,
        second: second.name,
      }),
    };
  } catch (failure) {
    if (
      refusedAs(failure, [
        "PublicTestOfTournament.NoSuchTournament",
        "PublicTestOfTournament.NoSuchCompetition",
        "PublicTestOfTournament.NotATest",
      ])
    ) {
      return undefined;
    }
    throw failure;
  }
};

/**
 * Serves every competition's views, each at its own address, where opening it
 * chooses it, and at the competition's own address the view chosen last: a
 * block's, a knockout's and a Swiss's three under the tournament's
 * "competitions", and a test's two under its "tests". Each is drawn by its
 * kind's own of `draws`.
 */
export const registerCompetitionPages = (
  server: FastifyInstance,
  assets: Assets,
  draws: CompetitionDraws,
): void => {
  const kinds: readonly {
    base: string;
    offered: readonly CompetitionView[];
    find: (
      mediator: Mediator,
      website: string,
      address: string,
      slug: string,
      speaking: Speaking,
    ) => Promise<Found | undefined>;
  }[] = [
    {
      base: "competitions",
      offered: ["grid", "summary", "orderOfPlay"],
      find: competitionAt,
    },
    { base: "tests", offered: ["grid", "orderOfPlay"], find: testAt },
  ];

  const draw = (
    found: Found,
    view: CompetitionView,
    speaking: Speaking,
    request: FastifyRequest,
  ): string => {
    switch (found.kind) {
      case "block":
        return draws.block[view](found.asked, speaking, request);
      case "knockout":
        return draws.knockout[view](found.asked, speaking, request);
      case "swiss":
        return draws.swiss[view](found.asked, speaking, request);
      case "test":
        return draws.test[view === "summary" ? "grid" : view](
          found.asked,
          speaking,
          request,
        );
    }
  };

  for (const { base, offered, find } of kinds) {
    const serve = (
      path: string,
      viewOf: (request: FastifyRequest) => CompetitionView,
      chooses: boolean,
    ): void => {
      server.get<{
        Params: {
          year: string;
          sport: string;
          slug: string;
          competition: string;
        };
      }>(
        `/${yearInPath}/:sport/:slug/${base}/:competition${path}`,
        async (request, reply) => {
          const { year, sport, slug, competition } = request.params;
          const address = `${year}/${sport}/${slug}`;
          const website = websiteOf(request);
          const speaking = speakingOf(request);
          const found = await find(
            request.server.mediator,
            website.host,
            address,
            competition,
            speaking,
          );
          if (found === undefined) return reply.callNotFound();
          const { asked } = found;
          const here = `/${asked.address}/${base}/${competition}`;
          // An address the tournament has moved on from leads to the same
          // address where it is now, for good, so that a link kept from
          // before still works. It chooses nothing until it is followed.
          if (asked.address !== address) {
            return reply.redirect(`${here}${path}`, 301);
          }

          const view = viewOf(request);
          if (chooses) remember(reply, view);
          return sendPage(
            reply,
            request,
            render(assets, {
              tournament: {
                name: asked.name,
                address: asked.address,
                notes: asked.notes,
              },
              title: found.name,
              sections: sectionsOf(
                { ...asked, playedByTeams: found.kind === "test" },
                speaking,
              ),
              currentSection: here,
              theme: themeOf(request),
              signedIn: signedIn(request),
              hasPassword: hasPassword(request),
              speaking,
              siteName: siteNameOf(request),
              tryWebsite: website.isTry,
              path: request.url,
              body: `          <div class="competition-heading">
            <h1 id="competition-heading">${escape(found.name)}</h1>
${viewsOffered(here, offered, view, speaking)}
          </div>
${draw(found, view, speaking, request)}`,
            }),
          );
        },
      );
    };
    serve("", (request) => chosenBy(request, offered), false);
    for (const { view, path } of views) {
      if (offered.includes(view)) serve(path, () => view, true);
    }
  }
};

/**
 * `words`, already escaped, with each space a line break, so that a heading
 * of more than one word has a word to a line and its column is no wider than
 * its numbers need.
 */
export const aWordToALine = (words: string): string =>
  words.split(" ").join("<br/>");
