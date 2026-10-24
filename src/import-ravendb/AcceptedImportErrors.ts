import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { ErrorOf, ImportErrors } from "./ImportDatabase.js";
import {
  gameSaid,
  placeOf,
  plainPlayerReasonOf,
  plainReasonOf,
  playerSaid,
  reasonOf,
} from "./errorSummaries.js";
import { describedFailure } from "./ImportRefused.js";
import type { Game as OldGame } from "./ravendb-models/Competition.js";

/**
 * What the import accepted of one document rather than keeping it as an
 * error: something the old site kept that the site refuses, left out or
 * worked around, for whoever reads it to look at the tournament and see that
 * nothing was lost that mattered.
 */
export interface Accepted {
  /** The document, with its website, as "croquetscores.com/knockouts/10088". */
  readonly documentId: string;
  /** The old site the document is of, as "croquetscores.com". */
  readonly website: string;
  /**
   * Where the document is on the site, without a leading slash: its
   * competition's page once it is added, or its tournament's; nowhere where
   * its tournament was not brought over.
   */
  readonly newSitePath: string | undefined;
  /** Where the document was on the old site, the same way. */
  readonly oldSitePath: string;
  /** What of the document was accepted, as "game 12", or "" for the whole of it. */
  readonly what: string;
  /** What was accepted, as a refusal's code or a code of the import's own. */
  readonly code: string;
  /** What was accepted and why, said for a person. */
  readonly description: string;
}

/** Where what the import accepted is said (ImportFiles.feature). */
export interface AcceptedImportErrors {
  accept(accepted: Accepted): Promise<void>;
}

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
 * A refused game or player said for a person, as the error it was refused
 * with, or as accepted for `why`.
 */
interface Said {
  refused(failure: unknown): string;
  accepted(why: string): string;
}

// The game as it is said for a person: who won and lost it, and the scores
// as they were typed.
const gameOf = (game: OldGame, nameOf: (number: number) => string) => ({
  winner: nameOf(game.Winner.PlayerId),
  winnerScore: game.Winner.Score._Score,
  loser: nameOf(game.Loser.PlayerId),
  loserScore: game.Loser.Score._Score,
});

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
 * What a document that is brought over whole or not at all found out when it
 * was tried first, in a transaction rolled back (importCompetition.ts): what
 * the site would have refused of it, each said for a person, and whether it
 * was left behind because it could not be worked out.
 */
export class DryRun {
  readonly refused: string[] = [];
  leftBehind = false;
}

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
    private readonly correcting: AcceptedImportErrors,
    readonly documentId: string,
    private readonly website: string,
    private readonly tournament: Tournament,
    private readonly competition?: Omit<CompetitionOf, "newSitePath">,
    // Where it is being tried first, nothing is kept, only found out.
    private readonly dry?: DryRun,
    // Where a game that cannot be added is said in a note of the tournament's
    // rather than kept as an error (ImportCompetition.feature): given the game
    // and what refused it.
    private readonly noted?: (game: OldGame, failure: unknown) => void,
    // Where a player who cannot be entered is said in the note too, given the
    // number the old site gave them and what refused them.
    private readonly notedPlayer?: (number: number, failure: unknown) => void,
  ) {}

  /** That the competition the document was is now `id` of the tournament. */
  added(id: CompetitionId): void {
    this.#newSitePath = newSitePathOf(this.tournament, id);
  }

  /**
   * Where the document is on the site and on the old site, and what it is of,
   * as it stands: the competition's page once it is added.
   */
  #of(): ErrorOf {
    return errorOf(
      this.tournament,
      this.competition === undefined
        ? undefined
        : {
            ...this.competition,
            ...(this.#newSitePath === undefined
              ? {}
              : { newSitePath: this.#newSitePath }),
          },
    );
  }

  /** Where the document is, said for a person, as "Spring Open - A Block". */
  get place(): string {
    return placeOf(this.tournament.name.toString(), this.competition?.name);
  }

  /**
   * Keeps `failure` of `what` of the document, as "game 12", said for a
   * person by `said`, as "Game Tim 26 beat Trev 0 in Spring Open - A Block",
   * where there is a saying, unless it is accepted.
   */
  async refused(what: string, failure: unknown, said?: Said): Promise<void> {
    const accepted = acceptedErrorOf(this.documentId, failure);
    if (this.dry !== undefined) {
      if (accepted === undefined) {
        this.dry.refused.push(
          said?.refused(failure) ?? `${what}: ${describedFailure(failure)}`,
        );
      }
      return;
    }
    if (accepted === undefined) {
      await this.errors.recordError(
        this.documentId,
        `${what}: ${describedFailure(failure)}`,
        this.#of(),
        said?.refused(failure),
      );
      return;
    }
    await this.accepted(
      what,
      accepted.code,
      said === undefined ? accepted.why : said.accepted(accepted.why),
    );
  }

  /** Keeps `failure` of `game`, said as who beat whom, where, and why. */
  async gameRefused(
    game: OldGame,
    nameOf: (number: number) => string,
    failure: unknown,
  ): Promise<void> {
    const said = gameSaid(gameOf(game, nameOf), this.place);
    // A game that cannot be added, after everything else was tried, is said
    // in a note of the tournament's, with why, and is no error.
    if (
      this.noted !== undefined &&
      this.dry === undefined &&
      acceptedErrorOf(this.documentId, failure) === undefined
    ) {
      this.noted(game, failure);
      await this.corrected(
        `game ${String(game.Id)}`,
        "ImportCompetition.GameNoted",
        `${said} could not be added, because ${plainReasonOf(failure)}, and is said in the note Import Errors of the tournament.`,
      );
      return;
    }
    await this.refused(`game ${String(game.Id)}`, failure, {
      refused: (refusal) => `${said} because ${reasonOf(refusal)}.`,
      accepted: (why) =>
        `${said} was not brought over, and that is accepted: ${why}`,
    });
  }

  /**
   * Says that `game` was corrected as `code`, and how, `after` the game said
   * for a person, as a correction of what the old site kept.
   */
  async gameCorrected(
    game: OldGame,
    nameOf: (number: number) => string,
    code: string,
    after: string,
  ): Promise<void> {
    await this.corrected(
      `game ${String(game.Id)}`,
      code,
      `${gameSaid(gameOf(game, nameOf), this.place)} ${after}`,
    );
  }

  /**
   * Says that `game` was left out as `code`, `because` of what, as a
   * correction of what the old site kept.
   */
  async gameLeftOut(
    game: OldGame,
    nameOf: (number: number) => string,
    code: string,
    because: string,
  ): Promise<void> {
    await this.corrected(
      `game ${String(game.Id)}`,
      code,
      `${gameSaid(gameOf(game, nameOf), this.place)} was left out because ${because}.`,
    );
  }

  /** Keeps `failure` of the player numbered `number`, said as who, where, and why. */
  async playerRefused(
    number: number,
    name: string,
    failure: unknown,
  ): Promise<void> {
    const said = playerSaid(name, this.place);
    if (
      this.notedPlayer !== undefined &&
      this.dry === undefined &&
      acceptedErrorOf(this.documentId, failure) === undefined
    ) {
      this.notedPlayer(number, failure);
      await this.corrected(
        `player ${String(number)}`,
        "ImportCompetition.PlayerNoted",
        `${said} was not entered, because ${plainPlayerReasonOf(failure)}, and is said in the note Import Errors of the tournament.`,
      );
      return;
    }
    await this.refused(`player ${String(number)}`, failure, {
      refused: (refusal) =>
        `${said} was not entered because ${reasonOf(refusal)}.`,
      accepted: (why) =>
        `${said} was not entered, and that is accepted: ${why}`,
    });
  }

  /**
   * Says that `what` of the document was accepted as `code`, said for a
   * person by `description`.
   */
  async accepted(
    what: string,
    code: string,
    description: string,
  ): Promise<void> {
    if (this.dry !== undefined) return;
    await this.accepting.accept(this.#said(what, code, description));
  }

  /**
   * Says that `what` of the document was corrected as `code`, said for a
   * person by `description`.
   */
  async corrected(
    what: string,
    code: string,
    description: string,
  ): Promise<void> {
    if (this.dry !== undefined) return;
    await this.correcting.accept(this.#said(what, code, description));
  }

  /**
   * Says, in what was corrected, that the document could not be brought over
   * whole as a `kind`, and why: what was refused of it in the trial, or that
   * its draw could not be worked out. Said even in a trial, which is what
   * finds out.
   */
  async notBroughtOverAs(kind: string, dry: DryRun): Promise<void> {
    const why = dry.leftBehind
      ? "its draw cannot be worked out from its players and games"
      : `${String(dry.refused.length)} of its games would be refused, the first being: ${dry.refused[0] ?? ""}`;
    await this.correcting.accept(
      this.#said(
        "",
        "ImportCompetition.NotBroughtOverWhole",
        `${this.place} could not be brought over whole as a ${kind}: ${why}`,
      ),
    );
  }

  #said(what: string, code: string, description: string): Accepted {
    const of = this.#of();
    return {
      documentId: this.documentId,
      website: this.website,
      newSitePath: of.newSitePath,
      oldSitePath: of.oldSitePath,
      what,
      code,
      description,
    };
  }
}
