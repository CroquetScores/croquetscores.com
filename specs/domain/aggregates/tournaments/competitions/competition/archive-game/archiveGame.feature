Feature: Archiving a competition's game

  A game entered by mistake is archived (`Game.feature`): kept, with everything
  it says, but set aside, so that it no longer counts. It decides no match
  and sends nobody through (`addGame.feature`), and it can be restored
  (`restoreGame.feature`). An archived game is still one of the
  competition's, listed where it was added.

  In a block or a Swiss, no game depends on another, so any game can be
  archived. In a knockout, the winner of a match goes through to the next
  round, so a game of a match whose winner has since played in the next round
  cannot be archived: taking it away would leave that game played by
  somebody who had not got there. It is the match that sends its winner on,
  not the game, so every game of such a match is held, the games its loser
  won among them. The game in the next round is archived first, and then the
  ones before it can be; a next-round game that is archived holds nothing.

  Archiving a game that is archived records nothing, because nothing
  happened.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it
    And the tournament player "Alex Another" was entered in it
    And the tournament player "Chris Third" was entered in it
    And the tournament player "Pat Fourth" was entered in it

  Rule: A game archived is recorded, and no longer counts

    Scenario: Archiving a game records it
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then it has recorded 1 event
      And the first thing it recorded is a game being archived

    Scenario: An archived game is archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

    Scenario: An archived game is still one of the competition's games
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: An archived game keeps its place among the games
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's first game is of "Sam Someone" beating "Alex Another"

    Scenario: A competition rebuilt after a game was archived has it archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

  Rule: Only a game there is can be archived

    Scenario: Archiving a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174000" is archived by its id
      Then it is refused with "Competition.NoSuchGame"

  Rule: Archiving an archived game records nothing

    Scenario: Archiving an archived game records nothing
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then it has recorded 0 events

    Scenario: Archiving an archived game is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then it is not refused

  Rule: In a block or a Swiss, any game can be archived

    Scenario: A game in a block whose winner has played since can be archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

    Scenario: A game in a Swiss whose winner has played since can be archived
      Given the competition is a Swiss
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

  Rule: In a knockout, no game of a match whose winner has played on can be archived

    The knockout has four places, its first round the best of 3 and its
    second the best of 1, so Sam Someone meets Alex Another and Chris Third
    meets Pat Fourth, and the winners meet in the final.

    Background:
      Given the competition is a knockout of 4 places, its first round the best of 3 and its second the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 5 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 1 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 2 was added to it

    Scenario: A game of a match whose winner has not played on can be archived
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

    Scenario: A game won by the winner of a match who has played on cannot be archived
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: A game won by the loser of a match whose winner has played on cannot be archived
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is archived
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: A game of a match whose winner lost in the next round cannot be archived either
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Pat Fourth" 26 to 1 is archived
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: The game in the next round can be archived
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 3 is archived
      Then the competition's game of "Sam Someone" beating "Chris Third" 26 to 3 is archived

    Scenario: A game of a match whose winner's next game is archived can be archived
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

    Scenario: A refused game is not archived
      Given the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived
