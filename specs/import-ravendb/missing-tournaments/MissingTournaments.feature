Feature: The documents that name a missing tournament, said in a file

  A document that names a tournament the old site no longer had is not
  brought over, and is not an error either, since nothing in it could be put
  right (`RefuseLeftOvers.feature`). Each is said instead in
  docs/import-from-ravendb/missing-tournaments.md, a line each, as the
  tournament it names and then the document, with its website:
  "tournaments/67856 croquetscores.com/TournamentPlayers/68718". The file is
  headed Missing Tournaments, and says what it lists. The import deletes it
  before it begins, so that it says only what the last import found, and
  writes each as it is found.

  Background:
    Given a file of missing tournaments of the scenario's own

  Rule: Beginning the file deletes what the last import said

    Scenario: What the last import said is gone once the file is begun
      Given the file of missing tournaments was left saying "left over"
      When the file of missing tournaments is begun
      Then the file of missing tournaments does not say "left over"

    Scenario: The file is headed Missing Tournaments
      When the file of missing tournaments is begun
      Then the file of missing tournaments says "# Missing Tournaments"

  Rule: Each document is said a line each, after the tournament it names

    Scenario: A document is said with the tournament it names
      Given the file of missing tournaments is begun
      When "croquetscores.com/TournamentPlayers/68718" is written as naming the missing tournament "tournaments/67856"
      Then the file of missing tournaments has the line "tournaments/67856 croquetscores.com/TournamentPlayers/68718"

    Scenario: Each document is a line of its own
      Given the file of missing tournaments is begun
      When "croquetscores.com/TournamentPlayers/68718" is written as naming the missing tournament "tournaments/67856"
      And "croquetscores.com/TournamentPlayers/68719" is written as naming the missing tournament "tournaments/67857"
      Then the file of missing tournaments has the line "tournaments/67857 croquetscores.com/TournamentPlayers/68719"

  Rule: Once the import is finished the documents are in order of their kind

    The documents are written as they are found, so that an import that
    stops partway through still says what it found. Once the import is
    finished they are put in order of the kind of document each is, so that
    all of one kind are together, as every TournamentPlayers document is, in
    any case, and those of one kind stay in the order they were found.

    Scenario: Documents of another kind found first come after
      Given the file of missing tournaments is begun
      And "croquetscores.com/TournamentPlayers/68718" is written as naming the missing tournament "tournaments/67856"
      And "croquetscores.com/knockouts/51145" is written as naming the missing tournament "tournaments/67856"
      When the file of missing tournaments is ended
      Then the file of missing tournaments has the line "tournaments/67856 croquetscores.com/knockouts/51145" before the line "tournaments/67856 croquetscores.com/TournamentPlayers/68718"

    Scenario: Documents of one kind stay in the order they were found
      Given the file of missing tournaments is begun
      And "croquetscores.com/knockouts/51147" is written as naming the missing tournament "tournaments/67857"
      And "croquetscores.com/commentaries/23041" is written as naming the missing tournament "tournaments/67857"
      And "croquetscores.com/knockouts/51145" is written as naming the missing tournament "tournaments/67856"
      When the file of missing tournaments is ended
      Then the file of missing tournaments has the line "tournaments/67857 croquetscores.com/knockouts/51147" before the line "tournaments/67856 croquetscores.com/knockouts/51145"

    Scenario: The file is still headed Missing Tournaments once it is in order
      Given the file of missing tournaments is begun
      And "croquetscores.com/knockouts/51145" is written as naming the missing tournament "tournaments/67856"
      When the file of missing tournaments is ended
      Then the file of missing tournaments says "# Missing Tournaments"
