@postgres
Feature: What the public pages of a tournament show, asked of the read models

  A public page of a tournament asks the events nothing. It asks the read
  models for the tournament's header, the competitions its section bar leads
  to, how a competition is played, and who is entered in it. They keep what
  the tournament's own events say (`TournamentContents.feature`) and what the
  competition's say (`CompetitionGames.feature`), and this asks them together.

  A tournament is kept with its subtitle in Markdown, or none. A competition
  is kept with its slug, the rounds a block is played in, the most hoops a game
  is played to and whether it is played as Advantage Golf Croquet. A player is
  kept with the slug that finds them within the tournament and the flag they
  fly.

  Where a scenario names no website, the tournament is on croquetscores.com,
  is for the sport "ac", and is played in the region "vic" of the country "au".

  Background:
    Given the competition games read model
    And a tournament "Spring Open" to start on "2026-10-03"
    And "Spring Open" is subtitled "A short one"
    And "Spring Open" is created by the account for "organiser@example.com"
    And a block named "Block A" is made in "Spring Open"
    And a block named "Block B" is made in "Spring Open"
    And the player "Sam Someone" is made in "Spring Open"
    And the player "Alex Another" is made in "Spring Open"
    And the player "Sam Someone" is entered in "Block A" of "Spring Open"
    And the player "Alex Another" is entered in "Block A" of "Spring Open"

  Rule: The tournament is kept as every page of it shows it

    Scenario: The tournament is kept with its name
      When the page of "Spring Open" is read back
      Then the tournament's page is called "Spring Open"

    Scenario: The tournament is kept with its subtitle
      When the page of "Spring Open" is read back
      Then the tournament's page has the subtitle "A short one"

    Scenario: A tournament with no subtitle is kept with none
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the page of "Autumn Open" is read back
      Then the tournament's page has no subtitle

    Scenario: The competitions in use are kept in the tournament's order
      When the page of "Spring Open" is read back
      Then the competitions of the page are "Block A" and "Block B"

    Scenario: A competition archived is not one of the page's
      Given the block "Block B" of "Spring Open" is set aside
      When the page of "Spring Open" is read back
      Then the competitions of the page are "Block A"

  Rule: A competition is found as its page is asked for it

    Scenario: A competition is found by its slug
      When the competition "block-a" of "Spring Open" is read back
      Then the competition found is called "Block A"

    Scenario: A competition archived is not found
      Given the block "Block B" of "Spring Open" is set aside
      When the competition "block-b" of "Spring Open" is read back
      Then no competition is found for the page

    Scenario: A block is kept as the best of one unless it says
      When the competition "block-a" of "Spring Open" is read back
      Then the competition found is played as the best of 1

    Scenario: A block's rounds are kept
      Given a block named "Block C" played in 2 rounds is made in "Spring Open"
      When the competition "block-c" of "Spring Open" is read back
      Then the competition found is played in 2 rounds

    Scenario: A block's most hoops are kept
      Given a block named "Block D" played to 14 hoops is made in "Spring Open"
      When the competition "block-d" of "Spring Open" is read back
      Then the competition found is played to 14 hoops

  Rule: The players of a competition are kept as the page names them

    Scenario: The players are kept in the competition's order
      When the players of "Block A" of "Spring Open" are read back for its page
      Then the players of the page are "Sam Someone" and "Alex Another"

    Scenario: A player is kept with the slug that finds them
      When the players of "Block A" of "Spring Open" are read back for its page
      Then the player "Sam Someone" of the page has the slug "sam-someone"

    Scenario: A player who has withdrawn is kept after the rest
      Given the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" of "Spring Open" are read back for its page
      Then the players of the page are "Alex Another" and "Sam Someone"

    Scenario: A player who has withdrawn is kept as withdrawn
      Given the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" of "Spring Open" are read back for its page
      Then the player "Sam Someone" of the page is withdrawn

  Rule: The same is kept however the read models are made again

    Scenario: A rebuild with the competitions' streams first is kept as it was
      Given the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And the competition "block-a" of "Spring Open" is read back
      Then it is rebuilt without failing
      And the competition found is called "Block A"
