@postgres
Feature: Asking for a link to set a password on an account that has none

  An account made by signing in with Google has no password
  (`SignInWithGoogle.feature`). Its reader, signed in, can ask for one to be
  set, and is sent a link to do it at the account's own email address. It is
  asked for by the reader signed in, for the account they are signed in to:
  which account that is, is the web layer's to say, from the session.

  A link rather than setting the password straight away, because being signed
  in is not enough (`ChangePassword.feature`): a browser left signed in would
  otherwise let whoever picked it up give the account a password its owner
  does not know. Whoever asks has to read the account's mail as well.

  The email is its own, `Email.SetPassword`, saying the account has no
  password and that the link sets one, rather than the forgot password email,
  which says a password was forgotten. The link is the one that email carries
  all the same: it works once, and for an hour, and sets a password by the
  rules any password is set by (`SetNewPassword.feature`).

  An account that has a password already is refused with
  `AskToSetPassword.HasPassword`, and sent nothing: its reader changes it with
  the one it has (`ChangePassword.feature`), or asks for a way back in if they
  have forgotten it (`ResetPassword.feature`). An account that has been
  forgotten is sent nothing, since there is nobody left to send it to.

  Asking counts toward how often the address may be written to, with the
  emails registering, the forgot password page and the new confirmation link
  page send, since all of them fill the same inbox: at most 3 an hour. Past
  the limit nothing is sent, and asking answers as it always does. An asking
  sent twice — because an answer was lost on its way back — carries the same
  request id both times, and the second sends nothing more.

  Nothing about the account changes until the link is used.

  These scenarios run against Postgres, with the application's event store and
  read models, and read what was sent out of the email queue.

  Background:
    Given the application's asking to set a password
    And the moment "2026-09-19T10:00:00Z"

  Rule: Asking sends a link to set a password to the account's own address

    Scenario: Asking sends the email for setting a password
      Given "someone@example.com" has an account, confirmed, with no password
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then the email "Email.SetPassword" is queued for "someone@example.com"

    Scenario: The email carries a link
      Given "someone@example.com" has an account, confirmed, with no password
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then the email queued for "someone@example.com" carries a link

    Scenario: The link works for an hour
      Given "someone@example.com" has an account, confirmed, with no password
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then the email queued for "someone@example.com" stops working at "2026-09-19T11:00:00Z"

    Scenario: Asking changes nothing about the account
      Given "someone@example.com" has an account, confirmed, with no password
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then the account for "someone@example.com" has no password

    Scenario: The link sets a password
      Given "someone@example.com" has an account, confirmed, with no password
      And setting a password has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      Then "a different long password" is the password of the account for "someone@example.com"

  Rule: An account that has a password is refused, and sent nothing

    Scenario: An account with a password is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then it is refused with "AskToSetPassword.HasPassword"

    Scenario: An account with a password is sent nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then nothing is queued to be sent

  Rule: A forgotten account is sent nothing

    Scenario: A forgotten account is sent nothing
      Given "someone@example.com" has an account, confirmed, with no password
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When setting a password is asked for by the reader signed in to that account
      Then nothing is queued to be sent

  Rule: An address is sent at most 3 emails an hour

    Scenario: An account sent 3 emails in the last hour is sent nothing more
      Given "someone@example.com" has an account, confirmed, with no password
      And "someone@example.com" has been registered 3 times in the last hour
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then nothing more is queued for "someone@example.com"

    Scenario: An hour later, the link is sent again
      Given "someone@example.com" has an account, confirmed, with no password
      And "someone@example.com" has been registered 3 times in the last hour
      And an hour and a minute have passed
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      Then the email "Email.SetPassword" is queued for "someone@example.com"

  Rule: An asking sent twice sends one email

    Scenario: The same asking sent twice queues one email
      Given "someone@example.com" has an account, confirmed, with no password
      When setting a password is asked for by the reader signed in to the account for "someone@example.com"
      And the same asking to set a password is sent again
      Then one email is queued for "someone@example.com"
