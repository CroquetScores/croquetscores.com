// Asks each request's rules about it on its way in, and refuses one that breaks
// any of them before anything behind this in the line of behaviours sees it:
// its handler, and a command's transaction, among them. A request that was never
// going to be carried out costs nothing but the asking.
//
// One behaviour stands in both lines, the command's and the query's, and holds
// the rules for requests of either kind.
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { Behaviour } from "./Behaviour.js";
import type { Command } from "./Command.js";
import { RequestRefused, type RequestType } from "./Mediator.js";
import type { Query } from "./Query.js";

type Request = Command<unknown> | Query<unknown>;

/**
 * The rules for one kind of request: which kind it is for, and every rule a
 * request of that kind breaks, in the order they are declared. A command's
 * validator is one of these; so is anything a query is validated by.
 */
export interface RequestValidator<TRequest> {
  readonly validates: RequestType<TRequest>;
  validate(request: TRequest): readonly BrokenRule[];
}

/**
 * A request refused for breaking its rules, naming every rule it broke, each
 * with the fields it reads — whoever typed it is owed the whole list at once,
 * not one fault per attempt, and beside what they typed.
 *
 * It is thrown, like the mediator's other refusals, rather than returned as a
 * failed result. A command's handler answers with a result, but a query's
 * answers with whatever shape its caller wants, and a request refused before
 * any handler sees it should read the same whichever side it came in on.
 */
export class RequestInvalid extends RequestRefused {
  readonly broken: readonly BrokenRule[];

  constructor(request: object, broken: readonly BrokenRule[]) {
    super(
      "Request.Invalid",
      `${request.constructor.name || "A request"} breaks ${broken.map((rule) => rule.code).join(", ")}.`,
    );
    this.name = "RequestInvalid";
    this.broken = broken;
  }
}

export class ValidationBehaviour implements Behaviour {
  // Validators are stored under their request's class and taken back out under
  // the class of whatever arrives, as the mediator's handlers are, and for the
  // same reason cannot carry the type they were registered with through the
  // map.
  readonly #validators = new Map<unknown, RequestValidator<Request>>();

  /**
   * Asks `validator` about every request of the kind it names. Refused with
   * `Validation.AlreadyValidated` when that kind already has one: two would
   * leave which rules apply, and in what order the broken ones come back, to
   * the order they happened to be registered in.
   */
  register<TRequest extends Request>(
    validator: RequestValidator<TRequest>,
  ): void {
    const type = validator.validates;
    if (this.#validators.has(type)) {
      throw new RequestRefused(
        "Validation.AlreadyValidated",
        `${type.name || "That request"} already has a validator, and a request has at most one.`,
      );
    }
    this.#validators.set(type, validator);
  }

  async invoke<TResult>(
    request: Command<TResult> | Query<TResult>,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    // A request nobody gave a validator is passed on as it is. Nothing invalid gets
    // further by that: whatever its handler makes from what it carries is
    // required to be valid where it is made, and fails there — as a mistake in
    // the code that let it through, rather than as something to tell whoever
    // sent it.
    const broken =
      this.#validators.get(request.constructor)?.validate(request) ?? [];
    if (broken.length > 0) throw new RequestInvalid(request, broken);
    return next();
  }
}
