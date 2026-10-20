# backup-and-restore.md — Keeping a copy of the website, and getting it back

How the website's data is copied to another machine, how to know it is working, and how to rebuild the website from the copy. The backup is run, and its emails are read, by Tim Murphy (croquetscores@gmail.com). If it stops, or a restore is needed, he is the person to tell.

The behaviour is specified in `specs/infrastructure/maintenance/backupCli.feature` and `pgDump.feature`; this says how to use it.

---

## 1. What is copied, and what is not

The website keeps everything it knows as **events**, one after another, and never changes or deletes one. Every list and page on the site is made from them, and can be made again. So a copy of the events is a copy of the website.

Copied:

- Every event (`events`).
- Each account's own key (`account_keys`), sealed, as the website has it.

Not copied, and what that costs:

- **The read models.** They are made again from the events after a restore.
- **Sessions.** Everybody is signed out after a restore.
- **Emails waiting in the queue.** Whatever had not been sent when the website was lost is not sent.
- **`ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` themselves.** **These are kept by hand, see §4.**

The events hold names and email addresses sealed with a key of each account's own, and those keys are not in the events, so the keys are copied with them or the copy could not read anybody's name.

## 2. What each run does

`npm run db:backup`, from the folder of this repository on Tim's computer:

1. Runs `pg_dump` against the website's database, asking for the two tables above and no other. It never changes the database, and does not turn the website off. pg_dump reads both tables at one moment, so the keys in a copy are the keys of the events in it.
2. Writes the result to a file of its own in `DATABASE_BACKUP_FOLDER`, named for the moment the run began, in UTC: `2026-10-13-10-00-00.dump` is the 13th of October 2026 at ten o'clock UTC, year, month, day, hour, minute and second.
3. Emails `ADMINISTRATOR_EMAIL_ADDRESS` how it went: that it worked, what the file is called, how big it is and how long it took, or which step failed and why.

It exits with failure whenever anything failed, so the scheduler can show it, and says on the screen what the email says.

**Every run makes a file of its own.** A file is never replaced, appended to or removed by the next run, so the folder is a history of the website, a file at a time. It also means the folder grows, and **removing old files is yours to do**, §5. A file is written under a name ending `.partial` while pg_dump makes it, and given its name only when pg_dump has finished, so a name with nothing after `.dump` is a whole copy. One that was left behind with `.partial` is from a run that was stopped and can be deleted.

**A run that fails is not a lost backup.** The files already there are as they were. What a failure means is that the newest is out of date by however long it has failed.

## 3. Setting it up

On Tim's computer, in `.env`:

- **`WEBSITE_DATABASE_URL`** — The website's database, as reached through the tunnel below. Only ever read
- **`DATABASE_BACKUP_FOLDER`** — The folder a file is written to each run. **It must be there already**: it is not made, so a disk that is not plugged in fails
- **`PG_DUMP_PATH`** — Only where `pg_dump` is not found by that name. Name its `pg_dump.exe`; `db:restore` looks for `pg_restore.exe` in the same folder
- **`ADMINISTRATOR_EMAIL_ADDRESS`** — Who is told how every run went, and who the emails are sent from: `croquetscores@gmail.com`
- **`ADMINISTRATOR_EMAIL_FROM_NAME`** — The name the emails are sent from and signed off with
- **`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER_NAME`, `SMTP_PASSWORD`** — The mail server the emails are handed to: Brevo's, the same four values as the website's (`.env.production`). All four or none (see Email, below)
- **The rest** — As the site needs them (`.env.example`): the script is started as the site is

**pg_dump has to be installed on that computer, and be at least the version of the website's Postgres: 18 or later**, which is the version Kamatera's PostgreSQL image came with (server-setup.md §3). A computer with 17 will refuse. The same goes for `pg_restore`, which restores the file into the new Postgres. pg_dump refuses to dump a server newer than itself and says so. `pg_dump --version` says which one is found.

### Reaching the website's database

The website's Postgres listens on the server itself only, and the server's firewall keeps its port shut (server-setup.md §2 and §3). **A database open to the world is not the answer.** This computer reaches it through an **SSH tunnel**: a connection to the server that carries traffic for the database's port, so that `127.0.0.1:55432` on this computer is `127.0.0.1:5432` on the server. Port 55432 is only a free port on this computer that does not clash with a Postgres of its own on 5432.

The tunnel needs a key of its own, because the scheduled task cannot type a passphrase. Make one for this and nothing else, and let it do nothing but open that tunnel.

1. **On this computer** (Windows PowerShell; the OpenSSH client is part of Windows 10 and later). Make the key with no passphrase, and print its public half:

   ```powershell
   ssh-keygen -t ed25519 -C croquetscores-backup -f $env:USERPROFILE\.ssh\croquetscores_backup
   Get-Content $env:USERPROFILE\.ssh\croquetscores_backup.pub
   ```

   `ssh-keygen` asks twice for a passphrase. **Press Enter both times, leaving it empty.** Do not pass `-N '""'` to leave it empty: in some versions of PowerShell that sets the passphrase to the two characters `""`, which nobody remembers, and the scheduled task then waits for a passphrase that cannot be typed. If `ssh` asks "Enter passphrase for key" when the tunnel is opened (below), the key has one: make it again.

   The public half is the line starting `ssh-ed25519`. It is not secret. The private half, the file without `.pub`, is: it is the one thing on this computer that lets the backup in, so it stays here, and is not copied to the password manager or to the backup folder (recovery.md §2).

2. **On the server,** signed in as `deploy`, add the public half to `deploy`'s keys **with restrictions in front of it**, so that this key can open the one tunnel and can do nothing else:

   ```bash
   echo 'restrict,port-forwarding,permitopen="127.0.0.1:5432",command="/bin/false" ssh-ed25519 AAAA…the rest of the line… croquetscores-backup' >> ~/.ssh/authorized_keys
   ```

   `restrict` switches off everything, `port-forwarding` switches that one thing back on, `permitopen` allows it to reach the database's port and no other, and `command="/bin/false"` means that a shell is not given even if one is asked for.

3. **Once, by hand,** open the tunnel from this computer and say yes to the question about the server's fingerprint. This puts the server in this computer's `known_hosts`, which the scheduled task needs because nobody is there to answer it:

   ```powershell
   ssh -N -L 55432:127.0.0.1:5432 -i $env:USERPROFILE\.ssh\croquetscores_backup deploy@<the server's address>
   ```

   It prints nothing and does not return, which is it working. Leave it open and, in a second window, run the backup (below). `Ctrl+C` closes the tunnel.

4. **`WEBSITE_DATABASE_URL`** in this computer's `.env` is then:

   ```
   postgres://croquetscores:<the password>@127.0.0.1:55432/croquetscores
   ```

   with the `croquetscores` user's password from server-setup.md §3, written as it is, being letters and digits (configuration.md §3 says when a password has to be percent-encoded). The tunnel has to be up for as long as `npm run db:backup` is running, and for no longer.

### Running it every day

Task Scheduler cannot keep a tunnel up by itself, so the task runs a short script that opens the tunnel, takes the backup, and closes the tunnel. Keep the script outside the repository, as `C:\Backups\backup-with-tunnel.ps1` or wherever suits, because it has the server's address in it. **Change the three values at the top** (`999.9.999.99` is a stand-in for the server's address).

```powershell
$server     = 'deploy@999.9.999.99'          # the server's address, as in the ssh line above
$repository = 'C:\path\to\croquetscores.com'
$key        = "$env:USERPROFILE\.ssh\croquetscores_backup"

$tunnel = Start-Process ssh -PassThru -WindowStyle Hidden -ArgumentList @(
  '-N', '-L', '55432:127.0.0.1:5432', '-i', $key,
  '-o', 'ExitOnForwardFailure=yes', '-o', 'ServerAliveInterval=30',
  '-o', 'BatchMode=yes', $server)
try {
  Start-Sleep -Seconds 5          # long enough for the tunnel to be up
  Set-Location $repository
  npm run db:backup
  $code = $LASTEXITCODE
} finally {
  Stop-Process -Id $tunnel.Id -ErrorAction SilentlyContinue
}
exit $code
```

`BatchMode=yes` makes ssh fail, and not wait for an answer, if it would have to ask anything. `ExitOnForwardFailure=yes` makes it fail if the port is taken. A failed tunnel then shows as the backup's own "could not connect" (§6), and the script exits with the backup's own result, so the scheduler shows a failure.

Then ask the operating system's scheduler to run it. On Windows, Task Scheduler: a task that runs **daily**, with

- Program: `powershell.exe`
- Arguments: `-NoProfile -ExecutionPolicy Bypass -File C:\Backups\backup-with-tunnel.ps1`
- Start in: the folder of this repository

and set to run when the computer is on and whether or not Tim is signed in, and to run as soon as possible after a missed start, so that a computer that was off at the time catches up. How often is Tim's to choose; the most the website can lose is what happened since the last run that worked.

**Run the script once by hand** from a PowerShell window and read what it says before trusting the schedule, and then run the task from Task Scheduler once with "Run", to see that it works without anyone signed in to answer a question.

### Email

Each run emails `ADMINISTRATOR_EMAIL_ADDRESS` through Brevo, in the same way as the website's own emails. That works from this computer when its `.env` has the four `SMTP_` settings above, with the same values as the website's. The subject says how it went:

- **A success:** `Croquet Scores database backup worked`
- **A failure:** `WARNING: Croquet Scores database backup FAILED`. Any failure, whichever step it was, so a subject that begins `WARNING:` is the one to read.

**With none of the four `SMTP_` settings in `.env`, nothing is sent.** The email is written as a file in `temp/` of this repository, as the website's are in development, and nothing arrives in `croquetscores@gmail.com`. The screen and the scheduler's last result still say how it went. A part-set mail server (some of the four, not all) stops the script starting, and says which are missing.

**Check it once, by hand:** run `npm run db:backup` (with the tunnel up) and see that the success email arrives in `croquetscores@gmail.com`, and not in the spam folder. If it lands in spam, mark it as not spam, and make a filter for the subject `Croquet Scores database backup`. Do not rely on a failure email arriving until you have seen a success one.

## 4. What must be kept by hand, away from the website's machine

A copy of the events does not get anybody back without these, and neither is in the database:

- **`ACCOUNT_ENCRYPTION_KEY`.** Opens every account's key. Lost, every name and email address in the events is unreadable for good.
- **`ACCOUNT_EMAIL_ADDRESS_HASH_KEY`.** Finds an account by its email address. It can never be changed. Lost, nobody can sign in by their email address, and there is no way to make it again.

Both are in the website's `.env` (on the server, `/etc/croquetscores/environment`), which is the place that is lost with the website. **The whole of that file is kept in LastPass, in the notes of the item for kamatera.com.** So the two keys are there, with `SESSION_COOKIE_SECRET`, `TOKEN_SIGNING_KEY`, the database's password and the Google, reCAPTCHA and Brevo keys. Only the two named above matter to the data: losing the others does no harm to it, and costs a morning.

LastPass is a copy, and a copy goes out of date. **Update the note whenever the file changes,** and check it once: that the keys in the note are the ones the website is running with (`sudo grep ACCOUNT_ /etc/croquetscores/environment` on the server), not an older set written down before a change. Whoever Tim chooses to reach LastPass if he cannot should know that the note is there (recovery.md §2).

## 5. Knowing it is working, and keeping the folder

- **Each run's email** says it worked, and what the file is called and how big it is. Files that are very much smaller than the one before are something to look at. A subject that begins `WARNING:` means it failed (§6).
- **No email at all** is a failure: the task did not run, the computer was off, or the email could not be sent. Look at the scheduler's last result, and at the newest file's name in the folder.
- **Once a month**, read one back: `pg_restore --list <file>` names what is in it, and should list the tables `events` and `account_keys` and their data. A backup that has not been read back is a hope.
- **Removing old files is yours to do**, and is also a decision: an account that is forgotten on the website is forgotten by deleting its key there, for good, but **a file made before then still has the key, and the account stays readable in it** for as long as the file is kept. So how long files are kept is how long a forgotten account lasts. Keep fewer than you would like to, and none of the ones from before an account was forgotten past what you have told that person.

## 6. When a run fails

The email, and the screen, say which step failed and why.

- **making the dump** — Read the reason: it is pg_dump's own words. Nothing was kept. See below for the ones that are usual
- **that the website's database is not named** — `WEBSITE_DATABASE_URL` is blank
- **that the folder is not named** — `DATABASE_BACKUP_FOLDER` is blank
- **that the folder is not there** — The folder named does not exist, or its disk is not plugged in. Nothing was made

The reasons that are usual for making the dump:

- **pg_dump could not be run** — it is not on the computer's path. Name it in `PG_DUMP_PATH`.
- **server version mismatch** — pg_dump is older than the website's Postgres. Install a newer one and name it in `PG_DUMP_PATH`.
- **could not connect** — the website's database could not be reached from this computer. Is the website up? Is the tunnel up? Run the tunnel's `ssh -N -L …` line by hand to see why not: a changed server address, a key that is no longer in `authorized_keys`, or a port 55432 that something else is using.
- **password authentication failed** — the user or password in `WEBSITE_DATABASE_URL` is not the database's.
- **a file of that name was already there** — two runs began in the same second. Run it again.

## 7. Restoring

A restore is making a new website's database from a file. It is done when the website's database is lost or ruined; it is not how to undo something somebody did on the site, which the website's own events already say.

What you need: a file of the folder (the newest, unless it is the newest that is wrong, since their names sort in the order they were made), the two keys of §4, and a Postgres for the new website to use.

1. **Stop the site**, if anything is still running against the old database.
2. **Restore the file into a new database**, with the script, which is told the name of the database to make and the file, and nothing else:

   ```bash
   npm run db:restore -- <database-name> <the file>
   ```

   for example `npm run db:restore -- croquetscores-restore C:\DatabaseBackups\CroquetScores.Postgres\2026-10-15-21-40-20.dump`. It

   - makes the database on the Postgres `DATABASE_URL` names, as the user and with the password that gives, and **refuses, and does nothing, if a database of that name is already there**: it only ever makes one;
   - gives it the website's tables, by running the migrations, since the file holds the data of two tables and not the tables of the rest of the website;
   - has `pg_restore` put the file's data into them, finding it beside the `pg_dump` that `PG_DUMP_PATH` names, or by the name `pg_restore` where that is blank;
   - and if any of that fails, **drops the database it made** and says why, so that the same name can be tried again. It never drops one it did not make.

   `DATABASE_URL` is only where the Postgres is: the database it names is not touched.

3. **Watch what it says.** It says each thing as it is done: `Database '<name>' was created`, then `Importing '<file>'...`, which is the part that takes a while, and at the end that the file was restored into it and that the read models are still to be made (step 5).
4. **Settings of the new website.** In its `.env` or environment: `DATABASE_URL` the database step 2 made, and `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` the same as the lost website's, as kept in §4. The others as the deployment needs.
5. **Make the read models**, which a restore has to do, since the file has none:

   ```bash
   npm run db:rebuild-read-models -- --minutes 30
   ```

   The site says it is down for maintenance while it runs. It says how far it has got every ten seconds.

6. **Start the site** and look at it: the home page, a tournament, sign in with an account you know, and read a name that is personal to an account. A name that cannot be read means the wrong `ACCOUNT_ENCRYPTION_KEY`.
7. **Sign-ins and emails.** Everybody has been signed out. Emails that were waiting were not copied and are not sent; whoever asked for a link, such as a password reset, asks again.
8. **Point the backup at the new website** (`WEBSITE_DATABASE_URL`), and run `npm run db:backup`. It makes a file of its own, as every run does, and the first of the new website.

### 7.1 Loading a file onto the Kamatera server

The steps above are for any new website. This is the same restore done on the server the guide sets up (server-setup.md), where an empty `croquetscores` database already exists from the migration. `db:restore` only ever makes a new database and refuses if one of that name is there, so the file is restored into a new name and the names are swapped. Do it as `deploy`, on the server.

**First check the account keys.** `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` in `/etc/croquetscores/environment` must be the same as the ones that sealed the data in the file (§4). Different keys leave every name and email address in it unreadable for good.

1. **Copy the file to the server,** from your own computer. In WSL, `C:\DatabaseBackups` is `/mnt/c/DatabaseBackups`:

   ```bash
   scp "/mnt/c/DatabaseBackups/CroquetScores.Postgres/<file name>.dump" deploy@<server ip address>:~/
   ```

2. **Stop the site, on the server:**

   ```bash
   sudo systemctl stop croquetscores
   ```

3. **Let the site's database user make a database,** which it needs for the restore:

   ```bash
   sudo -u postgres psql -c "alter user croquetscores createdb;"
   ```

4. **Restore into a new database,** with the site's settings, through `withsettings` (deploying.md §1):

   ```bash
   cd /srv/croquetscores/site
   withsettings npm run db:restore -- croquetscores_restored ~/2026-10-15-21-40-20.dump
   ```

   It says each step as it goes. If it fails it drops the database it made, so the same name can be tried again.

5. **Swap the names,** so that `DATABASE_URL` and the backup's settings do not change. The empty database is kept, renamed, until you are sure:

   ```bash
   sudo -u postgres psql -c 'alter database croquetscores rename to croquetscores_empty;'
   sudo -u postgres psql -c 'alter database croquetscores_restored rename to croquetscores;'
   ```

6. **Make the read models,** which a restore never carries. The number is the minutes visitors are told the site is down, so give more than you expect:

   ```bash
   withsettings npm run db:rebuild-read-models -- --minutes 30
   ```

7. **Start the site and look at it:**

   ```bash
   sudo systemctl start croquetscores
   curl -s http://127.0.0.1:3000/api/v1/health
   ```

   Open the site, a tournament, and sign in with an account from that data. A name that shows as unreadable means the account keys are not the file's.

8. **Clean up.** Delete the copy of the file, and when you are sure, the empty database, and take back the permission to make databases:

   ```bash
   rm ~/2026-10-15-21-40-20.dump
   sudo -u postgres psql -c 'drop database croquetscores_empty;'
   sudo -u postgres psql -c "alter user croquetscores nocreatedb;"
   ```

Everyone is signed out afterwards, and emails that were waiting in the queue when the file was made are not in it.

**Practise it.** A backup that has not been restored from is a hope. Do steps 2–6 once into a throwaway database (a name you will then drop) before the beta opens, and write down how long step 5 took, which is what you will tell people the site is down for. I, Tim Murphy, have practised restore without issue.

## 8. What this does not do

- **It is not a replacement for the website's host's own backups,** if the host has them. It is a second copy, somewhere else, that the host's failure does not take.
- **It does not copy anything but the events and the keys.** What the host keeps beside the database (uploaded files, if there ever are any) is the host's to back up.
- **It does not remove its own files.** The folder grows until somebody removes from it, and a forgotten account stays readable in the files made before it was forgotten (§5).
- **It does not stop somebody who can reach the website's database from changing events.** Events are never changed by the site, but a file only says what the tables held at the moment it was made, and nothing here compares one with another.
- **It is a copy of one moment each time, and not a history of changes.** Each file is the whole of the tables as they were, so the website as of any file can be read from that file alone.
