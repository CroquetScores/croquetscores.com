@browser @postgres
Feature: The scorers tab of a tournament's page

  The Scorers tab is where a manager sees who enters the tournament's scores,
  makes somebody a scorer and takes one off (`view.feature`). A scorer enters
  scores and does nothing else to the tournament (`addScorer.feature`). It is
  the Managers tab for scorers (`managers-tab.feature`), and differs from it
  only where a scorer differs from a manager.

  Somebody is made a scorer by their email address, since that is what the
  manager asking knows of them, typed into the field above the list and sent
  by Add Scorer. It is taken as an email address is wherever one is typed. An
  address with no confirmed account is refused beneath the field, by its
  code, whether nobody has registered it, it is waiting to be confirmed, or
  its account has been forgotten, so that the manager learns no more about
  somebody else's address than that it cannot be made a scorer
  (`AddScorer.feature`). A manager is not made a scorer, since a manager can
  already do everything a scorer can, so a manager's address is refused
  beneath the field too, the reader's own among them. Making a scorer of
  somebody who already is one changes nothing. Once somebody is made a scorer
  the field is emptied, and the reader is back in it, for the next.

  The scorers are listed by name, in the order they were made
  (`ScorersOfTournament.feature`). A tournament need not have any, and one
  with none says so. A forgotten account is not listed, as no query answers
  one unless it is expressly asked to. So a forgotten account cannot be taken
  off from here either; it can never sign in again, so one left among the
  scorers can do nothing.

  Each scorer offers Remove, which takes them off the scorers. Taking a scorer
  off is not archiving them: nothing is kept of them, so they are not listed
  as removed, and they are made a scorer again by their address if they are
  wanted back. Since what Remove does is gone rather than set aside, every
  Remove asks first, in a modal dialog (`STYLE.md`) that names who will be
  taken off and offers Remove and Cancel. Cancel takes nobody off. Unlike a
  manager, every scorer is offered Remove, the last among them, since a
  tournament needs no scorer to be run. The reader is a manager rather than a
  scorer, so they are never among the scorers to take themselves off.

  The list is asked for again whenever somebody is made a scorer or taken off,
  so that it says who scores the tournament now rather than what was pressed.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page and chooses the tab, which is what opening the scorers of
  a tournament does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser", with the password "correct horse battery staple"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "another@example.com" has an account, confirmed, called "Alex Another"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The scorers are listed by name, in the order they were made

    Scenario: A scorer made is listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then the scorer "Sam Someone" is listed

    Scenario: The first scorer made is listed first
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has made "another@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then the first scorer listed is "Sam Someone"

    Scenario: A manager is not listed among the scorers
      When the scorers of "Spring Open" are opened
      Then the scorer "Ollie Organiser" is not listed

    Scenario: A tournament with no scorers says so
      When the scorers of "Spring Open" are opened
      Then the tab says there are no scorers

    Scenario: A forgotten account that scores the tournament is not listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the account for "someone@example.com" has been forgotten
      When the scorers of "Spring Open" are opened
      Then the tab says there are no scorers

  Rule: Somebody is made a scorer by their email address

    Scenario: The tab asks for an email address
      When the scorers of "Spring Open" are opened
      Then the tab asks for "Email address"

    Scenario: The email address is asked for above the list
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then "Email address" is above the scorers

    Scenario: Add Scorer makes the address's account a scorer
      Given the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the scorer "Sam Someone" is listed

    Scenario: A scorer added is kept
      Given the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      And "Add Scorer" is pressed
      When the scorers of "Spring Open" are opened
      Then the scorer "Sam Someone" is listed

    Scenario: An address typed in capitals names the same account
      Given the scorers of "Spring Open" are open
      And "SOMEONE@EXAMPLE.COM" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the scorer "Sam Someone" is listed

    Scenario: Adding a scorer no longer says there are none
      Given the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the tab does not say there are no scorers

    Scenario: Adding a scorer empties the field
      Given the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is empty

    Scenario: Adding a scorer puts the reader back in the field
      Given the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" has the focus

    Scenario: Making a scorer of a scorer lists them once
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the scorer "Sam Someone" is listed once

  Rule: An address that cannot be made a scorer is refused beneath the field

    Scenario Outline: An address that is not one is refused for it
      Given the scorers of "Spring Open" are open
      And "<address>" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is refused with "<code>"

      Examples:
        | address | code                 |
        |         | EmailAddress.Missing |
        | someone | EmailAddress.NoAt    |

    Scenario: An address nobody has registered is refused
      Given the scorers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is refused with "AddScorer.NoSuchAccount"

    Scenario: An address waiting to be confirmed is refused the same way
      Given "waiting@example.com" has an account, not confirmed
      And the scorers of "Spring Open" are open
      And "waiting@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is refused with "AddScorer.NoSuchAccount"

    Scenario: A manager's address is refused
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is refused with "Tournament.AlreadyAManager"

    Scenario: The reader's own address is refused as a manager's
      Given the scorers of "Spring Open" are open
      And "organiser@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" is refused with "Tournament.AlreadyAManager"

    Scenario: A refused address stays typed
      Given the scorers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then "Email address" says "nobody@example.com"

    Scenario: A refused address makes nobody a scorer
      Given the scorers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the tab says there are no scorers

    Scenario: The refusal is no longer said once the address is changed
      Given the scorers of "Spring Open" are open
      And "nobody@example.com" is typed as the "Email address"
      And "Add Scorer" is pressed
      When "someone@example.com" is typed as the "Email address"
      Then nothing is said beneath "Email address"

  Rule: Every Remove asks first

    Scenario: The only scorer is offered Remove
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then the scorer "Sam Someone" offers "Remove"

    Scenario: Remove is drawn as a trash can
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then Remove for the scorer "Sam Someone" is a trash can

    Scenario: Removing a scorer asks first
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When "Remove" is pressed on the scorer "Sam Someone"
      Then the modal dialog titled "Remove Scorer" is open

    Scenario: Asking first names who will be taken off
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When "Remove" is pressed on the scorer "Sam Someone"
      Then the modal dialog names "Sam Someone"

    Scenario: Asking first offers Remove first
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When "Remove" is pressed on the scorer "Sam Someone"
      Then the modal dialog's first button is "Remove"

    Scenario: Asking first offers Cancel
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When "Remove" is pressed on the scorer "Sam Someone"
      Then the modal dialog's second button is "Cancel"

  Rule: Remove in the modal dialog takes the scorer off

    Scenario: Removing a scorer takes them off the list
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has made "another@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then the scorer "Sam Someone" is not listed

    Scenario: A scorer removed is kept removed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      And "Remove" is pressed in the modal dialog
      When the scorers of "Spring Open" are opened
      Then the scorer "Sam Someone" is not listed

    Scenario: Removing the last scorer says there are none
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then the tab says there are no scorers

    Scenario: Removing a scorer closes the modal dialog
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      When "Remove" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: Cancel in the modal dialog takes nobody off

    Scenario: Cancelling keeps the scorer
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then the scorer "Sam Someone" is listed

    Scenario: Cancelling keeps the scorer when the tab is opened again
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      And "Cancel" is pressed in the modal dialog
      When the scorers of "Spring Open" are opened
      Then the scorer "Sam Someone" is listed

    Scenario: Cancelling closes the modal dialog
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: A refused Remove is said in the tab

    Remove can be refused after the dialog has been answered: the tournament
    archived by another manager while the tab was open, or the reader taken
    off the managers. The refusal is said above the list, by its code, rather
    than the list going on as though nothing had been asked. Where the reader
    is no longer a manager the list is refused too, with the same code, so
    the scenario is of the tournament archived, whose list is still answered.
    That a refused Remove takes nobody off is the command's to say
    (`RemoveScorer.feature`). The accounts page says its
    refusals the same way (`accounts.feature`), since the two are drawn by
    the same code.

    Scenario: Removing once the tournament is archived says so
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When "Remove" is pressed in the modal dialog
      Then the tab says it was refused with "Tournament.Archived"

    Scenario: A refused Remove is still said when the list then fails
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      And "Remove" is pressed on the scorer "Sam Someone"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the scorers of "Spring Open" are answered with a server error
      When "Remove" is pressed in the modal dialog
      Then the tab says it was refused with "Tournament.Archived"

  Rule: A list the site fails to answer is said in the tab

    A failure answered with no code of its own, as an error of the site's is,
    is said as `Unknown`, rather than the tab showing neither a list nor that
    there is nobody in it, which would look like a tab still loading.

    Scenario: A list the site fails to answer says so
      Given the scorers of "Spring Open" are answered with a server error
      When the scorers of "Spring Open" are opened
      Then the tab says it was refused with "Unknown"

    Scenario: A list that failed is no longer said to have once it is answered
      Given the scorers of "Spring Open" are answered with a server error
      And the scorers of "Spring Open" are open
      And "someone@example.com" is typed as the "Email address"
      When "Add Scorer" is pressed
      Then the tab says nothing was refused

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A scorer's name is theirs,
    and nobody's language. What the reader typed is in the field, and not
    among the tab's words.

    Scenario: The tab is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then every word in the tab but the scorers' names is in the test locale

    Scenario: A tournament with no scorers says so in the reader's language
      Given a browser that asks for "en-XA"
      When the scorers of "Spring Open" are opened
      Then every word in the tab but the scorers' names is in the test locale

    Scenario: A refused address is in the reader's language
      Given a browser that asks for "en-XA"
      And the scorers of "Spring Open" are open
      And "nobody@example.com" is typed into the tab's email address
      When the tab's email address is sent
      Then something is said beneath the tab's email address
      And every word in the tab but the scorers' names is in the test locale

    Scenario: Asking before removing a scorer is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When the way to remove the first scorer is pressed
      Then every word in the modal dialog but the scorer's name is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Scorer can be pressed with a thumb
      When the scorers of "Spring Open" are opened
      Then the button "Add Scorer" is at least 44 pixels tall

    Scenario: Remove can be pressed with a thumb
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then "Remove" on the scorer "Sam Someone" is at least 44 pixels tall

    Scenario: The tab is no wider than the window
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the scorers of "Spring Open" are opened
      Then the page is no wider than the window

  Rule: A help icon leads to the help for scorers

    The help icon is in the dialog's title bar (`players.feature`), and opens
    the section of the help for what the dialog does in another tab.

    Scenario: The question asked before removing a scorer leads to the section on scorers
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the scorers of "Spring Open" are open
      When "Remove" is pressed on the scorer "Sam Someone"
      Then the help icon leads to "/help/tournament-managers/standard-tournament/managers-and-scorers#scorers"
