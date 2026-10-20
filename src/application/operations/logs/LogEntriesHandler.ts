import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  isSeverity,
  type LogEntry,
  type ServerLog,
} from "../../services/ServerLog.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { LogEntries } from "./LogEntries.js";

export type LogEntriesErrorCode = "LogEntries.UnknownSeverity";

/**
 * Reading the log refused, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class LogEntriesRefused extends Refused<LogEntriesErrorCode> {}

/**
 * The most that is answered. A busy week of the log is far more than a phone
 * can show, and narrowing it is what the filters are for.
 */
const mostAnswered = 200;

export class LogEntriesHandler extends QueryHandler<
  LogEntries,
  readonly LogEntry[]
> {
  readonly handles: RequestType<LogEntries> = LogEntries;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly log: ServerLog,
  ) {
    super();
  }

  async handle(query: LogEntries): Promise<readonly LogEntry[]> {
    await administratorAsking(this.accounts, query.account);
    // A severity that is not one the log writes in is refused rather than
    // taken for none, which would quietly show more than was asked for.
    const written = query.severity;
    if (written !== undefined && !isSeverity(written)) {
      throw new LogEntriesRefused(
        "LogEntries.UnknownSeverity",
        `There is no severity called ${written}.`,
      );
    }
    const mentioning = query.mentioning?.trim();
    return this.log.read({
      severity: written,
      mentioning: mentioning === "" ? undefined : mentioning,
      limit: mostAnswered,
    });
  }
}
