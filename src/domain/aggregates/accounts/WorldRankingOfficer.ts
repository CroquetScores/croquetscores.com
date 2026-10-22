import { AccountId } from "./AccountId.js";

/**
 * The id of an account asking while it holds a World Ranking Officer role:
 * the same id, known to be a world ranking officer's of the sports whose
 * rankings it looks after, so that a tournament of one of them lets it change
 * any player's world ranking name, and nothing else
 * (Tournament.mayChangeWorldRankingNames), without knowing anything of
 * anybody's roles. An id rather than a flag beside one, as an administrator's
 * is, for the reasons given there (Administrator.ts).
 *
 * Made by the account that holds the roles (Account.asker). Anything else that
 * makes one is saying that the account holds them.
 */
export class WorldRankingOfficer extends AccountId {
  private constructor(
    account: string,
    /** The codes of the sports whose rankings it looks after. */
    readonly sports: readonly string[],
  ) {
    super(account);
  }

  static of(
    account: AccountId,
    sports: readonly string[],
  ): WorldRankingOfficer {
    return new WorldRankingOfficer(account.value, sports);
  }

  /** Whether it looks after the rankings of the sport whose code this is. */
  looksAfter(sport: string): boolean {
    return this.sports.includes(sport);
  }
}
