import type { Command } from "./Command.js";
import type { RequestType } from "./Mediator.js";

/**
 * The one thing that deals with a kind of command.
 *
 * It names the kind of command it handles, so registering it needs nothing but
 * the handler: it cannot be registered under a command it was not written for,
 * because it is never registered under anything but what it says. What it does
 * with a command is its own business.
 */
export abstract class CommandHandler<
  TCommand extends Command<TResult>,
  TResult,
> {
  /** The kind of command this handles. */
  abstract readonly handles: RequestType<TCommand>;

  abstract handle(command: TCommand): Promise<TResult>;
}
