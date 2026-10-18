# Setting up the server

Done once, to make a Kamatera server that can run the website. The commands are for Ubuntu 24.04 LTS, which is what CI builds on. Anything marked **choose** is a decision for the operator that the code does not make. **This is a step-by-step guide: do the sections in order, and finish each before starting the next.** Each section ends where the next one needs it to be.

Kamatera sells cloud servers: you are given an empty machine with an address and a root password, and everything on it is yours to install. There is no managed Postgres in this setup. It runs on the same server (README.md §1).

## 1. Make the server

In Kamatera's [console](https://console.kamatera.com/servers), create a server with:

- **Choose Zone** - AI recommended United Kingdom, London
- **Choose An Image** - Select **Service Images**, then select PostgreSQL
- **Choose Version** - PostGreSQL latest version installed and ready to use on Ubuntu 24.04 LTS
- **Type** - B General
- **CPU** - 2
- **RAM** - 2GB
- **NVMe DISK#1** - 20GB
- **Daily Backup** - Select. This is in addition to remote backup run daily. See [backup-and-restore.md](backup-and-restore.md).
- **Management Services** - Leave unselected
- **Choose Networking** - Simple mode
  - **Public Internet Network** - Select
  - **Private Local Network** - Unselect
- **Advanced Configuration** - Hide
- **Finalize Settings**
  - **Password** - Enter a strong password. See LastPass notes in my kam item.
  - **Servers** - 1
  - **Name #1** - CroquetScores
  - **Power On Servers** - Select
- Press **CREATE SERVER >>** button

## 1.1 Sign in to it from your computer

Everything from here on is typed **on the server, from your own computer, over SSH**. You never sit at the server. Kamatera shows the new server's public address in its console once it has started (the **Public Internet Network** address, such as `203.0.113.10`), and the password is the one entered under **Finalize Settings**.

First, give the server your computer's SSH key, so that you are not typing a password every time, and so that the step below that copies `authorized_keys` has a key to copy. On your computer (in WSL, if that is what you use):

```bash
ls ~/.ssh/id_ed25519.pub || ssh-keygen -t ed25519      # make a key if you have none
ssh-copy-id root@<the server's address>                # asks once for the root password
```

Then sign in as root:

```bash
ssh root@<the server's address>
```

The first time, SSH asks whether to trust the server's fingerprint; answer `yes`. The prompt then changes to `root@…#`, which means the commands are now running on the server. To leave the server and return to your own computer, type:

```bash
exit
```

Then, as root, once:

```bash
apt update && apt upgrade -y
apt autoremove
adduser --disabled-password --gecos "" deploy      # the account the operator signs in as
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh && cp ~/.ssh/authorized_keys /home/deploy/.ssh/ && chown -R deploy:deploy /home/deploy/.ssh
```

`deploy` has no password (`--disabled-password`), so `sudo` has nothing to ask it for and would refuse. Let it use `sudo` without one. Its only way in is the SSH key:

```bash
echo 'deploy ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/deploy
chmod 440 /etc/sudoers.d/deploy
visudo -c                                  # must say "parsed OK" for every file
```

### Closing the ways in that are not the key

Keep your root session open for all of this. **First prove that `deploy` can get in**, from a second terminal on your own computer:

```bash
ssh deploy@<the server's address>
sudo whoami                                # must say: root
```

If that does not work, stop and fix it before going on, because the next step shuts root and passwords out.

Then, in the root session, change the SSH server's settings, which are in `/etc/ssh/sshd_config`. The commands in this section start with `sudo` so that they also work from the `deploy` account, which is how you will run them if you come back to check later; root can use `sudo` too, so they are the same either way. First look at what the file says now:

```bash
grep -n -iE '^\s*(Include|PermitRootLogin|PasswordAuthentication|Match)' /etc/ssh/sshd_config
```

On Kamatera's image (found out by doing this once) the file sets `PermitRootLogin yes` and `PasswordAuthentication yes` in the middle of the file, and its `Include /etc/ssh/sshd_config.d/*.conf` line is commented out. Two things follow:

- **SSH uses the first value it meets for a setting.** Adding `PermitRootLogin no` at the end of the file, or in a file in `sshd_config.d/`, changes nothing. The lines that already say `yes` have to be changed where they are.
- **Files in `sshd_config.d/` are not read** while the `Include` line is commented out. Do not rely on them.

Change each line in place, finding it by its name and not by a line number, since the numbers differ from one server to the next. This changes every line that sets either setting and is not a comment (the lines that start with `#` are the file's defaults, and are left alone), **down to the first `Match` line and no further**: what follows a `Match` is a setting for some users or addresses only, and is not the global one that has to be closed:

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.before     # a copy to go back to
sudo sed -i -E '1,/^[[:space:]]*Match[[:space:]]/{s/^[[:space:]]*PermitRootLogin[[:space:]].*/PermitRootLogin no/;s/^[[:space:]]*PasswordAuthentication[[:space:]].*/PasswordAuthentication no/}' /etc/ssh/sshd_config
```

or by hand, in the editor:

```bash
sudo nano /etc/ssh/sshd_config
```

The arrow keys move, `Ctrl+W` searches, `Ctrl+O` then Enter saves, `Ctrl+X` leaves. Make the line say `no`, and take a `#` off the start of it if there is one.

If the `grep` shows the `Include` line is **not** commented out, a file in `/etc/ssh/sshd_config.d/` can also set these, and the file read first wins. Look:

```bash
grep -ri 'PasswordAuthentication\|PermitRootLogin' /etc/ssh/sshd_config.d/
```

and change any `yes` it finds the same way.

If the `grep` above showed no line for one of the two settings, there is nothing for `sed` to change: add the line with `echo 'PermitRootLogin no' | sudo tee -a /etc/ssh/sshd_config` (or `PasswordAuthentication no`). Then check the result and not the files. `sshd -t` and `sshd -T` must be run as root, because they read the server's private host keys; without `sudo` they say `sshd: no hostkeys available -- exiting`, which is not a fault in the server:

```bash
sudo sshd -t                               # prints nothing if the settings are valid; fix what it says if not
sudo sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication) '
                                           # must say: permitrootlogin no, passwordauthentication no
sudo systemctl restart ssh
```

Existing sessions are not cut off by the restart. **From the second terminal, sign in as `deploy` again, and try to sign in as root, which must now be refused,** before closing the root session:

```bash
ssh deploy@<the server's address>          # must work
ssh root@<the server's address>            # must be refused: Permission denied
```

If `deploy` cannot get in, you still have the root session to put the old setting back; if you close it first you are locked out, and Kamatera's console (the server's **Console** or **Remote console** button) is the only way back in.

Install automatic security updates, as `deploy` now that root is shut out:

```bash
sudo apt install -y unattended-upgrades
```

Every command from here on that changes the server starts with `sudo`.

## 2. The firewall

Only the proxy faces the internet. Postgres and the site do not.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Kamatera also has a firewall in its console; use it the same way if you want a second wall. Port 3000 (the site) and 5432 (Postgres) are **not** opened. The backup reaches Postgres through an SSH tunnel and not through an open port (backup-and-restore.md §3).

## 3. Node and Postgres

**Node 22.13 or later** (`package.json` engines, and CI's version). From NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git
node --version        # must say v22.13 or later
```

**Postgres is already installed.** The image chosen in §1 (Service Images, PostgreSQL) comes with it, so none is installed here. Find out what it came with before going on:

```bash
psql --version                                   # which version
systemctl list-units 'postgresql*' --no-legend   # the service's name: postgresql, or postgresql@<version>-main
sudo -u postgres psql -c "select version();"     # that it answers
sudo ss -ltnp | grep 5432                        # where it listens
```

- **The version should be 18.** That is what the image came with when this was written. The backup's `pg_dump` must be at least the server's version (backup-and-restore.md §3). A different one is a reason to stop and check, since the backup computer's `pg_dump` has to match or exceed it, and the development container and CI (`compose.yaml`) should be the same version as production.
- **It should listen on `127.0.0.1` only,** not `0.0.0.0`. If it listens on every address, set `listen_addresses = 'localhost'` in its `postgresql.conf` and restart it. This says where that file is:

  ```bash
  sudo -u postgres psql -c "show config_file;"
  ```

  The firewall in §2 keeps port 5432 shut either way, but a database that does not listen publicly is a second wall.

- **Look at what else the image set up:** the `postgres` user's password, and the rules in `pg_hba.conf` for who may connect and from where. The first command says where that file is, and the second prints its rules without the comments (use the path the first one printed, if it is not this one):

  ```bash
  sudo -u postgres psql -c "show hba_file;"
  sudo grep -vE '^\s*(#|$)' /etc/postgresql/18/main/pg_hba.conf
  ```

  Only `127.0.0.1` and the local socket are wanted. A rule for `0.0.0.0/0` is to be removed. On the server this was written on, the image had only local-socket and `127.0.0.1` / `::1` rules, the last needing a password, and `listen_addresses` was `localhost`, so nothing needed changing.

- **The service's name** is what the commands in operations.md use as `postgresql`. Where it is `postgresql@18-main`, as on the server this was written on, use that instead.

Make a long random password for the site's database user, and keep it; it goes in `DATABASE_URL` (below). **Use letters and digits only,** so that it can go into the URL as it is: `/`, `+`, `=` and the like have to be encoded in a URL. LastPass's password generator does this with only the letter and digit options ticked, and 24 or more characters. The same can be made on the server:

```bash
openssl rand -hex 24
```

Then make the site's database and its own user, putting that password where `<the password>` is:

```bash
sudo -u postgres psql <<'SQL'
create user croquetscores with password '<the password>';
create database croquetscores owner croquetscores;
SQL
```

`DATABASE_URL` is then `postgres://croquetscores:<the password>@127.0.0.1:5432/croquetscores` (configuration.md §3).

**Do not use `compose.yaml` here.** It is the development container, with `fsync` turned off for speed and a password written in the repository (SETUP.md §6). After a crash it may not come back. Anything real runs on a Postgres configured for its environment, and this is that.

## 4. The domain, at Cloudflare

DNS is at Cloudflare. In the domain's DNS records there:

- **`A` records** — one for each of the four names: `@` and `try` in the `croquetscores.com` zone, and `@` and `try` in the `gateballscores.com` zone, all to the server's address. Add `beta` in the `croquetscores.com` zone too, for the beta site (README.md §2). **Set the proxy status to "DNS only" (the grey cloud),** for the reason below.
- **`AAAA` record** — only if the server was given an IPv6 address, and the same proxy status.
- **Brevo's records** — SPF (a `TXT`), DKIM (a `TXT` or `CNAME`) and DMARC (a `TXT` at `_dmarc`), exactly as Brevo's dashboard gives them. Without these the emails go to spam (TODO.md, Hosting). Cloudflare only proxies `A`, `AAAA` and `CNAME` records, and a `CNAME` that Brevo gives for DKIM must also be "DNS only", or Brevo cannot see it and says the domain is not verified.

Wait for every `A` record to answer before starting the proxy. Run this once for each of the names, the beta's included, and it should print the server's address:

```bash
dig +short <the name>
```

The proxy asks for a certificate on first start, and fails if a name does not yet point here.

### Why grey, and not orange

With the grey cloud Cloudflare only answers DNS questions, and readers connect straight to the server. That keeps the rest of these documents true: Caddy gets its certificate by itself, and `TRUSTED_PROXY=127.0.0.1` is the whole of what the site needs to know about who sits in front of it.

With the orange cloud Cloudflare sits in front of Caddy, hides the server's address, caches and filters. It is a good thing to want, and it changes four things, so it is a decision for later and not something to switch on casually:

1. **Cloudflare's SSL/TLS mode must be "Full (strict)".** "Flexible" sends readers' traffic to the server unencrypted, and the site's cookies are marked secure and would loop through redirects.
2. **`TRUSTED_PROXY` must name Cloudflare's address ranges** (the list is at cloudflare.com/ips), as well as `127.0.0.1`. Otherwise every reader is counted as one of Cloudflare's addresses, and the limits on failed sign-ins and password-reset requests hold everybody to a very small share.
3. **Caddy must be told to believe Cloudflare** about the reader's address, by naming those same ranges as trusted proxies in its global options, or it throws away what Cloudflare says and passes on Cloudflare's own address.
4. **The firewall can then allow ports 80 and 443 from Cloudflare's ranges only,** which is the point of hiding the server's address.

Try it on the beta's own name first, and read the log to see that a reader's address, and not Cloudflare's, is what the site is counting by.

## 5. The proxy

Caddy, which gets the certificate itself and renews it:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

Open the Caddyfile. It belongs to root, so use `sudo`; without it the editor says "Permission denied" when you save:

```bash
sudo nano /etc/caddy/Caddyfile
```

Replace the whole of it with the following. `Ctrl+O` then Enter saves, and `Ctrl+X` leaves:

```
croquetscores.com, beta.croquetscores.com, try.croquetscores.com, gateballscores.com, try.gateballscores.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000
}
```

Four of the names are the four websites, and `beta.croquetscores.com` is the beta site, which counts as `croquetscores.com` for what it keeps (README.md §2); Caddy gets a certificate for each. `reverse_proxy` sends `X-Forwarded-For`, `X-Forwarded-Proto` and `X-Forwarded-Host`, the last being the host the reader typed, and speaks to the site from `127.0.0.1`. So the site's settings are:

- `TRUSTED_PROXY=127.0.0.1`. Without it every reader is counted as the proxy, and Google sign-in sends the wrong address (configuration.md §3).
- Nothing for the names above: the site reads which website a request is for from `X-Forwarded-Host`, believed because of `TRUSTED_PROXY` (configuration.md, "What the site works out for itself"). Step 7 and step 8 of §6 check that this works, once the site is running.

Check the file and then reload Caddy, after any change to it. `validate` says whether the file is valid, `reload` makes it take effect, and `journalctl` says how it went:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -n 50
```

Caddy asks for each name's certificate when it first needs it, so the `A` records (§4) have to be answering first. If the proxy moves to another machine, `TRUSTED_PROXY` becomes that machine's address, and the firewall opens 3000 to it alone.

HTTPS headers are not sent by the site yet (TODO.md, Security headers). Caddy can add `Strict-Transport-Security` in the meantime, but that is a decision for the operator, since a mistake in it is remembered by browsers for as long as it says.

## 6. The site as a service

Do these steps in order, as `deploy` on the server. Each one needs the one before it. Before you start, `.env.production` on your own computer must be complete: every setting in it has a value (configuration.md §1), and the database from §3 exists.

### Step 1. Make the account the site runs as

The site does not run as you. It runs as `croquetscores`, which can read the code but not change it.

```bash
sudo adduser --system --group --home /srv/croquetscores croquetscores
sudo mkdir -p /srv/croquetscores /etc/croquetscores
sudo chown deploy:deploy /srv/croquetscores
sudo chmod 755 /srv/croquetscores
```

The `chmod` matters. `adduser` makes the folder private to the account it is made for, and the `chown` then hands it to `deploy`, so without it `croquetscores` cannot even enter the folder to reach the code, and the site fails to start with `status=200/CHDIR` (step 7). `755` lets anyone enter and read it, and only `deploy` change it.

### Step 2. Let the server read the repository

The repository is private, and GitHub does not accept an account password for Git over HTTPS, so cloning with `https://` asks for a username and password and then fails with "Password authentication is not supported". The server uses a **read-only deploy key** instead: a key that can read this one repository and nothing else.

Make the key and print its public half:

```bash
ssh-keygen -t ed25519 -N '' -C croquetscores-server -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub
```

In GitHub, open the repository's **Settings**, then **Deploy keys**, then **Add deploy key**. Give it a title such as `Kamatera server`, paste the line `cat` printed, and **leave "Allow write access" unticked**.

Back on the server, tell SSH to use that key for GitHub, and clone with the SSH address:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T git@github.com            # answer yes to the fingerprint question
git clone git@github.com:CroquetScores/croquetscores.com.git /srv/croquetscores/site
```

`ssh -T` greets you by the repository's name if the key is right, and says "Permission denied (publickey)" if it was not added to the repository. It exits with a non-zero code even when it works, which is normal. Every later `git fetch` on the server (deploying.md §2) uses the same key.

The key has no passphrase, because nobody is there to type one, so anyone who can read `~/.ssh/github_deploy` can read the repository. That is why it is read-only and for this one repository, and why it is not kept anywhere else: if the server is lost, delete the key in GitHub (**Settings**, **Deploy keys**) and make another on the new server.

### Step 3. Make the folder for the maintenance switch

The switch that turns the site's database access off for maintenance is a small file (operations.md §3). **Only the scripts you run as `deploy` write it** (`npm run db:access`, and `npm run db:rebuild-read-models`, which turns it off while it runs and on again). The running site only reads it, at each request. So `deploy` must be able to write in its folder, and the site must be able to read what it writes. The folder belongs to the site's account and to its group, which `deploy` joins in step 4, and the `2775` makes the folder writable by that group and the files made there belong to it. **`deploy` cannot write there until it has signed out and in again after step 4**, so do not run `db:access` or `db:rebuild-read-models` before then; they would fail on the first write, with nothing changed:

```bash
sudo mkdir -p /srv/croquetscores/state
sudo chown croquetscores:croquetscores /srv/croquetscores/state
sudo chmod 2775 /srv/croquetscores/state
```

### Step 4. Make the settings file

The site reads its settings from `/etc/croquetscores/environment`. Make the file with the right owner and permissions, so that the site's account and `deploy` can read it and nobody else on the server can:

```bash
sudo usermod -aG croquetscores deploy
sudo install -m 640 -o root -g croquetscores /dev/null /etc/croquetscores/environment
sudo nano /etc/croquetscores/environment
```

In `nano`, paste in the whole of your `.env.production` from your own computer (`Ctrl+A` and `Ctrl+C` there, then right-click or `Ctrl+Shift+V` in the server window). It already has `DATABASE_ACCESS_FILE=/srv/croquetscores/state/database-access`. Save with `Ctrl+O` then Enter, and leave with `Ctrl+X`.

**Now sign out of the server and sign in again.** The group change in `usermod` takes effect at the next sign-in, and step 5 needs it. A fresh `ssh` is a new sign-in; a session kept open in `tmux` or `screen` from before is not. Check that the group has taken effect, and that `deploy` can make a file in the maintenance folder for the site to read. The first command should print `croquetscores`, and the `ls` should show the group `croquetscores` on the file and a mode of `-rw-r--r--` (readable by the group and by everyone):

```bash
id -nG | tr ' ' '\n' | grep -x croquetscores
touch /srv/croquetscores/state/write-test
ls -l /srv/croquetscores/state/write-test
rm /srv/croquetscores/state/write-test
```

If the first prints nothing, the shell has not picked the group up: sign out and in again, from a new terminal. If the `touch` is refused, step 3's `chown` or `chmod` was not done.

### Step 5. Install, build and migrate

The scripts need the settings, but only while each one runs, so make a small helper that loads the settings file for one command and then forgets it. The command, and what it starts, has the settings, and nothing else you type does, `git` and the install scripts of `npm ci` among them. It is a script on the path and not a function in `~/.bashrc`, so that every shell finds it, including the one `ssh deploy@server 'command'` starts. This is the one place the command is written; deploying.md §1 refers to it. Once:

```bash
sudo tee /usr/local/bin/withsettings >/dev/null <<'EOF'
#!/bin/bash
# Runs the command it is given with the site's settings in its environment,
# and in no other process.
set -a; . /etc/croquetscores/environment; set +a
exec "$@"
EOF
sudo chmod 755 /usr/local/bin/withsettings
```

First check that the settings file follows the rule for how a value is written (configuration.md §1), since the shell and systemd read some values differently. The first command prints the number of any line that breaks it, and the second the number of any line with a backslash in it, which the shell and systemd read differently even in single quotes. Nothing printed is good:

```bash
grep -nvE -e "^[A-Z][A-Z0-9_]*=('[^']*'|[A-Za-z0-9_./:@%+=,-]*)$" -e '^#' -e '^$' /etc/croquetscores/environment | cut -d: -f1
grep -n '\\' /etc/croquetscores/environment | cut -d: -f1
```

If it prints a number, open the file (`sudo nano /etc/croquetscores/environment`) at that line and put the value in single quotes. Then:

```bash
cd /srv/croquetscores/site &&
npm ci &&
npm run build &&
withsettings npm run db:migrate
```

`withsettings` loads the settings file for the `db:migrate` that follows it, so that it can find the database. `npm ci` and `npm run build` take a few minutes and do not need the settings. `db:migrate` should print `Applied: …` the first time, and `Database is up to date.` afterwards. If it prints an error about a missing setting or a password, fix the settings file (step 4) and run it again. More on what each command does is in deploying.md §2.

### Step 6. Write the service file

This tells the server how to run the site and to start it again if it dies. Open the file:

```bash
sudo nano /etc/systemd/system/croquetscores.service
```

and paste in:

```ini
[Unit]
Description=Croquet Scores website
After=network.target postgresql.service
Wants=postgresql.service

[Service]
User=croquetscores
Group=croquetscores
WorkingDirectory=/srv/croquetscores/site
EnvironmentFile=/etc/croquetscores/environment
ExecStart=/usr/bin/node dist/web/server.js
# Stopping sends SIGTERM, and the site finishes the email it is sending before
# it ends. Ten seconds is more than that takes.
TimeoutStopSec=10
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
ProtectSystem=full
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

`postgresql.service` here is the umbrella unit that Ubuntu's Postgres packages have for all clusters, and the cluster's own unit (`postgresql@18-main.service`, if that is the name from §3) is started before it, so waiting for `postgresql.service` is waiting for the database. Check that this is so on your server: the cluster unit's `Before=` should list `postgresql.service`.

```bash
systemctl show postgresql@18-main -p Before
```

If it does not, or the unit has another name, put the cluster's own unit name in `After=` and `Wants=` instead.

`Restart=on-failure` is for the site dying. It does not restart a site that will not start because a setting is wrong (that exits straight away, and systemd gives up after a few tries), which is the behaviour wanted: look at the log.

### Step 7. Start it

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now croquetscores
sudo systemctl status croquetscores
curl -s http://127.0.0.1:3000/api/v1/health
```

`status` should say `active (running)` (press `q` to leave it), and `curl` should print `{"status":"ok"}`.

Then check that the site tells the websites apart by `X-Forwarded-Host`, which is what Caddy sends it. These two send that header by hand. The first names a website the site does not have, and must be refused with `421`; the second names a real one, and must be answered with `200`:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Forwarded-Host: nonsense.example' http://127.0.0.1:3000/
curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Forwarded-Host: try.croquetscores.com' http://127.0.0.1:3000/
```

A `200` for the first, or a `421` for the second, means the header is not being believed: `TRUSTED_PROXY` does not name `127.0.0.1` (configuration.md §3).

If `status` says `activating (auto-restart)` with `status=200/CHDIR`, the site's account cannot enter `/srv/croquetscores/site`: run `namei -l /srv/croquetscores/site` to find the folder with no `x` for "other", and `sudo chmod 755` it (step 1). If `status` says `failed`, read the log; a wrong or missing setting is listed there in full:

```bash
sudo journalctl -u croquetscores -n 30
```

Fix it in the settings file:

```bash
sudo nano /etc/croquetscores/environment
```

then start the site again:

```bash
sudo systemctl restart croquetscores
```

### Step 8. Check it from outside

From another computer, in a browser or with `curl`, which should say `{"status":"ok"}`:

```bash
curl -s https://<the site's name>/api/v1/health
```

Then open `https://try.croquetscores.com/` in a browser. It should load with a padlock, and show the try banner on every page, saying that anything entered may be removed at any time. Open `https://beta.croquetscores.com/` too, which should say on every page that it is a beta, and `https://croquetscores.com/`, which should have no banner at all. That shows that Caddy is sending the host the reader typed and that the site is reading it.

This is the real test, since it goes through Cloudflare's DNS (§4) and Caddy (§5). If it does not, the site is running and the fault is in one of those two; operations.md §4 lists what to look for.

When it does, say that this first deploy ran to its end, so that the deploy sequence in deploying.md §2 will run for the next one. Once:

```bash
touch /srv/croquetscores/deploy-finished
```

## 7. The logs

The logs stay on the server, in the system journal, which is made to keep them across a reboot, for a set time and no more than a set size. Only people who can run `sudo` can read them, and the only such account on the server is `deploy`: the site's own account, `croquetscores`, and everyone else cannot. They are read by signing in as `deploy` and running the commands below, once a day.

They are not sent to a logging service. A line is written for each request, with the reader's address on it, and a service would be another company holding every reader's address and the address of every page they open; the privacy page (`/privacy`) would have to say so, and the service would cost money. If the server is lost, so are the logs, but Kamatera's daily backup of the server (§1) has them up to the day before, and nothing the website needs to recover is in them (backup-and-restore.md).

### Keep them across a reboot

Make a file saying so:

```bash
sudo mkdir -p /var/log/journal /etc/systemd/journald.conf.d
sudo nano /etc/systemd/journald.conf.d/croquetscores.conf
```

and paste in:

```ini
[Journal]
Storage=persistent
SystemMaxUse=500M
MaxRetentionSec=90day
```

`Storage=persistent` keeps the journal on disk across reboots. `SystemMaxUse` and `MaxRetentionSec` keep it from filling the 20 GB disk: the oldest lines go when it is over 500 MB or older than 90 days, whichever comes first. Ninety days is long enough to look back over a tournament season's worst week and short enough to promise readers a date.

Then make it take effect, and check:

```bash
sudo systemctl restart systemd-journald
sudo journalctl --disk-usage
sudo ls /var/log/journal
```

`ls` should show a folder named with a long string of letters and digits. If the folder is not there, the journal is still kept in memory only and is lost at every reboot. There may be two folders, if the server's machine ID changed when Kamatera made it from its image; the older one holds the image's earlier logs, and both are harmless. Without `sudo`, `journalctl` prints a hint that you are not seeing messages from other users: `deploy` is not in the groups `adm` or `systemd-journal`, which is deliberate.

### Reading them every day

Sign in as `deploy` and run these three. The first shows what the site itself says went wrong in the last day: warnings, errors and fatal errors, with the time first. The second shows the same for the proxy. The third shows whether the site restarted:

```bash
sudo journalctl -u croquetscores --since "24 hours ago" -o cat | grep -E '"level":(40|50|60)'
sudo journalctl -u caddy --since "24 hours ago" -p warning
sudo journalctl -u croquetscores --since "24 hours ago" | grep -E 'Started|Stopped|Main process exited'
```

Nothing printed by the first two is good. Anything printed is worth reading in full. Show the lines around it with:

```bash
sudo journalctl -u croquetscores --since "24 hours ago" | less
```

(`/` searches in `less`, and `q` leaves it.)

The site's lines are JSON with a number for the level: 30 is information (every request), 40 a warning, 50 an error, 60 fatal. That is why the first command asks for those numbers and not for a priority.

Once a month, check the journal is not nearly full (`sudo journalctl --disk-usage`) and that the oldest line is about 90 days old:

```bash
sudo journalctl --since "100 days ago" | head -n 1
```
