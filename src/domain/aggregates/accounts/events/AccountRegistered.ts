import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../value-objects/AccountId.js";

/**
 * That an account began: everything it began with, its password only as a
 * hash.
 *
 * The name and the email address are held as text rather than as the values
 * they came from. An event is written down as JSON, and a value holding what it
 * says where nothing outside can reach it would be written down as nothing at
 * all.
 */
export class AccountRegistered extends DomainEvent {
  constructor(
    readonly name: string,
    readonly emailAddress: string,
    readonly passwordHash: string,
    // Whether the hash is the old site's, brought over rather than made here,
    // so that the account knows to have it made again when it can be.
    readonly passwordImported: boolean,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
