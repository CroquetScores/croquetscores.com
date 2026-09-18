// The example requests, and what it takes to hand one in. They mean nothing,
// which is the point: what they are for is exercising the things every request
// passes through — the mediator itself, and the behaviours wrapped around it.
//
// They live here rather than with the mediator's own steps because more than
// one feature registers handlers for them, and a handler registered against a
// second copy of a class is a handler the mediator will never find: it stores
// them under the class the request arrives as. One copy, shared, is what makes
// "the example command is sent" mean the same thing wherever it is written.
//
// Loaded by every spec in the repository, so it names nothing from
// infrastructure or the web, for the reason world.ts gives.
import { Command } from "../../src/application/common/Command.js";
import { CommandValidator } from "../../src/application/common/CommandValidator.js";
import type { ValidationBehaviour } from "../../src/application/common/ValidationBehaviour.js";
import {
  Mediator,
  type RequestType,
} from "../../src/application/common/Mediator.js";
import { Query } from "../../src/application/common/Query.js";
import { QueryValidator } from "../../src/application/common/QueryValidator.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import { type Range, ranges } from "./exampleRange.js";
import type { SpecWorld } from "./world.js";

// The example command and query each ask for a range, when a scenario gives
// them one, and are ranges in their own right: the fields are the request's own,
// so the validator's example rules can be asked about the request itself rather
// than about a copy of those rules rewritten to reach inside it.
const nothingAskedFor: Range = {
  start: undefined,
  end: undefined,
  step: undefined,
};

export class ExampleCommand extends Command<string> implements Range {
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;

  constructor(
    requestedAt: ReadOnlyDate,
    askingFor: Range = nothingAskedFor,
    requestedBy?: AccountId,
  ) {
    super(requestedAt, requestedBy);
    ({ start: this.start, end: this.end, step: this.step } = askingFor);
  }
}

export class OtherCommand extends Command<string> {
  constructor(requestedAt: ReadOnlyDate) {
    super(requestedAt);
  }
}

export class ExampleQuery extends Query<string> implements Range {
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;

  constructor(askingFor: Range = nothingAskedFor) {
    super();
    ({ start: this.start, end: this.end, step: this.step } = askingFor);
  }
}

export class OtherQuery extends Query<string> {}

/** Neither a command nor a query, for a handler to name by mistake. */
export class NotARequest {}

// Their validators: the example range's rules, since each request is a range
// in its own right.
export class ExampleCommandValidator extends CommandValidator<ExampleCommand> {
  readonly validates = ExampleCommand;

  validate(command: ExampleCommand): readonly string[] {
    return ranges.check(command);
  }
}

export class ExampleQueryValidator extends QueryValidator<ExampleQuery> {
  readonly validates = ExampleQuery;

  validate(query: ExampleQuery): readonly string[] {
    return ranges.check(query);
  }
}

/** A fixed moment. Nothing here reads a clock, any more than the application does. */
export const askedAt = ReadOnlyDate.from(new Date("2026-09-17T09:00:00Z"));

/**
 * The scenario's mediator, made on first use. A scenario that wants one put
 * together a particular way — with a behaviour around it, say — makes it before
 * anything else asks for it.
 */
export const mediatorOf = (world: SpecWorld): Mediator =>
  (world.mediator ??= new Mediator());

/** The validation behaviour the scenario put in the mediator's lines. */
export const validationOf = (world: SpecWorld): ValidationBehaviour => {
  if (world.validation === undefined) {
    throw new Error("This scenario's requests are not validated.");
  }
  return world.validation;
};

/**
 * A handler that records it was called, does whatever else the scenario has
 * asked of it, and then answers or fails as told.
 *
 * The extra things are how a feature about what wraps a handler gets the
 * handler to do something inside the wrapping — ask for the connection it is
 * running on, say — without every such feature needing an example handler of
 * its own, which would collide with this one on the same words.
 */
export const exampleHandler = (
  world: SpecWorld,
  name: string,
  answer: string,
  fails = false,
): { handle: () => Promise<string> } => ({
  handle: async (): Promise<string> => {
    world.handled.push(name);
    world.happened.push("the handler");
    for (const also of world.whatTheExampleHandlerAlsoDoes) await also();
    if (fails) {
      world.plantedFailure = new Error(`${name} failed`);
      throw world.plantedFailure;
    }
    return answer;
  },
});

/**
 * The example handler as a command's or a query's, naming the request it
 * handles, which is all registering one takes.
 */
export const exampleCommandHandler = <TCommand extends Command<string>>(
  handles: RequestType<TCommand>,
  handler: { handle: () => Promise<string> },
): { handles: RequestType<TCommand>; handle: () => Promise<string> } => ({
  handles,
  handle: handler.handle,
});

export const exampleQueryHandler = <TQuery extends Query<string>>(
  handles: RequestType<TQuery>,
  handler: { handle: () => Promise<string> },
): { handles: RequestType<TQuery>; handle: () => Promise<string> } => ({
  handles,
  handle: handler.handle,
});

/** What came of handing a request in: the answer, or the failure. */
export const attempt = async (
  world: SpecWorld,
  handing: () => Promise<unknown>,
): Promise<void> => {
  try {
    world.answer = await handing();
  } catch (failure) {
    world.failure = failure;
  }
};
