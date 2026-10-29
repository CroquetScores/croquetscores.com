@browser @postgres
Feature: A reader whose account has no password can have a link sent to set one

  An account made by signing in with Google or Facebook has no password
  (`SignInWithGoogle.feature`, `SignInWithFacebook.feature`). Its reader signs in
  with Google or Facebook, and one who wants to sign in with a password as well
  asks for one on the set password page, /account/set-password. The account menu and the profile offer it to
  such a reader, where they offer the change password page to everybody else
  (`accountMenu.feature`, `profile.feature`).

  The page asks for nothing. It says which email address a link will be sent
  to, and a button sends it, in an email of its own saying the account has no
  password and that the link sets one (`AskToSetPassword.feature`). The link
  opens the page the forgot password page's link opens
  (`forgotPassword.feature`), works once, and for an hour, and sets a password
  by the same rules. A link rather than a form,
  because being signed in is not enough (`changePassword.feature`): a browser
  left signed in would otherwise let whoever picked it up give the account a
  password its owner does not know, and come back with it after being signed
  out. The link asks them to show they read the account's mail as well.

  Setting the password signs the account out on every browser, as setting a
  new password always does, this one with the rest; the reader then signs in
  with the password they chose, or with Google or Facebook as before.

  Asking counts toward how often the account's address may be written to,
  with the emails the forgot password page, registering and the new
  confirmation link page send: at most 3 an hour, past which nothing more is
  sent and the page says what it always says. Pressing the button twice — or
  going back and pressing it again — asks once.

  A reader whose account has a password finds no page here, opened or posted
  to: they change it on the change password page. A reader who is not signed
  in is sent to sign in first. None of it needs scripting.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in can ask

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the set password page is opened
      Then the sign in page is shown

  Rule: A reader whose account has a password finds no page there

    Scenario: A reader whose account has a password is told the page is not found
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the set password page is opened
      Then the page is not found

    Scenario: A reader whose account has a password is told the page is not found when posting to it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the set password page is posted to
      Then the page is not found

  Rule: Asking sends a link to set a password to the account's email address

    Scenario: The page says where the link will be sent
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      When the set password page is opened
      Then the page says a link will be sent to "someone@example.com"

    Scenario: Asking sends a link to set a password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      When the reader asks for a link to set a password
      Then "someone@example.com" is sent a link to set a password

    Scenario: The reader is told to check their email
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      When the reader asks for a link to set a password
      Then the reader is told to check their email

    Scenario: Being told to check their email is on the panel
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      When the reader asks for a link to set a password
      Then the page is on the panel

  Rule: The link sets a password the account signs in with

    Scenario: Following the link lets a password be set
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      And the reader has asked for a link to set a password
      And the link sent to "someone@example.com" is followed
      When the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed

    Scenario: The password set signs in to the account
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      And the reader has asked for a link to set a password
      And the link sent to "someone@example.com" is followed
      And the new password "correct horse battery staple" is set
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

  Rule: Pressing the button twice asks once

    Scenario: Pressing the button twice sends one link
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the set password page is open
      And the reader has asked for a link to set a password
      When the reader goes back and asks for a link to set a password again
      Then one link to set a password has been sent to "someone@example.com"

  Rule: The page needs no scripting

    Scenario: The set password page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      When the set password page is opened with scripting off
      Then the set password page is shown

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      When the set password page is opened
      Then every word in the dialog but the account's own is in the test locale
