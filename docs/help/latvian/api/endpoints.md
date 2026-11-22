# API galapunkti

Katra adrese šeit atrodas zem `/api/v0` vietnē, un katra atbilde ir JSON. Kas attiecas uz visām, piemēram, atslēgas, limiti, kļūdas un lēta pieprasīšana, ir rakstīts [palīdzībā lietotņu izstrādātājiem](index.md). Jebkurai atbildei var tikt pievienoti lauki bez jaunas versijas (skatiet [lauki var tikt pievienoti](index.md#fields-may-be-added)), tāpēc ignorējiet to, ko nepazīstat.

Turnīrs vai sacensību grupa adresē tiek nosaukta ar to sava id daļu, kas ir aiz slīpsvītras: `tournament/4f2a…` adresē ir `4f2a…`. Katra atbilde laukā `href` pasaka, kur atrast to, par ko tā stāsta, un laukā `uri`, kur to rāda vietne, kā ceļu, kas sākas ar slīpsvītru.

## Viena gada turnīri {#tournaments}

`GET /api/v0/tournaments?year=2026`

Pieņem:

- `year`, obligāts, vesels skaitlis, piemēram, `2026`.
- `sport`, sporta veida kods (skatiet [sporta veidus](#sports)), lai uzskaitītu tikai to. Bez tā viena gada visu sporta veidu turnīri ir viens pieprasījums.
- `changedSince`, laika brīdis, rakstīts kā `2026-03-01T10:00:00Z`, lai uzskaitītu tikai to, kas mainījies pēc tā.
- `page` un `pageSize`, kur lapā ir ne vairāk kā 100 ieraksti.

Atbild ar `tournaments`, katrs ar:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (vai `null`), `sport`
- `uri` un `href`
- `national` un `international`, vai organizators tos atzīmējis
- `changedAt`, kad pēdējo reizi kaut kas tika saglabāts par turnīru vai kādu no tā sacensībām
- `etag`, veidots no tā, ko turnīrs saka, lai varētu redzēt, kuri mainīta saraksta turnīri ir mainījušies

un `total`, `page`, `pageSize` un `next`, kas norāda, kur ir nākamā lapa, vai `null` pēdējā. Id paliek tas pats, lai arī kā turnīrs tiktu pārdēvēts vai pārcelts. Sarakstu pieprasa vēlreiz ar `ETag`, ko tas nosūtīja, un atbild ar `304`, ja nekas nav mainījies.

## Viens turnīrs {#tournament}

`GET /api/v0/tournaments/{id}`

Saka to, ko saraksts saka par to, un:

- `competitions`: katra ar `id`, `name`, `kind` (`block`, `swiss`, `knockout` vai `test`), `uri`, `href`, `changedAt` un `etag`.
- `players`, turnīram, ko spēlē atsevišķi spēlētāji: katrs ar `id`, `name`, `worldRankingName`, `handicap` kā skaitli (vai `null`), `representing` (vai `null`) un `etag`.
- `teams`, turnīram, ko spēlē komandas un kuram nav savu spēlētāju: katra ar `id`, `name`, `shortName` un savus `players`, katrs ar `id`, `name` un `worldRankingName`.

Atslēga, kas izveidota vienam turnīram, lasa to un nevienu citu, un jebkuram citam tiek noraidīta ar `ApiKey.LimitedToAnotherTournament`. Atbilde ir `304`, ja nosūtītais `ETag` vai `Last-Modified` ir aktuāls.

## Sporta veidi {#sports}

`sport`, ko turnīrs min un kuram var pieprasīt sarakstu, ir viens no šiem kodiem:

| Kods  | Sporta veids        |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

Sporta veids nākotnē var tikt pievienots, tāpat kā lauks (skatiet [lauki var tikt pievienoti](index.md#fields-may-be-added)), tāpēc lietotnei jāprot tikt galā ar kodu, ko tā nepazīst.

## Viena sacensību grupa {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Saka sacensību `name`, `kind`, `href`, `uri` un `changedAt`, un kur API stāsta par tās partijām (`games`) un, grupai un Šveices sistēmai, kurām vienīgajām tas ir, par tās kārtību (`standings`).

## Grupas vai Šveices sistēmas kārtība {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Saka sacensības un `standings`: katram spēlētājam `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (vai `null`) un `shared`, vai vieta ir dalīta. Grupa pievieno `lost`, `gamesWon` un `netGames`, ko Šveices sistēma nesaka.

## Sacensību partijas {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Saka sacensības un to partijas. Katrai partijai ir `id`, `winner` un `loser`, `drawn`, `withdrawn` (nospēlēta, bet neskaitās), `round` (izslēgšanas turnīra, kur pirmā ir 1, un `null` citur) un `changedAt`. Katra puse saka spēlētāja `playerId`, viņa `name` un `score`, kā tas tika ievadīts, piemēram, `26tp`. Ja partija bija neizšķirta, tikai ievadīšanas secība nosaka, kuru pusi sauc par uzvarētāju.

Tests, divu komandu mačs, saka `matches`, nevis `games`: katrs mačs ar diviem `players`, pa vienam no katras komandas, un to `games`.

## Ko atslēga drīkst darīt {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Prasa atslēgu un saka, ko šī atslēga drīkst turnīrā: `part`, kas ir tās konta loma (`manager`, `scorer` vai `neither`), `mayRead` un `mayWrite`. Lietotne tā var pateikt, kāpēc rakstīšana tiktu noraidīta, pirms tā to nosūta. Atbilde ir domāta atslēgai, kas jautāja, tāpēc to nekad neglabā (`Cache-Control: no-store`).

## Turnīri, kas mainījuši gadu {#changed-year}

`GET /api/v0/tournaments/changed-year`

Uzskaita turnīrus, kas nonākuši citā gadā, nekā tajā, kurā tie bija, lai lietotne varētu pārvietot to, ko tā glabā. Pieņem `changedSince`, `page` un `pageSize`. Katram ir `tournamentId`, `previousYear` un `newYear`.

## Arhivētie turnīri {#archived}

`GET /api/v0/tournaments/archived`

Uzskaita turnīrus, kas ir arhivēti, lai lietotne varētu beigt tos rādīt. Pieņem `archivedSince`, rakstītu kā `2026-03-01T10:00:00Z`, `page` un `pageSize`. Katram ir `tournamentId` un `archivedAt`.
