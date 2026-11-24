@postgres
Feature: Players are entered in a competition through the API

  A manager or a scorer of a tournament, or an app with their key, enters one
  of the tournament's players in one of its competitions by sending
  `POST /api/v1/tournaments/{id}/competitions/{competition}/players` with the
  player, named by the part of their id after "tournament-player/". The
  tournament and the competition are each named by the part of its id after
  its kind. It is answered `201` with the player's id in the competition.

  What the tournament refuses is answered with its code, as the API answers
  any refusal (`errors.feature`), and only somebody with a part in the
  tournament may ask, as `writer.feature` says of every change.

  Each was at `/api/site/tournaments/{id}/competitions/{competition}/players`,
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

  Rule: A player is put into a competition

    Scenario: A manager enters a player
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" is put into "Block A" of "Spring Open"
      Then the API answers 201
      And the API says the id of the player in the competition

    Scenario: A player entered is listed in the competition
      Given the caller is signed in as "organiser@example.com"
      And the player "Ann Archer" is put into "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are listed to the caller
      Then the first player the site lists is "Ann Archer"

    Scenario: A key enters a player for its account
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      When the player "Ann Archer" is put into "Block A" of "Spring Open"
      Then the API answers 201

    Scenario: A reader who is not signed in may not enter one
      When the player "Ann Archer" is put into "Block A" of "Spring Open"
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A reader with no part in the tournament may not enter one
      Given the caller is signed in as "stranger@example.com"
      When the player "Ann Archer" is put into "Block A" of "Spring Open"
      Then the API answers 422
      And the API's code is "Tournament.NotAManager"

    Scenario: The address it was at is gone
      Given the caller is signed in as "organiser@example.com"
      When the player "Ann Archer" is put into "Block A" of "Spring Open" at the address it was at
      Then the API answers 404

  Rule: Entering several players at once is not offered

    The Add Players dialog asks `/api/site` for it
    (`specs/web/api/site/competition-players/competitionPlayers.feature`), and
    it is not for apps, who enter them one at a time.

    Scenario: Entering several players at once is not offered
      Given the caller is signed in as "organiser@example.com"
      When the players "Ann Archer" and "Bob Bowler" are put into "Block A" of "Spring Open" through the API
      Then the API answers 404
