// Saying, on every page, that the site is a beta where it is served from an
// address that is not one of the two websites readers know it by. Whatever is
// entered at such a site may be thrown away when it is made again, and a
// reader should find that out from the page and not from an email.
//
// Decided by the address a request was reached at rather than by a setting,
// so that the same build is a beta at one address and the real thing at
// another, and moving it cannot leave the notice behind or take it away
// wrongly.
//
// Put into each page as it is sent, where it is found by the body's opening
// tag, rather than drawn by each page as it is rendered: the pages are drawn by
// the public layout, by the admin's built file and by the error and
// maintenance pages, and a notice every one of them had to remember is one
// that the next of them forgets.
import { Website } from "../../domain/common/Website.js";
import type { FastifyInstance } from "fastify";

import { escape } from "./escape.js";
import { speakingOf } from "./language.js";

// The two, each with every website under it, a try website among them. Matched
// at a dot, so that a name which only ends the same is not under them.
const websites = ["croquetscores.com", "gateballscores.com"];

/** Whether `host`, as a request names it, is not one of the two websites. */
export const isABeta = (host: string): boolean => {
  const name = Website.spelled(host).replace(/:\d+$/, "");
  // The one website under the two that is a beta: it is where the site is tried.
  if (name === Website.beta.host) return true;
  return !websites.some(
    (website) => name === website || name.endsWith(`.${website}`),
  );
};

const body = /<body[^>]*>/;

export const registerBetaBanner = (server: FastifyInstance): void => {
  server.addHook("onSend", (request, reply, payload, done) => {
    const type = String(reply.getHeader("content-type") ?? "");
    if (
      typeof payload !== "string" ||
      !type.startsWith("text/html") ||
      // The refusal of a host no website has, which is no website's page and
      // so not one to say it is a beta (unknownHost.feature).
      reply.statusCode === 421 ||
      !isABeta(request.host)
    ) {
      done(null, payload);
      return;
    }

    const notice = `
    <div class="beta-banner" role="status">
      <p>${escape(speakingOf(request).say("beta.banner"))}</p>
    </div>`;
    // The length it was sent with is for the page without it.
    reply.removeHeader("content-length");
    done(
      null,
      payload.replace(body, (opening) => `${opening}${notice}`),
    );
  });
};
