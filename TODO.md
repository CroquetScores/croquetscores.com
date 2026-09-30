# TODO.md

Four kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Waiting on a dependency** is for items waiting on a dependency before they can be implemented.

**Outstanding `.feature` files** are the specifications that have been accepted and not built, in the order they can be built. A file leaves the list when its scenarios pass.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

- Tournament finish date can not be greater than current year + 1.

- Feature files for api

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

- The admin's first modal dialog (STYLE.md §5c), adding players from a tournament's page, wants its behaviour in its feature file: focus goes to the first field (or first button) on opening and back to whatever opened it on closing; Cancel closes it keeping nothing the other buttons have not already kept, and Escape does the same; opening, closing and using it leave the address as it was; and where it stays open after doing something it says what it did in a live-region status message above the fields.

### Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

---

## Known problems

None.

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

## Team Competitions

A tournament who's format is not `Standard` its a team tournament.

The address for viewing/editing a team in /admin is the same but they tabs are different. The tabs are:

- Teams
- Tests
- Managers
- Scorers

The secondary nav bar is:

Tournament
then a link per test

### Teams tab

Has the same behaviours as Players tab for Standard tournament with these changes:

- Add Player button is Add Team button

#### Add/Edit Team

The Add Team dialog has the following fields:

Name (required: the full name of the team)
Short Name (required: the short name for the team which is used by the secondary nav bar)
Flag (optional)

#### View Team

Viewing a team shows the list of players and works in the same way as the Players tab in a Standard tournament.

#### Tests tab

Add Test button
List of tests in defined order

##### Add Test

This creates a test between two teams:

Team A (drop down list)
VS
Team B (drop down list)
Starts (date: must be within date range of tournament)
Finishes (date: must be within date range of tournament)

##### View Test

Add Score button
Lists the scores
