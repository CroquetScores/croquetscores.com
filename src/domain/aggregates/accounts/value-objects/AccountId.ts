import { Id } from "../../../common/Id.js";

const kind = "account";

/** What an account is known by. Everything an id does is on {@link Id}. */
export class AccountId extends Id {
  static create(): AccountId {
    return new AccountId(Id.mint(kind));
  }

  /** The account id written as `written`, or a validation refusal. */
  static from(written: string): AccountId {
    return new AccountId(Id.read(kind, written));
  }
}
