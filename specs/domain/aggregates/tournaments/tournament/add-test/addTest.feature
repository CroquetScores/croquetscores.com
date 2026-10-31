Feature: Adding a test to a tournament

  A tournament played by teams is played as tests: a test is a meeting of two
  of its teams, played over one day or several, and made of games between a
  player of each (`gamesInATest.feature`). A test is one kind of competition,
  as a block, a knockout and a Swiss are (`addBlock.feature`), so the
  tournament holds a reference to it (`CompetitionReference.feature`) and
  keeps it with the others: it is ordered, moved, archived and restored as any
  competition is (`moveCompetition.feature`, `archiveCompetition.feature`,
  `restoreCompetition.feature`), and what is said there is not said again
  here.

  A test is added with an id of its own, given by whatever adds it, the two
  teams it is between, in the order they are to be read, the days it starts
  and finishes, how many matches it is expected to have
  (`ExpectedMatches.feature`), what each of its matches is the best of
  (`BestOf.feature`), and the group it is played in, if any
  (`TestGroup.feature`). Each is refused as it would be on its own. A
  best-of may be even, as it may in a block: a test is won by the matches
  and games its players win, and a match shared is a result like any other
  (`gamesInATest.feature`). It is not given a name. It is called by its teams'
  short names, the first team's first, as "AUS v ENG", and that is the name
  the tournament lists it by. A team's short name corrected is its tests'
  names corrected with it (`updateTeam.feature`).

  A test is found within its tournament by a slug made from the name it is
  given when added, as "2026/ac/spring-tests/tests/aus-v-eng", under "tests"
  rather than "competitions", since it is a test a reader is looking for. Two
  teams can meet more than once, and a slug another test has is followed by
  "-01", then "-02", up to "-99", as a competition's is. It keeps its slug
  when a team's short name changes, so that its address still finds it.

  A test is between two different teams: a team does not play itself. Both are
  the tournament's, and neither is archived, since an archived team is out of
  the way and can only be restored (`Team.feature`).

  A test starts no later than it finishes, and it is played within the
  tournament: it starts no earlier than the day the tournament starts, and
  finishes no later than the day the tournament finishes. A test's days are
  whole days, and are compared with the days the tournament's starts and
  finishes fall on in UTC, as the year of its address is (`create.feature`).
  A tournament whose days are changed afterwards leaves its tests as they
  were (`update.feature`): a test is not refused for what the tournament
  became after it was added.

  Only a tournament played by teams has tests, and only it has teams. Adding
  a test to a Standard tournament is refused, as adding a team is
  (`addTeam.feature`).

  No two competitions in a tournament have the same id, a test among them.
  Two tests between the same teams have the same name, and that is not
  refused: the tournament's name for a competition is for telling blocks
  apart, and tests are told apart by their teams and their days.

  A test is given an order as every competition is: 10,000 more than the
  highest order there is (`addBlock.feature`).

  An archived tournament can only be restored (`restore.feature`), so adding a
  test to one is refused.

  Unless a scenario says otherwise, its tournament starts on 3 October 2026
  and finishes on 5 October 2026, a team's short name is the first three
  letters of its name in capitals (`Team.feature`), and a test starts and
  finishes on the tournament's first day, is expected to have 1 match, each
  match the best of 1, and is in no group.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the team "England" was added to it

  Rule: Adding a test is recorded, and the test is one of the tournament's competitions

    Scenario: Adding a test records it
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then it has recorded 1 event
      And the first thing it recorded is a test being added

    Scenario: A test added is one of the tournament's competitions
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament has the competition "AUS v ENG"

    Scenario: A test added is a test
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is a test

    Scenario: A test added is known by the id it was added with
      Given the tournament is rebuilt from the stream
      And the competition id "competition/123e4567-e89b-42d3-a456-426614174000"
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is known by "competition/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A test's first team is the one it was added with first
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the first team of the test "AUS v ENG" is "Australia"

    Scenario: A test's second team is the one it was added with second
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the second team of the test "AUS v ENG" is "England"

    Scenario: A test starts on the day it was added to start on
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" starts on "2026-10-04"

    Scenario: A test finishes on the day it was added to finish on
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" finishes on "2026-10-05"

    Scenario: A test added is not archived
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is not archived

    Scenario: A tournament rebuilt after a test was added has the test
      Given the test between "Australia" and "England" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's competition "AUS v ENG" is a test

  Rule: A test has its expected matches, its best-of and its group

    Scenario: A test is expected to have the matches it was added with
      Given the tournament is rebuilt from the stream
      And the test is to be expected to have 21 matches
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" is expected to have 21 matches

    Scenario Outline: Each of a test's matches is the best of what it was added as
      Given the tournament is rebuilt from the stream
      And each match of the test is to be the best of <games>
      When the test between "Australia" and "England" is added
      Then each match of the test "AUS v ENG" is the best of <games>

      Examples:
        | games |
        | 1     |
        | 2     |
        | 3     |

    Scenario: A test is in the group it was added in
      Given the tournament is rebuilt from the stream
      And the test is to be in the group "Group A"
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: A test added in no group is in none
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" is in no group

    Scenario: Expected matches that are not a whole number from 1 up are refused
      Given the tournament is rebuilt from the stream
      And the test is to be expected to have 0 matches
      When the test between "Australia" and "England" is added
      Then it is refused for breaking "ExpectedMatches.TooSmall"

    Scenario: A best-of of none is refused
      Given the tournament is rebuilt from the stream
      And each match of the test is to be the best of 0
      When the test between "Australia" and "England" is added
      Then it is refused for breaking "BestOf.TooSmall"

    Scenario: A group too long is refused
      Given the tournament is rebuilt from the stream
      And the test is to be in a group of 255 characters
      When the test between "Australia" and "England" is added
      Then it is refused for breaking "TestGroup.TooLong"

  Rule: A test is called by its teams' short names, the first team's first

    Scenario: A test is called by its first team's short name, then its second's
      Given the tournament is rebuilt from the stream
      When the test between "England" and "Australia" is added
      Then the tournament has the competition "ENG v AUS"

    Scenario: A test is called by its teams' short names as they were typed
      Given the team is to be known for short as "Scot"
      And the team "Scotland" was added to it
      And the tournament is rebuilt from the stream
      When the test between "Scotland" and "England" is added
      Then the tournament has the competition "Scot v ENG"

  Rule: A test is found by a slug of its name that no other test in the tournament has

    Scenario: A test's slug is made from its name
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" has the slug "aus-v-eng"

    Scenario: A second test between the same teams is followed by "-01"
      Given the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the second test "AUS v ENG" has the slug "aus-v-eng-01"

    Scenario: A second test between the same teams is not refused
      Given the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then it is not refused

    Scenario: A test between the same teams the other way round has a slug of its own
      Given the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the test between "England" and "Australia" is added
      Then the tournament's competition "ENG v AUS" has the slug "eng-v-aus"

    Scenario: A slug an archived test has is followed by "-01"
      Given the test between "Australia" and "England" was added to it
      And the competition "AUS v ENG" was archived
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the second test "AUS v ENG" has the slug "aus-v-eng-01"

  Rule: Each test added is given 10,000 more than the highest order there is

    Scenario: The first test added is given 10,000
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" has the order 10000

    Scenario: The next test is given 10,000 more than the highest order
      Given the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the test between "England" and "Australia" is added
      Then the tournament's competition "ENG v AUS" has the order 20000

  Rule: A test is between two different teams, both the tournament's and in use

    Scenario: A test between a team and itself is refused
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "Australia" is added
      Then it is refused with "Tournament.TestAgainstItself"

    Scenario: A test with a first team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the test between "team/123e4567-e89b-42d3-a456-426614174000" and "England" is added by the first team's id
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: A test with a second team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "team/123e4567-e89b-42d3-a456-426614174000" is added by the second team's id
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: A test with an archived first team is refused
      Given the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then it is refused for breaking "Team.Archived"

    Scenario: A test with an archived second team is refused
      Given the team "England" was archived
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then it is refused for breaking "Team.Archived"

  Rule: A test starts no later than it finishes

    Scenario: A test that starts and finishes on the same day is accepted
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-04"
      When the test between "Australia" and "England" is added
      Then it is not refused

    Scenario: A test that finishes before it starts is refused
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-03"
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.TestFinishesBeforeStarts"

  Rule: A test is played within the tournament

    Scenario: A test on the tournament's first day is accepted
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-03"
      And the test is to finish on "2026-10-03"
      When the test between "Australia" and "England" is added
      Then it is not refused

    Scenario: A test on the tournament's last day is accepted
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-05"
      And the test is to finish on "2026-10-05"
      When the test between "Australia" and "England" is added
      Then it is not refused

    Scenario: A test that starts before the tournament does is refused
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-02"
      And the test is to finish on "2026-10-03"
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.TestStartsBeforeTournament"

    Scenario: A test that finishes after the tournament does is refused
      Given the tournament is rebuilt from the stream
      And the test is to start on "2026-10-05"
      And the test is to finish on "2026-10-06"
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.TestFinishesAfterTournament"

  Rule: Only a tournament played by teams has tests

    Scenario: Adding a test to a Standard tournament is refused
      Given a stream where a tournament was created in the format "Standard"
      And the tournament is rebuilt from the stream
      When a test between two teams is added
      Then it is refused with "Tournament.NotPlayedByTeams"

  Rule: A test in an Eire Cup or an Interstate Shield is in no group

    The regulations of those two events do not have groups, so a group named
    there would be a mistake rather than a choice. The other team formats are
    played in groups as often as not.

    Scenario Outline: A test in a group is refused in <format>
      Given a stream where a tournament was created in the format "<format>"
      And the tournament is rebuilt from the stream
      And the test is to be in the group "Group A"
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.FormatHasNoGroups"

      Examples:
        | format            |
        | Eire Cup          |
        | Interstate Shield |

    Scenario Outline: A test in no group is accepted in <format>
      Given a stream where a tournament was created in the format "<format>"
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" is in no group

      Examples:
        | format            |
        | Eire Cup          |
        | Interstate Shield |

    Scenario Outline: A test in a group is accepted in <format>
      Given a stream where a tournament was created in the format "<format>"
      And the tournament is rebuilt from the stream
      And the test is to be in the group "Group A"
      When the test between "Australia" and "England" is added
      Then the test "AUS v ENG" is in the group "Group A"

      Examples:
        | format                     |
        | Teams                      |
        | GC World Team Championship |

  Rule: No two competitions in a tournament have the same id

    Scenario: A test with an id another competition has is refused
      Given the test between "Australia" and "England" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the competition id "competition/123e4567-e89b-42d3-a456-426614174000"
      When the test between "England" and "Australia" is added
      Then it is refused with "Tournament.CompetitionAlreadyAdded"

  Rule: A test cannot be added to an archived tournament

    Scenario: Adding a test to an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.Archived"

  Rule: A test is played and counted as it is said to be

    A test has the same rules as any competition has (`competitionRules.feature`).

    Scenario: A test added without saying is not played under handicap
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is not played under handicap

    Scenario: A test added without saying does not allow drawn results
      Given the tournament is rebuilt from the stream
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" does not allow drawn results

    Scenario: A test said to allow drawn results does
      Given the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" allows drawn results

    Scenario: A test said to be played under handicap is
      Given the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is played under handicap

    Scenario: A test allowing drawn results said to count towards the world rankings is refused
      Given the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      And the competition is said to count towards the world rankings
      When the test between "Australia" and "England" is added
      Then it is refused with "Tournament.DrawsInWorldRankings"
