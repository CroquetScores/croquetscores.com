// Where a reader signed in changes what their account is called. The form
// holds the name the account has now, so that a small correction is a small
// edit, and a name that breaks a rule is said beneath the field with what was
// typed put back. A sound one is kept, and the reader is taken to their
// profile, which shows it.
//
// A reader who is not signed in is sent to sign in and brought back, as they
// are from the profile. It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { AccountProfile } from "../../application/operations/accounts/AccountProfile.js";
import { ChangeName } from "../../application/operations/accounts/ChangeName.js";
import type { Assets } from "../common/assets.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { accountForgotten, profilePath, toSignIn } from "./profile.js";

export const changeNamePath = "/account/change-name";

const formFor = (speaking: Speaking, typed: Typed): Dialog => ({
  title: speaking.say("changeName.title"),
  action: changeNamePath,
  fields: [
    {
      name: "name",
      label: speaking.say("changeName.name"),
      type: "text",
      autocomplete: "name",
      value: typed["name"],
    },
  ],
  submit: speaking.say("changeName.submit"),
});

export const registerChangeNamePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    code = 200,
  ): FastifyReply => {
    const speaking = speakingOf(request);
    return (
      reply
        .code(code)
        // Somebody's own, so kept for nobody else.
        .header(
          "cache-control",
          code === 200 ? "private, no-cache" : "no-store",
        )
        .header("vary", "Cookie, Accept-Language")
        .type("text/html; charset=utf-8")
        .send(
          render(assets, {
            title: dialog.title,
            theme: themeOf(request),
            signedIn: true,
            hasPassword: hasPassword(request),
            speaking,
            siteName: siteNameOf(request),
            tryWebsite: websiteOf(request).isTry,
            path: changeNamePath,
            currentPath: changeNamePath,
            frame: "bare",
            body: renderDialog(dialog),
          }),
        )
    );
  };

  server.get(changeNamePath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const profile = await request.server.mediator.query(
      new AccountProfile(reader.value),
    );
    if (profile === undefined) return toSignIn(request, reply);
    return show(
      request,
      reply,
      formFor(speakingOf(request), { name: profile.name }),
    );
  });

  server.post(changeNamePath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const speaking = speakingOf(request);
    const typed = typedFrom(request.body);
    try {
      await request.server.mediator.send(
        new ChangeName(reader.value, typed["name"] ?? "", request.requestedAt),
      );
    } catch (failure) {
      // Forgetting an account ends its sessions afterwards, not with it, so a
      // form sent in between comes from a reader signed in to nothing, and is
      // answered as the page itself answers one.
      if (accountForgotten(failure)) return toSignIn(request, reply);
      if (!(failure instanceof RequestInvalid)) throw failure;
      return show(
        request,
        reply,
        refusedForm(formFor(speaking, typed), typed, failure.broken, speaking),
        422,
      );
    }
    return reply.redirect(profilePath, 303);
  });
};
