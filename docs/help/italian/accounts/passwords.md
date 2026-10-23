# Password

## Che cosa il sito chiede a una password

Ovunque scegli una password, quando confermi il tuo indirizzo email, ne imposti una nuova o la cambi, il sito chiede che:

- sia lunga **almeno 12 caratteri**;
- sia scritta due volte uguale, la seconda come **Conferma la password**;
- non sia una che è **comparsa in una violazione di dati** altrove.

Gli spazi all'inizio e alla fine vengono tolti, come quando accedi, così che uno spazio sfuggito non ti lasci fuori. Gli spazi in mezzo vengono mantenuti, il che si adatta a una passphrase di più parole.

## Sceglierne una buona

Il sito chiede la lunghezza e nient'altro: niente maiuscole, cifre o simboli. Segue il consiglio attuale, secondo cui una password lunga, mai usata altrove, è più forte e più facile da ricordare di una corta resa difficile da leggere. Il consiglio che il sito segue è quello del National Institute of Standards and Technology degli Stati Uniti, che puoi leggere nelle [linee guida del NIST sull'identità digitale, sulle password](https://pages.nist.gov/800-63-4/sp800-63b.html).

In breve:

- **Falla lunga.** Più parole senza relazione tra loro formano una passphrase facile da ricordare e difficile da indovinare.
- **Usala qui e da nessun'altra parte.** Una password usata su due siti è sicura solo quanto il più debole dei due, e le password rubate da uno vengono provate sugli altri.
- **Tienila in un gestore di password** se puoi: può creare una password lunga per ogni sito e ricordarle tutte.
- **Non cambiarla a scadenze fisse.** Cambiala quando pensi che qualcun altro possa conoscerla, e non altrimenti.

## Come il sito controlla una password violata

Vengono pubblicati elenchi di password rubate ad altri siti, e chi cerca di entrare negli account prova prima quelle. Quindi, quando scegli una password, il sito chiede a un servizio esterno se è in un elenco simile. Il servizio è gestito da una terza parte, e il sito lo usa solo per questo.

La tua password non lascia il sito. Il sito ne ricava un'impronta a senso unico, che non si può riconvertire nella password, e invia al servizio solo i primi cinque caratteri di quell'impronta. Il servizio risponde con il resto dell'impronta di ogni password violata che inizia allo stesso modo, cioè alcune centinaia, e il sito cerca la propria tra queste. Così il servizio viene a sapere che la tua password è una tra alcune centinaia, e mai quale. [Come funziona, spiegato da Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), ne dice di più.

Una password che è nell'elenco viene rifiutata con un messaggio che lo dice, e ne scegli un'altra. Se il servizio non è raggiungibile, la tua password in questo momento non può essere controllata, quindi non viene accettata né cambiata. Riprova tra qualche minuto. Un link che ti è stato inviato funziona ancora finché non scade.

## Cambiare la tua password

Scegli **Cambia password** nel menu **Account**. La pagina ha i campi **Password attuale** e **Nuova password**, e poi di nuovo la nuova come **Conferma la password**. Quella attuale viene chiesta perché essere connessi non basta: altrimenti un telefono lasciato sbloccato permetterebbe a chi lo raccoglie di lasciarti fuori.

Una volta cambiata, resti connesso in questo browser e tutti gli altri vengono disconnessi. Il sito invia un'email al tuo indirizzo per dire che la password è stata cambiata, così che, se non eri tu, lo scopri. Una password attuale sbagliata conta per gli stessi limiti dell'accesso.

Se non ricordi la password attuale, la pagina rimanda a **Password dimenticata?**.

Avanti: [Prenderti cura del tuo account](looking-after-your-account.md).
