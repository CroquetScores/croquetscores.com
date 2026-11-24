@postgres
Feature: A tournament's players are added through the API

  A manager of a tournament, or an app with their key, adds a player to it by
  sending `POST /api/v1/tournaments/{id}/players` with the player's name, and
  their handicap, what they represent, their flag and their world ranking name
  where they have them. The tournament is named by the part of its id after
  "tournament/". It is answered `201` with the player's id.

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and the field it is about (`errors.feature`). Only a manager may ask,
  as `writer.feature` says of every change.

  It was at `/api/site/tournaments/{id}/players`, which the website's pages
  called. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A player is added to a tournament

    Scenario: A manager adds a player
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" is added to "Spring Open"
      Then the API answers 201
      And the API says the id of the tournament player

    Scenario: A player added is listed
      Given the caller is signed in as "organiser@example.com"
      And the player "Ann Archer" is added to "Spring Open"
      When the tournament players of "Spring Open" are listed to the caller
      Then the site lists the tournament player "Ann Archer"

    Scenario: A player added with what they represent is listed as representing it
      Given the caller is signed in as "organiser@example.com"
      And the player is to represent "Canterbury Croquet Club"
      And the player "Ann Archer" is added to "Spring Open"
      When the tournament players of "Spring Open" are listed to the caller
      Then the site lists the tournament player "Ann Archer" as representing "Canterbury Croquet Club"

    Scenario: A player with no name is refused with its code
      Given the caller is signed in as "organiser@example.com"
      When the player "" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "PersonName.Missing"

    Scenario: A player with the name of one already there is refused with its code
      Given "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.PlayerNameTaken"

    Scenario: A key adds a player for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the player "Ann Archer" is added to "Spring Open"
      Then the API answers 201

    Scenario: A reader who is not signed in may not add one
      When the player "Ann Archer" is added to "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not add one
      Given the caller is signed in as "stranger@example.com"
      When the player "Ann Archer" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" is added to "Spring Open" at the address it was at
      Then the API answers 404
