# SETUP.md — Repository Setup Specification

Taking this empty repository to a working skeleton. TypeScript throughout, Postgres in Docker, three things served over HTTP, Gherkin as the only tests, CI on GitHub, and a mediator, CQRS and event store written here rather than installed.

This document specifies the **setup**. It does not specify behaviour: behaviour belongs in `.feature` files under `/specs`, and this says how those come to run.

---

## 1. Requirements, and the decisions they force

| Requirement                                       | Decision                                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| TypeScript                                        | Node 22 LTS, npm, ESM, `NodeNext` resolution, `strict`                                          |
| Postgres in Docker                                | `compose.yaml`, Postgres 17, port 5432, one definition used by developers and CI                |
| Auth: email address + password                    | argon2id hashing, opaque session cookie for browsers                                            |
| Auth: Google and Facebook                         | Google over OIDC, Facebook over OAuth 2.0 + Graph                                               |
| Auth: an API for mobile apps                      | Bearer JWT access token + rotating refresh token, same endpoints as the web API                 |
| Web: an API                                       | `/api/v1`, JSON, one API serving both mobile apps and the admin SPA                             |
| Web: static pages for the public side             | Server-rendered HTML, no client framework, works without JavaScript                             |
| Web: a SPA at `/admin`                            | React built by Vite, served as static files with a history fallback                             |
| Gherkin                                           | Cucumber.js, the only test runner                                                               |
| CI via GitHub                                     | Actions: lint, typecheck, build, then the whole spec suite against the compose database         |
| Roll its own mediator, CQRS, event store          | Written in `src/application` and `src/infrastructure`; no framework decides their shape         |
| Layers: web, infrastructure, application, domain  | Enforced by ESLint, not by good intentions                                                      |
| `/src` for source, `/specs` for `.feature` files  | Steps live beside their feature                                                                 |
| No `/tests` folder                                | Stated as a rule below so nobody adds one back                                                  |
| No ambient clock                                  | Every command carries `requestedAt`; the domain is told the time, never asks for it             |
| A real browser for what only a browser can answer | Playwright drives Chromium from Cucumber steps: a driver under the one runner, not a second one |

**Two decisions confirmed, and recorded here so they are not reopened by accident:**

1. "Static pages for the public side" means _not a SPA_: HTML rendered on the server, cacheable and indexable, rather than a build-time export of files to a CDN. Should an export ever be wanted, only `src/web/public/` changes how it delivers; the page modules stay as they are.
2. HTTP itself is not rolled. Fastify handles parsing, routing and cookies. Rolling a mediator is a modelling decision about this application; rolling an HTTP stack is not, and it buys nothing. Fastify is confined to `src/web/`.

---

## 2. The four layers

```
          web                HTTP: the API, the public pages, the admin SPA
           │
     infrastructure          Postgres, event store, OAuth clients, hashing
           │
      application            mediator, commands, queries, handlers, projections
           │
        domain               aggregates, events, value objects, rules
```

Dependencies point inwards and never outwards:

- **domain** imports from `domain` only. It does not know the other layers exist.
- **application** may import from `domain`. Never from `infrastructure`, never from `web`.
- **infrastructure** may import from `application` and `domain`.
- **web** may import from `application` and `domain`. It may name `infrastructure` in exactly one file — `src/web/server.ts`, the composition root, where concrete implementations are chosen and wired.

One thing stands outside the four: `src/import-ravendb/`, which brings the old sites' data over from RavenDB. It is a second composition root, put together from the same parts as the site so that what it writes is what the site reads, and it may import from any layer. No layer may import from it. It is run by hand, from source, on the machine holding the old sites' databases, is left out of the build, and goes once everything is brought over, taking nothing of the site's with it.

When an inner layer needs something it cannot do itself — hash a password, verify a Google token, read a row, send mail — it declares an interface in its own `services/` folder describing what _it_ wants. `infrastructure` implements that interface at the mirrored path. The interface is written for the layer that needs it, never shaped around what an implementation would find convenient.

One interface is implemented by `web` instead: writing an email's words. The email queue is infrastructure, and needs an email written before it can send it, but the words are the reader's, kept in the same catalogue as every word a page shows, so that a language is added to the site by adding one catalogue. Writing them is presentation, which is `web`'s. So the application declares an email writer in `services/`, `web` implements it from the catalogue, and `server.ts` hands that to the queue. The queue imports only the application's declaration, and nothing in `infrastructure` reaches into `web`. It is the one place `web` implements a service; anything else that needs words a reader will see should come the same way rather than keep words of its own.

ESLint enforces all of this (§9); breaking it fails CI.

---

## 3. Layout

```
/src
  /domain
    /common                Uuid, Result, DomainEvent, AggregateRoot, the event
                           registry, validation primitives
    /aggregates            one folder per aggregate root
      /{aggregate}         the root, and the id it is known by
        /events            concrete domain events
        /value-objects
    /services              interfaces the domain names
  /application
    /common                Mediator, Command, Query, Handler, Behaviour, the
                           behaviours that need nothing outside the application,
                           and the one repository every aggregate is loaded and
                           saved through, over the event store
    /operations            one folder per area, holding commands, queries,
                           validators, handlers and result types together
    /projections           read-model builders: events in, rows out
    /services              interfaces the application names — EventStore,
                           PasswordHasher, IdentityProvider
  /infrastructure
    /config                settings and secret loading
    /database              connection pool, migration runner, /migrations/*.sql,
                           the unit of work and the two transaction behaviours
    /event-store           the Postgres event store, append and replay
    /read-models           query implementations over projected tables
    /identity              argon2id hashing, token issuing, Google, Facebook
    /services              every other adapter, at the path it mirrors
  /web
    server.ts              composition root: builds everything, starts Fastify
    /api/v1                JSON endpoints, shared by mobile apps and the SPA
    /auth                  sign-in, sign-out, OAuth redirect and callback,
                           token issue and refresh
    /public                server-rendered public pages and their templates
    /admin                 the React SPA, its own tsconfig, built by Vite
    /common                request context, error mapping, cookies, CSRF
  /import-ravendb          the import from the old sites' RavenDB, run by hand
/specs                     mirrors /src; each .feature sits with its .steps.ts
  /support                 World, hooks, the example requests and events, shared
                           step helpers
  /domain /application /infrastructure /web /import-ravendb
/scripts                   one-off development tooling
/assets                    css and images served as static files
```

Rules across the tree:

- A feature and its step definitions share a folder, and both are named after the source file they describe, casing and all: `Mediator.feature` and `Mediator.steps.ts` for `Mediator.ts`. The folder is named for the same thing in lower case, hyphenated where it runs to more than one word — `specs/domain/common/read-only-date/ReadOnlyDate.feature` — so a capital letter in a path always means a file, and a file with one holds a type. The code they drive sits under the matching path in `/src`.
- Where a class has more to say than one feature can be read as, each of its methods gets a feature of its own, in a folder beneath the class's named for the method, the feature cased as the method is: `specs/domain/aggregates/accounts/account/set-new-password/setNewPassword.feature` for `Account.setNewPassword`.
- `specs/support/` is the exception: it holds what every feature shares, so it is loaded everywhere and may not reach into `src/infrastructure/`.
- A spec obeys the import rule of the layer it describes. `specs/domain/` may reach `src/domain/` and no further out. `specs/infrastructure/` is the one place a spec touches a concrete implementation, because that is precisely what it is describing.
- Where a feature describes an interface, the fake that satisfies it sits beside that feature, so the fake and the scenarios defining it stay together.
- **There is no `/tests` folder.** Anything worth testing is worth stating as behaviour in a `.feature` file.
- `NodeNext` ESM means relative imports carry `.js` even in TypeScript sources: `import { Account } from "../Account.js";`

---

## 4. Package and dependencies

```bash
npm init -y
npm pkg set name="next-croquetscores" type="module" private=true license="UNLICENSED"
npm pkg set engines.node=">=22.13.0"
```

Runtime:

```bash
npm install \
  fastify @fastify/cookie @fastify/static @fastify/formbody \
  pg @node-rs/argon2 jose markdown-it
```

Development:

```bash
npm install --save-dev \
  typescript@^5 @types/node @types/pg tsx \
  @cucumber/cucumber playwright \
  eslint typescript-eslint @eslint/js prettier \
  vite @vitejs/plugin-react react react-dom @types/react @types/react-dom \
  @types/markdown-it
npm install --save-dev --save-exact ravendb@4.2.3
```

The browser binaries are not in the package, and are fetched once:

```bash
npx playwright install chromium
```

- `@node-rs/argon2` ships prebuilt binaries, so a fresh clone needs no compiler.
- `playwright` is the library, not `@playwright/test`. The runner here is Cucumber and stays Cucumber; what Playwright adds is a browser for step definitions to drive.
- `jose` signs and verifies the mobile JWTs and validates Google's `id_token` against its JWKS. Facebook needs nothing beyond `fetch`.
- `markdown-it` draws a commentary's comments from the Markdown they are written in. It is set with HTML turned off, so that it draws Markdown and nothing else, and HTML typed in a comment is shown as the characters it is. That is the whole of the guard: a comment is kept as it was typed, since taking its tags out as it was kept, as a browser would tell them, was tried, and was more than a comment needs and the source of fault after fault. A parser of the site's own was the other way, and was not taken: Markdown has more corners than it looks, and a renderer that gets one wrong is a way into the page.
- `ravendb` is pinned to the 4.2 client, which is what the old sites' RavenDB 4.2 server speaks. It is a development dependency because only the import uses it, and the import is never run from a build. `npm audit` names the versions of `stream-json` and `uuid` it depends on; only a 7.x client is clear of them, and the client reads nothing but the old sites' own databases.
- `typescript` is pinned to `^5`; TypeScript 6 stops auto-including everything under `node_modules/@types`, which is why the configs below name `types` explicitly.

---

## 5. TypeScript configuration

Three configs, because the SPA compiles for a browser and the rest for Node.

`tsconfig.json` — server, specs, and the shared base:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "rootDir": ".",
    "outDir": "dist",

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,

    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "moduleDetection": "force",

    "allowImportingTsExtensions": false,
    "esModuleInterop": true,
    "skipLibCheck": true,

    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "specs/**/*.ts"],
  "exclude": ["dist", "node_modules", "src/web/admin"]
}
```

`tsconfig.build.json` — the server build:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/web/admin", "src/import-ravendb"]
}
```

The build emits only `src/`, so `src/` is its root and the output is `dist/web/server.js` rather than `dist/src/web/server.js`. That matters because the server finds the repository root — and with it `assets/` and `dist/admin/` — by walking up from its own directory, and the walk has to be the same length whether it is running from source through tsx or from `dist` through node. The import from the old sites is left out: it is run from source, and the RavenDB client it needs is a development dependency (§2).

`src/web/admin/tsconfig.json` — the SPA:

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": []
}
```

The admin app is excluded from the root config so browser globals never reach server code and Node globals never reach the browser. `"exclude": []` is what stops that exclusion being inherited here, where it would otherwise leave the SPA's own config with nothing to compile.

---

## 6. Postgres

`compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: croquet_scores
      POSTGRES_USER: croquet_scores
      POSTGRES_PASSWORD: croquet_scores
    # Nothing written here is kept past npm run db:down, so none of it is worth
    # waiting on the disk for. Making and dropping a database for every
    # @postgres scenario is mostly that waiting: with these off, dropping one
    # went from 256 milliseconds to 48 and the database scenarios from eleven
    # minutes to nine. What is given up is surviving a crash of the machine or
    # of Docker, after which the database may be unreadable and is made again
    # with db:down and db:up.
    command:
      - -c
      - fsync=off
      - -c
      - synchronous_commit=off
      - -c
      - full_page_writes=off
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U croquet_scores"]
      interval: 2s
      timeout: 3s
      retries: 30
```

The credentials here are not a secret: they reach a development container on a developer's own machine, and writing them down is what lets a fresh clone run the specs without anyone being told anything first. Anything real is configured per environment (§6.1). A Postgres already listening on 5432 must be stopped before bringing this one up.

Postgres is told not to wait for the disk: `fsync`, `synchronous_commit` and `full_page_writes` are off. Every `@postgres` scenario makes a database and drops it (§8.1), and with six at a time most of that was Postgres waiting on writes being made safe against a crash, for databases that last one scenario. Dropping one went from 256 milliseconds to 48, and the `@postgres` scenarios from 11 minutes to 9. The development database runs the same way, since it is the same container, and after a crash of the machine or of Docker it may not come back; `npm run db:down` and `npm run db:up` make it again, as they would anyway. Anything real runs on a Postgres configured for its environment, never this one.

### 6.1 Configuration

Settings are read once, at startup, by `src/infrastructure/config/`, which validates them and hands out a typed object. Nothing else reads the environment. Values come from environment variables, with a `.env` file — git-ignored — for development:

```
DATABASE_URL=postgres://croquet_scores:croquet_scores@localhost:5432/croquet_scores
SESSION_COOKIE_SECRET=
TOKEN_SIGNING_KEY=
SITE_NAME=Croquet Scores
WEBSITE=localhost:3000
CANONICAL_HOST=
TRUSTED_PROXY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

`SITE_NAME` is what the site is called, and it is where every page a reader is served and every email sent takes the name from: the header, the plea in the footer, the link back to the home page on every page that has one, and the subject and words of every email. The admin takes it too, in its tab title and its bar: its `index.html` is built by Vite ahead of time, so the server says the name into it as it sends it, and the SPA reads it from there (`admin.feature`). One place still spells it out rather than asking: the home page's placeholder prose names the site, and goes with the rest of that prose when the tournament list arrives. It is configured rather than written into the catalogues because a name is not a word of anybody's language, and because a site serving from this repository under another name should call itself that everywhere. It was `EMAIL_FROM_SITE` until the bars began asking for it, and nothing answers to the old name: an environment still setting that one is missing a setting the site needs, and the config loader says so and refuses to start.

`WEBSITE` is which of the five websites this is: `croquetscores.com`, `try.croquetscores.com`, `gateballscores.com`, `try.gateballscores.com`, or `localhost:3000` for development (`Website.feature`). It says which of the two sites is served, which the sports and formats on offer follow, and whether it is a try website, which puts a banner on every page saying that anything entered may be removed at any time (`layout.feature`). Development is Croquet Scores and not a try website. It is required, and a host that is not one of the five stops the site starting, because a Gateball Scores that forgot it and fell back to development would quietly offer croquet. It is not worked out from `CANONICAL_HOST`, which development leaves blank on purpose (below), and it says nothing of what the site is called, which stays `SITE_NAME`'s. `.env.example` sets it to `localhost:3000`, and `npm run dev:setup` adds it to a `.env` written before it existed.

`CANONICAL_HOST` is the host this site answers to, exactly as a browser's address bar spells it — `croquetscores.com`, with a port only where readers see one. It is what an `Origin` is judged against (§7.7). Anything deployed sets it, because left blank each request's own `Host` is used instead, which is the truth on a machine nothing sits in front of and a lie behind a proxy that rewrites it.

In development it stays blank, and deliberately. `npm run dev` serves `localhost:3000`, the `@browser` scenarios serve `127.0.0.1` on whatever port was free (§8.2), and `npm run dev:admin` is a Vite server on a fourth address proxying to the third: one value would be wrong for three of them, and every one of those origins sends a `Host` that is already correct.

`TRUSTED_PROXY` is what forwards requests to the site, if anything: the proxies whose word for where a request came from is believed, written as addresses or ranges — `10.0.0.0/8`, `2001:db8::/32` — separated by commas. Two of the site's limits count by the address a request came from, how often one may ask for a way back in and how often signing in may fail from one, and behind a load balancer every connection comes in from the load balancer, so counting by the connection counts every reader as one and holds them all to one reader's share. The reader's own address is in `X-Forwarded-For`, which anything that can reach the site can write for itself, so it is believed from the proxies named here and from nowhere else. A value that is not addresses stops the site starting, rather than quietly meaning none, and so does a range that fixes no bits — `0.0.0.0/0` is every address there is, which is the yes this setting exists to avoid. It stays blank in development, where nothing sits in front of the site, and anything deployed behind one sets it.

`.env.example` is committed with the keys and no values. `npm run dev:setup` copies it if absent and fills the two local secrets with fresh random bytes, leaving anything already present untouched — regenerating a signing key would invalidate every token signed with it. OAuth credentials stay blank until real ones are pasted in, and the config loader fails at startup, loudly, if something it needs is missing.

### 6.2 Migrations

Numbered SQL files in `src/infrastructure/database/migrations/`, applied in filename order by a runner of ours that records each applied name in a `schema_migrations` table within the same transaction as the migration itself. A migration framework would be more machinery than this needs.

A migration arrives with whatever needs it — the first came with the Postgres event store — and what is in it is decided there rather than here: this document says how migrations are run, not what any of them contains.

---

## 7. What gets built, in order

Each step is finished when its `.feature` files pass. Write the feature first, have it accepted, then the steps, then the code under `/src`.

### 7.1 Domain foundations

`Uuid`, `Result`, and validation. There is no clock: nothing in the domain asks what the time is, because a rule that reads the clock cannot be put to a scenario twice and get the same answer. The time arrives as a value, on the command (§7.4). Failures are reported as codes rather than sentences: a code is contract and belongs in the `.feature` file, while the wording a person reads is the caller's business and can change without breaking anything.

### 7.2 Event sourcing in the domain

`DomainEvent`; an `AggregateRoot` that records uncommitted events and rebuilds itself by replaying a stream; and the registry mapping the name an event was stored under to the type that reads it. That registry is what keeps a five-year-old event readable, and the rules that make it work — a name is never reused, a shape only ever gains optional fields — are specified with it.

### 7.3 The mediator

In `src/application/common/`, and small:

```ts
export abstract class Command<TResult> {
  get requestedAt(): ReadOnlyDate;
  get requestedBy(): AccountId | undefined;
}

export abstract class Query<TResult> {}

export abstract class CommandHandler<
  TCommand extends Command<TResult>,
  TResult,
> {
  abstract readonly handles: RequestType<TCommand>;
  abstract handle(command: TCommand): Promise<TResult>;
}

export abstract class CommandValidator<TCommand extends Command<unknown>> {
  abstract readonly validates: RequestType<TCommand>;
  abstract validate(command: TCommand): readonly string[];
}

export abstract class QueryHandler<TQuery extends Query<TResult>, TResult> {
  abstract readonly handles: RequestType<TQuery>;
  abstract handle(query: TQuery): Promise<TResult>;
}

export abstract class QueryValidator<TQuery extends Query<unknown>> {
  abstract readonly validates: RequestType<TQuery>;
  abstract validate(query: TQuery): readonly string[];
}

export interface Behaviour {
  invoke<T>(request: Command<T> | Query<T>, next: () => Promise<T>): Promise<T>;
}

export class Mediator {
  handleCommand(handler: CommandHandler<TCommand, TResult>): void;
  handleQuery(handler: QueryHandler<TQuery, TResult>): void;
  send<TResult>(command: Command<TResult>): Promise<TResult>;
  query<TResult>(query: Query<TResult>): Promise<TResult>;
}
```

A command says when it was asked for, and who asked if anybody signed in did; it is refused where it is made if it cannot say when. A query says nothing about itself, and is a class so that it can be told from a command: asking a command as a query does not compile, as sending a query as a command does not. Every handler and validator names the request it is for, so registering one takes nothing else, and a handler naming the other side's request is refused as the wrong door. `send` and `query` each find the one handler registered for what they were given, wrap it in that side's behaviour pipeline and run it. What every command, handler and validator shares is specified in `specs/application/common/`: `command/`, `command-handler/`, `command-validator/`, `query-handler/` and `query-validator/`.

A second handler for a request is refused when it is registered. A request with **no** handler cannot be caught the same way: the mediator learns that a request exists only when something registers a handler for it, so it has no way to know about one nobody registered. That is refused when the request is sent instead. Catching it at startup would take the composition root declaring every request the web layer can send and checking each against the registrations — which is not built, and would be its own feature.

Which door a request came through is settled before anything else is asked of it, so a query handed to `send` is refused as the wrong door rather than anything else about it. A command that does not say when it was asked for never gets as far as the mediator, because every event it records is stamped with that time (§7.4) and it is refused where it is made. Behaviours wrap the handler like layers: the first registered is the outermost, the first to see a request going in and the last to see its answer, or its failure, coming out. The codes each refusal carries, and the rest of this as scenarios, are in `specs/application/common/mediator/Mediator.feature`.

There are two pipelines because the two sides need different things of them. A command runs **validation → transaction → handler**: validation rejects it before a transaction is opened, and the transaction behaviour commits the unit of work, appends the events the aggregates recorded together with the projections those events drive, and publishes only after the commit succeeds. A command may say that it runs its own transactions, and one that does is passed straight through and given none. That is for the few commands with slow work to do partway through — a request to Have I Been Pwned over the network, which takes as long as another site takes — where a transaction held open across it would hold a pooled connection doing nothing, and enough of those at once leaves the site with no connections at all. Such a handler reads what it needs, lets go of it, does the slow work with nothing held, and opens the transaction it writes in only then; it takes on for itself everything the transaction behaviour otherwise guarantees. Confirming an email address and setting a new password are the two, and each says so on its command (`RunsItsOwnTransactions`). A query runs **validation → read-only transaction → handler**: a transaction so that everything answering one query reads the database as of one moment, and read-only so that a write on the read side is refused by Postgres rather than by a rule somebody has to remember. One moment takes repeatable read rather than the read committed a transaction gets by default, because read committed takes a fresh snapshot for every statement: a query reading twice inside one of those still reads two moments, and the transaction would be buying nothing a query wants. A command keeps read committed, because repeatable read would have it fail over anything another command touched while it ran. Both pipelines are specified in `specs/infrastructure/database/`, against Postgres, because what is worth knowing about a commit is whether anything was written.

The unit of work holding the connection a request is running on, and the two behaviours that open and finish its transaction, are in `src/infrastructure/database/`. An earlier draft of this document had the unit of work among the interfaces the application names, and it does not belong there: everything that asks for a connection is an adapter, and what it gets back is a Postgres client. An interface in the application would either name a Postgres type, which is the layering broken, or hide it behind an opaque one that every adapter casts its way back out of.

Keeping both on one mediator is what lets the web layer hold a single dependency and lets a behaviour be written once. Keeping them as two methods is what stops a caller writing through the read side by accident.

### 7.4 CQRS

A **command** changes something and returns a result carrying either error codes or a small success type. A **query** changes nothing and returns a shape built for its caller. They share the mediator and nothing else: a command works through aggregates rebuilt from the event store, and a query reads a read-model table directly. Nothing answers a query by replaying events, and nothing writes to a read model except a projection.

Every command carries `requestedAt`: the moment the request was made, decided once at the edge in the web layer and passed down. Aggregates are given it, events are stamped with it, and validators can compare against it. Nothing below the web layer reads a clock, so a scenario can set the time to whatever it needs and get the same answer every run, and a command replayed for diagnosis behaves exactly as it did the first time.

`src/application/operations/<area>/` keeps a command, its validator, its handler and its result type together, so one thing the application can be asked to do is one directory listing.

### 7.5 The event store

`EventStore` is an interface in `src/application/services/`, saying what the application wants of the place events are kept: append to a stream, and read one back. It cannot read across streams, because no command or query has any business doing so. `PostgresEventStore` in `src/infrastructure/event-store/` implements it.

What the store must do is specified in `specs/application/services/event-store/`, and both the interface and every implementation are held to those scenarios. So those scenarios run against Postgres, and need a database, because that is the store the application keeps its events in. What keeping them in Postgres adds is specified beside the store, in `specs/infrastructure/event-store/`. Nothing about either — the shape of a call, what is refused and when, or what any of it looks like in a table — is written down here, because a second description is a second thing to keep true and this one cannot go red when it stops being.

Projections are not checkpointed and do not chase the log. A projection runs **in the same transaction as the append that produced the events**, so a command either records what happened and updates every read model it touches, or does neither. That trades throughput for two things worth more here: a read model is never stale, and there is no half-applied middle state to reason about, no catch-up worker to supervise, and no checkpoint to drift.

Rebuilding a read model is therefore a deliberate act rather than a background one, and an infrastructure task rather than an application one: a maintenance script under `/scripts` replays what has been stored, in the order it was stored, through the projections, having truncated their tables first. Projections stay idempotent so a rebuild can be run twice without harm.

### 7.6 Accounts and the three ways in

An `Account` aggregate holding an email address, an optional password credential, and external logins keyed by `(provider, subject)`. Its events: registered, password set, email address confirmed, external login linked, signed in, closed.

1. **Email address and password.** argon2id, one hash per account, never logged and never returned. A wrong password and an unknown email address report the same failure and take the same time.
2. **Google.** OIDC. Browsers go through a redirect with PKCE and `state`; mobile apps post the `id_token` their native SDK obtained. Both verify against Google's JWKS and match on the `sub` claim — never on the email address, which can change hands where a subject cannot.
3. **Facebook.** OAuth 2.0, then a Graph `/me` call for the id and, where granted, the email address. Facebook may withhold it entirely, so nothing may require an account to have one.

What happens when a Google sign-in arrives carrying the email address of an existing password account is a security decision, not an implementation detail. It gets its own scenarios and its own acceptance.

### 7.7 Two ways of holding a session

- **Browser:** an opaque session id in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie, stored hashed in a `sessions` table.
- **Mobile:** `POST /api/v1/auth/token` returns a signed JWT access token (short-lived, EdDSA via `jose`) and an opaque refresh token, stored hashed and **rotated on every use**. A refresh token presented twice means it leaked, so the whole family is revoked.

Both arrive at one `RequestContext` carrying the account id and its permissions. Nothing below the web layer knows which door was used.

**A change asked for by another site is refused, and no token is needed to tell.** A page elsewhere can make a reader's browser post here, and the browser sends everything it holds for this site when it does — which is what a CSRF token exists to guard against. But browsers now say where a request came from: `Sec-Fetch-Site` on every current one, and `Origin` on the ones too old for that. So every `POST`, `PUT`, `PATCH` and `DELETE` is refused with `403 Request.CrossSite` unless `Sec-Fetch-Site` is `same-origin` or `none`, or, failing that header, `Origin` names `CANONICAL_HOST` (§6.1). A request carrying neither header is taken to be no browser at all — a mobile app, a script, another server — with no cookies of a reader's to be spent, and it is let through.

That last step is a judgement, not a proof: a browser old enough to send neither header exists (Firefox sent no `Origin` on form posts before 70, and `Sec-Fetch-Site` arrived in 90), and a proxy or an extension can strip `Origin` from a current one. A forgery from one of those is not caught. For readers on browsers of this decade that is a risk worth carrying rather than threading a token through every form, and it is recorded here so it is carried knowingly; if it ever stops being worth carrying, the place to change is the one hook.

That is one hook on the server, in front of every route, rather than a token threaded through every form and checked in every handler. It holds whether or not there is a session to hang a token on, which is why the first form that needed it — the theme choice — could have it before sessions exist. `SameSite=Lax` does not do this job: it governs whether a cookie is sent with a cross-site request, not whether the response to one may set a cookie, and a hostile page was shown setting the theme cookie through it before this was added.

### 7.8 The web tier

`src/web/server.ts` is the composition root and the only file outside `infrastructure` naming a concrete implementation. It builds the container, registers handlers with the mediator, and mounts:

| Mount                | Serves                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `/api/v1/*`          | JSON. Mobile apps and the admin SPA. Bearer token or session cookie |
| `/auth/*`            | Sign-in, sign-out, OAuth redirect and callback, token and refresh   |
| `/assets/*`          | `/assets` — css and images, hashed filenames, long cache            |
| `/admin`, `/admin/*` | The built SPA; every path falls back to its `index.html`, rendered  |
| `/*`                 | Server-rendered public pages                                        |

A public page is a module exporting the query it needs and a function returning HTML. It sets `ETag` and `Cache-Control` and works with JavaScript switched off. The admin SPA builds from `src/web/admin/` into `dist/admin/`; in development Vite's dev server proxies `/api` and `/auth` to Fastify.

Errors map in one place. A request refused for breaking its rules is thrown as `Request.Invalid` rather than returned, and becomes `422` carrying every rule it broke, by code — except from a form, which shows itself again with each rule beneath its field (`src/web/common/form.ts`). An unknown route becomes `404`, and anything else unhandled, the mediator's other refusals included, `500` with a correlation id written to the log and nothing else said to the caller.

---

## 8. Cucumber

`cucumber.mjs` holds a profile for each npm script that runs scenarios. What they share is written once and spread into each; what tells them apart is which features they run and where they report:

| Profile     | Script                              | Runs                                          | Reports under                |
| ----------- | ----------------------------------- | --------------------------------------------- | ---------------------------- |
| `default`   | `npm test`, `npm run test:features` | every feature                                 | `reports/cucumber`           |
| `nodb`      | `npm run test:nodb`                 | every feature, less `@postgres`               | `reports/cucumber-nodb`      |
| `db`        | `npm run test:db`                   | every feature, only `@postgres`               | `reports/cucumber-db`        |
| `browser`   | `npm run test:browser`              | every feature, only `@browser`                | `reports/cucumber-browser`   |
| `nobrowser` | `npm run test:nobrowser`            | every feature, less `@browser`                | `reports/cucumber-nobrowser` |
| `changed`   | `npm run test:changed`              | the features `scripts/test-changed.mjs` names | `reports/cucumber-changed`   |

- JavaScript rather than JSON, so the import list, the loader and the number of workers are said once. Six copies of them in JSON would be six things to keep in step, and a support folder added to five and missed in the sixth would fail one script's scenarios for a reason nowhere in the code. It also lets the reasons sit beside the settings as comments, which JSON has no room for.
- Every profile writes two reports, each named after the profile, so running one script does not overwrite what another last reported: `.html`, the whole run to be read in a browser; and `-summary.txt`, the count of scenarios and steps and the time the run took as a whole, which the progress bar prints and then scrolls away, so one run's time can be set against the next.
- A tag given on the command line is added to the profile's rather than replacing it: `npm run test:nodb -- --tags @browser` runs the scenarios that are both.
- The globs match by extension at any depth, which is what lets a `.feature` and its `.steps.ts` share a folder.
- Undefined and pending steps fail the run, so an unimplemented feature file cannot report green.
- Scenarios run six at a time, each on a worker thread of its own, because one at a time the whole suite took twenty-four minutes and six at a time it takes five. Six is the cores of the machine it is worked on; CI has two, and asks for two with `npm run test:features -- --parallel 2`, which overrides the file. Not `npm test -- --parallel 2`: `test` runs `test:features` through a second `npm run`, and what follows the `--` never reaches Cucumber. The scenarios were already kept apart: every `@postgres` scenario has a database of its own, every worker claims a run number of its own (§8.1), and every server a scenario stands up listens on a port the operating system chose.
- tsx is applied twice over, once to each kind of thread. The npm script runs Cucumber's bin through tsx, which is what the main thread loads the steps with. A worker thread does not inherit that, so `loader` names `cucumber-loader.mjs`, which Cucumber registers in each worker before loading anything: tsx's own hooks, handed the empty options that Cucumber does not give them and without which tsx takes itself to have been started with Node's deprecated `--loader` flag and refuses to run. Steps execute as TypeScript with no build step either way.

### 8.1 Scenarios that need a database

Most scenarios reach nothing outside the process and run on a machine with no Postgres anywhere near them. Those that do are tagged `@postgres`, so `npm run test:nodb` is the fast loop while working on anything else.

Each `@postgres` scenario runs in isolation, over a database of its own: made under a name no other scenario has, copied in a `Before` hook from a template the run migrated once, used by that scenario and nothing else, and dropped in an `After` hook. Scenarios cannot share one: two of them writing the same tables would pass or fail according to the order they ran in. Anything the scenario opens on its database — a pool, an application — is closed before the database is dropped. The template is made and migrated when a worker's first `@postgres` scenario starts, and dropped when the run ends. Copying it takes a fraction of the time that running every migration into an empty database did, which was a fifth of all the time the suite spent in its steps.

Runs are kept apart the same way. A second terminal, or an editor running one scenario while the suite runs, is a second run against the same Postgres, and neither may touch what the other made. So a database's name carries the run that made it as well as the `zzz_delete_me_spec_` prefix, which sorts them after every real database in a list and says what they are to whoever finds one there, and a run holds a Postgres advisory lock on its own number for as long as it lasts. A database left behind by a run that was interrupted is dropped at the start of the next one; one whose run still holds its lock is left alone. Postgres lets go of the lock when the connection holding it closes, however the run ended, so this needs no clean shutdown, and it works whether or not the run and Postgres are on one machine, which asking the operating system about a process would not.

That harness lives in `specs/infrastructure/support/`, not `specs/support/`, because it reads the configuration and reaches infrastructure, and `specs/support/` is loaded by every spec in the repository and may not.

A database that is not running is the ordinary way for these to fail, and it is not a fault in any of this. The harness says so in those words and names `npm run db:up`, rather than letting a connection refusal surface as a stack trace through the Postgres client that reads like a bug in the harness and never mentions that a container is involved.

### 8.2 Scenarios that need a browser

Some claims cannot be checked by reading the thing that makes them. Whether a menu opens with JavaScript switched off, whether a control is on the page at one width and gone at another, whether something meant for a thumb is big enough for one — a browser answers these and nothing else does. Those scenarios are tagged `@browser`, and like `@postgres` they are the exception rather than the rule.

A `@browser` scenario gets a browser context of its own and a page in it, and **scripting is switched off** unless the scenario asks for it back. That is not caution, it is the subject: the public pages are required to work without JavaScript, and a browser that has been given none is what turns that requirement into a test rather than an intention.

What the browser talks to depends on whether the scenario keeps anything:

- A scenario tagged `@browser` alone only looks at pages. It keeps nothing and reads nothing kept, so every such scenario shares one application, started by the first of them. Sharing it is what keeps them quick.
- A scenario tagged `@browser @postgres` registers, signs in, confirms, or writes something else down, and runs in isolation. The `@postgres` hooks give it a database of its own (§8.1), and it gets an application of its own over that database, listening on a port of its own and reading a clock the scenario sets. It is closed with the database, before the drop. Two such scenarios sharing one application would share its tables, and a scenario that moves the clock would move it for whichever scenario came next.

Every application listens on whatever port is free, and never on a fixed one. A fixed port would collide with a development server, or with another scenario's application, and the first person to run two at once would find out the hard way. The browser starts once, on the first `@browser` scenario, and each scenario gets a context of its own in it, so no cookie is carried from one scenario to the next. Nothing here starts in `BeforeAll`, because Cucumber runs `BeforeAll` ahead of tag filtering, and a run that wants neither should pay for neither.

The admin a `@browser` scenario drives is the one built into `dist/admin/`, not its source, so a scenario run against a stale build tests yesterday's admin and fails, or worse passes, for reasons that are nowhere in the code. Every script that runs scenarios — `test:features`, and through it `test`, as well as `test:nodb`, `test:db`, `test:browser`, `test:nobrowser` and `test:changed` — has a `pre` script that builds the admin first, which npm runs on its own. `test:nodb` needs one as much as the others, since a `@browser` scenario that keeps nothing is not `@postgres` (`admin.feature` among them). The build takes about a second, so it is done every time rather than only when something changed: working out whether anything did would cost more to keep right than it saves. CI builds it twice, once in `npm run build` and once before the scenarios, and a second is what that costs.

Those builds are `build:admin:alongside`, which writes the new build beside the old one rather than emptying `dist/admin/` first, as `build:admin` does. Two runs at once are expected, which is why every application listens on a port of its own, and a run starting while another is under way would otherwise delete the admin that the first one's applications are serving. It does no harm to them: an application reads the page once, when it starts, and lists the assets there are then, and an asset's name changes with its content, so the new build only adds files beside the ones already being served. What it costs is that old assets pile up in `dist/admin/` until the next `npm run build`, which empties it, and is what anything deployed is built with.

The `@postgres` hooks have to run before the `@browser` ones, because a scenario's application is built over a database that must already exist. Cucumber runs hooks in the order they were defined, so the browser harness imports the database harness before it defines its own.

That harness lives in `specs/web/support/`, for the same reason the database one lives in `specs/infrastructure/support/`: it reaches into the layer it describes, and `specs/support/` may not.

CI installs Chromium and only Chromium. A second engine is a second download on every run, and wants a reason.

### 8.3 Gherkin conventions

- A `.feature` file describes behaviour. Method names, signatures and encodings belong in the step definitions and in the `/src` types, where a reviewer sees them.
- Steps are written to be reused: one value to a step, and a set asserted by naming each member.
- Land a large feature one `Rule:` block at a time, so review stays tractable.
- Shared state between steps is declared on the World in `specs/support/`.

---

## 9. Lint, format, and enforcing the layers

`eslint.config.js`:

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * @param {string} message
 * @param {...string} groups
 * @returns {import("eslint").Linter.RulesRecord}
 */
const forbid = (message, ...groups) => ({
  "no-restricted-imports": [
    "error",
    { patterns: groups.map((group) => ({ group: [group], message })) },
  ],
});

export default tseslint.config(
  { ignores: ["dist", "reports", "node_modules", "assets"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.ts", "*.mjs", "scripts/*.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Configuration and tooling are plain JavaScript with no project of their
  // own, so there are no types to check them against.
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      // Named rather than pulled from a globals package: this is the whole list
      // these files use, and a short list that is true beats a long one.
      globals: { console: "readonly", process: "readonly" },
    },
  },
  // The admin SPA has its own tsconfig, which the project service finds.
  {
    files: ["src/web/admin/**/*.tsx", "src/web/admin/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/domain/**/*.ts", "specs/domain/**/*.ts"],
    rules: forbid(
      "domain does not know that application, infrastructure or web exist.",
      "**/application/**",
      "**/infrastructure/**",
      "**/web/**",
    ),
  },
  // What every aggregate shares names no aggregate, or it stops being shared.
  // The one exception is who did it: every event says which account caused it,
  // so the account's id is named here by everything. It is excepted by name so
  // that a second such import fails the build rather than following the first.
  // A later block replaces an earlier one's rule outright, so the domain's own
  // restrictions are said again.
  {
    files: ["src/domain/common/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...["**/application/**", "**/infrastructure/**", "**/web/**"].map(
              (group) => ({
                group: [group],
                message:
                  "domain does not know that application, infrastructure or web exist.",
              }),
            ),
            {
              // A regex rather than a group: a group is read as gitignore
              // would read it, and a file cannot be let back in from under a
              // directory that has been shut out.
              regex: "/aggregates/(?!accounts/AccountId\\.js$)",
              message:
                "domain/common is shared by every aggregate and names none of them, except the id of the account that caused an event.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/application/**/*.ts",
      "specs/application/**/*.ts",
      "specs/support/**/*.ts",
    ],
    rules: forbid(
      "application names the interface; infrastructure implements it.",
      "**/infrastructure/**",
      "**/web/**",
    ),
  },
  {
    files: ["src/web/**/*.ts", "src/web/**/*.tsx"],
    ignores: ["src/web/server.ts"],
    rules: forbid(
      "only the composition root, src/web/server.ts, may name infrastructure.",
      "**/infrastructure/**",
    ),
  },
);
```

The one exception written into the layer rules is `src/domain/common/`, which is shared by every aggregate and so names none of them — except the id of the account that caused an event, which every event carries. That is excepted by name, so a second import of an aggregate fails the build rather than following the first through a door left open. It takes a regex rather than a group, because a group is read the way `.gitignore` reads one and will not let a file back in from under a directory that has been shut out.

Three things beyond the layer rules earn their place. `disableTypeChecked` covers the plain JavaScript — this file and the scripts — because there is no `tsconfig.json` that includes them and so no types to check them against; the handful of Node globals they use are named there rather than pulled in from a `globals` package, on the grounds that a short list that is true beats a long one. `scripts/*.mjs` joins `allowDefaultProject`, whose patterns match only at the root. And the admin SPA gets a block naming its own `tsconfig.json`, since the root one excludes it.

`.prettierrc.json`:

```json
{ "semi": true, "singleQuote": false, "trailingComma": "all" }
```

---

## 10. npm scripts

```bash
npm pkg set scripts.build="tsc -p tsconfig.build.json && npm run build:admin"
npm pkg set scripts.build:admin="vite build"
npm pkg set scripts.build:admin:alongside="vite build --emptyOutDir=false"
npm pkg set scripts.dev="tsx watch src/web/server.ts"
npm pkg set scripts.dev:admin="vite"
npm pkg set scripts.dev:setup="node scripts/dev-setup.mjs"
npm pkg set scripts.typecheck="tsc --noEmit && tsc --noEmit -p src/web/admin"
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.test="npm run test:features"
npm pkg set scripts.test:features="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js"
npm pkg set scripts.test:nodb="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --profile nodb"
npm pkg set scripts.test:db="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --profile db"
npm pkg set scripts.test:browser="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --profile browser"
npm pkg set scripts.test:nobrowser="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --profile nobrowser"
npm pkg set scripts.db:up="docker compose up -d --wait && npm run dev:setup"
npm pkg set scripts.db:down="docker compose down -v"
npm pkg set scripts.db:migrate="tsx src/infrastructure/database/migrate-cli.ts"
npm pkg set scripts.db:drop-tables="tsx src/infrastructure/database/drop-tables-cli.ts"
npm pkg set scripts.import:ravendb="tsx src/import-ravendb/import-ravendb.ts"
npm pkg set scripts.pretest:features="npm run build:admin:alongside"
npm pkg set scripts.pretest:nodb="npm run build:admin:alongside"
npm pkg set scripts.pretest:db="npm run build:admin:alongside"
npm pkg set scripts.pretest:browser="npm run build:admin:alongside"
npm pkg set scripts.pretest:nobrowser="npm run build:admin:alongside"
npm pkg set scripts.pretest:changed="npm run build:admin:alongside"
```

Working on one feature:

```bash
npm run test:features -- specs/domain/aggregates/accounts/account/confirm/confirm.feature
npm run test:features -- --tags "@wip"
npm run test:nodb
```

---

## 11. README and LICENSE

### README.md

Written for whoever arrives at the repository knowing nothing: what this is, how to get it running, and where to look next. It is not this document. `SETUP.md` says how the repository was built and why; the README says how to use it, and links here for the rest.

It is short on purpose. Anything that has to be kept in step with the code — the list of operations, the shape of an endpoint — belongs in a `.feature` file, which cannot go stale without the build going red.

It says what this is, how to get it running — including the browser the scenarios drive, which `npm ci` does not fetch — what the checks are, and which document to read for what. `README.md` is the copy that counts; repeating it here would be a second one to keep true, and it drifted within a day of being written.

### LICENSE

All rights are reserved. This is not open source, and nothing about the repository should suggest otherwise: no permission is granted to anyone by the act of publishing it.

```
Copyright (c) 2026 Tim Murphy. All rights reserved.

This software and its source code are proprietary. No permission is granted
to use, copy, modify, merge, publish, distribute, sublicense or sell any part
of this software, by any means, without the prior written permission of the
copyright holder.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

The file is named `LICENSE` with no extension, which is where GitHub looks. Because the licence is not one GitHub recognises, the repository shows no licence badge, and that is the correct outcome rather than a problem to solve. `package.json` carries `"license": "UNLICENSED"` and `"private": true` (§4), which is how npm says the same thing and what stops a publish by accident.

The warranty disclaimer is there because reserving rights is not the same as accepting liability, and a file that grants nothing should still disclaim.

---

## 12. Git housekeeping

`.gitignore`:

```
node_modules/
dist/
reports/
coverage/
*.tsbuildinfo
.env
.vscode/settings.json

# Review output, written here to be read and acted on rather than kept.
code-review.md
```

`.gitattributes`, so `.feature` files keep LF endings on Windows:

```
* text=auto eol=lf
```

---

## 13. CI

`.github/workflows/ci.yml` is two jobs, and the file itself is where what each does is said, with why beside it:

- `build` installs, lints, typechecks and builds, on every pull request and every push to `main`.
- `tests` waits on it, and runs every scenario in four shards side by side, each on a runner of its own with a Postgres of its own, a quarter of the suite each with Cucumber's `--shard`, two workers to a runner. A shard that fails does not stop the others. It does not run on `main`, which is only reached by squash-merging a pull request whose scenarios passed on its own branch.

Nothing is kept of a run but what GitHub shows of it: a failing scenario is read off the log of the shard it failed in, and run again locally.

CI brings up the same `compose.yaml` a developer does, rather than declaring a `services:` block. A second description of the database is a second thing to keep in step.

---

## 14. Done when

```bash
npm run lint        # clean, layer rules included
npm run typecheck   # clean, both server and SPA
npm run build       # dist/ and dist/admin/ both produced
npm run db:up
npm test            # every scenario under /specs passes
npm run db:down
```

and, by inspection:

- `README.md` and `LICENSE` are present, and the README's commands are the ones that actually work.
- `/tests` does not exist and nothing invites anyone to create it.
- Nothing under `src/domain/` imports from outside `src/domain/`.
- `src/web/server.ts` is the only file outside `src/infrastructure/` naming a concrete implementation.
- The public side renders with JavaScript switched off, `/admin` loads the SPA on a deep link, and `/api/v1` answers a bearer token.
- A fresh clone reaches green with `npm ci`, `npm run db:up`, `npm test` — and nothing else, and nobody had to be asked anything.
