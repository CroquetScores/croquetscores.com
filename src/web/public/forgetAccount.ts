// Where a reader signed in has their account forgotten, asked for twice over
// because it cannot be undone.
//
// The first asking is this page without a link: it emails a link to the
// account's own address, so that whoever asks has to be able to read the
// account's email as well as be signed in to it. The second is that link,
// which opens this page again.
//
// Following the link forgets nothing by itself. It shows what forgetting means,
// with a button that does it: mail systems follow the links in an email to
// check them before anybody reads it, and a link that forgot an account when it
// was followed would forget it before its owner had seen the email. What the
// link is worth is asked before the button is shown, and forgetting asks the
// same question of the same place, so the page and the answer cannot disagree.
//
// Every part of it needs somebody signed in, and a reader who is not is sent to
// sign in and brought back, link and all. Forgetting ends every session the
// account has, on every device, since nobody can sign in to it again.
//
// It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AskToForgetAccount } from "../../application/operations/accounts/AskToForgetAccount.js";
import { ForgetAccount } from "../../application/operations/accounts/ForgetAccount.js";
import { ForgettingRefused } from "../../application/operations/accounts/ForgetAccountHandler.js";
import { WhatAForgettingLinkIsWorth } from "../../application/operations/accounts/WhatAForgettingLinkIsWorth.js";
import type { Sessions } from "../../application/services/Sessions.js";
import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { readerOf, signedIn } from "../common/reader.js";
import { endSession } from "../common/session.js";
import { themeOf } from "../common/theme.js";
import { signInPath } from "./signIn.js";

export const forgetAccountPath = "/account/forget-account";

/** What a reader is told when there is nothing to press. */
interface Said {
  readonly title: string;
  readonly explanation: string;
  readonly onwards?: { readonly href: string; readonly label: string };
}

const askingFor = (speaking: Speaking): Dialog => ({
  title: speaking.say("forgetAccount.title"),
  action: forgetAccountPath,
  fields: [],
  notice: speaking.say("forgetAccount.explanation"),
  cancel: { label: speaking.say("forgetAccount.cancel"), href: "/" },
  submit: speaking.say("forgetAccount.submit"),
});

// The link travels in the form's own address, as it does on the other pages a
// link opens: it is not a secret the page is keeping from the reader who
// followed it.
const confirmingFor = (speaking: Speaking, carried: string): Dialog => ({
  title: speaking.say("forgetAccount.confirm.title"),
  action: `${forgetAccountPath}?link=${carried}`,
  fields: [],
  notice: speaking.say("forgetAccount.confirm.explanation"),
  cancel: { label: speaking.say("forgetAccount.cancel"), href: "/" },
  submit: speaking.say("forgetAccount.confirm.submit"),
});

const noLongerWorks = (speaking: Speaking): Said => ({
  title: speaking.say("forgetAccount.noLongerWorks.title"),
  explanation: speaking.say("forgetAccount.noLongerWorks.explanation"),
  onwards: {
    href: forgetAccountPath,
    label: speaking.say("forgetAccount.askAgain"),
  },
});

const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];

// Back to where the reader was going, link and all, once they have signed in.
const toSignIn = (request: FastifyRequest, reply: FastifyReply) =>
  reply.redirect(
    `${signInPath}?return=${encodeURIComponent(request.url)}`,
    303,
  );

export const registerForgetAccountPage = (
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
      path: forgetAccountPath,
      currentPath: forgetAccountPath,
      ...(frame === undefined ? {} : { frame }),
      body,
    });

  // Somebody's own, every answer of it, so none is kept for anybody else.
  const sent = (reply: FastifyReply) =>
    reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8");

  const telling = (
    request: FastifyRequest,
    reply: FastifyReply,
    said: Said,
    signedOut = false,
  ): FastifyReply => {
    const home = speakingOf(request).say("forgetAccount.home", {
      siteName: siteNameOf(request),
    });
    const onwards =
      said.onwards === undefined
        ? ""
        : `\n          <p><a href="${escape(said.onwards.href)}">${escape(said.onwards.label)}</a></p>`;
    return sent(reply).send(
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

  const showing = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
  ): FastifyReply =>
    sent(reply).send(page(request, renderDialog(dialog), dialog.title, "bare"));

  server.get(forgetAccountPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);

    const speaking = speakingOf(request);
    const carried = carriedIn(request);
    if (carried === undefined) {
      return showing(request, reply, askingFor(speaking));
    }

    const worth = await request.server.mediator.query(
      new WhatAForgettingLinkIsWorth(
        request.url,
        reader.value,
        request.requestedAt,
      ),
    );
    return worth === "Link.Works"
      ? showing(request, reply, confirmingFor(speaking, carried))
      : telling(request, reply, noLongerWorks(speaking));
  });

  server.post(forgetAccountPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);

    const speaking = speakingOf(request);
    if (carriedIn(request) === undefined) {
      await request.server.mediator.send(
        new AskToForgetAccount(
          reader.value,
          speaking.language.tag,
          request.requestedAt,
        ),
      );
      return telling(request, reply, {
        title: speaking.say("forgetAccount.sent.title"),
        explanation: speaking.say("forgetAccount.sent.explanation"),
      });
    }

    let forgotten: AccountId;
    try {
      forgotten = await request.server.mediator.send(
        new ForgetAccount(request.url, reader.value, request.requestedAt),
      );
    } catch (failure) {
      if (failure instanceof ForgettingRefused) {
        return telling(request, reply, noLongerWorks(speaking));
      }
      throw failure;
    }

    // Every session the account has, on every device, including this one:
    // nobody can sign in to it again, and a browser still holding a session for
    // it should not look as though it were.
    await inTransaction(async () => {
      await sessions.endEveryOneFor(forgotten);
      await endSession(request, reply, sessions);
    });

    return telling(
      request,
      reply,
      {
        title: speaking.say("forgetAccount.forgotten.title"),
        explanation: speaking.say("forgetAccount.forgotten.explanation"),
      },
      true,
    );
  });
};
