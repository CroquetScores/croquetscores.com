// The name each of an account's events is kept under, and how each is read
// back. A name is kept for good, and must never be given to anything else.
import type { EventRegistry } from "../../../common/EventRegistry.js";
import { AccountBroughtOver } from "./AccountBroughtOver.js";
import { AccountForgotten } from "./AccountForgotten.js";
import { AccountRegistered } from "./AccountRegistered.js";
import { EmailAddressChangeAsked } from "./EmailAddressChangeAsked.js";
import { EmailAddressChanged } from "./EmailAddressChanged.js";
import { EmailAddressConfirmed } from "./EmailAddressConfirmed.js";
import { GoogleAccountLinked } from "./GoogleAccountLinked.js";
import { NameChanged } from "./NameChanged.js";
import { PasswordHashedAgain } from "./PasswordHashedAgain.js";
import { PasswordSet } from "./PasswordSet.js";
import { RoleAdded } from "./RoleAdded.js";
import { RoleRemoved } from "./RoleRemoved.js";
import { SignedIn } from "./SignedIn.js";
import { isRole, type Role } from "../value-objects/Role.js";

// What was kept comes back from a table something else could have written to,
// so a field an event cannot do without is refused rather than guessed at. The
// registry says which event it was.
const text = (
  said: Readonly<Record<string, unknown>>,
  field: string,
): string => {
  const value = said[field];
  if (typeof value !== "string") {
    throw new TypeError(`it has no ${field}`);
  }
  return value;
};

// A field an event can do without, and which JSON leaves out when it is.
const optionalText = (
  said: Readonly<Record<string, unknown>>,
  field: string,
): string | undefined =>
  said[field] === undefined ? undefined : text(said, field);

const role = (said: Readonly<Record<string, unknown>>): Role => {
  const value = text(said, "role");
  if (!isRole(value)) {
    throw new TypeError(`${JSON.stringify(value)} is not a role`);
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
          text(said, "emailAddress"),
          text(said, "emailAddressHash"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      AccountBroughtOver,
      "account-brought-over",
      (said, { createdBy, occurredAt }) =>
        new AccountBroughtOver(
          text(said, "name"),
          text(said, "emailAddress"),
          text(said, "emailAddressHash"),
          text(said, "passwordHash"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      EmailAddressConfirmed,
      "account-email-address-confirmed",
      (said, { createdBy, occurredAt }) =>
        new EmailAddressConfirmed(
          text(said, "name"),
          optionalText(said, "passwordHash"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      EmailAddressChangeAsked,
      "account-email-address-change-asked",
      (said, { createdBy, occurredAt }) =>
        new EmailAddressChangeAsked(
          text(said, "emailAddress"),
          text(said, "reference"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      EmailAddressChanged,
      "account-email-address-changed",
      (said, { createdBy, occurredAt }) =>
        new EmailAddressChanged(
          text(said, "emailAddress"),
          text(said, "emailAddressHash"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      NameChanged,
      "account-name-changed",
      (said, { createdBy, occurredAt }) =>
        new NameChanged(text(said, "name"), createdBy, occurredAt),
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
          text(said, "passwordHash"),
          createdBy,
          occurredAt,
        ),
    )
    .name(
      PasswordSet,
      "account-password-set",
      (said, { createdBy, occurredAt }) =>
        new PasswordSet(text(said, "passwordHash"), createdBy, occurredAt),
    )
    .name(
      GoogleAccountLinked,
      "account-google-account-linked",
      (said, { createdBy, occurredAt }) =>
        new GoogleAccountLinked(text(said, "subject"), createdBy, occurredAt),
    )
    .name(
      AccountForgotten,
      "account-forgotten",
      (_said, { createdBy, occurredAt }) =>
        new AccountForgotten(createdBy, occurredAt),
    )
    .name(
      RoleAdded,
      "account-role-added",
      (said, { createdBy, occurredAt }) =>
        new RoleAdded(role(said), createdBy, occurredAt),
    )
    .name(
      RoleRemoved,
      "account-role-removed",
      (said, { createdBy, occurredAt }) =>
        new RoleRemoved(role(said), createdBy, occurredAt),
    );
