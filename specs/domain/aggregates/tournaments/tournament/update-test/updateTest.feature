Feature: Changing a test

  A test added with the wrong teams, days, expected matches, best-of or group
  can be corrected. Updating a test says all of them again, and each is asked
  what it is asked when a test is added (`addTest.feature`): two different
  teams, both the tournament's and in use, days within the tournament's with
  the start no later than the finish, expected matches and a best-of that
  are whole numbers from 1 up, and a group no longer than a group may be. A
  tournament whose days are changed leaves its tests as they were
  (`update.feature`), so a test is not refused for what the tournament became
  after it was added: a day it starts or finishes on that the update leaves
  as it was is not asked again whether it is within the tournament's. The
  test keeps its id, its order and its slug, so that its address still finds
  it, as a competition renamed keeps its own. Its name is its teams' short
  names, so a test given other teams is called by theirs.

  Once a test has games in use, what they were played as is fixed, and the
  rest can still be corrected. Its games were played between its teams'
  players, so its teams cannot be changed, and a test given other teams is
  refused with `Tournament.TestHasGames`. Its expected matches cannot be made
  fewer than the matches already started, a match being started once its two
  players have a game in use, since a test expected to have fewer matches
  than it has would say it was further through than it is; that is refused
  with `Tournament.ExpectedMatchesBelowStarted`. And each match is the best of
  no fewer games than any two players have already played in use, since a
  match holding more games than its best-of allows could not have been
  played; that is refused with `Tournament.BestOfBelowGamesPlayed`. A best-of
  lowered to no fewer than that is accepted, and can leave a match decided
  that was not, which is the best-of's to say (`gamesInATest.feature`). Its
  days and its group can be changed whatever has been played.

  An archived game counts for nothing, here as anywhere games are counted
  (`archiveGame.feature`): it starts no match and adds to no match's games.
  Should one be restored after the test was changed, it is asked what a game
  added to the test as it now is would be asked (`gamesInATest.feature`).

  The games are not the tournament's to know: they are kept by the test
  (`gamesInATest.feature`). So whatever asks for a test to be updated says
  how many of its matches have started, and the most games in use any two
  of its players have played, as it says which test.

  The test is found by its id, and an id that is no competition's in the
  tournament is refused. A tournament played by teams has no competitions
  but its tests (`addBlock.feature`), so every competition it has is one. An
  archived test can only be restored (`restoreCompetition.feature`), and an archived
  tournament only restored (`restore.feature`), so updating either is
  refused.

  An update that changes nothing records nothing, because nothing happened.

  Unless a scenario says otherwise, its tournament starts on 3 October 2026
  and finishes on 5 October 2026, a team's short name is the first three
  letters of its name in capitals (`Team.feature`), a test starts and
  finishes on the tournament's first day, is expected to have 1 match, each
  the best of 1, and is in no group, and the update says the test as it is
  but for what the scenario says it changes.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the team "England" was added to it
    And the team "Scotland" was added to it
    And the test between "Australia" and "England" was added to it

  Rule: Updating a test with no games is recorded, and is what the test is

    Scenario: Updating a test records it
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a test being updated

    Scenario: A test given another team is between its new teams
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the second team of the test "AUS v SCO" is "Scotland"

    Scenario: A test given another team is called by its new teams' short names
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the tournament has the competition "AUS v SCO"

    Scenario: A test given another team keeps its slug
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the tournament's competition "AUS v SCO" has the slug "aus-v-eng"

    Scenario: A test whose teams are swapped is called the other way round
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's first team be "England"
      And the update has the test's second team be "Australia"
      When the test "AUS v ENG" is updated
      Then the tournament has the competition "ENG v AUS"

    Scenario: An updated test starts on the day it was updated to
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test start on "2026-10-04"
      And the update has the test finish on "2026-10-05"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" starts on "2026-10-04"

    Scenario: An updated test finishes on the day it was updated to
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test start on "2026-10-04"
      And the update has the test finish on "2026-10-05"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" finishes on "2026-10-05"

    Scenario: An updated test is expected to have the matches it was updated to
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test expected to have 21 matches
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is expected to have 21 matches

    Scenario: Each match of an updated test is the best of what it was updated to
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has each match of the test be the best of 2
      When the test "AUS v ENG" is updated
      Then each match of the test "AUS v ENG" is the best of 2

    Scenario: An updated test is in the group it was updated to
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test in the group "Group A"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: A test updated to no group is in none
      Given the test "AUS v ENG" was updated to be in the group "Group A"
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test in no group
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is in no group

    Scenario: An updated test keeps its place in the list
      Given the test between "England" and "Scotland" was added to it
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the tournament's first competition is "AUS v SCO"

    Scenario: A tournament rebuilt after a test was updated has the test as updated
      Given the test "AUS v ENG" was updated to be between "Australia" and "Scotland"
      When the tournament is rebuilt from the stream
      Then the tournament has the competition "AUS v SCO"

  Rule: A test with games in use keeps its teams

    Whatever asks says how many matches have started, and a test with none
    started has no games in use: an archived game starts no match.

    Scenario: Giving a test with games another team is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestHasGames"

    Scenario: Swapping the teams of a test with games is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the update has the test's first team be "England"
      And the update has the test's second team be "Australia"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestHasGames"

    Scenario: A test refused keeps its teams
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the second team of the test "AUS v ENG" is "England"

    Scenario: A test with games can be given new days
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the update has the test start on "2026-10-04"
      And the update has the test finish on "2026-10-05"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" starts on "2026-10-04"

    Scenario: A test with games can be given a group
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the update has the test in the group "Group A"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is in the group "Group A"

  Rule: Expected matches are never fewer than the matches started

    Scenario: Expected matches as many as have started are accepted
      Given the test "AUS v ENG" was updated to be expected to have 21 matches
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 3 matches started
      And the update has the test expected to have 3 matches
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is expected to have 3 matches

    Scenario: Expected matches more than have started are accepted
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 3 matches started
      And the update has the test expected to have 21 matches
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is expected to have 21 matches

    Scenario: Expected matches fewer than have started are refused
      Given the test "AUS v ENG" was updated to be expected to have 21 matches
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 3 matches started
      And the update has the test expected to have 2 matches
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.ExpectedMatchesBelowStarted"

  Rule: Each match is the best of no fewer games than any two players have played

    Scenario: A best-of as many as the most games played is accepted
      Given the test "AUS v ENG" was updated to have each match the best of 5
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the most games two players have played in the test "AUS v ENG" is 3
      And the update has each match of the test be the best of 3
      When the test "AUS v ENG" is updated
      Then each match of the test "AUS v ENG" is the best of 3

    Scenario: A best-of raised is accepted
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the most games two players have played in the test "AUS v ENG" is 1
      And the update has each match of the test be the best of 3
      When the test "AUS v ENG" is updated
      Then each match of the test "AUS v ENG" is the best of 3

    Scenario: A best-of fewer than the most games played is refused
      Given the test "AUS v ENG" was updated to have each match the best of 5
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      And the most games two players have played in the test "AUS v ENG" is 3
      And the update has each match of the test be the best of 2
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.BestOfBelowGamesPlayed"

  Rule: What is asked of a test added is asked of a test updated

    Scenario: A test updated to be between a team and itself is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Australia"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestAgainstItself"

    Scenario: A test updated to an archived team is refused
      Given the team "Scotland" was archived
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then it is refused for breaking "Team.Archived"

    Scenario: A test updated to a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "team/123e4567-e89b-42d3-a456-426614174000" by its id
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: A test updated to start before the tournament is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test start on "2026-10-02"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestStartsBeforeTournament"

    Scenario: A test updated to finish after the tournament is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test finish on "2026-10-06"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestFinishesAfterTournament"

    Scenario: A test updated to finish before it starts is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test start on "2026-10-05"
      And the update has the test finish on "2026-10-04"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestFinishesBeforeStarts"

    Scenario: A best-of of none is refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has each match of the test be the best of 0
      When the test "AUS v ENG" is updated
      Then it is refused for breaking "BestOf.TooSmall"

    Scenario: Expected matches of none are refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test expected to have 0 matches
      When the test "AUS v ENG" is updated
      Then it is refused for breaking "ExpectedMatches.TooSmall"

  Rule: A test in an Eire Cup or an Interstate Shield is in no group, updated as added

    Scenario Outline: A test updated to a group is refused in <format>
      Given a stream where a tournament was created in the format "<format>"
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the update has the test in the group "Group A"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.FormatHasNoGroups"

      Examples:
        | format            |
        | Eire Cup          |
        | Interstate Shield |

  Rule: A day left as it was is not refused for what the tournament became

    Scenario: A test on a day the tournament no longer has can be given a group
      Given it was updated with the days "2026-10-04T00:00:00Z" to "2026-10-05T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test in the group "Group A"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" is in the group "Group A"

    Scenario: A test on a day the tournament no longer has can be moved within it
      Given it was updated with the days "2026-10-04T00:00:00Z" to "2026-10-05T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test start on "2026-10-04"
      And the update has the test finish on "2026-10-04"
      When the test "AUS v ENG" is updated
      Then the test "AUS v ENG" starts on "2026-10-04"

    Scenario: A test on a day the tournament no longer has cannot be moved to another day outside it
      Given it was updated with the days "2026-10-04T00:00:00Z" to "2026-10-04T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test finish on "2026-10-05"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.TestFinishesAfterTournament"

  Rule: Only a test there is, and one in use, can be updated

    Scenario: Updating a competition the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the test "competition/123e4567-e89b-42d3-a456-426614174000" is updated by its id
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Updating an archived test is refused
      Given the competition "AUS v ENG" was archived
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.CompetitionArchived"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a test to what it already is records nothing
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      When the test "AUS v ENG" is updated
      Then it has recorded 0 events

    Scenario: Updating a test to what it already is is not refused
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      When the test "AUS v ENG" is updated
      Then it is not refused

  Rule: A test in an archived tournament cannot be updated

    Scenario: Updating a test in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.Archived"

  Rule: Updating a test says how it is played and counted again

    Scenario: A test updated to allow drawn results does
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update allows drawn results in the competition
      When the test "AUS v ENG" is updated
      Then the tournament's competition "AUS v ENG" allows drawn results

    Scenario: A test updated saying nothing of them keeps them
      Given the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      And the update has the test's second team be "Scotland"
      When the test "AUS v ENG" is updated
      Then the tournament's competition "AUS v SCO" counts towards the world rankings
