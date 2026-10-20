import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { ServerLog } from "../../services/ServerLog.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { PruneLog } from "./PruneLog.js";

const anHour = 60 * 60 * 1000;

export class PruneLogHandler extends CommandHandler<PruneLog, number> {
  readonly handles: RequestType<PruneLog> = PruneLog;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly log: ServerLog,
  ) {
    super();
  }

  async handle(command: PruneLog): Promise<number> {
    await administratorAsking(this.accounts, command.account);
    // Counted back from when the administrator asked, so that the last hour is
    // what is still being written, and what a reader who has only just met an
    // error is about to be looked up by.
    const asked = command.requestedAt.toDate();
    return this.log.removeBefore(new Date(asked.getTime() - anHour));
  }
}
