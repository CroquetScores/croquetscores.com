import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Transactions } from "../../services/Transactions.js";
import {
  ListRefused,
  type WorldRankingLists,
  type WorldRankingSport,
} from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { ImportWorldRankingPlayers } from "./ImportWorldRankingPlayers.js";

// Association croquet's first, as the page's log reads them.
const SPORTS: readonly WorldRankingSport[] = ["ac", "gc"];

/**
 * Importing the players the world rankings know
 * (ImportWorldRankingPlayers.feature).
 *
 * Whoever asks is found to be an administrator in a read-only transaction
 * that is finished with before any list is read. Each list is then read with
 * nothing held, and only a list read in full is kept, in a transaction of its
 * own, so that one sport's list failing leaves its players as they were and
 * the other's is still kept.
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
    for (const sport of SPORTS) {
      command.report({ kind: "reading", sport });
      let names: readonly string[];
      try {
        names = await this.lists.playersOf(sport);
      } catch (failure) {
        // Only a list that was not read is said and passed over. Anything
        // else is the site failing, and stops the import where it is.
        if (!(failure instanceof ListRefused)) throw failure;
        command.report({ kind: "refused", sport, code: failure.code });
        continue;
      }
      command.report({ kind: "read", sport, players: names.length });
      await this.transactions.inTransaction(() =>
        this.players.replace(sport, names),
      );
      command.report({ kind: "kept", sport, players: names.length });
    }
    command.report({ kind: "finished" });
  }
}
