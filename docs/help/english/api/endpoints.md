# The API's endpoints

Every address here is under `/api/v0` on the site, and every answer is JSON. What applies to all of them, such as keys, allowances, errors, and asking cheaply, is in [help for app developers](index.md). Fields may be added to any answer without a new version (see [fields may be added](index.md#fields-may-be-added)), so ignore what you do not know.

A tournament, or a competition, is named in an address by the part of its id after the slash: for `tournament/4f2a…` the address says `4f2a…`. Every answer says where to find what it tells of in an `href`, and where the site shows it in a `uri`, a path beginning with a slash.

## A year's tournaments {#tournaments}

`GET /api/v0/tournaments?year=2026`

Takes:

- `year`, needed, a whole number such as `2026`.
- `sport`, a sport's code (see [the sports](#sports)), to list only that sport. Without it a year of every sport is one request.
- `changedSince`, a moment written as `2026-03-01T10:00:00Z`, to list only what changed after it.
- `page` and `pageSize`, a page being at most 100.

It answers `tournaments`, each with:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (or `null`), `sport`
- `uri` and `href`
- `national` and `international`, whether the organiser ticked them
- `changedAt`, when anything was last kept of the tournament or of any of its competitions
- `etag`, made of what the tournament says, so that you can tell which of a changed list's tournaments changed

and `total`, `page`, `pageSize` and `next`, which is where the next page is, or `null` at the last. The id is the same however the tournament is renamed or moved. The list is asked again with the `ETag` it sent, and answered `304` where nothing changed.

## The sports {#sports}

The `sport` a tournament says, and the one a list may be asked for, is one of these codes:

| Code  | Sport               |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

A sport may be added in the future, as a field may (see [fields may be added](index.md#fields-may-be-added)), so an app should cope with a code it does not know.

## One tournament {#tournament}

`GET /api/v0/tournaments/{id}`

Says what the list says of it, and:

- `competitions`: each with `id`, `name`, `kind` (`block`, `swiss`, `knockout` or `test`), `uri`, `href`, `changedAt` and `etag`.
- `players`, for a tournament played by players: each with `id`, `name`, `worldRankingName`, `handicap` as a number (or `null`), `representing` (or `null`) and `etag`.
- `teams`, for a tournament played by teams, which has no players of its own: each with `id`, `name`, `shortName` and its `players`, each with `id`, `name` and `worldRankingName`.

A key made for one tournament reads that one and no other, and is refused for any other with `ApiKey.LimitedToAnotherTournament`. The answer is `304` where the `ETag` or `Last-Modified` it sent is current.

## One competition {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Says the competition's `name`, `kind`, `href`, `uri`, `changedAt`, and where the API tells of its games (`games`) and, for a block and a Swiss, which are the only ones that have them, its standings (`standings`).

## A block's or a Swiss's standings {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Says the competition, and `standings`: for each player `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (or `null`) and `shared`, whether the position is shared. A block adds `lost`, `gamesWon` and `netGames`, which a Swiss does not say.

## A competition's games {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Says the competition, and its games. Each game has an `id`, a `winner` and a `loser`, `drawn`, `withdrawn` (played but counting for nothing), `round` (a knockout's, the first being 1, and `null` elsewhere) and `changedAt`. Each side says the player's `playerId`, their `name` and their `score` as it was typed, such as `26tp`. Where a game was drawn, which side is called the winner is only the order they were typed.

A test, the match between two teams, says `matches` and not `games`: each match with the two `players`, one of each team, and the `games` between them.

## What a key may do {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Needs a key, and says what that key may do in the tournament: `part`, which is the part its account has (`manager`, `scorer` or `neither`), `mayRead` and `mayWrite`. An app can say why a write would be refused before it sends one. The answer is for the key that asked, so it is never kept (`Cache-Control: no-store`).

## Tournaments that changed year {#changed-year}

`GET /api/v0/tournaments/changed-year`

Lists the tournaments that came into another year than the one they were in, so that an app can move what it keeps. Takes `changedSince`, `page` and `pageSize`. Each has `tournamentId`, `previousYear` and `newYear`.

## Tournaments that were archived {#archived}

`GET /api/v0/tournaments/archived`

Lists the tournaments that have been archived, so that an app can stop showing them. Takes `archivedSince`, written as `2026-03-01T10:00:00Z`, `page` and `pageSize`. Each has `tournamentId` and `archivedAt`.
