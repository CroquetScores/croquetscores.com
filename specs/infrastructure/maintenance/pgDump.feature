Feature: Asking pg_dump for a copy of some tables of a database

  The backup (`backupCli.feature`) is a file made by pg_dump, the program
  Postgres comes with, so that what is written is what Postgres itself can
  read back with pg_restore and not something of ours that has to be kept
  readable.

  pg_dump is run as a program of the computer it is on, found as any program
  is, by the places the computer looks for them, or by the path the
  administrator names where it is not among them: the copy that comes with
  pgAdmin, for one, is kept off them. It has to be a version of pg_dump that
  is at least the website's Postgres's, which pg_dump itself refuses to be
  otherwise and says so.

  It is asked for the tables it is given and for no other, each by name. It is
  given the address of the database as its parts, and not as the address: an
  address is a single argument, and anybody who can list the programs running
  on a computer can read the arguments of each, the password in this one
  among them. So the host, the port, the user and the database are arguments,
  and the password is in the program's environment, as pg_dump reads it from,
  which no other user of the computer can list.

  These scenarios run no pg_dump. They say what it would be run with, and
  what is made of what it says, so that they need no Postgres of the
  version the website has.

  Rule: pg_dump is asked for a file pg_restore reads

    Scenario: The dump is in the form pg_restore reads
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the custom format

    Scenario: The dump is written to the file asked for
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked to write "C:\backups\one.dump.partial"

    Scenario: pg_dump is never asked for a password
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked never to prompt for a password

  Rule: pg_dump is asked for the tables it is given

    Scenario: A table is asked for by name
      Given the tables "events" and "account_keys"
      When pg_dump is asked for a dump
      Then pg_dump is asked for the table "events"

    Scenario: Each table is asked for
      Given the tables "events" and "account_keys"
      When pg_dump is asked for a dump
      Then pg_dump is asked for the table "account_keys"

    Scenario: No other table is asked for
      Given the tables "events" and "account_keys"
      When pg_dump is asked for a dump
      Then pg_dump is asked for 2 tables

  Rule: The program is pg_dump unless another is named

    Scenario: The program is pg_dump
      When pg_dump is asked for a dump
      Then the program run is "pg_dump"

    Scenario: The program is the one named
      Given the program to run is "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
      When pg_dump is asked for a dump
      Then the program run is "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"

  Rule: The address is given as its parts

    Scenario: The host is an argument
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the host "website.example"

    Scenario: The port is an argument
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the port "5433"

    Scenario: The port is 5432 where the address gives none
      Given the address "postgres://backup:secret-word@website.example/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the port "5432"

    Scenario: The user is an argument
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the user "backup"

    Scenario: The database is an argument
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the database "croquetscores"

    Scenario: A user with characters an address escapes is as it was written
      Given the address "postgres://back%40up:secret%2Fword@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the user "back@up"

    Scenario: A database with a hyphen in its name is asked for as it is
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores-dev"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump is asked for the database "croquetscores-dev"

  Rule: The password is not in the arguments

    Scenario: The password is in the environment
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump's environment has the password "secret-word"

    Scenario: The password as an address escapes it is in the environment as it was written
      Given the address "postgres://backup:secret%2Fword@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump's environment has the password "secret/word"

    Scenario: The password is in none of the arguments
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then none of pg_dump's arguments has the password "secret-word"

    Scenario: The address is in none of the arguments
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then none of pg_dump's arguments has "postgres://"

    Scenario: An address with no password asks for none
      Given the address "postgres://backup@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump's environment has no password

  Rule: How the connection is secured is the address's

    Scenario: The mode an address names is in the environment
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores?sslmode=require"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump's environment has the ssl mode "require"

    Scenario: An address that names none leaves it to pg_dump
      Given the address "postgres://backup:secret-word@website.example:5433/croquetscores"
      When pg_dump is asked for a dump into "C:\backups\one.dump.partial"
      Then pg_dump's environment has no ssl mode

  Rule: What went wrong is said by a code

    Scenario: A pg_dump that ends in failure is refused with what it said
      Given pg_dump ends in failure saying "pg_dump: error: connection failed"
      When pg_dump is asked for a dump
      Then it is refused with "PgDump.Failed"

    Scenario: What pg_dump said is kept in the refusal
      Given pg_dump ends in failure saying "pg_dump: error: connection failed"
      When pg_dump is asked for a dump
      Then the refusal says "pg_dump: error: connection failed"

    Scenario: A computer with no pg_dump says it could not be run
      Given there is no pg_dump on the computer
      When pg_dump is asked for a dump
      Then it is refused with "PgDump.NotRun"

    Scenario: A path that has no program at it says the setting names the file
      Given the program to run is "C:\Program Files\PostgreSQL\17\bin"
      And there is no pg_dump on the computer
      When pg_dump is asked for a dump
      Then the refusal says "PG_DUMP_PATH has to name the file"

    Scenario: A computer with no pg_dump of the usual name does not name the setting
      Given there is no pg_dump on the computer
      When pg_dump is asked for a dump
      Then the refusal does not say "PG_DUMP_PATH"

    Scenario: An address that is not a Postgres address is refused
      Given the address "not an address"
      When pg_dump is asked for a dump
      Then it is refused with "PgDump.AddressNotUnderstood"

    Scenario: An address that is refused is not said
      Given the address "not an address"
      When pg_dump is asked for a dump
      Then the refusal does not say "not an address"

    Scenario: A dump that worked is no refusal
      Given pg_dump ends in success
      When pg_dump is asked for a dump
      Then nothing is refused
