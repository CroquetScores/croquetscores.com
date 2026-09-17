// Hands each request to the one handler registered for it, by way of the
// behaviours its side runs. The web layer holds this and nothing else of the
// application, and never knows which handler deals with what.
//
// Commands and queries share this and nothing else. They come in through
// separate doors, have separate handlers and run separate behaviours, because a
// command is run inside a transaction and a query never is.
import type { Behaviour } from "./Behaviour.js";
import type { Command } from "./Command.js";
import type { CommandHandler, QueryHandler } from "./Handler.js";
import type { Query } from "./Query.js";

/** A class whose instances are requests of one kind. */
export type RequestType<TRequest> = abstract new (
  ...parameters: never[]
) => TRequest;

/**
 * A request the mediator will not pass on. These are mistakes in how the
 * application was put together or in how a request was made, not answers a
 * handler gave, so they are thrown rather than returned.
 */
export class RequestRefused extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RequestRefused";
    this.code = code;
  }
}

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

  handleCommand<TCommand extends Command<TResult>, TResult>(
    type: RequestType<TCommand>,
    handler: CommandHandler<TCommand, TResult>,
  ): void {
    if (this.commandHandlers.has(type)) throw alreadyHandled(type);
    this.commandHandlers.set(type, handler);
  }

  handleQuery<TQuery extends Query<TResult>, TResult>(
    type: RequestType<TQuery>,
    handler: QueryHandler<TQuery, TResult>,
  ): void {
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
    // Which door comes first. A query handed in here is the wrong door, and
    // should be told so rather than told it has forgotten a time it never had.
    const handler = this.commandHandlers.get(command.constructor);
    if (handler === undefined) {
      throw this.queryHandlers.has(command.constructor)
        ? wrongDoor(command, "a query", "asked")
        : unhandled(command);
    }

    // A missing time and an unreadable one are different mistakes: a command
    // built without one, and — usually — one built from input that did not
    // parse. Each has its own code so whoever is looking knows which.
    if (!(command.requestedAt instanceof Date)) {
      throw new RequestRefused(
        "Command.RequestedAtMissing",
        `${nameOf(command)} does not say when it was asked for.`,
      );
    }
    if (Number.isNaN(command.requestedAt.getTime())) {
      throw new RequestRefused(
        "Command.RequestedAtUnreadable",
        `${nameOf(command)} says it was asked for at a time that cannot be read.`,
      );
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
