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

  A player in a team who has played any game in use in a test cannot be
  archived either (`archiveTeamPlayer.feature`), and a test's games are kept
  by the test as any competition's are (`gamesInATest.feature`).

  A test with any games in use keeps its teams, and how far it has been
  played bounds what its expected matches and its best-of can be changed to
  (`updateTest.feature`): so the games say how many of a test's matches have
  started, a match starting once its two players have a game in use, and the
  most games in use any two of its players have played.

  The games are the ones the tournament's competitions keep, archived
  competitions among them. An archived game counts for nothing, here as
  anywhere games are counted (`archiveGame.feature`), so only the games in
  use are asked about. A player has played if they won or lost any game in
  use in any of them. A knockout's draw is fixed once it has a game in use
  (`addGame.feature`), so a change to the draw of a knockout that has one
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

    Scenario: A player whose only game is archived has not played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games are asked whether the player "Sam Someone" of "Spring Open" has played
      Then they say no

    Scenario: A player with a game in use as well as one archived has played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 10 in "Block A" of "Spring Open"
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

  Rule: A change to the places of a knockout that has a game in use moves a player who has played

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"

    Scenario: A change to the draw of a knockout with no games moves nobody who has played
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say no

    Scenario: A change to the draw of a knockout with a game moves a player who has played
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say yes

    Scenario: A change to the draw of a knockout whose only game is archived moves nobody who has played
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say no

    Scenario: A game in another competition moves nobody in the knockout
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games are asked whether changing the draw of "Final Stage" of "Spring Open" to 8 places moves a player who has played
      Then they say no

  Rule: A change to what a round of a knockout is the best of moves nobody

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"

    Scenario: A change to the best-of of the final of a knockout with a game moves nobody who has played
      When the games are asked whether making the final of "Final Stage" of "Spring Open" the best of 3 moves a player who has played
      Then they say no

  Rule: A player in a team has played if they won or lost a game in any of the tournament's tests

    Scenario: A player in a team who has not played says no
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the games are asked whether the player "Pat Player" of the team "Australia" of "Spring Tests" has played
      Then they say no

    Scenario: A player in a team who won a game says yes
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked whether the player "Pat Player" of the team "Australia" of "Spring Tests" has played
      Then they say yes

    Scenario: A player in a team who lost a game says yes
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked whether the player "Kim Keeper" of the team "England" of "Spring Tests" has played
      Then they say yes

    Scenario: A player in a team whose only game is archived says no
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the games are asked whether the player "Pat Player" of the team "Australia" of "Spring Tests" has played
      Then they say no

  Rule: A test has games if it has any game in use

    Scenario: A test with no games says no
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the games are asked whether "AUS v ENG" of "Spring Tests" has any games
      Then they say no

    Scenario: A test with a game says yes
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked whether "AUS v ENG" of "Spring Tests" has any games
      Then they say yes

    Scenario: A test whose only game is archived says no
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the games are asked whether "AUS v ENG" of "Spring Tests" has any games
      Then they say no

  Rule: A test's matches started are the pairs of players with a game in use

    Scenario: A test with no games has no matches started
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the games are asked how many matches of "AUS v ENG" of "Spring Tests" have started
      Then they say 0

    Scenario: Two games between the same players are one match started
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked how many matches of "AUS v ENG" of "Spring Tests" have started
      Then they say 1

    Scenario: Games between different pairs are a match started each
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Jo Jones" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And the test is to be expected to have 21 matches
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Jo Jones" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked how many matches of "AUS v ENG" of "Spring Tests" have started
      Then they say 2

    Scenario: A match whose only game is archived has not started
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the games are asked how many matches of "AUS v ENG" of "Spring Tests" have started
      Then they say 0

  Rule: The most games two players have played in a test counts the games in use alone

    Scenario: The most games is the games of the pair who have played most
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Jo Jones" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And the test is to be expected to have 21 matches
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Jo Jones" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the games are asked the most games two players have played in "AUS v ENG" of "Spring Tests"
      Then they say 2

    Scenario: An archived game is not counted
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Kim Keeper" beating "Pat Player" in "AUS v ENG" of "Spring Tests"
      When the games are asked the most games two players have played in "AUS v ENG" of "Spring Tests"
      Then they say 1
