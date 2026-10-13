# Ein Turnier anlegen

Drücke **Neues Turnier** über der Liste der Turniere in der Verwaltung. Der Knopf steht über der Liste und nicht darunter, damit eine lange Liste ihn nicht vom Bildschirm eines Telefons schiebt.

![Das Formular für ein neues Turnier, ausgefüllt](images/new-tournament.png)

Das Formular fragt nach allem, womit ein Turnier beginnt. Für ein gewöhnliches Turnier genügen ein Name, zwei Tage und ein Land: Alles andere wird für dich entschieden und lässt sich ändern.

## Wonach das Formular fragt

**Name.** Wonach Leser suchen, um das Turnier zu finden, etwa „Spring Open“. Er ist zwischen 3 und 254 Zeichen lang. Ein Name ganz in Kleinbuchstaben oder ganz in Großbuchstaben wird abgelehnt, weil er auf jeder Seite, die ihn zeigt, wie ein Fehler aussähe. Zwei Turniere dürfen denselben Namen haben, weil dasselbe Turnier jedes Jahr gespielt wird.

**Beginn** und **Ende.** Die Tage, an denen das Turnier läuft. Ein Turnier kann nicht enden, bevor es beginnt, und weder nach dem Ende des nächsten Jahres beginnen noch enden. Ein Turnier gehört zu dem Jahr, in dem es beginnt, das auch das Jahr in seiner Adresse ist; eines, das über den Jahreswechsel läuft, wird deshalb im Jahr seines Beginns aufgeführt.

**Format.** Wähle **Standard** für ein Turnier zwischen Spielern. Die anderen Formate sind für Turniere zwischen Mannschaften, die eine eigene Anleitung haben.

**Sportart.** Die Sportarten, die die Website anbietet, in ihrer Reihenfolge: Association Croquet, Golf Croquet, American 6 Wicket und Ricochet auf Croquet Scores. Gateball Scores fragt weder nach einer Sportart noch nach einem Format, weil jedes Turnier dort ein Standardturnier im Gateball ist.

**Land** und **Region.** Wo das Turnier gespielt wird. Nach einer Region wird nur gefragt, wenn das gewählte Land in Regionen geteilt ist, wie Australien in Bundesstaaten; ein Land, das für sich eine einzige Region ist, fragt nach keiner. Eine Region muss auch dann nicht gewählt werden, wenn eine angeboten wird.

**Untertitel.** Alles, was Leser wissen sollen und kein eigenes Feld hat: wo man parkt, wann es Mittagessen gibt, wen man anruft. Er steht auf jeder öffentlichen Seite unter dem Namen des Turniers. Er wird in Markdown geschrieben, ein Wort wird also mit Sternchen darum fett, und eine Liste entsteht mit einem Strich am Anfang jeder Zeile. Er darf bis zu 2000 Zeichen lang sein und kann leer bleiben.

**Mit Handicap gespielt.** Hake das für ein Handicapturnier an.

**Unentschieden erlaubt.** Hake das an, wenn ein Spiel enden kann, ohne dass einer der Spieler gewinnt. Die meisten Turniere erlauben das nicht. Ist es angehakt, wird ein Ergebnis mit gleichen Punkten und ohne Markierung als Unentschieden gespeichert; ist es nicht angehakt, muss ein Spiel mit gleichen Punkten durch eine Markierung hinter den Punkten des Siegers sagen, wer gewonnen hat, etwa „6w“.

**Zählt für die Weltrangliste.** Wird nur gefragt, wo es zählen kann: bei einem Turnier im Association Croquet, Golf Croquet oder American 6 Wicket, das weder mit Handicap gespielt wird noch Unentschieden erlaubt. Es ist zu Beginn angehakt, nimm den Haken also weg bei einem Turnier, das nicht zählen soll.

**Veranstaltung auf nationaler Ebene** und **Veranstaltung auf internationaler Ebene.** Ein Turnier kann das eine, das andere oder keines von beiden sein, aber nie beides: Wer das eine anhakt, nimmt beim anderen den Haken weg.

## Anlegen

Drücke **Turnier anlegen**. Du kommst auf die Seite des Turniers in der Verwaltung, von der aus es geführt wird, und du bist sein erster Turnierleiter. Es wird in der Verwaltung unter dem Jahr aufgeführt, in dem es beginnt.

Die öffentliche Adresse des Turniers wird aus seinem Jahr, seiner Sportart und seinem Namen gebildet, etwa `/2026/ac/spring-open`. Es behält diese Adresse, wenn sein Name später korrigiert wird, damit ein schon verschickter Link es noch findet; sie ändert sich nur, wenn sich das Jahr seines Beginns oder seine Sportart ändert.

## Wenn etwas abgelehnt wird

Was abgelehnt wird, steht unter dem Feld, um das es geht, und was du eingegeben hast, bleibt stehen. Nichts wird gespeichert, bevor jedes Feld angenommen ist. Am häufigsten abgelehnt werden ein Name ganz in Kleinbuchstaben, ein Ende vor dem Beginn und ein nicht gewähltes Land.

Weiter: [Spieler](players.md).
