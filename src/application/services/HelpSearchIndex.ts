/** A page of the help, as it is put into the index. */
export interface HelpPageToSearch {
  /** The language it is written in, by the tag the site knows it by. */
  readonly tag: string;
  /** What Postgres calls the rules of that language: "english", "simple". */
  readonly rules: string;
  /** What the help calls the page, as the help's address for it names it. */
  readonly name: string;
  readonly title: string;
  readonly headings: readonly string[];
  readonly text: string;
}

/** A page the index found for a question. */
export interface HelpSearchResult {
  readonly name: string;
  readonly title: string;
  /**
   * Between 0 and 1, more for a better answer. Not to be compared between
   * questions, only between the results of one.
   */
  readonly score: number;
  /**
   * Some of the page around the words that matched, with each of them between
   * {@link snippetStart} and {@link snippetEnd}. Plain text: whoever shows it
   * is to escape it before putting those marks back as markup.
   */
  readonly snippet: string;
}

/** Put before a word of a snippet that matched. A private use character, which no page has. */
export const snippetStart = "";
/** Put after a word of a snippet that matched. */
export const snippetEnd = "";

/** The most results a search gives. */
export const mostHelpSearchResults = 10;

/**
 * The help as it is searched (PostgresHelpSearchIndex.feature). It is a copy
 * of the built help, made again whole when the build changes.
 */
export interface HelpSearchIndex {
  /** What the pages kept were made from, if any have been kept. */
  fingerprint(): Promise<string | undefined>;

  /**
   * Keeps `pages` and nothing else, as made from `fingerprint`. All of the
   * pages kept before go and all of these come, or neither does.
   */
  replace(
    pages: readonly HelpPageToSearch[],
    fingerprint: string,
  ): Promise<void>;

  /**
   * The pages of the language with `tag` that have any of the words `query`
   * names, best first, no more than {@link mostHelpSearchResults}. `query`
   * is quoted words joined by " | ", as helpSynonyms.ts makes it; `rules` are
   * those the language is searched by.
   */
  search(
    tag: string,
    rules: string,
    query: string,
  ): Promise<readonly HelpSearchResult[]>;
}

/** The pages of the built help, for the index to be made from. */
export interface HelpPagesToSearch {
  /** Every page of every language. Fails where the help cannot be read. */
  all(): Promise<readonly HelpPageToSearch[]>;
}
