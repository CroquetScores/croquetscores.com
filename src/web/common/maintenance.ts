// Turning database access off for maintenance (maintenance.feature).
//
// While it is off nothing is asked of the database: not the page, not who is
// reading it, not that the request was handled. So this is the first thing a
// request meets after it is stamped and the site named, before anything that
// would ask, and the answer it gives is built from the request alone.
//
// It is the site being unavailable as it is when the database cannot be
// reached, said with what is known: that it is for maintenance, and about how
// long. Nobody is emailed, since the administrator turned it off.
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { DatabaseAccess } from "../../application/common/DatabaseAccess.js";
import { assetsPath, type Assets } from "./assets.js";
import { escape } from "./escape.js";
import { speakingOf } from "./language.js";
import { render } from "./layout.js";
import { siteNameOf, websiteOf } from "./site.js";
import { themeOf } from "./theme.js";

const A_MINUTE = 60 * 1000;

// Where a program is told to ask again once the estimate has passed: by then
// it is the administrator's to revise, and asking more often only adds load
// to a site that is down.
const ASK_AGAIN_AFTER_THE_ESTIMATE_SECONDS = 300;

// Files and not the database, so they are still served, which is what keeps
// the page the site's own.
const filesServed: readonly string[] = [assetsPath, "/admin/assets/"];

const wantsJson = (request: FastifyRequest): boolean =>
  request.url.startsWith("/api/");

/** How the site says it is back, from the estimate and the moment it is now. */
const returnSaid = (
  expectedBackAt: Date,
  now: Date,
): { readonly minutes: number; readonly seconds: number } | undefined => {
  const left = expectedBackAt.getTime() - now.getTime();
  if (left <= 0) return undefined;
  return {
    // Rounded up, so that a reader is never told "0 minutes" while the site is
    // still down.
    minutes: Math.ceil(left / A_MINUTE),
    seconds: Math.ceil(left / 1000),
  };
};

export const refuseWhileDatabaseAccessIsOff = (
  server: FastifyInstance,
  assets: Assets,
  access: DatabaseAccess,
): void => {
  server.addHook("onRequest", async (request, reply) => {
    if (filesServed.some((prefix) => request.url.startsWith(prefix))) return;
    const state = await access.current();
    if (!state.off) return;

    const back = returnSaid(state.expectedBackAt, request.requestedAt.toDate());
    const seconds = back?.seconds ?? ASK_AGAIN_AFTER_THE_ESTIMATE_SECONDS;
    reply.header("retry-after", String(seconds));

    if (wantsJson(request)) {
      return reply
        .code(503)
        .header("cache-control", "no-store")
        .send({
          error: "Database.Maintenance",
          ...(back === undefined ? {} : { minutes: back.minutes }),
        });
    }

    const speaking = speakingOf(request);
    const { say } = speaking;
    const heading = say("errors.unavailable");
    const detail =
      back === undefined
        ? say("errors.maintenanceLonger")
        : back.minutes === 1
          ? say("errors.maintenanceMinute")
          : say("errors.maintenanceMinutes", {
              minutes: String(back.minutes),
            });
    return reply
      .code(503)
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: heading,
          theme: themeOf(request),
          // Who is reading is the database's to say, and it is not being
          // asked: neither signed out nor told who they are.
          signedIn: false,
          hasPassword: false,
          readerKnown: false,
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: request.url,
          body: `          <h1>${escape(heading)}</h1>
          <p>${escape(say("errors.maintenance"))}</p>
          <p>${escape(detail)}</p>
          <p><a href="/">${escape(say("errors.backHome", { siteName: siteNameOf(request) }))}</a></p>`,
        }),
      );
  });
};
