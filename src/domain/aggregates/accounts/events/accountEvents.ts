// The name each of an account's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import type { EventRegistry } from "../../../common/EventRegistry.js";
import { AccountBroughtOver } from "./AccountBroughtOver.js";
import { AccountForgotten } from "./AccountForgotten.js";
import { AccountRegistered } from "./AccountRegistered.js";
import { EmailAddressConfirmed } from "./EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "./PasswordHashedAgain.js";
import { SignedIn } from "./SignedIn.js";

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at.
const text = (
  said: Readonly<Record<string, unknown>>,
  field: string,
  name: string,
): string => {
  const value = said[field];
  if (typeof value !== "string") {
    throw new TypeError(`What was kept as "${name}" has no ${field}.`);
  }
  return value;
};

/** `registry`, knowing every kind of event an account records. */
export const nameAccountEvents = (registry: EventRegistry): EventRegistry =>
  registry
    .name(
      AccountRegistered,
      "account-registered",
      (said, { createdBy, occurredAt }) =>
        new AccountRegistered(
          text(said, "emailAddress", "account-registered"),
          text(said, "emailAddressHash", "account-registered"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      AccountBroughtOver,
      "account-brought-over",
      (said, { createdBy, occurredAt }) =>
        new AccountBroughtOver(
          text(said, "name", "account-brought-over"),
          text(said, "emailAddress", "account-brought-over"),
          text(said, "emailAddressHash", "account-brought-over"),
          text(said, "passwordHash", "account-brought-over"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      EmailAddressConfirmed,
      "account-email-address-confirmed",
      (said, { createdBy, occurredAt }) =>
        new EmailAddressConfirmed(
          text(said, "name", "account-email-address-confirmed"),
          text(said, "passwordHash", "account-email-address-confirmed"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      SignedIn,
      "account-signed-in",
      (_said, { createdBy, occurredAt }) => new SignedIn(createdBy, occurredAt),
    )
    .name(
      PasswordHashedAgain,
      "account-password-hashed-again",
      (said, { createdBy, occurredAt }) =>
        new PasswordHashedAgain(
          text(said, "passwordHash", "account-password-hashed-again"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      AccountForgotten,
      "account-forgotten",
      (_said, { createdBy, occurredAt }) =>
        new AccountForgotten(createdBy, occurredAt),
    );
