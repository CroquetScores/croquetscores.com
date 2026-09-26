Feature: The names a tournament's events are kept under

  A tournament is kept as everything that happened to it, and each thing that
  happened is kept under a name and read back by code that will have changed
  many times by then. What the registry does with a name is specified with it
  (`EventRegistry.feature`); this says which name each of a tournament's
  events is given, and that each is read back as what it was.

  A name is kept for good, so it says what happened in words that will still
  be true: "tournament-player-added", not the name of whatever class records
  it today. Every one begins with "tournament-", so that no name of a
  tournament's could ever be one another kind of thing wants for its own.

  What an event can do without, such as a tournament's notes or the flag a
  player flies, is left out when it is nothing, and is read back as nothing.
  What an event cannot do without, it is refused without. What was kept comes
  back from a table something else could have written to, and an event read
  back as something it never said is worse than none. A field that is there
  but is not what the event says there, such as an order written as text, is
  refused as if it were missing.

  Background:
    Given a registry that knows a tournament's events

  Rule: Each of a tournament's events is kept under a name of its own

    Scenario Outline: An event is written down under its name
      Given an event of <happening>
      When the event is written down through the registry
      Then it was written down under the name "<name>"

      Examples:
        | happening                    | name                            |
        | a tournament being created   | tournament-created              |
        | a tournament being updated   | tournament-updated              |
        | a tournament being archived  | tournament-archived             |
        | a tournament being restored  | tournament-restored             |
        | a player being added         | tournament-player-added         |
        | a player being updated       | tournament-player-updated       |
        | a player being archived      | tournament-player-archived      |
        | a player being restored      | tournament-player-restored      |
        | a block being added          | tournament-block-added          |
        | a block being updated        | tournament-block-updated        |
        | a knockout being added       | tournament-knockout-added       |
        | a knockout being updated     | tournament-knockout-updated     |
        | a Swiss being added          | tournament-swiss-added          |
        | a Swiss being updated        | tournament-swiss-updated        |
        | a competition being archived | tournament-competition-archived |
        | a competition being restored | tournament-competition-restored |

  Rule: An event written down and read back is the event it was

    Scenario Outline: An event is read back as the kind it was written down as
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is the kind of event that was written down

      Examples:
        | happening                    |
        | a tournament being created   |
        | a tournament being updated   |
        | a tournament being archived  |
        | a tournament being restored  |
        | a player being added         |
        | a player being updated       |
        | a player being archived      |
        | a player being restored      |
        | a block being added          |
        | a block being updated        |
        | a knockout being added       |
        | a knockout being updated     |
        | a Swiss being added          |
        | a Swiss being updated        |
        | a competition being archived |
        | a competition being restored |

    Scenario Outline: An event read back says everything it said
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening                    |
        | a tournament being created   |
        | a tournament being updated   |
        | a tournament being archived  |
        | a tournament being restored  |
        | a player being added         |
        | a player being updated       |
        | a player being archived      |
        | a player being restored      |
        | a block being added          |
        | a block being updated        |
        | a knockout being added       |
        | a knockout being updated     |
        | a Swiss being added          |
        | a Swiss being updated        |
        | a competition being archived |
        | a competition being restored |

  Rule: What an event can do without is read back as nothing

    Scenario: A tournament created with no notes is read back with none
      Given an event of a tournament being created with no notes
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added representing nothing is read back representing nothing
      Given an event of a player being added who represents nothing
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added flying no flag is read back flying none
      Given an event of a player being added who flies no flag
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

  Rule: What was kept without what an event cannot do without is refused

    Scenario Outline: What was kept without a field its event needs is refused
      Given an event of <happening>
      And it was written down through the registry without its <field>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                    | field         |
        | a tournament being created   | website       |
        | a tournament being updated   | address       |
        | a player being added         | name          |
        | a block being added          | order         |
        | a knockout being added       | rounds        |
        | a competition being archived | competitionId |

    Scenario Outline: What was kept with a field that is not what its event says there is refused
      Given an event of <happening>
      And it was written down through the registry with its <field> as <written>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                  | field    | written                     |
        | a tournament being created | handicap | the text "no"               |
        | a block being added        | order    | the text "10000"            |
        | a knockout being added     | rounds   | the text "1, 3"             |
        | a knockout being added     | rounds   | a list holding the text "3" |
        | a player being added       | flag     | the number 1                |
