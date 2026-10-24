@postgres
Feature: Finding whatever names a tournament that was never there

  A tournament brings over everything that names it
  (`ImportWholeTournaments.feature`), so a document naming a tournament the
  old site no longer had is reached by no tournament. Once every tournament
  has been read, each collection of documents that name one is read, and
  every document whose tournament was never read is found. Without it, an
  import could have left documents behind that nobody read.

  A document naming a tournament the old site no longer had is not kept as
  an error, since there is nothing in it anyone could put right. It is said
  instead as corrected in docs/import-from-ravendb
  (`ImportFiles.feature`), in the file of the code
  `RefuseLeftOvers.TournamentMissing`, with the tournament it names.

  A tournament the old site could not be asked about is not kept as read
  (`ImportWholeTournaments.feature`) either, but it was there, and an error
  is kept against it. What names it is refused here, and so kept as an error
  (`runImporter.feature`), since the tournament could be read another time.

  A document whose tournament was read is passed over, whatever became of
  the tournament: one brought over took it, one archived left it behind, and
  one refused kept it as an error already. An archived document is passed
  over wherever it points, as it always was, since the old sites archived it
  to be rid of it.

  Background:
    Given the users are imported
    And the tournaments are imported
    And a tournament "tournaments/12" on "croquetscores.com"

  Rule: A document naming a tournament not there is said as corrected, naming the missing tournament

    Scenario Outline: A document naming a tournament not there is said as corrected, naming it
      Given the <kind> "<document>" of "tournaments/99" on "croquetscores.com"
      When the documents no tournament took are looked for
      Then "croquetscores.com/<document>" is said to name the missing tournament "tournaments/99"

      Examples:
        | kind       | document             |
        | players    | tournamentplayers/40 |
        | block      | blocks/30            |
        | knockout   | knockouts/30         |
        | Swiss      | swisses/30           |
        | team match | teammatches/50       |
        | commentary | commentaries/5       |

    Scenario: A document naming a tournament not there is not an error
      Given the block "blocks/30" of "tournaments/99" on "croquetscores.com"
      When the documents no tournament took are looked for
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: An archived document naming a tournament not there is not said to name a missing one
      Given the block "blocks/30" of "tournaments/99" on "croquetscores.com"
      And the competition was archived
      When the documents no tournament took are looked for
      Then "croquetscores.com/blocks/30" is not said to name a missing tournament

  Rule: A document of a tournament there but not read is kept as an error

    Scenario: A document of a tournament the old site could not be asked about is kept as an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And "croquetscores.com" fails when asked which "Blocks" name a tournament
      And the tournaments of "croquetscores.com" are read as the import reads them
      When the documents no tournament took are looked for
      Then the error kept for "croquetscores.com/blocks/30" says "RefuseLeftOvers.TournamentNotRead"

    Scenario: A document of a tournament the old site could not be asked about is not said to name a missing one
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And "croquetscores.com" fails when asked which "Blocks" name a tournament
      And the tournaments of "croquetscores.com" are read as the import reads them
      When the documents no tournament took are looked for
      Then "croquetscores.com/blocks/30" is not said to name a missing tournament

  Rule: A document naming a tournament that was read is passed over

    Scenario: A document a tournament took is not an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A document of an archived tournament is not an error
      Given the tournament was archived
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then no error is kept for "croquetscores.com/blocks/30"

    # Left out of the days the import was asked for (importArguments.feature):
    # the old site still has it, so it is not a missing tournament.
    Scenario: A document of a tournament outside the days asked for is not an error
      Given the import is only of tournaments from "2015-01-01"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A document of a tournament outside the days asked for is not said to name a missing tournament
      Given the import is only of tournaments from "2015-01-01"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then "croquetscores.com/blocks/30" is not said to name a missing tournament

    Scenario: A document of a refused tournament is kept as one error
      Given the tournament is in the sport "XX"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then 1 error is kept for "croquetscores.com/blocks/30"
