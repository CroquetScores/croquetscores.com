// The example passphrase and its rules, which exist only to exercise a rule
// written for something smaller than the request carrying it. The candidate is
// the passphrase alone, so its rules know nothing of any request and call what
// they read "value"; whatever validates a request carrying one says which of
// the request's fields it is in.
//
// Loaded by every spec in the repository, so it names nothing from
// infrastructure or the web.
import { Validator } from "../../src/domain/common/validation/Validator.js";

export type PassphraseErrorCode = "Passphrase.Missing" | "Passphrase.TooShort";

/** The fewest characters a passphrase may have. */
export const shortestPassphrase = 12;

const missing = (passphrase: string | undefined): boolean =>
  passphrase === undefined || passphrase === "";

export const passphrases = new Validator<
  string | undefined,
  PassphraseErrorCode
>({
  fields: [
    {
      field: "value",
      code: "Passphrase.Missing",
      isBrokenBy: missing,
    },
    {
      field: "value",
      code: "Passphrase.TooShort",
      isBrokenBy: (passphrase) =>
        !missing(passphrase) && (passphrase ?? "").length < shortestPassphrase,
    },
  ],
});
