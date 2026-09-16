# next.croquetscores.com

Croquet Scores provides tournament managers with tools to record match scores and
enables individuals to publish commentary to the public site. Croquet tragics can
follow along with the action as events unfold.

## Running it

```bash
npm ci
npm run db:up     # Postgres in Docker, and a .env if there is not one
npm run dev       # the server on http://localhost:3000
npm run dev:admin # the admin SPA, proxying to it
```

## The specifications

Behaviour is specified in Gherkin under `/specs`, and those specifications are
the tests. A feature and its step definitions share a folder.

```bash
npm test          # everything
npm run test:nodb # everything that needs no database
```

## How it is put together

Four layers — web, infrastructure, application, domain — with a mediator, CQRS
and an event store written here rather than installed. `SETUP.md` explains the
arrangement and the reasons for it.

## Licence

Copyright © 2026 Tim Murphy. All rights reserved. See `LICENSE`.
