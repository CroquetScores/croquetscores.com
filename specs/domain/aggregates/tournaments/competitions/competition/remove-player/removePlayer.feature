Feature: Removing a competition's player

  A player entered in a competition by mistake is removed: taken out of it,
  and not kept, set aside or able to be put back (`CompetitionPlayer.feature`).
  Nothing is lost by it, since a player with no games has nothing in the
  competition but their place, and the tournament player they are is
  untouched, so they can be entered again as anybody new is
  (`enterPlayer.feature`).

  A withdrawn player cannot be removed, since withdrawing is what is done to
  somebody who has played, and their withdrawal is reversed first. A player
  who has any games in the competition cannot be removed either, since the
  games would then be against somebody who is no longer there. The games are
  the competition's own (`addGame.feature`), so it knows, and an archived game
  counts, since it can be restored.

  A knockout is drawn in the competition's order, so once it has a game,
  archived or not, removing a player, who would move others in the draw, is
  refused. Whatever asks says what kind of competition it is; the scenarios
  here are about a block unless they say otherwise.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  A bye is removed by its place in the competition's order, since every bye
  has the same id (`enterPlayer.feature`): the bye with the order it has.
  Nothing is lost with it, since it is nobody and has no games, but a
  knockout with a game has its byes fixed as it has its players.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it

  Rule: A player removed is no longer in the competition

    Scenario: Removing a player records it
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then it has recorded 1 event
      And the first thing it recorded is a player being removed

    Scenario: A player removed is not in the competition
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition does not have the tournament player "Sam Someone"

    Scenario: The players left keep their orders
      Given the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition's player "Alex Another" has the order 20000

    Scenario: A competition rebuilt after a player was removed does not have them
      Given the player "Sam Someone" was removed from it
      When the competition is rebuilt from its stream
      Then the competition does not have the tournament player "Sam Someone"

  Rule: A withdrawn player cannot be removed

    Scenario: Removing a withdrawn player is refused
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A withdrawn player refused is still in the competition
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition has the tournament player "Sam Someone"

  Rule: Only a player there is can be removed

    Scenario: Removing a player the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the player "competition-player/123e4567-e89b-42d3-a456-426614174000" is removed by their id
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: A player with games cannot be removed

    Scenario: Removing a player who has won a game is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then it is refused with "CompetitionPlayer.HasGames"

    Scenario: Removing a player who has lost a game is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Alex Another" beating "Sam Someone" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then it is refused with "CompetitionPlayer.HasGames"

    Scenario: Removing a player whose only game is archived is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then it is refused with "CompetitionPlayer.HasGames"

    Scenario: Removing a player with no games while others have played is not refused
      Given the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the game of "Alex Another" beating "Pat Player" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition does not have the tournament player "Sam Someone"

  Rule: A knockout with a game has its draw fixed

    Scenario: Removing a player with no games from a knockout with a game is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is removed
      Then it is refused with "Competition.DrawFixed"

  Rule: A bye is removed by its place in the order

    Background:
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Sam Someone" has the order 10000
      And the tournament player "Sam Someone" was entered in it
      And a bye was entered in it

    Scenario: A bye removed is no longer in the competition
      Given the competition is rebuilt from its stream
      When the bye with the order 20000 is removed
      Then the competition has 0 byes

    Scenario: Of two byes, only the one removed goes
      Given a bye was entered in it
      And the competition is rebuilt from its stream
      When the bye with the order 30000 is removed
      Then the competition's bye has the order 20000

    Scenario: A bye with no such order is refused
      Given the competition is rebuilt from its stream
      When the bye with the order 15000 is removed
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: Removing a bye in a knockout with a game is refused
      Given the tournament player "Alex Another" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the bye with the order 20000 is removed
      Then it is refused with "Competition.DrawFixed"
