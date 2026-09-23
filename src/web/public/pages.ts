// A public page names what it needs and returns the contents of the panel. The
// shell around it — header, section bar, footer — is in common/layout.ts, which
// the error pages share.
import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";

import type { Assets } from "../common/assets.js";
import { render, type Section } from "../common/layout.js";
import { speakingOf } from "../common/language.js";
import { siteNameOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { signedIn } from "../common/reader.js";

export interface Page {
  readonly path: string;
  readonly title: string;
  readonly headerTitle?: string | undefined;
  readonly sections?: readonly Section[] | undefined;
  readonly currentSection?: string | undefined;
  body(): string;
}

// Placeholders, so that the dark green section bar can be seen and tested
// before any page has real sections. They come out with the first feature that
// brings its own.
const filters: readonly Section[] = [
  { href: "/", label: "All" },
  { href: "/ac", label: "AC" },
  { href: "/gc", label: "GC" },
  { href: "/a6w", label: "A6W" },
  { href: "/rc", label: "RC" },
];

const home: Page = {
  path: "/",
  title: "Croquet Scores",
  sections: filters,
  currentSection: "All",
  // Placeholder prose, here so there is something to scroll past while the
  // pinned bar is being looked at. It goes when the tournament list arrives.
  body: () => `          <h1>Latest Tournaments</h1>
          <p class="lead">Scores and commentary as events unfold.</p>
          <p>
            Croquet Scores gives tournament managers the tools to record match
            scores as they happen, and lets anyone at the event publish
            commentary alongside them. Followers see the action unfold without
            waiting for a result sheet to be typed up at the end of the day.
          </p>
          <p>
            A tournament is organised into blocks and knockouts. Each carries
            its own games, and each game its own scores, so a manager records
            what happened once and every view of it — the block table, the
            player's record, the running commentary — follows from that.
          </p>
          <p>
            Scores are published as they are entered. There is no separate step
            to make them public and nothing to remember to press at the end of a
            round, because a score that has been recorded is a score somebody
            somewhere is waiting to read.
          </p>
          <p>
            Anyone can follow a tournament without an account. An account is for
            the people doing the recording: tournament managers, scorers, and
            whoever is writing the commentary.
          </p>
          <h2>Recording a tournament</h2>
          <p>
            A manager records a game once. The block table, the player's record
            and the running commentary are all views of that one recording, so
            there is nothing to enter twice and nothing to keep in step by hand.
          </p>
          <p>
            Blocks and knockouts each carry their own games. A game carries its
            own scores. Nothing above that layer has to know how a particular
            format counts, which is what lets association croquet, golf croquet
            and the shorter formats share one set of screens.
          </p>
          <h2>Following along</h2>
          <p>
            No account is needed to watch. A tournament's page is a public page:
            it can be linked to, sent to somebody, and read on a phone at the
            side of a lawn without signing into anything.
          </p>
          <p>
            Commentary sits alongside the scores rather than in a separate feed,
            because the two are read together. A score without the context of
            what happened is a number, and a report without the score is a
            story with the end missing.
          </p>
          <h2>What is here yet</h2>
          <p>
            This page is a placeholder. The list of tournaments, the filters
            above it and everything else that belongs here arrive with the
            features that specify them. What it is standing in for at the moment
            is length: enough of it to scroll past, so that the pinned bar at
            the top of the window can be seen doing its job.
          </p>`,
};

export const pages: readonly Page[] = [home];

// An If-None-Match may carry several tags, and a weak validator's W/ prefix
// says only how the tag was derived, not which entity it names.
const matches = (header: string | undefined, etag: string): boolean =>
  header !== undefined &&
  header
    .split(",")
    .map((candidate) => candidate.trim().replace(/^W\//, ""))
    .some((candidate) => candidate === "*" || candidate === etag);

export const registerPublicPages = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  for (const page of pages) {
    server.get(page.path, (request, reply) => {
      const html = render(assets, {
        title: page.title,
        headerTitle: page.headerTitle,
        sections: page.sections,
        currentSection: page.currentSection,
        currentPath: page.path,
        theme: themeOf(request),
        signedIn: signedIn(request),
        speaking: speakingOf(request),
        siteName: siteNameOf(request),
        path: page.path,
        body: page.body(),
      });
      const etag = `"${createHash("sha256").update(html).digest("base64url").slice(0, 27)}"`;

      reply
        .header("cache-control", "private, no-cache")
        .header("vary", "Cookie, Accept-Language")
        .header("etag", etag);

      // Without this the ETag costs a hash on every request and saves nothing:
      // Fastify does no conditional-request handling of its own.
      if (matches(request.headers["if-none-match"], etag)) {
        return reply.code(304).send();
      }

      return reply.type("text/html; charset=utf-8").send(html);
    });
  }
};
