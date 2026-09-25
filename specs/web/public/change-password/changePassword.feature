@browser @postgres
Feature: A reader who is signed in can change their password

  The change password page, /account/change-password, asks a reader who is
  signed in for the password they have now, a new password, and the new
  password again, under "Confirm password". The new password is held to the
  rules any password is held to when it is set (`SetNewPassword.feature`): long
  enough, typed the same twice, and not known to have been breached. Every
  field is trimmed where it is typed, as it is when signing in.

  The password they have now is asked for because being signed in is not
  enough. A browser left signed in, on a shared computer or an unlocked phone,
  would otherwise let whoever picked it up choose a password its owner does not
  know, and lock them out with it. A password that is not the account's is said
  beneath the field it was typed in, changes nothing, and emails nothing; the
  last is said where an email would be sent from (`ChangePassword.feature`),
  since a page emails nothing itself.

  Being asked for the password makes this page a way to guess it, one guess to
  a submission, for whoever holds a browser left signed in; and a password
  guessed here is a password that moves the account to another address. So a
  wrong password here counts toward the limits signing in is held to
  (`signIn.feature`), against the account's email address and against the IP
  address it came from, and the right one counts for nothing. An address or an
  IP address held by either limit is told to try again later, whatever was
  typed, and nothing is changed.

  A reader who does not know the password they have now — one who registered
  with Google, whose account was given a password nobody was told, or one who
  has forgotten it — cannot change it here, so the page points them to the
  forgot password page, where a password is set by a link sent to the account's
  email address instead.

  Once changed, the password signs in and the old one does not. The reader
  stays signed in on the browser they changed it from, and every other browser
  signed in to the account is signed out: a password is changed most often
  because somebody else might know it, and whoever that is should not stay in
  on the strength of it. The account's email address is sent an email saying
  the password was changed, so that an owner who did not change it finds out,
  and the reader is taken to their profile.

  Only a reader who is signed in can change it; one who is not is sent to sign
  in first. Changing it needs no scripting.

  These scenarios stand in for the breached password check with one that finds
  every password clean, as every browser scenario's does. That a breached
  password is refused is said with the operation (`ChangePassword.feature`),
  which can say a password has been breached; the page says it beneath the new
  password as it says a password too short.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in can change the password

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the change password page is opened
      Then the sign in page is shown

    Scenario Outline: A reader signed in is asked for each
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change password page is opened
      Then the dialog asks for <what>

      Examples:
        | what                   |
        | the current password   |
        | a new password         |
        | the new password again |

  Rule: A reader who does not know their password is pointed to the forgot password page

    Scenario: The page links to the forgot password page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change password page is opened
      Then the page links to the forgot password page once

  Rule: The right password and a sound new one change it

    Scenario: The new password signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" has the password "staple battery horse correct"

    Scenario: The old password no longer signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" does not have the password "correct horse battery staple"

    Scenario: Passwords typed with spaces around them are kept without them
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "  correct horse battery staple  " is typed
      And the new password "  staple battery horse correct  " is typed
      And the new password is typed again as "  staple battery horse correct  "
      When the dialog is submitted
      Then the account for the email address "someone@example.com" has the password "staple battery horse correct"

    Scenario: The reader is taken to their profile
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the profile page is shown

  Rule: Changing the password keeps this browser signed in, and signs every other out

    Scenario: The reader stays signed in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: Another browser signed in to the account is signed out
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the reader has signed in on another browser as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the other browser is signed out

  Rule: The account's email address is told the password was changed

    Scenario: An email saying so is sent to the account's email address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then "someone@example.com" is sent an email saying their password was changed

  Rule: A password that is not the account's is said beneath its field, and changes nothing

    Scenario: A wrong current password is said beneath its field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "not the right password" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the current password field says the message for "ChangePassword.WrongPassword"

    Scenario: A wrong current password changes nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "not the right password" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" has the password "correct horse battery staple"

  Rule: A wrong password counts toward the sign in limits, and a held address is told to try later

    Scenario: A wrong current password is counted
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "not the right password" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then signing in as "someone@example.com" has been counted 1 time

    Scenario: The right current password counts for nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then signing in as "someone@example.com" has been counted 0 times

    Scenario: An email address that has failed 10 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the reader is told to try again later

    Scenario: An email address held by the limit keeps its password, even given the right one
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" has the password "correct horse battery staple"

    Scenario: An IP address that has failed 30 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And this IP address has failed to sign in 30 times in the last hour
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "staple battery horse correct" is typed
      And the new password is typed again as "staple battery horse correct"
      When the dialog is submitted
      Then the reader is told to try again later

  Rule: A new password that breaks a rule is said beneath its field, and changes nothing

    Scenario Outline: A new password that breaks a rule is said beneath its field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "<password>" is typed
      And the new password is typed again as "<again>"
      When the dialog is submitted
      Then the <field> field says the message for "<code>"

      Examples:
        | password                     | again                        | field            | code                         |
        | too short                    | too short                    | new password     | Password.TooShort            |
        | staple battery horse correct | staple battery horse corerct | confirm password | Password.ConfirmationDiffers |

    Scenario: A new password that breaks a rule changes nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "too short" is typed
      And the new password is typed again as "too short"
      When the dialog is submitted
      Then the account for the email address "someone@example.com" has the password "correct horse battery staple"

    Scenario: No password is put back
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change password page is open
      And the current password "correct horse battery staple" is typed
      And the new password "too short" is typed
      And the new password is typed again as "too short"
      When the dialog is submitted
      Then every password field is empty

  Rule: The page needs no scripting

    Scenario: The change password page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change password page is opened with scripting off
      Then the change password page is shown

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change password page is opened
      Then every word in the dialog is in the test locale
