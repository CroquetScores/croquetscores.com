// A tournament's commentaries page, as the old site's was: headed
// "Commentary", every commentary on it listed as its title by its writer, the
// most recently started first, then a button to start a new commentary, and
// the old site's Disclaimer, Guidelines and Reporting Commentary in its own
// words. The button is the one change from the old site, which left a link at
// the foot of the page: it is where a reader who has looked down the list and
// not found what they want looks next. It is a link drawn as a button, so it
// needs no scripting, and it is offered to anybody, since a reader not signed
// in is asked to sign in where it leads. Where those words name croquetscores.com they name
// the website being read. The tournament is named in the bar beneath the
// site's name, and its sections are the tournament's, with Commentary marked.
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
import { notesReadOf } from "./notesRead.js";
import { sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicCommentariesOfTournament.NoSuchTournament",
];

// Where a commentary is reported, and what the email is filled in with, as
// the old site had them.
const REPORT_TO = "croquetscores@gmail.com";

// The old site's guidelines, a paragraph each, after the first, which is said
// in bold.
const GUIDELINES = [
  "purpose",
  "hatred",
  "abuse",
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
        // Encoded, since a slug keeps letters of any script, and an address
        // in the Location header that is not encoded is refused for them.
        return reply.redirect(encodeURI(`/${asked.address}/commentaries`), 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const site = website.host;
      const report = `mailto:${REPORT_TO}?subject=${encodeURIComponent(say("commentaries.reporting.subject", { site }))}&body=${encodeURIComponent(say("commentaries.reporting.body"))}`;
      // As the old site listed them, a list that is empty where there are
      // none, saying nothing of it.
      const commentaries = `          <ul class="commentaries">
${asked.commentaries
  .map(
    (commentary) =>
      `            <li class="commentary-listed"><a href="/${escape(commentary.address)}"><span class="commentary-listed-title">${escape(commentary.title)}</span> ${escape(say("commentaries.by"))} <span class="commentary-listed-writer">${escape(commentary.writer)}</span></a></li>`,
  )
  .join("\n")}
          </ul>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            notes: asked.notes,
          },
          title: `${say("tournament.commentary")} - ${asked.name}`,
          sections: sectionsOf(asked, speaking, notesReadOf(request)),
          currentSection: `/${asked.address}/commentaries`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(say("tournament.commentary"))}</h1>
${commentaries}
          <p class="commentaries-start"><a class="button button-submit" href="/${escape(asked.address)}/commentaries/create">${escape(say("commentaries.start"))}</a></p>
          <section class="commentaries-about">
            <h2>${escape(say("commentaries.disclaimer.heading"))}</h2>
            <p>${escape(say("commentaries.disclaimer", { site }))}</p>
            <h2>${escape(say("commentaries.guidelines.heading"))}</h2>
            <p><strong>${escape(say("commentaries.guidelines.responsible"))}</strong></p>
${GUIDELINES.map((each) => `            <p>${escape(say(`commentaries.guidelines.${each}`))}</p>`).join("\n")}
            <h2>${escape(say("commentaries.reporting.heading"))}</h2>
            <p>${escape(say("commentaries.reporting.before"))} <a href="${escape(report)}">Tim Murphy</a>${escape(say("commentaries.reporting.after"))}</p>
            <div class="commentaries-example">
              <p>https://${escape(site)}/2015/gc/tournament-name/commentaries/day-one</p>
              <p>${escape(say("commentaries.reporting.exampleComment"))}</p>
              <p>${escape(say("commentaries.reporting.exampleReason"))}</p>
            </div>
            <p>${escape(say("commentaries.reporting.reviewed"))}</p>
            <p>${escape(say("commentaries.reporting.reserved", { site }))}</p>
          </section>
`,
        }),
      );
    },
  );
};
