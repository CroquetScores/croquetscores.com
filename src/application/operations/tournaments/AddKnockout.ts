import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { CompetitionRulesSaid } from "../../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

/** A losers knockout to be added with the knockout: its name, and the round whose losers it takes. */
export interface LosersKnockoutSaid {
  readonly name: string;
  /** The round of the knockout it takes losers from, the first being 0. */
  readonly round: number;
}

/**
 * Adding a knockout to a tournament: its name, and the shape of its draw. It
 * is answered with the new competition's id. Losers knockouts that take the
 * losers of its rounds can be added with it, and are kept or refused with it,
 * as one change to the tournament.
 */
export class AddKnockout extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly name: string,
    /** How many places the draw has. */
    readonly places: number,
    /** What each round is the best of, the first round first. */
    readonly rounds: readonly number[],
    requestedAt: ReadOnlyDate,
    /**
     * How it is played and counted, as the dialog sent it, or nothing to leave
     * that to the tournament: what it was when it is updated.
     */
    readonly rules?: CompetitionRulesSaid | undefined,
    /** The losers knockouts to add with it, in the order they are added. */
    readonly losers: readonly LosersKnockoutSaid[] = [],
  ) {
    super(requestedAt);
  }
}
