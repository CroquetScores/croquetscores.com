// Who a competition is, as an answer about it for apps begins.
import type { CompetitionShape } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/** Who a competition is, as an answer about it begins. */
export interface CompetitionHead {
  readonly id: string;
  readonly name: string;
  /** Block, Swiss, knockout, or test: the site's word for a match between two teams. */
  readonly kind: CompetitionShape["kind"];
  /** When anything was last kept of it. */
  readonly changedAt: ReadOnlyDate;
}
