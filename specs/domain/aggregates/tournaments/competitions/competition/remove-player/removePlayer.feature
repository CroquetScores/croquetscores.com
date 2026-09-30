Feature: Removing a competition's player

  A player entered in a competition by mistake is removed: taken out of it,
  and not kept, set aside or able to be put back (`CompetitionPlayer.feature`).
  Nothing is lost by it, since a player with no games has nothing in the
  competition but their place, and the tournament player they are is
  untouched, so they can be entered again as anybody new is
  (`enterPlayer.feature`).

  A withdrawn player cannot be removed, since withdrawing is what is done to
  somebody who has played, and their withdrawal is reversed first. A player
  who has any games in use in the competition cannot be removed either, since
  the games would then be against somebody who is no longer there. The games
  are the competition's own (`addGame.feature`), so it knows.

  Only the games in use count. An archived game counts for nothing
  (`archiveGame.feature`), so it does not keep a player in. A player removed
  takes their archived games with them: each would be against somebody who is
  no longer there, and could never be restored, since restoring a game is
  refused where one of its players is not playing (`restoreGame.feature`).

  A knockout is drawn in the competition's order, so once it has a game in
  use, removing a player, who would move others in the draw, is refused. An
  archived game fixes nothing (`addGame.feature`), so a knockout whose only
  games are archived has its players removed as a block does. Whatever asks says what kind of competition it is; the scenarios
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

  Rule: A player with games in use cannot be removed

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

    Scenario: Removing a player whose only game is archived is not refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition does not have the tournament player "Sam Someone"

    Scenario: Removing a player with a game in use as well as one archived is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Alex Another" beating "Sam Someone" 26 to 10 was added to it
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

  Rule: A player removed takes their archived games with them

    Background:
      Given the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived

    Scenario: The archived game of a player removed is no longer the competition's
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition has 0 games

    Scenario: The games of the players left are kept
      Given the game of "Alex Another" beating "Pat Player" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition has the game of "Alex Another" beating "Pat Player" 26 to 3

    Scenario: The archived games of the players left are kept
      Given the game of "Alex Another" beating "Pat Player" 26 to 3 was added to it
      And the game of "Alex Another" beating "Pat Player" 26 to 3 was archived
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is removed
      Then the competition has 1 game

    Scenario: A competition rebuilt after a player was removed does not have their archived games
      Given the player "Sam Someone" was removed from it
      When the competition is rebuilt from its stream
      Then the competition has 0 games

  Rule: A knockout with a game in use has its draw fixed

    Scenario: Removing a player with no games from a knockout with a game is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the player "Pat Player" is removed
      Then it is refused with "Competition.DrawFixed"

    Scenario: Removing a player with no games from a knockout whose only game is archived is not refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the player "Pat Player" is removed
      Then the competition does not have the tournament player "Pat Player"

  Rule: Either player of a knockout's only game, archived, can be removed

    The knockout has two places, its one round the best of 1, and the game
    between its two players has been archived.

    Background:
      Given the competition is a knockout of 2 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream

    Scenario Outline: Either player is removed
      When the player "<player>" is removed
      Then the competition does not have the tournament player "<player>"

      Examples:
        | player       |
        | Sam Someone  |
        | Alex Another |

    Scenario Outline: The archived game goes with whichever is removed
      When the player "<player>" is removed
      Then the competition has 0 games

      Examples:
        | player       |
        | Sam Someone  |
        | Alex Another |

  Rule: A bye is removed by its place in the order

    Sam Someone is entered with the order 10,000, so the bye entered after them has
    20,000.

    Background:
      Given the competition is a knockout of 4 places, each round the best of 1
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

    Scenario: Removing a bye in a knockout whose only game is archived is not refused
      Given the tournament player "Alex Another" was entered in it
      And a bye was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the bye with the order 20000 is removed
      Then the competition has 1 bye
