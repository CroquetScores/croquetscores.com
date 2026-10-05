// The page that starts a commentary on a tournament, at its commentaries page
// followed by "create", where the old site had it. It asks for a title and
// nothing else: what the commentary says is written on its own page, which the
// reader is taken to once it is started. A title that breaks a rule, or that
// another commentary on the tournament has, is said beneath the field with
// what was typed put back. The field puts no limit on what is typed, since a
// browser counts what is typed and a title is counted with its tags and its
// spaces taken out; a title too long is said beneath it as any rule is.
//
// Any account will do, and a reader who is not signed in is sent to sign in
// and brought back. It needs no scripting.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import {
  PublicCommentariesOfTournament,
  type TournamentCommentariesToRead,
} from "../../application/operations/tournaments/PublicCommentariesOfTournament.js";
import { StartCommentary } from "../../application/operations/tournaments/StartCommentary.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import { AccountRefused } from "../../domain/aggregates/accounts/Account.js";
import { TournamentRefused } from "../../domain/aggregates/tournaments/Tournament.js";
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { Assets } from "../common/assets.js";
import { renderDialog, type Dialog } from "../common/dialog.js";
import { refusedForm, typedFrom, type Typed } from "../common/form.js";
import { speakingOf, type Speaking } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, readerOf } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { goneSinceAsked } from "./commentary.js";
import { toSignIn } from "./profile.js";
import { yearInPath } from "./year.js";

type Params = { year: string; sport: string; slug: string };

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicCommentariesOfTournament.NoSuchTournament",
];

// What the tournament refuses of a title that is the title's to put right,
// said beneath the field as a rule the title breaks is.
const saidOfTheTitle: readonly string[] = ["Tournament.CommentaryTitleTaken"];

const formFor = (speaking: Speaking, action: string, typed: Typed): Dialog => ({
  title: speaking.say("startCommentary.title"),
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
  submit: speaking.say("startCommentary.submit"),
});

export const registerStartCommentaryPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  const path = `/${yearInPath}/:sport/:slug/commentaries/create`;

  // The tournament the address names, as a reader may follow it, or nothing
  // where there is none, which answers the page as one that is not there.
  const tournamentOf = async (
    request: FastifyRequest<{ Params: Params }>,
  ): Promise<TournamentCommentariesToRead | undefined> => {
    const { year, sport, slug } = request.params;
    try {
      return await request.server.mediator.query(
        new PublicCommentariesOfTournament(
          websiteOf(request).host,
          `${year}/${sport}/${slug}`,
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

  const show = (
    request: FastifyRequest,
    reply: FastifyReply,
    tournament: TournamentCommentariesToRead,
    dialog: Dialog,
    code = 200,
  ): FastifyReply =>
    reply
      .code(code)
      // Asked of somebody signed in, and holding what they typed when refused.
      .header("cache-control", code === 200 ? "private, no-cache" : "no-store")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(
        render(assets, {
          tournament: { name: tournament.name, address: tournament.address },
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

  server.get<{ Params: Params }>(path, async (request, reply) => {
    if (readerOf(request) === undefined) return toSignIn(request, reply);
    const tournament = await tournamentOf(request);
    if (tournament === undefined) return reply.callNotFound();
    return show(
      request,
      reply,
      tournament,
      formFor(
        speakingOf(request),
        `/${tournament.address}/commentaries/create`,
        {},
      ),
    );
  });

  server.post<{ Params: Params }>(path, async (request, reply) => {
    const reader = readerOf(request);
    if (reader === undefined) return toSignIn(request, reply);
    const tournament = await tournamentOf(request);
    if (tournament === undefined) return reply.callNotFound();
    const speaking = speakingOf(request);
    const typed = typedFrom(request.body);
    const refused = (broken: readonly BrokenRule[]): FastifyReply =>
      show(
        request,
        reply,
        tournament,
        refusedForm(
          formFor(
            speaking,
            `/${tournament.address}/commentaries/create`,
            typed,
          ),
          typed,
          broken,
          speaking,
        ),
        422,
      );
    let started;
    try {
      started = await request.server.mediator.send(
        new StartCommentary(
          reader.value,
          tournament.id,
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
        failure instanceof TournamentRefused &&
        saidOfTheTitle.includes(failure.code)
      ) {
        return refused([{ code: failure.code, fields: ["title"] }]);
      }
      if (goneSinceAsked(failure)) return reply.callNotFound();
      throw failure;
    }
    // Found again by its id, since the slug it was given is the tournament's
    // to choose.
    const after = await tournamentOf(request);
    const commentary = after?.commentaries.find(
      (each) => each.id === started.value,
    );
    // Encoded, since a slug keeps letters of any script, and an address in
    // the Location header that is not encoded is refused for them.
    return reply.redirect(
      encodeURI(
        commentary === undefined
          ? `/${tournament.address}/commentaries`
          : `/${commentary.address}`,
      ),
      303,
    );
  });
};
