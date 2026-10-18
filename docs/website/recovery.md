# If the operator's computer is lost

What lives only on the computer the website is run from, where a copy of each belongs so that losing, wiping or reformatting it costs an afternoon and not the website, and what to do on the new computer. Written for whoever has to do it with the old computer gone, which may not be the person who wrote it.

The server and the website keep running without this computer. What stops is the ability to deploy, to sign in to the server, and to take backups. **Nothing is lost by the computer going; something can be lost by not having done §2 beforehand.**

## 1. What is on the computer and nowhere else

Go through this list once, now, and make each item true:

- **The SSH private key** (`~/.ssh/id_ed25519`). It is the only way to sign in to the server as `deploy`, because passwords are switched off (server-setup.md §1). It is not copied anywhere on purpose (see §2).
- **`.env.production`.** The production settings, every key and password in them, and the two account keys. It is not in git (configuration.md §1). **If it is only here, it is lost with the computer.**
- **The backup files** in `DATABASE_BACKUP_FOLDER`. This is the copy of the website's events on a machine other than the server (backup-and-restore.md). **If the folder is only on this computer's disk, the website has one copy fewer than it seems to**: when the computer goes, what is left is the server's own copy and Kamatera's daily backup of it, both under the one host.
- **`.env`** on this computer, for the backup (`WEBSITE_DATABASE_URL`, the backup folder, the path to `pg_dump`) and for development.
- **The schedule** that runs the backup (Task Scheduler on Windows), and the tunnel that lets it reach the database (backup-and-restore.md §3).
- **Anything unpushed.** Work in the repository that has not been pushed to GitHub, including the documents in `docs/website/` until they are committed.

What is **not** only here: the code (GitHub), the website's data (the server, Kamatera's daily backup, and the backup files if §2 is done), and every account's password (the password manager).

## 2. Where each thing is to be kept

- **In the password manager (LastPass), as secure notes:**
  - **`.env.production`**, whole, as one note named for the website. This is the single most important copy: it holds `ACCOUNT_ENCRYPTION_KEY` and `ACCOUNT_EMAIL_ADDRESS_HASH_KEY`, which no backup file can replace (backup-and-restore.md §4). **Update the note every time the file changes**, and when a key is changed by `npm run db:change-site-key` (deploying.md §6).
  - **The server's root password** (the one entered when the server was made), which is the way back in when the SSH key is gone (§3).
  - **The SSH key's passphrase**, and a line saying which computer the key is on.
  - **The database's password**, and the administrator's mailbox if it has its own password.
  - **A note of the accounts the website depends on,** each with its sign-in: Kamatera, Cloudflare, Brevo, Google (the sign-in credentials and reCAPTCHA), GitHub, and the domain registrar. Losing the one for the domain registrar is the worst of these, since the domain is not recoverable without it.
- **Not in the password manager: the SSH private key.** Losing it is recoverable (§3), and putting it beside the passwords gives anyone who gets into the vault the server as well. Give it a passphrase (`ssh-keygen -p -f ~/.ssh/id_ed25519`), and keep one key for each computer.
- **Somewhere other than this computer, and other than the server: the backup files.** An external disk kept elsewhere, or a cloud storage folder, or both. The files hold names and email addresses only in the sealed form the website has, and the key that opens them is not in them (backup-and-restore.md §1), so a file on its own is not readable. Even so, keep the key and the files in different places: the key in the password manager, the files in storage.
  - Point `DATABASE_BACKUP_FOLDER` at a folder that syncs, or copy the folder to the external disk on a day of the month that is kept to.
  - Remember that removing old files is a decision about forgotten accounts (backup-and-restore.md §5): a copy elsewhere is a copy to remove from too.
- **On GitHub: everything else.** Push the repository's work, and the documents once they are committed.
- **On paper, or somewhere not online: the password manager's own recovery.** Its master password if it is not memorised, and the recovery codes for its two-step sign-in. If the password manager is only reachable through this computer, so is everything above.

Check the whole list once by acting as though the computer is gone: on another computer, sign in to the password manager, and see that `.env.production` and the root password are there and are the current ones.

## 3. If the computer is gone

On a new computer, in this order.

1. **Install what is needed.**
   - Git, and Node 22.13 or later (the repository's `engines`).
   - An SSH client (built into Windows 10 and later, and into WSL).
   - `pg_dump` and `pg_restore` of the server's Postgres version or later, which is 18 or later (backup-and-restore.md §3).
   - Docker, only to run the specifications.
2. **Sign in to the password manager.** If you cannot, nothing below can be done, and the password manager's recovery (§2, the last item) is the first thing to do.
3. **Get the code back:**

   ```bash
   git clone https://github.com/<the repository>.git
   cd croquetscores.com
   npm ci
   ```

4. **Make a new SSH key and let it in.** The old key is gone, and passwords are off, so the server has to be reached another way once:
   - In Kamatera's console, open the server and use its console (the button for a terminal on the server itself; it may be called Console or Remote console, and the screen is the guide). That is a login at the server and not over SSH, so it does not care that SSH passwords are off.
   - Sign in there as `root`, with the password from the password manager.
   - On the new computer: `ssh-keygen -t ed25519`, then print the public half: `cat ~/.ssh/id_ed25519.pub`. The public half is not secret.
   - On the server's console, as root, add it:

     ```bash
     echo '<the whole public key line>' >> /home/deploy/.ssh/authorized_keys
     ```

     and check that `ssh deploy@<the server's address>` now works from the new computer.

   - **Remove the old key's line** from `/home/deploy/.ssh/authorized_keys` if the old computer may be in someone else's hands (lost, not merely wiped). Each line is one key and ends with the computer's name.

5. **Put the settings back.**
   - `.env.production` from the password manager, into the repository's folder. It is ignored by git, so it does not come with the clone.
   - `.env` from `.env.example`, with the backup's settings (backup-and-restore.md §3).
6. **Take a backup, and read what it says:** `npm run db:backup`, with the tunnel up (backup-and-restore.md §3). This proves the new computer can reach the database, that `pg_dump` is new enough, and that the email arrives.
7. **Set the schedule again** (backup-and-restore.md §3), and run it once by hand.
8. **Fetch the old backup files** from where §2 kept them, into `DATABASE_BACKUP_FOLDER`, so that the history is one folder again.

If the **server** is lost as well as the computer, the server comes first: backup-and-restore.md §7, which needs the keys from `.env.production`, a backup file, and a Postgres.

## 4. If only a key or a password is lost

- **The SSH key alone:** step 4 above. Nothing else is needed.
- **The server's root password alone:** change it in Kamatera's console (the server's password reset), and put the new one in the password manager. SSH is not affected.
- **`ACCOUNT_ENCRYPTION_KEY` or `ACCOUNT_EMAIL_ADDRESS_HASH_KEY` alone:** the server is still running with the right ones. They are in `/etc/croquetscores/environment` on the server; copy them from there to the password manager **now, before anything else goes wrong** (`sudo grep ACCOUNT_ /etc/croquetscores/environment`). If the server's copy is also gone, every account's name and email address is unreadable for good, and the hash key can never be made again (configuration.md §3).
- **The Brevo, Google or reCAPTCHA credentials:** each is made again in its own console and the site's environment file updated (configuration.md §5). The data is not harmed.
