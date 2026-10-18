Feature: Backing up the website's events and accounts' keys to a file

  The events are everything the website knows: every read model is made from
  them, and nothing else is kept that cannot be made again. The personal parts
  of an event are sealed with a key of the account's own, which is kept in a
  table of its own and not in the events (`AccountKeys.feature`), so a copy of
  the events is of no use without those keys. So the backup is of two tables,
  `events` and `account_keys`, and of nothing else: not a read model, nor a
  session, nor an email waiting to be sent, which can all be made again or
  are not worth keeping.

  The backup is run by "npm run db:backup" on the administrator's own
  computer, from a task the operating system's scheduler starts, and not by
  the website. It is told the website's database, which it only reads
  (`WEBSITE_DATABASE_URL`), the folder the copies are kept in
  (`DATABASE_BACKUP_FOLDER`), and who is to hear how it went
  (`ADMINISTRATOR_EMAIL_ADDRESS`).

  Each run writes one file to the folder: those two tables as pg_dump makes
  them (`pgDump.feature`), in the form pg_restore reads. pg_dump reads both
  at one moment, so the keys in a copy are the keys of the events in it.
  The file is named for the moment the run began, as
  2026-10-13-10-00-00.dump: the year, month, day, hour, minute and second,
  each of the last five with two digits. The moment is written in UTC, so
  that the names sort in the order the files were made whatever the
  computer's own time is doing, and the clocks going back an hour do not make
  one name twice.

  A file is written to a name of its own while pg_dump is making it and given
  its name only once pg_dump has finished, so that a folder never holds half
  a copy under the name of a whole one. A file is never replaced and never
  appended to, and a file already there is never removed: how many copies to
  keep is the administrator's to say, and a backup that removes its own
  earlier copies is one that a fault in it can leave with none.

  That has a cost, which is why it is said here. An account that is forgotten
  is forgotten by deleting its key from the website, for good, and a file
  written before then still has it. The account stays readable in every file
  made before it was forgotten, for as long as the file is kept.

  The website is not turned off for it (`databaseAccess.feature`). pg_dump
  reads the tables as they were at one moment, so a copy is a true copy of
  them at that moment whether or not they were being written to as the copy
  was made.

  Whoever is named is told how every run went, by email, whether it worked or
  not: a backup that is only heard of when it fails is one nobody can tell
  has stopped running. A success says what the file is called, how big it is
  and how long it took. A failure says which step failed and why, so that it
  can be put right. Neither says the address or the password of the website's
  database.

  It exits with success where everything worked, and with failure where
  anything did not, so that the scheduler can show it, whatever the email did.

  These scenarios run the script's own function, over a folder of the
  scenario's own, a pg_dump that the scenario can make write a file or fail,
  a mail sender the scenario can read and take down, and a clock the scenario
  sets.

  Background:
    Given a folder for the backups
    And the website's database is named
    And the administrator is "administrator@example.com"
    And the moment "2026-10-13T10:00:00Z"

  Rule: A dump of the events and the accounts' keys is written to the folder

    Scenario: The dump is written to the folder
      When the backup is run
      Then the folder has 1 file

    Scenario: The file is named for the moment the run began
      When the backup is run
      Then the folder has the file "2026-10-13-10-00-00.dump"

    Scenario: A moment with single digits is written with two
      Given the moment "2026-01-02T03:04:05Z"
      When the backup is run
      Then the folder has the file "2026-01-02-03-04-05.dump"

    Scenario: The name is the moment the run began and not the moment it ended
      Given the dump takes 90 seconds
      When the backup is run
      Then the folder has the file "2026-10-13-10-00-00.dump"

    Scenario: The file holds what pg_dump made
      Given pg_dump makes "the tables as they were"
      When the backup is run
      Then the file "2026-10-13-10-00-00.dump" holds "the tables as they were"

    Scenario: The dump is of the website's database
      When the backup is run
      Then the dump was of the website's database

    Scenario: The events are dumped
      When the backup is run
      Then the dump was of the table "events"

    Scenario: The accounts' keys are dumped
      When the backup is run
      Then the dump was of the table "account_keys"

    Scenario: Nothing else is dumped
      When the backup is run
      Then the dump was of 2 tables

    Scenario: The dump is written to a file of its own while it is made
      When the backup is run
      Then the dump was written to a name that is not the file's

    Scenario: The program is the one the settings name
      Given the settings name the program "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
      When the backup is run
      Then the dump was made by "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"

    Scenario: The program is pg_dump where the settings name none
      When the backup is run
      Then the dump was made by "pg_dump"

    Scenario: Two runs at different moments make two files
      Given the backup is run
      And the moment "2026-10-14T10:00:00Z"
      When the backup is run
      Then the folder has 2 files

    Scenario: The first file is as it was after the second run
      Given pg_dump makes "the first"
      And the backup is run
      And pg_dump makes "the second"
      And the moment "2026-10-14T10:00:00Z"
      When the backup is run
      Then the file "2026-10-13-10-00-00.dump" holds "the first"

    Scenario: Files already there are left alone
      Given the folder has the file "2026-10-12-10-00-00.dump" holding "an earlier dump"
      When the backup is run
      Then the file "2026-10-12-10-00-00.dump" holds "an earlier dump"

    Scenario: Files already there are kept
      Given the folder has the file "2026-10-12-10-00-00.dump" holding "an earlier dump"
      When the backup is run
      Then the folder has 2 files

  Rule: A file is never replaced

    Scenario: A dump of a moment that has a file is not written over it
      Given the folder has the file "2026-10-13-10-00-00.dump" holding "an earlier dump"
      When the backup is run
      Then the file "2026-10-13-10-00-00.dump" holds "an earlier dump"

    Scenario: A dump of a moment that has a file is a failure
      Given the folder has the file "2026-10-13-10-00-00.dump" holding "an earlier dump"
      When the backup is run
      Then the backup exits with failure

    Scenario: A dump of a moment that has a file says so
      Given the folder has the file "2026-10-13-10-00-00.dump" holding "an earlier dump"
      When the backup is run
      Then the email says a file of that name was already there

  Rule: A dump that fails leaves no file

    Scenario: A dump that fails leaves the folder as it was
      Given pg_dump fails
      When the backup is run
      Then the folder has 0 files

    Scenario: A dump that fails part way leaves no half of one
      Given pg_dump fails part way
      When the backup is run
      Then the folder has 0 files

    Scenario: A dump that fails leaves the earlier files
      Given the folder has the file "2026-10-12-10-00-00.dump" holding "an earlier dump"
      And pg_dump fails
      When the backup is run
      Then the folder has 1 file

    Scenario: A dump that fails is a failure
      Given pg_dump fails
      When the backup is run
      Then the backup exits with failure

  Rule: The administrator is told how it went

    Scenario: A success is emailed to the administrator
      When the backup is run
      Then an email was sent to "administrator@example.com"

    Scenario: A success says it worked
      When the backup is run
      Then the email says the backup worked

    Scenario: A success says what the file is called
      When the backup is run
      Then the email says the file is called "2026-10-13-10-00-00.dump"

    Scenario: A success says how big the file is
      Given pg_dump makes "twenty-one bytes long"
      When the backup is run
      Then the email says the file is 21 bytes

    Scenario: A success says how long it took
      Given the dump takes 90 seconds
      When the backup is run
      Then the email says it took 1.5 minutes

    Scenario: A quick run says it took less than a tenth of a minute
      When the backup is run
      Then the email says it took less than 0.1 minutes

    Scenario: A failure is emailed to the administrator
      Given pg_dump fails
      When the backup is run
      Then an email was sent to "administrator@example.com"

    Scenario: A failure says it failed
      Given pg_dump fails
      When the backup is run
      Then the email says the backup failed

    Scenario: A failure's subject begins with a warning
      Given pg_dump fails
      When the backup is run
      Then the email subject begins "WARNING: "

    Scenario: A success's subject does not begin with a warning
      When the backup is run
      Then the email subject does not begin "WARNING: "

    Scenario: A failure says the dump could not be made
      Given pg_dump fails
      When the backup is run
      Then the email says the failure was making the dump

    Scenario: A failure says why
      Given pg_dump fails saying "the server closed the connection"
      When the backup is run
      Then the email says why: "the server closed the connection"

    Scenario: The website's address is not in the email of a success
      When the backup is run
      Then the email does not say the website's address

    Scenario: The website's address is not in the email of a failure
      Given pg_dump fails saying "could not connect to the server at the website's address"
      When the backup is run
      Then the email does not say the website's address

    Scenario: The website's password is not in the email of a failure
      Given pg_dump fails saying "could not connect to the server at the website's address"
      When the backup is run
      Then the email does not say the website's password

    Scenario: A success exits with success
      When the backup is run
      Then the backup exits with success

    Scenario: An email that cannot be sent is a failure
      Given email cannot be sent
      When the backup is run
      Then the backup exits with failure

    Scenario: An email that cannot be sent is said on the screen
      Given email cannot be sent
      When the backup is run
      Then the backup says the administrator could not be told

    Scenario: An email that cannot be sent does not undo the copy
      Given email cannot be sent
      When the backup is run
      Then the folder has the file "2026-10-13-10-00-00.dump"

  Rule: It is told the database and the folder, before it does anything

    Scenario: Without the website's database it is refused
      Given the website's database is not named
      When the backup is run
      Then the backup exits with failure

    Scenario: Without the website's database it tells the administrator
      Given the website's database is not named
      When the backup is run
      Then the email says the failure was that the website's database is not named

    Scenario: Without the website's database nothing is written
      Given the website's database is not named
      When the backup is run
      Then the folder has 0 files

    Scenario: Without a folder it is refused
      Given no folder is named
      When the backup is run
      Then the backup exits with failure

    Scenario: Without a folder it tells the administrator
      Given no folder is named
      When the backup is run
      Then the email says the failure was that the folder is not named

    Scenario: A folder that is not there is refused
      Given the folder is not there
      When the backup is run
      Then the backup exits with failure

    Scenario: A folder that is not there tells the administrator
      Given the folder is not there
      When the backup is run
      Then the email says the failure was that the folder is not there

    Scenario: A folder that is not there is not made
      Given the folder is not there
      When the backup is run
      Then the folder is still not there

    Scenario: A folder that is not there does not ask pg_dump for anything
      Given the folder is not there
      When the backup is run
      Then pg_dump was not run

    Scenario: An argument is refused
      When the backup is run with "--all"
      Then the backup exits with failure

    Scenario: An argument is refused without running pg_dump
      When the backup is run with "--all"
      Then pg_dump was not run

  Rule: What it says on the screen is what the email says

    Scenario: The file is said
      When the backup is run
      Then the backup says the file is called "2026-10-13-10-00-00.dump"

    Scenario: The size is said
      Given pg_dump makes "twenty-one bytes long"
      When the backup is run
      Then the backup says the file is 21 bytes

    Scenario: A failure is said
      Given pg_dump fails
      When the backup is run
      Then the backup says it failed
