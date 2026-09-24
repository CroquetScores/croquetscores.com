@postgres
Feature: Changing a password with the one the account has now

  A reader signed in to an account can change its password, by giving the one
  it has now and a new one, typed twice. It is asked for by the reader signed
  in, for the account they are signed in to: which account that is, is the web
  layer's to say, from the session. A reader who does not know the password
  the account has now sets one by the way back in instead
  (`SetNewPassword.feature`).

  The new password's rules are the command's own, and asked on the way in, as
  every command's are: the rules setting a password asks, since it is the same
  password. Every password the command carries is trimmed, as it is wherever
  one is made from what a command carries, so that the password the account
  has now is checked as it was kept.

  The password the account has now is checked before anything else is asked
  about the new one. One that is not the account's is refused with
  `ChangePassword.WrongPassword`, and costs the breached password check nothing:
  a reader guessing at the password would otherwise have the site ask another
  site about every guess. How often a wrong one may be given is held to the
  limits signing in is held to, and is the page's to count, as it is for signing
  in (`changePassword.feature`). It is checked as signing in checks it, so an
  account brought over from the old site, still holding the hash it had there,
  changes its password with the one it had there (`SignIn.feature`).

  Whether the new password has been breached is asked only once the one the
  account has now has matched, and with nothing held open while it is asked,
  for the reason setting a password gives: a transaction held open across a
  request to another site holds a database connection doing nothing.

  Every link to set a password that was made before the password was changed
  is spent by it, as it is by setting one: a link still sitting in an inbox
  would be a way to change it again, and a reader changes their password most
  often because somebody else might have it.

  The account's email address is sent an email saying the password was
  changed, so that an owner who did not change it finds out, and is pointed
  there to the way back in.

  Changing the password answers with the account, so that whoever asked can
  end every other session that account has, keeping the one it was asked
  from. Ending them is the web layer's, and is specified with the page
  (`changePassword.feature`).

  These scenarios run against Postgres, with the application's event store and
  read models, a password hasher, and a breached password check the scenario
  can fill.

  Background:
    Given the application's changing of passwords
    And the moment "2026-09-19T10:00:00Z"

  Rule: The right password and a sound new one change it

    Scenario: The account keeps the new password
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then "staple battery horse correct" is the password of the account for "someone@example.com"

    Scenario: The old password is no longer the account's
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then "correct horse battery staple" is not the password of the account for "someone@example.com"

    Scenario: The account keeps a hash, and not the password
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then nothing kept for the account contains "staple battery horse correct"

    Scenario: Passwords typed with spaces around them are taken without them
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "  correct horse battery staple  " to "  staple battery horse correct  "
      Then "staple battery horse correct" is the password of the account for "someone@example.com"

    Scenario: An account brought over from the old site changes its password with the one it had there
      Given "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then "staple battery horse correct" is the password of the account for "someone@example.com"

    Scenario: Changing it answers with the account
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then it is answered with the account for "someone@example.com"

  Rule: The account's email address is told

    Scenario: An email saying the password was changed is queued for the account's address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then the email "Email.PasswordChanged" is queued for "someone@example.com"

  Rule: Changing the password spends every link to set one made before it

    Scenario: A link to set a password asked for before the change no longer works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And a minute has passed
      And the reader signed in to the account for "someone@example.com" has changed its password from "correct horse battery staple" to "staple battery horse correct"
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"

  Rule: A password that is not the account's is refused, and asks nothing more

    Scenario: A wrong password is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "not the right password" to "staple battery horse correct"
      Then it is refused with "ChangePassword.WrongPassword"

    Scenario: A wrong password changes nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "not the right password" to "staple battery horse correct"
      Then "correct horse battery staple" is the password of the account for "someone@example.com"

    Scenario: A wrong password asks nothing about the new one
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "not the right password" to "staple battery horse correct"
      Then nothing was asked of the breached password check

    Scenario: A wrong password emails nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "not the right password" to "staple battery horse correct"
      Then nothing is queued to be sent

  Rule: The new password must break none of its own rules

    Scenario Outline: A new password that breaks a rule is refused for it
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "<password>", confirmed as "<confirmation>"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | password                     | confirmation                 | code                         |
        | too short                    | too short                    | Password.TooShort            |
        | staple battery horse correct | staple battery horse corerct | Password.ConfirmationDiffers |

    Scenario: A new password known to have been breached is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "staple battery horse correct" is known to have been breached
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "staple battery horse correct"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A breached new password typed with spaces around it is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "staple battery horse correct" is known to have been breached
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "  staple battery horse correct  "
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A new password that breaks a rule changes nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signed in to the account for "someone@example.com" changes its password from "correct horse battery staple" to "too short"
      Then "correct horse battery staple" is the password of the account for "someone@example.com"
