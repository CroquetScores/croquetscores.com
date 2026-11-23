# API-ets GET-endepunkter

Disse adressene leser og endrer ingenting; de som endrer noe, står i [POST-endepunktene](post-endpoints.md). Hver adresse her ligger under `/api/v0` på nettstedet, og hvert svar er JSON. Det som gjelder alle, som nøkler, kvoter, feil og hvordan man spør billig, står i [hjelpen for apputviklere](index.md). Felt kan legges til i et hvilket som helst svar uten en ny versjon (se [felt kan legges til](index.md#fields-may-be-added)), så overse det du ikke kjenner.

En turnering, eller en konkurranse, oppgis i en adresse med den delen av id-en som står etter skråstreken: for `tournament/4f2a…` står det `4f2a…` i adressen. Hvert svar sier hvor det det handler om, finnes, i en `href`, og hvor nettstedet viser det, i en `uri`, en sti som begynner med en skråstrek.

## Et års turneringer {#tournaments}

`GET /api/v0/tournaments?year=2026`

Tar:

- `year`, påkrevd, et helt tall som `2026`.
- `sport`, koden til en idrett (se [idrettene](#sports)), for å liste bare den. Uten den er et år med alle idretter én forespørsel.
- `changedSince`, et tidspunkt skrevet som `2026-03-01T10:00:00Z`, for å liste bare det som er endret etter det.
- `page` og `pageSize`, der en side er høyst 100.

Det svarer med `tournaments`, hver med:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (eller `null`), `sport`
- `uri` og `href`
- `national` og `international`, om arrangøren krysset av for dem
- `changedAt`, når noe sist ble lagret om turneringen eller en av konkurransene dens
- `etag`, laget av det turneringen sier, slik at du kan se hvilke turneringer i en endret liste som er endret

og `total`, `page`, `pageSize` og `next`, som sier hvor neste side er, eller `null` på den siste. Id-en er den samme uansett hvordan turneringen omdøpes eller flyttes. Listen spørres på nytt med den `ETag` den sendte, og besvares med `304` der ingenting er endret.

## Én turnering {#tournament}

`GET /api/v0/tournaments/{id}`

Sier det listen sier om den, og:

- `competitions`: hver med `id`, `name`, `kind` (`block`, `swiss`, `knockout` eller `test`), `uri`, `href`, `changedAt` og `etag`.
- `players`, for en turnering som spilles av spillere: hver med `id`, `name`, `worldRankingName`, `handicap` som et tall (eller `null`), `representing` (eller `null`) og `etag`.
- `teams`, for en turnering som spilles av lag og ikke har egne spillere: hvert med `id`, `name`, `shortName` og sine `players`, hver med `id`, `name` og `worldRankingName`.

En nøkkel laget for én turnering leser den og ingen annen, og avvises for enhver annen med `ApiKey.LimitedToAnotherTournament`. Svaret er `304` der den `ETag` eller `Last-Modified` som ble sendt, er gjeldende.

## Idrettene {#sports}

`sport`, som en turnering oppgir og som en liste kan spørres for, er en av disse kodene:

| Kode  | Idrett              |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

En idrett kan legges til i framtiden, slik et felt kan (se [felt kan legges til](index.md#fields-may-be-added)), så en app bør tåle en kode den ikke kjenner.

## Én konkurranse {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Sier konkurransens `name`, `kind`, `href`, `uri` og `changedAt`, og hvor API-et forteller om partiene dens (`games`) og, for en blokk og en sveitsisk, som er de eneste som har det, om stillingen (`standings`).

## Stillingen i en blokk eller en sveitsisk {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Sier konkurransen og `standings`: for hver spiller `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (eller `null`) og `shared`, om plasseringen deles. En blokk legger til `lost`, `gamesWon` og `netGames`, som en sveitsisk ikke sier.

## En konkurranses partier {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Sier konkurransen og partiene dens. Hvert parti har en `id`, en `winner` og en `loser`, `drawn`, `withdrawn` (spilt, men teller ikke), `round` (i en utslagning, der den første er 1, og `null` ellers) og `changedAt`. Hver side sier spillerens `playerId`, `name` og `score` slik den ble skrevet inn, som `26tp`. Der et parti ble uavgjort, er det bare rekkefølgen de ble skrevet inn i, som avgjør hvilken side som kalles vinneren.

En test, kampen mellom to lag, sier `matches` og ikke `games`: hver kamp med de to `players`, en fra hvert lag, og `games` mellom dem.

## Hva en nøkkel får gjøre {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Trenger en nøkkel og sier hva den nøkkelen får gjøre i turneringen: `part`, som er rollen kontoen dens har (`manager`, `scorer` eller `neither`), `mayRead` og `mayWrite`. En app kan si hvorfor en skriving ville bli avvist, før den sender en. Svaret er for nøkkelen som spurte, så det tas aldri vare på (`Cache-Control: no-store`).

## Turneringer som har byttet år {#changed-year}

`GET /api/v0/tournaments/changed-year`

Lister turneringene som har kommet i et annet år enn det de var i, slik at en app kan flytte det den har. Tar `changedSince`, `page` og `pageSize`. Hver har `tournamentId`, `previousYear` og `newYear`.

## Turneringer som er arkivert {#archived}

`GET /api/v0/tournaments/archived`

Lister turneringene som er arkivert, slik at en app kan slutte å vise dem. Tar `archivedSince`, skrevet som `2026-03-01T10:00:00Z`, `page` og `pageSize`. Hver har `tournamentId` og `archivedAt`.
