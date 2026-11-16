@browser @postgres
Feature: Several of the tournament's players are added to a competition in a modal dialog

  A manager sets up a competition quickly by pressing "Add Several" on the
  competition's Players tab (`competition-players-tab.feature`), beside Add
  Player. That opens the add players dialog over the page. It lists every
  player of the tournament who is not already in the competition, in the
  tournament's order, each with a box to tick, and has a box above them to tick
  every one. Add Selected enters the ones ticked in one go
  (`EnterPlayers.feature`) and closes the dialog, and the list behind it is
  asked for again, as it is after anything else is done on the tab.

  Add Several is offered only where there are two or more players to choose
  from, since choosing one is what the drop-down is for.

  It is a modal dialog, as the carry forward dialog is (`carry-forward.feature`):
  it sits over the page, nothing outside it can be reached while it is open,
  and Cancel and Escape close it and keep nothing. A player is entered in the
  tournament's order whatever order they were ticked in
  (`EnterPlayers.feature`). Pressing Add Selected with nobody ticked does
  nothing.

  A player who cannot be entered, such as one already put in the competition
  by somebody else while the dialog was open, is not entered silently and is
  not the end of it either. Nobody is entered, and a second dialog says which
  players cannot be, each with the reason in the reader's language, and asks
  whether to add the rest of those ticked. That is the manager's to decide:
  "Add the Rest" enters the ones who can be, and Cancel goes back to the ticks,
  which are as they were, to be changed. Where nobody ticked can be entered
  there is nothing to decide, so the reasons are said above the list.
  The list behind the dialog is asked for again whenever the site has answered,
  since a player cannot be entered most often because somebody else changed the
  competition, and the list is then out of date.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"

  Rule: Add Several opens the dialog, where there are two or more players to choose from

    Scenario: Add Several is offered
      When the players of "Block A" in "Spring Open" are opened
      Then the way to add several players is offered

    Scenario: Add Several is not offered where one player is left to choose
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the way to add several players is not offered

    Scenario: Add Several opens the dialog
      Given the players of "Block A" in "Spring Open" are open
      When the way to add several players is pressed
      Then the add players dialog is open

    Scenario: The dialog is titled for what it does
      Given the players of "Block A" in "Spring Open" are open
      When the way to add several players is pressed
      Then the add players dialog is titled "Add Players"

    Scenario: The dialog offers each player not in the competition
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When the way to add several players is pressed
      Then the add players dialog offers "Alex Another"
      And the add players dialog offers "Chris Third"
      And the add players dialog does not offer "Sam Someone"

    Scenario: The players are offered in the tournament's order
      Given the players of "Block A" in "Spring Open" are open
      When the way to add several players is pressed
      Then the first player the add players dialog offers is "Sam Someone"

    Scenario: The dialog enters with Add Selected
      Given the players of "Block A" in "Spring Open" are open
      When the way to add several players is pressed
      Then the add players dialog's first button is "Add Selected"

  Rule: Add Selected enters the players ticked

    Scenario: A player ticked is entered
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      And "Alex Another" is ticked in the add players dialog
      When Add Selected is pressed
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"
      And the competition "Block A" of "Spring Open" has the player "Alex Another"

    Scenario: A player not ticked is not entered
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      When Add Selected is pressed
      Then the competition "Block A" of "Spring Open" does not have the player "Chris Third"

    Scenario: The dialog closes once they are entered
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      When Add Selected is pressed
      Then the add players dialog is closed

    Scenario: The players entered are listed among those playing
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      And "Alex Another" is ticked in the add players dialog
      When Add Selected is pressed
      Then the player "Sam Someone" is listed among those playing
      And the player "Alex Another" is listed among those playing

    Scenario: Every player is ticked by the box above them
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And every player is ticked in the add players dialog
      When Add Selected is pressed
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"
      And the competition "Block A" of "Spring Open" has the player "Alex Another"
      And the competition "Block A" of "Spring Open" has the player "Chris Third"

    Scenario: The players are entered in the tournament's order, whatever order they were ticked in
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Chris Third" is ticked in the add players dialog
      And "Sam Someone" is ticked in the add players dialog
      When Add Selected is pressed
      Then the player "Sam Someone" is listed before "Chris Third"

    Scenario: Nobody ticked enters nobody
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      When Add Selected is pressed with nobody ticked
      Then the add players dialog is open
      And the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

  Rule: Cancel keeps nothing

    Scenario: Cancel closes the dialog
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      When the question is declined
      Then the add players dialog is closed

    Scenario: Cancel enters nobody
      Given the players of "Block A" in "Spring Open" are open
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      When the question is declined
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

  Rule: Where some of those ticked cannot be entered, the manager decides

    Background:
      Given the players of "Block A" in "Spring Open" are open
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      And "Alex Another" is ticked in the add players dialog

    Scenario: A second dialog says who cannot be entered
      When Add Selected is pressed
      Then the question of the players who cannot be added is open
      And the question names "Sam Someone"
      And the question does not name "Alex Another"

    Scenario: It says why, by the refusal's code
      When Add Selected is pressed
      Then the question says "Sam Someone" was refused with "Competition.PlayerAlreadyEntered"

    Scenario: The list behind the dialog is asked for again, since it was out of date
      When Add Selected is pressed
      Then the player "Sam Someone" is listed among those playing

    Scenario: Nobody is entered until it is decided
      When Add Selected is pressed
      Then the competition "Block A" of "Spring Open" does not have the player "Alex Another"

    Scenario: Add the Rest enters those who can be
      Given Add Selected is pressed
      When Add the Rest is pressed
      Then the competition "Block A" of "Spring Open" has the player "Alex Another"

    Scenario: The dialog is closed once the rest are entered
      Given Add Selected is pressed
      When Add the Rest is pressed
      Then the add players dialog is closed

    Scenario: Cancel goes back to the ticks, as they were
      Given Add Selected is pressed
      When the question is declined
      Then the add players dialog is open
      And "Alex Another" is still ticked in the add players dialog

    Scenario: Cancel enters nobody
      Given Add Selected is pressed
      When the question is declined
      Then the competition "Block A" of "Spring Open" does not have the player "Alex Another"

  Rule: Where nobody ticked can be entered, the reasons are said above the list

    Scenario: Nobody is entered and nothing is asked
      Given the players of "Block A" in "Spring Open" are open
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the way to add several players is pressed
      And "Sam Someone" is ticked in the add players dialog
      When Add Selected is pressed
      Then the add players dialog says above its list that it was refused with "Competition.PlayerAlreadyEntered"
      And the add players dialog is open
