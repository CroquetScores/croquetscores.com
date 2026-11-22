@postgres
Feature: A competition's player is moved, withdrawn and removed through the API

  A manager or a scorer of a tournament, or an app with their key, moves one of
  a competition's players a place, withdraws them, takes the withdrawal back or
  removes them by sending
  `POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/{action}`
  with no body, with the tournament, the competition and the player each named
  by the part of its id after its kind. A bye has the same id as every other,
  so it is named by its order as well, as `order` in the address.

  What the tournament refuses is answered with its code, as the API answers any
  refusal (`errors.feature`), and only somebody with a part in the tournament
  may ask, as `writer.feature` says of every change.

  Each was at
  `/api/site/tournaments/{id}/competitions/{competition}/players/{player}/{action}`,
  which the website's pages called. It is no longer there, so that there is one
  address for it to be at.

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

  Rule: A player is moved up a place

    Scenario: A manager moves a player up
      Given the caller is signed in as "organiser@example.com"
      When the player "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 204

    Scenario: A player moved up is listed before the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the player "Bob Bowler" in "Block A" of "Spring Open" is moved up
      When the players of "Block A" in "Spring Open" are listed to the caller
      Then the first player the site lists is "Bob Bowler"

    Scenario: A reader who is not signed in may not move them
      When the player "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not move them
      Given the caller is signed in as "stranger@example.com"
      When the player "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the player "Bob Bowler" in "Block A" of "Spring Open" is moved up at the address it was at
      Then the API answers 404

  Rule: A player is moved down a place

    Scenario: A manager moves a player down
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is moved down
      Then the API answers 204

    Scenario: A player moved down is listed after the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the player "Ann Archer" in "Block A" of "Spring Open" is moved down
      When the players of "Block A" in "Spring Open" are listed to the caller
      Then the first player the site lists is "Bob Bowler"

    Scenario: A reader who is not signed in may not do it
      When the player "Ann Archer" in "Block A" of "Spring Open" is moved down
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is moved down
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is moved down at the address it was at
      Then the API answers 404

  Rule: A player is withdrawn

    Scenario: A manager withdraws a player
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is withdrawn
      Then the API answers 204

    Scenario: A player withdrawn is listed as withdrawn
      Given the caller is signed in as "organiser@example.com"
      And the player "Ann Archer" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" in "Spring Open" are listed to the caller
      Then the site lists "Ann Archer" as withdrawn

    Scenario: A reader who is not signed in may not do it
      When the player "Ann Archer" in "Block A" of "Spring Open" is withdrawn
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is withdrawn
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" in "Block A" of "Spring Open" is withdrawn at the address it was at
      Then the API answers 404
