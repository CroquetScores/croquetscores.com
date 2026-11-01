import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a block was added to the tournament: its id, its name, the slug and
 * the order the tournament gave it, what each of its matches is the best of,
 * how many rounds it is played in, and how its players level on matches won
 * are told apart.
 */
export class BlockAdded extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly slug: string,
    readonly order: number,
    readonly bestOf: number,
    readonly rounds: number,
    // How the competition is played and counted (CompetitionRules).
    readonly handicap: boolean,
    readonly drawsAllowed: boolean,
    readonly worldRankings: boolean,
    // The most hoops a game is played to, or null for no most. Left out by an
    // event kept before it was said, which the tournament then reads as the
    // usual for its sport.
    readonly maximumHoops: number | null | undefined,
    // How the players level on matches won are told apart (TieBreak), by its
    // code. Nothing for a block kept before it could be told, which goes by
    // what a block goes by unless it is told otherwise.
    readonly tieBreak: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
