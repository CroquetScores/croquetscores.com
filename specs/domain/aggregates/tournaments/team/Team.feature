Feature: A team in a tournament

  A tournament whose format is played by teams (`TournamentFormat.feature`) is
  played between teams rather than between players entered one by one, and a
  team belongs to that tournament alone. The same side playing in two
  tournaments is a team in each, with an id in each, since who plays for it
  changes from one to the next.

  A team has a name, as a team name is (`TeamName.feature`), and a short name
  (`TeamShortName.feature`), which is what its tests are called by
  (`addTest.feature`). The short name is never longer than the name, counted
  as a reader counts them, since a short name longer than the name it
  shortens is the two typed the wrong way round; one as long as the name is
  accepted, since some names, "Wales" among them, are short already. Neither
  value knows the other, so this is the team's to refuse, whether it is made
  or updated. It may fly a flag, shown beside its name, and it is
  optional, since a team of a club or a region may have none. A flag, when
  there is one, is one of the flags there are, found by its name as a flag
  is, so "NZ" is New Zealand's, and a name that is no flag there is is
  refused, as it is for a player (`TournamentPlayer.feature`).

  A team keeps its own players (`TeamPlayer.feature`): who plays for it is the
  team's, not the tournament's, and a player in one team is nobody in
  another. What is asked of a team's players when they are added, changed,
  archived, restored and put in order is the tournament's to say, since it is
  the tournament that is asked (`addTeamPlayer.feature` and those beside it);
  a team begins with none.

  A team has an order, which is where it comes when the tournament lists its
  teams, lowest first, and is a whole number from 1 up. How the orders are
  given is the tournament's to say (`addTeam.feature`), as it is for players.

  A team can be archived: kept, with everything it is and every one of its
  players, but set aside, so that a team added by mistake is out of the way.
  A team playing in a test cannot be archived, since the test would then be
  against a team that is no longer there. The tests are the tournament's to
  know, not the team's, so the tournament says whether the team is in any
  when it asks for it to be archived. An archived team can be restored, and
  that is all that can be done to it until it is: it is not changed, nothing
  is done to its players, and it is not moved.

  A team can be updated: its name, its short name and its flag said again,
  each asked what it is asked of a new team. The team updated is the same
  team, with the same id, the same players and the same order.

  A team is never altered: updating, giving a new order, archiving and
  restoring each give the team as it is afterwards. Asking for what a team
  already is — archiving one that is archived, restoring one that is not —
  gives it back as it is.

  Two teams are the same team when their ids are, whatever they are called.

  A scenario that does not say a team's short name gives it the first three
  letters of its name in capitals, "AUS" for "Australia", so that a scenario
  about something else need not say it.

  Rule: A team has a team name and a short name

    Scenario: A team's name is kept as it was given
      When a team named "Australia" is made
      Then the team's name is "Australia"

    Scenario: A team's short name is kept as it was given
      When a team known for short as "Oz" is made
      Then the team's short name is "Oz"

    Scenario: A name that could not be a team's is refused as a team name is
      When a team named "" is made
      Then it is refused for breaking "TeamName.Missing"

    Scenario: A short name that could not be a team's is refused as a short name is
      When a team known for short as "Australasia" is made
      Then it is refused for breaking "TeamShortName.TooLong"

  Rule: A team's short name is no longer than its name

    Scenario: A short name shorter than the name is accepted
      When a team named "Australia" known for short as "AUS" is made
      Then it is not refused

    Scenario: A short name as long as the name is accepted
      When a team named "Wales" known for short as "Wales" is made
      Then it is not refused

    Scenario: A short name longer than the name is refused
      When a team named "Oz" known for short as "AUS" is made
      Then it is refused for breaking "Team.ShortNameLongerThanName"

    Scenario: Characters are counted as a reader counts them
      When a team named "Éire" known for short as "Eire" is made with each accent typed after its letter
      Then it is not refused

    Scenario: A team updated to a short name longer than its name is refused
      Given a team named "Australia"
      When the team is updated to be known for short as "Australian"
      Then it is refused for breaking "Team.ShortNameLongerThanName"

    Scenario: A team updated to a name shorter than its short name is refused
      Given a team named "Australia" known for short as "AUS"
      When the team is updated to be called "Oz"
      Then it is refused for breaking "Team.ShortNameLongerThanName"

  Rule: A team may fly one of the flags there are

    Scenario: A team flies the flag it was given
      When a team flying the flag "au" is made
      Then the team flies the flag "au"

    Scenario: A flag given in capitals is the flag in lower case
      When a team flying the flag "AU" is made
      Then the team flies the flag "au"

    Scenario: A team need not fly a flag
      When a team flying no flag is made
      Then the team flies no flag

    Scenario: A name that is no flag there is is refused
      When a team flying the flag "zz" is made
      Then it is refused for breaking "Team.NoSuchFlag"

  Rule: A new team has no players and is not archived

    Scenario: A new team has no players
      When a team named "Australia" is made
      Then the team has no players

    Scenario: A new team is not archived
      When a team named "Australia" is made
      Then the team is not archived

  Rule: A team's order is a whole number from 10,000 up

    Scenario Outline: An order that is a whole number from 10,000 up is accepted
      When a team in the order <order> is made
      Then the team's order is <order>

      Examples:
        | order |
        | 10000 |
        | 20000 |

    Scenario: An order of 0 is refused
      When a team in the order 0 is made
      Then it is refused for breaking "Team.OrderTooSmall"

    Scenario: An order that is not a whole number is refused
      When a team in the order 1.5 is made
      Then it is refused for breaking "Team.OrderNotWhole"

    Scenario: A team given a new order has it
      Given a team named "Australia" in the order 10000
      When the team is given the order 5000
      Then the team's order is 5000

    Scenario: A team given a new order is the same team it was
      Given a team named "Australia" in the order 10000
      When the team is given the order 5000
      Then the team is the same team it was

  Rule: A team can be updated, and is the same team afterwards

    Scenario: An updated team has the name it was updated to
      Given a team named "Australia"
      When the team is updated to be called "Australia A"
      Then the team's name is "Australia A"

    Scenario: An updated team has the short name it was updated to
      Given a team named "Australia"
      When the team is updated to be known for short as "AUS A"
      Then the team's short name is "AUS A"

    Scenario: An updated team flies the flag it was updated to
      Given a team named "Australia"
      When the team is updated to fly the flag "au"
      Then the team flies the flag "au"

    Scenario: An updated team is the same team it was
      Given a team named "Australia"
      When the team is updated to be called "Australia A"
      Then the team is the same team it was

    Scenario: An updated team keeps its order
      Given a team named "Australia" in the order 20000
      When the team is updated to be called "Australia A"
      Then the team's order is 20000

    Scenario: An updated team keeps its players
      Given a team named "Australia"
      And the player "Sam Someone" is one of the team's
      When the team is updated to be called "Australia A"
      Then the team has the player "Sam Someone"

    Scenario: A flag there is not is refused as it is for a new team
      Given a team named "Australia"
      When the team is updated to fly the flag "zz"
      Then it is refused for breaking "Team.NoSuchFlag"

  Rule: A team in no test can be archived, and restored

    Scenario: A team in no test that is archived is archived
      Given a team named "Australia"
      And the tournament says the team is in no test
      When the tournament archives the team
      Then the team is archived

    Scenario: A team in a test cannot be archived
      Given a team named "Australia"
      And the tournament says the team is in a test
      When the tournament archives the team
      Then it is refused for breaking "Team.InATest"

    Scenario: An archived team keeps its players
      Given a team named "Australia"
      And the player "Sam Someone" is one of the team's
      And the tournament says the team is in no test
      When the tournament archives the team
      Then the team has the player "Sam Someone"

    Scenario: An archived team that is restored is not archived
      Given a team named "Australia" that is archived
      When the tournament restores the team
      Then the team is not archived

    Scenario: An archived team that is archived again is still archived
      Given a team named "Australia" that is archived
      And the tournament says the team is in no test
      When the tournament archives the team
      Then it is not refused
      And the team is archived

    Scenario: Restoring a team that is not archived leaves it not archived
      Given a team named "Australia"
      When the tournament restores the team
      Then it is not refused
      And the team is not archived

  Rule: An archived team can only be restored

    Scenario: An archived team cannot be updated
      Given a team named "Australia" that is archived
      When the team is updated to be called "Australia A"
      Then it is refused for breaking "Team.Archived"

    Scenario: An archived team cannot be moved
      Given a team named "Australia" that is archived
      When the tournament asks whether the team can be moved
      Then it is refused for breaking "Team.Archived"

    Scenario: A team that is not archived can be moved
      Given a team named "Australia"
      When the tournament asks whether the team can be moved
      Then it is not refused

    Scenario: An archived team cannot have its players changed
      Given a team named "Australia" that is archived
      When the tournament asks whether the team's players can be changed
      Then it is refused for breaking "Team.Archived"

    Scenario: A team that is not archived can have its players changed
      Given a team named "Australia"
      When the tournament asks whether the team's players can be changed
      Then it is not refused

  Rule: Two teams are the same when their ids are

    Scenario: Teams with the same id and different names are the same team
      Given a team named "Australia"
      And another team with the same id named "Australia A"
      When the teams are compared
      Then they are the same team

    Scenario: Teams with different ids and the same name are different teams
      Given a team named "Australia"
      And another team named "Australia"
      When the teams are compared
      Then they are different teams
