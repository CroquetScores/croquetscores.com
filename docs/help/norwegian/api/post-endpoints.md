# API-ets POST-endepunkter

Disse adressene endrer noe. De som bare leser, står i [GET-endepunktene](get-endpoints.md). Hver adresse her ligger under `/api/v1` på nettstedet, og det nettstedets egne sider endrer, endres av de samme adressene, slik at en app ikke har et mindre sett enn nettstedet. Det som gjelder alle, som nøkler, kvoter og feil, står i [hjelpen for apputviklere](index.md); hvem som kan skrive, står [nedenfor](#who-may-write).

En turnering, en konkurranse og resten navngis i en adresse med den delen av id-en som står etter skråstreken: for `tournament/4f2a…` står det `4f2a…` i adressen. En forespørselskropp navngir andre ting på samme måte, slik `player` gjør nedenfor, unntatt der det står at det er hele id-en.

Send kroppen som JSON, med `Content-Type: application/json`. Et felt som er utelatt, er det samme som et tomt, og avvises som det. Det som sendes og ikke er nevnt på denne siden, blir ignorert. Et svar har `Cache-Control: no-store`.

## Hvem som kan skrive {#who-may-write}

En forespørsel som endrer noe, gjøres av en nøkkel som er laget for å skrive (se [nøkler](index.md#keys)), eller av en person som er logget inn på nettstedet. En nøkkel kan gjøre det kontoen den ble laget for kan gjøre, og ikke mer:

- En nøkkel som bare ble laget for å lese, avvises med `ApiKey.ReadOnly`.
- En nøkkel som ble laget for én turnering, kan bare endre den turneringen. For en annen avvises den med `ApiKey.LimitedToAnotherTournament`, og den kan ikke opprette en turnering, som ikke hører til noen.
- En turnerings ledere kan endre alt ved den.
- En turnerings poengførere kan gjøre det som gjøres med resultater, og ingenting annet: legge til et parti, rette det, flytte det, arkivere det, gjenopprette det, trekke det og oppheve trekkingen. Alt annet i turneringen avvises for dem med `Tournament.NotAManager`.
- Alle andre avvises med `Tournament.NotAManager`, eller med `Tournament.NotAManagerOrScorer` der en poengfører ville blitt sluppet inn.

`GET /api/v1/tournaments/{id}/permissions` sier hvilken rolle en nøkkel har i en turnering (se [hva en nøkkel kan gjøre](get-endpoints.md#permissions)), slik at en app kan si hvorfor en skriving ville blitt avvist før den sender den.

## Hva et svar er {#answers}

En forespørsel som oppretter noe, besvares med `201` og den nye tingens `id`, som er hele id-en, slik GET-endepunktene sier den. En forespørsel som endrer noe som finnes, besvares med `204`, uten noe i kroppen. En forespørsel som avvises, besvares som enhver feil (se [feil](index.md#errors)): med sin `code`, som en app kan stole på, og med `field`, det den gjaldt, der det var ett.

Å sende en forespørsel to ganger er ikke det samme som å sende den én gang: et parti som er lagt til to ganger, er to partier. En app som ikke får vite om en forespørsel gikk gjennom, bør lese det den endret før den sender den på nytt.

## Turneringer {#tournaments}

### Opprett en turnering {#create-tournament}

`POST /api/v1/tournaments`

Tar `name`, `starts` og `finishes` (skrevet som `2026-10-03T00:00:00Z`), `format` (en kode, se [formatene](get-endpoints.md#formats)), `sport` (en kode, se [idrettene](get-endpoints.md#sports)), `country` (en kode som `au`, se [landene](get-endpoints.md#countries)) og om ønsket `region` (en kode for landet, fra samme liste), `subtitle`, `levelTestsDrawn`, `national` og `international`, der hver av de tre siste er `true` eller `false`. Svarer `201` med `id` og `address`, som er der nettstedet viser den.

### Arkiver eller gjenopprett en turnering {#tournament-actions}

`POST /api/v1/tournaments/{id}/archive`

`POST /api/v1/tournaments/{id}/restore`

Tar ingen kropp og svarer `204`.

### Legg til et notat fra en leder {#notes}

`POST /api/v1/tournaments/{id}/notes`

Tar `title` og `description`. Svarer `201` med notatets `id`. En beskrivelse kan være på opptil 750 000 tegn, og forespørselen kan være så stor som det krever.

## Menneskene som har en rolle i en turnering {#people}

`POST /api/v1/tournaments/{id}/scorers`

`POST /api/v1/tournaments/{id}/managers`

Gjør noen til poengfører eller leder. Tar `emailAddress`, e-postadressen til kontoen deres, og svarer `204`.

`POST /api/v1/tournaments/{id}/scorers/{account}/remove`

`POST /api/v1/tournaments/{id}/managers/{account}/remove`

Tar en poengfører eller en leder bort. De tar ingen kropp og svarer `204`. `account` er den delen av kontoens id som står etter `account/`.

## Konkurranser {#competitions}

### Legg til en konkurranse {#add-competition}

`POST /api/v1/tournaments/{id}/competitions`

Tar `kind`, én av `block`, `swiss`, `knockout` eller `losers-knockout`, og et `name`, så det som typen har:

- En blokk tar `bestOf` og `rounds` (hvor mange ganger hver spiller mot hver), og kan ta `tieBreak`.
- En sveitsisk konkurranse tar `bestOf`.
- En utslagning tar `places` og `rounds`, en liste med best av hvor mange i hver runde, og kan ta `losers`, en liste med taperutslagninger som opprettes sammen med den, hver med et `name` og en `round`.
- En taperutslagning tar `from`, konkurransen hvis tapere den tar, og `round`, runden den tar dem fra.

En blokk, en sveitsisk konkurranse og en utslagning kan også ta hvordan de spilles og telles: `handicap`, `drawsAllowed`, `worldRankings` og `advantage`, hver `true` eller `false`, og `maximumHoops`, et tall, eller `null` for ingen grense. En konkurranse som sier `advantage`, avvises med `Advantage.NotOffered` så lenge nettstedet ikke tilbyr Advantage Golf Croquet. Svarer `201` med konkurransens `id`.

### Legg til en test {#add-test}

`POST /api/v1/tournaments/{id}/tests`

En test er kampen mellom to lag i en lagturnering. Tar `firstTeam` og `secondTeam`, hver et lags id etter `team/`, `starts` og `finishes`, `expectedMatches`, `bestOf`, `group` og de samme reglene som en konkurranse kan ta. Svarer `201` med sin `id`, som er en konkurranses.

### Flytt, arkiver eller gjenopprett en konkurranse {#competition-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/restore`

Flytter den en plass opp eller ned i turneringens liste, eller arkiverer den, eller gjenoppretter den. De tar ingen kropp og svarer `204`. En test flyttes, arkiveres og gjenopprettes også med disse.

## En konkurranses spillere {#competition-players}

### Meld på en spiller {#enter-player}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players`

Melder én av turneringens spillere på konkurransen. Tar `player`, den delen av turneringsspillerens id som står etter `tournament-player/`. Svarer `201` med `id`, som er spillerens id i konkurransen og ikke i turneringen.

### Flytt, trekk, hent tilbake eller fjern en spiller {#competition-player-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Flytter en spiller en plass opp eller ned, trekker dem, opphever trekkingen eller tar dem ut av konkurransen. `player` er den delen av id-en deres i konkurransen som står etter `competition-player/`. De tar ingen kropp og svarer `204`.

Hver bye i en konkurranse har den samme id-en, så en bye skilles ut med `order`, et heltall som legges til adressen som `?order=2`. Alt annet avvises med `Request.Invalid`.

## En konkurranses partier {#games}

### Legg til et parti {#add-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games`

Tar `winner` og `loser`, hver den delen av en konkurransespillers id som står etter `competition-player/`, og resultatene. En tests spillere er ikke dens egne, så for en test er hver hele id-en til en spiller i ett av lagene, som `team-player/…`.

Resultatene er slik konkurransen fører dem:

- `winnerScore` og `loserScore`, slik de ble skrevet, som `26` eller `26tp`.
- For en konkurranse som spilles som Advantage Golf Croquet, i stedet for disse, `winnerHoops`, `winnerTarget`, `loserHoops` og `loserTarget`: buene hver side tok og buene den spilte mot. En `w` etter en av dem, som `"3w"`, sier at den siden vant der brøkene er like.

En forespørsel med den typen resultat konkurransen ikke fører, avvises med `Game.AdvantageScoreTyped` eller `Game.HoopsAndTargetsNotAdvantage`. Svarer `201` med partiets `id`.

### Rett et parti {#correct-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Tar resultatene som å legge til et parti, og der de er endret, `winner` og `loser`. En spiller som ikke sendes, er den partiet allerede har. `game` er den delen av id-en som står etter `game/`. Svarer `204`.

### Flytt, arkiver, gjenopprett eller trekk et parti {#game-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Flytter en tests resultat en plass opp eller ned, arkiverer et parti eller gjenoppretter det, trekker det (det ble spilt, og teller ikke) eller opphever trekkingen. De tar ingen kropp og svarer `204`. Disse, og de to ovenfor, er det en poengfører kan gjøre.

## En turnerings spillere {#tournament-players}

### Legg til en spiller {#add-tournament-player}

`POST /api/v1/tournaments/{id}/players`

Legger en spiller til turneringen. Tar `name`, og kan ta `representing`, `handicap`, `flag` og `worldRankingName`; det som er utelatt eller tomt, blir ikke sagt. Svarer `201` med spillerens `id`, som er hele id-en deres, slik GET-endepunktene sier den. En spiller uten navn, eller med navnet til en som allerede er der, avvises. En spiller [meldes på](#enter-player) en konkurranse med den delen av denne `id`-en som står etter `tournament-player/`.

### Flytt, arkiver eller gjenopprett en spiller {#tournament-player-actions}

`POST /api/v1/tournaments/{id}/players/{player}/up`

`POST /api/v1/tournaments/{id}/players/{player}/down`

`POST /api/v1/tournaments/{id}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/players/{player}/restore`

Flytter en av turneringens spillere en plass opp eller ned, eller arkiverer eller gjenoppretter dem. `player` er den delen av id-en deres som står etter `tournament-player/`. De tar ingen kropp og svarer `204`.

## En turnerings lag {#teams}

### Legg til et lag {#add-team}

`POST /api/v1/tournaments/{id}/teams`

Tar `name` og `shortName`, og kan ta `flag`. Svarer `201` med lagets `id`.

### Legg til en spiller på et lag {#add-team-player}

`POST /api/v1/tournaments/{id}/teams/{team}/players`

Tar `name`, og kan ta `worldRankingName`. Svarer `201` med spillerens `id`.

### Flytt, arkiver eller gjenopprett et lag {#team-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/restore`

De tar ingen kropp og svarer `204`.

### Flytt, arkiver eller gjenopprett en lagspiller {#team-player-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/restore`

`player` er den delen av id-en deres som står etter `team-player/`. De tar ingen kropp og svarer `204`.
