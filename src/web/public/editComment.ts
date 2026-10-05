// A comment's own page, where the commentary's writer edits it, at the
// commentary's address followed by "comments", the comment id's own
// characters and "edit", so that the address says which comment it is
// whatever the comment says. It holds what the comment says now in a box four
// lines tall, as the box a comment is written in is. A sound edit is kept and
// the writer taken back to the commentary; one refused is said beneath the box
// with what was typed put back.
//
// It edits and does nothing else. A comment is deleted from the trash can
// beside it on the commentary, which asks first in a modal dialog where there
// is scripting (commentary.ts); where there is none, the trash can leads here
// instead, to a page of the comment's own that asks the same, and only a
// delete confirmed there takes the comment away. Calling it off goes back to
// the commentary.
//
// Only the commentary's writer has these pages. A reader not signed in is sent
// to sign in; anybody else is answered as though they were not there, as they
// are not for them, and so is a comment that has been deleted.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { DeleteComment } from "../../application/operations/commentaries/DeleteComment.js";
import { EditComment } from "../../application/operations/commentaries/EditComment.js";
import type {
  PublicComment,
  TournamentCommentaryToRead,
} from "../../application/operations/tournaments/PublicCommentaryOfTournament.js";
import { AccountRefused } from "../../domain/aggregates/accounts/Account.js";
import { CommentaryRefused } from "../../domain/aggregates/tournaments/commentaries/Commentary.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { typedFrom } from "../common/form.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  type CommentaryParams,
  commentaryOf,
  commentBox,
  commentDrawn,
  commentPath,
  commentScript,
  goneSinceAsked,
  deletePathOf,
} from "./commentary.js";
import { toSignIn } from "./profile.js";
import { sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

type Params = CommentaryParams & { comment: string };

interface Found {
  readonly asked: TournamentCommentaryToRead;
  readonly comment: PublicComment;
}

// The commentary and the comment the address names, where the reader writes
// the commentary and the comment is still in it; nothing otherwise.
const foundFor = async (
  request: FastifyRequest<{ Params: Params }>,
): Promise<Found | undefined> => {
  const asked = await commentaryOf(request);
  if (asked === undefined || !asked.commentary.writtenByReader) {
    return undefined;
  }
  const comment = asked.commentary.comments.find(
    (each) => each.id === `comment/${request.params.comment}`,
  );
  return comment === undefined ? undefined : { asked, comment };
};

export const registerEditCommentPages = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const comment = `/${yearInPath}/:sport/:slug/commentaries/:commentary/comments/:comment`;

  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    asked: TournamentCommentaryToRead,
    title: string,
    body: string,
    code = 200,
  ): FastifyReply => {
    const speaking = speakingOf(request);
    return (
      reply
        .code(code)
        // The writer's own, and holding what they typed when refused.
        .header(
          "cache-control",
          code === 200 ? "private, no-cache" : "no-store",
        )
        .header("vary", "Cookie, Accept-Language")
        .type("text/html; charset=utf-8")
        .send(
          render(assets, {
            tournament: {
              name: asked.name,
              address: asked.address,
              notes: asked.notes,
            },
            title,
            sections: sectionsOf(asked, speaking),
            currentSection: `/${asked.address}/commentaries`,
            theme: themeOf(request),
            signedIn: true,
            hasPassword: hasPassword(request),
            speaking,
            siteName: siteNameOf(request),
            tryWebsite: websiteOf(request).isTry,
            path: request.url,
            body: `          <h1>${escape(asked.name)}</h1>
          <h2 class="commentary-title"><a href="/${escape(asked.commentary.address)}">${escape(asked.commentary.title)}</a></h2>
${body}`,
          }),
        )
    );
  };

  const editPage = (
    request: FastifyRequest,
    reply: FastifyReply,
    { asked, comment: found }: Found,
    box: { readonly typed: string; readonly messages: readonly string[] },
    code = 200,
  ): FastifyReply => {
    const { say } = speakingOf(request);
    return show(
      request,
      reply,
      asked,
      say("editComment.title"),
      `          <h3 class="comment-heading">${escape(say("editComment.title"))}</h3>
${commentBox(speakingOf(request), {
  action: commentPath(asked.commentary, found),
  submit: say("editComment.save"),
  ...box,
})}${commentScript}`,
      code,
    );
  };

  server.get<{ Params: Params }>(`${comment}/edit`, async (request, reply) => {
    if (readerOf(request) === undefined) return toSignIn(request, reply);
    const found = await foundFor(request);
    if (found === undefined) return reply.callNotFound();
    return editPage(request, reply, found, {
      typed: found.comment.text,
      messages: [],
    });
  });

  server.post<{ Params: Params }>(`${comment}/edit`, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const found = await foundFor(request);
    if (found === undefined) return reply.callNotFound();
    const typed = typedFrom(request.body)["text"] ?? "";
    try {
      await request.server.mediator.send(
        new EditComment(
          reader.value,
          found.asked.commentary.tournament,
          found.asked.commentary.id,
          found.comment.id,
          typed,
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (
        failure instanceof AccountRefused &&
        failure.code === "Account.Forgotten"
      ) {
        return toSignIn(request, reply);
      }
      if (failure instanceof CommentaryRefused || goneSinceAsked(failure)) {
        return reply.callNotFound();
      }
      if (!(failure instanceof RequestInvalid)) throw failure;
      const speaking = speakingOf(request);
      return editPage(
        request,
        reply,
        found,
        {
          typed,
          messages: failure.broken.map((rule) =>
            speaking.knows(rule.code)
              ? speaking.say(rule.code)
              : speaking.say("form.otherwise"),
          ),
        },
        422,
      );
    }
    // Encoded, here and once deleted, since a slug keeps letters of any
    // script, and an address in the Location header that is not encoded is
    // refused for them.
    return reply.redirect(encodeURI(`/${found.asked.commentary.address}`), 303);
  });

  server.get<{ Params: Params }>(
    `${comment}/delete`,
    async (request, reply) => {
      if (readerOf(request) === undefined) return toSignIn(request, reply);
      const found = await foundFor(request);
      if (found === undefined) return reply.callNotFound();
      const { say } = speakingOf(request);
      const { asked } = found;
      return show(
        request,
        reply,
        asked,
        say("deleteComment.title"),
        `          <h3 class="comment-heading">${escape(say("deleteComment.title"))}</h3>
          <p class="delete-question">${escape(say("deleteComment.question"))}</p>
          <div class="comment-text delete-comment">${commentDrawn(found.comment.text)}</div>
          <form class="delete-form" method="post" action="${escape(deletePathOf(asked.commentary, found.comment))}">
            <button class="button button-submit" type="submit">${escape(say("deleteComment.confirm"))}</button>
          </form>
          <p class="delete-keep"><a href="/${escape(asked.commentary.address)}">${escape(say("deleteComment.keep"))}</a></p>`,
      );
    },
  );

  server.post<{ Params: Params }>(
    `${comment}/delete`,
    async (request, reply) => {
      const reader = readerOf(request);
      if (reader === undefined) return toSignIn(request, reply);
      const found = await foundFor(request);
      if (found === undefined) return reply.callNotFound();
      try {
        await request.server.mediator.send(
          new DeleteComment(
            reader.value,
            found.asked.commentary.tournament,
            found.asked.commentary.id,
            found.comment.id,
            request.requestedAt,
          ),
        );
      } catch (failure) {
        if (
          failure instanceof AccountRefused &&
          failure.code === "Account.Forgotten"
        ) {
          return toSignIn(request, reply);
        }
        if (failure instanceof CommentaryRefused || goneSinceAsked(failure)) {
          return reply.callNotFound();
        }
        throw failure;
      }
      return reply.redirect(
        encodeURI(`/${found.asked.commentary.address}`),
        303,
      );
    },
  );
};
