import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  runImporter,
  type DocumentSource,
  type ImporterRun,
  type ReadDocument,
} from "../../../src/import-ravendb/runImporter.js";
import { ImportRefused } from "../../../src/import-ravendb/ImportRefused.js";
import type { SpecWorld } from "../../support/world.js";
import { keepErrorsIn, type ErrorsKept } from "../importing.js";

interface Document {
  readonly number: number;
}

// An old site's database as a list per collection, which says how large each
// page it was asked for was.
class Documents implements DocumentSource {
  readonly pagesAskedFor: number[] = [];
  readonly collections = new Map<
    string,
    { id: string; document: Document }[]
  >();

  constructor(readonly website: string) {}

  page<TDocument extends object>(
    collection: string,
    skip: number,
    take: number,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]> {
    this.pagesAskedFor.push(take);
    const page = (this.collections.get(collection) ?? []).slice(
      skip,
      skip + take,
    );
    return Promise.resolve(
      page as unknown as { id: string; document: TDocument }[],
    );
  }
}

class Errors implements ErrorsKept {
  readonly kept: { documentId: string; message: string }[] = [];

  recordError(documentId: string, message: string): Promise<void> {
    this.kept.push({ documentId, message });
    return Promise.resolve();
  }

  errorsFor(documentId: string): Promise<readonly string[]> {
    return Promise.resolve(
      this.kept
        .filter((one) => one.documentId === documentId)
        .map((one) => one.message),
    );
  }
}

interface Running {
  readonly collection: string;
  // Each document refused, by its key, with the code it is refused with where
  // it is refused with one.
  readonly refuses: Map<string, string | undefined>;
  readonly handed: ReadDocument<Document>[];
  readonly sites: Map<string, Documents>;
  readonly errors: Errors;
  run?: ImporterRun;
}

const running = new WeakMap<SpecWorld, Running>();

const runningOf = (world: SpecWorld): Running => {
  const found = running.get(world);
  assert.ok(found !== undefined, "No importer has been named.");
  return found;
};

const siteOf = (world: SpecWorld, website: string): Documents => {
  const { sites } = runningOf(world);
  const site = sites.get(website) ?? new Documents(website);
  sites.set(website, site);
  return site;
};

const runOf = (world: SpecWorld): ImporterRun => {
  const { run } = runningOf(world);
  assert.ok(run !== undefined, "The importer has not been run.");
  return run;
};

Given(
  "an importer of the collection {string}",
  function (this: SpecWorld, collection: string) {
    const errors = new Errors();
    running.set(this, {
      collection,
      refuses: new Map(),
      handed: [],
      sites: new Map(),
      errors,
    });
    keepErrorsIn(this, errors);
  },
);

Given(
  "{string} has {int} document(s) in {string}",
  function (this: SpecWorld, website: string, count: number, name: string) {
    siteOf(this, website).collections.set(
      name,
      Array.from({ length: count }, (_, index) => ({
        id: `${name.toLowerCase()}/${String(index + 1)}`,
        document: { number: index + 1 },
      })),
    );
  },
);

Given(
  "the importer refuses {string}",
  function (this: SpecWorld, documentId: string) {
    runningOf(this).refuses.set(documentId, undefined);
  },
);

Given(
  "the importer refuses {string} with {string}",
  function (this: SpecWorld, documentId: string, code: string) {
    runningOf(this).refuses.set(documentId, code);
  },
);

When(
  "the importer is run over {string}",
  async function (this: SpecWorld, website: string) {
    const state = runningOf(this);
    state.run = await runImporter(
      siteOf(this, website),
      state.errors,
      {
        collection: state.collection,
        importDocument(read: ReadDocument<Document>): Promise<void> {
          state.handed.push(read);
          if (state.refuses.has(read.id)) {
            const code = state.refuses.get(read.id);
            const message = `Refused ${read.id}`;
            return Promise.reject(
              code === undefined
                ? new Error(message)
                : new ImportRefused(code, message),
            );
          }
          return Promise.resolve();
        },
      },
      () => {},
    );
  },
);

Then(
  "the importer was handed {int} document(s)",
  function (this: SpecWorld, count: number) {
    assert.equal(runningOf(this).handed.length, count);
  },
);

Then(
  "no page read was larger than {int} documents",
  function (this: SpecWorld, most: number) {
    const pages = [...runningOf(this).sites.values()].flatMap(
      (site) => site.pagesAskedFor,
    );
    assert.ok(pages.length > 0, "No page was read.");
    assert.ok(
      pages.every((take) => take <= most),
      `Pages of ${pages.join(", ")} were asked for.`,
    );
  },
);

Then(
  "the importer was handed {string} first",
  function (this: SpecWorld, documentId: string) {
    assert.equal(runningOf(this).handed[0]?.id, documentId);
  },
);

Then(
  "the importer was handed {string} last",
  function (this: SpecWorld, documentId: string) {
    assert.equal(runningOf(this).handed.at(-1)?.id, documentId);
  },
);

Then(
  "the importer was handed {string} from {string}",
  function (this: SpecWorld, documentId: string, website: string) {
    const handed = runningOf(this).handed.find((one) => one.id === documentId);
    assert.ok(handed !== undefined, `${documentId} was not handed over.`);
    assert.equal(handed.website, website);
  },
);

Then(
  "the run says it read {int} document(s)",
  function (this: SpecWorld, count: number) {
    assert.equal(runOf(this).read, count);
  },
);

Then(
  "the run says {int} document(s) was/were refused",
  function (this: SpecWorld, count: number) {
    assert.equal(runOf(this).errors, count);
  },
);
