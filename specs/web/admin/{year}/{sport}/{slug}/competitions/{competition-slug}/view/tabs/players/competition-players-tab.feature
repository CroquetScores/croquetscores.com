@browser @postgres
Feature: The players tab of a competition's page

  The Players tab is where a manager enters a tournament's players into one of
  its competitions, puts them in order, says what each carries forward into it,
  removes the ones entered by mistake, and withdraws the ones who will play no
  more of it (`view.feature` beneath the competition). A player in a
  competition is one of the tournament's players (`CompetitionPlayer.feature`),
  so they are added by choosing them rather than by typing them, and everything
  about them but their place in the competition and what they carry forward
  into it is changed on the tournament's Players tab (`players-tab.feature`).

  Above the list, a drop-down offers every player of the tournament who is not
  already in the competition, in the tournament's order, with Add Player beside
  it. Archived players of the tournament are not offered, since they are set
  aside. A player added is put in the tournament's order, just after whoever
  already has their order where somebody does (`enterPlayer.feature`), and is
  no longer offered in the drop-down. Once a player is added, the focus goes
  back to the drop-down, so that the next can be chosen and added from the
  keyboard without going back up to find it. Where every player of the
  tournament is in the competition, the drop-down and Add Player are not shown,
  and the tab says so.

  A knockout is played only once its draw is filled (`addGame.feature`), and
  the places its players leave over are filled with byes
  (`enterPlayer.feature`). So in a knockout the drop-down offers Bye first,
  before the players, and goes on offering it however many byes are added,
  since a draw can need several; a block or a Swiss has no draw, and does not
  offer it. A bye added is listed among the players, in its place in the draw,
  called Bye, in the reader's language. It is nobody, so it says nothing of
  what it represents or the flag it flies. In a knockout with every player of
  the tournament in it, the drop-down is still shown while a place is left,
  offering Bye alone.

  A bye is put in its place in the draw as a player is: it offers Up, Down and
  Remove, and Remove asks first, as it does for a player. It does not offer
  Withdraw, since it plays nothing to withdraw from. Every bye has the same id,
  so what is pressed on a bye acts on that bye by its place in the order
  (`movePlayer.feature`, `removePlayer.feature`), and the other byes stay where
  they are.

  A player Add Player cannot enter is not entered, and the tab says why beneath
  the drop-down, by the refusal's code, in the reader's language: a knockout
  whose every place is filled is refused with `Competition.DrawFull`
  (`enterPlayer.feature`). What it says is tied to the drop-down, so that a
  screen reader reads it with it, and it goes once another player is chosen,
  since it was about the one chosen before. A refusal with no words of its own
  is still said, in the words for one the tab cannot name, rather than the tab
  going on as though nothing were wrong.

  The players playing come first, in the competition's order, which is the
  order a knockout is drawn in and a block is listed in. Each says their name,
  what they represent and the flag they fly, where they have either, and offers
  Carry Forward, Remove, Withdraw, Up and Down. Up and Down move a player one
  place among those playing; the first is not offered Up and the last is not
  offered Down, since there is nowhere for it to go. Up and Down are shown as
  arrows pointing up and down, and are named "Up" and "Down" for a reader who
  cannot see them. They come last of what a row offers, so that they are in the
  same place on every row. A player's name, what they represent and their flag
  are said in that order, as "Sam Someone (Canterbury Croquet Club)" and then
  the flag.

  Carry Forward opens the carry forward dialog over the page
  (`carry-forward.feature`), to say what the player brings into the competition
  from play it did not score (`CompetitionPlayer.feature`). It comes first of
  what a row offers, before Remove, and is offered whether or not the player
  has played, since what they brought is what it was whatever has been played
  since. Only a block and a Swiss have standings for it to count in, so a
  knockout offers it on no row (`changeCarryForward.feature`), and a bye, which
  is only ever in a knockout, never offers it. A withdrawn player offers
  Unwithdraw alone, so not Carry Forward either. Once a carry forward is saved,
  the list is asked for again, as it is after anything else is done.

  Remove takes out a player entered by mistake. They are not kept or set aside,
  so there is nothing to restore (`CompetitionPlayer.feature`). A player who
  has any games in use in the competition cannot be removed, since the games
  would then be against somebody who is no longer there, so such a player is
  not offered Remove. An archived game counts for nothing, so a player whose
  only games are archived is offered Remove, and their archived scores go with
  them (`removePlayer.feature`). A player removed is still one of the
  tournament's players, so they are offered again in the drop-down, and adding
  them again enters them as anybody new is, in the tournament's order.

  Withdraw is for a player who will play no more of the competition: they stay
  in it, with their games. A player who withdraws is put last
  (`withdrawPlayer.feature`), so the withdrawn players come after those
  playing, under a heading of their own, in the order they withdrew. Each says
  their name, what they represent and the flag they fly, and offers Unwithdraw
  alone, since a withdrawn player can only have their withdrawal reversed. A
  player unwithdrawn keeps the order they were given when they withdrew, so
  they come back after those who stayed playing.

  In a knockout, the competition's order is its draw, so once it has a game in
  use its players are fixed (`addGame.feature`): the drop-down and Add Player
  are not shown, and no player offers Up, Down or Remove. An archived game
  fixes nothing, so a knockout whose only games are archived offers them as one
  with no games does. Withdraw is still offered, since a player can stop
  playing at any time, and their opponent in a match not yet decided goes
  through.

  Remove and Withdraw ask first, where Archive elsewhere in the admin does not.
  Remove cannot be undone: the player's place goes with them, and adding them
  again is not the same as having kept them. Withdraw can be reversed, but it
  changes the outcome of the competition — the games the player has not played
  are decided without them, and who goes through or wins may change with it —
  so it is not something to do by a slip of the thumb. Unwithdraw, Up and Down
  do not ask: each is undone by pressing the other way. Whatever is done, the
  list is asked for again, so that it says who the players are now.

  The tab has no address of its own, so a scenario opens the competition's
  page, whose first tab this is, which is what opening the players of a
  competition does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"

  Rule: The drop-down offers the tournament's players not already in the competition

    Scenario: A player of the tournament not in the competition is offered
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is offered to add

    Scenario: The players offered are in the tournament's order
      When the players of "Block A" in "Spring Open" are opened
      Then the first player offered to add is "Sam Someone"

    Scenario: A player already in the competition is not offered
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is not offered to add

    Scenario: A withdrawn player is not offered
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is not offered to add

    Scenario: An archived player of the tournament is not offered
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is not offered to add

    Scenario: The tab offers Add Player
      When the players of "Block A" in "Spring Open" are opened
      Then the tab offers "Add Player"

    Scenario: Add Player is above the players
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then "Add Player" is above the players

    Scenario: A competition with every player in it offers nobody to add
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the tab does not offer "Add Player"

    Scenario: A competition with every player in it says so
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the tab says every player is in the competition

  Rule: In a knockout, Bye is offered first, and as often as it is wanted

    The knockout's draw is four places, each round the best of 1.

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"

    Scenario: A knockout offers Bye
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Bye" is offered to add

    Scenario: Bye is offered before the players
      When the players of "Final Stage" in "Spring Open" are opened
      Then the first player offered to add is "Bye"

    Scenario: A block does not offer Bye
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Bye" is not offered to add

    Scenario: A bye added is listed among the players
      Given the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the player "Bye" is listed

    Scenario: A bye added is kept
      Given the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the competition "Final Stage" of "Spring Open" has 1 bye

    Scenario: Bye is still offered once a bye is added
      Given the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the player "Bye" is offered to add

    Scenario: The drop-down has the focus once a bye is added
      Given the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the drop-down of players to add has the focus

    Scenario: A second bye is added
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the competition "Final Stage" of "Spring Open" has 2 byes

    Scenario: A bye is listed after the players entered before it
      Given "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Bye" is listed after "Sam Someone"

    Scenario: A knockout with every player of the tournament in it still offers Bye
      Given "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Bye" is offered to add

    Scenario: A bye added to a full knockout is refused beneath the drop-down
      Given "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Bye" is chosen to add
      When "Add Player" is pressed
      Then the drop-down of players to add is refused with "Competition.DrawFull"

    Scenario: Bye is offered in the reader's language
      Given a browser that asks for "en-XA"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the first player offered to add is in the test locale

    Scenario: A bye listed is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the first player listed is in the test locale

  Rule: A bye is put in its place and taken out as a player is

    The knockout's draw is four places. Sam Someone is entered, then a bye,
    then Alex Another, then another bye.

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"

    Scenario Outline: A bye offers what can be done to it
      When the players of "Final Stage" in "Spring Open" are opened
      Then the second player listed offers "<option>"

      Examples:
        | option |
        | Up     |
        | Down   |
        | Remove |

    Scenario: A bye does not offer Withdraw
      When the players of "Final Stage" in "Spring Open" are opened
      Then the second player listed does not offer "Withdraw"

    Scenario: Up moves a bye before the one above it
      Given the players of "Final Stage" in "Spring Open" are open
      When "Up" is pressed on the second player listed
      Then the first player listed is "Bye"

    Scenario: Down moves a bye after the one below it
      Given the players of "Final Stage" in "Spring Open" are open
      When "Down" is pressed on the second player listed
      Then the third player listed is "Bye"

    Scenario: Only the bye moved moves
      Given the players of "Final Stage" in "Spring Open" are open
      When "Up" is pressed on the fourth player listed
      Then the second player listed is "Bye"

    Scenario: A bye moved is kept in its new place
      Given the players of "Final Stage" in "Spring Open" are open
      When "Up" is pressed on the second player listed
      Then the first player of "Final Stage" of "Spring Open" is a bye

    Scenario: Remove on a bye asks first
      Given the players of "Final Stage" in "Spring Open" are open
      When "Remove" is pressed on the second player listed
      Then a modal dialog asks to confirm

    Scenario: The question names the bye
      Given the players of "Final Stage" in "Spring Open" are open
      When "Remove" is pressed on the second player listed
      Then the question names "Bye"

    Scenario: A bye removed is kept removed
      Given the players of "Final Stage" in "Spring Open" are open
      And "Remove" is pressed on the second player listed
      When the question is confirmed
      Then the competition "Final Stage" of "Spring Open" has 1 bye

    Scenario: Only the bye removed goes
      Given the players of "Final Stage" in "Spring Open" are open
      And "Remove" is pressed on the fourth player listed
      When the question is confirmed
      Then the second player listed is "Bye"

  Rule: Add Player enters the player chosen, in the tournament's order

    Scenario: A player added is listed among those playing
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the player "Sam Someone" is listed among those playing

    Scenario: A player added is no longer offered
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the player "Sam Someone" is not offered to add

    Scenario: The drop-down has the focus once a player is added
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the drop-down of players to add has the focus

    Scenario: A player added comes where the tournament's order puts them
      Given "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the player "Sam Someone" is listed before "Alex Another"

    Scenario: A player added from the tab is kept
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      And "Add Player" is pressed
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is listed among those playing

    Scenario: A player added no longer leaves the tab saying there are none
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the tab does not say there are no players

    Scenario: A competition with no players says so
      When the players of "Block A" in "Spring Open" are opened
      Then the tab says there are no players

  Rule: What Add Player refuses is said beneath the drop-down

    The knockout's draw is four places, and Sam Someone, Alex Another, Chris
    Third and Pat Fourth fill them. Jo Fifth is a player of the tournament who
    is not in it.

    Scenario: A player added to a full knockout is refused beneath the drop-down
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the player "Jo Fifth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Jo Fifth" is chosen to add
      When "Add Player" is pressed
      Then the drop-down of players to add is refused with "Competition.DrawFull"
      And the drop-down of players to add says the words for "Competition.DrawFull"

    Scenario: A player refused is not listed
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the player "Jo Fifth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Jo Fifth" is chosen to add
      When "Add Player" is pressed
      Then the player "Jo Fifth" is not listed

    Scenario: What is refused is read out with the drop-down
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the player "Jo Fifth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Jo Fifth" is chosen to add
      When "Add Player" is pressed
      Then what is refused is read out with the drop-down of players to add

    Scenario: Choosing another player takes away what was refused
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the player "Jo Fifth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And the players of "Final Stage" in "Spring Open" are open
      And "Jo Fifth" is chosen to add
      And "Add Player" is pressed
      When nobody is chosen to add
      Then nothing is said beneath the drop-down of players to add

    Scenario: A player entered says nothing beneath the drop-down
      Given the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then nothing is said beneath the drop-down of players to add

  Rule: The players playing are listed in the competition's order

    Scenario: The players are in the tournament's order, whatever order they were entered in
      Given "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the first player listed is "Sam Someone"

    Scenario: The players are in the competition's order after one is moved
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has moved the player "Alex Another" in "Block A" of "Spring Open" up
      When the players of "Block A" in "Spring Open" are opened
      Then the first player listed is "Alex Another"

  Rule: Each player says what they represent and the flag they fly

    Scenario: A player says what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Pat Fourth" is shown representing "Canterbury Croquet Club"

    Scenario: A player representing nothing says nothing of it
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is shown representing nothing

    Scenario: A player shows the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Pat Fourth" is shown flying the flag "nz"

    Scenario: A flag is named by its country, for a reader who cannot see it
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the flag of the player "Pat Fourth" is named "New Zealand"

    Scenario: A player flying no flag shows none
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is shown flying no flag

    Scenario: A player changed on the tournament's tab is shown as they are now
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Samantha Someone" is listed among those playing

  Rule: What a player offers is what can be done to them

    Scenario Outline: A player playing offers what can be done to them
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Alex Another" offers "<option>"

      Examples:
        | option        |
        | Carry Forward |
        | Up            |
        | Down          |
        | Remove        |
        | Withdraw      |

    Scenario: A player playing does not offer Unwithdraw
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Unwithdraw"

    Scenario: The first player does not offer Up
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Up"

    Scenario: The last player does not offer Down
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Alex Another" does not offer "Down"

    Scenario: The last playing does not offer Down though a withdrawn one comes after them
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Down"

    Scenario: Remove is drawn as a trash can
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then Remove for the player "Sam Someone" is a trash can

    Scenario: A player who has played is not offered Remove
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Remove"

    Scenario: A player who has played is still offered Withdraw
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Withdraw"

    Scenario: A player whose only game is archived is offered Remove
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Remove"

    Scenario: A player with a game in use as well as one archived is not offered Remove
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 10 in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Remove"

    Scenario: A player who has not played is offered Remove
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Remove"

    Scenario: A withdrawn player offers Unwithdraw
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Unwithdraw"

    Scenario Outline: A withdrawn player offers nothing else
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Alex Another" does not offer "<option>"

      Examples:
        | option        |
        | Carry Forward |
        | Up            |
        | Down          |
        | Remove        |
        | Withdraw      |

  Rule: Carry Forward comes first, and is offered where standings can begin from it

    Scenario: Carry Forward comes before Remove
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then "Carry Forward" on the player "Sam Someone" comes before "Remove"

    Scenario: Carry Forward is the first thing a player offers
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the first thing the player "Sam Someone" offers is "Carry Forward"

    Scenario: A player who has played is still offered Carry Forward
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Carry Forward"

    Scenario: Carry Forward is first though Remove is not offered
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the first thing the player "Sam Someone" offers is "Carry Forward"

    Scenario: A player in a Swiss is offered Carry Forward
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Swiss A" of "Spring Open"
      When the players of "Swiss A" in "Spring Open" are opened
      Then the player "Sam Someone" offers "Carry Forward"

    Scenario: A player in a knockout is not offered Carry Forward
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Carry Forward"

    Scenario: A bye is not offered Carry Forward
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the first player listed does not offer "Carry Forward"

    Scenario: Carry Forward opens the carry forward dialog
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the carry forward dialog is open

    Scenario: Carry Forward does not ask first
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then no modal dialog asks to confirm

  Rule: Up and Down move a player a place

    Scenario: Up moves a player before the one above them
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Up" is pressed on the player "Alex Another"
      Then the first player listed is "Alex Another"

    Scenario: Down moves a player after the one below them
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Down" is pressed on the player "Sam Someone"
      Then the first player listed is "Alex Another"

    Scenario: Up passes over a withdrawn player
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Up" is pressed on the player "Chris Third"
      Then the first player listed is "Chris Third"

    Scenario: A player moved is kept in their new place
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Up" is pressed on the player "Alex Another"
      When the players of "Block A" in "Spring Open" are opened
      Then the first player listed is "Alex Another"

    Scenario: Moving does not ask first
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Up" is pressed on the player "Alex Another"
      Then no modal dialog is open

  Rule: Remove asks first, since it cannot be undone, then takes the player out

    Scenario: Remove asks first
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Remove" is pressed on the player "Sam Someone"
      Then a modal dialog asks to confirm

    Scenario: The question names the player
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Remove" is pressed on the player "Sam Someone"
      Then the question names "Sam Someone"

    Scenario: A player removed is no longer listed
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Remove" is pressed on the player "Sam Someone"
      When the question is confirmed
      Then the player "Sam Someone" is not listed

    Scenario: A player removed is offered again to add
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Remove" is pressed on the player "Sam Someone"
      When the question is confirmed
      Then the player "Sam Someone" is offered to add

    Scenario: A player removed from the tab is kept removed
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Remove" is pressed on the player "Sam Someone"
      And the question is confirmed
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is not listed

    Scenario: A player removed whose only score was archived takes it from the Scores tab
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Remove" is pressed on the player "Sam Someone"
      And the question is confirmed
      When the scores of "Block A" in "Spring Open" are opened
      Then the tab says there are no scores

    Scenario: A removal not confirmed leaves the player listed
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Remove" is pressed on the player "Sam Someone"
      When the question is declined
      Then the player "Sam Someone" is listed among those playing

    Scenario: A player removed and added again comes back in the tournament's order
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has removed the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Sam Someone" is chosen to add
      When "Add Player" is pressed
      Then the player "Sam Someone" is listed before "Alex Another"

  Rule: Withdraw asks first, since it changes the outcome, then lists the player among the withdrawn

    Scenario: Withdraw asks first
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Withdraw" is pressed on the player "Sam Someone"
      Then a modal dialog asks to confirm

    Scenario: The question names the player
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Withdraw" is pressed on the player "Sam Someone"
      Then the question names "Sam Someone"

    Scenario: A player withdrawn is listed among the withdrawn
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Withdraw" is pressed on the player "Sam Someone"
      When the question is confirmed
      Then the player "Sam Someone" is listed among the withdrawn

    Scenario: A player withdrawn is not listed among those playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Withdraw" is pressed on the player "Sam Someone"
      When the question is confirmed
      Then the player "Sam Someone" is not listed among those playing

    Scenario: A player withdrawn from the tab is kept withdrawn
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Withdraw" is pressed on the player "Sam Someone"
      And the question is confirmed
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is listed among the withdrawn

    Scenario: A withdrawal not confirmed leaves the player playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Withdraw" is pressed on the player "Sam Someone"
      When the question is declined
      Then the player "Sam Someone" is listed among those playing

  Rule: The withdrawn players are listed after those playing

    Scenario: The withdrawn players come after those playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is listed after "Alex Another"

    Scenario: The withdrawn players are in the order they withdrew
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Alex Another" is listed before "Sam Someone"

    Scenario: The withdrawn players are under a heading of their own
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the withdrawn players are headed "Withdrawn players"

    Scenario: No heading for the withdrawn is shown where none has withdrawn
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then no heading for the withdrawn players is shown

    Scenario: A withdrawn player still shows what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Pat Fourth" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Pat Fourth" is shown representing "Canterbury Croquet Club"

    Scenario: A withdrawn player still shows the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Pat Fourth" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Pat Fourth" is shown flying the flag "nz"

  Rule: Unwithdraw puts a player back among those playing, without asking

    Scenario: A player unwithdrawn is listed among those playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Unwithdraw" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is listed among those playing

    Scenario: Unwithdrawing does not ask first
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Unwithdraw" is pressed on the player "Sam Someone"
      Then no modal dialog is open

    Scenario: A player unwithdrawn comes after those who stayed playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Unwithdraw" is pressed on the player "Sam Someone"
      Then the first player listed is "Alex Another"

    Scenario: A player unwithdrawn from the tab is kept playing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      And "Unwithdraw" is pressed on the player "Sam Someone"
      When the players of "Block A" in "Spring Open" are opened
      Then the player "Sam Someone" is listed among those playing

  Rule: Once a knockout has a game in use, its players are fixed

    The knockout's draw is four places, each round the best of 1, so Sam
    Someone plays Alex Another in the first round and Chris Third is drawn
    against a bye. Pat Fourth is a player of the tournament who is not in it.

    Scenario: A knockout with no games offers Add Player
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the tab offers "Add Player"

    Scenario: A knockout with a game does not offer Add Player
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the tab does not offer "Add Player"

    Scenario Outline: A player in a knockout with a game does not offer what would change the draw
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Chris Third" does not offer "<option>"

      Examples:
        | option |
        | Up     |
        | Remove |

    Scenario: A player in a knockout with a game does not offer Down
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Alex Another" does not offer "Down"

    Scenario: A player in a knockout with a game still offers Withdraw
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the player "Chris Third" offers "Withdraw"

    Scenario: A knockout whose only game is archived offers Add Player
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open"
      When the players of "Final Stage" in "Spring Open" are opened
      Then the tab offers "Add Player"

    Scenario Outline: Either player of a knockout of two whose only game is archived offers Remove
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Final" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final" of "Spring Open"
      When the players of "Final" in "Spring Open" are opened
      Then the player "<player>" offers "Remove"

      Examples:
        | player       |
        | Sam Someone  |
        | Alex Another |

    Scenario Outline: Either player of a knockout of two whose only game is archived is removed
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Final" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final" of "Spring Open"
      And the players of "Final" in "Spring Open" are open
      And "Remove" is pressed on the player "<player>"
      When the question is confirmed
      Then the player "<player>" is not listed

      Examples:
        | player       |
        | Sam Someone  |
        | Alex Another |

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A player's name and what
    they represent are what the manager typed, and nobody's language. A flag's
    name is a word of the reader's language, and is looked at.

    Scenario: The players playing are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

    Scenario: The withdrawn players are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

    Scenario: The question before removing is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When the way to remove the player "Sam Someone" is pressed
      Then every word in the question but the player's name is in the test locale

    Scenario: The question before withdrawing is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When the way to withdraw the player "Sam Someone" is pressed
      Then every word in the question but the player's name is in the test locale

    Scenario: A competition with every player in it says so in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Player can be pressed with a thumb
      When the players of "Block A" in "Spring Open" are opened
      Then the button "Add Player" is at least 44 pixels tall

    Scenario: The drop-down can be pressed with a thumb
      When the players of "Block A" in "Spring Open" are opened
      Then the drop-down of players to add is at least 44 pixels tall

    Scenario Outline: What a player offers can be pressed with a thumb
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then "<option>" on the player "<player>" is at least 44 pixels tall

      Examples:
        | player       | option        |
        | Sam Someone  | Carry Forward |
        | Sam Someone  | Down          |
        | Alex Another | Up            |
        | Sam Someone  | Remove        |
        | Sam Someone  | Withdraw      |
        | Chris Third  | Unwithdraw    |

    Scenario: A long name wraps rather than widening the page
      Given the player is to represent "The Very Long Named Croquet And Lawn Bowls Club Of The Northern Districts"
      And "organiser@example.com" has added the player "Maximilian Alexander Fitzwilliam-Worthington" to "Spring Open"
      And "organiser@example.com" has entered the player "Maximilian Alexander Fitzwilliam-Worthington" in "Block A" of "Spring Open"
      When the players of "Block A" in "Spring Open" are opened
      Then the page is no wider than the window

  Rule: A help icon leads to the help for carrying forward, removing and withdrawing a player

    The help icon is in the dialog's title bar (`players.feature`), and opens
    the section of the help for what the dialog does in another tab.

    Scenario: The carry forward dialog leads to the section on carrying forward
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Carry Forward" is pressed on the player "Sam Someone"
      Then the help icon leads to "/help/tournament-managers/standard-tournament/entering-players-in-a-competition#carry-forward"

    Scenario: The question asked before removing a player leads to the section on removing a player
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Remove" is pressed on the player "Sam Someone"
      Then the help icon leads to "/help/tournament-managers/standard-tournament/entering-players-in-a-competition#removing-a-player"

    Scenario: The question asked before withdrawing a player leads to the section on withdrawing a player
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Block A" in "Spring Open" are open
      When "Withdraw" is pressed on the player "Sam Someone"
      Then the help icon leads to "/help/tournament-managers/standard-tournament/entering-players-in-a-competition#withdrawing-a-player"
