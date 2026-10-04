@postgres
Feature: A Swiss of a tournament, for anybody to read

  A Swiss's pages show it three ways, as a block's and a knockout's do: as a
  grid of its players ranked, each with their results (`swiss.feature`), as a
  summary (`swissSummary.feature`) and in order of play
  (`orderOfPlay.feature`). The application answers all three: the Swiss,
  found by its slug, with its name; every player entered in it, in the
  Swiss's order, withdrawn ones among them; the same players ranked; and every
  game of the Swiss in use, in the order they were added, each with when it
  was added.

  Each player is answered as the tournament's other pages show one: their
  name, what they represent, the flag they fly, where their own page is
  found, and whether they have withdrawn. With them are the games they have
  played, the games they have won, their net hoops, and their results: each
  game they played, in the order the games were added, with their opponent,
  by name and where their page is found, whether they won it, lost it or drew
  it, and by how many points, their own less their opponent's, the points
  being the number a score starts with, so that "7tp" is 7. A drawn game is
  played but won by neither.

  Whatever a player brings into the Swiss from play not scored in it
  (`ChangeCarryForward.feature`) is counted with what was: their game wins
  and game losses with the games they have played, their game wins with the
  games they have won, and their hoops for less their hoops against with
  their net hoops.

  The players are ranked as the old site ranked them: by the share of the
  games they have played that they have won, highest first, then by their net
  hoops, most first, and where both are the same, in the Swiss's order. A
  player who has played no game has no share, and is ranked after every
  player who has, since nothing yet says where they stand.

  The pages are a section of the tournament's, so the tournament is answered
  with it as with a block (`PublicBlockOfTournament.feature`): its name,
  where it is found now, and its competitions in use with where each is
  found.

  Only a Swiss is answered here. A block or a knockout is answered as one,
  and asking for one here is refused as `PublicSwissOfTournament.NotASwiss`.
  A slug no competition of the tournament has, or an archived competition's,
  is refused as `PublicSwissOfTournament.NoSuchCompetition`, and an address no
  tournament of the website has been found at, or an archived tournament's,
  as `PublicSwissOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found
  now.

  A Swiss is for anybody to read, so nobody need be signed in to ask, and
  every scenario here asks with nobody signed in.

  Where a scenario says nothing else, the tournament allows drawn games, and
  its Swiss "Zed" has "Sam Someone", "Alex Another" and "Chris Third" entered
  in it, in that order.

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
    And "organiser@example.com" has added the Swiss "Zed" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Zed" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Zed" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Zed" of "Spring Open"

  Rule: The Swiss is answered by its slug

    Scenario: The Swiss's name is answered
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the Swiss answered is called "Zed"

    Scenario: The tournament is answered with the Swiss
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: Every player entered in the Swiss is answered, in the Swiss's order

    Scenario: The players are answered in the Swiss's order
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the Swiss answered is "Sam Someone"
      And the second player of the Swiss answered is "Alex Another"
      And the third player of the Swiss answered is "Chris Third"

    Scenario: A player is answered with where their page is found
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Alex Another" is answered as found at "2026/ac/spring-open/players/alex-another"

    Scenario: A withdrawn player is answered as withdrawn
      Given "organiser@example.com" has withdrawn the player "Chris Third" from "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Chris Third" is answered as withdrawn

    Scenario: A player who has not withdrawn is not answered as withdrawn
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is not answered as withdrawn

  Rule: A player is answered with the games they have played and won, and their net hoops

    Scenario: A game played counts for both players
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Alex Another" is answered with 1 game played

    Scenario: A game won is a game won
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 1 game won

    Scenario: A game lost is not a game won
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Alex Another" is answered with 0 games won

    Scenario: A drawn game is played but won by neither
      Given "Sam Someone" has beaten "Alex Another" 6 to 6 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 0 games won

    Scenario: Net hoops are the points scored less the points scored against
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with net hoops of 2

    Scenario: An archived game counts for nothing
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 0 games played

  Rule: A player is answered with their results, in the order the games were added

    Scenario: A result names the opponent
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Sam Someone" was against "Alex Another"

    Scenario: A result says where the opponent's page is found
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Sam Someone" was against a player found at "2026/ac/spring-open/players/alex-another"

    Scenario: A game won is a result won by its margin
      Given "Sam Someone" has beaten "Alex Another" 7tp to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Sam Someone" was won by 3

    Scenario: A game lost is a result lost by its margin
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Alex Another" was lost by 3

    Scenario: A drawn game is a result drawn
      Given "Sam Someone" has beaten "Alex Another" 6 to 6 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Sam Someone" was drawn

    Scenario: The results are in the order the games were added
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first result of the player of the Swiss "Sam Someone" was against "Alex Another"
      And the second result of the player of the Swiss "Sam Someone" was against "Chris Third"

    Scenario: A player who has played nothing has no results
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 0 results

  Rule: What a player carries forward is counted with what they played

    Scenario: Game wins carried forward are games played
      Given "organiser@example.com" has given the player "Sam Someone" in "Zed" of "Spring Open" a carry forward of game wins of 2
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 2 games played

    Scenario: Game losses carried forward are games played
      Given "organiser@example.com" has given the player "Sam Someone" in "Zed" of "Spring Open" a carry forward of game losses of 3
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 3 games played

    Scenario: Game wins carried forward are games won
      Given "organiser@example.com" has given the player "Sam Someone" in "Zed" of "Spring Open" a carry forward of game wins of 2
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with 2 games won

    Scenario: Hoops carried forward count in net hoops
      Given "organiser@example.com" has given the player "Sam Someone" in "Zed" of "Spring Open" a carry forward of hoops for of 10
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the Swiss "Sam Someone" is answered with net hoops of 10

  Rule: The players are ranked by the share of their games they have won, then by their net hoops

    Scenario: A player with a greater share of their games won is ranked higher
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the Swiss ranked is "Alex Another"

    Scenario: A share is ranked rather than a count
      Given "Sam Someone" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the Swiss ranked is "Sam Someone"
      And the second player of the Swiss ranked is "Alex Another"

    Scenario: Players with the same share are ranked by their net hoops
      Given "Alex Another" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 2 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the Swiss ranked is "Chris Third"
      And the second player of the Swiss ranked is "Alex Another"

    Scenario: A player who has played no game is ranked after every player who has
      Given "Alex Another" has beaten "Sam Someone" 7 to 2 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the second player of the Swiss ranked is "Sam Someone"
      And the third player of the Swiss ranked is "Chris Third"

    Scenario: Players alike in everything are ranked in the Swiss's order
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the Swiss ranked is "Sam Someone"
      And the second player of the Swiss ranked is "Alex Another"
      And the third player of the Swiss ranked is "Chris Third"

  Rule: Every game of the Swiss in use is answered, in the order they were added

    Scenario: The games are answered in the order they were added
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the Swiss answered was won by "Sam Someone"
      And the second game of the Swiss answered was won by "Chris Third"

    Scenario: A game is answered with when it was added
      Given the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the Swiss answered was added at "2026-10-03T10:00:00Z"

  Rule: Only a Swiss of a tournament a reader is sent to is answered

    Scenario: A slug no competition has is refused
      When the Swiss "plate" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NoSuchCompetition"

    Scenario: An archived Swiss is refused
      Given "organiser@example.com" has archived the competition "Zed" in "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NoSuchCompetition"

    Scenario: A block is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the Swiss "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NotASwiss"

    Scenario: A knockout is refused
      Given "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      When the Swiss "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NotASwiss"

    Scenario: An address no tournament has been found at is refused
      When the Swiss "zed" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the Swiss "zed" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicSwissOfTournament.NoSuchTournament"
