@browser @postgres
Feature: A reader who is signed in can change their account's email address

  The change email address page, /account/change-email-address, asks a reader
  who is signed in for the email address they want the account moved to, and
  for the password they have now. The password is asked for for the reason it
  is asked for when changing it (`changePassword.feature`): a browser left
  signed in would otherwise let whoever picked it up move the account to an
  address of their own, and with it every way back in. A password that is not
  the account's is said beneath its field, and sends nothing. So is an address
  that breaks a rule, or the address the account has already.

  Being asked for the password makes this page a way to guess it, as the
  change password page is, and a guess that lands here moves the account. So a
  wrong password here counts toward the limits signing in is held to
  (`signIn.feature`), against the account's email address and the IP address
  it came from, as it does there, and the right one counts for nothing. Were it
  counted on one page and not the other, whoever holds a browser left signed in
  would guess on the page that does not count. An address or an IP address
  held by either limit is told to try again later, whatever was typed, and
  nothing is sent.

  Asking changes nothing yet. The account is only moved to an address once
  whoever reads mail there has said so, as an account is only confirmed at one
  (`ConfirmEmailAddress.feature`): an address that was mistyped, or that is
  somebody else's, must not become the account's. So asking sends a link to
  the new address, and the page says to check their email there.

  The page says the same whoever the new address belongs to, and never says
  whether it has an account: which addresses have accounts must not be found
  out from this page, any more than from signing in or registering. An address
  that has an account already is sent an email saying so, in place of a link,
  and nothing is changed.

  Following the link does not change anything by itself. It opens a page that
  says which address the account will move to, with a button that moves it:
  mail systems follow the links in an email to check them before anybody reads
  it (`forgetAccount.feature`). The link works once, for 24 hours, as a link to
  confirm an email address does, and only for the account it was sent for,
  signed in.

  Once moved, the account signs in with its new address and not its old one,
  and the old address is free to be registered again. The old address is sent
  an email saying the account has moved and to where it has moved, so that an
  owner who did not move it finds out while they can still read mail for the
  account. The reader is taken to their profile, which shows the new address.

  Only a reader who is signed in can ask; one who is not is sent to sign in
  first. None of it needs scripting.

  These scenarios sign in, and send and follow links by the emails the email
  queue holds, and move the clock as each needs.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in can ask

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the change email address page is opened
      Then the sign in page is shown

    Scenario Outline: A reader signed in is asked for each
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change email address page is opened
      Then the dialog asks for <what>

      Examples:
        | what                 |
        | a new email address  |
        | the current password |

  Rule: Asking emails a link to the new address, and changes nothing yet

    Scenario: Asking sends a link to the new address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then a link to confirm the new email address is emailed to "sam@example.org"

    Scenario: Asking tells the reader to check their email
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the reader is told to check their email

    Scenario: Asking changes nothing yet
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then "someone@example.com" has an account

  Rule: An address that has an account already is told so, and the reader is told nothing different

    Scenario: The reader is told to check their email all the same
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the reader is told to check their email

    Scenario: The address is sent an email saying it has an account already
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then "sam@example.org" is sent an email saying it has an account already

    Scenario: The address is sent no link
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then no link to confirm the new email address is emailed to "sam@example.org"

  Rule: Following the link asks once more, and changes the address only when the reader says so

    Scenario: Following the link changes nothing by itself
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      When the link emailed to "sam@example.org" is followed
      Then "someone@example.com" has an account

    Scenario: Following the link says the address the account will move to
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      When the link emailed to "sam@example.org" is followed
      Then the page says the account will move to "sam@example.org"

    Scenario: Saying so moves the account to the new address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And the link emailed to "sam@example.org" has been followed
      When moving the account is confirmed
      Then "sam@example.org" has an account

    Scenario: The reader is taken to their profile
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And the link emailed to "sam@example.org" has been followed
      When moving the account is confirmed
      Then the profile page is shown

    Scenario: The profile shows the new address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And the link emailed to "sam@example.org" has been followed
      When moving the account is confirmed
      Then the profile shows the email address "sam@example.org"

  Rule: A moved account signs in with its new address, and the old one is told and freed

    Scenario: The new address signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the account has been moved to "sam@example.org"
      And nobody is signed in
      And the sign in page is open
      When the reader signs in as "sam@example.org" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "sam@example.org"

    Scenario: The old address no longer signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the account has been moved to "sam@example.org"
      And nobody is signed in
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed out

    Scenario: The old address is sent an email saying the account has moved
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the account has been moved to "sam@example.org"
      Then "someone@example.com" is sent an email saying the account has moved to "sam@example.org"

    Scenario: The old address can be registered again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the account has been moved to "sam@example.org"
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then a link to confirm the email address is emailed to "someone@example.com"

  Rule: The link works once, for 24 hours, and for its own account signed in

    Scenario: A link followed after 23 hours still works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And 23 hours have passed
      When the link emailed to "sam@example.org" is followed
      Then the page says the account will move to "sam@example.org"

    Scenario: A link followed after 25 hours says it no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And 25 hours have passed
      When the link emailed to "sam@example.org" is followed
      Then the page says the link no longer works

    Scenario: A link does not work twice
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the account has been moved to "sam@example.org"
      When the link emailed to "sam@example.org" is followed
      Then the page says the link no longer works

    Scenario: A link followed signed in as somebody else says it no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "somebody@example.com" has an account, confirmed, with the password "a different battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And nobody is signed in
      And the reader has signed in as "somebody@example.com" with the password "a different battery staple"
      When the link emailed to "sam@example.org" is followed
      Then the page says the link no longer works

    Scenario: A link followed signed in as nobody is sent to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And changing the email address to "sam@example.org" has been asked for
      And nobody is signed in
      When the link emailed to "sam@example.org" is followed
      Then the sign in page is shown

  Rule: A wrong password counts toward the sign in limits, and a held address is told to try later

    Scenario: A wrong current password is counted
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "not the right password" is typed
      When the dialog is submitted
      Then signing in as "someone@example.com" has been counted 1 time

    Scenario: The right current password counts for nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then signing in as "someone@example.com" has been counted 0 times

    Scenario: An email address that has failed 10 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the reader is told to try again later

    Scenario: An email address held by the limit sends nothing, even given the right password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then no link to confirm the new email address is emailed to "sam@example.org"

    Scenario: An IP address that has failed 30 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And this IP address has failed to sign in 30 times in the last hour
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the reader is told to try again later

  Rule: What breaks a rule is said beneath its field, and sends nothing

    Scenario: A wrong current password is said beneath its field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "not the right password" is typed
      When the dialog is submitted
      Then the current password field says the message for "ChangeEmailAddress.WrongPassword"

    Scenario: A wrong current password sends nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example.org" is typed
      And the current password "not the right password" is typed
      When the dialog is submitted
      Then no link to confirm the new email address is emailed to "sam@example.org"

    Scenario Outline: A new address that breaks a rule is said beneath its field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "<address>" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the new email address field says the message for "<code>"

      Examples:
        | address             | code                         |
        | sam@example         | EmailAddress.NoDomain        |
        | someone@example.com | ChangeEmailAddress.Unchanged |
        | Someone@Example.com | ChangeEmailAddress.Unchanged |

    Scenario: A new address that breaks a rule sends nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then no link to confirm the new email address is emailed to "sam@example"

    Scenario: The new address that was typed is put back
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then the new email address field holds "sam@example"

    Scenario: The password that was typed is not put back
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change email address page is open
      And the new email address "sam@example" is typed
      And the current password "correct horse battery staple" is typed
      When the dialog is submitted
      Then every password field is empty

  Rule: The pages need no scripting

    Scenario: The change email address page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change email address page is opened with scripting off
      Then the change email address page is shown

  Rule: The pages are in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change email address page is opened
      Then every word in the dialog is in the test locale
