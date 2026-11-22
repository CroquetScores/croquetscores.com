# Hjälp för apputvecklare

Croquet Scores har ett öppet API, så att en app kan följa en sports turneringar utan att läsa webbplatsens sidor. Det svarar med JSON och finns på `/api/v0` under utvecklingen. När det släpps finns det på `/api/v1`.

## Var det står {#where-it-stands}

API:et är under utveckling, och därför är det `v0`. När alla berörda har godtagit det blir det `v1`.

En ändring som bryter en app görs aldrig på en version som redan finns. Den görs som en ny version vid sidan av den gamla, så att en app som skrivits mot `v1` fortsätter fungera när `v2` kommer. Vad som inte räknas som ett brott sägs nedan, så att en app kan skrivas för att räkna med det.

## Fält kan läggas till {#fields-may-be-added}

Ett fält kan läggas till i ett svar i framtiden utan att versionen ändras, eftersom en app som är skriven för att strunta i det den inte känner till inte går sönder av det. En app måste därför strunta i varje fält den inte känner till, och får inte misslyckas på grund av ett sådant, eller på grund av i vilken ordning fälten kommer.

Det en app har fått veta ändras inte utan en ny version: ett fälts namn, dess typ och vad det betyder.

Orden i ett felmeddelande (`message`) kan formuleras om när som helst. En app läser `code` och aldrig `message`.

## Att fråga billigt {#reading-cheaply}

Varje svar har en `ETag`. Ställ samma fråga igen med den i `If-None-Match`, så blir svaret `304` utan något annat när inget har ändrats. En turnering och en tävling har också en `Last-Modified`, som `If-Modified-Since` kan skickas med. En lista avgörs av sin `ETag` ensam, eftersom en lista som har förlorat en turnering inte har något nyare datum att visa det med.

Varje turnering i en lista har också en egen `etag`, gjord av det den säger. En app som får veta att en lista har ändrats kan se vilka turneringar i den som ändrats utan att jämföra dem fält för fält.

En lista över ett års turneringar tar `changedSince`, skriven som `2026-03-01T10:00:00Z`, så att en app som läser ett år igen bara frågar efter det som ändrats. En lista är en sida med högst 100, med vägen till nästa, och tar `page` och `pageSize`.

Vad varje adress svarar står i [API:ets slutpunkter](endpoints.md).

## Nycklar {#keys}

Att läsa är öppet för alla: en förfrågan utan nyckel besvaras som en med nyckel. En nyckel säger vems kvot en förfrågan räknas mot, och vad den som frågar får göra utöver att läsa.

Skapa en nyckel i ditt konto, under **API-nycklar**, med **Skapa en nyckel**. Skicka den med varje förfrågan som en bärartoken (bearer token):

```
Authorization: Bearer <the key>
```

Lägg aldrig en nyckel i en adress, som webbläsare, mellanhänder och loggar alla sparar. Håll en nyckel lika hemlig som ett lösenord. En nyckel som inte fungerar avvisas med `401`, så att en app som tror att den skickar en får veta att den inte gör det.

## Kvoter {#allowances}

Varje förfrågan räknas mot en kvot, en per minut och en per dag, vad den än frågar efter. En nyckel börjar med 60 i minuten och 10 000 om dagen, vilket en administratör kan höja för en enskild partner. En förfrågan utan nyckel, eller med en nyckel som inte fungerar, räknas mot sin adress, med 10 i minuten och 500 om dagen.

En app som har använt upp sin kvot får svaret `429`, med hur länge den ska vänta. En förfrågan som besvaras med `304` räknas som vilken annan som helst.

## Fel {#errors}

Varje fel har samma form:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

`code` är det en app litar på. `field` är den del av förfrågan som var fel, när en var det. `message` är till för den som läser en logg.
