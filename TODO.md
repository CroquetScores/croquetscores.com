# TODO.md

Two kinds of thing, kept apart.

**Jotted** is for whatever occurs to anyone, a line each, not yet thought through. Add to it freely.

**Known problems** are written out in full — what will go wrong, why it has not yet, and what to do when it does — so they are found where people look, rather than left in a pull request nobody reads again after it merges. A jotted item that turns out to need that much explaining moves down and gets a section of its own.

---

## Jotted

- nothing yet

---

# Known problems

## The cross-site guard will refuse an OAuth callback that posts

**Where:** `src/web/common/crossSite.ts` — from PR #10.

**What will go wrong.** Every `POST`, `PUT`, `PATCH` and `DELETE` is refused with `403 Request.CrossSite` when the browser says it came from another site. Some identity providers return a signed-in user by having the browser post a form back from the provider's own domain — `response_mode=form_post` in OpenID Connect. That post arrives with `Sec-Fetch-Site: cross-site`, because it is one, and it would be refused. The reader would be sent to the provider, sign in successfully, and land on an error page.

**Why it has not yet.** There is no sign-in code. The Google and Facebook flows planned in `SETUP.md` §7.6 redirect back with a `GET`, which the guard never looks at.

**What to do.** Whoever builds sign-in: if any provider is configured to post its callback, that one route needs exempting from the guard, and the exemption should name the route rather than loosen the rule. A `POST` callback is also a place where a forged request would matter a great deal, so the exemption is only safe alongside the checks the flow already requires — the `state` parameter matched against what was issued, and the token's signature and audience verified. Add a scenario that posts to the callback cross-site and expects it through, and another that posts to any other route cross-site and expects it refused.

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
