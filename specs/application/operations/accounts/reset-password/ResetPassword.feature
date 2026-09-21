@postgres
Feature: Asking for a way back in to an account

  A reader who cannot sign in gives the email address they registered with,
  and is answered the same whoever it belongs to: which addresses have
  accounts must not be found out by asking. So nothing here answers anything.
  What differs is only what is sent to the address, which only its owner
  reads:

    - an address with a confirmed account is sent a link to set a new
      password, which works for an hour;
    - an address whose account is registered and not confirmed is sent the
      link to confirm it again, because an account waiting to be confirmed has
      no password to replace: its password is given by whoever confirms the
      address (`ConfirmEmailAddress.feature`), and until then there is nothing
      to set anew;
    - an address with no account is sent a link to register instead, since
      whoever asked has no account to get back into and may have meant to make
      one.

  A forgotten account is an address with no account: it is not found by its
  old address, and its reader is sent the same as anybody else's.

  The address's own rules are asked on the way in, as every command's are. An
  address that is not one cannot be emailed at all, and whoever typed it is
  owed the chance to fix it — which says nothing about who has an account,
  since the rules are the same for every address ever typed.

  An account is sent at most 3 emails an hour, counted together with the ones
  registering and the new confirmation link page send, since all of them fill
  the same inbox. An address with no account is counted too, by the keyed hash
  it is found by rather than by the address itself, so that nothing kept holds
  an address anybody could read. Past the limit nothing is sent, and the
  asking answers exactly as it always does: a limit that said it had been
  reached would say the address was worth asking about.

  An asking sent twice — because an answer was lost on its way back — carries
  the same request id both times, and the second finds the first and answers
  as it did, sending nothing more.

  These scenarios run against Postgres, with the application's event store and
  read models, and read what was sent out of the email queue.

  Background:
    Given the application's asking for a way back in
    And the moment "2026-09-19T10:00:00Z"

  Rule: A confirmed account is sent a link to set a new password

    Scenario: A confirmed account is sent a link to set a new password
      Given "someone@example.com" has an account, confirmed
      When a way back in is asked for "someone@example.com"
      Then the email "Email.SetNewPassword" is queued for "someone@example.com"

    Scenario: The email carries a link
      Given "someone@example.com" has an account, confirmed
      When a way back in is asked for "someone@example.com"
      Then the email queued for "someone@example.com" carries a link

    Scenario: The link works for an hour
      Given "someone@example.com" has an account, confirmed
      When a way back in is asked for "someone@example.com"
      Then the email queued for "someone@example.com" stops working at "2026-09-19T11:00:00Z"

    Scenario: The link goes to the address the account holds
      Given "Someone@Example.com" has an account, confirmed
      When a way back in is asked for "SOMEONE@example.com"
      Then the email "Email.SetNewPassword" is queued for "Someone@Example.com"

    Scenario: Nothing about the account changes
      Given "someone@example.com" has an account, confirmed
      When a way back in is asked for "someone@example.com"
      Then the account for "someone@example.com" has recorded 2 events

  Rule: An account that is not confirmed is sent the link to confirm it

    Scenario: An unconfirmed account is sent the link to confirm it again
      Given "someone@example.com" has an account, not confirmed
      When a way back in is asked for "someone@example.com"
      Then the email "Email.ConfirmAddressAgain" is queued for "someone@example.com"

    Scenario: It is sent no link to set a password
      Given "someone@example.com" has an account, not confirmed
      When a way back in is asked for "someone@example.com"
      Then nothing of the kind "Email.SetNewPassword" is queued

  Rule: An address with no account is sent a link to register

    Scenario: An address nobody has registered is sent a link to register
      When a way back in is asked for "nobody@example.com"
      Then the email "Email.RegisterInstead" is queued for "nobody@example.com"

    Scenario: A forgotten account's address is sent the same
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" has been forgotten
      When a way back in is asked for "someone@example.com"
      Then the email "Email.RegisterInstead" is queued for "someone@example.com"

  Rule: An address that breaks its own rules is refused with it

    Scenario Outline: An address that is not one is refused
      When a way back in is asked for "<address>"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | address             | code                  |
        |                     | EmailAddress.Missing  |
        | someone.example.com | EmailAddress.NoAt     |
        | someone@example     | EmailAddress.NoDomain |

    Scenario: An address that is not one is sent nothing
      When a way back in is asked for "someone.example.com"
      Then nothing is queued to be sent

  Rule: An address is sent at most 3 emails an hour

    Scenario: An account sent 3 emails in the last hour is sent nothing more
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      When a way back in is asked for "someone@example.com"
      Then nothing more is queued for "someone@example.com"

    Scenario: Past the limit, asking answers as it always does
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      When a way back in is asked for "someone@example.com"
      And a way back in is asked for "nobody@example.com"
      Then the two askings answer the same

    Scenario: An address with no account is held to the limit too
      Given "nobody@example.com" has been written to 3 times in the last hour
      When a way back in is asked for "nobody@example.com"
      Then nothing more is queued for "nobody@example.com"

    Scenario: An address written another way counts toward the same limit
      Given "nobody@example.com" has been written to 3 times in the last hour
      When a way back in is asked for "  NOBODY@Example.com  "
      Then nothing more is queued to be sent, to any address

    Scenario: An hour later, a way back in is sent again
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      And an hour and a minute have passed
      When a way back in is asked for "someone@example.com"
      Then the email "Email.SetNewPassword" is queued for "someone@example.com"

  Rule: An asking sent twice sends one email

    Scenario: The same asking sent twice queues one email
      Given "someone@example.com" has an account, confirmed
      When a way back in is asked for "someone@example.com"
      And the same asking is sent again
      Then one email is queued for "someone@example.com"
