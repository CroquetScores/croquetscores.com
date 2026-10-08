Feature: The names a competition's events are kept under

  A competition is kept as everything that happened to it, as a tournament is
  (`tournamentEvents.feature`), and each thing that happened is kept under a
  name and read back by code that will have changed many times by then. What
  the registry does with a name is specified with it (`EventRegistry.feature`);
  this says which name each of a competition's events is given, and that each
  is read back as what it was.

  A name is kept for good, so it says what happened in words that will still
  be true. Every one begins with "competition-", so that no name of a
  competition's could ever be one another kind of thing wants for its own.

  What an event can do without, such as any of the counts a player carries
  forward, is left out when it is nothing, and is read back as nothing. A
  count of 0 is something, and is read back as 0. What an event cannot do
  without, it is refused without. What was kept comes
  back from a table something else could have written to, and an event read
  back as something it never said is worse than none, so a field that is there
  but is not what the event says there, such as an order written as text, is
  refused as if it were missing.

  Background:
    Given a registry that knows a competition's events

  Rule: Each of a competition's events is kept under a name of its own

    Scenario Outline: An event is written down under its name
      Given an event of <happening>
      When the event is written down through the registry
      Then it was written down under the name "<name>"

      Examples:
        | happening                               | name                                     |
        | a player being entered                  | competition-player-entered               |
        | a player being moved                    | competition-player-moved                 |
        | the players being spaced out            | competition-players-spaced-out           |
        | a player withdrawing                    | competition-player-withdrawn             |
        | a player's withdrawal being reversed    | competition-player-withdrawal-reversed   |
        | a player's carry forward being changed  | competition-player-carry-forward-changed |
        | a player being removed                  | competition-player-removed               |
        | a bye being moved                       | competition-bye-moved                    |
        | a bye being removed                     | competition-bye-removed                  |
        | a game being added                      | competition-game-added                   |
        | a game being archived                   | competition-game-archived                |
        | a game being restored                   | competition-game-restored                |
        | a game being withdrawn                  | competition-game-withdrawn               |
        | a game's withdrawal being reversed      | competition-game-withdrawal-reversed     |
        | a game being corrected                  | competition-game-corrected               |
        | a game being corrected to other players | competition-game-corrected               |

  Rule: An event written down and read back is the event it was

    Scenario Outline: An event is read back as the kind it was written down as
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is the kind of event that was written down

      Examples:
        | happening                              |
        | a player being entered                 |
        | a player being moved                   |
        | the players being spaced out           |
        | a player withdrawing                   |
        | a player's withdrawal being reversed   |
        | a player's carry forward being changed |
        | a player being removed                 |
        | a bye being moved                      |
        | a bye being removed                    |
        | a game being added                     |
        | a game being archived                  |
        | a game being restored                  |
        | a game being withdrawn                 |
        | a game's withdrawal being reversed     |
        | a game being corrected                 |

    Scenario Outline: An event read back says everything it said
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening                               |
        | a player being entered                  |
        | a player being moved                    |
        | the players being spaced out            |
        | a player withdrawing                    |
        | a player's withdrawal being reversed    |
        | a player's carry forward being changed  |
        | a player being removed                  |
        | a bye being moved                       |
        | a bye being removed                     |
        | a game being added                      |
        | a game being archived                   |
        | a game being restored                   |
        | a game being withdrawn                  |
        | a game's withdrawal being reversed      |
        | a game being corrected                  |
        | a game being corrected to other players |

  Rule: What a carry forward can do without is read back as nothing

    Scenario: A player carrying every count forward is read back carrying it all
      Given an event of a player's carry forward being changed to every count
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player carrying nothing forward is read back carrying nothing
      Given an event of a player's carry forward being changed to no counts
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A count of 0 is read back as 0
      Given an event of a player's carry forward being changed to match wins of 0
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

  Rule: What a correction can do without is read back as nothing

    A correction says its players only where it changed them, so one that
    kept them, as every correction did before they could be changed, says
    none, and is read back saying none.

    Scenario: A correction that kept its players is read back saying none
      Given an event of a game being corrected
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says nothing of the game's players

  Rule: What was kept without what an event cannot do without is refused

    Scenario Outline: What was kept without a field its event needs is refused
      Given an event of <happening>
      And it was written down through the registry without its <field>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                              | field              |
        | a player being entered                 | tournamentPlayerId |
        | a player being entered                 | order              |
        | a player being moved                   | order              |
        | the players being spaced out           | playerIds          |
        | a player withdrawing                   | playerId           |
        | a player withdrawing                   | order              |
        | a player being removed                 | playerId           |
        | a player's carry forward being changed | playerId           |
        | a bye being moved                      | fromOrder          |
        | a bye being moved                      | order              |
        | a bye being removed                    | order              |
        | a game being added                     | gameId             |
        | a game being added                     | winnerId           |
        | a game being added                     | winnerScore        |
        | a game being added                     | loserId            |
        | a game being added                     | loserScore         |
        | a game being added                     | winnerMarked       |
        | a game being archived                  | gameId             |
        | a game being restored                  | gameId             |
        | a game being withdrawn                 | gameId             |
        | a game's withdrawal being reversed     | gameId             |
        | a game being corrected                 | gameId             |
        | a game being corrected                 | winnerScore        |
        | a game being corrected                 | winnerMarked       |
        | a game being corrected                 | loserScore         |

    Scenario Outline: What was kept with a field that is not what its event says there is refused
      Given an event of <happening>
      And it was written down through the registry with its <field> as <written>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                               | field        | written                     |
        | a player being entered                  | order        | the text "10000"            |
        | a player's carry forward being changed  | matchWins    | the text "3"                |
        | a player's carry forward being changed  | hoopsAgainst | the text "86"               |
        | the players being spaced out            | playerIds    | a list holding the number 1 |
        | a game being added                      | winnerScore  | the number 26               |
        | a game being added                      | winnerMarked | the text "yes"              |
        | a game being added                      | loserScore   | the number 17               |
        | a game being corrected                  | winnerScore  | the number 26               |
        | a game being corrected                  | winnerMarked | the text "yes"              |
        | a game being corrected                  | loserScore   | the number 17               |
        | a game being corrected to other players | winnerId     | the number 1                |
        | a game being corrected to other players | loserId      | the number 1                |
