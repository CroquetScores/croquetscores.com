# summarising-the-log.md — The last day's log, summarised and emailed each morning

At five in the morning a script reads the last 24 hours of the site's log, has Claude write a summary of what went wrong, and emails it to `ADMINISTRATOR_EMAIL_ADDRESS`. It replaces reading the journal by hand each day (operations.md §2). The reasons, and every rule it keeps, are in `specs/infrastructure/maintenance/summariseLogCli.feature`; this is how to set it up and look after it.

It runs **on the Kamatera server**, as `deploy`, from cron, and needs the same settings the site has (the database and the mail server), which `withsettings` gives it, and one more: an API key for Claude.

## 1. What each run does

1. Reads the entries written in the last 24 hours at Warn or more severe from the log kept in the database, which holds seven days (`PostgresServerLog.feature`). The journal on the server is not read: it is the same log, and the database copy is the one the site can reach.
2. Replaces every email address in them with `[email address]`, so that none leaves the server.
3. Asks Claude for a summary, giving it the newest 300 entries at most and saying so if there were more. Claude is given no tools, so it can write a summary and do nothing else.
4. Emails the summary. **It does this on a quiet day too**, saying that nothing was written at Warn or more severe. An email every day means that a day without one is the day to look into.

Where Claude cannot be reached, or writes nothing, the email is still sent: it says the summary could not be written, how many entries there were at each severity, and what the newest few said. Where the log cannot be read, the email says that. Where the email cannot be sent the run fails, and says so in its log.

It does not read Caddy's log or say whether the site restarted. Those are the other two commands of the daily reading (server-setup.md §7), and are still done by hand.

## 2. Setting it up

Do these once, as `deploy`, after the site is running.

### Step 1. Get an API key

In the Anthropic Console, make a key for this and nothing else, so that it can be taken away alone. A day's summary is one request of a few thousand words at most, so the cost is small, but set a spending limit on the key's workspace anyway.

### Step 2. Give it to the script, and not to the site

`withsettings` gives a command the settings the site runs with. The key is kept beside them, in the same file and with the same permissions, as `ANTHROPIC_API_KEY`. The site ignores it: it never speaks to Claude, and a setting it was made to have is one more way for it to refuse to start (the script's own comment says the same).

### Step 3. Run it once by hand

```bash
cd /srv/croquetscores/site &&
withsettings npm run summarise:log
```

It prints a line only where something went wrong. Look in the inbox of `ADMINISTRATOR_EMAIL_ADDRESS`: an email headed `Croquet Scores log for` and today's date should be there. If the key is missing, the email says the summary could not be written, and the line above it says `ANTHROPIC_API_KEY is not set.`

## 3. Running it every morning

```bash
crontab -e
```

Add the line at the bottom, under the `PATH` line the export already needs. The server's time is UTC, so `0 5` is five o'clock in the morning in London in winter and six in summer; change the hour if it matters. The log is the last run's only, as the export's is:

```
0 5 * * * cd /srv/croquetscores/site && withsettings npm run summarise:log > /home/deploy/summarise-log.log 2>&1
```

## 4. Knowing it is working

- **An email every day.** None by nine means look at `cat ~/summarise-log.log`, which says the step and why.
- **The log's last line** says how the last run ended. It is overwritten each morning.
- **A summary that says it could not be written** is a key that is wrong, a limit that was reached, or Claude being away. The line above it in `~/summarise-log.log` says which.

## 5. What this does not do

- **It does not keep what it said.** The email is the record; the log is kept for seven days (`PostgresServerLog.feature`), and an administrator can still read it at `/admin/administrator/logs`, so look at a summary within the week.
- **It does not know what is new.** Claude sees one day's entries and nothing before them, so "new" is its guess from what the day holds.
- **It is not a monitor.** It tells you in the morning what happened in the night. An outage at night is still found in the morning, which is issue 286's (operations.md §1).
