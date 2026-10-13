// Telling a reader there is something new to read. There are two pages of what's
// new in the help, one for everybody and one for the people who run
// tournaments, and each is announced by an alert on the page its readers start
// from (whatsNew.feature).
//
// What a reader has said is kept in cookies, as the theme is, because the public
// side has no script to keep it and a reader who is not signed in has no
// account to keep it on. A cookie for each of the two alerts, so that having
// read one says nothing about the other.
import type { FastifyReply, FastifyRequest } from "fastify";

import { escape } from "./escape.js";
import type { HelpLibrary } from "./helpLibrary.js";
import { helpPath } from "./helpPages.js";
import type { Speaking } from "./language.js";
import { aYear, keptByTheServer } from "./theme.js";

export const alertKinds = ["public", "admin"] as const;
export type AlertKind = (typeof alertKinds)[number];

export const parseAlertKind = (value: unknown): AlertKind | undefined =>
  alertKinds.find((kind) => kind === value);

// Where each page of what's new is among the help's, and the words that say
// what is new on it.
const pages: Readonly<
  Record<AlertKind, { readonly name: string; readonly message: string }>
> = {
  public: { name: "whats-new", message: "whatsNew.public.message" },
  admin: { name: "admin/whats-new", message: "whatsNew.admin.message" },
};

/** Which alert a page of the help is the page of, if it is one. */
export const alertKindOfPage = (name: string): AlertKind | undefined =>
  alertKinds.find((kind) => pages[kind].name === name);

/** Where an alert leads. */
export const whatsNewPath = (kind: AlertKind): string =>
  `${helpPath}/${pages[kind].name}`;

/** Where the alert's two choices are posted. */
export const whatsNewChoicePath = "/whats-new";

export const choices = ["later", "never"] as const;
export type Choice = (typeof choices)[number];

export const parseChoice = (value: unknown): Choice | undefined =>
  choices.find((choice) => choice === value);

// What is kept for each alert. The first lasts: the release the reader has
// read, or "never" where they have said they do not want to be told. The
// second is for the visit, which ends when the browser is closed, and is the
// release they asked to be reminded of.
const lasting = (kind: AlertKind): string => `whats-new-${kind}`;
const forTheVisit = (kind: AlertKind): string => `whats-new-later-${kind}`;

const never = "never";
const aRelease = /^\d{4}-\d{2}-\d{2}$/;

// A value nobody can make sense of is no value, as an unreadable theme is no
// theme. Releases are dates written year first, so they compare as text.
const release = (value: string | undefined): string | undefined =>
  value !== undefined && aRelease.test(value) ? value : undefined;

/**
 * When the page of what's new for `kind` says it was released: by the first
 * language's page, whatever language the reader reads, so that a translation
 * that is late or missing does not hold the alert back.
 */
export const releaseOf = async (
  library: HelpLibrary,
  firstLanguageTag: string | undefined,
  kind: AlertKind,
): Promise<string | undefined> =>
  firstLanguageTag === undefined
    ? undefined
    : release(
        (await library.page(firstLanguageTag, pages[kind].name))?.released,
      );

/** Whether `request`'s reader is to be told of `released`. */
export const isToBeTold = (
  request: FastifyRequest,
  kind: AlertKind,
  released: string | undefined,
): boolean => {
  if (released === undefined) return false;

  const kept = request.cookies[lasting(kind)];
  if (kept === never) return false;
  const read = release(kept);
  if (read !== undefined && released <= read) return false;

  const later = release(request.cookies[forTheVisit(kind)]);
  return !(later !== undefined && released <= later);
};

/** Keeps that the reader has read `released`, being shown the page. */
export const rememberRead = (
  request: FastifyRequest,
  reply: FastifyReply,
  kind: AlertKind,
  released: string,
): void => {
  const kept = request.cookies[lasting(kind)];
  // "Never" is the reader's word on the alert and not on the release, so
  // reading what's new does not take it back.
  if (kept === never) return;
  const read = release(kept);
  if (read !== undefined && released <= read) return;
  reply.setCookie(lasting(kind), released, {
    ...keptByTheServer,
    maxAge: aYear,
  });
};

/** Keeps the reader's choice from the alert. */
export const rememberChoice = (
  reply: FastifyReply,
  kind: AlertKind,
  choice: Choice,
  released: string | undefined,
): void => {
  if (choice === "never") {
    reply.setCookie(lasting(kind), never, {
      ...keptByTheServer,
      maxAge: aYear,
    });
    return;
  }
  // With no maxAge, so that it goes with the visit.
  if (released !== undefined) {
    reply.setCookie(forTheVisit(kind), released, keptByTheServer);
  }
};

/**
 * The alert for `kind`, or nothing where the reader is not to be told. `path`
 * is the page it is drawn on, which the choices bring the reader back to.
 */
export const whatsNewAlert = (
  request: FastifyRequest,
  speaking: Speaking,
  kind: AlertKind,
  released: string | undefined,
  path: string,
): string => {
  if (!isToBeTold(request, kind, released)) return "";

  const { say } = speaking;
  const id = `whats-new-message-${kind}`;
  return `          <aside class="whats-new" aria-labelledby="${id}">
            <p id="${id}">${escape(say(pages[kind].message))}</p>
            <div class="whats-new-choices">
              <a class="whats-new-view" href="${whatsNewPath(kind)}">${escape(say("whatsNew.view"))}</a>
              <form method="post" action="${whatsNewChoicePath}">
                <input type="hidden" name="alert" value="${kind}" />
                <input type="hidden" name="return" value="${escape(path)}" />
                <button type="submit" name="choice" value="later">${escape(say("whatsNew.later"))}</button>
                <button type="submit" name="choice" value="never">${escape(say("whatsNew.never"))}</button>
              </form>
            </div>
          </aside>`;
};
