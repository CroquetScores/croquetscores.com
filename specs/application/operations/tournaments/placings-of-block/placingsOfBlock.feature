Feature: Where the players of a block are placed

  A block's players are placed one after another, and a place is shared by
  players who cannot be told apart. This is what is true of every page that
  puts a block's players in order, so it is said once here and not by each of
  them (`PublicBlockOfTournament.feature` gives the pages what is worked out).

  Whatever the block's tie break (`TieBreak.feature`), players are first
  placed by the share of the matches they have decided that they have won,
  highest first. A share rather than a count, so that a player who has played
  fewer matches is not placed below one who has simply played more, and a
  player who has decided no match has a share of nothing. A withdrawn player
  is placed after everybody who has not withdrawn and has no place, since
  their games count for nothing.

  Players level on that share are told apart by the block's tie break:

  - net games then net hoops then who beat who: by net games, most first;
    those still level by net hoops, most first; those still level by who
    beat who. Net games are left out where each match is a single game,
    since a game won is then a match won and net games say nothing more
    than the share has.
  - who beat who: by who beat who alone.
  - other: not told apart.

  Who beat who is worked out among the players still level, and nobody else.
  Each is given the matches they have won against the others less the matches
  they have lost to them, and the more of that a player has the higher they
  are placed. What is left level is worked out again among those left, since
  a player's result against someone already placed above or below them says
  nothing of those who are not. Players who beat one another in a ring, each
  beating one and losing to another, cannot be told apart by it, nor can
  players who never met, nor two whose matches were shared.

  Players who cannot be told apart share a place. They are given the place of
  the first of them, and the next player after them is given the place that
  follows the last, so three players sharing second are each second and the
  player after them is fifth. A place that is shared says so, and a place
  that is not does not.

  The players are put in order too, for a page that lists them ranked: those
  who cannot be told apart in the block's order.

  Whether any players are level on the share they have won is answered as
  well, since it is what the page says a tie break is for. A withdrawn player
  is level with nobody.

  Background:
    Given the block is the best of 3

  Rule: Players are first placed by the share of their decided matches they have won

    Scenario: A player with a greater share is placed higher
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has won 2 matches
      And "Alex Another" has lost 1 match
      And "Sam Someone" has won 1 match
      And "Sam Someone" has lost 1 match
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: A share is placed rather than a count
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has won 1 match
      And "Alex Another" has won 2 matches
      And "Alex Another" has lost 1 match
      When the players are placed
      Then the first player placed is "Sam Someone"

    Scenario: A player who has decided no match has a share of nothing
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has won 1 match
      When the players are placed
      Then the first player placed is "Alex Another"

    Scenario: A withdrawn player is placed after everybody who has not withdrawn
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has withdrawn
      And "Alex Another" has lost 1 match
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: A withdrawn player has no place
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And "Sam Someone" has withdrawn
      When the players are placed
      Then "Sam Someone" has no place

  Rule: Net games then net hoops then who beat who tells apart players level on the share

    Scenario: Players level are told apart by net games
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net games of 1
      And "Alex Another" has net games of 3
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: Players level on net games are told apart by net hoops
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net hoops of 4
      And "Alex Another" has net hoops of 9
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: Net games come before net hoops
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net games of 3
      And "Sam Someone" has net hoops of 1
      And "Alex Another" has net games of 1
      And "Alex Another" has net hoops of 20
      When the players are placed
      Then the first player placed is "Sam Someone"

    Scenario: Players level on net games and net hoops are told apart by who beat who
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: Net hoops come before who beat who
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net hoops of 9
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the first player placed is "Sam Someone"

    Scenario: Where each match is a single game, net games are left out
      Given the block is the best of 1
      And the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net games of 3
      And "Alex Another" has net games of 1
      And "Alex Another" has net hoops of 9
      When the players are placed
      Then the first player placed is "Alex Another"

  Rule: Who beat who tells apart players level on the share, and nothing else does

    Scenario: The winner of the match between two players level is placed above the other
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the first player placed is "Alex Another"
      And the second player placed is "Sam Someone"

    Scenario: Net games and net hoops tell nothing apart
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has net games of 5
      And "Sam Someone" has net hoops of 50
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the first player placed is "Alex Another"

    Scenario: Players who beat one another in a ring share a place
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And the player "Chris Third"
      And "Sam Someone" has beaten "Alex Another" in a match
      And "Alex Another" has beaten "Chris Third" in a match
      And "Chris Third" has beaten "Sam Someone" in a match
      When the players are placed
      Then the place of "Sam Someone" is 1
      And the place of "Alex Another" is 1
      And the place of "Chris Third" is 1
      And the place of "Sam Someone" is shared

    Scenario: Players who never met share a place
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      When the players are placed
      Then the place of "Sam Someone" is 1
      And the place of "Alex Another" is 1
      And the place of "Alex Another" is shared

    Scenario: Players whose matches were shared share a place
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has beaten "Alex Another" in a match
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the place of "Sam Someone" is 1
      And the place of "Sam Someone" is shared

    Scenario: Who beat who is worked out again among those left level
      Given the tie break "who-beat-who"
      And the player "Pat Player"
      And the player "Alex Another"
      And the player "Sam Someone"
      And the player "Chris Third"
      And "Pat Player" has beaten "Sam Someone" in a match
      And "Pat Player" has beaten "Chris Third" in a match
      And "Sam Someone" has beaten "Alex Another" in a match
      And "Alex Another" has beaten "Chris Third" in a match
      When the players are placed
      Then the first player placed is "Pat Player"
      And the second player placed is "Sam Someone"
      And the third player placed is "Alex Another"
      And the fourth player placed is "Chris Third"
      And the place of "Sam Someone" is 2
      And the place of "Alex Another" is 3
      And the place of "Sam Someone" is not shared

    Scenario: A player who beat the others is placed above two who never met
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And the player "Chris Third"
      And "Chris Third" has beaten "Sam Someone" in a match
      And "Chris Third" has beaten "Alex Another" in a match
      When the players are placed
      Then the place of "Chris Third" is 1
      And the place of "Chris Third" is not shared
      And the place of "Sam Someone" is 2
      And the place of "Alex Another" is 2
      And the place of "Alex Another" is shared

    Scenario: Results against players not level say nothing
      Given the tie break "who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And the player "Chris Third"
      And "Chris Third" has won 1 match
      And "Sam Someone" has beaten "Chris Third" in a match
      And "Chris Third" has beaten "Alex Another" in a match
      When the players are placed
      Then the place of "Chris Third" is 1
      And the place of "Sam Someone" is 2
      And the place of "Alex Another" is 2

  Rule: Other tells nothing apart

    Scenario: Players level on the share share a place however they stand otherwise
      Given the tie break "other"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has net games of 5
      And "Alex Another" has net hoops of 50
      And "Alex Another" has beaten "Sam Someone" in a match
      When the players are placed
      Then the place of "Sam Someone" is 1
      And the place of "Alex Another" is 1
      And the place of "Alex Another" is shared

    Scenario: Players level are put in the block's order
      Given the tie break "other"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has net hoops of 50
      When the players are placed
      Then the first player placed is "Sam Someone"
      And the second player placed is "Alex Another"

    Scenario: A greater share is still placed higher
      Given the tie break "other"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has won 1 match
      When the players are placed
      Then the place of "Alex Another" is 1
      And the place of "Sam Someone" is 2

  Rule: A place that is shared takes the places it covers

    Scenario: The player after three sharing second is fifth
      Given the tie break "other"
      And the player "Pat Player"
      And the player "Sam Someone"
      And the player "Alex Another"
      And the player "Chris Third"
      And the player "Robin Fifth"
      And "Pat Player" has won 2 matches
      And "Sam Someone" has won 1 match
      And "Sam Someone" has lost 1 match
      And "Alex Another" has won 1 match
      And "Alex Another" has lost 1 match
      And "Chris Third" has won 1 match
      And "Chris Third" has lost 1 match
      And "Robin Fifth" has lost 1 match
      When the players are placed
      Then the place of "Pat Player" is 1
      And the place of "Sam Someone" is 2
      And the place of "Alex Another" is 2
      And the place of "Chris Third" is 2
      And the place of "Robin Fifth" is 5

    Scenario: The player after players sharing a place is placed after the places they cover
      Given the tie break "other"
      And the player "Pat Player"
      And the player "Sam Someone"
      And the player "Alex Another"
      And the player "Chris Third"
      And "Pat Player" has won 2 matches
      And "Sam Someone" has won 1 match
      And "Sam Someone" has lost 1 match
      And "Alex Another" has won 1 match
      And "Alex Another" has lost 1 match
      And "Chris Third" has lost 1 match
      When the players are placed
      Then the place of "Pat Player" is 1
      And the place of "Sam Someone" is 2
      And the place of "Alex Another" is 2
      And the place of "Chris Third" is 4

    Scenario: A place that is not shared says so
      Given the tie break "other"
      And the player "Sam Someone"
      And "Sam Someone" has won 1 match
      When the players are placed
      Then the place of "Sam Someone" is not shared

    Scenario: A withdrawn player does not take a place
      Given the tie break "other"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Sam Someone" has withdrawn
      When the players are placed
      Then the place of "Alex Another" is 1

  Rule: Whether any players are level on the share they have won is answered

    Scenario: Two players with the same share are level
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      When the players are placed
      Then some players are level on matches won

    Scenario: Players with different shares are not level
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has won 1 match
      When the players are placed
      Then no players are level on matches won

    Scenario: A withdrawn player is level with nobody
      Given the tie break "net-games-net-hoops-who-beat-who"
      And the player "Sam Someone"
      And the player "Alex Another"
      And "Alex Another" has withdrawn
      When the players are placed
      Then no players are level on matches won
