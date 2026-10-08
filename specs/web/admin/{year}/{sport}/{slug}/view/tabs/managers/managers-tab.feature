@browser @postgres
Feature: The managers tab of a tournament's page

  The Managers tab is where a manager sees who runs the tournament with them,
  makes somebody else a manager and takes one off (`view.feature`). A manager
  can do everything that can be done to a tournament (`addManager.feature`),
  so this is where a tournament is handed on, or shared.

  Somebody is made a manager by their email address, since that is what the
  manager asking knows of them, typed into the field above the list and sent
  by Add Manager. It is taken as an email address is wherever one is typed.
  An address with no confirmed account is refused beneath the field, by its
  code, whether nobody has registered it, it is waiting to be confirmed, or
  its account has been forgotten, so that the manager learns no more about
  somebody else's address than that it cannot be made a manager
  (`AddManager.feature`). A scorer made a manager stops being a scorer, and
  leaves the Scorers tab. Making a manager of somebody who already is one
  changes nothing. Once somebody is made a manager the field is emptied, and
  the reader is back in it, for the next.

  The managers are listed by name, in the order they were made, whoever
  created the tournament first (`ManagersOfTournament.feature`). The reader's
  own name is said to be theirs. A forgotten account is not listed, as no
  query answers one unless it is expressly asked to. So a forgotten account
  cannot be taken off from here either; it can never sign in again, so one
  left among the managers can do nothing.

  Each manager offers Remove, which takes them off the managers. Taking a
  manager off is not archiving them: nothing is kept of them, so they are not
  listed as removed, and they are made a manager again by their address if
  they are wanted back. Since what Remove does is gone rather than set aside,
  every Remove asks first, in a modal dialog (`STYLE.md`) that names who will
  be taken off and offers Remove and Cancel. Cancel takes nobody off. A
  tournament always has a manager (`removeManager.feature`), so the last one
  is not offered Remove.

  A reader can take themselves off, and the dialog then says what that will
  mean in words of its own: it takes away their own way back to the
  tournament, and nobody on the page can undo it for them. Once they are
  taken off, they are no longer a manager of the tournament and can no longer
  see its page, so they are taken back to their list of tournaments.

  The list is asked for again whenever somebody is made a manager or taken
  off, so that it says who manages the tournament now rather than what was
  pressed.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page and chooses the tab, which is what opening the managers of
  a tournament does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser", with the password "correct horse battery staple"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The managers are listed by name, in the order they were made

    Scenario: Whoever created the tournament is listed
      When the managers of "Spring Open" are opened
      Then the manager "Ollie Organiser" is listed

    Scenario: A manager made is listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" is listed

    Scenario: Whoever created the tournament is listed first
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then the first manager listed is "Ollie Organiser"

    Scenario: The reader's own name is said to be theirs
      When the managers of "Spring Open" are opened
      Then the manager "Ollie Organiser" is said to be the reader

    Scenario: Another manager is not said to be the reader
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" is not said to be the reader

    Scenario: A forgotten account that manages the tournament is not listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the account for "someone@example.com" has been forgotten
      When the managers of "Spring Open" are opened
      Then 1 manager is listed

  Rule: Somebody is made a manager by their email address

    Scenario: The tab asks for an email address
      When the managers of "Spring Open" are opened
      Then the tab asks for "Email address"

    Scenario: The email address is asked for above the list
      When the managers of "Spring Open" are opened
      Then "Email address" is above the managers

    Scenario: Add Manager makes the address's account a manager
      Given the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then the manager "Sam Someone" is listed

    Scenario: A manager added is kept
      Given the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      And "Add Manager" is pressed
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" is listed

    Scenario: An address typed in capitals names the same account
      Given the managers of "Spring Open" are open
      And "SOMEONE@EXAMPLE.COM" is typed as the "Email address"
      When "Add Manager" is pressed
      Then the manager "Sam Someone" is listed

    Scenario: Adding a manager empties the field
      Given the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" is empty

    Scenario: Adding a manager puts the reader back in the field
      Given the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" has the focus

    Scenario: A scorer made a manager is listed as a manager
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then the manager "Sam Someone" is listed

    Scenario: Making a manager of a manager lists them once
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then the manager "Sam Someone" is listed once

  Rule: An address that cannot be made a manager is refused beneath the field

    Scenario Outline: An address that is not one is refused for it
      Given the managers of "Spring Open" are open
      And "<address>" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" is refused with "<code>"

      Examples:
        | address | code                 |
        |         | EmailAddress.Missing |
        | someone | EmailAddress.NoAt    |

    Scenario: An address nobody has registered is refused
      Given the managers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" is refused with "AddManager.NoSuchAccount"

    Scenario: An address waiting to be confirmed is refused the same way
      Given "waiting@example.com" has an account, not confirmed
      And the managers of "Spring Open" are open
      And "waiting@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" is refused with "AddManager.NoSuchAccount"

    Scenario: A refused address stays typed
      Given the managers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then "Email address" says "nobody@example.com"

    Scenario: A refused address makes nobody a manager
      Given the managers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Manager" is pressed
      Then 1 manager is listed

    Scenario: The refusal is no longer said once the address is changed
      Given the managers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      And "Add Manager" is pressed
      When "someone@example.com" is typed as the "Email address"
      Then nothing is said beneath "Email address"

  Rule: Every Remove asks first

    Scenario: Each manager offers Remove where there is more than one
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" offers "Remove"

    Scenario: Removing a manager asks first
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Sam Someone"
      Then the modal dialog titled "Remove Manager" is open

    Scenario: Asking first names who will be taken off
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Sam Someone"
      Then the modal dialog names "Sam Someone"

    Scenario: Asking first offers Remove first
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Sam Someone"
      Then the modal dialog's first button is "Remove"

    Scenario: Asking first offers Cancel
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Sam Someone"
      Then the modal dialog's second button is "Cancel"

  Rule: Remove in the modal dialog takes the manager off

    Scenario: Removing a manager takes them off the list
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then the manager "Sam Someone" is not listed

    Scenario: A manager removed is kept removed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      And "Remove" is pressed in the modal dialog
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" is not listed

    Scenario: Removing a manager closes the modal dialog
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: Cancel in the modal dialog takes nobody off

    Scenario: Cancelling keeps the manager
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then the manager "Sam Someone" is listed

    Scenario: Cancelling keeps the manager when the tab is opened again
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      And "Cancel" is pressed in the modal dialog
      When the managers of "Spring Open" are opened
      Then the manager "Sam Someone" is listed

    Scenario: Cancelling closes the modal dialog
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: The last manager is not offered Remove

    Scenario: A tournament's only manager is not offered Remove
      When the managers of "Spring Open" are opened
      Then the manager "Ollie Organiser" does not offer "Remove"

    Scenario: The manager left once the others are removed is not offered Remove
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then the manager "Ollie Organiser" does not offer "Remove"

  Rule: A reader taking themselves off is told what it will mean, and then taken back to their list

    Scenario: Removing oneself asks in words of its own
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Ollie Organiser"
      Then the modal dialog says the words for "admin.managers.removeYourself.explanation"

    Scenario: Removing another manager does not say what removing oneself means
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When "Remove" is pressed on the manager "Sam Someone"
      Then the modal dialog does not say the words for "admin.managers.removeYourself.explanation"

    Scenario: Removing oneself takes the reader off the managers
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Ollie Organiser"
      When "Remove" is pressed in the modal dialog
      Then the account for "organiser@example.com" does not manage "Spring Open"

    Scenario: Removing oneself takes the reader back to their list
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Ollie Organiser"
      When "Remove" is pressed in the modal dialog
      Then the address is "/admin/"

  Rule: A refused Remove is said in the tab

    Remove can be refused after the dialog has been answered: the tournament
    archived by another manager while the tab was open, or the reader taken
    off the managers. The refusal is said above the list, by its code, rather
    than the list going on as though nothing had been asked. Where the reader
    is no longer a manager the list is refused too, with the same code, so
    the scenario is of the tournament archived, whose list is still answered.
    That a refused Remove takes nobody off is the command's to say
    (`RemoveManager.feature`). The accounts page says its
    refusals the same way (`accounts.feature`), since the two are drawn by
    the same code.

    Scenario: Removing once the tournament is archived says so
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      And "Remove" is pressed on the manager "Sam Someone"
      And "someone@example.com" has archived the tournament "Spring Open"
      When "Remove" is pressed in the modal dialog
      Then the tab says it was refused with "Tournament.Archived"

  Rule: A list the site fails to answer is said in the tab

    A failure answered with no code of its own, as an error of the site's is,
    is said as `Unknown`, rather than the tab showing neither a list nor that
    there is nobody in it, which would look like a tab still loading.

    Scenario: A list the site fails to answer says so
      Given the managers of "Spring Open" are answered with a server error
      When the managers of "Spring Open" are opened
      Then the tab says it was refused with "Unknown"

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A manager's name is theirs,
    and nobody's language. What the reader typed is in the field, and not
    among the tab's words.

    Scenario: The tab is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then every word in the tab but the managers' names is in the test locale

    Scenario: A refused address is in the reader's language
      Given a browser that asks for "en-XA"
      And the managers of "Spring Open" are open
      And "nobody@example.com" is typed into the tab's email address
      When the tab's email address is sent
      Then something is said beneath the tab's email address
      And every word in the tab but the managers' names is in the test locale

    Scenario: Asking before removing another manager is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When the way to remove the second manager is pressed
      Then every word in the modal dialog but the manager's name is in the test locale

    Scenario: Asking before removing oneself is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the managers of "Spring Open" are open
      When the way to remove the first manager is pressed
      Then every word in the modal dialog but the manager's name is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Manager can be pressed with a thumb
      When the managers of "Spring Open" are opened
      Then the button "Add Manager" is at least 44 pixels tall

    Scenario: Remove can be pressed with a thumb
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then "Remove" on the manager "Sam Someone" is at least 44 pixels tall

    Scenario: The tab is no wider than the window
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the managers of "Spring Open" are opened
      Then the page is no wider than the window
