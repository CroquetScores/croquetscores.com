import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../domain/aggregates/tournaments/value-objects/Rounds.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { AddBlock } from "./AddBlock.js";

/**
 * Adding a block to a tournament: its name, what each of its matches is the
 * best of, and the rounds it is played in. It is answered with the new
 * competition's id.
 */
export class AddBlockHandler extends CommandHandler<AddBlock, CompetitionId> {
  readonly handles: RequestType<AddBlock> = AddBlock;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: AddBlock): Promise<CompetitionId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddBlock",
    );
    const id = CompetitionId.create();
    tournament.addBlock(
      id,
      CompetitionName.from(command.name),
      BestOf.from(command.bestOf),
      Rounds.from(command.rounds),
      by,
      command.requestedAt,
      command.rules,
    );
    await this.tournaments.save(tournament);
    return id;
  }
}
