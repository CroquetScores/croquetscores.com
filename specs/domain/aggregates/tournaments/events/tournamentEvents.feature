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

  What an event can do without, such as a tournament's subtitle or the flag a
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
        | happening                                 | name                                |
        | a tournament being created                | tournament-created                  |
        | a tournament being updated                | tournament-updated                  |
        | a tournament being archived               | tournament-archived                 |
        | a tournament being restored               | tournament-restored                 |
        | a player being added                      | tournament-player-added             |
        | a player being updated                    | tournament-player-updated           |
        | a player being archived                   | tournament-player-archived          |
        | a player being restored                   | tournament-player-restored          |
        | a tournament's player being moved         | tournament-player-moved             |
        | the tournament's players being spaced out | tournament-players-spaced-out       |
        | a block being added                       | tournament-block-added              |
        | a block being updated                     | tournament-block-updated            |
        | a knockout being added                    | tournament-knockout-added           |
        | a losers knockout being added             | tournament-knockout-added           |
        | a knockout being updated                  | tournament-knockout-updated         |
        | a Swiss being added                       | tournament-swiss-added              |
        | a Swiss being updated                     | tournament-swiss-updated            |
        | a competition being archived              | tournament-competition-archived     |
        | a competition being restored              | tournament-competition-restored     |
        | a competition being moved                 | tournament-competition-moved        |
        | the competitions being spaced out         | tournament-competitions-spaced-out  |
        | an account being made a manager           | tournament-manager-added            |
        | an account being taken off the managers   | tournament-manager-removed          |
        | an account being made a scorer            | tournament-scorer-added             |
        | an account being taken off the scorers    | tournament-scorer-removed           |
        | a team being added                        | tournament-team-added               |
        | a team being updated                      | tournament-team-updated             |
        | a team being archived                     | tournament-team-archived            |
        | a team being restored                     | tournament-team-restored            |
        | a team being moved                        | tournament-team-moved               |
        | the teams being spaced out                | tournament-teams-spaced-out         |
        | a player being added to a team            | tournament-team-player-added        |
        | a player in a team being updated          | tournament-team-player-updated      |
        | a player in a team being archived         | tournament-team-player-archived     |
        | a player in a team being restored         | tournament-team-player-restored     |
        | a player in a team being moved            | tournament-team-player-moved        |
        | a team's players being spaced out         | tournament-team-players-spaced-out  |
        | a test being added                        | tournament-test-added               |
        | a test being updated                      | tournament-test-updated             |

  Rule: An event written down and read back is the event it was

    Scenario Outline: An event is read back as the kind it was written down as
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is the kind of event that was written down

      Examples:
        | happening                                 |
        | a tournament being created                |
        | a tournament being updated                |
        | a tournament being archived               |
        | a tournament being restored               |
        | a player being added                      |
        | a player being updated                    |
        | a player being archived                   |
        | a player being restored                   |
        | a tournament's player being moved         |
        | the tournament's players being spaced out |
        | a block being added                       |
        | a block being updated                     |
        | a knockout being added                    |
        | a losers knockout being added             |
        | a knockout being updated                  |
        | a Swiss being added                       |
        | a Swiss being updated                     |
        | a competition being archived              |
        | a competition being restored              |
        | a competition being moved                 |
        | the competitions being spaced out         |
        | an account being made a manager           |
        | an account being taken off the managers   |
        | an account being made a scorer            |
        | an account being taken off the scorers    |
        | a team being added                        |
        | a team being updated                      |
        | a team being archived                     |
        | a team being restored                     |
        | a team being moved                        |
        | the teams being spaced out                |
        | a player being added to a team            |
        | a player in a team being updated          |
        | a player in a team being archived         |
        | a player in a team being restored         |
        | a player in a team being moved            |
        | a team's players being spaced out         |
        | a test being added                        |
        | a test being updated                      |

    Scenario Outline: An event read back says everything it said
      Given an event of <happening>
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening                                 |
        | a tournament being created                |
        | a tournament being updated                |
        | a tournament being archived               |
        | a tournament being restored               |
        | a player being added                      |
        | a player being updated                    |
        | a player being archived                   |
        | a player being restored                   |
        | a tournament's player being moved         |
        | the tournament's players being spaced out |
        | a block being added                       |
        | a block being updated                     |
        | a knockout being added                    |
        | a losers knockout being added             |
        | a knockout being updated                  |
        | a Swiss being added                       |
        | a Swiss being updated                     |
        | a competition being archived              |
        | a competition being restored              |
        | a competition being moved                 |
        | the competitions being spaced out         |
        | an account being made a manager           |
        | an account being taken off the managers   |
        | an account being made a scorer            |
        | an account being taken off the scorers    |
        | a team being added                        |
        | a team being updated                      |
        | a team being archived                     |
        | a team being restored                     |
        | a team being moved                        |
        | the teams being spaced out                |
        | a player being added to a team            |
        | a player in a team being updated          |
        | a player in a team being archived         |
        | a player in a team being restored         |
        | a player in a team being moved            |
        | a team's players being spaced out         |
        | a test being added                        |
        | a test being updated                      |

  Rule: What an event can do without is read back as nothing

    Scenario: A tournament created with no subtitle is read back with none
      Given an event of a tournament being created with no subtitle
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added representing nothing is read back representing nothing
      Given an event of a player being added who represents nothing
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added with no handicap is read back with none
      Given an event of a player being added with no handicap
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added flying no flag is read back flying none
      Given an event of a player being added who flies no flag
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added with no world ranking name is read back with none
      Given an event of a player being added with no world ranking name
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A player added to a team with no world ranking name is read back with none
      Given an event of a player being added to a team with no world ranking name
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario: A team added flying no flag is read back flying none
      Given an event of a team being added that flies no flag
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

    Scenario Outline: A block kept with no tie break is read back with none
      Given an event of <happening> with no tie break
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

      Examples:
        | happening             |
        | a block being added   |
        | a block being updated |

    Scenario: A test added in no group is read back in none
      Given an event of a test being added in no group
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back says everything the event said

  Rule: A knockout added before losers knockouts is read back as taking nobody's losers

    Scenario: A knockout added takes the losers of nothing
      Given an event of a knockout being added
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
        | happening                                 | field           |
        | a tournament being created                | website         |
        | a tournament being updated                | address         |
        | a player being added                      | name            |
        | a player being added                      | slug            |
        | a player being added                      | order           |
        | a player being archived                   | order           |
        | a tournament's player being moved         | order           |
        | the tournament's players being spaced out | playerIds       |
        | a block being added                       | order           |
        | a block being added                       | rounds          |
        | a block being added                       | handicap        |
        | a block being added                       | drawsAllowed    |
        | a block being added                       | worldRankings   |
        | a test being added                        | worldRankings   |
        | a block being updated                     | rounds          |
        | a knockout being added                    | rounds          |
        | a competition being archived              | competitionId   |
        | a competition being archived              | order           |
        | a competition being moved                 | order           |
        | the competitions being spaced out         | competitionIds  |
        | an account being made a manager           | account         |
        | a team being added                        | shortName       |
        | a team being added                        | slug            |
        | a team being added                        | order           |
        | a team being archived                     | order           |
        | a team being moved                        | order           |
        | the teams being spaced out                | teamIds         |
        | a player being added to a team            | teamId          |
        | a player being added to a team            | name            |
        | a player in a team being archived         | order           |
        | a player in a team being moved            | order           |
        | a team's players being spaced out         | playerIds       |
        | a test being added                        | firstTeamId     |
        | a test being added                        | secondTeamId    |
        | a test being added                        | starts          |
        | a test being added                        | finishes        |
        | a test being added                        | slug            |
        | a test being added                        | expectedMatches |
        | a test being added                        | bestOf          |

    Scenario Outline: What was kept with a field that is not what its event says there is refused
      Given an event of <happening>
      And it was written down through the registry with its <field> as <written>
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

      Examples:
        | happening                  | field        | written                     |
        | a block being added        | handicap     | the text "no"               |
        | a block being added        | drawsAllowed | the text "no"               |
        | a block being added        | worldRankings | the text "no"              |
        | a block being added        | order        | the text "10000"            |
        | a block being added        | tieBreak     | the number 1                |
        | a knockout being added     | rounds       | the text "1, 3"             |
        | a knockout being added     | rounds       | a list holding the text "3" |
        | a player being added       | flag         | the number 1                |
        | a player being added       | slug         | the number 1                |
        | a player being added       | order        | the text "10000"            |
        | a team being added         | order        | the text "10000"            |
        | a team being added         | flag         | the number 1                |
        | a test being added         | starts       | the number 20261004         |
        | a test being added         | bestOf       | the text "3"                |
