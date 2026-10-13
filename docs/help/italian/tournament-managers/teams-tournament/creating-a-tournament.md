# Creare un torneo

Premi **Nuovo torneo** sopra l'elenco dei tornei nell'amministrazione. Sta sopra l'elenco anziché sotto, così un elenco lungo non lo spinge fuori dallo schermo di un telefono.

![Il modulo del nuovo torneo, compilato per un torneo a squadre](images/new-tournament.png)

Il modulo chiede tutto ciò con cui un torneo comincia. Ciò che conta di più qui è il **Formato**, che è ciò che rende un torneo un torneo a squadre.

## Che cosa chiede il modulo

**Nome.** Ciò che i lettori cercano per trovare il torneo, come "Trans-Tasman Tests". È lungo tra 3 e 254 caratteri. Un nome tutto in minuscolo, o tutto in maiuscolo, viene rifiutato, perché sembrerebbe un errore su ogni pagina in cui compare. Due tornei possono avere lo stesso nome, perché lo stesso torneo si gioca ogni anno.

**Inizia** e **Finisce.** I giorni in cui si svolge il torneo. Ogni test si gioca al loro interno, quindi impostali in modo che coprano l'intero evento. Un torneo non può finire prima di cominciare, e non può cominciare o finire dopo la fine dell'anno prossimo. Un torneo appartiene all'anno in cui comincia, che è anche l'anno nel suo indirizzo.

**Formato.** Scegli uno dei formati a squadre:

- **A squadre** è il formato generale per qualsiasi evento tra squadre.
- **Eire Cup**, **Interstate Shield** e **GC World Team Championship** sono eventi particolari, ciascuno tenuto come un formato a sé così che possa essere gestito come quell'evento si gestisce.

Standard è l'unico formato che non è a squadre, e non è ciò che vuoi qui. Gateball Scores non offre nessun formato, perché ogni torneo lì è un torneo standard di gateball; un torneo a squadre si crea su Croquet Scores.

**Sport.** Gli sport che il sito offre, nel suo ordine: Association Croquet, Golf Croquet, Croquet americano a 6 archetti e Ricochet.

**Paese** e **Regione.** Dove si gioca il torneo. La regione viene chiesta solo quando il paese che scegli è diviso in regioni, come gli stati dell'Australia, e anche allora si può non scegliere.

**Sottotitolo.** Tutto ciò che vuoi far sapere ai lettori e che non ha un campo suo: dove parcheggiare, a che ora si pranza, chi chiamare. Compare sotto il nome del torneo su ogni pagina pubblica. Si scrive in Markdown, quindi una parola si mette in grassetto con degli asterischi intorno e un elenco si fa con un trattino all'inizio di ogni riga. Può arrivare a 2000 caratteri, e si può lasciare vuoto.

**Si gioca con handicap.** Spuntalo per un evento a handicap.

**Ammette i pareggi.** Spuntalo quando una partita può finire senza che nessuno dei due giocatori vinca. Quando è spuntato, un punteggio inserito con punti pari e senza segno viene conservato come pareggio; quando non lo è, una partita a punti pari deve dire chi l'ha vinta con un segno dopo il punteggio del vincitore, come "6w".

**I test in parità sono pareggiati.** Viene chiesto solo una volta scelto un formato a squadre. Un test lo vince la squadra che vince più incontri, e uno in parità sugli incontri si decide con la differenza partite, poi con la differenza archetti, a meno che questo non sia spuntato, nel qual caso un test in parità sugli incontri è pareggiato, come lo prevedono alcuni eventi a squadre. Comincia senza spunta per A squadre, e con la spunta per il GC World Team Championship, che ha sempre pareggiato un test in parità.

**Vale per le classifiche mondiali.** Viene chiesto solo quando può valere: un torneo di Association Croquet, di Golf Croquet o di Croquet americano a 6 archetti che non si gioca con handicap e non ammette i pareggi. All'inizio è spuntato.

**Evento di livello nazionale** ed **Evento di livello internazionale.** Un torneo può essere l'uno, l'altro, o nessuno dei due, ma mai entrambi: spuntare l'uno toglie la spunta all'altro.

## Crearlo

Premi **Crea torneo**. Vieni portato alla pagina del torneo nell'amministrazione, aperta sulla scheda Squadre, e sei il suo primo organizzatore. È elencato nell'amministrazione sotto l'anno in cui comincia.

![Un torneo appena creato, ancora senza squadre](images/tournament-page-empty.png)

L'indirizzo pubblico del torneo è formato dal suo anno, dal suo sport e dal suo nome, come `/2026/ac/trans-tasman-tests`. Mantiene quell'indirizzo quando il nome viene corretto più tardi, così un link già inviato lo trova ancora; si sposta solo quando cambia l'anno in cui comincia, o il suo sport.

## Se qualcosa viene rifiutato

Ciò che viene rifiutato è detto sotto il campo a cui si riferisce, e ciò che hai scritto resta scritto. Nulla viene conservato finché ogni campo non è accettato. Le cose rifiutate più spesso sono un nome scritto tutto in minuscolo, una fine prima dell'inizio e un paese non scelto.

Avanti: [Squadre](teams.md).
