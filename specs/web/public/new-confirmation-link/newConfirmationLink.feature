@browser @postgres
Feature: A reader whose confirmation link has expired gets a new one

  A link to confirm an email address works for 24 hours, and one followed
  later is told it has expired and pointed to /account/new-confirmation-link.
  That page carries the expired link with it, and offers a button that sends a
  new one.

  The expired link is what says which account the new one is for. Its
  signature still shows the site made it for that account, however old it is,
  so the reader types nothing, and nothing they could type or change sends the
  new link anywhere but the account's own email address. A link that has been
  altered, or is for an account that has been forgotten, gets nothing, and
  says only that it no longer works.

  Sending takes the button, not just opening the page, as confirming does, so
  that nothing is sent by a mail system or a browser fetching the page ahead of
  the reader.

  The button carries a request id, minted when the page draws it, so that a
  double press asks once: the operation answers the second as it answered the
  first and sends nothing more (`SendConfirmationLinkAgain.feature`). An id
  minted at the pressing would be a new one each time, and every press would
  be a fresh asking.

  An account already confirmed is sent nothing, and its reader is told so and
  pointed to sign in. A new link is sent at most 3 times an hour for an
  account, counted together with those registering sends, since both fill the
  same inbox; past that, the reader is told to try again later. The email
  address is never shown on the page or in its address.

  Nobody needs to be signed in, and none of it needs scripting.

  These scenarios register, follow links by the emails the email queue holds,
  and move the clock as each needs.

  Each scenario has a database and an application of its own. What one
  scenario registers must not be there for the next to find.

  Rule: The page needs no scripting

    Scenario: The new confirmation link page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the new confirmation link page is opened for the link with scripting off
      Then the new confirmation link page is shown

  Rule: The page is reached from an expired link, and sends nothing until asked

    Scenario: An expired link leads to the new confirmation link page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the link is followed
      When the link to the new confirmation link page is followed
      Then the new confirmation link page is shown

    Scenario: Opening the page sends nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the new confirmation link page is opened for the link
      Then nothing more is sent to "someone@example.com"

    Scenario: The page opened without a link sends the reader to sign in
      Given a viewport 1200 pixels wide
      When the new confirmation link page is opened
      Then the sign in page is shown

  Rule: Asking sends a new link to the account's own email address

    Scenario: Asking sends a new link
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then a new link is emailed to "someone@example.com"

    Scenario: Asking tells the reader to check their email
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then the reader is told to check their email

    Scenario: The new link confirms the account
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the new confirmation link page is opened for the link
      And a new link is asked for
      And the new link is followed
      When the email address is confirmed
      Then the email address "someone@example.com" is confirmed

    Scenario: The email address never shows on the way
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then the page does not contain "someone@example.com"
      And the page's address does not contain "someone@example.com"

  Rule: Pressing the button twice asks once

    Scenario: Pressing the button twice sends one email
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And the new confirmation link page is opened for the link
      When a new link is asked for
      And the button is pressed again
      Then one new link has been emailed to "someone@example.com"

  Rule: A link that does not work gets nothing

    Scenario: A link that has been altered says it no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link has been altered
      When the new confirmation link page is opened for the link
      Then the reader is told the link no longer works

    Scenario: A link that has been altered is sent nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And "other@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link has been altered to name the account for "other@example.com"
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then nothing more is sent to "someone@example.com"
      And nothing more is sent to "other@example.com"

    Scenario: A link for an account that has been forgotten says it no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the account for "someone@example.com" has been forgotten
      When the new confirmation link page is opened for the link
      Then the reader is told the link no longer works

  Rule: An account already confirmed is sent nothing, and pointed to sign in

    Scenario: A link for an account already confirmed says so
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the email address is confirmed
      When the new confirmation link page is opened for the link
      Then the reader is told their email address is already confirmed

    Scenario: A link for an account already confirmed points to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the email address is confirmed
      When the new confirmation link page is opened for the link
      Then the page links to the sign in page

  Rule: A new link is sent at most 3 times an hour, counted with those registering sends

    Scenario: An account sent a new link 3 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And "someone@example.com" has been emailed 3 times in the last hour
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then the reader is told to try again later

    Scenario: An hour later, a new link can be sent
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      And "someone@example.com" has been emailed 3 times in the last hour
      And an hour and a minute have passed
      And the new confirmation link page is opened for the link
      When a new link is asked for
      Then a new link is emailed to "someone@example.com"

  Rule: The page is in the reader's language

    Scenario: Every word on the new confirmation link page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the new confirmation link page is opened for the link
      Then every word in the page's content is in the test locale
