// Where a reader who cannot sign in asks for a way back in.
//
// It asks for an email address, and answers everybody the same: an email is on
// its way. What is sent depends on whom the address belongs to, and only its
// owner reads it (ResetPassword.feature), so nothing here looks at what was
// sent, and the address never goes into an address a browser keeps.
//
// Asking is limited by the address it came from, so that the page cannot be
// used to try address after address: past the limit the reader is told to try
// again later. How often an address is written to is limited too, but that is
// the operation's, and past it the page says what it always says.
//
// It needs no scripting and nobody signed in.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ResetPassword } from "../../application/operations/accounts/ResetPassword.js";
import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import type { PasswordResetAskings } from "../../application/services/PasswordResetAskings.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { themeOf } from "../common/theme.js";
import { ipAddressOf } from "../common/trustedProxy.js";

export const forgotPasswordPath = "/account/forgot-password";

/** How many times one IP address may ask, per hour. */
const ASKINGS_AN_HOUR = 10;

// The request id travels in the form's own address, minted when the form is
// shown, so that a form sent twice — pressed twice, or gone back to and pressed
// again — asks once.
const formFor = (
  speaking: Speaking,
  requestId: string,
  typed: Typed,
): Dialog => ({
  title: speaking.say("forgotPassword.title"),
  action: `${forgotPasswordPath}?request=${encodeURIComponent(requestId)}`,
  fields: [
    {
      name: "emailAddress",
      label: speaking.say("forgotPassword.emailAddress"),
      type: "email",
      autocomplete: "email",
      value: typed["emailAddress"],
    },
  ],
  cancel: { label: speaking.say("forgotPassword.cancel"), href: "/" },
  submit: speaking.say("forgotPassword.submit"),
});

export const registerForgotPasswordPage = (
  server: FastifyInstance,
  assets: Assets,
  askings: PasswordResetAskings,
  inTransaction: InTransaction,
): void => {
  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    body: string,
    speaking: Speaking,
    code = 200,
    frame: "bare" | undefined = "bare",
  ): FastifyReply =>
    reply
      .code(code)
      // A page holding what a reader typed is kept by nothing in between.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: speaking.say("forgotPassword.title"),
          theme: themeOf(request),
          signedIn: signedIn(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: forgotPasswordPath,
          currentPath: forgotPasswordPath,
          ...(frame === undefined ? {} : { frame }),
          body,
        }),
      );

  server.get(forgotPasswordPath, (request, reply) => {
    const speaking = speakingOf(request);
    return show(
      request,
      reply,
      renderDialog(formFor(speaking, randomUUID(), {})),
      speaking,
    );
  });

  server.post<{ Querystring: { request?: string } }>(
    forgotPasswordPath,
    async (request, reply) => {
      const speaking = speakingOf(request);
      const typed = typedFrom(request.body);
      // An id given blank, or twice, is not one the form minted; an asking
      // without one is nobody's retry, and gets an id of its own.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();
      const dialog = formFor(speaking, requestId, typed);

      // Counted before anything is sent, and written down as it is made, so that
      // askings sent all at once are counted one after another.
      const letThrough = await inTransaction(() =>
        askings.ask(ipAddressOf(request), request.requestedAt, ASKINGS_AN_HOUR),
      );
      if (!letThrough) {
        return show(
          request,
          reply,
          renderDialog({
            ...dialog,
            problems: {
              messages: [speaking.say("forgotPassword.tryAgainLater")],
              autofocus: true,
            },
          }),
          speaking,
          429,
        );
      }

      try {
        await request.server.mediator.send(
          new ResetPassword(
            requestId,
            typed["emailAddress"] ?? "",
            speaking.language.tag,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (!(failure instanceof RequestInvalid)) throw failure;
        return show(
          request,
          reply,
          renderDialog(refusedForm(dialog, typed, failure.broken, speaking)),
          speaking,
          422,
        );
      }

      // The same words whoever the address belongs to, and nothing of the
      // address on the page or in the address it is reached at.
      const { say } = speaking;
      return show(
        request,
        reply,
        `          <h1>${escape(say("forgotPassword.sent.title"))}</h1>
          <p>${escape(say("forgotPassword.sent.explanation"))}</p>
          <p><a href="/">${escape(say("forgotPassword.home", { siteName: siteNameOf(request) }))}</a></p>`,
        speaking,
        200,
        undefined,
      );
    },
  );
};
