@postgres
Feature: Who may change something through the API

  What the API changes, it changes for an account, and says which in one of
  two ways. A reader signed in to the website, whose own pages call the API,
  is known by the session their browser holds. An app is known by its key,
  which it sends as a bearer token (`permissions.feature`). Every route that
  changes something takes either, so that the website's pages and other
  people's software call the same routes and neither has a set of its own.

  A request that sends a key is judged by the key and by nothing else, even
  where a session came with it: a key that does not work is not mended by the
  reader's being signed in, since an app that sent one meant to be known by it.
  A key made only to read may not change anything, and a key made for one
  tournament changes that one and no other, which includes making a new one.

  A request that is neither signed in nor carries a key is answered as one
  that sent no key is, `401` with `ApiKey.Missing`, which it can mend by
  sending one. What a key that does not work is answered is as ever
  `ApiKey.Invalid` and no more.

  These scenarios use the creating of a tournament, since a route is needed
  to ask them of. The scenarios of each route say what it does.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: A reader signed in to the website may change what they may

    Scenario: A reader who is signed in is known by their session
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is created
      Then the API answers 201

    Scenario: A request that is neither signed in nor sends a key is told the key is missing
      When the tournament "Spring Open" is created
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A request refused for being neither says how to send a key
      When the tournament "Spring Open" is created
      Then the API asks for a bearer token

  Rule: An app may change what its key may

    Scenario: A key that may write is known by its key
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the tournament "Spring Open" is created
      Then the API answers 201

    Scenario: A key that was never made is told it does not work
      Given the caller sends the key "cs_notakey"
      When the tournament "Spring Open" is created
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A key that does not work is not mended by a session
      Given the caller is signed in as "organiser@example.com"
      And the caller sends the key "cs_notakey"
      When the tournament "Spring Open" is created
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A key made only to read may not change anything
      Given "organiser@example.com" has made a key that may only read
      And the caller sends that key
      When the tournament "Spring Open" is created
      Then the API answers 403
      And the API's code is "ApiKey.ReadOnly"

    Scenario: A key made for one tournament may not make another
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has made a key limited to the tournament "Spring Open" that may write
      And the caller sends that key
      When the tournament "Summer Open" is created
      Then the API answers 403
      And the API's code is "ApiKey.LimitedToAnotherTournament"

  Rule: What is answered is for the one who asked

    Scenario: A refusal is not kept
      When the tournament "Spring Open" is created
      Then the API says the answer is not to be kept

  Rule: A key may do what the account it was made for may do

    The key is the account's, so it has the part in a tournament that the
    account has and no more. Somebody with no part in a tournament cannot change
    it by making a key, and a scorer's key records scores and changes nothing
    else.

    Background:
      Given "stranger@example.com" has an account, confirmed, called "Sam Stranger"
      And "scorer@example.com" has an account, confirmed, called "Sue Scorer"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
      And "organiser@example.com" has added the player "Bob Bowler" to "Spring Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Bob Bowler" in "Block A" of "Spring Open"

    Scenario: A key of a manager may change the tournament
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the block "Block B" is added to "Spring Open"
      Then the API answers 201

    Scenario: A key of somebody with no part in the tournament may not change it
      Given "stranger@example.com" has made a key that may read and write
      And the caller sends that key
      When the block "Block B" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: A key of somebody with no part in the tournament may not record a game
      Given "stranger@example.com" has made a key that may read and write
      And the caller sends that key
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManagerOrScorer"

    Scenario: A key of a scorer may record a game
      Given "scorer@example.com" has made a key that may read and write
      And the caller sends that key
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 201

    Scenario: A key of a scorer may not change the tournament
      Given "scorer@example.com" has made a key that may read and write
      And the caller sends that key
      When the block "Block B" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: A key that may only read may not record a game
      Given "organiser@example.com" has made a key that may only read
      And the caller sends that key
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 403
      And the API's code is "ApiKey.ReadOnly"
