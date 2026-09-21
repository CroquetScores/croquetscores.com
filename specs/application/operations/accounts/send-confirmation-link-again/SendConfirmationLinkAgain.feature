@postgres
Feature: Sending the link to confirm an email address again

  A reader holding a link to confirm an email address that has expired can
  have a new one sent, rather than register a second time to get it. It is
  asked for with the account, by nobody signed in; that it is only asked for
  by whoever holds a link the site made for that account is the web layer's to
  see to, and is specified with the new confirmation link page.

  The link goes to the account's own email address, never to one given with
  the request, so that nothing asked here can send the link anywhere else.
  It is the email registering sends when the address registers again, and is
  queued the same way, in the command's own transaction.

  An account already confirmed is refused with `Account.AlreadyConfirmed`, and
  nothing is sent: it has nothing to confirm, and its reader signs in instead.
  An account that has been forgotten is refused with `Account.Forgotten`, and
  sent nothing either. Its two scenarios take hold of the account before it is
  forgotten, because a forgotten account is no longer found by its address —
  which is the shape of the thing rather than a way round it: what asks here
  holds a link the site made before the account was forgotten, and that link
  still names it.

  An account is sent at most 3 emails an hour this way, counted together with
  the ones registering sends, since both fill the same inbox. Past that it is
  refused with `EmailsWritten.TooManyLately` and nothing is sent. It is
  refused rather than quietly doing nothing, as registering is: registering
  must not say whether the address has an account at all, and whoever asks
  here already holds a link the site made for the account, so being told to
  try later tells them nothing they did not know.

  These scenarios run against Postgres, with the application's event store and
  read models, and read what was sent out of the email queue. The one that
  follows the link it sent uses the application's confirming as well, which
  asks for a name and a password (`ConfirmEmailAddress.feature`).

  Background:
    Given the application's sending of the confirmation link again
    And the application's confirming
    And the moment "2026-09-19T10:00:00Z"

  Rule: An unconfirmed account is sent the link again, at its own address

    Scenario: An unconfirmed account is sent the link again
      Given "someone@example.com" has an account, not confirmed
      When sending the link again is asked for the account for "someone@example.com"
      Then the email "Email.ConfirmAddressAgain" is queued for "someone@example.com"

    Scenario: The link sent again confirms the account
      Given "someone@example.com" has an account, not confirmed
      And sending the link again is asked for the account for "someone@example.com"
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is confirmed

    Scenario: Sending the link again records nothing on the account
      Given "someone@example.com" has an account, not confirmed
      When sending the link again is asked for the account for "someone@example.com"
      Then the account for "someone@example.com" has recorded 1 event

  Rule: A confirmed account is sent nothing

    Scenario: A confirmed account is refused as already confirmed
      Given "someone@example.com" has an account, confirmed
      When sending the link again is asked for the account for "someone@example.com"
      Then it is refused with "Account.AlreadyConfirmed"

    Scenario: A confirmed account is sent nothing
      Given "someone@example.com" has an account, confirmed
      When sending the link again is asked for the account for "someone@example.com"
      Then nothing is queued to be sent

  Rule: An account that has been forgotten is sent nothing

    Scenario: A forgotten account is refused as forgotten
      Given "someone@example.com" has an account, not confirmed
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When sending the link again is asked for that account
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account is sent nothing
      Given "someone@example.com" has an account, not confirmed
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When sending the link again is asked for that account
      Then nothing is queued to be sent

  Rule: An account is sent at most 3 emails an hour, counted with registering's

    Scenario: An account sent the link 3 times in the last hour is refused
      Given "someone@example.com" has an account, not confirmed
      And the link has been sent again to "someone@example.com" 3 times in the last hour
      When sending the link again is asked for the account for "someone@example.com"
      Then it is refused with "EmailsWritten.TooManyLately"

    Scenario: An account past the limit is sent nothing more
      Given "someone@example.com" has an account, not confirmed
      And the link has been sent again to "someone@example.com" 3 times in the last hour
      When sending the link again is asked for the account for "someone@example.com"
      Then nothing is queued to be sent

    Scenario: Registering's emails count toward the same limit
      Given "someone@example.com" has an account, not confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      When sending the link again is asked for the account for "someone@example.com"
      Then it is refused with "EmailsWritten.TooManyLately"

    Scenario: An hour later, the link is sent again
      Given "someone@example.com" has an account, not confirmed
      And the link has been sent again to "someone@example.com" 3 times in the last hour
      And an hour and a minute have passed
      When sending the link again is asked for the account for "someone@example.com"
      Then the email "Email.ConfirmAddressAgain" is queued for "someone@example.com"

  Rule: The same request sent twice sends one email

    What asks carries the id, and mints it when it draws the button rather
    than when the button is pressed: an id minted at the pressing would be a
    new one every press, and the second press of a button pressed twice would
    be a second asking. Where that is seen to is specified with the new
    confirmation link page.

    Scenario: The same request sent twice queues one email
      Given "someone@example.com" has an account, not confirmed
      When sending the link again is asked for the account for "someone@example.com"
      And it is asked again with the same request id
      Then one email is queued for "someone@example.com"
