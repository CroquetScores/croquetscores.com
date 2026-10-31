@browser @postgres
Feature: Many players are added to a tournament at once, in a modal dialog

  A manager who has a list of players, from a spreadsheet or an entry form,
  need not add them one at a time. Beside "Add Player" on the Players tab is
  "Add Players" (`players-tab.feature`), which opens a modal dialog
  (`player.feature` says what a modal dialog is) with one box that takes
  several lines of text. The box has no caption and no explanation drawn
  beside it, since the title says what the dialog is for, and so more of the
  dialog is the box; it is still named "Players" for a screen reader. Unlike
  the dialogs for one player, which are the width of a form, this one is as
  wide as the window less 1rem each side, so that a line of a list is read
  without scrolling sideways.

  The first line names the fields, separated by commas, and every line after it
  is a player, with a value for each field in the same order. "Name" must be
  one of the fields. The others that may be: "Representing", "Flag",
  "Handicap" and "WorldRankingPlayerName". The order of the fields does not
  matter, and a field named is a column every player has, whether or not they
  have a value in it. Every line must therefore have as many values as the
  first line has fields, and a player who has none for a field leaves it
  empty. Every value is trimmed, and a line with nothing on it is ignored.

  Each value is held to what the Add Player dialog holds it to
  (`TournamentPlayer.feature`, `WorldRankingName.feature`): a name that could
  be a person's, a flag the site knows, which is written as the name of the place it is the
  flag of, in the reader's language, as the player dialog offers it, such as
  "New Zealand", and a handicap written as a sign, up to two digits and a
  fraction of one digit. A player given no world ranking name is known by
  their name, as they are when added one at a time.

  The whole list is checked before any of it is kept, and a list with
  anything wrong in it adds nobody. The alternative, keeping the players up to
  the first line that is wrong, leaves the manager with half a list and no
  easy way to say which half, and pasting the list again would then be refused
  for the names already added. What is wrong is said beneath the box, by the
  refusal's code and the number of the line it is on, counting the first line
  of fields as line 1, and what was typed stays typed so that it can be put
  right. Every line that is wrong is said, not only the first, so that a
  list need not be sent once for each fault in it.

  A name that another player in the tournament has, or that an earlier line of
  the list has, is refused as the tournament refuses it
  (`Tournament.PlayerNameTaken`), however it is capitalised. A name that is a
  bye is refused, and said in the box like any other fault: the dialog about
  byes is for a single player, where the reader has nowhere else to look.

  Once the list is kept the dialog closes and the Players tab lists the new
  players, in the order they were written. Unlike Add Player, which stays open
  for the next player, there is no next: the list was the next.

  This runs scripts, as the rest of the admin does, and is read on a phone's
  width.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Add Players opens the dialog to add many players

    Scenario: Add Players is beside Add Player
      Given the page of "Spring Open" is open
      Then the button after "Add Player" is "Add Players"

    Scenario: Add Players opens the players dialog
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is open

    Scenario: The players dialog is titled for what it does
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is titled "Add Players"

    Scenario: The players dialog draws no caption
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog draws no caption

    Scenario: The players dialog draws no explanation
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog draws no explanation

    Scenario: The players dialog is as wide as the window less 1rem each side
      Given a viewport 1200 pixels wide
      And the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is 1168 pixels wide

    Scenario: The players dialog is 1rem from the window's edge
      Given a viewport 1200 pixels wide
      And the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is 16 pixels from the left of the window

    Scenario: The players are written in a box of several lines
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then "Players" takes several lines

    Scenario: The players dialog begins empty
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then "Players" is empty

    Scenario: The players dialog adds with Add
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog's first button is "Add"

    Scenario: The players dialog is cancelled with Cancel
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog's second button is "Cancel"

    Scenario: The reader is put in the box when the dialog opens
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then "Players" has the focus

    Scenario: The dialog is announced as a modal dialog
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is announced as a modal dialog

    Scenario: Opening the dialog leaves the address as it was
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: Cancel closes the dialog
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      When "Cancel" is pressed
      Then the players dialog is not open

    Scenario: Cancelling adds nobody
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        """
      When "Cancel" is pressed
      Then "Spring Open" has no players

    Scenario: The reader is back on Add Players once the dialog is cancelled
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      When "Cancel" is pressed
      Then "Add Players" has the focus

  Rule: The players are the lines after the first, and the first names their fields

    Scenario: A player is added for each line
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        Alex Another
        """
      When "Add" is pressed
      Then "Spring Open" has the player "Sam Someone"
      And "Spring Open" has the player "Alex Another"

    Scenario: The players are in the order they were written
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        Alex Another
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" comes before the player "Alex Another"

    Scenario: The dialog closes once the players are kept
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        """
      When "Add" is pressed
      Then the players dialog is not open

    Scenario: The Players tab lists the players once they are kept
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        """
      When "Add" is pressed
      Then the Players tab lists the player "Sam Someone"

    Scenario: The fields may be in any order
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Representing, Name
        Canterbury Croquet Club, Sam Someone
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"

    Scenario: What a player is is taken from the field of the same name
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing, Flag, Handicap, WorldRankingPlayerName
        Sam Someone, Canterbury Croquet Club, New Zealand, 4, Samuel Someone
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"
      And the player "Sam Someone" of "Spring Open" flies the flag "nz"
      And the player "Sam Someone" of "Spring Open" has the handicap "4"
      And the player "Sam Someone" of "Spring Open" has the world ranking name "Samuel Someone"

    Scenario: A field that is empty for a player is left empty
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing, Flag, Handicap
        Sam Someone, Canterbury Croquet Club, New Zealand, 4
        Alex Another, , ,
        """
      When "Add" is pressed
      Then the player "Alex Another" of "Spring Open" represents nothing
      And the player "Alex Another" of "Spring Open" flies no flag
      And the player "Alex Another" of "Spring Open" has no handicap

    Scenario: Every value is trimmed
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
          Sam Someone  ,   Canterbury Croquet Club
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"

    Scenario: The names of the fields are trimmed
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
          Name  ,   Representing
        Sam Someone, Canterbury Croquet Club
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"

    Scenario: A line with nothing on it is ignored
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        
        Alex Another
        """
      When "Add" is pressed
      Then "Spring Open" has the player "Alex Another"

  Rule: A help icon in the dialog's title bar leads to the help for adding many players

    The help is a section of the Players page of the help, with a bookmark of
    its own so that the address shows that section. It is opened in another
    tab, so that what was typed stays where it is.

    Scenario: The title bar has a help icon
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog has a help icon called "Help"

    Scenario: The help icon leads to the section on adding many players
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the help icon leads to "/help/tournament-managers/standard-tournament/players#adding-multiple-players"

    Scenario: The help icon opens another tab
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the help icon opens another tab

    Scenario: The help icon is in the title bar
      Given a viewport 1200 pixels wide
      And the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the help icon is level with the dialog's title

    Scenario: The section the help icon leads to is on the page
      When the page at "/help/tournament-managers/standard-tournament/players" is opened
      Then the page has the section "Adding multiple players" with the bookmark "adding-multiple-players"

    Scenario: The section is not hidden behind the pinned bar when it is led to
      When the page at "/help/tournament-managers/standard-tournament/players#adding-multiple-players" is opened
      Then the section "Adding multiple players" is below the pinned bar

    Scenario: The reader is still put in the box when the dialog opens
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then "Players" has the focus

  Rule: Cells pasted from a spreadsheet, separated by tabs, are cut as well as commas

    A spreadsheet puts a tab between the cells it copies, not a comma, so the
    list is cut at the tabs where its first line has one.

    Scenario: A list pasted with tabs is added
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name	Representing
        Sam Someone	Australia
        """
      When "Add" is pressed
      Then "Spring Open" has the player "Sam Someone"

    Scenario: A list pasted with tabs keeps each value with its field
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name	Representing
        Sam Someone	Australia
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Australia"

  Rule: A value with a comma in it is written in double quotes

    A spreadsheet writes a value that has a comma in it in double quotes, and
    a double quote inside one twice, so a list pasted from one holds names such
    as "Smith, John". A quote that does not begin a value is just a quote.

    Scenario: A value in double quotes keeps its comma
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
        Sam Someone, "Canterbury, New Zealand"
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury, New Zealand"

    Scenario: A double quote inside a value in double quotes is written twice
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
        Sam Someone, "The ""Mallets"""
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "The \"Mallets\""

  Rule: A list holds at most 500 players

    Scenario: A list of more than 500 players is refused beside the box
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And a list of 501 players is typed as the "Players"
      When "Add" is pressed
      Then "Players" is refused with "AddPlayers.TooManyPlayers"

  Rule: A player with no world ranking name is known by their name

    Scenario Outline: A player given none is known by their name
      Given the tournament "Spring Open" is for the sport "<sport>"
      And the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

      Examples:
        | sport |
        | ac    |
        | gc    |
        | a6w   |

    Scenario: A player whose world ranking name is empty is known by their name
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, WorldRankingPlayerName
        Sam Someone, Samuel Someone
        Alex Another,
        """
      When "Add" is pressed
      Then the player "Alex Another" of "Spring Open" has the world ranking name "Alex Another"

    Scenario: A tournament of another sport knows its players by their names too
      Given the tournament "Spring Open" is for the sport "rc"
      And the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the world ranking name "Sam Someone"

  Rule: The first line may name only the fields there are, and must name Name

    Scenario Outline: A first line that is wrong is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        <first line>
        Sam Someone
        """
      When "Add" is pressed
      Then "Players" is refused with "<code>" on line 1

      Examples:
        | first line   | code                          |
        | Representing | AddPlayers.NameMissing     |
        | Name, Team   | AddPlayers.FieldNotAllowed |
        | Name, Name   | AddPlayers.FieldRepeated   |

    Scenario: A list with nothing in it is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      When "Add" is pressed
      Then "Players" is refused with "AddPlayers.FieldsMissing"

    Scenario: A list with fields and no players is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        """
      When "Add" is pressed
      Then "Players" is refused with "AddPlayers.PlayersMissing"

    Scenario: The names of the fields are not case sensitive
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        name, REPRESENTING
        Sam Someone, Canterbury Croquet Club
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" represents "Canterbury Croquet Club"

  Rule: Every line has a name and as many values as the first line has fields

    Scenario: A line with a value too few is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
        Sam Someone
        """
      When "Add" is pressed
      Then "Players" is refused with "AddPlayers.ValuesMismatched" on line 2

    Scenario: A line with a value too many is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
        Sam Someone, Canterbury Croquet Club, nz
        """
      When "Add" is pressed
      Then "Players" is refused with "AddPlayers.ValuesMismatched" on line 2

    Scenario: A line with no name is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Representing
        , Canterbury Croquet Club
        """
      When "Add" is pressed
      Then "Players" is refused with "PersonName.Missing" on line 2

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it, on its line
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Flag, Handicap, WorldRankingPlayerName
        Alex Another, , ,
        <name>, <flag>, <handicap>, <ranking name>
        """
      When "Add" is pressed
      Then "Players" is refused with "<code>" on line 3

      Examples:
        | name        | flag | handicap | ranking name | code                             |
        | Sa          |      |          |              | PersonName.TooShort              |
        | Bye         |      |          |              | TournamentPlayer.NamedBye        |
        | — ! —       |      |          |              | TournamentPlayer.NoLetterOrDigit |
        | Sam Someone | Narnia |        |              | TournamentPlayer.NoSuchFlag      |
        | Sam Someone |      | four     |              | TournamentPlayer.HandicapMalformed |
        | Sam Someone |      |          | Sa           | WorldRankingName.TooShort        |

    Scenario: A handicap is held to what Add Player holds it to
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name, Handicap
        Sam Someone, -1.5
        """
      When "Add" is pressed
      Then the player "Sam Someone" of "Spring Open" has the handicap "-1.5"

    Scenario: A line that breaks no rule is not refused beside one that does
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        Sa
        Alex Another
        """
      When "Add" is pressed
      Then "Players" is not refused on line 2

    Scenario: A name another player has is refused as the tournament refuses it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        SAM SOMEONE
        """
      When "Add" is pressed
      Then "Players" is refused with "Tournament.PlayerNameTaken" on line 2

    Scenario: A name an earlier line has is refused as the tournament refuses it
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        sam someone
        """
      When "Add" is pressed
      Then "Players" is refused with "Tournament.PlayerNameTaken" on line 3

  Rule: A list with anything wrong in it adds nobody, and says everything that is wrong

    Scenario: A list with one line wrong adds none of its players
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sam Someone
        Sa
        Alex Another
        """
      When "Add" is pressed
      Then "Spring Open" has no players

    Scenario: Each line that is wrong is refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sa
        Alex Another
        Bye
        """
      When "Add" is pressed
      Then "Players" is refused with "PersonName.TooShort" on line 2
      And "Players" is refused with "TournamentPlayer.NamedBye" on line 4

    Scenario: A field that is not one and is named twice is refused once
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name,Colour,Colour
        Sam Someone,Red,Red
        """
      When "Add" is pressed
      Then "Players" is refused once with "AddPlayers.FieldNotAllowed"

    Scenario: A refused dialog stays open
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sa
        """
      When "Add" is pressed
      Then the players dialog is open

    Scenario: A refused dialog keeps what was typed
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sa
        """
      When "Add" is pressed
      Then "Players" says the lines it was given

    Scenario: The reader is taken to the box that was refused
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Sa
        """
      When "Add" is pressed
      Then "Players" has the focus

    Scenario: A name that is a bye is said in the box, not in the dialog about byes
      Given the page of "Spring Open" is open
      And "Add Players" is pressed
      And these lines are typed as the "Players":
        """
        Name
        Bye
        """
      When "Add" is pressed
      Then the dialog about byes is not open

  Rule: Only a manager of the tournament is offered it

    Scenario: A reader who does not manage the tournament is not offered Add Players
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is open
      Then "Add Players" is not offered

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). What the reader typed is in
    the box rather than among the dialog's words, so it is not read for marks.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      When the way to add players is pressed
      Then every word in the players dialog is in the test locale

    Scenario: What the dialog refused is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Open" is open
      And the way to add players is pressed
      When the players dialog is sent as it is
      Then the players dialog says what it refused
      And every word in the players dialog is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the players dialog is no wider than the window

    Scenario Outline: Each button can be pressed with a thumb
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Add    |
        | Cancel |

    Scenario: The buttons are stacked, the one that adds first
      Given the page of "Spring Open" is open
      When "Add Players" is pressed
      Then "Add" is above "Cancel"
