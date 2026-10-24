Feature: The switches "npm run import:ravendb" takes

  The import takes its settings from the environment
  (`loadImportConfig.feature`), and what it does this once from the switches
  it is run with, after "--" as npm needs, as
  "npm run import:ravendb -- --stop-after-errors 10". None is needed: an
  import run with none reads every document of every old site.

  "--stop-after-errors" and a count stops the import once it has kept that
  many errors (`runImporter.feature`), so that what is wrong with it can be
  read and put right without waiting for the whole of it. The count is a whole
  number of 1 or more, given after the switch or with an equals sign, as
  "--stop-after-errors=10". Anything else is refused, with a code that says
  why, before the import has touched the database it would empty: a switch
  that is not one of its own, a count that is missing, or one that is not a
  whole number of 1 or more.

  "--from" and a day, "--to" and a day, or both, bring over only the
  tournaments that started within those days
  (`ImportWholeTournaments.feature`), so that a part of the old sites can be
  brought over, and looked at, without waiting for the rest. A day is written
  as the year, month and day with hyphens between, as "2026-03-01", and is
  given after the switch or with an equals sign, as "--from=2026-03-01". Both
  days are in the range, so the same day for both asks for the tournaments
  that started on it. A day that is missing, one that is not a day of the
  calendar written so, one given twice, and a first day after the last are
  each refused with a code of their own, before the database is touched. The
  switches may be given together, in any order.

  Rule: An import run with no switch reads to the end

    Scenario: No switch asks for no stop
      When the import is run with no switches
      Then the import is not asked to stop after any number of errors

    Scenario: No switch asks for no first day
      When the import is run with no switches
      Then the import is not asked for a first day

    Scenario: No switch asks for no last day
      When the import is run with no switches
      Then the import is not asked for a last day

  Rule: An import can be asked to stop after a number of errors

    Scenario: A count after the switch is the number of errors to stop after
      When the import is run with "--stop-after-errors" and "25"
      Then the import is asked to stop after 25 errors

    Scenario: A count joined to the switch by an equals sign is the number to stop after
      When the import is run with "--stop-after-errors=25"
      Then the import is asked to stop after 25 errors

    Scenario: A count of 1 is the least
      When the import is run with "--stop-after-errors" and "1"
      Then the import is asked to stop after 1 error

  Rule: An import can be asked for the tournaments that started within some days

    Scenario: A day after "--from" is the first day
      When the import is run with "--from" and "2026-03-01"
      Then the import is asked for tournaments from "2026-03-01"

    Scenario: A day after "--from" leaves the last day open
      When the import is run with "--from" and "2026-03-01"
      Then the import is not asked for a last day

    Scenario: A day joined to "--from" by an equals sign is the first day
      When the import is run with "--from=2026-03-01"
      Then the import is asked for tournaments from "2026-03-01"

    Scenario: A day after "--to" is the last day
      When the import is run with "--to" and "2026-09-30"
      Then the import is asked for tournaments to "2026-09-30"

    Scenario: A day after "--to" leaves the first day open
      When the import is run with "--to" and "2026-09-30"
      Then the import is not asked for a first day

    Scenario: A day joined to "--to" by an equals sign is the last day
      When the import is run with "--to=2026-09-30"
      Then the import is asked for tournaments to "2026-09-30"

    Scenario: Both switches ask for both days
      When the import is run with "--from" and "2026-03-01" and "--to" and "2026-09-30"
      Then the import is asked for tournaments from "2026-03-01"
      And the import is asked for tournaments to "2026-09-30"

    Scenario: The switches are taken in either order
      When the import is run with "--to" and "2026-09-30" and "--from" and "2026-03-01"
      Then the import is asked for tournaments from "2026-03-01"
      And the import is asked for tournaments to "2026-09-30"

    Scenario: The same day for both is the least range
      When the import is run with "--from=2026-03-01" and "--to=2026-03-01"
      Then the import is asked for tournaments from "2026-03-01"

    Scenario: The days are asked for beside a number of errors to stop after
      When the import is run with "--from=2026-03-01" and "--stop-after-errors=5"
      Then the import is asked to stop after 5 errors
      And the import is asked for tournaments from "2026-03-01"

  Rule: A switch the import cannot follow is refused

    Scenario: A switch that is not the import's own is refused
      When the import is run with "--stop-sooner" and "5"
      Then running the import is refused with "ImportArguments.UnknownSwitch"

    Scenario: A switch with no count is refused
      When the import is run with "--stop-after-errors"
      Then running the import is refused with "ImportArguments.NoCount"

    Scenario: A switch with an equals sign and no count is refused
      When the import is run with "--stop-after-errors="
      Then running the import is refused with "ImportArguments.NoCount"

    Scenario Outline: A count that is not a whole number of 1 or more is refused
      When the import is run with "--stop-after-errors" and "<count>"
      Then running the import is refused with "ImportArguments.NotACount"

      Examples:
        | count |
        | 0     |
        | -3    |
        | 2.5   |
        | ten   |
        | 1e3   |

    Scenario: The switch given twice is refused
      When the import is run with "--stop-after-errors" and "5" and "--stop-after-errors" and "6"
      Then running the import is refused with "ImportArguments.GivenTwice"

    Scenario: A first day with no day is refused
      When the import is run with "--from"
      Then running the import is refused with "ImportArguments.NoDay"

    Scenario: A last day with an equals sign and no day is refused
      When the import is run with "--to="
      Then running the import is refused with "ImportArguments.NoDay"

    Scenario Outline: A day that is not a day of the calendar written year, month and day is refused
      When the import is run with "--from" and "<day>"
      Then running the import is refused with "ImportArguments.NotADay"

      Examples:
        | day                 |
        | yesterday           |
        | 2026-13-01          |
        | 2026-02-30          |
        | 01/03/2026          |
        | 2026-3-1            |
        | 2026-03-01T00:00:00 |

    Scenario: A last day that is not a day is refused
      When the import is run with "--to" and "soon"
      Then running the import is refused with "ImportArguments.NotADay"

    Scenario: A first day given twice is refused
      When the import is run with "--from" and "2026-03-01" and "--from" and "2026-04-01"
      Then running the import is refused with "ImportArguments.GivenTwice"

    Scenario: A last day given twice is refused
      When the import is run with "--to" and "2026-03-01" and "--to" and "2026-04-01"
      Then running the import is refused with "ImportArguments.GivenTwice"

    Scenario: A first day after the last day is refused
      When the import is run with "--from" and "2026-04-01" and "--to" and "2026-03-01"
      Then running the import is refused with "ImportArguments.DaysBackwards"
