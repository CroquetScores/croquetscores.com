import { AccountId } from "./AccountId.js";

/**
 * The id of an account asking while it holds the Administrator role: the same
 * id, known to be an administrator's, so that a tournament lets it through as
 * it would one of its managers (Tournament.mayManage) without knowing anything
 * of anybody's roles.
 *
 * An id rather than a flag beside one, because who asks is already handed to
 * every method that asks, as an account's id: a flag would be a second
 * argument to every one of them, and one left off would refuse an
 * administrator without anything saying why. What is recorded of what it does
 * names it by its id, as any account's is, and the role goes no further than
 * the request it asks in.
 *
 * Made by the account that holds the role (Account.asker). Anything else that
 * makes one is saying that the account holds it.
 */
export class Administrator extends AccountId {
  static of(account: AccountId): Administrator {
    return new Administrator(account.value);
  }
}
