Feature: Registering an account

  An account begins as an email address and nothing else. Registering asks for
  no name and no password, because whoever registers has not yet shown the
  address is theirs, and anything kept of what they typed would be kept for
  whoever does turn out to own it: a stranger who registered somebody else's
  address first would have chosen the name on their account, and the password
  to it. So an account begins unconfirmed, unnamed and with no password, and
  is given all three at once, by whoever follows the link sent to the address
  and says who they are (`confirm.feature`).

  The account's own id is given it by whatever registers it, and names its
  stream. Registering is the account's first event, and says everything the
  account began with. Registering is also given a keyed hash of the email
  address, made by whatever registers the account, since the key is the site's
  and not the domain's, and says it, so that anything finding accounts by
  their address can be made from the events alone.

  An account is registered once. Registering its address again, confirmed or
  not, changes nothing about it: what is sent to the address instead is
  specified with registering.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Registering begins an account with an email address and nothing else

    Scenario: Registering records that the account was registered
      When an account is registered at "someone@example.com"
      Then it has recorded 1 event
      And the first thing it recorded is its registering

    Scenario: A registered account is reached at the address it was registered at
      When an account is registered at "someone@example.com"
      Then the account is reached at "someone@example.com"

    Scenario: A registered account is not yet confirmed
      When an account is registered at "someone@example.com"
      Then the account is not confirmed

    Scenario: A registered account is not yet called anything
      When an account is registered at "someone@example.com"
      Then the account has no name

    Scenario: A registered account has no password yet
      When an account is registered at "someone@example.com"
      Then the account has no password

    Scenario Outline: A registered account holds no role
      When an account is registered at "someone@example.com"
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: Registering records the hash of the email address it was given
      When an account is registered at "someone@example.com" with the email address hash "hash-of-someone"
      Then its registering says the email address hash "hash-of-someone"

  Rule: An account rebuilt from its stream is as registering left it

    Scenario: An account rebuilt from its registering is reached where it was registered
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is reached at "someone@example.com"

    Scenario: An account rebuilt from its registering is not confirmed
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is not confirmed

    Scenario: An account rebuilt from its registering has no name
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account has no name

    Scenario: An account rebuilt from its registering has no password
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account has no password
