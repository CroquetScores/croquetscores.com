# TODO.md

Two kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

- `top: -3px` on a dialog field's lifted label (`assets/site.css`, from PR #28) was judged by eye and is on no scale. It wants a comment saying so, and saying to look again if the border's width or `--text-sm` changes.

---

# Known problems

## The cross-site guard will refuse an OAuth callback that posts

**Where:** `src/web/common/crossSite.ts` — from PR #10.

**What will go wrong.** Every `POST`, `PUT`, `PATCH` and `DELETE` is refused with `403 Request.CrossSite` when the browser says it came from another site. Some identity providers return a signed-in user by having the browser post a form back from the provider's own domain — `response_mode=form_post` in OpenID Connect. That post arrives with `Sec-Fetch-Site: cross-site`, because it is one, and it would be refused. The reader would be sent to the provider, sign in successfully, and land on an error page.

**Why it has not yet.** There is no sign-in code. The Google and Facebook flows planned in `SETUP.md` §7.6 redirect back with a `GET`, which the guard never looks at.

**What to do.** Whoever builds sign-in: if any provider is configured to post its callback, that one route needs exempting from the guard, and the exemption should name the route rather than loosen the rule. A `POST` callback is also a place where a forged request would matter a great deal, so the exemption is only safe alongside the checks the flow already requires — the `state` parameter matched against what was issued, and the token's signature and audience verified. Add a scenario that posts to the callback cross-site and expects it through, and another that posts to any other route cross-site and expects it refused.

---

## A field the browser fills in has never been looked at

**Where:** `assets/site.css`, the two places that name `:autofill` under `.field-box` — from PR #28.

**What will go wrong.** A browser that fills in a saved email address and password does two things to a dialog's field that nothing here has seen happen. It paints the input its own tint, which under a label on the panel's colour reads as a patch rather than a field. And it can fill the field in before anyone has touched the page, in which state the input may still count as showing its placeholder — the one way the stylesheet knows a field is empty — so the label would stay at rest, lying over the address that was filled in. The stylesheet answers both: an inset shadow in the panel's colour laid over the tint, and `:autofill` named beside the blank placeholder among the reasons a label lifts. Both were written from what browsers are known to do, not from watching one do it.

**Why it has not yet.** Nobody can register or sign in, so no browser has anything saved to fill in. It also cannot be specified: a scenario cannot make the browser fill a field in for itself, and typing into the field, which a scenario can do, shows neither problem. A scenario that typed and then checked the background was written with PR #28 and removed in its review, because it passed with the answer deleted.

**What to do.** When registering or signing in is real, save a login in Chrome, Firefox and Safari, open the dialog afresh in each, and look: the label should be on the top border from the moment the page appears, and the field should be the colour of the dialog around it. If a browser needs its own spelling — older Chrome and Safari know the tint only as `:-webkit-autofill` — add it inside the same `:is()`, which drops what a browser does not know and keeps the rest.

---

## Set `CANONICAL_HOST` when the site is deployed

**Where:** `.env` on whatever serves the site; the setting is read in `src/infrastructure/config/Config.ts` and used by `src/web/common/crossSite.ts`.

**What will go wrong.** When a browser does not send `Sec-Fetch-Site`, the cross-site guard judges a change by its `Origin`, compared against `CANONICAL_HOST`. Left blank, it compares against each request's own `Host` instead. Behind a load balancer or reverse proxy that rewrites `Host` to an internal name, a genuine post from this site carries `Origin: https://croquetscores.com`, arrives addressed to `app.internal`, and is refused as cross-site.

**Why it has not yet.** There is no deployment. The mechanism to prevent it arrived with the review of PR #10; what is missing is the value, and it cannot be supplied until there is somewhere to supply it. It only reaches readers whose browsers are too old to send `Sec-Fetch-Site`, so the exposure is small even then.

**What to do.** Set `CANONICAL_HOST` to the host readers see in the address bar — `croquetscores.com`, with a port only if they see one. Nothing will fail at startup if it is forgotten: the setting is optional, because development needs it blank (`SETUP.md` §6.1 explains why). So it belongs on whatever deployment checklist gets written, and if the site ever grows a notion of which environment it is running in, a production start without it should be refused.

---

## The admin SPA ignores the reader's theme choice

**Where:** `src/web/admin/` — served as a static `index.html` from `src/web/server.ts`. From PR #9.

**What will go wrong.** A reader who has chosen Light or Dark in the public site's footer opens `/admin` and gets whatever their machine prefers instead. The public pages honour the choice because the server reads the `theme` cookie and renders `data-theme` onto `<html>`; the SPA's `index.html` is a file built by Vite and sent as it is, so there is nothing for the server to render into. It imports the same stylesheet and falls back to `color-scheme: light dark`, which follows the operating system.

**Why it has not yet.** The admin SPA is a shell with a heading and an API health check, and nobody uses it. The mismatch is visible to anyone who looks, but nobody is looking yet.

**What to do.** The cookie is `HttpOnly`, so the SPA cannot read it itself, and should not be made to: loosening that for a colour would loosen it for whatever is copied from it later. Two ways that keep it:

- Have the server render `index.html` rather than send it, putting `data-theme` on `<html>` exactly as the public pages do. This keeps the choice in one place and needs no request from the SPA, at the cost of treating one built file as a template.
- Add an endpoint the SPA asks on load — `GET /api/v1/preferences` — returning the theme, and have the SPA set `data-theme` from the answer. Simpler to build, but the page paints once in the machine's preference before the answer arrives.

Prefer the first. Whichever is chosen, the admin should also offer the same control, posting to the same `/theme`. Extend the theme feature with a scenario that chooses Dark on a public page, opens `/admin`, and expects the admin to be dark.

---

## The theme choice may not stick in Safari during development

**Where:** `src/web/common/theme.ts`, where the cookie is set — from PR #9.

**What will go wrong.** The `theme` cookie is always `Secure`. Chromium and Firefox treat `http://localhost` and `http://127.0.0.1` as secure contexts and keep a `Secure` cookie set over plain HTTP there; Safari has historically not. A developer checking the theme control in Safari against `npm run dev` presses Dark, the page turns dark, and on the next page it is back to their machine's preference — which looks exactly like a bug in the feature.

**Why it has not yet.** Development and the browser scenarios both use Chromium, where it works. In production the site is served over HTTPS, where every browser keeps the cookie. This only reaches someone developing in Safari.

**What to do.** Nothing in the code: making `Secure` depend on the request is what PR #9's review removed, because behind a proxy terminating HTTPS the request always looks like plain HTTP and the cookie would never be `Secure` where it matters. If Safari development becomes routine, serve development over HTTPS instead — a locally trusted certificate from `mkcert` and Fastify's `https` option, behind a setting that is off by default — and note it in `SETUP.md` §6. Until then, check the theme choice in Chromium or Firefox, or confirm in Safari's own Web Inspector that the cookie was refused before treating it as a defect.

---

## A command whose commit is lost on the way may have happened after all

**Where:** `src/infrastructure/database/UnitOfWork.ts`, where a command's transaction is committed.

**What will go wrong.** If the connection goes while the commit is on its way — a failover, the database restarting, the network between them dropping — the unit of work sees the commit fail and tells the sender the command failed. But the commit may have reached Postgres and landed before the connection went, and the one connection that could say whether it did is the one that has gone. A sender told it failed tries again, and whatever the command did is done twice: a second tournament opened, a second account registered.

**Why it has not yet.** There are no commands yet, only the example ones the scenarios use. The window is narrow as well: the connection has to go after the commit is sent and before its answer comes back.

**What to do.** Nothing in the unit of work can find out, so the answer is in the commands: one that matters has to be safe to send twice. The event store already catches part of this. A retry appending to a stream the first attempt wrote to expects the version the first attempt moved past, and is refused with `EventStore.Concurrency`. What it does not catch is a command that mints a new id each time it is sent — opening a tournament, registering an account — because the retry mints a second id and writes a second stream nobody else is using. For those, the caller gives the request an id it keeps across retries, carried on the command the way `requestedAt` is, and the command records it in the same transaction as its events and refuses one it has seen before. Decide which commands need it when the first real ones are written, and specify the refusal with them.

---

## A request refused for breaking its rules will be answered as though the server had failed

**Where:** `src/web/common/errors.ts`, where an error becomes a response — from the review of PR #30.

**What will go wrong.** The error mapping answers with an error's own status when it carries one, and treats everything else as the site's own fault: `500`, `{ error: "Internal" }` and a reference, or the "Something went wrong" page. A request that breaks its rules is refused with `RequestInvalid`, which carries the code `Request.Invalid` and the list of rules broken, and no status — rightly, because a status is the web's business and nothing under `src/application` should know one. So a route that sends a command breaking its rules through `request.server.mediator` tells the caller the server failed, where it should say the request was wrong and which rules it broke. Whoever typed it is owed the whole list, which is the reason `RequestInvalid` carries one, and gets a reference number instead. It is also logged as an unhandled error, so a mistyped form reads in the log like a fault.

**Why it has not yet.** No real route sends through the mediator. The only ones that do are the example routes in `specs/web/server/server.feature`, and its Rule about routes covers only a command and a query that succeed.

**What to do.** Whoever writes the first route that sends a command or asks a query: decide, in the error mapping and nowhere else, what a refusal looks like to a caller, so that no route decides for itself. That is a decision about behaviour, so it starts as a Rule, written before the code — which status `Request.Invalid` is answered with, what the body says of the rules broken, and what a public page shows where the API answers JSON. The mediator's other refusals want deciding at the same time: `Mediator.Unhandled`, `Mediator.AlreadyHandled` and `Mediator.WrongDoor` are mistakes in how the application was put together rather than in what was sent, and are probably right to stay a `500`, but that should be said rather than fallen into. Add a scenario with an example route that sends a command breaking a rule, and expect the refusal by its code, never by its wording.

---

## The application hands out its mediator's parts, and nothing in production asks for them

**Where:** the `Application` interface in `src/web/server.ts` — from PR #30.

**What will go wrong.** `Application` carries `mediator`, `validation` and `unitOfWork`, and nothing under `src` reads any of them: they are there so that the scenarios can register example handlers and validators from outside. `application.mediator` is a second way to what `server.mediator` already is, so a mediator later wrapped or decorated for some routes would leave the two disagreeing, and the scenarios testing one no route uses. And anything holding the application can take `unitOfWork` and go round the mediator — the very thing `server.feature` says must not happen, since a route that reaches past the mediator can leave out the validation or the transaction and nothing notices until a half-written command is found in the database.

**Why it has not yet.** There are no real handlers, so nothing registers one, and nothing holds an `Application` but `server.ts` itself and the scenarios.

**What to do.** Decide where real handlers are registered before the first one is written, because that decides this. If they are registered inside `buildApplication`, the scenarios are the only outside caller, and a registration seam serves both: `buildApplication(config, { register })`, with `register` handed `{ mediator, validation, unitOfWork }` once, while the application is being put together. Production passes what registers the real handlers, the scenarios pass what registers the example ones, and `Application` goes back to `{ server, pool, config }`. The steps would then take the mediator from `server.mediator`, which is the way the feature says a route reaches it. If instead handlers are to be registered from outside after the application is built, the fields stay, and this section should say why.

---

## The whole application is built for every scenario about its mediator

**Where:** "the application is built" in `specs/web/support/application.ts`, the Background of `server.feature` and of `requestedAt.feature` — from PR #30.

**What will go wrong.** Each of the feature's ten scenarios builds the application entire: it reads and hashes every file under `assets/`, registers the cookie, form and static plugins and every route, and makes a second pool, in order to exercise a mediator and one added route. The cost grows with the assets folder and with every scenario added to the feature, and the hashing is synchronous, so it holds everything else up while it runs. Separately, the step builds with the whole of `.env`, `CANONICAL_HOST` included. The example `POST` sends neither `Sec-Fetch-Site` nor `Origin` and is let through as things stand; a cross-site guard tightened to insist on an `Origin` would turn "A route can send a command" red for a reason that has nothing to do with it.

**Why it has not yet.** The assets are a stylesheet and little else, and all 271 scenarios run in about nineteen seconds. The cross-site guard lets a request with neither header through.

**What to do.** Nothing until it is felt. When it is, build less rather than build once: these scenarios register handlers, so they cannot share one application across a run the way `specs/web/support/browser.ts` does. Letting `buildApplication` be given assets already read, or exporting the function that puts the mediator together so the scenarios can decorate a bare server with it, would each take the cost away — and the second would stop testing the application as the server builds it, which is the point of the feature, so prefer the first. If the cross-site guard is ever tightened, give the example `POST` the headers a same-site browser sends, rather than blanking the config the step builds with.

---

## /accounts/register

_Web_

- Nothing turns a refused command's error codes into the messages under each field. `SETUP.md` §7.8 says JSON gets a `422` with the codes; a form needs the dialog shown again with each field's message instead. The stand-in's "show every message all the time" goes at this point.

_Application_

- `src/application/operations/accounts/` does not exist yet. It would hold the register command, its validator, its handler and its result.
- There is no way yet to load or save an aggregate through the event store.
- Projections do not exist. The transaction scenarios mention one, but there is no mechanism, no read-model table and no migration. Refusing an email address that is already registered needs a read model of accounts by email address, so the first page is also the first projection.
- Password hashing needs an interface in `src/application/services/`, with an argon2 implementation in infrastructure. `@node-rs/argon2` is already a dependency.

_Domain_

- The `Account` aggregate, an `AccountRegistered` event, and an `EmailAddress` value object.

**Decisions to make before the feature is written**

1. **What happens after registering?** Signing the reader in straight away needs sessions (`SETUP.md` §7.7). Asking them to confirm their email address needs a way to send email. Neither exists. The suggestion is to make the first slice record the account and tell the reader it is done, then make sign-in the next page, where sessions arrive.
2. **Is an email address that is already registered disclosed?** Saying "already registered" tells anyone which addresses have accounts. `SETUP.md` §7.6 already hides that at sign-in, where a wrong password and an unknown address fail the same way, so register would be consistent to hide it too. Hiding it usually means sending an email, which brings back the problem in the first decision.
3. **What are the password rules?** The suggestion is a minimum length only (current guidance is at least 8 characters) and no rules about which kinds of character it must contain.

With those decided, the first thing to write is `register.feature` in the web layer. It is limited to what a reader sees, and its scenarios say what the command and domain features need to cover.
