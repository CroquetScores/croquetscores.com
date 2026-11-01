// The site's words in Afrikaans. The reader is addressed as "jy" and "jou",
// the friendly form Afrikaans websites use. Menu items, buttons and headings
// are written in sentence case, as Afrikaans writes them: only the first word
// (and proper names) takes a capital. "E-posadres" is the email address, and
// "e-pos" the message sent to it. "Wagwoord" is the password, "teken in" and
// "teken uit" are sign in and sign out, "registreer" is register. A tournament
// is a "toernooi", a competition a "kompetisie", a hoop a "hoepel", a game a
// "spel" and a match a "wedstryd"; "Bye" stays English, as the site checks
// for it.
import type { Language } from "../common/language.js";

export const afrikaans: Language = {
  tag: "af",
  name: "Afrikaans",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Slaan oor na die inhoud",
    "navigation.menu": "Kieslys",
    "navigation.label": "Hoof",
    "navigation.home": "Tuis",
    "navigation.help": "Hulp",
    "navigation.admin": "Admin",
    "sections.label": "Afdelings",
    "theme.label": "Tema",
    "theme.light": "Lig",
    "theme.dark": "Donker",
    "theme.system": "Stelsel",
    "footer.donate": "Skenk",
    "footer.plea":
      "Geniet jy {siteName}? Skenk asseblief om verdere ontwikkeling te help.",
    "footer.copyright": "© Kopiereg {years}, {owner}",
    "footer.privacy": "Privaatheid",
    "footer.termsOfUse": "Gebruiksvoorwaardes",
    "footer.reportBug": "Rapporteer 'n fout",
    "beta.banner":
      "Dit is 'n beta-webwerf. Data kan enige tyd teruggestel word.",
    "privacy.contact":
      "Vrae oor hierdie bladsy, of oor wat oor jou bewaar word: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "Ek stem in tot die gebruiksvoorwaardes",
    "termsOfUse.link": "gebruiksvoorwaardes",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "Rapporteer wat geskryf is, of vra oor hierdie voorwaardes: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Merk die blokkie om in te stem tot die gebruiksvoorwaardes.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Dit is 'n veilige plek om {siteName} te leer ken. Enigiets wat hier ingevoer word, kan enige tyd verwyder word.",

    "language.label": "Taal",
    "language.choose": "Verander",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Daar is iets nuuts om te lees.",
    "whatsNew.admin.message":
      "Daar is iets nuuts vir die mense wat toernooie bestuur.",
    "whatsNew.view": "Kyk wat nuut is",
    "whatsNew.later": "Herinner my volgende keer",
    "whatsNew.never": "Wys my nooit weer hierdie kennisgewing nie",

    "form.otherwise":
      "Iets hier is nie reg nie. Kontroleer wat ingevoer is en probeer weer.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "Rekening",
    "account.register": "Registreer",
    "account.signIn": "Teken in",
    "account.forgotPassword": "Wagwoord vergeet",
    "account.signOut": "Teken uit",
    "account.profile": "Profiel",
    "account.changePassword": "Verander wagwoord",
    "account.changeEmailAddress": "Verander e-posadres",
    "account.changeName": "Verander naam",
    "account.setPassword": "Stel wagwoord",
    "account.forgetAccount": "Vergeet rekening",

    "register.title": "Registreer",
    "register.emailAddress": "E-posadres",
    "register.submit": "Registreer",
    "register.withGoogle": "Registreer met Google",
    "register.or": "of",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google het nie bevestig dat daardie e-posadres joune is nie, so dit kan nie hier met Google gebruik word nie. Gebruik eerder jou e-posadres hieronder.",
    "SignInWithGoogle.LinkedToAnother":
      "Daardie e-posadres het reeds 'n rekening, gekoppel aan 'n ander Google-rekening. Teken in met daardie Google-rekening, of met jou e-posadres en wagwoord.",
    "SignInWithGoogle.NameMissing":
      "Google het ons nie jou naam gegee nie, en 'n rekening het een nodig. Gebruik eerder jou e-posadres hieronder.",
    "Google.Unreachable":
      "Google kon nou nie bereik word nie. Probeer oor 'n paar minute weer, of gebruik jou e-posadres hieronder.",
    "Registration.NotAPerson":
      "Dit lyk nie of dit van 'n mens af kom nie. Probeer weer, en as dit aanhou gebeur, wag 'n paar minute en kom terug.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Voer 'n e-posadres in.",
    "EmailAddress.NoAt": "'n E-posadres het 'n @ daarin.",
    "EmailAddress.MoreThanOneAt": "'n E-posadres het een @ daarin.",
    "EmailAddress.NoDomain":
      "'n E-posadres het 'n domein na die @, soos example.com.",

    "welcome.title": "Kyk in jou e-pos",
    "welcome.checkEmail":
      "'n E-pos is oppad na die adres wat jy gegee het. Volg die skakel daarin om voort te gaan.",
    "welcome.nothingArrived":
      "As niks binne 'n paar minute opdaag nie, kyk in jou gemors- of strooipos-vouer.",
    "welcome.home": "Terug na {siteName}",
    "newConfirmationLink.title": "Kry 'n nuwe skakel",
    "newConfirmationLink.explanation":
      "Die skakel om jou e-posadres te bevestig het verval. Vra vir 'n nuwe een en dit sal gestuur word na die adres waarmee jy geregistreer het.",
    "newConfirmationLink.send": "Stuur vir my 'n nuwe skakel",
    "newConfirmationLink.home": "Terug na {siteName}",
    "newConfirmationLink.signIn": "Teken in",
    "newConfirmationLink.sent.title": "Kyk in jou e-pos",
    "newConfirmationLink.sent.explanation":
      "'n Nuwe skakel is oppad. Volg dit om jou e-posadres te bevestig. As niks binne 'n paar minute opdaag nie, kyk in jou gemors- of strooipos-vouer.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Daardie e-posadres is reeds bevestig",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Daar is niks meer om te bevestig nie. Teken in met die wagwoord wat jy gegee het toe jy dit bevestig het.",
    "newConfirmationLink.noLongerWorks.title":
      "Daardie skakel werk nie meer nie",
    "newConfirmationLink.noLongerWorks.explanation":
      "Kontroleer dat jy die hele skakel uit die e-pos gevolg het, sonder dat iets aan die einde ontbreek. As dit steeds nie werk nie, registreer weer en 'n nuwe skakel sal gestuur word.",
    "newConfirmationLink.tooMany.title": "Probeer later weer",
    "newConfirmationLink.tooMany.explanation":
      "Verskeie skakels is onlangs na hierdie adres gestuur. Wag 'n uur en vra weer, en kyk intussen in jou gemors- of strooipos-vouer.",

    "forgotPassword.title": "Wagwoord vergeet?",
    "forgotPassword.emailAddress": "E-posadres",
    "forgotPassword.submit": "Stuur my 'n pad terug in",
    "forgotPassword.home": "Terug na {siteName}",
    "forgotPassword.sent.title": "Kyk in jou e-pos",
    "forgotPassword.sent.explanation":
      "As daardie adres 'n rekening het, is 'n skakel om 'n nuwe wagwoord te stel oppad. Volg dit binne die uur. As niks binne 'n paar minute opdaag nie, kyk in jou gemors- of strooipos-vouer.",
    "forgotPassword.tryAgainLater":
      "Te veel paaie terug in is onlangs van hier af gevra. Wag 'n uur en probeer weer.",

    "setNewPassword.title": "Stel 'n nuwe wagwoord",
    "setNewPassword.password": "Wagwoord",
    "setNewPassword.confirmPassword": "Bevestig wagwoord",
    "setNewPassword.submit": "Stel my nuwe wagwoord",
    "setNewPassword.home": "Terug na {siteName}",
    "setNewPassword.signIn": "Teken in",
    "setNewPassword.askAgain": "Vra vir 'n nuwe skakel",
    "setNewPassword.changed.title": "Jou wagwoord is verander",
    "setNewPassword.changed.explanation":
      "Jy is oral afgeteken waar jy aangeteken was. Teken in met jou nuwe wagwoord.",
    "setNewPassword.expired.title": "Daardie skakel het verval",
    "setNewPassword.expired.explanation":
      "'n Skakel om 'n nuwe wagwoord te stel werk vir 'n uur. Vra vir 'n ander, en dit sal na dieselfde adres gestuur word.",
    "setNewPassword.noLongerWorks.title": "Daardie skakel werk nie meer nie",
    "setNewPassword.noLongerWorks.explanation":
      "Dit is dalk reeds gebruik, of iets ontbreek dalk aan die einde daarvan. Vra vir 'n ander as jy nog een nodig het.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Jou wagwoord kan nou nie nagegaan word nie, so dit is nie verander nie. Probeer oor 'n paar minute weer; jou skakel werk steeds totdat dit verval.",

    "forgetAccount.title": "Vergeet jou rekening",
    "forgetAccount.explanation":
      "Jou naam en e-posadres kan vir goed onleesbaar gemaak word, en jou rekening gesluit. Om seker te maak dat dit jy is, stuur ons eers 'n skakel na jou rekening se adres, en niks word vergeet voordat jy dit volg nie.",
    "forgetAccount.submit": "Stuur die skakel vir my",
    "forgetAccount.sent.title": "Kyk in jou e-pos",
    "forgetAccount.sent.explanation":
      "Ons het 'n skakel na jou rekening se adres gestuur. Dit werk 15 minute lank, en net terwyl jy by hierdie rekening aangeteken is.",
    "forgetAccount.confirm.title": "Jou rekening vir goed vergeet?",
    "forgetAccount.confirm.explanation":
      "Sodra dit vergeet is, kan jou naam en e-posadres nooit weer deur iemand gelees word nie, en jy kan nie meer by jou rekening aanteken nie. Dit kan nie ongedaan gemaak word nie.",
    "forgetAccount.confirm.submit": "Vergeet my rekening",
    "forgetAccount.forgotten.title": "Jou rekening is vergeet",
    "forgetAccount.forgotten.explanation":
      "Jou naam en e-posadres kan nie meer gelees word nie, en jy is oral afgeteken waar jy aangeteken was.",
    "forgetAccount.noLongerWorks.title": "Daardie skakel werk nie meer nie",
    "forgetAccount.noLongerWorks.explanation":
      "Dit het dalk verval, is reeds gebruik, of is vir 'n rekening waarby jy nie aangeteken is nie. Vra weer vanuit jou rekening as jy dit steeds wil laat vergeet.",
    "forgetAccount.lastAdministrator.title":
      "Jou rekening kan nie vergeet word nie",
    "forgetAccount.lastAdministrator.explanation":
      "Jy is hierdie webwerf se enigste administrateur. Gee die administrateurrol aan iemand anders, dan kan jou rekening vergeet word.",
    "forgetAccount.askAgain": "Vra weer",
    "forgetAccount.home": "Terug na {siteName}",

    "registrationsSuspended.title": "Registrasie is tans opgeskort",
    "registrationsSuspended.explanation":
      "'n Diens wat registrasie nodig het kan nou nie bereik word nie, so niemand kan registreer totdat dit weer antwoord nie. Niks wat jy getik het is bewaar nie.",
    "registrationsSuspended.tryAgainLater":
      "Probeer oor 'n rukkie weer. Die webwerf se administrateur is ingelig.",
    "registrationsSuspended.home": "Terug na {siteName}",

    "signIn.title": "Teken in",
    "signIn.emailAddress": "E-posadres",
    "signIn.password": "Wagwoord",
    "signIn.submit": "Teken in",
    "signIn.forgotPassword": "Wagwoord vergeet?",
    "signIn.register": "Registreer",
    "signIn.withGoogle": "Teken in met Google",
    "signIn.or": "of",
    "signIn.tryAgainLater":
      "Te veel pogings is onlangs aangewend. Wag 'n uur en probeer weer.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "Die e-posadres of wagwoord is verkeerd. Probeer asseblief weer.",

    "profile.title": "Profiel",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Naam:",
    "profile.emailAddress": "E-posadres:",

    "changeName.title": "Verander naam",
    "changeName.name": "Naam",
    "changeName.submit": "Verander naam",

    "setPassword.title": "Stel 'n wagwoord",
    "setPassword.explanation":
      "Jou rekening het geen wagwoord nie: jy teken in met Google. Om ook met 'n wagwoord in te teken, stuur ons 'n skakel om een te stel na {emailAddress}.",
    "setPassword.submit": "Stuur my 'n skakel",
    "setPassword.sent.title": "Kyk in jou e-pos",
    "setPassword.sent.explanation":
      "Ons het vir jou 'n skakel gestuur om 'n wagwoord te stel. Dit werk 'n uur lank.",
    "setPassword.profile": "Terug na jou profiel",

    "changePassword.title": "Verander wagwoord",
    "changePassword.currentPassword": "Huidige wagwoord",
    "changePassword.password": "Nuwe wagwoord",
    "changePassword.passwordConfirmation": "Bevestig wagwoord",
    "changePassword.forgotPassword": "Wagwoord vergeet?",
    "changePassword.submit": "Verander wagwoord",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Dit is nie jou wagwoord nie.",

    "changeEmailAddress.title": "Verander e-posadres",
    "changeEmailAddress.emailAddress": "Nuwe e-posadres",
    "changeEmailAddress.currentPassword": "Huidige wagwoord",
    "changeEmailAddress.submit": "Stuur 'n skakel om te bevestig",
    "changeEmailAddress.sent.title": "Kyk in jou e-pos",
    "changeEmailAddress.sent.explanation":
      "'n Skakel om die skuif te bevestig is na die nuwe e-posadres gestuur. Volg dit, aangeteken, om jou rekening soontoe te skuif.",
    "changeEmailAddress.confirm.title": "Skuif jou rekening",
    "changeEmailAddress.confirm.explanation":
      "Jou rekening sal skuif na {emailAddress}. Jy sal van nou af met daardie adres inteken.",
    "changeEmailAddress.confirm.submit": "Skuif my rekening",
    "changeEmailAddress.noLongerWorks.title":
      "Hierdie skakel werk nie meer nie",
    "changeEmailAddress.noLongerWorks.explanation":
      "Dit het verval, is gebruik, of is nie gestuur vir die rekening waarby jy aangeteken is nie. Vra weer vanuit jou profiel.",
    "changeEmailAddress.taken.title": "Jou rekening het nie geskuif nie",
    "changeEmailAddress.profile": "Terug na jou profiel",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Dit is nie jou wagwoord nie.",
    "ChangeEmailAddress.Unchanged": "Jou rekening is reeds by hierdie adres.",
    "ChangeEmailAddress.Taken":
      "Daardie e-posadres het nou 'n eie rekening, so joune kan nie soontoe skuif nie.",

    "confirmEmailAddress.title": "Bevestig jou e-posadres",
    "confirmEmailAddress.name": "Naam",
    "confirmEmailAddress.password": "Wagwoord",
    "confirmEmailAddress.confirmPassword": "Bevestig wagwoord",
    "confirmEmailAddress.submit": "Bevestig my e-posadres",
    "confirmEmailAddress.signIn": "Teken in",
    "confirmEmailAddress.home": "Terug na {siteName}",
    "confirmEmailAddress.confirmed.title": "Jou e-posadres is bevestig",
    "confirmEmailAddress.confirmed.explanation":
      "Jou rekening is gereed. Teken in met die e-posadres en wagwoord wat jy pas gegee het.",
    "confirmEmailAddress.expired.title": "Daardie skakel het verval",
    "confirmEmailAddress.expired.explanation":
      "'n Skakel om 'n e-posadres te bevestig werk 24 uur lank. Vra vir 'n nuwe een, en dit sal na dieselfde adres gestuur word.",
    "confirmEmailAddress.expired.newLink": "Stuur vir my 'n nuwe skakel",
    "confirmEmailAddress.noLongerWorks.title":
      "Daardie skakel werk nie meer nie",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Kontroleer dat jy die hele skakel uit die e-pos gevolg het, sonder dat iets aan die einde ontbreek. As dit steeds nie werk nie, registreer weer en 'n nuwe skakel sal gestuur word.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Daardie e-posadres is reeds bevestig",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Daar is niks meer om te doen nie. Teken in met die wagwoord wat jy gegee het toe jy dit bevestig het.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Voer 'n naam in.",
    "PersonName.TooShort": "'n Naam moet minstens 3 karakters lank wees.",
    "PersonName.TooLong": "'n Naam mag hoogstens 254 karakters lank wees.",
    "WorldRankingName.TooShort":
      "'n Wêreldranglysnaam moet minstens 3 karakters lank wees.",
    "WorldRankingName.TooLong":
      "'n Wêreldranglysnaam mag hoogstens 254 karakters lank wees.",
    "Password.Missing": "Voer 'n wagwoord in.",
    "Password.TooShort": "'n Wagwoord moet minstens 12 karakters lank wees.",
    "Password.ConfirmationDiffers":
      "Dit is nie dieselfde as die wagwoord hierbo nie. Tik dit weer.",
    "Password.Breached":
      "Hierdie wagwoord het elders in 'n databreuk verskyn, so dit is nie veilig om hier te gebruik nie. Kies 'n ander een.",

    "javaScriptRequired.title": "Skripte word benodig",
    "javaScriptRequired.explanation":
      "Registrasie vereis dat skripte vir hierdie webwerf aangeskakel is, sodat dit kan nagaan dat die persoon wat registreer 'n mens is. Skakel dit aan, en registreer dan weer.",
    "javaScriptRequired.register": "Terug na registrasie",
    "javaScriptRequired.home": "Terug na {siteName}",

    "errors.backHome": "Terug na {siteName}",
    "errors.notFound": "Nie gevind nie",
    "errors.refused": "Dit kon nie gedoen word nie",
    "errors.refusedDetail": "Iets in wat gestuur is, was nie reg nie.",
    "errors.sorry": "Jammer",
    "errors.sorryDetail": "Daardie versoek kon nie hanteer word nie.",
    "errors.failed": "Iets het skeefgeloop",
    "errors.reference": "Verwysing {reference}.",
    "errors.recorded":
      "Die fout is aangeteken en 'n e-pos is aan die administrateur gestuur. Dit help om die administrateur te e-pos met die verwysing en 'n beskrywing van wat jy gedoen het.",
    "errors.message": "Stuur 'n e-pos aan die administrateur",
    "errors.messageSubject": "Fout {reference} op {siteName}",
    "errors.messageBody": "Wat ek gedoen het toe dit gebeur het:\n\n",
    "errors.unavailable": "Die webwerf is nie beskikbaar nie",
    "errors.unavailableDetail":
      "Die webwerf kan nou nie bereik wat dit nodig het nie. Probeer asseblief later weer.",
    "errors.maintenance": "Die webwerf is af vir instandhouding.",
    "errors.maintenanceMinutes": "Dit word oor {minutes} minute terug verwag.",
    "errors.maintenanceMinute": "Dit word oor 1 minuut terug verwag.",
    "errors.maintenanceLonger":
      "Dit neem langer as verwag en sal binnekort terug wees.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Onlangse uitslae",
    "home.recentResults.none":
      "Geen wedstryde is in die afgelope sewe dae bygevoeg nie.",
    "home.upcomingTournaments": "Komende toernooie",
    "home.upcomingTournaments.none":
      "Geen toernooie begin in die volgende sestig dae nie.",
    "home.allTournaments": "Alle toernooie in {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Toernooie in {year}",
    "year.none": "Geen toernooie begin in {year} nie.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "{sport}-toernooie in {year}",
    "yearSport.none": "Geen {sport}-toernooie begin in {year} nie.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Onlangs",
    "tournament.summary": "Opsomming",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "Elke wedstryd is die beste van {count}.",
    "test.vs": "teen",
    "test.matches": "Wedstryde",
    "test.games": "Spelle",
    "test.hoops": "Hoepels",
    "teamSummary.tests": "Toetse",
    "teamSummary.matches": "Wedstryde",
    "teamSummary.games": "Spelle",
    "teamSummary.hoops": "Hoepels",
    "teamSummary.wins": "Oorwinnings",
    "teamSummary.losses": "Verliese",
    "teamSummary.draws": "Gelykopuitslae",
    "teamSummary.for": "Voor",
    "teamSummary.against": "Teen",
    "teamSummary.net": "Netto",
    "tournament.players": "Spelers",
    "search.label": "Soek",
    "search.tournaments": "Toernooie",
    "search.competitions": "Kompetisies",
    "search.nothingFound": "Niks is gevind nie.",
    "players.search.label": "Soek spelers",
    "players.search.prompt": "Tik 'n speler se naam om hom of haar te vind.",
    "players.search.none": "Geen spelers is gevind nie.",
    "search.more":
      "Net die eerste {count} word gewys. Voeg meer van die naam by om die soektog te vernou.",
    "websitePlayer.tournament": "Toernooi",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} teen {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Kommentaar",
    "tournament.beat": "het gewen teen",
    "tournament.drewWith": "het gelykop gespeel met",
    "tournament.ago.seconds": "{count} sek",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 uur",
    "tournament.ago.hours": "{count} ure",
    "tournament.none": "Nog geen spelle is gespeel nie.",
    // A tournament's players' page, when it has none.
    "players.none": "Nog geen spelers is bygevoeg nie.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "deur",
    "commentaries.start": "Begin nuwe kommentaar",
    // The page that starts a commentary.
    "startCommentary.title": "Begin nuwe kommentaar",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Begin kommentaar",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "nuut",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Die bestuurders het nog geen notas geskryf nie.",
    "note.edited": "gewysig",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "Nog geen opmerkings is geskryf nie.",
    "commentary.edited": "gewysig",
    "commentary.edit": "Wysig",
    "commentary.delete": "Skrap",
    "commentary.comment": "Opmerking",
    "commentary.add": "Voeg opmerking by",
    "commentary.notSent":
      "Die opmerking kon nie gestuur word nie. Laai die bladsy weer om te sien of dit bewaar is.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Verander titel",
    "changeCommentaryTitle.submit": "Bewaar",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "Wysig opmerking",
    "editComment.save": "Bewaar",
    "deleteComment.title": "Skrap opmerking",
    "deleteComment.question":
      "Skrap hierdie opmerking? Dit kan nie ongedaan gemaak word nie.",
    "deleteComment.confirm": "Skrap opmerking",
    "deleteComment.keep": "Behou dit",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "Spelle",
    "player.competitions": "Kompetisies",
    "player.beat": "het gewen teen",
    "player.lostTo": "het verloor teen",
    "player.drewWith": "het gelykop gespeel met",
    "player.score": "{score} teen {opponent}",
    "player.noGames": "Nog geen spelle is gespeel nie.",
    "player.noCompetitions": "Nog in geen kompetisie ingeskryf nie.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "Oorwinnings",
    "block.matches": "Wedstryde",
    "block.netGames": "Netto spelle",
    "block.games": "Spelle",
    "block.netHoops": "Netto hoepels",
    "block.won": "gewen",
    "block.lost": "verloor",
    "block.drawn": "gelykop",
    "block.withdrawn": "onttrek",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "onttrek",
    "block.losses": "Verliese",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Aansigte",
    "competition.view.grid": "Rooster",
    "competition.view.summary": "Opsomming",
    "competition.view.orderOfPlay": "Speelvolgorde",
    "competition.print": "Druk",
    "competition.playedTo": "Gespeel tot {hoops} poorte",
    "blockSummary.ranking":
      "Gerangskik volgens die aandeel wedstryde gewen, dan volgens netto hoepels. 'n Toernooi se eie reglement kan sy spelers anders plaas.",
    "orderOfPlay.none": "Nog geen spelle is gespeel nie.",
    "orderOfPlay.column.game": "Wedstryd",
    "orderOfPlay.column.date": "Datum",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "Eindstryd",
    "knockout.round.semis": "Halfeindrondtes",
    "knockout.round.quarters": "Kwarteindrondtes",
    "knockout.round.number": "Ronde {number}",
    "knockout.bye": "Bye",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "Spelle",
    "swiss.wins": "Oorwinnings",
    "swiss.winShare": "Wen-%",
    "swiss.results": "Uitslae",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "Latere rondtes",
    "knockout.back": "Vroeëre rondtes",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Naam",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Net toernooie in {country}",
    "tournamentList.usualOrder": "Terug na die gewone volgorde",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Enige land",
    "tournamentList.filter.region": "Streek",
    "tournamentList.filter.anyRegion": "Enige streek",
    "tournamentList.filter.noRegionsBefore":
      "Toernooie voor November 2026 het nie streke nie.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Enige sport",
    "tournamentList.filter.submit": "Filtreer",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "Jare",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Vroeëre jare",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message":
      "'n Nuwer weergawe van hierdie webwerf is beskikbaar.",
    "admin.newerBuild.reload": "Laai weer",
    "admin.title": "Admin",
    "admin.tournaments.new": "Nuwe toernooi",
    "admin.tournaments.none": "Geen toernooie nie",
    "admin.tournaments.filter.none": "Geen toernooie pas nie",
    "admin.tournaments.show": "Wys",
    "admin.tournaments.managerScorer": "Bestuurder/Telbeampte",
    "admin.tournaments.worldRanking": "Wêreldranglys",
    "admin.tournaments.notWorldRanking": "Nie wêreldranglys nie",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Geargiveer",
    "admin.tournaments.manage": "Bestuur",
    "admin.tournaments.edit": "Wysig",
    "admin.tournaments.archive": "Argiveer",
    "admin.tournaments.restore": "Herstel",
    "admin.tournaments.scores": "Uitslae",
    "admin.tournaments.players": "Spelers",
    "admin.years.label": "Jare",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Vroeëre jare",
    "admin.tournament.name": "Naam",
    "admin.tournament.starts": "Begin",
    "admin.tournament.finishes": "Eindig",
    "admin.tournament.format": "Formaat",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Streek",
    "admin.tournament.subtitle": "Onderskrif",
    "admin.rules.handicap": "Met voorgifte gespeel",
    "admin.rules.drawsAllowed": "Laat gelykopuitslae toe",
    "admin.tournament.levelTestsDrawn": "Gelyke toetse is gelykop",
    "admin.rules.worldRankings": "Tel vir wêreldranglyste",
    "admin.rules.maximumHoops": "Maksimum poorte",
    "admin.tournament.national": "Byeenkoms op nasionale vlak",
    "admin.tournament.international": "Byeenkoms op internasionale vlak",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Dit kan nie so aanvaar word nie.",
    "admin.newTournament.title": "Nuwe toernooi",
    "admin.newTournament.submit": "Skep toernooi",
    "admin.editTournament.title": "Wysig toernooi",
    "admin.editTournament.submit": "Dateer toernooi op",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise":
      "Hierdie toernooi kan nie verander word nie.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Toernooi",
    "admin.view.players": "Spelers",
    "admin.view.competitions": "Kompetisies",
    "admin.view.managers": "Bestuurders",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Telers",
    "admin.view.rankings": "Ranglyste",
    "admin.rankings.file":
      "Die wêreldranglyste sal die toernooi se uitslae gebruik deur hierdie funksie te gebruik, en bestuurders hoef niks te doen nie.",
    "admin.rankings.download": "Laai spelle af vir die wêreldranglys",
    "rankings.notAvailable": "Ranglyste is nie beskikbaar nie",
    "rankings.notAvailable.sport":
      "Hierdie toernooi se sport het geen wêreldranglyste nie, so daar is geen ranglyste om te stuur nie.",
    "rankings.notAvailable.notCounted":
      "Geen van hierdie toernooi se kompetisies tel vir die wêreldranglyste nie.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise":
      "Hierdie toernooi kan nie van hier af bestuur word nie.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Kompetisie",
    "admin.competitionView.players": "Spelers",
    "admin.competitionView.scores": "Uitslae",
    "admin.competitionView.losers": "Verloorders",
    "admin.losers.add": "Voeg verloorders-uitskakeling by",
    "admin.losers.round": "Verloorders van",
    "admin.losers.option": "{round} ({count} verloorders)",
    "admin.losers.name": "Naam van verloorders-uitskakeling",
    "admin.losers.none": "Geen verloorders-uitskakelings nie.",
    "admin.losers.noRounds":
      "Hierdie uitskakeling het geen rondte waarvan die verloorders kan voortspeel nie.",
    "admin.losers.remove": "Verwyder",
    "admin.losers.readOnly":
      "Die spelers van hierdie uitskakeling is die verloorders van 'n ander uitskakeling, en word hier gesit soos elke wedstryd beslis word.",
    "admin.hover.losers.add":
      "Voeg 'n uitskakeling by vir die verloorders van een van hierdie uitskakeling se rondtes",
    "Tournament.NoSuchRound":
      "Die uitskakeling het nie so 'n rondte wat verloorders aanstuur nie.",
    "Tournament.KnockoutHasLosersKnockouts":
      "'n Ander uitskakeling neem die verloorders van hierdie een, so sy plekke kan nie verander word nie.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "'n Ander uitskakeling wat in gebruik is, neem die verloorders van hierdie een, so argiveer eers daardie een.",
    "Tournament.LosersKnockoutPlacesFixed":
      "'n Verloorders-uitskakeling het soveel plekke as die rondte waarvan dit verloorders neem wedstryde het.",
    "Competition.PlayersSetAutomatically":
      "Die spelers van 'n verloorders-uitskakeling word daar gesit soos wedstryde beslis word, nie met die hand nie.",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "Die toernooi en sy kompetisies",
    "admin.sections.tournament": "Toernooi",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Die administrateur se bladsye",
    "admin.administrator.sections.tournaments": "Toernooie",
    "admin.administrator.sections.accounts": "Rekeninge",
    "admin.administrator.sections.worldRankings": "Wêreldranglyste",
    "admin.administrator.sections.importErrors": "Invoerfoute",
    "admin.administrator.sections.logs": "Logboeke",
    "admin.administrator.sections.databaseStatus": "Databasistoegang",
    "admin.administrator.sections.countries": "Lande",
    "admin.databaseStatus.title": "Databasistoegang",
    "admin.databaseStatus.on": "Databasistoegang is aan.",
    "admin.databaseStatus.off": "Databasistoegang is af.",
    "admin.databaseStatus.expected":
      "Die webwerf word oor {minutes} minute terug verwag.",
    "admin.databaseStatus.expectedOne":
      "Die webwerf word oor 1 minuut terug verwag.",
    "admin.databaseStatus.longer": "Dit neem langer as verwag.",
    "admin.databaseStatus.told": "Lesers word gesê: {words}",
    "admin.databaseStatus.toldUsual": "Lesers word die gewone sin gesê.",
    "admin.databaseStatus.minutes": "Minute verwag",
    "admin.databaseStatus.words": "Woorde vir lesers",
    "admin.databaseStatus.turnOff": "Skakel af",
    "admin.databaseStatus.change": "Verander",
    "admin.databaseStatus.turnOn": "Skakel aan",
    "admin.databaseStatus.minutesNeeded": "Die minute word benodig.",
    "admin.databaseStatus.otherwise": "Iets het op die webwerf skeefgeloop.",
    "DatabaseAccess.MinutesNotWhole": "Die minute moet 'n heelgetal wees.",
    "DatabaseAccess.MinutesOutOfRange": "Die minute moet van 1 tot 1440 wees.",
    "DatabaseAccess.WordsTooLong":
      "Die woorde mag nie meer as 500 karakters wees nie.",
    "DatabaseAccess.NotOff": "Databasistoegang is nie af nie.",
    "admin.administrator.title": "Administrateur",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Rekeninge",
    "admin.roles.add": "Voeg by",
    "admin.roles.administrator.heading": "Administrateurs",
    "admin.roles.administrator.none": "Geen ander administrateurs nie",
    "admin.roles.administrator.removeTitle": "Verwyder administrateur",
    "admin.roles.administrator.removeExplanation":
      "{name} sal nie meer 'n administrateur van hierdie webwerf wees nie.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Wêreldranglysbeamptes vir Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Geen wêreldranglysbeamptes vir Association Croquet nie",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Verwyder wêreldranglysbeampte vir Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} sal nie meer 'n wêreldranglysbeampte vir Association Croquet wees nie.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Wêreldranglysbeamptes vir Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Geen wêreldranglysbeamptes vir Golf Croquet nie",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Verwyder wêreldranglysbeampte vir Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} sal nie meer 'n wêreldranglysbeampte vir Golf Croquet wees nie.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "Voer wêreldranglysspelers in",
    "admin.worldRankings.import": "Voer in",
    "admin.worldRankings.log": "Hoe die invoer verloop het",
    "admin.worldRankings.ac.reading": "Lees tans die Association Croquet-lys",
    "admin.worldRankings.ac.read":
      "Association Croquet-spelers gelees: {players}",
    "admin.worldRankings.ac.kept":
      "Association Croquet-spelers behou: {players}",
    "admin.worldRankings.ac.refused":
      "Die Association Croquet-lys kon nie gelees word nie, so sy spelers is gelaat soos hulle was.",
    "admin.worldRankings.gc.reading": "Lees tans die Golf Croquet-lys",
    "admin.worldRankings.gc.read": "Golf Croquet-spelers gelees: {players}",
    "admin.worldRankings.gc.kept": "Golf Croquet-spelers behou: {players}",
    "admin.worldRankings.gc.refused":
      "Die Golf Croquet-lys kon nie gelees word nie, so sy spelers is gelaat soos hulle was.",
    "admin.worldRankings.finished": "Klaar",
    "admin.worldRankings.failed": "Die invoer is nie voltooi nie.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Iets het op die webwerf skeefgeloop.",
    "WorldRankingLists.Unreachable":
      "Die wêreldranglyste se webwerf kon nie bereik word nie.",
    "WorldRankingLists.Unreadable":
      "Die lys is nie opgestel soos die wêreldranglyste hulle s'n opstel nie: 'n reël daarin kon nie gelees word nie, niemand staan daarop nie, of dit is nie in UTF-8 geskryf nie.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Invoerfoute",
    "admin.importErrors.none": "Geen invoerfoute nie",
    "admin.importErrors.otherwise": "Iets het op die webwerf skeefgeloop.",
    "admin.countries.title": "Lande",
    "admin.countries.none":
      "Geen toernooi word gespeel in 'n land wat die lyste nie noem nie",
    "admin.countries.oldSite": "Ou werf",
    "admin.countries.otherwise": "Iets het op die webwerf skeefgeloop.",
    "admin.logs.title": "Logboeke",
    "admin.logs.severity": "Erns",
    "admin.logs.text": "Soek op",
    "admin.logs.show": "Wys",
    "admin.logs.prune": "Snoei",
    "admin.logs.pruneAsk":
      "Verwyder die logboek van voor die laaste uur? Niks bring dit terug nie.",
    "admin.logs.removed": "{count} inskrywings is verwyder",
    "admin.logs.none": "Geen logboekinskrywings nie",
    "admin.logs.otherwise": "Iets het op die webwerf skeefgeloop.",
    "admin.hover.logs.show": "Wys die inskrywings wat pas",
    "admin.hover.logs.prune": "Verwyder die logboek van voor die laaste uur",
    "admin.hover.logs.pruneAgree":
      "Verwyder die logboek van voor die laaste uur",
    "admin.importError.title": "Invoerfout",
    "admin.importError.documentId": "Dokument-id",
    "admin.importError.tournament": "Toernooi",
    "admin.importError.competition": "Kompetisie",
    "admin.importError.newSite": "Nuwe webwerf",
    "admin.importError.oldSite": "Ou webwerf",
    "ImportErrorKept.NotFound":
      "Die invoer het geen fout teen daardie dokument bewaar nie.",
    "admin.competitionView.otherwise":
      "Hierdie kompetisie kan nie van hier af bestuur word nie.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "Blok",
    "admin.competitions.knockout": "Uitskakeling",
    "admin.competitions.swiss": "Switsers",
    "admin.competitions.view": "Bekyk",
    "admin.competitions.edit": "Wysig",
    "admin.competitions.up": "Op",
    "admin.competitions.down": "Af",
    "admin.competitions.archive": "Argiveer",
    "admin.competitions.restore": "Herstel",
    "admin.competitions.archived": "Geargiveerde kompetisies",
    "admin.competitions.none": "Geen kompetisies nie",
    "admin.competitions.add": "Voeg kompetisie by",
    // The competition dialog.
    "admin.competition.addTitle": "Voeg kompetisie by",
    "admin.competition.editTitle": "Wysig kompetisie",
    "admin.competition.name": "Naam",
    "admin.competition.kind": "Soort",
    "admin.competition.bestOf": "Beste van",
    "admin.competition.rounds": "Rondtes",
    "admin.competition.places": "Plekke",
    "admin.competition.round": "Ronde {number}",
    "admin.competition.bestOfs": "Beste-van-getalle",
    "admin.competition.quarters": "Kwarteindrondtes",
    "admin.competition.semis": "Halfeindrondtes",
    "admin.competition.final": "Eindstryd",
    "admin.competition.add": "Voeg by",
    "admin.competition.save": "Bewaar",
    "admin.competition.added": "{name} is bygevoeg.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Hierdie kompetisie kan nie so bewaar word nie.",
    "CompetitionName.Missing": "Voer 'n naam in.",
    "CompetitionName.TooLong": "'n Naam mag hoogstens 254 karakters lank wees.",
    "CompetitionName.NoLetterOrDigit": "'n Naam moet 'n letter of syfer bevat.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelers in hierdie trekking het spelle, so sy plekke kan nie verander nie.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "'n Ronde met 'n beslote wedstryd kan nie 'n korter beste-van gemaak word nie.",
    "Tournament.KnockoutLaterRoundHasGames":
      "'n Ronde kan nie verander word nadat 'n spel in 'n latere ronde gespeel is nie.",
    "Tournament.CompetitionNameTaken":
      "Nog 'n kompetisie in hierdie toernooi het reeds daardie naam.",
    "Tournament.MaximumHoopsInvalid":
      "Voer 'n heelgetal poorte in, minstens 1, of laat dit leeg vir geen maksimum.",
    "BestOf.NotWhole": "Voer 'n heelgetal spelle in.",
    "BestOf.TooSmall": "'n Wedstryd moet die beste van minstens 1 spel wees.",
    "Rounds.NotWhole": "Voer 'n heelgetal rondtes in.",
    "Rounds.TooSmall": "'n Blok moet in minstens 1 ronde gespeel word.",
    "KnockoutDraw.EvenBestOf":
      "'n Uitskakeling se wedstryd moet 'n wenner hê, so dit is die beste van 'n onewe getal spelle.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Skep 'n nuwe toernooi",
    "admin.hover.tournaments.manage":
      "Bestuur hierdie toernooi se spelers, spanne, kompetisies en uitslae",
    "admin.hover.tournaments.edit": "Verander hierdie toernooi se besonderhede",
    "admin.hover.tournaments.scores": "Voer hierdie toernooi se uitslae in",
    "admin.hover.tournaments.players": "Versorg hierdie toernooi se spelers",
    "admin.hover.competitions.view":
      "Maak hierdie kompetisie oop om sy spelers en uitslae te sien en in te voer",
    "admin.hover.tests.view":
      "Maak hierdie toets oop om sy uitslae te sien en in te voer",
    "admin.hover.teams.view":
      "Maak hierdie span oop om sy spelers te sien en te bestuur",
    "admin.hover.dialog.player.add": "Voeg hierdie speler by die toernooi",
    "admin.hover.dialog.player.save":
      "Behou die veranderinge aan hierdie speler",
    "admin.hover.dialog.team.add": "Voeg hierdie span by die toernooi",
    "admin.hover.dialog.team.save": "Behou die veranderinge aan hierdie span",
    "admin.hover.dialog.test.add": "Voeg hierdie toets by die toernooi",
    "admin.hover.dialog.test.save": "Behou die veranderinge aan hierdie toets",
    "admin.hover.dialog.competition.add":
      "Voeg hierdie kompetisie by die toernooi",
    "admin.hover.dialog.competition.save":
      "Behou die veranderinge aan hierdie kompetisie",
    "admin.hover.dialog.score.add": "Voeg hierdie uitslag by die kompetisie",
    "admin.hover.dialog.score.save":
      "Behou die regstelling van hierdie uitslag",
    "admin.hover.dialog.carryForward.save": "Dra hierdie speler se uitslae oor",
    "admin.hover.dialog.tournament.new": "Skep hierdie toernooi",
    "admin.hover.dialog.tournament.edit":
      "Behou die veranderinge aan hierdie toernooi",
    "admin.hover.modal.cancel": "Maak dit toe sonder om iets te behou",
    "admin.hover.modal.ok": "Maak hierdie boodskap toe",
    "admin.hover.tab": "Wys die {name}-oortjie",
    "admin.hover.tournaments.archive":
      "Argiveer hierdie toernooi; dit kan herstel word",
    "admin.hover.tournaments.restore":
      "Bring hierdie geargiveerde toernooi terug",
    "admin.hover.players.add": "Voeg 'n speler by hierdie toernooi",
    "admin.hover.players.addMany":
      "Voeg etlike spelers gelyk by hierdie toernooi",
    "admin.hover.dialog.players.add": "Voeg hierdie spelers by die toernooi",
    "admin.hover.players.edit": "Verander hierdie speler se besonderhede",
    "admin.hover.players.up": "Skuif hierdie speler hoër in die lys",
    "admin.hover.players.down": "Skuif hierdie speler laer in die lys",
    "admin.hover.players.archive":
      "Argiveer hierdie speler; hy of sy kan herstel word",
    "admin.hover.players.restore": "Bring hierdie geargiveerde speler terug",
    "admin.hover.teams.add": "Voeg 'n span by hierdie toernooi",
    "admin.hover.teams.edit": "Verander hierdie span se besonderhede",
    "admin.hover.teams.up": "Skuif hierdie span hoër in die lys",
    "admin.hover.teams.down": "Skuif hierdie span laer in die lys",
    "admin.hover.teams.archive": "Argiveer hierdie span; dit kan herstel word",
    "admin.hover.teams.restore": "Bring hierdie geargiveerde span terug",
    "admin.hover.competitions.add": "Voeg 'n kompetisie by hierdie toernooi",
    "admin.hover.competitions.edit":
      "Verander hierdie kompetisie se besonderhede",
    "admin.hover.competitions.up": "Skuif hierdie kompetisie hoër in die lys",
    "admin.hover.competitions.down": "Skuif hierdie kompetisie laer in die lys",
    "admin.hover.competitions.archive":
      "Argiveer hierdie kompetisie; dit kan herstel word",
    "admin.hover.competitions.restore":
      "Bring hierdie geargiveerde kompetisie terug",
    "admin.hover.tests.add": "Voeg 'n toets tussen twee spanne by",
    "admin.hover.tests.edit": "Verander hierdie toets se besonderhede",
    "admin.hover.tests.up": "Skuif hierdie toets hoër in die lys",
    "admin.hover.tests.down": "Skuif hierdie toets laer in die lys",
    "admin.hover.tests.archive": "Argiveer hierdie toets; dit kan herstel word",
    "admin.hover.tests.restore": "Bring hierdie geargiveerde toets terug",
    "admin.hover.tests.toTeams":
      "Gaan na die Spanne-oortjie om die spanne by te voeg wat 'n toets nodig het",
    "admin.hover.scores.add": "Voeg 'n spel se uitslag by hierdie kompetisie",
    "admin.hover.scores.edit": "Korrigeer hierdie uitslag",
    "admin.hover.scores.archive":
      "Argiveer hierdie uitslag sodat dit ophou tel; dit kan herstel word",
    "admin.hover.scores.restore":
      "Bring hierdie geargiveerde uitslag terug, sodat dit weer tel",
    "admin.hover.scores.withdraw":
      "Hou hierdie uitslag op die lys maar laat dit ophou tel",
    "admin.hover.scores.unwithdraw": "Laat hierdie onttrekte uitslag weer tel",
    "admin.hover.scores.up": "Skuif hierdie uitslag vroeër in die lys",
    "admin.hover.scores.down": "Skuif hierdie uitslag later in die lys",
    "admin.hover.competitionPlayers.add":
      "Sit die gekose speler in hierdie kompetisie",
    "admin.hover.competitionPlayers.up": "Skuif hierdie speler hoër in die lys",
    "admin.hover.competitionPlayers.down":
      "Skuif hierdie speler laer in die lys",
    "admin.hover.competitionPlayers.remove":
      "Haal hierdie speler uit die kompetisie",
    "admin.hover.competitionPlayers.withdraw":
      "Trek hierdie speler uit die kompetisie terug",
    "admin.hover.competitionPlayers.unwithdraw":
      "Sit hierdie onttrekte speler terug in die kompetisie",
    "admin.hover.competitionPlayers.carryForward":
      "Dra hierdie speler se uitslae oor vanaf 'n ander kompetisie",
    "admin.hover.notes.add": "Skryf 'n nuwe nota vir hierdie toernooi",
    "admin.hover.notes.edit": "Verander hierdie nota",
    "admin.hover.notes.delete": "Skrap hierdie nota",
    "admin.hover.note.add": "Behou hierdie nota en voeg dit by die toernooi",
    "admin.hover.note.save": "Behou die veranderinge aan hierdie nota",
    "admin.hover.people.add": "Gee hierdie persoon die rol",
    "admin.hover.people.remove": "Neem die rol van hierdie persoon af",
    "admin.hover.worldRankings.import":
      "Haal die wêreldranglyste en voeg hul spelers by",
    "admin.modal.cancel": "Kanselleer",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "E-posadres",
    "admin.people.remove": "Verwyder",
    "admin.people.otherwise": "Dit kon nie gedoen word nie.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Jy",
    "admin.managers.add": "Voeg bestuurder by",
    "admin.managers.email": "Stuur e-pos aan die bestuurders",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "Geen bestuurders nie",
    "admin.managers.removeTitle": "Verwyder bestuurder",
    "admin.managers.removeExplanation":
      "{name} sal nie meer hierdie toernooi kan bestuur nie.",
    "admin.managers.removeYourself.explanation":
      "Jy sal nie meer hierdie toernooi kan bestuur nie, en niemand hier kan dit vir jou ongedaan maak nie. 'n Ander bestuurder kan jou weer een maak.",
    "admin.managers.otherwise":
      "Daardie adres kan nie 'n bestuurder gemaak word nie.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Voeg speler by",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Hierdie speler kan nie bygevoeg word nie.",
    "admin.competitionPlayers.choose": "Speler om by te voeg",
    "admin.competitionPlayers.nobody": "Kies 'n speler",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Elke speler is in die kompetisie",
    "admin.competitionPlayers.none": "Geen spelers nie",
    "admin.competitionPlayers.up": "Op",
    "admin.competitionPlayers.down": "Af",
    "admin.competitionPlayers.remove": "Verwyder",
    "admin.competitionPlayers.withdraw": "Trek terug",
    "admin.competitionPlayers.unwithdraw": "Herroep onttrekking",
    "admin.competitionPlayers.withdrawn": "Onttrekte spelers",
    "admin.competitionPlayers.removeTitle": "Verwyder speler",
    "admin.competitionPlayers.removeQuestion":
      "{name} sal uit die kompetisie geneem word. Dit kan nie ongedaan gemaak word nie.",
    "admin.competitionPlayers.withdrawTitle": "Trek speler terug",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} sal niks meer van die kompetisie speel nie, en die spelle wat hy of sy nie gespeel het nie, sal sonder hom of haar beslis word.",
    "admin.competitionPlayers.carryForward": "Dra oor",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Dra oor - {name}",
    "admin.carryForward.save": "Bewaar",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "Hierdie oordrag kan nie bewaar word nie.",
    "admin.carryForward.matchWins": "Wedstrydoorwinnings",
    "admin.carryForward.matchLosses": "Wedstrydverliese",
    "admin.carryForward.gameWins": "Speloorwinnings",
    "admin.carryForward.gameLosses": "Spelverliese",
    "admin.carryForward.hoopsFor": "Hoepels voor",
    "admin.carryForward.hoopsAgainst": "Hoepels teen",
    "CarryForward.MatchWinsNotWhole":
      "Voer 'n heelgetal wedstrydoorwinnings in.",
    "CarryForward.MatchWinsBelowZero": "Voer 0 of meer wedstrydoorwinnings in.",
    "CarryForward.MatchLossesNotWhole":
      "Voer 'n heelgetal wedstrydverliese in.",
    "CarryForward.MatchLossesBelowZero": "Voer 0 of meer wedstrydverliese in.",
    "CarryForward.GameWinsNotWhole": "Voer 'n heelgetal speloorwinnings in.",
    "CarryForward.GameWinsBelowZero": "Voer 0 of meer speloorwinnings in.",
    "CarryForward.GameLossesNotWhole": "Voer 'n heelgetal spelverliese in.",
    "CarryForward.GameLossesBelowZero": "Voer 0 of meer spelverliese in.",
    "CarryForward.HoopsForNotWhole": "Voer 'n heelgetal hoepels voor in.",
    "CarryForward.HoopsForBelowZero": "Voer 0 of meer hoepels voor in.",
    "CarryForward.HoopsAgainstNotWhole": "Voer 'n heelgetal hoepels teen in.",
    "CarryForward.HoopsAgainstBelowZero": "Voer 0 of meer hoepels teen in.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Voeg uitslag by",
    "admin.scores.none": "Geen uitslae nie",
    "admin.scores.edit": "Wysig",
    "admin.scores.drawNotFilledTitle": "Trekking nie gevul nie",
    "admin.scores.archive": "Argiveer",
    "admin.scores.up": "Op",
    "admin.scores.down": "Af",
    "admin.scores.restore": "Herstel",
    "admin.scores.archived": "Geargiveerde uitslae",
    "admin.scores.archivedSaid": "Geargiveer",
    "admin.scores.withdraw": "Trek terug",
    "admin.scores.unwithdraw": "Herroep onttrekking",
    "admin.scores.withdrawnSaid": "Onttrek",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "Dit kon nie gedoen word nie.",
    "admin.score.title": "Voeg uitslag by",
    "admin.score.add": "Voeg spel by",
    "admin.score.winner": "Wenner",
    "admin.score.winnerScore": "Wenner se telling",
    "admin.score.loser": "Verloorder",
    "admin.score.loserScore": "Verloorder se telling",
    "admin.score.beat": "het gewen teen",
    "admin.score.added":
      "Die spel wat {winner} teen {loser} gewen het, is bygevoeg.",
    "admin.score.otherwise": "Die spel kon nie bygevoeg word nie.",
    "admin.score.correctTitle": "Wysig uitslag",
    "admin.score.save": "Bewaar",
    "admin.score.notCorrected": "Die uitslag kon nie reggestel word nie.",
    "Game.WinnerMissing": "Kies die wenner.",
    "Game.WinnerScoreMissing": "Tik die wenner se telling.",
    "Game.LoserMissing": "Kies die verloorder.",
    "Game.LoserScoreMissing": "Tik die verloorder se telling.",
    "Score.NoPoints": "'n Telling begin met sy aantal punte.",
    "Game.SamePlayer": "Niemand speel teen homself nie.",
    "Game.WinnerNotAhead":
      "Die wenner se telling moet meer wees as die verloorder s'n, of as gewonne gemerk wees.",
    "Game.LoserMarked":
      "Die verloorder se telling kan nie as gewonne gemerk word nie.",
    "Game.ResultChanged":
      "'n Regstelling behou die uitslag: 'n gewonne spel bly gewonne, en 'n gelykop spel bly gelykop.",
    "Competition.MatchDecided": "Hul wedstryd is reeds beslis.",
    "Competition.DrawFull":
      "Kan nie die speler byvoeg nie, want die uitskakeling is vol.",
    "Competition.DrawNotFilled":
      "Uitslae kan nie bygevoeg word voordat elke plek in die uitskakeling gevul is met 'n speler of 'n bye nie.",
    "Competition.ByeOutsideKnockout": "Net 'n uitskakeling kan 'n bye hê.",
    "Competition.NotDrawnToMeet":
      "Hierdie spelers is nie tans getrek om in die uitskakeling teen mekaar te speel nie.",
    "Competition.WinnerHasPlayedOn":
      "Die wenner van hierdie wedstryd het reeds sy of haar volgende spel gespeel, so wie dit gewen het, kan nie verander nie.",
    "CompetitionPlayer.Withdrawn": "'n Onttrekte speler speel niks meer nie.",
    "admin.players.add": "Voeg speler by",
    "admin.players.addMany": "Voeg spelers by",
    "admin.players.none": "Geen spelers nie",
    "admin.players.edit": "Wysig",
    "admin.players.archive": "Argiveer",
    "admin.players.restore": "Herstel",
    "admin.players.up": "Op",
    "admin.players.down": "Af",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Argiveer speler",
    "admin.players.archiveQuestion":
      "{name} sal uit hierdie kompetisies verwyder word:",
    "admin.players.archive.explanation":
      "Om hom of haar te herstel sal hom of haar nie weer in hierdie kompetisies sit nie.",
    "admin.players.archived": "Geargiveerde spelers",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Geargiveer",
    // The player dialog.
    "admin.player.addTitle": "Voeg speler by",
    "admin.player.editTitle": "Wysig speler",
    "admin.player.name": "Naam",
    "admin.player.handicap": "Voorgee",
    "admin.player.representing": "Verteenwoordig",
    "admin.player.worldRankingName": "Wêreldranglys-spelernaam",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "Die wêreldranglyste ken hierdie naam.",
    "admin.player.worldRankingQuestioned":
      "Die wêreldranglyste het geen speler met hierdie naam nie. Dit kan verkeerd gespel wees, of die speler kan nuut op die ranglyste wees.",
    "admin.player.flag": "Vlag",
    "admin.player.add": "Voeg by",
    "admin.player.save": "Bewaar",
    "admin.player.added": "{name} is bygevoeg.",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "Voeg spelers by",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Hulp",
    "admin.players.many": "Spelers",
    "admin.players.line": "Reël {line}: {words}",
    "AddPlayers.FieldsMissing":
      "Skryf die name van die velde op die eerste reël.",
    "AddPlayers.NameMissing": "Die velde moet Name insluit.",
    "AddPlayers.FieldNotAllowed":
      "'n Veld kan Name, Representing, Flag, Handicap of WorldRankingPlayerName wees.",
    "AddPlayers.FieldRepeated": "'n Veld kan net een keer genoem word.",
    "AddPlayers.PlayersMissing": "Skryf 'n speler op elke reël ná die eerste.",
    "AddPlayers.TooManyPlayers":
      "'n Lys kan hoogstens 500 spelers hou. Voeg die res in 'n ander lys by.",
    "AddPlayers.ValuesMismatched":
      "Elke speler het 'n waarde nodig, of niks, vir elke veld wat op die eerste reël genoem word.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Hierdie speler kan nie so behou word nie.",
    "Tournament.PlayerNameTaken":
      "Nog 'n speler in hierdie toernooi het reeds daardie naam.",
    "TournamentPlayer.NoSuchFlag": "Kies een van die vlae wat daar is.",
    "TournamentPlayer.HandicapMalformed":
      "Skryf die handicap as 'n getal. Byvoorbeeld: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "'n Speler kan nie Bye genoem word nie.",
    "TournamentPlayer.NoLetterOrDigit":
      "'n Naam moet 'n letter of syfer bevat.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Byes hoef nie bygevoeg te word nie",
    "admin.player.byes":
      "'n Bye is nie een van die toernooi se spelers nie. 'n Uitskakeling bied Bye aan wanneer sy spelers bygevoeg word, so dikwels as wat sy trekking dit nodig het.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "Spanne",
    "admin.view.tests": "Toetse",
    "admin.teams.add": "Voeg span by",
    "admin.teams.none": "Geen spanne nie",
    "admin.teams.edit": "Wysig",
    "admin.teams.view": "Bekyk",
    "admin.teams.archive": "Argiveer",
    "admin.teams.restore": "Herstel",
    "admin.teams.up": "Op",
    "admin.teams.down": "Af",
    "admin.teams.archived": "Geargiveerde spanne",
    "admin.teams.archivedSaid": "Geargiveer",
    "admin.team.addTitle": "Voeg span by",
    "admin.team.editTitle": "Wysig span",
    "admin.team.name": "Naam",
    "admin.team.shortName": "Kortnaam",
    "admin.team.shortName.explanation":
      "Waarmee die span se toetse genoem word, soos AUS v ENG.",
    "admin.team.flag": "Vlag",
    "admin.team.add": "Voeg by",
    "admin.team.save": "Bewaar",
    "admin.team.added": "{name} is bygevoeg.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "Hierdie span kan nie so behou word nie.",
    "admin.teamView.otherwise":
      "Hierdie span kan nie van hier af gesien word nie.",
    "admin.teamView.players": "Spelers",
    "TeamName.Missing": "Sê wat die span heet.",
    "TeamName.TooLong": "Daardie naam is te lank.",
    "admin.notes.add": "Voeg nota by",
    "admin.notes.none": "Geen notas nie",
    "admin.notes.edit": "Wysig",
    "admin.notes.delete": "Skrap",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Skrap nota",
    "admin.notes.deleteQuestion": "Skrap die nota “{title}”?",
    "admin.notes.delete.explanation":
      "'n Nota wat geskrap is, is vir goed weg en kan nie teruggebring word nie.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "Dit kon nie gedoen word nie.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "Voeg nota by",
    "admin.note.editTitle": "Wysig nota",
    "admin.note.title": "Titel",
    "admin.note.description": "Beskrywing",
    "admin.note.write": "Skryf",
    "admin.note.preview": "Voorskou",
    "admin.note.toolbar": "Formatering",
    "admin.note.tool.heading": "Opskrif",
    "admin.note.tool.bold": "Vet",
    "admin.note.tool.italic": "Kursief",
    "admin.note.tool.quote": "Aanhaling",
    "admin.note.tool.code": "Kode",
    "admin.note.tool.link": "Skakel",
    "admin.note.tool.numberedList": "Genommerde lys",
    "admin.note.tool.bulletedList": "Lys met kolpunte",
    "admin.note.tool.taskList": "Taaklys",
    "admin.note.add": "Voeg by",
    "admin.note.save": "Bewaar",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "Hierdie nota kan nie so behou word nie.",
    "ManagerNoteTitle.Missing": "Gee die nota 'n titel.",
    "ManagerNoteTitle.TooLong": "Daardie titel is te lank.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "'n Titel moet 'n letter of syfer bevat.",
    "ManagerNoteDescription.TooLong": "Daardie beskrywing is te lank.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander bestuurder het dit dalk geskrap.",
    "EditManagerNote.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander bestuurder het dit dalk geskrap.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander bestuurder het dit dalk geskrap.",
    "ManagerNote.Deleted":
      "Daardie nota is geskrap. 'n Ander bestuurder het dit dalk geskrap.",
    "CommentaryTitle.Missing": "Gee die kommentaar 'n titel.",
    "CommentaryTitle.TooLong": "Daardie titel is te lank.",
    "CommentaryTitle.NoLetterOrDigit":
      "'n Titel moet 'n letter of syfer bevat.",
    "Commentary.TitleTaken": "Nog 'n kommentaar het reeds daardie titel.",
    "CommentText.Missing": "Skryf iets in die opmerking.",
    "CommentText.TooLong": "Daardie opmerking is te lank.",
    "TeamShortName.Missing": "Gee die span 'n kortnaam.",
    "TeamShortName.TooLong":
      "'n Kortnaam mag hoogstens 10 karakters lank wees.",
    "TeamShortName.NoLetterOrDigit":
      "'n Kortnaam moet 'n letter of syfer bevat.",
    "Team.ShortNameLongerThanName":
      "'n Kortnaam mag nie langer wees as die span se naam nie.",
    "Team.NoSuchFlag": "Kies een van die vlae wat daar is.",
    "Team.Archived": "Daardie span is geargiveer, en word eers herstel.",
    "Team.InATest":
      "Daardie span speel in 'n toets, en kan nie geargiveer word nie.",
    "Team.PlayerNameTaken":
      "Nog 'n speler in hierdie span het reeds daardie naam.",
    "TeamPlayer.NamedBye": "'n Speler kan nie Bye genoem word nie.",
    "TeamPlayer.Archived":
      "Daardie speler is geargiveer, en word eers herstel.",
    "TeamPlayer.HasGames":
      "Daardie speler het gespeel, en kan nie geargiveer word nie.",
    "Tournament.TeamNameTaken":
      "Nog 'n span in hierdie toernooi het reeds daardie naam.",
    "Tournament.TeamShortNameTaken":
      "Nog 'n span in hierdie toernooi het reeds daardie kortnaam.",
    "Tournament.NoSuchTeam":
      "Hierdie toernooi het geen span by hierdie adres nie.",
    "Tournament.TeamArchived":
      "Hierdie span is geargiveer, en kan net vanaf die Spanne-oortjie herstel word.",
    "admin.tests.add": "Voeg toets by",
    "admin.tests.none": "Geen toetse nie",
    "admin.tests.edit": "Wysig",
    "admin.tests.view": "Bekyk",
    "admin.tests.archive": "Argiveer",
    "admin.tests.restore": "Herstel",
    "admin.tests.up": "Op",
    "admin.tests.down": "Af",
    "admin.tests.archived": "Geargiveerde toetse",
    "admin.tests.twoTeamsNeeded":
      "'n Toets is tussen twee spanne, so twee spanne is eers nodig.",
    "admin.tests.toTeams": "Gaan na Spanne",
    "admin.tests.matches.one": "{count} wedstryd",
    "admin.tests.matches.other": "{count} wedstryde",
    "admin.tests.bestOf": "beste van {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "Dit kon nie gedoen word nie.",
    "admin.test.addTitle": "Voeg toets by",
    "admin.test.editTitle": "Wysig toets",
    "admin.test.firstTeam": "Span A",
    "admin.test.secondTeam": "Span B",
    "admin.test.versus": "v",
    "admin.test.starts": "Begin",
    "admin.test.finishes": "Eindig",
    "admin.test.expectedMatches": "Verwagte wedstryde",
    "admin.test.bestOf": "Beste van",
    "admin.test.group": "Groep",
    "admin.test.add": "Voeg by",
    "admin.test.save": "Bewaar",
    "admin.test.added": "{name} is bygevoeg.",
    "admin.test.otherwise": "Hierdie toets kan nie so behou word nie.",
    "admin.testView.otherwise":
      "Hierdie toets kan nie van hier af gesien word nie.",
    "AddTest.FirstTeamMissing": "Kies die eerste span.",
    "AddTest.SecondTeamMissing": "Kies die tweede span.",
    "UpdateTest.FirstTeamMissing": "Kies die eerste span.",
    "UpdateTest.SecondTeamMissing": "Kies die tweede span.",
    "ExpectedMatches.NotWhole": "Voer 'n heelgetal wedstryde in.",
    "ExpectedMatches.TooSmall":
      "'n Toets moet na verwagting minstens 1 wedstryd hê.",
    "TestGroup.TooLong": "Daardie groep is te lank.",
    "Tournament.TestAgainstItself":
      "'n Span speel nie 'n toets teen homself nie.",
    "Tournament.FormatHasNoGroups":
      "'n Toets in hierdie formaat word nie in 'n groep geplaas nie.",
    "Tournament.TestFinishesBeforeStarts":
      "'n Toets kan nie eindig voordat dit begin nie.",
    "Tournament.TestStartsBeforeTournament":
      "'n Toets kan nie begin voordat sy toernooi begin nie.",
    "Tournament.TestFinishesAfterTournament":
      "'n Toets kan nie eindig nadat sy toernooi eindig nie.",
    "Tournament.TestHasGamesInUse":
      "Hierdie toets het spelle, so dit kan nie geargiveer word totdat hulle dit is nie.",
    "Tournament.TestHasGames":
      "Hierdie toets het nou spelle, so sy spanne kan nie meer verander word nie.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Meer wedstryde as dit het reeds begin.",
    "Tournament.BestOfBelowGamesPlayed":
      "Twee spelers het reeds meer spelle as dit gespeel.",
    "Competition.ExpectedMatchesReached":
      "Hierdie toets het reeds soveel wedstryde begin as wat daarvoor verwag word.",
    "Competition.SameTeam":
      "Twee spelers van dieselfde span speel nie teen mekaar nie.",
    "AddManager.NoSuchAccount":
      "Daardie adres het geen rekening wat 'n bestuurder gemaak kan word nie.",
    "admin.scorers.add": "Voeg teller by",
    "admin.scorers.none": "Geen telers nie",
    "admin.scorers.removeTitle": "Verwyder teller",
    "admin.scorers.removeExplanation":
      "{name} sal nie meer hierdie toernooi se uitslae kan invoer nie.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise":
      "Daardie adres kan nie 'n teller gemaak word nie.",
    "AddScorer.NoSuchAccount":
      "Daardie adres het geen rekening wat 'n teller gemaak kan word nie.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Net 'n administrateur kan dit doen.",
    "AddRole.NoSuchAccount":
      "Daardie adres het geen rekening wat die rol kan kry nie.",
    "AddRole.NoSuchRole": "Daar is geen sodanige rol nie.",
    "RemoveRole.NoSuchAccount": "Daar is geen sodanige rekening nie.",
    "RemoveRole.NoSuchRole": "Daar is geen sodanige rol nie.",
    "RemoveRole.Yourself":
      "Jy kan nie die administrateurrol van jouself afneem nie.",
    "AccountsWithRole.NoSuchRole": "Daar is geen sodanige rol nie.",
    "Tournament.AlreadyAManager":
      "Daardie rekening bestuur reeds die toernooi, en kan alles doen wat 'n teller kan.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Sê wat die toernooi heet.",
    "TournamentName.TooShort": "Daardie naam is te kort.",
    "TournamentName.TooLong": "Daardie naam is te lank.",
    "TournamentName.AllLowerCase":
      "'n Naam mag nie heeltemal in kleinletters wees nie.",
    "TournamentName.AllCapitals":
      "'n Naam mag nie heeltemal in hoofletters wees nie.",
    "TournamentName.NoLetterOrDigit": "'n Naam moet 'n letter of syfer bevat.",
    "ReadOnlyDate.Unreadable": "Gee die dag.",
    "Tournament.FinishesBeforeStarts":
      "'n Toernooi kan nie eindig voordat dit begin nie.",
    "Tournament.StartsAfterNextYear":
      "'n Toernooi kan nie na volgende jaar begin nie.",
    "Tournament.FinishesAfterNextYear":
      "'n Toernooi kan nie na volgende jaar eindig nie.",
    "CreateTournament.NoSuchCountry": "Kies die land.",
    "TournamentSubtitle.TooLong":
      "'n Onderskrif mag nie langer as 2000 karakters wees nie.",
    "Tournament.NotAManager":
      "Net 'n bestuurder van hierdie toernooi kan dit verander.",
    "Tournament.NotAManagerOrScorer":
      "Net 'n bestuurder of teller van hierdie toernooi kan dit sien.",
    "Tournament.Archived":
      "Hierdie toernooi is geargiveer, en word herstel voordat dit verander kan word.",
    "UpdateTournament.NoSuchTournament":
      "Daar is geen toernooi by hierdie adres nie.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Amerikaanse 6-hoepel-croquet",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standaard",
    "format.teams": "Spanne",
    "format.eire-cup": "Eire-beker",
    "format.interstate-shield": "Interstaatskild",
    "format.gc-world-team-championship": "GC-wêrelspankampioenskap",
    "country.ad": "Andorra",
    "country.ae": "Verenigde Arabiese Emirate",
    "country.af": "Afghanistan",
    "country.ag": "Antigua en Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanië",
    "country.am": "Armenië",
    "country.ao": "Angola",
    "country.ar": "Argentinië",
    "country.as": "Amerikaanse Samoa",
    "country.at": "Oostenryk",
    "country.au": "Australië",
    "country.aw": "Aruba",
    "country.ax": "Ålandeilande",
    "country.az": "Azerbeidjan",
    "country.ba": "Bosnië en Herzegowina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesj",
    "country.be": "België",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarye",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Broenei",
    "country.bo": "Bolivië",
    "country.br": "Brasilië",
    "country.bs": "Bahamas",
    "country.bt": "Bhoetan",
    "country.bv": "Bouvet-eiland",
    "country.bw": "Botswana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonië",
    "country.cc": "Kokos (Keeling)-eilande",
    "country.cd": "Demokratiese Republiek van die Kongo",
    "country.cf": "Sentraal-Afrikaanse Republiek",
    "country.cg": "Republiek van die Kongo",
    "country.ch": "Switserland",
    "country.ci": "Ivoorkus",
    "country.ck": "Cookeilande",
    "country.cl": "Chili",
    "country.cm": "Kameroen",
    "country.cn": "China",
    "country.co": "Colombië",
    "country.cr": "Costa Rica",
    "country.cu": "Kuba",
    "country.cv": "Kaap Verde",
    "country.cx": "Kerseiland",
    "country.cy": "Siprus",
    "country.cz": "Tsjeggië",
    "country.de": "Duitsland",
    "country.dj": "Djiboeti",
    "country.dk": "Denemarke",
    "country.dm": "Dominica",
    "country.do": "Dominikaanse Republiek",
    "country.dz": "Algerië",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Egipte",
    "country.eh": "Wes-Sahara",
    "country.england": "Engeland",
    "country.er": "Eritrea",
    "country.es": "Spanje",
    "country.et": "Ethiopië",
    "country.fi": "Finland",
    "country.fj": "Fidji",
    "country.fk": "Falklandeilande",
    "country.fm": "Mikronesië",
    "country.fo": "Faroëreilande",
    "country.fr": "Frankryk",
    "country.ga": "Gaboen",
    "country.gb": "Verenigde Koninkryk",
    "country.gd": "Grenada",
    "country.ge": "Georgië",
    "country.gf": "Frans-Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenland",
    "country.gm": "Gambië",
    "country.gn": "Guinee",
    "country.gp": "Guadeloupe",
    "country.gq": "Ekwatoriaal-Guinee",
    "country.gr": "Griekeland",
    "country.gs": "Suid-Georgië en die Suidelike Sandwicheilande",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinee-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard- en McDonaldeilande",
    "country.hn": "Honduras",
    "country.hr": "Kroasië",
    "country.ht": "Haïti",
    "country.hu": "Hongarye",
    "country.id": "Indonesië",
    "country.ie": "Ierland",
    "country.il": "Israel",
    "country.im": "Eiland Man",
    "country.in": "Indië",
    "country.io": "Brits-Indiese Oseaan-gebied",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Ysland",
    "country.it": "Italië",
    "country.je": "Jersey",
    "country.jm": "Jamaika",
    "country.jo": "Jordanië",
    "country.jp": "Japan",
    "country.ke": "Kenia",
    "country.kg": "Kirgistan",
    "country.kh": "Kambodja",
    "country.ki": "Kiribati",
    "country.km": "Comore",
    "country.kn": "Sint Kitts en Nevis",
    "country.kp": "Noord-Korea",
    "country.kr": "Suid-Korea",
    "country.kw": "Koeweit",
    "country.ky": "Kaaimanseilande",
    "country.kz": "Kazakstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Sint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberië",
    "country.ls": "Lesotho",
    "country.lt": "Litaue",
    "country.lu": "Luxemburg",
    "country.lv": "Letland",
    "country.ly": "Libië",
    "country.ma": "Marokko",
    "country.mc": "Monaco",
    "country.md": "Moldowa",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshalleilande",
    "country.mk": "Noord-Macedonië",
    "country.ml": "Mali",
    "country.mm": "Mianmar",
    "country.mn": "Mongolië",
    "country.mo": "Macau",
    "country.mp": "Noord-Mariane-eilande",
    "country.mq": "Martinique",
    "country.mr": "Mauritanië",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maledive",
    "country.mw": "Malawi",
    "country.mx": "Meksiko",
    "country.my": "Maleisië",
    "country.mz": "Mosambiek",
    "country.na": "Namibië",
    "country.nc": "Nieu-Kaledonië",
    "country.ne": "Niger",
    "country.nf": "Norfolkeiland",
    "country.ng": "Nigerië",
    "country.ni": "Nicaragua",
    "country.nl": "Nederland",
    "country.no": "Noorweë",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nieu-Seeland",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Frans-Polinesië",
    "country.pg": "Papoea-Nieu-Guinee",
    "country.ph": "Filippyne",
    "country.pk": "Pakistan",
    "country.pl": "Pole",
    "country.pm": "Sint Pierre en Miquelon",
    "country.pn": "Pitcairneilande",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Katar",
    "country.re": "Réunion",
    "country.ro": "Roemenië",
    "country.rs": "Serwië",
    "country.ru": "Rusland",
    "country.rw": "Rwanda",
    "country.sa": "Saoedi-Arabië",
    "country.sb": "Salomonseilande",
    "country.sc": "Seychelle",
    "country.scotland": "Skotland",
    "country.sd": "Soedan",
    "country.se": "Swede",
    "country.sg": "Singapoer",
    "country.sh": "Sint Helena",
    "country.si": "Slowenië",
    "country.sj": "Svalbard en Jan Mayen",
    "country.sk": "Slowakye",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalië",
    "country.sr": "Suriname",
    "country.st": "São Tomé en Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Sirië",
    "country.sz": "Eswatini",
    "country.tc": "Turks- en Caicoseilande",
    "country.td": "Tsjad",
    "country.tf": "Franse Suidelike Gebiede",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Oos-Timor",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisië",
    "country.to": "Tonga",
    "country.tr": "Turkye",
    "country.tt": "Trinidad en Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzanië",
    "country.ua": "Oekraïne",
    "country.ug": "Uganda",
    "country.um": "Klein ommeliggende eilande van die Verenigde State",
    "country.us": "Verenigde State",
    "country.uy": "Uruguay",
    "country.uz": "Oesbekistan",
    "country.va": "Vatikaanstad",
    "country.vc": "Sint Vincent en die Grenadine",
    "country.ve": "Venezuela",
    "country.vg": "Britse Maagdeneilande",
    "country.vi": "Amerikaanse Maagdeneilande",
    "country.vn": "Viëtnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wallis",
    "country.wf": "Wallis en Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Suid-Afrika",
    "country.zm": "Zambië",
    "country.zw": "Zimbabwe",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. This is the one place a catalogue holds
    // markup, and it holds it because an email is written and translated as a
    // piece of writing rather than as a list of phrases somewhere else puts in
    // order. Only what fills an email in is escaped, so nothing given to one
    // can become markup; the markup here is the site's own. The placeholders
    // are the same as English's: `{link}`, `{site}`, `{buttonBackgroundColour}`,
    // `{buttonTextColour}`, `{emailFromName}` and `{siteName}`.

    "Email.ConfirmAddress.subject": "Bevestig jou e-posadres vir {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hallo,</p>

<p>
    Dankie dat jy 'n rekening by <strong>{siteName}</strong> geskep het.<br />
    Voordat jy jou rekening kan begin gebruik, bevestig asseblief jou e-posadres
    deur op die knoppie hieronder te klik:
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
        Bevestig my e-posadres
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou e-posadres ook bevestig deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    As jy nie hierdie rekening geskep het nie, kan jy hierdie e-pos veilig ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "'n Nuwe skakel om jou e-posadres vir {siteName} te bevestig",
    "Email.ConfirmAddressAgain.body": `
<p>Hallo,</p>

<p>
    Jy het onlangs 'n nuwe e-pos gevra om jou e-posadres vir <strong>{siteName}</strong> te bevestig.<br />
    Bevestig asseblief jou e-posadres deur op die knoppie hieronder te klik:
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
        Bevestig my e-posadres
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou e-posadres ook bevestig deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sodra dit bevestig is, sal jy jou rekening sonder onderbreking kan bly gebruik.
</p>

<p>
    As jy nie hierdie e-pos gevra het nie, kan jy dit veilig ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Iemand het probeer registreer met jou e-posadres",
    "Email.AlreadyRegistered.body": `
<p>Hallo,</p>

<p>
    Iemand het probeer om by <strong>{siteName}</strong> te registreer met hierdie
    e-posadres, wat reeds 'n rekening het. Niks aan jou rekening het
    verander nie.<br />
    As dit jy was, het jy reeds 'n rekening, en kan jy daarby inteken:
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
        Teken in
    </a>
</p>

<p>
    As jy jou wagwoord vergeet het, kan jy dit hier terugstel:
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
        Wagwoord vergeet
    </a>
</p>

<p>
    As dit nie jy was nie, hoef jy niks te doen nie. Niemand het toegang tot
    jou rekening gekry nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bevestig die skuif van jou {siteName}-rekening na hierdie adres",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hallo,</p>

<p>
    Iemand wat by 'n <strong>{siteName}</strong>-rekening aangeteken is, het gevra om dit
    na hierdie e-posadres te skuif. As dit jy was, bevestig dit hier, aangeteken
    by daardie rekening. Die skakel werk 24 uur lank.
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
        Skuif my rekening
    </a>
</p>

<p>
    Of kopieer hierdie adres na jou blaaier:<br />
    {link}
</p>

<p>
    As dit nie jy was nie, hoef jy niks te doen nie. Geen rekening sal soontoe skuif nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Iemand het gevra om 'n rekening na jou e-posadres te skuif",
    "Email.AlreadyHasAnAccount.body": `
<p>Hallo,</p>

<p>
    Iemand wat by 'n <strong>{siteName}</strong>-rekening aangeteken is, het gevra om dit
    na hierdie e-posadres te skuif, wat reeds 'n eie rekening het. Niks het
    geskuif nie, en niks aan jou rekening het verander nie.
</p>

<p>
    As dit jy was, het jy reeds 'n rekening by hierdie adres, en kan jy daarby
    inteken.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Jou {siteName}-rekening het geskuif",
    "Email.EmailAddressChanged.body": `
<p>Hallo,</p>

<p>
    Jou <strong>{siteName}</strong>-rekening is pas na 'n ander e-posadres
    geskuif, {emailAddress}, en teken van nou af met daardie adres in.
</p>

<p>
    As dit nie jy was nie, het iemand anders jou rekening. Antwoord op hierdie e-pos
    en laat ons weet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Jou {siteName}-wagwoord is verander",
    "Email.PasswordChanged.body": `
<p>Hallo,</p>

<p>
    Die wagwoord vir jou <strong>{siteName}</strong>-rekening is pas
    verander, en elke ander blaaier wat daarby aangeteken was, is afgeteken.<br />
    As dit jy was, hoef jy niks te doen nie.
</p>

<p>
    As dit nie jy was nie, het iemand anders jou wagwoord. Stel hier 'n nuwe een, en
    hulle sal afgeteken word:
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
        Wagwoord vergeet
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Stel 'n nuwe wagwoord vir {siteName}",
    "Email.SetNewPassword.body": `
<p>Hallo,</p>

<p>
    Jy het onlangs gevra om jou wagwoord vir <strong>{siteName}</strong> terug te stel.<br />
    Jy kan jou wagwoord terugstel deur op die knoppie hieronder te klik:
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
        Stel wagwoord terug
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou wagwoord ook terugstel deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    As jy nie gevra het dat jou wagwoord teruggestel word nie, kan jy hierdie e-pos veilig ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Stel 'n wagwoord vir {siteName}",
    "Email.SetPassword.body": `
<p>Hallo,</p>

<p>
    Jou <strong>{siteName}</strong>-rekening het geen wagwoord nie: jy teken in met Google.<br />
    Jy het gevra om een te stel, sodat jy ook met jou e-posadres en 'n wagwoord kan inteken.
    Jy kan dit stel deur op die knoppie hieronder te klik:
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
        Stel wagwoord
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou wagwoord ook stel deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Die skakel werk 'n uur lank. As jy nie gevra het om 'n wagwoord te stel nie, kan jy hierdie e-pos veilig ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Daar is geen {siteName}-rekening vir hierdie e-posadres nie",
    "Email.RegisterInstead.body": `
<p>Hallo,</p>

<p>
    Daar is gevra om die wagwoord terug te stel vir 'n e-posadres wat nie
    met 'n rekening op <strong>{siteName}</strong> verbind is nie.
</p>

<p>
    As jy ons diens wil gebruik, kan jy 'n nuwe rekening skep by:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    As jy nie hierdie versoek gedoen het nie, kan jy hierdie e-pos veilig ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bevestig dat jou {siteName}-rekening vergeet moet word",
    "Email.ConfirmForgetting.body": `
<p>Hallo,</p>

<p>
    Jy het gevra dat jou <strong>{siteName}</strong>-rekening
    vergeet word.<br />
    Volg die knoppie hieronder om te sien wat dit beteken, en om met sekerheid
    te sê dat jy dit wil hê:
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
        Vergeet my rekening
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy ook hierdie skakel in jou blaaier oopmaak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sodra dit vergeet is, kan jou naam en e-posadres nooit weer deur
    iemand gelees word nie, en kan jy nie meer by jou rekening aanteken nie. Dit kan nie ongedaan gemaak word nie.
</p>

<p>
    Die skakel werk een keer, tot 15 minute nadat jy daarvoor gevra het, en net
    terwyl jy by hierdie rekening aangeteken is. Daarna moet jy weer vanuit jou
    rekening vra.
</p>

<p>
    As jy nie gevra het nie, sal niks gebeur tensy die skakel gevolg word nie.
    Iemand wat by jou rekening aangeteken is, het egter gevra, so stel 'n nuwe wagwoord
    vanaf die bladsy vir vergete wagwoorde om seker te maak dat hulle nie weer kan inteken nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registrasie is opgeskort: {service} kan nie bereik word nie",
    "Email.RegistrationsSuspended.body": `
<p>Hallo,</p>

<p>
    {siteName} kon {service} nie om {when} bereik nie. Totdat dit antwoord,
    word lesers wat dit nodig het, om te registreer of 'n nuwe wagwoord te stel, gesê om
    later weer te probeer.
</p>

<p>
    Niks hoef opgehef te word nie. Elke poging vra {service} opnuut, en die bladsye
    werk weer sodra dit antwoord.
</p>

<p>
    Solank {service} af bly, sal jy hoogstens een keer per uur
    hieroor ge-e-pos word.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} kan nie sy databasis bereik nie",
    "Email.DatabaseUnreachable.body": `
<p>Hallo,</p>

<p>
    {siteName} kon nie om {when} sy databasis bereik nie. Totdat dit antwoord, sê elke bladsy wat dit nodig het vir lesers dat die webwerf nie beskikbaar is nie en dat hulle later weer moet probeer.
</p>

<p>
    Niks hoef opgehef te word nie. Elke versoek vra opnuut vir 'n verbinding, en die webwerf werk weer sodra die databasis antwoord.
</p>

<p>
    Solank die databasis af bly, sal jy hoogstens een keer elke {minutes} minute hieroor ge-e-pos word.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} het op 'n versoek misluk",
    "Email.UnhandledError.body": `
<p>Hallo,</p>

<p>
    {siteName} het om {when} misluk op 'n versoek vir {asked}. Die leser is die verwysing {reference} gewys, en die logboek het die oorsaak daaronder.
</p>

<p>
    'n Webwerf wat stukkend is, misluk gewoonlik op elke versoek, so jy sal hoogstens 4 keer in 'n uur oor mislukkings ge-e-pos word. Die wat daarna kom, is steeds in die logboek.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
