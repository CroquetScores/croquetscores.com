@postgres
Feature: An app lists the games of a golf croquet world ranking player

  An app that follows golf croquet asks the API for the games a world ranking
  player has played, at `/api/v1/gc/world-ranking-players/{id}/games`, where
  the list of the players (`worldRankingPlayers.feature`, beside the other
  golf croquet features) says to ask. The player is named by the id the site
  gave it.

  This is the golf croquet twin of `ac/world-ranking-player-games/worldRankingPlayerGames.feature`
  and keeps to it wherever golf croquet can. A game is the player's when a
  player of a golf croquet tournament is the world ranking player, which the
  tournament's player is found to be by the name the rankings know them by,
  and where two world ranking players have that name, by who the tournament's
  player represents and where the tournament is played
  (`TournamentContents.feature`). A tournament's player the rankings' names do
  not tell apart is nobody's, since a game given to the wrong one is worse than
  a game left out. It does not matter whether the competition counts
  towards the world rankings: every game is listed. A game in a test between
  teams is the player's when they played it for their team, and is told as any
  other game is. Each is told from the player's side: its id and the ids of
  its tournament and competition, whether the player won, the player's score
  and the opponent's as they were typed, the opponent's name and, where the
  opponent is a world ranking player too, their id, whether it was drawn,
  whether it was archived or withdrawn, when it was added, when it last
  changed, and a mark of its own.

  The opponent is named as the rankings name them where they are a world
  ranking player, and by the name the tournament keeps them under where not,
  so that an app can show a name for every opponent.

  The games are in the order they were added, whatever competition each is in
  and whenever that competition last changed, so that a game added later never
  comes before one added earlier. A game that was added before the website
  kept when, of which there are some, comes first. Archived and withdrawn games
  are listed and say so, since an app that kept one needs to be told it no
  longer counts.

  The list follows the conventions of the other reads
  (`worldRankingPlayers.feature`): pages of at most 100, what changed since a moment, a mark of the answer and of each game, a reply of
  not modified where the app already has it, no key needed, and a key that
  does not work refused.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
    And the golf croquet world ranking player "Bea Bishop" with the world ranking number 12
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" is for the sport "gc"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Ann Archer" to "Spring Open"
    And "organiser@example.com" has added the player "Bea Bishop" to "Spring Open"
    And "organiser@example.com" has entered the player "Ann Archer" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Bea Bishop" in "Block A" of "Spring Open"

  Rule: A player's games are listed with what an app needs of each

    Scenario: A game is listed
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the API answers 200
      And one game is listed

    Scenario: A game says its id
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says its id

    Scenario: A game says its tournament
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the id of "Spring Open"

    Scenario: A game says its competition
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the id of "Block A"

    Scenario: A game the player won says so
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the player won

    Scenario: A game the player lost says so
      Given "Bea Bishop" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the player did not win

    Scenario: A game says the player's score
      Given "Bea Bishop" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the player scored "3"

    Scenario: A game says the opponent's score
      Given "Bea Bishop" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the opponent scored "7"

    Scenario: A game says which world ranking player the opponent is
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the id of the golf croquet world ranking player "Bea Bishop" as the opponent

    Scenario: A game names the opponent as the rankings do
      Given the player is to have the world ranking name "Bea Bishop"
      And "organiser@example.com" has added the player "B. Bishop" to "Spring Open"
      And "organiser@example.com" has entered the player "B. Bishop" in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "B. Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the opponent is called "Bea Bishop"

    Scenario: An opponent the rankings do not know has no id
      Given "organiser@example.com" has added the player "Vic Visitor" to "Spring Open"
      And "organiser@example.com" has entered the player "Vic Visitor" in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Vic Visitor" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the opponent is not a world ranking player

    Scenario: An opponent the rankings do not know is named as the tournament names them
      Given "organiser@example.com" has added the player "Vic Visitor" to "Spring Open"
      And "organiser@example.com" has entered the player "Vic Visitor" in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Vic Visitor" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the opponent is called "Vic Visitor"

    Scenario: An opponent whose name two world ranking players share has no id
      Given the golf croquet world ranking player "Vic Visitor" with the world ranking number 31 from "england"
      And the golf croquet world ranking player "Vic Visitor" with the world ranking number 32 from "wales"
      And "organiser@example.com" has added the player "Vic Visitor" to "Spring Open"
      And "organiser@example.com" has entered the player "Vic Visitor" in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Vic Visitor" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the opponent is not a world ranking player

    Scenario: A game is the player's of the name two world ranking players share who the tournament's player represents
      Given the golf croquet world ranking player "Ivor Brand" with the world ranking number 41 from "england"
      And the golf croquet world ranking player "Ivor Brand" with the world ranking number 42 from "wales"
      And the player is to represent "Wales"
      And "organiser@example.com" has added the player "Ivor Brand" to "Spring Open"
      And "organiser@example.com" has entered the player "Ivor Brand" in "Block A" of "Spring Open"
      And "Ivor Brand" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ivor Brand" from "wales" are asked with that key
      Then one game is listed

    Scenario: A game is not the player's of the name two world ranking players share who the tournament's player does not represent
      Given the golf croquet world ranking player "Ivor Brand" with the world ranking number 41 from "england"
      And the golf croquet world ranking player "Ivor Brand" with the world ranking number 42 from "wales"
      And the player is to represent "Wales"
      And "organiser@example.com" has added the player "Ivor Brand" to "Spring Open"
      And "organiser@example.com" has entered the player "Ivor Brand" in "Block A" of "Spring Open"
      And "Ivor Brand" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ivor Brand" from "england" are asked with that key
      Then no games are listed

    Scenario: A game is nobody's of the name two world ranking players share where nothing tells them apart
      Given the golf croquet world ranking player "Ivor Brand" with the world ranking number 41 from "england"
      And the golf croquet world ranking player "Ivor Brand" with the world ranking number 42 from "wales"
      And "organiser@example.com" has added the player "Ivor Brand" to "Spring Open"
      And "organiser@example.com" has entered the player "Ivor Brand" in "Block A" of "Spring Open"
      And "Ivor Brand" has beaten "Ann Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ivor Brand" from "wales" are asked with that key
      Then no games are listed

    Scenario: A game that was not drawn says so
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was not drawn

    Scenario: A game that was drawn says so
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Draws" to "Spring Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Draws" of "Spring Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "Draws" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 3 to 3 in "Draws" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was drawn

    Scenario: Nobody wins a drawn game
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Draws" to "Spring Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Draws" of "Spring Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "Draws" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 3 to 3 in "Draws" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the player did not win

    Scenario: A game says it was not archived
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was not archived

    Scenario: A game archived is listed and says so
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was archived

    Scenario: A game of an archived competition says it was archived
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was archived

    Scenario: A game of an archived tournament says it was archived
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was archived

    Scenario: A game between two players of one world ranking name is listed once
      Given the player is to have the world ranking name "Ann Archer"
      And "organiser@example.com" has added the player "A. Archer" to "Spring Open"
      And "organiser@example.com" has entered the player "A. Archer" in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "A. Archer" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then one game is listed
      And the API says there is 1 game in all

    Scenario: A game says it was not withdrawn
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was not withdrawn

    Scenario: A game withdrawn is listed and says so
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was withdrawn

    Scenario: A game says when it was added
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it was added at "2026-03-01T10:00:00.000Z"

    Scenario: A game says when it last changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has archived the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says it last changed at "2026-03-02T10:00:00.000Z"

    Scenario: A game of another player is not listed
      Given "organiser@example.com" has added the player "Cal Croquet" to "Spring Open"
      And "organiser@example.com" has entered the player "Cal Croquet" in "Block A" of "Spring Open"
      And "Bea Bishop" has beaten "Cal Croquet" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then no games are listed

    Scenario: A game of a competition that does not count towards the world rankings is listed
      Given "organiser@example.com" has added the block "Friendlies" to "Spring Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Friendlies" of "Spring Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "Friendlies" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Friendlies" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then one game is listed

    Scenario: A game of a test between teams is listed
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Test Series"
      And the tournament "Test Series" is for the sport "gc"
      And "organiser@example.com" has added the team "Red" to "Test Series"
      And "organiser@example.com" has added the team "Blue" to "Test Series"
      And "organiser@example.com" has added the player "Ann Archer" to the team "Red" of "Test Series"
      And "organiser@example.com" has added the player "Bea Bishop" to the team "Blue" of "Test Series"
      And "organiser@example.com" has added the test between "Red" and "Blue" to "Test Series"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "RED v BLU" of "Test Series"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then one game is listed

    Scenario: A game of a test says who the opponent was
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Test Series"
      And the tournament "Test Series" is for the sport "gc"
      And "organiser@example.com" has added the team "Red" to "Test Series"
      And "organiser@example.com" has added the team "Blue" to "Test Series"
      And "organiser@example.com" has added the player "Ann Archer" to the team "Red" of "Test Series"
      And "organiser@example.com" has added the player "Bea Bishop" to the team "Blue" of "Test Series"
      And "organiser@example.com" has added the test between "Red" and "Blue" to "Test Series"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "RED v BLU" of "Test Series"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the game says the id of the golf croquet world ranking player "Bea Bishop" as the opponent

    Scenario: A game of an association croquet tournament is not listed
      Given "organiser@example.com" has created the tournament "Association Open"
      And the tournament "Association Open" is for the sport "ac"
      And "organiser@example.com" has added the block "AC Block" to "Association Open"
      And "organiser@example.com" has added the player "Ann Archer" to "Association Open"
      And "organiser@example.com" has added the player "Bea Bishop" to "Association Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "AC Block" of "Association Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "AC Block" of "Association Open"
      And "Ann Archer" has beaten "Bea Bishop" 26 to 10 in "AC Block" of "Association Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then no games are listed

    Scenario: A player who has played nothing has no games
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the API answers 200
      And no games are listed

    Scenario: A player the rankings no longer list still has its games listed
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the golf croquet world ranking player "Ann Archer" is archived
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then one game is listed

    Scenario: The games are listed with no key
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with no key
      Then the API answers 200

    Scenario: A key that does not work is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A player the site does not know is refused
      When the games of the golf croquet world ranking player with the id "gc-world-ranking-id/nobody" are asked with that key
      Then the API answers 404
      And the API's code is "GolfCroquetWorldRankingPlayers.NotFound"

  Rule: The games are in the order they were added

    The background makes its competition on the default day, so the moments
    here are later than that and no later than now, since a game is never given
    a moment in the future.

    Scenario: The game added earlier comes first, in whatever competition
      Given the server's clock reads "2026-10-10T10:00:00Z"
      And "Bea Bishop" has beaten "Ann Archer" 7 to 5 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-11T10:00:00Z"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" is for the sport "gc"
      And "organiser@example.com" has added the block "Summer Block" to "Summer Open"
      And "organiser@example.com" has added the player "Ann Archer" to "Summer Open"
      And "organiser@example.com" has added the player "Bea Bishop" to "Summer Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Summer Block" of "Summer Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "Summer Block" of "Summer Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Summer Block" of "Summer Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the first game listed is in "Block A"
      And the second game listed is in "Summer Block"

    Scenario: A competition that changed again does not move the game added before
      Given the server's clock reads "2026-10-10T10:00:00Z"
      And "Bea Bishop" has beaten "Ann Archer" 7 to 5 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-11T10:00:00Z"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" is for the sport "gc"
      And "organiser@example.com" has added the block "Summer Block" to "Summer Open"
      And "organiser@example.com" has added the player "Ann Archer" to "Summer Open"
      And "organiser@example.com" has added the player "Bea Bishop" to "Summer Open"
      And "organiser@example.com" has entered the player "Ann Archer" in "Summer Block" of "Summer Open"
      And "organiser@example.com" has entered the player "Bea Bishop" in "Summer Block" of "Summer Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Summer Block" of "Summer Open"
      And the server's clock reads "2026-10-12T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 1 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the first game listed is in "Block A"
      And the second game listed is in "Summer Block"
      And the third game listed is in "Block A"

    Scenario: The games of one competition are in the order they were added
      Given the server's clock reads "2026-10-10T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-11T10:00:00Z"
      And "Bea Bishop" has beaten "Ann Archer" 7 to 5 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the first game says the player won
      And the second game says the player did not win

  Rule: An answer is a page of at most 100

    Scenario: A page says how many games there are in all
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 4 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 5 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key and a page size of 2
      Then the page lists 2 games
      And the API says there are 3 games in all

    Scenario: A page says where the next one is
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 4 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 5 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key and a page size of 2
      Then the API says the next page is 2

    Scenario: The last page says there is no next one
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 4 in "Block A" of "Spring Open"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 5 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked for page 2 with that key and a page size of 2
      Then the page lists 1 games
      And the API says there is no next page

    Scenario: A page past the last lists no games
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked for page 2 with that key and a page size of 5
      Then the API answers 200
      And the page lists 0 games
      And the API says there is no next page

    Scenario: A page size over 100 is 100
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key and a page size of 500
      Then the API says the page size is 100

    Scenario: A page size is 100 when none is asked for
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the API says the page size is 100

    Scenario: A page that is not a whole number is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked for page "first" with that key
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.PageNotWhole"
      And the API says the field at fault is "page"

    Scenario: A page before the first is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked for page "0" with that key
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.PageOutOfRange"
      And the API says the field at fault is "page"

    Scenario: A page that holds no games is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key and a page size of 0
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.PageSizeOutOfRange"
      And the API says the field at fault is "pageSize"

    Scenario: A page size that is not a whole number is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key and a page size of "many"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.PageSizeNotWhole"
      And the API says the field at fault is "pageSize"

  Rule: An app asks only for what has changed

    A game archived or withdrawn changed when it was, so an app that asks for
    what changed since it last read is told of the games that no longer count
    as well as the ones that came.

    Scenario: What changed since a moment is all that is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "Bea Bishop" has beaten "Ann Archer" 7 to 5 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T12:00:00Z"
      Then one game is listed
      And the game says the player did not win

    Scenario: A game archived since a moment is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has archived the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T12:00:00Z"
      Then one game is listed

    Scenario: A game whose competition was archived since a moment is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T12:00:00Z"
      Then one game is listed

    Scenario: Nothing is listed where nothing changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T12:00:00Z"
      Then no games are listed

    Scenario: A game that changed at the very moment asked about is not listed again
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T10:00:00.000Z"
      Then no games are listed

    Scenario: A moment with no zone is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "2026-03-01T10:00:00"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.ChangedSinceNotAMoment"

    Scenario: A moment that is not one is refused
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key changed since "yesterday"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayerGames.ChangedSinceNotAMoment"
      And the API says the field at fault is "changedSince"

  Rule: An answer unchanged is answered not modified, by its mark

    Scenario: An answer carries a mark of what it said
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      When the games of the golf croquet world ranking player "Ann Archer" are asked again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: A change is answered in full
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      And "organiser@example.com" has archived the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked again with that key and the mark it gave
      Then the API answers 200

    Scenario: A list of no games has no date to give
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the API says nothing of when its answer last changed

    Scenario: A game that did not change keeps its mark
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And "Bea Bishop" has beaten "Ann Archer" 7 to 5 in "Block A" of "Spring Open"
      And the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      And the mark of the first game is kept
      And "organiser@example.com" has archived the score of "Bea Bishop" beating "Ann Archer" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the first game says the mark it said before

    Scenario: A game that changed says another mark
      Given "Ann Archer" has beaten "Bea Bishop" 7 to 3 in "Block A" of "Spring Open"
      And the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      And the mark of the first game is kept
      And "organiser@example.com" has archived the score of "Ann Archer" beating "Bea Bishop" in "Block A" of "Spring Open"
      When the games of the golf croquet world ranking player "Ann Archer" are asked with that key
      Then the first game says another mark than it said before
