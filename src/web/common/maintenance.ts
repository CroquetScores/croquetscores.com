// Turning database access off for maintenance (maintenance.feature).
//
// While it is off nothing is asked of the database: not the page, not who is
// reading it, not that the request was handled. So this is the first thing a
// request meets after it is stamped and the site named, before anything that
// would ask, and the answer it gives is built from the request alone. The one
// exception is an administrator's page for turning access on again, where
// who is asking is looked up, and only there.
//
// It is the site being unavailable as it is when the database cannot be
// reached, said with what is known: that it is for maintenance, and about how
// long. Nobody is emailed, since the administrator turned it off.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { DatabaseAccess } from "../../application/common/DatabaseAccess.js";
import { assetsPath, type Assets } from "./assets.js";
import { escape } from "./escape.js";
import { speakingOf } from "./language.js";
import { render } from "./layout.js";
import { siteNameOf, websiteOf } from "./site.js";
import { themeOf } from "./theme.js";

const A_MINUTE = 60 * 1000;

// The page where an administrator turns access on again, and what it asks of
// the site. They are let through while access is off, to an administrator and
// to nobody else, since otherwise the only way to turn access on would be the
// script on the machine the site runs on (databaseStatus.feature).
const administratorsLetThrough: readonly RegExp[] = [
  /^\/admin\/administrator\/database-status\/?(?:\?.*)?$/,
  /^\/api\/site\/database-access(?:[/?].*)?$/,
];

/**
 * Whether the reader of a request is an administrator, which is the database's
 * to say, since that is where sessions are kept. A request it cannot say for is
 * not an administrator's: the failure is the database not being there, and the
 * script is what an administrator has then.
 */
export type AdministratorReader = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<boolean>;

// Where a program is told to ask again once the estimate has passed: by then
// it is the administrator's to revise, and asking more often only adds load
// to a site that is down.
const ASK_AGAIN_AFTER_THE_ESTIMATE_SECONDS = 300;

// Files and not the database, so they are still served, which is what keeps
// the page the site's own.
const filesServed: readonly string[] = [assetsPath, "/admin/assets/"];

// The health check, which says the process is well and uses no database to
// say so: a balancer or a monitor told otherwise for the whole of the
// maintenance would take the site out of service for what was done on purpose.
const healthCheck = "/api/site/health";

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
  isAdministrator: AdministratorReader,
): void => {
  server.addHook("onRequest", async (request, reply) => {
    if (filesServed.some((prefix) => request.url.startsWith(prefix))) return;
    if (request.url === healthCheck) return;
    const state = await access.current();
    if (!state.off) return;
    if (
      administratorsLetThrough.some((address) => address.test(request.url)) &&
      (await isAdministrator(request, reply).catch(() => false))
    ) {
      return;
    }

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
          ...(state.words === undefined ? {} : { words: state.words }),
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
          <p>${escape(state.words ?? say("errors.maintenance"))}</p>
          <p>${escape(detail)}</p>
          <p><a href="/">${escape(say("errors.backHome", { siteName: siteNameOf(request) }))}</a></p>`,
        }),
      );
  });
};
