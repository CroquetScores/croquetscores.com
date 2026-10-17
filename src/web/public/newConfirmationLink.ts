// Where a reader whose link to confirm their email address has expired asks
// for another.
//
// The expired link is what says which account the new one is for. Its
// signature still shows the site made it for that account however old it is,
// so the reader types nothing, and nothing they could type or change sends the
// new link anywhere but the account's own address: what the page carries is
// the link, judged as it was on the page it came from, and the account is
// taken out of it only once it has been found sound.
//
// Sending takes the button, not just opening the page, as confirming does, so
// that nothing is sent by a mail system or a browser fetching the page ahead
// of the reader.
//
// It needs no scripting and nobody signed in.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { SendConfirmationLinkAgain } from "../../application/operations/accounts/SendConfirmationLinkAgain.js";
import { SendingRefused } from "../../application/operations/accounts/SendConfirmationLinkAgainHandler.js";
import { WhatAConfirmationLinkIsWorth } from "../../application/operations/accounts/WhatAConfirmationLinkIsWorth.js";
import type { ConfirmationLinkWorth } from "../../application/operations/accounts/confirmationLinks.js";
import type { Links } from "../../application/services/Links.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { themeOf } from "../common/theme.js";
import { signInPath } from "./signIn.js";

export const newConfirmationLinkPath = "/account/new-confirmation-link";

/** What the page says, and what it offers when it offers anything. */
interface Said {
  readonly title: string;
  readonly explanation: string;
  /** Whether the button that sends a new link is on it. */
  readonly offersALink?: boolean;
  readonly onwards?: { readonly href: string; readonly label: string };
}

const saidFor = (worth: ConfirmationLinkWorth, speaking: Speaking): Said => {
  const { say } = speaking;
  switch (worth) {
    // A link that still works is traded as readily as one that has expired:
    // whoever holds it is whoever the account's email reached, and asking for
    // another is not something to be refused for asking early.
    case "Link.Works":
    case "Link.Expired":
      return {
        title: say("newConfirmationLink.title"),
        explanation: say("newConfirmationLink.explanation"),
        offersALink: true,
      };
    case "Account.AlreadyConfirmed":
      return {
        title: say("newConfirmationLink.alreadyConfirmed.title"),
        explanation: say("newConfirmationLink.alreadyConfirmed.explanation"),
        onwards: { href: signInPath, label: say("newConfirmationLink.signIn") },
      };
    case "Link.NoLongerWorks":
      return {
        title: say("newConfirmationLink.noLongerWorks.title"),
        explanation: say("newConfirmationLink.noLongerWorks.explanation"),
      };
  }
};

// The link and the request id travel in the form's own address, as they do on
// the page the reader came from: neither is a secret the page is keeping, and
// a dialog has no hidden fields. The id is minted when the button is drawn, so
// that a double press — or a retry after an answer was lost — asks once and
// sends one email. The id is spelled for an address and the link is not: what
// reads a link takes the part it signed out of the address by name and would
// find the spelling changed, where an id spelled as it came would be a
// different id on the way back the moment it held an & or a #.
const asking = (
  carried: string,
  requestId: string,
  speaking: Speaking,
): string =>
  `          <form class="asking" method="post" action="${escape(`${newConfirmationLinkPath}?link=${carried}&request=${encodeURIComponent(requestId)}`)}">
            <button class="button button-submit" type="submit">${escape(speaking.say("newConfirmationLink.send"))}</button>
          </form>`;

const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];

export const registerNewConfirmationLinkPage = (
  server: FastifyInstance,
  assets: Assets,
  links: Links,
): void => {
  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    said: Said,
    carried: string,
    requestId: string,
  ): FastifyReply => {
    const speaking = speakingOf(request);
    const onwards =
      said.onwards === undefined
        ? ""
        : `\n          <p><a href="${escape(said.onwards.href)}">${escape(said.onwards.label)}</a></p>`;
    const button =
      said.offersALink === true
        ? `\n${asking(carried, requestId, speaking)}`
        : "";

    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: said.title,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: newConfirmationLinkPath,
          currentPath: newConfirmationLinkPath,
          body: `          <h1>${escape(said.title)}</h1>
          <p>${escape(said.explanation)}</p>${button}${onwards}
          <p><a href="/">${escape(speaking.say("newConfirmationLink.home", { siteName: siteNameOf(request) }))}</a></p>`,
        }),
      );
  };

  const worthOf = (request: FastifyRequest): Promise<ConfirmationLinkWorth> =>
    request.server.mediator.query(
      new WhatAConfirmationLinkIsWorth(request.url, request.requestedAt),
    );

  server.get(newConfirmationLinkPath, async (request, reply) => {
    // A reader with no link has not come from one, and there is nothing here
    // for them to trade.
    const carried = carriedIn(request);
    if (carried === undefined) return reply.redirect(signInPath, 303);

    return show(
      request,
      reply,
      saidFor(await worthOf(request), speakingOf(request)),
      carried,
      randomUUID(),
    );
  });

  server.post<{ Querystring: { request?: string } }>(
    newConfirmationLinkPath,
    async (request, reply) => {
      const carried = carriedIn(request);
      if (carried === undefined) return reply.redirect(signInPath, 303);

      const speaking = speakingOf(request);
      // A submission that arrived without the id the button was drawn with did
      // not come from the button. It is not refused for that, but it gets an
      // id of its own, and so is nobody's retry. A blank one is no id either:
      // the command refuses that where it is made, and a refusal made there is
      // the site's own code breaking rather than an answer the reader was owed.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();
      // Judged again, and by the same question the page asked when it drew the
      // button: what arrives here is whatever was posted, and a link altered
      // between the two is not the link the button was drawn for.
      const worth = await worthOf(request);
      if (worth !== "Link.Works" && worth !== "Link.Expired") {
        return show(
          request,
          reply,
          saidFor(worth, speaking),
          carried,
          requestId,
        );
      }

      // Taken out of the link only now that the link is known to be one of ours,
      // unaltered, and for an account that could still be confirmed.
      const account = links.read(request.url)?.account;
      if (account === undefined) {
        return show(
          request,
          reply,
          saidFor("Link.NoLongerWorks", speaking),
          carried,
          requestId,
        );
      }

      try {
        await request.server.mediator.send(
          new SendConfirmationLinkAgain(
            requestId,
            account.value,
            speaking.language.tag,
            websiteOf(request).host,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (!(failure instanceof SendingRefused)) throw failure;
        // Told to try later only for the limit; anything else is what the link
        // turned out to be worth, said the way the page says it.
        return show(
          request,
          reply,
          failure.code === "EmailsWritten.TooManyLately"
            ? {
                title: speaking.say("newConfirmationLink.tooMany.title"),
                explanation: speaking.say(
                  "newConfirmationLink.tooMany.explanation",
                ),
              }
            : saidFor(
                failure.code === "Account.AlreadyConfirmed"
                  ? "Account.AlreadyConfirmed"
                  : "Link.NoLongerWorks",
                speaking,
              ),
          carried,
          requestId,
        );
      }

      // Nothing of the address on the page or in its address: it says an email
      // is on its way, and says it to everybody alike.
      return show(
        request,
        reply,
        {
          title: speaking.say("newConfirmationLink.sent.title"),
          explanation: speaking.say("newConfirmationLink.sent.explanation"),
        },
        carried,
        requestId,
      );
    },
  );
};
