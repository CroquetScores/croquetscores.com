@postgres
Feature: Forgetting an account, asked for and then confirmed

  A reader signed in to an account can have it forgotten: its name and email
  address made unreadable for good, by deleting the account's own key, with
  every one of its events left where it was (`forget.feature`). It cannot be
  undone, so it is asked for twice over.

  The first asking is signed in, and sends a link to the account's own email
  address, which works for 15 minutes. So whoever asks has to be able to read
  the account's email as well as be signed in to it. The second is following
  that link, signed in to the same account, and saying so.

  The link is short because what it does cannot be undone, and one that sat in
  an inbox for days would be a way to forget the account for whoever came
  across it. It is made for forgetting and nothing else: a link the site made
  for anything else forgets nothing, however it is sent. And it works only for
  the account it was sent for, and only for a reader signed in to that account:
  followed signed in as somebody else, it forgets nothing.

  Every refusal is `Link.NoLongerWorks`, whether the link has expired, was
  altered, was made for something else, or names another account than the
  reader's. There is nothing to be had for any of them — a new link is asked
  for from the account, not traded for an old one — so there is nothing to
  tell them apart for.

  Forgetting answers with the account forgotten, so that whoever asked can end
  every session it has: the account can no longer be signed in to at all, and
  a browser still holding a session for it should not look as though it were.

  These scenarios run against Postgres, with the application's event store and
  read models, and read the link out of the email the email queue holds.

  Background:
    Given the application's forgetting of accounts
    And the moment "2026-09-19T10:00:00Z"

  Rule: Asking sends a link to the account's own address, and forgets nothing

    Scenario: Asking sends a link to confirm forgetting
      Given "someone@example.com" has an account, confirmed
      When forgetting is asked for by the reader signed in to the account for "someone@example.com"
      Then the email "Email.ConfirmForgetting" is queued for "someone@example.com"

    Scenario: The link works for 15 minutes
      Given "someone@example.com" has an account, confirmed
      When forgetting is asked for by the reader signed in to the account for "someone@example.com"
      Then the email queued for "someone@example.com" stops working at "2026-09-19T10:15:00Z"

    Scenario: Asking forgets nothing
      Given "someone@example.com" has an account, confirmed
      When forgetting is asked for by the reader signed in to the account for "someone@example.com"
      Then there is an account for "someone@example.com"

  Rule: Confirming with the link, signed in to its account, forgets it

    Scenario: The account is forgotten
      Given "someone@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When forgetting is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is no account for "someone@example.com"

    Scenario: Forgetting answers with the account forgotten
      Given "someone@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" is taken hold of
      When forgetting is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is answered with that account

  Rule: The link works once, for 15 minutes, and for its own account signed in

    Scenario: A link a minute short of 15 minutes old forgets the account
      Given "someone@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the moment "2026-09-19T10:14:00Z"
      When forgetting is confirmed with that link, signed in to the account for "someone@example.com"
      Then there is no account for "someone@example.com"

    Scenario: A link a minute over 15 minutes old is refused
      Given "someone@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the moment "2026-09-19T10:16:00Z"
      When forgetting is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link followed signed in to another account is refused
      Given "someone@example.com" has an account, confirmed
      And "other@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When forgetting is confirmed with that link, signed in to the account for "other@example.com"
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link followed signed in to another account forgets neither
      Given "someone@example.com" has an account, confirmed
      And "other@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When forgetting is confirmed with that link, signed in to the account for "other@example.com"
      Then there is an account for "someone@example.com"

    Scenario: A link to confirm an address forgets nothing
      Given "someone@example.com" has an account, confirmed
      And a link to confirm the email address, sent to "someone@example.com"
      When forgetting is confirmed with that link, signed in to the account for "someone@example.com"
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link used once does not work again
      Given "someone@example.com" has an account, confirmed
      And forgetting has been asked for by the reader signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" is taken hold of
      And forgetting has been confirmed with that link, signed in to that account
      When forgetting is confirmed with that link, signed in to that account
      Then it is refused with "Link.NoLongerWorks"
