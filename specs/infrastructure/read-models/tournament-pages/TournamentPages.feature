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

    Scenario: The tournament is kept with the country it is played in
      When the page of "Spring Open" is read back
      Then the tournament's page is played in the country "au"

    Scenario: The tournament is kept with the day it starts
      When the page of "Spring Open" is read back
      Then the tournament's page starts on "2026-10-03"

    Scenario: The tournament is kept with the day it finishes
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" to finish on "2026-11-05"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the page of "Autumn Open" is read back
      Then the tournament's page finishes on "2026-11-05"

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

  Rule: A tournament played by teams is kept as its team pages count it

    The summary of a tournament's teams, a group's page and a test's page are
    counted from the teams, the tests and the games kept, as the tournament and
    its competitions' events said them, so that none of them asks the events.
    A test's rules are what decide it, and a team is known to a page by its
    names.

    Background:
      Given a tournament "Spring Tests" to start on "2026-10-03"
      And "Spring Tests" is to be played by teams
      And "Spring Tests" is created by the account for "organiser@example.com"
      And a test between "Australia" and "England" is made in "Spring Tests"
      And the team players "Pat Player" and "Kim Keeper" play in the test of "Spring Tests"

    Scenario: The tournament is kept with its format
      When the page of "Spring Tests" is read back
      Then the tournament's page is played in the format "Teams"

    Scenario: A tournament is kept as not drawing a level test unless it says
      When the page of "Spring Tests" is read back
      Then the tournament's page does not draw a test level on matches

    Scenario: A tournament that draws a level test is kept as drawing it
      Given the level tests of "Spring Tests" are drawn
      When the page of "Spring Tests" is read back
      Then the tournament's page draws a test level on matches

    Scenario: A test is kept with its two teams
      When the competition "aus-v-eng" of "Spring Tests" is read back
      Then the competition found is a test between "Australia" and "England"

    Scenario: A test is kept as the best of one unless it says
      When the competition "aus-v-eng" of "Spring Tests" is read back
      Then the competition found is played as the best of 1

    Scenario: The teams are kept in the tournament's order
      When the teams of "Spring Tests" are read back to be stood
      Then the teams to stand are "Australia" and "England"

    Scenario: A team archived is kept as archived
      Given the team "Wales" is added to "Spring Tests" with the short name "WAL"
      And the team "Wales" of "Spring Tests" is set aside
      When the teams of "Spring Tests" are read back to be stood
      Then the team "Wales" to stand is archived

    Scenario: A team is kept with its short name
      When the teams of "Spring Tests" are read back to be stood
      Then the team "Australia" to stand is known for short as "Aus"

    Scenario: A team player is kept as playing for their team
      When the teams of "Spring Tests" are read back to be stood
      Then the team player "Kim Keeper" to stand plays for "England"

    Scenario: A test in use is kept with its games in the order they were added
      Given "Pat Player" beat "Kim Keeper" 26 to 17 in the test of "Spring Tests" as "the first"
      When the teams of "Spring Tests" are read back to be stood
      Then the first test to stand has 1 game

    Scenario: A game archived is not kept to be counted
      Given "Pat Player" beat "Kim Keeper" 26 to 17 in the test of "Spring Tests" as "the first"
      And the game "the first" in "the test" of "Spring Tests" is archived
      When the teams of "Spring Tests" are read back to be stood
      Then the first test to stand has 0 games

    Scenario: A test is kept with the matches it is expected to have
      When the teams of "Spring Tests" are read back to be stood
      Then the first test to stand is expected to have 10 matches

  Rule: The names of a tournament's players are kept as a line of a standing names them

    A standing names a line by the id the tournament keeps its player by, and
    asks nothing else of the player, so a player kept without a slug, or one set
    aside, is still named.

    Scenario: A player is kept with their name
      When the names of the players of "Spring Open" are read back
      Then the name of the player "Sam Someone" of "Spring Open" is "Sam Someone"

    Scenario: A player set aside is still named
      Given the player "Chris Third" is made in "Spring Open"
      And the player "Chris Third" of "Spring Open" is set aside
      When the names of the players of "Spring Open" are read back
      Then the name of the player "Chris Third" of "Spring Open" is "Chris Third"

    Scenario: A player of another tournament is not named
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the names of the players of "Autumn Open" are read back
      Then the player "Sam Someone" of "Spring Open" is not named

  Rule: A tournament kept before its format was is still read

    A block or a Swiss page needs no format, so it is not refused for want of
    one while the read models are made again after an upgrade.

    Scenario: A tournament whose format is not kept is read without it
      Given the format of "Spring Open" is not kept
      When the page of "Spring Open" is read back
      Then the tournament's page is called "Spring Open"
      And the tournament's page has no format

  Rule: The same is kept however the read models are made again

    Scenario: A rebuild with the competitions' streams first is kept as it was
      Given the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And the competition "block-a" of "Spring Open" is read back
      Then it is rebuilt without failing
      And the competition found is called "Block A"
