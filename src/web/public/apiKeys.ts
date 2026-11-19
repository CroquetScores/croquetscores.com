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
import { TournamentsInYear } from "../../application/operations/tournaments/TournamentsInYear.js";
import {
  TournamentsNamed,
  type TournamentNamed,
} from "../../application/operations/tournaments/TournamentsNamed.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
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
// Where the script asks what tournaments the site has, as the name is typed.
export const tournamentNamesPath = "/account/api-keys/tournaments";

// A tournament as a key's row names it: its year tells those of one name apart.
const tournamentWords = (each: TournamentNamed): string =>
  `${each.name} (${String(each.year)})`;

// What a key is limited to is said in four steps, each narrowing the last: all
// tournaments or one, and of one its year, its sport and then its name. The
// name is finished from the tournaments the site has for that year and sport,
// asked of it as the reader types (see suggesting), and has to be the name of
// one when the key is made: it is how a reader finds a tournament among many,
// and not an id they would never know.
const limitFields = (
  speaking: Speaking,
  typed: Typed,
  years: readonly number[],
): Dialog["fields"] => {
  // Where the site has no tournament there is nothing to limit a key to, and a
  // choice of all or one, where there is only all, is a question with one answer.
  if (years.length === 0) return [];
  const { say } = speaking;
  const onlyWhen = { field: "limit", value: "one" } as const;
  return [
    {
      name: "limit",
      label: say("apiKeys.new.limit"),
      type: "radio",
      autocomplete: "off",
      options: [
        { value: "all", label: say("apiKeys.new.limitAll") },
        { value: "one", label: say("apiKeys.new.limitOne") },
      ],
      value: typed["limit"] ?? "all",
    },
    {
      name: "year",
      label: say("apiKeys.new.year"),
      type: "select",
      autocomplete: "off",
      options: years.map((year) => ({
        value: String(year),
        label: String(year),
      })),
      // The newest year is what is chosen at first, as the first sport is.
      value: typed["year"] ?? String(years[0]),
      onlyWhen,
    },
    {
      name: "sport",
      label: say("apiKeys.new.sport"),
      type: "select",
      autocomplete: "off",
      options: Sport.all.map(({ code }) => ({
        value: code,
        label: speaking.knows(`sport.${code}`) ? say(`sport.${code}`) : code,
      })),
      value: typed["sport"] ?? Sport.all[0]?.code,
      onlyWhen,
    },
    {
      name: "tournamentName",
      label: say("apiKeys.new.tournamentName"),
      type: "text",
      autocomplete: "off",
      // Empty where the page is drawn: the script fills it from the site as
      // the reader types.
      suggestions: [],
      value: typed["tournamentName"],
      onlyWhen,
    },
  ];
};

// Over the list, the form says so, so that a refusal is answered over the list
// again and not by a page of its own that the reader never asked for.
const formFor = (
  speaking: Speaking,
  typed: Typed,
  overList: boolean,
  years: readonly number[],
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
    // The three that say which tournament are shown only where one is chosen.
    ...limitFields(speaking, typed, years),
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
const keyShown = (
  speaking: Speaking,
  key: ApiKeyShown,
  at: number,
  named: readonly TournamentNamed[],
): string => {
  const { say } = speaking;
  // A key limited to a tournament says so, by name, and as one tournament
  // where the tournament has gone, which is all that is known of it.
  const limit =
    key.tournament === undefined
      ? ""
      : `
              <span class="api-key-limit">${escape(
                (() => {
                  const found = named.find(
                    (each) => each.id === key.tournament,
                  );
                  return found === undefined
                    ? say("apiKeys.limitedToOne")
                    : say("apiKeys.limitedTo", {
                        name: tournamentWords(found),
                      });
                })(),
              )}</span>`;
  const revoke = escape(say("apiKeys.revoke"));
  return `            <li class="api-key" id="api-key-${String(at + 1)}">
              <a class="api-key-revoke" href="${escape(revokeUrl(key))}" data-key="${escape(key.id)}" aria-label="${revoke}" title="${revoke}">${trashCan}</a>
              <span class="api-key-label">${escape(key.label)}</span>
              <span class="api-key-scope">${escape(say(key.mayWrite ? "apiKeys.mayReadAndWrite" : "apiKeys.mayRead"))}</span>${limit}
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
// The name is finished from the tournaments the site has for the year and sport
// chosen, asked of the site as the reader types and whenever either is changed,
// and the answer replaces the browser's list. Asked for the dialog found by
// `inside`, which is the one over the list or the page of its own. Without
// scripting nothing asks, the list stays empty, and the name is checked only
// when the key is made. What is typed is held back a moment, so that a word is
// asked once and not at every letter, and an answer that arrives after a later
// question was asked is not drawn over it.
const suggesting = (inside: string): string => `
              var asking = document.querySelector(${JSON.stringify(inside)});
              if (asking && window.fetch) {
                var yearList = asking.querySelector('select[name="year"]');
                var sportList = asking.querySelector('select[name="sport"]');
                var nameBox = asking.querySelector('input[name="tournamentName"]');
                var names = asking.querySelector("datalist");
                if (yearList && sportList && nameBox && names) {
                  var latest = 0;
                  var waiting;
                  var suggest = function () {
                    latest += 1;
                    var mine = latest;
                    var address = "${tournamentNamesPath}?year=" + encodeURIComponent(yearList.value) +
                      "&sport=" + encodeURIComponent(sportList.value) +
                      "&typed=" + encodeURIComponent(nameBox.value);
                    fetch(address, { headers: { accept: "application/json" }, credentials: "same-origin" })
                      .then(function (response) { return response.ok ? response.json() : { names: [] }; })
                      .then(function (answer) {
                        if (mine !== latest) return;
                        names.textContent = "";
                        for (var at = 0; at < answer.names.length; at += 1) {
                          var option = document.createElement("option");
                          option.value = answer.names[at];
                          names.appendChild(option);
                        }
                      })
                      .catch(function () {});
                  };
                  nameBox.addEventListener("input", function () {
                    window.clearTimeout(waiting);
                    waiting = window.setTimeout(suggest, 150);
                  });
                  nameBox.addEventListener("focus", suggest);
                  yearList.addEventListener("change", suggest);
                  sportList.addEventListener("change", suggest);
                  suggest();
                }
              }`;

const scripting = (
  speaking: Speaking,
  hasNewKey: boolean,
  hasLimit: boolean,
): string => `
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
              ${hasLimit ? suggesting("#api-key-dialog") : ""}
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

  // The years the website the reader is on has tournaments in, the newest
  // first, which are the years a key can be limited to a tournament of.
  const yearsOf = (request: FastifyRequest): Promise<readonly number[]> =>
    request.server.mediator.query(new TournamentYears(websiteOf(request).host));

  // The tournaments of a year and a sport on the website the reader is on.
  // Asked of a year that is none, as anything typed may be, it answers none.
  const tournamentsIn = async (
    request: FastifyRequest,
    year: string | undefined,
    sport: string | undefined,
  ) => {
    const asked = Number(year);
    if (
      year === undefined ||
      !Number.isSafeInteger(asked) ||
      asked < 1000 ||
      asked > 9999 ||
      !Sport.all.some(({ code }) => code === sport)
    ) {
      return [];
    }
    return request.server.mediator.query(
      new TournamentsInYear(websiteOf(request).host, asked, { sport }),
    );
  };

  // The tournament the form says, where it says one, found by the year, the
  // sport and the name as typed, which is compared as a reader would, without
  // regard to capitals or the spaces around it. Where two have the one name, the
  // one that starts first is the one meant.
  const tournamentSaid = async (request: FastifyRequest, typed: Typed) => {
    const name = (typed["tournamentName"] ?? "").trim().toLowerCase();
    if (name === "") return undefined;
    return (await tournamentsIn(request, typed["year"], typed["sport"])).find(
      (each) => each.name.trim().toLowerCase() === name,
    );
  };

  // What the keys name, by name, for their rows.
  const namedBy = (
    request: FastifyRequest,
    keys: readonly ApiKeyShown[],
  ): Promise<readonly TournamentNamed[]> =>
    request.server.mediator.query(
      new TournamentsNamed(
        keys.flatMap(({ tournament }) =>
          tournament === undefined ? [] : [tournament],
        ),
      ),
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
    const years = await yearsOf(request);
    const named = await namedBy(request, keys);
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
${keys.map((key, at) => keyShown(speaking, key, at, named)).join("\n")}
          </ul>`
}
          </div>
${renderModalDialog(shown.adding ?? formFor(speaking, {}, true, years), {
  id: "api-key-dialog",
  cancel: say("admin.modal.cancel"),
  reopen: shown.adding !== undefined,
})}${keys.length === 0 ? "" : revokeDialog(speaking)}${scripting(speaking, made !== undefined, years.length > 0)}`;
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
    hasLimit: boolean,
    code = 200,
  ): FastifyReply =>
    send(
      request,
      reply,
      dialog.title,
      addApiKeyPath,
      `${renderDialog(dialog)}${
        hasLimit
          ? `
        <script>
          (function () {${suggesting("section.dialog")}
          })();
        </script>`
          : ""
      }`,
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
    const years = await yearsOf(request);
    return showDialog(
      request,
      reply,
      formFor(speakingOf(request), {}, false, years),
      years.length > 0,
    );
  });

  // What the site has for a year and a sport, as the name is typed: the names
  // that hold what was typed, at most so many, since a year has some hundreds
  // and no reader looks through more than a few. Public, as the tournaments
  // are, but asked only by a reader signed in to a page that asks.
  server.get(tournamentNamesPath, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) {
      return reply
        .code(401)
        .header("cache-control", "no-store")
        .send({ names: [] });
    }
    const asked = typedFrom(request.query);
    const typed = (asked["typed"] ?? "").trim().toLowerCase();
    const found = await tournamentsIn(request, asked["year"], asked["sport"]);
    const names = [...new Set(found.map(({ name }) => name))]
      .filter((name) => name.toLowerCase().includes(typed))
      .slice(0, 20);
    return reply
      .header("cache-control", "no-store")
      .header("vary", "Cookie")
      .send({ names });
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
    const overList = typed["over"] === "list";
    const years = await yearsOf(request);
    const refusing = async (
      broken: readonly BrokenRule[],
    ): Promise<FastifyReply> => {
      const refused = refusedForm(
        formFor(speaking, typed, overList, years),
        typed,
        broken,
        speaking,
      );
      return overList
        ? showKeys(request, reply, reader.value, {
            adding: refused,
            code: 422,
          })
        : showDialog(request, reply, refused, years.length > 0, 422);
    };
    // One tournament is meant where the form says so, and has to exist for
    // the year and sport chosen: a key limited to a tournament made up would
    // open nothing, and a reader who mistyped would not know.
    const limited =
      typed["limit"] === "one"
        ? await tournamentSaid(request, typed)
        : undefined;
    if (typed["limit"] === "one" && limited === undefined) {
      return refusing([
        { code: "ApiKeyTournament.NotFound", fields: ["tournamentName"] },
      ]);
    }
    let made: string;
    try {
      made = (
        await request.server.mediator.send(
          new CreateApiKey(
            reader.value,
            typed["label"] ?? "",
            typed["write"] === undefined ? "read" : "read-and-write",
            limited?.id,
            request.requestedAt,
          ),
        )
      ).key;
    } catch (failure) {
      // Forgetting an account ends its sessions afterwards, not with it, so a
      // form sent in between comes from a reader signed in to nothing.
      if (accountForgotten(failure)) return toSignIn(request, reply);
      if (!(failure instanceof RequestInvalid)) throw failure;
      return refusing(failure.broken);
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
