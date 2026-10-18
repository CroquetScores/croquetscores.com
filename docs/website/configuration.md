# Configuration

Every setting the website reads, which it must have, and what happens when one is wrong or lost. The settings are read once, at startup, by `src/infrastructure/config/Config.ts`, and nothing else in the site reads the environment. `.env.example` is the list with no values.

**A setting that is wrong stops the site starting, and says every problem at once** rather than the first. That is deliberate: it is better to find a part-set mail server at deploy than after a week of emails written to files.

## What the site works out for itself

**Which website it is, what it is called, and the address its links point to are not settings.** The site reads which of its four websites a request is for from the host the reader typed (README.md §2). The name in the bars and emails, the sport, the try banner, the links in emails, and the host a request's `Origin` is judged against all follow from that. An email is queued with the website its request was for, and written with that website's name and address when the queue sends it.

- Nothing about them goes in `/etc/croquetscores/environment`. The old `WEBSITE`, `SITE_NAME` and `CANONICAL_HOST` are gone; The site ignores a setting it does not know, so a leftover one does nothing, but delete it.
- **The proxy must forward the host the reader typed as `X-Forwarded-Host`,** and `TRUSTED_PROXY` must name the proxy, since that header is believed from the proxies named there and nowhere else. Caddy's `reverse_proxy` sets it by default (server-setup.md §5). Without it every request is for the proxy's own address, which is none of the four, and every page answers 421.
- A host that is none of the four, and not `localhost` or `127.0.0.1`, is answered `421 Misdirected Request`. A trailing dot (`croquetscores.com.`) and `:443` are taken as the same host.

## 1. Where the settings live

In the environment of the process. On the server that is a file the service reads, `/etc/croquetscores/environment`, owned by root and readable only by the account the site runs as and the operator (server-setup.md §6), and not the repository's `.env`. The site does read a `.env` in its folder if there is one, so a leftover development `.env` there would be read too. **There is none on the server.**

The file is plain `NAME=value` lines, with no `export`. It is read in three ways: by systemd when it starts the site, by the site itself, and by your shell when you load it to run a script (`set -a; . /etc/croquetscores/environment; set +a`, deploying.md §1). **A value with a space, or with a character the shell treats specially such as `$`, `#`, `&`, `;` or `!`, is written in single quotes**, such as `ADMINISTRATOR_EMAIL_FROM_NAME='Tim Murphy'`. Without them the shell takes `Tim Murphy` as the value `Tim` for a command called `Murphy`, and says `Murphy: command not found`. **Do not put `NODE_ENV` in this file.** Loading the file into your shell (above) exports every setting in it, and with `NODE_ENV=production` set, `npm ci` leaves out the development packages that `npm run build` and the scripts need (deploying.md §1). The site does not read it. All three readers take single quotes to mean "exactly what is inside". A value that itself has a single quote in it cannot be written this way, so do not choose one (a generated password from `openssl rand -hex` never has one).

The file on the server is not committed, and neither is the one it is copied from. `.env.example` is committed, with every name and no value, for development. `.env.production` is the production file, on the operator's computer, **ignored by git** because it holds the keys. It has every setting a production server needs, with a value. A deployment script, still to be written, is to check that it exists and that every setting in it has a value, and to stop if not, before copying it to `/etc/croquetscores/environment`. So a setting that is not wanted (Facebook's, until its app is reviewed) is left out of the file and not left blank. Until the script exists, check it by hand and copy it by hand.

## 2. Making the keys

Four of the settings are random and made once. On the server, for each:

```bash
openssl rand -base64 32
```

Make a different one for each. `npm run dev:setup` does the same for a development `.env` and is not used on the server.

## 3. The settings

### Required: the site does not start without these

- **`DATABASE_URL`** — The site's Postgres: `postgres://user:password@127.0.0.1:5432/croquetscores`. A password with `@`, `:` or `/` in it is written percent-encoded. _Change it later:_ Yes, with the site stopped
- **`SESSION_COOKIE_SECRET`** — Signs the cookie that keeps a reader signed in. _Change it later:_ Yes. Everybody is signed out
- **`TOKEN_SIGNING_KEY`** — Signs the links in emails and the other tokens the site hands out. _Change it later:_ Yes. Links already sent stop working
- **`ACCOUNT_ENCRYPTION_KEY`** — Seals each account's own key, which seals that account's name and email address. _Change it later:_ **Only with `npm run db:change-site-key`.** Set to another any other way, every account's name and email address is unreadable for good
- **`ACCOUNT_EMAIL_ADDRESS_HASH_KEY`** — Finds an account from the email address typed to sign in. _Change it later:_ **Never.** The hash it makes is kept in the event that registered each account, and events are never rewritten. A new one finds nobody
- **`ADMINISTRATOR_EMAIL_ADDRESS`** — The administrator: who the site's emails are sent from, who is emailed when the database cannot be reached, and who is told how every backup went: `croquetscores@croquetscores.com` or a mailbox that is read. **This was also `EMAIL_FROM_ADDRESS`, which is gone;** an environment still setting it is setting nothing, and one without this setting does not start. Its domain needs SPF, DKIM and DMARC records at the mail provider, or the emails go to spam. _Change it later:_ Yes
- **`ADMINISTRATOR_EMAIL_FROM_NAME`** — The name those emails come from and are signed off with. **This was `EMAIL_FROM_NAME`;** an environment still setting the old name is missing this one, and the site refuses to start and says so. _Change it later:_ Yes

### Required in practice: the site starts without these, and should not be run without them

- **`TRUSTED_PROXY`** — The addresses the proxy connects from, separated by commas: `127.0.0.1` when Caddy is on the same server. The reader's own address is believed from these and nowhere else. Blank, every reader is counted as the proxy, and the limits on failed sign-ins and password-reset requests hold everybody to one reader's share. `0.0.0.0/0` is refused
- **`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`** — Both or neither. Without them the register form is open and emails whoever it is told to. Made at google.com/recaptcha for the site's domain
- **`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER_NAME`, `SMTP_PASSWORD`** — All four or none. Brevo's: `smtp-relay.brevo.com`, `587`, and the user name and key Brevo gives for SMTP (not the account's sign-in). None, and every email is written to `temp/` and nobody is sent anything. The connection is always encrypted, and a server that will not encrypt is not sent to
- **`SEARCH_ENGINES_WELCOME`** — `true` or `false`, blank is `false`. **Leave it `false` for the beta**, and for any try website. `true` only when the site is meant to be found

### Optional

- **`PORT`** — The port the site listens on. Blank is 3000. The proxy is told the same
- **`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`** — Sign in with Google. Both or neither: with one missing the route is not offered. The site sends Google the address of the website the reader is on, so **all five** must be registered in Google's console as authorised redirect URIs: `https://croquetscores.com/auth/google/callback`, `https://beta.croquetscores.com/auth/google/callback`, `https://try.croquetscores.com/auth/google/callback`, `https://gateballscores.com/auth/google/callback` and `https://try.gateballscores.com/auth/google/callback`. One missing fails sign-in on that website with `redirect_uri_mismatch`. Behind the proxy it is right only when `TRUSTED_PROXY` names the proxy: otherwise it sends `http://`, and Google refuses it
- **`FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`** — Sign in with Facebook. Leave blank until the app has been reviewed (TODO.md, Facebook sign-in)
- **`OLD_SITE_PASSWORD_SALT`** — The salt the old site added before hashing passwords. Needed only so that passwords imported from the old site match. Blank, they match nothing
- **`DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES`** — How long between emails to the administrator that the database cannot be reached. Whole minutes, blank is 30
- **`DATABASE_ACCESS_FILE`** — Where the maintenance switch is kept (operations.md §3). Only the scripts run as `deploy` write it, and the running site only reads it. Blank is `.database-access` in the site's folder. It is a file, because the database cannot say whether it may be asked

### Never on the website

These belong to the administrator's own computer or to an import, and are blank on the server (backup-and-restore.md §3):

`WEBSITE_DATABASE_URL`, `DATABASE_BACKUP_FOLDER`, `PG_DUMP_PATH`, and for the import from the old sites `RAVENDB_URL` and `RAVENDB_DATABASES`. **`npm run import:ravendb` empties the database `DATABASE_URL` names, dropping every table, and fills it again.** Never run it with a `DATABASE_URL` that holds anything worth keeping.

## 4. A copy of the file, away from the server

The server's environment file is the place that is lost with the server. **The whole of the website's `.env` is kept in LastPass, in the notes of the item for kamatera.com.** That one note holds every setting and key in this document, so there is nothing to collect from anywhere else after a loss.

What matters most in it:

- `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY`. **A copy of the events does not get anybody back without them** (backup-and-restore.md §4).
- The rest, such as `SESSION_COOKIE_SECRET`, `TOKEN_SIGNING_KEY`, the database's password, the reCAPTCHA, Google and Brevo keys, and `OLD_SITE_PASSWORD_SALT`. Losing these does no harm to the data and costs a morning.

LastPass is a copy, and a copy goes out of date. **Update the note whenever the file changes,** including after a change made on the server (section 5) or with `npm run db:change-site-key`. Check once that the note is the one the server is running with, and not an earlier one written down before a change. Where the note is, and what to do if the computer it was made on is lost, is also in recovery.md.

## 5. Changing a setting

1. Edit `/etc/croquetscores/environment`.
2. `sudo systemctl restart croquetscores`. The site reads its settings only at start.
3. Look at the log (operations.md §2). A setting that is wrong says so in the first lines and the service does not stay up.

Changing `ACCOUNT_ENCRYPTION_KEY` is not this. It is `npm run db:change-site-key` (deploying.md §6).

## 6. A checklist before the first visitor

- [ ] Every one of the required settings has a value.
- [ ] `TRUSTED_PROXY` is the proxy's address, and the proxy forwards the host the reader typed as `X-Forwarded-Host`.
- [ ] The reCAPTCHA keys are made for all four domains and for `beta.croquetscores.com`.
- [ ] The four `SMTP_` settings are all there, and a registration's email arrived (operations.md §1).
- [ ] The whole file is in the LastPass note for kamatera.com, and the two account keys in it match the server's.
- [ ] `SEARCH_ENGINES_WELCOME` is `false` for a beta, `true` for production.
- [ ] No `.env` is in the site's folder on the server.
