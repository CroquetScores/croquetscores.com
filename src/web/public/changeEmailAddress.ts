// Where a reader signed in moves their account to another email address, asked
// for and then confirmed.
//
// The asking is this page without a link: the address to move to, and the
// password the account has now, since a browser left signed in would otherwise
// let whoever picked it up move the account to an address of their own. It
// sends a link to the new address and says to check their email there, and
// says the same whoever the address belongs to.
// A reader whose account has no password, having only ever signed in with
// Google, has none to give, and finds no page here at all, opened or posted to.
//
// The confirming is the link, which opens this page again. Following it moves
// nothing by itself: it says where the account will move to, with a button
// that moves it, since mail systems follow the links in an email to check them
// before anybody reads it. What the link is worth is asked before the button
// is shown, and moving asks the same question of the same place, so the page
// and the answer cannot disagree.
//
// Asking for the password makes the asking a way to guess it, so each asking
// is counted toward the limits signing in is held to, as changing the password
// counts it: were it counted on that page and not this one, guessing would
// simply move here. It is counted before the password is checked, and counts
// for nothing once the password has matched or was never reached.
//
// Every part of it needs somebody signed in, and a reader who is not is sent
// to sign in and brought back, link and all. It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { AskToChangeEmailAddress } from "../../application/operations/accounts/AskToChangeEmailAddress.js";
import { ChangeEmailAddress } from "../../application/operations/accounts/ChangeEmailAddress.js";
import { ChangeEmailAddressRefused } from "../../application/operations/accounts/ChangeEmailAddressRefused.js";
import { AccountProfile } from "../../application/operations/accounts/AccountProfile.js";
import { WhatAMovingLinkIsWorth } from "../../application/operations/accounts/WhatAMovingLinkIsWorth.js";
import type { FailedSignIns } from "../../application/services/FailedSignIns.js";
import type { Assets } from "../common/assets.js";
import type { InTransaction } from "../common/database.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { ipAddressOf } from "../common/trustedProxy.js";
import { profilePath, toSignIn } from "./profile.js";
import { countedAs, mostAnHour } from "./signIn.js";

export const changeEmailAddressPath = "/account/change-email-address";

/** What a reader is told when there is nothing to press. */
interface Said {
  readonly title: string;
  readonly explanation: string;
}

const askingFor = (speaking: Speaking, typed: Typed): Dialog => ({
  title: speaking.say("changeEmailAddress.title"),
  action: changeEmailAddressPath,
  fields: [
    {
      name: "emailAddress",
      label: speaking.say("changeEmailAddress.emailAddress"),
      type: "email",
      autocomplete: "email",
      value: typed["emailAddress"],
    },
    {
      name: "currentPassword",
      label: speaking.say("changeEmailAddress.currentPassword"),
      type: "password",
      autocomplete: "current-password",
    },
  ],
  submit: speaking.say("changeEmailAddress.submit"),
});

// The link travels in the form's own address, as it does on the other pages a
// link opens: it is not a secret the page is keeping from the reader who
// followed it, and it names no address.
const confirmingFor = (
  speaking: Speaking,
  carried: string,
  emailAddress: string,
): Dialog => ({
  title: speaking.say("changeEmailAddress.confirm.title"),
  action: `${changeEmailAddressPath}?link=${carried}`,
  fields: [],
  notice: speaking.say("changeEmailAddress.confirm.explanation", {
    emailAddress,
  }),
  submit: speaking.say("changeEmailAddress.confirm.submit"),
});

const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];

export const registerChangeEmailAddressPage = (
  server: FastifyInstance,
  assets: Assets,
  failures: FailedSignIns,
  inTransaction: InTransaction,
): void => {
  const page = (
    request: FastifyRequest,
    reply: FastifyReply,
    title: string,
    body: string,
    frame?: "bare",
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // Somebody's own, every answer of it, so none is kept for anybody else.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title,
          theme: themeOf(request),
          signedIn: true,
          hasPassword: hasPassword(request),
          speaking: speakingOf(request),
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: changeEmailAddressPath,
          currentPath: changeEmailAddressPath,
          ...(frame === undefined ? {} : { frame }),
          body,
        }),
      );

  const showing = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    page(request, reply, dialog.title, renderDialog(dialog), "bare", code);

  const telling = (
    request: FastifyRequest,
    reply: FastifyReply,
    said: Said,
  ): FastifyReply =>
    page(
      request,
      reply,
      said.title,
      `          <h1>${escape(said.title)}</h1>
          <p>${escape(said.explanation)}</p>
          <p><a href="${profilePath}">${escape(speakingOf(request).say("changeEmailAddress.profile"))}</a></p>`,
    );

  const noLongerWorks = (speaking: Speaking): Said => ({
    title: speaking.say("changeEmailAddress.noLongerWorks.title"),
    explanation: speaking.say("changeEmailAddress.noLongerWorks.explanation"),
  });

  server.get(changeEmailAddressPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    if (!hasPassword(request)) return reply.callNotFound();

    const speaking = speakingOf(request);
    const carried = carriedIn(request);
    if (carried === undefined) {
      return showing(request, reply, askingFor(speaking, {}));
    }

    const worth = await request.server.mediator.query(
      new WhatAMovingLinkIsWorth(
        request.url,
        reader.value,
        request.requestedAt,
      ),
    );
    return worth.worth === "Link.Works"
      ? showing(
          request,
          reply,
          confirmingFor(speaking, carried, worth.emailAddress),
        )
      : telling(request, reply, noLongerWorks(speaking));
  });

  server.post(changeEmailAddressPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    if (!hasPassword(request)) return reply.callNotFound();
    const speaking = speakingOf(request);

    if (carriedIn(request) === undefined) {
      // Counted by the account's address, which is what signing in counts by,
      // so that guesses here and at the other pages share one limit.
      const profile = await request.server.mediator.query(
        new AccountProfile(reader.value),
      );
      if (profile === undefined) return toSignIn(request, reply);

      const typed = typedFrom(request.body);
      const dialog = askingFor(speaking, typed);

      const attempt = await inTransaction(() =>
        failures.attempt(
          countedAs(profile.emailAddress),
          ipAddressOf(request),
          request.requestedAt,
          mostAnHour,
        ),
      );
      if (attempt.held) {
        return showing(
          request,
          reply,
          {
            ...dialog,
            problems: { messages: [speaking.say("signIn.tryAgainLater")] },
          },
          429,
        );
      }
      // An asking that never got as far as the password it gave, or whose
      // password matched, guessed at nothing, and counts for nothing.
      const forgiven = async (): Promise<void> => {
        const written = attempt.written;
        if (written === undefined) return;
        await inTransaction(() => failures.itWorked(written));
      };

      try {
        await request.server.mediator.send(
          new AskToChangeEmailAddress(
            reader.value,
            typed["emailAddress"] ?? "",
            typed["currentPassword"] ?? "",
            speaking.language.tag,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (failure instanceof ChangeEmailAddressRefused) {
          // Failing on the password is what leaves the attempt standing.
          if (failure.code !== "ChangeEmailAddress.WrongPassword") {
            await forgiven();
          }
          // Each said beneath the field it is about: a wrong password beneath
          // the password, and the account's own address beneath the address.
          const field =
            failure.code === "ChangeEmailAddress.WrongPassword"
              ? "currentPassword"
              : "emailAddress";
          return showing(
            request,
            reply,
            refusedForm(
              dialog,
              typed,
              [{ code: failure.code, fields: [field] }],
              speaking,
            ),
            422,
          );
        }
        if (!(failure instanceof RequestInvalid)) throw failure;
        await forgiven();
        return showing(
          request,
          reply,
          refusedForm(dialog, typed, failure.broken, speaking),
          422,
        );
      }
      await forgiven();
      return telling(request, reply, {
        title: speaking.say("changeEmailAddress.sent.title"),
        explanation: speaking.say("changeEmailAddress.sent.explanation"),
      });
    }

    try {
      await request.server.mediator.send(
        new ChangeEmailAddress(
          request.url,
          reader.value,
          speaking.language.tag,
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (!(failure instanceof ChangeEmailAddressRefused)) throw failure;
      if (failure.code === "ChangeEmailAddress.Taken") {
        return telling(request, reply, {
          title: speaking.say("changeEmailAddress.taken.title"),
          explanation: speaking.say("ChangeEmailAddress.Taken"),
        });
      }
      return telling(request, reply, noLongerWorks(speaking));
    }
    return reply.redirect(profilePath, 303);
  });
};
