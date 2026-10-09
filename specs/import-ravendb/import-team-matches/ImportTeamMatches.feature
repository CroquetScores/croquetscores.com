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
  none (`WorldRankingName.feature`).

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
    an error, and is said as accepted, with the tournament it is of
    (`AcceptedImportErrors.feature`).

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

    Scenario: Working a team match's matches out from its games is said as accepted
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
      Then "croquetscores.com/teammatches/50" is accepted as "ImportTeamMatches.ExpectedMatchesWorkedOut"

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
      Then what is accepted of "croquetscores.com/teammatches/50" names "Spring Open - Egypt vs Wales"

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

    Scenario: A team match whose games say no more matches than it was expected to have is not said as accepted
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
      Then nothing is accepted of "croquetscores.com/teammatches/50"

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

    Scenario: Two teams with a short name between them are both brought over
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand A's vs New Zealand B's"
      When the team match is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

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

    Scenario: A player of a team is brought over with no world ranking name
      Given the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "New Zealand vs England"
      And player 7 is in the team match
      And player 7 is called "Sam Someone"
      And player 7 represents "New Zealand"
      When the team match is imported
      Then the player "Sam Someone" of the team "New Zealand" of the tournament kept for "tournaments/13" on "croquetscores.com" has no world ranking name

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

  Rule: A player named as a bye is no player of a team

    The old sites let a team match have a bye, a player called "Bye", or "Bye
    1" and so on, standing in for a player a team did not have. The site
    refuses a team player named as one, as it does a tournament player
    (`ImportTournamentPlayers.feature`), and a test has no place for a bye. So
    a player named as a bye is left out of the teams, and kept as the bye by
    the number the old site gave them in the tournament, as a tournament's
    bye is, so that every team match of the tournament knows them for one. A
    game against a bye is no game that was played, and is left out too, and
    said as accepted (`AcceptedImportErrors.feature`). Neither is an error.

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

    Scenario: A game against a bye left out is said as accepted
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
      Then "game 1" of "croquetscores.com/teammatches/50" is accepted as "ImportCompetition.AgainstABye"

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
