Feature: A script turns database access on and off

  An administrator turns the site's database access off before maintenance
  and on again after it, with a script, from the machine the site runs on:

      npm run db:access -- off --minutes 30
      npm run db:access -- change --from-now 45
      npm run db:access -- on

  Turning access off says how long it is expected to be off, in minutes, since
  a reader who is told the site is down is going to ask when it will be back,
  and the person who turned it off is the only one who knows. It is refused
  without one, rather than guessing, since a guess printed on the page for
  every reader is a promise somebody has to keep. The minutes are a whole
  number from 1 to 1440 (`FileDatabaseAccess.feature`).

  The estimate can be revised while access is off, with `change`, as a
  stretch of maintenance is found to be longer, or shorter, than was thought.
  `--from-now` says how many minutes from now the site is expected back, which
  is what an administrator who has just looked at how far a restore has got
  knows, and not the total from when access was turned off, which they would
  have to add up. It is as many minutes from the moment `change` is run, and it
  can be run as often as it is wrong, each time counting from then. It says
  the minutes now expected, as the page does. Where access is not off there is
  nothing to revise, and it is refused rather than turning access off by the
  back door.

  The script changes the switch the running site reads
  (`FileDatabaseAccess.feature`) and nothing else: it does not stop the site,
  does not touch the database, and so works whether the database is there or
  not. The site notices within a second and is down for maintenance from then
  until access is turned on (`maintenance.feature`).

  It says what it did, in a line of words an administrator can read, and
  exits with success; or says what was wrong with what it was given, and
  exits with failure having changed nothing. Turning access on says so
  whether or not it was off, since the administrator's wish is that it be on
  and it is.

  These scenarios run the script's own function with the arguments as the
  command line would give them, and a switch the scenario can read.

  Background:
    Given a database access file that does not exist
    And the moment "2026-10-13T10:00:00Z"

  Rule: Off needs the minutes

    Scenario: Off with minutes turns access off
      When the script is run with "off --minutes 30"
      Then database access is off

    Scenario: Off with minutes exits with success
      When the script is run with "off --minutes 30"
      Then the script exits with success

    Scenario: Off says what it did
      When the script is run with "off --minutes 30"
      Then the script says database access is off for 30 minutes

    Scenario: Off without minutes is refused
      When the script is run with "off"
      Then the script exits with failure

    Scenario: Off without minutes says what is missing
      When the script is run with "off"
      Then the script says the minutes are needed

    Scenario: Off without minutes changes nothing
      When the script is run with "off"
      Then database access is on

    Scenario: Minutes that are not a number are refused
      When the script is run with "off --minutes soon"
      Then the script exits with failure

    Scenario: Minutes of nothing are refused
      When the script is run with "off --minutes 0"
      Then the script exits with failure

    Scenario: Minutes of more than a day are refused
      When the script is run with "off --minutes 1441"
      Then the script exits with failure

    Scenario: Minutes that are not whole are refused
      When the script is run with "off --minutes 2.5"
      Then the script exits with failure

    Scenario: A refusal says which minutes
      When the script is run with "off --minutes 0"
      Then the script says the minutes must be from 1 to 1440

    Scenario: Refused minutes change nothing
      When the script is run with "off --minutes 0"
      Then database access is on

  Rule: Change moves the expected return, counting from now

    Scenario: Change moves the return to the minutes from now
      Given database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      When the script is run with "change --from-now 45"
      Then access is expected back at "2026-10-13T11:05:00Z"

    Scenario: Change keeps access off
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 45"
      Then database access is off

    Scenario: Change keeps the moment access was turned off
      Given database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      When the script is run with "change --from-now 45"
      Then access was turned off at "2026-10-13T10:00:00Z"

    Scenario: Change exits with success
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 45"
      Then the script exits with success

    Scenario: Change says the minutes now expected
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 45"
      Then the script says 45 minutes are now expected

    Scenario: Change can be run as often as it is wrong
      Given database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      And the script is run with "change --from-now 45"
      And the moment "2026-10-13T10:50:00Z"
      When the script is run with "change --from-now 10"
      Then access is expected back at "2026-10-13T11:00:00Z"

    Scenario: Change again counts from the moment it is run, not from the return before
      Given database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      And the script is run with "change --from-now 45"
      And the moment "2026-10-13T11:00:00Z"
      When the script is run with "change --from-now 10"
      Then access is expected back at "2026-10-13T11:10:00Z"

    Scenario: Change after the first estimate has passed moves the return on
      Given database access is turned off for 30 minutes
      And the moment "2026-10-13T10:40:00Z"
      When the script is run with "change --from-now 15"
      Then access is expected back at "2026-10-13T10:55:00Z"

    Scenario: Change says the minutes now expected each time it is run
      Given database access is turned off for 30 minutes
      And the script is run with "change --from-now 45"
      When the script is run with "change --from-now 10"
      Then the script says 10 minutes are now expected

    Scenario: Change without --from-now is refused
      Given database access is turned off for 30 minutes
      When the script is run with "change"
      Then the script exits with failure

    Scenario: Change without --from-now says what is missing
      Given database access is turned off for 30 minutes
      When the script is run with "change"
      Then the script says the minutes from now are needed

    Scenario: Change with the minutes of off is refused
      Given database access is turned off for 30 minutes
      When the script is run with "change --minutes 45"
      Then the script exits with failure

    Scenario: Change given --from-now twice is refused
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 10 --from-now 20"
      Then the script exits with failure

    Scenario: Change with minutes that are not allowed is refused
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 0"
      Then the script exits with failure

    Scenario: Change with minutes that are not a number is refused
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now soon"
      Then the script exits with failure

    Scenario: Refused minutes change nothing
      Given database access is turned off for 30 minutes
      When the script is run with "change --from-now 0"
      Then access is expected back at "2026-10-13T10:30:00Z"

    Scenario: Change where access is on is refused
      When the script is run with "change --from-now 45"
      Then the script exits with failure

    Scenario: Change where access is on says access is not off
      When the script is run with "change --from-now 45"
      Then the script says database access is not off

    Scenario: Change where access is on leaves access on
      When the script is run with "change --from-now 45"
      Then database access is on

    Scenario: Change needs no database
      Given the database cannot be reached
      And database access is turned off for 30 minutes
      When the script is run with "change --from-now 45"
      Then the script exits with success

  Rule: On turns access on

    Scenario: On turns access on
      Given database access is turned off for 30 minutes
      When the script is run with "on"
      Then database access is on

    Scenario: On exits with success
      Given database access is turned off for 30 minutes
      When the script is run with "on"
      Then the script exits with success

    Scenario: On says what it did
      Given database access is turned off for 30 minutes
      When the script is run with "on"
      Then the script says database access is on

    Scenario: On with access on says so and succeeds
      When the script is run with "on"
      Then the script exits with success

    Scenario: On does not take minutes
      When the script is run with "on --minutes 30"
      Then the script exits with failure

  Rule: Anything else is refused

    Scenario: No word is refused
      When the script is run with ""
      Then the script exits with failure

    Scenario: The script says how it is used
      When the script is run with ""
      Then the script says how it is used

    Scenario: An unknown word is refused
      When the script is run with "maybe"
      Then the script exits with failure

    Scenario: An unknown flag is refused
      When the script is run with "off --minutes 30 --force"
      Then the script exits with failure

    Scenario: Refusing changes nothing
      Given database access is turned off for 30 minutes
      When the script is run with "maybe"
      Then database access is off

  Rule: The script does not use the database

    Scenario: Off needs no database
      Given the database cannot be reached
      When the script is run with "off --minutes 30"
      Then the script exits with success

    Scenario: On needs no database
      Given the database cannot be reached
      And database access is turned off for 30 minutes
      When the script is run with "on"
      Then the script exits with success
