@browser @postgres
Feature: A doubles pair is added from two of the tournament's players in a modal dialog

  A manager of a doubles tournament makes its pairs from the players it
  already has, by pressing "Add Pair" on the tournament's Players tab
  (`players-tab.feature`), beside Add Player. That opens the pair dialog over
  the page. It asks for a first player and a second player, each chosen from
  the tournament's players in use, in the tournament's order, and Add Pair
  makes the pair of them in one go (`AddPair.feature`).

  The pair is a player of the tournament as any other is, and is listed among
  them, named from the two: "Sam Someone & Alex Another", or where both have the
  same last name, "Peter & Rosie Landrebe" (`pairName.feature`). The two it is
  made of are left as they are. What the pair represents is made from what
  they do (`pairRepresenting.feature`): what one of them represents, what both
  represent once, or both, as "Canterbury Croquet Club / Melbourne". Players set aside are not offered, since they
  are in no competition until restored.

  Add Pair is offered only to a manager, and only where there are two players
  to choose from, since a pair is made of two.

  It is a modal dialog, as the others are (`player.feature`): it sits over the
  page, nothing outside it can be reached while it is open, and Cancel and
  Escape close it and keep nothing. It works as the player dialog does when it
  adds a player (`player.feature`), since a manager making the pairs of a
  tournament makes many: Add Pair keeps the pair and leaves the dialog open,
  says which pair was added, and empties both choices for the next, with the
  focus back on the first player. What it says is told to a screen reader, and
  is taken back once another player is chosen. The list behind the dialog is
  asked for again after each pair, so the pair is listed there while the dialog
  is still open, and is offered to be chosen like any other player.

  The second player is chosen from the players but the first, since a player
  is not paired with themselves (`AddPair.feature`), so the same player cannot
  be chosen twice. Until a first player is chosen the second is chosen from
  every player, and a first player chosen who was chosen as the second leaves
  the second to be chosen again.

  What is refused is said by the refusal's code (`AddPair.feature`): a name the
  tournament already has, as a pair made twice, is said above the fields. What
  was chosen stays chosen so that it can be put right, and the dialog stays
  open.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: Add Pair opens the dialog, where there are two players to choose from

    Scenario: Add Pair is offered
      When the players of "Spring Open" are opened
      Then the way to add a pair is offered

    Scenario: Add Pair is not offered where one player is in use
      Given "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the way to add a pair is not offered

    Scenario: Add Pair opens the dialog
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog is open

    Scenario: The dialog is titled for what it does
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog is titled "Add Pair"

    Scenario Outline: The dialog asks for each player of the pair
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog asks for "<field>"

      Examples:
        | field         |
        | First player  |
        | Second player |

    Scenario: The dialog offers the players in use
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog offers the player "Sam Someone"
      And the pair dialog offers the player "Alex Another"

    Scenario: The second player is chosen from every player until a first is chosen
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog offers "Sam Someone" as the second player
      And the pair dialog offers "Alex Another" as the second player

    Scenario: The second player is chosen from the players but the first
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      When "Sam Someone" is chosen as the first player
      Then the pair dialog does not offer "Sam Someone" as the second player

    Scenario: The other players are still offered as the second player
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      When "Sam Someone" is chosen as the first player
      Then the pair dialog offers "Alex Another" as the second player

    Scenario: A first player chosen who was chosen as the second leaves the second to be chosen again
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the second player
      When "Sam Someone" is chosen as the first player
      Then no second player is chosen

    Scenario: A player set aside is not offered
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has archived the player "Chris Third" in "Spring Open"
      And the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog does not offer the player "Chris Third"

    Scenario: The dialog makes the pair with Add Pair
      Given the players of "Spring Open" are open
      When the way to add a pair is pressed
      Then the pair dialog's first button is "Add Pair"

  Rule: Add Pair makes the pair of the two chosen

    Scenario: The pair is listed among the players
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the player "Sam Someone & Alex Another" is listed

    Scenario: The pair is kept
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then "Spring Open" has the player "Sam Someone & Alex Another"

    Scenario: Two players with the same last name are called by their first names and the last name
      Given "organiser@example.com" has added the player "Peter Landrebe" to "Spring Open"
      And "organiser@example.com" has added the player "Rosie Landrebe" to "Spring Open"
      And the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Peter Landrebe" is chosen as the first player
      And "Rosie Landrebe" is chosen as the second player
      When Add Pair is pressed
      Then the player "Peter & Rosie Landrebe" is listed

    Scenario: The pair is listed representing what its players represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And the player is to represent "Melbourne"
      And "organiser@example.com" has added the player "Kim Keeper" to "Spring Open"
      And the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Pat Player" is chosen as the first player
      And "Kim Keeper" is chosen as the second player
      When Add Pair is pressed
      Then the player "Pat Player & Kim Keeper" is shown representing "Canterbury Croquet Club / Melbourne"

    Scenario: The two players are still listed
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the player "Sam Someone" is listed
      And the player "Alex Another" is listed

    Scenario: The dialog stays open once the pair is made
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog is open

    Scenario: Adding says which pair was added
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog says "Sam Someone & Alex Another" was added

    Scenario: Which pair was added is told to a screen reader
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then what the pair dialog says about which pair was added is announced

    Scenario: The first player is chosen again for the next pair
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then no first player is chosen

    Scenario: The second player is chosen again for the next pair
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then no second player is chosen

    Scenario: The first player has the focus for the next pair
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the first player has the focus

    Scenario: The pair is offered to be chosen once it is made
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog offers the player "Sam Someone & Alex Another"

    Scenario: Another pair is made without the dialog being opened again
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      And Add Pair is pressed
      And "Chris Third" is chosen as the first player
      And "Sam Someone" is chosen as the second player
      When Add Pair is pressed
      Then the player "Chris Third & Sam Someone" is listed

    Scenario: What was said is taken back once another player is chosen
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      And Add Pair is pressed
      When "Sam Someone" is chosen as the first player
      Then the pair dialog says nobody was added

  Rule: Both players must be chosen before a pair is made

    Scenario: Add Pair with nobody chosen does nothing
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      When Add Pair is pressed with a player not chosen
      Then the pair dialog is open
      And no pair was asked for
      And "Spring Open" does not have the player "Sam Someone & Alex Another"

    Scenario: Add Pair with only the first player chosen does nothing
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      When Add Pair is pressed with a player not chosen
      Then the pair dialog says nobody was added
      And no pair was asked for

    Scenario: Add Pair with only the second player chosen does nothing
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed with a player not chosen
      Then the pair dialog is open
      And no pair was asked for

  Rule: Cancel keeps nothing

    Scenario: Cancel closes the dialog
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      When the pair dialog is cancelled
      Then the pair dialog is closed

    Scenario: Cancel makes no pair
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When the pair dialog is cancelled
      Then "Spring Open" does not have the player "Sam Someone & Alex Another"

  Rule: What is refused is said by its code, and the dialog stays open

    Scenario: A pair made twice is said above the fields
      Given "organiser@example.com" has paired the players "Sam Someone" and "Alex Another" in "Spring Open"
      And the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog says above its fields that it was refused with "Tournament.PlayerNameTaken"

    Scenario: A refusal takes back what was said of the last pair
      Given the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      And Add Pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog says nobody was added

    Scenario: What was chosen stays chosen when it is refused
      Given "organiser@example.com" has paired the players "Sam Someone" and "Alex Another" in "Spring Open"
      And the players of "Spring Open" are open
      And the way to add a pair is pressed
      And "Sam Someone" is chosen as the first player
      And "Alex Another" is chosen as the second player
      When Add Pair is pressed
      Then the pair dialog is open
      And "Sam Someone" is still the first player
