// An example form, for the scenarios about how a form behaves once what it
// sends is refused. It asks for the validator's example range — a start, an end
// and a step — and a passphrase, and sends them in an example request of its
// own. It means nothing: the register page has nothing that could refuse
// it yet, and whatever a form does when refused, this one does too.
//
// Its fields are named for the request's, so each rule the request breaks goes
// beneath the field the domain says it reads, and every word it shows comes
// from the reader's language (languages.ts).
//
// Opened with ?notice=example, it carries a notice, for the scenario about where
// a reader is taken when a form with a notice is refused; the form posts back
// to the same address, so the notice is still there once it has been.
//
// Opened with ?refused=example, it arrives already saying something above its
// fields, without asking for the reader to be taken there, as the sign in page
// does when Google has refused the reader.
//
// Added to the application the @browser scenarios share, before it listens.
// The scenarios only ever send it something that breaks a rule, so nothing it
// sends gets as far as a transaction, and no database is needed.
import type { FastifyRequest } from "fastify";
import { join } from "node:path";

import { readAssets } from "../../../src/web/common/assets.js";
import { renderDialog, type Dialog } from "../../../src/web/common/dialog.js";
import { submitForm, typedFrom } from "../../../src/web/common/form.js";
import { speakingOf } from "../../../src/web/common/language.js";
import { siteNameOf, websiteOf } from "../../../src/web/common/site.js";
import { render } from "../../../src/web/common/layout.js";
import { hasPassword, signedIn } from "../../../src/web/common/reader.js";
import { themeOf } from "../../../src/web/common/theme.js";
import type { Application } from "../../../src/web/server.js";
import { Command } from "../../../src/application/common/Command.js";
import { CommandValidator } from "../../../src/application/common/CommandValidator.js";
import type { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import {
  Validator,
  type BrokenRule,
} from "../../../src/domain/common/validation/Validator.js";
import { passphrases } from "../../support/examplePassphrase.js";
import { type Range, ranges } from "../../support/exampleRange.js";

export const exampleFormPath = "/example-form";
export const exampleFormWithNoticePath = `${exampleFormPath}?notice=example`;
export const exampleFormRefusedPath = `${exampleFormPath}?refused=example`;

interface Opened {
  readonly notice?: string;
  readonly refused?: string;
}

const withNotice = (
  request: FastifyRequest<{ Querystring: Opened }>,
): boolean => request.query.notice === "example";

const refused = (request: FastifyRequest<{ Querystring: Opened }>): boolean =>
  request.query.refused === "example";

/**
 * What the example form sends: a range, which is its own fields, and a
 * passphrase. The example command would do but for the passphrase, and adding
 * one to it would give every feature using it a rule to break.
 */
export class ExampleFormCommand extends Command<string> implements Range {
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;
  readonly passphrase: string | undefined;

  constructor(
    requestedAt: ReadOnlyDate,
    range: Range,
    passphrase: string | undefined,
  ) {
    super(requestedAt);
    ({ start: this.start, end: this.end, step: this.step } = range);
    this.passphrase = passphrase;
  }
}

/** What breaks the rules below, typed into the passphrase field. */
export const unwordedPassphrase = "unworded passphrase";

/**
 * Rules that no catalogue anywhere has words for, so that what a form shows
 * for such a rule can be seen (form.feature). They are the example form's own
 * rather than the example range's or the example passphrase's, because those
 * are asked about the example requests by the validator's feature and the
 * validation behaviour's, which hold them to the rules they have.
 *
 * Two of them are broken by the same passphrase, so that one place has two
 * unworded rules to say and the form can be seen saying it once. The passphrase
 * that breaks them is past the length the passphrase's own rules ask for, so
 * nothing else is said beneath that field while they are.
 */
const unworded = new Validator<
  ExampleFormCommand,
  "Example.Unworded" | "Example.AlsoUnworded" | "Example.UnwordedRange"
>({
  fields: [
    {
      field: "passphrase",
      code: "Example.Unworded",
      isBrokenBy: (command) => command.passphrase === unwordedPassphrase,
    },
    {
      field: "passphrase",
      code: "Example.AlsoUnworded",
      isBrokenBy: (command) => command.passphrase === unwordedPassphrase,
    },
  ],
  spanning: [
    {
      reads: ["start", "end"],
      code: "Example.UnwordedRange",
      // Neither one typed is not the same start and end: it is a form sent
      // empty, which the range's own rules are about, and which two of these
      // scenarios send on purpose.
      isBrokenBy: ({ start, end }) => start !== undefined && start === end,
    },
  ],
});

// The range's rules and the passphrase's, the one set after the other. The
// passphrase's are written for a passphrase alone, and say they read its
// "value"; here, where it is known which of the request's fields holds it,
// they are said to read that one.
class ExampleFormCommandValidator extends CommandValidator<ExampleFormCommand> {
  readonly validates = ExampleFormCommand;

  validate(command: ExampleFormCommand): readonly BrokenRule[] {
    return [
      ...ranges.check(command),
      ...passphrases
        .check(command.passphrase)
        .map((rule) => ({ ...rule, fields: ["passphrase"] })),
      ...unworded.check(command),
    ];
  }
}

const dialogFor = (
  request: FastifyRequest<{ Querystring: Opened }>,
): Dialog => {
  const { say } = speakingOf(request);
  const field = (name: string, type: "text" | "password" = "text") => ({
    name,
    label: say(`example.${name}`),
    type,
    autocomplete: "off",
  });
  return {
    title: say("example.title"),
    action: withNotice(request) ? exampleFormWithNoticePath : exampleFormPath,
    notice: withNotice(request) ? say("example.notice") : undefined,
    problems: refused(request)
      ? { messages: [say("example.refused")] }
      : undefined,
    fields: [
      field("start"),
      field("end"),
      field("step"),
      field("passphrase", "password"),
    ],
    submit: say("example.submit"),
  };
};

// Nothing typed is nothing asked for; anything else is read as a number.
const numberOf = (typed: string | undefined): number | undefined =>
  typed === undefined || typed.trim() === "" ? undefined : Number(typed);

export const addExampleForm = (application: Application): void => {
  const assets = readAssets(
    join(import.meta.dirname, "..", "..", "..", "assets"),
    "administrator@example.com",
  );
  const show = (request: FastifyRequest) => (shown: Dialog) => {
    const speaking = speakingOf(request);
    return render(assets, {
      title: speaking.say("example.title"),
      theme: themeOf(request),
      signedIn: signedIn(request),
      hasPassword: hasPassword(request),
      speaking,
      siteName: siteNameOf(request),
      tryWebsite: websiteOf(request).isTry,
      path: request.url,
      currentPath: exampleFormPath,
      frame: "bare",
      body: renderDialog(shown),
    });
  };

  application.validation.register(new ExampleFormCommandValidator());
  application.mediator.handleCommand({
    handles: ExampleFormCommand,
    handle: () => Promise.resolve("recorded"),
  });

  const { server } = application;

  server.get<{ Querystring: Opened }>(exampleFormPath, (request, reply) =>
    reply
      .type("text/html; charset=utf-8")
      .send(show(request)(dialogFor(request))),
  );

  server.post<{ Querystring: Opened }>(
    exampleFormPath,
    async (request, reply) => {
      const typed = typedFrom(request.body);
      const outcome = await submitForm(
        request,
        reply,
        { dialog: dialogFor(request), typed, show: show(request) },
        () =>
          request.server.mediator.send(
            new ExampleFormCommand(
              request.requestedAt,
              {
                start: numberOf(typed.start),
                end: numberOf(typed.end),
                step: numberOf(typed.step),
              },
              typed.passphrase,
            ),
          ),
      );
      if (outcome.refused) return reply;
      return reply.redirect(exampleFormPath, 303);
    },
  );
};
