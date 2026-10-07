@postgres
Feature: Refusing whatever names a tournament that was never there

  A tournament brings over everything that names it
  (`ImportWholeTournaments.feature`), so a document naming a tournament the
  old site no longer had is reached by no tournament. Once every tournament
  has been read, each collection of documents that name one is read, and
  every document whose tournament was never read is refused, and so kept as
  an error (`runImporter.feature`). Without it, an import that kept no
  errors could still have left documents behind that nobody read.

  A document whose tournament was read is passed over, whatever became of
  the tournament: one brought over took it, one archived left it behind, and
  one refused kept it as an error already. An archived document is passed
  over wherever it points, as it always was, since the old sites archived it
  to be rid of it.

  Background:
    Given the users are imported
    And the tournaments are imported
    And a tournament "tournaments/12" on "croquetscores.com"

  Rule: A document naming a tournament never read is kept as an error

    Scenario Outline: A document naming a tournament not there is kept as an error
      Given the <kind> "<document>" of "tournaments/99" on "croquetscores.com"
      When the documents no tournament took are looked for
      Then the error kept for "croquetscores.com/<document>" says "RefuseLeftOvers.NoTournament"

      Examples:
        | kind       | document             |
        | players    | tournamentplayers/40 |
        | block      | blocks/30            |
        | knockout   | knockouts/30         |
        | Swiss      | swisses/30           |
        | team match | teammatches/50       |
        | commentary | commentaries/5       |

    Scenario: An archived document naming a tournament not there is not an error
      Given the block "blocks/30" of "tournaments/99" on "croquetscores.com"
      And the competition was archived
      When the documents no tournament took are looked for
      Then no error is kept for "croquetscores.com/blocks/30"

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

    Scenario: A document of a refused tournament is kept as one error
      Given the tournament is in the sport "XX"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament "tournaments/12" on "croquetscores.com" is imported
      When the documents no tournament took are looked for
      Then 1 error is kept for "croquetscores.com/blocks/30"
