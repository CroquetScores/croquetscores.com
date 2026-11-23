# Hilfe für App-Entwickler

Croquet Scores hat eine öffentliche API, damit eine App die Turniere einer Sportart verfolgen kann, ohne die Seiten der Website zu lesen. Sie antwortet in JSON und ist während der Entwicklung unter `/api/v0` erreichbar. Wenn sie freigegeben wird, ist sie unter `/api/v1` erreichbar.

## Wo sie steht {#where-it-stands}

Die API ist in Entwicklung, deshalb heißt sie `v0`. Wenn alle Beteiligten sie angenommen haben, wird sie `v1`.

Eine Änderung, die eine App zerbricht, wird nie an einer bestehenden Version vorgenommen. Sie wird als neue Version neben der alten gemacht, sodass eine App, die für `v1` geschrieben wurde, weiterläuft, wenn `v2` erscheint. Was nicht als Bruch zählt, steht weiter unten, damit eine App darauf eingerichtet werden kann.

## Felder können hinzukommen {#fields-may-be-added}

Einer Antwort kann in Zukunft ein Feld hinzugefügt werden, ohne dass sich die Version ändert, denn eine App, die so geschrieben ist, dass sie ignoriert, was sie nicht kennt, geht daran nicht kaputt. Eine App muss deshalb jedes Feld ignorieren, das sie nicht kennt, und darf weder an einem solchen Feld noch an der Reihenfolge der Felder scheitern.

Was einer App zugesagt wurde, ändert sich nicht ohne neue Version: der Name eines Feldes, sein Typ und seine Bedeutung.

Der Wortlaut der `message` eines Fehlers kann jederzeit umformuliert werden. Eine App liest den `code` und nie die `message`.

## Sparsam fragen {#reading-cheaply}

Jede Antwort trägt ein `ETag`. Stellen Sie dieselbe Frage noch einmal und senden Sie es in `If-None-Match`, so lautet die Antwort `304` und sonst nichts, wenn sich nichts geändert hat. Ein Turnier und ein Wettbewerb tragen auch ein `Last-Modified`, mit dem `If-Modified-Since` gesendet werden kann. Eine Liste wird allein an ihrem `ETag` erkannt, denn eine Liste, die ein Turnier verloren hat, hat kein neueres Datum, das es anzeigen könnte.

Jedes Turnier in einer Liste trägt außerdem ein eigenes `etag`, gebildet aus dem, was es sagt. Eine App, der gesagt wird, dass sich eine Liste geändert hat, kann erkennen, welche Turniere darin sich geändert haben, ohne sie Feld für Feld zu vergleichen.

Eine Liste der Turniere eines Jahres nimmt `changedSince` an, geschrieben als `2026-03-01T10:00:00Z`, damit eine App, die ein Jahr erneut liest, nur nach dem fragt, was sich geändert hat. Eine Liste ist eine Seite mit höchstens 100 Einträgen und dem Weg zur nächsten und nimmt `page` und `pageSize` an.

Was jede Adresse antwortet, steht in den [GET-Endpunkten](get-endpoints.md), und was jede nimmt, die etwas ändert, steht in den [POST-Endpunkten](post-endpoints.md).

## Schlüssel {#keys}

Lesen ist für alle da: Eine Anfrage ohne Schlüssel wird beantwortet wie eine mit Schlüssel. Ein Schlüssel sagt, auf wessen Kontingent eine Anfrage angerechnet wird und was der Aufrufer über das Lesen hinaus darf.

Ein Schlüssel wird zum Lesen oder zum Lesen und Schreiben erstellt. Ein Schlüssel, der schreibt, darf in einem Turnier, was das Konto darf, für das er erstellt wurde, und das ist für einen Verantwortlichen mehr als für einen Ergebniserfasser (siehe [wer schreiben darf](post-endpoints.md#who-may-write)); außerdem kann ein Schlüssel auf ein Turnier beschränkt werden.

Erstellen Sie einen Schlüssel in Ihrem Konto unter **API-Schlüssel** mit **Schlüssel erstellen**. Senden Sie ihn mit jeder Anfrage als Bearer-Token:

```
Authorization: Bearer <the key>
```

Legen Sie einen Schlüssel nie in eine Adresse, die Browser, Proxys und Protokolle alle aufbewahren. Halten Sie einen Schlüssel so geheim wie ein Passwort. Ein Schlüssel, der nicht funktioniert, wird mit `401` abgewiesen, damit eine App, die glaubt, einen zu senden, erfährt, dass sie es nicht tut.

## Kontingente {#allowances}

Jede Anfrage zählt gegen ein Kontingent, eines pro Minute und eines pro Tag, was sie auch erfragt. Ein Schlüssel beginnt mit 60 pro Minute und 10.000 pro Tag, was eine Administratorin oder ein Administrator für einen Partner erhöhen kann. Eine Anfrage ohne Schlüssel oder mit einem Schlüssel, der nicht funktioniert, zählt gegen ihre Adresse, mit 10 pro Minute und 500 pro Tag.

Eine App, die ihr Kontingent aufgebraucht hat, bekommt die Antwort `429`, mit der Angabe, wie lange sie warten soll. Eine Anfrage, die mit `304` beantwortet wird, zählt wie jede andere.

## Fehler {#errors}

Jeder Fehler hat dieselbe Form:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

Auf den `code` verlässt sich eine App. Das `field` ist der Teil der Anfrage, der falsch war, sofern einer es war. Die `message` ist für den, der ein Protokoll liest.
