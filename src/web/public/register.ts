// Where somebody asks for an account.
//
// It asks for an email address and nothing else, because registering takes
// nothing else: whoever registers has not yet shown the address is theirs, so
// the name and the password are given by whoever turns out to read mail at it,
// on the page the link opens (ConfirmEmailAddress.feature).
//
// Every registration ends at the welcome page, whoever the address belongs to.
// What differs — whether an account is made, and which email is sent — is
// registering's to decide, and only the address's owner learns it. So nothing
// here looks at what registering did, and the address is never put in an
// address a browser keeps: it goes in the body of a post and nowhere else.
//
// The page is guarded by reCAPTCHA, which runs in the reader's browser and
// hands the form a token. Registering asks for no password and hashes nothing,
// so this is all that stands between a program and somebody's inbox: without
// it anybody could have the site email an address of their choosing three
// times an hour. A reader whose browser did not run the script sends no token,
// and is told the page needs scripting rather than refused, because nothing is
// wrong with what they typed.
//
// Where the site has been given Google's credentials, the page also offers
// registering with Google, beneath the form (auth/google.ts). A reader Google
// did not let in is brought back here and told why, by a code in the page's
// address; only the codes that way back sends are said, so that the address
// cannot be made to put anything else on the page.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RegisterAccount } from "../../application/operations/accounts/RegisterAccount.js";
import type { Assets } from "../common/assets.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { render } from "../common/layout.js";
import { signedIn } from "../common/reader.js";
import { themeOf } from "../common/theme.js";
import { reportUnreachable } from "../common/unreachableServices.js";
import { javaScriptRequiredPath } from "./javaScriptRequired.js";
import { registrationsSuspendedPath } from "./registrationsSuspended.js";
import { welcomePath } from "./welcome.js";

export const registerPath = "/account/register";

// Named here rather than taken from the Google routes, which import this page's
// address, so that neither module needs the other to be loaded first.
const googlePath = "/auth/google";
const refusalsFromGoogle: readonly string[] = [
  "SignInWithGoogle.EmailAddressNotVerified",
  "SignInWithGoogle.LinkedToAnother",
  "SignInWithGoogle.NameMissing",
  "Google.Unreachable",
];

// The other way in, beneath the form, as the sign in page puts its ways on.
const withGoogle = (speaking: Speaking): string =>
  `        <nav class="dialog-elsewhere" aria-label="${escape(speaking.say("register.elsewhere"))}">
          <p><a href="${googlePath}">${escape(speaking.say("register.withGoogle"))}</a></p>
        </nav>`;

/** The field reCAPTCHA's script fills in, and the form sends back. */
export const tokenField = "recaptchaToken";

/**
 * What the page makes of whoever filled the form in. The words are the
 * reCAPTCHA check's own, so that what stands in for it in a scenario answers
 * what the real one answers.
 */
export type Judgement = "a person" | "not a person" | "no judgement";

/** What the register page asks about a reader, and what it shows them with. */
export interface ReaderCheck {
  /** What to make of a form carrying `token`. Throws when nobody could judge. */
  judge(token: string | undefined): Promise<Judgement>;
  /** The key the page shows, or nothing where there is no check to run. */
  readonly siteKey: string | undefined;
}

// Google's script, asked for by the page when there is a key to ask it with.
// It is the one script the public side loads, and the page works without it in
// every way but this: a reader who does not run it is told so.
//
// The token is asked for as the form is sent, not as the page opens. A token
// lasts two minutes and is good once, so one asked for on arrival would be
// stale for a reader who took their time, and missing for one who sent the form
// before it came. A browser in which Google's script never arrived sends the
// form as it is, with no token, and is told the page needs scripting.
//
// The form is held while the token is asked for, and a second press in that
// time does nothing: sending it again would ask for a second token.
const script = (siteKey: string | undefined): string =>
  siteKey === undefined
    ? ""
    : `
    <script src="https://www.google.com/recaptcha/api.js?render=${escape(siteKey)}"></script>
    <script>
      (function () {
        var token = document.getElementsByName(${JSON.stringify(tokenField)})[0];
        var form = token.form;
        var asking = false;
        form.addEventListener("submit", function (event) {
          if (typeof grecaptcha === "undefined") return;
          event.preventDefault();
          if (asking) return;
          asking = true;
          grecaptcha.ready(function () {
            grecaptcha
              .execute(${JSON.stringify(siteKey)}, { action: "register" })
              .then(
                function (made) { token.value = made; },
                function () { token.value = ""; },
              )
              .then(function () {
                asking = false;
                form.submit();
              });
          });
        });
      })();
    </script>`;

// The request id travels in the form's own address, minted when the form is
// shown, so that a form sent twice — pressed twice, or gone back to and sent
// again — registers once.
const formFor = (
  speaking: Speaking,
  requestId: string,
  typed: Typed,
): Dialog => ({
  title: speaking.say("register.title"),
  action: `${registerPath}?request=${encodeURIComponent(requestId)}`,
  // Empty until the script fills it in, and sent empty by a browser that has
  // no script to fill it: what arrives with nothing in it is a reader nobody
  // judged, which is not the same as one judged not to be a person.
  hidden: { [tokenField]: "" },
  fields: [
    {
      name: "emailAddress",
      label: speaking.say("register.emailAddress"),
      type: "email",
      autocomplete: "email",
      value: typed["emailAddress"],
    },
  ],
  cancel: { label: speaking.say("register.cancel"), href: "/" },
  submit: speaking.say("register.submit"),
});

export const registerRegisterPage = (
  server: FastifyInstance,
  assets: Assets,
  readers: ReaderCheck,
  googleOffered: boolean,
): void => {
  const page = (
    request: FastifyRequest,
    dialog: Dialog,
    speaking: Speaking,
  ): string =>
    render(assets, {
      title: speaking.say("register.title"),
      theme: themeOf(request),
      signedIn: signedIn(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: registerPath,
      currentPath: registerPath,
      frame: "bare",
      // A reader without scripting cannot be judged, so they are told before
      // they fill anything in rather than after.
      withoutScripting: javaScriptRequiredPath,
      // The token the script fills in travels as a field of the form, which is
      // how reCAPTCHA is meant to be sent and needs no hidden-field support of
      // its own: the dialog draws the fields a reader fills in, and this one
      // is written beside it.
      body: `${renderDialog(dialog)}${googleOffered ? `\n${withGoogle(speaking)}` : ""}${script(readers.siteKey)}`,
    });

  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    speaking: Speaking,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // A page holding what a reader typed is kept by nothing in between.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(page(request, dialog, speaking));

  server.get<{ Querystring: { refused?: string } }>(
    registerPath,
    (request, reply) => {
      const speaking = speakingOf(request);
      const dialog = formFor(speaking, randomUUID(), {});
      const refused = request.query.refused;
      if (refused === undefined || !refusalsFromGoogle.includes(refused)) {
        return show(request, reply, dialog, speaking);
      }
      return show(
        request,
        reply,
        { ...dialog, problems: { messages: [speaking.say(refused)] } },
        speaking,
      );
    },
  );

  server.post<{ Querystring: { request?: string } }>(
    registerPath,
    async (request, reply) => {
      const speaking = speakingOf(request);
      const typed = typedFrom(request.body);
      // An id given blank, or twice, is not one the form minted; a registration
      // without one is nobody's retry, and gets an id of its own.
      const given = request.query.request;
      const requestId =
        typeof given === "string" && given.trim() !== "" ? given : randomUUID();
      const dialog = formFor(speaking, requestId, typed);

      let judgement: Judgement;
      try {
        judgement = await readers.judge(typed[tokenField]);
      } catch {
        // Nobody judged, and a registration nobody judged is the thing the check
        // is there to stop. Nothing is recorded, the administrator is told, and
        // the reader is told that registering is suspended for now rather than
        // that they did anything wrong.
        await reportUnreachable(request, "reCAPTCHA");
        return reply.redirect(registrationsSuspendedPath, 303);
      }

      // No token at all is a browser that did not run the script, which is not
      // the same as a reader Google will not stand behind.
      if (judgement === "no judgement") {
        return reply.redirect(javaScriptRequiredPath, 303);
      }
      if (judgement === "not a person") {
        return show(
          request,
          reply,
          {
            ...dialog,
            problems: {
              messages: [speaking.say("Registration.NotAPerson")],
              autofocus: true,
            },
          },
          speaking,
          422,
        );
      }

      try {
        await request.server.mediator.send(
          new RegisterAccount(
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
          refusedForm(dialog, typed, failure.broken, speaking),
          speaking,
          422,
        );
      }

      // The same page whoever the address belongs to, and nothing of the address
      // in the address it is reached at.
      return reply.redirect(welcomePath, 303);
    },
  );
};
