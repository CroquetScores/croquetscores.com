import { AccountId } from "./AccountId.js";

/**
 * The id of an account asking while it holds the World Ranking Officer role:
 * the same id, known to be a world ranking officer's, so that a tournament
 * lets it change any player's world ranking name, and nothing else
 * (Tournament.mayChangeWorldRankingNames), without knowing anything of
 * anybody's roles. An id rather than a flag beside one, as an administrator's
 * is, for the reasons given there (Administrator.ts).
 *
 * Made by the account that holds the role (Account.asker). Anything else that
 * makes one is saying that the account holds it.
 */
export class WorldRankingOfficer extends AccountId {
  static of(account: AccountId): WorldRankingOfficer {
    return new WorldRankingOfficer(account.value);
  }
}
