@browser @postgres
Feature: An administrator deletes a tournament in a modal dialog

  Somebody learning the site sometimes makes a test tournament on the real
  website, where it does not belong. The administrator presses Delete, the
  trash can beside the tournament's name (`view.feature`), and a dialog opens
  over the page with the email its managers are to be sent, written out for
  them to change (`DeleteTournament.feature`).

  It is a modal dialog, as the test dialog is (`test.feature`): it sits over
  the page, nothing outside it can be pressed, it has no address, and it has a
  Cancel button, which Escape does as well. Cancelling tells nobody and
  changes nothing.

  The email begins from the words the administrator has used each time, which
  name the tournament, the website's try website to practise on, and the
  administrator, and are in a box the administrator may change before it goes,
  since what is said differs with why the tournament is being removed. Nothing
  but the box's words is sent.

  There are two ways to send it, as buttons in this order: Send Email Only,
  which tells the managers and leaves the tournament where it is, and Send
  Email and Archive, which tells them and archives the tournament too, so that
  it leaves every list and can be restored. Cancel is last, where every dialog
  has it. Sending without archiving leaves the reader on the page, which says
  the managers were emailed; archiving takes them to the list of tournaments,
  since the page of an archived tournament is refused.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "admin@example.com" has an account, confirmed, with the password "an administrator's horse battery"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And the reader has signed in as "admin@example.com" with the password "an administrator's horse battery"

  Rule: Delete opens the dialog

    Scenario: Delete opens the dialog
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the modal dialog titled "Delete this tournament?" is open

    Scenario: The first button sends the email only
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the modal dialog's first button is "Send Email Only"

    Scenario: The second button sends the email and archives
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the modal dialog's second button is "Send Email and Archive"

  Rule: The email begins from the administrator's usual words

    Scenario: It names the try website to practise on
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the message to the managers says "Please use https://try.croquetscores.com/ for testing and learning how to use Croquet Scores."

    Scenario: It names the tournament
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the message to the managers says "I have archived the Spring Open tournament."

    Scenario: It is signed by the administrator
      Given the page of "Spring Open" is open
      When Delete beside the page's heading is pressed
      Then the message to the managers says "Regards,"

  Rule: Cancel tells nobody

    Scenario: Cancel closes the dialog
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: Cancel emails nobody
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Cancel" is pressed in the modal dialog
      Then no email is sent to the managers

  Rule: Send Email Only tells the managers and leaves the tournament

    Scenario: The managers are emailed
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email Only" is pressed in the modal dialog
      Then the email to the managers is queued for "organiser@example.com"

    Scenario: The email says what the box said
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      And the message to the managers is changed to "Please learn on the try website."
      When "Send Email Only" is pressed in the modal dialog
      Then the email to the managers queued for "organiser@example.com" says "Please learn on the try website."

    Scenario: The dialog closes
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email Only" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: The page says the managers were emailed
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email Only" is pressed in the modal dialog
      Then the page says its managers have been emailed

    Scenario: The tournament is not archived
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email Only" is pressed in the modal dialog
      Then the tournament "Spring Open" is not kept archived

  Rule: Send Email and Archive tells the managers and archives the tournament

    Scenario: The managers are emailed
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email and Archive" is pressed in the modal dialog
      Then the email to the managers is queued for "organiser@example.com"

    Scenario: The tournament is archived
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email and Archive" is pressed in the modal dialog
      Then the tournament "Spring Open" is kept archived

    Scenario: The reader is taken to the list of tournaments
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      When "Send Email and Archive" is pressed in the modal dialog
      Then the address is "/admin/"

  Rule: Something has to be said

    Scenario: A box with nothing in it is refused
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      And the message to the managers is changed to ""
      When "Send Email Only" is pressed in the modal dialog
      Then the message to the managers is refused with "DeleteTournament.MessageMissing"

    Scenario: A refused message keeps the dialog open
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      And the message to the managers is changed to ""
      When "Send Email and Archive" is pressed in the modal dialog
      Then the modal dialog titled "Delete this tournament?" is open

    Scenario: A refused message emails nobody
      Given the page of "Spring Open" is open
      And Delete beside the page's heading is pressed
      And the message to the managers is changed to ""
      When "Send Email and Archive" is pressed in the modal dialog
      Then no email is sent to the managers
