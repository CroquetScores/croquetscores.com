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
// Added to the application the @browser scenarios share, before it listens.
// The scenarios only ever send it something that breaks a rule, so nothing it
// sends gets as far as a transaction, and no database is needed.
import type { FastifyRequest } from "fastify";
import { join } from "node:path";

import { readAssets } from "../../../src/web/common/assets.js";
import { renderDialog, type Dialog } from "../../../src/web/common/dialog.js";
import { submitForm, type Typed } from "../../../src/web/common/form.js";
import { speakingOf } from "../../../src/web/common/language.js";
import { render } from "../../../src/web/common/layout.js";
import { themeOf } from "../../../src/web/common/theme.js";
import type { Application } from "../../../src/web/server.js";
import { Command } from "../../../src/application/common/Command.js";
import { CommandValidator } from "../../../src/application/common/CommandValidator.js";
import type { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../src/domain/common/validation/Validator.js";
import { passphrases } from "../../support/examplePassphrase.js";
import { type Range, ranges } from "../../support/exampleRange.js";

export const exampleFormPath = "/example-form";

/**
 * What the example form sends: a range, which is its own fields, and a
 * passphrase. The example command would do but for the passphrase, and adding
 * one to it would give every feature using it a rule to break.
 */
class ExampleFormCommand extends Command<string> implements Range {
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
    ];
  }
}

const dialogFor = (request: FastifyRequest): Dialog => {
  const { say } = speakingOf(request);
  const field = (name: string, type: "text" | "password" = "text") => ({
    name,
    label: say(`example.${name}`),
    type,
    autocomplete: "off",
  });
  return {
    title: say("example.title"),
    action: exampleFormPath,
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
  );
  const show = (request: FastifyRequest) => (shown: Dialog) => {
    const speaking = speakingOf(request);
    return render(assets, {
      title: speaking.say("example.title"),
      theme: themeOf(request),
      speaking,
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

  server.get(exampleFormPath, (request, reply) =>
    reply
      .type("text/html; charset=utf-8")
      .send(show(request)(dialogFor(request))),
  );

  server.post<{ Body: Typed }>(exampleFormPath, async (request, reply) => {
    const typed = request.body;
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
  });
};
