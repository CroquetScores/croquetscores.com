@browser @postgres
Feature: A competition is added to a tournament in a modal dialog

  A manager adds the competitions to a tournament from its Competitions tab,
  by pressing "Add Competition" (`competitions-tab.feature`). It opens the
  competition dialog over the page. It asks for what a competition is: its
  name, its kind, and the shape its kind has (`AddBlock.feature`,
  `AddKnockout.feature`, `AddSwiss.feature`).

  It is a modal dialog, as the player dialog is (`player.feature`): it sits
  over the page it was opened from, nothing outside it can be pressed or
  reached by the keyboard while it is open, it has no address, and it has a
  Cancel button, which Escape does as well. Cancelling keeps nothing that was
  not already kept, and the reader is back on Add Competition.

  Changing a competition is to be done in the same dialog, from Edit on each
  competition in use, so that adding and changing cannot come to ask different
  things. It is not written yet, so this feature is about adding alone, and
  the dialog is titled "Add Competition" and its button is Add.

  The kind is a block, a knockout or a Swiss, and the dialog begins on a
  block, which most competitions are. A block and a Swiss ask what each match
  is the best of, and begin on 1. A knockout asks how many places its draw has
  and what each round is the best of. The places are offered as the numbers a
  draw can have, 2, 4, 8, 16, 32, 64 and 128, since any other number could
  not halve round by round to a final, and the dialog begins on 8. A draw has
  as many rounds as it takes to halve its places to one, so the dialog asks
  what each is the best of, "Round 1" first and the final last, and has as
  many as the places chosen need: choosing other places takes rounds away or
  adds them, each added one beginning on 1, and the rounds kept keep what was
  typed in them. Only what the kind chosen asks for is shown.

  Competitions are added a few at a time, and those added together are
  mostly alike, "Block A", "Block B" and "Block C", so Add does not close the
  dialog. It adds the competition, tells the reader in words that it was
  added, and empties the name for the next, with the reader back in it. The
  kind and its shape are left as they were, so that the next one alike is its
  name alone. A screen reader is told as well, since nothing else on the
  dialog changes where the reader is.

  What is refused is said beneath the field it is about, by the refusal's
  code, and what was typed stays typed so that it can be put right: a name
  missing or too long, a name another of the tournament's competitions
  already has, however it is capitalised, a best-of that is not a whole
  number of at least one, and a round of a knockout that is the best of an
  even number, since a match of a knockout has to have a winner
  (`KnockoutDraw.feature`). A refusal about no one field is said above the
  fields. Nothing refused is kept, and the dialog stays open.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the competitions of "Spring Open" are open

  Rule: Add Competition opens the dialog to add a competition

    Scenario: Add Competition opens the competition dialog
      When "Add Competition" is pressed
      Then the competition dialog is open

    Scenario: The dialog is titled for what it does
      When "Add Competition" is pressed
      Then the competition dialog is titled "Add Competition"

    Scenario: The dialog adds with Add
      When "Add Competition" is pressed
      Then the competition dialog's first button is "Add"

    Scenario: The name begins empty
      When "Add Competition" is pressed
      Then "Name" is empty

    Scenario: The dialog begins on a block
      When "Add Competition" is pressed
      Then the kind chosen is "Block"

    Scenario Outline: The kind is offered as a block, a knockout or a Swiss
      When "Add Competition" is pressed
      Then the kind "<kind>" is offered

      Examples:
        | kind     |
        | Block    |
        | Knockout |
        | Swiss    |

  Rule: A block and a Swiss ask what each match is the best of

    Scenario Outline: A block and a Swiss ask for their name and what each match is the best of
      Given "Add Competition" is pressed
      When the kind "<kind>" is chosen
      Then the competition dialog asks for "<field>"

      Examples:
        | kind  | field   |
        | Block | Name    |
        | Block | Best of |
        | Swiss | Name    |
        | Swiss | Best of |

    Scenario Outline: A block and a Swiss begin on the best of 1
      Given "Add Competition" is pressed
      When the kind "<kind>" is chosen
      Then "Best of" says "1"

      Examples:
        | kind  |
        | Block |
        | Swiss |

    Scenario Outline: A block and a Swiss do not ask for places or rounds
      Given "Add Competition" is pressed
      When the kind "<kind>" is chosen
      Then the competition dialog does not ask for "<field>"

      Examples:
        | kind  | field   |
        | Block | Places  |
        | Block | Round 1 |
        | Swiss | Places  |
        | Swiss | Round 1 |

  Rule: A knockout asks for its places and what each round is the best of

    Scenario Outline: A knockout asks for its name and its places
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the competition dialog asks for "<field>"

      Examples:
        | field  |
        | Name   |
        | Places |

    Scenario: A knockout does not ask what each match is the best of
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the competition dialog does not ask for "Best of"

    Scenario: A knockout begins on 8 places
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the places chosen are 8

    Scenario Outline: The places offered are those that halve to a final
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then <places> places are offered

      Examples:
        | places |
        | 2      |
        | 4      |
        | 8      |
        | 16     |
        | 32     |
        | 64     |
        | 128    |

    Scenario: No other number of places is offered
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then 7 numbers of places are offered

    Scenario Outline: A knockout of 8 places asks for its three rounds
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the competition dialog asks for "<round>"

      Examples:
        | round   |
        | Round 1 |
        | Round 2 |
        | Round 3 |

    Scenario: A knockout of 8 places asks for no fourth round
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the competition dialog does not ask for "Round 4"

    Scenario: Each round begins on the best of 1
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then "Round 3" says "1"

    Scenario: Choosing more places adds a round
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When 16 places are chosen
      Then the competition dialog asks for "Round 4"

    Scenario: A round added begins on the best of 1
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      And "3" is typed as the "Round 3"
      When 16 places are chosen
      Then "Round 4" says "1"

    Scenario: Choosing fewer places takes a round away
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When 4 places are chosen
      Then the competition dialog does not ask for "Round 3"

    Scenario: The rounds kept keep what was typed in them
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      And "3" is typed as the "Round 2"
      When 4 places are chosen
      Then "Round 2" says "3"

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      When "Add Competition" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: The dialog is announced as a modal dialog
      When "Add Competition" is pressed
      Then the competition dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      When "Add Competition" is pressed
      Then the competition dialog is named "Add Competition"

    Scenario: The reader is put in the name when the dialog opens
      When "Add Competition" is pressed
      Then "Name" has the focus

    Scenario: Nothing outside the dialog can be pressed
      Given "Add Competition" is pressed
      When the site's name in the header is pressed
      Then the competition dialog is open

    Scenario: The keyboard does not leave the dialog going forward
      Given "Add Competition" is pressed
      When Tab is pressed until the focus comes round again
      Then the focus never left the competition dialog

    Scenario: The keyboard does not leave the dialog going back
      Given "Add Competition" is pressed
      When Shift and Tab are pressed until the focus comes round again
      Then the focus never left the competition dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      When "Add Competition" is pressed
      Then the competition dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given "Add Competition" is pressed
      When "Cancel" is pressed
      Then the competition dialog is not open

    Scenario: Escape closes the dialog
      Given "Add Competition" is pressed
      When Escape is pressed
      Then the competition dialog is not open

    Scenario: Cancelling adds nothing
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Cancel" is pressed
      Then "Spring Open" has no competitions

    Scenario: Cancelling keeps the competitions already added
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "Add" is pressed
      When "Cancel" is pressed
      Then "Spring Open" has the competition "Block A"

    Scenario: The reader is back on Add Competition once the dialog is cancelled
      Given "Add Competition" is pressed
      When "Cancel" is pressed
      Then "Add Competition" has the focus

  Rule: Add adds the competition as it was asked for

    Scenario Outline: The competition added is of the kind chosen
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "<kind>" is chosen
      When "Add" is pressed
      Then the competition "Main Event" of "Spring Open" is a <kind added>

      Examples:
        | kind     | kind added |
        | Block    | block      |
        | Knockout | knockout   |
        | Swiss    | Swiss      |

    Scenario Outline: A block or a Swiss added is the best of what was typed
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "<kind>" is chosen
      And "3" is typed as the "Best of"
      When "Add" is pressed
      Then each match of the competition "Main Event" of "Spring Open" is the best of 3

      Examples:
        | kind  |
        | Block |
        | Swiss |

    Scenario: A knockout added has the places chosen
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And 16 places are chosen
      When "Add" is pressed
      Then the knockout "Main Event" of "Spring Open" has 16 places

    Scenario: A knockout added has each round the best of what was typed
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And 4 places are chosen
      And "3" is typed as the "Round 2"
      When "Add" is pressed
      Then the second round of the knockout "Main Event" of "Spring Open" is the best of 3

    Scenario: A round left alone is the best of 1
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And 4 places are chosen
      And "3" is typed as the "Round 2"
      When "Add" is pressed
      Then the first round of the knockout "Main Event" of "Spring Open" is the best of 1

    Scenario: The competition added is listed on the tab
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then the competition "Block A" is listed

  Rule: Add leaves the dialog open, ready for the next alike

    Scenario: Adding leaves the dialog open
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then the competition dialog is open

    Scenario: Adding says what was added
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then the competition dialog says "Block A" was added

    Scenario: What was added is told to a screen reader
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then what the competition dialog says about what was added is announced

    Scenario: Adding empties the name
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is empty

    Scenario: Adding puts the reader back in the name
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then "Name" has the focus

    Scenario: Adding leaves the kind as it was
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Swiss" is chosen
      When "Add" is pressed
      Then the kind chosen is "Swiss"

    Scenario: Adding leaves what each match is the best of as it was
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "3" is typed as the "Best of"
      When "Add" is pressed
      Then "Best of" says "3"

    Scenario: Adding leaves the places as they were
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And 16 places are chosen
      When "Add" is pressed
      Then the places chosen are 16

    Scenario: Adding leaves each round as it was
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And "3" is typed as the "Round 3"
      When "Add" is pressed
      Then "Round 3" says "3"

    Scenario: A second competition is added after the first
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "Add" is pressed
      And "Block B" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Open" has the competition "Block B"

    Scenario: The second competition added is the one said to be added
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "Add" is pressed
      And "Block B" is typed as the "Name"
      When "Add" is pressed
      Then the competition dialog says "Block B" was added

    Scenario: What was added is no longer said once the next name is typed
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "Add" is pressed
      When "Block B" is typed as the "Name"
      Then the competition dialog says nothing was added

  Rule: What is refused is said beside the field it is about

    Scenario: A missing name is refused beside the name
      Given "Add Competition" is pressed
      When "Add" is pressed
      Then "Name" is refused with "CompetitionName.Missing"

    Scenario: A name too long is refused beside the name
      Given "Add Competition" is pressed
      And a name of 255 characters is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "CompetitionName.TooLong"

    Scenario: A name another competition has is refused beside the name
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "Add Competition" is pressed
      And "BLOCK A" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "Tournament.CompetitionNameTaken"

    Scenario Outline: A best-of that is not a whole number of at least one is refused beside it
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "<best of>" is typed as the "Best of"
      When "Add" is pressed
      Then "Best of" is refused with "<code>"

      Examples:
        | best of | code            |
        | 0       | BestOf.TooSmall |
        | 1.5     | BestOf.NotWhole |

    Scenario: A round of a knockout the best of an even number is refused beside it
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And "2" is typed as the "Round 2"
      When "Add" is pressed
      Then "Round 2" is refused with "KnockoutDraw.EvenBestOf"

    Scenario: A refused competition is not added
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "0" is typed as the "Best of"
      When "Add" is pressed
      Then "Spring Open" has no competitions

    Scenario: A refused dialog stays open
      Given "Add Competition" is pressed
      When "Add" is pressed
      Then the competition dialog is open

    Scenario: A refused dialog keeps what was typed
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "0" is typed as the "Best of"
      When "Add" is pressed
      Then "Name" says "Block A"

    Scenario: A refused dialog says nothing was added
      Given "Add Competition" is pressed
      When "Add" is pressed
      Then the competition dialog says nothing was added

    Scenario: The reader is taken to the field refused
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "0" is typed as the "Best of"
      When "Add" is pressed
      Then "Best of" has the focus

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). What the reader typed is in
    the fields rather than among the dialog's words, and the name of the
    competition said to be added is the manager's, so neither is read for
    marks. The numbers of places offered are no words of any language.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the competitions of "Spring Open" are open
      When the way to add a competition is pressed
      Then every word in the competition dialog is in the test locale

    Scenario: The dialog for a knockout is in the reader's language
      Given a browser that asks for "en-XA"
      And the competitions of "Spring Open" are open
      And the way to add a competition is pressed
      When the kind of competition is chosen to be a knockout
      Then every word in the competition dialog is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the competitions of "Spring Open" are open
      And the way to add a competition is pressed
      When the competition dialog is sent as it is
      Then the competition dialog says what it refused
      And every word in the competition dialog is in the test locale

    Scenario: What the dialog says once a competition is added is in the reader's language
      Given a browser that asks for "en-XA"
      And the competitions of "Spring Open" are open
      And the way to add a competition is pressed
      And "Block A" is typed into the competition's name
      When the competition dialog is sent as it is
      Then every word in the competition dialog but the competition's name is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      When "Add Competition" is pressed
      Then the competition dialog is no wider than the window

    Scenario: The dialog for the largest knockout is no wider than the window
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When 128 places are chosen
      Then the competition dialog is no wider than the window

    Scenario Outline: Each button can be pressed with a thumb
      When "Add Competition" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Add    |
        | Cancel |

    Scenario Outline: Each kind can be chosen with a thumb
      When "Add Competition" is pressed
      Then the kind "<kind>" is at least 44 pixels tall

      Examples:
        | kind     |
        | Block    |
        | Knockout |
        | Swiss    |

    Scenario: The buttons are stacked, the one that adds first
      When "Add Competition" is pressed
      Then "Add" is above "Cancel"
