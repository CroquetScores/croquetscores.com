import { DocumentStore } from "ravendb";

import type { TournamentDocuments } from "./ImportWholeTournaments.js";
import type { DocumentSource } from "./runImporter.js";
import { withoutNullCharacters } from "./withoutNullCharacters.js";

/**
 * How long asking what names a tournament waits for RavenDB's index. The
 * client's own is 15 seconds, which is not long enough for the first asking of
 * a large collection, such as every block with every game in it, while RavenDB
 * makes the index from the whole of it. Every tournament asked about in that
 * time would be refused, and what names each of them refused after it.
 */
const WAIT_FOR_INDEX_MILLISECONDS = 10 * 60 * 1000;

/**
 * One of the old sites' RavenDB 4.2 databases, read a page at a time.
 *
 * A session a page, because a RavenDB session refuses more than 30 requests
 * and holds on to everything it has loaded.
 *
 * The page is written into the query rather than passed as `skip` and `take`.
 * The 4.2 client sends those as parameters, and a query differing only in its
 * parameters can be answered from its cache with another page: an import once
 * asked for the 6,400th document on and was given the first page again, and
 * went round in circles.
 *
 * Specified by nothing, because nothing here can stand up a RavenDB to hold it
 * to a scenario. What it does with a page is `runImporter.feature`'s, and
 * with what names a tournament `ImportWholeTournaments.feature`'s.
 */
export class RavenDbDocuments implements DocumentSource, TournamentDocuments {
  readonly #store: DocumentStore;

  constructor(
    url: string,
    readonly website: string,
  ) {
    this.#store = new DocumentStore(url, website);
    this.#store.initialize();
  }

  async page<TDocument extends object>(
    collection: string,
    skip: number,
    take: number,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]> {
    const session = this.#store.openSession();
    // The collection is an importer's own name for it, never anybody's input,
    // and the two numbers are the run's own counts.
    const documents = await session.advanced
      .rawQuery<TDocument>(
        `from ${collection} limit ${String(skip)}, ${String(take)}`,
      )
      .all();
    // Its id asked of the document as read, which is the one the session
    // knows, and the document imported without the null characters some of
    // the old sites' text has in it (withoutNullCharacters.feature).
    return documents.map((document) => ({
      id: session.advanced.getMetadataFor(document)["@id"] as string,
      document: withoutNullCharacters(document),
    }));
  }

  async naming<TDocument extends object>(
    collection: string,
    tournamentDocumentId: string,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]> {
    const session = this.#store.openSession();
    // The key is written into the query, as a page is, and quoted, since it
    // is the old sites' rather than the import's own. RavenDB compares it in
    // any case, as the old sites wrote a key in more than one.
    //
    // Waiting for the index, because the first time a collection is asked
    // for what names a tournament RavenDB makes an index to answer it, and
    // answers from it before it has read the whole collection.
    const quoted = `'${tournamentDocumentId.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
    const documents = await session.advanced
      .rawQuery<TDocument>(`from ${collection} where Tournament.Id = ${quoted}`)
      .waitForNonStaleResults(WAIT_FOR_INDEX_MILLISECONDS)
      .all();
    // Its id asked of the document as read, which is the one the session
    // knows, and the document imported without the null characters some of
    // the old sites' text has in it (withoutNullCharacters.feature).
    return documents.map((document) => ({
      id: session.advanced.getMetadataFor(document)["@id"] as string,
      document: withoutNullCharacters(document),
    }));
  }

  async load(id: string): Promise<object | undefined> {
    const session = this.#store.openSession();
    const document = await session.load<object>(id);
    return document === null || document === undefined
      ? undefined
      : withoutNullCharacters(document);
  }

  /** Closes the connection to RavenDB. */
  dispose(): void {
    this.#store.dispose();
  }
}
