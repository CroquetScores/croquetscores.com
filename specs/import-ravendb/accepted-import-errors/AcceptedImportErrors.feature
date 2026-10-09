Feature: What the import accepted, said in a file

  Not everything the import cannot bring over as the old site kept it is an
  error. Some of what the site refuses has been looked at and accepted
  (`ImportKnockouts.feature`), and some the import works around: a game
  against a bye left out (`importCompetition.feature`), a player brought over
  from a competition that the tournament's players no longer listed, or a
  team match's expected matches worked out from its games
  (`ImportTeamMatches.feature`). None of it is kept among the import's
  errors, which are what someone has to put right. Each is said instead in
  doc/accepted-import-error.md, a line each, for whoever reads it to look at
  the tournament and see that nothing that mattered was lost.

  A line names the document, what of it was accepted, a code saying what was
  done, and why, with a link to the tournament the document is of, at its
  address on its website. The import deletes the file before it begins, so
  that the file says only what the last import accepted, and writes it a line
  at a time, so that an import that stops partway through still says what it
  accepted before it stopped.

  Background:
    Given a file of accepted import errors of the scenario's own

  Rule: Beginning the file deletes what the last import said

    Scenario: What the last import said is gone once the file is begun
      Given the file of accepted import errors says "left over"
      When the file of accepted import errors is begun
      Then the file of accepted import errors does not say "left over"

    Scenario: A file that was not there is begun
      When the file of accepted import errors is begun
      Then the file of accepted import errors says nothing accepted

  Rule: What is accepted is said a line each, with a link to its tournament

    Scenario: What is accepted names its document
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "croquetscores.com/knockouts/10088"

    Scenario: What is accepted says its code
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says "Competition.NotDrawnToMeet"

    Scenario: What is accepted links to its tournament
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors links to "https://croquetscores.com/2014/ac/spring-open"

    Scenario: Each thing accepted is a line of its own
      Given the file of accepted import errors is begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      And game 5 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is accepted as "Competition.NotDrawnToMeet"
      Then the file of accepted import errors says 2 things accepted
