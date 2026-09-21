@browser @postgres
Feature: A reader confirms their email address by the link sent to it

  The link registering sends opens /account/confirm-email-address. Following
  it does not confirm anything by itself. It opens a form, and submitting that
  form confirms. Mail systems follow the links in an email to check them
  before anybody reads it, and a link that confirmed when it was followed
  would confirm an address whose owner never saw the email. Anybody can
  register with somebody else's address; that is the account that would be
  confirmed.

  What the form asks for is a name and a password, twice. They are asked for
  here rather than at registering, and that is the point of asking at all:
  registering takes an address and nothing else, because whoever registers has
  not yet shown the address is theirs, so an account is named, and given its
  password, by whoever turns out to read mail at the address
  (`ConfirmEmailAddress.feature` says more). So the page is a form rather than
  a button, and what a reader typed that breaks a rule is said back to them
  beneath the field it is about, as every other form does.

  Nobody needs to be signed in, and confirming does not sign anybody in. The
  link is often opened on another device from the one registered on, such as a
  phone, and whoever follows it has shown only that they read mail at the
  address, not that they know the password. So once confirmed, the reader is
  told so and pointed to sign in.

  The link is judged before the form is shown, and not only when it is
  submitted. A reader whose link has expired is owed that on arrival rather
  than after filling in a name and a password that were never going to be
  kept. So following a link asks the application what that link is worth
  (`WhatAConfirmationLinkIsWorth.feature`), and the answer decides which page
  arrives; submitting sends the confirmation, and is answered the same way by
  what confirming refuses. The two say the same thing because they ask the
  same question of the same place.

  A link that has expired says so, and points to the new confirmation link
  page, which sends a new one. A link that does not work for any other reason —
  its being altered, its account being forgotten — says only that it no longer
  works, since there is nothing to be had for it. A link for an account already
  confirmed says that instead, and points to sign in. What makes a link expire
  or stop working is specified with confirming.

  A reader who arrives without a link has not come from an email, and there is
  nothing here for them: they are sent to sign in. Nobody is sent here by
  signing in, because an account waiting to be confirmed has no password to
  sign in with — its password is given here, with its name. A reader whose
  link never arrived, or has expired, asks for another from the new
  confirmation link page, with the link they hold.

  None of it needs scripting.

  These scenarios register, and follow links by the emails the email queue
  holds, and move the clock as each needs.

  Each scenario has a database and an application of its own. What one
  scenario registers must not be there for the next to find.

  Rule: The page needs no scripting

    Scenario: The confirm email address page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed with scripting off
      Then the confirm email address page is shown

  Rule: Following the link asks the reader to confirm, and confirms nothing yet

    Scenario: Following the link confirms nothing by itself
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed
      Then the email address "someone@example.com" is not confirmed

    Scenario: Following the link asks the reader for a name
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed
      Then the dialog asks for a name

    Scenario: Following the link asks the reader for a password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed
      Then the dialog asks for a password

    Scenario: Following the link asks the reader for the password again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed
      Then the dialog asks for the password again

  Rule: Submitting a sound name and password confirms the account, and points to sign in

    Scenario: Submitting confirms the account
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      When the dialog is submitted
      Then the email address "someone@example.com" is confirmed

    Scenario: The account is called the name that was typed
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" is called "Sam Someone"

    Scenario: The reader is told the email address is confirmed
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      When the dialog is submitted
      Then the reader is told their email address is confirmed

    Scenario: The reader is pointed to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      When the dialog is submitted
      Then the page links to the sign in page

  Rule: What was typed is said back beneath the field it is about

    Scenario: A password typed differently the second time is said back under the field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery stapel"
      When the dialog is submitted
      Then the reader is told the password was typed differently the second time

    Scenario: A password typed differently the second time confirms nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery stapel"
      When the dialog is submitted
      Then the email address "someone@example.com" is not confirmed

    Scenario: The name that was typed is still in the form
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery stapel"
      When the dialog is submitted
      Then the name in the form is "Sam Someone"

    Scenario: The link still works after a submission that broke a rule
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery stapel"
      And the dialog is submitted
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      When the dialog is submitted
      Then the email address "someone@example.com" is confirmed

  Rule: An expired link says so, and points to getting a new one

    Scenario: A link over 24 hours old says it has expired
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the link is followed
      Then the reader is told the link has expired

    Scenario: An expired link points to the new confirmation link page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the link is followed
      Then the page links to the new confirmation link page

    Scenario: An expired link asks for no name and no password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 24 hours and a minute have passed
      When the link is followed
      Then the page has no form to fill in

    Scenario: A link that expires while the page is open says it has expired
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And 23 hours and 59 minutes have passed
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      And 2 minutes have passed
      When the dialog is submitted
      Then the reader is told the link has expired

  Rule: A link that does not work for any other reason says so, and nothing more

    Scenario: A link that has been altered says it no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link has been altered
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A link that has been altered does not point to the new confirmation link page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link has been altered
      When the link is followed
      Then the page does not link to the new confirmation link page

    Scenario: A link that has been altered asks for no name and no password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link has been altered
      When the link is followed
      Then the page has no form to fill in

  Rule: A link for an account already confirmed says so, and points to sign in

    Scenario: A link followed again says the email address is already confirmed
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      And the dialog is submitted
      When the link is followed
      Then the reader is told their email address is already confirmed

    Scenario: A link for an account already confirmed points to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      And the dialog is submitted
      When the link is followed
      Then the page links to the sign in page

    Scenario: A link for an account already confirmed asks for no name and no password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the password typed again as "correct horse battery staple"
      And the dialog is submitted
      When the link is followed
      Then the page has no form to fill in

  Rule: The page is in the reader's language

    Scenario: Every word on the confirm email address page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link is followed
      Then every word in the page's content is in the test locale
