@browser @postgres
Feature: A game's score is added to a test, or corrected, in a modal dialog

  A manager or a scorer adds the scores of a test's games from the test's
  page, by pressing "Add Score", and corrects one from its Edit
  (`view.feature` beneath the test). Either opens the score dialog over the
  page. It is the score dialog of a competition
  (`score-modal-dialog.feature`), reading as the result is said aloud — the
  winner and their score, "beat", the loser and theirs — with Add Game that
  keeps it open for the next game of a batch, Save that closes it on a
  correction, and Cancel and Escape that keep nothing. What is said there is
  said here unless this says otherwise, and is not said again.

  What is a test's own is who is offered. A test's players are its two teams'
  (`PlayersOfTest.feature`), and a game in it is between a player of each
  (`gamesInATest.feature`). So the winner is chosen from both teams' players
  in use, under each team's name, the test's first team first and each
  team's players in the team's order, with no one chosen to begin with.
  Once the winner is chosen, the loser is offered from the other team alone,
  since anybody of the winner's own team could only be refused; choosing a
  winner of the other team offers the other team's players in turn, and a
  loser chosen who is no longer offered is no longer chosen. Before a winner
  is chosen, the loser is offered from both teams, so that a reader who
  begins with the loser can. An archived player plays no game, and is not
  offered.

  A test has no draw, so choosing the winner chooses nobody as the loser, as
  in a block. Two players who meet play a match of the test's best-of
  (`gamesInATest.feature`), and a game of a match already decided is about
  neither player alone, so `Competition.MatchDecided` is said above the
  fields, as a knockout's refusal of two players not drawn to meet is. Edit can change a
  score's players as well as its scores, since every score in a test could be
  archived (`scores-tab.feature`), and is asked of them what adding asks.

  A player archived while the dialog is open is refused as the player refuses
  it (`TeamPlayer.Archived`), beneath the field they were chosen in.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is. Unless a
  scenario says otherwise, a team's short name is the first three letters of
  its name in capitals (`Team.feature`).

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the tournament "Spring Tests" starts on "2026-10-03"
    And the tournament "Spring Tests" is for the sport "ac"
    And the tournament "Spring Tests" is played in the format "Teams"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Pat Fourth" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "Scotland" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: The dialog is the score dialog

    Scenario: Add Score opens the score dialog
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario Outline: The dialog asks for what a game is
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the score dialog asks for "<field>"

      Examples:
        | field          |
        | Winner         |
        | Winner's score |
        | Loser          |
        | Loser's score  |

    Scenario: The dialog says "beat" between the winner and the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the score dialog says "beat" between "Winner" and "Loser"

    Scenario: A scorer can open the dialog
      Given "scorer@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      And the reader has signed in as "scorer@example.com" with the password "another horse battery staple"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the score dialog is open

  Rule: The winner is chosen from both teams' players, under each team's name

    Scenario: No player is the first choice
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the first choice offered as the "Winner" is nobody

    Scenario Outline: A player of either team is offered as the winner
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "<player>" is offered as the "Winner"

      Examples:
        | player      |
        | Sam Someone |
        | Chris Third |

    Scenario: A player is offered under their team's name
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Chris Third" is offered under "England" as the "Winner"

    Scenario: The first team's players are offered first
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Pat Fourth" is offered after "Alex Another" as the "Winner"

    Scenario: A team's players are offered in the team's order
      Given "organiser@example.com" has moved the player "Alex Another" of the team "Australia" of "Spring Tests" up
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Alex Another" is offered before "Sam Someone" as the "Winner"

    Scenario: A player of a team not in the test is not offered
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Kim Keeper" is not offered as the "Winner"

    Scenario: An archived player is not offered
      Given "organiser@example.com" has archived the player "Pat Fourth" of the team "England" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Pat Fourth" is not offered as the "Winner"

  Rule: Once the winner is chosen, the loser is offered from the other team alone

    Scenario: Before a winner is chosen, a player of either team is offered as the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then "Sam Someone" is offered as the "Loser"

    Scenario: A winner of the first team leaves the second team's players offered as the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      When "Sam Someone" is chosen as the "Winner"
      Then "Chris Third" is offered as the "Loser"

    Scenario: A winner of the first team leaves none of their own team offered as the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      When "Sam Someone" is chosen as the "Winner"
      Then "Alex Another" is not offered as the "Loser"

    Scenario: A winner of the second team leaves the first team's players offered as the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      When "Chris Third" is chosen as the "Winner"
      Then "Sam Someone" is offered as the "Loser"

    Scenario: Choosing the winner chooses nobody as the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      When "Sam Someone" is chosen as the "Winner"
      Then "Loser" is empty

    Scenario: A loser of the winner's own team is no longer chosen
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Alex Another" is chosen as the "Loser"
      When "Sam Someone" is chosen as the "Winner"
      Then "Loser" is empty

    Scenario: A loser of the other team stays chosen
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Loser"
      When "Sam Someone" is chosen as the "Winner"
      Then the "Loser" chosen is "Chris Third"

  Rule: Add Game adds the game to the test

    Scenario: A game added is one of the test's
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the test "AUS v ENG" of "Spring Tests" has the game of "Chris Third" beating "Sam Someone" 26 to 17

    Scenario: Adding leaves the dialog open
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog is open

    Scenario: Adding says which game was added
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog says the game "Chris Third" won against "Sam Someone" was added

    Scenario: A game of a match already decided is refused above the fields
      Given "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Chris Third" is chosen as the "Loser"
      And "20" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog says "Competition.MatchDecided" above the fields

  Rule: Edit can change a score's players, from the teams as when adding

    Scenario: Edit begins with the winner chosen as they are
      Given "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Edit" is pressed on the score of "Chris Third" beating "Sam Someone"
      Then the "Winner" chosen is "Chris Third"

    Scenario: Edit offers the other team's players as the loser
      Given "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Edit" is pressed on the score of "Chris Third" beating "Sam Someone"
      Then "Alex Another" is offered as the "Loser"

    Scenario: A score corrected to other players is kept with them
      Given "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Edit" is pressed on the score of "Chris Third" beating "Sam Someone"
      And "Alex Another" is chosen as the "Loser"
      When "Save" is pressed
      Then the test "AUS v ENG" of "Spring Tests" has the game of "Chris Third" beating "Alex Another" 26 to 17

  Rule: What is refused is said where the score dialog says it

    Scenario: A loser not chosen is refused beside the loser
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Loser" is refused with "Game.LoserMissing"

    Scenario: A player archived while the dialog is open is refused
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When "Add Game" is pressed
      Then "Loser" is refused with "TeamPlayer.Archived"

    Scenario: A refused game is not added
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the test "AUS v ENG" of "Spring Tests" has no games

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). The teams' and the
    players' names are what the manager typed, and nobody's language.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When the way to add a score is pressed
      Then every word in the score dialog but the teams' and the players' names is in the test locale
