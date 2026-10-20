// The site's words in German. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as du rather than Sie: the site talks to people
// scoring and following croquet, a pastime where players are on first-name
// terms, and the English it is written from is plain and direct rather than
// formal. Menu items and buttons are written as German writes them, with
// nouns capitalised but the rest of a phrase in lower case, where the English
// capitalises each word. "E-Mail-Adresse" is always the address; "E-Mail"
// alone is only ever what is sent or received.
import type { Language } from "../common/language.js";

export const german: Language = {
  tag: "de",
  name: "Deutsch",
  words: {
    "site.skipToContent": "Zum Inhalt springen",
    "navigation.menu": "Menü",
    "navigation.label": "Hauptnavigation",
    "navigation.home": "Startseite",
    "navigation.help": "Hilfe",
    "navigation.admin": "Verwaltung",
    "sections.label": "Bereiche",
    "theme.label": "Darstellung",
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "theme.system": "System",
    "footer.donate": "Spenden",
    "footer.plea":
      "Gefällt dir {siteName}? Bitte spende, damit es weiterentwickelt werden kann.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Datenschutz",
    "beta.banner":
      "Dies ist eine Beta-Website. Daten können jederzeit zurückgesetzt werden.",
    "privacy.contact":
      "Fragen zu dieser Seite oder dazu, was über dich gespeichert ist: {emailAddress}",
    "tryWebsite.banner":
      "Das hier ist ein geschützter Ort, um {siteName} kennenzulernen. Alles, was du hier eingibst, kann jederzeit gelöscht werden.",

    "language.label": "Sprache",
    "language.choose": "Ändern",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Es gibt etwas Neues zu lesen.",
    "whatsNew.admin.message":
      "Es gibt etwas Neues für alle, die Turniere leiten.",
    "whatsNew.view": "Neuigkeiten ansehen",
    "whatsNew.later": "Beim nächsten Mal erinnern",
    "whatsNew.never": "Diesen Hinweis nie wieder anzeigen",

    "form.otherwise":
      "Etwas stimmt nicht. Prüfe deine Eingaben und versuche es noch einmal.",

    "account.menu": "Konto",
    "account.register": "Registrieren",
    "account.signIn": "Anmelden",
    "account.forgotPassword": "Ich habe mein Passwort vergessen",
    "account.signOut": "Abmelden",
    "account.profile": "Profil",
    "account.changePassword": "Passwort ändern",
    "account.changeEmailAddress": "E-Mail-Adresse ändern",
    "account.changeName": "Namen ändern",
    "account.setPassword": "Passwort festlegen",
    "account.forgetAccount": "Konto vergessen",

    "register.title": "Registrieren",
    "register.emailAddress": "E-Mail-Adresse",
    "register.submit": "Registrieren",
    "register.withGoogle": "Mit Google registrieren",
    "register.or": "oder",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google hat nicht bestätigt, dass diese E-Mail-Adresse dir gehört, deshalb kann sie hier nicht mit Google verwendet werden. Nutze unten deine E-Mail-Adresse.",
    "SignInWithGoogle.LinkedToAnother":
      "Zu dieser E-Mail-Adresse gibt es bereits ein Konto, das mit einem anderen Google-Konto verknüpft ist. Melde dich mit diesem Google-Konto an oder mit deiner E-Mail-Adresse und deinem Passwort.",
    "SignInWithGoogle.NameMissing":
      "Google hat uns deinen Namen nicht mitgeteilt, und ein Konto braucht einen. Nutze unten deine E-Mail-Adresse.",
    "Google.Unreachable":
      "Google ist gerade nicht erreichbar. Versuche es in ein paar Minuten noch einmal oder nutze unten deine E-Mail-Adresse.",
    "Registration.NotAPerson":
      "Das sah nicht nach einem Menschen aus. Versuche es noch einmal, und wenn es wieder passiert, warte ein paar Minuten und komm dann zurück.",

    "EmailAddress.Missing": "Gib eine E-Mail-Adresse ein.",
    "EmailAddress.NoAt": "Eine E-Mail-Adresse enthält ein @.",
    "EmailAddress.MoreThanOneAt":
      "Eine E-Mail-Adresse enthält nur ein einziges @.",
    "EmailAddress.NoDomain":
      "Eine E-Mail-Adresse hat nach dem @ eine Domain, wie example.com.",

    "welcome.title": "Sieh in deinem Postfach nach",
    "welcome.checkEmail":
      "Wir haben eine E-Mail an die Adresse geschickt, die du angegeben hast. Folge dem Link darin, um fortzufahren.",
    "welcome.nothingArrived":
      "Wenn in ein paar Minuten nichts ankommt, sieh in deinem Spam-Ordner nach.",
    "welcome.home": "Zurück zu {siteName}",
    "newConfirmationLink.title": "Neuen Link anfordern",
    "newConfirmationLink.explanation":
      "Der Link zum Bestätigen deiner E-Mail-Adresse ist abgelaufen. Fordere einen neuen an, er wird an die Adresse geschickt, mit der du dich registriert hast.",
    "newConfirmationLink.send": "Schick mir einen neuen Link",
    "newConfirmationLink.home": "Zurück zu {siteName}",
    "newConfirmationLink.signIn": "Anmelden",
    "newConfirmationLink.sent.title": "Sieh in deinem Postfach nach",
    "newConfirmationLink.sent.explanation":
      "Wir haben dir einen neuen Link geschickt. Folge ihm, um deine E-Mail-Adresse zu bestätigen. Wenn in ein paar Minuten nichts ankommt, sieh in deinem Spam-Ordner nach.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Diese E-Mail-Adresse ist bereits bestätigt",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Es gibt nichts mehr zu bestätigen. Melde dich mit dem Passwort an, das du beim Bestätigen angegeben hast.",
    "newConfirmationLink.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "newConfirmationLink.noLongerWorks.explanation":
      "Prüfe, ob du dem vollständigen Link aus der E-Mail gefolgt bist und am Ende nichts fehlt. Wenn er immer noch nicht funktioniert, registriere dich erneut, dann wird dir ein neuer Link geschickt.",
    "newConfirmationLink.tooMany.title": "Versuche es später noch einmal",
    "newConfirmationLink.tooMany.explanation":
      "An diese Adresse sind in letzter Zeit mehrere Links geschickt worden. Warte eine Stunde und fordere dann einen neuen an, und sieh in der Zwischenzeit in deinem Spam-Ordner nach.",

    "forgotPassword.title": "Passwort vergessen?",
    "forgotPassword.emailAddress": "E-Mail-Adresse",
    "forgotPassword.submit": "Schick mir einen Weg zurück ins Konto",
    "forgotPassword.home": "Zurück zu {siteName}",
    "forgotPassword.sent.title": "Sieh in deinem Postfach nach",
    "forgotPassword.sent.explanation":
      "Wenn es zu dieser Adresse ein Konto gibt, haben wir dir einen Link zum Festlegen eines neuen Passworts geschickt. Folge ihm innerhalb einer Stunde. Wenn in ein paar Minuten nichts ankommt, sieh in deinem Spam-Ordner nach.",
    "forgotPassword.tryAgainLater":
      "Von hier aus sind in letzter Zeit zu viele Wege zurück ins Konto angefordert worden. Warte eine Stunde und versuche es dann noch einmal.",

    "setNewPassword.title": "Neues Passwort festlegen",
    "setNewPassword.password": "Passwort",
    "setNewPassword.confirmPassword": "Passwort bestätigen",
    "setNewPassword.submit": "Mein neues Passwort festlegen",
    "setNewPassword.home": "Zurück zu {siteName}",
    "setNewPassword.signIn": "Anmelden",
    "setNewPassword.askAgain": "Neuen Link anfordern",
    "setNewPassword.changed.title": "Dein Passwort wurde geändert",
    "setNewPassword.changed.explanation":
      "Du wurdest überall abgemeldet, wo du angemeldet warst. Melde dich mit deinem neuen Passwort an.",
    "setNewPassword.expired.title": "Dieser Link ist abgelaufen",
    "setNewPassword.expired.explanation":
      "Ein Link zum Festlegen eines neuen Passworts funktioniert eine Stunde lang. Fordere einen neuen an, er wird an dieselbe Adresse geschickt.",
    "setNewPassword.noLongerWorks.title": "Dieser Link funktioniert nicht mehr",
    "setNewPassword.noLongerWorks.explanation":
      "Vielleicht wurde er schon benutzt, oder am Ende fehlt etwas. Fordere einen neuen an, wenn du ihn noch brauchst.",

    "BreachedPasswords.Unreachable":
      "Dein Passwort kann gerade nicht geprüft werden und wurde deshalb nicht geändert. Versuche es in ein paar Minuten noch einmal; dein Link funktioniert, bis er abläuft.",

    "forgetAccount.title": "Dein Konto vergessen",
    "forgetAccount.explanation":
      "Dein Name und deine E-Mail-Adresse können für immer unlesbar gemacht und dein Konto geschlossen werden. Damit wir sicher sind, dass du es bist, schicken wir zuerst einen Link an die Adresse deines Kontos, und nichts wird vergessen, bevor du ihm folgst.",
    "forgetAccount.submit": "Schick mir den Link",
    "forgetAccount.sent.title": "Sieh in deinem Postfach nach",
    "forgetAccount.sent.explanation":
      "Wir haben einen Link an die Adresse deines Kontos geschickt. Er funktioniert 15 Minuten lang und nur, solange du in diesem Konto angemeldet bist.",
    "forgetAccount.confirm.title": "Dein Konto für immer vergessen?",
    "forgetAccount.confirm.explanation":
      "Sobald es vergessen ist, kann niemand mehr deinen Namen oder deine E-Mail-Adresse lesen, und niemand kann sich mehr in deinem Konto anmelden. Das lässt sich nicht rückgängig machen.",
    "forgetAccount.confirm.submit": "Mein Konto vergessen",
    "forgetAccount.forgotten.title": "Dein Konto wurde vergessen",
    "forgetAccount.forgotten.explanation":
      "Dein Name und deine E-Mail-Adresse sind nicht mehr lesbar, und du wurdest überall abgemeldet, wo du angemeldet warst.",
    "forgetAccount.noLongerWorks.title": "Dieser Link funktioniert nicht mehr",
    "forgetAccount.noLongerWorks.explanation":
      "Vielleicht ist er abgelaufen, wurde schon benutzt oder gehört zu einem Konto, in dem du nicht angemeldet bist. Fordere ihn in deinem Konto erneut an, wenn es noch vergessen werden soll.",
    "forgetAccount.lastAdministrator.title":
      "Dein Konto kann nicht vergessen werden",
    "forgetAccount.lastAdministrator.explanation":
      "Du bist der einzige Administrator dieser Website. Gib die Administratorrolle an jemand anderen, danach kann dein Konto vergessen werden.",
    "forgetAccount.askAgain": "Erneut anfordern",
    "forgetAccount.home": "Zurück zu {siteName}",

    "registrationsSuspended.title": "Die Registrierung ist vorerst ausgesetzt",
    "registrationsSuspended.explanation":
      "Ein Dienst, den die Registrierung braucht, ist gerade nicht erreichbar, deshalb kann sich niemand registrieren, bis er wieder antwortet. Von dem, was du eingegeben hast, wurde nichts gespeichert.",
    "registrationsSuspended.tryAgainLater":
      "Versuche es in einer Weile noch einmal. Der Administrator der Website wurde benachrichtigt.",
    "registrationsSuspended.home": "Zurück zu {siteName}",

    "signIn.title": "Anmelden",
    "signIn.emailAddress": "E-Mail-Adresse",
    "signIn.password": "Passwort",
    "signIn.submit": "Anmelden",
    "signIn.forgotPassword": "Passwort vergessen?",
    "signIn.register": "Registrieren",
    "signIn.withGoogle": "Mit Google anmelden",
    "signIn.or": "oder",
    "signIn.tryAgainLater":
      "Es gab in letzter Zeit zu viele Versuche. Warte eine Stunde und versuche es dann noch einmal.",

    "SignIn.Failed":
      "Die E-Mail-Adresse oder das Passwort ist nicht richtig. Versuche es noch einmal.",

    "profile.title": "Profil",
    "profile.name": "Name:",
    "profile.emailAddress": "E-Mail-Adresse:",

    "changeName.title": "Namen ändern",
    "changeName.name": "Name",
    "changeName.submit": "Namen ändern",

    "setPassword.title": "Passwort festlegen",
    "setPassword.explanation":
      "Dein Konto hat kein Passwort: Du meldest dich mit Google an. Damit du dich auch mit einem Passwort anmelden kannst, schicken wir einen Link zum Festlegen an {emailAddress}.",
    "setPassword.submit": "Schick mir einen Link",
    "setPassword.sent.title": "Sieh in deinem Postfach nach",
    "setPassword.sent.explanation":
      "Wir haben dir einen Link zum Festlegen eines Passworts geschickt. Er funktioniert eine Stunde lang.",
    "setPassword.profile": "Zurück zu deinem Profil",

    "changePassword.title": "Passwort ändern",
    "changePassword.currentPassword": "Aktuelles Passwort",
    "changePassword.password": "Neues Passwort",
    "changePassword.passwordConfirmation": "Passwort bestätigen",
    "changePassword.forgotPassword": "Passwort vergessen?",
    "changePassword.submit": "Passwort ändern",
    "ChangePassword.WrongPassword": "Das ist nicht dein Passwort.",

    "changeEmailAddress.title": "E-Mail-Adresse ändern",
    "changeEmailAddress.emailAddress": "Neue E-Mail-Adresse",
    "changeEmailAddress.currentPassword": "Aktuelles Passwort",
    "changeEmailAddress.submit": "Bestätigungslink senden",
    "changeEmailAddress.sent.title": "Sieh in deinem Postfach nach",
    "changeEmailAddress.sent.explanation":
      "An die neue E-Mail-Adresse wurde ein Link zum Bestätigen des Umzugs geschickt. Folge ihm, während du angemeldet bist, um dein Konto dorthin zu verschieben.",
    "changeEmailAddress.confirm.title": "Dein Konto verschieben",
    "changeEmailAddress.confirm.explanation":
      "Dein Konto wird nach {emailAddress} verschoben. Ab jetzt meldest du dich mit dieser Adresse an.",
    "changeEmailAddress.confirm.submit": "Mein Konto verschieben",
    "changeEmailAddress.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "changeEmailAddress.noLongerWorks.explanation":
      "Er ist abgelaufen, wurde schon benutzt oder wurde nicht für das Konto geschickt, in dem du angemeldet bist. Fordere ihn in deinem Profil erneut an.",
    "changeEmailAddress.taken.title": "Dein Konto wurde nicht verschoben",
    "changeEmailAddress.profile": "Zurück zu deinem Profil",
    "ChangeEmailAddress.WrongPassword": "Das ist nicht dein Passwort.",
    "ChangeEmailAddress.Unchanged":
      "Dein Konto gehört schon zu dieser Adresse.",
    "ChangeEmailAddress.Taken":
      "Zu dieser E-Mail-Adresse gibt es bereits ein eigenes Konto, deshalb kann deines nicht dorthin verschoben werden.",

    "confirmEmailAddress.title": "Bestätige deine E-Mail-Adresse",
    "confirmEmailAddress.name": "Name",
    "confirmEmailAddress.password": "Passwort",
    "confirmEmailAddress.confirmPassword": "Passwort bestätigen",
    "confirmEmailAddress.submit": "Meine E-Mail-Adresse bestätigen",
    "confirmEmailAddress.signIn": "Anmelden",
    "confirmEmailAddress.home": "Zurück zu {siteName}",
    "confirmEmailAddress.confirmed.title": "Deine E-Mail-Adresse ist bestätigt",
    "confirmEmailAddress.confirmed.explanation":
      "Dein Konto ist bereit. Melde dich mit der E-Mail-Adresse und dem Passwort an, die du gerade angegeben hast.",
    "confirmEmailAddress.expired.title": "Dieser Link ist abgelaufen",
    "confirmEmailAddress.expired.explanation":
      "Ein Link zum Bestätigen einer E-Mail-Adresse funktioniert 24 Stunden lang. Fordere einen neuen an, er wird an dieselbe Adresse geschickt.",
    "confirmEmailAddress.expired.newLink": "Schick mir einen neuen Link",
    "confirmEmailAddress.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Prüfe, ob du dem vollständigen Link aus der E-Mail gefolgt bist und am Ende nichts fehlt. Wenn er immer noch nicht funktioniert, registriere dich erneut, dann wird dir ein neuer Link geschickt.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Diese E-Mail-Adresse ist bereits bestätigt",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Es gibt nichts mehr zu tun. Melde dich mit dem Passwort an, das du beim Bestätigen angegeben hast.",

    "PersonName.Missing": "Gib einen Namen ein.",
    "PersonName.TooShort": "Ein Name muss mindestens 3 Zeichen lang sein.",
    "PersonName.TooLong": "Ein Name darf höchstens 254 Zeichen lang sein.",
    "WorldRankingName.TooShort":
      "Der Name in der Weltrangliste muss mindestens 3 Zeichen lang sein.",
    "WorldRankingName.TooLong":
      "Der Name in der Weltrangliste darf höchstens 254 Zeichen lang sein.",
    "Password.Missing": "Gib ein Passwort ein.",
    "Password.TooShort": "Ein Passwort muss mindestens 12 Zeichen lang sein.",
    "Password.ConfirmationDiffers":
      "Das stimmt nicht mit dem Passwort oben überein. Gib es noch einmal ein.",
    "Password.Breached":
      "Dieses Passwort ist bei einem Datenleck auf einer anderen Website aufgetaucht und deshalb hier nicht sicher. Wähle ein anderes.",

    "javaScriptRequired.title": "JavaScript ist erforderlich",
    "javaScriptRequired.explanation":
      "Zum Registrieren muss JavaScript für diese Website aktiviert sein, damit geprüft werden kann, dass sich ein Mensch registriert. Aktiviere es und registriere dich noch einmal.",
    "javaScriptRequired.register": "Zurück zur Registrierung",
    "javaScriptRequired.home": "Zurück zu {siteName}",

    "errors.backHome": "Zurück zu {siteName}",
    "errors.notFound": "Nicht gefunden",
    "errors.refused": "Das ging nicht",
    "errors.refusedDetail":
      "Etwas von dem, was gesendet wurde, war nicht in Ordnung.",
    "errors.sorry": "Das tut uns leid",
    "errors.sorryDetail": "Diese Anfrage konnte nicht bearbeitet werden.",
    "errors.failed": "Etwas ist schiefgegangen",
    "errors.reference": "Referenz {reference}.",
    "errors.recorded":
      "Der Fehler wurde protokolliert und eine E-Mail an den Administrator gesendet. Es hilft, dem Administrator eine E-Mail mit der Referenz und einer Beschreibung zu schicken, was du gerade gemacht hast.",
    "errors.message": "E-Mail an den Administrator",
    "errors.messageSubject": "Fehler {reference} auf {siteName}",
    "errors.messageBody": "Was ich gemacht habe, als das passiert ist:\n\n",
    "errors.unavailable": "Die Website ist nicht verfügbar",
    "errors.unavailableDetail":
      "Die Website kann im Moment nicht erreichen, was sie braucht. Bitte versuche es später noch einmal.",
    "errors.maintenance":
      "Die Seite ist wegen Wartungsarbeiten nicht verfügbar.",
    "errors.maintenanceMinutes":
      "Sie sollte in {minutes} Minuten wieder da sein.",
    "errors.maintenanceMinute": "Sie sollte in 1 Minute wieder da sein.",
    "errors.maintenanceLonger":
      "Es dauert länger als erwartet; die Seite ist bald wieder da.",

    "home.recentResults": "Aktuelle Ergebnisse",
    "home.recentResults.none":
      "In den letzten sieben Tagen wurde kein Spiel hinzugefügt.",
    "home.upcomingTournaments": "Kommende Turniere",
    "home.upcomingTournaments.none":
      "In den nächsten sechzig Tagen beginnt kein Turnier.",
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Name",
    "tournamentList.onlyIn": "Nur Turniere in {country}",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Jedes Land",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Jede Region",
    "tournamentList.filter.sport": "Sportart",
    "tournamentList.filter.anySport": "Jede Sportart",
    "tournamentList.filter.submit": "Filtern",
    "home.allTournaments": "Alle Turniere {year}",
    "year.heading": "Turniere {year}",
    "year.none": "{year} beginnt kein Turnier.",
    "yearSport.heading": "{sport}-Turniere {year}",
    "yearSport.none": "{year} beginnt kein {sport}-Turnier.",
    "tournament.recent": "Aktuell",
    "tournament.summary": "Übersicht",
    "test.bestOf": "Jede Begegnung geht über höchstens {count} Spiele.",
    "test.vs": "gegen",
    "test.matches": "Begegnungen",
    "test.games": "Spiele",
    "test.hoops": "Tore",
    "teamSummary.tests": "Tests",
    "teamSummary.matches": "Begegnungen",
    "teamSummary.games": "Spiele",
    "teamSummary.hoops": "Tore",
    "teamSummary.wins": "Siege",
    "teamSummary.losses": "Niederlagen",
    "teamSummary.draws": "Unentschieden",
    "teamSummary.for": "Für",
    "teamSummary.against": "Gegen",
    "teamSummary.net": "Differenz",
    "tournament.players": "Spieler",
    "search.label": "Suchen",
    "search.tournaments": "Turniere",
    "search.competitions": "Wettbewerbe",
    "search.nothingFound": "Nichts gefunden.",
    "players.search.label": "Spieler suchen",
    "players.search.prompt":
      "Gib den Namen eines Spielers ein, um ihn zu finden.",
    "players.search.none": "Keine Spieler gefunden.",
    "search.more":
      "Es werden nur die ersten {count} angezeigt. Gib mehr vom Namen ein, um die Suche einzugrenzen.",
    "websitePlayer.tournament": "Turnier",
    "tournament.test": "{first} gegen {second}",
    "tournament.notes": "Hinweise",
    "tournament.commentary": "Kommentare",
    "tournament.beat": "schlug",
    "tournament.drewWith": "spielte unentschieden gegen",
    "tournament.ago.seconds": "{count} Sek.",
    "tournament.ago.minutes": "{count} Min.",
    "tournament.ago.hour": "1 Stunde",
    "tournament.ago.hours": "{count} Stunden",
    "tournament.none": "Es wurde noch kein Spiel gespielt.",
    "players.none": "Es wurde noch kein Spieler hinzugefügt.",
    "commentaries.by": "von",
    "commentaries.start": "Neuen Kommentarstrang beginnen",
    "commentaries.disclaimer.heading": "Hinweis",
    "commentaries.disclaimer":
      "Die in diesen Kommentaren geäußerten Meinungen sind die ihrer Verfasser und geben nicht unbedingt die von Tim Murphy oder {site} wieder.",
    "commentaries.guidelines.heading": "Richtlinien",
    "commentaries.guidelines.responsible":
      "Du bist für deine Kommentare selbst verantwortlich.",
    "commentaries.guidelines.purpose":
      "Kommentare dienen dazu, zu berichten, was im Turnier passiert. Sie sind nicht als „soziales Netzwerk“ gedacht, um Glückwünsche und Ähnliches auszutauschen.",
    "commentaries.guidelines.hatred":
      "Schreibe nichts, was zu Gewalt oder Hass aufstacheln könnte. Kommentare, die andere wegen ihrer Rasse, Religion, ethnischen Herkunft, ihres Geschlechts, Alters, ihrer geistigen oder körperlichen Behinderung oder ihrer sexuellen Orientierung herabsetzen, dulden wir nicht.",
    "commentaries.guidelines.abuse":
      "Grundlose Beschimpfungen werden nicht geduldet. Die Faustregel lautet: den Ball spielen und nicht den Mann, also niemanden persönlich angreifen, sondern bei der Sache bleiben.",
    "commentaries.guidelines.unlawful":
      "Kommentare, die rechtlich fragwürdig sind, etwa mögliche Urheberrechtsverletzungen oder Inhalte, die verleumderisch sein könnten, werden entfernt.",
    "commentaries.guidelines.shouting":
      "Bitte fluche in Kommentaren nicht und schreibe nicht alles in Großbuchstaben.",
    "commentaries.guidelines.selling":
      "Nutze Kommentare nicht für Werbung oder Spam. Kommentare, die Waren oder Dienstleistungen bewerben, anpreisen oder anbieten, werden entfernt.",
    "commentaries.guidelines.links":
      "Bitte beschränke Links in Kommentaren. Kommentare mit Links auf unangemessene Inhalte werden entfernt.",
    "commentaries.guidelines.impersonating":
      "Gib dich in Kommentaren nicht als andere aus und veröffentliche keine persönlichen Daten – Telefonnummern, Post- oder E-Mail-Adressen –, die jemanden unbeabsichtigt gefährden könnten.",
    "commentaries.reporting.heading": "Kommentare melden",
    "commentaries.reporting.before":
      "Bitte melde Kommentare, die diese Richtlinien nicht erfüllen, an",
    "commentaries.reporting.after":
      ". Nenne die Webadresse und den fragwürdigen Kommentar. Zum Beispiel:",
    "commentaries.reporting.exampleComment":
      "„ein Kommentar, der entfernt werden sollte“",
    "commentaries.reporting.exampleReason":
      "Dieser Kommentar sollte entfernt werden, weil ...",
    "commentaries.reporting.reviewed":
      "Eine Meldung bedeutet nicht, dass ein Kommentar automatisch entfernt wird, aber alle Meldungen werden geprüft.",
    "commentaries.reporting.reserved":
      "{site} behält sich das Recht vor, Kommentare zu entfernen.",
    "commentaries.reporting.subject": "{site} Kommentar-Meldung",
    "commentaries.reporting.body":
      "Bitte nenne die Webadresse, den fragwürdigen Kommentar und den Grund, warum er entfernt werden sollte.",
    "startCommentary.title": "Neuen Kommentarstrang beginnen",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Kommentarstrang beginnen",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Die Turnierleitung hat noch keine Hinweise geschrieben.",
    "marks.new": "neu",
    "note.edited": "bearbeitet",
    "commentary.none": "Es wurde noch nichts geschrieben.",
    "commentary.edited": "bearbeitet",
    "commentary.edit": "Bearbeiten",
    "commentary.delete": "Löschen",
    "commentary.comment": "Kommentar",
    "commentary.add": "Hinzufügen",
    "commentary.notSent":
      "Der Kommentar konnte nicht gesendet werden. Lade die Seite neu, um zu sehen, ob er gespeichert wurde.",
    "changeCommentaryTitle.title": "Titel ändern",
    "changeCommentaryTitle.submit": "Speichern",
    "editComment.title": "Kommentar bearbeiten",
    "editComment.save": "Speichern",
    "deleteComment.title": "Kommentar löschen",
    "deleteComment.question":
      "Diesen Kommentar löschen? Das lässt sich nicht rückgängig machen.",
    "deleteComment.confirm": "Kommentar löschen",
    "deleteComment.keep": "Behalten",
    "player.games": "Spiele",
    "player.competitions": "Wettbewerbe",
    "player.beat": "schlug",
    "player.lostTo": "verlor gegen",
    "player.drewWith": "spielte unentschieden gegen",
    "player.score": "{score} zu {opponent}",
    "player.noGames": "Es wurde noch kein Spiel gespielt.",
    "player.noCompetitions": "Noch für keinen Wettbewerb gemeldet.",
    "block.wins": "Siege",
    "block.matches": "Begegnungen",
    "block.netGames": "Spieldifferenz",
    "block.games": "Spiele",
    "block.netHoops": "Tordifferenz",
    "block.won": "gewonnen",
    "block.lost": "verloren",
    "block.drawn": "unentschieden",
    "block.withdrawn": "zurückgezogen",
    "block.gameWithdrawn": "zurückgezogen",
    "block.losses": "Niederlagen",
    "competition.views": "Ansichten",
    "competition.view.grid": "Tabelle",
    "competition.view.summary": "Übersicht",
    "competition.view.orderOfPlay": "Spielplan",
    "blockSummary.ranking":
      "Gereiht nach dem Anteil gewonnener Begegnungen und dann nach der Tordifferenz. Die Regeln eines Turniers können seine Spieler anders ordnen.",
    "orderOfPlay.none": "Es wurde noch kein Spiel gespielt.",
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Halbfinale",
    "knockout.round.quarters": "Viertelfinale",
    "knockout.round.number": "Runde {number}",
    "knockout.bye": "Freilos",
    "swiss.games": "Spiele",
    "swiss.wins": "Siege",
    "swiss.winShare": "Siegquote",
    "swiss.results": "Ergebnisse",
    "knockout.onward": "Spätere Runden",
    "knockout.back": "Frühere Runden",
    "years.label": "Jahre",
    "years.earlier": "Frühere Jahre",

    "admin.newerBuild.message": "Es gibt eine neuere Version dieser Website.",
    "admin.newerBuild.reload": "Neu laden",
    "admin.title": "Verwaltung",
    "admin.tournaments.new": "Neues Turnier",
    "admin.tournaments.none": "Keine Turniere",
    "admin.tournaments.archived": "Archiviert",
    "admin.tournaments.manage": "Verwalten",
    "admin.tournaments.edit": "Bearbeiten",
    "admin.tournaments.archive": "Archivieren",
    "admin.tournaments.restore": "Wiederherstellen",
    "admin.tournaments.scores": "Ergebnisse",
    "admin.tournaments.players": "Spieler",
    "admin.years.label": "Jahre",
    "admin.years.earlier": "Frühere Jahre",
    "admin.tournament.name": "Name",
    "admin.tournament.starts": "Beginn",
    "admin.tournament.finishes": "Ende",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sportart",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Untertitel",
    "admin.tournament.handicap": "Mit Handicap gespielt",
    "admin.tournament.drawsAllowed": "Unentschieden erlaubt",
    "admin.tournament.levelTestsDrawn":
      "Ausgeglichene Tests gelten als unentschieden",
    "admin.tournament.worldRankings": "Zählt für die Weltrangliste",
    "admin.tournament.national": "Veranstaltung auf nationaler Ebene",
    "admin.tournament.international": "Veranstaltung auf internationaler Ebene",
    "admin.tournament.otherwise": "Das kann so nicht angenommen werden.",
    "admin.newTournament.title": "Neues Turnier",
    "admin.newTournament.submit": "Turnier anlegen",
    "admin.editTournament.title": "Turnier bearbeiten",
    "admin.editTournament.submit": "Turnier aktualisieren",
    "admin.editTournament.otherwise":
      "Dieses Turnier kann nicht geändert werden.",
    "admin.view.tabs": "Turnier",
    "admin.view.players": "Spieler",
    "admin.view.competitions": "Wettbewerbe",
    "admin.view.managers": "Turnierleitung",
    "admin.view.notes": "Hinweise",
    "admin.view.scorers": "Ergebniserfasser",
    "admin.view.rankings": "Ranglisten",
    "admin.rankings.textFile":
      "Die Ergebnisse des Turniers werden der Weltrangliste als Textdatei geschickt, die die Website aus den eingegebenen Spielen erstellt.",
    "admin.rankings.spreadsheet":
      "Die Ergebnisse des Turniers werden der Weltrangliste als Tabelle geschickt, die die Website aus den eingegebenen Spielen erstellt.",
    "admin.rankings.fillInWinners":
      "Die Website kann nur raten, wer jeden Wettbewerb gewonnen hat. Prüfen Sie daher die Zeile Winner jedes Wettbewerbs, bevor Sie die Datei senden.",
    "admin.rankings.fillInWinner":
      "Die Website kann nicht wissen, wer das Turnier gewonnen hat. Tragen Sie es daher unten in der Tabelle ein, bevor Sie sie senden.",
    "admin.rankings.sendIt":
      "Senden Sie die Datei dann an die Verantwortlichen der Weltrangliste.",
    "admin.rankings.download": "Ranglisten herunterladen",
    "rankings.notAvailable": "Ranglisten sind nicht verfügbar",
    "rankings.notAvailable.sport":
      "Die Sportart dieses Turniers hat keine Weltrangliste, daher gibt es keine Ranglisten zu senden.",
    "rankings.notAvailable.handicap":
      "Dieses Turnier wird mit Vorgabe gespielt und zählt daher nicht für die Weltrangliste.",
    "rankings.notAvailable.drawnGames":
      "Dieses Turnier erlaubt Unentschieden und zählt daher nicht für die Weltrangliste.",
    "rankings.notAvailable.notCounted":
      "Der Veranstalter dieses Turniers hat festgelegt, dass es nicht für die Weltrangliste zählt.",
    "admin.view.otherwise": "Dieses Turnier kann hier nicht verwaltet werden.",
    "admin.competitionView.tabs": "Wettbewerb",
    "admin.competitionView.players": "Spieler",
    "admin.competitionView.scores": "Ergebnisse",
    "admin.sections.label": "Das Turnier und seine Wettbewerbe",
    "admin.sections.tournament": "Turnier",
    "admin.administrator.sections.label": "Die Seiten der Administration",
    "admin.administrator.sections.tournaments": "Turniere",
    "admin.administrator.sections.accounts": "Konten",
    "admin.administrator.sections.worldRankings": "Weltrangliste",
    "admin.administrator.sections.importErrors": "Importfehler",
    "admin.administrator.sections.logs": "Protokolle",
    "admin.administrator.title": "Administrator",
    "admin.accounts.title": "Konten",
    "admin.roles.add": "Hinzufügen",
    "admin.roles.administrator.heading": "Administratoren",
    "admin.roles.administrator.none": "Keine anderen Administratoren",
    "admin.roles.administrator.removeTitle": "Administrator entfernen",
    "admin.roles.administrator.removeExplanation":
      "{name} ist danach kein Administrator dieser Website mehr.",
    "admin.roles.world-ranking-officer.heading":
      "Verantwortliche für die Weltrangliste",
    "admin.roles.world-ranking-officer.none":
      "Keine Verantwortlichen für die Weltrangliste",
    "admin.roles.world-ranking-officer.removeTitle":
      "Verantwortliche für die Weltrangliste entfernen",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} ist danach nicht mehr für die Weltrangliste verantwortlich.",
    "admin.worldRankings.title": "Spieler der Weltrangliste importieren",
    "admin.worldRankings.import": "Importieren",
    "admin.worldRankings.log": "Wie der Import verlaufen ist",
    "admin.worldRankings.ac.reading":
      "Die Liste für Association Croquet wird gelesen",
    "admin.worldRankings.ac.read":
      "Gelesene Spieler für Association Croquet: {players}",
    "admin.worldRankings.ac.kept":
      "Gespeicherte Spieler für Association Croquet: {players}",
    "admin.worldRankings.ac.refused":
      "Die Liste für Association Croquet konnte nicht gelesen werden, deshalb blieben ihre Spieler, wie sie waren.",
    "admin.worldRankings.gc.reading": "Die Liste für Golf Croquet wird gelesen",
    "admin.worldRankings.gc.read":
      "Gelesene Spieler für Golf Croquet: {players}",
    "admin.worldRankings.gc.kept":
      "Gespeicherte Spieler für Golf Croquet: {players}",
    "admin.worldRankings.gc.refused":
      "Die Liste für Golf Croquet konnte nicht gelesen werden, deshalb blieben ihre Spieler, wie sie waren.",
    "admin.worldRankings.finished": "Fertig",
    "admin.worldRankings.failed": "Der Import wurde nicht abgeschlossen.",
    "admin.worldRankings.otherwise":
      "Auf der Website ist etwas schiefgegangen.",
    "WorldRankingLists.Unreachable":
      "Die Website der Weltrangliste war nicht erreichbar.",
    "WorldRankingLists.Unreadable":
      "Die Liste hat nicht die Form der Listen der Weltrangliste: Eine Zeile konnte nicht gelesen werden, sie enthält niemanden oder ist nicht in UTF-8 geschrieben.",
    "admin.importErrors.title": "Importfehler",
    "admin.importErrors.none": "Keine Importfehler",
    "admin.importErrors.otherwise": "Auf der Website ist etwas schiefgegangen.",
    "admin.logs.title": "Protokolle",
    "admin.logs.severity": "Schweregrad",
    "admin.logs.text": "Suchen",
    "admin.logs.show": "Anzeigen",
    "admin.logs.prune": "Bereinigen",
    "admin.logs.pruneAsk":
      "Das Protokoll von vor der letzten Stunde entfernen? Nichts bringt es zurück.",
    "admin.logs.removed": "{count} Einträge wurden entfernt",
    "admin.logs.none": "Keine Protokolleinträge",
    "admin.logs.otherwise": "Auf der Website ist etwas schiefgegangen.",
    "admin.hover.logs.show": "Die passenden Einträge anzeigen",
    "admin.hover.logs.prune":
      "Das Protokoll von vor der letzten Stunde entfernen",
    "admin.hover.logs.pruneAgree":
      "Das Protokoll von vor der letzten Stunde entfernen",
    "admin.importError.title": "Importfehler",
    "admin.importError.documentId": "Dokument-ID",
    "admin.importError.tournament": "Turnier",
    "admin.importError.competition": "Wettbewerb",
    "admin.importError.newSite": "Neue Website",
    "admin.importError.oldSite": "Alte Website",
    "ImportErrorKept.NotFound":
      "Der Import hat zu diesem Dokument keinen Fehler gespeichert.",
    "admin.competitionView.otherwise":
      "Dieser Wettbewerb kann hier nicht verwaltet werden.",
    "admin.competitions.block": "Gruppe",
    "admin.competitions.knockout": "K.-o.-Runde",
    "admin.competitions.swiss": "Schweizer System",
    "admin.competitions.view": "Ansehen",
    "admin.competitions.edit": "Bearbeiten",
    "admin.competitions.up": "Nach oben",
    "admin.competitions.down": "Nach unten",
    "admin.competitions.archive": "Archivieren",
    "admin.competitions.restore": "Wiederherstellen",
    "admin.competitions.archived": "Archivierte Wettbewerbe",
    "admin.competitions.none": "Keine Wettbewerbe",
    "admin.competitions.add": "Wettbewerb hinzufügen",
    // The competition dialog.
    "admin.competition.addTitle": "Wettbewerb hinzufügen",
    "admin.competition.editTitle": "Wettbewerb bearbeiten",
    "admin.competition.name": "Name",
    "admin.competition.kind": "Art",
    "admin.competition.bestOf": "Best of",
    "admin.competition.rounds": "Runden",
    "admin.competition.places": "Plätze",
    "admin.competition.round": "Runde {number}",
    "admin.competition.bestOfs": "Best of",
    "admin.competition.quarters": "Viertelfinale",
    "admin.competition.semis": "Halbfinale",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Hinzufügen",
    "admin.competition.save": "Speichern",
    "admin.competition.added": "{name} wurde hinzugefügt.",
    "admin.competition.otherwise":
      "Dieser Wettbewerb kann so nicht gespeichert werden.",
    "CompetitionName.Missing": "Gib einen Namen ein.",
    "CompetitionName.TooLong": "Ein Name darf höchstens 254 Zeichen lang sein.",
    "CompetitionName.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    "Tournament.KnockoutPlayerHasGames":
      "Spieler dieser Runde haben Begegnungen, deshalb können ihre Plätze nicht geändert werden.",
    "Tournament.CompetitionNameTaken":
      "Ein anderer Wettbewerb dieses Turniers hat schon diesen Namen.",
    "BestOf.NotWhole": "Gib eine ganze Zahl von Spielen ein.",
    "BestOf.TooSmall": "Eine Begegnung muss mindestens über 1 Spiel gehen.",
    "Rounds.NotWhole": "Gib eine ganze Zahl an Runden ein.",
    "Rounds.TooSmall":
      "Ein Block muss über mindestens 1 Runde gespielt werden.",
    "KnockoutDraw.EvenBestOf":
      "Eine Begegnung in einer K.-o.-Runde braucht einen Sieger, deshalb geht sie über eine ungerade Zahl von Spielen.",
    "admin.hover.tournaments.new": "Ein neues Turnier anlegen",
    "admin.hover.tournaments.manage":
      "Die Spieler, Mannschaften, Wettbewerbe und Ergebnisse dieses Turniers verwalten",
    "admin.hover.tournaments.edit": "Die Angaben zu diesem Turnier ändern",
    "admin.hover.tournaments.scores": "Die Ergebnisse dieses Turniers eingeben",
    "admin.hover.tournaments.players": "Die Spieler dieses Turniers verwalten",
    "admin.hover.competitions.view":
      "Diesen Wettbewerb öffnen, um seine Spieler und Ergebnisse zu sehen und einzugeben",
    "admin.hover.tests.view":
      "Diesen Test öffnen, um seine Ergebnisse zu sehen und einzugeben",
    "admin.hover.teams.view":
      "Diese Mannschaft öffnen, um ihre Spieler zu sehen und zu verwalten",
    "admin.hover.dialog.player.add": "Diesen Spieler zum Turnier hinzufügen",
    "admin.hover.dialog.player.save":
      "Die Änderungen an diesem Spieler speichern",
    "admin.hover.dialog.team.add": "Diese Mannschaft zum Turnier hinzufügen",
    "admin.hover.dialog.team.save":
      "Die Änderungen an dieser Mannschaft speichern",
    "admin.hover.dialog.test.add": "Diesen Test zum Turnier hinzufügen",
    "admin.hover.dialog.test.save": "Die Änderungen an diesem Test speichern",
    "admin.hover.dialog.competition.add":
      "Diesen Wettbewerb zum Turnier hinzufügen",
    "admin.hover.dialog.competition.save":
      "Die Änderungen an diesem Wettbewerb speichern",
    "admin.hover.dialog.score.add": "Dieses Ergebnis zum Wettbewerb hinzufügen",
    "admin.hover.dialog.score.save":
      "Die Korrektur dieses Ergebnisses speichern",
    "admin.hover.dialog.carryForward.save":
      "Die Ergebnisse dieses Spielers übertragen",
    "admin.hover.dialog.tournament.new": "Dieses Turnier anlegen",
    "admin.hover.dialog.tournament.edit":
      "Die Änderungen an diesem Turnier speichern",
    "admin.hover.modal.cancel": "Dies schließen, ohne etwas zu speichern",
    "admin.hover.modal.ok": "Diese Meldung schließen",
    "admin.hover.tab": "Den Reiter {name} anzeigen",
    "admin.hover.tournaments.archive":
      "Dieses Turnier archivieren; es lässt sich wiederherstellen",
    "admin.hover.tournaments.restore": "Dieses archivierte Turnier zurückholen",
    "admin.hover.players.add": "Einen Spieler zu diesem Turnier hinzufügen",
    "admin.hover.players.edit": "Die Angaben zu diesem Spieler ändern",
    "admin.hover.players.up": "Diesen Spieler in der Liste nach oben schieben",
    "admin.hover.players.down":
      "Diesen Spieler in der Liste nach unten schieben",
    "admin.hover.players.archive":
      "Diesen Spieler archivieren; er lässt sich wiederherstellen",
    "admin.hover.players.restore": "Diesen archivierten Spieler zurückholen",
    "admin.hover.teams.add": "Eine Mannschaft zu diesem Turnier hinzufügen",
    "admin.hover.teams.edit": "Die Angaben zu dieser Mannschaft ändern",
    "admin.hover.teams.up": "Diese Mannschaft in der Liste nach oben schieben",
    "admin.hover.teams.down":
      "Diese Mannschaft in der Liste nach unten schieben",
    "admin.hover.teams.archive":
      "Diese Mannschaft archivieren; sie lässt sich wiederherstellen",
    "admin.hover.teams.restore": "Diese archivierte Mannschaft zurückholen",
    "admin.hover.competitions.add":
      "Einen Wettbewerb zu diesem Turnier hinzufügen",
    "admin.hover.competitions.edit": "Die Angaben zu diesem Wettbewerb ändern",
    "admin.hover.competitions.up":
      "Diesen Wettbewerb in der Liste nach oben schieben",
    "admin.hover.competitions.down":
      "Diesen Wettbewerb in der Liste nach unten schieben",
    "admin.hover.competitions.archive":
      "Diesen Wettbewerb archivieren; er lässt sich wiederherstellen",
    "admin.hover.competitions.restore":
      "Diesen archivierten Wettbewerb zurückholen",
    "admin.hover.tests.add": "Einen Test zwischen zwei Mannschaften hinzufügen",
    "admin.hover.tests.edit": "Die Angaben zu diesem Test ändern",
    "admin.hover.tests.up": "Diesen Test in der Liste nach oben schieben",
    "admin.hover.tests.down": "Diesen Test in der Liste nach unten schieben",
    "admin.hover.tests.archive":
      "Diesen Test archivieren; er lässt sich wiederherstellen",
    "admin.hover.tests.restore": "Diesen archivierten Test zurückholen",
    "admin.hover.tests.toTeams":
      "Zum Reiter Mannschaften wechseln, um die Mannschaften hinzuzufügen, die ein Test braucht",
    "admin.hover.scores.add":
      "Das Ergebnis einer Begegnung zu diesem Wettbewerb hinzufügen",
    "admin.hover.scores.edit": "Dieses Ergebnis korrigieren",
    "admin.hover.scores.archive":
      "Dieses Ergebnis archivieren, damit es nicht mehr zählt; es lässt sich wiederherstellen",
    "admin.hover.scores.restore":
      "Dieses archivierte Ergebnis zurückholen, damit es wieder zählt",
    "admin.hover.scores.withdraw":
      "Dieses Ergebnis in der Liste lassen, aber nicht mehr zählen",
    "admin.hover.scores.unwithdraw":
      "Dieses zurückgezogene Ergebnis wieder zählen lassen",
    "admin.hover.scores.up": "Dieses Ergebnis in der Liste nach vorn schieben",
    "admin.hover.scores.down":
      "Dieses Ergebnis in der Liste nach hinten schieben",
    "admin.hover.competitionPlayers.add":
      "Den gewählten Spieler in diesen Wettbewerb aufnehmen",
    "admin.hover.competitionPlayers.up":
      "Diesen Spieler in der Liste nach oben schieben",
    "admin.hover.competitionPlayers.down":
      "Diesen Spieler in der Liste nach unten schieben",
    "admin.hover.competitionPlayers.remove":
      "Diesen Spieler aus dem Wettbewerb nehmen",
    "admin.hover.competitionPlayers.withdraw":
      "Diesen Spieler aus dem Wettbewerb zurückziehen",
    "admin.hover.competitionPlayers.unwithdraw":
      "Diesen zurückgezogenen Spieler wieder in den Wettbewerb aufnehmen",
    "admin.hover.competitionPlayers.carryForward":
      "Die Ergebnisse dieses Spielers aus einem anderen Wettbewerb übertragen",
    "admin.hover.notes.add": "Einen neuen Hinweis für dieses Turnier schreiben",
    "admin.hover.notes.edit": "Diesen Hinweis ändern",
    "admin.hover.notes.delete": "Diesen Hinweis löschen",
    "admin.hover.note.add":
      "Diesen Hinweis speichern und zum Turnier hinzufügen",
    "admin.hover.note.save": "Die Änderungen an diesem Hinweis speichern",
    "admin.hover.people.add": "Dieser Person die Rolle geben",
    "admin.hover.people.remove": "Dieser Person die Rolle nehmen",
    "admin.hover.worldRankings.import":
      "Die Weltranglisten abrufen und ihre Spieler hinzufügen",
    "admin.modal.cancel": "Abbrechen",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "E-Mail-Adresse",
    "admin.people.remove": "Entfernen",
    "admin.people.otherwise": "Das ging nicht.",
    "admin.managers.you": "Du",
    "admin.managers.add": "Turnierleiter hinzufügen",
    "admin.managers.none": "Keine Turnierleiter",
    "admin.managers.removeTitle": "Turnierleiter entfernen",
    "admin.managers.removeExplanation":
      "{name} kann dieses Turnier danach nicht mehr verwalten.",
    "admin.managers.removeYourself.explanation":
      "Du kannst dieses Turnier danach nicht mehr verwalten, und hier kann das niemand für dich rückgängig machen. Ein anderer Turnierleiter kann dich wieder zum Turnierleiter machen.",
    "admin.managers.otherwise":
      "Diese Adresse kann nicht zur Turnierleitung gemacht werden.",
    "admin.competitionPlayers.add": "Spieler hinzufügen",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Dieser Spieler kann nicht hinzugefügt werden.",
    "admin.competitionPlayers.choose": "Spieler zum Hinzufügen",
    "admin.competitionPlayers.nobody": "Wähle einen Spieler",
    "admin.competitionPlayers.bye": "Freilos",
    "admin.competitionPlayers.all": "Alle Spieler sind im Wettbewerb",
    "admin.competitionPlayers.none": "Keine Spieler",
    "admin.competitionPlayers.up": "Nach oben",
    "admin.competitionPlayers.down": "Nach unten",
    "admin.competitionPlayers.remove": "Entfernen",
    "admin.competitionPlayers.withdraw": "Zurückziehen",
    "admin.competitionPlayers.unwithdraw": "Rückzug aufheben",
    "admin.competitionPlayers.withdrawn": "Zurückgezogene Spieler",
    "admin.competitionPlayers.removeTitle": "Spieler entfernen",
    "admin.competitionPlayers.removeQuestion":
      "{name} wird aus dem Wettbewerb genommen. Das lässt sich nicht rückgängig machen.",
    "admin.competitionPlayers.withdrawTitle": "Spieler zurückziehen",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} spielt im Wettbewerb nicht weiter, und die nicht gespielten Spiele werden ohne seine Teilnahme entschieden.",
    "admin.competitionPlayers.carryForward": "Übertrag",
    "admin.carryForward.title": "Übertrag - {name}",
    "admin.carryForward.save": "Speichern",
    "admin.carryForward.otherwise":
      "Dieser Übertrag kann nicht gespeichert werden.",
    "admin.carryForward.matchWins": "Gewonnene Begegnungen",
    "admin.carryForward.matchLosses": "Verlorene Begegnungen",
    "admin.carryForward.gameWins": "Gewonnene Spiele",
    "admin.carryForward.gameLosses": "Verlorene Spiele",
    "admin.carryForward.hoopsFor": "Erzielte Tore",
    "admin.carryForward.hoopsAgainst": "Gegnerische Tore",
    "CarryForward.MatchWinsNotWhole":
      "Gib eine ganze Zahl gewonnener Begegnungen ein.",
    "CarryForward.MatchWinsBelowZero":
      "Gib 0 oder mehr gewonnene Begegnungen ein.",
    "CarryForward.MatchLossesNotWhole":
      "Gib eine ganze Zahl verlorener Begegnungen ein.",
    "CarryForward.MatchLossesBelowZero":
      "Gib 0 oder mehr verlorene Begegnungen ein.",
    "CarryForward.GameWinsNotWhole":
      "Gib eine ganze Zahl gewonnener Spiele ein.",
    "CarryForward.GameWinsBelowZero": "Gib 0 oder mehr gewonnene Spiele ein.",
    "CarryForward.GameLossesNotWhole":
      "Gib eine ganze Zahl verlorener Spiele ein.",
    "CarryForward.GameLossesBelowZero": "Gib 0 oder mehr verlorene Spiele ein.",
    "CarryForward.HoopsForNotWhole": "Gib eine ganze Zahl erzielter Tore ein.",
    "CarryForward.HoopsForBelowZero": "Gib 0 oder mehr erzielte Tore ein.",
    "CarryForward.HoopsAgainstNotWhole":
      "Gib eine ganze Zahl gegnerischer Tore ein.",
    "CarryForward.HoopsAgainstBelowZero":
      "Gib 0 oder mehr gegnerische Tore ein.",
    "admin.scores.add": "Ergebnis hinzufügen",
    "admin.scores.none": "Keine Ergebnisse",
    "admin.scores.edit": "Bearbeiten",
    "admin.scores.drawNotFilledTitle": "Auslosung unvollständig",
    "admin.scores.archive": "Archivieren",
    "admin.scores.up": "Nach oben",
    "admin.scores.down": "Nach unten",
    "admin.scores.restore": "Wiederherstellen",
    "admin.scores.archived": "Archivierte Ergebnisse",
    "admin.scores.archivedSaid": "Archiviert",
    "admin.scores.withdraw": "Zurückziehen",
    "admin.scores.unwithdraw": "Rückzug aufheben",
    "admin.scores.withdrawnSaid": "Zurückgezogen",
    "admin.scores.otherwise": "Das ging nicht.",
    "admin.score.title": "Ergebnis hinzufügen",
    "admin.score.add": "Spiel hinzufügen",
    "admin.score.winner": "Sieger",
    "admin.score.winnerScore": "Punkte des Siegers",
    "admin.score.loser": "Verlierer",
    "admin.score.loserScore": "Punkte des Verlierers",
    "admin.score.beat": "schlug",
    "admin.score.added":
      "Das Spiel, das {winner} gegen {loser} gewonnen hat, wurde hinzugefügt.",
    "admin.score.otherwise": "Das Spiel konnte nicht hinzugefügt werden.",
    "admin.score.correctTitle": "Ergebnis bearbeiten",
    "admin.score.save": "Speichern",
    "admin.score.notCorrected": "Das Ergebnis konnte nicht korrigiert werden.",
    "Game.WinnerMissing": "Wähle den Sieger.",
    "Game.WinnerScoreMissing": "Gib die Punkte des Siegers ein.",
    "Game.LoserMissing": "Wähle den Verlierer.",
    "Game.LoserScoreMissing": "Gib die Punkte des Verlierers ein.",
    "Score.NoPoints": "Punkte beginnen mit einer Zahl.",
    "Game.SamePlayer": "Niemand spielt gegen sich selbst.",
    "Game.WinnerNotAhead":
      "Die Punkte des Siegers müssen höher sein als die des Verlierers, oder als gewonnen markiert sein.",
    "Game.LoserMarked":
      "Die Punkte des Verlierers können nicht als gewonnen markiert werden.",
    "Game.ResultChanged":
      "Eine Korrektur behält das Ergebnis bei: Ein gewonnenes Spiel bleibt gewonnen, und ein unentschiedenes bleibt unentschieden.",
    "Competition.MatchDecided": "Ihre Begegnung ist bereits entschieden.",
    "Competition.DrawFull":
      "Der Spieler kann nicht hinzugefügt werden, weil die Auslosung voll ist.",
    "Competition.DrawNotFilled":
      "Ergebnisse können erst hinzugefügt werden, wenn jeder Platz der Auslosung einen Spieler oder ein Freilos hat.",
    "Competition.ByeOutsideKnockout":
      "Nur eine K.-o.-Runde kann Freilose haben.",
    "Competition.NotDrawnToMeet":
      "Diese Spieler sind in der K.-o.-Runde derzeit nicht gegeneinander gelost.",
    "Competition.WinnerHasPlayedOn":
      "Der Sieger dieser Begegnung hat seine nächste Begegnung schon gespielt, deshalb kann nicht mehr geändert werden, wer sie gewonnen hat.",
    "CompetitionPlayer.Withdrawn":
      "Ein zurückgezogener Spieler spielt nicht mehr.",
    "admin.players.add": "Spieler hinzufügen",
    "admin.players.none": "Keine Spieler",
    "admin.players.edit": "Bearbeiten",
    "admin.players.archive": "Archivieren",
    "admin.players.restore": "Wiederherstellen",
    "admin.players.up": "Nach oben",
    "admin.players.down": "Nach unten",
    "admin.players.archiveTitle": "Spieler archivieren",
    "admin.players.archiveQuestion":
      "{name} wird aus diesen Wettbewerben genommen:",
    "admin.players.archive.explanation":
      "Wird der Spieler wiederhergestellt, kommt er nicht in diese Wettbewerbe zurück.",
    "admin.players.archived": "Archivierte Spieler",
    "admin.players.archivedSaid": "Archiviert",
    "admin.player.addTitle": "Spieler hinzufügen",
    "admin.player.editTitle": "Spieler bearbeiten",
    "admin.player.name": "Name",
    "admin.player.representing": "Vertritt",
    "admin.player.worldRankingName": "Name in der Weltrangliste",
    "admin.player.worldRankingKnown": "Die Weltrangliste kennt diesen Namen.",
    "admin.player.worldRankingQuestioned":
      "Die Weltrangliste hat keinen Spieler mit diesem Namen. Vielleicht ist er falsch geschrieben, oder der Spieler ist neu in der Rangliste.",
    "admin.player.flag": "Flagge",
    "admin.player.add": "Hinzufügen",
    "admin.player.save": "Speichern",
    "admin.player.added": "{name} wurde hinzugefügt.",
    "admin.player.otherwise":
      "Dieser Spieler kann so nicht gespeichert werden.",
    "Tournament.PlayerNameTaken":
      "Ein anderer Spieler dieses Turniers hat schon diesen Namen.",
    "TournamentPlayer.NoSuchFlag": "Wähle eine der vorhandenen Flaggen.",
    "TournamentPlayer.NamedBye": "Ein Spieler kann nicht „Freilos“ heißen.",
    "TournamentPlayer.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    "admin.player.byesTitle": "Freilose werden nicht hinzugefügt",
    "admin.player.byes":
      "Ein Freilos ist kein Spieler des Turniers. Eine K.-o.-Runde bietet ein Freilos an, wenn ihre Spieler hinzugefügt werden, so oft, wie ihre Auslosung es braucht.",
    "admin.view.teams": "Mannschaften",
    "admin.view.tests": "Tests",
    "admin.teams.add": "Mannschaft hinzufügen",
    "admin.teams.none": "Keine Mannschaften",
    "admin.teams.edit": "Bearbeiten",
    "admin.teams.view": "Ansehen",
    "admin.teams.archive": "Archivieren",
    "admin.teams.restore": "Wiederherstellen",
    "admin.teams.up": "Nach oben",
    "admin.teams.down": "Nach unten",
    "admin.teams.archived": "Archivierte Mannschaften",
    "admin.teams.archivedSaid": "Archiviert",
    "admin.team.addTitle": "Mannschaft hinzufügen",
    "admin.team.editTitle": "Mannschaft bearbeiten",
    "admin.team.name": "Name",
    "admin.team.shortName": "Kurzname",
    "admin.team.shortName.explanation":
      "Wie die Tests der Mannschaft heißen, zum Beispiel AUS v ENG.",
    "admin.team.flag": "Flagge",
    "admin.team.add": "Hinzufügen",
    "admin.team.save": "Speichern",
    "admin.team.added": "{name} wurde hinzugefügt.",
    "admin.team.otherwise":
      "Diese Mannschaft kann so nicht gespeichert werden.",
    "admin.teamView.otherwise":
      "Diese Mannschaft kann hier nicht angesehen werden.",
    "admin.teamView.players": "Spieler",
    "TeamName.Missing": "Gib der Mannschaft einen Namen.",
    "TeamName.TooLong": "Dieser Name ist zu lang.",
    "admin.notes.add": "Hinweis hinzufügen",
    "admin.notes.none": "Keine Hinweise",
    "admin.notes.edit": "Bearbeiten",
    "admin.notes.delete": "Löschen",
    "admin.notes.deleteTitle": "Hinweis löschen",
    "admin.notes.deleteQuestion": "Den Hinweis „{title}“ löschen?",
    "admin.notes.delete.explanation":
      "Ein gelöschter Hinweis ist für immer weg und lässt sich nicht zurückholen.",
    "admin.notes.otherwise": "Das ging nicht.",
    "admin.note.addTitle": "Hinweis hinzufügen",
    "admin.note.editTitle": "Hinweis bearbeiten",
    "admin.note.title": "Titel",
    "admin.note.description": "Beschreibung",
    "admin.note.write": "Schreiben",
    "admin.note.preview": "Vorschau",
    "admin.note.toolbar": "Formatierung",
    "admin.note.tool.heading": "Überschrift",
    "admin.note.tool.bold": "Fett",
    "admin.note.tool.italic": "Kursiv",
    "admin.note.tool.quote": "Zitat",
    "admin.note.tool.code": "Code",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Nummerierte Liste",
    "admin.note.tool.bulletedList": "Aufzählung",
    "admin.note.tool.taskList": "Aufgabenliste",
    "admin.note.add": "Hinzufügen",
    "admin.note.save": "Speichern",
    "admin.note.otherwise": "Dieser Hinweis kann so nicht gespeichert werden.",
    "ManagerNoteTitle.Missing": "Gib dem Hinweis einen Titel.",
    "ManagerNoteTitle.TooLong": "Dieser Titel ist zu lang.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Ein Titel braucht einen Buchstaben oder eine Ziffer.",
    "ManagerNoteDescription.TooLong": "Diese Beschreibung ist zu lang.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Diesen Hinweis gibt es nicht mehr. Vielleicht hat ihn ein anderer Turnierleiter gelöscht.",
    "EditManagerNote.NoSuchManagerNote":
      "Diesen Hinweis gibt es nicht mehr. Vielleicht hat ihn ein anderer Turnierleiter gelöscht.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Diesen Hinweis gibt es nicht mehr. Vielleicht hat ihn ein anderer Turnierleiter gelöscht.",
    "ManagerNote.Deleted":
      "Dieser Hinweis wurde gelöscht. Vielleicht hat ihn ein anderer Turnierleiter gelöscht.",
    "CommentaryTitle.Missing": "Gib dem Kommentarstrang einen Titel.",
    "CommentaryTitle.TooLong": "Dieser Titel ist zu lang.",
    "CommentaryTitle.NoLetterOrDigit":
      "Ein Titel braucht einen Buchstaben oder eine Ziffer.",
    "Commentary.TitleTaken":
      "Ein anderer Kommentarstrang hat schon diesen Titel.",
    "CommentText.Missing": "Schreibe etwas in den Kommentar.",
    "CommentText.TooLong": "Dieser Kommentar ist zu lang.",
    "TeamShortName.Missing": "Gib der Mannschaft einen Kurznamen.",
    "TeamShortName.TooLong":
      "Ein Kurzname darf höchstens 10 Zeichen lang sein.",
    "TeamShortName.NoLetterOrDigit":
      "Ein Kurzname braucht einen Buchstaben oder eine Ziffer.",
    "Team.ShortNameLongerThanName":
      "Ein Kurzname darf nicht länger sein als der Name der Mannschaft.",
    "Team.NoSuchFlag": "Wähle eine der vorhandenen Flaggen.",
    "Team.Archived":
      "Diese Mannschaft ist archiviert und muss zuerst wiederhergestellt werden.",
    "Team.InATest":
      "Diese Mannschaft spielt in einem Test und kann nicht archiviert werden.",
    "Team.PlayerNameTaken":
      "Ein anderer Spieler dieser Mannschaft hat schon diesen Namen.",
    "TeamPlayer.NamedBye": "Ein Spieler kann nicht „Freilos“ heißen.",
    "TeamPlayer.Archived":
      "Dieser Spieler ist archiviert und muss zuerst wiederhergestellt werden.",
    "TeamPlayer.HasGames":
      "Dieser Spieler hat gespielt und kann nicht archiviert werden.",
    "Tournament.TeamNameTaken":
      "Eine andere Mannschaft dieses Turniers hat schon diesen Namen.",
    "Tournament.TeamShortNameTaken":
      "Eine andere Mannschaft dieses Turniers hat schon diesen Kurznamen.",
    "Tournament.NoSuchTeam":
      "Dieses Turnier hat unter dieser Adresse keine Mannschaft.",
    "Tournament.TeamArchived":
      "Diese Mannschaft ist archiviert und kann nur im Reiter Mannschaften wiederhergestellt werden.",
    "admin.tests.add": "Test hinzufügen",
    "admin.tests.none": "Keine Tests",
    "admin.tests.edit": "Bearbeiten",
    "admin.tests.view": "Ansehen",
    "admin.tests.archive": "Archivieren",
    "admin.tests.restore": "Wiederherstellen",
    "admin.tests.up": "Nach oben",
    "admin.tests.down": "Nach unten",
    "admin.tests.archived": "Archivierte Tests",
    "admin.tests.twoTeamsNeeded":
      "Ein Test findet zwischen zwei Mannschaften statt, deshalb braucht es zuerst zwei Mannschaften.",
    "admin.tests.toTeams": "Zu den Mannschaften",
    "admin.tests.matches.one": "{count} Begegnung",
    "admin.tests.matches.other": "{count} Begegnungen",
    "admin.tests.bestOf": "Best of {games}",
    "admin.tests.otherwise": "Das ging nicht.",
    "admin.test.addTitle": "Test hinzufügen",
    "admin.test.editTitle": "Test bearbeiten",
    "admin.test.firstTeam": "Mannschaft A",
    "admin.test.secondTeam": "Mannschaft B",
    "admin.test.versus": "v",
    "admin.test.starts": "Beginn",
    "admin.test.finishes": "Ende",
    "admin.test.expectedMatches": "Erwartete Begegnungen",
    "admin.test.bestOf": "Best of",
    "admin.test.group": "Gruppe",
    "admin.test.add": "Hinzufügen",
    "admin.test.save": "Speichern",
    "admin.test.added": "{name} wurde hinzugefügt.",
    "admin.test.otherwise": "Dieser Test kann so nicht gespeichert werden.",
    "admin.testView.otherwise": "Dieser Test kann hier nicht angesehen werden.",
    "AddTest.FirstTeamMissing": "Wähle die erste Mannschaft.",
    "AddTest.SecondTeamMissing": "Wähle die zweite Mannschaft.",
    "UpdateTest.FirstTeamMissing": "Wähle die erste Mannschaft.",
    "UpdateTest.SecondTeamMissing": "Wähle die zweite Mannschaft.",
    "ExpectedMatches.NotWhole": "Gib eine ganze Zahl von Begegnungen ein.",
    "ExpectedMatches.TooSmall":
      "Bei einem Test muss mindestens 1 Begegnung erwartet werden.",
    "TestGroup.TooLong": "Diese Gruppe ist zu lang.",
    "Tournament.TestAgainstItself":
      "Eine Mannschaft spielt keinen Test gegen sich selbst.",
    "Tournament.TestFinishesBeforeStarts":
      "Ein Test kann nicht enden, bevor er beginnt.",
    "Tournament.TestStartsBeforeTournament":
      "Ein Test kann nicht vor seinem Turnier beginnen.",
    "Tournament.TestFinishesAfterTournament":
      "Ein Test kann nicht nach seinem Turnier enden.",
    "Tournament.TestHasGamesInUse":
      "Dieser Test hat Spiele und kann deshalb erst archiviert werden, wenn diese archiviert sind.",
    "Tournament.TestHasGames":
      "Dieser Test hat bereits Spiele, deshalb können seine Mannschaften nicht mehr geändert werden.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Es haben bereits mehr Begegnungen begonnen.",
    "Tournament.BestOfBelowGamesPlayed":
      "Zwei Spieler haben bereits mehr Spiele gespielt.",
    "Competition.ExpectedMatchesReached":
      "In diesem Test haben bereits alle erwarteten Begegnungen begonnen.",
    "Competition.SameTeam":
      "Zwei Spieler derselben Mannschaft spielen nicht gegeneinander.",
    "AddManager.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, das zur Turnierleitung gemacht werden kann.",
    "Account.NotAnAdministrator": "Das kann nur ein Administrator tun.",
    "AddRole.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, dem die Rolle gegeben werden kann.",
    "AddRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "RemoveRole.NoSuchAccount": "Dieses Konto gibt es nicht.",
    "RemoveRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "RemoveRole.Yourself":
      "Du kannst dir die Administratorrolle nicht selbst nehmen.",
    "AccountsWithRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "admin.scorers.add": "Ergebniserfasser hinzufügen",
    "admin.scorers.none": "Keine Ergebniserfasser",
    "admin.scorers.removeTitle": "Ergebniserfasser entfernen",
    "admin.scorers.removeExplanation":
      "{name} kann die Ergebnisse dieses Turniers danach nicht mehr erfassen.",
    "admin.scorers.otherwise":
      "Diese Adresse kann nicht zum Ergebniserfasser gemacht werden.",
    "AddScorer.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, das zum Ergebniserfasser gemacht werden kann.",
    "Tournament.AlreadyAManager":
      "Dieses Konto verwaltet das Turnier bereits und kann alles, was ein Ergebniserfasser kann.",

    "TournamentName.Missing": "Gib dem Turnier einen Namen.",
    "TournamentName.TooShort": "Dieser Name ist zu kurz.",
    "TournamentName.TooLong": "Dieser Name ist zu lang.",
    "TournamentName.AllLowerCase":
      "Ein Name wird nicht komplett kleingeschrieben.",
    "TournamentName.AllCapitals":
      "Ein Name wird nicht komplett großgeschrieben.",
    "TournamentName.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    "ReadOnlyDate.Unreadable": "Gib den Tag an.",
    "Tournament.FinishesBeforeStarts":
      "Ein Turnier kann nicht enden, bevor es beginnt.",
    "Tournament.StartsAfterNextYear":
      "Ein Turnier kann nicht nach dem nächsten Jahr beginnen.",
    "Tournament.FinishesAfterNextYear":
      "Ein Turnier kann nicht nach dem nächsten Jahr enden.",
    "CreateTournament.NoSuchCountry": "Wähle das Land.",
    "TournamentSubtitle.TooLong":
      "Der Untertitel darf höchstens 2000 Zeichen lang sein.",
    "Tournament.NotAManager":
      "Nur wer dieses Turnier verwaltet, kann es ändern.",
    "Tournament.NotAManagerOrScorer":
      "Nur wer dieses Turnier verwaltet oder darin Ergebnisse erfasst, kann es ansehen.",
    "Tournament.Archived":
      "Dieses Turnier ist archiviert und muss wiederhergestellt werden, bevor es geändert werden kann.",
    "UpdateTournament.NoSuchTournament":
      "Unter dieser Adresse gibt es kein Turnier.",

    // The sports keep the names their players use in German, which are the
    // English ones, as German croquet players say Golf Croquet and Ricochet
    // too. The formats named for a competition keep its name, as a name is
    // not translated.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Mannschaften",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Vereinigte Arabische Emirate",
    "country.af": "Afghanistan",
    "country.ag": "Antigua und Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanien",
    "country.am": "Armenien",
    "country.ao": "Angola",
    "country.ar": "Argentinien",
    "country.as": "Amerikanisch-Samoa",
    "country.at": "Österreich",
    "country.au": "Australien",
    "country.aw": "Aruba",
    "country.ax": "Ålandinseln",
    "country.az": "Aserbaidschan",
    "country.ba": "Bosnien und Herzegowina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesch",
    "country.be": "Belgien",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarien",
    "country.bh": "Bahrain",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivien",
    "country.br": "Brasilien",
    "country.bs": "Bahamas",
    "country.bt": "Bhutan",
    "country.bv": "Bouvetinsel",
    "country.bw": "Botsuana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonien",
    "country.cc": "Kokosinseln",
    "country.cd": "Demokratische Republik Kongo",
    "country.cf": "Zentralafrikanische Republik",
    "country.cg": "Republik Kongo",
    "country.ch": "Schweiz",
    "country.ci": "Elfenbeinküste",
    "country.ck": "Cookinseln",
    "country.cl": "Chile",
    "country.cm": "Kamerun",
    "country.cn": "China",
    "country.co": "Kolumbien",
    "country.cr": "Costa Rica",
    "country.cu": "Kuba",
    "country.cv": "Kap Verde",
    "country.cx": "Weihnachtsinsel",
    "country.cy": "Zypern",
    "country.cz": "Tschechien",
    "country.de": "Deutschland",
    "country.dj": "Dschibuti",
    "country.dk": "Dänemark",
    "country.dm": "Dominica",
    "country.do": "Dominikanische Republik",
    "country.dz": "Algerien",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Ägypten",
    "country.eh": "Westsahara",
    "country.england": "England",
    "country.er": "Eritrea",
    "country.es": "Spanien",
    "country.et": "Äthiopien",
    "country.fi": "Finnland",
    "country.fj": "Fidschi",
    "country.fk": "Falklandinseln",
    "country.fm": "Mikronesien",
    "country.fo": "Färöer",
    "country.fr": "Frankreich",
    "country.ga": "Gabun",
    "country.gb": "Vereinigtes Königreich",
    "country.gd": "Grenada",
    "country.ge": "Georgien",
    "country.gf": "Französisch-Guayana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Grönland",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadeloupe",
    "country.gq": "Äquatorialguinea",
    "country.gr": "Griechenland",
    "country.gs": "Südgeorgien und die Südlichen Sandwichinseln",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard und McDonaldinseln",
    "country.hn": "Honduras",
    "country.hr": "Kroatien",
    "country.ht": "Haiti",
    "country.hu": "Ungarn",
    "country.id": "Indonesien",
    "country.ie": "Irland",
    "country.il": "Israel",
    "country.im": "Isle of Man",
    "country.in": "Indien",
    "country.io": "Britisches Territorium im Indischen Ozean",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Island",
    "country.it": "Italien",
    "country.je": "Jersey",
    "country.jm": "Jamaika",
    "country.jo": "Jordanien",
    "country.jp": "Japan",
    "country.ke": "Kenia",
    "country.kg": "Kirgisistan",
    "country.kh": "Kambodscha",
    "country.ki": "Kiribati",
    "country.km": "Komoren",
    "country.kn": "St. Kitts und Nevis",
    "country.kp": "Nordkorea",
    "country.kr": "Südkorea",
    "country.kw": "Kuwait",
    "country.ky": "Kaimaninseln",
    "country.kz": "Kasachstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "St. Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Litauen",
    "country.lu": "Luxemburg",
    "country.lv": "Lettland",
    "country.ly": "Libyen",
    "country.ma": "Marokko",
    "country.mc": "Monaco",
    "country.md": "Moldau",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshallinseln",
    "country.mk": "Nordmazedonien",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolei",
    "country.mo": "Macau",
    "country.mp": "Nördliche Marianen",
    "country.mq": "Martinique",
    "country.mr": "Mauretanien",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Malediven",
    "country.mw": "Malawi",
    "country.mx": "Mexiko",
    "country.my": "Malaysia",
    "country.mz": "Mosambik",
    "country.na": "Namibia",
    "country.nc": "Neukaledonien",
    "country.ne": "Niger",
    "country.nf": "Norfolkinsel",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Niederlande",
    "country.no": "Norwegen",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Neuseeland",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Französisch-Polynesien",
    "country.pg": "Papua-Neuguinea",
    "country.ph": "Philippinen",
    "country.pk": "Pakistan",
    "country.pl": "Polen",
    "country.pm": "St. Pierre und Miquelon",
    "country.pn": "Pitcairninseln",
    "country.pr": "Puerto Rico",
    "country.ps": "Palästina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Katar",
    "country.re": "Réunion",
    "country.ro": "Rumänien",
    "country.rs": "Serbien",
    "country.ru": "Russland",
    "country.rw": "Ruanda",
    "country.sa": "Saudi-Arabien",
    "country.sb": "Salomonen",
    "country.sc": "Seychellen",
    "country.scotland": "Schottland",
    "country.sd": "Sudan",
    "country.se": "Schweden",
    "country.sg": "Singapur",
    "country.sh": "St. Helena",
    "country.si": "Slowenien",
    "country.sj": "Spitzbergen und Jan Mayen",
    "country.sk": "Slowakei",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Suriname",
    "country.st": "São Tomé und Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Syrien",
    "country.sz": "Eswatini",
    "country.tc": "Turks- und Caicosinseln",
    "country.td": "Tschad",
    "country.tf": "Französische Süd- und Antarktisgebiete",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadschikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor-Leste",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunesien",
    "country.to": "Tonga",
    "country.tr": "Türkei",
    "country.tt": "Trinidad und Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tansania",
    "country.ua": "Ukraine",
    "country.ug": "Uganda",
    "country.um": "Amerikanische Überseeinseln",
    "country.us": "Vereinigte Staaten",
    "country.uy": "Uruguay",
    "country.uz": "Usbekistan",
    "country.va": "Vatikanstadt",
    "country.vc": "St. Vincent und die Grenadinen",
    "country.ve": "Venezuela",
    "country.vg": "Britische Jungferninseln",
    "country.vi": "Amerikanische Jungferninseln",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wales",
    "country.wf": "Wallis und Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Südafrika",
    "country.zm": "Sambia",
    "country.zw": "Simbabwe",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject":
      "Bestätige deine E-Mail-Adresse für {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hallo,</p>

<p>
    vielen Dank, dass du ein Konto bei <strong>{siteName}</strong> angelegt hast.<br />
    Bevor du dein Konto nutzen kannst, bestätige bitte deine E-Mail-Adresse
    mit einem Klick auf die Schaltfläche unten:
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
        Meine E-Mail-Adresse bestätigen
    </a>
</p>

<p>
    Wenn die Schaltfläche nicht funktioniert, kannst du deine E-Mail-Adresse auch bestätigen, indem du diesen Link in deinem Browser öffnest:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Wenn du dieses Konto nicht angelegt hast, kannst du diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Ein neuer Link zum Bestätigen deiner E-Mail-Adresse für {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hallo,</p>

<p>
    du hast vor Kurzem eine neue E-Mail zum Bestätigen deiner E-Mail-Adresse für <strong>{siteName}</strong> angefordert.<br />
    Bestätige deine E-Mail-Adresse mit einem Klick auf die Schaltfläche unten:
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
        Meine E-Mail-Adresse bestätigen
    </a>
</p>

<p>
    Wenn die Schaltfläche nicht funktioniert, kannst du deine E-Mail-Adresse auch bestätigen, indem du diesen Link in deinem Browser öffnest:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sobald sie bestätigt ist, kannst du dein Konto ohne Unterbrechung weiter nutzen.
</p>

<p>
    Wenn du diese E-Mail nicht angefordert hast, kannst du sie einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Jemand hat versucht, sich mit deiner E-Mail-Adresse zu registrieren",
    "Email.AlreadyRegistered.body": `
<p>Hallo,</p>

<p>
    Jemand hat versucht, sich bei <strong>{siteName}</strong> mit dieser
    E-Mail-Adresse zu registrieren, zu der es schon ein Konto gibt. An deinem
    Konto hat sich nichts geändert.<br />
    Wenn du es warst: Du hast bereits ein Konto und kannst dich darin anmelden:
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
        Anmelden
    </a>
</p>

<p>
    Wenn du dein Passwort vergessen hast, kannst du es hier zurücksetzen:
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
        Ich habe mein Passwort vergessen
    </a>
</p>

<p>
    Wenn du es nicht warst, musst du nichts tun. Niemand hat einen Weg
    in dein Konto bekommen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bestätige den Umzug deines Kontos bei {siteName} zu dieser Adresse",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hallo,</p>

<p>
    Jemand, der in einem Konto bei <strong>{siteName}</strong> angemeldet ist,
    hat darum gebeten, es zu dieser E-Mail-Adresse zu verschieben. Wenn du es
    warst, bestätige es hier, während du in diesem Konto angemeldet bist. Der
    Link funktioniert 24 Stunden lang.
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
        Mein Konto verschieben
    </a>
</p>

<p>
    Oder kopiere diese Adresse in deinen Browser:<br />
    {link}
</p>

<p>
    Wenn du es nicht warst, musst du nichts tun. Es wird kein Konto hierher verschoben.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Jemand wollte ein Konto zu deiner E-Mail-Adresse verschieben",
    "Email.AlreadyHasAnAccount.body": `
<p>Hallo,</p>

<p>
    Jemand, der in einem Konto bei <strong>{siteName}</strong> angemeldet ist,
    hat darum gebeten, es zu dieser E-Mail-Adresse zu verschieben, zu der es
    schon ein eigenes Konto gibt. Es wurde nichts verschoben, und an deinem
    Konto hat sich nichts geändert.
</p>

<p>
    Wenn du es warst: Du hast bereits ein Konto mit dieser Adresse und kannst
    dich darin anmelden.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Dein Konto bei {siteName} wurde verschoben",
    "Email.EmailAddressChanged.body": `
<p>Hallo,</p>

<p>
    Dein Konto bei <strong>{siteName}</strong> wurde gerade zu einer anderen
    E-Mail-Adresse verschoben, {emailAddress}, und die Anmeldung erfolgt ab
    jetzt mit dieser Adresse.
</p>

<p>
    Wenn du es nicht warst, hat jemand anderes dein Konto. Antworte auf diese
    E-Mail und sag es uns.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Dein Passwort bei {siteName} wurde geändert",
    "Email.PasswordChanged.body": `
<p>Hallo,</p>

<p>
    Das Passwort deines Kontos bei <strong>{siteName}</strong> wurde gerade geändert,
    und du wurdest in allen anderen Browsern abgemeldet, in denen du angemeldet warst.<br />
    Wenn du es warst, musst du nichts tun.
</p>

<p>
    Wenn du es nicht warst, hat jemand anderes dein Passwort. Lege hier ein
    neues fest, dann wird diese Person abgemeldet:
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
        Ich habe mein Passwort vergessen
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Lege ein neues Passwort für {siteName} fest",
    "Email.SetNewPassword.body": `
<p>Hallo,</p>

<p>
    du hast vor Kurzem darum gebeten, dein Passwort für <strong>{siteName}</strong> zurückzusetzen.<br />
    Das kannst du mit einem Klick auf die Schaltfläche unten tun:
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
        Passwort zurücksetzen
    </a>
</p>

<p>
    Wenn die Schaltfläche nicht funktioniert, kannst du dein Passwort auch zurücksetzen, indem du diesen Link in deinem Browser öffnest:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Wenn du nicht darum gebeten hast, dein Passwort zurückzusetzen, kannst du diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Lege ein Passwort für {siteName} fest",
    "Email.SetPassword.body": `
<p>Hallo,</p>

<p>
    Dein Konto bei <strong>{siteName}</strong> hat kein Passwort: Du meldest dich mit Google an.<br />
    Du hast darum gebeten, eines festzulegen, damit du dich auch mit deiner E-Mail-Adresse und einem Passwort anmelden kannst.
    Das kannst du mit einem Klick auf die Schaltfläche unten tun:
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
        Passwort festlegen
    </a>
</p>

<p>
    Wenn die Schaltfläche nicht funktioniert, kannst du dein Passwort auch festlegen, indem du diesen Link in deinem Browser öffnest:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Der Link funktioniert eine Stunde lang. Wenn du nicht darum gebeten hast, ein Passwort festzulegen, kannst du diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Zu dieser E-Mail-Adresse gibt es kein Konto bei {siteName}",
    "Email.RegisterInstead.body": `
<p>Hallo,</p>

<p>
    Jemand hat darum gebeten, das Passwort für eine E-Mail-Adresse
    zurückzusetzen, die zu keinem Konto bei <strong>{siteName}</strong> gehört.
</p>

<p>
    Wenn du unseren Dienst nutzen möchtest, kannst du hier ein neues Konto anlegen:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bestätige, dass dein Konto bei {siteName} vergessen werden soll",
    "Email.ConfirmForgetting.body": `
<p>Hallo,</p>

<p>
    Du hast darum gebeten, dein Konto bei <strong>{siteName}</strong> zu vergessen.<br />
    Folge der Schaltfläche unten, um zu sehen, was das bedeutet, und um sicher
    zu bestätigen, dass du das willst:
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
        Mein Konto vergessen
    </a>
</p>

<p>
    Wenn die Schaltfläche nicht funktioniert, kannst du auch diesen Link in deinem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sobald es vergessen ist, kann niemand mehr deinen Namen oder deine
    E-Mail-Adresse lesen, und niemand kann sich mehr in deinem Konto anmelden.
    Das lässt sich nicht rückgängig machen.
</p>

<p>
    Der Link funktioniert nur einmal, bis zu 15 Minuten nach deiner Anfrage,
    und nur, solange du in diesem Konto angemeldet bist. Danach fordere ihn in
    deinem Konto erneut an.
</p>

<p>
    Wenn du es nicht angefordert hast, passiert nichts, solange niemand dem
    Link folgt. Trotzdem hat es jemand angefordert, der in deinem Konto
    angemeldet war. Lege deshalb auf der Seite „Passwort vergessen“ ein neues
    Passwort fest, damit diese Person sich nicht wieder anmelden kann.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Die Registrierung ist ausgesetzt: {service} ist nicht erreichbar",
    "Email.RegistrationsSuspended.body": `
<p>Hallo,</p>

<p>
    {siteName} konnte {service} um {when} nicht erreichen. Bis der Dienst
    wieder antwortet, wird allen, die ihn brauchen, um sich zu registrieren
    oder ein neues Passwort festzulegen, gesagt, dass sie es später noch
    einmal versuchen sollen.
</p>

<p>
    Es gibt nichts wieder freizuschalten. Jeder Versuch fragt {service} erneut
    an, und die Seiten funktionieren wieder, sobald er antwortet.
</p>

<p>
    Solange {service} nicht antwortet, bekommst du dazu höchstens eine E-Mail
    pro Stunde.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} kann seine Datenbank nicht erreichen",
    "Email.DatabaseUnreachable.body": `
<p>Hallo,</p>

<p>
    {siteName} konnte seine Datenbank um {when} nicht erreichen. Bis sie antwortet, sagt jede Seite, die sie braucht, den Lesern, dass die Website nicht verfügbar ist und sie es später noch einmal versuchen sollen.
</p>

<p>
    Es muss nichts aufgehoben werden. Jede Anfrage verlangt neu eine Verbindung, und die Website funktioniert wieder, sobald die Datenbank antwortet.
</p>

<p>
    Solange die Datenbank nicht erreichbar ist, bekommst du darüber höchstens alle {minutes} Minuten eine E-Mail.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject":
      "{siteName} ist bei einer Anfrage fehlgeschlagen",
    "Email.UnhandledError.body": `
<p>Hallo,</p>

<p>
    {siteName} ist um {when} bei einer Anfrage nach {asked} fehlgeschlagen. Dem Leser wurde die Referenz {reference} gezeigt, und im Protokoll steht die Ursache darunter.
</p>

<p>
    Eine kaputte Website scheitert meist bei jeder Anfrage, deshalb bekommst du höchstens 4 E-Mails pro Stunde über Fehler. Die weiteren stehen trotzdem im Protokoll.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
