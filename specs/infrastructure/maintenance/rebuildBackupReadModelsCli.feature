Feature: Rebuilding the read models of the backup database

  The backup copies the website's events to a database of its own
  (`backupCli.feature`), and the read models of that database are made again
  from them so that the copy can be looked at and not only restored. That is
  the same rebuild as the site's own (`rebuildReadModelsCli.feature`) of
  another database, and it is

      npm run db:rebuild-backup-read-models

  It rebuilds what `BACKUP_DATABASE_URL` names, whatever `DATABASE_URL` is,
  from the events that database holds, in one transaction, so that a rebuild
  that fails leaves every read model as it was.

  It is not the site's rebuild with another address because the site's turns
  database access off for the minutes it is expected to take, so that a site
  that is running does not answer from read models that are about to change.
  Nothing serves readers from the backup database, and the switch is the
  site's own: turning it off would put whatever site is running on this
  computer into maintenance for a rebuild that is no concern of its. So this
  turns nothing off, and takes no minutes, which is also why it is refused
  anything it is given.

  It says what the site's does of how far it has got. The number of streams is
  said before it begins, as "There are 12,345 streams in the event store.",
  and an update every 10 seconds as it goes, as "2,000 of 12,345 streams
  completed, approximately 6.250 minutes to complete.", each counted from the
  last, and none once everything is done: the next line says how long it took.

  Where the backup database is not named it is refused and nothing is
  rebuilt, since what it would otherwise do is rebuild `DATABASE_URL`, which
  is not the one asked for.

  These scenarios run the script's own function, with the arguments as the
  command line gives them, on a clock the scenario moves, and a rebuild that
  takes as long as the scenario says, evenly over its streams, of which it has
  a hundred where the scenario does not say.

  Background:
    Given the backup rebuild is told the backup database

  Rule: It takes no arguments

    Scenario: With none it rebuilds
      When the backup rebuild script is run with ""
      Then the backup rebuild script exits with success

    Scenario: With one it is refused
      When the backup rebuild script is run with "--minutes 20"
      Then the backup rebuild script exits with failure

    Scenario: With one nothing is rebuilt
      When the backup rebuild script is run with "--minutes 20"
      Then no backup read model was rebuilt

  Rule: The backup database is needed

    Scenario: Without it the script is refused
      Given the backup rebuild is told no backup database
      When the backup rebuild script is run with ""
      Then the backup rebuild script exits with failure

    Scenario: Without it the script says it is needed
      Given the backup rebuild is told no backup database
      When the backup rebuild script is run with ""
      Then the backup rebuild script says the backup database is needed

    Scenario: Without it nothing is rebuilt
      Given the backup rebuild is told no backup database
      When the backup rebuild script is run with ""
      Then no backup read model was rebuilt

  Rule: It says how far it has got, and how long it took

    Scenario: It says what it is making again
      When the backup rebuild script is run with ""
      Then the backup rebuild script says it is making the read models of the backup database again

    Scenario: It says how many streams there are
      Given the backup rebuild has 12345 streams
      When the backup rebuild script is run with ""
      Then the backup rebuild script says "There are 12,345 streams in the event store."

    Scenario: It says how far it has got every 10 seconds
      Given the backup rebuild takes 10 minutes
      And the backup rebuild has 100 streams
      When the backup rebuild script is run with ""
      Then the backup rebuild script says "approximately" at least once

    Scenario: It says how long it took
      Given the backup rebuild takes 3 minutes
      When the backup rebuild script is run with ""
      Then the backup rebuild script says "The rebuild took 3.0 minutes."

    Scenario: It says how many events it made them from
      Given the backup rebuild reads 500 events
      When the backup rebuild script is run with ""
      Then the backup rebuild script says "Every read model is made again from 500 events."

    Scenario: A rebuild done within ten seconds has no update
      Given the backup rebuild takes 5 seconds
      When the backup rebuild script is run with ""
      Then the backup rebuild script says no update of how far it has got

  Rule: A rebuild that fails says so

    Scenario: A failure is said
      Given the backup rebuild fails saying "the disk is full"
      When the backup rebuild script is run with ""
      Then the backup rebuild script says "The rebuild failed: the disk is full"

    Scenario: A failure exits with failure
      Given the backup rebuild fails saying "the disk is full"
      When the backup rebuild script is run with ""
      Then the backup rebuild script exits with failure
