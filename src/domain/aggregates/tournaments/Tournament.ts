import { AggregateRoot } from "../../common/AggregateRoot.js";
import type { DomainEvent } from "../../common/DomainEvent.js";
import type { Id } from "../../common/Id.js";
import { ReadOnlyDate } from "../../common/ReadOnlyDate.js";
import { Refused } from "../../common/Refused.js";
import { Slug } from "../../common/Slug.js";
import { Website } from "../../common/Website.js";
import { AccountId } from "../accounts/AccountId.js";
import { CompetitionReference } from "./CompetitionReference.js";
import { BlockAdded } from "./events/BlockAdded.js";
import { BlockUpdated } from "./events/BlockUpdated.js";
import { CompetitionArchived } from "./events/CompetitionArchived.js";
import { CompetitionRestored } from "./events/CompetitionRestored.js";
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
import { TournamentPlayerRestored } from "./events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "./events/TournamentPlayerUpdated.js";
import { TournamentRestored } from "./events/TournamentRestored.js";
import { TournamentUpdated } from "./events/TournamentUpdated.js";
import { CompetitionId } from "./primitives/CompetitionId.js";
import type { TournamentId } from "./primitives/TournamentId.js";
import { TournamentPlayerId } from "./primitives/TournamentPlayerId.js";
import {
  TournamentPlayer,
  type TournamentPlayerDetails,
} from "./TournamentPlayer.js";
import { BestOf } from "./value-objects/BestOf.js";
import { CompetitionName } from "./value-objects/CompetitionName.js";
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
import { TournamentNotes } from "./value-objects/TournamentNotes.js";

/** Why a tournament will not do what it was asked. */
export type TournamentErrorCode =
  | "Tournament.Archived"
  | "Tournament.SportNotOffered"
  | "Tournament.FormatNotOffered"
  | "Tournament.FinishesBeforeStarts"
  | "Tournament.RegionNotInCountry"
  | "Tournament.NoWorldRankings"
  | "Tournament.HandicapInWorldRankings"
  | "Tournament.NationalAndInternational"
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
  | "Tournament.LastManager"
  | "Tournament.AlreadyAManager";

/**
 * A tournament's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class TournamentRefused extends Refused<TournamentErrorCode> {}

/**
 * What creating a tournament says, and updating it says again. Its region is
 * given by its code and found among its country's, so that a region of
 * another country is the tournament's to refuse. Handicap, world rankings,
 * national and international may each be left unsaid, and what a tournament
 * is when they are is its own to decide.
 */
export interface TournamentDetails {
  readonly name: TournamentName;
  readonly starts: ReadOnlyDate;
  readonly finishes: ReadOnlyDate;
  readonly format: TournamentFormat;
  readonly sport: Sport;
  readonly country: Country;
  readonly region: string;
  readonly notes?: TournamentNotes | undefined;
  readonly handicap?: boolean | undefined;
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

/** What each kind of competition is besides what every competition is. */
export type CompetitionShape =
  | { readonly kind: "block"; readonly bestOf: BestOf }
  | { readonly kind: "knockout"; readonly draw: KnockoutDraw }
  | { readonly kind: "swiss"; readonly bestOf: BestOf };

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
  readonly region: Region;
  readonly notes: TournamentNotes | undefined;
  readonly handicap: boolean;
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

// The world rankings are kept for these alone.
const SPORTS_WITH_WORLD_RANKINGS: readonly Sport[] = [
  Sport.associationCroquet,
  Sport.golfCroquet,
];

// How far apart competitions are put when each is added, so that one can later
// be put between two others without either of them moving.
const ORDER_STEP = 10_000;

// A slug somebody else has is followed by a number from 1 to this, each
// written in two digits.
const MOST_NUMBERED = 99;

// A name is the same name however it is capitalised, as a reader takes it.
const sameName = (one: string, other: string): boolean =>
  one.toLowerCase() === other.toLowerCase();

// The characters of an id after its kind, which no other id has, for the slug
// that nothing else can be found at.
const ownCharactersOf = (id: Id): string =>
  id.value.slice(id.value.indexOf("/") + 1);

// Every slug a thing named `slug` may be found at, in the order they are
// tried: the slug itself, then followed by "-01" to "-99", then by the id's own
// characters, which is never taken, since nothing else has them.
function* slugsFor(slug: Slug, id: Id): Generator<Slug> {
  yield slug;
  for (let number = 1; number <= MOST_NUMBERED; number += 1) {
    yield Slug.from(`${slug.toString()}-${String(number).padStart(2, "0")}`);
  }
  yield Slug.from(`${slug.toString()}-${ownCharactersOf(id)}`);
}

// The last slug a thing may be found at, which slugsFor always ends with.
const lastOf = (slugs: Generator<Slug>): Slug => {
  let last: Slug | undefined;
  for (const slug of slugs) last = slug;
  if (last === undefined) throw new Error("There was no slug to be found at.");
  return last;
};

const refuse = (code: TournamentErrorCode, message: string): never => {
  throw new TournamentRefused(code, message);
};

/**
 * A tournament: created on a website, and holding its players and a reference
 * to each of its competitions. Everything it is, it says was caused by whoever
 * asked for it, since organising a tournament is many people's work.
 *
 * It is run by its managers. Whoever creates it is the first, and only a
 * manager can do anything to it afterwards, so every method is told who asks
 * and asks that before anything else. Its scorers enter scores, which nothing
 * records yet, and can do nothing else.
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
  // By the written id, in the order they were added, which is the order they
  // are listed in.
  readonly #players = new Map<string, TournamentPlayer>();
  readonly #competitions = new Map<string, CompetitionInTournament>();
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
    const settled = tournament.#settle(website, details, taken);
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

  get region(): Region {
    return this.#now.region;
  }

  get notes(): TournamentNotes | undefined {
    return this.#now.notes;
  }

  get handicap(): boolean {
    return this.#now.handicap;
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

  /** Its players, archived ones among them, in the order they were added. */
  get players(): readonly TournamentPlayer[] {
    return [...this.#players.values()];
  }

  /** Its competitions, archived ones among them, lowest order first. */
  get competitions(): readonly CompetitionInTournament[] {
    return [...this.#competitions.values()].sort(
      (one, other) => one.reference.order - other.reference.order,
    );
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
    const settled = this.#settle(this.#now.website, details, taken);
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
   * That a player was added, as `details` say. Refused when another player has
   * the id, or the name, archived or not.
   */
  addPlayer(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const player = TournamentPlayer.from(id, details);
    if (this.#players.has(id.value)) {
      refuse("Tournament.PlayerAlreadyAdded", "The player is already added.");
    }
    this.#refuseAPlayerNameTaken(player);
    this.record(playerEvent(TournamentPlayerAdded, player, by, at));
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
    const player = found.update(details);
    this.#refuseAPlayerNameTaken(player);
    if (samePlayer(player, found)) return;
    this.record(playerEvent(TournamentPlayerUpdated, player, by, at));
  }

  /**
   * That the player `id` is set aside. Whether they have played any games is
   * not the tournament's to know, so whatever asks says, and the player
   * refuses if they have. Archiving one who is archived records nothing.
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
    this.record(new TournamentPlayerArchived(id.value, by, at));
  }

  /** That the archived player `id` is restored. One who is not records nothing. */
  restorePlayer(id: TournamentPlayerId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    const found = this.#playerFound(id);
    if (found.restore() === found) return;
    this.record(new TournamentPlayerRestored(id.value, by, at));
  }

  /** That a block called `name`, the best of `bestOf`, was added. */
  addBlock(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
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
   * That the block `id` is now called `name` and is the best of `bestOf`. Its
   * slug and its order are kept. An update that changes nothing records
   * nothing.
   */
  updateBlock(
    id: CompetitionId,
    name: CompetitionName,
    bestOf: BestOf,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#refuseUnlessManager(by);
    const found = this.#competitionToUpdate(id, "block", name);
    if (found.shape.kind !== "block") return;
    if (found.reference.name.equals(name) && found.shape.bestOf.equals(bestOf))
      return;
    this.record(
      new BlockUpdated(id.value, name.toString(), bestOf.games, by, at),
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
   * That the competition `id`, of whatever kind, is set aside, whether or not
   * it has games: they are kept with it, and come back when it is restored.
   * Archiving one that is archived records nothing.
   */
  archiveCompetition(id: CompetitionId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (this.#competitionFound(id).reference.archived) return;
    this.record(new CompetitionArchived(id.value, by, at));
  }

  /**
   * That the archived competition `id` is restored. One that is not records
   * nothing.
   */
  restoreCompetition(id: CompetitionId, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseUnlessManager(by);
    this.#refuseOnceArchived();
    if (!this.#competitionFound(id).reference.archived) return;
    this.record(new CompetitionRestored(id.value, by, at));
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
      this.#players.set(id.value, TournamentPlayer.from(id, event));
    } else if (event instanceof TournamentPlayerUpdated) {
      this.#playerBecomes(event.playerId, (player) => player.update(event));
    } else if (event instanceof TournamentPlayerArchived) {
      // Whether the player had games was asked when it was recorded, and a
      // player who had any was never archived.
      this.#playerBecomes(event.playerId, (player) =>
        player.archive({ hasGames: false }),
      );
    } else if (event instanceof TournamentPlayerRestored) {
      this.#playerBecomes(event.playerId, (player) => player.restore());
    } else if (event instanceof BlockAdded) {
      this.#competitionAdded(event, {
        kind: "block",
        bestOf: BestOf.from(event.bestOf),
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
    } else if (event instanceof CompetitionRestored) {
      this.#competitionIs(event.competitionId, false);
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

  // What `details` make of a tournament on `website`, refused on the first
  // thing asked of them together that they do not hold to.
  #settle(
    website: Website,
    details: TournamentDetails,
    taken: AddressTaken,
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
    const region =
      country.findRegion(details.region) ??
      refuse(
        "Tournament.RegionNotInCountry",
        "The region is not one of the country's.",
      );
    const handicap = details.handicap ?? false;
    const worldRankings = this.#worldRankingsFor(
      sport,
      handicap,
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
    return {
      website,
      name: details.name,
      starts,
      finishes,
      format,
      sport,
      country,
      region,
      notes: details.notes,
      handicap,
      worldRankings,
      national,
      international,
      address: this.#addressFor(details.name, starts, sport, taken),
    };
  }

  // Only a tournament in a sport with world rankings, not under handicap,
  // counts towards them, and does unless it is said not to. Saying one counts
  // when it cannot is refused rather than quietly undone, since whoever said so
  // meant something the tournament cannot be.
  #worldRankingsFor(
    sport: Sport,
    handicap: boolean,
    said: boolean | undefined,
  ): boolean {
    const hasRankings = SPORTS_WITH_WORLD_RANKINGS.some((ranked) =>
      ranked.equals(sport),
    );
    if (said === true && !hasRankings) {
      refuse("Tournament.NoWorldRankings", "The sport has no world rankings.");
    }
    if (said === true && handicap) {
      refuse(
        "Tournament.HandicapInWorldRankings",
        "A handicap tournament does not count towards the world rankings.",
      );
    }
    return said ?? (hasRankings && !handicap);
  }

  // Where a tournament named `name`, starting at `starts` and played in `sport`
  // is found. A tournament keeps its address unless the year or the sport in
  // it changes. An address it has been found at before is its own to go back
  // to, and it is for whatever says what is taken not to count it as somebody
  // else's, since it is what knows which tournament an address leads to.
  #addressFor(
    name: TournamentName,
    starts: ReadOnlyDate,
    sport: Sport,
    taken: AddressTaken,
  ): TournamentAddress {
    const year = TournamentAddress.yearOf(starts);
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
    const region = country?.findRegion(written.region);
    if (country === undefined || region === undefined) {
      throw new Error(
        `The tournament's stream names a place there is not: ${written.country}/${written.region}.`,
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
      notes:
        written.notes === undefined
          ? undefined
          : TournamentNotes.from(written.notes),
      handicap: written.handicap,
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
    if (!this.manages(by)) {
      refuse(
        "Tournament.NotAManager",
        "Only a manager can change the tournament.",
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
    if (this.#competitions.has(id.value)) {
      refuse(
        "Tournament.CompetitionAlreadyAdded",
        "The competition is already added.",
      );
    }
    this.#refuseACompetitionNameTaken(id, name);
    const slugs = [...this.#competitions.values()].map(({ reference }) =>
      reference.slug.toString(),
    );
    const base = Slug.fromName(name.toString());
    let slug = lastOf(slugsFor(base, id));
    for (const candidate of slugsFor(base, id)) {
      if (!slugs.includes(candidate.toString())) {
        slug = candidate;
        break;
      }
    }
    // Archived competitions keep their orders and still count, so that no
    // order is ever given twice.
    const highest = Math.max(
      0,
      ...[...this.#competitions.values()].map(
        ({ reference }) => reference.order,
      ),
    );
    return { slug: slug.toString(), order: highest + ORDER_STEP };
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

  #competitionIs(written: string, archived: boolean): void {
    const found = this.#competitions.get(written);
    if (found === undefined) return;
    this.#competitions.set(written, {
      ...found,
      reference: referenceWith(found.reference, { archived }),
    });
  }
}

const NOT_A: Readonly<Record<CompetitionShape["kind"], TournamentErrorCode>> = {
  block: "Tournament.NotABlock",
  knockout: "Tournament.NotAKnockout",
  swiss: "Tournament.NotASwiss",
};

// A reference is never altered, so a changed one is made again from the old
// one and what changed.
const referenceWith = (
  reference: CompetitionReference,
  changed: { readonly name?: string; readonly archived?: boolean },
): CompetitionReference =>
  CompetitionReference.from(reference.id, {
    name: changed.name ?? reference.name.toString(),
    slug: reference.slug.toString(),
    order: reference.order,
    archived: changed.archived ?? reference.archived,
  });

const writtenFrom = (settled: Settled): WrittenTournament => ({
  name: settled.name.toString(),
  starts: settled.starts.toISOString(),
  finishes: settled.finishes.toISOString(),
  format: settled.format.name,
  sport: settled.sport.code,
  country: settled.country.code,
  region: settled.region.code,
  notes: settled.notes?.markdown,
  handicap: settled.handicap,
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

const samePlayer = (one: TournamentPlayer, other: TournamentPlayer): boolean =>
  one.name.equals(other.name) &&
  one.representing === other.representing &&
  String(one.flag) === String(other.flag);

const playerEvent = <T extends DomainEvent>(
  Kind: new (
    playerId: string,
    name: string,
    representing: string | undefined,
    flag: string | undefined,
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
    by,
    at,
  );
