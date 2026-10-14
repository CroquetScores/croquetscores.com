// The site's words in Welsh. Keyed as the English catalogue is, which is what
// a word missing here falls back to.
//
// Written to the reader as chi rather than ti: chi is what Welsh websites,
// software and public bodies use to a reader they do not know, and it is right
// for the plural as well as the singular, so the same line serves a person
// signing in and a manager speaking of the players. The English it is written
// from is plain and direct, and chi keeps that without sounding curt. Commands
// are the chi form (Rhowch, Dewiswch), as Welsh instructions are, while menus,
// buttons and headings use the verbal noun (Cofrestru, Newid enw), and are
// written in sentence case, as Welsh writes them, where the English
// capitalises each word.
import type { Language } from "../common/language.js";

export const welsh: Language = {
  tag: "cy",
  name: "Cymraeg",
  words: {
    "site.skipToContent": "Neidio i'r cynnwys",
    "navigation.menu": "Dewislen",
    "navigation.label": "Prif",
    "navigation.home": "Hafan",
    "navigation.help": "Cymorth",
    "navigation.admin": "Gweinyddu",
    "sections.label": "Adrannau",
    "theme.label": "Thema",
    "theme.light": "Golau",
    "theme.dark": "Tywyll",
    "theme.system": "System",
    "footer.donate": "Rhoi",
    "footer.plea":
      "Ydych chi'n mwynhau {siteName}? Rhowch rodd i helpu i'w ddatblygu ymhellach.",
    "footer.copyright": "© Hawlfraint {years}, {owner}",
    "footer.privacy": "Preifatrwydd",
    "beta.banner":
      "Gwefan beta yw hon. Gall data gael ei ailosod ar unrhyw adeg.",
    "privacy.contact":
      "Cwestiynau am y dudalen hon, neu am yr hyn a gedwir amdanoch chi: {emailAddress}",
    "tryWebsite.banner":
      "Mae hwn yn lle diogel i ddysgu {siteName}. Gellir dileu popeth a roddwch yma ar unrhyw adeg.",

    "language.label": "Iaith",
    "language.choose": "Newid",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Mae rhywbeth newydd i'w ddarllen.",
    "whatsNew.admin.message":
      "Mae rhywbeth newydd i bobl sy'n rhedeg twrnameintiau.",
    "whatsNew.view": "Gweld beth sy'n newydd",
    "whatsNew.later": "Atgoffa fi y tro nesaf",
    "whatsNew.never": "Peidio byth â dangos y neges hon",

    "form.otherwise":
      "Mae rhywbeth o'i le. Gwiriwch yr hyn a roesoch a rhowch gynnig arall arni.",

    "account.menu": "Cyfrif",
    "account.register": "Cofrestru",
    "account.signIn": "Mewngofnodi",
    "account.forgotPassword": "Rwyf wedi anghofio fy nghyfrinair",
    "account.signOut": "Allgofnodi",
    "account.profile": "Proffil",
    "account.changePassword": "Newid cyfrinair",
    "account.changeEmailAddress": "Newid cyfeiriad e-bost",
    "account.changeName": "Newid enw",
    "account.setPassword": "Gosod cyfrinair",
    "account.forgetAccount": "Anghofio'r cyfrif",

    "register.title": "Cofrestru",
    "register.emailAddress": "Cyfeiriad e-bost",
    "register.submit": "Cofrestru",
    "register.withGoogle": "Cofrestru gyda Google",
    "register.or": "neu",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Nid yw Google wedi cadarnhau bod y cyfeiriad e-bost hwnnw'n eiddo i chi, felly ni ellir ei ddefnyddio yma gyda Google. Defnyddiwch eich cyfeiriad e-bost isod.",
    "SignInWithGoogle.LinkedToAnother":
      "Mae gan y cyfeiriad e-bost hwnnw gyfrif eisoes, sydd wedi'i gysylltu â chyfrif Google gwahanol. Mewngofnodwch gyda'r cyfrif Google hwnnw, neu gyda'ch cyfeiriad e-bost a'ch cyfrinair.",
    "SignInWithGoogle.NameMissing":
      "Nid yw Google wedi dweud eich enw wrthym, ac mae angen un ar gyfrif. Defnyddiwch eich cyfeiriad e-bost isod.",
    "Google.Unreachable":
      "Ni ellid cysylltu â Google ar hyn o bryd. Rhowch gynnig arall arni ymhen ychydig funudau, neu defnyddiwch eich cyfeiriad e-bost isod.",
    "Registration.NotAPerson":
      "Nid oedd hyn i'w weld yn dod gan berson. Rhowch gynnig arall arni ac, os bydd yn digwydd eto, arhoswch ychydig funudau a dewch yn ôl.",

    "EmailAddress.Missing": "Rhowch gyfeiriad e-bost.",
    "EmailAddress.NoAt": "Mae @ mewn cyfeiriad e-bost.",
    "EmailAddress.MoreThanOneAt": "Mae un @ yn unig mewn cyfeiriad e-bost.",
    "EmailAddress.NoDomain":
      "Mae parth ar ôl yr @ mewn cyfeiriad e-bost, fel example.com.",

    "welcome.title": "Gwiriwch eich e-byst",
    "welcome.checkEmail":
      "Rydym wedi anfon e-bost i'r cyfeiriad a roesoch. Dilynwch y ddolen sydd ynddo i fynd yn eich blaen.",
    "welcome.nothingArrived":
      "Os na ddaw dim ymhen ychydig funudau, edrychwch yn eich ffolder sbam neu e-bost diangen.",
    "welcome.home": "Yn ôl i {siteName}",
    "newConfirmationLink.title": "Gofynnwch am ddolen newydd",
    "newConfirmationLink.explanation":
      "Mae'r ddolen i gadarnhau eich cyfeiriad e-bost wedi dod i ben. Gofynnwch am un newydd a chaiff ei hanfon i'r cyfeiriad y gwnaethoch gofrestru ag ef.",
    "newConfirmationLink.send": "Anfonwch ddolen newydd ataf",
    "newConfirmationLink.home": "Yn ôl i {siteName}",
    "newConfirmationLink.signIn": "Mewngofnodi",
    "newConfirmationLink.sent.title": "Gwiriwch eich e-byst",
    "newConfirmationLink.sent.explanation":
      "Rydym wedi anfon dolen newydd atoch. Dilynwch hi i gadarnhau eich cyfeiriad e-bost. Os na ddaw dim ymhen ychydig funudau, edrychwch yn eich ffolder sbam neu e-bost diangen.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Mae'r cyfeiriad e-bost hwnnw eisoes wedi'i gadarnhau",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Nid oes dim ar ôl i'w gadarnhau. Mewngofnodwch gyda'r cyfrinair a roesoch wrth ei gadarnhau.",
    "newConfirmationLink.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio bellach",
    "newConfirmationLink.noLongerWorks.explanation":
      "Gwiriwch eich bod wedi dilyn y ddolen gyfan o'r e-bost, heb i ddim fod ar goll ar y diwedd. Os na fydd yn gweithio o hyd, cofrestrwch eto a chaiff dolen newydd ei hanfon atoch.",
    "newConfirmationLink.tooMany.title": "Rhowch gynnig arall arni nes ymlaen",
    "newConfirmationLink.tooMany.explanation":
      "Anfonwyd sawl dolen i'r cyfeiriad hwn yn ddiweddar. Arhoswch awr a gofynnwch eto, ac yn y cyfamser edrychwch yn eich ffolder sbam neu e-bost diangen.",

    "forgotPassword.title": "Wedi anghofio eich cyfrinair?",
    "forgotPassword.emailAddress": "Cyfeiriad e-bost",
    "forgotPassword.submit": "Anfonwch ffordd ataf i fynd yn ôl i mewn",
    "forgotPassword.home": "Yn ôl i {siteName}",
    "forgotPassword.sent.title": "Gwiriwch eich e-byst",
    "forgotPassword.sent.explanation":
      "Os oes gan y cyfeiriad hwnnw gyfrif, rydym wedi anfon dolen atoch i osod cyfrinair newydd. Dilynwch hi cyn pen awr. Os na ddaw dim ymhen ychydig funudau, edrychwch yn eich ffolder sbam neu e-bost diangen.",
    "forgotPassword.tryAgainLater":
      "Gofynnwyd am ormod o ffyrdd i fynd yn ôl i mewn o'r fan hon yn ddiweddar. Arhoswch awr a rhowch gynnig arall arni.",

    "setNewPassword.title": "Gosodwch gyfrinair newydd",
    "setNewPassword.password": "Cyfrinair",
    "setNewPassword.confirmPassword": "Cadarnhau'r cyfrinair",
    "setNewPassword.submit": "Gosod fy nghyfrinair newydd",
    "setNewPassword.home": "Yn ôl i {siteName}",
    "setNewPassword.signIn": "Mewngofnodi",
    "setNewPassword.askAgain": "Gofyn am ddolen newydd",
    "setNewPassword.changed.title": "Mae eich cyfrinair wedi'i newid",
    "setNewPassword.changed.explanation":
      "Rydych wedi'ch allgofnodi ym mhob man lle'r oeddech wedi mewngofnodi. Mewngofnodwch gyda'ch cyfrinair newydd.",
    "setNewPassword.expired.title": "Mae'r ddolen honno wedi dod i ben",
    "setNewPassword.expired.explanation":
      "Mae dolen i osod cyfrinair newydd yn gweithio am awr. Gofynnwch am un arall a chaiff ei hanfon i'r un cyfeiriad.",
    "setNewPassword.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio bellach",
    "setNewPassword.noLongerWorks.explanation":
      "Efallai ei bod eisoes wedi'i defnyddio, neu fod rhywbeth ar goll ar y diwedd. Gofynnwch am un arall os oes ei hangen arnoch o hyd.",

    "BreachedPasswords.Unreachable":
      "Ni ellir gwirio eich cyfrinair ar hyn o bryd, felly nid yw wedi'i newid. Rhowch gynnig arall arni ymhen ychydig funudau; mae eich dolen yn dal i weithio nes iddi ddod i ben.",

    "forgetAccount.title": "Anghofiwch eich cyfrif",
    "forgetAccount.explanation":
      "Gellir gwneud eich enw a'ch cyfeiriad e-bost yn annarllenadwy am byth, a chau eich cyfrif. I wneud yn siŵr mai chi sydd yno, byddwn yn anfon dolen yn gyntaf i gyfeiriad eich cyfrif, ac ni chaiff dim ei anghofio nes i chi ei dilyn.",
    "forgetAccount.submit": "Anfonwch y ddolen ataf",
    "forgetAccount.sent.title": "Gwiriwch eich e-byst",
    "forgetAccount.sent.explanation":
      "Rydym wedi anfon dolen i gyfeiriad eich cyfrif. Mae'n gweithio am 15 munud, a dim ond tra byddwch wedi mewngofnodi i'r cyfrif hwn.",
    "forgetAccount.confirm.title": "Anghofio eich cyfrif am byth?",
    "forgetAccount.confirm.explanation":
      "Ar ôl ei anghofio, ni all neb ddarllen eich enw na'ch cyfeiriad e-bost eto, ac ni ellir mewngofnodi i'ch cyfrif. Ni ellir dadwneud hyn.",
    "forgetAccount.confirm.submit": "Anghofio fy nghyfrif",
    "forgetAccount.forgotten.title": "Mae eich cyfrif wedi'i anghofio",
    "forgetAccount.forgotten.explanation":
      "Ni ellir darllen eich enw na'ch cyfeiriad e-bost mwyach, ac rydych wedi'ch allgofnodi ym mhob man lle'r oeddech wedi mewngofnodi.",
    "forgetAccount.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio bellach",
    "forgetAccount.noLongerWorks.explanation":
      "Efallai ei bod wedi dod i ben, ei bod eisoes wedi'i defnyddio, neu ei bod ar gyfer cyfrif nad ydych wedi mewngofnodi iddo. Gofynnwch eto o'ch cyfrif os ydych am iddo gael ei anghofio o hyd.",
    "forgetAccount.lastAdministrator.title": "Ni ellir anghofio eich cyfrif",
    "forgetAccount.lastAdministrator.explanation":
      "Chi yw unig weinyddwr y safle hwn. Rhowch rôl y gweinyddwr i rywun arall, ac yna gellir anghofio eich cyfrif.",
    "forgetAccount.askAgain": "Gofyn eto",
    "forgetAccount.home": "Yn ôl i {siteName}",

    "registrationsSuspended.title": "Mae cofrestru wedi'i atal am y tro",
    "registrationsSuspended.explanation":
      "Ni ellir cysylltu ar hyn o bryd â gwasanaeth y mae cofrestru ei angen, felly ni all neb gofrestru nes iddo ymateb eto. Ni chadwyd dim o'r hyn a deipiasoch.",
    "registrationsSuspended.tryAgainLater":
      "Rhowch gynnig arall arni ymhen ychydig. Mae gweinyddwr y safle wedi cael gwybod.",
    "registrationsSuspended.home": "Yn ôl i {siteName}",

    "signIn.title": "Mewngofnodi",
    "signIn.emailAddress": "Cyfeiriad e-bost",
    "signIn.password": "Cyfrinair",
    "signIn.submit": "Mewngofnodi",
    "signIn.forgotPassword": "Wedi anghofio eich cyfrinair?",
    "signIn.register": "Cofrestru",
    "signIn.withGoogle": "Mewngofnodi gyda Google",
    "signIn.or": "neu",
    "signIn.tryAgainLater":
      "Gwnaed gormod o ymdrechion yn ddiweddar. Arhoswch awr a rhowch gynnig arall arni.",

    "SignIn.Failed":
      "Mae'r cyfeiriad e-bost neu'r cyfrinair yn anghywir. Rhowch gynnig arall arni.",

    "profile.title": "Proffil",
    "profile.name": "Enw:",
    "profile.emailAddress": "Cyfeiriad e-bost:",

    "changeName.title": "Newid enw",
    "changeName.name": "Enw",
    "changeName.submit": "Newid enw",

    "setPassword.title": "Gosodwch gyfrinair",
    "setPassword.explanation":
      "Nid oes gan eich cyfrif gyfrinair: rydych yn mewngofnodi gyda Google. Er mwyn gallu mewngofnodi gyda chyfrinair hefyd, byddwn yn anfon dolen i {emailAddress} i'w osod.",
    "setPassword.submit": "Anfonwch ddolen ataf",
    "setPassword.sent.title": "Gwiriwch eich e-byst",
    "setPassword.sent.explanation":
      "Rydym wedi anfon dolen atoch i osod cyfrinair. Mae'n gweithio am awr.",
    "setPassword.profile": "Yn ôl i'ch proffil",

    "changePassword.title": "Newid cyfrinair",
    "changePassword.currentPassword": "Cyfrinair presennol",
    "changePassword.password": "Cyfrinair newydd",
    "changePassword.passwordConfirmation": "Cadarnhau'r cyfrinair",
    "changePassword.forgotPassword": "Wedi anghofio eich cyfrinair?",
    "changePassword.submit": "Newid cyfrinair",
    "ChangePassword.WrongPassword": "Nid dyna eich cyfrinair.",

    "changeEmailAddress.title": "Newid cyfeiriad e-bost",
    "changeEmailAddress.emailAddress": "Cyfeiriad e-bost newydd",
    "changeEmailAddress.currentPassword": "Cyfrinair presennol",
    "changeEmailAddress.submit": "Anfon dolen gadarnhau",
    "changeEmailAddress.sent.title": "Gwiriwch eich e-byst",
    "changeEmailAddress.sent.explanation":
      "Anfonwyd dolen i'r cyfeiriad e-bost newydd i gadarnhau'r symud. Dilynwch hi, wedi mewngofnodi, i symud eich cyfrif yno.",
    "changeEmailAddress.confirm.title": "Symudwch eich cyfrif",
    "changeEmailAddress.confirm.explanation":
      "Caiff eich cyfrif ei symud i {emailAddress}. O hyn ymlaen, byddwch yn mewngofnodi gyda'r cyfeiriad hwnnw.",
    "changeEmailAddress.confirm.submit": "Symud fy nghyfrif",
    "changeEmailAddress.noLongerWorks.title":
      "Nid yw'r ddolen hon yn gweithio bellach",
    "changeEmailAddress.noLongerWorks.explanation":
      "Mae wedi dod i ben, mae eisoes wedi'i defnyddio, neu ni chafodd ei hanfon ar gyfer y cyfrif rydych wedi mewngofnodi iddo. Gofynnwch eto o'ch proffil.",
    "changeEmailAddress.taken.title": "Nid yw eich cyfrif wedi'i symud",
    "changeEmailAddress.profile": "Yn ôl i'ch proffil",
    "ChangeEmailAddress.WrongPassword": "Nid dyna eich cyfrinair.",
    "ChangeEmailAddress.Unchanged":
      "Mae eich cyfrif eisoes ar y cyfeiriad hwn.",
    "ChangeEmailAddress.Taken":
      "Mae gan y cyfeiriad e-bost hwnnw gyfrif ei hun eisoes, felly ni ellir symud eich un chi yno.",

    "confirmEmailAddress.title": "Cadarnhewch eich cyfeiriad e-bost",
    "confirmEmailAddress.name": "Enw",
    "confirmEmailAddress.password": "Cyfrinair",
    "confirmEmailAddress.confirmPassword": "Cadarnhau'r cyfrinair",
    "confirmEmailAddress.submit": "Cadarnhau fy nghyfeiriad e-bost",
    "confirmEmailAddress.signIn": "Mewngofnodi",
    "confirmEmailAddress.home": "Yn ôl i {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Mae eich cyfeiriad e-bost wedi'i gadarnhau",
    "confirmEmailAddress.confirmed.explanation":
      "Mae eich cyfrif yn barod. Mewngofnodwch gyda'r cyfeiriad e-bost a'r cyfrinair y gwnaethoch eu rhoi nawr.",
    "confirmEmailAddress.expired.title": "Mae'r ddolen honno wedi dod i ben",
    "confirmEmailAddress.expired.explanation":
      "Mae dolen i gadarnhau cyfeiriad e-bost yn gweithio am 24 awr. Gofynnwch am un newydd a chaiff ei hanfon i'r un cyfeiriad.",
    "confirmEmailAddress.expired.newLink": "Anfonwch ddolen newydd ataf",
    "confirmEmailAddress.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio bellach",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Gwiriwch eich bod wedi dilyn y ddolen gyfan o'r e-bost, heb i ddim fod ar goll ar y diwedd. Os na fydd yn gweithio o hyd, cofrestrwch eto a chaiff dolen newydd ei hanfon atoch.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Mae'r cyfeiriad e-bost hwnnw eisoes wedi'i gadarnhau",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Nid oes dim ar ôl i'w wneud. Mewngofnodwch gyda'r cyfrinair a roesoch wrth ei gadarnhau.",

    "PersonName.Missing": "Rhowch enw.",
    "PersonName.TooShort": "Rhaid i enw fod o leiaf 3 chymeriad.",
    "PersonName.TooLong": "Gall enw fod hyd at 254 o gymeriadau.",
    "WorldRankingName.TooShort":
      "Rhaid i'r enw ar Safleoedd y Byd fod o leiaf 3 chymeriad.",
    "WorldRankingName.TooLong":
      "Gall yr enw ar Safleoedd y Byd fod hyd at 254 o gymeriadau.",
    "Password.Missing": "Rhowch gyfrinair.",
    "Password.TooShort": "Rhaid i gyfrinair fod o leiaf 12 cymeriad.",
    "Password.ConfirmationDiffers":
      "Nid yw'n cyfateb i'r cyfrinair uchod. Teipiwch ef eto.",
    "Password.Breached":
      "Mae'r cyfrinair hwn wedi ymddangos mewn achos o dorri data ar safle arall, felly nid yw'n ddiogel ei ddefnyddio yma. Dewiswch un arall.",

    "javaScriptRequired.title": "Mae angen JavaScript",
    "javaScriptRequired.explanation":
      "I gofrestru, mae angen i JavaScript fod ymlaen ar y safle hwn, er mwyn gallu gwirio mai person sy'n cofrestru. Trowch ef ymlaen a chofrestrwch eto.",
    "javaScriptRequired.register": "Yn ôl i gofrestru",
    "javaScriptRequired.home": "Yn ôl i {siteName}",

    "errors.backHome": "Yn ôl i {siteName}",
    "errors.notFound": "Heb ei ganfod",
    "errors.refused": "Ni ellid gwneud hynny",
    "errors.refusedDetail": "Roedd rhywbeth a anfonwyd yn anghywir.",
    "errors.sorry": "Mae'n ddrwg gennym",
    "errors.sorryDetail": "Ni ellid ateb y cais hwnnw.",
    "errors.failed": "Aeth rhywbeth o'i le",
    "errors.reference": "Cyfeirnod {reference}.",
    "errors.unavailable": "Nid yw’r wefan ar gael",
    "errors.unavailableDetail":
      "Ni all y wefan gyrraedd yr hyn sydd ei angen arni ar hyn o bryd. Rhowch gynnig arni eto yn nes ymlaen.",
    "errors.maintenance": "Mae'r safle i lawr ar gyfer gwaith cynnal a chadw.",
    "errors.maintenanceMinutes":
      "Disgwylir iddo ddychwelyd ymhen {minutes} munud.",
    "errors.maintenanceMinute": "Disgwylir iddo ddychwelyd ymhen 1 munud.",
    "errors.maintenanceLonger":
      "Mae'n cymryd mwy o amser na'r disgwyl a bydd yn ôl cyn bo hir.",

    "home.recentResults": "Canlyniadau diweddar",
    "home.recentResults.none":
      "Nid oes gêm wedi'i hychwanegu yn ystod y saith diwrnod diwethaf.",
    "home.upcomingTournaments": "Twrnameintiau i ddod",
    "home.upcomingTournaments.none":
      "Nid oes twrnamaint yn dechrau yn ystod y chwe deg diwrnod nesaf.",
    "tournamentList.column.date": "Dyddiad",
    "tournamentList.column.name": "Enw",
    "tournamentList.onlyIn": "Twrnameintiau yn {country} yn unig",
    "tournamentList.filter.country": "Gwlad",
    "tournamentList.filter.anyCountry": "Unrhyw wlad",
    "tournamentList.filter.region": "Rhanbarth",
    "tournamentList.filter.anyRegion": "Unrhyw ranbarth",
    "tournamentList.filter.sport": "Camp",
    "tournamentList.filter.anySport": "Unrhyw gamp",
    "tournamentList.filter.submit": "Hidlo",
    "home.allTournaments": "Holl dwrnameintiau {year}",
    "year.heading": "Twrnameintiau {year}",
    "year.none": "Nid oes twrnamaint yn dechrau yn {year}.",
    "yearSport.heading": "Twrnameintiau {sport} yn {year}",
    "yearSport.none": "Nid oes twrnamaint {sport} yn dechrau yn {year}.",
    "tournament.recent": "Diweddar",
    "tournament.summary": "Crynodeb",
    "test.bestOf": "Mae pob gornest y gorau o {count}.",
    "test.vs": "v",
    "test.matches": "Gornestau",
    "test.games": "Gemau",
    "test.hoops": "Cylchoedd",
    "teamSummary.tests": "Testau",
    "teamSummary.matches": "Gornestau",
    "teamSummary.games": "Gemau",
    "teamSummary.hoops": "Cylchoedd",
    "teamSummary.wins": "Buddugoliaethau",
    "teamSummary.losses": "Colledion",
    "teamSummary.draws": "Gemau cyfartal",
    "teamSummary.for": "Dros",
    "teamSummary.against": "Yn erbyn",
    "teamSummary.net": "Net",
    "tournament.players": "Chwaraewyr",
    "search.label": "Chwilio",
    "search.tournaments": "Twrnameintiau",
    "search.competitions": "Cystadlaethau",
    "search.nothingFound": "Ni chanfuwyd dim.",
    "players.search.label": "Chwilio am chwaraewyr",
    "players.search.prompt": "Teipiwch enw chwaraewr i ddod o hyd iddo.",
    "players.search.none": "Ni chanfuwyd unrhyw chwaraewyr.",
    "search.more":
      "Dim ond y {count} cyntaf a ddangosir. Ychwanegwch fwy o'r enw i gyfyngu'r chwilio.",
    "websitePlayer.tournament": "Twrnamaint",
    "tournament.test": "{first} v {second}",
    "tournament.notes": "Nodiadau",
    "tournament.commentary": "Sylwebaeth",
    "tournament.beat": "a gurodd",
    "tournament.drewWith": "a gafodd gêm gyfartal â",
    "tournament.ago.seconds": "{count} eil",
    "tournament.ago.minutes": "{count} munud",
    "tournament.ago.hour": "1 awr",
    "tournament.ago.hours": "{count} awr",
    "tournament.none": "Nid oes gêm wedi'i chwarae eto.",
    "players.none": "Nid oes chwaraewr wedi'i ychwanegu eto.",
    "commentaries.by": "gan",
    "commentaries.start": "Dechrau sylwebaeth newydd",
    "commentaries.disclaimer.heading": "Ymwadiad",
    "commentaries.disclaimer":
      "Barn eu hawduron yw'r farn a fynegir yn y sylwebaethau hyn, ac nid ydynt o reidrwydd yn adlewyrchu barn Tim Murphy na {site}.",
    "commentaries.guidelines.heading": "Canllawiau",
    "commentaries.guidelines.responsible":
      "Chi sy'n gyfrifol am eich sylwadau.",
    "commentaries.guidelines.purpose":
      "Pwrpas y sylwebaethau yw adrodd beth sy'n digwydd yn y twrnamaint. Nid ydynt wedi'u bwriadu fel \"rhwydwaith cymdeithasol\" i anfon dymuniadau da ac ati.",
    "commentaries.guidelines.hatred":
      "Peidiwch â chyhoeddi dim a allai annog trais neu gasineb. Ni fyddwn yn goddef sylwadau sy'n bychanu eraill oherwydd eu hil, eu crefydd, eu cefndir ethnig, eu rhyw, eu hoedran, anabledd meddyliol neu gorfforol, na'u cyfeiriadedd rhywiol.",
    "commentaries.guidelines.abuse":
      "Ni fyddwn yn goddef sarhau diangen. Y rheol gyffredinol yw chwarae'r bêl ac nid y chwaraewr, hynny yw, peidio ag ymosod ar neb yn bersonol ond trafod y mater dan sylw.",
    "commentaries.guidelines.unlawful":
      "Caiff unrhyw sylw o gyfreithlondeb amheus ei ddileu, megis torri hawlfraint posibl neu ddeunydd a allai fod yn enllibus.",
    "commentaries.guidelines.shouting":
      "Peidiwch â rhegi na theipio popeth mewn prif lythrennau yn y sylwadau, os gwelwch yn dda.",
    "commentaries.guidelines.selling":
      "Peidiwch â defnyddio'r sylwadau at ddibenion masnachol nac i anfon sbam. Caiff sylwadau sy'n hysbysebu, yn hyrwyddo neu'n cynnig nwyddau neu wasanaethau eu dileu.",
    "commentaries.guidelines.links":
      "Cyfyngwch ar y dolenni yn y sylwadau, os gwelwch yn dda. Caiff sylwadau â dolenni i ddeunydd amhriodol eu dileu.",
    "commentaries.guidelines.impersonating":
      "Peidiwch â smalio bod yn rhywun arall yn y sylwadau, na chyhoeddi manylion personol – rhifau ffôn, cyfeiriadau post na chyfeiriadau e-bost – a allai roi rhywun mewn perygl yn ddiarwybod.",
    "commentaries.reporting.heading": "Adrodd am sylwadau",
    "commentaries.reporting.before":
      "Adroddwch am unrhyw sylwadau nad ydynt yn cydymffurfio â'r canllawiau hyn i",
    "commentaries.reporting.after":
      ". Cyfeiriwch at y cyfeiriad gwe a'r sylw amheus. Er enghraifft:",
    "commentaries.reporting.exampleComment": '"sylw a ddylai gael ei ddileu"',
    "commentaries.reporting.exampleReason":
      "Dylid dileu'r sylw hwn oherwydd...",
    "commentaries.reporting.reviewed":
      "Nid yw adrodd am rywbeth yn golygu y caiff ei ddileu'n awtomatig, ond caiff pob adroddiad ei adolygu.",
    "commentaries.reporting.reserved":
      "Mae {site} yn cadw'r hawl i ddileu sylwadau.",
    "commentaries.reporting.subject": "{site} Adroddiad am sylw",
    "commentaries.reporting.body":
      "Cyfeiriwch at y cyfeiriad gwe, y sylw amheus a pham y dylid ei ddileu.",
    "startCommentary.title": "Dechrau sylwebaeth newydd",
    "startCommentary.titleField": "Teitl",
    "startCommentary.submit": "Dechrau'r sylwebaeth",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Nid yw'r trefnwyr wedi ysgrifennu nodiadau eto.",
    "marks.new": "newydd",
    "note.edited": "wedi'i golygu",
    "commentary.none": "Nid oes dim wedi'i ysgrifennu eto.",
    "commentary.edited": "wedi'i olygu",
    "commentary.edit": "Golygu",
    "commentary.delete": "Dileu",
    "commentary.comment": "Sylw",
    "commentary.add": "Ychwanegu",
    "commentary.notSent":
      "Ni ellid anfon y sylw. Ail-lwythwch y dudalen i weld a gafodd ei gadw.",
    "changeCommentaryTitle.title": "Newid y teitl",
    "changeCommentaryTitle.submit": "Cadw",
    "editComment.title": "Golygu'r sylw",
    "editComment.save": "Cadw",
    "deleteComment.title": "Dileu'r sylw",
    "deleteComment.question": "Dileu'r sylw hwn? Ni ellir dadwneud hyn.",
    "deleteComment.confirm": "Dileu'r sylw",
    "deleteComment.keep": "Ei gadw",
    "player.games": "Gemau",
    "player.competitions": "Cystadlaethau",
    "player.beat": "a gurodd",
    "player.lostTo": "a gollodd i",
    "player.drewWith": "a gafodd gêm gyfartal â",
    "player.score": "{score} i {opponent}",
    "player.noGames": "Nid oes gêm wedi'i chwarae eto.",
    "player.noCompetitions":
      "Nid yw wedi'i gofrestru mewn unrhyw gystadleuaeth eto.",
    "block.wins": "Buddugoliaethau",
    "block.matches": "Gornestau",
    "block.netGames": "Gemau net",
    "block.games": "Gemau",
    "block.netHoops": "Cylchoedd net",
    "block.won": "wedi ennill",
    "block.lost": "wedi colli",
    "block.drawn": "cyfartal",
    "block.withdrawn": "wedi tynnu'n ôl",
    "block.gameWithdrawn": "wedi tynnu'n ôl",
    "block.losses": "Colledion",
    "competition.views": "Golygon",
    "competition.view.grid": "Grid",
    "competition.view.summary": "Crynodeb",
    "competition.view.orderOfPlay": "Trefn chwarae",
    "blockSummary.ranking":
      "Wedi'u trefnu yn ôl cyfran y gornestau a enillwyd ac yna yn ôl cylchoedd net. Gall rheolau twrnamaint drefnu ei chwaraewyr mewn ffordd wahanol.",
    "orderOfPlay.none": "Nid oes gêm wedi'i chwarae eto.",
    "knockout.round.final": "Rownd derfynol",
    "knockout.round.semis": "Rownd gynderfynol",
    "knockout.round.quarters": "Rownd yr wyth olaf",
    "knockout.round.number": "Rownd {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Gemau",
    "swiss.wins": "Buddugoliaethau",
    "swiss.winShare": "% o fuddugoliaethau",
    "swiss.results": "Canlyniadau",
    "knockout.onward": "Rowndiau diweddarach",
    "knockout.back": "Rowndiau cynharach",
    "years.label": "Blynyddoedd",
    "years.earlier": "Blynyddoedd cynharach",

    "admin.newerBuild.message":
      "Mae fersiwn mwy diweddar o'r safle hwn ar gael.",
    "admin.newerBuild.reload": "Ail-lwytho",
    "admin.title": "Gweinyddu",
    "admin.tournaments.new": "Twrnamaint newydd",
    "admin.tournaments.none": "Dim twrnameintiau",
    "admin.tournaments.archived": "Wedi'i archifo",
    "admin.tournaments.manage": "Rheoli",
    "admin.tournaments.edit": "Golygu",
    "admin.tournaments.archive": "Archifo",
    "admin.tournaments.restore": "Adfer",
    "admin.tournaments.scores": "Canlyniadau",
    "admin.tournaments.players": "Chwaraewyr",
    "admin.years.label": "Blynyddoedd",
    "admin.years.earlier": "Blynyddoedd cynharach",
    "admin.tournament.name": "Enw",
    "admin.tournament.starts": "Yn dechrau",
    "admin.tournament.finishes": "Yn gorffen",
    "admin.tournament.format": "Fformat",
    "admin.tournament.sport": "Camp",
    "admin.tournament.country": "Gwlad",
    "admin.tournament.region": "Rhanbarth",
    "admin.tournament.subtitle": "Isdeitl",
    "admin.tournament.handicap": "Chwarae gyda handicap",
    "admin.tournament.drawsAllowed": "Caniatáu gemau cyfartal",
    "admin.tournament.levelTestsDrawn": "Mae testau cyfartal yn gyfartal",
    "admin.tournament.worldRankings": "Yn cyfrif tuag at Safleoedd y Byd",
    "admin.tournament.national": "Digwyddiad lefel genedlaethol",
    "admin.tournament.international": "Digwyddiad lefel ryngwladol",
    "admin.tournament.otherwise": "Ni ellir derbyn hyn fel y mae.",
    "admin.newTournament.title": "Twrnamaint newydd",
    "admin.newTournament.submit": "Creu twrnamaint",
    "admin.editTournament.title": "Golygu twrnamaint",
    "admin.editTournament.submit": "Diweddaru'r twrnamaint",
    "admin.editTournament.otherwise": "Ni ellir newid y twrnamaint hwn.",
    "admin.view.tabs": "Twrnamaint",
    "admin.view.players": "Chwaraewyr",
    "admin.view.competitions": "Cystadlaethau",
    "admin.view.managers": "Rheolwyr",
    "admin.view.notes": "Nodiadau",
    "admin.view.scorers": "Sgorwyr",
    "admin.view.rankings": "Safleoedd",
    "admin.rankings.textFile":
      "Mae canlyniadau'r twrnamaint yn cael eu hanfon at Safleoedd y Byd fel ffeil destun, y mae'r wefan yn ei hysgrifennu o'r gemau a gofnodwyd.",
    "admin.rankings.spreadsheet":
      "Mae canlyniadau'r twrnamaint yn cael eu hanfon at Safleoedd y Byd fel taenlen, y mae'r wefan yn ei hysgrifennu o'r gemau a gofnodwyd.",
    "admin.rankings.fillInWinners":
      "Dim ond dyfalu pwy enillodd bob cystadleuaeth y gall y wefan ei wneud, felly gwiriwch linell Winner ym mhob un cyn anfon y ffeil.",
    "admin.rankings.fillInWinner":
      "Ni all y wefan wybod pwy enillodd y twrnamaint, felly llenwch hynny ar waelod y daenlen cyn ei hanfon.",
    "admin.rankings.sendIt":
      "Yna anfonwch y ffeil at swyddogion Safleoedd y Byd.",
    "admin.rankings.download": "Lawrlwytho safleoedd",
    "rankings.notAvailable": "Nid yw safleoedd ar gael",
    "rankings.notAvailable.sport":
      "Does gan chwaraeon y twrnamaint hwn ddim safleoedd y byd, felly does dim safleoedd i'w hanfon.",
    "rankings.notAvailable.handicap":
      "Mae'r twrnamaint hwn yn cael ei chwarae gyda handicap, felly nid yw'n cyfrif tuag at Safleoedd y Byd.",
    "rankings.notAvailable.drawnGames":
      "Mae'r twrnamaint hwn yn caniatáu gemau cyfartal, felly nid yw'n cyfrif tuag at Safleoedd y Byd.",
    "rankings.notAvailable.notCounted":
      "Mae rheolwr y twrnamaint hwn wedi dweud nad yw'n cyfrif tuag at Safleoedd y Byd.",
    "admin.view.otherwise": "Ni ellir rheoli'r twrnamaint hwn o'r fan hon.",
    "admin.competitionView.tabs": "Cystadleuaeth",
    "admin.competitionView.players": "Chwaraewyr",
    "admin.competitionView.scores": "Canlyniadau",
    "admin.sections.label": "Y twrnamaint a'i gystadlaethau",
    "admin.sections.tournament": "Twrnamaint",
    "admin.administrator.sections.label": "Tudalennau'r gweinyddwr",
    "admin.administrator.sections.tournaments": "Twrnameintiau",
    "admin.administrator.sections.accounts": "Cyfrifon",
    "admin.administrator.sections.worldRankings": "Safleoedd y Byd",
    "admin.administrator.sections.importErrors": "Gwallau mewnforio",
    "admin.administrator.title": "Gweinyddwr",
    "admin.accounts.title": "Cyfrifon",
    "admin.roles.add": "Ychwanegu",
    "admin.roles.administrator.heading": "Gweinyddwyr",
    "admin.roles.administrator.none": "Dim gweinyddwyr eraill",
    "admin.roles.administrator.removeTitle": "Tynnu gweinyddwr",
    "admin.roles.administrator.removeExplanation":
      "Ni fydd {name} yn weinyddwr y safle hwn mwyach.",
    "admin.roles.world-ranking-officer.heading": "Swyddogion Safleoedd y Byd",
    "admin.roles.world-ranking-officer.none": "Dim swyddogion Safleoedd y Byd",
    "admin.roles.world-ranking-officer.removeTitle":
      "Tynnu swyddog Safleoedd y Byd",
    "admin.roles.world-ranking-officer.removeExplanation":
      "Ni fydd {name} yn swyddog Safleoedd y Byd mwyach.",
    "admin.worldRankings.title": "Mewnforio chwaraewyr Safleoedd y Byd",
    "admin.worldRankings.import": "Mewnforio",
    "admin.worldRankings.log": "Sut aeth y mewnforio",
    "admin.worldRankings.ac.reading": "Darllen rhestr croce cymdeithas",
    "admin.worldRankings.ac.read":
      "Chwaraewyr croce cymdeithas a ddarllenwyd: {players}",
    "admin.worldRankings.ac.kept":
      "Chwaraewyr croce cymdeithas a gadwyd: {players}",
    "admin.worldRankings.ac.refused":
      "Ni ellid darllen rhestr croce cymdeithas, felly gadawyd ei chwaraewyr fel yr oeddent.",
    "admin.worldRankings.gc.reading": "Darllen rhestr croce golff",
    "admin.worldRankings.gc.read":
      "Chwaraewyr croce golff a ddarllenwyd: {players}",
    "admin.worldRankings.gc.kept": "Chwaraewyr croce golff a gadwyd: {players}",
    "admin.worldRankings.gc.refused":
      "Ni ellid darllen rhestr croce golff, felly gadawyd ei chwaraewyr fel yr oeddent.",
    "admin.worldRankings.finished": "Wedi gorffen",
    "admin.worldRankings.failed": "Ni orffennodd y mewnforio.",
    "admin.worldRankings.otherwise": "Mae rhywbeth o'i le ar y safle.",
    "WorldRankingLists.Unreachable": "Ni ellid cyrraedd safle Safleoedd y Byd.",
    "WorldRankingLists.Unreadable":
      "Nid yw'r rhestr wedi'i threfnu fel y mae Safleoedd y Byd yn trefnu eu rhestrau: ni ellid darllen llinell ynddi, nid oes neb arni, neu nid yw wedi'i hysgrifennu mewn UTF-8.",
    "admin.importErrors.title": "Gwallau mewnforio",
    "admin.importErrors.none": "Dim gwallau mewnforio",
    "admin.importErrors.otherwise": "Mae rhywbeth o'i le ar y safle.",
    "admin.importError.title": "Gwall mewnforio",
    "admin.importError.documentId": "ID y ddogfen",
    "admin.importError.tournament": "Twrnamaint",
    "admin.importError.competition": "Cystadleuaeth",
    "admin.importError.newSite": "Safle newydd",
    "admin.importError.oldSite": "Hen safle",
    "ImportErrorKept.NotFound":
      "Ni chadwodd y mewnforio unrhyw wall ar gyfer y ddogfen honno.",
    "admin.competitionView.otherwise":
      "Ni ellir rheoli'r gystadleuaeth hon o'r fan hon.",
    "admin.competitions.block": "Bloc",
    "admin.competitions.knockout": "Taro allan",
    "admin.competitions.swiss": "Swisaidd",
    "admin.competitions.view": "Gweld",
    "admin.competitions.edit": "Golygu",
    "admin.competitions.up": "I fyny",
    "admin.competitions.down": "I lawr",
    "admin.competitions.archive": "Archifo",
    "admin.competitions.restore": "Adfer",
    "admin.competitions.archived": "Cystadlaethau wedi'u harchifo",
    "admin.competitions.none": "Dim cystadlaethau",
    "admin.competitions.add": "Ychwanegu cystadleuaeth",
    // The competition dialog.
    "admin.competition.addTitle": "Ychwanegu cystadleuaeth",
    "admin.competition.editTitle": "Golygu cystadleuaeth",
    "admin.competition.name": "Enw",
    "admin.competition.kind": "Math",
    "admin.competition.bestOf": "Y gorau o",
    "admin.competition.rounds": "Rowndiau",
    "admin.competition.places": "Lleoedd",
    "admin.competition.round": "Rownd {number}",
    "admin.competition.bestOfs": "Y gorau o",
    "admin.competition.quarters": "Wyth olaf",
    "admin.competition.semis": "Cynderfynol",
    "admin.competition.final": "Terfynol",
    "admin.competition.add": "Ychwanegu",
    "admin.competition.save": "Cadw",
    "admin.competition.added": "Ychwanegwyd {name}.",
    "admin.competition.otherwise":
      "Ni ellir cadw'r gystadleuaeth hon fel y mae.",
    "CompetitionName.Missing": "Rhowch enw.",
    "CompetitionName.TooLong": "Gall enw fod hyd at 254 o gymeriadau.",
    "CompetitionName.NoLetterOrDigit": "Mae angen llythyren neu rif ar enw.",
    "Tournament.KnockoutPlayerHasGames":
      "Mae gan rai chwaraewyr yn y siart hon gornestau, felly ni ellir newid eu lleoedd.",
    "Tournament.CompetitionNameTaken":
      "Mae gan gystadleuaeth arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "BestOf.NotWhole": "Rhowch nifer cyflawn o gemau.",
    "BestOf.TooSmall": "Rhaid i gornest fod y gorau o 1 gêm o leiaf.",
    "Rounds.NotWhole": "Rhowch nifer cyflawn o rowndiau.",
    "Rounds.TooSmall": "Rhaid chwarae bloc mewn 1 rownd o leiaf.",
    "KnockoutDraw.EvenBestOf":
      "Rhaid i gornest taro allan gael enillydd, felly mae'n rhaid iddi fod y gorau o odrif o gemau.",
    "admin.hover.tournaments.new": "Creu twrnamaint newydd",
    "admin.hover.tournaments.manage":
      "Rheoli chwaraewyr, timau, cystadlaethau a chanlyniadau'r twrnamaint hwn",
    "admin.hover.tournaments.edit": "Newid manylion y twrnamaint hwn",
    "admin.hover.tournaments.scores":
      "Rhoi canlyniadau'r twrnamaint hwn i mewn",
    "admin.hover.tournaments.players": "Gofalu am chwaraewyr y twrnamaint hwn",
    "admin.hover.competitions.view":
      "Agor y gystadleuaeth hon i weld a rhoi i mewn ei chwaraewyr a'i chanlyniadau",
    "admin.hover.tests.view":
      "Agor y test hwn i weld a rhoi i mewn ei ganlyniadau",
    "admin.hover.teams.view": "Agor y tîm hwn i weld a rheoli ei chwaraewyr",
    "admin.hover.dialog.player.add":
      "Ychwanegu'r chwaraewr hwn at y twrnamaint",
    "admin.hover.dialog.player.save": "Cadw newidiadau'r chwaraewr hwn",
    "admin.hover.dialog.team.add": "Ychwanegu'r tîm hwn at y twrnamaint",
    "admin.hover.dialog.team.save": "Cadw newidiadau'r tîm hwn",
    "admin.hover.dialog.test.add": "Ychwanegu'r test hwn at y twrnamaint",
    "admin.hover.dialog.test.save": "Cadw newidiadau'r test hwn",
    "admin.hover.dialog.competition.add":
      "Ychwanegu'r gystadleuaeth hon at y twrnamaint",
    "admin.hover.dialog.competition.save":
      "Cadw newidiadau'r gystadleuaeth hon",
    "admin.hover.dialog.score.add":
      "Ychwanegu'r canlyniad hwn at y gystadleuaeth",
    "admin.hover.dialog.score.save": "Cadw cywiriad y canlyniad hwn",
    "admin.hover.dialog.carryForward.save":
      "Cario canlyniadau'r chwaraewr hwn ymlaen",
    "admin.hover.dialog.tournament.new": "Creu'r twrnamaint hwn",
    "admin.hover.dialog.tournament.edit": "Cadw newidiadau'r twrnamaint hwn",
    "admin.hover.modal.cancel": "Cau hwn heb gadw dim",
    "admin.hover.modal.ok": "Cau'r neges hon",
    "admin.hover.tab": "Dangos y tab {name}",
    "admin.hover.tournaments.archive":
      "Archifo'r twrnamaint hwn; gellir ei adfer",
    "admin.hover.tournaments.restore": "Cael y twrnamaint archifedig hwn yn ôl",
    "admin.hover.players.add": "Ychwanegu chwaraewr at y twrnamaint hwn",
    "admin.hover.players.edit": "Newid manylion y chwaraewr hwn",
    "admin.hover.players.up": "Symud y chwaraewr hwn i fyny'r rhestr",
    "admin.hover.players.down": "Symud y chwaraewr hwn i lawr y rhestr",
    "admin.hover.players.archive": "Archifo'r chwaraewr hwn; gellir ei adfer",
    "admin.hover.players.restore": "Cael y chwaraewr archifedig hwn yn ôl",
    "admin.hover.teams.add": "Ychwanegu tîm at y twrnamaint hwn",
    "admin.hover.teams.edit": "Newid manylion y tîm hwn",
    "admin.hover.teams.up": "Symud y tîm hwn i fyny'r rhestr",
    "admin.hover.teams.down": "Symud y tîm hwn i lawr y rhestr",
    "admin.hover.teams.archive": "Archifo'r tîm hwn; gellir ei adfer",
    "admin.hover.teams.restore": "Cael y tîm archifedig hwn yn ôl",
    "admin.hover.competitions.add":
      "Ychwanegu cystadleuaeth at y twrnamaint hwn",
    "admin.hover.competitions.edit": "Newid manylion y gystadleuaeth hon",
    "admin.hover.competitions.up": "Symud y gystadleuaeth hon i fyny'r rhestr",
    "admin.hover.competitions.down":
      "Symud y gystadleuaeth hon i lawr y rhestr",
    "admin.hover.competitions.archive":
      "Archifo'r gystadleuaeth hon; gellir ei hadfer",
    "admin.hover.competitions.restore":
      "Cael y gystadleuaeth archifedig hon yn ôl",
    "admin.hover.tests.add": "Ychwanegu test rhwng dau dîm",
    "admin.hover.tests.edit": "Newid manylion y test hwn",
    "admin.hover.tests.up": "Symud y test hwn i fyny'r rhestr",
    "admin.hover.tests.down": "Symud y test hwn i lawr y rhestr",
    "admin.hover.tests.archive": "Archifo'r test hwn; gellir ei adfer",
    "admin.hover.tests.restore": "Cael y test archifedig hwn yn ôl",
    "admin.hover.tests.toTeams":
      "Mynd i'r tab Timau i ychwanegu'r timau y mae eu hangen ar test",
    "admin.hover.scores.add":
      "Ychwanegu canlyniad gornest at y gystadleuaeth hon",
    "admin.hover.scores.edit": "Cywiro'r canlyniad hwn",
    "admin.hover.scores.archive":
      "Archifo'r canlyniad hwn fel nad yw'n cyfrif mwyach; gellir ei adfer",
    "admin.hover.scores.restore":
      "Cael y canlyniad archifedig hwn yn ôl, fel ei fod yn cyfrif eto",
    "admin.hover.scores.withdraw":
      "Gadael y canlyniad hwn ar y rhestr ond heb iddo gyfrif",
    "admin.hover.scores.unwithdraw":
      "Gwneud i'r canlyniad hwn a dynnwyd yn ôl gyfrif eto",
    "admin.hover.scores.up": "Symud y canlyniad hwn yn gynharach yn y rhestr",
    "admin.hover.scores.down": "Symud y canlyniad hwn yn hwyrach yn y rhestr",
    "admin.hover.competitionPlayers.add":
      "Rhoi'r chwaraewr a ddewiswyd yn y gystadleuaeth hon",
    "admin.hover.competitionPlayers.up":
      "Symud y chwaraewr hwn i fyny'r rhestr",
    "admin.hover.competitionPlayers.down":
      "Symud y chwaraewr hwn i lawr y rhestr",
    "admin.hover.competitionPlayers.remove":
      "Tynnu'r chwaraewr hwn o'r gystadleuaeth",
    "admin.hover.competitionPlayers.withdraw":
      "Tynnu'r chwaraewr hwn yn ôl o'r gystadleuaeth",
    "admin.hover.competitionPlayers.unwithdraw":
      "Rhoi'r chwaraewr hwn a dynnwyd yn ôl yn ôl yn y gystadleuaeth",
    "admin.hover.competitionPlayers.carryForward":
      "Cario canlyniadau'r chwaraewr hwn ymlaen o gystadleuaeth arall",
    "admin.hover.notes.add":
      "Ysgrifennu nodyn newydd ar gyfer y twrnamaint hwn",
    "admin.hover.notes.edit": "Newid y nodyn hwn",
    "admin.hover.notes.delete": "Dileu'r nodyn hwn",
    "admin.hover.note.add": "Cadw'r nodyn hwn a'i ychwanegu at y twrnamaint",
    "admin.hover.note.save": "Cadw newidiadau'r nodyn hwn",
    "admin.hover.people.add": "Rhoi'r rôl i'r person hwn",
    "admin.hover.people.remove": "Tynnu'r rôl oddi ar y person hwn",
    "admin.hover.worldRankings.import":
      "Nôl Safleoedd y Byd ac ychwanegu eu chwaraewyr",
    "admin.modal.cancel": "Canslo",
    "admin.modal.ok": "Iawn",
    "admin.people.emailAddress": "Cyfeiriad e-bost",
    "admin.people.remove": "Tynnu",
    "admin.people.otherwise": "Ni ellid gwneud hynny.",
    "admin.managers.you": "Chi",
    "admin.managers.add": "Ychwanegu rheolwr",
    "admin.managers.none": "Dim rheolwyr",
    "admin.managers.removeTitle": "Tynnu rheolwr",
    "admin.managers.removeExplanation":
      "Ni fydd {name} yn gallu rheoli'r twrnamaint hwn mwyach.",
    "admin.managers.removeYourself.explanation":
      "Ni fyddwch yn gallu rheoli'r twrnamaint hwn mwyach, ac ni all neb yma ddadwneud hynny i chi. Gall rheolwr arall eich gwneud yn rheolwr eto.",
    "admin.managers.otherwise": "Ni ellir gwneud y cyfeiriad hwnnw'n rheolwr.",
    "admin.competitionPlayers.add": "Ychwanegu chwaraewr",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "Ni ellir ychwanegu'r chwaraewr hwn.",
    "admin.competitionPlayers.choose": "Chwaraewr i'w ychwanegu",
    "admin.competitionPlayers.nobody": "Dewiswch chwaraewr",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all":
      "Mae pob chwaraewr yn y gystadleuaeth eisoes",
    "admin.competitionPlayers.none": "Dim chwaraewyr",
    "admin.competitionPlayers.up": "I fyny",
    "admin.competitionPlayers.down": "I lawr",
    "admin.competitionPlayers.remove": "Tynnu",
    "admin.competitionPlayers.withdraw": "Tynnu'n ôl",
    "admin.competitionPlayers.unwithdraw": "Dadwneud tynnu'n ôl",
    "admin.competitionPlayers.withdrawn": "Chwaraewyr a dynnwyd yn ôl",
    "admin.competitionPlayers.removeTitle": "Tynnu chwaraewr",
    "admin.competitionPlayers.removeQuestion":
      "Caiff {name} ei dynnu o'r gystadleuaeth. Ni ellir dadwneud hyn.",
    "admin.competitionPlayers.withdrawTitle": "Tynnu chwaraewr yn ôl",
    "admin.competitionPlayers.withdrawQuestion":
      "Ni fydd {name} yn chwarae rhagor yn y gystadleuaeth, a chaiff y gemau na chwaraeodd eu penderfynu hebddo.",
    "admin.competitionPlayers.carryForward": "Cario ymlaen",
    "admin.carryForward.title": "Cario ymlaen - {name}",
    "admin.carryForward.save": "Cadw",
    "admin.carryForward.otherwise": "Ni ellir cadw'r cario ymlaen hwn.",
    "admin.carryForward.matchWins": "Gornestau a enillwyd",
    "admin.carryForward.matchLosses": "Gornestau a gollwyd",
    "admin.carryForward.gameWins": "Gemau a enillwyd",
    "admin.carryForward.gameLosses": "Gemau a gollwyd",
    "admin.carryForward.hoopsFor": "Cylchoedd dros",
    "admin.carryForward.hoopsAgainst": "Cylchoedd yn erbyn",
    "CarryForward.MatchWinsNotWhole":
      "Rhowch nifer cyflawn o gornestau a enillwyd.",
    "CarryForward.MatchWinsBelowZero":
      "Rhowch 0 neu fwy o gornestau a enillwyd.",
    "CarryForward.MatchLossesNotWhole":
      "Rhowch nifer cyflawn o gornestau a gollwyd.",
    "CarryForward.MatchLossesBelowZero":
      "Rhowch 0 neu fwy o gornestau a gollwyd.",
    "CarryForward.GameWinsNotWhole": "Rhowch nifer cyflawn o gemau a enillwyd.",
    "CarryForward.GameWinsBelowZero": "Rhowch 0 neu fwy o gemau a enillwyd.",
    "CarryForward.GameLossesNotWhole":
      "Rhowch nifer cyflawn o gemau a gollwyd.",
    "CarryForward.GameLossesBelowZero": "Rhowch 0 neu fwy o gemau a gollwyd.",
    "CarryForward.HoopsForNotWhole": "Rhowch nifer cyflawn o gylchoedd dros.",
    "CarryForward.HoopsForBelowZero": "Rhowch 0 neu fwy o gylchoedd dros.",
    "CarryForward.HoopsAgainstNotWhole":
      "Rhowch nifer cyflawn o gylchoedd yn erbyn.",
    "CarryForward.HoopsAgainstBelowZero":
      "Rhowch 0 neu fwy o gylchoedd yn erbyn.",
    "admin.scores.add": "Ychwanegu canlyniad",
    "admin.scores.none": "Dim canlyniadau",
    "admin.scores.edit": "Golygu",
    "admin.scores.drawNotFilledTitle": "Siart anghyflawn",
    "admin.scores.archive": "Archifo",
    "admin.scores.up": "I fyny",
    "admin.scores.down": "I lawr",
    "admin.scores.restore": "Adfer",
    "admin.scores.archived": "Canlyniadau wedi'u harchifo",
    "admin.scores.archivedSaid": "Wedi'i archifo",
    "admin.scores.withdraw": "Tynnu'n ôl",
    "admin.scores.unwithdraw": "Dadwneud tynnu'n ôl",
    "admin.scores.withdrawnSaid": "Wedi tynnu'n ôl",
    "admin.scores.otherwise": "Ni ellid gwneud hynny.",
    "admin.score.title": "Ychwanegu canlyniad",
    "admin.score.add": "Ychwanegu gêm",
    "admin.score.winner": "Enillydd",
    "admin.score.winnerScore": "Pwyntiau'r enillydd",
    "admin.score.loser": "Collwr",
    "admin.score.loserScore": "Pwyntiau'r collwr",
    "admin.score.beat": "a gurodd",
    "admin.score.added": "Ychwanegwyd y gêm lle gurodd {winner} {loser}.",
    "admin.score.otherwise": "Ni ellid ychwanegu'r gêm.",
    "admin.score.correctTitle": "Golygu canlyniad",
    "admin.score.save": "Cadw",
    "admin.score.notCorrected": "Ni ellid cywiro'r canlyniad.",
    "Game.WinnerMissing": "Dewiswch yr enillydd.",
    "Game.WinnerScoreMissing": "Rhowch bwyntiau'r enillydd.",
    "Game.LoserMissing": "Dewiswch y collwr.",
    "Game.LoserScoreMissing": "Rhowch bwyntiau'r collwr.",
    "Score.NoPoints": "Mae pwyntiau'n dechrau gyda rhif.",
    "Game.SamePlayer": "Nid oes neb yn chwarae yn erbyn ei hun.",
    "Game.WinnerNotAhead":
      "Rhaid i'r enillydd gael mwy o bwyntiau na'r collwr, neu gael ei farcio'n enillydd.",
    "Game.LoserMarked":
      "Ni ellir marcio pwyntiau'r collwr fel rhai a enillwyd.",
    "Game.ResultChanged":
      "Mae cywiriad yn cadw'r canlyniad: mae gêm a enillwyd yn parhau i fod wedi'i hennill, ac un gyfartal yn parhau'n gyfartal.",
    "Competition.MatchDecided": "Mae eu gornest eisoes wedi'i phenderfynu.",
    "Competition.DrawFull":
      "Ni ellir ychwanegu'r chwaraewr oherwydd bod y siart yn llawn.",
    "Competition.DrawNotFilled":
      "Ni ellir ychwanegu canlyniadau nes bod gan bob lle yn y siart chwaraewr neu bye.",
    "Competition.ByeOutsideKnockout":
      "Dim ond cystadleuaeth taro allan all gael byes.",
    "Competition.NotDrawnToMeet":
      "Nid ydynt i fod i chwarae yn erbyn ei gilydd.",
    "Competition.WinnerHasPlayedOn":
      "Mae enillydd y gornest hon eisoes wedi chwarae ei gornest nesaf, felly ni ellir newid pwy a'i henillodd.",
    "CompetitionPlayer.Withdrawn":
      "Nid yw chwaraewr a dynnwyd yn ôl yn chwarae mwyach.",
    "admin.players.add": "Ychwanegu chwaraewr",
    "admin.players.none": "Dim chwaraewyr",
    "admin.players.edit": "Golygu",
    "admin.players.archive": "Archifo",
    "admin.players.restore": "Adfer",
    "admin.players.up": "I fyny",
    "admin.players.down": "I lawr",
    "admin.players.archiveTitle": "Archifo chwaraewr",
    "admin.players.archiveQuestion":
      "Caiff {name} ei dynnu o'r cystadlaethau hyn:",
    "admin.players.archive.explanation":
      "Ni fydd adfer y chwaraewr yn ei roi yn ôl yn y cystadlaethau hyn.",
    "admin.players.archived": "Chwaraewyr wedi'u harchifo",
    "admin.players.archivedSaid": "Wedi'i archifo",
    "admin.player.addTitle": "Ychwanegu chwaraewr",
    "admin.player.editTitle": "Golygu chwaraewr",
    "admin.player.name": "Enw",
    "admin.player.representing": "Yn cynrychioli",
    "admin.player.worldRankingName": "Enw ar Safleoedd y Byd",
    "admin.player.worldRankingKnown":
      "Mae Safleoedd y Byd yn adnabod yr enw hwn.",
    "admin.player.worldRankingQuestioned":
      "Nid oes gan Safleoedd y Byd chwaraewr â'r enw hwn. Efallai ei fod wedi'i gamsillafu, neu fod y chwaraewr yn newydd i'r safleoedd.",
    "admin.player.flag": "Baner",
    "admin.player.add": "Ychwanegu",
    "admin.player.save": "Cadw",
    "admin.player.added": "Ychwanegwyd {name}.",
    "admin.player.otherwise": "Ni ellir cadw'r chwaraewr hwn fel y mae.",
    "Tournament.PlayerNameTaken":
      "Mae gan chwaraewr arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "TournamentPlayer.NoSuchFlag": "Dewiswch un o'r baneri sydd ar gael.",
    "TournamentPlayer.NamedBye": "Ni all chwaraewr gael yr enw Bye.",
    "TournamentPlayer.NoLetterOrDigit": "Mae angen llythyren neu rif ar enw.",
    "admin.player.byesTitle": "Ni chaiff byes eu hychwanegu",
    "admin.player.byes":
      "Nid yw bye yn chwaraewr yn y twrnamaint. Mae cystadleuaeth taro allan yn cynnig Bye pan fydd ei chwaraewyr yn cael eu hychwanegu, cymaint o weithiau ag y mae ei siart ei angen.",
    "admin.view.teams": "Timau",
    "admin.view.tests": "Testau",
    "admin.teams.add": "Ychwanegu tîm",
    "admin.teams.none": "Dim timau",
    "admin.teams.edit": "Golygu",
    "admin.teams.view": "Gweld",
    "admin.teams.archive": "Archifo",
    "admin.teams.restore": "Adfer",
    "admin.teams.up": "I fyny",
    "admin.teams.down": "I lawr",
    "admin.teams.archived": "Timau wedi'u harchifo",
    "admin.teams.archivedSaid": "Wedi'i archifo",
    "admin.team.addTitle": "Ychwanegu tîm",
    "admin.team.editTitle": "Golygu tîm",
    "admin.team.name": "Enw",
    "admin.team.shortName": "Enw byr",
    "admin.team.shortName.explanation":
      "Sut mae testau'r tîm yn cael eu henwi, fel AUS v ENG.",
    "admin.team.flag": "Baner",
    "admin.team.add": "Ychwanegu",
    "admin.team.save": "Cadw",
    "admin.team.added": "Ychwanegwyd {name}.",
    "admin.team.otherwise": "Ni ellir cadw'r tîm hwn fel y mae.",
    "admin.teamView.otherwise": "Ni ellir gweld y tîm hwn o'r fan hon.",
    "admin.teamView.players": "Chwaraewyr",
    "TeamName.Missing": "Dywedwch beth yw enw'r tîm.",
    "TeamName.TooLong": "Mae'r enw hwnnw'n rhy hir.",
    "admin.notes.add": "Ychwanegu nodyn",
    "admin.notes.none": "Dim nodiadau",
    "admin.notes.edit": "Golygu",
    "admin.notes.delete": "Dileu",
    "admin.notes.deleteTitle": "Dileu nodyn",
    "admin.notes.deleteQuestion": "Dileu'r nodyn “{title}”?",
    "admin.notes.delete.explanation":
      "Mae nodyn a ddilëir wedi mynd am byth ac ni ellir ei gael yn ôl.",
    "admin.notes.otherwise": "Ni ellid gwneud hynny.",
    "admin.note.addTitle": "Ychwanegu nodyn",
    "admin.note.editTitle": "Golygu nodyn",
    "admin.note.title": "Teitl",
    "admin.note.description": "Disgrifiad",
    "admin.note.write": "Ysgrifennu",
    "admin.note.preview": "Rhagolwg",
    "admin.note.toolbar": "Fformatio",
    "admin.note.tool.heading": "Pennawd",
    "admin.note.tool.bold": "Print trwm",
    "admin.note.tool.italic": "Italig",
    "admin.note.tool.quote": "Dyfyniad",
    "admin.note.tool.code": "Cod",
    "admin.note.tool.link": "Dolen",
    "admin.note.tool.numberedList": "Rhestr wedi'i rhifo",
    "admin.note.tool.bulletedList": "Rhestr bwyntiau bwled",
    "admin.note.tool.taskList": "Rhestr tasgau",
    "admin.note.add": "Ychwanegu",
    "admin.note.save": "Cadw",
    "admin.note.otherwise": "Ni ellir cadw'r nodyn hwn fel hyn.",
    "ManagerNoteTitle.Missing": "Rhowch deitl i'r nodyn.",
    "ManagerNoteTitle.TooLong": "Mae'r teitl hwnnw'n rhy hir.",
    "ManagerNoteTitle.NoLetterOrDigit": "Mae angen llythyren neu rif ar deitl.",
    "ManagerNoteDescription.TooLong": "Mae'r disgrifiad hwnnw'n rhy hir.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Nid yw'r nodyn hwnnw yno mwyach. Efallai fod rheolwr arall wedi'i ddileu.",
    "EditManagerNote.NoSuchManagerNote":
      "Nid yw'r nodyn hwnnw yno mwyach. Efallai fod rheolwr arall wedi'i ddileu.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Nid yw'r nodyn hwnnw yno mwyach. Efallai fod rheolwr arall wedi'i ddileu.",
    "ManagerNote.Deleted":
      "Mae'r nodyn hwnnw wedi'i ddileu. Efallai fod rheolwr arall wedi'i ddileu.",
    "CommentaryTitle.Missing": "Rhowch deitl i'r sylwebaeth.",
    "CommentaryTitle.TooLong": "Mae'r teitl hwnnw'n rhy hir.",
    "CommentaryTitle.NoLetterOrDigit": "Mae angen llythyren neu rif ar deitl.",
    "Commentary.TitleTaken": "Mae gan sylwebaeth arall y teitl hwnnw eisoes.",
    "CommentText.Missing": "Ysgrifennwch rywbeth yn y sylw.",
    "CommentText.TooLong": "Mae'r sylw hwnnw'n rhy hir.",
    "TeamShortName.Missing": "Rhowch enw byr i'r tîm.",
    "TeamShortName.TooLong": "Gall enw byr fod hyd at 10 cymeriad.",
    "TeamShortName.NoLetterOrDigit": "Mae angen llythyren neu rif ar enw byr.",
    "Team.ShortNameLongerThanName":
      "Ni all enw byr fod yn hirach nag enw'r tîm.",
    "Team.NoSuchFlag": "Dewiswch un o'r baneri sydd ar gael.",
    "Team.Archived":
      "Mae'r tîm hwnnw wedi'i archifo, a rhaid ei adfer yn gyntaf.",
    "Team.InATest":
      "Mae'r tîm hwnnw'n chwarae mewn test, ac ni ellir ei archifo.",
    "Team.PlayerNameTaken":
      "Mae gan chwaraewr arall yn y tîm hwn yr enw hwnnw eisoes.",
    "TeamPlayer.NamedBye": "Ni all chwaraewr gael yr enw Bye.",
    "TeamPlayer.Archived":
      "Mae'r chwaraewr hwnnw wedi'i archifo, a rhaid ei adfer yn gyntaf.",
    "TeamPlayer.HasGames":
      "Mae'r chwaraewr hwnnw wedi chwarae, ac ni ellir ei archifo.",
    "Tournament.TeamNameTaken":
      "Mae gan dîm arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "Tournament.TeamShortNameTaken":
      "Mae gan dîm arall yn y twrnamaint hwn yr enw byr hwnnw eisoes.",
    "Tournament.NoSuchTeam":
      "Nid oes tîm yn y twrnamaint hwn yn y cyfeiriad hwn.",
    "Tournament.TeamArchived":
      "Mae'r tîm hwn wedi'i archifo, a dim ond o'r tab Timau y gellir ei adfer.",
    "admin.tests.add": "Ychwanegu test",
    "admin.tests.none": "Dim testau",
    "admin.tests.edit": "Golygu",
    "admin.tests.view": "Gweld",
    "admin.tests.archive": "Archifo",
    "admin.tests.restore": "Adfer",
    "admin.tests.up": "I fyny",
    "admin.tests.down": "I lawr",
    "admin.tests.archived": "Testau wedi'u harchifo",
    "admin.tests.twoTeamsNeeded":
      "Mae test rhwng dau dîm, felly mae angen dau dîm yn gyntaf.",
    "admin.tests.toTeams": "Mynd i Timau",
    "admin.tests.matches.one": "{count} gornest",
    "admin.tests.matches.other": "{count} gornest",
    "admin.tests.bestOf": "y gorau o {games}",
    "admin.tests.otherwise": "Ni ellid gwneud hynny.",
    "admin.test.addTitle": "Ychwanegu test",
    "admin.test.editTitle": "Golygu test",
    "admin.test.firstTeam": "Tîm A",
    "admin.test.secondTeam": "Tîm B",
    "admin.test.versus": "v",
    "admin.test.starts": "Yn dechrau",
    "admin.test.finishes": "Yn gorffen",
    "admin.test.expectedMatches": "Gornestau disgwyliedig",
    "admin.test.bestOf": "Y gorau o",
    "admin.test.group": "Grŵp",
    "admin.test.add": "Ychwanegu",
    "admin.test.save": "Cadw",
    "admin.test.added": "Ychwanegwyd {name}.",
    "admin.test.otherwise": "Ni ellir cadw'r test hwn fel y mae.",
    "admin.testView.otherwise": "Ni ellir gweld y test hwn o'r fan hon.",
    "AddTest.FirstTeamMissing": "Dewiswch y tîm cyntaf.",
    "AddTest.SecondTeamMissing": "Dewiswch yr ail dîm.",
    "UpdateTest.FirstTeamMissing": "Dewiswch y tîm cyntaf.",
    "UpdateTest.SecondTeamMissing": "Dewiswch yr ail dîm.",
    "ExpectedMatches.NotWhole": "Rhowch nifer cyflawn o gornestau.",
    "ExpectedMatches.TooSmall": "Rhaid i test ddisgwyl 1 gornest o leiaf.",
    "TestGroup.TooLong": "Mae'r grŵp hwnnw'n rhy hir.",
    "Tournament.TestAgainstItself":
      "Nid yw tîm yn chwarae test yn erbyn ei hun.",
    "Tournament.TestFinishesBeforeStarts":
      "Ni all test orffen cyn iddo ddechrau.",
    "Tournament.TestStartsBeforeTournament":
      "Ni all test ddechrau cyn ei dwrnamaint.",
    "Tournament.TestFinishesAfterTournament":
      "Ni all test orffen ar ôl ei dwrnamaint.",
    "Tournament.TestHasGamesInUse":
      "Mae gan y test hwn gemau, felly ni ellir ei archifo nes y caiff y rheini eu harchifo.",
    "Tournament.TestHasGames":
      "Mae gan y test hwn gemau eisoes, felly ni ellir newid ei dimau mwyach.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Mae mwy o gornestau na hynny eisoes wedi dechrau.",
    "Tournament.BestOfBelowGamesPlayed":
      "Mae dau chwaraewr eisoes wedi chwarae mwy o gemau na hynny.",
    "Competition.ExpectedMatchesReached":
      "Mae'r test hwn eisoes wedi dechrau'r holl gornestau y mae'n disgwyl eu cael.",
    "Competition.SameTeam":
      "Nid yw dau chwaraewr o'r un tîm yn chwarae yn erbyn ei gilydd.",
    "AddManager.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw unrhyw gyfrif y gellir ei wneud yn rheolwr.",
    "Account.NotAnAdministrator": "Dim ond gweinyddwr all wneud hynny.",
    "AddRole.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw unrhyw gyfrif y gellir rhoi'r rôl iddo.",
    "AddRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "RemoveRole.NoSuchAccount": "Nid oes cyfrif o'r fath.",
    "RemoveRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "RemoveRole.Yourself":
      "Ni allwch dynnu rôl y gweinyddwr oddi arnoch eich hun.",
    "AccountsWithRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "admin.scorers.add": "Ychwanegu sgoriwr",
    "admin.scorers.none": "Dim sgorwyr",
    "admin.scorers.removeTitle": "Tynnu sgoriwr",
    "admin.scorers.removeExplanation":
      "Ni fydd {name} yn gallu sgorio canlyniadau'r twrnamaint hwn mwyach.",
    "admin.scorers.otherwise": "Ni ellir gwneud y cyfeiriad hwnnw'n sgoriwr.",
    "AddScorer.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw unrhyw gyfrif y gellir ei wneud yn sgoriwr.",
    "Tournament.AlreadyAManager":
      "Mae'r cyfrif hwnnw eisoes yn rheoli'r twrnamaint, a gall wneud popeth y gall sgoriwr ei wneud.",

    "TournamentName.Missing": "Dywedwch beth yw enw'r twrnamaint.",
    "TournamentName.TooShort": "Mae'r enw hwnnw'n rhy fyr.",
    "TournamentName.TooLong": "Mae'r enw hwnnw'n rhy hir.",
    "TournamentName.AllLowerCase":
      "Ni chaiff enw ei ysgrifennu i gyd mewn llythrennau bach.",
    "TournamentName.AllCapitals":
      "Ni chaiff enw ei ysgrifennu i gyd mewn prif lythrennau.",
    "TournamentName.NoLetterOrDigit": "Mae angen llythyren neu rif ar enw.",
    "ReadOnlyDate.Unreadable": "Rhowch y diwrnod.",
    "Tournament.FinishesBeforeStarts":
      "Ni all twrnamaint orffen cyn iddo ddechrau.",
    "Tournament.StartsAfterNextYear":
      "Ni all twrnamaint ddechrau ar ôl y flwyddyn nesaf.",
    "Tournament.FinishesAfterNextYear":
      "Ni all twrnamaint orffen ar ôl y flwyddyn nesaf.",
    "CreateTournament.NoSuchCountry": "Dewiswch y wlad.",
    "TournamentSubtitle.TooLong":
      "Gall yr isdeitl fod hyd at 2000 o gymeriadau.",
    "Tournament.NotAManager": "Dim ond rheolwr y twrnamaint hwn all ei newid.",
    "Tournament.NotAManagerOrScorer":
      "Dim ond rheolwr neu sgoriwr y twrnamaint hwn all ei weld.",
    "Tournament.Archived":
      "Mae'r twrnamaint hwn wedi'i archifo, a rhaid ei adfer cyn y gellir ei newid.",
    "UpdateTournament.NoSuchTournament":
      "Nid oes twrnamaint yn y cyfeiriad hwn.",

    // Croquet is croce in Welsh, and the sports are named from it where a Welsh
    // term is in use. Ricochet and Gateball, which have none, keep their names, as
    // do the formats named for a competition, as a name is not translated.
    "sport.ac": "Croce Cymdeithas",
    "sport.gc": "Croce Golff",
    "sport.a6w": "Croce Americanaidd 6 Chylch",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Safonol",
    "format.teams": "Timau",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Emiradau Arabaidd Unedig",
    "country.af": "Affganistan",
    "country.ag": "Antigwa a Barbiwda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Yr Ariannin",
    "country.as": "Samoa Americanaidd",
    "country.at": "Awstria",
    "country.au": "Awstralia",
    "country.aw": "Aruba",
    "country.ax": "Ynysoedd Åland",
    "country.az": "Aserbaijan",
    "country.ba": "Bosnia a Hercegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Gwlad Belg",
    "country.bf": "Burkina Faso",
    "country.bg": "Bwlgaria",
    "country.bh": "Bahrain",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermiwda",
    "country.bn": "Brunei",
    "country.bo": "Bolifia",
    "country.br": "Brasil",
    "country.bs": "Y Bahamas",
    "country.bt": "Bhwtan",
    "country.bv": "Ynys Bouvet",
    "country.bw": "Botswana",
    "country.by": "Belarws",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalwnia",
    "country.cc": "Ynysoedd Cocos (Keeling)",
    "country.cd": "Gweriniaeth Ddemocrataidd y Congo",
    "country.cf": "Gweriniaeth Canolbarth Affrica",
    "country.cg": "Gweriniaeth y Congo",
    "country.ch": "Y Swistir",
    "country.ci": "Côte d'Ivoire",
    "country.ck": "Ynysoedd Cook",
    "country.cl": "Chile",
    "country.cm": "Camerŵn",
    "country.cn": "Tsieina",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Ciwba",
    "country.cv": "Cabo Verde",
    "country.cx": "Ynys y Nadolig",
    "country.cy": "Cyprus",
    "country.cz": "Tsiecia",
    "country.de": "Yr Almaen",
    "country.dj": "Djibouti",
    "country.dk": "Denmarc",
    "country.dm": "Dominica",
    "country.do": "Gweriniaeth Dominica",
    "country.dz": "Algeria",
    "country.ec": "Ecwador",
    "country.ee": "Estonia",
    "country.eg": "Yr Aifft",
    "country.eh": "Gorllewin Sahara",
    "country.england": "Lloegr",
    "country.er": "Eritrea",
    "country.es": "Sbaen",
    "country.et": "Ethiopia",
    "country.fi": "Y Ffindir",
    "country.fj": "Fiji",
    "country.fk": "Ynysoedd y Falkland",
    "country.fm": "Micronesia",
    "country.fo": "Ynysoedd Ffaro",
    "country.fr": "Ffrainc",
    "country.ga": "Gabon",
    "country.gb": "Y Deyrnas Unedig",
    "country.gd": "Grenada",
    "country.ge": "Georgia",
    "country.gf": "Guyane Ffrengig",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Yr Ynys Las",
    "country.gm": "Gambia",
    "country.gn": "Guinée",
    "country.gp": "Guadeloupe",
    "country.gq": "Guinea Gyhydeddol",
    "country.gr": "Gwlad Groeg",
    "country.gs": "De Georgia ac Ynysoedd Sandwich y De",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Cong",
    "country.hm": "Ynys Heard ac Ynysoedd McDonald",
    "country.hn": "Hondwras",
    "country.hr": "Croatia",
    "country.ht": "Haiti",
    "country.hu": "Hwngari",
    "country.id": "Indonesia",
    "country.ie": "Iwerddon",
    "country.il": "Israel",
    "country.im": "Ynys Manaw",
    "country.in": "India",
    "country.io": "Tiriogaeth Brydeinig Cefnfor India",
    "country.iq": "Irac",
    "country.ir": "Iran",
    "country.is": "Gwlad yr Iâ",
    "country.it": "Yr Eidal",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Gwlad yr Iorddonen",
    "country.jp": "Japan",
    "country.ke": "Kenya",
    "country.kg": "Cirgistan",
    "country.kh": "Cambodia",
    "country.ki": "Kiribati",
    "country.km": "Comoros",
    "country.kn": "Saint Kitts a Nevis",
    "country.kp": "Gogledd Corea",
    "country.kr": "De Corea",
    "country.kw": "Kuwait",
    "country.ky": "Ynysoedd Cayman",
    "country.kz": "Casachstan",
    "country.la": "Laos",
    "country.lb": "Libanus",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Lithwania",
    "country.lu": "Lwcsembwrg",
    "country.lv": "Latfia",
    "country.ly": "Libya",
    "country.ma": "Moroco",
    "country.mc": "Monaco",
    "country.md": "Moldofa",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Ynysoedd Marshall",
    "country.mk": "Gogledd Macedonia",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Ynysoedd Gogledd Mariana",
    "country.mq": "Martinique",
    "country.mr": "Mawritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mawrisiws",
    "country.mv": "Maldives",
    "country.mw": "Malawi",
    "country.mx": "Mecsico",
    "country.my": "Malaysia",
    "country.mz": "Mozambique",
    "country.na": "Namibia",
    "country.nc": "Caledonia Newydd",
    "country.ne": "Niger",
    "country.nf": "Ynys Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragwa",
    "country.nl": "Yr Iseldiroedd",
    "country.no": "Norwy",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Seland Newydd",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Periw",
    "country.pf": "Polynesia Ffrengig",
    "country.pg": "Papua Guinea Newydd",
    "country.ph": "Y Philipinau",
    "country.pk": "Pacistan",
    "country.pl": "Gwlad Pwyl",
    "country.pm": "Saint-Pierre-et-Miquelon",
    "country.pn": "Ynysoedd Pitcairn",
    "country.pr": "Puerto Rico",
    "country.ps": "Palesteina",
    "country.pt": "Portiwgal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Réunion",
    "country.ro": "Romania",
    "country.rs": "Serbia",
    "country.ru": "Rwsia",
    "country.rw": "Rwanda",
    "country.sa": "Saudi Arabia",
    "country.sb": "Ynysoedd Solomon",
    "country.sc": "Seychelles",
    "country.scotland": "Yr Alban",
    "country.sd": "Swdan",
    "country.se": "Sweden",
    "country.sg": "Singapore",
    "country.sh": "Saint Helena",
    "country.si": "Slofenia",
    "country.sj": "Svalbard a Jan Mayen",
    "country.sk": "Slofacia",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Swrinam",
    "country.st": "São Tomé a Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Syria",
    "country.sz": "Eswatini",
    "country.tc": "Ynysoedd Turks a Caicos",
    "country.td": "Tsiad",
    "country.tf": "Tiriogaethau Ffrengig y De",
    "country.tg": "Togo",
    "country.th": "Gwlad Thai",
    "country.tj": "Tajicistan",
    "country.tk": "Tokelau",
    "country.tl": "Dwyrain Timor",
    "country.tm": "Tyrcmenistan",
    "country.tn": "Tiwnisia",
    "country.to": "Tonga",
    "country.tr": "Twrci",
    "country.tt": "Trinidad a Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tansanïa",
    "country.ua": "Wcráin",
    "country.ug": "Uganda",
    "country.um": "Mân Ynysoedd Allanol yr Unol Daleithiau",
    "country.us": "Yr Unol Daleithiau",
    "country.uy": "Wrwgwái",
    "country.uz": "Wsbecistan",
    "country.va": "Dinas y Fatican",
    "country.vc": "Saint Vincent a'r Grenadines",
    "country.ve": "Venezuela",
    "country.vg": "Ynysoedd Virgin Prydain",
    "country.vi": "Ynysoedd Virgin yr Unol Daleithiau",
    "country.vn": "Fietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Cymru",
    "country.wf": "Wallis a Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yemen",
    "country.yt": "Mayotte",
    "country.za": "De Affrica",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    // The emails are the English ones, rewritten rather than translated line by
    // line; the placeholders each fills in are english.ts's, and say there what
    // they are.

    "Email.ConfirmAddress.subject":
      "Cadarnhewch eich cyfeiriad e-bost ar gyfer {siteName}",
    "Email.ConfirmAddress.body": `
<p>Helo,</p>

<p>
    Diolch am greu cyfrif gyda <strong>{siteName}</strong>.<br />
    Cyn y gallwch ddechrau defnyddio eich cyfrif, cadarnhewch eich cyfeiriad
    e-bost drwy glicio ar y botwm isod:
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
        Cadarnhau fy nghyfeiriad e-bost
    </a>
</p>

<p>
    Os na fydd y botwm yn gweithio, gallwch hefyd gadarnhau eich cyfeiriad e-bost drwy agor y ddolen hon yn eich porwr:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Os na wnaethoch greu'r cyfrif hwn, gallwch anwybyddu'r e-bost hwn.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Dolen newydd i gadarnhau eich cyfeiriad e-bost ar gyfer {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Helo,</p>

<p>
    Yn ddiweddar, gofynnoch am e-bost newydd i gadarnhau eich cyfeiriad e-bost ar gyfer <strong>{siteName}</strong>.<br />
    Cadarnhewch eich cyfeiriad e-bost drwy glicio ar y botwm isod:
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
        Cadarnhau fy nghyfeiriad e-bost
    </a>
</p>

<p>
    Os na fydd y botwm yn gweithio, gallwch hefyd gadarnhau eich cyfeiriad e-bost drwy agor y ddolen hon yn eich porwr:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Unwaith y bydd wedi'i gadarnhau, gallwch fynd ymlaen i ddefnyddio eich cyfrif heb ymyrraeth.
</p>

<p>
    Os na ofynnoch am yr e-bost hwn, gallwch ei anwybyddu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Mae rhywun wedi ceisio cofrestru gyda'ch cyfeiriad e-bost",
    "Email.AlreadyRegistered.body": `
<p>Helo,</p>

<p>
    Mae rhywun wedi ceisio cofrestru ar <strong>{siteName}</strong> gyda'r
    cyfeiriad e-bost hwn, sydd â chyfrif eisoes. Nid oes dim wedi newid yn eich
    cyfrif.<br />
    Os mai chi oedd e, mae gennych gyfrif eisoes a gallwch fewngofnodi iddo:
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
        Mewngofnodi
    </a>
</p>

<p>
    Os ydych wedi anghofio eich cyfrinair, gallwch ei ailosod yma:
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
        Rwyf wedi anghofio fy nghyfrinair
    </a>
</p>

<p>
    Os nad chi oedd e, nid oes angen i chi wneud dim. Ni chafodd neb ffordd i
    mewn i'ch cyfrif.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Cadarnhewch symud eich cyfrif {siteName} i'r cyfeiriad hwn",
    "Email.ConfirmNewEmailAddress.body": `
<p>Helo,</p>

<p>
    Mae rhywun sydd wedi mewngofnodi i gyfrif <strong>{siteName}</strong> wedi
    gofyn am ei symud i'r cyfeiriad e-bost hwn. Os mai chi oedd e, cadarnhewch
    hynny yma, wedi mewngofnodi i'r cyfrif hwnnw. Mae'r ddolen yn gweithio am
    24 awr.
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
        Symud fy nghyfrif
    </a>
</p>

<p>
    Neu copïwch y ddolen hon i'ch porwr:<br />
    {link}
</p>

<p>
    Os nad chi oedd e, nid oes angen i chi wneud dim. Ni chaiff unrhyw gyfrif ei symud yma.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Mae rhywun wedi gofyn am symud cyfrif i'ch cyfeiriad e-bost",
    "Email.AlreadyHasAnAccount.body": `
<p>Helo,</p>

<p>
    Mae rhywun sydd wedi mewngofnodi i gyfrif <strong>{siteName}</strong> wedi
    gofyn am ei symud i'r cyfeiriad e-bost hwn, sydd â'i gyfrif ei hun eisoes.
    Ni symudwyd dim, ac nid oes dim wedi newid yn eich cyfrif.
</p>

<p>
    Os mai chi oedd e, mae gennych gyfrif eisoes ar y cyfeiriad hwn a gallwch
    fewngofnodi iddo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Mae eich cyfrif {siteName} wedi'i symud",
    "Email.EmailAddressChanged.body": `
<p>Helo,</p>

<p>
    Mae eich cyfrif <strong>{siteName}</strong> newydd gael ei symud i gyfeiriad
    e-bost arall, {emailAddress}, ac o hyn ymlaen byddwch yn mewngofnodi gyda'r
    cyfeiriad hwnnw.
</p>

<p>
    Os nad chi oedd e, mae rhywun arall wedi cael gafael ar eich cyfrif. Atebwch
    yr e-bost hwn a rhowch wybod i ni.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Mae eich cyfrinair {siteName} wedi'i newid",
    "Email.PasswordChanged.body": `
<p>Helo,</p>

<p>
    Mae cyfrinair eich cyfrif <strong>{siteName}</strong> newydd gael ei newid, ac mae pob porwr arall a oedd wedi mewngofnodi wedi'i allgofnodi.<br />
    Os mai chi oedd e, nid oes angen i chi wneud dim.
</p>

<p>
    Os nad chi oedd e, mae rhywun arall wedi cael gafael ar eich cyfrinair.
    Gosodwch un newydd yma ac fe'i hallgofnodir:
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
        Rwyf wedi anghofio fy nghyfrinair
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Gosodwch gyfrinair newydd ar gyfer {siteName}",
    "Email.SetNewPassword.body": `
<p>Helo,</p>

<p>
    Yn ddiweddar, gofynnoch am ailosod eich cyfrinair <strong>{siteName}</strong>.<br />
    Gallwch ei ailosod drwy glicio ar y botwm isod:
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
        Ailosod cyfrinair
    </a>
</p>

<p>
    Os na fydd y botwm yn gweithio, gallwch hefyd ailosod eich cyfrinair drwy agor y ddolen hon yn eich porwr:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Os na ofynnoch am ailosod eich cyfrinair, gallwch anwybyddu'r e-bost hwn.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Gosodwch gyfrinair ar gyfer {siteName}",
    "Email.SetPassword.body": `
<p>Helo,</p>

<p>
    Nid oes gan eich cyfrif <strong>{siteName}</strong> gyfrinair: rydych yn mewngofnodi gyda Google.<br />
    Rydych wedi gofyn am osod un, er mwyn gallu mewngofnodi hefyd gyda'ch cyfeiriad e-bost a chyfrinair.
    Gallwch ei osod drwy glicio ar y botwm isod:
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
        Gosod cyfrinair
    </a>
</p>

<p>
    Os na fydd y botwm yn gweithio, gallwch hefyd osod eich cyfrinair drwy agor y ddolen hon yn eich porwr:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Mae'r ddolen yn gweithio am awr. Os na ofynnoch am osod cyfrinair, gallwch anwybyddu'r e-bost hwn.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Nid oes cyfrif {siteName} ar gyfer y cyfeiriad e-bost hwn",
    "Email.RegisterInstead.body": `
<p>Helo,</p>

<p>
    Gofynnwyd am ailosod cyfrinair ar gyfer cyfeiriad e-bost nad yw'n gysylltiedig
    ag unrhyw gyfrif <strong>{siteName}</strong>.
</p>

<p>
    Os hoffech ddefnyddio ein gwasanaeth, gallwch greu cyfrif newydd yma:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Os na wnaethoch y cais hwn, gallwch anwybyddu'r e-bost hwn.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Cadarnhewch eich bod am i'ch cyfrif {siteName} gael ei anghofio",
    "Email.ConfirmForgetting.body": `
<p>Helo,</p>

<p>
    Rydych wedi gofyn i'ch cyfrif <strong>{siteName}</strong> gael ei anghofio.<br />
    Dilynwch y botwm isod i weld beth mae hynny'n ei olygu, ac i gadarnhau'n
    ddiogel mai dyna a ddymunwch:
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
        Anghofio fy nghyfrif
    </a>
</p>

<p>
    Os na fydd y botwm yn gweithio, gallwch hefyd agor y ddolen hon yn eich porwr:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ar ôl ei anghofio, ni all neb ddarllen eich enw na'ch cyfeiriad e-bost eto,
    ac ni ellir mewngofnodi i'ch cyfrif. Ni ellir dadwneud hyn.
</p>

<p>
    Mae'r ddolen yn gweithio unwaith yn unig, hyd at 15 munud ar ôl i chi ofyn,
    a dim ond tra byddwch wedi mewngofnodi i'r cyfrif hwn. Wedi hynny, gofynnwch
    eto o'ch cyfrif.
</p>

<p>
    Os nad chi a ofynnodd, ni fydd dim yn digwydd oni bai bod rhywun yn dilyn y
    ddolen. Eto i gyd, mae rhywun sydd wedi mewngofnodi i'ch cyfrif wedi gofyn,
    felly gosodwch gyfrinair newydd o'r dudalen cyfrinair anghofiedig i wneud
    yn siŵr na all fewngofnodi eto.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Mae cofrestru wedi'i atal: ni ellir cysylltu â {service}",
    "Email.RegistrationsSuspended.body": `
<p>Helo,</p>

<p>
    Ni lwyddodd {siteName} i gysylltu â {service} am {when}. Hyd nes y bydd yn
    ymateb, dywedir wrth y rhai sydd ei angen, i gofrestru neu i osod cyfrinair
    newydd, am roi cynnig arall arni nes ymlaen.
</p>

<p>
    Nid oes dim i'w godi. Mae pob ymgais yn holi {service} eto, ac mae'r
    tudalennau'n gweithio unwaith eto cyn gynted ag y bydd yn ymateb.
</p>

<p>
    Tra bydd {service} yn dal i beidio ag ymateb, ni chewch fwy nag un e-bost yr
    awr amdano.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "Ni all {siteName} gyrraedd ei gronfa ddata",
    "Email.DatabaseUnreachable.body": `
<p>Helo,</p>

<p>
    Ni allai {siteName} gyrraedd ei gronfa ddata am {when}. Nes ei bod yn ateb, mae pob tudalen sydd ei hangen yn dweud wrth ddarllenwyr nad yw’r wefan ar gael ac i roi cynnig arni eto yn nes ymlaen.
</p>

<p>
    Nid oes angen dadflocio dim. Mae pob cais yn gofyn am gysylltiad o’r newydd, ac mae’r wefan yn gweithio eto’r eiliad y mae’r gronfa ddata’n ateb.
</p>

<p>
    Tra bydd y gronfa ddata i lawr, byddwch yn cael e-bost amdani unwaith bob {minutes} munud ar y mwyaf.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
