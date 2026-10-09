Feature: What the import accepted, said in a file

  Not everything the import cannot bring over as the old site kept it is an
  error. Some of what the site refuses has been looked at and accepted
  (`ImportKnockouts.feature`), and some the import works around: a game
  against a bye left out (`importCompetition.feature`), or a player brought
  over from a competition that the tournament's players no longer listed.
  None of it is kept among the import's errors, which are what someone has to
  put right. Each is said instead in
  docs/import-from-ravendb/accepted-import-errors.md, under a heading each,
  for whoever reads it to look at the tournament and see that nothing that
  mattered was lost.

  Each is headed by a code saying what was done, the document, and what of
  it was accepted, as "## ImportCompetition.AgainstABye:
  croquetscores.com/knockouts/2883 game 4". Under it are the document's whole
  address on the new site, which the import is told of, and on the old site
  it was on, written out rather than as links, each on a line of its own, and
  then what was accepted and why, said for a person. The import deletes the
  file before it begins, so that the file says only what the last import
  accepted, and writes each as it is accepted, so that an import that stops
  partway through still says what it accepted before it stopped.

  The file begins by saying when the import began, by the clock of the
  machine it ran on, and how many errors the import before it kept in
  import_errors and how many things it said were accepted here, counted
  before the database and the file are emptied of them. It ends by saying
  how many of each this import kept, so that one import can be held against
  the last. What cannot be counted, as the errors of a database no import
  has written to, or the things accepted where there was no file, is said
  to be uncounted.

  What the import corrected of what the old sites kept, as a team match's
  expected matches where its games say more (`ImportTeamMatches.feature`), is
  not accepted as an error is, and is said in
  docs/import-from-ravendb/import-corrections.md instead, written the same
  way, with the same beginning and end, headed Import corrections, and
  counting what it says as import corrections.

  Background:
    Given a file of accepted import errors of the scenario's own, for the new site at "http://localhost:3000"

  Rule: Beginning the file deletes what the last import said

    Scenario: What the last import said is gone once the file is begun
      Given the file of accepted import errors was left saying "left over"
      When the file of accepted import errors is begun
      Then the file of accepted import errors does not say "left over"

    Scenario: A file that was not there is begun
      When the file of accepted import errors is begun
      Then the file of accepted import errors says nothing accepted

  Rule: What is accepted is said under a heading each, with its addresses and why

    Scenario: What is accepted names its document
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "croquetscores.com/knockouts/10088"

    Scenario: What is accepted says its code
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "Competition.NotDrawnToMeet"

    Scenario: What is accepted is headed by its code, its document and what of it
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "## Competition.NotDrawnToMeet: croquetscores.com/knockouts/10088 game 4"

    Scenario: What is accepted says where it is on the new site
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says the new site address "http://localhost:3000/2014/ac/spring-open"

    Scenario: What is accepted says where it was on the old site
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says the old site address "https://croquetscores.com/2014/ac/spring-open"

    Scenario: What is accepted of gateballscores.com says where it was there
      Given the file of accepted import errors is begun
      When game 4 of "gateballscores.com/knockouts/30" of "2014/gb/spring-open" on "gateballscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says the old site address "https://gateballscores.com/2014/gb/spring-open"

    Scenario: What is accepted says what was accepted, for a person
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "Accepted by the scenario."

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

  Rule: What the import corrected is said the same way, headed and counted as corrections

    Scenario: A file of corrections is headed as one
      Given the file is of import corrections, for the new site at "http://localhost:3000"
      When the file of accepted import errors is begun
      Then the file of accepted import errors says "# Import corrections"

    Scenario: A file of corrections counts what it says as corrections
      Given the file is of import corrections, for the new site at "http://localhost:3000"
      And the file of accepted import errors is begun
      And game 4 of "croquetscores.com/teammatches/360" of "2012/gc/world-team" on "croquetscores.com" is accepted as "ImportTeamMatches.ExpectedMatchesWorkedOut"
      When the file of accepted import errors is ended with 12 errors kept
      Then the file of accepted import errors says this import kept 1 import corrections
