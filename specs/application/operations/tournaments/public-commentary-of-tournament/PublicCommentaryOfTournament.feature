@postgres
Feature: A commentary on a tournament, for anybody to read

  A commentary's page shows its title, its writer and its comments
  (`commentary.feature`). The application answers them: the commentary's
  title; the name its writer is called now, since a commentary is one
  writer's account of the play (`start.feature`); and every comment in it
  that has not been deleted, in the order it was written, the first written
  first, so that it reads from the start as the play did
  (`addComment.feature`).

  Each comment is answered with what a reader is shown of it: what it says,
  as it was kept, in Markdown with no HTML in it (`CommentText.feature`);
  when it was written; and, where it has been edited, when it last was
  (`editComment.feature`). The commentary says too whether the reader asking
  is its writer, since only its writer may add, edit or delete a comment, and
  the page offers those only to them. Nobody signed in is nobody's writer.

  A commentary whose writer's account has since been forgotten is not
  answered, as it is not listed (`PublicCommentariesOfTournament.feature`):
  every word of it is that account's, under that account's name. It is
  refused as a commentary there is not.

  The page is a section of the tournament's, so the tournament is answered
  with it as its players are (`PublicPlayersOfTournament.feature`): its name,
  where it is found now, and its competitions in use with where each is
  found, which is what the page's section bar leads to. The commentary is
  answered with where it is found, which is where a comment added, edited or
  deleted on its page leads back to.

  An address no tournament of the website has been found at, or whose
  tournament is archived, is refused as
  `PublicCommentaryOfTournament.NoSuchTournament`, and a slug no commentary
  on the tournament has as `PublicCommentaryOfTournament.NoSuchCommentary`.
  An address the tournament has moved on from still finds it, and it is
  answered with where it is found now.

  A commentary is for anybody to read, so nobody need be signed in to ask. It
  is asked for by the tournament's address on the website being read, as a
  reader's browser names it, and the commentary's slug.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"

  Rule: The commentary is answered with its title and its writer

    Scenario: The commentary's title is answered
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is titled "Day one"

    Scenario: The commentary is answered with its writer's name
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is written by "Wren Writer"

    Scenario: The commentary is answered with the name its writer is called now
      Given the reader signed in to the account for "writer@example.com" changes its name to "Wren Wright"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is written by "Wren Wright"

    Scenario: The commentary is answered with where it is found
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is found at "2026/ac/spring-open/commentaries/day-one"

  Rule: Every comment not deleted is answered, the first written first

    Scenario: A commentary with no comments answers none
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 comments are answered

    Scenario: A comment is answered
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the first comment answered is "Sam is two hoops up"

    Scenario: The comments are answered the first written first
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the first comment answered is "Sam is two hoops up"
      And the second comment answered is "Alex has pegged out"

    Scenario: An edited comment is answered where it was written
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      And "writer@example.com" has edited the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the first comment answered is "Sam is three hoops up"
      And the second comment answered is "Alex has pegged out"

    Scenario: A deleted comment is not answered
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has deleted the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 comments are answered

  Rule: Each comment is answered with what a reader is shown of it

    Scenario: A comment is answered with when it was written
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the comment "Sam is two hoops up" is answered as written at "2026-09-26T10:00:00Z"

    Scenario: A comment never edited is answered as not edited
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the comment "Sam is two hoops up" is answered as not edited

    Scenario: An edited comment is answered with when it was last edited
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the moment "2026-09-26T11:30:00Z"
      And "writer@example.com" has edited the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the comment "Sam is three hoops up" is answered as last edited at "2026-09-26T11:30:00Z"

  Rule: The commentary says whether the reader asking is its writer

    Scenario: The commentary's writer asking is told they are its writer
      When the reader signed in to the account for "writer@example.com" asks for the public commentary "day-one" of the tournament at "2026/ac/spring-open"
      Then the commentary answered is written by the reader asking

    Scenario: Somebody else asking is told they are not its writer
      When the reader signed in to the account for "organiser@example.com" asks for the public commentary "day-one" of the tournament at "2026/ac/spring-open"
      Then the commentary answered is not written by the reader asking

    Scenario: Nobody signed in is told they are not its writer
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is not written by the reader asking

  Rule: A commentary whose writer has been forgotten is not answered

    Scenario: A commentary started by an account since forgotten is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicCommentaryOfTournament.NoSuchCommentary"

  Rule: The tournament is answered as its page's section bar shows it

    Scenario: The tournament's name is answered
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A competition is answered with where it is found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the competition "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

    Scenario: A commentary of a tournament found at its old address is found at its address now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then the commentary answered is found at "2026/gc/spring-open/commentaries/day-one"

  Rule: An address with no commentary a reader is sent to is refused

    Scenario: A slug no commentary on the tournament has is refused
      When the public commentary "day-two" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicCommentaryOfTournament.NoSuchCommentary"

    Scenario: An address no tournament has been found at is refused
      When the public commentary "day-one" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicCommentaryOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the public commentary "day-one" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicCommentaryOfTournament.NoSuchTournament"

    Scenario: A tournament on another website is refused
      When the public commentary "day-one" of the tournament on "gateballscores.com" at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicCommentaryOfTournament.NoSuchTournament"
