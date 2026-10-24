@postgres
Feature: The managers of a tournament, as a manager lists them

  A manager lists a tournament's managers to see who else runs it and to take
  one off, so the application answers with every account that manages it, in
  the order they were made managers, whoever created it first. Each is
  answered with its account's id, which is what taking one off names it by
  (`RemoveManager.feature`), and its name, which is what a reader knows
  somebody by. Each also says whether it is the account asking, since taking
  oneself off is taking away one's own way back to the tournament.

  A forgotten account is not answered, though the tournament still counts it
  among its managers until somebody takes it off: no query answers a forgotten
  account unless it is expressly asked to, and this one is not. Its name
  could not be read in any case.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing them, and an administrator and a world ranking officer of its sport,
  who write to them: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `ManagersOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`,
  as it is when it asks to change the tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every manager is answered, in the order they were made

    Scenario: The account that created the tournament is listed
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is answered

    Scenario: A manager made is listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is answered

    Scenario: Whoever created the tournament is listed first
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the first manager answered is "Ollie Organiser"

    Scenario: A manager taken off is not listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And "organiser@example.com" has taken "someone@example.com" off the managers of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not answered

    Scenario: A scorer is not listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not answered

  Rule: The account asking is said to be the one asking

    Scenario: The account asking is said to be itself
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is answered as the reader

    Scenario: Another manager is not said to be the reader
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not answered as the reader

  Rule: A forgotten account is not answered

    Scenario: A forgotten manager is not answered
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then 1 manager is answered

  Rule: Only a manager of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the managers of a tournament there is not
      Then it is refused with "ManagersOfTournament.NoSuchTournament"

    Scenario: A reader who does not manage the tournament is refused
      When the reader signed in to the account for "someone@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A world ranking officer of the tournament's sport can list them too

    A world ranking officer may write to a tournament's managers, whatever part
    it has in the tournament, so it is answered the list as a manager is,
    though only for a tournament of a sport whose rankings it looks after.

    Scenario: A world ranking officer of the tournament's sport lists them
      Given "ranker@example.com" has an account, confirmed, called "Rae Ranker"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "ranker@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is answered

    Scenario: A world ranking officer of another sport is refused
      Given "ranker@example.com" has an account, confirmed, called "Rae Ranker"
      And "ranker@example.com" has been given the role "GC World Ranking Officer"
      When the reader signed in to the account for "ranker@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Each manager's email address is answered only to an administrator and a world ranking officer

    An email address is what they are written to by, which a manager has no
    need of for another manager and a reader of the list is not otherwise
    shown. So only an administrator, who may do anything to a tournament, and
    a world ranking officer, who writes to its managers, are answered them.

    Scenario: An administrator is answered the creator's email address
      Given "admin@example.com" has an account, confirmed, called "Ada Administrator"
      And "admin@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is answered with the email address "organiser@example.com"

    Scenario: An administrator is answered a manager made's email address
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And "admin@example.com" has an account, confirmed, called "Ada Administrator"
      And "admin@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is answered with the email address "someone@example.com"

    Scenario: A world ranking officer is answered the creator's email address
      Given "ranker@example.com" has an account, confirmed, called "Rae Ranker"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "ranker@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is answered with the email address "organiser@example.com"

    Scenario: A manager is answered no email address
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is answered with no email address

  Rule: Whether the reader may change the managers is answered with them

    A manager and an administrator may make somebody a manager and take one
    off. A world ranking officer with no part in the tournament only reads
    them.

    Scenario: A manager is answered as able to change them
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the managers are answered as ones the reader may change

    Scenario: An administrator is answered as able to change them
      Given "admin@example.com" has an account, confirmed, called "Ada Administrator"
      And "admin@example.com" has been given the role "Administrator"
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then the managers are answered as ones the reader may change

    Scenario: A world ranking officer is answered as unable to change them
      Given "ranker@example.com" has an account, confirmed, called "Rae Ranker"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "ranker@example.com" lists the managers of "Spring Open"
      Then the managers are answered as ones the reader may not change

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the managers of "Spring Open"
      Then it is refused with "Account.Forgotten"
