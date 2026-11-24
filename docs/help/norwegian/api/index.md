# Hjelp for apputviklere

Croquet Scores har et åpent API, slik at en app kan følge en idretts turneringer uten å lese nettstedets sider. Det svarer med JSON og ligger på `/api/v1`.

## Hvor det står {#where-it-stands}

En endring som ødelegger en app, gjøres aldri i en versjon som finnes. Den gjøres som en ny versjon ved siden av den gamle, slik at en app skrevet mot `v1` fortsetter å virke når `v2` kommer. Det som ikke regnes som ødeleggende, sies nedenfor, slik at en app kan skrives for å regne med det.

## Felt kan legges til {#fields-may-be-added}

Et felt kan legges til i et svar i framtiden uten at versjonen endres, siden en app som er skrevet for å overse det den ikke kjenner, ikke går i stykker av det. En app må derfor overse hvert felt den ikke kjenner, og må ikke feile på grunn av et slikt felt, eller på grunn av rekkefølgen feltene kommer i.

Det en app har fått vite, endres ikke uten en ny versjon: et felts navn, typen og hva det betyr.

Ordene i en feils `message` kan omformuleres når som helst. En app leser `code` og aldri `message`.

## Å spørre billig {#reading-cheaply}

Hvert svar har en `ETag`. Still det samme spørsmålet igjen med den i `If-None-Match`, så blir svaret `304` uten noe annet når ingenting er endret. En turnering og en konkurranse har også en `Last-Modified`, som `If-Modified-Since` kan sendes med. En liste avgjøres av sin `ETag` alene, siden en liste som har mistet en turnering, ikke har noen nyere dato å si det med.

Hver turnering i en liste har også en egen `etag`, laget av det den sier. En app som får vite at en liste er endret, kan se hvilke turneringer i den som er endret uten å sammenligne dem felt for felt.

En liste over et års turneringer tar `changedSince`, skrevet som `2026-03-01T10:00:00Z`, slik at en app som leser et år på nytt, bare spør om det som er endret. En liste er en side på høyst 100, med veien til neste, og tar `page` og `pageSize`.

Hva hver adresse svarer, står i [GET-endepunktene](get-endpoints.md), og hva hver som endrer noe tar, står i [POST-endepunktene](post-endpoints.md).

## Nøkler {#keys}

Å lese er for alle: en forespørsel uten nøkkel besvares som en med nøkkel. En nøkkel sier hvem sin kvote en forespørsel telles mot, og hva den som spør får gjøre utover å lese.

En nøkkel lages for å lese, eller for å lese og skrive. En nøkkel som skriver, kan i en turnering gjøre det kontoen den ble laget for kan gjøre, og det er mer for en leder enn for en poengfører (se [hvem som kan skrive](post-endpoints.md#who-may-write)); en nøkkel kan også begrenses til én turnering.

Lag en nøkkel i kontoen din, under **API-nøkler**, med **Lag en nøkkel**. Send den med hver forespørsel som et bærertoken (bearer token):

```
Authorization: Bearer <the key>
```

Legg aldri en nøkkel i en adresse, som nettlesere, mellomtjenere og logger alle tar vare på. Hold en nøkkel like hemmelig som et passord. En nøkkel som ikke virker, avvises med `401`, slik at en app som tror den sender en, får vite at den ikke gjør det.

## Kvoter {#allowances}

Hver forespørsel telles mot en kvote, en per minutt og en per dag, uansett hva den spør om. En nøkkel begynner med 60 i minuttet og 10 000 i døgnet, noe en administrator kan øke for én partner. En forespørsel uten nøkkel, eller med en nøkkel som ikke virker, telles mot adressen sin, med 10 i minuttet og 500 i døgnet.

En app som har brukt opp kvoten sin, får svaret `429`, med hvor lenge den skal vente. En forespørsel som besvares med `304`, telles som alle andre.

## Feil {#errors}

Hver feil har samme form:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

`code` er det en app stoler på. `field` er den delen av forespørselen som var feil, der en var det. `message` er for den som leser en logg.
