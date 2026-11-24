# Terfynbwyntiau POST yr API

Mae'r cyfeiriadau hyn yn newid rhywbeth. Mae'r rhai sy'n darllen yn unig yn y [terfynbwyntiau GET](get-endpoints.md). Mae pob cyfeiriad yma o dan `/api/v0` ar y wefan, a'r hyn y mae tudalennau'r wefan ei hun yn ei newid, mae'r un cyfeiriadau hyn yn ei newid, felly nid oes gan ap set lai na'r wefan. Mae'r hyn sy'n wir am bob un, fel allweddi, lwfansau a gwallau, yn y [cymorth i ddatblygwyr apiau](index.md); mae pwy a gaiff ysgrifennu [isod](#who-may-write).

Enwir twrnamaint, cystadleuaeth a'r gweddill mewn cyfeiriad gan y rhan o'u id sy'n dod ar ôl y slaes: ar gyfer `tournament/4f2a…`, mae'r cyfeiriad yn dweud `4f2a…`. Mae corff yn enwi pethau eraill yn yr un modd, fel y mae `player` yn ei wneud isod, ac eithrio lle mae'n dweud mai'r id cyfan ydyw.

Anfonwch y corff fel JSON, gyda `Content-Type: application/json`. Mae maes a hepgorwyd yr un fath ag un gwag, ac fe'i gwrthodir felly. Anwybyddir yr hyn a anfonir nad yw'r dudalen hon yn ei enwi. Mae ateb yn cario `Cache-Control: no-store`.

## Pwy a gaiff ysgrifennu {#who-may-write}

Gwneir cais sy'n newid rhywbeth gan allwedd a wnaed i ysgrifennu (gweler [allweddi](index.md#keys)), neu gan berson sydd wedi mewngofnodi i'r wefan. Caiff allwedd wneud yr hyn y caiff y cyfrif y gwnaed hi ar ei gyfer ei wneud, a dim mwy:

- Gwrthodir allwedd a wnaed i ddarllen yn unig gydag `ApiKey.ReadOnly`.
- Caiff allwedd a wnaed ar gyfer un twrnamaint newid y twrnamaint hwnnw yn unig. Gwrthodir hi ar gyfer un arall gydag `ApiKey.LimitedToAnotherTournament`, ac ni chaiff greu twrnamaint, nad yw'n perthyn i'r un.
- Caiff rheolwyr twrnamaint newid popeth ynddo.
- Caiff sgorwyr twrnamaint wneud yr hyn a wneir â sgorau, a dim arall: ychwanegu gêm, ei chywiro, ei symud, ei harchifo, ei hadfer, ei thynnu'n ôl a dadwneud ei thynnu'n ôl. Gwrthodir popeth arall am y twrnamaint iddynt gyda `Tournament.NotAManager`.
- Gwrthodir unrhyw un arall gyda `Tournament.NotAManager`, neu gyda `Tournament.NotAManagerOrScorer` lle y byddai sgoriwr wedi cael ei dderbyn.

Mae `GET /api/v0/tournaments/{id}/permissions` yn dweud pa ran sydd gan allwedd mewn twrnamaint (gweler [beth y caiff allwedd ei wneud](get-endpoints.md#permissions)), fel y gall ap ddweud pam y byddai ysgrifennu'n cael ei wrthod cyn ei anfon.

## Beth yw ateb {#answers}

Atebir cais sy'n gwneud rhywbeth gyda `201` ac `id` y peth newydd, sef ei id cyfan, fel y mae'r terfynbwyntiau GET yn ei ddweud. Atebir cais sy'n newid rhywbeth sydd yno gyda `204`, heb ddim yn y corff. Atebir cais a wrthodir fel unrhyw wall (gweler [gwallau](index.md#errors)): gyda'i `code`, y mae ap yn dibynnu arno, a'r `field` yr oedd yn ymwneud ag ef, lle roedd un.

Nid yw anfon cais ddwywaith yr un fath ag anfon un waith: mae gêm a ychwanegir ddwywaith yn ddwy gêm. Dylai ap na ddywedwyd wrtho a aeth cais drwodd ddarllen yr hyn a newidiodd cyn ei anfon eto.

## Twrnameintiau {#tournaments}

### Gwneud twrnamaint {#create-tournament}

`POST /api/v0/tournaments`

Mae'n cymryd `name`, `starts` a `finishes` (wedi'u hysgrifennu fel `2026-10-03T00:00:00Z`), `format` (cod, gweler [y fformatau](get-endpoints.md#formats)), `sport` (cod, gweler [y campau](get-endpoints.md#sports)), `country` (cod fel `au`, gweler [y gwledydd](get-endpoints.md#countries)) ac, os dymunir, `region` (cod o'r wlad, o'r un rhestr), `subtitle`, `levelTestsDrawn`, `national` a `international`, pob un o'r tri olaf yn `true` neu `false`. Mae'n ateb `201` gydag `id` ac `address`, sef lle mae'r wefan yn ei ddangos.

### Archifo neu adfer twrnamaint {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

Nid ydynt yn cymryd corff ac maent yn ateb `204`.

### Ychwanegu nodyn rheolwr {#notes}

`POST /api/v0/tournaments/{id}/notes`

Mae'n cymryd `title` a `description`. Mae'n ateb `201` gydag `id` y nodyn. Caiff disgrifiad fod hyd at 750,000 o nodau, a chaiff y cais fod mor fawr ag y mae hynny'n ei ofyn.

## Y bobl sydd â rhan mewn twrnamaint {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Maent yn gwneud rhywun yn sgoriwr neu'n rheolwr. Maent yn cymryd `emailAddress`, cyfeiriad e-bost eu cyfrif, ac yn ateb `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Maent yn tynnu sgoriwr neu reolwr. Nid ydynt yn cymryd corff ac maent yn ateb `204`. Y `account` yw'r rhan o id y cyfrif sy'n dod ar ôl `account/`.

## Cystadlaethau {#competitions}

### Ychwanegu cystadleuaeth {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Mae'n cymryd `kind`, un o `block`, `swiss`, `knockout` neu `losers-knockout`, ac `name`, yna'r hyn sydd gan ei fath:

- Mae bloc yn cymryd `bestOf` a `rounds` (sawl gwaith y mae pob un yn chwarae yn erbyn pob un), a chaiff gymryd `tieBreak`.
- Mae Swisaidd yn cymryd `bestOf`.
- Mae cnoc-owt yn cymryd `places` a `rounds`, rhestr â'r gorau o sawl un ar gyfer pob rownd, a chaiff gymryd `losers`, rhestr o gnoc-owtiau'r collwyr i'w gwneud gydag ef, pob un ag `name` a `round`.
- Mae cnoc-owt y collwyr yn cymryd `from`, y gystadleuaeth y mae'n cymryd ei chollwyr, a'r `round` y mae'n eu cymryd ohoni.

Caiff bloc, Swisaidd a chnoc-owt gymryd hefyd sut y chwaraeir ac y cyfrifir hwy: `handicap`, `drawsAllowed`, `worldRankings` ac `advantage`, pob un yn `true` neu `false`, a `maximumHoops`, rhif, neu `null` am ddim uchafswm. Gwrthodir cystadleuaeth sy'n dweud `advantage` gydag `Advantage.NotOffered` tra nad yw'r wefan yn cynnig Advantage Golf Croquet. Mae'n ateb `201` gydag `id` y gystadleuaeth.

### Ychwanegu prawf {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Prawf yw'r gêm rhwng dau dîm mewn twrnamaint timau. Mae'n cymryd `firstTeam` a `secondTeam`, pob un yn id tîm ar ôl `team/`, `starts` a `finishes`, `expectedMatches`, `bestOf`, `group` a'r un rheolau ag y caiff cystadleuaeth eu cymryd. Mae'n ateb `201` gyda'i `id`, sef un cystadleuaeth.

### Symud, archifo neu adfer cystadleuaeth {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Maent yn ei symud i fyny neu i lawr un lle yn rhestr y twrnamaint, neu'n ei harchifo, neu'n ei hadfer. Nid ydynt yn cymryd corff ac maent yn ateb `204`. Mae prawf hefyd yn cael ei symud, ei archifo a'i adfer gan y rhain.

## Chwaraewyr cystadleuaeth {#competition-players}

### Rhoi chwaraewr i mewn {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Mae'n rhoi un o chwaraewyr y twrnamaint yn y gystadleuaeth. Mae'n cymryd `player`, y rhan o id chwaraewr y twrnamaint sy'n dod ar ôl `tournament-player/`. Mae'n ateb `201` gydag `id`, sef id y chwaraewr yn y gystadleuaeth ac nid yn y twrnamaint.

### Symud, tynnu'n ôl, dod â chwaraewr yn ôl neu ei dynnu {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Maent yn symud chwaraewr i fyny neu i lawr un lle, yn ei dynnu'n ôl, yn dadwneud ei dynnu'n ôl neu'n ei dynnu o'r gystadleuaeth. Y `player` yw'r rhan o'i id yn y gystadleuaeth sy'n dod ar ôl `competition-player/`. Nid ydynt yn cymryd corff ac maent yn ateb `204`.

Mae gan bob bye mewn cystadleuaeth yr un id, felly gwahaniaethir bye gan `order`, cyfanrif a ychwanegir at y cyfeiriad fel `?order=2`. Gwrthodir unrhyw beth arall gyda `Request.Invalid`.

## Gemau cystadleuaeth {#games}

### Ychwanegu gêm {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Mae'n cymryd y `winner` a'r `loser`, pob un yn rhan o id chwaraewr y gystadleuaeth sy'n dod ar ôl `competition-player/`, a'r sgorau. Nid yw chwaraewyr prawf yn eiddo iddo, felly ar gyfer prawf mae pob un yn id cyfan chwaraewr yn un o'i dimau, fel `team-player/…`.

Mae'r sgorau fel y mae'r gystadleuaeth yn eu cadw:

- `winnerScore` a `loserScore`, fel y'u teipiwyd, fel `26` neu `26tp`.
- Ar gyfer cystadleuaeth a chwaraeir fel Advantage Golf Croquet, yn eu lle, `winnerHoops`, `winnerTarget`, `loserHoops` a `loserTarget`: y cylchau a wnaeth pob ochr a'r cylchau yr oedd yn chwarae tuag atynt. Mae `w` ar ôl un, fel `"3w"`, yn dweud bod yr ochr honno wedi ennill lle mae'r ffracsiynau'n gyfartal.

Gwrthodir cais â'r math o sgôr nad yw'r gystadleuaeth yn ei gadw, gyda `Game.AdvantageScoreTyped` neu `Game.HoopsAndTargetsNotAdvantage`. Mae'n ateb `201` gydag `id` y gêm.

### Cywiro gêm {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Mae'n cymryd y sgorau fel wrth ychwanegu gêm, a, lle maent wedi newid, `winner` a `loser`. Chwaraewr nas anfonir yw'r un sydd gan y gêm eisoes. Y `game` yw'r rhan o'i id sy'n dod ar ôl `game/`. Mae'n ateb `204`.

### Symud, archifo, adfer neu dynnu gêm yn ôl {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Maent yn symud sgôr prawf i fyny neu i lawr un lle, yn archifo gêm neu'n ei hadfer, yn ei thynnu'n ôl (chwaraewyd hi, ac nid yw'n cyfrif) neu'n dadwneud ei thynnu'n ôl. Nid ydynt yn cymryd corff ac maent yn ateb `204`. Y rhain, a'r ddau uchod, yw'r hyn y caiff sgoriwr ei wneud.

## Chwaraewyr twrnamaint {#tournament-players}

### Ychwanegu chwaraewr {#add-tournament-player}

`POST /api/v0/tournaments/{id}/players`

Mae'n ychwanegu chwaraewr at y twrnamaint. Mae'n cymryd `name`, a chaiff gymryd `representing`, `handicap`, `flag` a `worldRankingName`; mae'r hyn a adewir allan neu sy'n wag yn aros heb ei ddweud. Mae'n ateb `201` gydag `id` y chwaraewr, sef ei id cyfan, fel y mae'r terfynbwyntiau GET yn ei ddweud. Gwrthodir chwaraewr heb enw, neu ag enw un sydd yno eisoes. Mae chwaraewr yn cael ei [roi](#enter-player) mewn cystadleuaeth gyda'r rhan o'r `id` hwn sy'n dod ar ôl `tournament-player/`.

### Symud, archifo neu adfer chwaraewr {#tournament-player-actions}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Maent yn symud un o chwaraewyr y twrnamaint i fyny neu i lawr un lle, neu'n ei archifo neu'n ei adfer. Y `player` yw'r rhan o'i id sy'n dod ar ôl `tournament-player/`. Nid ydynt yn cymryd corff ac maent yn ateb `204`.

## Timau twrnamaint {#teams}

### Ychwanegu tîm {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Mae'n cymryd `name` a `shortName`, a chaiff gymryd `flag`. Mae'n ateb `201` gydag `id` y tîm.

### Ychwanegu chwaraewr at dîm {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Mae'n cymryd `name`, a chaiff gymryd `worldRankingName`. Mae'n ateb `201` gydag `id` y chwaraewr.

### Symud, archifo neu adfer tîm {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Nid ydynt yn cymryd corff ac maent yn ateb `204`.

### Symud, archifo neu adfer chwaraewr tîm {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

Y `player` yw'r rhan o'i id sy'n dod ar ôl `team-player/`. Nid ydynt yn cymryd corff ac maent yn ateb `204`.
