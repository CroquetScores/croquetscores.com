@postgres
Feature: The events of a tournament, as an administrator reads them

  What a tournament is was decided by what happened to it, and the events are
  how that is kept (`SETUP.md`). An administrator who is looking into a
  tournament, to find out how it came to be as it is, reads them as they were
  kept rather than as the read models make them.

  A tournament's events are not all in one place: the tournament's own stream
  holds what happened to it and its competitions, and each commentary and each
  manager note has a stream of its own. They are answered together, oldest
  first, each with the kind of event it is, when it happened, the stream it was
  kept in, and everything else it carried.

  What an event carried is answered as it was kept, so a name or an email
  address in a tournament's events is there to be read. That is why only an
  administrator can ask: anybody else, a tournament's manager among them, is
  refused with `Account.NotAnAdministrator`. A tournament there is not is
  refused as `EventsOfTournament.NoSuchTournament`.

  An account is forgotten by rewriting what is personal in its events
  (`AccountKeys.feature`), and a tournament's events are answered as they are
  kept, so a forgotten account's name is not there to be read.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given an application with its event store and read models
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Olive Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every event of the tournament is answered, oldest first

    Scenario: The event that made the tournament is answered first
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the first event answered is a "tournament-created"

    Scenario: An event is answered with when it happened
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the first event answered happened at "2026-10-09T10:00:00Z"

    Scenario: An event is answered with the stream it was kept in
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the first event answered was kept in the tournament's stream

    Scenario: An event is answered with what it carried
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the first event answered carried the name "Spring Open"

    Scenario: What happened afterwards is answered after it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the last event answered is a "tournament-archived"

  Rule: What was kept in the streams of its commentaries and notes is answered with it

    Scenario: A commentary's events are answered
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then an event answered is a "commentary-started"

    Scenario: An event of a commentary was kept in the commentary's stream
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the event answered that is a "commentary-started" was kept in the commentary's stream

    Scenario: A comment written in a commentary is answered
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      And "organiser@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then an event answered is a "commentary-comment-added"

    Scenario: A manager note's events are answered
      Given "organiser@example.com" has added the manager note "Bring a chair" to "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then an event answered is a "manager-note-added"

    Scenario: The events of all its streams are in the order they happened
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the event answered that is a "commentary-started" comes before the event answered that is a "tournament-archived"

  Rule: Another tournament's events are not answered

    Scenario: A commentary of another tournament is left out
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has started the commentary "Day one" on "Autumn Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then no event answered is a "commentary-started"

    Scenario: Another tournament's own events are left out
      Given "organiser@example.com" has created the tournament "Autumn Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then 1 event is answered

  Rule: Only an administrator can ask

    Scenario: A manager of the tournament is refused
      When the reader signed in to the account for "organiser@example.com" reads the events of "Spring Open"
      Then the request is refused as "Account.NotAnAdministrator"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" reads the events of "Spring Open"
      Then the request is refused as "Account.NotAnAdministrator"

    Scenario: An account the role was taken from is refused
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the request is refused as "Account.NotAnAdministrator"

  Rule: A tournament there is not is refused

    Scenario: A tournament nobody made is refused
      When the reader signed in to the account for "admin@example.com" reads the events of a tournament nobody made
      Then the request is refused as "EventsOfTournament.NoSuchTournament"

  Rule: What was kept of a forgotten account is what is answered

    Scenario: A forgotten account's name is not answered
      Given the account for "organiser@example.com" has been forgotten
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then no event answered carried the name "Olive Organiser"
