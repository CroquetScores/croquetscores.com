import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AccountsByAddress } from "./tournamentOperations.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import {
  TournamentOperationRefused,
  askedBy,
  tournamentFor,
} from "./tournamentOperations.js";
import { AddManager } from "./AddManager.js";

/**
 * Making somebody a manager of a tournament, named by their email address,
 * since that is what the manager asking knows of them.
 */
export class AddManagerHandler extends CommandHandler<AddManager, void> {
  readonly handles: RequestType<AddManager> = AddManager;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly accountsByAddress: AccountsByAddress,
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
    // Refused the same way however the address came to have no account that
    // can sign in, so that the manager learns no more about somebody else's
    // address than that it cannot be made a manager.
    const found = await this.accountsByAddress.find(
      EmailAddress.from(command.emailAddress),
    );
    const account =
      found === undefined ? undefined : await this.accounts.load(found);
    if (account === undefined || !account.confirmed || account.forgotten) {
      throw new TournamentOperationRefused(
        "AddManager.NoSuchAccount",
        "The address has no account that can be made a manager.",
      );
    }
    tournament.addManager(account.id, by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
