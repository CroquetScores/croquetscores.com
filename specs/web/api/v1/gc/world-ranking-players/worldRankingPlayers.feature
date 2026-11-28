@postgres
Feature: An app lists the golf croquet world ranking players

  An app that follows golf croquet asks the API for the players the world
  rankings know, at `/api/v1/gc/world-ranking-players`, in the order of their
  names. Each is told by the id the site gave it, the number the rankings give
  it, its name, its country, where the API tells of its games, when it was
  archived (nothing for a player the rankings still list), and when it last
  changed.

  Two golf croquet players can have one name, and are told apart by their
  country, which is why a player is told with it, as the site's code for it
  (`england`, `nz`) and not the letters the rankings write. Each is a player of its own,
  with an id of its own, and the list has both.

  This is the golf croquet twin of `ac/world-ranking-players/worldRankingPlayers.feature`
  and keeps to it, since the golf croquet rankings give each player a number
  as the association croquet rankings do.

  The id is the site's own and the number is the rankings'. An app keeps the
  id, because the rankings can change a player's number when they find two
  players of one name, and the id is what stays the same player's through
  that.

  A player the rankings stop listing is still listed here, with the moment it
  was archived, since an app that kept it needs to be told it has gone and not
  left to guess.

  The list follows the conventions of the other reads (`tournaments.feature`):
  an answer is a page of at most 100 with the way to the next, an app that
  reads it again asks only for what changed since a moment it names, every
  answer carries a mark of what it said and the date it last changed so that
  one the app already has is answered as not modified, and each player carries
  a mark of its own so that an app can tell which of those it was told of has
  changed.

  A caller with no key is answered as a caller with a key is, and a key that
  does not work is refused.

  An app that asks for no page is asking for the list from the start, and the
  names are refreshed first (the last rule). Every other scenario here asks for
  page 1, so that none of them reads the rankings' site.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: The players are listed with what an app needs of each

    Scenario: A player is listed
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the API answers 200
      And the golf croquet world ranking players listed are "Gus Golfer"

    Scenario: A player says which one it is
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Gus Golfer" says its id

    Scenario: A player says the number the rankings give it
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says its world ranking number is 11

    Scenario: A player says its country
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11 from "nz"
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says its country is "nz"

    Scenario: Two players of one name in different countries are both listed
      Given the golf croquet world ranking player "Ivor Brand" with the world ranking number 4 from "england"
      And the golf croquet world ranking player "Ivor Brand" with the world ranking number 5 from "wales"
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the page lists 2 golf croquet world ranking players

    Scenario: A player says where the API tells of its games
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Gus Golfer" says where the API tells of its games

    Scenario: A player the rankings still list says it is not archived
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Gus Golfer" says it is not archived

    Scenario: A player the rankings no longer list says when it was archived
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet world ranking player "Gus Golfer" is archived
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Gus Golfer" says it was archived at "2026-03-02T10:00:00.000Z"

    Scenario: The players are listed in the order of their names
      Given the golf croquet world ranking player "Cara Croquet" with the world ranking number 13
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking player "Bea Bishop" with the world ranking number 12
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the first golf croquet world ranking player listed is "Ann Archer"
      And the second golf croquet world ranking player listed is "Bea Bishop"
      And the third golf croquet world ranking player listed is "Cara Croquet"

    Scenario: Players of one name are listed in the order of their numbers
      Given the golf croquet world ranking player "Ivor Brand" with the world ranking number 5 from "wales"
      And the golf croquet world ranking player "Ivor Brand" with the world ranking number 4 from "england"
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the first golf croquet world ranking player listed is from "england"
      And the second golf croquet world ranking player listed is from "wales"

    Scenario: An association croquet player is not listed
      Given the world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then no golf croquet world ranking players are listed

    Scenario: The players are listed with no key
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      When the golf croquet world ranking players are asked for page 1 with no key
      Then the API answers 200
      And the golf croquet world ranking players listed are "Gus Golfer"

    Scenario: A key that does not work is refused
      When the golf croquet world ranking players are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: An answer is a page of at most 100

    Scenario: A page says how many players there are in all
      Given 3 golf croquet world ranking players
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 2
      Then the page lists 2 golf croquet world ranking players
      And the API says there are 3 golf croquet world ranking players in all

    Scenario: A page says where the next one is
      Given 3 golf croquet world ranking players
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 2
      Then the API says the next page is 2

    Scenario: The last page says there is no next one
      Given 3 golf croquet world ranking players
      When the golf croquet world ranking players are asked for page 2 with that key and a page size of 2
      Then the page lists 1 golf croquet world ranking players
      And the API says there is no next page

    Scenario: A page size over 100 is 100
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 500
      Then the API says the page size is 100

    Scenario: A page size is 100 when none is asked for
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the API says the page size is 100

    Scenario: A page that is not a whole number is refused
      When the golf croquet world ranking players are asked for page "first" with that key
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.PageNotWhole"
      And the API says the field at fault is "page"

    Scenario: A page before the first is refused
      When the golf croquet world ranking players are asked for page "0" with that key
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.PageOutOfRange"
      And the API says the field at fault is "page"

    Scenario: A page that holds no players is refused
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 0
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.PageSizeOutOfRange"
      And the API says the field at fault is "pageSize"

    Scenario: A page size that is not a whole number is refused
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of "many"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.PageSizeNotWhole"
      And the API says the field at fault is "pageSize"

  Rule: An app asks only for what has changed

    A player who was archived changed when it was archived, so an app that
    asks for what changed since it last read is told of the players that have
    gone as well as the ones that came.

    Scenario: What changed since a moment is all that is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet world ranking player "Bea Bishop" with the world ranking number 12
      When the golf croquet world ranking players are asked for page 1 with that key changed since "2026-03-01T12:00:00Z"
      Then the golf croquet world ranking players listed are "Bea Bishop"

    Scenario: A player archived since a moment is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" is archived
      When the golf croquet world ranking players are asked for page 1 with that key changed since "2026-03-01T12:00:00Z"
      Then the golf croquet world ranking players listed are "Ann Archer"

    Scenario: Nothing is listed where nothing changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key changed since "2026-03-01T12:00:00Z"
      Then no golf croquet world ranking players are listed

    Scenario: A player says the moment it last changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says it last changed at "2026-03-01T10:00:00.000Z"

    Scenario: A player that changed at the very moment asked about is not listed again
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key changed since "2026-03-01T10:00:00.000Z"
      Then no golf croquet world ranking players are listed

    Scenario: A moment with no zone is refused
      When the golf croquet world ranking players are asked for page 1 with that key changed since "2026-03-01T10:00:00"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.ChangedSinceNotAMoment"

    Scenario: A moment that is not one is refused
      When the golf croquet world ranking players are asked for page 1 with that key changed since "yesterday"
      Then the API answers 400
      And the API's code is "GolfCroquetWorldRankingPlayers.ChangedSinceNotAMoment"
      And the API says the field at fault is "changedSince"

  Rule: An answer unchanged is answered not modified, by its mark

    Scenario: An answer carries a mark of what it said
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the API gives a mark of its answer

    Scenario: An answer says when it last changed
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the API says when its answer last changed

    Scenario: The same question is answered not modified once its mark is sent
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking players are asked for page 1 with that key
      When the golf croquet world ranking players are asked again for page 1 with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: A change is answered in full
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking players are asked for page 1 with that key
      And the golf croquet world ranking player "Ann Archer" is archived
      When the golf croquet world ranking players are asked again for page 1 with that key and the mark it gave
      Then the API answers 200

    Scenario: A player carries a mark of itself
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says a mark of itself

    Scenario: A player that did not change keeps its mark
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking player "Bea Bishop" with the world ranking number 12
      And the golf croquet world ranking players are asked for page 1 with that key
      And the mark of the golf croquet world ranking player "Ann Archer" is kept
      And the golf croquet world ranking player "Bea Bishop" is archived
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says the mark it said before

    Scenario: A player that changed says another mark
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking players are asked for page 1 with that key
      And the mark of the golf croquet world ranking player "Ann Archer" is kept
      And the golf croquet world ranking player "Ann Archer" is archived
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says another mark than it said before

    Scenario: A list of no players has no date to give
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the API says nothing of when its answer last changed

  Rule: A player keeps its id when the rankings change its number

    The rankings can give a different number to a player when they find two
    players of one name. The id is what an app keeps, so it is the same
    before and after.

    Scenario: A player whose number the rankings change keeps its id
      Given the golf croquet world ranking player "Ann Archer" with the world ranking number 11
      And the golf croquet world ranking players are asked for page 1 with that key
      And the id of the golf croquet world ranking player "Ann Archer" is kept
      And the rankings give the golf croquet world ranking player "Ann Archer" the number 99
      When the golf croquet world ranking players are asked for page 1 with that key
      Then the golf croquet world ranking player "Ann Archer" says the id it said before
      And the golf croquet world ranking player "Ann Archer" says its world ranking number is 99

  Rule: A player keeps its id when the rankings are read again

    The golf croquet table is today made again from each list the rankings
    give, which would give every player a new id each time. An app keeps the
    id, so a player the rankings go on listing is the same player, with the
    same id, however often the list is read.

    Background:
      Given a fake of the world rankings

    Scenario: A player listed again keeps its id
      Given the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet list names "Dee Dunn"
      And the golf croquet world ranking players are asked with that key
      And the id of the golf croquet world ranking player "Dee Dunn" is kept
      And the server's clock reads "2026-03-02T11:01:00Z"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking player "Dee Dunn" says the id it said before

    Scenario: A player listed again did not change
      Given the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet list names "Dee Dunn"
      And the golf croquet world ranking players are asked with that key
      And the mark of the golf croquet world ranking player "Dee Dunn" is kept
      And the server's clock reads "2026-03-02T11:01:00Z"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking player "Dee Dunn" says the mark it said before

  Rule: Asked with no page, the list first refreshes the golf croquet names

    The names come from the world rankings' own site, and nobody signs in to
    bring them over, so the list refreshes them itself when it is asked for
    from the start. Only golf croquet's list is read, since this is the golf
    croquet list. A page asked for by number, the first included, only reads
    what is kept, so an app that follows the pages does not make the rankings'
    site be read once for each of them. A list the rankings' site does not give
    is no reason to refuse the answer: the players kept before are listed, as
    they were.

    The rankings' site is read at most once an hour, since an app that asks
    again and again would otherwise have the site read as often. The hour is
    counted by the clock of the site's own process, so a site that has been
    started again reads the rankings' site the first time it is asked.

    Background:
      Given a fake of the world rankings

    Scenario: A player the rankings have added is listed
      Given the golf croquet list names "Dee Dunn"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking players listed are "Dee Dunn"

    Scenario: A player the rankings no longer list is archived
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      And the golf croquet list names "Dee Dunn"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking player "Gus Golfer" says it is archived

    # The fake rankings number the first name on their list 1, so the player is
    # kept as 1 for the list to name them again.
    Scenario: A player the rankings list again is no longer archived
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 1
      And the golf croquet world ranking player "Gus Golfer" is archived
      And the golf croquet list names "Gus Golfer"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking player "Gus Golfer" says it is not archived

    Scenario: A page asked for by number does not read the rankings' site
      Given the golf croquet list names "Dee Dunn"
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 100
      Then no golf croquet world ranking players are listed

    Scenario: A page asked for by number does not ask the rankings' site
      When the golf croquet world ranking players are asked for page 1 with that key and a page size of 100
      Then nothing was asked of the world rankings

    Scenario: A request that only asks for the headers does not read the rankings' site
      When the head of the golf croquet world ranking players is asked for with that key
      Then nothing was asked of the world rankings

    Scenario: The association croquet list is not read
      When the golf croquet world ranking players are asked with that key
      Then the association croquet list was not asked for

    Scenario: A list that cannot be read leaves the players as they were
      Given the golf croquet world ranking player "Gus Golfer" with the world ranking number 15
      And the world rankings answer the golf croquet list with a failure
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking players listed are "Gus Golfer"

    Scenario: A list that cannot be read still gets an answer
      Given the world rankings answer the golf croquet list with a failure
      When the golf croquet world ranking players are asked with that key
      Then the API answers 200

    Scenario: The rankings' site is not read again within the hour
      Given the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet world ranking players are asked with that key
      And the golf croquet list names "Dee Dunn"
      And the server's clock reads "2026-03-02T10:59:00Z"
      When the golf croquet world ranking players are asked with that key
      Then no golf croquet world ranking players are listed

    Scenario: The rankings' site is read again after the hour
      Given the server's clock reads "2026-03-02T10:00:00Z"
      And the golf croquet world ranking players are asked with that key
      And the golf croquet list names "Dee Dunn"
      And the server's clock reads "2026-03-02T11:01:00Z"
      When the golf croquet world ranking players are asked with that key
      Then the golf croquet world ranking players listed are "Dee Dunn"

    Scenario: A list that could not be read is not read again within the hour
      Given the server's clock reads "2026-03-02T10:00:00Z"
      And the world rankings answer the golf croquet list with a failure
      And the golf croquet world ranking players are asked with that key
      And the world rankings answer the golf croquet list with the list
      And the golf croquet list names "Dee Dunn"
      And the server's clock reads "2026-03-02T10:30:00Z"
      When the golf croquet world ranking players are asked with that key
      Then no golf croquet world ranking players are listed
