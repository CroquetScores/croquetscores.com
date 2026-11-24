# API POST galapunkti

Šīs adreses kaut ko maina. Tās, kas tikai lasa, ir [GET galapunktos](get-endpoints.md). Katra adrese šeit atrodas zem `/api/v0` vietnē, un to, ko maina vietnes pašas lapas, maina tās pašas adreses, tāpēc lietotnei nav mazāka komplekta nekā vietnei. Kas attiecas uz visām, piemēram, atslēgas, limiti un kļūdas, ir rakstīts [palīdzībā lietotņu izstrādātājiem](index.md); kas drīkst rakstīt, ir [zemāk](#who-may-write).

Turnīru, sacensības un pārējo adresē nosauc ar to id daļu aiz slīpsvītras: turnīram `tournament/4f2a…` adresē ir `4f2a…`. Pieprasījuma pamatteksts citas lietas nosauc tāpat, kā to dara `player` zemāk, izņemot tur, kur teikts, ka tas ir viss id.

Sūtiet pamattekstu kā JSON ar `Content-Type: application/json`. Izlaists lauks ir tas pats, kas tukšs, un tiek noraidīts kā tāds. Kas tiek nosūtīts un nav minēts šajā lapā, tiek ignorēts. Atbildei ir `Cache-Control: no-store`.

## Kas drīkst rakstīt {#who-may-write}

Pieprasījumu, kas kaut ko maina, veic atslēga, kas izveidota rakstīšanai (skatiet [atslēgas](index.md#keys)), vai vietnē pieteicies cilvēks. Atslēga drīkst to, ko drīkst konts, kuram tā izveidota, un neko vairāk:

- Atslēga, kas izveidota tikai lasīšanai, tiek noraidīta ar `ApiKey.ReadOnly`.
- Atslēga, kas izveidota vienam turnīram, drīkst mainīt tikai šo turnīru. Citam tā tiek noraidīta ar `ApiKey.LimitedToAnotherTournament`, un tā nedrīkst izveidot turnīru, kas nepieder nevienam.
- Turnīra pārvaldnieki drīkst mainīt visu, kas ar to saistīts.
- Turnīra rezultātu ievadītāji drīkst darīt to, ko dara ar rezultātiem, un neko citu: pievienot partiju, to labot, pārvietot, arhivēt, atjaunot, neieskaitīt un atcelt neieskaitīšanu. Jebko citu turnīrā viņiem noraida ar `Tournament.NotAManager`.
- Jebkuru citu noraida ar `Tournament.NotAManager` vai ar `Tournament.NotAManagerOrScorer` tur, kur rezultātu ievadītājs būtu ticis ielaists.

`GET /api/v0/tournaments/{id}/permissions` pasaka, kāda loma atslēgai ir turnīrā (skatiet [ko drīkst atslēga](get-endpoints.md#permissions)), lai lietotne varētu pateikt, kāpēc rakstīšana tiktu noraidīta, pirms tā to nosūta.

## Kāda ir atbilde {#answers}

Uz pieprasījumu, kas kaut ko izveido, atbild ar `201` un jaunās lietas `id`, kas ir viss tās id, kā to dod GET galapunkti. Uz pieprasījumu, kas maina kaut ko esošu, atbild ar `204`, bez nekā pamatteksta daļā. Uz noraidītu pieprasījumu atbild kā uz jebkuru kļūdu (skatiet [kļūdas](index.md#errors)): ar tā `code`, uz ko lietotne paļaujas, un ar `field`, uz ko tas attiecās, ja tāds bija.

Nosūtīt pieprasījumu divreiz nav tas pats, kas vienreiz: divreiz pievienota partija ir divas partijas. Lietotnei, kurai nepateica, vai pieprasījums izgāja cauri, pirms nosūtīšanas vēlreiz jāizlasa, ko tas mainīja.

## Turnīri {#tournaments}

### Izveidot turnīru {#create-tournament}

`POST /api/v0/tournaments`

Pieņem `name`, `starts` un `finishes` (rakstītus kā `2026-10-03T00:00:00Z`), `format` (kodu, skatiet [formātus](get-endpoints.md#formats)), `sport` (kodu, skatiet [sporta veidus](get-endpoints.md#sports)), `country` (kodu, piemēram, `au`, skatiet [valstis](get-endpoints.md#countries)) un, ja vajag, `region` (valsts reģiona kodu no tā paša saraksta), `subtitle`, `levelTestsDrawn`, `national` un `international`, katrs no pēdējiem trim ir `true` vai `false`. Atbild ar `201` ar `id` un `address`, kas ir vieta, kur vietne to rāda.

### Arhivēt vai atjaunot turnīru {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

Nepieņem pamattekstu un atbild ar `204`.

### Pievienot pārvaldnieka piezīmi {#notes}

`POST /api/v0/tournaments/{id}/notes`

Pieņem `title` un `description`. Atbild ar `201` ar piezīmes `id`. Apraksts drīkst būt līdz 750 000 rakstzīmju, un pieprasījums drīkst būt tik liels, cik tam vajag.

## Cilvēki, kuriem ir loma turnīrā {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Padara kādu par rezultātu ievadītāju vai pārvaldnieku. Pieņem `emailAddress`, viņa konta e-pasta adresi, un atbild ar `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Noņem rezultātu ievadītāju vai pārvaldnieku. Nepieņem pamattekstu un atbild ar `204`. `account` ir konta id daļa aiz `account/`.

## Sacensības {#competitions}

### Pievienot sacensības {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Pieņem `kind`, vienu no `block`, `swiss`, `knockout` vai `losers-knockout`, un `name`, tad to, kas ir tā veidam:

- Grupa pieņem `bestOf` un `rounds` (cik reižu katrs spēlē ar katru) un var pieņemt `tieBreak`.
- Šveices sistēma pieņem `bestOf`.
- Izslēgšanas turnīrs pieņem `places` un `rounds`, sarakstu ar labāko no cik katrā kārtā, un var pieņemt `losers`, zaudētāju izslēgšanas turnīru sarakstu, ko izveido kopā ar to, katram ar `name` un `round`.
- Zaudētāju izslēgšanas turnīrs pieņem `from`, sacensības, kuru zaudētājus tas ņem, un `round`, no kuras tos ņem.

Grupa, Šveices sistēma un izslēgšanas turnīrs var pieņemt arī to, kā tos spēlē un skaita: `handicap`, `drawsAllowed`, `worldRankings` un `advantage`, katrs `true` vai `false`, un `maximumHoops`, skaitli vai `null`, ja maksimuma nav. Sacensības, kas saka `advantage`, tiek noraidītas ar `Advantage.NotOffered`, kamēr vietne nepiedāvā Advantage Golf Croquet. Atbild ar `201` ar sacensību `id`.

### Pievienot testu {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Tests ir mačs starp divām komandām komandu turnīrā. Pieņem `firstTeam` un `secondTeam`, katrs ir komandas id aiz `team/`, `starts` un `finishes`, `expectedMatches`, `bestOf`, `group` un tos pašus noteikumus, ko var pieņemt sacensības. Atbild ar `201` ar tā `id`, kas ir sacensību id.

### Pārvietot, arhivēt vai atjaunot sacensības {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Pārvieto tās vienu vietu uz augšu vai uz leju turnīra sarakstā vai arhivē, vai atjauno. Nepieņem pamattekstu un atbild ar `204`. Ar šiem tāpat pārvieto, arhivē un atjauno testu.

## Sacensību spēlētāji {#competition-players}

### Pieteikt spēlētāju {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Pieteic sacensībām vienu no turnīra spēlētājiem. Pieņem `player`, turnīra spēlētāja id daļu aiz `tournament-player/`. Atbild ar `201` ar `id`, kas ir spēlētāja id sacensībās, nevis turnīrā.

### Pārvietot, izstāties, atgriezt vai noņemt spēlētāju {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Pārvieto spēlētāju vienu vietu uz augšu vai uz leju, liek viņam izstāties, atceļ viņa izstāšanos vai izņem viņu no sacensībām. `player` ir viņa id daļa sacensībās aiz `competition-player/`. Nepieņem pamattekstu un atbild ar `204`.

Katram bye sacensībās ir tas pats id, tāpēc bye atšķir pēc `order`, vesela skaitļa, ko adresei pievieno kā `?order=2`. Jebkas cits tiek noraidīts ar `Request.Invalid`.

## Sacensību partijas {#games}

### Pievienot partiju {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Pieņem `winner` un `loser`, katrs ir sacensību spēlētāja id daļa aiz `competition-player/`, un rezultātus. Testa spēlētāji nav tā paša, tāpēc testam katrs ir viss kāda tā komandas spēlētāja id, piemēram, `team-player/…`.

Rezultāti ir tādi, kādus sacensības tos uzskaita:

- `winnerScore` un `loserScore`, kā tie tika ievadīti, piemēram, `26` vai `26tp`.
- Sacensībām, ko spēlē kā Advantage Golf Croquet, to vietā `winnerHoops`, `winnerTarget`, `loserHoops` un `loserTarget`: vārtiņi, ko guvusi katra puse, un vārtiņi, uz kuriem tā spēlēja. `w` aiz viena no tiem, piemēram, `"3w"`, saka, ka šī puse uzvarēja, kur daļskaitļi ir vienādi.

Pieprasījums ar tāda veida rezultātu, kādu sacensības neuzskaita, tiek noraidīts ar `Game.AdvantageScoreTyped` vai `Game.HoopsAndTargetsNotAdvantage`. Atbild ar `201` ar partijas `id`.

### Labot partiju {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Pieņem rezultātus kā partijas pievienošana un, kur tie mainījušies, `winner` un `loser`. Spēlētājs, kas netiek nosūtīts, ir tas, kas partijā jau ir. `game` ir tās id daļa aiz `game/`. Atbild ar `204`.

### Pārvietot, arhivēt, atjaunot vai neieskaitīt partiju {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Pārvieto testa rezultātu vienu vietu uz augšu vai uz leju, arhivē partiju vai atjauno to, neieskaita to (tā ir spēlēta un neskaitās) vai atceļ tās neieskaitīšanu. Nepieņem pamattekstu un atbild ar `204`. Šos un abus augstāk drīkst rezultātu ievadītājs.

## Turnīra spēlētāji {#tournament-players}

### Pievienot spēlētāju {#add-tournament-player}

`POST /api/v0/tournaments/{id}/players`

Pievieno turnīram spēlētāju. Pieņem `name` un var pieņemt `representing`, `handicap`, `flag` un `worldRankingName`; kas ir izlaists vai tukšs, paliek nenorādīts. Atbild ar `201` ar spēlētāja `id`, kas ir viņa viss id, kā to norāda GET galapunkti. Spēlētājs bez vārda vai ar tāda spēlētāja vārdu, kas jau ir turnīrā, tiek noraidīts. Spēlētāju sacensībām [pieteic](#enter-player) ar šī `id` daļu aiz `tournament-player/`.

### Pārvietot, arhivēt vai atjaunot spēlētāju {#tournament-player-actions}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Pārvieto vienu no turnīra spēlētājiem vienu vietu uz augšu vai uz leju vai arhivē, vai atjauno viņu. `player` ir viņa id daļa aiz `tournament-player/`. Nepieņem pamattekstu un atbild ar `204`.

## Turnīra komandas {#teams}

### Pievienot komandu {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Pieņem `name` un `shortName` un var pieņemt `flag`. Atbild ar `201` ar komandas `id`.

### Pievienot komandai spēlētāju {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Pieņem `name` un var pieņemt `worldRankingName`. Atbild ar `201` ar spēlētāja `id`.

### Pārvietot, arhivēt vai atjaunot komandu {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Nepieņem pamattekstu un atbild ar `204`.

### Pārvietot, arhivēt vai atjaunot komandas spēlētāju {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

`player` ir viņa id daļa aiz `team-player/`. Nepieņem pamattekstu un atbild ar `204`.
