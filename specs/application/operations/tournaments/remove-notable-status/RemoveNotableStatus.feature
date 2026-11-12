@postgres
Feature: Removing a tournament's national or international status

  A national or an international tournament is told to the administrator
  when it is added or edited (`CreateTournament.feature`,
  `UpdateTournament.feature`). Where the administrator judges it is neither,
  they take the status away: the tournament is no longer national or
  international, and its managers are told so, by email, with the reason.

  Only an administrator can: anybody else, a manager of the tournament among
  them, is refused with `Account.NotAnAdministrator`. The tournament is named
  by its id, which is the web layer's to say; one there is not is refused as
  `RemoveNotableStatus.NoSuchTournament`.

  Every manager is emailed, in English only, as the administrator's own voice:
  the email says the tournament was classified as national or as
  international, why the administrator thinks it is not, and asks to hear the
  reasoning if the manager disagrees. A manager whose account is forgotten is
  not emailed, since there is nobody to read it. A tournament that is neither
  has nothing taken away and nobody is emailed.

  The emails are queued in the transaction that keeps the change, so that they
  are queued if and only if it is kept.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open" starting at "2026-10-03T00:00:00Z" in the sport "ac"

  Rule: The tournament is no longer national or international

    Scenario: A national tournament is no longer national
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the kept tournament "Spring Open" is not national

    Scenario: An international tournament is no longer international
      Given "organiser@example.com" has made the tournament "Spring Open" international
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the kept tournament "Spring Open" is not international

    Scenario: What else the tournament is stays as it was
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the tournament is called "Spring Open"

  Rule: Its managers are emailed

    Scenario: The manager of a national tournament is emailed
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email "Email.NationalStatusRemoved" is queued for "organiser@example.com"

    Scenario: The manager of an international tournament is emailed
      Given "organiser@example.com" has made the tournament "Spring Open" international
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email "Email.InternationalStatusRemoved" is queued for "organiser@example.com"

    Scenario: Every manager is emailed
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email "Email.NationalStatusRemoved" is queued for "organiser@example.com"
      And the email "Email.NationalStatusRemoved" is queued for "someone@example.com"

    Scenario: A scorer is not emailed
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email "Email.NationalStatusRemoved" is not queued for "scorer@example.com"

    Scenario: A manager whose account is forgotten is not emailed
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And "organiser@example.com" has made the tournament "Spring Open" national
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then one email is queued for "organiser@example.com"
      And the queue holds 2 emails

  Rule: The email says what the administrator thinks and why

    Scenario: The email names the tournament
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email queued for "organiser@example.com" names the tournament "Spring Open"

    Scenario: The email links to the tournament
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email sent to "organiser@example.com" links to "/2026/ac/spring-open"

    Scenario: The email says the tournament was classified as national
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email queued for "organiser@example.com" says it was classified as a national-level event

    Scenario: The email says the tournament was classified as international
      Given "organiser@example.com" has made the tournament "Spring Open" international
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email queued for "organiser@example.com" says it was classified as an international-level event

    Scenario: The email says what national-level events are for
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email queued for "organiser@example.com" explains what national-level events are for

    Scenario: The email says what international-level events are for
      Given "organiser@example.com" has made the tournament "Spring Open" international
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email queued for "organiser@example.com" explains what international-level events are for

  Rule: A tournament that is neither has nothing taken away

    Scenario: Nobody is emailed
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then the email "Email.NationalStatusRemoved" is not queued for "organiser@example.com"

    Scenario: Nothing more is recorded of the tournament
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Only an administrator can ask for this

    Scenario: A manager of the tournament is refused
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "organiser@example.com" removes the notable status of the tournament "Spring Open"
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: The tournament stays national for a reader who is refused
      Given "organiser@example.com" has made the tournament "Spring Open" national
      When the reader signed in to the account for "organiser@example.com" removes the notable status of the tournament "Spring Open"
      Then the kept tournament "Spring Open" is national

  Rule: An archived tournament is refused as the tournament refuses it

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has made the tournament "Spring Open" national
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" removes the notable status of the tournament "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have its status removed

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "admin@example.com" removes the notable status of a tournament there is not
      Then it is refused with "RemoveNotableStatus.NoSuchTournament"
