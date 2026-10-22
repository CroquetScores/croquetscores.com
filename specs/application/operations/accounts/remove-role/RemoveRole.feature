@postgres
Feature: Taking a role away from an account

  An administrator takes the Administrator role or the World Ranking Officer
  role away from somebody on the accounts page (`accounts.feature`), and the
  account they are signed in to is who took it. Only an administrator can:
  anybody else is refused with `Account.NotAnAdministrator`.

  Whoever loses the role is named by their account's id, which is how the
  accounts holding it are answered (`AccountsWithRole.feature`). An id with no
  account is refused as `RemoveRole.NoSuchAccount`, and a role there is not as
  `RemoveRole.NoSuchRole`. Taking a role from an account that does not hold it
  records nothing (`removeRole.feature`).

  An administrator cannot take the Administrator role from themselves, and is
  refused with `RemoveRole.Yourself`. Taking it would take away their own way
  back to the page they took it on, and nobody on that page could undo it for
  them; and the last administrator taking it from themselves would leave the
  site with none, which only the database could then undo. So the accounts
  page does not offer it (`accounts.feature`), and asking anyway is refused.
  Another administrator can take it from them.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's accounts
    And the moment "2026-10-07T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: The account a role is taken from no longer holds it

    Scenario Outline: The account a role is taken from no longer holds it
      Given "someone@example.com" has been given the role "<role>"
      When the reader signed in to the account for "admin@example.com" takes the role "<role>" from "someone@example.com"
      Then the account for "someone@example.com" does not hold the role "<role>"

      Examples:
        | role                     |
        | Administrator            |
        | AC World Ranking Officer |
        | GC World Ranking Officer |

    Scenario: Taking one role leaves the other
      Given "someone@example.com" has been given the role "Administrator"
      And "someone@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "admin@example.com" takes the role "AC World Ranking Officer" from "someone@example.com"
      Then the account for "someone@example.com" holds the role "Administrator"

    Scenario: Taking a role is recorded as done by whoever asked
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "admin@example.com" takes the role "AC World Ranking Officer" from "someone@example.com"
      Then the last thing the account for "someone@example.com" recorded was caused by the account for "admin@example.com"

    Scenario: An administrator can take a world ranking officer's role from themselves
      Given "admin@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "admin@example.com" takes the role "AC World Ranking Officer" from "admin@example.com"
      Then the account for "admin@example.com" does not hold the role "AC World Ranking Officer"

  Rule: An administrator cannot take the Administrator role from themselves

    Scenario: Taking the Administrator role from oneself is refused
      When the reader signed in to the account for "admin@example.com" takes the role "Administrator" from "admin@example.com"
      Then it is refused with "RemoveRole.Yourself"

    Scenario: Another administrator can take it
      Given "someone@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "someone@example.com" takes the role "Administrator" from "admin@example.com"
      Then the account for "admin@example.com" does not hold the role "Administrator"

  Rule: Two administrators taking the role from each other at once leave one

    Refusing an administrator who takes the role from themselves is not
    enough to keep the site from being left with none: two administrators,
    the last two, could each take it from the other at the same moment. Each
    would be asked whether it was an administrator before the other had taken
    it, and each would go on. So taking the Administrator role waits for any
    other taking of it to be done, and only then asks whether whoever asks
    still holds it. The second is refused with `Account.NotAnAdministrator`,
    as it would be had it asked a moment later.

    Scenario: One of the two is refused
      Given "someone@example.com" has been given the role "Administrator"
      And the reader signed in to the account for "admin@example.com" is to take the role "Administrator" from "someone@example.com"
      And the reader signed in to the account for "someone@example.com" is to take the role "Administrator" from "admin@example.com"
      When both are asked for at once
      Then one of them is refused with "Account.NotAnAdministrator"

    Scenario: One administrator is left
      Given "someone@example.com" has been given the role "Administrator"
      And the reader signed in to the account for "admin@example.com" is to take the role "Administrator" from "someone@example.com"
      And the reader signed in to the account for "someone@example.com" is to take the role "Administrator" from "admin@example.com"
      When both are asked for at once
      Then 1 of "admin@example.com" and "someone@example.com" holds the role "Administrator"

  Rule: Only an account there is can have a role taken from it

    Scenario: An account there is not is refused
      When the reader signed in to the account for "admin@example.com" takes the role "AC World Ranking Officer" from an account there is not
      Then it is refused with "RemoveRole.NoSuchAccount"

  Rule: Only a role there is can be taken

    Scenario: A role there is not is refused
      When the reader signed in to the account for "admin@example.com" takes the role "Tournament Director" from "someone@example.com"
      Then it is refused with "RemoveRole.NoSuchRole"

  Rule: Only an administrator can take a role away

    Scenario: A reader who is not an administrator is refused
      Given "someone@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "someone@example.com" takes the role "AC World Ranking Officer" from "someone@example.com"
      Then it is refused with "Account.NotAnAdministrator"
