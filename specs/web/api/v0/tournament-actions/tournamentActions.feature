@postgres
Feature: A tournament is archived, restored and judged through the API

  A tournament is set aside, brought back, or has its notable status taken
  away by sending `POST /api/v0/tournaments/{id}/{action}` with no body, with
  the tournament named by the part of its id after "tournament/". The account
  that asks, by session or by key (`writer.feature`), must be allowed to do it
  to that tournament; what the tournament refuses is answered with its code,
  as the API answers any refusal (`errors.feature`).

  Each was at `/api/site/tournaments/{id}/{action}`, which the website's pages
  called. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A tournament is archived by its manager

    Scenario: A manager archives their tournament
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is archived
      Then the API answers 204

    Scenario: An archived tournament is listed as archived
      Given the caller is signed in as "organiser@example.com"
      And the tournament "Spring Open" is archived
      When the archived tournaments are asked with that key
      Then the archived tournaments are "Spring Open"

    Scenario: A reader who is not signed in may not archive it
      When the tournament "Spring Open" is archived
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader who has no part in it may not archive it
      Given the caller is signed in as "stranger@example.com"
      When the tournament "Spring Open" is archived
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: An id that is no tournament's is refused
      Given the caller is signed in as "organiser@example.com"
      When a tournament with a malformed id is archived
      Then the API answers 422
      And the API's code is "Id.Malformed"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is archived at the address it was at
      Then the API answers 404

  Rule: A tournament is restored by its manager

    Scenario: A manager restores their archived tournament
      Given the caller is signed in as "organiser@example.com"
      And the tournament "Spring Open" is archived
      When the tournament "Spring Open" is restored
      Then the API answers 204

    Scenario: A restored tournament is no longer listed as archived
      Given the caller is signed in as "organiser@example.com"
      And the tournament "Spring Open" is archived
      And the tournament "Spring Open" is restored
      When the archived tournaments are asked with that key
      Then no tournaments are listed as archived

    Scenario: A reader who is not signed in may not restore it
      When the tournament "Spring Open" is restored
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader who has no part in it may not restore it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the caller is signed in as "stranger@example.com"
      When the tournament "Spring Open" is restored
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is restored at the address it was at
      Then the API answers 404

  Rule: An administrator removes a tournament's notable status

    A tournament is national or international as its manager says, and an
    administrator who judges it is neither removes that, which no manager may.

    Scenario: An administrator removes its national status
      Given the tournament "Spring Open" is national
      And the caller is signed in as "admin@example.com"
      When the notable status of the tournament "Spring Open" is removed
      Then the API answers 204

    Scenario: A tournament whose status was removed is no longer national
      Given the tournament "Spring Open" is national
      And the caller is signed in as "admin@example.com"
      And the notable status of the tournament "Spring Open" is removed
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it is not national

    Scenario: A reader who is not signed in may not remove it
      When the notable status of the tournament "Spring Open" is removed
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A manager who is no administrator may not remove it
      Given the tournament "Spring Open" is national
      And the caller is signed in as "organiser@example.com"
      When the notable status of the tournament "Spring Open" is removed
      Then the API answers 422

    Scenario: The address it was at is gone
      Given the caller is signed in as "admin@example.com"
      When the notable status of the tournament "Spring Open" is removed at the address it was at
      Then the API answers 404
