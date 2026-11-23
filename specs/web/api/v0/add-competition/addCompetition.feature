@postgres
Feature: A competition is added to a tournament through the API

  A manager of a tournament, or an app with their key, adds a competition to
  it by sending `POST /api/v0/tournaments/{id}/competitions` what the
  competition dialog sends: the kind (a block, a Swiss or a knockout), its
  name, and the shape its kind has. The tournament is named by the part of its
  id after "tournament/". It is answered `201` with the competition's id.

  What breaks a rule is refused as the API refuses anything, with the code of
  the rule and the field it is about (`errors.feature`). Only a manager may
  add one, and a key made for another tournament may not
  (`writer.feature`). Whether it may be an Advantage competition is
  `advantage.feature`'s, which asks it here.

  It was at `/api/site/tournaments/{id}/competitions`, which the website's
  pages called. It is no longer there, so that there is one address for it to
  be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A manager adds a competition of any kind

    Scenario: A manager adds a block
      Given the caller is signed in as "organiser@example.com"
      When the block "Block A" is added to "Spring Open"
      Then the API answers 201
      And the API says the id of the competition

    Scenario: A manager adds a Swiss
      Given the caller is signed in as "organiser@example.com"
      When the Swiss "Swiss A" is added to "Spring Open"
      Then the API answers 201

    Scenario: A manager adds a knockout
      Given the caller is signed in as "organiser@example.com"
      When the knockout "Knockout A" is added to "Spring Open"
      Then the API answers 201

    Scenario: A competition added is in the tournament
      Given the caller is signed in as "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists the competition "Block A" with its id

    Scenario: A competition added by a key is added for the key's account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the block "Block A" is added to "Spring Open"
      Then the API answers 201

  Rule: A competition that breaks a rule is refused with the field at fault

    Scenario: A block with no name is refused
      Given the caller is signed in as "organiser@example.com"
      When the block "" is added to "Spring Open"
      Then the API answers 422
      And the API says the field at fault is "name"

    Scenario: A competition not added is not in the tournament
      Given the caller is signed in as "organiser@example.com"
      And the block "" is added to "Spring Open"
      When the tournament "Spring Open" is read with that key
      Then the tournament read lists no competitions

  Rule: Only a manager of the tournament may add one

    Scenario: A reader who is not signed in may not
      When the block "Block A" is added to "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in it may not
      Given the caller is signed in as "stranger@example.com"
      When the block "Block A" is added to "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

  Rule: The address it was at is gone

    Scenario: The website's address for it no longer answers
      Given the caller is signed in as "organiser@example.com"
      When the block "Block A" is added to "Spring Open" at the address it was at
      Then the API answers 404
