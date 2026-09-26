import { DocumentStore } from "ravendb";

import type { DocumentSource } from "./runImporter.js";

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
 * to a scenario. What it does with a page is `runImporter.feature`'s.
 */
export class RavenDbDocuments implements DocumentSource {
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
    return documents.map((document) => ({
      id: session.advanced.getMetadataFor(document)["@id"] as string,
      document,
    }));
  }

  /** Closes the connection to RavenDB. */
  dispose(): void {
    this.#store.dispose();
  }
}
