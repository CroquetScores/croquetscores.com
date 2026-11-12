# exporting-tournaments.md — Publishing the tournaments as files, every hour

The tournaments of both websites are written to a folder of JSON files, one for each tournament, and that folder is a Git repository (`CroquetScores/data.croquetscores.com`) that anybody can read. The script writes the files and then stages, commits and pushes them, so a run is the whole of publishing. The reasons, and every rule it keeps, are in `specs/infrastructure/maintenance/exportTournamentsCli.feature`; this is how to set it up and look after it.

It runs **on the Kamatera server**, as `deploy`, from cron, on the hour. It needs the same settings the site has (the database and the mail server), which `withsettings` gives it (server-setup.md §6, step 5), and a key that can **push** to the data repository.

## 1. What each run does

In order:

1. Checks the folder is there, is a Git repository, and has a remote. A folder that is not there is not made, since files written to one made for a mistyped name would be a second place they were quietly kept.
2. Pulls the folder, forward only. If the folder and the remote have each gone their own way it stops and changes nothing, because a merge made by a script is somebody's files quietly changed.
3. Asks the site for what each tournament's public pages show, and reads only the tournaments that have changed since the last run. It says how many it is reading as it goes.
4. Writes the files that would now say something different, and takes away the files of tournaments that are no longer public (archived, or moved to another address).
5. Stages only those files, commits them, and pushes.

A run that changed nothing makes no commit. A run that failed commits and pushes nothing. **A failure is emailed to `ADMINISTRATOR_EMAIL_ADDRESS`** with the step that failed and why, and a run that worked sends nothing. Nothing in the email names an account or the remote's address.

What the run remembers of what it has exported is in `.git/export-record.json` in the data folder, which Git never commits. If it is missing, the next run reads every tournament, which is slow but never wrong.

## 2. Setting it up

Do these once, as `deploy` on the server, after the site is running (server-setup.md §6).

### Step 1. Make the data repository

On your own computer, in the repository `D:\source\repos\CroquetScores\data.croquetscores.com` (or wherever you made it), which has a `README.md` and a `LICENSE`:

1. Create an empty repository `CroquetScores/data.croquetscores.com` in GitHub, with no README, licence or `.gitignore` of its own.
2. Commit the two files and push them, so that the repository has a `main` for the server to clone:

```powershell
git add README.md LICENSE
git commit -m "Say what this is, and that it is free to use"
git remote add origin git@github.com:CroquetScores/data.croquetscores.com.git
git push -u origin main
```

### Step 2. Give the server a key that can push to it

The server's key for the site's own repository is read-only (server-setup.md §6, step 2), and GitHub does not let one deploy key serve two repositories. So the data repository gets a key of its own, and **this one can write**.

```bash
ssh-keygen -t ed25519 -N '' -C croquetscores-server-data -f ~/.ssh/github_data_deploy
cat ~/.ssh/github_data_deploy.pub
```

In GitHub, open the **data** repository's **Settings**, then **Deploy keys**, then **Add deploy key**. Title it `Kamatera server`, paste the line `cat` printed, and **tick "Allow write access"**. Then tell SSH to use that key for a name of its own, so that it is never used for the site's repository:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-data
  HostName github.com
  IdentityFile ~/.ssh/github_data_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T git@github-data            # answer yes to the fingerprint question
```

`ssh -T` greets you by the repository's name if the key is right. It exits with a non-zero code even when it works, which is normal.

The key has no passphrase, because nobody is there to type one, so anyone who can read it can write to the data repository. That is why it is for this one repository, and why it is not kept anywhere else. If the server is lost, delete the key in GitHub and make another on the new one.

### Step 3. Clone it, and say who commits

```bash
git clone git@github-data:CroquetScores/data.croquetscores.com.git /srv/croquetscores/data
git -C /srv/croquetscores/data config user.name "Croquet Scores export"
git -C /srv/croquetscores/data config user.email "croquetscores@gmail.com"
git -C /srv/croquetscores/data branch --show-current
```

The last command must print `main`. The commits are made as the name and address given here, which is all that is public of who made them.

### Step 4. Look at what it would write, then run it once

`--test` does everything but call Git: it reads the tournaments and writes the files, and pulls, stages, commits and pushes nothing. Run it first, to see that the site's settings reach it and that the files look right. It reads every tournament, which takes a while the first time:

```bash
cd /srv/croquetscores/site &&
withsettings npm run export:tournaments -- --folder /srv/croquetscores/data --test
```

It says how many tournaments there are and how many it has read, and ends with `This was a test run: no Git command was run.` Open a file or two in `/srv/croquetscores/data/` and check them against the site. Then take the test's files away and run it for real, by hand, so that the first long run is one you are watching:

```bash
git -C /srv/croquetscores/data clean -fdq -e .git &&
withsettings npm run export:tournaments -- --folder /srv/croquetscores/data
```

It ends with `The files were pushed.`, and the files are in the data repository on GitHub. Run it again straight away: it should read none or almost none of the tournaments, and say `There was nothing to commit.`

## 3. Running it every hour

Cron starts it on the hour. `flock` keeps a run from starting while the last is still going, which matters on the first long run, and `-n` makes the second give up and not wait. The log is the last run's only, since a failure is emailed and a log that grows is one more thing to look after.

```bash
crontab -e
```

Add these lines at the bottom. Cron's own `PATH` is too short to find `withsettings`, so the line that sets it is needed:

```
PATH=/usr/local/bin:/usr/bin:/bin
0 * * * * cd /srv/croquetscores/site && flock -n /tmp/export-tournaments.lock withsettings npm run export:tournaments -- --folder /srv/croquetscores/data > /home/deploy/export-tournaments.log 2>&1
```

`0 * * * *` is minute 0 of every hour. Check that cron has it, and wait for the next hour:

```bash
crontab -l
cat ~/export-tournaments.log
```

The log should say how many tournaments are public and how many it read, and end with either `The files were pushed.` or `There was nothing to commit.`

## 4. Knowing it is working

- **A failure is emailed.** `The failure was …` says the step, and `Why:` says why.
- **No email does not mean it ran.** Cron not running, the server being off, or the mail being down all look the same. Look at the newest commit's date, which should be within hours of the last time a tournament changed:

```bash
git -C /srv/croquetscores/data log -1 --format='%cd'
cat ~/export-tournaments.log
```

- **Commits come only when something changed.** A quiet night makes none, which is not a fault.
- **The log's last line** says whether the last run worked. It is overwritten each hour.

## 5. When a run fails

Read the log (`cat ~/export-tournaments.log`) and match what it says.

- **`that the folder is not there`**, **`not a Git repository`**, **`has no remote`** — the folder was moved or the clone was lost. Clone it again (step 3).
- **`pulling the folder`** — the remote cannot be reached, or the folder and the remote have each gone their own way. The `Why:` says which. For the second, somebody has to look at the folder: `git -C /srv/croquetscores/data log --oneline --graph --all`. The script never merges. Do not make the folder match the remote by hand until you have seen what the folder has that the remote does not, since those are commits that were never pushed.
- **`reading the tournaments`** — a tournament could not be read, or two are at one address. Nothing was written. The `Why:` names it.
- **`writing a file`**, **`removing a file`** — the disk is full or the folder is not writable by `deploy`. What was written is kept, nothing was removed or committed, and the next run carries on.
- **`committing the folder`** — Git refused. The `Why:` is Git's own words. Check that `user.name` and `user.email` are set (step 3).
- **`pushing the folder`** — the key cannot write, or GitHub is down. The commit is kept, and the next run pushes it. If it says "Permission denied", check that the key was added to the **data** repository with **write access**.
- **`The administrator could not be told`** — the files may be fine, but the email was not sent. Check the four `SMTP_` settings (configuration.md).

## 6. Reading every tournament again

Run with `--all` after the script has been changed to write something different, since the record knows the layout's number and not the script, and would otherwise leave every tournament it believes is unchanged as it was written:

```bash
cd /srv/croquetscores/site &&
withsettings npm run export:tournaments -- --folder /srv/croquetscores/data --all
```

Do it by hand, not under cron, and when no run is going: `flock` is the cron line's, and a second run started by hand does not know of it. Wait for the hour's run to finish, or take its line out of the crontab for the time it takes.

## 7. What this does not do

- **It does not forget a name that was exported.** Git keeps every file as it was, so a person who asks to be taken out can be taken out of what is exported next and not out of what was. That is said in the data repository's README so that nobody is promised more.
- **It does not publish an archived tournament, or anything of a try website.**
- **It does not back anything up.** The files are made from the events and can be made again from them. The backup is backup-and-restore.md.
