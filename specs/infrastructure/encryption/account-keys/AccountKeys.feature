@postgres
Feature: Keeping an account's name and email address readable only with its own key

  An account's name and email address are personal, and are kept for as long as
  the account's events are, which is for good: an event log is only ever added
  to. So they are never kept as they were given. Each account has a key of its
  own, made when it is registered, and its name and email address are
  encrypted with that key wherever they are kept — in its events, and in any
  read model that needs them — and decrypted when they are read back.

  An account's key is not kept beside what it encrypts. It is kept in a table
  of its own, and kept there encrypted in turn, with the site's key: the
  setting ACCOUNT_ENCRYPTION_KEY, held in .env like every other secret. So
  anyone who takes the database without the site's key takes nothing they can
  read, and anyone who takes the events without the table of keys takes less.

  An account is forgotten by rewriting its events, which is unusual: an event
  log is only ever added to, and this is the one place in the site where what
  was kept is changed. The events that hold an account's name, its email
  address and the Google account linked to it are rewritten, in the
  transaction that records the forgetting, to hold what a forgotten account is
  called instead, encrypted with the account's key as they were before. The
  key is kept. So what was kept of the person is no longer kept anywhere, and
  not merely unreadable, and the account reads back, with its key, as the
  forgotten account its events now say it is. Forgetting does not on its own
  stop the account being found by its email address, which is found by a hash
  made with a key of the whole site's; it records an event as well, which is
  what does, and is below. Who may have an account forgotten, and how, is
  specified with the forget account page: the reader signed in to it,
  confirming by a link emailed to its address. A key of its own is also what
  makes the site's key cheap to change: only the table of account keys is
  encrypted with it, and the few emails waiting in the queue with no account
  to belong to, so changing it re-encrypts those, and not a single event.

  The encryption is AES-256-GCM, which refuses to decrypt anything that has
  been changed since it was encrypted, rather than decrypting it into
  something else. It refuses the same way when the key is wrong, and cannot
  tell the two apart. So the table of account keys also keeps a mark of the
  site's key it was encrypted with — a keyed hash of a fixed text, made with
  that key, which says nothing of the key itself — and the mark is checked
  before anything is decrypted. A store opened with another site's key is
  refused as that, with `AccountKeys.WrongSiteKey`, rather than finding every
  account it holds tampered with; `AccountKeys.Tampered` is left meaning what
  it says. Encrypting the same thing twice gives two different results,
  so that two accounts with the same name cannot be told apart by what is kept,
  nor one account's name matched from one event to the next.

  The Google account linked to an account is kept the same way. What it is
  kept by is the subject Google knows it by, which says nothing a reader could
  read, but is the same for that person on every site that signs in with
  Google, so kept as it was given it would tie a forgotten account to the
  person it was for good.

  Background:
    Given the site's key
    And an account key store

  Rule: Every account has a key of its own

    Scenario: Registering an account makes it a key
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then the account has a key

    Scenario: Two accounts have different keys
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And another account is registered at "sam@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then the two accounts' keys differ

    Scenario: An account's key is not kept as it is
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then no row of the account key store contains the account's key

  Rule: What is kept of a name, an email address and a Google account cannot be read without the key

    Scenario: The account's events do not hold its name
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then nothing kept of the account's events contains "Sam Someone"

    Scenario: The account's events do not hold a name it was changed to
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account's name is changed to "Samantha Someone"
      Then nothing kept of the account's events contains "Samantha Someone"

    Scenario: The account's events do not hold its email address
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then nothing kept of the account's events contains "someone@example.com"

    Scenario: The account's events do not hold an address moving it was asked to
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And moving the account to "sam@example.org" is asked for, as "asking-1"
      Then nothing kept of the account's events contains "sam@example.org"

    Scenario: The account's events do not hold an address it was moved to
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then nothing kept of the account's events contains "sam@example.org"

    Scenario: The account's events do not hold the Google account linked to it
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the Google account "google-subject-1" is linked to the account
      Then nothing kept of the account's events contains "google-subject-1"

    Scenario: The same name kept for two accounts is kept differently
      When an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And another account is registered at "sam@example.com"
      And the account's email address is confirmed as "Sam Someone"
      Then what is kept of the two names differs

    Scenario: The same name encrypted twice for one account is kept differently
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When "Sam Someone" is encrypted for the account twice
      Then the two encryptions differ

  Rule: Read back with its key, an account is as it was given

    Scenario: A name reads back as it was given
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is read back
      Then the account is called "Sam Someone"

    Scenario: A name it was changed to reads back as it was given
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account's name is changed to "Samantha Someone"
      When the account is read back
      Then the account is called "Samantha Someone"

    Scenario: An email address reads back as it was given
      Given an account is registered at "Someone@Example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is read back
      Then the account is reached at "Someone@Example.com"

    Scenario: An address it was moved to reads back as it was given
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account is moved to "Sam@Example.org" with the email address hash "hash-of-sam"
      When the account is read back
      Then the account is reached at "Sam@Example.org"

    Scenario: A Google account reads back as it was linked
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the Google account "google-subject-1" is linked to the account
      When the account is read back
      Then the account is linked to the Google account "google-subject-1"

  Rule: An append that is refused leaves no key behind

    A key is made as an account's registering is kept, and the keeping may
    still be refused after that: the stream may have moved on since whoever
    appended read it. The key is made only once the append is certain, so that
    a refusal leaves the keys as they were rather than a key for an account
    nothing else knows about.

    Scenario: An append refused for the version it expected makes no key
      When an account is registered expecting its stream to have been added to
      Then it is refused with "EventStore.Concurrency"
      And no key was made

  Rule: What is kept, altered in the database, is refused rather than read

    Scenario: A name altered where it is kept is refused
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And what is kept of the account's name has been altered in the database
      When the account is read back
      Then reading it is refused with "AccountKeys.Tampered"

    Scenario: A name encrypted for one account cannot be read as another's
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And another account is registered at "alex@example.com"
      And the account's email address is confirmed as "Alex Other"
      And what is kept of the first account's name has been copied over the second account's in the database
      When the second account is read back
      Then reading it is refused with "AccountKeys.Tampered"

  Rule: A forgotten account has what is personal in its events rewritten, and keeps its key

    A forgotten account still has to be called something and reached at
    something that is an email address wherever it appears. It is called
    "Forgotten Account", followed by the uuid in the account's own id, and is
    reached at "forgotten-account-", the same uuid without its hyphens, and
    "@example.com". The uuid comes from the id rather than being made afresh,
    so that the account reads back the same every time; the id is kept in any
    case, and says nothing about the person. Nothing is ever sent to that
    address: example.com is reserved so that nobody owns it. A Google account
    it was linked to reads back as "google-account-forgotten-" and the same
    uuid, which no Google account is known by, since Google knows every one by
    digits alone.

    Forgetting rewrites those events and adds the one that records it, and
    takes no event away. The table an account is found by holds a keyed hash
    of its address, made with a key the whole site shares, which rewriting the
    events does not touch; left alone, the row would still find the forgotten
    account by its old address, and keep the address from being registered
    again. So the read model marks the row forgotten when it is given the
    event that records the forgetting, and never finds it again. The row is
    kept, and so is the hash in it.

    Scenario: Forgetting an account keeps its key
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is forgotten
      Then the account has a key

    Scenario: Forgetting an account takes none of its events away
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And every event is noted
      When the account is forgotten
      Then the account's events are all still kept

    Scenario: What was kept of the account's name, address and Google account is kept no longer
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the Google account "google-subject-1" is linked to the account
      And every event is noted
      When the account is forgotten
      Then every event that held something personal is kept differently

    Scenario: A forgotten account is called forgotten, by its id
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is forgotten
      And the account is read back
      Then the account is called "Forgotten Account 7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: A forgotten account is called forgotten, whatever it was changed to
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account's name is changed to "Samantha Someone"
      When the account is forgotten
      And the account is read back
      Then the account is called "Forgotten Account 7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: A forgotten account is reached at a forgotten address, by its id
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is forgotten
      And the account is read back
      Then the account is reached at "forgotten-account-7c9e6679742540de944be07fc1f90ae7@example.com"

    Scenario: A forgotten account is reached at a forgotten address, whatever it was moved to
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account is moved to "samantha@example.com" with the email address hash "hash-of-samantha"
      When the account is forgotten
      And the account is read back
      Then the account is reached at "forgotten-account-7c9e6679742540de944be07fc1f90ae7@example.com"

    Scenario: A forgotten account is linked to a forgotten Google account, by its id
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the Google account "google-subject-1" is linked to the account
      When the account is forgotten
      And the account is read back
      Then the Google account kept for the account is "google-account-forgotten-7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: A forgotten account reads back the same every time
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account is forgotten
      When the account is read back twice
      Then it is called the same both times
      And it is reached at the same address both times

    Scenario: Nothing is sent to a forgotten account's address
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account is forgotten
      When an email is queued for the account
      Then nothing is queued to be sent

    Scenario: A forgotten account cannot be found by its email address
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the account is forgotten
      And the account for "someone@example.com" is looked for
      Then nothing is found

    Scenario: Another account is untouched by one being forgotten
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And another account is registered at "alex@example.com"
      And the account's email address is confirmed as "Alex Other"
      When the first account is forgotten
      And the second account is read back
      Then the account is called "Alex Other"

  Rule: An account forgotten before its events were rewritten is rewritten afterwards

    Accounts were forgotten by deleting their key before they were forgotten
    by rewriting their events. Their events still hold what was kept, which
    nobody can read, and they have no key. Rewriting every forgotten account's
    events gives such an account the key it is rewritten with, and leaves one
    already rewritten as it was, so that it can be done again. It is a script
    (`npm run db:rewrite-forgotten-accounts`) that turns database access off
    first, as rebuilding the read models does, and rebuilds them afterwards,
    since a read model made from the events as they were holds what they held.

    Scenario: An account forgotten by deleting its key is given a key
      Given an account was forgotten by deleting its key
      When the forgotten accounts are rewritten
      Then the account has a key

    Scenario: An account forgotten by deleting its key is rewritten
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" was forgotten by deleting its key
      And every event is noted
      When the forgotten accounts are rewritten
      And the account is read back
      Then every event that held something personal is kept differently
      And the account is called "Forgotten Account 7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: An account marked forgotten whose events were not rewritten is rewritten
      Given an account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" was forgotten by deleting its key
      And the account's key is made and marked forgotten
      And every event is noted
      When the forgotten accounts are rewritten
      And the account is read back
      Then every event that held something personal is kept differently
      And the account is called "Forgotten Account 7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: An account that is not forgotten is left as it was
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And every event is noted
      When the forgotten accounts are rewritten
      And the account is read back
      Then every event is kept exactly as it was before
      And the account is called "Sam Someone"

    Scenario: Rewriting twice leaves the events as the first time did
      Given an account was forgotten by deleting its key
      And the forgotten accounts are rewritten
      And every event is noted
      When the forgotten accounts are rewritten
      Then every event is kept exactly as it was before

  Rule: The site's key is needed, and changing it rewrites none of the events

    Scenario: Without the site's key the account key store cannot be made
      When an account key store is made with no site's key
      Then it is refused with "AccountKeys.SiteKeyMissing"

    Scenario: With a different site's key, no account can be read
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      And the account key store is made again with a different site's key
      When the account is read back
      Then reading it is refused with "AccountKeys.WrongSiteKey"

    Scenario: After the site's key is changed, every account still reads back
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the site's key is changed to a new one
      And the account is read back with the new site's key
      Then the account is called "Sam Someone"

    Scenario: An email queued with no account is still sent once the site's key is changed
      Given the email "Email.RegisterInstead" has been queued for "nobody@example.com"
      When the site's key is changed to a new one
      And what is queued is sent with the new site's key
      Then "nobody@example.com" was sent the email "Email.RegisterInstead"

    Scenario: Changing the site's key rewrites none of the events
      Given an account is registered at "someone@example.com"
      And the account's email address is confirmed as "Sam Someone"
      When the site's key is changed to a new one
      Then every event is kept exactly as it was before
