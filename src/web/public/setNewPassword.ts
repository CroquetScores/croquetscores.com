// Where the link a reader was emailed to get back in opens, and where they
// choose a new password.
//
// What the link is worth is asked before the form is shown, so that a reader
// whose link has expired, or has already been used, is told so on arrival
// rather than after choosing a password that was never going to be kept.
// Setting the password asks the same question of the same place, so the page a
// reader was shown and the answer their submission gets cannot disagree.
//
// Setting a new password ends every session the account has, on every device:
// a reader may be setting one because somebody else got in, and somebody else
// would otherwise stay in. The reader who set it is signed out with the rest,
// and pointed to sign in with what they have just chosen.
//
// It needs no scripting and nobody signed in.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { SetNewPassword } from "../../application/operations/accounts/SetNewPassword.js";
import { SettingRefused } from "../../application/operations/accounts/SetNewPasswordHandler.js";
import { WhatASetNewPasswordLinkIsWorth } from "../../application/operations/accounts/WhatASetNewPasswordLinkIsWorth.js";
import type { SetNewPasswordLinkWorth } from "../../application/operations/accounts/setNewPasswordLinks.js";
import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { CheckRefused } from "../../application/services/BreachedPasswords.js";
import type { Sessions } from "../../application/services/Sessions.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { endSession } from "../common/session.js";
import { reportUnreachable } from "../common/unreachableServices.js";
import { themeOf } from "../common/theme.js";
import { forgotPasswordPath } from "./forgotPassword.js";
import { signInPath } from "./signIn.js";

export const setNewPasswordPath = "/account/set-new-password";

/** What a reader is told when there is nothing to fill in. */
interface Said {
  readonly title: string;
  readonly explanation: string;
  readonly onwards?: { readonly href: string; readonly label: string };
}

const saidFor = (
  worth: Exclude<SetNewPasswordLinkWorth, "Link.Works">,
  speaking: Speaking,
): Said => {
  const { say } = speaking;
  return worth === "Link.Expired"
    ? {
        // An expired link can be traded for a new one by asking again, which
        // is what the forgot password page is for.
        title: say("setNewPassword.expired.title"),
        explanation: say("setNewPassword.expired.explanation"),
        onwards: {
          href: forgotPasswordPath,
          label: say("setNewPassword.askAgain"),
        },
      }
    : {
        title: say("setNewPassword.noLongerWorks.title"),
        explanation: say("setNewPassword.noLongerWorks.explanation"),
        onwards: {
          href: forgotPasswordPath,
          label: say("setNewPassword.askAgain"),
        },
      };
};

// The link and the request id travel in the form's own address, as they do on
// the page a confirmation link opens: neither is a secret the page is keeping,
// and the id is minted when the form is shown so that a submission sent twice
// sets one password.
const formFor = (
  speaking: Speaking,
  carried: string,
  requestId: string,
  typed: Typed,
): Dialog => ({
  title: speaking.say("setNewPassword.title"),
  action: `${setNewPasswordPath}?link=${carried}&request=${encodeURIComponent(requestId)}`,
  fields: [
    {
      name: "password",
      label: speaking.say("setNewPassword.password"),
      type: "password",
      autocomplete: "new-password",
      value: typed["password"],
    },
    {
      name: "passwordConfirmation",
      label: speaking.say("setNewPassword.confirmPassword"),
      type: "password",
      autocomplete: "new-password",
      value: typed["passwordConfirmation"],
    },
  ],
  cancel: { label: speaking.say("setNewPassword.cancel"), href: "/" },
  submit: speaking.say("setNewPassword.submit"),
});

const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];

export const registerSetNewPasswordPage = (
  server: FastifyInstance,
  assets: Assets,
  sessions: Sessions,
  inTransaction: InTransaction,
): void => {
  const page = (
    request: FastifyRequest,
    body: string,
    title: string,
    frame?: "bare",
    signedOut = false,
  ): string =>
    render(assets, {
      title,
      theme: themeOf(request),
      // Who the reader was is read as the request arrives, and a reader whose
      // sessions this request ended is not signed in to anything any more.
      signedIn: !signedOut && signedIn(request),
      speaking: speakingOf(request),
      siteName: siteNameOf(request),
      path: setNewPasswordPath,
      currentPath: setNewPasswordPath,
      ...(frame === undefined ? {} : { frame }),
      body,
    });

  const telling = (
    request: FastifyRequest,
    reply: FastifyReply,
    said: Said,
    signedOut = false,
  ): FastifyReply => {
    const home = speakingOf(request).say("setNewPassword.home", {
      siteName: siteNameOf(request),
    });
    const onwards =
      said.onwards === undefined
        ? ""
        : `\n          <p><a href="${escape(said.onwards.href)}">${escape(said.onwards.label)}</a></p>`;
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        page(
          request,
          `          <h1>${escape(said.title)}</h1>
          <p>${escape(said.explanation)}</p>${onwards}
          <p><a href="/">${escape(home)}</a></p>`,
          said.title,
          undefined,
          signedOut,
        ),
      );
  };

  const showForm = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(page(request, renderDialog(dialog), dialog.title, "bare"));

  server.get(setNewPasswordPath, async (request, reply) => {
    // A reader with no link has not come from an email, and there is nothing
    // here for them: the way on is to ask for one.
    const carried = carriedIn(request);
    if (carried === undefined) return reply.redirect(forgotPasswordPath, 303);

    const speaking = speakingOf(request);
    const worth = await request.server.mediator.query(
      new WhatASetNewPasswordLinkIsWorth(request.url, request.requestedAt),
    );
    if (worth !== "Link.Works") {
      return telling(request, reply, saidFor(worth, speaking));
    }
    return showForm(
      request,
      reply,
      formFor(speaking, carried, randomUUID(), {}),
    );
  });

  server.post<{ Querystring: { request?: string } }>(
    setNewPasswordPath,
    async (request, reply) => {
      const carried = carriedIn(request);
      if (carried === undefined) {
        return reply.redirect(forgotPasswordPath, 303);
      }

      const speaking = speakingOf(request);
      const typed = typedFrom(request.body);
      // An id given blank, or twice, is not one the form minted; a submission
      // without one is nobody's retry, and gets an id of its own.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();
      const dialog = formFor(speaking, carried, requestId, typed);

      let account;
      try {
        account = await request.server.mediator.send(
          new SetNewPassword(
            requestId,
            request.url,
            typed["password"] ?? "",
            typed["passwordConfirmation"] ?? "",
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (failure instanceof RequestInvalid) {
          return showForm(
            request,
            reply,
            refusedForm(dialog, typed, failure.broken, speaking),
            422,
          );
        }
        // Nobody could say whether the password has been breached, so it is
        // not set, and the reader is told so above the fields. The link is not
        // spent by it, so trying again later needs no new one.
        if (failure instanceof CheckRefused) {
          await reportUnreachable(request, "Have I Been Pwned");
          return showForm(
            request,
            reply,
            {
              ...dialog,
              problems: {
                messages: [speaking.say(failure.code)],
                autofocus: true,
              },
            },
            503,
          );
        }
        if (failure instanceof SettingRefused) {
          return telling(request, reply, saidFor(failure.code, speaking));
        }
        throw failure;
      }

      // Every session the account has, on every device, including whichever
      // this reader was in: they sign in with what they have just chosen.
      await inTransaction(async () => {
        await sessions.endEveryOneFor(account);
        await endSession(request, reply, sessions);
      });

      return telling(
        request,
        reply,
        {
          title: speaking.say("setNewPassword.changed.title"),
          explanation: speaking.say("setNewPassword.changed.explanation"),
          onwards: {
            href: signInPath,
            label: speaking.say("setNewPassword.signIn"),
          },
        },
        true,
      );
    },
  );
};
