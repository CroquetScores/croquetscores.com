Feature: Moving a competition's player up or down

  A competition lists its players lowest order first (`enterPlayer.feature`),
  and that order is the order a knockout is drawn in and a block is listed in.
  A manager puts them in the order that suits the competition by moving one up
  or down a place at a time.

  A player is moved as a tournament's competition is
  (`moveCompetition.feature`): given the order halfway between the orders of
  the two they now come between, rounded down, so that nothing else moves, and
  a player dragged further than a place will be put the same way. Moving up is
  putting them just before the player above, and moving down just after the
  player below. Put first, a player is given half the order of the one they
  come before; put last, 10,000 more than the highest order there is. Where
  there is no whole number left between two orders, the competition first
  spaces its players out again, 10,000 apart in the order they are in, and
  records that, and then moves the player.

  A withdrawn player plays no more of the competition, and a list of the
  players playing does not show them where the others are, so moving a place
  passes over them: the player above or below is the nearest one who has not
  withdrawn. A withdrawn player is put last when they withdraw
  (`withdrawPlayer.feature`), but a player entered after them can come after
  them, so one can lie between two players playing. Their order still counts,
  so the room between two players ends at a withdrawn one lying between them.
  A withdrawn player can only have their withdrawal reversed
  (`CompetitionPlayer.feature`), so moving one is refused.

  Moving the first player up, or the last down, records nothing, because there
  is nowhere for them to go.

  A knockout is drawn in the competition's order (`addGame.feature`), so once
  it has a game in use, moving a player is refused. An archived game fixes
  nothing. Whatever asks
  says what kind of competition it is; the scenarios here are about a block
  unless they say otherwise.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  A bye is nobody (`enterPlayer.feature`), and every bye has the same id, so
  a bye is moved by its place in the competition's order rather than by its
  id: the bye with the order it has. It moves as a player does, past players
  and byes alike, and a knockout with a game has its byes fixed as it has its
  players.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players

  Rule: Moving a player up puts them just before the player above

    Scenario: A player moved up comes before the player who was above
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then the competition's first player is "Alex Another"

    Scenario: A player moved up between two others is given the order halfway between them
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Pat Player" has the order 15000

    Scenario: A player moved up to the top is given half the order of the one they come before
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then the competition's player "Alex Another" has the order 5000

    Scenario: Halfway is rounded down
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the player "Alex Another" was moved to the order 20001
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Pat Player" has the order 15000

    Scenario: The player who was above keeps their order
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then the competition's player "Sam Someone" has the order 10000

    Scenario: Moving a player up records it
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a player being moved

  Rule: Moving a player down puts them just after the player below

    Scenario: A player moved down comes after the player who was below
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is moved down
      Then the competition's first player is "Alex Another"

    Scenario: A player moved down between two others is given the order halfway between them
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is moved down
      Then the competition's player "Sam Someone" has the order 25000

    Scenario: A player moved down to the bottom is given 10,000 more than the highest order
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is moved down
      Then the competition's player "Sam Someone" has the order 30000

  Rule: A competition rebuilt after a player was moved has them where they were moved to

    Scenario: A competition rebuilt after a player was moved keeps the order they were given
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" was moved to the order 5000
      When the competition is rebuilt from its stream
      Then the competition's first player is "Alex Another"

  Rule: Where there is no room between two orders, the players are spaced out first

    Scenario: Moving into a place with no room spaces the players out and then moves
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the player "Alex Another" was moved to the order 10001
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then it has recorded 2 events
      And the first thing it recorded is the players being spaced out
      And the second thing it recorded is a player being moved

    Scenario: The players are spaced out 10,000 apart in the order they were in
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the player "Alex Another" was moved to the order 10001
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Alex Another" has the order 20000

    Scenario: The player moved is then given the order halfway into their place
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the player "Alex Another" was moved to the order 10001
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Pat Player" has the order 15000

    Scenario: A competition rebuilt after its players were spaced out has them spaced out
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" was moved to the order 10001
      And the players were spaced out
      When the competition is rebuilt from its stream
      Then the competition's player "Alex Another" has the order 20000

  Rule: A withdrawn player is passed over

    Scenario: A player moved up passes over a withdrawn player above
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" withdrew from it
      And the tournament player "Pat Player" has the order 40000
      And the tournament player "Pat Player" was entered in it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Pat Player" has the order 5000

    Scenario: The withdrawn player passed over keeps their order
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" withdrew from it
      And the tournament player "Pat Player" has the order 40000
      And the tournament player "Pat Player" was entered in it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's player "Alex Another" has the order 30000

    Scenario: The room between two players ends at a withdrawn one between them
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the player "Pat Player" withdrew from it
      And the tournament player "Kim Keeper" has the order 50000
      And the tournament player "Kim Keeper" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is moved down
      Then the competition's player "Sam Someone" has the order 30000

  Rule: The first cannot go up, nor the last down, and trying records nothing

    Scenario: Moving the first player up records nothing
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is moved up
      Then it has recorded 0 events

    Scenario: Moving the last player down records nothing
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved down
      Then it has recorded 0 events

  Rule: Only a player there is, and one who has not withdrawn, can be moved

    Scenario: Moving a player the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the player "competition-player/123e4567-e89b-42d3-a456-426614174000" is moved up by their id
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: Moving a withdrawn player is refused
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then it is refused with "CompetitionPlayer.Withdrawn"

  Rule: A knockout with a game has its draw fixed

    Scenario: Moving a player in a knockout with a game is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then it is refused with "Competition.DrawFixed"

    Scenario: Moving a player in a knockout whose only game is archived is not refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's second player is "Pat Player"

    Scenario: Moving a player in a knockout with no games is not refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Alex Another" is moved up
      Then the competition's first player is "Alex Another"

    Scenario: Moving a player in a block with a game is not refused
      Given the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is moved up
      Then the competition's second player is "Pat Player"

  Rule: A bye is moved by its place in the order

    Background:
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Alex Another" has the order 20000
      And the tournament player "Sam Someone" was entered in it
      And the tournament player "Alex Another" was entered in it
      And a bye was entered in it

    Scenario: A bye moved up comes before the player above it
      Given the competition is rebuilt from its stream
      When the bye with the order 30000 is moved up
      Then the competition's second player is a bye

    Scenario: A bye moved down comes after the player below it
      Given the tournament player "Chris Third" has the order 40000
      And the tournament player "Chris Third" was entered in it
      And the competition is rebuilt from its stream
      When the bye with the order 30000 is moved down
      Then the competition's fourth player is a bye

    Scenario: Of two byes, only the one moved moves
      Given a bye was entered in it
      And the competition is rebuilt from its stream
      When the bye with the order 30000 is moved up
      Then the competition's third player is "Alex Another"

    Scenario: A bye with no such order is refused
      Given the competition is rebuilt from its stream
      When the bye with the order 15000 is moved up
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: Moving a bye in a knockout with a game is refused
      Given a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the bye with the order 30000 is moved up
      Then it is refused with "Competition.DrawFixed"
