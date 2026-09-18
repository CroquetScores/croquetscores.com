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
import type { Command } from "../../src/application/common/Command.js";
import { Mediator } from "../../src/application/common/Mediator.js";
import type { Query } from "../../src/application/common/Query.js";
import { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { Range } from "./exampleRange.js";
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

export class ExampleCommand implements Command<string>, Range {
  declare readonly _result?: string;
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;

  constructor(
    readonly requestedAt: ReadOnlyDate,
    askingFor: Range = nothingAskedFor,
  ) {
    ({ start: this.start, end: this.end, step: this.step } = askingFor);
  }
}

export class OtherCommand implements Command<string> {
  declare readonly _result?: string;
  constructor(readonly requestedAt: ReadOnlyDate) {}
}

export class ExampleQuery implements Query<string>, Range {
  declare readonly _result?: string;
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;

  constructor(askingFor: Range = nothingAskedFor) {
    ({ start: this.start, end: this.end, step: this.step } = askingFor);
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
