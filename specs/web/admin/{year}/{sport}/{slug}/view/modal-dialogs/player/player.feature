@browser @postgres
Feature: A player is added to a tournament, or changed, in a modal dialog

  A manager adds the players to a tournament from its Players tab, by
  pressing "Add Player", and changes one they have added by pressing their
  name (`players-tab.feature`). Either opens the player dialog over the page.
  It asks for what a player is (`TournamentPlayer.feature`): their name, what
  they represent, if anything, and the flag they fly, if any.

  It is a modal dialog, which is not the dialog a form that is a page's
  purpose is drawn in (`STYLE.md`). That stands on a page of its own, at an
  address of its own, and leaving it is going anywhere else. A modal dialog
  sits over the page it was opened from, which stays where it was beneath it:
  nothing outside the dialog can be pressed or reached by the keyboard while
  it is open, and it has no address, so opening it leaves the address as it
  was. Since the page beneath cannot be reached, the dialog has to offer its
  own way out, so it has a Cancel button, and Escape does what Cancel does.
  Cancelling keeps nothing that was not already kept, and the reader is back
  where they pressed to open it.

  The dialog is on its Player tab, which is what this feature is about. What a
  player is in each competition they play in is to be on the dialog's other
  tabs, which are to be specified with the competitions and are not written
  yet (`TODO.md`), so until they are the dialog has only this one.

  Adding and changing are the one dialog, so that the two cannot come to ask
  different things. Opened by "Add Player", it is titled "Add Player", begins
  empty and its button is Add. Opened on a player, it is titled "Edit Player",
  begins as the player is and its button is Save.

  Players are added a field of them at a time, so Add does not close the
  dialog. It adds the player, tells the reader in words that they were added,
  and empties the fields for the next, with the reader back in the name. A
  screen reader is told as well, since nothing else on the dialog changes
  where the reader is. Save changes one player, so it closes the dialog once
  the change is kept.

  The name is required; what the player represents and their flag are not.
  The flags are offered by the name of the place each is the flag of, in the
  reader's language, in order of those names, with a choice of none first,
  since most players fly none.

  What is refused is said beneath the field it is about, by the refusal's
  code, and what was typed stays typed so that it can be put right: a name
  that could not be a person's, a name with neither a letter nor a digit in
  it (`TournamentPlayer.feature`), and a name another player in the tournament
  already has, however it is capitalised (`addPlayer.feature`). A refusal about
  no one field is said above the fields. Nothing refused is kept, and the
  dialog stays open.

  A player is never a bye (`TournamentPlayer.feature`): a knockout's byes are
  offered wherever its players are entered (`competition-players-tab.feature`),
  and a manager who types one in as a player has not yet found them there. So
  a name whose first word is "bye" is refused, and rather than a line beneath the
  name, the reader is told why in a dialog of its own over the player dialog:
  that byes need no adding, since a knockout offers them when its players are
  entered. It has one button, OK, and Escape does what OK does. Either closes
  it and leaves the player dialog as it was, with what was typed still typed
  and the reader back in the name, to put it right or cancel.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Add Player opens the dialog to add a player

    Scenario: Add Player opens the player dialog
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog is open

    Scenario: The dialog to add a player is titled for what it does
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog is titled "Add Player"

    Scenario: The dialog to add a player begins empty
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then "Name" is empty
      And "Representing" is empty
      And no flag is chosen

    Scenario: The dialog to add a player adds with Add
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog's first button is "Add"

    Scenario Outline: The dialog asks for what a player is
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog asks for "<field>"

      Examples:
        | field        |
        | Name         |
        | Representing |
        | Flag         |

  Rule: A player opened from the page opens the dialog to change them

    Scenario: Opening a player opens the player dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the player dialog is open

    Scenario: The dialog to change a player is titled for what it does
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the player dialog is titled "Edit Player"

    Scenario: The dialog to change a player saves with Save
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the player dialog's first button is "Save"

    Scenario: The name is the player's
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then "Name" says "Sam Someone"

    Scenario: What the player represents is theirs
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then "Representing" says "Canterbury Croquet Club"

    Scenario: The flag is the player's
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the flag chosen is "New Zealand"

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: The dialog is announced as a modal dialog
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog is named "Add Player"

    Scenario: The reader is put in the name when the dialog opens
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then "Name" has the focus

    Scenario: Nothing outside the dialog can be pressed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When the site's name in the header is pressed
      Then the player dialog is open
      And the address is "/admin/2026/ac/spring-open"

    Scenario: The keyboard does not leave the dialog going forward
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When Tab is pressed until the focus comes round again
      Then the focus never left the player dialog

    Scenario: The keyboard does not leave the dialog going back
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When Shift and Tab are pressed until the focus comes round again
      Then the focus never left the player dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Cancel" is pressed
      Then the player dialog is not open

    Scenario: Escape closes the dialog
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When Escape is pressed
      Then the player dialog is not open

    Scenario: Cancelling adds nobody
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Cancel" is pressed
      Then "Spring Open" has no players

    Scenario: Cancelling changes nothing
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Cancel" is pressed
      Then "Spring Open" has the player "Sam Someone"

    Scenario: Cancelling keeps the players already added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Add" is pressed
      When "Cancel" is pressed
      Then "Spring Open" has the player "Sam Someone"

    Scenario: The reader is back on Add Player once the dialog is cancelled
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Cancel" is pressed
      Then "Add Player" has the focus

    Scenario: The reader is back on the player once the dialog is cancelled
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      When "Cancel" is pressed
      Then the name of the player "Sam Someone" has the focus

  Rule: Add adds the player and empties the dialog for the next

    Scenario: The player added is one of the tournament's players
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Open" has the player "Sam Someone"

    Scenario: The player added represents what they were added representing
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Canterbury Croquet Club" is typed as the "Representing"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"

    Scenario: The player added flies the flag they were added flying
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And the flag "New Zealand" is chosen
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" flies the flag "nz"

    Scenario: A player added with nothing but a name represents nothing
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents nothing

    Scenario: A player added with nothing but a name flies no flag
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" flies no flag

    Scenario: Adding leaves the dialog open
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player dialog is open

    Scenario: Adding says who was added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player dialog says "Sam Someone" was added

    Scenario: Who was added is told to a screen reader
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then what the player dialog says about who was added is announced

    Scenario: Adding empties the name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is empty

    Scenario: Adding empties what the player represents
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Canterbury Croquet Club" is typed as the "Representing"
      When "Add" is pressed
      Then "Representing" is empty

    Scenario: Adding empties the flag
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And the flag "New Zealand" is chosen
      When "Add" is pressed
      Then no flag is chosen

    Scenario: Adding puts the reader back in the name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then "Name" has the focus

    Scenario: A second player is added after the first
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Add" is pressed
      And "Alex Another" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Open" has the player "Alex Another"

    Scenario: The second player added is the one said to be added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Add" is pressed
      And "Alex Another" is typed as the "Name"
      When "Add" is pressed
      Then the player dialog says "Alex Another" was added

    Scenario: Who was added is no longer said once the next name is typed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Add" is pressed
      When "Alex Another" is typed as the "Name"
      Then the player dialog says nobody was added

  Rule: Save keeps the change and closes the dialog

    Scenario: A renamed player is kept by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Open" has the player "Samantha Someone"

    Scenario: A renamed player is no longer kept by their old name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Open" does not have the player "Sam Someone"

    Scenario: What is left alone is kept as it was
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" of "Spring Open" represents "Canterbury Croquet Club"

    Scenario: A flag taken away is kept taken away
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And none is chosen for the flag
      When "Save" is pressed
      Then the player "Sam Someone" of "Spring Open" flies no flag

    Scenario: Saving closes the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player dialog is not open

    Scenario: Saving leaves the address as it was
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the address is "/admin/2026/ac/spring-open"

  Rule: The flags are named in the reader's language, in order of their names

    Scenario: No flag is the first choice
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the first flag offered is none

    Scenario: A flag is offered by the name of the place it is the flag of
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "New Zealand" is offered

    Scenario: The flags are in order of their names
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "Argentina" is offered before the flag "Germany"

    Scenario: The flags are in order of their names in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And the page of "Spring Open" is open
      When "Añadir jugador" is pressed
      Then the flag "Alemania" is offered before the flag "Argentina"

  Rule: A name whose first word is "bye" is explained in a dialog of its own

    Scenario: Adding a player named as a bye opens the dialog about byes
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the dialog about byes is open

    Scenario: The dialog about byes says why
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the dialog about byes says the words for "admin.player.byes"

    Scenario: The dialog about byes is announced as a modal dialog
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the dialog about byes is announced as a modal dialog

    Scenario: The dialog about byes offers OK alone
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the dialog about byes offers "OK" alone

    Scenario: The reader is put on OK when the dialog about byes opens
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then "OK" has the focus

    Scenario: A player named as a bye is not added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Open" has no players

    Scenario: OK closes the dialog about byes
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When "OK" is pressed
      Then the dialog about byes is not open

    Scenario: Escape closes the dialog about byes
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When Escape is pressed
      Then the dialog about byes is not open

    Scenario: Closing the dialog about byes leaves the player dialog open
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When "OK" is pressed
      Then the player dialog is open

    Scenario: Escape on the dialog about byes leaves the player dialog open
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When Escape is pressed
      Then the player dialog is open

    Scenario: Closing the dialog about byes keeps what was typed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When "OK" is pressed
      Then "Name" says "Bye"

    Scenario: Closing the dialog about byes puts the reader back in the name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      And "Add" is pressed
      When "OK" is pressed
      Then "Name" has the focus

    Scenario: Renaming a player as a bye opens the dialog about byes
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Bye 2" is typed as the "Name"
      When "Save" is pressed
      Then the dialog about byes is open

    Scenario: A player renamed as a bye keeps their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Bye 2" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Open" has the player "Sam Someone"

    Scenario: The dialog about byes is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      And the way to add a player is pressed
      And "Bye" is typed into the player's name
      When the player dialog is sent as it is
      Then every word in the dialog about byes is in the test locale

  Rule: What is refused is said beside the field it is about

    Scenario Outline: A name that could not be a person's is refused beside the name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "<name>" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "<code>"

      Examples:
        | name  | code                             |
        |       | PersonName.Missing               |
        | Sa    | PersonName.TooShort              |
        | — ! — | TournamentPlayer.NoLetterOrDigit |

    Scenario: A name another player has is refused beside the name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "SAM SOMEONE" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "Tournament.PlayerNameTaken"

    Scenario: A name another player has is refused when a player is renamed to it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Alex Another" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Save" is pressed
      Then "Name" is refused with "Tournament.PlayerNameTaken"

    Scenario: A refused player is not added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Open" has no players

    Scenario: A refused dialog stays open
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then the player dialog is open

    Scenario: A refused dialog keeps what was typed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      And "Canterbury Croquet Club" is typed as the "Representing"
      When "Add" is pressed
      Then "Representing" says "Canterbury Croquet Club"

    Scenario: A refused dialog says nobody was added
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then the player dialog says nobody was added

    Scenario: The reader is taken to the field refused
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then "Name" has the focus

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). What the reader typed is in
    the fields rather than among the dialog's words, and the name of the
    player said to be added is theirs, so neither is read for marks.

    Scenario: The dialog to add a player is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      When the way to add a player is pressed
      Then every word in the player dialog is in the test locale

    Scenario: The dialog to change a player is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then every word in the player dialog is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      And the way to add a player is pressed
      When the player dialog is sent as it is
      Then the player dialog says what it refused
      And every word in the player dialog is in the test locale

    Scenario: What the dialog says once a player is added is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      And the way to add a player is pressed
      And "Sam Someone" is typed into the player's name
      When the player dialog is sent as it is
      Then every word in the player dialog but the player's name is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog is no wider than the window

    Scenario Outline: Each button can be pressed with a thumb
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Add    |
        | Cancel |

    Scenario: The buttons are stacked, the one that adds first
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then "Add" is above "Cancel"
