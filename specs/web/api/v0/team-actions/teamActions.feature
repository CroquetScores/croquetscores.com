@postgres
Feature: A tournament's teams are moved, archived and restored through the API

  A manager of a tournament, or an app with their key, moves one of a tournament's teams a place, sets it aside or brings it back by sending
  `POST /api/v0/tournaments/{id}/teams/{team}/{action}` with no body, with each part of the address named
  by the part of its id after its kind. What the tournament refuses is answered
  with its code, as the API answers any refusal (`errors.feature`), and only a
  manager may ask, as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/teams/{team}/{action}`, which the website's pages called. It is
  no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" is played in the format "Teams"
    And "organiser@example.com" has added the team "Hampshire" to "Spring Open"
    And "organiser@example.com" has added the team "Kent" to "Spring Open"

  Rule: A team is moved up a place

    Scenario: A manager moves a team up
      Given the caller is signed in as "organiser@example.com"
      When the team "Kent" of "Spring Open" is moved up
      Then the API answers 204

    Scenario: A team moved up is listed before the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the team "Kent" of "Spring Open" is moved up
      When the teams of "Spring Open" are listed to the caller
      Then the first team the site lists is "Kent"

    Scenario: A reader who is not signed in may not do it
      When the team "Kent" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team "Kent" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team "Kent" of "Spring Open" is moved up at the address it was at
      Then the API answers 404

  Rule: A team is moved down a place

    Scenario: A manager moves a team down
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 204

    Scenario: A team moved down is listed after the one they passed
      Given the caller is signed in as "organiser@example.com"
      And the team "Hampshire" of "Spring Open" is moved down
      When the teams of "Spring Open" are listed to the caller
      Then the first team the site lists is "Kent"

    Scenario: A reader who is not signed in may not do it
      When the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team "Hampshire" of "Spring Open" is moved down
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" of "Spring Open" is moved down at the address it was at
      Then the API answers 404

  Rule: A team is archived

    Scenario: A manager archives a team
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" of "Spring Open" is archived
      Then the API answers 204

    Scenario: A team archived is listed as archived
      Given the caller is signed in as "organiser@example.com"
      And the team "Hampshire" of "Spring Open" is archived
      When the teams of "Spring Open" are listed to the caller
      Then the site lists the team "Hampshire" as archived

    Scenario: A reader who is not signed in may not do it
      When the team "Hampshire" of "Spring Open" is archived
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the team "Hampshire" of "Spring Open" is archived
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" of "Spring Open" is archived at the address it was at
      Then the API answers 404
