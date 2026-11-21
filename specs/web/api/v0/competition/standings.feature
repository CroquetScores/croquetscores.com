@postgres
Feature: An app reads the standings of a block or a Swiss

  An app that follows a tournament asks the API where each player stands in a
  block or a Swiss, at
  `/api/v0/tournaments/{id}/competitions/{id}/standings`, with the tournament
  and the competition named by the part of their ids after their kind, as the
  tournament is (`tournament.feature`). It is told, for each player in the
  order of the places, how many they have played and won, their net hoops and
  their place, as the competition's page on the site shows them, and the
  answer begins with the competition: its id, name, kind, where the API tells
  of it, and when it last changed.

  In a block a player has played the matches that have been decided, and won
  those they won; a block also says how many they lost, how many games they
  won, and their net games, since a block's places depend on them. In a Swiss
  a player has played and won games. A place a block shares says so, as the
  site marks it "=2". A player who has withdrawn has no place, and comes last.

  A knockout has no standings, and nor has a test, and each is answered as
  such. The conventions are those of the other reads: a caller with no key is
  answered as a caller with a key is, a key that does not work is refused, a
  key made for one tournament reads that tournament and no other, every answer
  has an `ETag` and a `Last-Modified` and one the app already has is answered
  `304`, and an error has a code and a sentence.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: A block's players stand in the order of its places

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The players are listed best first
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API answers 200
      And the standings list "Sam Someone" and then "Alex Another"

    Scenario: A player says their place
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says their place is 1
      And the standing of "Alex Another" says their place is 2

    Scenario: A player says how many matches they have played
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says they have played 1
      And the standing of "Alex Another" says they have played 1

    Scenario: A player says how many matches they have won
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says they have won 1

    Scenario: A player says how many matches they have lost
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says they have lost 1

    Scenario: A player says how many games they have won
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says they have won 1 games

    Scenario: A player says their net games
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says their net games are -1

    Scenario: A player says their net hoops
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says their net hoops are 9

    Scenario: A player carries a mark of their standing
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says a mark of itself

    Scenario: A player is named by the id the tournament keeps them by
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" names them by the id the tournament keeps them by

    Scenario: A player who has withdrawn says so and has no place
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says they have withdrawn
      And the standing of "Alex Another" says they have no place

    Scenario: A player who has withdrawn comes last
      Given "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standings list "Alex Another" and then "Sam Someone"

    Scenario: Players level share a place
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Pat Player" 26 to 17 in "Block B" of "Spring Open"
      And "Pat Player" has beaten "Sam Someone" 26 to 17 in "Block B" of "Spring Open"
      When the standings of "Block B" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says the place is shared

    Scenario: A block begins with the competition
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standings are of the competition "Block A", a block

    Scenario: A block says where the API tells of it
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standings say where the API tells of the competition "Block A"

    Scenario: A block says when it last changed
      Given the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the standings say the competition last changed at "2026-10-05T10:00:00.000Z"

  Rule: A Swiss's players stand in the order they are ranked

    Background:
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Swiss A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Swiss A" of "Spring Open"

    Scenario: The players are listed best first
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standings list "Sam Someone" and then "Alex Another"

    Scenario: A player says their place
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says their place is 2

    Scenario: A player says how many games they have played
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says they have played 1

    Scenario: A player says how many games they have won
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says they have won 1

    Scenario: A player says their net hoops
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says their net hoops are 9

    Scenario: A Swiss says nothing of matches lost or net games
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Sam Someone" says nothing of matches lost
      And the standing of "Sam Someone" says nothing of net games

    Scenario: A player who has withdrawn has no place
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Swiss A" of "Spring Open"
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standing of "Alex Another" says they have no place

    Scenario: A Swiss begins with the competition
      When the standings of "Swiss A" in "Spring Open" are read with that key
      Then the standings are of the competition "Swiss A", a swiss

  Rule: A knockout and a test have no standings

    Scenario: A knockout has none
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      When the standings of "Final Stage" in "Spring Open" are read with that key
      Then the API answers 404
      And the API's code is "Competition.HasNoStandings"

    Scenario: A test has none
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the standings of "AUS v ENG" in "Spring Tests" are read with that key
      Then the API answers 404
      And the API's code is "Competition.HasNoStandings"

  Rule: A tournament or a competition there is not is answered not found

    Scenario: A tournament there is not is answered not found
      When the standings of a competition in a tournament there is not are read with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A competition there is not is answered not found
      When the standings of a competition there is not in "Spring Open" are read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

    Scenario: A competition archived is answered not found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

    Scenario: A competition of another tournament is answered not found
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the standings of "Block A" of "Spring Open" are read as a competition of "Autumn Open"
      Then the API answers 404
      And the API's code is "Competition.NotFound"

  Rule: A caller is known as the other reads know one

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"

    Scenario: The standings are read with no key
      When the standings of "Block A" in "Spring Open" are read with no key
      Then the API answers 200

    Scenario: A key that does not work is refused
      When the standings of "Block A" in "Spring Open" are read with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A key made for another tournament is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "reader@example.com" has made a key limited to the tournament "Autumn Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API answers 403
      And the API's code is "ApiKey.LimitedToAnotherTournament"

    Scenario: A key made for the tournament reads it
      Given "reader@example.com" has made a key limited to the tournament "Spring Open"
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API answers 200

  Rule: An answer unchanged is answered not modified

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

    Scenario: An answer carries a mark of what it said
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API gives a mark of its answer

    Scenario: An answer says when it last changed
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API says when its answer last changed

    Scenario: The same question is answered not modified once its mark is sent
      Given the standings of "Block A" in "Spring Open" are read with that key
      When the standings of "Block A" in "Spring Open" are read again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: A game played is answered in full
      Given the standings of "Block A" in "Spring Open" are read with that key
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the standings of "Block A" in "Spring Open" are read again with that key and the mark it gave
      Then the API answers 200
      And the standing of "Sam Someone" says they have won 1

    Scenario: The answer is kept by the app and not by anybody between
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API says the answer is for the app to keep and to check before it uses it
