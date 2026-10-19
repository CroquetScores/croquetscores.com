# Brief: removing duplicate code, one layer at a time

Read `AI.md` first and work to it. This brief says what is different about this job.

## The job

Remove duplicate code from one layer of `src/`. Nothing else. Behaviour does not change, so no `.feature` file changes. If one has to, the change was not a pure refactor: stop and say so.

Anything else you notice that is wrong goes in your report, not in the diff (AI.md §8).

## Order

Inside out, and the next layer does not start until the one before it is merged, because it would be rebasing onto shared types that are still moving.

1. `src/domain` (in progress in another session)
2. `src/application`
3. `src/infrastructure`
4. `src/web`, split by area (admin, public pages, shared view helpers), one session each
5. `src/import-ravendb`

## Finding duplicates

Run the detector over your layer only:

```bash
npx --yes jscpd@4 src/<layer> --min-lines 8 --min-tokens 70 \
  --format typescript,tsx,javascript --ignore "**/*.d.ts" \
  --reporters json,console --output <scratchpad>/jscpd
```

Work from the largest clone down. Then lower `--min-tokens` (to 40, say) for near-duplicates, and read for the kind a detector cannot see: the same rule written two different ways.

Decide where the shared code lives before writing it:

- A duplicate between two layers belongs in the inner one.
- A duplicate between siblings belongs in that layer's `common/`.
- If ESLint objects, the home is wrong. Question the design, not the rule (AI.md §5).

Leave alone anything that only looks alike. Two things that change for different reasons should stay two things, and a comment saying so is worth writing.

## Baseline (main, 2026-10-19)

80 exact clones, 1,144 duplicated lines, 1.69% of 67,530. No clone crosses a layer boundary at this threshold.

| Layer          | Clones | Lines |
| -------------- | -----: | ----: |
| web            |     33 |   606 |
| application    |     35 |   437 |
| infrastructure |      7 |   108 |
| domain         |      3 |    48 |
| import-ravendb |      2 |    25 |

Exact clones are the floor, not the whole picture. Expect more at a lower threshold.

Largest clusters, to start from:

- **web/admin**: the team players page and the tournament players tab (`.../teams/{team-slug}/view/players/players.tsx` and `.../view/tabs/players/players.tsx`) share about 100 lines across five clones. The modal dialogs (`player`, `team-player`, `team`, `competition`, `test`, `score`) repeat each other. The `view.tsx` files for tournament, competition, team and test share about 25 lines each.
- **web/public**: `changeCommentaryTitle.ts` and `startCommentary.ts`; `forgetAccount.ts` and `setNewPassword.ts`; `year.ts` and `yearSport.ts`.
- **application**: `ConfirmEmailAddressValidator` and `RegisterAccountValidator` (32 lines); `GamesOfCompetitionHandler` and `PlayersOfCompetitionHandler`. 35 clones in all.
- **infrastructure**: `TournamentsByAccount` and `TournamentsByWebsite` read models.
- **domain**: `TournamentCreated` and `TournamentUpdated` events.

## Safety

- Run the AI.md §6 gate: `npm run typecheck`, `npm run lint`, `npx prettier --check .`, `npm run test:changed`.
- The scenarios are the net. If code you are merging has no scenario covering it, say so rather than refactor blind. Write the scenario first, and get the `.feature` accepted before the code (AI.md §1).
- Break the merged code on purpose once and watch its scenario go red, then put it back.
- Anything under `src/domain/common/`, `src/application/common/` or `specs/support/` gets a full `npm test`.
- `web` work: run `npm run test:browser` by hand. CI does not.
- Say plainly what was not run.

## Commits

One cluster to a commit, in paragraphs: what was duplicated, where the shared code went and why there, what was checked. Nothing is staged, committed or pushed unless asked, each time (AI.md §8).

## Report

At the end: clusters merged, clusters deliberately left and why, scenarios missing, the jscpd figure before and after, and anything else noticed that was out of scope.
