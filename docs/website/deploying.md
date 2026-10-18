# Deploying

Putting a new build of the website up, and taking it down again. The server is already set up (server-setup.md).

**The order is: copy the data, keep the build that is running, build, migrate, restart, look.** The data is copied first because a migration is the one step that cannot be undone (§5), and the running build is kept so that going back is a rename (§5).

## 1. Running a script on the server

The site's scripts (`npm run db:migrate` and the others) read their settings from the environment, as the site does, and there is no `.env` on the server. So they are run with the service's settings loaded **for that one command**. Make a helper for it, once, as `deploy` (server-setup.md, "Install, build and migrate", already made it; check `grep -c withsettings ~/.bashrc` is 1 before adding it again):

```bash
cat >> ~/.bashrc <<'EOF'
withsettings() { ( set -a; . /etc/croquetscores/environment; set +a; "$@" ); }
EOF
. ~/.bashrc
```

Then put `withsettings` in front of a script, as `withsettings npm run db:migrate`. The settings are loaded in a subshell that ends with the command, so the keys and passwords in them are not left in your shell for everything you type afterwards, such as `git`, or the install scripts that `npm ci` runs for the packages it installs. Commands that do not need the settings, `npm ci` and `npm run build`, are run without them.

It needs `deploy` to be in the site's group, which is step 4 of server-setup.md §6, and to have signed in again since. The scripts run from source through `tsx`, a development dependency, so **the server keeps a full `npm ci`, development dependencies and all**, and not `--omit=dev`. That is also why `NODE_ENV` is not put in the settings file (configuration.md §1).

## 2. Putting up a build

From the operator's computer first, copy the data (backup-and-restore.md §2):

```bash
npm run db:backup
```

Look at what it says on the screen. **Do not go on unless it says the backup worked.** It says so on the screen, and exits with failure if it did not, so the screen is the gate, and the email (whose subject says `worked`, and a failure's begins `WARNING:`) is a second copy of the same words that may arrive late. The migration below cannot be undone (§5), and a restore from an old copy loses whatever was entered since it was made.

Then, on the server. This keeps a copy of the whole folder as it is running, and builds the new version in the folder itself:

```bash
cd /srv/croquetscores &&
rm -rf site.previous &&
cp -a site site.previous &&
cd site &&
git fetch --tags &&
git checkout <the tag or commit> &&
npm ci &&
npm run build &&
withsettings npm run db:migrate &&
sudo systemctl restart croquetscores
```

The lines are joined with `&&` so that if one fails the rest do not run, and in particular the site is not restarted after a failed build. Use the tag or commit, not "whatever is on main" (§3). `site.previous` is the code, the packages and the build as they were running, about 350 MB, and only the last one is kept.

Then look (operations.md §1): `curl -s https://<the site's name>/api/v1/health`, the home page, and a page of a tournament.

What each step does, and what can go wrong:

- **`cp -a site site.previous`** is what makes going back a rename (§5). If `site.previous` is not there, the way back is to build the old version again, which is slower and can fail.
- **`npm ci` and `npm run build`** replace `node_modules` and rewrite `dist/` **while the site is running from them.** The site has its code in memory, so most requests go on being answered, but a file it loads late (an admin or help page, say) can be missing for the minutes this takes, and a request for it fails. At the size of a beta that is accepted: do it at a quiet time. If you would rather not take the risk, or the release needs the site off anyway, stop the site first and use the sequence in §4.
- **A build that fails** leaves `dist/` half written, and **the next time the site starts it starts from that**, whether you restart it, or the server reboots, or the site crashes and systemd starts it again. The `&&` stops the restart, but it does not make the running site safe. If the build fails, put `site.previous` back before anything else (§5), then find out why it failed.
- **`withsettings npm run db:migrate`** applies the numbered SQL files in `src/infrastructure/database/migrations/` that have not been applied, each in a transaction with its record in `schema_migrations`. It is safe to run when there is nothing to do, and says `Applied: …` or `Database is up to date.` It reads the SQL from the source folder, which is why the source is on the server.
- **`systemctl restart`** stops the site with SIGTERM, which lets the email being sent finish, and starts it again. Readers are told nothing for the few seconds it takes; a request in that time fails and a reader's browser retries on a reload. At the size of a beta, that is accepted.

**The old process runs against the new schema between migrating and restarting.** A migration that the old code cannot live with makes those few seconds errors. Migrations in this repository add; if one removes or renames, its pull request says so and the release is put up with the site stopped (§4).

### Making the checkout something named

Deploy a tag, so that "what is running" has an answer. Make it **on your own computer**, in your clone of the repository, and not on the server, whose deploy key can only read:

```bash
git tag -a deploy-2026-10-20 -m "Beta, first deployment" && git push --tags
```

Then on the server, `git fetch --tags` (§2) brings it, and this says what the server is on:

```bash
git describe --tags
```

## 3. What goes up

Only a commit that has passed CI on its pull request and been squash-merged to `main` (CI is run on the pull request and not again on `main`). Not a branch with unmerged work.

## 4. Read models, and a migration the old code cannot live with

**When a release changes how a read model is made,** the ones already stored are out of date until they are made again. The pull request that changes one says so. After §2 (migrated, restarted), and before readers are let to look:

```bash
cd /srv/croquetscores/site
withsettings npm run db:rebuild-read-models -- --minutes 30
```

It turns the site's database access off itself, for the minutes given, so that the site says it is down for maintenance rather than answer from read models that are about to change. It turns access on again when it is done, reports every ten seconds how many streams it has made, and says how long it took. It makes them all in one transaction, so a failure leaves them as they were, turns access on, and says what failed. The site does not have to be stopped.

**Give it more minutes than you expect,** since it is the number readers are told. How long it takes is not yet known for real data (TODO.md, A truer rebuild estimate), and the first rebuild on the real events should be timed and written here.

**Do not turn access off first with `db:access`.** The rebuild refuses when access is already off, saying `Database access is already off.`, because that means somebody else is doing maintenance. If it says so and nobody is, `npm run db:access -- on` (operations.md §3) turns it on.

**When a migration cannot be lived with by the running site,** or the release is better put up with the site off, stop the site first and put the new version up while nothing is using it. Readers get the proxy's "bad gateway" for the minutes this takes, since the site that would show a maintenance page is the one that is stopped. The same steps as §2, with the stop first, the rebuild before the start where the release needs one, and the start last:

```bash
sudo systemctl stop croquetscores &&
cd /srv/croquetscores &&
rm -rf site.previous &&
cp -a site site.previous &&
cd site &&
git fetch --tags &&
git checkout <the tag or commit> &&
npm ci &&
npm run build &&
withsettings npm run db:migrate &&
withsettings npm run db:rebuild-read-models -- --minutes 30 &&
sudo systemctl start croquetscores
```

Leave the rebuild line out where the release does not need it. **If a step fails the site is left stopped, on purpose:** it must not be started on a build that did not finish, or on a schema half changed. Find out why it failed. To put the old version back, see §5.

## 5. Going back

Two kinds of thing are put up, and they go back differently.

**The code: a rename.** `site.previous` is the code, packages and build as they were running before the last deploy (§2), so going back is putting it where `site` is:

```bash
cd /srv/croquetscores &&
sudo systemctl stop croquetscores &&
mv site site.failed &&
mv site.previous site &&
sudo systemctl start croquetscores
```

Look at the site (operations.md §1). When you are sure, delete the version that was put aside:

```bash
rm -rf /srv/croquetscores/site.failed
```

Only one version back is kept, and `site.previous` is gone once it has been used. If it was never made, or is gone, the way back is slower: check out the previous tag in `site`, run `npm ci` and `npm run build`, and start the site. Do not start it if the build fails.

Do not run `db:migrate` going back. It has nothing to undo, and it would apply nothing; the database stays as the newer build left it.

**The database: not by a migration.** There is no "down". Migrations are only ever applied forward, and once the site holds real data a migration is never rewritten or merged (SETUP.md §6.2). What can follow a bad migration:

1. If the older code still runs against the newer schema, which adding a column or a table leaves true, put the older code back as above and leave the schema.
2. If it does not, restore the data copied at step one of §2 into a new database and point the site at it (backup-and-restore.md §7). **Whatever was entered between the copy and the restore is lost.** This is why the copy is made first, and why a migration that is not an addition is done with the site stopped (§4), so that nothing is entered in the gap.

Which migrations cannot be lived with by the older code is for the pull request that adds each to say. At the first deployment there is a single migration (`0001-initial.sql`), and everything after it is the first of its kind. **When the first real migration lands, write here which kind it was.**

## 6. Changing the account key

`ACCOUNT_ENCRYPTION_KEY` is changed by the script and no other way, because the script re-encrypts what the old key sealed:

1. Take a copy first (`npm run db:backup`), and keep the old key. It is in the LastPass note for kamatera.com (configuration.md §4); leave it there.
2. Make the new key (`openssl rand -base64 32`) and **put it in the LastPass note now,** before it is used anywhere, as a new line `ACCOUNT_ENCRYPTION_KEY_NEW`. A copy of the events made before the change is sealed with the old key, and one made after with the new, so keep both keys in the note, each with the dates of the backup files it opens.
3. Stop the site: `sudo systemctl stop croquetscores`.
4. Give the script the new key without typing it on the command line, where it would be kept in the shell's history. `read -rs` asks for it and does not show what you paste; the settings file still has the old key, which is what the script is to find:

   ```bash
   cd /srv/croquetscores/site
   read -rs NEW_ACCOUNT_ENCRYPTION_KEY
   export NEW_ACCOUNT_ENCRYPTION_KEY
   withsettings npm run db:change-site-key
   unset NEW_ACCOUNT_ENCRYPTION_KEY
   ```

   Paste the new key and press Enter after the first `read`. The script re-encrypts every account's key, and every email waiting that has no account, in one transaction, so a failure leaves them as they were. It rewrites no event. **If it fails, nothing was changed:** read what it said, and start the site again with the old key, which is still in the settings file, with `sudo systemctl start croquetscores`. The site is then as it was, and the key can be tried again.

5. Set `ACCOUNT_ENCRYPTION_KEY` in `/etc/croquetscores/environment` to the new key, and start the site. **A site started with the old key after this is refused every account's key.**
6. In the LastPass note, make `ACCOUNT_ENCRYPTION_KEY` the new key, and rename the old line `ACCOUNT_ENCRYPTION_KEY_OLD`, with the date it stopped being used. Keep it for as long as any backup file made before that date is kept (backup-and-restore.md §5).

`ACCOUNT_EMAIL_ADDRESS_HASH_KEY` is not changed at all.

## 7. Rehearsal

TODO.md asks that this be written down by doing it. **The operator has followed the sequences in §2 and §4 on the real server** (October 2026) and reports that they worked, so the commands there are no longer only what the repository suggests. The rest of the rehearsal is still to do:

- Do §5's going back once, by the rename, to see that the older build comes up.
- Do backup-and-restore.md §7 steps 2–6 into a throwaway database, and time step 5.
- Say in README.md that they have now been followed start to finish, and on what date.
