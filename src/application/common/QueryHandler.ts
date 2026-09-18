import type { RequestType } from "./Mediator.js";
import type { Query } from "./Query.js";

/**
 * The one thing that answers a kind of query.
 *
 * It names the kind of query it handles, so registering it needs nothing but
 * the handler: it cannot be registered under a query it was not written for,
 * because it is never registered under anything but what it says. What it
 * answers with is its own business.
 */
export abstract class QueryHandler<TQuery extends Query<TResult>, TResult> {
  /** The kind of query this handles. */
  abstract readonly handles: RequestType<TQuery>;

  abstract handle(query: TQuery): Promise<TResult>;
}
