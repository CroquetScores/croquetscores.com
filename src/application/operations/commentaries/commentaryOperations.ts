// What every operation on a commentary's comments shares: who asks, the
// tournament asked first, since a commentary does not know whether its
// tournament is archived, and the commentary found.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Commentary } from "../../../domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { askedBy } from "../tournaments/tournamentOperations.js";

/** Where commentaries are kept, each under its own id. */
export type Commentaries = AggregateRepository<Commentary, CommentaryId>;

/** Why an operation on a commentary is refused, besides the commentary's own. */
export type CommentaryOperationErrorCode = `${string}.NoSuchCommentary`;

/** An operation's refusal, named by its code. */
export class CommentaryOperationRefused extends Refused<CommentaryOperationErrorCode> {}

/**
 * The commentary `request` names, and who asks: refused, in this order, as
 * `Account.Forgotten`, as `operation`'s `NoSuchCommentary` where there is no
 * such tournament or the tournament has no such commentary, and as
 * `Tournament.Archived` for a tournament that can only be restored. Whether
 * whoever asks may write in it is the commentary's to say.
 */
export const commentaryAskedBy = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  accounts: AggregateRepository<Account, AccountId>,
  commentaries: Commentaries,
  request: {
    readonly account: string;
    readonly tournament: string;
    readonly commentary: string;
  },
  operation: string,
): Promise<{ readonly by: AccountId; readonly commentary: Commentary }> => {
  const by = await askedBy(accounts, request.account);
  const noSuchCommentary = (): never => {
    throw new CommentaryOperationRefused(
      `${operation}.NoSuchCommentary`,
      "There is no such commentary.",
    );
  };
  const tournament =
    (await tournaments.load(TournamentId.from(request.tournament))) ??
    noSuchCommentary();
  const id = CommentaryId.from(request.commentary);
  if (!tournament.commentaries.some((each) => each.id.equals(id))) {
    noSuchCommentary();
  }
  if (tournament.archived) {
    throw new TournamentRefused(
      "Tournament.Archived",
      "An archived tournament can only be restored.",
    );
  }
  const commentary = (await commentaries.load(id)) ?? noSuchCommentary();
  return { by, commentary };
};
