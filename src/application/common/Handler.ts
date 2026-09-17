import type { Command } from "./Command.js";
import type { Query } from "./Query.js";

/** The one thing that deals with a kind of command. */
export interface CommandHandler<TCommand extends Command<TResult>, TResult> {
  handle(command: TCommand): Promise<TResult>;
}

/** The one thing that deals with a kind of query. */
export interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery): Promise<TResult>;
}
