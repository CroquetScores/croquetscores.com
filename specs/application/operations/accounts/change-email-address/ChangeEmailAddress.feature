@postgres
Feature: Moving an account to another email address, asked for and then confirmed

  A reader signed in to an account can move it to another email address. It is
  asked for by the reader signed in, for the account they are signed in to,
  with the password the account has now, and it takes effect only once
  whoever reads mail at the new address has said so. Which account the reader
  is signed in to is the web layer's to say, from the session.

  The password is asked for because being signed in is not enough: a browser
  left signed in would otherwise let whoever picked it up move the account to
  an address of their own, and with it the way back in. It is checked as
  signing in checks it (`SignIn.feature`), before anything is sent, and one
  that is not the account's is refused with `ChangeEmailAddress.WrongPassword`.

  The new address's rules are the command's own, and asked on the way in: the
  rules registering asks (`RegisterAccount.feature`). The address the account
  has already, however it is written, is refused with
  `ChangeEmailAddress.Unchanged`, since there is nowhere to move it.

  An account is only moved to an address its owner has shown they can read, as
  an account is only confirmed at one (`ConfirmEmailAddress.feature`): an
  address mistyped, or somebody else's, must not become the account's, and
  with it every way back in to it. So asking sends a link to the new address,
  and moves nothing.

  Asking answers the same whoever the new address belongs to, and never says
  whether it has an account: which addresses have accounts must not be found
  out by asking to move to them, any more than by registering. An address that
  has an account already is sent an email saying so, in place of a link. An
  address whose account has been forgotten has none, and is sent a link as any
  other would be.

  The link works for 24 hours, as a link to confirm an address does, and once.
  It is made for moving this account to this address and nothing else, and
  says so where it cannot be changed: a link the site made for anything else
  moves nothing, however it is sent. It works only for the account it was sent
  for, and only for a reader signed in to that account. Every refusal of it is
  `Link.NoLongerWorks`, whatever the reason, as forgetting's are
  (`ForgetAccount.feature`): there is nothing to be had for any of them.

  What a link is worth is asked before it is used, so that the page it opens
  can say which address the account will move to without moving it.

  An address may have been given to another account between the asking and
  the confirming, by somebody registering it. Confirming then is refused with
  `ChangeEmailAddress.Taken`, and nothing moves. Saying so tells nobody
  anything they could not find out: whoever confirms has shown they read mail
  at that address, and the account there is theirs to know about.

  Once moved, the account is found by its new address and not its old, and
  the old one is free to be registered again. The old address is sent an email
  saying the account has moved, and to where, so that an owner who did not
  move it finds out while they can still read mail for the account.

  These scenarios run against Postgres, with the application's event store and
  read models and a password hasher, and read the link out of the email the
  email queue holds.

  Background:
    Given the application's changing of email addresses
    And the moment "2026-09-19T10:00:00Z"

  Rule: Asking with the right password sends a link to the new address, and moves nothing

    Scenario: Asking sends a link to confirm the new address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then the email "Email.ConfirmNewEmailAddress" is queued for "sam@example.org"

    Scenario: The link works for 24 hours
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then the email queued for "sam@example.org" stops working at "2026-09-20T10:00:00Z"

    Scenario: Asking moves nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then there is an account for "someone@example.com"

    Scenario: Asking sends nothing to the account's own address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then nothing is queued for "someone@example.com"

  Rule: An address that has an account already is told so, and asking answers the same

    Scenario: Asking to move to an address with an account is answered as any other
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then it is answered without refusal

    Scenario: The address is sent an email saying it has an account already
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then the email "Email.AlreadyHasAnAccount" is queued for "sam@example.org"

    Scenario: The address is sent no link
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then the email "Email.ConfirmNewEmailAddress" is not queued for "sam@example.org"

    Scenario: An address whose account was forgotten is sent a link
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "sam@example.org" has an account, confirmed
      And the account for "sam@example.org" has been forgotten
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then the email "Email.ConfirmNewEmailAddress" is queued for "sam@example.org"

  Rule: A password that is not the account's is refused, and sends nothing

    Scenario: A wrong password is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "not the right password"
      Then it is refused with "ChangeEmailAddress.WrongPassword"

    Scenario: A wrong password sends nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example.org" is asked for by the reader signed in to the account for "someone@example.com", with the password "not the right password"
      Then nothing is queued to be sent

  Rule: The new address must break none of its own rules, and must not be the account's own

    Scenario: An address that breaks a rule is refused for it
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "EmailAddress.NoDomain"

    Scenario Outline: The account's own address is refused, however it is written
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "<address>" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then it is refused with "ChangeEmailAddress.Unchanged"

      Examples:
        | address             |
        | someone@example.com |
        | Someone@Example.com |

    Scenario: The account's own address typed with spaces around it is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "  someone@example.com  " is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then it is refused with "ChangeEmailAddress.Unchanged"

    Scenario: A refused address sends nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When moving to "sam@example" is asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      Then nothing is queued to be sent

  Rule: What a link is worth is said without moving anything

    Scenario: A link that works says the address it moves to
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When what that link is worth is asked, signed in to the account for "someone@example.com"
      Then it is worth moving to "sam@example.org"

    Scenario: Asking what a link is worth moves nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When what that link is worth is asked, signed in to the account for "someone@example.com"
      Then there is an account for "someone@example.com"

    Scenario: A link that does not work is worth nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And 25 hours have passed
      When what that link is worth is asked, signed in to the account for "someone@example.com"
      Then it is worth nothing

  Rule: Confirming with the link, signed in to its account, moves it

    Scenario: The account is found by its new address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is an account for "sam@example.org"

    Scenario: The account is no longer found by its old address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is no account for "someone@example.com"

    Scenario: It is the same account at the new address
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the account for "someone@example.com" is taken hold of
      And moving to "sam@example.org" has been asked for by the reader signed in to that account, with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to that account
      Then the account for "sam@example.org" is that account

    Scenario: The account signs in at its new address with the password it had
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then "correct horse battery staple" is the password of the account for "sam@example.org"

    Scenario: The old address is sent an email saying the account has moved
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then the email "Email.EmailAddressChanged" is queued for "someone@example.com"

    Scenario: The old address can be registered again
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And moving has been confirmed with that link, signed in to the account for "someone@example.com"
      When "someone@example.com" registers
      Then a new account is made for "someone@example.com"

  Rule: A link works once, for 24 hours, for its own account, and for nothing else

    Scenario: A link used after 23 hours still works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And 23 hours have passed
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is an account for "sam@example.org"

    Scenario: A link used after 25 hours no longer works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And 25 hours have passed
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link does not work twice
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the account for "someone@example.com" is taken hold of
      And moving to "sam@example.org" has been asked for by the reader signed in to that account, with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And moving has been confirmed with that link, signed in to that account
      When moving is confirmed with that link, signed in to that account
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link used signed in to another account no longer works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "other@example.com" has an account, confirmed
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "other@example.com"
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link used signed in to another account moves neither
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And "other@example.com" has an account, confirmed
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      When moving is confirmed with that link, signed in to the account for "other@example.com"
      Then there is no account for "sam@example.org"

    Scenario: A link to confirm an email address moves nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And a link to confirm the email address, sent to "someone@example.com"
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is refused with "Link.NoLongerWorks"

  Rule: An address given to another account meanwhile is not moved to

    Scenario: Confirming is refused when the address has been registered since
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And "sam@example.org" has an account, confirmed
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is refused with "ChangeEmailAddress.Taken"

    Scenario: Nothing moves when the address has been registered since
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And "sam@example.org" has an account, confirmed
      When moving is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is an account for "someone@example.com"
