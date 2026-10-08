@browser @postgres
Feature: A group of a tournament's tests has a page of how its teams stand

  A test of a tournament played by teams can be in a group, as "Block A"
  (`TestGroup.feature`), and a group is one of the tournament's sections, in
  place of its tests (`tournament.feature`). It leads to the group's own page,
  at the tournament's address followed by "groups" and the group's slug, as
  "/2026/ac/spring-tests/groups/block-a", as the old site's
  "WCF GC World Team Championship Tiers 2 & 3" had a page for Block A, Block B
  and each of its other groups.

  The page shows how the teams of the group stand, in a table as the
  tournament's summary is (`teamSummary.feature`), with the group's teams
  alone and counting the group's tests alone
  (`PublicGroupOfTournament.feature`). The table's first heading, above the
  teams, is the group's name, as the old site's was, and the page is headed by
  it for whatever reads the page aloud, without showing it twice.

  Above the table, in a row of their own as the old site's were, the page
  offers Summary, which is this page, and then each of the group's tests in
  use, in the tournament's order, each said as its teams' short names, as
  "AUS vs ENG", and leading to the test's page. Summary is marked as the one
  being read. A test's page offers the same, with the test marked
  (`test.feature`). Its sections are the tournament's, with the group marked.

  A slug no group of the tournament's tests in use makes is not a page, nor
  is a group of a Standard tournament, of an archived tournament, or of any
  the website never had. An address the tournament has moved on from leads
  to the group where the tournament is now.

  Where a scenario says nothing else, "Spring Tests" is played by teams, its
  teams "Australia", "AUS", with "Pat Player" and "Pam Partner", "England",
  "ENG", with "Kim Keeper" and "Ken Kicker", and "New Zealand", "NZ", with
  "Nat Kiwi" and "Ned Kiwi". Its tests between Australia and England and
  between England and New Zealand are in the group "Block A", and its test
  between Australia and New Zealand in the group "Block B", each expected to
  have 2 matches, each the best of 1.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the team is to be known for short as "AUS"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And the team is to be known for short as "ENG"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And the team is to be known for short as "NZ"
    And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
    And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Nat Kiwi" to the team "New Zealand" of "Spring Tests"
    And "organiser@example.com" has added the player "Ned Kiwi" to the team "New Zealand" of "Spring Tests"
    And the test is to be in the group "Block A"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches
    And "organiser@example.com" has added the test between "England" and "New Zealand" to "Spring Tests"
    And "organiser@example.com" has given the test "ENG v NZ" of "Spring Tests" 2 expected matches
    And the test is to be in the group "Block B"
    And "organiser@example.com" has added the test between "Australia" and "New Zealand" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v NZ" of "Spring Tests" 2 expected matches

  Rule: The page is the group's, for anybody

    Scenario: The page is headed by the group's name
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the page is headed "Block A"

    Scenario: The table's first heading is the group's name
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the summary's first heading is "Block A"

    Scenario: The group's name is not shown above the table
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the page's heading is not shown

    Scenario: A reader not signed in is shown the group
      Given nobody is signed in
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the first team of the summary is "Australia"

  Rule: A row for each of the group's teams, ranked, counting the group's tests alone

    Scenario: The group's teams are ranked
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the first team of the summary is "England"

    Scenario: A team in none of the group's tests has no row
      When the page at "/2026/ac/spring-tests/groups/block-b" is opened
      Then the team "England" is not in the summary

    Scenario: A test of another group counts for nothing here
      Given "Pat Player" has beaten "Nat Kiwi" 26 to 17 in "AUS v NZ" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the fourth number of "Australia" in the summary is "0"

    Scenario: The columns are those of the tournament's summary
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the first column of the teams' summary is headed "Wins" under "Tests"

  Rule: Summary and the group's tests are offered above the table, Summary marked

    Scenario Outline: Summary comes first, then the group's tests in order
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the <place> of the group's links is "<link>"

      Examples:
        | place  | link       |
        | first  | Summary    |
        | second | AUS vs ENG |
        | third  | ENG vs NZ  |

    Scenario: A test of another group is not offered
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group offers 3 links

    Scenario: Summary leads to the group's page
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group's link "Summary" leads to "/2026/ac/spring-tests/groups/block-a"

    Scenario: A test leads to its page under the tests
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group's link "ENG vs NZ" leads to "/2026/ac/spring-tests/tests/eng-v-nz"

    Scenario: Summary is marked as the one being read
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group's link "Summary" is marked as the one being read

    Scenario: A test is not marked
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group's link "AUS vs ENG" is not marked as the one being read

    Scenario: An archived test is not offered
      Given "organiser@example.com" has archived the competition "ENG v NZ" in "Spring Tests"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the group offers 2 links

  Rule: On a phone the page fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the page is no wider than the window

  Rule: Its sections are the tournament's, with the group marked

    Scenario: The group is marked as the section being read
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the section "Block A" is marked as current

    Scenario: Another group is not marked
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the section "Block B" is not marked as current

  Rule: An address with no group a reader is sent to is not a page

    Scenario: A slug no group makes is not found
      When the page at "/2026/ac/spring-tests/groups/block-c" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A Standard tournament has no groups
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/groups/block-a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's group is not found
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the group where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then the address is "/2026/gc/spring-tests/groups/block-a"

    Scenario: An old address in another script leads to the group where the tournament is now
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Кубок"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Кубок"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Кубок"
      And the test is to be in the group "Block A"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Кубок"
      And "organiser@example.com" has moved the tournament "Кубок" to the sport "gc"
      When the page at "/2026/ac/кубок/groups/block-a" is opened
      Then the page is headed "Block A"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the tournament's, the group's and the teams' names, which are
    what its managers called them, and the numbers.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-tests/groups/block-a" is opened
      Then every word in the page's content but the tournament's own is in the test locale
