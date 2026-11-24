# Die GET-Endpunkte der API

Diese Adressen lesen und ändern nichts; die, die etwas ändern, stehen in den [POST-Endpunkten](post-endpoints.md). Jede Adresse hier liegt unter `/api/v0` der Website, und jede Antwort ist JSON. Was für alle gilt, wie Schlüssel, Kontingente, Fehler und sparsames Fragen, steht in der [Hilfe für App-Entwickler](index.md). Jeder Antwort können Felder ohne neue Version hinzugefügt werden (siehe [Felder können hinzukommen](index.md#fields-may-be-added)), ignorieren Sie also, was Sie nicht kennen.

Ein Turnier oder ein Wettbewerb wird in einer Adresse mit dem Teil seiner Id benannt, der nach dem Schrägstrich steht: Für `tournament/4f2a…` steht in der Adresse `4f2a…`. Jede Antwort sagt in einem `href`, wo das zu finden ist, wovon sie erzählt, und in einer `uri`, wo die Website es zeigt, als Pfad, der mit einem Schrägstrich beginnt.

## Die Turniere eines Jahres {#tournaments}

`GET /api/v0/tournaments?year=2026`

Nimmt an:

- `year`, erforderlich, eine ganze Zahl wie `2026`.
- `sport`, der Code einer Sportart (siehe [die Sportarten](#sports)), um nur diese aufzulisten. Ohne ihn ist ein Jahr aller Sportarten eine einzige Anfrage.
- `changedSince`, ein Zeitpunkt, geschrieben als `2026-03-01T10:00:00Z`, um nur aufzulisten, was sich seither geändert hat.
- `page` und `pageSize`, wobei eine Seite höchstens 100 Einträge hat.

Sie antwortet mit `tournaments`, jedes mit:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (oder `null`), `sport`
- `uri` und `href`
- `national` und `international`, ob die Veranstalterin oder der Veranstalter sie angekreuzt hat
- `changedAt`, wann zuletzt etwas über das Turnier oder einen seiner Wettbewerbe gespeichert wurde
- `etag`, gebildet aus dem, was das Turnier sagt, damit Sie erkennen können, welche Turniere einer geänderten Liste sich geändert haben

und `total`, `page`, `pageSize` und `next`, das sagt, wo die nächste Seite ist, oder `null` bei der letzten. Die Id bleibt gleich, wie auch immer das Turnier umbenannt oder verschoben wird. Die Liste wird erneut mit dem `ETag` erfragt, das sie gesendet hat, und mit `304` beantwortet, wo sich nichts geändert hat.

## Ein Turnier {#tournament}

`GET /api/v0/tournaments/{id}`

Sagt, was die Liste darüber sagt, und:

- `competitions`: jeder mit `id`, `name`, `kind` (`block`, `swiss`, `knockout` oder `test`), `uri`, `href`, `changedAt` und `etag`.
- `players`, bei einem Turnier, das von Einzelspielern gespielt wird: jeder mit `id`, `name`, `worldRankingName`, `handicap` als Zahl (oder `null`), `representing` (oder `null`) und `etag`.
- `teams`, bei einem Turnier, das von Mannschaften gespielt wird und keine eigenen Spieler hat: jede mit `id`, `name`, `shortName` und ihren `players`, jeder mit `id`, `name` und `worldRankingName`.

Ein Schlüssel, der für ein Turnier erstellt wurde, liest dieses und kein anderes und wird für jedes andere mit `ApiKey.LimitedToAnotherTournament` abgewiesen. Die Antwort ist `304`, wo das gesendete `ETag` oder `Last-Modified` aktuell ist.

## Was ein Turnier sein kann {#choices}

Drei Listen sagen, was ein Turnier auf der gefragten Website sein kann: ihre Sportarten, ihre Formate und die Länder, in denen es stattfinden kann. Es sind die Angebote des Formulars der Website für ein neues Turnier, ein Turnier, das mit einem Code aus einer von ihnen angelegt wird, wird also von [Ein Turnier anlegen](post-endpoints.md#create-tournament) angenommen. Sie brauchen keinen Schlüssel. Jede nimmt `language`, den Tag einer Sprache wie `de`, um ihre Auswahl in dieser Sprache zu benennen; ein Tag, den die Website nicht anbietet, wird mit `400` abgewiesen, und sein `code` sagt, welche Liste ihn abgewiesen hat: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` oder `Countries.LanguageUnknown`. Ohne ihn werden die Sportarten und die Länder auf Englisch benannt und die Formate in der Sprache, die der Browser oder das Cookie der Website nennt; geben Sie also eine `language` an, wo die Namen angezeigt werden. Jede Antwort trägt ein `ETag` und wird mit `304` beantwortet, wo sie unverändert ist.

### Die Sportarten {#sports}

`GET /api/v0/tournaments/sports`

Antwortet mit `sports`, jede mit `code` und `name`. Die `sport`, die ein Turnier nennt und für die eine Liste erfragt werden kann, ist einer dieser Codes. Croquet Scores bietet `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) und `gb` (Gateball); Gateball Scores bietet nur Gateball. Eine Sportart kann in Zukunft hinzukommen, wie ein Feld (siehe [Felder können hinzukommen](index.md#fields-may-be-added)), eine App sollte also mit einem Code zurechtkommen, den sie nicht kennt.

### Die Formate {#formats}

`GET /api/v0/tournaments/formats`

Antwortet mit `formats`, jedes mit `code`, dem Namen, unter dem ein Turnier angelegt wird, `name`, `teams`, ob es von Mannschaften gespielt wird, und `drawsLevelTests`, ob ein Turnier in diesem Format einen Gleichstandstest auslost, wenn es nicht sagt, dass es das nicht tut.

### Die Länder {#countries}

`GET /api/v0/countries`

Antwortet mit `countries`, jedes mit `code` (wie `au`), `name` und `regions`, jede mit `code` und `name`. Sie stehen in der Reihenfolge ihrer Namen in der gefragten Sprache. Eine Region wird so benannt, wie sie erfasst wurde, meist in der Sprache ihres eigenen Landes. Ein Land, das nicht unterteilt ist, hat eine Region, nämlich sich selbst.

## Ein Wettbewerb {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Sagt `name`, `kind`, `href`, `uri` und `changedAt` des Wettbewerbs und wo die API von seinen Spielen erzählt (`games`) und, bei einem Block und einem Schweizer System, die als einzige sie haben, von seinem Stand (`standings`).

## Der Stand eines Blocks oder eines Schweizer Systems {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Sagt den Wettbewerb und `standings`: für jeden Spieler `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (oder `null`) und `shared`, ob der Platz geteilt wird. Ein Block fügt `lost`, `gamesWon` und `netGames` hinzu, die ein Schweizer System nicht sagt.

## Die Spiele eines Wettbewerbs {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Sagt den Wettbewerb und seine Spiele. Jedes Spiel hat eine `id`, einen `winner` und einen `loser`, `drawn`, `withdrawn` (gespielt, aber ohne Wertung), `round` (bei einem K.-o.-System, wo die erste 1 ist, und sonst `null`) und `changedAt`. Jede Seite sagt die `playerId` des Spielers, seinen `name` und sein `score`, wie es eingegeben wurde, etwa `26tp`. Wo ein Spiel unentschieden endete, entscheidet nur die Reihenfolge der Eingabe, welche Seite der Gewinner heißt.

Ein Test, das Match zwischen zwei Mannschaften, sagt `matches` und nicht `games`: jedes Match mit den zwei `players`, einem aus jeder Mannschaft, und den `games` zwischen ihnen.

## Was ein Schlüssel darf {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Braucht einen Schlüssel und sagt, was dieser Schlüssel im Turnier darf: `part`, die Rolle seines Kontos (`manager`, `scorer` oder `neither`), `mayRead` und `mayWrite`. Eine App kann so sagen, warum ein Schreibzugriff abgewiesen würde, bevor sie einen sendet. Die Antwort gilt für den Schlüssel, der gefragt hat, und wird deshalb nie aufbewahrt (`Cache-Control: no-store`).

## Turniere, die das Jahr gewechselt haben {#changed-year}

`GET /api/v0/tournaments/changed-year`

Listet die Turniere auf, die in ein anderes Jahr gekommen sind als das, in dem sie waren, damit eine App verschieben kann, was sie aufbewahrt. Nimmt `changedSince`, `page` und `pageSize` an. Jedes hat `tournamentId`, `previousYear` und `newYear`.

## Turniere, die archiviert wurden {#archived}

`GET /api/v0/tournaments/archived`

Listet die Turniere auf, die archiviert wurden, damit eine App aufhören kann, sie zu zeigen. Nimmt `archivedSince`, geschrieben als `2026-03-01T10:00:00Z`, `page` und `pageSize` an. Jedes hat `tournamentId` und `archivedAt`.

## Weltranglistenspieler {#world-ranking-players}

`GET /api/v0/ac/world-ranking-players`

Listet die Association-Croquet-Spieler, die die Weltranglisten kennen. Nimmt `changedSince`, geschrieben als `2026-03-01T10:00:00Z`, `page` und `pageSize`, wobei eine Seite höchstens 100 hat. Antwortet mit `worldRankingPlayers`, jeder mit:

- `id` und `worldRankingId`, der Nummer, die die Ranglisten dem Spieler geben
- `name`, wie die Ranglisten ihn nennen
- `games`, wo die API von den Spielen des Spielers erzählt (siehe [die Spiele eines Spielers](#world-ranking-player-games))
- `archivedAt`, wann der Spieler archiviert wurde, oder `null`
- `changedAt` und `etag`, gebildet aus dem, was der Spieler sagt

und `total`, `page`, `pageSize` und `next`, wie bei den Turnieren eines Jahres. Die Liste wird mit dem `ETag` erneut erfragt, das sie gesendet hat, und mit `304` beantwortet, wo sich nichts geändert hat. Eine abgewiesene Anfrage wird mit einem `code` abgewiesen, der mit `WorldRankingPlayers.` beginnt, wie `WorldRankingPlayers.PageNotWhole`, und mit einem `field`.

## Die Spiele eines Weltranglistenspielers {#world-ranking-player-games}

`GET /api/v0/ac/world-ranking-players/{id}/games`

Die `id` ist der Teil der `id` des Spielers nach dem Schrägstrich, wie ihn `games` in der obigen Liste nennt. Listet die Association-Croquet-Spiele, die der Spieler gespielt hat, ob in einem Block, einem Schweizer System, einem K.-o.-System oder einem Test, und ob er für sich selbst oder für ein Team spielte. Nimmt `changedSince`, `page` und `pageSize` wie die Liste der Spieler und antwortet mit `games`, in der Reihenfolge, in der sie hinzugefügt wurden, jedes aus der Sicht des Spielers:

- `id`, `tournamentId` und `competitionId`
- `won`, ob der Spieler gewonnen hat, was bei einem Unentschieden `false` ist, und `drawn`
- `score`, die des Spielers, und `opponentScore`, beide wie getippt, etwa `26tp`
- `opponentName`, wie die Ranglisten ihn nennen, wo der Gegner ein Weltranglistenspieler ist, und sonst so, wie das Turnier ihn führt, und `opponentId`, die `id` des Gegners in der obigen Liste, oder `null`, wo er keiner ist
- `archived` und `withdrawn`: Ein Spiel eines archivierten Wettbewerbs oder Turniers oder ein archiviertes oder zurückgezogenes Spiel wird aufgeführt und sagt es, damit eine App, die es behalten hat, aufhören kann, es zu zählen
- `addedAt`, oder `null` bei einem Spiel, das hinzugefügt wurde, bevor die Website festhielt, wann, und `changedAt`
- `etag`

und `total`, `page`, `pageSize` und `next`. Ein Spieler, den die Website nicht kennt, wird mit `404` und `WorldRankingPlayers.NotFound` abgewiesen, was nicht dasselbe ist wie ein Spieler ohne Spiele, der eine leere Liste hat.
