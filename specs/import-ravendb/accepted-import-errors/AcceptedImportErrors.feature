Feature: What the import accepted, said in a file

  Not everything the import cannot bring over as the old site kept it is an
  error. Some of what the site refuses has been looked at and accepted
  (`ImportKnockouts.feature`), and some the import works around: a game
  against a bye left out (`importCompetition.feature`), a player brought over
  from a competition that the tournament's players no longer listed, or a
  team match's expected matches worked out from its games
  (`ImportTeamMatches.feature`). None of it is kept among the import's
  errors, which are what someone has to put right. Each is said instead in
  doc/accepted-import-errors.md, a line each, for whoever reads it to look at
  the tournament and see that nothing that mattered was lost.

  A line names the document, what of it was accepted, a code saying what was
  done, and why, with links to the tournament the document is of, at its
  address on the new site, which the import is told of, and on the old site
  the document is of. The import deletes the file before it begins, so
  that the file says only what the last import accepted, and writes it a line
  at a time, so that an import that stops partway through still says what it
  accepted before it stopped.

  The file begins by saying when the import began, by the clock of the
  machine it ran on, and how many errors the import before it kept in
  import_errors and how many things it said were accepted here, counted
  before the database and the file are emptied of them. It ends by saying
  how many of each this import kept, so that one import can be held against
  the last. What cannot be counted, as the errors of a database no import
  has written to, or the things accepted where there was no file, is said
  to be uncounted.

  Background:
    Given a file of accepted import errors of the scenario's own, for the new site at "http://localhost:3000"

  Rule: Beginning the file deletes what the last import said

    Scenario: What the last import said is gone once the file is begun
      Given the file of accepted import errors says "left over"
      When the file of accepted import errors is begun
      Then the file of accepted import errors does not say "left over"

    Scenario: A file that was not there is begun
      When the file of accepted import errors is begun
      Then the file of accepted import errors says nothing accepted

  Rule: What is accepted is said a line each, with links to its tournament

    Scenario: What is accepted names its document
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "croquetscores.com/knockouts/10088"

    Scenario: What is accepted says its code
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "Competition.NotDrawnToMeet"

    Scenario: What is accepted links to its tournament on the new site
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors links to "http://localhost:3000/2014/ac/spring-open"

    Scenario: What is accepted links to its tournament on the old site
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors links to "https://croquetscores.com/2014/ac/spring-open"

    Scenario: What is accepted of gateballscores.com links to its tournament there
      Given the file of accepted import errors is begun
      When game 4 of "gateballscores.com/knockouts/30" of "2014/gb/spring-open" on "gateballscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors links to "https://gateballscores.com/2014/gb/spring-open"

    Scenario: Each thing accepted is a line of its own
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      And game 5 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says 2 things accepted

  Rule: The file begins by saying when, and what the import before kept

    Scenario: The file says when the import began
      When the file of accepted import errors is begun at "2026-10-10T15:04:05"
      Then the file of accepted import errors says it was begun at "2026-10-10T15:04:05"

    Scenario: The file says how many errors the import before kept
      When the file of accepted import errors is begun after an import that kept 7806 errors
      Then the file of accepted import errors says the previous import kept 7806 import errors

    Scenario: Errors that could not be counted are said to be uncounted
      When the file of accepted import errors is begun after an import whose errors were not counted
      Then the file of accepted import errors says the previous import kept uncounted import errors

    Scenario: The file says how many things the import before accepted
      Given the file of accepted import errors is begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      And game 5 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      When the file of accepted import errors is begun
      Then the file of accepted import errors says the previous import kept 2 accepted import errors

    Scenario: With no file before, the things accepted are said to be uncounted
      When the file of accepted import errors is begun
      Then the file of accepted import errors says the previous import kept uncounted accepted import errors

  Rule: The file ends by saying what this import kept

    Scenario: The file says how many errors this import kept
      Given the file of accepted import errors is begun
      When the file of accepted import errors is ended with 12 errors kept
      Then the file of accepted import errors says this import kept 12 import errors

    Scenario: The file says how many things this import accepted
      Given the file of accepted import errors is begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      And game 5 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      When the file of accepted import errors is ended with 12 errors kept
      Then the file of accepted import errors says this import kept 2 accepted import errors

    Scenario: What the import before accepted is not counted as this import's
      Given the file of accepted import errors is begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      And the file of accepted import errors is begun
      When the file of accepted import errors is ended with 12 errors kept
      Then the file of accepted import errors says this import kept 0 accepted import errors
