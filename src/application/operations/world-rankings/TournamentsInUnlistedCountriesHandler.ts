import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { WorldRankingCountries } from "../../services/WorldRankingCountries.js";
import { isWorldRankingSport } from "../../services/WorldRankingLists.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import type { TournamentsByWebsite } from "../tournaments/tournamentsOfWebsite.js";
import {
  type TournamentInUnlistedCountry,
  TournamentsInUnlistedCountries,
} from "./TournamentsInUnlistedCountries.js";

// In order as a reader looks for a name in a list, as the countries are.
const byName = new Intl.Collator("en");

/**
 * Every tournament the read model holds, kept when the list of its own sport
 * does not name the country it is played in. A sport with no list is left out,
 * since there is nothing to judge it by (TournamentsInUnlistedCountries.feature).
 */
export class TournamentsInUnlistedCountriesHandler extends QueryHandler<
  TournamentsInUnlistedCountries,
  readonly TournamentInUnlistedCountry[]
> {
  readonly handles: RequestType<TournamentsInUnlistedCountries> =
    TournamentsInUnlistedCountries;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly tournaments: TournamentsByWebsite,
    private readonly lists: WorldRankingCountries,
  ) {
    super();
  }

  async handle(
    query: TournamentsInUnlistedCountries,
  ): Promise<readonly TournamentInUnlistedCountry[]> {
    await administratorAsking(this.accounts, query.account);
    // The read model answers the soonest first and those starting on the same
    // day by name, so that sorting by country alone, which keeps the order of
    // equals, leaves each country's tournaments in the order wanted.
    const unlisted = (await this.tournaments.withSports())
      .filter(
        ({ sport, country }) =>
          isWorldRankingSport(sport) &&
          !this.lists.countriesOf(sport).has(country),
      )
      .map(({ name, country, address }) => ({
        name,
        country,
        countryName: Countries.thereAre.find(country)?.name ?? country,
        address,
      }));
    return unlisted.sort((one, other) =>
      byName.compare(one.countryName, other.countryName),
    );
  }
}
