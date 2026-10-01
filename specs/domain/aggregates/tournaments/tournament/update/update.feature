Feature: Changing what a tournament is

  Everything a tournament was created with can be changed afterwards except
  its id and the website it is run on (`create.feature`). Updating says all of
  it again: the name, when it starts and finishes, the format, the sport, the
  country, the region, the notes, and whether it is played under handicap,
  counts towards the world rankings, is a national or an international event,
  and allows drawn games. What is asked of those together when a tournament is created is
  asked again when it is updated, of the website it was created on.

  A tournament keeps its address when its name is corrected, so that a link
  somebody has already sent still finds it where it was. Its address changes
  only when the year it starts or its sport does, since those are part of it,
  and the tournament is then found at an address made as a new tournament's
  is, in the new year or sport, from its name as it now is. Every address it
  has been found at is kept, so that an old link can be sent on to where it is
  now, and an address it was found at once is its own to go back to: it still
  leads to it, and whatever says which addresses are taken does not count it
  as somebody else's.

  Whether a tournament is played by teams is in its format
  (`TournamentFormat.feature`), and it decides what the tournament holds: a
  Standard tournament has players and blocks, knockouts and Swiss, and one
  played by teams has teams and tests (`addTeam.feature`, `addTest.feature`).
  So once a tournament holds any of them, archived ones counting, an update
  that would change whether it is played by teams is refused: what it held
  would be things it could no longer have. One format played by teams can be
  changed for another, since the tournament holds the same things in each,
  and a tournament that holds nothing yet can be changed to any format its
  website's site offers. A tournament's days changed leave its tests as they
  were (`addTest.feature`).

  An update that changes nothing records nothing, because nothing happened.

  An archived tournament can only be restored (`restore.feature`), so
  updating one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: An update is recorded, and is what the tournament is

    Scenario: Updating records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open Championship"
      When the tournament is updated
      Then it has recorded 1 event
      And the first thing it recorded is its update

    Scenario: An updated tournament has its new name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open Championship"
      When the tournament is updated
      Then the tournament is called "Spring Open Championship"

    Scenario: An updated tournament finishes when it was updated to
      Given a stream where a tournament was created finishing at "2026-10-05T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the update finishes it at "2026-10-06T00:00:00Z"
      When the tournament is updated
      Then the tournament finishes at "2026-10-06T00:00:00.000Z"

    Scenario: An updated tournament is in the format it was updated to
      Given a stream where a tournament was created in the format "Standard"
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then the tournament is played in the format "Teams"

    Scenario: An updated tournament is in the region it was updated to
      Given a stream where a tournament was created in the region "vic" of "au"
      And the tournament is rebuilt from the stream
      And the update puts it in the region "nsw"
      When the tournament is updated
      Then the tournament is played in the region "nsw"

    Scenario: An updated tournament has the notes it was updated with
      Given a stream where a tournament was created with no notes
      And the tournament is rebuilt from the stream
      And the update gives it the notes "Lunch is at noon."
      When the tournament is updated
      Then the tournament's notes are "Lunch is at noon."

    Scenario: An updated tournament is played under handicap when it was updated to be
      Given a stream where a tournament was created not played under handicap
      And the tournament is rebuilt from the stream
      And the update plays it under handicap
      When the tournament is updated
      Then the tournament is played under handicap

    Scenario: An updated tournament allows drawn games when it was updated to
      Given a stream where a tournament was created not allowing drawn games
      And the tournament is rebuilt from the stream
      And the update allows drawn games
      When the tournament is updated
      Then the tournament allows drawn games

    Scenario: An updated tournament no longer allows drawn games when it was updated not to
      Given a stream where a tournament was created allowing drawn games
      And the tournament is rebuilt from the stream
      And the update does not allow drawn games
      When the tournament is updated
      Then the tournament does not allow drawn games

    Scenario: An updated tournament is on the website it was created on
      Given a stream where a tournament was created on the website "gateballscores.com"
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open Championship"
      When the tournament is updated
      Then the tournament is on the website "gateballscores.com"

    Scenario: A tournament rebuilt after an update is as the update left it
      Given a stream where a tournament was created as "Spring Open"
      And it was updated with the name "Spring Open Championship"
      When the tournament is rebuilt from the stream
      Then the tournament is called "Spring Open Championship"

  Rule: What is asked of a new tournament is asked of an updated one

    Scenario: Updating to a sport the website's site does not offer is refused
      Given a stream where a tournament was created on the website "croquetscores.com"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "gb"
      When the tournament is updated
      Then it is refused with "Tournament.SportNotOffered"

    Scenario: Updating to a format the website's site does not offer is refused
      Given a stream where a tournament was created on the website "gateballscores.com"
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then it is refused with "Tournament.FormatNotOffered"

    Scenario: Updating to finish before the tournament starts is refused
      Given a stream where a tournament was created starting at "2026-10-03T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the update finishes it at "2026-10-02T00:00:00Z"
      When the tournament is updated
      Then it is refused with "Tournament.FinishesBeforeStarts"

    Scenario: Updating to start in the year after next is refused
      Given a stream where a tournament was created starting at "2026-10-03T00:00:00Z"
      And the tournament is rebuilt from the stream
      And the update starts it at "2028-01-01T00:00:00Z"
      And the update finishes it at "2028-01-02T00:00:00Z"
      When the tournament is updated
      Then it is refused with "Tournament.StartsAfterNextYear"

    Scenario: Updating to a region of another country is refused
      Given a stream where a tournament was created in the region "vic" of "au"
      And the tournament is rebuilt from the stream
      And the update puts it in the region "can"
      When the tournament is updated
      Then it is refused with "Tournament.RegionNotInCountry"

    Scenario: Updating a tournament in world rankings to be played under handicap is refused
      Given a stream where a tournament was created in the sport "ac"
      And it was created counting towards the world rankings
      And the tournament is rebuilt from the stream
      And the update plays it under handicap
      When the tournament is updated
      Then it is refused with "Tournament.HandicapInWorldRankings"

    Scenario: Updating a tournament in world rankings to allow drawn games is refused
      Given a stream where a tournament was created in the sport "ac"
      And it was created counting towards the world rankings
      And the tournament is rebuilt from the stream
      And the update allows drawn games
      When the tournament is updated
      Then it is refused with "Tournament.DrawsInWorldRankings"

    Scenario: Updating to a sport without world rankings while counting towards them is refused
      Given a stream where a tournament was created in the sport "ac"
      And it was created counting towards the world rankings
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "a6w"
      When the tournament is updated
      Then it is refused with "Tournament.NoWorldRankings"

    Scenario: Updating to be both national and international is refused
      Given a stream where a tournament was created as a national event
      And the tournament is rebuilt from the stream
      And the update makes it an international event
      When the tournament is updated
      Then it is refused with "Tournament.NationalAndInternational"

  Rule: A tournament keeps its address unless the year it starts or its sport changes

    Scenario: Correcting the name leaves the tournament where it was
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update calls it "Autumn Open"
      When the tournament is updated
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: Moving the start within the year leaves the tournament where it was
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update starts it at "2026-11-07T00:00:00Z"
      And the update finishes it at "2026-11-08T00:00:00Z"
      When the tournament is updated
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: Moving the start into another year finds the tournament in that year
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update starts it at "2027-10-02T00:00:00Z"
      And the update finishes it at "2027-10-03T00:00:00Z"
      When the tournament is updated
      Then the tournament is found at "2027/ac/spring-open"

    Scenario: Changing the sport finds the tournament in that sport
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "gc"
      When the tournament is updated
      Then the tournament is found at "2026/gc/spring-open"

    Scenario: A new address is made from the name as it now is
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "gc"
      And the update calls it "Autumn Open"
      When the tournament is updated
      Then the tournament is found at "2026/gc/autumn-open"

    Scenario: A new address somebody else has is followed by "-01"
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the address "2026/gc/spring-open" is taken
      And the update plays it in the sport "gc"
      When the tournament is updated
      Then the tournament is found at "2026/gc/spring-open-01"

  Rule: Every address a tournament has been found at is kept

    Scenario: A tournament whose address changed has been found at both
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "gc"
      When the tournament is updated
      Then the tournament has been found at "2026/ac/spring-open"
      And the tournament has been found at "2026/gc/spring-open"

    Scenario: A tournament rebuilt after its address changed has been found at both
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And it was updated with the sport "gc"
      When the tournament is rebuilt from the stream
      Then the tournament has been found at "2026/ac/spring-open"
      And the tournament has been found at "2026/gc/spring-open"

    Scenario: A tournament goes back to an address it was found at before
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And it was updated with the sport "gc"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "ac"
      When the tournament is updated
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: Going back to an address it was found at before keeps it once
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And it was updated with the sport "gc"
      And the tournament is rebuilt from the stream
      And the update plays it in the sport "ac"
      When the tournament is updated
      Then the tournament has been found at 2 addresses

  Rule: A tournament that holds anything keeps whether it is played by teams

    Scenario: A Standard tournament with no players or competitions can be played by teams
      Given a stream where a tournament was created in the format "Standard"
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then the tournament is played in the format "Teams"

    Scenario: A Standard tournament with a player cannot be played by teams
      Given a stream where a tournament was created in the format "Standard"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then it is refused with "Tournament.PlayedByTeamsFixed"

    Scenario: A Standard tournament with an archived player cannot be played by teams
      Given a stream where a tournament was created in the format "Standard"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then it is refused with "Tournament.PlayedByTeamsFixed"

    Scenario: A Standard tournament with a competition cannot be played by teams
      Given a stream where a tournament was created in the format "Standard"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Teams"
      When the tournament is updated
      Then it is refused with "Tournament.PlayedByTeamsFixed"

    Scenario: A tournament with a team cannot be made Standard
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Standard"
      When the tournament is updated
      Then it is refused with "Tournament.PlayedByTeamsFixed"

    Scenario: A tournament with a team can be played in another format played by teams
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Eire Cup"
      When the tournament is updated
      Then the tournament is played in the format "Eire Cup"

    Scenario: A tournament with a team keeps it when played in another format played by teams
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Eire Cup"
      When the tournament is updated
      Then the tournament has the team "Australia"

    Scenario: A tournament played by teams with no teams can be made Standard
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the update plays it in the format "Standard"
      When the tournament is updated
      Then the tournament is played in the format "Standard"

  Rule: A tournament's days changed leave its tests as they were

    Scenario: A tournament made to start after its test starts keeps the test
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the update starts it at "2026-10-04T00:00:00Z"
      And the update finishes it at "2026-10-05T00:00:00Z"
      When the tournament is updated
      Then the test "AUS v ENG" starts on "2026-10-03"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a tournament to what it already is records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open"
      When the tournament is updated
      Then it has recorded 0 events

    Scenario: Updating a tournament to what it already is is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open"
      When the tournament is updated
      Then it is not refused

  Rule: An archived tournament cannot be updated

    Scenario: Updating an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open Championship"
      When the tournament is updated
      Then it is refused with "Tournament.Archived"
