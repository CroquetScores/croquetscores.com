@postgres
Feature: The standings of a block and a Swiss, kept so that they are worked out once

  A block's places and a Swiss's ranking are worked out when a competition
  changes, and not each time somebody asks: the site's own pages and the API
  read the same rows, so that they cannot say two different things of one
  competition, and the working out is in one place (`placingsOfBlock.feature`
  says how a block's players are placed).

  A player is kept with the matches they have won and lost, the games they have
  won, their net games and net hoops, what they carry forward counted in, and the
  place they hold and whether others share it. A player who has withdrawn has
  no place and their games count for nothing. A Swiss keeps the games each has
  played and won, and a place that is never shared. A knockout and a test have
  no standings.

  They are worked out again after every event of a competition, and after the
  tournament's events that say what its block is played as, so that the
  last event, whichever stream it was in, leaves them as the whole of the events
  say. A competition's own events do not say which kind of competition it is, so
  until the tournament's say it nothing is kept.

  Background:
    Given the competition games read model
    And a tournament "Spring Open" to start on "2026-10-03"
    And "Spring Open" is created by the account for "organiser@example.com"
    And a block named "Block A" is made in "Spring Open"
    And the player "Sam Someone" is made in "Spring Open"
    And the player "Alex Another" is made in "Spring Open"
    And the player "Chris Third" is made in "Spring Open"
    And the player "Sam Someone" is entered in "Block A" of "Spring Open"
    And the player "Alex Another" is entered in "Block A" of "Spring Open"
    And the player "Chris Third" is entered in "Block A" of "Spring Open"

  Rule: A block's players are kept with their totals and their places

    Scenario: Where nothing has been played nobody has a place
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

    Scenario: Where nothing has been played nobody is level
      When the standings of "Block A" of "Spring Open" are read back
      Then nobody is level on the matches they have won

    Scenario: The players are kept in the competition's order where nothing has been played
      When the standings of "Block A" of "Spring Open" are read back
      Then the standings kept are "Sam Someone", "Alex Another" and "Chris Third"

    Scenario: The winner of a game is placed first
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the place 1

    Scenario: The winner of a game has not shared their place
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the place of "Sam Someone" is kept as not shared

    Scenario: A player who has played nothing is placed above one who lost, by their net hoops
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Chris Third" has the place 2

    Scenario: The loser of a game is placed last
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" has the place 3

    Scenario: The standings are kept best first
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the standings kept are "Sam Someone", "Chris Third" and "Alex Another"

    Scenario: A match won is kept as won
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has won 1 match

    Scenario: A match lost is kept as lost
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" has lost 1 match

    Scenario: The games won are kept
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has won 1 game

    Scenario: The net games are kept
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" has the net games -1

    Scenario: The net hoops are kept
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the net hoops 9

    Scenario: Players level on matches won who a tie break cannot tell apart share a place
      Given "Sam Someone" beat "Alex Another" 26 to 10 in "Block A" of "Spring Open" as "the first"
      And "Alex Another" beat "Chris Third" 26 to 20 in "Block A" of "Spring Open" as "the second"
      And "Chris Third" beat "Sam Someone" 26 to 25 in "Block A" of "Spring Open" as "the third"
      And the tie break of "Block A" of "Spring Open" is changed to who beat who
      When the standings of "Block A" of "Spring Open" are read back
      Then the place of "Alex Another" is kept as shared

    Scenario: Players level on matches won are told apart by the tie break
      Given "Sam Someone" beat "Alex Another" 26 to 10 in "Block A" of "Spring Open" as "the first"
      And "Alex Another" beat "Chris Third" 26 to 20 in "Block A" of "Spring Open" as "the second"
      And "Chris Third" beat "Sam Someone" 26 to 25 in "Block A" of "Spring Open" as "the third"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Chris Third" has the place 2

    Scenario: Players level on matches won are kept as level
      Given "Sam Someone" beat "Alex Another" 26 to 10 in "Block A" of "Spring Open" as "the first"
      And "Alex Another" beat "Chris Third" 26 to 20 in "Block A" of "Spring Open" as "the second"
      And "Chris Third" beat "Sam Someone" 26 to 25 in "Block A" of "Spring Open" as "the third"
      When the standings of "Block A" of "Spring Open" are read back
      Then somebody is level on the matches they have won

  Rule: The places change as the games and the players do

    Scenario: A game corrected changes the totals
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is corrected to 26 to 20
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the net hoops 6

    Scenario: A game archived counts for nothing
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is archived
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

    Scenario: A game restored counts again
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is archived
      And the game "the first" in "Block A" of "Spring Open" is restored
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the place 1

    Scenario: A game withdrawn counts for nothing
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is withdrawn
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

    Scenario: A game's withdrawal reversed counts again
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is withdrawn
      And the withdrawal of the game "the first" in "Block A" of "Spring Open" is reversed
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the place 1

    Scenario: A player who has withdrawn has no place
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

    Scenario: A player who has withdrawn is kept after the rest
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      When the standings of "Block A" of "Spring Open" are read back
      Then the standings kept are "Sam Someone", "Chris Third" and "Alex Another"

    Scenario: The games of a player who has withdrawn count for nothing
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has won 0 matches

    Scenario: A player's withdrawal reversed gives them their place again
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      And the withdrawal of the player "Sam Someone" in "Block A" of "Spring Open" is reversed
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has the place 1

    Scenario: What a player carries forward counts in their totals
      Given the player "Chris Third" in "Block A" of "Spring Open" carries forward 2 match wins
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Chris Third" has won 2 matches

    Scenario: What a player carries forward puts them in their place
      Given the player "Chris Third" in "Block A" of "Spring Open" carries forward 2 match wins
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Chris Third" has the place 1

    Scenario: What a player who has withdrawn carried forward counts for nothing
      Given the player "Chris Third" in "Block A" of "Spring Open" carries forward 2 match wins
      And the player "Chris Third" in "Block A" of "Spring Open" is withdrawn
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Chris Third" has won 0 matches

    Scenario: A player removed is not kept
      Given the player "Chris Third" in "Block A" of "Spring Open" is removed
      When the standings of "Block A" of "Spring Open" are read back
      Then the standings kept are "Sam Someone" and "Alex Another"

    Scenario: A game in another block is not counted
      Given a block named "Block B" is made in "Spring Open"
      And the player "Sam Someone" is entered in "Block B" of "Spring Open"
      And the player "Alex Another" is entered in "Block B" of "Spring Open"
      And "Sam Someone" beat "Alex Another" 26 to 17 in "Block B" of "Spring Open" as "the other"
      When the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

  Rule: A Swiss is ranked by the share of its games each has won

    Background:
      Given a Swiss named "Swiss A" is made in "Spring Open"
      And the player "Sam Someone" is entered in "Swiss A" of "Spring Open"
      And the player "Alex Another" is entered in "Swiss A" of "Spring Open"
      And the player "Chris Third" is entered in "Swiss A" of "Spring Open"

    Scenario: A Swiss's winner is placed first
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the player "Sam Someone" has the place 1

    Scenario: A Swiss's players who have played nothing are placed after those who have
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the standings kept are "Sam Someone", "Alex Another" and "Chris Third"

    Scenario: A Swiss keeps the games each has played
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the player "Alex Another" has played 1 game

    Scenario: A Swiss keeps the games each has won
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the player "Sam Someone" has won 1 game in the Swiss

    Scenario: A Swiss keeps net hoops
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the player "Alex Another" has the net hoops -9

    Scenario: A place in a Swiss is kept as not shared
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the place of "Sam Someone" is kept as not shared

    Scenario: A player of a Swiss who has withdrawn has no place
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Swiss A" of "Spring Open" as "the first"
      And the player "Sam Someone" in "Swiss A" of "Spring Open" is withdrawn
      When the standings of "Swiss A" of "Spring Open" are read back
      Then the player "Sam Someone" has no place

  Rule: A knockout has no standings

    Scenario: A knockout keeps none
      Given a knockout named "Cup" is made in "Spring Open"
      And the player "Sam Someone" is entered in "Cup" of "Spring Open"
      When the standings of "Cup" of "Spring Open" are read back
      Then no standings are kept

  Rule: Projecting the same events again changes nothing

    Scenario: A game projected twice is counted once
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the events of the competition "Block A" of "Spring Open" are projected again
      And the standings of "Block A" of "Spring Open" are read back
      Then the player "Sam Someone" has won 1 match

  Rule: The standings are the same however the read models are made again

    Scenario: A rebuild with the competitions' streams first is kept as it was
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And the standings of "Block A" of "Spring Open" are read back
      Then it is rebuilt without failing
      And the player "Sam Someone" has the place 1

    Scenario: A rebuild with the tournament's stream first is kept as it was
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the read model is rebuilt from the events
      And the standings of "Block A" of "Spring Open" are read back
      Then it is rebuilt without failing
      And the player "Sam Someone" has the place 1
