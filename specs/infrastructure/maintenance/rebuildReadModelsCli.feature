Feature: Rebuilding the read models turns database access off while it runs

  The read models are made again from every event kept, in one transaction,
  by "npm run db:rebuild-read-models". While that runs, a site that goes on
  answering would be answering from read models that are about to change under
  it, and a command it accepted would append events the rebuild had not read
  (`scripts/rebuild-read-models.mjs` has said to stop the site first, which is
  a thing to remember). So the script now turns database access off for the
  time it is expected to take, and turns it on again when it is done, and the
  site is down for maintenance in between (`maintenance.feature`) rather than
  wrong.

      npm run db:rebuild-read-models -- --minutes 20

  `--minutes` is how long the rebuild is expected to take, said as turning
  access off says it (`databaseAccess.feature`): a whole number from 1 to 1440,
  and needed, since a reader who is told the site is down is going to ask when
  it will be back, and the person running the rebuild is the one who knows. It
  is refused without it, and nothing is changed.

  In order: access is turned off, with the minutes; the script waits a second,
  so that a site that reads the switch once in a second has seen it
  (`FileDatabaseAccess.feature`); the script says how many streams the event
  store has; the read models are made again, with an update as it goes; the
  script says how long that took, in minutes; and access is turned on. It
  says each as it is done, in words an administrator can read, and exits with
  success.

  A rebuild can take a long time, and a script that says nothing for a
  quarter of an hour is one that is stopped by somebody who thought it had
  stuck. So the number of streams is said before it begins, as
  "There are 12,345 streams in the event store.", and an update is said every
  10 seconds as it goes, as "2,000 of 12,345 streams completed, approximately
  6.250 minutes to complete.". Numbers are written with commas, as a person
  reads them, and the minutes to three decimal places.

  Ten seconds is counted from the last update, or from when the read models
  began to be made again, and an update is said as the stream being done when
  it falls due is finished: a stream is not interrupted to say so. The minutes
  left are worked out from how long the streams done so far took, for the
  streams that are left. It is said as an estimate, "approximately", since
  streams are not all the same size. No update is said once everything is
  done, since the script says how long it took in the next line, and a rebuild
  that is done within ten seconds has none.

  What the page tells a reader is kept as true as the estimate is, once there
  is something to make it from. The first streams of a rebuild say little of
  the rest, as they may be the small ones or the large ones, and a reader
  told "about 5 minutes" at the start of a rebuild that takes an hour has been
  told something worse than what the administrator guessed. So the site's
  expected return is left as it was said until a tenth of the streams are done.
  The updates the script says go on being said from the first. Each time
  an update is said, the site's expected return is moved to the minutes
  estimated to be left, rounded up to a whole minute, and five more, from now
  (`databaseAccess.feature`),
  so that a reader is told what the rebuild has found out about itself and not
  what it was guessed to take, and is told it with five minutes in hand, since
  a site that is back sooner than said is a kindness and one that is later is
  not. The script does not say it: the update line already says how long is
  left, and a second line for each update says the same thing again. It is
  never more than the most there can be said (1,440). Where somebody has
  turned access on in the meantime there is no return to move, and the rebuild
  goes on and does not turn it off again.

  How long it took is the minutes from when it began making them again to when
  it was done, to one decimal place, as "2.4 minutes". Under a twentieth of a
  minute is "less than 0.1 minutes", since "0.0 minutes" says nothing was done.

  A rebuild that fails leaves every read model as it was, being one
  transaction, so nothing the site would answer from is wrong. Access is turned
  on again, so that a site is not left down by a failure nobody is watching,
  and the script says what failed and exits with failure. The one thing it does
  not do is carry on: whoever is told it failed decides whether to try again.

  Where access is already off somebody else is doing maintenance, and a
  rebuild that turned it on again at the end would end theirs. So it is
  refused, and nothing is changed. It is decided in one step with turning
  access off (`FileDatabaseAccess.feature`), so that two rebuilds begun at once
  are not both let.

  What is told to readers is a convenience, and is not worth a rebuild. Where
  the site's expected return cannot be moved, the script says so and goes on
  with the rebuild, rather than rolling back what may be most of an hour's
  work for a figure on a page. Where access cannot be turned on at the end,
  the script says so, and says how to, rather than stopping with a trace: it is
  the one thing the administrator must know, and the rebuild itself, if it is
  done, is committed.

  These scenarios run the script's own function, with the arguments as the
  command line gives them, a switch the scenario can read, a clock it can
  move, and a rebuild that takes as long as the scenario says, evenly over its
  streams, of which it has a hundred where the scenario does not say.

  Background:
    Given a database access file that does not exist
    And the moment "2026-10-13T10:00:00Z"

  Rule: The minutes are needed

    Scenario: Without the minutes the script is refused
      When the rebuild script is run with ""
      Then the rebuild script exits with failure

    Scenario: Without the minutes it says they are needed
      When the rebuild script is run with ""
      Then the rebuild script says the minutes are needed

    Scenario: Without the minutes nothing is rebuilt
      When the rebuild script is run with ""
      Then no read model was rebuilt

    Scenario: Without the minutes access is not turned off
      When the rebuild script is run with ""
      Then database access is on

    Scenario Outline: Minutes that are not allowed are refused
      When the rebuild script is run with "--minutes <minutes>"
      Then the rebuild script exits with failure

      Examples:
        | minutes |
        | 0       |
        | 1441    |
        | 2.5     |
        | soon    |

    Scenario: Refused minutes rebuild nothing
      When the rebuild script is run with "--minutes 0"
      Then no read model was rebuilt

    Scenario: An unknown flag is refused
      When the rebuild script is run with "--minutes 20 --force"
      Then the rebuild script exits with failure

    Scenario: The minutes given twice are refused
      When the rebuild script is run with "--minutes 20 --minutes 30"
      Then the rebuild script exits with failure

  Rule: Access is off for the rebuild, with the minutes

    Scenario: Access is off while the read models are made again
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then access was off while the read models were made again

    Scenario: Access was turned off with the minutes
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then access had been turned off expected back at "2026-10-13T10:20:00Z"

    Scenario: The script waits a second before it begins
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the script waited a second before the read models were made again

    Scenario: The script says access is off
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says database access is off for 20 minutes

  Rule: The number of streams is said before the rebuild begins

    Scenario: The streams are counted
      Given the rebuild takes 10 minutes over 2500 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says there are 2,500 streams in the event store

    Scenario: A thousand has a comma
      Given the rebuild takes 10 minutes over 1000 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says there are 1,000 streams in the event store

    Scenario: A million has two
      Given the rebuild takes 10 minutes over 1234567 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says there are 1,234,567 streams in the event store

    Scenario: Fewer than a thousand have none
      Given the rebuild takes 10 minutes over 999 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says there are 999 streams in the event store

    Scenario: One stream is a stream
      Given the rebuild takes 10 minutes over 1 stream
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says there is 1 stream in the event store

    Scenario: The streams are said before the read models are made again
      Given the rebuild takes 10 minutes over 2500 streams
      When the rebuild script is run with "--minutes 20"
      Then the streams were said before the read models were made again

  Rule: An update is said every 10 seconds

    Scenario: An update says how many are done and how long is left
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the rebuild script says 100 of 12,000 streams completed, approximately 19.833 minutes to complete

    Scenario: A later update says less is left
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the rebuild script says 6,000 of 12,000 streams completed, approximately 10.000 minutes to complete

    Scenario: An update is said every ten seconds and no oftener
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script said 3 updates

    Scenario: The updates are ten seconds apart
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script said its updates 10 seconds apart

    Scenario: No update is said when everything is done
      Given the rebuild takes 30 seconds over 300 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script does not say 300 of 300 streams completed

    Scenario: A rebuild done within ten seconds has no update
      Given the rebuild takes 9 seconds over 90 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script said 0 updates

    Scenario: The minutes left are said to three decimal places
      Given the rebuild takes 1212 seconds over 12120 streams
      When the rebuild script is run with "--minutes 30"
      Then the rebuild script says 100 of 12,120 streams completed, approximately 20.033 minutes to complete

    Scenario: A few seconds left is not said to be none
      Given the rebuild takes 15 seconds over 150 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says 100 of 150 streams completed, approximately 0.083 minutes to complete

    Scenario: The minutes left have commas
      Given the rebuild takes 2000 minutes over 200 streams
      When the rebuild script is run with "--minutes 1440"
      Then the rebuild script says 1 of 200 streams completed, approximately 1,990.000 minutes to complete

    Scenario: The streams have commas
      Given the rebuild takes 100 minutes over 1200000 streams
      When the rebuild script is run with "--minutes 120"
      Then the rebuild script says 2,000 of 1,200,000 streams completed, approximately 99.833 minutes to complete

    Scenario: The updates are said while the read models are being made
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the updates were said while the read models were being made again

  Rule: The expected return follows the estimate, with five minutes in hand, once a tenth is done

    Scenario: Before a tenth of the streams are done the return is not moved
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the expected return was first moved when 1200 streams were done

    Scenario: Updates before a tenth are done still say how far it has got
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the rebuild script says 100 of 12,000 streams completed, approximately 19.833 minutes to complete

    Scenario: The first move is to the minutes left and five
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the expected return was moved to "2026-10-13T10:25:01Z"

    Scenario: A tenth exactly is enough
      Given the rebuild takes 100 seconds over 1000 streams
      When the rebuild script is run with "--minutes 20"
      Then the expected return was first moved when 100 streams were done

    Scenario: Less than a tenth done at an update is not enough
      Given the rebuild takes 400 seconds over 2000 streams
      When the rebuild script is run with "--minutes 20"
      Then the expected return was first moved when 200 streams were done

    Scenario: A rebuild that is a tenth done at its first update moves it then
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the expected return was first moved when 100 streams were done

    Scenario: It is moved at each update from then and no oftener
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the expected return was moved 3 times

    Scenario: A rebuild with no update does not move it
      Given the rebuild takes 9 seconds over 90 streams
      When the rebuild script is run with "--minutes 20"
      Then the expected return was moved 0 times

    Scenario: It does not say when the site is expected back
      Given the rebuild takes 20 minutes over 12000 streams
      When the rebuild script is run with "--minutes 30"
      Then the rebuild script does not say expected back

    Scenario: It is never more than a day
      Given the rebuild takes 2000 minutes over 200 streams
      When the rebuild script is run with "--minutes 1440"
      Then the expected return was moved to "2026-10-14T13:20:01Z"

    Scenario: Access turned on by somebody else is not turned off again
      Given the rebuild takes 35 seconds over 350 streams
      And somebody turns database access on during the rebuild
      When the rebuild script is run with "--minutes 20"
      Then database access is on

    Scenario: The rebuild goes on when access was turned on by somebody else
      Given the rebuild takes 35 seconds over 350 streams
      And somebody turns database access on during the rebuild
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with success

  Rule: The read models are made again from every event

    Scenario: Every read model is made again
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the read models were made again

    Scenario: The script says from how many events
      Given the rebuild takes 10 minutes
      And there are 1234 events
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says every read model is made again from 1,234 events

  Rule: How long it took is said in minutes

    Scenario: A rebuild of ten minutes says ten minutes
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took 10.0 minutes

    Scenario: A rebuild is said to one decimal place
      Given the rebuild takes 144 seconds
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took 2.4 minutes

    Scenario: A rebuild of a few seconds is not said to be none
      Given the rebuild takes 2 seconds
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took less than 0.1 minutes

    Scenario: A rebuild that took longer than was said says how long
      Given the rebuild takes 45 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took 45.0 minutes

    Scenario: The time does not count the wait before it began
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took 10.0 minutes

  Rule: Access is turned on when it is done

    Scenario: Access is on afterwards
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then database access is on

    Scenario: The script says access is on
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says database access is on

    Scenario: The script exits with success
      Given the rebuild takes 10 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with success

    Scenario: The script says things in the order they happened
      Given the rebuild takes 35 seconds over 350 streams
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script said, in order, that access was off, how many streams there are, the updates, that the read models were made again, how long it took, and that access was on

  Rule: A rebuild that fails turns access on and says what failed

    Scenario: Access is on afterwards
      Given the rebuild fails
      When the rebuild script is run with "--minutes 20"
      Then database access is on

    Scenario: The script exits with failure
      Given the rebuild fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with failure

    Scenario: The script says what failed
      Given the rebuild fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild failed

    Scenario: The script says access is on
      Given the rebuild fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says database access is on

    Scenario: The script does not say how long it took
      Given the rebuild fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script does not say how long it took

  Rule: A failure to tell readers does not stop the rebuild

    Scenario: A return that cannot be moved does not stop the rebuild
      Given the rebuild takes 35 seconds over 350 streams
      And writing the expected return fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with success

    Scenario: A return that cannot be moved is said
      Given the rebuild takes 35 seconds over 350 streams
      And writing the expected return fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says expected return could not be moved

    Scenario: A return that cannot be moved is said once
      Given the rebuild takes 35 seconds over 350 streams
      And writing the expected return fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script said the expected return could not be moved 1 time

    Scenario: The read models are made again all the same
      Given the rebuild takes 35 seconds over 350 streams
      And writing the expected return fails
      When the rebuild script is run with "--minutes 20"
      Then the read models were made again

  Rule: Access that cannot be turned on again is said

    Scenario: A rebuild that is done and cannot turn access on exits with failure
      Given the rebuild takes 10 minutes
      And turning access on fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with failure

    Scenario: It says it could not be turned on, and how to
      Given the rebuild takes 10 minutes
      And turning access on fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says access could not be turned on
      And the rebuild script says Turn it on with: npm run db:access -- on

    Scenario: It still says how long the rebuild took
      Given the rebuild takes 10 minutes
      And turning access on fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild took 10.0 minutes

    Scenario: A rebuild that failed and cannot turn access on says what failed
      Given the rebuild fails
      And turning access on fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says the rebuild failed

    Scenario: A rebuild that failed and cannot turn access on says how to
      Given the rebuild fails
      And turning access on fails
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says access could not be turned on
      And the rebuild script says Turn it on with: npm run db:access -- on

  Rule: Maintenance already under way is not ended

    Scenario: Access already off refuses the rebuild
      Given database access is turned off for 30 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script exits with failure

    Scenario: Access already off says so
      Given database access is turned off for 30 minutes
      When the rebuild script is run with "--minutes 20"
      Then the rebuild script says database access is already off

    Scenario: Access already off rebuilds nothing
      Given database access is turned off for 30 minutes
      When the rebuild script is run with "--minutes 20"
      Then no read model was rebuilt

    Scenario: Access already off is left as it was
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      When the rebuild script is run with "--minutes 20"
      Then access is expected back at "2026-10-13T10:30:00Z"
