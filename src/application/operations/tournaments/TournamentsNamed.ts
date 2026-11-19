import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking what tournaments are called can be refused where it is asked. */
export type TournamentsNamedRefusedCode = "TournamentsNamed.NotText";

/** A tournament, by what it is called and the year it starts in. */
export interface TournamentNamed {
  readonly id: string;
  readonly name: string;
  /** The year it starts in, which tells tournaments of one name apart. */
  readonly year: number;
}

/**
 * What the tournaments `tournaments` are called, each by its id, for the list
 * of a reader's keys to say which tournament a key is limited to. A tournament
 * there is not, or an id that is none, is left out of the answer rather than
 * refused, since a key may name a tournament that has since gone and the list
 * is still to be drawn. For anybody, so it names nobody: tournaments and their
 * names are public.
 */
export class TournamentsNamed extends Query<readonly TournamentNamed[]> {
  constructor(readonly tournaments: readonly string[]) {
    super();
    if (
      !Array.isArray(tournaments) ||
      tournaments.some((each) => typeof each !== "string")
    ) {
      throw new ValidationError<TournamentsNamedRefusedCode>(
        "TournamentsNamed.NotText",
      );
    }
  }
}
