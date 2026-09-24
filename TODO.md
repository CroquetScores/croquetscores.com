# TODO.md

Four kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Waiting on a dependency** is for items waiting on a dependency before they can be implemented.

**Outstanding `.feature` files** are the specifications that have been accepted and not built, in the order they can be built. A file leaves the list when its scenarios pass.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

### Changing a password


### Moving to another email address

- **Domain.** An account cannot yet move to another address. `account/change-email-address/changeEmailAddress.feature` says how it will, recorded as an event holding the new address and its hash; written, not yet accepted.
- **Application.** `ChangeEmailAddress.feature` says how a reader signed in asks to move, and confirms it with a link sent to the new address; written, not yet accepted, and to be built after the domain's and the read model's.
- **Application.** Whether a wrong password given when asking to move should count toward the sign in limits, as it does when changing a password, is not decided.
- **Application.** Asking to move emails the new address, and nothing limits how often, as registering limits how often an address is emailed. It is asked only signed in and with the account's password, so it is not the open door registering was, but it is a way to fill somebody's inbox.
- **Infrastructure.** Whatever finds an account by its address cannot follow one that moves. A rule in `AccountsByEmailAddress.feature` says how it will, rebuilding included; written, not yet accepted.
- **Web.** `change-email-address/changeEmailAddress.feature` says what the change email address page, and the page its link opens, do; written, not yet accepted. The account menu already offers the page, and it answers nothing yet.
- **Web.** Two scenarios in `changeEmailAddress.feature` say nothing is queued to be sent, and in a browser something always is: the scenarios make their confirmed accounts by registering them, which queues a link to confirm. Changing a name and changing a password left the saying to the operation's feature; these want the same.
- **Web.** `Email.ConfirmNewEmailAddress`, `Email.AlreadyHasAnAccount` and `Email.EmailAddressChanged` are named in `emailWriter.feature` and want their words in every catalogue. `Email.AlreadyHasAnAccount` may turn out to be `Email.AlreadyRegistered` said differently; whether one email can serve both is not decided.

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
