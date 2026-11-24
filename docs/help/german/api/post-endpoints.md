# Die POST-Endpunkte der API

Diese Adressen ändern etwas. Die, die nur lesen, stehen in den [GET-Endpunkten](get-endpoints.md). Jede Adresse hier liegt unter `/api/v0` der Website, und was die eigenen Seiten der Website ändern, ändern dieselben Adressen, sodass eine App keinen kleineren Satz hat als die Website. Was für alle gilt, wie Schlüssel, Kontingente und Fehler, steht in der [Hilfe für App-Entwickler](index.md); wer schreiben darf, steht [weiter unten](#who-may-write).

Ein Turnier, ein Wettbewerb und das Übrige werden in einer Adresse mit dem Teil ihrer ID nach dem Schrägstrich benannt: Für `tournament/4f2a…` steht in der Adresse `4f2a…`. Ein Body benennt andere Dinge ebenso, wie es `player` unten tut, außer wo es heißt, es sei die ganze ID.

Senden Sie den Body als JSON mit `Content-Type: application/json`. Ein weggelassenes Feld ist dasselbe wie ein leeres und wird als solches abgelehnt. Was gesendet wird und auf dieser Seite nicht genannt ist, wird ignoriert. Eine Antwort trägt `Cache-Control: no-store`.

## Wer schreiben darf {#who-may-write}

Eine Anfrage, die etwas ändert, kommt von einem Schlüssel, der zum Schreiben erstellt wurde (siehe [Schlüssel](index.md#keys)), oder von einer Person, die auf der Website angemeldet ist. Ein Schlüssel darf, was das Konto darf, für das er erstellt wurde, und nicht mehr:

- Ein Schlüssel, der nur zum Lesen erstellt wurde, wird mit `ApiKey.ReadOnly` abgelehnt.
- Ein Schlüssel, der für ein Turnier erstellt wurde, darf nur dieses Turnier ändern. Für ein anderes wird er mit `ApiKey.LimitedToAnotherTournament` abgelehnt, und er darf kein Turnier anlegen, das zu keinem gehört.
- Die Verantwortlichen eines Turniers dürfen alles daran ändern.
- Die Ergebniserfasser eines Turniers dürfen tun, was mit Ergebnissen getan wird, und sonst nichts: ein Spiel hinzufügen, korrigieren, verschieben, archivieren, wiederherstellen, zurückziehen und den Rückzug aufheben. Alles andere am Turnier wird ihnen mit `Tournament.NotAManager` verweigert.
- Alle anderen werden mit `Tournament.NotAManager` abgelehnt, oder mit `Tournament.NotAManagerOrScorer`, wo ein Ergebniserfasser zugelassen gewesen wäre.

`GET /api/v0/tournaments/{id}/permissions` sagt, welche Rolle ein Schlüssel in einem Turnier hat (siehe [was ein Schlüssel darf](get-endpoints.md#permissions)), damit eine App sagen kann, warum ein Schreibzugriff abgelehnt würde, bevor sie ihn sendet.

## Was eine Antwort ist {#answers}

Eine Anfrage, die etwas anlegt, wird mit `201` und der `id` der neuen Sache beantwortet, die ihre ganze ID ist, wie die GET-Endpunkte sie nennen. Eine Anfrage, die etwas Vorhandenes ändert, wird mit `204` beantwortet, ohne Inhalt im Body. Eine abgelehnte Anfrage wird beantwortet wie jeder Fehler (siehe [Fehler](index.md#errors)): mit ihrem `code`, auf den sich eine App verlässt, und mit dem `field`, um das es ging, wo es eines gab.

Eine Anfrage zweimal zu senden ist nicht dasselbe wie einmal: Ein zweimal hinzugefügtes Spiel sind zwei Spiele. Eine App, der nicht gesagt wird, ob eine Anfrage durchkam, sollte lesen, was sie geändert hat, bevor sie sie erneut sendet.

## Turniere {#tournaments}

### Ein Turnier anlegen {#create-tournament}

`POST /api/v0/tournaments`

Nimmt `name`, `starts` und `finishes` (geschrieben als `2026-10-03T00:00:00Z`), `format` (ein Code, siehe [die Formate](get-endpoints.md#formats)), `sport` (ein Code, siehe [die Sportarten](get-endpoints.md#sports)), `country` (ein Code wie `au`, siehe [die Länder](get-endpoints.md#countries)) und, falls gewünscht, `region` (ein Code des Landes, aus derselben Liste), `subtitle`, `levelTestsDrawn`, `national` und `international`, wobei jedes der letzten drei `true` oder `false` ist. Antwortet mit `201` mit `id` und `address`, also dem Ort, an dem die Website es zeigt.

### Ein Turnier archivieren oder wiederherstellen {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

Nehmen keinen Body und antworten mit `204`.

### Eine Notiz für Verantwortliche hinzufügen {#notes}

`POST /api/v0/tournaments/{id}/notes`

Nimmt `title` und `description`. Antwortet mit `201` mit der `id` der Notiz. Eine Beschreibung darf bis zu 750.000 Zeichen lang sein, und die Anfrage darf so groß sein, wie das erfordert.

## Die Personen mit einer Rolle in einem Turnier {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Machen jemanden zum Ergebniserfasser oder zum Verantwortlichen. Nehmen `emailAddress`, die E-Mail-Adresse seines Kontos, und antworten mit `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Nehmen einen Ergebniserfasser oder einen Verantwortlichen wieder heraus. Sie nehmen keinen Body und antworten mit `204`. Das `account` ist der Teil der ID des Kontos nach `account/`.

## Wettbewerbe {#competitions}

### Einen Wettbewerb hinzufügen {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Nimmt `kind`, eines von `block`, `swiss`, `knockout` oder `losers-knockout`, und einen `name`, dann das, was seine Art hat:

- Ein Block nimmt `bestOf` und `rounds` (wie oft jeder gegen jeden spielt) und kann `tieBreak` nehmen.
- Ein Schweizer System nimmt `bestOf`.
- Ein K.-o.-System nimmt `places` und `rounds`, eine Liste mit dem Best-of für jede Runde, und kann `losers` nehmen, eine Liste von Verlierer-K.-o.-Systemen, die mit ihm angelegt werden, jedes mit einem `name` und einer `round`.
- Ein Verlierer-K.-o.-System nimmt `from`, den Wettbewerb, dessen Verlierer es nimmt, und die `round`, aus der es sie nimmt.

Ein Block, ein Schweizer System und ein K.-o.-System können auch nehmen, wie sie gespielt und gezählt werden: `handicap`, `drawsAllowed`, `worldRankings` und `advantage`, jedes `true` oder `false`, und `maximumHoops`, eine Zahl, oder `null` für kein Höchstmaß. Ein Wettbewerb, der `advantage` sagt, wird mit `Advantage.NotOffered` abgelehnt, solange die Website Advantage Golf Croquet nicht anbietet. Antwortet mit `201` mit der `id` des Wettbewerbs.

### Einen Test hinzufügen {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Ein Test ist das Match zwischen zwei Teams eines Teamturniers. Nimmt `firstTeam` und `secondTeam`, jeweils die ID eines Teams nach `team/`, `starts` und `finishes`, `expectedMatches`, `bestOf`, `group` und dieselben Regeln, die ein Wettbewerb nehmen kann. Antwortet mit `201` mit seiner `id`, die die eines Wettbewerbs ist.

### Einen Wettbewerb verschieben, archivieren oder wiederherstellen {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Verschieben ihn in der Liste des Turniers einen Platz nach oben oder unten, archivieren ihn oder stellen ihn wieder her. Sie nehmen keinen Body und antworten mit `204`. Ein Test wird von diesen ebenfalls verschoben, archiviert und wiederhergestellt.

## Die Spieler eines Wettbewerbs {#competition-players}

### Einen Spieler anmelden {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Meldet einen der Spieler des Turniers im Wettbewerb an. Nimmt `player`, den Teil der ID des Turnierspielers nach `tournament-player/`. Antwortet mit `201` mit `id`, der ID des Spielers im Wettbewerb und nicht im Turnier.

### Einen Spieler verschieben, zurückziehen, zurückholen oder entfernen {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Verschieben einen Spieler einen Platz nach oben oder unten, ziehen ihn zurück, heben seinen Rückzug auf oder nehmen ihn aus dem Wettbewerb. Der `player` ist der Teil seiner ID im Wettbewerb nach `competition-player/`. Sie nehmen keinen Body und antworten mit `204`.

Jedes Freilos („Bye“) in einem Wettbewerb hat dieselbe ID, daher wird ein Freilos durch `order` unterschieden, eine ganze Zahl, die der Adresse als `?order=2` angehängt wird. Alles andere wird mit `Request.Invalid` abgelehnt.

## Die Spiele eines Wettbewerbs {#games}

### Ein Spiel hinzufügen {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Nimmt den `winner` und den `loser`, jeweils den Teil der ID eines Wettbewerbsspielers nach `competition-player/`, und die Ergebnisse. Die Spieler eines Tests gehören nicht ihm, daher ist bei einem Test jeder die ganze ID eines Spielers in einem seiner Teams, wie `team-player/…`.

Die Ergebnisse sind so, wie der Wettbewerb sie führt:

- `winnerScore` und `loserScore`, wie sie eingegeben wurden, etwa `26` oder `26tp`.
- Für einen Wettbewerb, der als Advantage Golf Croquet gespielt wird, an ihrer Stelle `winnerHoops`, `winnerTarget`, `loserHoops` und `loserTarget`: die Tore, die jede Seite gemacht hat, und die Tore, auf die sie spielte. Ein `w` nach einem davon, wie `"3w"`, besagt, dass diese Seite gewonnen hat, wo die Brüche gleich sind.

Eine Anfrage mit der Art von Ergebnis, die der Wettbewerb nicht führt, wird mit `Game.AdvantageScoreTyped` oder `Game.HoopsAndTargetsNotAdvantage` abgelehnt. Antwortet mit `201` mit der `id` des Spiels.

### Ein Spiel korrigieren {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Nimmt die Ergebnisse wie das Hinzufügen eines Spiels und, wo sie sich geändert haben, `winner` und `loser`. Ein Spieler, der nicht gesendet wird, ist der des Spiels. Das `game` ist der Teil seiner ID nach `game/`. Antwortet mit `204`.

### Ein Spiel verschieben, archivieren, wiederherstellen oder zurückziehen {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Verschieben das Ergebnis eines Tests einen Platz nach oben oder unten, archivieren ein Spiel oder stellen es wieder her, ziehen es zurück (es wurde gespielt und zählt nicht) oder heben seinen Rückzug auf. Sie nehmen keinen Body und antworten mit `204`. Diese und die beiden oben darf ein Ergebniserfasser.

## Die Spieler eines Turniers {#tournament-players}

### Einen Spieler hinzufügen {#add-tournament-player}

`POST /api/v0/tournaments/{id}/players`

Fügt dem Turnier einen Spieler hinzu. Nimmt `name` und kann `representing`, `handicap`, `flag` und `worldRankingName` nehmen; was fehlt oder leer ist, bleibt ungesagt. Antwortet mit `201` mit der `id` des Spielers, die seine ganze ID ist, wie die GET-Endpunkte sie nennen. Ein Spieler ohne Namen oder mit dem Namen eines Spielers, der schon da ist, wird abgewiesen. Ein Spieler wird in einem Wettbewerb [angemeldet](#enter-player) mit dem Teil dieser `id` nach `tournament-player/`.

### Einen Spieler verschieben, archivieren oder wiederherstellen {#tournament-player-actions}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Verschieben einen der Spieler des Turniers einen Platz nach oben oder unten oder archivieren oder stellen ihn wieder her. Der `player` ist der Teil seiner ID nach `tournament-player/`. Sie nehmen keinen Body und antworten mit `204`.

## Die Teams eines Turniers {#teams}

### Ein Team hinzufügen {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Nimmt `name` und `shortName` und kann `flag` nehmen. Antwortet mit `201` mit der `id` des Teams.

### Einen Spieler zu einem Team hinzufügen {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Nimmt `name` und kann `worldRankingName` nehmen. Antwortet mit `201` mit der `id` des Spielers.

### Ein Team verschieben, archivieren oder wiederherstellen {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Sie nehmen keinen Body und antworten mit `204`.

### Den Spieler eines Teams verschieben, archivieren oder wiederherstellen {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

Der `player` ist der Teil seiner ID nach `team-player/`. Sie nehmen keinen Body und antworten mit `204`.
