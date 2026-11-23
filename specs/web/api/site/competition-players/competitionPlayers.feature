@postgres
Feature: Several players are entered in a competition through the website's own interface

  A manager or a scorer of a tournament enters several of its players in one
  of its competitions at once, from the competition's Add Players dialog. The
  tournament and the competition are each named by the part of its id after
  its kind, and the answer holds the players' ids in the competition, in the
  order they were chosen. The reader is known by the session their browser
  holds, and by nothing else: this is not offered to apps, so a key does not
  stand in for the session.

  It was offered to apps for a while, and is not now
  (`competitionPlayers.feature`). What the tournament refuses is answered with
  its code, as the website's interface answers any refusal.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "stranger@example.com" has an account, confirmed, called "Sam Stranger"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
    And "organiser@example.com" has added the player "Bob Bowler" to "Spring Open"

  Rule: Several players are entered at once

    Scenario: A manager enters several players
      Given the caller is signed in as "organiser@example.com"
      Given the player "Ann Archer" is chosen
      And the player "Bob Bowler" is chosen
      When the chosen players are put into "Block A" of "Spring Open" from the website
      Then the API answers 201
      And the API says the ids of two players in the competition

    Scenario: Players entered are listed in the competition
      Given the caller is signed in as "organiser@example.com"
      And the player "Ann Archer" is chosen
      And the player "Bob Bowler" is chosen
      And the chosen players are put into "Block A" of "Spring Open" from the website
      When the players of "Block A" in "Spring Open" are listed to the caller
      Then the first player the site lists is "Ann Archer"

    Scenario: A reader who is not signed in may not enter them
      Given the player "Ann Archer" is chosen
      And the player "Bob Bowler" is chosen
      When the chosen players are put into "Block A" of "Spring Open" from the website
      Then the website says the reader is not signed in

    Scenario: A reader with no part in the tournament may not enter them
      Given the caller is signed in as "stranger@example.com"
      Given the player "Ann Archer" is chosen
      And the player "Bob Bowler" is chosen
      When the chosen players are put into "Block A" of "Spring Open" from the website
      Then the website refuses it with "Tournament.NotAManager"

    Scenario: A key does not stand in for the session
      Given "organiser@example.com" has made a key that may read and write
      And the caller sends that key
      Given the player "Ann Archer" is chosen
      And the player "Bob Bowler" is chosen
      When the chosen players are put into "Block A" of "Spring Open" from the website
      Then the website says the reader is not signed in
