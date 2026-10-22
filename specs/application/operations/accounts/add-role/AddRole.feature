@postgres
Feature: Giving an account a role

  An administrator gives somebody the Administrator role or the World Ranking
  Officer role from the accounts page (`accounts.feature`), and the account
  they are signed in to is who gave it. Only an administrator can: anybody
  else is refused with `Account.NotAnAdministrator`. A forgotten account holds
  no role (`asker.feature`), so it is refused the same way.

  Whoever is given the role is named by their email address, since that is
  what the administrator asking knows of them. It is taken as an email address
  is wherever one is typed, and one that breaks an email address's rules is
  refused with `Request.Invalid` and the first rule it breaks. An address with
  no confirmed account is refused as `AddRole.NoSuchAccount`, whether nobody
  has registered it, it is waiting to be confirmed, or its account has been
  forgotten, as an address that cannot be made a manager is
  (`AddManager.feature`). A role there is not is refused as
  `AddRole.NoSuchRole`.

  Giving a role to an account that already holds it records nothing
  (`addRole.feature`). Nothing is emailed: a role changes what the account can
  do, and nothing about how it is reached.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's accounts
    And the moment "2026-10-07T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: The account given a role holds it

    Scenario Outline: The account given a role holds it
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "<role>"
      Then the account for "someone@example.com" holds the role "<role>"

      Examples:
        | role                     |
        | Administrator            |
        | AC World Ranking Officer |
        | GC World Ranking Officer |

    Scenario: Giving a role is recorded as done by whoever asked
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "AC World Ranking Officer"
      Then the last thing the account for "someone@example.com" recorded was caused by the account for "admin@example.com"

    Scenario: An email address typed in capitals names the same account
      When the reader signed in to the account for "admin@example.com" gives "SOMEONE@EXAMPLE.COM" the role "AC World Ranking Officer"
      Then the account for "someone@example.com" holds the role "AC World Ranking Officer"

    Scenario: Giving a role emails nothing
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "AC World Ranking Officer"
      Then nothing is queued to be sent

  Rule: Only an address with a confirmed account can be given a role

    Scenario: An address nobody has registered is refused
      When the reader signed in to the account for "admin@example.com" gives "nobody@example.com" the role "AC World Ranking Officer"
      Then it is refused with "AddRole.NoSuchAccount"

    Scenario: An address waiting to be confirmed is refused the same way
      Given "waiting@example.com" has an account, not confirmed
      When the reader signed in to the account for "admin@example.com" gives "waiting@example.com" the role "AC World Ranking Officer"
      Then it is refused with "AddRole.NoSuchAccount"

    Scenario: The address of a forgotten account is refused the same way
      Given the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "AC World Ranking Officer"
      Then it is refused with "AddRole.NoSuchAccount"

    Scenario: An address that is not one is refused for it
      When the reader signed in to the account for "admin@example.com" gives "someone" the role "AC World Ranking Officer"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "EmailAddress.NoAt"

  Rule: Only a role there is can be given

    Scenario: A role there is not is refused
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "Tournament Director"
      Then it is refused with "AddRole.NoSuchRole"

  Rule: Only an administrator can give a role

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" gives "someone@example.com" the role "Administrator"
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: A world ranking officer is refused
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "someone@example.com" gives "someone@example.com" the role "Administrator"
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: An account the role was taken from is refused
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" gives "someone@example.com" the role "AC World Ranking Officer"
      Then it is refused with "Account.NotAnAdministrator"
