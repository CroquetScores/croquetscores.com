@postgres
Feature: Confirming an account's email address

  Registering a new address sends it a link to confirm it, and registering it
  again before it is confirmed sends the link again. Confirming is asked for
  with what the link carries, by nobody signed in: whoever has the link has
  shown they can read mail at the address, which is the whole of what
  confirming is to show.

  The link carries what it is for, the account, and when it stops working, all
  signed with a key the site keeps as a setting, like every other secret. A
  link whose signature does not match what it carries has been altered, and
  does not work. What it is for is signed with the rest, so that a link the
  site made for anything else — setting a new password, forgetting an account —
  is not taken for one to confirm, however it is sent. Signing it, rather than
  keeping a table of links sent, means there is nothing to look up, nothing to
  clear out once links have expired, and every link sent for an account works
  until it expires or the account is confirmed, whichever email it came in.

  A link works for 24 hours. Confirming does less harm in the wrong hands than
  setting a new password or forgetting an account, whose links last an hour
  and 15 minutes, and an email held up by a mail provider that is down can
  arrive nearly six hours late. A link that has expired is not the end of it.
  It is refused with `Link.Expired`, told apart from a link that does not work
  for any other reason, because an expired link still shows which account it
  was sent for, and can be traded for a new one; that is specified with the
  new confirmation link page. So a link is only called expired once its
  signature holds and its account is one that could still be confirmed: an
  altered link, or one for a forgotten account, is refused with
  `Link.NoLongerWorks` however old it is.

  A link works once, because an account is confirmed once. Following it again
  is refused as already confirmed, rather than as a link that no longer works,
  since only whoever reads mail at the address has the link, and telling them
  their address is confirmed tells them nothing they could not find out.

  A link for an account that has been forgotten no longer works. Not because
  the account cannot be read — a forgotten account still reads back, as a name
  and an address that say only that it was forgotten — but because it cannot
  be confirmed, and there is nothing to trade an expired link for.

  Those two scenarios take the link out of the email before the account is
  forgotten, because forgetting throws away the key the email was sealed with
  and nothing can read it afterwards. That is not a way round the scenario but
  the shape of the thing: the link reached somebody's inbox while the account
  was there, and forgetting the account does not reach into their mail and
  take it back. What is being asked is what happens when they follow it.

  These scenarios run against Postgres, with the application's registering,
  its event store and read models, and read the link out of the email the
  email queue holds.

  Background:
    Given the application's registering
    And the moment "2026-09-19T10:00:00Z"

  Rule: The link registering sends confirms the account

    Scenario: The link sent on registering confirms the account
      Given a registration for "someone@example.com" is sent
      When confirming is sent with the link emailed to "someone@example.com"
      Then the account for "someone@example.com" is confirmed

    Scenario: The link sent again on registering again confirms the account
      Given a registration for "someone@example.com" is sent
      And a registration for "someone@example.com" is sent
      When confirming is sent with the link in the email "Email.ConfirmAddressAgain" to "someone@example.com"
      Then the account for "someone@example.com" is confirmed

    Scenario: The first link still works once the link has been sent again
      Given a registration for "someone@example.com" is sent
      And a registration for "someone@example.com" is sent
      When confirming is sent with the link in the email "Email.ConfirmAddress" to "someone@example.com"
      Then the account for "someone@example.com" is confirmed

  Rule: A link works for 24 hours

    Scenario: A link a minute short of 24 hours old works
      Given a registration for "someone@example.com" is sent
      And the moment "2026-09-20T09:59:00Z"
      When confirming is sent with the link emailed to "someone@example.com"
      Then the account for "someone@example.com" is confirmed

    Scenario: A link a minute over 24 hours old is refused
      Given a registration for "someone@example.com" is sent
      And the moment "2026-09-20T10:01:00Z"
      When confirming is sent with the link emailed to "someone@example.com"
      Then it is refused with "Link.Expired"

    Scenario: A link refused for its age confirms nothing
      Given a registration for "someone@example.com" is sent
      And the moment "2026-09-20T10:01:00Z"
      When confirming is sent with the link emailed to "someone@example.com"
      Then the account for "someone@example.com" is not confirmed

  Rule: A link that has been altered does not work

    Scenario: A link altered to name another account is refused
      Given a registration for "someone@example.com" is sent
      And a registration for "other@example.com" is sent
      And the link emailed to "someone@example.com" is altered to name the account for "other@example.com"
      When confirming is sent with the altered link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link altered to name another account confirms neither
      Given a registration for "someone@example.com" is sent
      And a registration for "other@example.com" is sent
      And the link emailed to "someone@example.com" is altered to name the account for "other@example.com"
      When confirming is sent with the altered link
      Then the account for "other@example.com" is not confirmed
      And the account for "someone@example.com" is not confirmed

    Scenario: A link altered to work for longer is refused
      Given a registration for "someone@example.com" is sent
      And the link emailed to "someone@example.com" is altered to work until "2026-09-30T10:00:00Z"
      And the moment "2026-09-21T10:00:00Z"
      When confirming is sent with the altered link
      Then it is refused with "Link.NoLongerWorks"

  Rule: A link made for anything else does not confirm

    Scenario: A link to set a new password does not confirm
      Given a registration for "someone@example.com" is sent
      And a link to set a new password has been sent to "someone@example.com"
      When confirming is sent with the link to set a new password
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link to confirm forgetting does not confirm
      Given a registration for "someone@example.com" is sent
      And a link to confirm forgetting has been made for "someone@example.com"
      When confirming is sent with the link to confirm forgetting
      Then it is refused with "Link.NoLongerWorks"

  Rule: An account is confirmed once

    Scenario: Confirming a confirmed account is refused as already confirmed
      Given a registration for "someone@example.com" is sent
      And confirming is sent with the link emailed to "someone@example.com"
      When confirming is sent with the link emailed to "someone@example.com"
      Then it is refused with "Account.AlreadyConfirmed"

    Scenario: Confirming a confirmed account records nothing more
      Given a registration for "someone@example.com" is sent
      And confirming is sent with the link emailed to "someone@example.com"
      When confirming is sent with the link emailed to "someone@example.com"
      Then the account for "someone@example.com" has recorded 2 events

  Rule: A link for a forgotten account does not work

    Scenario: A link for an account that has been forgotten is refused
      Given a registration for "someone@example.com" is sent
      And the link emailed to "someone@example.com" is taken out of the email
      And the account for "someone@example.com" has been forgotten
      When confirming is sent with the link that was taken
      Then it is refused with "Link.NoLongerWorks"

    Scenario: An expired link for an account that has been forgotten is refused as no longer working
      Given a registration for "someone@example.com" is sent
      And the link emailed to "someone@example.com" is taken out of the email
      And the account for "someone@example.com" has been forgotten
      And the moment "2026-09-20T10:01:00Z"
      When confirming is sent with the link that was taken
      Then it is refused with "Link.NoLongerWorks"

  Rule: Confirming is asked for with text, or not at all

    Confirming is made from what the edge read out of the query, and the query
    is whatever the reader followed. A `link` parameter the edge was to find
    and did not arrives as nothing at all, and one given twice arrives as both
    of them, since there is no saying which was meant. Neither is text.

    Left for the reading of the link to catch, that nothing is asked to search
    itself for a query before any rule about links is reached, and the site
    answers with its own code breaking rather than with the page that says the
    link no longer works.

    So confirming given anything but text is refused where it is made, as a
    command given a plain date rather than a moment is. Text that is no link
    of this site's is still text, and is the reading's to refuse.

    Scenario: Confirming made with the link left out is refused
      When confirming is made with the link left out
      Then making it is refused with "ConfirmEmailAddress.NotText"

    Scenario: Confirming made with the link given twice is refused
      When confirming is made with the link given twice
      Then making it is refused with "ConfirmEmailAddress.NotText"
