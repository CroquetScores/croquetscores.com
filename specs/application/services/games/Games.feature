@postgres
Feature: Asking whether games have been played

  Some of what can be done to a tournament depends on whether games have been
  played. A player who has played any, in any of its competitions, cannot be
  archived (`archivePlayer.feature`), and a knockout's draw cannot be changed
  so as to move a player who has played in it (`updateKnockout.feature`). The
  tournament does not know about games: they are kept by its competitions
  (`addGame.feature`). So the application asks its games, and this is what it
  wants of that asking.

  Each answer is yes or no, and only that. The games are never told what to do
  about it: refusing is the tournament's, and is specified with it.

  The games are the ones the tournament's competitions keep, archived
  competitions among them, and an archived game counts as much as any other,
  since it can be restored. A player has played if they won or lost any game
  in any of them. A knockout's draw is fixed once it has a game
  (`addGame.feature`), so a change to the draw of a knockout that has a game
  moves a player who has played, and a change to one that has none moves
  nobody.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: A player has played if they won or lost a game in any of the tournament's competitions

    Scenario: A player who has played no games has not played
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say no

    Scenario: A player who won a game has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say yes

    Scenario: A player who lost a game has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games are asked whether the player "Alex Another" of "Spring Open" has played
      Then they say yes

    Scenario: A player who has not played while others have has not played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games are asked whether the player "Chris Third" of "Spring Open" has played
      Then they say no

    Scenario: A player whose only game is archived has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say yes

    Scenario: A player who has played only in an archived competition has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say yes

    Scenario: A player who has played in another tournament has not played in this one
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say no

  Rule: A change to the draw of a knockout that has a game moves a player who has played

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"

    Scenario: A change to the draw of a knockout with no games moves nobody who has played
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say no

    Scenario: A change to the draw of a knockout with a game moves a player who has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say yes

    Scenario: A change to the draw of a knockout whose only game is archived moves a player who has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say yes

    Scenario: A game in another competition moves nobody in the knockout
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say no
