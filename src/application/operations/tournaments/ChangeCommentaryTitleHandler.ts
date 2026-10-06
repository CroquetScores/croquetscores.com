import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { CommentaryTitle } from "../../../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  type Commentaries,
  CommentaryOperationRefused,
} from "../commentaries/commentaryOperations.js";
import { ChangeCommentaryTitle } from "./ChangeCommentaryTitle.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Changing a commentary's title, in its own stream. Who may is the
 * commentary's to say, since it knows its writer, and whether commentary may
 * be written on the tournament is the tournament's.
 */
export class ChangeCommentaryTitleHandler extends CommandHandler<
  ChangeCommentaryTitle,
  void
> {
  readonly handles: RequestType<ChangeCommentaryTitle> = ChangeCommentaryTitle;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly commentaries: Commentaries,
    private readonly listed: TournamentCommentaries,
  ) {
    super();
  }

  async handle(command: ChangeCommentaryTitle): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ChangeCommentaryTitle",
    );
    // Found under the tournament it is on, so that a commentary of another
    // tournament is not one this tournament has.
    const commentary = await this.commentaries.load(
      CommentaryId.from(command.commentary),
    );
    if (
      commentary === undefined ||
      !commentary.tournament.equals(tournament.id)
    ) {
      throw new CommentaryOperationRefused(
        "ChangeCommentaryTitle.NoSuchCommentary",
        "There is no such commentary.",
      );
    }
    commentary.changeTitle(
      CommentaryTitle.from(command.title),
      // The other commentaries' titles, from the read model of them.
      (await this.listed.taken(tournament.id, commentary.id.value)).titles,
      by,
      command.requestedAt,
    );
    tournament.allowWritingCommentary();
    await this.commentaries.save(commentary);
  }
}
