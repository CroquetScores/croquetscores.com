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

### Set `CANONICAL_HOST` when the site is deployed

**Where:** `.env` on whatever serves the site; the setting is read in `src/infrastructure/config/Config.ts` and used by `src/web/common/crossSite.ts`, and by the email writer for the site's address (`emailWriter.feature`).

**What will go wrong.** When a browser does not send `Sec-Fetch-Site`, the cross-site guard judges a change by its `Origin`, compared against `CANONICAL_HOST`. Left blank, it compares against each request's own `Host` instead. Behind a load balancer or reverse proxy that rewrites `Host` to an internal name, a genuine post from this site carries `Origin: https://croquetscores.com`, arrives addressed to `app.internal`, and is refused as cross-site. And every link in every email — confirming an address, setting a new password, forgetting an account — is made from it, and left blank points at `http://localhost:3000`, where development serves: a reader following one reaches nothing, and cannot confirm, get back in or be forgotten.

**Why it has not yet.** There is no deployment. The mechanism to prevent it arrived with the review of PR #10; what is missing is the value, and it cannot be supplied until there is somewhere to supply it. For the cross-site guard it only reaches readers whose browsers are too old to send `Sec-Fetch-Site`, so the exposure is small even then. For email it would reach every reader, from the first email sent.

**What to do.** Set `CANONICAL_HOST` to the host readers see in the address bar — `croquetscores.com`, with a port only if they see one. Nothing will fail at startup if it is forgotten: the setting is optional, because development needs it blank (`SETUP.md` §6.1 explains why). So it belongs on whatever deployment checklist gets written, and near its top now that emails depend on it; and if the site ever grows a notion of which environment it is running in, a production start without it should be refused. It must never be filled from a request's `Host` to save setting it: a host is whatever the request's sender wrote, and an email link made from one can be pointed at anybody's site.

---

### Set `TRUSTED_PROXY` when the site is deployed behind a proxy

**Where:** `.env` on whatever serves the site; the setting is read in `src/infrastructure/config/Config.ts` and used by `src/web/common/trustedProxy.ts`, which decides the address the forgot password page's limit and signing in's are counted by (`trustedProxy.feature`).

**What will go wrong.** Behind a load balancer or a reverse proxy, every connection reaches the site from the proxy. Left blank, the site believes nobody and counts every reader as that one address: the tenth asking for a way back in, from anybody at all, holds every reader out of the forgot password page for the rest of the hour, and the thirtieth failed sign-in holds them all out of signing in. Both pages would then be shut to everybody, and neither says why, because a limit that explained itself would explain itself to whoever was guessing.

**Why it has not yet.** There is no deployment. On a machine with nothing in front of it — development, and the scenarios — the connection's address is the reader's, and blank is the right answer. The scenarios set it to `127.0.0.1`, which is what their browser reaches them from, so the path a deployment takes is the one they run.

**What to do.** Set `TRUSTED_PROXY` to the address or range the proxy reaches the site from — `10.0.0.0/8`, or the one address if it is fixed — and never to something wider than what only the proxy can be at. Anything that can reach the site can write an `X-Forwarded-For` for itself, so what is trusted here is exactly what may name somebody else's address. It is a value that cannot be supplied until there is somewhere to supply it, so it belongs on the same deployment checklist as `CANONICAL_HOST` above. Nothing will fail at startup if it is forgotten, because blank is legitimate; a value that is not addresses does stop the site starting, so a typo is found while somebody is deploying rather than afterwards.

---

### The theme choice may not stick in Safari during development

**Where:** `src/web/common/theme.ts`, where the cookie is set — from PR #9.

**What will go wrong.** The `theme` cookie is always `Secure`. Chromium and Firefox treat `http://localhost` and `http://127.0.0.1` as secure contexts and keep a `Secure` cookie set over plain HTTP there; Safari has historically not. A developer checking the theme control in Safari against `npm run dev` presses Dark, the page turns dark, and on the next page it is back to their machine's preference — which looks exactly like a bug in the feature.

**Why it has not yet.** Development and the browser scenarios both use Chromium, where it works. In production the site is served over HTTPS, where every browser keeps the cookie. This only reaches someone developing in Safari.

**What to do.** Nothing in the code: making `Secure` depend on the request is what PR #9's review removed, because behind a proxy terminating HTTPS the request always looks like plain HTTP and the cookie would never be `Secure` where it matters. If Safari development becomes routine, serve development over HTTPS instead — a locally trusted certificate from `mkcert` and Fastify's `https` option, behind a setting that is off by default — and note it in `SETUP.md` §6. Until then, check the theme choice in Chromium or Firefox, or confirm in Safari's own Web Inspector that the cookie was refused before treating it as a defect.

---

### A command whose commit is lost on the way may have happened after all

**Where:** `src/infrastructure/database/UnitOfWork.ts`, where a command's transaction is committed.

**What will go wrong.** If the connection goes while the commit is on its way — a failover, the database restarting, the network between them dropping — the unit of work sees the commit fail and tells the sender the command failed. But the commit may have reached Postgres and landed before the connection went, and the one connection that could say whether it did is the one that has gone. A sender told it failed tries again, and whatever the command did is done twice: a second tournament opened, a second account registered.

**Why it has not yet.** The window is narrow: the connection has to go after the commit is sent and before its answer comes back. And the commands that exist already guard against it, as **What to do** describes.

**What to do.** Nothing in the unit of work can find out, so the answer is in the commands: one that matters has to be safe to send twice. The event store already catches part of this. A retry appending to a stream the first attempt wrote to expects the version the first attempt moved past, and is refused with `EventStore.Concurrency`. What it does not catch is a command that mints a new id each time it is sent — opening a tournament, registering an account — because the retry mints a second id and writes a second stream nobody else is using. For those, the caller gives the request an id it keeps across retries, carried on the command the way `requestedAt` is, and the command records it in the same transaction as its events and refuses one it has seen before. Registering is the first such command, and carries a request id (`RegisterAccount.feature`), kept by `HandledRequests`; the account commands since it carry one too. Decide for each command after them as it is written.

---

### The application hands out its mediator's parts, and nothing in production asks for them

**Where:** the `Application` interface in `src/web/server.ts` — from PR #30.

**What will go wrong.** `Application` carries `mediator`, `validation` and `unitOfWork`, and nothing under `src` reads any of them: they are there so that the scenarios can register example handlers and validators from outside. `application.mediator` is a second way to what `server.mediator` already is, so a mediator later wrapped or decorated for some routes would leave the two disagreeing, and the scenarios testing one no route uses. And anything holding the application can take `unitOfWork` and go round the mediator — the very thing `server.feature` says must not happen, since a route that reaches past the mediator can leave out the validation or the transaction and nothing notices until a half-written command is found in the database.

**Why it has not yet.** Nothing holds an `Application` but `server.ts` itself and the scenarios, and nothing under `src` reads the three fields.

**What to do.** The real handlers are registered inside `buildApplication`, so the scenarios are the only outside caller, and a registration seam serves both: `buildApplication(config, { register })`, with `register` handed `{ mediator, validation, unitOfWork }` once, while the application is being put together. Production passes what registers the real handlers, the scenarios pass what registers the example ones, and `Application` goes back to `{ server, pool, config }`. The steps would then take the mediator from `server.mediator`, which is the way the feature says a route reaches it. The fields beside them that name what the scenarios read back — the event store, the email queue, the accounts, the sessions and the rest — are the same question, and want answering with it.

---

### The whole application is built for every scenario about its mediator

**Where:** "the application is built" in `specs/web/support/application.ts`, the Background of `server.feature` and of `requestedAt.feature` — from PR #30.

**What will go wrong.** Each of the feature's ten scenarios builds the application entire: it reads and hashes every file under `assets/`, registers the cookie, form and static plugins and every route, and makes a second pool, in order to exercise a mediator and one added route. The cost grows with the assets folder and with every scenario added to the feature, and the hashing is synchronous, so it holds everything else up while it runs. Separately, the step builds with the whole of `.env`, `CANONICAL_HOST` included. The example `POST` sends neither `Sec-Fetch-Site` nor `Origin` and is let through as things stand; a cross-site guard tightened to insist on an `Origin` would turn "A route can send a command" red for a reason that has nothing to do with it.

**Why it has not yet.** The assets are a stylesheet and little else. The cross-site guard lets a request with neither header through.

**What to do.** Nothing until it is felt. When it is, build less rather than build once: these scenarios register handlers, so they cannot share one application across a run the way `specs/web/support/browser.ts` does. Letting `buildApplication` be given assets already read, or exporting the function that puts the mediator together so the scenarios can decorate a bare server with it, would each take the cost away — and the second would stop testing the application as the server builds it, which is the point of the feature, so prefer the first. If the cross-site guard is ever tightened, give the example `POST` the headers a same-site browser sends, rather than blanking the config the step builds with.

### A rule with no words is said beside a field already said to be wrong

**Where:** the `unworded` validator in `specs/web/support/exampleForm.ts`, and `check` in `src/domain/common/validation/Validator.ts` — from the review of PR #83.

**What will go wrong.** `Validator.check` keeps a rule that reads several fields quiet where a field rule has already marked one of those fields, so that one mistake draws one complaint and nobody is pointed at a field that is not the one they got wrong. The record of which fields are marked belongs to that one call, so it cannot reach across validators, and `ExampleFormCommandValidator` asks three in turn: the range's, the passphrase's, and the example form's own unworded rules. `Example.UnwordedRange` reads the start and the end from the third of them.

So a start of `-1`, an end of `-1` and a passphrase long enough to satisfy its own rules gets "The start cannot be below zero." beneath the start field and "Something here is not right…" above the fields: two complaints about one mistake, the second naming a pair of fields where one is wrong and the other is not. `Range.EndBeforeStart` cannot do this, sitting in the same validator as the rule that marks the start, which is what "Neither field it reads is said to be wrong" in `form.feature` holds it to. The same would hold for any command validator asking several validators in turn where one of them reads across fields; none of the real ones does yet, so today this is the example form's alone.

**Why it has not yet.** No scenario types a negative start into the example form. Every one that reaches `Example.UnwordedRange` leaves the start empty or types zero or above, so there is never a marked field for the suppression to find. It is a trap for the next form scenario written with a negative start rather than something failing now.

**What to do.** Two ways, and each says something different in the table in `form.feature` that names what breaks each rule, so choose before writing either.

- Give the rule the condition it is missing — `start !== undefined && start >= 0 && start === end` — and the table gains a clause about the start not being below zero. It writes one of the range's rules into the example form a second time, where it can come to disagree with the original.
- Ask the range first — `ranges.check(command).length === 0 && ...` — and the table gains "and nothing else about the range is wrong". Nothing is written twice, but the rule then goes quiet for anything at all wrong with the range, a bad step included, which is a field it does not read.

Prefer the first. The duplication is one comparison, in a support file whose rules exist only to be broken, and the rule stays readable where it is written; the second makes an example rule depend on the whole of another validator's verdict, which is more to hold in the head than the rule is worth. What should not be done is moving the rule into the range's own validator: those rules are asked about the example requests by the validator's feature and the validation behaviour's, which hold them to the rules they have.

---

## Outstanding .feature files

None.
