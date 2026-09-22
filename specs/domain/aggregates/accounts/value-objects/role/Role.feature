Feature: The roles an account can hold

  An account can hold two roles, Administrator and World Ranking Officer
  (`addRole.feature`). Each is kept in the account's stream by a spelling of
  its own, "administrator" and "world-ranking-officer", and that spelling is
  kept for good: a stream written years ago has to be read back as it was
  written, so a role once kept is never spelled another way.

  What is read back from a stream came from a table something else could have
  written to, so a kept role is taken exactly as it is written and anything
  that is not one of the two is not a role, rather than the nearest one.
  "Administrator" is how a reader sees the role, not how it is kept.

  Rule: There are two roles

    Scenario: Every role is listed
      When every role is listed
      Then there are 2 roles

    Scenario Outline: Each role is among them
      When every role is listed
      Then "<kept>" is one of the roles

      Examples:
        | kept                  |
        | administrator         |
        | world-ranking-officer |

  Rule: A role is read back only as it is kept

    Scenario Outline: A role as it is kept is a role
      When "<kept>" is read back as a role
      Then it is a role

      Examples:
        | kept                  |
        | administrator         |
        | world-ranking-officer |

    Scenario Outline: Anything else is not a role
      When "<written>" is read back as a role
      Then it is not a role

      Examples:
        | written               |
        | Administrator         |
        | World Ranking Officer |
        | world ranking officer |
        | admin                 |
        |                       |
