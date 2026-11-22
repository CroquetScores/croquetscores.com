import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { TournamentOfWebsite } from "./tournamentsOfWebsite.js";

/** Every reason asking for the tournaments at some addresses can be refused where it is asked. */
export type TournamentsAtAddressesRefusedCode =
  "TournamentsAtAddresses.NotText";

/**
 * The tournaments of the website being read that are found at `addresses`,
 * each written as "2026/ac/spring-open", in the order the addresses were
 * given. An address no tournament is found at is left out of the answer rather
 * than refused, since a device may remember a tournament that has since gone.
 * For anybody, so it names nobody.
 */
export class TournamentsAtAddresses extends Query<
  readonly TournamentOfWebsite[]
> {
  constructor(
    readonly website: string,
    readonly addresses: readonly string[],
  ) {
    super();
    if (
      typeof website !== "string" ||
      !Array.isArray(addresses) ||
      addresses.some((each) => typeof each !== "string")
    ) {
      throw new ValidationError<TournamentsAtAddressesRefusedCode>(
        "TournamentsAtAddresses.NotText",
      );
    }
  }
}
