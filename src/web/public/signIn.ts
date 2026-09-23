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
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { startSession } from "../common/session.js";
import { safeReturnPath, themeOf } from "../common/theme.js";
import { ipAddressOf } from "../common/trustedProxy.js";

export const signInPath = "/account/sign-in";

const forgotPasswordPath = "/account/forgot-password";
const registerPath = "/account/register";

/** How many times an email address, and one IP address, may fail in an hour. */
const mostAnHour: MostAnHour = { byEmailAddress: 10, byIpAddress: 30 };

/**
 * Where to go once signed in: the path that sent the reader here, when it is
 * one of ours, and the home page otherwise.
 *
 * Judged by the one guard the site has for this, which resolves the value the
 * way a browser would and keeps it only if it lands back on nowhere — so
 * //elsewhere and /\elsewhere, which browsers read as another host, go home.
 *
 * This asks two things of its own before handing over, and sends a reader home
 * rather than tidying either up. A value must begin with a slash, because
 * every page of ours that sends somebody here sends a path and one that did
 * not was written by somebody else. And it must hold no control character: a
 * browser strips those before reading an address, so a slash, a tab and a
 * slash reach it as two slashes, and what the guard would resolve is not what
 * the browser would follow.
 */
// eslint-disable-next-line no-control-regex
const controlCharacters = /[\u0000-\u001f\u007f]/;

export const goBackTo = (given: unknown): string => {
  if (typeof given !== "string") return "/";
  if (!given.startsWith("/")) return "/";
  if (controlCharacters.test(given)) return "/";
  return safeReturnPath(given);
};

/** The email address as it is counted: trimmed, and in lower case. */
const countedAs = (typed: string): string => {
  try {
    return EmailAddress.from(typed).comparable;
  } catch {
    // Not an address at all. Counted as what was typed, trimmed and lowered,
    // so that the same nonsense typed again counts with it.
    return typed.trim().toLowerCase();
  }
};

const formFor = (speaking: Speaking, goBack: string, typed: Typed): Dialog => ({
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
      value: typed["password"],
    },
  ],
  cancel: { label: speaking.say("signIn.cancel"), href: "/" },
  submit: speaking.say("signIn.submit"),
});

// The ways on from here, beneath the form: a reader who cannot sign in either
// has no account or cannot remember their password, and both are pages of
// their own.
const elsewhere = (speaking: Speaking): string =>
  `        <nav class="dialog-elsewhere" aria-label="${escape(speaking.say("signIn.elsewhere"))}">
          <p><a href="${forgotPasswordPath}">${escape(speaking.say("signIn.forgotPassword"))}</a></p>
          <p><a href="${registerPath}">${escape(speaking.say("signIn.register"))}</a></p>
        </nav>`;

export const registerSignInPage = (
  server: FastifyInstance,
  assets: Assets,
  sessions: Sessions,
  failures: FailedSignIns,
  inTransaction: InTransaction,
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
      speaking,
      siteName: siteNameOf(request),
      path: signInPath,
      currentPath: signInPath,
      frame: "bare",
      body: `${renderDialog(dialog)}\n${elsewhere(speaking)}`,
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

  server.get<{ Querystring: { return?: string } }>(
    signInPath,
    (request, reply) => {
      const speaking = speakingOf(request);
      return show(
        request,
        reply,
        formFor(speaking, goBackTo(request.query.return), {}),
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
      const dialog = formFor(speaking, goBack, typed);

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
