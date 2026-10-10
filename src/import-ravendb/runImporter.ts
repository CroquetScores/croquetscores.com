import type { ImportErrors } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";

/** How many documents are read at a time. */
export const PAGE_SIZE = 100;

/** A document from one of the old sites, with where it came from. */
export interface ReadDocument<TDocument> {
  /** The RavenDB database it came from, which is the old site's name. */
  readonly website: string;
  /** Its key, such as `users/1`. */
  readonly id: string;
  readonly document: TDocument;
}

/** What one importer reads, and what it does with each document. */
export interface Importer<TDocument extends object> {
  /** The RavenDB collection it reads, such as `Users`. */
  readonly collection: string;
  /**
   * Imports one document. Whatever it throws is kept as an error, and the
   * import goes on to the next.
   */
  importDocument(read: ReadDocument<TDocument>): Promise<void>;
}

/** One of the old sites' databases, read a page at a time. */
export interface DocumentSource {
  /** The old site the documents are from. */
  readonly website: string;
  /**
   * The documents of `collection` from the `skip`th on, at most `take` of
   * them, in the same order however often it is asked.
   */
  page<TDocument extends object>(
    collection: string,
    skip: number,
    take: number,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]>;
}

/** How many documents one importer read, and how many of them it refused. */
export interface ImporterRun {
  readonly read: number;
  readonly errors: number;
  /** Whether it stopped before the end of its collection, asked to. */
  readonly stopped: boolean;
}

/**
 * Whether the import is to stop now (runImporter.feature), asked after each
 * document.
 */
export type Stop = () => Promise<boolean>;

/** Where the errors the import has kept are counted. */
export interface ErrorsCounted {
  errorCount(): Promise<number>;
}

/**
 * Stops once `errors` has kept `limit` errors, of whatever collection and
 * whatever kept them, which is why they are counted where they are kept
 * rather than added up as each document is refused: a tournament keeps the
 * errors of what names it.
 */
export const stoppingAfter =
  (errors: ErrorsCounted, limit: number): Stop =>
  async () =>
    (await errors.errorCount()) >= limit;

/** A count as it is shown: `1,234`. */
export const numbers = new Intl.NumberFormat("en-AU");

/** `2.05` for two minutes and five seconds. */
export const minutesAndSeconds = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60))}.${String(seconds % 60).padStart(2, "0")}`;
};

/**
 * Reads every document in the importer's collection, a page at a time, and
 * hands each to the importer in turn (runImporter.feature). `show` is given
 * the progress as it goes, for whoever is watching. It stops after the
 * document that `stop` says to stop after, where it is given one.
 */
export const runImporter = async <TDocument extends object>(
  source: DocumentSource,
  errors: ImportErrors,
  importer: Importer<TDocument>,
  show: (text: string) => void = (text) => process.stdout.write(text),
  stop?: Stop,
): Promise<ImporterRun> => {
  const started = Date.now();
  let read = 0;
  let refused = 0;
  let stopped = false;

  for (;;) {
    const page = await source.page<TDocument>(
      importer.collection,
      read,
      PAGE_SIZE,
    );

    for (const { id, document } of page) {
      try {
        await importer.importDocument({
          website: source.website,
          id,
          document,
        });
      } catch (failure) {
        await errors.recordError(
          `${source.website}/${id}`,
          describedFailure(failure),
        );
        refused += 1;
      }

      read += 1;
      show(
        `\r${numbers.format(read)} with ${numbers.format(refused)} errors. ${id}\x1b[K`,
      );
      if (stop !== undefined && (await stop())) {
        stopped = true;
        break;
      }
    }

    // A page short of full is the last. A full one may be too, which costs one
    // more asking that comes back empty.
    if (stopped || page.length < PAGE_SIZE) break;
  }

  show(
    `\r${stopped ? "Stopped after" : "Read"} ${numbers.format(read)} with ${numbers.format(refused)} errors in ${minutesAndSeconds(Date.now() - started)} minutes.\x1b[K\n`,
  );

  return { read, errors: refused, stopped };
};
