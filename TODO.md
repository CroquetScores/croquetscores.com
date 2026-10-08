# TODO.md

Four kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Waiting on a dependency** is for items waiting on a dependency before they can be implemented.

**Outstanding `.feature` files** are the specifications that have been accepted and not built, in the order they can be built. A file leaves the list when its scenarios pass.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

Nothing

### Event shape after live

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

### Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

---

## Known problems

### An old address with letters in another script fails where it is sent on

**What goes wrong.** A slug keeps letters of any script (`Slug.feature`), so a tournament or a player can be found at an address such as "/2026/ac/кубок" or "/2026/ac/spring-open/players/李小龍". Where a tournament has moved on from an address, its pages send a reader on with a 301 whose Location is that address as it is, not encoded (`tournament.ts`, `players.ts`, `player.ts`, `teamSummary.ts`), and Fastify refuses a Location with a character outside Latin-1, answering with a server error instead. The commentary pages encode theirs (`encodeURI`), since a commentary's title is the likeliest to be written in another script, and a review found them failing on it.

**Why it has not happened.** It needs a tournament or a player named in another script, and the tournament then moved to another year or sport. The names brought over from the old sites are in Latin letters.

**What to do when it does.** Nothing is lost: the reader is shown an error where they would have been sent on, and the address the tournament is at now still works. To stop it, put each of those redirects' addresses through `encodeURI` as the commentary pages do, with a scenario for each in a script other than Latin.

### A test's games and its tournament are saved apart

**What goes wrong.** A test's games are kept in the competition's own stream, and whether it has any decides what can be done to the tournament: a test with games in use is not archived, keeps its teams, and keeps its expected matches and best-of from going below what has been played; a team player who has played is not archived. Archiving a test (`ArchiveCompetitionHandler`), updating one (`UpdateTestHandler`) and archiving a team player (`ArchiveTeamPlayerHandler`) read the competition's games and then save the tournament. Adding a game (`AddGameHandler`) reads the tournament and then saves the competition. Neither waits for the other, so a manager archiving a test as a scorer adds its first game can leave an archived test with a game in use, and the same goes for changing its teams or archiving the player who has just played.

**Why it has not happened.** It needs the two to land within the same moment, and a test is set up before its games are entered.

**What to do when it does.** Restore the test, or put the player or the teams back, and archive the game first. To stop it, either take a lock on the tournament's stream in `AddGame` (and in correcting and restoring a game) so that it waits for any change to the tournament, or have those three handlers append to the competition's stream as well, so that its version check refuses one of the two.

### A tournament or competition name with no letter or digit fails where its slug is made

**What goes wrong.** A tournament is found at a slug made from its name, and a block, a knockout or a Swiss at a slug made from its own (`Tournament.#addressFor`, `Tournament.#competitionSlugFor`). A name with no letter or digit in it, such as "?????" or "???", makes no slug, and `Slug.fromName` throws `Slug.Empty`. Neither `TournamentName` nor `CompetitionName` refuses such a name first, so it passes validation, and the throw comes from inside the handler: creating or updating the tournament, or adding or updating the competition, answers the admin with a server error rather than a message beside the name. A tournament player, a team player, a team's short name and a commentary's title each refuse one already, as `…NoLetterOrDigit`, for this reason; a team's name does not need to, since a team is found by its short name.

**Why it has not happened.** Nobody has named a tournament or a block with punctuation alone. The names brought over from the old sites all have letters in them.

**What to do when it does.** Nothing is kept, since the throw comes before anything is recorded; the reader is told something went wrong and can type a name with a letter in it. To stop it, give `TournamentName` and `CompetitionName` a `NoLetterOrDigit` rule, as `CommentaryTitle` has, with words in both catalogues, and specify it in their features and in a scenario each of creating a tournament and adding a block.

---

## Outstanding .feature files

None.

---

## Waiting on a dependency

### Rotating encryption keys

Depends on: /admin SPA

`AccountKeys.changeSiteKey` re-encrypts every account's key and every queued email with no account for a new `ACCOUNT_ENCRYPTION_KEY`, but nothing calls it: a script under `scripts/` is wanted, run with the old key and the new. `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` cannot be changed at all, since the hash is kept in every registering event; change it and rebuild, and no account is found by its address. Say it is never changed, or keep every key the hash has been made with and find an address by each (from the review of `account-keys`).

### Rebuild read models

Depends on: /admin SPA

Going to use SPA instead of /scripts.

- **A script to rebuild a read model.** `AccountsByEmailAddress.rebuildFrom` makes the table again from every event kept, and only the scenarios call it: `readAll` is on the Postgres store and not on the `EventStore` the application hands out, so nothing in the running site can rebuild anything. SETUP.md §5 says rebuilding is a maintenance script's under `scripts/`; that script is what is missing (from the review of `account-keys`).

---

## Refactor

None.

---
