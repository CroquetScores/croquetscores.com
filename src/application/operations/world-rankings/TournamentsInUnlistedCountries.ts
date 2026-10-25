import { Query } from "../../common/Query.js";

/** A tournament played in a country the list of its sport does not name. */
export interface TournamentInUnlistedCountry {
  readonly name: string;
  /** The code of the country it is played in. */
  readonly country: string;
  /** The country's name, in English. */
  readonly countryName: string;
  /** Where it is found, as "2026/ac/spring-open", which is also the old site's. */
  readonly address: string;
}

/**
 * The tournaments played in a country the world rankings' list of their sport
 * does not name, in order of the country's name, those of one country by the
 * day they started and then by name, as the account the reader is signed in
 * to lists them (TournamentsInUnlistedCountries.feature).
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`.
 */
export class TournamentsInUnlistedCountries extends Query<
  readonly TournamentInUnlistedCountry[]
> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
  ) {
    super();
  }
}
