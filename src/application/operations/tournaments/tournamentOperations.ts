// What every operation on a tournament shares: who asks, finding the
// tournament, where tournaments are found, making what a request carries into
// what the tournament is given, and naming the accounts a list answers.
import {
  type Account,
  AccountRefused,
} from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type AddressTaken,
  type Tournament,
  type TournamentDetails,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../../../domain/aggregates/tournaments/value-objects/Country.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentAddress } from "../../../domain/aggregates/tournaments/value-objects/TournamentAddress.js";
import { TournamentFormat } from "../../../domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import { TournamentName } from "../../../domain/aggregates/tournaments/value-objects/TournamentName.js";
import { TournamentNotes } from "../../../domain/aggregates/tournaments/value-objects/TournamentNotes.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";

/** Why an operation on a tournament is refused, besides the tournament's own. */
export type TournamentOperationErrorCode =
  | "CreateTournament.NoSuchCountry"
  | "UpdateTournament.NoSuchCountry"
  | "RecentResults.NoSuchCountry"
  | "UpcomingTournaments.NoSuchCountry"
  | "AddManager.NoSuchAccount"
  | "AddScorer.NoSuchAccount"
  | `${string}.NoSuchTournament`;

/**
 * An operation's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class TournamentOperationRefused extends Refused<TournamentOperationErrorCode> {}

/**
 * Where tournaments are found. Every address a tournament has ever been found
 * at is kept, since an old address still leads to its tournament and must not
 * be given to another.
 */
export interface TournamentAddresses {
  /**
   * Every address in `year` and `sport` that a tournament other than
   * `tournament` has ever been found at. Every one in a year and a sport
   * rather than asked one at a time, because the tournament asks of them as it
   * decides, and it decides without waiting.
   */
  takenIn(
    year: number,
    sport: Sport,
    tournament: TournamentId,
  ): Promise<ReadonlySet<string>>;

  /**
   * The tournament found at `address`, written as "2026/ac/spring-open", now or
   * before: an old address still leads to its tournament. Nothing where no
   * tournament has ever been found there.
   */
  tournamentAt(address: string): Promise<TournamentId | undefined>;
}

/** What a request says a tournament is, as it was typed. */
export interface TournamentRequest {
  readonly name: string;
  /** Each a moment as the language's own date reads one. */
  readonly starts: string;
  readonly finishes: string;
  readonly format: string;
  readonly sport: string;
  /** The country's code, and the code of one of its regions, if any. */
  readonly country: string;
  readonly region?: string | undefined;
  readonly notes?: string | undefined;
  readonly handicap?: boolean | undefined;
  readonly drawsAllowed?: boolean | undefined;
  readonly levelTestsDrawn?: boolean | undefined;
  readonly worldRankings?: boolean | undefined;
  readonly national?: boolean | undefined;
  readonly international?: boolean | undefined;
}

/**
 * The account `written`, which asks. A forgotten one is refused with
 * `Account.Forgotten`: a session is ended when its account is forgotten, so
 * this is a request that raced the forgetting.
 */
export const askedBy = async (
  accounts: AggregateRepository<Account, AccountId>,
  written: string,
): Promise<AccountId> => {
  const id = AccountId.from(written);
  const account = await accounts.load(id);
  if (account === undefined) {
    throw new Error(`The account ${id.value} has no events.`);
  }
  if (account.forgotten) {
    throw new AccountRefused("Account.Forgotten", "The account is forgotten.");
  }
  return id;
};

/**
 * The tournament `written`, or refused as `operation`'s `NoSuchTournament`
 * where there is none: the id is the web layer's, from the address the request
 * was made at, and one that names nothing is a request about nothing.
 */
export const tournamentFor = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  written: string,
  operation: string,
): Promise<Tournament> => {
  const tournament = await tournaments.load(TournamentId.from(written));
  if (tournament === undefined) {
    throw new TournamentOperationRefused(
      `${operation}.NoSuchTournament`,
      "There is no such tournament.",
    );
  }
  return tournament;
};

/**
 * The tournament `written`, once `account` is known to be asking and to
 * manage it: refused as a command asking would be, in the order a command
 * asks, so that a manager's list refuses as changing the tournament would.
 * `operation` names what asks, as `tournamentFor` has it.
 */
export const managedBy = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  accounts: AggregateRepository<Account, AccountId>,
  account: string,
  written: string,
  operation: string,
): Promise<{ readonly by: AccountId; readonly tournament: Tournament }> => {
  const by = await askedBy(accounts, account);
  const tournament = await tournamentFor(tournaments, written, operation);
  if (!tournament.manages(by)) {
    throw new TournamentRefused(
      "Tournament.NotAManager",
      "Only a manager of the tournament can ask for this.",
    );
  }
  return { by, tournament };
};

/**
 * The tournament `written`, and the part `account` has in it, once it is known
 * to be asking and to manage or score it: refused as a manager's list is, but
 * letting a scorer in as well, for what a scorer is shown.
 */
export const managedOrScoredBy = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  accounts: AggregateRepository<Account, AccountId>,
  account: string,
  written: string,
  operation: string,
): Promise<{
  readonly tournament: Tournament;
  readonly part: "manager" | "scorer";
}> => {
  const by = await askedBy(accounts, account);
  const tournament = await tournamentFor(tournaments, written, operation);
  if (tournament.manages(by)) return { tournament, part: "manager" };
  if (tournament.scores(by)) return { tournament, part: "scorer" };
  throw new TournamentRefused(
    "Tournament.NotAManager",
    "Only a manager or a scorer of the tournament can ask for this.",
  );
};

/**
 * Each of `ids` with its account's name, in the order given. A forgotten
 * account is left out, since no list answers one unless it is expressly asked
 * to, and its name could not be read in any case.
 */
export const namesOf = async (
  accounts: AggregateRepository<Account, AccountId>,
  ids: readonly AccountId[],
): Promise<{ readonly id: AccountId; readonly name: string }[]> => {
  const named: { id: AccountId; name: string }[] = [];
  for (const id of ids) {
    const account = await accounts.load(id);
    const name = account?.forgotten === false ? account.name : undefined;
    if (name !== undefined) named.push({ id, name: name.toString() });
  }
  return named;
};

const countryCalled = (code: string): Country | undefined =>
  Countries.thereAre.find(code);

/** What `request` says, as the tournament is given it. */
export const detailsFrom = (request: TournamentRequest): TournamentDetails => {
  const country = countryCalled(request.country);
  if (country === undefined) {
    throw new Error(`There is no country ${request.country}.`);
  }
  return {
    name: TournamentName.from(request.name),
    starts: ReadOnlyDate.from(new Date(request.starts)),
    finishes: ReadOnlyDate.from(new Date(request.finishes)),
    format: TournamentFormat.from(request.format),
    sport: Sport.from(request.sport),
    country,
    region: request.region,
    notes:
      request.notes === undefined
        ? undefined
        : TournamentNotes.from(request.notes),
    handicap: request.handicap,
    drawsAllowed: request.drawsAllowed,
    levelTestsDrawn: request.levelTestsDrawn,
    worldRankings: request.worldRankings,
    national: request.national,
    international: request.international,
  };
};

/**
 * Whether an address is taken, for a tournament that is to be as `details`
 * say: every address in its year and its sport that another tournament has
 * ever been found at.
 */
export const takenFor = async (
  addresses: TournamentAddresses,
  details: TournamentDetails,
  tournament: TournamentId,
): Promise<AddressTaken> => {
  const taken = await addresses.takenIn(
    TournamentAddress.yearOf(details.starts),
    details.sport,
    tournament,
  );
  return (address) => taken.has(address.toString());
};

/**
 * The rule `making` breaks, as the field `field`, or nothing when it breaks
 * none. A value is asked about by being made, which is the only way each
 * offers, and throws naming the first rule it breaks.
 */
export const brokenBy = (
  field: string,
  making: () => unknown,
): BrokenRule[] => {
  try {
    making();
    return [];
  } catch (failure) {
    // Named as a validation error of some code: the class is generic, and
    // narrowing by instanceof alone leaves its code as anything at all.
    if (failure instanceof ValidationError) {
      const named = failure as ValidationError<string>;
      return [{ code: named.code, fields: [field] }];
    }
    throw failure;
  }
};

/**
 * Every rule `request` breaks of its values' own, in the order a form asks
 * them. The country is found among the countries there are, and one there is
 * not breaks `operation`'s `NoSuchCountry`.
 */
export const brokenByTournament = (
  request: TournamentRequest,
  operation: "CreateTournament" | "UpdateTournament",
): BrokenRule[] => [
  ...brokenBy("name", () => TournamentName.from(request.name)),
  ...brokenBy("starts", () => ReadOnlyDate.from(new Date(request.starts))),
  ...brokenBy("finishes", () => ReadOnlyDate.from(new Date(request.finishes))),
  ...brokenBy("format", () => TournamentFormat.from(request.format)),
  ...brokenBy("sport", () => Sport.from(request.sport)),
  ...(countryCalled(request.country) === undefined
    ? [{ code: `${operation}.NoSuchCountry`, fields: ["country"] }]
    : []),
  ...(request.notes === undefined
    ? []
    : brokenBy("notes", () => TournamentNotes.from(request.notes ?? ""))),
];

/** What making somebody a manager or a scorer asks of where accounts are found. */
export interface AccountsByAddress {
  /** The account at `address`, or nothing where no account is found there. */
  find(address: EmailAddress): Promise<AccountId | undefined>;
}
