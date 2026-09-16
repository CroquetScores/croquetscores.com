# SETUP.md — Repository Setup Specification

Taking this empty repository to a working skeleton. TypeScript throughout, Postgres in Docker, three things served over HTTP, Gherkin as the only tests, CI on GitHub, and a mediator, CQRS and event store written here rather than installed.

This document specifies the **setup**. It does not specify behaviour: behaviour belongs in `.feature` files under `/specs`, and this says how those come to run.

---

## 1. Requirements, and the decisions they force

| Requirement                                      | Decision                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| TypeScript                                       | Node 22 LTS, npm, ESM, `NodeNext` resolution, `strict`                                  |
| Postgres in Docker                               | `compose.yaml`, Postgres 17, port 5432, one definition used by developers and CI        |
| Auth: email address + password                   | argon2id hashing, opaque session cookie for browsers                                    |
| Auth: Google and Facebook                        | Google over OIDC, Facebook over OAuth 2.0 + Graph                                       |
| Auth: an API for mobile apps                     | Bearer JWT access token + rotating refresh token, same endpoints as the web API         |
| Web: an API                                      | `/api/v1`, JSON, one API serving both mobile apps and the admin SPA                     |
| Web: static pages for the public side            | Server-rendered HTML, no client framework, works without JavaScript                     |
| Web: a SPA at `/admin`                           | React built by Vite, served as static files with a history fallback                     |
| Gherkin                                          | Cucumber.js, the only test runner                                                       |
| CI via GitHub                                    | Actions: lint, typecheck, build, then the whole spec suite against the compose database |
| Roll its own mediator, CQRS, event store         | Written in `src/application` and `src/infrastructure`; no framework decides their shape |
| Layers: web, infrastructure, application, domain | Enforced by ESLint, not by good intentions                                              |
| `/src` for source, `/specs` for `.feature` files | Steps live beside their feature                                                         |
| No `/tests` folder                               | Stated as a rule below so nobody adds one back                                          |
| No ambient clock                                 | Every command carries `requestedAt`; the domain is told the time, never asks for it     |

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

When an inner layer needs something it cannot do itself — hash a password, verify a Google token, read a row, send mail — it declares an interface in its own `services/` folder describing what _it_ wants. `infrastructure` implements that interface at the mirrored path. The interface is written for the layer that needs it, never shaped around what an implementation would find convenient.

ESLint enforces all of this (§9); breaking it fails CI.

---

## 3. Layout

```
/src
  /domain
    /common                Uuid, Result, DomainEvent, validation primitives
    /aggregates            one folder per aggregate root
      /{aggregate}
        /events            concrete domain events
        /value-objects
    /services              interfaces the domain names
  /application
    /common                Mediator, Command, Query, Handler, pipeline behaviours
    /operations            one folder per area, holding commands, queries,
                           validators, handlers and result types together
    /projections           read-model builders: events in, rows out
    /services              interfaces the application names — repositories,
                           EventStore, UnitOfWork, IdentityProvider
  /infrastructure
    /config                settings and secret loading
    /database              connection pool, migration runner, /migrations/*.sql
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
/specs                     mirrors /src; each .feature sits with its .steps.ts
  /support                 World, hooks, shared step helpers
  /domain /application /infrastructure /web
/scripts                   one-off development tooling
/assets                    css and images served as static files
```

Rules across the tree:

- A feature and its step definitions share a folder named for the feature. The code they drive sits under the matching path in `/src`.
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
  pg @node-rs/argon2 jose
```

Development:

```bash
npm install --save-dev \
  typescript@^5 @types/node @types/pg tsx \
  @cucumber/cucumber \
  eslint typescript-eslint @eslint/js prettier \
  vite @vitejs/plugin-react react react-dom @types/react @types/react-dom
```

- `@node-rs/argon2` ships prebuilt binaries, so a fresh clone needs no compiler.
- `jose` signs and verifies the mobile JWTs and validates Google's `id_token` against its JWKS. Facebook needs nothing beyond `fetch`.
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
  "exclude": ["src/web/admin"]
}
```

The build emits only `src/`, so `src/` is its root and the output is `dist/web/server.js` rather than `dist/src/web/server.js`. That matters because the server finds the repository root — and with it `assets/` and `dist/admin/` — by walking up from its own directory, and the walk has to be the same length whether it is running from source through tsx or from `dist` through node.

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
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U croquet_scores"]
      interval: 2s
      timeout: 3s
      retries: 30
```

The credentials here are not a secret: they reach a development container on a developer's own machine, and writing them down is what lets a fresh clone run the specs without anyone being told anything first. Anything real is configured per environment (§6.1). A Postgres already listening on 5432 must be stopped before bringing this one up.

### 6.1 Configuration

Settings are read once, at startup, by `src/infrastructure/config/`, which validates them and hands out a typed object. Nothing else reads the environment. Values come from environment variables, with a `.env` file — git-ignored — for development:

```
DATABASE_URL=postgres://croquet_scores:croquet_scores@localhost:5432/croquet_scores
SESSION_COOKIE_SECRET=
TOKEN_SIGNING_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

`.env.example` is committed with the keys and no values. `npm run dev:setup` copies it if absent and fills the two local secrets with fresh random bytes, leaving anything already present untouched — regenerating a signing key would invalidate every token signed with it. OAuth credentials stay blank until real ones are pasted in, and the config loader fails at startup, loudly, if something it needs is missing.

### 6.2 Migrations

Numbered SQL files in `src/infrastructure/database/migrations/`, applied in filename order by a runner of ours that records each applied name in a `schema_migrations` table within the same transaction as the migration itself. A migration framework would be more machinery than this needs.

`0001-event-store.sql`:

```sql
create table events (
    global_position bigserial   primary key,
    stream_id       text        not null,
    version         integer     not null,
    event_type      text        not null,
    event_version   integer     not null default 1,
    data            jsonb       not null,
    metadata        jsonb       not null,
    occurred_at     timestamptz not null,
    constraint events_stream_version unique (stream_id, version)
);

create index events_stream on events (stream_id, version);
create index events_by_type on events (event_type, global_position);
```

A stream id is `{aggregate}/{uuid}` — the aggregate's name, a slash, then the uuid in a form that needs no quoting or escaping. It says what it identifies, so there is no `stream_type` column: a second copy of the same fact is a second thing to keep true. The exact encoding of the uuid is behaviour and gets its own feature.

`unique (stream_id, version)` **is** the optimistic concurrency check: a second writer appending at the same expected version gets a unique violation, which the store turns into a concurrency error for the caller to retry.

`occurred_at` takes no default. The time is carried in on the command's `requestedAt` and written from there, so one request produces one time whatever it touches, and a replay cannot quietly stamp today's date on a five-year-old event.

Read-model tables arrive in their own migrations.

---

## 7. What gets built, in order

Each step is finished when its `.feature` files pass. Write the feature first, have it accepted, then the steps, then the code under `/src`.

### 7.1 Domain foundations

`Uuid`, `Result`, and validation. There is no clock: nothing in the domain asks what the time is, because a rule that reads the clock cannot be put to a scenario twice and get the same answer. The time arrives as a value, on the command (§7.4). Failures are reported as codes rather than sentences: a code is contract and belongs in the `.feature` file, while the wording a person reads is the caller's business and can change without breaking anything.

### 7.2 Event sourcing in the domain

`DomainEvent`; an `AggregateRoot` that records uncommitted events and rebuilds itself by replaying a stream; and the registry mapping a stored `event_type` string to the type that reads it. That registry is what keeps a five-year-old event readable: a name is never reused, and a shape only ever gains optional fields or takes a new `event_version`.

### 7.3 The mediator

In `src/application/common/`, and small:

```ts
export interface Command<TResult> {
  readonly requestedAt: Date;
  readonly _result?: TResult;
}

export interface Query<TResult> {
  readonly _result?: TResult;
}

export interface CommandHandler<TCommand extends Command<TResult>, TResult> {
  handle(command: TCommand): Promise<TResult>;
}

export interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

export interface Behaviour {
  invoke<T>(request: Command<T> | Query<T>, next: () => Promise<T>): Promise<T>;
}

export class Mediator {
  send<TResult>(command: Command<TResult>): Promise<TResult>;
  query<TResult>(query: Query<TResult>): Promise<TResult>;
}
```

Handlers register against a command or query constructor. `send` and `query` each find the one handler registered for what they were given, wrap it in that side's behaviour pipeline and run it. Two handlers for one request, or none, is an error at registration rather than a surprise at runtime.

There are two pipelines because the two sides need different things of them. A command runs **logging → validation → transaction → handler**: validation rejects it before a transaction is opened, and the transaction behaviour commits the unit of work, appends the events the aggregates recorded together with the projections those events drive, and publishes only after the commit succeeds. A query runs **logging → validation → handler** and opens no transaction, because a query writes nothing — and a `query` that needed one would be a command wearing the wrong name.

Keeping both on one mediator is what lets the web layer hold a single dependency and lets a behaviour be written once. Keeping them as two methods is what stops a caller writing through the read side by accident.

### 7.4 CQRS

A **command** changes something and returns a result carrying either error codes or a small success type. A **query** changes nothing and returns a shape built for its caller. They share the mediator and nothing else: a command works through aggregates rebuilt from the event store, and a query reads a read-model table directly. Nothing answers a query by replaying events, and nothing writes to a read model except a projection.

Every command carries `requestedAt`: the moment the request was made, decided once at the edge in the web layer and passed down. Aggregates are given it, events are stamped with it, and validators can compare against it. Nothing below the web layer reads a clock, so a scenario can set the time to whatever it needs and get the same answer every run, and a command replayed for diagnosis behaves exactly as it did the first time.

`src/application/operations/<area>/` keeps a command, its validator, its handler and its result type together, so one thing the application can be asked to do is one directory listing.

### 7.5 The event store

`EventStore` is an interface in `src/application/services/`, saying what the application wants:

```ts
appendToStream(streamId, expectedVersion, events, occurredAt, metadata): Promise<void>;
readStream(streamId): Promise<StoredEvent[]>;
```

`PostgresEventStore` in `src/infrastructure/event-store/` implements it. A stream id is the `{aggregate}/{uuid}` of §6.2 and needs nothing beside it to say what it is, so there is no stream type to pass. The interface names the two things the application does and no more: append to a stream, and read one back. It cannot read the whole log, because no command or query has any business doing so.

Projections are not checkpointed and do not chase the log. A projection runs **in the same transaction as the append that produced the events**, so a command either records what happened and updates every read model it touches, or does neither. That trades throughput for two things worth more here: a read model is never stale, and there is no half-applied middle state to reason about, no catch-up worker to supervise, and no checkpoint to drift.

Rebuilding a read model is therefore a deliberate act rather than a background one, and an infrastructure task rather than an application one: a maintenance script under `/scripts` reads the `events` table in `global_position` order and puts each event through the projections, having truncated their tables first. Projections stay idempotent so a rebuild can be run twice without harm.

### 7.6 Accounts and the three ways in

An `Account` aggregate holding an email address, an optional password credential, and external logins keyed by `(provider, subject)`. Its events: registered, password set, email address confirmed, external login linked, signed in, closed.

1. **Email address and password.** argon2id, one hash per account, never logged and never returned. A wrong password and an unknown email address report the same failure and take the same time.
2. **Google.** OIDC. Browsers go through a redirect with PKCE and `state`; mobile apps post the `id_token` their native SDK obtained. Both verify against Google's JWKS and match on the `sub` claim — never on the email address, which can change hands where a subject cannot.
3. **Facebook.** OAuth 2.0, then a Graph `/me` call for the id and, where granted, the email address. Facebook may withhold it entirely, so nothing may require an account to have one.

What happens when a Google sign-in arrives carrying the email address of an existing password account is a security decision, not an implementation detail. It gets its own scenarios and its own acceptance.

### 7.7 Two ways of holding a session

- **Browser:** an opaque session id in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie, stored hashed in a `sessions` table. State-changing requests carry a CSRF token.
- **Mobile:** `POST /api/v1/auth/token` returns a signed JWT access token (short-lived, EdDSA via `jose`) and an opaque refresh token, stored hashed and **rotated on every use**. A refresh token presented twice means it leaked, so the whole family is revoked.

Both arrive at one `RequestContext` carrying the account id and its permissions. Nothing below the web layer knows which door was used.

### 7.8 The web tier

`src/web/server.ts` is the composition root and the only file outside `infrastructure` naming a concrete implementation. It builds the container, registers handlers with the mediator, and mounts:

| Mount                | Serves                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `/api/v1/*`          | JSON. Mobile apps and the admin SPA. Bearer token or session cookie |
| `/auth/*`            | Sign-in, sign-out, OAuth redirect and callback, token and refresh   |
| `/assets/*`          | `/assets` — css and images, hashed filenames, long cache            |
| `/admin`, `/admin/*` | The built SPA; every path falls back to its `index.html`            |
| `/*`                 | Server-rendered public pages                                        |

A public page is a module exporting the query it needs and a function returning HTML. It sets `ETag` and `Cache-Control` and works with JavaScript switched off. The admin SPA builds from `src/web/admin/` into `dist/admin/`; in development Vite's dev server proxies `/api` and `/auth` to Fastify.

Errors map in one place: a failed result becomes `422` carrying its codes, an unknown route `404`, and anything unhandled `500` with a correlation id written to the log and nothing else said to the caller.

---

## 8. Cucumber

`cucumber.json`:

```json
{
  "default": {
    "import": [
      "specs/**/*.steps.ts",
      "specs/support/**/*.ts",
      "specs/infrastructure/support/**/*.ts"
    ],
    "paths": ["specs/**/*.feature"],
    "format": ["progress-bar", "html:reports/cucumber.html"],
    "formatOptions": { "snippetInterface": "async-await" }
  }
}
```

- The globs match by extension at any depth, which is what lets a `.feature` and its `.steps.ts` share a folder.
- Undefined and pending steps fail the run, so an unimplemented feature file cannot report green.
- There is no `loader` entry: Cucumber forwards it to Node's deprecated `--loader` flag, which tsx rejects. tsx is applied by the npm script instead, running Cucumber's bin through it, so steps execute as TypeScript with no build step.

### 8.1 Scenarios that need a database

Most scenarios reach nothing outside the process and run on a machine with no Postgres anywhere near them. Those that do are tagged `@postgres`, so `npm run test:nodb` is the fast loop while working on anything else.

Each `@postgres` scenario gets a database of its own, created and migrated in a `Before` hook and dropped in an `After` hook. Scenarios cannot share one: two of them writing the same tables would pass or fail according to the order they ran in. Any database left behind by an interrupted run is cleaned up at the start of the next one, matched by its name prefix.

That harness lives in `specs/infrastructure/support/`, not `specs/support/`, because it reads the configuration and reaches infrastructure, and `specs/support/` is loaded by every spec in the repository and may not.

### 8.2 Gherkin conventions

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
npm pkg set scripts.dev="tsx watch src/web/server.ts"
npm pkg set scripts.dev:admin="vite"
npm pkg set scripts.dev:setup="node scripts/dev-setup.mjs"
npm pkg set scripts.typecheck="tsc --noEmit && tsc --noEmit -p src/web/admin"
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.test="npm run test:features"
npm pkg set scripts.test:features="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js"
npm pkg set scripts.test:nodb="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags \"not @postgres\""
npm pkg set scripts.test:db="tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags \"@postgres\""
npm pkg set scripts.db:up="docker compose up -d --wait && npm run dev:setup"
npm pkg set scripts.db:down="docker compose down -v"
npm pkg set scripts.db:migrate="tsx src/infrastructure/database/migrate-cli.ts"
```

Working on one feature:

```bash
npm run test:features -- specs/domain/accounts/account/Account.feature
npm run test:features -- --tags "@wip"
npm run test:nodb
```

---

## 11. README and LICENSE

### README.md

Written for whoever arrives at the repository knowing nothing: what this is, how to get it running, and where to look next. It is not this document. `SETUP.md` says how the repository was built and why; the README says how to use it, and links here for the rest.

It is short on purpose. Anything that has to be kept in step with the code — the list of operations, the shape of an endpoint — belongs in a `.feature` file, which cannot go stale without the build going red.

````markdown
# next.croquetscores.com

Croquet Scores provides tournament managers with tools to record match scores and enables individuals to publish commentary to the public site. Croquet tragics can follow along with the action as events unfold.

## Running it

```bash
npm ci
npm run db:up    # Postgres in Docker, and a .env if there is not one
npm run dev      # the server on http://localhost:3000
npm run dev:admin # the admin SPA, proxying to it
```

## The specifications

Behaviour is specified in Gherkin under `/specs`, and those specifications are
the tests. A feature and its step definitions share a folder.

```bash
npm test         # everything
npm run test:nodb # everything that needs no database
```

## How it is put together

Four layers — web, infrastructure, application, domain — with a mediator, CQRS
and an event store written here rather than installed. `SETUP.md` explains the
arrangement and the reasons for it.

## Licence

Copyright © 2026 Tim Murphy. All rights reserved. See `LICENSE`.
````

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

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.13.0
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: npm run db:up
      - run: npm test
      - if: always()
        run: npm run db:down
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: cucumber-report
          path: reports/cucumber.html
```

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
