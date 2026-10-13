@postgres
Feature: Importing the old sites' team matches

  The old sites played a tournament between teams as team matches, each
  named for its two teams, "Australia vs England", and kept no team as a
  thing of its own: a team was a name, and a player was on it by
  representing it. The site keeps teams, their players, and tests between
  two of them (`addTest.feature`). So a team match is brought over as a test,
  and the teams and the players it names are made as they are first met.

  A team is made the first time a team match of its tournament names it, and
  every later team match naming it is played by the same team. Its short
  name, which the site calls its tests by, is what the old sites called it
  where there was little room: a country's three-letter code, or the short
  name of an Australian state. Any other name is its own short name where it
  is short enough, and its first 10 characters where it is not. A team named
  for a country flies that country's flag.

  The site tells a tournament's teams apart by their short names, in any case,
  and two teams of one tournament can have the same first 10 characters, as
  "New Zealand A's" and "New Zealand B's" do. They are two teams, so the
  second made is given a short name of its own: as many of its first
  characters as leave room for a space and a number, and the first number
  from 2 that makes it a short name none of the others has, as "New Zeal 2".

  A player of a team match is a player of the team they represented, made
  the first time a team match of the tournament has them. The old sites
  numbered a tournament's players once for all its team matches, so a player
  with the same number in two of them is the same team player in both.

  A test is brought over a player and a game at a time, as a competition is
  (`importCompetition.feature`), and is created by whoever the tournament
  was created by and when it was. An archived team match is left behind, as
  an archived competition is. Which tournament it is brought over with, and
  where among its competitions, is said with the tournament
  (`ImportWholeTournaments.feature`).

  The old sites kept no world ranking name, so a player is brought over with
  their name as it, as one added with none is (`addTeamPlayer.feature`), and in
  a sport without world rankings their world ranking name is always their
  name.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the team matches are imported
    And a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported

  Rule: A team match becomes a test between its two teams, the first named first

    Scenario: A team match becomes a test
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

    Scenario: The first team named is the test's first team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then the first team of the test kept for "teammatches/50" on "croquetscores.com" is "New Zealand"

    Scenario: The second team named is the test's second team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then the second team of the test kept for "teammatches/50" on "croquetscores.com" is "England"

    Scenario: A team match not named for two teams is refused
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Final"
      When the team match is imported
      Then importing the team match is refused with "ImportTeamMatches.NotTwoTeams"

  Rule: A team match of a tournament not played by teams is left behind where it has no games, and refused where it has

    The old sites let a Standard tournament have a team match. The site keeps
    tests only in a tournament played by teams, so a team match of any other
    tournament is not brought over.
    One with no games has nothing in it to lose, and is left behind without
    an error. One with games is refused, saying which tournament and which
    team match, so that whoever reads it can find both on the old site.

    Scenario: A team match with no games of a tournament not played by teams is not kept
      Given a tournament "tournaments/12" on "croquetscores.com" is imported
      And the team match "teammatches/52" of "tournaments/12" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then "teammatches/52" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a team match with no games of a tournament not played by teams behind is not an error
      Given a tournament "tournaments/12" on "croquetscores.com" is imported
      And the team match "teammatches/52" of "tournaments/12" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/52"

    Scenario: A team match with games of a tournament not played by teams is refused
      Given a tournament "tournaments/12" on "croquetscores.com" is imported
      And the team match "teammatches/52" of "tournaments/12" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then importing the team match is refused with "ImportTeamMatches.NotPlayedByTeams"

    Scenario: The refusal names the tournament and the team match
      Given a tournament "tournaments/12" on "croquetscores.com" is imported
      And the team match "teammatches/52" of "tournaments/12" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then importing the team match is refused saying "croquetscores.com/tournaments/12"
      And importing the team match is refused saying "croquetscores.com/teammatches/52"

  Rule: A team match kept with no list of players or of games has none

    The old site kept some team matches with no list of players and no list
    of games at all, as TeamMatches/28862, Queanbeyan vs Canberra in the
    2022 Blackall Cup, rather than lists that held nothing. Such a team match
    is brought over as one that had no players and no games.

    Scenario: A team match kept with no lists is brought over
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Queanbeyan vs Canberra"
      And it was kept with no list of players or of games
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

    Scenario: Bringing over a team match kept with no lists is not refused
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Queanbeyan vs Canberra"
      And it was kept with no list of players or of games
      When the team match is imported
      Then importing the team match is not refused

  Rule: An archived team match is left behind

    Scenario: An archived team match is not kept as any test
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was archived
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is not kept as any competition

    Scenario: An archived team match makes no team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was archived
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has no teams

    Scenario: Leaving an archived team match behind is not refused
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was archived
      When the team match is imported
      Then importing the team match is not refused

  Rule: A test has the days, the matches, the best-of and the group its team match had

    The old sites kept many team matches as expected to have fewer matches
    than were played in them: 1, whatever was played, or 3 where 6 were, as
    croquetscores.com's TeamMatches/360 was. The site refuses a game that
    would start a match beyond those a test is expected to have
    (`gamesInATest.feature`). So a team match is expected to have as many
    matches as it was kept as expected to have, or as many as its games say
    where they say more: for each two players who met, the games between
    them over its best-of, rounded up, so that a match won two games to one
    is one match. Never fewer than 1. Where its games say more, that is not
    an error, and is said as corrected, with where the team match is on the
    new site and the old, in a file of corrections of its own, written as the
    accepted import errors are (`AcceptedImportErrors.feature`), and not
    among them.

    Scenario: A test starts on the day its team match started
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match started on "2014-03-01T00:00:00.0000000"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" starts on "2014-03-01"

    Scenario: A test finishes on the day its team match finished
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match finished on "2014-03-02T00:00:00.0000000"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" finishes on "2014-03-02"

    Scenario: A test is expected to have the matches its team match was
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match was expected to have 6 matches
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 6 matches

    Scenario: A team match expected to have 1 match is expected to have one a pair of players, in single games
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 1 match
      And player 1 is in the team match
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 represents "England"
      And player 3 is in the team match
      And player 3 represents "New Zealand"
      And player 4 is in the team match
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 4
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 3 matches

    Scenario: A team match expected to have 1 match is expected to have one a pair of players, whatever they played of their best-of
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 1 match
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 represents "England"
      And player 3 is in the team match
      And player 3 represents "New Zealand"
      And player 4 is in the team match
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 2
      And game 3 was won by player 3
      And game 3 was lost by player 4
      And game 4 was won by player 4
      And game 4 was lost by player 3
      And game 5 was won by player 3
      And game 5 was lost by player 4
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 2 matches

    Scenario: Two players who played more games than their best-of played as many matches as it takes
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 1 match
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 2
      And game 3 was won by player 2
      And game 3 was lost by player 1
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 2 matches

    Scenario: A team match expected to have 1 match with no games is expected to have 1
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 1 match
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 1 match

    Scenario: A team match whose games say more matches than it was expected to have is expected to have as many as they say
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Egypt vs Wales"
      And the team match was expected to have 3 matches
      And player 1 is in the team match
      And player 1 represents "Egypt"
      And player 2 is in the team match
      And player 2 represents "Wales"
      And player 3 is in the team match
      And player 3 represents "Egypt"
      And player 4 is in the team match
      And player 4 represents "Wales"
      And player 5 is in the team match
      And player 5 represents "Egypt"
      And player 6 is in the team match
      And player 6 represents "Wales"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 5
      And game 3 was lost by player 6
      And game 4 was won by player 1
      And game 4 was lost by player 4
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 4 matches

    Scenario: Working a team match's matches out from its games is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Egypt vs Wales"
      And the team match was expected to have 3 matches
      And player 1 is in the team match
      And player 1 represents "Egypt"
      And player 2 is in the team match
      And player 2 represents "Wales"
      And player 3 is in the team match
      And player 3 represents "Egypt"
      And player 4 is in the team match
      And player 4 represents "Wales"
      And player 5 is in the team match
      And player 5 represents "Egypt"
      And player 6 is in the team match
      And player 6 represents "Wales"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 5
      And game 3 was lost by player 6
      And game 4 was won by player 1
      And game 4 was lost by player 4
      When the team match is imported
      Then "croquetscores.com/teammatches/50" is corrected as "ImportTeamMatches.ExpectedMatchesWorkedOut"

    Scenario: Working a team match's matches out from its games is not said as accepted
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Egypt vs Wales"
      And the team match was expected to have 3 matches
      And player 1 is in the team match
      And player 1 represents "Egypt"
      And player 2 is in the team match
      And player 2 represents "Wales"
      And player 3 is in the team match
      And player 3 represents "Egypt"
      And player 4 is in the team match
      And player 4 represents "Wales"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 4
      And game 4 was won by player 3
      And game 4 was lost by player 2
      When the team match is imported
      Then nothing is accepted of "croquetscores.com/teammatches/50"

    Scenario: Working a team match's matches out from its games is said for a person, naming the team match
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Egypt vs Wales"
      And the team match was expected to have 3 matches
      And player 1 is in the team match
      And player 1 represents "Egypt"
      And player 2 is in the team match
      And player 2 represents "Wales"
      And player 3 is in the team match
      And player 3 represents "Egypt"
      And player 4 is in the team match
      And player 4 represents "Wales"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 4
      And game 4 was won by player 3
      And game 4 was lost by player 2
      When the team match is imported
      Then what is corrected of "croquetscores.com/teammatches/50" names "Spring Open - Egypt vs Wales"

    Scenario: A team match expected to have more than 1 match keeps it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 6 matches
      And player 1 is in the team match
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 represents "England"
      And player 3 is in the team match
      And player 3 represents "New Zealand"
      And player 4 is in the team match
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is expected to have 6 matches

    Scenario: A team match whose games say no more matches than it was expected to have is not said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match was expected to have 6 matches
      And player 1 is in the team match
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the team match is imported
      Then nothing is corrected of "croquetscores.com/teammatches/50"

    Scenario: A test's matches are the best of what its team match's were
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match's matches were the best of 3
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is the best of 3

    Scenario: A team match whose matches were the best of 0 is the best of 1
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match's matches were the best of 0
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is the best of 1

    Scenario: A test is in the group its team match was in
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match was in the group "Block A"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is in the group "Block A"

    Scenario: A test whose team match was in no group is in none
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match was in no group
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" is in no group

  Rule: A team is made the first time it is named, and is the same team after

    Scenario: A team named is a team of the tournament
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has the team "New Zealand"

    Scenario: A team named again is the team already made
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match is imported
      And the team match "teammatches/53" of "tournaments/13" on "croquetscores.com"
      And the team match is called "England vs Australia"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has 3 teams

    Scenario: A team of the same name in another tournament is another team
      Given a tournament "tournaments/14" on "croquetscores.com" of the type "teams" is imported
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match is imported
      And the team match "teammatches/54" of "tournaments/14" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      When the team match is imported
      Then the tournament kept for "tournaments/14" on "croquetscores.com" has 2 teams

  Rule: A team named by an Australian state's short name is called by the state's whole name

    The old sites' interstate team events often named a team by its state's
    short name alone, as "NSW vs QLD". The site has a short name for that,
    and a team's name is what it is called in full, so the state's whole name
    is its name and the short name stays its short name.

    Scenario Outline: A team named by a state's short name is called by its whole name
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "<short name> vs Other"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has the team "<team>"

      Examples:
        | short name | team              |
        | QLD        | Queensland        |
        | NSW        | New South Wales   |
        | VIC        | Victoria          |
        | TAS        | Tasmania          |
        | SA         | South Australia   |
        | WA         | Western Australia |

    Scenario: A team named by a state's short name keeps it as its short name
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "NSW vs QLD"
      When the team match is imported
      Then the team "New South Wales" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "NSW"

    Scenario: A state named both ways is one team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "NSW vs QLD"
      And the team match is imported
      And the team match "teammatches/53" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New South Wales vs Victoria"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has 3 teams

  Rule: A team's short name is what the old sites called it where there was little room

    A short name another team of the tournament has is numbered apart from
    it, within a short name's 10 characters, or within the team's name where
    that is shorter, since the site refuses a short name longer than its
    name: "Newcastle", beside "Newcastle NPCC" cut to "Newcastle", is
    "Newcast 2", and not "Newcastl 2".

    Scenario Outline: A team is given a short name
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "<team> vs Other"
      When the team match is imported
      Then the team "<team>" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "<short name>"

      Examples:
        | team                     | short name |
        | New Zealand              | NZL        |
        | Australia                | AUS        |
        | England                  | ENG        |
        | New South Wales          | NSW        |
        | Queensland               | QLD        |
        | Canterbury               | Canterbury |
        | Canterbury Croquet Club  | Canterbury |

    Scenario: A team named for a country flies its flag
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Canterbury"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" flies the flag "nz"

    Scenario: A team not named for a country flies no flag
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Canterbury"
      When the team match is imported
      Then the team "Canterbury" of the tournament kept for "tournaments/13" on "croquetscores.com" flies no flag

    Scenario: A short name another team has is numbered apart from it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand B's"
      When the team match is imported
      Then the team "New Zealand B's" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "New Zeal 2"

    Scenario: The first team with a short name keeps it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand B's"
      When the team match is imported
      Then the team "New Zealand A's" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "New Zealan"

    Scenario: A short name the same in another case is numbered apart
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Canterbury vs CANTERBURY Cougars"
      When the team match is imported
      Then the team "CANTERBURY Cougars" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "CANTERBU 2"

    Scenario: A third team with a short name is numbered past the second
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand B's"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand C's"
      When the team match is imported
      Then the team "New Zealand C's" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "New Zeal 3"

    Scenario: A short name numbered apart is no longer than the team's name
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Newcastle NPCC vs Newcastle"
      When the team match is imported
      Then the team "Newcastle" of the tournament kept for "tournaments/13" on "croquetscores.com" has the short name "Newcast 2"

    Scenario: A team whose short name would be longer than its name is brought over
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Newcastle NPCC vs Newcastle"
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

    Scenario: Two teams with a short name between them are both brought over
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand B's"
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

  Rule: A match's games are added so that none comes after the match was decided

    A pair's match of the best of 3 is decided by the second win, and the site
    refuses a game after it (`addGame.feature`). A match was sometimes entered
    out of order: a player won two games, and the game the other player won
    was entered, after, as the third, when it was the second played. So
    before any game of a match is added, each pair's games are tested in the
    order they are to be added in: where the third would come after the first
    two decided the match, and the second and third the other way round would
    all be accepted, they are added the other way round. That is said as
    corrected (`AcceptedImportErrors.feature`).

    Nadine El Manoufy & Mostafa Eissa beat Ghada Karam & Shukry Aziz 7 to 4
    and 7 to 5, and lost to them 4 to 7 in the game entered third, which was
    the second played.

    Scenario: The third game of a match already decided is added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 7 is in the team match
      And player 7 is called "Nadine El Manoufy & Mostafa Eissa"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ghada Karam & Shukry Aziz"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "7"
      And game 1 was lost by player 8
      And game 1's loser scored "4"
      And game 2 was won by player 7
      And game 2's winner scored "7"
      And game 2 was lost by player 8
      And game 2's loser scored "5"
      And game 3 was won by player 8
      And game 3's winner scored "7"
      And game 3 was lost by player 7
      And game 3's loser scored "4"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 3 games

    Scenario: The game the other pair won is added second
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 7 is in the team match
      And player 7 is called "Nadine El Manoufy & Mostafa Eissa"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ghada Karam & Shukry Aziz"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "7"
      And game 1 was lost by player 8
      And game 1's loser scored "4"
      And game 2 was won by player 7
      And game 2's winner scored "7"
      And game 2 was lost by player 8
      And game 2's loser scored "5"
      And game 3 was won by player 8
      And game 3's winner scored "7"
      And game 3 was lost by player 7
      And game 3's loser scored "4"
      When the team match is imported
      Then the second game of the test kept for "teammatches/50" on "croquetscores.com" was won by "Ghada Karam & Shukry Aziz"

    Scenario: The game added the other way round is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 7 is in the team match
      And player 7 is called "Nadine El Manoufy & Mostafa Eissa"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ghada Karam & Shukry Aziz"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "7"
      And game 1 was lost by player 8
      And game 1's loser scored "4"
      And game 2 was won by player 7
      And game 2's winner scored "7"
      And game 2 was lost by player 8
      And game 2's loser scored "5"
      And game 3 was won by player 8
      And game 3's winner scored "7"
      And game 3 was lost by player 7
      And game 3's loser scored "4"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: The game added the other way round is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 7 is in the team match
      And player 7 is called "Nadine El Manoufy & Mostafa Eissa"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ghada Karam & Shukry Aziz"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "7"
      And game 1 was lost by player 8
      And game 1's loser scored "4"
      And game 2 was won by player 7
      And game 2's winner scored "7"
      And game 2 was lost by player 8
      And game 2's loser scored "5"
      And game 3 was won by player 8
      And game 3's winner scored "7"
      And game 3 was lost by player 7
      And game 3's loser scored "4"
      When the team match is imported
      Then "games 2 and 3" of "croquetscores.com/teammatches/50" is corrected as "ImportTeamMatches.SecondAndThirdReversed"

  Rule: A player representing a team that is not in the match is of the team opposite their opponent's

    A player's team was sometimes written wrong, as a team that is neither of
    the match's two. A game is between a player of each team
    (`addGame.feature`), so before the games are added, a player who
    represents neither team and played a player who represents one of them is
    of the other team: the one opposite their opponent's. Where their
    opponent was put right the same way, so is a player who played them. A
    player who played nobody of either team, or only players of neither, is
    refused as they were. That is said as corrected
    (`AcceptedImportErrors.feature`).

    Ann Able represents New Zealand, and Ben Baker represents Australia, which
    is not in the match, and played her.

    Scenario: A player representing neither team is of the team opposite their opponent's
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Australia"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the team "England" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Ben Baker"

    Scenario: A player put right is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Australia"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: The game of a player put right is added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Australia"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 1 game

    Scenario: A player put right is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Australia"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then "player 8" of "croquetscores.com/teammatches/50" is corrected as "ImportTeamMatches.TeamCorrected"

    Scenario: A player who played a player put right is put right too
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Australia"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "Wales"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      And game 2 was won by player 8
      And game 2 was lost by player 9
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Cat Cole"

    Scenario: Two players who represent neither team are kept as errors
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "Wales"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "player 7"

  Rule: A player who cannot be entered is said in the note of the tournament too

    A player the site cannot enter, as one recorded as representing a team
    that is not in the match, whose games say nothing of which team they were
    on, is said in the note Import Errors of the tournament as the games are
    (the rule above), with the team or club they represented and why, and is
    not kept as an error. That is said as corrected
    (`AcceptedImportErrors.feature`). Where no user was brought over as
    croquetscores@gmail.com, it is kept as an error as it always was.

    Scenario: A player who cannot be entered is said in the note
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Australia"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "Sam Someone (Australia) was not entered because they were recorded as representing a team that is not in the match."

    Scenario: A player who cannot be entered is no error
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Australia"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A player who cannot be entered is said as corrected
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Australia"
      When the team match is imported
      Then "player 7" of "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.PlayerNoted"

    Scenario: The note says which team match the player was in
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Australia"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "### New Zealand vs England"

  Rule: A game against a player already played is a game against the one not played

    The old sites kept many team matches whose two players met again in a
    match of single games, which the site refuses, since a test's two
    players meet in one match (`gamesInATest.feature`). Most were a game
    entered against the wrong player: the one already played, in place of
    the one who was not. So a game of a team match of single games refused
    because its two players already met is a game against whoever on the
    other team one of them has not played in the team match, of the same
    kind, single or pair, where there is one only, and the site then takes
    it. A pair is a player whose name has ",", "/", "&" or "and" in it. That
    is said as corrected (`AcceptedImportErrors.feature`). Where there is no
    one, or more than one, the two met again, and the next rule says what
    becomes of the game. Where the game has the very scores of one the two
    already played, which is the same game entered twice, it is left out, as
    every competition leaves one out (`importCompetition.feature`), and the
    other rules here do not apply to it. Where the team match's matches are
    the best of more than 1, it is refused as it always was.

    Ann Able beats Cat Cole, and Ben Baker beats Dan Dunn and Cat Cole, all
    of England. Ann then beats Cat again, but Ann has not played Dan, so
    that game was Ann against Dan.

    Scenario: A game against a player already played is a game against the one not played
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 4 games

    Scenario: A game against a player already played, put right, is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game against a player already played, put right, is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then "game 4" of "croquetscores.com/teammatches/50" is corrected as "ImportTeamMatches.OpponentCorrected"

    Scenario: A game against a player already played is said as corrected, naming the player not played
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then what is corrected of "croquetscores.com/teammatches/50" names "Dan Dunn"

    Scenario: A game with more than one player not played is a meeting again
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And player 5 is in the team match
      And player 5 is called "Eve East"
      And player 5 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then the team "England" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Cat Cole - meet again"

    Scenario: A single is not taken for a pair not played, and meets again
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And player 4 is called "Dan Dunn & Fay Ford"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      When the team match is imported
      Then the team "England" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Cat Cole - meet again"

    Scenario: A game with the very scores of one already played is left out
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "5"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game with the very scores of one already played is said as corrected, not put against another player
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "5"
      When the team match is imported
      Then "game 4" of "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.DuplicateGame"

    Scenario: A game of a team match whose matches are the best of more than 1 is still refused
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 2 is in the team match
      And player 2 is called "Ben Baker"
      And player 2 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And player 4 is in the team match
      And player 4 is called "Dan Dunn"
      And player 4 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 2
      And game 2 was lost by player 4
      And game 2's loser scored "4"
      And game 3 was won by player 2
      And game 3 was lost by player 3
      And game 3's loser scored "6"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "2"
      And game 5 was won by player 1
      And game 5 was lost by player 3
      And game 5's loser scored "1"
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "Competition.MatchDecided"

  Rule: Two players who met again play the second time against a player made for it

    Many team matches had the same two players meet again once their match
    was decided, as a team match played through twice, which the site
    refuses, since a test's two players meet in one match. Where the game
    is not one entered against the wrong player (the rule before), nor the
    very scores of another, and the two played more games than one match of
    the team match's best-of holds, the loser of the game is played by a
    player made for it on their team, called by their name and " - meet
    again", the first time one is needed, and the game is added between the
    winner and that player. That is said as corrected
    (`AcceptedImportErrors.feature`). The games of the same meeting again,
    in a match of more than one game, are all against that player, whoever
    won them. Two players who met a third time play it against another,
    numbered apart, as "Ann Able - meet again (2)".

    Scenario: A game of two players who met again is added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 1
      And game 2's loser scored "4"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 2 games

    Scenario: The loser of a game of two players who met again is a player made for it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 1
      And game 2's loser scored "4"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Ann Able - meet again"

    Scenario: A game of two players who met again is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 1
      And game 2's loser scored "4"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game of two players who met again is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 1
      And game 2's loser scored "4"
      When the team match is imported
      Then "game 2" of "croquetscores.com/teammatches/50" is corrected as "ImportTeamMatches.MeetAgain"

    Scenario: Two players who met a third time play it against another player made for it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 1
      And game 2's loser scored "4"
      And game 3 was won by player 3
      And game 3 was lost by player 1
      And game 3's loser scored "3"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Ann Able - meet again (2)"

    Scenario: The games of a meeting again in a match of more than one game are all against one player made for it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 2
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 1
      And game 2 was lost by player 3
      And game 2's loser scored "4"
      And game 3 was won by player 3
      And game 3 was lost by player 1
      And game 3's loser scored "3"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "6"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has 2 players

    Scenario: Every game of a meeting again in a match of more than one game is added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 is called "Ann Able"
      And player 1 represents "New Zealand"
      And player 3 is in the team match
      And player 3 is called "Cat Cole"
      And player 3 represents "England"
      And game 1 was won by player 1
      And game 1 was lost by player 3
      And game 1's loser scored "5"
      And game 2 was won by player 1
      And game 2 was lost by player 3
      And game 2's loser scored "4"
      And game 3 was won by player 3
      And game 3 was lost by player 1
      And game 3's loser scored "3"
      And game 4 was won by player 1
      And game 4 was lost by player 3
      And game 4's loser scored "6"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 4 games

  Rule: The games of a team match the import names are added in the order it names

    Some team matches had their games entered out of the order they were
    played, so that a match the site would find decided had a game still to
    come. Where it is known what order they were played in, the import names
    the team match and the order: croquetscores.com's TeamMatches/359,
    Germany vs Belgium at the 2012 GC World Team Championship, where Bruno
    Hess beat Charles-Eric Vilain 7-4, lost 3-7, and won 7-5, entered as
    games 6, 17 and 10 were played. The games named take the places they had
    between them, and every other game keeps its own. That is not an error,
    and is said as corrected (`AcceptedImportErrors.feature`).

    Scenario: The games of a team match the import names are all added
      Given the team match "TeamMatches/359" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Germany vs Belgium"
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 is called "Bruno Hess"
      And player 1 represents "Germany"
      And player 2 is in the team match
      And player 2 is called "Charles-Eric Vilain"
      And player 2 represents "Belgium"
      And game 6 was won by player 1
      And game 6's winner scored "7"
      And game 6 was lost by player 2
      And game 6's loser scored "4"
      And game 10 was won by player 1
      And game 10's winner scored "7"
      And game 10 was lost by player 2
      And game 10's loser scored "5"
      And game 17 was won by player 2
      And game 17's winner scored "7"
      And game 17 was lost by player 1
      And game 17's loser scored "3"
      When the team match is imported
      Then the test kept for "TeamMatches/359" on "croquetscores.com" has 3 games

    Scenario: Adding the games of a team match the import names in its order is not an error
      Given the team match "TeamMatches/359" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Germany vs Belgium"
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 is called "Bruno Hess"
      And player 1 represents "Germany"
      And player 2 is in the team match
      And player 2 is called "Charles-Eric Vilain"
      And player 2 represents "Belgium"
      And game 6 was won by player 1
      And game 6's winner scored "7"
      And game 6 was lost by player 2
      And game 6's loser scored "4"
      And game 10 was won by player 1
      And game 10's winner scored "7"
      And game 10 was lost by player 2
      And game 10's loser scored "5"
      And game 17 was won by player 2
      And game 17's winner scored "7"
      And game 17 was lost by player 1
      And game 17's loser scored "3"
      When the team match is imported
      Then no error is kept for "croquetscores.com/TeamMatches/359"

    Scenario: Adding the games of a team match the import names in its order is said as corrected
      Given the team match "TeamMatches/359" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Germany vs Belgium"
      And the team match's matches were the best of 3
      And player 1 is in the team match
      And player 1 is called "Bruno Hess"
      And player 1 represents "Germany"
      And player 2 is in the team match
      And player 2 is called "Charles-Eric Vilain"
      And player 2 represents "Belgium"
      And game 6 was won by player 1
      And game 6's winner scored "7"
      And game 6 was lost by player 2
      And game 6's loser scored "4"
      And game 10 was won by player 1
      And game 10's winner scored "7"
      And game 10 was lost by player 2
      And game 10's loser scored "5"
      And game 17 was won by player 2
      And game 17's winner scored "7"
      And game 17 was lost by player 1
      And game 17's loser scored "3"
      When the team match is imported
      Then "croquetscores.com/TeamMatches/359" is corrected as "ImportTeamMatches.GamesReordered"

  Rule: A player is a player of the team they represented

    Some managers named a team match's teams with what group they were in, in
    brackets after the team's name, as "Real Club Puerta de Hierro (Group A)",
    and their players as representing the team by its name alone. A player
    representing what a team is named before the brackets is a player of it.

    Scenario: A player representing a team is a player of it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player of a team with no world ranking name is brought over with their name as it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the player "Sam Someone" of the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A player of a team in American 6 Wicket is brought over with their name as their world ranking name
      Given a tournament "tournaments/14" on "croquetscores.com" of the type "teams" and the sport "a6w" is imported
      And the team match "teammatches/51" of "tournaments/14" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the player "Sam Someone" of the team "New Zealand" of the tournament kept for "tournaments/14" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A player representing neither team is kept as an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Australia"
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "player 7"

    Scenario: A player representing a team named with its group in brackets is a player of it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Club One (Group A) vs Club Two (Group A)"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Club One"
      When the team match is imported
      Then the team "Club One (Group A)" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player representing a team named with its group in brackets is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Club One (Group A) vs Club Two (Group A)"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Club One"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A player representing only what is in a team's brackets is kept as an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Club One (Group A) vs Club Two (Group A)"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "Group A"
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "player 7"

    Scenario: A player in two team matches is one player of the team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/53" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has 1 player

    Scenario: A name shorter than 3 characters says it was imported
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Al"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Al - Imported"

    Scenario: The second player of a name in a team is numbered
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Sam Someone"
      And player 8 represents "New Zealand"
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Sam Someone (2)"

  Rule: A number the old site gave another player of the same team is not taken for theirs

    The old sites also gave a number to two people of the one team, in
    different team matches of a tournament: in TeamMatches/28995 of the 2022
    Brisbane Metropolitan Pennants, number 72 was Cecilia Hains of Wynnum in
    one, and Roy Machen & Trevor O'Hara, also of Wynnum, in another. Taken
    for the same player, the games of the second were played by the first,
    and met games they had already played, and were refused. So a number
    found again as a player of the same team, whose name is not the name the
    player has here, is not taken for theirs: they are the player of that
    name in the team, made the first time. Where the name is the same, in
    any case and with any spaces, they are the same player. In the old
    sites' data every such number was another person, and none a name spelled
    another way.

    Ann Able played for New Zealand as number 9, and in the next team match
    number 9 is Ben Baker, also of New Zealand.

    Scenario: A player whose number another player of their team had is a player of their own
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "Australia"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Ben Baker"

    Scenario: The first player of the number keeps it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "Australia"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has 2 players

    Scenario: The game of a player whose number another player of their team had is theirs
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "Australia"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the first game of the test kept for "teammatches/51" on "croquetscores.com" was won by "Ben Baker"

    Scenario: A number with the same name in another case is the same player
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 9 is in the team match
      And player 9 is called "ann  ABLE"
      And player 9 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "Australia"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has 1 player

  Rule: A number the old site gave a player of another team is not taken for theirs

    A player is found again by the number the old site gave them in the
    tournament, so that a player in two team matches is one player. But the
    old site sometimes gave a number to two people, of two teams: in
    TeamMatches/28518 of the 2021 Egypt League, number 9 was Hanan Bendary &
    Hussin Bedir of Gzera Club, where every other team match had it as Ahmed
    Hany of ElRwad Club. So a number found again as a player of another team
    than the one the player represents here is not taken for theirs: they
    are the player of the same name in the team they represent, made the
    first time, and their games are theirs.

    Ann Able played for New Zealand as number 9, and Ben Baker, also number
    9, plays for Australia, and beats Cat Cole of England.

    Scenario: A player whose number another team's player had is a player of their own team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "England"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the team "Australia" of the tournament kept for "tournaments/13" on "croquetscores.com" has the player "Ben Baker"

    Scenario: The games of a player whose number another team's player had are added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "England"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then the test kept for "teammatches/51" on "croquetscores.com" has 1 game

    Scenario: A player whose number another team's player had is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "England"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/51"

    Scenario: The player whose number it was keeps it
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "England"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      When the team match is imported
      Then player 9 of "tournaments/13" on "croquetscores.com" is kept as a player of "New Zealand"

    Scenario: A player whose number another team's player had, named again, is the one player
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 9 is in the team match
      And player 9 is called "Ann Able"
      And player 9 represents "New Zealand"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      And player 8 is in the team match
      And player 8 is called "Cat Cole"
      And player 8 represents "England"
      And game 1 was won by player 9
      And game 1 was lost by player 8
      And the team match is imported
      And the team match "teammatches/52" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And player 9 is in the team match
      And player 9 is called "Ben Baker"
      And player 9 represents "Australia"
      When the team match is imported
      Then the team "Australia" of the tournament kept for "tournaments/13" on "croquetscores.com" has 1 player

  Rule: A game of a team match is won by whoever scored more

    Scenario: A game of a team match whose winner scored fewer points is won by whoever scored more
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Alex Other"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "3"
      And game 1 was lost by player 8
      And game 1's loser scored "26"
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 1 game

    Scenario: A game of a team match whose winner scored fewer points is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "3"
      And game 1 was lost by player 8
      And game 1's loser scored "26"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game of a team match whose winner scored fewer points is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "3"
      And game 1 was lost by player 8
      And game 1's loser scored "26"
      When the team match is imported
      Then "game 1" of "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.WinnerFromScore"

  Rule: A player named as a bye is no player of a team

    The old sites let a team match have a bye, a player called "Bye", or "Bye
    1" and so on, standing in for a player a team did not have. The site
    refuses a team player named as one, as it does a tournament player
    (`ImportTournamentPlayers.feature`), and a test has no place for a bye. So
    a player named as a bye is left out of the teams, and kept as the bye by
    the number the old site gave them in the tournament, as a tournament's
    bye is, so that every team match of the tournament knows them for one. A
    game against a bye is no game that was played, and is left out too, and
    said as corrected (`AcceptedImportErrors.feature`). Neither is an error.

    Scenario: A player named as a bye is not a player of the team
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Bye 1"
      And player 8 represents "England"
      When the team match is imported
      Then the team "England" of the tournament kept for "tournaments/13" on "croquetscores.com" has 0 players

    Scenario: A player named as a bye is kept as the bye
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Bye 1"
      And player 8 represents "England"
      When the team match is imported
      Then player 8 of "tournaments/13" on "croquetscores.com" is kept as the bye

    Scenario: A game against a bye is not a game of the test
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Bye 1"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 0 games

    Scenario: Leaving a bye and its game out is not an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Bye 1"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game against a bye left out is said as corrected
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Bye 1"
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then "game 1" of "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.AgainstABye"

  Rule: A test's games are between the players of its teams

    Scenario: A game becomes a game of the test
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 1 game

    Scenario: A game between two players of one team is kept as an error
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "Competition.SameTeam"

    Scenario: A game refused is said for a person, naming the team match it was in
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the summary kept for "croquetscores.com/teammatches/50" names "Spring Open - New Zealand vs England"

    Scenario: A game refused is kept at the test's page on the site and the team match's on the old site
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And its slug on the old site was "new-zealand-vs-england"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" is at "2014/ac/spring-open-13/tests/nzl-v-eng" on the new site and "2014/ac/spring-open-13/competition/new-zealand-vs-england" on the old site

    Scenario: The games after one refused are added
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1 was lost by player 8
      And game 2 was won by player 9
      And game 2 was lost by player 7
      When the team match is imported
      Then the test kept for "teammatches/50" on "croquetscores.com" has 1 game

  Rule: A game between players of one team is said in a note of the tournament

    A test is between a player of each of its teams (`addGame.feature`), and
    the old sites let a scorer enter a game between two players of one team.
    Such a game cannot be brought over, so it is said in a note of the
    tournament's, called Import Errors, which croquetscores@gmail.com writes
    and is made a manager to write: what could not be brought over, then a
    section for each team match, headed by its name, with a line for each
    game, the winner, the loser and each one's team and score. There is one
    note for the tournament, and each team match with such a game adds its
    section, and why it could not be added. That is said as corrected
    (`AcceptedImportErrors.feature`), and is not an error. Where no user was
    brought over as croquetscores@gmail.com, it is kept as an error as it
    always was. Any other game the site refuses is said the same way
    (`importCompetition.feature`).

    Scenario: The tournament has a note called Import Errors
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has a note called "Import Errors"

    Scenario: The note says what could not be brought over
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "The following games could not be added to the new version of Croquet Scores"

    Scenario: The note has a section for the team match
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "### New Zealand vs England"

    Scenario: The note says the game, with each player's team and score
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "Ann Able (New Zealand) 26 beat Ben Baker (New Zealand) 3"

    Scenario: The writer of notes is made a manager of the tournament
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is managed by the account for "croquetscores@gmail.com"

    Scenario: The note is said as corrected for the team match
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.ImportErrorsNoted"

    Scenario: A game said in a note is not an error
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then no error is kept for "croquetscores.com/teammatches/50"

    Scenario: A game said in a note is said as corrected
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then "game 1" of "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.GameNoted"

    Scenario: A game of players of different teams is not in the note
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      And game 2 was won by player 9
      And game 2's winner scored "26"
      And game 2 was lost by player 7
      And game 2's loser scored "1"
      And game 3 was won by player 8
      And game 3's winner scored "21"
      And game 3 was lost by player 7
      And game 3's loser scored "20"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" does not say "Cat Cole (England) 26 beat Ann Able (New Zealand) 1"

    Scenario: The note says each game of a team match
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      And game 2 was won by player 9
      And game 2's winner scored "26"
      And game 2 was lost by player 7
      And game 2's loser scored "1"
      And game 3 was won by player 8
      And game 3's winner scored "21"
      And game 3 was lost by player 7
      And game 3's loser scored "20"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "Ben Baker (New Zealand) 21 beat Ann Able (New Zealand) 20"

    Scenario: A team match with no such game adds no note
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 9
      And game 1's loser scored "3"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has no note

    Scenario: A second team match adds its section to the same note
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 8
      And game 1's winner scored "26"
      And game 1 was lost by player 7
      And game 1's loser scored "10"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "### New Zealand vs Australia"

    Scenario: A second team match leaves the section of the first
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 8
      And game 1's winner scored "26"
      And game 1 was lost by player 7
      And game 1's loser scored "10"
      When the team match is imported
      Then the note called "Import Errors" of the tournament kept for "tournaments/13" on "croquetscores.com" says "### New Zealand vs England"

    Scenario: A second team match makes no second note
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      And the team match is imported
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs Australia"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And game 1 was won by player 8
      And game 1's winner scored "26"
      And game 1 was lost by player 7
      And game 1's loser scored "10"
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has 1 note

    Scenario: A game between players of one team is kept as an error where nobody writes notes
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And player 8 is in the team match
      And player 8 is called "Ben Baker"
      And player 8 represents "New Zealand"
      And player 9 is in the team match
      And player 9 is called "Cat Cole"
      And player 9 represents "England"
      And game 1 was won by player 7
      And game 1's winner scored "26"
      And game 1 was lost by player 8
      And game 1's loser scored "3"
      When the team match is imported
      Then the error kept for "croquetscores.com/teammatches/50" says "Competition.SameTeam"

  Rule: A tournament where a game of a team match could not be added is managed by whoever reads what could not be brought over

    As for any competition (`importCompetition.feature`): after everything
    else is tried, a game the site still refuses, as one of a player the team
    match does not list, makes croquetscores@gmail.com a manager of the
    tournament, and is said in the note, as a game between players of one
    team is (the rule above).

    Scenario: A tournament where a game of a team match could not be added is managed by croquetscores@gmail.com
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And game 1 was won by player 7
      And game 1 was lost by player 99
      When the team match is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is managed by the account for "croquetscores@gmail.com"

    Scenario: A team match where a game could not be added is said as corrected for the manager
      Given a user "users/90" on "croquetscores.com" is imported as "croquetscores@gmail.com"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Ann Able"
      And player 7 represents "New Zealand"
      And game 1 was won by player 7
      And game 1 was lost by player 99
      When the team match is imported
      Then "croquetscores.com/teammatches/50" is corrected as "ImportCompetition.ImportErrorsNoted"
