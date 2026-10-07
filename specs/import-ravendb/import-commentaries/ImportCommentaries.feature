@postgres
Feature: Importing the old sites' commentaries

  The old sites let anybody write a commentary on a tournament as it was
  played: a title, and comments under it, each kept with when it was written.
  Each is brought over as a commentary of the tournament it was on
  (`ImportTournaments.feature`), started by the account its writer became
  (`ImportUsers.feature`), with its comments in the order they were written.
  It is started as the site starts one (`start.feature`), so that it
  is found and read as any other.

  A writer who became no account is the forgotten account made for them, as a
  tournament's manager is, so that the commentary is still somebody's and
  nothing of them is kept. They are the same forgotten account as everywhere
  else they ran or wrote anything.

  A commentary was started when its first comment was written, as far as
  anything kept says, since the old sites kept no moment a commentary was
  started at. One with no comments was started when its tournament was.

  The old sites kept how many readers were watching when each comment was
  written. The site has nothing like it, and it is left behind.

  An archived commentary is left behind, as an archived tournament is, and so
  is an archived comment: the old sites archived either to be rid of it.
  Which tournament a commentary is brought over with is said with the
  tournament (`ImportWholeTournaments.feature`).

  Background:
    Given the users are imported
    And the tournaments are imported
    And the commentaries are imported
    And a user "users/1" on "croquetscores.com" is imported as "writer@example.com"
    And a tournament "tournaments/12" on "croquetscores.com" is imported

  Rule: A commentary becomes a commentary of its tournament

    Scenario: A commentary becomes a commentary of its tournament
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      When the commentary is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the commentary "Live from Court 1"

    Scenario: A commentary is written by the account its writer became
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And the commentary was written by "users/1"
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" is written by "writer@example.com"

    Scenario: A commentary is started when its first comment was written
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      And comment 1 was written at "2014-03-01T09:15:00.0000000"
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" was started at "2014-03-01T09:15:00Z"

    Scenario: A commentary with no comments is started when its tournament was
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" was started at "2014-03-01T00:00:00Z"

    Scenario: A commentary with a title the site would refuse is refused, naming why
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called ""
      When the commentary is imported
      Then importing the commentary is refused with "CommentaryTitle.Missing"

  Rule: A writer who became no account is a forgotten account

    Scenario: A commentary by a user who never confirmed is written by a forgotten account
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And the commentary was written by "users/4"
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" is written by a forgotten account

    Scenario: A writer who created a tournament is the forgotten account already made
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/13" on "croquetscores.com"
      And the tournament was created by "users/4"
      And the tournament is imported
      And the commentary "commentaries/5" of "tournaments/13" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And the commentary was written by "users/4"
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/13" on "croquetscores.com" is written by the account that created it

  Rule: Comments are added in the order they were written

    Scenario: A comment becomes a comment of the commentary
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" has 1 comment

    Scenario: A comment says what it said
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      When the commentary is imported
      Then the first comment of the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" says "Play has started."

    Scenario: A comment was written when the old site kept it
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      And comment 1 was written at "2014-03-01T09:15:00.0000000"
      When the commentary is imported
      Then the first comment of the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" was written at "2014-03-01T09:15:00Z"

    Scenario: A later comment was written when the old site kept it
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      And comment 1 was written at "2014-03-01T09:15:00.0000000"
      And comment 2 says "Sam leads by 5."
      And comment 2 was written at "2014-03-01T10:30:00.0000000"
      When the commentary is imported
      Then the last comment of the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" was written at "2014-03-01T10:30:00Z"

    Scenario: The comments are in the order they were written
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      And comment 2 says "Sam leads by 5."
      When the commentary is imported
      Then the first comment of the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" says "Play has started."

    Scenario: A comment is kept as it was written, HTML and all, as the site keeps one
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "<b>Sam</b> leads by 5."
      When the commentary is imported
      Then the first comment of the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" says "<b>Sam</b> leads by 5."

  Rule: A comment the site refuses is kept as an error, and the other comments are added

    Scenario: A comment saying nothing is kept as an error
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says ""
      When the commentary is imported
      Then the error kept for "croquetscores.com/commentaries/5" says "CommentText.Missing"

    Scenario: The error kept names the comment refused
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says ""
      When the commentary is imported
      Then the error kept for "croquetscores.com/commentaries/5" says "comment 1"

    Scenario: The comments after one refused are added
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says ""
      And comment 2 says "Sam leads by 5."
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" has 1 comment

  Rule: Two commentaries with the same title are told apart by a number

    The site tells a tournament's commentaries apart by their titles, in any
    case, and the old sites did not, so the second commentary with a title is
    given the title followed by "(2)", as a player's name is
    (`ImportTournamentPlayers.feature`).

    Scenario: The second commentary with a title is numbered
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live"
      And the commentary is imported
      And the commentary "commentaries/6" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "live"
      When the commentary is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the commentary "live (2)"

  Rule: What the old sites archived is left behind

    Scenario: An archived commentary is not brought over
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And the commentary was archived
      When the commentary is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no commentaries

    Scenario: Leaving an archived commentary behind is not refused
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And the commentary was archived
      When the commentary is imported
      Then importing the commentary is not refused

    Scenario: An archived comment is not brought over
      Given the commentary "commentaries/5" of "tournaments/12" on "croquetscores.com"
      And the commentary was called "Live from Court 1"
      And comment 1 says "Play has started."
      And comment 2 says "Sam leads by 5."
      And comment 2 was archived
      When the commentary is imported
      Then the commentary "Live from Court 1" of the tournament kept for "tournaments/12" on "croquetscores.com" has 1 comment
