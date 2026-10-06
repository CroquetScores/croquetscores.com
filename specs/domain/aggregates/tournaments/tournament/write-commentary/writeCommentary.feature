Feature: Who may write commentary on a tournament

  Anybody with an account may write commentary on a tournament: start a
  commentary, and then, as its writer, change its title and add, edit and
  delete its comments (`start.feature`, `changeTitle.feature`,
  `addComment.feature`). A commentary is kept by itself rather than as part
  of the tournament, so writing it records nothing of the tournament's. But
  whether it may be written is the tournament's to say, since it knows
  whether it is archived: an archived tournament can only be restored
  (`restore.feature`), and nothing is written on it, commentary included.
  Whatever writes commentary asks it first.

  Starting a commentary is not a change to the tournament in the sense that
  only its managers may make one (`onlyManagers.feature`), so any account
  may, whether or not the tournament has heard of it.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"

  Rule: Any account may write commentary on a tournament

    Scenario: A manager of the tournament may
      Given the tournament is rebuilt from the stream
      When commentary is written on the tournament
      Then it is not refused

    Scenario: An account the tournament does not know may
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When commentary is written on the tournament
      Then it is not refused

    Scenario: A scorer of the tournament may
      Given the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When commentary is written on the tournament
      Then it is not refused

    Scenario: Writing commentary records nothing of the tournament's
      Given the tournament is rebuilt from the stream
      When commentary is written on the tournament
      Then it has recorded 0 events

  Rule: Commentary cannot be written on an archived tournament

    Scenario: Writing commentary on an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When commentary is written on the tournament
      Then it is refused with "Tournament.Archived"
