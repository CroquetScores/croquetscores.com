// Shared by every scenario in the repository, which is why it may name nothing
// from src/infrastructure/: what needs to lives in specs/infrastructure/support/.
import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Pool } from "pg";

export class SpecWorld extends World {
  // Set by the @postgres hooks. A scenario without that tag has neither.
  public databaseName: string | undefined;
  public pool: Pool | undefined;

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
