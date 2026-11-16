@browser @postgres
Feature: What a competition's player carries forward is changed in a modal dialog

  A manager says what a player brings into a competition from play it did not
  score by pressing "Carry Forward" on the player's row of the competition's
  Players tab (`competition-players-tab.feature`). That opens the carry
  forward dialog over the page. It asks for the six counts of a carry forward
  (`CarryForward.feature`): matches won and lost, games won and lost, and
  hoops for and against.

  It is a modal dialog, as the player dialog is (`player.feature`): it sits
  over the page it was opened from, nothing outside it can be pressed or
  reached by the keyboard while it is open, and it has no address. It offers
  its own way out, Cancel, and Escape does what Cancel does. Cancelling keeps
  nothing, and the reader is back on the Carry Forward they pressed.

  It is titled "Carry Forward" and the player's name, as "Carry Forward - Sam
  Someone", since the six fields alone do not say whose carry forward it is.
  It begins as the player's carry forward is. A count they carry nothing forward
  in begins empty rather than as 0, since the two are kept apart, and a field
  left empty carries nothing forward in that count. Every count is optional,
  so a dialog saved with every field empty carries nothing forward. Save keeps
  all six and closes the dialog; there is one player to change, so there is
  nothing to keep it open for. The list is asked for again, as it is after
  anything else is done on the tab, and the reader is back on the Carry
  Forward they pressed.

  The six are two to a row, what was won beside what was lost: matches, then
  games, then hoops for and against. Each is labelled whole, "Match wins"
  rather than "Wins", since a label rests inside its own field (`STYLE.md`)
  and a screen reader reads each field alone. A count is a number, so each is
  typed on a phone's keypad of numbers.

  What is refused is said beneath the count it is about, by the refusal's code
  (`CarryForward.feature`): a count below 0, or one that is not a whole
  number. A count is read as the digits typed, so one typed any other way,
  such as "1e2", is not taken as the number it could be read as, but refused
  as not a whole number. What was typed stays typed so that it can be put right, the reader
  is taken to the first count refused, nothing refused is kept, and the dialog
  stays open. A refusal about no one count, such as a competition archived
  while the dialog was open, is said above the fields.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

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
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"

  Rule: Carry Forward opens the dialog on the player's carry forward

    Scenario: Carry Forward opens the carry forward dialog
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is open

    Scenario: The dialog is titled for what it does
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is titled "Carry Forward - Sam Someone"

    Scenario: The dialog says whose carry forward it is
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog names the player "Sam Someone"

    Scenario: The dialog saves with Save
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog's first button is "Save"

    Scenario Outline: The dialog asks for each count
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog asks for "<field>"

      Examples:
        | field         |
        | Match wins    |
        | Match losses  |
        | Game wins     |
        | Game losses   |
        | Hoops for     |
        | Hoops against |

    Scenario Outline: Each count begins empty for a player who carries nothing forward
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "<field>" is empty

      Examples:
        | field         |
        | Match wins    |
        | Hoops against |

    Scenario Outline: Each count begins as the player's
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of <count> of <number>
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "<field>" says "<number>"

      Examples:
        | count         | number | field         |
        | match wins    | 3      | Match wins    |
        | match losses  | 1      | Match losses  |
        | game wins     | 7      | Game wins     |
        | game losses   | 4      | Game losses   |
        | hoops for     | 112    | Hoops for     |
        | hoops against | 86     | Hoops against |

    Scenario: A count of 0 begins as 0
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 0
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "Match wins" says "0"

    Scenario: A count the player carries nothing forward in begins empty
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "Match losses" is empty

    Scenario: The dialog is on the player whose Carry Forward was pressed
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has given the player "Alex Another" in "Block A" of "Spring Open" a carry forward of match wins of 2
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Alex Another"
      Then "Match wins" says "2"

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: The dialog is announced as a modal dialog
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is named "Carry Forward - Sam Someone"

    Scenario: The reader is put in the first count when the dialog opens
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "Match wins" has the focus

    Scenario: The keyboard does not leave the dialog going forward
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      When Tab is pressed until the focus comes round again
      Then the focus never left the carry forward dialog

    Scenario: The keyboard does not leave the dialog going back
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      When Shift and Tab are pressed until the focus comes round again
      Then the focus never left the carry forward dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      When "Cancel" is pressed
      Then the carry forward dialog is not open

    Scenario: Escape closes the dialog
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      When Escape is pressed
      Then the carry forward dialog is not open

    Scenario: Cancelling keeps nothing
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      When "Cancel" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries nothing forward

    Scenario: The reader is back on Carry Forward once the dialog is cancelled
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      When "Cancel" is pressed
      Then "Carry Forward" on the player "Sam Someone" has the focus

  Rule: Save keeps the carry forward and closes the dialog

    Scenario Outline: Each count saved is kept
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "<number>" is typed as the "<field>"
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward <count> of <number>

      Examples:
        | field         | number | count         |
        | Match wins    | 3      | match wins    |
        | Match losses  | 1      | match losses  |
        | Game wins     | 7      | game wins     |
        | Game losses   | 4      | game losses   |
        | Hoops for     | 112    | hoops for     |
        | Hoops against | 86     | hoops against |

    Scenario: A count of 0 saved is kept as 0
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "0" is typed as the "Match wins"
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward match wins of 0

    Scenario: A count left empty carries nothing forward in it
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward nothing in match losses

    Scenario: A count emptied is kept as nothing carried forward
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      And the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "Match wins" is emptied
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries nothing forward

    Scenario: A count left alone is kept as it was
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      And the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "7" is typed as the "Game wins"
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward match wins of 3

    Scenario: Saving closes the dialog
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      When "Save" is pressed
      Then the carry forward dialog is not open

    Scenario: The carry forward saved is what the dialog begins with next time
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      And "Save" is pressed
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "Match wins" says "3"

    Scenario: The reader is back on Carry Forward once the dialog is saved
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      When "Save" is pressed
      Then "Carry Forward" on the player "Sam Someone" has the focus

    Scenario: Saving leaves the address as it was
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      When "Save" is pressed
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

  Rule: What is refused is said beneath the count it is about

    Scenario Outline: A count below 0 is refused beneath the count
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "-1" is typed as the "<field>"
      When "Save" is pressed
      Then "<field>" is refused with "<code>"

      Examples:
        | field         | code                               |
        | Match wins    | CarryForward.MatchWinsBelowZero    |
        | Match losses  | CarryForward.MatchLossesBelowZero  |
        | Game wins     | CarryForward.GameWinsBelowZero     |
        | Game losses   | CarryForward.GameLossesBelowZero   |
        | Hoops for     | CarryForward.HoopsForBelowZero     |
        | Hoops against | CarryForward.HoopsAgainstBelowZero |

    Scenario: A count that is not a whole number is refused beneath the count
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "1.5" is typed as the "Game wins"
      When "Save" is pressed
      Then "Game wins" is refused with "CarryForward.GameWinsNotWhole"

    Scenario: A count typed other than in digits is refused beneath the count
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "1e2" is typed as the "Match wins"
      When "Save" is pressed
      Then "Match wins" is refused with "CarryForward.MatchWinsNotWhole"

    Scenario: A refused carry forward is not kept
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "-1" is typed as the "Match wins"
      When "Save" is pressed
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries nothing forward

    Scenario: A refused dialog stays open
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "-1" is typed as the "Match wins"
      When "Save" is pressed
      Then the carry forward dialog is open

    Scenario: A refused dialog keeps what was typed
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "3" is typed as the "Match wins"
      And "-1" is typed as the "Game losses"
      When "Save" is pressed
      Then "Match wins" says "3"

    Scenario: The reader is taken to the count refused
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "-1" is typed as the "Game losses"
      When "Save" is pressed
      Then "Game losses" has the focus

    Scenario: A refusal about no one count is said above the fields
      Given the players of "Block A" in "Spring Open" are open
      And "Carry Forward" is pressed on the player "Sam Someone"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And "3" is typed as the "Match wins"
      When "Save" is pressed
      Then the carry forward dialog says above its fields that it was refused with "Tournament.CompetitionArchived"

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). The player's name is what
    the manager typed, and nobody's language, so it is not read for marks.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the players of "Block A" in "Spring Open" are open
      When the way to change the carry forward of the player "Sam Someone" is pressed
      Then every word in the carry forward dialog but the player's name is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the players of "Block A" in "Spring Open" are open
      And the way to change the carry forward of the player "Sam Someone" is pressed
      And "-1" is typed into the first count
      When the carry forward dialog is sent as it is
      Then the carry forward dialog says what it refused
      And every word in the carry forward dialog but the player's name is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is no wider than the window

    Scenario Outline: The counts are two to a row
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "<first>" is beside "<second>"

      Examples:
        | first      | second        |
        | Match wins | Match losses  |
        | Game wins  | Game losses   |
        | Hoops for  | Hoops against |

    Scenario Outline: The rows are matches, then games, then hoops
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "<upper>" is above "<lower>"

      Examples:
        | upper      | lower     |
        | Match wins | Game wins |
        | Game wins  | Hoops for |

    Scenario Outline: Each count is typed on a keypad of numbers
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "<field>" is typed on a keypad of numbers

      Examples:
        | field         |
        | Match wins    |
        | Hoops against |

    Scenario Outline: Each button can be pressed with a thumb
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Save   |
        | Cancel |

    Scenario: The buttons are stacked, the one that saves first
      Given the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then "Save" is above "Cancel"
