# Brief: removing duplicate code, one layer at a time

Read `AI.md` first and work to it. This brief says what is different about this job.

## The job

Remove duplicate code from one layer of `src/`. Nothing else. Behaviour does not change, so no `.feature` file changes. If one has to, the change was not a pure refactor: stop and say so.

Anything else you notice that is wrong goes in your report, not in the diff (AI.md §8).

## Order

Inside out, and the next layer does not start until the one before it is merged, because it would be rebasing onto shared types that are still moving.

1. `src/domain` (completed)
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

## Status

Updated in the commit that does the work, so each entry names what that commit merged.

### application (done, two clusters left for a later pass)

Baseline at `--min-lines 6 --min-tokens 40`: 183 clones, 1,819 duplicated lines, 10.22% of 17,791. Most of what is left at that threshold is the import block at the top of every handler and the one-class-to-a-command shape (a command, its handler, its constructor taking the same repositories), which is by design and is left alone.

After: 170 clones, 1,628 duplicated lines, 9.19% at the same threshold.

Scenarios were run against a local Postgres 16 started for the purpose, not the compose one.

1. Accounts: the hour, `shiftedBy`, the inbox limit and the confirmation link's lifetime were each defined in up to seven handlers. Now `common/moments.ts`, `accounts/emailsAnHour.ts` and `confirmationLinks.ts`. 330 scenarios in `specs/application/operations/accounts` pass, and go red when the limit or the hour is broken.
2. Validators: eight places asked a value object about a field by making it and catching the rule it threw (six account validators, `brokenBy` in `tournamentOperations.ts`, and two copies of `ruleBrokenBy`). Now one `common/brokenBy.ts`, which the commentaries validators had been reaching into `tournaments/` for. Accounts (330), commentaries (40) and tournaments (1,505) scenarios pass, and go red when `brokenBy` reports nothing. Breaking only the field it names changes nothing, because scenarios assert the code and not the field (AI.md §3); noted, not changed.
3. Public pages of a tournament: the Swiss, knockout, block and test handlers each found the competition a reader asked for by its slug, refused when there was none, and refused when it was of another kind, in the same seventeen lines. Now `competitionOfKindForReaders` in `tournamentForReaders.ts`. Each call still gives its refusal codes whole, so they stay searchable and checked against the code union. 1,505 tournaments scenarios pass, and 222 go red when the kind check is inverted.
4. Manager and scorer pages: the tournament, tournament-to-change, team and competition page handlers each found the tournament at an address or refused, and each refused an archived one, with the same codes and sentences. Now `tournamentAtAddress` and `unlessArchived` in `tournamentOperations.ts`; each handler still makes its own check of who may see the page between the two, because the order of refusals is behaviour. These pages are covered by the admin `@browser` features and not by `specs/application`, whose 1,505 scenarios do not notice the change. The four admin view and edit features (195 scenarios) pass in a real browser. Ignoring archived tournaments turned 1 of the 22 scenarios in the team view feature red (the others were not run broken).
   To run `@browser` scenarios in this container, Playwright 1.64 wants Chromium revision 1248 and only 1194 is installed, so the expected headless shell path was linked to the installed one. That is a change to the container and not to the repository.
5. Competition lookups: the competition operations and the players-of-test and players-of-competition queries each found a competition of a tournament by its id and refused when it was missing (four copies), refused when it was archived (two), and refused an archived tournament (two more, now `unlessArchived`). Now `competitionFound` and `competitionInUse` in `competitionOperations.ts`. 302 scenarios in `specs/application/operations/competitions` pass; ignoring an archived competition turned 12 red and ignoring an archived tournament 11.
   Left alone and worth a look: `competitionOperations.ts` has a private `managedOrScoredBy` with the same name as the one in `tournamentOperations.ts`. They refuse with different codes (`Tournament.NotAManagerOrScorer` against `Tournament.NotAManager`) and return different things, so merging them would change what a reader is told. Whether the codes should differ is a decision for someone who knows what the pages do with them.
6. Accounts, the inbox limit: five handlers counted the emails written to an inbox in the last hour against the limit, in the same two lines each. Now `inboxIsFull` beside the limit in `emailsAnHour.ts`. The administrator's report of an unreachable service asks for none in the hour and not for fewer than three, so it keeps its own. 330 account scenarios pass; making the limit one more than it is turned 15 red.

Left in the application layer, for a later pass: the handlers that read a link and then set a password (confirming, setting a new one, changing one) share about fourteen lines, and the Swiss, knockout and block public pages share about twelve lines of ranking. Neither was merged here because each would be a larger change than the others and wants its own look.

### infrastructure (done)

Baseline at `--min-lines 6 --min-tokens 40`: 23 clones, 285 duplicated lines, 3.97% of 7,177.

The `project` and `rebuildFromStream` methods repeated across the nine read models are most of what the detector reports. They come in two shapes (events one at a time, or all together), each with its own comment saying why that read model's rebuild is safe in any order, so a base class would take the comments' place with more indirection than it removes. Left alone.

1. `TournamentsByAccount`: the row type and the mapping of a row to a tournament were written out three times, and the mapping of a row to a year three times. Each SQL statement is left as it was. 62 scenarios pass; naming the wrong part turned 1 red and dropping a year turned 8 red.
2. Backup and restore: `withoutAddress`, which hides the database's address and password from what a failure says, was written out in both command lines. Now `maintenance/withoutAddress.ts`. The copies differed: backup also hid the bare host name and accepted no address at all; restore did neither. One behaviour change follows: restore now hides the host name as well, which can only say less. 56 backup and 42 restore scenarios pass.
   Not covered, and not added because a scenario means changing a `.feature` (AI.md §1): nothing in the restore scenarios notices if the hiding is removed altogether, and nothing in either set notices if the password is not hidden. Removing the hiding turned 2 backup scenarios red; removing the password from the parts hidden turned none red.

After: 18 clones, 235 duplicated lines, 3.28% at the same threshold. Left as they are on purpose: the `pgDump` and `pgRestore` runners and the account event sealing's `seal` and `open`, which mirror each other with their own error classes and messages.

### web (in progress)

Baseline at `--min-lines 6 --min-tokens 40`: 170 clones, 1,916 duplicated lines, 7.45% of the layer. These are browser features, so the admin is rebuilt (`npm run build:admin:alongside`) before they are run, and they are run with a throwaway cucumber configuration naming only the features concerned.

1. Admin tabs: six components (the tournament's players tab, the team's players, the competition's scores tab, and the teams, notes and competitions tabs) each kept a list, a count of askings and a count of the answered one, and had the same effect asking the API and the same function asking again. Now `useListed` in `src/web/admin`. The 412 scenarios in the six tabs' features pass; making asking again do nothing turned 9 of the 92 in two of them red.
2. Dialogs: six modal dialogs (team player, carry forward, score, competition, team, test) drew what was refused about the dialog as a whole in the same fourteen lines. Now `DialogProblems` beside `Field`. The player dialog, the note panel and the tournament form draw theirs differently on purpose (no codes, codes on each line, a block that takes the focus) and keep their own. The 597 scenarios in the six dialogs' features pass; dropping the codes turned 9 red.
3. Public form pages: six places across five pages (change name, start commentary, change commentary title, edit comment twice, and the commentary page) asked "was the account forgotten while the form was open" in the same six lines. Now `accountForgotten` beside `toSignIn` in `public/profile.ts`. 203 scenarios in the six features concerned ran: 201 pass and 2 fail, and the same 2 fail on the code as it was before this change (`commentary.feature`, "A comment kept but not answered is not sent again" and "A comment shown by the comments asked for again is not added a second time"); not looked into. Making `accountForgotten` always false turned 2 red (change name and start commentary). Nothing covers it for change commentary title, edit comment or the commentary page.
4. Admin pages: the tournament, edit, team, competition and test pages each drew what the page shows when the API refused it in the same fourteen lines, with their own copy of the function turning a code into words. Now `RefusedPage` beside `HeldPage`, taking the heading and the page's fallback words. The 250 scenarios in the five pages' features pass; dropping the code from the page turned 24 red. Not merged: the tournament form's own `wordsFor` and `refusal`, which build a per-field refusal and not a page.
