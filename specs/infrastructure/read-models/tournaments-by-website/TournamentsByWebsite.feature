@postgres
Feature: Finding a website's tournaments by when they were played and when they start

  The home page lists the tournaments a game has been added to lately, the
  tournaments about to start, and the years there are tournaments in
  (`home.feature`). None of the three can replay every tournament's events to
  find out, so a read model keeps the answers: a table of tournaments by
  website, kept by a projection as tournaments and their competitions are
  changed, and asked by the queries (`RecentResults.feature`,
  `UpcomingTournaments.feature`, `TournamentYears.feature`), and by the
  pages of a year's tournaments, and of a sport's in a year (`year.feature`,
  `yearSport.feature`), which can ask for the years of one sport.

  A tournament has a row holding what the home page shows of it: its name,
  its dates, its country, its region, its sport, where it is found, and when
  the last game in use was added to it. The row follows the tournament, as
  the tournaments by account do (`TournamentsByAccount.feature`): a name, a
  start, a country or a sport changed is changed in its row.

  Games are added to a competition rather than to the tournament, and a
  competition's events do not say which tournament it is in. The tournament's
  do, when the competition is added to it, so the read model keeps which
  tournament each competition is in, and each game by its competition, and
  puts them together when it is asked. That is what lets a rebuild take the
  streams in any order: a competition's games projected before the
  tournament that has it are still its games once the tournament is.

  When a game was added is when the event adding it happened. An archived game
  counts for nothing, as it does everywhere games are counted, and nor do the
  games of an archived competition, since what is archived is set aside. A
  game restored counts again from when it was added, not from when it was
  restored: restoring it puts back what was there. Correcting a game changes
  its scores and not when it was added.

  An archived tournament is set aside rather than gone (`archive.feature`),
  but it is not one a reader is sent to, so it is found by none of the three
  questions, and is found again once it is restored.

  How long ago is lately, and how far ahead is about to start, are the
  application's to say. The read model is asked for the tournaments with a
  game added since a moment, and for those starting from one day to another,
  and answers exactly that.

  The projection is safe to run twice, as rebuilding the read model does.

  Where a scenario names no website, the tournament is on croquetscores.com,
  is for the sport "ac", is played in the region "can" of the country "nz",
  and is looked for there.

  Background:
    Given the tournaments by website read model

  Rule: A tournament is found as played since a game was added to it

    Scenario: A tournament with a game added since the moment is found
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

    Scenario: A tournament whose last game was added before the moment is not found
      Given a tournament "Spring Open" to start on "2026-09-14"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-15T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament with a game added at the moment itself is found
      Given a tournament "Spring Open" to start on "2026-09-24"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-25T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

    Scenario: A tournament with no games is not found as played
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: When the last game was added is held
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-29T10:00:00Z"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T15:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is held as last played at "2026-09-30T15:00:00Z"

    Scenario: A tournament is found once however many games are added to it
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-29T10:00:00Z"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T15:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then 1 tournament is found

    Scenario Outline: A game in any kind of competition counts
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the <kind> "<competition>" is added to "Spring Open"
      And a game is added to "<competition>" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

      Examples:
        | kind     | competition |
        | block    | Block A     |
        | knockout | Main Event  |
        | losers knockout | Plate |
        | Swiss    | Swiss Event |
        | test     | AUS v ENG   |

  Rule: Only games in use count

    Scenario: A tournament whose only recent game is archived is not found
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the game added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z" is archived
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: An archived game is not when the last game was added
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-29T10:00:00Z"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T15:00:00Z"
      And the game added to "Block A" of "Spring Open" at "2026-09-30T15:00:00Z" is archived
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is held as last played at "2026-09-29T10:00:00Z"

    Scenario: A game restored counts from when it was added
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the game added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z" is archived
      And the game added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z" is restored at "2026-10-01T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is held as last played at "2026-09-30T10:00:00Z"

    Scenario: A game corrected counts from when it was added
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the game added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z" is corrected at "2026-10-01T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is held as last played at "2026-09-30T10:00:00Z"

    Scenario: The games of an archived competition do not count
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the competition "Block A" of "Spring Open" is archived
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: The games of a competition restored count again
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the competition "Block A" of "Spring Open" is archived
      And the competition "Block A" of "Spring Open" is restored
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

    Scenario: A game in another tournament does not count
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-09-28"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Autumn Open"
      And a game is added to "Block A" of "Autumn Open" at "2026-09-30T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

  Rule: The tournament played most lately comes first

    Scenario: The tournament with the latest game is first
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T15:00:00Z"
      And a tournament "Autumn Open" to start on "2026-09-26"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And the block "Block B" is added to "Autumn Open"
      And a game is added to "Block B" of "Autumn Open" at "2026-09-30T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then the first tournament found is "Spring Open"
      And the second tournament found is "Autumn Open"

    Scenario: Tournaments last played at the same moment are found by name
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And a tournament "Autumn Open" to start on "2026-09-26"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And the block "Block B" is added to "Autumn Open"
      And a game is added to "Block B" of "Autumn Open" at "2026-09-30T10:00:00Z"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then the first tournament found is "Autumn Open"
      And the second tournament found is "Spring Open"

  Rule: A tournament is found as starting on the day it starts

    Scenario: A tournament starting between the days is found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament starting on the first day is found
      Given a tournament "Spring Open" to start on "2026-10-02"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament starting on the last day is found
      Given a tournament "Spring Open" to start on "2026-12-01"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament starting before the first day is not found
      Given a tournament "Spring Open" to start on "2026-10-01"
      And "Spring Open" to finish on "2026-10-04"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament starting after the last day is not found
      Given a tournament "Spring Open" to start on "2026-12-02"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament moved into the days is found
      Given a tournament "Spring Open" to start on "2027-03-06"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2026-10-10"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament moved out of the days is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2027-03-06"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

  Rule: The tournament starting soonest comes first

    Scenario: The tournament starting soonest is first
      Given a tournament "Spring Open" to start on "2026-11-07"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-10-10"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then the first tournament found is "Autumn Open"
      And the second tournament found is "Spring Open"

    Scenario: Tournaments starting on the same day are found by name
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-10-10"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then the first tournament found is "Autumn Open"
      And the second tournament found is "Spring Open"

  Rule: A tournament is found on its own website

    Scenario: A tournament played on its own website is found
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the tournaments played on "gateballscores.com" since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

    Scenario: A tournament played on another website is not found
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the tournaments played on "croquetscores.com" since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament starting on its own website is found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting on "gateballscores.com" from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament starting on another website is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting on "croquetscores.com" from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

  Rule: An archived tournament is not found until it is restored

    Scenario: An archived tournament is not found as played
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And "Spring Open" is archived
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: An archived tournament is not found as starting
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament restored is found as played
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And "Spring Open" is archived
      And "Spring Open" is restored
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is found

    Scenario: A tournament restored is found as starting
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      And "Spring Open" is restored
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

  Rule: What is asked for is narrowed by the filter

    Scenario: A tournament in the country filtered by is found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the country "nz"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament in another country is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "au"
      And "Spring Open" to be played in the region "vic"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the country "nz"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament in the region filtered by is found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the country "nz"
      And a filter of the region "can"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament in another region of the country is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "auc"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the country "nz"
      And a filter of the region "can"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament in a region of the same code in another country is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "at"
      And "Spring Open" to be played in the region "sal"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the country "ar"
      And a filter of the region "sal"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament for the sport filtered by is found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the sport "gc"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

    Scenario: A tournament for another sport is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a filter of the sport "gc"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament played lately is narrowed by the filter as well
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And a filter of the sport "gc"
      When the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament moved to another country is found in it
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" to be moved to the country "au"
      And "Spring Open" to be moved to the region "vic"
      And "Spring Open" is updated
      And a filter of the country "au"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is found

  Rule: What is held of a tournament is what it is now

    Scenario: The tournament's dates are held
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to finish on "2026-10-12"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as starting on "2026-10-10"
      And "Spring Open" is held as finishing on "2026-10-12"

    Scenario: The tournament's country is held
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as played in the country "nz"

    Scenario: The tournament's address is held
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held at the address "2026/ac/spring-open"

    Scenario: A tournament renamed is held under its new name
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Autumn Open" is found

    Scenario: A tournament renamed is not held under its old name
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not found

    Scenario: A tournament moved to another year is held at its new address
      Given a tournament "Spring Open" to start on "2027-01-09"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to start on "2026-11-07"
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held at the address "2026/ac/spring-open"

    Scenario: A tournament renamed after a game is still held as played
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Autumn Open" is held as last played at "2026-09-30T10:00:00Z"

  Rule: Whether a tournament is national or international is held

    The lists bold the row of one that is (`year.feature`, `home.feature`),
    and the lists are drawn from this read model, so it keeps what the
    tournament's organiser ticked and follows it as it is changed.

    Scenario: A national tournament is held as national
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be national
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as national

    Scenario: A national tournament is not held as international
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be national
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not held as international

    Scenario: An international tournament is held as international
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be international
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as international

    Scenario: A tournament that is neither is held as neither
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is not held as national
      And "Spring Open" is not held as international

    Scenario: A tournament made national after it was created is held as national
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to be national
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as national

    Scenario: A national tournament made international is held as international
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be national
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to be international
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then "Spring Open" is held as international
      And "Spring Open" is not held as national

  Rule: A website's years are those it has tournaments in, newest first

    Scenario: The year a tournament starts in is one of the website's years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" are looked for
      Then the first year is 2024

    Scenario: The years are newest first
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2027-03-06"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" are looked for
      Then the first year is 2027
      And the second year is 2024

    Scenario: A year is found once however many tournaments are in it
      Given a tournament "Spring Open" to start on "2026-03-07"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-10-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" are looked for
      Then 1 year is found

    Scenario: A tournament over the new year is in the year it starts
      Given a tournament "New Year Open" to start on "2025-12-30"
      And "New Year Open" to finish on "2026-01-02"
      And "New Year Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" are looked for
      Then 1 year is found

    Scenario: The year of an archived tournament alone is not one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the years of "croquetscores.com" are looked for
      Then no year is found

    Scenario: The year of a tournament restored is one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      And "Spring Open" is restored
      When the years of "croquetscores.com" are looked for
      Then the first year is 2024

    Scenario: The year a tournament has moved away from is not one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2025-10-03"
      When the years of "croquetscores.com" are looked for
      Then 1 year is found

    Scenario: The years of another website's tournaments are not among them
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" are looked for
      Then no year is found

    Scenario: A website with no tournaments has no years
      When the years of "croquetscores.com" are looked for
      Then no year is found

  Rule: A website's years can be those it has tournaments of one sport in

    Scenario: The year of a tournament of the sport is one of the sport's years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" for the sport "gc" are looked for
      Then the first year is 2024

    Scenario: The year of another sport's tournament alone is not one of the sport's years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" for the sport "gc" are looked for
      Then no year is found

    Scenario: A year is found once however many of the sport's tournaments are in it
      Given a tournament "Spring Open" to start on "2026-03-07"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-10-03"
      And "Autumn Open" to be for the sport "gc"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the years of "croquetscores.com" for the sport "gc" are looked for
      Then 1 year is found

    Scenario: The year of an archived tournament of the sport alone is not one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the years of "croquetscores.com" for the sport "gc" are looked for
      Then no year is found

  Rule: Every website's tournaments can be listed with their sport

    The administrator reads the tournaments played in countries the world
    rankings do not list (`countries.feature`), whichever website they are on,
    so the read model can list them all, each with its sport, the soonest
    first and those starting on the same day by name.

    Scenario: A tournament is listed
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of every website are looked for
      Then "Spring Open" is found

    Scenario: A tournament of another website is listed
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" to be for the sport "gb"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of every website are looked for
      Then "Spring Open" is found

    Scenario: A tournament is listed with its sport
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of every website are looked for
      Then "Spring Open" is found for the sport "gc"

    Scenario: An archived tournament is not listed
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the tournaments of every website are looked for
      Then "Spring Open" is not found

  Rule: Projecting the same events again changes nothing

    Scenario: A tournament's creation projected twice is one tournament
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When its events are projected again
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then 1 tournament is found

    Scenario: A game projected twice leaves the last game where it was
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the events of "Block A" of "Spring Open" are projected again
      And the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is held as last played at "2026-09-30T10:00:00Z"

    Scenario: A game's archiving projected twice leaves it archived
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the game added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z" is archived
      When the events of "Block A" of "Spring Open" are projected again
      And the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then "Spring Open" is not found

  Rule: The read model is rebuilt from the events alone

    Every scenario here says the rebuild did not fail as well as what the
    table holds afterwards, because a rebuild that fails is rolled back with
    the transaction it ran in, which leaves the table exactly as it was.

    Scenario: A tournament rebuilt is found as starting
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the read model is rebuilt from the events
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then it is rebuilt without failing
      And "Spring Open" is found

    Scenario: A tournament rebuilt keeps when it was last played
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      When the read model is rebuilt from the events
      And the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then it is rebuilt without failing
      And "Spring Open" is held as last played at "2026-09-30T10:00:00Z"

    Scenario: A competition's games rebuilt before its tournament are still its games
      Given a tournament "Spring Open" to start on "2026-09-28"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the block "Block A" is added to "Spring Open"
      And a game is added to "Block A" of "Spring Open" at "2026-09-30T10:00:00Z"
      And the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And the tournaments played since "2026-09-25T10:00:00Z" are looked for
      Then it is rebuilt without failing
      And "Spring Open" is found

    Scenario: An archived tournament rebuilt is not found
      Given a tournament "Spring Open" to start on "2026-10-10"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the read model is rebuilt from the events
      And the tournaments starting from "2026-10-02" to "2026-12-01" are looked for
      Then it is rebuilt without failing
      And "Spring Open" is not found
