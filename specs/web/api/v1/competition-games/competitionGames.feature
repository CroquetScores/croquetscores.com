@postgres
Feature: A competition's games are recorded and changed through the API

  A manager or a scorer of a tournament, or an app with their key, records a
  game by sending
  `POST /api/v1/tournaments/{id}/competitions/{competition}/games` with the
  winner and the loser, each named by the part of their id after
  "competition-player/", and the scores. It is answered `201` with the game's
  id. A game is then corrected, moved, archived, restored, withdrawn or its
  withdrawal reversed by asking at the game's own address, with the tournament,
  the competition and the game each named by the part of its id after its kind.

  What the tournament refuses is answered with its code, as the API answers any
  refusal (`errors.feature`), and only somebody with a part in the tournament
  may ask, as `writer.feature` says of every change. What breaks a rule is
  refused with every rule it broke and the field each is about.

  Each was at
  `/api/site/tournaments/{id}/competitions/{competition}/games`, which the
  website's pages called. It is no longer there, so that there is one address
  for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
    And "organiser@example.com" has added the player "Bob Bowler" to "Spring Open"
    And "organiser@example.com" has entered the player "Ann Archer" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Bob Bowler" in "Block A" of "Spring Open"

  Rule: A game is recorded

    Scenario: A manager records a game
      Given the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 201
      And the API says the id of the game

    Scenario: A game recorded is listed in the competition
      Given the caller is signed in as "organiser@example.com"
      And the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      When the games of "Block A" in "Spring Open" are listed to the caller
      Then the site lists one game

    Scenario: A key records a game for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 201

    Scenario: A game with no winner is refused with the field at fault
      Given the caller is signed in as "organiser@example.com"
      When a game with no winner is recorded in "Block A" of "Spring Open"
      Then the API answers 422
      And the API says the field at fault is "winner"

    Scenario: A reader who is not signed in may not record one
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not record one
      Given the caller is signed in as "stranger@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManagerOrScorer"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" 26 to 10 is recorded in "Block A" of "Spring Open" at the address it was at
      Then the API answers 404

  Rule: A game is corrected

    Scenario: A manager corrects a game's scores
      Given "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is corrected to 26 to 12
      Then the API answers 204

    Scenario: A game corrected is listed with its new scores
      Given "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      And the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is corrected to 26 to 12
      When the games of "Block A" in "Spring Open" are listed to the caller
      Then the site lists the game as 26 to 12

    Scenario: A reader who is not signed in may not correct it
      Given "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is corrected to 26 to 12
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not correct it
      Given "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"
      And the caller is signed in as "stranger@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is corrected to 26 to 12
      Then the API answers 422
      And the API's code is "Tournament.NotAManagerOrScorer"

    Scenario: The address it was at is gone
      Given "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is corrected to 26 to 12 at the address it was at
      Then the API answers 404
