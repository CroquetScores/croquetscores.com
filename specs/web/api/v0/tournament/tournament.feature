@postgres
Feature: An app reads a tournament, its competitions and its players

  An app that follows a tournament asks the API for it, at
  `/api/v0/tournaments/{id}`, with the tournament named by the part of its id
  after "tournament/", as the permissions are (`permissions.feature`). It is
  told what the tournament is, which competitions it has and which players
  are entered in it, so that an app can list a tournament and the people in it
  before a game has been played, and tell the people it follows when one of
  them enters.

  The tournament says what the list of a year says of it (`tournaments.feature`)
  and when it last changed. Each competition says its id, its name, which kind
  it is, where its page is on the site (its uri) and where the API tells of it
  (its href), and when it last changed, and each player their id, name, the name the
  world rankings know them by, their handicap and who they represent, where
  they have one. A kind is a block, a Swiss, a knockout or a test, which is
  the site's word for a match between two teams. A tournament played by teams
  says its teams, each with its players, and has no players of its own.

  Each competition, each player and each team carries an `etag` of its own,
  made of what it says (`tournaments.feature`).

  The site keeps no venue for a tournament, so none is said.

  The conventions are those of the list. A caller with no key is answered as a
  caller with a key is; a key that does not work is refused; every answer has
  an `ETag` and a `Last-Modified`, and one the app already has is answered
  `304`; and an error has a code, the field at fault where there is one, and a
  sentence. A key made for one tournament may read that tournament and no
  other, as it may not write to any other (`permissions.feature`).

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The tournament says what it is

    Scenario: A tournament says its id
      When the tournament "Spring Open" is read with that key
      Then the API answers 200
      And the tournament read says its id

    Scenario: A tournament says its name
      When the tournament "Spring Open" is read with that key
      Then the tournament read says its name is "Spring Open"

    Scenario: A tournament says when it starts
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it starts on "2026-10-03"

    Scenario: A tournament says when it finishes
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it finishes on "2026-10-05"

    Scenario: A tournament says its country
      When the tournament "Spring Open" is read with that key
      Then the tournament read says its country is "au"

    Scenario: A tournament says its region
      When the tournament "Spring Open" is read with that key
      Then the tournament read says its region is "vic"

    Scenario: A tournament says its sport
      When the tournament "Spring Open" is read with that key
      Then the tournament read says its sport is "ac"

    Scenario: A tournament says where the API tells of it
      When the tournament "Spring Open" is read with that key
      Then the tournament read says its href is its own address in the API

    Scenario: A tournament says where it is found on the site
      When the tournament "Spring Open" is read with that key
      Then the tournament read says where it is found

    Scenario: A tournament says when it last changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the tournament "Autumn Open" is national
      When the tournament "Autumn Open" is read with that key
      Then the tournament read says it last changed at "2026-03-02T10:00:00.000Z"

    Scenario: A tournament is read with no key
      When the tournament "Spring Open" is read with no key
      Then the API answers 200

  Rule: The tournament lists its competitions

    Scenario: A block is listed with its id
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists the competition "Block A" with its id

    Scenario: A block says it is a block
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says its kind is "block"

    Scenario: A block says where its page is on the site
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says its uri is "/2026/ac/spring-open/competitions/block-a"

    Scenario: A block says where the API tells of it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says its href is its own address in the API

    Scenario: A test says where its page is on the site
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tournament "Spring Tests" is read with that key
      Then the tournament read lists one competition whose uri is under "/2026/ac/spring-tests/tests/"

    Scenario: A Swiss says it is a Swiss
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Swiss A" says its kind is "swiss"

    Scenario: A knockout says it is a knockout
      Given "organiser@example.com" has added the knockout "Knockout A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Knockout A" says its kind is "knockout"

    Scenario: A test says it is a test
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tournament "Spring Tests" is read with that key
      Then the tournament read lists one competition of the kind "test"

    Scenario: A competition says when it last changed
      Given the server's clock reads "2026-10-04T10:00:00Z"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says it last changed at "2026-10-04T10:00:00.000Z"

    Scenario: A competition has changed when something is done in it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says it last changed at "2026-10-05T10:00:00.000Z"

    Scenario: A tournament has changed when something is done in a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it last changed at "2026-10-05T10:00:00.000Z"

    Scenario: A competition carries a mark of itself
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the competition "Block A" says a mark of itself

    Scenario: A tournament with no competitions lists none
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists no competitions

  Rule: The tournament lists its players

    Scenario: A player is listed with their id
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists the player "Sam Someone" with their id

    Scenario: A player says the name the world rankings know them by
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says their world ranking name is "Samuel Someone"

    Scenario: A player with none given is known by their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says their world ranking name is "Sam Someone"

    Scenario: A player says their handicap
      Given the player is to have the handicap "5"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says their handicap is "5"

    Scenario: A player says who they represent
      Given the player is to represent "Sydney"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says they represent "Sydney"

    Scenario: A player with no handicap says none
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says they have no handicap

    Scenario: A player carries a mark of themselves
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the player "Sam Someone" says a mark of themselves

    Scenario: A player archived is not listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists no players

    Scenario: A tournament played by teams lists its teams and their players
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the tournament "Spring Tests" is read with that key
      Then the tournament read lists the team "Australia" with the player "Pat Player"

  Rule: A team carries a mark

    Scenario: A team carries a mark of itself
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the tournament "Spring Tests" is read with that key
      Then the team "Australia" says a mark of itself

  Rule: A tournament there is not is answered not found

    Scenario: A tournament there is not is answered not found
      When a tournament there is not is read with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A tournament archived is answered not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A key that does not work is refused
      When the tournament "Spring Open" is read with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: A key made for one tournament reads that one and no other

    Scenario: A key made for a tournament reads it
      Given "reader@example.com" has made a key limited to the tournament "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the API answers 200

    Scenario: A key made for another tournament is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "reader@example.com" has made a key limited to the tournament "Autumn Open"
      When the tournament "Spring Open" is read with that key
      Then the API answers 403
      And the API's code is "ApiKey.LimitedToAnotherTournament"

  Rule: An answer unchanged is answered not modified

    Scenario: An answer carries a mark of what it said
      When the tournament "Spring Open" is read with that key
      Then the API gives a mark of its answer

    Scenario: An answer says when it last changed
      When the tournament "Spring Open" is read with that key
      Then the API says when its answer last changed

    Scenario: The same question is answered not modified once its mark is sent
      Given the tournament "Spring Open" is read with that key
      When the tournament "Spring Open" is read again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: The same question is answered not modified once its date is sent
      Given the tournament "Spring Open" is read with that key
      When the tournament "Spring Open" is read again with that key and the date it gave
      Then the API answers 304

    Scenario: Archiving a competition is a change of the tournament
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the server's clock reads "2026-10-05T10:00:00Z"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it last changed at "2026-10-05T10:00:00.000Z"

    Scenario: A change is answered in full
      Given the tournament "Spring Open" is read with that key
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the tournament "Spring Open" is read again with that key and the mark it gave
      Then the API answers 200
      And the tournament read lists the player "Sam Someone" with their id

    Scenario: The answer is kept by the app and not by anybody between
      When the tournament "Spring Open" is read with that key
      Then the API says the answer is for the app to keep and to check before it uses it
