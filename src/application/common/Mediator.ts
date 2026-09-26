// Hands each request to the one handler registered for it, by way of the
// behaviours its side runs. The web layer holds this and nothing else of the
// application, and never knows which handler deals with what.
//
// Commands and queries share this and nothing else. They come in through
// separate doors, have separate handlers and run separate behaviours, because a
// command is run inside a transaction it writes in and has to commit, and a
// query inside a read-only one.
import { Refused } from "../../domain/common/Refused.js";
import type { Behaviour } from "./Behaviour.js";
import { Command } from "./Command.js";
import type { CommandHandler } from "./CommandHandler.js";
import { Query } from "./Query.js";
import type { QueryHandler } from "./QueryHandler.js";

/** A class whose instances are requests of one kind. */
export type RequestType<TRequest> = abstract new (
  ...parameters: never[]
) => TRequest;

/**
 * A request the mediator will not pass on. These are mistakes in how the
 * application was put together or in how a request was made, not answers a
 * handler gave, so they are thrown rather than returned.
 */
export class RequestRefused extends Refused<string> {}

// Handlers are stored under their request's class and taken back out under the
// class of whatever arrives, so the types they were registered with cannot be
// carried through the map. Registration is where those types are checked; a
// handler for one kind of request fits here without a cast because a method's
// parameter is compared both ways round.
type AnyCommandHandler = CommandHandler<Command<unknown>, unknown>;
type AnyQueryHandler = QueryHandler<Query<unknown>, unknown>;

const nameOf = (request: object): string =>
  request.constructor.name || "an unnamed request";

export class Mediator {
  private readonly commandHandlers = new Map<unknown, AnyCommandHandler>();
  private readonly queryHandlers = new Map<unknown, AnyQueryHandler>();
  private readonly commandBehaviours: Behaviour[] = [];
  private readonly queryBehaviours: Behaviour[] = [];

  /**
   * Registers `handler` for the command it names. A handler naming anything
   * but a command is refused as the wrong door: registered here, it would let
   * that request in by the command's.
   */
  handleCommand<TCommand extends Command<TResult>, TResult>(
    handler: CommandHandler<TCommand, TResult>,
  ): void {
    const type = handler.handles;
    if (!(type.prototype instanceof Command)) {
      throw new RequestRefused(
        "Mediator.WrongDoor",
        `${type.name || "What that handler names"} is not a command, so its handler cannot be registered as a command's.`,
      );
    }
    if (this.commandHandlers.has(type)) throw alreadyHandled(type);
    this.commandHandlers.set(type, handler);
  }

  /**
   * Registers `handler` for the query it names. A handler naming anything but
   * a query is refused as the wrong door: registered here, a command's would
   * let the command in by the query's, past the command's own validation and
   * into a transaction that cannot write.
   */
  handleQuery<TQuery extends Query<TResult>, TResult>(
    handler: QueryHandler<TQuery, TResult>,
  ): void {
    const type = handler.handles;
    if (!(type.prototype instanceof Query)) {
      throw new RequestRefused(
        "Mediator.WrongDoor",
        `${type.name || "What that handler names"} is not a query, so its handler cannot be registered as a query's.`,
      );
    }
    if (this.queryHandlers.has(type)) throw alreadyHandled(type);
    this.queryHandlers.set(type, handler);
  }

  /** Behaviours run in the order they are added, the first outermost. */
  addCommandBehaviour(behaviour: Behaviour): void {
    this.commandBehaviours.push(behaviour);
  }

  addQueryBehaviour(behaviour: Behaviour): void {
    this.queryBehaviours.push(behaviour);
  }

  async send<TResult>(command: Command<TResult>): Promise<TResult> {
    // Which door comes first, so that a query handed in here is told it came
    // the wrong way rather than anything else about it. A command that cannot
    // say when it was asked for never gets this far: it is refused where it is
    // made, which is also where whoever is looking for the fault should look.
    const handler = this.commandHandlers.get(command.constructor);
    if (handler === undefined) {
      throw this.queryHandlers.has(command.constructor)
        ? wrongDoor(command, "a query", "asked")
        : unhandled(command);
    }

    return run(
      this.commandBehaviours,
      command,
      () => handler.handle(command) as Promise<TResult>,
    );
  }

  async query<TResult>(query: Query<TResult>): Promise<TResult> {
    const handler = this.queryHandlers.get(query.constructor);
    if (handler === undefined) {
      throw this.commandHandlers.has(query.constructor)
        ? wrongDoor(query, "a command", "sent")
        : unhandled(query);
    }

    return run(
      this.queryBehaviours,
      query,
      () => handler.handle(query) as Promise<TResult>,
    );
  }
}

// Each behaviour is handed the rest of the way as its `next`, so the first one
// added wraps everything after it: first to see the request going in, last to
// see the answer or the failure coming out.
const run = <TResult>(
  behaviours: readonly Behaviour[],
  request: Command<TResult> | Query<TResult>,
  handle: () => Promise<TResult>,
): Promise<TResult> => {
  const from = (index: number): Promise<TResult> => {
    const behaviour = behaviours[index];
    return behaviour === undefined
      ? handle()
      : behaviour.invoke(request, () => from(index + 1));
  };
  return from(0);
};

const alreadyHandled = (type: RequestType<unknown>): RequestRefused =>
  new RequestRefused(
    "Mediator.AlreadyHandled",
    `${type.name || "That request"} already has a handler, and a request has exactly one.`,
  );

const unhandled = (request: object): RequestRefused =>
  new RequestRefused(
    "Mediator.Unhandled",
    `Nothing is registered to handle ${nameOf(request)}.`,
  );

const wrongDoor = (
  request: object,
  isReally: string,
  shouldBe: string,
): RequestRefused =>
  new RequestRefused(
    "Mediator.WrongDoor",
    `${nameOf(request)} is ${isReally}, and has to be ${shouldBe} rather than handed in this way.`,
  );
