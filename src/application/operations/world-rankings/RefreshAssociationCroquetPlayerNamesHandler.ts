import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { ErrorLog } from "../../services/ErrorLog.js";
import type { Transactions } from "../../services/Transactions.js";
import type { WorldRankingLists } from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import { importWorldRankingPlayers } from "./importingWorldRankingPlayers.js";
import { RefreshAssociationCroquetPlayerNames } from "./RefreshAssociationCroquetPlayerNames.js";

const anHour = 60 * 60 * 1000;

/**
 * Refreshing the association croquet names (worldRankingPlayers.feature), at
 * most once an hour.
 *
 * The hour is kept in memory rather than stored. A site that is started again
 * reads the rankings' site once more than it had to, which costs one read,
 * where storing it would cost a table and a migration for a limit that only
 * protects the rankings' site. The moment is taken before the list is read,
 * and kept whether or not it could be, so that a rankings' site that is down
 * is not asked again by every request while it is.
 */
export class RefreshAssociationCroquetPlayerNamesHandler extends CommandHandler<
  RefreshAssociationCroquetPlayerNames,
  void
> {
  readonly handles: RequestType<RefreshAssociationCroquetPlayerNames> =
    RefreshAssociationCroquetPlayerNames;

  private lastAskedAt: number | undefined;

  constructor(
    private readonly lists: WorldRankingLists,
    private readonly players: WorldRankingPlayers,
    private readonly transactions: Transactions,
    private readonly errors: ErrorLog,
    private readonly queue: EmailQueue,
    /** Who is told of a list that gives one name to two players. */
    private readonly administrator: string,
  ) {
    super();
  }

  async handle(command: RefreshAssociationCroquetPlayerNames): Promise<void> {
    const now = command.requestedAt.toDate().getTime();
    if (this.lastAskedAt !== undefined && now - this.lastAskedAt < anHour) {
      return;
    }
    this.lastAskedAt = now;
    await importWorldRankingPlayers(
      {
        lists: this.lists,
        players: this.players,
        transactions: this.transactions,
        errors: this.errors,
        queue: this.queue,
        administrator: this.administrator,
        website: command.website,
      },
      // Nobody is waiting to be told how it went.
      () => {},
      command.requestedAt,
      ["ac"],
    );
  }
}
