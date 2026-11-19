// Where a reader signed in sees the keys an app acts for them with, in place of
// their password, and revokes one. The page lists the keys they have made that
// have not been revoked, with a trash can before each, and a button to add
// another.
//
// Adding one is a dialog over the list, asking for a label and whether the app
// may also write. When the key is made the dialog is gone: the answer is the
// list again, with the new key above it. So is revoking one, which the dialog
// asks about first, since it cannot be undone. Where there is no scripting to
// lay a dialog over the list, the button and the trash can lead to pages that
// ask the same, at /account/api-keys/new and /account/api-keys/revoke.
//
// A key is shown once, in the answer to the form that made it, and never again:
// the page that shows it is not cached and is not a redirect, since a page
// reached by redirect could be reached again, and the key is kept nowhere to
// show a second time. A reader who did not write it down makes another. With
// scripting a button beside it copies it.
//
// A key's date is written in the reader's own region where there is scripting,
// since the server does not know it, and as year, month and day without.
//
// A reader who is not signed in is sent to sign in and brought back, as they
// are from the profile.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import {
  ApiKeysOfAccount,
  type ApiKeyShown,
} from "../../application/operations/accounts/ApiKeysOfAccount.js";
import { CreateApiKey } from "../../application/operations/accounts/CreateApiKey.js";
import { RevokeApiKey } from "../../application/operations/accounts/RevokeApiKey.js";
import { AccountRefused } from "../../domain/aggregates/accounts/Account.js";
import type { Assets } from "../common/assets.js";
import {
  renderDialog,
  renderModalDialog,
  type Dialog,
} from "../common/dialog.js";
import { escape } from "../common/escape.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { trashCanPath } from "../common/iconPaths.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { accountForgotten, toSignIn } from "./profile.js";

export const apiKeysPath = "/account/api-keys";
export const addApiKeyPath = "/account/api-keys/new";
export const revokeApiKeyPath = "/account/api-keys/revoke";

// Over the list, the form says so, so that a refusal is answered over the list
// again and not by a page of its own that the reader never asked for.
const formFor = (
  speaking: Speaking,
  typed: Typed,
  overList: boolean,
): Dialog => ({
  ...(overList ? { hidden: { over: "list" } } : {}),
  title: speaking.say("apiKeys.new.title"),
  action: addApiKeyPath,
  fields: [
    {
      name: "label",
      label: speaking.say("apiKeys.new.label"),
      type: "text",
      autocomplete: "off",
      value: typed["label"],
    },
    {
      name: "write",
      label: speaking.say("apiKeys.new.write"),
      type: "checkbox",
      autocomplete: "off",
      checked: typed["write"] !== undefined,
    },
  ],
  submit: speaking.say("apiKeys.new.submit"),
});

// Drawn here rather than fetched, as the commentary's is, and hidden from
// anyone reading the page aloud, since the button says in words what it is for.
const trashCan = `<svg class="icon icon-trash-can" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${trashCanPath}" /></svg>`;

const revokeUrl = (key: ApiKeyShown): string =>
  `${revokeApiKeyPath}?keyId=${encodeURIComponent(key.id)}`;

// One key as its owner sees it: a trash can that asks to revoke it, then what
// it is called, what it may do and when it was made. Never the key, which the
// list does not have. The trash can is a link to the page that asks, which the
// page's script turns into the dialog over the list.
const keyShown = (speaking: Speaking, key: ApiKeyShown, at: number): string => {
  const { say } = speaking;
  const revoke = escape(say("apiKeys.revoke"));
  return `            <li class="api-key" id="api-key-${String(at + 1)}">
              <a class="api-key-revoke" href="${escape(revokeUrl(key))}" data-key="${escape(key.id)}" aria-label="${revoke}" title="${revoke}">${trashCan}</a>
              <span class="api-key-label">${escape(key.label)}</span>
              <span class="api-key-scope">${escape(say(key.mayWrite ? "apiKeys.mayReadAndWrite" : "apiKeys.mayRead"))}</span>
              <span class="api-key-made">${escape(say("apiKeys.made"))} <time datetime="${escape(key.madeAt)}">${escape(key.madeAt.slice(0, 10))}</time></span>
            </li>`;
};

// What the reader is asked before a key is revoked, in words a page and the
// dialog share. The label's place is marked, so that the dialog can have the
// key's label written into it by the script as it opens.
const labelMark = "\u0000";

const revokeQuestion = (speaking: Speaking, label: string): string =>
  speaking.say("apiKeys.revoke.question", { label });

const revokeDialog = (speaking: Speaking): string => {
  const { say } = speaking;
  const [before = "", after = ""] = revokeQuestion(speaking, labelMark).split(
    labelMark,
  );
  return `
        <dialog class="modal-dialog dialog" id="api-key-revoke-dialog" aria-labelledby="api-key-revoke-dialog-title">
          <h2 class="dialog-title" id="api-key-revoke-dialog-title">${escape(say("apiKeys.revoke.title"))}</h2>
          <form class="dialog-form" method="post" action="${revokeApiKeyPath}">
            <div class="dialog-content stack">
              <p>${escape(before)}<strong class="api-key-revoking"></strong>${escape(after)}</p>
            </div>
            <div class="dialog-buttons">
              <button class="button button-submit" type="submit">${escape(say("apiKeys.revoke.confirm"))}</button>
              <button class="button dialog-cancel" type="button">${escape(say("admin.modal.cancel"))}</button>
            </div>
            <input type="hidden" name="keyId" value="">
          </form>
        </dialog>`;
};

// What scripting adds, written without arrow functions, const or template
// strings, like the other scripts on the page, for the older tablets the site
// is still read on. The copy button is there only where scripting is, since it
// does nothing without; where the clipboard refuses, the key is selected so
// that the reader's own copy finishes it.
const scripting = (speaking: Speaking, hasNewKey: boolean): string => `
          <script>
            (function () {
              var times = document.querySelectorAll("time[datetime]");
              for (var each = 0; each < times.length; each += 1) {
                var moment = new Date(times[each].getAttribute("datetime"));
                if (!isNaN(moment.getTime())) {
                  times[each].textContent = moment.toLocaleDateString();
                }
              }${
                hasNewKey
                  ? `
              var button = document.getElementById("api-key-copy");
              var key = document.getElementById("api-key-new");
              if (button && key) {
                button.hidden = false;
                var said = function (words) {
                  button.textContent = words;
                  window.setTimeout(function () {
                    button.textContent = ${JSON.stringify(speaking.say("apiKeys.copy"))};
                  }, 2000);
                };
                var select = function () {
                  var range = document.createRange();
                  range.selectNodeContents(key);
                  var selection = window.getSelection();
                  selection.removeAllRanges();
                  selection.addRange(range);
                  said(${JSON.stringify(speaking.say("apiKeys.copyManually"))});
                };
                button.addEventListener("click", function () {
                  if (!navigator.clipboard || !navigator.clipboard.writeText) {
                    select();
                    return;
                  }
                  navigator.clipboard.writeText(key.textContent).then(
                    function () {
                      said(${JSON.stringify(speaking.say("apiKeys.copied"))});
                    },
                    select,
                  );
                });
              }`
                  : ""
              }
              // The two dialogs are laid over the list where there is a
              // <dialog> to lay; where there is not, the links they replace
              // lead to pages that ask the same. Focus goes back to whatever
              // opened one when it closes.
              var adding = document.getElementById("api-key-dialog");
              var revoking = document.getElementById("api-key-revoke-dialog");
              var opener;
              var wire = function (dialog) {
                dialog.querySelector(".dialog-cancel").addEventListener("click", function () {
                  dialog.close();
                });
                dialog.addEventListener("close", function () {
                  if (opener) opener.focus();
                });
              };
              if (adding && typeof adding.showModal === "function") {
                wire(adding);
                document.getElementById("api-keys-add").addEventListener("click", function (event) {
                  event.preventDefault();
                  opener = event.currentTarget;
                  adding.showModal();
                });
                if (adding.hasAttribute("data-reopen")) adding.showModal();
              }
              if (revoking && typeof revoking.showModal === "function") {
                wire(revoking);
                document.addEventListener("click", function (event) {
                  var trash = event.target.closest && event.target.closest(".api-key-revoke");
                  if (!trash) return;
                  event.preventDefault();
                  opener = trash;
                  revoking.querySelector('input[name="keyId"]').value = trash.getAttribute("data-key");
                  revoking.querySelector(".api-key-revoking").textContent =
                    trash.closest(".api-key").querySelector(".api-key-label").textContent;
                  revoking.showModal();
                });
              }
            })();
          </script>`;

export const registerApiKeysPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const send = (
    request: FastifyRequest,
    reply: FastifyReply,
    title: string,
    path: string,
    body: string,
    frame: "panel" | "bare",
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // Somebody's own, and where a key is shown, shown once: kept for
      // nobody, and not for this reader again.
      .header("cache-control", "no-store")
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
          path,
          currentPath: path,
          frame,
          body,
        }),
      );

  const showKeys = async (
    request: FastifyRequest,
    reply: FastifyReply,
    account: string,
    shown: {
      readonly made?: string | undefined;
      /** The dialog to add a key, as it is to be, and whether it is open. */
      readonly adding?: Dialog | undefined;
      readonly code?: number | undefined;
    } = {},
  ): Promise<FastifyReply> => {
    const speaking = speakingOf(request);
    const { say } = speaking;
    const { made } = shown;
    // A key revoked is not shown: it is as good as gone to its owner, who can
    // do nothing more with it.
    const keys = (
      await request.server.mediator.query(new ApiKeysOfAccount(account))
    ).filter((key) => !key.revoked);
    const body = `          <div class="api-keys-page">
          <h1>${escape(say("apiKeys.title"))}</h1>
          <p>${escape(say("apiKeys.intro"))}</p>${
            made === undefined
              ? ""
              : `
          <section class="api-key-new" aria-labelledby="api-key-new-title">
            <p><strong id="api-key-new-title">${escape(say("apiKeys.shown"))}</strong></p>
            <p><code id="api-key-new">${escape(made)}</code> <button type="button" id="api-key-copy" class="button button-submit api-key-copy" hidden>${escape(say("apiKeys.copy"))}</button></p>
          </section>`
          }
          <p class="api-keys-add"><a class="button" id="api-keys-add" href="${addApiKeyPath}">${escape(say("apiKeys.add"))}</a></p>
${
  keys.length === 0
    ? `          <p id="api-keys-none">${escape(say("apiKeys.none"))}</p>`
    : `          <ul class="api-keys" id="api-keys">
${keys.map((key, at) => keyShown(speaking, key, at)).join("\n")}
          </ul>`
}
          </div>
${renderModalDialog(shown.adding ?? formFor(speaking, {}, true), {
  id: "api-key-dialog",
  cancel: say("admin.modal.cancel"),
  reopen: shown.adding !== undefined,
})}${keys.length === 0 ? "" : revokeDialog(speaking)}${scripting(speaking, made !== undefined)}`;
    return send(
      request,
      reply,
      say("apiKeys.title"),
      apiKeysPath,
      body,
      "panel",
      shown.code,
    );
  };

  // What is asked before a key is revoked, where there is no scripting to ask
  // it in a dialog over the list.
  const showRevokeQuestion = (
    request: FastifyRequest,
    reply: FastifyReply,
    key: ApiKeyShown,
  ): FastifyReply => {
    const speaking = speakingOf(request);
    const { say } = speaking;
    return send(
      request,
      reply,
      say("apiKeys.revoke.title"),
      revokeApiKeyPath,
      renderDialog({
        title: say("apiKeys.revoke.title"),
        action: revokeApiKeyPath,
        fields: [],
        submit: say("apiKeys.revoke.confirm"),
        elsewhere: [{ label: say("admin.modal.cancel"), href: apiKeysPath }],
        hidden: { keyId: key.id },
        notice: revokeQuestion(speaking, key.label),
      }),
      "bare",
    );
  };

  const showDialog = (
    request: FastifyRequest,
    reply: FastifyReply,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    send(
      request,
      reply,
      dialog.title,
      addApiKeyPath,
      renderDialog(dialog),
      "bare",
      code,
    );

  server.get(apiKeysPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    return showKeys(request, reply, reader.value);
  });

  server.get(addApiKeyPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    return showDialog(request, reply, formFor(speakingOf(request), {}, false));
  });

  server.get(revokeApiKeyPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const asked = typedFrom(request.query)["keyId"];
    const key = (
      await request.server.mediator.query(new ApiKeysOfAccount(reader.value))
    ).find((each) => each.id === asked && !each.revoked);
    // Not one of this reader's, or already revoked: nothing to ask about, and
    // nothing said of whose it is.
    if (key === undefined) return reply.redirect(apiKeysPath, 303);
    return showRevokeQuestion(request, reply, key);
  });

  server.post(addApiKeyPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const speaking = speakingOf(request);
    const typed = typedFrom(request.body);
    let made: string;
    try {
      made = (
        await request.server.mediator.send(
          new CreateApiKey(
            reader.value,
            typed["label"] ?? "",
            typed["write"] === undefined ? "read" : "read-and-write",
            undefined,
            request.requestedAt,
          ),
        )
      ).key;
    } catch (failure) {
      // Forgetting an account ends its sessions afterwards, not with it, so a
      // form sent in between comes from a reader signed in to nothing.
      if (accountForgotten(failure)) return toSignIn(request, reply);
      if (!(failure instanceof RequestInvalid)) throw failure;
      const overList = typed["over"] === "list";
      const refused = refusedForm(
        formFor(speaking, typed, overList),
        typed,
        failure.broken,
        speaking,
      );
      return overList
        ? showKeys(request, reply, reader.value, {
            adding: refused,
            code: 422,
          })
        : showDialog(request, reply, refused, 422);
    }
    // The dialog is gone, and the list is what is left, with the key above it.
    return showKeys(request, reply, reader.value, { made });
  });

  server.post(revokeApiKeyPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const typed = typedFrom(request.body);
    try {
      await request.server.mediator.send(
        new RevokeApiKey(
          reader.value,
          typed["keyId"] ?? "",
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (accountForgotten(failure)) return toSignIn(request, reply);
      // A key that is not there, or not a key at all, is revoked as far as
      // anybody can tell: the list shows what there is, and says no more of
      // which keys other accounts have.
      const notThere =
        failure instanceof RequestInvalid ||
        (failure instanceof AccountRefused &&
          failure.code === "Account.NoSuchApiKey");
      if (!notThere) throw failure;
    }
    return reply.redirect(apiKeysPath, 303);
  });
};
