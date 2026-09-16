// Shared by every scenario in the repository, which is why it may name nothing
// from src/infrastructure/: what needs to lives in specs/infrastructure/support/.
import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Pool } from "pg";
import type { BrowserContext, Page } from "playwright";

export class SpecWorld extends World {
  // Set by the @postgres hooks. A scenario without that tag has neither.
  public databaseName: string | undefined;
  public pool: Pool | undefined;

  // What the last call to the migration runner reported. Typed by its shape
  // rather than by importing AppliedMigration: this file is loaded by every
  // spec in the repository and so may name nothing from src/infrastructure.
  // Where a reader asking to return somewhere was actually sent.
  public returnPath: string | undefined;

  public appliedMigrations: readonly { readonly name: string }[] | undefined;

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
