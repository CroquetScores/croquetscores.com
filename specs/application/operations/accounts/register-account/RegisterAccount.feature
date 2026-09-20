@postgres
Feature: Registering an account

  Registering is asked for with an email address and nothing else, by nobody
  signed in. Its rules are the address's own; a request that breaks one is
  refused with it, before anything else is done.

  No name and no password are asked for here, and that is on purpose. Whoever
  registers has not yet shown the address is theirs, and whatever they typed
  would be kept for whoever does turn out to own it. A stranger who registered
  somebody else's address first would have named their account and chosen its
  password, and the owner, registering later and following the link, would
  have confirmed an account they could not sign in to and the stranger could.
  So the name and the password are asked for with confirming, of whoever has
  shown they read mail at the address, and nothing a stranger types is ever
  kept.

  Whether the address already has an account must never show in the answer.
  So registering answers the same whoever the address belongs to. Nothing slow
  is done for one kind of address and not for another: there is no password to
  hash and no outside service to ask, and what is left — finding who holds the
  address, and queueing one email — is done whoever it is. What differs is only
  what is sent to the address, which only its owner reads:

    - an address nobody has registered becomes a new account, unconfirmed,
      and is sent a link to confirm it;
    - an address registered and not yet confirmed is sent the link again,
      and nothing else changes;
    - an address registered and confirmed is sent word that somebody tried to
      register with it, and a link to sign in, since somebody who reads that
      email and finds the address is theirs already wants the way in rather
      than the way to register. It is a link to the site's own sign in page,
      made from the site's address by the writer, which is where every link to
      a page of this site's is made (`emailWriter.feature`); registering mints
      nothing for it, because there is nothing to confirm and nothing to
      expire. Nothing about the account changes.

  The email address typed when an account is registered is kept in two forms:

    - as it was typed, which is what emails are sent to;
    - in lower case, which is what the account is found by.

  So an address typed later in another case finds the same account, and is
  not a second one. And whatever is sent goes to the address as the account
  was registered with it, not as a later registration typed it: a mail host
  may deliver Someone@example.com and someone@example.com to different
  mailboxes, and the casing the owner registered with is the one known to
  reach them.

  The email is not sent from here. It is put in a queue, in the same
  transaction as the account, so that an account is never recorded without its
  email, nor an email sent for an account that was not. What sends it is
  specified with the queue. An email carrying a link is queued with the moment
  that link stops working, so that the queue never sends one that had expired
  before it went.

  Registering an address that already has an account sends it an email every
  time, and nothing about the answer may say when that stops. So an account is
  sent at most 3 emails an hour by registering, counted with the links sent
  again from the new confirmation link page, since both fill the same inbox;
  past that, registering answers as it always does and sends nothing. The
  emails are counted by the account, not by the address as it was typed, so
  that writing it another way does not count afresh. Registrations arriving at
  once are counted one after another, each waiting for the one before it to
  finish: counted side by side, every one of them would count before any had
  been recorded, find the account under its limit, and send, and the limit
  would stop only whoever was polite enough to register slowly.

  Registering again is also how a reader whose link never arrived gets
  another. There is no other way to ask for one without a link in hand, and
  there cannot be: an unconfirmed account has no password, so there is nothing
  its owner could give to show the account is theirs except the address, which
  is what registering asks for.

  A registration sent twice — because an answer was lost on its way back —
  carries the same request id both times, and registers once: the second finds
  the first and answers as the first did, sending nothing more.

  Two registrations for the same new address at once are not that: they carry
  different request ids, and neither knows of the other. The address is
  reserved rather than looked for, because between a look that found nothing
  and the writing that followed it the other one can have taken the address,
  and then both would make an account. Reserving is one write against a unique
  key on the address, which decides once: whichever made the reservation
  registers, and the other is told who holds it and writes to that account as
  any registration for an address that already has one does. Neither is
  refused. A refusal would have to be swallowed anyway, since saying the
  address was taken is saying it was registered.

  These scenarios run against Postgres, with the application's event store and
  read models.

  The address is registered as Someone@Example.com throughout, with capital
  letters in it on purpose. What was sent is looked for under exactly that, so
  an email sent to the address in lower case would not be found; and the
  account is asked for as someone@example.com, so an account found only by
  the form it was typed in would not be found either. A later registration in
  another case types it as SOMEONE@example.com, which is neither.

  Background:
    Given the application's registering
    And the moment "2026-09-19T10:00:00Z"

  Rule: A registration is made with a request id, or not at all

    A registration with no request id is one that could be sent twice and
    registered twice, which is the one thing the id is there to prevent — and
    worse, the first one sent with none would be remembered under that nothing,
    and every registration after it carrying none would be answered as already
    done. So one made without it is refused where it is made, as a command
    made without saying when it was asked for is: that is a mistake in the
    code making it, not in anything somebody typed, and it is caught before
    the registration exists.

    Scenario: A registration made with no request id is refused
      When a registration is made with no request id
      Then making it is refused with "RegisterAccount.RequestIdMissing"

  Rule: A registration whose email address breaks a rule is refused with it

    Scenario Outline: A registration breaking a rule is refused for it
      Given a registration for "<address>"
      When it is sent
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And no other rule is broken

      Examples:
        | address              | code                       |
        |                      | EmailAddress.Missing       |
        | someone.example.com  | EmailAddress.NoAt          |
        | some@one@example.com | EmailAddress.MoreThanOneAt |
        | someone@example      | EmailAddress.NoDomain      |

    Scenario: A registration breaking a rule records nothing
      Given a registration for "someone.example.com"
      When it is sent
      Then nothing is queued to be sent

  Rule: A new address becomes an unconfirmed account, sent a link to confirm it

    Scenario: Registering a new address records an account, found by the address in lower case
      Given a registration for "Someone@Example.com"
      When it is sent
      Then there is an account for "someone@example.com"

    Scenario: The account is not confirmed
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the account for "someone@example.com" is not confirmed

    Scenario: The account is not yet called anything
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the account for "someone@example.com" has no name

    Scenario: The account has no password yet
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the account for "someone@example.com" has no password

    Scenario: The account is found by the address in any case
      Given a registration for "Someone@Example.com"
      When it is sent
      Then there is an account for "SOMEONE@EXAMPLE.COM"

    Scenario: A new address is sent a link to confirm it
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the email "Email.ConfirmAddress" is queued for "Someone@Example.com"

    Scenario: The link is sent to the address as it was typed, not in lower case
      Given a registration for "Someone@Example.com"
      When it is sent
      Then nothing is queued for "someone@example.com"

    Scenario: The email carries a link
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the email queued for "Someone@Example.com" carries a link

    Scenario: The queue is told when that link stops working
      Given a registration for "Someone@Example.com"
      When it is sent
      Then the email queued for "Someone@Example.com" stops working at "2026-09-20T10:00:00Z"

  Rule: An address already registered changes nothing, and is only written to

    Scenario: An address registered and not confirmed is sent the link again
      Given "Someone@Example.com" has an account, not confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the email "Email.ConfirmAddressAgain" is queued for "Someone@Example.com"

    Scenario: Registering an unconfirmed address again records nothing more
      Given "Someone@Example.com" has an account, not confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the account for "someone@example.com" has recorded 1 event

    Scenario: An address registered and confirmed is told somebody tried
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "Someone@Example.com"

    Scenario: Word that somebody tried carries a link to sign in
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the email sent to "Someone@Example.com" links to "/account/sign-in"

    Scenario: That link is made for the site, and does not expire
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the email queued for "Someone@Example.com" is filled with no link
      And the email queued for "Someone@Example.com" never stops working

    Scenario: Registering a confirmed address again records nothing more
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the account for "someone@example.com" has recorded 2 events

    Scenario: An address that differs only in case is the same address
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "SOMEONE@example.com"
      When it is sent
      Then there is one account for "someone@example.com"

    Scenario: The email goes to the address the account holds, not the one typed
      Given "Someone@Example.com" has an account, confirmed
      And a registration for "SOMEONE@example.com"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "Someone@Example.com"
      And nothing is queued for "SOMEONE@example.com"

  Rule: An account is sent at most 3 emails an hour by registering

    Scenario: A confirmed account registered 3 times in an hour is sent nothing more
      Given "Someone@Example.com" has an account, confirmed
      And "Someone@Example.com" has been registered 3 times in the last hour
      And a registration for "Someone@Example.com"
      When it is sent
      Then nothing more is queued for "Someone@Example.com"

    Scenario: An address written another way counts toward the same limit
      Given "Someone@Example.com" has an account, confirmed
      And "Someone@Example.com" has been registered 3 times in the last hour
      And a registration for "SOMEONE@example.com"
      When it is sent
      Then nothing more is queued to be sent, to any address

    Scenario: New links sent for an expired one count toward the limit
      Given "Someone@Example.com" has an account, not confirmed
      And the link has been sent again to "Someone@Example.com" 3 times in the last hour
      And a registration for "Someone@Example.com"
      When it is sent
      Then nothing more is queued for "Someone@Example.com"

    Scenario: The emails registering sends count toward its own limit
      Given "Someone@Example.com" has an account, confirmed
      When a registration for "Someone@Example.com" is sent
      And a registration for "Someone@Example.com" is sent
      And a registration for "Someone@Example.com" is sent
      And a registration for "Someone@Example.com" is sent
      Then 3 emails are queued for "Someone@Example.com"

    Scenario: Registrations sent at once count toward the limit together
      Given "Someone@Example.com" has an account, confirmed
      When 8 registrations for "Someone@Example.com" are sent at once
      Then 3 emails are queued for "Someone@Example.com"

    Scenario: None of those sent at once is refused
      Given "Someone@Example.com" has an account, confirmed
      When 8 registrations for "Someone@Example.com" are sent at once
      Then none of them was refused

    Scenario: Past the limit, registering answers as it always does
      Given "taken@example.com" has an account, confirmed
      And "taken@example.com" has been registered 3 times in the last hour
      When a registration for "new@example.com" is sent
      And a registration for "taken@example.com" is sent
      Then the two answers are the same

    Scenario: An hour later, registering sends again
      Given "Someone@Example.com" has an account, confirmed
      And "Someone@Example.com" has been registered 3 times in the last hour
      And an hour and a minute have passed
      And a registration for "Someone@Example.com"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "Someone@Example.com"

  Rule: Registering answers the same whoever the address belongs to

    Scenario: A new address and one already confirmed get the same answer
      Given "taken@example.com" has an account, confirmed
      When a registration for "new@example.com" is sent
      And a registration for "taken@example.com" is sent
      Then the two answers are the same

    Scenario: A new address and one not yet confirmed get the same answer
      Given "taken@example.com" has an account, not confirmed
      When a registration for "new@example.com" is sent
      And a registration for "taken@example.com" is sent
      Then the two answers are the same

  Rule: The account and its email are kept together, or neither is

    Scenario: An email is not queued for an account that was not recorded
      Given a registration for "Someone@Example.com"
      And recording the account will fail
      When it is sent
      Then there is no account for "someone@example.com"
      And nothing is queued to be sent

  Rule: A registration sent twice registers once

    Scenario: The same request sent twice records one account
      Given a registration for "Someone@Example.com"
      When it is sent
      And it is sent again with the same request id
      Then there is one account for "someone@example.com"
      And one email is queued for "Someone@Example.com"

    Scenario: The same request sent twice answers the same both times
      Given a registration for "Someone@Example.com"
      When it is sent
      And it is sent again with the same request id
      Then the two answers are the same

    Scenario: Two registrations for the same new address at once record one account
      Given a registration for "Someone@Example.com"
      And another registration for "Someone@Example.com"
      When the two are sent at once
      Then there is one account for "someone@example.com"

    Scenario: Two registrations at once for the same new address in different cases record one account
      Given a registration for "Someone@Example.com"
      And another registration for "SOMEONE@example.com"
      When the two are sent at once
      Then there is one account for "someone@example.com"

    Scenario: Neither of them is refused
      Given a registration for "Someone@Example.com"
      And another registration for "Someone@Example.com"
      When the two are sent at once
      Then neither of them was refused

    Scenario: The one that did not make the account writes to it
      Given a registration for "Someone@Example.com"
      And another registration for "Someone@Example.com"
      When the two are sent at once
      Then the email "Email.ConfirmAddress" is queued for "Someone@Example.com"
      And the email "Email.ConfirmAddressAgain" is queued for "Someone@Example.com"

    Scenario: Neither of them is answered with anything about the address being taken
      Given a registration for "Someone@Example.com"
      And another registration for "Someone@Example.com"
      When the two are sent at once
      Then neither answer names "AccountsByEmailAddress.AddressTaken"
