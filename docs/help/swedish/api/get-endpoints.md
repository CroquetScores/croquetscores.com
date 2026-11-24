# API:ets GET-slutpunkter

De här adresserna läser och ändrar ingenting; de som ändrar något finns i [POST-slutpunkterna](post-endpoints.md). Varje adress här ligger under `/api/v0` på webbplatsen, och varje svar är JSON. Det som gäller dem alla, som nycklar, kvoter, fel och hur man frågar billigt, står i [hjälpen för apputvecklare](index.md). Fält kan läggas till i vilket svar som helst utan en ny version (se [fält kan läggas till](index.md#fields-may-be-added)), så strunta i det du inte känner till.

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

## Vad en turnering kan vara {#choices}

Tre listor säger vad en turnering kan vara på webbplatsen som frågas: dess sporter, dess format och de länder den kan spelas i. Det är vad webbplatsens eget formulär för en ny turnering erbjuder, så en turnering som skapas med en kod från en av dem godtas av [att skapa en turnering](post-endpoints.md#create-tournament). De behöver ingen nyckel. Var och en tar `language`, ett språks kod som `de`, för att namnge sina val på det språket; en kod som webbplatsen inte erbjuder nekas med `400`, och dess `code` säger vilken lista som nekade den: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` eller `Countries.LanguageUnknown`. Utan den namnges sporterna och länderna på engelska, och formaten på det språk som webbläsaren eller webbplatsens kaka säger; ange alltså ett `language` där namnen visas. Varje svar bär ett `ETag` och besvaras med `304` där det är oförändrat.

### Sporterna {#sports}

`GET /api/v0/tournaments/sports`

Svarar med `sports`, var och en med `code` och `name`. Den `sport` en turnering säger, och den en lista kan efterfrågas för, är en av de här koderna. Croquet Scores erbjuder `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) och `gb` (Gateball); Gateball Scores erbjuder bara Gateball. En sport kan läggas till i framtiden, liksom ett fält kan (se [fält kan läggas till](index.md#fields-may-be-added)), så en app bör klara en kod den inte känner till.

### Formaten {#formats}

`GET /api/v0/tournaments/formats`

Svarar med `formats`, var och en med `code`, namnet en turnering skapas med, `name`, `teams`, om det spelas av lag, och `drawsLevelTests`, om en turnering i det lottar ett avgörande test om den inte säger att den inte gör det.

### Länderna {#countries}

`GET /api/v0/countries`

Svarar med `countries`, var och en med `code` (som `au`), `name` och `regions`, var och en med `code` och `name`. De står i ordning efter sina namn på det språk som efterfrågas. En region namnges så som den registrerades, för det mesta på sitt eget lands språk. Ett land som inte är indelat har en region, som är landet självt.

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

## Spelare i världsrankingen {#world-ranking-players}

`GET /api/v0/ac/world-ranking-players`

Listar de Association Croquet-spelare som världsrankingarna känner till. Tar `changedSince`, skrivet som `2026-03-01T10:00:00Z`, `page` och `pageSize`, där en sida är högst 100. Svarar med `worldRankingPlayers`, var och en med:

- `id` och `worldRankingId`, numret rankingarna ger spelaren
- `name`, så som rankingarna namnger dem
- `games`, där API:et berättar om spelarens partier (se [en spelares partier](#world-ranking-player-games))
- `archivedAt`, när spelaren arkiverades, eller `null`
- `changedAt` och `etag`, gjort av det spelaren säger

och `total`, `page`, `pageSize` och `next`, som ett års turneringar har. Listan efterfrågas igen med det `ETag` den skickade, och besvaras med `304` där inget har ändrats. En förfrågan som nekas, nekas med en `code` som börjar med `WorldRankingPlayers.`, som `WorldRankingPlayers.PageNotWhole`, och ett `field`.

## En spelares partier i världsrankingen {#world-ranking-player-games}

`GET /api/v0/ac/world-ranking-players/{id}/games`

`id` är den del av spelarens `id` som står efter snedstrecket, så som `games` i listan ovan ger det. Listar de Association Croquet-partier spelaren har spelat, vare sig i ett block, ett schweiziskt system, en utslagning eller ett test, och vare sig de spelade för sig själva eller för ett lag. Tar `changedSince`, `page` och `pageSize` som listan över spelare, och svarar med `games`, i den ordning de lades till, var och en från spelarens sida:

- `id`, `tournamentId` och `competitionId`
- `won`, om spelaren vann, vilket är `false` vid oavgjort, och `drawn`
- `score`, spelarens, och `opponentScore`, båda så som de skrevs, till exempel `26tp`
- `opponentName`, så som rankingarna namnger dem där motståndaren är en spelare i världsrankingen och annars så som turneringen för dem, och `opponentId`, motståndarens `id` i listan ovan, eller `null` där de inte är en
- `archived` och `withdrawn`: ett parti i en arkiverad tävling eller turnering, eller ett arkiverat eller återkallat parti, listas och säger det, så att en app som har behållit det kan sluta räkna det
- `addedAt`, eller `null` för ett parti som lades till innan webbplatsen noterade när, och `changedAt`
- `etag`

och `total`, `page`, `pageSize` och `next`. En spelare som webbplatsen inte känner till nekas med `404` och `WorldRankingPlayers.NotFound`, vilket inte är detsamma som en spelare utan partier, som har en tom lista.
