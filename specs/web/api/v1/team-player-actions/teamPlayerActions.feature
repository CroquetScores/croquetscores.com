@postgres
Feature: A team's players are moved, archived and restored through the API

  A manager of a tournament, or an app with their key, moves one of a team's players a place, sets them aside or brings them back by sending
  `POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/{action}` with no body, with each part of the address named
  by the part of its id after its kind. What the tournament refuses is answered
  with its code, as the API answers any refusal (`errors.feature`), and only a
  manager may ask, as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/teams/{team}/players/{player}/{action}`, which the website's pages called. It is
  no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" is played in the format "Teams"
    And "organiser@example.com" has added the team "Hampshire" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Player" to the team "Hampshire" of "Spring Open"
    And "organiser@example.com" has added the player "Quinn Player" to the team "Hampshire" of "Spring Open"

  Rule: A team player is moved up a place

    Scenario: A manager moves a team player up
      Given the caller is signed in as "organiser@example.com"
      When the team player "Quinn Player" of the team "Hampshire" of "Spring Open" is moved up
      Then the API answers 204

    Scenario: A team player moved up is listed before the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the team player "Quinn Player" of the team "Hampshire" of "Spring Open" is moved up
      When the players of the team "Hampshire" of "Spring Open" are listed to the caller
      Then the first team player the site lists is "Quinn Player"

    Scenario: A reader who is not signed in may not do it
      When the team player "Quinn Player" of the team "Hampshire" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team player "Quinn Player" of the team "Hampshire" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team player "Quinn Player" of the team "Hampshire" of "Spring Open" is moved up at the address it was at
      Then the API answers 404

  Rule: A team player is moved down a place

    Scenario: A manager moves a team player down
      Given the caller is signed in as "organiser@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 204

    Scenario: A team player moved down is listed after the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the team player "Pat Player" of the team "Hampshire" of "Spring Open" is moved down
      When the players of the team "Hampshire" of "Spring Open" are listed to the caller
      Then the first team player the site lists is "Quinn Player"

    Scenario: A reader who is not signed in may not do it
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is moved down at the address it was at
      Then the API answers 404

  Rule: A team player is archived

    Scenario: A manager archives a team player
      Given the caller is signed in as "organiser@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      Then the API answers 204

    Scenario: A team player archived is listed as archived
      Given the caller is signed in as "organiser@example.com"
      And the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      When the players of the team "Hampshire" of "Spring Open" are listed to the caller
      Then the site lists the team player "Pat Player" as archived

    Scenario: A reader who is not signed in may not do it
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived at the address it was at
      Then the API answers 404

  Rule: A team player is restored

    Scenario: A manager restores an archived team player
      Given the caller is signed in as "organiser@example.com"
      And the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is restored
      Then the API answers 204

    Scenario: A team player restored is no longer listed as archived
      Given the caller is signed in as "organiser@example.com"
      And the team player "Pat Player" of the team "Hampshire" of "Spring Open" is archived
      And the team player "Pat Player" of the team "Hampshire" of "Spring Open" is restored
      When the players of the team "Hampshire" of "Spring Open" are listed to the caller
      Then the site lists the team player "Pat Player" as not archived

    Scenario: A reader who is not signed in may not do it
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is restored
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is restored
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team player "Pat Player" of the team "Hampshire" of "Spring Open" is restored at the address it was at
      Then the API answers 404
