@postgres
Feature: The games of a tournament, for anybody to read

  A tournament's page is where a reader follows it, and lists every game
  played in it, the most recently added first (`tournament.feature`). The
  application answers them, with what the page shows of the tournament and
  where its sections lead: the tournament's name and where it is found now,
  whether it is played by teams, which have no players' page of their own
  (`PublicPlayersOfTournament.feature`), and its competitions in use, each
  with its name and where it is found.

  Each game is answered with its winner and its loser, each with the name the
  tournament calls them now, what they represent and the flag they fly where
  they have one, and their score as it was typed; whether it was drawn; the
  competition it was played in; and the moment it was added
  (`addGame.feature`). In a test, a player represents their team and flies
  its flag, since a team's players are known by their team.

  A game counts for as long as it is in use: an archived game is not
  answered, as everywhere games are counted, and nor are the games of an
  archived competition, which is set aside.

  A withdrawn game (`withdrawGame.feature`), and every game of a player who
  has withdrawn from the competition it was played in
  (`withdrawPlayer.feature`), was played, so it is answered, but it is
  answered as withdrawn, since it counts for nothing and the page strikes it
  through.

  The tournament is asked for by its address on the website being read, as
  "2026/ac/spring-open", as a reader's browser names it. An address the
  tournament has moved on from still finds it, since a link to it may have
  been kept, and the tournament is answered with where it is found now. An
  address no tournament of the website has been found at is refused as
  `GamesOfTournament.NoSuchTournament`, and so is one whose tournament is
  archived, since an archived tournament is not one a reader is sent to.

  A tournament's games are for anybody, so nobody need be signed in to ask,
  and every scenario here asks with nobody signed in.

  The tournament's subtitle is answered with it, in Markdown as it is kept
  (`TournamentSubtitle.feature`), since every page of a tournament shows it
  beneath its name in the header (`layout.feature`). A tournament with no
  subtitle is answered with none.

  So are its manager's notes, each by its id with when it last changed
  (`PublicManagerNotesOfTournament.feature`), since every page of a
  tournament marks its Notes section while a reader has a note there they
  have not read as it is now (`notes.feature`).

  So are its commentaries, each by its id with when it last changed
  (`CommentariesByTournament.feature`), since every page of a tournament
  marks its Commentary section the same way (`commentaries.feature`).

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The tournament is answered as its page shows it

    Scenario: The tournament's name is answered
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's subtitle is answered
      Given the tournament "Spring Open" has the subtitle "Lunch is at **noon**"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered has the subtitle "Lunch is at **noon**"

    Scenario: A tournament with no subtitle is answered with none
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered has no subtitle

    Scenario: The tournament's manager notes are answered with when each last changed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: The tournament's commentaries are answered with when each last changed
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first commentary of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: Where the tournament is found is answered
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/ac/spring-open"

    Scenario: A Standard tournament is answered as not played by teams
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is not played by teams

    Scenario: A tournament with no games answers none
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then 0 games are answered

  Rule: A tournament is found at an address it has moved on from

    Background:
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"

    Scenario: A tournament is found at its old address
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A tournament found at its old address is answered with where it is found now
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: An address with no tournament a reader is sent to is refused

    Scenario: An address no tournament has been found at is refused
      When the games of the tournament at "2026/ac/autumn-open" are asked for
      Then it is refused with "GamesOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then it is refused with "GamesOfTournament.NoSuchTournament"

    Scenario: A tournament restored is answered
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has restored the tournament "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A tournament on another website is refused
      When the games of the tournament on "gateballscores.com" at "2026/ac/spring-open" are asked for
      Then it is refused with "GamesOfTournament.NoSuchTournament"

  Rule: The tournament's competitions in use are answered, with where each is found

    Scenario: A competition is answered
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the tournament answered is "Block A"

    Scenario: A competition is answered with where it is found
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the competition "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

    Scenario: The competitions are answered in the tournament's order
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the tournament answered is "Block B"
      And the second competition of the tournament answered is "Block A"

    Scenario: An archived competition is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the competition "Block B" is not answered

  Rule: Every game in use is answered, the most recently added first

    Scenario: A game is answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered is of "Sam Someone" beating "Alex Another"

    Scenario: The game added most recently is first
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-03T11:00:00Z"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered is of "Chris Third" beating "Sam Someone"
      And the second game answered is of "Sam Someone" beating "Alex Another"

    Scenario: The games of every competition are answered together
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-03T11:00:00Z"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block B" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered is of "Alex Another" beating "Sam Someone"
      And the second game answered is of "Sam Someone" beating "Alex Another"

    Scenario: An archived game is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then 0 games are answered

    Scenario: The games of an archived competition are not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then 0 games are answered

  Rule: Each game is answered with what a reader is shown of it

    Background:
      Given the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The winner's score is answered as it was typed
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was won with "26"

    Scenario: The loser's score is answered as it was typed
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was lost with "17"

    Scenario: The competition it was played in is answered
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was played in "Block A"

    Scenario: When it was added is answered
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was added at "2026-10-03T10:00:00Z"

    Scenario: A game won is not drawn
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered is not drawn

    Scenario: A player is answered by the name the tournament calls them now
      Given "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Sam Someone-Else"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered is of "Sam Someone-Else" beating "Alex Another"

  Rule: A game that counts for nothing is answered as withdrawn

    Scenario: A withdrawn game is answered as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game of the tournament answered was withdrawn

    Scenario: A withdrawn player's game is answered as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game of the tournament answered was withdrawn

    Scenario: A game that counts is not answered as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game of the tournament answered was not withdrawn

  Rule: Each player is answered with what they represent and the flag they fly

    Scenario: A player is answered with what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was won by a player representing "Canterbury Croquet Club"

    Scenario: A player is answered with the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was won by a player flying the flag "nz"

    Scenario: A player who represents nothing is answered representing nothing
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games of the tournament at "2026/ac/spring-open" are asked for
      Then the first game answered was won by a player representing nothing

  Rule: A drawn game is answered as drawn

    Scenario: A drawn game is answered as drawn
      Given "organiser@example.com" has created the tournament "Autumn Open" allowing drawn games
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Autumn Open"
      When the games of the tournament at "2026/ac/autumn-open" are asked for
      Then the first game answered is drawn

  Rule: In a test, a player represents their team and flies its flag

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And the team is to fly the flag "england"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"

    Scenario: A player in a test represents their team
      When the games of the tournament at "2026/ac/spring-tests" are asked for
      Then the first game answered was won by a player representing "Australia"

    Scenario: A player in a test flies their team's flag
      When the games of the tournament at "2026/ac/spring-tests" are asked for
      Then the first game answered was lost by a player flying the flag "england"

    Scenario: A tournament played by teams is answered as played by teams
      When the games of the tournament at "2026/ac/spring-tests" are asked for
      Then the tournament answered is played by teams

    Scenario: A test is answered with where it is found
      When the games of the tournament at "2026/ac/spring-tests" are asked for
      Then the competition "AUS v ENG" is answered as found at "2026/ac/spring-tests/tests/aus-v-eng"
