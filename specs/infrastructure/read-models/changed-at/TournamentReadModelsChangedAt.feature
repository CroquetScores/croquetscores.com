@postgres
Feature: The tournaments' read models keep when each row last changed

  Every read model keeps when each of its rows last changed, for possible
  future use (`AccountsChangedAt.feature` is the accounts'). Nothing reads it
  yet. The moment is the `occurredAt` of the last event that changed the row,
  and never the moment the row was written, so that making the read models again
  from the events gives the moment the live projection did, whichever stream is
  read first.

  A row's moment moves only when an event changes that row: what happens to
  another row of the same tournament leaves it where it was. A tournament, a
  competition and a game keep theirs as well, which `Tournaments.feature` and
  `CompetitionGames.feature` say, and the notes and the commentaries keep
  theirs under the same name (`ManagerNotesByTournament.feature`,
  `CommentariesByTournament.feature`).

  The one place a rebuild cannot give what the live projection did is a block's
  and a Swiss's standings. A line moves only when an event changes that line,
  which is told by working the standings out again after each event, and a
  rebuild works them out once, when every stream is in. So after a rebuild each
  line of a competition's standings, and the competition's own row beside them,
  has the moment of the last event that could change the competition's
  standings, and a line that last changed before it is later than it was.

  Everything is done at 2026-09-26T10:00:00Z unless a scenario says when.

  Background:
    Given every read model of tournaments
    And a tournament "Spring Open" to start on "2026-10-03"
    And "Spring Open" is created by the account for "organiser@example.com"
    And a block named "Block A" is made in "Spring Open"
    And the player "Sam Someone" is made in "Spring Open"
    And the player "Alex Another" is made in "Spring Open"
    And the player "Sam Someone" is entered in "Block A" of "Spring Open"
    And the player "Alex Another" is entered in "Block A" of "Spring Open"
    And "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"

  Rule: A row is as changed as the event that made it, and not as the moment it was written

    Scenario: A tournament's address
      Then the address row of "Spring Open" was last changed at "2026-09-26T10:00:00Z"

    Scenario: An account's part in a tournament
      Then the part row of "Spring Open" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A tournament's name for searching
      Then the search name row of "Spring Open" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A competition's name for searching
      Then the search competition row of "Block A" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player for searching
      Then the search player row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player of the tournament
      Then the tournament player row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player entered in a competition
      Then the entry row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A line of a block's standings
      Then the standing row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

  Rule: A row moves only when an event changes it

    Scenario: A player archived moves their rows
      When the player "Sam Someone" of "Spring Open" is archived at "2026-09-27T10:00:00Z"
      Then the tournament player row of "Sam Someone" was last changed at "2026-09-27T10:00:00Z"

    Scenario: A player archived leaves another player's row
      When the player "Sam Someone" of "Spring Open" is archived at "2026-09-27T10:00:00Z"
      Then the tournament player row of "Alex Another" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player archived moves their row for searching
      When the player "Sam Someone" of "Spring Open" is archived at "2026-09-27T10:00:00Z"
      Then the search player row of "Sam Someone" was last changed at "2026-09-27T10:00:00Z"

    Scenario: A tournament renamed moves its name for searching
      Given "Spring Open" is renamed "Spring Classic" at "2026-09-27T10:00:00Z"
      Then the search name row of "Spring Classic" was last changed at "2026-09-27T10:00:00Z"

    Scenario: A tournament renamed leaves an account's part in it
      Given "Spring Open" is renamed "Spring Classic" at "2026-09-27T10:00:00Z"
      Then the part row of "Spring Classic" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player withdrawn moves their entry and not another's
      When the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn at "2026-09-27T10:00:00Z"
      Then the entry row of "Alex Another" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A player withdrawn moves their entry
      When the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn at "2026-09-27T10:00:00Z"
      Then the entry row of "Sam Someone" was last changed at "2026-09-27T10:00:00Z"

    Scenario: A line of the standings that comes out as it was keeps its moment
      Given the player "Chris Third" is made in "Spring Open"
      When the player "Chris Third" is entered in "Block A" of "Spring Open" at "2026-09-27T10:00:00Z"
      Then the standing row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A withdrawal that leaves a line's figures as they were still moves the line
      Given the player "Chris Third" is made in "Spring Open"
      And the player "Chris Third" is entered in "Block A" of "Spring Open" at "2026-09-26T10:00:00Z"
      When the player "Chris Third" in "Block A" of "Spring Open" is withdrawn at "2026-09-27T10:00:00Z"
      Then the standing row of "Chris Third" was last changed at "2026-09-27T10:00:00Z"

  Rule: The same moments are kept however the read models are made again

    Scenario: A rebuild with the competitions' streams first
      And the player "Sam Someone" of "Spring Open" is archived at "2026-09-27T10:00:00Z"
      And the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the tournament player row of "Sam Someone" was last changed at "2026-09-27T10:00:00Z"

    Scenario: A rebuild gives the entry the moment of the event that made it
      When the read model is rebuilt from the events
      Then the entry row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"

    Scenario: A rebuild gives the standings the moment of the last event
      When the read model is rebuilt from the events
      Then the standing row of "Sam Someone" was last changed at "2026-09-26T10:00:00Z"
