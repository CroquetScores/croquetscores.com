import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a commentary can be refused where it is asked. */
export type PublicCommentaryOfTournamentRefusedCode =
  "PublicCommentaryOfTournament.NotText";

/** A comment as a commentary's page shows it. */
export interface PublicComment {
  /** Its id, which its own page is found by. */
  readonly id: string;
  /** What it says, in Markdown, with no HTML in it. */
  readonly text: string;
  /** When it was written, as an ISO moment. */
  readonly writtenAt: string;
  /** When it was last edited, as an ISO moment, or nothing where it never was. */
  readonly lastEditedAt?: string | undefined;
}

/** A commentary as its page shows it, with the tournament's sections. */
export interface TournamentCommentaryToRead {
  /** The tournament's name. */
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** Whether it is played by teams, which its sections say. */
  readonly playedByTeams: boolean;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  readonly commentary: {
    /** The commentary's id, which a comment added to it names. */
    readonly id: string;
    /** The tournament's id, which a comment added to it names too. */
    readonly tournament: string;
    readonly title: string;
    /** What its writer's account is called now. */
    readonly writer: string;
    /** Where it is found now, as "2026/ac/spring-open/commentaries/day-one". */
    readonly address: string;
    /** Whether the reader asking is its writer, who alone may write in it. */
    readonly writtenByReader: boolean;
    /** Its comments not deleted, the first written first. */
    readonly comments: readonly PublicComment[];
  };
}

/**
 * The commentary `slug` on the tournament of the website being read found at
 * `address`, now or before, as its page shows it. For anybody; `account`, the
 * reader's where one is signed in, is asked only whether they are its writer.
 *
 * An address no tournament of the website has been found at is refused as
 * `PublicCommentaryOfTournament.NoSuchTournament`, and so is an archived
 * tournament's. A slug no commentary on it has is refused as
 * `PublicCommentaryOfTournament.NoSuchCommentary`, and so is a commentary
 * whose writer's account has been forgotten.
 */
export class PublicCommentaryOfTournament extends Query<TournamentCommentaryToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
    /** The commentary's slug, as "day-one". */
    readonly slug: string,
    /** The account the reader is signed in to, or nothing where none is. */
    readonly account?: string | undefined,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string" ||
      (account !== undefined && typeof account !== "string")
    ) {
      throw new ValidationError<PublicCommentaryOfTournamentRefusedCode>(
        "PublicCommentaryOfTournament.NotText",
      );
    }
  }
}
