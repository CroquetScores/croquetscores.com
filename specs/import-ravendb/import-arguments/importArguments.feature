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

  Rule: An import run with no switch reads to the end

    Scenario: No switch asks for no stop
      When the import is run with no switches
      Then the import is not asked to stop after any number of errors

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
