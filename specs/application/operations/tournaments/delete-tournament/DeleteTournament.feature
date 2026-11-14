@postgres
Feature: Deleting a test tournament, and telling its managers

  Somebody learning the site sometimes makes a tournament that was only ever
  a test, on the real website where they should have used the try website.
  The administrator removes it, and tells the tournament's managers why and
  where to practise instead, in words the administrator writes each time
  (`DeleteTournament.ts`).

  A tournament is never deleted from what the site keeps: its events are
  read-only (`AI.md`, section 9), so removing one is archiving it, which takes
  it out of every list and can be put back (`ArchiveTournament.feature`). The
  administrator may also tell the managers without archiving, for a
  tournament that is to be left where it is, so there are two things asked:
  to email the managers, and to email them and archive the tournament.

  Only an administrator can ask: anybody else, a manager of the tournament
  among them, is refused with `Account.NotAnAdministrator`. The tournament is
  named by its id, which is the web layer's to say; one there is not is
  refused as `DeleteTournament.NoSuchTournament`.

  Every manager is emailed, in English only, as the administrator's own voice,
  with what the administrator wrote. A manager whose account is forgotten is
  not emailed, since there is nobody to read it. A try website is where such
  tournaments are made, so unlike a judgement of its notability
  (`RemoveNotableStatus.feature`) its managers are emailed there too.

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

  Rule: Its managers are emailed

    Scenario: The manager is emailed
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email "Email.TournamentDeleted" is queued for "organiser@example.com"

    Scenario: Every manager is emailed
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email "Email.TournamentDeleted" is queued for "organiser@example.com"
      And the email "Email.TournamentDeleted" is queued for "someone@example.com"

    Scenario: A scorer is not emailed
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email "Email.TournamentDeleted" is not queued for "scorer@example.com"

    Scenario: A manager whose account is forgotten is not emailed
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then one email is queued for "organiser@example.com"
      And the queue holds 1 email

    Scenario: The manager of a tournament on a try website is emailed
      Given "organiser@example.com" has created the tournament "Try Open" on "try.croquetscores.com"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Try Open" that it is deleted
      Then the email "Email.TournamentDeleted" is queued for "organiser@example.com"

  Rule: The email says what the administrator wrote

    Scenario: The email says it
      Given the message to the managers is "Please practise on the try website."
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email queued for "organiser@example.com" says "Please practise on the try website."

    Scenario: The email keeps the lines apart
      Given the message to the managers is "Hi,\n\nRegards"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email queued for "organiser@example.com" keeps the lines of the message apart

    Scenario: The email names the tournament
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email queued for "organiser@example.com" names the tournament "Spring Open"

    Scenario: Markup in what is written is not markup in the email
      Given the message to the managers is "<b>Hello</b>"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the email queued for "organiser@example.com" does not say "<b>Hello</b>"

  Rule: Something has to be said

    An email with nothing in it would only puzzle its readers, and sending
    one means the box was cleared by accident.

    Scenario: A message with nothing in it is refused
      Given the message to the managers is "   "
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then it is refused with "DeleteTournament.MessageMissing"

    Scenario: Nobody is emailed for a message with nothing in it
      Given the message to the managers is "   "
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the queue holds 0 emails

    Scenario: The tournament is not archived for a message with nothing in it
      Given the message to the managers is "   "
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the tournament is not archived

  Rule: The tournament is archived only when that is asked

    Scenario: Emailing the managers leaves the tournament as it was
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the tournament is not archived

    Scenario: Emailing the managers and archiving archives the tournament
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the tournament is archived

    Scenario: Emailing the managers and archiving emails them
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the email "Email.TournamentDeleted" is queued for "organiser@example.com"

    Scenario: Archiving is recorded as done by the administrator
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the last thing the tournament recorded was caused by the account for "admin@example.com"

    Scenario: A tournament already archived is emailed about and recorded no more of
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the email "Email.TournamentDeleted" is queued for "organiser@example.com"
      And nothing more is recorded of the tournament

  Rule: Only an administrator can ask for this

    Scenario: A manager of the tournament is refused
      When the reader signed in to the account for "organiser@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: Nobody is emailed for a reader who is refused
      When the reader signed in to the account for "organiser@example.com" emails the managers of the tournament "Spring Open" that it is deleted
      Then the queue holds 0 emails

    Scenario: The tournament is not archived for a reader who is refused
      When the reader signed in to the account for "organiser@example.com" emails the managers of the tournament "Spring Open" that it is deleted, and archives it
      Then the tournament is not archived

  Rule: Only a tournament there is can be deleted

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "admin@example.com" emails the managers of a tournament there is not that it is deleted
      Then it is refused with "DeleteTournament.NoSuchTournament"
