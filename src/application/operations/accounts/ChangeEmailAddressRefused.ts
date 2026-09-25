/** Every way moving an account to another address is refused, past its rules. */
export type ChangeEmailAddressErrorCode =
  | "ChangeEmailAddress.WrongPassword"
  | "ChangeEmailAddress.Unchanged"
  | "ChangeEmailAddress.Taken"
  | "Link.NoLongerWorks";

export class ChangeEmailAddressRefused extends Error {
  readonly code: ChangeEmailAddressErrorCode;

  constructor(code: ChangeEmailAddressErrorCode, message: string) {
    super(message);
    this.name = "ChangeEmailAddressRefused";
    this.code = code;
  }
}
