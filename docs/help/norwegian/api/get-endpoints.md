# API-ets GET-endepunkter

Disse adressene leser og endrer ingenting; de som endrer noe, står i [POST-endepunktene](post-endpoints.md). Hver adresse her ligger under `/api/v1` på nettstedet, og hvert svar er JSON. Det som gjelder alle, som nøkler, kvoter, feil og hvordan man spør billig, står i [hjelpen for apputviklere](index.md). Felt kan legges til i et hvilket som helst svar uten en ny versjon (se [felt kan legges til](index.md#fields-may-be-added)), så overse det du ikke kjenner.

En turnering, eller en konkurranse, oppgis i en adresse med den delen av id-en som står etter skråstreken: for `tournament/4f2a…` står det `4f2a…` i adressen. Hvert svar sier hvor det det handler om, finnes, i en `href`, og hvor nettstedet viser det, i en `uri`, en sti som begynner med en skråstrek.

## Et års turneringer {#tournaments}

`GET /api/v1/tournaments?year=2026`

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

`GET /api/v1/tournaments/{id}`

Sier det listen sier om den, og:

- `competitions`: hver med `id`, `name`, `kind` (`block`, `swiss`, `knockout` eller `test`), `uri`, `href`, `changedAt` og `etag`.
- `players`, for en turnering som spilles av spillere: hver med `id`, `name`, `worldRankingName`, `handicap` som et tall (eller `null`), `representing` (eller `null`) og `etag`.
- `teams`, for en turnering som spilles av lag og ikke har egne spillere: hvert med `id`, `name`, `shortName` og sine `players`, hver med `id`, `name` og `worldRankingName`.

En nøkkel laget for én turnering leser den og ingen annen, og avvises for enhver annen med `ApiKey.LimitedToAnotherTournament`. Svaret er `304` der den `ETag` eller `Last-Modified` som ble sendt, er gjeldende.

## Hva en turnering kan være {#choices}

Tre lister sier hva en turnering kan være på nettstedet det spørres om: idrettene, formatene og landene den kan holdes i. Det er det nettstedets eget skjema for en ny turnering tilbyr, så en turnering som lages med en kode fra en av dem, godtas av [å lage en turnering](post-endpoints.md#create-tournament). De trenger ingen nøkkel. Hver tar `language`, en språkkode som `de`, for å navngi valgene sine på det språket; en kode nettstedet ikke tilbyr, avvises med `400`, og `code` sier hvilken liste som avviste den: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` eller `Countries.LanguageUnknown`. Uten den navngis idrettene og landene på engelsk, og formatene på språket nettleseren eller nettstedets informasjonskapsel sier; oppgi derfor en `language` der navnene vises. Hvert svar bærer en `ETag` og besvares med `304` der det er uendret.

### Idrettene {#sports}

`GET /api/v1/tournaments/sports`

Svarer med `sports`, hver med `code` og `name`. `sport`, som en turnering sier og som en liste kan spørres om, er en av disse kodene. Croquet Scores tilbyr `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) og `gb` (Gateball); Gateball Scores tilbyr bare Gateball. En idrett kan bli lagt til i fremtiden, slik et felt kan (se [felt kan bli lagt til](index.md#fields-may-be-added)), så en app bør tåle en kode den ikke kjenner.

### Formatene {#formats}

`GET /api/v1/tournaments/formats`

Svarer med `formats`, hvert med `code`, navnet en turnering lages med, `name`, `teams`, om det spilles av lag, og `drawsLevelTests`, om en turnering i det trekker en uavgjort-test med mindre den sier at den ikke gjør det.

### Landene {#countries}

`GET /api/v1/countries`

Svarer med `countries`, hvert med `code` (som `au`), `name` og `regions`, hver med `code` og `name`. De står i rekkefølgen av navnene sine på språket det spørres på. En region navngis slik den ble registrert, for det meste på sitt eget lands språk. Et land som ikke er delt inn, har én region, som er landet selv.

## Én konkurranse {#competition}

`GET /api/v1/tournaments/{id}/competitions/{id}`

Sier konkurransens `name`, `kind`, `href`, `uri` og `changedAt`, og hvor API-et forteller om partiene dens (`games`) og, for en blokk og en sveitsisk, som er de eneste som har det, om stillingen (`standings`).

## Stillingen i en blokk eller en sveitsisk {#standings}

`GET /api/v1/tournaments/{id}/competitions/{id}/standings`

Sier konkurransen og `standings`: for hver spiller `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (eller `null`) og `shared`, om plasseringen deles. En blokk legger til `lost`, `gamesWon` og `netGames`, som en sveitsisk ikke sier.

## En konkurranses partier {#games}

`GET /api/v1/tournaments/{id}/competitions/{id}/games`

Sier konkurransen og partiene dens. Hvert parti har en `id`, en `winner` og en `loser`, `drawn`, `withdrawn` (spilt, men teller ikke), `round` (i en utslagning, der den første er 1, og `null` ellers) og `changedAt`. Hver side sier spillerens `playerId`, `name` og `score` slik den ble skrevet inn, som `26tp`. Der et parti ble uavgjort, er det bare rekkefølgen de ble skrevet inn i, som avgjør hvilken side som kalles vinneren.

En test, kampen mellom to lag, sier `matches` og ikke `games`: hver kamp med de to `players`, en fra hvert lag, og `games` mellom dem.

## Hva en nøkkel får gjøre {#permissions}

`GET /api/v1/tournaments/{id}/permissions`

Trenger en nøkkel og sier hva den nøkkelen får gjøre i turneringen: `part`, som er rollen kontoen dens har (`manager`, `scorer` eller `neither`), `mayRead` og `mayWrite`. En app kan si hvorfor en skriving ville bli avvist, før den sender en. Svaret er for nøkkelen som spurte, så det tas aldri vare på (`Cache-Control: no-store`).

## Turneringer som har byttet år {#changed-year}

`GET /api/v1/tournaments/changed-year`

Lister turneringene som har kommet i et annet år enn det de var i, slik at en app kan flytte det den har. Tar `changedSince`, `page` og `pageSize`. Hver har `tournamentId`, `previousYear` og `newYear`.

## Turneringer som er arkivert {#archived}

`GET /api/v1/tournaments/archived`

Lister turneringene som er arkivert, slik at en app kan slutte å vise dem. Tar `archivedSince`, skrevet som `2026-03-01T10:00:00Z`, `page` og `pageSize`. Hver har `tournamentId` og `archivedAt`.

## Spillere på verdensrankingen {#world-ranking-players}

`GET /api/v1/ac/world-ranking-players`

Lister Association Croquet-spillerne verdensrankingene kjenner. Tar `changedSince`, skrevet som `2026-03-01T10:00:00Z`, `page` og `pageSize`, der en side er høyst 100. Svarer med `worldRankingPlayers`, hver med:

- `id`, og `worldRankingId`, nummeret rankingene gir spilleren
- `name`, slik rankingene navngir dem
- `games`, der API-et forteller om spillerens partier (se [en spillers partier](#world-ranking-player-games))
- `archivedAt`, når spilleren ble arkivert, eller `null`
- `changedAt`, og `etag`, laget av det spilleren sier

og `total`, `page`, `pageSize` og `next`, slik et års turneringer har. Listen spørres om igjen med `ETag` den sendte, og besvares med `304` der ingenting er endret. En forespørsel som avvises, avvises med en `code` som begynner med `WorldRankingPlayers.`, som `WorldRankingPlayers.PageNotWhole`, og et `field`.

## Partiene til en spiller på verdensrankingen {#world-ranking-player-games}

`GET /api/v1/ac/world-ranking-players/{id}/games`

`id` er den delen av spillerens `id` som står etter skråstreken, slik `games` i listen over gir den. Lister Association Croquet-partiene spilleren har spilt, enten i en blokk, et sveitsisk system, en utslagning eller en test, og enten de spilte for seg selv eller for et lag. Tar `changedSince`, `page` og `pageSize` slik listen over spillere gjør, og svarer med `games`, i den rekkefølgen de ble lagt til, hvert fra spillerens side:

- `id`, `tournamentId` og `competitionId`
- `won`, om spilleren vant, som er `false` for uavgjort, og `drawn`
- `score`, spillerens, og `opponentScore`, begge slik de ble skrevet inn, som `26tp`
- `opponentName`, slik rankingene navngir dem der motstanderen er en spiller på verdensrankingen og ellers slik turneringen fører dem, og `opponentId`, motstanderens `id` i listen over, eller `null` der de ikke er en
- `archived` og `withdrawn`: et parti i en arkivert konkurranse eller turnering, eller et arkivert eller trukket parti, listes og sier det, slik at en app som har beholdt det, kan slutte å telle det
- `addedAt`, eller `null` for et parti som ble lagt til før nettstedet noterte når, og `changedAt`
- `etag`

og `total`, `page`, `pageSize` og `next`. En spiller nettstedet ikke kjenner, avvises med `404` og `WorldRankingPlayers.NotFound`, som ikke er det samme som en spiller uten partier, som har en tom liste.
