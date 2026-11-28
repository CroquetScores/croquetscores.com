import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { ErrorLog } from "../../services/ErrorLog.js";
import type { Transactions } from "../../services/Transactions.js";
import type {
  WorldRankingLists,
  WorldRankingSport,
} from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import { importWorldRankingPlayers } from "./importingWorldRankingPlayers.js";
import { RefreshWorldRankingPlayerNames } from "./RefreshWorldRankingPlayerNames.js";

const anHour = 60 * 60 * 1000;

/**
 * Refreshing the names of one sport's players
 * (RefreshWorldRankingPlayerNames.feature), at most once an hour for each
 * sport, since a sport's list is read only when that sport's players are asked
 * for, and the other's hour is no reason to hold it back.
 *
 * A request made while a refresh is under way is within its hour and is
 * answered with the list as it stood, rather than made to wait for it.
 *
 * The hour is kept in memory rather than stored. A site that is started again
 * reads the rankings' site once more than it had to, which costs one read,
 * where storing it would cost a table and a migration for a limit that only
 * protects the rankings' site. The moment is taken before the list is read,
 * and kept whether or not the list could be read, so that a rankings' site that
 * is down is not asked again by every request while it is. A failure of the
 * site's own is the exception: it is let go, since nothing was kept.
 */
export class RefreshWorldRankingPlayerNamesHandler extends CommandHandler<
  RefreshWorldRankingPlayerNames,
  void
> {
  readonly handles: RequestType<RefreshWorldRankingPlayerNames> =
    RefreshWorldRankingPlayerNames;

  private readonly lastAskedAt = new Map<WorldRankingSport, number>();

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

  async handle(command: RefreshWorldRankingPlayerNames): Promise<void> {
    const { sport } = command;
    const now = command.requestedAt.toDate().getTime();
    const lastAskedAt = this.lastAskedAt.get(sport);
    // A request made before the last one is not within its hour: a clock
    // that has been put back would otherwise hold the refresh off until it
    // caught up.
    if (
      lastAskedAt !== undefined &&
      now >= lastAskedAt &&
      now - lastAskedAt < anHour
    ) {
      return;
    }
    this.lastAskedAt.set(sport, now);
    try {
      await importWorldRankingPlayers(
        {
          lists: this.lists,
          players: this.players,
          transactions: this.transactions,
          errors: this.errors,
          queue: this.queue,
          administrator: this.administrator,
          website: command.website,
          emailsAdministrator: false,
        },
        // Nobody is waiting to be told how it went.
        () => {},
        command.requestedAt,
        [sport],
      );
    } catch (failure) {
      // The site's own failure kept nothing, so it costs no hour.
      if (lastAskedAt === undefined) this.lastAskedAt.delete(sport);
      else this.lastAskedAt.set(sport, lastAskedAt);
      throw failure;
    }
  }
}
