// Where a reader signed in sees their own account: what it is called, the
// email address it is reached at, and the pages that change either, or the
// password, or forget the account. It changes nothing itself, and it is not a
// form, so it is read on the panel rather than in a dialog.
//
// A reader who is not signed in is sent to sign in and brought back. So is one
// whose account has nothing to show, which is one forgotten since they signed
// in: the page treats that as nobody signed in, which is what it has become.
//
// The name and the address are the account's own, not words of the reader's
// language, so they are shown as they are, whatever language the page is in.
//
// It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AccountProfile } from "../../application/operations/accounts/AccountProfile.js";
import type { Assets } from "../common/assets.js";
import { offeredTo } from "../common/accountMenu.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { signInPath } from "./signIn.js";

export const profilePath = "/account/profile";

// The pages that change the account, in the order the account menu offers
// them, and in its words. The ones that ask for the password the account has
// now are offered only to an account that has one, and setting a password only
// to one that has none.
// Forgetting it comes last, and the menu does not offer it: what cannot be
// undone is not put a slip away from signing out.
const changes: readonly {
  readonly href: string;
  readonly words: string;
  readonly for?: "with a password" | "without a password";
}[] = [
  { href: "/account/change-name", words: "account.changeName" },
  {
    href: "/account/change-email-address",
    words: "account.changeEmailAddress",
    for: "with a password",
  },
  {
    href: "/account/change-password",
    words: "account.changePassword",
    for: "with a password",
  },
  {
    href: "/account/set-password",
    words: "account.setPassword",
    for: "without a password",
  },
  { href: "/account/forget-account", words: "account.forgetAccount" },
];

/** Back to `request`'s own address once the reader has signed in. */
export const toSignIn = (request: FastifyRequest, reply: FastifyReply) =>
  reply.redirect(
    `${signInPath}?return=${encodeURIComponent(request.url)}`,
    303,
  );

export const registerProfilePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(profilePath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const profile = await request.server.mediator.query(
      new AccountProfile(reader.value),
    );
    if (profile === undefined) return toSignIn(request, reply);

    const speaking = speakingOf(request);
    const { say } = speaking;
    const html = render(assets, {
      title: say("profile.title"),
      theme: themeOf(request),
      signedIn: true,
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: profilePath,
      currentPath: profilePath,
      body: `          <h1>${escape(say("profile.title"))}</h1>
          <dl class="profile">
            <dt id="profile-name-label">${escape(say("profile.name"))}</dt>
            <dd class="profile-own" id="profile-name">${escape(profile.name)}</dd>
            <dt id="profile-email-address-label">${escape(say("profile.emailAddress"))}</dt>
            <dd class="profile-own" id="profile-email-address">${escape(profile.emailAddress)}</dd>
          </dl>
          <ul class="profile-changes">
${changes
  .filter((each) => offeredTo(each, profile.hasPassword))
  .map(
    ({ href, words }) =>
      `            <li><a href="${href}">${escape(say(words))}</a></li>`,
  )
  .join("\n")}
          </ul>`,
    });

    // Somebody's own, so kept for nobody else.
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(html);
  });
};
