// Where a reader signs in with their email address and their password.
//
// A wrong password and an address nobody registered are refused alike, with
// one message above the fields that does not say which it was: which addresses
// have accounts must not be found out from this page. What was typed of the
// address is put back, and the password never is.
//
// Signing in is limited, so that the page cannot be used to guess passwords.
// An email address that has failed often enough is held for the rest of the
// hour, and so is an IP address, whichever address it gives. Both are held
// even against the right password, since a limit that let the right password
// through would stop nobody guessing, and both are counted whether or not the
// address has an account, so that being held says nothing either.
//
// Once signed in, the reader goes back to the page that sent them here, and
// only if that is a path on this site: an address naming another site would
// let a link to this page send a reader anywhere, looking as though this site
// had sent them.
//
// Where the site has been given Google's credentials, the page also offers
// signing in with Google, at the top of the form, as the register page does
// (auth/google.ts). The offer carries where the reader goes back to, so that
// coming in by Google goes back to the same page a password would. A reader
// Google did not let in is brought back here and told why, by a code in the
// page's address; only the codes that way back sends are said.
//
// It needs no scripting and nobody signed in.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { SignIn } from "../../application/operations/accounts/SignIn.js";
import { SignInRefused } from "../../application/operations/accounts/SignInHandler.js";
import type {
  FailedSignIns,
  MostAnHour,
} from "../../application/services/FailedSignIns.js";
import type { Sessions } from "../../application/services/Sessions.js";
import { EmailAddress } from "../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { startSession } from "../common/session.js";
import { safeReturnPath, themeOf } from "../common/theme.js";
import { ipAddressOf } from "../common/trustedProxy.js";
import {
  googlePath,
  refusalsFromGoogle,
  withGoogle,
  type SentFrom,
} from "./googleOffer.js";

export const signInPath = "/account/sign-in";

const forgotPasswordPath = "/account/forgot-password";
const registerPath = "/account/register";

/** How many times an email address, and one IP address, may fail in an hour. */
export const mostAnHour: MostAnHour = { byEmailAddress: 10, byIpAddress: 30 };

/**
 * Where to go once signed in: the path that sent the reader here, when it is
 * one of ours, and the admin otherwise. A reader who came to sign in of their
 * own accord came to use the site, and the admin is where that is done.
 *
 * Judged by the one guard the site has for this, which resolves the value the
 * way a browser would and keeps it only if it lands back on nowhere — so
 * //elsewhere and /\elsewhere, which browsers read as another host, are
 * refused. The guard answers a refusal with the home page, which is right for
 * the pages that share it and wrong here, so an answer of the home page for
 * anything but the home page itself is taken as the refusal it is, and goes to
 * the admin with every other value that names no page.
 *
 * This asks two things of its own before handing over, and sends a reader to
 * the admin rather than tidying either up. A value must begin with a slash,
 * because every page of ours that sends somebody here sends a path and one
 * that did not was written by somebody else. And it must hold no control
 * character: a browser strips those before reading an address, so a slash, a
 * tab and a slash reach it as two slashes, and what the guard would resolve is
 * not what the browser would follow.
 */
// eslint-disable-next-line no-control-regex
const controlCharacters = /[\u0000-\u001f\u007f]/;

const home = "/";
const admin = "/admin/";

export const goBackTo = (given: unknown): string => {
  if (typeof given !== "string") return admin;
  if (!given.startsWith("/")) return admin;
  if (controlCharacters.test(given)) return admin;
  const resolved = safeReturnPath(given);
  return resolved === home && given !== home ? admin : resolved;
};

/** The email address as it is counted: trimmed, and in lower case. */
export const countedAs = (typed: string): string => {
  try {
    return EmailAddress.from(typed).comparable;
  } catch {
    // Not an address at all. Counted as what was typed, trimmed and lowered,
    // so that the same nonsense typed again counts with it.
    return typed.trim().toLowerCase();
  }
};

const sentFrom: SentFrom = "sign-in";

const formFor = (
  speaking: Speaking,
  goBack: string,
  typed: Typed,
  googleOffered: boolean,
): Dialog => ({
  title: speaking.say("signIn.title"),
  action: `${signInPath}?return=${encodeURIComponent(goBack)}`,
  fields: [
    {
      name: "emailAddress",
      label: speaking.say("signIn.emailAddress"),
      type: "email",
      autocomplete: "email",
      value: typed["emailAddress"],
    },
    {
      name: "password",
      label: speaking.say("signIn.password"),
      type: "password",
      autocomplete: "current-password",
    },
  ],
  // Beneath signing in, the way back in first, for a reader whose password
  // does not come, and then the way to make an account, for a reader who has
  // none.
  elsewhere: [
    { label: speaking.say("signIn.forgotPassword"), href: forgotPasswordPath },
    { label: speaking.say("signIn.register"), href: registerPath },
  ],
  submit: speaking.say("signIn.submit"),
  alternative: googleOffered
    ? withGoogle(
        speaking.say("signIn.withGoogle"),
        speaking.say("signIn.or"),
        `${googlePath}?from=${sentFrom}&return=${encodeURIComponent(goBack)}`,
      )
    : undefined,
});

export const registerSignInPage = (
  server: FastifyInstance,
  assets: Assets,
  sessions: Sessions,
  failures: FailedSignIns,
  inTransaction: InTransaction,
  googleOffered: boolean,
): void => {
  const page = (
    request: FastifyRequest,
    dialog: Dialog,
    speaking: Speaking,
  ): string =>
    render(assets, {
      title: speaking.say("signIn.title"),
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: signInPath,
      currentPath: signInPath,
      frame: "bare",
      body: renderDialog(dialog),
    });

  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    speaking: Speaking,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // A page holding what a reader typed is kept by nothing in between; one
      // holding nothing of theirs is theirs alone all the same.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(page(request, dialog, speaking));

  server.get<{ Querystring: { return?: string; refused?: string } }>(
    signInPath,
    (request, reply) => {
      const speaking = speakingOf(request);
      const dialog = formFor(
        speaking,
        goBackTo(request.query.return),
        {},
        googleOffered,
      );
      const refused = request.query.refused;
      if (refused === undefined || !refusalsFromGoogle.includes(refused)) {
        return show(request, reply, dialog, speaking);
      }
      return show(
        request,
        reply,
        { ...dialog, problems: { messages: [speaking.say(refused)] } },
        speaking,
      );
    },
  );

  server.post<{ Querystring: { return?: string } }>(
    signInPath,
    async (request, reply) => {
      const speaking = speakingOf(request);
      const typed = typedFrom(request.body);
      const goBack = goBackTo(request.query.return);
      const dialog = formFor(speaking, goBack, typed, googleOffered);

      const address = countedAs(typed["emailAddress"] ?? "");
      const from = ipAddressOf(request);

      // Counted and written down before the password is checked: being held
      // then costs no hash, the answer comes back in the same time whoever is
      // held, and attempts sent all at once are counted one after another
      // rather than every one of them finding room.
      const attempt = await inTransaction(() =>
        failures.attempt(address, from, request.requestedAt, mostAnHour),
      );
      if (attempt.held) {
        return show(
          request,
          reply,
          {
            ...dialog,
            problems: { messages: [speaking.say("signIn.tryAgainLater")] },
          },
          speaking,
          429,
        );
      }

      try {
        const account = await request.server.mediator.send(
          new SignIn(
            typed["emailAddress"] ?? "",
            typed["password"] ?? "",
            request.requestedAt,
          ),
        );
        await inTransaction(async () => {
          await startSession(request, reply, sessions, account);
          // It worked, so it counts against nothing: a reader who comes back
          // often is not somebody guessing.
          if (attempt.written !== undefined) {
            await failures.itWorked(attempt.written);
          }
        });
      } catch (failure) {
        if (!(failure instanceof SignInRefused)) throw failure;
        // Nothing to write: the attempt was written down before it was tried,
        // and failing is what leaves it standing.
        // Said above the fields rather than beneath one of them: which of the
        // two it was is exactly what is not being said.
        return show(
          request,
          reply,
          refusedForm(
            dialog,
            typed,
            [{ code: failure.code, fields: [] }],
            speaking,
          ),
          speaking,
          422,
        );
      }

      // Nothing of what was typed is left in an address: an email address in a
      // URL ends up in logs and in the browser's history.
      return reply.redirect(goBack, 303);
    },
  );
};
