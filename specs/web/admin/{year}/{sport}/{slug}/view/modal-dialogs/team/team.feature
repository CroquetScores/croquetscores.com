@browser @postgres
Feature: A team is added to a tournament, or changed, in a modal dialog

  A manager adds the teams to a tournament played by teams from its Teams
  tab, by pressing "Add Team", and changes one they have added by pressing its
  Edit (`teams-tab.feature`); its name leads to its page instead. Either opens
  the team dialog over the page. It asks for what a team is (`Team.feature`): its name, its short
  name, and the flag it flies, if any.

  It is a modal dialog, as the player dialog is (`player.feature`): it sits
  over the page it was opened from, nothing outside it can be pressed or
  reached by the keyboard while it is open, it has no address, and it has a
  Cancel button, which Escape does as well. Cancelling keeps nothing that was
  not already kept, and the reader is back where they pressed to open it.

  Adding and changing are the one dialog, so that the two cannot come to ask
  different things. Opened by "Add Team", it is titled "Add Team", begins
  empty and its button is Add. Opened on a team, it is titled "Edit Team",
  begins as the team is and its button is Save.

  Teams are added a few at a time, so Add does not close the dialog, as it
  does not for a player. It adds the team, tells the reader in words that it
  was added, and empties the fields for the next, with the reader back in the
  name. A screen reader is told as well. Save changes one team, so it closes
  the dialog once the change is kept, and the reader is back where they
  pressed to open it.

  The name and the short name are required, and the flag is not. The short
  name says beneath it what it is for — what the team's tests are called by,
  as "AUS v ENG" — since a reader asked for two names would otherwise wonder
  why. The flags are offered as a player's are: by the name of the place each
  is the flag of, in the reader's language, in the order the countries are
  offered in (`countryOrder.feature`), with a choice of none first.

  What is refused is said beneath the field it is about, by the refusal's
  code, and what was typed stays typed so that it can be put right: a name or
  a short name missing or too long, a short name with neither a letter nor a
  digit, which could make no address for the team, a short name longer than
  the name, which is said beneath the short name since that is the one most
  likely wrong, and
  a name or a short name another of the
  tournament's teams already has, however it is capitalised
  (`addTeam.feature`). A refusal about no one field is said above the fields.
  Nothing refused is kept, and the dialog stays open.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

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

  Rule: Add Team opens the dialog to add a team

    Scenario: Add Team opens the team dialog
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog is open

    Scenario: The dialog to add a team is titled for what it does
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog is titled "Add Team"

    Scenario: The dialog to add a team begins empty
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then "Name" is empty
      And "Short Name" is empty
      And no flag is chosen

    Scenario: The dialog to add a team adds with Add
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog's first button is "Add"

    Scenario Outline: The dialog asks for what a team is
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog asks for "<field>"

      Examples:
        | field      |
        | Name       |
        | Short Name |
        | Flag       |

    Scenario: The short name says what it is for
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then "Short Name" is described by the words for "admin.team.shortName.explanation"

  Rule: Edit on a team opens the dialog to change it

    Scenario: The dialog to change a team is titled for what it does
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then the team dialog is titled "Edit Team"

    Scenario: The dialog to change a team saves with Save
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then the team dialog's first button is "Save"

    Scenario: The name is the team's
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then "Name" says "Australia"

    Scenario: The short name is the team's
      Given the team is to be known for short as "Oz"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then "Short Name" says "Oz"

    Scenario: The flag is the team's
      Given the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then the flag chosen is "Australia"

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the address is "/admin/2026/ac/spring-tests"

    Scenario: The dialog is announced as a modal dialog
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog is named "Add Team"

    Scenario: The reader is put in the name when the dialog opens
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then "Name" has the focus

    Scenario: The keyboard does not leave the dialog going forward
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      When Tab is pressed until the focus comes round again
      Then the focus never left the team dialog

    Scenario: The keyboard does not leave the dialog going back
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      When Shift and Tab are pressed until the focus comes round again
      Then the focus never left the team dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      When "Cancel" is pressed
      Then the team dialog is not open

    Scenario: Escape closes the dialog
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      When Escape is pressed
      Then the team dialog is not open

    Scenario: Cancelling adds nothing
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Cancel" is pressed
      Then "Spring Tests" has no teams

    Scenario: Cancelling changes nothing
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And "Australia A" is typed as the "Name"
      When "Cancel" is pressed
      Then "Spring Tests" has the team "Australia"

    Scenario: Cancelling keeps the teams already added
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      And "Add" is pressed
      When "Cancel" is pressed
      Then "Spring Tests" has the team "Australia"

    Scenario: The reader is back on Add Team once the dialog is cancelled
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      When "Cancel" is pressed
      Then "Add Team" has the focus

    Scenario: The reader is back on the team once the dialog is cancelled
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      When "Cancel" is pressed
      Then "Edit" on the team "Australia" has the focus

  Rule: Add adds the team and empties the dialog for the next

    Scenario: The team added is one of the tournament's teams
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then "Spring Tests" has the team "Australia"

    Scenario: The team added has the short name it was added with
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "Oz" is typed as the "Short Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" is known for short as "Oz"

    Scenario: The team added flies the flag it was added flying
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      And the flag "Australia" is chosen
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" flies the flag "au"

    Scenario: A team added with no flag flies none
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" flies no flag

    Scenario: Adding leaves the dialog open
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then the team dialog is open

    Scenario: Adding says which team was added
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then the team dialog says "Australia" was added

    Scenario: Which team was added is told to a screen reader
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then what the team dialog says about which team was added is announced

    Scenario Outline: Adding empties the dialog
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then "<field>" is empty

      Examples:
        | field      |
        | Name       |
        | Short Name |

    Scenario: Adding empties the flag
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      And the flag "Australia" is chosen
      When "Add" is pressed
      Then no flag is chosen

    Scenario: Adding puts the reader back in the name
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then "Name" has the focus

    Scenario: Which team was added is no longer said once the next name is typed
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      And "Add" is pressed
      When "England" is typed as the "Name"
      Then the team dialog says no team was added

  Rule: Save keeps the change and closes the dialog

    Scenario: A renamed team is kept by its new name
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And "Australia A" is typed as the "Name"
      When "Save" is pressed
      Then "Spring Tests" has the team "Australia A"

    Scenario: A new short name is kept
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And "Oz" is typed as the "Short Name"
      When "Save" is pressed
      Then the team "Australia" of "Spring Tests" is known for short as "Oz"

    Scenario: A flag taken away is kept taken away
      Given the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And none is chosen for the flag
      When "Save" is pressed
      Then the team "Australia" of "Spring Tests" flies no flag

    Scenario: Saving closes the dialog
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And "Australia A" is typed as the "Name"
      When "Save" is pressed
      Then the team dialog is not open

    Scenario: The reader is back on the team once it is saved
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "Australia"
      And "Australia A" is typed as the "Name"
      When "Save" is pressed
      Then "Edit" on the team "Australia A" has the focus

  Rule: The flags are named in the reader's language, in the order the countries are offered in

    Scenario: No flag is the first choice
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the first flag offered is none

    Scenario: The flags most played in are offered first
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the flag "New Zealand" is offered before the flag "Austria"

    Scenario: The flags of a group are in order of their names
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the flag "Austria" is offered before the flag "Germany"

    Scenario: A line is drawn after the United States and after Wales
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then a line is drawn in the list of flags after "United States"
      And a line is drawn in the list of flags after "Wales"

  Rule: What is refused is said beside the field it is about

    Scenario Outline: A name or short name that breaks its rules is refused beside it
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "<name>" is typed as the "Name"
      And "<short name>" is typed as the "Short Name"
      When "Add" is pressed
      Then "<field>" is refused with "<code>"

      Examples:
        | name      | short name  | field      | code                          |
        |           | AUS         | Name       | TeamName.Missing              |
        | Australia |             | Short Name | TeamShortName.Missing         |
        | Australia | Australasia | Short Name | TeamShortName.TooLong         |
        | Australia | ***         | Short Name | TeamShortName.NoLetterOrDigit |

    Scenario: A short name longer than the name is refused beside the short name
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Oz" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then "Short Name" is refused with "Team.ShortNameLongerThanName"

    Scenario: A short name all in capitals is accepted
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" is known for short as "AUS"

    Scenario: A name another team has is refused beside the name
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "AUSTRALIA" is typed as the "Name"
      And "OZ" is typed as the "Short Name"
      When "Add" is pressed
      Then "Name" is refused with "Tournament.TeamNameTaken"

    Scenario: A short name another team has is refused beside the short name
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Austria" is typed as the "Name"
      And "aus" is typed as the "Short Name"
      When "Add" is pressed
      Then "Short Name" is refused with "Tournament.TeamShortNameTaken"

    Scenario: A short name another team has is refused when a team is changed to it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the page of "Spring Tests" is open
      And "Edit" is pressed on the team "England"
      And "AUS" is typed as the "Short Name"
      When "Save" is pressed
      Then "Short Name" is refused with "Tournament.TeamShortNameTaken"

    Scenario: A refused team is not added
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      When "Add" is pressed
      Then "Spring Tests" has no teams

    Scenario: A refused dialog stays open
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      When "Add" is pressed
      Then the team dialog is open

    Scenario: A refused dialog keeps what was typed
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      When "Add" is pressed
      Then "Name" says "Australia"

    Scenario: The reader is taken to the field refused
      Given the page of "Spring Tests" is open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      When "Add" is pressed
      Then "Short Name" has the focus

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). What the reader typed is in
    the fields rather than among the dialog's words, and the name of the team
    said to be added is theirs, so neither is read for marks.

    Scenario: The dialog to add a team is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Tests" is open
      When the way to add a team is pressed
      Then every word in the team dialog is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of "Spring Tests" is open
      And the way to add a team is pressed
      When the team dialog is sent as it is
      Then the team dialog says what it refused
      And every word in the team dialog is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the team dialog is no wider than the window

    Scenario Outline: Each button can be pressed with a thumb
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Add    |
        | Cancel |

    Scenario: The buttons are stacked, the one that adds first
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then "Add" is above "Cancel"

  Rule: A help icon leads to the help for adding or changing a team

    The help icon is in the dialog's title bar (`players.feature`), and opens
    the section of the help for what the dialog does in another tab.

    Scenario: The dialog to add a team leads to the section on adding a team
      Given the page of "Spring Tests" is open
      When "Add Team" is pressed
      Then the help icon leads to "/help/tournament-managers/teams-tournament/teams#adding-a-team"

    Scenario: The dialog to change a team leads to the section on correcting a team
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the page of "Spring Tests" is open
      When "Edit" is pressed on the team "Australia"
      Then the help icon leads to "/help/tournament-managers/teams-tournament/teams#correcting-a-team"
