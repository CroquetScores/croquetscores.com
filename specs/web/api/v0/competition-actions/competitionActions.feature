@postgres
Feature: A competition is moved, archived and restored through the API

  A manager of a tournament, or an app with their key, moves one of its
  competitions a place, sets it aside or brings it back by sending
  `POST /api/v0/tournaments/{id}/competitions/{competition}/{action}` with no
  body, with the tournament and the competition each named by the part of its
  id after its kind. What the tournament refuses is answered with its code, as
  the API answers any refusal (`errors.feature`), and only a manager may ask,
  as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/competitions/{competition}/{action}`,
  which the website's pages called. It is no longer there, so that there is one
  address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the block "Block B" to "Spring Open"

  Rule: A competition is moved up a place

    Scenario: A manager moves a competition up
      Given the caller is signed in as "organiser@example.com"
      When the competition "Block B" of "Spring Open" is moved up
      Then the API answers 204

    Scenario: A competition moved up is listed before the one it passed
      Given the caller is signed in as "organiser@example.com"
      And the competition "Block B" of "Spring Open" is moved up
      When the tournament "Spring Open" is read with that key
      Then the first competition read is "Block B"
      And the second competition read is "Block A"

    Scenario: A reader who is not signed in may not move it
      When the competition "Block B" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not move it
      Given the caller is signed in as "stranger@example.com"
      When the competition "Block B" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the competition "Block B" of "Spring Open" is moved up at the address it was at
      Then the API answers 404

  Rule: A competition is moved down a place

    Scenario: A manager moves a competition down
      Given the caller is signed in as "organiser@example.com"
      When the competition "Block A" of "Spring Open" is moved down
      Then the API answers 204

    Scenario: A competition moved down is listed after the one it passed
      Given the caller is signed in as "organiser@example.com"
      And the competition "Block A" of "Spring Open" is moved down
      When the tournament "Spring Open" is read with that key
      Then the first competition read is "Block B"
      And the second competition read is "Block A"

    Scenario: A reader who is not signed in may not move it down
      When the competition "Block A" of "Spring Open" is moved down
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not move it down
      Given the caller is signed in as "stranger@example.com"
      When the competition "Block A" of "Spring Open" is moved down
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the competition "Block A" of "Spring Open" is moved down at the address it was at
      Then the API answers 404
