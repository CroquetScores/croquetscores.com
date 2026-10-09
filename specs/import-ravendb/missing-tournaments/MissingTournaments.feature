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
