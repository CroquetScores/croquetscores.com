// The page that changes a commentary's title, at the commentary's address
// followed by "edit", reached from the pencil beside its title. It holds the
// title the commentary has now, so that a small correction is a small edit,
// and a title that breaks a rule, or that another commentary on the
// tournament has, is said beneath the field with what was typed put back. As
// on the page that starts a commentary (startCommentary.ts), the field puts no
// limit on what is typed. A sound title is kept, and the writer taken back to
// the commentary, which keeps its slug and so is where it was.
//
// Only the commentary's writer has the page. A reader not signed in is sent to
// sign in and brought back; anybody else is answered as though it were not
// there, as it is not for them. It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import { ChangeCommentaryTitle } from "../../application/operations/tournaments/ChangeCommentaryTitle.js";
import type { TournamentCommentaryToRead } from "../../application/operations/tournaments/PublicCommentaryOfTournament.js";
import { AccountRefused } from "../../domain/aggregates/accounts/Account.js";
import { CommentaryRefused } from "../../domain/aggregates/tournaments/commentaries/Commentary.js";
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { Assets } from "../common/assets.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import {
  type CommentaryParams,
  commentaryOf,
  goneSinceAsked,
} from "./commentary.js";
import { toSignIn } from "./profile.js";
import { yearInPath } from "./year.js";

// What the commentary refuses of a title that is the title's to put right,
// said beneath the field as a rule the title breaks is.
const saidOfTheTitle: readonly string[] = ["Commentary.TitleTaken"];

const formFor = (speaking: Speaking, action: string, typed: Typed): Dialog => ({
  title: speaking.say("changeCommentaryTitle.title"),
  action,
  fields: [
    {
      name: "title",
      label: speaking.say("startCommentary.titleField"),
      type: "text",
      autocomplete: "off",
      value: typed["title"],
    },
  ],
  submit: speaking.say("changeCommentaryTitle.submit"),
});

// The commentary the address names, where the reader writes it; nothing
// otherwise, which answers the page as one that is not there.
const writtenBy = async (
  request: FastifyRequest<{ Params: CommentaryParams }>,
): Promise<TournamentCommentaryToRead | undefined> => {
  const asked = await commentaryOf(request);
  return asked?.commentary.writtenByReader === true ? asked : undefined;
};

export const registerChangeCommentaryTitlePage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const path = `/${yearInPath}/:sport/:slug/commentaries/:commentary/edit`;

  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    asked: TournamentCommentaryToRead,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // The writer's own, and holding what they typed when refused.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            notes: asked.notes,
          },
          title: dialog.title,
          theme: themeOf(request),
          signedIn: true,
          hasPassword: hasPassword(request),
          speaking: speakingOf(request),
          siteName: siteNameOf(request),
          tryWebsite: websiteOf(request).isTry,
          path: request.url,
          frame: "bare",
          body: renderDialog(dialog),
        }),
      );

  server.get<{ Params: CommentaryParams }>(path, async (request, reply) => {
    if (readerOf(request) === undefined) return toSignIn(request, reply);
    const asked = await writtenBy(request);
    if (asked === undefined) return reply.callNotFound();
    return show(
      request,
      reply,
      asked,
      formFor(speakingOf(request), `/${asked.commentary.address}/edit`, {
        title: asked.commentary.title,
      }),
    );
  });

  server.post<{ Params: CommentaryParams }>(path, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const asked = await writtenBy(request);
    if (asked === undefined) return reply.callNotFound();
    const speaking = speakingOf(request);
    const typed = typedFrom(request.body);
    const action = `/${asked.commentary.address}/edit`;
    const refused = (broken: readonly BrokenRule[]): FastifyReply =>
      show(
        request,
        reply,
        asked,
        refusedForm(formFor(speaking, action, typed), typed, broken, speaking),
        422,
      );
    try {
      await request.server.mediator.send(
        new ChangeCommentaryTitle(
          reader.value,
          asked.commentary.tournament,
          asked.commentary.id,
          typed["title"] ?? "",
          request.requestedAt,
        ),
      );
    } catch (failure) {
      // Forgetting an account ends its sessions afterwards, not with it, so a
      // form sent in between comes from a reader signed in to nothing.
      if (
        failure instanceof AccountRefused &&
        failure.code === "Account.Forgotten"
      ) {
        return toSignIn(request, reply);
      }
      if (failure instanceof RequestInvalid) return refused(failure.broken);
      if (
        failure instanceof CommentaryRefused &&
        saidOfTheTitle.includes(failure.code)
      ) {
        return refused([{ code: failure.code, fields: ["title"] }]);
      }
      if (goneSinceAsked(failure)) return reply.callNotFound();
      throw failure;
    }
    // Encoded, since a slug keeps letters of any script, and an address in the
    // Location header that is not encoded is refused for them.
    return reply.redirect(encodeURI(`/${asked.commentary.address}`), 303);
  });
};
