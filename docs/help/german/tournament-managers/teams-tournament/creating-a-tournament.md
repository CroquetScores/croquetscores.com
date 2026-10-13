# Ein Turnier anlegen

Drücke **Neues Turnier** über der Liste der Turniere in der Verwaltung. Der Knopf steht über der Liste und nicht darunter, damit eine lange Liste ihn nicht vom Bildschirm eines Telefons schiebt.

![Das Formular für ein neues Turnier, ausgefüllt für ein Mannschaftsturnier](images/new-tournament.png)

Das Formular fragt nach allem, womit ein Turnier beginnt. Am wichtigsten ist hier das **Format**, denn es macht ein Turnier zu einem Mannschaftsturnier.

## Wonach das Formular fragt

**Name.** Wonach Leser suchen, um das Turnier zu finden, etwa „Trans-Tasman Tests“. Er ist zwischen 3 und 254 Zeichen lang. Ein Name ganz in Kleinbuchstaben oder ganz in Großbuchstaben wird abgelehnt, weil er auf jeder Seite, die ihn zeigt, wie ein Fehler aussähe. Zwei Turniere dürfen denselben Namen haben, weil dasselbe Turnier jedes Jahr gespielt wird.

**Beginn** und **Ende.** Die Tage, an denen das Turnier läuft. Jeder Test wird innerhalb dieser Tage gespielt, lege sie also so, dass sie die ganze Veranstaltung abdecken. Ein Turnier kann nicht enden, bevor es beginnt, und weder nach dem Ende des nächsten Jahres beginnen noch enden. Ein Turnier gehört zu dem Jahr, in dem es beginnt, das auch das Jahr in seiner Adresse ist.

**Format.** Wähle eines der Formate für Mannschaften:

- **Mannschaften** ist das allgemeine Format für jede Veranstaltung zwischen Mannschaften.
- **Eire Cup**, **Interstate Shield** und **GC World Team Championship** sind bestimmte Veranstaltungen, jede als eigenes Format geführt, damit sie so ausgetragen werden kann, wie diese Veranstaltung ausgetragen wird.

Standard ist das einzige Format, das nicht von Mannschaften gespielt wird, und nicht das, was du hier willst. Gateball Scores bietet kein Format an, weil jedes Turnier dort ein Standardturnier im Gateball ist; ein Mannschaftsturnier wird auf Croquet Scores angelegt.

**Sportart.** Die Sportarten, die die Website anbietet, in ihrer Reihenfolge: Association Croquet, Golf Croquet, American 6 Wicket und Ricochet.

**Land** und **Region.** Wo das Turnier gespielt wird. Nach einer Region wird nur gefragt, wenn das gewählte Land in Regionen geteilt ist, wie Australien in Bundesstaaten, und auch dann muss keine gewählt werden.

**Untertitel.** Alles, was Leser wissen sollen und kein eigenes Feld hat: wo man parkt, wann es Mittagessen gibt, wen man anruft. Er steht auf jeder öffentlichen Seite unter dem Namen des Turniers. Er wird in Markdown geschrieben, ein Wort wird also mit Sternchen darum fett, und eine Liste entsteht mit einem Strich am Anfang jeder Zeile. Er darf bis zu 2000 Zeichen lang sein und kann leer bleiben.

**Mit Handicap gespielt.** Hake das für eine Handicapveranstaltung an.

**Unentschieden erlaubt.** Hake das an, wenn ein Spiel enden kann, ohne dass einer der Spieler gewinnt. Ist es angehakt, wird ein Ergebnis mit gleichen Punkten und ohne Markierung als Unentschieden gespeichert; ist es nicht angehakt, muss ein Spiel mit gleichen Punkten durch eine Markierung hinter den Punkten des Siegers sagen, wer gewonnen hat, etwa „6w“.

**Ausgeglichene Tests gelten als unentschieden.** Wird erst gefragt, wenn ein Format für Mannschaften gewählt ist. Einen Test gewinnt die Mannschaft, die mehr seiner Begegnungen gewinnt, und einer, der nach Begegnungen ausgeglichen ist, wird nach der Spieldifferenz, dann nach der Tordifferenz entschieden, es sei denn, das hier ist angehakt; dann endet ein nach Begegnungen ausgeglichener Test unentschieden, wie es manche Mannschaftsveranstaltungen halten. Es beginnt für Mannschaften ohne Haken und für die GC World Team Championship mit Haken, die einen ausgeglichenen Test immer als unentschieden gewertet hat.

**Zählt für die Weltrangliste.** Wird nur gefragt, wo es zählen kann: bei einem Turnier im Association Croquet, Golf Croquet oder American 6 Wicket, das weder mit Handicap gespielt wird noch Unentschieden erlaubt. Es ist zu Beginn angehakt.

**Veranstaltung auf nationaler Ebene** und **Veranstaltung auf internationaler Ebene.** Ein Turnier kann das eine, das andere oder keines von beiden sein, aber nie beides: Wer das eine anhakt, nimmt beim anderen den Haken weg.

## Anlegen

Drücke **Turnier anlegen**. Du kommst auf die Seite des Turniers in der Verwaltung, geöffnet auf dem Reiter Mannschaften, und du bist sein erster Turnierleiter. Es wird in der Verwaltung unter dem Jahr aufgeführt, in dem es beginnt.

![Ein eben angelegtes Turnier, noch ohne Mannschaften](images/tournament-page-empty.png)

Die öffentliche Adresse des Turniers wird aus seinem Jahr, seiner Sportart und seinem Namen gebildet, etwa `/2026/ac/trans-tasman-tests`. Es behält diese Adresse, wenn sein Name später korrigiert wird, damit ein schon verschickter Link es noch findet; sie ändert sich nur, wenn sich das Jahr seines Beginns oder seine Sportart ändert.

## Wenn etwas abgelehnt wird

Was abgelehnt wird, steht unter dem Feld, um das es geht, und was du eingegeben hast, bleibt stehen. Nichts wird gespeichert, bevor jedes Feld angenommen ist. Am häufigsten abgelehnt werden ein Name ganz in Kleinbuchstaben, ein Ende vor dem Beginn und ein nicht gewähltes Land.

Weiter: [Mannschaften](teams.md).
