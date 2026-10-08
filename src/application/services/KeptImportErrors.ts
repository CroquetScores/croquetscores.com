/** One error the import kept, as the list of them shows it. */
export interface KeptImportError {
  /** The document the import refused, whose id names its website too. */
  readonly documentId: string;
  /** The first line of what the import said, without its line ending. */
  readonly firstLine: string;
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
}
