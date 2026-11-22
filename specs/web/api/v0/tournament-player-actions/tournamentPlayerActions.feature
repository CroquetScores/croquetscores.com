@postgres
Feature: A tournament's players are moved, archived and restored through the API

  A manager of a tournament, or an app with their key, moves one of a tournament's players a place, sets them aside or brings them back by sending
  `POST /api/v0/tournaments/{id}/players/{player}/{action}` with no body, with each part of the address named
  by the part of its id after its kind. What the tournament refuses is answered
  with its code, as the API answers any refusal (`errors.feature`), and only a
  manager may ask, as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/players/{player}/{action}`, which the website's pages called. It is
  no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
    And "organiser@example.com" has added the player "Bob Bowler" to "Spring Open"

  Rule: A tournament player is moved up a place

    Scenario: A manager moves a tournament player up
      Given the caller is signed in as "organiser@example.com"
      When the tournament player "Bob Bowler" of "Spring Open" is moved up
      Then the API answers 204

    Scenario: A tournament player moved up is listed before the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the tournament player "Bob Bowler" of "Spring Open" is moved up
      When the tournament players of "Spring Open" are listed to the caller
      Then the first tournament player the site lists is "Bob Bowler"

    Scenario: A reader who is not signed in may not do it
      When the tournament player "Bob Bowler" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the tournament player "Bob Bowler" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the tournament player "Bob Bowler" of "Spring Open" is moved up at the address it was at
      Then the API answers 404

  Rule: A tournament player is moved down a place

    Scenario: A manager moves a tournament player down
      Given the caller is signed in as "organiser@example.com"
      When the tournament player "Ann Archer" of "Spring Open" is moved down
      Then the API answers 204

    Scenario: A tournament player moved down is listed after the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the tournament player "Ann Archer" of "Spring Open" is moved down
      When the tournament players of "Spring Open" are listed to the caller
      Then the first tournament player the site lists is "Bob Bowler"

    Scenario: A reader who is not signed in may not do it
      When the tournament player "Ann Archer" of "Spring Open" is moved down
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the tournament player "Ann Archer" of "Spring Open" is moved down
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the tournament player "Ann Archer" of "Spring Open" is moved down at the address it was at
      Then the API answers 404
