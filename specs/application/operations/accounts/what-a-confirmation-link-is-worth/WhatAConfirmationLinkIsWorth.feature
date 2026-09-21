@postgres
Feature: What a link to confirm an email address is worth

  Asking what a link is worth is how the page a link opens knows what to put on
  it: the form, when the link would confirm, and otherwise the reason there is
  nothing to fill in. A reader whose link expired while the email sat unread is
  owed that on arrival, rather than after typing a name and a password that
  were never going to be kept.

  It is the question confirming asks itself before it changes anything, asked
  without changing anything. Both ask it of the same place
  (`confirmationLinks.ts`), so what a reader was shown when the page opened and
  what their submission is answered with cannot come to disagree; the scenarios
  below and confirming's are deliberately the same scenarios, once for the
  asking and once for the doing.

  The answers are the codes confirming is refused with — `Link.Expired`,
  `Link.NoLongerWorks`, `Account.AlreadyConfirmed` — and one more,
  `Link.Works`, for the link that would confirm. They are codes rather than
  sentences because what a reader is shown for each is the page's to decide.

  The order they are answered in is the substance of it. A link is only called
  expired once its signature holds and its account is one that could still be
  confirmed: an altered link, or one for a forgotten account, is worth nothing
  however old it is, and a link for an account already confirmed says that
  whatever its age. An expired link is the one refusal that is not the end of
  it — it still shows which account it was sent for, and can be traded for a new
  one — so it is never said of a link that has nothing to trade.

  Nothing is recorded. The account the link names is read and put down again,
  and asking twice answers twice the same.

  These scenarios run against Postgres, with the application's registering and
  its confirming, the event store and read models the two share. The link is
  read out of the email the email queue holds, as a reader reads it out of
  their mail.

  Background:
    Given the application's registering
    And the application's confirming
    And the moment "2026-09-19T10:00:00Z"

  Rule: A link that would confirm is worth confirming

    Scenario: The link registering sent would confirm
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      When what that link is worth is asked
      Then the link is worth "Link.Works"

    Scenario: A link a minute short of 24 hours old would still confirm
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And the moment "2026-09-20T09:59:00Z"
      When what that link is worth is asked
      Then the link is worth "Link.Works"

  Rule: Asking changes nothing

    Scenario: Asking what a link is worth confirms nothing
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      When what that link is worth is asked
      Then the account for "someone@example.com" is not confirmed

    Scenario: Asking twice answers the same
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And what that link is worth has been asked
      When what that link is worth is asked
      Then both askings answer the same

  Rule: A link over 24 hours old has expired

    Scenario: A link a minute over 24 hours old has expired
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And the moment "2026-09-20T10:01:00Z"
      When what that link is worth is asked
      Then the link is worth "Link.Expired"

  Rule: A link that has been altered no longer works

    Scenario: A link whose signature does not match what it carries is worth nothing
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      When what that link is worth is asked
      Then the link is worth "Link.NoLongerWorks"

    Scenario: An altered link is worth nothing whatever its age
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      And the moment "2026-09-20T10:01:00Z"
      When what that link is worth is asked
      Then the link is worth "Link.NoLongerWorks"

  Rule: A link the site made for something else does not confirm

    Scenario: A link to confirm forgetting an account is worth nothing here
      Given "someone@example.com" has an account, not confirmed
      And a link to confirm forgetting the account for "someone@example.com"
      When what that link is worth is asked
      Then the link is worth "Link.NoLongerWorks"

  Rule: A link for an account already confirmed says so

    Scenario: A link for a confirmed account says the address is already confirmed
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And a confirmation with that link
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      And the confirmation has been submitted
      When what that link is worth is asked
      Then the link is worth "Account.AlreadyConfirmed"

    Scenario: An expired link for a confirmed account says the address is already confirmed
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And a confirmation with that link
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      And the confirmation has been submitted
      And the moment "2026-09-20T10:01:00Z"
      When what that link is worth is asked
      Then the link is worth "Account.AlreadyConfirmed"

  Rule: A link for an account that has been forgotten no longer works

    Scenario: A link for a forgotten account is worth nothing
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" has been forgotten
      When what that link is worth is asked
      Then the link is worth "Link.NoLongerWorks"

    Scenario: An expired link for a forgotten account is worth nothing rather than expired
      Given a registration for "someone@example.com" is sent an email
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" has been forgotten
      And the moment "2026-09-20T10:01:00Z"
      When what that link is worth is asked
      Then the link is worth "Link.NoLongerWorks"
