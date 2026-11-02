// Die Wörter der Website auf Deutsch. Die Leserin und der Leser werden gesiezt.
// Menü- und Schaltflächentexte folgen der deutschen Rechtschreibung: Nomen
// groß, alles andere klein („Passwort ändern“, „Zurück zu {siteName}“), also
// keine englische Großschreibung jedes Wortes. „E-Mail-Adresse“ steht für
// „email address“, „anmelden“/„abmelden“ für sign in/out, „registrieren“ für
// register. „Konto vergessen“ ist das Löschen der Daten ohne Wiederkehr
// („forget“), „Turnier“ für tournament, „Wettbewerb“ für competition. Für
// Gruppen stehen die Wörter „Block“, „Spielreihenfolge“ und „Freilos“ („Bye“
// bleibt als Wort, das die Website selbst prüft, unübersetzt, wo das Englische es so
// vorgibt).
import type { Language } from "../common/language.js";

export const german: Language = {
  tag: "de",
  name: "Deutsch",
  words: {
    // Die Leisten der Website. Ihr Name gehört keiner Sprache und wird in den
    // Satz eingesetzt, der ihn nennt (site.ts).
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
      "Gefällt Ihnen {siteName}? Bitte spenden Sie, um die Weiterentwicklung zu unterstützen.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Datenschutz",
    "footer.termsOfUse": "Nutzungsbedingungen",
    "footer.reportBug": "Fehler melden",
    "beta.banner":
      "Dies ist eine Beta-Website. Die Daten können jederzeit zurückgesetzt werden.",
    "privacy.contact":
      "Fragen zu dieser Seite oder zu den über Sie gespeicherten Daten: {emailAddress}",
    // Das Kästchen, das man anhakt, um den Nutzungsbedingungen für
    // Schreibende zuzustimmen. Die Wörter des Links werden im Text des
    // Kästchens gesucht und zum Link gemacht, also müssen sie dort genau so
    // stehen.
    "termsOfUse.agree": "Ich stimme den Nutzungsbedingungen zu",
    "termsOfUse.link": "Nutzungsbedingungen",
    // Unter den Bedingungen für Schreibende, wie privacy.contact unter der
    // Datenschutzerklärung.
    "termsOfUse.report":
      "Melden Sie Geschriebenes oder fragen Sie zu diesen Bedingungen: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Haken Sie das Kästchen an, um den Nutzungsbedingungen zuzustimmen.",
    // Auf jeder Seite einer Übungswebsite, unter der Leiste der Website.
    "tryWebsite.banner":
      "Dies ist ein geschützter Ort, um {siteName} kennenzulernen. Alles, was hier eingegeben wird, kann jederzeit entfernt werden.",

    "language.label": "Sprache",
    "language.choose": "Ändern",

    // Der Hinweis, dass es etwas Neues zu lesen gibt.
    "whatsNew.public.message": "Es gibt etwas Neues zu lesen.",
    "whatsNew.admin.message":
      "Es gibt etwas Neues für alle, die Turniere leiten.",
    "whatsNew.view": "Neuigkeiten ansehen",
    "whatsNew.later": "Beim nächsten Mal erinnern",
    "whatsNew.never": "Diesen Hinweis nicht mehr anzeigen",

    "form.otherwise":
      "Etwas stimmt hier nicht. Prüfen Sie Ihre Eingaben und versuchen Sie es erneut.",

    // Das Kontomenü in der Kopfzeile: wofür die Person steht und jeder
    // Eintrag, der sich darin öffnet.
    "account.menu": "Konto",
    "account.register": "Registrieren",
    "account.signIn": "Anmelden",
    "account.forgotPassword": "Passwort vergessen",
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
    // Steht über dem Formular, wenn Google die Person zurückgeschickt hat,
    // ohne sie einzulassen, je nach Code des Rückwegs. Die Seiten zum
    // Registrieren und zum Anmelden sagen sie beide, deshalb heißt es „Nutzen
    // Sie Ihre E-Mail-Adresse“, ohne zu nennen, was das Formular damit tut.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google hat nicht bestätigt, dass diese E-Mail-Adresse Ihnen gehört, daher kann sie hier nicht mit Google verwendet werden. Nutzen Sie stattdessen unten Ihre E-Mail-Adresse.",
    "SignInWithGoogle.LinkedToAnother":
      "Zu dieser E-Mail-Adresse gibt es bereits ein Konto, das mit einem anderen Google-Konto verknüpft ist. Melden Sie sich mit diesem Google-Konto an oder mit Ihrer E-Mail-Adresse und Ihrem Passwort.",
    "SignInWithGoogle.NameMissing":
      "Google hat uns Ihren Namen nicht mitgeteilt, ein Konto braucht aber einen. Nutzen Sie stattdessen unten Ihre E-Mail-Adresse.",
    "Google.Unreachable":
      "Google war gerade nicht erreichbar. Versuchen Sie es in einigen Minuten erneut oder nutzen Sie unten Ihre E-Mail-Adresse.",
    "Registration.NotAPerson":
      "Das sah nicht so aus, als käme es von einem Menschen. Versuchen Sie es erneut. Wenn es weiter passiert, warten Sie einige Minuten und kommen Sie dann wieder.",

    // Eine Regel, gegen die die Adresse verstoßen kann, unter dem Feld
    // gesagt, um das es geht.
    "EmailAddress.Missing": "Geben Sie eine E-Mail-Adresse ein.",
    "EmailAddress.NoAt": "Eine E-Mail-Adresse enthält ein @.",
    "EmailAddress.MoreThanOneAt": "Eine E-Mail-Adresse enthält genau ein @.",
    "EmailAddress.NoDomain":
      "Eine E-Mail-Adresse hat nach dem @ eine Domain, zum Beispiel example.com.",

    "welcome.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "welcome.checkEmail":
      "Eine E-Mail ist an die von Ihnen angegebene Adresse unterwegs. Folgen Sie dem Link darin, um fortzufahren.",
    "welcome.nothingArrived":
      "Wenn nach einigen Minuten nichts ankommt, sehen Sie in Ihrem Spam-Ordner nach.",
    "welcome.home": "Zurück zu {siteName}",
    "newConfirmationLink.title": "Neuen Link anfordern",
    "newConfirmationLink.explanation":
      "Der Link zur Bestätigung Ihrer E-Mail-Adresse ist abgelaufen. Fordern Sie einen neuen an, er wird an die Adresse geschickt, mit der Sie sich registriert haben.",
    "newConfirmationLink.send": "Neuen Link senden",
    "newConfirmationLink.home": "Zurück zu {siteName}",
    "newConfirmationLink.signIn": "Anmelden",
    "newConfirmationLink.sent.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "newConfirmationLink.sent.explanation":
      "Ein neuer Link ist unterwegs. Folgen Sie ihm, um Ihre E-Mail-Adresse zu bestätigen. Wenn nach einigen Minuten nichts ankommt, sehen Sie in Ihrem Spam-Ordner nach.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Diese E-Mail-Adresse ist bereits bestätigt",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Es gibt nichts mehr zu bestätigen. Melden Sie sich mit dem Passwort an, das Sie bei der Bestätigung angegeben haben.",
    "newConfirmationLink.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "newConfirmationLink.noLongerWorks.explanation":
      "Prüfen Sie, ob Sie dem ganzen Link aus der E-Mail gefolgt sind, ohne dass am Ende etwas fehlt. Funktioniert er immer noch nicht, registrieren Sie sich erneut, dann wird ein neuer Link gesendet.",
    "newConfirmationLink.tooMany.title": "Versuchen Sie es später erneut",
    "newConfirmationLink.tooMany.explanation":
      "An diese Adresse wurden in letzter Zeit mehrere Links gesendet. Warten Sie eine Stunde und fordern Sie dann erneut einen an. Sehen Sie in der Zwischenzeit in Ihrem Spam-Ordner nach.",

    "forgotPassword.title": "Passwort vergessen?",
    "forgotPassword.emailAddress": "E-Mail-Adresse",
    "forgotPassword.submit": "Weg zurück ins Konto senden",
    "forgotPassword.home": "Zurück zu {siteName}",
    "forgotPassword.sent.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "forgotPassword.sent.explanation":
      "Wenn zu dieser Adresse ein Konto gehört, ist ein Link zum Festlegen eines neuen Passworts unterwegs. Folgen Sie ihm innerhalb einer Stunde. Wenn nach einigen Minuten nichts ankommt, sehen Sie in Ihrem Spam-Ordner nach.",
    "forgotPassword.tryAgainLater":
      "Von hier aus wurden in letzter Zeit zu viele Wege zurück ins Konto angefordert. Warten Sie eine Stunde und versuchen Sie es dann erneut.",

    "setNewPassword.title": "Neues Passwort festlegen",
    "setNewPassword.password": "Passwort",
    "setNewPassword.confirmPassword": "Passwort bestätigen",
    "setNewPassword.submit": "Mein neues Passwort festlegen",
    "setNewPassword.home": "Zurück zu {siteName}",
    "setNewPassword.signIn": "Anmelden",
    "setNewPassword.askAgain": "Neuen Link anfordern",
    "setNewPassword.changed.title": "Ihr Passwort wurde geändert",
    "setNewPassword.changed.explanation":
      "Sie wurden überall abgemeldet, wo Sie angemeldet waren. Melden Sie sich mit Ihrem neuen Passwort an.",
    "setNewPassword.expired.title": "Dieser Link ist abgelaufen",
    "setNewPassword.expired.explanation":
      "Ein Link zum Festlegen eines neuen Passworts gilt eine Stunde lang. Fordern Sie einen neuen an, er wird an dieselbe Adresse geschickt.",
    "setNewPassword.noLongerWorks.title": "Dieser Link funktioniert nicht mehr",
    "setNewPassword.noLongerWorks.explanation":
      "Möglicherweise wurde er schon benutzt oder am Ende fehlt etwas. Fordern Sie einen neuen an, wenn Sie noch einen brauchen.",

    // Steht über den Feldern, wenn die Prüfung auf bekannte, kompromittierte
    // Passwörter nicht möglich ist.
    "BreachedPasswords.Unreachable":
      "Ihr Passwort kann gerade nicht geprüft werden und wurde deshalb nicht geändert. Versuchen Sie es in einigen Minuten erneut; Ihr Link bleibt bis zu seinem Ablauf gültig.",

    "forgetAccount.title": "Ihr Konto vergessen",
    "forgetAccount.explanation":
      "Ihr Name und Ihre E-Mail-Adresse können für immer unlesbar gemacht und Ihr Konto geschlossen werden. Um sicherzugehen, dass Sie es sind, senden wir zuerst einen Link an die Adresse Ihres Kontos, und nichts wird vergessen, bevor Sie ihm folgen.",
    "forgetAccount.submit": "Link per E-Mail senden",
    "forgetAccount.sent.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "forgetAccount.sent.explanation":
      "Wir haben einen Link an die Adresse Ihres Kontos gesendet. Er gilt 15 Minuten lang und nur, solange Sie bei diesem Konto angemeldet sind.",
    "forgetAccount.confirm.title": "Ihr Konto endgültig vergessen?",
    "forgetAccount.confirm.explanation":
      "Sobald es vergessen ist, kann niemand Ihren Namen und Ihre E-Mail-Adresse je wieder lesen, und man kann sich nicht mehr in Ihrem Konto anmelden. Das lässt sich nicht rückgängig machen.",
    "forgetAccount.confirm.submit": "Mein Konto vergessen",
    "forgetAccount.forgotten.title": "Ihr Konto wurde vergessen",
    "forgetAccount.forgotten.explanation":
      "Ihr Name und Ihre E-Mail-Adresse können nicht mehr gelesen werden, und Sie wurden überall abgemeldet, wo Sie angemeldet waren.",
    "forgetAccount.noLongerWorks.title": "Dieser Link funktioniert nicht mehr",
    "forgetAccount.noLongerWorks.explanation":
      "Er ist möglicherweise abgelaufen, wurde schon benutzt oder gehört zu einem Konto, bei dem Sie nicht angemeldet sind. Fordern Sie ihn in Ihrem Konto erneut an, wenn es noch vergessen werden soll.",
    "forgetAccount.lastAdministrator.title":
      "Ihr Konto kann nicht vergessen werden",
    "forgetAccount.lastAdministrator.explanation":
      "Sie sind der einzige Administrator dieser Website. Geben Sie die Rolle Administrator an jemand anderen, dann kann Ihr Konto vergessen werden.",
    "forgetAccount.askAgain": "Erneut anfordern",
    "forgetAccount.home": "Zurück zu {siteName}",

    "registrationsSuspended.title": "Die Registrierung ist vorerst ausgesetzt",
    "registrationsSuspended.explanation":
      "Ein Dienst, den die Registrierung braucht, ist gerade nicht erreichbar, daher kann sich niemand registrieren, bis er wieder antwortet. Nichts von dem, was Sie eingegeben haben, wurde gespeichert.",
    "registrationsSuspended.tryAgainLater":
      "Versuchen Sie es in Kürze erneut. Der Administrator der Website wurde informiert.",
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
      "Es gab in letzter Zeit zu viele Versuche. Warten Sie eine Stunde und versuchen Sie es dann erneut.",

    // Die eine Antwort auf ein falsches Passwort und auf eine Adresse, die
    // niemand registriert hat. Sie sagt weder, was von beidem es war, noch
    // was nicht.
    "SignIn.Failed":
      "Die E-Mail-Adresse oder das Passwort ist falsch. Bitte versuchen Sie es erneut.",

    "profile.title": "Profil",
    // Der Doppelpunkt eines Etiketts gehört zu seinen Wörtern, da Sprachen
    // ihn unterschiedlich setzen.
    "profile.name": "Name:",
    "profile.emailAddress": "E-Mail-Adresse:",

    "changeName.title": "Namen ändern",
    "changeName.name": "Name",
    "changeName.submit": "Namen ändern",

    "setPassword.title": "Passwort festlegen",
    "setPassword.explanation":
      "Ihr Konto hat kein Passwort: Sie melden sich mit Google an. Um sich auch mit einem Passwort anmelden zu können, senden wir einen Link zum Festlegen eines Passworts an {emailAddress}.",
    "setPassword.submit": "Link per E-Mail senden",
    "setPassword.sent.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "setPassword.sent.explanation":
      "Wir haben Ihnen einen Link zum Festlegen eines Passworts gesendet. Er gilt eine Stunde lang.",
    "setPassword.profile": "Zurück zu Ihrem Profil",

    "changePassword.title": "Passwort ändern",
    "changePassword.currentPassword": "Aktuelles Passwort",
    "changePassword.password": "Neues Passwort",
    "changePassword.passwordConfirmation": "Passwort bestätigen",
    "changePassword.forgotPassword": "Passwort vergessen?",
    "changePassword.submit": "Passwort ändern",
    // Unter dem aktuellen Passwort, um das es geht.
    "ChangePassword.WrongPassword": "Das ist nicht Ihr Passwort.",

    "changeEmailAddress.title": "E-Mail-Adresse ändern",
    "changeEmailAddress.emailAddress": "Neue E-Mail-Adresse",
    "changeEmailAddress.currentPassword": "Aktuelles Passwort",
    "changeEmailAddress.submit": "Bestätigungslink senden",
    "changeEmailAddress.sent.title": "Prüfen Sie Ihr E-Mail-Postfach",
    "changeEmailAddress.sent.explanation":
      "Ein Link zur Bestätigung des Wechsels wurde an die neue E-Mail-Adresse gesendet. Folgen Sie ihm angemeldet, um Ihr Konto dorthin zu verschieben.",
    "changeEmailAddress.confirm.title": "Ihr Konto verschieben",
    "changeEmailAddress.confirm.explanation":
      "Ihr Konto wird auf {emailAddress} verschoben. Sie melden sich von nun an mit dieser Adresse an.",
    "changeEmailAddress.confirm.submit": "Mein Konto verschieben",
    "changeEmailAddress.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "changeEmailAddress.noLongerWorks.explanation":
      "Er ist abgelaufen, wurde schon benutzt oder wurde nicht für das Konto gesendet, bei dem Sie angemeldet sind. Fordern Sie ihn in Ihrem Profil erneut an.",
    "changeEmailAddress.taken.title": "Ihr Konto wurde nicht verschoben",
    "changeEmailAddress.profile": "Zurück zu Ihrem Profil",
    // Unter dem Feld, um das es jeweils geht.
    "ChangeEmailAddress.WrongPassword": "Das ist nicht Ihr Passwort.",
    "ChangeEmailAddress.Unchanged": "Ihr Konto hat bereits diese Adresse.",
    "ChangeEmailAddress.Taken":
      "Zu dieser E-Mail-Adresse gibt es inzwischen ein eigenes Konto, daher kann Ihres nicht dorthin verschoben werden.",

    "confirmEmailAddress.title": "Bestätigen Sie Ihre E-Mail-Adresse",
    "confirmEmailAddress.name": "Name",
    "confirmEmailAddress.password": "Passwort",
    "confirmEmailAddress.confirmPassword": "Passwort bestätigen",
    "confirmEmailAddress.submit": "Meine E-Mail-Adresse bestätigen",
    "confirmEmailAddress.signIn": "Anmelden",
    "confirmEmailAddress.home": "Zurück zu {siteName}",
    "confirmEmailAddress.confirmed.title": "Ihre E-Mail-Adresse ist bestätigt",
    "confirmEmailAddress.confirmed.explanation":
      "Ihr Konto ist bereit. Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die Sie gerade angegeben haben.",
    "confirmEmailAddress.expired.title": "Dieser Link ist abgelaufen",
    "confirmEmailAddress.expired.explanation":
      "Ein Link zur Bestätigung einer E-Mail-Adresse gilt 24 Stunden lang. Fordern Sie einen neuen an, er wird an dieselbe Adresse geschickt.",
    "confirmEmailAddress.expired.newLink": "Neuen Link senden",
    "confirmEmailAddress.noLongerWorks.title":
      "Dieser Link funktioniert nicht mehr",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Prüfen Sie, ob Sie dem ganzen Link aus der E-Mail gefolgt sind, ohne dass am Ende etwas fehlt. Funktioniert er immer noch nicht, registrieren Sie sich erneut, dann wird ein neuer Link gesendet.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Diese E-Mail-Adresse ist bereits bestätigt",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Es gibt nichts mehr zu tun. Melden Sie sich mit dem Passwort an, das Sie bei der Bestätigung angegeben haben.",

    // Eine verletzte Regel, nach ihrem Code benannt, damit jedes Formular sie
    // gleich ausdrückt. Sie wird der Person unter dem Feld gesagt, das sie
    // gelesen hat.
    "PersonName.Missing": "Geben Sie einen Namen ein.",
    "PersonName.TooShort": "Ein Name muss mindestens 3 Zeichen lang sein.",
    "PersonName.TooLong": "Ein Name darf höchstens 254 Zeichen lang sein.",
    "WorldRankingName.TooShort":
      "Ein Weltranglistenname muss mindestens 3 Zeichen lang sein.",
    "WorldRankingName.TooLong":
      "Ein Weltranglistenname darf höchstens 254 Zeichen lang sein.",
    "Password.Missing": "Geben Sie ein Passwort ein.",
    "Password.TooShort": "Ein Passwort muss mindestens 12 Zeichen lang sein.",
    "Password.ConfirmationDiffers":
      "Das stimmt nicht mit dem Passwort oben überein. Geben Sie es erneut ein.",
    "Password.Breached":
      "Dieses Passwort ist an anderer Stelle bei einem Datenleck aufgetaucht und daher hier nicht sicher. Wählen Sie ein anderes.",

    "javaScriptRequired.title": "JavaScript erforderlich",
    "javaScriptRequired.explanation":
      "Für die Registrierung muss JavaScript für diese Website eingeschaltet sein, damit geprüft werden kann, ob die registrierende Person ein Mensch ist. Schalten Sie es ein und registrieren Sie sich dann erneut.",
    "javaScriptRequired.register": "Zurück zur Registrierung",
    "javaScriptRequired.home": "Zurück zu {siteName}",

    "errors.backHome": "Zurück zu {siteName}",
    "errors.notFound": "Nicht gefunden",
    "errors.refused": "Das konnte nicht ausgeführt werden",
    "errors.refusedDetail": "Etwas an dem Gesendeten war nicht in Ordnung.",
    "errors.sorry": "Entschuldigung",
    "errors.sorryDetail": "Diese Anfrage konnte nicht bearbeitet werden.",
    "errors.failed": "Etwas ist schiefgegangen",
    "errors.reference": "Referenz {reference}.",
    "errors.recorded":
      "Der Fehler wurde protokolliert und eine E-Mail an den Administrator gesendet. Es hilft, dem Administrator mit der Referenz und einer Beschreibung zu schreiben, was Sie gerade getan haben.",
    "errors.message": "Dem Administrator schreiben",
    "errors.messageSubject": "Fehler {reference} auf {siteName}",
    "errors.messageBody": "Das habe ich getan, als dies passierte:\n\n",
    "errors.unavailable": "Die Website ist nicht verfügbar",
    "errors.unavailableDetail":
      "Die Website erreicht gerade nicht, was sie braucht. Bitte versuchen Sie es später erneut.",
    "errors.maintenance": "Die Website wird gerade gewartet.",
    "errors.maintenanceMinutes":
      "Sie ist voraussichtlich in {minutes} Minuten wieder da.",
    "errors.maintenanceMinute":
      "Sie ist voraussichtlich in 1 Minute wieder da.",
    "errors.maintenanceLonger":
      "Es dauert länger als erwartet, sie ist aber bald wieder da.",

    // Die beiden Listen der Startseite, was jede sagt, wenn sie leer ist, und
    // der Weg darunter zu allen Turnieren dieses Jahres.
    "home.recentResults": "Neueste Ergebnisse",
    "home.recentResults.none":
      "In den letzten sieben Tagen wurden keine Spiele hinzugefügt.",
    "home.upcomingTournaments": "Kommende Turniere",
    "home.upcomingTournaments.none":
      "In den nächsten sechzig Tagen beginnen keine Turniere.",
    "home.allTournaments": "Alle Turniere {year}",
    // Die Seite eines Jahres: ihre Überschrift und was sie sagt, wenn sie
    // leer ist.
    "year.heading": "Turniere {year}",
    "year.none": "{year} beginnen keine Turniere.",
    // Die Seite einer Sportart in einem Jahr: dasselbe, nur für diese Sportart.
    "yearSport.heading": "{sport}-Turniere {year}",
    "yearSport.none": "{year} beginnen keine {sport}-Turniere.",
    // Die Seite eines Turniers: ihre Bereiche, was sie über ein Spiel sagt,
    // wie lange es her ist, dass eines hinzugefügt wurde, und was sie sagt,
    // wenn sie keines hat.
    "tournament.recent": "Neueste",
    "tournament.summary": "Zusammenfassung",
    // Die Zusammenfassung eines Turniers, das mit Mannschaften gespielt wird:
    // die Gruppen und Spalten ihrer Tabelle.
    // Das Raster eines Tests: wovon jedes Match das Beste ist, das Wort
    // zwischen seinen Mannschaften und seine Summen unter den Matches.
    "test.bestOf": "Jedes Match geht über maximal {count} Spiele.",
    "test.vs": "gegen",
    "test.matches": "Matches",
    "test.games": "Spiele",
    "test.hoops": "Tore",
    "teamSummary.tests": "Tests",
    "teamSummary.matches": "Matches",
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
      "Geben Sie den Namen eines Spielers ein, um ihn zu finden.",
    "players.search.none": "Keine Spieler gefunden.",
    "search.more":
      "Es werden nur die ersten {count} angezeigt. Geben Sie mehr vom Namen ein, um die Suche einzugrenzen.",
    "websitePlayer.tournament": "Turnier",
    // Ein Test in den Bereichen eines Turniers: die Kurznamen seiner beiden
    // Mannschaften.
    "tournament.test": "{first} gegen {second}",
    "tournament.notes": "Notizen",
    "tournament.commentary": "Kommentar",
    "tournament.beat": "schlug",
    "tournament.drewWith": "spielte unentschieden gegen",
    "tournament.ago.seconds": "{count} Sek.",
    "tournament.ago.minutes": "{count} Min.",
    "tournament.ago.hour": "1 Stunde",
    "tournament.ago.hours": "{count} Stunden",
    "tournament.none": "Es wurden noch keine Spiele gespielt.",
    // Die Spielerseite eines Turniers, wenn es keine hat.
    "players.none": "Es wurden noch keine Spieler hinzugefügt.",
    // Die Kommentarseite eines Turniers, in den Worten der alten Website: wie
    // ein Kommentar aufgeführt wird und der Link, um einen zu beginnen.
    "commentaries.by": "von",
    "commentaries.start": "Neuen Kommentar beginnen",
    // Die Seite, die einen Kommentar beginnt.
    "startCommentary.title": "Neuen Kommentar beginnen",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Kommentar beginnen",
    // „Neu“ wird einer Screenreader-Nutzerin anstelle des roten Sterns
    // gesagt, der eine Notiz oder einen Kommentar kennzeichnet, die noch
    // nicht gelesen wurden, wie sie jetzt sind.
    "marks.new": "neu",
    // Die Notizenseite eines Turniers und die Seite einer Notiz.
    "notes.none": "Die Verantwortlichen haben noch keine Notizen geschrieben.",
    "note.edited": "bearbeitet",
    // Die Seite eines Kommentars: was sie sagt, wenn er keine Beiträge hat,
    // was sie zu einem Beitrag sagt und das Feld, in dem seine Verfasserin
    // den nächsten schreibt.
    "commentary.none": "Es wurden noch keine Beiträge geschrieben.",
    "commentary.edited": "bearbeitet",
    "commentary.edit": "Bearbeiten",
    "commentary.delete": "Löschen",
    "commentary.comment": "Beitrag",
    "commentary.add": "Beitrag hinzufügen",
    "commentary.notSent":
      "Der Beitrag konnte nicht gesendet werden. Laden Sie die Seite neu, um zu sehen, ob er gespeichert wurde.",
    // Die Seite, die den Titel eines Kommentars ändert.
    "changeCommentaryTitle.title": "Titel ändern",
    "changeCommentaryTitle.submit": "Speichern",
    // Die eigene Seite eines Beitrags, auf der seine Verfasserin ihn
    // bearbeitet oder löscht, und die Seite, die vor dem Löschen fragt.
    "editComment.title": "Beitrag bearbeiten",
    "editComment.save": "Speichern",
    "deleteComment.title": "Beitrag löschen",
    "deleteComment.question":
      "Diesen Beitrag löschen? Das lässt sich nicht rückgängig machen.",
    "deleteComment.confirm": "Beitrag löschen",
    "deleteComment.keep": "Behalten",
    // Die Seite eines Spielers: ihre zwei Teile, wie ein Spiel gesagt wird,
    // so wie der Spieler es gespielt hat, und was jeder Teil sagt, wenn er
    // leer ist.
    "player.games": "Spiele",
    "player.competitions": "Wettbewerbe",
    "player.beat": "schlug",
    "player.lostTo": "verlor gegen",
    "player.drewWith": "spielte unentschieden gegen",
    "player.score": "{score} zu {opponent}",
    "player.noGames": "Es wurden noch keine Spiele gespielt.",
    "player.noCompetitions": "Noch zu keinem Wettbewerb gemeldet.",
    // Die Seite eines Blocks: die Summen seines Rasters, was ein Ergebnis für
    // den Spieler der Zeile ist, gesprochen statt angezeigt, und ein Spieler,
    // der zurückgezogen hat.
    "block.wins": "Siege",
    "block.matches": "Matches",
    "block.netGames": "Spieldifferenz",
    "block.games": "Spiele",
    "block.netHoops": "Tordifferenz",
    "block.won": "gewonnen",
    "block.lost": "verloren",
    "block.drawn": "unentschieden",
    "block.withdrawn": "zurückgezogen",
    // Ein zurückgezogenes Spiel, das das Spanische anders sagt als einen
    // Spieler.
    "block.gameWithdrawn": "zurückgezogen",
    "block.losses": "Niederlagen",
    // Die drei Ansichten eines Blocks, unter seiner Überschrift angeboten.
    "competition.views": "Ansichten",
    "competition.view.grid": "Raster",
    "competition.view.summary": "Zusammenfassung",
    "competition.view.orderOfPlay": "Spielreihenfolge",
    "competition.print": "Drucken",
    "competition.playedTo": "Gespielt bis {hoops} Tore",
    "blockSummary.ranking":
      "Gereiht nach dem Anteil gewonnener Matches, dann nach der Tordifferenz. Die eigenen Bestimmungen eines Turniers können die Spieler anders platzieren.",
    "orderOfPlay.none": "Es wurden noch keine Spiele gespielt.",
    "orderOfPlay.column.game": "Spiel",
    "orderOfPlay.column.date": "Datum",
    // Die Runden eines K.-o.-Turniers, wie die alte Website sie nannte, von
    // der letzten aus zurückgezählt, und ein Freilos anstelle eines Spielers.
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Halbfinale",
    "knockout.round.quarters": "Viertelfinale",
    "knockout.round.number": "Runde {number}",
    "knockout.bye": "Freilos",
    // Die Tabelle eines Schweizer Systems: was jeder Spieler gespielt und
    // gewonnen hat, und seine Ergebnisse.
    "swiss.games": "Spiele",
    "swiss.wins": "Siege",
    "swiss.winShare": "Siege %",
    "swiss.results": "Ergebnisse",
    // Die Pfeile, die das Raster eines K.-o.-Turniers zum Finale und zurück
    // zur ersten Runde scrollen.
    "knockout.onward": "Spätere Runden",
    "knockout.back": "Frühere Runden",
    // Was jede Turnierliste auf der Startseite und der eines Jahres
    // gemeinsam hat: die Spalten der Tabelle und was sie eingrenzt.
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Name",
    // Eine Flagge, die die Listen auf ihr Land eingrenzt, benannt nach dem,
    // was sie tut.
    "tournamentList.onlyIn": "Nur Turniere in {country}",
    "tournamentList.usualOrder": "Zurück zur üblichen Reihenfolge",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Jedes Land",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Jede Region",
    "tournamentList.filter.noRegionsBefore":
      "Turniere vor November 2026 haben keine Region.",
    "tournamentList.filter.sport": "Sportart",
    "tournamentList.filter.anySport": "Jede Sportart",
    "tournamentList.filter.submit": "Filtern",
    // Die Jahre, in denen es Turniere gibt, die Zweitnavigation beider.
    "years.label": "Jahre",
    // Die Auswahlliste mit den Jahren, die nicht als Reiter passen.
    "years.earlier": "Frühere Jahre",

    // Die Wörter der Verwaltung. Die Verwaltung zeichnet sie im Browser, also
    // sagt der Server sie in seine Seite hinein, wenn er sie sendet
    // (adminPage.ts): diese und die Ablehnungen des Turniers weiter unten.
    "admin.newerBuild.message":
      "Eine neuere Version dieser Website ist verfügbar.",
    "admin.newerBuild.reload": "Neu laden",
    "admin.title": "Verwaltung",
    "admin.tournaments.new": "Neues Turnier",
    "admin.tournaments.none": "Keine Turniere",
    "admin.tournaments.filter.none": "Keine passenden Turniere",
    "admin.tournaments.show": "Anzeigen",
    "admin.tournaments.managerScorer": "Leiter/Schreiber",
    "admin.tournaments.worldRanking": "Weltrangliste",
    "admin.tournaments.notWorldRanking": "Nicht Weltrangliste",
    // Wird einer Screenreader-Nutzerin gesagt, da ein durchgestrichener Name
    // nicht vorgelesen wird.
    "admin.tournaments.archived": "Archiviert",
    "admin.tournaments.manage": "Verwalten",
    "admin.tournaments.edit": "Bearbeiten",
    "admin.tournaments.archive": "Archivieren",
    "admin.tournaments.restore": "Wiederherstellen",
    "admin.tournaments.scores": "Ergebnisse",
    "admin.tournaments.players": "Spieler",
    "admin.years.label": "Jahre",
    // Was die Auswahlliste der Jahre sagt, solange das gewählte Jahr ein
    // Reiter ist.
    "admin.years.earlier": "Frühere Jahre",
    "admin.tournament.name": "Name",
    "admin.tournament.starts": "Beginn",
    "admin.tournament.finishes": "Ende",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sportart",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Untertitel",
    "admin.rules.handicap": "Mit Vorgaben gespielt",
    "admin.rules.drawsAllowed": "Lässt Unentschieden zu",
    "admin.tournament.levelTestsDrawn":
      "Gleichstand in Tests ist unentschieden",
    "admin.rules.worldRankings": "Zählt für die Weltranglisten",
    "admin.rules.maximumHoops": "Höchstzahl der Tore",
    "admin.tournament.national": "Veranstaltung auf nationaler Ebene",
    "admin.tournament.international": "Veranstaltung auf internationaler Ebene",
    // Eine Ablehnung ohne eigene Worte, über den Feldern.
    "admin.tournament.otherwise": "Das kann so nicht angenommen werden.",
    "admin.newTournament.title": "Neues Turnier",
    "admin.newTournament.submit": "Turnier anlegen",
    "admin.editTournament.title": "Turnier bearbeiten",
    "admin.editTournament.submit": "Turnier aktualisieren",
    // Anstelle des Formulars gesagt, bei einer Ablehnung ohne eigene Worte.
    "admin.editTournament.otherwise":
      "Dieses Turnier kann nicht geändert werden.",
    // Die Seite eines Turniers und die Reiter, in denen steht, was zu leiten
    // ist.
    "admin.view.tabs": "Turnier",
    "admin.view.players": "Spieler",
    "admin.view.competitions": "Wettbewerbe",
    "admin.view.managers": "Verantwortliche",
    "admin.view.notes": "Notizen",
    "admin.view.scorers": "Ergebniserfasser",
    "admin.view.rankings": "Ranglisten",
    "admin.rankings.file":
      "Die Weltranglisten verwenden die Ergebnisse des Turniers mit dieser Funktion, die Verantwortlichen müssen nichts weiter tun.",
    "admin.rankings.download": "Spiele für die Weltrangliste herunterladen",
    "rankings.notAvailable": "Ranglisten sind nicht verfügbar",
    "rankings.notAvailable.sport":
      "Für die Sportart dieses Turniers gibt es keine Weltranglisten, also gibt es keine Ranglisten zu senden.",
    "rankings.notAvailable.notCounted":
      "Keiner der Wettbewerbe dieses Turniers zählt für die Weltranglisten.",
    // Anstelle der Reiter gesagt, bei einer Ablehnung ohne eigene Worte.
    "admin.view.otherwise":
      "Dieses Turnier kann von hier aus nicht geleitet werden.",
    // Die Seite eines Wettbewerbs und die Reiter, in denen steht, was zu
    // leiten ist.
    "admin.competitionView.tabs": "Wettbewerb",
    "admin.competitionView.players": "Spieler",
    "admin.competitionView.scores": "Ergebnisse",
    "admin.competitionView.losers": "Verlierer",
    "admin.losers.add": "K.-o.-Turnier der Verlierer hinzufügen",
    "admin.losers.round": "Verlierer von",
    "admin.losers.option": "{round} ({count} Verlierer)",
    "admin.losers.name": "Name des K.-o.-Turniers der Verlierer",
    "admin.losers.none": "Keine K.-o.-Turniere der Verlierer.",
    "admin.losers.noRounds":
      "In diesem K.-o.-Turnier gibt es keine Runde, deren Verlierer weiterspielen könnten.",
    "admin.losers.remove": "Entfernen",
    "admin.losers.readOnly":
      "Die Spieler dieses K.-o.-Turniers sind die Verlierer eines anderen K.-o.-Turniers und werden hier eingetragen, sobald jede Partie entschieden ist.",
    "admin.hover.losers.add":
      "Ein K.-o.-Turnier für die Verlierer einer Runde dieses K.-o.-Turniers hinzufügen",
    "Tournament.NoSuchRound":
      "Das K.-o.-Turnier hat keine solche Runde, die Verlierer weiterschickt.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Ein anderes K.-o.-Turnier übernimmt die Verlierer dieses Turniers, deshalb lassen sich seine Plätze nicht ändern.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Ein anderes K.-o.-Turnier in Verwendung übernimmt die Verlierer dieses Turniers, archivieren Sie daher zuerst jenes.",
    "Tournament.LosersKnockoutSourceArchived":
      "Dieses K.-o.-Turnier der Verlierer übernimmt die Verlierer eines archivierten K.-o.-Turniers, stellen Sie daher zuerst jenes wieder her.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Ein K.-o.-Turnier der Verlierer hat so viele Plätze, wie die Runde, deren Verlierer es übernimmt, Partien hat.",
    "Competition.PlayersSetAutomatically":
      "Die Spieler eines K.-o.-Turniers der Verlierer werden eingetragen, sobald Partien entschieden sind, nicht von Hand.",
    // Die Bereichsleiste der Seite eines Turniers und der Seiten seiner
    // Wettbewerbe.
    "admin.sections.label": "Das Turnier und seine Wettbewerbe",
    "admin.sections.tournament": "Turnier",
    // Die Bereichsleiste der Seiten des Administrators.
    "admin.administrator.sections.label": "Die Seiten des Administrators",
    "admin.administrator.sections.tournaments": "Turniere",
    "admin.administrator.sections.accounts": "Konten",
    "admin.administrator.sections.worldRankings": "Weltranglisten",
    "admin.administrator.sections.importErrors": "Importfehler",
    "admin.administrator.sections.logs": "Protokolle",
    "admin.administrator.sections.databaseStatus": "Datenbankzugriff",
    "admin.administrator.sections.countries": "Länder",
    "admin.databaseStatus.title": "Datenbankzugriff",
    "admin.databaseStatus.on": "Der Datenbankzugriff ist eingeschaltet.",
    "admin.databaseStatus.off": "Der Datenbankzugriff ist ausgeschaltet.",
    "admin.databaseStatus.expected":
      "Die Website ist voraussichtlich in {minutes} Minuten wieder da.",
    "admin.databaseStatus.expectedOne":
      "Die Website ist voraussichtlich in 1 Minute wieder da.",
    "admin.databaseStatus.longer": "Es dauert länger als erwartet.",
    "admin.databaseStatus.told": "Den Lesern wird gesagt: {words}",
    "admin.databaseStatus.toldUsual":
      "Den Lesern wird der übliche Satz gesagt.",
    "admin.databaseStatus.minutes": "Erwartete Minuten",
    "admin.databaseStatus.words": "Worte für die Leser",
    "admin.databaseStatus.turnOff": "Ausschalten",
    "admin.databaseStatus.change": "Ändern",
    "admin.databaseStatus.turnOn": "Einschalten",
    "admin.databaseStatus.minutesNeeded": "Die Minuten werden benötigt.",
    "admin.databaseStatus.otherwise":
      "Auf der Website ist etwas schiefgegangen.",
    "DatabaseAccess.MinutesNotWhole":
      "Die Minuten müssen eine ganze Zahl sein.",
    "DatabaseAccess.MinutesOutOfRange":
      "Die Minuten müssen von 1 bis 1440 reichen.",
    "DatabaseAccess.WordsTooLong":
      "Der Text darf höchstens 500 Zeichen lang sein.",
    "DatabaseAccess.NotOff": "Der Datenbankzugriff ist nicht ausgeschaltet.",
    "admin.administrator.title": "Administrator",
    // Die Kontenseite, ein Abschnitt für jede Rolle.
    "admin.accounts.title": "Konten",
    "admin.roles.add": "Hinzufügen",
    "admin.roles.administrator.heading": "Administratoren",
    "admin.roles.administrator.none": "Keine weiteren Administratoren",
    "admin.roles.administrator.removeTitle": "Administrator entfernen",
    "admin.roles.administrator.removeExplanation":
      "{name} ist künftig kein Administrator dieser Website mehr.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Weltranglistenbeauftragte für Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Keine Weltranglistenbeauftragten für Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Weltranglistenbeauftragten für Association Croquet entfernen",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} ist künftig kein Weltranglistenbeauftragter für Association Croquet mehr.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Weltranglistenbeauftragte für Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Keine Weltranglistenbeauftragten für Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Weltranglistenbeauftragten für Golf Croquet entfernen",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} ist künftig kein Weltranglistenbeauftragter für Golf Croquet mehr.",
    // Für eine Ablehnung ohne eigene Worte, unter dem Feld oder anstelle der
    // Liste. Es geht nicht um die Adresse, denn es kann die beendete
    // Sitzung sein oder ein Fehler der Website.
    // Die Seite, auf der die Weltranglistenspieler importiert werden, und ihr
    // Protokoll, eine Zeile für alles, was der Import sagt. Eine Anzahl steht
    // nach einem Doppelpunkt, damit ein Spieler und viele gleich gesagt
    // werden.
    "admin.worldRankings.title": "Weltranglistenspieler importieren",
    "admin.worldRankings.import": "Importieren",
    "admin.worldRankings.log": "Wie der Import verlief",
    "admin.worldRankings.ac.reading":
      "Die Liste für Association Croquet wird gelesen",
    "admin.worldRankings.ac.read":
      "Gelesene Spieler für Association Croquet: {players}",
    "admin.worldRankings.ac.kept":
      "Beibehaltene Spieler für Association Croquet: {players}",
    "admin.worldRankings.ac.refused":
      "Die Liste für Association Croquet konnte nicht gelesen werden, daher blieben ihre Spieler, wie sie waren.",
    "admin.worldRankings.gc.reading": "Die Liste für Golf Croquet wird gelesen",
    "admin.worldRankings.gc.read":
      "Gelesene Spieler für Golf Croquet: {players}",
    "admin.worldRankings.gc.kept":
      "Beibehaltene Spieler für Golf Croquet: {players}",
    "admin.worldRankings.gc.refused":
      "Die Liste für Golf Croquet konnte nicht gelesen werden, daher blieben ihre Spieler, wie sie waren.",
    "admin.worldRankings.finished": "Abgeschlossen",
    "admin.worldRankings.failed": "Der Import wurde nicht abgeschlossen.",
    // Für eine Ablehnung ohne eigene Worte, als Fehler der Website.
    "admin.worldRankings.otherwise":
      "Auf der Website ist etwas schiefgegangen.",
    "WorldRankingLists.Unreachable":
      "Die Website der Weltranglisten war nicht erreichbar.",
    "WorldRankingLists.Unreadable":
      "Die Liste ist nicht so aufgebaut, wie die Weltranglisten ihre aufbauen: eine Zeile darin war nicht lesbar, sie enthält niemanden oder sie ist nicht in UTF-8 geschrieben.",
    // Die Dokumente, die der Import von den alten Websites abgelehnt hat, und
    // die Seite eines davon.
    "admin.importErrors.title": "Importfehler",
    "admin.importErrors.none": "Keine Importfehler",
    "admin.importErrors.otherwise": "Auf der Website ist etwas schiefgegangen.",
    "admin.countries.title": "Länder",
    "admin.countries.none":
      "Kein Turnier wird in einem Land gespielt, das die Listen nicht nennen",
    "admin.countries.oldSite": "Alte Seite",
    "admin.countries.otherwise": "Auf der Website ist etwas schiefgegangen.",
    "admin.logs.title": "Protokolle",
    "admin.logs.severity": "Schweregrad",
    "admin.logs.text": "Suchen",
    "admin.logs.show": "Anzeigen",
    "admin.logs.prune": "Bereinigen",
    "admin.logs.pruneAsk":
      "Das Protokoll vor der letzten Stunde entfernen? Nichts holt es zurück.",
    "admin.logs.removed": "{count} Einträge wurden entfernt",
    "admin.logs.none": "Keine Protokolleinträge",
    "admin.logs.otherwise": "Auf der Website ist etwas schiefgegangen.",
    "admin.hover.logs.show": "Die passenden Einträge anzeigen",
    "admin.hover.logs.prune": "Das Protokoll vor der letzten Stunde entfernen",
    "admin.hover.logs.pruneAgree":
      "Das Protokoll vor der letzten Stunde entfernen",
    "admin.importError.title": "Importfehler",
    "admin.importError.documentId": "Dokument-ID",
    "admin.importError.tournament": "Turnier",
    "admin.importError.competition": "Wettbewerb",
    "admin.importError.newSite": "Neue Website",
    "admin.importError.oldSite": "Alte Website",
    "ImportErrorKept.NotFound":
      "Der Import hat zu diesem Dokument keinen Fehler festgehalten.",
    "admin.competitionView.otherwise":
      "Dieser Wettbewerb kann von hier aus nicht geleitet werden.",
    // Der Reiter Wettbewerbe: die Art jedes Wettbewerbs, was man mit ihm tun
    // kann, und die Überschrift, unter der die archivierten stehen.
    "admin.competitions.block": "Block",
    "admin.competitions.knockout": "K.-o.-Turnier",
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
    // Der Dialog des Wettbewerbs.
    "admin.competition.addTitle": "Wettbewerb hinzufügen",
    "admin.competition.editTitle": "Wettbewerb bearbeiten",
    "admin.competition.name": "Name",
    "admin.competition.kind": "Art",
    "admin.competition.bestOf": "Best of",
    "admin.competition.rounds": "Runden",
    "admin.competition.places": "Plätze",
    "admin.competition.round": "Runde {number}",
    "admin.competition.bestOfs": "Best of je Runde",
    "admin.competition.quarters": "Viertelfinale",
    "admin.competition.semis": "Halbfinale",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Hinzufügen",
    "admin.competition.save": "Speichern",
    "admin.competition.added": "{name} wurde hinzugefügt.",
    // Über den Feldern, für eine Ablehnung ohne eigene Worte.
    "admin.competition.otherwise":
      "Dieser Wettbewerb kann so nicht gespeichert werden.",
    "CompetitionName.Missing": "Geben Sie einen Namen ein.",
    "CompetitionName.TooLong": "Ein Name darf höchstens 254 Zeichen lang sein.",
    "CompetitionName.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    "Tournament.KnockoutPlayerHasGames":
      "Spieler in dieser Auslosung haben Spiele, daher können sich ihre Plätze nicht ändern.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Eine Runde mit einem entschiedenen Match kann nicht auf ein kürzeres Best of gesetzt werden.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Eine Runde kann nicht geändert werden, sobald in einer späteren Runde ein Spiel gespielt wurde.",
    "Tournament.CompetitionNameTaken":
      "Ein anderer Wettbewerb in diesem Turnier hat bereits diesen Namen.",
    "Tournament.MaximumHoopsInvalid":
      "Geben Sie eine ganze Zahl von Toren ein, mindestens 1, oder lassen Sie das Feld leer für keine Höchstzahl.",
    "BestOf.NotWhole": "Geben Sie eine ganze Zahl von Spielen ein.",
    "BestOf.TooSmall": "Ein Match muss über mindestens 1 Spiel gehen.",
    "Rounds.NotWhole": "Geben Sie eine ganze Zahl von Runden ein.",
    "Rounds.TooSmall": "Ein Block muss in mindestens 1 Runde gespielt werden.",
    "KnockoutDraw.EvenBestOf":
      "Ein Match im K.-o.-Turnier muss einen Sieger haben, daher geht es über eine ungerade Zahl von Spielen.",
    // Der Ausweg jedes modalen Dialogs, da die Seite darunter nicht erreichbar
    // ist.
    "admin.hover.tournaments.new": "Ein neues Turnier anlegen",
    "admin.hover.tournaments.manage":
      "Spieler, Mannschaften, Wettbewerbe und Ergebnisse dieses Turniers verwalten",
    "admin.hover.tournaments.edit": "Die Angaben zu diesem Turnier ändern",
    "admin.hover.tournaments.scores": "Die Ergebnisse dieses Turniers eingeben",
    "admin.hover.tournaments.players": "Die Spieler dieses Turniers betreuen",
    "admin.hover.competitions.view":
      "Diesen Wettbewerb öffnen, um seine Spieler und Ergebnisse zu sehen und einzugeben",
    "admin.hover.tests.view":
      "Diesen Test öffnen, um seine Ergebnisse zu sehen und einzugeben",
    "admin.hover.teams.view":
      "Diese Mannschaft öffnen, um ihre Spieler zu sehen und zu verwalten",
    "admin.hover.dialog.player.add": "Diesen Spieler zum Turnier hinzufügen",
    "admin.hover.dialog.player.save":
      "Die Änderungen an diesem Spieler behalten",
    "admin.hover.dialog.team.add": "Diese Mannschaft zum Turnier hinzufügen",
    "admin.hover.dialog.team.save":
      "Die Änderungen an dieser Mannschaft behalten",
    "admin.hover.dialog.test.add": "Diesen Test zum Turnier hinzufügen",
    "admin.hover.dialog.test.save": "Die Änderungen an diesem Test behalten",
    "admin.hover.dialog.competition.add":
      "Diesen Wettbewerb zum Turnier hinzufügen",
    "admin.hover.dialog.competition.save":
      "Die Änderungen an diesem Wettbewerb behalten",
    "admin.hover.dialog.score.add": "Dieses Ergebnis zum Wettbewerb hinzufügen",
    "admin.hover.dialog.score.save":
      "Die Korrektur dieses Ergebnisses behalten",
    "admin.hover.dialog.carryForward.save":
      "Die Ergebnisse dieses Spielers übertragen",
    "admin.hover.dialog.tournament.new": "Dieses Turnier anlegen",
    "admin.hover.dialog.tournament.edit":
      "Die Änderungen an diesem Turnier behalten",
    "admin.hover.modal.cancel": "Dies schließen, ohne etwas zu behalten",
    "admin.hover.modal.ok": "Diese Meldung schließen",
    "admin.hover.tab": "Den Reiter {name} anzeigen",
    "admin.hover.tournaments.archive":
      "Dieses Turnier archivieren; es lässt sich wiederherstellen",
    "admin.hover.tournaments.restore": "Dieses archivierte Turnier zurückholen",
    "admin.hover.players.add": "Einen Spieler zu diesem Turnier hinzufügen",
    "admin.hover.players.addMany":
      "Mehrere Spieler auf einmal zu diesem Turnier hinzufügen",
    "admin.hover.dialog.players.add": "Diese Spieler zum Turnier hinzufügen",
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
      "Das Ergebnis eines Spiels zu diesem Wettbewerb hinzufügen",
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
    "admin.hover.notes.add": "Eine neue Notiz für dieses Turnier schreiben",
    "admin.hover.notes.edit": "Diese Notiz ändern",
    "admin.hover.notes.delete": "Diese Notiz löschen",
    "admin.hover.note.add": "Diese Notiz behalten und zum Turnier hinzufügen",
    "admin.hover.note.save": "Die Änderungen an dieser Notiz behalten",
    "admin.hover.people.add": "Dieser Person die Rolle geben",
    "admin.hover.people.remove": "Dieser Person die Rolle nehmen",
    "admin.hover.worldRankings.import":
      "Die Weltranglisten abrufen und ihre Spieler hinzufügen",
    "admin.modal.cancel": "Abbrechen",
    // Die eine Schaltfläche eines modalen Dialogs, der der Leserin nur etwas
    // mitteilt.
    "admin.modal.ok": "OK",
    // Die Reiter Verantwortliche und Ergebniserfasser, in denen man jemanden
    // über die E-Mail-Adresse dazu macht und wieder entfernt.
    "admin.people.emailAddress": "E-Mail-Adresse",
    "admin.people.remove": "Entfernen",
    "admin.people.otherwise": "Das konnte nicht ausgeführt werden.",
    // Neben dem eigenen Namen der Leserin unter den Verantwortlichen.
    "admin.managers.you": "Sie",
    "admin.managers.add": "Verantwortlichen hinzufügen",
    "admin.managers.email": "Verantwortlichen mailen",
    // Wird nie gesagt, da ein Turnier immer einen Verantwortlichen hat, aber
    // eine Liste sagt, was sie sagt, wenn sie leer ist.
    "admin.managers.none": "Keine Verantwortlichen",
    "admin.managers.removeTitle": "Verantwortlichen entfernen",
    "admin.managers.removeExplanation":
      "{name} kann dieses Turnier künftig nicht mehr leiten.",
    "admin.managers.removeYourself.explanation":
      "Sie können dieses Turnier künftig nicht mehr leiten, und niemand hier kann das für Sie rückgängig machen. Ein anderer Verantwortlicher kann Sie wieder dazu machen.",
    "admin.managers.otherwise":
      "Diese Adresse kann nicht zum Verantwortlichen gemacht werden.",
    // Der Reiter Spieler.
    // Der Reiter Spieler eines Wettbewerbs.
    "admin.competitionPlayers.add": "Spieler hinzufügen",
    // Unter der Auswahlliste, für eine Ablehnung ohne eigene Worte.
    "admin.competitionPlayers.otherwise":
      "Dieser Spieler kann nicht hinzugefügt werden.",
    "admin.competitionPlayers.choose": "Hinzuzufügender Spieler",
    "admin.competitionPlayers.nobody": "Spieler wählen",
    // In der Auswahlliste eines K.-o.-Turniers angeboten, und als was ein
    // Freilos aufgeführt wird.
    "admin.competitionPlayers.bye": "Freilos",
    "admin.competitionPlayers.all": "Jeder Spieler ist im Wettbewerb",
    "admin.competitionPlayers.none": "Keine Spieler",
    "admin.competitionPlayers.up": "Nach oben",
    "admin.competitionPlayers.down": "Nach unten",
    "admin.competitionPlayers.remove": "Entfernen",
    "admin.competitionPlayers.withdraw": "Zurückziehen",
    "admin.competitionPlayers.unwithdraw": "Zurückziehen aufheben",
    "admin.competitionPlayers.withdrawn": "Zurückgezogene Spieler",
    "admin.competitionPlayers.removeTitle": "Spieler entfernen",
    "admin.competitionPlayers.removeQuestion":
      "{name} wird aus dem Wettbewerb genommen. Das lässt sich nicht rückgängig machen.",
    "admin.competitionPlayers.withdrawTitle": "Spieler zurückziehen",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} spielt den Rest des Wettbewerbs nicht mehr, und die Spiele, die nicht gespielt wurden, werden ohne den Spieler entschieden.",
    "admin.competitionPlayers.carryForward": "Übertragen",
    // Der Dialog zum Übertragen, über dem Reiter Spieler eines Wettbewerbs.
    "admin.carryForward.title": "Übertragen - {name}",
    "admin.carryForward.save": "Speichern",
    // Über den Zahlen, für eine Ablehnung ohne eigene Worte.
    "admin.carryForward.otherwise":
      "Diese Übertragung kann nicht gespeichert werden.",
    "admin.carryForward.matchWins": "Match-Siege",
    "admin.carryForward.matchLosses": "Match-Niederlagen",
    "admin.carryForward.gameWins": "Spielsiege",
    "admin.carryForward.gameLosses": "Spielniederlagen",
    "admin.carryForward.hoopsFor": "Erzielte Tore",
    "admin.carryForward.hoopsAgainst": "Zugelassene Tore",
    "CarryForward.MatchWinsNotWhole":
      "Geben Sie eine ganze Zahl von Match-Siegen ein.",
    "CarryForward.MatchWinsBelowZero": "Geben Sie 0 oder mehr Match-Siege ein.",
    "CarryForward.MatchLossesNotWhole":
      "Geben Sie eine ganze Zahl von Match-Niederlagen ein.",
    "CarryForward.MatchLossesBelowZero":
      "Geben Sie 0 oder mehr Match-Niederlagen ein.",
    "CarryForward.GameWinsNotWhole":
      "Geben Sie eine ganze Zahl von Spielsiegen ein.",
    "CarryForward.GameWinsBelowZero": "Geben Sie 0 oder mehr Spielsiege ein.",
    "CarryForward.GameLossesNotWhole":
      "Geben Sie eine ganze Zahl von Spielniederlagen ein.",
    "CarryForward.GameLossesBelowZero":
      "Geben Sie 0 oder mehr Spielniederlagen ein.",
    "CarryForward.HoopsForNotWhole":
      "Geben Sie eine ganze Zahl erzielter Tore ein.",
    "CarryForward.HoopsForBelowZero":
      "Geben Sie 0 oder mehr erzielte Tore ein.",
    "CarryForward.HoopsAgainstNotWhole":
      "Geben Sie eine ganze Zahl zugelassener Tore ein.",
    "CarryForward.HoopsAgainstBelowZero":
      "Geben Sie 0 oder mehr zugelassene Tore ein.",
    // Der Reiter Ergebnisse eines Wettbewerbs und der Ergebnisdialog.
    "admin.scores.add": "Ergebnis hinzufügen",
    "admin.scores.none": "Keine Ergebnisse",
    "admin.scores.edit": "Bearbeiten",
    "admin.scores.drawNotFilledTitle": "Auslosung nicht vollständig",
    "admin.scores.archive": "Archivieren",
    "admin.scores.up": "Nach oben",
    "admin.scores.down": "Nach unten",
    "admin.scores.restore": "Wiederherstellen",
    "admin.scores.archived": "Archivierte Ergebnisse",
    "admin.scores.archivedSaid": "Archiviert",
    "admin.scores.withdraw": "Zurückziehen",
    "admin.scores.unwithdraw": "Zurückziehen aufheben",
    "admin.scores.withdrawnSaid": "Zurückgezogen",
    // Über der Liste, für eine Ablehnung ohne eigene Worte.
    "admin.scores.otherwise": "Das konnte nicht ausgeführt werden.",
    "admin.score.title": "Ergebnis hinzufügen",
    "admin.score.add": "Spiel hinzufügen",
    "admin.score.winner": "Sieger",
    "admin.score.winnerScore": "Ergebnis des Siegers",
    "admin.score.loser": "Verlierer",
    "admin.score.loserScore": "Ergebnis des Verlierers",
    "admin.score.beat": "schlug",
    "admin.score.added":
      "Das Spiel, das {winner} gegen {loser} gewonnen hat, wurde hinzugefügt.",
    "admin.score.otherwise": "Das Spiel konnte nicht hinzugefügt werden.",
    "admin.score.correctTitle": "Ergebnis bearbeiten",
    "admin.score.save": "Speichern",
    "admin.score.notCorrected": "Das Ergebnis konnte nicht korrigiert werden.",
    "Game.WinnerMissing": "Wählen Sie den Sieger.",
    "Game.WinnerScoreMissing": "Geben Sie das Ergebnis des Siegers ein.",
    "Game.LoserMissing": "Wählen Sie den Verlierer.",
    "Game.LoserScoreMissing": "Geben Sie das Ergebnis des Verlierers ein.",
    "Score.NoPoints": "Ein Ergebnis beginnt mit seiner Punktzahl.",
    "Game.SamePlayer": "Niemand spielt gegen sich selbst.",
    "Game.WinnerNotAhead":
      "Das Ergebnis des Siegers muss höher sein als das des Verlierers oder als gewonnen markiert.",
    "Game.LoserMarked":
      "Das Ergebnis des Verlierers kann nicht als gewonnen markiert werden.",
    "Game.ResultChanged":
      "Eine Korrektur behält das Resultat: ein gewonnenes Spiel bleibt gewonnen, und ein unentschiedenes bleibt unentschieden.",
    "Competition.MatchDecided": "Ihr Match ist bereits entschieden.",
    "Competition.DrawFull":
      "Der Spieler kann nicht hinzugefügt werden, weil das K.-o.-Turnier voll ist.",
    "Competition.DrawNotFilled":
      "Ergebnisse können erst hinzugefügt werden, wenn jeder Platz im K.-o.-Turnier mit einem Spieler oder einem Freilos besetzt ist.",
    "Competition.ByeOutsideKnockout":
      "Nur ein K.-o.-Turnier kann ein Freilos haben.",
    "Competition.NotDrawnToMeet":
      "Diese Spieler sind im K.-o.-Turnier derzeit nicht für ein Spiel gegeneinander ausgelost.",
    "Competition.WinnerHasPlayedOn":
      "Der Sieger dieses Matches hat sein nächstes Spiel schon gespielt, daher kann sich nicht mehr ändern, wer es gewonnen hat.",
    "CompetitionPlayer.Withdrawn":
      "Ein zurückgezogener Spieler spielt nicht mehr.",
    "admin.players.add": "Spieler hinzufügen",
    "admin.players.addMany": "Mehrere Spieler hinzufügen",
    "admin.players.none": "Keine Spieler",
    "admin.players.edit": "Bearbeiten",
    "admin.players.archive": "Archivieren",
    "admin.players.restore": "Wiederherstellen",
    "admin.players.up": "Nach oben",
    "admin.players.down": "Nach unten",
    // Gefragt, bevor ein Spieler archiviert wird, der in Wettbewerben ist,
    // denn das Archivieren nimmt ihn aus jedem heraus, und das
    // Wiederherstellen setzt ihn nicht wieder hinein.
    "admin.players.archiveTitle": "Spieler archivieren",
    "admin.players.archiveQuestion":
      "{name} wird aus diesen Wettbewerben entfernt:",
    "admin.players.archive.explanation":
      "Das Wiederherstellen setzt den Spieler nicht wieder in diese Wettbewerbe.",
    "admin.players.archived": "Archivierte Spieler",
    // Wird einer Screenreader-Nutzerin gesagt, da ein durchgestrichener Name
    // nicht vorgelesen wird.
    "admin.players.archivedSaid": "Archiviert",
    // Der Spielerdialog.
    "admin.player.addTitle": "Spieler hinzufügen",
    "admin.player.editTitle": "Spieler bearbeiten",
    "admin.player.name": "Name",
    "admin.player.handicap": "Vorgabe",
    "admin.player.representing": "Vertritt",
    "admin.player.worldRankingName": "Name des Weltranglistenspielers",
    // Neben dem Weltranglistennamen: ob die Weltranglisten ihn kennen.
    "admin.player.worldRankingKnown": "Die Weltranglisten kennen diesen Namen.",
    "admin.player.worldRankingQuestioned":
      "Die Weltranglisten haben keinen Spieler mit diesem Namen. Er könnte falsch geschrieben sein, oder der Spieler ist neu in den Ranglisten.",
    "admin.player.flag": "Flagge",
    "admin.player.add": "Hinzufügen",
    "admin.player.save": "Speichern",
    "admin.player.added": "{name} wurde hinzugefügt.",
    // Der Spielerdialog (players.feature): mehrere Spieler, in einem Feld geschrieben.
    "admin.players.addManyTitle": "Mehrere Spieler hinzufügen",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Hilfe",
    "admin.players.many": "Spieler",
    "admin.players.line": "Zeile {line}: {words}",
    "AddPlayers.FieldsMissing":
      "Schreiben Sie die Namen der Felder in die erste Zeile.",
    "AddPlayers.NameMissing": "Die Felder müssen Name enthalten.",
    "AddPlayers.FieldNotAllowed":
      "Ein Feld kann Name, Representing, Flag, Handicap oder WorldRankingPlayerName sein.",
    "AddPlayers.FieldRepeated": "Ein Feld darf nur einmal genannt werden.",
    "AddPlayers.PlayersMissing":
      "Schreiben Sie in jede Zeile nach der ersten einen Spieler.",
    "AddPlayers.TooManyPlayers":
      "Eine Liste kann höchstens 500 Spieler enthalten. Fügen Sie die übrigen in einer weiteren Liste hinzu.",
    "AddPlayers.ValuesMismatched":
      "Jeder Spieler braucht für jedes in der ersten Zeile genannte Feld einen Wert oder nichts.",
    // Über den Feldern, für eine Ablehnung ohne eigene Worte.
    "admin.player.otherwise":
      "Dieser Spieler kann so nicht gespeichert werden.",
    "Tournament.PlayerNameTaken":
      "Ein anderer Spieler in diesem Turnier hat bereits diesen Namen.",
    "TournamentPlayer.NoSuchFlag": "Wählen Sie eine der vorhandenen Flaggen.",
    "TournamentPlayer.HandicapMalformed":
      "Schreiben Sie die Vorgabe als Zahl. Zum Beispiel: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Ein Spieler kann nicht Bye heißen.",
    "TournamentPlayer.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    // Der Dialog über dem Spielerdialog, wenn ein Spieler als Freilos benannt
    // wird.
    "admin.player.byesTitle": "Freilose müssen nicht hinzugefügt werden",
    "admin.player.byes":
      "Ein Freilos gehört nicht zu den Spielern des Turniers. Ein K.-o.-Turnier bietet Bye an, sooft Spieler hinzugefügt werden, so oft, wie seine Auslosung es braucht.",
    // Ein Turnier, das mit Mannschaften gespielt wird (view.feature): seine
    // Reiter Mannschaften und Tests, die Seite einer Mannschaft und ihre
    // Dialoge.
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
      "Wie die Tests der Mannschaft benannt werden, zum Beispiel AUS v ENG.",
    "admin.team.flag": "Flagge",
    "admin.team.add": "Hinzufügen",
    "admin.team.save": "Speichern",
    "admin.team.added": "{name} wurde hinzugefügt.",
    // Über den Feldern, für eine Ablehnung ohne eigene Worte.
    "admin.team.otherwise":
      "Diese Mannschaft kann so nicht gespeichert werden.",
    "admin.teamView.otherwise":
      "Diese Mannschaft kann von hier aus nicht angesehen werden.",
    "admin.teamView.players": "Spieler",
    "TeamName.Missing": "Sagen Sie, wie die Mannschaft heißt.",
    "TeamName.TooLong": "Dieser Name ist zu lang.",
    "admin.notes.add": "Notiz hinzufügen",
    "admin.notes.none": "Keine Notizen",
    "admin.notes.edit": "Bearbeiten",
    "admin.notes.delete": "Löschen",
    // Gefragt, bevor eine Notiz gelöscht wird, denn eine gelöschte Notiz ist
    // für immer weg.
    "admin.notes.deleteTitle": "Notiz löschen",
    "admin.notes.deleteQuestion": "Die Notiz „{title}“ löschen?",
    "admin.notes.delete.explanation":
      "Eine gelöschte Notiz ist für immer weg und lässt sich nicht zurückholen.",
    // Über der Liste, für eine Ablehnung ohne eigene Worte.
    "admin.notes.otherwise": "Das konnte nicht ausgeführt werden.",
    // Der Notizdialog, die Reiter seiner Beschreibung und die Werkzeugleiste
    // über seinem Feld.
    "admin.note.addTitle": "Notiz hinzufügen",
    "admin.note.editTitle": "Notiz bearbeiten",
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
    // Über den Feldern, für eine Ablehnung ohne eigene Worte.
    "admin.note.otherwise": "Diese Notiz kann so nicht gespeichert werden.",
    "ManagerNoteTitle.Missing": "Geben Sie der Notiz einen Titel.",
    "ManagerNoteTitle.TooLong": "Dieser Titel ist zu lang.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Ein Titel braucht einen Buchstaben oder eine Ziffer.",
    "ManagerNoteDescription.TooLong": "Diese Beschreibung ist zu lang.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Diese Notiz gibt es nicht mehr. Ein anderer Verantwortlicher hat sie vielleicht gelöscht.",
    "EditManagerNote.NoSuchManagerNote":
      "Diese Notiz gibt es nicht mehr. Ein anderer Verantwortlicher hat sie vielleicht gelöscht.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Diese Notiz gibt es nicht mehr. Ein anderer Verantwortlicher hat sie vielleicht gelöscht.",
    "ManagerNote.Deleted":
      "Diese Notiz wurde gelöscht. Ein anderer Verantwortlicher hat sie vielleicht gelöscht.",
    "CommentaryTitle.Missing": "Geben Sie dem Kommentar einen Titel.",
    "CommentaryTitle.TooLong": "Dieser Titel ist zu lang.",
    "CommentaryTitle.NoLetterOrDigit":
      "Ein Titel braucht einen Buchstaben oder eine Ziffer.",
    "Commentary.TitleTaken": "Ein anderer Kommentar hat bereits diesen Titel.",
    "CommentText.Missing": "Schreiben Sie etwas in den Beitrag.",
    "CommentText.TooLong": "Dieser Beitrag ist zu lang.",
    "TeamShortName.Missing": "Geben Sie der Mannschaft einen Kurznamen.",
    "TeamShortName.TooLong":
      "Ein Kurzname darf höchstens 10 Zeichen lang sein.",
    "TeamShortName.NoLetterOrDigit":
      "Ein Kurzname braucht einen Buchstaben oder eine Ziffer.",
    "Team.ShortNameLongerThanName":
      "Ein Kurzname darf nicht länger sein als der Name der Mannschaft.",
    "Team.NoSuchFlag": "Wählen Sie eine der vorhandenen Flaggen.",
    "Team.Archived":
      "Diese Mannschaft ist archiviert und wird zuerst wiederhergestellt.",
    "Team.InATest":
      "Diese Mannschaft spielt in einem Test und kann nicht archiviert werden.",
    "Team.PlayerNameTaken":
      "Ein anderer Spieler in dieser Mannschaft hat bereits diesen Namen.",
    "TeamPlayer.NamedBye": "Ein Spieler kann nicht Bye heißen.",
    "TeamPlayer.Archived":
      "Dieser Spieler ist archiviert und wird zuerst wiederhergestellt.",
    "TeamPlayer.HasGames":
      "Dieser Spieler hat gespielt und kann nicht archiviert werden.",
    "Tournament.TeamNameTaken":
      "Eine andere Mannschaft in diesem Turnier hat bereits diesen Namen.",
    "Tournament.TeamShortNameTaken":
      "Eine andere Mannschaft in diesem Turnier hat bereits diesen Kurznamen.",
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
      "Ein Test findet zwischen zwei Mannschaften statt, daher braucht es zuerst zwei Mannschaften.",
    "admin.tests.toTeams": "Zu den Mannschaften",
    "admin.tests.matches.one": "{count} Match",
    "admin.tests.matches.other": "{count} Matches",
    "admin.tests.bestOf": "Best of {games}",
    // Neben der Liste, für eine Ablehnung ohne eigene Worte.
    "admin.tests.otherwise": "Das konnte nicht ausgeführt werden.",
    "admin.test.addTitle": "Test hinzufügen",
    "admin.test.editTitle": "Test bearbeiten",
    "admin.test.firstTeam": "Mannschaft A",
    "admin.test.secondTeam": "Mannschaft B",
    "admin.test.versus": "v",
    "admin.test.starts": "Beginn",
    "admin.test.finishes": "Ende",
    "admin.test.expectedMatches": "Erwartete Matches",
    "admin.test.bestOf": "Best of",
    "admin.test.group": "Gruppe",
    "admin.test.add": "Hinzufügen",
    "admin.test.save": "Speichern",
    "admin.test.added": "{name} wurde hinzugefügt.",
    "admin.test.otherwise": "Dieser Test kann so nicht gespeichert werden.",
    "admin.testView.otherwise":
      "Dieser Test kann von hier aus nicht angesehen werden.",
    "AddTest.FirstTeamMissing": "Wählen Sie die erste Mannschaft.",
    "AddTest.SecondTeamMissing": "Wählen Sie die zweite Mannschaft.",
    "UpdateTest.FirstTeamMissing": "Wählen Sie die erste Mannschaft.",
    "UpdateTest.SecondTeamMissing": "Wählen Sie die zweite Mannschaft.",
    "ExpectedMatches.NotWhole": "Geben Sie eine ganze Zahl von Matches ein.",
    "ExpectedMatches.TooSmall": "Ein Test muss mindestens 1 Match haben.",
    "TestGroup.TooLong": "Diese Gruppe ist zu lang.",
    "Tournament.TestAgainstItself":
      "Eine Mannschaft spielt keinen Test gegen sich selbst.",
    "Tournament.FormatHasNoGroups":
      "Ein Test in diesem Format wird keiner Gruppe zugeordnet.",
    "Tournament.TestFinishesBeforeStarts":
      "Ein Test kann nicht enden, bevor er beginnt.",
    "Tournament.TestStartsBeforeTournament":
      "Ein Test kann nicht vor seinem Turnier beginnen.",
    "Tournament.TestFinishesAfterTournament":
      "Ein Test kann nicht nach seinem Turnier enden.",
    "Tournament.TestHasGamesInUse":
      "Dieser Test hat Spiele, daher kann er erst archiviert werden, wenn diese es sind.",
    "Tournament.TestHasGames":
      "Dieser Test hat jetzt Spiele, daher können seine Mannschaften nicht mehr geändert werden.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Mehr Matches als das haben bereits begonnen.",
    "Tournament.BestOfBelowGamesPlayed":
      "Zwei Spieler haben bereits mehr Spiele gespielt als das.",
    "Competition.ExpectedMatchesReached":
      "In diesem Test haben bereits so viele Matches begonnen, wie erwartet werden.",
    "Competition.SameTeam":
      "Zwei Spieler derselben Mannschaft spielen nicht gegeneinander.",
    "AddManager.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, das zum Verantwortlichen gemacht werden kann.",
    "admin.scorers.add": "Ergebniserfasser hinzufügen",
    "admin.scorers.none": "Keine Ergebniserfasser",
    "admin.scorers.removeTitle": "Ergebniserfasser entfernen",
    "admin.scorers.removeExplanation":
      "{name} kann die Ergebnisse dieses Turniers künftig nicht mehr eingeben.",
    // Unter dem Feld, für eine Ablehnung ohne eigene Worte.
    "admin.scorers.otherwise":
      "Diese Adresse kann nicht zum Ergebniserfasser gemacht werden.",
    "AddScorer.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, das zum Ergebniserfasser gemacht werden kann.",
    // Rollen vergeben, nehmen und auflisten, was nur ein Administrator kann.
    "Account.NotAnAdministrator": "Das kann nur ein Administrator.",
    "AddRole.NoSuchAccount":
      "Zu dieser Adresse gibt es kein Konto, dem die Rolle gegeben werden kann.",
    "AddRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "RemoveRole.NoSuchAccount": "Dieses Konto gibt es nicht.",
    "RemoveRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "RemoveRole.Yourself":
      "Sie können sich die Rolle Administrator nicht selbst nehmen.",
    "AccountsWithRole.NoSuchRole": "Diese Rolle gibt es nicht.",
    "Tournament.AlreadyAManager":
      "Dieses Konto leitet das Turnier bereits und kann alles, was ein Ergebniserfasser kann.",

    // Die Ablehnungen eines Turniers, nach ihren Codes benannt, wie jede
    // verletzte Regel. Unter dem Feld, um das es jeweils geht, oder anstelle
    // des Formulars, wenn die Seite selbst abgelehnt wird.
    "TournamentName.Missing": "Sagen Sie, wie das Turnier heißt.",
    "TournamentName.TooShort": "Dieser Name ist zu kurz.",
    "TournamentName.TooLong": "Dieser Name ist zu lang.",
    "TournamentName.AllLowerCase":
      "Ein Name darf nicht nur aus Kleinbuchstaben bestehen.",
    "TournamentName.AllCapitals":
      "Ein Name darf nicht nur aus Großbuchstaben bestehen.",
    "TournamentName.NoLetterOrDigit":
      "Ein Name braucht einen Buchstaben oder eine Ziffer.",
    "ReadOnlyDate.Unreadable": "Geben Sie den Tag an.",
    "Tournament.FinishesBeforeStarts":
      "Ein Turnier kann nicht enden, bevor es beginnt.",
    "Tournament.StartsAfterNextYear":
      "Ein Turnier kann nicht nach dem nächsten Jahr beginnen.",
    "Tournament.FinishesAfterNextYear":
      "Ein Turnier kann nicht nach dem nächsten Jahr enden.",
    "CreateTournament.NoSuchCountry": "Wählen Sie das Land.",
    "TournamentSubtitle.TooLong":
      "Ein Untertitel darf höchstens 2000 Zeichen lang sein.",
    "Tournament.NotAManager":
      "Nur ein Verantwortlicher dieses Turniers kann es ändern.",
    "Tournament.NotAManagerOrScorer":
      "Nur ein Verantwortlicher oder Ergebniserfasser dieses Turniers kann es sehen.",
    "Tournament.Archived":
      "Dieses Turnier ist archiviert und wird wiederhergestellt, bevor es geändert werden kann.",
    "UpdateTournament.NoSuchTournament":
      "Unter dieser Adresse gibt es kein Turnier.",

    // Worin ein Turnier gespielt wird und wo, nach Code, wie die API sie dem
    // Formular der Verwaltung anbietet.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",

    "format.standard": "Standard",
    "format.teams": "Mannschaften",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC-Mannschaftsweltmeisterschaft",

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
    "country.ax": "Åland",
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
    "country.bw": "Botswana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonien",
    "country.cc": "Kokosinseln",
    "country.cd": "Demokratische Republik Kongo",
    "country.cf": "Zentralafrikanische Republik",
    "country.cg": "Republik Kongo",
    "country.ch": "Schweiz",
    "country.ci": "Côte d'Ivoire",
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
    "country.sj": "Svalbard und Jan Mayen",
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

    // Eine E-Mail besteht aus zwei Einträgen: ihrem Betreff, der Text ist, und ihrem
    // Inhalt, der ihr gesamtes Markup ist. Das Markup ist das der Website selbst;
    // die Platzhalter in geschweiften Klammern sind dieselben wie im Englischen.
    // Keine E-Mail spricht die Person mit Namen an („Guten Tag,“), damit nichts
    // über eine Person außer der Adresse in die Warteschlange muss.

    "Email.ConfirmAddress.subject":
      "Bestätigen Sie Ihre E-Mail-Adresse für {siteName}",
    "Email.ConfirmAddress.body": `
<p>Guten Tag,</p>

<p>
    Vielen Dank, dass Sie ein Konto bei <strong>{siteName}</strong> angelegt haben.<br />
    Bevor Sie Ihr Konto nutzen können, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:
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
    Wenn die Schaltfläche nicht funktioniert, können Sie Ihre E-Mail-Adresse auch bestätigen, indem Sie diesen Link in Ihrem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Wenn Sie dieses Konto nicht angelegt haben, können Sie diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Ein neuer Link zur Bestätigung Ihrer E-Mail-Adresse für {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Guten Tag,</p>

<p>
    Sie haben kürzlich eine neue E-Mail zur Bestätigung Ihrer E-Mail-Adresse für <strong>{siteName}</strong> angefordert.<br />
    Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:
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
    Wenn die Schaltfläche nicht funktioniert, können Sie Ihre E-Mail-Adresse auch bestätigen, indem Sie diesen Link in Ihrem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Nach der Bestätigung können Sie Ihr Konto ohne Unterbrechung weiter nutzen.
</p>

<p>
    Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Jemand hat versucht, sich mit Ihrer E-Mail-Adresse zu registrieren",
    "Email.AlreadyRegistered.body": `
<p>Guten Tag,</p>

<p>
    Jemand hat versucht, sich mit dieser E-Mail-Adresse bei <strong>{siteName}</strong> zu registrieren. Zu ihr gibt es bereits ein Konto. An Ihrem Konto hat sich nichts geändert.<br />
    Wenn Sie es waren: Sie haben bereits ein Konto und können sich darin anmelden:
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
    Wenn Sie Ihr Passwort vergessen haben, können Sie es hier zurücksetzen:
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
        Passwort vergessen
    </a>
</p>

<p>
    Wenn Sie es nicht waren, müssen Sie nichts tun. Niemand hat einen Zugang zu Ihrem Konto erhalten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bestätigen Sie den Umzug Ihres {siteName}-Kontos auf diese Adresse",
    "Email.ConfirmNewEmailAddress.body": `
<p>Guten Tag,</p>

<p>
    Jemand, der bei einem <strong>{siteName}</strong>-Konto angemeldet war, hat darum gebeten, es auf diese E-Mail-Adresse zu verschieben. Wenn Sie es waren, bestätigen Sie es hier, angemeldet bei diesem Konto. Der Link gilt 24 Stunden lang.
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
    Oder kopieren Sie diese Adresse in Ihren Browser:<br />
    {link}
</p>

<p>
    Wenn Sie es nicht waren, müssen Sie nichts tun. Es wird kein Konto hierher verschoben.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Jemand hat darum gebeten, ein Konto auf Ihre E-Mail-Adresse zu verschieben",
    "Email.AlreadyHasAnAccount.body": `
<p>Guten Tag,</p>

<p>
    Jemand, der bei einem <strong>{siteName}</strong>-Konto angemeldet war, hat darum gebeten, es auf diese E-Mail-Adresse zu verschieben, zu der es bereits ein eigenes Konto gibt. Nichts wurde verschoben, und an Ihrem Konto hat sich nichts geändert.
</p>

<p>
    Wenn Sie es waren: Sie haben unter dieser Adresse bereits ein Konto und können sich darin anmelden.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Ihr {siteName}-Konto wurde verschoben",
    "Email.EmailAddressChanged.body": `
<p>Guten Tag,</p>

<p>
    Ihr <strong>{siteName}</strong>-Konto wurde gerade auf eine andere E-Mail-Adresse verschoben, {emailAddress}, und Sie melden sich von nun an mit dieser Adresse an.
</p>

<p>
    Wenn Sie es nicht waren, hat jemand anderes Ihr Konto. Antworten Sie auf diese E-Mail und teilen Sie es uns mit.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Ihr {siteName}-Passwort wurde geändert",
    "Email.PasswordChanged.body": `
<p>Guten Tag,</p>

<p>
    Das Passwort für Ihr <strong>{siteName}</strong>-Konto wurde gerade geändert, und jeder andere Browser, der bei diesem Konto angemeldet war, wurde abgemeldet.<br />
    Wenn Sie es waren, müssen Sie nichts tun.
</p>

<p>
    Wenn Sie es nicht waren, hat jemand anderes Ihr Passwort. Legen Sie hier ein neues fest, dann wird diese Person abgemeldet:
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
        Passwort vergessen
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Neues Passwort für {siteName} festlegen",
    "Email.SetNewPassword.body": `
<p>Guten Tag,</p>

<p>
    Sie haben kürzlich angefordert, Ihr Passwort für <strong>{siteName}</strong> zurückzusetzen.<br />
    Sie können Ihr Passwort zurücksetzen, indem Sie auf die Schaltfläche unten klicken:
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
    Wenn die Schaltfläche nicht funktioniert, können Sie Ihr Passwort auch zurücksetzen, indem Sie diesen Link in Ihrem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Wenn Sie das Zurücksetzen des Passworts nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Passwort für {siteName} festlegen",
    "Email.SetPassword.body": `
<p>Guten Tag,</p>

<p>
    Ihr <strong>{siteName}</strong>-Konto hat kein Passwort: Sie melden sich mit Google an.<br />
    Sie haben darum gebeten, eines festzulegen, damit Sie sich auch mit Ihrer E-Mail-Adresse und einem Passwort anmelden können.
    Sie können es festlegen, indem Sie auf die Schaltfläche unten klicken:
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
    Wenn die Schaltfläche nicht funktioniert, können Sie Ihr Passwort auch festlegen, indem Sie diesen Link in Ihrem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Der Link gilt eine Stunde lang. Wenn Sie nicht darum gebeten haben, ein Passwort festzulegen, können Sie diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Zu dieser E-Mail-Adresse gibt es kein {siteName}-Konto",
    "Email.RegisterInstead.body": `
<p>Guten Tag,</p>

<p>
    Es wurde angefordert, das Passwort für eine E-Mail-Adresse zurückzusetzen, die zu keinem Konto bei <strong>{siteName}</strong> gehört.
</p>

<p>
    Wenn Sie unseren Dienst nutzen möchten, können Sie ein neues Konto anlegen unter:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Wenn Sie diese Anforderung nicht gestellt haben, können Sie diese E-Mail einfach ignorieren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bestätigen Sie, dass Ihr {siteName}-Konto vergessen werden soll",
    "Email.ConfirmForgetting.body": `
<p>Guten Tag,</p>

<p>
    Sie haben darum gebeten, dass Ihr <strong>{siteName}</strong>-Konto vergessen wird.<br />
    Folgen Sie der Schaltfläche unten, um zu sehen, was das bedeutet, und um sicher zu sagen,
    dass Sie es wollen:
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
    Wenn die Schaltfläche nicht funktioniert, können Sie diesen Link auch in Ihrem Browser öffnen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sobald es vergessen ist, kann niemand Ihren Namen und Ihre E-Mail-Adresse je wieder lesen, und man kann sich nicht mehr in Ihrem Konto anmelden. Das lässt sich nicht rückgängig machen.
</p>

<p>
    Der Link gilt einmal, bis 15 Minuten nachdem Sie ihn angefordert haben, und nur, solange Sie bei diesem Konto angemeldet sind. Danach fordern Sie ihn erneut in Ihrem Konto an.
</p>

<p>
    Wenn Sie nicht darum gebeten haben, geschieht nichts, solange dem Link niemand folgt. Jemand, der bei Ihrem Konto angemeldet war, hat jedoch darum gebeten. Legen Sie deshalb auf der Seite „Passwort vergessen“ ein neues Passwort fest, um sicherzugehen, dass sich diese Person nicht erneut anmelden kann.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Die Registrierung ist ausgesetzt: {service} ist nicht erreichbar",
    "Email.RegistrationsSuspended.body": `
<p>Guten Tag,</p>

<p>
    {siteName} konnte {service} um {when} nicht erreichen. Bis es antwortet, wird Lesern, die es brauchen, um sich zu registrieren oder ein neues Passwort festzulegen, gesagt, es später erneut zu versuchen.
</p>

<p>
    Es muss nichts aufgehoben werden. Jeder Versuch fragt {service} neu an, und die Seiten funktionieren wieder, sobald es antwortet.
</p>

<p>
    Solange {service} ausfällt, erhalten Sie dazu höchstens einmal pro Stunde eine E-Mail.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} erreicht seine Datenbank nicht",
    "Email.DatabaseUnreachable.body": `
<p>Guten Tag,</p>

<p>
    {siteName} konnte seine Datenbank um {when} nicht erreichen. Bis sie antwortet, sagt jede Seite, die sie braucht, den Lesern, dass die Website nicht verfügbar ist und sie es später erneut versuchen sollen.
</p>

<p>
    Es muss nichts aufgehoben werden. Jede Anfrage fordert neu eine Verbindung an, und die Website funktioniert wieder, sobald die Datenbank antwortet.
</p>

<p>
    Solange die Datenbank ausfällt, erhalten Sie dazu höchstens alle {minutes} Minuten eine E-Mail.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject":
      "{siteName} ist bei einer Anfrage fehlgeschlagen",
    "Email.UnhandledError.body": `
<p>Guten Tag,</p>

<p>
    {siteName} ist um {when} bei einer Anfrage nach {asked} fehlgeschlagen. Dem Leser wurde die Referenz {reference} angezeigt, und das Protokoll enthält darunter die Ursache.
</p>

<p>
    Eine defekte Website scheitert meist bei jeder Anfrage, daher erhalten Sie höchstens 4-mal pro Stunde eine E-Mail zu Fehlern. Die späteren stehen trotzdem im Protokoll.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
