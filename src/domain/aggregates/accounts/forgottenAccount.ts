// What a forgotten account is called, reached at and linked to, from its id
// alone, so that it reads back the same every time. Said once, for the sealing
// that rewrites an account's events when it is forgotten and for the importer
// that brings a forgotten account over, so that the two cannot drift apart.
import type { AccountId } from "./AccountId.js";

/** The name a forgotten account is called. */
export const forgottenNameOf = (account: AccountId): string =>
  `Forgotten Account ${account.uuid}`;

/**
 * The email address a forgotten account is reached at, which is at example.com
 * so that it belongs to nobody and nothing sent to it reaches anyone.
 */
export const forgottenEmailAddressOf = (account: AccountId): string =>
  `forgotten-account-${account.uuid.replaceAll("-", "")}@example.com`;

/** The Google account a forgotten account is linked to, which none is known by. */
export const forgottenGoogleSubjectOf = (account: AccountId): string =>
  `google-account-forgotten-${account.uuid}`;
