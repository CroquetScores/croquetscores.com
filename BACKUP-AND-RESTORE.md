# BACKUP-AND-RESTORE.md — Keeping a copy of the website, and getting it back

How the website's data is copied to another machine, how to know it is working, and how to rebuild the website from the copy. The backup is run, and its emails are read, by Tim Murphy (croquetscores@gmail.com). If it stops, or a restore is needed, he is the person to tell.

The behaviour is specified in `specs/infrastructure/maintenance/backupCli.feature` and `pgDump.feature`; this says how to use it.

---

## 1. What is copied, and what is not

The website keeps everything it knows as **events**, one after another, and never changes or deletes one. Every list and page on the site is made from them, and can be made again. So a copy of the events is a copy of the website.

| Copied                                                                 | Not copied, and what that costs                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Every event (`events`)                                                 | The read models. They are made again from the events after a restore                                         |
| Each account's own key (`account_keys`), sealed, as the website has it | Sessions. Everybody is signed out after a restore                                                            |
| —                                                                      | Emails waiting in the queue. Whatever had not been sent when the website was lost is not sent                |
| —                                                                      | `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` themselves. **These are kept by hand, see §4** |

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

| Setting                       | What it is                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `WEBSITE_DATABASE_URL`        | The website's database. Only ever read                                                                                             |
| `DATABASE_BACKUP_FOLDER`      | The folder a file is written to each run. **It must be there already**: it is not made, so a disk that is not plugged in fails     |
| `PG_DUMP_PATH`                | Only where `pg_dump` is not found by that name. Name its `pg_dump.exe`; `db:restore` looks for `pg_restore.exe` in the same folder |
| `ADMINISTRATOR_EMAIL_ADDRESS` | Who is told how every run went, and who the emails are sent from: `croquetscores@gmail.com`                                        |
| The rest                      | As the site needs them (`.env.example`): the script is started as the site is                                                      |

**pg_dump has to be installed on that computer, and be version 17 or later**, which is the website's Postgres's. pg_dump refuses to dump a server newer than itself and says so. `pg_dump --version` says which one is found.

The computer needs to reach the website's database, which the website's host decides how: the database's port opened to this computer only, or a tunnel. That is not settled until the host is (TODO.md, Hosting). A database open to the world is not the answer.

Then ask the operating system's scheduler to run it. On Windows, Task Scheduler: a task that runs **daily**, with

- Program: `cmd.exe`
- Arguments: `/c npm run db:backup`
- Start in: the folder of this repository

and set to run when the computer is on and whether or not Tim is signed in, and to run as soon as possible after a missed start, so that a computer that was off at the time catches up. How often is Tim's to choose; the most the website can lose is what happened since the last run that worked.

Run it once by hand and read what it says before trusting the schedule.

### Email, until there is a mail provider

The website has no mail provider yet (TODO.md). Until it has, the email this sends is written as a file in `temp/` of this repository, as the site's own are in development, and nothing arrives in `croquetscores@gmail.com`. The screen and the scheduler's last result still say how it went. **Do not take the absence of a failure email for the backup working until a mail provider is set up and the first success email has been seen to arrive.**

## 4. What must be kept by hand, away from the website's machine

A copy of the events does not get anybody back without these, and neither is in the database:

- **`ACCOUNT_ENCRYPTION_KEY`.** Opens every account's key. Lost, every name and email address in the events is unreadable for good.
- **`ACCOUNT_EMAIL_ADDRESS_HASH_KEY`.** Finds an account by its email address. It can never be changed. Lost, nobody can sign in by their email address, and there is no way to make it again.

Both are in the website's `.env`, which is the place that is lost with the website. Keep each somewhere else — a password manager is the sort of place — with whoever Tim chooses to be able to reach them if he cannot. Also keep `SESSION_COOKIE_SECRET`, `TOKEN_SIGNING_KEY` and the Google and reCAPTCHA keys: losing those does no harm to the data, and costs a morning.

Check it once: that the copy of both is the one the website is running with, not an older one written down before a change.

## 5. Knowing it is working, and keeping the folder

- **Each run's email** says it worked, and what the file is called and how big it is. Files that are very much smaller than the one before are something to look at.
- **No email at all** is a failure: the task did not run, the computer was off, or the email could not be sent. Look at the scheduler's last result, and at the newest file's name in the folder.
- **Once a month**, read one back: `pg_restore --list <file>` names what is in it, and should list the tables `events` and `account_keys` and their data. A backup that has not been read back is a hope.
- **Removing old files is yours to do**, and is also a decision: an account that is forgotten on the website is forgotten by deleting its key there, for good, but **a file made before then still has the key, and the account stays readable in it** for as long as the file is kept. So how long files are kept is how long a forgotten account lasts. Keep fewer than you would like to, and none of the ones from before an account was forgotten past what you have told that person.

## 6. When a run fails

The email, and the screen, say which step failed and why.

| It says the failure was…                 | What it means, and what to do                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| making the dump                          | Read the reason: it is pg_dump's own words. Nothing was kept. See below for the ones that are usual |
| that the website's database is not named | `WEBSITE_DATABASE_URL` is blank                                                                     |
| that the folder is not named             | `DATABASE_BACKUP_FOLDER` is blank                                                                   |
| that the folder is not there             | The folder named does not exist, or its disk is not plugged in. Nothing was made                    |

The reasons that are usual for making the dump:

- **pg_dump could not be run** — it is not on the computer's path. Name it in `PG_DUMP_PATH`.
- **server version mismatch** — pg_dump is older than the website's Postgres. Install a newer one and name it in `PG_DUMP_PATH`.
- **could not connect** — the website's database could not be reached from this computer. Is the website up? Is the tunnel up?
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

**Practise it.** A backup that has not been restored from is a hope. Do steps 2–6 once into a throwaway database (a name you will then drop) before the beta opens (TODO.md, Backups), and write down how long step 5 took, which is what you will tell people the site is down for.

## 8. What this does not do

- **It is not a replacement for the website's host's own backups,** if the host has them. It is a second copy, somewhere else, that the host's failure does not take.
- **It does not copy anything but the events and the keys.** What the host keeps beside the database (uploaded files, if there ever are any) is the host's to back up.
- **It does not remove its own files.** The folder grows until somebody removes from it, and a forgotten account stays readable in the files made before it was forgotten (§5).
- **It does not stop somebody who can reach the website's database from changing events.** Events are never changed by the site, but a file only says what the tables held at the moment it was made, and nothing here compares one with another.
- **It is a copy of one moment each time, and not a history of changes.** Each file is the whole of the tables as they were, so the website as of any file can be read from that file alone.
