Feature: Bringing an account over from the old site

  An account brought over from the old site does not begin the way a
  registered one does (`register.feature`). It was somebody's before this site
  was, so it begins with the name it had there, the hash of the password it
  had there, marked as the old site's, and confirmed: its owner gets in with
  the password they already have, and a link to confirm would ask them to
  choose a name and a password they chose long ago. Being brought over is an
  event of its own, and an account's first, as registering is.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: An account brought over from the old site begins named, confirmed, and with its old password

    Scenario: Bringing an account over records it
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then it has recorded 1 event
      And the first thing it recorded is its being brought over

    Scenario: An account brought over is called what it was called there
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is called "Sam Someone"

    Scenario: An account brought over is reached at the address it had there
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is reached at "someone@example.com"

    Scenario: An account brought over is confirmed
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is confirmed

    Scenario: An account brought over has the password hash it had there
      When an account is brought over as "Sam Someone" at "someone@example.com" with the password hash "hash-from-the-old-site"
      Then the account's password hash is "hash-from-the-old-site"

    Scenario Outline: An account brought over holds no role
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: Being brought over records the hash of the email address it was given
      When an account is brought over as "Sam Someone" at "someone@example.com" with the email address hash "hash-of-someone"
      Then its being brought over says the email address hash "hash-of-someone"

    Scenario: An account rebuilt from its being brought over is confirmed
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is confirmed
