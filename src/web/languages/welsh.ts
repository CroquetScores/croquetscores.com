// The site's words in Welsh (Cymraeg), written afresh rather than from another
// language's file. The reader is addressed as "chi", the polite and plural
// form, throughout. Menu items, buttons and headings are written in sentence
// case, as Welsh writes them, not with a capital on every word. "Email address"
// is "cyfeiriad e-bost" and a bare "email" is "e-bost". A label's colon belongs
// to its words. The words the site itself looks for ("Bye" as a player's name,
// and the words of the terms-of-use link) stay as English says them.
import type { Language } from "../common/language.js";

export const welsh: Language = {
  tag: "cy",
  name: "Cymraeg",
  words: {
    // The site's own bars.
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
    "footer.termsOfUse": "Telerau defnyddio",
    "beta.banner": "Gwefan beta yw hon. Gellir ailosod y data ar unrhyw adeg.",
    "privacy.contact":
      "Cwestiynau am y dudalen hon, neu am yr hyn a gedwir amdanoch: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write.
    // The link's words are found in the box's, so they are written exactly as
    // they are there.
    "termsOfUse.agree": "Rwy'n cytuno i'r telerau defnyddio",
    "termsOfUse.link": "telerau defnyddio",
    "termsOfUse.report":
      "Rhowch wybod am yr hyn a ysgrifennwyd, neu holwch am y telerau hyn: {emailAddress}",
    "TermsOfUse.NotAgreed": "Ticiwch y blwch i gytuno i'r telerau defnyddio.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Dyma le diogel i ddysgu {siteName}. Gellir dileu unrhyw beth a roddir yma ar unrhyw adeg.",

    "language.label": "Iaith",
    "language.choose": "Newid",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Mae rhywbeth newydd i'w ddarllen.",
    "whatsNew.admin.message":
      "Mae rhywbeth newydd i'r bobl sy'n cynnal twrnameintiau.",
    "whatsNew.view": "Gweld yr hyn sy'n newydd",
    "whatsNew.later": "Atgoffwch fi y tro nesaf",
    "whatsNew.never": "Peidiwch byth â dangos y neges hon i mi",

    "form.otherwise":
      "Mae rhywbeth o'i le yma. Gwiriwch yr hyn a roddwyd a rhowch gynnig arall arni.",

    // The account menu in the header.
    "account.menu": "Cyfrif",
    "account.register": "Cofrestru",
    "account.signIn": "Mewngofnodi",
    "account.forgotPassword": "Wedi anghofio'r cyfrinair",
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
    // Said above the form when Google sent the reader back without them being
    // let in.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Nid yw Google wedi cadarnhau mai eich cyfeiriad e-bost chi yw hwnnw, felly ni ellir ei ddefnyddio gyda Google yma. Defnyddiwch eich cyfeiriad e-bost isod yn lle hynny.",
    "SignInWithGoogle.LinkedToAnother":
      "Mae gan y cyfeiriad e-bost hwnnw gyfrif eisoes, sydd wedi'i gysylltu â chyfrif Google gwahanol. Mewngofnodwch gyda'r cyfrif Google hwnnw, neu gyda'ch cyfeiriad e-bost a'ch cyfrinair.",
    "SignInWithGoogle.NameMissing":
      "Ni ddywedodd Google wrthym beth yw eich enw, ac mae ei angen ar gyfrif. Defnyddiwch eich cyfeiriad e-bost isod yn lle hynny.",
    "Google.Unreachable":
      "Ni ellid cysylltu â Google ar hyn o bryd. Rhowch gynnig arall arni ymhen ychydig funudau, neu defnyddiwch eich cyfeiriad e-bost isod.",
    "Registration.NotAPerson":
      "Nid oedd hyn yn edrych fel pe bai wedi dod gan berson. Rhowch gynnig arall arni, ac os bydd yn dal i ddigwydd, arhoswch ychydig funudau a dewch yn ôl.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Rhowch gyfeiriad e-bost.",
    "EmailAddress.NoAt": "Mae @ mewn cyfeiriad e-bost.",
    "EmailAddress.MoreThanOneAt": "Mae un @ yn unig mewn cyfeiriad e-bost.",
    "EmailAddress.NoDomain":
      "Mae parth ar ôl yr @ mewn cyfeiriad e-bost, fel example.com.",

    "welcome.title": "Gwiriwch eich e-bost",
    "welcome.checkEmail":
      "Mae e-bost ar ei ffordd i'r cyfeiriad a roesoch. Dilynwch y ddolen ynddo i fynd ymlaen.",
    "welcome.nothingArrived":
      "Os na fydd dim yn cyrraedd ymhen ychydig funudau, edrychwch yn eich ffolder sothach neu sbam.",
    "welcome.home": "Yn ôl i {siteName}",
    "newConfirmationLink.title": "Cael dolen newydd",
    "newConfirmationLink.explanation":
      "Mae'r ddolen i gadarnhau eich cyfeiriad e-bost wedi dod i ben. Gofynnwch am un newydd a chaiff ei hanfon i'r cyfeiriad y cofrestroch gydag ef.",
    "newConfirmationLink.send": "Anfonwch ddolen newydd ataf",
    "newConfirmationLink.home": "Yn ôl i {siteName}",
    "newConfirmationLink.signIn": "Mewngofnodi",
    "newConfirmationLink.sent.title": "Gwiriwch eich e-bost",
    "newConfirmationLink.sent.explanation":
      "Mae dolen newydd ar ei ffordd. Dilynwch hi i gadarnhau eich cyfeiriad e-bost. Os na fydd dim yn cyrraedd ymhen ychydig funudau, edrychwch yn eich ffolder sothach neu sbam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Mae'r cyfeiriad e-bost hwnnw eisoes wedi'i gadarnhau",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Nid oes dim mwy i'w gadarnhau. Mewngofnodwch gyda'r cyfrinair a roesoch pan wnaethoch ei gadarnhau.",
    "newConfirmationLink.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio mwyach",
    "newConfirmationLink.noLongerWorks.explanation":
      "Gwiriwch eich bod wedi dilyn y ddolen gyfan o'r e-bost, heb i ddim fod ar goll o'i diwedd. Os na fydd yn gweithio o hyd, cofrestrwch eto a chaiff dolen newydd ei hanfon.",
    "newConfirmationLink.tooMany.title": "Rhowch gynnig arall arni nes ymlaen",
    "newConfirmationLink.tooMany.explanation":
      "Anfonwyd sawl dolen i'r cyfeiriad hwn yn ddiweddar. Arhoswch awr a gofynnwch eto, ac edrychwch yn eich ffolder sothach neu sbam yn y cyfamser.",

    "forgotPassword.title": "Wedi anghofio eich cyfrinair?",
    "forgotPassword.emailAddress": "Cyfeiriad e-bost",
    "forgotPassword.submit": "Anfonwch ffordd yn ôl i mewn ataf",
    "forgotPassword.home": "Yn ôl i {siteName}",
    "forgotPassword.sent.title": "Gwiriwch eich e-bost",
    "forgotPassword.sent.explanation":
      "Os oes gan y cyfeiriad hwnnw gyfrif, mae dolen i osod cyfrinair newydd ar ei ffordd. Dilynwch hi o fewn yr awr. Os na fydd dim yn cyrraedd ymhen ychydig funudau, edrychwch yn eich ffolder sothach neu sbam.",
    "forgotPassword.tryAgainLater":
      "Gofynnwyd am ormod o ffyrdd yn ôl i mewn o'r fan hon yn ddiweddar. Arhoswch awr a rhowch gynnig arall arni.",

    "setNewPassword.title": "Gosod cyfrinair newydd",
    "setNewPassword.password": "Cyfrinair",
    "setNewPassword.confirmPassword": "Cadarnhau'r cyfrinair",
    "setNewPassword.submit": "Gosod fy nghyfrinair newydd",
    "setNewPassword.home": "Yn ôl i {siteName}",
    "setNewPassword.signIn": "Mewngofnodi",
    "setNewPassword.askAgain": "Gofyn am ddolen newydd",
    "setNewPassword.changed.title": "Mae eich cyfrinair wedi'i newid",
    "setNewPassword.changed.explanation":
      "Rydych wedi'ch allgofnodi ym mhobman y buoch wedi mewngofnodi. Mewngofnodwch gyda'ch cyfrinair newydd.",
    "setNewPassword.expired.title": "Mae'r ddolen honno wedi dod i ben",
    "setNewPassword.expired.explanation":
      "Mae dolen i osod cyfrinair newydd yn gweithio am awr. Gofynnwch am un arall, a chaiff ei hanfon i'r un cyfeiriad.",
    "setNewPassword.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio mwyach",
    "setNewPassword.noLongerWorks.explanation":
      "Efallai ei bod eisoes wedi'i defnyddio, neu efallai fod rhywbeth ar goll o'i diwedd. Gofynnwch am un arall os oes ei hangen arnoch o hyd.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Ni ellir gwirio eich cyfrinair ar hyn o bryd, felly nid yw wedi'i newid. Rhowch gynnig arall arni ymhen ychydig funudau; mae eich dolen yn dal i weithio nes iddi ddod i ben.",

    "forgetAccount.title": "Anghofio eich cyfrif",
    "forgetAccount.explanation":
      "Gellir gwneud eich enw a'ch cyfeiriad e-bost yn annarllenadwy am byth, a chau eich cyfrif. I fod yn siŵr mai chi sydd yno, byddwn yn anfon dolen mewn e-bost i gyfeiriad eich cyfrif yn gyntaf, ac ni chaiff dim ei anghofio nes y byddwch wedi ei dilyn.",
    "forgetAccount.submit": "Anfonwch y ddolen ataf",
    "forgetAccount.sent.title": "Gwiriwch eich e-bost",
    "forgetAccount.sent.explanation":
      "Rydym wedi anfon dolen i gyfeiriad eich cyfrif. Mae'n gweithio am 15 munud, a dim ond tra byddwch wedi mewngofnodi i'r cyfrif hwn.",
    "forgetAccount.confirm.title": "Anghofio eich cyfrif am byth?",
    "forgetAccount.confirm.explanation":
      "Unwaith y bydd wedi'i anghofio, ni all neb ddarllen eich enw a'ch cyfeiriad e-bost byth eto, ac ni ellir mewngofnodi i'ch cyfrif. Ni ellir dadwneud hyn.",
    "forgetAccount.confirm.submit": "Anghofio fy nghyfrif",
    "forgetAccount.forgotten.title": "Mae eich cyfrif wedi'i anghofio",
    "forgetAccount.forgotten.explanation":
      "Ni ellir darllen eich enw a'ch cyfeiriad e-bost mwyach, ac rydych wedi'ch allgofnodi ym mhobman y buoch wedi mewngofnodi.",
    "forgetAccount.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio mwyach",
    "forgetAccount.noLongerWorks.explanation":
      "Efallai ei bod wedi dod i ben, wedi'i defnyddio eisoes, neu'n perthyn i gyfrif nad ydych wedi mewngofnodi iddo. Gofynnwch eto o'ch cyfrif os ydych yn dal eisiau ei anghofio.",
    "forgetAccount.lastAdministrator.title": "Ni ellir anghofio eich cyfrif",
    "forgetAccount.lastAdministrator.explanation":
      "Chi yw unig weinyddwr y wefan hon. Rhowch rôl y Gweinyddwr i rywun arall, ac yna gellir anghofio eich cyfrif.",
    "forgetAccount.askAgain": "Gofyn eto",
    "forgetAccount.home": "Yn ôl i {siteName}",

    "registrationsSuspended.title": "Mae cofrestru wedi'i atal am y tro",
    "registrationsSuspended.explanation":
      "Ni ellir cysylltu â gwasanaeth y mae cofrestru ei angen ar hyn o bryd, felly ni all neb gofrestru nes y bydd yn ateb eto. Ni chadwyd dim a deipiwyd gennych.",
    "registrationsSuspended.tryAgainLater":
      "Rhowch gynnig arall arni ymhen ychydig. Mae gweinyddwr y wefan wedi cael gwybod.",
    "registrationsSuspended.home": "Yn ôl i {siteName}",

    "signIn.title": "Mewngofnodi",
    "signIn.emailAddress": "Cyfeiriad e-bost",
    "signIn.password": "Cyfrinair",
    "signIn.submit": "Mewngofnodi",
    "signIn.forgotPassword": "Wedi anghofio'r cyfrinair?",
    "signIn.register": "Cofrestru",
    "signIn.withGoogle": "Mewngofnodi gyda Google",
    "signIn.or": "neu",
    "signIn.tryAgainLater":
      "Gwnaed gormod o ymdrechion yn ddiweddar. Arhoswch awr a rhowch gynnig arall arni.",

    // The one answer to a wrong password and to an address nobody registered.
    "SignIn.Failed":
      "Mae'r cyfeiriad e-bost neu'r cyfrinair yn anghywir. Rhowch gynnig arall arni.",

    "profile.title": "Proffil",
    // A label's colon is its words'.
    "profile.name": "Enw:",
    "profile.emailAddress": "Cyfeiriad e-bost:",

    "changeName.title": "Newid enw",
    "changeName.name": "Enw",
    "changeName.submit": "Newid enw",

    "setPassword.title": "Gosod cyfrinair",
    "setPassword.explanation":
      "Nid oes gan eich cyfrif gyfrinair: rydych yn mewngofnodi gyda Google. I fewngofnodi gyda chyfrinair hefyd, byddwn yn anfon dolen i un gael ei osod i {emailAddress}.",
    "setPassword.submit": "Anfonwch ddolen ataf",
    "setPassword.sent.title": "Gwiriwch eich e-bost",
    "setPassword.sent.explanation":
      "Rydym wedi anfon dolen atoch i osod cyfrinair. Mae'n gweithio am awr.",
    "setPassword.profile": "Yn ôl i'ch proffil",

    "changePassword.title": "Newid cyfrinair",
    "changePassword.currentPassword": "Y cyfrinair presennol",
    "changePassword.password": "Cyfrinair newydd",
    "changePassword.passwordConfirmation": "Cadarnhau'r cyfrinair",
    "changePassword.forgotPassword": "Wedi anghofio'r cyfrinair?",
    "changePassword.submit": "Newid cyfrinair",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Nid dyna eich cyfrinair.",

    "changeEmailAddress.title": "Newid cyfeiriad e-bost",
    "changeEmailAddress.emailAddress": "Cyfeiriad e-bost newydd",
    "changeEmailAddress.currentPassword": "Y cyfrinair presennol",
    "changeEmailAddress.submit": "Anfon dolen i gadarnhau",
    "changeEmailAddress.sent.title": "Gwiriwch eich e-bost",
    "changeEmailAddress.sent.explanation":
      "Mae dolen i gadarnhau'r symud wedi'i hanfon i'r cyfeiriad e-bost newydd. Dilynwch hi, wedi mewngofnodi, i symud eich cyfrif yno.",
    "changeEmailAddress.confirm.title": "Symud eich cyfrif",
    "changeEmailAddress.confirm.explanation":
      "Bydd eich cyfrif yn symud i {emailAddress}. Byddwch yn mewngofnodi gyda'r cyfeiriad hwnnw o hyn ymlaen.",
    "changeEmailAddress.confirm.submit": "Symud fy nghyfrif",
    "changeEmailAddress.noLongerWorks.title":
      "Nid yw'r ddolen hon yn gweithio mwyach",
    "changeEmailAddress.noLongerWorks.explanation":
      "Mae wedi dod i ben, wedi'i defnyddio, neu ni chafodd ei hanfon ar gyfer y cyfrif rydych wedi mewngofnodi iddo. Gofynnwch eto o'ch proffil.",
    "changeEmailAddress.taken.title": "Nid yw eich cyfrif wedi symud",
    "changeEmailAddress.profile": "Yn ôl i'ch proffil",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Nid dyna eich cyfrinair.",
    "ChangeEmailAddress.Unchanged":
      "Mae eich cyfrif yn y cyfeiriad hwn eisoes.",
    "ChangeEmailAddress.Taken":
      "Mae gan y cyfeiriad e-bost hwnnw ei gyfrif ei hun erbyn hyn, felly ni all eich cyfrif symud yno.",

    "confirmEmailAddress.title": "Cadarnhau eich cyfeiriad e-bost",
    "confirmEmailAddress.name": "Enw",
    "confirmEmailAddress.password": "Cyfrinair",
    "confirmEmailAddress.confirmPassword": "Cadarnhau'r cyfrinair",
    "confirmEmailAddress.submit": "Cadarnhau fy nghyfeiriad e-bost",
    "confirmEmailAddress.signIn": "Mewngofnodi",
    "confirmEmailAddress.home": "Yn ôl i {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Mae eich cyfeiriad e-bost wedi'i gadarnhau",
    "confirmEmailAddress.confirmed.explanation":
      "Mae eich cyfrif yn barod. Mewngofnodwch gyda'r cyfeiriad e-bost a'r cyfrinair rydych newydd eu rhoi.",
    "confirmEmailAddress.expired.title": "Mae'r ddolen honno wedi dod i ben",
    "confirmEmailAddress.expired.explanation":
      "Mae dolen i gadarnhau cyfeiriad e-bost yn gweithio am 24 awr. Gofynnwch am un newydd, a chaiff ei hanfon i'r un cyfeiriad.",
    "confirmEmailAddress.expired.newLink": "Anfonwch ddolen newydd ataf",
    "confirmEmailAddress.noLongerWorks.title":
      "Nid yw'r ddolen honno'n gweithio mwyach",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Gwiriwch eich bod wedi dilyn y ddolen gyfan o'r e-bost, heb i ddim fod ar goll o'i diwedd. Os na fydd yn gweithio o hyd, cofrestrwch eto a chaiff dolen newydd ei hanfon.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Mae'r cyfeiriad e-bost hwnnw eisoes wedi'i gadarnhau",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Nid oes dim mwy i'w wneud. Mewngofnodwch gyda'r cyfrinair a roesoch pan wnaethoch ei gadarnhau.",

    // A rule broken, keyed by its code. Said to whoever typed it, beneath the
    // field it reads.
    "PersonName.Missing": "Rhowch enw.",
    "PersonName.TooShort": "Rhaid i enw fod o leiaf 3 nod.",
    "PersonName.TooLong": "Gall enw fod hyd at 254 nod ar y mwyaf.",
    "WorldRankingName.TooShort":
      "Rhaid i enw ar restr detholion y byd fod o leiaf 3 nod.",
    "WorldRankingName.TooLong":
      "Gall enw ar restr detholion y byd fod hyd at 254 nod ar y mwyaf.",
    "Password.Missing": "Rhowch gyfrinair.",
    "Password.TooShort": "Rhaid i gyfrinair fod o leiaf 12 nod.",
    "Password.ConfirmationDiffers":
      "Nid yw hwn yr un fath â'r cyfrinair uchod. Teipiwch ef eto.",
    "Password.Breached":
      "Mae'r cyfrinair hwn yn un sydd wedi ymddangos mewn tor-data yn rhywle arall, felly nid yw'n ddiogel ei ddefnyddio yma. Dewiswch un arall.",

    "javaScriptRequired.title": "Mae angen sgriptio",
    "javaScriptRequired.explanation":
      "Mae cofrestru angen sgriptio wedi'i droi ymlaen ar gyfer y wefan hon, fel y gall wirio mai person sy'n cofrestru. Trowch ef ymlaen, yna cofrestrwch eto.",
    "javaScriptRequired.register": "Yn ôl at gofrestru",
    "javaScriptRequired.home": "Yn ôl i {siteName}",

    "errors.backHome": "Yn ôl i {siteName}",
    "errors.notFound": "Heb ei ganfod",
    "errors.refused": "Ni ellid gwneud hynny",
    "errors.refusedDetail": "Roedd rhywbeth o'i le yn yr hyn a anfonwyd.",
    "errors.sorry": "Mae'n ddrwg gennym",
    "errors.sorryDetail": "Ni ellid ymdrin â'r cais hwnnw.",
    "errors.failed": "Aeth rhywbeth o'i le",
    "errors.reference": "Cyfeirnod {reference}.",
    "errors.recorded":
      "Mae'r gwall wedi'i gofnodi ac mae e-bost wedi'i anfon at y gweinyddwr. Mae'n help anfon e-bost at y gweinyddwr gyda'r cyfeirnod a disgrifiad o'r hyn roeddech yn ei wneud.",
    "errors.message": "Anfon e-bost at y gweinyddwr",
    "errors.messageSubject": "Gwall {reference} ar {siteName}",
    "errors.messageBody": "Yr hyn roeddwn yn ei wneud pan ddigwyddodd hyn:\n\n",
    "errors.unavailable": "Nid yw'r wefan ar gael",
    "errors.unavailableDetail":
      "Ni all y wefan gyrraedd yr hyn sydd ei angen arni ar hyn o bryd. Rhowch gynnig arall arni nes ymlaen.",
    "errors.maintenance": "Mae'r wefan i lawr ar gyfer gwaith cynnal a chadw.",
    "errors.maintenanceMinutes":
      "Disgwylir iddi ddychwelyd ymhen {minutes} munud.",
    "errors.maintenanceMinute": "Disgwylir iddi ddychwelyd ymhen 1 funud.",
    "errors.maintenanceLonger":
      "Mae'n cymryd yn hirach na'r disgwyl a bydd yn ôl cyn bo hir.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Canlyniadau diweddar",
    "home.recentResults.none":
      "Ni ychwanegwyd unrhyw gemau yn ystod y saith diwrnod diwethaf.",
    "home.upcomingTournaments": "Twrnameintiau i ddod",
    "home.upcomingTournaments.none":
      "Nid oes unrhyw dwrnameintiau'n dechrau yn ystod y chwe deg diwrnod nesaf.",
    "home.allTournaments": "Pob twrnamaint yn {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Twrnameintiau yn {year}",
    "year.none": "Nid oes unrhyw dwrnameintiau'n dechrau yn {year}.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "Twrnameintiau {sport} yn {year}",
    "yearSport.none":
      "Nid oes unrhyw dwrnameintiau {sport} yn dechrau yn {year}.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Diweddar",
    "tournament.summary": "Crynodeb",
    // A tournament played by teams' summary, and a test's grid.
    "test.bestOf": "Yr orau o {count} yw pob gêm.",
    "test.vs": "yn erbyn",
    "test.matches": "Gemau",
    "test.games": "Gemau unigol",
    "test.hoops": "Cylchau",
    "teamSummary.tests": "Profion",
    "teamSummary.matches": "Gemau",
    "teamSummary.games": "Gemau unigol",
    "teamSummary.hoops": "Cylchau",
    "teamSummary.wins": "Buddugoliaethau",
    "teamSummary.losses": "Colledion",
    "teamSummary.draws": "Gemau cyfartal",
    "teamSummary.for": "O blaid",
    "teamSummary.against": "Yn erbyn",
    "teamSummary.net": "Net",
    "tournament.players": "Chwaraewyr",
    "search.label": "Chwilio",
    "search.tournaments": "Twrnameintiau",
    "search.competitions": "Cystadlaethau",
    "search.nothingFound": "Ni ddaethpwyd o hyd i ddim.",
    "players.search.label": "Chwilio am chwaraewyr",
    "players.search.prompt": "Teipiwch enw chwaraewr i ddod o hyd iddo.",
    "players.search.none": "Ni ddaethpwyd o hyd i unrhyw chwaraewyr.",
    "search.more":
      "Dim ond y {count} cyntaf a ddangosir. Ychwanegwch ragor o'r enw i gyfyngu'r chwiliad.",
    "websitePlayer.tournament": "Twrnamaint",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} yn erbyn {second}",
    "tournament.notes": "Nodiadau",
    "tournament.commentary": "Sylwebaeth",
    "tournament.beat": "a gurodd",
    "tournament.drewWith": "a gafodd gêm gyfartal â",
    "tournament.ago.seconds": "{count} eiliad",
    "tournament.ago.minutes": "{count} munud",
    "tournament.ago.hour": "1 awr",
    "tournament.ago.hours": "{count} awr",
    "tournament.none": "Ni chwaraewyd unrhyw gemau eto.",
    // A tournament's players' page, when it has none.
    "players.none": "Ni ychwanegwyd unrhyw chwaraewyr eto.",
    // A tournament's commentaries page.
    "commentaries.by": "gan",
    "commentaries.start": "Dechrau sylwebaeth newydd",
    // The page that starts a commentary.
    "startCommentary.title": "Dechrau sylwebaeth newydd",
    "startCommentary.titleField": "Teitl",
    "startCommentary.submit": "Dechrau sylwebaeth",
    // "New" is said to a screen reader in place of the red asterisk.
    "marks.new": "newydd",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Nid yw'r rheolwyr wedi ysgrifennu unrhyw nodiadau eto.",
    "note.edited": "wedi'i olygu",
    // A commentary's page.
    "commentary.none": "Ni ysgrifennwyd unrhyw sylwadau eto.",
    "commentary.edited": "wedi'i olygu",
    "commentary.edit": "Golygu",
    "commentary.delete": "Dileu",
    "commentary.comment": "Sylw",
    "commentary.add": "Ychwanegu sylw",
    "commentary.notSent":
      "Ni ellid anfon y sylw. Llwythwch y dudalen eto i weld a gafodd ei gadw.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Newid teitl",
    "changeCommentaryTitle.submit": "Cadw",
    // A comment's own page, and the page that asks before it is deleted.
    "editComment.title": "Golygu sylw",
    "editComment.save": "Cadw",
    "deleteComment.title": "Dileu sylw",
    "deleteComment.question": "Dileu'r sylw hwn? Ni ellir ei ddadwneud.",
    "deleteComment.confirm": "Dileu sylw",
    "deleteComment.keep": "Ei gadw",
    // A player's page.
    "player.games": "Gemau",
    "player.competitions": "Cystadlaethau",
    "player.beat": "a gurodd",
    "player.lostTo": "a gollodd i",
    "player.drewWith": "a gafodd gêm gyfartal â",
    "player.score": "{score} i {opponent}",
    "player.noGames": "Ni chwaraewyd unrhyw gemau eto.",
    "player.noCompetitions": "Heb gystadlu mewn unrhyw gystadleuaeth eto.",
    // A block's page.
    "block.wins": "Buddugoliaethau",
    "block.matches": "Gemau",
    "block.netGames": "Gemau net",
    "block.games": "Gemau unigol",
    "block.netHoops": "Cylchau net",
    "block.won": "wedi ennill",
    "block.lost": "wedi colli",
    "block.drawn": "cyfartal",
    "block.withdrawn": "wedi tynnu'n ôl",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "wedi'i dynnu'n ôl",
    "block.losses": "Colledion",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Golygfeydd",
    "competition.view.grid": "Grid",
    "competition.view.summary": "Crynodeb",
    "competition.view.orderOfPlay": "Trefn chwarae",
    "competition.print": "Argraffu",
    "blockSummary.ranking":
      "Wedi'u trefnu yn ôl cyfran y gemau a enillwyd, yna yn ôl cylchau net. Gall rheolau twrnamaint ei hun osod ei chwaraewyr mewn trefn wahanol.",
    "orderOfPlay.none": "Ni chwaraewyd unrhyw gemau eto.",
    // A knockout's rounds, and a bye drawn in place of a player.
    "knockout.round.final": "Rownd derfynol",
    "knockout.round.semis": "Rowndiau cyn-derfynol",
    "knockout.round.quarters": "Rowndiau wyth olaf",
    "knockout.round.number": "Rownd {number}",
    "knockout.bye": "Bye",
    // A Swiss's table.
    "swiss.games": "Gemau unigol",
    "swiss.wins": "Buddugoliaethau",
    "swiss.winShare": "% a enillwyd",
    "swiss.results": "Canlyniadau",
    // The arrows that scroll a knockout's grid.
    "knockout.onward": "Rowndiau diweddarach",
    "knockout.back": "Rowndiau cynharach",
    // What every list of tournaments shares.
    "tournamentList.column.date": "Dyddiad",
    "tournamentList.column.name": "Enw",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Twrnameintiau yn {country} yn unig",
    "tournamentList.filter.country": "Gwlad",
    "tournamentList.filter.anyCountry": "Unrhyw wlad",
    "tournamentList.filter.region": "Rhanbarth",
    "tournamentList.filter.anyRegion": "Unrhyw ranbarth",
    "tournamentList.filter.noRegionsBefore":
      "Nid oes rhanbarthau i dwrnameintiau cyn Tachwedd 2026.",
    "tournamentList.filter.sport": "Camp",
    "tournamentList.filter.anySport": "Unrhyw gamp",
    "tournamentList.filter.submit": "Hidlo",
    // The years there are tournaments in.
    "years.label": "Blynyddoedd",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Blynyddoedd cynharach",

    // The admin's words.
    "admin.newerBuild.message": "Mae fersiwn newyddach o'r wefan hon ar gael.",
    "admin.newerBuild.reload": "Ail-lwytho",
    "admin.title": "Gweinyddu",
    "admin.tournaments.new": "Twrnamaint newydd",
    "admin.tournaments.none": "Dim twrnameintiau",
    "admin.tournaments.filter.none": "Dim twrnameintiau'n cyfateb",
    "admin.tournaments.show": "Dangos",
    "admin.tournaments.managerScorer": "Rheolwr/Sgoriwr",
    "admin.tournaments.worldRanking": "Safle'r Byd",
    "admin.tournaments.notWorldRanking": "Ddim yn Safle'r Byd",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Wedi'i archifo",
    "admin.tournaments.manage": "Rheoli",
    "admin.tournaments.edit": "Golygu",
    "admin.tournaments.archive": "Archifo",
    "admin.tournaments.restore": "Adfer",
    "admin.tournaments.scores": "Sgorau",
    "admin.tournaments.players": "Chwaraewyr",
    "admin.years.label": "Blynyddoedd",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Blynyddoedd cynharach",
    "admin.tournament.name": "Enw",
    "admin.tournament.starts": "Yn dechrau",
    "admin.tournament.finishes": "Yn gorffen",
    "admin.tournament.format": "Fformat",
    "admin.tournament.sport": "Camp",
    "admin.tournament.country": "Gwlad",
    "admin.tournament.region": "Rhanbarth",
    "admin.tournament.subtitle": "Is-deitl",
    "admin.rules.handicap": "Chwarae gyda handicapiau",
    "admin.rules.drawsAllowed": "Caniatáu canlyniadau cyfartal",
    "admin.tournament.levelTestsDrawn": "Cyfrif profion cyfartal yn gyfartal",
    "admin.rules.worldRankings": "Yn cyfrif tuag at restr detholion y byd",
    "admin.tournament.national": "Digwyddiad lefel genedlaethol",
    "admin.tournament.international": "Digwyddiad lefel ryngwladol",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Ni ellir derbyn hyn fel y mae.",
    "admin.newTournament.title": "Twrnamaint newydd",
    "admin.newTournament.submit": "Creu twrnamaint",
    "admin.editTournament.title": "Golygu twrnamaint",
    "admin.editTournament.submit": "Diweddaru twrnamaint",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "Ni ellir newid y twrnamaint hwn.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Twrnamaint",
    "admin.view.players": "Chwaraewyr",
    "admin.view.competitions": "Cystadlaethau",
    "admin.view.managers": "Rheolwyr",
    "admin.view.notes": "Nodiadau",
    "admin.view.scorers": "Sgorwyr",
    "admin.view.rankings": "Detholion",
    "admin.rankings.file":
      "Bydd rhestr detholion y byd yn defnyddio canlyniadau'r twrnamaint drwy'r swyddogaeth hon, felly nid oes angen i'r rheolwyr wneud dim.",
    "admin.rankings.download": "Lawrlwytho gemau ar gyfer Safle'r Byd",
    "rankings.notAvailable": "Nid yw'r detholion ar gael",
    "rankings.notAvailable.sport":
      "Nid oes gan gamp y twrnamaint hwn restr detholion y byd, felly nid oes detholion i'w hanfon.",
    "rankings.notAvailable.notCounted":
      "Nid oes yr un o gystadlaethau'r twrnamaint hwn yn cyfrif tuag at restr detholion y byd.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "Ni ellir rhedeg y twrnamaint hwn o'r fan hon.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Cystadleuaeth",
    "admin.competitionView.players": "Chwaraewyr",
    "admin.competitionView.scores": "Sgorau",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "Y twrnamaint a'i gystadlaethau",
    "admin.sections.tournament": "Twrnamaint",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Tudalennau'r gweinyddwr",
    "admin.administrator.sections.tournaments": "Twrnameintiau",
    "admin.administrator.sections.accounts": "Cyfrifon",
    "admin.administrator.sections.worldRankings": "Detholion y byd",
    "admin.administrator.sections.importErrors": "Gwallau mewnforio",
    "admin.administrator.sections.logs": "Logiau",
    "admin.administrator.sections.databaseStatus": "Mynediad i'r gronfa ddata",
    "admin.databaseStatus.title": "Mynediad i'r gronfa ddata",
    "admin.databaseStatus.on": "Mae mynediad i'r gronfa ddata ymlaen.",
    "admin.databaseStatus.off":
      "Mae mynediad i'r gronfa ddata wedi'i ddiffodd.",
    "admin.databaseStatus.expected":
      "Disgwylir i'r wefan ddychwelyd ymhen {minutes} munud.",
    "admin.databaseStatus.expectedOne":
      "Disgwylir i'r wefan ddychwelyd ymhen 1 funud.",
    "admin.databaseStatus.longer": "Mae'n cymryd yn hirach na'r disgwyl.",
    "admin.databaseStatus.told": "Dywedir wrth ddarllenwyr: {words}",
    "admin.databaseStatus.toldUsual":
      "Dywedir y frawddeg arferol wrth ddarllenwyr.",
    "admin.databaseStatus.minutes": "Munudau a ddisgwylir",
    "admin.databaseStatus.words": "Geiriau i ddarllenwyr",
    "admin.databaseStatus.turnOff": "Diffodd",
    "admin.databaseStatus.change": "Newid",
    "admin.databaseStatus.turnOn": "Troi ymlaen",
    "admin.databaseStatus.minutesNeeded": "Mae angen y munudau.",
    "admin.databaseStatus.otherwise": "Aeth rhywbeth o'i le ar y wefan.",
    "DatabaseAccess.MinutesNotWhole": "Rhaid i'r munudau fod yn rif cyfan.",
    "DatabaseAccess.MinutesOutOfRange": "Rhaid i'r munudau fod rhwng 1 a 1440.",
    "DatabaseAccess.WordsTooLong": "Rhaid i'r geiriau fod yn 500 nod neu lai.",
    "DatabaseAccess.NotOff":
      "Nid yw mynediad i'r gronfa ddata wedi'i ddiffodd.",
    "admin.administrator.title": "Gweinyddwr",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Cyfrifon",
    "admin.roles.add": "Ychwanegu",
    "admin.roles.administrator.heading": "Gweinyddwyr",
    "admin.roles.administrator.none": "Dim gweinyddwyr eraill",
    "admin.roles.administrator.removeTitle": "Tynnu gweinyddwr",
    "admin.roles.administrator.removeExplanation":
      "Ni fydd {name} yn weinyddwr ar y wefan hon mwyach.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Swyddogion detholion y byd Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Dim swyddogion detholion y byd Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Tynnu swyddog detholion y byd Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "Ni fydd {name} yn swyddog detholion y byd Association Croquet mwyach.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Swyddogion detholion y byd Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Dim swyddogion detholion y byd Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Tynnu swyddog detholion y byd Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "Ni fydd {name} yn swyddog detholion y byd Golf Croquet mwyach.",
    // The page where the world ranking players are imported, and its log.
    "admin.worldRankings.title": "Mewnforio chwaraewyr detholion y byd",
    "admin.worldRankings.import": "Mewnforio",
    "admin.worldRankings.log": "Sut aeth y mewnforio",
    "admin.worldRankings.ac.reading": "Darllen rhestr Association Croquet",
    "admin.worldRankings.ac.read":
      "Chwaraewyr Association Croquet a ddarllenwyd: {players}",
    "admin.worldRankings.ac.kept":
      "Chwaraewyr Association Croquet a gadwyd: {players}",
    "admin.worldRankings.ac.refused":
      "Ni ellid darllen rhestr Association Croquet, felly gadawyd ei chwaraewyr fel yr oeddent.",
    "admin.worldRankings.gc.reading": "Darllen rhestr Golf Croquet",
    "admin.worldRankings.gc.read":
      "Chwaraewyr Golf Croquet a ddarllenwyd: {players}",
    "admin.worldRankings.gc.kept":
      "Chwaraewyr Golf Croquet a gadwyd: {players}",
    "admin.worldRankings.gc.refused":
      "Ni ellid darllen rhestr Golf Croquet, felly gadawyd ei chwaraewyr fel yr oeddent.",
    "admin.worldRankings.finished": "Wedi gorffen",
    "admin.worldRankings.failed": "Ni orffennodd y mewnforio.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Aeth rhywbeth o'i le ar y wefan.",
    "WorldRankingLists.Unreachable":
      "Ni ellid cysylltu â gwefan detholion y byd.",
    "WorldRankingLists.Unreadable":
      "Nid yw'r rhestr wedi'i threfnu fel y mae detholion y byd yn trefnu eu rhai hwy: ni ellid darllen llinell ynddi, nid oes neb arni, neu nid yw wedi'i hysgrifennu mewn UTF-8.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Gwallau mewnforio",
    "admin.importErrors.none": "Dim gwallau mewnforio",
    "admin.importErrors.otherwise": "Aeth rhywbeth o'i le ar y wefan.",
    "admin.logs.title": "Logiau",
    "admin.logs.severity": "Difrifoldeb",
    "admin.logs.text": "Chwilio am",
    "admin.logs.show": "Dangos",
    "admin.logs.prune": "Tocio",
    "admin.logs.pruneAsk":
      "Dileu'r log o cyn yr awr ddiwethaf? Ni all dim ei ddwyn yn ôl.",
    "admin.logs.removed": "Dilëwyd {count} cofnod",
    "admin.logs.none": "Dim cofnodion log",
    "admin.logs.otherwise": "Aeth rhywbeth o'i le ar y wefan.",
    "admin.hover.logs.show": "Dangos y cofnodion sy'n cyfateb",
    "admin.hover.logs.prune": "Dileu'r log o cyn yr awr ddiwethaf",
    "admin.hover.logs.pruneAgree": "Dileu'r log o cyn yr awr ddiwethaf",
    "admin.importError.title": "Gwall mewnforio",
    "admin.importError.documentId": "Id y ddogfen",
    "admin.importError.tournament": "Twrnamaint",
    "admin.importError.competition": "Cystadleuaeth",
    "admin.importError.newSite": "Y wefan newydd",
    "admin.importError.oldSite": "Yr hen wefan",
    "ImportErrorKept.NotFound":
      "Ni chadwodd y mewnforio unrhyw wall yn erbyn y ddogfen honno.",
    "admin.competitionView.otherwise":
      "Ni ellir rhedeg y gystadleuaeth hon o'r fan hon.",
    // The Competitions tab.
    "admin.competitions.block": "Bloc",
    "admin.competitions.knockout": "Cnoc-owt",
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
    "admin.competition.bestOf": "Yr orau o",
    "admin.competition.rounds": "Rowndiau",
    "admin.competition.places": "Lleoedd",
    "admin.competition.round": "Rownd {number}",
    "admin.competition.bestOfs": "Yr orau o, fesul rownd",
    "admin.competition.quarters": "Wyth olaf",
    "admin.competition.semis": "Cyn-derfynol",
    "admin.competition.final": "Rownd derfynol",
    "admin.competition.add": "Ychwanegu",
    "admin.competition.save": "Cadw",
    "admin.competition.added": "Ychwanegwyd {name}.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Ni ellir cadw'r gystadleuaeth hon fel y mae.",
    "CompetitionName.Missing": "Rhowch enw.",
    "CompetitionName.TooLong": "Gall enw fod hyd at 254 nod ar y mwyaf.",
    "CompetitionName.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn enw.",
    "Tournament.KnockoutPlayerHasGames":
      "Mae gan y chwaraewyr yn y tynnu hwn gemau, felly ni ellir newid ei leoedd.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Ni ellir gwneud rownd sydd â gêm wedi'i phenderfynu yn orau o nifer llai.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Ni ellir newid rownd ar ôl chwarae gêm mewn rownd ddiweddarach.",
    "Tournament.CompetitionNameTaken":
      "Mae gan gystadleuaeth arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "BestOf.NotWhole": "Rhowch nifer cyfan o gemau.",
    "BestOf.TooSmall": "Rhaid i gêm fod yr orau o 1 gêm o leiaf.",
    "Rounds.NotWhole": "Rhowch nifer cyfan o rowndiau.",
    "Rounds.TooSmall": "Rhaid chwarae bloc mewn 1 rownd o leiaf.",
    "KnockoutDraw.EvenBestOf":
      "Rhaid i gêm cnoc-owt gael enillydd, felly mae'n orau o nifer odrif o gemau.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Creu twrnamaint newydd",
    "admin.hover.tournaments.manage":
      "Rheoli chwaraewyr, timau, cystadlaethau a sgorau'r twrnamaint hwn",
    "admin.hover.tournaments.edit": "Newid manylion y twrnamaint hwn",
    "admin.hover.tournaments.scores": "Rhoi sgorau'r twrnamaint hwn i mewn",
    "admin.hover.tournaments.players": "Gofalu am chwaraewyr y twrnamaint hwn",
    "admin.hover.competitions.view":
      "Agor y gystadleuaeth hon i weld a rhoi i mewn ei chwaraewyr a'i sgorau",
    "admin.hover.tests.view": "Agor y prawf hwn i weld a rhoi i mewn ei sgorau",
    "admin.hover.teams.view": "Agor y tîm hwn i weld a rheoli ei chwaraewyr",
    "admin.hover.dialog.player.add":
      "Ychwanegu'r chwaraewr hwn at y twrnamaint",
    "admin.hover.dialog.player.save": "Cadw'r newidiadau i'r chwaraewr hwn",
    "admin.hover.dialog.team.add": "Ychwanegu'r tîm hwn at y twrnamaint",
    "admin.hover.dialog.team.save": "Cadw'r newidiadau i'r tîm hwn",
    "admin.hover.dialog.test.add": "Ychwanegu'r prawf hwn at y twrnamaint",
    "admin.hover.dialog.test.save": "Cadw'r newidiadau i'r prawf hwn",
    "admin.hover.dialog.competition.add":
      "Ychwanegu'r gystadleuaeth hon at y twrnamaint",
    "admin.hover.dialog.competition.save":
      "Cadw'r newidiadau i'r gystadleuaeth hon",
    "admin.hover.dialog.score.add": "Ychwanegu'r sgôr hwn at y gystadleuaeth",
    "admin.hover.dialog.score.save": "Cadw'r cywiriad i'r sgôr hwn",
    "admin.hover.dialog.carryForward.save":
      "Cario canlyniadau'r chwaraewr hwn ymlaen",
    "admin.hover.dialog.tournament.new": "Creu'r twrnamaint hwn",
    "admin.hover.dialog.tournament.edit":
      "Cadw'r newidiadau i'r twrnamaint hwn",
    "admin.hover.modal.cancel": "Cau hwn heb gadw dim",
    "admin.hover.modal.ok": "Cau'r neges hon",
    "admin.hover.tab": "Dangos y tab {name}",
    "admin.hover.tournaments.archive":
      "Archifo'r twrnamaint hwn; gellir ei adfer",
    "admin.hover.tournaments.restore":
      "Dod â'r twrnamaint archifedig hwn yn ôl",
    "admin.hover.players.add": "Ychwanegu chwaraewr at y twrnamaint hwn",
    "admin.hover.players.edit": "Newid manylion y chwaraewr hwn",
    "admin.hover.players.up": "Symud y chwaraewr hwn i fyny'r rhestr",
    "admin.hover.players.down": "Symud y chwaraewr hwn i lawr y rhestr",
    "admin.hover.players.archive": "Archifo'r chwaraewr hwn; gellir ei adfer",
    "admin.hover.players.restore": "Dod â'r chwaraewr archifedig hwn yn ôl",
    "admin.hover.teams.add": "Ychwanegu tîm at y twrnamaint hwn",
    "admin.hover.teams.edit": "Newid manylion y tîm hwn",
    "admin.hover.teams.up": "Symud y tîm hwn i fyny'r rhestr",
    "admin.hover.teams.down": "Symud y tîm hwn i lawr y rhestr",
    "admin.hover.teams.archive": "Archifo'r tîm hwn; gellir ei adfer",
    "admin.hover.teams.restore": "Dod â'r tîm archifedig hwn yn ôl",
    "admin.hover.competitions.add":
      "Ychwanegu cystadleuaeth at y twrnamaint hwn",
    "admin.hover.competitions.edit": "Newid manylion y gystadleuaeth hon",
    "admin.hover.competitions.up": "Symud y gystadleuaeth hon i fyny'r rhestr",
    "admin.hover.competitions.down":
      "Symud y gystadleuaeth hon i lawr y rhestr",
    "admin.hover.competitions.archive":
      "Archifo'r gystadleuaeth hon; gellir ei hadfer",
    "admin.hover.competitions.restore":
      "Dod â'r gystadleuaeth archifedig hon yn ôl",
    "admin.hover.tests.add": "Ychwanegu prawf rhwng dau dîm",
    "admin.hover.tests.edit": "Newid manylion y prawf hwn",
    "admin.hover.tests.up": "Symud y prawf hwn i fyny'r rhestr",
    "admin.hover.tests.down": "Symud y prawf hwn i lawr y rhestr",
    "admin.hover.tests.archive": "Archifo'r prawf hwn; gellir ei adfer",
    "admin.hover.tests.restore": "Dod â'r prawf archifedig hwn yn ôl",
    "admin.hover.tests.toTeams":
      "Mynd i'r tab Timau i ychwanegu'r timau sydd eu hangen ar brawf",
    "admin.hover.scores.add": "Ychwanegu sgôr gêm at y gystadleuaeth hon",
    "admin.hover.scores.edit": "Cywiro'r sgôr hwn",
    "admin.hover.scores.archive":
      "Archifo'r sgôr hwn fel nad yw'n cyfrif mwyach; gellir ei adfer",
    "admin.hover.scores.restore":
      "Dod â'r sgôr archifedig hwn yn ôl, fel ei fod yn cyfrif eto",
    "admin.hover.scores.withdraw":
      "Cadw'r sgôr hwn ar y rhestr ond rhoi'r gorau i'w gyfrif",
    "admin.hover.scores.unwithdraw":
      "Gwneud i'r sgôr hwn a dynnwyd yn ôl gyfrif eto",
    "admin.hover.scores.up": "Symud y sgôr hwn yn gynharach yn y rhestr",
    "admin.hover.scores.down": "Symud y sgôr hwn yn hwyrach yn y rhestr",
    "admin.hover.competitionPlayers.add":
      "Rhoi'r chwaraewr a ddewiswyd yn y gystadleuaeth hon",
    "admin.hover.competitionPlayers.up":
      "Symud y chwaraewr hwn i fyny'r rhestr",
    "admin.hover.competitionPlayers.down":
      "Symud y chwaraewr hwn i lawr y rhestr",
    "admin.hover.competitionPlayers.remove":
      "Tynnu'r chwaraewr hwn allan o'r gystadleuaeth",
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
    "admin.hover.note.save": "Cadw'r newidiadau i'r nodyn hwn",
    "admin.hover.people.add": "Rhoi'r rôl i'r person hwn",
    "admin.hover.people.remove": "Cymryd y rôl oddi ar y person hwn",
    "admin.hover.worldRankings.import":
      "Nôl detholion y byd ac ychwanegu eu chwaraewyr",
    "admin.modal.cancel": "Diddymu",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "Iawn",
    // The Managers and Scorers tabs.
    "admin.people.emailAddress": "Cyfeiriad e-bost",
    "admin.people.remove": "Tynnu",
    "admin.people.otherwise": "Ni ellid gwneud hynny.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Chi",
    "admin.managers.add": "Ychwanegu rheolwr",
    "admin.managers.email": "E-bostio'r rheolwyr",
    "admin.managers.none": "Dim rheolwyr",
    "admin.managers.removeTitle": "Tynnu rheolwr",
    "admin.managers.removeExplanation":
      "Ni fydd {name} yn gallu rhedeg y twrnamaint hwn mwyach.",
    "admin.managers.removeYourself.explanation":
      "Ni fyddwch yn gallu rhedeg y twrnamaint hwn mwyach, ac ni all neb yma ddadwneud hynny i chi. Gall rheolwr arall eich gwneud yn rheolwr eto.",
    "admin.managers.otherwise": "Ni ellir gwneud y cyfeiriad hwnnw'n rheolwr.",
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Ychwanegu chwaraewr",
    "admin.competitionPlayers.otherwise": "Ni ellir ychwanegu'r chwaraewr hwn.",
    "admin.competitionPlayers.choose": "Chwaraewr i'w ychwanegu",
    "admin.competitionPlayers.nobody": "Dewiswch chwaraewr",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Mae pob chwaraewr yn y gystadleuaeth",
    "admin.competitionPlayers.none": "Dim chwaraewyr",
    "admin.competitionPlayers.up": "I fyny",
    "admin.competitionPlayers.down": "I lawr",
    "admin.competitionPlayers.remove": "Tynnu",
    "admin.competitionPlayers.withdraw": "Tynnu'n ôl",
    "admin.competitionPlayers.unwithdraw": "Dad-dynnu'n ôl",
    "admin.competitionPlayers.withdrawn": "Chwaraewyr a dynnwyd yn ôl",
    "admin.competitionPlayers.removeTitle": "Tynnu chwaraewr",
    "admin.competitionPlayers.removeQuestion":
      "Caiff {name} ei dynnu allan o'r gystadleuaeth. Ni ellir dadwneud hyn.",
    "admin.competitionPlayers.withdrawTitle": "Tynnu chwaraewr yn ôl",
    "admin.competitionPlayers.withdrawQuestion":
      "Ni fydd {name} yn chwarae rhagor o'r gystadleuaeth, a phenderfynir y gemau nad yw wedi'u chwarae hebddo.",
    "admin.competitionPlayers.carryForward": "Cario ymlaen",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Cario ymlaen - {name}",
    "admin.carryForward.save": "Cadw",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "Ni ellir cadw'r cario ymlaen hwn.",
    "admin.carryForward.matchWins": "Gemau a enillwyd",
    "admin.carryForward.matchLosses": "Gemau a gollwyd",
    "admin.carryForward.gameWins": "Gemau unigol a enillwyd",
    "admin.carryForward.gameLosses": "Gemau unigol a gollwyd",
    "admin.carryForward.hoopsFor": "Cylchau o blaid",
    "admin.carryForward.hoopsAgainst": "Cylchau yn erbyn",
    "CarryForward.MatchWinsNotWhole": "Rhowch nifer cyfan o gemau a enillwyd.",
    "CarryForward.MatchWinsBelowZero": "Rhowch 0 neu fwy o gemau a enillwyd.",
    "CarryForward.MatchLossesNotWhole": "Rhowch nifer cyfan o gemau a gollwyd.",
    "CarryForward.MatchLossesBelowZero": "Rhowch 0 neu fwy o gemau a gollwyd.",
    "CarryForward.GameWinsNotWhole":
      "Rhowch nifer cyfan o gemau unigol a enillwyd.",
    "CarryForward.GameWinsBelowZero":
      "Rhowch 0 neu fwy o gemau unigol a enillwyd.",
    "CarryForward.GameLossesNotWhole":
      "Rhowch nifer cyfan o gemau unigol a gollwyd.",
    "CarryForward.GameLossesBelowZero":
      "Rhowch 0 neu fwy o gemau unigol a gollwyd.",
    "CarryForward.HoopsForNotWhole": "Rhowch nifer cyfan o gylchau o blaid.",
    "CarryForward.HoopsForBelowZero": "Rhowch 0 neu fwy o gylchau o blaid.",
    "CarryForward.HoopsAgainstNotWhole":
      "Rhowch nifer cyfan o gylchau yn erbyn.",
    "CarryForward.HoopsAgainstBelowZero":
      "Rhowch 0 neu fwy o gylchau yn erbyn.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Ychwanegu sgôr",
    "admin.scores.none": "Dim sgorau",
    "admin.scores.edit": "Golygu",
    "admin.scores.drawNotFilledTitle": "Tynnu heb ei lenwi",
    "admin.scores.archive": "Archifo",
    "admin.scores.up": "I fyny",
    "admin.scores.down": "I lawr",
    "admin.scores.restore": "Adfer",
    "admin.scores.archived": "Sgorau wedi'u harchifo",
    "admin.scores.archivedSaid": "Wedi'i archifo",
    "admin.scores.withdraw": "Tynnu'n ôl",
    "admin.scores.unwithdraw": "Dad-dynnu'n ôl",
    "admin.scores.withdrawnSaid": "Wedi'i dynnu'n ôl",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "Ni ellid gwneud hynny.",
    "admin.score.title": "Ychwanegu sgôr",
    "admin.score.add": "Ychwanegu gêm",
    "admin.score.winner": "Enillydd",
    "admin.score.winnerScore": "Sgôr yr enillydd",
    "admin.score.loser": "Collwr",
    "admin.score.loserScore": "Sgôr y collwr",
    "admin.score.beat": "a gurodd",
    "admin.score.added":
      "Ychwanegwyd y gêm a enillodd {winner} yn erbyn {loser}.",
    "admin.score.otherwise": "Ni ellid ychwanegu'r gêm.",
    "admin.score.correctTitle": "Golygu sgôr",
    "admin.score.save": "Cadw",
    "admin.score.notCorrected": "Ni ellid cywiro'r sgôr.",
    "Game.WinnerMissing": "Dewiswch yr enillydd.",
    "Game.WinnerScoreMissing": "Teipiwch sgôr yr enillydd.",
    "Game.LoserMissing": "Dewiswch y collwr.",
    "Game.LoserScoreMissing": "Teipiwch sgôr y collwr.",
    "Score.NoPoints": "Mae sgôr yn dechrau gyda'i nifer o bwyntiau.",
    "Game.SamePlayer": "Nid yw neb yn chwarae yn erbyn ei hun.",
    "Game.WinnerNotAhead":
      "Rhaid i sgôr yr enillydd fod yn fwy na sgôr y collwr, neu wedi'i farcio fel un a enillwyd.",
    "Game.LoserMarked": "Ni ellir marcio sgôr y collwr fel un a enillwyd.",
    "Game.ResultChanged":
      "Mae cywiriad yn cadw'r canlyniad: erys gêm a enillwyd yn gêm a enillwyd, ac erys gêm gyfartal yn gyfartal.",
    "Competition.MatchDecided": "Mae eu gêm eisoes wedi'i phenderfynu.",
    "Competition.DrawFull":
      "Ni ellir ychwanegu'r chwaraewr oherwydd bod y gnoc-owt yn llawn.",
    "Competition.DrawNotFilled":
      "Ni ellir ychwanegu sgorau nes bod pob lle yn y gnoc-owt wedi'i lenwi â chwaraewr neu bye.",
    "Competition.ByeOutsideKnockout": "Dim ond cnoc-owt all gael bye.",
    "Competition.NotDrawnToMeet":
      "Nid yw'r chwaraewyr hyn wedi'u tynnu i chwarae yn erbyn ei gilydd yn y gnoc-owt ar hyn o bryd.",
    "Competition.WinnerHasPlayedOn":
      "Mae enillydd y gêm hon eisoes wedi chwarae ei gêm nesaf, felly ni ellir newid pwy a'i henillodd.",
    "CompetitionPlayer.Withdrawn":
      "Nid yw chwaraewr a dynnwyd yn ôl yn chwarae rhagor.",
    "admin.players.add": "Ychwanegu chwaraewr",
    "admin.players.none": "Dim chwaraewyr",
    "admin.players.edit": "Golygu",
    "admin.players.archive": "Archifo",
    "admin.players.restore": "Adfer",
    "admin.players.up": "I fyny",
    "admin.players.down": "I lawr",
    // Asked before archiving a player who is in competitions.
    "admin.players.archiveTitle": "Archifo chwaraewr",
    "admin.players.archiveQuestion":
      "Caiff {name} ei dynnu o'r cystadlaethau hyn:",
    "admin.players.archive.explanation":
      "Ni fydd ei adfer yn ei roi yn ôl yn y cystadlaethau hyn.",
    "admin.players.archived": "Chwaraewyr wedi'u harchifo",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Wedi'i archifo",
    // The player dialog.
    "admin.player.addTitle": "Ychwanegu chwaraewr",
    "admin.player.editTitle": "Golygu chwaraewr",
    "admin.player.name": "Enw",
    "admin.player.representing": "Yn cynrychioli",
    "admin.player.worldRankingName": "Enw'r chwaraewr ar restr detholion y byd",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown":
      "Mae detholion y byd yn adnabod yr enw hwn.",
    "admin.player.worldRankingQuestioned":
      "Nid oes gan detholion y byd chwaraewr o'r enw hwn. Efallai ei fod wedi'i gamsillafu, neu efallai fod y chwaraewr yn newydd i'r detholion.",
    "admin.player.flag": "Baner",
    "admin.player.add": "Ychwanegu",
    "admin.player.save": "Cadw",
    "admin.player.added": "Ychwanegwyd {name}.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Ni ellir cadw'r chwaraewr hwn fel y mae.",
    "Tournament.PlayerNameTaken":
      "Mae gan chwaraewr arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "TournamentPlayer.NoSuchFlag": "Dewiswch un o'r baneri sydd ar gael.",
    "TournamentPlayer.NamedBye": "Ni all chwaraewr gael ei alw'n Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn enw.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Nid oes angen ychwanegu byes",
    "admin.player.byes":
      "Nid yw bye yn un o chwaraewyr y twrnamaint. Mae cnoc-owt yn cynnig Bye pryd bynnag yr ychwanegir ei chwaraewyr, gymaint o weithiau ag y mae ei dynnu ei angen.",
    // A tournament played by teams: its Teams and Tests tabs, a team's page,
    // and their dialogs.
    "admin.view.teams": "Timau",
    "admin.view.tests": "Profion",
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
      "Yr enw y gelwir profion y tîm ganddo, fel AUS v ENG.",
    "admin.team.flag": "Baner",
    "admin.team.add": "Ychwanegu",
    "admin.team.save": "Cadw",
    "admin.team.added": "Ychwanegwyd {name}.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "Ni ellir cadw'r tîm hwn fel y mae.",
    "admin.teamView.otherwise": "Ni ellir gweld y tîm hwn o'r fan hon.",
    "admin.teamView.players": "Chwaraewyr",
    "TeamName.Missing": "Dywedwch beth yw enw'r tîm.",
    "TeamName.TooLong": "Mae'r enw hwnnw'n rhy hir.",
    "admin.notes.add": "Ychwanegu nodyn",
    "admin.notes.none": "Dim nodiadau",
    "admin.notes.edit": "Golygu",
    "admin.notes.delete": "Dileu",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Dileu nodyn",
    "admin.notes.deleteQuestion": "Dileu'r nodyn “{title}”?",
    "admin.notes.delete.explanation":
      "Mae nodyn a ddilëwyd wedi mynd am byth, ac ni ellir ei ddwyn yn ôl.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "Ni ellid gwneud hynny.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "Ychwanegu nodyn",
    "admin.note.editTitle": "Golygu nodyn",
    "admin.note.title": "Teitl",
    "admin.note.description": "Disgrifiad",
    "admin.note.write": "Ysgrifennu",
    "admin.note.preview": "Rhagolwg",
    "admin.note.toolbar": "Fformatio",
    "admin.note.tool.heading": "Pennawd",
    "admin.note.tool.bold": "Trwm",
    "admin.note.tool.italic": "Italig",
    "admin.note.tool.quote": "Dyfyniad",
    "admin.note.tool.code": "Cod",
    "admin.note.tool.link": "Dolen",
    "admin.note.tool.numberedList": "Rhestr rifedig",
    "admin.note.tool.bulletedList": "Rhestr bwyntiau",
    "admin.note.tool.taskList": "Rhestr tasgau",
    "admin.note.add": "Ychwanegu",
    "admin.note.save": "Cadw",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "Ni ellir cadw'r nodyn hwn fel y mae.",
    "ManagerNoteTitle.Missing": "Rhowch deitl i'r nodyn.",
    "ManagerNoteTitle.TooLong": "Mae'r teitl hwnnw'n rhy hir.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn teitl.",
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
    "CommentaryTitle.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn teitl.",
    "Commentary.TitleTaken": "Mae gan sylwebaeth arall y teitl hwnnw eisoes.",
    "CommentText.Missing": "Ysgrifennwch rywbeth yn y sylw.",
    "CommentText.TooLong": "Mae'r sylw hwnnw'n rhy hir.",
    "TeamShortName.Missing": "Rhowch enw byr i'r tîm.",
    "TeamShortName.TooLong": "Gall enw byr fod hyd at 10 nod ar y mwyaf.",
    "TeamShortName.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn enw byr.",
    "Team.ShortNameLongerThanName":
      "Ni all enw byr fod yn hirach nag enw'r tîm.",
    "Team.NoSuchFlag": "Dewiswch un o'r baneri sydd ar gael.",
    "Team.Archived":
      "Mae'r tîm hwnnw wedi'i archifo, a chaiff ei adfer yn gyntaf.",
    "Team.InATest":
      "Mae'r tîm hwnnw'n chwarae mewn prawf, ac ni ellir ei archifo.",
    "Team.PlayerNameTaken":
      "Mae gan chwaraewr arall yn y tîm hwn yr enw hwnnw eisoes.",
    "TeamPlayer.NamedBye": "Ni all chwaraewr gael ei alw'n Bye.",
    "TeamPlayer.Archived":
      "Mae'r chwaraewr hwnnw wedi'i archifo, a chaiff ei adfer yn gyntaf.",
    "TeamPlayer.HasGames":
      "Mae'r chwaraewr hwnnw wedi chwarae, ac ni ellir ei archifo.",
    "Tournament.TeamNameTaken":
      "Mae gan dîm arall yn y twrnamaint hwn yr enw hwnnw eisoes.",
    "Tournament.TeamShortNameTaken":
      "Mae gan dîm arall yn y twrnamaint hwn yr enw byr hwnnw eisoes.",
    "Tournament.NoSuchTeam":
      "Nid oes gan y twrnamaint hwn dîm yn y cyfeiriad hwn.",
    "Tournament.TeamArchived":
      "Mae'r tîm hwn wedi'i archifo, a dim ond o'r tab Timau y gellir ei adfer.",
    "admin.tests.add": "Ychwanegu prawf",
    "admin.tests.none": "Dim profion",
    "admin.tests.edit": "Golygu",
    "admin.tests.view": "Gweld",
    "admin.tests.archive": "Archifo",
    "admin.tests.restore": "Adfer",
    "admin.tests.up": "I fyny",
    "admin.tests.down": "I lawr",
    "admin.tests.archived": "Profion wedi'u harchifo",
    "admin.tests.twoTeamsNeeded":
      "Mae prawf rhwng dau dîm, felly mae angen dau dîm yn gyntaf.",
    "admin.tests.toTeams": "Mynd i Timau",
    "admin.tests.matches.one": "{count} gêm",
    "admin.tests.matches.other": "{count} gêm",
    "admin.tests.bestOf": "yr orau o {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "Ni ellid gwneud hynny.",
    "admin.test.addTitle": "Ychwanegu prawf",
    "admin.test.editTitle": "Golygu prawf",
    "admin.test.firstTeam": "Tîm A",
    "admin.test.secondTeam": "Tîm B",
    "admin.test.versus": "v",
    "admin.test.starts": "Yn dechrau",
    "admin.test.finishes": "Yn gorffen",
    "admin.test.expectedMatches": "Gemau disgwyliedig",
    "admin.test.bestOf": "Yr orau o",
    "admin.test.group": "Grŵp",
    "admin.test.add": "Ychwanegu",
    "admin.test.save": "Cadw",
    "admin.test.added": "Ychwanegwyd {name}.",
    "admin.test.otherwise": "Ni ellir cadw'r prawf hwn fel y mae.",
    "admin.testView.otherwise": "Ni ellir gweld y prawf hwn o'r fan hon.",
    "AddTest.FirstTeamMissing": "Dewiswch y tîm cyntaf.",
    "AddTest.SecondTeamMissing": "Dewiswch yr ail dîm.",
    "UpdateTest.FirstTeamMissing": "Dewiswch y tîm cyntaf.",
    "UpdateTest.SecondTeamMissing": "Dewiswch yr ail dîm.",
    "ExpectedMatches.NotWhole": "Rhowch nifer cyfan o gemau.",
    "ExpectedMatches.TooSmall": "Rhaid disgwyl i brawf gael 1 gêm o leiaf.",
    "TestGroup.TooLong": "Mae'r grŵp hwnnw'n rhy hir.",
    "Tournament.TestAgainstItself":
      "Nid yw tîm yn chwarae prawf yn erbyn ei hun.",
    "Tournament.TestFinishesBeforeStarts":
      "Ni all prawf orffen cyn iddo ddechrau.",
    "Tournament.TestStartsBeforeTournament":
      "Ni all prawf ddechrau cyn i'w dwrnamaint wneud.",
    "Tournament.TestFinishesAfterTournament":
      "Ni all prawf orffen ar ôl i'w dwrnamaint wneud.",
    "Tournament.TestHasGamesInUse":
      "Mae gan y prawf hwn gemau, felly ni ellir ei archifo nes y byddant hwy wedi'u harchifo.",
    "Tournament.TestHasGames":
      "Mae gan y prawf hwn gemau erbyn hyn, felly ni ellir newid ei dimau mwyach.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Mae mwy o gemau na hynny wedi dechrau eisoes.",
    "Tournament.BestOfBelowGamesPlayed":
      "Mae dau chwaraewr eisoes wedi chwarae mwy o gemau na hynny.",
    "Competition.ExpectedMatchesReached":
      "Mae'r prawf hwn wedi dechrau cymaint o gemau ag y disgwylir iddo eu cael.",
    "Competition.SameTeam":
      "Nid yw dau chwaraewr o'r un tîm yn chwarae yn erbyn ei gilydd.",
    "AddManager.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw gyfrif y gellir ei wneud yn rheolwr.",
    "admin.scorers.add": "Ychwanegu sgorwr",
    "admin.scorers.none": "Dim sgorwyr",
    "admin.scorers.removeTitle": "Tynnu sgorwr",
    "admin.scorers.removeExplanation":
      "Ni fydd {name} yn gallu rhoi sgorau'r twrnamaint hwn i mewn mwyach.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "Ni ellir gwneud y cyfeiriad hwnnw'n sgorwr.",
    "AddScorer.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw gyfrif y gellir ei wneud yn sgorwr.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Dim ond gweinyddwr all wneud hynny.",
    "AddRole.NoSuchAccount":
      "Nid oes gan y cyfeiriad hwnnw gyfrif y gellir rhoi'r rôl iddo.",
    "AddRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "RemoveRole.NoSuchAccount": "Nid oes cyfrif o'r fath.",
    "RemoveRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "RemoveRole.Yourself":
      "Ni allwch gymryd rôl y Gweinyddwr oddi arnoch eich hun.",
    "AccountsWithRole.NoSuchRole": "Nid oes rôl o'r fath.",
    "Tournament.AlreadyAManager":
      "Mae'r cyfrif hwnnw eisoes yn rheoli'r twrnamaint, a gall wneud popeth y gall sgorwr ei wneud.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    "TournamentName.Missing": "Dywedwch beth yw enw'r twrnamaint.",
    "TournamentName.TooShort": "Mae'r enw hwnnw'n rhy fyr.",
    "TournamentName.TooLong": "Mae'r enw hwnnw'n rhy hir.",
    "TournamentName.AllLowerCase":
      "Ni chaiff enw fod i gyd mewn llythrennau bach.",
    "TournamentName.AllCapitals":
      "Ni chaiff enw fod i gyd mewn prif lythrennau.",
    "TournamentName.NoLetterOrDigit":
      "Mae angen llythyren neu ddigid mewn enw.",
    "ReadOnlyDate.Unreadable": "Rhowch y diwrnod.",
    "Tournament.FinishesBeforeStarts":
      "Ni all twrnamaint orffen cyn iddo ddechrau.",
    "Tournament.StartsAfterNextYear":
      "Ni all twrnamaint ddechrau ar ôl y flwyddyn nesaf.",
    "Tournament.FinishesAfterNextYear":
      "Ni all twrnamaint orffen ar ôl y flwyddyn nesaf.",
    "CreateTournament.NoSuchCountry": "Dewiswch y wlad.",
    "TournamentSubtitle.TooLong": "Ni all is-deitl fod yn hirach na 2000 nod.",
    "Tournament.NotAManager": "Dim ond rheolwr y twrnamaint hwn all ei newid.",
    "Tournament.NotAManagerOrScorer":
      "Dim ond rheolwr neu sgorwr y twrnamaint hwn all ei weld.",
    "Tournament.Archived":
      "Mae'r twrnamaint hwn wedi'i archifo, a chaiff ei adfer cyn y gellir ei newid.",
    "UpdateTournament.NoSuchTournament":
      "Nid oes twrnamaint yn y cyfeiriad hwn.",

    // What a tournament is played in and where, by code.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Safonol",
    "format.teams": "Timau",
    "format.eire-cup": "Cwpan Iwerddon",
    "format.interstate-shield": "Tarian y Taleithiau",
    "format.gc-world-team-championship": "Pencampwriaeth Tîm y Byd GC",

    "country.ad": "Andorra",
    "country.ae": "Emiradau Arabaidd Unedig",
    "country.af": "Affganistan",
    "country.ag": "Antigua a Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "yr Ariannin",
    "country.as": "Samoa Americanaidd",
    "country.at": "Awstria",
    "country.au": "Awstralia",
    "country.aw": "Aruba",
    "country.ax": "Ynysoedd Åland",
    "country.az": "Aserbaijan",
    "country.ba": "Bosnia a Herzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Gwlad Belg",
    "country.bf": "Burkina Faso",
    "country.bg": "Bwlgaria",
    "country.bh": "Bahrain",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brwnei",
    "country.bo": "Bolifia",
    "country.br": "Brasil",
    "country.bs": "y Bahamas",
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
    "country.ch": "y Swistir",
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
    "country.de": "yr Almaen",
    "country.dj": "Djibouti",
    "country.dk": "Denmarc",
    "country.dm": "Dominica",
    "country.do": "Gweriniaeth Dominica",
    "country.dz": "Algeria",
    "country.ec": "Ecwador",
    "country.ee": "Estonia",
    "country.eg": "yr Aifft",
    "country.eh": "Gorllewin Sahara",
    "country.england": "Lloegr",
    "country.er": "Eritrea",
    "country.es": "Sbaen",
    "country.et": "Ethiopia",
    "country.fi": "y Ffindir",
    "country.fj": "Ffiji",
    "country.fk": "Ynysoedd Falkland",
    "country.fm": "Micronesia",
    "country.fo": "Ynysoedd Ffaro",
    "country.fr": "Ffrainc",
    "country.ga": "Gabon",
    "country.gb": "y Deyrnas Unedig",
    "country.gd": "Grenada",
    "country.ge": "Georgia",
    "country.gf": "Guiana Ffrengig",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Yr Ynys Las",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadeloupe",
    "country.gq": "Guinea Gyhydeddol",
    "country.gr": "Gwlad Groeg",
    "country.gs": "De Georgia ac Ynysoedd Sandwich y De",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Ynys Heard ac Ynysoedd McDonald",
    "country.hn": "Honduras",
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
    "country.it": "yr Eidal",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Gwlad Iorddonen",
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
    "country.kz": "Kazakhstan",
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
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "y Maldives",
    "country.mw": "Malawi",
    "country.mx": "Mecsico",
    "country.my": "Malaysia",
    "country.mz": "Mozambique",
    "country.na": "Namibia",
    "country.nc": "Caledonia Newydd",
    "country.ne": "Niger",
    "country.nf": "Ynys Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "yr Iseldiroedd",
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
    "country.ph": "Ynysoedd y Philipinau",
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
    "country.ro": "Rwmania",
    "country.rs": "Serbia",
    "country.ru": "Rwsia",
    "country.rw": "Rwanda",
    "country.sa": "Saudi Arabia",
    "country.sb": "Ynysoedd Solomon",
    "country.sc": "Seychelles",
    "country.scotland": "Yr Alban",
    "country.sd": "Sudan",
    "country.se": "Sweden",
    "country.sg": "Singapôr",
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
    "country.tl": "Timor-Leste",
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
    "country.um": "Ynysoedd Pellennig Bach yr Unol Daleithiau",
    "country.us": "Unol Daleithiau America",
    "country.uy": "Uruguay",
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

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. `{link}`, `{site}`, `{buttonBackgroundColour}`,
    // `{buttonTextColour}`, `{emailFromName}` and `{siteName}` are filled in by
    // the writer, as in the English.

    "Email.ConfirmAddress.subject":
      "Cadarnhewch eich cyfeiriad e-bost ar gyfer {siteName}",
    "Email.ConfirmAddress.body": `
<p>Helo,</p>

<p>
    Diolch am greu cyfrif gyda <strong>{siteName}</strong>.<br />
    Cyn y gallwch ddechrau defnyddio eich cyfrif, cadarnhewch eich cyfeiriad e-bost
    drwy glicio ar y botwm isod:
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
    Os na wnaethoch chi greu'r cyfrif hwn, gallwch anwybyddu'r e-bost hwn yn ddiogel.
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
    Yn ddiweddar gofynnoch am e-bost newydd i gadarnhau eich cyfeiriad e-bost ar gyfer <strong>{siteName}</strong>.<br />
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
    Unwaith y bydd wedi'i gadarnhau, byddwch yn gallu parhau i ddefnyddio eich cyfrif heb ymyrraeth.
</p>

<p>
    Os na wnaethoch chi ofyn am yr e-bost hwn, gallwch ei anwybyddu'n ddiogel.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Ceisiodd rhywun gofrestru gyda'ch cyfeiriad e-bost",
    "Email.AlreadyRegistered.body": `
<p>Helo,</p>

<p>
    Ceisiodd rhywun gofrestru gyda <strong>{siteName}</strong> gan ddefnyddio'r
    cyfeiriad e-bost hwn, sydd â chyfrif eisoes. Nid oes dim am eich cyfrif
    wedi newid.<br />
    Os mai chi oedd yno, mae gennych gyfrif eisoes, a gallwch fewngofnodi iddo:
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
        Wedi anghofio'r cyfrinair
    </a>
</p>

<p>
    Os nad chi oedd yno, nid oes angen i chi wneud dim. Nid oes neb wedi cael
    ffordd i mewn i'ch cyfrif.
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
    Gofynnodd rhywun a oedd wedi mewngofnodi i gyfrif <strong>{siteName}</strong>
    am ei symud i'r cyfeiriad e-bost hwn. Os mai chi oedd yno, cadarnhewch hynny
    yma, wedi mewngofnodi i'r cyfrif hwnnw. Mae'r ddolen yn gweithio am 24 awr.
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
    Neu copïwch y cyfeiriad hwn i'ch porwr:<br />
    {link}
</p>

<p>
    Os nad chi oedd yno, nid oes angen i chi wneud dim. Ni fydd unrhyw gyfrif yn symud yma.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Gofynnodd rhywun am symud cyfrif i'ch cyfeiriad e-bost",
    "Email.AlreadyHasAnAccount.body": `
<p>Helo,</p>

<p>
    Gofynnodd rhywun a oedd wedi mewngofnodi i gyfrif <strong>{siteName}</strong>
    am ei symud i'r cyfeiriad e-bost hwn, sydd â chyfrif ei hun eisoes. Nid oes
    dim wedi symud, ac nid oes dim am eich cyfrif wedi newid.
</p>

<p>
    Os mai chi oedd yno, mae gennych gyfrif yn y cyfeiriad hwn eisoes, a gallwch
    fewngofnodi iddo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Mae eich cyfrif {siteName} wedi symud",
    "Email.EmailAddressChanged.body": `
<p>Helo,</p>

<p>
    Mae eich cyfrif <strong>{siteName}</strong> newydd gael ei symud i gyfeiriad
    e-bost arall, {emailAddress}, ac mae'n mewngofnodi gyda'r cyfeiriad hwnnw o hyn ymlaen.
</p>

<p>
    Os nad chi oedd yno, mae rhywun arall wedi cael gafael ar eich cyfrif. Atebwch yr e-bost hwn
    a rhowch wybod i ni.
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
    Mae cyfrinair eich cyfrif <strong>{siteName}</strong> newydd gael ei
    newid, ac allgofnodwyd pob porwr arall a oedd wedi mewngofnodi iddo.<br />
    Os mai chi oedd yno, nid oes angen i chi wneud dim.
</p>

<p>
    Os nad chi oedd yno, mae rhywun arall wedi cael gafael ar eich cyfrinair. Gosodwch un newydd yma, a
    chaiff y person hwnnw ei allgofnodi:
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
        Wedi anghofio'r cyfrinair
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
    Yn ddiweddar gofynnoch am ailosod eich cyfrinair ar gyfer <strong>{siteName}</strong>.<br />
    Gallwch ailosod eich cyfrinair drwy glicio ar y botwm isod:
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
    Os na wnaethoch chi ofyn am ailosod cyfrinair, gallwch anwybyddu'r e-bost hwn yn ddiogel.
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
    Gofynnoch am osod un, fel y gallwch fewngofnodi gyda'ch cyfeiriad e-bost a chyfrinair hefyd.
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
    Mae'r ddolen yn gweithio am awr. Os na wnaethoch chi ofyn am osod cyfrinair, gallwch anwybyddu'r e-bost hwn yn ddiogel.
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
    Gofynnwyd am ailosod y cyfrinair ar gyfer cyfeiriad e-bost nad yw'n
    gysylltiedig â chyfrif ar <strong>{siteName}</strong>.
</p>

<p>
    Os hoffech ddefnyddio ein gwasanaeth, gallwch greu cyfrif newydd drwy fynd i:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Os na wnaethoch chi'r cais hwn, gallwch anwybyddu'r e-bost hwn yn ddiogel.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Cadarnhewch fod eich cyfrif {siteName} i'w anghofio",
    "Email.ConfirmForgetting.body": `
<p>Helo,</p>

<p>
    Gofynnoch i'ch cyfrif <strong>{siteName}</strong> gael ei
    anghofio.<br />
    Dilynwch y botwm isod i weld beth mae hynny'n ei olygu, ac i ddweud yn bendant
    eich bod ei eisiau:
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
    Unwaith y bydd wedi'i anghofio, ni all neb ddarllen eich enw a'ch cyfeiriad e-bost byth eto,
    ac ni ellir mewngofnodi i'ch cyfrif. Ni ellir dadwneud hyn.
</p>

<p>
    Mae'r ddolen yn gweithio unwaith, hyd at 15 munud ar ôl i chi ofyn amdani, a dim ond
    tra byddwch wedi mewngofnodi i'r cyfrif hwn. Wedi hynny, gofynnwch eto o'ch
    cyfrif.
</p>

<p>
    Os na wnaethoch chi ofyn, ni fydd dim yn digwydd oni bai y dilynir y ddolen.
    Ond gofynnodd rhywun a oedd wedi mewngofnodi i'ch cyfrif, felly gosodwch gyfrinair newydd
    o'r dudalen cyfrinair wedi'i anghofio i fod yn siŵr na all fewngofnodi eto.
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
    Ni allai {siteName} gysylltu â {service} am {when}. Nes iddo ateb,
    dywedir wrth ddarllenwyr sydd ei angen, i gofrestru neu i osod cyfrinair newydd, am
    roi cynnig arall arni nes ymlaen.
</p>

<p>
    Nid oes angen codi dim. Mae pob ymgais yn gofyn i {service} o'r newydd, ac mae'r tudalennau'n
    gweithio eto'r eiliad y bydd yn ateb.
</p>

<p>
    Tra bydd {service} i lawr, cewch e-bost amdano unwaith yr awr ar y mwyaf.
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
    Ni allai {siteName} gyrraedd ei chronfa ddata am {when}. Nes iddo ateb, mae pob tudalen sydd ei hangen yn dweud wrth ddarllenwyr nad yw'r wefan ar gael ac i roi cynnig arall arni nes ymlaen.
</p>

<p>
    Nid oes angen codi dim. Mae pob cais yn gofyn am gysylltiad o'r newydd, ac mae'r wefan yn gweithio eto'r eiliad y bydd y gronfa ddata yn ateb.
</p>

<p>
    Tra bydd y gronfa ddata i lawr, cewch e-bost amdani unwaith bob {minutes} munud ar y mwyaf.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "Methodd {siteName} ar gais",
    "Email.UnhandledError.body": `
<p>Helo,</p>

<p>
    Methodd {siteName} am {when} ar gais am {asked}. Dangoswyd y cyfeirnod {reference} i'r darllenydd, ac mae'r achos yn y log oddi tano.
</p>

<p>
    Mae gwefan sydd wedi torri yn tueddu i fethu ar bob cais, felly cewch e-bost am fethiannau 4 gwaith ar y mwyaf mewn awr. Mae'r rhai ar ôl hynny yn y log serch hynny.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
