# next.croquetscores.com

Croquet Scores provides tournament managers with tools to record match scores and
enables individuals to publish commentary to the public site. Croquet tragics can
follow along with the action as events unfold.

## Running it

```bash
npm ci
npx playwright install chromium # the browser some scenarios drive
npm run db:up                   # Postgres in Docker, and a .env if there is not one
npm run dev                     # the server on http://localhost:3000
npm run dev:admin               # the admin SPA, proxying to it
```

## The specifications

Behaviour is specified in Gherkin under `/specs`, and those specifications are
the tests. A feature and its step definitions share a folder.

```bash
npm test          # everything, so a database and a browser are both needed
npm run test:nodb # everything that needs no database
```

Four things pass before anything here is called done: `npm run typecheck`,
`npm run lint`, `npx prettier --check .` and `npm test`.

## How it is put together

Four layers — web, infrastructure, application, domain — with a mediator, CQRS
and an event store written here rather than installed.

| Document    | What it says                                                      |
| ----------- | ----------------------------------------------------------------- |
| `AI.md`     | How work is done here, for people and for agents. Read this first |
| `SETUP.md`  | How the repository is built, and why it was built that way        |
| `STYLE.md`  | What things are called, and what the scales are                   |
| `LAYOUT.md` | What the site looks like                                          |
| `TODO.md`   | What is known to be wrong, and what to do about it when it bites  |
| `BETA.md`   | What the beta's testers are asked to do, to paste into an email   |

## Licence

Copyright © 2026 Tim Murphy. All rights reserved. See `LICENSE`.
