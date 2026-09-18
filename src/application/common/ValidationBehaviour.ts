// Asks each request's rules about it on its way in, and refuses one that breaks
// any of them before anything behind this in the line of behaviours sees it:
// its handler, and a command's transaction, among them. A request that was never
// going to be carried out costs nothing but the asking.
//
// One behaviour stands in both lines, the command's and the query's, and holds
// the rules for requests of either kind.
import type { Behaviour } from "./Behaviour.js";
import type { Command } from "./Command.js";
import { RequestRefused, type RequestType } from "./Mediator.js";
import type { Query } from "./Query.js";

type Request = Command<unknown> | Query<unknown>;

/**
 * What is asked of a request's rules: every rule it breaks, in the order they
 * are declared. The domain's Validator is exactly this, held beside the
 * request.
 */
export interface RequestRules<TRequest> {
  check(request: TRequest): readonly string[];
}

/**
 * A request refused for breaking its rules, naming every rule it broke —
 * whoever typed it is owed the whole list at once, not one fault per attempt.
 *
 * It is thrown, like the mediator's other refusals, rather than returned as a
 * failed result. A command's handler answers with a result, but a query's
 * answers with whatever shape its caller wants, and a request refused before
 * any handler sees it should read the same whichever side it came in on.
 */
export class RequestInvalid extends RequestRefused {
  readonly broken: readonly string[];

  constructor(request: object, broken: readonly string[]) {
    super(
      "Request.Invalid",
      `${request.constructor.name || "A request"} breaks ${broken.join(", ")}.`,
    );
    this.name = "RequestInvalid";
    this.broken = broken;
  }
}

export class ValidationBehaviour implements Behaviour {
  // Rules are stored under their request's class and taken back out under the
  // class of whatever arrives, as the mediator's handlers are, and for the same
  // reason cannot carry the type they were registered with through the map.
  readonly #rules = new Map<unknown, RequestRules<Request>>();

  /**
   * Asks `rules` about every request of `type`. Refused with
   * `Validation.AlreadyValidated` when the request already has rules: two sets
   * would leave which apply, and in what order the broken ones come back, to
   * the order they happened to be registered in.
   */
  validate<TRequest extends Request>(
    type: RequestType<TRequest>,
    // The request's type is taken from its class alone. Rules written for
    // something the request is — a range, say — would otherwise pull it
    // towards themselves, and the two would meet at "any request", which no
    // rules were written for.
    rules: RequestRules<NoInfer<TRequest>>,
  ): void {
    if (this.#rules.has(type)) {
      throw new RequestRefused(
        "Validation.AlreadyValidated",
        `${type.name || "That request"} already has a validator, and a request has at most one.`,
      );
    }
    this.#rules.set(type, rules);
  }

  async invoke<TResult>(
    request: Command<TResult> | Query<TResult>,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    // A request nobody gave rules to is passed on as it is. Nothing invalid gets
    // further by that: whatever its handler makes from what it carries is
    // required to be valid where it is made, and fails there — as a mistake in
    // the code that let it through, rather than as something to tell whoever
    // sent it.
    const broken = this.#rules.get(request.constructor)?.check(request) ?? [];
    if (broken.length > 0) throw new RequestInvalid(request, broken);
    return next();
  }
}
