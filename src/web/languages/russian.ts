// The site's words in Russian. Decisions a reader of this file needs:
// - The reader is addressed as «вы» (lower case), politely and plainly.
// - Buttons, menu items and headings are written in sentence case, as Russian
//   does: only the first word (and proper names) is capitalised.
// - "Email address" is «адрес электронной почты»; a bare "email" is «письмо»
//   when it is a message and «почта» when it is the mailbox.
// - "Sign in" is «Войти», "Register" is «Зарегистрироваться» (as a verb on a
//   button) and «Регистрация» (as a title), "Sign out" is «Выйти».
// - "Bye" stays «Bye» wherever the site itself checks for the word.
import type { Language } from "../common/language.js";

export const russian: Language = {
  tag: "ru",
  name: "Русский",
  words: {
    // The site's own bars.
    "site.skipToContent": "Перейти к содержимому",
    "navigation.menu": "Меню",
    "navigation.label": "Основная навигация",
    "navigation.home": "Главная",
    "navigation.help": "Справка",
    "navigation.admin": "Администрирование",
    "sections.label": "Разделы",
    "theme.label": "Тема",
    "theme.light": "Светлая",
    "theme.dark": "Тёмная",
    "theme.system": "Системная",
    "footer.donate": "Пожертвовать",
    "footer.plea":
      "Нравится {siteName}? Пожалуйста, поддержите дальнейшую разработку пожертвованием.",
    "footer.copyright": "© {years}, {owner}. Все права защищены",
    "footer.privacy": "Конфиденциальность",
    "footer.termsOfUse": "Условия использования",
    "footer.reportBug": "Сообщить об ошибке",
    "beta.banner":
      "Это бета-версия сайта. Данные могут быть сброшены в любой момент.",
    "privacy.contact":
      "Вопросы об этой странице или о том, что о вас хранится: {emailAddress}",
    // The box a reader ticks to agree to the terms of use.
    "termsOfUse.agree": "Я согласен с условиями использования",
    "termsOfUse.link": "условиями использования",
    "termsOfUse.report":
      "Сообщить о написанном или задать вопрос об этих условиях: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Поставьте галочку, чтобы принять условия использования.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Здесь можно безопасно освоить {siteName}. Всё, что введено здесь, может быть удалено в любой момент.",

    "language.label": "Язык",
    "language.choose": "Изменить",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Есть что почитать нового.",
    "whatsNew.admin.message": "Есть новости для тех, кто проводит турниры.",
    "whatsNew.view": "Посмотреть, что нового",
    "whatsNew.later": "Напомнить в следующий раз",
    "whatsNew.never": "Больше не показывать это уведомление",

    "form.otherwise":
      "Что-то введено неверно. Проверьте введённое и попробуйте ещё раз.",

    // The account menu in the header.
    "account.menu": "Аккаунт",
    "account.register": "Регистрация",
    "account.signIn": "Войти",
    "account.forgotPassword": "Забыли пароль",
    "account.signOut": "Выйти",
    "account.profile": "Профиль",
    "account.changePassword": "Изменить пароль",
    "account.changeEmailAddress": "Изменить адрес электронной почты",
    "account.changeName": "Изменить имя",
    "account.setPassword": "Задать пароль",
    "account.forgetAccount": "Забыть аккаунт",

    "register.title": "Регистрация",
    "register.emailAddress": "Адрес электронной почты",
    "register.submit": "Зарегистрироваться",
    "register.withGoogle": "Зарегистрироваться через Google",
    "register.or": "или",
    // Said above the form when Google sent the reader back without them being
    // let in.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google не подтвердил, что этот адрес электронной почты принадлежит вам, поэтому использовать его здесь с Google нельзя. Воспользуйтесь адресом электронной почты ниже.",
    "SignInWithGoogle.LinkedToAnother":
      "У этого адреса электронной почты уже есть аккаунт, связанный с другим аккаунтом Google. Войдите через тот аккаунт Google или по адресу электронной почты и паролю.",
    "SignInWithGoogle.NameMissing":
      "Google не сообщил нам ваше имя, а оно нужно для аккаунта. Воспользуйтесь адресом электронной почты ниже.",
    "Google.Unreachable":
      "Сейчас не удалось связаться с Google. Попробуйте ещё раз через несколько минут или воспользуйтесь адресом электронной почты ниже.",
    "Registration.NotAPerson":
      "Похоже, это сделал не человек. Попробуйте ещё раз, а если это повторяется, подождите несколько минут и вернитесь.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Введите адрес электронной почты.",
    "EmailAddress.NoAt": "В адресе электронной почты должен быть знак @.",
    "EmailAddress.MoreThanOneAt":
      "В адресе электронной почты должен быть ровно один знак @.",
    "EmailAddress.NoDomain":
      "После знака @ в адресе электронной почты должен быть домен, например example.com.",

    "welcome.title": "Проверьте почту",
    "welcome.checkEmail":
      "На указанный вами адрес отправлено письмо. Перейдите по ссылке в нём, чтобы продолжить.",
    "welcome.nothingArrived":
      "Если письмо не придёт в течение нескольких минут, загляните в папку «Спам».",
    "welcome.home": "Вернуться на {siteName}",
    "newConfirmationLink.title": "Получить новую ссылку",
    "newConfirmationLink.explanation":
      "Срок действия ссылки для подтверждения адреса электронной почты истёк. Запросите новую, и она будет отправлена на адрес, с которым вы регистрировались.",
    "newConfirmationLink.send": "Отправить мне новую ссылку",
    "newConfirmationLink.home": "Вернуться на {siteName}",
    "newConfirmationLink.signIn": "Войти",
    "newConfirmationLink.sent.title": "Проверьте почту",
    "newConfirmationLink.sent.explanation":
      "Новая ссылка отправлена. Перейдите по ней, чтобы подтвердить адрес электронной почты. Если письмо не придёт в течение нескольких минут, загляните в папку «Спам».",
    "newConfirmationLink.alreadyConfirmed.title":
      "Этот адрес электронной почты уже подтверждён",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Больше подтверждать нечего. Войдите с паролем, который вы задали при подтверждении.",
    "newConfirmationLink.noLongerWorks.title": "Эта ссылка больше не работает",
    "newConfirmationLink.noLongerWorks.explanation":
      "Убедитесь, что вы открыли ссылку из письма целиком, и в её конце ничего не потерялось. Если она всё равно не работает, зарегистрируйтесь заново, и вам отправят новую ссылку.",
    "newConfirmationLink.tooMany.title": "Попробуйте позже",
    "newConfirmationLink.tooMany.explanation":
      "На этот адрес в последнее время отправлено несколько ссылок. Подождите час и запросите снова, а пока загляните в папку «Спам».",

    "forgotPassword.title": "Забыли пароль?",
    "forgotPassword.emailAddress": "Адрес электронной почты",
    "forgotPassword.submit": "Отправить мне ссылку для входа",
    "forgotPassword.home": "Вернуться на {siteName}",
    "forgotPassword.sent.title": "Проверьте почту",
    "forgotPassword.sent.explanation":
      "Если у этого адреса есть аккаунт, ему отправлена ссылка для задания нового пароля. Перейдите по ней в течение часа. Если письмо не придёт в течение нескольких минут, загляните в папку «Спам».",
    "forgotPassword.tryAgainLater":
      "Отсюда в последнее время запрошено слишком много ссылок для входа. Подождите час и попробуйте снова.",

    "setNewPassword.title": "Задайте новый пароль",
    "setNewPassword.password": "Пароль",
    "setNewPassword.confirmPassword": "Подтвердите пароль",
    "setNewPassword.submit": "Задать новый пароль",
    "setNewPassword.home": "Вернуться на {siteName}",
    "setNewPassword.signIn": "Войти",
    "setNewPassword.askAgain": "Запросить новую ссылку",
    "setNewPassword.changed.title": "Ваш пароль изменён",
    "setNewPassword.changed.explanation":
      "Вы вышли из аккаунта везде, где были в него выполнены вход. Войдите с новым паролем.",
    "setNewPassword.expired.title": "Срок действия ссылки истёк",
    "setNewPassword.expired.explanation":
      "Ссылка для задания нового пароля действует один час. Запросите другую, и она будет отправлена на тот же адрес.",
    "setNewPassword.noLongerWorks.title": "Эта ссылка больше не работает",
    "setNewPassword.noLongerWorks.explanation":
      "Возможно, она уже использована или в её конце чего-то не хватает. Если она всё ещё нужна, запросите другую.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Сейчас не удаётся проверить ваш пароль, поэтому он не изменён. Попробуйте ещё раз через несколько минут; ваша ссылка действует до истечения срока.",

    "forgetAccount.title": "Забыть ваш аккаунт",
    "forgetAccount.explanation":
      "Ваши имя и адрес электронной почты можно сделать навсегда нечитаемыми, а аккаунт закрыть. Чтобы убедиться, что это вы, мы сначала отправим ссылку на адрес вашего аккаунта, и ничего не будет забыто, пока вы не перейдёте по ней.",
    "forgetAccount.submit": "Отправить мне ссылку",
    "forgetAccount.sent.title": "Проверьте почту",
    "forgetAccount.sent.explanation":
      "Мы отправили ссылку на адрес вашего аккаунта. Она действует 15 минут и только пока вы вошли в этот аккаунт.",
    "forgetAccount.confirm.title": "Забыть ваш аккаунт навсегда?",
    "forgetAccount.confirm.explanation":
      "После этого ваши имя и адрес электронной почты больше никто и никогда не сможет прочитать, а войти в аккаунт будет нельзя. Это невозможно отменить.",
    "forgetAccount.confirm.submit": "Забыть мой аккаунт",
    "forgetAccount.forgotten.title": "Ваш аккаунт забыт",
    "forgetAccount.forgotten.explanation":
      "Ваши имя и адрес электронной почты больше нельзя прочитать, и вы вышли из аккаунта везде, где были в него выполнены вход.",
    "forgetAccount.noLongerWorks.title": "Эта ссылка больше не работает",
    "forgetAccount.noLongerWorks.explanation":
      "Возможно, срок её действия истёк, она уже использована или относится к аккаунту, в который вы не вошли. Если вы всё ещё хотите, чтобы аккаунт был забыт, запросите ссылку снова из своего аккаунта.",
    "forgetAccount.lastAdministrator.title": "Ваш аккаунт нельзя забыть",
    "forgetAccount.lastAdministrator.explanation":
      "Вы единственный администратор этого сайта. Передайте роль администратора кому-нибудь другому, и тогда ваш аккаунт можно будет забыть.",
    "forgetAccount.askAgain": "Запросить снова",
    "forgetAccount.home": "Вернуться на {siteName}",

    "registrationsSuspended.title": "Регистрация временно приостановлена",
    "registrationsSuspended.explanation":
      "Сейчас не удаётся связаться со службой, необходимой для регистрации, поэтому никто не может зарегистрироваться, пока она не ответит. Введённые вами данные не сохранены.",
    "registrationsSuspended.tryAgainLater":
      "Попробуйте ещё раз немного позже. Администратор сайта уведомлён.",
    "registrationsSuspended.home": "Вернуться на {siteName}",

    "signIn.title": "Вход",
    "signIn.emailAddress": "Адрес электронной почты",
    "signIn.password": "Пароль",
    "signIn.submit": "Войти",
    "signIn.forgotPassword": "Забыли пароль?",
    "signIn.register": "Зарегистрироваться",
    "signIn.withGoogle": "Войти через Google",
    "signIn.or": "или",
    "signIn.tryAgainLater":
      "В последнее время сделано слишком много попыток. Подождите час и попробуйте снова.",

    // The one answer to a wrong password and to an address nobody registered.
    "SignIn.Failed":
      "Адрес электронной почты или пароль неверны. Пожалуйста, попробуйте ещё раз.",

    "profile.title": "Профиль",
    // A label's colon is its words'.
    "profile.name": "Имя:",
    "profile.emailAddress": "Адрес электронной почты:",

    "changeName.title": "Изменение имени",
    "changeName.name": "Имя",
    "changeName.submit": "Изменить имя",

    "setPassword.title": "Задайте пароль",
    "setPassword.explanation":
      "У вашего аккаунта нет пароля: вы входите через Google. Чтобы входить ещё и по паролю, мы отправим на {emailAddress} ссылку для его задания.",
    "setPassword.submit": "Отправить мне ссылку",
    "setPassword.sent.title": "Проверьте почту",
    "setPassword.sent.explanation":
      "Мы отправили вам ссылку для задания пароля. Она действует один час.",
    "setPassword.profile": "Назад в профиль",

    "changePassword.title": "Изменение пароля",
    "changePassword.currentPassword": "Текущий пароль",
    "changePassword.password": "Новый пароль",
    "changePassword.passwordConfirmation": "Подтвердите пароль",
    "changePassword.forgotPassword": "Забыли пароль?",
    "changePassword.submit": "Изменить пароль",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Это не ваш пароль.",

    "changeEmailAddress.title": "Изменение адреса электронной почты",
    "changeEmailAddress.emailAddress": "Новый адрес электронной почты",
    "changeEmailAddress.currentPassword": "Текущий пароль",
    "changeEmailAddress.submit": "Отправить ссылку для подтверждения",
    "changeEmailAddress.sent.title": "Проверьте почту",
    "changeEmailAddress.sent.explanation":
      "Ссылка для подтверждения переноса отправлена на новый адрес электронной почты. Перейдите по ней, войдя в аккаунт, чтобы перенести аккаунт на этот адрес.",
    "changeEmailAddress.confirm.title": "Перенос аккаунта",
    "changeEmailAddress.confirm.explanation":
      "Ваш аккаунт будет перенесён на {emailAddress}. Отныне вы будете входить с этим адресом.",
    "changeEmailAddress.confirm.submit": "Перенести мой аккаунт",
    "changeEmailAddress.noLongerWorks.title": "Эта ссылка больше не работает",
    "changeEmailAddress.noLongerWorks.explanation":
      "Срок её действия истёк, она уже использована или отправлена не для того аккаунта, в который вы вошли. Запросите её снова в своём профиле.",
    "changeEmailAddress.taken.title": "Ваш аккаунт не перенесён",
    "changeEmailAddress.profile": "Назад в профиль",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Это не ваш пароль.",
    "ChangeEmailAddress.Unchanged": "Ваш аккаунт уже на этом адресе.",
    "ChangeEmailAddress.Taken":
      "У этого адреса электронной почты теперь есть собственный аккаунт, поэтому ваш аккаунт нельзя на него перенести.",

    "confirmEmailAddress.title": "Подтвердите адрес электронной почты",
    "confirmEmailAddress.name": "Имя",
    "confirmEmailAddress.password": "Пароль",
    "confirmEmailAddress.confirmPassword": "Подтвердите пароль",
    "confirmEmailAddress.submit": "Подтвердить адрес электронной почты",
    "confirmEmailAddress.signIn": "Войти",
    "confirmEmailAddress.home": "Вернуться на {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Ваш адрес электронной почты подтверждён",
    "confirmEmailAddress.confirmed.explanation":
      "Ваш аккаунт готов. Войдите с адресом электронной почты и паролем, которые вы только что указали.",
    "confirmEmailAddress.expired.title": "Срок действия ссылки истёк",
    "confirmEmailAddress.expired.explanation":
      "Ссылка для подтверждения адреса электронной почты действует 24 часа. Запросите новую, и она будет отправлена на тот же адрес.",
    "confirmEmailAddress.expired.newLink": "Отправить мне новую ссылку",
    "confirmEmailAddress.noLongerWorks.title": "Эта ссылка больше не работает",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Убедитесь, что вы открыли ссылку из письма целиком, и в её конце ничего не потерялось. Если она всё равно не работает, зарегистрируйтесь заново, и вам отправят новую ссылку.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Этот адрес электронной почты уже подтверждён",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Больше ничего делать не нужно. Войдите с паролем, который вы задали при подтверждении.",

    // A rule broken, keyed by its code. Said beneath the field it reads.
    "PersonName.Missing": "Введите имя.",
    "PersonName.TooShort": "Имя должно содержать не менее 3 символов.",
    "PersonName.TooLong": "Имя может содержать не более 254 символов.",
    "WorldRankingName.TooShort":
      "Имя в мировом рейтинге должно содержать не менее 3 символов.",
    "WorldRankingName.TooLong":
      "Имя в мировом рейтинге может содержать не более 254 символов.",
    "Password.Missing": "Введите пароль.",
    "Password.TooShort": "Пароль должен содержать не менее 12 символов.",
    "Password.ConfirmationDiffers":
      "Это не совпадает с паролем выше. Введите его ещё раз.",
    "Password.Breached":
      "Этот пароль уже встречался в утечке данных в другом месте, поэтому использовать его здесь небезопасно. Выберите другой.",

    "javaScriptRequired.title": "Нужны скрипты",
    "javaScriptRequired.explanation":
      "Для регистрации на этом сайте должны быть включены скрипты, чтобы можно было проверить, что регистрируется человек. Включите их и зарегистрируйтесь снова.",
    "javaScriptRequired.register": "Вернуться к регистрации",
    "javaScriptRequired.home": "Вернуться на {siteName}",

    "errors.backHome": "Вернуться на {siteName}",
    "errors.notFound": "Не найдено",
    "errors.refused": "Это не удалось сделать",
    "errors.refusedDetail": "Что-то в отправленном было неверно.",
    "errors.sorry": "Извините",
    "errors.sorryDetail": "Этот запрос не удалось обработать.",
    "errors.failed": "Что-то пошло не так",
    "errors.reference": "Номер ошибки: {reference}.",
    "errors.recorded":
      "Ошибка записана в журнал, а администратору отправлено письмо. Напишите администратору, указав номер ошибки и описав, что вы делали.",
    "errors.message": "Написать администратору",
    "errors.messageSubject": "Ошибка {reference} на {siteName}",
    "errors.messageBody": "Что я делал, когда это произошло:\n\n",
    "errors.unavailable": "Сайт недоступен",
    "errors.unavailableDetail":
      "Сейчас сайт не может получить то, что ему нужно. Пожалуйста, попробуйте позже.",
    "errors.maintenance": "Сайт закрыт на техническое обслуживание.",
    "errors.maintenanceMinutes":
      "Ожидается, что он заработает через {minutes} мин.",
    "errors.maintenanceMinute": "Ожидается, что он заработает через 1 минуту.",
    "errors.maintenanceLonger":
      "Это занимает больше времени, чем ожидалось, но скоро сайт заработает.",

    // The home page's two lists.
    "home.recentResults": "Недавние результаты",
    "home.recentResults.none": "За последние семь дней игр не добавлено.",
    "home.upcomingTournaments": "Предстоящие турниры",
    "home.upcomingTournaments.none":
      "В ближайшие шестьдесят дней турниров не начинается.",
    "home.allTournaments": "Все турниры {year} года",
    // A year's page.
    "year.heading": "Турниры {year} года",
    "year.none": "В {year} году турниров не начинается.",
    // A sport's page in a year.
    "yearSport.heading": "{sport}: турниры {year} года",
    "yearSport.none": "{sport}: в {year} году турниров не начинается.",
    // A tournament's page.
    "tournament.recent": "Недавние",
    "tournament.summary": "Итоги",
    // A test's grid.
    "test.bestOf": "Каждый матч играется из {count} партий.",
    "test.vs": "против",
    "test.matches": "Матчи",
    "test.games": "Партии",
    "test.hoops": "Воротца",
    "teamSummary.tests": "Тесты",
    "teamSummary.matches": "Матчи",
    "teamSummary.games": "Партии",
    "teamSummary.hoops": "Воротца",
    "teamSummary.wins": "Победы",
    "teamSummary.losses": "Поражения",
    "teamSummary.draws": "Ничьи",
    "teamSummary.for": "За",
    "teamSummary.against": "Против",
    "teamSummary.net": "Разница",
    "tournament.players": "Игроки",
    "search.label": "Поиск",
    "search.tournaments": "Турниры",
    "search.competitions": "Соревнования",
    "search.nothingFound": "Ничего не найдено.",
    "players.search.label": "Поиск игроков",
    "players.search.prompt": "Введите имя игрока, чтобы найти его.",
    "players.search.none": "Игроки не найдены.",
    "search.more":
      "Показаны только первые {count}. Введите больше букв имени, чтобы сузить поиск.",
    "websitePlayer.tournament": "Турнир",
    // A test in a tournament's sections.
    "tournament.test": "{first} против {second}",
    "tournament.notes": "Заметки",
    "tournament.commentary": "Комментарии",
    "tournament.beat": "победил",
    "tournament.drewWith": "сыграл вничью с",
    "tournament.ago.seconds": "{count} с",
    "tournament.ago.minutes": "{count} мин",
    "tournament.ago.hour": "1 час",
    "tournament.ago.hours": "{count} ч",
    "tournament.none": "Игр ещё не сыграно.",
    // A tournament's players' page, when it has none.
    "players.none": "Игроки ещё не добавлены.",
    // A tournament's commentaries page.
    "commentaries.by": "автор:",
    "commentaries.start": "Начать новое обсуждение",
    // The page that starts a commentary.
    "startCommentary.title": "Начать новое обсуждение",
    "startCommentary.titleField": "Заголовок",
    "startCommentary.submit": "Начать обсуждение",
    // Said to a screen reader in place of the red asterisk.
    "marks.new": "новое",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Организаторы ещё не написали заметок.",
    "note.edited": "изменено",
    // A commentary's page.
    "commentary.none": "Комментариев ещё нет.",
    "commentary.edited": "изменено",
    "commentary.edit": "Изменить",
    "commentary.delete": "Удалить",
    "commentary.comment": "Комментарий",
    "commentary.add": "Добавить комментарий",
    "commentary.notSent":
      "Комментарий не удалось отправить. Перезагрузите страницу, чтобы проверить, сохранился ли он.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Изменение заголовка",
    "changeCommentaryTitle.submit": "Сохранить",
    // A comment's own page, and the page that asks before it is deleted.
    "editComment.title": "Изменение комментария",
    "editComment.save": "Сохранить",
    "deleteComment.title": "Удаление комментария",
    "deleteComment.question":
      "Удалить этот комментарий? Это невозможно отменить.",
    "deleteComment.confirm": "Удалить комментарий",
    "deleteComment.keep": "Оставить",
    // A player's page.
    "player.games": "Партии",
    "player.competitions": "Соревнования",
    "player.beat": "победил",
    "player.lostTo": "проиграл",
    "player.drewWith": "сыграл вничью с",
    "player.score": "{score}: {opponent}",
    "player.noGames": "Игр ещё не сыграно.",
    "player.noCompetitions": "Пока не участвует ни в одном соревновании.",
    // A block's page.
    "block.wins": "Победы",
    "block.matches": "Матчи",
    "block.netGames": "Разница партий",
    "block.games": "Партии",
    "block.netHoops": "Разница ворот",
    "block.won": "выиграно",
    "block.lost": "проиграно",
    "block.drawn": "вничью",
    "block.withdrawn": "снялся",
    // A game withdrawn, said otherwise than a player is.
    "block.gameWithdrawn": "снята",
    "block.losses": "Поражения",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Виды",
    "competition.view.grid": "Таблица",
    "competition.view.summary": "Итоги",
    "competition.view.orderOfPlay": "Порядок игр",
    "competition.print": "Печать",
    "blockSummary.ranking":
      "Места определяются долей выигранных матчей, затем разницей ворот. Регламент самого турнира может расставлять игроков иначе.",
    "orderOfPlay.none": "Игр ещё не сыграно.",
    // A knockout's rounds.
    "knockout.round.final": "Финал",
    "knockout.round.semis": "Полуфиналы",
    "knockout.round.quarters": "Четвертьфиналы",
    "knockout.round.number": "Раунд {number}",
    "knockout.bye": "Bye",
    // A Swiss's table.
    "swiss.games": "Партии",
    "swiss.wins": "Победы",
    "swiss.winShare": "% побед",
    "swiss.results": "Результаты",
    // The arrows that scroll a knockout's grid.
    "knockout.onward": "Следующие раунды",
    "knockout.back": "Предыдущие раунды",
    // What every list of tournaments shares.
    "tournamentList.column.date": "Дата",
    "tournamentList.column.name": "Название",
    // A flag, which narrows the lists to its country.
    "tournamentList.onlyIn": "Только турниры: {country}",
    "tournamentList.filter.country": "Страна",
    "tournamentList.filter.anyCountry": "Любая страна",
    "tournamentList.filter.region": "Регион",
    "tournamentList.filter.anyRegion": "Любой регион",
    "tournamentList.filter.noRegionsBefore":
      "У турниров до ноября 2026 года нет региона.",
    "tournamentList.filter.sport": "Вид спорта",
    "tournamentList.filter.anySport": "Любой вид спорта",
    "tournamentList.filter.submit": "Отфильтровать",
    // The years there are tournaments in.
    "years.label": "Годы",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Более ранние годы",

    // The admin's words.
    "admin.newerBuild.message": "Доступна более новая версия этого сайта.",
    "admin.newerBuild.reload": "Перезагрузить",
    "admin.title": "Администрирование",
    "admin.tournaments.new": "Новый турнир",
    "admin.tournaments.none": "Турниров нет",
    "admin.tournaments.filter.none": "Подходящих турниров нет",
    "admin.tournaments.show": "Показать",
    "admin.tournaments.managerScorer": "Организатор/Счётчик",
    "admin.tournaments.worldRanking": "Мировой рейтинг",
    "admin.tournaments.notWorldRanking": "Вне мирового рейтинга",
    // Said to a screen reader.
    "admin.tournaments.archived": "В архиве",
    "admin.tournaments.manage": "Управление",
    "admin.tournaments.edit": "Изменить",
    "admin.tournaments.archive": "В архив",
    "admin.tournaments.restore": "Восстановить",
    "admin.tournaments.scores": "Результаты",
    "admin.tournaments.players": "Игроки",
    "admin.years.label": "Годы",
    "admin.years.earlier": "Более ранние годы",
    "admin.tournament.name": "Название",
    "admin.tournament.starts": "Начало",
    "admin.tournament.finishes": "Окончание",
    "admin.tournament.format": "Формат",
    "admin.tournament.sport": "Вид спорта",
    "admin.tournament.country": "Страна",
    "admin.tournament.region": "Регион",
    "admin.tournament.subtitle": "Подзаголовок",
    "admin.rules.handicap": "Играется с форой",
    "admin.rules.drawsAllowed": "Допускаются ничьи",
    "admin.tournament.levelTestsDrawn": "Равные тесты считаются ничьёй",
    "admin.rules.worldRankings": "Учитывается в мировых рейтингах",
    "admin.tournament.national": "Событие национального уровня",
    "admin.tournament.international": "Событие международного уровня",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Это нельзя принять в таком виде.",
    "admin.newTournament.title": "Новый турнир",
    "admin.newTournament.submit": "Создать турнир",
    "admin.editTournament.title": "Изменение турнира",
    "admin.editTournament.submit": "Обновить турнир",
    "admin.editTournament.otherwise": "Этот турнир нельзя изменить.",
    // A tournament's page, and the tabs.
    "admin.view.tabs": "Турнир",
    "admin.view.players": "Игроки",
    "admin.view.competitions": "Соревнования",
    "admin.view.managers": "Организаторы",
    "admin.view.notes": "Заметки",
    "admin.view.scorers": "Секретари",
    "admin.view.rankings": "Рейтинги",
    "admin.rankings.file":
      "Мировые рейтинги будут использовать результаты турнира с помощью этой функции, и организаторам ничего делать не нужно.",
    "admin.rankings.download": "Скачать партии для мирового рейтинга",
    "rankings.notAvailable": "Рейтинги недоступны",
    "rankings.notAvailable.sport":
      "У вида спорта этого турнира нет мировых рейтингов, поэтому отправлять нечего.",
    "rankings.notAvailable.notCounted":
      "Ни одно соревнование этого турнира не учитывается в мировых рейтингах.",
    "admin.view.otherwise": "Этим турниром нельзя управлять отсюда.",
    // A competition's page, and the tabs.
    "admin.competitionView.tabs": "Соревнование",
    "admin.competitionView.players": "Игроки",
    "admin.competitionView.scores": "Результаты",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "Турнир и его соревнования",
    "admin.sections.tournament": "Турнир",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Страницы администратора",
    "admin.administrator.sections.tournaments": "Турниры",
    "admin.administrator.sections.accounts": "Аккаунты",
    "admin.administrator.sections.worldRankings": "Мировые рейтинги",
    "admin.administrator.sections.importErrors": "Ошибки импорта",
    "admin.administrator.sections.logs": "Журнал",
    "admin.administrator.sections.databaseStatus": "Доступ к базе данных",
    "admin.administrator.sections.countries": "Страны",
    "admin.databaseStatus.title": "Доступ к базе данных",
    "admin.databaseStatus.on": "Доступ к базе данных включён.",
    "admin.databaseStatus.off": "Доступ к базе данных выключен.",
    "admin.databaseStatus.expected":
      "Ожидается, что сайт заработает через {minutes} мин.",
    "admin.databaseStatus.expectedOne":
      "Ожидается, что сайт заработает через 1 минуту.",
    "admin.databaseStatus.longer":
      "Это занимает больше времени, чем ожидалось.",
    "admin.databaseStatus.told": "Читателям сообщается: {words}",
    "admin.databaseStatus.toldUsual": "Читателям сообщается обычная фраза.",
    "admin.databaseStatus.minutes": "Ожидаемое число минут",
    "admin.databaseStatus.words": "Текст для читателей",
    "admin.databaseStatus.turnOff": "Выключить",
    "admin.databaseStatus.change": "Изменить",
    "admin.databaseStatus.turnOn": "Включить",
    "admin.databaseStatus.minutesNeeded": "Нужно указать минуты.",
    "admin.databaseStatus.otherwise": "На сайте что-то пошло не так.",
    "DatabaseAccess.MinutesNotWhole": "Число минут должно быть целым.",
    "DatabaseAccess.MinutesOutOfRange": "Число минут должно быть от 1 до 1440.",
    "DatabaseAccess.WordsTooLong":
      "Текст должен содержать не более 500 символов.",
    "DatabaseAccess.NotOff": "Доступ к базе данных не выключен.",
    "admin.administrator.title": "Администратор",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Аккаунты",
    "admin.roles.add": "Добавить",
    "admin.roles.administrator.heading": "Администраторы",
    "admin.roles.administrator.none": "Других администраторов нет",
    "admin.roles.administrator.removeTitle": "Удаление администратора",
    "admin.roles.administrator.removeExplanation":
      "{name} больше не будет администратором этого сайта.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Ответственные за мировой рейтинг по ассоциационному крокету",
    "admin.roles.ac-world-ranking-officer.none":
      "Нет ответственных за мировой рейтинг по ассоциационному крокету",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Удаление ответственного за мировой рейтинг по ассоциационному крокету",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} больше не будет ответственным за мировой рейтинг по ассоциационному крокету.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Ответственные за мировой рейтинг по гольф-крокету",
    "admin.roles.gc-world-ranking-officer.none":
      "Нет ответственных за мировой рейтинг по гольф-крокету",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Удаление ответственного за мировой рейтинг по гольф-крокету",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} больше не будет ответственным за мировой рейтинг по гольф-крокету.",
    // The page where the world ranking players are imported, and its log.
    "admin.worldRankings.title": "Импорт игроков мирового рейтинга",
    "admin.worldRankings.import": "Импортировать",
    "admin.worldRankings.log": "Как прошёл импорт",
    "admin.worldRankings.ac.reading": "Чтение списка ассоциационного крокета",
    "admin.worldRankings.ac.read":
      "Прочитано игроков ассоциационного крокета: {players}",
    "admin.worldRankings.ac.kept":
      "Сохранено игроков ассоциационного крокета: {players}",
    "admin.worldRankings.ac.refused":
      "Список ассоциационного крокета не удалось прочитать, поэтому его игроки оставлены как были.",
    "admin.worldRankings.gc.reading": "Чтение списка гольф-крокета",
    "admin.worldRankings.gc.read": "Прочитано игроков гольф-крокета: {players}",
    "admin.worldRankings.gc.kept": "Сохранено игроков гольф-крокета: {players}",
    "admin.worldRankings.gc.refused":
      "Список гольф-крокета не удалось прочитать, поэтому его игроки оставлены как были.",
    "admin.worldRankings.finished": "Готово",
    "admin.worldRankings.failed": "Импорт не завершён.",
    "admin.worldRankings.otherwise": "На сайте что-то пошло не так.",
    "WorldRankingLists.Unreachable":
      "Не удалось связаться с сайтом мировых рейтингов.",
    "WorldRankingLists.Unreadable":
      "Список составлен не так, как составляют свои списки мировые рейтинги: одну из строк не удалось прочитать, в списке никого нет или он записан не в UTF-8.",
    // The documents the import from the old sites refused.
    "admin.importErrors.title": "Ошибки импорта",
    "admin.importErrors.none": "Ошибок импорта нет",
    "admin.importErrors.otherwise": "На сайте что-то пошло не так.",
    "admin.countries.title": "Страны",
    "admin.countries.none": "Нет турниров в странах, которых нет в списках",
    "admin.countries.oldSite": "Старый сайт",
    "admin.countries.otherwise": "На сайте что-то пошло не так.",
    "admin.logs.title": "Журнал",
    "admin.logs.severity": "Важность",
    "admin.logs.text": "Найти",
    "admin.logs.show": "Показать",
    "admin.logs.prune": "Очистить",
    "admin.logs.pruneAsk":
      "Удалить журнал за время до последнего часа? Вернуть его будет нельзя.",
    "admin.logs.removed": "Удалено записей: {count}",
    "admin.logs.none": "Записей в журнале нет",
    "admin.logs.otherwise": "На сайте что-то пошло не так.",
    "admin.hover.logs.show": "Показать подходящие записи",
    "admin.hover.logs.prune": "Удалить журнал за время до последнего часа",
    "admin.hover.logs.pruneAgree": "Удалить журнал за время до последнего часа",
    "admin.importError.title": "Ошибка импорта",
    "admin.importError.documentId": "Идентификатор документа",
    "admin.importError.tournament": "Турнир",
    "admin.importError.competition": "Соревнование",
    "admin.importError.newSite": "Новый сайт",
    "admin.importError.oldSite": "Старый сайт",
    "ImportErrorKept.NotFound":
      "Импорт не сохранил ошибки для этого документа.",
    "admin.competitionView.otherwise":
      "Этим соревнованием нельзя управлять отсюда.",
    // The Competitions tab.
    "admin.competitions.block": "Группа",
    "admin.competitions.knockout": "Плей-офф",
    "admin.competitions.swiss": "Швейцарская система",
    "admin.competitions.view": "Открыть",
    "admin.competitions.edit": "Изменить",
    "admin.competitions.up": "Вверх",
    "admin.competitions.down": "Вниз",
    "admin.competitions.archive": "В архив",
    "admin.competitions.restore": "Восстановить",
    "admin.competitions.archived": "Соревнования в архиве",
    "admin.competitions.none": "Соревнований нет",
    "admin.competitions.add": "Добавить соревнование",
    // The competition dialog.
    "admin.competition.addTitle": "Добавление соревнования",
    "admin.competition.editTitle": "Изменение соревнования",
    "admin.competition.name": "Название",
    "admin.competition.kind": "Тип",
    "admin.competition.bestOf": "Партий в матче",
    "admin.competition.rounds": "Туры",
    "admin.competition.places": "Места",
    "admin.competition.round": "Раунд {number}",
    "admin.competition.bestOfs": "Партий в матчах",
    "admin.competition.quarters": "Четвертьфиналы",
    "admin.competition.semis": "Полуфиналы",
    "admin.competition.final": "Финал",
    "admin.competition.add": "Добавить",
    "admin.competition.save": "Сохранить",
    "admin.competition.added": "{name}: добавлено.",
    "admin.competition.otherwise":
      "Это соревнование нельзя сохранить в таком виде.",
    "CompetitionName.Missing": "Введите название.",
    "CompetitionName.TooLong":
      "Название может содержать не более 254 символов.",
    "CompetitionName.NoLetterOrDigit":
      "В названии должна быть буква или цифра.",
    "Tournament.KnockoutPlayerHasGames":
      "У игроков этой сетки есть игры, поэтому её места менять нельзя.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Раунд с решённым матчем нельзя сделать короче.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Раунд нельзя изменить, если в следующем раунде уже сыграна игра.",
    "Tournament.CompetitionNameTaken":
      "Другое соревнование этого турнира уже называется так.",
    "BestOf.NotWhole": "Введите целое число партий.",
    "BestOf.TooSmall": "Матч должен играться как минимум до 1 партии.",
    "Rounds.NotWhole": "Введите целое число туров.",
    "Rounds.TooSmall": "Группа должна играться как минимум в 1 тур.",
    "KnockoutDraw.EvenBestOf":
      "В матче плей-офф должен быть победитель, поэтому он играется до нечётного числа партий.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Создать новый турнир",
    "admin.hover.tournaments.manage":
      "Управлять игроками, командами, соревнованиями и результатами этого турнира",
    "admin.hover.tournaments.edit": "Изменить данные этого турнира",
    "admin.hover.tournaments.scores": "Ввести результаты этого турнира",
    "admin.hover.tournaments.players": "Заниматься игроками этого турнира",
    "admin.hover.competitions.view":
      "Открыть это соревнование, чтобы видеть и вводить его игроков и результаты",
    "admin.hover.tests.view":
      "Открыть этот тест, чтобы видеть и вводить его результаты",
    "admin.hover.teams.view":
      "Открыть эту команду, чтобы видеть её игроков и управлять ими",
    "admin.hover.dialog.player.add": "Добавить этого игрока в турнир",
    "admin.hover.dialog.player.save": "Сохранить изменения этого игрока",
    "admin.hover.dialog.team.add": "Добавить эту команду в турнир",
    "admin.hover.dialog.team.save": "Сохранить изменения этой команды",
    "admin.hover.dialog.test.add": "Добавить этот тест в турнир",
    "admin.hover.dialog.test.save": "Сохранить изменения этого теста",
    "admin.hover.dialog.competition.add": "Добавить это соревнование в турнир",
    "admin.hover.dialog.competition.save":
      "Сохранить изменения этого соревнования",
    "admin.hover.dialog.score.add": "Добавить этот результат в соревнование",
    "admin.hover.dialog.score.save": "Сохранить исправление этого результата",
    "admin.hover.dialog.carryForward.save": "Перенести результаты этого игрока",
    "admin.hover.dialog.tournament.new": "Создать этот турнир",
    "admin.hover.dialog.tournament.edit": "Сохранить изменения этого турнира",
    "admin.hover.modal.cancel": "Закрыть, ничего не сохраняя",
    "admin.hover.modal.ok": "Закрыть это сообщение",
    "admin.hover.tab": "Показать вкладку «{name}»",
    "admin.hover.tournaments.archive":
      "Отправить этот турнир в архив; его можно будет восстановить",
    "admin.hover.tournaments.restore": "Вернуть этот турнир из архива",
    "admin.hover.players.add": "Добавить игрока в этот турнир",
    "admin.hover.players.edit": "Изменить данные этого игрока",
    "admin.hover.players.up": "Переместить этого игрока выше в списке",
    "admin.hover.players.down": "Переместить этого игрока ниже в списке",
    "admin.hover.players.archive":
      "Отправить этого игрока в архив; его можно будет восстановить",
    "admin.hover.players.restore": "Вернуть этого игрока из архива",
    "admin.hover.teams.add": "Добавить команду в этот турнир",
    "admin.hover.teams.edit": "Изменить данные этой команды",
    "admin.hover.teams.up": "Переместить эту команду выше в списке",
    "admin.hover.teams.down": "Переместить эту команду ниже в списке",
    "admin.hover.teams.archive":
      "Отправить эту команду в архив; её можно будет восстановить",
    "admin.hover.teams.restore": "Вернуть эту команду из архива",
    "admin.hover.competitions.add": "Добавить соревнование в этот турнир",
    "admin.hover.competitions.edit": "Изменить данные этого соревнования",
    "admin.hover.competitions.up": "Переместить это соревнование выше в списке",
    "admin.hover.competitions.down":
      "Переместить это соревнование ниже в списке",
    "admin.hover.competitions.archive":
      "Отправить это соревнование в архив; его можно будет восстановить",
    "admin.hover.competitions.restore": "Вернуть это соревнование из архива",
    "admin.hover.tests.add": "Добавить тест между двумя командами",
    "admin.hover.tests.edit": "Изменить данные этого теста",
    "admin.hover.tests.up": "Переместить этот тест выше в списке",
    "admin.hover.tests.down": "Переместить этот тест ниже в списке",
    "admin.hover.tests.archive":
      "Отправить этот тест в архив; его можно будет восстановить",
    "admin.hover.tests.restore": "Вернуть этот тест из архива",
    "admin.hover.tests.toTeams":
      "Перейти на вкладку «Команды», чтобы добавить команды для теста",
    "admin.hover.scores.add": "Добавить результат партии в это соревнование",
    "admin.hover.scores.edit": "Исправить этот результат",
    "admin.hover.scores.archive":
      "Отправить этот результат в архив, чтобы он не учитывался; его можно будет восстановить",
    "admin.hover.scores.restore":
      "Вернуть этот результат из архива, чтобы он снова учитывался",
    "admin.hover.scores.withdraw":
      "Оставить этот результат в списке, но не учитывать его",
    "admin.hover.scores.unwithdraw": "Снова учитывать этот снятый результат",
    "admin.hover.scores.up": "Переместить этот результат раньше в списке",
    "admin.hover.scores.down": "Переместить этот результат позже в списке",
    "admin.hover.competitionPlayers.add":
      "Добавить выбранного игрока в это соревнование",
    "admin.hover.competitionPlayers.up":
      "Переместить этого игрока выше в списке",
    "admin.hover.competitionPlayers.down":
      "Переместить этого игрока ниже в списке",
    "admin.hover.competitionPlayers.remove":
      "Убрать этого игрока из соревнования",
    "admin.hover.competitionPlayers.withdraw":
      "Снять этого игрока с соревнования",
    "admin.hover.competitionPlayers.unwithdraw":
      "Вернуть этого снятого игрока в соревнование",
    "admin.hover.competitionPlayers.carryForward":
      "Перенести результаты этого игрока из другого соревнования",
    "admin.hover.notes.add": "Написать новую заметку для этого турнира",
    "admin.hover.notes.edit": "Изменить эту заметку",
    "admin.hover.notes.delete": "Удалить эту заметку",
    "admin.hover.note.add": "Сохранить эту заметку и добавить её в турнир",
    "admin.hover.note.save": "Сохранить изменения этой заметки",
    "admin.hover.people.add": "Дать этому человеку роль",
    "admin.hover.people.remove": "Забрать роль у этого человека",
    "admin.hover.worldRankings.import":
      "Получить мировые рейтинги и добавить их игроков",
    "admin.modal.cancel": "Отмена",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs.
    "admin.people.emailAddress": "Адрес электронной почты",
    "admin.people.remove": "Удалить",
    "admin.people.otherwise": "Это не удалось сделать.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Вы",
    "admin.managers.add": "Добавить организатора",
    "admin.managers.email": "Написать организаторам",
    "admin.managers.none": "Организаторов нет",
    "admin.managers.removeTitle": "Удаление организатора",
    "admin.managers.removeExplanation":
      "{name} больше не сможет проводить этот турнир.",
    "admin.managers.removeYourself.explanation":
      "Вы больше не сможете проводить этот турнир, и никто здесь не сможет отменить это за вас. Другой организатор может снова сделать вас организатором.",
    "admin.managers.otherwise": "Этот адрес нельзя сделать организатором.",
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Добавить игрока",
    "admin.competitionPlayers.otherwise": "Этого игрока нельзя добавить.",
    "admin.competitionPlayers.choose": "Добавляемый игрок",
    "admin.competitionPlayers.nobody": "Выберите игрока",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Все игроки уже в соревновании",
    "admin.competitionPlayers.none": "Игроков нет",
    "admin.competitionPlayers.up": "Вверх",
    "admin.competitionPlayers.down": "Вниз",
    "admin.competitionPlayers.remove": "Удалить",
    "admin.competitionPlayers.withdraw": "Снять",
    "admin.competitionPlayers.unwithdraw": "Вернуть",
    "admin.competitionPlayers.withdrawn": "Снявшиеся игроки",
    "admin.competitionPlayers.removeTitle": "Удаление игрока",
    "admin.competitionPlayers.removeQuestion":
      "{name} будет убран из соревнования. Это невозможно отменить.",
    "admin.competitionPlayers.withdrawTitle": "Снятие игрока",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} не будет играть в соревновании дальше, а несыгранные им игры будут решены без него.",
    "admin.competitionPlayers.carryForward": "Перенос результатов",
    // The carry forward dialog.
    "admin.carryForward.title": "Перенос результатов - {name}",
    "admin.carryForward.save": "Сохранить",
    "admin.carryForward.otherwise":
      "Этот перенос результатов нельзя сохранить.",
    "admin.carryForward.matchWins": "Выигранные матчи",
    "admin.carryForward.matchLosses": "Проигранные матчи",
    "admin.carryForward.gameWins": "Выигранные партии",
    "admin.carryForward.gameLosses": "Проигранные партии",
    "admin.carryForward.hoopsFor": "Ворот за",
    "admin.carryForward.hoopsAgainst": "Ворот против",
    "CarryForward.MatchWinsNotWhole": "Введите целое число выигранных матчей.",
    "CarryForward.MatchWinsBelowZero":
      "Введите 0 или больше выигранных матчей.",
    "CarryForward.MatchLossesNotWhole":
      "Введите целое число проигранных матчей.",
    "CarryForward.MatchLossesBelowZero":
      "Введите 0 или больше проигранных матчей.",
    "CarryForward.GameWinsNotWhole": "Введите целое число выигранных партий.",
    "CarryForward.GameWinsBelowZero": "Введите 0 или больше выигранных партий.",
    "CarryForward.GameLossesNotWhole":
      "Введите целое число проигранных партий.",
    "CarryForward.GameLossesBelowZero":
      "Введите 0 или больше проигранных партий.",
    "CarryForward.HoopsForNotWhole": "Введите целое число ворот за.",
    "CarryForward.HoopsForBelowZero": "Введите 0 или больше ворот за.",
    "CarryForward.HoopsAgainstNotWhole": "Введите целое число ворот против.",
    "CarryForward.HoopsAgainstBelowZero": "Введите 0 или больше ворот против.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Добавить результат",
    "admin.scores.none": "Результатов нет",
    "admin.scores.edit": "Изменить",
    "admin.scores.drawNotFilledTitle": "Сетка не заполнена",
    "admin.scores.archive": "В архив",
    "admin.scores.up": "Вверх",
    "admin.scores.down": "Вниз",
    "admin.scores.restore": "Восстановить",
    "admin.scores.archived": "Результаты в архиве",
    "admin.scores.archivedSaid": "В архиве",
    "admin.scores.withdraw": "Снять",
    "admin.scores.unwithdraw": "Вернуть",
    "admin.scores.withdrawnSaid": "Снят",
    "admin.scores.otherwise": "Это не удалось сделать.",
    "admin.score.title": "Добавление результата",
    "admin.score.add": "Добавить партию",
    "admin.score.winner": "Победитель",
    "admin.score.winnerScore": "Счёт победителя",
    "admin.score.loser": "Проигравший",
    "admin.score.loserScore": "Счёт проигравшего",
    "admin.score.beat": "победил",
    "admin.score.added":
      "Партия, в которой {winner} победил {loser}, добавлена.",
    "admin.score.otherwise": "Партию не удалось добавить.",
    "admin.score.correctTitle": "Изменение результата",
    "admin.score.save": "Сохранить",
    "admin.score.notCorrected": "Результат не удалось исправить.",
    "Game.WinnerMissing": "Выберите победителя.",
    "Game.WinnerScoreMissing": "Введите счёт победителя.",
    "Game.LoserMissing": "Выберите проигравшего.",
    "Game.LoserScoreMissing": "Введите счёт проигравшего.",
    "Score.NoPoints": "Счёт должен начинаться с числа очков.",
    "Game.SamePlayer": "Игрок не может играть сам с собой.",
    "Game.WinnerNotAhead":
      "Счёт победителя должен быть больше счёта проигравшего или отмечен как победный.",
    "Game.LoserMarked": "Счёт проигравшего нельзя отметить как победный.",
    "Game.ResultChanged":
      "Исправление сохраняет результат: выигранная партия остаётся выигранной, а сыгранная вничью остаётся ничьей.",
    "Competition.MatchDecided": "Их матч уже решён.",
    "Competition.DrawFull":
      "Игрока нельзя добавить, потому что сетка плей-офф заполнена.",
    "Competition.DrawNotFilled":
      "Результаты нельзя добавлять, пока каждое место в сетке плей-офф не занято игроком или Bye.",
    "Competition.ByeOutsideKnockout": "Bye бывает только в плей-офф.",
    "Competition.NotDrawnToMeet":
      "Эти игроки сейчас не должны играть друг с другом в плей-офф.",
    "Competition.WinnerHasPlayedOn":
      "Победитель этого матча уже сыграл свою следующую игру, поэтому изменить, кто победил, нельзя.",
    "CompetitionPlayer.Withdrawn": "Снявшийся игрок больше не играет.",
    "admin.players.add": "Добавить игрока",
    "admin.players.none": "Игроков нет",
    "admin.players.edit": "Изменить",
    "admin.players.archive": "В архив",
    "admin.players.restore": "Восстановить",
    "admin.players.up": "Вверх",
    "admin.players.down": "Вниз",
    // Asked before archiving a player who is in competitions.
    "admin.players.archiveTitle": "Архивирование игрока",
    "admin.players.archiveQuestion": "{name} будет убран из этих соревнований:",
    "admin.players.archive.explanation":
      "При восстановлении игрок не вернётся в эти соревнования.",
    "admin.players.archived": "Игроки в архиве",
    "admin.players.archivedSaid": "В архиве",
    // The player dialog.
    "admin.player.addTitle": "Добавление игрока",
    "admin.player.editTitle": "Изменение игрока",
    "admin.player.name": "Имя",
    "admin.player.representing": "Представляет",
    "admin.player.worldRankingName": "Имя игрока в мировом рейтинге",
    "admin.player.worldRankingKnown": "Мировой рейтинг знает это имя.",
    "admin.player.worldRankingQuestioned":
      "В мировом рейтинге нет игрока с таким именем. Возможно, оно написано с ошибкой или игрок новичок в рейтинге.",
    "admin.player.flag": "Флаг",
    "admin.player.add": "Добавить",
    "admin.player.save": "Сохранить",
    "admin.player.added": "{name}: добавлено.",
    "admin.player.otherwise": "Этого игрока нельзя сохранить в таком виде.",
    "Tournament.PlayerNameTaken":
      "Другой игрок этого турнира уже носит такое имя.",
    "TournamentPlayer.NoSuchFlag": "Выберите один из имеющихся флагов.",
    "TournamentPlayer.NamedBye": "Игрока нельзя назвать Bye.",
    "TournamentPlayer.NoLetterOrDigit": "В имени должна быть буква или цифра.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Bye добавлять не нужно",
    "admin.player.byes":
      "Bye не входит в число игроков турнира. Плей-офф предлагает Bye всякий раз при добавлении игроков, столько раз, сколько нужно его сетке.",
    // A tournament played by teams.
    "admin.view.teams": "Команды",
    "admin.view.tests": "Тесты",
    "admin.teams.add": "Добавить команду",
    "admin.teams.none": "Команд нет",
    "admin.teams.edit": "Изменить",
    "admin.teams.view": "Открыть",
    "admin.teams.archive": "В архив",
    "admin.teams.restore": "Восстановить",
    "admin.teams.up": "Вверх",
    "admin.teams.down": "Вниз",
    "admin.teams.archived": "Команды в архиве",
    "admin.teams.archivedSaid": "В архиве",
    "admin.team.addTitle": "Добавление команды",
    "admin.team.editTitle": "Изменение команды",
    "admin.team.name": "Название",
    "admin.team.shortName": "Краткое название",
    "admin.team.shortName.explanation":
      "Так называются тесты команды, например AUS v ENG.",
    "admin.team.flag": "Флаг",
    "admin.team.add": "Добавить",
    "admin.team.save": "Сохранить",
    "admin.team.added": "{name}: добавлено.",
    "admin.team.otherwise": "Эту команду нельзя сохранить в таком виде.",
    "admin.teamView.otherwise": "Эту команду нельзя просмотреть отсюда.",
    "admin.teamView.players": "Игроки",
    "TeamName.Missing": "Укажите название команды.",
    "TeamName.TooLong": "Это название слишком длинное.",
    "admin.notes.add": "Добавить заметку",
    "admin.notes.none": "Заметок нет",
    "admin.notes.edit": "Изменить",
    "admin.notes.delete": "Удалить",
    // Asked before deleting a note.
    "admin.notes.deleteTitle": "Удаление заметки",
    "admin.notes.deleteQuestion": "Удалить заметку «{title}»?",
    "admin.notes.delete.explanation":
      "Удалённая заметка исчезает навсегда, и вернуть её нельзя.",
    "admin.notes.otherwise": "Это не удалось сделать.",
    // The note dialog.
    "admin.note.addTitle": "Добавление заметки",
    "admin.note.editTitle": "Изменение заметки",
    "admin.note.title": "Заголовок",
    "admin.note.description": "Описание",
    "admin.note.write": "Текст",
    "admin.note.preview": "Просмотр",
    "admin.note.toolbar": "Форматирование",
    "admin.note.tool.heading": "Заголовок",
    "admin.note.tool.bold": "Полужирный",
    "admin.note.tool.italic": "Курсив",
    "admin.note.tool.quote": "Цитата",
    "admin.note.tool.code": "Код",
    "admin.note.tool.link": "Ссылка",
    "admin.note.tool.numberedList": "Нумерованный список",
    "admin.note.tool.bulletedList": "Маркированный список",
    "admin.note.tool.taskList": "Список задач",
    "admin.note.add": "Добавить",
    "admin.note.save": "Сохранить",
    "admin.note.otherwise": "Эту заметку нельзя сохранить в таком виде.",
    "ManagerNoteTitle.Missing": "Дайте заметке заголовок.",
    "ManagerNoteTitle.TooLong": "Этот заголовок слишком длинный.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "В заголовке должна быть буква или цифра.",
    "ManagerNoteDescription.TooLong": "Это описание слишком длинное.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Этой заметки больше нет. Возможно, её удалил другой организатор.",
    "EditManagerNote.NoSuchManagerNote":
      "Этой заметки больше нет. Возможно, её удалил другой организатор.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Этой заметки больше нет. Возможно, её удалил другой организатор.",
    "ManagerNote.Deleted":
      "Эта заметка удалена. Возможно, её удалил другой организатор.",
    "CommentaryTitle.Missing": "Дайте обсуждению заголовок.",
    "CommentaryTitle.TooLong": "Этот заголовок слишком длинный.",
    "CommentaryTitle.NoLetterOrDigit":
      "В заголовке должна быть буква или цифра.",
    "Commentary.TitleTaken": "Другое обсуждение уже имеет такой заголовок.",
    "CommentText.Missing": "Напишите что-нибудь в комментарии.",
    "CommentText.TooLong": "Этот комментарий слишком длинный.",
    "TeamShortName.Missing": "Дайте команде краткое название.",
    "TeamShortName.TooLong":
      "Краткое название может содержать не более 10 символов.",
    "TeamShortName.NoLetterOrDigit":
      "В кратком названии должна быть буква или цифра.",
    "Team.ShortNameLongerThanName":
      "Краткое название не может быть длиннее названия команды.",
    "Team.NoSuchFlag": "Выберите один из имеющихся флагов.",
    "Team.Archived": "Эта команда в архиве; сначала её нужно восстановить.",
    "Team.InATest": "Эта команда играет в тесте, и её нельзя архивировать.",
    "Team.PlayerNameTaken": "Другой игрок этой команды уже носит такое имя.",
    "TeamPlayer.NamedBye": "Игрока нельзя назвать Bye.",
    "TeamPlayer.Archived":
      "Этот игрок в архиве; сначала его нужно восстановить.",
    "TeamPlayer.HasGames": "Этот игрок уже играл, и его нельзя архивировать.",
    "Tournament.TeamNameTaken":
      "Другая команда этого турнира уже называется так.",
    "Tournament.TeamShortNameTaken":
      "У другой команды этого турнира уже такое краткое название.",
    "Tournament.NoSuchTeam": "В этом турнире нет команды по этому адресу.",
    "Tournament.TeamArchived":
      "Эта команда в архиве, и восстановить её можно только на вкладке «Команды».",
    "admin.tests.add": "Добавить тест",
    "admin.tests.none": "Тестов нет",
    "admin.tests.edit": "Изменить",
    "admin.tests.view": "Открыть",
    "admin.tests.archive": "В архив",
    "admin.tests.restore": "Восстановить",
    "admin.tests.up": "Вверх",
    "admin.tests.down": "Вниз",
    "admin.tests.archived": "Тесты в архиве",
    "admin.tests.twoTeamsNeeded":
      "Тест проходит между двумя командами, поэтому сначала нужны две команды.",
    "admin.tests.toTeams": "Перейти к командам",
    "admin.tests.matches.one": "{count} матч",
    "admin.tests.matches.other": "Матчей: {count}",
    "admin.tests.bestOf": "из {games} партий",
    "admin.tests.otherwise": "Это не удалось сделать.",
    "admin.test.addTitle": "Добавление теста",
    "admin.test.editTitle": "Изменение теста",
    "admin.test.firstTeam": "Команда A",
    "admin.test.secondTeam": "Команда B",
    "admin.test.versus": "v",
    "admin.test.starts": "Начало",
    "admin.test.finishes": "Окончание",
    "admin.test.expectedMatches": "Ожидаемое число матчей",
    "admin.test.bestOf": "Партий в матче",
    "admin.test.group": "Группа",
    "admin.test.add": "Добавить",
    "admin.test.save": "Сохранить",
    "admin.test.added": "{name}: добавлено.",
    "admin.test.otherwise": "Этот тест нельзя сохранить в таком виде.",
    "admin.testView.otherwise": "Этот тест нельзя просмотреть отсюда.",
    "AddTest.FirstTeamMissing": "Выберите первую команду.",
    "AddTest.SecondTeamMissing": "Выберите вторую команду.",
    "UpdateTest.FirstTeamMissing": "Выберите первую команду.",
    "UpdateTest.SecondTeamMissing": "Выберите вторую команду.",
    "ExpectedMatches.NotWhole": "Введите целое число матчей.",
    "ExpectedMatches.TooSmall": "В тесте должен ожидаться как минимум 1 матч.",
    "TestGroup.TooLong": "Эта группа слишком длинная.",
    "Tournament.TestAgainstItself": "Команда не играет тест сама с собой.",
    "Tournament.TestFinishesBeforeStarts":
      "Тест не может закончиться раньше, чем начнётся.",
    "Tournament.TestStartsBeforeTournament":
      "Тест не может начаться раньше своего турнира.",
    "Tournament.TestFinishesAfterTournament":
      "Тест не может закончиться позже своего турнира.",
    "Tournament.TestHasGamesInUse":
      "В этом тесте есть игры, поэтому его нельзя архивировать, пока они не заархивированы.",
    "Tournament.TestHasGames":
      "В этом тесте уже есть игры, поэтому его команды больше нельзя менять.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Начато уже больше матчей, чем это число.",
    "Tournament.BestOfBelowGamesPlayed":
      "Два игрока уже сыграли больше партий, чем это число.",
    "Competition.ExpectedMatchesReached":
      "В этом тесте начато столько матчей, сколько в нём ожидается.",
    "Competition.SameTeam": "Два игрока одной команды не играют друг с другом.",
    "AddManager.NoSuchAccount":
      "У этого адреса нет аккаунта, который можно сделать организатором.",
    "admin.scorers.add": "Добавить секретаря",
    "admin.scorers.none": "Секретарей нет",
    "admin.scorers.removeTitle": "Удаление секретаря",
    "admin.scorers.removeExplanation":
      "{name} больше не сможет вводить результаты этого турнира.",
    "admin.scorers.otherwise": "Этот адрес нельзя сделать секретарём.",
    "AddScorer.NoSuchAccount":
      "У этого адреса нет аккаунта, который можно сделать секретарём.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Это может сделать только администратор.",
    "AddRole.NoSuchAccount":
      "У этого адреса нет аккаунта, которому можно дать роль.",
    "AddRole.NoSuchRole": "Такой роли нет.",
    "RemoveRole.NoSuchAccount": "Такого аккаунта нет.",
    "RemoveRole.NoSuchRole": "Такой роли нет.",
    "RemoveRole.Yourself": "Вы не можете забрать у себя роль администратора.",
    "AccountsWithRole.NoSuchRole": "Такой роли нет.",
    "Tournament.AlreadyAManager":
      "Этот аккаунт уже управляет турниром и может делать всё, что может секретарь.",

    // A tournament's refusals.
    "TournamentName.Missing": "Укажите название турнира.",
    "TournamentName.TooShort": "Это название слишком короткое.",
    "TournamentName.TooLong": "Это название слишком длинное.",
    "TournamentName.AllLowerCase":
      "Название не может быть целиком из строчных букв.",
    "TournamentName.AllCapitals":
      "Название не может быть целиком из заглавных букв.",
    "TournamentName.NoLetterOrDigit": "В названии должна быть буква или цифра.",
    "ReadOnlyDate.Unreadable": "Укажите день.",
    "Tournament.FinishesBeforeStarts":
      "Турнир не может закончиться раньше, чем начнётся.",
    "Tournament.StartsAfterNextYear":
      "Турнир не может начаться позже следующего года.",
    "Tournament.FinishesAfterNextYear":
      "Турнир не может закончиться позже следующего года.",
    "CreateTournament.NoSuchCountry": "Выберите страну.",
    "TournamentSubtitle.TooLong":
      "Подзаголовок не может быть длиннее 2000 символов.",
    "Tournament.NotAManager":
      "Изменить этот турнир может только его организатор.",
    "Tournament.NotAManagerOrScorer":
      "Видеть этот турнир может только его организатор или секретарь.",
    "Tournament.Archived":
      "Этот турнир в архиве; чтобы его изменить, сначала нужно его восстановить.",
    "UpdateTournament.NoSuchTournament": "По этому адресу нет турнира.",

    // What a tournament is played in and where, by code.
    "sport.ac": "Ассоциационный крокет",
    "sport.gc": "Гольф-крокет",
    "sport.a6w": "Американский крокет на 6 воротах",
    "sport.rc": "Рикошет",
    "sport.gb": "Гейтбол",
    "format.standard": "Стандартный",
    "format.teams": "Командный",
    "format.eire-cup": "Кубок Эйре",
    "format.interstate-shield": "Межштатный щит",
    "format.gc-world-team-championship":
      "Командный чемпионат мира по гольф-крокету",
    "country.ad": "Андорра",
    "country.ae": "Объединённые Арабские Эмираты",
    "country.af": "Афганистан",
    "country.ag": "Антигуа и Барбуда",
    "country.ai": "Ангилья",
    "country.al": "Албания",
    "country.am": "Армения",
    "country.ao": "Ангола",
    "country.ar": "Аргентина",
    "country.as": "Американское Самоа",
    "country.at": "Австрия",
    "country.au": "Австралия",
    "country.aw": "Аруба",
    "country.ax": "Аландские острова",
    "country.az": "Азербайджан",
    "country.ba": "Босния и Герцеговина",
    "country.bb": "Барбадос",
    "country.bd": "Бангладеш",
    "country.be": "Бельгия",
    "country.bf": "Буркина-Фасо",
    "country.bg": "Болгария",
    "country.bh": "Бахрейн",
    "country.bi": "Бурунди",
    "country.bj": "Бенин",
    "country.bm": "Бермудские острова",
    "country.bn": "Бруней",
    "country.bo": "Боливия",
    "country.br": "Бразилия",
    "country.bs": "Багамские острова",
    "country.bt": "Бутан",
    "country.bv": "Остров Буве",
    "country.bw": "Ботсвана",
    "country.by": "Беларусь",
    "country.bz": "Белиз",
    "country.ca": "Канада",
    "country.catalonia": "Каталония",
    "country.cc": "Кокосовые острова",
    "country.cd": "Демократическая Республика Конго",
    "country.cf": "Центральноафриканская Республика",
    "country.cg": "Республика Конго",
    "country.ch": "Швейцария",
    "country.ci": "Кот-д’Ивуар",
    "country.ck": "Острова Кука",
    "country.cl": "Чили",
    "country.cm": "Камерун",
    "country.cn": "Китай",
    "country.co": "Колумбия",
    "country.cr": "Коста-Рика",
    "country.cu": "Куба",
    "country.cv": "Кабо-Верде",
    "country.cx": "Остров Рождества",
    "country.cy": "Кипр",
    "country.cz": "Чехия",
    "country.de": "Германия",
    "country.dj": "Джибути",
    "country.dk": "Дания",
    "country.dm": "Доминика",
    "country.do": "Доминиканская Республика",
    "country.dz": "Алжир",
    "country.ec": "Эквадор",
    "country.ee": "Эстония",
    "country.eg": "Египет",
    "country.eh": "Западная Сахара",
    "country.england": "Англия",
    "country.er": "Эритрея",
    "country.es": "Испания",
    "country.et": "Эфиопия",
    "country.fi": "Финляндия",
    "country.fj": "Фиджи",
    "country.fk": "Фолклендские острова",
    "country.fm": "Микронезия",
    "country.fo": "Фарерские острова",
    "country.fr": "Франция",
    "country.ga": "Габон",
    "country.gb": "Великобритания",
    "country.gd": "Гренада",
    "country.ge": "Грузия",
    "country.gf": "Французская Гвиана",
    "country.gh": "Гана",
    "country.gi": "Гибралтар",
    "country.gl": "Гренландия",
    "country.gm": "Гамбия",
    "country.gn": "Гвинея",
    "country.gp": "Гваделупа",
    "country.gq": "Экваториальная Гвинея",
    "country.gr": "Греция",
    "country.gs": "Южная Георгия и Южные Сандвичевы острова",
    "country.gt": "Гватемала",
    "country.gu": "Гуам",
    "country.gw": "Гвинея-Бисау",
    "country.gy": "Гайана",
    "country.hk": "Гонконг",
    "country.hm": "Остров Херд и острова Макдональд",
    "country.hn": "Гондурас",
    "country.hr": "Хорватия",
    "country.ht": "Гаити",
    "country.hu": "Венгрия",
    "country.id": "Индонезия",
    "country.ie": "Ирландия",
    "country.il": "Израиль",
    "country.im": "Остров Мэн",
    "country.in": "Индия",
    "country.io": "Британская территория в Индийском океане",
    "country.iq": "Ирак",
    "country.ir": "Иран",
    "country.is": "Исландия",
    "country.it": "Италия",
    "country.je": "Джерси",
    "country.jm": "Ямайка",
    "country.jo": "Иордания",
    "country.jp": "Япония",
    "country.ke": "Кения",
    "country.kg": "Киргизия",
    "country.kh": "Камбоджа",
    "country.ki": "Кирибати",
    "country.km": "Коморы",
    "country.kn": "Сент-Китс и Невис",
    "country.kp": "Северная Корея",
    "country.kr": "Южная Корея",
    "country.kw": "Кувейт",
    "country.ky": "Острова Кайман",
    "country.kz": "Казахстан",
    "country.la": "Лаос",
    "country.lb": "Ливан",
    "country.lc": "Сент-Люсия",
    "country.li": "Лихтенштейн",
    "country.lk": "Шри-Ланка",
    "country.lr": "Либерия",
    "country.ls": "Лесото",
    "country.lt": "Литва",
    "country.lu": "Люксембург",
    "country.lv": "Латвия",
    "country.ly": "Ливия",
    "country.ma": "Марокко",
    "country.mc": "Монако",
    "country.md": "Молдова",
    "country.me": "Черногория",
    "country.mg": "Мадагаскар",
    "country.mh": "Маршалловы Острова",
    "country.mk": "Северная Македония",
    "country.ml": "Мали",
    "country.mm": "Мьянма",
    "country.mn": "Монголия",
    "country.mo": "Макао",
    "country.mp": "Северные Марианские острова",
    "country.mq": "Мартиника",
    "country.mr": "Мавритания",
    "country.ms": "Монтсеррат",
    "country.mt": "Мальта",
    "country.mu": "Маврикий",
    "country.mv": "Мальдивы",
    "country.mw": "Малави",
    "country.mx": "Мексика",
    "country.my": "Малайзия",
    "country.mz": "Мозамбик",
    "country.na": "Намибия",
    "country.nc": "Новая Каледония",
    "country.ne": "Нигер",
    "country.nf": "Остров Норфолк",
    "country.ng": "Нигерия",
    "country.ni": "Никарагуа",
    "country.nl": "Нидерланды",
    "country.no": "Норвегия",
    "country.np": "Непал",
    "country.nr": "Науру",
    "country.nu": "Ниуэ",
    "country.nz": "Новая Зеландия",
    "country.om": "Оман",
    "country.pa": "Панама",
    "country.pe": "Перу",
    "country.pf": "Французская Полинезия",
    "country.pg": "Папуа — Новая Гвинея",
    "country.ph": "Филиппины",
    "country.pk": "Пакистан",
    "country.pl": "Польша",
    "country.pm": "Сен-Пьер и Микелон",
    "country.pn": "Острова Питкэрн",
    "country.pr": "Пуэрто-Рико",
    "country.ps": "Палестина",
    "country.pt": "Португалия",
    "country.pw": "Палау",
    "country.py": "Парагвай",
    "country.qa": "Катар",
    "country.re": "Реюньон",
    "country.ro": "Румыния",
    "country.rs": "Сербия",
    "country.ru": "Россия",
    "country.rw": "Руанда",
    "country.sa": "Саудовская Аравия",
    "country.sb": "Соломоновы Острова",
    "country.sc": "Сейшельские Острова",
    "country.scotland": "Шотландия",
    "country.sd": "Судан",
    "country.se": "Швеция",
    "country.sg": "Сингапур",
    "country.sh": "Остров Святой Елены",
    "country.si": "Словения",
    "country.sj": "Шпицберген и Ян-Майен",
    "country.sk": "Словакия",
    "country.sl": "Сьерра-Леоне",
    "country.sm": "Сан-Марино",
    "country.sn": "Сенегал",
    "country.so": "Сомали",
    "country.sr": "Суринам",
    "country.st": "Сан-Томе и Принсипи",
    "country.sv": "Сальвадор",
    "country.sy": "Сирия",
    "country.sz": "Эсватини",
    "country.tc": "Острова Тёркс и Кайкос",
    "country.td": "Чад",
    "country.tf": "Французские Южные территории",
    "country.tg": "Того",
    "country.th": "Таиланд",
    "country.tj": "Таджикистан",
    "country.tk": "Токелау",
    "country.tl": "Восточный Тимор",
    "country.tm": "Туркменистан",
    "country.tn": "Тунис",
    "country.to": "Тонга",
    "country.tr": "Турция",
    "country.tt": "Тринидад и Тобаго",
    "country.tv": "Тувалу",
    "country.tw": "Тайвань",
    "country.tz": "Танзания",
    "country.ua": "Украина",
    "country.ug": "Уганда",
    "country.um": "Внешние малые острова США",
    "country.us": "Соединённые Штаты Америки",
    "country.uy": "Уругвай",
    "country.uz": "Узбекистан",
    "country.va": "Ватикан",
    "country.vc": "Сент-Винсент и Гренадины",
    "country.ve": "Венесуэла",
    "country.vg": "Британские Виргинские острова",
    "country.vi": "Виргинские острова США",
    "country.vn": "Вьетнам",
    "country.vu": "Вануату",
    "country.wales": "Уэльс",
    "country.wf": "Уоллис и Футуна",
    "country.ws": "Самоа",
    "country.ye": "Йемен",
    "country.yt": "Майотта",
    "country.za": "Южная Африка",
    "country.zm": "Замбия",
    "country.zw": "Зимбабве",

    // An email is two entries: its subject, and its body, which is the whole of
    // its markup. Placeholders and markup stay exactly as in English.

    "Email.ConfirmAddress.subject":
      "Подтвердите адрес электронной почты для {siteName}",
    "Email.ConfirmAddress.body": `
<p>Здравствуйте!</p>

<p>
    Спасибо, что создали аккаунт на <strong>{siteName}</strong>.<br />
    Прежде чем начать пользоваться аккаунтом, подтвердите адрес электронной почты,
    нажав кнопку ниже:
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
        Подтвердить адрес электронной почты
    </a>
</p>

<p>
    Если кнопка не работает, вы можете подтвердить адрес электронной почты, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Если вы не создавали этот аккаунт, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Новая ссылка для подтверждения адреса электронной почты для {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Здравствуйте!</p>

<p>
    Недавно вы запросили новое письмо для подтверждения адреса электронной почты для <strong>{siteName}</strong>.<br />
    Подтвердите адрес электронной почты, нажав кнопку ниже:
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
        Подтвердить адрес электронной почты
    </a>
</p>

<p>
    Если кнопка не работает, вы можете подтвердить адрес электронной почты, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    После подтверждения вы сможете продолжить пользоваться аккаунтом без перерыва.
</p>

<p>
    Если вы не запрашивали это письмо, просто проигнорируйте его.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Кто-то пытался зарегистрироваться с вашим адресом электронной почты",
    "Email.AlreadyRegistered.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то пытался зарегистрироваться на <strong>{siteName}</strong> с этим адресом электронной почты, у которого уже есть аккаунт. В вашем аккаунте ничего не изменилось.<br />
    Если это были вы, то аккаунт у вас уже есть, и вы можете войти в него:
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
        Войти
    </a>
</p>

<p>
    Если вы забыли пароль, вы можете сбросить его здесь:
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
        Забыли пароль
    </a>
</p>

<p>
    Если это были не вы, ничего делать не нужно. Никто не получил доступа к вашему аккаунту.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Подтвердите перенос вашего аккаунта {siteName} на этот адрес",
    "Email.ConfirmNewEmailAddress.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то, войдя в аккаунт <strong>{siteName}</strong>, попросил перенести его на этот адрес электронной почты. Если это были вы, подтвердите перенос здесь, войдя в этот аккаунт. Ссылка действует 24 часа.
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
        Перенести мой аккаунт
    </a>
</p>

<p>
    Или скопируйте этот адрес в браузер:<br />
    {link}
</p>

<p>
    Если это были не вы, ничего делать не нужно. Ни один аккаунт сюда не будет перенесён.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Кто-то попросил перенести аккаунт на ваш адрес электронной почты",
    "Email.AlreadyHasAnAccount.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то, войдя в аккаунт <strong>{siteName}</strong>, попросил перенести его на этот адрес электронной почты, у которого уже есть собственный аккаунт. Ничего не перенесено, и в вашем аккаунте ничего не изменилось.
</p>

<p>
    Если это были вы, то аккаунт по этому адресу у вас уже есть, и вы можете в него войти.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Ваш аккаунт {siteName} перенесён",
    "Email.EmailAddressChanged.body": `
<p>Здравствуйте!</p>

<p>
    Ваш аккаунт <strong>{siteName}</strong> только что перенесён на другой адрес электронной почты, {emailAddress}, и теперь вход выполняется с этим адресом.
</p>

<p>
    Если это были не вы, ваш аккаунт у кого-то другого. Ответьте на это письмо и сообщите нам.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Пароль вашего аккаунта {siteName} изменён",
    "Email.PasswordChanged.body": `
<p>Здравствуйте!</p>

<p>
    Пароль вашего аккаунта <strong>{siteName}</strong> только что изменён, а все остальные браузеры, в которых выполнен вход, вышли из аккаунта.<br />
    Если это были вы, ничего делать не нужно.
</p>

<p>
    Если это были не вы, ваш пароль знает кто-то другой. Задайте новый здесь, и этот человек будет выведен из аккаунта:
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
        Забыли пароль
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Задайте новый пароль для {siteName}",
    "Email.SetNewPassword.body": `
<p>Здравствуйте!</p>

<p>
    Недавно вы запросили сброс пароля для <strong>{siteName}</strong>.<br />
    Сбросить пароль можно, нажав кнопку ниже:
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
        Сбросить пароль
    </a>
</p>

<p>
    Если кнопка не работает, вы можете сбросить пароль, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Задайте пароль для {siteName}",
    "Email.SetPassword.body": `
<p>Здравствуйте!</p>

<p>
    У вашего аккаунта <strong>{siteName}</strong> нет пароля: вы входите через Google.<br />
    Вы попросили задать его, чтобы входить ещё и по адресу электронной почты и паролю.
    Задать пароль можно, нажав кнопку ниже:
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
        Задать пароль
    </a>
</p>

<p>
    Если кнопка не работает, вы можете задать пароль, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ссылка действует один час. Если вы не просили задавать пароль, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Для этого адреса электронной почты нет аккаунта {siteName}",
    "Email.RegisterInstead.body": `
<p>Здравствуйте!</p>

<p>
    Был запрошен сброс пароля для адреса электронной почты, который не связан ни с одним аккаунтом на <strong>{siteName}</strong>.
</p>

<p>
    Если вы хотите пользоваться нашим сервисом, вы можете создать новый аккаунт, перейдя по адресу:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Если вы не делали этот запрос, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Подтвердите, что ваш аккаунт {siteName} нужно забыть",
    "Email.ConfirmForgetting.body": `
<p>Здравствуйте!</p>

<p>
    Вы попросили забыть ваш аккаунт <strong>{siteName}</strong>.<br />
    Нажмите кнопку ниже, чтобы увидеть, что это значит, и твёрдо подтвердить своё желание:
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
        Забыть мой аккаунт
    </a>
</p>

<p>
    Если кнопка не работает, вы можете открыть эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    После этого ваши имя и адрес электронной почты больше никто и никогда не сможет прочитать, а войти в аккаунт будет нельзя. Это невозможно отменить.
</p>

<p>
    Ссылка срабатывает один раз, в течение 15 минут после вашего запроса, и только пока вы вошли в этот аккаунт. После этого запросите её снова из своего аккаунта.
</p>

<p>
    Если вы не просили об этом, ничего не произойдёт, пока по ссылке не перейдут. Но запрос отправил кто-то, вошедший в ваш аккаунт, поэтому задайте новый пароль на странице «Забыли пароль», чтобы он наверняка не смог войти снова.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Регистрация приостановлена: {service} недоступен",
    "Email.RegistrationsSuspended.body": `
<p>Здравствуйте!</p>

<p>
    {siteName} не удалось связаться с {service} в {when}. Пока он не ответит, читателям, которым он нужен для регистрации или задания нового пароля, предлагается попробовать позже.
</p>

<p>
    Ничего снимать не нужно. Каждая попытка обращается к {service} заново, и страницы заработают, как только он ответит.
</p>

<p>
    Пока {service} недоступен, письмо об этом будет приходить не чаще раза в час.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} не может связаться со своей базой данных",
    "Email.DatabaseUnreachable.body": `
<p>Здравствуйте!</p>

<p>
    {siteName} не удалось связаться со своей базой данных в {when}. Пока она не ответит, каждая страница, которой она нужна, сообщает читателям, что сайт недоступен и нужно попробовать позже.
</p>

<p>
    Ничего снимать не нужно. Каждый запрос заново запрашивает соединение, и сайт заработает, как только база данных ответит.
</p>

<p>
    Пока база данных недоступна, письмо об этом будет приходить не чаще одного раза в {minutes} мин.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "Сбой {siteName} при обработке запроса",
    "Email.UnhandledError.body": `
<p>Здравствуйте!</p>

<p>
    {siteName} дал сбой в {when} при запросе {asked}. Читателю показан номер ошибки {reference}, а причина записана в журнале под ним.
</p>

<p>
    Неисправный сайт обычно даёт сбой на каждом запросе, поэтому письма о сбоях будут приходить не чаще 4 раз в час. Остальные всё равно попадут в журнал.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
