// The site's words in Russian. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as вы rather than ты: Russian websites that ask
// people for an account or a password speak to them as вы,
// and ты from a site a reader has just met reads as too familiar. The
// English it is written from is plain and direct, so the commands are kept
// short and the sentences plain rather than stiff. Items in menus and on
// buttons are written in sentence case, as Russian writes them, where the
// English capitalises each word. A result is told in the present tense
// ("выигрывает у") because the past tense would have to choose between a
// man and a woman for every player, and the English does not.
import type { Language } from "../common/language.js";

export const russian: Language = {
  tag: "ru",
  name: "Русский",
  words: {
    "site.skipToContent": "Перейти к содержимому",
    "navigation.menu": "Меню",
    "navigation.label": "Основная",
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
      "Нравится {siteName}? Сделайте пожертвование, чтобы помочь развивать сайт дальше.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "tryWebsite.banner":
      "Это безопасное место, чтобы освоить {siteName}. Всё, что вы здесь введёте, может быть удалено в любой момент.",

    "language.label": "Язык",
    "language.choose": "Сменить",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Есть новости, которые стоит прочитать.",
    "whatsNew.admin.message": "Есть новости для тех, кто проводит турниры.",
    "whatsNew.view": "Посмотреть, что нового",
    "whatsNew.later": "Напомнить в следующий раз",
    "whatsNew.never": "Больше не показывать это уведомление",

    "form.otherwise":
      "Что-то не так. Проверьте введённое и попробуйте ещё раз.",

    "account.menu": "Учётная запись",
    "account.register": "Зарегистрироваться",
    "account.signIn": "Войти",
    "account.forgotPassword": "Я забыл пароль",
    "account.signOut": "Выйти",
    "account.profile": "Профиль",
    "account.changePassword": "Сменить пароль",
    "account.changeEmailAddress": "Сменить адрес электронной почты",
    "account.changeName": "Сменить имя",
    "account.setPassword": "Задать пароль",
    "account.forgetAccount": "Забыть учётную запись",

    "register.title": "Регистрация",
    "register.emailAddress": "Адрес электронной почты",
    "register.submit": "Зарегистрироваться",
    "register.withGoogle": "Зарегистрироваться через Google",
    "register.or": "или",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google не подтвердил, что этот адрес электронной почты принадлежит вам, поэтому войти с ним через Google нельзя. Воспользуйтесь адресом электронной почты ниже.",
    "SignInWithGoogle.LinkedToAnother":
      "У этого адреса электронной почты уже есть учётная запись, связанная с другой учётной записью Google. Войдите через ту учётную запись Google или с помощью адреса электронной почты и пароля.",
    "SignInWithGoogle.NameMissing":
      "Google не сообщил нам вашего имени, а оно нужно для учётной записи. Воспользуйтесь адресом электронной почты ниже.",
    "Google.Unreachable":
      "Сейчас не удалось связаться с Google. Попробуйте ещё раз через несколько минут или воспользуйтесь адресом электронной почты ниже.",
    "Registration.NotAPerson":
      "Похоже, это сделал не человек. Попробуйте ещё раз, а если это повторится, подождите несколько минут и вернитесь.",

    "EmailAddress.Missing": "Введите адрес электронной почты.",
    "EmailAddress.NoAt": "В адресе электронной почты должен быть знак @.",
    "EmailAddress.MoreThanOneAt":
      "В адресе электронной почты должен быть только один знак @.",
    "EmailAddress.NoDomain":
      "В адресе электронной почты после знака @ должен стоять домен, например example.com.",

    "welcome.title": "Проверьте почту",
    "welcome.checkEmail":
      "Мы отправили письмо на указанный вами адрес. Перейдите по ссылке в нём, чтобы продолжить.",
    "welcome.nothingArrived":
      "Если через несколько минут ничего не придёт, загляните в папку «Спам».",
    "welcome.home": "Вернуться на {siteName}",
    "newConfirmationLink.title": "Запросите новую ссылку",
    "newConfirmationLink.explanation":
      "Ссылка для подтверждения вашего адреса электронной почты устарела. Запросите новую, и её пришлют на адрес, с которым вы регистрировались.",
    "newConfirmationLink.send": "Пришлите мне новую ссылку",
    "newConfirmationLink.home": "Вернуться на {siteName}",
    "newConfirmationLink.signIn": "Войти",
    "newConfirmationLink.sent.title": "Проверьте почту",
    "newConfirmationLink.sent.explanation":
      "Мы отправили вам новую ссылку. Перейдите по ней, чтобы подтвердить адрес электронной почты. Если через несколько минут ничего не придёт, загляните в папку «Спам».",
    "newConfirmationLink.alreadyConfirmed.title":
      "Этот адрес электронной почты уже подтверждён",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Подтверждать больше нечего. Войдите с паролем, который вы задали при подтверждении.",
    "newConfirmationLink.noLongerWorks.title": "Эта ссылка больше не работает",
    "newConfirmationLink.noLongerWorks.explanation":
      "Проверьте, что вы перешли по всей ссылке из письма, и в её конце ничего не потерялось. Если она всё равно не работает, зарегистрируйтесь снова, и вам пришлют новую ссылку.",
    "newConfirmationLink.tooMany.title": "Попробуйте позже",
    "newConfirmationLink.tooMany.explanation":
      "На этот адрес недавно отправили несколько ссылок. Подождите час и запросите снова, а пока загляните в папку «Спам».",

    "forgotPassword.title": "Забыли пароль?",
    "forgotPassword.emailAddress": "Адрес электронной почты",
    "forgotPassword.submit": "Пришлите мне способ войти снова",
    "forgotPassword.home": "Вернуться на {siteName}",
    "forgotPassword.sent.title": "Проверьте почту",
    "forgotPassword.sent.explanation":
      "Если у этого адреса есть учётная запись, мы отправили ссылку для задания нового пароля. Перейдите по ней в течение часа. Если через несколько минут ничего не придёт, загляните в папку «Спам».",
    "forgotPassword.tryAgainLater":
      "Отсюда недавно запросили слишком много способов войти снова. Подождите час и попробуйте ещё раз.",

    "setNewPassword.title": "Задайте новый пароль",
    "setNewPassword.password": "Пароль",
    "setNewPassword.confirmPassword": "Подтвердите пароль",
    "setNewPassword.submit": "Задать мой новый пароль",
    "setNewPassword.home": "Вернуться на {siteName}",
    "setNewPassword.signIn": "Войти",
    "setNewPassword.askAgain": "Запросить новую ссылку",
    "setNewPassword.changed.title": "Ваш пароль изменён",
    "setNewPassword.changed.explanation":
      "Вы вышли из учётной записи везде, где были в неё вошли. Войдите с новым паролем.",
    "setNewPassword.expired.title": "Эта ссылка устарела",
    "setNewPassword.expired.explanation":
      "Ссылка для задания нового пароля действует один час. Запросите другую, и её пришлют на тот же адрес.",
    "setNewPassword.noLongerWorks.title": "Эта ссылка больше не работает",
    "setNewPassword.noLongerWorks.explanation":
      "Возможно, ею уже воспользовались или в её конце чего-то не хватает. Если она всё ещё нужна, запросите другую.",

    "BreachedPasswords.Unreachable":
      "Сейчас не удаётся проверить ваш пароль, поэтому он не изменён. Попробуйте ещё раз через несколько минут; ваша ссылка действует до истечения срока.",

    "forgetAccount.title": "Забыть вашу учётную запись",
    "forgetAccount.explanation":
      "Ваше имя и адрес электронной почты можно сделать нечитаемыми навсегда, а учётную запись закрыть. Чтобы убедиться, что это вы, мы сначала отправим ссылку на адрес вашей учётной записи, и ничего не будет забыто, пока вы по ней не перейдёте.",
    "forgetAccount.submit": "Пришлите мне ссылку",
    "forgetAccount.sent.title": "Проверьте почту",
    "forgetAccount.sent.explanation":
      "Мы отправили ссылку на адрес вашей учётной записи. Она действует 15 минут и только пока вы остаётесь в этой учётной записи.",
    "forgetAccount.confirm.title": "Забыть вашу учётную запись навсегда?",
    "forgetAccount.confirm.explanation":
      "После этого никто больше не сможет прочитать ваше имя и адрес электронной почты, а войти в вашу учётную запись будет нельзя. Это нельзя отменить.",
    "forgetAccount.confirm.submit": "Забыть мою учётную запись",
    "forgetAccount.forgotten.title": "Ваша учётная запись забыта",
    "forgetAccount.forgotten.explanation":
      "Ваше имя и адрес электронной почты больше нельзя прочитать, а вы вышли из учётной записи везде, где были в неё вошли.",
    "forgetAccount.noLongerWorks.title": "Эта ссылка больше не работает",
    "forgetAccount.noLongerWorks.explanation":
      "Возможно, срок её действия истёк, ею уже воспользовались, или она от учётной записи, в которую вы не вошли. Если вы всё ещё хотите, чтобы учётную запись забыли, запросите ссылку снова из вашей учётной записи.",
    "forgetAccount.lastAdministrator.title":
      "Вашу учётную запись нельзя забыть",
    "forgetAccount.lastAdministrator.explanation":
      "Вы единственный администратор этого сайта. Передайте роль администратора кому-нибудь ещё, и тогда вашу учётную запись можно будет забыть.",
    "forgetAccount.askAgain": "Запросить снова",
    "forgetAccount.home": "Вернуться на {siteName}",

    "registrationsSuspended.title": "Регистрация пока приостановлена",
    "registrationsSuspended.explanation":
      "Сейчас не удаётся связаться со службой, которая нужна для регистрации, поэтому никто не может зарегистрироваться, пока она не ответит. Ничего из введённого вами не сохранено.",
    "registrationsSuspended.tryAgainLater":
      "Попробуйте ещё раз немного позже. Администратору сайта уже сообщили.",
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
      "Недавно было слишком много попыток. Подождите час и попробуйте ещё раз.",

    "SignIn.Failed":
      "Адрес электронной почты или пароль неверны. Попробуйте ещё раз.",

    "profile.title": "Профиль",
    "profile.name": "Имя:",
    "profile.emailAddress": "Адрес электронной почты:",

    "changeName.title": "Сменить имя",
    "changeName.name": "Имя",
    "changeName.submit": "Сменить имя",

    "setPassword.title": "Задайте пароль",
    "setPassword.explanation":
      "У вашей учётной записи нет пароля: вы входите через Google. Чтобы можно было входить и с паролем, мы отправим на {emailAddress} ссылку для его задания.",
    "setPassword.submit": "Пришлите мне ссылку",
    "setPassword.sent.title": "Проверьте почту",
    "setPassword.sent.explanation":
      "Мы отправили вам ссылку для задания пароля. Она действует один час.",
    "setPassword.profile": "Вернуться в профиль",

    "changePassword.title": "Сменить пароль",
    "changePassword.currentPassword": "Текущий пароль",
    "changePassword.password": "Новый пароль",
    "changePassword.passwordConfirmation": "Подтвердите пароль",
    "changePassword.forgotPassword": "Забыли пароль?",
    "changePassword.submit": "Сменить пароль",
    "ChangePassword.WrongPassword": "Это не ваш пароль.",

    "changeEmailAddress.title": "Сменить адрес электронной почты",
    "changeEmailAddress.emailAddress": "Новый адрес электронной почты",
    "changeEmailAddress.currentPassword": "Текущий пароль",
    "changeEmailAddress.submit": "Отправить ссылку для подтверждения",
    "changeEmailAddress.sent.title": "Проверьте почту",
    "changeEmailAddress.sent.explanation":
      "На новый адрес электронной почты отправлена ссылка для подтверждения переноса. Перейдите по ней, оставаясь в учётной записи, чтобы перенести её на этот адрес.",
    "changeEmailAddress.confirm.title": "Перенесите вашу учётную запись",
    "changeEmailAddress.confirm.explanation":
      "Ваша учётная запись будет перенесена на {emailAddress}. Отныне вы будете входить с этим адресом.",
    "changeEmailAddress.confirm.submit": "Перенести мою учётную запись",
    "changeEmailAddress.noLongerWorks.title": "Эта ссылка больше не работает",
    "changeEmailAddress.noLongerWorks.explanation":
      "Срок её действия истёк, ею уже воспользовались, или она отправлена не для той учётной записи, в которую вы вошли. Запросите её снова в вашем профиле.",
    "changeEmailAddress.taken.title": "Ваша учётная запись не перенесена",
    "changeEmailAddress.profile": "Вернуться в профиль",
    "ChangeEmailAddress.WrongPassword": "Это не ваш пароль.",
    "ChangeEmailAddress.Unchanged": "Ваша учётная запись уже на этом адресе.",
    "ChangeEmailAddress.Taken":
      "У этого адреса электронной почты уже есть своя учётная запись, поэтому вашу туда перенести нельзя.",

    "confirmEmailAddress.title": "Подтвердите адрес электронной почты",
    "confirmEmailAddress.name": "Имя",
    "confirmEmailAddress.password": "Пароль",
    "confirmEmailAddress.confirmPassword": "Подтвердите пароль",
    "confirmEmailAddress.submit": "Подтвердить мой адрес электронной почты",
    "confirmEmailAddress.signIn": "Войти",
    "confirmEmailAddress.home": "Вернуться на {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Ваш адрес электронной почты подтверждён",
    "confirmEmailAddress.confirmed.explanation":
      "Ваша учётная запись готова. Войдите с адресом электронной почты и паролем, которые вы только что указали.",
    "confirmEmailAddress.expired.title": "Эта ссылка устарела",
    "confirmEmailAddress.expired.explanation":
      "Ссылка для подтверждения адреса электронной почты действует 24 часа. Запросите новую, и её пришлют на тот же адрес.",
    "confirmEmailAddress.expired.newLink": "Пришлите мне новую ссылку",
    "confirmEmailAddress.noLongerWorks.title": "Эта ссылка больше не работает",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Проверьте, что вы перешли по всей ссылке из письма, и в её конце ничего не потерялось. Если она всё равно не работает, зарегистрируйтесь снова, и вам пришлют новую ссылку.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Этот адрес электронной почты уже подтверждён",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Больше ничего делать не нужно. Войдите с паролем, который вы задали при подтверждении.",

    "PersonName.Missing": "Введите имя.",
    "PersonName.TooShort": "Имя должно состоять не менее чем из 3 символов.",
    "PersonName.TooLong": "Имя может состоять не более чем из 254 символов.",
    "WorldRankingName.TooShort":
      "Имя в мировом рейтинге должно состоять не менее чем из 3 символов.",
    "WorldRankingName.TooLong":
      "Имя в мировом рейтинге может состоять не более чем из 254 символов.",
    "Password.Missing": "Введите пароль.",
    "Password.TooShort": "Пароль должен состоять не менее чем из 12 символов.",
    "Password.ConfirmationDiffers":
      "Не совпадает с паролем выше. Введите его ещё раз.",
    "Password.Breached":
      "Этот пароль встречался в утечке данных на другом сайте, поэтому использовать его здесь небезопасно. Выберите другой.",

    "javaScriptRequired.title": "Нужен JavaScript",
    "javaScriptRequired.explanation":
      "Для регистрации на этом сайте должен быть включён JavaScript, чтобы можно было проверить, что регистрируется человек. Включите его и зарегистрируйтесь снова.",
    "javaScriptRequired.register": "Вернуться к регистрации",
    "javaScriptRequired.home": "Вернуться на {siteName}",

    "errors.backHome": "Вернуться на {siteName}",
    "errors.notFound": "Не найдено",
    "errors.refused": "Это не удалось сделать",
    "errors.refusedDetail": "Что-то из отправленного было неверным.",
    "errors.sorry": "Приносим извинения",
    "errors.sorryDetail": "Этот запрос не удалось обработать.",
    "errors.failed": "Что-то пошло не так",
    "errors.reference": "Номер обращения: {reference}.",
    "errors.unavailable": "Сайт недоступен",
    "errors.unavailableDetail":
      "Сайт сейчас не может получить доступ к тому, что ему нужно. Пожалуйста, попробуйте позже.",

    "home.recentResults": "Последние результаты",
    "home.recentResults.none":
      "За последние семь дней не добавлено ни одной партии.",
    "home.upcomingTournaments": "Ближайшие турниры",
    "home.upcomingTournaments.none":
      "В ближайшие шестьдесят дней не начинается ни одного турнира.",
    "tournamentList.column.date": "Дата",
    "tournamentList.column.name": "Название",
    "tournamentList.onlyIn": "Только турниры: {country}",
    "tournamentList.filter.country": "Страна",
    "tournamentList.filter.anyCountry": "Любая страна",
    "tournamentList.filter.region": "Регион",
    "tournamentList.filter.anyRegion": "Любой регион",
    "tournamentList.filter.sport": "Вид спорта",
    "tournamentList.filter.anySport": "Любой вид спорта",
    "tournamentList.filter.submit": "Отфильтровать",
    "home.allTournaments": "Все турниры {year} года",
    "year.heading": "Турниры {year} года",
    "year.none": "В {year} году не начинается ни одного турнира.",
    "yearSport.heading": "Турниры ({sport}) {year} года",
    "yearSport.none":
      "В {year} году не начинается ни одного турнира ({sport}).",
    "tournament.recent": "Недавние",
    "tournament.summary": "Сводка",
    "test.bestOf": "Каждая встреча играется как лучшая из {count}.",
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
      "Показаны только первые {count}. Введите больше из названия, чтобы сузить поиск.",
    "tournament.test": "{first} против {second}",
    "tournament.notes": "Заметки",
    "tournament.commentary": "Комментарии",
    "tournament.beat": "выигрывает у",
    "tournament.drewWith": "играет вничью с",
    "tournament.ago.seconds": "{count} с",
    "tournament.ago.minutes": "{count} мин",
    "tournament.ago.hour": "1 ч",
    "tournament.ago.hours": "{count} ч",
    "tournament.none": "Ни одной партии ещё не сыграно.",
    "players.none": "Ни одного игрока ещё не добавлено.",
    "commentaries.by": "автор:",
    "commentaries.start": "Начать новое обсуждение",
    "commentaries.disclaimer.heading": "Предупреждение",
    "commentaries.disclaimer":
      "Мнения, высказанные в этих комментариях, принадлежат их авторам и не обязательно совпадают с мнением Тима Мёрфи или {site}.",
    "commentaries.guidelines.heading": "Правила",
    "commentaries.guidelines.responsible": "Вы отвечаете за свои комментарии.",
    "commentaries.guidelines.purpose":
      "Комментарии нужны, чтобы рассказывать о том, что происходит на турнире. Они не задуманы как «социальная сеть» для обмена добрыми пожеланиями и тому подобного.",
    "commentaries.guidelines.hatred":
      "Не публикуйте ничего, что может разжигать насилие или ненависть. Мы не потерпим комментариев, унижающих других по признаку расы, религии, этнической принадлежности, пола, возраста, психической или физической инвалидности или сексуальной ориентации.",
    "commentaries.guidelines.abuse":
      "Беспричинные оскорбления недопустимы. Общее правило: комментарии должны бить по мячу, а не по игроку, то есть не нападать на человека лично, а касаться сути вопроса.",
    "commentaries.guidelines.unlawful":
      "Любой комментарий сомнительной законности, например возможное нарушение авторских прав или материал, который может быть клеветническим, будет удалён.",
    "commentaries.guidelines.shouting":
      "Пожалуйста, не используйте в комментариях грубую брань и не пишите всё заглавными буквами.",
    "commentaries.guidelines.selling":
      "Не используйте комментарии в коммерческих целях и для спама. Комментарии, рекламирующие, продвигающие или предлагающие товары и услуги, будут удалены.",
    "commentaries.guidelines.links":
      "Пожалуйста, не злоупотребляйте ссылками в комментариях. Комментарии со ссылками на неприемлемые материалы будут удалены.",
    "commentaries.guidelines.impersonating":
      "Не выдавайте себя за других в комментариях и не публикуйте личные данные – номера телефонов, почтовые адреса или адреса электронной почты, – которые могут ненамеренно подвергнуть кого-то опасности.",
    "commentaries.reporting.heading": "Сообщения о комментариях",
    "commentaries.reporting.before":
      "Пожалуйста, сообщайте о комментариях, не соответствующих этим правилам, по адресу",
    "commentaries.reporting.after":
      ". Укажите веб-адрес и спорный комментарий. Например:",
    "commentaries.reporting.exampleComment":
      "«комментарий, который следует удалить»",
    "commentaries.reporting.exampleReason":
      "Этот комментарий следует удалить, потому что...",
    "commentaries.reporting.reviewed":
      "Жалоба не означает, что комментарий будет удалён автоматически, но все жалобы будут рассмотрены.",
    "commentaries.reporting.reserved":
      "{site} оставляет за собой право удалять комментарии.",
    "commentaries.reporting.subject": "{site} Жалоба на комментарий",
    "commentaries.reporting.body":
      "Пожалуйста, укажите веб-адрес, спорный комментарий и причину, по которой его следует удалить.",
    "startCommentary.title": "Начать новое обсуждение",
    "startCommentary.titleField": "Заголовок",
    "startCommentary.submit": "Начать обсуждение",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Организаторы ещё не написали заметок.",
    "marks.new": "новое",
    "note.edited": "изменена",
    "commentary.none": "Пока ничего не написано.",
    "commentary.edited": "изменено",
    "commentary.edit": "Изменить",
    "commentary.delete": "Удалить",
    "commentary.comment": "Комментарий",
    "commentary.add": "Добавить",
    "commentary.notSent":
      "Комментарий не удалось отправить. Перезагрузите страницу, чтобы проверить, сохранился ли он.",
    "changeCommentaryTitle.title": "Изменить заголовок",
    "changeCommentaryTitle.submit": "Сохранить",
    "editComment.title": "Изменить комментарий",
    "editComment.save": "Сохранить",
    "deleteComment.title": "Удалить комментарий",
    "deleteComment.question": "Удалить этот комментарий? Это нельзя отменить.",
    "deleteComment.confirm": "Удалить комментарий",
    "deleteComment.keep": "Оставить",
    "player.games": "Партии",
    "player.competitions": "Соревнования",
    "player.beat": "выигрывает у",
    "player.lostTo": "проигрывает",
    "player.drewWith": "играет вничью с",
    "player.score": "{score} против {opponent}",
    "player.noGames": "Ни одной партии ещё не сыграно.",
    "player.noCompetitions": "Пока не заявлен ни на одно соревнование.",
    "block.wins": "Победы",
    "block.matches": "Встречи",
    "block.netGames": "Разница по партиям",
    "block.games": "Партии",
    "block.netHoops": "Разница по воротцам",
    "block.won": "выиграна",
    "block.lost": "проиграна",
    "block.drawn": "вничью",
    "block.withdrawn": "снят",
    "block.gameWithdrawn": "снята",
    "block.losses": "Поражения",
    "competition.views": "Представления",
    "competition.view.grid": "Таблица",
    "competition.view.summary": "Сводка",
    "competition.view.orderOfPlay": "Порядок игр",
    "blockSummary.ranking":
      "Места определяются долей выигранных встреч, затем разницей по воротцам. Регламент турнира может упорядочивать игроков иначе.",
    "orderOfPlay.none": "Ни одной партии ещё не сыграно.",
    "knockout.round.final": "Финал",
    "knockout.round.semis": "Полуфиналы",
    "knockout.round.quarters": "Четвертьфиналы",
    "knockout.round.number": "Раунд {number}",
    "knockout.bye": "Бай",
    "swiss.games": "Партии",
    "swiss.wins": "Победы",
    "swiss.winShare": "% побед",
    "swiss.results": "Результаты",
    "knockout.onward": "Следующие раунды",
    "knockout.back": "Предыдущие раунды",
    "years.label": "Годы",
    "years.earlier": "Более ранние годы",

    "admin.newerBuild.message": "Есть более новая версия этого сайта.",
    "admin.newerBuild.reload": "Перезагрузить",
    "admin.title": "Администрирование",
    "admin.tournaments.new": "Новый турнир",
    "admin.tournaments.none": "Нет турниров",
    "admin.tournaments.archived": "В архиве",
    "admin.tournaments.manage": "Управлять",
    "admin.tournaments.edit": "Изменить",
    "admin.tournaments.archive": "Архивировать",
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
    "admin.tournament.handicap": "Играется с гандикапом",
    "admin.tournament.drawsAllowed": "Ничьи разрешены",
    "admin.tournament.levelTestsDrawn": "Равные тесты считаются ничьёй",
    "admin.tournament.worldRankings": "Учитывается в мировом рейтинге",
    "admin.tournament.national": "Событие национального уровня",
    "admin.tournament.international": "Событие международного уровня",
    "admin.tournament.otherwise": "В таком виде это принять нельзя.",
    "admin.newTournament.title": "Новый турнир",
    "admin.newTournament.submit": "Создать турнир",
    "admin.editTournament.title": "Изменить турнир",
    "admin.editTournament.submit": "Обновить турнир",
    "admin.editTournament.otherwise": "Этот турнир нельзя изменить.",
    "admin.view.tabs": "Турнир",
    "admin.view.players": "Игроки",
    "admin.view.competitions": "Соревнования",
    "admin.view.managers": "Управляющие",
    "admin.view.notes": "Заметки",
    "admin.view.scorers": "Секретари",
    "admin.view.rankings": "Рейтинги",
    "admin.rankings.textFile":
      "Результаты турнира отправляются в мировой рейтинг в виде текстового файла, который сайт составляет из введённых партий.",
    "admin.rankings.spreadsheet":
      "Результаты турнира отправляются в мировой рейтинг в виде электронной таблицы, которую сайт составляет из введённых партий.",
    "admin.rankings.fillInWinners":
      "Сайт может только предположить, кто выиграл каждое соревнование, поэтому перед отправкой файла проверьте строку «Winner» в каждом из них.",
    "admin.rankings.fillInWinner":
      "Сайт не может знать, кто выиграл турнир, поэтому впишите это внизу таблицы перед отправкой.",
    "admin.rankings.sendIt":
      "Затем отправьте файл ответственным за мировой рейтинг.",
    "admin.rankings.download": "Скачать рейтинги",
    "rankings.notAvailable": "Рейтинги недоступны",
    "rankings.notAvailable.sport":
      "У вида спорта этого турнира нет мирового рейтинга, поэтому отправлять нечего.",
    "rankings.notAvailable.handicap":
      "Этот турнир проводится с гандикапом, поэтому не учитывается в мировом рейтинге.",
    "rankings.notAvailable.drawnGames":
      "В этом турнире допускаются ничьи, поэтому он не учитывается в мировом рейтинге.",
    "rankings.notAvailable.notCounted":
      "Организатор этого турнира указал, что он не учитывается в мировом рейтинге.",
    "admin.view.otherwise": "Отсюда этим турниром управлять нельзя.",
    "admin.competitionView.tabs": "Соревнование",
    "admin.competitionView.players": "Игроки",
    "admin.competitionView.scores": "Результаты",
    "admin.sections.label": "Турнир и его соревнования",
    "admin.sections.tournament": "Турнир",
    "admin.administrator.sections.label": "Страницы администратора",
    "admin.administrator.sections.tournaments": "Турниры",
    "admin.administrator.sections.accounts": "Учётные записи",
    "admin.administrator.sections.worldRankings": "Мировой рейтинг",
    "admin.administrator.sections.importErrors": "Ошибки импорта",
    "admin.administrator.title": "Администратор",
    "admin.accounts.title": "Учётные записи",
    "admin.roles.add": "Добавить",
    "admin.roles.administrator.heading": "Администраторы",
    "admin.roles.administrator.none": "Других администраторов нет",
    "admin.roles.administrator.removeTitle": "Убрать администратора",
    "admin.roles.administrator.removeExplanation":
      "{name} перестанет быть администратором этого сайта.",
    "admin.roles.world-ranking-officer.heading":
      "Ответственные за мировой рейтинг",
    "admin.roles.world-ranking-officer.none":
      "Ответственных за мировой рейтинг нет",
    "admin.roles.world-ranking-officer.removeTitle":
      "Убрать ответственного за мировой рейтинг",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} перестанет быть ответственным за мировой рейтинг.",
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
    "admin.worldRankings.finished": "Завершено",
    "admin.worldRankings.failed": "Импорт не завершился.",
    "admin.worldRankings.otherwise": "На сайте что-то сломалось.",
    "WorldRankingLists.Unreachable":
      "Не удалось связаться с сайтом мирового рейтинга.",
    "WorldRankingLists.Unreadable":
      "Список не похож на списки мирового рейтинга: строку не удалось прочитать, в ней никого нет или она написана не в UTF-8.",
    "admin.importErrors.title": "Ошибки импорта",
    "admin.importErrors.none": "Ошибок импорта нет",
    "admin.importErrors.otherwise": "На сайте что-то сломалось.",
    "admin.importError.title": "Ошибка импорта",
    "admin.importError.documentId": "Идентификатор документа",
    "admin.importError.tournament": "Турнир",
    "admin.importError.competition": "Соревнование",
    "admin.importError.newSite": "Новый сайт",
    "admin.importError.oldSite": "Старый сайт",
    "ImportErrorKept.NotFound":
      "Импорт не сохранил ни одной ошибки для этого документа.",
    "admin.competitionView.otherwise":
      "Отсюда этим соревнованием управлять нельзя.",
    "admin.competitions.block": "Группа",
    "admin.competitions.knockout": "На вылет",
    "admin.competitions.swiss": "Швейцарская",
    "admin.competitions.view": "Открыть",
    "admin.competitions.edit": "Изменить",
    "admin.competitions.up": "Выше",
    "admin.competitions.down": "Ниже",
    "admin.competitions.archive": "Архивировать",
    "admin.competitions.restore": "Восстановить",
    "admin.competitions.archived": "Соревнования в архиве",
    "admin.competitions.none": "Нет соревнований",
    "admin.competitions.add": "Добавить соревнование",
    // The competition dialog.
    "admin.competition.addTitle": "Добавить соревнование",
    "admin.competition.editTitle": "Изменить соревнование",
    "admin.competition.name": "Название",
    "admin.competition.kind": "Тип",
    "admin.competition.bestOf": "Лучшая из",
    "admin.competition.rounds": "Туры",
    "admin.competition.places": "Места",
    "admin.competition.round": "Раунд {number}",
    "admin.competition.bestOfs": "Лучшая из",
    "admin.competition.quarters": "Четвертьфиналы",
    "admin.competition.semis": "Полуфиналы",
    "admin.competition.final": "Финал",
    "admin.competition.add": "Добавить",
    "admin.competition.save": "Сохранить",
    "admin.competition.added": "Добавлено: {name}.",
    "admin.competition.otherwise":
      "В таком виде это соревнование сохранить нельзя.",
    "CompetitionName.Missing": "Введите название.",
    "CompetitionName.TooLong":
      "Название может состоять не более чем из 254 символов.",
    "CompetitionName.NoLetterOrDigit":
      "В названии нужна хотя бы одна буква или цифра.",
    "Tournament.KnockoutPlayerHasGames":
      "У некоторых игроков этой сетки есть партии, поэтому их места менять нельзя.",
    "Tournament.CompetitionNameTaken":
      "У другого соревнования этого турнира уже есть такое название.",
    "BestOf.NotWhole": "Введите целое число партий.",
    "BestOf.TooSmall": "Встреча должна быть лучшей минимум из 1 партии.",
    "Rounds.NotWhole": "Введите целое число туров.",
    "Rounds.TooSmall": "Блок должен играться минимум в 1 тур.",
    "KnockoutDraw.EvenBestOf":
      "У встречи на вылет должен быть победитель, поэтому она играется как лучшая из нечётного числа партий.",
    "admin.hover.tournaments.new": "Создать новый турнир",
    "admin.hover.tournaments.manage":
      "Управлять игроками, командами, соревнованиями и результатами этого турнира",
    "admin.hover.tournaments.edit": "Изменить сведения об этом турнире",
    "admin.hover.tournaments.scores": "Ввести результаты этого турнира",
    "admin.hover.tournaments.players": "Заняться игроками этого турнира",
    "admin.hover.competitions.view":
      "Открыть это соревнование, чтобы увидеть и ввести его игроков и результаты",
    "admin.hover.tests.view":
      "Открыть этот тест, чтобы увидеть и ввести его результаты",
    "admin.hover.teams.view":
      "Открыть эту команду, чтобы увидеть её игроков и управлять ими",
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
      "Архивировать этот турнир; его можно восстановить",
    "admin.hover.tournaments.restore": "Вернуть этот турнир из архива",
    "admin.hover.players.add": "Добавить игрока в этот турнир",
    "admin.hover.players.edit": "Изменить сведения об этом игроке",
    "admin.hover.players.up": "Поднять этого игрока выше в списке",
    "admin.hover.players.down": "Опустить этого игрока ниже в списке",
    "admin.hover.players.archive":
      "Архивировать этого игрока; его можно восстановить",
    "admin.hover.players.restore": "Вернуть этого игрока из архива",
    "admin.hover.teams.add": "Добавить команду в этот турнир",
    "admin.hover.teams.edit": "Изменить сведения об этой команде",
    "admin.hover.teams.up": "Поднять эту команду выше в списке",
    "admin.hover.teams.down": "Опустить эту команду ниже в списке",
    "admin.hover.teams.archive":
      "Архивировать эту команду; её можно восстановить",
    "admin.hover.teams.restore": "Вернуть эту команду из архива",
    "admin.hover.competitions.add": "Добавить соревнование в этот турнир",
    "admin.hover.competitions.edit": "Изменить сведения об этом соревновании",
    "admin.hover.competitions.up": "Поднять это соревнование выше в списке",
    "admin.hover.competitions.down": "Опустить это соревнование ниже в списке",
    "admin.hover.competitions.archive":
      "Архивировать это соревнование; его можно восстановить",
    "admin.hover.competitions.restore": "Вернуть это соревнование из архива",
    "admin.hover.tests.add": "Добавить тест между двумя командами",
    "admin.hover.tests.edit": "Изменить сведения об этом тесте",
    "admin.hover.tests.up": "Поднять этот тест выше в списке",
    "admin.hover.tests.down": "Опустить этот тест ниже в списке",
    "admin.hover.tests.archive":
      "Архивировать этот тест; его можно восстановить",
    "admin.hover.tests.restore": "Вернуть этот тест из архива",
    "admin.hover.tests.toTeams":
      "Перейти на вкладку «Команды», чтобы добавить команды, нужные для теста",
    "admin.hover.scores.add": "Добавить в это соревнование результат матча",
    "admin.hover.scores.edit": "Исправить этот результат",
    "admin.hover.scores.archive":
      "Архивировать этот результат, чтобы он больше не учитывался; его можно восстановить",
    "admin.hover.scores.restore":
      "Вернуть этот результат из архива, чтобы он снова учитывался",
    "admin.hover.scores.withdraw":
      "Оставить этот результат в списке, но не учитывать его",
    "admin.hover.scores.unwithdraw": "Снова учитывать этот снятый результат",
    "admin.hover.scores.up": "Переместить этот результат выше в списке",
    "admin.hover.scores.down": "Переместить этот результат ниже в списке",
    "admin.hover.competitionPlayers.add":
      "Включить выбранного игрока в это соревнование",
    "admin.hover.competitionPlayers.up": "Поднять этого игрока выше в списке",
    "admin.hover.competitionPlayers.down":
      "Опустить этого игрока ниже в списке",
    "admin.hover.competitionPlayers.remove":
      "Исключить этого игрока из соревнования",
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
    "admin.hover.people.add": "Дать эту роль этому человеку",
    "admin.hover.people.remove": "Отобрать эту роль у этого человека",
    "admin.hover.worldRankings.import":
      "Получить мировые рейтинги и добавить их игроков",
    "admin.modal.cancel": "Отмена",
    "admin.modal.ok": "ОК",
    "admin.people.emailAddress": "Адрес электронной почты",
    "admin.people.remove": "Убрать",
    "admin.people.otherwise": "Это не удалось сделать.",
    "admin.managers.you": "Вы",
    "admin.managers.add": "Добавить управляющего",
    "admin.managers.none": "Управляющих нет",
    "admin.managers.removeTitle": "Убрать управляющего",
    "admin.managers.removeExplanation":
      "{name} больше не сможет управлять этим турниром.",
    "admin.managers.removeYourself.explanation":
      "Вы больше не сможете управлять этим турниром, и здесь никто не сможет отменить это за вас. Другой управляющий может снова сделать вас управляющим.",
    "admin.managers.otherwise": "Этот адрес нельзя сделать управляющим.",
    "admin.competitionPlayers.add": "Добавить игрока",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "Этого игрока нельзя добавить.",
    "admin.competitionPlayers.choose": "Игрок для добавления",
    "admin.competitionPlayers.nobody": "Выберите игрока",
    "admin.competitionPlayers.bye": "Бай",
    "admin.competitionPlayers.all": "Все игроки уже в соревновании",
    "admin.competitionPlayers.none": "Нет игроков",
    "admin.competitionPlayers.up": "Выше",
    "admin.competitionPlayers.down": "Ниже",
    "admin.competitionPlayers.remove": "Убрать",
    "admin.competitionPlayers.withdraw": "Снять",
    "admin.competitionPlayers.unwithdraw": "Отменить снятие",
    "admin.competitionPlayers.withdrawn": "Снятые игроки",
    "admin.competitionPlayers.removeTitle": "Убрать игрока",
    "admin.competitionPlayers.removeQuestion":
      "{name} будет исключён из соревнования. Это нельзя отменить.",
    "admin.competitionPlayers.withdrawTitle": "Снять игрока",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} больше не будет играть в соревновании, а несыгранные им партии будут решены без его участия.",
    "admin.competitionPlayers.carryForward": "Перенос",
    "admin.carryForward.title": "Перенос – {name}",
    "admin.carryForward.save": "Сохранить",
    "admin.carryForward.otherwise": "Этот перенос сохранить нельзя.",
    "admin.carryForward.matchWins": "Выигранные матчи",
    "admin.carryForward.matchLosses": "Проигранные матчи",
    "admin.carryForward.gameWins": "Выигранные партии",
    "admin.carryForward.gameLosses": "Проигранные партии",
    "admin.carryForward.hoopsFor": "Воротца за",
    "admin.carryForward.hoopsAgainst": "Воротца против",
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
    "CarryForward.HoopsForNotWhole": "Введите целое число воротец за.",
    "CarryForward.HoopsForBelowZero": "Введите 0 или больше воротец за.",
    "CarryForward.HoopsAgainstNotWhole": "Введите целое число воротец против.",
    "CarryForward.HoopsAgainstBelowZero":
      "Введите 0 или больше воротец против.",
    "admin.scores.add": "Добавить результат",
    "admin.scores.none": "Нет результатов",
    "admin.scores.edit": "Изменить",
    "admin.scores.drawNotFilledTitle": "Сетка не заполнена",
    "admin.scores.archive": "Архивировать",
    "admin.scores.up": "Выше",
    "admin.scores.down": "Ниже",
    "admin.scores.restore": "Восстановить",
    "admin.scores.archived": "Результаты в архиве",
    "admin.scores.archivedSaid": "В архиве",
    "admin.scores.withdraw": "Снять",
    "admin.scores.unwithdraw": "Отменить снятие",
    "admin.scores.withdrawnSaid": "Снят",
    "admin.scores.otherwise": "Это не удалось сделать.",
    "admin.score.title": "Добавить результат",
    "admin.score.add": "Добавить партию",
    "admin.score.winner": "Победитель",
    "admin.score.winnerScore": "Очки победителя",
    "admin.score.loser": "Проигравший",
    "admin.score.loserScore": "Очки проигравшего",
    "admin.score.beat": "выигрывает у",
    "admin.score.added": "Добавлена партия: {winner} выигрывает у {loser}.",
    "admin.score.otherwise": "Партию не удалось добавить.",
    "admin.score.correctTitle": "Изменить результат",
    "admin.score.save": "Сохранить",
    "admin.score.notCorrected": "Результат не удалось исправить.",
    "Game.WinnerMissing": "Выберите победителя.",
    "Game.WinnerScoreMissing": "Введите очки победителя.",
    "Game.LoserMissing": "Выберите проигравшего.",
    "Game.LoserScoreMissing": "Введите очки проигравшего.",
    "Score.NoPoints": "Очки начинаются с числа.",
    "Game.SamePlayer": "Никто не играет против самого себя.",
    "Game.WinnerNotAhead":
      "У победителя должно быть больше очков, чем у проигравшего, либо он должен быть отмечен как победитель.",
    "Game.LoserMarked": "Очки проигравшего нельзя отметить как выигранные.",
    "Game.ResultChanged":
      "Исправление сохраняет исход: выигранная партия остаётся выигранной, а сыгранная вничью остаётся ничьей.",
    "Competition.MatchDecided": "Их матч уже решён.",
    "Competition.DrawFull":
      "Игрока нельзя добавить, потому что сетка заполнена.",
    "Competition.DrawNotFilled":
      "Результаты нельзя добавлять, пока на каждом месте сетки нет игрока или бая.",
    "Competition.ByeOutsideKnockout": "Баи бывают только на вылет.",
    "Competition.NotDrawnToMeet": "Им не предстоит играть друг с другом.",
    "Competition.WinnerHasPlayedOn":
      "Победитель этого матча уже сыграл следующую партию, поэтому менять, кто победил, нельзя.",
    "CompetitionPlayer.Withdrawn": "Снятый игрок больше не играет.",
    "admin.players.add": "Добавить игрока",
    "admin.players.none": "Нет игроков",
    "admin.players.edit": "Изменить",
    "admin.players.archive": "Архивировать",
    "admin.players.restore": "Восстановить",
    "admin.players.up": "Выше",
    "admin.players.down": "Ниже",
    "admin.players.archiveTitle": "Архивировать игрока",
    "admin.players.archiveQuestion": "{name} будет убран из этих соревнований:",
    "admin.players.archive.explanation":
      "Восстановление игрока не вернёт его в эти соревнования.",
    "admin.players.archived": "Игроки в архиве",
    "admin.players.archivedSaid": "В архиве",
    "admin.player.addTitle": "Добавить игрока",
    "admin.player.editTitle": "Изменить игрока",
    "admin.player.name": "Имя",
    "admin.player.representing": "Представляет",
    "admin.player.worldRankingName": "Имя в мировом рейтинге",
    "admin.player.worldRankingKnown": "Мировой рейтинг знает это имя.",
    "admin.player.worldRankingQuestioned":
      "В мировом рейтинге нет игрока с таким именем. Возможно, оно написано с ошибкой или игрок новый в рейтинге.",
    "admin.player.flag": "Флаг",
    "admin.player.add": "Добавить",
    "admin.player.save": "Сохранить",
    "admin.player.added": "Добавлен игрок: {name}.",
    "admin.player.otherwise": "В таком виде этого игрока сохранить нельзя.",
    "Tournament.PlayerNameTaken":
      "У другого игрока этого турнира уже есть такое имя.",
    "TournamentPlayer.NoSuchFlag": "Выберите один из имеющихся флагов.",
    "TournamentPlayer.NamedBye": "Игрока нельзя назвать Бай.",
    "TournamentPlayer.NoLetterOrDigit":
      "В имени нужна хотя бы одна буква или цифра.",
    "admin.player.byesTitle": "Баи не добавляются",
    "admin.player.byes":
      "Бай не является игроком турнира. Турнир на вылет предлагает Бай при добавлении его игроков, столько раз, сколько нужно его сетке.",
    "admin.view.teams": "Команды",
    "admin.view.tests": "Тесты",
    "admin.teams.add": "Добавить команду",
    "admin.teams.none": "Нет команд",
    "admin.teams.edit": "Изменить",
    "admin.teams.view": "Открыть",
    "admin.teams.archive": "Архивировать",
    "admin.teams.restore": "Восстановить",
    "admin.teams.up": "Выше",
    "admin.teams.down": "Ниже",
    "admin.teams.archived": "Команды в архиве",
    "admin.teams.archivedSaid": "В архиве",
    "admin.team.addTitle": "Добавить команду",
    "admin.team.editTitle": "Изменить команду",
    "admin.team.name": "Название",
    "admin.team.shortName": "Краткое название",
    "admin.team.shortName.explanation":
      "Как называются тесты команды, например AUS v ENG.",
    "admin.team.flag": "Флаг",
    "admin.team.add": "Добавить",
    "admin.team.save": "Сохранить",
    "admin.team.added": "Добавлено: {name}.",
    "admin.team.otherwise": "В таком виде эту команду сохранить нельзя.",
    "admin.teamView.otherwise": "Отсюда эту команду посмотреть нельзя.",
    "admin.teamView.players": "Игроки",
    "TeamName.Missing": "Укажите название команды.",
    "TeamName.TooLong": "Это название слишком длинное.",
    "admin.notes.add": "Добавить заметку",
    "admin.notes.none": "Нет заметок",
    "admin.notes.edit": "Изменить",
    "admin.notes.delete": "Удалить",
    "admin.notes.deleteTitle": "Удалить заметку",
    "admin.notes.deleteQuestion": "Удалить заметку «{title}»?",
    "admin.notes.delete.explanation":
      "Удалённая заметка исчезает навсегда, и её нельзя вернуть.",
    "admin.notes.otherwise": "Это не удалось сделать.",
    "admin.note.addTitle": "Добавить заметку",
    "admin.note.editTitle": "Изменить заметку",
    "admin.note.title": "Заголовок",
    "admin.note.description": "Описание",
    "admin.note.write": "Текст",
    "admin.note.preview": "Предпросмотр",
    "admin.note.toolbar": "Форматирование",
    "admin.note.tool.heading": "Заголовок",
    "admin.note.tool.bold": "Жирный",
    "admin.note.tool.italic": "Курсив",
    "admin.note.tool.quote": "Цитата",
    "admin.note.tool.code": "Код",
    "admin.note.tool.link": "Ссылка",
    "admin.note.tool.numberedList": "Нумерованный список",
    "admin.note.tool.bulletedList": "Маркированный список",
    "admin.note.tool.taskList": "Список задач",
    "admin.note.add": "Добавить",
    "admin.note.save": "Сохранить",
    "admin.note.otherwise": "В таком виде эту заметку сохранить нельзя.",
    "ManagerNoteTitle.Missing": "Дайте заметке заголовок.",
    "ManagerNoteTitle.TooLong": "Этот заголовок слишком длинный.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "В заголовке нужна хотя бы одна буква или цифра.",
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
      "В заголовке нужна хотя бы одна буква или цифра.",
    "Commentary.TitleTaken": "У другого обсуждения уже есть такой заголовок.",
    "CommentText.Missing": "Напишите что-нибудь в комментарии.",
    "CommentText.TooLong": "Этот комментарий слишком длинный.",
    "TeamShortName.Missing": "Дайте команде краткое название.",
    "TeamShortName.TooLong":
      "Краткое название может состоять не более чем из 10 символов.",
    "TeamShortName.NoLetterOrDigit":
      "В кратком названии нужна хотя бы одна буква или цифра.",
    "Team.ShortNameLongerThanName":
      "Краткое название не может быть длиннее названия команды.",
    "Team.NoSuchFlag": "Выберите один из имеющихся флагов.",
    "Team.Archived": "Эта команда в архиве, и сначала её нужно восстановить.",
    "Team.InATest": "Эта команда играет в тесте, и её нельзя архивировать.",
    "Team.PlayerNameTaken": "У другого игрока этой команды уже есть такое имя.",
    "TeamPlayer.NamedBye": "Игрока нельзя назвать Бай.",
    "TeamPlayer.Archived":
      "Этот игрок в архиве, и сначала его нужно восстановить.",
    "TeamPlayer.HasGames": "Этот игрок играл, и его нельзя архивировать.",
    "Tournament.TeamNameTaken":
      "У другой команды этого турнира уже есть такое название.",
    "Tournament.TeamShortNameTaken":
      "У другой команды этого турнира уже есть такое краткое название.",
    "Tournament.NoSuchTeam": "В этом турнире нет команды по этому адресу.",
    "Tournament.TeamArchived":
      "Эта команда в архиве, и восстановить её можно только на вкладке «Команды».",
    "admin.tests.add": "Добавить тест",
    "admin.tests.none": "Нет тестов",
    "admin.tests.edit": "Изменить",
    "admin.tests.view": "Открыть",
    "admin.tests.archive": "Архивировать",
    "admin.tests.restore": "Восстановить",
    "admin.tests.up": "Выше",
    "admin.tests.down": "Ниже",
    "admin.tests.archived": "Тесты в архиве",
    "admin.tests.twoTeamsNeeded":
      "Тест играют две команды, поэтому сначала нужны две команды.",
    "admin.tests.toTeams": "Перейти к командам",
    "admin.tests.matches.one": "{count} матч",
    "admin.tests.matches.other": "матчей: {count}",
    "admin.tests.bestOf": "лучшая из {games}",
    "admin.tests.otherwise": "Это не удалось сделать.",
    "admin.test.addTitle": "Добавить тест",
    "admin.test.editTitle": "Изменить тест",
    "admin.test.firstTeam": "Команда A",
    "admin.test.secondTeam": "Команда B",
    "admin.test.versus": "v",
    "admin.test.starts": "Начало",
    "admin.test.finishes": "Окончание",
    "admin.test.expectedMatches": "Ожидаемые матчи",
    "admin.test.bestOf": "Лучшая из",
    "admin.test.group": "Группа",
    "admin.test.add": "Добавить",
    "admin.test.save": "Сохранить",
    "admin.test.added": "Добавлено: {name}.",
    "admin.test.otherwise": "В таком виде этот тест сохранить нельзя.",
    "admin.testView.otherwise": "Отсюда этот тест посмотреть нельзя.",
    "AddTest.FirstTeamMissing": "Выберите первую команду.",
    "AddTest.SecondTeamMissing": "Выберите вторую команду.",
    "UpdateTest.FirstTeamMissing": "Выберите первую команду.",
    "UpdateTest.SecondTeamMissing": "Выберите вторую команду.",
    "ExpectedMatches.NotWhole": "Введите целое число матчей.",
    "ExpectedMatches.TooSmall": "В тесте должен быть ожидаемым хотя бы 1 матч.",
    "TestGroup.TooLong": "Эта группа слишком длинная.",
    "Tournament.TestAgainstItself": "Команда не играет тест против самой себя.",
    "Tournament.TestFinishesBeforeStarts":
      "Тест не может закончиться раньше, чем начался.",
    "Tournament.TestStartsBeforeTournament":
      "Тест не может начаться раньше своего турнира.",
    "Tournament.TestFinishesAfterTournament":
      "Тест не может закончиться позже своего турнира.",
    "Tournament.TestHasGamesInUse":
      "В этом тесте есть партии, поэтому его нельзя архивировать, пока они не будут архивированы.",
    "Tournament.TestHasGames":
      "В этом тесте уже есть партии, поэтому его команды больше менять нельзя.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Начато уже больше матчей, чем это число.",
    "Tournament.BestOfBelowGamesPlayed":
      "Двое игроков уже сыграли больше партий, чем это число.",
    "Competition.ExpectedMatchesReached":
      "В этом тесте уже начаты все ожидаемые матчи.",
    "Competition.SameTeam": "Два игрока одной команды друг с другом не играют.",
    "AddManager.NoSuchAccount":
      "У этого адреса нет учётной записи, которую можно сделать управляющей.",
    "Account.NotAnAdministrator": "Это может сделать только администратор.",
    "AddRole.NoSuchAccount":
      "У этого адреса нет учётной записи, которой можно дать роль.",
    "AddRole.NoSuchRole": "Такой роли нет.",
    "RemoveRole.NoSuchAccount": "Такой учётной записи нет.",
    "RemoveRole.NoSuchRole": "Такой роли нет.",
    "RemoveRole.Yourself": "Нельзя отобрать у самого себя роль администратора.",
    "AccountsWithRole.NoSuchRole": "Такой роли нет.",
    "admin.scorers.add": "Добавить секретаря",
    "admin.scorers.none": "Секретарей нет",
    "admin.scorers.removeTitle": "Убрать секретаря",
    "admin.scorers.removeExplanation":
      "{name} больше не сможет вводить результаты этого турнира.",
    "admin.scorers.otherwise": "Этот адрес нельзя сделать секретарём.",
    "AddScorer.NoSuchAccount":
      "У этого адреса нет учётной записи, которую можно сделать секретарём.",
    "Tournament.AlreadyAManager":
      "Эта учётная запись уже управляет турниром и может делать всё, что делает секретарь.",

    "TournamentName.Missing": "Укажите название турнира.",
    "TournamentName.TooShort": "Это название слишком короткое.",
    "TournamentName.TooLong": "Это название слишком длинное.",
    "TournamentName.AllLowerCase":
      "Название не пишется целиком строчными буквами.",
    "TournamentName.AllCapitals":
      "Название не пишется целиком заглавными буквами.",
    "TournamentName.NoLetterOrDigit":
      "В названии нужна хотя бы одна буква или цифра.",
    "ReadOnlyDate.Unreadable": "Укажите день.",
    "Tournament.FinishesBeforeStarts":
      "Турнир не может закончиться раньше, чем начался.",
    "Tournament.StartsAfterNextYear":
      "Турнир не может начаться позже следующего года.",
    "Tournament.FinishesAfterNextYear":
      "Турнир не может закончиться позже следующего года.",
    "CreateTournament.NoSuchCountry": "Выберите страну.",
    "TournamentSubtitle.TooLong":
      "Подзаголовок может состоять не более чем из 2000 символов.",
    "Tournament.NotAManager":
      "Изменять этот турнир может только тот, кто им управляет.",
    "Tournament.NotAManagerOrScorer":
      "Смотреть этот турнир может только тот, кто им управляет или вводит его результаты.",
    "Tournament.Archived":
      "Этот турнир в архиве, и его нужно восстановить, прежде чем изменять.",
    "UpdateTournament.NoSuchTournament":
      "По этому адресу нет ни одного турнира.",

    // The sports keep the names their players use in Russian, falling back to
    // the English where there is no established term, and the formats named
    // for a competition keep its name, as a name is not translated.
    "sport.ac": "Ассоциационный крокет",
    "sport.gc": "Гольф-крокет",
    "sport.a6w": "Американский крокет на 6 воротах",
    "sport.rc": "Рикошет",
    "sport.gb": "Гейтбол",
    "format.standard": "Стандартный",
    "format.teams": "Командный",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
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
    "country.bs": "Багамы",
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
    "country.ky": "Каймановы острова",
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
    "country.mh": "Маршалловы острова",
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
    "country.sb": "Соломоновы острова",
    "country.sc": "Сейшелы",
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
    "country.tc": "Теркс и Кайкос",
    "country.td": "Чад",
    "country.tf": "Французские Южные территории",
    "country.tg": "Того",
    "country.th": "Таиланд",
    "country.tj": "Таджикистан",
    "country.tk": "Токелау",
    "country.tl": "Восточный Тимор",
    "country.tm": "Туркмения",
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
    "country.za": "Южно-Африканская Республика",
    "country.zm": "Замбия",
    "country.zw": "Зимбабве",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject":
      "Подтвердите адрес электронной почты для {siteName}",
    "Email.ConfirmAddress.body": `
<p>Здравствуйте!</p>

<p>
    Спасибо, что создали учётную запись на <strong>{siteName}</strong>.<br />
    Прежде чем начать пользоваться учётной записью, подтвердите адрес
    электронной почты, нажав на кнопку ниже:
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
        Подтвердить мой адрес электронной почты
    </a>
</p>

<p>
    Если кнопка не работает, вы можете подтвердить адрес электронной почты, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Если вы не создавали эту учётную запись, просто проигнорируйте это письмо.
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
    Подтвердите адрес электронной почты, нажав на кнопку ниже:
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
        Подтвердить мой адрес электронной почты
    </a>
</p>

<p>
    Если кнопка не работает, вы можете подтвердить адрес электронной почты, открыв эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    После подтверждения вы сможете продолжать пользоваться учётной записью без перерывов.
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
      "Кто-то попытался зарегистрироваться с вашим адресом электронной почты",
    "Email.AlreadyRegistered.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то попытался зарегистрироваться на <strong>{siteName}</strong> с этим
    адресом электронной почты, у которого уже есть учётная запись. В вашей
    учётной записи ничего не изменилось.<br />
    Если это были вы, у вас уже есть учётная запись, и вы можете в неё войти:
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
        Я забыл пароль
    </a>
</p>

<p>
    Если это были не вы, делать ничего не нужно. Никто не получил способа
    войти в вашу учётную запись.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Подтвердите перенос вашей учётной записи {siteName} на этот адрес",
    "Email.ConfirmNewEmailAddress.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то, вошедший в учётную запись на <strong>{siteName}</strong>,
    попросил перенести её на этот адрес электронной почты. Если это были вы,
    подтвердите это здесь, оставаясь в этой учётной записи. Ссылка действует
    24 часа.
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
        Перенести мою учётную запись
    </a>
</p>

<p>
    Или скопируйте этот адрес в браузер:<br />
    {link}
</p>

<p>
    Если это были не вы, делать ничего не нужно. Никакая учётная запись сюда перенесена не будет.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Кто-то попросил перенести учётную запись на ваш адрес электронной почты",
    "Email.AlreadyHasAnAccount.body": `
<p>Здравствуйте!</p>

<p>
    Кто-то, вошедший в учётную запись на <strong>{siteName}</strong>,
    попросил перенести её на этот адрес электронной почты, у которого уже есть
    своя учётная запись. Ничего не перенесено, и в вашей учётной записи
    ничего не изменилось.
</p>

<p>
    Если это были вы, у вас уже есть учётная запись с этим адресом, и вы
    можете в неё войти.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Ваша учётная запись {siteName} перенесена",
    "Email.EmailAddressChanged.body": `
<p>Здравствуйте!</p>

<p>
    Ваша учётная запись на <strong>{siteName}</strong> только что была
    перенесена на другой адрес электронной почты, {emailAddress}, и теперь
    вход выполняется с этим адресом.
</p>

<p>
    Если это были не вы, ваша учётная запись у кого-то другого. Ответьте на
    это письмо и расскажите нам об этом.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Ваш пароль {siteName} изменён",
    "Email.PasswordChanged.body": `
<p>Здравствуйте!</p>

<p>
    Пароль вашей учётной записи на <strong>{siteName}</strong> только что был
    изменён, и во всех остальных браузерах, где вы были в неё вошли, вход
    закрыт.<br />
    Если это были вы, делать ничего не нужно.
</p>

<p>
    Если это были не вы, ваш пароль у кого-то другого. Задайте новый здесь, и
    тот человек будет выведен из учётной записи:
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
        Я забыл пароль
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
    Вы можете сбросить его, нажав на кнопку ниже:
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
    У вашей учётной записи на <strong>{siteName}</strong> нет пароля: вы входите через Google.<br />
    Вы попросили задать его, чтобы можно было входить ещё и с адресом электронной почты и паролем.
    Задать его можно, нажав на кнопку ниже:
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
    Ссылка действует один час. Если вы не просили задать пароль, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Для этого адреса электронной почты нет учётной записи {siteName}",
    "Email.RegisterInstead.body": `
<p>Здравствуйте!</p>

<p>
    Был запрошен сброс пароля для адреса электронной почты, который не связан
    ни с одной учётной записью на <strong>{siteName}</strong>.
</p>

<p>
    Если вы хотите пользоваться нашим сервисом, вы можете создать новую учётную запись здесь:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Если вы не делали этого запроса, просто проигнорируйте это письмо.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Подтвердите, что хотите забыть вашу учётную запись {siteName}",
    "Email.ConfirmForgetting.body": `
<p>Здравствуйте!</p>

<p>
    Вы попросили забыть вашу учётную запись на <strong>{siteName}</strong>.<br />
    Нажмите на кнопку ниже, чтобы увидеть, что это значит, и безопасно
    подтвердить, что вы этого хотите:
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
        Забыть мою учётную запись
    </a>
</p>

<p>
    Если кнопка не работает, вы можете открыть эту ссылку в браузере:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    После этого никто больше не сможет прочитать ваше имя и адрес
    электронной почты, а войти в вашу учётную запись будет нельзя. Это нельзя
    отменить.
</p>

<p>
    Ссылка срабатывает только один раз, в течение 15 минут после запроса, и
    только пока вы остаётесь в этой учётной записи. После этого запросите её
    снова из вашей учётной записи.
</p>

<p>
    Если это были не вы, ничего не произойдёт, пока кто-нибудь не перейдёт по
    ссылке. Тем не менее запрос отправил кто-то, вошедший в вашу учётную
    запись, поэтому задайте новый пароль на странице «Забыли пароль?», чтобы
    он не смог войти снова.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Регистрация приостановлена: не удаётся связаться с {service}",
    "Email.RegistrationsSuspended.body": `
<p>Здравствуйте!</p>

<p>
    {siteName} не смог связаться с {service} в {when}. Пока он не ответит,
    тем, кому он нужен, чтобы зарегистрироваться или задать новый пароль,
    говорят попробовать ещё раз позже.
</p>

<p>
    Ничего снимать не нужно. Каждая попытка снова обращается к {service}, и
    страницы снова заработают, как только он ответит.
</p>

<p>
    Пока {service} не отвечает, вы будете получать об этом не больше одного
    письма в час.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} не может связаться с базой данных",
    "Email.DatabaseUnreachable.body": `
<p>Здравствуйте!</p>

<p>
    {siteName} не смог связаться с базой данных в {when}. Пока она не ответит, каждая страница, которой она нужна, сообщает читателям, что сайт недоступен и что нужно попробовать позже.
</p>

<p>
    Ничего снимать не нужно. Каждый запрос заново просит соединение, и сайт снова работает, как только база данных отвечает.
</p>

<p>
    Пока база данных остаётся недоступной, вы будете получать письмо об этом не чаще одного раза в {minutes} минут.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
