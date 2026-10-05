// A tournament's commentaries page: every commentary on it, the most recently
// started first, each by its title and its writer's name and leading to its
// own page, and what the old site's page said of commentary — a disclaimer,
// the guidelines a writer is held to, and how to report one that breaks them —
// said here rather than on each commentary, so that it is read before
// anything is written. It offers anybody a way to start one; a reader not
// signed in is asked to sign in there. Its sections are the tournament's, with
// Commentary marked.
import type { FastifyInstance } from "fastify";

import { PublicCommentariesOfTournament } from "../../application/operations/tournaments/PublicCommentariesOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicCommentariesOfTournament.NoSuchTournament",
];

// What a writer is not to post, in the order the old site listed it.
const NOT_ALLOWED = [
  "violence",
  "prejudice",
  "personal",
  "unlawful",
  "shouting",
  "selling",
  "links",
  "impersonating",
] as const;

export const registerCommentariesPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug/commentaries`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicCommentariesOfTournament(website.host, address),
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
      // An address the tournament has moved on from leads to its
      // commentaries where it is now, for good, so that a link kept from
      // before still works.
      if (asked.address !== address) {
        return reply.redirect(`/${asked.address}/commentaries`, 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const siteName = siteNameOf(request);
      const commentaries =
        asked.commentaries.length === 0
          ? `          <p class="commentaries-none">${escape(say("commentaries.none"))}</p>`
          : `          <ul class="commentaries">
${asked.commentaries
  .map(
    (commentary) =>
      `            <li class="commentary-listed"><a class="commentary-listed-title" href="/${escape(commentary.address)}">${escape(commentary.title)}</a> <span class="commentary-listed-writer">${escape(commentary.writer)}</span></li>`,
  )
  .join("\n")}
          </ul>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: { name: asked.name, address: asked.address },
          title: asked.name,
          sections: sectionsOf(asked, speaking),
          currentSection: `/${asked.address}/commentaries`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName,
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
          <h2 class="commentaries-heading">${escape(say("tournament.commentary"))}</h2>
          <p class="commentaries-start"><a class="button" href="/${escape(asked.address)}/commentaries/create">${escape(say("commentaries.start"))}</a></p>
${commentaries}
          <section class="commentaries-about">
            <h3>${escape(say("commentaries.disclaimer.heading"))}</h3>
            <p>${escape(say("commentaries.disclaimer", { site: siteName }))}</p>
            <h3>${escape(say("commentaries.guidelines.heading"))}</h3>
            <p>${escape(say("commentaries.guidelines.responsible"))}</p>
            <p>${escape(say("commentaries.guidelines.purpose"))}</p>
            <p>${escape(say("commentaries.guidelines.notAllowed"))}</p>
            <ul>
${NOT_ALLOWED.map((each) => `              <li>${escape(say(`commentaries.guidelines.${each}`))}</li>`).join("\n")}
            </ul>
            <h3>${escape(say("commentaries.reporting.heading"))}</h3>
            <p>${escape(say("commentaries.reporting"))}</p>
            <p>${escape(say("commentaries.reporting.reviewed"))}</p>
          </section>`,
        }),
      );
    },
  );
};
