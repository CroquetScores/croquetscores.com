# Terfynbwyntiau'r API

Mae pob cyfeiriad yma o dan `/api/v0` ar y wefan, ac mae pob ateb yn JSON. Mae'r hyn sy'n wir am bob un, fel allweddi, lwfansau, gwallau a gofyn yn rhad, yn y [cymorth i ddatblygwyr apiau](index.md). Gellir ychwanegu meysydd at unrhyw ateb heb fersiwn newydd (gweler [gellir ychwanegu meysydd](index.md#fields-may-be-added)), felly anwybyddwch yr hyn nad ydych yn ei adnabod.

Enwir twrnamaint, neu gystadleuaeth, mewn cyfeiriad gan y rhan o'i id sy'n dod ar ôl y slaes: ar gyfer `tournament/4f2a…`, mae'r cyfeiriad yn dweud `4f2a…`. Mae pob ateb yn dweud mewn `href` ble i ddod o hyd i'r hyn y mae'n sôn amdano, ac mewn `uri` ble mae'r wefan yn ei ddangos, fel llwybr sy'n dechrau â slaes.

## Twrnameintiau blwyddyn {#tournaments}

`GET /api/v0/tournaments?year=2026`

Mae'n cymryd:

- `year`, angenrheidiol, cyfanrif fel `2026`.
- `sport`, cod camp (gweler [y campau](#sports)), i restru'r gamp honno yn unig. Hebddo, mae blwyddyn o bob camp yn un cais.
- `changedSince`, eiliad wedi'i hysgrifennu fel `2026-03-01T10:00:00Z`, i restru'r hyn a newidiodd ar ei hôl yn unig.
- `page` a `pageSize`, lle mae tudalen yn 100 ar y mwyaf.

Mae'n ateb gyda `tournaments`, pob un â:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (neu `null`), `sport`
- `uri` a `href`
- `national` a `international`, os ticiodd y trefnydd nhw
- `changedAt`, pryd y cadwyd rhywbeth ddiwethaf am y twrnamaint neu un o'i gystadlaethau
- `etag`, wedi'i wneud o'r hyn y mae'r twrnamaint yn ei ddweud, fel y gallwch weld pa dwrnameintiau mewn rhestr a newidiodd

a `total`, `page`, `pageSize` a `next`, sy'n dweud ble mae'r dudalen nesaf, neu `null` ar yr un olaf. Mae'r id yr un fath sut bynnag yr ailenwir y twrnamaint neu y'i symudir. Gofynnir am y rhestr eto gyda'r `ETag` a anfonodd, a'i hateb â `304` lle na newidiodd dim.

## Un twrnamaint {#tournament}

`GET /api/v0/tournaments/{id}`

Mae'n dweud yr hyn y mae'r rhestr yn ei ddweud amdano, a:

- `competitions`: pob un â `id`, `name`, `kind` (`block`, `swiss`, `knockout` neu `test`), `uri`, `href`, `changedAt` ac `etag`.
- `players`, ar gyfer twrnamaint a chwaraeir gan chwaraewyr: pob un ag `id`, `name`, `worldRankingName`, `handicap` fel rhif (neu `null`), `representing` (neu `null`) ac `etag`.
- `teams`, ar gyfer twrnamaint a chwaraeir gan dimau, sydd heb chwaraewyr ei hun: pob un ag `id`, `name`, `shortName` a'i `players`, pob un ag `id`, `name` a `worldRankingName`.

Mae allwedd a wnaed ar gyfer un twrnamaint yn darllen hwnnw ac nid unrhyw un arall, ac fe'i gwrthodir ar gyfer unrhyw un arall gydag `ApiKey.LimitedToAnotherTournament`. Yr ateb yw `304` lle mae'r `ETag` neu'r `Last-Modified` a anfonwyd yn gyfredol.

## Y campau {#sports}

Mae'r `sport` y mae twrnamaint yn ei ddweud, ac y gellir gofyn am restr ar ei gyfer, yn un o'r codau hyn:

| Cod   | Camp                |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

Gellir ychwanegu camp yn y dyfodol, fel maes (gweler [gellir ychwanegu meysydd](index.md#fields-may-be-added)), felly dylai ap ymdopi â chod nad yw'n ei adnabod.

## Un gystadleuaeth {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Mae'n dweud `name`, `kind`, `href`, `uri` a `changedAt` y gystadleuaeth, a ble mae'r API yn sôn am ei gemau (`games`) ac, ar gyfer bloc a Swistir, sef yr unig rai sydd â hi, am ei safleoedd (`standings`).

## Safleoedd bloc neu Swistir {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Mae'n dweud y gystadleuaeth, a `standings`: ar gyfer pob chwaraewr `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (neu `null`) a `shared`, a yw'r safle'n cael ei rannu. Mae bloc yn ychwanegu `lost`, `gamesWon` a `netGames`, nad yw Swistir yn eu dweud.

## Gemau cystadleuaeth {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Mae'n dweud y gystadleuaeth a'i gemau. Mae gan bob gêm `id`, `winner` a `loser`, `drawn`, `withdrawn` (chwaraewyd ond heb gyfrif am ddim), `round` (twrnamaint ag ymadael, lle mae'r gyntaf yn 1, a `null` mewn mannau eraill) a `changedAt`. Mae pob ochr yn dweud `playerId` y chwaraewr, ei `name` a'i `score` fel y'i teipiwyd, fel `26tp`. Lle daeth gêm i gyfartal, y drefn y'u teipiwyd yn unig sy'n penderfynu pa ochr a elwir yn enillydd.

Mae prawf, y gêm rhwng dau dîm, yn dweud `matches` ac nid `games`: pob gêm gyda'r ddau `players`, un o bob tîm, a'r `games` rhyngddynt.

## Beth y caiff allwedd ei wneud {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Mae angen allwedd, ac mae'n dweud beth y caiff yr allwedd honno ei wneud yn y twrnamaint: `part`, sef rôl ei chyfrif (`manager`, `scorer` neu `neither`), `mayRead` a `mayWrite`. Gall ap ddweud pam y byddai ysgrifennu'n cael ei wrthod cyn anfon un. Mae'r ateb ar gyfer yr allwedd a ofynnodd, felly ni chaiff byth ei gadw (`Cache-Control: no-store`).

## Twrnameintiau a newidiodd flwyddyn {#changed-year}

`GET /api/v0/tournaments/changed-year`

Mae'n rhestru'r twrnameintiau a ddaeth i flwyddyn wahanol i'r un yr oeddent ynddi, fel y gall ap symud yr hyn y mae'n ei gadw. Mae'n cymryd `changedSince`, `page` a `pageSize`. Mae gan bob un `tournamentId`, `previousYear` a `newYear`.

## Twrnameintiau a archifwyd {#archived}

`GET /api/v0/tournaments/archived`

Mae'n rhestru'r twrnameintiau a archifwyd, fel y gall ap roi'r gorau i'w dangos. Mae'n cymryd `archivedSince`, wedi'i ysgrifennu fel `2026-03-01T10:00:00Z`, `page` a `pageSize`. Mae gan bob un `tournamentId` ac `archivedAt`.
