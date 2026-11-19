import { Query } from "../../common/Query.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking for an account's keys can be refused where it is asked. */
export type ApiKeysOfAccountRefusedCode = "ApiKeysOfAccount.NotText";

/** One key as its owner sees it. Never the key, which nobody has but its app. */
export interface ApiKeyShown {
  readonly id: string;
  readonly label: string;
  readonly mayRead: boolean;
  readonly mayWrite: boolean;
  /** The id of the one tournament it is limited to, or nothing for none. */
  readonly tournament: string | undefined;
  readonly perMinute: number;
  readonly perDay: number;
  /** When it was made, as an ISO 8601 moment. */
  readonly madeAt: string;
  readonly revoked: boolean;
}

/**
 * The keys of the account the reader is signed in to, in the order they were
 * made, revoked ones among them. It names the account the reader is signed in
 * to, never one they chose, so nothing anybody asks with can list another
 * account's keys.
 */
export class ApiKeysOfAccount extends Query<readonly ApiKeyShown[]> {
  constructor(readonly account: string) {
    super();
    if (typeof account !== "string") {
      throw new ValidationError<ApiKeysOfAccountRefusedCode>(
        "ApiKeysOfAccount.NotText",
      );
    }
  }
}
