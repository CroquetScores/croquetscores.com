@postgres
Feature: Making somebody a manager of a tournament

  A manager of a tournament can make somebody else one, and the account they
  are signed in to is who did. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`). The tournament is named by its id; one there is not
  is refused as `AddManager.NoSuchTournament`.

  Whoever is made a manager is named by their email address, since that is
  what the manager asking knows of them. It is taken as an email address is
  wherever one is typed, and one that breaks an email address's rules is
  refused with `Request.Invalid` and the first rule it breaks. An address with
  no confirmed account is refused as `AddManager.NoSuchAccount`, whether
  nobody has registered it, it is waiting to be confirmed, or its account has
  been forgotten, so that the manager learns no more about somebody else's
  address than that it cannot be made a manager. What the tournament does
  with a new manager — a scorer made one is no longer a scorer, and a manager
  made one again records nothing — is the tournament's to say
  (`addManager.feature`).

  Nothing is emailed: being made a manager changes what the account can do,
  and nothing about how it is reached.

  A forgotten account makes nobody a manager, and is refused with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Somebody made a manager manages the tournament

    Scenario: The account made a manager manages the tournament
      When the reader signed in to the account for "organiser@example.com" makes "someone@example.com" a manager of "Spring Open"
      Then the account for "someone@example.com" manages the tournament

    Scenario: A manager made can change the tournament
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "someone@example.com" archives the tournament "Spring Open"
      Then the tournament is archived

    Scenario: Making a manager is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" makes "someone@example.com" a manager of "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: An email address typed in capitals names the same account
      When the reader signed in to the account for "organiser@example.com" makes "SOMEONE@EXAMPLE.COM" a manager of "Spring Open"
      Then the account for "someone@example.com" manages the tournament

    Scenario: Making a manager emails nothing
      When the reader signed in to the account for "organiser@example.com" makes "someone@example.com" a manager of "Spring Open"
      Then nothing is queued to be sent

  Rule: Only an address with a confirmed account can be made a manager

    Scenario: An address nobody has registered is refused
      When the reader signed in to the account for "organiser@example.com" makes "nobody@example.com" a manager of "Spring Open"
      Then it is refused with "AddManager.NoSuchAccount"

    Scenario: An address waiting to be confirmed is refused the same way
      Given "waiting@example.com" has an account, not confirmed
      When the reader signed in to the account for "organiser@example.com" makes "waiting@example.com" a manager of "Spring Open"
      Then it is refused with "AddManager.NoSuchAccount"

    Scenario: An address that is not one is refused for it
      When the reader signed in to the account for "organiser@example.com" makes "someone" a manager of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "EmailAddress.NoAt"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "other@example.com" has an account, confirmed, called "Alex Another"
      When the reader signed in to the account for "other@example.com" makes "someone@example.com" a manager of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer cannot make themselves a manager
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" makes "someone@example.com" a manager of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament there is can be given a manager

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" makes "someone@example.com" a manager of a tournament there is not
      Then it is refused with "AddManager.NoSuchTournament"

  Rule: A forgotten account makes nobody a manager

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account makes "someone@example.com" a manager of "Spring Open"
      Then it is refused with "Account.Forgotten"
