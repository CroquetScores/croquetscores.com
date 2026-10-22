@postgres
Feature: The accounts holding a role, as an administrator lists them

  An administrator lists the accounts holding a role to see who holds it and to
  take it from one of them (`accounts.feature`), so the application answers
  with every account that holds it, by name, in alphabetical order, since a
  list of people is looked down for a name. Each is answered with its
  account's id, which is what taking the role names it by
  (`RemoveRole.feature`), and its name, which is what a reader knows somebody
  by. A name changed is answered as it is now.

  The administrator asking is left out of the administrators, since the list
  is for taking the role away and they cannot take it from themselves
  (`RemoveRole.Yourself`). They are answered among the world ranking officers
  where they hold that role, since they can take that from themselves.

  A forgotten account holds no role, so it is never answered. Only an
  administrator can ask: anybody else is refused with
  `Account.NotAnAdministrator`. A role there is not is refused as
  `AccountsWithRole.NoSuchRole`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's accounts
    And the moment "2026-10-07T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "other@example.com" has an account, confirmed, called "Alex Another"

  Rule: Every account holding the role is answered, by name

    Scenario Outline: An account given the role is answered
      Given "someone@example.com" has been given the role "<role>"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "<role>"
      Then the account "Sam Someone" is answered

      Examples:
        | role                     |
        | Administrator            |
        | AC World Ranking Officer |
        | GC World Ranking Officer |

    Scenario: An account without the role is not answered
      Given "someone@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then the account "Sam Someone" is not answered

    Scenario: An account the role was taken from is not answered
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      And "someone@example.com" has had the role "AC World Ranking Officer" taken away
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then the account "Sam Someone" is not answered

    Scenario: The accounts are answered in alphabetical order
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then the first account answered is "Alex Another"

    Scenario: A name changed is answered as it is now
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      And the reader signed in to the account for "someone@example.com" changes its name to "Samantha Someone"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then the account "Samantha Someone" is answered

  Rule: The administrator asking is not among the administrators

    Scenario: The administrator asking is not answered among the administrators
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "Administrator"
      Then the account "Ada Administrator" is not answered

    Scenario: Another administrator is answered
      Given "someone@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "Administrator"
      Then the account "Sam Someone" is answered

    Scenario: The administrator asking is answered among the world ranking officers
      Given "admin@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then the account "Ada Administrator" is answered

  Rule: A forgotten account is not answered

    Scenario: A forgotten account is not answered
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then no account is answered

  Rule: Only an administrator can list them, of a role there is

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" lists the accounts with the role "AC World Ranking Officer"
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: A role there is not is refused
      When the reader signed in to the account for "admin@example.com" lists the accounts with the role "Tournament Director"
      Then it is refused with "AccountsWithRole.NoSuchRole"
