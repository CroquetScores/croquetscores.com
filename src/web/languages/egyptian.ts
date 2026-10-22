// The site's words in Egyptian Arabic. Keyed as the English catalogue is,
// which is what a word missing here falls back to.
//
// Egyptian rather than Modern Standard Arabic, because the site is a place
// people come to score and follow games, and in Egypt that is talked about in
// the spoken dialect: Modern Standard is the language of newspapers and forms,
// and a button or an error written in it reads as an official notice where the
// English is plain and direct. Egyptian is also the dialect nearly every Arabic
// speaker understands, from films and songs. It is kept readable rather than
// slangy: the spoken forms ("عايز", "ازاي", "مفيش") where a person would say
// them, and ordinary written Arabic spelling, so that nothing is hard to look
// up or to read aloud. Instructions are addressed to the reader in the
// masculine singular, as Arabic interfaces do for everyone.
//
// Arabic reads from right to left, so the language says so with `direction`;
// the Western digits the site produces are kept as they are, as Egyptians use
// them on screens. Where a placeholder, a link or the site's name sits in the
// middle of a sentence it is left untouched.
import type { Language } from "../common/language.js";

export const egyptian: Language = {
  tag: "ar-EG",
  name: "العربية (مصر)",
  direction: "rtl",
  words: {
    "site.skipToContent": "روح على المحتوى",
    "navigation.menu": "القائمة",
    "navigation.label": "الرئيسية",
    "navigation.home": "الصفحة الرئيسية",
    "navigation.help": "المساعدة",
    "navigation.admin": "الإدارة",
    "sections.label": "الأقسام",
    "theme.label": "المظهر",
    "theme.light": "فاتح",
    "theme.dark": "غامق",
    "theme.system": "زي الجهاز",
    "footer.donate": "تبرّع",
    "footer.plea": "عجبك {siteName}؟ تبرّع علشان نكمّل نطوّره.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "الخصوصية",
    "footer.termsOfUse": "شروط الاستخدام",
    "beta.banner":
      "ده موقع تجريبي (بيتا). البيانات ممكن تتمسح وتبدأ من الأول في أي وقت.",
    "privacy.contact":
      "لو عندك أسئلة عن الصفحة دي، أو عن اللي محفوظ عنك: {emailAddress}",
    "termsOfUse.agree": "أنا موافق على شروط الاستخدام",
    "termsOfUse.link": "شروط الاستخدام",
    "termsOfUse.report":
      "بلّغ عن اللي اتكتب، أو اسأل عن الشروط دي: {emailAddress}",
    "TermsOfUse.NotAgreed": "علّم على المربع عشان توافق على شروط الاستخدام.",
    "tryWebsite.banner":
      "ده مكان آمن تتعلّم فيه {siteName}. أي حاجة تكتبها هنا ممكن تتمسح في أي وقت.",

    "language.label": "اللغة",
    "language.choose": "غيّر",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "في حاجة جديدة تقراها.",
    "whatsNew.admin.message": "في حاجة جديدة لمدراء البطولات.",
    "whatsNew.view": "شوف الجديد",
    "whatsNew.later": "فكّرني المرة الجاية",
    "whatsNew.never": "ما تورّينيش التنبيه ده تاني",

    "form.otherwise": "في حاجة مش مظبوطة. راجع اللي كتبته وجرّب تاني.",

    "account.menu": "الحساب",
    "account.register": "سجّل",
    "account.signIn": "تسجيل الدخول",
    "account.forgotPassword": "نسيت كلمة السر",
    "account.signOut": "تسجيل الخروج",
    "account.profile": "الملف الشخصي",
    "account.changePassword": "غيّر كلمة السر",
    "account.changeEmailAddress": "غيّر عنوان البريد الإلكتروني",
    "account.changeName": "غيّر الاسم",
    "account.setPassword": "اضبط كلمة السر",
    "account.forgetAccount": "انسَ الحساب",

    "register.title": "سجّل",
    "register.emailAddress": "عنوان البريد الإلكتروني",
    "register.submit": "سجّل",
    "register.withGoogle": "سجّل بجوجل",
    "register.or": "أو",
    "SignInWithGoogle.EmailAddressNotVerified":
      "جوجل ما أكّدش إن عنوان البريد الإلكتروني ده بتاعك، فمينفعش يتستخدم هنا مع جوجل. استخدم عنوان بريدك الإلكتروني تحت.",
    "SignInWithGoogle.LinkedToAnother":
      "عنوان البريد الإلكتروني ده عليه حساب بالفعل، ومربوط بحساب جوجل تاني. سجّل الدخول بحساب جوجل ده، أو بعنوان بريدك الإلكتروني وكلمة السر.",
    "SignInWithGoogle.NameMissing":
      "جوجل ما قالش لنا اسمك، والحساب لازم يكون له اسم. استخدم عنوان بريدك الإلكتروني تحت.",
    "Google.Unreachable":
      "مقدرناش نوصل لجوجل دلوقتي. جرّب تاني كمان شوية، أو استخدم عنوان بريدك الإلكتروني تحت.",
    "Registration.NotAPerson":
      "الطلب ده ما بانش إنه جاي من إنسان. جرّب تاني، ولو فضل يحصل استنى كام دقيقة وارجع.",

    "EmailAddress.Missing": "اكتب عنوان البريد الإلكتروني.",
    "EmailAddress.NoAt": "عنوان البريد الإلكتروني لازم فيه @.",
    "EmailAddress.MoreThanOneAt": "عنوان البريد الإلكتروني فيه @ واحدة بس.",
    "EmailAddress.NoDomain":
      "عنوان البريد الإلكتروني لازم يكون بعد الـ @ اسم موقع، زي example.com.",

    "welcome.title": "بص على بريدك",
    "welcome.checkEmail":
      "بعتنا لك رسالة على العنوان اللي إدّيتهولنا. افتح اللينك اللي فيها علشان تكمّل.",
    "welcome.nothingArrived":
      "لو ما وصلش حاجة بعد كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "welcome.home": "ارجع إلى {siteName}",
    "newConfirmationLink.title": "اطلب لينك جديد",
    "newConfirmationLink.explanation":
      "لينك تأكيد عنوان البريد الإلكتروني انتهت مدّته. اطلب واحد جديد وهيتبعت على العنوان اللي سجّلت بيه.",
    "newConfirmationLink.send": "ابعتلي لينك جديد",
    "newConfirmationLink.home": "ارجع إلى {siteName}",
    "newConfirmationLink.signIn": "تسجيل الدخول",
    "newConfirmationLink.sent.title": "بص على بريدك",
    "newConfirmationLink.sent.explanation":
      "بعتنا لك لينك جديد. افتحه علشان تأكّد عنوان بريدك الإلكتروني. لو ما وصلش حاجة بعد كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "newConfirmationLink.alreadyConfirmed.title":
      "عنوان البريد الإلكتروني ده اتأكّد بالفعل",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "مفيش حاجة تانية تتأكّد. سجّل الدخول بكلمة السر اللي حطّيتها وقت التأكيد.",
    "newConfirmationLink.noLongerWorks.title": "اللينك ده ما بقاش شغّال",
    "newConfirmationLink.noLongerWorks.explanation":
      "اتأكد إنك فتحت اللينك كله من الرسالة، من غير ما ينقص منه حاجة في الآخر. لو لسه مش شغّال، سجّل من جديد وهيتبعت لك لينك جديد.",
    "newConfirmationLink.tooMany.title": "جرّب تاني بعدين",
    "newConfirmationLink.tooMany.explanation":
      "اتبعت لينكات كتير للعنوان ده قريب. استنى ساعة واطلب تاني، وفي الوقت ده بص في فولدر الرسائل المزعجة (سبام).",

    "forgotPassword.title": "نسيت كلمة السر؟",
    "forgotPassword.emailAddress": "عنوان البريد الإلكتروني",
    "forgotPassword.submit": "ابعتلي طريقة أرجع بيها",
    "forgotPassword.home": "ارجع إلى {siteName}",
    "forgotPassword.sent.title": "بص على بريدك",
    "forgotPassword.sent.explanation":
      "لو العنوان ده عليه حساب، بعتنا لك لينك تحط بيه كلمة سر جديدة. افتحه خلال ساعة. لو ما وصلش حاجة بعد كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "forgotPassword.tryAgainLater":
      "اتطلب من هنا طرق رجوع كتير قريب. استنى ساعة وجرّب تاني.",

    "setNewPassword.title": "حط كلمة سر جديدة",
    "setNewPassword.password": "كلمة السر",
    "setNewPassword.confirmPassword": "أكّد كلمة السر",
    "setNewPassword.submit": "اضبط كلمة السر الجديدة",
    "setNewPassword.home": "ارجع إلى {siteName}",
    "setNewPassword.signIn": "تسجيل الدخول",
    "setNewPassword.askAgain": "اطلب لينك جديد",
    "setNewPassword.changed.title": "كلمة السر اتغيّرت",
    "setNewPassword.changed.explanation":
      "اتعمل لك تسجيل خروج من كل الأماكن اللي كنت داخل منها. سجّل الدخول بكلمة السر الجديدة.",
    "setNewPassword.expired.title": "اللينك ده انتهت مدّته",
    "setNewPassword.expired.explanation":
      "لينك كلمة السر الجديدة بيشتغل ساعة واحدة. اطلب واحد تاني وهيتبعت على نفس العنوان.",
    "setNewPassword.noLongerWorks.title": "اللينك ده ما بقاش شغّال",
    "setNewPassword.noLongerWorks.explanation":
      "ممكن يكون اتستخدم قبل كده، أو ينقص منه حاجة في الآخر. اطلب واحد تاني لو لسه محتاجه.",

    "BreachedPasswords.Unreachable":
      "مقدرناش نفحص كلمة السر دلوقتي، فما اتغيّرتش. جرّب تاني كمان شوية؛ اللينك بتاعك فاضل شغّال لحد ما تنتهي مدّته.",

    "forgetAccount.title": "انسَ حسابك",
    "forgetAccount.explanation":
      "اسمك وعنوان بريدك الإلكتروني ممكن يتحوّلوا لحاجة ما تتقريش للأبد، وحسابك يتقفل. علشان نتأكد إنه إنت، هنبعت الأول لينك على عنوان حسابك، ومفيش حاجة بتتنسي لحد ما تفتحه.",
    "forgetAccount.submit": "ابعتلي اللينك",
    "forgetAccount.sent.title": "بص على بريدك",
    "forgetAccount.sent.explanation":
      "بعتنا لينك على عنوان حسابك. بيشتغل 15 دقيقة، وطول ما إنت داخل على الحساب ده بس.",
    "forgetAccount.confirm.title": "تنسى حسابك للأبد؟",
    "forgetAccount.confirm.explanation":
      "أول ما الحساب يتنسي، مفيش حد هيقدر يقرأ اسمك ولا عنوان بريدك الإلكتروني تاني، ومحدش هيقدر يدخل على حسابك. مينفعش ترجّع ده.",
    "forgetAccount.confirm.submit": "انسَ حسابي",
    "forgetAccount.forgotten.title": "حسابك اتنسي",
    "forgetAccount.forgotten.explanation":
      "اسمك وعنوان بريدك الإلكتروني ما بقوش يتقروا، واتعمل لك تسجيل خروج من كل الأماكن اللي كنت داخل منها.",
    "forgetAccount.noLongerWorks.title": "اللينك ده ما بقاش شغّال",
    "forgetAccount.noLongerWorks.explanation":
      "ممكن تكون مدّته انتهت، أو اتستخدم قبل كده، أو يكون لحساب مش داخل عليه. اطلبه تاني من حسابك لو لسه عايز الحساب يتنسي.",
    "forgetAccount.lastAdministrator.title": "الحساب ده مينفعش يتنسي",
    "forgetAccount.lastAdministrator.explanation":
      "إنت المسؤول الوحيد عن الموقع ده. إدّي دور المسؤول لحد تاني، وبعدها حسابك يقدر يتنسي.",
    "forgetAccount.askAgain": "اطلبه تاني",
    "forgetAccount.home": "ارجع إلى {siteName}",

    "registrationsSuspended.title": "التسجيل واقف دلوقتي",
    "registrationsSuspended.explanation":
      "في خدمة التسجيل محتاجها مش بتردّ دلوقتي، فمحدش يقدر يسجّل لحد ما ترجع تشتغل. اللي كتبته ما اتحفظش.",
    "registrationsSuspended.tryAgainLater":
      "جرّب تاني بعد شوية. مسؤول الموقع اتبلّغ.",
    "registrationsSuspended.home": "ارجع إلى {siteName}",

    "signIn.title": "تسجيل الدخول",
    "signIn.emailAddress": "عنوان البريد الإلكتروني",
    "signIn.password": "كلمة السر",
    "signIn.submit": "تسجيل الدخول",
    "signIn.forgotPassword": "نسيت كلمة السر؟",
    "signIn.register": "سجّل",
    "signIn.withGoogle": "ادخل بجوجل",
    "signIn.or": "أو",
    "signIn.tryAgainLater": "اتعملت محاولات كتير قريب. استنى ساعة وجرّب تاني.",

    "SignIn.Failed": "عنوان البريد الإلكتروني أو كلمة السر مش صح. جرّب تاني.",

    "profile.title": "الملف الشخصي",
    "profile.name": "الاسم:",
    "profile.emailAddress": "عنوان البريد الإلكتروني:",

    "changeName.title": "غيّر الاسم",
    "changeName.name": "الاسم",
    "changeName.submit": "غيّر الاسم",

    "setPassword.title": "اضبط كلمة سر",
    "setPassword.explanation":
      "حسابك ملوش كلمة سر: إنت بتدخل بجوجل. علشان تقدر تدخل بكلمة سر كمان، هنبعت لينك لضبطها على {emailAddress}.",
    "setPassword.submit": "ابعتلي لينك",
    "setPassword.sent.title": "بص على بريدك",
    "setPassword.sent.explanation":
      "بعتنا لك لينك لضبط كلمة السر. بيشتغل ساعة واحدة.",
    "setPassword.profile": "ارجع إلى ملفك الشخصي",

    "changePassword.title": "غيّر كلمة السر",
    "changePassword.currentPassword": "كلمة السر الحالية",
    "changePassword.password": "كلمة السر الجديدة",
    "changePassword.passwordConfirmation": "أكّد كلمة السر",
    "changePassword.forgotPassword": "نسيت كلمة السر؟",
    "changePassword.submit": "غيّر كلمة السر",
    "ChangePassword.WrongPassword": "دي مش كلمة السر بتاعتك.",

    "changeEmailAddress.title": "غيّر عنوان البريد الإلكتروني",
    "changeEmailAddress.emailAddress": "عنوان البريد الإلكتروني الجديد",
    "changeEmailAddress.currentPassword": "كلمة السر الحالية",
    "changeEmailAddress.submit": "ابعت لينك التأكيد",
    "changeEmailAddress.sent.title": "بص على بريدك",
    "changeEmailAddress.sent.explanation":
      "اتبعت لعنوان البريد الإلكتروني الجديد لينك لتأكيد النقل. افتحه وإنت داخل على حسابك علشان تنقل حسابك هناك.",
    "changeEmailAddress.confirm.title": "انقل حسابك",
    "changeEmailAddress.confirm.explanation":
      "حسابك هيتنقل إلى {emailAddress}. من دلوقتي هتدخل بالعنوان ده.",
    "changeEmailAddress.confirm.submit": "انقل حسابي",
    "changeEmailAddress.noLongerWorks.title": "اللينك ده ما بقاش شغّال",
    "changeEmailAddress.noLongerWorks.explanation":
      "ممكن تكون مدّته انتهت، أو اتستخدم قبل كده، أو ما اتبعتش للحساب اللي إنت داخل عليه. اطلبه تاني من ملفك الشخصي.",
    "changeEmailAddress.taken.title": "حسابك ما اتنقلش",
    "changeEmailAddress.profile": "ارجع إلى ملفك الشخصي",
    "ChangeEmailAddress.WrongPassword": "دي مش كلمة السر بتاعتك.",
    "ChangeEmailAddress.Unchanged": "حسابك أصلاً على العنوان ده.",
    "ChangeEmailAddress.Taken":
      "عنوان البريد الإلكتروني ده عليه حساب تاني، فحسابك مينفعش يتنقل له.",

    "confirmEmailAddress.title": "أكّد عنوان بريدك الإلكتروني",
    "confirmEmailAddress.name": "الاسم",
    "confirmEmailAddress.password": "كلمة السر",
    "confirmEmailAddress.confirmPassword": "أكّد كلمة السر",
    "confirmEmailAddress.submit": "أكّد عنوان بريدي الإلكتروني",
    "confirmEmailAddress.signIn": "تسجيل الدخول",
    "confirmEmailAddress.home": "ارجع إلى {siteName}",
    "confirmEmailAddress.confirmed.title": "عنوان بريدك الإلكتروني اتأكّد",
    "confirmEmailAddress.confirmed.explanation":
      "حسابك جاهز. سجّل الدخول بعنوان البريد الإلكتروني وكلمة السر اللي لسه كاتبهم.",
    "confirmEmailAddress.expired.title": "اللينك ده انتهت مدّته",
    "confirmEmailAddress.expired.explanation":
      "لينك تأكيد عنوان البريد الإلكتروني بيشتغل 24 ساعة. اطلب واحد جديد وهيتبعت على نفس العنوان.",
    "confirmEmailAddress.expired.newLink": "ابعتلي لينك جديد",
    "confirmEmailAddress.noLongerWorks.title": "اللينك ده ما بقاش شغّال",
    "confirmEmailAddress.noLongerWorks.explanation":
      "اتأكد إنك فتحت اللينك كله من الرسالة، من غير ما ينقص منه حاجة في الآخر. لو لسه مش شغّال، سجّل من جديد وهيتبعت لك لينك جديد.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "عنوان البريد الإلكتروني ده اتأكّد بالفعل",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "مفيش حاجة تانية تعملها. سجّل الدخول بكلمة السر اللي حطّيتها وقت التأكيد.",

    "PersonName.Missing": "اكتب الاسم.",
    "PersonName.TooShort": "الاسم لازم يكون 3 حروف على الأقل.",
    "PersonName.TooLong": "الاسم أطول حاجة 254 حرف.",
    "WorldRankingName.TooShort":
      "الاسم في التصنيف العالمي لازم يكون 3 حروف على الأقل.",
    "WorldRankingName.TooLong": "الاسم في التصنيف العالمي أطول حاجة 254 حرف.",
    "Password.Missing": "اكتب كلمة السر.",
    "Password.TooShort": "كلمة السر لازم تكون 12 حرف على الأقل.",
    "Password.ConfirmationDiffers": "مش زي كلمة السر اللي فوق. اكتبها تاني.",
    "Password.Breached":
      "كلمة السر دي ظهرت في تسريب بيانات من موقع تاني، فمش آمن تستخدمها هنا. اختار واحدة تانية.",

    "javaScriptRequired.title": "لازم JavaScript",
    "javaScriptRequired.explanation":
      "علشان تسجّل لازم JavaScript يكون شغّال على الموقع ده، علشان نتأكد إن اللي بيسجّل إنسان. شغّله وسجّل من جديد.",
    "javaScriptRequired.register": "ارجع للتسجيل",
    "javaScriptRequired.home": "ارجع إلى {siteName}",

    "errors.backHome": "ارجع إلى {siteName}",
    "errors.notFound": "مش موجود",
    "errors.refused": "مقدرناش نعمل ده",
    "errors.refusedDetail": "في حاجة مما اتبعت مش مظبوطة.",
    "errors.sorry": "آسفين",
    "errors.sorryDetail": "مقدرناش ننفّذ الطلب ده.",
    "errors.failed": "حصلت مشكلة",
    "errors.reference": "الرقم المرجعي {reference}.",
    "errors.recorded":
      "الخطأ اتسجّل واتبعت رسالة بريد إلكتروني للمسؤول. هيفيد لو بعتّ للمسؤول رسالة بريد إلكتروني فيها الرقم المرجعي ووصف للي كنت بتعمله.",
    "errors.message": "ابعت بريد إلكتروني للمسؤول",
    "errors.messageSubject": "خطأ {reference} على {siteName}",
    "errors.messageBody": "اللي كنت بعمله لما ده حصل:\n\n",
    "errors.unavailable": "الموقع مش متاح",
    "errors.unavailableDetail":
      "الموقع مش قادر يوصل للي محتاجه دلوقتي. جرّب تاني بعدين.",
    "errors.maintenance": "الموقع واقف للصيانة.",
    "errors.maintenanceMinutes": "متوقع يرجع بعد {minutes} دقيقة.",
    "errors.maintenanceMinute": "متوقع يرجع بعد دقيقة.",
    "errors.maintenanceLonger": "الموضوع واخد وقت أطول من المتوقع وهيرجع قريب.",

    "home.recentResults": "آخر النتايج",
    "home.recentResults.none": "مفيش أي جيم اتضاف في آخر سبعة أيام.",
    "home.upcomingTournaments": "البطولات الجاية",
    "home.upcomingTournaments.none": "مفيش بطولة بتبدأ في الستين يوم الجايين.",
    "tournamentList.column.date": "التاريخ",
    "tournamentList.column.name": "الاسم",
    "tournamentList.onlyIn": "بطولات في {country} بس",
    "tournamentList.filter.country": "البلد",
    "tournamentList.filter.anyCountry": "أي بلد",
    "tournamentList.filter.region": "المنطقة",
    "tournamentList.filter.anyRegion": "أي منطقة",
    "tournamentList.filter.sport": "الرياضة",
    "tournamentList.filter.anySport": "أي رياضة",
    "tournamentList.filter.submit": "فلتر",
    "home.allTournaments": "كل بطولات {year}",
    "year.heading": "بطولات {year}",
    "year.none": "مفيش بطولة بتبدأ في {year}.",
    "yearSport.heading": "بطولات {sport} في {year}",
    "yearSport.none": "مفيش بطولة {sport} بتبدأ في {year}.",
    "tournament.recent": "الأحدث",
    "tournament.summary": "الملخّص",
    "test.bestOf": "كل ماتش بأفضل {count}.",
    "test.vs": "ضد",
    "test.matches": "الماتشات",
    "test.games": "الجيمات",
    "test.hoops": "الأطواق",
    "teamSummary.tests": "التيستات",
    "teamSummary.matches": "الماتشات",
    "teamSummary.games": "الجيمات",
    "teamSummary.hoops": "الأطواق",
    "teamSummary.wins": "الفوز",
    "teamSummary.losses": "الخسارة",
    "teamSummary.draws": "التعادل",
    "teamSummary.for": "له",
    "teamSummary.against": "عليه",
    "teamSummary.net": "الفرق",
    "tournament.players": "اللاعبين",
    "search.label": "ابحث",
    "search.tournaments": "البطولات",
    "search.competitions": "المسابقات",
    "search.nothingFound": "ما اتلقاش حاجة.",
    "players.search.label": "ابحث عن لاعبين",
    "players.search.prompt": "اكتب اسم اللاعب علشان تلاقيه.",
    "players.search.none": "ما اتلقاش لاعبين.",
    "search.more": "بيتعرض بس أول {count}. زوّد من الاسم علشان تضيّق البحث.",
    "websitePlayer.tournament": "البطولة",
    "tournament.test": "{first} ضد {second}",
    "tournament.notes": "الملاحظات",
    "tournament.commentary": "التعليقات",
    "tournament.beat": "غلب",
    "tournament.drewWith": "اتعادل مع",
    "tournament.ago.seconds": "{count} ث",
    "tournament.ago.minutes": "{count} د",
    "tournament.ago.hour": "ساعة",
    "tournament.ago.hours": "{count} ساعات",
    "tournament.none": "لسه ما اتلعبش أي جيم.",
    "players.none": "لسه ما اتضافش أي لاعب.",
    "commentaries.by": "بواسطة",
    "commentaries.start": "ابدأ تعليق جديد",
    "startCommentary.title": "ابدأ تعليق جديد",
    "startCommentary.titleField": "العنوان",
    "startCommentary.submit": "ابدأ التعليق",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "المنظّمين لسه ما كتبوش ملاحظات.",
    "marks.new": "جديد",
    "note.edited": "اتعدّلت",
    "commentary.none": "لسه ما اتكتبش حاجة.",
    "commentary.edited": "اتعدّل",
    "commentary.edit": "عدّل",
    "commentary.delete": "امسح",
    "commentary.comment": "تعليق",
    "commentary.add": "أضف",
    "commentary.notSent": "التعليق ما اتبعتش. حمّل الصفحة تاني وشوف لو اتحفظ.",
    "changeCommentaryTitle.title": "غيّر العنوان",
    "changeCommentaryTitle.submit": "احفظ",
    "editComment.title": "عدّل التعليق",
    "editComment.save": "احفظ",
    "deleteComment.title": "امسح التعليق",
    "deleteComment.question": "تمسح التعليق ده؟ مينفعش ترجّعه.",
    "deleteComment.confirm": "امسح التعليق",
    "deleteComment.keep": "سيبه",
    "player.games": "الجيمات",
    "player.competitions": "المسابقات",
    "player.beat": "غلب",
    "player.lostTo": "اتغلب من",
    "player.drewWith": "اتعادل مع",
    "player.score": "{score} مقابل {opponent}",
    "player.noGames": "لسه ما اتلعبش أي جيم.",
    "player.noCompetitions": "لسه مش مسجّل في أي مسابقة.",
    "block.wins": "الفوز",
    "block.matches": "الماتشات",
    "block.netGames": "صافي الجيمات",
    "block.games": "الجيمات",
    "block.netHoops": "صافي الأطواق",
    "block.won": "فوز",
    "block.lost": "خسارة",
    "block.drawn": "تعادل",
    "block.withdrawn": "انسحب",
    "block.gameWithdrawn": "انسحاب",
    "block.losses": "الخسارة",
    "competition.views": "العروض",
    "competition.view.grid": "الجدول",
    "competition.view.summary": "الملخّص",
    "competition.view.orderOfPlay": "ترتيب اللعب",
    "blockSummary.ranking":
      "الترتيب بنسبة الماتشات اللي اتكسبت، وبعدها بصافي الأطواق. لائحة البطولة ممكن ترتّب لاعبيها بشكل تاني.",
    "orderOfPlay.none": "لسه ما اتلعبش أي جيم.",
    "knockout.round.final": "النهائي",
    "knockout.round.semis": "نصف النهائي",
    "knockout.round.quarters": "ربع النهائي",
    "knockout.round.number": "الدور {number}",
    "knockout.bye": "إعفاء",
    "swiss.games": "الجيمات",
    "swiss.wins": "الفوز",
    "swiss.winShare": "نسبة الفوز %",
    "swiss.results": "النتايج",
    "knockout.onward": "الأدوار الجاية",
    "knockout.back": "الأدوار اللي فاتت",
    "years.label": "السنين",
    "years.earlier": "سنين فاتت",

    "admin.newerBuild.message": "في نسخة أحدث من الموقع ده.",
    "admin.newerBuild.reload": "حمّل تاني",
    "admin.title": "الإدارة",
    "admin.tournaments.new": "بطولة جديدة",
    "admin.tournaments.none": "مفيش بطولات",
    "admin.tournaments.archived": "في الأرشيف",
    "admin.tournaments.manage": "إدارة",
    "admin.tournaments.edit": "عدّل",
    "admin.tournaments.archive": "أرشِف",
    "admin.tournaments.restore": "رجّع",
    "admin.tournaments.scores": "النتايج",
    "admin.tournaments.players": "اللاعبين",
    "admin.years.label": "السنين",
    "admin.years.earlier": "سنين فاتت",
    "admin.tournament.name": "الاسم",
    "admin.tournament.starts": "بتبدأ",
    "admin.tournament.finishes": "بتخلص",
    "admin.tournament.format": "النظام",
    "admin.tournament.sport": "الرياضة",
    "admin.tournament.country": "البلد",
    "admin.tournament.region": "المنطقة",
    "admin.tournament.subtitle": "العنوان الفرعي",
    "admin.rules.handicap": "بتتلعب بهانديكاب",
    "admin.rules.drawsAllowed": "التعادل مسموح",
    "admin.tournament.levelTestsDrawn": "التيست المتعادل بيتحسب تعادل",
    "admin.rules.worldRankings": "بتتحسب في التصنيف العالمي",
    "admin.tournament.national": "حدث على مستوى البلد",
    "admin.tournament.international": "حدث دولي",
    "admin.tournament.otherwise": "مينفعش نقبل ده زي ما هو.",
    "admin.newTournament.title": "بطولة جديدة",
    "admin.newTournament.submit": "أنشئ البطولة",
    "admin.editTournament.title": "عدّل البطولة",
    "admin.editTournament.submit": "حدّث البطولة",
    "admin.editTournament.otherwise": "البطولة دي مينفعش تتغيّر.",
    "admin.view.tabs": "البطولة",
    "admin.view.players": "اللاعبين",
    "admin.view.competitions": "المسابقات",
    "admin.view.managers": "المديرين",
    "admin.view.notes": "الملاحظات",
    "admin.view.scorers": "مسجّلي النتايج",
    "admin.view.rankings": "التصنيفات",
    "admin.rankings.textFile":
      "نتايج البطولة بتتبعت للتصنيف العالمي كملف نصي، والموقع بيكتبه من المباريات اللي اتسجلت.",
    "admin.rankings.spreadsheet":
      "نتايج البطولة بتتبعت للتصنيف العالمي كجدول بيانات، والموقع بيكتبه من المباريات اللي اتسجلت.",
    "admin.rankings.fillInWinners":
      "الموقع مش بيقدر غير يخمّن مين كسب كل مسابقة، فراجع سطر الفايز (Winner) في كل واحدة قبل ما تبعت الملف.",
    "admin.rankings.fillInWinner":
      "الموقع مش ممكن يعرف مين كسب البطولة، فاكتبه في آخر جدول البيانات قبل ما تبعته.",
    "admin.rankings.sendIt": "وبعدين ابعت الملف لمسؤولي التصنيف العالمي.",
    "admin.rankings.download": "تنزيل التصنيفات",
    "rankings.notAvailable": "التصنيفات مش متاحة",
    "rankings.notAvailable.sport":
      "رياضة البطولة دي مالهاش تصنيف عالمي، فمفيش تصنيفات تتبعت.",
    "rankings.notAvailable.notCounted":
      "ولا واحدة من مسابقات البطولة دي بتتحسب في التصنيف العالمي.",
    "admin.view.otherwise": "البطولة دي مينفعش تتدار من هنا.",
    "admin.competitionView.tabs": "المسابقة",
    "admin.competitionView.players": "اللاعبين",
    "admin.competitionView.scores": "النتايج",
    "admin.sections.label": "البطولة ومسابقاتها",
    "admin.sections.tournament": "البطولة",
    "admin.administrator.sections.label": "صفحات المسؤول",
    "admin.administrator.sections.tournaments": "البطولات",
    "admin.administrator.sections.accounts": "الحسابات",
    "admin.administrator.sections.worldRankings": "التصنيف العالمي",
    "admin.administrator.sections.importErrors": "أخطاء الاستيراد",
    "admin.administrator.sections.logs": "السجلات",
    "admin.administrator.sections.databaseStatus": "الوصول لقاعدة البيانات",
    "admin.databaseStatus.title": "الوصول لقاعدة البيانات",
    "admin.databaseStatus.on": "الوصول لقاعدة البيانات شغّال.",
    "admin.databaseStatus.off": "الوصول لقاعدة البيانات واقف.",
    "admin.databaseStatus.expected":
      "متوقع إن الموقع يرجع بعد {minutes} دقيقة.",
    "admin.databaseStatus.expectedOne": "متوقع إن الموقع يرجع بعد دقيقة.",
    "admin.databaseStatus.longer": "الموضوع واخد وقت أطول من المتوقع.",
    "admin.databaseStatus.told": "الزوار هيشوفوا: {words}",
    "admin.databaseStatus.toldUsual": "الزوار هيشوفوا الجملة المعتادة.",
    "admin.databaseStatus.minutes": "الدقايق المتوقعة",
    "admin.databaseStatus.words": "كلام للزوار",
    "admin.databaseStatus.turnOff": "وقّف",
    "admin.databaseStatus.change": "عدّل",
    "admin.databaseStatus.turnOn": "شغّل",
    "admin.databaseStatus.minutesNeeded": "لازم تكتب الدقايق.",
    "admin.databaseStatus.otherwise": "حصل خطأ في الموقع.",
    "DatabaseAccess.MinutesNotWhole": "الدقايق لازم تكون رقم صحيح.",
    "DatabaseAccess.MinutesOutOfRange": "الدقايق لازم تكون من 1 لـ 1440.",
    "DatabaseAccess.WordsTooLong": "الكلام لازم ميزيدش عن 500 حرف.",
    "DatabaseAccess.NotOff": "الوصول لقاعدة البيانات مش واقف.",
    "admin.administrator.title": "المسؤول",
    "admin.accounts.title": "الحسابات",
    "admin.roles.add": "أضف",
    "admin.roles.administrator.heading": "المسؤولين",
    "admin.roles.administrator.none": "مفيش مسؤولين تانيين",
    "admin.roles.administrator.removeTitle": "شيل مسؤول",
    "admin.roles.administrator.removeExplanation":
      "{name} مش هيبقى مسؤول عن الموقع ده تاني.",
    "admin.roles.world-ranking-officer.heading": "المسؤولين عن التصنيف العالمي",
    "admin.roles.world-ranking-officer.none": "مفيش مسؤولين عن التصنيف العالمي",
    "admin.roles.world-ranking-officer.removeTitle":
      "شيل المسؤول عن التصنيف العالمي",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} مش هيبقى مسؤول عن التصنيف العالمي تاني.",
    "admin.worldRankings.title": "استيراد لاعبين التصنيف العالمي",
    "admin.worldRankings.import": "استورد",
    "admin.worldRankings.log": "إزاي مشي الاستيراد",
    "admin.worldRankings.ac.reading": "بنقرأ قايمة أسوشيشن كروكيه",
    "admin.worldRankings.ac.read":
      "لاعبين أسوشيشن كروكيه اللي اتقروا: {players}",
    "admin.worldRankings.ac.kept":
      "لاعبين أسوشيشن كروكيه اللي اتحفظوا: {players}",
    "admin.worldRankings.ac.refused":
      "مقدرناش نقرأ قايمة أسوشيشن كروكيه، فسبنا لاعبينها زي ما هما.",
    "admin.worldRankings.gc.reading": "بنقرأ قايمة جولف كروكيه",
    "admin.worldRankings.gc.read": "لاعبين جولف كروكيه اللي اتقروا: {players}",
    "admin.worldRankings.gc.kept": "لاعبين جولف كروكيه اللي اتحفظوا: {players}",
    "admin.worldRankings.gc.refused":
      "مقدرناش نقرأ قايمة جولف كروكيه، فسبنا لاعبينها زي ما هما.",
    "admin.worldRankings.finished": "خلص",
    "admin.worldRankings.failed": "الاستيراد ما خلصش.",
    "admin.worldRankings.otherwise": "حصلت مشكلة في الموقع.",
    "WorldRankingLists.Unreachable": "مقدرناش نوصل لموقع التصنيف العالمي.",
    "WorldRankingLists.Unreadable":
      "القايمة مش بالشكل بتاع قوايم التصنيف العالمي: سطر ما اتقراش، أو مفيهوش حد، أو مش مكتوب بـ UTF-8.",
    "admin.importErrors.title": "أخطاء الاستيراد",
    "admin.importErrors.none": "مفيش أخطاء استيراد",
    "admin.importErrors.otherwise": "حصلت مشكلة في الموقع.",
    "admin.logs.title": "السجلات",
    "admin.logs.severity": "الخطورة",
    "admin.logs.text": "بحث",
    "admin.logs.show": "اعرض",
    "admin.logs.prune": "نضّف",
    "admin.logs.pruneAsk":
      "تمسح السجل اللي أقدم من آخر ساعة؟ مفيش حاجة بترجّعه.",
    "admin.logs.removed": "اتمسح {count} من الإدخالات",
    "admin.logs.none": "مفيش إدخالات في السجل",
    "admin.logs.otherwise": "حصلت مشكلة في الموقع.",
    "admin.hover.logs.show": "اعرض الإدخالات المطابقة",
    "admin.hover.logs.prune": "امسح السجل اللي أقدم من آخر ساعة",
    "admin.hover.logs.pruneAgree": "امسح السجل اللي أقدم من آخر ساعة",
    "admin.importError.title": "خطأ استيراد",
    "admin.importError.documentId": "رقم المستند",
    "admin.importError.tournament": "البطولة",
    "admin.importError.competition": "المسابقة",
    "admin.importError.newSite": "الموقع الجديد",
    "admin.importError.oldSite": "الموقع القديم",
    "ImportErrorKept.NotFound": "الاستيراد ما حفظش أي خطأ للمستند ده.",
    "admin.competitionView.otherwise": "المسابقة دي مينفعش تتدار من هنا.",
    "admin.competitions.block": "مجموعات",
    "admin.competitions.knockout": "خروج المغلوب",
    "admin.competitions.swiss": "سويسري",
    "admin.competitions.view": "شوف",
    "admin.competitions.edit": "عدّل",
    "admin.competitions.up": "فوق",
    "admin.competitions.down": "تحت",
    "admin.competitions.archive": "أرشِف",
    "admin.competitions.restore": "رجّع",
    "admin.competitions.archived": "مسابقات في الأرشيف",
    "admin.competitions.none": "مفيش مسابقات",
    "admin.competitions.add": "أضف مسابقة",
    // The competition dialog.
    "admin.competition.addTitle": "أضف مسابقة",
    "admin.competition.editTitle": "عدّل المسابقة",
    "admin.competition.name": "الاسم",
    "admin.competition.kind": "النوع",
    "admin.competition.bestOf": "بأفضل",
    "admin.competition.rounds": "الجولات",
    "admin.competition.places": "الأماكن",
    "admin.competition.round": "الدور {number}",
    "admin.competition.bestOfs": "بأفضل",
    "admin.competition.quarters": "ربع النهائي",
    "admin.competition.semis": "نصف النهائي",
    "admin.competition.final": "النهائي",
    "admin.competition.add": "أضف",
    "admin.competition.save": "احفظ",
    "admin.competition.added": "اتضافت {name}.",
    "admin.competition.otherwise": "المسابقة دي مينفعش تتحفظ زي ما هي.",
    "CompetitionName.Missing": "اكتب الاسم.",
    "CompetitionName.TooLong": "الاسم أطول حاجة 254 حرف.",
    "CompetitionName.NoLetterOrDigit": "الاسم لازم فيه حرف أو رقم.",
    "Tournament.KnockoutPlayerHasGames":
      "في لاعبين في الجدول ده ليهم ماتشات، فأماكنهم مينفعش تتغيّر.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "الدور اللي فيه ماتش اتحسم مينفعش نقلل عدد ألعابه.",
    "Tournament.KnockoutLaterRoundHasGames":
      "الدور مينفعش يتغيّر بعد ما اتلعبت لعبة في دور بعده.",
    "Tournament.CompetitionNameTaken":
      "في مسابقة تانية في البطولة دي بنفس الاسم.",
    "BestOf.NotWhole": "اكتب عدد صحيح من الجيمات.",
    "BestOf.TooSmall": "الماتش لازم يكون بأفضل جيم واحد على الأقل.",
    "Rounds.NotWhole": "اكتب عدد صحيح من الجولات.",
    "Rounds.TooSmall": "البلوك لازم يتلعب في جولة واحدة على الأقل.",
    "KnockoutDraw.EvenBestOf":
      "ماتش خروج المغلوب لازم يطلع له فايز، فبيكون بأفضل عدد فردي من الجيمات.",
    "admin.hover.tournaments.new": "أنشئ بطولة جديدة",
    "admin.hover.tournaments.manage":
      "إدارة لاعبين البطولة دي وفرقها ومسابقاتها ونتايجها",
    "admin.hover.tournaments.edit": "غيّر بيانات البطولة دي",
    "admin.hover.tournaments.scores": "اكتب نتايج البطولة دي",
    "admin.hover.tournaments.players": "اهتم بلاعبين البطولة دي",
    "admin.hover.competitions.view":
      "افتح المسابقة دي علشان تشوف لاعبينها ونتايجها وتكتبهم",
    "admin.hover.tests.view": "افتح التيست ده علشان تشوف نتايجه وتكتبها",
    "admin.hover.teams.view": "افتح الفريق ده علشان تشوف لاعبينه وتديرهم",
    "admin.hover.dialog.player.add": "ضيف اللاعب ده للبطولة",
    "admin.hover.dialog.player.save": "احفظ تغييرات اللاعب ده",
    "admin.hover.dialog.team.add": "ضيف الفريق ده للبطولة",
    "admin.hover.dialog.team.save": "احفظ تغييرات الفريق ده",
    "admin.hover.dialog.test.add": "ضيف التيست ده للبطولة",
    "admin.hover.dialog.test.save": "احفظ تغييرات التيست ده",
    "admin.hover.dialog.competition.add": "ضيف المسابقة دي للبطولة",
    "admin.hover.dialog.competition.save": "احفظ تغييرات المسابقة دي",
    "admin.hover.dialog.score.add": "ضيف النتيجة دي للمسابقة",
    "admin.hover.dialog.score.save": "احفظ تصحيح النتيجة دي",
    "admin.hover.dialog.carryForward.save": "رحّل نتايج اللاعب ده",
    "admin.hover.dialog.tournament.new": "أنشئ البطولة دي",
    "admin.hover.dialog.tournament.edit": "احفظ تغييرات البطولة دي",
    "admin.hover.modal.cancel": "اقفل ده من غير ما تحفظ حاجة",
    "admin.hover.modal.ok": "اقفل الرسالة دي",
    "admin.hover.tab": "اعرض تبويب {name}",
    "admin.hover.tournaments.archive": "أرشِف البطولة دي؛ ممكن ترجّعها بعدين",
    "admin.hover.tournaments.restore": "رجّع البطولة دي من الأرشيف",
    "admin.hover.players.add": "ضيف لاعب للبطولة دي",
    "admin.hover.players.edit": "غيّر بيانات اللاعب ده",
    "admin.hover.players.up": "طلّع اللاعب ده فوق في القايمة",
    "admin.hover.players.down": "نزّل اللاعب ده تحت في القايمة",
    "admin.hover.players.archive": "أرشِف اللاعب ده؛ ممكن ترجّعه بعدين",
    "admin.hover.players.restore": "رجّع اللاعب ده من الأرشيف",
    "admin.hover.teams.add": "ضيف فريق للبطولة دي",
    "admin.hover.teams.edit": "غيّر بيانات الفريق ده",
    "admin.hover.teams.up": "طلّع الفريق ده فوق في القايمة",
    "admin.hover.teams.down": "نزّل الفريق ده تحت في القايمة",
    "admin.hover.teams.archive": "أرشِف الفريق ده؛ ممكن ترجّعه بعدين",
    "admin.hover.teams.restore": "رجّع الفريق ده من الأرشيف",
    "admin.hover.competitions.add": "ضيف مسابقة للبطولة دي",
    "admin.hover.competitions.edit": "غيّر بيانات المسابقة دي",
    "admin.hover.competitions.up": "طلّع المسابقة دي فوق في القايمة",
    "admin.hover.competitions.down": "نزّل المسابقة دي تحت في القايمة",
    "admin.hover.competitions.archive": "أرشِف المسابقة دي؛ ممكن ترجّعها بعدين",
    "admin.hover.competitions.restore": "رجّع المسابقة دي من الأرشيف",
    "admin.hover.tests.add": "ضيف تيست بين فريقين",
    "admin.hover.tests.edit": "غيّر بيانات التيست ده",
    "admin.hover.tests.up": "طلّع التيست ده فوق في القايمة",
    "admin.hover.tests.down": "نزّل التيست ده تحت في القايمة",
    "admin.hover.tests.archive": "أرشِف التيست ده؛ ممكن ترجّعه بعدين",
    "admin.hover.tests.restore": "رجّع التيست ده من الأرشيف",
    "admin.hover.tests.toTeams":
      "روح على تبويب الفرق علشان تضيف الفرق اللي التيست محتاجها",
    "admin.hover.scores.add": "ضيف نتيجة ماتش للمسابقة دي",
    "admin.hover.scores.edit": "صحّح النتيجة دي",
    "admin.hover.scores.archive":
      "أرشِف النتيجة دي علشان ما تتحسبش؛ ممكن ترجّعها بعدين",
    "admin.hover.scores.restore": "رجّع النتيجة دي من الأرشيف علشان تتحسب تاني",
    "admin.hover.scores.withdraw": "سيب النتيجة دي في القايمة بس ما تتحسبش",
    "admin.hover.scores.unwithdraw": "خلّي النتيجة المسحوبة دي تتحسب تاني",
    "admin.hover.scores.up": "قدّم النتيجة دي في القايمة",
    "admin.hover.scores.down": "أخّر النتيجة دي في القايمة",
    "admin.hover.competitionPlayers.add":
      "حط اللاعب اللي اخترته في المسابقة دي",
    "admin.hover.competitionPlayers.up": "طلّع اللاعب ده فوق في القايمة",
    "admin.hover.competitionPlayers.down": "نزّل اللاعب ده تحت في القايمة",
    "admin.hover.competitionPlayers.remove": "شيل اللاعب ده من المسابقة",
    "admin.hover.competitionPlayers.withdraw": "اسحب اللاعب ده من المسابقة",
    "admin.hover.competitionPlayers.unwithdraw":
      "رجّع اللاعب المسحوب ده للمسابقة",
    "admin.hover.competitionPlayers.carryForward":
      "رحّل نتايج اللاعب ده من مسابقة تانية",
    "admin.hover.notes.add": "اكتب ملاحظة جديدة للبطولة دي",
    "admin.hover.notes.edit": "غيّر الملاحظة دي",
    "admin.hover.notes.delete": "امسح الملاحظة دي",
    "admin.hover.note.add": "احفظ الملاحظة دي وضيفها للبطولة",
    "admin.hover.note.save": "احفظ تغييرات الملاحظة دي",
    "admin.hover.people.add": "إدّي الدور ده للشخص ده",
    "admin.hover.people.remove": "شيل الدور ده من الشخص ده",
    "admin.hover.worldRankings.import": "هات التصنيفات العالمية وضيف لاعبينها",
    "admin.modal.cancel": "إلغاء",
    "admin.modal.ok": "تمام",
    "admin.people.emailAddress": "عنوان البريد الإلكتروني",
    "admin.people.remove": "شيل",
    "admin.people.otherwise": "مقدرناش نعمل ده.",
    "admin.managers.you": "إنت",
    "admin.managers.add": "أضف مدير",
    "admin.managers.none": "مفيش مديرين",
    "admin.managers.removeTitle": "شيل مدير",
    "admin.managers.removeExplanation": "{name} مش هيقدر يدير البطولة دي تاني.",
    "admin.managers.removeYourself.explanation":
      "مش هتقدر تدير البطولة دي تاني، ومحدش هنا يقدر يرجّعها لك. أي مدير تاني يقدر يخليك مدير من جديد.",
    "admin.managers.otherwise": "العنوان ده مينفعش يتعمل مدير.",
    "admin.competitionPlayers.add": "أضف لاعب",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "اللاعب ده مينفعش يتضاف.",
    "admin.competitionPlayers.choose": "اللاعب اللي هيتضاف",
    "admin.competitionPlayers.nobody": "اختار لاعب",
    "admin.competitionPlayers.bye": "إعفاء",
    "admin.competitionPlayers.all": "كل اللاعبين في المسابقة",
    "admin.competitionPlayers.none": "مفيش لاعبين",
    "admin.competitionPlayers.up": "فوق",
    "admin.competitionPlayers.down": "تحت",
    "admin.competitionPlayers.remove": "شيل",
    "admin.competitionPlayers.withdraw": "اسحب",
    "admin.competitionPlayers.unwithdraw": "الغي السحب",
    "admin.competitionPlayers.withdrawn": "لاعبين مسحوبين",
    "admin.competitionPlayers.removeTitle": "شيل لاعب",
    "admin.competitionPlayers.removeQuestion":
      "{name} هيخرج من المسابقة. مينفعش ترجّع ده.",
    "admin.competitionPlayers.withdrawTitle": "اسحب لاعب",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} مش هيلعب في المسابقة تاني، والجيمات اللي ما لعبهاش هتتحسم من غيره.",
    "admin.competitionPlayers.carryForward": "ترحيل",
    "admin.carryForward.title": "ترحيل - {name}",
    "admin.carryForward.save": "احفظ",
    "admin.carryForward.otherwise": "الترحيل ده مينفعش يتحفظ.",
    "admin.carryForward.matchWins": "ماتشات مكسوبة",
    "admin.carryForward.matchLosses": "ماتشات مخسورة",
    "admin.carryForward.gameWins": "جيمات مكسوبة",
    "admin.carryForward.gameLosses": "جيمات مخسورة",
    "admin.carryForward.hoopsFor": "أطواق له",
    "admin.carryForward.hoopsAgainst": "أطواق عليه",
    "CarryForward.MatchWinsNotWhole": "اكتب عدد صحيح من الماتشات المكسوبة.",
    "CarryForward.MatchWinsBelowZero": "اكتب 0 أو أكتر من الماتشات المكسوبة.",
    "CarryForward.MatchLossesNotWhole": "اكتب عدد صحيح من الماتشات المخسورة.",
    "CarryForward.MatchLossesBelowZero": "اكتب 0 أو أكتر من الماتشات المخسورة.",
    "CarryForward.GameWinsNotWhole": "اكتب عدد صحيح من الجيمات المكسوبة.",
    "CarryForward.GameWinsBelowZero": "اكتب 0 أو أكتر من الجيمات المكسوبة.",
    "CarryForward.GameLossesNotWhole": "اكتب عدد صحيح من الجيمات المخسورة.",
    "CarryForward.GameLossesBelowZero": "اكتب 0 أو أكتر من الجيمات المخسورة.",
    "CarryForward.HoopsForNotWhole": "اكتب عدد صحيح من الأطواق له.",
    "CarryForward.HoopsForBelowZero": "اكتب 0 أو أكتر من الأطواق له.",
    "CarryForward.HoopsAgainstNotWhole": "اكتب عدد صحيح من الأطواق عليه.",
    "CarryForward.HoopsAgainstBelowZero": "اكتب 0 أو أكتر من الأطواق عليه.",
    "admin.scores.add": "أضف نتيجة",
    "admin.scores.none": "مفيش نتايج",
    "admin.scores.edit": "عدّل",
    "admin.scores.drawNotFilledTitle": "الجدول لسه ناقص",
    "admin.scores.archive": "أرشِف",
    "admin.scores.up": "فوق",
    "admin.scores.down": "تحت",
    "admin.scores.restore": "رجّع",
    "admin.scores.archived": "نتايج في الأرشيف",
    "admin.scores.archivedSaid": "في الأرشيف",
    "admin.scores.withdraw": "اسحب",
    "admin.scores.unwithdraw": "الغي السحب",
    "admin.scores.withdrawnSaid": "مسحوبة",
    "admin.scores.otherwise": "مقدرناش نعمل ده.",
    "admin.score.title": "أضف نتيجة",
    "admin.score.add": "أضف جيم",
    "admin.score.winner": "الفايز",
    "admin.score.winnerScore": "نقاط الفايز",
    "admin.score.loser": "الخسران",
    "admin.score.loserScore": "نقاط الخسران",
    "admin.score.beat": "غلب",
    "admin.score.added": "اتضاف الجيم اللي كسبه {winner} على {loser}.",
    "admin.score.otherwise": "مقدرناش نضيف الجيم.",
    "admin.score.correctTitle": "عدّل النتيجة",
    "admin.score.save": "احفظ",
    "admin.score.notCorrected": "مقدرناش نصحّح النتيجة.",
    "Game.WinnerMissing": "اختار الفايز.",
    "Game.WinnerScoreMissing": "اكتب نقاط الفايز.",
    "Game.LoserMissing": "اختار الخسران.",
    "Game.LoserScoreMissing": "اكتب نقاط الخسران.",
    "Score.NoPoints": "النقاط بتبدأ برقم.",
    "Game.SamePlayer": "مفيش حد بيلعب ضد نفسه.",
    "Game.WinnerNotAhead":
      "الفايز لازم نقاطه أكتر من الخسران، أو يتعلّم إنه فايز.",
    "Game.LoserMarked": "نقاط الخسران مينفعش تتعلّم إنها مكسوبة.",
    "Game.ResultChanged":
      "التصحيح بيحافظ على النتيجة: الجيم المكسوب يفضل مكسوب، والمتعادل يفضل متعادل.",
    "Competition.MatchDecided": "الماتش بتاعهم اتحسم خلاص.",
    "Competition.DrawFull": "اللاعب ده مينفعش يتضاف لأن الجدول مليان.",
    "Competition.DrawNotFilled":
      "مينفعش تتضاف نتايج لحد ما كل مكان في الجدول يبقى فيه لاعب أو إعفاء.",
    "Competition.ByeOutsideKnockout":
      "خروج المغلوب بس هو اللي ممكن يبقى فيه إعفاء.",
    "Competition.NotDrawnToMeet": "القرعة ما جابتهمش يلعبوا مع بعض.",
    "Competition.WinnerHasPlayedOn":
      "فايز الماتش ده لعب ماتشه اللي بعده خلاص، فمينفعش نغيّر مين كسبه.",
    "CompetitionPlayer.Withdrawn": "اللاعب المسحوب ما بيلعبش تاني.",
    "admin.players.add": "أضف لاعب",
    "admin.players.none": "مفيش لاعبين",
    "admin.players.edit": "عدّل",
    "admin.players.archive": "أرشِف",
    "admin.players.restore": "رجّع",
    "admin.players.up": "فوق",
    "admin.players.down": "تحت",
    "admin.players.archiveTitle": "أرشِف لاعب",
    "admin.players.archiveQuestion": "{name} هيتشال من المسابقات دي:",
    "admin.players.archive.explanation":
      "لما ترجّع اللاعب مش هيرجع للمسابقات دي.",
    "admin.players.archived": "لاعبين في الأرشيف",
    "admin.players.archivedSaid": "في الأرشيف",
    "admin.player.addTitle": "أضف لاعب",
    "admin.player.editTitle": "عدّل اللاعب",
    "admin.player.name": "الاسم",
    "admin.player.representing": "بيمثّل",
    "admin.player.worldRankingName": "الاسم في التصنيف العالمي",
    "admin.player.worldRankingKnown": "التصنيف العالمي يعرف الاسم ده.",
    "admin.player.worldRankingQuestioned":
      "مفيش في التصنيف العالمي لاعب بالاسم ده. ممكن يكون مكتوب غلط، أو اللاعب جديد على التصنيف.",
    "admin.player.flag": "العلم",
    "admin.player.add": "أضف",
    "admin.player.save": "احفظ",
    "admin.player.added": "اتضاف {name}.",
    "admin.player.otherwise": "اللاعب ده مينفعش يتحفظ زي ما هو.",
    "Tournament.PlayerNameTaken": "في لاعب تاني في البطولة دي بنفس الاسم.",
    "TournamentPlayer.NoSuchFlag": "اختار علم من الأعلام الموجودة.",
    "TournamentPlayer.NamedBye": "اللاعب مينفعش اسمه إعفاء.",
    "TournamentPlayer.NoLetterOrDigit": "الاسم لازم فيه حرف أو رقم.",
    "admin.player.byesTitle": "الإعفاءات ما بتتضافش",
    "admin.player.byes":
      "الإعفاء مش لاعب في البطولة. خروج المغلوب بيعرض الإعفاء لما تضيف لاعبينه، بعدد المرات اللي الجدول محتاجها.",
    "admin.view.teams": "الفرق",
    "admin.view.tests": "التيستات",
    "admin.teams.add": "أضف فريق",
    "admin.teams.none": "مفيش فرق",
    "admin.teams.edit": "عدّل",
    "admin.teams.view": "شوف",
    "admin.teams.archive": "أرشِف",
    "admin.teams.restore": "رجّع",
    "admin.teams.up": "فوق",
    "admin.teams.down": "تحت",
    "admin.teams.archived": "فرق في الأرشيف",
    "admin.teams.archivedSaid": "في الأرشيف",
    "admin.team.addTitle": "أضف فريق",
    "admin.team.editTitle": "عدّل الفريق",
    "admin.team.name": "الاسم",
    "admin.team.shortName": "الاسم المختصر",
    "admin.team.shortName.explanation":
      "بيتسمّى بيه تيستات الفريق، زي AUS v ENG.",
    "admin.team.flag": "العلم",
    "admin.team.add": "أضف",
    "admin.team.save": "احفظ",
    "admin.team.added": "اتضاف {name}.",
    "admin.team.otherwise": "الفريق ده مينفعش يتحفظ زي ما هو.",
    "admin.teamView.otherwise": "الفريق ده مينفعش يتشاف من هنا.",
    "admin.teamView.players": "اللاعبين",
    "TeamName.Missing": "قول اسم الفريق إيه.",
    "TeamName.TooLong": "الاسم ده طويل أوي.",
    "admin.notes.add": "أضف ملاحظة",
    "admin.notes.none": "مفيش ملاحظات",
    "admin.notes.edit": "عدّل",
    "admin.notes.delete": "امسح",
    "admin.notes.deleteTitle": "امسح ملاحظة",
    "admin.notes.deleteQuestion": "تمسح الملاحظة «{title}»؟",
    "admin.notes.delete.explanation":
      "الملاحظة اللي بتتمسح بتروح للأبد ومينفعش ترجّعها.",
    "admin.notes.otherwise": "مقدرناش نعمل ده.",
    "admin.note.addTitle": "أضف ملاحظة",
    "admin.note.editTitle": "عدّل الملاحظة",
    "admin.note.title": "العنوان",
    "admin.note.description": "الوصف",
    "admin.note.write": "اكتب",
    "admin.note.preview": "معاينة",
    "admin.note.toolbar": "التنسيق",
    "admin.note.tool.heading": "عنوان",
    "admin.note.tool.bold": "غامق",
    "admin.note.tool.italic": "مائل",
    "admin.note.tool.quote": "اقتباس",
    "admin.note.tool.code": "كود",
    "admin.note.tool.link": "لينك",
    "admin.note.tool.numberedList": "قايمة مرقّمة",
    "admin.note.tool.bulletedList": "قايمة بنقط",
    "admin.note.tool.taskList": "قايمة مهام",
    "admin.note.add": "أضف",
    "admin.note.save": "احفظ",
    "admin.note.otherwise": "الملاحظة دي مينفعش تتحفظ كده.",
    "ManagerNoteTitle.Missing": "حط عنوان للملاحظة.",
    "ManagerNoteTitle.TooLong": "العنوان ده طويل أوي.",
    "ManagerNoteTitle.NoLetterOrDigit": "العنوان لازم فيه حرف أو رقم.",
    "ManagerNoteDescription.TooLong": "الوصف ده طويل أوي.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون منظّم تاني مسحها.",
    "EditManagerNote.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون منظّم تاني مسحها.",
    "DeleteManagerNote.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون منظّم تاني مسحها.",
    "ManagerNote.Deleted": "الملاحظة دي اتمسحت. ممكن يكون منظّم تاني مسحها.",
    "CommentaryTitle.Missing": "حط عنوان للتعليق.",
    "CommentaryTitle.TooLong": "العنوان ده طويل أوي.",
    "CommentaryTitle.NoLetterOrDigit": "العنوان لازم فيه حرف أو رقم.",
    "Commentary.TitleTaken": "في تعليق تاني بنفس العنوان ده.",
    "CommentText.Missing": "اكتب حاجة في التعليق.",
    "CommentText.TooLong": "التعليق ده طويل أوي.",
    "TeamShortName.Missing": "حط للفريق اسم مختصر.",
    "TeamShortName.TooLong": "الاسم المختصر أطول حاجة 10 حروف.",
    "TeamShortName.NoLetterOrDigit": "الاسم المختصر لازم فيه حرف أو رقم.",
    "Team.ShortNameLongerThanName":
      "الاسم المختصر مينفعش يكون أطول من اسم الفريق.",
    "Team.NoSuchFlag": "اختار علم من الأعلام الموجودة.",
    "Team.Archived": "الفريق ده في الأرشيف، ولازم الأول ترجّعه.",
    "Team.InATest": "الفريق ده بيلعب في تيست، فمينفعش يتأرشف.",
    "Team.PlayerNameTaken": "في لاعب تاني في الفريق ده بنفس الاسم.",
    "TeamPlayer.NamedBye": "اللاعب مينفعش اسمه إعفاء.",
    "TeamPlayer.Archived": "اللاعب ده في الأرشيف، ولازم الأول ترجّعه.",
    "TeamPlayer.HasGames": "اللاعب ده لعب، فمينفعش يتأرشف.",
    "Tournament.TeamNameTaken": "في فريق تاني في البطولة دي بنفس الاسم.",
    "Tournament.TeamShortNameTaken":
      "في فريق تاني في البطولة دي بنفس الاسم المختصر.",
    "Tournament.NoSuchTeam": "البطولة دي ملهاش فريق على العنوان ده.",
    "Tournament.TeamArchived":
      "الفريق ده في الأرشيف، ومينفعش ترجّعه غير من تبويب الفرق.",
    "admin.tests.add": "أضف تيست",
    "admin.tests.none": "مفيش تيستات",
    "admin.tests.edit": "عدّل",
    "admin.tests.view": "شوف",
    "admin.tests.archive": "أرشِف",
    "admin.tests.restore": "رجّع",
    "admin.tests.up": "فوق",
    "admin.tests.down": "تحت",
    "admin.tests.archived": "تيستات في الأرشيف",
    "admin.tests.twoTeamsNeeded":
      "التيست بين فريقين، فلازم الأول يبقى عندك فريقين.",
    "admin.tests.toTeams": "روح على الفرق",
    "admin.tests.matches.one": "{count} ماتش",
    "admin.tests.matches.other": "{count} ماتشات",
    "admin.tests.bestOf": "بأفضل {games}",
    "admin.tests.otherwise": "مقدرناش نعمل ده.",
    "admin.test.addTitle": "أضف تيست",
    "admin.test.editTitle": "عدّل التيست",
    "admin.test.firstTeam": "الفريق أ",
    "admin.test.secondTeam": "الفريق ب",
    "admin.test.versus": "ضد",
    "admin.test.starts": "بيبدأ",
    "admin.test.finishes": "بيخلص",
    "admin.test.expectedMatches": "الماتشات المتوقّعة",
    "admin.test.bestOf": "بأفضل",
    "admin.test.group": "المجموعة",
    "admin.test.add": "أضف",
    "admin.test.save": "احفظ",
    "admin.test.added": "اتضاف {name}.",
    "admin.test.otherwise": "التيست ده مينفعش يتحفظ زي ما هو.",
    "admin.testView.otherwise": "التيست ده مينفعش يتشاف من هنا.",
    "AddTest.FirstTeamMissing": "اختار الفريق الأول.",
    "AddTest.SecondTeamMissing": "اختار الفريق التاني.",
    "UpdateTest.FirstTeamMissing": "اختار الفريق الأول.",
    "UpdateTest.SecondTeamMissing": "اختار الفريق التاني.",
    "ExpectedMatches.NotWhole": "اكتب عدد صحيح من الماتشات.",
    "ExpectedMatches.TooSmall":
      "التيست لازم يكون متوقّع فيه ماتش واحد على الأقل.",
    "TestGroup.TooLong": "المجموعة دي طويلة أوي.",
    "Tournament.TestAgainstItself": "الفريق مبيلعبش تيست ضد نفسه.",
    "Tournament.TestFinishesBeforeStarts": "التيست مينفعش يخلص قبل ما يبدأ.",
    "Tournament.TestStartsBeforeTournament":
      "التيست مينفعش يبدأ قبل البطولة بتاعته.",
    "Tournament.TestFinishesAfterTournament":
      "التيست مينفعش يخلص بعد البطولة بتاعته.",
    "Tournament.TestHasGamesInUse":
      "التيست ده فيه جيمات، فمينفعش يتأرشف لحد ما الجيمات تتأرشف.",
    "Tournament.TestHasGames": "التيست ده فيه جيمات خلاص، فمينفعش نغيّر فرقه.",
    "Tournament.ExpectedMatchesBelowStarted":
      "اتبدأ ماتشات أكتر من كده بالفعل.",
    "Tournament.BestOfBelowGamesPlayed":
      "لاعبين اتنين لعبوا جيمات أكتر من كده بالفعل.",
    "Competition.ExpectedMatchesReached":
      "التيست ده بدأ كل الماتشات المتوقّعة فيه خلاص.",
    "Competition.SameTeam": "لاعبين من نفس الفريق مبيلعبوش ضد بعض.",
    "AddManager.NoSuchAccount":
      "عنوان البريد الإلكتروني ده ملوش حساب ينفع يتعمل مدير.",
    "Account.NotAnAdministrator": "المسؤول بس هو اللي يقدر يعمل ده.",
    "AddRole.NoSuchAccount":
      "عنوان البريد الإلكتروني ده ملوش حساب ينفع نديله الدور.",
    "AddRole.NoSuchRole": "الدور ده مش موجود.",
    "RemoveRole.NoSuchAccount": "الحساب ده مش موجود.",
    "RemoveRole.NoSuchRole": "الدور ده مش موجود.",
    "RemoveRole.Yourself": "مينفعش تشيل دور المسؤول من نفسك.",
    "AccountsWithRole.NoSuchRole": "الدور ده مش موجود.",
    "admin.scorers.add": "أضف مسجّل نتايج",
    "admin.scorers.none": "مفيش مسجّلين نتايج",
    "admin.scorers.removeTitle": "شيل مسجّل نتايج",
    "admin.scorers.removeExplanation":
      "{name} مش هيقدر يسجّل نتايج البطولة دي تاني.",
    "admin.scorers.otherwise":
      "عنوان البريد الإلكتروني ده مينفعش يتعمل مسجّل نتايج.",
    "AddScorer.NoSuchAccount":
      "عنوان البريد الإلكتروني ده ملوش حساب ينفع يتعمل مسجّل نتايج.",
    "Tournament.AlreadyAManager":
      "الحساب ده بيدير البطولة أصلاً، وبيقدر يعمل كل اللي مسجّل النتايج بيعمله.",

    "TournamentName.Missing": "قول اسم البطولة إيه.",
    "TournamentName.TooShort": "الاسم ده قصير أوي.",
    "TournamentName.TooLong": "الاسم ده طويل أوي.",
    "TournamentName.AllLowerCase": "الاسم مينفعش يبقى كله بحروف صغيرة.",
    "TournamentName.AllCapitals": "الاسم مينفعش يبقى كله بحروف كبيرة.",
    "TournamentName.NoLetterOrDigit": "الاسم لازم فيه حرف أو رقم.",
    "ReadOnlyDate.Unreadable": "حدّد اليوم.",
    "Tournament.FinishesBeforeStarts": "البطولة مينفعش تخلص قبل ما تبدأ.",
    "Tournament.StartsAfterNextYear": "البطولة مينفعش تبدأ بعد السنة الجاية.",
    "Tournament.FinishesAfterNextYear": "البطولة مينفعش تخلص بعد السنة الجاية.",
    "CreateTournament.NoSuchCountry": "اختار البلد.",
    "TournamentSubtitle.TooLong": "العنوان الفرعي أطول حاجة 2000 حرف.",
    "Tournament.NotAManager": "اللي بيدير البطولة دي بس هو اللي يغيّرها.",
    "Tournament.NotAManagerOrScorer":
      "اللي بيدير البطولة دي أو بيسجّل نتايجها بس هو اللي يشوفها.",
    "Tournament.Archived":
      "البطولة دي في الأرشيف، ولازم ترجّعها قبل ما تغيّرها.",
    "UpdateTournament.NoSuchTournament": "مفيش بطولة على العنوان ده.",

    // The sports keep the names their players use in Egypt, which are mostly
    // the English names written in Arabic letters, and the formats named for
    // a competition keep its name, as a name is not translated.
    "sport.ac": "أسوشيشن كروكيه",
    "sport.gc": "جولف كروكيه",
    "sport.a6w": "الكروكيه الأمريكي بستة أطواق",
    "sport.rc": "ريكوشيه",
    "sport.gb": "جيت بول",
    "format.standard": "عادي",
    "format.teams": "فرق",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "أندورا",
    "country.ae": "الإمارات",
    "country.af": "أفغانستان",
    "country.ag": "أنتيجوا وبربودا",
    "country.ai": "أنجويلا",
    "country.al": "ألبانيا",
    "country.am": "أرمينيا",
    "country.ao": "أنجولا",
    "country.ar": "الأرجنتين",
    "country.as": "ساموا الأمريكية",
    "country.at": "النمسا",
    "country.au": "أستراليا",
    "country.aw": "أروبا",
    "country.ax": "جزر آلاند",
    "country.az": "أذربيجان",
    "country.ba": "البوسنة والهرسك",
    "country.bb": "بربادوس",
    "country.bd": "بنجلاديش",
    "country.be": "بلجيكا",
    "country.bf": "بوركينا فاسو",
    "country.bg": "بلغاريا",
    "country.bh": "البحرين",
    "country.bi": "بوروندي",
    "country.bj": "بنين",
    "country.bm": "برمودا",
    "country.bn": "بروناي",
    "country.bo": "بوليفيا",
    "country.br": "البرازيل",
    "country.bs": "جزر البهاما",
    "country.bt": "بوتان",
    "country.bv": "جزيرة بوفيه",
    "country.bw": "بوتسوانا",
    "country.by": "بيلاروسيا",
    "country.bz": "بليز",
    "country.ca": "كندا",
    "country.catalonia": "كتالونيا",
    "country.cc": "جزر كوكوس",
    "country.cd": "الكونغو الديمقراطية",
    "country.cf": "جمهورية أفريقيا الوسطى",
    "country.cg": "جمهورية الكونغو",
    "country.ch": "سويسرا",
    "country.ci": "ساحل العاج",
    "country.ck": "جزر كوك",
    "country.cl": "تشيلي",
    "country.cm": "الكاميرون",
    "country.cn": "الصين",
    "country.co": "كولومبيا",
    "country.cr": "كوستاريكا",
    "country.cu": "كوبا",
    "country.cv": "الرأس الأخضر",
    "country.cx": "جزيرة كريسماس",
    "country.cy": "قبرص",
    "country.cz": "التشيك",
    "country.de": "ألمانيا",
    "country.dj": "جيبوتي",
    "country.dk": "الدنمارك",
    "country.dm": "دومينيكا",
    "country.do": "الدومينيكان",
    "country.dz": "الجزائر",
    "country.ec": "الإكوادور",
    "country.ee": "إستونيا",
    "country.eg": "مصر",
    "country.eh": "الصحراء الغربية",
    "country.england": "إنجلترا",
    "country.er": "إريتريا",
    "country.es": "إسبانيا",
    "country.et": "إثيوبيا",
    "country.fi": "فنلندا",
    "country.fj": "فيجي",
    "country.fk": "جزر فوكلاند",
    "country.fm": "ميكرونيزيا",
    "country.fo": "جزر فارو",
    "country.fr": "فرنسا",
    "country.ga": "الجابون",
    "country.gb": "المملكة المتحدة",
    "country.gd": "جرينادا",
    "country.ge": "جورجيا",
    "country.gf": "غيانا الفرنسية",
    "country.gh": "غانا",
    "country.gi": "جبل طارق",
    "country.gl": "جرينلاند",
    "country.gm": "جامبيا",
    "country.gn": "غينيا",
    "country.gp": "جوادلوب",
    "country.gq": "غينيا الاستوائية",
    "country.gr": "اليونان",
    "country.gs": "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
    "country.gt": "جواتيمالا",
    "country.gu": "جوام",
    "country.gw": "غينيا بيساو",
    "country.gy": "غيانا",
    "country.hk": "هونج كونج",
    "country.hm": "جزيرة هيرد وجزر ماكدونالد",
    "country.hn": "هندوراس",
    "country.hr": "كرواتيا",
    "country.ht": "هايتي",
    "country.hu": "المجر",
    "country.id": "إندونيسيا",
    "country.ie": "أيرلندا",
    "country.il": "إسرائيل",
    "country.im": "جزيرة مان",
    "country.in": "الهند",
    "country.io": "إقليم المحيط الهندي البريطاني",
    "country.iq": "العراق",
    "country.ir": "إيران",
    "country.is": "أيسلندا",
    "country.it": "إيطاليا",
    "country.je": "جيرسي",
    "country.jm": "جامايكا",
    "country.jo": "الأردن",
    "country.jp": "اليابان",
    "country.ke": "كينيا",
    "country.kg": "قيرغيزستان",
    "country.kh": "كمبوديا",
    "country.ki": "كيريباتي",
    "country.km": "جزر القمر",
    "country.kn": "سانت كيتس ونيفيس",
    "country.kp": "كوريا الشمالية",
    "country.kr": "كوريا الجنوبية",
    "country.kw": "الكويت",
    "country.ky": "جزر كايمان",
    "country.kz": "كازاخستان",
    "country.la": "لاوس",
    "country.lb": "لبنان",
    "country.lc": "سانت لوسيا",
    "country.li": "ليختنشتاين",
    "country.lk": "سريلانكا",
    "country.lr": "ليبيريا",
    "country.ls": "ليسوتو",
    "country.lt": "ليتوانيا",
    "country.lu": "لوكسمبورج",
    "country.lv": "لاتفيا",
    "country.ly": "ليبيا",
    "country.ma": "المغرب",
    "country.mc": "موناكو",
    "country.md": "مولدوفا",
    "country.me": "الجبل الأسود",
    "country.mg": "مدغشقر",
    "country.mh": "جزر مارشال",
    "country.mk": "مقدونيا الشمالية",
    "country.ml": "مالي",
    "country.mm": "ميانمار",
    "country.mn": "منغوليا",
    "country.mo": "ماكاو",
    "country.mp": "جزر ماريانا الشمالية",
    "country.mq": "مارتينيك",
    "country.mr": "موريتانيا",
    "country.ms": "مونتسيرات",
    "country.mt": "مالطا",
    "country.mu": "موريشيوس",
    "country.mv": "جزر المالديف",
    "country.mw": "مالاوي",
    "country.mx": "المكسيك",
    "country.my": "ماليزيا",
    "country.mz": "موزمبيق",
    "country.na": "ناميبيا",
    "country.nc": "كاليدونيا الجديدة",
    "country.ne": "النيجر",
    "country.nf": "جزيرة نورفولك",
    "country.ng": "نيجيريا",
    "country.ni": "نيكاراجوا",
    "country.nl": "هولندا",
    "country.no": "النرويج",
    "country.np": "نيبال",
    "country.nr": "ناورو",
    "country.nu": "نيوي",
    "country.nz": "نيوزيلندا",
    "country.om": "سلطنة عُمان",
    "country.pa": "بنما",
    "country.pe": "بيرو",
    "country.pf": "بولينيزيا الفرنسية",
    "country.pg": "بابوا غينيا الجديدة",
    "country.ph": "الفلبين",
    "country.pk": "باكستان",
    "country.pl": "بولندا",
    "country.pm": "سان بيير وميكلون",
    "country.pn": "جزر بيتكيرن",
    "country.pr": "بورتوريكو",
    "country.ps": "فلسطين",
    "country.pt": "البرتغال",
    "country.pw": "بالاو",
    "country.py": "باراجواي",
    "country.qa": "قطر",
    "country.re": "ريونيون",
    "country.ro": "رومانيا",
    "country.rs": "صربيا",
    "country.ru": "روسيا",
    "country.rw": "رواندا",
    "country.sa": "السعودية",
    "country.sb": "جزر سليمان",
    "country.sc": "سيشل",
    "country.scotland": "اسكتلندا",
    "country.sd": "السودان",
    "country.se": "السويد",
    "country.sg": "سنغافورة",
    "country.sh": "سانت هيلينا",
    "country.si": "سلوفينيا",
    "country.sj": "سفالبارد وجان ماين",
    "country.sk": "سلوفاكيا",
    "country.sl": "سيراليون",
    "country.sm": "سان مارينو",
    "country.sn": "السنغال",
    "country.so": "الصومال",
    "country.sr": "سورينام",
    "country.st": "ساو تومي وبرينسيبي",
    "country.sv": "السلفادور",
    "country.sy": "سوريا",
    "country.sz": "إسواتيني",
    "country.tc": "جزر تركس وكايكوس",
    "country.td": "تشاد",
    "country.tf": "الأقاليم الجنوبية الفرنسية",
    "country.tg": "توجو",
    "country.th": "تايلاند",
    "country.tj": "طاجيكستان",
    "country.tk": "توكيلاو",
    "country.tl": "تيمور الشرقية",
    "country.tm": "تركمانستان",
    "country.tn": "تونس",
    "country.to": "تونجا",
    "country.tr": "تركيا",
    "country.tt": "ترينيداد وتوباجو",
    "country.tv": "توفالو",
    "country.tw": "تايوان",
    "country.tz": "تنزانيا",
    "country.ua": "أوكرانيا",
    "country.ug": "أوغندا",
    "country.um": "جزر الولايات المتحدة النائية",
    "country.us": "الولايات المتحدة",
    "country.uy": "أوروجواي",
    "country.uz": "أوزبكستان",
    "country.va": "الفاتيكان",
    "country.vc": "سانت فنسنت وجزر غرينادين",
    "country.ve": "فنزويلا",
    "country.vg": "جزر العذراء البريطانية",
    "country.vi": "جزر العذراء الأمريكية",
    "country.vn": "فيتنام",
    "country.vu": "فانواتو",
    "country.wales": "ويلز",
    "country.wf": "واليس وفوتونا",
    "country.ws": "ساموا",
    "country.ye": "اليمن",
    "country.yt": "مايوت",
    "country.za": "جنوب أفريقيا",
    "country.zm": "زامبيا",
    "country.zw": "زيمبابوي",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject":
      "أكّد عنوان بريدك الإلكتروني على {siteName}",
    "Email.ConfirmAddress.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    شكراً إنك عملت حساب على <strong>{siteName}</strong>.<br />
    قبل ما تبدأ تستخدم حسابك، أكّد عنوان بريدك الإلكتروني
    بالضغط على الزرار اللي تحت:
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        أكّد عنوان بريدي الإلكتروني
    </a>
</p>

<p dir="rtl">
    لو الزرار مش شغّال، تقدر برضه تأكّد عنوان بريدك الإلكتروني بفتح اللينك ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p dir="rtl">
    لو إنت ما عملتش الحساب ده، تجاهل الرسالة دي وماتقلقش.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "لينك جديد لتأكيد عنوان بريدك الإلكتروني على {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    من شوية طلبت رسالة جديدة لتأكيد عنوان بريدك الإلكتروني على <strong>{siteName}</strong>.<br />
    أكّد عنوان بريدك الإلكتروني بالضغط على الزرار اللي تحت:
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        أكّد عنوان بريدي الإلكتروني
    </a>
</p>

<p dir="rtl">
    لو الزرار مش شغّال، تقدر برضه تأكّد عنوان بريدك الإلكتروني بفتح اللينك ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p dir="rtl">
    أول ما تأكّده، هتقدر تكمّل استخدام حسابك من غير أي مشاكل.
</p>

<p dir="rtl">
    لو إنت ما طلبتش الرسالة دي، تجاهلها وماتقلقش.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject": "حد حاول يسجّل بعنوان بريدك الإلكتروني",
    "Email.AlreadyRegistered.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    حد حاول يسجّل على <strong>{siteName}</strong> بعنوان البريد الإلكتروني ده،
    وعليه حساب بالفعل. ما اتغيّرش أي حاجة في حسابك.<br />
    لو إنت اللي عملت كده، عندك حساب بالفعل وتقدر تسجّل الدخول عليه:
</p>

<p dir="rtl">
    <a href="{site}/account/sign-in" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        تسجيل الدخول
    </a>
</p>

<p dir="rtl">
    لو نسيت كلمة السر، تقدر تظبطها من هنا:
</p>

<p dir="rtl">
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        نسيت كلمة السر
    </a>
</p>

<p dir="rtl">
    لو مش إنت، مش مطلوب منك أي حاجة. محدش وصله أي طريقة يدخل بيها على
    حسابك.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "أكّد نقل حسابك على {siteName} إلى العنوان ده",
    "Email.ConfirmNewEmailAddress.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    حد داخل على حساب على <strong>{siteName}</strong>
    طلب ينقله إلى عنوان البريد الإلكتروني ده. لو إنت اللي طلبت،
    أكّد من هنا، وإنت داخل على الحساب ده. اللينك بيشتغل
    24 ساعة.
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        انقل حسابي
    </a>
</p>

<p dir="rtl">
    أو انسخ اللينك ده في المتصفح:<br />
    {link}
</p>

<p dir="rtl">
    لو مش إنت، مش مطلوب منك أي حاجة. مفيش حساب هيتنقل هنا.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "حد طلب ينقل حساب إلى عنوان بريدك الإلكتروني",
    "Email.AlreadyHasAnAccount.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    حد داخل على حساب على <strong>{siteName}</strong>
    طلب ينقله إلى عنوان البريد الإلكتروني ده، وعليه حساب
    بالفعل. ما اتنقلش حاجة، وما اتغيّرش أي حاجة في حسابك.
</p>

<p dir="rtl">
    لو إنت اللي طلبت، عندك حساب على العنوان ده وتقدر تسجّل الدخول
    عليه.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "حسابك على {siteName} اتنقل",
    "Email.EmailAddressChanged.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    حسابك على <strong>{siteName}</strong> لسه متنقل إلى عنوان بريد إلكتروني
    تاني، {emailAddress}، ومن دلوقتي بتدخل بالعنوان ده.
</p>

<p dir="rtl">
    لو مش إنت، يبقى حد تاني معاه حسابك. ردّ على الرسالة دي
    وقول لنا.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "كلمة السر بتاعتك على {siteName} اتغيّرت",
    "Email.PasswordChanged.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    كلمة سر حسابك على <strong>{siteName}</strong> لسه متغيّرة،
    واتعمل تسجيل خروج من كل المتصفحات التانية اللي كانت داخلة عليه.<br />
    لو إنت اللي غيّرتها، مش مطلوب منك أي حاجة.
</p>

<p dir="rtl">
    لو مش إنت، يبقى حد تاني معاه كلمة السر بتاعتك. حط كلمة سر جديدة
    من هنا وهيتعمل له تسجيل خروج:
</p>

<p dir="rtl">
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        نسيت كلمة السر
    </a>
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "حط كلمة سر جديدة لـ {siteName}",
    "Email.SetNewPassword.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    من شوية طلبت تغيّر كلمة السر بتاعتك على <strong>{siteName}</strong>.<br />
    تقدر تغيّرها بالضغط على الزرار اللي تحت:
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        غيّر كلمة السر
    </a>
</p>

<p dir="rtl">
    لو الزرار مش شغّال، تقدر برضه تغيّر كلمة السر بفتح اللينك ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p dir="rtl">
    لو إنت ما طلبتش تغيّر كلمة السر، تجاهل الرسالة دي وماتقلقش.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "اضبط كلمة سر لـ {siteName}",
    "Email.SetPassword.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    حسابك على <strong>{siteName}</strong> ملوش كلمة سر: إنت بتدخل بجوجل.<br />
    طلبت تضبط واحدة، علشان تقدر تدخل كمان بعنوان بريدك الإلكتروني وكلمة سر.
    تقدر تضبطها بالضغط على الزرار اللي تحت:
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        اضبط كلمة السر
    </a>
</p>

<p dir="rtl">
    لو الزرار مش شغّال، تقدر برضه تضبط كلمة السر بفتح اللينك ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p dir="rtl">
    اللينك بيشتغل ساعة واحدة. لو إنت ما طلبتش تضبط كلمة سر، تجاهل الرسالة دي وماتقلقش.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "مفيش حساب على {siteName} لعنوان البريد الإلكتروني ده",
    "Email.RegisterInstead.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    اتطلب تغيير كلمة السر لعنوان بريد إلكتروني
    مش مربوط بأي حساب على <strong>{siteName}</strong>.
</p>

<p dir="rtl">
    لو عايز تستخدم خدمتنا، تقدر تعمل حساب جديد من هنا:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p dir="rtl">
    لو إنت ما عملتش الطلب ده، تجاهل الرسالة دي وماتقلقش.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "أكّد إنك عايز حسابك على {siteName} يتنسي",
    "Email.ConfirmForgetting.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    طلبت إن حسابك على <strong>{siteName}</strong> يتنسي.<br />
    اضغط على الزرار اللي تحت علشان تشوف ده معناه إيه، وتأكّد
    إنه فعلاً اللي إنت عايزه:
</p>

<p dir="rtl">
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        انسَ حسابي
    </a>
</p>

<p dir="rtl">
    لو الزرار مش شغّال، تقدر برضه تفتح اللينك ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p dir="rtl">
    أول ما الحساب يتنسي، مفيش حد هيقدر يقرأ اسمك ولا عنوان
    بريدك الإلكتروني تاني، ومحدش هيقدر يدخل على حسابك. مينفعش
    ترجّع ده.
</p>

<p dir="rtl">
    اللينك بيشتغل مرة واحدة بس، لحد 15 دقيقة بعد ما طلبته،
    وطول ما إنت داخل على الحساب ده بس. بعد كده،
    اطلبه تاني من حسابك.
</p>

<p dir="rtl">
    لو إنت ما طلبتش ده، مش هيحصل حاجة إلا لو حد فتح اللينك.
    ومع كده، اللي طلبه حد داخل على حسابك، فحط كلمة سر جديدة من
    صفحة نسيت كلمة السر علشان تتأكد إنه مش هيقدر يدخل تاني.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "التسجيل واقف: مقدرناش نوصل لـ {service}",
    "Email.RegistrationsSuspended.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    {siteName} ما قدرش يوصل لـ {service} الساعة {when}. لحد ما يردّ،
    أي حد محتاجه، سواء علشان يسجّل أو يحط كلمة سر جديدة،
    بيتقاله يجرّب تاني بعدين.
</p>

<p dir="rtl">
    مفيش حاجة محتاجة تتعمل. كل محاولة بتسأل {service} من جديد، والصفحات
    بترجع تشتغل أول ما يردّ.
</p>

<p dir="rtl">
    وطول ما {service} مش بيردّ، هتوصلك رسالة واحدة بس في الساعة
    في الأكتر عن الموضوع ده.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} مش قادر يوصل لقاعدة البيانات",
    "Email.DatabaseUnreachable.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    {siteName} ما قدرش يوصل لقاعدة البيانات الساعة {when}. لحد ما ترد، كل صفحة محتاجاها بتقول للقرّاء إن الموقع مش متاح وإنهم يجرّبوا تاني بعدين.
</p>

<p dir="rtl">
    مفيش حاجة محتاجة تتفك. كل طلب بيطلب اتصال من جديد، والموقع بيشتغل تاني أول ما قاعدة البيانات ترد.
</p>

<p dir="rtl">
    طول ما قاعدة البيانات واقعة، هتوصلك رسالة عنها مرة واحدة على الأكتر كل {minutes} دقيقة.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} فشل في طلب",
    "Email.UnhandledError.body": `
<p dir="rtl">أهلاً،</p>

<p dir="rtl">
    {siteName} فشل الساعة {when} في طلب لـ {asked}. القارئ اتعرض له الرقم المرجعي {reference}، وفي السجل السبب تحته.
</p>

<p dir="rtl">
    الموقع المعطّل غالباً بيفشل في كل طلب، فهتوصلك رسائل بريد إلكتروني عن الأخطاء 4 مرات كحد أقصى في الساعة. الباقي موجود في السجل برضه.
</p>

<p dir="rtl">
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
