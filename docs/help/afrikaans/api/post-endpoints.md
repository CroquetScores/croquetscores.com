# Die API se POST-eindpunte

**NOTA: Dit is 'n konsep. Daar is 'n paar eindpunte wat, soos ek weet, verwyder sal word.**

Hierdie adresse verander iets. Dié wat net lees, staan in [die GET-eindpunte](get-endpoints.md). Elke adres hier is onder `/api/v0` op die webwerf, en wat die webwerf se eie bladsye verander, word deur dieselfde adresse verander, so 'n toepassing het nie 'n kleiner stel as die webwerf nie. Wat vir almal geld, soos sleutels, kwotas en foute, staan in die [hulp vir toepassingontwikkelaars](index.md); wie mag skryf, staan [hieronder](#who-may-write).

'n Toernooi, 'n kompetisie en die res word in 'n adres genoem met die deel van hul id wat ná die skuinsstreep kom: vir `tournament/4f2a…` sê die adres `4f2a…`. 'n Liggaam noem 'n ander ding op dieselfde manier, soos `player` hieronder doen, behalwe waar dit sê dit is die hele id.

Stuur 'n liggaam as JSON, met `Content-Type: application/json`. 'n Veld wat uitgelaat is, is dieselfde as een wat leeg gelaat is, en word as sodanig geweier. Wat gestuur word wat hierdie bladsy nie noem nie, word geïgnoreer. 'n Antwoord dra `Cache-Control: no-store`.

## Wie mag skryf {#who-may-write}

'n Versoek wat iets verander, word gemaak deur 'n sleutel wat gemaak is om te skryf (kyk [sleutels](index.md#keys)), of deur 'n persoon wat by die webwerf aangemeld is. 'n Sleutel mag doen wat die rekening waarvoor dit gemaak is, mag doen, en niks meer nie:

- 'n Sleutel wat net gemaak is om te lees, word met `ApiKey.ReadOnly` geweier.
- 'n Sleutel wat vir een toernooi gemaak is, mag net daardie toernooi verander. Dit word vir 'n ander met `ApiKey.LimitedToAnotherTournament` geweier, en dit mag nie 'n toernooi maak nie, wat aan geeneen behoort nie.
- 'n Toernooi se bestuurders mag alles daarvan verander.
- 'n Toernooi se telers mag doen wat met tellings gedoen word, en niks anders nie: 'n spel byvoeg, dit korrigeer, skuif, argiveer, herstel, onttrek en die onttrekking omkeer. Enigiets anders van die toernooi word hulle met `Tournament.NotAManager` geweier.
- Enigiemand anders word met `Tournament.NotAManager` geweier, of met `Tournament.NotAManagerOrScorer` waar 'n teler toegelaat sou gewees het.

`GET /api/v0/tournaments/{id}/permissions` sê watter rol 'n sleutel in 'n toernooi het (kyk [wat 'n sleutel mag doen](get-endpoints.md#permissions)), sodat 'n toepassing kan sê hoekom 'n skryfaksie geweier sou word voordat dit een stuur.

## Wat 'n antwoord is {#answers}

'n Versoek wat iets maak, word met `201` beantwoord, met die nuwe ding se `id`, wat die hele id is, soos die GET-eindpunte dit sê. 'n Versoek wat iets verander wat daar is, word met `204` beantwoord, met niks in die liggaam nie. 'n Versoek wat geweier word, word beantwoord soos enige fout (kyk [foute](index.md#errors)): met sy `code`, waarop 'n toepassing staatmaak, en met die `field` waaroor dit gegaan het, waar daar een was.

Om 'n versoek twee keer te stuur, is nie dieselfde as een keer nie: 'n spel wat twee keer bygevoeg word, is twee spelle. 'n Toepassing wat nie gesê word of 'n versoek deurgekom het nie, moet lees wat dit verander het voordat dit weer stuur.

## Toernooie {#tournaments}

### Maak 'n toernooi {#create-tournament}

`POST /api/v0/tournaments`

Neem `name`, `starts` en `finishes` (geskryf as `2026-10-03T00:00:00Z`), `format`, `sport` ('n kode, kyk [die sportsoorte](get-endpoints.md#sports)), `country` ('n kode soos `au`), en, as dit verlang word, `region`, `subtitle`, `levelTestsDrawn`, `national` en `international`, waar elk van die laaste drie `true` of `false` is. Antwoord met `201` met `id` en `address`, wat is waar die webwerf dit wys.

### Argiveer, herstel of neem notabele status weg {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

`POST /api/v0/tournaments/{id}/remove-notable-status`

Neem geen liggaam nie, en antwoord met `204`. Om notabele status weg te neem, wat sê die toernooi is nóg 'n nasionale nóg 'n internasionale een, is 'n administrateur se taak.

### Vee 'n toetstoernooi uit {#delete-tournament}

`POST /api/v0/tournaments/{id}/delete`

'n Administrateur se taak, wat geoordeel het die toernooi is 'n toets. Neem `message`, wat aan die toernooi se bestuurders gesê word, en `archive`, `true` om die toernooi ook te argiveer. Antwoord met `204`.

### Voeg 'n bestuurdernota by {#notes}

`POST /api/v0/tournaments/{id}/notes`

Neem `title` en `description`. Antwoord met `201` met die nota se `id`. 'n Beskrywing mag tot 750 000 karakters wees, en die versoek mag so groot wees as wat dit neem.

## Die mense wat 'n rol in 'n toernooi het {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Maak iemand 'n teler, of 'n bestuurder. Neem `emailAddress`, die e-posadres van hul rekening, en antwoord met `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Neem 'n teler of 'n bestuurder af. Hulle neem geen liggaam nie en antwoord met `204`. Die `account` is die deel van die rekening se id wat ná `account/` kom.

## Kompetisies {#competitions}

### Voeg 'n kompetisie by {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Neem `kind`, een van `block`, `swiss`, `knockout` of `losers-knockout`, en 'n `name`, dan wat sy soort het:

- 'n Blok neem `bestOf` en `rounds` (hoeveel keer elkeen teen elkeen speel), en kan `tieBreak` neem.
- 'n Switserse kompetisie neem `bestOf`.
- 'n Uitklopkompetisie neem `places` en `rounds`, 'n lys met die beste-van vir elke ronde, en kan `losers` neem, 'n lys van verloorders-uitklopkompetisies wat saam daarmee gemaak word, elk met 'n `name` en 'n `round`.
- 'n Verloorders-uitklopkompetisie neem `from`, die kompetisie wie se verloorders dit neem, en die `round` waaruit dit hulle neem.

'n Blok, 'n Switserse kompetisie en 'n uitklopkompetisie kan ook neem hoe hulle gespeel en getel word: `handicap`, `drawsAllowed`, `worldRankings` en `advantage`, elk `true` of `false`, en `maximumHoops`, 'n getal, of `null` vir geen maksimum. 'n Kompetisie wat `advantage` sê, word met `Advantage.NotOffered` geweier solank die webwerf nie Advantage Golf Croquet aanbied nie. Antwoord met `201` met die kompetisie se `id`.

### Voeg 'n toets by {#add-test}

`POST /api/v0/tournaments/{id}/tests`

'n Toets is die wedstryd tussen twee spanne van 'n spantoernooi. Neem `firstTeam` en `secondTeam`, elk 'n span se id ná `team/`, `starts` en `finishes`, `expectedMatches`, `bestOf`, `group`, en dieselfde reëls as 'n kompetisie kan neem. Antwoord met `201` met sy `id`, wat 'n kompetisie s'n is.

### Skuif, argiveer of herstel 'n kompetisie {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Skuif dit een plek op of af in die toernooi se lys, of argiveer dit, of herstel dit. Hulle neem geen liggaam nie en antwoord met `204`. 'n Toets word hiermee ook geskuif, geargiveer en herstel.

## 'n Kompetisie se spelers {#competition-players}

### Skryf 'n speler in {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Skryf een van die toernooi se spelers in die kompetisie in. Neem `player`, die deel van die toernooispeler se id ná `tournament-player/`. Antwoord met `201` met `id`, wat die speler se id in die kompetisie is en nie die toernooi s'n nie.

### Skryf baie spelers in {#enter-players}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/many`

Neem `players`, 'n lys toernooispelers soos `player` hierbo, en `enterWhatCan`. Gewoonlik word almal ingeskryf of niemand nie. Waar sommige nie kan nie, sê die antwoord watter en skryf niemand in nie, sodat die bestuurder kan kies; stuur `enterWhatCan` as `true` om die res in te skryf. Antwoord met `201` met `ids`, in die volgorde waarin die spelers gegee is, en `refused`.

### Skuif, onttrek, bring terug of verwyder 'n speler {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Skuif 'n speler een plek op of af, onttrek hulle, keer hul onttrekking om, of neem hulle uit die kompetisie. Die `player` is die deel van hul id in die kompetisie wat ná `competition-player/` kom. Hulle neem geen liggaam nie en antwoord met `204`.

Elke bye in 'n kompetisie het dieselfde id, so 'n bye word onderskei deur `order`, 'n heelgetal wat as `?order=2` by die adres gevoeg word. Enigiets anders word met `Request.Invalid` geweier.

## 'n Kompetisie se spelle {#games}

### Voeg 'n spel by {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Neem die `winner` en die `loser`, elk die deel van 'n kompetisiespeler se id ná `competition-player/`, en die tellings. 'n Toets se spelers is nie sy eie nie, so vir 'n toets is elkeen die hele id van 'n speler in een van sy spanne, soos `team-player/…`.

Die tellings is soos die kompetisie dit hou:

- `winnerScore` en `loserScore`, soos hulle ingetik is, soos `26` of `26tp`.
- Vir 'n kompetisie wat as Advantage Golf Croquet gespeel word, in plaas daarvan, `winnerHoops`, `winnerTarget`, `loserHoops` en `loserTarget`: die hoepels wat elke kant gemaak het en die hoepels waarna dit gespeel het. 'n `w` ná een, soos `"3w"`, sê dat die kant gewen het waar die breuke gelyk is.

'n Versoek met die soort telling wat die kompetisie nie hou nie, word geweier, met `Game.AdvantageScoreTyped` of `Game.HoopsAndTargetsNotAdvantage`. Antwoord met `201` met die spel se `id`.

### Korrigeer 'n spel {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Neem die tellings soos om 'n spel by te voeg, en, waar hulle verander het, `winner` en `loser`. 'n Speler wat nie gestuur word nie, is die spel se eie. Die `game` is die deel van sy id ná `game/`. Antwoord met `204`.

### Skuif, argiveer, herstel of onttrek 'n spel {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Skuif 'n toets se telling een plek op of af, argiveer 'n spel of herstel dit, onttrek dit (dit is gespeel, en tel vir niks) of keer sy onttrekking om. Hulle neem geen liggaam nie en antwoord met `204`. Dit, en die twee hierbo, is wat 'n teler mag doen.

## 'n Toernooi se spelers {#tournament-players}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Skuif een van die toernooi se spelers een plek op of af, of argiveer of herstel hulle. Die `player` is die deel van hul id ná `tournament-player/`. Hulle neem geen liggaam nie en antwoord met `204`.

## 'n Toernooi se spanne {#teams}

### Voeg 'n span by {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Neem `name` en `shortName`, en kan `flag` neem. Antwoord met `201` met die span se `id`.

### Voeg 'n speler by 'n span {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Neem `name`, en kan `worldRankingName` neem. Antwoord met `201` met die speler se `id`.

### Skuif, argiveer of herstel 'n span {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Hulle neem geen liggaam nie en antwoord met `204`.

### Skuif, argiveer of herstel 'n span se speler {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

Die `player` is die deel van hul id ná `team-player/`. Hulle neem geen liggaam nie en antwoord met `204`.
