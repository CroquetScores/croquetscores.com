import { Query } from "../../common/Query.js";
import type { KeptImportErrorTournament } from "../../services/KeptImportErrors.js";

/** What the import said of one document it refused. */
export interface ImportErrorOfDocument {
  /** The document's id. */
  readonly documentId: string;
  /** Every message kept against it, whole, in the order they were kept. */
  readonly messages: readonly string[];
  /**
   * The tournament it is of, and the competition it was, where the import
   * knew them.
   */
  readonly tournament: KeptImportErrorTournament | undefined;
}

/**
 * What the import said of the document `documentId` it refused
 * (ImportErrorKept.feature).
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`, whether or not there is such a document. A
 * document nothing was kept against is refused as `ImportErrorKept.NotFound`.
 */
export class ImportErrorKept extends Query<ImportErrorOfDocument> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The document's id, as the import kept it. */
    readonly documentId: string,
  ) {
    super();
  }
}
