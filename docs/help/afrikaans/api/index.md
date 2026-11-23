# Hulp vir toepassingontwikkelaars

Croquet Scores het 'n openbare API, sodat 'n toepassing 'n sportsoort se toernooie kan volg sonder om die webwerf se bladsye te lees. Dit antwoord in JSON en is tydens ontwikkeling by `/api/v0`. Wanneer dit vrygestel word, sal dit by `/api/v1` wees.

## Waar dit staan {#where-it-stands}

Die API is in ontwikkeling, en daarom is dit `v0`. Wanneer almal wat daarby betrokke is dit aanvaar het, word dit `v1`.

'n Verandering wat 'n toepassing breek, word nooit aan 'n bestaande weergawe self gemaak nie. Dit word as 'n nuwe weergawe langs die ou een gemaak, sodat 'n toepassing wat teen `v1` geskryf is, aanhou werk wanneer `v2` kom. Wat nie as breek tel nie, word hieronder gesê, sodat 'n toepassing daarvoor geskryf kan word.

## Velde kan bygevoeg word {#fields-may-be-added}

'n Veld kan in die toekoms by 'n antwoord gevoeg word sonder dat die weergawe verander, want 'n toepassing wat geskryf is om te ignoreer wat dit nie ken nie, breek nie daardeur nie. 'n Toepassing moet dus elke veld ignoreer wat dit nie ken nie, en mag nie misluk weens so 'n veld, of weens die volgorde waarin die velde kom nie.

Wat 'n toepassing vertel is, verander nie sonder 'n nuwe weergawe nie: 'n veld se naam, sy tipe en wat dit beteken.

Die woorde van 'n fout se `message` kan te eniger tyd anders gestel word. 'n Toepassing lees die `code` en nooit die `message` nie.

## Goedkoop navraag doen {#reading-cheaply}

Elke antwoord het 'n `ETag`. Vra dieselfde vraag weer met dié in `If-None-Match`, en die antwoord is `304` met niks anders nie as niks verander het nie. 'n Toernooi en 'n kompetisie het ook 'n `Last-Modified`, wat `If-Modified-Since` saam gestuur kan word. 'n Lys word net deur sy `ETag` beoordeel, want 'n lys wat 'n toernooi verloor het, het geen nuwer datum om dit mee te sê nie.

Elke toernooi in 'n lys het ook 'n eie `etag`, gemaak van wat dit sê. 'n Toepassing wat hoor dat 'n lys verander het, kan sien watter toernooie daarin verander het sonder om hulle veld vir veld te vergelyk.

'n Lys van 'n jaar se toernooie neem `changedSince`, geskryf as `2026-03-01T10:00:00Z`, sodat 'n toepassing wat 'n jaar weer lees, net vra na wat verander het. 'n Lys is 'n bladsy van hoogstens 100, met die pad na die volgende, en neem `page` en `pageSize`.

Wat elke adres antwoord, staan in [die GET-eindpunte](get-endpoints.md), en wat elkeen wat iets verander neem, staan in [die POST-eindpunte](post-endpoints.md).

## Sleutels {#keys}

Lees is vir enigeen: 'n versoek sonder sleutel word beantwoord soos een met 'n sleutel. 'n Sleutel sê wie se kwota 'n versoek teen getel word, en wat die vraer bo lees mag doen.

'n Sleutel word gemaak om te lees, of om te lees en te skryf. 'n Sleutel wat skryf, mag in 'n toernooi doen wat die rekening waarvoor dit gemaak is, mag doen, wat meer is vir 'n bestuurder as vir 'n teler (kyk [wie mag skryf](post-endpoints.md#who-may-write)), en 'n sleutel kan tot een toernooi beperk word.

Maak 'n sleutel in jou rekening, onder **API-sleutels**, met **Maak 'n sleutel**. Stuur dit by elke versoek as 'n draer-teken (bearer token):

```
Authorization: Bearer <the key>
```

Sit nooit 'n sleutel in 'n adres nie, want blaaiers, tussenganger-bedieners en logboeke hou almal adresse. Hou 'n sleutel net so geheim soos 'n wagwoord. 'n Sleutel wat nie werk nie, word met `401` geweier, sodat 'n toepassing wat dink dit stuur een, hoor dat dit nie so is nie.

## Kwotas {#allowances}

Elke versoek tel teen 'n kwota, een per minuut en een per dag, ongeag waarna dit vra. 'n Sleutel begin met 60 per minuut en 10 000 per dag, wat 'n administrateur vir een vennoot kan verhoog. 'n Versoek sonder sleutel, of met 'n sleutel wat nie werk nie, tel teen sy adres, met 10 per minuut en 500 per dag.

'n Toepassing wat sy kwota opgebruik het, kry die antwoord `429`, met hoe lank dit moet wag. 'n Versoek wat met `304` beantwoord word, tel soos enige ander.

## Foute {#errors}

Elke fout het dieselfde vorm:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

Die `code` is waarop 'n toepassing staatmaak. Die `field` is die deel van die versoek wat verkeerd was, waar een was. Die `message` is vir wie 'n logboek lees.
