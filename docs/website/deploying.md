# Deploying

Putting a new build of the website up, and taking it down again. The server is already set up (server-setup.md).

**The order is: copy the data, build, migrate, restart, look.** The data is copied first because a migration is the one step that cannot be undone (§5).

## 1. Running a script on the server

The site's scripts (`npm run db:migrate` and the others) read their settings from the environment, as the site does, and there is no `.env` on the server. So they are run with the service's settings loaded:

```bash
cd /srv/croquetscores/site
set -a; . /etc/croquetscores/environment; set +a
```

Do that once per sign-in, and every `npm run` below is then run as `deploy` with the site's own settings. The scripts run from source through `tsx`, a development dependency, so **the server keeps a full `npm ci`, development dependencies and all**, and not `--omit=dev`.

## 2. Putting up a build

From the operator's computer first, copy the data (backup-and-restore.md §2):

```bash
npm run db:backup
```

and read the email that says it worked (its subject says `worked`, and a failure's begins `WARNING:`). **Do not go on if it did not arrive or did not say it worked.** The migration below cannot be undone (§5), and a restore from an old copy loses whatever was entered since it was made. On the server:

```bash
cd /srv/croquetscores/site
set -a; . /etc/croquetscores/environment; set +a

git fetch --tags &&
git checkout <the tag or commit> &&
npm ci &&
npm run build &&
npm run db:migrate &&
sudo systemctl restart croquetscores
```

The lines are joined with `&&` so that if one fails the rest do not run, and in particular the site is not restarted after a failed build (see `npm run build` below). Use the tag or commit, not "whatever is on main" (§3). `build` is the tsc, the admin application and the help, and `db:migrate` says `Applied: …` or `Database is up to date.`

This sequence does not turn the site off, so it is for a release whose migrations only add (see "The old process runs against the new schema", below). A release that removes or renames, or that says in its pull request that the old code cannot live with the new schema, is put up with the site turned off first (§4).

Then look (operations.md §1): `curl -s https://<the site's name>/api/v1/health`, the home page, and a page of a tournament.

What each step does and why it is in this order:

- **`npm run build`** writes `dist/`. The site runs from `dist/web/server.js`, and finds the admin application and the help under `dist/admin` and `dist/help`. The running site has its code in memory, so a build in progress or a build that fails does not stop it. But a build that fails part way leaves `dist/` half written, and **the next time the site starts it starts from that**, whether you restart it or the server reboots or the site crashes and systemd starts it again. So if the build fails, the site is running on borrowed time: fix the failure and build again, or check out the previous build and run `npm run build`, **before anything restarts it**. Do not run `systemctl restart` after a failed build.
- **`npm run db:migrate`** applies the numbered SQL files in `src/infrastructure/database/migrations/` that have not been applied, each in a transaction with its record in `schema_migrations`. It is safe to run when there is nothing to do. It reads the SQL from the source folder, which is why the source is on the server.
- **`systemctl restart`** stops the site with SIGTERM, which lets the email being sent finish, and starts it again. Readers are told nothing for the few seconds it takes; a request in that time fails and a reader's browser retries on a reload. At the size of a beta, that is accepted.

**The old process runs against the new schema between migrating and restarting.** A migration that the old code cannot live with makes those few seconds errors. Migrations in this repository add; if one removes or renames, its pull request says so and the site is taken down for the migration (§4).

### Making the checkout something named

Deploy a tag, so that "what is running" has an answer and the way back (§5) is one command. Make it **on your own computer**, in your clone of the repository, and not on the server, whose deploy key can only read:

```bash
git tag -a deploy-2026-10-20 -m "Beta, first deployment" && git push --tags
```

Then on the server, `git fetch --tags` (§2) brings it, and this says what the server is on:

```bash
git describe --tags
```

## 3. What goes up

Only a commit that has passed CI on its pull request and been squash-merged to `main` (CI is run on the pull request and not again on `main`). Not a branch with unmerged work.

## 4. When the read models have to be made again

The site's lists and pages are read models, made from the events. When a release changes how one is made, the ones already stored are out of date until they are made again. The pull request that changes one says so. Then, after migrating and before opening the site to readers:

```bash
npm run db:rebuild-read-models -- --minutes 30
```

It turns the site's database access off for the minutes given, so that the site says it is down for maintenance rather than answer from read models that are about to change. It turns it on again when it is done, reports every ten seconds how many streams it has made, and says how long it took. It makes them all in one transaction, so a failure leaves them as they were. The site does not have to be stopped.

**Give it more minutes than you expect,** since it is the number readers are told. How long it takes is not yet known for real data (TODO.md, A truer rebuild estimate), and the first rebuild on the real events should be timed and written here.

Where a migration cannot be lived with by the running site, turn the site off first and give the reason it is gone:

```bash
npm run db:access -- off --minutes 20     # readers see a maintenance page, with the time to come back
npm run db:migrate
npm run db:rebuild-read-models -- --minutes 30
npm run db:access -- on
```

`db:access -- change --from-now 45` moves the time readers are told. More in operations.md §3.

## 5. Going back

Two kinds of thing are put up, and they go back differently.

**The code: always possible.**

```bash
git checkout <the previous tag> &&
npm ci &&
npm run build &&
sudo systemctl restart croquetscores
```

Do not run `db:migrate` going back. It has nothing to undo, and it would apply nothing; the database stays as the newer build left it.

**The database: not by a migration.** There is no "down". Migrations are only ever applied forward, and once the site holds real data a migration is never rewritten or merged (SETUP.md §6.2). What can follow a bad migration:

1. If the older code still runs against the newer schema, which adding a column or a table leaves true, put the older code back as above and leave the schema.
2. If it does not, restore the data copied at step one of §2 into a new database and point the site at it (backup-and-restore.md §7). **Whatever was entered between the copy and the restore is lost.** This is why the copy is made first, and why a migration that is not an addition is done with the site turned off, so that nothing is entered in the gap.

Which migrations cannot be lived with by the older code is for the pull request that adds each to say. At the first deployment there is a single migration (`0001-initial.sql`), and everything after it is the first of its kind. **When the first real migration lands, write here which kind it was.**

## 6. Changing the account key

`ACCOUNT_ENCRYPTION_KEY` is changed by the script and no other way, because the script re-encrypts what the old key sealed:

1. Take a copy first (`npm run db:backup`), and keep the old key. It is in the LastPass note for kamatera.com (configuration.md §4); leave it there.
2. Make the new key (`openssl rand -base64 32`) and **put it in the LastPass note now,** before it is used anywhere, as a new line `ACCOUNT_ENCRYPTION_KEY_NEW`. A copy of the events made before the change is sealed with the old key, and one made after with the new, so keep both keys in the note, each with the dates of the backup files it opens.
3. Stop the site: `sudo systemctl stop croquetscores`.
4. With the service's settings loaded (§1), whose `ACCOUNT_ENCRYPTION_KEY` is still the old key:

   ```bash
   NEW_ACCOUNT_ENCRYPTION_KEY='<the new key>' npm run db:change-site-key
   ```

   It re-encrypts every account's key, and every email waiting that has no account, in one transaction, so a failure leaves them as they were. It rewrites no event.

5. Set `ACCOUNT_ENCRYPTION_KEY` in `/etc/croquetscores/environment` to the new key, and start the site. **A site started with the old key after this is refused every account's key.**
6. In the LastPass note, make `ACCOUNT_ENCRYPTION_KEY` the new key, and rename the old line `ACCOUNT_ENCRYPTION_KEY_OLD`, with the date it stopped being used. Keep it for as long as any backup file made before that date is kept (backup-and-restore.md §5).

`ACCOUNT_EMAIL_ADDRESS_HASH_KEY` is not changed at all.

## 7. Rehearsal

TODO.md asks that this be written down by doing it. The first time:

- Do §2 on the real server with nothing on it, and write down every place the commands here were wrong.
- Do §5's code going-back once, to see that the older build comes up.
- Do backup-and-restore.md §7 steps 2–6 into a throwaway database, and time step 5.
- Say in README.md that they have now been followed start to finish, and on what date.
