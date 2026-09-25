// Shared by every scenario in the repository, which is why it may name nothing
// from src/infrastructure/: what needs to lives in specs/infrastructure/support/.
import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Pool } from "pg";
import type { BrowserContext, Page } from "playwright";

// The application and domain layers, which this file may name: the rule it
// keeps is only that it names nothing from infrastructure or the web.
import type { Command } from "../../src/application/common/Command.js";
import type { CommandHandler } from "../../src/application/common/CommandHandler.js";
import type { Mediator } from "../../src/application/common/Mediator.js";
import type { Query } from "../../src/application/common/Query.js";
import type { QueryHandler } from "../../src/application/common/QueryHandler.js";
import type {
  RequestValidator,
  ValidationBehaviour,
} from "../../src/application/common/ValidationBehaviour.js";
import type { Projection } from "../../src/application/common/Projection.js";
import type { AggregateRepository } from "../../src/application/common/AggregateRepository.js";
import type { EventStore } from "../../src/application/services/EventStore.js";
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../src/application/services/PasswordHasher.js";
import type { BreachedPasswords } from "../../src/application/services/BreachedPasswords.js";
import type { Account } from "../../src/domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import type { AggregateRoot } from "../../src/domain/common/AggregateRoot.js";
import type { Website } from "../../src/domain/common/Website.js";
import type { EmailAddress } from "../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Password } from "../../src/domain/aggregates/accounts/value-objects/Password.js";
import type { PersonName } from "../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { Flag } from "../../src/domain/aggregates/tournaments/value-objects/Flag.js";
import type { Flags } from "../../src/domain/aggregates/tournaments/value-objects/Flags.js";
import type { Country } from "../../src/domain/aggregates/tournaments/value-objects/Country.js";
import type { Countries } from "../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import type { Region } from "../../src/domain/aggregates/tournaments/value-objects/Region.js";
import type { Sport } from "../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import type { TournamentFormat } from "../../src/domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import type { TournamentNotes } from "../../src/domain/aggregates/tournaments/value-objects/TournamentNotes.js";
import type { TournamentPlayer } from "../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import type { CompetitionName } from "../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { CompetitionReference } from "../../src/domain/aggregates/tournaments/CompetitionReference.js";
import type { Slug } from "../../src/domain/common/Slug.js";
import type { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import type {
  EventRegistry,
  KeptEvent,
} from "../../src/domain/common/EventRegistry.js";
import type { Id } from "../../src/domain/common/Id.js";
import type { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { ExampleThing, ExampleThingId } from "./exampleThing.js";
import type { HandledRequests } from "../../src/application/services/HandledRequests.js";
import type { BrokenRule } from "../../src/domain/common/validation/Validator.js";
import type { AccountsInHand } from "./accounts.js";
import type { Registering } from "./registering.js";
import type { Site } from "./sites.js";

export class SpecWorld extends World {
  // Set by the @postgres hooks. A scenario without that tag has neither.
  public databaseName: string | undefined;
  public pool: Pool | undefined;
  // Whatever a scenario opened on its database besides the pool — an
  // application, say — closed by the @postgres teardown before the database is
  // dropped. Cucumber runs After hooks in an order set by which file it happened
  // to load first, so a hook of their own would be closing them either side of
  // the drop by accident.
  public closeBeforeDropping: (() => Promise<void>)[] = [];

  // A request being judged for where it came from. Typed by its shape rather
  // than by importing Provenance: this file is loaded by every spec in the
  // repository and so may name nothing from src/infrastructure or src/web.
  public provenance:
    | {
        method: string;
        secFetchSite: string | undefined;
        origin: string | undefined;
        host: string | undefined;
      }
    | undefined;

  // The host the site is configured to answer to, when a scenario sets one.
  public canonicalHost: string | undefined;

  // What a scenario has told the site forwards requests to it, written as the
  // setting is written, and the request being judged by it: the address its
  // connection came in on, and what it says about having been forwarded, from
  // the reader's own address outwards. Typed by their shape rather than by
  // naming anything in src/web, for the reason at the top of this file.
  public trustedProxySetting: string | undefined;
  public requestCameIn: { connection: string; forwarded: string[] } | undefined;
  // What came of starting the site with that setting: nothing, or the refusal.
  public startingFailed: unknown;

  // A page on some other site, served into the browser by the scenario.
  public elsewhere: string | undefined;

  // Where a reader asking to return somewhere was actually sent.
  public returnPath: string | undefined;

  // What the last call to the migration runner reported. Typed by its shape
  // rather than by importing AppliedMigration, for the same reason.
  public appliedMigrations: readonly { readonly name: string }[] | undefined;

  // The mediator a scenario puts together, and what came of using it: the
  // answer or the failure, which handlers were called, and everything its
  // behaviours and handlers did, in the order they did it.
  public mediator: Mediator | undefined;
  // The validation behaviour in the mediator's lines, when a scenario puts one
  // there, so that more than one feature's steps can register with it.
  public validation: ValidationBehaviour | undefined;
  // A handler or validator a scenario has made and not yet registered. A
  // handler says which side's it is, because registering one is a different
  // question on each side; a validator is registered the same way on both.
  public unregisteredHandler:
    | { side: "command"; handler: CommandHandler<Command<string>, string> }
    | { side: "query"; handler: QueryHandler<Query<string>, string> }
    | undefined;
  public unregisteredValidator:
    RequestValidator<Command<unknown> | Query<unknown>> | undefined;
  // Whether the scenario's example command says it runs its own transactions.
  public exampleCommandRunsItsOwnTransactions = false;
  // Whether the handler found a transaction underway when it ran.
  public foundUnderway: boolean | undefined;
  public answer: unknown;
  public failure: unknown;
  public handled: string[] = [];
  // Every request a handler was given, in the order it was given them.
  public handledRequests: unknown[] = [];
  public happened: string[] = [];
  public happenedChecked = 0;
  // A failure a handler was made to throw, so it can be recognised coming out.
  public plantedFailure: Error | undefined;

  // What the example handler does when it is called, besides answering, in the
  // order the scenario asked for it. A feature specifying something wrapped
  // around a handler puts what it needs the handler to do in here.
  public whatTheExampleHandlerAlsoDoes: (() => Promise<void>)[] = [];

  // The candidate a scenario puts to a validator, and every rule it was found
  // to break, of which the scenario has named this many so far.
  public range:
    | {
        start: number | undefined;
        end: number | undefined;
        step: number | undefined;
      }
    | undefined;
  public brokenRules: readonly BrokenRule[] | undefined;
  public brokenRulesChecked = 0;
  // The fields the scenario has said the rule it last named reads.
  public fieldsNamed: string[] = [];

  // Which kind of id a scenario is about, the ids it has minted or read in
  // order, and the writing of the last one written down.
  public idKind: { mint(): Id; read(written: string): Id } | undefined;
  public ids: Id[] = [];
  public writtenId: string | undefined;
  // A moment a scenario gives, the read-only dates made from it in order, and
  // the last of those written out as data.
  public moment: Date | undefined;
  public readOnlyDates: ReadOnlyDate[] = [];
  public writtenMoment: unknown;

  // What makes the accounts a scenario says are already there, given by
  // whichever support stood the scenario up: the operation's own, or the
  // application a browser scenario is talking to.
  public accountsInHand: AccountsInHand | undefined;

  // The address a scenario last registered or asked about, so that a step
  // naming none still knows whose email to read: a scenario says the address
  // where it does something with it, not again in every step after.
  public addressInHand: string | undefined;

  // The id of an account a scenario took hold of before anything happened to
  // it. A forgotten account is no longer found by its address, and steps after
  // its forgetting still have to name it.
  public accountHeld: string | undefined;

  // The link a scenario has taken hold of — out of an email, altered, or made
  // for something else. On the world rather than beside one feature's steps
  // because two features take hold of the same link: confirming, and asking
  // what that link is worth before anybody follows it.
  public linkInHand: string | undefined;

  // The account a scenario names, the example event it creates, and that
  // event written out as data.
  public account: AccountId | undefined;
  public event: DomainEvent | undefined;
  public writtenEvent: Record<string, unknown> | undefined;

  // An event store, the streams a scenario has named in order, the events
  // waiting to be appended, what reading a stream back gave, and how many of
  // those the scenario has named so far.
  public eventStore: EventStore | undefined;
  // The projections in front of that store, when a scenario has any, in the
  // order they are given what is appended.
  public projections: Projection[] = [];
  // A repository of example things over that store, when a scenario has one.
  public repository:
    AggregateRepository<ExampleThing, ExampleThingId> | undefined;
  public streams: Id[] = [];
  public pendingEvents: DomainEvent[] = [];
  public readBack: readonly DomainEvent[] | undefined;
  public readBackChecked = 0;

  // How a scenario's calls to an event store are made: as a request being
  // served would make them. Typed by its shape rather than by naming the unit
  // of work, for the reason at the top of this file. Whatever puts a store
  // behind "an event store" says what a request is; a store that needs none
  // would leave this calling straight through.
  public asARequest: <T>(work: () => Promise<T>) => Promise<T> = (work) =>
    work();

  // The registry a scenario puts together, what was kept of an event written
  // down through it, and the event read back from what was kept.
  public registry: EventRegistry | undefined;
  public kept: KeptEvent | undefined;
  public readBackEvent: DomainEvent | undefined;

  // A password hasher, the password a scenario gives it, the hashes made of it
  // in order, what the last check found, and how long the checks took.
  public passwordHasher: PasswordHasher | undefined;
  public password: string | undefined;
  public passwordHashes: string[] = [];
  public passwordCheck: PasswordCheck | undefined;
  public checkTook: { againstHash?: number; againstNone?: number } = {};

  // A breached password check, and what the last check found. The check's
  // feature cannot name the service that stands behind it, so whatever puts
  // one there says here how the scenario tells it which passwords have been
  // breached, and how it makes the service unreachable. A failure to check is
  // kept in `failure`.
  public breachedPasswords: BreachedPasswords | undefined;
  public knownBreached: ((password: string) => void) | undefined;
  public breachedPasswordsUnreachable: (() => Promise<void>) | undefined;
  public breached: boolean | undefined;

  // The parts of an account a scenario makes, whether the last email address
  // was found the same as another, and every way the last password made was
  // written out. A failure to make any of them is kept in `failure`.
  public emailAddress: EmailAddress | undefined;
  public sameAddress: boolean | undefined;
  public personName: PersonName | undefined;
  public madePassword: Password | undefined;
  public writtenOut: string[] = [];

  // The flag a scenario makes, the other it is compared with, and whether the
  // two were found the same. A failure to make one is kept in `failure`.
  public flag: Flag | undefined;
  public otherFlag: Flag | undefined;
  public sameFlag: boolean | undefined;
  // The files a scenario makes its flags from, in the order it names them, the
  // flags made, and how many of those in order the scenario has named so far.
  public flagFiles: string[] = [];
  public flags: Flags | undefined;
  public flagsChecked = 0;
  // The country a scenario makes or finds, the other it is compared with, and
  // whether the two were found the same; and the names a scenario makes its
  // countries from, in the order it gives them, the countries made, and how
  // many of those in order the scenario has named so far.
  public country: Country | undefined;
  public otherCountry: Country | undefined;
  public sameCountry: boolean | undefined;
  public countryNames: [code: string, name: string][] = [];
  public countries: Countries | undefined;
  public countriesChecked = 0;
  // The region a scenario makes, or finds in a country; the regions a scenario
  // gives the country it makes, and those it gives each country by its code,
  // in the order it gives them; and how many of a country's regions in order
  // the scenario has named so far.
  public region: Region | undefined;
  public regionEntries: [code: string, name: string][] = [];
  public countryRegions: [
    country: string,
    regions: [code: string, name: string][],
  ][] = [];
  public regionsChecked = 0;
  // The site a scenario names, which whatever differs by site looks at.
  public site: Site | undefined;
  // The website a scenario makes, and whether it was found the same as
  // another. A failure to make one is kept in `failure`.
  public website: Website | undefined;
  public sameWebsite: boolean | undefined;
  // The sport a scenario makes, and whether it was found the same as another;
  // and the sports found for the site it names, and how many of those in order
  // the scenario has named so far.
  public sport: Sport | undefined;
  public sameSport: boolean | undefined;
  public offeredSports: readonly Sport[] | undefined;
  public offeredSportsChecked = 0;
  // The format a scenario makes, and whether it was found the same as another;
  // and the formats found for the site it names, and how many of those in
  // order the scenario has named so far.
  public tournamentFormat: TournamentFormat | undefined;
  public sameTournamentFormat: boolean | undefined;
  public offeredFormats: readonly TournamentFormat[] | undefined;
  public offeredFormatsChecked = 0;
  // The notes a scenario made, which may be none, kept apart from whether any
  // were made at all.
  public madeNotes: { notes: TournamentNotes | undefined } | undefined;
  // The player in a tournament a scenario makes, the other it is compared
  // with, and whether the two were found the same. A failure to make one is
  // kept in `failure`.
  public tournamentPlayer: TournamentPlayer | undefined;
  public otherTournamentPlayer: TournamentPlayer | undefined;
  public sameTournamentPlayer: boolean | undefined;
  // The competition name and the slug a scenario makes. A failure to make
  // either is kept in `failure`.
  public competitionName: CompetitionName | undefined;
  public slug: Slug | undefined;
  // The reference to a competition a scenario makes, the other it is compared
  // with, and whether the two were found the same. A failure to make one is
  // kept in `failure`.
  public competitionReference: CompetitionReference | undefined;
  public otherCompetitionReference: CompetitionReference | undefined;
  public sameCompetitionReference: boolean | undefined;

  // The thing that lasts a scenario is looking at, when it is a real one rather
  // than the example thing, so that the steps every such thing shares — what
  // it has recorded — can be asked of it.
  public aggregate: AggregateRoot | undefined;

  // What becomes of an account a scenario registers or changes, and how its
  // email address is hashed, when the scenario keeps accounts rather than only
  // making them: the domain's steps cannot name the store that keeps them, so
  // whatever puts one together says so here. Absent, an account is only made.
  public keepAccount: ((account: Account) => Promise<void>) | undefined;
  public hashEmailAddress: ((address: string) => string) | undefined;
  // What looking an account up found, when a scenario has looked one up, so
  // that the steps every lookup shares — found, or not — can be asked of it.
  public lookup: { found: AccountId | undefined } | undefined;

  // Where a scenario's claims are remembered, when one stands a record of
  // handled requests up, and what each claim answered, in order. The record's
  // feature cannot name the place they are kept, so whatever puts one there
  // says here what it is.
  public handledRequestsRecord: HandledRequests | undefined;
  public claims: boolean[] = [];

  // What a scenario registers through, when one stands registering up: the
  // application's feature cannot name what keeps accounts or queues emails, so
  // whatever puts them there says here how the scenario asks and what it can
  // look at. What came of the last registration is kept in `answer` and
  // `failure`, as everything the mediator answers is.
  public registering: Registering | undefined;

  // Set by the @browser hooks, for the same reason and in the same way.
  public browserContext: BrowserContext | undefined;
  // What the scenario has asked of the browser, kept so that a browser made
  // again with scripting switched on is asked the same.
  public colourScheme: "light" | "dark" | undefined;
  public acceptLanguage: string | undefined;
  public page: Page | undefined;
  public baseUrl: string | undefined;

  public get browserPage(): Page {
    if (this.page === undefined) {
      throw new Error(
        "This scenario has no browser. Tag it @browser if it needs one.",
      );
    }
    return this.page;
  }

  public get database(): Pool {
    if (this.pool === undefined) {
      throw new Error(
        "This scenario has no database. Tag it @postgres if it needs one.",
      );
    }
    return this.pool;
  }
}

setWorldConstructor(SpecWorld);
