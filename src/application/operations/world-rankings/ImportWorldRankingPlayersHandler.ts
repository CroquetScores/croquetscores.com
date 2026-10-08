import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Transactions } from "../../services/Transactions.js";
import type { WorldRankingLists } from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { ImportWorldRankingPlayers } from "./ImportWorldRankingPlayers.js";
import { importWorldRankingPlayers } from "./importingWorldRankingPlayers.js";

/**
 * Importing the players the world rankings know
 * (ImportWorldRankingPlayers.feature).
 *
 * Whoever asks is found to be an administrator in a read-only transaction
 * that is finished with before any list is read. The lists are then read and
 * kept as the import from the old sites keeps them
 * (importingWorldRankingPlayers.ts).
 */
export class ImportWorldRankingPlayersHandler extends CommandHandler<
  ImportWorldRankingPlayers,
  void
> {
  readonly handles: RequestType<ImportWorldRankingPlayers> =
    ImportWorldRankingPlayers;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly lists: WorldRankingLists,
    private readonly players: WorldRankingPlayers,
    private readonly transactions: Transactions,
  ) {
    super();
  }

  async handle(command: ImportWorldRankingPlayers): Promise<void> {
    await this.transactions.inReadOnlyTransaction(() =>
      administratorAsking(this.accounts, command.account),
    );
    await importWorldRankingPlayers(
      {
        lists: this.lists,
        players: this.players,
        transactions: this.transactions,
      },
      command.report,
    );
  }
}
