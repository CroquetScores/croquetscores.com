# Passwörter

## Was die Website von einem Passwort verlangt

Überall, wo Sie ein Passwort wählen, beim Bestätigen Ihrer E-Mail-Adresse, beim Festlegen eines neuen Passworts oder beim Ändern, verlangt die Website, dass es:

- **mindestens 12 Zeichen** lang ist;
- zweimal gleich eingetippt wird, beim zweiten Mal als **Passwort bestätigen**;
- keines ist, das anderswo **in einem Datenleck aufgetaucht** ist.

Leerzeichen am Anfang und am Ende werden weggelassen, wie beim Anmelden, damit ein verirrtes Leerzeichen Sie nicht aussperrt. Leerzeichen in der Mitte bleiben erhalten, was zu einer Passphrase aus mehreren Wörtern passt.

## Ein gutes wählen

Die Website verlangt Länge und sonst nichts, keine Großbuchstaben, Ziffern oder Symbole. Das folgt dem heutigen Rat, nach dem ein langes Passwort, das nirgendwo sonst benutzt wird, stärker und leichter zu merken ist als ein kurzes, das schwer lesbar gemacht wurde. Der Rat, dem die Website folgt, stammt vom US-amerikanischen National Institute of Standards and Technology und ist nachzulesen unter [NISTs Richtlinien zur digitalen Identität, zu Passwörtern](https://pages.nist.gov/800-63-4/sp800-63b.html).

Kurz gesagt:

- **Machen Sie es lang.** Mehrere Wörter ohne Zusammenhang ergeben eine Passphrase, die leicht zu merken und schwer zu erraten ist.
- **Benutzen Sie es hier und sonst nirgends.** Ein Passwort, das auf zwei Websites benutzt wird, ist nur so sicher wie die schwächere von beiden, und was bei einer gestohlen wurde, wird bei anderen ausprobiert.
- **Bewahren Sie es in einem Passwortmanager auf**, wenn Sie können. Er kann für jede Website ein langes Passwort erzeugen und sich alle merken.
- **Ändern Sie es nicht nach einem Zeitplan.** Ändern Sie es, wenn Sie glauben, dass jemand anderes es kennt, und sonst nicht.

## Wie die Website auf ein geleaktes Passwort prüft

Listen mit Passwörtern, die auf anderen Websites gestohlen wurden, werden veröffentlicht, und wer in Konten eindringen will, probiert sie zuerst aus. Wenn Sie ein Passwort wählen, fragt die Website deshalb einen externen Dienst, ob es auf einer solchen Liste steht. Der Dienst wird von einem Dritten betrieben, und die Website nutzt ihn nur dafür.

Ihr Passwort verlässt die Website nicht. Die Website bildet daraus einen Einweg-Fingerabdruck, der sich nicht in das Passwort zurückverwandeln lässt, und schickt dem Dienst nur die ersten fünf Zeichen davon. Der Dienst antwortet mit dem Rest des Fingerabdrucks jedes geleakten Passworts, das genauso beginnt, das sind einige hundert, und die Website sucht darunter ihren eigenen. So erfährt der Dienst, dass Ihr Passwort eines von einigen hundert ist, und nie, welches. [Wie das funktioniert, erklärt von Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), sagt mehr.

Ein Passwort, das auf der Liste steht, wird mit einer entsprechenden Meldung abgelehnt, und Sie wählen ein anderes. Ist der Dienst nicht erreichbar, kann Ihr Passwort gerade nicht geprüft werden und wird deshalb weder angenommen noch geändert. Versuchen Sie es in ein paar Minuten noch einmal. Ein Link, den Sie bekommen haben, funktioniert weiter, bis er abläuft.

## Ihr Passwort ändern

Wählen Sie **Passwort ändern** im Menü **Konto**. Die Seite hat die Felder **Aktuelles Passwort** und **Neues Passwort** und dazu noch einmal **Passwort bestätigen**. Das aktuelle wird verlangt, weil Angemeldetsein nicht reicht: Ein entsperrt liegengelassenes Handy würde sonst jedem, der es aufhebt, erlauben, Sie auszusperren.

Ist es geändert, bleiben Sie in diesem Browser angemeldet, und alle anderen werden abgemeldet. Die Website schickt eine E-Mail an Ihre Adresse, dass das Passwort geändert wurde, damit Sie es erfahren, falls Sie es nicht waren. Ein falsches aktuelles Passwort zählt zu denselben Grenzen wie beim Anmelden.

Wenn Sie sich nicht an das aktuelle Passwort erinnern, verweist die Seite auf **Passwort vergessen?**.

Weiter: [Ihr Konto pflegen](looking-after-your-account.md).
