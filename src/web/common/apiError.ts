// The one shape every error of the public API has (errors.feature), which the
// API's routes and the site's error handler both say, so that it is held here
// and neither depends on the other.

/** What an error of the API says. */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  /** The field of the request that was wrong, where one was. */
  readonly field?: string;
}

/** The body of an error, in its one shape. */
export const apiError = (
  code: string,
  message: string,
  field?: string,
): ApiError => ({ code, message, ...(field === undefined ? {} : { field }) });
