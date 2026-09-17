// Shared by every scenario in the repository, which is why it may name nothing
// from src/infrastructure/: what needs to lives in specs/infrastructure/support/.
import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Pool } from "pg";
import type { BrowserContext, Page } from "playwright";

// The application layer, which this file may name: the rule it keeps is only
// that it names nothing from infrastructure or the web.
import type { Mediator } from "../../src/application/common/Mediator.js";

export class SpecWorld extends World {
  // Set by the @postgres hooks. A scenario without that tag has neither.
  public databaseName: string | undefined;
  public pool: Pool | undefined;

  // A request being judged for where it came from. Typed by its shape rather
  // than by importing Provenance: this file is loaded by every spec in the
  // repository and so may name nothing from src/infrastructure or src/web.
  public provenance:
    | {
        method: string;
        secFetchSite: string | undefined;
        origin: string | undefined;
        host: string | undefined;
      }
    | undefined;

  // The host the site is configured to answer to, when a scenario sets one.
  public canonicalHost: string | undefined;

  // A page on some other site, served into the browser by the scenario.
  public elsewhere: string | undefined;

  // Where a reader asking to return somewhere was actually sent.
  public returnPath: string | undefined;

  // What the last call to the migration runner reported. Typed by its shape
  // rather than by importing AppliedMigration, for the same reason.
  public appliedMigrations: readonly { readonly name: string }[] | undefined;

  // The mediator a scenario puts together, and what came of using it: the
  // answer or the failure, which handlers were called, and everything its
  // behaviours and handlers did, in the order they did it.
  public mediator: Mediator | undefined;
  public answer: unknown;
  public failure: unknown;
  public handled: string[] = [];
  public happened: string[] = [];
  public happenedChecked = 0;
  // A failure a handler was made to throw, so it can be recognised coming out.
  public plantedFailure: Error | undefined;

  // The candidate a scenario puts to a validator, and every rule it was found
  // to break, of which the scenario has named this many so far.
  public range:
    | {
        start: number | undefined;
        end: number | undefined;
        step: number | undefined;
      }
    | undefined;
  public brokenRules: readonly string[] | undefined;
  public brokenRulesChecked = 0;

  // Set by the @browser hooks, for the same reason and in the same way.
  public browserContext: BrowserContext | undefined;
  public page: Page | undefined;
  public baseUrl: string | undefined;

  public get browserPage(): Page {
    if (this.page === undefined) {
      throw new Error(
        "This scenario has no browser. Tag it @browser if it needs one.",
      );
    }
    return this.page;
  }

  public get database(): Pool {
    if (this.pool === undefined) {
      throw new Error(
        "This scenario has no database. Tag it @postgres if it needs one.",
      );
    }
    return this.pool;
  }
}

setWorldConstructor(SpecWorld);
