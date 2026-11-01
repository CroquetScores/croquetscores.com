@browser @postgres
Feature: A competition is added to a tournament, and changed, in a modal dialog

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

  A competition in use is changed in the same dialog, from Edit on the
  competition (`competitions-tab.feature`), so that adding and changing
  cannot come to ask different things. Opened from Edit, it is titled "Edit
  Competition", its button is Save, and it begins on what the competition is:
  its name and its shape. Its kind is not asked: a block is not made a
  knockout by changing it (`UpdateBlock.feature`, `UpdateKnockout.feature`,
  `UpdateSwiss.feature`), so the dialog does not offer what it could only
  refuse. Save keeps the change and closes the dialog, since a competition is
  changed one at a time, and the reader is back on the Edit they pressed.

  A knockout that has a game has players placed in its draw, and a change to
  its places would move them, so it is refused with
  `Tournament.KnockoutPlayerHasGames`. That is about the draw as a whole
  rather than any one field, so it is said above the fields.

  The kind is a block, a knockout or a Swiss, and the dialog begins on a
  block, which most competitions are. A block and a Swiss ask what each match
  is the best of, and begin on 1. A knockout asks how many places its draw has
  and what each round is the best of. The places are offered as the numbers a
  draw can have, 2, 4, 8, 16, 32, 64 and 128, since any other number could
  not halve round by round to a final, and the dialog begins on 8. A draw has
  as many rounds as it takes to halve its places to one, so the dialog asks
  what each is the best of, together under "Best ofs" and in the order they
  are played. The last three are named as a draw's rounds are spoken of,
  "Quarters", "Semis" and "Final", and any before them by their number,
  "Round 1" first. There are as many as the places chosen need: choosing
  other places takes rounds away from the start of the draw or adds them
  there, each added one beginning on 1, and the rounds kept keep what was
  typed in them, so that what was typed for the final is still the final's.
  Only what the kind chosen asks for is shown.

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

  Every kind asks how it is played and counted, after its shape: "Played with
  handicaps", "Allows drawn results" and "Counts toward world rankings"
  (`competitionRules.feature`). A new competition is not played with handicaps
  and does not allow drawn results, and counts towards the world rankings
  unless the reader says it does not, as adding one has it. Counting is asked
  only where it can be: in Association Croquet or Golf Croquet, for a
  competition neither played with handicaps nor allowing drawn results. A
  competition being changed begins as it is, and a test is asked the same in
  its own dialog (`test.feature`).

  Every kind asks the most hoops a game in it is played to, "Maximum hoops",
  after how it is played and counted (`maximumHoops.feature`). It begins on
  the usual for the sport, 26, or 13 in Golf Croquet, and a competition being
  changed begins on its own. It is a whole number of at least one, and
  emptied it says there is no most, which is different from the usual, so an
  empty field is sent as none and not left unsaid. A test is asked the same
  in its own dialog (`test.feature`).

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

  Rule: A block asks how many rounds it is played in

    A block is a round robin that may be played more than once, each pair of
    its players meeting in as many matches as there are rounds. The dialog asks
    for them under "Rounds", beginning on 1. A Swiss and a knockout do not.

    Scenario: A block asks for the rounds it is played in
      Given "Add Competition" is pressed
      When the kind "Block" is chosen
      Then the competition dialog asks for "Rounds"

    Scenario: A block begins on 1 round
      Given "Add Competition" is pressed
      When the kind "Block" is chosen
      Then "Rounds" says "1"

    Scenario Outline: A Swiss and a knockout do not ask for rounds
      Given "Add Competition" is pressed
      When the kind "<kind>" is chosen
      Then the competition dialog does not ask for "Rounds"

      Examples:
        | kind     |
        | Swiss    |
        | Knockout |

    Scenario: A block added is played in the rounds that were typed
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "3" is typed as the "Best of"
      And "2" is typed as the "Rounds"
      When "Add" is pressed
      Then the competition "Block A" of "Spring Open" is played in 2 rounds

    Scenario Outline: A number of rounds that is not a whole number of at least one is refused beside it
      Given "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      And "<rounds>" is typed as the "Rounds"
      When "Add" is pressed
      Then "Rounds" is refused with "<code>"

      Examples:
        | rounds | code            |
        | 0      | Rounds.TooSmall |
        | 1.5    | Rounds.NotWhole |

    Scenario: A block's rounds begin as the block's
      Given the block is to be played in 2 rounds
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Rounds" says "2"

    Scenario: A block's rounds changed are kept
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "3" is typed as the "Rounds"
      When "Save" is pressed
      Then the competition "Block A" of "Spring Open" is played in 3 rounds

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
        | Block | Final   |
        | Swiss | Places  |
        | Swiss | Final   |

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
        | round    |
        | Quarters |
        | Semis    |
        | Final    |

    Scenario: A knockout of 8 places asks for no numbered round
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the competition dialog does not ask for "Round 1"

    Scenario Outline: The rounds are asked for in the order they are played
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When <places> places are chosen
      Then round <round> is asked for as "<name>"

      Examples:
        | places | round | name     |
        | 2      | 1     | Final    |
        | 4      | 1     | Semis    |
        | 4      | 2     | Final    |
        | 32     | 1     | Round 1  |
        | 32     | 2     | Round 2  |
        | 32     | 3     | Quarters |
        | 32     | 4     | Semis    |
        | 32     | 5     | Final    |
        | 128    | 4     | Round 4  |
        | 128    | 5     | Quarters |

    Scenario: The rounds are asked for together under "Best ofs"
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then the rounds are asked for under "Best ofs"

    Scenario: Each round begins on the best of 1
      Given "Add Competition" is pressed
      When the kind "Knockout" is chosen
      Then "Final" says "1"

    Scenario: Choosing more places adds a round at the start
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When 16 places are chosen
      Then round 1 is asked for as "Round 1"

    Scenario: A round added begins on the best of 1
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      And "3" is typed as the "Quarters"
      When 16 places are chosen
      Then "Round 1" says "1"

    Scenario: Choosing fewer places takes a round away from the start
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      When 4 places are chosen
      Then the competition dialog does not ask for "Quarters"

    Scenario: The rounds kept keep what was typed in them
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      And "3" is typed as the "Semis"
      When 4 places are chosen
      Then "Semis" says "3"

    Scenario: What was typed for the final is still the final's
      Given "Add Competition" is pressed
      And the kind "Knockout" is chosen
      And "3" is typed as the "Final"
      When 16 places are chosen
      Then "Final" says "3"

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

  Rule: A competition asks how it is played and counted

    Scenario Outline: The dialog asks for each
      Given "Add Competition" is pressed
      Then the competition dialog asks for "<field>"

      Examples:
        | field                        |
        | Played with handicaps        |
        | Allows drawn results         |
        | Counts toward world rankings |

    Scenario: A new competition is not played with handicaps to begin with
      When "Add Competition" is pressed
      Then "Played with handicaps" is not ticked

    Scenario: A new competition does not allow drawn results to begin with
      When "Add Competition" is pressed
      Then "Allows drawn results" is not ticked

    Scenario: A new competition counts towards the world rankings to begin with
      When "Add Competition" is pressed
      Then "Counts toward world rankings" is ticked

    Scenario: Golf Croquet is asked about the world rankings
      Given the tournament "Spring Open" is for the sport "gc"
      And the competitions of "Spring Open" are open
      When "Add Competition" is pressed
      Then the competition dialog asks for "Counts toward world rankings"

    Scenario Outline: A sport without world rankings is not asked about them
      Given the tournament "Spring Open" is for the sport "<sport>"
      And the competitions of "Spring Open" are open
      When "Add Competition" is pressed
      Then the competition dialog does not ask for "Counts toward world rankings"

      Examples:
        | sport |
        | a6w   |
        | rc    |

    Scenario: A competition played with handicaps is not asked about the world rankings
      Given "Add Competition" is pressed
      When the reader ticks "Played with handicaps"
      Then the competition dialog does not ask for "Counts toward world rankings"

    Scenario: A competition allowing drawn results is not asked about the world rankings
      Given "Add Competition" is pressed
      When the reader ticks "Allows drawn results"
      Then the competition dialog does not ask for "Counts toward world rankings"

    Scenario: A competition added played with handicaps is kept so
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the reader ticks "Played with handicaps"
      When "Add" is pressed
      Then the competition "Main Event" of "Spring Open" is played under handicap

    Scenario: A competition added allowing drawn results is kept so
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the reader ticks "Allows drawn results"
      When "Add" is pressed
      Then the competition "Main Event" of "Spring Open" allows drawn results

    Scenario: A competition added counting towards the world rankings is kept so
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      When "Add" is pressed
      Then the competition "Main Event" of "Spring Open" counts towards the world rankings

    Scenario: A competition added not counting towards the world rankings is kept so
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the reader unticks "Counts toward world rankings"
      When "Add" is pressed
      Then the competition "Main Event" of "Spring Open" does not count towards the world rankings

    Scenario: A competition changed begins as it is played
      Given the competition is to be played under handicap
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Played with handicaps" is ticked

    Scenario: A competition said not to count is changed still not counting
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Counts toward world rankings" is not ticked

    # It did not count because of the handicaps, and not because anybody chose
    # that it should not, so once they are taken off it counts as one added would.
    Scenario: A competition no longer played with handicaps begins counting
      Given the competition is to be played under handicap
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      When the reader unticks "Played with handicaps"
      Then "Counts toward world rankings" is ticked

    Scenario: A competition no longer allowing drawn results begins counting
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      When the reader unticks "Allows drawn results"
      Then "Counts toward world rankings" is ticked

    Scenario: A competition changed to allow drawn results is kept so
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And the reader ticks "Allows drawn results"
      When "Save" is pressed
      Then the competition "Block A" of "Spring Open" allows drawn results

  Rule: A competition asks the most hoops a game in it is played to

    Scenario: The dialog asks for the most hoops
      When "Add Competition" is pressed
      Then the competition dialog asks for "Maximum hoops"

    Scenario: A new competition begins on 26 hoops
      When "Add Competition" is pressed
      Then "Maximum hoops" says "26"

    Scenario: A new competition in Golf Croquet begins on 13 hoops
      Given the tournament "Spring Open" is for the sport "gc"
      And the competitions of "Spring Open" are open
      When "Add Competition" is pressed
      Then "Maximum hoops" says "13"

    Scenario: A competition added with the most hoops typed is kept so
      Given "Add Competition" is pressed
      And "Short Block" is typed as the "Name"
      And "14" is typed as the "Maximum hoops"
      When "Add" is pressed
      Then the competition "Short Block" of "Spring Open" has a maximum of 14 hoops

    Scenario: A competition added with the most hoops emptied has none
      Given "Add Competition" is pressed
      And "Open Block" is typed as the "Name"
      And "" is typed as the "Maximum hoops"
      When "Add" is pressed
      Then the competition "Open Block" of "Spring Open" has no maximum number of hoops

    Scenario: A most that is not a whole number of at least one is refused beside it
      Given "Add Competition" is pressed
      And "Short Block" is typed as the "Name"
      And "0" is typed as the "Maximum hoops"
      When "Add" is pressed
      Then "Maximum hoops" is refused with "Tournament.MaximumHoopsInvalid"

    Scenario: A competition changed begins on its most hoops
      Given the competition is said to have a maximum of 14 hoops
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Maximum hoops" says "14"

    Scenario: A competition with no most begins with the field empty
      Given the competition is said to have no maximum number of hoops
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Maximum hoops" is empty

    Scenario: A competition changed to another most is kept so
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "18" is typed as the "Maximum hoops"
      When "Save" is pressed
      Then the competition "Block A" of "Spring Open" has a maximum of 18 hoops

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
      And "3" is typed as the "Final"
      When "Add" is pressed
      Then the second round of the knockout "Main Event" of "Spring Open" is the best of 3

    Scenario: A round left alone is the best of 1
      Given "Add Competition" is pressed
      And "Main Event" is typed as the "Name"
      And the kind "Knockout" is chosen
      And 4 places are chosen
      And "3" is typed as the "Final"
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
      And "3" is typed as the "Final"
      When "Add" is pressed
      Then "Final" says "3"

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
      And "2" is typed as the "Semis"
      When "Add" is pressed
      Then "Semis" is refused with "KnockoutDraw.EvenBestOf"

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

  Rule: Edit opens the dialog on the competition, to change it

    Scenario: Edit opens the competition dialog
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then the competition dialog is open

    Scenario: The dialog is titled for changing a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then the competition dialog is titled "Edit Competition"

    Scenario: The dialog changes with Save
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then the competition dialog's first button is "Save"

    Scenario: The name begins as the competition's
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Name" says "Block A"

    Scenario: A block's best-of begins as the block's
      Given the block is to be the best of 3
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then "Best of" says "3"

    Scenario: A knockout's places begin as the knockout's
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Main Event"
      Then the places chosen are 4

    Scenario: A knockout's rounds begin as the knockout's
      Given the knockout's second round is to be the best of 3
      And "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Main Event"
      Then "Final" says "3"

    Scenario Outline: The kind is not offered
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then the competition dialog does not ask for "<kind>"

      Examples:
        | kind     |
        | Block    |
        | Knockout |
        | Swiss    |

  Rule: Save keeps the change and closes the dialog

    Scenario: A name changed is kept
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "Block One" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Open" has the competition "Block One"

    Scenario: A block's best-of changed is kept
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "3" is typed as the "Best of"
      When "Save" is pressed
      Then each match of the competition "Block A" of "Spring Open" is the best of 3

    Scenario: A knockout's places changed are kept
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Main Event"
      And 8 places are chosen
      When "Save" is pressed
      Then the knockout "Main Event" of "Spring Open" has 8 places

    Scenario: A knockout's round changed is kept
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Main Event"
      And "3" is typed as the "Final"
      When "Save" is pressed
      Then the second round of the knockout "Main Event" of "Spring Open" is the best of 3

    Scenario: Save closes the dialog
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      When "Save" is pressed
      Then the competition dialog is not open

    Scenario: The list says the change once the dialog is closed
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "Block One" is typed as the "Name"
      When "Save" is pressed
      Then the competition "Block One" is listed

    Scenario: The reader is back on Edit once the change is kept
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      When "Save" is pressed
      Then "Edit" on the competition "Block A" has the focus

    Scenario: Cancelling keeps no change
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "Block One" is typed as the "Name"
      When "Cancel" is pressed
      Then "Spring Open" has the competition "Block A"

    Scenario: The reader is back on Edit once the dialog is cancelled
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      When "Cancel" is pressed
      Then "Edit" on the competition "Block A" has the focus

  Rule: What Save refuses is said, and nothing is kept

    Scenario: A name another competition has is refused beside the name
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block B"
      And "BLOCK A" is typed as the "Name"
      When "Save" is pressed
      Then "Name" is refused with "Tournament.CompetitionNameTaken"

    Scenario: A change refused leaves the dialog open
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "" is typed as the "Name"
      When "Save" is pressed
      Then the competition dialog is open

    Scenario: A change refused is not kept
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Block A"
      And "" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Open" has the competition "Block A"

    Scenario: A change to the places of a knockout with a game is refused above the fields
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Main Event" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Main Event" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Main Event" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Main Event" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Main Event" of "Spring Open"
      And the competitions of "Spring Open" are open
      And "Edit" is pressed on the competition "Main Event"
      And 8 places are chosen
      When "Save" is pressed
      Then the competition dialog says "Tournament.KnockoutPlayerHasGames" above the fields

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

  Rule: A help icon leads to the help for adding or changing a competition

    The help icon is in the dialog's title bar (`players.feature`), and opens
    the section of the help for what the dialog does in another tab.

    Scenario: The dialog to add a competition leads to the section on adding a competition
      When "Add Competition" is pressed
      Then the help icon leads to "/help/tournament-managers/standard-tournament/competitions#adding-a-competition"

    Scenario: The dialog to change a competition leads to the section on changing a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Edit" is pressed on the competition "Block A"
      Then the help icon leads to "/help/tournament-managers/standard-tournament/competitions#changing-a-competition"
