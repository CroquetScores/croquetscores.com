@postgres
Feature: A tournament is created through the API

  An app, or the website's own page for it, creates a tournament by sending
  `POST /api/v1/tournaments` what the new tournament page sends: its name,
  when it starts and finishes, its format and sport, and its country and
  region. The account that sends it, by session or by key (`writer.feature`),
  is its first manager. It is answered `201` with the tournament's id and
  where the site shows it.

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and, where the rule is about one field, the field (`errors.feature`),
  and nothing is kept.

  The same route was at `/api/site/tournaments`, which the website's pages
  used. It is no longer there, so that there is one address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: A tournament is created, and the creator manages it

    Scenario: The answer says where the tournament is
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is created
      Then the API says where the tournament is

    Scenario: The creator manages the tournament
      Given the caller is signed in as "organiser@example.com"
      And the tournament "Spring Open" is created
      And "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the part is "manager"

    Scenario: A key creates a tournament for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      And the tournament "Spring Open" is created
      When the permissions in "Spring Open" are asked with that key
      Then the API says the part is "manager"

  Rule: What breaks a rule is refused with the field at fault

    Scenario: A tournament with no name is refused
      Given the caller is signed in as "organiser@example.com"
      When a tournament with no name is created
      Then the API answers 422
      And the API says the field at fault is "name"

    Scenario: A tournament that finishes before it starts is refused
      Given the caller is signed in as "organiser@example.com"
      When a tournament that finishes before it starts is created
      Then the API answers 422
      And the API's code is "Tournament.FinishesBeforeStarts"

    Scenario: Every rule a tournament breaks is listed
      Given the caller is signed in as "organiser@example.com"
      When a tournament with no name and no country is created
      Then the API lists the broken rule "TournamentName.Missing"
      And the API lists the broken rule "CreateTournament.NoSuchCountry"

    Scenario: A refused tournament is not kept
      Given the caller is signed in as "organiser@example.com"
      And a tournament with no name is created
      When the tournaments of 2026 are asked with no key
      Then no tournaments are listed

  Rule: The address it was at is gone

    Scenario: The website's address for it no longer answers
      Given the caller is signed in as "organiser@example.com"
      When the tournament "Spring Open" is created at the address it was at
      Then the API answers 404
