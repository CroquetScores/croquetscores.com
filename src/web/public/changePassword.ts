// Where a reader signed in changes their password, by giving the one they have
// now and a new one twice. A reader who does not know the one they have now
// is pointed to the forgot password page, which sets one by a link instead.
//
// Asking for the password makes this page a way to guess it, one guess to a
// submission, for whoever holds a browser left signed in; and a password
// guessed here is one that moves the account to another address. So each
// submission is counted toward the limits signing in is held to, against the
// account's address and the IP address it came from, before the password is
// checked, and counts for nothing once the password has matched. An address or
// IP address held by either limit is told to try again later, with nothing
// checked and nothing changed.
//
// Once changed, every session the account has is ended, on every browser, and
// this browser is given a new one: whoever else knew the password should not
// stay in on the strength of it, and the reader who changed it should not be
// signed out for doing so. The reader is taken to their profile.
//
// It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { AccountProfile } from "../../application/operations/accounts/AccountProfile.js";
import { ChangePassword } from "../../application/operations/accounts/ChangePassword.js";
import { ChangePasswordRefused } from "../../application/operations/accounts/ChangePasswordHandler.js";
import type { FailedSignIns } from "../../application/services/FailedSignIns.js";
import type { Sessions } from "../../application/services/Sessions.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { readerOf } from "../common/reader.js";
import { startSession } from "../common/session.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { ipAddressOf } from "../common/trustedProxy.js";
import { profilePath, toSignIn } from "./profile.js";
import { countedAs, mostAnHour } from "./signIn.js";

export const changePasswordPath = "/account/change-password";

const forgotPasswordPath = "/account/forgot-password";

// No password is ever written back into the form, whoever asks: the dialog
// refuses to, and nothing here offers one.
const formFor = (speaking: Speaking, typed: Typed): Dialog => ({
  title: speaking.say("changePassword.title"),
  action: changePasswordPath,
  fields: [
    {
      name: "currentPassword",
      label: speaking.say("changePassword.currentPassword"),
      type: "password",
      autocomplete: "current-password",
      value: typed["currentPassword"],
    },
    {
      name: "password",
      label: speaking.say("changePassword.password"),
      type: "password",
      autocomplete: "new-password",
      value: typed["password"],
    },
    {
      name: "passwordConfirmation",
      label: speaking.say("changePassword.passwordConfirmation"),
      type: "password",
      autocomplete: "new-password",
      value: typed["passwordConfirmation"],
    },
  ],
  elsewhere: [
    {
      label: speaking.say("changePassword.forgotPassword"),
      href: forgotPasswordPath,
    },
  ],
  submit: speaking.say("changePassword.submit"),
});

export const registerChangePasswordPage = (
  server: FastifyInstance,
  assets: Assets,
  sessions: Sessions,
  failures: FailedSignIns,
  inTransaction: InTransaction,
): void => {
  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // Somebody's own, so kept for nobody else.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: dialog.title,
          theme: themeOf(request),
          signedIn: true,
          speaking: speakingOf(request),
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: changePasswordPath,
          currentPath: changePasswordPath,
          frame: "bare",
          body: renderDialog(dialog),
        }),
      );

  server.get(changePasswordPath, (request, reply) => {
    if (readerOf(request) === undefined) return toSignIn(request, reply);
    return show(request, reply, formFor(speakingOf(request), {}));
  });

  server.post(changePasswordPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    // Counted by the account's address, which is what signing in counts by,
    // so that guesses here and at the sign in page share one limit.
    const profile = await request.server.mediator.query(
      new AccountProfile(reader.value),
    );
    if (profile === undefined) return toSignIn(request, reply);

    const speaking = speakingOf(request);
    const typed = typedFrom(request.body);
    const dialog = formFor(speaking, typed);

    const attempt = await inTransaction(() =>
      failures.attempt(
        countedAs(profile.emailAddress),
        ipAddressOf(request),
        request.requestedAt,
        mostAnHour,
      ),
    );
    if (attempt.held) {
      return show(
        request,
        reply,
        {
          ...dialog,
          problems: { messages: [speaking.say("signIn.tryAgainLater")] },
        },
        429,
      );
    }
    // A submission that never got as far as the password it gave, or whose
    // password matched, guessed at nothing, and counts for nothing.
    const forgiven = async (): Promise<void> => {
      const written = attempt.written;
      if (written === undefined) return;
      await inTransaction(() => failures.itWorked(written));
    };

    let account;
    try {
      account = await request.server.mediator.send(
        new ChangePassword(
          reader.value,
          typed["currentPassword"] ?? "",
          typed["password"] ?? "",
          typed["passwordConfirmation"] ?? "",
          speaking.language.tag,
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (failure instanceof ChangePasswordRefused) {
        // Failing is what leaves the attempt standing.
        return show(
          request,
          reply,
          refusedForm(
            dialog,
            typed,
            [{ code: failure.code, fields: ["currentPassword"] }],
            speaking,
          ),
          422,
        );
      }
      if (!(failure instanceof RequestInvalid)) throw failure;
      await forgiven();
      return show(
        request,
        reply,
        refusedForm(dialog, typed, failure.broken, speaking),
        422,
      );
    }

    await forgiven();
    await inTransaction(async () => {
      await sessions.endEveryOneFor(account);
      await startSession(request, reply, sessions, account);
    });
    return reply.redirect(profilePath, 303);
  });
};
