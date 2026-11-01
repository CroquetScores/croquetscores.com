// Il sito in italiano.
// Ci si rivolge a chi legge con il "tu", come fanno quasi tutti i siti e le app
// italiani, e non con il "Lei".
// Voci di menu, pulsanti e titoli seguono l'uso italiano: maiuscola solo alla
// prima parola ("Cambia indirizzo email"), mai a ogni parola.
// "Indirizzo email" per l'indirizzo, "email" per il messaggio; "password" resta
// com'è (è la parola che si usa); "accedi" per sign in, "esci" per sign out,
// "registrati" per register. "Dimenticare l'account" è la cancellazione dei dati
// (forget), diversa da "Password dimenticata". Sport e nazioni hanno il nome
// italiano abituale; "bye" resta "Bye", perché è la parola che il sito riconosce
// e che usa anche chi gioca in Italia.
// Per le gare: "torneo" (tournament), "competizione" (competition), "girone"
// (block), "eliminazione diretta" (knockout), "svizzero" (Swiss), "incontro"
// (match), "partita" (game), "porta" (hoop), "test" (test tra squadre).
import type { Language } from "../common/language.js";

export const italian: Language = {
  tag: "it",
  name: "Italiano",
  words: {
    // Le barre del sito. Il nome del sito non è tra queste parole: non è parola
    // di nessuna lingua, quindi viene dalla configurazione.
    "site.skipToContent": "Vai al contenuto",
    "navigation.menu": "Menu",
    "navigation.label": "Principale",
    "navigation.home": "Home",
    "navigation.help": "Aiuto",
    "navigation.admin": "Amministrazione",
    "sections.label": "Sezioni",
    "theme.label": "Tema",
    "theme.light": "Chiaro",
    "theme.dark": "Scuro",
    "theme.system": "Sistema",
    "footer.donate": "Dona",
    "footer.plea": "Ti piace {siteName}? Dona per sostenerne lo sviluppo.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacy",
    "footer.termsOfUse": "Condizioni d'uso",
    "footer.reportBug": "Segnala un errore",
    "beta.banner":
      "Questo è un sito beta. I dati possono essere azzerati in qualsiasi momento.",
    "privacy.contact":
      "Domande su questa pagina o su ciò che viene conservato su di te: {emailAddress}",
    // La casella da spuntare per accettare le condizioni d'uso di chi scrive.
    // Le parole del link vengono cercate nel testo della casella e ne fanno il
    // link, quindi devono essere scritte identiche.
    "termsOfUse.agree": "Accetto le condizioni d'uso",
    "termsOfUse.link": "condizioni d'uso",
    // Sotto le condizioni per chi scrive, come privacy.contact sotto l'informativa.
    "termsOfUse.report":
      "Segnala ciò che è stato scritto o fai domande su queste condizioni: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Spunta la casella per accettare le condizioni d'uso.",
    // Detto in ogni pagina di un sito di prova, sotto la barra del sito.
    "tryWebsite.banner":
      "Questo è un posto sicuro per imparare a usare {siteName}. Tutto ciò che inserisci qui può essere rimosso in qualsiasi momento.",

    "language.label": "Lingua",
    "language.choose": "Cambia",

    // L'avviso che segnala che c'è qualcosa di nuovo da leggere.
    "whatsNew.public.message": "C'è qualcosa di nuovo da leggere.",
    "whatsNew.admin.message":
      "C'è qualcosa di nuovo per chi organizza i tornei.",
    "whatsNew.view": "Vedi le novità",
    "whatsNew.later": "Ricordamelo la prossima volta",
    "whatsNew.never": "Non mostrarmi più questo avviso",

    "form.otherwise":
      "Qualcosa non va. Controlla quello che hai inserito e riprova.",

    // Il menu dell'account nell'intestazione e ogni voce che apre.
    "account.menu": "Account",
    "account.register": "Registrati",
    "account.signIn": "Accedi",
    "account.forgotPassword": "Password dimenticata",
    "account.signOut": "Esci",
    "account.profile": "Profilo",
    "account.changePassword": "Cambia password",
    "account.changeEmailAddress": "Cambia indirizzo email",
    "account.changeName": "Cambia nome",
    "account.setPassword": "Imposta password",
    "account.forgetAccount": "Dimentica account",

    "register.title": "Registrati",
    "register.emailAddress": "Indirizzo email",
    "register.submit": "Registrati",
    "register.withGoogle": "Registrati con Google",
    "register.or": "oppure",
    // Detti sopra il modulo quando Google ha rimandato indietro senza far
    // entrare, ciascuno per il codice che la via del ritorno ha dato. Li dicono
    // sia la pagina di registrazione sia quella di accesso, quindi dicono "usa
    // il tuo indirizzo email" senza nominare cosa ne fa ciascun modulo.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google non ha confermato che questo indirizzo email è tuo, quindi non può essere usato qui con Google. Usa invece il tuo indirizzo email qui sotto.",
    "SignInWithGoogle.LinkedToAnother":
      "Questo indirizzo email ha già un account, collegato a un altro account Google. Accedi con quell'account Google, oppure con il tuo indirizzo email e la password.",
    "SignInWithGoogle.NameMissing":
      "Google non ci ha detto il tuo nome, e un account ne ha bisogno. Usa invece il tuo indirizzo email qui sotto.",
    "Google.Unreachable":
      "Google non è raggiungibile in questo momento. Riprova tra qualche minuto, oppure usa il tuo indirizzo email qui sotto.",
    "Registration.NotAPerson":
      "Non sembra che questa richiesta arrivi da una persona. Riprova e, se continua a succedere, aspetta qualche minuto e torna.",

    // Una regola che l'indirizzo può violare, detta sotto il campo interessato.
    "EmailAddress.Missing": "Inserisci un indirizzo email.",
    "EmailAddress.NoAt": "Un indirizzo email contiene una @.",
    "EmailAddress.MoreThanOneAt": "Un indirizzo email contiene una sola @.",
    "EmailAddress.NoDomain":
      "Un indirizzo email ha un dominio dopo la @, per esempio example.com.",

    "welcome.title": "Controlla la tua email",
    "welcome.checkEmail":
      "Un'email è in arrivo all'indirizzo che hai indicato. Segui il link che contiene per continuare.",
    "welcome.nothingArrived":
      "Se dopo qualche minuto non arriva nulla, controlla nella cartella della posta indesiderata o dello spam.",
    "welcome.home": "Torna a {siteName}",
    "newConfirmationLink.title": "Ottieni un nuovo link",
    "newConfirmationLink.explanation":
      "Il link per confermare il tuo indirizzo email è scaduto. Chiedine uno nuovo e lo riceverai all'indirizzo con cui hai registrato l'account.",
    "newConfirmationLink.send": "Inviami un nuovo link",
    "newConfirmationLink.home": "Torna a {siteName}",
    "newConfirmationLink.signIn": "Accedi",
    "newConfirmationLink.sent.title": "Controlla la tua email",
    "newConfirmationLink.sent.explanation":
      "Un nuovo link è in arrivo. Seguilo per confermare il tuo indirizzo email. Se dopo qualche minuto non arriva nulla, controlla nella cartella della posta indesiderata o dello spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Questo indirizzo email è già confermato",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Non c'è altro da confermare. Accedi con la password che hai scelto quando l'hai confermato.",
    "newConfirmationLink.noLongerWorks.title": "Questo link non funziona più",
    "newConfirmationLink.noLongerWorks.explanation":
      "Controlla di aver seguito il link completo dell'email, senza che manchi nulla alla fine. Se ancora non funziona, registrati di nuovo e ti sarà inviato un nuovo link.",
    "newConfirmationLink.tooMany.title": "Riprova più tardi",
    "newConfirmationLink.tooMany.explanation":
      "Di recente sono stati inviati diversi link a questo indirizzo. Aspetta un'ora e chiedilo di nuovo, e nel frattempo controlla la cartella della posta indesiderata o dello spam.",

    "forgotPassword.title": "Hai dimenticato la password?",
    "forgotPassword.emailAddress": "Indirizzo email",
    "forgotPassword.submit": "Inviami un modo per rientrare",
    "forgotPassword.home": "Torna a {siteName}",
    "forgotPassword.sent.title": "Controlla la tua email",
    "forgotPassword.sent.explanation":
      "Se questo indirizzo ha un account, sta arrivando un link per impostare una nuova password. Usalo entro un'ora. Se dopo qualche minuto non arriva nulla, controlla nella cartella della posta indesiderata o dello spam.",
    "forgotPassword.tryAgainLater":
      "Di recente da qui sono state fatte troppe richieste per rientrare. Aspetta un'ora e riprova.",

    "setNewPassword.title": "Imposta una nuova password",
    "setNewPassword.password": "Password",
    "setNewPassword.confirmPassword": "Conferma la password",
    "setNewPassword.submit": "Imposta la mia nuova password",
    "setNewPassword.home": "Torna a {siteName}",
    "setNewPassword.signIn": "Accedi",
    "setNewPassword.askAgain": "Chiedi un nuovo link",
    "setNewPassword.changed.title": "La tua password è stata cambiata",
    "setNewPassword.changed.explanation":
      "La tua sessione è stata chiusa ovunque avessi effettuato l'accesso. Accedi con la tua nuova password.",
    "setNewPassword.expired.title": "Questo link è scaduto",
    "setNewPassword.expired.explanation":
      "Un link per impostare una nuova password funziona per un'ora. Chiedine un altro e sarà inviato allo stesso indirizzo.",
    "setNewPassword.noLongerWorks.title": "Questo link non funziona più",
    "setNewPassword.noLongerWorks.explanation":
      "Potrebbe essere già stato usato, oppure potrebbe mancare qualcosa alla fine. Chiedine un altro se ti serve ancora.",

    // Detto sopra i campi quando non si può interrogare il controllo delle
    // password compromesse.
    "BreachedPasswords.Unreachable":
      "In questo momento non è possibile controllare la tua password, quindi non è stata cambiata. Riprova tra qualche minuto; il tuo link funziona finché non scade.",

    "forgetAccount.title": "Dimentica il tuo account",
    "forgetAccount.explanation":
      "Il tuo nome e il tuo indirizzo email possono essere resi illeggibili per sempre e il tuo account chiuso. Per essere sicuri che sia tu, ti invieremo prima un link all'indirizzo del tuo account, e non verrà dimenticato nulla finché non lo segui.",
    "forgetAccount.submit": "Inviami il link per email",
    "forgetAccount.sent.title": "Controlla la tua email",
    "forgetAccount.sent.explanation":
      "Abbiamo inviato un link all'indirizzo del tuo account. Funziona per 15 minuti, e solo mentre hai effettuato l'accesso a questo account.",
    "forgetAccount.confirm.title": "Dimenticare il tuo account per sempre?",
    "forgetAccount.confirm.explanation":
      "Una volta dimenticati, il tuo nome e il tuo indirizzo email non potranno più essere letti da nessuno, e non sarà più possibile accedere al tuo account. Non si può annullare.",
    "forgetAccount.confirm.submit": "Dimentica il mio account",
    "forgetAccount.forgotten.title": "Il tuo account è stato dimenticato",
    "forgetAccount.forgotten.explanation":
      "Il tuo nome e il tuo indirizzo email non possono più essere letti, e la tua sessione è stata chiusa ovunque avessi effettuato l'accesso.",
    "forgetAccount.noLongerWorks.title": "Questo link non funziona più",
    "forgetAccount.noLongerWorks.explanation":
      "Potrebbe essere scaduto, già usato, oppure riferito a un account a cui non hai effettuato l'accesso. Se vuoi ancora che sia dimenticato, chiedilo di nuovo dal tuo account.",
    "forgetAccount.lastAdministrator.title":
      "Il tuo account non può essere dimenticato",
    "forgetAccount.lastAdministrator.explanation":
      "Sei l'unico amministratore di questo sito. Assegna il ruolo di amministratore a qualcun altro, e poi il tuo account potrà essere dimenticato.",
    "forgetAccount.askAgain": "Chiedi di nuovo",
    "forgetAccount.home": "Torna a {siteName}",

    "registrationsSuspended.title": "Le registrazioni sono sospese per ora",
    "registrationsSuspended.explanation":
      "Un servizio necessario alla registrazione non è raggiungibile in questo momento, quindi nessuno può registrarsi finché non risponde di nuovo. Non è stato conservato nulla di ciò che hai scritto.",
    "registrationsSuspended.tryAgainLater":
      "Riprova tra un po'. L'amministratore del sito è stato avvisato.",
    "registrationsSuspended.home": "Torna a {siteName}",

    "signIn.title": "Accedi",
    "signIn.emailAddress": "Indirizzo email",
    "signIn.password": "Password",
    "signIn.submit": "Accedi",
    "signIn.forgotPassword": "Password dimenticata?",
    "signIn.register": "Registrati",
    "signIn.withGoogle": "Accedi con Google",
    "signIn.or": "oppure",
    "signIn.tryAgainLater":
      "Di recente sono stati fatti troppi tentativi. Aspetta un'ora e riprova.",

    // L'unica risposta a una password sbagliata e a un indirizzo che nessuno ha
    // registrato. Non dice né l'una né l'altra cosa.
    "SignIn.Failed":
      "L'indirizzo email o la password non sono corretti. Riprova.",

    "profile.title": "Profilo",
    // I due punti di un'etichetta fanno parte delle sue parole, perché le
    // lingue li trattano in modo diverso.
    "profile.name": "Nome:",
    "profile.emailAddress": "Indirizzo email:",

    "changeName.title": "Cambia nome",
    "changeName.name": "Nome",
    "changeName.submit": "Cambia nome",

    "setPassword.title": "Imposta una password",
    "setPassword.explanation":
      "Il tuo account non ha una password: accedi con Google. Per poter accedere anche con una password, invieremo a {emailAddress} un link per impostarla.",
    "setPassword.submit": "Inviami un link per email",
    "setPassword.sent.title": "Controlla la tua email",
    "setPassword.sent.explanation":
      "Ti abbiamo inviato un link per impostare una password. Funziona per un'ora.",
    "setPassword.profile": "Torna al tuo profilo",

    "changePassword.title": "Cambia password",
    "changePassword.currentPassword": "Password attuale",
    "changePassword.password": "Nuova password",
    "changePassword.passwordConfirmation": "Conferma la password",
    "changePassword.forgotPassword": "Password dimenticata?",
    "changePassword.submit": "Cambia password",
    // Sotto la password attuale, che è quella a cui si riferisce.
    "ChangePassword.WrongPassword": "Questa non è la tua password.",

    "changeEmailAddress.title": "Cambia indirizzo email",
    "changeEmailAddress.emailAddress": "Nuovo indirizzo email",
    "changeEmailAddress.currentPassword": "Password attuale",
    "changeEmailAddress.submit": "Invia un link di conferma",
    "changeEmailAddress.sent.title": "Controlla la tua email",
    "changeEmailAddress.sent.explanation":
      "Un link per confermare il trasferimento è stato inviato al nuovo indirizzo email. Seguilo, con l'accesso effettuato, per trasferire lì il tuo account.",
    "changeEmailAddress.confirm.title": "Trasferisci il tuo account",
    "changeEmailAddress.confirm.explanation":
      "Il tuo account sarà trasferito a {emailAddress}. D'ora in poi accederai con quell'indirizzo.",
    "changeEmailAddress.confirm.submit": "Trasferisci il mio account",
    "changeEmailAddress.noLongerWorks.title": "Questo link non funziona più",
    "changeEmailAddress.noLongerWorks.explanation":
      "È scaduto, è già stato usato, oppure non è stato inviato per l'account a cui hai effettuato l'accesso. Chiedilo di nuovo dal tuo profilo.",
    "changeEmailAddress.taken.title": "Il tuo account non è stato trasferito",
    "changeEmailAddress.profile": "Torna al tuo profilo",
    // Sotto il campo a cui si riferisce ciascuna.
    "ChangeEmailAddress.WrongPassword": "Questa non è la tua password.",
    "ChangeEmailAddress.Unchanged": "Il tuo account è già a questo indirizzo.",
    "ChangeEmailAddress.Taken":
      "Questo indirizzo email ha ormai un account suo, quindi il tuo non può essere trasferito lì.",

    "confirmEmailAddress.title": "Conferma il tuo indirizzo email",
    "confirmEmailAddress.name": "Nome",
    "confirmEmailAddress.password": "Password",
    "confirmEmailAddress.confirmPassword": "Conferma la password",
    "confirmEmailAddress.submit": "Conferma il mio indirizzo email",
    "confirmEmailAddress.signIn": "Accedi",
    "confirmEmailAddress.home": "Torna a {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Il tuo indirizzo email è confermato",
    "confirmEmailAddress.confirmed.explanation":
      "Il tuo account è pronto. Accedi con l'indirizzo email e la password che hai appena indicato.",
    "confirmEmailAddress.expired.title": "Questo link è scaduto",
    "confirmEmailAddress.expired.explanation":
      "Un link per confermare un indirizzo email funziona per 24 ore. Chiedine uno nuovo e sarà inviato allo stesso indirizzo.",
    "confirmEmailAddress.expired.newLink": "Inviami un nuovo link",
    "confirmEmailAddress.noLongerWorks.title": "Questo link non funziona più",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Controlla di aver seguito il link completo dell'email, senza che manchi nulla alla fine. Se ancora non funziona, registrati di nuovo e ti sarà inviato un nuovo link.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Questo indirizzo email è già confermato",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Non c'è altro da fare. Accedi con la password che hai scelto quando l'hai confermato.",

    // Una regola violata, con il suo codice, così che ogni modulo la dica allo
    // stesso modo. Detta a chi ha scritto, sotto il campo che si legge.
    "PersonName.Missing": "Inserisci un nome.",
    "PersonName.TooShort": "Un nome deve avere almeno 3 caratteri.",
    "PersonName.TooLong": "Un nome può avere al massimo 254 caratteri.",
    "WorldRankingName.TooShort":
      "Un nome della classifica mondiale deve avere almeno 3 caratteri.",
    "WorldRankingName.TooLong":
      "Un nome della classifica mondiale può avere al massimo 254 caratteri.",
    "Password.Missing": "Inserisci una password.",
    "Password.TooShort": "Una password deve avere almeno 12 caratteri.",
    "Password.ConfirmationDiffers":
      "Non è uguale alla password qui sopra. Scrivila di nuovo.",
    "Password.Breached":
      "Questa password è comparsa in una violazione di dati altrove, quindi non è sicura da usare qui. Scegline un'altra.",

    "javaScriptRequired.title": "Serve JavaScript",
    "javaScriptRequired.explanation":
      "Per registrarsi serve JavaScript attivo su questo sito, così da poter verificare che chi si registra sia una persona. Attivalo, poi registrati di nuovo.",
    "javaScriptRequired.register": "Torna alla registrazione",
    "javaScriptRequired.home": "Torna a {siteName}",

    "errors.backHome": "Torna a {siteName}",
    "errors.notFound": "Non trovato",
    "errors.refused": "Non è stato possibile farlo",
    "errors.refusedDetail": "Qualcosa in ciò che è stato inviato non va.",
    "errors.sorry": "Spiacenti",
    "errors.sorryDetail": "Non è stato possibile gestire questa richiesta.",
    "errors.failed": "Qualcosa è andato storto",
    "errors.reference": "Riferimento {reference}.",
    "errors.recorded":
      "L'errore è stato registrato e un'email è stata inviata all'amministratore. Aiuta scrivere all'amministratore con il riferimento e una descrizione di ciò che stavi facendo.",
    "errors.message": "Scrivi all'amministratore",
    "errors.messageSubject": "Errore {reference} su {siteName}",
    "errors.messageBody": "Ecco cosa stavo facendo quando è successo:\n\n",
    "errors.unavailable": "Il sito non è disponibile",
    "errors.unavailableDetail":
      "In questo momento il sito non riesce a raggiungere ciò che gli serve. Riprova più tardi.",
    "errors.maintenance": "Il sito è fermo per manutenzione.",
    "errors.maintenanceMinutes": "Dovrebbe tornare tra {minutes} minuti.",
    "errors.maintenanceMinute": "Dovrebbe tornare tra 1 minuto.",
    "errors.maintenanceLonger": "Ci vuole più del previsto, ma tornerà presto.",

    // Le due liste della home, cosa dicono quando sono vuote, e il modo di
    // arrivare a tutti i tornei dell'anno.
    "home.recentResults": "Risultati recenti",
    "home.recentResults.none":
      "Negli ultimi sette giorni non è stata aggiunta nessuna partita.",
    "home.upcomingTournaments": "Prossimi tornei",
    "home.upcomingTournaments.none":
      "Nessun torneo inizia nei prossimi sessanta giorni.",
    "home.allTournaments": "Tutti i tornei del {year}",
    // La pagina di un anno: il titolo e cosa dice quando è vuota.
    "year.heading": "Tornei del {year}",
    "year.none": "Nessun torneo inizia nel {year}.",
    // La pagina di uno sport in un anno: lo stesso, per quello sport.
    "yearSport.heading": "Tornei di {sport} del {year}",
    "yearSport.none": "Nessun torneo di {sport} inizia nel {year}.",
    // La pagina di un torneo: le sezioni, come si dice una partita, quanto fa
    // è stata aggiunta e cosa dice quando non ne ha.
    "tournament.recent": "Recenti",
    "tournament.summary": "Riepilogo",
    // Il riepilogo di un torneo a squadre: i gruppi e le colonne della tabella.
    // La griglia di un test: di quante partite è al meglio ogni incontro, la
    // parola tra le squadre e i totali sotto gli incontri.
    "test.bestOf": "Ogni incontro è al meglio di {count} partite.",
    "test.vs": "contro",
    "test.matches": "Incontri",
    "test.games": "Partite",
    "test.hoops": "Archetti",
    "teamSummary.tests": "Test",
    "teamSummary.matches": "Incontri",
    "teamSummary.games": "Partite",
    "teamSummary.hoops": "Archetti",
    "teamSummary.wins": "Vittorie",
    "teamSummary.losses": "Sconfitte",
    "teamSummary.draws": "Pareggi",
    "teamSummary.for": "Fatte",
    "teamSummary.against": "Subite",
    "teamSummary.net": "Differenza",
    "tournament.players": "Giocatori",
    "search.label": "Cerca",
    "search.tournaments": "Tornei",
    "search.competitions": "Competizioni",
    "search.nothingFound": "Non è stato trovato nulla.",
    "players.search.label": "Cerca giocatori",
    "players.search.prompt": "Scrivi il nome di un giocatore per trovarlo.",
    "players.search.none": "Non è stato trovato nessun giocatore.",
    "search.more":
      "Sono mostrati solo i primi {count}. Aggiungi altre lettere del nome per restringere la ricerca.",
    "websitePlayer.tournament": "Torneo",
    // Un test tra le sezioni di un torneo: i nomi brevi delle due squadre.
    "tournament.test": "{first} contro {second}",
    "tournament.notes": "Note",
    "tournament.commentary": "Cronaca",
    "tournament.beat": "ha battuto",
    "tournament.drewWith": "ha pareggiato con",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 ora",
    "tournament.ago.hours": "{count} ore",
    "tournament.none": "Non è ancora stata giocata nessuna partita.",
    // La pagina dei giocatori di un torneo, quando non ne ha.
    "players.none": "Non è ancora stato aggiunto nessun giocatore.",
    // La pagina dei commenti di un torneo, con le parole del vecchio sito: come
    // si elenca un commento e il link per iniziarne uno.
    "commentaries.by": "di",
    "commentaries.start": "Inizia una nuova cronaca",
    // La pagina che inizia un commento.
    "startCommentary.title": "Inizia una nuova cronaca",
    "startCommentary.titleField": "Titolo",
    "startCommentary.submit": "Inizia la cronaca",
    // "Nuovo" viene detto a chi usa un lettore di schermo al posto dell'asterisco
    // rosso che segna una nota o un commento non ancora letti come sono ora.
    "marks.new": "nuovo",
    // La pagina Note di un torneo e la pagina di una nota.
    "notes.none": "Gli organizzatori non hanno ancora scritto nessuna nota.",
    "note.edited": "modificata",
    // La pagina di un commento: cosa dice quando non ha interventi, cosa dice di
    // un commento e la casella in cui chi scrive scrive il successivo.
    "commentary.none": "Non è ancora stato scritto nessun commento.",
    "commentary.edited": "modificato",
    "commentary.edit": "Modifica",
    "commentary.delete": "Elimina",
    "commentary.comment": "Commento",
    "commentary.add": "Aggiungi commento",
    "commentary.notSent":
      "Non è stato possibile inviare il commento. Ricarica la pagina per vedere se è stato conservato.",
    // La pagina che cambia il titolo di un commento.
    "changeCommentaryTitle.title": "Cambia titolo",
    "changeCommentaryTitle.submit": "Salva",
    // La pagina di un commento, dove chi l'ha scritto lo modifica o lo elimina,
    // e la pagina che chiede conferma prima di eliminarlo.
    "editComment.title": "Modifica commento",
    "editComment.save": "Salva",
    "deleteComment.title": "Elimina commento",
    "deleteComment.question":
      "Eliminare questo commento? Non si può annullare.",
    "deleteComment.confirm": "Elimina commento",
    "deleteComment.keep": "Conservalo",
    // La pagina di un giocatore: le due parti, come si dice una partita come
    // l'ha giocata il giocatore e cosa dice ogni parte quando è vuota.
    "player.games": "Partite",
    "player.competitions": "Competizioni",
    "player.beat": "ha battuto",
    "player.lostTo": "ha perso con",
    "player.drewWith": "ha pareggiato con",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Non è ancora stata giocata nessuna partita.",
    "player.noCompetitions": "Non è ancora iscritto a nessuna competizione.",
    // La pagina di un girone: i totali della griglia, cosa è un punteggio per il
    // giocatore della riga, detto a voce e non mostrato, e un giocatore ritirato.
    "block.wins": "Vittorie",
    "block.matches": "Incontri",
    "block.netGames": "Differenza partite",
    "block.games": "Partite",
    "block.netHoops": "Differenza archetti",
    "block.won": "vinta",
    "block.lost": "persa",
    "block.drawn": "pareggiata",
    "block.withdrawn": "ritirato",
    // Una partita ritirata, che lo spagnolo dice diversamente da un giocatore.
    "block.gameWithdrawn": "ritirata",
    "block.losses": "Sconfitte",
    // The column of places at the end of a block's grid, summary and print,
    // and what is said beneath each about how players level on matches won
    // are told apart. Net hoops come first in the second, for a block whose
    // matches are a single game, where net games would only say again what
    // wins have.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Gli spareggi si decidono per differenza partite, poi differenza archetti, poi chi ha battuto chi.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Gli spareggi si decidono per differenza archetti, poi chi ha battuto chi.",
    "block.tieBreak.whoBeatWho":
      "Gli spareggi si decidono per chi ha battuto chi.",
    "block.tieBreak.other": "Non esiste un metodo di spareggio noto.",
    // Le tre viste di un girone, offerte sotto il titolo.
    "competition.views": "Viste",
    "competition.view.grid": "Griglia",
    "competition.view.summary": "Riepilogo",
    "competition.view.orderOfPlay": "Programma",
    "competition.print": "Stampa",
    "competition.playedTo": "Giocata a {hoops} porte",
    "blockSummary.ranking":
      "In classifica per quota di incontri vinti. Il regolamento di un torneo può collocare i giocatori in modo diverso.",
    "orderOfPlay.none": "Non è ancora stata giocata nessuna partita.",
    "orderOfPlay.column.game": "Partita",
    "orderOfPlay.column.date": "Data",
    // I turni di un'eliminazione diretta, chiamati come li chiamava il vecchio
    // sito, contati a ritroso dall'ultimo, e un bye disegnato al posto di un
    // giocatore.
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Semifinali",
    "knockout.round.quarters": "Quarti di finale",
    "knockout.round.number": "Turno {number}",
    "knockout.bye": "Bye",
    // La tabella di uno svizzero: cosa ha giocato e vinto ogni giocatore e i
    // suoi risultati.
    "swiss.games": "Partite",
    "swiss.wins": "Vittorie",
    "swiss.winShare": "% vittorie",
    "swiss.results": "Risultati",
    // Le frecce che fanno scorrere la griglia di un'eliminazione diretta fino
    // alla finale e di nuovo al primo turno.
    "knockout.onward": "Turni successivi",
    "knockout.back": "Turni precedenti",
    // Ciò che hanno in comune tutte le liste di tornei, nella home e in un anno:
    // le colonne della tabella e ciò che le restringe.
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nome",
    // Una bandiera, che restringe le liste al suo paese, nominata da ciò che fa.
    "tournamentList.onlyIn": "Solo tornei in {country}",
    "tournamentList.usualOrder": "Torna all'ordine abituale",
    "tournamentList.filter.country": "Paese",
    "tournamentList.filter.anyCountry": "Qualsiasi paese",
    "tournamentList.filter.region": "Regione",
    "tournamentList.filter.anyRegion": "Qualsiasi regione",
    "tournamentList.filter.noRegionsBefore":
      "I tornei precedenti a novembre 2026 non hanno una regione.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Qualsiasi sport",
    "tournamentList.filter.submit": "Filtra",
    // Gli anni in cui ci sono tornei, la navigazione secondaria di entrambe.
    "years.label": "Anni",
    // L'elenco a discesa con gli anni che non entrano come schede.
    "years.earlier": "Anni precedenti",

    // Le parole dell'amministrazione. L'amministrazione le disegna nel
    // browser, quindi il server le inserisce nella pagina mentre la invia
    // (adminPage.ts): queste e i rifiuti del torneo qui sotto.
    "admin.newerBuild.message":
      "È disponibile una versione più recente di questo sito.",
    "admin.newerBuild.reload": "Ricarica",
    "admin.title": "Amministrazione",
    "admin.tournaments.new": "Nuovo torneo",
    "admin.tournaments.none": "Nessun torneo",
    "admin.tournaments.filter.none": "Nessun torneo corrisponde",
    "admin.tournaments.show": "Mostra",
    "admin.tournaments.managerScorer": "Gestore/Segnapunti",
    "admin.tournaments.worldRanking": "Classifica mondiale",
    "admin.tournaments.notWorldRanking": "Fuori classifica mondiale",
    // Detto a chi usa un lettore di schermo, perché una riga sul nome non viene letta.
    "admin.tournaments.archived": "Archiviato",
    "admin.tournaments.manage": "Gestisci",
    "admin.tournaments.edit": "Modifica",
    "admin.tournaments.archive": "Archivia",
    "admin.tournaments.restore": "Ripristina",
    "admin.tournaments.scores": "Punteggi",
    "admin.tournaments.players": "Giocatori",
    "admin.years.label": "Anni",
    // Cosa dice l'elenco a discesa degli anni mentre l'anno scelto è una scheda.
    "admin.years.earlier": "Anni precedenti",
    "admin.tournament.name": "Nome",
    "admin.tournament.starts": "Inizio",
    "admin.tournament.finishes": "Fine",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Paese",
    "admin.tournament.region": "Regione",
    "admin.tournament.subtitle": "Sottotitolo",
    "admin.rules.handicap": "Si gioca con handicap",
    "admin.rules.drawsAllowed": "Ammette i pareggi",
    "admin.tournament.levelTestsDrawn": "I test in parità sono pareggiati",
    "admin.rules.worldRankings": "Vale per le classifiche mondiali",
    "admin.rules.maximumHoops": "Numero massimo di porte",
    "admin.tournament.national": "Evento di livello nazionale",
    "admin.tournament.international": "Evento di livello internazionale",
    // Un rifiuto senza parole proprie, sopra i campi.
    "admin.tournament.otherwise": "Così non può essere accettato.",
    "admin.newTournament.title": "Nuovo torneo",
    "admin.newTournament.submit": "Crea torneo",
    "admin.editTournament.title": "Modifica torneo",
    "admin.editTournament.submit": "Aggiorna torneo",
    // Detto al posto del modulo, per un rifiuto senza parole proprie.
    "admin.editTournament.otherwise":
      "Questo torneo non può essere modificato.",
    // La pagina di un torneo e le schede in cui si trova ciò che c'è da gestire.
    "admin.view.tabs": "Torneo",
    "admin.view.players": "Giocatori",
    "admin.view.competitions": "Competizioni",
    "admin.view.managers": "Organizzatori",
    "admin.view.notes": "Note",
    "admin.view.scorers": "Segnapunti",
    "admin.view.rankings": "Classifiche",
    "admin.rankings.file":
      "Le classifiche mondiali useranno i risultati del torneo, tramite questa funzione, e gli organizzatori non devono fare nulla.",
    "admin.rankings.download": "Scarica le partite per la classifica mondiale",
    "rankings.notAvailable": "Le classifiche non sono disponibili",
    "rankings.notAvailable.sport":
      "Lo sport di questo torneo non ha classifiche mondiali, quindi non c'è nulla da inviare.",
    "rankings.notAvailable.notCounted":
      "Nessuna competizione di questo torneo vale per le classifiche mondiali.",
    // Detto al posto delle schede, per un rifiuto senza parole proprie.
    "admin.view.otherwise": "Questo torneo non può essere gestito da qui.",
    // La pagina di una competizione e le schede in cui si trova ciò che c'è da gestire.
    "admin.competitionView.tabs": "Competizione",
    "admin.competitionView.players": "Giocatori",
    "admin.competitionView.scores": "Punteggi",
    "admin.competitionView.losers": "Perdenti",
    "admin.losers.add": "Aggiungi eliminazione diretta dei perdenti",
    "admin.losers.round": "Perdenti di",
    "admin.losers.option": "{round} ({count} perdenti)",
    "admin.losers.name": "Nome dell'eliminazione diretta dei perdenti",
    "admin.losers.none": "Nessuna eliminazione diretta dei perdenti.",
    "admin.losers.noRounds":
      "Questa eliminazione diretta non ha turni i cui perdenti possano continuare a giocare.",
    "admin.losers.remove": "Rimuovi",
    "admin.losers.readOnly":
      "I giocatori di questa eliminazione diretta sono i perdenti di un'altra eliminazione diretta, inseriti qui man mano che ogni partita viene decisa.",
    "admin.hover.losers.add":
      "Aggiungi un'eliminazione diretta per i perdenti di un turno di questa",
    "Tournament.NoSuchRound":
      "L'eliminazione diretta non ha un turno del genere che mandi avanti dei perdenti.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Un'altra eliminazione diretta prende i perdenti di questa, quindi i suoi posti non possono essere cambiati.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Un'altra eliminazione diretta in uso prende i perdenti di questa, quindi archivia prima quella.",
    "Tournament.LosersKnockoutSourceArchived":
      "Questa eliminazione diretta dei perdenti prende i perdenti di una eliminazione diretta archiviata, quindi ripristina prima quella.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Un'eliminazione diretta dei perdenti ha tanti posti quante sono le partite del turno di cui prende i perdenti.",
    "Competition.PlayersSetAutomatically":
      "I giocatori di un'eliminazione diretta dei perdenti vengono inseriti man mano che le partite sono decise, non a mano.",
    // La barra delle sezioni della pagina di un torneo e delle sue competizioni.
    "admin.sections.label": "Il torneo e le sue competizioni",
    "admin.sections.tournament": "Torneo",
    // La barra delle sezioni delle pagine dell'amministratore.
    "admin.administrator.sections.label": "Le pagine dell'amministratore",
    "admin.administrator.sections.tournaments": "Tornei",
    "admin.administrator.sections.accounts": "Account",
    "admin.administrator.sections.worldRankings": "Classifiche mondiali",
    "admin.administrator.sections.importErrors": "Errori di importazione",
    "admin.administrator.sections.logs": "Registri",
    "admin.administrator.sections.databaseStatus": "Accesso al database",
    "admin.administrator.sections.countries": "Paesi",
    "admin.databaseStatus.title": "Accesso al database",
    "admin.databaseStatus.on": "L'accesso al database è attivo.",
    "admin.databaseStatus.off": "L'accesso al database è disattivato.",
    "admin.databaseStatus.expected":
      "Il sito dovrebbe tornare tra {minutes} minuti.",
    "admin.databaseStatus.expectedOne":
      "Il sito dovrebbe tornare tra 1 minuto.",
    "admin.databaseStatus.longer": "Ci vuole più del previsto.",
    "admin.databaseStatus.told": "Ai lettori viene detto: {words}",
    "admin.databaseStatus.toldUsual":
      "Ai lettori viene detta la frase abituale.",
    "admin.databaseStatus.minutes": "Minuti previsti",
    "admin.databaseStatus.words": "Parole per i lettori",
    "admin.databaseStatus.turnOff": "Disattiva",
    "admin.databaseStatus.change": "Cambia",
    "admin.databaseStatus.turnOn": "Attiva",
    "admin.databaseStatus.minutesNeeded": "Servono i minuti.",
    "admin.databaseStatus.otherwise": "Qualcosa è andato storto sul sito.",
    "DatabaseAccess.MinutesNotWhole":
      "I minuti devono essere un numero intero.",
    "DatabaseAccess.MinutesOutOfRange": "I minuti devono essere da 1 a 1440.",
    "DatabaseAccess.WordsTooLong":
      "Le parole non devono superare i 500 caratteri.",
    "DatabaseAccess.NotOff": "L'accesso al database non è disattivato.",
    "admin.administrator.title": "Amministratore",
    // La pagina degli account, una sezione per ogni ruolo.
    "admin.accounts.title": "Account",
    "admin.roles.add": "Aggiungi",
    "admin.roles.administrator.heading": "Amministratori",
    "admin.roles.administrator.none": "Nessun altro amministratore",
    "admin.roles.administrator.removeTitle": "Rimuovi amministratore",
    "admin.roles.administrator.removeExplanation":
      "{name} non sarà più amministratore di questo sito.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Responsabili della classifica mondiale di Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Nessun responsabile della classifica mondiale di Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Rimuovi responsabile della classifica mondiale di Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} non sarà più responsabile della classifica mondiale di Association Croquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Responsabili della classifica mondiale di Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Nessun responsabile della classifica mondiale di Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Rimuovi responsabile della classifica mondiale di Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} non sarà più responsabile della classifica mondiale di Golf Croquet.",
    // Per un rifiuto senza parole proprie, sotto il campo o al posto della
    // lista. Non riguarda l'indirizzo, perché potrebbe essere finita la sessione
    // o essersi guastato il sito.
    // La pagina in cui si importano i giocatori della classifica mondiale e il
    // suo registro, una riga per ogni cosa che l'importazione dice. Un conteggio
    // si dice dopo i due punti, così che un giocatore e molti si dicano allo
    // stesso modo.
    "admin.worldRankings.title":
      "Importa i giocatori della classifica mondiale",
    "admin.worldRankings.import": "Importa",
    "admin.worldRankings.log": "Com'è andata l'importazione",
    "admin.worldRankings.ac.reading":
      "Lettura dell'elenco di Association Croquet",
    "admin.worldRankings.ac.read":
      "Giocatori di Association Croquet letti: {players}",
    "admin.worldRankings.ac.kept":
      "Giocatori di Association Croquet conservati: {players}",
    "admin.worldRankings.ac.refused":
      "L'elenco di Association Croquet non ha potuto essere letto, quindi i suoi giocatori sono rimasti come erano.",
    "admin.worldRankings.gc.reading": "Lettura dell'elenco di Golf Croquet",
    "admin.worldRankings.gc.read": "Giocatori di Golf Croquet letti: {players}",
    "admin.worldRankings.gc.kept":
      "Giocatori di Golf Croquet conservati: {players}",
    "admin.worldRankings.gc.refused":
      "L'elenco di Golf Croquet non ha potuto essere letto, quindi i suoi giocatori sono rimasti come erano.",
    "admin.worldRankings.finished": "Terminata",
    "admin.worldRankings.failed": "L'importazione non è terminata.",
    // Per un rifiuto senza parole proprie, come guasto del sito.
    "admin.worldRankings.otherwise": "Qualcosa è andato storto sul sito.",
    "WorldRankingLists.Unreachable":
      "Il sito delle classifiche mondiali non è raggiungibile.",
    "WorldRankingLists.Unreadable":
      "L'elenco non ha la struttura che le classifiche mondiali danno al loro: una riga non ha potuto essere letta, non contiene nessuno, oppure non è scritto in UTF-8.",
    // I documenti rifiutati dall'importazione dai vecchi siti e la pagina di uno.
    "admin.importErrors.title": "Errori di importazione",
    "admin.importErrors.none": "Nessun errore di importazione",
    "admin.importErrors.otherwise": "Qualcosa è andato storto sul sito.",
    "admin.countries.title": "Paesi",
    "admin.countries.none":
      "Nessun torneo si gioca in un paese che le liste non nominano",
    "admin.countries.oldSite": "Vecchio sito",
    "admin.countries.otherwise": "Qualcosa è andato storto sul sito.",
    "admin.logs.title": "Registri",
    "admin.logs.severity": "Gravità",
    "admin.logs.text": "Cerca",
    "admin.logs.show": "Mostra",
    "admin.logs.prune": "Pulisci",
    "admin.logs.pruneAsk":
      "Rimuovere il registro precedente all'ultima ora? Non si può recuperare.",
    "admin.logs.removed": "{count} voci sono state rimosse",
    "admin.logs.none": "Nessuna voce nel registro",
    "admin.logs.otherwise": "Qualcosa è andato storto sul sito.",
    "admin.hover.logs.show": "Mostra le voci corrispondenti",
    "admin.hover.logs.prune": "Rimuovi il registro precedente all'ultima ora",
    "admin.hover.logs.pruneAgree":
      "Rimuovi il registro precedente all'ultima ora",
    "admin.importError.title": "Errore di importazione",
    "admin.importError.documentId": "ID del documento",
    "admin.importError.tournament": "Torneo",
    "admin.importError.competition": "Competizione",
    "admin.importError.newSite": "Sito nuovo",
    "admin.importError.oldSite": "Sito vecchio",
    "ImportErrorKept.NotFound":
      "L'importazione non ha conservato nessun errore per quel documento.",
    "admin.competitionView.otherwise":
      "Questa competizione non può essere gestita da qui.",
    // La scheda Competizioni: il tipo di ogni competizione, cosa si può farne e
    // il titolo sotto cui stanno quelle archiviate.
    "admin.competitions.block": "Girone",
    "admin.competitions.knockout": "Eliminazione diretta",
    "admin.competitions.swiss": "Svizzero",
    "admin.competitions.view": "Vedi",
    "admin.competitions.edit": "Modifica",
    "admin.competitions.up": "Su",
    "admin.competitions.down": "Giù",
    "admin.competitions.archive": "Archivia",
    "admin.competitions.restore": "Ripristina",
    "admin.competitions.archived": "Competizioni archiviate",
    "admin.competitions.none": "Nessuna competizione",
    "admin.competitions.add": "Aggiungi competizione",
    // La finestra della competizione.
    "admin.competition.addTitle": "Aggiungi competizione",
    "admin.competition.editTitle": "Modifica competizione",
    "admin.competition.name": "Nome",
    "admin.competition.kind": "Tipo",
    "admin.competition.bestOf": "Al meglio di",
    "admin.competition.rounds": "Turni",
    "admin.competition.tieBreaks": "Spareggio",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Differenza partite poi differenza archetti poi chi ha battuto chi",
    "admin.competition.tieBreak.who-beat-who": "Chi ha battuto chi",
    "admin.competition.tieBreak.other": "Altro",
    "admin.competition.places": "Posti",
    "admin.competition.round": "Turno {number}",
    "admin.competition.bestOfs": "Al meglio di (per turno)",
    "admin.competition.quarters": "Quarti",
    "admin.competition.semis": "Semifinali",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Aggiungi",
    "admin.competition.save": "Salva",
    "admin.competition.added": "{name} è stata aggiunta.",
    // Sopra i campi, per un rifiuto senza parole proprie.
    "admin.competition.otherwise":
      "Questa competizione non può essere conservata così com'è.",
    "CompetitionName.Missing": "Inserisci un nome.",
    "CompetitionName.TooLong": "Un nome può avere al massimo 254 caratteri.",
    "CompetitionName.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    "Tournament.KnockoutPlayerHasGames":
      "I giocatori di questo tabellone hanno delle partite, quindi i suoi posti non possono cambiare.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Un turno con un incontro deciso non può diventare al meglio di meno partite.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Un turno non può essere cambiato dopo che si è giocata una partita in un turno successivo.",
    "Tournament.CompetitionNameTaken":
      "Un'altra competizione di questo torneo ha già questo nome.",
    "Tournament.MaximumHoopsInvalid":
      "Inserisci un numero intero di porte, almeno 1, oppure lascia vuoto per nessun massimo.",
    "BestOf.NotWhole": "Inserisci un numero intero di partite.",
    "BestOf.TooSmall": "Un incontro deve essere al meglio di almeno 1 partita.",
    "Rounds.NotWhole": "Inserisci un numero intero di turni.",
    "Rounds.TooSmall": "Un girone deve essere giocato in almeno 1 turno.",
    "KnockoutDraw.EvenBestOf":
      "L'incontro di un'eliminazione diretta deve avere un vincitore, quindi è al meglio di un numero dispari di partite.",
    // La via d'uscita di ogni finestra modale, perché la pagina sotto non è raggiungibile.
    "admin.hover.tournaments.new": "Crea un nuovo torneo",
    "admin.hover.tournaments.manage":
      "Gestisci i giocatori, le squadre, le competizioni e i punteggi di questo torneo",
    "admin.hover.tournaments.edit": "Cambia i dettagli di questo torneo",
    "admin.hover.tournaments.scores": "Inserisci i punteggi di questo torneo",
    "admin.hover.tournaments.players":
      "Occupati dei giocatori di questo torneo",
    "admin.hover.competitions.view":
      "Apri questa competizione per vedere e inserire i suoi giocatori e punteggi",
    "admin.hover.tests.view":
      "Apri questo test per vedere e inserire i suoi punteggi",
    "admin.hover.teams.view":
      "Apri questa squadra per vedere e gestire i suoi giocatori",
    "admin.hover.dialog.player.add": "Aggiungi questo giocatore al torneo",
    "admin.hover.dialog.player.save":
      "Conserva le modifiche a questo giocatore",
    "admin.hover.dialog.team.add": "Aggiungi questa squadra al torneo",
    "admin.hover.dialog.team.save": "Conserva le modifiche a questa squadra",
    "admin.hover.dialog.test.add": "Aggiungi questo test al torneo",
    "admin.hover.dialog.test.save": "Conserva le modifiche a questo test",
    "admin.hover.dialog.competition.add":
      "Aggiungi questa competizione al torneo",
    "admin.hover.dialog.competition.save":
      "Conserva le modifiche a questa competizione",
    "admin.hover.dialog.score.add":
      "Aggiungi questo punteggio alla competizione",
    "admin.hover.dialog.score.save":
      "Conserva la correzione a questo punteggio",
    "admin.hover.dialog.carryForward.save":
      "Riporta avanti i risultati di questo giocatore",
    "admin.hover.dialog.tournament.new": "Crea questo torneo",
    "admin.hover.dialog.tournament.edit":
      "Conserva le modifiche a questo torneo",
    "admin.hover.modal.cancel": "Chiudi senza conservare nulla",
    "admin.hover.modal.ok": "Chiudi questo messaggio",
    "admin.hover.tab": "Mostra la scheda {name}",
    "admin.hover.tournaments.archive":
      "Archivia questo torneo; può essere ripristinato",
    "admin.hover.tournaments.restore":
      "Riporta indietro questo torneo archiviato",
    "admin.hover.players.add": "Aggiungi un giocatore a questo torneo",
    "admin.hover.players.addMany":
      "Aggiungi più giocatori a questo torneo in una volta",
    "admin.hover.dialog.players.add": "Aggiungi questi giocatori al torneo",
    "admin.hover.players.edit": "Cambia i dettagli di questo giocatore",
    "admin.hover.players.up": "Sposta questo giocatore più in alto nell'elenco",
    "admin.hover.players.down":
      "Sposta questo giocatore più in basso nell'elenco",
    "admin.hover.players.archive":
      "Archivia questo giocatore; può essere ripristinato",
    "admin.hover.players.restore":
      "Riporta indietro questo giocatore archiviato",
    "admin.hover.teams.add": "Aggiungi una squadra a questo torneo",
    "admin.hover.teams.edit": "Cambia i dettagli di questa squadra",
    "admin.hover.teams.up": "Sposta questa squadra più in alto nell'elenco",
    "admin.hover.teams.down": "Sposta questa squadra più in basso nell'elenco",
    "admin.hover.teams.archive":
      "Archivia questa squadra; può essere ripristinata",
    "admin.hover.teams.restore": "Riporta indietro questa squadra archiviata",
    "admin.hover.competitions.add": "Aggiungi una competizione a questo torneo",
    "admin.hover.competitions.edit": "Cambia i dettagli di questa competizione",
    "admin.hover.competitions.up":
      "Sposta questa competizione più in alto nell'elenco",
    "admin.hover.competitions.down":
      "Sposta questa competizione più in basso nell'elenco",
    "admin.hover.competitions.archive":
      "Archivia questa competizione; può essere ripristinata",
    "admin.hover.competitions.restore":
      "Riporta indietro questa competizione archiviata",
    "admin.hover.tests.add": "Aggiungi un test tra due squadre",
    "admin.hover.tests.edit": "Cambia i dettagli di questo test",
    "admin.hover.tests.up": "Sposta questo test più in alto nell'elenco",
    "admin.hover.tests.down": "Sposta questo test più in basso nell'elenco",
    "admin.hover.tests.archive":
      "Archivia questo test; può essere ripristinato",
    "admin.hover.tests.restore": "Riporta indietro questo test archiviato",
    "admin.hover.tests.toTeams":
      "Vai alla scheda Squadre per aggiungere le squadre che servono a un test",
    "admin.hover.scores.add":
      "Aggiungi il punteggio di una partita a questa competizione",
    "admin.hover.scores.edit": "Correggi questo punteggio",
    "admin.hover.scores.archive":
      "Archivia questo punteggio perché non conti più; può essere ripristinato",
    "admin.hover.scores.restore":
      "Riporta indietro questo punteggio archiviato, così che conti di nuovo",
    "admin.hover.scores.withdraw":
      "Tieni questo punteggio nell'elenco ma non farlo contare",
    "admin.hover.scores.unwithdraw":
      "Fai contare di nuovo questo punteggio ritirato",
    "admin.hover.scores.up": "Sposta questo punteggio prima nell'elenco",
    "admin.hover.scores.down": "Sposta questo punteggio dopo nell'elenco",
    "admin.hover.competitionPlayers.add":
      "Inserisci il giocatore scelto in questa competizione",
    "admin.hover.competitionPlayers.up":
      "Sposta questo giocatore più in alto nell'elenco",
    "admin.hover.competitionPlayers.down":
      "Sposta questo giocatore più in basso nell'elenco",
    "admin.hover.competitionPlayers.remove":
      "Togli questo giocatore dalla competizione",
    "admin.hover.competitionPlayers.withdraw":
      "Ritira questo giocatore dalla competizione",
    "admin.hover.competitionPlayers.unwithdraw":
      "Rimetti nella competizione questo giocatore ritirato",
    "admin.hover.competitionPlayers.carryForward":
      "Riporta avanti i risultati di questo giocatore da un'altra competizione",
    "admin.hover.notes.add": "Scrivi una nuova nota per questo torneo",
    "admin.hover.notes.edit": "Cambia questa nota",
    "admin.hover.notes.delete": "Elimina questa nota",
    "admin.hover.note.add": "Conserva questa nota e aggiungila al torneo",
    "admin.hover.note.save": "Conserva le modifiche a questa nota",
    "admin.hover.people.add": "Dai il ruolo a questa persona",
    "admin.hover.people.remove": "Togli il ruolo a questa persona",
    "admin.hover.worldRankings.import":
      "Scarica le classifiche mondiali e aggiungi i loro giocatori",
    "admin.modal.cancel": "Annulla",
    // L'unico pulsante di una finestra modale che si limita a informare.
    "admin.modal.ok": "OK",
    // Le schede Organizzatori e Segnapunti, in ciascuna delle quali si rende
    // qualcuno organizzatore o segnapunti dal suo indirizzo email e lo si toglie.
    "admin.people.emailAddress": "Indirizzo email",
    "admin.people.remove": "Rimuovi",
    "admin.people.otherwise": "Non è stato possibile farlo.",
    // Accanto al nome di chi legge tra gli organizzatori.
    "admin.managers.you": "Tu",
    "admin.managers.add": "Aggiungi organizzatore",
    "admin.managers.email": "Scrivi agli organizzatori",
    // Non viene mai detto, perché un torneo ha sempre un organizzatore, ma una
    // lista dice qualcosa quando è vuota.
    "admin.managers.none": "Nessun organizzatore",
    "admin.managers.removeTitle": "Rimuovi organizzatore",
    "admin.managers.removeExplanation":
      "{name} non potrà più gestire questo torneo.",
    "admin.managers.removeYourself.explanation":
      "Non potrai più gestire questo torneo, e qui nessuno può annullarlo per te. Un altro organizzatore può rendertelo di nuovo.",
    "admin.managers.otherwise":
      "Questo indirizzo non può essere reso organizzatore.",
    // La scheda Giocatori.
    // La scheda Giocatori di una competizione.
    "admin.competitionPlayers.add": "Aggiungi giocatore",
    // Sotto l'elenco a discesa, per un rifiuto senza parole proprie.
    "admin.competitionPlayers.otherwise":
      "Questo giocatore non può essere aggiunto.",
    "admin.competitionPlayers.choose": "Giocatore da aggiungere",
    "admin.competitionPlayers.nobody": "Scegli un giocatore",
    // Offerto nell'elenco a discesa di un'eliminazione diretta, e come viene elencato un bye.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Tutti i giocatori sono nella competizione",
    "admin.competitionPlayers.none": "Nessun giocatore",
    "admin.competitionPlayers.up": "Su",
    "admin.competitionPlayers.down": "Giù",
    "admin.competitionPlayers.remove": "Rimuovi",
    "admin.competitionPlayers.withdraw": "Ritira",
    "admin.competitionPlayers.unwithdraw": "Annulla il ritiro",
    "admin.competitionPlayers.withdrawn": "Giocatori ritirati",
    "admin.competitionPlayers.removeTitle": "Rimuovi giocatore",
    "admin.competitionPlayers.removeQuestion":
      "{name} sarà tolto dalla competizione. Non si può annullare.",
    "admin.competitionPlayers.withdrawTitle": "Ritira giocatore",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} non giocherà più nella competizione, e le partite che non ha giocato saranno decise senza di lui.",
    "admin.competitionPlayers.carryForward": "Riporta avanti",
    // La finestra di riporto, sulla scheda Giocatori di una competizione.
    "admin.carryForward.title": "Riporta avanti - {name}",
    "admin.carryForward.save": "Salva",
    // Sopra i conteggi, per un rifiuto senza parole proprie.
    "admin.carryForward.otherwise": "Questo riporto non può essere conservato.",
    "admin.carryForward.matchWins": "Incontri vinti",
    "admin.carryForward.matchLosses": "Incontri persi",
    "admin.carryForward.gameWins": "Partite vinte",
    "admin.carryForward.gameLosses": "Partite perse",
    "admin.carryForward.hoopsFor": "Archetti fatti",
    "admin.carryForward.hoopsAgainst": "Archetti subiti",
    "CarryForward.MatchWinsNotWhole":
      "Inserisci un numero intero di incontri vinti.",
    "CarryForward.MatchWinsBelowZero": "Inserisci 0 o più incontri vinti.",
    "CarryForward.MatchLossesNotWhole":
      "Inserisci un numero intero di incontri persi.",
    "CarryForward.MatchLossesBelowZero": "Inserisci 0 o più incontri persi.",
    "CarryForward.GameWinsNotWhole":
      "Inserisci un numero intero di partite vinte.",
    "CarryForward.GameWinsBelowZero": "Inserisci 0 o più partite vinte.",
    "CarryForward.GameLossesNotWhole":
      "Inserisci un numero intero di partite perse.",
    "CarryForward.GameLossesBelowZero": "Inserisci 0 o più partite perse.",
    "CarryForward.HoopsForNotWhole":
      "Inserisci un numero intero di archetti fatti.",
    "CarryForward.HoopsForBelowZero": "Inserisci 0 o più archetti fatti.",
    "CarryForward.HoopsAgainstNotWhole":
      "Inserisci un numero intero di archetti subiti.",
    "CarryForward.HoopsAgainstBelowZero": "Inserisci 0 o più archetti subiti.",
    // La scheda Punteggi di una competizione e la finestra del punteggio.
    "admin.scores.add": "Aggiungi punteggio",
    "admin.scores.none": "Nessun punteggio",
    "admin.scores.edit": "Modifica",
    "admin.scores.drawNotFilledTitle": "Tabellone non completo",
    "admin.scores.archive": "Archivia",
    "admin.scores.up": "Su",
    "admin.scores.down": "Giù",
    "admin.scores.restore": "Ripristina",
    "admin.scores.archived": "Punteggi archiviati",
    "admin.scores.archivedSaid": "Archiviato",
    "admin.scores.withdraw": "Ritira",
    "admin.scores.unwithdraw": "Annulla il ritiro",
    "admin.scores.withdrawnSaid": "Ritirato",
    // Sopra l'elenco, per un rifiuto senza parole proprie.
    "admin.scores.otherwise": "Non è stato possibile farlo.",
    "admin.score.title": "Aggiungi punteggio",
    "admin.score.add": "Aggiungi partita",
    "admin.score.winner": "Vincitore",
    "admin.score.winnerScore": "Punteggio del vincitore",
    "admin.score.loser": "Perdente",
    "admin.score.loserScore": "Punteggio del perdente",
    "admin.score.beat": "ha battuto",
    "admin.score.added":
      "È stata aggiunta la partita che {winner} ha vinto contro {loser}.",
    "admin.score.otherwise": "La partita non ha potuto essere aggiunta.",
    "admin.score.correctTitle": "Modifica punteggio",
    "admin.score.save": "Salva",
    "admin.score.notCorrected": "Il punteggio non ha potuto essere corretto.",
    "Game.WinnerMissing": "Scegli il vincitore.",
    "Game.WinnerScoreMissing": "Scrivi il punteggio del vincitore.",
    "Game.LoserMissing": "Scegli il perdente.",
    "Game.LoserScoreMissing": "Scrivi il punteggio del perdente.",
    "Score.NoPoints": "Un punteggio comincia con il suo numero di punti.",
    "Game.SamePlayer": "Nessuno gioca contro se stesso.",
    "Game.WinnerNotAhead":
      "Il punteggio del vincitore deve essere maggiore di quello del perdente, oppure segnato come vinto.",
    "Game.LoserMarked":
      "Il punteggio del perdente non può essere segnato come vinto.",
    "Game.ResultChanged":
      "Una correzione mantiene il risultato: una partita vinta resta vinta e una partita pareggiata resta pareggiata.",
    "Competition.MatchDecided": "Il loro incontro è già deciso.",
    "Competition.DrawFull":
      "Non è possibile aggiungere il giocatore perché l'eliminazione diretta è al completo.",
    "Competition.DrawNotFilled":
      "Non si possono aggiungere punteggi finché ogni posto dell'eliminazione diretta non è occupato da un giocatore o da un bye.",
    "Competition.ByeOutsideKnockout":
      "Solo un'eliminazione diretta può avere un bye.",
    "Competition.NotDrawnToMeet":
      "Questi giocatori non sono al momento sorteggiati per giocare tra loro nell'eliminazione diretta.",
    "Competition.WinnerHasPlayedOn":
      "Il vincitore di questo incontro ha già giocato la partita successiva, quindi chi l'ha vinto non può cambiare.",
    "CompetitionPlayer.Withdrawn": "Un giocatore ritirato non gioca più.",
    "admin.players.add": "Aggiungi giocatore",
    "admin.players.addMany": "Aggiungi giocatori",
    "admin.players.none": "Nessun giocatore",
    "admin.players.edit": "Modifica",
    "admin.players.archive": "Archivia",
    "admin.players.restore": "Ripristina",
    "admin.players.up": "Su",
    "admin.players.down": "Giù",
    // Chiesto prima di archiviare un giocatore che è in alcune competizioni,
    // perché archiviarlo lo toglie da ciascuna e ripristinarlo non lo rimette.
    "admin.players.archiveTitle": "Archivia giocatore",
    "admin.players.archiveQuestion":
      "{name} sarà rimosso da queste competizioni:",
    "admin.players.archive.explanation":
      "Ripristinarlo non lo rimetterà in queste competizioni.",
    "admin.players.archived": "Giocatori archiviati",
    // Detto a chi usa un lettore di schermo, perché una riga sul nome non viene letta.
    "admin.players.archivedSaid": "Archiviato",
    // La finestra del giocatore.
    "admin.player.addTitle": "Aggiungi giocatore",
    "admin.player.editTitle": "Modifica giocatore",
    "admin.player.name": "Nome",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Rappresenta",
    "admin.player.worldRankingName":
      "Nome del giocatore nella classifica mondiale",
    // Accanto al nome nella classifica mondiale: se le classifiche lo conoscono.
    "admin.player.worldRankingKnown":
      "Le classifiche mondiali conoscono questo nome.",
    "admin.player.worldRankingQuestioned":
      "Le classifiche mondiali non hanno nessun giocatore con questo nome. Potrebbe essere scritto male, oppure il giocatore potrebbe essere nuovo nelle classifiche.",
    "admin.player.flag": "Bandiera",
    "admin.player.add": "Aggiungi",
    "admin.player.save": "Salva",
    "admin.player.added": "{name} è stato aggiunto.",
    // La finestra dei giocatori (players.feature): più giocatori scritti in un solo riquadro.
    "admin.players.addManyTitle": "Aggiungi giocatori",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Aiuto",
    "admin.players.many": "Giocatori",
    "admin.players.line": "Riga {line}: {words}",
    "AddPlayers.FieldsMissing": "Scrivi i nomi dei campi nella prima riga.",
    "AddPlayers.FirstRowNotFields":
      "La prima riga deve contenere i nomi dei campi, consulta la guida per maggiori informazioni.",
    "AddPlayers.NameMissing": "I campi devono includere Name.",
    "AddPlayers.FieldNotAllowed":
      "Un campo può essere Name, Representing, Flag, Handicap o WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Un campo può essere indicato una sola volta.",
    "AddPlayers.PlayersMissing":
      "Scrivi un giocatore su ogni riga dopo la prima.",
    "AddPlayers.TooManyPlayers":
      "Un elenco può contenere al massimo 500 giocatori. Aggiungi gli altri in un altro elenco.",
    "AddPlayers.ValuesMismatched":
      "Ogni giocatore deve avere un valore, oppure nulla, per ogni campo indicato nella prima riga.",
    // Sopra i campi, per un rifiuto senza parole proprie.
    "admin.player.otherwise":
      "Questo giocatore non può essere conservato così com'è.",
    "Tournament.PlayerNameTaken":
      "Un altro giocatore di questo torneo ha già questo nome.",
    "TournamentPlayer.NoSuchFlag": "Scegli una delle bandiere disponibili.",
    "TournamentPlayer.HandicapMalformed":
      "Scrivi l'handicap come numero. Ad esempio: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Un giocatore non può chiamarsi Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    // La finestra sopra quella del giocatore quando un giocatore è chiamato bye.
    "admin.player.byesTitle": "I bye non vanno aggiunti",
    "admin.player.byes":
      "Un bye non è uno dei giocatori del torneo. Un'eliminazione diretta offre Bye ogni volta che si aggiungono i suoi giocatori, tante volte quante ne richiede il tabellone.",
    // Un torneo a squadre (view.feature): le schede Squadre e Test, la pagina
    // di una squadra e le loro finestre.
    "admin.view.teams": "Squadre",
    "admin.view.tests": "Test",
    "admin.teams.add": "Aggiungi squadra",
    "admin.teams.none": "Nessuna squadra",
    "admin.teams.edit": "Modifica",
    "admin.teams.view": "Vedi",
    "admin.teams.archive": "Archivia",
    "admin.teams.restore": "Ripristina",
    "admin.teams.up": "Su",
    "admin.teams.down": "Giù",
    "admin.teams.archived": "Squadre archiviate",
    "admin.teams.archivedSaid": "Archiviata",
    "admin.team.addTitle": "Aggiungi squadra",
    "admin.team.editTitle": "Modifica squadra",
    "admin.team.name": "Nome",
    "admin.team.shortName": "Nome breve",
    "admin.team.shortName.explanation":
      "Il nome con cui si chiamano i test della squadra, come AUS v ENG.",
    "admin.team.flag": "Bandiera",
    "admin.team.add": "Aggiungi",
    "admin.team.save": "Salva",
    "admin.team.added": "{name} è stata aggiunta.",
    // Sopra i campi, per un rifiuto senza parole proprie.
    "admin.team.otherwise":
      "Questa squadra non può essere conservata così com'è.",
    "admin.teamView.otherwise": "Questa squadra non può essere vista da qui.",
    "admin.teamView.players": "Giocatori",
    "TeamName.Missing": "Scrivi come si chiama la squadra.",
    "TeamName.TooLong": "Questo nome è troppo lungo.",
    "admin.notes.add": "Aggiungi nota",
    "admin.notes.none": "Nessuna nota",
    "admin.notes.edit": "Modifica",
    "admin.notes.delete": "Elimina",
    // Chiesto prima di eliminare una nota, perché una nota eliminata è persa per sempre.
    "admin.notes.deleteTitle": "Elimina nota",
    "admin.notes.deleteQuestion": "Eliminare la nota “{title}”?",
    "admin.notes.delete.explanation":
      "Una nota eliminata è persa per sempre e non può essere recuperata.",
    // Sopra l'elenco, per un rifiuto senza parole proprie.
    "admin.notes.otherwise": "Non è stato possibile farlo.",
    // La finestra della nota, le schede della sua descrizione e la barra
    // sopra la sua casella.
    "admin.note.addTitle": "Aggiungi nota",
    "admin.note.editTitle": "Modifica nota",
    "admin.note.title": "Titolo",
    "admin.note.description": "Descrizione",
    "admin.note.write": "Scrivi",
    "admin.note.preview": "Anteprima",
    "admin.note.toolbar": "Formattazione",
    "admin.note.tool.heading": "Titolo",
    "admin.note.tool.bold": "Grassetto",
    "admin.note.tool.italic": "Corsivo",
    "admin.note.tool.quote": "Citazione",
    "admin.note.tool.code": "Codice",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Elenco numerato",
    "admin.note.tool.bulletedList": "Elenco puntato",
    "admin.note.tool.taskList": "Elenco di attività",
    "admin.note.add": "Aggiungi",
    "admin.note.save": "Salva",
    // Sopra i campi, per un rifiuto senza parole proprie.
    "admin.note.otherwise": "Questa nota non può essere conservata così com'è.",
    "ManagerNoteTitle.Missing": "Dai un titolo alla nota.",
    "ManagerNoteTitle.TooLong": "Questo titolo è troppo lungo.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un titolo deve contenere una lettera o una cifra.",
    "ManagerNoteDescription.TooLong": "Questa descrizione è troppo lunga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Questa nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "EditManagerNote.NoSuchManagerNote":
      "Questa nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Questa nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "ManagerNote.Deleted":
      "Questa nota è stata eliminata. Potrebbe averla eliminata un altro organizzatore.",
    "CommentaryTitle.Missing": "Dai un titolo alla cronaca.",
    "CommentaryTitle.TooLong": "Questo titolo è troppo lungo.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un titolo deve contenere una lettera o una cifra.",
    "Commentary.TitleTaken": "Un'altra cronaca ha già questo titolo.",
    "CommentText.Missing": "Scrivi qualcosa nel commento.",
    "CommentText.TooLong": "Questo commento è troppo lungo.",
    "TeamShortName.Missing": "Dai un nome breve alla squadra.",
    "TeamShortName.TooLong": "Un nome breve può avere al massimo 10 caratteri.",
    "TeamShortName.NoLetterOrDigit":
      "Un nome breve deve contenere una lettera o una cifra.",
    "Team.ShortNameLongerThanName":
      "Un nome breve non può essere più lungo del nome della squadra.",
    "Team.NoSuchFlag": "Scegli una delle bandiere disponibili.",
    "Team.Archived": "Questa squadra è archiviata e va prima ripristinata.",
    "Team.InATest":
      "Questa squadra gioca in un test e non può essere archiviata.",
    "Team.PlayerNameTaken":
      "Un altro giocatore di questa squadra ha già questo nome.",
    "TeamPlayer.NamedBye": "Un giocatore non può chiamarsi Bye.",
    "TeamPlayer.Archived":
      "Questo giocatore è archiviato e va prima ripristinato.",
    "TeamPlayer.HasGames":
      "Questo giocatore ha giocato e non può essere archiviato.",
    "Tournament.TeamNameTaken":
      "Un'altra squadra di questo torneo ha già questo nome.",
    "Tournament.TeamShortNameTaken":
      "Un'altra squadra di questo torneo ha già questo nome breve.",
    "Tournament.NoSuchTeam":
      "Questo torneo non ha nessuna squadra a questo indirizzo.",
    "Tournament.TeamArchived":
      "Questa squadra è archiviata e può essere ripristinata solo dalla scheda Squadre.",
    "admin.tests.add": "Aggiungi test",
    "admin.tests.none": "Nessun test",
    "admin.tests.edit": "Modifica",
    "admin.tests.view": "Vedi",
    "admin.tests.archive": "Archivia",
    "admin.tests.restore": "Ripristina",
    "admin.tests.up": "Su",
    "admin.tests.down": "Giù",
    "admin.tests.archived": "Test archiviati",
    "admin.tests.twoTeamsNeeded":
      "Un test è tra due squadre, quindi prima servono due squadre.",
    "admin.tests.toTeams": "Vai a Squadre",
    "admin.tests.matches.one": "{count} incontro",
    "admin.tests.matches.other": "{count} incontri",
    "admin.tests.bestOf": "al meglio di {games}",
    // Accanto all'elenco, per un rifiuto senza parole proprie.
    "admin.tests.otherwise": "Non è stato possibile farlo.",
    "admin.test.addTitle": "Aggiungi test",
    "admin.test.editTitle": "Modifica test",
    "admin.test.firstTeam": "Squadra A",
    "admin.test.secondTeam": "Squadra B",
    "admin.test.versus": "v",
    "admin.test.starts": "Inizio",
    "admin.test.finishes": "Fine",
    "admin.test.expectedMatches": "Incontri previsti",
    "admin.test.bestOf": "Al meglio di",
    "admin.test.group": "Gruppo",
    "admin.test.add": "Aggiungi",
    "admin.test.save": "Salva",
    "admin.test.added": "{name} è stato aggiunto.",
    "admin.test.otherwise": "Questo test non può essere conservato così com'è.",
    "admin.testView.otherwise": "Questo test non può essere visto da qui.",
    "AddTest.FirstTeamMissing": "Scegli la prima squadra.",
    "AddTest.SecondTeamMissing": "Scegli la seconda squadra.",
    "UpdateTest.FirstTeamMissing": "Scegli la prima squadra.",
    "UpdateTest.SecondTeamMissing": "Scegli la seconda squadra.",
    "ExpectedMatches.NotWhole": "Inserisci un numero intero di incontri.",
    "ExpectedMatches.TooSmall": "Un test deve prevedere almeno 1 incontro.",
    "TestGroup.TooLong": "Questo gruppo è troppo lungo.",
    "Tournament.TestAgainstItself":
      "Una squadra non gioca un test contro se stessa.",
    "Tournament.FormatHasNoGroups":
      "Un test in questo formato non viene inserito in un gruppo.",
    "Tournament.TestFinishesBeforeStarts":
      "Un test non può finire prima di iniziare.",
    "Tournament.TestStartsBeforeTournament":
      "Un test non può iniziare prima del suo torneo.",
    "Tournament.TestFinishesAfterTournament":
      "Un test non può finire dopo il suo torneo.",
    "Tournament.TestHasGamesInUse":
      "Questo test ha delle partite, quindi non può essere archiviato finché ci sono.",
    "Tournament.TestHasGames":
      "Questo test ha ormai delle partite, quindi le sue squadre non possono più essere cambiate.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Sono già iniziati più incontri di così.",
    "Tournament.BestOfBelowGamesPlayed":
      "Due giocatori hanno già giocato più partite di così.",
    "Competition.ExpectedMatchesReached":
      "Questo test ha già iniziato tutti gli incontri previsti.",
    "Competition.SameTeam":
      "Due giocatori della stessa squadra non giocano l'uno contro l'altro.",
    "AddManager.NoSuchAccount":
      "Questo indirizzo non ha nessun account che possa essere reso organizzatore.",
    "admin.scorers.add": "Aggiungi segnapunti",
    "admin.scorers.none": "Nessun segnapunti",
    "admin.scorers.removeTitle": "Rimuovi segnapunti",
    "admin.scorers.removeExplanation":
      "{name} non potrà più inserire i punteggi di questo torneo.",
    // Sotto il campo, per un rifiuto senza parole proprie.
    "admin.scorers.otherwise":
      "Questo indirizzo non può essere reso segnapunti.",
    "AddScorer.NoSuchAccount":
      "Questo indirizzo non ha nessun account che possa essere reso segnapunti.",
    // Dare, togliere ed elencare i ruoli, che può fare solo un amministratore.
    "Account.NotAnAdministrator": "Solo un amministratore può farlo.",
    "AddRole.NoSuchAccount":
      "Questo indirizzo non ha nessun account a cui si possa dare il ruolo.",
    "AddRole.NoSuchRole": "Questo ruolo non esiste.",
    "RemoveRole.NoSuchAccount": "Questo account non esiste.",
    "RemoveRole.NoSuchRole": "Questo ruolo non esiste.",
    "RemoveRole.Yourself": "Non puoi toglierti il ruolo di amministratore.",
    "AccountsWithRole.NoSuchRole": "Questo ruolo non esiste.",
    "Tournament.AlreadyAManager":
      "Questo account gestisce già il torneo e può fare tutto ciò che può fare un segnapunti.",

    // I rifiuti di un torneo, con i loro codici come ogni regola violata. Sotto
    // il campo a cui si riferiscono, o al posto del modulo quando è la pagina
    // stessa a essere rifiutata.
    "TournamentName.Missing": "Scrivi come si chiama il torneo.",
    "TournamentName.TooShort": "Questo nome è troppo corto.",
    "TournamentName.TooLong": "Questo nome è troppo lungo.",
    "TournamentName.AllLowerCase": "Un nome non può essere tutto in minuscolo.",
    "TournamentName.AllCapitals": "Un nome non può essere tutto in maiuscolo.",
    "TournamentName.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    "ReadOnlyDate.Unreadable": "Indica il giorno.",
    "Tournament.FinishesBeforeStarts":
      "Un torneo non può finire prima di iniziare.",
    "Tournament.StartsAfterNextYear":
      "Un torneo non può iniziare dopo l'anno prossimo.",
    "Tournament.FinishesAfterNextYear":
      "Un torneo non può finire dopo l'anno prossimo.",
    "CreateTournament.NoSuchCountry": "Scegli il paese.",
    "TournamentSubtitle.TooLong":
      "Un sottotitolo non può superare i 2000 caratteri.",
    "Tournament.NotAManager":
      "Solo un organizzatore di questo torneo può modificarlo.",
    "Tournament.NotAManagerOrScorer":
      "Solo un organizzatore o un segnapunti di questo torneo può vederlo.",
    "Tournament.Archived":
      "Questo torneo è archiviato e va ripristinato prima di poterlo modificare.",
    "UpdateTournament.NoSuchTournament":
      "A questo indirizzo non c'è nessun torneo.",

    // Lo sport in cui si gioca un torneo e il suo formato, per codice, come li
    // offre l'API al modulo dell'amministrazione.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "A squadre",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "Campionato mondiale a squadre di GC",

    // Dove si gioca, per codice del paese.
    "country.ad": "Andorra",
    "country.ae": "Emirati Arabi Uniti",
    "country.af": "Afghanistan",
    "country.ag": "Antigua e Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Samoa Americane",
    "country.at": "Austria",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Isole Åland",
    "country.az": "Azerbaigian",
    "country.ba": "Bosnia ed Erzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Belgio",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgaria",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivia",
    "country.br": "Brasile",
    "country.bs": "Bahamas",
    "country.bt": "Bhutan",
    "country.bv": "Isola Bouvet",
    "country.bw": "Botswana",
    "country.by": "Bielorussia",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalogna",
    "country.cc": "Isole Cocos (Keeling)",
    "country.cd": "Repubblica Democratica del Congo",
    "country.cf": "Repubblica Centrafricana",
    "country.cg": "Repubblica del Congo",
    "country.ch": "Svizzera",
    "country.ci": "Costa d'Avorio",
    "country.ck": "Isole Cook",
    "country.cl": "Cile",
    "country.cm": "Camerun",
    "country.cn": "Cina",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Capo Verde",
    "country.cx": "Isola Christmas",
    "country.cy": "Cipro",
    "country.cz": "Repubblica Ceca",
    "country.de": "Germania",
    "country.dj": "Gibuti",
    "country.dk": "Danimarca",
    "country.dm": "Dominica",
    "country.do": "Repubblica Dominicana",
    "country.dz": "Algeria",
    "country.ec": "Ecuador",
    "country.ee": "Estonia",
    "country.eg": "Egitto",
    "country.eh": "Sahara Occidentale",
    "country.england": "Inghilterra",
    "country.er": "Eritrea",
    "country.es": "Spagna",
    "country.et": "Etiopia",
    "country.fi": "Finlandia",
    "country.fj": "Figi",
    "country.fk": "Isole Falkland",
    "country.fm": "Micronesia",
    "country.fo": "Isole Fær Øer",
    "country.fr": "Francia",
    "country.ga": "Gabon",
    "country.gb": "Regno Unito",
    "country.gd": "Grenada",
    "country.ge": "Georgia",
    "country.gf": "Guyana francese",
    "country.gh": "Ghana",
    "country.gi": "Gibilterra",
    "country.gl": "Groenlandia",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadalupa",
    "country.gq": "Guinea Equatoriale",
    "country.gr": "Grecia",
    "country.gs": "Georgia del Sud e Isole Sandwich Australi",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Isole Heard e McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croazia",
    "country.ht": "Haiti",
    "country.hu": "Ungheria",
    "country.id": "Indonesia",
    "country.ie": "Irlanda",
    "country.il": "Israele",
    "country.im": "Isola di Man",
    "country.in": "India",
    "country.io": "Territorio britannico dell'Oceano Indiano",
    "country.iq": "Iraq",
    "country.ir": "Iran",
    "country.is": "Islanda",
    "country.it": "Italia",
    "country.je": "Jersey",
    "country.jm": "Giamaica",
    "country.jo": "Giordania",
    "country.jp": "Giappone",
    "country.ke": "Kenya",
    "country.kg": "Kirghizistan",
    "country.kh": "Cambogia",
    "country.ki": "Kiribati",
    "country.km": "Comore",
    "country.kn": "Saint Kitts e Nevis",
    "country.kp": "Corea del Nord",
    "country.kr": "Corea del Sud",
    "country.kw": "Kuwait",
    "country.ky": "Isole Cayman",
    "country.kz": "Kazakistan",
    "country.la": "Laos",
    "country.lb": "Libano",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Lituania",
    "country.lu": "Lussemburgo",
    "country.lv": "Lettonia",
    "country.ly": "Libia",
    "country.ma": "Marocco",
    "country.mc": "Monaco",
    "country.md": "Moldavia",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Isole Marshall",
    "country.mk": "Macedonia del Nord",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Isole Marianne Settentrionali",
    "country.mq": "Martinica",
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maldive",
    "country.mw": "Malawi",
    "country.mx": "Messico",
    "country.my": "Malaysia",
    "country.mz": "Mozambico",
    "country.na": "Namibia",
    "country.nc": "Nuova Caledonia",
    "country.ne": "Niger",
    "country.nf": "Isola Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Paesi Bassi",
    "country.no": "Norvegia",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nuova Zelanda",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Perù",
    "country.pf": "Polinesia Francese",
    "country.pg": "Papua Nuova Guinea",
    "country.ph": "Filippine",
    "country.pk": "Pakistan",
    "country.pl": "Polonia",
    "country.pm": "Saint-Pierre e Miquelon",
    "country.pn": "Isole Pitcairn",
    "country.pr": "Porto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portogallo",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Riunione",
    "country.ro": "Romania",
    "country.rs": "Serbia",
    "country.ru": "Russia",
    "country.rw": "Ruanda",
    "country.sa": "Arabia Saudita",
    "country.sb": "Isole Salomone",
    "country.sc": "Seychelles",
    "country.scotland": "Scozia",
    "country.sd": "Sudan",
    "country.se": "Svezia",
    "country.sg": "Singapore",
    "country.sh": "Sant'Elena",
    "country.si": "Slovenia",
    "country.sj": "Svalbard e Jan Mayen",
    "country.sk": "Slovacchia",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Suriname",
    "country.st": "São Tomé e Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Siria",
    "country.sz": "Eswatini",
    "country.tc": "Isole Turks e Caicos",
    "country.td": "Ciad",
    "country.tf": "Terre australi e antartiche francesi",
    "country.tg": "Togo",
    "country.th": "Thailandia",
    "country.tj": "Tagikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor Est",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisia",
    "country.to": "Tonga",
    "country.tr": "Turchia",
    "country.tt": "Trinidad e Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzania",
    "country.ua": "Ucraina",
    "country.ug": "Uganda",
    "country.um": "Isole minori esterne degli Stati Uniti",
    "country.us": "Stati Uniti",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistan",
    "country.va": "Città del Vaticano",
    "country.vc": "Saint Vincent e Grenadine",
    "country.ve": "Venezuela",
    "country.vg": "Isole Vergini Britanniche",
    "country.vi": "Isole Vergini Americane",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Galles",
    "country.wf": "Wallis e Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yemen",
    "country.yt": "Mayotte",
    "country.za": "Sudafrica",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    // Un'email è fatta di due voci: l'oggetto, che è testo, e il corpo, che è
    // tutto il suo markup. Questo è l'unico posto in cui un catalogo contiene
    // markup, perché un'email si scrive e si traduce come un testo e non come un
    // elenco di frasi messe in ordine altrove: chi ne scrive una vede ciò che
    // vedrà chi la legge. Solo ciò che riempie un'email viene sottoposto a
    // escape, quindi nulla di ciò che le si dà può diventare markup; il markup
    // qui è del sito. `{link}` è il link che l'email porta, `{site}` l'indirizzo
    // del sito, per un link a una sua pagina, `{buttonBackgroundColour}` e
    // `{buttonTextColour}` i colori di un pulsante, `{emailFromName}` il nome da
    // cui il sito invia le email, con cui ognuna si chiude, e `{siteName}` il
    // nome del sito, lo stesso con cui lo chiamano le sue pagine. Gli ultimi
    // quattro sono del sito e li riempie chi scrive, mai ciò che ha messo in
    // coda l'email. Un pulsante si colora dov'è, perché un programma di posta
    // non legge nessun foglio di stile. Nessuna saluta chi la legge per nome,
    // così che di una persona basti mettere in coda l'indirizzo a cui va l'email.

    "Email.ConfirmAddress.subject":
      "Conferma il tuo indirizzo email per {siteName}",
    "Email.ConfirmAddress.body": `
<p>Ciao,</p>

<p>
    grazie per aver creato un account su <strong>{siteName}</strong>.<br />
    Prima di poter usare il tuo account, conferma il tuo indirizzo email
    facendo clic sul pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Conferma il mio indirizzo email
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi confermare il tuo indirizzo email anche aprendo questo link nel browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se non hai creato tu questo account, puoi ignorare tranquillamente questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un nuovo link per confermare il tuo indirizzo email per {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Ciao,</p>

<p>
    hai chiesto di recente una nuova email per confermare il tuo indirizzo email per <strong>{siteName}</strong>.<br />
    Conferma il tuo indirizzo email facendo clic sul pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Conferma il mio indirizzo email
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi confermare il tuo indirizzo email anche aprendo questo link nel browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una volta confermato, potrai continuare a usare il tuo account senza interruzioni.
</p>

<p>
    Se non hai chiesto tu questa email, puoi ignorarla tranquillamente.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Qualcuno ha provato a registrarsi con il tuo indirizzo email",
    "Email.AlreadyRegistered.body": `
<p>Ciao,</p>

<p>
    Qualcuno ha provato a registrarsi su <strong>{siteName}</strong> con questo
    indirizzo email, che ha già un account. Nulla del tuo account è
    cambiato.<br />
    Se eri tu, hai già un account e puoi accedere:
</p>

<p>
    <a href="{site}/account/sign-in" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Accedi
    </a>
</p>

<p>
    Se hai dimenticato la password, puoi reimpostarla qui:
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Password dimenticata
    </a>
</p>

<p>
    Se non eri tu, non devi fare nulla. Nessuno ha ottenuto un modo per
    entrare nel tuo account.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Conferma il trasferimento a questo indirizzo del tuo account {siteName}",
    "Email.ConfirmNewEmailAddress.body": `
<p>Ciao,</p>

<p>
    Qualcuno, con l'accesso a un account <strong>{siteName}</strong>, ha chiesto di
    trasferirlo a questo indirizzo email. Se eri tu, conferma qui, con
    l'accesso a quell'account. Il link funziona per 24 ore.
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Trasferisci il mio account
    </a>
</p>

<p>
    Oppure copia questo indirizzo nel browser:<br />
    {link}
</p>

<p>
    Se non eri tu, non devi fare nulla. Nessun account verrà trasferito qui.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Qualcuno ha chiesto di trasferire un account al tuo indirizzo email",
    "Email.AlreadyHasAnAccount.body": `
<p>Ciao,</p>

<p>
    Qualcuno, con l'accesso a un account <strong>{siteName}</strong>, ha chiesto di
    trasferirlo a questo indirizzo email, che ha già un account suo. Nulla è
    stato trasferito e nulla del tuo account è cambiato.
</p>

<p>
    Se eri tu, hai già un account a questo indirizzo e puoi accedervi.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Il tuo account {siteName} è stato trasferito",
    "Email.EmailAddressChanged.body": `
<p>Ciao,</p>

<p>
    Il tuo account <strong>{siteName}</strong> è stato appena trasferito a un altro
    indirizzo email, {emailAddress}, e d'ora in poi si accede con quell'indirizzo.
</p>

<p>
    Se non eri tu, qualcun altro ha il tuo account. Rispondi a questa email e
    faccelo sapere.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "La tua password {siteName} è stata cambiata",
    "Email.PasswordChanged.body": `
<p>Ciao,</p>

<p>
    La password del tuo account <strong>{siteName}</strong> è stata appena
    cambiata, e ogni altro browser con l'accesso effettuato è stato disconnesso.<br />
    Se eri tu, non devi fare nulla.
</p>

<p>
    Se non eri tu, qualcun altro ha la tua password. Impostane una nuova qui e
    quella persona sarà disconnessa:
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Password dimenticata
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Imposta una nuova password per {siteName}",
    "Email.SetNewPassword.body": `
<p>Ciao,</p>

<p>
    hai chiesto di recente di reimpostare la password per <strong>{siteName}</strong>.<br />
    Puoi reimpostarla facendo clic sul pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Reimposta la password
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi reimpostare la password anche aprendo questo link nel browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se non hai chiesto di reimpostare la password, puoi ignorare tranquillamente questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Imposta una password per {siteName}",
    "Email.SetPassword.body": `
<p>Ciao,</p>

<p>
    Il tuo account <strong>{siteName}</strong> non ha una password: accedi con Google.<br />
    Hai chiesto di impostarne una, per poter accedere anche con il tuo indirizzo email e una password.
    Puoi impostarla facendo clic sul pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Imposta password
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi impostare la password anche aprendo questo link nel browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Il link funziona per un'ora. Se non hai chiesto di impostare una password, puoi ignorare tranquillamente questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Non esiste nessun account {siteName} per questo indirizzo email",
    "Email.RegisterInstead.body": `
<p>Ciao,</p>

<p>
    È stata fatta una richiesta di reimpostare la password per un indirizzo email che
    non è associato a nessun account su <strong>{siteName}</strong>.
</p>

<p>
    Se vuoi usare il nostro servizio, puoi creare un nuovo account visitando:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Se non hai fatto tu questa richiesta, puoi ignorare tranquillamente questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Conferma che il tuo account {siteName} deve essere dimenticato",
    "Email.ConfirmForgetting.body": `
<p>Ciao,</p>

<p>
    Hai chiesto che il tuo account <strong>{siteName}</strong> venga
    dimenticato.<br />
    Segui il pulsante qui sotto per vedere cosa significa e per dire con
    certezza che lo vuoi:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Dimentica il mio account
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi anche aprire questo link nel browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una volta dimenticati, il tuo nome e il tuo indirizzo email non potranno più
    essere letti da nessuno, e non sarà più possibile accedere al tuo account.
    Non si può annullare.
</p>

<p>
    Il link funziona una sola volta, fino a 15 minuti dopo la tua richiesta, e
    solo mentre hai effettuato l'accesso a questo account. Dopo, chiedilo di nuovo
    dal tuo account.
</p>

<p>
    Se non l'hai chiesto tu, non succederà nulla a meno che il link non venga seguito.
    Però qualcuno con l'accesso al tuo account l'ha chiesto, quindi imposta una nuova
    password dalla pagina della password dimenticata per essere sicuro che non possa
    accedere di nuovo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Le registrazioni sono sospese: {service} non è raggiungibile",
    "Email.RegistrationsSuspended.body": `
<p>Ciao,</p>

<p>
    {siteName} non è riuscito a raggiungere {service} alle {when}. Finché non risponde,
    a chi ne ha bisogno, per registrarsi o per impostare una nuova password, viene detto di
    riprovare più tardi.
</p>

<p>
    Non c'è nulla da sbloccare. Ogni tentativo interroga {service} da capo, e le pagine
    tornano a funzionare appena risponde.
</p>

<p>
    Finché {service} resta fuori uso, riceverai un'email in proposito al massimo una volta
    all'ora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} non riesce a raggiungere il suo database",
    "Email.DatabaseUnreachable.body": `
<p>Ciao,</p>

<p>
    {siteName} non è riuscito a raggiungere il suo database alle {when}. Finché non risponde, ogni pagina che ne ha bisogno dice ai lettori che il sito non è disponibile e di riprovare più tardi.
</p>

<p>
    Non c'è nulla da sbloccare. Ogni richiesta chiede una connessione da capo, e il sito torna a funzionare appena il database risponde.
</p>

<p>
    Finché il database resta fuori uso, riceverai un'email in proposito al massimo una volta ogni {minutes} minuti.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} ha fallito su una richiesta",
    "Email.UnhandledError.body": `
<p>Ciao,</p>

<p>
    {siteName} ha fallito alle {when} su una richiesta di {asked}. A chi leggeva è stato mostrato il riferimento {reference}, e il registro ne contiene la causa.
</p>

<p>
    Un sito guasto tende a fallire a ogni richiesta, quindi riceverai un'email sui guasti al massimo 4 volte in un'ora. Quelli successivi sono comunque nel registro.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
