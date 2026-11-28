# Die API se GET-eindpunte

Hierdie adresse lees en verander niks nie; dié wat iets verander, staan in [die POST-eindpunte](post-endpoints.md). Elke adres hier is onder `/api/v1` op die webwerf, en elke antwoord is JSON. Wat vir almal geld, soos sleutels, kwotas, foute en hoe om goedkoop navraag te doen, staan in die [hulp vir toepassingontwikkelaars](index.md). Velde kan sonder 'n nuwe weergawe by enige antwoord gevoeg word (kyk [velde kan bygevoeg word](index.md#fields-may-be-added)), so ignoreer wat jy nie ken nie.

'n Toernooi, of 'n kompetisie, word in 'n adres genoem met die deel van sy id wat ná die skuinsstreep kom: vir `tournament/4f2a…` sê die adres `4f2a…`. Elke antwoord sê waar om te vind waarvan dit vertel in 'n `href`, en waar die webwerf dit wys in 'n `uri`, 'n pad wat met 'n skuinsstreep begin.

## 'n Jaar se toernooie {#tournaments}

`GET /api/v1/tournaments?year=2026`

Neem:

- `year`, nodig, 'n heelgetal soos `2026`.
- `sport`, 'n sportsoort se kode (kyk [die sportsoorte](#sports)), om net daardie sportsoort te lys. Sonder dit is 'n jaar van elke sportsoort een versoek.
- `changedSince`, 'n oomblik geskryf as `2026-03-01T10:00:00Z`, om net te lys wat daarna verander het.
- `page` en `pageSize`, waar 'n bladsy hoogstens 100 is.

Dit antwoord met `tournaments`, elk met:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (of `null`), `sport`
- `uri` en `href`
- `national` en `international`, of die organiseerder dit afgemerk het
- `changedAt`, wanneer daar laas iets van die toernooi of van een van sy kompetisies bewaar is
- `etag`, gemaak van wat die toernooi sê, sodat jy kan sien watter van 'n veranderde lys se toernooie verander het

en `total`, `page`, `pageSize` en `next`, wat sê waar die volgende bladsy is, of `null` by die laaste. Die id bly dieselfde hoe die toernooi ook al hernoem of verskuif word. Die lys word weer gevra met die `ETag` wat dit gestuur het, en met `304` beantwoord waar niks verander het nie.

## Een toernooi {#tournament}

`GET /api/v1/tournaments/{id}`

Sê wat die lys daarvan sê, en:

- `competitions`: elk met `id`, `name`, `kind` (`block`, `swiss`, `knockout` of `test`), `uri`, `href`, `changedAt` en `etag`.
- `players`, vir 'n toernooi wat deur spelers gespeel word: elk met `id`, `name`, `worldRankingName`, `handicap` as 'n getal (of `null`), `representing` (of `null`) en `etag`.
- `teams`, vir 'n toernooi wat deur spanne gespeel word, wat geen eie spelers het nie: elk met `id`, `name`, `shortName` en sy `players`, elk met `id`, `name` en `worldRankingName`.

'n Sleutel wat vir een toernooi gemaak is, lees dié een en geen ander nie, en word vir enige ander met `ApiKey.LimitedToAnotherTournament` geweier. Die antwoord is `304` waar die `ETag` of `Last-Modified` wat gestuur is, steeds geldig is.

## Wat 'n toernooi kan wees {#choices}

Drie lyste sê wat 'n toernooi kan wees op die webwerf wat gevra word: sy sportsoorte, sy formate en die lande waarin dit kan wees. Dit is wat die webwerf se eie vorm vir 'n nuwe toernooi bied, so 'n toernooi wat met 'n kode uit een van hulle gemaak word, word aanvaar deur [Maak 'n toernooi](post-endpoints.md#create-tournament). Hulle het geen sleutel nodig nie. Elkeen neem `language`, die kode van 'n taal soos `de`, om sy keuses in daardie taal te noem; 'n kode wat die webwerf nie bied nie, word geweier met `400`, en sy `code` sê watter lys dit geweier het: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` of `Countries.LanguageUnknown`. Sonder een word die sportsoorte en die lande in Engels genoem, en die formate in die taal wat die blaaier of die webwerf se koekie sê; gee dus 'n `language` waar die name gewys word. Elke antwoord dra 'n `ETag` en word met `304` beantwoord waar dit onveranderd is.

### Die sportsoorte {#sports}

`GET /api/v1/tournaments/sports`

Antwoord met `sports`, elk met `code` en `name`. Die `sport` wat 'n toernooi sê, en waarvoor 'n lys gevra kan word, is een van hierdie kodes. Croquet Scores bied `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) en `gb` (Gateball); Gateball Scores bied net Gateball. 'n Sportsoort kan in die toekoms bygevoeg word, soos 'n veld (kyk [velde kan bygevoeg word](index.md#fields-may-be-added)), so 'n toepassing moet 'n kode kan hanteer wat dit nie ken nie.

### Die formate {#formats}

`GET /api/v1/tournaments/formats`

Antwoord met `formats`, elk met `code`, die naam waarmee 'n toernooi gemaak word, `name`, `teams`, of dit deur spanne gespeel word, en `drawsLevelTests`, of 'n toernooi daarin 'n gelykopstoets trek tensy dit sê dat dit dit nie doen nie.

### Die lande {#countries}

`GET /api/v1/countries`

Antwoord met `countries`, elk met `code` (soos `au`), `name` en `regions`, elk met `code` en `name`. Hulle is in die volgorde van hul name in die taal wat gevra word. 'n Streek word genoem soos dit aangeteken is, meestal in sy eie land se taal. 'n Land wat nie verdeel is nie, het een streek, wat homself is.

## Een kompetisie {#competition}

`GET /api/v1/tournaments/{id}/competitions/{id}`

Sê die kompetisie se `name`, `kind`, `href`, `uri`, `changedAt`, en waar die API van sy spelle vertel (`games`) en, vir 'n blok en 'n Switserse kompetisie, wat die enigste is wat dit het, van sy stand (`standings`).

## Die stand van 'n blok of 'n Switserse kompetisie {#standings}

`GET /api/v1/tournaments/{id}/competitions/{id}/standings`

Sê die kompetisie, en `standings`: vir elke speler `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (of `null`) en `shared`, of die posisie gedeel word. 'n Blok voeg `lost`, `gamesWon` en `netGames` by, wat 'n Switserse kompetisie nie sê nie.

## 'n Kompetisie se spelle {#games}

`GET /api/v1/tournaments/{id}/competitions/{id}/games`

Sê die kompetisie en sy spelle. Elke spel het 'n `id`, 'n `winner` en 'n `loser`, `drawn`, `withdrawn` (gespeel maar tel vir niks), `round` (van 'n uitklopkompetisie, waar die eerste 1 is, en `null` elders) en `changedAt`. Elke kant sê die speler se `playerId`, hul `name` en hul `score` soos dit ingetik is, soos `26tp`. Waar 'n spel gelykop was, is dit net die volgorde waarin hulle ingetik is wat bepaal watter kant die wenner genoem word.

'n Toets, die wedstryd tussen twee spanne, sê `matches` en nie `games` nie: elke wedstryd met die twee `players`, een van elke span, en die `games` tussen hulle.

## Wat 'n sleutel mag doen {#permissions}

`GET /api/v1/tournaments/{id}/permissions`

Het 'n sleutel nodig en sê wat daardie sleutel in die toernooi mag doen: `part`, wat die rol is wat sy rekening het (`manager`, `scorer` of `neither`), `mayRead` en `mayWrite`. 'n Toepassing kan sê hoekom 'n skryfaksie geweier sou word voordat dit een stuur. Die antwoord is vir die sleutel wat gevra het, so dit word nooit bewaar nie (`Cache-Control: no-store`).

## Toernooie wat van jaar verander het {#changed-year}

`GET /api/v1/tournaments/changed-year`

Lys die toernooie wat in 'n ander jaar gekom het as dié waarin hulle was, sodat 'n toepassing kan skuif wat dit bewaar. Neem `changedSince`, `page` en `pageSize`. Elkeen het `tournamentId`, `previousYear` en `newYear`.

## Toernooie wat geargiveer is {#archived}

`GET /api/v1/tournaments/archived`

Lys die toernooie wat geargiveer is, sodat 'n toepassing kan ophou om hulle te wys. Neem `archivedSince`, geskryf as `2026-03-01T10:00:00Z`, `page` en `pageSize`. Elkeen het `tournamentId` en `archivedAt`.

## Wêreldranglysspelers {#world-ranking-players}

`GET /api/v1/ac/world-ranking-players` vir Association Croquet en `GET /api/v1/gc/world-ranking-players` vir Golf Croquet

Lys die spelers van daardie sportsoort wat die wêreldranglyste ken, in die volgorde van hul name. Die twee word eners gevra en beantwoord, behalwe waar dit hier anders sê. Elk neem `changedSince`, geskryf as `2026-03-01T10:00:00Z`, `page` en `pageSize`, waar 'n bladsy hoogstens 100 is. Antwoord met `worldRankingPlayers`, elk met:

- `id`, en `worldRankingId`, die nommer wat die ranglyste die speler gee
- `name`, soos die ranglyste hom noem
- `country`, waar die speler vandaan kom, as die webwerf se eie kode daarvoor, een van die kodes in [die lande](#countries). 'n Golf Croquet-speler het altyd een, en twee Golf Croquet-spelers kan dieselfde naam in verskillende lande hê. 'n Association Croquet-speler het een sodra die ranglyste se lys gelees is sedert dit bygevoeg is, en tot dan word dit weggelaat
- `games`, waar die API van die speler se spelle vertel (kyk ['n speler se spelle](#world-ranking-player-games))
- `archivedAt`, wanneer die speler geargiveer is, of `null`
- `changedAt`, en `etag`, saamgestel uit wat die speler sê

en `total`, `page`, `pageSize` en `next`, soos 'n jaar se toernooie dit het. Die lys word weer gevra met die `ETag` wat dit gestuur het, en met `304` beantwoord waar niks verander het nie. 'n Speler wat die ranglyste ophou lys, word steeds gelys, met `archivedAt`, sodat 'n toepassing wat hom gehou het, vertel kan word dat hy weg is. Die `id` is wat gehou moet word: die ranglyste kan 'n speler se nommer verander, en die `id` bly dieselfde speler s'n.

Sonder 'n `page` gevra, bring die lys eers die name op datum vanaf die wêreldranglyste se eie webwerf, hoogstens een keer per uur vir elke sportsoort. Vir 'n bladsy volgens nommer gevra, die eerste ingesluit, vertel dit net wat die webwerf gehou het, sodat 'n toepassing wat die bladsye volg nie die ranglyste se webwerf vir elkeen laat lees nie. Waar die ranglyste se webwerf nie gelees kan word nie, is die name dié van die laaste keer dat hulle op datum gebring is.

'n Versoek wat geweier word, word geweier met 'n `code` wat vir Association Croquet met `WorldRankingPlayers.` begin, soos `WorldRankingPlayers.PageNotWhole`, en vir Golf Croquet met `GolfCroquetWorldRankingPlayers.`, en 'n `field`.

## 'n Wêreldranglysspeler se spelle {#world-ranking-player-games}

`GET /api/v1/ac/world-ranking-players/{id}/games` en `GET /api/v1/gc/world-ranking-players/{id}/games`

Die `id` is die deel van die speler se `id` ná die skuinsstreep, soos `games` in die lys hierbo dit gee. Lys die spelle van daardie sportsoort wat die speler gespeel het, hetsy in 'n blok, 'n Switserse stelsel, 'n uitklopkompetisie of 'n toets, en hetsy hy vir homself of vir 'n span gespeel het. Neem `changedSince`, `page` en `pageSize` soos die lys van spelers, en antwoord met `games`, in die volgorde waarin hulle bygevoeg is, elk vanuit die speler se kant:

- `id`, `tournamentId` en `competitionId`
- `won`, of die speler gewen het, wat `false` is vir 'n gelykopuitslag, en `drawn`
- `score`, die speler s'n, en `opponentScore`, albei soos hulle ingetik is, soos `26tp`
- `opponentName`, soos die ranglyste hom noem waar die opponent 'n wêreldranglysspeler is en andersins soos die toernooi hom hou, en `opponentId`, die opponent se `id` in die lys hierbo, of `null` waar hy nie een is nie
- `archived` en `withdrawn`: 'n spel van 'n geargiveerde kompetisie of toernooi, of 'n geargiveerde of onttrokke een, word gelys en sê so, sodat 'n toepassing wat dit gehou het, kan ophou om dit te tel
- `addedAt`, of `null` vir 'n spel wat bygevoeg is voordat die webwerf onthou het wanneer, en `changedAt`
- `etag`

en `total`, `page`, `pageSize` en `next`. 'n Spel is die speler s'n wanneer hy 'n speler van 'n toernooi van daardie sportsoort is. Die webwerf vind watter wêreldranglysspeler 'n toernooispeler is aan die hand van die naam waarmee die ranglyste hom ken. Waar die ranglyste daardie naam aan twee spelers gee, soos die Golf Croquet-lys doen vir spelers in verskillende lande, onderskei dit hulle aan wie die toernooispeler verteenwoordig, waar dit een van hul lande is, en andersins aan die land waar die toernooi gespeel word. 'n Toernooispeler wat dit nie onderskei nie, is niemand s'n nie, en hul spelle ook nie, en 'n opponent wat dit nie onderskei nie, word sonder 'n `opponentId` genoem.

'n Speler wat die webwerf nie ken nie, word geweier met `404` en `WorldRankingPlayers.NotFound`, of `GolfCroquetWorldRankingPlayers.NotFound` vir Golf Croquet, wat nie dieselfde is as 'n speler sonder spelle nie, wat 'n leë lys het. 'n Versoek wat om sy bladsy geweier word, word geweier met 'n `code` wat met `WorldRankingPlayerGames.` begin, of `GolfCroquetWorldRankingPlayerGames.` vir Golf Croquet, en 'n `field`.
