# next.croquetscores.com

Croquet Scores provides tournament managers with tools to record match scores and
enables individuals to publish commentary to the public site. Croquet tragics can
follow along with the action as events unfold.

## Running it

```bash
npm ci
npx playwright install chromium # the browser some scenarios drive
npm run db:up                   # Postgres in Docker, and a .env if there is not one
                                # (or use a Postgres you have: SETUP.md §6)
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

- `AI.md`: How work is done here, for people and for agents. Read this first
- `SETUP.md`: How the repository is built, and why it was built that way
- `STYLE.md`: What things are called, and what the scales are
- `LAYOUT.md`: What the site looks like
- `BETA.md`: What the beta's testers are asked to do, to paste into an email

To contribute, read `CONTRIBUTING.md` first, and then `CLA.md`, the agreement
every contributor signs. Open an issue before you start, however small the
change.

## Licence

Copyright © 2026 Tim Murphy. Free software under the GNU Affero General Public
License, version 3 only (`AGPL-3.0-only`): see `LICENSE`.

Anyone may read, use and change it. Anyone who runs a changed version as a
website must offer the people using it the source of what they run, under the
same license. That is the point of the Affero license over the ordinary GPL,
which asks nothing of a website that is only used over a network.
