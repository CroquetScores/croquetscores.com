Feature: Only a tournament's managers change it

  Any account can create a tournament, and whoever does is its first manager
  (`create.feature`). After that, only the tournament's managers can do
  anything to it: change what it is, archive or restore it, add, change,
  archive or restore its players and its competitions, and say who else
  manages it or scores it. Everything else that asks is refused, a scorer as
  much as somebody the tournament has never heard of: a scorer enters scores,
  and nothing else.

  Who is asking is what every event already records as its cause, so the
  tournament is told on every request, and asks it before anything else. A
  request from somebody who may not make it is refused whatever it asks for,
  even something that would change nothing, since whether it would is itself
  something only a manager is told. Restoring is no exception: an archived
  tournament is restored only by one of its managers.

  This is one feature for every method of the tournament rather than a
  scenario in each, because it is one rule, and the list of what it covers is
  worth reading in one place.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"
    And the player "Sam Someone" was added to it
    And the block "Block A" was added to it
    And the knockout "Main Event" was added to it
    And the Swiss "Swiss" was added to it
    And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
    And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it

  Rule: Somebody who neither manages nor scores the tournament can do nothing to it

    Scenario Outline: A request from somebody the tournament does not know is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When <asking>
      Then it is refused with "Tournament.NotAManager"

      Examples:
        | asking                                                                               |
        | the tournament is updated                                                            |
        | somebody archives the tournament                                                     |
        | the tournament is restored                                                           |
        | the player "Alex Another" is added                                                   |
        | the player "Sam Someone" is updated                                                  |
        | the player "Sam Someone" is archived                                                 |
        | the player "Sam Someone" is restored                                                 |
        | the block "Block B" is added                                                         |
        | the block "Block A" is updated                                                       |
        | the knockout "Plate" is added                                                        |
        | the knockout "Main Event" is updated                                                 |
        | the Swiss "Swiss B" is added                                                         |
        | the Swiss "Swiss" is updated                                                         |
        | the competition "Block A" is archived                                                |
        | the competition "Block A" is restored                                                |
        | the account "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is made a manager         |
        | the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers |
        | the account "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is made a scorer          |
        | the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers  |

    Scenario: A refused request records nothing
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When somebody archives the tournament
      Then the tournament is not archived

  Rule: A scorer can do nothing to the tournament but score it

    Scenario Outline: A request from a scorer is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When <asking>
      Then it is refused with "Tournament.NotAManager"

      Examples:
        | asking                                                                               |
        | the tournament is updated                                                            |
        | somebody archives the tournament                                                     |
        | the tournament is restored                                                           |
        | the player "Alex Another" is added                                                   |
        | the player "Sam Someone" is updated                                                  |
        | the player "Sam Someone" is archived                                                 |
        | the player "Sam Someone" is restored                                                 |
        | the block "Block B" is added                                                         |
        | the block "Block A" is updated                                                       |
        | the knockout "Plate" is added                                                        |
        | the knockout "Main Event" is updated                                                 |
        | the Swiss "Swiss B" is added                                                         |
        | the Swiss "Swiss" is updated                                                         |
        | the competition "Block A" is archived                                                |
        | the competition "Block A" is restored                                                |
        | the account "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is made a manager         |
        | the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers |
        | the account "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is made a scorer          |
        | the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers  |

  Rule: Every manager can do anything to the tournament

    Scenario: A manager other than the one who created it can change it
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When somebody archives the tournament
      Then the tournament is archived

    Scenario: What a manager other than the creator does is recorded as theirs
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When somebody archives the tournament
      Then what it recorded was caused by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"

    Scenario: A manager taken off can no longer change it
      Given the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was taken off its managers
      And the tournament is rebuilt from the stream
      And it is asked for by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When somebody archives the tournament
      Then it is refused with "Tournament.NotAManager"
