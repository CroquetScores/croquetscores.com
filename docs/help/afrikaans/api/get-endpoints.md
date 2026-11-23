# Die API se GET-eindpunte

Hierdie adresse lees en verander niks nie; dié wat iets verander, staan in [die POST-eindpunte](post-endpoints.md). Elke adres hier is onder `/api/v0` op die webwerf, en elke antwoord is JSON. Wat vir almal geld, soos sleutels, kwotas, foute en hoe om goedkoop navraag te doen, staan in die [hulp vir toepassingontwikkelaars](index.md). Velde kan sonder 'n nuwe weergawe by enige antwoord gevoeg word (kyk [velde kan bygevoeg word](index.md#fields-may-be-added)), so ignoreer wat jy nie ken nie.

'n Toernooi, of 'n kompetisie, word in 'n adres genoem met die deel van sy id wat ná die skuinsstreep kom: vir `tournament/4f2a…` sê die adres `4f2a…`. Elke antwoord sê waar om te vind waarvan dit vertel in 'n `href`, en waar die webwerf dit wys in 'n `uri`, 'n pad wat met 'n skuinsstreep begin.

## 'n Jaar se toernooie {#tournaments}

`GET /api/v0/tournaments?year=2026`

Neem:

- `year`, nodig, 'n heelgetal soos `2026`.
- `sport`, 'n sportsoort se kode (kyk [die sportsoorte](#sports)), om net daardie sportsoort te lys. Sonder dit is 'n jaar van elke sportsoort een versoek.
- `changedSince`, 'n oomblik geskryf as `2026-03-01T10:00:00Z`, om net te lys wat daarna verander het.
- `page` en `pageSize`, waar 'n bladsy hoogstens 100 is.

Dit antwoord met `tournaments`, elk met:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (of `null`), `sport`
- `uri` en `href`
- `national` en `international`, of die organiseerder dit afgemerk het
- `changedAt`, wanneer daar laas iets van die toernooi of van een van sy kompetisies bewaar is
- `etag`, gemaak van wat die toernooi sê, sodat jy kan sien watter van 'n veranderde lys se toernooie verander het

en `total`, `page`, `pageSize` en `next`, wat sê waar die volgende bladsy is, of `null` by die laaste. Die id bly dieselfde hoe die toernooi ook al hernoem of verskuif word. Die lys word weer gevra met die `ETag` wat dit gestuur het, en met `304` beantwoord waar niks verander het nie.

## Een toernooi {#tournament}

`GET /api/v0/tournaments/{id}`

Sê wat die lys daarvan sê, en:

- `competitions`: elk met `id`, `name`, `kind` (`block`, `swiss`, `knockout` of `test`), `uri`, `href`, `changedAt` en `etag`.
- `players`, vir 'n toernooi wat deur spelers gespeel word: elk met `id`, `name`, `worldRankingName`, `handicap` as 'n getal (of `null`), `representing` (of `null`) en `etag`.
- `teams`, vir 'n toernooi wat deur spanne gespeel word, wat geen eie spelers het nie: elk met `id`, `name`, `shortName` en sy `players`, elk met `id`, `name` en `worldRankingName`.

'n Sleutel wat vir een toernooi gemaak is, lees dié een en geen ander nie, en word vir enige ander met `ApiKey.LimitedToAnotherTournament` geweier. Die antwoord is `304` waar die `ETag` of `Last-Modified` wat gestuur is, steeds geldig is.

## Die sportsoorte {#sports}

Die `sport` wat 'n toernooi sê, en waarvoor 'n lys gevra kan word, is een van hierdie kodes:

| Kode  | Sportsoort          |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

'n Sportsoort kan in die toekoms bygevoeg word, soos 'n veld (kyk [velde kan bygevoeg word](index.md#fields-may-be-added)), so 'n toepassing moet 'n kode kan hanteer wat dit nie ken nie.

## Een kompetisie {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Sê die kompetisie se `name`, `kind`, `href`, `uri`, `changedAt`, en waar die API van sy spelle vertel (`games`) en, vir 'n blok en 'n Switserse kompetisie, wat die enigste is wat dit het, van sy stand (`standings`).

## Die stand van 'n blok of 'n Switserse kompetisie {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Sê die kompetisie, en `standings`: vir elke speler `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (of `null`) en `shared`, of die posisie gedeel word. 'n Blok voeg `lost`, `gamesWon` en `netGames` by, wat 'n Switserse kompetisie nie sê nie.

## 'n Kompetisie se spelle {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Sê die kompetisie en sy spelle. Elke spel het 'n `id`, 'n `winner` en 'n `loser`, `drawn`, `withdrawn` (gespeel maar tel vir niks), `round` (van 'n uitklopkompetisie, waar die eerste 1 is, en `null` elders) en `changedAt`. Elke kant sê die speler se `playerId`, hul `name` en hul `score` soos dit ingetik is, soos `26tp`. Waar 'n spel gelykop was, is dit net die volgorde waarin hulle ingetik is wat bepaal watter kant die wenner genoem word.

'n Toets, die wedstryd tussen twee spanne, sê `matches` en nie `games` nie: elke wedstryd met die twee `players`, een van elke span, en die `games` tussen hulle.

## Wat 'n sleutel mag doen {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Het 'n sleutel nodig en sê wat daardie sleutel in die toernooi mag doen: `part`, wat die rol is wat sy rekening het (`manager`, `scorer` of `neither`), `mayRead` en `mayWrite`. 'n Toepassing kan sê hoekom 'n skryfaksie geweier sou word voordat dit een stuur. Die antwoord is vir die sleutel wat gevra het, so dit word nooit bewaar nie (`Cache-Control: no-store`).

## Toernooie wat van jaar verander het {#changed-year}

`GET /api/v0/tournaments/changed-year`

Lys die toernooie wat in 'n ander jaar gekom het as dié waarin hulle was, sodat 'n toepassing kan skuif wat dit bewaar. Neem `changedSince`, `page` en `pageSize`. Elkeen het `tournamentId`, `previousYear` en `newYear`.

## Toernooie wat geargiveer is {#archived}

`GET /api/v0/tournaments/archived`

Lys die toernooie wat geargiveer is, sodat 'n toepassing kan ophou om hulle te wys. Neem `archivedSince`, geskryf as `2026-03-01T10:00:00Z`, `page` en `pageSize`. Elkeen het `tournamentId` en `archivedAt`.
