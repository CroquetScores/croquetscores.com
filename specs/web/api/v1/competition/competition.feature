@postgres
Feature: An app reads a competition and is led to its games and its standings

  An app that follows a tournament asks the API for one of its competitions, at
  `/api/v1/tournaments/{id}/competitions/{id}`, named as the games and the
  standings are (`games.feature`, `standings.feature`). It is told what the
  competition is: its id, its name, which kind it is, where its page is on the
  site (its uri, a path beginning with a slash), where the API tells of it (its
  href) and when it last changed.

  And it is led to what it will want of it: `games` is where the API tells of
  its games, which every competition has, and `standings` is where it tells of
  its standings, which only a block and a Swiss have. A knockout and a test
  say no `standings`, so that an app that finds one knows it can ask.

  The conventions are those of the other reads (`tournament.feature`).

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The competition says what it is

    Scenario: A competition says its id
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the API answers 200
      And the competition read says its id

    Scenario: A competition says its name
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its name is "Block A"

    Scenario: A block says it is a block
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its kind is "block"

    Scenario: A Swiss says it is a Swiss
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      When the competition "Swiss A" of "Spring Open" is read with that key
      Then the competition read says its kind is "swiss"

    Scenario: A competition says where its page is on the site
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its uri is "/2026/ac/spring-open/competitions/block-a"

    Scenario: A competition says where the API tells of it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its href is its own address in the API

    Scenario: A competition says when it last changed
      Given the server's clock reads "2026-10-04T10:00:00Z"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says it last changed at "2026-10-04T10:00:00.000Z"

    Scenario: A test says where its page is on the site
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the competition "AUS v ENG" of "Spring Tests" is read with that key
      Then the competition read says its uri begins "/2026/ac/spring-tests/tests/"

  Rule: The competition leads to its games and its standings

    Scenario: A block leads to its games
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its games are at its own address in the API

    Scenario: A block leads to its standings
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the competition read says its standings are at its own address in the API

    Scenario: A Swiss leads to its games
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      When the competition "Swiss A" of "Spring Open" is read with that key
      Then the competition read says its games are at its own address in the API

    Scenario: A Swiss leads to its standings
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      When the competition "Swiss A" of "Spring Open" is read with that key
      Then the competition read says its standings are at its own address in the API

    Scenario: A knockout leads to its games
      Given "organiser@example.com" has added the knockout "Knockout A" to "Spring Open"
      When the competition "Knockout A" of "Spring Open" is read with that key
      Then the competition read says its games are at its own address in the API

    Scenario: A knockout says no standings
      Given "organiser@example.com" has added the knockout "Knockout A" to "Spring Open"
      When the competition "Knockout A" of "Spring Open" is read with that key
      Then the competition read says no standings

    Scenario: A test leads to its games and says no standings
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the competition "AUS v ENG" of "Spring Tests" is read with that key
      Then the competition read says its games are at its own address in the API
      And the competition read says no standings

  Rule: A tournament or a competition there is not is answered not found

    Scenario: A tournament there is not is answered not found
      When a competition in a tournament there is not is read with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A competition there is not is answered not found
      When a competition there is not in "Spring Open" is read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

    Scenario: A competition archived is answered not found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the API answers 404
      And the API's code is "Competition.NotFound"

  Rule: A caller is known as the other reads know one

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"

    Scenario: The competition is read with no key
      When the competition "Block A" of "Spring Open" is read with no key
      Then the API answers 200

    Scenario: A key that does not work is refused
      When the competition "Block A" of "Spring Open" is read with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A key made for another tournament is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "reader@example.com" has made a key limited to the tournament "Autumn Open"
      When the competition "Block A" of "Spring Open" is read with that key
      Then the API answers 403
      And the API's code is "ApiKey.LimitedToAnotherTournament"

  Rule: An answer unchanged is answered not modified

    Background:
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"

    Scenario: The same question is answered not modified once its mark is sent
      Given the competition "Block A" of "Spring Open" is read with that key
      When the competition "Block A" of "Spring Open" is read again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: The answer is kept by the app and not by anybody between
      When the competition "Block A" of "Spring Open" is read with that key
      Then the API says the answer is for the app to keep and to check before it uses it
