@postgres
Feature: How the teams of a group of a tournament's tests stand, for anybody to read

  A test of a tournament played by teams can be in a group, as "Block A"
  (`TestGroup.feature`), and the tests in the same group are played among
  themselves, as a block of a Standard tournament is: on the old site's
  "WCF GC World Team Championship Tiers 2 & 3" Block A and Block B were each
  six teams playing each other, and then Tier 2 Championship, Tier 2 Shield,
  Tier 3 and a Playoff. Each group has a page of its own (`group.feature`)
  showing how the teams of that group stand, as the old site's did, and the
  application answers it.

  A group is answered as the tournament's summary is answered
  (`PublicTeamSummaryOfTournament.feature`), counting only the group's tests
  in use: its teams are those that play in one of them, in the tournament's
  order, each with the tests, matches, games and hoops it has in the group's
  tests alone, and ranked as the summary ranks them. Whether any of its tests has matches the best of more
  than 1 is asked of the group's tests alone.

  A group is found by its slug, made from its name as a competition's is,
  so that "Block A" is found at "block-a". Tests whose groups make the same
  slug are one group, since they would be found at the same address, and it
  is answered by the name of the first of them in the tournament's order.
  The group is answered with its name and its slug, and its tests in use
  with where each is found, in the tournament's order, for the page to offer.
  A test whose group makes no slug, as "?" makes none, has no page to be
  found at, and is answered as in no group.

  The page is a section of the tournament's, so the tournament is answered
  with it as with its summary: its name, where it is found now, its subtitle,
  its manager notes and commentaries with when each last changed, and its
  tests in use, each with the group it is in, if any, by its name and its
  slug, so that the section bar can offer a group in place of its tests
  (`tournament.feature`).

  A slug no group of the tournament's tests in use makes is refused as
  `PublicGroupOfTournament.NoSuchGroup`. A Standard tournament has no tests,
  and asking for a group of one is refused as
  `PublicGroupOfTournament.NotPlayedByTeams`. An address no tournament of the
  website has been found at, or an archived tournament's, is refused as
  `PublicGroupOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found
  now.

  Nobody need be signed in to ask, and every scenario here asks with nobody
  signed in.

  Where a scenario says nothing else, "Spring Tests" is played by teams, its
  teams "Australia", "AUS", with "Pat Player" and "Pam Partner", "England",
  "ENG", with "Kim Keeper" and "Ken Kicker", and "Scotland", "SCO", with
  "Sam Scott" and "Sue Scott". Its test between Australia and England is in
  the group "Block A", and its test between Australia and Scotland in the
  group "Block B", each expected to have 2 matches, each the best of 1.

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
    And the team is to be known for short as "SCO"
    And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
    And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Sam Scott" to the team "Scotland" of "Spring Tests"
    And "organiser@example.com" has added the player "Sue Scott" to the team "Scotland" of "Spring Tests"
    And the test is to be in the group "Block A"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches
    And the test is to be in the group "Block B"
    And "organiser@example.com" has added the test between "Australia" and "Scotland" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v SCO" of "Spring Tests" 2 expected matches

  Rule: The group is found by its slug, and answered by its name

    Scenario: The group is answered by its name
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the group answered is called "Block A"

    Scenario: The group is answered with its slug
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the group answered is found at "block-a"

    Scenario: Tests whose groups make the same slug are one group
      Given the test is to be in the group "block a"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then 3 teams are answered in the summary

    Scenario: A group whose tests make the same slug is answered by the first one's name
      Given the test is to be in the group "block a"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the group answered is called "Block A"

  Rule: The group's tests in use are answered, with where each is found

    Scenario: A test of the group is answered
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the group's first test answered is found at "2026/ac/spring-tests/tests/aus-v-eng"

    Scenario: A test of another group is not answered among the group's
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then 1 test is answered in the group

    Scenario: An archived test is not answered among the group's
      Given the test is to be in the group "Block A"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has archived the competition "ENG v SCO" in "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then 1 test is answered in the group

  Rule: The group's teams are those that play in its tests

    Scenario: A team of the group's tests is answered
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary known for short as "ENG"

    Scenario: A team in none of the group's tests is not answered
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then 2 teams are answered in the summary

  Rule: Only the group's tests count

    Scenario: A test won in the group counts
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 1 test won

    Scenario: A test won in another group does not count
      Given "Pat Player" has beaten "Sam Scott" 26 to 17 in "AUS v SCO" of "Spring Tests"
      And "Pam Partner" has beaten "Sue Scott" 26 to 17 in "AUS v SCO" of "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 tests won

    Scenario: Games played in another group do not count
      Given "Pat Player" has beaten "Sam Scott" 26 to 17 in "AUS v SCO" of "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "Australia" is answered in the summary with 0 games won

    Scenario: A test in no group does not count
      Given the test is to be in no group
      And "organiser@example.com" has added the test between "England" and "Australia" to "Spring Tests"
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "ENG v AUS" of "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the team "England" is answered in the summary with 0 games won

  Rule: The group's teams are ranked as the summary ranks them

    Scenario: The team with more tests won in the group is ranked first
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the summary ranked is "England"

  Rule: Whether a test has matches the best of more than 1 is asked of the group's tests alone

    Scenario: A test of another group the best of more than 1 is not the group's
      Given "organiser@example.com" has given the test "AUS v SCO" of "Spring Tests" matches each the best of 3
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the summary is answered with no test of matches the best of more than 1

    Scenario: A test of the group the best of more than 1 is the group's
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the summary is answered with a test of matches the best of more than 1

  Rule: The tournament is answered with the group, its tests each with its group

    Scenario: The tournament is answered with the group
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is called "Spring Tests"

    Scenario: A test in a group is answered with its group's name
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the competition "AUS v SCO" is answered in the group "Block B"

    Scenario: A test in a group is answered with its group's slug
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the competition "AUS v SCO" is answered in the group found at "block-b"

    Scenario: A test in no group is answered in none
      Given the test is to be in no group
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the competition "ENG v SCO" is answered in no group

    Scenario: A test whose group makes no slug is answered in none
      Given the test is to be in the group "?"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the competition "ENG v SCO" is answered in no group

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the group "block-a" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is found at "2026/gc/spring-tests"

  Rule: A group there is not, of a tournament there is not, is refused

    Scenario: A slug no group makes is refused
      When the group "block-c" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicGroupOfTournament.NoSuchGroup"

    Scenario: A group whose tests are all archived is refused
      Given the test is to be in the group "Block C"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has archived the competition "ENG v SCO" in "Spring Tests"
      When the group "block-c" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicGroupOfTournament.NoSuchGroup"

    Scenario: A Standard tournament is refused
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the group "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicGroupOfTournament.NotPlayedByTeams"

    Scenario: A tournament there is not is refused
      When the group "block-a" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicGroupOfTournament.NoSuchTournament"
