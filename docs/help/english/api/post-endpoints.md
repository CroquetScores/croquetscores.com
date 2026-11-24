# The API's POST endpoints

These addresses change something. The ones that only read are in [the GET endpoints](get-endpoints.md). Every address here is under `/api/v1` on the site, and what the site's own pages change is changed by these same addresses, so an app has no lesser set than the website has. What applies to all of them, such as keys, allowances and errors, is in [help for app developers](index.md); who may write is [below](#who-may-write).

A tournament, a competition and the rest are named in an address by the part of their id after the slash: for `tournament/4f2a…` the address says `4f2a…`. A body names another thing the same way, as `player` below does, except where it says it is the whole id.

Send a body as JSON, with `Content-Type: application/json`. A field left out is the same as one left empty, and is refused as that is. What is sent that this page does not name is ignored. An answer carries `Cache-Control: no-store`.

## Who may write {#who-may-write}

A request that changes something is made by a key that was made to write (see [keys](index.md#keys)), or by a person signed in to the site. A key may do what the account it was made for may do, and no more:

- A key made only to read is refused with `ApiKey.ReadOnly`.
- A key made for one tournament may change that tournament only. It is refused for another with `ApiKey.LimitedToAnotherTournament`, and it may not make a tournament, which belongs to none.
- A tournament's managers may change everything of it.
- A tournament's scorers may do what is done with scores, and nothing else: add a game, correct it, move it, archive it, restore it, withdraw it and reverse its withdrawal. Anything else of the tournament is refused them with `Tournament.NotAManager`.
- Anybody else is refused with `Tournament.NotAManager`, or with `Tournament.NotAManagerOrScorer` where a scorer would have been let.

`GET /api/v1/tournaments/{id}/permissions` says which part a key has in a tournament (see [what a key may do](get-endpoints.md#permissions)), so that an app can say why a write would be refused before it sends one.

## What an answer is {#answers}

A request that makes something is answered `201` with the new thing's `id`, which is the whole of its id, as the GET endpoints say it. A request that changes something that is there is answered `204`, with nothing in the body. A request that is refused is answered as any error is (see [errors](index.md#errors)): by its `code`, which an app relies on, and by the `field` it was about, where there was one.

Sending a request twice is not the same as sending it once: a game added twice is two games. An app that is not told whether a request got through should read what it changed before it sends it again.

## Tournaments {#tournaments}

### Make a tournament {#create-tournament}

`POST /api/v1/tournaments`

Takes `name`, `starts` and `finishes` (written as `2026-10-03T00:00:00Z`), `format` (a code, see [the formats](get-endpoints.md#formats)), `sport` (a code, see [the sports](get-endpoints.md#sports)), `country` (a code such as `au`, see [the countries](get-endpoints.md#countries)), and, if wanted, `region` (a code of the country's, from the same list), `subtitle`, `levelTestsDrawn`, `national` and `international`, each of the last three `true` or `false`. Answers `201` with `id` and `address`, which is where the site shows it.

### Archive or restore a tournament {#tournament-actions}

`POST /api/v1/tournaments/{id}/archive`

`POST /api/v1/tournaments/{id}/restore`

Take no body, and answer `204`.

### Add a manager note {#notes}

`POST /api/v1/tournaments/{id}/notes`

Takes `title` and `description`. Answers `201` with the note's `id`. A description may be up to 750,000 characters, and the request is allowed to be as large as that takes.

## The people who have a part in a tournament {#people}

`POST /api/v1/tournaments/{id}/scorers`

`POST /api/v1/tournaments/{id}/managers`

Make somebody a scorer, or a manager. Take `emailAddress`, the email address of their account, and answer `204`.

`POST /api/v1/tournaments/{id}/scorers/{account}/remove`

`POST /api/v1/tournaments/{id}/managers/{account}/remove`

Take a scorer or a manager off. They take no body and answer `204`. The `account` is the part of the account's id after `account/`.

## Competitions {#competitions}

### Add a competition {#add-competition}

`POST /api/v1/tournaments/{id}/competitions`

Takes `kind`, one of `block`, `swiss`, `knockout` or `losers-knockout`, and a `name`, then what its kind has:

- A block takes `bestOf` and `rounds` (how many times each plays each), and may take `tieBreak`.
- A Swiss takes `bestOf`.
- A knockout takes `places` and `rounds`, a list with the best of for each round, and may take `losers`, a list of losers' knockouts to be made with it, each with a `name` and a `round`.
- A losers' knockout takes `from`, the competition whose losers it takes, and the `round` it takes them from.

A block, a Swiss and a knockout may also take how they are played and counted: `handicap`, `drawsAllowed`, `worldRankings` and `advantage`, each `true` or `false`, and `maximumHoops`, a number, or `null` for no most. A competition that says `advantage` is refused with `Advantage.NotOffered` while the website does not offer Advantage Golf Croquet. Answers `201` with the competition's `id`.

### Add a test {#add-test}

`POST /api/v1/tournaments/{id}/tests`

A test is the match between two teams of a team tournament. Takes `firstTeam` and `secondTeam`, each a team's id after `team/`, `starts` and `finishes`, `expectedMatches`, `bestOf`, `group`, and the same rules as a competition may take. Answers `201` with its `id`, which is a competition's.

### Move, archive or restore a competition {#competition-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/restore`

Move it a place up or down in the tournament's list, or archive it, or restore it. They take no body and answer `204`. A test is moved, archived and restored by these too.

## A competition's players {#competition-players}

### Enter a player {#enter-player}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players`

Enters one of the tournament's players in the competition. Takes `player`, the part of the tournament player's id after `tournament-player/`. Answers `201` with `id`, which is the player's id in the competition and not the tournament's.

### Move, withdraw, bring back or remove a player {#competition-player-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Move a player a place up or down, withdraw them, reverse their withdrawal, or take them out of the competition. The `player` is the part of their id in the competition after `competition-player/`. They take no body and answer `204`.

Every bye in a competition has the same id, so a bye is told apart by `order`, a whole number added to the address as `?order=2`. Anything else is refused with `Request.Invalid`.

## A competition's games {#games}

### Add a game {#add-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games`

Takes the `winner` and the `loser`, each the part of a competition player's id after `competition-player/`, and the scores. A test's players are not its own, so for a test each is the whole id of a player in one of its teams, as `team-player/…`.

The scores are as the competition keeps them:

- `winnerScore` and `loserScore`, as they were typed, such as `26` or `26tp`.
- For a competition played as Advantage Golf Croquet, in place of those, `winnerHoops`, `winnerTarget`, `loserHoops` and `loserTarget`: the hoops each side made and the hoops it was playing to. A `w` after one, as `"3w"`, says that side won where the fractions are level.

A request with the kind of score the competition does not keep is refused, with `Game.AdvantageScoreTyped` or `Game.HoopsAndTargetsNotAdvantage`. Answers `201` with the game's `id`.

### Correct a game {#correct-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Takes the scores as adding a game does, and, where they changed, `winner` and `loser`. A player that is not sent is the game's own. The `game` is the part of its id after `game/`. Answers `204`.

### Move, archive, restore or withdraw a game {#game-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Move a test's score a place up or down, archive a game or restore it, withdraw it (it was played, and counts for nothing) or reverse its withdrawal. They take no body and answer `204`. These, and the two above, are what a scorer may do.

## A tournament's players {#tournament-players}

### Add a player {#add-tournament-player}

`POST /api/v1/tournaments/{id}/players`

Adds a player to the tournament. Takes `name`, and may take `representing`, `handicap`, `flag` and `worldRankingName`; one left out or empty is left unsaid. Answers `201` with the player's `id`, which is the whole of their id as the GET endpoints say it. A player with no name, or with the name of one already there, is refused. A player is entered in a competition by [entering them](#enter-player), by the part of this `id` after `tournament-player/`.

### Move, archive or restore a player {#tournament-player-actions}

`POST /api/v1/tournaments/{id}/players/{player}/up`

`POST /api/v1/tournaments/{id}/players/{player}/down`

`POST /api/v1/tournaments/{id}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/players/{player}/restore`

Move one of the tournament's players a place up or down, or archive or restore them. The `player` is the part of their id after `tournament-player/`. They take no body and answer `204`.

## A tournament's teams {#teams}

### Add a team {#add-team}

`POST /api/v1/tournaments/{id}/teams`

Takes `name` and `shortName`, and may take `flag`. Answers `201` with the team's `id`.

### Add a player to a team {#add-team-player}

`POST /api/v1/tournaments/{id}/teams/{team}/players`

Takes `name`, and may take `worldRankingName`. Answers `201` with the player's `id`.

### Move, archive or restore a team {#team-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/restore`

They take no body and answer `204`.

### Move, archive or restore a team's player {#team-player-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/restore`

The `player` is the part of their id after `team-player/`. They take no body and answer `204`.
