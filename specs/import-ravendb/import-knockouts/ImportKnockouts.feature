@postgres
Feature: Importing the old sites' knockouts

  A knockout is brought over as every competition is (`importCompetition.feature`).
  What is a knockout's own is said here: its draw, its byes, and what each
  of its rounds is the best of.

  The old sites drew a knockout in the order its players were listed: the
  first against the second, the third against the fourth, and so on. Its size
  was how many places the first round had, byes among them. The site draws a
  knockout in its players' order too, so the players are entered in the old
  order and stand where they stood.

  A bye on the old sites was a player called "Bye", the same one in every
  place a bye stood. It is entered here as a bye in that place, as the site
  enters one (`enterPlayer.feature`).

  Many managers left the byes out instead, and the old sites drew no
  knockout whose players did not fill its places, but kept its games. The
  site plays none until its places are filled. So where the players listed
  do not fill the knockout, where the byes belong is worked out from the
  games. Going down the list, a player stands with the player listed after
  them where each played the other in their first game, and stands against
  a bye where they did not. Where that fills the knockout's places, it is
  the draw. Where it does not, nobody can say what the draw was, and the
  knockout is left behind without an error: there is nothing a person could
  put right in it that the import could then bring over.

  The old sites never kept what a knockout's rounds were the best of. They
  worked it out each time from the games: the most games any match of the
  round had, made odd by one more where it was even, and never fewer than
  the round before. The site keeps a best-of for each round, so it is worked
  out the same way once, when the knockout is brought over, and a round with
  no games yet is the best of what the round before was, or of 1 where it is
  the first.

  A knockout's games are added round by round, the first round first, and
  each round's in the order the old site numbered them. The old sites took a
  score whenever it was entered, so a match of an early round was sometimes
  finished after a later round had been played, its last games entered late.
  The site takes a game only between two players drawn to meet, and a player
  is drawn into the next round only once they have won their match, so added
  in the order they were entered, the later round's games would be refused
  for coming before the match that sent its players there. Which round a
  game is of is worked out as the best-of is, from the draw and every game.

  A knockout has no standings, so nothing is carried forward in one. The old
  sites kept counts for its players that they never showed, and they are left
  behind.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And the knockouts are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported
    And player 1 of "tournaments/12" on "croquetscores.com" is imported as "Ann Able"
    And player 2 of "tournaments/12" on "croquetscores.com" is imported as "Ben Baker"
    And player 3 of "tournaments/12" on "croquetscores.com" is imported as "Cat Cole"
    And player 4 of "tournaments/12" on "croquetscores.com" is imported as "Dan Dunn"

  Rule: A knockout is added to its tournament with as many places as it had

    Scenario: A knockout becomes a knockout
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" is a knockout

    Scenario: A knockout has the places its size said
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 4 places

    Scenario: A size the site cannot draw is refused
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 6
      When the competition is imported
      Then importing the competition is refused with "KnockoutDraw.PlacesDoNotHalve"

  Rule: Each player stands in the place they stood

    Scenario: The first two players listed meet in the first round
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 3 is in the competition
      And player 2 is in the competition
      And player 4 is in the competition
      When the competition is imported
      Then "Ann Able" is drawn against "Cat Cole" in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: The next two players listed meet in the next match
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 3 is in the competition
      And player 2 is in the competition
      And player 4 is in the competition
      When the competition is imported
      Then "Ben Baker" is drawn against "Dan Dunn" in the competition kept for "knockouts/30" on "croquetscores.com"

  Rule: A bye stands where the old site's bye stood

    Scenario: A bye is entered where the old site listed one
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 9 is in the competition
      And player 2 is in the competition
      And player 4 is in the competition
      When the competition is imported
      Then "Ann Able" is drawn against a bye in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: The old site's bye standing in two places is two byes
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 9 is in the competition
      And player 2 is in the competition
      And player 9 is in the competition
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 2 byes

    Scenario: Entering a bye is not refused
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 9 is in the competition
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

  Rule: Where the players do not fill the knockout, the byes are where the games say

    Scenario: A player whose first game was against the next player listed stands with them
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 1
      When the competition is imported
      Then "Ann Able" is drawn against "Ben Baker" in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: A player whose first game was against nobody listed next to them stands against a bye
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 1
      When the competition is imported
      Then "Cat Cole" is drawn against a bye in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: A player whose first game was not against the player whose first game was against them stands against a bye
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 2
      And game 1 was lost by player 3
      And game 2 was won by player 1
      And game 2 was lost by player 2
      When the competition is imported
      Then "Ann Able" is drawn against a bye in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: The games of a knockout whose byes were worked out are added
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 2
      And game 1 was lost by player 3
      And game 2 was won by player 1
      And game 2 was lost by player 2
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 2 games

    Scenario: A knockout whose games do not fill its places is not kept as any competition
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 8
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the competition is imported
      Then "knockouts/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a knockout behind whose byes cannot be worked out is not refused
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 8
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the competition is imported
      Then importing the competition is not refused

    Scenario: A knockout with more players than places is not kept as any competition
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      When the competition is imported
      Then "knockouts/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving a knockout with more players than places behind is not refused
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      When the competition is imported
      Then importing the competition is not refused

  Rule: Each round is the best of the most games a match in it had, made odd

    Scenario: A round of single games is the best of 1
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      When the competition is imported
      Then round 1 of the competition kept for "knockouts/30" on "croquetscores.com" is the best of 1

    Scenario: A round with a match of three games is the best of 3
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 2
      And game 2 was lost by player 1
      And game 3 was won by player 1
      And game 3 was lost by player 2
      When the competition is imported
      Then round 1 of the competition kept for "knockouts/30" on "croquetscores.com" is the best of 3

    Scenario: A round whose longest match had two games is the best of 3
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 2
      When the competition is imported
      Then round 1 of the competition kept for "knockouts/30" on "croquetscores.com" is the best of 3

    Scenario: A round is the best of no fewer than the round before
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 2
      And game 2 was lost by player 1
      And game 3 was won by player 1
      And game 3 was lost by player 2
      And game 4 was won by player 3
      And game 4 was lost by player 4
      And game 5 was won by player 1
      And game 5 was lost by player 3
      When the competition is imported
      Then round 2 of the competition kept for "knockouts/30" on "croquetscores.com" is the best of 3

    Scenario: A first round with no games is the best of 1
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      When the competition is imported
      Then round 1 of the competition kept for "knockouts/30" on "croquetscores.com" is the best of 1

  Rule: A knockout's games are added round by round, the first round first

    Ann Able and Ben Baker play the best of 3, and the first round is the
    best of 3 for it. Ann's deciding game against Ben is game 6, entered after
    game 5, her final against Cat Cole.

    Scenario: A game of a round finished late is added before the next round's
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 2
      And game 2 was lost by player 1
      And game 3 was won by player 3
      And game 3 was lost by player 4
      And game 4 was won by player 3
      And game 4 was lost by player 4
      And game 5 was won by player 1
      And game 5 was lost by player 3
      And game 6 was won by player 1
      And game 6 was lost by player 2
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 6 games

    Scenario: A later round's game entered before an earlier round finished is not an error
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 2
      And game 2 was lost by player 1
      And game 3 was won by player 3
      And game 3 was lost by player 4
      And game 4 was won by player 3
      And game 4 was lost by player 4
      And game 5 was won by player 1
      And game 5 was lost by player 3
      And game 6 was won by player 1
      And game 6 was lost by player 2
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

  Rule: Where the players are not listed in the order they were drawn, the draw is worked out from the games

    Some managers listed a knockout's players in the order they were seeded
    rather than the order they were drawn: four players seeded first to
    fourth, drawn first against fourth and second against third. Drawn in
    the order listed, the first round's games would be refused, and a later
    round's taken as the first's, so the knockout would be brought over
    wrong. Where the order listed leaves games that are neither in the draw
    nor play-offs, the draw is worked out from the games instead: in the
    first round each player against whoever they first played, and in each
    round after it each match's winner against whoever they played next,
    the order listed deciding between pairs. That draw is the knockout's
    where it leaves fewer such games than the order listed did. A knockout
    whose games fit the order listed is drawn in it.

    Ann Able, Ben Baker, Cat Cole and Dan Dunn are listed in that order, but
    Ann played Dan, and Ben played Cat, and Ann beat Ben in the final.

    Scenario: A player is drawn against whoever they first played
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 4
      And game 2 was won by player 2
      And game 2 was lost by player 3
      And game 3 was won by player 1
      And game 3 was lost by player 2
      When the competition is imported
      Then "Ann Able" is drawn against "Dan Dunn" in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: The other pair is drawn against each other
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 4
      And game 2 was won by player 2
      And game 2 was lost by player 3
      And game 3 was won by player 1
      And game 3 was lost by player 2
      When the competition is imported
      Then "Ben Baker" is drawn against "Cat Cole" in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: Every game of a knockout drawn from its games is brought over
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 4
      And game 2 was won by player 2
      And game 2 was lost by player 3
      And game 3 was won by player 1
      And game 3 was lost by player 2
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 3 games

    Scenario: A knockout drawn from its games is not an error
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 4
      And game 2 was won by player 2
      And game 2 was lost by player 3
      And game 3 was won by player 1
      And game 3 was lost by player 2
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

  Rule: A game between two players already knocked out is left out

    Some managers kept play-offs in a knockout beside its draw: a game for
    third place between the losers of its semi-finals, or games between
    players knocked out in its first round. The site's knockout takes a game
    only between two players drawn to meet, and has no place for one between
    two players who have each lost a match of it already. Such a game is left
    out, and that is not an error. A game between a player knocked out and
    one still in, as Ann Able is, never having lost, is not a play-off, and
    is refused as any game whose players are not drawn to meet is.

    Ann Able beats Ben Baker and Cat Cole beats Dan Dunn, and Ann beats Cat
    in the final. Ben and Dan, the semi-finals' losers, play for third place.

    Scenario: Leaving a play-off out is not an error
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 4
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

    Scenario: A game between a player knocked out and one still in is refused
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the competition is imported
      Then the error kept for "croquetscores.com/knockouts/30" says "Competition.NotDrawnToMeet"

  Rule: An error accepted for a knockout is said as accepted rather than kept

    Some of what the import refuses has been looked at, and accepted: it is
    the old site's, it is not wrong, and there is nothing to put right, as
    for croquetscores.com's knockouts/10088, whose games the site refuses as
    between players not drawn to meet. An error is accepted for one document and one
    refusal's code, whichever of the document's games it names, and is said
    with the tournament it is of (`AcceptedImportErrors.feature`) rather than
    kept among the import's errors. An error of another document is kept as
    any is.

    Scenario: An error accepted for a knockout is not kept
      Given the knockout "knockouts/10088" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/10088"

    Scenario: An error accepted for a knockout is said as accepted
      Given the knockout "knockouts/10088" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the competition is imported
      Then "game 3" of "croquetscores.com/knockouts/10088" is accepted as "Competition.NotDrawnToMeet"

    Scenario: What is accepted of a knockout is at it on each site
      Given the knockout "knockouts/10088" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the competition is imported
      Then what is accepted of "croquetscores.com/knockouts/10088" is at "2014/ac/spring-open-12/competitions/knockout" on the new site and "2014/ac/spring-open-12" on the old site

    Scenario: The error accepted for one knockout is kept for another
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 1
      And game 3 was lost by player 3
      And game 4 was won by player 2
      And game 4 was lost by player 1
      When the competition is imported
      Then nothing is accepted of "croquetscores.com/knockouts/30"

  Rule: Whoever was to play a player who withdrew goes on

    The old sites gave a match to the opponent of a player marked withdrawn,
    who went on to the next round without a game, and the site does too
    (`withdrawPlayer.feature`). So a player who withdrew is withdrawn before
    the games whoever was to play them went on to play are added
    (`importCompetition.feature`): before any game where they played none,
    and straight after their last game where they played some.

    Ben Baker withdrew before playing Ann Able, and Ann goes on to beat Cat
    Cole, who beat Dan Dunn. In a knockout of eight, Ann beats Ben and then
    withdraws, and Cat goes on, past Ann, to beat Eve East in the final.

    Scenario: The games of whoever was to play a player who withdrew before playing are added
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And player 2 withdrew
      And game 1 was won by player 3
      And game 1 was lost by player 4
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 2 games

    Scenario: Whoever was to play a player who withdrew before playing going on is not an error
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And player 2 withdrew
      And game 1 was won by player 3
      And game 1 was lost by player 4
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

    Scenario: The games of whoever was to play a player who withdrew after winning are added
      Given player 5 of "tournaments/12" on "croquetscores.com" is imported as "Eve East"
      And player 6 of "tournaments/12" on "croquetscores.com" is imported as "Fay Ford"
      And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Gus Gray"
      And player 8 of "tournaments/12" on "croquetscores.com" is imported as "Hal Hart"
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 8
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And player 5 is in the competition
      And player 6 is in the competition
      And player 7 is in the competition
      And player 8 is in the competition
      And player 1 withdrew
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 5
      And game 3 was lost by player 6
      And game 4 was won by player 7
      And game 4 was lost by player 8
      And game 5 was won by player 5
      And game 5 was lost by player 7
      And game 6 was won by player 3
      And game 6 was lost by player 5
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 6 games

    Scenario: Whoever was to play a player who withdrew after winning going on is not an error
      Given player 5 of "tournaments/12" on "croquetscores.com" is imported as "Eve East"
      And player 6 of "tournaments/12" on "croquetscores.com" is imported as "Fay Ford"
      And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Gus Gray"
      And player 8 of "tournaments/12" on "croquetscores.com" is imported as "Hal Hart"
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 8
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And player 5 is in the competition
      And player 6 is in the competition
      And player 7 is in the competition
      And player 8 is in the competition
      And player 1 withdrew
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 3
      And game 2 was lost by player 4
      And game 3 was won by player 5
      And game 3 was lost by player 6
      And game 4 was won by player 7
      And game 4 was lost by player 8
      And game 5 was won by player 5
      And game 5 was lost by player 7
      And game 6 was won by player 3
      And game 6 was lost by player 5
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

  Rule: A player who never played the match they were drawn in gives their opponent a walkover

    Many managers kept no game for a walkover: a player went on to the next
    round, and whoever they were drawn against played no game at all. The
    site takes a game only between two players drawn to meet, and a match
    with no game is not decided, so every game of the player who went on was
    refused. So where a game is refused because a player's match before it
    is not decided, and whoever they were drawn against in it played them no
    game and plays none from then on, that player is withdrawn, which gives
    the match to their opponent (`withdrawPlayer.feature`), and the game is
    added after all. That is said as corrected
    (`AcceptedImportErrors.feature`). Whoever plays on, later in the order
    the games are added, gave no walkover, and the game is refused as it
    always was.

    Cat Cole played no game against Dan Dunn, and Ann Able, who beat Ben
    Baker, beat Cat in the final.

    Scenario: The games of a player whose opponent gave a walkover are added
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 2 games

    Scenario: A walkover is not an error
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

    Scenario: Whoever gave a walkover has withdrawn
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then "Dan Dunn" has withdrawn from the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: A walkover is said as corrected
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 3
      When the competition is imported
      Then "game 2" of "croquetscores.com/knockouts/30" is corrected as "ImportKnockouts.Walkover"

    Scenario: A player who plays on later gave no walkover
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 4
      And player 1 is in the competition
      And player 2 is in the competition
      And player 3 is in the competition
      And player 4 is in the competition
      And game 1 was won by player 1
      And game 1 was lost by player 2
      And game 2 was won by player 1
      And game 2 was lost by player 3
      And game 3 was won by player 4
      And game 3 was lost by player 2
      When the competition is imported
      Then "Dan Dunn" has not withdrawn from the competition kept for "knockouts/30" on "croquetscores.com"

  Rule: Nothing is carried forward in a knockout

    Scenario: A player's counts are left behind
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And player 1 carried forward 0 of each count
      And player 1 carried forward 3 game wins
      When the competition is imported
      Then "Ann Able" carries nothing forward in the competition kept for "knockouts/30" on "croquetscores.com"

    Scenario: Leaving a player's counts behind is not refused
      Given the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 1 is in the competition
      And player 2 is in the competition
      And player 1 carried forward 0 of each count
      And player 1 carried forward 3 game wins
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"
