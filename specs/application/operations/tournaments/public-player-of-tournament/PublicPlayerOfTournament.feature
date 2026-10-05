@postgres
Feature: A player of a tournament, for anybody to read

  A player's page shows what they have played in their tournament
  (`player.feature`). The application answers it: the player, found by their
  slug (`addPlayer.feature`), with their name; every game of theirs in use,
  the most recently added first; and every competition they are entered in
  that is in use, in reverse of the tournament's order, so that the last added
  comes first, as a knockout added at the end of a tournament's blocks is the
  one a reader is following.

  Each game is answered as the player played it: whether they beat their
  opponent, lost to them or drew with them; the opponent, by the name the
  tournament calls them now and where their own page is found; the player's
  score and then the opponent's, each as it was typed; and the competition
  it was played in. An archived game is not answered, nor are the games of an
  archived competition, as everywhere games are counted.

  The page is a section of the tournament's, so the tournament is answered
  with it as its games are (`GamesOfTournament.feature`): its name, where it
  is found now, and its competitions in use with where each is found, for the
  page's section bar.

  A tournament played by teams has no players of its own, only its teams',
  and a player in one of its teams is answered as a tournament's own player
  is: found by their slug (`addTeamPlayer.feature`), with their name, their
  games in the tests, each against a player of the other team, answered with
  that team's short name, since a reader of a test knows a team by it; and
  the tests their team plays in that are in use, since a team's players are
  not entered in a test one by one but play in it for their team. A player of an archived
  team is not one a reader is sent to, any more than an archived player is.

  A slug no player of the tournament has, or an archived player's, is
  refused as
  `PublicPlayerOfTournament.NoSuchPlayer`, since an archived player is not one
  a reader is sent to. An address no tournament of the website has been found
  at, or an archived tournament's, is refused as
  `PublicPlayerOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found now.

  A player is for anybody to read, so nobody need be signed in to ask, and
  every scenario here asks with nobody signed in.

  Where a scenario says nothing else, the tournament allows drawn games, so
  that a game on equal points is drawn, and its block is the best of 3, so
  that two players can meet more than once.

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
    And "organiser@example.com" has created the tournament "Spring Open" allowing drawn games
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: The player is answered by their slug

    Scenario: The player's name is answered
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the player answered is called "Sam Someone"

    Scenario: The player is answered by the name the tournament calls them now
      Given "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the player answered is called "Samantha Someone"

    Scenario: The tournament is answered with the player
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's notes are answered
      Given the tournament "Spring Open" has the notes "Lunch is at **noon**"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered has the notes "Lunch is at **noon**"

    Scenario: A tournament with no notes is answered with none
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered has no notes

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: Every game of the player's in use is answered, the most recently added first

    Scenario: A game the player won is answered as beating their opponent
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was won against "Alex Another"

    Scenario: A game the player lost is answered as losing to their opponent
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was lost to "Alex Another"

    Scenario: A drawn game is answered as drawn with their opponent
      Given "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was drawn with "Alex Another"

    Scenario: The game added most recently is first
      Given the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-03T11:00:00Z"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was lost to "Chris Third"
      And the second game answered was won against "Alex Another"

    Scenario: A game the player did not play is not answered
      Given "Alex Another" has beaten "Chris Third" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games are answered

    Scenario: An archived game is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games are answered

  Rule: Each game is answered with the player's score first

    Scenario: The player's score is answered first when they won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was played to "26" against "17"

    Scenario: The player's score is answered first when they lost
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was played to "17" against "26"

    Scenario: The opponent is answered with where their page is found
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was against a player found at "2026/ac/spring-open/players/alex-another"

    Scenario: A tournament's own player's opponent is answered with no team
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was against a player of no team

    Scenario: The competition a game was played in is answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game answered was played in "Block A"

  Rule: Every competition the player is entered in that is in use is answered, the last of the tournament's first

    Scenario: A competition the player is entered in is answered
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first competition of the player answered is "Block A"

    Scenario: The competitions are answered in reverse of the tournament's order
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the first competition of the player answered is "Block B"
      And the second competition of the player answered is "Block A"

    Scenario: A competition the player is not entered in is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then 1 competition of the player is answered

    Scenario: An archived competition is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then 1 competition of the player is answered

    Scenario: A competition is answered with where it is found
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then the competition of the player "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

  Rule: A player in a team is answered as a tournament's own player is

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

    Scenario: A team's player is answered by their slug
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the player answered is called "Pat Player"

    Scenario: A game a team's player won in a test is answered as beating their opponent
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was won against "Kim Keeper"

    Scenario: A game a team's player lost in a test is answered as losing to their opponent
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was lost to "Kim Keeper"

    Scenario: A team's player's game is answered with their score first
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was played to "17" against "26"

    Scenario: A team's player's opponent is answered with where their page is found
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was against a player found at "2026/ac/spring-tests/players/kim-keeper"

    Scenario: A team's player's opponent is answered with their team's short name
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was against a player of the team "ENG"

    Scenario: The test a team's player's game was played in is answered
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game answered was played in "AUS v ENG"

    Scenario: A test the team plays in is answered as the player's competition
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first competition of the player answered is "AUS v ENG"

    Scenario: A test the team does not play in is not answered
      Given the team is to be known for short as "NZ"
      And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "New Zealand" to "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then 1 competition of the player is answered

    Scenario: An archived player of a team is refused
      Given "organiser@example.com" has archived the player "Pat Player" of the team "Australia" of "Spring Tests"
      When the player "pat-player" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchPlayer"

    Scenario: A player of an archived team is refused
      Given "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the player "Nat Newman" to the team "New Zealand" of "Spring Tests"
      And "organiser@example.com" has archived the team "New Zealand" in "Spring Tests"
      When the player "nat-newman" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchPlayer"

  Rule: A player a reader is not sent to is refused

    Scenario: A slug no player has is refused
      When the player "pat-player" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchPlayer"

    Scenario: An archived player is refused
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has archived the player "Pat Player" in "Spring Open"
      When the player "pat-player" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchPlayer"

    Scenario: An address no tournament has been found at is refused
      When the player "sam-someone" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the player "sam-someone" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicPlayerOfTournament.NoSuchTournament"
