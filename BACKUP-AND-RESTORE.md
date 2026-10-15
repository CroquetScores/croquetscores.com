# BACKUP-AND-RESTORE.md — Keeping a copy of the website, and getting it back

How the website's data is copied to another machine, how to know it is working, and how to rebuild the website from the copy. The backup is run, and its emails are read, by Tim Murphy (croquetscores@gmail.com). If it stops, or a restore is needed, he is the person to tell.

The behaviour is specified in `specs/infrastructure/maintenance/backupCli.feature`; this says how to use it.

---

## 1. What is copied, and what is not

The website keeps everything it knows as **events**, one after another, and never changes or deletes one. Every list and page on the site is made from them, and can be made again. So a copy of the events is a copy of the website.

| Copied                                                                 | Not copied, and what that costs                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Every event (`events`)                                                 | The read models. They are made again from the events after each backup, and again after a restore            |
| Each account's own key (`account_keys`), sealed, as the website has it | Sessions. Everybody is signed out after a restore                                                            |
| —                                                                      | Emails waiting in the queue. Whatever had not been sent when the website was lost is not sent                |
| —                                                                      | `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` themselves. **These are kept by hand, see §4** |

The events hold names and email addresses sealed with a key of each account's own, and those keys are not in the events, so the keys are copied with them or the copy could not read anybody's name. An account that is forgotten on the website is forgotten in the copy the next time the backup runs: its key is deleted there too.

## 2. What each run does

`npm run db:backup`, from the folder of this repository on Tim's computer:

1. Reads the website's database. It never changes it, and does not turn the website off.
2. Copies the events the website has and the backup database has not, **in one transaction**, with the accounts' keys. If anything goes wrong nothing is copied, and the next run copies it all.
3. Makes the backup database's read models again (`npm run db:rebuild-backup-read-models`), which turns nothing off and is not the site's own rebuild.
4. Emails `ADMINISTRATOR_EMAIL_ADDRESS` how it went: that it worked, and how many events and keys were copied and how long it took, or which step failed and why.

It exits with failure whenever anything failed, so the scheduler can show it, and says on the screen what the email says.

**A run that fails is not a lost backup.** The copy is whatever the last run that worked left. What a failure means is that it is out of date by however long it has failed.

Events are found by a number the database gives each as it is kept, so a run asks the website only for what came after the last one. It also looks back over the last 10,000 numbers, for an event kept after a later one by two commands appending at once. If you ever doubt a copy, or after a failure that you cannot explain:

```bash
npm run db:backup -- --all
```

compares every event there is. It is slow, and worth running now and then, say once a month, from the scheduler or by hand.

## 3. Setting it up

On Tim's computer, in `.env`:

| Setting                        | What it is                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `WEBSITE_DATABASE_URL`         | The website's database. Only ever read                                                                                        |
| `BACKUP_DATABASE_URL`          | The database the copy is written to: its own, and not `DATABASE_URL`. **Not the website's**: the script refuses if they match |
| `ACCOUNT_ENCRYPTION_KEY`       | The website's own. The backup refuses if it is not the one the website's keys were sealed with                                |
| `ADMINISTRATOR_EMAIL_ADDRESS`  | Who is told how every run went: `croquetscores@gmail.com`                                                                     |
| `EMAIL_FROM_ADDRESS`, the rest | As the site needs them (`.env.example`): the script is started as the site is                                                 |

The computer needs to reach the website's database, which the website's host decides how: the database's port opened to this computer only, or a tunnel. That is not settled until the host is (TODO.md, Hosting). A database open to the world is not the answer.

The backup database is made as development's is (`npm run db:up`), and migrated (`npm run db:migrate`) to the same migrations as the website's before the first backup, and again after every deploy that adds one. A backup to a database that is behind the website's will fail naming what is missing.

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

## 5. Knowing it is working

- **Each run's email** says it worked and how many events were copied. A day on which the website had events, and the email says 0, is something to look at.
- **No email at all** is a failure: the task did not run, the computer was off, or the email could not be sent. Look at the scheduler's last result.
- **Once a month**, run `npm run db:backup -- --all`, and compare the number of events in the two databases:

  ```sql
  select count(*) from events;
  ```

  on each. The backup one may be behind by what the website has had since, and must never be ahead.

## 6. When a run fails

The email, and the screen, say which step failed and why.

| It says the failure was…                 | What it means, and what to do                                                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reading the website's events             | The website's database could not be reached from this computer. Is the website up? Is the tunnel up? Try again; nothing was copied                             |
| reaching the backup database             | The computer's own Postgres is not running. `npm run db:up`                                                                                                    |
| copying the events                       | Read the reason. Nothing was copied. If it says an event **is not the same in both**, or **a number is another event's**, **stop and do not force it** (below) |
| that the site key is not the website's   | `ACCOUNT_ENCRYPTION_KEY` here is not the website's. Fix `.env`. The website may have had its key changed (`db:change-site-key`): see §4                        |
| rebuilding the read models               | The events and keys were copied; only the read models are behind. Run `npm run db:rebuild-backup-read-models` by hand and read what it says                    |
| that the backup database is not named    | `BACKUP_DATABASE_URL` is blank                                                                                                                                 |
| that the website's database is not named | `WEBSITE_DATABASE_URL` is blank                                                                                                                                |

**An event that is not the same in both** means the copy and the website have gone different ways, which events are never supposed to do. The backup will not overwrite either, on purpose. Do not delete the copy to make it go away: it may be the one that is right. Tell Tim (croquetscores@gmail.com), keep both databases as they are, and work out which is wrong before anything is changed.

## 7. Restoring

A restore is making a new website's database from the copy. It is done when the website's database is lost or ruined; it is not how to undo something somebody did on the site, which the website's own events already say.

What you need: the copy (the backup database), the two keys of §4, and a Postgres for the new website to use.

1. **Stop the site**, if anything is still running against the old database.
2. **Take the copy out of the backup database.** Bring it up to date first if the website is still there to copy from: `npm run db:backup`. Then:

   ```bash
   pg_dump --format=custom --file=website-copy.dump "$BACKUP_DATABASE_URL"
   ```

Or if running Postgres in Docker then:

```bash
docker exec -it croquetscores pg_dump --format=custom --file=website-copy.dump "$BACKUP_DATABASE_URL"
```

3. **Make the new database** and restore into it, under the name the new website's `DATABASE_URL` will give it (step 4):

   ```bash
   createdb <database-name>
   pg_restore --no-owner --dbname=<database-name> website-copy.dump
   ```

Or if running Postgres in Docker then:

```bash
docker exec -it croquetscores createdb -U postgres <database-name>
docker exec -it croquetscores pg_restore -U postgres --no-owner --dbname=<database-name> website-copy.dump
```

4. **Settings of the new website.** In its `.env` or environment: `DATABASE_URL` the new database, and `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` the same as the lost website's, as kept in §4. The others as the deployment needs.
5. **Migrate**, so that the database is at the migrations the code expects: `npm run db:migrate`.
6. **Make the read models again**, which a restore has to do whether or not the copy's were up to date:

   ```bash
   npm run db:rebuild-read-models -- --minutes 30
   ```

   The site says it is down for maintenance while it runs. It says how far it has got every ten seconds.

7. **Start the site** and look at it: the home page, a tournament, sign in with an account you know, and read a name that is personal to an account. A name that cannot be read means the wrong `ACCOUNT_ENCRYPTION_KEY`.
8. **Sign-ins and emails.** Everybody has been signed out. Emails that were waiting were not copied and are not sent; whoever asked for a link, such as a password reset, asks again.
9. **Point the backup at the new website** (`WEBSITE_DATABASE_URL`), and run `npm run db:backup`. The copy and the new website have the same events, so it should say it copied 0.

**Practise it.** A backup that has not been restored from is a hope. Do steps 2–7 once into a throwaway database before the beta opens (TODO.md, Backups), and write down how long step 6 took, which is what you will tell people the site is down for.

## 8. What this does not do

- **It is not a replacement for the website's host's own backups,** if the host has them. It is a second copy, somewhere else, that the host's failure does not take.
- **It does not copy anything but the events and the keys.** What the host keeps beside the database (uploaded files, if there ever are any) is the host's to back up.
- **It does not stop somebody who can reach the website's database from changing events.** The backup would then refuse (§6), which is how it would be found.
- **It is a copy, not a history.** It has the website as of the last run, and events are never changed, so nothing is lost by that, but a forgotten account is gone from it too, on purpose.
