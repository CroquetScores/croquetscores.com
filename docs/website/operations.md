# Operating the website

Knowing it is up, reading what it says, turning the database off on purpose, and what to do when something is wrong. For the day after the deployment and every day after.

## 1. Is it up?

- **The process is well, from outside** — `curl -s https://<the site's name>/api/v1/health` says `{"status":"ok"}`. _What it tells:_ The proxy, the certificate and the process. **Not the database:** it asks nothing of it, on purpose, so that it still answers during maintenance
- **The service is running** — `sudo systemctl status croquetscores`. _What it tells:_ The process, and the last lines it said
- **The database is reached** — Open the home page, then a tournament's page. _What it tells:_ The pages are made from the database. A site that cannot reach it says so on every page, and emails `ADMINISTRATOR_EMAIL_ADDRESS`
- **Email is leaving** — Register a new account with an address you can read. _What it tells:_ That Brevo's settings are right. Time how long the email takes
- **Postgres is up** — `sudo systemctl status postgresql`. _What it tells:_ The database server itself

**After every deployment, and on first set-up, do all five.** The health check alone is not an answer.

**An outside check that runs by itself is not set up** (https://github.com/CroquetScores/croquetscores.com/issues/286, Seeing a failure before a user says so). Until it is, nobody learns of an outage at night until the morning. Point an uptime service at `/api/v1/health` and have it email the operator; any will do, and a free tier is enough for a beta.

## 2. The logs

```bash
sudo journalctl -u croquetscores -n 100       # the last hundred lines
sudo journalctl -u croquetscores -f           # as they happen
sudo journalctl -u croquetscores --since "1 hour ago"
sudo journalctl -u caddy -n 50                # the proxy's
```

The site writes a line for each request and for each thing that went wrong, as JSON. The first lines after a start say whether its settings were accepted: a setting that is wrong stops the site, and lists every problem (configuration.md).

The journal is on the server, kept for 90 days or 500 MB (server-setup.md §7), and is lost with the server except for Kamatera's daily backup of it. Only `deploy` can read it. **Tim Murphy reads it once a day,** with the three commands under "Reading them every day" in server-setup.md §7: warnings and errors from the site and the proxy, and whether the site restarted. That is the whole of the watching, so a night's outage is found the next day (§1).

## 3. Turning the database off on purpose

For a migration, a rebuild, or anything else where the site should say it is down for maintenance rather than answer from a database that is being changed. It does not stop the site, and does not touch the database; it writes a file the running site reads at each request (`DATABASE_ACCESS_FILE`). The scripts you run as `deploy` write the file, and the site never does.

```bash
cd /srv/croquetscores/site
withsettings npm run db:access -- off --minutes 30      # readers see a page saying it is for maintenance and when to come back
withsettings npm run db:access -- change --from-now 45  # the time to come back was wrong
withsettings npm run db:access -- on                    # open again
```

Run from `/srv/croquetscores/site`, with `withsettings` in front (deploying.md §1), so that the script has the service's settings and writes the file the site is reading.

While it is off, the pages, the API and the admin all answer that the site is for maintenance, with the time to come back; programs are told to ask again after the estimate. Files (styles, scripts, images) are still served, so the page looks like the site's. `/api/v1/health` still answers `ok`. Nobody is emailed that the database is unreachable, since the operator turned it off.

**Turn it on again.** The switch is a file, and it stays off across restarts, and `db:rebuild-read-models` turns it back on itself when it finishes. A site left off after a migration is a site down.

## 4. When something is wrong

### Readers see "the site cannot reach its database"

1. `sudo systemctl status postgresql` (or the service's name from server-setup.md §3, if it has a version in it). If it is down, `sudo systemctl start postgresql`, and read `sudo journalctl -u postgresql -n 50` for why.
2. If it is up, look at the site's log for the reason it gave. A wrong password after a change, or a database that was dropped, say so.
3. Disk full is the usual cause on a small server that has run for a while: `df -h`.

The administrator is emailed once, and then again no sooner than `DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES` later, while it lasts.

### The site will not start

`sudo journalctl -u croquetscores -n 30` says why. Most often a setting (it lists them all), then the database, then the port already being used (`sudo ss -ltnp | grep 3000`).

### Emails are not arriving

1. Is `SMTP_HOST` set at all? Without it emails are written to `temp/` in the site's folder, and nothing is sent. `sudo ls /srv/croquetscores/site/temp` shows them.
2. Look in the log for the server's own words. An email the server refused is **kept in the queue and tried again**, so nothing is lost while the setting is wrong. Fix it and restart.
3. At Brevo: is the sender's domain verified, and are the SPF, DKIM and DMARC records answering? Email that is sent and lands in spam is these (server-setup.md §4).
4. The Brevo key is the SMTP key and not the account's password.

### Readers are told "try again later" when they have done nothing

The limit on failed sign-ins and password-reset requests counts by the reader's address. If it is counting by the proxy's, every reader shares one, and `TRUSTED_PROXY` is wrong or missing. Compare it to the address the proxy connects from (configuration.md §3).

### Sign-in with Google fails

`redirect_uri_mismatch` on one website only means that website's address is not registered in Google's console. All five must be: `https://<each of the five names>/auth/google/callback` (configuration.md §3), the beta's included (the other sections here that say "four websites" mean the four that are not the beta). A reader who signs in with Google on the beta site and comes back on `croquetscores.com` means either that `https://beta.croquetscores.com/auth/google/callback` is not registered with Google, or that the build running is from before the beta site had its own address (README.md §2); deploy the latest (deploying.md §2). The log then shows `Google.NotSentFromHere` as a warning, because the reader came back to an address that did not start the sign-in (server-setup.md §7). If the site sends `http://`, `TRUSTED_PROXY` does not name the proxy.

### Every page answers 421 Misdirected Request

The site was asked for a host that is none of its four websites. Through the proxy that is usually `X-Forwarded-Host` not arriving, or not being believed: the site is seeing the proxy's own address. Check that `TRUSTED_PROXY` names the proxy's address and that the proxy forwards the host (server-setup.md §5). The health check still answers, which is why the service looks well.

If only one name does it, that name is not one of the four (or `beta.croquetscores.com`), or its DNS points at the server and the Caddyfile does not name it.

### A name shows as unreadable

`ACCOUNT_ENCRYPTION_KEY` is not the one the accounts were sealed with. Put the right one back, from the LastPass note for kamatera.com (configuration.md §4). If the note has an `ACCOUNT_ENCRYPTION_KEY_OLD` line as well, the data may have been sealed by either, depending on when it was made (deploying.md §6). **Do not run `db:change-site-key` to "fix" it:** it needs the right old key to work.

### The server itself is lost

backup-and-restore.md §7. It needs the file, the two account keys from where they are kept, and a Postgres. The server is made again from server-setup.md.

## 5. Regular jobs

- **Every backup** — Read the backup's email (backup-and-restore.md §5). No email is a failure
- **Once a month** — `pg_restore --list` one backup file, and check disk space on the server (`df -h`) and on the backup disk
- **Once a month** — `sudo apt update && sudo apt list --upgradable`, and apply what is security (unattended-upgrades does this for security by default). Reboot if the kernel changed, and run §1 after
- **Each release** — The Node version, `engines` in `package.json`, against `node --version` on the server
- **Before the domain's certificate lapses** — Nothing: Caddy renews it. If `curl` says the certificate expired, `sudo journalctl -u caddy` says why (usually the `A` record no longer points here)
- **Each year** — The Kamatera invoice, the domain's renewal, and Brevo's plan against how many emails were sent

## 6. Not yet done

Collected from https://github.com/CroquetScores/croquetscores.com/issues/286, so they are not forgotten when this is read as if it were finished:

- An outside check on `/api/v1/health` that emails the operator (§1).
- Security headers. The proxy can send some in the meantime.
- Rate limiting beyond sign-in, password reset and registering.
- A measured busy tournament: how many readers one server stands, and the pool size against Postgres's connection limit.
