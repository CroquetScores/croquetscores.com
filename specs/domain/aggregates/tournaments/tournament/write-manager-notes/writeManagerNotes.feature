Feature: Who may write a tournament's notes

  A tournament's managers write notes for its readers: adding them, editing
  them and deleting them (`add.feature`, `edit.feature`, `delete.feature`).
  A note is kept by itself rather than as part of the tournament, so that a
  long one is not read on every page of the tournament, and so adding,
  editing or deleting one records nothing of the tournament's. But who may
  write one is the tournament's to say, since it knows who manages it and
  whether it is archived, so whatever writes a note asks it first.

  Only its managers may, any of them: a note speaks for whoever runs the
  tournament (`onlyManagers.feature`). Anybody else is refused, a scorer
  among them, since a scorer enters scores and nothing else. An archived
  tournament can only be restored (`restore.feature`), so its notes cannot
  be written either.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"

  Rule: Any manager of the tournament may write its notes

    Scenario: The manager who created the tournament may write its notes
      Given the tournament is rebuilt from the stream
      When the tournament's manager notes are written
      Then it is not refused

    Scenario: Another manager may write its notes
      Given the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the tournament's manager notes are written
      Then it is not refused

    Scenario: Writing its notes records nothing of the tournament's
      Given the tournament is rebuilt from the stream
      When the tournament's manager notes are written
      Then it has recorded 0 events

  Rule: Nobody but a manager may write its notes

    Scenario: Somebody the tournament does not know is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the tournament's manager notes are written
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer is refused
      Given the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When the tournament's manager notes are written
      Then it is refused with "Tournament.NotAManager"

  Rule: An archived tournament's notes cannot be written

    Scenario: Writing an archived tournament's notes is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the tournament's manager notes are written
      Then it is refused with "Tournament.Archived"
