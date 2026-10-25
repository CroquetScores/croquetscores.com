// The site's words in colloquial Egyptian Arabic, not Modern Standard. The
// reader is addressed in the singular, in the plain "enta" form (اكتب, إيميلك),
// which reads as neutral. Arabic has no capitals, so menu and button items are
// simply written as short phrases. "Email address" is "عنوان الإيميل", and
// "email" alone is "إيميل". A label's colon is part of its words. Hoop is
// "طوق", match "مباراة", game "لعبة", and a test between teams "لقاء". "Bye" is
// left in Latin letters wherever the site checks for it or offers it.
import type { Language } from "../common/language.js";

export const egyptian: Language = {
  tag: "ar-EG",
  name: "العربية (مصر)",
  direction: "rtl",
  words: {
    // The site's own bars.
    "site.skipToContent": "روح على المحتوى",
    "navigation.menu": "القايمة",
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
    "footer.plea": "عجبك {siteName}؟ لو سمحت تبرّع عشان نكمّل التطوير.",
    "footer.copyright": "© حقوق النشر {years}، {owner}",
    "footer.privacy": "الخصوصية",
    "footer.termsOfUse": "شروط الاستخدام",
    "beta.banner": "ده موقع تجريبي. ممكن البيانات تتمسح في أي وقت.",
    "privacy.contact":
      "أي أسئلة عن الصفحة دي، أو عن اللي محفوظ عنك: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write.
    "termsOfUse.agree": "أنا موافق على شروط الاستخدام",
    "termsOfUse.link": "شروط الاستخدام",
    "termsOfUse.report":
      "بلّغ عن اللي اتكتب، أو اسأل عن الشروط دي: {emailAddress}",
    "TermsOfUse.NotAgreed": "علّم على المربع عشان توافق على شروط الاستخدام.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "ده مكان آمن تتعلّم فيه {siteName}. أي حاجة تدخلها هنا ممكن تتمسح في أي وقت.",

    "language.label": "اللغة",
    "language.choose": "غيّر",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "فيه حاجة جديدة تقراها.",
    "whatsNew.admin.message": "فيه حاجة جديدة للناس اللي بتدير البطولات.",
    "whatsNew.view": "شوف الجديد",
    "whatsNew.later": "فكّرني المرة الجاية",
    "whatsNew.never": "ما تورّينيش التنبيه ده تاني",

    "form.otherwise": "فيه حاجة مش مظبوطة. راجع اللي كتبته وجرّب تاني.",

    // The account menu in the header.
    "account.menu": "الحساب",
    "account.register": "سجّل",
    "account.signIn": "سجّل الدخول",
    "account.forgotPassword": "نسيت كلمة السر",
    "account.signOut": "سجّل الخروج",
    "account.profile": "ملفّي",
    "account.changePassword": "غيّر كلمة السر",
    "account.changeEmailAddress": "غيّر عنوان الإيميل",
    "account.changeName": "غيّر الاسم",
    "account.setPassword": "حدّد كلمة سر",
    "account.forgetAccount": "انسَ الحساب",

    "register.title": "تسجيل حساب",
    "register.emailAddress": "عنوان الإيميل",
    "register.submit": "سجّل",
    "register.withGoogle": "سجّل بحساب Google",
    "register.or": "أو",
    // Said above the form when Google sent the reader back without them being
    // let in.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google ما أكّدش إن عنوان الإيميل ده بتاعك، فمينفعش تستخدمه مع Google هنا. استخدم عنوان الإيميل بتاعك من تحت.",
    "SignInWithGoogle.LinkedToAnother":
      "عنوان الإيميل ده عليه حساب فعلاً، ومربوط بحساب Google تاني. سجّل الدخول بحساب Google ده، أو بعنوان الإيميل وكلمة السر.",
    "SignInWithGoogle.NameMissing":
      "Google ما قالناش اسمك، والحساب لازم يكون له اسم. استخدم عنوان الإيميل بتاعك من تحت.",
    "Google.Unreachable":
      "ما قدرناش نوصل لـ Google دلوقتي. جرّب تاني بعد شوية، أو استخدم عنوان الإيميل بتاعك من تحت.",
    "Registration.NotAPerson":
      "الطلب ده مش باين إنه جاي من إنسان. جرّب تاني، ولو فضل يحصل استنى كام دقيقة وارجع.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "اكتب عنوان إيميل.",
    "EmailAddress.NoAt": "عنوان الإيميل فيه علامة @.",
    "EmailAddress.MoreThanOneAt": "عنوان الإيميل فيه علامة @ واحدة بس.",
    "EmailAddress.NoDomain":
      "عنوان الإيميل بيكون فيه نطاق بعد الـ @، زي example.com.",

    "welcome.title": "شوف الإيميل بتاعك",
    "welcome.checkEmail":
      "فيه إيميل في الطريق للعنوان اللي كتبته. افتح الرابط اللي فيه عشان تكمّل.",
    "welcome.nothingArrived":
      "لو ما وصلش حاجة في خلال كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "welcome.home": "ارجع إلى {siteName}",
    "newConfirmationLink.title": "هات رابط جديد",
    "newConfirmationLink.explanation":
      "رابط تأكيد عنوان الإيميل بتاعك خلص. اطلب واحد جديد وهيتبعت للعنوان اللي سجّلت بيه.",
    "newConfirmationLink.send": "ابعتلي رابط جديد",
    "newConfirmationLink.home": "ارجع إلى {siteName}",
    "newConfirmationLink.signIn": "سجّل الدخول",
    "newConfirmationLink.sent.title": "شوف الإيميل بتاعك",
    "newConfirmationLink.sent.explanation":
      "رابط جديد في الطريق. افتحه عشان تأكّد عنوان الإيميل بتاعك. لو ما وصلش حاجة في خلال كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "newConfirmationLink.alreadyConfirmed.title":
      "عنوان الإيميل ده اتأكّد فعلاً",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "مفيش حاجة تانية تتأكّد. سجّل الدخول بكلمة السر اللي كتبتها وانت بتأكّده.",
    "newConfirmationLink.noLongerWorks.title": "الرابط ده مبقاش شغّال",
    "newConfirmationLink.noLongerWorks.explanation":
      "اتأكّد إنك فتحت الرابط كله اللي في الإيميل، من غير ما يكون ناقص حاجة من آخره. لو لسه مش شغّال، سجّل من الأول وهيتبعتلك رابط جديد.",
    "newConfirmationLink.tooMany.title": "جرّب تاني بعدين",
    "newConfirmationLink.tooMany.explanation":
      "اتبعت لنا العنوان ده كذا رابط في الفترة الأخيرة. استنى ساعة واطلب تاني، وفي الأثناء بص في فولدر الرسائل المزعجة (سبام).",

    "forgotPassword.title": "نسيت كلمة السر؟",
    "forgotPassword.emailAddress": "عنوان الإيميل",
    "forgotPassword.submit": "ابعتلي طريقة أدخل بيها",
    "forgotPassword.home": "ارجع إلى {siteName}",
    "forgotPassword.sent.title": "شوف الإيميل بتاعك",
    "forgotPassword.sent.explanation":
      "لو العنوان ده عليه حساب، فيه رابط لتحديد كلمة سر جديدة في الطريق. افتحه في خلال ساعة. لو ما وصلش حاجة في خلال كام دقيقة، بص في فولدر الرسائل المزعجة (سبام).",
    "forgotPassword.tryAgainLater":
      "اتطلب من هنا طرق دخول كتير في الفترة الأخيرة. استنى ساعة وجرّب تاني.",

    "setNewPassword.title": "حدّد كلمة سر جديدة",
    "setNewPassword.password": "كلمة السر",
    "setNewPassword.confirmPassword": "أكّد كلمة السر",
    "setNewPassword.submit": "حدّد كلمة السر الجديدة",
    "setNewPassword.home": "ارجع إلى {siteName}",
    "setNewPassword.signIn": "سجّل الدخول",
    "setNewPassword.askAgain": "اطلب رابط جديد",
    "setNewPassword.changed.title": "كلمة السر اتغيّرت",
    "setNewPassword.changed.explanation":
      "اتسجّل خروجك من كل مكان كنت داخل منه. سجّل الدخول بكلمة السر الجديدة.",
    "setNewPassword.expired.title": "الرابط ده خلص",
    "setNewPassword.expired.explanation":
      "رابط تحديد كلمة السر الجديدة شغّال لمدة ساعة. اطلب رابط تاني وهيتبعت لنفس العنوان.",
    "setNewPassword.noLongerWorks.title": "الرابط ده مبقاش شغّال",
    "setNewPassword.noLongerWorks.explanation":
      "ممكن يكون اتستخدم قبل كده، أو ممكن يكون ناقص حاجة من آخره. اطلب رابط تاني لو لسه محتاج.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "ما قدرناش نفحص كلمة السر دلوقتي، فما اتغيّرتش. جرّب تاني بعد شوية؛ الرابط بتاعك لسه شغّال لحد ما يخلص.",

    "forgetAccount.title": "انسَ حسابك",
    "forgetAccount.explanation":
      "اسمك وعنوان الإيميل بتاعك ممكن يتحوّلوا لحاجة مش مقروءة للأبد، والحساب يتقفل. وعشان نتأكّد إنه انت، هنبعت رابط على عنوان حسابك الأول، ومفيش حاجة هتتنسي غير لما تفتحه.",
    "forgetAccount.submit": "ابعتلي الرابط على الإيميل",
    "forgetAccount.sent.title": "شوف الإيميل بتاعك",
    "forgetAccount.sent.explanation":
      "بعتنالك رابط على عنوان حسابك. شغّال لمدة 15 دقيقة، وبس وانت داخل على الحساب ده.",
    "forgetAccount.confirm.title": "تنسى حسابك للأبد؟",
    "forgetAccount.confirm.explanation":
      "أول ما يتنسي، اسمك وعنوان الإيميل بتاعك مش هيتقروا تاني أبداً، من أي حد، ومش هتقدر تدخل على الحساب. ومينفعش ترجّع ده.",
    "forgetAccount.confirm.submit": "انسَ حسابي",
    "forgetAccount.forgotten.title": "حسابك اتنسي",
    "forgetAccount.forgotten.explanation":
      "اسمك وعنوان الإيميل بتاعك مبقوش يتقروا، واتسجّل خروجك من كل مكان كنت داخل منه.",
    "forgetAccount.noLongerWorks.title": "الرابط ده مبقاش شغّال",
    "forgetAccount.noLongerWorks.explanation":
      "ممكن يكون خلص، أو اتستخدم قبل كده، أو يكون لحساب مش داخل عليه. اطلب تاني من حسابك لو لسه عايز تنسيه.",
    "forgetAccount.lastAdministrator.title": "مينفعش ننسى حسابك",
    "forgetAccount.lastAdministrator.explanation":
      "انت المدير الوحيد للموقع ده. اِدّي دور المدير لحد تاني، وبعدها نقدر ننسى حسابك.",
    "forgetAccount.askAgain": "اطلب تاني",
    "forgetAccount.home": "ارجع إلى {siteName}",

    "registrationsSuspended.title": "التسجيل متوقّف دلوقتي",
    "registrationsSuspended.explanation":
      "فيه خدمة التسجيل محتاجاها ومش قادرين نوصلها دلوقتي، فمحدش يقدر يسجّل لحد ما ترد تاني. اللي كتبته ما اتحفظش.",
    "registrationsSuspended.tryAgainLater":
      "جرّب تاني بعد شوية. مدير الموقع اتبلّغ.",
    "registrationsSuspended.home": "ارجع إلى {siteName}",

    "signIn.title": "تسجيل الدخول",
    "signIn.emailAddress": "عنوان الإيميل",
    "signIn.password": "كلمة السر",
    "signIn.submit": "سجّل الدخول",
    "signIn.forgotPassword": "نسيت كلمة السر؟",
    "signIn.register": "سجّل",
    "signIn.withGoogle": "سجّل الدخول بحساب Google",
    "signIn.or": "أو",
    "signIn.tryAgainLater":
      "حصلت محاولات كتير في الفترة الأخيرة. استنى ساعة وجرّب تاني.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed": "عنوان الإيميل أو كلمة السر مش صح. لو سمحت جرّب تاني.",

    "profile.title": "ملفّي",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "الاسم:",
    "profile.emailAddress": "عنوان الإيميل:",

    "changeName.title": "تغيير الاسم",
    "changeName.name": "الاسم",
    "changeName.submit": "غيّر الاسم",

    "setPassword.title": "حدّد كلمة سر",
    "setPassword.explanation":
      "حسابك ملوش كلمة سر: بتدخل بحساب Google. وعشان تقدر تدخل بكلمة سر كمان، هنبعت رابط لتحديدها على {emailAddress}.",
    "setPassword.submit": "ابعتلي رابط على الإيميل",
    "setPassword.sent.title": "شوف الإيميل بتاعك",
    "setPassword.sent.explanation":
      "بعتنالك رابط لتحديد كلمة السر. شغّال لمدة ساعة.",
    "setPassword.profile": "ارجع لملفّك",

    "changePassword.title": "تغيير كلمة السر",
    "changePassword.currentPassword": "كلمة السر الحالية",
    "changePassword.password": "كلمة السر الجديدة",
    "changePassword.passwordConfirmation": "أكّد كلمة السر",
    "changePassword.forgotPassword": "نسيت كلمة السر؟",
    "changePassword.submit": "غيّر كلمة السر",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "دي مش كلمة السر بتاعتك.",

    "changeEmailAddress.title": "تغيير عنوان الإيميل",
    "changeEmailAddress.emailAddress": "عنوان الإيميل الجديد",
    "changeEmailAddress.currentPassword": "كلمة السر الحالية",
    "changeEmailAddress.submit": "ابعت رابط التأكيد",
    "changeEmailAddress.sent.title": "شوف الإيميل بتاعك",
    "changeEmailAddress.sent.explanation":
      "رابط لتأكيد النقل اتبعت لعنوان الإيميل الجديد. افتحه وانت داخل على حسابك عشان ننقل حسابك هناك.",
    "changeEmailAddress.confirm.title": "انقل حسابك",
    "changeEmailAddress.confirm.explanation":
      "حسابك هيتنقل إلى {emailAddress}. هتدخل بالعنوان ده من دلوقتي.",
    "changeEmailAddress.confirm.submit": "انقل حسابي",
    "changeEmailAddress.noLongerWorks.title": "الرابط ده مبقاش شغّال",
    "changeEmailAddress.noLongerWorks.explanation":
      "ممكن يكون خلص، أو اتستخدم قبل كده، أو ما اتبعتش للحساب اللي داخل عليه. اطلب تاني من ملفّك.",
    "changeEmailAddress.taken.title": "حسابك ما اتنقلش",
    "changeEmailAddress.profile": "ارجع لملفّك",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "دي مش كلمة السر بتاعتك.",
    "ChangeEmailAddress.Unchanged": "حسابك على العنوان ده فعلاً.",
    "ChangeEmailAddress.Taken":
      "عنوان الإيميل ده بقى عليه حساب تاني، فحسابك مينفعش يتنقل له.",

    "confirmEmailAddress.title": "أكّد عنوان الإيميل بتاعك",
    "confirmEmailAddress.name": "الاسم",
    "confirmEmailAddress.password": "كلمة السر",
    "confirmEmailAddress.confirmPassword": "أكّد كلمة السر",
    "confirmEmailAddress.submit": "أكّد عنوان الإيميل بتاعي",
    "confirmEmailAddress.signIn": "سجّل الدخول",
    "confirmEmailAddress.home": "ارجع إلى {siteName}",
    "confirmEmailAddress.confirmed.title": "عنوان الإيميل بتاعك اتأكّد",
    "confirmEmailAddress.confirmed.explanation":
      "حسابك جاهز. سجّل الدخول بعنوان الإيميل وكلمة السر اللي كتبتهم دلوقتي.",
    "confirmEmailAddress.expired.title": "الرابط ده خلص",
    "confirmEmailAddress.expired.explanation":
      "رابط تأكيد عنوان الإيميل شغّال لمدة 24 ساعة. اطلب رابط جديد وهيتبعت لنفس العنوان.",
    "confirmEmailAddress.expired.newLink": "ابعتلي رابط جديد",
    "confirmEmailAddress.noLongerWorks.title": "الرابط ده مبقاش شغّال",
    "confirmEmailAddress.noLongerWorks.explanation":
      "اتأكّد إنك فتحت الرابط كله اللي في الإيميل، من غير ما يكون ناقص حاجة من آخره. لو لسه مش شغّال، سجّل من الأول وهيتبعتلك رابط جديد.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "عنوان الإيميل ده اتأكّد فعلاً",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "مفيش حاجة تانية تعملها. سجّل الدخول بكلمة السر اللي كتبتها وانت بتأكّده.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "اكتب اسم.",
    "PersonName.TooShort": "الاسم لازم يكون 3 حروف على الأقل.",
    "PersonName.TooLong": "الاسم ممكن يوصل 254 حرف على الأكتر.",
    "WorldRankingName.TooShort":
      "اسم التصنيف العالمي لازم يكون 3 حروف على الأقل.",
    "WorldRankingName.TooLong":
      "اسم التصنيف العالمي ممكن يوصل 254 حرف على الأكتر.",
    "Password.Missing": "اكتب كلمة سر.",
    "Password.TooShort": "كلمة السر لازم تكون 12 حرف على الأقل.",
    "Password.ConfirmationDiffers": "دي مش زي كلمة السر اللي فوق. اكتبها تاني.",
    "Password.Breached":
      "كلمة السر دي ظهرت قبل كده في تسريب بيانات في مكان تاني، فمش آمنة تستخدمها هنا. اختار واحدة تانية.",

    "javaScriptRequired.title": "لازم تشغّل السكربتات",
    "javaScriptRequired.explanation":
      "التسجيل محتاج السكربتات تكون شغّالة للموقع ده، عشان نتأكّد إن اللي بيسجّل إنسان. شغّلها وبعدين سجّل تاني.",
    "javaScriptRequired.register": "ارجع للتسجيل",
    "javaScriptRequired.home": "ارجع إلى {siteName}",

    "errors.backHome": "ارجع إلى {siteName}",
    "errors.notFound": "مش موجود",
    "errors.refused": "ما قدرناش نعمل ده",
    "errors.refusedDetail": "فيه حاجة في اللي اتبعت مش مظبوطة.",
    "errors.sorry": "معلش",
    "errors.sorryDetail": "ما قدرناش نتعامل مع الطلب ده.",
    "errors.failed": "حصلت مشكلة",
    "errors.reference": "الرقم المرجعي {reference}.",
    "errors.recorded":
      "الخطأ اتسجّل واتبعت إيميل لمدير الموقع. حاجة كويسة إنك تبعت إيميل لمدير الموقع بالرقم المرجعي ووصف اللي كنت بتعمله.",
    "errors.message": "ابعت إيميل لمدير الموقع",
    "errors.messageSubject": "الخطأ {reference} في {siteName}",
    "errors.messageBody": "اللي كنت بعمله لما ده حصل:\n\n",
    "errors.unavailable": "الموقع مش متاح",
    "errors.unavailableDetail":
      "الموقع مش قادر يوصل للي محتاجه دلوقتي. لو سمحت جرّب تاني بعدين.",
    "errors.maintenance": "الموقع واقف للصيانة.",
    "errors.maintenanceMinutes": "متوقّع يرجع بعد {minutes} دقيقة.",
    "errors.maintenanceMinute": "متوقّع يرجع بعد دقيقة.",
    "errors.maintenanceLonger":
      "الموضوع واخد وقت أطول من المتوقّع وهيرجع قريب.",

    // The home page's two lists.
    "home.recentResults": "آخر النتايج",
    "home.recentResults.none": "ما اتضافتش أي لعبة في آخر سبعة أيام.",
    "home.upcomingTournaments": "البطولات الجاية",
    "home.upcomingTournaments.none": "مفيش بطولات بتبدأ في الستين يوم الجايين.",
    "home.allTournaments": "كل البطولات في {year}",
    // A year's page.
    "year.heading": "بطولات {year}",
    "year.none": "مفيش بطولات بتبدأ في {year}.",
    // A sport's page in a year.
    "yearSport.heading": "بطولات {sport} في {year}",
    "yearSport.none": "مفيش بطولات {sport} بتبدأ في {year}.",
    // A tournament's page.
    "tournament.recent": "الأحدث",
    "tournament.summary": "الملخّص",
    // A test's grid.
    "test.bestOf": "كل مباراة أحسن {count}.",
    "test.vs": "ضد",
    "test.matches": "المباريات",
    "test.games": "الألعاب",
    "test.hoops": "الأطواق",
    "teamSummary.tests": "اللقاءات",
    "teamSummary.matches": "المباريات",
    "teamSummary.games": "الألعاب",
    "teamSummary.hoops": "الأطواق",
    "teamSummary.wins": "الفوز",
    "teamSummary.losses": "الهزايم",
    "teamSummary.draws": "التعادل",
    "teamSummary.for": "له",
    "teamSummary.against": "عليه",
    "teamSummary.net": "الصافي",
    "tournament.players": "اللاعبين",
    "search.label": "بحث",
    "search.tournaments": "البطولات",
    "search.competitions": "المنافسات",
    "search.nothingFound": "ما لقيناش حاجة.",
    "players.search.label": "دوّر على لاعبين",
    "players.search.prompt": "اكتب اسم لاعب عشان تلاقيه.",
    "players.search.none": "ما لقيناش لاعبين.",
    "search.more":
      "بنعرض أول {count} بس. اكتب جزء أكتر من الاسم عشان البحث يضيق.",
    "websitePlayer.tournament": "البطولة",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} ضد {second}",
    "tournament.notes": "الملاحظات",
    "tournament.commentary": "التعليق",
    "tournament.beat": "هزم",
    "tournament.drewWith": "اتعادل مع",
    "tournament.ago.seconds": "{count} ث",
    "tournament.ago.minutes": "{count} د",
    "tournament.ago.hour": "ساعة",
    "tournament.ago.hours": "{count} ساعات",
    "tournament.none": "لسه محدش لعب أي لعبة.",
    // A tournament's players' page, when it has none.
    "players.none": "لسه ما اتضافش أي لاعبين.",
    // A tournament's commentaries page.
    "commentaries.by": "بقلم",
    "commentaries.start": "ابدأ تعليق جديد",
    // The page that starts a commentary.
    "startCommentary.title": "ابدأ تعليق جديد",
    "startCommentary.titleField": "العنوان",
    "startCommentary.submit": "ابدأ التعليق",
    // "New" is said to a screen reader in place of the red asterisk.
    "marks.new": "جديد",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "المديرين لسه ما كتبوش أي ملاحظات.",
    "note.edited": "اتعدّل",
    // A commentary's page.
    "commentary.none": "لسه ما اتكتبش أي تعليقات.",
    "commentary.edited": "اتعدّل",
    "commentary.edit": "عدّل",
    "commentary.delete": "امسح",
    "commentary.comment": "تعليق",
    "commentary.add": "ضيف تعليق",
    "commentary.notSent":
      "ما قدرناش نبعت التعليق. حمّل الصفحة تاني عشان تشوف لو اتحفظ.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "غيّر العنوان",
    "changeCommentaryTitle.submit": "احفظ",
    // A comment's own page, and the page that asks before it is deleted.
    "editComment.title": "عدّل التعليق",
    "editComment.save": "احفظ",
    "deleteComment.title": "امسح التعليق",
    "deleteComment.question": "تمسح التعليق ده؟ مينفعش ترجّعه.",
    "deleteComment.confirm": "امسح التعليق",
    "deleteComment.keep": "سيبه",
    // A player's page.
    "player.games": "الألعاب",
    "player.competitions": "المنافسات",
    "player.beat": "هزم",
    "player.lostTo": "خسر قدّام",
    "player.drewWith": "اتعادل مع",
    "player.score": "{score} مقابل {opponent}",
    "player.noGames": "لسه محدش لعب أي لعبة.",
    "player.noCompetitions": "لسه مش مشترك في أي منافسة.",
    // A block's page.
    "block.wins": "الفوز",
    "block.matches": "المباريات",
    "block.netGames": "صافي الألعاب",
    "block.games": "الألعاب",
    "block.netHoops": "صافي الأطواق",
    "block.won": "فاز",
    "block.lost": "خسر",
    "block.drawn": "تعادل",
    "block.withdrawn": "انسحب",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "اتسحبت",
    "block.losses": "الهزايم",
    // The three views of a block.
    "competition.views": "العروض",
    "competition.view.grid": "الجدول",
    "competition.view.summary": "الملخّص",
    "competition.view.orderOfPlay": "ترتيب اللعب",
    "competition.print": "اطبع",
    "blockSummary.ranking":
      "الترتيب على حسب نسبة المباريات اللي اتكسبت، وبعدين صافي الأطواق. ممكن لوايح البطولة نفسها ترتّب اللاعبين بشكل تاني.",
    "orderOfPlay.none": "لسه محدش لعب أي لعبة.",
    // A knockout's rounds.
    "knockout.round.final": "النهائي",
    "knockout.round.semis": "نصف النهائي",
    "knockout.round.quarters": "ربع النهائي",
    "knockout.round.number": "الدور {number}",
    "knockout.bye": "Bye",
    // A Swiss's table.
    "swiss.games": "الألعاب",
    "swiss.wins": "الفوز",
    "swiss.winShare": "نسبة الفوز %",
    "swiss.results": "النتايج",
    // The arrows that scroll a knockout's grid.
    "knockout.onward": "الأدوار الجاية",
    "knockout.back": "الأدوار اللي فاتت",
    // What every list of tournaments shares.
    "tournamentList.column.date": "التاريخ",
    "tournamentList.column.name": "الاسم",
    "tournamentList.onlyIn": "بطولات {country} بس",
    "tournamentList.filter.country": "البلد",
    "tournamentList.filter.anyCountry": "أي بلد",
    "tournamentList.filter.region": "المنطقة",
    "tournamentList.filter.anyRegion": "أي منطقة",
    "tournamentList.filter.noRegionsBefore":
      "البطولات اللي قبل نوفمبر 2026 معندهاش منطقة.",
    "tournamentList.filter.sport": "الرياضة",
    "tournamentList.filter.anySport": "أي رياضة",
    "tournamentList.filter.submit": "صفّي",
    // The years there are tournaments in.
    "years.label": "السنين",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "سنين أقدم",

    // The admin's words.
    "admin.newerBuild.message": "فيه نسخة أحدث من الموقع متاحة.",
    "admin.newerBuild.reload": "حمّل تاني",
    "admin.title": "الإدارة",
    "admin.tournaments.new": "بطولة جديدة",
    "admin.tournaments.none": "مفيش بطولات",
    "admin.tournaments.filter.none": "مفيش بطولات مطابقة",
    "admin.tournaments.show": "عرض",
    "admin.tournaments.managerScorer": "مدير/مسجّل",
    "admin.tournaments.worldRanking": "التصنيف العالمي",
    "admin.tournaments.notWorldRanking": "خارج التصنيف العالمي",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "مؤرشفة",
    "admin.tournaments.manage": "إدارة",
    "admin.tournaments.edit": "عدّل",
    "admin.tournaments.archive": "أرشف",
    "admin.tournaments.restore": "استرجع",
    "admin.tournaments.scores": "النتايج",
    "admin.tournaments.players": "اللاعبين",
    "admin.years.label": "السنين",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "سنين أقدم",
    "admin.tournament.name": "الاسم",
    "admin.tournament.starts": "بتبدأ",
    "admin.tournament.finishes": "بتخلص",
    "admin.tournament.format": "النظام",
    "admin.tournament.sport": "الرياضة",
    "admin.tournament.country": "البلد",
    "admin.tournament.region": "المنطقة",
    "admin.tournament.subtitle": "العنوان الفرعي",
    "admin.rules.handicap": "بتتلعب بالهانديكاب",
    "admin.rules.drawsAllowed": "التعادل مسموح",
    "admin.tournament.levelTestsDrawn": "اللقاءات المتعادلة بتتحسب تعادل",
    "admin.rules.worldRankings": "بتتحسب في التصنيف العالمي",
    "admin.tournament.national": "حدث على المستوى الوطني",
    "admin.tournament.international": "حدث على المستوى الدولي",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "مينفعش نقبل ده زي ما هو.",
    "admin.newTournament.title": "بطولة جديدة",
    "admin.newTournament.submit": "أنشئ البطولة",
    "admin.editTournament.title": "عدّل البطولة",
    "admin.editTournament.submit": "حدّث البطولة",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "مينفعش نغيّر البطولة دي.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "البطولة",
    "admin.view.players": "اللاعبين",
    "admin.view.competitions": "المنافسات",
    "admin.view.managers": "المديرين",
    "admin.view.notes": "الملاحظات",
    "admin.view.scorers": "مسجّلي النتايج",
    "admin.view.rankings": "التصنيفات",
    "admin.rankings.file":
      "التصنيف العالمي هيستخدم نتايج البطولة عن طريق الوظيفة دي، والمديرين مش محتاجين يعملوا حاجة.",
    "admin.rankings.download": "نزّل التصنيفات",
    "rankings.notAvailable": "التصنيفات مش متاحة",
    "rankings.notAvailable.sport":
      "رياضة البطولة دي ملهاش تصنيف عالمي، فمفيش تصنيفات تتبعت.",
    "rankings.notAvailable.notCounted":
      "ولا منافسة من منافسات البطولة دي بتتحسب في التصنيف العالمي.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "مينفعش ندير البطولة دي من هنا.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "المنافسة",
    "admin.competitionView.players": "اللاعبين",
    "admin.competitionView.scores": "النتايج",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "البطولة ومنافساتها",
    "admin.sections.tournament": "البطولة",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "صفحات المدير",
    "admin.administrator.sections.tournaments": "البطولات",
    "admin.administrator.sections.accounts": "الحسابات",
    "admin.administrator.sections.worldRankings": "التصنيف العالمي",
    "admin.administrator.sections.importErrors": "أخطاء الاستيراد",
    "admin.administrator.sections.logs": "السجلات",
    "admin.administrator.sections.databaseStatus": "الوصول لقاعدة البيانات",
    "admin.databaseStatus.title": "الوصول لقاعدة البيانات",
    "admin.databaseStatus.on": "الوصول لقاعدة البيانات شغّال.",
    "admin.databaseStatus.off": "الوصول لقاعدة البيانات مقفول.",
    "admin.databaseStatus.expected": "متوقّع الموقع يرجع بعد {minutes} دقيقة.",
    "admin.databaseStatus.expectedOne": "متوقّع الموقع يرجع بعد دقيقة.",
    "admin.databaseStatus.longer": "الموضوع واخد وقت أطول من المتوقّع.",
    "admin.databaseStatus.told": "القرّاء بيتقالهم: {words}",
    "admin.databaseStatus.toldUsual": "القرّاء بيتقالهم الجملة المعتادة.",
    "admin.databaseStatus.minutes": "الدقايق المتوقّعة",
    "admin.databaseStatus.words": "كلام للقرّاء",
    "admin.databaseStatus.turnOff": "اقفل",
    "admin.databaseStatus.change": "غيّر",
    "admin.databaseStatus.turnOn": "شغّل",
    "admin.databaseStatus.minutesNeeded": "لازم تكتب الدقايق.",
    "admin.databaseStatus.otherwise": "حصلت مشكلة في الموقع.",
    "DatabaseAccess.MinutesNotWhole": "الدقايق لازم تكون رقم صحيح.",
    "DatabaseAccess.MinutesOutOfRange": "الدقايق لازم تكون من 1 لـ 1440.",
    "DatabaseAccess.WordsTooLong": "الكلام لازم ميزيدش عن 500 حرف.",
    "DatabaseAccess.NotOff": "الوصول لقاعدة البيانات مش مقفول.",
    "admin.administrator.title": "المدير",
    // The accounts page, a section for each role.
    "admin.accounts.title": "الحسابات",
    "admin.roles.add": "ضيف",
    "admin.roles.administrator.heading": "المديرين",
    "admin.roles.administrator.none": "مفيش مديرين تانيين",
    "admin.roles.administrator.removeTitle": "شيل مدير",
    "admin.roles.administrator.removeExplanation":
      "{name} مش هيبقى مدير للموقع ده تاني.",
    "admin.roles.ac-world-ranking-officer.heading":
      "مسؤولو التصنيف العالمي لكروكيه الأسوشييشن",
    "admin.roles.ac-world-ranking-officer.none":
      "مفيش مسؤولين عن التصنيف العالمي لكروكيه الأسوشييشن",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "شيل مسؤول التصنيف العالمي لكروكيه الأسوشييشن",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} مش هيبقى مسؤول عن التصنيف العالمي لكروكيه الأسوشييشن تاني.",
    "admin.roles.gc-world-ranking-officer.heading":
      "مسؤولو التصنيف العالمي لكروكيه الجولف",
    "admin.roles.gc-world-ranking-officer.none":
      "مفيش مسؤولين عن التصنيف العالمي لكروكيه الجولف",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "شيل مسؤول التصنيف العالمي لكروكيه الجولف",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} مش هيبقى مسؤول عن التصنيف العالمي لكروكيه الجولف تاني.",
    // The page where the world ranking players are imported, and its log.
    "admin.worldRankings.title": "استيراد لاعبي التصنيف العالمي",
    "admin.worldRankings.import": "استورد",
    "admin.worldRankings.log": "الاستيراد مشي إزاي",
    "admin.worldRankings.ac.reading": "بنقرا قايمة كروكيه الأسوشييشن",
    "admin.worldRankings.ac.read":
      "لاعبو كروكيه الأسوشييشن اللي اتقروا: {players}",
    "admin.worldRankings.ac.kept":
      "لاعبو كروكيه الأسوشييشن اللي فضلوا: {players}",
    "admin.worldRankings.ac.refused":
      "ما قدرناش نقرا قايمة كروكيه الأسوشييشن، فسبنا لاعبيها زي ما هم.",
    "admin.worldRankings.gc.reading": "بنقرا قايمة كروكيه الجولف",
    "admin.worldRankings.gc.read": "لاعبو كروكيه الجولف اللي اتقروا: {players}",
    "admin.worldRankings.gc.kept": "لاعبو كروكيه الجولف اللي فضلوا: {players}",
    "admin.worldRankings.gc.refused":
      "ما قدرناش نقرا قايمة كروكيه الجولف، فسبنا لاعبيها زي ما هم.",
    "admin.worldRankings.finished": "خلص",
    "admin.worldRankings.failed": "الاستيراد ما خلصش.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "حصلت مشكلة في الموقع.",
    "WorldRankingLists.Unreachable": "ما قدرناش نوصل لموقع التصنيف العالمي.",
    "WorldRankingLists.Unreadable":
      "القايمة مش مكتوبة بالشكل اللي التصنيف العالمي بيكتب بيه قوايمه: فيه سطر مش مفهوم، أو مفيهاش حد، أو مش مكتوبة بـ UTF-8.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "أخطاء الاستيراد",
    "admin.importErrors.none": "مفيش أخطاء استيراد",
    "admin.importErrors.otherwise": "حصلت مشكلة في الموقع.",
    "admin.logs.title": "السجلات",
    "admin.logs.severity": "الخطورة",
    "admin.logs.text": "دوّر",
    "admin.logs.show": "اعرض",
    "admin.logs.prune": "نضّف",
    "admin.logs.pruneAsk": "تمسح السجل اللي قبل آخر ساعة؟ مفيش حاجة هترجّعه.",
    "admin.logs.removed": "اتمسح {count} سطر",
    "admin.logs.none": "مفيش أسطر في السجل",
    "admin.logs.otherwise": "حصلت مشكلة في الموقع.",
    "admin.hover.logs.show": "اعرض الأسطر المطابقة",
    "admin.hover.logs.prune": "امسح السجل اللي قبل آخر ساعة",
    "admin.hover.logs.pruneAgree": "امسح السجل اللي قبل آخر ساعة",
    "admin.importError.title": "خطأ استيراد",
    "admin.importError.documentId": "رقم المستند",
    "admin.importError.tournament": "البطولة",
    "admin.importError.competition": "المنافسة",
    "admin.importError.newSite": "الموقع الجديد",
    "admin.importError.oldSite": "الموقع القديم",
    "ImportErrorKept.NotFound": "الاستيراد ما حفظش أي خطأ للمستند ده.",
    "admin.competitionView.otherwise": "مينفعش ندير المنافسة دي من هنا.",
    // The Competitions tab.
    "admin.competitions.block": "مجموعة",
    "admin.competitions.knockout": "خروج المغلوب",
    "admin.competitions.swiss": "سويسري",
    "admin.competitions.view": "اعرض",
    "admin.competitions.edit": "عدّل",
    "admin.competitions.up": "لفوق",
    "admin.competitions.down": "لتحت",
    "admin.competitions.archive": "أرشف",
    "admin.competitions.restore": "استرجع",
    "admin.competitions.archived": "المنافسات المؤرشفة",
    "admin.competitions.none": "مفيش منافسات",
    "admin.competitions.add": "ضيف منافسة",
    // The competition dialog.
    "admin.competition.addTitle": "ضيف منافسة",
    "admin.competition.editTitle": "عدّل المنافسة",
    "admin.competition.name": "الاسم",
    "admin.competition.kind": "النوع",
    "admin.competition.bestOf": "أحسن",
    "admin.competition.rounds": "الأدوار",
    "admin.competition.places": "الأماكن",
    "admin.competition.round": "الدور {number}",
    "admin.competition.bestOfs": "عدد الألعاب في المباراة",
    "admin.competition.quarters": "ربع النهائي",
    "admin.competition.semis": "نصف النهائي",
    "admin.competition.final": "النهائي",
    "admin.competition.add": "ضيف",
    "admin.competition.save": "احفظ",
    "admin.competition.added": "{name} اتضافت.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise": "مينفعش نحفظ المنافسة دي زي ما هي.",
    "CompetitionName.Missing": "اكتب اسم.",
    "CompetitionName.TooLong": "الاسم ممكن يوصل 254 حرف على الأكتر.",
    "CompetitionName.NoLetterOrDigit": "الاسم لازم يكون فيه حرف أو رقم.",
    "Tournament.KnockoutPlayerHasGames":
      "اللاعبين في القرعة دي ليهم ألعاب، فأماكنهم مينفعش تتغيّر.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "الدور اللي فيه مباراة اتحسمت مينفعش يتعمل أحسن عدد ألعاب أقل.",
    "Tournament.KnockoutLaterRoundHasGames":
      "الدور مينفعش يتغيّر بعد ما تتلعب لعبة في دور بعده.",
    "Tournament.CompetitionNameTaken":
      "فيه منافسة تانية في البطولة دي بنفس الاسم.",
    "BestOf.NotWhole": "اكتب عدد صحيح من الألعاب.",
    "BestOf.TooSmall": "المباراة لازم تكون أحسن لعبة واحدة على الأقل.",
    "Rounds.NotWhole": "اكتب عدد صحيح من الأدوار.",
    "Rounds.TooSmall": "المجموعة لازم تتلعب في دور واحد على الأقل.",
    "KnockoutDraw.EvenBestOf":
      "مباراة الخروج المغلوب لازم يكون لها فايز، فهي أحسن عدد فردي من الألعاب.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "أنشئ بطولة جديدة",
    "admin.hover.tournaments.manage":
      "أدر لاعبين البطولة دي وفرقها ومنافساتها ونتايجها",
    "admin.hover.tournaments.edit": "غيّر تفاصيل البطولة دي",
    "admin.hover.tournaments.scores": "سجّل نتايج البطولة دي",
    "admin.hover.tournaments.players": "اهتم بلاعبين البطولة دي",
    "admin.hover.competitions.view":
      "افتح المنافسة دي عشان تشوف لاعبينها ونتايجها وتسجّلهم",
    "admin.hover.tests.view": "افتح اللقاء ده عشان تشوف نتايجه وتسجّلها",
    "admin.hover.teams.view": "افتح الفريق ده عشان تشوف لاعبينه وتديرهم",
    "admin.hover.dialog.player.add": "ضيف اللاعب ده للبطولة",
    "admin.hover.dialog.player.save": "احفظ التغييرات على اللاعب ده",
    "admin.hover.dialog.team.add": "ضيف الفريق ده للبطولة",
    "admin.hover.dialog.team.save": "احفظ التغييرات على الفريق ده",
    "admin.hover.dialog.test.add": "ضيف اللقاء ده للبطولة",
    "admin.hover.dialog.test.save": "احفظ التغييرات على اللقاء ده",
    "admin.hover.dialog.competition.add": "ضيف المنافسة دي للبطولة",
    "admin.hover.dialog.competition.save": "احفظ التغييرات على المنافسة دي",
    "admin.hover.dialog.score.add": "ضيف النتيجة دي للمنافسة",
    "admin.hover.dialog.score.save": "احفظ تصحيح النتيجة دي",
    "admin.hover.dialog.carryForward.save": "رحّل نتايج اللاعب ده",
    "admin.hover.dialog.tournament.new": "أنشئ البطولة دي",
    "admin.hover.dialog.tournament.edit": "احفظ التغييرات على البطولة دي",
    "admin.hover.modal.cancel": "اقفل ده من غير ما تحفظ حاجة",
    "admin.hover.modal.ok": "اقفل الرسالة دي",
    "admin.hover.tab": "اعرض تبويب {name}",
    "admin.hover.tournaments.archive": "أرشف البطولة دي؛ ممكن ترجّعها",
    "admin.hover.tournaments.restore": "رجّع البطولة المؤرشفة دي",
    "admin.hover.players.add": "ضيف لاعب للبطولة دي",
    "admin.hover.players.edit": "غيّر تفاصيل اللاعب ده",
    "admin.hover.players.up": "اطلّع اللاعب ده لفوق في القايمة",
    "admin.hover.players.down": "نزّل اللاعب ده لتحت في القايمة",
    "admin.hover.players.archive": "أرشف اللاعب ده؛ ممكن ترجّعه",
    "admin.hover.players.restore": "رجّع اللاعب المؤرشف ده",
    "admin.hover.teams.add": "ضيف فريق للبطولة دي",
    "admin.hover.teams.edit": "غيّر تفاصيل الفريق ده",
    "admin.hover.teams.up": "اطلّع الفريق ده لفوق في القايمة",
    "admin.hover.teams.down": "نزّل الفريق ده لتحت في القايمة",
    "admin.hover.teams.archive": "أرشف الفريق ده؛ ممكن ترجّعه",
    "admin.hover.teams.restore": "رجّع الفريق المؤرشف ده",
    "admin.hover.competitions.add": "ضيف منافسة للبطولة دي",
    "admin.hover.competitions.edit": "غيّر تفاصيل المنافسة دي",
    "admin.hover.competitions.up": "اطلّع المنافسة دي لفوق في القايمة",
    "admin.hover.competitions.down": "نزّل المنافسة دي لتحت في القايمة",
    "admin.hover.competitions.archive": "أرشف المنافسة دي؛ ممكن ترجّعها",
    "admin.hover.competitions.restore": "رجّع المنافسة المؤرشفة دي",
    "admin.hover.tests.add": "ضيف لقاء بين فريقين",
    "admin.hover.tests.edit": "غيّر تفاصيل اللقاء ده",
    "admin.hover.tests.up": "اطلّع اللقاء ده لفوق في القايمة",
    "admin.hover.tests.down": "نزّل اللقاء ده لتحت في القايمة",
    "admin.hover.tests.archive": "أرشف اللقاء ده؛ ممكن ترجّعه",
    "admin.hover.tests.restore": "رجّع اللقاء المؤرشف ده",
    "admin.hover.tests.toTeams":
      "روح على تبويب الفرق عشان تضيف الفرق اللي اللقاء محتاجها",
    "admin.hover.scores.add": "ضيف نتيجة لعبة للمنافسة دي",
    "admin.hover.scores.edit": "صحّح النتيجة دي",
    "admin.hover.scores.archive":
      "أرشف النتيجة دي عشان تبطّل تتحسب؛ ممكن ترجّعها",
    "admin.hover.scores.restore": "رجّع النتيجة المؤرشفة دي عشان تتحسب تاني",
    "admin.hover.scores.withdraw":
      "سيب النتيجة دي في القايمة بس خلّيها ما تتحسبش",
    "admin.hover.scores.unwithdraw": "خلّي النتيجة المسحوبة دي تتحسب تاني",
    "admin.hover.scores.up": "قدّم النتيجة دي في القايمة",
    "admin.hover.scores.down": "أخّر النتيجة دي في القايمة",
    "admin.hover.competitionPlayers.add":
      "حط اللاعب اللي اخترته في المنافسة دي",
    "admin.hover.competitionPlayers.up": "اطلّع اللاعب ده لفوق في القايمة",
    "admin.hover.competitionPlayers.down": "نزّل اللاعب ده لتحت في القايمة",
    "admin.hover.competitionPlayers.remove": "طلّع اللاعب ده من المنافسة",
    "admin.hover.competitionPlayers.withdraw": "اسحب اللاعب ده من المنافسة",
    "admin.hover.competitionPlayers.unwithdraw":
      "رجّع اللاعب المنسحب ده للمنافسة",
    "admin.hover.competitionPlayers.carryForward":
      "رحّل نتايج اللاعب ده من منافسة تانية",
    "admin.hover.notes.add": "اكتب ملاحظة جديدة للبطولة دي",
    "admin.hover.notes.edit": "غيّر الملاحظة دي",
    "admin.hover.notes.delete": "امسح الملاحظة دي",
    "admin.hover.note.add": "احفظ الملاحظة دي وضيفها للبطولة",
    "admin.hover.note.save": "احفظ التغييرات على الملاحظة دي",
    "admin.hover.people.add": "اديّ الشخص ده الدور",
    "admin.hover.people.remove": "شيل الدور من الشخص ده",
    "admin.hover.worldRankings.import": "هات التصنيف العالمي وضيف لاعبينه",
    "admin.modal.cancel": "إلغاء",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "تمام",
    // The Managers and Scorers tabs.
    "admin.people.emailAddress": "عنوان الإيميل",
    "admin.people.remove": "شيل",
    "admin.people.otherwise": "ما قدرناش نعمل ده.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "انت",
    "admin.managers.add": "ضيف مدير",
    "admin.managers.email": "ابعت إيميل للمديرين",
    // Never said, since a tournament always has a manager.
    "admin.managers.none": "مفيش مديرين",
    "admin.managers.removeTitle": "شيل مدير",
    "admin.managers.removeExplanation": "{name} مش هيقدر يدير البطولة دي تاني.",
    "admin.managers.removeYourself.explanation":
      "انت مش هتقدر تدير البطولة دي تاني، ومحدش هنا يقدر يرجّع ده ليك. أي مدير تاني يقدر يخليك مدير تاني.",
    "admin.managers.otherwise": "العنوان ده مينفعش يتعمل مدير.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "ضيف لاعب",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "مينفعش نضيف اللاعب ده.",
    "admin.competitionPlayers.choose": "اللاعب اللي هيتضاف",
    "admin.competitionPlayers.nobody": "اختار لاعب",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "كل اللاعبين في المنافسة",
    "admin.competitionPlayers.none": "مفيش لاعبين",
    "admin.competitionPlayers.up": "لفوق",
    "admin.competitionPlayers.down": "لتحت",
    "admin.competitionPlayers.remove": "شيل",
    "admin.competitionPlayers.withdraw": "اسحب",
    "admin.competitionPlayers.unwithdraw": "رجّع",
    "admin.competitionPlayers.withdrawn": "اللاعبين المنسحبين",
    "admin.competitionPlayers.removeTitle": "شيل لاعب",
    "admin.competitionPlayers.removeQuestion":
      "{name} هيتشال من المنافسة. مينفعش ترجّع ده.",
    "admin.competitionPlayers.withdrawTitle": "اسحب لاعب",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} مش هيلعب باقي المنافسة، والألعاب اللي ما لعبهاش هتتحسم من غيره.",
    "admin.competitionPlayers.carryForward": "رحّل",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "ترحيل - {name}",
    "admin.carryForward.save": "احفظ",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "مينفعش نحفظ الترحيل ده.",
    "admin.carryForward.matchWins": "مباريات مكسوبة",
    "admin.carryForward.matchLosses": "مباريات مخسورة",
    "admin.carryForward.gameWins": "ألعاب مكسوبة",
    "admin.carryForward.gameLosses": "ألعاب مخسورة",
    "admin.carryForward.hoopsFor": "أطواق له",
    "admin.carryForward.hoopsAgainst": "أطواق عليه",
    "CarryForward.MatchWinsNotWhole": "اكتب عدد صحيح من المباريات المكسوبة.",
    "CarryForward.MatchWinsBelowZero": "اكتب 0 أو أكتر من المباريات المكسوبة.",
    "CarryForward.MatchLossesNotWhole": "اكتب عدد صحيح من المباريات المخسورة.",
    "CarryForward.MatchLossesBelowZero":
      "اكتب 0 أو أكتر من المباريات المخسورة.",
    "CarryForward.GameWinsNotWhole": "اكتب عدد صحيح من الألعاب المكسوبة.",
    "CarryForward.GameWinsBelowZero": "اكتب 0 أو أكتر من الألعاب المكسوبة.",
    "CarryForward.GameLossesNotWhole": "اكتب عدد صحيح من الألعاب المخسورة.",
    "CarryForward.GameLossesBelowZero": "اكتب 0 أو أكتر من الألعاب المخسورة.",
    "CarryForward.HoopsForNotWhole": "اكتب عدد صحيح من الأطواق له.",
    "CarryForward.HoopsForBelowZero": "اكتب 0 أو أكتر من الأطواق له.",
    "CarryForward.HoopsAgainstNotWhole": "اكتب عدد صحيح من الأطواق عليه.",
    "CarryForward.HoopsAgainstBelowZero": "اكتب 0 أو أكتر من الأطواق عليه.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "ضيف نتيجة",
    "admin.scores.none": "مفيش نتايج",
    "admin.scores.edit": "عدّل",
    "admin.scores.drawNotFilledTitle": "القرعة مش مكتملة",
    "admin.scores.archive": "أرشف",
    "admin.scores.up": "لفوق",
    "admin.scores.down": "لتحت",
    "admin.scores.restore": "استرجع",
    "admin.scores.archived": "النتايج المؤرشفة",
    "admin.scores.archivedSaid": "مؤرشفة",
    "admin.scores.withdraw": "اسحب",
    "admin.scores.unwithdraw": "رجّع",
    "admin.scores.withdrawnSaid": "مسحوبة",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "ما قدرناش نعمل ده.",
    "admin.score.title": "ضيف نتيجة",
    "admin.score.add": "ضيف اللعبة",
    "admin.score.winner": "الفايز",
    "admin.score.winnerScore": "نتيجة الفايز",
    "admin.score.loser": "الخاسر",
    "admin.score.loserScore": "نتيجة الخاسر",
    "admin.score.beat": "هزم",
    "admin.score.added": "اتضافت اللعبة اللي كسبها {winner} قدّام {loser}.",
    "admin.score.otherwise": "ما قدرناش نضيف اللعبة.",
    "admin.score.correctTitle": "عدّل النتيجة",
    "admin.score.save": "احفظ",
    "admin.score.notCorrected": "ما قدرناش نصحّح النتيجة.",
    "Game.WinnerMissing": "اختار الفايز.",
    "Game.WinnerScoreMissing": "اكتب نتيجة الفايز.",
    "Game.LoserMissing": "اختار الخاسر.",
    "Game.LoserScoreMissing": "اكتب نتيجة الخاسر.",
    "Score.NoPoints": "النتيجة بتبدأ بعدد النقط.",
    "Game.SamePlayer": "محدش بيلعب ضد نفسه.",
    "Game.WinnerNotAhead":
      "نتيجة الفايز لازم تكون أكتر من نتيجة الخاسر، أو تتعلّم إنها فوز.",
    "Game.LoserMarked": "نتيجة الخاسر مينفعش تتعلّم إنها فوز.",
    "Game.ResultChanged":
      "التصحيح بيحافظ على النتيجة: اللعبة المكسوبة تفضل مكسوبة، والمتعادلة تفضل متعادلة.",
    "Competition.MatchDecided": "المباراة بينهم اتحسمت فعلاً.",
    "Competition.DrawFull": "مينفعش نضيف اللاعب لأن الخروج المغلوب ممتلي.",
    "Competition.DrawNotFilled":
      "مينفعش نضيف نتايج لحد ما كل مكان في الخروج المغلوب يتملي بلاعب أو Bye.",
    "Competition.ByeOutsideKnockout":
      "الخروج المغلوب بس هو اللي ممكن يكون فيه Bye.",
    "Competition.NotDrawnToMeet":
      "اللاعبين دول مش واقعين دلوقتي في القرعة عشان يلعبوا ضد بعض في الخروج المغلوب.",
    "Competition.WinnerHasPlayedOn":
      "فايز المباراة دي لعب لعبته اللي بعدها فعلاً، فمينفعش نغيّر مين كسبها.",
    "CompetitionPlayer.Withdrawn": "اللاعب المنسحب مبيلعبش تاني.",
    "admin.players.add": "ضيف لاعب",
    "admin.players.none": "مفيش لاعبين",
    "admin.players.edit": "عدّل",
    "admin.players.archive": "أرشف",
    "admin.players.restore": "استرجع",
    "admin.players.up": "لفوق",
    "admin.players.down": "لتحت",
    // Asked before archiving a player who is in competitions.
    "admin.players.archiveTitle": "أرشف لاعب",
    "admin.players.archiveQuestion": "{name} هيتشال من المنافسات دي:",
    "admin.players.archive.explanation": "لما ترجّعه مش هيرجع للمنافسات دي.",
    "admin.players.archived": "اللاعبين المؤرشفين",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "مؤرشف",
    // The player dialog.
    "admin.player.addTitle": "ضيف لاعب",
    "admin.player.editTitle": "عدّل لاعب",
    "admin.player.name": "الاسم",
    "admin.player.representing": "بيمثّل",
    "admin.player.worldRankingName": "اسم اللاعب في التصنيف العالمي",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "التصنيف العالمي يعرف الاسم ده.",
    "admin.player.worldRankingQuestioned":
      "التصنيف العالمي مفيهوش لاعب بالاسم ده. ممكن يكون مكتوب غلط، أو اللاعب جديد على التصنيف.",
    "admin.player.flag": "العلم",
    "admin.player.add": "ضيف",
    "admin.player.save": "احفظ",
    "admin.player.added": "{name} اتضاف.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "مينفعش نحفظ اللاعب ده زي ما هو.",
    "Tournament.PlayerNameTaken": "فيه لاعب تاني في البطولة دي بنفس الاسم.",
    "TournamentPlayer.NoSuchFlag": "اختار علم من الأعلام الموجودة.",
    "TournamentPlayer.NamedBye": "اللاعب مينفعش يتسمّى Bye.",
    "TournamentPlayer.NoLetterOrDigit": "الاسم لازم يكون فيه حرف أو رقم.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "الـ Bye مش محتاج إضافة",
    "admin.player.byes":
      "الـ Bye مش من لاعبين البطولة. الخروج المغلوب بيقدّم Bye كل ما بتضيف لاعبين، بعدد المرات اللي القرعة محتاجاها.",
    // A tournament played by teams: its Teams and Tests tabs.
    "admin.view.teams": "الفرق",
    "admin.view.tests": "اللقاءات",
    "admin.teams.add": "ضيف فريق",
    "admin.teams.none": "مفيش فرق",
    "admin.teams.edit": "عدّل",
    "admin.teams.view": "اعرض",
    "admin.teams.archive": "أرشف",
    "admin.teams.restore": "استرجع",
    "admin.teams.up": "لفوق",
    "admin.teams.down": "لتحت",
    "admin.teams.archived": "الفرق المؤرشفة",
    "admin.teams.archivedSaid": "مؤرشف",
    "admin.team.addTitle": "ضيف فريق",
    "admin.team.editTitle": "عدّل فريق",
    "admin.team.name": "الاسم",
    "admin.team.shortName": "الاسم المختصر",
    "admin.team.shortName.explanation":
      "الاسم اللي بتتسمّى بيه لقاءات الفريق، زي AUS v ENG.",
    "admin.team.flag": "العلم",
    "admin.team.add": "ضيف",
    "admin.team.save": "احفظ",
    "admin.team.added": "{name} اتضاف.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "مينفعش نحفظ الفريق ده زي ما هو.",
    "admin.teamView.otherwise": "مينفعش نعرض الفريق ده من هنا.",
    "admin.teamView.players": "اللاعبين",
    "TeamName.Missing": "اكتب اسم الفريق.",
    "TeamName.TooLong": "الاسم ده طويل أوي.",
    "admin.notes.add": "ضيف ملاحظة",
    "admin.notes.none": "مفيش ملاحظات",
    "admin.notes.edit": "عدّل",
    "admin.notes.delete": "امسح",
    // Asked before deleting a note.
    "admin.notes.deleteTitle": "امسح ملاحظة",
    "admin.notes.deleteQuestion": "تمسح الملاحظة “{title}”؟",
    "admin.notes.delete.explanation":
      "الملاحظة اللي بتتمسح بتروح للأبد، ومينفعش ترجّعها.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "ما قدرناش نعمل ده.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "ضيف ملاحظة",
    "admin.note.editTitle": "عدّل ملاحظة",
    "admin.note.title": "العنوان",
    "admin.note.description": "الوصف",
    "admin.note.write": "اكتب",
    "admin.note.preview": "معاينة",
    "admin.note.toolbar": "التنسيق",
    "admin.note.tool.heading": "عنوان",
    "admin.note.tool.bold": "عريض",
    "admin.note.tool.italic": "مائل",
    "admin.note.tool.quote": "اقتباس",
    "admin.note.tool.code": "كود",
    "admin.note.tool.link": "رابط",
    "admin.note.tool.numberedList": "قايمة مرقّمة",
    "admin.note.tool.bulletedList": "قايمة بنقط",
    "admin.note.tool.taskList": "قايمة مهام",
    "admin.note.add": "ضيف",
    "admin.note.save": "احفظ",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "مينفعش نحفظ الملاحظة دي زي ما هي.",
    "ManagerNoteTitle.Missing": "اكتب عنوان للملاحظة.",
    "ManagerNoteTitle.TooLong": "العنوان ده طويل أوي.",
    "ManagerNoteTitle.NoLetterOrDigit": "العنوان لازم يكون فيه حرف أو رقم.",
    "ManagerNoteDescription.TooLong": "الوصف ده طويل أوي.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون مدير تاني مسحها.",
    "EditManagerNote.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون مدير تاني مسحها.",
    "DeleteManagerNote.NoSuchManagerNote":
      "الملاحظة دي مبقتش موجودة. ممكن يكون مدير تاني مسحها.",
    "ManagerNote.Deleted": "الملاحظة دي اتمسحت. ممكن يكون مدير تاني مسحها.",
    "CommentaryTitle.Missing": "اكتب عنوان للتعليق.",
    "CommentaryTitle.TooLong": "العنوان ده طويل أوي.",
    "CommentaryTitle.NoLetterOrDigit": "العنوان لازم يكون فيه حرف أو رقم.",
    "Commentary.TitleTaken": "فيه تعليق تاني بنفس العنوان.",
    "CommentText.Missing": "اكتب حاجة في التعليق.",
    "CommentText.TooLong": "التعليق ده طويل أوي.",
    "TeamShortName.Missing": "اكتب اسم مختصر للفريق.",
    "TeamShortName.TooLong": "الاسم المختصر ممكن يوصل 10 حروف على الأكتر.",
    "TeamShortName.NoLetterOrDigit": "الاسم المختصر لازم يكون فيه حرف أو رقم.",
    "Team.ShortNameLongerThanName":
      "الاسم المختصر مينفعش يكون أطول من اسم الفريق.",
    "Team.NoSuchFlag": "اختار علم من الأعلام الموجودة.",
    "Team.Archived": "الفريق ده مؤرشف، ولازم يترجّع الأول.",
    "Team.InATest": "الفريق ده بيلعب في لقاء، ومينفعش يتأرشف.",
    "Team.PlayerNameTaken": "فيه لاعب تاني في الفريق ده بنفس الاسم.",
    "TeamPlayer.NamedBye": "اللاعب مينفعش يتسمّى Bye.",
    "TeamPlayer.Archived": "اللاعب ده مؤرشف، ولازم يترجّع الأول.",
    "TeamPlayer.HasGames": "اللاعب ده لعب، ومينفعش يتأرشف.",
    "Tournament.TeamNameTaken": "فيه فريق تاني في البطولة دي بنفس الاسم.",
    "Tournament.TeamShortNameTaken":
      "فيه فريق تاني في البطولة دي بنفس الاسم المختصر.",
    "Tournament.NoSuchTeam": "البطولة دي مفيهاش فريق على العنوان ده.",
    "Tournament.TeamArchived":
      "الفريق ده مؤرشف، وميتسترجعش غير من تبويب الفرق.",
    "admin.tests.add": "ضيف لقاء",
    "admin.tests.none": "مفيش لقاءات",
    "admin.tests.edit": "عدّل",
    "admin.tests.view": "اعرض",
    "admin.tests.archive": "أرشف",
    "admin.tests.restore": "استرجع",
    "admin.tests.up": "لفوق",
    "admin.tests.down": "لتحت",
    "admin.tests.archived": "اللقاءات المؤرشفة",
    "admin.tests.twoTeamsNeeded":
      "اللقاء بيكون بين فريقين، فلازم فريقين الأول.",
    "admin.tests.toTeams": "روح على الفرق",
    "admin.tests.matches.one": "{count} مباراة",
    "admin.tests.matches.other": "{count} مباريات",
    "admin.tests.bestOf": "أحسن {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "ما قدرناش نعمل ده.",
    "admin.test.addTitle": "ضيف لقاء",
    "admin.test.editTitle": "عدّل لقاء",
    "admin.test.firstTeam": "الفريق أ",
    "admin.test.secondTeam": "الفريق ب",
    "admin.test.versus": "ضد",
    "admin.test.starts": "بيبدأ",
    "admin.test.finishes": "بيخلص",
    "admin.test.expectedMatches": "المباريات المتوقّعة",
    "admin.test.bestOf": "أحسن",
    "admin.test.group": "المجموعة",
    "admin.test.add": "ضيف",
    "admin.test.save": "احفظ",
    "admin.test.added": "{name} اتضاف.",
    "admin.test.otherwise": "مينفعش نحفظ اللقاء ده زي ما هو.",
    "admin.testView.otherwise": "مينفعش نعرض اللقاء ده من هنا.",
    "AddTest.FirstTeamMissing": "اختار الفريق الأول.",
    "AddTest.SecondTeamMissing": "اختار الفريق التاني.",
    "UpdateTest.FirstTeamMissing": "اختار الفريق الأول.",
    "UpdateTest.SecondTeamMissing": "اختار الفريق التاني.",
    "ExpectedMatches.NotWhole": "اكتب عدد صحيح من المباريات.",
    "ExpectedMatches.TooSmall": "اللقاء لازم يتوقّع له مباراة واحدة على الأقل.",
    "TestGroup.TooLong": "المجموعة دي طويلة أوي.",
    "Tournament.TestAgainstItself": "الفريق مبيلعبش لقاء ضد نفسه.",
    "Tournament.TestFinishesBeforeStarts": "اللقاء مينفعش يخلص قبل ما يبدأ.",
    "Tournament.TestStartsBeforeTournament": "اللقاء مينفعش يبدأ قبل بطولته.",
    "Tournament.TestFinishesAfterTournament": "اللقاء مينفعش يخلص بعد بطولته.",
    "Tournament.TestHasGamesInUse":
      "اللقاء ده فيه ألعاب، فمينفعش يتأرشف لحد ما هي تتأرشف.",
    "Tournament.TestHasGames":
      "اللقاء ده فيه ألعاب دلوقتي، فمبقاش ينفع نغيّر فرقه.",
    "Tournament.ExpectedMatchesBelowStarted":
      "اتبدأت مباريات أكتر من كده فعلاً.",
    "Tournament.BestOfBelowGamesPlayed":
      "فيه لاعبين لعبوا ألعاب أكتر من كده فعلاً.",
    "Competition.ExpectedMatchesReached":
      "اللقاء ده بدأ عدد المباريات اللي متوقّع يبقى فيه.",
    "Competition.SameTeam": "لاعبين الفريق الواحد مبيلعبوش ضد بعض.",
    "AddManager.NoSuchAccount": "العنوان ده ملوش حساب ينفع يتعمل مدير.",
    "admin.scorers.add": "ضيف مسجّل نتايج",
    "admin.scorers.none": "مفيش مسجّلين نتايج",
    "admin.scorers.removeTitle": "شيل مسجّل نتايج",
    "admin.scorers.removeExplanation":
      "{name} مش هيقدر يسجّل نتايج البطولة دي تاني.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "العنوان ده مينفعش يتعمل مسجّل نتايج.",
    "AddScorer.NoSuchAccount": "العنوان ده ملوش حساب ينفع يتعمل مسجّل نتايج.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "المدير بس هو اللي يقدر يعمل ده.",
    "AddRole.NoSuchAccount": "العنوان ده ملوش حساب ينفع ياخد الدور.",
    "AddRole.NoSuchRole": "مفيش دور بالشكل ده.",
    "RemoveRole.NoSuchAccount": "مفيش حساب بالشكل ده.",
    "RemoveRole.NoSuchRole": "مفيش دور بالشكل ده.",
    "RemoveRole.Yourself": "مينفعش تشيل دور المدير من نفسك.",
    "AccountsWithRole.NoSuchRole": "مفيش دور بالشكل ده.",
    "Tournament.AlreadyAManager":
      "الحساب ده بيدير البطولة فعلاً، وبيقدر يعمل كل اللي مسجّل النتايج يقدر يعمله.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    "TournamentName.Missing": "اكتب اسم البطولة.",
    "TournamentName.TooShort": "الاسم ده قصير أوي.",
    "TournamentName.TooLong": "الاسم ده طويل أوي.",
    "TournamentName.AllLowerCase": "الاسم مينفعش يكون كله حروف صغيرة.",
    "TournamentName.AllCapitals": "الاسم مينفعش يكون كله حروف كبيرة.",
    "TournamentName.NoLetterOrDigit": "الاسم لازم يكون فيه حرف أو رقم.",
    "ReadOnlyDate.Unreadable": "اكتب اليوم.",
    "Tournament.FinishesBeforeStarts": "البطولة مينفعش تخلص قبل ما تبدأ.",
    "Tournament.StartsAfterNextYear": "البطولة مينفعش تبدأ بعد السنة الجاية.",
    "Tournament.FinishesAfterNextYear": "البطولة مينفعش تخلص بعد السنة الجاية.",
    "CreateTournament.NoSuchCountry": "اختار البلد.",
    "TournamentSubtitle.TooLong": "العنوان الفرعي ميزيدش عن 2000 حرف.",
    "Tournament.NotAManager": "مدير البطولة دي بس هو اللي يقدر يغيّرها.",
    "Tournament.NotAManagerOrScorer":
      "مدير البطولة دي أو مسجّل نتايجها بس هو اللي يقدر يشوفها.",
    "Tournament.Archived": "البطولة دي مؤرشفة، ولازم تتسترجع قبل ما تتغيّر.",
    "UpdateTournament.NoSuchTournament": "مفيش بطولة على العنوان ده.",

    // What a tournament is played in and where, by code.
    "sport.ac": "كروكيه الأسوشييشن",
    "sport.gc": "كروكيه الجولف",
    "sport.a6w": "الكروكيه الأمريكي بستة أطواق",
    "sport.rc": "ريكوشيه",
    "sport.gb": "جيت بول",
    "format.standard": "عادي",
    "format.teams": "فرق",
    "format.eire-cup": "كأس إيري",
    "format.interstate-shield": "درع الولايات",
    "format.gc-world-team-championship": "بطولة العالم للفرق في كروكيه الجولف",
    "country.ad": "أندورا",
    "country.ae": "الإمارات العربية المتحدة",
    "country.af": "أفغانستان",
    "country.ag": "أنتيغوا وبربودا",
    "country.ai": "أنغويلا",
    "country.al": "ألبانيا",
    "country.am": "أرمينيا",
    "country.ao": "أنغولا",
    "country.ar": "الأرجنتين",
    "country.as": "ساموا الأمريكية",
    "country.at": "النمسا",
    "country.au": "أستراليا",
    "country.aw": "أروبا",
    "country.ax": "جزر أولاند",
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
    "country.bs": "الباهاما",
    "country.bt": "بوتان",
    "country.bv": "جزيرة بوفيه",
    "country.bw": "بوتسوانا",
    "country.by": "بيلاروسيا",
    "country.bz": "بليز",
    "country.ca": "كندا",
    "country.catalonia": "كتالونيا",
    "country.cc": "جزر كوكوس (كيلينغ)",
    "country.cd": "جمهورية الكونغو الديمقراطية",
    "country.cf": "جمهورية أفريقيا الوسطى",
    "country.cg": "جمهورية الكونغو",
    "country.ch": "سويسرا",
    "country.ci": "ساحل العاج",
    "country.ck": "جزر كوك",
    "country.cl": "شيلي",
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
    "country.do": "جمهورية الدومينيكان",
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
    "country.gd": "غرينادا",
    "country.ge": "جورجيا",
    "country.gf": "غيانا الفرنسية",
    "country.gh": "غانا",
    "country.gi": "جبل طارق",
    "country.gl": "جرينلاند",
    "country.gm": "غامبيا",
    "country.gn": "غينيا",
    "country.gp": "غوادلوب",
    "country.gq": "غينيا الاستوائية",
    "country.gr": "اليونان",
    "country.gs": "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
    "country.gt": "غواتيمالا",
    "country.gu": "غوام",
    "country.gw": "غينيا بيساو",
    "country.gy": "غيانا",
    "country.hk": "هونغ كونغ",
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
    "country.lu": "لوكسمبورغ",
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
    "country.mw": "ملاوي",
    "country.mx": "المكسيك",
    "country.my": "ماليزيا",
    "country.mz": "موزمبيق",
    "country.na": "ناميبيا",
    "country.nc": "كاليدونيا الجديدة",
    "country.ne": "النيجر",
    "country.nf": "جزيرة نورفولك",
    "country.ng": "نيجيريا",
    "country.ni": "نيكاراغوا",
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
    "country.py": "باراغواي",
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
    "country.sh": "سانت هيلانة",
    "country.si": "سلوفينيا",
    "country.sj": "سفالبارد وجان مايان",
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
    "country.tg": "توغو",
    "country.th": "تايلاند",
    "country.tj": "طاجيكستان",
    "country.tk": "توكيلاو",
    "country.tl": "تيمور الشرقية",
    "country.tm": "تركمانستان",
    "country.tn": "تونس",
    "country.to": "تونغا",
    "country.tr": "تركيا",
    "country.tt": "ترينيداد وتوباغو",
    "country.tv": "توفالو",
    "country.tw": "تايوان",
    "country.tz": "تنزانيا",
    "country.ua": "أوكرانيا",
    "country.ug": "أوغندا",
    "country.um": "جزر الولايات المتحدة النائية",
    "country.us": "الولايات المتحدة",
    "country.uy": "أوروغواي",
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

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. `{link}`, `{site}`, `{siteName}`,
    // `{emailFromName}` and the button colours are filled in by the site.

    "Email.ConfirmAddress.subject": "أكّد عنوان الإيميل بتاعك على {siteName}",
    "Email.ConfirmAddress.body": `
<p>أهلاً،</p>

<p>
    شكراً إنك عملت حساب على <strong>{siteName}</strong>.<br />
    قبل ما تبدأ تستخدم حسابك، أكّد عنوان الإيميل بتاعك
    بالضغط على الزرار اللي تحت:
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
        أكّد عنوان الإيميل بتاعي
    </a>
</p>

<p>
    لو الزرار مش شغّال، تقدر برضه تأكّد عنوان الإيميل بتاعك بفتح الرابط ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    لو انت ما عملتش الحساب ده، تقدر تتجاهل الإيميل ده بأمان.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "رابط جديد لتأكيد عنوان الإيميل بتاعك على {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>أهلاً،</p>

<p>
    انت طلبت من شوية إيميل جديد لتأكيد عنوان الإيميل بتاعك على <strong>{siteName}</strong>.<br />
    لو سمحت أكّد عنوان الإيميل بتاعك بالضغط على الزرار اللي تحت:
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
        أكّد عنوان الإيميل بتاعي
    </a>
</p>

<p>
    لو الزرار مش شغّال، تقدر برضه تأكّد عنوان الإيميل بتاعك بفتح الرابط ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    أول ما تأكّده، هتقدر تكمّل استخدام حسابك من غير أي مشكلة.
</p>

<p>
    لو انت ما طلبتش الإيميل ده، تقدر تتجاهله بأمان.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject": "حد حاول يسجّل بعنوان الإيميل بتاعك",
    "Email.AlreadyRegistered.body": `
<p>أهلاً،</p>

<p>
    حد حاول يسجّل على <strong>{siteName}</strong> بعنوان الإيميل ده،
    وعليه حساب فعلاً. مفيش حاجة في حسابك اتغيّرت.<br />
    لو كنت انت، فعندك حساب فعلاً، وتقدر تدخل عليه:
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
        سجّل الدخول
    </a>
</p>

<p>
    ولو نسيت كلمة السر، تقدر تغيّرها من هنا:
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
        نسيت كلمة السر
    </a>
</p>

<p>
    ولو ماكنتش انت، ماتعملش حاجة. محدش اتدّاله طريق لحسابك.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "أكّد نقل حسابك على {siteName} للعنوان ده",
    "Email.ConfirmNewEmailAddress.body": `
<p>أهلاً،</p>

<p>
    حد داخل على حساب على <strong>{siteName}</strong> طلب ينقله
    لعنوان الإيميل ده. لو كنت انت، أكّد من هنا، وانت داخل على
    الحساب ده. الرابط شغّال لمدة 24 ساعة.
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
        انقل حسابي
    </a>
</p>

<p>
    أو انسخ العنوان ده في المتصفح:<br />
    {link}
</p>

<p>
    ولو ماكنتش انت، ماتعملش حاجة. مفيش حساب هيتنقل هنا.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "حد طلب ينقل حساب لعنوان الإيميل بتاعك",
    "Email.AlreadyHasAnAccount.body": `
<p>أهلاً،</p>

<p>
    حد داخل على حساب على <strong>{siteName}</strong> طلب ينقله
    لعنوان الإيميل ده، وعليه حساب بتاعه فعلاً. مفيش حاجة اتنقلت،
    ومفيش حاجة في حسابك اتغيّرت.
</p>

<p>
    لو كنت انت، فعندك حساب على العنوان ده فعلاً، وتقدر تدخل عليه.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "حسابك على {siteName} اتنقل",
    "Email.EmailAddressChanged.body": `
<p>أهلاً،</p>

<p>
    حسابك على <strong>{siteName}</strong> اتنقل دلوقتي لعنوان إيميل
    تاني، {emailAddress}، وهتدخل بالعنوان ده من دلوقتي.
</p>

<p>
    لو ماكنتش انت، يبقى حد تاني معاه حسابك. ردّ على الإيميل ده
    وقولنا.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "كلمة السر بتاعتك على {siteName} اتغيّرت",
    "Email.PasswordChanged.body": `
<p>أهلاً،</p>

<p>
    كلمة السر لحسابك على <strong>{siteName}</strong> اتغيّرت دلوقتي،
    واتسجّل خروج كل متصفح تاني كان داخل عليه.<br />
    لو كنت انت، ماتعملش حاجة.
</p>

<p>
    ولو ماكنتش انت، يبقى حد تاني معاه كلمة السر بتاعتك. حدّد واحدة
    جديدة من هنا، وهيتسجّل خروجه:
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
        نسيت كلمة السر
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "حدّد كلمة سر جديدة لـ {siteName}",
    "Email.SetNewPassword.body": `
<p>أهلاً،</p>

<p>
    انت طلبت من شوية تغيير كلمة السر بتاعتك على <strong>{siteName}</strong>.<br />
    تقدر تغيّرها بالضغط على الزرار اللي تحت:
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
        غيّر كلمة السر
    </a>
</p>

<p>
    لو الزرار مش شغّال، تقدر برضه تغيّر كلمة السر بفتح الرابط ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    لو انت ما طلبتش تغيير كلمة السر، تقدر تتجاهل الإيميل ده بأمان.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "حدّد كلمة سر لـ {siteName}",
    "Email.SetPassword.body": `
<p>أهلاً،</p>

<p>
    حسابك على <strong>{siteName}</strong> ملوش كلمة سر: بتدخل بحساب Google.<br />
    انت طلبت تحدّد واحدة، عشان تقدر تدخل بعنوان الإيميل وكلمة سر كمان.
    تقدر تحدّدها بالضغط على الزرار اللي تحت:
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
        حدّد كلمة السر
    </a>
</p>

<p>
    لو الزرار مش شغّال، تقدر برضه تحدّد كلمة السر بفتح الرابط ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    الرابط شغّال لمدة ساعة. لو انت ما طلبتش تحدّد كلمة سر، تقدر تتجاهل الإيميل ده بأمان.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "مفيش حساب على {siteName} لعنوان الإيميل ده",
    "Email.RegisterInstead.body": `
<p>أهلاً،</p>

<p>
    اتطلب تغيير كلمة السر لعنوان إيميل مش مرتبط بأي حساب على
    <strong>{siteName}</strong>.
</p>

<p>
    لو عايز تستخدم خدمتنا، تقدر تعمل حساب جديد من هنا:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    لو انت ما طلبتش ده، تقدر تتجاهل الإيميل ده بأمان.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "أكّد إنك عايز حسابك على {siteName} يتنسي",
    "Email.ConfirmForgetting.body": `
<p>أهلاً،</p>

<p>
    انت طلبت إن حسابك على <strong>{siteName}</strong> يتنسي.<br />
    دوس على الزرار اللي تحت عشان تشوف ده معناه إيه، وتقول بتأكيد
    إنك عايزه:
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
        انسَ حسابي
    </a>
</p>

<p>
    لو الزرار مش شغّال، تقدر تفتح الرابط ده في المتصفح:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    أول ما يتنسي، اسمك وعنوان الإيميل بتاعك مش هيتقروا تاني أبداً،
    من أي حد، ومش هتقدر تدخل على الحساب. ومينفعش ترجّع ده.
</p>

<p>
    الرابط بيشتغل مرة واحدة، لحد 15 دقيقة بعد ما طلبته، وبس وانت
    داخل على الحساب ده. بعد كده اطلب تاني من حسابك.
</p>

<p>
    لو انت ما طلبتش، مفيش حاجة هتحصل غير لو الرابط اتفتح. بس حد
    داخل على حسابك هو اللي طلب، فحدّد كلمة سر جديدة من صفحة
    نسيت كلمة السر عشان تتأكّد إنه مش هيقدر يدخل تاني.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "التسجيل متوقّف: مش قادرين نوصل لـ {service}",
    "Email.RegistrationsSuspended.body": `
<p>أهلاً،</p>

<p>
    {siteName} ما قدرش يوصل لـ {service} الساعة {when}. لحد ما يرد،
    القرّاء اللي محتاجينه، عشان يسجّلوا أو يحدّدوا كلمة سر جديدة،
    بيتقالهم يجرّبوا تاني بعدين.
</p>

<p>
    مفيش حاجة محتاجة تتفك. كل محاولة بتسأل {service} من جديد،
    والصفحات بترجع تشتغل أول ما يرد.
</p>

<p>
    وطول ما {service} واقف، هيجيلك إيميل عن ده مرة واحدة في
    الساعة على الأكتر.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} مش قادر يوصل لقاعدة بياناته",
    "Email.DatabaseUnreachable.body": `
<p>أهلاً،</p>

<p>
    {siteName} ما قدرش يوصل لقاعدة بياناته الساعة {when}. لحد ما ترد، كل صفحة محتاجاها بتقول للقرّاء إن الموقع مش متاح وإنهم يجرّبوا تاني بعدين.
</p>

<p>
    مفيش حاجة محتاجة تتفك. كل طلب بيطلب اتصال من جديد، والموقع بيرجع يشتغل أول ما قاعدة البيانات ترد.
</p>

<p>
    وطول ما قاعدة البيانات واقفة، هيجيلك إيميل عن ده مرة كل {minutes} دقيقة على الأكتر.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} فشل في طلب",
    "Email.UnhandledError.body": `
<p>أهلاً،</p>

<p>
    {siteName} فشل الساعة {when} في طلب {asked}. القارئ اتعرض له الرقم المرجعي {reference}، والسجل فيه السبب تحته.
</p>

<p>
    الموقع المعطّل بيفشل غالباً في كل طلب، فهيجيلك إيميل عن الأعطال 4 مرات في الساعة على الأكتر. اللي بعد كده موجودة في السجل برضه.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
