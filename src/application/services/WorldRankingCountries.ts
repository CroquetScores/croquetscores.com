import { Refused } from "../../domain/common/Refused.js";
import type { WorldRankingSport } from "./WorldRankingLists.js";

/** Every way the lists the countries are read from can be refused. */
export type WorldRankingCountriesErrorCode =
  "WorldRankingCountries.UnreadableRow";

/**
 * A list that was not read, with the file and line of the row that could not
 * be. Named by a code, because the code is the contract.
 */
export class CountriesRefused extends Refused<WorldRankingCountriesErrorCode> {}

/**
 * Which countries the world rankings' lists of events name, for each sport
 * that has one (FileWorldRankingCountries.feature). A country is named by the
 * list of a sport and by none of the others: a tournament played in a country
 * only another sport's list names is one this sport's list does not know.
 */
export interface WorldRankingCountries {
  /** The codes of the site's countries the list of `sport` names. */
  countriesOf(sport: WorldRankingSport): ReadonlySet<string>;
}
