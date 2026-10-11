import { Query } from "../../common/Query.js";
import type { KeptImportError } from "../../services/KeptImportErrors.js";

/**
 * The documents the import refused, each as the document's id and the first
 * line of the first error kept against it, in order of the documents' ids, as
 * the account the reader is signed in to lists them (ImportErrorsKept.feature).
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class ImportErrorsKept extends Query<readonly KeptImportError[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
  ) {
    super();
  }
}
