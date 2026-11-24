# Terfynbwyntiau GET yr API

Mae'r cyfeiriadau hyn yn darllen ac nid ydynt yn newid dim; mae'r rhai sy'n newid rhywbeth yn y [terfynbwyntiau POST](post-endpoints.md). Mae pob cyfeiriad yma o dan `/api/v0` ar y wefan, ac mae pob ateb yn JSON. Mae'r hyn sy'n wir am bob un, fel allweddi, lwfansau, gwallau a gofyn yn rhad, yn y [cymorth i ddatblygwyr apiau](index.md). Gellir ychwanegu meysydd at unrhyw ateb heb fersiwn newydd (gweler [gellir ychwanegu meysydd](index.md#fields-may-be-added)), felly anwybyddwch yr hyn nad ydych yn ei adnabod.

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

## Yr hyn y gall twrnamaint fod {#choices}

Mae tair rhestr yn dweud yr hyn y gall twrnamaint fod ar y wefan a ofynnir amdani: ei champau, ei fformatau a'r gwledydd y gall fod ynddynt. Dyma'r hyn y mae ffurflen y wefan ei hun ar gyfer twrnamaint newydd yn ei gynnig, felly mae twrnamaint a wneir â chod o un ohonynt yn cael ei dderbyn gan [wneud twrnamaint](post-endpoints.md#create-tournament). Nid oes angen allwedd arnynt. Mae pob un yn cymryd `language`, tag iaith fel `de`, i enwi ei dewisiadau yn yr iaith honno; gwrthodir tag nad yw'r wefan yn ei chynnig â `400`, ac mae ei `code` yn dweud pa restr a'i gwrthododd: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` neu `Countries.LanguageUnknown`. Hebddi, enwir y campau a'r gwledydd yn Saesneg, a'r fformatau yn yr iaith y mae'r porwr neu gwci'r wefan yn ei dweud; dywedwch `language` felly lle dangosir yr enwau. Mae pob ateb yn cario `ETag` ac fe'i hatebir â `304` lle nad yw wedi newid.

### Y campau {#sports}

`GET /api/v0/tournaments/sports`

Mae'n ateb gyda `sports`, pob un â `code` ac `name`. Mae'r `sport` y mae twrnamaint yn ei ddweud, ac y gellir gofyn am restr ar ei gyfer, yn un o'r codau hyn. Mae Croquet Scores yn cynnig `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) a `gb` (Gateball); mae Gateball Scores yn cynnig Gateball yn unig. Gellir ychwanegu camp yn y dyfodol, fel y gellir ychwanegu maes (gweler [gellir ychwanegu meysydd](index.md#fields-may-be-added)), felly dylai ap ymdopi â chod nad yw'n ei adnabod.

### Y fformatau {#formats}

`GET /api/v0/tournaments/formats`

Mae'n ateb gyda `formats`, pob un â `code`, yr enw y gwneir twrnamaint ag ef, `name`, `teams`, a yw'n cael ei chwarae gan dimau, a `drawsLevelTests`, a yw twrnamaint ynddo yn tynnu prawf cyfartal oni ddywed nad yw.

### Y gwledydd {#countries}

`GET /api/v0/countries`

Mae'n ateb gyda `countries`, pob un â `code` (fel `au`), `name` a `regions`, pob un â `code` ac `name`. Maent yn nhrefn eu henwau yn yr iaith y gofynnir amdani. Enwir rhanbarth fel y'i cofnodwyd, gan fwyaf yn iaith ei wlad ei hun. Mae gan wlad nad yw wedi'i rhannu un rhanbarth, sef hi ei hun.

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

## Chwaraewyr safleoedd y byd {#world-ranking-players}

`GET /api/v0/ac/world-ranking-players`

Mae'n rhestru'r chwaraewyr Association Croquet y mae safleoedd y byd yn eu hadnabod. Mae'n cymryd `changedSince`, wedi'i hysgrifennu fel `2026-03-01T10:00:00Z`, `page` a `pageSize`, lle mae tudalen yn 100 ar y mwyaf. Mae'n ateb gyda `worldRankingPlayers`, pob un â:

- `id`, a `worldRankingId`, y rhif y mae'r safleoedd yn ei roi i'r chwaraewr
- `name`, fel y mae'r safleoedd yn ei enwi
- `games`, lle mae'r API yn sôn am gemau'r chwaraewr (gweler [gemau chwaraewr](#world-ranking-player-games))
- `archivedAt`, pryd yr archifwyd y chwaraewr, neu `null`
- `changedAt`, ac `etag`, wedi'i wneud o'r hyn y mae'r chwaraewr yn ei ddweud

a `total`, `page`, `pageSize` a `next`, fel sydd gan dwrnameintiau blwyddyn. Gofynnir am y rhestr eto gyda'r `ETag` a anfonodd, a'i hatebir â `304` lle nad oes dim wedi newid. Gwrthodir cais a wrthodir â `code` sy'n dechrau â `WorldRankingPlayers.`, fel `WorldRankingPlayers.PageNotWhole`, a `field`.

## Gemau chwaraewr safleoedd y byd {#world-ranking-player-games}

`GET /api/v0/ac/world-ranking-players/{id}/games`

Y `id` yw'r rhan o `id` y chwaraewr sy'n dod ar ôl y slaes, fel y mae `games` yn y rhestr uchod yn ei rhoi. Mae'n rhestru'r gemau Association Croquet y mae'r chwaraewr wedi'u chwarae, boed mewn bloc, system Swisaidd, twrnamaint ag ymadael neu brawf, ac a chwaraeodd drosto'i hun neu dros dîm. Mae'n cymryd `changedSince`, `page` a `pageSize` fel y mae'r rhestr o chwaraewyr, ac yn ateb gyda `games`, yn y drefn yr ychwanegwyd hwy, pob un o ochr y chwaraewr:

- `id`, `tournamentId` a `competitionId`
- `won`, a enillodd y chwaraewr, sy'n `false` am gyfartal, a `drawn`
- `score`, un'r chwaraewr, ac `opponentScore`, y ddau fel y'u teipiwyd, fel `26tp`
- `opponentName`, fel y mae'r safleoedd yn ei enwi lle mae'r gwrthwynebydd yn chwaraewr safleoedd y byd ac fel arall fel y mae'r twrnamaint yn ei gadw, ac `opponentId`, `id` y gwrthwynebydd yn y rhestr uchod, neu `null` lle nad yw'n un
- `archived` a `withdrawn`: rhestrir gêm o gystadleuaeth neu dwrnamaint wedi'i archifo, neu gêm wedi'i harchifo neu ei thynnu'n ôl, ac mae'n dweud hynny, fel y gall ap a'i cadwodd roi'r gorau i'w chyfrif
- `addedAt`, neu `null` am gêm a ychwanegwyd cyn i'r wefan gofnodi pryd, a `changedAt`
- `etag`

a `total`, `page`, `pageSize` a `next`. Gwrthodir chwaraewr nad yw'r wefan yn ei adnabod â `404` a `WorldRankingPlayers.NotFound`, nad yw'r un peth â chwaraewr heb gemau, sydd â rhestr wag.
