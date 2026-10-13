import { AggregateRoot } from "../../common/AggregateRoot.js";
import type { DomainEvent } from "../../common/DomainEvent.js";
import type { Id } from "../../common/Id.js";
import { ReadOnlyDate } from "../../common/ReadOnlyDate.js";
import { Refused } from "../../common/Refused.js";
import { Slug } from "../../common/Slug.js";
import { Website } from "../../common/Website.js";
import { AccountId } from "../accounts/AccountId.js";
import { Administrator } from "../accounts/Administrator.js";
import { WorldRankingOfficer } from "../accounts/WorldRankingOfficer.js";
import { CompetitionReference } from "./CompetitionReference.js";
import { BlockAdded } from "./events/BlockAdded.js";
import { BlockUpdated } from "./events/BlockUpdated.js";
import { CompetitionArchived } from "./events/CompetitionArchived.js";
import { CompetitionMoved } from "./events/CompetitionMoved.js";
import { CompetitionRestored } from "./events/CompetitionRestored.js";
import { CompetitionsSpacedOut } from "./events/CompetitionsSpacedOut.js";
import { KnockoutAdded } from "./events/KnockoutAdded.js";
import { KnockoutUpdated } from "./events/KnockoutUpdated.js";
import { ManagerAdded } from "./events/ManagerAdded.js";
import { ManagerRemoved } from "./events/ManagerRemoved.js";
import { ScorerAdded } from "./events/ScorerAdded.js";
import { ScorerRemoved } from "./events/ScorerRemoved.js";
import { SwissAdded } from "./events/SwissAdded.js";
import { SwissUpdated } from "./events/SwissUpdated.js";
import { TournamentArchived } from "./events/TournamentArchived.js";
import {
  TournamentCreated,
  type WrittenTournament,
} from "./events/TournamentCreated.js";
import { TournamentPlayerAdded } from "./events/TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "./events/TournamentPlayerArchived.js";
import { TournamentPlayerMoved } from "./events/TournamentPlayerMoved.js";
import { TournamentPlayersSpacedOut } from "./events/TournamentPlayersSpacedOut.js";
import { TournamentPlayerRestored } from "./events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "./events/TournamentPlayerUpdated.js";
import { TournamentRestored } from "./events/TournamentRestored.js";
import { TournamentUpdated } from "./events/TournamentUpdated.js";
import { TeamAdded } from "./events/TeamAdded.js";
import { TeamArchived } from "./events/TeamArchived.js";
import { TeamMoved } from "./events/TeamMoved.js";
import { TeamPlayerAdded } from "./events/TeamPlayerAdded.js";
import { TeamPlayerArchived } from "./events/TeamPlayerArchived.js";
import { TeamPlayerMoved } from "./events/TeamPlayerMoved.js";
import { TeamPlayerRestored } from "./events/TeamPlayerRestored.js";
import { TeamPlayersSpacedOut } from "./events/TeamPlayersSpacedOut.js";
import { TeamPlayerUpdated } from "./events/TeamPlayerUpdated.js";
import { TeamRestored } from "./events/TeamRestored.js";
import { TeamsSpacedOut } from "./events/TeamsSpacedOut.js";
import { TeamUpdated } from "./events/TeamUpdated.js";
import { TestAdded } from "./events/TestAdded.js";
import { TestUpdated } from "./events/TestUpdated.js";
import { firstFree, lastOf, slugsFor } from "./freeSlugs.js";
import { CompetitionId } from "./primitives/CompetitionId.js";
import { TeamId } from "./primitives/TeamId.js";
import { TeamPlayerId } from "./primitives/TeamPlayerId.js";
import type { TournamentId } from "./primitives/TournamentId.js";
import { TournamentPlayerId } from "./primitives/TournamentPlayerId.js";
import { Team, type TeamDetails } from "./Team.js";
import { TeamPlayer, type TeamPlayerDetails } from "./TeamPlayer.js";
import {
  TournamentPlayer,
  type TournamentPlayerDetails,
} from "./TournamentPlayer.js";
import { BestOf } from "./value-objects/BestOf.js";
import { Rounds } from "./value-objects/Rounds.js";
import { CompetitionName } from "./value-objects/CompetitionName.js";
import { ExpectedMatches } from "./value-objects/ExpectedMatches.js";
import { TestGroup } from "./value-objects/TestGroup.js";
import { Countries } from "./value-objects/Countries.js";
import type { Country } from "./value-objects/Country.js";
import { KnockoutDraw } from "./value-objects/KnockoutDraw.js";
import type { Region } from "./value-objects/Region.js";
import { Sport } from "./value-objects/Sport.js";
import {
  croquetScoresSports,
  gateballScoresSports,
} from "./value-objects/sports.js";
import { TournamentAddress } from "./value-objects/TournamentAddress.js";
import { TournamentFormat } from "./value-objects/TournamentFormat.js";
import {
  croquetScoresFormats,
  gateballScoresFormats,
} from "./value-objects/tournamentFormats.js";
import { TournamentName } from "./value-objects/TournamentName.js";
import { TournamentSubtitle } from "./value-objects/TournamentSubtitle.js";
import type { WorldRankingName } from "./value-objects/WorldRankingName.js";

/** Why a tournament will not do what it was asked. */
export type TournamentErrorCode =
  | "Tournament.Archived"
  | "Tournament.SportNotOffered"
  | "Tournament.FormatNotOffered"
  | "Tournament.FinishesBeforeStarts"
  | "Tournament.StartsAfterNextYear"
  | "Tournament.FinishesAfterNextYear"
  | "Tournament.RegionNotInCountry"
  | "Tournament.NoWorldRankings"
  | "Tournament.HandicapInWorldRankings"
  | "Tournament.DrawsInWorldRankings"
  | "Tournament.NationalAndInternational"
  | "Tournament.DrawnTestsWithoutTeams"
  | "Tournament.PlayerAlreadyAdded"
  | "Tournament.PlayerNameTaken"
  | "Tournament.NoSuchPlayer"
  | "Tournament.CompetitionAlreadyAdded"
  | "Tournament.CompetitionNameTaken"
  | "Tournament.NoSuchCompetition"
  | "Tournament.CompetitionArchived"
  | "Tournament.NotABlock"
  | "Tournament.NotAKnockout"
  | "Tournament.NotASwiss"
  | "Tournament.KnockoutPlayerHasGames"
  | "Tournament.NotAManager"
  | "Tournament.NotAManagerOrScorer"
  | "Tournament.NotAManagerOrRankingOfficer"
  | "Tournament.WorldRankingNameIsTheName"
  | "Tournament.LastManager"
  | "Tournament.AlreadyAManager"
  | "Tournament.PlayedByTeams"
  | "Tournament.NotPlayedByTeams"
  | "Tournament.PlayedByTeamsFixed"
  | "Tournament.TeamAlreadyAdded"
  | "Tournament.TeamNameTaken"
  | "Tournament.TeamShortNameTaken"
  | "Tournament.NoSuchTeam"
  | "Tournament.TeamArchived"
  | "Tournament.TeamPlayerAlreadyAdded"
  | "Team.PlayerNameTaken"
  | "Team.NoSuchPlayer"
  | "Tournament.NotATest"
  | "Tournament.TestAgainstItself"
  | "Tournament.TestFinishesBeforeStarts"
  | "Tournament.TestStartsBeforeTournament"
  | "Tournament.TestFinishesAfterTournament"
  | "Tournament.TestHasGames"
  | "Tournament.TestHasGamesInUse"
  | "Tournament.ExpectedMatchesBelowStarted"
  | "Tournament.BestOfBelowGamesPlayed";

/**
 * A tournament's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class TournamentRefused extends Refused<TournamentErrorCode> {}

/**
 * What creating a tournament says, and updating it says again. Its region, if
 * it has one, is given by its code and found among its country's, so that a
 * region of another country is the tournament's to refuse. Handicap, world
 * rankings, national, international and whether a level test is drawn may
 * each be left unsaid, and what a tournament is when they are is its own to
 * decide.
 */
export interface TournamentDetails {
  readonly name: TournamentName;
  readonly starts: ReadOnlyDate;
  readonly finishes: ReadOnlyDate;
  readonly format: TournamentFormat;
  readonly sport: Sport;
  readonly country: Country;
  readonly region?: string | undefined;
  readonly subtitle?: TournamentSubtitle | undefined;
  readonly handicap?: boolean | undefined;
  readonly drawsAllowed?: boolean | undefined;
  readonly levelTestsDrawn?: boolean | undefined;
  readonly worldRankings?: boolean | undefined;
  readonly national?: boolean | undefined;
  readonly international?: boolean | undefined;
}

/**
 * Whether an address is somebody else's. It is not the tournament's to know,
 * since it does not know what other tournaments there are, so whatever creates
 * or updates it says, as it says its id.
 */
export type AddressTaken = (address: TournamentAddress) => boolean;

/**
 * What a test is asked for as: the two teams it is between, the first first,
 * the days it starts and finishes, each the start of its day in UTC, how many
 * matches it is expected to have, what each is the best of, and its group, if
 * any.
 */
export interface TestDetails {
  readonly firstTeam: TeamId;
  readonly secondTeam: TeamId;
  readonly starts: ReadOnlyDate;
  readonly finishes: ReadOnlyDate;
  readonly expectedMatches: ExpectedMatches;
  readonly bestOf: BestOf;
  readonly group?: TestGroup | undefined;
}

/**
 * What a test has had played in it, which is not the tournament's to know: the
 * matches started, a match starting once its two players have a game in use,
 * and the most games in use any two players have played.
 */
export interface TestPlayed {
  readonly matchesStarted: number;
  readonly mostGamesBetweenTwo: number;
}

/** What each kind of competition is besides what every competition is. */
export type CompetitionShape =
  | {
      readonly kind: "block";
      readonly bestOf: BestOf;
      readonly rounds: Rounds;
    }
  | { readonly kind: "knockout"; readonly draw: KnockoutDraw }
  | { readonly kind: "swiss"; readonly bestOf: BestOf }
  | {
      readonly kind: "test";
      readonly firstTeam: TeamId;
      readonly secondTeam: TeamId;
      readonly starts: ReadOnlyDate;
      readonly finishes: ReadOnlyDate;
      readonly expectedMatches: ExpectedMatches;
      readonly bestOf: BestOf;
      readonly group: TestGroup | undefined;
    };

/** One of a tournament's competitions: its reference, and its shape. */
export interface CompetitionInTournament {
  readonly reference: CompetitionReference;
  readonly shape: CompetitionShape;
}

// Everything a tournament is apart from its players and its competitions, as
// the last creating or updating left it.
interface Settled {
  readonly website: Website;
  readonly name: TournamentName;
  readonly starts: ReadOnlyDate;
  readonly finishes: ReadOnlyDate;
  readonly format: TournamentFormat;
  readonly sport: Sport;
  readonly country: Country;
  readonly region: Region | undefined;
  readonly subtitle: TournamentSubtitle | undefined;
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly levelTestsDrawn: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
  readonly address: TournamentAddress;
}

// The sports and formats each site offers, which are the ones its try website
// offers too, since the point of a try website is to learn the same system.
const SPORTS_OFFERED = {
  croquetScores: croquetScoresSports,
  gateballScores: gateballScoresSports,
} as const;

const FORMATS_OFFERED = {
  croquetScores: croquetScoresFormats,
  gateballScores: gateballScoresFormats,
} as const;

// How far apart competitions and players are put when each is added, so that
// one can later be put between two others without either of them moving.
const ORDER_STEP = 10_000;

// A name is the same name however it is capitalised, as a reader takes it.
const sameName = (one: string, other: string): boolean =>
  one.toLowerCase() === other.toLowerCase();

const refuse = (code: TournamentErrorCode, message: string): never => {
  throw new TournamentRefused(code, message);
};

/**
 * A tournament: created on a website, and holding its players and a reference
 * to each of its competitions. Everything it is, it says
 * was caused by whoever asked for it, since organising a tournament is many
 * people's work.
 *
 * It is run by its managers. Whoever creates it is the first, and only a
 * manager can change it afterwards, so every method that changes it is told
 * who asks and asks that before anything else. Its scorers enter scores, which
 * nothing records yet, and can do nothing else. Writing commentary is not a
 * change of that kind: any account may (allowWritingCommentary).
 *
 * What it is given is refused as each value would be on its own before it gets
 * here; what the tournament refuses is what it asks of them together, and of
 * them against what it already holds.
 */
export class Tournament extends AggregateRoot {
  #settled: Settled | undefined;
  // Every address it has been found at, the first first, each once.
  readonly #addresses: TournamentAddress[] = [];
  #archived = false;
  // By the written id. How they are listed is `players` and `competitions`.
  readonly #players = new Map<string, TournamentPlayer>();
  readonly #competitions = new Map<string, CompetitionInTournament>();
  readonly #teams = new Map<string, Team>();
  // By the written id, in the order they were made.
  readonly #managers = new Set<string>();
  readonly #scorers = new Set<string>();

  private constructor(id: TournamentId) {
    super(id);
  }

  /**
   * A new tournament on `website`, as `details` say, found at the first
   * address of its year, its sport and its name that `taken` does not say is
   * somebody else's.
   */
  static create(
    id: TournamentId,
    website: Website,
    details: TournamentDetails,
    taken: AddressTaken,
    by: AccountId,
    at: ReadOnlyDate,
  ): Tournament {
    const tournament = new Tournament(id);
    const settled = tournament.#settle(website, details, at, (year, sport) =>
      tournament.#addressFor(details.name, year, sport, taken),
    );
    tournament.record(
      new TournamentCreated(website.host, writtenFrom(settled), by, at),
    );
    return tournament;
  }

  /**
   * A tournament brought over from the old sites, as `create` would make it
   * but found at the year it starts, its sport and `slug`, the slug the old
   * site gave it, so that links to it still find it (bringOver.feature).
   * Nothing is asked of whether the address is taken: the old sites never
   * gave one twice, and the site has no tournament of its own when they are
   * brought over.
   */
  static bringOver(
    id: TournamentId,
    website: Website,
    details: TournamentDetails,
    slug: Slug,
    by: AccountId,
    at: ReadOnlyDate,
  ): Tournament {
    const tournament = new Tournament(id);
    const settled = tournament.#settle(
      website,
      details,
      at,
      (year, sport) => TournamentAddress.from(year, sport, slug),
      { broughtOver: true },
    );
    tournament.record(
      new TournamentCreated(website.host, writtenFrom(settled), by, at),
    );
    return tournament;
  }

  /** The tournament its stream, `events`, leaves. */
  static rebuiltFrom(
    id: TournamentId,
    events: readonly DomainEvent[],
  ): Tournament {
    const tournament = new Tournament(id);
    tournament.replay(events);
    return tournament;
  }

  override get id(): TournamentId {
    return super.id;
  }

  get website(): Website {
    return this.#now.website;
  }

  get name(): TournamentName {
    return this.#now.name;
  }

  get starts(): ReadOnlyDate {
    return this.#now.starts;
  }

  get finishes(): ReadOnlyDate {
    return this.#now.finishes;
  }

  get format(): TournamentFormat {
    return this.#now.format;
  }

  get sport(): Sport {
    return this.#now.sport;
  }

  get country(): Country {
    return this.#now.country;
  }

  /** The region of its country it is played in, or nothing when it is in none. */
  get region(): Region | undefined {
    return this.#now.region;
  }

  get subtitle(): TournamentSubtitle | undefined {
    return this.#now.subtitle;
  }

  get handicap(): boolean {
    return this.#now.handicap;
  }

  /**
   * Whether a game on equal points with no mark saying who won is kept, which
   * few tournaments allow. Not unless it is said to.
   */
  get drawsAllowed(): boolean {
    return this.#now.drawsAllowed;
  }

  /**
   * Whether a test level on matches is drawn, rather than decided by net
   * games and then net hoops. Only a tournament played by teams draws one.
   */
  get levelTestsDrawn(): boolean {
    return this.#now.levelTestsDrawn;
  }

  get worldRankings(): boolean {
    return this.#now.worldRankings;
  }

  get national(): boolean {
    return this.#now.national;
  }

  get international(): boolean {
    return this.#now.international;
  }

  /** Where the tournament is found now. */
  get address(): TournamentAddress {
    return this.#now.address;
  }

  /**
   * Every address the tournament has been found at, the first first, so that
   * an old link can be sent on to where it is now.
   */
  get addresses(): readonly TournamentAddress[] {
    return [...this.#addresses];
  }

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * Its players, lowest order first, the archived after all the others
   * whatever their order.
   */
  get players(): readonly TournamentPlayer[] {
    return archivedLast(this.#playersByOrder, ({ archived }) => archived);
  }

  /**
   * Its competitions, lowest order first, the archived after all the others
   * whatever their order.
   */
  get competitions(): readonly CompetitionInTournament[] {
    return archivedLast(
      this.#competitionsByOrder,
      ({ reference }) => reference.archived,
    );
  }

  /**
   * Its teams, lowest order first, the archived after all the others whatever
   * their order. A Standard tournament has none.
   */
  get teams(): readonly Team[] {
    return archivedLast(this.#teamsByOrder, ({ archived }) => archived);
  }

  /** Its managers, in the order they were made, the one who created it first. */
  get managers(): readonly AccountId[] {
    return [...this.#managers].map((written) => AccountId.from(written));
  }

  /** Its scorers, in the order they were made. */
  get scorers(): readonly AccountId[] {
    return [...this.#scorers].map((written) => AccountId.from(written));
  }

  manages(account: AccountId): boolean {
    return this.#managers.has(account.value);
  }

  /**
   * Whether `by` may do what a manager may: one of its managers, or an account
   * asking as an administrator (Administrator.ts), which may do it to every
   * tournament (onlyManagers.feature). Kept apart from {@link manages}, which
   * says who the managers are: an administrator let through is not one, so
   * is never counted among them, nor as the manager a tournament must keep.
   */
  mayManage(by: AccountId): boolean {
    return this.manages(by) || by instanceof Administrator;
  }

  /**
   * Whether `by` may change its players' world ranking names
   * (changeWorldRankingName.feature): whoever may manage it, or an account
   * asking as a world ranking officer (WorldRankingOfficer.ts), which may do
   * that to every tournament of a sport ranked across the world and nothing
   * else. In any other sport there are no rankings for it to look after.
   */
  mayChangeWorldRankingNames(by: AccountId): boolean {
    return (
      this.mayManage(by) ||
      (by instanceof WorldRankingOfficer && this.sport.hasWorldRankings)
    );
  }

  /**
   * That the player `id`'s world ranking name is now `worldRankingName`,
   * none where it is blank, and nothing else about them changed. Refused
   * unless `by` may change world ranking names, as an update is for the rest,
   * and recorded as the player being updated. Changing it to what it is
   * records nothing.
   */
  changeWorldRankingName(
    id: TournamentPlayerId,
    worldRankingName: string,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessRankingNamesMayChange(by);
    this.#refuseOnceArchived();
    this.#refuseWhereTheNameIsTheWorldRankingName();
    const found = this.#playerFound(id);
    const player = found.update({
      name: found.name.toString(),
      representing: found.representing,
      flag: found.flag === undefined ? undefined : String(found.flag),
      worldRankingName,
    });
    if (samePlayer(player, found)) return;
    this.record(playerEvent(TournamentPlayerUpdated, player, by, at));
  }

  /**
   * That the player `id` of the team `teamId` now has the world ranking name
   * `worldRankingName`, and nothing else about them changed, as
   * changeWorldRankingName does for a tournament's player.
   */
  changeTeamPlayerWorldRankingName(
    teamId: TeamId,
    id: TeamPlayerId,
    worldRankingName: string,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessRankingNamesMayChange(by);
    this.#refuseOnceArchived();
    this.#refuseWhereTheNameIsTheWorldRankingName();
    const { player: found } = this.#teamPlayerFound(teamId, id);
    const player = found.update({
      name: found.name.toString(),
      worldRankingName,
    });
    if (sameWorldRankingName(player.worldRankingName, found.worldRankingName))
      return;
    this.record(
      new TeamPlayerUpdated(
        teamId.value,
        id.value,
        player.name.toString(),
        player.worldRankingName?.toString(),
        by,
        at,
      ),
    );
  }

  scores(account: AccountId): boolean {
    return this.#scorers.has(account.value);
  }

  /**
   * That `account` is a manager of the tournament. A scorer made one is no
   * longer a scorer, since a manager can do everything a scorer can. Making a
   * manager of a manager records nothing.
   */
  addManager(account: AccountId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (this.manages(account)) return;
    this.record(new ManagerAdded(account.value, by, at));
  }

  /**
   * That `account` no longer manages the tournament. A tournament always has
   * a manager, since nobody else can change it, so the last is refused.
   * Taking off an account that does not manage records nothing.
   */
  removeManager(account: AccountId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (!this.manages(account)) return;
    if (this.#managers.size === 1) {
      refuse("Tournament.LastManager", "A tournament always has a manager.");
    }
    this.record(new ManagerRemoved(account.value, by, at));
  }

  /**
   * That `account` is a scorer of the tournament. A manager is refused: they
   * can already do everything a scorer can, and one who wants to do less is
   * taken off the managers first. Making a scorer of a scorer records nothing.
   */
  addScorer(account: AccountId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (this.manages(account)) {
      refuse(
        "Tournament.AlreadyAManager",
        "The account manages the tournament.",
      );
    }
    if (this.scores(account)) return;
    this.record(new ScorerAdded(account.value, by, at));
  }

  /**
   * That `account` no longer scores the tournament. Taking off an account that
   * does not score records nothing.
   */
  removeScorer(account: AccountId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (!this.scores(account)) return;
    this.record(new ScorerRemoved(account.value, by, at));
  }

  /**
   * That the tournament is now as `details` say. It keeps its address unless
   * the year it starts or its sport changes, and is then found at the first
   * address of the new year or sport that is its own already or that `taken`
   * does not say is somebody else's. An update that changes nothing records
   * nothing.
   */
  update(
    details: TournamentDetails,
    taken: AddressTaken,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const settled = this.#settle(
      this.#now.website,
      details,
      at,
      (year, sport) => this.#addressFor(details.name, year, sport, taken),
    );
    // What a tournament holds depends on whether it is played by teams, so
    // once it holds anything, a change to that would leave it holding what it
    // could no longer have.
    if (
      settled.format.isTeamFormat !== this.#now.format.isTeamFormat &&
      this.#holdsAnything
    ) {
      refuse(
        "Tournament.PlayedByTeamsFixed",
        "The tournament holds what only its format can have.",
      );
    }
    const written = writtenFrom(settled);
    if (sameWriting(written, writtenFrom(this.#now))) return;
    this.record(new TournamentUpdated(written, by, at));
  }

  /** That the tournament is set aside. Archiving it again records nothing. */
  archive(by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    if (this.#archived) return;
    this.record(new TournamentArchived(by, at));
  }

  /**
   * That the tournament is as it was before it was archived. Restoring one
   * that is not archived records nothing.
   */
  restore(by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    if (!this.#archived) return;
    this.record(new TournamentRestored(by, at));
  }

  /**
   * That a player was added, as `details` say, given 10,000 more than the
   * highest order there is. Refused when another player has the id, or the
   * name, archived or not.
   */
  addPlayer(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    this.#refuseOncePlayedByTeams();
    details = this.#withTheirNameKnownInTheRankings(details);
    // Asked what a player is first, so that a name that is no name is refused
    // as one rather than as a slug that cannot be made of it.
    TournamentPlayer.ensureValid(details);
    // Found by a slug of their name no other player has, archived or not, as
    // a team is by its short name.
    const slug = firstFree(
      Slug.fromName(details.name),
      id,
      [...this.#players.values()].map((each) => each.slug.toString()),
    );
    const player = TournamentPlayer.from(id, details, {
      slug,
      order: this.#nextPlayerOrder,
    });
    if (this.#players.has(id.value)) {
      refuse("Tournament.PlayerAlreadyAdded", "The player is already added.");
    }
    this.#refuseAPlayerNameTaken(player);
    this.record(
      new TournamentPlayerAdded(
        player.id.value,
        player.name.toString(),
        player.representing,
        player.flag === undefined ? undefined : String(player.flag),
        player.worldRankingName?.toString(),
        player.slug.toString(),
        player.order,
        by,
        at,
      ),
    );
  }

  /**
   * That the player `id` is now as `details` say. Refused when the tournament
   * has no such player or another player has the name, and as the player
   * refuses an update. An update that changes nothing records nothing.
   */
  updatePlayer(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#playerFound(id);
    const player = found.update(this.#withTheirNameKnownInTheRankings(details));
    this.#refuseAPlayerNameTaken(player);
    if (samePlayer(player, found)) return;
    this.record(playerEvent(TournamentPlayerUpdated, player, by, at));
  }

  /**
   * That the player `id` is set aside. Whether they have played any games is
   * not the tournament's to know, so whatever asks says, and the player
   * refuses if they have. They are out of the way, so they are put last, given
   * 10,000 more than the highest order there is, and keep that order if they
   * are restored. Archiving one who is archived records nothing.
   */
  archivePlayer(
    id: TournamentPlayerId,
    hasPlayedGames: boolean,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#playerFound(id);
    if (found.archive({ hasGames: hasPlayedGames }) === found) return;
    this.record(
      new TournamentPlayerArchived(id.value, this.#nextPlayerOrder, by, at),
    );
  }

  /**
   * That the player `id` is moved a place among those not archived, as a
   * competition is (`moveCompetition`): given the order halfway between the
   * two they now come between, rounded down, with every player spaced out
   * again first where there is no whole number left in the room. An archived
   * player keeps their order and still counts. Moving the first up or the
   * last down records nothing, since there is nowhere for them to go.
   */
  movePlayer(
    id: TournamentPlayerId,
    direction: "up" | "down",
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    this.#playerFound(id).ensureMovable();
    const all = this.#playersByOrder;
    const inUse = all.filter(({ archived }) => !archived);
    const place = inUse.findIndex((player) => player.id.equals(id));
    const passed = inUse[direction === "up" ? place - 1 : place + 1];
    if (passed === undefined) return;

    const orderPastPassed = (): number | undefined => {
      const players = this.#playersByOrder;
      return orderPast(
        players.map(({ order }) => order),
        players.findIndex((player) => player.equals(passed)),
        direction,
      );
    };
    let order = orderPastPassed();
    if (order === undefined) {
      this.record(
        new TournamentPlayersSpacedOut(
          all.map((player) => player.id.value),
          by,
          at,
        ),
      );
      order = orderPastPassed();
    }
    if (order === undefined) {
      throw new Error("Spaced out, there was still no room to move into.");
    }
    this.record(new TournamentPlayerMoved(id.value, order, by, at));
  }

  /** That the archived player `id` is restored. One who is not records nothing. */
  restorePlayer(id: TournamentPlayerId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#playerFound(id);
    if (found.restore() === found) return;
    this.record(new TournamentPlayerRestored(id.value, by, at));
  }

  /**
   * That a block called `name`, the best of `bestOf`, was added, played in
   * `rounds`.
   */
  addBlock(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
    rounds: Rounds,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const { slug, order } = this.#placeFor(id, name);
    this.record(
      new BlockAdded(
        id.value,
        name.toString(),
        slug,
        order,
        bestOf.games,
        rounds.count,
        by,
        at,
      ),
    );
  }

  /** That a knockout called `name`, with a draw of `draw`'s shape, was added. */
  addKnockout(
    id: CompetitionId,
    name: CompetitionName,
    draw: KnockoutDraw,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const { slug, order } = this.#placeFor(id, name);
    this.record(
      new KnockoutAdded(
        id.value,
        name.toString(),
        slug,
        order,
        draw.places,
        draw.rounds.map((round) => round.games),
        by,
        at,
      ),
    );
  }

  /** That a Swiss called `name`, the best of `bestOf`, was added. */
  addSwiss(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const { slug, order } = this.#placeFor(id, name);
    this.record(
      new SwissAdded(
        id.value,
        name.toString(),
        slug,
        order,
        bestOf.games,
        by,
        at,
      ),
    );
  }

  /**
   * That the block `id` is now called `name`, is the best of `bestOf` and is
   * played in `rounds`. Its slug and its order are kept. An update that
   * changes nothing records nothing.
   */
  updateBlock(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
    rounds: Rounds,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const found = this.#competitionToUpdate(id, "block", name);
    if (found.shape.kind !== "block") return;
    if (
      found.reference.name.equals(name) &&
      found.shape.bestOf.equals(bestOf) &&
      found.shape.rounds.equals(rounds)
    )
      return;
    this.record(
      new BlockUpdated(
        id.value,
        name.toString(),
        bestOf.games,
        rounds.count,
        by,
        at,
      ),
    );
  }

  /**
   * That the knockout `id` is now called `name` and has a draw of `draw`'s
   * shape. A draw can be changed after games are played in it, but not so as
   * to move a player who has games. Where each player is in the draw is not
   * the tournament's to know, so whatever asks says whether the change does.
   */
  updateKnockout(
    id: CompetitionId,
    name: CompetitionName,
    draw: KnockoutDraw,
    movesAPlayerWithGames: boolean,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const found = this.#competitionToUpdate(id, "knockout", name);
    if (found.shape.kind !== "knockout") return;
    const drawChanged = !found.shape.draw.equals(draw);
    if (drawChanged && movesAPlayerWithGames) {
      refuse(
        "Tournament.KnockoutPlayerHasGames",
        "The change to the draw moves a player who has games.",
      );
    }
    if (found.reference.name.equals(name) && !drawChanged) return;
    this.record(
      new KnockoutUpdated(
        id.value,
        name.toString(),
        draw.places,
        draw.rounds.map((round) => round.games),
        by,
        at,
      ),
    );
  }

  /**
   * That the Swiss `id` is now called `name` and is the best of `bestOf`. Its
   * slug and its order are kept. An update that changes nothing records
   * nothing.
   */
  updateSwiss(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const found = this.#competitionToUpdate(id, "swiss", name);
    if (found.shape.kind !== "swiss") return;
    if (found.reference.name.equals(name) && found.shape.bestOf.equals(bestOf))
      return;
    this.record(
      new SwissUpdated(id.value, name.toString(), bestOf.games, by, at),
    );
  }

  /**
   * That the competition `id` is set aside. A block, a knockout or a Swiss is,
   * whether or not it has games: they are kept with it, and come back when it
   * is restored. A test is not once any of its matches has started, since it
   * has then been played; what has been played in it is not the tournament's
   * to know, so whatever asks says, as `played`, and says nothing of any other
   * kind. It is out of the way, so it is put last, given 10,000 more than the
   * highest order there is, and keeps that order if it is restored. Archiving
   * one that is archived records nothing.
   */
  archiveCompetition(
    id: CompetitionId,
    by: AccountId,
    at: ReadOnlyDate,
    played?: TestPlayed,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#competitionFound(id);
    if (found.reference.archived) return;
    if (found.shape.kind === "test" && (played?.matchesStarted ?? 0) > 0) {
      refuse(
        "Tournament.TestHasGamesInUse",
        "The test has games in use between its teams' players.",
      );
    }
    this.record(new CompetitionArchived(id.value, this.#nextOrder, by, at));
  }

  /**
   * That the competition `id` is moved a place among those not archived: up to
   * just before the one above it, or down to just after the one below. It is
   * given the order halfway between the two it now comes between, rounded
   * down, and nothing else moves, as a competition put anywhere in the list
   * would be. Put first, it is given half the order of the one it comes
   * before, and put last, 10,000 more than the highest order there is.
   *
   * An archived competition keeps its order and still counts, so the room
   * between two competitions ends at one lying between them. Where there is
   * no whole number left in the room, every competition is spaced out again
   * first, 10,000 apart in the order they are in. Moving the first up or the
   * last down records nothing, since there is nowhere for it to go.
   */
  moveCompetition(
    id: CompetitionId,
    direction: "up" | "down",
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (this.#competitionFound(id).reference.archived) {
      refuse("Tournament.CompetitionArchived", "The competition is archived.");
    }
    const inUse = this.#competitionsByOrder.filter(
      ({ reference }) => !reference.archived,
    );
    const place = inUse.findIndex(({ reference }) => reference.id.equals(id));
    const passed = inUse[direction === "up" ? place - 1 : place + 1];
    if (passed === undefined) return;

    let order = this.#orderPast(passed.reference.id, direction);
    if (order === undefined) {
      this.record(
        new CompetitionsSpacedOut(
          this.#competitionsByOrder.map(({ reference }) => reference.id.value),
          by,
          at,
        ),
      );
      order = this.#orderPast(passed.reference.id, direction);
    }
    // Spaced 10,000 apart, there is always room, so none here is a mistake in
    // the spacing rather than something to refuse.
    if (order === undefined) {
      throw new Error("Spaced out, there was still no room to move into.");
    }
    this.record(new CompetitionMoved(id.value, order, by, at));
  }

  /**
   * That the archived competition `id` is restored. One that is not records
   * nothing.
   */
  restoreCompetition(id: CompetitionId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#competitionFound(id);
    if (!found.reference.archived) return;
    // A test is between two teams, and one archived since the test was would
    // leave it against a team that is out of the way.
    if (found.shape.kind === "test") {
      this.#teamFound(found.shape.firstTeam).ensureInUse();
      this.#teamFound(found.shape.secondTeam).ensureInUse();
    }
    this.record(new CompetitionRestored(id.value, by, at));
  }

  /**
   * That a team was added, as `details` say, found at a slug of its short
   * name no other team has, and given 10,000 more than the highest order
   * there is. Only a tournament played by teams has teams. Refused when
   * another team has the id, or the name or the short name however it is
   * capitalised, archived or not.
   */
  addTeam(
    id: TeamId,
    details: TeamDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    this.#refuseUnlessPlayedByTeams();
    Team.ensureValid(details);
    if (this.#teams.has(id.value)) {
      refuse("Tournament.TeamAlreadyAdded", "The team is already added.");
    }
    const slug = firstFree(
      Slug.fromName(details.shortName),
      id,
      [...this.#teams.values()].map((team) => team.slug.toString()),
    );
    const team = Team.from(id, details, { slug, order: this.#nextTeamOrder });
    this.#refuseATeamNameTaken(team);
    this.record(
      new TeamAdded(
        id.value,
        team.name.toString(),
        team.shortName.toString(),
        team.flag === undefined ? undefined : String(team.flag),
        slug.toString(),
        team.order,
        by,
        at,
      ),
    );
  }

  /**
   * That the team `id` is now as `details` say, keeping its slug, its order
   * and its players. Its tests are called by its new short name. Refused as
   * adding a team is, and as the team refuses an update. An update that
   * changes nothing records nothing.
   */
  updateTeam(
    id: TeamId,
    details: TeamDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#teamFound(id);
    const team = found.update(details);
    this.#refuseATeamNameTaken(team);
    if (
      team.name.equals(found.name) &&
      team.shortName.equals(found.shortName) &&
      String(team.flag) === String(found.flag)
    ) {
      return;
    }
    this.record(
      new TeamUpdated(
        id.value,
        team.name.toString(),
        team.shortName.toString(),
        team.flag === undefined ? undefined : String(team.flag),
        by,
        at,
      ),
    );
  }

  /**
   * That the team `id` is set aside, with its players. A team in a test in
   * use is refused, as the team says: the tournament knows its tests, so it
   * asks itself. It is put last, as an archived player is. Archiving one that
   * is archived records nothing.
   */
  archiveTeam(id: TeamId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#teamFound(id);
    const inATest = [...this.#competitions.values()].some(
      ({ reference, shape }) =>
        !reference.archived &&
        shape.kind === "test" &&
        (shape.firstTeam.equals(id) || shape.secondTeam.equals(id)),
    );
    if (found.archive({ inATest }) === found) return;
    this.record(new TeamArchived(id.value, this.#nextTeamOrder, by, at));
  }

  /** That the archived team `id` is restored. One that is not records nothing. */
  restoreTeam(id: TeamId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#teamFound(id);
    if (found.restore() === found) return;
    this.record(new TeamRestored(id.value, by, at));
  }

  /**
   * That the team `id` is moved a place among those not archived, as a player
   * is (`movePlayer`), with every team spaced out again first where there is
   * no room. Moving the first up or the last down records nothing.
   */
  moveTeam(
    id: TeamId,
    direction: "up" | "down",
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    this.#teamFound(id).ensureMovable();
    const order = this.#movedAmong(
      () => this.#teamsByOrder,
      id,
      direction,
      () => {
        this.record(
          new TeamsSpacedOut(
            this.#teamsByOrder.map((team) => team.id.value),
            by,
            at,
          ),
        );
      },
    );
    if (order === undefined) return;
    this.record(new TeamMoved(id.value, order, by, at));
  }

  /**
   * That a player was added to the team `teamId`, as `details` say, given
   * 10,000 more than the highest order in the team. Refused when the team is
   * archived, when a player in any team has the id, and when another player
   * in the team has the name, however it is capitalised, archived or not.
   */
  addTeamPlayer(
    teamId: TeamId,
    id: TeamPlayerId,
    details: TeamPlayerDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const team = this.#teamFound(teamId);
    team.ensureInUse();
    details = this.#withTheirNameKnownInTheRankings(details);
    // Asked what a player is first, so that a name that is no name is refused
    // as one rather than as a slug that cannot be made of it.
    TeamPlayer.ensureValid(details);
    // Found by a slug of their name no other player in any team has, archived
    // or not, since every team's players are found at the one address.
    const slug = firstFree(
      Slug.fromName(details.name),
      id,
      [...this.#teams.values()].flatMap((each) =>
        each.players.map((other) => other.slug.toString()),
      ),
    );
    const player = TeamPlayer.from(id, details, {
      slug,
      order: nextOrderIn(team.players),
    });
    // Unique in every team, since a game in a test is between two teams and
    // names its players by their ids alone.
    if (
      [...this.#teams.values()].some(
        (each) => each.playerWritten(id.value) !== undefined,
      )
    ) {
      refuse(
        "Tournament.TeamPlayerAlreadyAdded",
        "A player in a team already has the id.",
      );
    }
    refuseATeamPlayerNameTaken(team, player);
    this.record(
      new TeamPlayerAdded(
        teamId.value,
        id.value,
        player.name.toString(),
        player.worldRankingName?.toString(),
        player.slug.toString(),
        player.order,
        by,
        at,
      ),
    );
  }

  /**
   * That the player `id` of the team `teamId` now has the name `details` say.
   * Refused as adding a player to the team is, and as the player refuses an
   * update. An update that changes nothing records nothing.
   */
  updateTeamPlayer(
    teamId: TeamId,
    id: TeamPlayerId,
    details: TeamPlayerDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const { team, player: found } = this.#teamPlayerToChange(teamId, id, by);
    const player = found.update(this.#withTheirNameKnownInTheRankings(details));
    refuseATeamPlayerNameTaken(team, player);
    if (
      player.name.equals(found.name) &&
      sameWorldRankingName(player.worldRankingName, found.worldRankingName)
    )
      return;
    this.record(
      new TeamPlayerUpdated(
        teamId.value,
        id.value,
        player.name.toString(),
        player.worldRankingName?.toString(),
        by,
        at,
      ),
    );
  }

  /**
   * That the player `id` of the team `teamId` is set aside. Whether they have
   * played any games is not the tournament's to know, so whatever asks says,
   * and the player refuses if they have. They are put last in their team.
   * Archiving one who is archived records nothing.
   */
  archiveTeamPlayer(
    teamId: TeamId,
    id: TeamPlayerId,
    hasPlayedGames: boolean,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const { team, player } = this.#teamPlayerToChange(teamId, id, by);
    if (player.archive({ hasGames: hasPlayedGames }) === player) return;
    this.record(
      new TeamPlayerArchived(
        teamId.value,
        id.value,
        nextOrderIn(team.players),
        by,
        at,
      ),
    );
  }

  /**
   * That the archived player `id` of the team `teamId` is restored. One who
   * is not records nothing.
   */
  restoreTeamPlayer(
    teamId: TeamId,
    id: TeamPlayerId,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const { player } = this.#teamPlayerToChange(teamId, id, by);
    if (player.restore() === player) return;
    this.record(new TeamPlayerRestored(teamId.value, id.value, by, at));
  }

  /**
   * That the player `id` of the team `teamId` is moved a place among the
   * team's players not archived, as a tournament's player is (`movePlayer`).
   * Another team's players are no part of it.
   */
  moveTeamPlayer(
    teamId: TeamId,
    id: TeamPlayerId,
    direction: "up" | "down",
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const { player } = this.#teamPlayerToChange(teamId, id, by);
    player.ensureInUse();
    const byOrder = (): TeamPlayer[] => this.#teamFound(teamId).playersByOrder;
    const order = this.#movedAmong(byOrder, id, direction, () => {
      this.record(
        new TeamPlayersSpacedOut(
          teamId.value,
          byOrder().map((each) => each.id.value),
          by,
          at,
        ),
      );
    });
    if (order === undefined) return;
    this.record(new TeamPlayerMoved(teamId.value, id.value, order, by, at));
  }

  /**
   * That a test was added, as `details` say: called by its teams' short
   * names, the first team's first, found at a slug of that name no other
   * competition has, and given an order as every competition is. Refused
   * unless the tournament is played by teams, the teams are two different
   * teams of its own in use, and the test is played within the tournament's
   * days, starting no later than it finishes.
   */
  addTest(
    id: CompetitionId,
    details: TestDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    this.#refuseUnlessPlayedByTeams();
    if (this.#competitions.has(id.value)) {
      refuse(
        "Tournament.CompetitionAlreadyAdded",
        "The competition is already added.",
      );
    }
    this.#refuseUnlessATestCanBe(details);
    this.record(
      new TestAdded(
        id.value,
        details.firstTeam.value,
        details.secondTeam.value,
        this.#competitionSlugFor(id, this.#testNameFor(details)),
        this.#nextOrder,
        dayOf(details.starts),
        dayOf(details.finishes),
        details.expectedMatches.count,
        details.bestOf.games,
        details.group?.toString(),
        by,
        at,
      ),
    );
  }

  /**
   * That the test `id` is now as `details` say, asked what a test added is
   * asked, keeping its slug and its order. What has been played in it is not
   * the tournament's to know, so whatever asks says, and once it has games in
   * use its teams are fixed, its expected matches are no fewer than the
   * matches started, and its best-of no fewer than the most games any two
   * players have played. An update that changes nothing records nothing.
   */
  updateTest(
    id: CompetitionId,
    details: TestDetails,
    played: TestPlayed,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#competitionFound(id);
    const { shape } = found;
    if (shape.kind !== "test") {
      return refuse("Tournament.NotATest", "The competition is not a test.");
    }
    if (found.reference.archived) {
      refuse("Tournament.CompetitionArchived", "The competition is archived.");
    }
    // A day left as it was is not asked again: the tournament's days changed
    // since leave its tests as they were (update.feature).
    this.#refuseUnlessATestCanBe(details, {
      starts: dayOf(shape.starts),
      finishes: dayOf(shape.finishes),
    });
    const sameTeams =
      details.firstTeam.equals(shape.firstTeam) &&
      details.secondTeam.equals(shape.secondTeam);
    if (!sameTeams && played.matchesStarted > 0) {
      refuse(
        "Tournament.TestHasGames",
        "The test has games between its teams' players.",
      );
    }
    if (details.expectedMatches.count < played.matchesStarted) {
      refuse(
        "Tournament.ExpectedMatchesBelowStarted",
        "More matches have started than the test would be expected to have.",
      );
    }
    if (details.bestOf.games < played.mostGamesBetweenTwo) {
      refuse(
        "Tournament.BestOfBelowGamesPlayed",
        "Two players have played more games than a match would be the best of.",
      );
    }
    if (
      sameTeams &&
      dayOf(details.starts) === dayOf(shape.starts) &&
      dayOf(details.finishes) === dayOf(shape.finishes) &&
      details.expectedMatches.equals(shape.expectedMatches) &&
      details.bestOf.equals(shape.bestOf) &&
      String(details.group) === String(shape.group)
    ) {
      return;
    }
    this.record(
      new TestUpdated(
        id.value,
        details.firstTeam.value,
        details.secondTeam.value,
        dayOf(details.starts),
        dayOf(details.finishes),
        details.expectedMatches.count,
        details.bestOf.games,
        details.group?.toString(),
        by,
        at,
      ),
    );
  }

  /**
   * Refused unless `by` may write its notes: add one, edit one or delete one
   * (writeManagerNotes.feature). Only its managers may, and not once it is
   * archived. It records nothing, since a note is kept in a stream of its own
   * (ManagerNote.ts), so that a long one is not read on every page of the
   * tournament; whatever writes a note asks this first.
   */
  allowWritingManagerNotes(by: AccountId): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
  }

  /**
   * Refused unless commentary may be written on it: a commentary started, its
   * title changed, or a comment added, edited or deleted
   * (writeCommentary.feature). Any account may, since commentary is anybody's
   * to write and not a change only a manager may make (onlyManagers.feature),
   * but not once it is archived. It records nothing, since a commentary is
   * kept in a stream of its own (Commentary.ts); whatever writes commentary
   * asks this first.
   */
  allowWritingCommentary(): void {
    this.#refuseOnceArchived();
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof TournamentCreated) {
      this.#becomes(Website.from(event.website), event);
      // Whoever created it is its first manager, and says so by having caused
      // its creation.
      this.#managers.add(event.createdBy.value);
    } else if (event instanceof TournamentUpdated) {
      this.#becomes(this.#now.website, event);
    } else if (event instanceof TournamentArchived) {
      this.#archived = true;
    } else if (event instanceof TournamentRestored) {
      this.#archived = false;
    } else if (event instanceof TournamentPlayerAdded) {
      const id = TournamentPlayerId.from(event.playerId);
      this.#players.set(
        id.value,
        TournamentPlayer.from(id, event, {
          slug: Slug.from(event.slug),
          order: event.order,
        }),
      );
    } else if (event instanceof TournamentPlayerUpdated) {
      this.#playerBecomes(event.playerId, (player) => player.update(event));
    } else if (event instanceof TournamentPlayerArchived) {
      // Whether the player had games was asked when it was recorded, and a
      // player who had any was never archived.
      this.#playerBecomes(event.playerId, (player) =>
        player.archive({ hasGames: false }).withOrder(event.order),
      );
    } else if (event instanceof TournamentPlayerRestored) {
      this.#playerBecomes(event.playerId, (player) => player.restore());
    } else if (event instanceof TournamentPlayerMoved) {
      this.#playerBecomes(event.playerId, (player) =>
        player.withOrder(event.order),
      );
    } else if (event instanceof TournamentPlayersSpacedOut) {
      event.playerIds.forEach((written, index) => {
        this.#playerBecomes(written, (player) =>
          player.withOrder((index + 1) * ORDER_STEP),
        );
      });
    } else if (event instanceof BlockAdded) {
      this.#competitionAdded(event, {
        kind: "block",
        bestOf: BestOf.from(event.bestOf),
        rounds: Rounds.from(event.rounds),
      });
    } else if (event instanceof KnockoutAdded) {
      this.#competitionAdded(event, {
        kind: "knockout",
        draw: KnockoutDraw.from(event.places, event.rounds),
      });
    } else if (event instanceof SwissAdded) {
      this.#competitionAdded(event, {
        kind: "swiss",
        bestOf: BestOf.from(event.bestOf),
      });
    } else if (event instanceof BlockUpdated) {
      this.#competitionUpdated(event.competitionId, event.name, {
        kind: "block",
        bestOf: BestOf.from(event.bestOf),
        rounds: Rounds.from(event.rounds),
      });
    } else if (event instanceof KnockoutUpdated) {
      this.#competitionUpdated(event.competitionId, event.name, {
        kind: "knockout",
        draw: KnockoutDraw.from(event.places, event.rounds),
      });
    } else if (event instanceof SwissUpdated) {
      this.#competitionUpdated(event.competitionId, event.name, {
        kind: "swiss",
        bestOf: BestOf.from(event.bestOf),
      });
    } else if (event instanceof ManagerAdded) {
      this.#managers.add(event.account);
      this.#scorers.delete(event.account);
    } else if (event instanceof ManagerRemoved) {
      this.#managers.delete(event.account);
    } else if (event instanceof ScorerAdded) {
      this.#scorers.add(event.account);
    } else if (event instanceof ScorerRemoved) {
      this.#scorers.delete(event.account);
    } else if (event instanceof CompetitionArchived) {
      this.#competitionIs(event.competitionId, true);
      this.#competitionAt(event.competitionId, event.order);
    } else if (event instanceof CompetitionRestored) {
      this.#competitionIs(event.competitionId, false);
    } else if (event instanceof CompetitionMoved) {
      this.#competitionAt(event.competitionId, event.order);
    } else if (event instanceof CompetitionsSpacedOut) {
      event.competitionIds.forEach((written, index) => {
        this.#competitionAt(written, (index + 1) * ORDER_STEP);
      });
    } else {
      this.#applyToTeamsOrTests(event);
    }
  }

  // The events of a tournament played by teams, kept apart from the rest only
  // so that neither list of them is too long to read.
  #applyToTeamsOrTests(event: DomainEvent): void {
    if (event instanceof TeamAdded) {
      const id = TeamId.from(event.teamId);
      this.#teams.set(
        id.value,
        Team.from(id, event, {
          slug: Slug.from(event.slug),
          order: event.order,
        }),
      );
    } else if (event instanceof TeamUpdated) {
      this.#teamBecomes(event.teamId, (team) => team.update(event));
      this.#renameTestsOf(event.teamId);
    } else if (event instanceof TeamArchived) {
      // Whether the team was in a test was asked when it was recorded.
      this.#teamBecomes(event.teamId, (team) =>
        team.archive({ inATest: false }).withOrder(event.order),
      );
    } else if (event instanceof TeamRestored) {
      this.#teamBecomes(event.teamId, (team) => team.restore());
    } else if (event instanceof TeamMoved) {
      this.#teamBecomes(event.teamId, (team) => team.withOrder(event.order));
    } else if (event instanceof TeamsSpacedOut) {
      event.teamIds.forEach((written, index) => {
        this.#teamBecomes(written, (team) =>
          team.withOrder((index + 1) * ORDER_STEP),
        );
      });
    } else if (event instanceof TeamPlayerAdded) {
      this.#teamBecomes(event.teamId, (team) =>
        team.withPlayer(
          TeamPlayer.from(TeamPlayerId.from(event.playerId), event, {
            slug: Slug.from(event.slug),
            order: event.order,
          }),
        ),
      );
    } else if (event instanceof TeamPlayerUpdated) {
      this.#teamPlayerBecomes(event, (player) => player.update(event));
    } else if (event instanceof TeamPlayerArchived) {
      // Whether the player had games was asked when it was recorded.
      this.#teamPlayerBecomes(event, (player) =>
        player.archive({ hasGames: false }).withOrder(event.order),
      );
    } else if (event instanceof TeamPlayerRestored) {
      this.#teamPlayerBecomes(event, (player) => player.restore());
    } else if (event instanceof TeamPlayerMoved) {
      this.#teamPlayerBecomes(event, (player) => player.withOrder(event.order));
    } else if (event instanceof TeamPlayersSpacedOut) {
      event.playerIds.forEach((playerId, index) => {
        this.#teamPlayerBecomes({ teamId: event.teamId, playerId }, (player) =>
          player.withOrder((index + 1) * ORDER_STEP),
        );
      });
    } else if (event instanceof TestAdded) {
      const id = CompetitionId.from(event.competitionId);
      const shape = testShapeOf(event);
      this.#competitions.set(id.value, {
        reference: CompetitionReference.from(id, {
          name: this.#testNameFor(shape),
          slug: event.slug,
          order: event.order,
        }),
        shape,
      });
    } else if (event instanceof TestUpdated) {
      const shape = testShapeOf(event);
      this.#competitionUpdated(
        event.competitionId,
        this.#testNameFor(shape),
        shape,
      );
    }
  }

  get #now(): Settled {
    // Every tournament's stream begins by creating it, so one without is a
    // stream that was never a tournament's, and a mistake in whoever rebuilt
    // it rather than something to answer.
    if (this.#settled === undefined) {
      throw new Error("The tournament's stream did not begin by creating it.");
    }
    return this.#settled;
  }

  // What `details` make of a tournament on `website`, asked for at `at`,
  // refused on the first thing asked of them together that they do not hold
  // to, and found where `addressIn` says for the year and the sport it is in.
  // One `broughtOver` from the old sites keeps the finish they gave it
  // (bringOver.feature).
  #settle(
    website: Website,
    details: TournamentDetails,
    at: ReadOnlyDate,
    addressIn: (year: number, sport: Sport) => TournamentAddress,
    { broughtOver = false }: { readonly broughtOver?: boolean } = {},
  ): Settled {
    const { sport, format, starts, finishes, country } = details;
    if (
      !SPORTS_OFFERED[website.site].some((offered) => offered.equals(sport))
    ) {
      refuse(
        "Tournament.SportNotOffered",
        "The site does not offer the sport.",
      );
    }
    if (
      !FORMATS_OFFERED[website.site].some((offered) => offered.equals(format))
    ) {
      refuse(
        "Tournament.FormatNotOffered",
        "The site does not offer the format.",
      );
    }
    if (finishes.toDate().getTime() < starts.toDate().getTime()) {
      refuse(
        "Tournament.FinishesBeforeStarts",
        "The tournament finishes before it starts.",
      );
    }
    // Counted in UTC, as the year of the tournament's address is, so that the
    // year a tournament may be found at is the year it may start in.
    const yearAfterNext = Date.UTC(at.toDate().getUTCFullYear() + 2, 0, 1);
    const afterNextYear = (day: ReadOnlyDate): boolean =>
      day.toDate().getTime() >= yearAfterNext;
    if (afterNextYear(starts)) {
      refuse(
        "Tournament.StartsAfterNextYear",
        "The tournament starts after next year.",
      );
    }
    // Asked after its start, so that one wholly too far ahead is refused for
    // its start, where the year was most likely typed wrongly.
    if (!broughtOver && afterNextYear(finishes)) {
      refuse(
        "Tournament.FinishesAfterNextYear",
        "The tournament finishes after next year.",
      );
    }
    const region =
      details.region === undefined
        ? undefined
        : (country.findRegion(details.region) ??
          refuse(
            "Tournament.RegionNotInCountry",
            "The region is not one of the country's.",
          ));
    const handicap = details.handicap ?? false;
    const drawsAllowed = details.drawsAllowed ?? false;
    const worldRankings = this.#worldRankingsFor(
      sport,
      handicap,
      drawsAllowed,
      details.worldRankings,
    );
    const national = details.national ?? false;
    const international = details.international ?? false;
    if (national && international) {
      refuse(
        "Tournament.NationalAndInternational",
        "A tournament is not both national and international.",
      );
    }
    const levelTestsDrawn = levelTestsDrawnFor(format, details.levelTestsDrawn);
    return {
      website,
      name: details.name,
      starts,
      finishes,
      format,
      sport,
      country,
      region,
      subtitle: details.subtitle,
      handicap,
      drawsAllowed,
      levelTestsDrawn,
      worldRankings,
      national,
      international,
      address: addressIn(TournamentAddress.yearOf(starts), sport),
    };
  }

  // Only a tournament in a sport with world rankings, not under handicap and
  // not allowing drawn games, counts towards them, and does unless it is said not to. Saying one counts
  // when it cannot is refused rather than quietly undone, since whoever said so
  // meant something the tournament cannot be.
  #worldRankingsFor(
    sport: Sport,
    handicap: boolean,
    drawsAllowed: boolean,
    said: boolean | undefined,
  ): boolean {
    const hasRankings = sport.countsTowardsWorldRankings;
    if (said === true && !hasRankings) {
      refuse("Tournament.NoWorldRankings", "The sport has no world rankings.");
    }
    if (said === true && handicap) {
      refuse(
        "Tournament.HandicapInWorldRankings",
        "A handicap tournament does not count towards the world rankings.",
      );
    }
    // Nor does a drawn one say who is better.
    if (said === true && drawsAllowed) {
      refuse(
        "Tournament.DrawsInWorldRankings",
        "A tournament allowing drawn games does not count towards the world rankings.",
      );
    }
    return said ?? (hasRankings && !handicap && !drawsAllowed);
  }

  // Where a tournament named `name`, starting at `starts` and played in `sport`
  // is found. A tournament keeps its address unless the year or the sport in
  // it changes. An address it has been found at before is its own to go back
  // to, and it is for whatever says what is taken not to count it as somebody
  // else's, since it is what knows which tournament an address leads to.
  #addressFor(
    name: TournamentName,
    year: number,
    sport: Sport,
    taken: AddressTaken,
  ): TournamentAddress {
    const current = this.#settled?.address;
    if (current?.year === year && current.sport.equals(sport)) return current;
    const slug = Slug.fromName(name.toString());
    for (const candidate of slugsFor(slug, this.id)) {
      const address = TournamentAddress.from(year, sport, candidate);
      if (!taken(address)) return address;
    }
    // The last slug has the tournament id's own characters, which nobody else
    // can have, so it is the tournament's whatever `taken` says of it.
    return TournamentAddress.from(year, sport, lastOf(slugsFor(slug, this.id)));
  }

  #becomes(website: Website, written: WrittenTournament): void {
    const country = Countries.thereAre.find(written.country);
    const region =
      written.region === undefined
        ? undefined
        : country?.findRegion(written.region);
    if (
      country === undefined ||
      (written.region !== undefined && region === undefined)
    ) {
      throw new Error(
        `The tournament's stream names a place there is not: ${written.country}/${String(written.region)}.`,
      );
    }
    const address = TournamentAddress.read(written.address);
    this.#settled = {
      website,
      name: TournamentName.from(written.name),
      starts: ReadOnlyDate.from(new Date(written.starts)),
      finishes: ReadOnlyDate.from(new Date(written.finishes)),
      format: TournamentFormat.from(written.format),
      sport: Sport.from(written.sport),
      country,
      region,
      subtitle:
        written.subtitle === undefined
          ? undefined
          : TournamentSubtitle.from(written.subtitle),
      handicap: written.handicap,
      drawsAllowed: written.drawsAllowed,
      levelTestsDrawn: written.levelTestsDrawn,
      worldRankings: written.worldRankings,
      national: written.national,
      international: written.international,
      address,
    };
    if (!this.#addresses.some((kept) => kept.equals(address))) {
      this.#addresses.push(address);
    }
  }

  // Asked before anything else, so that somebody who may not ask is told no
  // more than that, whatever they asked for.
  #refuseUnlessManager(by: AccountId): void {
    if (!this.mayManage(by)) {
      refuse(
        "Tournament.NotAManager",
        "Only a manager can change the tournament.",
      );
    }
  }

  // Asked before anything else, as a manager's part is.
  #refuseUnlessRankingNamesMayChange(by: AccountId): void {
    if (!this.mayChangeWorldRankingNames(by)) {
      refuse(
        "Tournament.NotAManagerOrRankingOfficer",
        "Only a manager or a world ranking officer can change a world ranking name.",
      );
    }
  }

  // A sport that is ranked, but whose players are known to the rankings by
  // their own names, has no world ranking name apart from the player's name
  // (Sport.feature, addPlayer.feature).
  #worldRankingNameIsTheName(): boolean {
    return (
      this.sport.countsTowardsWorldRankings && !this.sport.hasWorldRankings
    );
  }

  // Whatever a player is added with or updated to, their world ranking name is
  // their name, so one given is not kept and a corrected name corrects it.
  #withTheirNameKnownInTheRankings<
    T extends {
      readonly name: string;
      readonly worldRankingName?: string | undefined;
    },
  >(details: T): T {
    return this.#worldRankingNameIsTheName()
      ? { ...details, worldRankingName: details.name }
      : details;
  }

  #refuseWhereTheNameIsTheWorldRankingName(): void {
    if (this.#worldRankingNameIsTheName()) {
      refuse(
        "Tournament.WorldRankingNameIsTheName",
        "A player's world ranking name there is their name, and is not changed.",
      );
    }
  }

  #refuseOnceArchived(): void {
    if (this.#archived) {
      refuse("Tournament.Archived", "The tournament is archived.");
    }
  }

  #playerFound(id: TournamentPlayerId): TournamentPlayer {
    return (
      this.#players.get(id.value) ??
      refuse("Tournament.NoSuchPlayer", "The tournament has no such player.")
    );
  }

  // Another player's name, archived or not, however it is capitalised. An
  // archived player keeps theirs, since the two could not be told apart if they
  // were restored.
  #refuseAPlayerNameTaken(player: TournamentPlayer): void {
    const name = player.name.toString();
    for (const other of this.#players.values()) {
      if (!other.equals(player) && sameName(other.name.toString(), name)) {
        refuse("Tournament.PlayerNameTaken", "Another player has the name.");
      }
    }
  }

  #playerBecomes(
    written: string,
    becoming: (player: TournamentPlayer) => TournamentPlayer,
  ): void {
    const found = this.#players.get(written);
    if (found !== undefined) this.#players.set(written, becoming(found));
  }

  // The slug and the order a new competition called `name` is given, once it
  // is known that it may be added: the tournament is not archived, and no
  // other competition has its id or its name.
  #placeFor(
    id: CompetitionId,
    name: CompetitionName,
  ): { slug: string; order: number } {
    this.#refuseOnceArchived();
    this.#refuseOncePlayedByTeams();
    if (this.#competitions.has(id.value)) {
      refuse(
        "Tournament.CompetitionAlreadyAdded",
        "The competition is already added.",
      );
    }
    this.#refuseACompetitionNameTaken(id, name);
    return {
      slug: this.#competitionSlugFor(id, name.toString()),
      order: this.#nextOrder,
    };
  }

  // The first slug a competition `named` may be found at that no other
  // competition has, archived or not.
  #competitionSlugFor(id: CompetitionId, named: string): string {
    return firstFree(
      Slug.fromName(named),
      id,
      [...this.#competitions.values()].map(({ reference }) =>
        reference.slug.toString(),
      ),
    ).toString();
  }

  // Every player lowest order first, archived or not: the order that room to
  // move into and spacing out are reckoned in, since an archived player's
  // order still counts, wherever they are listed.
  get #playersByOrder(): TournamentPlayer[] {
    return [...this.#players.values()].sort(
      (one, other) => one.order - other.order,
    );
  }

  // Every competition lowest order first, archived or not, as the players are
  // (`#playersByOrder`).
  get #competitionsByOrder(): CompetitionInTournament[] {
    return [...this.#competitions.values()].sort(
      (one, other) => one.reference.order - other.reference.order,
    );
  }

  // 10,000 more than the highest order there is, for a player put last: one
  // added, or one archived. Archived players still count, so that no order is
  // ever given twice.
  get #nextPlayerOrder(): number {
    return (
      Math.max(0, ...[...this.#players.values()].map(({ order }) => order)) +
      ORDER_STEP
    );
  }

  // 10,000 more than the highest order there is, for a competition put last:
  // one added, or one archived. Archived competitions still count, so that no
  // order is ever given twice.
  get #nextOrder(): number {
    return (
      Math.max(
        0,
        ...[...this.#competitions.values()].map(
          ({ reference }) => reference.order,
        ),
      ) + ORDER_STEP
    );
  }

  #refuseACompetitionNameTaken(id: CompetitionId, name: CompetitionName): void {
    for (const { reference } of this.#competitions.values()) {
      if (
        !reference.id.equals(id) &&
        sameName(reference.name.toString(), name.toString())
      ) {
        refuse(
          "Tournament.CompetitionNameTaken",
          "Another competition has the name.",
        );
      }
    }
  }

  #competitionFound(id: CompetitionId): CompetitionInTournament {
    return (
      this.#competitions.get(id.value) ??
      refuse(
        "Tournament.NoSuchCompetition",
        "The tournament has no such competition.",
      )
    );
  }

  // The competition `id`, once it is known that it may be updated as a `kind`
  // and called `name`.
  #competitionToUpdate(
    id: CompetitionId,
    kind: CompetitionShape["kind"],
    name: CompetitionName,
  ): CompetitionInTournament {
    this.#refuseOnceArchived();
    const found = this.#competitionFound(id);
    if (found.shape.kind !== kind) {
      refuse(NOT_A[kind], `The competition is not a ${kind}.`);
    }
    if (found.reference.archived) {
      refuse("Tournament.CompetitionArchived", "The competition is archived.");
    }
    this.#refuseACompetitionNameTaken(id, name);
    return found;
  }

  #competitionAdded(
    event: {
      readonly competitionId: string;
      readonly name: string;
      readonly slug: string;
      readonly order: number;
    },
    shape: CompetitionShape,
  ): void {
    const id = CompetitionId.from(event.competitionId);
    this.#competitions.set(id.value, {
      reference: CompetitionReference.from(id, event),
      shape,
    });
  }

  #competitionUpdated(
    written: string,
    name: string,
    shape: CompetitionShape,
  ): void {
    const found = this.#competitions.get(written);
    if (found === undefined) return;
    this.#competitions.set(written, {
      reference: referenceWith(found.reference, { name }),
      shape,
    });
  }

  // The order a competition moved past `passed` is given (`orderPast`).
  #orderPast(
    passed: CompetitionId,
    direction: "up" | "down",
  ): number | undefined {
    const all = this.#competitionsByOrder;
    return orderPast(
      all.map(({ reference }) => reference.order),
      all.findIndex(({ reference }) => reference.id.equals(passed)),
      direction,
    );
  }

  #competitionAt(written: string, order: number): void {
    const found = this.#competitions.get(written);
    if (found === undefined) return;
    this.#competitions.set(written, {
      ...found,
      reference: referenceWith(found.reference, { order }),
    });
  }

  #competitionIs(written: string, archived: boolean): void {
    const found = this.#competitions.get(written);
    if (found === undefined) return;
    this.#competitions.set(written, {
      ...found,
      reference: referenceWith(found.reference, { archived }),
    });
  }

  // Teams and tests ------------------------------------------------------------

  // A Standard tournament is played between its own players, so it has
  // neither teams nor tests.
  #refuseUnlessPlayedByTeams(): void {
    if (!this.#now.format.isTeamFormat) {
      refuse(
        "Tournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }
  }

  // A tournament played by teams is played between its teams' players, so it
  // has neither players of its own nor blocks, knockouts or Swiss.
  #refuseOncePlayedByTeams(): void {
    if (this.#now.format.isTeamFormat) {
      refuse("Tournament.PlayedByTeams", "The tournament is played by teams.");
    }
  }

  // Whether it holds anything whose having depends on its format, archived
  // or not.
  get #holdsAnything(): boolean {
    return (
      this.#players.size > 0 ||
      this.#competitions.size > 0 ||
      this.#teams.size > 0
    );
  }

  #teamFound(id: TeamId): Team {
    return (
      this.#teams.get(id.value) ??
      refuse("Tournament.NoSuchTeam", "The tournament has no such team.")
    );
  }

  // The team `teamId` and its player `id`, once it is known that the player
  // may be changed: asked by a manager, of a tournament and a team not
  // archived, and a player the team has.
  #teamPlayerToChange(
    teamId: TeamId,
    id: TeamPlayerId,
    by: AccountId,
  ): { readonly team: Team; readonly player: TeamPlayer } {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    return this.#teamPlayerFound(teamId, id);
  }

  #teamPlayerFound(
    teamId: TeamId,
    id: TeamPlayerId,
  ): { readonly team: Team; readonly player: TeamPlayer } {
    const team = this.#teamFound(teamId);
    team.ensureInUse();
    const player =
      team.playerWritten(id.value) ??
      refuse("Team.NoSuchPlayer", "The team has no such player.");
    return { team, player };
  }

  // Another team's name or short name, archived or not, however it is
  // capitalised: two teams called alike could not be told apart, nor two tests
  // called by the same short names.
  #refuseATeamNameTaken(team: Team): void {
    for (const other of this.#teams.values()) {
      if (other.equals(team)) continue;
      if (sameName(other.name.toString(), team.name.toString())) {
        refuse("Tournament.TeamNameTaken", "Another team has the name.");
      }
      if (sameName(other.shortName.toString(), team.shortName.toString())) {
        refuse(
          "Tournament.TeamShortNameTaken",
          "Another team has the short name.",
        );
      }
    }
  }

  // Every team lowest order first, archived or not, as the players are
  // (`#playersByOrder`).
  get #teamsByOrder(): Team[] {
    return [...this.#teams.values()].sort(
      (one, other) => one.order - other.order,
    );
  }

  get #nextTeamOrder(): number {
    return nextOrderIn([...this.#teams.values()]);
  }

  // The order the thing `id` is given, moved a place among `byOrder()` not
  // archived, as a player is (`movePlayer`), `spacingOut` first where there is
  // no room. Nothing, where there is nowhere for it to go.
  #movedAmong(
    byOrder: () => readonly Ordered[],
    id: Id,
    direction: "up" | "down",
    spacingOut: () => void,
  ): number | undefined {
    const inUse = byOrder().filter(({ archived }) => !archived);
    const place = inUse.findIndex((each) => each.id.equals(id));
    const passed = inUse[direction === "up" ? place - 1 : place + 1];
    if (passed === undefined) return undefined;
    const orderPastPassed = (): number | undefined => {
      const all = byOrder();
      return orderPast(
        all.map(({ order }) => order),
        all.findIndex((each) => each.id.equals(passed.id)),
        direction,
      );
    };
    let order = orderPastPassed();
    if (order === undefined) {
      spacingOut();
      order = orderPastPassed();
    }
    if (order === undefined) {
      throw new Error("Spaced out, there was still no room to move into.");
    }
    return order;
  }

  #teamBecomes(written: string, becoming: (team: Team) => Team): void {
    const found = this.#teams.get(written);
    if (found !== undefined) this.#teams.set(written, becoming(found));
  }

  #teamPlayerBecomes(
    named: { readonly teamId: string; readonly playerId: string },
    becoming: (player: TeamPlayer) => TeamPlayer,
  ): void {
    this.#teamBecomes(named.teamId, (team) => {
      const found = team.playerWritten(named.playerId);
      return found === undefined ? team : team.withPlayer(becoming(found));
    });
  }

  // What is asked of a test, added or updated, of the tournament as it is:
  // two different teams of its own in use, played within its days, starting
  // no later than it finishes. Days are compared as the days the tournament's
  // starts and finishes fall on in UTC, as the year of its address is. A day
  // an updated test `had` already is not asked whether it is within the
  // tournament's, since a test is not refused for what the tournament became
  // after it was added.
  #refuseUnlessATestCanBe(
    details: TestDetails,
    had?: { readonly starts: string; readonly finishes: string },
  ): void {
    if (details.firstTeam.equals(details.secondTeam)) {
      refuse("Tournament.TestAgainstItself", "A team does not play itself.");
    }
    const first = this.#teamFound(details.firstTeam);
    const second = this.#teamFound(details.secondTeam);
    first.ensureInUse();
    second.ensureInUse();
    const starts = dayOf(details.starts);
    const finishes = dayOf(details.finishes);
    if (finishes < starts) {
      refuse(
        "Tournament.TestFinishesBeforeStarts",
        "The test finishes before it starts.",
      );
    }
    if (starts !== had?.starts && starts < dayOf(this.starts)) {
      refuse(
        "Tournament.TestStartsBeforeTournament",
        "The test starts before the tournament does.",
      );
    }
    if (finishes !== had?.finishes && finishes > dayOf(this.finishes)) {
      refuse(
        "Tournament.TestFinishesAfterTournament",
        "The test finishes after the tournament does.",
      );
    }
  }

  // What a test between two of the tournament's teams is called: their short
  // names as they are now, the first team's first.
  #testNameFor(teams: {
    readonly firstTeam: TeamId;
    readonly secondTeam: TeamId;
  }): string {
    const first = this.#teamFound(teams.firstTeam);
    const second = this.#teamFound(teams.secondTeam);
    return `${first.shortName.toString()} v ${second.shortName.toString()}`;
  }

  // A team called by another short name gives every test it is in another
  // name with it. The tests keep their slugs, as a competition renamed does.
  #renameTestsOf(written: string): void {
    for (const { reference, shape } of this.#competitions.values()) {
      if (
        shape.kind === "test" &&
        (shape.firstTeam.value === written ||
          shape.secondTeam.value === written)
      ) {
        this.#competitions.set(reference.id.value, {
          reference: referenceWith(reference, {
            name: this.#testNameFor(shape),
          }),
          shape,
        });
      }
    }
  }
}

const NOT_A: Readonly<Record<CompetitionShape["kind"], TournamentErrorCode>> = {
  block: "Tournament.NotABlock",
  knockout: "Tournament.NotAKnockout",
  swiss: "Tournament.NotASwiss",
  test: "Tournament.NotATest",
};

// What can be moved a place among others like it: a team, or a player in a
// team.
interface Ordered {
  readonly id: Id;
  readonly order: number;
  readonly archived: boolean;
}

// 10,000 more than the highest order among `ordered`, archived or not, for
// something put last: one added, or one archived.
const nextOrderIn = (ordered: readonly { readonly order: number }[]): number =>
  Math.max(0, ...ordered.map(({ order }) => order)) + ORDER_STEP;

// Another player in `team` with the player's name, archived or not, however
// it is capitalised. A player in another team may have it, since a player is
// always chosen from their team.
const refuseATeamPlayerNameTaken = (team: Team, player: TeamPlayer): void => {
  const name = player.name.toString();
  for (const other of team.players) {
    if (!other.equals(player) && sameName(other.name.toString(), name)) {
      refuse(
        "Team.PlayerNameTaken",
        "Another player in the team has the name.",
      );
    }
  }
};

// The day a moment falls on in UTC, written as "2026-10-03", which compares
// as the days do.
const dayOf = (moment: ReadOnlyDate): string =>
  moment.toISOString().slice(0, 10);

// The start of the day `written` in UTC.
const dayWritten = (written: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(`${written}T00:00:00Z`));

// A test as an event that added or updated it says it is.
const testShapeOf = (
  said: TestAdded | TestUpdated,
): Extract<CompetitionShape, { readonly kind: "test" }> => ({
  kind: "test",
  firstTeam: TeamId.from(said.firstTeamId),
  secondTeam: TeamId.from(said.secondTeamId),
  starts: dayWritten(said.starts),
  finishes: dayWritten(said.finishes),
  expectedMatches: ExpectedMatches.from(said.expectedMatches),
  bestOf: BestOf.from(said.bestOf),
  group: said.group === undefined ? undefined : TestGroup.from(said.group),
});

// `inOrder` with the archived moved after all the others, each keeping its
// place among its own. Sorting on whether it is archived rather than giving it
// an order past everybody else's means a player or competition added after it
// needs no room made for it.
const archivedLast = <T>(
  inOrder: readonly T[],
  isArchived: (each: T) => boolean,
): T[] => [
  ...inOrder.filter((each) => !isArchived(each)),
  ...inOrder.filter(isArchived),
];

// A reference is never altered, so a changed one is made again from the old
// one and what changed.
const referenceWith = (
  reference: CompetitionReference,
  changed: {
    readonly name?: string;
    readonly archived?: boolean;
    readonly order?: number;
  },
): CompetitionReference =>
  CompetitionReference.from(reference.id, {
    name: changed.name ?? reference.name.toString(),
    slug: reference.slug.toString(),
    order: changed.order ?? reference.order,
    archived: changed.archived ?? reference.archived,
  });

// Whether a tournament in `format` draws a test level on matches, as `said`
// or, unsaid, as the format has it (`TournamentFormat.drawsLevelTests`). Only
// a tournament played by teams has tests, so saying one that is not draws them
// is refused rather than quietly undone.
const levelTestsDrawnFor = (
  format: TournamentFormat,
  said: boolean | undefined,
): boolean => {
  if (said === true && !format.isTeamFormat) {
    refuse(
      "Tournament.DrawnTestsWithoutTeams",
      "Only a tournament played by teams has tests to draw.",
    );
  }
  return said ?? format.drawsLevelTests;
};

const writtenFrom = (settled: Settled): WrittenTournament => ({
  name: settled.name.toString(),
  starts: settled.starts.toISOString(),
  finishes: settled.finishes.toISOString(),
  format: settled.format.name,
  sport: settled.sport.code,
  country: settled.country.code,
  region: settled.region?.code,
  subtitle: settled.subtitle?.markdown,
  handicap: settled.handicap,
  drawsAllowed: settled.drawsAllowed,
  levelTestsDrawn: settled.levelTestsDrawn,
  worldRankings: settled.worldRankings,
  national: settled.national,
  international: settled.international,
  address: settled.address.toString(),
});

// Two writings of a tournament are the same when every field is, so that an
// update that changes nothing records nothing.
const sameWriting = (
  one: WrittenTournament,
  other: WrittenTournament,
): boolean =>
  (Object.keys(one) as (keyof WrittenTournament)[]).every(
    (field) => one[field] === other[field],
  );

// The order something moved past the one at `at` in `orders`, lowest first, is
// given: just before it when moving up, just after it when moving down,
// halfway into the room between it and whatever lies next to it, archived or
// not. Put first, half the order of the one it comes before; put last, 10,000
// more than the highest. Nothing, where there is no whole number left in the
// room.
const orderPast = (
  orders: readonly number[],
  at: number,
  direction: "up" | "down",
): number | undefined => {
  const [lower, upper] =
    direction === "up"
      ? [orders[at - 1] ?? 0, orders[at]]
      : [orders[at], orders[at + 1]];
  if (lower === undefined) return undefined;
  if (upper === undefined) return lower + ORDER_STEP;
  const halfway = Math.floor((lower + upper) / 2);
  return halfway > lower && halfway < upper ? halfway : undefined;
};

const samePlayer = (one: TournamentPlayer, other: TournamentPlayer): boolean =>
  one.name.equals(other.name) &&
  one.representing === other.representing &&
  String(one.flag) === String(other.flag) &&
  sameWorldRankingName(one.worldRankingName, other.worldRankingName);

// Compared as names rather than as text, since "undefined" is a name a player
// can be known by and also what String makes of none.
const sameWorldRankingName = (
  one: WorldRankingName | undefined,
  other: WorldRankingName | undefined,
): boolean => (one === undefined ? other === undefined : one.equals(other));

const playerEvent = <T extends DomainEvent>(
  Kind: new (
    playerId: string,
    name: string,
    representing: string | undefined,
    flag: string | undefined,
    worldRankingName: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) => T,
  player: TournamentPlayer,
  by: AccountId,
  at: ReadOnlyDate,
): T =>
  new Kind(
    player.id.value,
    player.name.toString(),
    player.representing,
    player.flag === undefined ? undefined : String(player.flag),
    player.worldRankingName?.toString(),
    by,
    at,
  );
