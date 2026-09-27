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

- One thing to consider: SETUP.md §7.2 still says a stored event's shape only ever gains optional fields, with no green-field exception. That rule is why the review flagged these changes, and it will keep misleading anyone who reads it. I could add a line there saying the rule starts applying once the site holds real data.

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

## Q & A

- **Where Manage, Edit and Scores go.** Manage may just be the same address as the name, and none of those screens exists yet.

Manage and Scores goto to same as clicking tournament admin/{year}/{sport}/{slug}

Edit goes to admin/{year}/{sport}/{slug}/edit

- **Whether the chosen year goes in the address,** like `/admin/2025`, so the back button and links keep it. I also didn't say which years can be chosen.

Yes

- **What happens if nobody is signed in.** The existing `admin.feature` scenarios open the admin signed out, so sending readers to sign in would change those too.

User must be signed in to see anything in /admin

- **Whether the list covers only the website being served,** so a reader on Gateball Scores sees only their Gateball tournaments.

Yes only the website

- **Whether a screen reader is told a row is archived.** Strikethrough alone isn't announced.

Yes

- **Month names in the reader's language.** The admin's words aren't in any catalogue yet.

Yes
