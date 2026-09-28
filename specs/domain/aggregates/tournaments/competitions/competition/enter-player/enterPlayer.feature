Feature: Entering a tournament's player in one of its competitions

  A competition — a block, a knockout or a Swiss — is where a tournament's
  players play one another, and a competition keeps its own players and, in
  time, its own games. It is an aggregate of its own, kept under the id the
  tournament gave it when it was added, rather than a part of the tournament:
  a tournament knows its competitions only as far as listing them and linking
  to each (`CompetitionReference.feature`), and the games played in a
  competition are many, and are entered by several scorers at once, so in the
  tournament's own stream every score would contend with every other change to
  the tournament. A competition that nothing has been done to has no players,
  and its stream begins with the first thing done to it.

  What a competition cannot know it is told, as a tournament is told whether a
  player has played. Who may enter a player is the tournament's to say, since
  it knows its managers, and so is whether a tournament player is one there is
  and not archived, and so is the tournament player's order in the
  tournament; whatever asks the competition has asked the tournament first
  (`EnterPlayer.feature`). The competition knows who is already in it.

  A player is entered by naming the tournament player they are and saying
  their order in the tournament, and becomes a player in the competition, with
  an id of their own and an order (`CompetitionPlayer.feature`). The order is
  the tournament player's, so that however the players are entered, the
  competition starts with them in the order the tournament has them in
  (`movePlayer.feature` of the tournament's). The competition lists its
  players lowest order first.

  Once its players are in it, the competition's orders are its own: they are
  moved and withdrawn in it (`movePlayer.feature`, `withdrawPlayer.feature`),
  so a tournament player's order can already be one of the competition's.
  Then the player entered is put just after the player who has it, as a
  player moved down is: given the order halfway between that player's and the
  next one's, rounded down, a withdrawn player being the next as much as any
  other, since their order still counts. Where the player who has it is the
  last, the player entered is put last, with 10,000 more than the highest
  order there is. Where there is no whole number between the two, the
  competition first spaces its players out again, 10,000 apart in the order
  they are in, and records that, and then enters the player.

  A knockout is drawn in the competition's order (`addGame.feature`), so once
  it has a game, archived or not, entering a player, who would move others in
  the draw, is refused. Whatever asks says what kind of competition it is, as
  the tournament keeps that; the scenarios here are about a block unless they
  say otherwise.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them, as a tournament that added them in that order and moved none of
  them would.

  The same tournament player is in a competition once. Entering one who is
  already in it, withdrawn or not, is refused, since two places for one person
  would have them play themselves. A player who was removed is no longer in it
  (`removePlayer.feature`), and can be entered again as anybody new is.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A tournament player entered is a player in the competition

    Scenario: Entering a player records it
      Given a competition with no players
      When the tournament player "Sam Someone" is entered
      Then it has recorded 1 event
      And the first thing it recorded is a player being entered

    Scenario: The player entered is in the competition
      Given a competition with no players
      When the tournament player "Sam Someone" is entered
      Then the competition has the tournament player "Sam Someone"

    Scenario: The player entered has not withdrawn
      Given a competition with no players
      When the tournament player "Sam Someone" is entered
      Then the competition's player "Sam Someone" has not withdrawn

    Scenario: A competition rebuilt after a player was entered has them
      Given a competition with no players
      And the tournament player "Sam Someone" was entered in it
      When the competition is rebuilt from its stream
      Then the competition has the tournament player "Sam Someone"

  Rule: A player entered is given their order in the tournament

    Scenario: The player entered is given their order in the tournament
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 20000
      When the tournament player "Sam Someone" is entered
      Then the competition's player "Sam Someone" has the order 20000

    Scenario: The players are listed lowest order first, whatever order they were entered in
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 20000
      And the tournament player "Alex Another" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      When the competition is rebuilt from its stream
      Then the competition's first player is "Alex Another"
      And the competition's second player is "Sam Someone"

  Rule: Where the order is taken, the player entered is put just after the player who has it

    Scenario: The player entered is given the order halfway between the player who has it and the next
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Pat Player" has the order 15000

    Scenario: The player entered comes between the player who has it and the next
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's second player is "Pat Player"

    Scenario: The player who has the order keeps it
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Sam Someone" has the order 10000

    Scenario: Halfway between two is rounded down
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20001
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Pat Player" has the order 15000

    Scenario: A withdrawn player is the next as much as any other
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Pat Player" has the order 20000

    Scenario: Where the player who has the order is the last, the player entered is put last
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Pat Player" has the order 20000

    Scenario: Entering a player whose order is taken records only the entering
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then it has recorded 1 event
      And the first thing it recorded is a player being entered

  Rule: Where there is no room after the player who has the order, the players are spaced out first

    Scenario: Entering into a place with no room spaces the players out and then enters
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 10001
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then it has recorded 2 events
      And the first thing it recorded is the players being spaced out
      And the second thing it recorded is a player being entered

    Scenario: The players are spaced out 10,000 apart in the order they were in
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 10001
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Alex Another" has the order 20000

    Scenario: The player entered is then given the order halfway into their place
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 10001
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition's player "Pat Player" has the order 15000

    Scenario: A competition rebuilt after a player was entered into a place with no room has them there
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 10001
      And the tournament player "Pat Player" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      When the competition is rebuilt from its stream
      Then the competition's second player is "Pat Player"

  Rule: A tournament player is in a competition once

    Scenario: Entering a tournament player already in the competition is refused
      Given a competition with no players
      And the tournament player "Sam Someone" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then it is refused with "Competition.PlayerAlreadyEntered"

    Scenario: Entering a tournament player who has withdrawn is refused
      Given a competition with no players
      And the tournament player "Sam Someone" was entered in it
      And the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then it is refused with "Competition.PlayerAlreadyEntered"

    Scenario: A tournament player refused is not entered twice
      Given a competition with no players
      And the tournament player "Sam Someone" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then the competition has 1 player

    Scenario: A tournament player who was removed can be entered again
      Given a competition with no players
      And the tournament player "Sam Someone" was entered in it
      And the player "Sam Someone" was removed from it
      And the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then the competition has the tournament player "Sam Someone"

    Scenario: A tournament player entered again is given their order in the tournament again
      Given a competition with no players
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Sam Someone" was removed from it
      And the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then the competition's first player is "Sam Someone"

  Rule: A knockout with a game has its draw fixed

    Scenario: Entering a player in a knockout with a game is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then it is refused with "Competition.DrawFixed"

    Scenario: Entering a player in a knockout whose only game is archived is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then it is refused with "Competition.DrawFixed"

    Scenario: Entering a player in a knockout with no games is not refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition has the tournament player "Pat Player"

    Scenario: Entering a player in a block with a game is not refused
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the tournament player "Pat Player" is entered
      Then the competition has the tournament player "Pat Player"
