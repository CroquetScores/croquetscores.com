@postgres
Feature: Registering an account

  Registering is asked for with a name, an email address and a password, and
  by nobody signed in. Its rules are the name's, the address's and the
  password's own, and that the password was typed the same twice; a request
  that breaks any is refused with every rule it broke, before anything else
  is done.

  Whether the address already has an account must never show in the answer.
  So registering answers the same whoever the address belongs to, and takes as
  long: the password is hashed whether or not an account is made with it,
  since hashing is slow on purpose and an answer that came back sooner for a
  registered address would say it was one. What differs is only what is sent
  to the address, which only its owner reads:

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

  Every email goes to the address as the account holds it, not as this
  registration typed it. An address differing only in case is the same
  address, but not every mail host thinks so, and writing to the casing a
  stranger typed would be writing somewhere the account's owner may not read.

  The password is checked against those known to have been breached, by
  asking an outside service. A password found there is refused like any other
  broken rule, and is refused after the rules that need nobody asked: the
  check is a request over the network, and there is no sense making it for a
  password that was already too short. When the service cannot be reached,
  nothing is recorded and nothing is sent, and the request is refused as
  unable to go on, so that whoever asked can say registering is suspended for
  now, and tell the administrator.

  The email is not sent from here. It is put in a queue, in the same
  transaction as the account, so that an account is never recorded without its
  email, nor an email sent for an account that was not. What sends it is
  specified with the queue. An email carrying a link is queued with the moment
  that link stops working, so that the queue never sends one that had expired
  before it went.

  Registering an address that already has an account sends it an email every
  time, and nothing about the answer may say when that stops. So an account is
  sent at most 3 emails an hour by registering, counted with the links sent
  again from signing in and the new confirmation link page, since all of them
  fill the same inbox; past that, registering answers as it always does, takes
  as long as it always does, and sends nothing. The emails are counted by the
  account, not by the address as it was typed, so that writing it another way
  does not count afresh.

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
  read models, a password hasher, and a breached password check the scenario
  can take down and fill with passwords of its choosing.

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

  Rule: A registration that breaks a rule is refused with every rule it broke

    Scenario Outline: A registration breaking one rule is refused for it
      Given a registration for "<address>" as "<name>" with the password "<password>" confirmed as "<confirmation>"
      When it is sent
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And no other rule is broken

      Examples:
        | address             | name        | password                     | confirmation                 | code                         |
        | someone@example.com | Sa          | correct horse battery staple | correct horse battery staple | PersonName.TooShort          |
        | someone.example.com | Sam Someone | correct horse battery staple | correct horse battery staple | EmailAddress.NoAt            |
        | someone@example.com | Sam Someone | too short                    | too short                    | Password.TooShort            |
        | someone@example.com | Sam Someone | correct horse battery staple | correct horse battery stapel | Password.ConfirmationDiffers |

    Scenario: A registration breaking three rules is refused for all three
      Given a registration for "someone.example.com" as "Sa" with the password "too short" confirmed as "too short"
      When it is sent
      Then it is refused with "Request.Invalid"
      And the first rule broken is "PersonName.TooShort"
      And the next rule broken is "EmailAddress.NoAt"
      And the next rule broken is "Password.TooShort"
      And no other rule is broken

    Scenario: A registration breaking a rule records nothing
      Given a registration for "someone@example.com" as "Sa" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then there is no account for "someone@example.com"
      And nothing is queued to be sent

    Scenario: A registration breaking a rule is not checked against breached passwords
      Given a registration for "someone@example.com" as "Sa" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then the breached password check was not asked

  Rule: A new address becomes an unconfirmed account, sent a link to confirm it

    Scenario: Registering a new address records an account
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then there is an account for "someone@example.com"
      And the account for "someone@example.com" is called "Sam Someone"
      And the account for "someone@example.com" is not confirmed

    Scenario: The account keeps a hash of the password, and not the password
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then "correct horse battery staple" is the password of the account for "someone@example.com"
      And nothing kept for the account contains "correct horse battery staple"

    Scenario: A new address is sent a link to confirm it
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then the email "Email.ConfirmAddress" is queued for "someone@example.com"

    Scenario: The email carries a link
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then the email queued for "someone@example.com" carries a link

    Scenario: The queue is told when that link stops working
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then the email queued for "someone@example.com" stops working at "2026-09-20T10:00:00Z"

  Rule: An address already registered changes nothing, and is only written to

    Scenario: An address registered and not confirmed is sent the link again
      Given "someone@example.com" has an account, not confirmed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email "Email.ConfirmAddressAgain" is queued for "someone@example.com"

    Scenario: An account not confirmed is not changed
      Given "someone@example.com" has an account, not confirmed
      And that account is called "Sam Someone"
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the account for "someone@example.com" is called "Sam Someone"
      And "another long password" is not the password of the account for "someone@example.com"

    Scenario: An address registered and confirmed is told somebody tried
      Given "someone@example.com" has an account, confirmed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "someone@example.com"

    Scenario: Word that somebody tried carries a link to sign in
      Given "someone@example.com" has an account, confirmed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email sent to "someone@example.com" links to "/account/sign-in"

    Scenario: That link is made for the site, and does not expire
      Given "someone@example.com" has an account, confirmed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email queued for "someone@example.com" is filled with no link
      And the email queued for "someone@example.com" never stops working

    Scenario: A confirmed account is not changed
      Given "someone@example.com" has an account, confirmed
      And that account is called "Sam Someone"
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the account for "someone@example.com" is called "Sam Someone"
      And "another long password" is not the password of the account for "someone@example.com"

    Scenario: An address that differs only in case is the same address
      Given "someone@example.com" has an account, confirmed
      And a registration for "Someone@Example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then there is one account for "someone@example.com"

    Scenario: The email goes to the address the account holds, not the one typed
      Given "someone@example.com" has an account, confirmed
      And a registration for "Someone@Example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "someone@example.com"
      And nothing is queued for "Someone@Example.com"

  Rule: An account is sent at most 3 emails an hour by registering

    Scenario: A confirmed account registered 3 times in an hour is sent nothing more
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then nothing more is queued for "someone@example.com"

    Scenario: An address written another way counts toward the same limit
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      And a registration for "SOMEONE@Example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then nothing more is queued to be sent, to any address

    Scenario: Links sent again from signing in count toward the limit
      Given "someone@example.com" has an account, not confirmed
      And the link has been sent again to "someone@example.com" 3 times in the last hour
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then nothing more is queued for "someone@example.com"

    Scenario: The emails registering sends count toward its own limit
      Given "someone@example.com" has an account, confirmed
      When a registration for "someone@example.com" is sent
      And a registration for "someone@example.com" is sent
      And a registration for "someone@example.com" is sent
      And a registration for "someone@example.com" is sent
      Then 3 emails are queued for "someone@example.com"

    Scenario: Past the limit, registering answers as it always does
      Given "taken@example.com" has an account, confirmed
      And "taken@example.com" has been registered 3 times in the last hour
      When a registration for "new@example.com" is sent
      And a registration for "taken@example.com" is sent
      Then the two answers are the same

    Scenario: Past the limit, the password is hashed all the same
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then "another long password" was hashed

    Scenario: An hour later, registering sends again
      Given "someone@example.com" has an account, confirmed
      And "someone@example.com" has been registered 3 times in the last hour
      And an hour and a minute have passed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then the email "Email.AlreadyRegistered" is queued for "someone@example.com"

  Rule: Registering answers the same whoever the address belongs to

    Scenario: A new address and one already registered get the same answer
      Given "taken@example.com" has an account, confirmed
      When a registration for "new@example.com" is sent
      And a registration for "taken@example.com" is sent
      Then the two answers are the same

    Scenario: The password is hashed for an address already registered
      Given "someone@example.com" has an account, confirmed
      And a registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When it is sent
      Then "another long password" was hashed

  Rule: A breached password is refused, and an unreachable check suspends registering

    Scenario: A password known to have been breached is refused
      Given "correct horse battery staple" is known to have been breached
      And a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: Registering when the breached password check cannot be reached cannot go on
      Given the breached password check cannot be reached
      And a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then it is refused with "BreachedPasswords.Unreachable"

    Scenario: Nothing is recorded or sent when the check cannot be reached
      Given the breached password check cannot be reached
      And a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      Then there is no account for "someone@example.com"
      And nothing is queued to be sent

  Rule: The account and its email are kept together, or neither is

    Scenario: An email is not queued for an account that was not recorded
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      And recording the account will fail
      When it is sent
      Then there is no account for "someone@example.com"
      And nothing is queued to be sent

  Rule: A registration sent twice registers once

    Scenario: The same request sent twice records one account
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      And it is sent again with the same request id
      Then there is one account for "someone@example.com"
      And one email is queued for "someone@example.com"

    Scenario: The same request sent twice answers the same both times
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      When it is sent
      And it is sent again with the same request id
      Then the two answers are the same

    Scenario: Two registrations for the same new address at once record one account
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      And another registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When the two are sent at once
      Then there is one account for "someone@example.com"

    Scenario: Neither of them is refused
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      And another registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When the two are sent at once
      Then neither of them was refused

    Scenario: The one that did not make the account writes to it
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      And another registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When the two are sent at once
      Then the email "Email.ConfirmAddress" is queued for "someone@example.com"
      And the email "Email.ConfirmAddressAgain" is queued for "someone@example.com"

    Scenario: Neither of them is answered with anything about the address being taken
      Given a registration for "someone@example.com" as "Sam Someone" with the password "correct horse battery staple" confirmed as "correct horse battery staple"
      And another registration for "someone@example.com" as "Somebody Else" with the password "another long password" confirmed as "another long password"
      When the two are sent at once
      Then neither answer names "AccountsByEmailAddress.AddressTaken"
