# Deploying

Putting a new build of the website up, and taking it down again. The server is already set up (server-setup.md).

**The order is: copy the data, keep the build that is running, build, migrate, restart, look.** The data is copied first because a migration is the one step that cannot be undone (§5), and the running build is kept so that going back is a rename (§5).

## 1. Running a script on the server

The site's scripts (`npm run db:migrate` and the others) read their settings from the environment, as the site does, and there is no `.env` on the server. So they are run with the service's settings loaded **for that one command**. Use a helper for it, `withsettings`, which the server setup makes (server-setup.md §6, step 5, "Install, build and migrate"; the command is there and only there, so that two copies cannot differ). It is a small script on the path and not a function in `~/.bashrc`, so that it is found by every shell, including the one `ssh deploy@server 'command'` starts. If you made the first version of it, a `withsettings()` line in `~/.bashrc`, delete that line: it does the same, but would be used in place of the script.

Put `withsettings` in front of a script, as `withsettings npm run db:migrate`. The command, **and whatever it starts**, has the settings: for `npm run db:migrate` that is npm, `tsx` and any script a package runs with them. Nothing else you type has them, `git` and the install scripts of `npm ci` among them, and they are not left in your shell afterwards. That is the whole of what it does: it is less exposure than putting the settings in the shell, and more than none. Commands that do not need the settings, `npm ci` and `npm run build`, are run without them. The packages are the ones the lockfile names, since `npm ci` installs exactly those.

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
( [ -e deploy-finished ] || { echo "The last deploy did not finish: put site.previous back (deploying.md §5) before deploying again."; false; } ) &&
rm -rf site.previous.new &&
cp -a site site.previous.new &&
rm -rf site.previous &&
mv site.previous.new site.previous &&
cd site &&
git fetch --tags &&
git checkout <the tag or commit> &&
rm ../deploy-finished &&
npm ci &&
npm run build &&
withsettings npm run db:migrate &&
sudo systemctl restart croquetscores &&
touch ../deploy-finished
```

The lines are joined with `&&` so that if one fails the rest do not run, and in particular the site is not restarted after a failed build. Use the tag or commit, not "whatever is on main" (§3). `site.previous` is the code, the packages and the build as they were running, about 350 MB, and only the last one is kept. It is copied under another name and renamed into place only when the copy has finished, so a copy that fails (a full disk) leaves the old `site.previous` as it was.

**The file `deploy-finished` says that the last deploy ran to its end.** It is removed just before `npm ci`, the first step that changes what the running site is running from, and made again when the restart has succeeded, so a deploy that failed from there on leaves no file. The first line of the sequence refuses to go on without it, and says why: otherwise a second run after a failed build would copy the failed folder over `site.previous`, the one good copy. A failure before that point, such as a mistyped tag, has changed nothing, leaves the file, and the sequence can be run again as it is. The file is made once at the end of the server setup (server-setup.md §6, step 8), and again by going back (§5). **Do not make it by hand to get past the first line:** a folder that failed looks the same as a good one, and going back is the one way of making the file honestly.

Then look (operations.md §1): `curl -s https://<the site's name>/api/site/health`, the home page, and a page of a tournament. The footer of any page says which version is running, as `v233`: the number of times `main` has moved, worked out by `npm run build` from the history on the server. It should be one more than it was before a deploy of one merge, and it is the quickest way to see that the new build is the one being served. A server whose clone is cut short (`git clone --depth`) builds with no version and shows none.

What each step does, and what can go wrong:

- **`cp -a site site.previous`** is what makes going back a rename (§5). If `site.previous` is not there, the way back is to build the old version again, which is slower and can fail.
- **`npm ci` and `npm run build`** replace `node_modules` and rewrite `dist/` **while the site is running from them.** The site has its code in memory, so most requests go on being answered, but a file it loads late (an admin or help page, say) can be missing for the minutes this takes, and a request for it fails. Building into a separate folder and switching to it at the restart would remove this, and is not done: it is more to set up and more to keep, for a beta of a few people. At the size of a beta that is accepted: do it at a quiet time. If you would rather not take the risk, or the release needs the site off anyway, stop the site first and use the sequence in §4.
- **An `npm ci` or a build that fails** leaves `node_modules` or `dist/` half written, and **the next time the site starts it starts from that**, whether you restart it, or the server reboots, or the site crashes and systemd starts it again. The `&&` stops the restart, but it does not make the running site safe. If either fails, put `site.previous` back before anything else (§5), then find out why it failed. **The sequence will not run again until you have:** `deploy-finished` is missing after a failure, and its first line stops.
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

**Give it more minutes than you expect,** since it is the number readers are told. A rebuild has been timed at 3.8 minutes. How long it takes follows the number of events, since every one is replayed, so time it again when there are many more, and write the new time here.

**Do not turn access off first with `db:access`.** The rebuild refuses when access is already off, saying `Database access is already off.`, because that means somebody else is doing maintenance. If it says so and nobody is, `npm run db:access -- on` (operations.md §3) turns it on.

**When a migration cannot be lived with by the running site,** or the release is better put up with the site off, stop the site first and put the new version up while nothing is using it. Readers get the proxy's "bad gateway" for the minutes this takes, since the site that would show a maintenance page is the one that is stopped. The same steps as §2, with the stop first, the rebuild before the start where the release needs one, and the start last:

```bash
cd /srv/croquetscores &&
( [ -e deploy-finished ] || { echo "The last deploy did not finish: put site.previous back (deploying.md §5) before deploying again."; false; } ) &&
sudo systemctl stop croquetscores &&
rm -rf site.previous.new &&
cp -a site site.previous.new &&
rm -rf site.previous &&
mv site.previous.new site.previous &&
cd site &&
git fetch --tags &&
git checkout <the tag or commit> &&
rm ../deploy-finished &&
npm ci &&
npm run build &&
withsettings npm run db:migrate &&
withsettings npm run db:rebuild-read-models -- --minutes 30 &&
sudo systemctl start croquetscores &&
touch ../deploy-finished
```

Leave the rebuild line out where the release does not need it. **After a failure, put `site.previous` back (§5) before running this again:** the first line stops it without `deploy-finished`, for the reason given in §2. **If a step fails the site is left stopped, on purpose:** it must not be started on a build that did not finish, or on a schema half changed. Find out why it failed. To put the old version back, see §5.

## 5. Going back

Two kinds of thing are put up, and they go back differently.

**The code: a rename.** `site.previous` is the code, packages and build as they were running before the last deploy (§2), so going back is putting it where `site` is:

```bash
cd /srv/croquetscores &&
( [ -d site.previous ] || { echo "There is no site.previous to go back to: see the paragraph after this block."; false; } ) &&
sudo systemctl stop croquetscores &&
rm -rf site.failed &&
mv site site.failed &&
mv site.previous site &&
sudo systemctl start croquetscores &&
touch deploy-finished
```

The second line stops the sequence before anything is stopped or moved if there is no `site.previous`, so the site is left as it was. `rm -rf site.failed` clears away a version put aside by an earlier going back, which would otherwise be in the way; the one put aside by this one is kept, so look at it if you want to know why it failed, and it is cleared by the next. The last line says the folder now in place is a good one, so that the next deploy is let to copy it.

Look at the site (operations.md §1).

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
4. Give the script the new key without typing it on the command line, where it would be kept in the shell's history. `read -rs` asks for it and does not show what you paste, so it is asked for **twice**, and the script is not run unless the two are the same: a key that was mistyped once would be used to re-encrypt every account, and be unreadable the moment the real one was put in the settings file. The settings file still has the old key, which is what the script is to find:

   ```bash
   cd /srv/croquetscores/site
   read -rsp "New key: " NEW_ACCOUNT_ENCRYPTION_KEY; echo
   read -rsp "Again: " again; echo
   if [ "$NEW_ACCOUNT_ENCRYPTION_KEY" = "$again" ]; then export NEW_ACCOUNT_ENCRYPTION_KEY; withsettings npm run db:change-site-key; else echo "The two do not match. Nothing was changed."; fi
   unset NEW_ACCOUNT_ENCRYPTION_KEY again
   ```

   Paste the new key from the LastPass note at each prompt, and press Enter. The script re-encrypts every account's key, and every email waiting that has no account, in one transaction, so a failure leaves them as they were. It rewrites no event. **If it fails, nothing was changed:** read what it said, and start the site again with the old key, which is still in the settings file, with `sudo systemctl start croquetscores`. The site is then as it was, and the key can be tried again.

5. Set `ACCOUNT_ENCRYPTION_KEY` in `/etc/croquetscores/environment` to the new key (paste it from the LastPass note, not from memory), and start the site. **A site started with the old key after this is refused every account's key.** Then sign in with an account and check that a name is readable (backup-and-restore.md §7.1, step 7). A name that is not readable means the key in the settings file is not the one the script used.
6. In the LastPass note, make `ACCOUNT_ENCRYPTION_KEY` the new key, and rename the old line `ACCOUNT_ENCRYPTION_KEY_OLD`, with the date it stopped being used. Keep it for as long as any backup file made before that date is kept (backup-and-restore.md §5).

`ACCOUNT_EMAIL_ADDRESS_HASH_KEY` is not changed at all.

## 7. Rehearsal

The issue https://github.com/CroquetScores/croquetscores.com/issues/286 (A deployment and rollback runbook) asks that this be written down by doing it. **The operator followed the sequences in §2 and §4 on the real server** (October 2026) and reported that they worked. They have been changed since (the copy under another name, the `deploy-finished` file, the check before going back), and **the changed form has not been run yet.** The rest of the rehearsal is still to do:

- Run the changed §2 once on the real server, and read that it makes `deploy-finished` again.
- Do §5's going back once, by the rename, to see that the older build comes up.
- Do backup-and-restore.md §7 steps 2–6 into a throwaway database, and time step 5.
- Say in README.md that they have now been followed start to finish, and on what date.

## 8. Deploying with a script, from your computer or from GitHub

Nothing deploys on a merge. A deploy is started by a person, in one of two ways, and both end in `scripts/deploy.sh`, which is §2 as one script and runs on the server. CI is not run again on `main` (§3), so what is deployed from `main` has already passed.

- **From your computer: `npm run deploy`.** It deploys `origin/main`, the commit GitHub has for `main`, and not the `main` of your computer, which may be behind or ahead. It asks GitHub for what is new first. `npm run deploy -- my-branch` deploys your computer's branch of that name, and `npm run deploy -- origin/my-branch` GitHub's copy of it. A branch that is only on your computer is refused, with a reminder to push it, because the server gets its commits from GitHub. It signs in as `deploy` with your own key, as you do by hand, and needs `DEPLOY_SSH_HOST` (the server's address, as in `.env.example`) in your `.env`.
- **From GitHub: Actions, Deploy, Run workflow** (or `gh workflow run deploy.yml`). It deploys the branch chosen in "Use workflow from", which is `main`. The `production` environment lets only `main` read the key (below), so another branch is refused there; deploy it from your computer.

The manual sequences in §2 and §4 still work, and are what to use for a release that needs the site stopped (§4): the script does not stop the site.

**What it does differently from §2:**

- **The copy of the data is taken on the server,** with the same `pg_dump` of the same two tables as `npm run db:backup`, into `/srv/croquetscores/before-deploy/`, and the last five are kept. A deploy does not go on if it fails. It is not the off-site backup (backup-and-restore.md): that is still the daily one from the operator's computer, and a copy on the server is lost with the server. It is there so that a migration that goes wrong can be restored from without anybody having remembered to run the backup first. Restore it as backup-and-restore.md §7 says.
- **A failure before the migration puts the old build back by itself** (§5, the rename), because the database has not been touched. That includes the run being stopped (the workflow's twenty-minute limit, a cancelled run, a dropped connection). It marks the deploy finished only when the old build answers its health address. It leaves the failed folder as `site.failed`. A failure in or after the migration does not: the old code may not live with the new schema, so the site is left for a person, and `deploy-finished` is not made, so the next deploy refuses to run until §5 has been followed.
- **It looks at the site after the restart:** the health address on the server for up to a minute, and then from the workflow through the proxy.
- **It only puts up a commit that comes after the one running,** so that a run started again from GitHub's Actions page after a later merge does no harm, and does nothing where the commit is already running. Where what is running is not on `main`'s line (a branch deployed by hand), it refuses, and the way back onto the line is a deploy by hand (§2).

The script also writes what it says to `/srv/croquetscores/deploy.log`, so that what happened is there when the connection was lost and the run's own log stops short. A failed run shows red in GitHub and emails whoever is set to be told of failed runs in their GitHub notification settings. Its log says which step failed.

### Setting it up, once

These are for the workflow in GitHub. `npm run deploy` needs none of it.

**1. On your computer, make a key for this and nothing else,** with no passphrase because nobody is there to type one (see the warning about `-N` in backup-and-restore.md §3 if you are on PowerShell):

```bash
ssh-keygen -t ed25519 -C croquetscores-github-deploy -f croquetscores_github_deploy
cat croquetscores_github_deploy.pub
```

The second command prints the public half, the one line starting `ssh-ed25519`, which step 2 puts on the server. It is not secret. (In PowerShell, `Get-Content croquetscores_github_deploy.pub`.) The private half, the file without `.pub`, is what step 3 puts in GitHub.

**2. On the server, as `deploy`, install the script and allow the key to run it and nothing else.** The script is installed from the checkout, and again whenever it changes in a pull request (the deploy says so, with a warning, when the commit it has put up has a different one):

```bash
sudo install -m 755 /srv/croquetscores/site/scripts/deploy.sh /usr/local/bin/croquetscores-deploy
echo 'restrict,command="/usr/local/bin/croquetscores-deploy" ssh-ed25519 AAAA…the public half… croquetscores-github-deploy' >> ~/.ssh/authorized_keys
```

`restrict` switches off everything, and `command=` means whatever is asked for, the key runs only that, with what was asked for given to it as the commit to deploy. The script refuses anything that is not 40 hexadecimal digits. This is why the key can be a secret in GitHub: all it can do is deploy a commit of this repository, and not the commit nobody has merged unless somebody has pushed it to the repository.

Run it once by hand before relying on it, from your computer, with the commit that is already running so that it has nothing to change, and see `deploy: … is already what is running. Nothing to do.`:

```bash
ssh -i croquetscores_github_deploy deploy@<the server's address> $(git rev-parse origin/main)
```

(Use the commit the server is on. A different one will deploy it.)

**3. In GitHub, Settings, Environments, New environment, `production`.** Add:

- Secret `DEPLOY_SSH_KEY`: the private half, the file `croquetscores_github_deploy` (the one without `.pub`), the whole of it including its first and last lines, `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`. Print it with `cat croquetscores_github_deploy` (in PowerShell, `Get-Content croquetscores_github_deploy`) and paste it in.
- Secret `DEPLOY_SSH_HOST`: the server's IP address and nothing else, as `83.229.75.252` is written, with no `deploy@` before it, no port and no name. The workflow adds the `deploy@` itself.
- Secret `DEPLOY_SSH_HOST_KEY`: the server's own key, as a `known_hosts` line. Get it **on your own computer, not on the server:** the file `~/.ssh/known_hosts` there lists the servers that computer has signed in to, and the server has never signed in to itself, so on the server this prints nothing. `ssh-keygen -F <the server's IP address>` prints it on a computer that has already signed in to the server and been shown its fingerprint. Ask for it by the IP address, the same as `DEPLOY_SSH_HOST`, since the workflow signs in by that and a `known_hosts` line is matched on exactly what was typed. It prints `# Host … found: line N`, which is a comment, and then the line itself, or a line for each kind of key the server offered: copy the lines that are not the comment, starting `|1|` or the address, and paste them all as the secret. A line starting `|1|` is the same address written so that it cannot be read back, and works just as well. It is pinned so that the workflow cannot be talked into signing in to something that is not the server.
- Variable `SITE_ADDRESS`: the site's name, as the health check in §2 uses it.

Under "Deployment branches", choose **Selected branches** and name `main`, so that no other branch's workflow can read the key. If you want a person to look before each deploy, add yourself under "Required reviewers"; the deploy then waits for approval in GitHub.

**4. Delete the private key file on your computer,** `croquetscores_github_deploy` (the one without `.pub`), once it is in GitHub, or keep it with the other secrets (recovery.md §2). It is not needed again unless the server's `authorized_keys` is lost. Its other half, `croquetscores_github_deploy.pub`, is not secret and can go too: the server has its line in `authorized_keys`. Delete them from the folder you ran `ssh-keygen` in, and from the Recycle Bin if you are on Windows, since a deleted file is still there until that is emptied.

### Turning it off

Disable the workflow in GitHub (Actions, Deploy, the three dots, Disable workflow), which leaves `npm run deploy` working, or remove the key's line from `~/.ssh/authorized_keys` on the server, which is the one that works even if GitHub has been got into.

### Not yet done

Neither way has run for real. The first run of each is the rehearsal: be at the server for it, and watch. The same goes for §7: once it has run, say so there.
