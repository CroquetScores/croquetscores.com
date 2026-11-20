@postgres
Feature: What an account is called

  A page that says who wrote something, as a commentary's does, shows the name
  of the account that wrote it. It cannot replay the account's events to find
  out, since they include every time its owner signed in, so a read model keeps
  the answer: each account's name, found by the account's id.

  An account has a name once it is confirmed, or if it was brought over from
  the old site, which named it already. A change of name replaces the name. An
  account that is not yet confirmed has none, and one that is forgotten has
  had its name taken away, so it is found with none. A name is personal, and
  the table is held to the same rule as the events: nothing of a forgotten
  person is kept.

  The projection is safe to run twice, and the table can be made again from
  the events in any order of accounts, as every read model can (SETUP.md §7.5).

  Background:
    Given the account names read model
    And the moment "2026-09-19T10:00:00Z"
    And an account for "someone@example.com" is registered

  Rule: A confirmed account is found by its name

    Scenario: A confirmed account is found with its name
      Given the account for "someone@example.com" confirms its address
      When the name of the account for "someone@example.com" is looked for
      Then the name found is "Sam Someone"

    Scenario: An account brought over from the old site is found with its name
      Given an account for "old@example.com" is brought over from the old site
      When the name of the account for "old@example.com" is looked for
      Then the name found is "Sam Someone"

    Scenario: An account that is not confirmed is found with no name
      When the name of the account for "someone@example.com" is looked for
      Then no name is found

    Scenario: Another account's name is not found
      Given an account for "other@example.com" is registered
      And the account for "other@example.com" confirms its address
      And the account for "other@example.com" changes its name to "Alex Another"
      When the name of the account for "someone@example.com" is looked for
      Then no name is found

  Rule: A change of name replaces the name

    Scenario: An account renamed is found with its new name
      Given the account for "someone@example.com" confirms its address
      And the account for "someone@example.com" changes its name to "Sam Someone-Else"
      When the name of the account for "someone@example.com" is looked for
      Then the name found is "Sam Someone-Else"

  Rule: A forgotten account is found with no name

    Scenario: A forgotten account is found with no name
      Given the account for "someone@example.com" confirms its address
      And the account for "someone@example.com" is forgotten
      When the name of the account for "someone@example.com" is looked for
      Then no name is found

    Scenario: A forgotten account leaves another account's name found
      Given the account for "someone@example.com" confirms its address
      And an account for "other@example.com" is registered
      And the account for "other@example.com" confirms its address
      And the account for "other@example.com" changes its name to "Alex Another"
      And the account for "someone@example.com" is forgotten
      When the name of the account for "other@example.com" is looked for
      Then the name found is "Alex Another"

  Rule: The row says when it was last changed

    The `occurredAt` of the last event that changed it, as every read model
    keeps it, so a change of name moves it.

    Scenario: Confirming an account gives the row its moment
      Given the account for "someone@example.com" confirms its address
      Then the row of the account for "someone@example.com" was last changed at "2026-09-19T10:00:00Z"

    Scenario: Changing the name moves the row's moment
      Given the account for "someone@example.com" confirms its address
      And the moment "2026-09-20T10:00:00Z"
      And the account for "someone@example.com" changes its name to "Sam Someone-Else"
      Then the row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

  Rule: The table can be made again from the events

    Scenario: Making it again gives the same rows
      Given the account for "someone@example.com" confirms its address
      And the account for "someone@example.com" changes its name to "Sam Someone-Else"
      And the rows of the table of names are noted
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the rows of the table of names are as they were noted

    Scenario: Making it again gives the same rows whichever account is read first
      Given the account for "someone@example.com" confirms its address
      And an account for "other@example.com" is registered
      And the account for "other@example.com" confirms its address
      And the rows of the table of names are noted
      When the table of names is made again with the newest account first
      Then it is rebuilt without failing
      And the rows of the table of names are as they were noted

    Scenario: The name of a forgotten account is not brought back by making it again
      Given the account for "someone@example.com" confirms its address
      And the account for "someone@example.com" is forgotten
      When the read model is rebuilt from the events
      And the name of the account for "someone@example.com" is looked for
      Then no name is found
