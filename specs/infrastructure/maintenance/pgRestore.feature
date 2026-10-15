Feature: Asking pg_restore to put a backup file's data into a database

  The restore (`restoreCli.feature`) puts the data in a backup file into a
  database that already has the tables, which the migrations made. pg_restore
  is the program Postgres comes with that reads what pg_dump wrote
  (`pgDump.feature`).

  It is asked for the data and nothing else, since the tables are the
  migrations' and not the file's; for no owners, since the user the website's
  database belonged to is not one of this Postgres's; and to stop at the first
  thing that goes wrong, since a restore that goes on past one has put some
  of the data in and called it done.

  It is given the address of the database as its parts, as pg_dump is, and
  the password in its environment and not among its arguments, where anybody
  who can list the programs running on a computer can read it.

  The program is found beside pg_dump: where `PG_DUMP_PATH` names the file
  pg_dump is, pg_restore is the file of the same folder with pg_restore for
  its name. Where nothing is named it is pg_restore, as the computer finds
  it.

  These scenarios run no pg_restore. They say what it would be run with, and
  what is made of what it says.

  Rule: pg_restore is asked for the data of the file, into the database

    Scenario: The data is asked for and not the tables
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for the data only

    Scenario: No owners are asked for
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for no owners

    Scenario: It is asked to stop at the first thing that goes wrong
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked to stop at the first error

    Scenario: It is asked never to prompt for a password
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked never to prompt for a password

    Scenario: The file is the last argument
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then the last argument to pg_restore is "C:\backups\one.dump"

    Scenario: The database is the one named
      Given the restored database is at "postgres://postgres:secret-word@localhost:5432/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for the database "restored"

  Rule: The address is given as its parts, and the password is not an argument

    Scenario: The host is an argument
      Given the restored database is at "postgres://postgres:secret-word@db.example:5433/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for the host "db.example"

    Scenario: The port is an argument
      Given the restored database is at "postgres://postgres:secret-word@db.example:5433/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for the port "5433"

    Scenario: The user is an argument
      Given the restored database is at "postgres://postgres:secret-word@db.example:5433/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore is asked for the user "postgres"

    Scenario: The password is in the environment
      Given the restored database is at "postgres://postgres:secret-word@db.example:5433/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore's environment has the password "secret-word"

    Scenario: The password is in none of the arguments
      Given the restored database is at "postgres://postgres:secret-word@db.example:5433/restored"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then none of pg_restore's arguments has the text "secret-word"

  Rule: The program is found beside pg_dump

    Scenario: The program is pg_restore where none is named
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore was run as "pg_restore"

    Scenario: The program is in the folder pg_dump is in
      Given pg_dump is named "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore was run as "C:\Program Files\PostgreSQL\17\bin\pg_restore.exe"

    Scenario: The program is in the folder pg_dump is in on another computer
      Given pg_dump is named "/usr/lib/postgresql/17/bin/pg_dump"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore was run as "/usr/lib/postgresql/17/bin/pg_restore"

    Scenario: A name that is not pg_dump's is left to the computer to find
      Given pg_dump is named "C:\Program Files\PostgreSQL\17\bin"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore was run as "pg_restore"

  Rule: What went wrong is said by a code

    Scenario: A pg_restore that ends in failure is refused with what it said
      Given pg_restore ends in failure saying "pg_restore: error: could not read the file"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then it is refused with "PgRestore.Failed"

    Scenario: What pg_restore said is kept in the refusal
      Given pg_restore ends in failure saying "pg_restore: error: could not read the file"
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then the refusal of pg_restore says "pg_restore: error: could not read the file"

    Scenario: A computer with no pg_restore says it could not be run
      Given there is no pg_restore on the computer
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then it is refused with "PgRestore.NotRun"

    Scenario: A restore that worked is no refusal
      Given pg_restore ends in success
      When pg_restore is asked to restore "C:\backups\one.dump"
      Then pg_restore was not refused
