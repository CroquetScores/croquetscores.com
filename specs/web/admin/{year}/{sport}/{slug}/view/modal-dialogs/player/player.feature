@browser @postgres
Feature: A player is added to a tournament, or changed, in a modal dialog

  A manager adds the players to a tournament from its Players tab, by
  pressing "Add Player", and changes one they have added by pressing their
  name (`players-tab.feature`). Either opens the player dialog over the page.
  It asks for what a player is (`TournamentPlayer.feature`): their name, what
  they represent, if anything, the flag they fly, if any, their handicap, if
  any, and, beneath that, the name the world rankings know them by, headed "World Ranking Player
  Name" (`WorldRankingName.feature`). Only association croquet and golf
  croquet have players the world rankings know by name (`Sport.feature`), so
  the world ranking name is asked for only in a tournament of one of them.
  American 6 Wicket is ranked across the world, but its players are known by
  their own names, so it is never asked for there, and a player's world ranking
  name is always their name, which it follows when it is corrected.

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

  The name is required; what the player represents, their flag and their
  world ranking name are not. Most players are known in the world rankings by
  their name, so while a player is being added their world ranking name
  follows their name as it is typed, and stops following once the reader
  types in it, since then it is a name of its own; emptied, it follows the
  name again. A world ranking name left empty is kept as the player's name.
  A player being changed keeps the world ranking name they have when their
  name is corrected, since the rankings still know them by it, so it follows
  nothing while a player is changed. In American 6 Wicket it is the name
  and nothing else, so it is corrected with it.
  In a tournament of association or golf croquet, the name and the world
  ranking name each offer, as they are typed, the players the world rankings
  know for the tournament's sport whose names the typing may be the start of
  (`WorldRankingPlayersMatching.feature`), so that a manager can take a
  player's name as the rankings spell it rather than typing it out. Choosing
  one fills the field as typing it would, and the world ranking name follows
  a name chosen as it follows one typed.

  Beside the world ranking name is a tick where the world rankings know it,
  and a question mark where they do not, which says why on hovering over it:
  the rankings have no player of that name, so the name may be misspelled, or
  the player may be new to them. Where the world ranking name is empty, the
  mark is for the name, since that is what will be kept. Before anything is
  typed there is no mark. It is only advice: a world ranking name the
  rankings do not know is kept as readily as one they do, since a player new
  to the rankings is not in them yet.

  The flags are offered by the name of the place each is the flag of, in the
  reader's language, in order of those names, with a choice of none first,
  since most players fly none.

  What is refused is said beneath the field it is about, by the refusal's
  code, and what was typed stays typed so that it can be put right: a name
  that could not be a person's, a name with neither a letter nor a digit in
  it (`TournamentPlayer.feature`), a handicap written any other way than a sign, up to two digits and a
  fraction of one digit (`TournamentPlayer.feature`), a world ranking name that
  could not be one (`WorldRankingName.feature`), and a name another player in the tournament
  already has, however it is capitalised (`addPlayer.feature`). A refusal about
  no one field is said above the fields. Nothing refused is kept, and the
  dialog stays open.

  A player is never a bye (`TournamentPlayer.feature`): a knockout's byes are
  offered wherever its players are entered (`competition-players-tab.feature`),
  and a manager who types one in as a player has not yet found them there. So
  a name that is a bye, or a bye numbered, is refused, and rather than a line beneath the
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
      And "Handicap" is empty

    Scenario: The dialog to add a player adds with Add
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog's first button is "Add"

    Scenario Outline: The dialog asks for what a player is
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog asks for "<field>"

      Examples:
        | field                     |
        | Name                      |
        | Representing              |
        | Flag                      |
        | Handicap                  |
        | World Ranking Player Name |

    Scenario: The handicap is asked for beneath the flag
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the field after "Flag" in the player dialog is "Handicap"

    Scenario: The world ranking name is asked for beneath the handicap
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the field after "Handicap" in the player dialog is "World Ranking Player Name"

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

    Scenario: The world ranking name is the player's
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then "World Ranking Player Name" says "Samuel Someone"

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

    Scenario: The player added has the handicap they were added with
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "4" is typed as the "Handicap"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the handicap "4"

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

  Rule: Only a tournament of association or golf croquet asks for a world ranking name

    Scenario Outline: A tournament of association or golf croquet asks for a world ranking name
      Given the tournament "Spring Open" is for the sport "<sport>"
      And the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog asks for "World Ranking Player Name"

      Examples:
        | sport |
        | ac    |
        | gc    |

    Scenario Outline: A tournament of another sport asks for none
      Given the tournament "Spring Open" is for the sport "<sport>"
      And the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog does not ask for "World Ranking Player Name"

      Examples:
        | sport |
        | rc    |

    Scenario: A tournament of American 6 Wicket asks for none
      Given the tournament "Spring Open" is for the sport "a6w"
      And the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the player dialog does not ask for "World Ranking Player Name"

    Scenario: A player added in American 6 Wicket has their name as their world ranking name
      Given the tournament "Spring Open" is for the sport "a6w"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

    Scenario: A player renamed in American 6 Wicket has their new name as their world ranking name
      Given the tournament "Spring Open" is for the sport "a6w"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" of "Spring Open" has the world ranking name "Samantha Someone"

    Scenario: A player added in a tournament of another sport has their name as their world ranking name
      Given the tournament "Spring Open" is for the sport "rc"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

  Rule: While a player is added, their world ranking name follows their name until it is typed in

    Scenario: The world ranking name begins empty
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then "World Ranking Player Name" is empty

    Scenario: The world ranking name follows the name as it is typed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Sam Someone" is typed as the "Name"
      Then "World Ranking Player Name" says "Sam Someone"

    Scenario: A world ranking name typed in no longer follows the name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Sam Someones" is typed as the "Name"
      Then "World Ranking Player Name" says "Samuel Someone"

    Scenario: A world ranking name emptied follows the name again
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "" is typed as the "World Ranking Player Name"
      When "Samantha Someone" is typed as the "Name"
      Then "World Ranking Player Name" says "Samantha Someone"

    Scenario: The player added has the world ranking name typed
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Samuel Someone"

    Scenario: The player added with the world ranking name left to follow has their name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

    Scenario: Adding empties the world ranking name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Add" is pressed
      Then "World Ranking Player Name" is empty

    Scenario: The next player's world ranking name follows their name
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      And "Add" is pressed
      When "Alex Another" is typed as the "Name"
      Then "World Ranking Player Name" says "Alex Another"

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

    Scenario: A renamed player keeps their world ranking name
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" of "Spring Open" has the world ranking name "Samuel Someone"

    Scenario: The world ranking name does not follow the name while a player is changed
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      When "Samantha Someone" is typed as the "Name"
      Then "World Ranking Player Name" says "Samuel Someone"

    Scenario: A player with no world ranking name saved is given their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      When "Save" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

    Scenario: A world ranking name changed is kept
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Samuel Someone"

    Scenario: A world ranking name emptied is kept as the player's name
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

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

  Rule: The flags are named in the reader's language, in the order the countries are offered in

    The groups and their order are `countryOrder.feature`'s, as they are for
    the countries a tournament is played in. A line is drawn between the groups.

    Scenario: No flag is the first choice
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the first flag offered is none

    Scenario: A flag is offered by the name of the place it is the flag of
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "New Zealand" is offered

    Scenario: The flags most played in are offered first
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "New Zealand" is offered before the flag "Austria"

    Scenario: The flags of the other countries played in since 2025 come before the rest
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "Germany" is offered before the flag "Argentina"

    Scenario: The flags of a group are in order of their names
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the flag "Austria" is offered before the flag "Germany"

    Scenario: A line is drawn between the groups of flags
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the list of flags has 2 lines drawn in it

    Scenario: A line is drawn after the United States
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then a line is drawn in the list of flags after "United States"

    Scenario: A line is drawn after Wales
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then a line is drawn in the list of flags after "Wales"

    Scenario: The flags are in order of their names in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And the page of "Spring Open" is open
      When "Añadir jugador" is pressed
      Then the flag "Alemania" is offered before the flag "Argentina"

  Rule: A name that is a bye is explained in a dialog of its own

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

    Scenario: A handicap written any other way is refused beside it
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "four" is typed as the "Handicap"
      When "Add" is pressed
      Then "Handicap" is refused with "TournamentPlayer.HandicapMalformed"

    Scenario: A world ranking name that could not be one is refused beside it
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Sa" is typed as the "World Ranking Player Name"
      When "Add" is pressed
      Then "World Ranking Player Name" is refused with "WorldRankingName.TooShort"

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

  Rule: The name and the world ranking name offer the world ranking players as they are typed

    Scenario: Typing the start of a first name in the name offers the player
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Kei" is typed as the "Name"
      Then "Name" offers "Keith Aiton"

    Scenario: Typing the start of a surname in the name offers the player
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Ait" is typed as the "Name"
      Then "Name" offers "Keith Aiton"

    Scenario: Typing in the world ranking name offers the player
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Kei" is typed as the "World Ranking Player Name"
      Then "World Ranking Player Name" offers "Keith Aiton"

    Scenario: A player being changed is offered the world ranking players
      Given the association croquet players include "Keith Aiton"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      When "Kei" is typed as the "Name"
      Then "Name" offers "Keith Aiton"

    Scenario: A tournament of golf croquet offers golf croquet's players
      Given the tournament "Spring Open" is for the sport "gc"
      And the golf croquet players include "Bill Arliss"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Bil" is typed as the "Name"
      Then "Name" offers "Bill Arliss"

    Scenario: A tournament of golf croquet does not offer association croquet's players
      Given the tournament "Spring Open" is for the sport "gc"
      And the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Kei" is typed as the "Name"
      Then "Name" does not offer "Keith Aiton"

  Rule: What the player represents offers what players have been added representing as it is typed

    Whatever the sport: what players represent is not the world rankings'
    to know, so unlike the name it is offered in every tournament, from every
    tournament (`RepresentingMatching.feature`). Choosing one fills the field
    as typing it would.

    Scenario: Typing the start of a word in what the player represents offers it
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Cant" is typed as the "Representing"
      Then "Representing" offers "Canterbury Croquet Club"

    Scenario: A tournament of another sport is offered it too
      Given the tournament "Spring Open" is for the sport "rc"
      And a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Cant" is typed as the "Representing"
      Then "Representing" offers "Canterbury Croquet Club"

    Scenario: A player being changed is offered it
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      When "Cant" is typed as the "Representing"
      Then "Representing" offers "Canterbury Croquet Club"

    Scenario: Nothing is offered that the typing does not begin
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Auck" is typed as the "Representing"
      Then "Representing" does not offer "Canterbury Croquet Club"

  Rule: What the player represents shows the rest of what has been offered, and the tab key accepts it

    The first of what is offered that begins with what has been typed, in any
    case, is shown after the typing in a lighter colour, as the rest of it. The
    tab key makes it what is typed, as the offer is spelled. A name that only
    has a word beginning with the typing is offered but not shown, since
    typing more would not make it.

    Scenario: The rest of what is offered is shown after what is typed
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Canterbury Cr" is typed as the "Representing"
      Then "Representing" is completed with "oquet Club"

    Scenario: The rest is shown whatever the case of what is typed
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "canterbury cr" is typed as the "Representing"
      Then "Representing" is completed with "oquet Club"

    Scenario: The tab key makes the rest what is typed
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Canterbury Cr" is typed as the "Representing"
      And "Representing" is completed with "oquet Club"
      When the tab key is pressed in "Representing"
      Then "Representing" says "Canterbury Croquet Club"

    Scenario: What is accepted is spelled as it was offered
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "canterbury cr" is typed as the "Representing"
      And "Representing" is completed with "oquet Club"
      When the tab key is pressed in "Representing"
      Then "Representing" says "Canterbury Croquet Club"

    Scenario: Nothing is left to show once it is accepted
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Canterbury Cr" is typed as the "Representing"
      And "Representing" is completed with "oquet Club"
      When the tab key is pressed in "Representing"
      Then "Representing" is completed with nothing

    Scenario: A word that only begins with what is typed is not shown
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Croq" is typed as the "Representing"
      Then "Representing" offers "Canterbury Croquet Club"
      And "Representing" is completed with nothing

    Scenario: The tab key leaves what is typed as it is where nothing is shown
      Given a player of "Autumn Open" represents "Canterbury Croquet Club"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Croq" is typed as the "Representing"
      When the tab key is pressed in "Representing"
      Then "Representing" says "Croq"

  Rule: Beside the world ranking name, a tick or a question mark says whether the world rankings know it

    Scenario: Nothing is marked before anything is typed
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the world ranking name is not marked

    Scenario: A world ranking name the world rankings know is ticked
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Keith Aiton" is typed as the "Name"
      Then the world ranking name is ticked

    Scenario: A world ranking name the world rankings do not know is questioned
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Sam Someone" is typed as the "Name"
      Then the world ranking name is questioned

    Scenario: The world ranking name typed in is the one marked
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Keith Aiton" is typed as the "Name"
      When "K Aiton" is typed as the "World Ranking Player Name"
      Then the world ranking name is questioned

    Scenario: A world ranking name capitalised otherwise is questioned
      Given the association croquet players include "Keith Aiton"
      And the page of "Spring Open" is open
      And "Add Player" is pressed
      When "keith aiton" is typed as the "Name"
      Then the world ranking name is questioned

    Scenario: An empty world ranking name is marked for the name
      Given the association croquet players include "Keith Aiton"
      And the player is to have the world ranking name "K Aiton"
      And "organiser@example.com" has added the player "Keith Aiton" to "Spring Open"
      And the page of "Spring Open" is open
      And the name of the player "Keith Aiton" is pressed
      When "" is typed as the "World Ranking Player Name"
      Then the world ranking name is ticked

    Scenario: A player whose world ranking name the world rankings know is ticked when opened
      Given the association croquet players include "Keith Aiton"
      And the player is to have the world ranking name "Keith Aiton"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the world ranking name is ticked

    Scenario: The question mark says why
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      When "Sam Someone" is typed as the "Name"
      Then the question mark says why on hovering over it

    Scenario: The question mark says why in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      And the way to add a player is pressed
      When "Sam Someone" is typed into the player's name
      Then what the question mark says is in the test locale

    Scenario: A world ranking name the world rankings do not know is kept
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

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

  Rule: A world ranking officer who does not manage the tournament changes the world ranking name alone

    A world ranking officer may change a player's world ranking name and
    nothing else (`changeWorldRankingName.feature`), so where it does not
    manage the tournament the dialog shows everything the player is, but only
    the world ranking name can be changed. Save keeps it.

    Scenario Outline: Everything but the world ranking name is shown and cannot be changed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then "<field>" cannot be changed

      Examples:
        | field        |
        | Name         |
        | Representing |
        | Flag         |

    Scenario: The world ranking name can be changed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then "World Ranking Player Name" can be changed

    Scenario: The world ranking name changed is kept
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Samuel Someone"

    Scenario: Saving closes the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of "Spring Open" is open
      And the name of the player "Sam Someone" is pressed
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then no modal dialog is open

  Rule: A help icon leads to the help for adding or changing a player, and for byes

    The help icon is in the dialog's title bar (`players.feature`), and opens
    the section of the help for what the dialog does in another tab.

    Scenario: The dialog to add a player leads to the section on adding a player
      Given the page of "Spring Open" is open
      When "Add Player" is pressed
      Then the help icon leads to "/help/tournament-managers/standard-tournament/players#add-a-player"

    Scenario: The dialog to change a player leads to the section on correcting a player
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      When the name of the player "Sam Someone" is pressed
      Then the help icon leads to "/help/tournament-managers/standard-tournament/players#correcting-a-player"

    Scenario: The dialog about byes leads to the section on byes in a knockout
      Given the page of "Spring Open" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the help icon leads to "/help/tournament-managers/standard-tournament/entering-players-in-a-competition#byes-in-a-knockout"
