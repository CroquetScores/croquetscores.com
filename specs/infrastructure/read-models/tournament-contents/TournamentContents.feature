@postgres
Feature: What is in a tournament, kept for the API

  The API tells an app what is in a tournament: its players, its teams and
  their players, and its competitions (`tournament.feature`,
  `competition.feature`). It asks the events nothing, so a read model keeps
  it, as the tournament's own events say it.

  A player is kept with their name, the name the world rankings know them by,
  which is their name where none was given, their handicap, who they represent
  and whether they are archived. A team is kept with its name, its short name,
  its place and whether it is archived, and each of its players as a player
  is. A competition is kept, in the table of competitions every read model of
  tournaments is built on (`Tournaments.feature`), with its name, which kind it
  is (a block, a Swiss, a knockout or a test), its slug, its place in the
  tournament's order, and, for a test, its two teams. A test is called by its
  two teams' short names, and another when either team is called another.

  It is kept event by event, so that an event changes only the rows it is
  about: a player added is a row of players and nothing else. It is written
  from the tournament's own events and none other, so no stream has to come
  before another when the read models are made again. The projection is safe
  to run twice, as rebuilding the read model does.

  Where a scenario names no website, the tournament is on croquetscores.com,
  is for the sport "ac", and is played in the region "vic" of the country "au".

  Background:
    Given the tournament contents read model
    And a tournament "Spring Open" to start on "2026-10-03"
    And "Spring Open" is created by the account for "organiser@example.com"

  Rule: A player is kept as the tournament says them

    Scenario: A player added is kept
      Given the player "Sam Someone" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the players read are "Sam Someone"

    Scenario: A player is kept by their name, which is the world ranking name where none was given
      Given the player "Sam Someone" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the world ranking name "Sam Someone"

    Scenario: A player added with a world ranking name keeps it
      Given the player "Sam Someone" is added to "Spring Open" with the world ranking name "Samuel Someone"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the world ranking name "Samuel Someone"

    Scenario: A player added with a handicap keeps it
      Given the player "Sam Someone" is added to "Spring Open" with the handicap "5"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the handicap "5"

    Scenario: A player added with no handicap has none
      Given the player "Sam Someone" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with no handicap

    Scenario: A player added who represents a club keeps it
      Given the player "Sam Someone" is added to "Spring Open" representing "Sydney"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read representing "Sydney"

    Scenario: A player renamed is kept under the new name
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is renamed "Samuel Someone"
      When "Spring Open" is read for an app
      Then the players read are "Samuel Someone"

    Scenario: A player renamed with no world ranking name is known by the new name
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is renamed "Samuel Someone"
      When "Spring Open" is read for an app
      Then the player "Samuel Someone" is read with the world ranking name "Samuel Someone"

    Scenario: A player given a world ranking name keeps it
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is given the world ranking name "Samuel Someone"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the world ranking name "Samuel Someone"

    Scenario: A player given a handicap keeps it
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is given the handicap "-2"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the handicap "-2"

    Scenario Outline: A handicap is kept as the number it is
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is given the handicap "<written>"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read with the handicap "<read>"

      Examples:
        | written | read |
        | +4      | 4    |
        | 4.0     | 4    |
        | 4.5     | 4.5  |
        | -1.5    | -1.5 |
        | 12.0    | 12   |

    Scenario: A player made to represent a club keeps it
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is made to represent "Sydney"
      When "Spring Open" is read for an app
      Then the player "Sam Someone" is read representing "Sydney"

    Scenario: A player archived is not read
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Alex Another" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is archived
      When "Spring Open" is read for an app
      Then the players read are "Alex Another"

    Scenario: A player restored is read again
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is archived
      And the player "Sam Someone" of "Spring Open" is restored
      When "Spring Open" is read for an app
      Then the players read are "Sam Someone"

    Scenario: The players are read by name
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Alex Another" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the players read are "Alex Another" and "Sam Someone"

    Scenario: A player added to another tournament is not read
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And the player "Sam Someone" is added to "Autumn Open"
      When "Spring Open" is read for an app
      Then no players are read

    Scenario: A player added changes no competition
      Given a block called "Block A" is added to "Spring Open"
      And the player "Sam Someone" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block A"

  Rule: A team and its players are kept as the tournament says them

    Background:
      Given "Spring Open" is played by teams

    Scenario: A team added is kept
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      When "Spring Open" is read for an app
      Then the teams read are "Australia"

    Scenario: A team is kept with its short name
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the short name "AUS"

    Scenario: A team renamed is kept under the new name
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "Australia" of "Spring Open" is renamed "Aussies"
      When "Spring Open" is read for an app
      Then the teams read are "Aussies"

    Scenario: A team given a short name keeps it
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "Australia" of "Spring Open" is given the short name "AU"
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the short name "AU"

    Scenario: A team archived is not read
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "England" is added to "Spring Open" with the short name "ENG"
      And the team "Australia" of "Spring Open" is archived
      When "Spring Open" is read for an app
      Then the teams read are "England"

    Scenario: A team restored is read again
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "Australia" of "Spring Open" is archived
      And the team "Australia" of "Spring Open" is restored
      When "Spring Open" is read for an app
      Then the teams read are "Australia"

    Scenario: The teams are read in the tournament's order
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "England" is added to "Spring Open" with the short name "ENG"
      When "Spring Open" is read for an app
      Then the teams read are "Australia" and "England"

    Scenario: A team moved is read in its new place
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "England" is added to "Spring Open" with the short name "ENG"
      And the team "England" of "Spring Open" is moved up
      When "Spring Open" is read for an app
      Then the teams read are "England" and "Australia"

    Scenario: A player of a team is kept
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the players "Pat Player"

    Scenario: A player of a team is kept with the world ranking name they are known by
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      When "Spring Open" is read for an app
      Then the player "Pat Player" of the team "Australia" is read with the world ranking name "Pat Player"

    Scenario: A player of a team renamed is kept under the new name
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the player "Pat Player" of the team "Australia" of "Spring Open" is renamed "Patrick Player"
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the players "Patrick Player"

    Scenario: A player of a team archived is not read
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the player "Pat Player" of the team "Australia" of "Spring Open" is archived
      When "Spring Open" is read for an app
      Then the team "Australia" is read with no players

    Scenario: A player of a team restored is read again
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the player "Pat Player" of the team "Australia" of "Spring Open" is archived
      And the player "Pat Player" of the team "Australia" of "Spring Open" is restored
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the players "Pat Player"

    Scenario: The players of a team are read by name
      Given the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Sam Someone" is added to the team "Australia" of "Spring Open"
      And the player "Alex Another" is added to the team "Australia" of "Spring Open"
      When "Spring Open" is read for an app
      Then the team "Australia" is read with the players "Alex Another" and "Sam Someone"

  Rule: A competition is kept as the tournament says it

    Scenario: A block is kept with its name and kind
      Given a block called "Block A" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "Block A" is read as a block

    Scenario: A Swiss is kept as a Swiss
      Given a Swiss called "Swiss A" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "Swiss A" is read as a swiss

    Scenario: A knockout is kept as a knockout
      Given a knockout called "Knockout A" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "Knockout A" is read as a knockout

    Scenario: A competition is kept where its page is found
      Given a block called "Block A" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "Block A" is read at the address "2026/ac/spring-open/competitions/block-a"

    Scenario: A block renamed is kept under the new name
      Given a block called "Block A" is added to "Spring Open"
      And the block "Block A" of "Spring Open" is renamed "Block Z"
      When "Spring Open" is read for an app
      Then the competitions read are "Block Z"

    Scenario: A renamed competition is still found where it was
      Given a block called "Block A" is added to "Spring Open"
      And the block "Block A" of "Spring Open" is renamed "Block Z"
      When "Spring Open" is read for an app
      Then the competition "Block Z" is read at the address "2026/ac/spring-open/competitions/block-a"

    Scenario: The competitions are read in the tournament's order
      Given a block called "Block A" is added to "Spring Open"
      And a block called "Block B" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block A" and "Block B"

    Scenario: A competition moved is read in its new place
      Given a block called "Block A" is added to "Spring Open"
      And a block called "Block B" is added to "Spring Open"
      And the block "Block B" is moved up in "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block B" and "Block A"

    Scenario: A competition archived is not read
      Given a block called "Block A" is added to "Spring Open"
      And a block called "Block B" is added to "Spring Open"
      And the block "Block A" is archived in "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block B"

    Scenario: A competition restored is read again, as it was named when it was archived
      Given a block called "Block A" is added to "Spring Open"
      And the block "Block A" is archived in "Spring Open"
      And the block "Block A" is restored in "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block A (1)"

    Scenario: A competition archived is given a number after its name so that the name can be used again
      Given a block called "Block A" is added to "Spring Open"
      And the block "Block A" is archived in "Spring Open"
      And a block called "Block A" is added again to "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "Block A"

    Scenario: A competition of another tournament is not read
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And a block called "Block A" is added to "Autumn Open"
      When "Spring Open" is read for an app
      Then no competitions are read

  Rule: A test is called by its two teams' short names

    Background:
      Given "Spring Open" is played by teams
      And the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "England" is added to "Spring Open" with the short name "ENG"

    Scenario: A test is kept as a test
      Given the test between "Australia" and "England" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "AUS v ENG" is read as a test

    Scenario: A test is kept where its page is found
      Given the test between "Australia" and "England" is added to "Spring Open"
      When "Spring Open" is read for an app
      Then the competition "AUS v ENG" is read at the address "2026/ac/spring-open/tests/aus-v-eng"

    Scenario: A test is called another name when a team is
      Given the test between "Australia" and "England" is added to "Spring Open"
      And the team "England" of "Spring Open" is given the short name "EN"
      When "Spring Open" is read for an app
      Then the competitions read are "AUS v EN"

    Scenario: A test archived is not called another name when a team is
      Given the test between "Australia" and "England" is added to "Spring Open"
      And the test "AUS v ENG" is archived in "Spring Open"
      And the team "England" of "Spring Open" is given the short name "EN"
      And the test "AUS v ENG" is restored in "Spring Open"
      When "Spring Open" is read for an app
      Then the competitions read are "AUS v ENG (1)"

  Rule: What is read is of the tournament asked for

    Scenario: A tournament there is not is not read
      When a tournament there is not is read for an app
      Then no tournament is read

    Scenario: A tournament archived is not read
      Given "Spring Open" is archived
      When "Spring Open" is read for an app
      Then no tournament is read

    Scenario: A tournament on another website is not read
      When "Spring Open" is read for an app on the website "gateballscores.com"
      Then no tournament is read

    Scenario: A competition is read of its own tournament
      Given a block called "Block A" is added to "Spring Open"
      When the competition "Block A" of "Spring Open" is read for an app
      Then the competition is found

    Scenario: A competition archived is not found
      Given a block called "Block A" is added to "Spring Open"
      And the block "Block A" is archived in "Spring Open"
      When the competition "Block A" of "Spring Open" is read for an app
      Then no competition is found

    Scenario: A competition of another tournament is not found
      Given a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And a block called "Block A" is added to "Autumn Open"
      When the competition "Block A" of "Autumn Open" is read for an app as one of "Spring Open"
      Then no competition is found

    Scenario: A competition of a tournament there is not is not found
      When a competition of a tournament there is not is read for an app
      Then no tournament is found

  Rule: A tournament's players are kept as its players' pages find them

    The players' pages (`TournamentPages.feature`) lead to a player by the
    slug that finds them within the tournament, as the tournament gave it when
    they were added.

    Scenario: A player of a team is kept with the slug that finds them
      Given "Spring Open" is played by teams
      And the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      When the people of "Spring Open" are read back for its pages
      Then the player "Pat Player" of the team "Australia" is read with the slug "pat-player"

    Scenario: A player of a team is kept with the slug they were added with, though they are renamed
      Given "Spring Open" is played by teams
      And the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the player "Pat Player" of the team "Australia" of "Spring Open" is renamed "Patricia Player"
      When the people of "Spring Open" are read back for its pages
      Then the player "Patricia Player" of the team "Australia" is read with the slug "pat-player"

    Scenario: A player archived is kept, as archived
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is archived
      When the people of "Spring Open" are read back for its pages
      Then the player "Sam Someone" is read as archived

    Scenario: A team's player archived is kept, as archived
      Given "Spring Open" is played by teams
      And the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the player "Pat Player" of the team "Australia" of "Spring Open" is archived
      When the people of "Spring Open" are read back for its pages
      Then the player "Pat Player" of the team "Australia" is read as archived

  Rule: A player kept before their slug was is read back only where nobody is sent to them

    A player's slug is what a page leads to them by, so a player a reader is
    sent to who has none would be led to the wrong page. The read models are
    made again to give them one, and until then the pages are refused rather
    than wrong. An archived player is sent to by nobody, so one without a slug
    is no reason to refuse the page of everybody else.

    Scenario: An archived player with no slug kept is still read back
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is archived
      And the slug kept for "Sam Someone" of "Spring Open" is lost
      When the people of "Spring Open" are read back for its pages
      Then the player "Sam Someone" is read with no slug

    Scenario: A player with no slug kept is not read back
      Given the player "Sam Someone" is added to "Spring Open"
      And the slug kept for "Sam Someone" of "Spring Open" is lost
      When the people of "Spring Open" are read back for its pages
      Then the people are not read back

  Rule: Projecting the same events again changes nothing

    Scenario: A player projected twice is one player
      Given the player "Sam Someone" is added to "Spring Open"
      When its events are projected again
      And "Spring Open" is read for an app
      Then the players read are "Sam Someone"

    Scenario: A player archived and projected twice is still archived
      Given the player "Sam Someone" is added to "Spring Open"
      And the player "Sam Someone" of "Spring Open" is archived
      When its events are projected again
      And "Spring Open" is read for an app
      Then no players are read

    Scenario: A competition projected twice is one competition
      Given a block called "Block A" is added to "Spring Open"
      When its events are projected again
      And "Spring Open" is read for an app
      Then the competitions read are "Block A"

  Rule: The read model is rebuilt from the events alone

    Every scenario here says the rebuild did not fail as well as what is read
    afterwards, because a rebuild that fails is rolled back with the
    transaction it ran in, which leaves the tables as they were.

    Scenario: A tournament's contents rebuilt are read as they were
      Given the player "Sam Someone" is added to "Spring Open" with the handicap "5"
      And the player "Alex Another" is added to "Spring Open"
      And the player "Alex Another" of "Spring Open" is archived
      And a block called "Block A" is added to "Spring Open"
      And a block called "Block B" is added to "Spring Open"
      And the block "Block B" is moved up in "Spring Open"
      When the read model is rebuilt from the events
      And "Spring Open" is read for an app
      Then it is rebuilt without failing
      And the players read are "Sam Someone"
      And the player "Sam Someone" is read with the handicap "5"
      And the competitions read are "Block B" and "Block A"

    Scenario: A tournament played by teams rebuilt is read as it was
      Given "Spring Open" is played by teams
      And the team "Australia" is added to "Spring Open" with the short name "AUS"
      And the team "England" is added to "Spring Open" with the short name "ENG"
      And the player "Pat Player" is added to the team "Australia" of "Spring Open"
      And the test between "Australia" and "England" is added to "Spring Open"
      And the team "England" of "Spring Open" is given the short name "EN"
      When the read model is rebuilt from the events
      And "Spring Open" is read for an app
      Then it is rebuilt without failing
      And the teams read are "Australia" and "England"
      And the team "Australia" is read with the players "Pat Player"
      And the competitions read are "AUS v EN"

    Scenario: A rebuild with the competitions' streams first is read as it was
      Given a block called "Block A" is added to "Spring Open"
      And the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And "Spring Open" is read for an app
      Then it is rebuilt without failing
      And the competitions read are "Block A"
