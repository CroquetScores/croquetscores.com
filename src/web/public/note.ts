// One of a tournament's notes, on a page of its own: headed by the
// tournament's name, as a commentary's page is, with the note's title beneath
// it as a heading of the second level, its description drawn from its
// Markdown beneath that, and how long ago it was written, and edited where it
// has been. The admin's Preview draws a note as this page does, by the same
// drawing (markdown.ts), so that what a manager sees is what a reader will.
//
// Opening the page is reading the note: the reader's browser is told they
// have read it as it is now (read.ts), and the section bar is drawn as
// what they have read is after it. It needs no scripting.
import type { FastifyInstance } from "fastify";

import { PublicManagerNoteOfTournament } from "../../application/operations/tournaments/PublicManagerNoteOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { markdownWithoutHtml } from "../common/markdown.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { readsOf, rememberRead } from "./read.js";
import { sendPage } from "./tournamentLists.js";
import { ago, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicManagerNoteOfTournament.NoSuchTournament",
  "PublicManagerNoteOfTournament.NoSuchManagerNote",
];

// A note is kept as it was typed, HTML and all (ManagerNoteDescription.ts),
// and is drawn by a Markdown that draws no HTML (markdown.ts).
const markdown = markdownWithoutHtml();

type Params = { year: string; sport: string; slug: string; note: string };

export const registerNotePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: Params }>(
    `/${yearInPath}/:sport/:slug/notes/:note`,
    async (request, reply) => {
      const { year, sport, slug, note } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicManagerNoteOfTournament(website.host, address, note),
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
      // An address the tournament has moved on from leads to the note where
      // it is now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        return reply.redirect(encodeURI(`/${asked.managerNote.address}`), 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const reads = readsOf(request);
      const read = {
        ...reads,
        notes: rememberRead(reply, reads.notes, asked.managerNote),
      };
      const now = request.requestedAt.toDate();
      const { managerNote } = asked;
      const edited =
        managerNote.lastEditedAt === undefined
          ? ""
          : ` <span class="note-edited">${escape(say("note.edited"))} <span class="note-edited-ago">${ago(managerNote.lastEditedAt, now, speaking)}</span></span>`;

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            subtitle: asked.subtitle,
          },
          title: `${managerNote.title} - ${asked.name}`,
          sections: sectionsOf(asked, speaking, read),
          currentSection: `/${asked.address}/notes`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(asked.name)}</h1>
          <h2 class="note-title">${escape(managerNote.title)}</h2>
${managerNote.description === undefined ? "" : `          <div class="note-text">${markdown.render(managerNote.description)}</div>\n`}          <p class="note-about"><span class="note-ago">${ago(managerNote.writtenAt, now, speaking)}</span>${edited}</p>
`,
        }),
      );
    },
  );
};
