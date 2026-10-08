import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type {
  KeptImportError,
  KeptImportErrors,
} from "../../services/KeptImportErrors.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { ImportErrorsKept } from "./ImportErrorsKept.js";

/**
 * The errors the import kept, read from where it keeps them rather than from
 * the events, which it writes none of (ImportErrorsKept.feature).
 */
export class ImportErrorsKeptHandler extends QueryHandler<
  ImportErrorsKept,
  readonly KeptImportError[]
> {
  readonly handles: RequestType<ImportErrorsKept> = ImportErrorsKept;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly kept: KeptImportErrors,
  ) {
    super();
  }

  async handle(query: ImportErrorsKept): Promise<readonly KeptImportError[]> {
    await administratorAsking(this.accounts, query.account);
    return this.kept.list();
  }
}
