# Deploying and running the website

How the website is put on a Kamatera server with a Postgres database, kept up to date, and looked after. For whoever runs it. It can be handed to somebody who has never seen the repository.

**These documents were reviewed and put into effect on 17 October 2026.** They will be kept up to date when something is known to change. The websites of the third parties they name (Kamatera, Cloudflare, Brevo, Google, Caddy, NodeSource and the Postgres project) change their screens, settings and install steps without telling anybody here, so where a step does not match what is on the screen, trust the screen, and then correct the step (TODO.md, "A deployment and rollback runbook").

- [server-setup.md](server-setup.md) — Making the Kamatera server, Postgres, the proxy that faces the internet, and the service. Done once, at the start
- [configuration.md](configuration.md) — Every setting, which are required, and which must never change
- [deploying.md](deploying.md) — Putting a new build up, migrating, rebuilding the read models, and taking a build down again
- [operations.md](operations.md) — Knowing it is up, reading the logs, turning the database off for maintenance, and when it goes wrong
- [beta.md](beta.md) — Running the beta: what counts as a problem, who reads the logs, and what must be true before the second week
- [recovery.md](recovery.md) — What lives only on the operator's computer, where a copy of each belongs, and what to do on a new one
- [backup-and-restore.md](backup-and-restore.md) — Copying the events to another machine, and rebuilding the website from the copy

The repository's other documents say what the code is rather than how it is run: `SETUP.md` how it is built and why, `TODO.md` what is still to be done before beta and before production, `BETA.md` what the beta's testers are asked to do.

---

## 1. What is being run

One Node process, one Postgres, and a proxy in front.

```
   reader's browser
          │  HTTPS (443)
          ▼
   ┌─────────────┐
   │ Caddy       │  certificates, redirects http to https,
   │ (the proxy) │  says where each request came from
   └──────┬──────┘
          │  HTTP, on the server only (127.0.0.1:3000)
          ▼
   ┌─────────────┐         ┌────────────┐     ┌───────────────┐
   │ the site    │───────> │ Postgres   │     │ Brevo         │
   │ node        │         │ 18         │     │ (SMTP relay)  │
   │ dist/web/   │──────────────────────────> |  sends email  │
   └─────────────┘         └────────────┘     └───────────────┘
```

- **The site** is Node 22.13 or later, started with `node dist/web/server.js` from the repository's folder. It serves the public pages, the admin application, the API and the help, all from the one process. It listens on `PORT` (3000 unless told otherwise) on every address, so the server's firewall, not the site, is what keeps it from being reached directly.
- **Postgres** is version 18, preinstalled by Kamatera's PostgreSQL image, and `pg_dump` for the backup must be at least that. The site keeps everything it knows as events in it, and makes its lists and pages (the read models) from them.
- **The proxy** is Caddy in these documents, because it gets and renews certificates by itself. Anything that does the same is as good. What matters is in [server-setup.md](server-setup.md) §5: that it passes the reader's own address along, that it forwards the host the reader typed as `X-Forwarded-Host`, and that `TRUSTED_PROXY` says the site may believe it.
- **Brevo** sends the site's emails, over SMTP, always encrypted. Without it set, an email is written to a file in `temp/` and goes nowhere.

The database and the site can share one Kamatera server, which is how these documents set it up: the beta is a few people, and one server is less to look after.

## 2. Which website a request is for

One server answers for four websites: `croquetscores.com`, `try.croquetscores.com`, `gateballscores.com` and `try.gateballscores.com`. All four names point at the one server, and the site reads which website a request is for from the host the reader typed. That decides the sport and formats on offer, what the site is called, the links in its emails, and whether a banner on every page says that anything entered may be removed at any time (the two `try` websites).

- **Development:** `localhost` and `127.0.0.1` on any port are development, and are Croquet Scores and not a try website.
- **Any other host is refused** with `421 Misdirected Request`, so a mispointed domain is noticed and not quietly served as the wrong sport. The exception is the health check, which answers whatever it was asked for, so that an uptime check by address works (operations.md §1).
- **Behind the proxy,** the host the reader typed reaches the site as `X-Forwarded-Host`, believed from `TRUSTED_PROXY` and from nowhere else (configuration.md, "What the site works out for itself").
- **`beta.croquetscores.com` is the beta site.** Inside the new site it counts as `croquetscores.com` for what is kept and read, so a reader of one sees the other's tournaments, but it is reached at its own address and says on every page that it is a beta. It is not a website a tournament can be on. The links in its emails, and the address Google sends a reader back to, are the beta site's own. **While the beta runs, the new site's database is a copy of the old site's production data, and nothing entered on the beta site reaches the old site** (beta.md §1).
- **One database** holds all four. They are not four installations.

## 3. The shortest path

For somebody who wants the order and not the reasons:

1. Make the server, the firewall and the database ([server-setup.md](server-setup.md) §1–3).
2. Point the domain at it ([server-setup.md](server-setup.md) §4).
3. Check out the repository, make the settings, keep the keys somewhere else ([configuration.md](configuration.md) §2–3).
4. `npm ci`, `npm run build`, `npm run db:migrate` ([deploying.md](deploying.md) §2).
5. Start the service and the proxy ([server-setup.md](server-setup.md) §5–6).
6. Look at `/api/v1/health` from outside, then the home page ([operations.md](operations.md) §1).
7. Keep a copy of the keys and `.env.production` away from this computer ([recovery.md](recovery.md) §2).
8. Set up the backup, and **restore from it once** before anybody is invited ([backup-and-restore.md](backup-and-restore.md)).

## 4. Who to tell

The website's operator is Tim Murphy (croquetscores@gmail.com). `ADMINISTRATOR_EMAIL_ADDRESS` is who the site's emails are sent from, who is emailed when it cannot reach its database, and who the backup emails how each run went.
