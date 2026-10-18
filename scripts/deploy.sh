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

# Runs a command without the lock (file descriptor 9), so that a process it
# leaves running in the background, as git does to tidy up after a fetch, cannot
# hold the lock after this script has ended and refuse every deploy after it.
nolock() { "$@" 9>&-; }

# A message goes to the screen and to a log on the server. The connection can be
# gone by the time one is written, and writing to a closed pipe would end the
# shell, in the middle of putting the old build back. So the signal is ignored,
# and a write that fails is not a failure.
trap '' PIPE
say() {
  echo "deploy: $*" || true
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*" >>"$root/deploy.log" 2>/dev/null || true
}

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
nolock git fetch origin
if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
  say "The commit $commit is not in the repository." >&2
  exit 1
fi

running=$(git rev-parse HEAD)
if [ "$running" = "$commit" ]; then
  say "$commit is already what is running. Nothing to do."
  exit 0
fi
# Only a commit that comes after what is running. A run of the workflow started
# again from the Actions page, or two merges whose runs were finished in the
# wrong order, would otherwise put an older build over a newer one, and a commit
# on some other line would apply its migrations on top of ones it does not
# know. main is squash-merged and so a straight line; where what is running is
# not on it, deploy by hand (deploying.md §2) to get back onto it.
status=0
git merge-base --is-ancestor "$running" "$commit" || status=$?
if [ "$status" -eq 1 ]; then
  say "$commit does not come after what is running ($running). Not putting it up: deploy by hand (deploying.md §2) if it is what you want." >&2
  exit 1
elif [ "$status" -ne 0 ]; then
  say "Could not tell whether $commit comes after what is running ($running): git said $status. Is the running commit in the server's clone?" >&2
  exit 1
fi

stage="copying the data"

# The restart succeeding says only that the process started. The health address
# says the site came up and can reach its database, which is the thing a failed
# setting or a migration the new code cannot read shows up as.
wait_for_site() {
  local _
  for _ in $(seq 1 30); do
    if curl -fsS http://127.0.0.1:3000/api/v1/health >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  say "The site did not answer its health address within a minute." >&2
  return 1
}

# From the first command that changes what the running site runs from, until
# the database is migrated, a failure is put right by putting the old folder
# back, which is safe because the database has not been touched. After the
# migration it is not, because the old code may not live with the new schema,
# so the site is left as it is for a person to look at (deploying.md §5).
# Called as part of a list (on_exit does so, to end the script by its own status),
# where set -e does nothing, so each step is joined to the next with && and a
# step that fails stops the rest: with the plain lines an `mv site site.failed`
# that failed was followed by an `mv site.previous site` that moved the old
# build inside the broken one, and the marker was made for it.
go_back() {
  say "Failed $stage. Putting the previous build back."
  cd "$root"
  # Checked before anything is stopped, so that the site is left running where
  # there is nothing to put back.
  if [ ! -d site.previous ]; then
    say "There is no site.previous to put back. The site is left as it is: see deploying.md §5." >&2
    return 1
  fi
  {
    nolock sudo systemctl stop croquetscores &&
      rm -rf site.failed &&
      mv site site.failed &&
      mv site.previous site &&
      nolock sudo systemctl start croquetscores &&
      wait_for_site &&
      touch deploy-finished
  } || {
    say "Going back failed or the old build did not answer, and the site may be down. Follow deploying.md §5 by hand." >&2
    return 1
  }
  say "The previous build is running again. What failed is in site.failed."
}
# Run when the script ends by any way but success, and not only when a command
# fails: the workflow's timeout, a cancelled run and a dropped connection end it
# with a signal, which an ERR trap never sees, and that is when the folder is
# most likely to be half built.
on_exit() {
  local status=$?
  # Nothing ends the going back part way: a second signal, as a cancelled run
  # sends after the first, would leave the site moved aside and stopped.
  trap '' HUP INT TERM
  trap - EXIT ERR
  [ "$status" -eq 0 ] && return 0
  case $stage in
    "copying the data")
      say "Failed $stage. Nothing was changed, and the sequence can be run again as it is." >&2 ;;
    "making site.previous")
      say "Failed $stage. The running site was not changed, but site.previous may be missing or half made: the next run makes it again from the site, which is still the good one." >&2 ;;
    "before the migration") go_back || true ;;
    *) say "Failed $stage. The site is left as it is, and deploy-finished is not made: see deploying.md §5." >&2 ;;
  esac
}
# bash runs a trap only when the command in front of it has ended, so a signal
# that arrives during npm ci or the build is acted on when that command ends, not
# at once. The script then goes back from a folder that was finished being
# written, which is the safer of the two.
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
nolock withsettings bash -c 'pg_dump --format=custom --no-password --table=events --table=account_keys --file "$1.partial" "$DATABASE_URL"' _ "$copy"
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
stage="before the migration"
rm "$root/deploy-finished"
nolock git checkout --quiet "$commit"
if ! cmp -s /usr/local/bin/croquetscores-deploy scripts/deploy.sh; then
  say "WARNING: the installed deploy script differs from scripts/deploy.sh in this commit. Install it again (deploying.md §8) so the next deploy uses it."
fi

nolock npm ci
nolock npm run build

stage="in the migration"
nolock withsettings npm run db:migrate

stage="in the restart"
nolock sudo systemctl restart croquetscores

stage="in looking at the site after the restart"
wait_for_site
touch "$root/deploy-finished"
say "$commit is up."
