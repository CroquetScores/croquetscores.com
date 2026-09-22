Feature: Removing a role from an account

  A role added to an account (`addRole.feature`) can be taken away again.
  Removing it is an event of its own, saying which role was removed and, as
  adding one does, who removed it. Removing one role leaves the other as it
  was.

  An account that does not hold a role has nothing to lose: removing it
  records nothing, so that a request sent twice leaves one event and not two,
  and an account that never held the role is not refused for it. That holds
  for an account that is not confirmed too, since it cannot hold one.

  A forgotten account is refused with `Account.Forgotten`, as it is for
  everything else: it holds no role to remove (`forget.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"
    And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7"

  Rule: Removing a role records it, and the account then does not hold it

    Scenario Outline: Removing a role records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the role "<role>" is removed from the account
      Then it has recorded 1 event
      And the first thing it recorded is its losing a role

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: What removing a role recorded says which role was removed
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the role "<role>" is removed from the account
      Then its losing a role says the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: What removing a role recorded says who removed it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And the account is rebuilt from the stream
      When the role "Administrator" is removed from the account
      Then what it recorded was caused by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario Outline: An account a role was removed from does not hold it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the role "<role>" is removed from the account
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: An account rebuilt after a role was removed does not hold it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the role "<role>" was removed from it
      When the account is rebuilt from the stream
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

  Rule: Removing one role leaves the other

    Scenario Outline: Removing one role keeps the other
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And the role "World Ranking Officer" was added to it
      And the account is rebuilt from the stream
      When the role "<removed>" is removed from the account
      Then the account holds the role "<kept>"

      Examples:
        | removed               | kept                  |
        | Administrator         | World Ranking Officer |
        | World Ranking Officer | Administrator         |

  Rule: Removing a role the account does not hold records nothing

    Scenario Outline: Removing a role the account never held records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "<role>" is removed from the account
      Then it has recorded 0 events

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: Removing a role already removed records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And the role "Administrator" was removed from it
      And the account is rebuilt from the stream
      When the role "Administrator" is removed from the account
      Then it has recorded 0 events

    Scenario: Removing a role from an account that is not confirmed records nothing
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the role "Administrator" is removed from the account
      Then it has recorded 0 events

  Rule: A role is not removed from a forgotten account

    Scenario: Removing a role from a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And it was forgotten
      And the account is rebuilt from the stream
      When the role "Administrator" is removed from the account
      Then it is refused with "Account.Forgotten"
