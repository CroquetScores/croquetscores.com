import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { ImportErrors } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";

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
  /** Where the tournament is on its website. */
  readonly link: string;
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
 * Says what the import accepts in a Markdown file, a line each, which the
 * import begins by emptying, so that the file says only what the last import
 * accepted. Written a line at a time rather than once importing is finished,
 * so that an import that stops partway through still says what it accepted
 * before it stopped.
 */
export class AcceptedImportErrorsFile implements AcceptedImportErrors {
  constructor(private readonly path: string) {}

  /** Deletes what the last import said, and begins the file again. */
  async begin(): Promise<void> {
    await rm(this.path, { force: true });
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(
      this.path,
      "# Accepted import errors\n\n" +
        "What the last import accepted from the old sites rather than keeping " +
        "as an error, each with the tournament it is of. Written by " +
        "`npm run import:ravendb`, which deletes it first.\n\n",
    );
  }

  async accept(accepted: Accepted): Promise<void> {
    const what = accepted.what === "" ? "" : ` ${accepted.what}:`;
    await appendFile(
      this.path,
      `- [${accepted.address}](${accepted.link}) ${accepted.documentId}:${what} ${accepted.code}: ${accepted.why}\n`,
    );
  }
}

/** Where `tournament` of `website` is, as its readers reach it. */
export const linkOf = (website: string, tournament: Tournament): string =>
  `https://${website}/${tournament.address.toString()}`;

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
 * What goes wrong with, and what is accepted of, one document of a tournament
 * that has been brought over: an error accepted for it (ACCEPTED_ERRORS) is
 * said as accepted, with the tournament, and any other is kept as an error.
 */
export class DocumentErrors {
  constructor(
    private readonly errors: ImportErrors,
    private readonly accepting: AcceptedImportErrors,
    readonly documentId: string,
    private readonly website: string,
    private readonly tournament: Tournament,
  ) {}

  /** Keeps `failure` of `what` of the document, as "game 12", unless it is accepted. */
  async refused(what: string, failure: unknown): Promise<void> {
    const accepted = acceptedErrorOf(this.documentId, failure);
    if (accepted === undefined) {
      await this.errors.recordError(
        this.documentId,
        `${what}: ${describedFailure(failure)}`,
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
      link: linkOf(this.website, this.tournament),
      what,
      code,
      why,
    });
  }
}
