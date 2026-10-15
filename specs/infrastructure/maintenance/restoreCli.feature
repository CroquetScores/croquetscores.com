@postgres
Feature: Restoring the website's events and accounts' keys from a backup file

  A file of the backup (`backupCli.feature`) holds the data of two tables,
  `events` and `account_keys`, and nothing of the rest of the website: not
  the other tables, which the migrations make, and not the read models, which
  are made again from the events. So a restore is a database made new, given
  its tables by the migrations, and the file restored into those two.

  It is run by "npm run db:restore -- <database name> <file>". It is told the
  name of the database to make and the file to restore into it, and nothing
  else: the Postgres it makes the database on is the one `DATABASE_URL`
  names, with the same user and password, and it finds pg_restore beside the
  pg_dump that `PG_DUMP_PATH` names, or by the name pg_restore where that is
  blank.

  It only ever makes a database. One of that name that is already there is
  refused, and nothing is done to it, so that a restore can never be run over
  a website's database by a name mistyped. A restore that fails part way
  leaves nothing behind, since a database of the name would then be in the way
  of running it again: the database it made is dropped, and only that one,
  which it knows it made because it found no other of the name before it
  began.

  What it makes is the tables and the data, and not a working site. The read
  models are still to be made, as `npm run db:rebuild-read-models` does with
  `DATABASE_URL` naming the new database, and it says so when it has
  finished.

  These scenarios run the script's own function over the scenario's own
  Postgres, with names of databases the scenario made up and drops. The one
  program they do not run is pg_restore, which is the scenario's, so that
  what it was asked and what it found are read and so that it can be made to
  fail (`pgRestore.feature`).

  Background:
    Given the name of a database that is not there
    And a dump file

  Rule: A database is made, given the website's tables, and the file restored into it

    Scenario: The database is made
      When the restore is run
      Then the restored database is there

    Scenario: The database is given the website's tables
      When the restore is run
      Then the database has the tables of the website

    Scenario: The tables were there when the file was restored
      When the restore is run
      Then the tables were there when the file was restored

    Scenario: The file is restored into the database made
      When the restore is run
      Then the file was restored into the database

    Scenario: The program is the one the settings name
      Given the settings name pg_dump as "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
      When the restore is run
      Then the file was restored by "C:\Program Files\PostgreSQL\17\bin\pg_restore.exe"

    Scenario: The program is pg_restore where the settings name none
      When the restore is run
      Then the file was restored by "pg_restore"

    Scenario: A restore that worked exits with success
      When the restore is run
      Then the restore exits with success

    Scenario: A restore that worked says the database is made
      When the restore is run
      Then the restore says the database was made

    Scenario: A restore that worked says what is still to do
      When the restore is run
      Then the restore says the read models are still to be made

  Rule: It says how far it has got as it goes

    A restore of a large backup takes a while, and a script that says nothing
    for that long is one nobody can tell from one that has stopped. So it says
    each thing as it is done, and not all of it at the end: that the database
    was made, and, before pg_restore is asked to begin, which file it is
    about to import. The file is named by its own name and not the whole of
    where it is.

    Scenario: It says the database was created
      When the restore is run
      Then the restore says the database was created

    Scenario: It says which file it is importing
      When the restore is run
      Then the restore says it is importing "2026-10-13-10-00-00.dump"

    Scenario: It does not say where the file is
      When the restore is run
      Then the restore does not say the folder the file is in

    Scenario: It says the database was created before it imports the file
      When the restore is run
      Then the database was said to be created before pg_restore was asked

    Scenario: It says which file it is importing before pg_restore is asked
      When the restore is run
      Then the file was said to be imported before pg_restore was asked

    Scenario: A database that is refused is not said to be created
      Given the name of a database that is there
      When the restore is run
      Then the restore does not say the database was created

    Scenario: A file that is not there is not said to be imported
      Given the dump file is not there
      When the restore is run
      Then the restore does not say it is importing a file

  Rule: A database that is there is never restored into

    Scenario: A database of the name is refused
      Given the name of a database that is there
      When the restore is run
      Then the restore exits with failure

    Scenario: A database of the name is said to be there
      Given the name of a database that is there
      When the restore is run
      Then the restore says the database is already there

    Scenario: A database of the name is not restored into
      Given the name of a database that is there
      When the restore is run
      Then pg_restore was not run

    Scenario: A database of the name is given no tables
      Given the name of a database that is there
      When the restore is run
      Then the database has none of the website's tables

    Scenario: A database of the name is not dropped
      Given the name of a database that is there
      When the restore is run
      Then the restored database is there

  Rule: A restore that fails leaves no database

    Scenario: A restore that fails drops the database it made
      Given pg_restore fails
      When the restore is run
      Then the restored database is not there

    Scenario: A restore that fails exits with failure
      Given pg_restore fails
      When the restore is run
      Then the restore exits with failure

    Scenario: A restore that fails says why
      Given pg_restore fails saying "pg_restore: error: could not read the file"
      When the restore is run
      Then the restore says "pg_restore: error: could not read the file"

    Scenario: A restore that fails says the database was dropped
      Given pg_restore fails
      When the restore is run
      Then the restore says the database it made was dropped

    Scenario: A restore that fails can be run again with the same name
      Given pg_restore fails
      And the restore is run
      And pg_restore works
      When the restore is run
      Then the restored database is there

  Rule: It is told what to restore before it does anything

    Scenario: Without a name it is refused
      Given no database name is given
      When the restore is run
      Then the restore exits with failure

    Scenario: Without a name it says what it is run with
      Given no database name is given
      When the restore is run
      Then the restore says how it is run

    Scenario: Without a file it is refused
      Given no dump file is given
      When the restore is run
      Then the restore exits with failure

    Scenario: A file that is not there is refused
      Given the dump file is not there
      When the restore is run
      Then the restore exits with failure

    Scenario: A file that is not there is said not to be
      Given the dump file is not there
      When the restore is run
      Then the restore says the file is not there

    Scenario: A file that is not there makes no database
      Given the dump file is not there
      When the restore is run
      Then the restored database is not there

    Scenario Outline: A name that is not letters, digits, hyphens and underscores is refused
      Given the database name "<name>"
      When the restore is run
      Then the restore exits with failure

      Examples:
        | name             |
        | has a space      |
        | semi;colon       |
        | single'quote     |
        | dot.ted          |
        | back\slash       |

    Scenario: A name that is refused says why
      Given the database name "has a space"
      When the restore is run
      Then the restore says the name is not one it will make

    Scenario: A name that is refused is not restored into
      Given the database name "has a space"
      When the restore is run
      Then pg_restore was not run

    Scenario: More than a name and a file is refused
      When the restore is run with a third argument
      Then the restore exits with failure

    Scenario: Without a database server named it is refused
      Given no server is named
      When the restore is run
      Then the restore says the server is not named

    Scenario: Without a database server named nothing is made
      Given no server is named
      When the restore is run
      Then the restored database is not there
