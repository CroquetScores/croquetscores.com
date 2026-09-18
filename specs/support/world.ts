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
import type { EventStore } from "../../src/application/services/EventStore.js";
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../src/application/services/PasswordHasher.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import type { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import type {
  EventRegistry,
  KeptEvent,
} from "../../src/domain/common/EventRegistry.js";
import type { Id } from "../../src/domain/common/Id.js";
import type { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../src/domain/common/validation/Validator.js";

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

  // The account a scenario names, the example event it creates, and that
  // event written out as data.
  public account: AccountId | undefined;
  public event: DomainEvent | undefined;
  public writtenEvent: Record<string, unknown> | undefined;

  // An event store, the streams a scenario has named in order, the events
  // waiting to be appended, what reading a stream back gave, and how many of
  // those the scenario has named so far.
  public eventStore: EventStore | undefined;
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

  // Set by the @browser hooks, for the same reason and in the same way.
  public browserContext: BrowserContext | undefined;
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
