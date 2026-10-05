@postgres
Feature: How the teams of a tournament played by teams stand, for anybody to read

  A tournament played by teams has a Summary section (`tournament.feature`),
  whose page shows how its teams stand (`teamSummary.feature`), as the old
  site's summary did. The application answers it: each team of the tournament
  in use, by its name and its short name, with the tests it has won, lost and
  drawn, the matches and the games its players have won and lost in them,
  and the hoops they have scored and had scored against them, and the teams
  ranked; and whether any of its tests in use has matches the best of more
  than 1, since where none has, a match is its one game, and the page need
  not say its matches as well as its games.

  A test between two teams is won by the team that wins more of its matches,
  a match being won by the side that wins more than half the games it is the
  best of (`create.feature`). A test level on matches is decided by net
  games, the games its team won in it less the games they lost, then by net
  hoops, the hoops they scored in it less the hoops scored against them;
  unless the tournament says a test level on matches is drawn, the old site's
  "drawn matches are not decided by net hoops", when it is drawn. A test
  level on matches, net games and net hoops alike is drawn too, since nothing
  is left to decide it.

  A test is won, lost or drawn only once every match it is expected to have
  is decided, since until then its result is not known; but every game
  played in it counts towards the games and hoops of its teams from the
  first. A test is won sooner where a team has won more than half the
  matches it is expected to have, as 2 of 3 or 3 of 4, since the other team
  can no longer win as many; its matches still to be played change nothing
  but its games and hoops. A shared match, as a best of 2 can end, is won by neither team.

  A team's matches are those its players have won and lost in the
  tournament's tests, each once it is decided and not before, and a shared
  match neither. A team's games are those its players have won and lost in
  the tournament's tests, and its hoops the points they scored and had scored against them,
  the points being the number a score starts with, so that "26tp" is 26. An
  archived game counts for nothing, as everywhere games are counted. A test
  with games in use cannot be archived (`archiveCompetition.feature`), so an
  archived test has none to count.

  The teams are ranked by the tests they have won, most first, as the old
  site's summary ranked them; where that is the same, by the matches they
  have won across all their tests, most first, then by their net games, then
  by their net hoops, and where all of those are
  the same, in the tournament's order of its teams.

  The page is a section of the tournament's, so the tournament is answered
  with it as with its games (`GamesOfTournament.feature`): its name, where it
  is found now, and its tests in use with where each is found.

  A Standard tournament has no teams to stand, and asking for one is refused
  as `PublicTeamSummaryOfTournament.NotPlayedByTeams`. An address no
  tournament of the website has been found at, or an archived tournament's,
  is refused as `PublicTeamSummaryOfTournament.NoSuchTournament`. An address
  the tournament has moved on from still finds it, and it is answered with
  where it is found now.

  Nobody need be signed in to ask, and every scenario here asks with nobody
  signed in.

  Where a scenario says nothing else, "Spring Tests" is played by teams, its
  teams "Australia", "AUS", with "Pat Player" and "Pam Partner", and
  "England", "ENG", with "Kim Keeper" and "Ken Kicker", and its test between
  them is expected to have 2 matches, each the best of 1.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the team is to be known for short as "AUS"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And the team is to be known for short as "ENG"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

  Rule: Each team in use is answered, with the tournament

    Scenario: A team is answered by its short name
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary known for short as "AUS"

    Scenario: An archived team is not answered
      Given "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has archived the team "New Zealand" in "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then 2 teams are answered in the summary

    Scenario: The tournament is answered with the summary
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is called "Spring Tests"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is found at "2026/gc/spring-tests"

  Rule: A test is won by the team that wins more of its matches, once every match is decided

    Scenario: The team that wins more matches wins the test
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: The other team loses it
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 1 test lost

    Scenario: A test with a match not yet decided is won by neither team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 tests won

    Scenario: A test with a match not yet decided is lost by neither team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 0 tests lost

  Rule: A test is won once a team has won more than half the matches it is expected to have

    Background:
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 3 expected matches

    Scenario: A team that has won more than half of an odd number of expected matches wins the test
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: The other team loses it
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 1 test lost

    Scenario: The second team wins the test as the first would
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 1 test won

    Scenario: A team that has won no more than half of the expected matches has not yet won the test
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 tests won

    Scenario: A team that has won more than half of an even number of expected matches wins the test
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 4 expected matches
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: A team that has won half of an even number of expected matches has not yet won the test
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 4 expected matches
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 tests won

  Rule: A test level on matches is decided by net games, then net hoops, unless the tournament draws it

    Scenario: A test level on matches is decided by net games
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 2 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 2 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: A test level on matches and net games is decided by net hoops
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 25 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: A test level on matches, net games and net hoops is drawn
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test drawn

    Scenario: A tournament that draws a level test draws one level on matches
      Given the tournament "Spring Tests" draws a level test
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 25 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test drawn

    Scenario: A tournament that draws a level test still gives a test won on matches to its winner
      Given the tournament "Spring Tests" draws a level test
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

  Rule: A team's matches are its players' in the tournament's tests, each once decided

    Background:
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3

    Scenario: A match won by a team's player is a match won by the team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 match won

    Scenario: A match lost by a team's player is a match lost by the team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 1 match lost

    Scenario: A match not yet decided is won by neither team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 matches won

  Rule: The summary says whether any test has matches the best of more than 1

    Scenario: A tournament whose tests' matches are each the best of 1 has none
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the summary is answered with no test of matches the best of more than 1

    Scenario: A tournament with a test whose matches are the best of 3 has one
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the summary is answered with a test of matches the best of more than 1

  Rule: A team's games and hoops are its players' in the tournament's tests

    Scenario: A game won by a team's player is a game won by the team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 game won

    Scenario: A game lost by a team's player is a game lost by the team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 1 game lost

    Scenario: A team's hoops for are the points its players scored
      Given "Pat Player" has beaten "Kim Keeper" 26tp to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 46 hoops for

    Scenario: A team's hoops against are the points scored against its players
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 43 hoops against

    Scenario: An archived game counts for nothing
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 games won

  Rule: The teams are ranked by tests won, then matches won, then net games, then net hoops

    Background:
      Given the team is to be known for short as "NZ"
      And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the player "Nat Ninth" to the team "New Zealand" of "Spring Tests"
      And "organiser@example.com" has added the player "Ned Tenth" to the team "New Zealand" of "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "New Zealand" to "Spring Tests"
      And "organiser@example.com" has given the test "ENG v NZ" of "Spring Tests" 2 expected matches

    Scenario: The team with more tests won is ranked higher
      Given "Pat Player" has beaten "Kim Keeper" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has given the test "ENG v NZ" of "Spring Tests" 4 expected matches
      And "Nat Ninth" has beaten "Kim Keeper" 26 to 2 in "ENG v NZ" of "Spring Tests"
      And "Nat Ninth" has beaten "Ken Kicker" 26 to 2 in "ENG v NZ" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "Australia"

    Scenario: Teams with the same tests won are ranked by matches won, not by net matches
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 5 expected matches
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Kim Keeper" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Nat Ninth" has beaten "Ken Kicker" 26 to 2 in "ENG v NZ" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "Australia"

    Scenario: Teams with the same tests won and matches won are ranked by net games
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 3 expected matches
      And "organiser@example.com" has given the test "ENG v NZ" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "Nat Ninth" has beaten "Ken Kicker" 26 to 2 in "ENG v NZ" of "Spring Tests"
      And "Ken Kicker" has beaten "Nat Ninth" 26 to 25 in "ENG v NZ" of "Spring Tests"
      And "Nat Ninth" has beaten "Ken Kicker" 26 to 2 in "ENG v NZ" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "Australia"
      And the second team of the summary ranked is "New Zealand"

    Scenario: Teams with the same tests won, matches won and net games are ranked by net hoops
      Given "Pat Player" has beaten "Kim Keeper" 26 to 25 in "AUS v ENG" of "Spring Tests"
      And "Nat Ninth" has beaten "Ken Kicker" 26 to 2 in "ENG v NZ" of "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "New Zealand"
      And the second team of the summary ranked is "Australia"

    Scenario: Teams alike in everything are ranked in the tournament's order
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "Australia"
      And the second team of the summary ranked is "England"
      And the third team of the summary ranked is "New Zealand"

  Rule: Only a tournament played by teams that a reader is sent to is answered

    Scenario: A Standard tournament is refused
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the summary of the teams of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicTeamSummaryOfTournament.NotPlayedByTeams"

    Scenario: An address no tournament has been found at is refused
      When the summary of the teams of the tournament at "2026/ac/autumn-tests" is asked for
      Then it is refused with "PublicTeamSummaryOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the summary of the teams of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicTeamSummaryOfTournament.NoSuchTournament"
