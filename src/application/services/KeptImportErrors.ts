/** One error the import kept, as the list of them shows it. */
export interface KeptImportError {
  /** The document the import refused, whose id names its website too. */
  readonly documentId: string;
  /** The first line of what the import said, without its line ending. */
  readonly firstLine: string;
}

/**
 * The tournament on the site a document the import refused is of, and the
 * competition it was, as the import kept them.
 */
export interface KeptImportErrorTournament {
  /** The old site the document was on, as "croquetscores.com". */
  readonly website: string;
  /** The tournament's address, the same on the site and the old site. */
  readonly address: string;
  readonly name: string;
  /** Where the document was a competition, what it was called. */
  readonly competitionName: string | undefined;
}

/**
 * Where the errors the import kept are found (ImportErrorsKept.feature,
 * ImportErrorKept.feature). The import writes them, and nothing here does.
 */
export interface KeptImportErrors {
  /**
   * Every error kept, by the first line of its message and then by its
   * document's id, so that the order is the same every time it is asked for.
   */
  list(): Promise<readonly KeptImportError[]>;

  /**
   * Every message kept against `documentId`, whole, in the order they were
   * kept. None where nothing was.
   */
  messagesOf(documentId: string): Promise<readonly string[]>;

  /**
   * The tournament `documentId` is of, as the last error kept against it
   * that knew it says. Nothing where none did.
   */
  tournamentOf(
    documentId: string,
  ): Promise<KeptImportErrorTournament | undefined>;
}
