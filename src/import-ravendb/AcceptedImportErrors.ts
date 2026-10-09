import { appendFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { ErrorOf, ImportErrors } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";
import { numbers } from "./runImporter.js";

/**
 * What the import accepted of one document rather than keeping it as an
 * error: something the old site kept that the site refuses, left out or
 * worked around, for whoever reads it to look at the tournament and see that
 * nothing was lost that mattered.
 */
export interface Accepted {
  /** The document, with its website, as "croquetscores.com/knockouts/10088". */
  readonly documentId: string;
  /** The address of the tournament the document is of, as "2014/ac/spring-open". */
  readonly address: string;
  /** The old site the document is of, as "croquetscores.com". */
  readonly website: string;
  /** What of the document was accepted, as "game 12", or "" for the whole of it. */
  readonly what: string;
  /** What was accepted, as a refusal's code or a code of the import's own. */
  readonly code: string;
  /** Why it was accepted. */
  readonly why: string;
}

/** Where what the import accepted is said (AcceptedImportErrors.feature). */
export interface AcceptedImportErrors {
  accept(accepted: Accepted): Promise<void>;
}

/**
 * Says what the import accepts in a Markdown file, a line each, linking to the
 * tournament on the new site, at `newSite`, and on the old site the document
 * is of, at the same address. The import begins by emptying it, so that the
 * file says only what the last import accepted. Written a line at a time
 * rather than once importing is finished, so that an import that stops
 * partway through still says what it accepted before it stopped.
 *
 * It begins by saying when the import began, by the machine's own clock, and
 * how many errors and things accepted the import before kept, counted before
 * either is emptied, and ends by saying how many this one kept, so that one
 * import can be held against the last.
 */
export class AcceptedImportErrorsFile implements AcceptedImportErrors {
  #accepted = 0;

  constructor(
    private readonly path: string,
    private readonly newSite: string,
  ) {}

  /**
   * Deletes what the last import said, and begins the file again, saying
   * that it began `at`, and that the last import kept `errorsBefore` errors,
   * or that they could not be counted.
   */
  async begin(at: Date, errorsBefore: number | undefined): Promise<void> {
    const acceptedBefore = await this.#acceptedInFile();
    this.#accepted = 0;
    await rm(this.path, { force: true });
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(
      this.path,
      "# Accepted import errors\n\n" +
        `Import began ${at.toLocaleString()}.\n\n` +
        `Previous import: ${counted(errorsBefore)} import errors, ${counted(acceptedBefore)} accepted import errors.\n\n` +
        "What the last import accepted from the old sites rather than keeping " +
        "as an error, each with the tournament it is of. Written by " +
        "`npm run import:ravendb`, which deletes it first.\n\n",
    );
  }

  /** Ends the file, saying that this import kept `errors` errors. */
  async end(errors: number): Promise<void> {
    await appendFile(
      this.path,
      `\nThis import: ${counted(errors)} import errors, ${counted(this.#accepted)} accepted import errors.\n`,
    );
  }

  async accept(accepted: Accepted): Promise<void> {
    this.#accepted += 1;
    const { address, website } = accepted;
    const what = accepted.what === "" ? "" : ` ${accepted.what}:`;
    await appendFile(
      this.path,
      `- [${address}](${this.newSite}/${address}) ([old site](https://${website}/${address})) ${accepted.documentId}:${what} ${accepted.code}: ${accepted.why}\n`,
    );
  }

  // How many things the file says were accepted, a line each, or nothing
  // where there is no file to count.
  async #acceptedInFile(): Promise<number | undefined> {
    try {
      const said = await readFile(this.path, "utf8");
      return said.split("\n").filter((line) => line.startsWith("- ")).length;
    } catch {
      return undefined;
    }
  }
}

const counted = (count: number | undefined): string =>
  count === undefined ? "uncounted" : numbers.format(count);

/**
 * An error that has been looked at and accepted: the old site's, not wrong,
 * and with nothing to put right. Accepted for one document and one refusal's
 * code, whichever of the document's games or players it names.
 */
interface AcceptedError {
  readonly documentId: string;
  readonly code: string;
  readonly why: string;
}

const ACCEPTED_ERRORS: readonly AcceptedError[] = [
  {
    documentId: "croquetscores.com/knockouts/10088",
    code: "Competition.NotDrawnToMeet",
    why: "Play-offs between players knocked out in the first round, kept beside the draw, which the site's knockout has no place for.",
  },
  {
    documentId: "croquetscores.com/knockouts/867",
    code: "Competition.NotDrawnToMeet",
    why: "A play-off for third place between the losers of its semi-finals, kept beside the final, which the site's knockout has no place for.",
  },
];

const acceptedErrorOf = (
  documentId: string,
  failure: unknown,
): AcceptedError | undefined => {
  const code = (failure as { code?: unknown } | null)?.code;
  return ACCEPTED_ERRORS.find(
    (accepted) =>
      accepted.documentId === documentId.toLowerCase() &&
      accepted.code === code,
  );
};

/**
 * The competition of the old sites a document was: what it was called, the
 * slug the old site gave it, and its path on the site once it is added.
 */
export interface CompetitionOf {
  readonly name: string;
  readonly oldSlug?: string | null | undefined;
  readonly newSitePath?: string;
}

/**
 * Where a competition the old site gave `oldSlug` was on it, under its
 * tournament's `address`, which is the same on both sites: its own page, or
 * the tournament's where it had no slug.
 */
export const oldSitePathOf = (
  address: string,
  oldSlug: string | null | undefined,
): string =>
  oldSlug === undefined || oldSlug === null || oldSlug === ""
    ? address
    : `${address}/competition/${oldSlug}`;

/**
 * What an error of `tournament`, and of the `competition` in it, is kept as
 * of: on the site, the competition's page once it is added and the
 * tournament's until then, and on the old site, the competition's page.
 */
export const errorOf = (
  tournament: Tournament,
  competition?: CompetitionOf,
): ErrorOf => {
  const address = tournament.address.toString();
  return {
    tournamentAddress: address,
    tournamentName: tournament.name.toString(),
    newSitePath: competition?.newSitePath ?? address,
    oldSitePath: oldSitePathOf(address, competition?.oldSlug),
    ...(competition === undefined ? {} : { competitionName: competition.name }),
  };
};

/**
 * The path on the site of the competition `id` of `tournament`: a test's
 * under its tests, and any other's under its competitions.
 */
export const newSitePathOf = (
  tournament: Tournament,
  id: CompetitionId,
): string | undefined => {
  const found = tournament.competitions.find(({ reference }) =>
    reference.id.equals(id),
  );
  if (found === undefined) return undefined;
  const base = found.shape.kind === "test" ? "tests" : "competitions";
  return `${tournament.address.toString()}/${base}/${found.reference.slug.toString()}`;
};

/**
 * What goes wrong with, and what is accepted of, one document of a tournament
 * that has been brought over: an error accepted for it (ACCEPTED_ERRORS) is
 * said as accepted, with the tournament, and any other is kept as an error
 * with the tournament and, where the document is one, the competition
 * `competitionName`.
 */
export class DocumentErrors {
  #newSitePath: string | undefined;

  constructor(
    private readonly errors: ImportErrors,
    private readonly accepting: AcceptedImportErrors,
    readonly documentId: string,
    private readonly website: string,
    private readonly tournament: Tournament,
    private readonly competition?: Omit<CompetitionOf, "newSitePath">,
  ) {}

  /** That the competition the document was is now `id` of the tournament. */
  added(id: CompetitionId): void {
    this.#newSitePath = newSitePathOf(this.tournament, id);
  }

  /** Keeps `failure` of `what` of the document, as "game 12", unless it is accepted. */
  async refused(what: string, failure: unknown): Promise<void> {
    const accepted = acceptedErrorOf(this.documentId, failure);
    if (accepted === undefined) {
      await this.errors.recordError(
        this.documentId,
        `${what}: ${describedFailure(failure)}`,
        errorOf(
          this.tournament,
          this.competition === undefined
            ? undefined
            : {
                ...this.competition,
                ...(this.#newSitePath === undefined
                  ? {}
                  : { newSitePath: this.#newSitePath }),
              },
        ),
      );
      return;
    }
    await this.accepted(what, accepted.code, accepted.why);
  }

  /** Says that `what` of the document was accepted as `code`, and `why`. */
  async accepted(what: string, code: string, why: string): Promise<void> {
    await this.accepting.accept({
      documentId: this.documentId,
      address: this.tournament.address.toString(),
      website: this.website,
      what,
      code,
      why,
    });
  }
}
