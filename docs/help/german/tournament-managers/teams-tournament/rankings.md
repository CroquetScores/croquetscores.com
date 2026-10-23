# Ranglisten

Wenn ein Wettbewerb für die Weltrangliste zählt, werden seine Ergebnisse der Rangliste als Datei geschickt, die die Website aus dem, was Sie eingegeben haben, für Sie erstellt. Auf dem Reiter **Ranglisten** bekommen Sie sie.

## Der Reiter

Öffnen Sie die Seite des Turniers und wählen Sie **Ranglisten**, den letzten ihrer Reiter. Er sagt, was die Datei ist: eine Textdatei für Association Croquet, eine Tabelle für Golf Croquet und American 6 Wicket. Er sagt, was für Sie von Hand noch zu tun bleibt und dass die Datei danach an die Verantwortlichen der Weltrangliste zu senden ist. Darunter steht **Ranglisten herunterladen**, was die Datei speichert. Es ist schon da, bevor ein einziges Ergebnis eingegeben ist, und liefert eine Datei ohne Inhalt, bis eines da ist.

Der Reiter erscheint nur auf der Seite eines Turniers in einer Sportart mit Weltrangliste, und nur für seine Verantwortlichen: Ein Ergebniserfasser bekommt ihn nicht angeboten. Die Datei selbst liegt unter der eigenen Adresse des Turniers mit `/rankings` dahinter, etwa `/2026/ac/spring-open/rankings`, der Adresse, die die Website ihr immer gegeben hat, und jeder, der die Adresse hat, kann sie öffnen.

## Was in der Datei steht

Jedes Ergebnis, das eingegeben und nicht archiviert wurde, steht darin, in der Reihenfolge, in der es eingegeben wurde, einschließlich eines Ergebnisses, das zurückgezogen wurde, und derer eines Spielers, der zurückgezogen hat. Ein archiviertes Ergebnis steht nicht darin. Ein Match, das durch ein Freilos oder kampflos gewonnen wurde, wurde nicht gespielt und hat daher keine Zeile.

Ein Spieler wird mit seinem Namen in der Weltrangliste angegeben, und das ist sein Name, wo ihm kein anderer gegeben wurde.

**Association Croquet** hat einen Block für jeden Wettbewerb, der ein Ergebnis hat: seine Veranstaltung, seine Tage, seinen Sieger, ob es Matches oder Einzelspiele waren, und eine nummerierte Zeile für jedes Ergebnis, wie „1 Sam Someone beat Alex Another +9“. Ein Ergebnis ist die Zahl der Tore des Siegers minus die des Verlierers, mit einem Plus, wo der Sieger mehr erzielt hat, und danach die Peels. Das Match einer K.-o.-Runde ist eine Zeile, mit dem Ergebnis jedes Spiels der Reihe nach. Die Website kann nur raten, wer einen Wettbewerb gewonnen hat. Prüfen Sie daher die Zeile **Winner** jedes Blocks (das Wort steht in der Datei auf Englisch) und korrigieren Sie sie, bevor Sie die Datei weitersenden.

**Golf Croquet und American 6 Wicket** haben eine Tabelle: den Namen des Turniers, seine Tage und wie viele Spiele es umfasst, dann eine nummerierte Zeile für jedes Spiel, mit Familienname und Vorname des Siegers, „beat“, denen des Verlierers und den beiden Ergebnissen. Jedes Spiel des Matches einer K.-o.-Runde ist eine eigene Zeile. Unter der letzten bleibt die Zeile **Tournament winner:** leer, damit Sie sie ausfüllen.

## Wenn es keine Datei gibt

Ein Turnier, von dem kein Wettbewerb für die Weltrangliste zählt, hat keine Datei. Öffnet man die Adresse seiner Ranglisten, zeigt eine Seite, dass es keine gibt und warum: Seine Sportart hat keine Weltrangliste, oder keiner seiner Wettbewerbe zählt, weil jeder mit Vorgaben gespielt wird, Unentschieden zulässt oder abgehakt wurde, dass er nicht zählen soll. Das wird festgelegt, wenn jeder Wettbewerb hinzugefügt wird, und mit seinem **Bearbeiten** geändert. In der Datei stehen nur die Wettbewerbe, die zählen.

Weiter: [Ein Turnier ändern, archivieren und wiederherstellen](changing-and-archiving.md).
