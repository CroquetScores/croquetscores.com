// A commentary's page: its title as the heading of its content, its writer's
// name beneath it, and its comments the first written first, each drawn from
// its Markdown with how long ago it was written, and saying so where it has
// been edited. Its writer, and only its writer, is offered a box beneath the
// last comment to write the next one in, and a way to edit each comment. Its
// sections are the tournament's, with Commentary marked.
//
// A comment written in the box is added, and the page shown again with the box
// empty; one refused is said beneath the box with what was typed put back. It
// needs no scripting.
import type { FastifyInstance, FastifyRequest } from "fastify";
import MarkdownIt from "markdown-it";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { AddComment } from "../../application/operations/commentaries/AddComment.js";
import {
  type PublicComment,
  PublicCommentaryOfTournament,
  type TournamentCommentaryToRead,
} from "../../application/operations/tournaments/PublicCommentaryOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import { AccountRefused } from "../../domain/aggregates/accounts/Account.js";
import { CommentaryRefused } from "../../domain/aggregates/tournaments/commentaries/Commentary.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { typedFrom } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { signInPath } from "./signIn.js";
import { sendPage } from "./tournamentLists.js";
import { ago, sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

export type CommentaryParams = {
  year: string;
  sport: string;
  slug: string;
  commentary: string;
};

// What answers a commentary's pages as ones that are not there.
const notThere: readonly string[] = [
  "PublicCommentaryOfTournament.NoSuchTournament",
  "PublicCommentaryOfTournament.NoSuchCommentary",
];

// HTML is turned off, so that a comment is drawn from its Markdown alone,
// whatever was kept: the tags were taken out when it was written
// (CommentText.ts), and this is the second of the two locks. A line break is
// a line break, since a comment is typed on a phone by somebody who has never
// heard that Markdown wants two. A web address written out with its scheme,
// and an email address, are drawn as links without the Markdown a link is
// otherwise written in, as the old site drew them; a name with no scheme, as
// "example.com", is left as it is, as it was there, since a word with a full
// stop in it is not always an address.
const markdown = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});
markdown.linkify.set({ fuzzyLink: false });

// A link in a comment is one the site does not vouch for, so that a search
// engine gives it nothing, which is what a link put in a commentary to sell
// something is after; and the page it leads to is told nothing of this one.
const drawLink = markdown.renderer.rules.link_open;
markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index]?.attrSet("rel", "nofollow ugc noopener noreferrer");
  return drawLink === undefined
    ? self.renderToken(tokens, index, options)
    : drawLink(tokens, index, options, env, self);
};

// A number and a full stop or a bracket beginning a line, which Markdown takes
// for an item of a numbered list.
const TURN_NUMBER = /^(\d+)([.)])(?=\s|$)/gm;

/**
 * What a comment says, drawn from its Markdown, with no HTML of its own. A
 * line beginning with a number and a full stop or a bracket, as "5. Sam
 * roquets Alex", is drawn as it was written, as the old site drew it: a
 * commentator numbers turns, and a numbered list would number "5." and "7."
 * as 5 and 6. The stop or the bracket is escaped as it is drawn, and what was
 * kept is as it was written.
 */
export const commentDrawn = (text: string): string =>
  markdown.render(text.replace(TURN_NUMBER, "$1\\$2"));

// Two shapes, drawn here rather than fetched or set in a font, as the account
// menu's is: they cost no request, and they take the colour of the link they
// are in. Hidden from anyone reading the page aloud, since each link says in
// words what it is for.
export const pencil = `<svg class="icon icon-pencil" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm17.7-10.2a1 1 0 0 0 0-1.42l-2.33-2.33a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" /></svg>`;
const trashCan = `<svg class="icon icon-trash-can" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" /></svg>`;

/**
 * What scripting adds to a commentary's pages, where there is scripting. A
 * comment written in the commentary's box is added in place: sent in the
 * background, and the comment the server draws of it put after the last, with
 * the box emptied, or what is wrong with it said beneath the box, so that the
 * page is not drawn again and the writer stays where they were. Ctrl and
 * Enter, or Command and Enter on a Mac, send what is in a comment box, as its
 * button does. And the trash can beside a comment asks in the modal dialog
 * before deleting it, rather than leading to the page that asks, which is
 * where it leads without scripting.
 *
 * Each is a quicker way to what can be done with none, so nothing is lost
 * where it does not run; and where the server answers a comment sent in the
 * background by sending the page elsewhere — to sign in, say, for a writer
 * signed out since the page was opened — the page goes there. A comment is
 * never sent twice by the page: one not answered may have been kept, so where
 * there is no answer, or one that says nothing of the comment, the page says
 * beneath the box that it could not be sent, and that loading the page again
 * will show whether it was kept. Once a comment is sent, the page is scrolled so that the
 * button that sends it is at the bottom of the window, with the comment just
 * added, or what is wrong with it, just above it.
 *
 * The comments are asked for again every quarter of a minute, while the page
 * can be seen, and drawn again when one has been written, edited or deleted —
 * otherwise only how long ago each was written is put in its place, so that
 * what has the focus in them keeps it. An answer asked for before a comment
 * was added in place, and coming after it, is not drawn, since it is about the
 * comments as they were. so that a reader sees
 * what has been written, edited or deleted since without loading the page
 * again. Asked for, rather than sent by the server as they are written: that
 * would hold a connection open for every reader of every commentary, and need
 * every one of the site's processes told of a comment another kept, for a
 * commentary that is written a few times a game. A quarter of a minute is soon
 * enough to follow a game by.
 *
 * The keys and the trash can are listened for on the whole page rather than
 * on each box and each comment, so that a comment added in place, or drawn
 * again, has them too.
 */
export const commentScript = `
    <script>
      (function () {
        document.addEventListener("keydown", function (event) {
          var box = event.target;
          if (!box.classList || !box.classList.contains("comment-box")) return;
          if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
          event.preventDefault();
          box.form.requestSubmit();
        });

        var live = document.querySelector("[data-refresh]");
        if (live && window.fetch) {
          // Which comments the page shows and when each was last edited, so
          // that they are drawn again only when one has been written, edited
          // or deleted, and what has the focus in them keeps it otherwise; and
          // how many have been added in place, so that an answer asked for
          // before one was is not drawn over it.
          var shownKey = live.getAttribute("data-key");
          var asking = false;
          var ask = function () {
            if (document.hidden || asking) return;
            asking = true;
            var since = window.commentsAddedInPlace || 0;
            fetch(live.getAttribute("data-refresh"), {
              headers: { accept: "application/json" },
              credentials: "same-origin",
            })
              .then(function (response) {
                return response.ok ? response.json() : null;
              })
              .then(function (answer) {
                if (!answer || (window.commentsAddedInPlace || 0) !== since) return;
                if (answer.key !== shownKey) {
                  shownKey = answer.key;
                  live.innerHTML = answer.comments;
                  return;
                }
                // Nothing written, edited or deleted: only how long ago each
                // was written, put in its place.
                live.querySelectorAll(".comment-ago").forEach(function (ago, at) {
                  if (answer.ago[at] !== undefined) ago.innerHTML = answer.ago[at];
                });
              })
              .catch(function () {})
              .then(function () {
                asking = false;
              });
          };
          setInterval(ask, 15000);
          window.askForComments = ask;
          document.addEventListener("visibilitychange", function () {
            if (!document.hidden) ask();
          });
        }

        var adding = document.querySelector(".comment-form-add");
        if (adding && window.fetch) {
          var box = adding.querySelector(".comment-box");
          var button = adding.querySelector("button[type=submit]");
          var say = function (messages) {
            var beneath = document.getElementById("comment-text-message");
            if (messages.length === 0) {
              if (beneath) beneath.remove();
              box.removeAttribute("aria-describedby");
              box.removeAttribute("aria-invalid");
              return;
            }
            if (!beneath) {
              beneath = document.createElement("p");
              beneath.className = "field-message";
              beneath.id = "comment-text-message";
              box.insertAdjacentElement("afterend", beneath);
            }
            beneath.replaceChildren.apply(beneath, messages.map(function (text) {
              var line = document.createElement("span");
              line.textContent = text;
              return line;
            }));
            box.setAttribute("aria-describedby", beneath.id);
            box.setAttribute("aria-invalid", "true");
          };
          // The button at the bottom of the window, with what was just added,
          // or what is wrong with it, above it, and the box ready for the next.
          var settle = function () {
            box.focus({ preventScroll: true });
            button.scrollIntoView({ block: "end", behavior: "instant" });
          };
          adding.addEventListener("submit", function (event) {
            event.preventDefault();
            if (button.disabled) return;
            button.disabled = true;
            fetch(adding.action, {
              method: "POST",
              headers: { accept: "application/json" },
              body: new URLSearchParams(new FormData(adding)),
              credentials: "same-origin",
            })
              .then(function (response) {
                // Sent elsewhere, as a writer signed out since is sent to sign
                // in: the page goes there, and the comment is not sent again.
                if (response.redirected) {
                  window.location.assign(response.url);
                  return;
                }
                var json = (response.headers.get("content-type") || "").indexOf("application/json") === 0;
                if (!json || (response.status !== 200 && response.status !== 422)) throw new Error("not answered");
                return response.json().then(function (answer) {
                  if (response.status === 422) {
                    say(answer.messages);
                    return settle();
                  }
                  window.commentsAddedInPlace = (window.commentsAddedInPlace || 0) + 1;
                  var list = document.querySelector("main .comments");
                  if (!list) {
                    list = document.createElement("ol");
                    list.className = "comments";
                    document.querySelector("main .comments-none").replaceWith(list);
                  }
                  // Shown already where the comments asked for again came
                  // back first, and with it, and not shown a second time.
                  if (!list.querySelector('[data-comment="' + answer.id + '"]')) {
                    list.insertAdjacentHTML("beforeend", answer.comment);
                  }
                  box.value = "";
                  say([]);
                  settle();
                  // Asked for again, so that the page knows the comments it
                  // now shows, and a comment it could not draw is drawn.
                  if (window.askForComments) window.askForComments();
                });
              })
              // Not sent, or sent and not answered, and so perhaps kept: never
              // sent again by the page, which could keep it twice.
              .catch(function () {
                say([adding.getAttribute("data-not-sent")]);
                settle();
              })
              .then(function () {
                button.disabled = false;
              });
          });
        }

        var dialog = document.getElementById("delete-dialog");
        if (!dialog || typeof dialog.showModal !== "function") return;
        var shown = dialog.querySelector(".delete-comment");
        var form = dialog.querySelector("form");
        var opener;
        document.addEventListener("click", function (event) {
          var trash = event.target.closest && event.target.closest(".comment-delete");
          if (!trash) return;
          event.preventDefault();
          opener = trash;
          // The comment as the page already draws it, so the dialog shows
          // what the reader saw, and nothing new is drawn from it.
          var drawn = trash.closest(".comment").querySelector(".comment-text");
          shown.replaceChildren.apply(shown, Array.prototype.map.call(drawn.childNodes, function (node) { return node.cloneNode(true); }));
          // The page that asks is the address a delete is sent to as well.
          form.action = trash.href;
          dialog.showModal();
        });
        dialog.querySelector(".dialog-cancel").addEventListener("click", function () {
          dialog.close();
        });
        // Whatever opened it has the focus back once it closes, so that the
        // reader is where they were.
        dialog.addEventListener("close", function () {
          if (opener) opener.focus();
        });
      })();
    </script>`;

// The modal dialog the trash can opens where there is scripting (STYLE.md
// §5c). Which comment it shows, and where its form sends the delete, are
// filled in by the script as it opens.
const deleteDialog = (speaking: Speaking): string => {
  const { say } = speaking;
  return `
          <dialog class="modal-dialog dialog" id="delete-dialog" aria-labelledby="delete-dialog-title">
            <h2 class="dialog-title" id="delete-dialog-title">${escape(say("deleteComment.title"))}</h2>
            <form class="dialog-form" method="post">
              <div class="dialog-content stack">
                <p>${escape(say("deleteComment.question"))}</p>
                <div class="comment-text delete-comment"></div>
              </div>
              <div class="dialog-buttons">
                <button class="button button-submit" type="submit">${escape(say("deleteComment.confirm"))}</button>
                <button class="button dialog-cancel" type="button">${escape(say("admin.modal.cancel"))}</button>
              </div>
            </form>
          </dialog>`;
};

/** Where a comment's own page is, by its id's own characters. */
export const commentPath = (
  commentary: { readonly address: string },
  comment: { readonly id: string },
): string =>
  `/${commentary.address}/comments/${comment.id.slice(comment.id.indexOf("/") + 1)}/edit`;

/** Where the page that asks before deleting a comment is. */
export const deletePathOf = (
  commentary: { readonly address: string },
  comment: { readonly id: string },
): string => commentPath(commentary, comment).replace(/\/edit$/, "/delete");

/**
 * The commentary the address names, as a reader may follow it and as `reader`
 * is told whether they write it, or nothing where there is none, which
 * answers the page as one that is not there.
 */
export const commentaryOf = async (
  request: FastifyRequest<{ Params: CommentaryParams }>,
): Promise<TournamentCommentaryToRead | undefined> => {
  const { year, sport, slug, commentary } = request.params;
  try {
    return await request.server.mediator.query(
      new PublicCommentaryOfTournament(
        websiteOf(request).host,
        `${year}/${sport}/${slug}`,
        commentary,
        readerOf(request)?.value,
      ),
    );
  } catch (failure) {
    if (
      failure instanceof TournamentOperationRefused &&
      notThere.includes(failure.code)
    ) {
      return undefined;
    }
    throw failure;
  }
};

// The box the writer writes the next comment in, four lines tall: enough to
// see what is being written on a phone without the box filling the screen.
// What was typed is put back, and a rule it broke said beneath it.
export const commentBox = (
  speaking: Speaking,
  {
    action,
    submit,
    typed,
    messages,
    inPlace = false,
  }: {
    readonly action: string;
    readonly submit: string;
    readonly typed: string;
    readonly messages: readonly string[];
    /** Whether, with scripting, what it sends is added in place. */
    readonly inPlace?: boolean;
  },
): string => {
  const described =
    messages.length === 0 ? "" : ` aria-describedby="comment-text-message"`;
  const wrong = messages.length === 0 ? "" : ` aria-invalid="true" autofocus`;
  const beneath =
    messages.length === 0
      ? ""
      : `\n              <p class="field-message" id="comment-text-message">${messages.map((text) => `<span>${escape(text)}</span>`).join(" ")}</p>`;
  const notSent = inPlace
    ? ` data-not-sent="${escape(speaking.say("commentary.notSent"))}"`
    : "";
  return `            <form class="comment-form${inPlace ? " comment-form-add" : ""}" method="post" action="${escape(action)}"${notSent}>
              <label class="comment-label" for="comment-text">${escape(speaking.say("commentary.comment"))}</label>
              <textarea class="comment-box" id="comment-text" name="text" rows="4"${described}${wrong}>${escape(typed)}</textarea>${beneath}
              <button class="button button-submit" type="submit">${escape(submit)}</button>
            </form>`;
};

// One comment as the page lists it: what it says, drawn from its Markdown,
// how long before `now` it was written, whether it has been edited, and, for
// the commentary's writer, the pencil and the trash can. The page lists its
// comments this way, and a comment added in place is drawn this way too, so
// that the two are the same.
const commentShown = (
  commentary: TournamentCommentaryToRead["commentary"],
  comment: PublicComment,
  now: Date,
  speaking: Speaking,
): string => {
  const { say } = speaking;
  return `            <li class="comment" data-comment="${escape(comment.id)}">
              <div class="comment-text">${commentDrawn(comment.text)}</div>
              <p class="comment-about"><span class="comment-ago">${ago(ReadOnlyDate.from(new Date(comment.writtenAt)), now, speaking)}</span>${comment.lastEditedAt === undefined ? "" : ` <span class="comment-edited">${escape(say("commentary.edited"))}</span>`}${commentary.writtenByReader ? ` <a class="comment-edit" href="${escape(commentPath(commentary, comment))}">${pencil}<span class="visually-hidden">${escape(say("commentary.edit"))}</span></a> <a class="comment-delete" href="${escape(deletePathOf(commentary, comment))}">${trashCan}<span class="visually-hidden">${escape(say("commentary.delete"))}</span></a>` : ""}</p>
            </li>`;
};

// The comments as the page lists them, the first written first, or what the
// page says when there are none: what the page is drawn with, and what it is
// given again when it asks for the comments as they are now.
const commentsShown = (
  commentary: TournamentCommentaryToRead["commentary"],
  now: Date,
  speaking: Speaking,
): string =>
  commentary.comments.length === 0
    ? `          <p class="comments-none">${escape(speaking.say("commentary.none"))}</p>`
    : `          <ol class="comments">
${commentary.comments
  .map((comment) => commentShown(commentary, comment, now, speaking))
  .join("\n")}
          </ol>`;

// Which comments there are, and when each was last edited: what the page
// compares to tell whether the comments have changed since it drew them, which
// how long ago each was written, changing by the second, would not tell it.
const keyOf = (commentary: TournamentCommentaryToRead["commentary"]): string =>
  commentary.comments
    .map((comment) => `${comment.id}@${comment.lastEditedAt ?? ""}`)
    .join(" ");

const pageOf = (
  request: FastifyRequest,
  assets: Assets,
  asked: TournamentCommentaryToRead,
  box: { readonly typed: string; readonly messages: readonly string[] },
): string => {
  const speaking = speakingOf(request);
  const { say } = speaking;
  const { commentary } = asked;
  const now = request.requestedAt.toDate();
  // Beneath the last comment, since the comments read downwards and the next
  // one goes where it will be read.
  const writing = commentary.writtenByReader
    ? `\n${commentBox(speaking, {
        action: `/${commentary.address}/comments`,
        submit: say("commentary.add"),
        inPlace: true,
        ...box,
      })}${deleteDialog(speaking)}`
    : "";
  return render(assets, {
    tournament: { name: asked.name, address: asked.address },
    title: `${commentary.title} - ${asked.name}`,
    sections: sectionsOf(asked, speaking),
    currentSection: `/${asked.address}/commentaries`,
    theme: themeOf(request),
    signedIn: signedIn(request),
    hasPassword: hasPassword(request),
    speaking,
    siteName: siteNameOf(request),
    tryWebsite: websiteOf(request).isTry,
    // The commentary's own address, wherever the page is drawn from, so that
    // the theme and the language chosen on a page shown again for a refused
    // comment come back to the commentary, and not to the address comments
    // are sent to, which answers the page's script and not a reader.
    path: encodeURI(`/${commentary.address}`),
    body: `          <h1>${escape(asked.name)}</h1>
          <div class="commentary-heading">
            <h2 class="commentary-title">${escape(commentary.title)}</h2>${commentary.writtenByReader ? `\n            <a class="commentary-title-edit" href="/${escape(commentary.address)}/edit">${pencil}<span class="visually-hidden">${escape(say("commentary.edit"))}</span></a>` : ""}
          </div>
          <p class="commentary-writer">${escape(commentary.writer)}</p>
          <div class="commentary-comments" data-refresh="/${escape(commentary.address)}/comments" data-key="${escape(keyOf(commentary))}">
${commentsShown(commentary, now, speaking)}
          </div>${writing}${commentScript}`,
  });
};

export const registerCommentaryPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const path = `/${yearInPath}/:sport/:slug/commentaries/:commentary`;

  server.get<{ Params: CommentaryParams }>(path, async (request, reply) => {
    const asked = await commentaryOf(request);
    if (asked === undefined) return reply.callNotFound();
    // An address the tournament has moved on from leads to the commentary
    // where it is now, for good, so that a link kept from before still works.
    const { year, sport, slug, commentary } = request.params;
    if (asked.address !== `${year}/${sport}/${slug}`) {
      // Encoded, since a slug keeps letters of any script, and an address in
      // the Location header that is not encoded is refused for them.
      return reply.redirect(
        encodeURI(`/${asked.address}/commentaries/${commentary}`),
        301,
      );
    }
    return sendPage(
      reply,
      request,
      pageOf(request, assets, asked, { typed: "", messages: [] }),
    );
  });

  // The comments as they are now, drawn as the page draws them, for the page
  // to draw again where they have changed. Drawn for whoever asks, so that a
  // writer's own comments come with their pencil and their trash can. Asked
  // for by the page's script and never by a reader, so it answers nothing but
  // the comments, and is never kept by anything in between.
  server.get<{ Params: CommentaryParams }>(
    `${path}/comments`,
    async (request, reply) => {
      const asked = await commentaryOf(request);
      if (asked === undefined) return reply.callNotFound();
      const now = request.requestedAt.toDate();
      const speaking = speakingOf(request);
      return reply.header("cache-control", "no-store").send({
        key: keyOf(asked.commentary),
        ago: asked.commentary.comments.map((comment) =>
          ago(ReadOnlyDate.from(new Date(comment.writtenAt)), now, speaking),
        ),
        comments: commentsShown(asked.commentary, now, speaking),
      });
    },
  );

  server.post<{ Params: CommentaryParams }>(
    `${path}/comments`,
    async (request, reply) => {
      // Back to the commentary once signed in, rather than to the address
      // comments are sent to, which is no page to come back to.
      const { year, sport, slug, commentary: commentarySlug } = request.params;
      const toSignInHere = () =>
        reply.redirect(
          `${signInPath}?return=${encodeURIComponent(`/${year}/${sport}/${slug}/commentaries/${commentarySlug}`)}`,
          303,
        );
      const reader = readerOf(request);
      if (reader === undefined) return toSignInHere();
      const asked = await commentaryOf(request);
      if (asked === undefined) return reply.callNotFound();
      const typed = typedFrom(request.body)["text"] ?? "";
      // Asked for by the page's own script, which adds the comment in place
      // and so wants the comment, or what is wrong with it, rather than a page.
      const inPlace = (request.headers.accept ?? "").includes(
        "application/json",
      );
      const speaking = speakingOf(request);
      let added;
      try {
        added = await request.server.mediator.send(
          new AddComment(
            reader.value,
            asked.commentary.tournament,
            asked.commentary.id,
            typed,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (
          failure instanceof AccountRefused &&
          failure.code === "Account.Forgotten"
        ) {
          return toSignInHere();
        }
        // Only its writer is offered the box, so anybody else sending it is
        // asking of a page that is not there for them.
        if (failure instanceof CommentaryRefused) return reply.callNotFound();
        if (!(failure instanceof RequestInvalid)) throw failure;
        const messages = failure.broken.map((rule) =>
          speaking.knows(rule.code)
            ? speaking.say(rule.code)
            : speaking.say("form.otherwise"),
        );
        if (inPlace) {
          return reply
            .code(422)
            .header("cache-control", "no-store")
            .send({ messages });
        }
        return reply
          .code(422)
          .header("cache-control", "no-store")
          .type("text/html; charset=utf-8")
          .send(pageOf(request, assets, asked, { typed, messages }));
      }
      if (inPlace) {
        // Drawn as the page draws every comment, from the commentary as it is
        // now, so that it is the comment as it was kept.
        const after = await commentaryOf(request);
        const comment = after?.commentary.comments.find(
          (each) => each.id === added.value,
        );
        // Answered as kept whatever is found, since it was: a comment that
        // cannot be drawn here is drawn when the page asks for the comments
        // again, as it does once one is added.
        return reply.header("cache-control", "no-store").send({
          id: added.value,
          comment:
            after === undefined || comment === undefined
              ? ""
              : commentShown(
                  after.commentary,
                  comment,
                  request.requestedAt.toDate(),
                  speaking,
                ),
        });
      }
      // Shown again by asking for it again, so that a reload does not send
      // the comment a second time.
      return reply.redirect(encodeURI(`/${asked.commentary.address}`), 303);
    },
  );
};
