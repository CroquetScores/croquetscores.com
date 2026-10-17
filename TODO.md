# TODO.md

## Before Beta Release

Beta runs for two weeks if nothing in it says otherwise: a week for half a dozen people, then a week for anyone who wants it. What belongs here is what would lose data, expose it, lock people out, or leave us blind when the first six hit a problem.

- **Google sign-in addresses.** The site now sends Google the address of the website the reader is on, so `https://croquetscores.com`, `https://try.croquetscores.com`, `https://gateballscores.com`, `https://try.gateballscores.com` and `https://beta.croquetscores.com`, each followed by the callback path, must all be registered as authorised redirect URIs in Google's console, or sign-in on the ones that are not fails with redirect_uri_mismatch.
- **Hosting.** Choose where the site and its Postgres run, and set them up: the domain and DNS for the beta site, HTTPS, `TRUSTED_PROXY` set to match what sits in front of it, which must forward the `Host` the reader typed as `X-Forwarded-Host` for all four domains, a way to deploy a build and run `npm run db:migrate`, and somewhere the logs go that someone reads. The mail domain's SPF, DKIM and DMARC records belong here too, or the mail provider's email lands in spam.
- **Settings and keys.** Every setting in `.env.example` has a value on the deployed site, and the keys are made and kept somewhere other than the server. Four are not optional in the way development lets them be: the reCAPTCHA keys, without which the register form is open and emails whoever it is told to (the code says so in three places); `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY`, which if lost leave every account's personal data unreadable or unfindable, and the second can never be changed; and the Google credentials, if sign-in with Google is to be offered. Decide about Facebook (see Before Production Release) and leave it unconfigured if it is not ready.
- **Fill in BETA.md.** The beta testing plan is written; its first section has four blanks only the operator knows: the beta site's address, where a tester reports a problem, who reads the logs and how often. Fill them before the plan is sent to anybody.

## Before Production Release

- **Security headers.** The site sends none beyond cookies' flags: no `Strict-Transport-Security`, no `X-Content-Type-Options`, no framing restriction, no `Content-Security-Policy`. Add them in one hook, the way the cross-site check is one, and write a scenario for each so they stay.
- **Search engines and sharing.** `SEARCH_ENGINES_WELCOME=true` on production, since the site keeps search engines away until told otherwise, a sitemap of tournaments and years, a canonical link on every page, and a title and description for each kind of page, so a tournament found by search or shared in a message says what it is.
- **Terms of use.** What commentary may say, what happens to it if it is reported, and who the site's operator is. Needed before anyone who has not been asked is let to publish.
- **Rate limiting at large.** Failed sign-ins and password-reset askings are limited and registering is checked by reCAPTCHA; nothing else is. Decide what limits the rest (search, the Excel and text downloads, the API) and where, whether the proxy in front of the site or the site.
- **Seeing a failure before a user says so.** The log is written and the administrator is emailed when the database cannot be reached, and that is all there is. Error tracking or an alert on a rate of `500`s, and an uptime check on `/api/v1/health` from outside, so that an outage at night is not found in the morning.
- **A busy tournament.** Load-test a tournament's day on production-sized data: many readers on one block page while scores are being entered, with the pool size and the database's connection limit set to what was found. Nothing here has been measured with more than one reader.
- **The cutover from the old sites.** Which addresses on the old sites there are in the world and where each goes (a redirect for every tournament, player and year page that has been linked to), the old-site password salt in place so imported passwords work, the import timed against a copy of the real databases and followed by a rebuild, and a way back if it goes wrong. Rehearsed at least once start to finish before the day.
- **Facebook sign-in.** It is built, but a Facebook app needs review before anyone but its developers can use it, and Facebook may withhold the email address. Either complete the review and test it against a real app, or leave it unconfigured and do not offer it.
- **Browser scenarios in CI.** CI runs everything but the `@browser` scenarios, so what needs a real browser is checked only where someone runs it. Run them on a schedule or on a branch that is about to be released, in the way that costs least.
- **Phones, and reading with a screen reader.** Walk the public pages and the admin on a real phone and with a screen reader, and keyboard alone, and mend what is in the way. The layout has been worked on at phone width but not audited for this.
- **A deployment and rollback runbook.** The steps to put a build up, migrate, rebuild the read models where one changed, and take a build down again, written down by doing them at beta, along with which migrations cannot be undone and what to do about those.
- **The stored-event rule.** SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

## Wishes

Things that would be good and that nothing is waiting on. They are here so they are not lost, and not so they are done.

- **A truer rebuild estimate.** The rebuild estimates its time by streams done, which are of very different sizes; counting events would be nearer. It was left as asked in the review of #256 and is for the owner of the request to say.
- **Following a tournament as it happens.** The public pages are right as of the last load. A block or a knockout that updates itself while it is open, without reloading, would suit the people following along, and the pages must still work with JavaScript off.
- **Notices to people who follow a tournament.** An email or a push when a player's next match is called or a result is entered, for those who ask.
