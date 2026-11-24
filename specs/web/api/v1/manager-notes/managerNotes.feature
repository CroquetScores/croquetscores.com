@postgres
Feature: A manager note is added to a tournament through the API

  A manager of a tournament, or an app with their key, adds a note to it by
  sending `POST /api/v1/tournaments/{id}/notes` with the note's title and its
  description, with the tournament named by the part of its id after
  "tournament/". It is answered `201` with the note's id. A note's description
  may be far longer than anything else the API is sent, so the body this takes
  is larger than the others are held to.

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and the field it is about (`errors.feature`). Only a manager may add
  one, as `writer.feature` says of every change.

  It was at `/api/site/tournaments/{id}/notes`, which the website's pages
  called. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A manager adds a note

    Scenario: A manager adds a note
      Given the caller is signed in as "organiser@example.com"
      When the note "Bring tea" is added to "Spring Open"
      Then the API answers 201
      And the API says the id of the note

    Scenario: A note added is listed
      Given the caller is signed in as "organiser@example.com"
      And the note "Bring tea" is added to "Spring Open"
      When the notes of "Spring Open" are listed to the caller
      Then the site lists the note "Bring tea"

    Scenario: A note with no title is refused with the field at fault
      Given the caller is signed in as "organiser@example.com"
      When the note "" is added to "Spring Open"
      Then the API answers 422
      And the API says the field at fault is "title"

    Scenario: A note too big for any other request is let through
      Given the caller is signed in as "organiser@example.com"
      When a note with a description of 700000 accented letters is added to "Spring Open"
      Then the API answers 201

    Scenario: A key adds a note for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the note "Bring tea" is added to "Spring Open"
      Then the API answers 201

    Scenario: A reader who is not signed in may not add one
      When the note "Bring tea" is added to "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not add one
      Given the caller is signed in as "stranger@example.com"
      When the note "Bring tea" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the note "Bring tea" is added to "Spring Open" at the address it was at
      Then the API answers 404
