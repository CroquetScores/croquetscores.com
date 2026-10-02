Feature: Adding a team to a tournament

  A tournament whose format is played by teams (`TournamentFormat.feature`)
  has teams, and a team is added to it with an id of its own, given by
  whatever adds it, a name, a short name, and the flag it flies if it has
  one. What a team is, and what is asked of each of those, is specified with
  the team (`Team.feature`); this says what the tournament asks.

  Only a tournament played by teams has teams. A Standard tournament is played
  between its players (`addPlayer.feature`), and a team in one would be a
  team nothing could play for, so adding one is refused.

  No two teams in a tournament have the same id, since the id is how
  everything else in the tournament says which team it means. No two have the
  same name, since a reader choosing a team from a list could not tell them
  apart, and no two have the same short name, since two tests called "AUS v
  ENG" by different teams could not be told apart either (`addTest.feature`).
  Each is the same however it is capitalised, as a reader would take it to be.
  An archived team keeps its name and its short name, so a team added with
  either is refused: the two could not be told apart if the archived one were
  restored.

  A team is found within its tournament by a slug made from its short name,
  as "2026/ac/spring-tests/teams/aus", since that is the name a reader knows
  it by when there is little room. Two short names that are not the same can
  still make the same slug, as "AÜS" and "AUS" do, and a slug another team
  has is followed by "-01", then "-02", up to "-99", as a competition's is
  (`addBlock.feature`). Should all of them be taken, the slug is followed by
  the team id's own characters. A team keeps its slug when its short name is
  corrected (`updateTeam.feature`), and an archived team keeps its slug, so
  that its address still finds it.

  A team is given an order, and the tournament lists its teams lowest first,
  given as a player's is (`addPlayer.feature`): the first team added is given
  10,000, and each after it 10,000 more than the highest order there is, so
  that a team can later be put between two others without either of them
  moving (`moveTeam.feature`). An archived team keeps an order and it still
  counts.

  An archived tournament can only be restored (`restore.feature`), so adding a
  team to one is refused.

  A scenario that does not say a team's short name gives it the first three
  letters of its name in capitals (`Team.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a team is recorded, and the team is the tournament's

    Scenario: Adding a team records it
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then it has recorded 1 event
      And the first thing it recorded is a team being added

    Scenario: A team added is one of the tournament's teams
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then the tournament has the team "Australia"

    Scenario: A team added is known by the id it was added with
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team id "team/123e4567-e89b-42d3-a456-426614174000"
      When the team "Australia" is added
      Then the tournament's team "Australia" is known by "team/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A team added has the short name it was added with
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "Oz"
      When the team "Australia" is added
      Then the tournament's team "Australia" is known for short as "Oz"

    Scenario: A team added flies the flag it was added flying
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to fly the flag "au"
      When the team "Australia" is added
      Then the tournament's team "Australia" flies the flag "au"

    Scenario: A team added has no players
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then the tournament's team "Australia" has no players

    Scenario: A team added is not archived
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then the tournament's team "Australia" is not archived

    Scenario Outline: A team can be added in every format played by teams
      Given a stream where a tournament was created in the format "<format>"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then the tournament has the team "Australia"

      Examples:
        | format                     |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

    Scenario: A tournament rebuilt after a team was added has the team
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament has the team "Australia"

  Rule: Only a tournament played by teams has teams

    Scenario: Adding a team to a Standard tournament is refused
      Given a stream where a tournament was created in the format "Standard"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then it is refused with "Tournament.NotPlayedByTeams"

  Rule: What a team must be is refused as it is for a team

    Scenario: A name that could not be a team's is refused as a team name is
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS"
      When the team "" is added
      Then it is refused for breaking "TeamName.Missing"

    Scenario: A short name that could not be a team's is refused as a short name is
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "Australasia"
      When the team "Australia" is added
      Then it is refused for breaking "TeamShortName.TooLong"

    Scenario: A short name longer than the name is refused as it is for a team
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS"
      When the team "Oz" is added
      Then it is refused for breaking "Team.ShortNameLongerThanName"

    Scenario: A flag there is not is refused as it is for a team
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to fly the flag "zz"
      When the team "Australia" is added
      Then it is refused for breaking "Team.NoSuchFlag"

  Rule: No two teams in a tournament have the same id

    Scenario: A team with an id another team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it as "team/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the team id "team/123e4567-e89b-42d3-a456-426614174000"
      When the team "England" is added
      Then it is refused with "Tournament.TeamAlreadyAdded"

  Rule: No two teams in a tournament have the same name

    Scenario: A team with a name another team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "OZ"
      When the team "Australia" is added
      Then it is refused with "Tournament.TeamNameTaken"

    Scenario: A name is the same name however it is capitalised
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "OZ"
      When the team "AUSTRALIA" is added
      Then it is refused with "Tournament.TeamNameTaken"

    Scenario: A name an archived team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "OZ"
      When the team "Australia" is added
      Then it is refused with "Tournament.TeamNameTaken"

  Rule: No two teams in a tournament have the same short name

    Scenario: A team with a short name another team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS"
      When the team "Austria" is added
      Then it is refused with "Tournament.TeamShortNameTaken"

    Scenario: A short name is the same short name however it is capitalised
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "aus"
      When the team "Austria" is added
      Then it is refused with "Tournament.TeamShortNameTaken"

    Scenario: A short name an archived team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS"
      When the team "Austria" is added
      Then it is refused with "Tournament.TeamShortNameTaken"

  Rule: A team is found by a slug of its short name that no other team in the tournament has

    Scenario: A team's slug is made from its short name
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS"
      When the team "Australia" is added
      Then the tournament's team "Australia" has the slug "aus"

    Scenario: A slug another team has is followed by "-01"
      Given a stream where a tournament was created in the format "Teams"
      And the team is to be known for short as "AUS"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AÜS"
      When the team "Australia A" is added
      Then the tournament's team "Australia A" has the slug "aus-01"

    Scenario: A slug an archived team has is followed by "-01"
      Given a stream where a tournament was created in the format "Teams"
      And the team is to be known for short as "AUS"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AÜS"
      When the team "Australia A" is added
      Then the tournament's team "Australia A" has the slug "aus-01"

    Scenario: A team's slug is not a competition's to take
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the team is to be known for short as "AUS v ENG"
      When the team "Australia and England" is added
      Then the tournament's team "Australia and England" has the slug "aus-v-eng"

  Rule: Each team added is given 10,000 more than the highest order there is

    Scenario: The first team added is given 10,000
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then the tournament's team "Australia" has the order 10000

    Scenario: The next team is given 10,000 more than the highest order
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Scotland" is added
      Then the tournament's team "Scotland" has the order 30000

    Scenario: An archived team's order still counts
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was archived
      And the tournament is rebuilt from the stream
      When the team "Scotland" is added
      Then the tournament's team "Scotland" has the order 40000

    Scenario: Teams are listed lowest order first
      Given a stream where a tournament was created in the format "Teams"
      And the team "England" was added to it
      And the team "Australia" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first team is "England"
      And the tournament's second team is "Australia"

  Rule: A team cannot be added to an archived tournament

    Scenario: Adding a team to an archived tournament is refused
      Given a stream where a tournament was created in the format "Teams"
      And it was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is added
      Then it is refused with "Tournament.Archived"
