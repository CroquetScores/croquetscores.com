// Where the link registering emails is followed, and where the account gets
// its name and its password.
//
// Following the link confirms nothing. Mail systems follow the links in an
// email to check them before anybody reads it, and a link that confirmed when
// it was followed would confirm an address whose owner never saw the email —
// and anybody can register with somebody else's address. So the link opens a
// form, and submitting it is what confirms.
//
// The form asks for a name and a password because registering asks for
// neither: whoever registers has not yet shown the address is theirs, so an
// account is named, and given its password, by whoever turns out to read mail
// at the address. That is confirming's decision rather than this page's
// (ConfirmEmailAddress.feature); the page is the two ends of it.
//
// What the link is worth is asked before the form is shown, and the answer
// decides which page arrives. A reader whose link expired while the email sat
// unread is owed that on arrival rather than after filling in a name and a
// password that were never going to be kept. Asking and confirming ask the
// same question of the same place, so the page a reader was shown and the
// answer their submission gets cannot disagree.
//
// It needs no scripting and nobody signed in, and confirming signs nobody in:
// the link is often opened on another device from the one registered on, and
// whoever follows it has shown only that they read mail at the address.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ConfirmEmailAddress } from "../../application/operations/accounts/ConfirmEmailAddress.js";
import { ConfirmingRefused } from "../../application/operations/accounts/ConfirmEmailAddressHandler.js";
import { WhatAConfirmationLinkIsWorth } from "../../application/operations/accounts/WhatAConfirmationLinkIsWorth.js";
import type { ConfirmationLinkWorth } from "../../application/operations/accounts/confirmationLinks.js";
import { CheckRefused } from "../../application/services/BreachedPasswords.js";
import type { Assets } from "../common/assets.js";
// Where a reader is sent or pointed from here, from the pages themselves, so
// that a page that moves takes every way to it along.
import { newConfirmationLinkPath } from "./newConfirmationLink.js";
import { signInPath } from "./signIn.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { submitForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { themeOf } from "../common/theme.js";
import { reportUnreachable } from "../common/unreachableServices.js";

export const confirmEmailAddressPath = "/account/confirm-email-address";

/** What a reader is told when the link is worth nothing to fill in. */
interface Said {
  readonly title: string;
  readonly explanation: string;
  /** Where to go next, when there is somewhere worth going. */
  readonly onwards?: { readonly href: string; readonly label: string };
}

const saidFor = (
  worth: Exclude<ConfirmationLinkWorth, "Link.Works">,
  speaking: Speaking,
  carried: string,
): Said => {
  const { say } = speaking;
  switch (worth) {
    case "Link.Expired":
      // The one refusal that is not the end of it: an expired link still shows
      // which account it was sent for, and can be traded for a new one.
      return {
        title: say("confirmEmailAddress.expired.title"),
        explanation: say("confirmEmailAddress.expired.explanation"),
        onwards: {
          // Carrying the link, which is what says which account a new one is
          // for: the page it leads to has nothing else to go on.
          href: `${newConfirmationLinkPath}?link=${carried}`,
          label: say("confirmEmailAddress.expired.newLink"),
        },
      };
    case "Account.AlreadyConfirmed":
      return {
        title: say("confirmEmailAddress.alreadyConfirmed.title"),
        explanation: say("confirmEmailAddress.alreadyConfirmed.explanation"),
        onwards: {
          href: signInPath,
          label: say("confirmEmailAddress.signIn"),
        },
      };
    case "Link.NoLongerWorks":
      // Nothing is offered, because there is nothing to be had: a link that was
      // altered, or made up, or is for an account that has been forgotten,
      // names nothing anybody can trade it for. Offering a new one would be
      // offering to send an email to an account this cannot name.
      return {
        title: say("confirmEmailAddress.noLongerWorks.title"),
        explanation: say("confirmEmailAddress.noLongerWorks.explanation"),
      };
  }
};

// Every page here is the shell with a body in it, and every one of them depends
// on the theme and language cookies and the languages the browser asks for, as
// each public page does. A page holding what a reader typed says so instead,
// and is kept by nothing in between.
const pageOf = (
  assets: Assets,
  request: FastifyRequest,
  body: string,
  title: string,
  frame?: "bare",
): string =>
  render(assets, {
    title,
    theme: themeOf(request),
    signedIn: signedIn(request),
    speaking: speakingOf(request),
    siteName: siteNameOf(request),
    tryWebsite: websiteOf(request).isTry,
    path: confirmEmailAddressPath,
    currentPath: confirmEmailAddressPath,
    ...(frame === undefined ? {} : { frame }),
    body,
  });

const telling = (
  assets: Assets,
  request: FastifyRequest,
  reply: FastifyReply,
  said: Said,
): FastifyReply => {
  const onwards =
    said.onwards === undefined
      ? ""
      : `\n          <p><a href="${escape(said.onwards.href)}">${escape(said.onwards.label)}</a></p>`;
  const home = speakingOf(request).say("confirmEmailAddress.home", {
    siteName: siteNameOf(request),
  });

  return reply
    .header("cache-control", "private, no-cache")
    .header("vary", "Cookie, Accept-Language")
    .type("text/html; charset=utf-8")
    .send(
      pageOf(
        assets,
        request,
        `          <h1>${escape(said.title)}</h1>
          <p>${escape(said.explanation)}</p>${onwards}
          <p><a href="/">${escape(home)}</a></p>`,
        said.title,
      ),
    );
};

// The link and the request id travel in the form's own address rather than in
// hidden fields, because a dialog has no hidden fields and neither is a secret
// the page is keeping: the link is already in the address the reader followed.
// The id is minted when the form is shown, so a submission sent twice — a
// double press, a retry — carries the one id and confirms once.
//
// What is carried over is the link's own characters, exactly as they arrived,
// so that the submission's address is another address carrying that link rather
// than an address with an address inside it: what reads a link takes the part
// it signed out of the address by name, and would find the spelling changed.
const actionFor = (carried: string, requestId: string): string =>
  `${confirmEmailAddressPath}?link=${carried}&request=${encodeURIComponent(requestId)}`;

const formFor = (
  speaking: Speaking,
  carried: string,
  requestId: string,
  typed: Typed,
): Dialog => ({
  title: speaking.say("confirmEmailAddress.title"),
  action: actionFor(carried, requestId),
  fields: [
    {
      name: "name",
      label: speaking.say("confirmEmailAddress.name"),
      type: "text",
      autocomplete: "name",
      value: typed["name"],
    },
    {
      name: "password",
      label: speaking.say("confirmEmailAddress.password"),
      type: "password",
      // A password being made rather than one being given back, so that a
      // password manager offers to make one instead of offering the last one
      // it kept.
      autocomplete: "new-password",
    },
    {
      name: "passwordConfirmation",
      label: speaking.say("confirmEmailAddress.confirmPassword"),
      type: "password",
      autocomplete: "new-password",
    },
  ],
  submit: speaking.say("confirmEmailAddress.submit"),
});

// What the reader followed, as it reached us. The whole address rather than the
// link's own characters, because what reads a link takes the part it signed out
// of the address by name, and is the only thing that knows how.
const linkFollowed = (request: FastifyRequest): string => request.url;

// The link's own characters out of the address it arrived in, which is what the
// form carries over to the submission. Found by name wherever it sits, as what
// reads a link finds it.
const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];

const worthOf = (request: FastifyRequest): Promise<ConfirmationLinkWorth> =>
  request.server.mediator.query(
    new WhatAConfirmationLinkIsWorth(
      linkFollowed(request),
      request.requestedAt,
    ),
  );

export const registerConfirmEmailAddressPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Querystring: { request?: string } }>(
    confirmEmailAddressPath,
    async (request, reply) => {
      // A reader with no link is one who has not come from an email. Where
      // signing in sends a reader whose address is not yet confirmed is
      // specified with this page and not built, and until it is, the way on
      // from here is the way in.
      const carried = carriedIn(request);
      if (carried === undefined) return reply.redirect(signInPath, 303);

      const speaking = speakingOf(request);
      const worth = await worthOf(request);
      if (worth !== "Link.Works") {
        return telling(
          assets,
          request,
          reply,
          saidFor(worth, speaking, carried),
        );
      }

      return reply
        .header("cache-control", "private, no-cache")
        .header("vary", "Cookie, Accept-Language")
        .type("text/html; charset=utf-8")
        .send(
          pageOf(
            assets,
            request,
            renderDialog(formFor(speaking, carried, randomUUID(), {})),
            speaking.say("confirmEmailAddress.title"),
            "bare",
          ),
        );
    },
  );

  server.post<{ Querystring: { request?: string } }>(
    confirmEmailAddressPath,
    async (request, reply) => {
      const speaking = speakingOf(request);
      const typed = typedFrom(request.body);
      const link = linkFollowed(request);
      const carried = carriedIn(request) ?? "";
      // A submission that arrived without the id the form was shown with is one
      // that did not come from the form. It is not refused for that — there is
      // nothing wrong with what was typed — but it gets an id of its own, and
      // so is nobody's retry. An id given twice arrives as both of them, which
      // is not an id either, and neither is a blank one: the command refuses
      // that where it is made, and a refusal made there is the site's own code
      // breaking rather than an answer the reader was owed.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();
      const dialog = formFor(speaking, carried, requestId, typed);

      try {
        const sent = await submitForm(
          request,
          reply,
          {
            dialog,
            typed,
            show: (shown) =>
              pageOf(
                assets,
                request,
                renderDialog(shown),
                speaking.say("confirmEmailAddress.title"),
                "bare",
              ),
          },
          () =>
            request.server.mediator.send(
              new ConfirmEmailAddress(
                requestId,
                link,
                typed["name"] ?? "",
                typed["password"] ?? "",
                typed["passwordConfirmation"] ?? "",
                request.requestedAt,
              ),
            ),
        );
        // Refused for a broken rule: the form has been shown again, with each
        // rule beneath the field it is about, and there is nothing to add.
        if (sent.refused) return reply;
      } catch (failure) {
        // Nobody could say whether the password has been breached, so the
        // address is not confirmed, the administrator is told, and the reader
        // is shown their form again saying so above the fields. The link is
        // not spent by it, so trying again later needs no new one.
        if (failure instanceof CheckRefused) {
          await reportUnreachable(request, "Have I Been Pwned");
          return reply
            .code(503)
            .header("cache-control", "no-store")
            .header("vary", "Cookie, Accept-Language")
            .type("text/html; charset=utf-8")
            .send(
              pageOf(
                assets,
                request,
                renderDialog({
                  ...dialog,
                  problems: {
                    messages: [speaking.say(failure.code)],
                    autofocus: true,
                  },
                }),
                speaking.say("confirmEmailAddress.title"),
                "bare",
              ),
            );
        }
        if (!(failure instanceof ConfirmingRefused)) throw failure;
        return telling(
          assets,
          request,
          reply,
          saidFor(failure.code, speaking, carried),
        );
      }

      // Confirmed. The reader is told so and pointed to sign in, rather than
      // signed in: they have shown they read mail at the address, which is not
      // the same as knowing the password, and the device they read their mail
      // on is often not the one they registered on.
      return telling(assets, request, reply, {
        title: speaking.say("confirmEmailAddress.confirmed.title"),
        explanation: speaking.say("confirmEmailAddress.confirmed.explanation"),
        onwards: {
          href: signInPath,
          label: speaking.say("confirmEmailAddress.signIn"),
        },
      });
    },
  );
};
