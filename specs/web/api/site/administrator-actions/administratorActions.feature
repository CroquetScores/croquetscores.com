@postgres
Feature: An administrator judges a tournament through the website's own interface

  An administrator takes a tournament's notable status away, or deletes a
  test tournament, from the website's admin pages. The administrator is known
  by the session their browser holds, and by nothing else: these two are not
  offered to apps, so a key does not stand in for the session.

  They were offered to apps for a while, and are not now
  (`tournamentActions.feature`). What the tournament refuses is answered with
  its code, as the website's interface answers any refusal.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: An administrator removes a tournament's notable status

    A tournament is national or international as its manager says, and an
    administrator who judges it is neither removes that, which no manager may.

    Scenario: An administrator removes its national status
      Given the tournament "Spring Open" is national
      And the caller is signed in as "admin@example.com"
      When the notable status of the tournament "Spring Open" is removed from the website
      Then the API answers 204

    Scenario: A tournament whose status was removed is no longer national
      Given the tournament "Spring Open" is national
      And the caller is signed in as "admin@example.com"
      And the notable status of the tournament "Spring Open" is removed from the website
      When the tournament "Spring Open" is read with that key
      Then the tournament read says it is not national

    Scenario: A reader who is not signed in may not remove it
      When the notable status of the tournament "Spring Open" is removed from the website
      Then the website says the reader is not signed in

    Scenario: A manager who is no administrator may not remove it
      Given the tournament "Spring Open" is national
      And the caller is signed in as "organiser@example.com"
      When the notable status of the tournament "Spring Open" is removed from the website
      Then the website refuses it with "Account.NotAnAdministrator"

    Scenario: A key does not stand in for the session
      Given "admin@example.com" has made a key that may read and write
      And the caller sends that key
      When the notable status of the tournament "Spring Open" is removed from the website
      Then the website says the reader is not signed in

  Rule: An administrator deletes a test tournament

    "Deleting" is the administrator's word: nothing the site keeps is deleted,
    so the managers are told, and the tournament is archived where that is asked.

    Scenario: An administrator deletes a test tournament and archives it
      Given the caller is signed in as "admin@example.com"
      And the words "This was a test." are written to the managers
      And the tournament is to be archived
      When the tournament "Spring Open" is deleted from the website
      Then the API answers 204

    Scenario: A tournament deleted and archived is listed as archived
      Given the caller is signed in as "admin@example.com"
      And the words "This was a test." are written to the managers
      And the tournament is to be archived
      And the tournament "Spring Open" is deleted from the website
      When the archived tournaments are asked with that key
      Then the archived tournaments are "Spring Open"

    Scenario: A tournament deleted and not archived is not listed as archived
      Given the caller is signed in as "admin@example.com"
      And the words "This was a test." are written to the managers
      And the tournament is not to be archived
      And the tournament "Spring Open" is deleted from the website
      When the archived tournaments are asked with that key
      Then no tournaments are listed as archived

    Scenario: A reader who is not signed in may not delete it
      Given the words "This was a test." are written to the managers
      And the tournament is to be archived
      When the tournament "Spring Open" is deleted from the website
      Then the website says the reader is not signed in

    Scenario: A manager who is no administrator may not delete it
      Given the caller is signed in as "organiser@example.com"
      And the words "This was a test." are written to the managers
      And the tournament is to be archived
      When the tournament "Spring Open" is deleted from the website
      Then the website refuses it with "Account.NotAnAdministrator"

    Scenario: An administrator who writes nothing to the managers is refused
      Given the caller is signed in as "admin@example.com"
      And nothing is written to the managers
      And the tournament is to be archived
      When the tournament "Spring Open" is deleted from the website
      Then the website refuses it with "DeleteTournament.MessageMissing"

    Scenario: A key does not stand in for the session
      Given "admin@example.com" has made a key that may read and write
      And the caller sends that key
      And the words "This was a test." are written to the managers
      And the tournament is to be archived
      When the tournament "Spring Open" is deleted from the website
      Then the website says the reader is not signed in
