Feature: Adding a role to an account

  An account can hold two roles: Administrator and World Ranking Officer. Each
  lets whoever holds it do something an account without it cannot, and each
  is held or not on its own: holding one says nothing about the other.

  Adding a role is an event of its own, saying which role was added, so that
  rebuilding the account from its stream gives the roles it holds now. Unlike
  every other account event, it is caused by somebody other than whoever the
  account is: a role is given, not taken, so what is recorded says who gave
  it. Whether whoever asks may give it is not the account's to decide, since
  the account knows nothing of anyone else's roles; that is specified with
  the command that asks.

  An account brought over from the old site begins with no role, whatever it
  held there, and is given the roles it keeps the same way, by whatever
  brings it over: being brought over says what the account was, and a role
  is something given to it here.

  An account holds a role once: adding a role it already holds records
  nothing, so that a request sent twice leaves one event and not two.

  An account whose email address is not confirmed is refused with
  `Account.NotConfirmed`: nobody has yet shown that the address is theirs, and
  a role given to it would be given to whoever turns out to own it. A
  forgotten account is refused with `Account.Forgotten`, as it is for
  everything else.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"
    And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7"

  Rule: Adding a role records it, and the account then holds it

    Scenario Outline: Adding a role records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "<role>" is added to the account
      Then it has recorded 1 event
      And the first thing it recorded is its being given a role

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: What adding a role recorded says which role was added
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "<role>" is added to the account
      Then its being given a role says the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: What adding a role recorded says who gave it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "Administrator" is added to the account
      Then what it recorded was caused by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario Outline: An account a role was added to holds it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "<role>" is added to the account
      Then the account holds the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: A role is added to an account brought over from the old site
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the role "<role>" is added to the account
      Then the account holds the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: An account rebuilt after a role was added holds it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      When the account is rebuilt from the stream
      Then the account holds the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

  Rule: Holding one role says nothing about the other

    Scenario Outline: Adding one role does not add the other
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the role "<added>" is added to the account
      Then the account does not hold the role "<other>"

      Examples:
        | added                 | other                 |
        | Administrator         | World Ranking Officer |
        | World Ranking Officer | Administrator         |

    Scenario: An account can hold both roles
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And the role "World Ranking Officer" was added to it
      When the account is rebuilt from the stream
      Then the account holds the role "Administrator"
      And the account holds the role "World Ranking Officer"

  Rule: A role is added once

    Scenario Outline: Adding a role the account holds records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the role "<role>" is added to the account
      Then it has recorded 0 events

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

  Rule: A role is added only to a confirmed account that is not forgotten

    Scenario: Adding a role to an account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the role "Administrator" is added to the account
      Then it is refused with "Account.NotConfirmed"

    Scenario: Adding a role to an account that is not confirmed records nothing
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the role "Administrator" is added to the account
      Then it has recorded 0 events

    Scenario: Adding a role to a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the role "Administrator" is added to the account
      Then it is refused with "Account.Forgotten"
