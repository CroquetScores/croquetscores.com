import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { KeptImportErrors } from "../../services/KeptImportErrors.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import {
  ImportErrorKept,
  type ImportErrorOfDocument,
} from "./ImportErrorKept.js";

/** Why reading what the import said of a document is refused. */
export type ImportErrorKeptErrorCode = "ImportErrorKept.NotFound";

/**
 * Reading it refused, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class ImportErrorKeptRefused extends Refused<ImportErrorKeptErrorCode> {}

/**
 * What the import said of one document, read from where it keeps its errors
 * (ImportErrorKept.feature).
 */
export class ImportErrorKeptHandler extends QueryHandler<
  ImportErrorKept,
  ImportErrorOfDocument
> {
  readonly handles: RequestType<ImportErrorKept> = ImportErrorKept;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly kept: KeptImportErrors,
  ) {
    super();
  }

  async handle(query: ImportErrorKept): Promise<ImportErrorOfDocument> {
    // Asked first, so that nobody who may not ask learns which documents the
    // import refused from whether this one is found.
    await administratorAsking(this.accounts, query.account);
    const messages = await this.kept.messagesOf(query.documentId);
    if (messages.length === 0) {
      throw new ImportErrorKeptRefused(
        "ImportErrorKept.NotFound",
        "The import kept no error against that document.",
      );
    }
    return {
      documentId: query.documentId,
      messages,
      summaries: await this.kept.summariesOf(query.documentId),
      tournament: await this.kept.tournamentOf(query.documentId),
    };
  }
}
