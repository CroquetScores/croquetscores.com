import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import {
  TournamentOperationRefused,
  askedBy,
  tournamentFor,
} from "./tournamentOperations.js";
import { AddManager } from "./AddManager.js";
import { accountThatCanBeGiven } from "../accounts/accountsThatCanBeGiven.js";
import type { FindsAccountByAddress } from "../accounts/accountsByAddress.js";

/**
 * Making somebody a manager of a tournament, named by their email address,
 * since that is what the manager asking knows of them.
 */
export class AddManagerHandler extends CommandHandler<AddManager, void> {
  readonly handles: RequestType<AddManager> = AddManager;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly accountsByAddress: FindsAccountByAddress,
  ) {
    super();
  }

  async handle(command: AddManager): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddManager",
    );
    const account = await accountThatCanBeGiven(
      this.accounts,
      this.accountsByAddress,
      command.emailAddress,
    );
    if (account === undefined) {
      throw new TournamentOperationRefused(
        "AddManager.NoSuchAccount",
        "The address has no account that can be made a manager.",
      );
    }
    tournament.addManager(account.id, by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
