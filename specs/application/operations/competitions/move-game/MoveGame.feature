@postgres
Feature: Moving a test's score up or down

  A manager or a scorer of the tournament moves the score of one of a test's
  games up or down a place, to list the test's scores as they were played,
  and the account they are signed in to is who moved it. The tournament, the
  test and the game are each named by their id, and the way to move it is up
  or down; a way that is neither is refused with `Request.Invalid` and
  `MoveGame.NoSuchDirection`. The game swaps places with the game in use next
  to it (`moveGame.feature`), and moving the first up or the last down records
  nothing. What the competition refuses — a game it does not have, an
  archived game, a game of a competition that is not a test — is the
  competition's to refuse.

  It is asked of the tournament first, as archiving a score is
  (`ArchiveGame.feature`): only a manager or a scorer can, since listing the
  scores as they were played is part of entering them, anybody else being
  refused with `Tournament.NotAManagerOrScorer`; an archived tournament is
  refused with `Tournament.Archived`, an archived test with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `MoveGame.NoSuchTournament`; and a forgotten account with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Pat Fourth" to the team "England" of "Spring Tests"
    And the test is to be expected to have 21 matches
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
    And "Alex Another" has beaten "Pat Fourth" 26 to 3 in "AUS v ENG" of "Spring Tests"

  Rule: A score moved is kept in its new place

    Scenario: A score moved up is kept first
      When the reader signed in to the account for "organiser@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then the first score of "AUS v ENG" of "Spring Tests" is of "Alex Another" beating "Pat Fourth"

    Scenario: A score moved down is kept second
      When the reader signed in to the account for "organiser@example.com" moves the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests" down
      Then the first score of "AUS v ENG" of "Spring Tests" is of "Alex Another" beating "Pat Fourth"

    Scenario: A scorer of the tournament moves a score
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then the first score of "AUS v ENG" of "Spring Tests" is of "Alex Another" beating "Pat Fourth"

    Scenario: Moving the first score up records nothing
      When the reader signed in to the account for "organiser@example.com" moves the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests" up
      Then it is not refused

  Rule: The way to move it is up or down

    Scenario: A way that is neither is refused
      When the reader signed in to the account for "organiser@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" "sideways"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "MoveGame.NoSuchDirection"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A score the test does not have is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" moves a score "AUS v ENG" of "Spring Tests" does not have up
      Then it is refused with "Competition.NoSuchGame"

    Scenario: An archived score is refused as the game refuses it
      Given "organiser@example.com" has archived the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then it is refused for breaking "Game.Archived"

  Rule: Only a test there is, in a tournament there is and not archived, has a score moved

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of a tournament there is not up
      Then it is refused with "MoveGame.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then it is refused with "Tournament.NotAManagerOrScorer"

  Rule: A forgotten account moves nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account moves the score of "Alex Another" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests" up
      Then it is refused with "Account.Forgotten"
