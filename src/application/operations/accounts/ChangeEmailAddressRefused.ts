import { Refused } from "../../../domain/common/Refused.js";

/** Every way moving an account to another address is refused, past its rules. */
export type ChangeEmailAddressErrorCode =
  | "ChangeEmailAddress.WrongPassword"
  | "ChangeEmailAddress.Unchanged"
  | "ChangeEmailAddress.Taken"
  | "Link.NoLongerWorks";

export class ChangeEmailAddressRefused extends Refused<ChangeEmailAddressErrorCode> {}
