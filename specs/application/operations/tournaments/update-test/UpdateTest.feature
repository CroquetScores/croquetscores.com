@postgres
Feature: Changing a test

  A manager of the tournament can correct one of its tests: its two teams, its days, how many matches it is expected to have, what each
  is the best of, and its group, said again together, and the account they
  are signed in to is who changed it. The tournament and the test are each
  named by their id, and the teams by theirs. A tournament there is not is
  refused as `UpdateTest.NoSuchTournament`. Only the tournament's managers
  can: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager` (`onlyManagers.feature`).

  Each value is asked its own rules on the way in, as it is when a test is
  added (`AddTest.feature`), and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks —
  a test there is and in use, two different teams of its own in use, days
  within its own — is the tournament's to refuse (`updateTest.feature`).

  Once a test has games in use, its teams are fixed, its expected matches
  cannot be made fewer than the matches started, and each match cannot be
  made the best of fewer games than any two players have played
  (`updateTest.feature`). What has been played is not the tournament's to
  know, so the application asks the test's games (`Games.feature`) how many
  matches have started and the most games any two players have played, and
  tells the tournament. An archived game counts for nothing, so it starts no
  match and adds to none, and a test whose only games are archived is
  changed as one with none is; its archived games are kept with it, to be
  restored only as the test now is would allow (`gamesInATest.feature`).

  A forgotten account changes nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models. Unless a scenario says otherwise, a test starts and finishes
  on the tournament's first day, is expected to have 1 match, each the best
  of 1, and is in no group, and the update says the test as it is but for
  what the scenario says it changes.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: A test with no games is changed and kept

    Scenario: The test is between its new teams
      Given the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the tournament's competition "AUS v SCO" is a test

    Scenario: The test is expected to have the matches it was updated to
      Given the update has the test expected to have 21 matches
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the test "AUS v ENG" is expected to have 21 matches

    Scenario: Each match of the test is the best of what it was updated to
      Given the update has each match of the test be the best of 3
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then each match of the test "AUS v ENG" is the best of 3

    Scenario: The test is in the group it was updated to
      Given the update has the test in the group "Group A"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: Changing the test is recorded as done by whoever asked
      Given the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: A test with games in use keeps its teams

    Scenario: Giving a test with a game another team is refused
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.TestHasGames"

    Scenario: A test refused is not changed
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the second team of the test "AUS v ENG" is "England"

    Scenario: A test with a game can be given a group
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has the test in the group "Group A"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: A test whose only game is archived can be given another team
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the tournament's competition "AUS v SCO" is a test

    Scenario: A test changed keeps its archived game
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the competition "AUS v SCO" of "Spring Tests" has the game of "Sam Someone" beating "Chris Third" 26 to 17

  Rule: Expected matches are never fewer than the matches started

    Scenario: Expected matches fewer than the matches started are refused
      Given "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 21 expected matches
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Alex Another" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has the test expected to have 1 match
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.ExpectedMatchesBelowStarted"

    Scenario: Expected matches as many as the matches started are kept
      Given "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 21 expected matches
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Alex Another" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has the test expected to have 2 matches
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the test "AUS v ENG" is expected to have 2 matches

    Scenario: A match whose only game is archived has not started
      Given "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 21 expected matches
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Alex Another" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Alex Another" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And the update has the test expected to have 1 match
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then the test "AUS v ENG" is expected to have 1 match

  Rule: Each match is the best of no fewer games than any two players have played

    Scenario: A best-of fewer than the most games played is refused
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has each match of the test be the best of 1
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.BestOfBelowGamesPlayed"

    Scenario: A best-of as many as the most games played is kept
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the update has each match of the test be the best of 2
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then each match of the test "AUS v ENG" is the best of 2

    Scenario: An archived game does not count towards the most games played
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Chris Third" beating "Sam Someone" in "AUS v ENG" of "Spring Tests"
      And the update has each match of the test be the best of 1
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then each match of the test "AUS v ENG" is the best of 1

  Rule: Each value must break none of its own rules

    Scenario: A best-of that breaks a rule is refused for it
      Given the update has each match of the test be the best of 0
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "BestOf.TooSmall"

    Scenario: A test with no second team is refused
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests" to have no second team
      Then it is refused with "Request.Invalid"
      And the first rule broken is "UpdateTest.SecondTeamMissing"

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: A test between a team and itself is refused as the tournament refuses it
      Given the update has the test's second team be "Australia"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.TestAgainstItself"

    Scenario: Updating an archived test is refused as the tournament refuses it
      Given "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      And the update has the test's second team be "Scotland"
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: Updating a test the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" updates a test "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

  Rule: Only a test in a tournament there is can be changed

    Scenario: Updating a test in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" updates the test "AUS v ENG" in a tournament there is not
      Then it is refused with "UpdateTest.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account updates the test "AUS v ENG" in "Spring Tests"
      Then it is refused with "Account.Forgotten"
