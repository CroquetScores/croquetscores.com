# API:ets POST-slutpunkter

De här adresserna ändrar något. De som bara läser finns i [GET-slutpunkterna](get-endpoints.md). Varje adress här ligger under `/api/v1` på webbplatsen, och det som webbplatsens egna sidor ändrar ändras av just de här adresserna, så en app har inte en mindre uppsättning än webbplatsen. Det som gäller dem alla, som nycklar, kvoter och fel, står i [hjälpen för apputvecklare](index.md); vem som får skriva står [nedan](#who-may-write).

En turnering, en tävling och resten namnges i en adress med den del av id:t som står efter snedstrecket: för `tournament/4f2a…` står det `4f2a…` i adressen. Förfrågans innehåll namnger andra saker på samma sätt, som `player` gör nedan, utom där det står att det är hela id:t.

Skicka innehållet som JSON, med `Content-Type: application/json`. Ett fält som utelämnas är detsamma som ett tomt och avvisas som sådant. Det som skickas och inte nämns på den här sidan ignoreras. Ett svar har `Cache-Control: no-store`.

## Vem som får skriva {#who-may-write}

En förfrågan som ändrar något görs av en nyckel som skapats för att skriva (se [nycklar](index.md#keys)) eller av en person som är inloggad på webbplatsen. En nyckel får göra det som kontot den skapades för får göra, och inget mer:

- En nyckel som bara skapats för att läsa avvisas med `ApiKey.ReadOnly`.
- En nyckel som skapats för en turnering får bara ändra den turneringen. För en annan avvisas den med `ApiKey.LimitedToAnotherTournament`, och den får inte skapa en turnering, som inte tillhör någon.
- En turnerings arrangörer får ändra allt i den.
- En turnerings resultatförare får göra det som görs med resultat, och inget annat: lägga till ett parti, rätta det, flytta det, arkivera det, återställa det, låta det utgå och ångra att det utgått. Allt annat i turneringen avvisas för dem med `Tournament.NotAManager`.
- Alla andra avvisas med `Tournament.NotAManager`, eller med `Tournament.NotAManagerOrScorer` där en resultatförare hade släppts in.

`GET /api/v1/tournaments/{id}/permissions` säger vilken roll en nyckel har i en turnering (se [vad en nyckel får göra](get-endpoints.md#permissions)), så att en app kan säga varför en skrivning skulle avvisas innan den skickar den.

## Vad ett svar är {#answers}

En förfrågan som skapar något besvaras med `201` och det nyas `id`, som är hela dess id, så som GET-slutpunkterna säger det. En förfrågan som ändrar något som finns besvaras med `204`, utan något innehåll. En avvisad förfrågan besvaras som vilket fel som helst (se [fel](index.md#errors)): med sin `code`, som en app kan lita på, och med det `field` den gällde, där det fanns ett.

Att skicka en förfrågan två gånger är inte detsamma som att skicka den en gång: ett parti som lagts till två gånger är två partier. En app som inte fått veta om en förfrågan gick igenom bör läsa vad den ändrade innan den skickar den igen.

## Turneringar {#tournaments}

### Skapa en turnering {#create-tournament}

`POST /api/v1/tournaments`

Tar `name`, `starts` och `finishes` (skrivna som `2026-10-03T00:00:00Z`), `format` (en kod, se [formaten](get-endpoints.md#formats)), `sport` (en kod, se [sporterna](get-endpoints.md#sports)), `country` (en kod som `au`, se [länderna](get-endpoints.md#countries)) och, om du vill, `region` (en kod för landet, från samma lista), `subtitle`, `levelTestsDrawn`, `national` och `international`, där var och en av de tre sista är `true` eller `false`. Svarar `201` med `id` och `address`, som är där webbplatsen visar den.

### Arkivera eller återställ en turnering {#tournament-actions}

`POST /api/v1/tournaments/{id}/archive`

`POST /api/v1/tournaments/{id}/restore`

Tar inget innehåll och svarar `204`.

### Lägg till en arrangörsanteckning {#notes}

`POST /api/v1/tournaments/{id}/notes`

Tar `title` och `description`. Svarar `201` med anteckningens `id`. En beskrivning får vara upp till 750 000 tecken, och förfrågan får vara så stor som det kräver.

## De som har en roll i en turnering {#people}

`POST /api/v1/tournaments/{id}/scorers`

`POST /api/v1/tournaments/{id}/managers`

Gör någon till resultatförare eller arrangör. Tar `emailAddress`, e-postadressen till deras konto, och svarar `204`.

`POST /api/v1/tournaments/{id}/scorers/{account}/remove`

`POST /api/v1/tournaments/{id}/managers/{account}/remove`

Tar bort en resultatförare eller en arrangör. De tar inget innehåll och svarar `204`. `account` är den del av kontots id som står efter `account/`.

## Tävlingar {#competitions}

### Lägg till en tävling {#add-competition}

`POST /api/v1/tournaments/{id}/competitions`

Tar `kind`, en av `block`, `swiss`, `knockout` eller `losers-knockout`, och ett `name`, sedan det som dess typ har:

- Ett block tar `bestOf` och `rounds` (hur många gånger var och en möter var och en) och kan ta `tieBreak`.
- En schweizer tar `bestOf`.
- En utslagning tar `places` och `rounds`, en lista med bäst av hur många i varje omgång, och kan ta `losers`, en lista med förlorarutslagningar som skapas tillsammans med den, var och en med ett `name` och en `round`.
- En förlorarutslagning tar `from`, tävlingen vars förlorare den tar, och den `round` den tar dem från.

Ett block, en schweizer och en utslagning kan också ta hur de spelas och räknas: `handicap`, `drawsAllowed`, `worldRankings` och `advantage`, var och en `true` eller `false`, och `maximumHoops`, ett tal, eller `null` för inget tak. En tävling som säger `advantage` avvisas med `Advantage.NotOffered` så länge webbplatsen inte erbjuder Advantage Golf Croquet. Svarar `201` med tävlingens `id`.

### Lägg till en landskamp {#add-test}

`POST /api/v1/tournaments/{id}/tests`

En landskamp är matchen mellan två lag i en lagturnering. Tar `firstTeam` och `secondTeam`, var och en ett lags id efter `team/`, `starts` och `finishes`, `expectedMatches`, `bestOf`, `group` och samma regler som en tävling kan ta. Svarar `201` med sitt `id`, som är en tävlings.

### Flytta, arkivera eller återställ en tävling {#competition-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/restore`

Flyttar den ett steg upp eller ner i turneringens lista, eller arkiverar den, eller återställer den. De tar inget innehåll och svarar `204`. En landskamp flyttas, arkiveras och återställs också med dessa.

## En tävlings spelare {#competition-players}

### Anmäl en spelare {#enter-player}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players`

Anmäler en av turneringens spelare till tävlingen. Tar `player`, den del av turneringsspelarens id som står efter `tournament-player/`. Svarar `201` med `id`, som är spelarens id i tävlingen och inte i turneringen.

### Flytta, låta utgå, ta tillbaka eller ta bort en spelare {#competition-player-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Flyttar en spelare ett steg upp eller ner, låter dem utgå, ångrar att de utgått eller tar ut dem ur tävlingen. `player` är den del av deras id i tävlingen som står efter `competition-player/`. De tar inget innehåll och svarar `204`.

Varje bye i en tävling har samma id, så en bye skiljs åt med `order`, ett heltal som läggs till i adressen som `?order=2`. Allt annat avvisas med `Request.Invalid`.

## En tävlings partier {#games}

### Lägg till ett parti {#add-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games`

Tar `winner` och `loser`, var och en den del av en tävlingsspelares id som står efter `competition-player/`, och resultaten. En landskamps spelare är inte dess egna, så för en landskamp är var och en hela id:t för en spelare i ett av dess lag, som `team-player/…`.

Resultaten är så som tävlingen för dem:

- `winnerScore` och `loserScore`, som de skrevs, som `26` eller `26tp`.
- För en tävling som spelas som Advantage Golf Croquet, i stället för dessa, `winnerHoops`, `winnerTarget`, `loserHoops` och `loserTarget`: de bågar varje sida gjorde och de bågar den spelade till. Ett `w` efter ett av dem, som `"3w"`, säger att den sidan vann där bråken är lika.

En förfrågan med den sorts resultat som tävlingen inte för avvisas, med `Game.AdvantageScoreTyped` eller `Game.HoopsAndTargetsNotAdvantage`. Svarar `201` med partiets `id`.

### Rätta ett parti {#correct-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Tar resultaten som när man lägger till ett parti och, där de ändrats, `winner` och `loser`. En spelare som inte skickas är den som partiet redan har. `game` är den del av dess id som står efter `game/`. Svarar `204`.

### Flytta, arkivera, återställ eller låt ett parti utgå {#game-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Flyttar en landskamps resultat ett steg upp eller ner, arkiverar ett parti eller återställer det, låter det utgå (det spelades och räknas inte) eller ångrar att det utgått. De tar inget innehåll och svarar `204`. Dessa, och de två ovan, är vad en resultatförare får göra.

## En turnerings spelare {#tournament-players}

### Lägg till en spelare {#add-tournament-player}

`POST /api/v1/tournaments/{id}/players`

Lägger till en spelare i turneringen. Tar `name` och kan ta `representing`, `handicap`, `flag` och `worldRankingName`; det som utelämnas eller är tomt lämnas osagt. Svarar `201` med spelarens `id`, som är hela deras id, så som GET-slutpunkterna säger det. En spelare utan namn, eller med namnet på en som redan finns, nekas. En spelare [anmäls](#enter-player) till en tävling med den del av detta `id` som står efter `tournament-player/`.

### Flytta, arkivera eller återställ en spelare {#tournament-player-actions}

`POST /api/v1/tournaments/{id}/players/{player}/up`

`POST /api/v1/tournaments/{id}/players/{player}/down`

`POST /api/v1/tournaments/{id}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/players/{player}/restore`

Flyttar en av turneringens spelare ett steg upp eller ner, eller arkiverar eller återställer dem. `player` är den del av deras id som står efter `tournament-player/`. De tar inget innehåll och svarar `204`.

## En turnerings lag {#teams}

### Lägg till ett lag {#add-team}

`POST /api/v1/tournaments/{id}/teams`

Tar `name` och `shortName` och kan ta `flag`. Svarar `201` med lagets `id`.

### Lägg till en spelare i ett lag {#add-team-player}

`POST /api/v1/tournaments/{id}/teams/{team}/players`

Tar `name` och kan ta `worldRankingName`. Svarar `201` med spelarens `id`.

### Flytta, arkivera eller återställ ett lag {#team-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/restore`

De tar inget innehåll och svarar `204`.

### Flytta, arkivera eller återställ ett lags spelare {#team-player-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/restore`

`player` är den del av deras id som står efter `team-player/`. De tar inget innehåll och svarar `204`.
