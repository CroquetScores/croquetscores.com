# Cymorth i ddatblygwyr apiau

Mae gan Croquet Scores API cyhoeddus, fel y gall ap ddilyn twrnameintiau camp heb ddarllen tudalennau'r wefan. Mae'n ateb mewn JSON, ac mae yn `/api/v1`.

## Ble mae arni {#where-it-stands}

Ni wneir newid sy'n torri ap byth ar fersiwn sy'n bodoli eisoes. Fe'i gwneir fel fersiwn newydd wrth ochr yr hen un, fel bod ap a ysgrifennwyd ar gyfer `v1` yn dal i weithio pan ddaw `v2`. Dywedir isod beth nad yw'n cyfrif fel torri, fel y gellir ysgrifennu ap i ddisgwyl hynny.

## Gellir ychwanegu meysydd {#fields-may-be-added}

Gellir ychwanegu maes at ateb yn y dyfodol heb newid y fersiwn, gan nad yw ap sydd wedi'i ysgrifennu i anwybyddu'r hyn nad yw'n ei adnabod yn torri o'i herwydd. Felly rhaid i ap anwybyddu pob maes nad yw'n ei adnabod, ac ni all fethu oherwydd maes o'r fath, nac oherwydd y drefn y daw'r meysydd ynddi.

Nid yw'r hyn a ddywedwyd wrth ap yn newid heb fersiwn newydd: enw maes, ei fath a'r hyn y mae'n ei olygu.

Gellir ailfynegi geiriau `message` gwall ar unrhyw adeg. Mae ap yn darllen y `code` a byth y `message`.

## Gofyn yn rhad {#reading-cheaply}

Mae pob ateb yn cario `ETag`. Gofynnwch yr un cwestiwn eto gan ei anfon yn `If-None-Match`, a'r ateb yw `304` heb ddim arall pan na newidiodd dim. Mae twrnamaint a chystadleuaeth hefyd yn cario `Last-Modified`, y gellir anfon `If-Modified-Since` ag ef. Dim ond wrth ei `ETag` y penderfynir ar restr, gan nad oes gan restr sydd wedi colli twrnamaint ddyddiad mwy diweddar i'w ddweud.

Mae pob twrnamaint mewn rhestr hefyd yn cario `etag` ei hun, wedi'i wneud o'r hyn y mae'n ei ddweud. Gall ap yr hysbysir ef fod rhestr wedi newid weld pa dwrnameintiau ynddi a newidiodd heb eu cymharu maes wrth faes.

Mae rhestr o dwrnameintiau blwyddyn yn cymryd `changedSince`, wedi'i ysgrifennu fel `2026-03-01T10:00:00Z`, fel y gall ap sy'n ailddarllen blwyddyn ofyn am yr hyn a newidiodd yn unig. Tudalen o 100 ar y mwyaf yw rhestr, gyda'r ffordd i'r nesaf, ac mae'n cymryd `page` a `pageSize`.

Mae'r hyn y mae pob cyfeiriad yn ei ateb yn y [terfynbwyntiau GET](get-endpoints.md), ac mae'r hyn y mae pob un sy'n newid rhywbeth yn ei gymryd yn y [terfynbwyntiau POST](post-endpoints.md).

## Allweddi {#keys}

Mae darllen i bawb: atebir cais heb allwedd fel un ag allwedd. Mae allwedd yn dweud pa lwfans y cyfrifir cais yn ei erbyn, a beth y caiff yr un sy'n galw ei wneud y tu hwnt i ddarllen.

Gwneir allwedd i ddarllen, neu i ddarllen ac ysgrifennu. Caiff allwedd sy'n ysgrifennu wneud mewn twrnamaint yr hyn y caiff y cyfrif y gwnaed hi ar ei gyfer ei wneud, sy'n fwy i reolwr nag i sgoriwr (gweler [pwy a gaiff ysgrifennu](post-endpoints.md#who-may-write)), a gellir cyfyngu allwedd i un twrnamaint.

Gwnewch allwedd yn eich cyfrif, o dan **Allweddi API**, gyda **Gwneud allwedd**. Anfonwch hi gyda phob cais fel tocyn cludydd (bearer token):

```
Authorization: Bearer <the key>
```

Peidiwch byth â rhoi allwedd mewn cyfeiriad, y mae porwyr, dirprwyon a logiau i gyd yn eu cadw. Cadwch allwedd mor gyfrinachol â chyfrinair. Gwrthodir allwedd nad yw'n gweithio gyda `401`, fel y caiff ap sy'n credu ei fod yn anfon un wybod nad yw'n gwneud hynny.

## Lwfansau {#allowances}

Mae pob cais yn cyfrif yn erbyn lwfans, un y funud ac un y dydd, beth bynnag y mae'n gofyn amdano. Mae allwedd yn dechrau gyda 60 y funud a 10,000 y dydd, y gall gweinyddwr ei godi i un partner. Mae cais heb allwedd, neu ag allwedd nad yw'n gweithio, yn cyfrif yn erbyn ei gyfeiriad, gyda 10 y funud a 500 y dydd.

Rhoddir yr ateb `429` i ap sydd wedi defnyddio ei lwfans, gyda faint o amser y dylai aros. Mae cais a atebir â `304` yn cyfrif fel unrhyw un arall.

## Gwallau {#errors}

Mae gan bob gwall yr un ffurf:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

Y `code` yw'r hyn y mae ap yn dibynnu arno. Y `field` yw'r rhan o'r cais a oedd yn anghywir, lle'r oedd un. Mae'r `message` ar gyfer pwy bynnag sy'n darllen log.
