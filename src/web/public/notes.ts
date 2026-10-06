// A tournament's Notes page: headed "Notes", every note its managers wrote
// listed by its title, the most recently written first, each leading to its
// own page (note.ts) and saying how long ago it was written. A note the reader
// has not read as it is now is marked with a red asterisk, as the Notes
// section is on every page of the tournament while there is one
// (tournamentPages.ts). A tournament with no notes says it has none. The
// tournament is named in the bar beneath the site's name, and its sections are
// the tournament's, with Notes marked. It needs no scripting.
import type { FastifyInstance } from "fastify";

import { PublicManagerNotesOfTournament } from "../../application/operations/tournaments/PublicManagerNotesOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { newMark, render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { hasRead, notesReadOf } from "./notesRead.js";
import { sendPage } from "./tournamentLists.js";
import { ago, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicManagerNotesOfTournament.NoSuchTournament",
];

export const registerNotesPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug/notes`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicManagerNotesOfTournament(website.host, address),
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
      // An address the tournament has moved on from leads to its notes where
      // it is now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        // Encoded, since a slug keeps letters of any script, and an address
        // in the Location header that is not encoded is refused for them.
        return reply.redirect(encodeURI(`/${asked.address}/notes`), 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      const read = notesReadOf(request);
      const now = request.requestedAt.toDate();
      const notes =
        asked.managerNotes.length === 0
          ? `          <p class="notes-none">${escape(say("notes.none"))}</p>`
          : `          <ul class="notes">
${asked.managerNotes
  .map(
    (note) =>
      `            <li class="note-listed"><a class="note-listed-title" href="/${escape(note.address)}">${escape(note.title)}</a>${hasRead(read, note) ? "" : newMark(speaking)} <span class="note-listed-ago">${ago(note.writtenAt, now, speaking)}</span></li>`,
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
          title: `${say("tournament.notes")} - ${asked.name}`,
          sections: sectionsOf(asked, speaking, read),
          currentSection: `/${asked.address}/notes`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          body: `          <h1>${escape(say("tournament.notes"))}</h1>
${notes}
`,
        }),
      );
    },
  );
};
