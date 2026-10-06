Feature: The names a commentary's events are kept under

  A commentary is kept as everything that happened to it, as a tournament is
  (`tournamentEvents.feature`), and each thing that happened is kept under a
  name and read back by code that will have changed many times by then. What
  the registry does with a name is specified with it (`EventRegistry.feature`);
  this says which name each of a commentary's events is given, and that each
  is read back as what it was.

  A name is kept for good, so it says what happened in words that will still
  be true. Every one begins with "commentary-", so that no name of a
  commentary's could ever be one another kind of thing wants for its own.

  Nothing a commentary's events say can be done without, so each is refused
  without any of it. What was kept comes back from a table something else
  could have written to, and an event read back as something it never said
  is worse than none, so a field that is there but is not what the event says
  there, such as a comment written as a number, is refused as if it were
  missing.

  Background:
    Given a registry that knows a commentary's events

  Rule: Each of a commentary's events is kept under a name of its own

    Scenario Outline: An event is written down under its name
      Given an event of <happening>
      When the event is written down through the registry
      Then it was written down under the name "<name>"

      Examples:
        | happening                               | name                       |
        | a commentary's own record being started | commentary-started         |
        | a comment being added                   | commentary-comment-added   |
        | a comment being edited                  | commentary-comment-edited  |
        | a comment being deleted                 | commentary-comment-deleted |
        | a commentary's title being changed      | commentary-title-changed   |

  Rule: An event written down and read back is the event it was

    Scenario Outline: An event is read back as the kind it was written down as
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is the kind of event that was written down

      Examples:
        | happening                               |
        | a commentary's own record being started |
        | a comment being added                   |
        | a comment being edited                  |
        | a comment being deleted                 |
        | a commentary's title being changed      |

    Scenario Outline: An event read back says everything it said
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening                               |
        | a commentary's own record being started |
        | a comment being added                   |
        | a comment being edited                  |
        | a comment being deleted                 |
        | a commentary's title being changed      |

  Rule: What was kept without what an event cannot do without is refused

    Scenario Outline: What was kept without a field its event needs is refused
      Given an event of <happening>
      And it was written down through the registry without its <field>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                               | field     |
        | a commentary's own record being started | tournamentId |
        | a commentary's own record being started | title     |
        | a commentary's own record being started | slug      |
        | a commentary's own record being started | writer    |
        | a comment being added                   | commentId |
        | a comment being added                   | text      |
        | a comment being edited                  | commentId |
        | a comment being edited                  | text      |
        | a comment being deleted                 | commentId |
        | a commentary's title being changed      | title     |

    Scenario Outline: What was kept with a field that is not what its event says there is refused
      Given an event of <happening>
      And it was written down through the registry with its <field> as <written>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                               | field     | written      |
        | a commentary's own record being started | writer    | the number 1 |
        | a comment being added                   | commentId | the number 1 |
        | a comment being added                   | text      | the number 3 |
        | a comment being edited                  | commentId | the number 1 |
        | a comment being edited                  | text      | the number 3 |
        | a comment being deleted                 | commentId | the number 1 |
