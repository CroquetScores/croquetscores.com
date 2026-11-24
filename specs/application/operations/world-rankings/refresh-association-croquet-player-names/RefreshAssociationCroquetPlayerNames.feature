@postgres
Feature: Refreshing the association croquet names the world rankings know

  The list of association croquet world ranking players refreshes its names
  from the world rankings' own site when it is asked for from the start
  (`worldRankingPlayers.feature`), so that nobody has to sign in to bring
  them over. This describes what is done for it, apart from how it is asked.
  The import an administrator asks for (`ImportWorldRankingPlayers.feature`)
  reads both lists and is theirs alone, so this reads only association
  croquet's, and keeps it as that import does.

  The rankings' site is read at most once an hour, counted from the moment
  of the request, since an app that asks again and again would otherwise have
  it read as often. The hour is counted from the first request of it, whether
  or not that one found the list: a site that is down is not asked again by
  every request while it is. It is not counted from one that failed for a
  reason of the site's own, which kept nothing, so the next request tries
  again.

  A list that gives one name to two players is not kept, and is logged as an
  error, as the import's is. It is not emailed to the administrator of the
  site, since this is done for any reader and as often as once an hour, and an
  administrator told every hour for as long as the rankings stay wrong would
  soon stop reading it. The administrator who imports is still told.

  These scenarios run against Postgres, with the application's event store,
  and with a fake of the world rankings' site in place of the real one.

  Background:
    Given the application's accounts
    And the moment "2026-10-08T10:00:00Z"
    And a fake of the world rankings
    And the administrator of the site is at "administrator@example.com"
    And the association croquet list names "Keith Aiton"
    And the golf croquet list names "Bill Arliss"

  Rule: Only the association croquet list is read and kept

    Scenario: A player on the association croquet list is kept
      When the association croquet names are refreshed
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A player on the golf croquet list is not kept
      When the association croquet names are refreshed
      Then "Bill Arliss" is not kept among the golf croquet players

    Scenario: The golf croquet list is not asked for
      When the association croquet names are refreshed
      Then the golf croquet list was not asked for

  Rule: The rankings' site is read at most once an hour

    Scenario: A second request within the hour does not read it again
      Given the association croquet names are refreshed at "2026-10-08T10:00:00Z"
      And the association croquet list names "Bill Aldridge"
      When the association croquet names are refreshed at "2026-10-08T10:59:00Z"
      Then "Bill Aldridge" is not kept among the association croquet players

    Scenario: A request after the hour reads it again
      Given the association croquet names are refreshed at "2026-10-08T10:00:00Z"
      And the association croquet list names "Bill Aldridge"
      When the association croquet names are refreshed at "2026-10-08T11:00:00Z"
      Then "Bill Aldridge" is kept among the association croquet players

    Scenario: A list that could not be read is not read again within the hour
      Given the world rankings answer the association croquet list with a failure
      And the association croquet names are refreshed at "2026-10-08T10:00:00Z"
      And the world rankings answer the association croquet list with the list
      When the association croquet names are refreshed at "2026-10-08T10:30:00Z"
      Then "Keith Aiton" is not kept among the association croquet players

    Scenario: A request made before the last one is not held to its hour
      Given the association croquet names are refreshed at "2026-10-08T10:00:00Z"
      And the association croquet list names "Bill Aldridge"
      When the association croquet names are refreshed at "2026-10-08T09:00:00Z"
      Then "Bill Aldridge" is kept among the association croquet players

  Rule: A failure of the site's own keeps nothing and costs no hour

    Scenario: The refresh fails with what failed
      Given the reading of the rankings' lists breaks
      When the association croquet names are refreshed
      Then the refresh failed

    Scenario: The next request reads again
      Given the reading of the rankings' lists breaks
      And the association croquet names are refreshed at "2026-10-08T10:00:00Z"
      And the reading of the rankings' lists is mended
      When the association croquet names are refreshed at "2026-10-08T10:10:00Z"
      Then "Keith Aiton" is kept among the association croquet players

  Rule: A list that gives one name to two players is logged and not emailed

    Scenario: An error is logged
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the association croquet names are refreshed
      Then an error was logged naming "Keith Aiton"

    Scenario: The administrator of the site is not emailed
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the association croquet names are refreshed
      Then the administrator of the site was not emailed about duplicate names
