Feature: The names a manager's note's events are kept under

  A note a tournament's managers write is kept as everything that happened
  to it, as a commentary is (`commentaryEvents.feature`), and each thing that
  happened is kept under a name and read back by code that will have changed
  many times by then. What the registry does with a name is specified with it
  (`EventRegistry.feature`); this says which name each of a note's events is
  given, and that each is read back as what it was.

  A name is kept for good, so it says what happened in words that will still
  be true. Every one begins with "manager-note-", so that no name of a note's
  could ever be one another kind of thing wants for its own.

  Nothing a note's events say can be done without, so each is refused
  without any of it: a note with no description is kept with the empty one.
  What was kept comes back from a table something else could have written
  to, and an event read back as something it never said is worse than none.

  Background:
    Given a registry that knows a manager's note's events

  Rule: Each of a note's events is kept under a name of its own

    Scenario Outline: An event is written down under its name
      Given an event of <happening>
      When the event is written down through the registry
      Then it was written down under the name "<name>"

      Examples:
        | happening                      | name                 |
        | a manager's note being added   | manager-note-added   |
        | a manager's note being edited  | manager-note-edited  |
        | a manager's note being deleted | manager-note-deleted |

  Rule: An event written down and read back is the event it was

    Scenario Outline: An event is read back as the kind it was written down as
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is the kind of event that was written down

      Examples:
        | happening                      |
        | a manager's note being added   |
        | a manager's note being edited  |
        | a manager's note being deleted |

    Scenario Outline: An event read back says everything it said
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening                      |
        | a manager's note being added   |
        | a manager's note being edited  |
        | a manager's note being deleted |

  Rule: What was kept without what an event cannot do without is refused

    Scenario Outline: What was kept without a field its event needs is refused
      Given an event of <happening>
      And it was written down through the registry without its <field>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                     | field        |
        | a manager's note being added  | tournamentId |
        | a manager's note being added  | title        |
        | a manager's note being added  | description  |
        | a manager's note being edited | title        |
        | a manager's note being edited | description  |
