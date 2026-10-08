// The errors the import kept, put where it keeps them, for the features about
// listing and reading them (ImportErrorsKept.feature, ImportErrorKept.feature,
// importErrors.feature, importError.feature). Written as the import writes
// them, a row for each, rather than by running the import, which is another
// feature's.
//
// Here rather than in specs/support/ because it writes to the database.
import { Given } from "@cucumber/cucumber";

import type { SpecWorld } from "../../support/world.js";

// A message is given as its lines, each in quotes, parted by "then". An empty
// first line is a message that begins with a line break.
const LINES = '((?:"[^"]*")(?: then "[^"]*")*)';

Given(
  new RegExp(
    `^the import refused the document "([^"]*)" with ${LINES}( written with Windows line endings)?$`,
  ),
  async function (
    this: SpecWorld,
    documentId: string,
    written: string,
    // Null where the optional group did not match, as Cucumber hands it over.
    windows: string | null | undefined,
  ) {
    const lines = [...written.matchAll(/"([^"]*)"/g)].map((line) => line[1]);
    await this.database.query(
      "insert into import_errors (document_id, error_message) values ($1, $2)",
      [documentId, lines.join(windows ? "\r\n" : "\n")],
    );
  },
);
