@postgres
Feature: Changing what an account is called

  A reader signed in to an account can change what it is called. It is asked
  for by the reader signed in, for the account they are signed in to, and for
  no other: which account that is, is the web layer's to say, from the session.

  The name's rules are the command's own, and asked on the way in, as every
  command's are: they are the rules confirming asks (`ConfirmEmailAddress.feature`),
  since it is the same name. A name is trimmed wherever one is made from what a
  command carries.

  A name the account has already is not changed to: nothing is recorded,
  because nothing happened, and the account's history is what happened to it.
  Nothing is emailed either way.

  An account that has been forgotten is not called anything any more, and is
  refused with `Account.Forgotten`: a session is ended when its account is
  forgotten, so this is a signing in that raced the forgetting, and there is
  no name left to change.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's changing of names
    And the moment "2026-09-19T10:00:00Z"

  Rule: A sound name is kept

    Scenario: The account is called the new name
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Samantha Someone"
      Then the account for "someone@example.com" is called "Samantha Someone"

    Scenario: A name typed with spaces around it is kept without them
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "  Samantha Someone  "
      Then the account for "someone@example.com" is called "Samantha Someone"

    Scenario: Changing the name is recorded on the account
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Samantha Someone"
      Then the last thing the account for "someone@example.com" recorded is its name being changed

    Scenario: Changing the name emails nothing
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Samantha Someone"
      Then nothing is queued to be sent

  Rule: A name the account has already records nothing

    Scenario: The same name is not recorded
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Sam Someone"
      Then the account for "someone@example.com" has recorded no change of its name

    Scenario: The same name is not refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Sam Someone"
      Then it is answered with the account for "someone@example.com"

  Rule: The name must break none of its own rules

    Scenario Outline: A name that breaks a rule is refused for it
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "<name>"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name | code                |
        |      | PersonName.Missing  |
        | Sa   | PersonName.TooShort |

    Scenario: A name that breaks a rule changes nothing
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes its name to "Sa"
      Then the account for "someone@example.com" is called "Sam Someone"

  Rule: A forgotten account has no name to change

    Scenario: A forgotten account is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to that account changes its name to "Samantha Someone"
      Then it is refused with "Account.Forgotten"
