#!/usr/bin/env bash
# Puts each site's app_offline.htm on the site it belongs to, over FTPS, as
# https://github.com/projectkudu/kudu/wiki/Accessing-files-via-ftp describes.
# Azure takes a site offline when app_offline.htm is in its wwwroot folder and
# answers every request with that page until the file is taken away again.
#
#   ./upload-app-offline.sh --dry-run             say what would be done, do nothing
#   ./upload-app-offline.sh                       upload all four, then read each back
#   ./upload-app-offline.sh gateballscores.com    upload only the sites named
#   ./upload-app-offline.sh --remove              take the file away again, which
#                                                 puts the sites back online
#   ./upload-app-offline.sh --test                upload a dummy file, read it back
#                                                 and delete it, to find out whether
#                                                 the sign-ins work, with the sites
#                                                 left online
#
# Each site's FTP sign-in is read from upload-app-offline.json beside this
# file, which git ignores because it holds passwords. Every value in it starts
# as REPLACE_HOST, REPLACE_USER or REPLACE_PASSWORD, to be found and replaced.
# A site whose host or user name is still a placeholder is not touched. The user name has the
# site's name in front of the deployment user, as sitename\deploymentuser, and
# without it the sign-in fails (the Kudu page says so). The host and user name
# are in the Azure portal under the site's deployment centre. A password left as
# its placeholder, or as an empty string, is asked for, so that it need not be
# written down. It is
# given to curl on its standard input and not as an argument, so that it is not
# in the list of running processes.
#
# This reads the file with node, which this repository needs anyway, and not
# with jq, which it does not.
set -euo pipefail

here=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
settings="$here/upload-app-offline.json"
all_sites=(croquetscores.com try.croquetscores.com gateballscores.com try.gateballscores.com)
remote_path=site/wwwroot/app_offline.htm
# Not called app_offline.htm, which would take the site offline, nor anything
# else the site serves, so that a test can never be mistaken for the real thing.
test_path=site/wwwroot/app_offline-test.txt

dry_run=false
remove=false
test=false
sites=()
for argument in "$@"; do
  case "$argument" in
  --dry-run) dry_run=true ;;
  --remove) remove=true ;;
  --test) test=true ;;
  -*)
    echo "Unknown option: $argument" >&2
    exit 2
    ;;
  *) sites+=("$argument") ;;
  esac
done
if [ ${#sites[@]} -eq 0 ]; then
  sites=("${all_sites[@]}")
fi
if $test && $remove; then
  echo "--test and --remove cannot be used together" >&2
  exit 2
fi

if [ ! -f "$settings" ]; then
  echo "No $settings" >&2
  exit 1
fi

# One value of one site's sign-in, or nothing where it is missing or still the
# placeholder it began as, so that both are met in one place below.
setting() {
  node -e '
    const [file, site, name] = process.argv.slice(1);
    const value = JSON.parse(require("node:fs").readFileSync(file, "utf8"))[site]?.[name];
    if (typeof value === "string" && !value.startsWith("REPLACE_")) {
      process.stdout.write(value);
    }
  ' "$settings" "$1" "$2"
}

# curl reads its settings from a file where a backslash and a double quote
# inside quotes mean something, and a user name has a backslash in it.
curl_quoted() {
  printf '"%s"' "$(printf '%s' "$1" | sed 's/[\\"]/\\&/g')"
}

# Every request is made with the sign-in on standard input, and over TLS
# (--ssl-reqd), so that the password is never sent in the clear: a server that
# will not secure the connection makes this fail and not fall back.
ftp() {
  local user=$1 password=$2
  shift 2
  printf 'user = %s\n' "$(curl_quoted "$user:$password")" |
    curl --silent --show-error --fail --ssl-reqd --ftp-pasv --config - "$@"
}

failed=()
for site in "${sites[@]}"; do
  file="$here/$site/app_offline.htm"
  if ! $test && [ ! -f "$file" ]; then
    echo "$site: no $file" >&2
    failed+=("$site")
    continue
  fi

  host=$(setting "$site" host)
  # The portal shows the address as ftps://host/site/wwwroot, and it is pasted
  # as it is shown. Only the name of the host is wanted: the scheme is chosen
  # below (explicit TLS on the ordinary FTP port, which is what Azure offers)
  # and the folder is the script's own.
  host=${host#*://}
  host=${host%%/*}
  user=$(setting "$site" user)

  if $dry_run; then
    if $test; then
      action="upload and then delete $test_path"
    elif $remove; then
      action="delete $remote_path"
    else
      action="upload $file to $remote_path"
    fi
    echo "$site: would $action on ftp://${host:-<host not set>}/ as ${user:-<user not set>}"
    continue
  fi

  if [ -z "$host" ] || [ -z "$user" ]; then
    echo "$site: replace the host and user in $settings" >&2
    failed+=("$site")
    continue
  fi

  # A password still as the placeholder, or empty, is asked for rather than
  # refused, so that it need not be written into a file at all.
  password=$(setting "$site" password)
  if [ -z "$password" ]; then
    read -r -s -p "$site: FTP password for $user: " password
    echo
  fi

  if $test; then
    # The whole round the real run takes (sign in, write, read back, delete),
    # with a file that does nothing, so that a wrong host, user name, password
    # or folder is found with the sites still online.
    dummy=$(mktemp)
    printf 'Test of upload-app-offline.sh, safe to delete. %s\n' "$(date -u +%FT%TZ)" >"$dummy"
    ok=true
    if ! ftp "$user" "$password" --upload-file "$dummy" "ftp://$host/$test_path"; then
      echo "$site: test upload failed" >&2
      ok=false
    elif ! ftp "$user" "$password" "ftp://$host/$test_path" | cmp -s - "$dummy"; then
      echo "$site: test file uploaded, but what is there differs" >&2
      ok=false
    fi
    # Deleted even after a failed read back, so that nothing is left behind.
    if $ok || ftp "$user" "$password" --output /dev/null "ftp://$host/$test_path" 2>/dev/null; then
      if ! ftp "$user" "$password" --quote "DELE $test_path" --output /dev/null "ftp://$host/"; then
        echo "$site: test file uploaded but could not be deleted; remove $test_path by hand" >&2
        ok=false
      elif ftp "$user" "$password" --output /dev/null "ftp://$host/$test_path" 2>/dev/null; then
        echo "$site: test file still there after deleting it" >&2
        ok=false
      fi
    fi
    rm -f "$dummy"
    if $ok; then
      echo "$site: test file uploaded, read back, deleted, and gone"
    else
      failed+=("$site")
    fi
    continue
  fi

  if $remove; then
    # DELE is sent as a command on the connection; listing the root is the
    # request it rides on, and its output is of no use.
    if ftp "$user" "$password" --quote "DELE $remote_path" --output /dev/null "ftp://$host/"; then
      echo "$site: app_offline.htm removed"
    else
      echo "$site: could not remove app_offline.htm" >&2
      failed+=("$site")
    fi
    continue
  fi

  if ! ftp "$user" "$password" --upload-file "$file" "ftp://$host/$remote_path"; then
    echo "$site: upload failed" >&2
    failed+=("$site")
    continue
  fi

  # Read it back, because an upload that was cut short or went to the wrong
  # folder looks the same as one that worked until somebody visits the site.
  if ftp "$user" "$password" "ftp://$host/$remote_path" | cmp -s - "$file"; then
    echo "$site: uploaded, and read back the same"
  else
    echo "$site: uploaded, but what is there differs from $file" >&2
    failed+=("$site")
  fi
done

if [ ${#failed[@]} -gt 0 ]; then
  echo "Failed: ${failed[*]}" >&2
  exit 1
fi
