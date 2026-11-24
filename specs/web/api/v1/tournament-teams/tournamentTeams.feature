@postgres
Feature: A tournament's teams are added and changed through the API

  A manager of a tournament, or an app with their key, adds a team to it by
  sending `POST /api/v1/tournaments/{id}/teams` with the team's name and short
  name, and its flag where it has one. The tournament is named by the part of
  its id after "tournament/". It is answered `201` with the team's id. A team
  is moved a place, set aside or brought back by asking at the team's own
  address, with the team named by the part of its id after "team/".

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and the field it is about (`errors.feature`). Only a manager may ask,
  as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/teams`, which the website's pages
  called. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" is played in the format "Teams"

  Rule: A team is added

    Scenario: A manager adds a team
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" is added to "Spring Open"
      Then the API answers 201
      And the API says the id of the team

    Scenario: A team added is listed
      Given the caller is signed in as "organiser@example.com"
      And the team "Hampshire" is added to "Spring Open"
      When the teams of "Spring Open" are listed to the caller
      Then the site lists the team "Hampshire"

    Scenario: A team with no name is refused with its code
      Given the caller is signed in as "organiser@example.com"
      When the team "" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "TeamName.Missing"

    Scenario: A key adds a team for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the team "Hampshire" is added to "Spring Open"
      Then the API answers 201

    Scenario: A reader who is not signed in may not add one
      When the team "Hampshire" is added to "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not add one
      Given the caller is signed in as "stranger@example.com"
      When the team "Hampshire" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the team "Hampshire" is added to "Spring Open" at the address it was at
      Then the API answers 404

  Rule: A player is added to a team

    Scenario: A manager adds a player to a team
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the player "Pat Player" is added to the team "Hampshire" of "Spring Open"
      Then the API answers 201
      And the API says the id of the team player

    Scenario: A player added is listed in the team
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      And the caller is signed in as "organiser@example.com"
      And the player "Pat Player" is added to the team "Hampshire" of "Spring Open"
      When the players of the team "Hampshire" of "Spring Open" are listed to the caller
      Then the site lists the team player "Pat Player"

    Scenario: A player with no name is refused with its code
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the player "" is added to the team "Hampshire" of "Spring Open"
      Then the API answers 422
      And the API's code is "PersonName.Missing"

    Scenario: A reader who is not signed in may not add one
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      When the player "Pat Player" is added to the team "Hampshire" of "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not add one
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      And the caller is signed in as "stranger@example.com"
      When the player "Pat Player" is added to the team "Hampshire" of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given "organiser@example.com" has added the team "Hampshire" to "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the player "Pat Player" is added to the team "Hampshire" of "Spring Open" at the address it was at
      Then the API answers 404
