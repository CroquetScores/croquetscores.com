@postgres
Feature: The competitions of a tournament, as its managers and scorers list them

  A manager lists a tournament's competitions to put them in order, archive
  them and restore them, so a manager is answered with every competition the
  tournament has, archived ones among them, in the tournament's order, lowest
  first. Each is answered with its id, its name, its kind — a block, a
  knockout or a Swiss — its slug, which is where it is found under the
  tournament, and whether it is archived.

  Each is answered with how it is played and counted as well: whether it is
  played under handicap, allows drawn results, and counts towards the world
  rankings (`competitionRules.feature`), so that the competition dialog and
  the test dialog begin on what it is.

  Each is answered with its shape too, so that a manager can change it
  starting from what it is (`competition.feature`): what each match of a
  block or a Swiss is the best of, and how many places a knockout's draw has
  and what each of its rounds is the best of, the first round first.

  A tournament played by teams has tests (`addTest.feature`), and each is
  answered as a test, with its two teams, the first first, each by its name
  and its short name, the days it starts and finishes, how many matches it
  is expected to have, what each is the best of, and its group, if any, so
  that the Tests tab can say who meets whom, when and how
  (`tests-tab.feature`). Each is answered with whether it has any games in
  use, as the games say (`Games.feature`), since a test that has keeps its
  teams (`updateTest.feature`), so that the test dialog shows them as they
  are rather than offering to change them. Its name is
  answered as the tournament calls it now, from its teams' short names.

  A scorer lists them to find the one whose scores they are entering
  (`view.feature`). An archived competition is set aside, and there are no
  scores to enter in it, so a scorer is answered with the competitions in use
  alone, in the same order and with the same about each.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers and scorers can ask, since nobody else
  has anything to do with its competitions: anybody else is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `CompetitionsOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`,
  as it is when it asks to change the tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every competition is answered, in the tournament's order

    Scenario: A tournament with no competitions is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then no competitions are answered

    Scenario: The first competition is the lowest in the tournament's order
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the first competition answered is "Block B"

    Scenario: An archived competition is listed
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as archived

    Scenario: A competition not archived is listed as not archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not archived

    Scenario: A competition is listed with its slug
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered with the slug "block-a"

    Scenario Outline: A competition is listed with its kind
      Given "organiser@example.com" has added the <kind> "Final Stage" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Final Stage" is answered as a <kind>

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

  Rule: Every competition is answered with its shape

    Scenario: A block is answered with what each match is the best of
      Given the block is to be the best of 3
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as the best of 3

    Scenario: A block is answered with the rounds it is played in
      Given the block is to be played in 2 rounds
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as played in 2 rounds

    Scenario: A knockout is answered with its places
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the knockout "Main Event" is answered with 4 places

    Scenario: A knockout is answered with what each round is the best of
      Given the knockout's second round is to be the best of 3
      And "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the second round of the knockout "Main Event" is answered as the best of 3

  Rule: Every competition is answered with how it is played and counted

    Scenario: A competition added without saying is answered as not played under handicap
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not played under handicap

    Scenario: A competition played under handicap is answered as such
      Given the competition is to be played under handicap
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as played under handicap

    Scenario: A competition allowing drawn results is answered as such
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as allowing drawn results

    Scenario: A competition counting towards the world rankings is answered as such
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as counting towards the world rankings

    Scenario: A competition not counting towards the world rankings is answered as such
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not counting towards the world rankings

  Rule: A test is answered with its teams and its days

    Scenario: A test is answered as a test
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the competition "AUS v ENG" is answered as a test

    Scenario: A test is answered with its first team
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered with the first team "Australia"

    Scenario: A test is answered with its second team
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered with the second team "England"

    Scenario: A test is answered with the day it starts
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered starting on "2026-10-04"

    Scenario: A test is answered with the day it finishes
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered finishing on "2026-10-05"

    Scenario: A test is answered with the matches it is expected to have
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the test is to be expected to have 21 matches
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered expected to have 21 matches

    Scenario: A test is answered with what each match is the best of
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And each match of the test is to be the best of 3
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the competition "AUS v ENG" is answered as the best of 3

    Scenario: A test is answered with its group
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the test is to be in the group "Group A"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered in the group "Group A"

    Scenario: A test in no group is answered in none
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered in no group

    Scenario: A test with no games is answered as having none
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered as having no games

    Scenario: A test with a game is answered as having games
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the test "AUS v ENG" is answered as having games

    Scenario: A test is answered with the slug it was added with
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Tests"
      Then the competition "AUS v ENG" is answered with the slug "aus-v-eng"

  Rule: A scorer is answered the competitions in use alone

    Scenario: A scorer is answered a competition in use
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not archived

    Scenario: A scorer is not answered an archived competition
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then no competitions are answered

    Scenario: A scorer is answered the competitions in the tournament's order
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then the first competition answered is "Block B"

  Rule: Only a manager or a scorer of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the competitions of a tournament there is not
      Then it is refused with "CompetitionsOfTournament.NoSuchTournament"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" lists the competitions of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the competitions of "Spring Open"
      Then it is refused with "Account.Forgotten"
