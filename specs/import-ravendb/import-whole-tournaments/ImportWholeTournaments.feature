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
