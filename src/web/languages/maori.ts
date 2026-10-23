// The site's words in Te Reo Māori, written fresh against english.ts.
// The reader is addressed as "koe" (singular), plainly, with "tō" and "ōu" for
// what is theirs. Buttons, menu items and headings are in sentence case, as
// Māori does not capitalise each word. Terms settled on: "wāhitau īmēra" for
// email address, "kupuhipa" for password, "pūkete" for account, "whakataetae"
// for tournament, "tauwhāinga" for competition, "kēmu" for game, "kaitākaro"
// for player, "tākohu" for score, "hupa" for hoop. "Bye" stays English where
// the site checks for it. Sport and some format names have no usual Māori
// name, so they stay as the loan names.
import type { Language } from "../common/language.js";

export const maori: Language = {
  tag: "mi",
  name: "Te Reo Māori",
  words: {
    // The site's own bars.
    "site.skipToContent": "Peke ki te ihirangi",
    "navigation.menu": "Tahua",
    "navigation.label": "Matua",
    "navigation.home": "Kāinga",
    "navigation.help": "Āwhina",
    "navigation.admin": "Kaiwhakahaere",
    "sections.label": "Wāhanga",
    "theme.label": "Kaupapa tae",
    "theme.light": "Marama",
    "theme.dark": "Pōuri",
    "theme.system": "Pūnaha",
    "footer.donate": "Koha",
    "footer.plea":
      "Kei te pai ki a koe {siteName}? Tēnā koa, koha mai hei tautoko i te whanaketanga.",
    "footer.copyright": "© Manatārua {years}, {owner}",
    "footer.privacy": "Tūmataiti",
    "footer.termsOfUse": "Ngā kupu whakamahi",
    "beta.banner":
      "He pae beta tēnei. Ka taea te tautuhi anō i ngā raraunga i ngā wā katoa.",
    "privacy.contact":
      "He pātai mō tēnei whārangi, mō ngā mōhiohio e puritia ana mōu rānei: {emailAddress}",
    "termsOfUse.agree": "Whakaae ana ahau ki ngā kupu whakamahi",
    "termsOfUse.link": "kupu whakamahi",
    "termsOfUse.report":
      "Whakamōhio mai i te mea i tuhia, pātai mai rānei mō ēnei kupu: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Tohua te pouaka hei whakaae ki ngā kupu whakamahi.",
    "tryWebsite.banner":
      "He wāhi haumaru tēnei hei ako i a {siteName}. Ka taea te tango i ngā mea katoa ka tāurua ki konei i ngā wā katoa.",

    "language.label": "Reo",
    "language.choose": "Huri",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "He mea hou hei pānui.",
    "whatsNew.admin.message":
      "He mea hou mā te hunga e whakahaere ana i ngā whakataetae.",
    "whatsNew.view": "Tirohia ngā mea hou",
    "whatsNew.later": "Whakamahara mai a muri ake",
    "whatsNew.never": "Kaua e whakaatu anō i tēnei whakatūpato",

    "form.otherwise":
      "He hē tētahi mea i konei. Tirohia ngā mea i tāurua, ka whakamātau anō.",

    // The account menu in the header.
    "account.menu": "Pūkete",
    "account.register": "Rēhita",
    "account.signIn": "Takiuru",
    "account.forgotPassword": "Kua warewaretia te kupuhipa",
    "account.signOut": "Takiputa",
    "account.profile": "Kōtaha",
    "account.changePassword": "Whakarerekē kupuhipa",
    "account.changeEmailAddress": "Whakarerekē wāhitau īmēra",
    "account.changeName": "Whakarerekē ingoa",
    "account.setPassword": "Tautuhi kupuhipa",
    "account.forgetAccount": "Warewaretia te pūkete",

    "register.title": "Rēhita",
    "register.emailAddress": "Wāhitau īmēra",
    "register.submit": "Rēhita",
    "register.withGoogle": "Rēhita mā Google",
    "register.or": "rānei",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Kāore a Google i whakaū ko tōu tēnei wāhitau īmēra, nā reira e kore e taea te whakamahi ki konei mā Google. Whakamahia tō wāhitau īmēra i raro nei.",
    "SignInWithGoogle.LinkedToAnother":
      "Kei te whai pūkete kē taua wāhitau īmēra, he mea hono ki tētahi atu pūkete Google. Takiuru mā taua pūkete Google, mā tō wāhitau īmēra me tō kupuhipa rānei.",
    "SignInWithGoogle.NameMissing":
      "Kīhai a Google i whāki mai i tō ingoa, ā, me whai ingoa te pūkete. Whakamahia tō wāhitau īmēra i raro nei.",
    "Google.Unreachable":
      "Kāore i taea te whakapā atu ki a Google i tēnei wā. Whakamātauria anō i roto i ētahi meneti, whakamahia rānei tō wāhitau īmēra i raro nei.",
    "Registration.NotAPerson":
      "Kāore i te rite ki te mea nō tētahi tangata tēnei. Whakamātauria anō, ā, mehemea ka tūpono tonu, tatari ētahi meneti ka hoki mai.",

    // A rule the address can break.
    "EmailAddress.Missing": "Tāurua he wāhitau īmēra.",
    "EmailAddress.NoAt": "He @ kei roto i te wāhitau īmēra.",
    "EmailAddress.MoreThanOneAt":
      "Kotahi anake te @ kei roto i te wāhitau īmēra.",
    "EmailAddress.NoDomain":
      "He rohe kei muri i te @ i te wāhitau īmēra, pēnei i example.com.",

    "welcome.title": "Tirohia tō īmēra",
    "welcome.checkEmail":
      "Kei te haere mai he īmēra ki te wāhitau i hoatu e koe. Whāia te hono kei roto hei haere tonu.",
    "welcome.nothingArrived":
      "Mehemea kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki paraurehe, spam rānei.",
    "welcome.home": "Hoki ki {siteName}",
    "newConfirmationLink.title": "Tiki hono hou",
    "newConfirmationLink.explanation":
      "Kua pau te wā o te hono hei whakaū i tō wāhitau īmēra. Tonoa he mea hou, ā, ka tukuna ki te wāhitau i rēhitatia ai koe.",
    "newConfirmationLink.send": "Tukua mai he hono hou",
    "newConfirmationLink.home": "Hoki ki {siteName}",
    "newConfirmationLink.signIn": "Takiuru",
    "newConfirmationLink.sent.title": "Tirohia tō īmēra",
    "newConfirmationLink.sent.explanation":
      "Kei te haere mai he hono hou. Whāia hei whakaū i tō wāhitau īmēra. Mehemea kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki paraurehe, spam rānei.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Kua whakaūngia kētia taua wāhitau īmēra",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Kāore he mea anō hei whakaū. Takiuru mā te kupuhipa i hoatu e koe i tō whakaūnga.",
    "newConfirmationLink.noLongerWorks.title": "Kua kore taua hono e mahi",
    "newConfirmationLink.noLongerWorks.explanation":
      "Tirohia kua whāia e koe te hono katoa i te īmēra, kāore he wāhanga i ngaro i tōna pito. Mehemea kāore anō kia mahi, rēhita anō ka tukuna he hono hou.",
    "newConfirmationLink.tooMany.title": "Whakamātau anō a muri ake",
    "newConfirmationLink.tooMany.explanation":
      "He maha ngā hono kua tukuna ki tēnei wāhitau i ēnei rā tata nei. Tatari kia kotahi hāora, ka tono anō, ā, i tēnei wā tirohia tō kōpaki paraurehe, spam rānei.",

    "forgotPassword.title": "Kua wareware i a koe tō kupuhipa?",
    "forgotPassword.emailAddress": "Wāhitau īmēra",
    "forgotPassword.submit": "Tukua mai he huarahi hoki atu",
    "forgotPassword.home": "Hoki ki {siteName}",
    "forgotPassword.sent.title": "Tirohia tō īmēra",
    "forgotPassword.sent.explanation":
      "Mehemea he pūkete tō taua wāhitau, kei te haere mai he hono hei tautuhi i tētahi kupuhipa hou. Whāia i roto i te hāora. Mehemea kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki paraurehe, spam rānei.",
    "forgotPassword.tryAgainLater":
      "He maha rawa ngā tono huarahi hoki atu i tukuna mai i konei i ēnei rā tata nei. Tatari kia kotahi hāora ka whakamātau anō.",

    "setNewPassword.title": "Tautuhia he kupuhipa hou",
    "setNewPassword.password": "Kupuhipa",
    "setNewPassword.confirmPassword": "Whakaūngia te kupuhipa",
    "setNewPassword.submit": "Tautuhia taku kupuhipa hou",
    "setNewPassword.home": "Hoki ki {siteName}",
    "setNewPassword.signIn": "Takiuru",
    "setNewPassword.askAgain": "Tono mai i tētahi hono hou",
    "setNewPassword.changed.title": "Kua whakarerekētia tō kupuhipa",
    "setNewPassword.changed.explanation":
      "Kua takiputa koe i ngā wāhi katoa i takiuru ai koe. Takiuru mā tō kupuhipa hou.",
    "setNewPassword.expired.title": "Kua pau te wā o taua hono",
    "setNewPassword.expired.explanation":
      "Kotahi hāora te roa e mahi ai te hono hei tautuhi kupuhipa hou. Tonoa tētahi atu, ā, ka tukuna ki taua wāhitau tonu.",
    "setNewPassword.noLongerWorks.title": "Kua kore taua hono e mahi",
    "setNewPassword.noLongerWorks.explanation":
      "Tērā kua whakamahia kētia, kua ngaro rānei tētahi wāhanga i tōna pito. Tonoa tētahi atu mehemea e hiahia tonu ana koe.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Kāore e taea te tirotiro i tō kupuhipa i tēnei wā, nā reira kāore anō kia whakarerekētia. Whakamātauria anō i roto i ētahi meneti; ka mahi tonu tō hono kia pau noa tōna wā.",

    "forgetAccount.title": "Warewaretia tō pūkete",
    "forgetAccount.explanation":
      "Ka taea te whakarūnā tūturu i tō ingoa me tō wāhitau īmēra, ā, ka katia tō pūkete. Kia tika ai ko koe tēnei, ka īmēra atu mātou i tētahi hono ki te wāhitau o tō pūkete i te tuatahi, ā, e kore tētahi mea e warewaretia kia whāia ra anō e koe.",
    "forgetAccount.submit": "Īmēra mai i te hono",
    "forgetAccount.sent.title": "Tirohia tō īmēra",
    "forgetAccount.sent.explanation":
      "Kua īmēra atu mātou i tētahi hono ki te wāhitau o tō pūkete. E 15 meneti te roa e mahi ai, ā, mēnā anake kei te takiuru tonu koe ki tēnei pūkete.",
    "forgetAccount.confirm.title": "Warewaretia tūturutia tō pūkete?",
    "forgetAccount.confirm.explanation":
      "Ina warewaretia, e kore e taea anō e tētahi te pānui i tō ingoa me tō wāhitau īmēra, ā, e kore e taea te takiuru ki tō pūkete. Kāore e taea te whakahoki.",
    "forgetAccount.confirm.submit": "Warewaretia taku pūkete",
    "forgetAccount.forgotten.title": "Kua warewaretia tō pūkete",
    "forgetAccount.forgotten.explanation":
      "Kāore e taea anō te pānui i tō ingoa me tō wāhitau īmēra, ā, kua takiputa koe i ngā wāhi katoa i takiuru ai koe.",
    "forgetAccount.noLongerWorks.title": "Kua kore taua hono e mahi",
    "forgetAccount.noLongerWorks.explanation":
      "Tērā kua pau tōna wā, kua whakamahia kētia rānei, mō tētahi pūkete rānei kāore koe e takiuru ana. Tonoa anō mai i tō pūkete mehemea e hiahia tonu ana koe kia warewaretia.",
    "forgetAccount.lastAdministrator.title":
      "Kāore e taea te warewaretia tō pūkete",
    "forgetAccount.lastAdministrator.explanation":
      "Ko koe anake te kaiwhakahaere o tēnei pae. Hoatu te tūranga Kaiwhakahaere ki tētahi atu, ā, ka taea te warewaretia tō pūkete.",
    "forgetAccount.askAgain": "Tono anō",
    "forgetAccount.home": "Hoki ki {siteName}",

    "registrationsSuspended.title": "Kua whakatārewatia te rēhita mō tēnei wā",
    "registrationsSuspended.explanation":
      "Kāore e taea te whakapā atu ki tētahi ratonga e hiahiatia ana e te rēhita i tēnei wā, nā reira e kore e taea e tētahi te rēhita kia whakahoki kōrero mai anō. Kāore he mea i tāurua e koe i puritia.",
    "registrationsSuspended.tryAgainLater":
      "Whakamātauria anō i muri i tētahi wā poto. Kua whakamōhiotia te kaiwhakahaere o te pae.",
    "registrationsSuspended.home": "Hoki ki {siteName}",

    "signIn.title": "Takiuru",
    "signIn.emailAddress": "Wāhitau īmēra",
    "signIn.password": "Kupuhipa",
    "signIn.submit": "Takiuru",
    "signIn.forgotPassword": "Kua warewaretia te kupuhipa?",
    "signIn.register": "Rēhita",
    "signIn.withGoogle": "Takiuru mā Google",
    "signIn.or": "rānei",
    "signIn.tryAgainLater":
      "He maha rawa ngā whakamātau i ēnei rā tata nei. Tatari kia kotahi hāora ka whakamātau anō.",

    // The one answer to a wrong password and to an address nobody registered.
    "SignIn.Failed":
      "He hē te wāhitau īmēra, te kupuhipa rānei. Tēnā koa, whakamātauria anō.",

    "profile.title": "Kōtaha",
    "profile.name": "Ingoa:",
    "profile.emailAddress": "Wāhitau īmēra:",

    "changeName.title": "Whakarerekē ingoa",
    "changeName.name": "Ingoa",
    "changeName.submit": "Whakarerekē ingoa",

    "setPassword.title": "Tautuhia he kupuhipa",
    "setPassword.explanation":
      "Kāore he kupuhipa o tō pūkete: ka takiuru koe mā Google. Hei takiuru mā te kupuhipa hoki, ka īmēra atu mātou i tētahi hono hei tautuhi i tētahi ki {emailAddress}.",
    "setPassword.submit": "Īmēra mai i tētahi hono",
    "setPassword.sent.title": "Tirohia tō īmēra",
    "setPassword.sent.explanation":
      "Kua īmēra atu mātou i tētahi hono hei tautuhi kupuhipa. Kotahi hāora te roa e mahi ai.",
    "setPassword.profile": "Hoki ki tō kōtaha",

    "changePassword.title": "Whakarerekē kupuhipa",
    "changePassword.currentPassword": "Kupuhipa o nāianei",
    "changePassword.password": "Kupuhipa hou",
    "changePassword.passwordConfirmation": "Whakaūngia te kupuhipa",
    "changePassword.forgotPassword": "Kua warewaretia te kupuhipa?",
    "changePassword.submit": "Whakarerekē kupuhipa",
    "ChangePassword.WrongPassword": "Ehara tērā i tō kupuhipa.",

    "changeEmailAddress.title": "Whakarerekē wāhitau īmēra",
    "changeEmailAddress.emailAddress": "Wāhitau īmēra hou",
    "changeEmailAddress.currentPassword": "Kupuhipa o nāianei",
    "changeEmailAddress.submit": "Tukua he hono hei whakaū",
    "changeEmailAddress.sent.title": "Tirohia tō īmēra",
    "changeEmailAddress.sent.explanation":
      "Kua tukuna he hono hei whakaū i te nekeneke ki te wāhitau īmēra hou. Whāia, ka takiuru, hei neke i tō pūkete ki reira.",
    "changeEmailAddress.confirm.title": "Nekehia tō pūkete",
    "changeEmailAddress.confirm.explanation":
      "Ka neke tō pūkete ki {emailAddress}. Ka takiuru koe mā taua wāhitau mai i tēnei wā.",
    "changeEmailAddress.confirm.submit": "Nekehia taku pūkete",
    "changeEmailAddress.noLongerWorks.title": "Kua kore tēnei hono e mahi",
    "changeEmailAddress.noLongerWorks.explanation":
      "Kua pau tōna wā, kua whakamahia kētia, kāore rānei i tukuna mō te pūkete e takiuru nei koe. Tonoa anō mai i tō kōtaha.",
    "changeEmailAddress.taken.title": "Kāore anō tō pūkete kia neke",
    "changeEmailAddress.profile": "Hoki ki tō kōtaha",
    "ChangeEmailAddress.WrongPassword": "Ehara tērā i tō kupuhipa.",
    "ChangeEmailAddress.Unchanged": "Kei tēnei wāhitau kē tō pūkete.",
    "ChangeEmailAddress.Taken":
      "Kei te whai pūkete tōna ake taua wāhitau īmēra i nāianei, nā reira e kore e taea e tōu te neke ki reira.",

    "confirmEmailAddress.title": "Whakaūngia tō wāhitau īmēra",
    "confirmEmailAddress.name": "Ingoa",
    "confirmEmailAddress.password": "Kupuhipa",
    "confirmEmailAddress.confirmPassword": "Whakaūngia te kupuhipa",
    "confirmEmailAddress.submit": "Whakaūngia taku wāhitau īmēra",
    "confirmEmailAddress.signIn": "Takiuru",
    "confirmEmailAddress.home": "Hoki ki {siteName}",
    "confirmEmailAddress.confirmed.title": "Kua whakaūngia tō wāhitau īmēra",
    "confirmEmailAddress.confirmed.explanation":
      "Kua rite tō pūkete. Takiuru mā te wāhitau īmēra me te kupuhipa i hoatu e koe nā tata nei.",
    "confirmEmailAddress.expired.title": "Kua pau te wā o taua hono",
    "confirmEmailAddress.expired.explanation":
      "E 24 hāora te roa e mahi ai te hono hei whakaū i tētahi wāhitau īmēra. Tonoa he mea hou, ā, ka tukuna ki taua wāhitau tonu.",
    "confirmEmailAddress.expired.newLink": "Tukua mai he hono hou",
    "confirmEmailAddress.noLongerWorks.title": "Kua kore taua hono e mahi",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Tirohia kua whāia e koe te hono katoa i te īmēra, kāore he wāhanga i ngaro i tōna pito. Mehemea kāore anō kia mahi, rēhita anō ka tukuna he hono hou.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Kua whakaūngia kētia taua wāhitau īmēra",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Kāore he mea anō hei mahi. Takiuru mā te kupuhipa i hoatu e koe i tō whakaūnga.",

    // A rule broken, keyed by its code.
    "PersonName.Missing": "Tāuruatia he ingoa.",
    "PersonName.TooShort": "Me neke atu i te 3 ngā pūāhua o te ingoa.",
    "PersonName.TooLong": "Kia 254 pūāhua te nuinga rawa o te ingoa.",
    "WorldRankingName.TooShort":
      "Me neke atu i te 3 ngā pūāhua o te ingoa mō te whakarārangi o te ao.",
    "WorldRankingName.TooLong":
      "Kia 254 pūāhua te nuinga rawa o te ingoa mō te whakarārangi o te ao.",
    "Password.Missing": "Tāuruatia he kupuhipa.",
    "Password.TooShort": "Me neke atu i te 12 ngā pūāhua o te kupuhipa.",
    "Password.ConfirmationDiffers":
      "Kāore tēnei i te rite ki te kupuhipa i runga ake nei. Patohia anō.",
    "Password.Breached":
      "Kua puta tēnei kupuhipa i tētahi pakarutanga raraunga iwhea atu, nā reira kāore he haumaru hei whakamahi ki konei. Kōwhiria tētahi atu.",

    "javaScriptRequired.title": "E hiahiatia ana te tuhinga whakahaere",
    "javaScriptRequired.explanation":
      "Me whakahohe te tuhinga whakahaere (JavaScript) mō tēnei pae hei rēhita, kia taea ai te tirotiro he tangata te rēhita ana. Whakahohea, ka rēhita anō.",
    "javaScriptRequired.register": "Hoki ki te rēhita",
    "javaScriptRequired.home": "Hoki ki {siteName}",

    "errors.backHome": "Hoki ki {siteName}",
    "errors.notFound": "Kāore i kitea",
    "errors.refused": "Kāore i taea tērā",
    "errors.refusedDetail": "He hē tētahi mea i roto i te mea i tukuna.",
    "errors.sorry": "Aroha mai",
    "errors.sorryDetail": "Kāore i taea te whakahaere i taua tono.",
    "errors.failed": "I hapa tētahi mea",
    "errors.reference": "Tohutoro {reference}.",
    "errors.recorded":
      "Kua tuhia te hapa, ā, kua tukuna he īmēra ki te kaiwhakahaere. He āwhina mehemea ka īmēra koe ki te kaiwhakahaere me te tohutoro me tētahi whakaahuatanga o tāu e mahi ana.",
    "errors.message": "Īmēra ki te kaiwhakahaere",
    "errors.messageSubject": "Hapa {reference} i {siteName}",
    "errors.messageBody": "Tāku e mahi ana i te wā i puta ai tēnei:\n\n",
    "errors.unavailable": "Kāore te pae e wātea ana",
    "errors.unavailableDetail":
      "Kāore e taea e te pae te whakapā atu ki ngā mea e hiahiatia ana e ia i tēnei wā. Tēnā koa, whakamātauria anō a muri ake.",
    "errors.maintenance": "Kei raro te pae mō te pupuri.",
    "errors.maintenanceMinutes":
      "E tūmanakohia ana ka hoki mai i roto i te {minutes} meneti.",
    "errors.maintenanceMinute":
      "E tūmanakohia ana ka hoki mai i roto i te 1 meneti.",
    "errors.maintenanceLonger":
      "Kei te roa ake i te tūmanako, ā, ka hoki mai a muri tata.",

    // The home page's two lists.
    "home.recentResults": "Ngā hua tata nei",
    "home.recentResults.none":
      "Kāore he kēmu i tāpiritia i roto i ngā rā e whitu kua pahure.",
    "home.upcomingTournaments": "Ngā whakataetae e haere mai ana",
    "home.upcomingTournaments.none":
      "Kāore he whakataetae e tīmata ana i roto i ngā rā e ono tekau e haere mai nei.",
    "home.allTournaments": "Ngā whakataetae katoa i {year}",
    // A year's page.
    "year.heading": "Ngā whakataetae i {year}",
    "year.none": "Kāore he whakataetae e tīmata ana i {year}.",
    // A sport's page in a year.
    "yearSport.heading": "Ngā whakataetae {sport} i {year}",
    "yearSport.none": "Kāore he whakataetae {sport} e tīmata ana i {year}.",
    // A tournament's page.
    "tournament.recent": "Tata nei",
    "tournament.summary": "Whakarāpopototanga",
    // A test's grid.
    "test.bestOf": "Ko ia tukinga te pai rawa o te {count}.",
    "test.vs": "ki",
    "test.matches": "Tukinga",
    "test.games": "Kēmu",
    "test.hoops": "Hupa",
    "teamSummary.tests": "Whakamātau",
    "teamSummary.matches": "Tukinga",
    "teamSummary.games": "Kēmu",
    "teamSummary.hoops": "Hupa",
    "teamSummary.wins": "Wikitoria",
    "teamSummary.losses": "Hinganga",
    "teamSummary.draws": "Taurite",
    "teamSummary.for": "Mō",
    "teamSummary.against": "Whakahē",
    "teamSummary.net": "Kupenga",
    "tournament.players": "Kaitākaro",
    "search.label": "Rapua",
    "search.tournaments": "Whakataetae",
    "search.competitions": "Tauwhāinga",
    "search.nothingFound": "Kāore i kitea he mea.",
    "players.search.label": "Rapua kaitākaro",
    "players.search.prompt":
      "Patohia te ingoa o tētahi kaitākaro hei rapu i a ia.",
    "players.search.none": "Kāore i kitea he kaitākaro.",
    "search.more":
      "Ko te {count} tuatahi anake e whakaatuhia ana. Tāpirihia ake te ingoa hei whakamāmā i te rapu.",
    "websitePlayer.tournament": "Whakataetae",
    // A test in a tournament's sections.
    "tournament.test": "{first} ki {second}",
    "tournament.notes": "Ngā tuhinga",
    "tournament.commentary": "Kōrero whakaahua",
    "tournament.beat": "i hinga i a",
    "tournament.drewWith": "i taurite ki a",
    "tournament.ago.seconds": "{count} hēkona",
    "tournament.ago.minutes": "{count} meneti",
    "tournament.ago.hour": "1 hāora",
    "tournament.ago.hours": "{count} hāora",
    "tournament.none": "Kāore anō kia tākarohia he kēmu.",
    // A tournament's players' page, when it has none.
    "players.none": "Kāore anō kia tāpiritia he kaitākaro.",
    // A tournament's commentaries page.
    "commentaries.by": "nā",
    "commentaries.start": "Tīmata i tētahi kōrero whakaahua hou",
    // The page that starts a commentary.
    "startCommentary.title": "Tīmata i tētahi kōrero whakaahua hou",
    "startCommentary.titleField": "Taitara",
    "startCommentary.submit": "Tīmata i te kōrero whakaahua",
    // "New" is said to a screen reader.
    "marks.new": "hou",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Kāore anō kia tuhia he tuhinga e ngā kaiwhakahaere.",
    "note.edited": "kua whakatikatikaina",
    // A commentary's page.
    "commentary.none": "Kāore anō kia tuhia he kōrero.",
    "commentary.edited": "kua whakatikatikaina",
    "commentary.edit": "Whakatika",
    "commentary.delete": "Mukua",
    "commentary.comment": "Kōrero",
    "commentary.add": "Tāpiri kōrero",
    "commentary.notSent":
      "Kāore i taea te tuku i te kōrero. Uta anō i te whārangi kia kite mēnā i puritia.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Whakarerekē taitara",
    "changeCommentaryTitle.submit": "Penapena",
    // A comment's own page.
    "editComment.title": "Whakatika kōrero",
    "editComment.save": "Penapena",
    "deleteComment.title": "Muku kōrero",
    "deleteComment.question": "Mukua tēnei kōrero? Kāore e taea te whakahoki.",
    "deleteComment.confirm": "Muku kōrero",
    "deleteComment.keep": "Waiho",
    // A player's page.
    "player.games": "Kēmu",
    "player.competitions": "Tauwhāinga",
    "player.beat": "i hinga i a",
    "player.lostTo": "i hinga ki a",
    "player.drewWith": "i taurite ki a",
    "player.score": "{score} ki {opponent}",
    "player.noGames": "Kāore anō kia tākarohia he kēmu.",
    "player.noCompetitions": "Kāore anō kia uru ki tētahi tauwhāinga.",
    // A block's page.
    "block.wins": "Wikitoria",
    "block.matches": "Tukinga",
    "block.netGames": "Kupenga kēmu",
    "block.games": "Kēmu",
    "block.netHoops": "Kupenga hupa",
    "block.won": "wikitoria",
    "block.lost": "hinga",
    "block.drawn": "taurite",
    "block.withdrawn": "kua unu",
    "block.gameWithdrawn": "kua unu",
    "block.losses": "Hinganga",
    // The three views of a block.
    "competition.views": "Ngā tirohanga",
    "competition.view.grid": "Whakatakotoranga",
    "competition.view.summary": "Whakarāpopototanga",
    "competition.view.orderOfPlay": "Raupapa tākaro",
    "blockSummary.ranking":
      "Kua raupapatia mā te wāhanga o ngā tukinga i wikitoria, ka mā ngā hupa kupenga. Tērā pea ka rerekē te whakatakoto i ngā kaitākaro e ngā ture o te whakataetae ake.",
    "orderOfPlay.none": "Kāore anō kia tākarohia he kēmu.",
    // A knockout's rounds.
    "knockout.round.final": "Whakamutunga",
    "knockout.round.semis": "Hawhe-whakamutunga",
    "knockout.round.quarters": "Hauwhā-whakamutunga",
    "knockout.round.number": "Rauna {number}",
    "knockout.bye": "Bye",
    // A Swiss's table.
    "swiss.games": "Kēmu",
    "swiss.wins": "Wikitoria",
    "swiss.winShare": "% wikitoria",
    "swiss.results": "Ngā hua",
    // The arrows that scroll a knockout's grid.
    "knockout.onward": "Ngā rauna o muri",
    "knockout.back": "Ngā rauna o mua",
    // What every list of tournaments shares.
    "tournamentList.column.date": "Rā",
    "tournamentList.column.name": "Ingoa",
    "tournamentList.onlyIn": "Ngā whakataetae i {country} anake",
    "tournamentList.filter.country": "Whenua",
    "tournamentList.filter.anyCountry": "Whenua ahakoa",
    "tournamentList.filter.region": "Rohe",
    "tournamentList.filter.anyRegion": "Rohe ahakoa",
    "tournamentList.filter.noRegionsBefore":
      "Kāore he rohe o ngā whakataetae i mua i Whiringa-ā-rangi 2026.",
    "tournamentList.filter.sport": "Hākinakina",
    "tournamentList.filter.anySport": "Hākinakina ahakoa",
    "tournamentList.filter.submit": "Tātari",
    "years.label": "Ngā tau",
    "years.earlier": "Ngā tau o mua",

    // The admin's words.
    "admin.newerBuild.message": "Kei te wātea he putanga hou o tēnei pae.",
    "admin.newerBuild.reload": "Uta anō",
    "admin.title": "Kaiwhakahaere",
    "admin.tournaments.new": "Whakataetae hou",
    "admin.tournaments.none": "Kāore he whakataetae",
    "admin.tournaments.filter.none": "Kāore he whakataetae e ōrite ana",
    "admin.tournaments.archived": "Kua whakatāpuia",
    "admin.tournaments.manage": "Whakahaere",
    "admin.tournaments.edit": "Whakatika",
    "admin.tournaments.archive": "Whakatāpui",
    "admin.tournaments.restore": "Whakahokia mai",
    "admin.tournaments.scores": "Ngā tākohu",
    "admin.tournaments.players": "Kaitākaro",
    "admin.years.label": "Ngā tau",
    "admin.years.earlier": "Ngā tau o mua",
    "admin.tournament.name": "Ingoa",
    "admin.tournament.starts": "Te tīmatanga",
    "admin.tournament.finishes": "Te mutunga",
    "admin.tournament.format": "Hōputu",
    "admin.tournament.sport": "Hākinakina",
    "admin.tournament.country": "Whenua",
    "admin.tournament.region": "Rohe",
    "admin.tournament.subtitle": "Taitara iti",
    "admin.rules.handicap": "Ka tākarohia me ngā whakaiti",
    "admin.rules.drawsAllowed": "Ka whakaaetia ngā hua taurite",
    "admin.tournament.levelTestsDrawn": "Ka taurite ngā whakamātau ōrite",
    "admin.rules.worldRankings": "Ka kaute ki ngā whakarārangi o te ao",
    "admin.tournament.national": "Takunetanga ā-motu",
    "admin.tournament.international": "Takunetanga ā-ao",
    "admin.tournament.otherwise": "Kāore e taea te whakaae pēnei.",
    "admin.newTournament.title": "Whakataetae hou",
    "admin.newTournament.submit": "Waihanga whakataetae",
    "admin.editTournament.title": "Whakatika whakataetae",
    "admin.editTournament.submit": "Whakahou whakataetae",
    "admin.editTournament.otherwise":
      "Kāore e taea te whakarerekē i tēnei whakataetae.",
    // A tournament's page, and its tabs.
    "admin.view.tabs": "Whakataetae",
    "admin.view.players": "Kaitākaro",
    "admin.view.competitions": "Tauwhāinga",
    "admin.view.managers": "Kaiwhakahaere",
    "admin.view.notes": "Ngā tuhinga",
    "admin.view.scorers": "Kaitākohu",
    "admin.view.rankings": "Whakarārangi",
    "admin.rankings.file":
      "Ka whakamahia ngā hua o te whakataetae e ngā whakarārangi o te ao mā tēnei mahi, ā, kāore he mahi a ngā kaiwhakahaere.",
    "admin.rankings.download": "Tikiake i ngā whakarārangi",
    "rankings.notAvailable": "Kāore e wātea ana ngā whakarārangi",
    "rankings.notAvailable.sport":
      "Kāore he whakarārangi o te ao mō te hākinakina o tēnei whakataetae, nā reira kāore he whakarārangi hei tuku.",
    "rankings.notAvailable.notCounted":
      "Kāore tētahi o ngā tauwhāinga o tēnei whakataetae e kaute ana ki ngā whakarārangi o te ao.",
    "admin.view.otherwise":
      "Kāore e taea te whakahaere i tēnei whakataetae mai i konei.",
    // A competition's page.
    "admin.competitionView.tabs": "Tauwhāinga",
    "admin.competitionView.players": "Kaitākaro",
    "admin.competitionView.scores": "Ngā tākohu",
    "admin.sections.label": "Te whakataetae me ōna tauwhāinga",
    "admin.sections.tournament": "Whakataetae",
    "admin.administrator.sections.label": "Ngā whārangi a te kaiwhakahaere",
    "admin.administrator.sections.tournaments": "Whakataetae",
    "admin.administrator.sections.accounts": "Pūkete",
    "admin.administrator.sections.worldRankings": "Whakarārangi o te ao",
    "admin.administrator.sections.importErrors": "Hapa kawemai",
    "admin.administrator.sections.logs": "Ngā rekoata",
    "admin.administrator.sections.databaseStatus": "Urunga pātengi raraunga",
    "admin.databaseStatus.title": "Urunga pātengi raraunga",
    "admin.databaseStatus.on": "Kua hohe te urunga pātengi raraunga.",
    "admin.databaseStatus.off": "Kua weto te urunga pātengi raraunga.",
    "admin.databaseStatus.expected":
      "E tūmanakohia ana ka hoki mai te pae i roto i te {minutes} meneti.",
    "admin.databaseStatus.expectedOne":
      "E tūmanakohia ana ka hoki mai te pae i roto i te 1 meneti.",
    "admin.databaseStatus.longer": "Kei te roa ake i te tūmanako.",
    "admin.databaseStatus.told": "Ko tā ngā kaipānui i kōrerotia ai: {words}",
    "admin.databaseStatus.toldUsual":
      "Ko te rerenga kōrero tuku iho tā ngā kaipānui i kōrerotia ai.",
    "admin.databaseStatus.minutes": "Ngā meneti e tūmanakohia ana",
    "admin.databaseStatus.words": "Ngā kupu mā ngā kaipānui",
    "admin.databaseStatus.turnOff": "Whakawetohia",
    "admin.databaseStatus.change": "Huri",
    "admin.databaseStatus.turnOn": "Whakahohea",
    "admin.databaseStatus.minutesNeeded": "E hiahiatia ana ngā meneti.",
    "admin.databaseStatus.otherwise": "I hapa tētahi mea i te pae.",
    "DatabaseAccess.MinutesNotWhole": "Me tau tōpū ngā meneti.",
    "DatabaseAccess.MinutesOutOfRange":
      "Me tīmata mai i te 1 ki te 1440 ngā meneti.",
    "DatabaseAccess.WordsTooLong": "Kaua e neke atu i te 500 pūāhua ngā kupu.",
    "DatabaseAccess.NotOff": "Kāore te urunga pātengi raraunga i te weto.",
    "admin.administrator.title": "Kaiwhakahaere",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Pūkete",
    "admin.roles.add": "Tāpiri",
    "admin.roles.administrator.heading": "Ngā kaiwhakahaere",
    "admin.roles.administrator.none": "Kāore he kaiwhakahaere kē atu",
    "admin.roles.administrator.removeTitle": "Tangohia te kaiwhakahaere",
    "admin.roles.administrator.removeExplanation":
      "Kāore a {name} e noho hei kaiwhakahaere o tēnei pae.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Ngā āpiha whakarārangi o te ao mō Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Kāore he āpiha whakarārangi o te ao mō Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Tangohia te āpiha whakarārangi o te ao mō Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "Kāore a {name} e noho hei āpiha whakarārangi o te ao mō Association Croquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Ngā āpiha whakarārangi o te ao mō Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Kāore he āpiha whakarārangi o te ao mō Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Tangohia te āpiha whakarārangi o te ao mō Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "Kāore a {name} e noho hei āpiha whakarārangi o te ao mō Golf Croquet.",
    // The page where the world ranking players are imported.
    "admin.worldRankings.title": "Kawemai i ngā kaitākaro whakarārangi o te ao",
    "admin.worldRankings.import": "Kawemai",
    "admin.worldRankings.log": "Te haere o te kawemai",
    "admin.worldRankings.ac.reading":
      "E pānui ana i te rārangi association croquet",
    "admin.worldRankings.ac.read":
      "Ngā kaitākaro association croquet kua pānuitia: {players}",
    "admin.worldRankings.ac.kept":
      "Ngā kaitākaro association croquet kua puritia: {players}",
    "admin.worldRankings.ac.refused":
      "Kāore i taea te pānui i te rārangi association croquet, nā reira i waihotia ōna kaitākaro pēnei i tō rātou ahua.",
    "admin.worldRankings.gc.reading": "E pānui ana i te rārangi golf croquet",
    "admin.worldRankings.gc.read":
      "Ngā kaitākaro golf croquet kua pānuitia: {players}",
    "admin.worldRankings.gc.kept":
      "Ngā kaitākaro golf croquet kua puritia: {players}",
    "admin.worldRankings.gc.refused":
      "Kāore i taea te pānui i te rārangi golf croquet, nā reira i waihotia ōna kaitākaro pēnei i tō rātou ahua.",
    "admin.worldRankings.finished": "Kua oti",
    "admin.worldRankings.failed": "Kāore i oti te kawemai.",
    "admin.worldRankings.otherwise": "I hapa tētahi mea i te pae.",
    "WorldRankingLists.Unreachable":
      "Kāore i taea te whakapā atu ki te pae o ngā whakarārangi o te ao.",
    "WorldRankingLists.Unreadable":
      "Kāore te rārangi i te whakatakoto pēnei i tā ngā whakarārangi o te ao: kāore i taea te pānui i tētahi rārangi i roto, kāore he tangata i roto, kāore rānei i tuhia ki te UTF-8.",
    // The documents the import from the old sites refused.
    "admin.importErrors.title": "Hapa kawemai",
    "admin.importErrors.none": "Kāore he hapa kawemai",
    "admin.importErrors.otherwise": "I hapa tētahi mea i te pae.",
    "admin.logs.title": "Ngā rekoata",
    "admin.logs.severity": "Taumahatanga",
    "admin.logs.text": "Rapua",
    "admin.logs.show": "Whakaatu",
    "admin.logs.prune": "Tapahia",
    "admin.logs.pruneAsk":
      "Tangohia te rekoata o mua i te hāora kua pahure? Kāore he mea e whakahoki mai.",
    "admin.logs.removed": "{count} ngā urunga i tangohia",
    "admin.logs.none": "Kāore he urunga rekoata",
    "admin.logs.otherwise": "I hapa tētahi mea i te pae.",
    "admin.hover.logs.show": "Whakaatu i ngā urunga e ōrite ana",
    "admin.hover.logs.prune": "Tangohia te rekoata o mua i te hāora kua pahure",
    "admin.hover.logs.pruneAgree":
      "Tangohia te rekoata o mua i te hāora kua pahure",
    "admin.importError.title": "Hapa kawemai",
    "admin.importError.documentId": "Tuakiri tuhinga",
    "admin.importError.tournament": "Whakataetae",
    "admin.importError.competition": "Tauwhāinga",
    "admin.importError.newSite": "Pae hou",
    "admin.importError.oldSite": "Pae tawhito",
    "ImportErrorKept.NotFound":
      "Kāore he hapa i puritia e te kawemai mō taua tuhinga.",
    "admin.competitionView.otherwise":
      "Kāore e taea te whakahaere i tēnei tauwhāinga mai i konei.",
    // The Competitions tab.
    "admin.competitions.block": "Poraka",
    "admin.competitions.knockout": "Whakaweto",
    "admin.competitions.swiss": "Swiss",
    "admin.competitions.view": "Tirohia",
    "admin.competitions.edit": "Whakatika",
    "admin.competitions.up": "Whakarunga",
    "admin.competitions.down": "Whakararo",
    "admin.competitions.archive": "Whakatāpui",
    "admin.competitions.restore": "Whakahokia mai",
    "admin.competitions.archived": "Ngā tauwhāinga kua whakatāpuia",
    "admin.competitions.none": "Kāore he tauwhāinga",
    "admin.competitions.add": "Tāpiri tauwhāinga",
    // The competition dialog.
    "admin.competition.addTitle": "Tāpiri tauwhāinga",
    "admin.competition.editTitle": "Whakatika tauwhāinga",
    "admin.competition.name": "Ingoa",
    "admin.competition.kind": "Momo",
    "admin.competition.bestOf": "Pai rawa o te",
    "admin.competition.rounds": "Ngā rauna",
    "admin.competition.places": "Ngā tūnga",
    "admin.competition.round": "Rauna {number}",
    "admin.competition.bestOfs": "Ngā pai rawa o te",
    "admin.competition.quarters": "Hauwhā-whakamutunga",
    "admin.competition.semis": "Hawhe-whakamutunga",
    "admin.competition.final": "Whakamutunga",
    "admin.competition.add": "Tāpiri",
    "admin.competition.save": "Penapena",
    "admin.competition.added": "Kua tāpiritia a {name}.",
    "admin.competition.otherwise":
      "Kāore e taea te pupuri i tēnei tauwhāinga pēnei.",
    "CompetitionName.Missing": "Tāuruatia he ingoa.",
    "CompetitionName.TooLong": "Kia 254 pūāhua te nuinga rawa o te ingoa.",
    "CompetitionName.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te ingoa.",
    "Tournament.KnockoutPlayerHasGames":
      "He kēmu ā ngā kaitākaro o tēnei tuhi, nā reira e kore e taea te whakarerekē i ōna tūnga.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Kāore e taea te whakaiti i te pai rawa o te rauna kua whakatauhia tētahi tukinga.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Kāore e taea te whakarerekē i tētahi rauna ina kua tākarohia he kēmu i tētahi rauna o muri.",
    "Tournament.CompetitionNameTaken":
      "Kei tētahi atu tauwhāinga o tēnei whakataetae kua whai i taua ingoa.",
    "BestOf.NotWhole": "Tāuruatia he tau tōpū o ngā kēmu.",
    "BestOf.TooSmall": "Me pai rawa o te 1 kēmu ia tukinga i te iti rawa.",
    "Rounds.NotWhole": "Tāuruatia he tau tōpū o ngā rauna.",
    "Rounds.TooSmall": "Me tākaro te poraka i te 1 rauna i te iti rawa.",
    "KnockoutDraw.EvenBestOf":
      "Me whai toa te tukinga o te whakaweto, nā reira me pai rawa o te tau kehe o ngā kēmu.",
    // Every modal dialog's way out.
    "admin.hover.tournaments.new": "Waihanga i tētahi whakataetae hou",
    "admin.hover.tournaments.manage":
      "Whakahaere i ngā kaitākaro, ngā tīma, ngā tauwhāinga me ngā tākohu o tēnei whakataetae",
    "admin.hover.tournaments.edit":
      "Whakarerekē i ngā taipitopito o tēnei whakataetae",
    "admin.hover.tournaments.scores": "Tāuru i ngā tākohu o tēnei whakataetae",
    "admin.hover.tournaments.players":
      "Tiaki i ngā kaitākaro o tēnei whakataetae",
    "admin.hover.competitions.view":
      "Huakina tēnei tauwhāinga hei kite me te tāuru i ōna kaitākaro me ōna tākohu",
    "admin.hover.tests.view":
      "Huakina tēnei whakamātau hei kite me te tāuru i ōna tākohu",
    "admin.hover.teams.view":
      "Huakina tēnei tīma hei kite me te whakahaere i ōna kaitākaro",
    "admin.hover.dialog.player.add":
      "Tāpiri i tēnei kaitākaro ki te whakataetae",
    "admin.hover.dialog.player.save": "Pupuri i ngā huringa ki tēnei kaitākaro",
    "admin.hover.dialog.team.add": "Tāpiri i tēnei tīma ki te whakataetae",
    "admin.hover.dialog.team.save": "Pupuri i ngā huringa ki tēnei tīma",
    "admin.hover.dialog.test.add":
      "Tāpiri i tēnei whakamātau ki te whakataetae",
    "admin.hover.dialog.test.save": "Pupuri i ngā huringa ki tēnei whakamātau",
    "admin.hover.dialog.competition.add":
      "Tāpiri i tēnei tauwhāinga ki te whakataetae",
    "admin.hover.dialog.competition.save":
      "Pupuri i ngā huringa ki tēnei tauwhāinga",
    "admin.hover.dialog.score.add": "Tāpiri i tēnei tākohu ki te tauwhāinga",
    "admin.hover.dialog.score.save":
      "Pupuri i te whakatikatika ki tēnei tākohu",
    "admin.hover.dialog.carryForward.save":
      "Kawea whakamua ngā hua o tēnei kaitākaro",
    "admin.hover.dialog.tournament.new": "Waihanga i tēnei whakataetae",
    "admin.hover.dialog.tournament.edit":
      "Pupuri i ngā huringa ki tēnei whakataetae",
    "admin.hover.modal.cancel": "Katia tēnei me te kore pupuri i tētahi mea",
    "admin.hover.modal.ok": "Katia tēnei karere",
    "admin.hover.tab": "Whakaatu i te ripa {name}",
    "admin.hover.tournaments.archive":
      "Whakatāpui i tēnei whakataetae; ka taea te whakahoki mai",
    "admin.hover.tournaments.restore":
      "Whakahoki mai i tēnei whakataetae kua whakatāpuia",
    "admin.hover.players.add": "Tāpiri i tētahi kaitākaro ki tēnei whakataetae",
    "admin.hover.players.edit":
      "Whakarerekē i ngā taipitopito o tēnei kaitākaro",
    "admin.hover.players.up": "Nekehia tēnei kaitākaro ki runga i te rārangi",
    "admin.hover.players.down": "Nekehia tēnei kaitākaro ki raro i te rārangi",
    "admin.hover.players.archive":
      "Whakatāpui i tēnei kaitākaro; ka taea te whakahoki mai",
    "admin.hover.players.restore":
      "Whakahoki mai i tēnei kaitākaro kua whakatāpuia",
    "admin.hover.teams.add": "Tāpiri i tētahi tīma ki tēnei whakataetae",
    "admin.hover.teams.edit": "Whakarerekē i ngā taipitopito o tēnei tīma",
    "admin.hover.teams.up": "Nekehia tēnei tīma ki runga i te rārangi",
    "admin.hover.teams.down": "Nekehia tēnei tīma ki raro i te rārangi",
    "admin.hover.teams.archive":
      "Whakatāpui i tēnei tīma; ka taea te whakahoki mai",
    "admin.hover.teams.restore": "Whakahoki mai i tēnei tīma kua whakatāpuia",
    "admin.hover.competitions.add":
      "Tāpiri i tētahi tauwhāinga ki tēnei whakataetae",
    "admin.hover.competitions.edit":
      "Whakarerekē i ngā taipitopito o tēnei tauwhāinga",
    "admin.hover.competitions.up":
      "Nekehia tēnei tauwhāinga ki runga i te rārangi",
    "admin.hover.competitions.down":
      "Nekehia tēnei tauwhāinga ki raro i te rārangi",
    "admin.hover.competitions.archive":
      "Whakatāpui i tēnei tauwhāinga; ka taea te whakahoki mai",
    "admin.hover.competitions.restore":
      "Whakahoki mai i tēnei tauwhāinga kua whakatāpuia",
    "admin.hover.tests.add":
      "Tāpiri i tētahi whakamātau i waenga i ngā tīma e rua",
    "admin.hover.tests.edit":
      "Whakarerekē i ngā taipitopito o tēnei whakamātau",
    "admin.hover.tests.up": "Nekehia tēnei whakamātau ki runga i te rārangi",
    "admin.hover.tests.down": "Nekehia tēnei whakamātau ki raro i te rārangi",
    "admin.hover.tests.archive":
      "Whakatāpui i tēnei whakamātau; ka taea te whakahoki mai",
    "admin.hover.tests.restore":
      "Whakahoki mai i tēnei whakamātau kua whakatāpuia",
    "admin.hover.tests.toTeams":
      "Haere ki te ripa Tīma hei tāpiri i ngā tīma e hiahiatia ana e tētahi whakamātau",
    "admin.hover.scores.add":
      "Tāpiri i te tākohu o tētahi kēmu ki tēnei tauwhāinga",
    "admin.hover.scores.edit": "Whakatikatika i tēnei tākohu",
    "admin.hover.scores.archive":
      "Whakatāpui i tēnei tākohu kia kore ai e kaute; ka taea te whakahoki mai",
    "admin.hover.scores.restore":
      "Whakahoki mai i tēnei tākohu kua whakatāpuia, kia kaute anō ai",
    "admin.hover.scores.withdraw":
      "Waiho tēnei tākohu ki te rārangi engari kia kore e kaute",
    "admin.hover.scores.unwithdraw": "Me kaute anō tēnei tākohu kua unuhia",
    "admin.hover.scores.up": "Nekehia tēnei tākohu ki mua i te rārangi",
    "admin.hover.scores.down": "Nekehia tēnei tākohu ki muri i te rārangi",
    "admin.hover.competitionPlayers.add":
      "Whakaurua te kaitākaro kua kōwhiria ki tēnei tauwhāinga",
    "admin.hover.competitionPlayers.up":
      "Nekehia tēnei kaitākaro ki runga i te rārangi",
    "admin.hover.competitionPlayers.down":
      "Nekehia tēnei kaitākaro ki raro i te rārangi",
    "admin.hover.competitionPlayers.remove":
      "Tangohia tēnei kaitākaro i te tauwhāinga",
    "admin.hover.competitionPlayers.withdraw":
      "Unuhia tēnei kaitākaro i te tauwhāinga",
    "admin.hover.competitionPlayers.unwithdraw":
      "Whakahokia mai tēnei kaitākaro kua unuhia ki te tauwhāinga",
    "admin.hover.competitionPlayers.carryForward":
      "Kawea whakamua ngā hua o tēnei kaitākaro mai i tētahi atu tauwhāinga",
    "admin.hover.notes.add": "Tuhia he tuhinga hou mō tēnei whakataetae",
    "admin.hover.notes.edit": "Whakarerekē i tēnei tuhinga",
    "admin.hover.notes.delete": "Mukua tēnei tuhinga",
    "admin.hover.note.add":
      "Pupuri i tēnei tuhinga me te tāpiri ki te whakataetae",
    "admin.hover.note.save": "Pupuri i ngā huringa ki tēnei tuhinga",
    "admin.hover.people.add": "Hoatu te tūranga ki tēnei tangata",
    "admin.hover.people.remove": "Tangohia te tūranga i tēnei tangata",
    "admin.hover.worldRankings.import":
      "Tikina ngā whakarārangi o te ao me te tāpiri i ō rātou kaitākaro",
    "admin.modal.cancel": "Whakakore",
    "admin.modal.ok": "Āe",
    // The Managers and Scorers tabs.
    "admin.people.emailAddress": "Wāhitau īmēra",
    "admin.people.remove": "Tango",
    "admin.people.otherwise": "Kāore i taea tērā.",
    "admin.managers.you": "Koe",
    "admin.managers.add": "Tāpiri kaiwhakahaere",
    "admin.managers.none": "Kāore he kaiwhakahaere",
    "admin.managers.removeTitle": "Tangohia te kaiwhakahaere",
    "admin.managers.removeExplanation":
      "Kāore a {name} e taea te whakahaere i tēnei whakataetae.",
    "admin.managers.removeYourself.explanation":
      "Kāore koe e taea te whakahaere i tēnei whakataetae, ā, kāore he tangata i konei e taea te whakahoki i tērā mōu. Ka taea e tētahi atu kaiwhakahaere te whakahoki i a koe hei kaiwhakahaere anō.",
    "admin.managers.otherwise":
      "Kāore e taea te whakanoho i taua wāhitau hei kaiwhakahaere.",
    // The Players tab.
    "admin.competitionPlayers.add": "Tāpiri kaitākaro",
    "admin.competitionPlayers.otherwise":
      "Kāore e taea te tāpiri i tēnei kaitākaro.",
    "admin.competitionPlayers.choose": "Kaitākaro hei tāpiri",
    "admin.competitionPlayers.nobody": "Kōwhiria he kaitākaro",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Kei te tauwhāinga ngā kaitākaro katoa",
    "admin.competitionPlayers.none": "Kāore he kaitākaro",
    "admin.competitionPlayers.up": "Whakarunga",
    "admin.competitionPlayers.down": "Whakararo",
    "admin.competitionPlayers.remove": "Tango",
    "admin.competitionPlayers.withdraw": "Unuhia",
    "admin.competitionPlayers.unwithdraw": "Whakahokia mai",
    "admin.competitionPlayers.withdrawn": "Ngā kaitākaro kua unuhia",
    "admin.competitionPlayers.removeTitle": "Tangohia te kaitākaro",
    "admin.competitionPlayers.removeQuestion":
      "Ka tangohia a {name} i te tauwhāinga. Kāore e taea te whakahoki.",
    "admin.competitionPlayers.withdrawTitle": "Unuhia te kaitākaro",
    "admin.competitionPlayers.withdrawQuestion":
      "Kāore a {name} e tākaro anō i te tauwhāinga, ā, ka whakatauhia ngā kēmu kāore anō kia tākarohia me te kore ia.",
    "admin.competitionPlayers.carryForward": "Kawea whakamua",
    // The carry forward dialog.
    "admin.carryForward.title": "Kawea whakamua - {name}",
    "admin.carryForward.save": "Penapena",
    "admin.carryForward.otherwise":
      "Kāore e taea te pupuri i tēnei kawe whakamua.",
    "admin.carryForward.matchWins": "Wikitoria tukinga",
    "admin.carryForward.matchLosses": "Hinganga tukinga",
    "admin.carryForward.gameWins": "Wikitoria kēmu",
    "admin.carryForward.gameLosses": "Hinganga kēmu",
    "admin.carryForward.hoopsFor": "Hupa mō",
    "admin.carryForward.hoopsAgainst": "Hupa whakahē",
    "CarryForward.MatchWinsNotWhole":
      "Tāuruatia he tau tōpū o ngā wikitoria tukinga.",
    "CarryForward.MatchWinsBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā wikitoria tukinga.",
    "CarryForward.MatchLossesNotWhole":
      "Tāuruatia he tau tōpū o ngā hinganga tukinga.",
    "CarryForward.MatchLossesBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā hinganga tukinga.",
    "CarryForward.GameWinsNotWhole":
      "Tāuruatia he tau tōpū o ngā wikitoria kēmu.",
    "CarryForward.GameWinsBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā wikitoria kēmu.",
    "CarryForward.GameLossesNotWhole":
      "Tāuruatia he tau tōpū o ngā hinganga kēmu.",
    "CarryForward.GameLossesBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā hinganga kēmu.",
    "CarryForward.HoopsForNotWhole": "Tāuruatia he tau tōpū o ngā hupa mō.",
    "CarryForward.HoopsForBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā hupa mō.",
    "CarryForward.HoopsAgainstNotWhole":
      "Tāuruatia he tau tōpū o ngā hupa whakahē.",
    "CarryForward.HoopsAgainstBelowZero":
      "Tāuruatia te 0 neke atu rānei o ngā hupa whakahē.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Tāpiri tākohu",
    "admin.scores.none": "Kāore he tākohu",
    "admin.scores.edit": "Whakatika",

    "admin.scores.drawNotFilledTitle": "Kāore anō kia kī te tuhi",
    "admin.scores.archive": "Whakatāpui",
    "admin.scores.up": "Whakarunga",
    "admin.scores.down": "Whakararo",
    "admin.scores.restore": "Whakahokia mai",
    "admin.scores.archived": "Ngā tākohu kua whakatāpuia",
    "admin.scores.archivedSaid": "Kua whakatāpuia",
    "admin.scores.withdraw": "Unuhia",
    "admin.scores.unwithdraw": "Whakahokia mai",
    "admin.scores.withdrawnSaid": "Kua unuhia",
    "admin.scores.otherwise": "Kāore i taea tērā.",
    "admin.score.title": "Tāpiri tākohu",
    "admin.score.add": "Tāpiri kēmu",
    "admin.score.winner": "Te toa",
    "admin.score.winnerScore": "Tākohu a te toa",
    "admin.score.loser": "Te hinga",
    "admin.score.loserScore": "Tākohu a te hinga",
    "admin.score.beat": "i hinga i a",
    "admin.score.added":
      "Kua tāpiritia te kēmu i wikitoria ai a {winner} i a {loser}.",
    "admin.score.otherwise": "Kāore i taea te tāpiri i te kēmu.",
    "admin.score.correctTitle": "Whakatika tākohu",
    "admin.score.save": "Penapena",
    "admin.score.notCorrected": "Kāore i taea te whakatika i te tākohu.",
    "Game.WinnerMissing": "Kōwhiria te toa.",
    "Game.WinnerScoreMissing": "Patohia te tākohu a te toa.",
    "Game.LoserMissing": "Kōwhiria te hinga.",
    "Game.LoserScoreMissing": "Patohia te tākohu a te hinga.",
    "Score.NoPoints": "Ka tīmata te tākohu ki tōna tau pointi.",
    "Game.SamePlayer": "Kāore te tangata e tākaro i a ia anō.",
    "Game.WinnerNotAhead":
      "Me nui ake te tākohu a te toa i tō te hinga, me tohu rānei hei wikitoria.",
    "Game.LoserMarked":
      "Kāore e taea te tohu i te tākohu a te hinga hei wikitoria.",
    "Game.ResultChanged":
      "Ka puritia te hua i te whakatikatika: ka noho wikitoria tonu te kēmu i wikitoria, ka noho taurite tonu te kēmu i taurite.",
    "Competition.MatchDecided": "Kua whakatauhia kētia tō rāua tukinga.",
    "Competition.DrawFull":
      "Kāore e taea te tāpiri i te kaitākaro nā te mea kua ki te whakaweto.",
    "Competition.DrawNotFilled":
      "Kāore e taea te tāpiri tākohu kia ki ngā tūnga katoa o te whakaweto i tētahi kaitākaro, i tētahi bye rānei.",
    "Competition.ByeOutsideKnockout":
      "Ko te whakaweto anake e taea te whai bye.",
    "Competition.NotDrawnToMeet":
      "Kāore ēnei kaitākaro i tuhia ināianei kia tākaro tētahi ki tētahi i te whakaweto.",
    "Competition.WinnerHasPlayedOn":
      "Kua tākaro kētia te toa o tēnei tukinga i tāna kēmu e whai ake nei, nā reira e kore e taea te whakarerekē ko wai te toa.",
    "CompetitionPlayer.Withdrawn":
      "Kāore te kaitākaro kua unuhia e tākaro anō.",
    "admin.players.add": "Tāpiri kaitākaro",
    "admin.players.none": "Kāore he kaitākaro",
    "admin.players.edit": "Whakatika",
    "admin.players.archive": "Whakatāpui",
    "admin.players.restore": "Whakahokia mai",
    "admin.players.up": "Whakarunga",
    "admin.players.down": "Whakararo",
    // Asked before archiving a player who is in competitions.
    "admin.players.archiveTitle": "Whakatāpuia te kaitākaro",
    "admin.players.archiveQuestion": "Ka tangohia a {name} i ēnei tauwhāinga:",
    "admin.players.archive.explanation":
      "Mā te whakahoki mai i a ia e kore ia e hoki ki ēnei tauwhāinga.",
    "admin.players.archived": "Ngā kaitākaro kua whakatāpuia",
    "admin.players.archivedSaid": "Kua whakatāpuia",
    // The player dialog.
    "admin.player.addTitle": "Tāpiri kaitākaro",
    "admin.player.editTitle": "Whakatika kaitākaro",
    "admin.player.name": "Ingoa",
    "admin.player.representing": "E māngai ana i",
    "admin.player.worldRankingName": "Ingoa kaitākaro whakarārangi o te ao",
    "admin.player.worldRankingKnown":
      "E mōhio ana ngā whakarārangi o te ao ki tēnei ingoa.",
    "admin.player.worldRankingQuestioned":
      "Kāore he kaitākaro o tēnei ingoa i ngā whakarārangi o te ao. Tērā pea he hē te tuhi, he hou rānei te kaitākaro ki ngā whakarārangi.",
    "admin.player.flag": "Haki",
    "admin.player.add": "Tāpiri",
    "admin.player.save": "Penapena",
    "admin.player.added": "Kua tāpiritia a {name}.",
    "admin.player.otherwise": "Kāore e taea te pupuri i tēnei kaitākaro pēnei.",
    "Tournament.PlayerNameTaken":
      "Kei tētahi atu kaitākaro o tēnei whakataetae kua whai i taua ingoa.",
    "TournamentPlayer.NoSuchFlag": "Kōwhiria tētahi o ngā haki e wātea ana.",
    "TournamentPlayer.NamedBye":
      "Kāore e taea te whakaingoa i tētahi kaitākaro ko Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te ingoa.",
    "admin.player.byesTitle": "Kāore e tāpiri i ngā bye",
    "admin.player.byes":
      "Ehara te bye i tētahi o ngā kaitākaro o te whakataetae. Ka tuku te whakaweto i a Bye ina tāpiritia ana ōna kaitākaro, kia rite ki te maha e hiahiatia ana e tōna tuhi.",
    // A tournament played by teams.
    "admin.view.teams": "Tīma",
    "admin.view.tests": "Whakamātau",
    "admin.teams.add": "Tāpiri tīma",
    "admin.teams.none": "Kāore he tīma",
    "admin.teams.edit": "Whakatika",
    "admin.teams.view": "Tirohia",
    "admin.teams.archive": "Whakatāpui",
    "admin.teams.restore": "Whakahokia mai",
    "admin.teams.up": "Whakarunga",
    "admin.teams.down": "Whakararo",
    "admin.teams.archived": "Ngā tīma kua whakatāpuia",
    "admin.teams.archivedSaid": "Kua whakatāpuia",
    "admin.team.addTitle": "Tāpiri tīma",
    "admin.team.editTitle": "Whakatika tīma",
    "admin.team.name": "Ingoa",
    "admin.team.shortName": "Ingoa poto",
    "admin.team.shortName.explanation":
      "Te ingoa e tapaina ai ngā whakamātau a te tīma, pēnei i AUS v ENG.",
    "admin.team.flag": "Haki",
    "admin.team.add": "Tāpiri",
    "admin.team.save": "Penapena",
    "admin.team.added": "Kua tāpiritia a {name}.",
    "admin.team.otherwise": "Kāore e taea te pupuri i tēnei tīma pēnei.",
    "admin.teamView.otherwise":
      "Kāore e taea te tiro i tēnei tīma mai i konei.",
    "admin.teamView.players": "Kaitākaro",
    "TeamName.Missing": "Whakaingoatia te tīma.",
    "TeamName.TooLong": "Kua roa rawa taua ingoa.",
    "admin.notes.add": "Tāpiri tuhinga",
    "admin.notes.none": "Kāore he tuhinga",
    "admin.notes.edit": "Whakatika",
    "admin.notes.delete": "Muku",
    "admin.notes.deleteTitle": "Muku tuhinga",
    "admin.notes.deleteQuestion": "Mukua te tuhinga “{title}”?",
    "admin.notes.delete.explanation":
      "Ka ngaro tūturu te tuhinga kua mukua, ā, kāore e taea te whakahoki mai.",
    "admin.notes.otherwise": "Kāore i taea tērā.",
    // The note dialog.
    "admin.note.addTitle": "Tāpiri tuhinga",
    "admin.note.editTitle": "Whakatika tuhinga",
    "admin.note.title": "Taitara",
    "admin.note.description": "Whakaahuatanga",
    "admin.note.write": "Tuhi",
    "admin.note.preview": "Arokite",
    "admin.note.toolbar": "Whakatakoto",
    "admin.note.tool.heading": "Pane",
    "admin.note.tool.bold": "Matotoru",
    "admin.note.tool.italic": "Tītaha",
    "admin.note.tool.quote": "Kupu tāpiri",
    "admin.note.tool.code": "Waehere",
    "admin.note.tool.link": "Hono",
    "admin.note.tool.numberedList": "Rārangi tau",
    "admin.note.tool.bulletedList": "Rārangi marau",
    "admin.note.tool.taskList": "Rārangi mahi",
    "admin.note.add": "Tāpiri",
    "admin.note.save": "Penapena",
    "admin.note.otherwise": "Kāore e taea te pupuri i tēnei tuhinga pēnei.",
    "ManagerNoteTitle.Missing": "Hoatu he taitara ki te tuhinga.",
    "ManagerNoteTitle.TooLong": "Kua roa rawa taua taitara.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te taitara.",
    "ManagerNoteDescription.TooLong": "Kua roa rawa taua whakaahuatanga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Kua kore taua tuhinga i reira. Tērā pea nā tētahi atu kaiwhakahaere i muku.",
    "EditManagerNote.NoSuchManagerNote":
      "Kua kore taua tuhinga i reira. Tērā pea nā tētahi atu kaiwhakahaere i muku.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Kua kore taua tuhinga i reira. Tērā pea nā tētahi atu kaiwhakahaere i muku.",
    "ManagerNote.Deleted":
      "Kua mukua taua tuhinga. Tērā pea nā tētahi atu kaiwhakahaere i muku.",
    "CommentaryTitle.Missing": "Hoatu he taitara ki te kōrero whakaahua.",
    "CommentaryTitle.TooLong": "Kua roa rawa taua taitara.",
    "CommentaryTitle.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te taitara.",
    "Commentary.TitleTaken":
      "Kei tētahi atu kōrero whakaahua kua whai i taua taitara.",
    "CommentText.Missing": "Tuhia tētahi mea ki te kōrero.",
    "CommentText.TooLong": "Kua roa rawa taua kōrero.",
    "TeamShortName.Missing": "Hoatu he ingoa poto ki te tīma.",
    "TeamShortName.TooLong": "Kia 10 pūāhua te nuinga rawa o te ingoa poto.",
    "TeamShortName.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te ingoa poto.",
    "Team.ShortNameLongerThanName":
      "Kāore e taea e te ingoa poto te roa ake i te ingoa o te tīma.",
    "Team.NoSuchFlag": "Kōwhiria tētahi o ngā haki e wātea ana.",
    "Team.Archived":
      "Kua whakatāpuia taua tīma, ā, me whakahoki mai i te tuatahi.",
    "Team.InATest":
      "Kei tētahi whakamātau taua tīma e tākaro ana, nā reira e kore e taea te whakatāpui.",
    "Team.PlayerNameTaken":
      "Kei tētahi atu kaitākaro o tēnei tīma kua whai i taua ingoa.",
    "TeamPlayer.NamedBye":
      "Kāore e taea te whakaingoa i tētahi kaitākaro ko Bye.",
    "TeamPlayer.Archived":
      "Kua whakatāpuia taua kaitākaro, ā, me whakahoki mai i te tuatahi.",
    "TeamPlayer.HasGames":
      "Kua tākaro taua kaitākaro, nā reira e kore e taea te whakatāpui.",
    "Tournament.TeamNameTaken":
      "Kei tētahi atu tīma o tēnei whakataetae kua whai i taua ingoa.",
    "Tournament.TeamShortNameTaken":
      "Kei tētahi atu tīma o tēnei whakataetae kua whai i taua ingoa poto.",
    "Tournament.NoSuchTeam":
      "Kāore he tīma o tēnei whakataetae i tēnei wāhitau.",
    "Tournament.TeamArchived":
      "Kua whakatāpuia tēnei tīma, ā, ka taea anake te whakahoki mai mai i te ripa Tīma.",
    "admin.tests.add": "Tāpiri whakamātau",
    "admin.tests.none": "Kāore he whakamātau",
    "admin.tests.edit": "Whakatika",
    "admin.tests.view": "Tirohia",
    "admin.tests.archive": "Whakatāpui",
    "admin.tests.restore": "Whakahokia mai",
    "admin.tests.up": "Whakarunga",
    "admin.tests.down": "Whakararo",
    "admin.tests.archived": "Ngā whakamātau kua whakatāpuia",
    "admin.tests.twoTeamsNeeded":
      "I waenga i ngā tīma e rua te whakamātau, nā reira me rua ngā tīma i te tuatahi.",
    "admin.tests.toTeams": "Haere ki Tīma",
    "admin.tests.matches.one": "{count} tukinga",
    "admin.tests.matches.other": "{count} tukinga",
    "admin.tests.bestOf": "pai rawa o te {games}",
    "admin.tests.otherwise": "Kāore i taea tērā.",
    "admin.test.addTitle": "Tāpiri whakamātau",
    "admin.test.editTitle": "Whakatika whakamātau",
    "admin.test.firstTeam": "Tīma A",
    "admin.test.secondTeam": "Tīma B",
    "admin.test.versus": "v",
    "admin.test.starts": "Te tīmatanga",
    "admin.test.finishes": "Te mutunga",
    "admin.test.expectedMatches": "Ngā tukinga e tūmanakohia ana",
    "admin.test.bestOf": "Pai rawa o te",
    "admin.test.group": "Rōpū",
    "admin.test.add": "Tāpiri",
    "admin.test.save": "Penapena",
    "admin.test.added": "Kua tāpiritia a {name}.",
    "admin.test.otherwise": "Kāore e taea te pupuri i tēnei whakamātau pēnei.",
    "admin.testView.otherwise":
      "Kāore e taea te tiro i tēnei whakamātau mai i konei.",
    "AddTest.FirstTeamMissing": "Kōwhiria te tīma tuatahi.",
    "AddTest.SecondTeamMissing": "Kōwhiria te tīma tuarua.",
    "UpdateTest.FirstTeamMissing": "Kōwhiria te tīma tuatahi.",
    "UpdateTest.SecondTeamMissing": "Kōwhiria te tīma tuarua.",
    "ExpectedMatches.NotWhole": "Tāuruatia he tau tōpū o ngā tukinga.",
    "ExpectedMatches.TooSmall":
      "Me tūmanakohia kia 1 te tukinga i te iti rawa o tētahi whakamātau.",
    "TestGroup.TooLong": "Kua roa rawa taua rōpū.",
    "Tournament.TestAgainstItself":
      "Kāore te tīma e tākaro i tētahi whakamātau i a ia anō.",
    "Tournament.TestFinishesBeforeStarts":
      "Kāore e taea e tētahi whakamātau te mutu i mua i tōna tīmatanga.",
    "Tournament.TestStartsBeforeTournament":
      "Kāore e taea e tētahi whakamātau te tīmata i mua i tō tōna whakataetae.",
    "Tournament.TestFinishesAfterTournament":
      "Kāore e taea e tētahi whakamātau te mutu i muri i tō tōna whakataetae.",
    "Tournament.TestHasGamesInUse":
      "He kēmu tō tēnei whakamātau, nā reira e kore e taea te whakatāpui kia whakatāpuia aua kēmu.",
    "Tournament.TestHasGames":
      "He kēmu tō tēnei whakamātau ināianei, nā reira e kore e taea te whakarerekē i ōna tīma.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Neke atu i taua tau ngā tukinga kua tīmata kētia.",
    "Tournament.BestOfBelowGamesPlayed":
      "Neke atu i taua tau ngā kēmu kua tākarohia e ngā kaitākaro e rua.",
    "Competition.ExpectedMatchesReached":
      "Kua tīmata tēnei whakamātau i te maha o ngā tukinga e tūmanakohia ana.",
    "Competition.SameTeam":
      "Kāore ngā kaitākaro e rua o te tīma kotahi e tākaro tētahi ki tētahi.",
    "AddManager.NoSuchAccount":
      "Kāore he pūkete o taua wāhitau e taea te whakanoho hei kaiwhakahaere.",
    "admin.scorers.add": "Tāpiri kaitākohu",
    "admin.scorers.none": "Kāore he kaitākohu",
    "admin.scorers.removeTitle": "Tangohia te kaitākohu",
    "admin.scorers.removeExplanation":
      "Kāore a {name} e taea te tāuru i ngā tākohu o tēnei whakataetae.",
    "admin.scorers.otherwise":
      "Kāore e taea te whakanoho i taua wāhitau hei kaitākohu.",
    "AddScorer.NoSuchAccount":
      "Kāore he pūkete o taua wāhitau e taea te whakanoho hei kaitākohu.",
    // Giving, taking and listing roles.
    "Account.NotAnAdministrator":
      "Ko te kaiwhakahaere anake e taea te mahi i tērā.",
    "AddRole.NoSuchAccount":
      "Kāore he pūkete o taua wāhitau e taea te hoatu te tūranga.",
    "AddRole.NoSuchRole": "Kāore he tūranga pēnei.",
    "RemoveRole.NoSuchAccount": "Kāore he pūkete pēnei.",
    "RemoveRole.NoSuchRole": "Kāore he tūranga pēnei.",
    "RemoveRole.Yourself":
      "Kāore e taea e koe te tango i te tūranga Kaiwhakahaere i a koe anō.",
    "AccountsWithRole.NoSuchRole": "Kāore he tūranga pēnei.",
    "Tournament.AlreadyAManager":
      "Kei te whakahaere kētia taua pūkete i te whakataetae, ā, ka taea e ia ngā mea katoa ka taea e te kaitākohu.",

    // A tournament's refusals.
    "TournamentName.Missing": "Whakaingoatia te whakataetae.",
    "TournamentName.TooShort": "Kua poto rawa taua ingoa.",
    "TournamentName.TooLong": "Kua roa rawa taua ingoa.",
    "TournamentName.AllLowerCase": "Kaua e puta katoa te ingoa ki te reta iti.",
    "TournamentName.AllCapitals": "Kaua e puta katoa te ingoa ki te reta nui.",
    "TournamentName.NoLetterOrDigit":
      "Me whai reta, tau rānei i roto i te ingoa.",
    "ReadOnlyDate.Unreadable": "Hoatu te rā.",
    "Tournament.FinishesBeforeStarts":
      "Kāore e taea e tētahi whakataetae te mutu i mua i tōna tīmatanga.",
    "Tournament.StartsAfterNextYear":
      "Kāore e taea e tētahi whakataetae te tīmata i muri i te tau e haere mai nei.",
    "Tournament.FinishesAfterNextYear":
      "Kāore e taea e tētahi whakataetae te mutu i muri i te tau e haere mai nei.",
    "CreateTournament.NoSuchCountry": "Kōwhiria te whenua.",
    "TournamentSubtitle.TooLong":
      "Kaua e neke atu i te 2000 pūāhua te taitara iti.",
    "Tournament.NotAManager":
      "Ko te kaiwhakahaere anake o tēnei whakataetae e taea te whakarerekē.",
    "Tournament.NotAManagerOrScorer":
      "Ko te kaiwhakahaere, te kaitākohu rānei o tēnei whakataetae anake e taea te kite.",
    "Tournament.Archived":
      "Kua whakatāpuia tēnei whakataetae, ā, me whakahoki mai i mua i te whakarerekē.",
    "UpdateTournament.NoSuchTournament":
      "Kāore he whakataetae i tēnei wāhitau.",

    // What a tournament is played in and where, by code.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Paerewa",
    "format.teams": "Tīma",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Anatōra",
    "country.ae": "Ngā Whakakotahitanga o ngā Emira Arapi",
    "country.af": "Awhekenihitana",
    "country.ag": "Anatika me Pāpura",
    "country.ai": "Anguilla",
    "country.al": "Arapeinia",
    "country.am": "Āmenia",
    "country.ao": "Angora",
    "country.ar": "Āketina",
    "country.as": "Hāmoa Amerika",
    "country.at": "Ateria",
    "country.au": "Ahitereiria",
    "country.aw": "Aruba",
    "country.ax": "Ngā Motu o Åland",
    "country.az": "Ahapāriana",
    "country.ba": "Pōniha me Herekōmina",
    "country.bb": "Pāpatohi",
    "country.bd": "Pākaratēhi",
    "country.be": "Pēruiama",
    "country.bf": "Burkina Faso",
    "country.bg": "Purukāria",
    "country.bh": "Pahareini",
    "country.bi": "Puruniti",
    "country.bj": "Penīna",
    "country.bm": "Pēmuta",
    "country.bn": "Poronai",
    "country.bo": "Poriwia",
    "country.br": "Parahi",
    "country.bs": "Pahama",
    "country.bt": "Pūtana",
    "country.bv": "Motu Bouvet",
    "country.bw": "Poriwana",
    "country.by": "Pērara",
    "country.bz": "Perīhi",
    "country.ca": "Kānata",
    "country.catalonia": "Katarōnia",
    "country.cc": "Ngā Motu Cocos (Keeling)",
    "country.cd": "Te Whenua Tuku Iho Manapori o Kongo",
    "country.cf": "Te Whenua Tuku Iho o Awherika Waenga",
    "country.cg": "Te Whenua Tuku Iho o Kongo",
    "country.ch": "Huiterangi",
    "country.ci": "Côte d'Ivoire",
    "country.ck": "Ngā Motu Kuki",
    "country.cl": "Hiri",
    "country.cm": "Kamarūna",
    "country.cn": "Haina",
    "country.co": "Koromōpia",
    "country.cr": "Koto Rika",
    "country.cu": "Kiupa",
    "country.cv": "Kēpa Wēti",
    "country.cx": "Motu Kirihimete",
    "country.cy": "Haipara",
    "country.cz": "Tiekia",
    "country.de": "Tiamana",
    "country.dj": "Tipūti",
    "country.dk": "Tenemāka",
    "country.dm": "Tominika",
    "country.do": "Te Whenua Tuku Iho o Tominika",
    "country.dz": "Aratiria",
    "country.ec": "Ekuatoa",
    "country.ee": "Ehetōnia",
    "country.eg": "Īhipa",
    "country.eh": "Hahāra ki te Uru",
    "country.england": "Ingarangi",
    "country.er": "Eritēria",
    "country.es": "Peina",
    "country.et": "Etiopia",
    "country.fi": "Whinarana",
    "country.fj": "Whītī",
    "country.fk": "Ngā Motu Falkland",
    "country.fm": "Mikironīhia",
    "country.fo": "Ngā Motu Faroe",
    "country.fr": "Wīwī",
    "country.ga": "Kāpona",
    "country.gb": "Te Basileia Kotahi",
    "country.gd": "Kerenāta",
    "country.ge": "Hōria",
    "country.gf": "Kuiana Wīwī",
    "country.gh": "Kāna",
    "country.gi": "Kiripaltā",
    "country.gl": "Kirīrangi",
    "country.gm": "Kamopia",
    "country.gn": "Kini",
    "country.gp": "Kuatarupe",
    "country.gq": "Kini Ekuatoria",
    "country.gr": "Kirihi",
    "country.gs": "Hōria ki te Tonga me Ngā Motu Sandwich ki te Tonga",
    "country.gt": "Kuatemāra",
    "country.gu": "Kuama",
    "country.gw": "Kini-Pihao",
    "country.gy": "Kaiana",
    "country.hk": "Hongakonga",
    "country.hm": "Te Motu Heard me Ngā Motu McDonald",
    "country.hn": "Honurahi",
    "country.hr": "Koroātia",
    "country.ht": "Haiti",
    "country.hu": "Hanekari",
    "country.id": "Initonīhia",
    "country.ie": "Airani",
    "country.il": "Iharaira",
    "country.im": "Te Motu o Man",
    "country.in": "Initia",
    "country.io": "Te Rohe o Te Moana Initia o Ingarangi",
    "country.iq": "Iraka",
    "country.ir": "Irāna",
    "country.is": "Tiorangi",
    "country.it": "Itāria",
    "country.je": "Jersey",
    "country.jm": "Hemeka",
    "country.jo": "Hōrano",
    "country.jp": "Hapani",
    "country.ke": "Kēnia",
    "country.kg": "Kiketā",
    "country.kh": "Kamapōtia",
    "country.ki": "Kiripati",
    "country.km": "Komoro",
    "country.kn": "Hato Kiti me Newhi",
    "country.kp": "Kōrea ki te Raki",
    "country.kr": "Kōrea ki te Tonga",
    "country.kw": "Kuwaiti",
    "country.ky": "Ngā Motu Kēmana",
    "country.kz": "Kahakitāna",
    "country.la": "Rāoho",
    "country.lb": "Repanona",
    "country.lc": "Hato Ruhia",
    "country.li": "Rihitenahi",
    "country.lk": "Hiri Rānka",
    "country.lr": "Raiperia",
    "country.ls": "Teroto",
    "country.lt": "Rihuānia",
    "country.lu": "Ruhemipēki",
    "country.lv": "Rātvia",
    "country.ly": "Ripia",
    "country.ma": "Moroko",
    "country.mc": "Monako",
    "country.md": "Moratawia",
    "country.me": "Monitenīkero",
    "country.mg": "Madagāhika",
    "country.mh": "Ngā Motu Marshall",
    "country.mk": "Makerōnia ki te Raki",
    "country.ml": "Māri",
    "country.mm": "Mianama",
    "country.mn": "Mongōria",
    "country.mo": "Makau",
    "country.mp": "Ngā Motu Mariana ki te Raki",
    "country.mq": "Mātiniki",
    "country.mr": "Mauritānia",
    "country.ms": "Monoserā",
    "country.mt": "Mārata",
    "country.mu": "Mōrehu",
    "country.mv": "Maratiri",
    "country.mw": "Marāwi",
    "country.mx": "Mēhiko",
    "country.my": "Mareia",
    "country.mz": "Mohapiki",
    "country.na": "Namīpia",
    "country.nc": "Kaleronia Hou",
    "country.ne": "Ngāika",
    "country.nf": "Te Motu o Norfolk",
    "country.ng": "Ngāīria",
    "country.ni": "Nikarāhua",
    "country.nl": "Hōrana",
    "country.no": "Nōwei",
    "country.np": "Nepāra",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Aotearoa",
    "country.om": "Omana",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Pōrinīhia Wīwī",
    "country.pg": "Papua Nūkini",
    "country.ph": "Piripīni",
    "country.pk": "Pakistan",
    "country.pl": "Pōrana",
    "country.pm": "Hato Pierre me Mikerona",
    "country.pn": "Ngā Motu Pitcairn",
    "country.pr": "Puerto Rico",
    "country.ps": "Parihitini",
    "country.pt": "Potukara",
    "country.pw": "Paraü",
    "country.py": "Parakai",
    "country.qa": "Katā",
    "country.re": "Réunion",
    "country.ro": "Romēnia",
    "country.rs": "Herepia",
    "country.ru": "Rūhia",
    "country.rw": "Rawanda",
    "country.sa": "Hauri Arāpia",
    "country.sb": "Ngā Motu Horomona",
    "country.sc": "Heihere",
    "country.scotland": "Kōtirana",
    "country.sd": "Hūtāne",
    "country.se": "Huitene",
    "country.sg": "Hingapoa",
    "country.sh": "Hato Herena",
    "country.si": "Horowinia",
    "country.sj": "Svalbard me Jan Mayen",
    "country.sk": "Horowākia",
    "country.sl": "Sierra Leone",
    "country.sm": "Hato Marino",
    "country.sn": "Henekara",
    "country.so": "Homāria",
    "country.sr": "Huriname",
    "country.st": "São Tomé me Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Hiria",
    "country.sz": "Eswatini",
    "country.tc": "Ngā Motu Turks me Caicos",
    "country.td": "Chad",
    "country.tf": "Ngā Rohe o Wīwī ki te Tonga",
    "country.tg": "Toko",
    "country.th": "Tai",
    "country.tj": "Tajikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor-Leste",
    "country.tm": "Turkmenistan",
    "country.tn": "Tūnihia",
    "country.to": "Tonga",
    "country.tr": "Türkiye",
    "country.tt": "Tirinaka me Tobago",
    "country.tv": "Tuwaru",
    "country.tw": "Taiwana",
    "country.tz": "Tanahānia",
    "country.ua": "Ukareine",
    "country.ug": "Ukanda",
    "country.um": "Ngā Motu Iti o Amerika",
    "country.us": "Amerika",
    "country.uy": "Urukuwai",
    "country.uz": "Uzbekistan",
    "country.va": "Te Pā o Vatikana",
    "country.vc": "Hato Wītene me Ngā Kerenātini",
    "country.ve": "Wenehuera",
    "country.vg": "Ngā Motu Wēkini o Ingarangi",
    "country.vi": "Ngā Motu Wēkini o Amerika",
    "country.vn": "Whitināmu",
    "country.vu": "Vanuatu",
    "country.wales": "Weera",
    "country.wf": "Wallis me Futuna",
    "country.ws": "Hāmoa",
    "country.ye": "Īmene",
    "country.yt": "Mayotte",
    "country.za": "Awherika ki te Tonga",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    "Email.ConfirmAddress.subject": "Whakaūngia tō wāhitau īmēra mō {siteName}",
    "Email.ConfirmAddress.body": `
<p>Tēnā koe,</p>

<p>
    Mīharo te mihi mō te waihanga i tētahi pūkete ki <strong>{siteName}</strong>.<br />
    I mua i tō tīmata ki te whakamahi i tō pūkete, tēnā koa whakaūngia tō wāhitau īmēra mā te pāwhiri i te pātene i raro nei:
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
        Whakaūngia taku wāhitau īmēra
    </a>
</p>

<p>
    Mehemea kāore te pātene e mahi, ka taea hoki e koe te whakaū i tō wāhitau īmēra mā te huaki i tēnei hono ki tō kaitirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Mehemea kāore koe i waihanga i tēnei pūkete, ka taea e koe te whakahawea i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "He hono hou hei whakaū i tō wāhitau īmēra mō {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Tēnā koe,</p>

<p>
    I tono koe nā tata nei i tētahi īmēra hou hei whakaū i tō wāhitau īmēra mō <strong>{siteName}</strong>.<br />
    Tēnā koa, whakaūngia tō wāhitau īmēra mā te pāwhiri i te pātene i raro nei:
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
        Whakaūngia taku wāhitau īmēra
    </a>
</p>

<p>
    Mehemea kāore te pātene e mahi, ka taea hoki e koe te whakaū i tō wāhitau īmēra mā te huaki i tēnei hono ki tō kaitirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ina whakaūngia, ka taea e koe te haere tonu ki te whakamahi i tō pūkete me te kore whakararu.
</p>

<p>
    Mehemea kāore koe i tono i tēnei īmēra, ka taea e koe te whakahawea.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "I whakamātau tētahi ki te rēhita mā tō wāhitau īmēra",
    "Email.AlreadyRegistered.body": `
<p>Tēnā koe,</p>

<p>
    I whakamātau tētahi ki te rēhita ki <strong>{siteName}</strong> mā tēnei wāhitau īmēra, he pūkete tōna kētia. Kāore he mea mō tō pūkete i whakarerekē.<br />
    Mehemea nāu, he pūkete tāu kētia, ā, ka taea e koe te takiuru:
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
        Takiuru
    </a>
</p>

<p>
    Mehemea kua wareware koe i tō kupuhipa, ka taea e koe te tautuhi anō i konei:
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
        Kua warewaretia te kupuhipa
    </a>
</p>

<p>
    Mehemea ehara nāu, kāore he mahi māu. Kāore he tangata i whai huarahi ki tō pūkete.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Whakaūngia te nekeneke i tō pūkete {siteName} ki tēnei wāhitau",
    "Email.ConfirmNewEmailAddress.body": `
<p>Tēnā koe,</p>

<p>
    I tono tētahi kua takiuru ki tētahi pūkete <strong>{siteName}</strong> kia neke atu ki tēnei wāhitau īmēra. Mehemea nāu, whakaūngia i konei, ka takiuru ki taua pūkete. E 24 hāora te roa e mahi ai te hono.
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
        Nekehia taku pūkete
    </a>
</p>

<p>
    Tāpirihia rānei tēnei wāhitau ki tō kaitirotiro:<br />
    {link}
</p>

<p>
    Mehemea ehara nāu, kāore he mahi māu. Kāore he pūkete e neke mai ki konei.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "I tono tētahi kia neke he pūkete ki tō wāhitau īmēra",
    "Email.AlreadyHasAnAccount.body": `
<p>Tēnā koe,</p>

<p>
    I tono tētahi kua takiuru ki tētahi pūkete <strong>{siteName}</strong> kia neke atu ki tēnei wāhitau īmēra, he pūkete tōna ake kētia. Kāore he mea i neke, ā, kāore he mea mō tō pūkete i whakarerekē.
</p>

<p>
    Mehemea nāu, he pūkete tāu kētia i tēnei wāhitau, ā, ka taea e koe te takiuru.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Kua neke tō pūkete {siteName}",
    "Email.EmailAddressChanged.body": `
<p>Tēnā koe,</p>

<p>
    Kua neke tō pūkete <strong>{siteName}</strong> nā tata nei ki tētahi atu wāhitau īmēra, {emailAddress}, ā, ka takiuru mā taua wāhitau mai i tēnei wā.
</p>

<p>
    Mehemea ehara nāu, kei a tētahi atu tō pūkete. Whakahokia mai tēnei īmēra ka kōrero mai ki a mātou.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Kua whakarerekētia tō kupuhipa {siteName}",
    "Email.PasswordChanged.body": `
<p>Tēnā koe,</p>

<p>
    Kua whakarerekētia nā tata nei te kupuhipa o tō pūkete <strong>{siteName}</strong>, ā, kua takiputa ngā kaitirotiro katoa i takiuru ki reira.<br />
    Mehemea nāu, kāore he mahi māu.
</p>

<p>
    Mehemea ehara nāu, kei a tētahi atu tō kupuhipa. Tautuhia he mea hou i konei, ā, ka takiputa ia:
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
        Kua warewaretia te kupuhipa
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Tautuhia he kupuhipa hou mō {siteName}",
    "Email.SetNewPassword.body": `
<p>Tēnā koe,</p>

<p>
    I tono koe nā tata nei kia tautuhi anō i tō kupuhipa mō <strong>{siteName}</strong>.<br />
    Ka taea e koe te tautuhi anō i tō kupuhipa mā te pāwhiri i te pātene i raro nei:
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
        Tautuhi anō i te kupuhipa
    </a>
</p>

<p>
    Mehemea kāore te pātene e mahi, ka taea hoki e koe te tautuhi anō i tō kupuhipa mā te huaki i tēnei hono ki tō kaitirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Mehemea kāore koe i tono kia tautuhi anō i te kupuhipa, ka taea e koe te whakahawea i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Tautuhia he kupuhipa mō {siteName}",
    "Email.SetPassword.body": `
<p>Tēnā koe,</p>

<p>
    Kāore he kupuhipa o tō pūkete <strong>{siteName}</strong>: ka takiuru koe mā Google.<br />
    I tono koe kia tautuhi i tētahi, kia taea ai te takiuru mā tō wāhitau īmēra me te kupuhipa hoki.
    Ka taea e koe te tautuhi mā te pāwhiri i te pātene i raro nei:
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
        Tautuhi kupuhipa
    </a>
</p>

<p>
    Mehemea kāore te pātene e mahi, ka taea hoki e koe te tautuhi i tō kupuhipa mā te huaki i tēnei hono ki tō kaitirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Kotahi hāora te roa e mahi ai te hono. Mehemea kāore koe i tono kia tautuhi kupuhipa, ka taea e koe te whakahawea i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Kāore he pūkete {siteName} mō tēnei wāhitau īmēra",
    "Email.RegisterInstead.body": `
<p>Tēnā koe,</p>

<p>
    I tukuna he tono kia tautuhi anō i te kupuhipa mō tētahi wāhitau īmēra kāore e hono ana ki tētahi pūkete i <strong>{siteName}</strong>.
</p>

<p>
    Mehemea e hiahia ana koe ki te whakamahi i tā mātou ratonga, ka taea e koe te waihanga i tētahi pūkete hou mā te haere ki:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Mehemea ehara nāu tēnei tono, ka taea e koe te whakahawea i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Whakaūngia me warewaretia tō pūkete {siteName}",
    "Email.ConfirmForgetting.body": `
<p>Tēnā koe,</p>

<p>
    I tono koe kia warewaretia tō pūkete <strong>{siteName}</strong>.<br />
    Whāia te pātene i raro nei hei kite i te tikanga o tērā, me te whakaae pono e hiahia ana koe:
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
        Warewaretia taku pūkete
    </a>
</p>

<p>
    Mehemea kāore te pātene e mahi, ka taea hoki e koe te huaki i tēnei hono ki tō kaitirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ina warewaretia, e kore e taea anō e tētahi te pānui i tō ingoa me tō wāhitau īmēra, ā, e kore e taea te takiuru ki tō pūkete. Kāore e taea te whakahoki.
</p>

<p>
    Kotahi te whakamahinga o te hono, kia pau noa te 15 meneti i muri i tō tono, ā, mēnā anake kei te takiuru tonu koe ki tēnei pūkete. I muri i tērā, tonoa anō mai i tō pūkete.
</p>

<p>
    Mehemea kāore koe i tono, kāore he mea e puta ki te kore e whāia te hono. Heoi, nā tētahi kua takiuru ki tō pūkete i tono, nā reira tautuhia he kupuhipa hou mai i te whārangi kua warewaretia te kupuhipa kia tino mōhio kāore ia e taea te takiuru anō.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Kua whakatārewatia te rēhita: kāore e taea te whakapā atu ki a {service}",
    "Email.RegistrationsSuspended.body": `
<p>Tēnā koe,</p>

<p>
    Kāore i taea e {siteName} te whakapā atu ki a {service} i {when}. Kia whakahoki kōrero mai ra anō, ka kīia ngā kaipānui e hiahia ana ki a ia, hei rēhita, hei tautuhi kupuhipa hou rānei, kia whakamātau anō a muri ake.
</p>

<p>
    Kāore he mea hei hiki. Ia whakamātau ka pātai anō ki a {service}, ā, ka mahi anō ngā whārangi ina whakahoki kōrero mai ia.
</p>

<p>
    I te wā e hinga tonu ana a {service}, ka īmēra atu mātou ki a koe mō tēnei kotahi anake i ia hāora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "Kāore e taea e {siteName} te whakapā atu ki tōna pātengi raraunga",
    "Email.DatabaseUnreachable.body": `
<p>Tēnā koe,</p>

<p>
    Kāore i taea e {siteName} te whakapā atu ki tōna pātengi raraunga i {when}. Kia whakahoki kōrero mai ra anō, ka kī ia whārangi e hiahia ana ki a ia ki ngā kaipānui kāore te pae e wātea ana, ā, me whakamātau anō a muri ake.
</p>

<p>
    Kāore he mea hei hiki. Ia tono ka pātai anō mō tētahi hononga, ā, ka mahi anō te pae ina whakahoki kōrero mai te pātengi raraunga.
</p>

<p>
    I te wā e hinga tonu ana te pātengi raraunga, ka īmēra atu mātou ki a koe mō tēnei kotahi anake i ia {minutes} meneti.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "I hinga a {siteName} i tētahi tono",
    "Email.UnhandledError.body": `
<p>Tēnā koe,</p>

<p>
    I hinga a {siteName} i {when} i tētahi tono mō {asked}. I whakaatu ki te kaipānui i te tohutoro {reference}, ā, kei te rekoata te take i raro iho.
</p>

<p>
    Ka hinga tonu pea tētahi pae kua pakaru i ia tono, nā reira ka īmēra atu mātou ki a koe mō ngā hinganga neke atu i te 4 kāore i ia hāora. Ko ērā i muri mai kei te rekoata ahakoa.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
