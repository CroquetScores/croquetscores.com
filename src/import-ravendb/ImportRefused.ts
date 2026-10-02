import { Refused } from "../domain/common/Refused.js";

/**
 * A document the import will not bring over, named by a code of the import's
 * own, such as `ImportTournaments.UnknownSport`, where nothing the site refuses
 * says why.
 */
export class ImportRefused extends Refused<string> {}

/**
 * What a failure is kept as against the document it was in: the code it was
 * refused with, where it has one, then where it was thrown, since the error is
 * read later by whoever is working out why, and the code is what they look for.
 */
export const describedFailure = (failure: unknown): string => {
  const code = (failure as { code?: unknown } | null)?.code;
  const where =
    failure instanceof Error
      ? (failure.stack ?? failure.message)
      : String(failure);
  return typeof code === "string" ? `${code}: ${where}` : where;
};
