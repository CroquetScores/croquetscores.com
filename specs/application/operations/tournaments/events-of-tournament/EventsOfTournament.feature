@postgres
Feature: The events of a tournament, as an administrator reads them

  What a tournament is was decided by what happened to it, and the events are
  how that is kept (`SETUP.md`). An administrator who is looking into a
  tournament, to find out how it came to be as it is, reads them as they were
  kept rather than as the read models make them.

  A tournament's events are not all in one place: the tournament's own stream
  holds what happened to it, and each competition, each commentary and each
  manager note has a stream of its own. They are answered together, oldest
  first, each with the kind of event it is, when it happened, the stream it was
  kept in, and everything else it carried.

  What an event carried is answered as it was kept, so a name or an email
  address in a tournament's events is there to be read. That is why only an
  administrator can ask: anybody else, a tournament's manager among them, is
  refused with `Account.NotAnAdministrator`. A tournament there is not is
  refused as `EventsOfTournament.NoSuchTournament`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Olive Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every event of the tournament is answered, oldest first

    Scenario: The tournament is answered with the name it has now
      Given "organiser@example.com" has renamed the tournament "Spring Open" to "Spring Classic"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the events answered are of the tournament called "Spring Classic"

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

  Rule: What was kept in the streams of its competitions, commentaries and notes is answered with it

    Scenario: A competition's events are answered
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Jones" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Jones" in "Block A" of "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then an event answered is a "competition-player-entered"

    Scenario: An event of a competition was kept in the competition's stream
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Jones" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Jones" in "Block A" of "Spring Open"
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then the event answered that is a "competition-player-entered" was kept in the competition's stream

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
      Then an event answered is a "commentary-started"
      And an event answered is a "tournament-archived"
      And the event answered that is a "commentary-started" comes before the event answered that is a "tournament-archived"

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
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" reads the events of "Spring Open"
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: An account the role was taken from is refused
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" reads the events of "Spring Open"
      Then it is refused with "Account.NotAnAdministrator"

  Rule: A tournament there is not is refused

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "admin@example.com" reads the events of a tournament there is not
      Then it is refused with "EventsOfTournament.NoSuchTournament"

