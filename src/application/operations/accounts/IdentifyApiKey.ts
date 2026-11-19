import { Query } from "../../common/Query.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking who a key belongs to can be refused where it is asked. */
export type IdentifyApiKeyRefusedCode = "IdentifyApiKey.NotText";

/** Who a key acts as, and what it may do. */
export interface ApiKeyIdentified {
  /** The account the key acts as. */
  readonly account: string;
  /** The key's own id, which the account's list carries. */
  readonly keyId: string;
  readonly mayRead: boolean;
  readonly mayWrite: boolean;
  /** The id of the one tournament it is limited to, or nothing for none. */
  readonly tournament: string | undefined;
  readonly perMinute: number;
  readonly perDay: number;
}

/**
 * Who the key an app sent acts as: nothing where it is not a key that works,
 * and no more said of which of the reasons it was, since that is what must
 * not be told.
 */
export class IdentifyApiKey extends Query<ApiKeyIdentified | undefined> {
  constructor(readonly key: string) {
    super();
    if (typeof key !== "string") {
      throw new ValidationError<IdentifyApiKeyRefusedCode>(
        "IdentifyApiKey.NotText",
      );
    }
  }
}
