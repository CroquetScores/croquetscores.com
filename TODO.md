# TODO.md

Four kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Waiting on a dependency** is for items waiting on a dependency before they can be implemented.

**Outstanding `.feature` files** are the specifications that have been accepted and not built, in the order they can be built. A file leaves the list when its scenarios pass.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

- **A mail provider** for sending real email, and its settings. `FileEmailSender` stands in until then.

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

## Known problems

### The cross-site guard will refuse an OAuth callback that posts

**Where:** `src/web/common/crossSite.ts` — from PR #10.

**What will go wrong.** Every `POST`, `PUT`, `PATCH` and `DELETE` is refused with `403 Request.CrossSite` when the browser says it came from another site. Some identity providers return a signed-in user by having the browser post a form back from the provider's own domain — `response_mode=form_post` in OpenID Connect. That post arrives with `Sec-Fetch-Site: cross-site`, because it is one, and it would be refused. The reader would be sent to the provider, sign in successfully, and land on an error page.

**Why it has not yet.** Signing in is with a password only, posted from this site's own page. The Google and Facebook flows planned in `SETUP.md` §7.6 redirect back with a `GET`, which the guard never looks at.

**What to do.** Whoever builds sign-in: if any provider is configured to post its callback, that one route needs exempting from the guard, and the exemption should name the route rather than loosen the rule. A `POST` callback is also a place where a forged request would matter a great deal, so the exemption is only safe alongside the checks the flow already requires — the `state` parameter matched against what was issued, and the token's signature and audience verified. Add a scenario that posts to the callback cross-site and expects it through, and another that posts to any other route cross-site and expects it refused.

---

### Signing in with Google as the account is forgotten fails as the site failing

**Where:** `src/application/operations/accounts/SignInWithGoogleHandler.ts`, where an account is found by its Google account — from the review of PR #100.

**What will go wrong.** A signing in with Google finds the account linked to that Google account, and then waits its turn at holding it. If the account is being forgotten meanwhile, the hold waits for the forgetting to finish, and the account it loads is forgotten. `account.signIn` refuses with `Account.Forgotten`, which is not a `SignInWithGoogleRefused`, so the callback in `src/web/auth/google.ts` throws it on, and the reader lands on an error page instead of being told what an account nobody has is told. Signing in with a password had the same gap and was closed in PR #100: it refuses an account forgotten while it was not held as it refuses an address with no account.

**Why it has not yet.** It needs someone to sign in with Google in the moment between their account being found and its forgetting being done, and forgetting an account is asked for by its owner.

**What to do.** After the hold and the load, treat a forgotten account as a Google account linked to nothing: carry on as if `byGoogle.find` had found nothing, or refuse as that path would. Add a scenario that forgets the account while a signing in with Google to it is held back, and expects the reader not to see the site fail.

---

## Outstanding .feature files

None.
