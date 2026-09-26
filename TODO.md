# TODO.md

Four kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Waiting on a dependency** is for items waiting on a dependency before they can be implemented.

**Outstanding `.feature` files** are the specifications that have been accepted and not built, in the order they can be built. A file leaves the list when its scenarios pass.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

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

### src/domain/aggregates/accounts

From a review of the directory on 2026-09-26. Ordered by how much each is worth. None changes what the site does, except where the item says so.

- **Put the two refusals every change begins with into one.** Seven of `Account`'s methods begin `#refuseOnceForgotten(); #refuseUntilConfirmed();`, and the comment above them says the order matters: a forgotten account says it is forgotten whether or not it was confirmed. One `#refuseUnlessInUse()` holding both would keep that order in one place rather than seven. `hashPasswordAgain`, `removeRole` and `forget` still ask less, and keep calling what they ask for by itself.

- **Let the account's refusal speak for linking another Google account.** `SignInWithGoogleHandler` checks `account.googleSubject` against the subject before calling `linkGoogleAccount`, which makes the same check and refuses with `Account.GoogleAccountAlreadyLinked`. The rule is written twice, once in the domain and once in the application, and the two can drift. The handler could catch the account's refusal and throw `SignInWithGoogle.LinkedToAnother` instead. The check is not needed before `confirm` either, since an account not yet confirmed can never have been linked.

- **Ask whether `passwordImported` is wanted.** Nothing under `/src` reads it. Whether a hash is made again on signing in is decided by the hasher's `remake`, from the hash itself, and only the scenarios in `SignIn.steps.ts` and `Account.steps.ts` ask the account. Either something should decide by it, or the state and its getter go, and the scenarios say what they want by whether the hash is made again. This is a question for whoever owns the feature before it is a refactor.

- **Ask for a role by the role.** `isAdministrator` and `isWorldRankingOfficer` are a getter for each role in `value-objects/Role.ts`, so every role added needs one more. `hasRole(role)` would need none. Only `Account.steps.ts` asks either today, so it costs little now and more once pages begin asking.

- **Correct what `EmailAddress.equals` says.** Its comment says two addresses are the same when they differ "only in case", but it compares `comparable`, which puts each letter into one Unicode form as well. The class's own comment has it right.

Seen along the way, and wider than this directory: the refusal class `Account.ts` declares (a code, a name and a message, with a cause sometimes) is written out again about twenty-five times across `/src`. A generic base in `src/domain/common/` would save the boilerplate, but each class is small and read by `instanceof`, so it is probably not worth the churn.
