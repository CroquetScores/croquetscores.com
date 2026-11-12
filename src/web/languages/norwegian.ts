// Norsk bokmål. Leseren tiltales med «du». Menyvalg, knapper og overskrifter
// skrives som vanlige norske setninger: bare det første ordet har stor
// bokstav («Endre e-postadresse», ikke «Endre E-postadresse»). Vi sier
// «e-postadresse» om adressen og «e-post» om selve meldingen. Ord vi har
// bestemt oss for: turnering, konkurranse, blokk, utslagning, sveitsisk,
// buer (hoops), kamp (match), parti (game), arkiver/gjenopprett, fjern
// (remove) og slett (delete). «Bye» beholdes som på engelsk, fordi nettstedet
// selv kjenner igjen det ordet.
import type { Language } from "../common/language.js";

export const norwegian: Language = {
  tag: "nb",
  name: "Norsk bokmål",
  words: {
    // Nettstedets egne felt. Nettstedets navn er ikke et ord i noens språk og
    // settes derfor inn i oppfordringen som nevner det.
    "site.skipToContent": "Hopp til innholdet",
    "navigation.menu": "Meny",
    "navigation.label": "Hovedmeny",
    "navigation.home": "Hjem",
    "navigation.help": "Hjelp",
    "navigation.admin": "Admin",
    "sections.label": "Avsnitt",
    "theme.label": "Tema",
    "theme.light": "Lyst",
    "theme.dark": "Mørkt",
    "theme.system": "System",
    "footer.donate": "Doner",
    "footer.plea":
      "Liker du {siteName}? Doner gjerne og hjelp oss med å utvikle siden videre.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Personvern",
    "footer.termsOfUse": "Brukervilkår",
    "footer.reportBug": "Rapporter en feil",
    "beta.banner":
      "Dette er et betanettsted. Data kan bli nullstilt når som helst.",
    "privacy.contact":
      "Spørsmål om denne siden, eller om hva som lagres om deg: {emailAddress}",
    // Ruta leseren krysser av for å godta brukervilkårene for dem som skriver.
    // Lenkens ord letes opp i rutas ord og gjøres til lenken, så de må skrives
    // nøyaktig som der.
    "termsOfUse.agree": "Jeg godtar brukervilkårene",
    "termsOfUse.link": "brukervilkårene",
    // Under vilkårene for dem som skriver, som privacy.contact står under
    // personvernteksten.
    "termsOfUse.report":
      "Meld fra om det som er skrevet, eller spør om vilkårene: {emailAddress}",
    "TermsOfUse.NotAgreed": "Kryss av i ruta for å godta brukervilkårene.",
    // Sies på hver side på et prøvenettsted, under nettstedsfeltet.
    "tryWebsite.banner":
      "Her kan du lære {siteName} uten risiko. Alt som skrives inn her kan fjernes når som helst.",

    "language.label": "Språk",
    "language.choose": "Bytt",

    // Varselet som sier at det er noe nytt å lese.
    "whatsNew.public.message": "Det er noe nytt å lese.",
    "whatsNew.admin.message":
      "Det er noe nytt for dem som arrangerer turneringer.",
    "whatsNew.view": "Se hva som er nytt",
    "whatsNew.later": "Minn meg på det neste gang",
    "whatsNew.never": "Aldri vis meg dette varselet",

    // The panel at the top of the help that finds a page from a question.
    "helpSearch.title": "Spør {siteName}",
    "helpSearch.label": "Spørsmålet ditt",
    "helpSearch.submit": "Søk",
    "helpSearch.none": "Ingen side i hjelpen svarer på det. Prøv andre ord.",
    "helpSearch.tooLong": "Et spørsmål kan være på høyst {most} tegn.",
    "helpSearch.failed": "Det gikk ikke an å søke i hjelpen. Prøv igjen.",

    "form.otherwise":
      "Noe her stemmer ikke. Sjekk det du skrev inn og prøv igjen.",

    // Kontomenyen i toppen: hva personen står for, og hvert valg den åpner.
    "account.menu": "Konto",
    "account.register": "Registrer deg",
    "account.signIn": "Logg inn",
    "account.forgotPassword": "Glemt passord",
    "account.signOut": "Logg ut",
    "account.profile": "Profil",
    "account.changePassword": "Endre passord",
    "account.changeEmailAddress": "Endre e-postadresse",
    "account.changeName": "Endre navn",
    "account.setPassword": "Lag passord",
    "account.forgetAccount": "Glem konto",

    "register.title": "Registrer deg",
    "register.emailAddress": "E-postadresse",
    "register.submit": "Registrer deg",
    "register.withGoogle": "Registrer deg med Google",
    "register.or": "eller",
    // Sies over skjemaet når Google sendte leseren tilbake uten at de slapp
    // inn, hver med koden veien tilbake ga. Registreringssiden og
    // innloggingssiden sier dem begge, så de sier «bruk e-postadressen din»
    // heller enn å nevne hva hvert skjema bruker den til.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google har ikke bekreftet at den e-postadressen er din, så den kan ikke brukes med Google her. Bruk e-postadressen din nedenfor i stedet.",
    "SignInWithGoogle.LinkedToAnother":
      "Den e-postadressen har allerede en konto, knyttet til en annen Google-konto. Logg inn med den Google-kontoen, eller med e-postadressen og passordet ditt.",
    "SignInWithGoogle.NameMissing":
      "Google sa ikke hva du heter, og en konto trenger et navn. Bruk e-postadressen din nedenfor i stedet.",
    "Google.Unreachable":
      "Google kunne ikke nås akkurat nå. Prøv igjen om noen minutter, eller bruk e-postadressen din nedenfor.",
    "Registration.NotAPerson":
      "Dette så ikke ut til å komme fra et menneske. Prøv igjen, og hvis det fortsetter, vent noen minutter og kom tilbake.",

    // En regel adressen kan bryte, sagt under feltet den gjelder.
    "EmailAddress.Missing": "Skriv inn en e-postadresse.",
    "EmailAddress.NoAt": "En e-postadresse har en @ i seg.",
    "EmailAddress.MoreThanOneAt": "En e-postadresse har én @ i seg.",
    "EmailAddress.NoDomain":
      "En e-postadresse har et domene etter @, for eksempel example.com.",

    "welcome.title": "Sjekk e-posten din",
    "welcome.checkEmail":
      "En e-post er på vei til adressen du oppga. Følg lenken i den for å fortsette.",
    "welcome.nothingArrived":
      "Hvis ingenting kommer på noen minutter, se i søppelpostmappen.",
    "welcome.home": "Tilbake til {siteName}",
    "newConfirmationLink.title": "Få en ny lenke",
    "newConfirmationLink.explanation":
      "Lenken for å bekrefte e-postadressen din har gått ut. Be om en ny, så sendes den til adressen du registrerte deg med.",
    "newConfirmationLink.send": "Send meg en ny lenke",
    "newConfirmationLink.home": "Tilbake til {siteName}",
    "newConfirmationLink.signIn": "Logg inn",
    "newConfirmationLink.sent.title": "Sjekk e-posten din",
    "newConfirmationLink.sent.explanation":
      "En ny lenke er på vei. Følg den for å bekrefte e-postadressen din. Hvis ingenting kommer på noen minutter, se i søppelpostmappen.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Den e-postadressen er allerede bekreftet",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Det er ikke noe mer å bekrefte. Logg inn med passordet du oppga da du bekreftet den.",
    "newConfirmationLink.noLongerWorks.title":
      "Den lenken fungerer ikke lenger",
    "newConfirmationLink.noLongerWorks.explanation":
      "Sjekk at du fulgte hele lenken fra e-posten, uten at noe mangler på slutten av den. Hvis den fortsatt ikke fungerer, registrer deg på nytt, så sendes en ny lenke.",
    "newConfirmationLink.tooMany.title": "Prøv igjen senere",
    "newConfirmationLink.tooMany.explanation":
      "Flere lenker er sendt til denne adressen i det siste. Vent en time og be om en ny, og se i søppelpostmappen i mellomtiden.",

    "forgotPassword.title": "Glemt passordet ditt?",
    "forgotPassword.emailAddress": "E-postadresse",
    "forgotPassword.submit": "Send meg en vei inn igjen",
    "forgotPassword.home": "Tilbake til {siteName}",
    "forgotPassword.sent.title": "Sjekk e-posten din",
    "forgotPassword.sent.explanation":
      "Hvis den adressen har en konto, er en lenke for å lage et nytt passord på vei. Følg den innen en time. Hvis ingenting kommer på noen minutter, se i søppelpostmappen.",
    "forgotPassword.tryAgainLater":
      "Det er bedt om for mange veier inn igjen herfra i det siste. Vent en time og prøv igjen.",

    "setNewPassword.title": "Lag et nytt passord",
    "setNewPassword.password": "Passord",
    "setNewPassword.confirmPassword": "Bekreft passord",
    "setNewPassword.submit": "Lagre mitt nye passord",
    "setNewPassword.home": "Tilbake til {siteName}",
    "setNewPassword.signIn": "Logg inn",
    "setNewPassword.askAgain": "Be om en ny lenke",
    "setNewPassword.changed.title": "Passordet ditt er endret",
    "setNewPassword.changed.explanation":
      "Du er logget ut overalt der du var logget inn. Logg inn med det nye passordet ditt.",
    "setNewPassword.expired.title": "Den lenken har gått ut",
    "setNewPassword.expired.explanation":
      "En lenke for å lage et nytt passord fungerer i en time. Be om en ny, så sendes den til samme adresse.",
    "setNewPassword.noLongerWorks.title": "Den lenken fungerer ikke lenger",
    "setNewPassword.noLongerWorks.explanation":
      "Den kan allerede være brukt, eller noe kan mangle på slutten av den. Be om en ny hvis du fortsatt trenger en.",

    // Sies over feltene når sjekken mot lekkede passord ikke kan gjøres.
    "BreachedPasswords.Unreachable":
      "Passordet ditt kan ikke sjekkes akkurat nå, så det er ikke endret. Prøv igjen om noen minutter. Lenken din fungerer til den går ut.",

    "forgetAccount.title": "Glem kontoen din",
    "forgetAccount.explanation":
      "Navnet og e-postadressen din kan gjøres uleselige for godt, og kontoen din lukkes. For å være sikre på at det er deg sender vi først en lenke til kontoens adresse, og ingenting glemmes før du følger den.",
    "forgetAccount.submit": "Send meg lenken",
    "forgetAccount.sent.title": "Sjekk e-posten din",
    "forgetAccount.sent.explanation":
      "Vi har sendt en lenke til kontoens adresse. Den fungerer i 15 minutter, og bare mens du er logget inn på denne kontoen.",
    "forgetAccount.confirm.title": "Glemme kontoen din for godt?",
    "forgetAccount.confirm.explanation":
      "Når kontoen er glemt, kan navnet og e-postadressen din aldri leses igjen, av noen, og det går ikke an å logge inn på kontoen. Det kan ikke angres.",
    "forgetAccount.confirm.submit": "Glem kontoen min",
    "forgetAccount.forgotten.title": "Kontoen din er glemt",
    "forgetAccount.forgotten.explanation":
      "Navnet og e-postadressen din kan ikke lenger leses, og du er logget ut overalt der du var logget inn.",
    "forgetAccount.noLongerWorks.title": "Den lenken fungerer ikke lenger",
    "forgetAccount.noLongerWorks.explanation":
      "Den kan ha gått ut, allerede vært brukt, eller høre til en konto du ikke er logget inn på. Be om den på nytt fra kontoen din hvis du fortsatt vil at den skal glemmes.",
    "forgetAccount.lastAdministrator.title": "Kontoen din kan ikke glemmes",
    "forgetAccount.lastAdministrator.explanation":
      "Du er den eneste administratoren på dette nettstedet. Gi rollen Administrator til noen andre, så kan kontoen din glemmes.",
    "forgetAccount.askAgain": "Be om den på nytt",
    "forgetAccount.home": "Tilbake til {siteName}",

    "registrationsSuspended.title": "Registreringen er satt på pause foreløpig",
    "registrationsSuspended.explanation":
      "En tjeneste registreringen trenger kan ikke nås akkurat nå, så ingen kan registrere seg før den svarer igjen. Ingenting du skrev ble lagret.",
    "registrationsSuspended.tryAgainLater":
      "Prøv igjen om en liten stund. Nettstedets administrator er varslet.",
    "registrationsSuspended.home": "Tilbake til {siteName}",

    "signIn.title": "Logg inn",
    "signIn.emailAddress": "E-postadresse",
    "signIn.password": "Passord",
    "signIn.submit": "Logg inn",
    "signIn.forgotPassword": "Glemt passord?",
    "signIn.register": "Registrer deg",
    "signIn.withGoogle": "Logg inn med Google",
    "signIn.or": "eller",
    "signIn.tryAgainLater":
      "Det er gjort for mange forsøk i det siste. Vent en time og prøv igjen.",

    // Ett svar både på feil passord og på en adresse ingen har registrert.
    // Det sier verken hvilket av dem det var eller ikke var.
    "SignIn.Failed": "E-postadressen eller passordet er feil. Prøv igjen.",

    "profile.title": "Profil",
    // Kolonet etter en ledetekst hører til ledetekstens ord, siden språk
    // setter det ulikt.
    "profile.name": "Navn:",
    "profile.emailAddress": "E-postadresse:",

    "changeName.title": "Endre navn",
    "changeName.name": "Navn",
    "changeName.submit": "Endre navn",

    "setPassword.title": "Lag et passord",
    "setPassword.explanation":
      "Kontoen din har ikke noe passord: du logger inn med Google. For å kunne logge inn med passord også sender vi en lenke for å lage et til {emailAddress}.",
    "setPassword.submit": "Send meg en lenke",
    "setPassword.sent.title": "Sjekk e-posten din",
    "setPassword.sent.explanation":
      "Vi har sendt deg en lenke for å lage et passord. Den fungerer i en time.",
    "setPassword.profile": "Tilbake til profilen din",

    "changePassword.title": "Endre passord",
    "changePassword.currentPassword": "Nåværende passord",
    "changePassword.password": "Nytt passord",
    "changePassword.passwordConfirmation": "Bekreft passord",
    "changePassword.forgotPassword": "Glemt passord?",
    "changePassword.submit": "Endre passord",
    // Under det nåværende passordet, som det gjelder.
    "ChangePassword.WrongPassword": "Det er ikke passordet ditt.",

    "changeEmailAddress.title": "Endre e-postadresse",
    "changeEmailAddress.emailAddress": "Ny e-postadresse",
    "changeEmailAddress.currentPassword": "Nåværende passord",
    "changeEmailAddress.submit": "Send en lenke for å bekrefte",
    "changeEmailAddress.sent.title": "Sjekk e-posten din",
    "changeEmailAddress.sent.explanation":
      "En lenke for å bekrefte flyttingen er sendt til den nye e-postadressen. Følg den, innlogget, for å flytte kontoen din dit.",
    "changeEmailAddress.confirm.title": "Flytt kontoen din",
    "changeEmailAddress.confirm.explanation":
      "Kontoen din flyttes til {emailAddress}. Du logger inn med den adressen fra nå av.",
    "changeEmailAddress.confirm.submit": "Flytt kontoen min",
    "changeEmailAddress.noLongerWorks.title":
      "Denne lenken fungerer ikke lenger",
    "changeEmailAddress.noLongerWorks.explanation":
      "Den har gått ut, er brukt, eller ble ikke sendt for kontoen du er logget inn på. Be om den på nytt fra profilen din.",
    "changeEmailAddress.taken.title": "Kontoen din er ikke flyttet",
    "changeEmailAddress.profile": "Tilbake til profilen din",
    // Under feltet hver av dem gjelder.
    "ChangeEmailAddress.WrongPassword": "Det er ikke passordet ditt.",
    "ChangeEmailAddress.Unchanged": "Kontoen din har allerede denne adressen.",
    "ChangeEmailAddress.Taken":
      "Den e-postadressen har fått en egen konto nå, så din kan ikke flyttes dit.",

    "confirmEmailAddress.title": "Bekreft e-postadressen din",
    "confirmEmailAddress.name": "Navn",
    "confirmEmailAddress.password": "Passord",
    "confirmEmailAddress.confirmPassword": "Bekreft passord",
    "confirmEmailAddress.submit": "Bekreft e-postadressen min",
    "confirmEmailAddress.signIn": "Logg inn",
    "confirmEmailAddress.home": "Tilbake til {siteName}",
    "confirmEmailAddress.confirmed.title": "E-postadressen din er bekreftet",
    "confirmEmailAddress.confirmed.explanation":
      "Kontoen din er klar. Logg inn med e-postadressen og passordet du nettopp oppga.",
    "confirmEmailAddress.expired.title": "Den lenken har gått ut",
    "confirmEmailAddress.expired.explanation":
      "En lenke for å bekrefte en e-postadresse fungerer i 24 timer. Be om en ny, så sendes den til samme adresse.",
    "confirmEmailAddress.expired.newLink": "Send meg en ny lenke",
    "confirmEmailAddress.noLongerWorks.title":
      "Den lenken fungerer ikke lenger",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Sjekk at du fulgte hele lenken fra e-posten, uten at noe mangler på slutten av den. Hvis den fortsatt ikke fungerer, registrer deg på nytt, så sendes en ny lenke.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Den e-postadressen er allerede bekreftet",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Det er ikke noe mer å gjøre. Logg inn med passordet du oppga da du bekreftet den.",

    // En regel som er brutt, med kode som nøkkel, så hvert skjema som sier den
    // sier den på samme måte. Sagt til den som skrev den, under feltet den
    // leses fra.
    "PersonName.Missing": "Skriv inn et navn.",
    "PersonName.TooShort": "Et navn må ha minst 3 tegn.",
    "PersonName.TooLong": "Et navn kan ha høyst 254 tegn.",
    "WorldRankingName.TooShort": "Et verdensrangeringsnavn må ha minst 3 tegn.",
    "WorldRankingName.TooLong":
      "Et verdensrangeringsnavn kan ha høyst 254 tegn.",
    "Password.Missing": "Skriv inn et passord.",
    "Password.TooShort": "Et passord må ha minst 12 tegn.",
    "Password.ConfirmationDiffers":
      "Dette er ikke det samme som passordet ovenfor. Skriv det inn på nytt.",
    "Password.Breached":
      "Dette passordet har dukket opp i en datalekkasje et annet sted, så det er ikke trygt å bruke her. Velg et annet.",

    "javaScriptRequired.title": "Skripting trengs",
    "javaScriptRequired.explanation":
      "Registreringen trenger at skripting er slått på for dette nettstedet, slik at det kan sjekke at den som registrerer seg er et menneske. Slå det på, og registrer deg så på nytt.",
    "javaScriptRequired.register": "Tilbake til registreringen",
    "javaScriptRequired.home": "Tilbake til {siteName}",

    "errors.backHome": "Tilbake til {siteName}",
    "errors.notFound": "Ikke funnet",
    "errors.refused": "Det lot seg ikke gjøre",
    "errors.refusedDetail": "Noe i det som ble sendt stemte ikke.",
    "errors.sorry": "Beklager",
    "errors.sorryDetail": "Den forespørselen kunne ikke behandles.",
    "errors.failed": "Noe gikk galt",
    "errors.reference": "Referanse {reference}.",
    "errors.recorded":
      "Feilen er logget og en e-post er sendt til administratoren. Det hjelper å sende administratoren en e-post med referansen og en beskrivelse av hva du holdt på med.",
    "errors.message": "Send e-post til administratoren",
    "errors.messageSubject": "Feil {reference} på {siteName}",
    "errors.messageBody": "Dette holdt jeg på med da det skjedde:\n\n",
    "errors.unavailable": "Nettstedet er utilgjengelig",
    "errors.unavailableDetail":
      "Nettstedet når ikke det det trenger akkurat nå. Prøv igjen senere.",
    "errors.maintenance": "Nettstedet er nede for vedlikehold.",
    "errors.maintenanceMinutes": "Det ventes tilbake om {minutes} minutter.",
    "errors.maintenanceMinute": "Det ventes tilbake om 1 minutt.",
    "errors.maintenanceLonger":
      "Det tar lengre tid enn ventet og er snart tilbake.",

    // Hjemmesidens to lister, hva hver sier når den er tom, og veien under
    // dem til alle turneringer i år.
    "home.recentResults": "Siste resultater",
    "home.recentResults.none": "Ingen partier er lagt til de siste sju dagene.",
    "home.upcomingTournaments": "Kommende turneringer",
    "home.upcomingTournaments.none":
      "Ingen turneringer starter de neste seksti dagene.",
    "home.allTournaments": "Alle turneringer i {year}",
    // Et års side: overskriften.
    "meta.description":
      "Poeng, resultater og rangeringer fra turneringer på {siteName}.",
    "year.heading": "Turneringer i {year}",
    // Månedene på et års side, som lastes når de trykkes på.
    "year.needsScripting":
      "Månedene i et år åpnes med skripting, som er slått av. Slå det på for dette nettstedet.",
    "year.showAll": "Vis alle",
    "year.hideAll": "Skjul alle",
    "year.monthNone": "Ingen turneringer starter i {month} {year}.",
    "year.monthFailed": "Turneringene kunne ikke lastes. Prøv igjen.",
    // En idretts side i et år: det samme, for idretten alene.
    "yearSport.heading": "{sport}-turneringer i {year}",
    "yearSport.monthNone":
      "Ingen {sport}-turneringer starter i {month} {year}.",
    // En turnerings side: avsnittene, hva den sier om et parti, hvor lenge
    // siden et ble lagt til, og hva den sier når den ikke har noen.
    "tournament.recent": "Siste",
    "tournament.summary": "Sammendrag",
    // Sammendraget for en lagturnering: tabellens grupper og kolonner.
    // En tests rutenett: hva hver kamp er best av, ordet mellom lagene, og
    // summene under kampene.
    "test.bestOf": "Hver kamp er best av {count}.",
    "test.vs": "mot",
    "test.matches": "Kamper",
    "test.games": "Partier",
    "test.hoops": "Buer",
    "teamSummary.tests": "Tester",
    "teamSummary.matches": "Kamper",
    "teamSummary.games": "Partier",
    "teamSummary.hoops": "Buer",
    "teamSummary.wins": "Seiere",
    "teamSummary.losses": "Tap",
    "teamSummary.draws": "Uavgjort",
    "teamSummary.for": "For",
    "teamSummary.against": "Mot",
    "teamSummary.net": "Netto",
    "tournament.players": "Spillere",
    "search.label": "Søk",
    "search.tournaments": "Turneringer",
    "search.competitions": "Konkurranser",
    "search.nothingFound": "Ingenting ble funnet.",
    "players.search.label": "Søk etter spillere",
    "players.search.prompt": "Skriv en spillers navn for å finne dem.",
    "players.search.none": "Ingen spillere ble funnet.",
    "search.more":
      "Bare de første {count} vises. Skriv mer av navnet for å begrense søket.",
    "websitePlayer.tournament": "Turnering",
    // En test i en turnerings avsnitt: de to lagenes korte navn.
    "tournament.test": "{first} mot {second}",
    "tournament.notes": "Notater",
    "tournament.commentary": "Kommentar",
    "tournament.beat": "slo",
    "tournament.drewWith": "spilte uavgjort mot",
    "tournament.ago.seconds": "{count} sek",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 time",
    "tournament.ago.hours": "{count} timer",
    "tournament.none": "Ingen partier er spilt ennå.",
    // En turnerings spillerside, når den ikke har noen.
    "players.none": "Ingen spillere er lagt til ennå.",
    // En turnerings kommentarside, i det gamle nettstedets ord: hvordan en
    // kommentar vises i listen, og lenken for å starte en.
    "commentaries.by": "av",
    "commentaries.start": "Start ny kommentar",
    // Siden som starter en kommentar.
    "startCommentary.title": "Start ny kommentar",
    "startCommentary.titleField": "Tittel",
    "startCommentary.submit": "Start kommentar",
    // «Ny» sies til en skjermleser i stedet for den røde stjernen som merker
    // et notat eller en kommentar som ikke er lest slik den er nå.
    "marks.new": "ny",
    // En turnerings Notater-side, og et notats egen side.
    // Siden har overskriften Lederens notater, mens avsnittet i linjen er
    // Notater (tournament.notes), som er alt rommet det er der.
    "notes.heading": "Lederens notater",
    "notes.none": "Ingen notater ennå.",
    "note.edited": "redigert",
    // En kommentars side: hva den sier når den ikke har noen innlegg, hva den
    // sier om et innlegg, og boksen skribenten skriver det neste i.
    "commentary.none": "Ingen innlegg er skrevet ennå.",
    "commentary.edited": "redigert",
    "commentary.edit": "Rediger",
    "commentary.delete": "Slett",
    "commentary.comment": "Innlegg",
    "commentary.add": "Legg til innlegg",
    "commentary.notSent":
      "Innlegget kunne ikke sendes. Last siden på nytt for å se om det ble lagret.",
    // Siden som endrer en kommentars tittel.
    "changeCommentaryTitle.title": "Endre tittel",
    "changeCommentaryTitle.submit": "Lagre",
    // Et innleggs egen side, der skribenten redigerer eller sletter det, og
    // siden som spør før det slettes.
    "editComment.title": "Rediger innlegg",
    "editComment.save": "Lagre",
    "deleteComment.title": "Slett innlegg",
    "deleteComment.question": "Slette dette innlegget? Det kan ikke angres.",
    "deleteComment.confirm": "Slett innlegg",
    "deleteComment.keep": "Behold det",
    // En spillers side: de to delene, hvordan et parti sies slik spilleren
    // spilte det, og hva hver del sier når den er tom.
    "player.games": "Partier",
    "player.competitions": "Konkurranser",
    "player.beat": "slo",
    "player.lostTo": "tapte mot",
    "player.drewWith": "spilte uavgjort mot",
    "player.score": "{score} mot {opponent}",
    "player.noGames": "Ingen partier er spilt ennå.",
    "player.noCompetitions": "Ikke påmeldt noen konkurranse ennå.",
    // En blokks side: rutenettets summer, hva et resultat er for radens
    // spiller, sagt høyt heller enn vist, og en spiller som har trukket seg.
    "block.wins": "Seiere",
    "block.matches": "Kamper",
    "block.netGames": "Nettopartier",
    "block.games": "Partier",
    "block.netHoops": "Nettobuer",
    "block.won": "vant",
    "block.lost": "tapte",
    "block.drawn": "uavgjort",
    "block.withdrawn": "trukket",
    // Et parti som er trukket, som spansk sier annerledes enn en spiller.
    "block.gameWithdrawn": "trukket",
    "block.losses": "Tap",
    // Plasseringskolonnen i enden av en blokks rutenett, sammendrag og
    // utskrift, og hva som sies under hver om hvordan spillere likt på vunne
    // kamper skilles. Nettobuer kommer først i den andre, for en blokk der
    // kampene er ett enkelt parti, hvor nettopartier bare ville si det samme
    // som seiere.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Uavgjort avgjøres av nettopartier, så nettobuer, så hvem som slo hvem.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Uavgjort avgjøres av nettobuer, så hvem som slo hvem.",
    "block.tieBreak.whoBeatWho": "Uavgjort avgjøres av hvem som slo hvem.",
    "block.tieBreak.other":
      "Det finnes ingen kjent metode for å avgjøre uavgjort.",
    // De tre visningene av en blokk, tilbudt under overskriften.
    "competition.views": "Visninger",
    "competition.view.grid": "Rutenett",
    "competition.view.summary": "Sammendrag",
    "competition.view.orderOfPlay": "Spilleorden",
    "competition.print": "Skriv ut",
    "competition.playedTo": "Spilt til {hoops} buer",
    "blockSummary.ranking":
      "Rangert etter andelen vunne kamper. En turnerings egne reglement kan plassere spillerne annerledes.",
    "orderOfPlay.none": "Ingen partier er spilt ennå.",
    "orderOfPlay.column.game": "Parti",
    "orderOfPlay.column.date": "Dato",
    // En utslagnings runder, navngitt som det gamle nettstedet navnga dem,
    // talt bakover fra den siste, og en bye tegnet i stedet for en spiller.
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Semifinaler",
    "knockout.round.quarters": "Kvartfinaler",
    "knockout.round.number": "Runde {number}",
    "knockout.bye": "Bye",
    // En sveitsisk tabell: hva hver spiller har spilt og vunnet, og
    // resultatene deres.
    "swiss.games": "Partier",
    "swiss.wins": "Seiere",
    "swiss.winShare": "Seiers-%",
    "swiss.results": "Resultater",
    // Pilene som ruller en utslagnings rutenett bort til finalen, og tilbake
    // til første runde.
    "knockout.onward": "Senere runder",
    "knockout.back": "Tidligere runder",
    // Det alle turneringslister har felles, på hjemmesiden og på et års side:
    // kolonnene hver er en tabell av, og det som begrenser dem.
    "tournamentList.column.date": "Dato",
    "tournamentList.column.name": "Navn",
    // Et flagg, som begrenser listene til landet sitt, navngitt etter hva det
    // gjør.
    "tournamentList.onlyIn": "Bare turneringer i {country}",
    "tournamentList.usualOrder": "Tilbake til vanlig rekkefølge",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Alle land",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Alle regioner",
    "tournamentList.filter.noRegionsBefore":
      "Turneringer før november 2026 har ikke regioner.",
    "tournamentList.filter.sport": "Idrett",
    "tournamentList.filter.anySport": "Alle idretter",
    "tournamentList.filter.submit": "Filtrer",
    "tournamentList.filter.from": "Fra",
    "tournamentList.filter.to": "Til",
    "tournamentsInDays.heading": "Turneringer fra {from} til {to}",
    "tournamentsInDays.headingAll": "Turneringer",
    "tournamentsInDays.none": "Ingen turneringer starter i disse dagene.",
    "tournamentsInDays.previous": "Forrige",
    "tournamentsInDays.next": "Neste",
    "tournamentsInDays.page": "Side {page} av {last}",
    // Årene det er turneringer i, den sekundære navigasjonen for begge.
    "years.label": "År",
    // Nedtrekkslisten med årene som ikke får plass som faner.
    "years.earlier": "Tidligere år",

    // Adminens ord. Admin tegner dem i nettleseren, så tjeneren sier dem inn
    // på siden når den sender den (adminPage.ts): disse, og turneringens
    // avslag nedenfor.
    "admin.newerBuild.message":
      "En nyere versjon av dette nettstedet er tilgjengelig.",
    "admin.newerBuild.reload": "Last på nytt",
    "admin.title": "Admin",
    "admin.tournaments.new": "Ny turnering",
    "admin.tournaments.none": "Ingen turneringer",
    "admin.tournaments.filter.none": "Ingen turneringer passer",
    "admin.tournaments.show": "Vis",
    "admin.tournaments.managerScorer": "Leder/Poengfører",
    "admin.tournaments.worldRanking": "Verdensrangering",
    "admin.tournaments.notWorldRanking": "Ikke verdensrangering",
    // Sagt til en skjermleser, siden en strek gjennom et navn ikke leses opp.
    "admin.tournaments.archived": "Arkivert",
    "admin.tournaments.manage": "Administrer",
    "admin.tournaments.edit": "Rediger",
    "admin.tournaments.archive": "Arkiver",
    "admin.tournaments.restore": "Gjenopprett",
    "admin.tournaments.scores": "Resultater",
    "admin.tournaments.players": "Spillere",
    "admin.years.label": "År",
    // Hva nedtrekkslisten med år sier mens året som er valgt er en fane.
    "admin.years.earlier": "Tidligere år",
    "admin.tournament.name": "Navn",
    "admin.tournament.starts": "Starter",
    "admin.tournament.finishes": "Slutter",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Idrett",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Undertittel",
    "admin.rules.handicap": "Spilles med handicap",
    "admin.rules.drawsAllowed": "Tillater uavgjort",
    "admin.tournament.levelTestsDrawn": "Like tester er uavgjort",
    "admin.rules.worldRankings": "Teller med i verdensrangeringene",
    "admin.rules.maximumHoops": "Maksimalt antall buer",
    "admin.tournament.national": "Arrangement på nasjonalt nivå",
    "admin.tournament.international": "Arrangement på internasjonalt nivå",
    "admin.tournament.optional": "Valgfritt",
    // Et avslag uten egne ord, over feltene.
    "admin.tournament.otherwise": "Dette kan ikke godtas som det er.",
    "admin.newTournament.title": "Ny turnering",
    "admin.newTournament.submit": "Opprett turnering",
    "admin.editTournament.title": "Rediger turnering",
    "admin.editTournament.submit": "Oppdater turnering",
    // Sagt i stedet for skjemaet, for et avslag uten egne ord.
    "admin.editTournament.otherwise": "Denne turneringen kan ikke endres.",
    // En turnerings side, og fanene det som skal drives ligger i.
    "admin.view.tabs": "Turnering",
    "admin.view.players": "Spillere",
    "admin.view.competitions": "Konkurranser",
    "admin.view.managers": "Ledere",
    "admin.view.notes": "Notater",
    "admin.view.scorers": "Poengførere",
    "admin.view.rankings": "Rangeringer",
    "admin.rankings.file":
      "Verdensrangeringene bruker turneringens resultater gjennom denne funksjonen, så lederne trenger ikke gjøre noe.",
    "admin.rankings.download": "Last ned partier til verdensrangering",
    "rankings.notAvailable": "Rangeringer er ikke tilgjengelige",
    "rankings.notAvailable.sport":
      "Denne turneringens idrett har ingen verdensrangeringer, så det er ingen rangeringer å sende.",
    "rankings.notAvailable.notCounted":
      "Ingen av denne turneringens konkurranser teller med i verdensrangeringene.",
    // Sagt i stedet for fanene, for et avslag uten egne ord.
    "admin.view.otherwise": "Denne turneringen kan ikke drives herfra.",
    // En konkurranses side, og fanene det som skal drives ligger i.
    "admin.competitionView.tabs": "Konkurranse",
    "admin.competitionView.players": "Spillere",
    "admin.competitionView.scores": "Resultater",
    "admin.competitionView.losers": "Tapere",
    "admin.losers.add": "Legg til taperutslagning",
    "admin.losers.round": "Tapere av",
    "admin.losers.option": "{round} ({count} tapere)",
    "admin.losers.name": "Navn på taperutslagning",
    "admin.losers.none": "Ingen taperutslagninger.",
    "admin.losers.noRounds":
      "Denne utslagningen har ingen runde hvis tapere kunne spille videre.",
    "admin.losers.remove": "Fjern",
    "admin.losers.readOnly":
      "Spillerne i denne utslagningen er taperne fra en annen utslagning, satt inn her etter hvert som hver kamp avgjøres.",
    "admin.hover.losers.add":
      "Legg til en utslagning for taperne av en av denne utslagningens runder",
    "Tournament.NoSuchRound":
      "Utslagningen har ingen slik runde som sender tapere videre.",
    "Tournament.KnockoutHasLosersKnockouts":
      "En annen utslagning tar taperne fra denne, så plassene i den kan ikke endres.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "En annen utslagning i bruk tar taperne fra denne, så arkiver den først.",
    "Tournament.LosersKnockoutSourceArchived":
      "Denne taperutslagningen tar taperne fra en utslagning som er arkivert, så gjenopprett den først.",
    "Tournament.LosersKnockoutPlacesFixed":
      "En taperutslagning har like mange plasser som runden den tar tapere fra har kamper.",
    "Competition.PlayersSetAutomatically":
      "Spillerne i en taperutslagning settes inn etter hvert som kamper avgjøres, ikke for hånd.",
    // Avsnittslinjen på en turnerings side og dens konkurransers sider.
    "admin.sections.label": "Turneringen og dens konkurranser",
    "admin.sections.tournament": "Turnering",
    // Avsnittslinjen på administratorens sider.
    "admin.administrator.sections.label": "Administratorens sider",
    "admin.administrator.sections.tournaments": "Turneringer",
    "admin.administrator.sections.accounts": "Kontoer",
    "admin.administrator.sections.worldRankings": "Verdensrangeringer",
    "admin.administrator.sections.importErrors": "Importfeil",
    "admin.administrator.sections.logs": "Logger",
    "admin.administrator.sections.databaseStatus": "Databasetilgang",
    "admin.administrator.sections.countries": "Land",
    "admin.databaseStatus.title": "Databasetilgang",
    "admin.databaseStatus.on": "Databasetilgangen er på.",
    "admin.databaseStatus.off": "Databasetilgangen er av.",
    "admin.databaseStatus.expected":
      "Nettstedet ventes tilbake om {minutes} minutter.",
    "admin.databaseStatus.expectedOne":
      "Nettstedet ventes tilbake om 1 minutt.",
    "admin.databaseStatus.longer": "Det tar lengre tid enn ventet.",
    "admin.databaseStatus.told": "Leserne får beskjed: {words}",
    "admin.databaseStatus.toldUsual": "Leserne får den vanlige setningen.",
    "admin.databaseStatus.minutes": "Forventede minutter",
    "admin.databaseStatus.words": "Ord til leserne",
    "admin.databaseStatus.turnOff": "Slå av",
    "admin.databaseStatus.change": "Endre",
    "admin.databaseStatus.turnOn": "Slå på",
    "admin.databaseStatus.minutesNeeded": "Minuttene trengs.",
    "admin.databaseStatus.otherwise": "Noe gikk galt på nettstedet.",
    "DatabaseAccess.MinutesNotWhole": "Minuttene må være et helt tall.",
    "DatabaseAccess.MinutesOutOfRange": "Minuttene må være fra 1 til 1440.",
    "DatabaseAccess.WordsTooLong": "Ordene kan ikke være mer enn 500 tegn.",
    "DatabaseAccess.NotOff": "Databasetilgangen er ikke av.",
    "admin.administrator.title": "Administrator",
    // Kontosiden, et avsnitt for hver rolle.
    "admin.accounts.title": "Kontoer",
    "admin.roles.add": "Legg til",
    "admin.roles.administrator.heading": "Administratorer",
    "admin.roles.administrator.none": "Ingen andre administratorer",
    "admin.roles.administrator.removeTitle": "Fjern administrator",
    "admin.roles.administrator.removeExplanation":
      "{name} er ikke lenger administrator for dette nettstedet.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Verdensrangeringsansvarlige for Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Ingen verdensrangeringsansvarlige for Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Fjern verdensrangeringsansvarlig for Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} er ikke lenger verdensrangeringsansvarlig for Association Croquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Verdensrangeringsansvarlige for Golfcroquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Ingen verdensrangeringsansvarlige for Golfcroquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Fjern verdensrangeringsansvarlig for Golfcroquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} er ikke lenger verdensrangeringsansvarlig for Golfcroquet.",
    // For et avslag uten egne ord, under feltet eller i stedet for listen.
    // Ikke om adressen, siden det kan være økten som tok slutt eller
    // nettstedet som sviktet.
    // Siden der verdensrangeringens spillere importeres, og loggen dens, en
    // linje for hver ting importen sier. Et antall sies etter et kolon, så
    // én spiller og mange sies på samme måte.
    "admin.worldRankings.title": "Importer verdensrangeringens spillere",
    "admin.worldRankings.import": "Importer",
    "admin.worldRankings.log": "Slik gikk importen",
    "admin.worldRankings.ac.reading": "Leser listen for association croquet",
    "admin.worldRankings.ac.read":
      "Association croquet-spillere lest: {players}",
    "admin.worldRankings.ac.kept":
      "Association croquet-spillere beholdt: {players}",
    "admin.worldRankings.ac.refused":
      "Listen for association croquet kunne ikke leses, så spillerne ble latt stå som de var.",
    "admin.worldRankings.gc.reading": "Leser listen for golfcroquet",
    "admin.worldRankings.gc.read": "Golfcroquet-spillere lest: {players}",
    "admin.worldRankings.gc.kept": "Golfcroquet-spillere beholdt: {players}",
    "admin.worldRankings.gc.refused":
      "Listen for golfcroquet kunne ikke leses, så spillerne ble latt stå som de var.",
    "admin.worldRankings.finished": "Ferdig",
    "admin.worldRankings.failed": "Importen ble ikke ferdig.",
    // For et avslag uten egne ord, som en svikt hos nettstedet.
    "admin.worldRankings.otherwise": "Noe gikk galt på nettstedet.",
    "WorldRankingLists.Unreachable":
      "Verdensrangeringenes nettsted kunne ikke nås.",
    "WorldRankingLists.Unreadable":
      "Listen er ikke lagt opp slik verdensrangeringene legger opp sine: en linje i den kunne ikke leses, den har ingen på seg, eller den er ikke skrevet i UTF-8.",
    // Dokumentene importen fra de gamle nettstedene avviste, og siden til ett.
    "admin.importErrors.title": "Importfeil",
    "admin.importErrors.none": "Ingen importfeil",
    "admin.importErrors.otherwise": "Noe gikk galt på nettstedet.",
    "admin.countries.title": "Land",
    "admin.countries.none":
      "Ingen turnering spilles i et land listene ikke navngir",
    "admin.countries.oldSite": "Gammelt nettsted",
    "admin.countries.otherwise": "Noe gikk galt på nettstedet.",
    "admin.logs.title": "Logger",
    "admin.logs.severity": "Alvorlighetsgrad",
    "admin.logs.text": "Slå opp",
    "admin.logs.show": "Vis",
    "admin.logs.prune": "Rydd",
    "admin.logs.pruneAsk":
      "Fjerne loggen fra før den siste timen? Ingenting henter den tilbake.",
    "admin.logs.removed": "{count} oppføringer ble fjernet",
    "admin.logs.none": "Ingen loggoppføringer",
    "admin.logs.otherwise": "Noe gikk galt på nettstedet.",
    "admin.hover.logs.show": "Vis oppføringene som passer",
    "admin.hover.logs.prune": "Fjern loggen fra før den siste timen",
    "admin.hover.logs.pruneAgree": "Fjern loggen fra før den siste timen",
    "admin.importError.title": "Importfeil",
    "admin.importError.documentId": "Dokument-ID",
    "admin.importError.tournament": "Turnering",
    "admin.importError.competition": "Konkurranse",
    "admin.importError.newSite": "Nytt nettsted",
    "admin.importError.oldSite": "Gammelt nettsted",
    "ImportErrorKept.NotFound":
      "Importen beholdt ingen feil for det dokumentet.",
    "admin.competitionView.otherwise":
      "Denne konkurransen kan ikke drives herfra.",
    // Konkurranser-fanen: hver konkurranses slag, hva som kan gjøres med den,
    // og overskriften de arkiverte står under.
    "admin.competitions.block": "Blokk",
    "admin.competitions.knockout": "Utslagning",
    "admin.competitions.swiss": "Sveitsisk",
    "admin.competitions.view": "Vis",
    "admin.competitions.edit": "Rediger",
    "admin.competitions.up": "Opp",
    "admin.competitions.down": "Ned",
    "admin.competitions.archive": "Arkiver",
    "admin.competitions.restore": "Gjenopprett",
    "admin.competitions.archived": "Arkiverte konkurranser",
    "admin.competitions.none": "Ingen konkurranser",
    "admin.competitions.add": "Legg til konkurranse",
    // Konkurransedialogen.
    "admin.competition.addTitle": "Legg til konkurranse",
    "admin.competition.editTitle": "Rediger konkurranse",
    "admin.competition.name": "Navn",
    "admin.competition.kind": "Slag",
    "admin.competition.bestOf": "Best av",
    "admin.competition.rounds": "Runder",
    "admin.competition.tieBreaks": "Uavgjortregler",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Nettopartier, så nettobuer, så hvem som slo hvem",
    "admin.competition.tieBreak.who-beat-who": "Hvem som slo hvem",
    "admin.competition.tieBreak.other": "Annet",
    "admin.competition.places": "Plasser",
    "admin.competition.round": "Runde {number}",
    "admin.competition.bestOfs": "Best av for hver runde",
    "admin.competition.quarters": "Kvartfinaler",
    "admin.competition.semis": "Semifinaler",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Legg til",
    "admin.competition.save": "Lagre",
    "admin.competition.added": "{name} ble lagt til.",
    // Over feltene, for et avslag uten egne ord.
    "admin.competition.otherwise":
      "Denne konkurransen kan ikke beholdes som den er.",
    "CompetitionName.Missing": "Skriv inn et navn.",
    "CompetitionName.TooLong": "Et navn kan ha høyst 254 tegn.",
    "CompetitionName.NoLetterOrDigit":
      "Et navn trenger en bokstav eller et siffer.",
    "Tournament.KnockoutPlayerHasGames":
      "Spillere i denne trekningen har partier, så plassene kan ikke endres.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "En runde med en avgjort kamp kan ikke gjøres til en kortere best av.",
    "Tournament.KnockoutLaterRoundHasGames":
      "En runde kan ikke endres når det er spilt et parti i en senere runde.",
    "Tournament.CompetitionNameTaken":
      "En annen konkurranse i denne turneringen har allerede det navnet.",
    "Tournament.MaximumHoopsInvalid":
      "Skriv et helt antall buer, minst 1, eller la det stå tomt for ingen grense.",
    "BestOf.NotWhole": "Skriv et helt antall partier.",
    "BestOf.TooSmall": "En kamp må være best av minst 1 parti.",
    "Rounds.NotWhole": "Skriv et helt antall runder.",
    "Rounds.TooSmall": "En blokk må spilles over minst 1 runde.",
    "KnockoutDraw.EvenBestOf":
      "En kamp i en utslagning må ha en vinner, så den er best av et oddetall partier.",
    // Hver modal dialogs vei ut, siden siden under ikke kan nås.
    "admin.hover.tournaments.new": "Opprett en ny turnering",
    "admin.hover.tournaments.manage":
      "Administrer denne turneringens spillere, lag, konkurranser og resultater",
    "admin.hover.tournaments.edit": "Endre denne turneringens detaljer",
    "admin.hover.tournaments.scores": "Skriv inn denne turneringens resultater",
    "admin.hover.tournaments.players": "Ta vare på denne turneringens spillere",
    "admin.hover.competitions.view":
      "Åpne denne konkurransen for å se og skrive inn spillerne og resultatene i den",
    "admin.hover.tests.view":
      "Åpne denne testen for å se og skrive inn resultatene i den",
    "admin.hover.teams.view":
      "Åpne dette laget for å se og administrere spillerne i det",
    "admin.hover.dialog.player.add": "Legg til denne spilleren i turneringen",
    "admin.hover.dialog.player.save": "Behold endringene for denne spilleren",
    "admin.hover.dialog.team.add": "Legg til dette laget i turneringen",
    "admin.hover.dialog.team.save": "Behold endringene for dette laget",
    "admin.hover.dialog.test.add": "Legg til denne testen i turneringen",
    "admin.hover.dialog.test.save": "Behold endringene for denne testen",
    "admin.hover.dialog.competition.add":
      "Legg til denne konkurransen i turneringen",
    "admin.hover.dialog.competition.save":
      "Behold endringene for denne konkurransen",
    "admin.hover.dialog.score.add": "Legg til dette resultatet i konkurransen",
    "admin.hover.dialog.score.save": "Behold rettelsen av dette resultatet",
    "admin.hover.dialog.carryForward.save":
      "Før denne spillerens resultater videre",
    "admin.hover.dialog.tournament.new": "Opprett denne turneringen",
    "admin.hover.dialog.tournament.edit":
      "Behold endringene for denne turneringen",
    "admin.hover.modal.cancel": "Lukk dette uten å beholde noe",
    "admin.hover.modal.ok": "Lukk denne meldingen",
    "admin.hover.tab": "Vis fanen {name}",
    "admin.hover.tournaments.archive":
      "Arkiver denne turneringen; den kan gjenopprettes",
    "admin.hover.tournaments.restore":
      "Hent denne arkiverte turneringen tilbake",
    "admin.hover.players.add": "Legg til en spiller i denne turneringen",
    "admin.hover.players.addMany":
      "Legg til flere spillere i denne turneringen på én gang",
    "admin.hover.dialog.players.add": "Legg til disse spillerne i turneringen",
    "admin.hover.players.edit": "Endre denne spillerens detaljer",
    "admin.hover.players.up": "Flytt denne spilleren opp i listen",
    "admin.hover.players.down": "Flytt denne spilleren ned i listen",
    "admin.hover.players.archive":
      "Arkiver denne spilleren; de kan gjenopprettes",
    "admin.hover.players.restore": "Hent denne arkiverte spilleren tilbake",
    "admin.hover.teams.add": "Legg til et lag i denne turneringen",
    "admin.hover.teams.edit": "Endre dette lagets detaljer",
    "admin.hover.teams.up": "Flytt dette laget opp i listen",
    "admin.hover.teams.down": "Flytt dette laget ned i listen",
    "admin.hover.teams.archive": "Arkiver dette laget; det kan gjenopprettes",
    "admin.hover.teams.restore": "Hent dette arkiverte laget tilbake",
    "admin.hover.competitions.add":
      "Legg til en konkurranse i denne turneringen",
    "admin.hover.competitions.edit": "Endre denne konkurransens detaljer",
    "admin.hover.competitions.up": "Flytt denne konkurransen opp i listen",
    "admin.hover.competitions.down": "Flytt denne konkurransen ned i listen",
    "admin.hover.competitions.archive":
      "Arkiver denne konkurransen; den kan gjenopprettes",
    "admin.hover.competitions.restore":
      "Hent denne arkiverte konkurransen tilbake",
    "admin.hover.tests.add": "Legg til en test mellom to lag",
    "admin.hover.tests.edit": "Endre denne testens detaljer",
    "admin.hover.tests.up": "Flytt denne testen opp i listen",
    "admin.hover.tests.down": "Flytt denne testen ned i listen",
    "admin.hover.tests.archive": "Arkiver denne testen; den kan gjenopprettes",
    "admin.hover.tests.restore": "Hent denne arkiverte testen tilbake",
    "admin.hover.tests.toTeams":
      "Gå til Lag-fanen for å legge til lagene en test trenger",
    "admin.hover.scores.add":
      "Legg til et partis resultat i denne konkurransen",
    "admin.hover.scores.edit": "Rett dette resultatet",
    "admin.hover.scores.archive":
      "Arkiver dette resultatet slik at det slutter å telle; det kan gjenopprettes",
    "admin.hover.scores.restore":
      "Hent dette arkiverte resultatet tilbake, slik at det teller igjen",
    "admin.hover.scores.withdraw":
      "Behold dette resultatet i listen, men la det slutte å telle",
    "admin.hover.scores.unwithdraw": "La dette trukne resultatet telle igjen",
    "admin.hover.scores.up": "Flytt dette resultatet tidligere i listen",
    "admin.hover.scores.down": "Flytt dette resultatet senere i listen",
    "admin.hover.competitionPlayers.add":
      "Sett den valgte spilleren inn i denne konkurransen",
    "admin.hover.competitionPlayers.up": "Flytt denne spilleren opp i listen",
    "admin.hover.competitionPlayers.down": "Flytt denne spilleren ned i listen",
    "admin.hover.competitionPlayers.remove":
      "Ta denne spilleren ut av konkurransen",
    "admin.hover.competitionPlayers.withdraw":
      "Trekk denne spilleren fra konkurransen",
    "admin.hover.competitionPlayers.unwithdraw":
      "Sett denne trukne spilleren tilbake i konkurransen",
    "admin.hover.competitionPlayers.carryForward":
      "Før denne spillerens resultater videre fra en annen konkurranse",
    "admin.hover.notes.add": "Skriv et nytt notat for denne turneringen",
    "admin.hover.notes.edit": "Endre dette notatet",
    "admin.hover.notes.delete": "Slett dette notatet",
    "admin.hover.note.add": "Behold dette notatet og legg det til turneringen",
    "admin.hover.note.save": "Behold endringene for dette notatet",
    "admin.hover.people.add": "Gi denne personen rollen",
    "admin.hover.people.remove": "Ta rollen fra denne personen",
    "admin.hover.worldRankings.import":
      "Hent verdensrangeringene og legg til spillerne deres",
    "admin.modal.cancel": "Avbryt",
    // Den ene knappen i en modal dialog som bare forteller leseren noe.
    "admin.modal.ok": "OK",
    // Lederne- og Poengførere-fanene, som hver gjør noen til det med
    // e-postadressen deres og tar en bort.
    "admin.people.emailAddress": "E-postadresse",
    "admin.people.remove": "Fjern",
    "admin.people.otherwise": "Det lot seg ikke gjøre.",
    // Ved siden av leserens eget navn blant lederne.
    "admin.managers.you": "Du",
    "admin.managers.add": "Legg til leder",
    "admin.managers.email": "Send e-post til lederne",
    // Sies aldri, siden en turnering alltid har en leder, men en liste sier
    // det den sier når den er tom.
    "admin.managers.none": "Ingen ledere",
    "admin.managers.removeTitle": "Fjern leder",
    "admin.managers.removeExplanation":
      "{name} kan ikke lenger drive denne turneringen.",
    "admin.managers.removeYourself.explanation":
      "Du kan ikke lenger drive denne turneringen, og ingen her kan angre det for deg. En annen leder kan gjøre deg til leder igjen.",
    "admin.managers.otherwise": "Den adressen kan ikke gjøres til leder.",
    // Spillere-fanen.
    // En konkurranses Spillere-fane.
    "admin.competitionPlayers.add": "Legg til spiller",
    // Under nedtrekkslisten, for et avslag uten egne ord.
    "admin.competitionPlayers.otherwise":
      "Denne spilleren kan ikke legges til.",
    "admin.competitionPlayers.addSeveral": "Legg til flere",
    "admin.hover.competitionPlayers.addSeveral":
      "Velg flere av turneringens spillere for å legge dem til i denne konkurransen samtidig",
    "admin.addPlayers.title": "Legg til spillere",
    "admin.addPlayers.selectAll": "Velg alle",
    "admin.addPlayers.add": "Legg til valgte",
    "admin.hover.dialog.addPlayers.add":
      "Legg de valgte spillerne til i denne konkurransen",
    "admin.addPlayers.otherwise": "Disse spillerne kan ikke legges til.",
    "admin.addPlayers.someRefusedTitle": "Noen spillere kan ikke legges til",
    "admin.addPlayers.someRefusedQuestion":
      "Spillerne som er oppført kan ikke legges til. Vil du legge til resten av de valgte?",
    "admin.addPlayers.addTheRest": "Legg til resten",
    "admin.hover.dialog.addPlayers.addTheRest":
      "Legg spillerne som kan legges til i denne konkurransen, og la de andre være",
    "Competition.PlayerAlreadyEntered": "Allerede i konkurransen",
    "TournamentPlayer.Archived": "Lagt til side i turneringen",
    "Tournament.NoSuchPlayer": "Ikke en spiller i turneringen",
    "Competition.DrawFixed": "Trekningen er låst, siden en kamp er registrert",
    "admin.competitionPlayers.choose": "Spiller å legge til",
    "admin.competitionPlayers.nobody": "Velg en spiller",
    // Tilbudt i en utslagnings nedtrekksliste, og hva en bye står som i listen.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Alle spillere er i konkurransen",
    "admin.competitionPlayers.none": "Ingen spillere",
    "admin.competitionPlayers.up": "Opp",
    "admin.competitionPlayers.down": "Ned",
    "admin.competitionPlayers.remove": "Fjern",
    "admin.competitionPlayers.withdraw": "Trekk",
    "admin.competitionPlayers.unwithdraw": "Ta tilbake",
    "admin.competitionPlayers.withdrawn": "Trukne spillere",
    "admin.competitionPlayers.removeTitle": "Fjern spiller",
    "admin.competitionPlayers.removeQuestion":
      "{name} tas ut av konkurransen. Dette kan ikke angres.",
    "admin.competitionPlayers.withdrawTitle": "Trekk spiller",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} spiller ikke mer av konkurransen, og partiene de ikke har spilt avgjøres uten dem.",
    "admin.competitionPlayers.carryForward": "Før videre",
    // Dialogen for å føre videre, over en konkurranses Spillere-fane.
    "admin.carryForward.title": "Før videre - {name}",
    "admin.carryForward.save": "Lagre",
    // Over tallene, for et avslag uten egne ord.
    "admin.carryForward.otherwise": "Dette kan ikke føres videre slik det er.",
    "admin.carryForward.matchWins": "Kampseiere",
    "admin.carryForward.matchLosses": "Kamptap",
    "admin.carryForward.gameWins": "Partiseiere",
    "admin.carryForward.gameLosses": "Partitap",
    "admin.carryForward.hoopsFor": "Buer for",
    "admin.carryForward.hoopsAgainst": "Buer mot",
    "CarryForward.MatchWinsNotWhole": "Skriv et helt antall kampseiere.",
    "CarryForward.MatchWinsBelowZero": "Skriv 0 eller flere kampseiere.",
    "CarryForward.MatchLossesNotWhole": "Skriv et helt antall kamptap.",
    "CarryForward.MatchLossesBelowZero": "Skriv 0 eller flere kamptap.",
    "CarryForward.GameWinsNotWhole": "Skriv et helt antall partiseiere.",
    "CarryForward.GameWinsBelowZero": "Skriv 0 eller flere partiseiere.",
    "CarryForward.GameLossesNotWhole": "Skriv et helt antall partitap.",
    "CarryForward.GameLossesBelowZero": "Skriv 0 eller flere partitap.",
    "CarryForward.HoopsForNotWhole": "Skriv et helt antall buer for.",
    "CarryForward.HoopsForBelowZero": "Skriv 0 eller flere buer for.",
    "CarryForward.HoopsAgainstNotWhole": "Skriv et helt antall buer mot.",
    "CarryForward.HoopsAgainstBelowZero": "Skriv 0 eller flere buer mot.",
    // En konkurranses Resultater-fane og resultatdialogen.
    "admin.scores.add": "Legg til resultat",
    "admin.scores.none": "Ingen resultater",
    "admin.scores.edit": "Rediger",
    "admin.scores.drawNotFilledTitle": "Trekningen er ikke fylt",
    "admin.scores.archive": "Arkiver",
    "admin.scores.up": "Opp",
    "admin.scores.down": "Ned",
    "admin.scores.restore": "Gjenopprett",
    "admin.scores.archived": "Arkiverte resultater",
    "admin.scores.archivedSaid": "Arkivert",
    "admin.scores.withdraw": "Trekk",
    "admin.scores.unwithdraw": "Ta tilbake",
    "admin.scores.withdrawnSaid": "Trukket",
    // Over listen, for et avslag uten egne ord.
    "admin.scores.otherwise": "Det lot seg ikke gjøre.",
    "admin.score.title": "Legg til resultat",
    "admin.score.add": "Legg til parti",
    "admin.score.winner": "Vinner",
    "admin.score.winnerScore": "Vinnerens poengsum",
    "admin.score.loser": "Taper",
    "admin.score.loserScore": "Taperens poengsum",
    "admin.score.beat": "slo",
    "admin.score.added": "Partiet {winner} vant mot {loser} ble lagt til.",
    "admin.score.otherwise": "Partiet kunne ikke legges til.",
    "admin.score.playersUnread":
      "Spillerne kunne ikke leses. Lukk denne dialogen og åpne den igjen.",
    "admin.score.correctTitle": "Rediger resultat",
    "admin.score.save": "Lagre",
    "admin.score.notCorrected": "Resultatet kunne ikke rettes.",
    "Game.WinnerMissing": "Velg vinneren.",
    "Game.WinnerScoreMissing": "Skriv vinnerens poengsum.",
    "Game.LoserMissing": "Velg taperen.",
    "Game.LoserScoreMissing": "Skriv taperens poengsum.",
    "Score.NoPoints": "Et resultat begynner med antallet poeng.",
    "Game.SamePlayer": "Ingen spiller mot seg selv.",
    "Game.WinnerNotAhead":
      "Vinnerens poengsum må være høyere enn taperens, eller merket som vunnet.",
    "Game.LoserMarked": "Taperens poengsum kan ikke merkes som vunnet.",
    "Game.ResultChanged":
      "En rettelse beholder resultatet: et vunnet parti forblir vunnet, og et uavgjort parti forblir uavgjort.",
    "Competition.MatchDecided": "Kampen deres er allerede avgjort.",
    "Competition.DrawFull":
      "Kan ikke legge til spilleren fordi utslagningen er full.",
    "Competition.DrawNotFilled":
      "Resultater kan ikke legges til før hver plass i utslagningen er fylt med en spiller eller en bye.",
    "Competition.ByeOutsideKnockout": "Bare en utslagning kan ha en bye.",
    "Competition.NotDrawnToMeet":
      "Disse spillerne er ikke trukket til å spille mot hverandre i utslagningen akkurat nå.",
    "Competition.WinnerHasPlayedOn":
      "Vinneren av denne kampen har allerede spilt sitt neste parti, så hvem som vant den kan ikke endres.",
    "CompetitionPlayer.Withdrawn": "En trukket spiller spiller ikke mer.",
    "admin.players.add": "Legg til spiller",
    "admin.players.addPair": "Legg til par",
    "admin.hover.players.addPair":
      "Lag et dobbeltpar av to av turneringens spillere",
    "admin.pair.title": "Legg til par",
    "admin.pair.first": "Første spiller",
    "admin.pair.second": "Andre spiller",
    "admin.pair.choose": "Velg en spiller",
    "admin.hover.dialog.pair.add": "Lag paret av de to valgte spillerne",
    "admin.pair.otherwise": "Dette paret kan ikke legges til.",
    "AddPair.SamePlayerTwice": "Velg to ulike spillere.",
    "admin.players.addMany": "Legg til spillere",
    "admin.players.none": "Ingen spillere",
    "admin.players.edit": "Rediger",
    "admin.players.archive": "Arkiver",
    "admin.players.restore": "Gjenopprett",
    "admin.players.up": "Opp",
    "admin.players.down": "Ned",
    // Spurt før en spiller som er med i konkurranser arkiveres, siden
    // arkivering fjerner dem fra hver, og gjenoppretting setter dem ikke
    // tilbake.
    "admin.players.archiveTitle": "Arkiver spiller",
    "admin.players.archiveQuestion": "{name} fjernes fra disse konkurransene:",
    "admin.players.archive.explanation":
      "Å gjenopprette dem setter dem ikke tilbake i disse konkurransene.",
    "admin.players.archived": "Arkiverte spillere",
    // Sagt til en skjermleser, siden en strek gjennom et navn ikke leses opp.
    "admin.players.archivedSaid": "Arkivert",
    // Spillerdialogen.
    "admin.player.addTitle": "Legg til spiller",
    "admin.player.editTitle": "Rediger spiller",
    "admin.player.name": "Navn",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Representerer",
    "admin.player.worldRankingName": "Spillerens navn i verdensrangeringen",
    // Ved siden av verdensrangeringsnavnet: om verdensrangeringene kjenner det.
    "admin.player.worldRankingKnown":
      "Verdensrangeringene kjenner dette navnet.",
    "admin.player.worldRankingQuestioned":
      "Verdensrangeringene har ingen spiller med dette navnet. Det kan være feilstavet, eller spilleren kan være ny i rangeringene.",
    "admin.player.flag": "Flagg",
    "admin.player.add": "Legg til",
    "admin.player.save": "Lagre",
    "admin.player.added": "{name} ble lagt til.",
    // Spillerdialogen (players.feature): flere spillere skrevet i én boks.
    "admin.players.addManyTitle": "Legg til spillere",
    // En lenke i en dialogs tittellinje, til hjelpen som forklarer den.
    "admin.dialog.help": "Hjelp",
    "admin.players.many": "Spillere",
    "admin.players.line": "Linje {line}: {words}",
    "AddPlayers.FieldsMissing": "Skriv navnene på feltene på første linje.",
    "AddPlayers.FirstRowNotFields":
      "Første rad må være feltnavn, se {help} for mer informasjon.",
    "AddPlayers.NameMissing": "Feltene må inneholde Name.",
    "AddPlayers.FieldNotAllowed":
      "Et felt kan være Name, Representing, Flag, Handicap eller WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Et felt kan bare nevnes én gang.",
    "AddPlayers.PlayersMissing":
      "Skriv en spiller på hver linje etter den første.",
    "AddPlayers.TooManyPlayers":
      "En liste kan ha høyst 500 spillere. Legg til resten i en annen liste.",
    "AddPlayers.ValuesMismatched":
      "Hver spiller trenger en verdi, eller ingenting, for hvert felt som er nevnt på første linje.",
    // Over feltene, for et avslag uten egne ord.
    "admin.player.otherwise": "Denne spilleren kan ikke beholdes som de er.",
    "Tournament.PlayerNameTaken":
      "En annen spiller i denne turneringen har allerede det navnet.",
    "TournamentPlayer.NoSuchFlag": "Velg et av flaggene som finnes.",
    "TournamentPlayer.HandicapMalformed":
      "Skriv handicapet som et tall. For eksempel: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "En spiller kan ikke hete Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Et navn trenger en bokstav eller et siffer.",
    // Dialogen over spillerdialogen når en spiller får navnet bye.
    "admin.player.byesTitle": "Byer trenger ikke legges til",
    "admin.player.byes":
      "En bye er ikke en av turneringens spillere. En utslagning tilbyr Bye hver gang spillerne legges til, så mange ganger som trekningen trenger.",
    // En turnering spilt av lag (view.feature): Lag- og Tester-fanene, et
    // lags side, og dialogene deres.
    "admin.view.teams": "Lag",
    "admin.view.tests": "Tester",
    "admin.teams.add": "Legg til lag",
    "admin.teams.none": "Ingen lag",
    "admin.teams.edit": "Rediger",
    "admin.teams.view": "Vis",
    "admin.teams.archive": "Arkiver",
    "admin.teams.restore": "Gjenopprett",
    "admin.teams.up": "Opp",
    "admin.teams.down": "Ned",
    "admin.teams.archived": "Arkiverte lag",
    "admin.teams.archivedSaid": "Arkivert",
    "admin.team.addTitle": "Legg til lag",
    "admin.team.editTitle": "Rediger lag",
    "admin.team.name": "Navn",
    "admin.team.shortName": "Kortnavn",
    "admin.team.shortName.explanation":
      "Det lagets tester kalles, som AUS v ENG.",
    "admin.team.flag": "Flagg",
    "admin.team.add": "Legg til",
    "admin.team.save": "Lagre",
    "admin.team.added": "{name} ble lagt til.",
    // Over feltene, for et avslag uten egne ord.
    "admin.team.otherwise": "Dette laget kan ikke beholdes som det er.",
    "admin.teamView.otherwise": "Dette laget kan ikke ses herfra.",
    "admin.teamView.players": "Spillere",
    "TeamName.Missing": "Skriv hva laget heter.",
    "TeamName.TooLong": "Det navnet er for langt.",
    "admin.notes.add": "Legg til notat",
    "admin.notes.none": "Ingen notater",
    "admin.notes.edit": "Rediger",
    "admin.notes.delete": "Slett",
    // Spurt før et notat slettes, siden et slettet notat er borte for godt.
    "admin.notes.deleteTitle": "Slett notat",
    "admin.notes.deleteQuestion": "Slette notatet «{title}»?",
    "admin.notes.delete.explanation":
      "Et slettet notat er borte for godt, og kan ikke hentes tilbake.",
    // Over listen, for et avslag uten egne ord.
    "admin.notes.otherwise": "Det lot seg ikke gjøre.",
    // Notatdialogen, fanene for beskrivelsen og verktøylinjen over boksen.
    "admin.note.addTitle": "Legg til notat",
    "admin.note.editTitle": "Rediger notat",
    "admin.note.title": "Tittel",
    "admin.note.description": "Beskrivelse",
    "admin.note.write": "Skriv",
    "admin.note.preview": "Forhåndsvisning",
    "admin.note.toolbar": "Formatering",
    "admin.note.tool.heading": "Overskrift",
    "admin.note.tool.bold": "Fet",
    "admin.note.tool.italic": "Kursiv",
    "admin.note.tool.quote": "Sitat",
    "admin.note.tool.code": "Kode",
    "admin.note.tool.link": "Lenke",
    "admin.note.tool.numberedList": "Nummerert liste",
    "admin.note.tool.bulletedList": "Punktliste",
    "admin.note.tool.taskList": "Oppgaveliste",
    "admin.note.add": "Legg til",
    "admin.note.save": "Lagre",
    // Over feltene, for et avslag uten egne ord.
    "admin.note.otherwise": "Dette notatet kan ikke beholdes som det er.",
    "ManagerNoteTitle.Missing": "Gi notatet en tittel.",
    "ManagerNoteTitle.TooLong": "Den tittelen er for lang.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "En tittel trenger en bokstav eller et siffer.",
    "ManagerNoteDescription.TooLong": "Den beskrivelsen er for lang.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Det notatet finnes ikke lenger. En annen leder kan ha slettet det.",
    "EditManagerNote.NoSuchManagerNote":
      "Det notatet finnes ikke lenger. En annen leder kan ha slettet det.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Det notatet finnes ikke lenger. En annen leder kan ha slettet det.",
    "ManagerNote.Deleted":
      "Det notatet er slettet. En annen leder kan ha slettet det.",
    "CommentaryTitle.Missing": "Gi kommentaren en tittel.",
    "CommentaryTitle.TooLong": "Den tittelen er for lang.",
    "CommentaryTitle.NoLetterOrDigit":
      "En tittel trenger en bokstav eller et siffer.",
    "Commentary.TitleTaken": "En annen kommentar har allerede den tittelen.",
    "CommentText.Missing": "Skriv noe i innlegget.",
    "CommentText.TooLong": "Det innlegget er for langt.",
    "TeamShortName.Missing": "Gi laget et kortnavn.",
    "TeamShortName.TooLong": "Et kortnavn kan ha høyst 10 tegn.",
    "TeamShortName.NoLetterOrDigit":
      "Et kortnavn trenger en bokstav eller et siffer.",
    "Team.ShortNameLongerThanName":
      "Et kortnavn kan ikke være lengre enn lagets navn.",
    "Team.NoSuchFlag": "Velg et av flaggene som finnes.",
    "Team.Archived": "Det laget er arkivert, og gjenopprettes først.",
    "Team.InATest": "Det laget spiller i en test, og kan ikke arkiveres.",
    "Team.PlayerNameTaken":
      "En annen spiller på dette laget har allerede det navnet.",
    "TeamPlayer.NamedBye": "En spiller kan ikke hete Bye.",
    "TeamPlayer.Archived": "Den spilleren er arkivert, og gjenopprettes først.",
    "TeamPlayer.HasGames": "Den spilleren har spilt, og kan ikke arkiveres.",
    "Tournament.TeamNameTaken":
      "Et annet lag i denne turneringen har allerede det navnet.",
    "Tournament.TeamShortNameTaken":
      "Et annet lag i denne turneringen har allerede det kortnavnet.",
    "Tournament.NoSuchTeam":
      "Denne turneringen har ikke noe lag på denne adressen.",
    "Tournament.TeamArchived":
      "Dette laget er arkivert, og kan bare gjenopprettes fra Lag-fanen.",
    "admin.tests.add": "Legg til test",
    "admin.tests.none": "Ingen tester",
    "admin.tests.edit": "Rediger",
    "admin.tests.view": "Vis",
    "admin.tests.archive": "Arkiver",
    "admin.tests.restore": "Gjenopprett",
    "admin.tests.up": "Opp",
    "admin.tests.down": "Ned",
    "admin.tests.archived": "Arkiverte tester",
    "admin.tests.twoTeamsNeeded":
      "En test er mellom to lag, så to lag trengs først.",
    "admin.tests.toTeams": "Gå til Lag",
    "admin.tests.matches.one": "{count} kamp",
    "admin.tests.matches.other": "{count} kamper",
    "admin.tests.bestOf": "best av {games}",
    // Ved siden av listen, for et avslag uten egne ord.
    "admin.tests.otherwise": "Det lot seg ikke gjøre.",
    "admin.test.addTitle": "Legg til test",
    "admin.test.editTitle": "Rediger test",
    "admin.test.firstTeam": "Lag A",
    "admin.test.secondTeam": "Lag B",
    "admin.test.versus": "v",
    "admin.test.starts": "Starter",
    "admin.test.finishes": "Slutter",
    "admin.test.expectedMatches": "Forventede kamper",
    "admin.test.bestOf": "Best av",
    "admin.test.group": "Gruppe",
    "admin.test.add": "Legg til",
    "admin.test.save": "Lagre",
    "admin.test.added": "{name} ble lagt til.",
    "admin.test.otherwise": "Denne testen kan ikke beholdes som den er.",
    "admin.testView.otherwise": "Denne testen kan ikke ses herfra.",
    "AddTest.FirstTeamMissing": "Velg det første laget.",
    "AddTest.SecondTeamMissing": "Velg det andre laget.",
    "UpdateTest.FirstTeamMissing": "Velg det første laget.",
    "UpdateTest.SecondTeamMissing": "Velg det andre laget.",
    "ExpectedMatches.NotWhole": "Skriv et helt antall kamper.",
    "ExpectedMatches.TooSmall": "En test må forventes å ha minst 1 kamp.",
    "TestGroup.TooLong": "Den gruppen er for lang.",
    "Tournament.TestAgainstItself": "Et lag spiller ikke test mot seg selv.",
    "Tournament.FormatHasNoGroups":
      "En test i dette formatet legges ikke i en gruppe.",
    "Tournament.TestFinishesBeforeStarts":
      "En test kan ikke slutte før den starter.",
    "Tournament.TestStartsBeforeTournament":
      "En test kan ikke starte før turneringen den hører til.",
    "Tournament.TestFinishesAfterTournament":
      "En test kan ikke slutte etter turneringen den hører til.",
    "Tournament.TestHasGamesInUse":
      "Denne testen har partier, så den kan ikke arkiveres før de er det.",
    "Tournament.TestHasGames":
      "Denne testen har partier nå, så lagene i den kan ikke lenger endres.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Flere kamper enn det har allerede startet.",
    "Tournament.BestOfBelowGamesPlayed":
      "To spillere har allerede spilt flere partier enn det.",
    "Competition.ExpectedMatchesReached":
      "Denne testen har startet så mange kamper som den forventes å ha.",
    "Competition.SameTeam":
      "To spillere fra samme lag spiller ikke mot hverandre.",
    "AddManager.NoSuchAccount":
      "Den adressen har ingen konto som kan gjøres til leder.",
    "admin.scorers.add": "Legg til poengfører",
    "admin.scorers.none": "Ingen poengførere",
    "admin.scorers.removeTitle": "Fjern poengfører",
    "admin.scorers.removeExplanation":
      "{name} kan ikke lenger skrive inn resultatene i denne turneringen.",
    // Under feltet, for et avslag uten egne ord.
    "admin.scorers.otherwise": "Den adressen kan ikke gjøres til poengfører.",
    "AddScorer.NoSuchAccount":
      "Den adressen har ingen konto som kan gjøres til poengfører.",
    // Å gi, ta bort og liste roller, som bare en administrator kan gjøre.
    "Account.NotAnAdministrator": "Bare en administrator kan gjøre det.",
    "AddRole.NoSuchAccount": "Den adressen har ingen konto som kan få rollen.",
    "AddRole.NoSuchRole": "Det finnes ingen slik rolle.",
    "RemoveRole.NoSuchAccount": "Det finnes ingen slik konto.",
    "RemoveRole.NoSuchRole": "Det finnes ingen slik rolle.",
    "RemoveRole.Yourself": "Du kan ikke ta rollen Administrator fra deg selv.",
    "AccountsWithRole.NoSuchRole": "Det finnes ingen slik rolle.",
    "Tournament.AlreadyAManager":
      "Den kontoen er allerede leder for turneringen, og kan gjøre alt en poengfører kan.",

    // En turnerings avslag, med kodene som nøkler slik hver brutt regel har.
    // Under feltet hver gjelder, eller i stedet for skjemaet der selve siden
    // avvises.
    "TournamentName.Missing": "Skriv hva turneringen heter.",
    "TournamentName.TooShort": "Det navnet er for kort.",
    "TournamentName.TooLong": "Det navnet er for langt.",
    "TournamentName.AllLowerCase":
      "Et navn kan ikke skrives helt med små bokstaver.",
    "TournamentName.AllCapitals":
      "Et navn kan ikke skrives helt med store bokstaver.",
    "TournamentName.NoLetterOrDigit":
      "Et navn trenger en bokstav eller et siffer.",
    "ReadOnlyDate.Unreadable": "Oppgi dagen.",
    "Tournament.FinishesBeforeStarts":
      "En turnering kan ikke slutte før den starter.",
    "Tournament.StartsAfterNextYear":
      "En turnering kan ikke starte etter neste år.",
    "Tournament.FinishesAfterNextYear":
      "En turnering kan ikke slutte etter neste år.",
    "CreateTournament.NoSuchCountry": "Velg landet.",
    "TournamentSubtitle.TooLong":
      "En undertittel kan ikke være lengre enn 2000 tegn.",
    "Tournament.NotAManager":
      "Bare en leder for denne turneringen kan endre den.",
    "Tournament.NotAManagerOrScorer":
      "Bare en leder eller poengfører for denne turneringen kan se den.",
    "Tournament.Archived":
      "Denne turneringen er arkivert, og gjenopprettes før den kan endres.",
    "UpdateTournament.NoSuchTournament":
      "Det finnes ingen turnering på denne adressen.",

    // Hva en turnering spilles i og hvor, med kode, slik API-et tilbyr dem til
    // adminens skjema.
    "sport.ac": "Association croquet",
    "sport.gc": "Golfcroquet",
    "sport.a6w": "Amerikansk 6-buers croquet",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Lag",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "VM for lag i golfcroquet",

    "country.ad": "Andorra",
    "country.ae": "De forente arabiske emirater",
    "country.af": "Afghanistan",
    "country.ag": "Antigua og Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Amerikansk Samoa",
    "country.at": "Østerrike",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Åland",
    "country.az": "Aserbajdsjan",
    "country.ba": "Bosnia-Hercegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Belgia",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgaria",
    "country.bh": "Bahrain",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivia",
    "country.br": "Brasil",
    "country.bs": "Bahamas",
    "country.bt": "Bhutan",
    "country.bv": "Bouvetøya",
    "country.bw": "Botswana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalonia",
    "country.cc": "Kokosøyene",
    "country.cd": "Den demokratiske republikken Kongo",
    "country.cf": "Den sentralafrikanske republikk",
    "country.cg": "Republikken Kongo",
    "country.ch": "Sveits",
    "country.ci": "Elfenbenskysten",
    "country.ck": "Cookøyene",
    "country.cl": "Chile",
    "country.cm": "Kamerun",
    "country.cn": "Kina",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Kapp Verde",
    "country.cx": "Christmasøya",
    "country.cy": "Kypros",
    "country.cz": "Tsjekkia",
    "country.de": "Tyskland",
    "country.dj": "Djibouti",
    "country.dk": "Danmark",
    "country.dm": "Dominica",
    "country.do": "Den dominikanske republikk",
    "country.dz": "Algerie",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Egypt",
    "country.eh": "Vest-Sahara",
    "country.england": "England",
    "country.er": "Eritrea",
    "country.es": "Spania",
    "country.et": "Etiopia",
    "country.fi": "Finland",
    "country.fj": "Fiji",
    "country.fk": "Falklandsøyene",
    "country.fm": "Mikronesia",
    "country.fo": "Færøyene",
    "country.fr": "Frankrike",
    "country.ga": "Gabon",
    "country.gb": "Storbritannia",
    "country.gd": "Grenada",
    "country.ge": "Georgia",
    "country.gf": "Fransk Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Grønland",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadeloupe",
    "country.gq": "Ekvatorial-Guinea",
    "country.gr": "Hellas",
    "country.gs": "Sør-Georgia og Sør-Sandwichøyene",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard- og McDonaldøyene",
    "country.hn": "Honduras",
    "country.hr": "Kroatia",
    "country.ht": "Haiti",
    "country.hu": "Ungarn",
    "country.id": "Indonesia",
    "country.ie": "Irland",
    "country.il": "Israel",
    "country.im": "Man",
    "country.in": "India",
    "country.io": "Det britiske territoriet i Indiahavet",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Island",
    "country.it": "Italia",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordan",
    "country.jp": "Japan",
    "country.ke": "Kenya",
    "country.kg": "Kirgisistan",
    "country.kh": "Kambodsja",
    "country.ki": "Kiribati",
    "country.km": "Komorene",
    "country.kn": "Saint Kitts og Nevis",
    "country.kp": "Nord-Korea",
    "country.kr": "Sør-Korea",
    "country.kw": "Kuwait",
    "country.ky": "Caymanøyene",
    "country.kz": "Kasakhstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Litauen",
    "country.lu": "Luxembourg",
    "country.lv": "Latvia",
    "country.ly": "Libya",
    "country.ma": "Marokko",
    "country.mc": "Monaco",
    "country.md": "Moldova",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshalløyene",
    "country.mk": "Nord-Makedonia",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Nord-Marianene",
    "country.mq": "Martinique",
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maldivene",
    "country.mw": "Malawi",
    "country.mx": "Mexico",
    "country.my": "Malaysia",
    "country.mz": "Mosambik",
    "country.na": "Namibia",
    "country.nc": "Ny-Caledonia",
    "country.ne": "Niger",
    "country.nf": "Norfolkøya",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Nederland",
    "country.no": "Norge",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "New Zealand",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Fransk Polynesia",
    "country.pg": "Papua Ny-Guinea",
    "country.ph": "Filippinene",
    "country.pk": "Pakistan",
    "country.pl": "Polen",
    "country.pm": "Saint-Pierre og Miquelon",
    "country.pn": "Pitcairnøyene",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Réunion",
    "country.ro": "Romania",
    "country.rs": "Serbia",
    "country.ru": "Russland",
    "country.rw": "Rwanda",
    "country.sa": "Saudi-Arabia",
    "country.sb": "Salomonøyene",
    "country.sc": "Seychellene",
    "country.scotland": "Skottland",
    "country.sd": "Sudan",
    "country.se": "Sverige",
    "country.sg": "Singapore",
    "country.sh": "Saint Helena",
    "country.si": "Slovenia",
    "country.sj": "Svalbard og Jan Mayen",
    "country.sk": "Slovakia",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Surinam",
    "country.st": "São Tomé og Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Syria",
    "country.sz": "Eswatini",
    "country.tc": "Turks- og Caicosøyene",
    "country.td": "Tsjad",
    "country.tf": "De franske sørterritorier",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadsjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Øst-Timor",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisia",
    "country.to": "Tonga",
    "country.tr": "Tyrkia",
    "country.tt": "Trinidad og Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzania",
    "country.ua": "Ukraina",
    "country.ug": "Uganda",
    "country.um": "USAs ytre småøyer",
    "country.us": "USA",
    "country.uy": "Uruguay",
    "country.uz": "Usbekistan",
    "country.va": "Vatikanstaten",
    "country.vc": "Saint Vincent og Grenadinene",
    "country.ve": "Venezuela",
    "country.vg": "De britiske Jomfruøyene",
    "country.vi": "De amerikanske Jomfruøyene",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wales",
    "country.wf": "Wallis og Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Sør-Afrika",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    "Email.ConfirmAddress.subject": "Bekreft e-postadressen din for {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hei,</p>

<p>
    Takk for at du opprettet en konto hos <strong>{siteName}</strong>.<br />
    Før du kan begynne å bruke kontoen din, må du bekrefte e-postadressen din
    ved å klikke på knappen nedenfor:
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
        Bekreft e-postadressen min
    </a>
</p>

<p>
    Hvis knappen ikke fungerer, kan du også bekrefte e-postadressen din ved å åpne denne lenken i nettleseren din:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Hvis du ikke opprettet denne kontoen, kan du trygt se bort fra denne e-posten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "En ny lenke for å bekrefte e-postadressen din for {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hei,</p>

<p>
    Du ba nylig om en ny e-post for å bekrefte e-postadressen din for <strong>{siteName}</strong>.<br />
    Bekreft e-postadressen din ved å klikke på knappen nedenfor:
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
        Bekreft e-postadressen min
    </a>
</p>

<p>
    Hvis knappen ikke fungerer, kan du også bekrefte e-postadressen din ved å åpne denne lenken i nettleseren din:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Når den er bekreftet, kan du fortsette å bruke kontoen din uten avbrudd.
</p>

<p>
    Hvis du ikke ba om denne e-posten, kan du trygt se bort fra den.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Noen prøvde å registrere seg med e-postadressen din",
    "Email.AlreadyRegistered.body": `
<p>Hei,</p>

<p>
    Noen prøvde å registrere seg hos <strong>{siteName}</strong> med denne
    e-postadressen, som allerede har en konto. Ingenting ved kontoen din er
    endret.<br />
    Hvis det var deg, har du allerede en konto, og kan logge inn på den:
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
        Logg inn
    </a>
</p>

<p>
    Hvis du har glemt passordet ditt, kan du tilbakestille det her:
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
        Glemt passord
    </a>
</p>

<p>
    Hvis det ikke var deg, trenger du ikke gjøre noe. Ingen har fått en vei inn
    i kontoen din.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bekreft flyttingen av kontoen din hos {siteName} til denne adressen",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hei,</p>

<p>
    Noen som var logget inn på en konto hos <strong>{siteName}</strong> ba om å
    flytte den til denne e-postadressen. Hvis det var deg, bekrefter du det
    her, innlogget på den kontoen. Lenken fungerer i 24 timer.
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
        Flytt kontoen min
    </a>
</p>

<p>
    Eller kopier denne adressen inn i nettleseren din:<br />
    {link}
</p>

<p>
    Hvis det ikke var deg, trenger du ikke gjøre noe. Ingen konto flyttes hit.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Noen ba om å flytte en konto til e-postadressen din",
    "Email.AlreadyHasAnAccount.body": `
<p>Hei,</p>

<p>
    Noen som var logget inn på en konto hos <strong>{siteName}</strong> ba om å
    flytte den til denne e-postadressen, som allerede har en egen konto.
    Ingenting er flyttet, og ingenting ved kontoen din er endret.
</p>

<p>
    Hvis det var deg, har du allerede en konto på denne adressen, og kan logge
    inn på den.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Kontoen din hos {siteName} er flyttet",
    "Email.EmailAddressChanged.body": `
<p>Hei,</p>

<p>
    Kontoen din hos <strong>{siteName}</strong> ble nettopp flyttet til en
    annen e-postadresse, {emailAddress}, og logger inn med den adressen fra nå
    av.
</p>

<p>
    Hvis det ikke var deg, har noen andre kontoen din. Svar på denne e-posten
    og si fra til oss.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Passordet ditt hos {siteName} ble endret",
    "Email.PasswordChanged.body": `
<p>Hei,</p>

<p>
    Passordet til kontoen din hos <strong>{siteName}</strong> ble nettopp
    endret, og alle andre nettlesere som var logget inn på den ble logget ut.<br />
    Hvis det var deg, trenger du ikke gjøre noe.
</p>

<p>
    Hvis det ikke var deg, har noen andre passordet ditt. Lag et nytt her, så
    blir de logget ut:
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
        Glemt passord
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Lag et nytt passord for {siteName}",
    "Email.SetNewPassword.body": `
<p>Hei,</p>

<p>
    Du ba nylig om å tilbakestille passordet ditt hos <strong>{siteName}</strong>.<br />
    Du kan tilbakestille passordet ditt ved å klikke på knappen nedenfor:
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
        Tilbakestill passord
    </a>
</p>

<p>
    Hvis knappen ikke fungerer, kan du også tilbakestille passordet ditt ved å åpne denne lenken i nettleseren din:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Hvis du ikke ba om å tilbakestille passordet, kan du trygt se bort fra denne e-posten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Lag et passord for {siteName}",
    "Email.SetPassword.body": `
<p>Hei,</p>

<p>
    Kontoen din hos <strong>{siteName}</strong> har ikke noe passord: du logger inn med Google.<br />
    Du ba om å lage et, slik at du også kan logge inn med e-postadressen din og et passord.
    Du kan lage det ved å klikke på knappen nedenfor:
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
        Lag passord
    </a>
</p>

<p>
    Hvis knappen ikke fungerer, kan du også lage passordet ved å åpne denne lenken i nettleseren din:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Lenken fungerer i en time. Hvis du ikke ba om å lage et passord, kan du trygt se bort fra denne e-posten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Det finnes ingen konto hos {siteName} for denne e-postadressen",
    "Email.RegisterInstead.body": `
<p>Hei,</p>

<p>
    Det ble gjort en forespørsel om å tilbakestille passordet for en
    e-postadresse som ikke hører til noen konto hos <strong>{siteName}</strong>.
</p>

<p>
    Hvis du vil bruke tjenesten vår, kan du opprette en ny konto ved å gå til:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Hvis du ikke gjorde denne forespørselen, kan du trygt se bort fra denne e-posten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bekreft at kontoen din hos {siteName} skal glemmes",
    "Email.ConfirmForgetting.body": `
<p>Hei,</p>

<p>
    Du ba om at kontoen din hos <strong>{siteName}</strong> skal
    glemmes.<br />
    Følg knappen nedenfor for å se hva det innebærer, og for å si sikkert at
    du vil det:
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
        Glem kontoen min
    </a>
</p>

<p>
    Hvis knappen ikke fungerer, kan du også åpne denne lenken i nettleseren din:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Når kontoen er glemt, kan navnet og e-postadressen din aldri leses igjen,
    av noen, og det går ikke an å logge inn på kontoen. Det kan ikke angres.
</p>

<p>
    Lenken fungerer én gang, til 15 minutter etter at du ba om den, og bare
    mens du er logget inn på denne kontoen. Etter det må du be om en ny fra
    kontoen din.
</p>

<p>
    Hvis du ikke ba om det, skjer ingenting med mindre lenken følges. Noen som
    var logget inn på kontoen din ba om det, så lag et nytt passord fra siden
    for glemt passord for å være sikker på at de ikke kan logge inn igjen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registreringen er satt på pause: {service} kan ikke nås",
    "Email.RegistrationsSuspended.body": `
<p>Hei,</p>

<p>
    {siteName} kunne ikke nå {service} kl. {when}. Til den svarer, får lesere
    som trenger den, for å registrere seg eller lage et nytt passord, beskjed
    om å prøve igjen senere.
</p>

<p>
    Ingenting må løftes. Hvert forsøk spør {service} på nytt, og sidene
    fungerer igjen i samme øyeblikk den svarer.
</p>

<p>
    Mens {service} er nede, får du e-post om det høyst én gang i timen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject": "{siteName} når ikke databasen sin",
    "Email.DatabaseUnreachable.body": `
<p>Hei,</p>

<p>
    {siteName} kunne ikke nå databasen sin kl. {when}. Til den svarer, forteller hver side som trenger den leserne at nettstedet er utilgjengelig og at de må prøve igjen senere.
</p>

<p>
    Ingenting må løftes. Hver forespørsel ber om en tilkobling på nytt, og nettstedet fungerer igjen i samme øyeblikk databasen svarer.
</p>

<p>
    Mens databasen er nede, får du e-post om det høyst én gang hvert {minutes}. minutt.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} sviktet på en forespørsel",
    "Email.UnhandledError.body": `
<p>Hei,</p>

<p>
    {siteName} sviktet kl. {when} på en forespørsel om {asked}. Leseren fikk se referansen {reference}, og loggen har årsaken under den.
</p>

<p>
    Et nettsted som er ødelagt, pleier å svikte på hver forespørsel, så du får e-post om svikt høyst 4 ganger i timen. De etter det står i loggen likevel.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
