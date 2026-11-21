@browser @postgres
Feature: A tournament's events, in the admin

  /admin/{year}/{sport}/{slug}/events is where an administrator reads every
  event that was kept of a tournament, having pressed Events beside it in the
  list (`tournaments.feature`). It is for finding out how a tournament came to
  be as it is, so it shows what was kept and not what the pages make of it
  (`EventsOfTournament.feature` says which events, and in what order).

  It is headed by the tournament's name and lists the events oldest first, one
  to a row: when it happened, the kind of event it is, and the stream it was
  kept in (which is named by the id of what it was kept of), in that order
  across the row, or one above the next on a phone, with everything else it
  carried beneath, which a row is pressed to
  open and show and pressed again to close, since there are a great many
  events and most of what they carry is not what is looked for.

  Nobody but an administrator reads it. Anybody else who is signed in is told
  the page is not found, as they are of every page of the administrator's
  (`administrator.feature`), so that the page is not said to be there to a
  reader who may not see it. A reader not signed in is sent to sign in first,
  since they may be an administrator who has not said so yet.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page lists the tournament's events

    Scenario: The page is headed by the tournament's name
      When the events of "Spring Open" are opened
      Then the page is headed "Spring Open"

    Scenario: The event that made the tournament is listed
      When the events of "Spring Open" are opened
      Then the first event says "tournament-created"

    Scenario: An event says when it happened
      When the events of "Spring Open" are opened
      Then the first event happened at "2026-10-09T10:00:00Z"

    Scenario: An event says which stream it was kept in
      When the events of "Spring Open" are opened
      Then the first event was kept in the stream of the tournament "Spring Open"

    Scenario: The oldest event is first
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the events of "Spring Open" are opened
      Then the first event says "tournament-created"

    Scenario: The newest event is last
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the events of "Spring Open" are opened
      Then the last event says "tournament-archived"

    Scenario: A commentary's event is listed with the tournament's
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      When the events of "Spring Open" are opened
      Then an event says "commentary-started"

  Rule: An event is one row of when, what and where

    Scenario: On a desktop the three are side by side, the moment first
      Given a viewport 1200 pixels wide
      When the events of "Spring Open" are opened
      Then the first event's moment is before its kind
      And the first event's kind is before its stream
      And the first event's moment, kind and stream are on one row

    Scenario: On a phone the three are one above the next, the moment first
      When the events of "Spring Open" are opened
      Then the first event's moment is above its kind
      And the first event's kind is above its stream

  Rule: An event is pressed to show what it carried

    Scenario: What an event carried is not shown to begin with
      When the events of "Spring Open" are opened
      Then the first event does not show what it carried

    Scenario: An event opens to show what it carried
      When the events of "Spring Open" are opened
      And the first event is pressed
      Then the first event shows the name "Spring Open"

    Scenario: An event closes when it is pressed again
      When the events of "Spring Open" are opened
      And the first event is pressed
      And the first event is pressed
      Then the first event does not show what it carried

  Rule: Only an administrator reads the page

    A reader who is not signed in is sent to sign in first, as they are from
    every page of the admin, and is brought back to this one once they have.

    Scenario: A manager of the tournament is told the page is not found
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/admin/2026/ac/spring-open/events" is opened
      Then the page is not found

    Scenario: A reader who is not signed in is sent to sign in
      Given the reader has signed out
      When the page at "/admin/2026/ac/spring-open/events" is opened
      Then the sign in page is shown

    Scenario: A tournament there is not is refused as such
      When the page at "/admin/2026/ac/no-such-tournament/events" is opened
      Then the page is refused with "EventsOfTournament.NoSuchTournament"

  Rule: The page goes back to the tournaments

    Scenario: The page has a link back to the list
      When the events of "Spring Open" are opened
      Then the page links back to the tournaments
