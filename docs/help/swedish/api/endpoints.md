# API:ets slutpunkter

Varje adress här ligger under `/api/v0` på webbplatsen, och varje svar är JSON. Det som gäller dem alla, som nycklar, kvoter, fel och hur man frågar billigt, står i [hjälpen för apputvecklare](index.md). Fält kan läggas till i vilket svar som helst utan en ny version (se [fält kan läggas till](index.md#fields-may-be-added)), så strunta i det du inte känner till.

En turnering, eller en tävling, anges i en adress med den del av dess id som står efter snedstrecket: för `tournament/4f2a…` står det `4f2a…` i adressen. Varje svar säger var det som det handlar om finns i en `href`, och var webbplatsen visar det i en `uri`, en sökväg som börjar med ett snedstreck.

## Ett års turneringar {#tournaments}

`GET /api/v0/tournaments?year=2026`

Tar:

- `year`, obligatoriskt, ett heltal som `2026`.
- `sport`, en sports kod (se [sporterna](#sports)), för att bara lista den sporten. Utan den är ett år med alla sporter en enda förfrågan.
- `changedSince`, ett ögonblick skrivet som `2026-03-01T10:00:00Z`, för att bara lista det som ändrats efter det.
- `page` och `pageSize`, där en sida är högst 100.

Det svarar med `tournaments`, var och en med:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (eller `null`), `sport`
- `uri` och `href`
- `national` och `international`, om arrangören kryssade i dem
- `changedAt`, när något sist sparades om turneringen eller någon av dess tävlingar
- `etag`, gjord av det turneringen säger, så att du kan se vilka turneringar i en ändrad lista som ändrats

och `total`, `page`, `pageSize` och `next`, som är var nästa sida finns, eller `null` på den sista. Id:t är detsamma hur turneringen än byter namn eller flyttas. Listan frågas igen med den `ETag` den skickade, och besvaras med `304` där inget ändrats.

## En turnering {#tournament}

`GET /api/v0/tournaments/{id}`

Säger det listan säger om den, och:

- `competitions`: var och en med `id`, `name`, `kind` (`block`, `swiss`, `knockout` eller `test`), `uri`, `href`, `changedAt` och `etag`.
- `players`, för en turnering som spelas av spelare: var och en med `id`, `name`, `worldRankingName`, `handicap` som ett tal (eller `null`), `representing` (eller `null`) och `etag`.
- `teams`, för en turnering som spelas av lag, som inte har några egna spelare: var och ett med `id`, `name`, `shortName` och sina `players`, var och en med `id`, `name` och `worldRankingName`.

En nyckel som gjorts för en turnering läser den och ingen annan, och avvisas för varje annan med `ApiKey.LimitedToAnotherTournament`. Svaret blir `304` där den `ETag` eller `Last-Modified` som skickades är aktuell.

## Sporterna {#sports}

Den `sport` en turnering säger, och den en lista kan efterfrågas för, är en av de här koderna:

| Kod   | Sport               |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

En sport kan läggas till i framtiden, på samma sätt som ett fält (se [fält kan läggas till](index.md#fields-may-be-added)), så en app bör klara en kod den inte känner till.

## En tävling {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Säger tävlingens `name`, `kind`, `href`, `uri`, `changedAt`, och var API:et berättar om dess partier (`games`) och, för ett block och en schweizer, som är de enda som har det, om dess ställning (`standings`).

## Ställningen i ett block eller en schweizer {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Säger tävlingen, och `standings`: för varje spelare `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (eller `null`) och `shared`, om placeringen delas. Ett block lägger till `lost`, `gamesWon` och `netGames`, som en schweizer inte säger.

## En tävlings partier {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Säger tävlingen och dess partier. Varje parti har ett `id`, en `winner` och en `loser`, `drawn`, `withdrawn` (spelat men räknas för ingenting), `round` (i en utslagning, där den första är 1, och `null` på andra håll) och `changedAt`. Varje sida säger spelarens `playerId`, deras `name` och deras `score` så som den skrevs, till exempel `26tp`. Där ett parti blev oavgjort är det bara i vilken ordning de skrevs som avgör vilken sida som kallas vinnare.

Ett test, matchen mellan två lag, säger `matches` och inte `games`: varje match med de två `players`, en från varje lag, och de `games` som spelades mellan dem.

## Vad en nyckel får göra {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Kräver en nyckel och säger vad nyckeln får göra i turneringen: `part`, som är den roll dess konto har (`manager`, `scorer` eller `neither`), `mayRead` och `mayWrite`. En app kan säga varför en skrivning skulle avvisas innan den skickar en. Svaret är till för den nyckel som frågade, så det sparas aldrig (`Cache-Control: no-store`).

## Turneringar som bytt år {#changed-year}

`GET /api/v0/tournaments/changed-year`

Listar de turneringar som hamnat i ett annat år än det de var i, så att en app kan flytta det den sparar. Tar `changedSince`, `page` och `pageSize`. Var och en har `tournamentId`, `previousYear` och `newYear`.

## Turneringar som arkiverats {#archived}

`GET /api/v0/tournaments/archived`

Listar de turneringar som har arkiverats, så att en app kan sluta visa dem. Tar `archivedSince`, skriven som `2026-03-01T10:00:00Z`, `page` och `pageSize`. Var och en har `tournamentId` och `archivedAt`.
