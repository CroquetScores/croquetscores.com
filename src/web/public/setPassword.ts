// Where a reader signed in to an account with no password, having only ever
// signed in with Google, asks for a link to set one.
//
// It asks for nothing. It says which address the link will go to, and a button
// sends it, to the account's own address: a link rather than a form, because
// being signed in is not enough, and whoever asks has to read the account's
// mail as well (AskToSetPassword.feature). The link opens the page the forgot
// password email's link opens, and sets the password there.
//
// A reader whose account has a password finds no page here at all, opened or
// posted to: what they want is the change password page.
//
// It needs no scripting.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AccountProfile } from "../../application/operations/accounts/AccountProfile.js";
import { AskToSetPassword } from "../../application/operations/accounts/AskToSetPassword.js";
import { AskToSetPasswordRefused } from "../../application/operations/accounts/AskToSetPasswordHandler.js";
import type { Assets } from "../common/assets.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { profilePath, toSignIn } from "./profile.js";

export const setPasswordPath = "/account/set-password";

// The request id travels in the form's own address, minted when the form is
// shown, so that a form sent twice — pressed twice, or gone back to and pressed
// again — asks once.
const formFor = (
  speaking: Speaking,
  requestId: string,
  emailAddress: string,
): Dialog => ({
  title: speaking.say("setPassword.title"),
  action: `${setPasswordPath}?request=${encodeURIComponent(requestId)}`,
  notice: speaking.say("setPassword.explanation", { emailAddress }),
  fields: [],
  submit: speaking.say("setPassword.submit"),
});

export const registerSetPasswordPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    body: string,
    speaking: Speaking,
    // The dialog brings its own frame; what is said once it is sent is read
    // on the panel.
    frame: "bare" | "panel" = "bare",
  ): FastifyReply =>
    reply
      // Somebody's own, so kept for nobody else.
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          title: speaking.say("setPassword.title"),
          theme: themeOf(request),
          signedIn: true,
          hasPassword: false,
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: setPasswordPath,
          currentPath: setPasswordPath,
          frame,
          body,
        }),
      );

  // The address the link will go to, or nothing where there is nobody to send
  // it to: nobody signed in, or an account forgotten since they signed in.
  const addressOf = async (
    request: FastifyRequest,
  ): Promise<string | undefined> => {
    const reader = readerOf(request);
    if (reader === undefined) return undefined;
    const profile = await request.server.mediator.query(
      new AccountProfile(reader.value),
    );
    return profile?.emailAddress;
  };

  server.get(setPasswordPath, async (request, reply) => {
    if (readerOf(request) === undefined) return toSignIn(request, reply);
    if (hasPassword(request)) return reply.callNotFound();
    const emailAddress = await addressOf(request);
    if (emailAddress === undefined) return toSignIn(request, reply);

    const speaking = speakingOf(request);
    return show(
      request,
      reply,
      renderDialog(formFor(speaking, randomUUID(), emailAddress)),
      speaking,
    );
  });

  server.post<{ Querystring: { request?: string } }>(
    setPasswordPath,
    async (request, reply) => {
      const reader = readerOf(request);
      if (reader === undefined) return toSignIn(request, reply);

      const speaking = speakingOf(request);
      // An id given blank is not one the form minted; an asking without one is
      // nobody's retry, and gets an id of its own.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();

      try {
        await request.server.mediator.send(
          new AskToSetPassword(
            requestId,
            reader.value,
            speaking.language.tag,
            websiteOf(request).host,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        // The page is not there for an account that has a password, and the
        // asking is what says whether it has one, as it stands now.
        if (failure instanceof AskToSetPasswordRefused) {
          return reply.callNotFound();
        }
        throw failure;
      }

      const { say } = speaking;
      return show(
        request,
        reply,
        `          <h1>${escape(say("setPassword.sent.title"))}</h1>
          <p>${escape(say("setPassword.sent.explanation"))}</p>
          <p><a href="${profilePath}">${escape(say("setPassword.profile"))}</a></p>`,
        speaking,
        "panel",
      );
    },
  );
};
