@postgres
Feature: Importing each of the old sites' tournaments with everything that names it

  The old sites kept a tournament as a document, and everything of it as
  documents of their own that name it: its players in one, each block,
  knockout, Swiss and team match in another, and each commentary in
  another. A tournament is brought over whole: its own document is read,
  then every document that names it, and the tournament is brought over,
  then its players, then its competitions, then its commentaries. Its
  competitions are added in the order it listed them, so that nothing has
  to be put in order afterwards.

  What is brought over of each document is said where it always was: the
  tournament in `ImportTournaments.feature`, its players in
  `ImportTournamentPlayers.feature`, a competition in
  `importCompetition.feature` and the feature of its kind, a team match in
  `ImportTeamMatches.feature`, a commentary in `ImportCommentaries.feature`.
  What is said here is which documents are a tournament's, the order they go
  in, and what happens when one of them, or the tournament itself, is refused
  or archived.

  A document is the tournament's because it names the tournament, not
  because the tournament lists it. The old sites took an archived
  competition out of the list and left it naming the tournament, and some
  competitions not archived are missing from the list too. Going by the list
  would leave those behind without a word.

  But a tournament that lists no competition at all is left behind, with
  everything that names it, as an archived one is: the old sites kept
  tournaments that were started and never played, and one with nothing
  listed is taken for one of those, even where something names it. The
  scenarios here are of a tournament that lists a competition no document
  is, unless they say otherwise.

  Background:
    Given the users are imported
    And the tournaments are imported
    And a tournament "tournaments/12" on "croquetscores.com"

  Rule: Everything that names a tournament is brought over with it

    Scenario: The tournament's players are brought over
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 7 is called "Sam Someone"
      When the tournament is imported
      Then player 7 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone"

    Scenario Outline: A block or a Swiss that names the tournament is brought over
      Given the <kind> "<document>" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "<document>" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/12" on "croquetscores.com"

      Examples:
        | kind  | document   |
        | block | blocks/30  |
        | Swiss | swisses/30 |

    Scenario: A knockout is drawn with the players brought over before it
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Ann Able"
      And player 2 is called "Ben Baker"
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is in the competition
      And player 2 is in the competition
      When the tournament is imported
      Then "Ann Able" is drawn against "Ben Baker" in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: A team match that names the tournament is brought over
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      When the tournament is imported
      Then "teammatches/50" on "croquetscores.com" is kept as a test

    Scenario: A commentary that names the tournament is brought over
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the commentary "Live from Court 1"

    Scenario: A competition the tournament does not list is brought over
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/12" on "croquetscores.com"

    Scenario: A document that names the tournament in another case is the tournament's
      Given the block "blocks/30" of "Tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/12" on "croquetscores.com"

    Scenario: A competition of another tournament is not brought over with this one
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the block "blocks/31" of "tournaments/13" on "croquetscores.com"
      When the tournament "tournaments/12" on "croquetscores.com" is imported
      Then "blocks/31" on "croquetscores.com" is not kept as any competition

  Rule: A Standard tournament that lists only team matches is played by teams

    Some managers on the old sites set up a tournament between teams as a
    Standard tournament with team matches in it. The site keeps a team match
    only as a test of a tournament played by teams, so a Standard tournament
    whose competitions are all team matches, one or more, is brought over as
    played by teams, and its team matches with it, as though it had been set
    up as one. A Standard tournament listing anything else, or anything
    besides its team matches, is brought over as it was set up.

    Scenario: A Standard tournament that lists one team match is played by teams
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "TeamMatches/50"
      And the team match "TeamMatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is in the format "Teams"

    Scenario: A Standard tournament that lists two team matches is played by teams
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "TeamMatches/50"
      And the tournament lists "TeamMatches/51"
      And the team match "TeamMatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And the team match "TeamMatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is in the format "Teams"

    Scenario: The team match of a Standard tournament that lists only it is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "TeamMatches/50"
      And the team match "TeamMatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "TeamMatches/50" on "croquetscores.com" is kept as a test

    Scenario: A Standard tournament that lists a team match and a block is a Standard tournament
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "TeamMatches/50"
      And the tournament lists "blocks/30"
      And the team match "TeamMatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is in the format "Standard"

    Scenario: A Standard tournament that lists one block is a Standard tournament
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" is in the format "Standard"

  Rule: A block, knockout or Swiss of a tournament played by teams is tried as a team match

    The site has no block, knockout or Swiss in a tournament played by teams:
    its competitions are tests between its teams. The old sites let a manager
    add one all the same, and some were team matches kept so, as croquetscores.com's
    blocks/100678, Club de Golf Xaz vs Real Club de Golf de La Coruna, whose
    players each represented one of its two clubs. So where a block, a
    knockout or a Swiss of a tournament played by teams is named for two
    teams, "A vs B" or "A v B", and its players each represent one of them, it is
    tried as a team match (`ImportTeamMatches.feature`), played over the
    tournament's days and expected to have as many matches as its games say.
    Where that works it is brought over as one, and said as corrected
    (`AcceptedImportErrors.feature`). Where it is not named for two teams,
    or a player represents neither, or it is refused, it is refused as it
    always was, as the competition it is.

    Scenario: A block of a tournament played by teams named for two teams is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "blocks/30" on "croquetscores.com" is kept as a test

    Scenario: A knockout of a tournament played by teams named for two teams is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "knockouts/30"
      And the knockout "knockouts/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "knockouts/30" on "croquetscores.com" is kept as a test

    Scenario: A Swiss of a tournament played by teams named for two teams is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "swisses/30"
      And the Swiss "swisses/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "swisses/30" on "croquetscores.com" is kept as a test

    Scenario: The games of a block brought over as a team match are added
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the test kept for "blocks/30" on "croquetscores.com" has 1 game

    Scenario: A block brought over as a team match is not an error
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A block brought over as a team match is said as corrected
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "croquetscores.com/blocks/30" is corrected as "ImportWholeTournaments.ImportedAsTeamMatch"

    Scenario: A block named for two teams with "v" between them is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz v Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "blocks/30" on "croquetscores.com" is kept as a test

    Scenario: The teams of a block named with "v" between them are the two it names
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz v Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has the team "Club Coruna"

    Scenario: A block not named for two teams is still refused
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "A Block"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the error kept for "croquetscores.com/blocks/30" says "Tournament.PlayedByTeams"

    Scenario: A block named for two teams whose players represent neither is still refused
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Club Xaz vs Club Coruna"
      And player 1 is in the competition
      And player 1 represents "Nobody"
      And player 2 is in the competition
      And player 2 represents "Nowhere"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the error kept for "croquetscores.com/blocks/30" says "Tournament.PlayedByTeams"

    Scenario: A block still refused is not said as corrected
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And the competition is called "A Block"
      And player 1 is in the competition
      And player 1 represents "Club Xaz"
      And player 2 is in the competition
      And player 2 represents "Club Coruna"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then nothing is corrected of "croquetscores.com/blocks/30"

  Rule: The block blocks/95635 of a tournament played by teams is a block of a tournament of its own

    A block has no place in a tournament played by teams, and the import
    does not make one of any: croquetscores.com's blocks/95635, Eastern, of
    the 2024 Mountain Challenge, was a round robin of six teams, and has no
    players of its own to be a test between. It is named, and brought over
    as a block of a Standard tournament made for it, with the details of the
    tournament it was in, called as that is with " - Block" after it, and
    found at its slug followed by "-block". That is said as corrected
    (`AcceptedImportErrors.feature`). Any other block of a tournament played
    by teams is refused as it always was.

    Scenario: The block is in a tournament called as its tournament is, with " - Block"
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the competition kept for "blocks/95635" on "croquetscores.com" is in a tournament called "Spring Open - Block"

    Scenario: The block is in a tournament not played by teams
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the competition kept for "blocks/95635" on "croquetscores.com" is in a tournament not played by teams

    Scenario: The block is in a tournament that starts and finishes as the old one did
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the competition kept for "blocks/95635" on "croquetscores.com" is in a tournament that starts and finishes as the tournament kept for "tournaments/13" on "croquetscores.com"

    Scenario: The block is a block of that tournament
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the competition kept for "blocks/95635" on "croquetscores.com" is a block

    Scenario: The block is not a competition of the tournament it was in
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then no competition of the tournament kept for "tournaments/13" on "croquetscores.com" is called "Eastern"

    Scenario: The block is not an error
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then no error is kept for "croquetscores.com/blocks/95635"

    Scenario: The block is said as corrected
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/95635"
      And the block "blocks/95635" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Eastern"
      And player 1 is in the competition
      And player 1 represents "Lake Toxaway"
      And player 2 is in the competition
      And player 2 represents "High Hampton"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "croquetscores.com/blocks/95635" is corrected as "ImportWholeTournaments.ImportedInATournamentOfItsOwn"

  Rule: A block the import names is brought over as a test

    Two blocks of tournaments played by teams were team matches kept as
    blocks without being named for two teams: croquetscores.com's
    blocks/109616, Phyllis Court '4+' v Hurlingham, and blocks/110682, the
    Murphy Shield, between Southport and Leicester. Each is brought over as a
    team match, between the two teams its players represent, played over its
    tournament's days and expected to have as many matches as its games say,
    and said as corrected (`AcceptedImportErrors.feature`). Any other block
    that is not named for two teams is refused as it always was.

    Scenario: blocks/110682 is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/110682"
      And the block "blocks/110682" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Murphy Shield"
      And player 1 is in the competition
      And player 1 represents "Southport"
      And player 2 is in the competition
      And player 2 represents "Leicester"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "blocks/110682" on "croquetscores.com" is kept as a test

    Scenario: The teams of blocks/110682 are the two its players represent
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/110682"
      And the block "blocks/110682" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Murphy Shield"
      And player 1 is in the competition
      And player 1 represents "Southport"
      And player 2 is in the competition
      And player 2 represents "Leicester"
      And player 3 is in the competition
      And player 3 represents "Southport"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has the team "Leicester"

    Scenario: blocks/109616 is brought over as a test
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/109616"
      And the block "blocks/109616" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Phyllis Court '4+' v Hurlingham"
      And player 1 is in the competition
      And player 1 represents "Phyllis Court"
      And player 2 is in the competition
      And player 2 represents "Hurlingham"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "blocks/109616" on "croquetscores.com" is kept as a test

    Scenario: blocks/110682 is said as corrected
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/110682"
      And the block "blocks/110682" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Murphy Shield"
      And player 1 is in the competition
      And player 1 represents "Southport"
      And player 2 is in the competition
      And player 2 represents "Leicester"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "croquetscores.com/blocks/110682" is corrected as "ImportWholeTournaments.ImportedAsTeamMatch"

    Scenario: A block not named is not brought over as a test where its players represent more than two teams
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/110682"
      And the block "blocks/110682" of "tournaments/13" on "croquetscores.com"
      And the competition is called "Murphy Shield"
      And player 1 is in the competition
      And player 1 represents "Southport"
      And player 2 is in the competition
      And player 2 represents "Leicester"
      And player 3 is in the competition
      And player 3 represents "Wigan"
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the error kept for "croquetscores.com/blocks/110682" says "Tournament.PlayedByTeams"

  Rule: A competition the import names is left behind

    Some competitions are not worth bringing over, as croquetscores.com's
    swisses/28068, the Confirmed Entries of the Park CC Grand Prix Easter
    Teams Tournament, a list of entries with no games. Such a competition the
    import names is left behind, and that is not an error. It is said as
    corrected, with why, as "No games" (`AcceptedImportErrors.feature`).

    Scenario: A competition the import names is not kept as any competition
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "swisses/28068"
      And the Swiss "swisses/28068" of "tournaments/13" on "croquetscores.com"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "swisses/28068" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a competition the import names behind is not an error
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "swisses/28068"
      And the Swiss "swisses/28068" of "tournaments/13" on "croquetscores.com"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then no error is kept for "croquetscores.com/swisses/28068"

    Scenario: A competition the import names is said as corrected
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "swisses/28068"
      And the Swiss "swisses/28068" of "tournaments/13" on "croquetscores.com"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then "croquetscores.com/swisses/28068" is corrected as "ImportWholeTournaments.CompetitionLeftBehind"

    Scenario: A competition the import names is said as corrected with why
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "swisses/28068"
      And the Swiss "swisses/28068" of "tournaments/13" on "croquetscores.com"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then what is corrected of "croquetscores.com/swisses/28068" names "No games"

  Rule: A tournament the import names as Standard is brought over as one

    The old site kept some tournaments as played by teams that had no team
    match to play, as croquetscores.com's tournaments/80204, the Murphy Shield
    LPG Southport v Chester, which listed only a block, and the site has no
    block in a tournament played by teams. Such a tournament the import names
    is brought over as a Standard tournament, with its competitions, as is
    tournaments/74867, the BCCC 71st Annual GC Tournament, which listed only
    a block. That is said as corrected (`AcceptedImportErrors.feature`).

    Scenario: A tournament the import names as Standard is a Standard tournament
      Given a tournament "tournaments/80204" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/80204" on "croquetscores.com"
      When the tournament "tournaments/80204" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/80204" on "croquetscores.com" is in the format "Standard"

    Scenario: The block of a tournament the import names as Standard is brought over
      Given a tournament "tournaments/80204" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/80204" on "croquetscores.com"
      When the tournament "tournaments/80204" on "croquetscores.com" is imported
      Then "blocks/30" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/80204" on "croquetscores.com"

    Scenario: A tournament the import names as Standard is said as corrected
      Given a tournament "tournaments/80204" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/80204" on "croquetscores.com"
      When the tournament "tournaments/80204" on "croquetscores.com" is imported
      Then "croquetscores.com/tournaments/80204" is corrected as "ImportWholeTournaments.ImportedAsStandard"

    Scenario: tournaments/74867 is a Standard tournament
      Given a tournament "tournaments/74867" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/74867" on "croquetscores.com"
      When the tournament "tournaments/74867" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/74867" on "croquetscores.com" is in the format "Standard"

    Scenario: The block of tournaments/74867 is brought over
      Given a tournament "tournaments/74867" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/74867" on "croquetscores.com"
      When the tournament "tournaments/74867" on "croquetscores.com" is imported
      Then "blocks/30" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/74867" on "croquetscores.com"

    Scenario: tournaments/74867 is said as corrected
      Given a tournament "tournaments/74867" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/74867" on "croquetscores.com"
      When the tournament "tournaments/74867" on "croquetscores.com" is imported
      Then "croquetscores.com/tournaments/74867" is corrected as "ImportWholeTournaments.ImportedAsStandard"

  Rule: A tournament played by teams is held over the days of its team matches

    The old sites kept a tournament played by teams with days of its own that
    were often not the days its team matches were played on, and the site
    refuses a test outside its tournament's days (`addTest.feature`). So
    before a tournament played by teams is brought over, every team match
    naming it is read, and it starts when the first of them started and
    finishes when the last of them finished. An archived team match says
    nothing of when the tournament was played. A tournament with no team
    match not archived keeps its own days, and so does one not played by
    teams, whatever names it.

    Scenario: A tournament played by teams starts when its first team match started
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament started on "2017-03-01T00:00:00.0000000"
      And the tournament finished on "2017-03-02T00:00:00.0000000"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And the team match started on "2017-03-27T00:00:00.0000000"
      And the team match finished on "2017-04-26T00:00:00.0000000"
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And the team match started on "2017-03-26T00:00:00.0000000"
      And the team match finished on "2017-04-20T00:00:00.0000000"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" starts at "2017-03-26T00:00:00Z"

    Scenario: A tournament played by teams finishes when its last team match finished
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament started on "2017-03-01T00:00:00.0000000"
      And the tournament finished on "2017-03-02T00:00:00.0000000"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And the team match started on "2017-03-27T00:00:00.0000000"
      And the team match finished on "2017-04-26T00:00:00.0000000"
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And the team match started on "2017-03-26T00:00:00.0000000"
      And the team match finished on "2017-04-20T00:00:00.0000000"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" finishes at "2017-04-26T00:00:00Z"

    Scenario: An archived team match says nothing of the tournament's days
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament started on "2017-03-01T00:00:00.0000000"
      And the tournament finished on "2017-03-02T00:00:00.0000000"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And the team match started on "2017-03-27T00:00:00.0000000"
      And the team match finished on "2017-04-26T00:00:00.0000000"
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs England"
      And the team match started on "2017-03-26T00:00:00.0000000"
      And the team match finished on "2017-04-20T00:00:00.0000000"
      And the team match was archived
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" starts at "2017-03-27T00:00:00Z"

    Scenario: A tournament played by teams with no team match keeps its own days
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament started on "2017-03-01T00:00:00.0000000"
      And the tournament finished on "2017-03-02T00:00:00.0000000"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" starts at "2017-03-01T00:00:00Z"

    Scenario: A tournament not played by teams keeps its own days
      Given a tournament "tournaments/13" on "croquetscores.com"
      And the tournament started on "2017-03-01T00:00:00.0000000"
      And the tournament finished on "2017-03-02T00:00:00.0000000"
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com"
      And the team match is called "Australia vs New Zealand"
      And the team match started on "2017-03-27T00:00:00.0000000"
      And the team match finished on "2017-04-26T00:00:00.0000000"
      When the tournament "tournaments/13" on "croquetscores.com" is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" starts at "2017-03-01T00:00:00Z"

  Rule: A tournament's competitions are added in the order it listed them

    The order is the old site's, which its manager chose and its readers saw.
    A competition the list does not hold goes after every one it does, since
    nothing says where else it belongs: blocks, then knockouts, then Swisses,
    then team matches, each kind in the order its documents are read.

    Scenario: The first competition listed is the first competition
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called "A Block"
      And the Swiss "swisses/31" of "tournaments/12" on "croquetscores.com"
      And the Swiss "swisses/31" is called "The Swiss"
      And the tournament lists "swisses/31"
      And the tournament lists "blocks/30"
      When the tournament is imported
      Then the first competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "The Swiss"

    Scenario: The last competition listed is the last competition
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called "A Block"
      And the Swiss "swisses/31" of "tournaments/12" on "croquetscores.com"
      And the Swiss "swisses/31" is called "The Swiss"
      And the tournament lists "swisses/31"
      And the tournament lists "blocks/30"
      When the tournament is imported
      Then the last competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "A Block"

    Scenario: A competition listed in another case is put where it was listed
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called "A Block"
      And the Swiss "Swisses/31" of "tournaments/12" on "croquetscores.com"
      And the Swiss "Swisses/31" is called "The Swiss"
      And the tournament lists "swisses/31"
      And the tournament lists "blocks/30"
      When the tournament is imported
      Then the first competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "The Swiss"

    Scenario: A competition the tournament does not list goes after those it does
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called "A Block"
      And the Swiss "swisses/31" of "tournaments/12" on "croquetscores.com"
      And the Swiss "swisses/31" is called "The Swiss"
      And the tournament lists "swisses/31"
      When the tournament is imported
      Then the last competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "A Block"

    Scenario: A competition listed that is not there is passed over
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the tournament lists "knockouts/31"
      And the tournament lists "blocks/30"
      When the tournament is imported
      Then importing the tournament is not refused

    Scenario: Adding the competitions in order moves none of them
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the Swiss "swisses/31" of "tournaments/12" on "croquetscores.com"
      And the tournament lists "swisses/31"
      And the tournament lists "blocks/30"
      When the tournament is imported
      Then no competition of the tournament kept for "tournaments/12" on "croquetscores.com" was moved

  Rule: One document of a tournament refused leaves the rest of it brought over

    A competition or a commentary the site refuses is kept as an error
    against its own document, as it always was. The tournament and the rest
    of what names it are brought over all the same: one block the site cannot
    take would otherwise leave a whole tournament behind. The error is kept
    with the tournament, which has been brought over by then, for whoever
    reads it to find: at the tournament's page on the site, since the
    competition never became one there, and at the competition's own on the
    old site.

    Scenario: A refused competition is kept as an error against its document
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called ""
      When the tournament is imported
      Then the error kept for "croquetscores.com/blocks/30" says "CompetitionName.Missing"

    Scenario: A refused competition is kept with its tournament
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called ""
      When the tournament is imported
      Then the error kept for "croquetscores.com/blocks/30" is of the tournament at "2014/ac/spring-open-12" called "Spring Open"

    Scenario: A refused competition is kept at its tournament on the site and at itself on the old site
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And its slug on the old site was "block-a"
      And the block "blocks/30" is called ""
      When the tournament is imported
      Then the error kept for "croquetscores.com/blocks/30" is at "2014/ac/spring-open-12" on the new site and "2014/ac/spring-open-12/competition/block-a" on the old site

    Scenario: The tournament of a refused competition is not refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called ""
      When the tournament is imported
      Then importing the tournament is not refused

    Scenario: The competitions beside a refused one are brought over
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block "blocks/30" is called ""
      And the Swiss "swisses/31" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "swisses/31" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/12" on "croquetscores.com"

    Scenario: A refused commentary leaves the tournament's competitions brought over
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called ""
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is kept as a competition of the tournament kept for "tournaments/12" on "croquetscores.com"

  Rule: An archived tournament is left behind with everything that names it

    The old sites archived a tournament to be rid of it. Nothing that names it
    is brought over either, and none of it is an error, since nothing went
    wrong.

    Scenario: An archived tournament is not kept as any tournament
      Given the tournament was archived
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament

    Scenario: Leaving an archived tournament behind is not refused
      Given the tournament was archived
      When the tournament is imported
      Then importing the tournament is not refused

    Scenario: A competition of an archived tournament is not kept as any competition
      Given the tournament was archived
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a competition of an archived tournament behind is not an error
      Given the tournament was archived
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: Leaving the players of an archived tournament behind is not an error
      Given the tournament was archived
      And the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the tournament is imported
      Then no error is kept for "croquetscores.com/tournamentplayers/40"

  Rule: A tournament the import names is left behind with everything that names it

    Some tournaments are not worth bringing over, as croquetscores.com's
    tournaments/82149, the Mt Albert Croquet Club Rose Bowl Tournament in
    2025, whose block and team match had no games. Such a tournament the
    import names is left behind with everything that names it, as an
    archived one is, and that is not an error. It is said as corrected, with
    why, as "No games" (`AcceptedImportErrors.feature`), on no page of the
    new site.

    Scenario: A tournament the import names is not kept as any tournament
      Given a tournament "tournaments/82149" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/82149" on "croquetscores.com"
      When the tournament "tournaments/82149" on "croquetscores.com" is imported
      Then "tournaments/82149" on "croquetscores.com" is not kept as any tournament

    Scenario: What names a tournament the import names is not kept as any competition
      Given a tournament "tournaments/82149" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/82149" on "croquetscores.com"
      When the tournament "tournaments/82149" on "croquetscores.com" is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a tournament the import names behind is not refused
      Given a tournament "tournaments/82149" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/82149" on "croquetscores.com"
      When the tournament "tournaments/82149" on "croquetscores.com" is imported
      Then importing the tournament is not refused

    Scenario: A tournament the import names is said as corrected
      Given a tournament "tournaments/82149" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/82149" on "croquetscores.com"
      When the tournament "tournaments/82149" on "croquetscores.com" is imported
      Then "croquetscores.com/tournaments/82149" is corrected as "ImportWholeTournaments.LeftBehind"

    Scenario: A tournament the import names is said as corrected with why
      Given a tournament "tournaments/82149" on "croquetscores.com"
      And the tournament lists nothing
      And the tournament lists "blocks/30"
      And the block "blocks/30" of "tournaments/82149" on "croquetscores.com"
      When the tournament "tournaments/82149" on "croquetscores.com" is imported
      Then what is corrected of "croquetscores.com/tournaments/82149" names "No games"

  Rule: A tournament that lists no competition is left behind with everything that names it

    Scenario: A tournament that lists no competition is not kept as any tournament
      Given the tournament lists nothing
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament

    Scenario: Leaving a tournament that lists no competition behind is not refused
      Given the tournament lists nothing
      When the tournament is imported
      Then importing the tournament is not refused

    Scenario: A competition naming a tournament that lists none is not kept as any competition
      Given the tournament lists nothing
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a competition naming a tournament that lists none behind is not an error
      Given the tournament lists nothing
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A tournament that lists a competition is kept
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is kept as a tournament

  Rule: A tournament whose documents cannot be asked for is not brought over

    The old site is asked for what names a tournament before anything is
    brought over, and it can fail to answer, as RavenDB does when it gives up
    waiting for an index it is still making. The tournament is then refused
    with whatever the old site failed with, and nothing of it is brought over.
    It is not kept as read, so that whatever names it is refused once every
    tournament is done (`RefuseLeftOvers.feature`), and counted, rather than
    passed over as though the tournament had taken it.

    Scenario: A tournament whose documents cannot be asked for is not kept as any tournament
      Given "croquetscores.com" fails when asked which "Blocks" name a tournament
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament

  Rule: A refused tournament takes what names it with it, each as an error

    A tournament the site refuses brings nothing that names it over, since
    there is nothing to bring it over to. Each of those documents is kept as
    an error of its own, so that the errors still count every document not
    brought over, naming the tournament's refusal rather than repeating it:
    why the tournament was refused is kept once, against the tournament
    (`runImporter.feature`). An archived document is left behind without an
    error, as it would have been.

    Scenario: The tournament's refusal is why it was refused
      Given the tournament is in the sport "XX"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.UnknownSport"

    Scenario: A competition of a refused tournament is not kept as any competition
      Given the tournament is in the sport "XX"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: A competition of a refused tournament is kept as an error
      Given the tournament is in the sport "XX"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then the error kept for "croquetscores.com/blocks/30" says "ImportWholeTournaments.TournamentRefused"

    Scenario: The players of a refused tournament are kept as an error
      Given the tournament is in the sport "XX"
      And the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      When the tournament is imported
      Then the error kept for "croquetscores.com/tournamentplayers/40" says "ImportWholeTournaments.TournamentRefused"

    Scenario: An archived competition of a refused tournament is not an error
      Given the tournament is in the sport "XX"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition was archived
      When the tournament is imported
      Then no error is kept for "croquetscores.com/blocks/30"
