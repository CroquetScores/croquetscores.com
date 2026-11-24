@postgres
Feature: A test is added to a tournament through the API

  A manager of a tournament played by teams, or an app with their key, adds a
  test to it, a match between two of its teams, by sending
  `POST /api/v1/tournaments/{id}/tests` with the two teams, each named by the
  part of its id after "team/", the days it starts and finishes, how many
  matches are expected, and the best of how many games each is. The tournament
  is named by the part of its id after "tournament/". It is answered `201` with
  the test's id, which is a competition's: a test is moved, archived and
  restored as any competition is. Whether it may be an Advantage test is
  `advantage.feature`'s, which asks it here.

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and the field it is about (`errors.feature`). Only a manager may add
  one, as `writer.feature` says of every change.

  It was at `/api/site/tournaments/{id}/tests`, which the website's pages
  called. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the tournament "Spring Tests" is played in the format "Teams"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"

  Rule: A test is added between two teams

    Scenario: A manager adds a test
      Given the caller is signed in as "organiser@example.com"
      When the test between "Australia" and "England" is added to "Spring Tests"
      Then the API answers 201
      And the API says the id of the test

    Scenario: A test added is a competition of the tournament
      Given the caller is signed in as "organiser@example.com"
      And the test between "Australia" and "England" is added to "Spring Tests"
      When the competitions of "Spring Tests" are listed to the caller
      Then the site lists one competition

    Scenario: A test between no teams is refused with its code
      Given the caller is signed in as "organiser@example.com"
      When a test between no teams is added to "Spring Tests"
      Then the API answers 422

    Scenario: A key adds a test for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the test between "Australia" and "England" is added to "Spring Tests"
      Then the API answers 201

    Scenario: A reader who is not signed in may not add one
      When the test between "Australia" and "England" is added to "Spring Tests"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not add one
      Given the caller is signed in as "stranger@example.com"
      When the test between "Australia" and "England" is added to "Spring Tests"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the test between "Australia" and "England" is added to "Spring Tests" at the address it was at
      Then the API answers 404
