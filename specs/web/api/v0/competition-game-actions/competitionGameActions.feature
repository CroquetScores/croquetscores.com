@postgres
Feature: A competition's game is moved, archived and withdrawn through the API

  A manager or a scorer of a tournament, or an app with their key, moves one of
  a competition's games a place, sets it aside or brings it back, withdraws it
  or takes the withdrawal back by sending
  `POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/{action}`
  with no body, with the tournament, the competition and the game each named by
  the part of its id after its kind. Moving a place is for the scores of a
  test, and a competition that cannot say so is refused.

  What the competition refuses is answered with its code, as the API answers any
  refusal (`errors.feature`), and only somebody with a part in the tournament
  may ask, as `writer.feature` says of every change.

  Each was at
  `/api/site/tournaments/{id}/competitions/{competition}/games/{game}/{action}`,
  which the website's pages called. It is no longer there, so that there is one
  address for it to be at.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
    And "organiser@example.com" has added the player "Bob Bowler" to "Spring Open"
    And "organiser@example.com" has entered the player "Ann Archer" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Bob Bowler" in "Block A" of "Spring Open"
    And "Ann Archer" has beaten "Bob Bowler" 26 to 10 in "Block A" of "Spring Open"

  Rule: A game is moved up a place

    Scenario: A game that cannot be moved is refused by the competition
      Given the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Competition.NotATest"

    Scenario: A reader who is not signed in may not do it
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not do it
      Given the caller is signed in as "stranger@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is moved up
      Then the API answers 422
      And the API's code is "Tournament.NotAManagerOrScorer"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the game of "Ann Archer" beating "Bob Bowler" in "Block A" of "Spring Open" is moved up at the address it was at
      Then the API answers 404
