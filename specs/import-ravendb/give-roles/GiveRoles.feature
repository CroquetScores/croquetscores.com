@postgres
Feature: Giving the site's roles once the users are imported

  An account can hold two roles, Administrator and World Ranking Officer
  (`addRole.feature`). Nothing on the site gives a role yet, and the import
  empties the database before it brings anything over, so the import gives
  them: once the users of every website are brought over, each address it
  names for a role is given that role. Which addresses hold which role is
  the import's to say, beside where it is put together (`import-ravendb.ts`).

  An address is found among the users the import brought over, compared as
  the site compares an email address, so a user is given a role whichever of
  the old sites they were on, and one who was on both is one account. Each
  role is given to the addresses named for it and to nobody else, and holding
  one says nothing about the other. An address no user was brought over as is
  named as having no account, since the role would otherwise be held by
  nobody with nothing saying so, and the other addresses are given theirs all
  the same.

  Nobody asks for a role to be given but the import, so it is recorded as
  given by the account itself. An account holds a role once, so giving it
  again records nothing (`addRole.feature`).

  Background:
    Given the users are imported
    And the site's roles are to be given

  Rule: Each address named for a role is given it

    Scenario Outline: A user named for a role is given it
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "<role>"
      When the roles are given
      Then the account at "someone@example.com" holds the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario: Every user named for a role is given it
      Given a user "users/1" on "croquetscores.com" is imported as "chris@example.com"
      And a user "users/2" on "croquetscores.com" is imported as "richard@example.com"
      And "chris@example.com" is named to hold the role "World Ranking Officer"
      And "richard@example.com" is named to hold the role "World Ranking Officer"
      When the roles are given
      Then the account at "richard@example.com" holds the role "World Ranking Officer"

    Scenario: A user named for one role is not given the other
      Given a user "users/1" on "croquetscores.com" is imported as "chris@example.com"
      And "chris@example.com" is named to hold the role "World Ranking Officer"
      When the roles are given
      Then the account at "chris@example.com" does not hold the role "Administrator"

    Scenario: A user named for both roles is given both
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "Administrator"
      And "someone@example.com" is named to hold the role "World Ranking Officer"
      When the roles are given
      Then the account at "someone@example.com" holds the role "Administrator"
      And the account at "someone@example.com" holds the role "World Ranking Officer"

    Scenario: A user not named for a role is not given it
      Given a user "users/1" on "croquetscores.com" is imported as "tim@example.com"
      And a user "users/2" on "croquetscores.com" is imported as "someone@example.com"
      And "tim@example.com" is named to hold the role "Administrator"
      When the roles are given
      Then the account at "someone@example.com" does not hold the role "Administrator"

    Scenario: A user of the other old site is given a role
      Given a user "users/1" on "gateballscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "Administrator"
      When the roles are given
      Then the account at "someone@example.com" holds the role "Administrator"

    Scenario: An address is found however it is written in capitals
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "Someone@EXAMPLE.com" is named to hold the role "Administrator"
      When the roles are given
      Then the account at "someone@example.com" holds the role "Administrator"

    Scenario: A role is recorded as given by the account itself
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "Administrator"
      When the roles are given
      Then the role given to the account at "someone@example.com" was given by that account

  Rule: An address no user was brought over as is named, and the rest are given their roles

    Scenario: An address with no account is named
      Given "nobody@example.com" is named to hold the role "World Ranking Officer"
      When the roles are given
      Then "nobody@example.com" is named as having no account

    Scenario: The other addresses are given their roles all the same
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "nobody@example.com" is named to hold the role "Administrator"
      And "someone@example.com" is named to hold the role "Administrator"
      When the roles are given
      Then the account at "someone@example.com" holds the role "Administrator"

    Scenario: An address with an account is not named
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "Administrator"
      When the roles are given
      Then no address is named as having no account

  Rule: Giving a role again records nothing

    Scenario: A role given twice is recorded once
      Given a user "users/1" on "croquetscores.com" is imported as "someone@example.com"
      And "someone@example.com" is named to hold the role "Administrator"
      And the roles are given
      When the roles are given
      Then the account at "someone@example.com" was given a role once
