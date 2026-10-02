@postgres
Feature: The tournaments with recent results

  The home page lists the tournaments that have had a game added in the last
  seven days, the most recently played first (`home.feature`). The
  application answers them: each with its name, its dates, the country it is
  played in, and where it is found, which is everything a row of that list
  shows or leads to.

  Seven days are counted back from the moment the reader asked, to the
  minute, so that a game added a week ago this morning is still recent this
  morning and is not by the afternoon. The moment is handed down from the
  edge with the question, since nothing below the web layer reads a clock.

  A game counts for as long as it is in use: an archived game counts for
  nothing, as it does everywhere games are counted, and nor do the games of
  an archived competition. A game restored counts from when it was added. An
  archived tournament is not listed, whatever was played in it
  (`TournamentsByWebsite.feature`).

  The list is of the website asked about, and can be narrowed to a country, a
  region of it and a sport (`TournamentFilter.feature`). A country is named by
  its code, and one there is not is refused as `RecentResults.NoSuchCountry`.
  Anything else a filter cannot be is the filter's to refuse.

  Recent results are for anybody, so nobody need be signed in to ask, and
  every scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-19T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-09-20T00:00:00Z"
    And the tournament is to finish at "2026-10-04T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And the tournament is to be played in the country "nz"
    And the tournament is to be played in the region "can"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: A tournament with a game added in the last seven days is answered

    Scenario: A tournament with a game added yesterday is answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament with a game added seven days ago to the minute is answered
      Given the moment "2026-09-25T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament whose last game was added more than seven days ago is not answered
      Given the moment "2026-09-25T09:59:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament with no games is not answered
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament is answered once however many games were added to it
      Given the moment "2026-09-30T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-01T10:00:00Z"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then 1 tournament is answered

  Rule: Only games in use count

    Scenario: A tournament whose only recent game is archived is not answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament whose recent game is restored is answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has restored the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: An old game restored lately is still old
      Given the moment "2026-09-20T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the moment "2026-10-01T10:00:00Z"
      And "organiser@example.com" has restored the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament whose recent games are in an archived competition is not answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament with a recent game in a test is answered
      Given the tournament is to be played in the format "Teams"
      And the moment "2026-09-28T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the moment "2026-10-01T10:00:00Z"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Tests" is answered

  Rule: An archived tournament is not answered

    Scenario: An archived tournament with a recent game is not answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: The most recently played comes first

    Scenario: The tournament with the latest game is first
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And the moment "2026-09-30T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then the first tournament answered is "Autumn Open"
      And the second tournament answered is "Spring Open"

    Scenario: A tournament played again comes first again
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And the moment "2026-09-30T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      And the moment "2026-10-01T15:00:00Z"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then the first tournament answered is "Spring Open"
      And the second tournament answered is "Autumn Open"

  Rule: What is answered of a tournament is what a row shows and where it leads

    Background:
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The tournament's start is answered
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as starting on "2026-09-20"

    Scenario: The tournament's finish is answered
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as finishing on "2026-10-04"

    Scenario: The tournament's country is answered
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as played in the country "nz"

    Scenario: The tournament's address is answered
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered at the address "2026/ac/spring-open"

  Rule: The results are of the website asked about

    Scenario: A tournament on another website is not answered
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the recent results on "gateballscores.com" are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: The results are narrowed by the filter

    Background:
      Given the moment "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: A tournament in the country filtered by is answered
      Given a filter of the country "nz"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament in another country is not answered
      Given a filter of the country "au"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament in the region filtered by is answered
      Given a filter of the country "nz"
      And a filter of the region "can"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament in another region is not answered
      Given a filter of the country "nz"
      And a filter of the region "auc"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament for the sport filtered by is answered
      Given a filter of the sport "ac"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament for another sport is not answered
      Given a filter of the sport "gc"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: A filter there cannot be is refused

    Scenario: A country there is not is refused
      Given a filter of the country "xx"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "RecentResults.NoSuchCountry"

    Scenario: A region the country does not have is refused
      Given a filter of the country "au"
      And a filter of the region "can"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.RegionNotInCountry"

    Scenario: A region without a country is refused
      Given a filter of the region "can"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.RegionWithoutCountry"

    Scenario: A sport the website does not offer is refused
      Given a filter of the sport "gb"
      When the recent results are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.SportNotOffered"
