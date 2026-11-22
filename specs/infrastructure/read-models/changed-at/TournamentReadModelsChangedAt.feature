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

  An event that says it happened after the moment it is written, as the
  events imported from the old sites do, with the day a tournament starts,
  moves a row to the moment it is written and no later. A moment still to
  come would have the row told of by every answer of what changed since,
  whenever it was asked. That is the one time a moment is not the event's,
  so a rebuild gives these rows the moment of the rebuild.

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

  Rule: A moment still to come is held as the moment it is written

    Scenario: A tournament renamed in the future is not changed in the future
      Given "Spring Open" is renamed "Spring Classic" at "2999-01-01T00:00:00Z"
      Then the tournament row of "Spring Classic" was not last changed in the future

    Scenario: A competition added in the future is not changed in the future
      Given a block named "Block B" is made in "Spring Open" at "2999-01-01T00:00:00Z"
      Then the competition row of "Block B" was not last changed in the future

    Scenario: A tournament's new address is not changed in the future
      Given "Spring Open" is renamed "Spring Classic" at "2999-01-01T00:00:00Z"
      Then the address row of "Spring Classic" was not last changed in the future

    Scenario: A player archived in the future is not changed in the future
      When the player "Sam Someone" of "Spring Open" is archived at "2999-01-01T00:00:00Z"
      Then the tournament player row of "Sam Someone" was not last changed in the future

    Scenario: A player archived in the future is not changed in the future for searching
      When the player "Sam Someone" of "Spring Open" is archived at "2999-01-01T00:00:00Z"
      Then the search player row of "Sam Someone" was not last changed in the future

    Scenario: A tournament renamed in the future is not changed in the future for searching
      Given "Spring Open" is renamed "Spring Classic" at "2999-01-01T00:00:00Z"
      Then the search name row of "Spring Classic" was not last changed in the future

    Scenario: A player withdrawn in the future is not changed in the future
      When the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn at "2999-01-01T00:00:00Z"
      Then the entry row of "Sam Someone" was not last changed in the future

    Scenario: A tournament moved to another year in the future is not moved in the future
      Given "Spring Open" is updated to start on "2027-03-01" at "2999-01-01T00:00:00Z"
      Then the year row of "Spring Open" was not last changed in the future

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

  Rule: The year a tournament was in before is kept, and is the same however the read models are made again

    The addresses a tournament has had cannot say it, since one it moves back
    to is held from the moment it was first given, so the years are kept
    beside them (`changedYear.feature` says what is made of them).

    Scenario: A tournament that has not moved has no year before
      Then the years of "Spring Open" are 2026 and no year before

    Scenario: A tournament moved to another year says the year it was in
      Given "Spring Open" is updated to start on "2027-03-01"
      Then the years of "Spring Open" are 2027 and before that 2026

    Scenario: A tournament moved within its year has no year before
      Given "Spring Open" is updated to start on "2026-11-01"
      Then the years of "Spring Open" are 2026 and no year before

    Scenario: A tournament moved and moved back says the year it was moved back from
      Given "Spring Open" is updated to start on "2027-03-01"
      And "Spring Open" is updated to start on "2026-10-03"
      Then the years of "Spring Open" are 2026 and before that 2027

    Scenario: A rebuild keeps the years of a tournament moved and moved back
      Given "Spring Open" is updated to start on "2027-03-01"
      And "Spring Open" is updated to start on "2026-10-03"
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the years of "Spring Open" are 2026 and before that 2027

    Scenario: A rebuild keeps the year of a tournament moved once
      Given "Spring Open" is updated to start on "2027-03-01"
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the years of "Spring Open" are 2027 and before that 2026
