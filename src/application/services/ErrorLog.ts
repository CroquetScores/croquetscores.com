/**
 * Where the application says something went wrong that somebody has to put
 * right, and that is not a reader's mistake: it goes to the server's log, at
 * the severity of an error, for whoever reads it.
 */
export interface ErrorLog {
  error(message: string, details: Readonly<Record<string, unknown>>): void;
}
