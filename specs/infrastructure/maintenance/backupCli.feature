@postgres
Feature: Backing up the website's events to a database on another machine

  The events are everything the website knows: every read model is made from
  them, and nothing else is kept that cannot be made again. So a copy of the
  events is a copy of the website, and a copy kept on another machine is one
  that a failure of the website's machine does not take with it. The personal
  parts of an event are sealed with a key of the account's own, which is kept
  in a table of its own and not in the events (`AccountKeys.feature`), so the
  copy is of those keys as well, or it could not read a name or an email
  address from any account.

  The backup is run by "npm run db:backup" on the administrator's own
  computer, from a task the operating system's scheduler starts, and not by
  the website. It is told two databases: the website's, which it only reads
  (`WEBSITE_DATABASE_URL`), and the computer's own, which it writes
  (`DATABASE_URL`). It is told who is to hear how it went
  (`ADMINISTRATOR_EMAIL_ADDRESS`), and the site key the accounts' keys are
  sealed with (`ACCOUNT_ENCRYPTION_KEY`), which is the website's own. The
  accounts' keys are copied as they are, sealed, and are no more readable to
  the backup than to anybody. The site key is wanted for two things: to know
  that what is copied is readable with it, and for the read models to be made
  again from events with the personal parts in them.

  What it copies of the events is the events the website has and the
  computer's database has not. Each event is given a number by the database
  as it is kept, which only goes up (`PostgresEventStore.feature`), and the
  copy keeps the number it was given. So the backup asks the website only for
  what is numbered after the highest number the computer's database has,
  rather than comparing every stream, which is what makes it quick. That alone
  would miss an event whose number was given before a later one's but which
  was kept after it, as two commands appending at once can leave them. So it
  also asks for what is numbered within the last 10,000 numbers before the
  highest, and copies any it has not. Asked to, with "--all", it compares every
  event there is, which is slow, and is how a copy that has been left out of
  step is put right.

  It copies events as they are, in the order they were kept, and changes
  nothing else: not an event already there, and nothing of the website's. An
  event is the same event where it has the same stream and version, whatever
  its number.

  The accounts' keys are made to be the website's: a key the website has and
  the computer's database has not is added, and one the website has changed
  (the site key is changed by `db:change-site-key`) replaces the copy. One the
  website no longer has is taken away, which is the one thing it takes from
  the computer's database: an account that was forgotten is forgotten by
  deleting its key, for good, and a copy that kept it would keep the account
  readable for as long as the copy was.

  The website is not turned off for it (`databaseAccess.feature`). It only
  reads, an event once written is never changed, and a copy that has every
  event up to some number is a true copy of the website at that moment whether
  or not events were being added as it was made. What was added since is for
  the next run.

  After the events and the keys are copied the read models of the computer's
  database are made again, by running

      npm run db:rebuild-read-models -- --minutes 20

  as the rebuild is run (`rebuildReadModelsCli.feature`), so that the copy can
  be looked at and not only restored. It is run every time the events were
  copied, and also when there were none to copy, since a run that copied
  events and then failed to rebuild them would otherwise leave the read models
  behind until the website next had an event to copy. It is not run where the
  events could not be copied.

  Whoever is named is told how every run went, by email, whether it
  worked or not: a backup that is only heard of when it fails is one nobody
  can tell has stopped running. A success says how many events and keys were
  copied and that the read models were rebuilt, and how long it took. A
  failure says which step failed and why, so that it can be put right. Neither
  says the address or password of either database, or the site key.

  It exits with success where everything worked, and with failure where
  anything did not, so that the scheduler can show it, whatever the email did.

  These scenarios run the script's own function against two databases of the
  scenario's own, a mail sender the scenario can read and take down, and a
  rebuild of the read models that the scenario can make succeed or fail,
  and a site key of their own.

  Background:
    Given a website database
    And a local database
    And the administrator is "administrator@example.com"
    And the site key is the website's
    And the moment "2026-10-13T10:00:00Z"

  Rule: What the website has and the local database has not is copied

    Scenario: An event the local database has not is copied
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/spring"

    Scenario: Every event the local database has not is copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      And the website has the event 1 of the stream "account/sam"
      When the backup is run
      Then the local database has 3 events

    Scenario: The events of a stream are in the order they were added
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      When the backup is run
      Then the second event of the stream "tournament/spring" in the local database is event 2

    Scenario: An event is copied as it is
      Given the website has the event 1 of the stream "tournament/spring" saying "Spring Open"
      When the backup is run
      Then the event 1 of the stream "tournament/spring" in the local database says "Spring Open"

    Scenario: An event the local database has already is not copied again
      Given the website has the event 1 of the stream "tournament/spring"
      And the local database has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the backup says it copied 0 events

    Scenario: Only what is new is copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      And the local database has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the backup says it copied 1 event

    Scenario: Running it twice copies nothing the second time
      Given the website has the event 1 of the stream "tournament/spring"
      And the backup is run
      When the backup is run
      Then the backup says it copied 0 events

    Scenario: What the website added since the last run is copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the backup is run
      And the website has the event 2 of the stream "tournament/spring"
      When the backup is run
      Then the local database has the event 2 of the stream "tournament/spring"

  Rule: An event is located by the number the database gave it

    Scenario: An event is copied with the number the website gave it
      Given the website has the event 1 of the stream "tournament/spring" numbered 41
      When the backup is run
      Then the event 1 of the stream "tournament/spring" in the local database is numbered 41

    Scenario: An event numbered after the highest the local database has is copied
      Given the local database has the event 1 of the stream "tournament/old" numbered 10
      And the website has the event 1 of the stream "tournament/spring" numbered 11
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/spring"

    Scenario: An event numbered before the highest, kept after it, is copied
      Given the local database has the event 1 of the stream "tournament/old" numbered 20
      And the website has the event 1 of the stream "tournament/spring" numbered 19
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/spring"

    Scenario: Only what is within the last 10,000 numbers is looked for
      Given the local database has the event 1 of the stream "tournament/old" numbered 20000
      And the website has the event 1 of the stream "tournament/spring" numbered 1
      When the backup is run
      Then the local database has 1 event

    Scenario: Asked for all of them, every event is looked for
      Given the local database has the event 1 of the stream "tournament/old" numbered 20000
      And the website has the event 1 of the stream "tournament/spring" numbered 1
      When the backup is run with "--all"
      Then the local database has the event 1 of the stream "tournament/spring"

    Scenario: An event of another number but the same stream and version is the same event
      Given the website has the event 1 of the stream "tournament/spring" numbered 5
      And the local database has the event 1 of the stream "tournament/spring" numbered 9
      When the backup is run
      Then the backup says it copied 0 events

    Scenario: An event with a number another event has is a failure
      Given the website has the event 1 of the stream "tournament/spring" numbered 5
      And the local database has the event 1 of the stream "tournament/old" numbered 5
      When the backup is run
      Then the backup exits with failure

  Rule: The accounts' keys are copied with the events

    Scenario: A key the local database has not is copied
      Given the website has a key for the account "sam"
      When the backup is run
      Then the local database has a key for the account "sam"

    Scenario: A key is copied as it is
      Given the website has a key for the account "sam"
      When the backup is run
      Then the key of the account "sam" in the local database is the website's

    Scenario: A key the website has changed is copied over the old
      Given the website has a key for the account "sam"
      And the local database has an older key for the account "sam"
      When the backup is run
      Then the key of the account "sam" in the local database is the website's

    Scenario: A key the website no longer has is taken away
      Given the local database has a key for the account "sam"
      When the backup is run
      Then the local database has no key for the account "sam"

    Scenario: A forgotten account is forgotten in the copy
      Given the website has a key for the account "pat"
      And the backup is run
      And the website has forgotten the account "pat"
      When the backup is run
      Then the local database has no key for the account "pat"

    Scenario: Keys are copied or none are, with the events
      Given the website has a key for the account "sam"
      And the website has the event 1 of the stream "tournament/spring"
      And writing the first event to the local database fails
      When the backup is run
      Then the local database has no key for the account "sam"

    Scenario: A key the website has not changed is not copied again
      Given the website has a key for the account "sam"
      And the backup is run
      When the backup is run
      Then the backup says it copied 0 keys

    Scenario: The keys copied are said
      Given the website has a key for the account "sam"
      When the backup is run
      Then the backup says it copied 1 key

  Rule: The site key is the one the website's keys are sealed with

    Scenario: Without the site key it is refused
      Given no site key is named
      When the backup is run
      Then the backup says the site key is needed

    Scenario: Without the site key nothing is copied
      Given no site key is named
      And the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the local database has 0 events

    Scenario: A site key that is not the website's is refused
      Given the site key is not the website's
      And the website has a key for the account "sam"
      When the backup is run
      Then the backup exits with failure

    Scenario: A site key that is not the website's copies nothing
      Given the site key is not the website's
      And the website has the event 1 of the stream "tournament/spring"
      And the website has a key for the account "sam"
      When the backup is run
      Then the local database has 0 events

    Scenario: A site key that is not the website's is said, by the email
      Given the site key is not the website's
      And the website has a key for the account "sam"
      When the backup is run
      Then the email says the failure was that the site key is not the website's

    Scenario: The site key is not in the email
      Given the site key is not the website's
      And the website has a key for the account "sam"
      When the backup is run
      Then the email does not say the site key

  Rule: Nothing of the website is changed

    Scenario: The website's events are as they were
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the website has 1 event

    Scenario: The website is not turned off for it
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then database access was never turned off

  Rule: What the local database has of the events is never changed or taken away

    Scenario: An event only the local database has is kept
      Given the local database has the event 1 of the stream "tournament/old"
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/old"

    Scenario: An event that is not the website's is not copied over
      Given the website has the event 1 of the stream "tournament/spring" saying "Spring Open"
      And the local database has the event 1 of the stream "tournament/spring" saying "Autumn Open"
      When the backup is run
      Then the event 1 of the stream "tournament/spring" in the local database says "Autumn Open"

    Scenario: An event that is not the website's is a failure
      Given the website has the event 1 of the stream "tournament/spring" saying "Spring Open"
      And the local database has the event 1 of the stream "tournament/spring" saying "Autumn Open"
      When the backup is run
      Then the backup exits with failure

    Scenario: An event that is not the website's is said, in the failure
      Given the website has the event 1 of the stream "tournament/spring" saying "Spring Open"
      And the local database has the event 1 of the stream "tournament/spring" saying "Autumn Open"
      When the backup is run
      Then the failure says the event 1 of the stream "tournament/spring" is not the same in both

  Rule: Every event is copied or none is

    The copy is one transaction of the local database, so a run that fails
    part way leaves the database as it was, and the next run copies what this
    one meant to. A stream is not left with some of its events and the rest
    missing from the middle.

    Scenario: A copy that fails part way copies nothing
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      And writing the second event to the local database fails
      When the backup is run
      Then the local database has 0 events

    Scenario: A copy that failed is copied in full by the next run
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      And writing the second event to the local database fails
      And the backup is run
      And writing to the local database works again
      When the backup is run
      Then the local database has 2 events

  Rule: The read models are made again after the events are copied

    Scenario: The read models are rebuilt for 20 minutes
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the read models were rebuilt, expected to take 20 minutes

    Scenario: The read models are rebuilt after the events are copied
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the read models were rebuilt after the events were copied

    Scenario: The read models are rebuilt where there were no events to copy
      When the backup is run
      Then the read models were rebuilt, expected to take 20 minutes

    Scenario: The read models are not rebuilt where the events could not be copied
      Given the website has the event 1 of the stream "tournament/spring"
      And writing the first event to the local database fails
      When the backup is run
      Then the read models were not rebuilt

    Scenario: A rebuild that fails is a failure
      Given the read models cannot be rebuilt
      When the backup is run
      Then the backup exits with failure

    Scenario: A rebuild that fails leaves the events copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the read models cannot be rebuilt
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/spring"

  Rule: The administrator is told how it went

    Scenario: A success is emailed to the administrator
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then an email was sent to "administrator@example.com"

    Scenario: A success says it worked
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the email says the backup worked

    Scenario: A success says how many events were copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the website has the event 2 of the stream "tournament/spring"
      When the backup is run
      Then the email says 2 events were copied

    Scenario: A success where nothing was new says so
      When the backup is run
      Then the email says 0 events were copied

    Scenario: A success says how many keys were copied
      Given the website has a key for the account "sam"
      When the backup is run
      Then the email says 1 key was copied

    Scenario: A success says the read models were rebuilt
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the email says the read models were rebuilt

    Scenario: A success says how long it took
      Given the website has the event 1 of the stream "tournament/spring"
      And the run takes 3 minutes
      When the backup is run
      Then the email says it took 3 minutes

    Scenario: A failure is emailed to the administrator
      Given the website cannot be reached
      When the backup is run
      Then an email was sent to "administrator@example.com"

    Scenario: A failure says it failed
      Given the website cannot be reached
      When the backup is run
      Then the email says the backup failed

    Scenario: A failure says the website could not be reached
      Given the website cannot be reached
      When the backup is run
      Then the email says the failure was reading the website's events

    Scenario: A failure copying says it was copying the events
      Given the website has the event 1 of the stream "tournament/spring"
      And writing the first event to the local database fails
      When the backup is run
      Then the email says the failure was copying the events

    Scenario: A failure rebuilding the read models says so
      Given the read models cannot be rebuilt
      When the backup is run
      Then the email says the failure was rebuilding the read models

    Scenario: A failure rebuilding the read models says the events were copied
      Given the website has the event 1 of the stream "tournament/spring"
      And the read models cannot be rebuilt
      When the backup is run
      Then the email says 1 event was copied

    Scenario: A failure says why
      Given the website cannot be reached
      When the backup is run
      Then the email says why the website could not be reached

    Scenario: The local database cannot be reached is a failure said so
      Given the local database cannot be reached
      When the backup is run
      Then the email says the failure was reaching the local database

    Scenario: Neither database's address is in the email of a success
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the email does not say the address of either database

    Scenario: Neither database's address is in the email of a failure
      Given the website cannot be reached
      When the backup is run
      Then the email does not say the address of either database

    Scenario: A success exits with success
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the backup exits with success

    Scenario: A failure exits with failure
      Given the website cannot be reached
      When the backup is run
      Then the backup exits with failure

    Scenario: An email that cannot be sent is a failure, said on the screen
      Given the website has the event 1 of the stream "tournament/spring"
      And email cannot be sent
      When the backup is run
      Then the backup exits with failure

    Scenario: An email that cannot be sent is said
      Given the website has the event 1 of the stream "tournament/spring"
      And email cannot be sent
      When the backup is run
      Then the backup says the administrator could not be told

    Scenario: An email that cannot be sent does not undo the copy
      Given the website has the event 1 of the stream "tournament/spring"
      And email cannot be sent
      When the backup is run
      Then the local database has the event 1 of the stream "tournament/spring"

  Rule: It is told who to tell, and both databases, before it does anything

    Scenario: Without an administrator it is refused
      Given no administrator is named
      When the backup is run
      Then the backup exits with failure

    Scenario: Without an administrator it says one is needed
      Given no administrator is named
      When the backup is run
      Then the backup says an administrator is needed

    Scenario: Without an administrator nothing is copied
      Given no administrator is named
      And the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the local database has 0 events

    Scenario: Without the website's database it is refused, and tells the administrator
      Given the website's database is not named
      When the backup is run
      Then the email says the failure was that the website's database is not named

    Scenario: The website and the local database must not be the same database
      Given the website's database is the local database
      When the backup is run
      Then the backup exits with failure

    Scenario: The same database named twice says so
      Given the website's database is the local database
      When the backup is run
      Then the backup says the website and the local database are the same

  Rule: What it says on the screen is what the email says

    A scheduled task's output is the first place somebody looks when the email
    did not come, so the same things are said there as are emailed.

    Scenario: The count of events is said
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the backup says it copied 1 event

    Scenario: That the read models were rebuilt is said
      Given the website has the event 1 of the stream "tournament/spring"
      When the backup is run
      Then the backup says the read models were rebuilt

    Scenario: A failure is said
      Given the website cannot be reached
      When the backup is run
      Then the backup says it failed
