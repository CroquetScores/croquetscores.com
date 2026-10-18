#!/bin/bash
# Puts the commit it is given up on this server: deploying.md §2 as one script,
# so that the merge to main that GitHub Actions has just seen through can be
# followed by it with nobody typing. Installed once as
# /usr/local/bin/croquetscores-deploy (deploying.md §8) and run only by the key
# the workflow signs in with, which can run this and nothing else.
#
# It is installed on the server and not run from the checkout it is about to
# replace, so that the key can only ever start this script as it was installed
# by hand, and never one that a commit has just changed. The cost is that a
# change to this file does nothing until it is installed again, and it says so
# when the commit it is deploying has a different copy.
set -euo pipefail

# A forced command from sshd is not started by a login shell, so the folder
# withsettings is in is named and not hoped for.
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

root=/srv/croquetscores
site=$root/site
copies=$root/before-deploy

# The workflow gives the commit as the command (sshd keeps it in this
# variable). It is checked to be 40 hexadecimal digits before it goes anywhere
# near git or a shell, so that what the key can be made to do is only to deploy
# a commit of this repository.
commit=${SSH_ORIGINAL_COMMAND:-${1:-}}
if ! [[ $commit =~ ^[0-9a-f]{40}$ ]]; then
  echo "Give the commit to deploy, as 40 hexadecimal digits." >&2
  exit 2
fi

say() { echo "deploy: $*"; }

cd "$root"

# Two deploys at once would each be moving site.previous and checking out a
# commit under the other. The workflow runs one at a time; this is for a person
# who is deploying by hand while it runs. It is taken before the marker is
# looked at, because a deploy that is running has removed the marker, and a
# second one would otherwise say the last deploy failed.
exec 9>"$root/deploy.lock"
if ! flock -n 9; then
  say "Another deploy is running." >&2
  exit 1
fi

# Refuse, as the manual sequence does, to go on after a deploy that did not
# finish: a second run would copy the failed folder over site.previous, the one
# good copy.
if [ ! -e deploy-finished ]; then
  say "The last deploy did not finish. Put site.previous back (deploying.md §5) before deploying again." >&2
  exit 1
fi

cd "$site"
# Not --tags: a tag moved on GitHub makes that fail with "would clobber", which
# would stop every deploy until the server's clone was mended, and only the
# commit is wanted. Tags that point into what is fetched still come with it.
git fetch origin
if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
  say "The commit $commit is not in the repository." >&2
  exit 1
fi

running=$(git rev-parse HEAD)
if [ "$running" = "$commit" ]; then
  say "$commit is already what is running. Nothing to do."
  exit 0
fi
# A run of the workflow started again from the Actions page, or two merges whose
# runs were finished in the wrong order, would otherwise put an older build over
# a newer one, and its migrations would not be undone.
if git merge-base --is-ancestor "$commit" "$running"; then
  say "$commit is older than what is running ($running). Not putting an older build up." >&2
  exit 1
fi

stage="copying the data"

# From the first command that changes what the running site runs from, until
# the database is migrated, a failure is put right by putting the old folder
# back, which is safe because the database has not been touched. After the
# migration it is not, because the old code may not live with the new schema,
# so the site is left as it is for a person to look at (deploying.md §5).
go_back() {
  trap 'say "Going back failed, and the site may be stopped. Follow deploying.md §5 by hand." >&2' ERR
  say "Failed $stage. Putting the previous build back."
  cd "$root"
  # Checked before anything is stopped, so that the site is left running where
  # there is nothing to put back.
  if [ ! -d site.previous ]; then
    say "There is no site.previous to put back. The site is left as it is: see deploying.md §5." >&2
    return 1
  fi
  sudo systemctl stop croquetscores
  rm -rf site.failed
  mv site site.failed
  mv site.previous site
  sudo systemctl start croquetscores
  touch deploy-finished
  say "The previous build is running again. What failed is in site.failed."
}
# Run when the script ends by any way but success, and not only when a command
# fails: the workflow's timeout, a cancelled run and a dropped connection end it
# with a signal, which an ERR trap never sees, and that is when the folder is
# most likely to be half built.
on_exit() {
  local status=$?
  trap - EXIT ERR
  [ "$status" -eq 0 ] && return 0
  case $stage in
    "copying the data" | "making site.previous")
      say "Failed $stage. Nothing was changed, and the sequence can be run again as it is." >&2 ;;
    "before the migration") go_back || true ;;
    *) say "Failed $stage. The site is left as it is, and deploy-finished is not made: see deploying.md §5." >&2 ;;
  esac
}
trap on_exit EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

# Copy the data first. A migration cannot be undone, and the restore from an old
# copy loses what was entered since it was made. This is the same copy that
# npm run db:backup makes, taken on the server so that nobody has to be at a
# computer with the tunnel open, and kept beside the site and not instead of the
# daily backup, which is the one that lives somewhere else.
mkdir -p "$copies"
chmod 700 "$copies"
# From a copy that was stopped half way: it is not a .dump, so the pruning below
# would never remove it.
rm -f "$copies"/*.partial
copy=$copies/$(date -u +%Y-%m-%d-%H-%M-%S).dump
say "Copying the data to $copy."
withsettings bash -c 'pg_dump --format=custom --no-password --table=events --table=account_keys --file "$1.partial" "$DATABASE_URL"' _ "$copy"
mv "$copy.partial" "$copy"
# Only the last few are kept: each is the size of the whole of the events.
ls -1t "$copies"/*.dump | tail -n +6 | xargs -r rm --


stage="making site.previous"
cd "$root"
rm -rf site.previous.new
cp -a site site.previous.new
rm -rf site.previous
mv site.previous.new site.previous

cd "$site"
# The marker is taken off, and the stage set, before the checkout and not after:
# the checkout is the first thing that changes the folder the site runs from.
rm "$root/deploy-finished"
stage="before the migration"
git checkout --quiet "$commit"
if ! cmp -s /usr/local/bin/croquetscores-deploy scripts/deploy.sh; then
  say "WARNING: the installed deploy script differs from scripts/deploy.sh in this commit. Install it again (deploying.md §8) so the next deploy uses it."
fi

npm ci
npm run build

stage="in the migration"
withsettings npm run db:migrate

stage="in the restart"
sudo systemctl restart croquetscores

# The restart succeeding says only that the process started. The health address
# says the site came up and can reach its database, which is the thing a failed
# setting or a migration the new code cannot read shows up as.
stage="in looking at the site after the restart"
for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3000/api/v1/health >/dev/null 2>&1; then
    touch "$root/deploy-finished"
    say "$commit is up."
    exit 0
  fi
  sleep 2
done
say "The site did not answer its health address within a minute." >&2
false
