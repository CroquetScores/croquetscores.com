// The site's words in Māori (te reo Māori). Keyed as the English catalogue is,
// which is what a word missing here falls back to.
//
// Written to the reader as koe, in plain direct sentences, because the English
// it is written from is plain and direct, and te reo has no formal and
// informal "you" to choose between. Words are those the Māori Language
// Commission (Te Taura Whiri i te Reo Māori) and everyday use have settled on
// where there are some (kupuhipa for password, pūkete for account, wāhitau
// īmēra for email address, takiuru for sign in); where none is settled a
// borrowed word is written in Māori spelling (hupa for hoop) or the English
// word is kept (Test, Bye, Swiss). Te reo marks number with the article and not
// the noun, so plurals are "ngā" before an unchanged word. Menu items and
// buttons are in sentence case, where the English capitalises each word.
// Macrons are written throughout, since a vowel without one is a different
// word.
import type { Language } from "../common/language.js";

export const maori: Language = {
  tag: "mi",
  name: "Te Reo Māori",
  words: {
    "site.skipToContent": "Peke ki te ihirangi",
    "navigation.menu": "Tahua",
    "navigation.label": "Matua",
    "navigation.home": "Kāinga",
    "navigation.help": "Āwhina",
    "navigation.admin": "Whakahaere",
    "sections.label": "Ngā wāhanga",
    "theme.label": "Kaupapa tae",
    "theme.light": "Marama",
    "theme.dark": "Pōuri",
    "theme.system": "Pūnaha",
    "footer.donate": "Koha",
    "footer.plea":
      "E pai ana koe ki a {siteName}? Hoatu he koha hei āwhina i te whakawhanake tonu i a ia.",
    "footer.copyright": "© Manatā tuhi {years}, {owner}",
    "footer.privacy": "Matatapu",
    "beta.banner":
      "He pae whakamātau (beta) tēnei. Ka taea te tautuhi anō ngā raraunga i ngā wā katoa.",
    "privacy.contact":
      "He pātai mō tēnei whārangi, mō ngā mea e puritia ana mōu rānei: {emailAddress}",
    "tryWebsite.banner":
      "He wāhi haumaru tēnei hei ako i a {siteName}. Ka taea te muku i ngā mea katoa e whakauru ai koe ki konei i ngā wā katoa.",

    "language.label": "Reo",
    "language.choose": "Whakarerekē",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "He mea hou hei pānui.",
    "whatsNew.admin.message": "He mea hou mō ngā kaiwhakahaere whakataetae.",
    "whatsNew.view": "Tirohia ngā mea hou",
    "whatsNew.later": "Whakamahara mai a muri ake",
    "whatsNew.never": "Kaua rawa e whakaatu anō i tēnei whakamōhiotanga",

    "form.otherwise":
      "He hē tētahi mea. Tirohia ngā mea i whakauru ai koe, ka whakamātau anō.",

    "account.menu": "Pūkete",
    "account.register": "Rēhita",
    "account.signIn": "Takiuru",
    "account.forgotPassword": "Kua wareware ki taku kupuhipa",
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
      "Kāore a Google i whakaū mōu taua wāhitau īmēra, nō reira kāore e taea te whakamahi i konei mā Google. Whakamahia tō wāhitau īmēra i raro nei.",
    "SignInWithGoogle.LinkedToAnother":
      "He pūkete tō taua wāhitau īmēra kē, he mea hono ki tētahi atu pūkete Google. Takiuru mā taua pūkete Google, mā tō wāhitau īmēra me tō kupuhipa rānei.",
    "SignInWithGoogle.NameMissing":
      "Kāore a Google i kī mai i tō ingoa, ā, me whai ingoa te pūkete. Whakamahia tō wāhitau īmēra i raro nei.",
    "Google.Unreachable":
      "Kāore i taea te whakapā atu ki a Google i tēnei wā. Whakamātau anō i muri i ētahi meneti, whakamahia rānei tō wāhitau īmēra i raro nei.",
    "Registration.NotAPerson":
      "Kāore tēnei i te āhua no tētahi tangata. Whakamātau anō, ā, mēnā ka puta tonu, tatari ki ētahi meneti, ka hoki mai.",

    "EmailAddress.Missing": "Whakauruhia he wāhitau īmēra.",
    "EmailAddress.NoAt": "He @ tō te wāhitau īmēra.",
    "EmailAddress.MoreThanOneAt": "Kotahi anake te @ o te wāhitau īmēra.",
    "EmailAddress.NoDomain":
      "He rohe tō te wāhitau īmēra i muri i te @, pēnei i a example.com.",

    "welcome.title": "Tirohia tō īmēra",
    "welcome.checkEmail":
      "Kua tukuna atu he īmēra ki te wāhitau i hoatu e koe. Whāia te hononga kei roto hei haere tonu.",
    "welcome.nothingArrived":
      "Mēnā kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki spam.",
    "welcome.home": "Hoki ki {siteName}",
    "newConfirmationLink.title": "Tonoa he hononga hou",
    "newConfirmationLink.explanation":
      "Kua pau te wā o te hononga hei whakaū i tō wāhitau īmēra. Tonoa he hou, ā, ka tukuna ki te wāhitau i rēhita ai koe.",
    "newConfirmationLink.send": "Tukuna mai he hononga hou",
    "newConfirmationLink.home": "Hoki ki {siteName}",
    "newConfirmationLink.signIn": "Takiuru",
    "newConfirmationLink.sent.title": "Tirohia tō īmēra",
    "newConfirmationLink.sent.explanation":
      "Kua tukuna atu he hononga hou. Whāia hei whakaū i tō wāhitau īmēra. Mēnā kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Kua oti kē te whakaū i taua wāhitau īmēra",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Kāore he mea hei whakaū. Takiuru mā te kupuhipa i hoatu e koe i te wā i whakaū ai koe.",
    "newConfirmationLink.noLongerWorks.title": "Kua kore taua hononga e mahi",
    "newConfirmationLink.noLongerWorks.explanation":
      "Tirohia i whāia e koe te hononga katoa o te īmēra, kāore he mea i ngaro i te pito. Mēnā kāore anō kia mahi, rēhita anō, ā, ka tukuna atu he hononga hou.",
    "newConfirmationLink.tooMany.title": "Whakamātau anō a muri ake nei",
    "newConfirmationLink.tooMany.explanation":
      "He maha ngā hononga kua tukuna ki tēnei wāhitau i ēnei rā tata nei. Tatari mō te hāora, ka tono anō, ā, i tēnei wā tirohia tō kōpaki spam.",

    "forgotPassword.title": "Kua wareware koe ki tō kupuhipa?",
    "forgotPassword.emailAddress": "Wāhitau īmēra",
    "forgotPassword.submit": "Tukuna mai he huarahi hei hoki atu",
    "forgotPassword.home": "Hoki ki {siteName}",
    "forgotPassword.sent.title": "Tirohia tō īmēra",
    "forgotPassword.sent.explanation":
      "Mēnā he pūkete tō taua wāhitau, kua tukuna atu he hononga hei tautuhi i tētahi kupuhipa hou. Whāia i mua i te pahi o te hāora. Mēnā kāore he mea i tae mai i roto i ētahi meneti, tirohia tō kōpaki spam.",
    "forgotPassword.tryAgainLater":
      "He maha rawa ngā tono huarahi hoki atu mai i konei i ēnei rā tata nei. Tatari mō te hāora, ka whakamātau anō.",

    "setNewPassword.title": "Tautuhia he kupuhipa hou",
    "setNewPassword.password": "Kupuhipa",
    "setNewPassword.confirmPassword": "Whakaūngia te kupuhipa",
    "setNewPassword.submit": "Tautuhia taku kupuhipa hou",
    "setNewPassword.home": "Hoki ki {siteName}",
    "setNewPassword.signIn": "Takiuru",
    "setNewPassword.askAgain": "Tono i tētahi hononga hou",
    "setNewPassword.changed.title": "Kua whakarerekētia tō kupuhipa",
    "setNewPassword.changed.explanation":
      "Kua takiputa koe i ngā wāhi katoa i takiuru ai koe. Takiuru mā tō kupuhipa hou.",
    "setNewPassword.expired.title": "Kua pau te wā o taua hononga",
    "setNewPassword.expired.explanation":
      "He hāora te roa e mahi ai te hononga hei tautuhi i tētahi kupuhipa hou. Tonoa tētahi atu, ā, ka tukuna ki taua wāhitau tonu.",
    "setNewPassword.noLongerWorks.title": "Kua kore taua hononga e mahi",
    "setNewPassword.noLongerWorks.explanation":
      "Akene kua whakamahia kētia, kua ngaro rānei tētahi mea i te pito. Tonoa tētahi atu mēnā e hiahia tonu ana koe.",

    "BreachedPasswords.Unreachable":
      "Kāore e taea te tirotiro i tō kupuhipa i tēnei wā, nō reira kāore i whakarerekētia. Whakamātau anō i muri i ētahi meneti; ka mahi tonu tō hononga kia pau noa tōna wā.",

    "forgetAccount.title": "Warewaretia tō pūkete",
    "forgetAccount.explanation":
      "Ka taea te whakarerekē i tō ingoa me tō wāhitau īmēra kia kore e taea te pānui ake, ā, ka katia tō pūkete. Hei whakaū ko koe tēnei, ka tukuna tuatahitia he hononga ki te wāhitau o tō pūkete, ā, kāore he mea e warewaretia kia whāia ra anō e koe.",
    "forgetAccount.submit": "Tukuna mai te hononga",
    "forgetAccount.sent.title": "Tirohia tō īmēra",
    "forgetAccount.sent.explanation":
      "Kua tukuna he hononga ki te wāhitau o tō pūkete. E 15 meneti te roa e mahi ai, ā, i te wā anake e takiuru ana koe ki tēnei pūkete.",
    "forgetAccount.confirm.title": "Warewaretia tō pūkete ake tonu atu?",
    "forgetAccount.confirm.explanation":
      "Ina warewaretia, kāore he tangata e kite anō i tō ingoa, i tō wāhitau īmēra rānei, ā, kāore e taea te takiuru ki tō pūkete. Kāore e taea te whakahoki.",
    "forgetAccount.confirm.submit": "Warewaretia taku pūkete",
    "forgetAccount.forgotten.title": "Kua warewaretia tō pūkete",
    "forgetAccount.forgotten.explanation":
      "Kua kore e taea te pānui i tō ingoa me tō wāhitau īmēra, ā, kua takiputa koe i ngā wāhi katoa i takiuru ai koe.",
    "forgetAccount.noLongerWorks.title": "Kua kore taua hononga e mahi",
    "forgetAccount.noLongerWorks.explanation":
      "Akene kua pau tōna wā, kua whakamahia kētia rānei, nō tētahi pūkete rānei kāore koe e takiuru ana. Tonoa anō mai i tō pūkete mēnā e hiahia tonu ana koe kia warewaretia.",
    "forgetAccount.lastAdministrator.title":
      "Kāore e taea te warewaretia tō pūkete",
    "forgetAccount.lastAdministrator.explanation":
      "Ko koe anake te kaiwhakahaere pae o tēnei pae. Hoatu te tūranga kaiwhakahaere pae ki tētahi atu tangata, ā, ka taea te warewaretia tō pūkete.",
    "forgetAccount.askAgain": "Tono anō",
    "forgetAccount.home": "Hoki ki {siteName}",

    "registrationsSuspended.title": "Kua whakatārewatia te rēhita i tēnei wā",
    "registrationsSuspended.explanation":
      "Kāore e taea te whakapā atu i tēnei wā ki tētahi ratonga e hiahiatia ana e te rēhita, nō reira kāore he tangata e taea te rēhita kia whakahoki kupu mai ra anō. Kāore he mea i tuhia e koe i penapenahia.",
    "registrationsSuspended.tryAgainLater":
      "Whakamātau anō i muri i tētahi wā. Kua whakamōhiotia te kaiwhakahaere pae.",
    "registrationsSuspended.home": "Hoki ki {siteName}",

    "signIn.title": "Takiuru",
    "signIn.emailAddress": "Wāhitau īmēra",
    "signIn.password": "Kupuhipa",
    "signIn.submit": "Takiuru",
    "signIn.forgotPassword": "Kua wareware koe ki tō kupuhipa?",
    "signIn.register": "Rēhita",
    "signIn.withGoogle": "Takiuru mā Google",
    "signIn.or": "rānei",
    "signIn.tryAgainLater":
      "He maha rawa ngā whakamātau i ēnei rā tata nei. Tatari mō te hāora, ka whakamātau anō.",

    "SignIn.Failed":
      "Kāore i tika te wāhitau īmēra, te kupuhipa rānei. Whakamātau anō.",

    "profile.title": "Kōtaha",
    "profile.name": "Ingoa:",
    "profile.emailAddress": "Wāhitau īmēra:",

    "changeName.title": "Whakarerekē ingoa",
    "changeName.name": "Ingoa",
    "changeName.submit": "Whakarerekē ingoa",

    "setPassword.title": "Tautuhia he kupuhipa",
    "setPassword.explanation":
      "Kāore he kupuhipa a tō pūkete: ka takiuru koe mā Google. Kia taea ai hoki te takiuru mā te kupuhipa, ka tukuna atu he hononga hei tautuhi i tētahi ki {emailAddress}.",
    "setPassword.submit": "Tukuna mai he hononga",
    "setPassword.sent.title": "Tirohia tō īmēra",
    "setPassword.sent.explanation":
      "Kua tukuna atu he hononga hei tautuhi i tētahi kupuhipa. He hāora te roa e mahi ai.",
    "setPassword.profile": "Hoki ki tō kōtaha",

    "changePassword.title": "Whakarerekē kupuhipa",
    "changePassword.currentPassword": "Kupuhipa o nāianei",
    "changePassword.password": "Kupuhipa hou",
    "changePassword.passwordConfirmation": "Whakaūngia te kupuhipa",
    "changePassword.forgotPassword": "Kua wareware koe ki tō kupuhipa?",
    "changePassword.submit": "Whakarerekē kupuhipa",
    "ChangePassword.WrongPassword": "Ehara tērā i tō kupuhipa.",

    "changeEmailAddress.title": "Whakarerekē wāhitau īmēra",
    "changeEmailAddress.emailAddress": "Wāhitau īmēra hou",
    "changeEmailAddress.currentPassword": "Kupuhipa o nāianei",
    "changeEmailAddress.submit": "Tukuna he hononga whakaū",
    "changeEmailAddress.sent.title": "Tirohia tō īmēra",
    "changeEmailAddress.sent.explanation":
      "Kua tukuna ki te wāhitau īmēra hou he hononga hei whakaū i te nuku. Whāia, ka takiuru ana koe, hei nuku i tō pūkete ki reira.",
    "changeEmailAddress.confirm.title": "Nukuna tō pūkete",
    "changeEmailAddress.confirm.explanation":
      "Ka nukuna tō pūkete ki {emailAddress}. Mai i tēnei wā ka takiuru koe mā taua wāhitau.",
    "changeEmailAddress.confirm.submit": "Nukuna taku pūkete",
    "changeEmailAddress.noLongerWorks.title": "Kua kore tēnei hononga e mahi",
    "changeEmailAddress.noLongerWorks.explanation":
      "Kua pau tōna wā, kua whakamahia kētia rānei, kāore rānei i tukuna mō te pūkete e takiuru ana koe. Tonoa anō mai i tō kōtaha.",
    "changeEmailAddress.taken.title": "Kāore tō pūkete i nukuna",
    "changeEmailAddress.profile": "Hoki ki tō kōtaha",
    "ChangeEmailAddress.WrongPassword": "Ehara tērā i tō kupuhipa.",
    "ChangeEmailAddress.Unchanged": "Kei tēnei wāhitau kē tō pūkete.",
    "ChangeEmailAddress.Taken":
      "He pūkete tō taua wāhitau īmēra kē, nō reira kāore e taea te nuku tō pūkete ki reira.",

    "confirmEmailAddress.title": "Whakaūngia tō wāhitau īmēra",
    "confirmEmailAddress.name": "Ingoa",
    "confirmEmailAddress.password": "Kupuhipa",
    "confirmEmailAddress.confirmPassword": "Whakaūngia te kupuhipa",
    "confirmEmailAddress.submit": "Whakaūngia taku wāhitau īmēra",
    "confirmEmailAddress.signIn": "Takiuru",
    "confirmEmailAddress.home": "Hoki ki {siteName}",
    "confirmEmailAddress.confirmed.title": "Kua whakaūngia tō wāhitau īmēra",
    "confirmEmailAddress.confirmed.explanation":
      "Kua rite tō pūkete. Takiuru mā te wāhitau īmēra me te kupuhipa i hoatu e koe inaianei.",
    "confirmEmailAddress.expired.title": "Kua pau te wā o taua hononga",
    "confirmEmailAddress.expired.explanation":
      "E 24 hāora te roa e mahi ai te hononga hei whakaū i tētahi wāhitau īmēra. Tonoa he hou, ā, ka tukuna ki taua wāhitau tonu.",
    "confirmEmailAddress.expired.newLink": "Tukuna mai he hononga hou",
    "confirmEmailAddress.noLongerWorks.title": "Kua kore taua hononga e mahi",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Tirohia i whāia e koe te hononga katoa o te īmēra, kāore he mea i ngaro i te pito. Mēnā kāore anō kia mahi, rēhita anō, ā, ka tukuna atu he hononga hou.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Kua oti kē te whakaū i taua wāhitau īmēra",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Kāore he mea hei mahi. Takiuru mā te kupuhipa i hoatu e koe i te wā i whakaū ai koe.",

    "PersonName.Missing": "Whakauruhia he ingoa.",
    "PersonName.TooShort": "Me 3 ngā pūāhua te iti rawa o te ingoa.",
    "PersonName.TooLong": "Kāore e neke i te 254 ngā pūāhua o te ingoa.",
    "WorldRankingName.TooShort":
      "Me 3 ngā pūāhua te iti rawa o te ingoa i te raupapa o te ao.",
    "WorldRankingName.TooLong":
      "Kāore e neke i te 254 ngā pūāhua o te ingoa i te raupapa o te ao.",
    "Password.Missing": "Whakauruhia he kupuhipa.",
    "Password.TooShort": "Me 12 ngā pūāhua te iti rawa o te kupuhipa.",
    "Password.ConfirmationDiffers":
      "Kāore i ōrite ki te kupuhipa i runga ake nei. Tuhia anō.",
    "Password.Breached":
      "Kua puta tēnei kupuhipa i tētahi pakarutanga raraunga i tētahi atu pae, nō reira kāore i te haumaru te whakamahi i konei. Kōwhiria tētahi atu.",

    "javaScriptRequired.title": "Me whai JavaScript",
    "javaScriptRequired.explanation":
      "Hei rēhita me whakahohe te JavaScript i tēnei pae, kia taea ai te whakaū he tangata te rēhita ana. Whakahohea, ā, rēhita anō.",
    "javaScriptRequired.register": "Hoki ki te rēhita",
    "javaScriptRequired.home": "Hoki ki {siteName}",

    "errors.backHome": "Hoki ki {siteName}",
    "errors.notFound": "Kāore i kitea",
    "errors.refused": "Kāore i taea te mahi",
    "errors.refusedDetail": "He hē tētahi mea i tukuna mai.",
    "errors.sorry": "Aroha mai",
    "errors.sorryDetail": "Kāore i taea te whakaoti taua tono.",
    "errors.failed": "I hē tētahi mea",
    "errors.reference": "Tohutoro {reference}.",
    "errors.recorded":
      "Kua tuhia te hapa, kua tukua hoki he īmēra ki te kaiwhakahaere. He āwhina mēnā ka tukua he īmēra ki te kaiwhakahaere me te tohutoro me te whakaahuatanga o tāu e mahi ana.",
    "errors.unavailable": "Kāore te pae e wātea ana",
    "errors.unavailableDetail":
      "Kāore e taea e te pae te whakapā atu ki ana mea e hiahiatia ana i tēnei wā. Tēnā koa, whakamātauria anō a muri ake.",
    "errors.maintenance": "Kei te whakahaeretia te pae mō te whakatika.",
    "errors.maintenanceMinutes":
      "E tūmanakohia ana kia hoki mai i roto i te {minutes} meneti.",
    "errors.maintenanceMinute":
      "E tūmanakohia ana kia hoki mai i roto i te 1 meneti.",
    "errors.maintenanceLonger":
      "Kei te roa ake i te mea i whakaarohia, ā, ka hoki mai a muri ake nei.",

    "home.recentResults": "Ngā hua tata nei",
    "home.recentResults.none":
      "Kāore he tākaro i tāpiritia i roto i ngā rā e whitu kua pahure.",
    "home.upcomingTournaments": "Ngā whakataetae e tū mai ana",
    "home.upcomingTournaments.none":
      "Kāore he whakataetae e tīmata ana i roto i ngā rā e ono tekau e tū mai nei.",
    "tournamentList.column.date": "Rā",
    "tournamentList.column.name": "Ingoa",
    "tournamentList.onlyIn": "Ngā whakataetae i {country} anake",
    "tournamentList.filter.country": "Whenua",
    "tournamentList.filter.anyCountry": "Whenua ahakoa",
    "tournamentList.filter.region": "Rohe",
    "tournamentList.filter.anyRegion": "Rohe ahakoa",
    "tournamentList.filter.sport": "Hākinakina",
    "tournamentList.filter.anySport": "Hākinakina ahakoa",
    "tournamentList.filter.submit": "Tātari",
    "home.allTournaments": "Ngā whakataetae katoa o {year}",
    "year.heading": "Ngā whakataetae o {year}",
    "year.none": "Kāore he whakataetae e tīmata ana i {year}.",
    "yearSport.heading": "Ngā whakataetae {sport} o {year}",
    "yearSport.none": "Kāore he whakataetae {sport} e tīmata ana i {year}.",
    "tournament.recent": "Tata nei",
    "tournament.summary": "Whakarāpopototanga",
    "test.bestOf": "Ko te pai rawa o te {count} ia tukinga.",
    "test.vs": "ki",
    "test.matches": "Ngā tukinga",
    "test.games": "Ngā tākaro",
    "test.hoops": "Ngā hupa",
    "teamSummary.tests": "Ngā Test",
    "teamSummary.matches": "Ngā tukinga",
    "teamSummary.games": "Ngā tākaro",
    "teamSummary.hoops": "Ngā hupa",
    "teamSummary.wins": "Ngā toa",
    "teamSummary.losses": "Ngā hinga",
    "teamSummary.draws": "Ngā taurite",
    "teamSummary.for": "Mō",
    "teamSummary.against": "Ki",
    "teamSummary.net": "Tapeke",
    "tournament.players": "Ngā kaitākaro",
    "search.label": "Rapua",
    "search.tournaments": "Ngā whakataetae nui",
    "search.competitions": "Ngā whakataetae",
    "search.nothingFound": "Kāore i kitea tētahi mea.",
    "players.search.label": "Rapua ngā kaitākaro",
    "players.search.prompt": "Patohia te ingoa o te kaitākaro hei kimi i a ia.",
    "players.search.none": "Kāore ngā kaitākaro i kitea.",
    "search.more":
      "Ko ngā {count} tuatahi anake e whakaatuhia ana. Tāpirihia ētahi atu o te ingoa hei whakatika i te rapunga.",
    "websitePlayer.tournament": "Whakataetae nui",
    "tournament.test": "{first} ki {second}",
    "tournament.notes": "Ngā tuhipoka",
    "tournament.commentary": "Ngā kōrero",
    "tournament.beat": "i toa i a",
    "tournament.drewWith": "i taurite ki a",
    "tournament.ago.seconds": "{count} hēkona",
    "tournament.ago.minutes": "{count} meneti",
    "tournament.ago.hour": "1 hāora",
    "tournament.ago.hours": "{count} hāora",
    "tournament.none": "Kāore anō kia tākarohia he tākaro.",
    "players.none": "Kāore anō kia tāpiritia he kaitākaro.",
    "commentaries.by": "nā",
    "commentaries.start": "Tīmata i tētahi kōrero hou",
    "commentaries.disclaimer.heading": "Whakatūpato",
    "commentaries.disclaimer":
      "Ko ngā whakaaro e whakapuakina ana i ēnei kōrero nā ō rātou kaituhi, ā, kāore pea e rite ana ki ērā a Tim Murphy, a {site} rānei.",
    "commentaries.guidelines.heading": "Ngā aratohu",
    "commentaries.guidelines.responsible": "Nāu anō te kawenga mō āu kōrero.",
    "commentaries.guidelines.purpose":
      'Hei kōrero i ngā mahi o te whakataetae ēnei kōrero. Ehara i te "pae pāpāho pāpori" hei tuku i ngā mihi, i ērā atu pēnei.',
    "commentaries.guidelines.hatred":
      "Kaua e tāngia he mea hei whakaoho i te tūkino, i te kino rānei ki tētahi atu. Kāore e whakaaetia ngā kōrero e whakaiti ana i ētahi atu mō tō rātou iwi, whakapono, taketake, ira tangata, pakeke, hauātanga hinengaro, tinana rānei, whakaaro ira tangata rānei.",
    "commentaries.guidelines.abuse":
      "Kāore e whakaaetia te tuku kupu taunu noa. Ko te ture whānui, me tākaro te poro, kaua te kaitākaro: arā, kaua e whakaeke ki tētahi tangata, engari me kōrero mō te take.",
    "commentaries.guidelines.unlawful":
      "Ka tangohia ngā kōrero e pīrangi ana te ture, pēnei i ngā takahi manatārua, i ngā mea e whakakino ana pea i te ingoa o tētahi.",
    "commentaries.guidelines.shouting":
      "Tēnā, kaua e whakamahi kupu kino, kaua hoki e tuhi i ngā kōrero katoa ki ngā pūmatua.",
    "commentaries.guidelines.selling":
      "Kaua e whakamahi i ngā kōrero hei hokohoko, hei spam rānei. Ka tangohia ngā kōrero e pānui ana, e whakatairanga ana, e tuku ana rānei i ngā taonga, i ngā ratonga rānei.",
    "commentaries.guidelines.links":
      "Tēnā, whakaititia ngā hononga i ngā kōrero. Ka tangohia ngā kōrero he hononga ki ngā mea kāore e tika.",
    "commentaries.guidelines.impersonating":
      "Kaua e whakaahua i ētahi atu i ngā kōrero, kaua hoki e tāngia he raraunga whaiaro – ngā nama waea, ngā wāhitau poutāpeta, ngā wāhitau īmēra rānei – tērā pea ka whakawehi i tētahi i te kore e mōhio.",
    "commentaries.reporting.heading": "Te pūrongo i ngā kōrero",
    "commentaries.reporting.before":
      "Tēnā, pūrongotia ngā kōrero kāore e rite ana ki ēnei aratohu ki",
    "commentaries.reporting.after":
      ". Whakahuatia te wāhitau paetukutuku me te kōrero e ātaahuatia ana. Hei tauira:",
    "commentaries.reporting.exampleComment": '"he kōrero me tango"',
    "commentaries.reporting.exampleReason":
      "Me tango tēnei kōrero nā te mea...",
    "commentaries.reporting.reviewed":
      "Ehara i te mea ka tangohia aunoatia te kōrero ina pūrongotia, engari ka arohia ngā pūrongo katoa.",
    "commentaries.reporting.reserved":
      "Kei a {site} te mana ki te tango kōrero.",
    "commentaries.reporting.subject": "{site} Pūrongo kōrero",
    "commentaries.reporting.body":
      "Tēnā, whakahuatia te wāhitau paetukutuku, te kōrero e ātaahuatia ana, me te take me tango.",
    "startCommentary.title": "Tīmata i tētahi kōrero hou",
    "startCommentary.titleField": "Taitara",
    "startCommentary.submit": "Tīmata i te kōrero",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Kāore anō ngā kaiwhakahaere kia tuhi tuhipoka.",
    "marks.new": "hou",
    "note.edited": "kua whakatikaina",
    "commentary.none": "Kāore anō kia tuhia he mea.",
    "commentary.edited": "kua whakatikaina",
    "commentary.edit": "Whakatika",
    "commentary.delete": "Muku",
    "commentary.comment": "Whakaaro",
    "commentary.add": "Tāpiri",
    "commentary.notSent":
      "Kāore i taea te tuku i te whakaaro. Uta anō te whārangi hei kite mēnā i penapenahia.",
    "changeCommentaryTitle.title": "Whakarerekē i te taitara",
    "changeCommentaryTitle.submit": "Penapena",
    "editComment.title": "Whakatika i te whakaaro",
    "editComment.save": "Penapena",
    "deleteComment.title": "Muku i te whakaaro",
    "deleteComment.question":
      "Mukua tēnei whakaaro? Kāore e taea te whakahoki.",
    "deleteComment.confirm": "Muku i te whakaaro",
    "deleteComment.keep": "Waiho",
    "player.games": "Ngā tākaro",
    "player.competitions": "Ngā tauwhāinga",
    "player.beat": "i toa i a",
    "player.lostTo": "i hinga ki a",
    "player.drewWith": "i taurite ki a",
    "player.score": "{score} ki {opponent}",
    "player.noGames": "Kāore anō kia tākarohia he tākaro.",
    "player.noCompetitions": "Kāore anō kia rēhitatia ki tētahi tauwhāinga.",
    "block.wins": "Ngā toa",
    "block.matches": "Ngā tukinga",
    "block.netGames": "Tapeke tākaro",
    "block.games": "Ngā tākaro",
    "block.netHoops": "Tapeke hupa",
    "block.won": "toa",
    "block.lost": "hinga",
    "block.drawn": "taurite",
    "block.withdrawn": "kua unuhia",
    "block.gameWithdrawn": "kua unuhia",
    "block.losses": "Ngā hinga",
    "competition.views": "Ngā tirohanga",
    "competition.view.grid": "Tūtohi",
    "competition.view.summary": "Whakarāpopototanga",
    "competition.view.orderOfPlay": "Raupapa tākaro",
    "blockSummary.ranking":
      "Kua raupapatia mā te ōwehenga o ngā tukinga i toa, ā, muri iho mā ngā hupa tapeke. Ka taea e ngā ture o tētahi whakataetae te raupapa i ana kaitākaro i tētahi atu huarahi.",
    "orderOfPlay.none": "Kāore anō kia tākarohia he tākaro.",
    "knockout.round.final": "Whakamutunga",
    "knockout.round.semis": "Haurua whakamutunga",
    "knockout.round.quarters": "Hauwhā whakamutunga",
    "knockout.round.number": "Rauna {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Ngā tākaro",
    "swiss.wins": "Ngā toa",
    "swiss.winShare": "% toa",
    "swiss.results": "Ngā hua",
    "knockout.onward": "Ngā rauna e whai ake nei",
    "knockout.back": "Ngā rauna o mua",
    "years.label": "Ngā tau",
    "years.earlier": "Ngā tau o mua",

    "admin.newerBuild.message": "He putanga hou ake o tēnei pae.",
    "admin.newerBuild.reload": "Uta anō",
    "admin.title": "Whakahaere",
    "admin.tournaments.new": "Whakataetae hou",
    "admin.tournaments.none": "Kāore he whakataetae",
    "admin.tournaments.archived": "Kua pūrangatia",
    "admin.tournaments.manage": "Whakahaere",
    "admin.tournaments.edit": "Whakatika",
    "admin.tournaments.archive": "Pūrangahia",
    "admin.tournaments.restore": "Whakahoki",
    "admin.tournaments.scores": "Ngā hua",
    "admin.tournaments.players": "Ngā kaitākaro",
    "admin.years.label": "Ngā tau",
    "admin.years.earlier": "Ngā tau o mua",
    "admin.tournament.name": "Ingoa",
    "admin.tournament.starts": "Te tīmata",
    "admin.tournament.finishes": "Te mutunga",
    "admin.tournament.format": "Hōputu",
    "admin.tournament.sport": "Hākinakina",
    "admin.tournament.country": "Whenua",
    "admin.tournament.region": "Rohe",
    "admin.tournament.subtitle": "Taitara iti",
    "admin.tournament.handicap": "Tākarohia ki te hanikapa",
    "admin.tournament.drawsAllowed": "Ka whakaaetia ngā taurite",
    "admin.tournament.levelTestsDrawn": "He taurite ngā Test ōrite",
    "admin.tournament.worldRankings": "Ka whakaarohia mō te raupapa o te ao",
    "admin.tournament.national": "Takunetanga ā-motu",
    "admin.tournament.international": "Takunetanga ā-ao",
    "admin.tournament.otherwise": "Kāore e taea te whakaae ki tēnei pēnei.",
    "admin.newTournament.title": "Whakataetae hou",
    "admin.newTournament.submit": "Waihanga whakataetae",
    "admin.editTournament.title": "Whakatika whakataetae",
    "admin.editTournament.submit": "Whakahou whakataetae",
    "admin.editTournament.otherwise":
      "Kāore e taea te whakarerekē i tēnei whakataetae.",
    "admin.view.tabs": "Whakataetae",
    "admin.view.players": "Ngā kaitākaro",
    "admin.view.competitions": "Ngā tauwhāinga",
    "admin.view.managers": "Ngā kaiwhakahaere",
    "admin.view.notes": "Ngā tuhipoka",
    "admin.view.scorers": "Ngā kaikaute",
    "admin.view.rankings": "Ngā raupapa",
    "admin.rankings.textFile":
      "Ka tukuna ngā otinga o te whakataetae ki te raupapa o te ao hei kōnae kuputuhi, ka tuhia e te pae mai i ngā tākaro kua uruhia.",
    "admin.rankings.spreadsheet":
      "Ka tukuna ngā otinga o te whakataetae ki te raupapa o te ao hei pepa tātai, ka tuhia e te pae mai i ngā tākaro kua uruhia.",
    "admin.rankings.fillInWinners":
      "Ka āhei noa te pae ki te whakaaro mā wai tētahi whakataetae i toa, nā reira arotakea te rārangi Winner o ia whakataetae i mua i te tuku i te kōnae.",
    "admin.rankings.fillInWinner":
      "Kāore e taea e te pae te mōhio mā wai te whakataetae i toa, nā reira whakaurua ki raro o te pepa tātai i mua i te tuku.",
    "admin.rankings.sendIt":
      "Ka tukuna te kōnae ki ngā āpiha o te raupapa o te ao.",
    "admin.rankings.download": "Tikiake i ngā raupapa",
    "rankings.notAvailable": "Kāore ngā raupapa e wātea",
    "rankings.notAvailable.sport":
      "Kāore he raupapa o te ao mō te hākinakina o tēnei whakataetae, nō reira kāore he raupapa hei tuku.",
    "rankings.notAvailable.handicap":
      "Ka tākarohia tēnei whakataetae me te haukape, nō reira kāore e whakaarohia mō te raupapa o te ao.",
    "rankings.notAvailable.drawnGames":
      "Ka whakaaetia ngā tākaro ōrite i tēnei whakataetae, nō reira kāore e whakaarohia mō te raupapa o te ao.",
    "rankings.notAvailable.notCounted":
      "Kua kī te kaiwhakahaere o tēnei whakataetae kāore e whakaarohia mō te raupapa o te ao.",
    "admin.view.otherwise":
      "Kāore e taea te whakahaere i tēnei whakataetae i konei.",
    "admin.competitionView.tabs": "Tauwhāinga",
    "admin.competitionView.players": "Ngā kaitākaro",
    "admin.competitionView.scores": "Ngā hua",
    "admin.sections.label": "Te whakataetae me ōna tauwhāinga",
    "admin.sections.tournament": "Whakataetae",
    "admin.administrator.sections.label": "Ngā whārangi a te kaiwhakahaere pae",
    "admin.administrator.sections.tournaments": "Ngā whakataetae",
    "admin.administrator.sections.accounts": "Ngā pūkete",
    "admin.administrator.sections.worldRankings": "Raupapa o te ao",
    "admin.administrator.sections.importErrors": "Ngā hapa kawemai",
    "admin.administrator.sections.logs": "Ngā Pūkete",
    "admin.administrator.title": "Kaiwhakahaere pae",
    "admin.accounts.title": "Ngā pūkete",
    "admin.roles.add": "Tāpiri",
    "admin.roles.administrator.heading": "Ngā kaiwhakahaere pae",
    "admin.roles.administrator.none": "Kāore he kaiwhakahaere pae kē atu",
    "admin.roles.administrator.removeTitle": "Tango kaiwhakahaere pae",
    "admin.roles.administrator.removeExplanation":
      "Ka kore a {name} e noho hei kaiwhakahaere pae mō tēnei pae.",
    "admin.roles.world-ranking-officer.heading":
      "Ngā kaiwhakahaere raupapa o te ao",
    "admin.roles.world-ranking-officer.none":
      "Kāore he kaiwhakahaere raupapa o te ao",
    "admin.roles.world-ranking-officer.removeTitle":
      "Tango kaiwhakahaere raupapa o te ao",
    "admin.roles.world-ranking-officer.removeExplanation":
      "Ka kore a {name} e noho hei kaiwhakahaere raupapa o te ao.",
    "admin.worldRankings.title": "Kawemai i ngā kaitākaro o te raupapa o te ao",
    "admin.worldRankings.import": "Kawemai",
    "admin.worldRankings.log": "Te haere o te kawemai",
    "admin.worldRankings.ac.reading":
      "E pānui ana i te rārangi croquet association",
    "admin.worldRankings.ac.read":
      "Ngā kaitākaro croquet association kua pānuitia: {players}",
    "admin.worldRankings.ac.kept":
      "Ngā kaitākaro croquet association kua penapenahia: {players}",
    "admin.worldRankings.ac.refused":
      "Kāore i taea te pānui i te rārangi croquet association, nō reira kua waihotia ōna kaitākaro pēnei i mua.",
    "admin.worldRankings.gc.reading": "E pānui ana i te rārangi golf croquet",
    "admin.worldRankings.gc.read":
      "Ngā kaitākaro golf croquet kua pānuitia: {players}",
    "admin.worldRankings.gc.kept":
      "Ngā kaitākaro golf croquet kua penapenahia: {players}",
    "admin.worldRankings.gc.refused":
      "Kāore i taea te pānui i te rārangi golf croquet, nō reira kua waihotia ōna kaitākaro pēnei i mua.",
    "admin.worldRankings.finished": "Kua oti",
    "admin.worldRankings.failed": "Kāore i oti te kawemai.",
    "admin.worldRankings.otherwise": "I hē tētahi mea i te pae.",
    "WorldRankingLists.Unreachable":
      "Kāore i taea te whakapā atu ki te pae raupapa o te ao.",
    "WorldRankingLists.Unreadable":
      "Kāore te rārangi i te āhua o ngā rārangi raupapa o te ao: kāore i taea te pānui i tētahi rārangi, kāore he tangata, kāore rānei i tuhia ki te UTF-8.",
    "admin.importErrors.title": "Ngā hapa kawemai",
    "admin.importErrors.none": "Kāore he hapa kawemai",
    "admin.importErrors.otherwise": "I hē tētahi mea i te pae.",
    "admin.logs.title": "Ngā Pūkete",
    "admin.logs.severity": "Taumahatanga",
    "admin.logs.text": "Rapua",
    "admin.logs.show": "Whakaaturia",
    "admin.logs.prune": "Whakakorea",
    "admin.logs.pruneAsk":
      "Tangohia te pūkete i mua i te haora whakamutunga? Kāore he mea e whakahoki mai.",
    "admin.logs.removed": "{count} ngā urunga i tangohia",
    "admin.logs.none": "Karekau he urunga pūkete",
    "admin.logs.otherwise": "I hē tētahi mea i te pae.",
    "admin.hover.logs.show": "Whakaaturia ngā urunga e ōrite ana",
    "admin.hover.logs.prune":
      "Tangohia te pūkete i mua i te haora whakamutunga",
    "admin.hover.logs.pruneAgree":
      "Tangohia te pūkete i mua i te haora whakamutunga",
    "admin.importError.title": "Hapa kawemai",
    "admin.importError.documentId": "Id tuhinga",
    "admin.importError.tournament": "Whakataetae",
    "admin.importError.competition": "Tauwhāinga",
    "admin.importError.newSite": "Pae hou",
    "admin.importError.oldSite": "Pae tawhito",
    "ImportErrorKept.NotFound":
      "Kāore te kawemai i penapena i tētahi hapa mō taua tuhinga.",
    "admin.competitionView.otherwise":
      "Kāore e taea te whakahaere i tēnei tauwhāinga i konei.",
    "admin.competitions.block": "Poraka",
    "admin.competitions.knockout": "Whakawātea",
    "admin.competitions.swiss": "Swiss",
    "admin.competitions.view": "Titiro",
    "admin.competitions.edit": "Whakatika",
    "admin.competitions.up": "Piki",
    "admin.competitions.down": "Heke",
    "admin.competitions.archive": "Pūrangahia",
    "admin.competitions.restore": "Whakahoki",
    "admin.competitions.archived": "Ngā tauwhāinga kua pūrangatia",
    "admin.competitions.none": "Kāore he tauwhāinga",
    "admin.competitions.add": "Tāpiri tauwhāinga",
    // The competition dialog.
    "admin.competition.addTitle": "Tāpiri tauwhāinga",
    "admin.competition.editTitle": "Whakatika tauwhāinga",
    "admin.competition.name": "Ingoa",
    "admin.competition.kind": "Momo",
    "admin.competition.bestOf": "Te pai rawa o te",
    "admin.competition.rounds": "Ngā rauna",
    "admin.competition.places": "Ngā tūnga",
    "admin.competition.round": "Rauna {number}",
    "admin.competition.bestOfs": "Te pai rawa o te",
    "admin.competition.quarters": "Hauwhā",
    "admin.competition.semis": "Haurua",
    "admin.competition.final": "Whakamutunga",
    "admin.competition.add": "Tāpiri",
    "admin.competition.save": "Penapena",
    "admin.competition.added": "Kua tāpiritia a {name}.",
    "admin.competition.otherwise":
      "Kāore e taea te penapena i tēnei tauwhāinga pēnei.",
    "CompetitionName.Missing": "Whakauruhia he ingoa.",
    "CompetitionName.TooLong": "Kāore e neke i te 254 ngā pūāhua o te ingoa.",
    "CompetitionName.NoLetterOrDigit": "Me whai pūrei, tau rānei te ingoa.",
    "Tournament.KnockoutPlayerHasGames":
      "He tukinga ā ētahi kaitākaro o tēnei tūtohi, nō reira kāore e taea te whakarerekē i ō rātou tūnga.",
    "Tournament.CompetitionNameTaken":
      "Kei tētahi atu tauwhāinga o tēnei whakataetae taua ingoa kē.",
    "BestOf.NotWhole": "Whakauruhia he tau katoa o ngā tākaro.",
    "BestOf.TooSmall":
      "Me kotahi te iti rawa o ngā tākaro i te pai rawa o tētahi tukinga.",
    "Rounds.NotWhole": "Whakauruhia he tau tōpū o ngā rauna.",
    "Rounds.TooSmall":
      "Me kotahi te iti rawa o ngā rauna hei tākaro mō tētahi poraka.",
    "KnockoutDraw.EvenBestOf":
      "Me whai toa tētahi tukinga whakawātea, nō reira ko te pai rawa o tētahi tau kāore e wehea ki te rua o ngā tākaro.",
    "admin.hover.tournaments.new": "Waihangatia he whakataetae hou",
    "admin.hover.tournaments.manage":
      "Whakahaerehia ngā kaitākaro, ngā kapa, ngā tauwhāinga me ngā hua o tēnei whakataetae",
    "admin.hover.tournaments.edit":
      "Whakarerekētia ngā taipitopito o tēnei whakataetae",
    "admin.hover.tournaments.scores": "Whakauruhia ngā hua o tēnei whakataetae",
    "admin.hover.tournaments.players":
      "Tiakina ngā kaitākaro o tēnei whakataetae",
    "admin.hover.competitions.view":
      "Whakatuwheratia tēnei tauwhāinga hei kite, hei whakauru i ōna kaitākaro me ōna hua",
    "admin.hover.tests.view":
      "Whakatuwheratia tēnei Test hei kite, hei whakauru i ōna hua",
    "admin.hover.teams.view":
      "Whakatuwheratia tēnei kapa hei kite, hei whakahaere i ōna kaitākaro",
    "admin.hover.dialog.player.add":
      "Tāpiria tēnei kaitākaro ki te whakataetae",
    "admin.hover.dialog.player.save":
      "Penapenahia ngā huringa o tēnei kaitākaro",
    "admin.hover.dialog.team.add": "Tāpiria tēnei kapa ki te whakataetae",
    "admin.hover.dialog.team.save": "Penapenahia ngā huringa o tēnei kapa",
    "admin.hover.dialog.test.add": "Tāpiria tēnei Test ki te whakataetae",
    "admin.hover.dialog.test.save": "Penapenahia ngā huringa o tēnei Test",
    "admin.hover.dialog.competition.add":
      "Tāpiria tēnei tauwhāinga ki te whakataetae",
    "admin.hover.dialog.competition.save":
      "Penapenahia ngā huringa o tēnei tauwhāinga",
    "admin.hover.dialog.score.add": "Tāpiria tēnei hua ki te tauwhāinga",
    "admin.hover.dialog.score.save": "Penapenahia te whakatika o tēnei hua",
    "admin.hover.dialog.carryForward.save":
      "Kawea whakamua ngā hua o tēnei kaitākaro",
    "admin.hover.dialog.tournament.new": "Waihangatia tēnei whakataetae",
    "admin.hover.dialog.tournament.edit":
      "Penapenahia ngā huringa o tēnei whakataetae",
    "admin.hover.modal.cancel": "Kati i tēnei me te kore penapena i tētahi mea",
    "admin.hover.modal.ok": "Katia tēnei kōrero",
    "admin.hover.tab": "Whakaaturia te ripa {name}",
    "admin.hover.tournaments.archive":
      "Pūrangahia tēnei whakataetae; ka taea te whakahoki",
    "admin.hover.tournaments.restore":
      "Whakahokia mai tēnei whakataetae kua pūrangatia",
    "admin.hover.players.add": "Tāpiria he kaitākaro ki tēnei whakataetae",
    "admin.hover.players.edit":
      "Whakarerekētia ngā taipitopito o tēnei kaitākaro",
    "admin.hover.players.up": "Hapainga tēnei kaitākaro i te rārangi",
    "admin.hover.players.down": "Whakahekea tēnei kaitākaro i te rārangi",
    "admin.hover.players.archive":
      "Pūrangahia tēnei kaitākaro; ka taea te whakahoki",
    "admin.hover.players.restore":
      "Whakahokia mai tēnei kaitākaro kua pūrangatia",
    "admin.hover.teams.add": "Tāpiria he kapa ki tēnei whakataetae",
    "admin.hover.teams.edit": "Whakarerekētia ngā taipitopito o tēnei kapa",
    "admin.hover.teams.up": "Hapainga tēnei kapa i te rārangi",
    "admin.hover.teams.down": "Whakahekea tēnei kapa i te rārangi",
    "admin.hover.teams.archive": "Pūrangahia tēnei kapa; ka taea te whakahoki",
    "admin.hover.teams.restore": "Whakahokia mai tēnei kapa kua pūrangatia",
    "admin.hover.competitions.add":
      "Tāpiria he tauwhāinga ki tēnei whakataetae",
    "admin.hover.competitions.edit":
      "Whakarerekētia ngā taipitopito o tēnei tauwhāinga",
    "admin.hover.competitions.up": "Hapainga tēnei tauwhāinga i te rārangi",
    "admin.hover.competitions.down": "Whakahekea tēnei tauwhāinga i te rārangi",
    "admin.hover.competitions.archive":
      "Pūrangahia tēnei tauwhāinga; ka taea te whakahoki",
    "admin.hover.competitions.restore":
      "Whakahokia mai tēnei tauwhāinga kua pūrangatia",
    "admin.hover.tests.add": "Tāpiria he Test i waenganui i ngā kapa e rua",
    "admin.hover.tests.edit": "Whakarerekētia ngā taipitopito o tēnei Test",
    "admin.hover.tests.up": "Hapainga tēnei Test i te rārangi",
    "admin.hover.tests.down": "Whakahekea tēnei Test i te rārangi",
    "admin.hover.tests.archive": "Pūrangahia tēnei Test; ka taea te whakahoki",
    "admin.hover.tests.restore": "Whakahokia mai tēnei Test kua pūrangatia",
    "admin.hover.tests.toTeams":
      "Haere ki te ripa Ngā kapa hei tāpiri i ngā kapa e hiahiatia ana e tētahi Test",
    "admin.hover.scores.add":
      "Tāpiria te hua o tētahi tukinga ki tēnei tauwhāinga",
    "admin.hover.scores.edit": "Whakatikaina tēnei hua",
    "admin.hover.scores.archive":
      "Pūrangahia tēnei hua kia kore ai e kaute; ka taea te whakahoki",
    "admin.hover.scores.restore":
      "Whakahokia mai tēnei hua kua pūrangatia, kia kaute anō ai",
    "admin.hover.scores.withdraw":
      "Waihotia tēnei hua ki te rārangi engari kaua e kaute",
    "admin.hover.scores.unwithdraw":
      "Meinga kia kaute anō tēnei hua kua unuhia",
    "admin.hover.scores.up": "Nukuna tēnei hua ki mua i te rārangi",
    "admin.hover.scores.down": "Nukuna tēnei hua ki muri i te rārangi",
    "admin.hover.competitionPlayers.add":
      "Whakaurua te kaitākaro kua kōwhiria ki tēnei tauwhāinga",
    "admin.hover.competitionPlayers.up":
      "Hapainga tēnei kaitākaro i te rārangi",
    "admin.hover.competitionPlayers.down":
      "Whakahekea tēnei kaitākaro i te rārangi",
    "admin.hover.competitionPlayers.remove":
      "Tangohia tēnei kaitākaro i te tauwhāinga",
    "admin.hover.competitionPlayers.withdraw":
      "Unuhia tēnei kaitākaro i te tauwhāinga",
    "admin.hover.competitionPlayers.unwithdraw":
      "Whakahokia tēnei kaitākaro kua unuhia ki te tauwhāinga",
    "admin.hover.competitionPlayers.carryForward":
      "Kawea mai ngā hua o tēnei kaitākaro i tētahi atu tauwhāinga",
    "admin.hover.notes.add": "Tuhia he tuhipoka hou mō tēnei whakataetae",
    "admin.hover.notes.edit": "Whakarerekētia tēnei tuhipoka",
    "admin.hover.notes.delete": "Mukua tēnei tuhipoka",
    "admin.hover.note.add":
      "Penapenahia tēnei tuhipoka, ka tāpiri ki te whakataetae",
    "admin.hover.note.save": "Penapenahia ngā huringa o tēnei tuhipoka",
    "admin.hover.people.add": "Hoatu te tūranga ki tēnei tangata",
    "admin.hover.people.remove": "Tangohia te tūranga i tēnei tangata",
    "admin.hover.worldRankings.import":
      "Tikina ngā raupapa o te ao, ka tāpiri i ō rātou kaitākaro",
    "admin.modal.cancel": "Whakakore",
    "admin.modal.ok": "Pai",
    "admin.people.emailAddress": "Wāhitau īmēra",
    "admin.people.remove": "Tango",
    "admin.people.otherwise": "Kāore i taea te mahi.",
    "admin.managers.you": "Koe",
    "admin.managers.add": "Tāpiri kaiwhakahaere",
    "admin.managers.none": "Kāore he kaiwhakahaere",
    "admin.managers.removeTitle": "Tango kaiwhakahaere",
    "admin.managers.removeExplanation":
      "Ka kore a {name} e taea te whakahaere i tēnei whakataetae.",
    "admin.managers.removeYourself.explanation":
      "Ka kore koe e taea te whakahaere i tēnei whakataetae, ā, kāore he tangata i konei e taea te whakahoki mōu. Ka taea e tētahi atu kaiwhakahaere te meinga anō koe hei kaiwhakahaere.",
    "admin.managers.otherwise":
      "Kāore e taea te meinga taua wāhitau hei kaiwhakahaere.",
    "admin.competitionPlayers.add": "Tāpiri kaitākaro",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Kāore e taea te tāpiri i tēnei kaitākaro.",
    "admin.competitionPlayers.choose": "Te kaitākaro hei tāpiri",
    "admin.competitionPlayers.nobody": "Kōwhiria he kaitākaro",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Kei te tauwhāinga ngā kaitākaro katoa",
    "admin.competitionPlayers.none": "Kāore he kaitākaro",
    "admin.competitionPlayers.up": "Piki",
    "admin.competitionPlayers.down": "Heke",
    "admin.competitionPlayers.remove": "Tango",
    "admin.competitionPlayers.withdraw": "Unuhia",
    "admin.competitionPlayers.unwithdraw": "Whakakore i te unuhanga",
    "admin.competitionPlayers.withdrawn": "Ngā kaitākaro kua unuhia",
    "admin.competitionPlayers.removeTitle": "Tango kaitākaro",
    "admin.competitionPlayers.removeQuestion":
      "Ka tangohia a {name} i te tauwhāinga. Kāore e taea te whakahoki.",
    "admin.competitionPlayers.withdrawTitle": "Unuhia te kaitākaro",
    "admin.competitionPlayers.withdrawQuestion":
      "Ka kore a {name} e tākaro anō i te tauwhāinga, ā, ka whakatauhia ngā tākaro kāore anō kia tākarohia me te kore ia.",
    "admin.competitionPlayers.carryForward": "Kawe whakamua",
    "admin.carryForward.title": "Kawe whakamua - {name}",
    "admin.carryForward.save": "Penapena",
    "admin.carryForward.otherwise":
      "Kāore e taea te penapena i tēnei kawe whakamua.",
    "admin.carryForward.matchWins": "Ngā tukinga i toa",
    "admin.carryForward.matchLosses": "Ngā tukinga i hinga",
    "admin.carryForward.gameWins": "Ngā tākaro i toa",
    "admin.carryForward.gameLosses": "Ngā tākaro i hinga",
    "admin.carryForward.hoopsFor": "Ngā hupa mō",
    "admin.carryForward.hoopsAgainst": "Ngā hupa ki",
    "CarryForward.MatchWinsNotWhole": "Tuhia he tau katoa o ngā tukinga i toa.",
    "CarryForward.MatchWinsBelowZero":
      "Tuhia te 0 neke atu rānei o ngā tukinga i toa.",
    "CarryForward.MatchLossesNotWhole":
      "Tuhia he tau katoa o ngā tukinga i hinga.",
    "CarryForward.MatchLossesBelowZero":
      "Tuhia te 0 neke atu rānei o ngā tukinga i hinga.",
    "CarryForward.GameWinsNotWhole": "Tuhia he tau katoa o ngā tākaro i toa.",
    "CarryForward.GameWinsBelowZero":
      "Tuhia te 0 neke atu rānei o ngā tākaro i toa.",
    "CarryForward.GameLossesNotWhole":
      "Tuhia he tau katoa o ngā tākaro i hinga.",
    "CarryForward.GameLossesBelowZero":
      "Tuhia te 0 neke atu rānei o ngā tākaro i hinga.",
    "CarryForward.HoopsForNotWhole": "Tuhia he tau katoa o ngā hupa mō.",
    "CarryForward.HoopsForBelowZero":
      "Tuhia te 0 neke atu rānei o ngā hupa mō.",
    "CarryForward.HoopsAgainstNotWhole": "Tuhia he tau katoa o ngā hupa ki.",
    "CarryForward.HoopsAgainstBelowZero":
      "Tuhia te 0 neke atu rānei o ngā hupa ki.",
    "admin.scores.add": "Tāpiri hua",
    "admin.scores.none": "Kāore he hua",
    "admin.scores.edit": "Whakatika",
    "admin.scores.drawNotFilledTitle": "Kāore anō kia kī te tūtohi",
    "admin.scores.archive": "Pūrangahia",
    "admin.scores.up": "Piki",
    "admin.scores.down": "Heke",
    "admin.scores.restore": "Whakahoki",
    "admin.scores.archived": "Ngā hua kua pūrangatia",
    "admin.scores.archivedSaid": "Kua pūrangatia",
    "admin.scores.withdraw": "Unuhia",
    "admin.scores.unwithdraw": "Whakakore i te unuhanga",
    "admin.scores.withdrawnSaid": "Kua unuhia",
    "admin.scores.otherwise": "Kāore i taea te mahi.",
    "admin.score.title": "Tāpiri hua",
    "admin.score.add": "Tāpiri tākaro",
    "admin.score.winner": "Te toa",
    "admin.score.winnerScore": "Ngā tohu a te toa",
    "admin.score.loser": "Te hinga",
    "admin.score.loserScore": "Ngā tohu a te hinga",
    "admin.score.beat": "i toa i a",
    "admin.score.added":
      "Kua tāpiritia te tākaro i toa ai a {winner} i a {loser}.",
    "admin.score.otherwise": "Kāore i taea te tāpiri i te tākaro.",
    "admin.score.correctTitle": "Whakatika hua",
    "admin.score.save": "Penapena",
    "admin.score.notCorrected": "Kāore i taea te whakatika i te hua.",
    "Game.WinnerMissing": "Kōwhiria te toa.",
    "Game.WinnerScoreMissing": "Tuhia ngā tohu a te toa.",
    "Game.LoserMissing": "Kōwhiria te hinga.",
    "Game.LoserScoreMissing": "Tuhia ngā tohu a te hinga.",
    "Score.NoPoints": "Ka tīmata ngā tohu ki tētahi tau.",
    "Game.SamePlayer": "Kāore he tangata e tākaro ana ki a ia anō.",
    "Game.WinnerNotAhead":
      "Me nui ake ngā tohu a te toa i ērā a te hinga, me tohua rānei hei toa.",
    "Game.LoserMarked": "Kāore e taea te tohu i ngā tohu a te hinga hei toa.",
    "Game.ResultChanged":
      "Ka puritia te hua i te whakatika: he toa tonu te tākaro i toa, he taurite tonu te tākaro i taurite.",
    "Competition.MatchDecided": "Kua whakatauhia kētia tā rāua tukinga.",
    "Competition.DrawFull":
      "Kāore e taea te tāpiri i te kaitākaro nā te mea kua kī te tūtohi.",
    "Competition.DrawNotFilled":
      "Kāore e taea te tāpiri hua kia whai kaitākaro, kia whai Bye rānei ia tūranga o te tūtohi.",
    "Competition.ByeOutsideKnockout": "Ko te whakawātea anake e whai Bye ai.",
    "Competition.NotDrawnToMeet":
      "Kāore rāua i tohaina kia tākaro ki a rāua anō.",
    "Competition.WinnerHasPlayedOn":
      "Kua tākaro kētia te toa o tēnei tukinga i tāna tukinga e whai ake nei, nō reira kāore e taea te whakarerekē ko wai te toa.",
    "CompetitionPlayer.Withdrawn":
      "Kāore te kaitākaro kua unuhia e tākaro anō.",
    "admin.players.add": "Tāpiri kaitākaro",
    "admin.players.none": "Kāore he kaitākaro",
    "admin.players.edit": "Whakatika",
    "admin.players.archive": "Pūrangahia",
    "admin.players.restore": "Whakahoki",
    "admin.players.up": "Piki",
    "admin.players.down": "Heke",
    "admin.players.archiveTitle": "Pūrangahia te kaitākaro",
    "admin.players.archiveQuestion": "Ka tangohia a {name} i ēnei tauwhāinga:",
    "admin.players.archive.explanation":
      "Ina whakahokia te kaitākaro, kāore ia e hoki ki ēnei tauwhāinga.",
    "admin.players.archived": "Ngā kaitākaro kua pūrangatia",
    "admin.players.archivedSaid": "Kua pūrangatia",
    "admin.player.addTitle": "Tāpiri kaitākaro",
    "admin.player.editTitle": "Whakatika kaitākaro",
    "admin.player.name": "Ingoa",
    "admin.player.representing": "E tohu ana i a",
    "admin.player.worldRankingName": "Ingoa i te raupapa o te ao",
    "admin.player.worldRankingKnown":
      "E mōhio ana te raupapa o te ao ki tēnei ingoa.",
    "admin.player.worldRankingQuestioned":
      "Kāore he kaitākaro o te raupapa o te ao i whai i tēnei ingoa. Akene he hapa te tuhi, he hou rānei te kaitākaro ki te raupapa.",
    "admin.player.flag": "Haki",
    "admin.player.add": "Tāpiri",
    "admin.player.save": "Penapena",
    "admin.player.added": "Kua tāpiritia a {name}.",
    "admin.player.otherwise":
      "Kāore e taea te penapena i tēnei kaitākaro pēnei.",
    "Tournament.PlayerNameTaken":
      "Kei tētahi atu kaitākaro o tēnei whakataetae taua ingoa kē.",
    "TournamentPlayer.NoSuchFlag": "Kōwhiria tētahi o ngā haki e wātea ana.",
    "TournamentPlayer.NamedBye": "Kāore e taea te whakaingoa kaitākaro ko Bye.",
    "TournamentPlayer.NoLetterOrDigit": "Me whai pūrei, tau rānei te ingoa.",
    "admin.player.byesTitle": "Kāore ngā Bye e tāpiritia",
    "admin.player.byes":
      "Ehara te Bye i te kaitākaro o te whakataetae. Ka tukuna e te whakawātea he Bye ina tāpiritia ōna kaitākaro, kia rite ki te maha e hiahiatia ana e tōna tūtohi.",
    "admin.view.teams": "Ngā kapa",
    "admin.view.tests": "Ngā Test",
    "admin.teams.add": "Tāpiri kapa",
    "admin.teams.none": "Kāore he kapa",
    "admin.teams.edit": "Whakatika",
    "admin.teams.view": "Titiro",
    "admin.teams.archive": "Pūrangahia",
    "admin.teams.restore": "Whakahoki",
    "admin.teams.up": "Piki",
    "admin.teams.down": "Heke",
    "admin.teams.archived": "Ngā kapa kua pūrangatia",
    "admin.teams.archivedSaid": "Kua pūrangatia",
    "admin.team.addTitle": "Tāpiri kapa",
    "admin.team.editTitle": "Whakatika kapa",
    "admin.team.name": "Ingoa",
    "admin.team.shortName": "Ingoa poto",
    "admin.team.shortName.explanation":
      "Te ingoa e whakaingoatia ai ngā Test a te kapa, pēnei i a AUS v ENG.",
    "admin.team.flag": "Haki",
    "admin.team.add": "Tāpiri",
    "admin.team.save": "Penapena",
    "admin.team.added": "Kua tāpiritia a {name}.",
    "admin.team.otherwise": "Kāore e taea te penapena i tēnei kapa pēnei.",
    "admin.teamView.otherwise": "Kāore e taea te titiro i tēnei kapa i konei.",
    "admin.teamView.players": "Ngā kaitākaro",
    "TeamName.Missing": "Whakaingoatia te kapa.",
    "TeamName.TooLong": "He roa rawa taua ingoa.",
    "admin.notes.add": "Tāpiri tuhipoka",
    "admin.notes.none": "Kāore he tuhipoka",
    "admin.notes.edit": "Whakatika",
    "admin.notes.delete": "Muku",
    "admin.notes.deleteTitle": "Muku tuhipoka",
    "admin.notes.deleteQuestion": "Mukua te tuhipoka «{title}»?",
    "admin.notes.delete.explanation":
      "Ka ngaro tonu atu te tuhipoka kua mukua, ā, kāore e taea te whakahoki.",
    "admin.notes.otherwise": "Kāore i taea te mahi.",
    "admin.note.addTitle": "Tāpiri tuhipoka",
    "admin.note.editTitle": "Whakatika tuhipoka",
    "admin.note.title": "Taitara",
    "admin.note.description": "Whakaahuatanga",
    "admin.note.write": "Tuhi",
    "admin.note.preview": "Arokite",
    "admin.note.toolbar": "Hōputu",
    "admin.note.tool.heading": "Pane",
    "admin.note.tool.bold": "Rarahi",
    "admin.note.tool.italic": "Tītaha",
    "admin.note.tool.quote": "Kupu tāpiri",
    "admin.note.tool.code": "Waehere",
    "admin.note.tool.link": "Hononga",
    "admin.note.tool.numberedList": "Rārangi tau",
    "admin.note.tool.bulletedList": "Rārangi kōpae",
    "admin.note.tool.taskList": "Rārangi mahi",
    "admin.note.add": "Tāpiri",
    "admin.note.save": "Penapena",
    "admin.note.otherwise": "Kāore e taea te penapena i tēnei tuhipoka pēnei.",
    "ManagerNoteTitle.Missing": "Hoatu he taitara ki te tuhipoka.",
    "ManagerNoteTitle.TooLong": "He roa rawa taua taitara.",
    "ManagerNoteTitle.NoLetterOrDigit": "Me whai pūrei, tau rānei te taitara.",
    "ManagerNoteDescription.TooLong": "He roa rawa taua whakaahuatanga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Kua kore taua tuhipoka. Akene nā tētahi atu kaiwhakahaere i muku.",
    "EditManagerNote.NoSuchManagerNote":
      "Kua kore taua tuhipoka. Akene nā tētahi atu kaiwhakahaere i muku.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Kua kore taua tuhipoka. Akene nā tētahi atu kaiwhakahaere i muku.",
    "ManagerNote.Deleted":
      "Kua mukua taua tuhipoka. Akene nā tētahi atu kaiwhakahaere i muku.",
    "CommentaryTitle.Missing": "Hoatu he taitara ki te kōrero.",
    "CommentaryTitle.TooLong": "He roa rawa taua taitara.",
    "CommentaryTitle.NoLetterOrDigit": "Me whai pūrei, tau rānei te taitara.",
    "Commentary.TitleTaken": "Kei tētahi atu kōrero taua taitara kē.",
    "CommentText.Missing": "Tuhia tētahi mea ki te whakaaro.",
    "CommentText.TooLong": "He roa rawa taua whakaaro.",
    "TeamShortName.Missing": "Hoatu he ingoa poto ki te kapa.",
    "TeamShortName.TooLong": "Kāore e neke i te 10 ngā pūāhua o te ingoa poto.",
    "TeamShortName.NoLetterOrDigit": "Me whai pūrei, tau rānei te ingoa poto.",
    "Team.ShortNameLongerThanName":
      "Kāore e roa ake te ingoa poto i te ingoa o te kapa.",
    "Team.NoSuchFlag": "Kōwhiria tētahi o ngā haki e wātea ana.",
    "Team.Archived": "Kua pūrangatia taua kapa, ā, me whakahoki tuatahi.",
    "Team.InATest":
      "Kei tētahi Test taua kapa e tākaro ana, nō reira kāore e taea te pūranga.",
    "Team.PlayerNameTaken":
      "Kei tētahi atu kaitākaro o tēnei kapa taua ingoa kē.",
    "TeamPlayer.NamedBye": "Kāore e taea te whakaingoa kaitākaro ko Bye.",
    "TeamPlayer.Archived":
      "Kua pūrangatia taua kaitākaro, ā, me whakahoki tuatahi.",
    "TeamPlayer.HasGames":
      "Kua tākaro taua kaitākaro, nō reira kāore e taea te pūranga.",
    "Tournament.TeamNameTaken":
      "Kei tētahi atu kapa o tēnei whakataetae taua ingoa kē.",
    "Tournament.TeamShortNameTaken":
      "Kei tētahi atu kapa o tēnei whakataetae taua ingoa poto kē.",
    "Tournament.NoSuchTeam":
      "Kāore he kapa a tēnei whakataetae i tēnei wāhitau.",
    "Tournament.TeamArchived":
      "Kua pūrangatia tēnei kapa, ā, ka taea anake te whakahoki mai i te ripa Ngā kapa.",
    "admin.tests.add": "Tāpiri Test",
    "admin.tests.none": "Kāore he Test",
    "admin.tests.edit": "Whakatika",
    "admin.tests.view": "Titiro",
    "admin.tests.archive": "Pūrangahia",
    "admin.tests.restore": "Whakahoki",
    "admin.tests.up": "Piki",
    "admin.tests.down": "Heke",
    "admin.tests.archived": "Ngā Test kua pūrangatia",
    "admin.tests.twoTeamsNeeded":
      "He Test i waenganui i ngā kapa e rua, nō reira me rua ngā kapa i te tuatahi.",
    "admin.tests.toTeams": "Haere ki Ngā kapa",
    "admin.tests.matches.one": "{count} tukinga",
    "admin.tests.matches.other": "{count} tukinga",
    "admin.tests.bestOf": "te pai rawa o te {games}",
    "admin.tests.otherwise": "Kāore i taea te mahi.",
    "admin.test.addTitle": "Tāpiri Test",
    "admin.test.editTitle": "Whakatika Test",
    "admin.test.firstTeam": "Kapa A",
    "admin.test.secondTeam": "Kapa B",
    "admin.test.versus": "v",
    "admin.test.starts": "Te tīmata",
    "admin.test.finishes": "Te mutunga",
    "admin.test.expectedMatches": "Ngā tukinga e tūmanakohia ana",
    "admin.test.bestOf": "Te pai rawa o te",
    "admin.test.group": "Rōpū",
    "admin.test.add": "Tāpiri",
    "admin.test.save": "Penapena",
    "admin.test.added": "Kua tāpiritia a {name}.",
    "admin.test.otherwise": "Kāore e taea te penapena i tēnei Test pēnei.",
    "admin.testView.otherwise": "Kāore e taea te titiro i tēnei Test i konei.",
    "AddTest.FirstTeamMissing": "Kōwhiria te kapa tuatahi.",
    "AddTest.SecondTeamMissing": "Kōwhiria te kapa tuarua.",
    "UpdateTest.FirstTeamMissing": "Kōwhiria te kapa tuatahi.",
    "UpdateTest.SecondTeamMissing": "Kōwhiria te kapa tuarua.",
    "ExpectedMatches.NotWhole": "Tuhia he tau katoa o ngā tukinga.",
    "ExpectedMatches.TooSmall":
      "Me kotahi te iti rawa o ngā tukinga e tūmanakohia ana mō tētahi Test.",
    "TestGroup.TooLong": "He roa rawa taua rōpū.",
    "Tournament.TestAgainstItself":
      "Kāore te kapa e tākaro i tētahi Test ki a ia anō.",
    "Tournament.TestFinishesBeforeStarts":
      "Kāore e taea e tētahi Test te mutu i mua i tōna tīmatanga.",
    "Tournament.TestStartsBeforeTournament":
      "Kāore e taea e tētahi Test te tīmata i mua i tōna whakataetae.",
    "Tournament.TestFinishesAfterTournament":
      "Kāore e taea e tētahi Test te mutu i muri i tōna whakataetae.",
    "Tournament.TestHasGamesInUse":
      "He tākaro tō tēnei Test, nō reira kāore e taea te pūranga kia pūrangatia ērā.",
    "Tournament.TestHasGames":
      "He tākaro tō tēnei Test kētia, nō reira kāore e taea anō te whakarerekē i ōna kapa.",
    "Tournament.ExpectedMatchesBelowStarted":
      "He maha ake ngā tukinga kua tīmata i ērā.",
    "Tournament.BestOfBelowGamesPlayed":
      "He maha ake ngā tākaro kua tākarohia e ngā kaitākaro e rua i ērā.",
    "Competition.ExpectedMatchesReached":
      "Kua tīmata kētia e tēnei Test ngā tukinga katoa e tūmanakohia ana mōna.",
    "Competition.SameTeam":
      "Kāore ngā kaitākaro e rua o te kapa kotahi e tākaro ki a rāua anō.",
    "AddManager.NoSuchAccount":
      "Kāore he pūkete a taua wāhitau e taea ai te meinga hei kaiwhakahaere.",
    "Account.NotAnAdministrator":
      "Ko te kaiwhakahaere pae anake e taea ai tērā.",
    "AddRole.NoSuchAccount":
      "Kāore he pūkete a taua wāhitau e taea ai te hoatu i te tūranga.",
    "AddRole.NoSuchRole": "Kāore taua tūranga.",
    "RemoveRole.NoSuchAccount": "Kāore taua pūkete.",
    "RemoveRole.NoSuchRole": "Kāore taua tūranga.",
    "RemoveRole.Yourself":
      "Kāore e taea e koe te tango i tō anō tūranga kaiwhakahaere pae.",
    "AccountsWithRole.NoSuchRole": "Kāore taua tūranga.",
    "admin.scorers.add": "Tāpiri kaikaute",
    "admin.scorers.none": "Kāore he kaikaute",
    "admin.scorers.removeTitle": "Tango kaikaute",
    "admin.scorers.removeExplanation":
      "Ka kore a {name} e taea te tuhi i ngā hua o tēnei whakataetae.",
    "admin.scorers.otherwise":
      "Kāore e taea te meinga taua wāhitau hei kaikaute.",
    "AddScorer.NoSuchAccount":
      "Kāore he pūkete a taua wāhitau e taea ai te meinga hei kaikaute.",
    "Tournament.AlreadyAManager":
      "Kei te whakahaere kē taua pūkete i te whakataetae, ā, ka taea e ia ngā mea katoa e taea ana e te kaikaute.",

    "TournamentName.Missing": "Whakaingoatia te whakataetae.",
    "TournamentName.TooShort": "He poto rawa taua ingoa.",
    "TournamentName.TooLong": "He roa rawa taua ingoa.",
    "TournamentName.AllLowerCase":
      "Kāore te ingoa e tuhia ki ngā pūriki anake.",
    "TournamentName.AllCapitals":
      "Kāore te ingoa e tuhia ki ngā pūmatua anake.",
    "TournamentName.NoLetterOrDigit": "Me whai pūrei, tau rānei te ingoa.",
    "ReadOnlyDate.Unreadable": "Hoatu te rā.",
    "Tournament.FinishesBeforeStarts":
      "Kāore e taea e tētahi whakataetae te mutu i mua i tōna tīmatanga.",
    "Tournament.StartsAfterNextYear":
      "Kāore e taea e tētahi whakataetae te tīmata i muri i te tau e haere mai nei.",
    "Tournament.FinishesAfterNextYear":
      "Kāore e taea e tētahi whakataetae te mutu i muri i te tau e haere mai nei.",
    "CreateTournament.NoSuchCountry": "Kōwhiria te whenua.",
    "TournamentSubtitle.TooLong":
      "Kāore e neke i te 2000 ngā pūāhua o te taitara iti.",
    "Tournament.NotAManager":
      "Ko te kaiwhakahaere o tēnei whakataetae anake e taea ai te whakarerekē.",
    "Tournament.NotAManagerOrScorer":
      "Ko te kaiwhakahaere, te kaikaute rānei o tēnei whakataetae anake e taea ai te titiro.",
    "Tournament.Archived":
      "Kua pūrangatia tēnei whakataetae, ā, me whakahoki i mua i te whakarerekē.",
    "UpdateTournament.NoSuchTournament":
      "Kāore he whakataetae i tēnei wāhitau.",

    // The sports keep the names their players use in te reo Māori, which are
    // the English ones, and the formats named for a competition keep its
    // name, as a name is not translated.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Paerewa",
    "format.teams": "Ā-kapa",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Anorra",
    "country.ae": "Ngā Emiriti Arapi Kotahi",
    "country.af": "Āwhekenetāna",
    "country.ag": "Anitikua me Pāpura",
    "country.ai": "Ānguira",
    "country.al": "Āpania",
    "country.am": "Āmenia",
    "country.ao": "Angora",
    "country.ar": "Āketina",
    "country.as": "Hāmoa Amerika",
    "country.at": "Ahitereia",
    "country.au": "Ahitereiria",
    "country.aw": "Aruba",
    "country.ax": "Ngā Moutere o Ōrana",
    "country.az": "Atapaihānia",
    "country.ba": "Pōhia me Herekōwina",
    "country.bb": "Pāpatohe",
    "country.bd": "Pākaratēhi",
    "country.be": "Pērihi",
    "country.bf": "Pākina Fahō",
    "country.bg": "Purukāria",
    "country.bh": "Pāreina",
    "country.bi": "Puruniti",
    "country.bj": "Penina",
    "country.bm": "Pāmura",
    "country.bn": "Poronai",
    "country.bo": "Poriwia",
    "country.br": "Parīhi",
    "country.bs": "Pahama",
    "country.bt": "Pūtāne",
    "country.bv": "Te Moutere o Pōwhete",
    "country.bw": "Poriwana",
    "country.by": "Pērara",
    "country.bz": "Perihi",
    "country.ca": "Kānata",
    "country.catalonia": "Katarōnia",
    "country.cc": "Ngā Moutere Kokoh",
    "country.cd": "Te Tōrangapū Manapori o Kōngo",
    "country.cf": "Te Tōrangapū o Āwherika Waenga",
    "country.cg": "Te Tōrangapū o Kōngo",
    "country.ch": "Huiterangi",
    "country.ci": "Te Takutai Aivori",
    "country.ck": "Kūki Airani",
    "country.cl": "Hiri",
    "country.cm": "Kamarūna",
    "country.cn": "Haina",
    "country.co": "Kolomōpia",
    "country.cr": "Kōhita Rika",
    "country.cu": "Kiupa",
    "country.cv": "Te Kūrae Matomato",
    "country.cx": "Te Moutere Kirihimete",
    "country.cy": "Haipara",
    "country.cz": "Tiekia",
    "country.de": "Tiamana",
    "country.dj": "Tipūti",
    "country.dk": "Tenemāka",
    "country.dm": "Tominika",
    "country.do": "Te Tōrangapū o Tominika",
    "country.dz": "Aratiria",
    "country.ec": "Ekuatoa",
    "country.ee": "Ehetōnia",
    "country.eg": "Īhipa",
    "country.eh": "Hahāra ki te Uru",
    "country.england": "Ingarangi",
    "country.er": "Eritēria",
    "country.es": "Pāniora",
    "country.et": "Etiopia",
    "country.fi": "Whinarana",
    "country.fj": "Whītī",
    "country.fk": "Ngā Moutere o Falkland",
    "country.fm": "Mikironīhia",
    "country.fo": "Ngā Moutere Wharo",
    "country.fr": "Wīwī",
    "country.ga": "Kāpona",
    "country.gb": "Te Kīngitanga Whakakotahi",
    "country.gd": "Kerenāta",
    "country.ge": "Hōria",
    "country.gf": "Kaiana Wīwī",
    "country.gh": "Kāna",
    "country.gi": "Hiparata",
    "country.gl": "Kirinirangi",
    "country.gm": "Kamopia",
    "country.gn": "Kini",
    "country.gp": "Kuaterupe",
    "country.gq": "Kini Ekuatoria",
    "country.gr": "Kirihi",
    "country.gs": "Hōria ki te Tonga me Ngā Moutere Hanawiti ki te Tonga",
    "country.gt": "Kuatamāra",
    "country.gu": "Kuama",
    "country.gw": "Kini-Pihao",
    "country.gy": "Kaiana",
    "country.hk": "Hongipua",
    "country.hm": "Ngā Moutere Heard me McDonald",
    "country.hn": "Honurahi",
    "country.hr": "Koroātia",
    "country.ht": "Haiti",
    "country.hu": "Hanekari",
    "country.id": "Initonīhia",
    "country.ie": "Airangi",
    "country.il": "Iharaira",
    "country.im": "Te Moutere o Man",
    "country.in": "Īnia",
    "country.io": "Te Rohe o Ingarangi i te Moana Īnia",
    "country.iq": "Irāki",
    "country.ir": "Irāna",
    "country.is": "Aihirana",
    "country.it": "Itāria",
    "country.je": "Hōti",
    "country.jm": "Hemeika",
    "country.jo": "Hōtana",
    "country.jp": "Hapani",
    "country.ke": "Kenia",
    "country.kg": "Kirikitāna",
    "country.kh": "Kamapōtia",
    "country.ki": "Kiribati",
    "country.km": "Komoro",
    "country.kn": "Hato Kiti me Newhi",
    "country.kp": "Kōrea ki te Raki",
    "country.kr": "Kōrea ki te Tonga",
    "country.kw": "Kuwaiti",
    "country.ky": "Ngā Moutere Keimana",
    "country.kz": "Kahahatāna",
    "country.la": "Rāoho",
    "country.lb": "Repanona",
    "country.lc": "Hato Ruhia",
    "country.li": "Rihitenetini",
    "country.lk": "Hiri Rānka",
    "country.lr": "Raipīria",
    "country.ls": "Teroto",
    "country.lt": "Rituānia",
    "country.lu": "Rakahimipeka",
    "country.lv": "Ratawia",
    "country.ly": "Ripia",
    "country.ma": "Moroko",
    "country.mc": "Monako",
    "country.md": "Moratawia",
    "country.me": "Monetenīkara",
    "country.mg": "Madakāhika",
    "country.mh": "Ngā Moutere Mahara",
    "country.mk": "Makerōnia ki te Raki",
    "country.ml": "Māri",
    "country.mm": "Mianima",
    "country.mn": "Mōngōria",
    "country.mo": "Makau",
    "country.mp": "Ngā Moutere Mariana ki te Raki",
    "country.mq": "Matiniki",
    "country.mr": "Mauritānia",
    "country.ms": "Monatarāta",
    "country.mt": "Mārata",
    "country.mu": "Mōrihi",
    "country.mv": "Maratiwi",
    "country.mw": "Marāwi",
    "country.mx": "Mēhiko",
    "country.my": "Mareia",
    "country.mz": "Mohapiki",
    "country.na": "Namipia",
    "country.nc": "Nūkarētōnia",
    "country.ne": "Ngāika",
    "country.nf": "Te Moutere Norfolk",
    "country.ng": "Ngāitiria",
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
    "country.pg": "Papua Niu Kini",
    "country.ph": "Piripīni",
    "country.pk": "Pakitāne",
    "country.pl": "Pōrana",
    "country.pm": "Hato Piere me Mikerona",
    "country.pn": "Pitikeane",
    "country.pr": "Puerto Riko",
    "country.ps": "Parihitini",
    "country.pt": "Pōtukara",
    "country.pw": "Parau",
    "country.py": "Parakai",
    "country.qa": "Katā",
    "country.re": "Reūnio",
    "country.ro": "Romeinia",
    "country.rs": "Herepia",
    "country.ru": "Rūhia",
    "country.rw": "Rowanda",
    "country.sa": "Hauri Arabia",
    "country.sb": "Ngā Moutere o Horomona",
    "country.sc": "Heihere",
    "country.scotland": "Kotirana",
    "country.sd": "Hūtāne",
    "country.se": "Huitene",
    "country.sg": "Hingapoa",
    "country.sh": "Hato Hērena",
    "country.si": "Horowinia",
    "country.sj": "Whapāra me Iana Maiene",
    "country.sk": "Horowākia",
    "country.sl": "Hiera Rione",
    "country.sm": "Hato Marino",
    "country.sn": "Henekara",
    "country.so": "Hūmārie",
    "country.sr": "Hurināme",
    "country.st": "Hato Tomo me Pirinihipi",
    "country.sv": "Hāwhatoa",
    "country.sy": "Hiria",
    "country.sz": "Ehuatini",
    "country.tc": "Ngā Moutere Turks me Caicos",
    "country.td": "Tāti",
    "country.tf": "Ngā Rohe ki te Tonga o Wīwī",
    "country.tg": "Toko",
    "country.th": "Tairana",
    "country.tj": "Tājikitāna",
    "country.tk": "Tokelau",
    "country.tl": "Timor Rāwhiti",
    "country.tm": "Tākamenitāna",
    "country.tn": "Tūnihia",
    "country.to": "Tonga",
    "country.tr": "Tākei",
    "country.tt": "Tirinaki me Tōpako",
    "country.tv": "Tūwaru",
    "country.tw": "Taiwana",
    "country.tz": "Tānahānia",
    "country.ua": "Ukareina",
    "country.ug": "Ukāna",
    "country.um": "Ngā Moutere Iti o Amerika",
    "country.us": "Amerika",
    "country.uy": "Urukoi",
    "country.uz": "Uhipeketāna",
    "country.va": "Wātikana",
    "country.vc": "Hato Wānihēta me ngā Kerenātini",
    "country.ve": "Penehuera",
    "country.vg": "Ngā Moutere Wākini o Piritānia",
    "country.vi": "Ngā Moutere Wākini o Amerika",
    "country.vn": "Whitināmu",
    "country.vu": "Wanuatu",
    "country.wales": "Waero",
    "country.wf": "Warihi me Whutuna",
    "country.ws": "Hāmoa",
    "country.ye": "Emene",
    "country.yt": "Maioto",
    "country.za": "Āwherika ki te Tonga",
    "country.zm": "Hāmipia",
    "country.zw": "Timipapuwe",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject": "Whakaūngia tō wāhitau īmēra mō {siteName}",
    "Email.ConfirmAddress.body": `
<p>Tēnā koe:</p>

<p>
    Mauruuru mō te waihanga i tētahi pūkete ki <strong>{siteName}</strong>.<br />
    I mua i te tīmata ki te whakamahi i tō pūkete, whakaūngia tō wāhitau īmēra
    mā te pēhi i te pātene i raro nei:
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
    Mēnā kāore te pātene e mahi, ka taea hoki e koe te whakaū i tō wāhitau īmēra mā te whakatuwhera i tēnei hononga i tō pūtirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Mēnā kāore koe i waihanga i tēnei pūkete, ka taea noa te whakahore i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "He hononga hou hei whakaū i tō wāhitau īmēra mō {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Tēnā koe:</p>

<p>
    I tono koe i tērā rā tata nei i tētahi īmēra hou hei whakaū i tō wāhitau īmēra mō <strong>{siteName}</strong>.<br />
    Whakaūngia tō wāhitau īmēra mā te pēhi i te pātene i raro nei:
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
    Mēnā kāore te pātene e mahi, ka taea hoki e koe te whakaū i tō wāhitau īmēra mā te whakatuwhera i tēnei hononga i tō pūtirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ina oti te whakaū, ka taea e koe te whakamahi tonu i tō pūkete me te kore haukotinga.
</p>

<p>
    Mēnā kāore koe i tono i tēnei īmēra, ka taea noa te whakahore.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "I whakamātau tētahi ki te rēhita mā tō wāhitau īmēra",
    "Email.AlreadyRegistered.body": `
<p>Tēnā koe:</p>

<p>
    I whakamātau tētahi ki te rēhita ki <strong>{siteName}</strong> mā tēnei
    wāhitau īmēra, he pūkete tō reira kētia. Kāore he mea i rerekē i tō
    pūkete.<br />
    Mēnā nāu tēnei, he pūkete tāu kētia, ā, ka taea e koe te takiuru ki reira:
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
    Mēnā kua wareware koe ki tō kupuhipa, ka taea e koe te tautuhi anō i konei:
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
        Kua wareware ki taku kupuhipa
    </a>
</p>

<p>
    Mēnā ehara i a koe tēnei, kāore he mea hei mahi mōu. Kāore he tangata i whai
    huarahi ki tō pūkete.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Whakaūngia te nuku o tō pūkete {siteName} ki tēnei wāhitau",
    "Email.ConfirmNewEmailAddress.body": `
<p>Tēnā koe:</p>

<p>
    Kua tono tētahi kua takiuru ki tētahi pūkete <strong>{siteName}</strong>
    kia nukuna taua pūkete ki tēnei wāhitau īmēra. Mēnā nāu tēnei,
    whakaūngia i konei, ka takiuru ana koe ki taua pūkete. E 24 hāora te roa
    e mahi ai te hononga.
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
        Nukuna taku pūkete
    </a>
</p>

<p>
    Tāruatia rānei tēnei wāhitau ki tō pūtirotiro:<br />
    {link}
</p>

<p>
    Mēnā ehara i a koe tēnei, kāore he mea hei mahi mōu. Kāore he pūkete e nukuna ki konei.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "I tono tētahi kia nukuna he pūkete ki tō wāhitau īmēra",
    "Email.AlreadyHasAnAccount.body": `
<p>Tēnā koe:</p>

<p>
    Kua tono tētahi kua takiuru ki tētahi pūkete <strong>{siteName}</strong>
    kia nukuna taua pūkete ki tēnei wāhitau īmēra, he pūkete tō reira
    kētia. Kāore he mea i nukuna, ā, kāore he mea i rerekē i tō pūkete.
</p>

<p>
    Mēnā nāu tēnei, he pūkete tāu kētia i tēnei wāhitau, ā, ka taea e koe te
    takiuru ki reira.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Kua nukuna tō pūkete {siteName}",
    "Email.EmailAddressChanged.body": `
<p>Tēnā koe:</p>

<p>
    Kua nukuna tō pūkete <strong>{siteName}</strong> ki tētahi atu
    wāhitau īmēra, ki {emailAddress}, ā, mai i tēnei wā ka takiuru mā taua
    wāhitau.
</p>

<p>
    Mēnā ehara i a koe tēnei, kei tētahi atu tangata tō pūkete. Whakahokia mai
    tēnei īmēra, ka kōrero mai ki a mātou.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Kua whakarerekētia tō kupuhipa {siteName}",
    "Email.PasswordChanged.body": `
<p>Tēnā koe:</p>

<p>
    Kua whakarerekētia tō kupuhipa mō tō pūkete <strong>{siteName}</strong>,
    ā, kua takiputa i ētahi atu pūtirotiro katoa i takiuru ai.<br />
    Mēnā nāu tēnei, kāore he mea hei mahi mōu.
</p>

<p>
    Mēnā ehara i a koe tēnei, kei tētahi atu tangata tō kupuhipa. Tautuhia he
    kupuhipa hou i konei, ā, ka takiputa ia:
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
        Kua wareware ki taku kupuhipa
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Tautuhia he kupuhipa hou mō {siteName}",
    "Email.SetNewPassword.body": `
<p>Tēnā koe:</p>

<p>
    I tono koe i tērā rā tata nei kia tautuhia anō tō kupuhipa <strong>{siteName}</strong>.<br />
    Ka taea e koe te tautuhi anō mā te pēhi i te pātene i raro nei:
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
    Mēnā kāore te pātene e mahi, ka taea hoki e koe te tautuhi anō i tō kupuhipa mā te whakatuwhera i tēnei hononga i tō pūtirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Mēnā kāore koe i tono kia tautuhia anō tō kupuhipa, ka taea noa te whakahore i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Tautuhia he kupuhipa mō {siteName}",
    "Email.SetPassword.body": `
<p>Tēnā koe:</p>

<p>
    Kāore he kupuhipa a tō pūkete <strong>{siteName}</strong>: ka takiuru koe mā Google.<br />
    I tono koe kia tautuhia tētahi, kia taea ai hoki te takiuru mā tō wāhitau īmēra me tētahi kupuhipa.
    Ka taea e koe te tautuhi mā te pēhi i te pātene i raro nei:
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
    Mēnā kāore te pātene e mahi, ka taea hoki e koe te tautuhi i tō kupuhipa mā te whakatuwhera i tēnei hononga i tō pūtirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    He hāora te roa e mahi ai te hononga. Mēnā kāore koe i tono kia tautuhia he kupuhipa, ka taea noa te whakahore i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Kāore he pūkete {siteName} mō tēnei wāhitau īmēra",
    "Email.RegisterInstead.body": `
<p>Tēnā koe:</p>

<p>
    I tonoa he tautuhi anō i te kupuhipa mō tētahi wāhitau īmēra kāore
    e hono ana ki tētahi pūkete <strong>{siteName}</strong>.
</p>

<p>
    Mēnā e hiahia ana koe ki te whakamahi i a mātou ratonga, ka taea e koe te waihanga i tētahi pūkete hou i konei:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Mēnā kāore koe i tono i tēnei, ka taea noa te whakahore i tēnei īmēra.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Whakaūngia e hiahia ana koe kia warewaretia tō pūkete {siteName}",
    "Email.ConfirmForgetting.body": `
<p>Tēnā koe:</p>

<p>
    I tono koe kia warewaretia tō pūkete <strong>{siteName}</strong>.<br />
    Whāia te pātene i raro nei hei kite he aha te tikanga, ā, hei whakaū
    haumaru ko tēnā tāu e hiahia ana:
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
    Mēnā kāore te pātene e mahi, ka taea hoki e koe te whakatuwhera i tēnei hononga i tō pūtirotiro:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ina warewaretia, kāore he tangata e kite anō i tō ingoa, i tō wāhitau
    īmēra rānei, ā, kāore e taea te takiuru ki tō pūkete. Kāore e taea te
    whakahoki.
</p>

<p>
    Kotahi anake te wā e mahi ai te hononga, tae noa ki te 15 meneti i muri i tō
    tono, ā, i te wā anake e takiuru ana koe ki tēnei pūkete. Whai muri, tonoa
    anō mai i tō pūkete.
</p>

<p>
    Mēnā ehara nāu i tono, kāore he mea e puta mēnā ka kore tētahi e whai i te
    hononga. Heoi anō, nā tētahi kua takiuru ki tō pūkete i tono, nō reira
    tautuhia he kupuhipa hou mai i te whārangi kupuhipa kua wareware kia
    mōhio ai koe kāore ia e taea te takiuru anō.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Kua whakatārewatia te rēhita: kāore e taea te whakapā atu ki a {service}",
    "Email.RegistrationsSuspended.body": `
<p>Tēnā koe:</p>

<p>
    Kāore a {siteName} i taea te whakapā atu ki a {service} i te {when}. Kia
    whakahoki kupu mai ra anō ia, ka whakamōhiotia ngā tangata e hiahia ana
    ki te rēhita, ki te tautuhi rānei i tētahi kupuhipa hou, kia whakamātau anō a
    muri ake nei.
</p>

<p>
    Kāore he mea hei whakawātea. Ia whakamātau ka pātai anō ki a {service}, ā, ka
    mahi anō ngā whārangi ina whakahoki kupu mai ia.
</p>

<p>
    I te wā e kore tonu ana a {service} e whakahoki kupu, kotahi anake te īmēra mō
    tēnei ia hāora ka tae atu ki a koe.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "Kāore e taea e {siteName} te whakapā atu ki tāna pātengi raraunga",
    "Email.DatabaseUnreachable.body": `
<p>Tēnā koe:</p>

<p>
    Kāore i taea e {siteName} te whakapā atu ki tāna pātengi raraunga i {when}. Kia tae rā anō ki tana whakautu, ka kī ia whārangi e hiahia ana ki a ia ki ngā kaipānui kāore te pae e wātea ana, me whakamātau anō a muri ake.
</p>

<p>
    Kāore he mea hei tuku. Ia tono, ka tono anō i tētahi hononga, ā, ka mahi anō te pae i te wā ka whakautu te pātengi raraunga.
</p>

<p>
    I te wā e kore ana te pātengi raraunga, ka whiwhi īmēra koe mō tēnei kia kotahi noa iho i ia {minutes} meneti.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "I rahua te {siteName} i tētahi tono",
    "Email.UnhandledError.body": `
<p>Tēnā koe:</p>

<p>
    I rahua te {siteName} i {when} i tētahi tono mō {asked}. I whakaaturia ki te kaipānui te tohutoro {reference}, ā, kei raro i tērā te take i te rārangi tuhinga.
</p>

<p>
    He maha ngā wā ka rahua ia tono ina pakaru te pae, nō reira e tae mai ana he īmēra mō ngā rahunga kia 4 anake i ia haora. Ko ērā atu kei te rārangi tuhinga tonu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
