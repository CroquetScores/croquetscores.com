# Release notes for Tuesday

Written on 2026-11-06 for the deploy of `main` on Tuesday for:

- https://croquetscores.com/
- https://try.croquetscores.com/
- https://gateballscores.com/
- https://try.gateballscores.com/

This folder and the `release` branch are for deleting after the deploy.

Each step says where it is run: **your computer** (the repository, in WSL, or PowerShell where it says so) or **the server** (`ssh deploy@{ip address}`, then `cd /srv/croquetscores/site`). The server has no `.env`, so its scripts are run through `withsettings`, as `docs/website/deploying.md` section 1 says.

## 1. Stop sites on Azure

Your computer, in `release-notes/`. Puts each offline page on its own old site, which closes it and stops updates to the databases.

```bash
bash upload-app-offline.sh
```

It reads each page back to check it. Do not run it with `--remove` afterwards: that would open the old sites again.

## 2. Stop the beta site

The server. Readers are shown a page saying when to come back.

```bash
cd /srv/croquetscores/site
withsettings npm run db:access -- off --minutes 120 --text "Setting up the new home for Croquet Scores and Gateball Scores."
```

## 3. Set up the DNS

At Cloudflare: https://dash.cloudflare.com/52d8b863c7ad977a97091d225e6775f5/domains/overview

Point each of the four names at the server, `{ip address}`. This is the change the pages on the old sites promise, and it is why a reader may go on seeing them for a few hours: each provider and device keeps its old copy until it asks again. It is done now, with the sites still closed, so that it is spreading while the data is loaded. Anyone who reaches the new server before step 10 is shown the maintenance page from step 2.

## 4. Deploy the current website

Your computer. This is done before the import, not after, because the import makes the read models with the code that is on the server, and they should be made with the code that will run.

```bash
npm run deploy
```

Then look at what `deploying.md` section 2 says to look at: the footer shows the version you expect.

## 5. Download the RavenDB data

Your computer, in PowerShell:

```pwsh
."C:\RavenDbBackups\backup-ravendb-croquetscores.com.ps1"
."C:\RavenDbBackups\backup-ravendb-gateballscores.com.ps1"
```

## 6. Make the database

Your computer. Start the RavenDB server in a PowerShell window of its own and leave it running, then run the import in the repository:

```pwsh
."C:\Program Files (No Install)\RavenDB 4.2\Server\Raven.Server.exe"
```

```bash
npm run import:ravendb
```

Then write the file to take to the server. `db:dump-import` is run here, on the computer the import was done on, and it replaces any earlier `import.dump`:

```bash
npm run db:dump-import
```

## 7. Upload the database to the server

Your computer:

```bash
bash temp/upload-import.sh
```

## 8. Load the database on the server

The server. This stops the site, loads the file, makes the read models and starts the site again, leaving database access off as step 2 set it, as `backup-and-restore.md` section 7.1 describes. It asks you to type `yes` that the account keys are the right ones (see "Before Tuesday"). It keeps the empty database it replaces, as `croquetscores_before_restore`, until the site has answered its health check.

```bash
ssh deploy@{ip address}
bash /srv/croquetscores/site/scripts/import-dump.sh ~/import.dump
exit
```

If it fails it says what to do. Read what it says before running it again.

## 9. Look at the new site

Before anyone is sent to it: the health check, the home page, a tournament, and sign in with an account from the imported data. A name that shows as unreadable means the account keys are not the file's.

```bash
curl -s https://beta.croquetscores.com/api/site/health
```

## 10. Turn on the new production sites

The server. Step 2 turned access off, and the rebuild inside `import-dump.sh` finds it off and leaves it off, so nothing opens the site until this does. Do it once step 9 is satisfied.

```bash
cd /srv/croquetscores/site
withsettings npm run db:access -- on
```

## 11. Check the sites by their own names

Check each of the four addresses from a connection that has the new records (mobile data is the quickest), and look at the footer for the version. A reader who still sees the page on an old site is waiting for their own copy of the DNS to update, which is what that page explains.

## Afterwards

- Clean up the files `backup-and-restore.md` section 7.1 step 8 names: the copy of `import.dump` on the server, and, when you are sure, `croquetscores_before_restore` and the permission to make databases.
- If anyone writes in about still seeing the old page on Wednesday, the offline pages ask them to email croquetscores@gmail.com with the steps they tried.
- Delete this folder and the `release` branch. `upload-app-offline.json` holds passwords and is not committed, so it goes with the folder.
