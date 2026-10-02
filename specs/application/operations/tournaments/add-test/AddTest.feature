@postgres
Feature: Adding a test to a tournament

  A manager of a tournament played by teams can add a test to it, and the
  account they are signed in to is who added it. The tournament is named by
  its id; one there is not is refused as `AddTest.NoSuchTournament`. The test
  is given a new id, and the answer is that id. Only the tournament's
  managers can: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager` (`onlyManagers.feature`).

  A test is asked for by its two teams, each named by its id, the days it
  starts and finishes, how many matches it is expected to have, what each
  match is the best of, and the group it is in, if any. Each of the last
  three is asked its own rules on the way in (`ExpectedMatches.feature`,
  `BestOf.feature`, `TestGroup.feature`), and a request that breaks one is
  refused with `Request.Invalid` and the first rule it breaks. A team not said is refused with `Request.Invalid` and
  `AddTest.FirstTeamMissing` or `AddTest.SecondTeamMissing`, and a day that
  cannot be read as one with `ReadOnlyDate.Unreadable`, as a tournament's are
  (`CreateTournament.feature`): a day the calendar has not got, as 30
  February, among them, rather than being taken for the day it would run on
  to. What the tournament asks of a test — two
  different teams, both its own and in use, days within its own, and that it
  is played by teams — is the tournament's to refuse (`addTest.feature`), and
  so is its name and its slug.

  A test is a competition, so the competition is begun as a block's is
  (`AddBlock.feature`): it has its own stream, with no games, from the moment
  it is added.

  A forgotten account adds nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models. Unless a scenario says otherwise, its tournament starts on 3
  October 2026 and finishes on 5 October 2026, and a test starts and finishes
  on the tournament's first day, is expected to have 1 match, each the best
  of 1, and is in no group.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"

  Rule: A sound test is added and kept

    Scenario: The test is one of the tournament's competitions
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the tournament's competition "AUS v ENG" is a test

    Scenario: The answer is the test's id
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is answered with the id of the tournament's competition "AUS v ENG"

    Scenario: The test starts on the day it was asked to
      Given the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the test "AUS v ENG" starts on "2026-10-04"

    Scenario: The test finishes on the day it was asked to
      Given the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the test "AUS v ENG" finishes on "2026-10-05"

    Scenario: The test is expected to have the matches it was asked to
      Given the test is to be expected to have 21 matches
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the test "AUS v ENG" is expected to have 21 matches

    Scenario: Each of the test's matches is the best of what it was asked to be
      Given each match of the test is to be the best of 2
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then each match of the test "AUS v ENG" is the best of 2

    Scenario: The test is in the group it was asked to be in
      Given the test is to be in the group "Group A"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: The test is given its slug by the tournament
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the tournament's competition "AUS v ENG" has the slug "aus-v-eng"

    Scenario: The test begins with no games
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the competition "AUS v ENG" of "Spring Tests" has no games

    Scenario: Adding the test is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: Each value must break none of its own rules

    Scenario: A test with no first team is refused
      When the reader signed in to the account for "organiser@example.com" adds a test with no first team against "England" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddTest.FirstTeamMissing"

    Scenario: A test with no second team is refused
      When the reader signed in to the account for "organiser@example.com" adds a test between "Australia" and no second team to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddTest.SecondTeamMissing"

    Scenario Outline: A day that cannot be read is refused
      Given the test is to <when> on "<day>"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ReadOnlyDate.Unreadable"

      Examples:
        | when   | day        |
        | start  | soon       |
        | finish | later      |
        | start  | 2026-02-30 |
        | finish | 2026-09-31 |

    Scenario: Expected matches of none are refused
      Given the test is to be expected to have 0 matches
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ExpectedMatches.TooSmall"

    Scenario: A best-of of none is refused
      Given each match of the test is to be the best of 0
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "BestOf.TooSmall"

    Scenario: A group too long is refused
      Given the test is to be in a group of 255 characters
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "TestGroup.TooLong"

    Scenario: A test that breaks a rule is not added
      When the reader signed in to the account for "organiser@example.com" adds a test with no first team against "England" to "Spring Tests"
      Then the tournament has no competitions

  Rule: What the tournament asks of its tests is the tournament's to refuse

    Scenario: A test between a team and itself is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "Australia" to "Spring Tests"
      Then it is refused with "Tournament.TestAgainstItself"

    Scenario: A test with an archived team is refused as the tournament refuses it
      Given "organiser@example.com" has archived the team "England" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused for breaking "Team.Archived"

    Scenario: A test that starts before the tournament is refused as the tournament refuses it
      Given the test is to start on "2026-10-02"
      And the test is to finish on "2026-10-03"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.TestStartsBeforeTournament"

    Scenario: A test that finishes after the tournament is refused as the tournament refuses it
      Given the test is to start on "2026-10-05"
      And the test is to finish on "2026-10-06"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.TestFinishesAfterTournament"

    Scenario: A test that finishes before it starts is refused as the tournament refuses it
      Given the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-03"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.TestFinishesBeforeStarts"

    Scenario: Adding a test to an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a test added

    Scenario: Adding a test to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the test between "Australia" and "England" to a tournament there is not
      Then it is refused with "AddTest.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the test between "Australia" and "England" to "Spring Tests"
      Then it is refused with "Account.Forgotten"
