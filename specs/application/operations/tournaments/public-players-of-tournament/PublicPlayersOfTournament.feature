@postgres
Feature: The players of a tournament, for anybody to read

  A tournament's players' page lists its players, each leading to their own
  page (`players.feature`). The application answers them: every player of the
  tournament who is not archived, in alphabetical order of their names, so
  that a reader can find one by name, each with their name, what they
  represent and the flag they fly where they have either, and where their own
  page is found, which is the tournament's address followed by "players" and
  the player's slug (`addPlayer.feature`). An archived player is set aside,
  and is not one a reader is sent to.

  The page is a section of the tournament's, so the tournament is answered
  with it as its games are (`GamesOfTournament.feature`): its name, where it
  is found now, and its competitions in use with where each is found, which
  is what the page's section bar leads to.

  A tournament played by teams has no players of its own, only its teams'
  (`addPlayer.feature`), so its players are answered team by team instead:
  each of its teams not archived, in the tournament's order of its teams, by
  its name, with each of its players not archived, in alphabetical order of
  their names, by their name and where their own page is found, which is the
  tournament's address followed by "players" and the player's slug
  (`addTeamPlayer.feature`), as a tournament's own player's is. Such a
  tournament is answered as played by teams, and with no players of its own.

  An address no tournament of the website has been found at, or whose
  tournament is archived, is refused as
  `PublicPlayersOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found
  now.

  A tournament's players are for anybody, so nobody need be signed in to ask,
  and every scenario here asks with nobody signed in. They are asked for by
  the tournament's address on the website being read, as a reader's browser
  names it.

  The tournament's notes are answered with it, in Markdown as they are kept
  (`TournamentNotes.feature`), since every page of a tournament shows them
  beneath its name in the header (`layout.feature`). A tournament with no
  notes is answered with none.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every player not archived is answered, in alphabetical order

    Scenario: A player is answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the first player answered is "Sam Someone"

    Scenario: The players are answered in alphabetical order of their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "chris Third" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the first player answered is "Alex Another"
      And the second player answered is "chris Third"
      And the third player answered is "Sam Someone"

    Scenario: An archived player is not answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then 0 players are answered

    Scenario: A player restored is answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the first player answered is "Sam Someone"

    Scenario: A tournament with no players answers none
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then 0 players are answered

  Rule: Each player is answered with what a reader is shown of them

    Scenario: A player is answered by the name the tournament calls them now
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the first player answered is "Samantha Someone"

    Scenario: A player is answered with what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the player "Sam Someone" is answered representing "Canterbury Croquet Club"

    Scenario: A player is answered with the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the player "Sam Someone" is answered flying the flag "nz"

    Scenario: A player is answered with where their page is found
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the player "Sam Someone" is answered as found at "2026/ac/spring-open/players/sam-someone"

    Scenario: A player renamed is still found where they were
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the player "Samantha Someone" is answered as found at "2026/ac/spring-open/players/sam-someone"

  Rule: The tournament is answered as its page's section bar shows it

    Scenario: The tournament's name is answered
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's notes are answered
      Given the tournament "Spring Open" has the notes "Lunch is at **noon**"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered has the notes "Lunch is at **noon**"

    Scenario: A tournament with no notes is answered with none
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered has no notes

    Scenario: A competition is answered with where it is found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the competition "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/gc/spring-open"

    Scenario: A player of a tournament found at its old address is found at its address now
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the player "Sam Someone" is answered as found at "2026/gc/spring-open/players/sam-someone"

  Rule: A tournament played by teams is answered team by team

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"

    Scenario: A tournament played by teams is answered as one
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then the tournament answered is played by teams

    Scenario: A tournament played by teams is answered with no players of its own
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then 0 players are answered

    Scenario: The teams are answered in the tournament's order, by their names
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then the first team of the players answered is "Australia"
      And the second team of the players answered is "England"

    Scenario: A team's players are answered in alphabetical order of their names
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then the first player of the team "Australia" among the players answered is "Pam Partner"
      And the second player of the team "Australia" among the players answered is "Pat Player"

    Scenario: A team's player is answered with where their page is found
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then the player "Pam Partner" of the team "Australia" is answered as found at "2026/ac/spring-tests/players/pam-partner"

    Scenario: A team's player of a tournament found at its old address is found at its address now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then the player "Pam Partner" of the team "Australia" is answered as found at "2026/gc/spring-tests/players/pam-partner"

    Scenario: An archived team is not answered
      Given "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has archived the team "New Zealand" in "Spring Tests"
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then 2 teams of the players are answered

    Scenario: An archived player of a team is not answered
      Given "organiser@example.com" has archived the player "Pat Player" of the team "Australia" of "Spring Tests"
      When the public players of the tournament at "2026/ac/spring-tests" are asked for
      Then 1 player of the team "Australia" is among the players answered

    Scenario: A Standard tournament is answered as not played by teams
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is not played by teams

  Rule: An address with no tournament a reader is sent to is refused

    Scenario: An address no tournament has been found at is refused
      When the public players of the tournament at "2026/ac/autumn-open" are asked for
      Then it is refused with "PublicPlayersOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the public players of the tournament at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicPlayersOfTournament.NoSuchTournament"

    Scenario: A tournament on another website is refused
      When the public players of the tournament on "gateballscores.com" at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicPlayersOfTournament.NoSuchTournament"
