#!/bin/bash
# Loads a dump file into the website on this server and makes the read models:
# backup-and-restore.md §7.1, steps 2 to 7, as one script. Run as deploy, on the
# server, from anywhere:
#
#   bash /srv/croquetscores/site/scripts/import-dump.sh ~/import.dump
#
# The file is the one "npm run db:dump-import" makes on the computer the import
# was done on, copied here (§7.1 step 1). The file is not removed afterwards.
# The empty database it replaces is kept as croquetscores_before_restore, as the
# way back, until the site has answered its health check, and is then dropped
# (§7.1 step 8).
set -euo pipefail

export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

site=/srv/croquetscores/site
live=croquetscores
restored=croquetscores_restored
before=croquetscores_before_restore
# Visitors are told the site is down for this many minutes while the read
# models are made. More than is expected, as the document says.
minutes=${MINUTES:-30}

file=${1:-}
if [ -z "$file" ] || [ ! -f "$file" ]; then
  echo "Give the dump file to load: bash import-dump.sh <the file>" >&2
  exit 2
fi
file=$(realpath "$file")

say() { echo "import-dump: $*"; }

# The keys are not in the file, and different ones leave every name and email
# address in it unreadable for good, so a person is asked and nothing is
# guessed at. It cannot be checked from here: the file's keys are not kept.
echo "ACCOUNT_ENCRYPTION_KEY and ACCOUNT_EMAIL_ADDRESS_HASH_KEY in"
echo "/etc/croquetscores/environment must be the ones that sealed the data in"
echo "$file."
echo "This replaces the website's data with the file's."
read -r -p "Type yes if they are: " answer
if [ "$answer" != "yes" ]; then
  echo "Nothing was changed."
  exit 1
fi

exists() {
  [ "$(sudo -u postgres psql -tAc "select 1 from pg_database where datname = '$1'")" = "1" ]
}

# Refused before anything is stopped: both names are made by this script, and
# a leftover of an earlier run is somebody's to look at and remove.
for name in "$restored" "$before"; do
  if exists "$name"; then
    echo "A database called $name is already there. Look at it, and drop it if it is a leftover." >&2
    exit 1
  fi
done

swapped=no
siteStopped=no

# Whatever way it ends, the permission to make databases is taken back. Where it
# ends before the names were swapped, the website is started again on the
# database it had, since nothing about it has changed.
finish() {
  status=$?
  sudo -u postgres psql -qc "alter user $live nocreatedb;" || true
  if [ "$status" -ne 0 ] && [ "$swapped" = "no" ] && [ "$siteStopped" = "yes" ]; then
    say "It failed before the names were swapped. Starting the site again on the database it had."
    sudo systemctl start croquetscores || true
  elif [ "$status" -ne 0 ] && [ "$swapped" = "yes" ]; then
    say "It failed after the names were swapped. The site is stopped, and its database is now the file's."
    say "Make the read models (cd $site && withsettings npm run db:rebuild-read-models -- --minutes $minutes), then start it."
    say "To go back: swap $live and $before back with alter database ... rename to ..."
  fi
}
trap finish EXIT

say "Stopping the site."
sudo systemctl stop croquetscores
siteStopped=yes

say "Letting $live make a database."
sudo -u postgres psql -qc "alter user $live createdb;"

say "Restoring the file into $restored."
cd "$site"
withsettings npm run db:restore -- "$restored" "$file"

say "Swapping the names."
sudo -u postgres psql -qc "alter database $live rename to $before;"
sudo -u postgres psql -qc "alter database $restored rename to $live;"
swapped=yes

say "Making the read models."
withsettings npm run db:rebuild-read-models -- --minutes "$minutes"

say "Starting the site."
sudo systemctl start croquetscores
siteStopped=no

# The site takes a moment to be up.
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fs http://127.0.0.1:3000/api/v1/health >/dev/null; then
    # Only now, with the site answering on the new database: until then the
    # old one is the way back. It is the empty database the migration made, so
    # nothing is lost with it.
    say "Dropping $before, the empty database it replaced."
    sudo -u postgres psql -qc "drop database $before;"
    say "The site is up. Open it, a tournament, and sign in with an account from the data."
    exit 0
  fi
  sleep 3
done
say "The site did not answer its health check in 30 seconds. Look at: journalctl -u croquetscores" >&2
exit 1
