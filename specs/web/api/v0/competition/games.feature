@postgres
Feature: An app reads the games of a competition

  An app that follows a tournament asks the API for every game of a competition,
  at `/api/v0/tournaments/{id}/competitions/{id}/games`, named as the standings
  are (`standings.feature`). The answer begins with the competition, and then
  says each game in the order it was added: its id, who won and who lost with
  each one's score as it was typed, so that a peel is told as "26tp", whether it
  was drawn, whether it was played but counts for nothing, and when it last
  changed: when it was added, or corrected, moved, withdrawn, archived or
  restored after. A knockout's game also says the round it was played in, the first being
  1. A Swiss's does not, since Swiss on the site is also used for the extra
  games players play outside a tournament's official competitions, and says
  nothing of a round.

  A player is named by the id the tournament keeps them by, which does not
  change, so that an app can follow them from one competition to the next.
  Where a game was drawn, the site still keeps one player as the winner and
  the other as the loser, which says nothing but the order they were typed in.

  A test is a match between two teams, each of its matches between a player of
  each, and says its games under the match they are in, since that is where
  they are read.

  The conventions are those of the other reads (`standings.feature`).

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: A block's games are told in the order they were added

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: A game is listed
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API answers 200
      And the games listed are "Sam Someone beating Alex Another"

    Scenario: A game says its id
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says its id

    Scenario: A game says the winner's score
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says the winner scored "26"

    Scenario: A game says the loser's score
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says the loser scored "17"

    Scenario: A peel is told in the score
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Block A" of "Spring Open"
      And "Pat Player" has beaten "Alex Another" 26tp to 12 in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Pat Player" beating "Alex Another" says the winner scored "26tp"

    Scenario: A game names its players by the id the tournament keeps them by
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" names the winner by the id the tournament keeps them by
      And the game of "Sam Someone" beating "Alex Another" names the loser by the id the tournament keeps them by

    Scenario: A game that was not drawn says so
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was not drawn

    Scenario: A game says when it last changed
      Given the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Block A" of "Spring Open"
      And "Pat Player" has beaten "Alex Another" 26 to 12 in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Pat Player" beating "Alex Another" says it last changed at "2026-10-05T10:00:00.000Z"

    Scenario: A game changed later says when it was
      Given the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it last changed at "2026-10-05T10:00:00.000Z"

    Scenario: A game says when it last changed and not when another did
      Given the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Block A" of "Spring Open"
      And "Pat Player" has beaten "Alex Another" 26 to 12 in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it last changed at "2026-10-03T10:00:00.000Z"

    Scenario: A game withdrawn says so
      Given "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was withdrawn

    Scenario: A game says no round
      When the games of "Block A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was played in no round

    Scenario: A game archived is not listed
      Given "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then no games are listed

    Scenario: A block with no games lists none
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the games of "Block B" in "Spring Open" are read with that key
      Then no games are listed

    Scenario: A block begins with the competition
      When the games of "Block A" in "Spring Open" are read with that key
      Then the games are of the competition "Block A", a block

    Scenario: A drawn game says so
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block C" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block C" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block C" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 13 to 13 in "Block C" of "Spring Open"
      When the games of "Block C" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was drawn

  Rule: A Swiss's games say no round

    Background:
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Swiss A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Swiss A" of "Spring Open"

    Scenario: A game is listed
      When the games of "Swiss A" in "Spring Open" are read with that key
      Then the games listed are "Sam Someone beating Alex Another"

    Scenario: A game says no round
      When the games of "Swiss A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was played in no round

    Scenario: A game says the winner's score
      When the games of "Swiss A" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says the winner scored "26"

    Scenario: A Swiss begins with the competition
      When the games of "Swiss A" in "Spring Open" are read with that key
      Then the games are of the competition "Swiss A", a swiss

  Rule: A knockout's games say their round

    Background:
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 5 in "Final Stage" of "Spring Open"

    Scenario: A game of the first round says the first
      When the games of "Final Stage" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Alex Another" says it was played in round 1

    Scenario: A game of the second round says the second
      When the games of "Final Stage" in "Spring Open" are read with that key
      Then the game of "Sam Someone" beating "Chris Third" says it was played in round 2

    Scenario: Every game is listed in the order it was added
      When the games of "Final Stage" in "Spring Open" are read with that key
      Then the games listed are "Sam Someone beating Alex Another" and "Sam Someone beating Chris Third"

    Scenario: A knockout begins with the competition
      When the games of "Final Stage" in "Spring Open" are read with that key
      Then the games are of the competition "Final Stage", a knockout

  Rule: A test's games are told under their matches

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"

    Scenario: A match is listed with its players
      When the games of "AUS v ENG" in "Spring Tests" are read with that key
      Then the answer lists a match between "Sam Someone" and "Chris Third"

    Scenario: A match says its game
      When the games of "AUS v ENG" in "Spring Tests" are read with that key
      Then the match between "Sam Someone" and "Chris Third" has the game of "Sam Someone" beating "Chris Third"

    Scenario: A game of a match says the winner's score
      When the games of "AUS v ENG" in "Spring Tests" are read with that key
      Then the game of "Sam Someone" beating "Chris Third" in the match says the winner scored "26"

    Scenario: A test begins with the competition
      When the games of "AUS v ENG" in "Spring Tests" are read with that key
      Then the games are of the competition "AUS v ENG", a test

  Rule: A tournament or a competition there is not is answered not found

    Scenario: A tournament there is not is answered not found
      When the games of a competition in a tournament there is not are read with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A competition there is not is answered not found
      When the games of a competition there is not in "Spring Open" are read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

    Scenario: A competition archived is answered not found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

  Rule: A caller is known as the other reads know one

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"

    Scenario: The games are read with no key
      When the games of "Block A" in "Spring Open" are read with no key
      Then the API answers 200

    Scenario: A key that does not work is refused
      When the games of "Block A" in "Spring Open" are read with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A key made for another tournament is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "reader@example.com" has made a key limited to the tournament "Autumn Open"
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API answers 403
      And the API's code is "ApiKey.LimitedToAnotherTournament"

  Rule: An answer unchanged is answered not modified

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

    Scenario: An answer carries a mark of what it said
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given the games of "Block A" in "Spring Open" are read with that key
      When the games of "Block A" in "Spring Open" are read again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: A game played is answered in full
      Given the games of "Block A" in "Spring Open" are read with that key
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are read again with that key and the mark it gave
      Then the API answers 200
      And the games listed are "Sam Someone beating Alex Another"

    Scenario: The answer is kept by the app and not by anybody between
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API says the answer is for the app to keep and to check before it uses it
