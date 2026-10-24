import { appendFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { Accepted, AcceptedImportErrors } from "./AcceptedImportErrors.js";
import type { KeptError } from "./ImportDatabase.js";

/** The file the errors the import kept are said in. */
const ERRORS_FILE = "import-errors.md";

/** The code an error is said under where its message has none. */
const NO_CODE = "NoCode";

// A name, a dot and a name, then a colon, as "Game.WinnerNotAhead:". Only the
// first line of the message is looked in, since a stack beneath it names the
// import's own functions in the same way.
const CODE = /(?:^|[\s:])([A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)+):/;

/**
 * The code an error was refused with, which is how the import keeps it: the
 * first of its message written as a name, a dot and a name and a colon
 * (ImportFiles.feature); "NoCode" where there is none.
 */
export const codeOfError = (message: string): string =>
  CODE.exec(message.split("\n")[0] ?? "")?.[1] ?? NO_CODE;

// A file is named for its code, with anything a file name cannot hold made an
// underscore, and the heading in it is the code as it is.
const fileOf = (code: string): string =>
  `${code.replaceAll(/[^A-Za-z0-9._-]/g, "_")}.md`;

// An entry of the file of errors, kept with its code so that they can be put
// in order of it once the import is finished.
interface ErrorEntry {
  readonly code: string;
  readonly text: string;
}

/**
 * What the import says of what it did, in a folder of Markdown files: one for
 * each code of what it corrected or accepted, named for the code, and
 * import-errors.md for the errors it kept (ImportFiles.feature).
 *
 * The folder is emptied when the import begins, of every file in it, so that
 * it says only what the last import said. Each is written as it is said, so
 * that an import that stops partway through still says what it said before it
 * stopped, and ends by saying how many it says.
 */
export class ImportFiles implements AcceptedImportErrors {
  #began = "";
  readonly #counts = new Map<string, number>();
  readonly #errors: ErrorEntry[] = [];

  constructor(
    private readonly folder: string,
    private readonly newSite: string,
  ) {}

  /**
   * Deletes every file the last import left, and makes the file of errors,
   * saying that the import began `at`, by the machine's own clock.
   */
  async begin(at: Date): Promise<void> {
    this.#counts.clear();
    this.#errors.length = 0;
    this.#began = `Import began ${at.toLocaleString()}.`;
    await mkdir(this.folder, { recursive: true });
    for (const name of await readdir(this.folder)) {
      await rm(join(this.folder, name), { recursive: true, force: true });
    }
    await writeFile(
      join(this.folder, ERRORS_FILE),
      this.#heading("Import errors"),
    );
  }

  /** Says what was corrected or accepted in the file of its code. */
  async accept(accepted: Accepted): Promise<void> {
    const { code } = accepted;
    const path = join(this.folder, fileOf(code));
    const count = this.#counts.get(code) ?? 0;
    if (count === 0) await writeFile(path, this.#heading(code));
    this.#counts.set(code, count + 1);
    const what = accepted.what === "" ? "" : ` ${accepted.what}`;
    await appendFile(
      path,
      `## ${code}: ${accepted.documentId}${what}\n\n` +
        `New site: ${accepted.newSitePath === undefined ? "not brought over" : `${this.newSite}/${accepted.newSitePath}`}\n` +
        `Old site: https://${accepted.website}/${accepted.oldSitePath}\n\n` +
        `${accepted.description}\n\n`,
    );
  }

  /** Says an error the import kept in the file of errors. */
  async keptError(error: KeptError): Promise<void> {
    const code = codeOfError(error.message);
    // Where it is on the site is known only of a document the import knew the
    // tournament of.
    const addresses =
      error.of === undefined
        ? ""
        : `New site: ${this.newSite}/${error.of.newSitePath}\n` +
          `Old site: https://${error.documentId.split("/")[0] ?? ""}/${error.of.oldSitePath}\n\n`;
    const text =
      `## ${code}: ${error.documentId}\n\n` +
      addresses +
      `${error.summary ?? error.message.split("\n")[0] ?? ""}\n\n`;
    this.#errors.push({ code, text });
    await appendFile(join(this.folder, ERRORS_FILE), text);
  }

  /**
   * Ends every file, saying how many it says: each file of a code its count,
   * and the file of errors, once they are in order of their code, how many
   * there were of each and in all.
   */
  async end(): Promise<void> {
    for (const [code, count] of this.#counts) {
      await appendFile(
        join(this.folder, fileOf(code)),
        `Total: ${String(count)}\n`,
      );
    }
    // A sort that keeps the order of equals, so that those of one code are
    // in the order they were found.
    const ordered = [...this.#errors].sort((one, other) =>
      one.code < other.code ? -1 : one.code > other.code ? 1 : 0,
    );
    const totals = new Map<string, number>();
    for (const { code } of ordered) {
      totals.set(code, (totals.get(code) ?? 0) + 1);
    }
    const path = join(this.folder, ERRORS_FILE);
    // Written afresh rather than added to, since the errors are now in order.
    await writeFile(
      path,
      this.#heading("Import errors") +
        ordered.map(({ text }) => text).join("") +
        "## Totals\n\n" +
        [...totals]
          .map(([code, count]) => `${code}: ${String(count)}\n`)
          .join("") +
        `\nTotal: ${String(ordered.length)}\n`,
    );
  }

  // Every file begins with its heading, a blank line, and when the import
  // began, and a blank line after.
  #heading(title: string): string {
    return `# ${title}\n\n${this.#began}\n\n`;
  }
}
