@postgres
Feature: A tournament's scorers and managers are made and taken off through the API

  A manager of a tournament, or an app with their key, makes somebody a scorer
  or a manager by sending `POST /api/v0/tournaments/{id}/scorers` or
  `POST /api/v0/tournaments/{id}/managers` with their email address, and takes
  one off by sending `POST /api/v0/tournaments/{id}/scorers/{account}/remove`
  or `.../managers/{account}/remove` with no body. The tournament and the
  account are each named by the part of its id after its kind.

  What the tournament refuses is answered with its code, as the API answers any
  refusal (`errors.feature`): an address with no account to make a scorer of,
  somebody who is a manager already, and a manager who is not one. Only a
  manager may ask, as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/scorers` or `.../managers`, which the
  website's pages called. It is no longer there, so that there is one address
  for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "stranger@example.com" has an account, confirmed, called "Sue Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Somebody is made a scorer

    Scenario: A manager makes somebody a scorer
      Given the caller is signed in as "organiser@example.com"
      When "someone@example.com" is made a scorer of "Spring Open"
      Then the API answers 204

    Scenario: A scorer made is listed
      Given the caller is signed in as "organiser@example.com"
      And "someone@example.com" is made a scorer of "Spring Open"
      When the scorers of "Spring Open" are listed to the caller
      Then the site lists the person "Sam Someone"

    Scenario: An address with no account is refused
      Given the caller is signed in as "organiser@example.com"
      When "nobody@example.com" is made a scorer of "Spring Open"
      Then the API answers 422

    Scenario: A reader who is not signed in may not make one
      When "someone@example.com" is made a scorer of "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not make one
      Given the caller is signed in as "stranger@example.com"
      When "someone@example.com" is made a scorer of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When "someone@example.com" is made a scorer of "Spring Open" at the address it was at
      Then the API answers 404

  Rule: A scorer is taken off

    Scenario: A manager takes a scorer off
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the scorer "Sam Someone" is taken off "Spring Open"
      Then the API answers 204

    Scenario: A scorer taken off is no longer listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      And the scorer "Sam Someone" is taken off "Spring Open"
      When the scorers of "Spring Open" are listed to the caller
      Then the site does not list the person "Sam Someone"

    Scenario: A reader who is not signed in may not take one off
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorer "Sam Someone" is taken off "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not take one off
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the caller is signed in as "stranger@example.com"
      When the scorer "Sam Someone" is taken off "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the scorer "Sam Someone" is taken off "Spring Open" at the address it was at
      Then the API answers 404

  Rule: Somebody is made a manager

    Scenario: A manager makes somebody a manager
      Given the caller is signed in as "organiser@example.com"
      When "someone@example.com" is made a manager of "Spring Open"
      Then the API answers 204

    Scenario: A manager made is listed
      Given the caller is signed in as "organiser@example.com"
      And "someone@example.com" is made a manager of "Spring Open"
      When the managers of "Spring Open" are listed to the caller
      Then the site lists the person "Sam Someone"

    Scenario: An address with no account is refused
      Given the caller is signed in as "organiser@example.com"
      When "nobody@example.com" is made a manager of "Spring Open"
      Then the API answers 422

    Scenario: A reader who is not signed in may not make one
      When "someone@example.com" is made a manager of "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not make one
      Given the caller is signed in as "stranger@example.com"
      When "someone@example.com" is made a manager of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When "someone@example.com" is made a manager of "Spring Open" at the address it was at
      Then the API answers 404

  Rule: A manager is taken off

    Scenario: A manager takes another manager off
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the manager "Sam Someone" is taken off "Spring Open"
      Then the API answers 204

    Scenario: A manager taken off is no longer listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      And the manager "Sam Someone" is taken off "Spring Open"
      When the managers of "Spring Open" are listed to the caller
      Then the site does not list the person "Sam Someone"

    Scenario: A reader who is not signed in may not take one off
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the manager "Sam Someone" is taken off "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not take one off
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the caller is signed in as "stranger@example.com"
      When the manager "Sam Someone" is taken off "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the caller is signed in as "organiser@example.com"
      When the manager "Sam Someone" is taken off "Spring Open" at the address it was at
      Then the API answers 404
