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

### A field the browser fills in has never been looked at

**Where:** `assets/site.css`, the two places that name `:autofill` under `.field-box` — from PR #28.

**What will go wrong.** A browser that fills in a saved email address and password does two things to a dialog's field that nothing here has seen happen. It paints the input its own tint, which under a label on the panel's colour reads as a patch rather than a field. And it can fill the field in before anyone has touched the page, in which state the input may still count as showing its placeholder — the one way the stylesheet knows a field is empty — so the label would stay at rest, lying over the address that was filled in. The stylesheet answers both: an inset shadow in the panel's colour laid over the tint, and `:autofill` named beside the blank placeholder among the reasons a label lifts. Both were written from what browsers are known to do, not from watching one do it.

**Why it has not yet.** Until registering and signing in were real, no browser had anything saved to fill in. They are real now, so the check below is due and has not been done. It also cannot be specified: a scenario cannot make the browser fill a field in for itself, and typing into the field, which a scenario can do, shows neither problem. A scenario that typed and then checked the background was written with PR #28 and removed in its review, because it passed with the answer deleted.

**What to do.** Save a login in Chrome, Firefox and Safari, open the dialog afresh in each, and look: the label should be on the top border from the moment the page appears, and the field should be the colour of the dialog around it. If a browser needs its own spelling — older Chrome and Safari know the tint only as `:-webkit-autofill` — add it inside the same `:is()`, which drops what a browser does not know and keeps the rest.

---

## Outstanding .feature files

None.
