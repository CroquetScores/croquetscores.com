import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { RequestType } from "./Mediator.js";
import type { Query } from "./Query.js";

/**
 * The rules for what one kind of query may carry.
 *
 * It names the kind of query it validates, so registering it with the
 * validation behaviour needs nothing but the validator, and it is never asked
 * about any query but the one it says. Which rules there are, and the order
 * the broken ones come back in, are its own.
 */
export abstract class QueryValidator<TQuery extends Query<unknown>> {
  /** The kind of query this validates. */
  abstract readonly validates: RequestType<TQuery>;

  /**
   * Every rule `query` breaks, in the order the rules are declared, each with
   * the fields of the query it reads. Those are the query's own fields even
   * where a rule was written for something smaller the query carries in one
   * of them, so that whoever shows a rule knows which field it is about.
   */
  abstract validate(query: TQuery): readonly BrokenRule[];
}
