// The site's words in Simplified Chinese (简体中文).
// The reader is addressed as 您, politely, throughout. Chinese has no capital
// letters, so menu, button and heading items are written plainly, as short
// verb phrases. An email address is 电子邮件地址 (never just 邮箱) and a
// password is 密码. A tournament is 赛事, a competition inside it 项目, a
// block 小组, and a hoop 球门; game, match and test are 局, 场 and 对抗赛.
// "Forget an account" is 抹除账户, since the name and address are made
// unreadable. The site's own checked word "Bye" stays in English wherever a
// person types it or chooses it from a list, and is 轮空 where only read.
// Punctuation is full-width, and a label's colon is part of its words.
import type { Language } from "../common/language.js";

export const chinese: Language = {
  tag: "zh",
  name: "中文",
  words: {
    // The site's own bars.
    "site.skipToContent": "跳到正文",
    "navigation.menu": "菜单",
    "navigation.label": "主导航",
    "navigation.home": "首页",
    "navigation.help": "帮助",
    "navigation.admin": "管理",
    "sections.label": "栏目",
    "theme.label": "主题",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "跟随系统",
    "footer.donate": "捐赠",
    "footer.plea": "喜欢 {siteName} 吗？欢迎捐赠，支持网站继续开发。",
    "footer.copyright": "© 版权所有 {years}，{owner}",
    "footer.privacy": "隐私",
    "footer.termsOfUse": "使用条款",
    "footer.reportBug": "报告错误",
    "beta.banner": "这是测试版网站，数据随时可能被重置。",
    "privacy.contact":
      "对本页内容或我们保存的您的信息有疑问，请联系：{emailAddress}",
    // The box a reader ticks to agree to the terms of use. The link's words
    // are found in the box's and made the link, so they must be written
    // exactly as they are there.
    "termsOfUse.agree": "我同意使用条款",
    "termsOfUse.link": "使用条款",
    "termsOfUse.report": "举报所写的内容，或咨询这些条款：{emailAddress}",
    "TermsOfUse.NotAgreed": "请勾选方框，同意使用条款。",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "这里是学习使用 {siteName} 的安全空间。在此输入的任何内容都可能随时被删除。",

    "language.label": "语言",
    "language.choose": "更换",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "有新内容可以阅读。",
    "whatsNew.admin.message": "有面向赛事管理者的新内容。",
    "whatsNew.view": "查看新内容",
    "whatsNew.later": "下次再提醒我",
    "whatsNew.never": "不再显示此提醒",

    "form.otherwise": "有些地方不对。请检查所填内容后重试。",

    // The account menu in the header.
    "account.menu": "账户",
    "account.register": "注册",
    "account.signIn": "登录",
    "account.forgotPassword": "忘记密码",
    "account.signOut": "退出登录",
    "account.profile": "个人资料",
    "account.changePassword": "修改密码",
    "account.changeEmailAddress": "修改电子邮件地址",
    "account.changeName": "修改姓名",
    "account.setPassword": "设置密码",
    "account.forgetAccount": "抹除账户",

    "register.title": "注册",
    "register.emailAddress": "电子邮件地址",
    "register.submit": "注册",
    "register.withGoogle": "使用 Google 注册",
    "register.or": "或",
    // Said above the form when Google sent the reader back without them being
    // let in.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google 未确认该电子邮件地址属于您，因此无法在这里通过 Google 使用。请改用下方的电子邮件地址。",
    "SignInWithGoogle.LinkedToAnother":
      "该电子邮件地址已有账户，并已关联到另一个 Google 账号。请使用那个 Google 账号登录，或使用电子邮件地址和密码登录。",
    "SignInWithGoogle.NameMissing":
      "Google 没有告诉我们您的姓名，而账户需要姓名。请改用下方的电子邮件地址。",
    "Google.Unreachable":
      "暂时无法连接 Google。请几分钟后重试，或使用下方的电子邮件地址。",
    "Registration.NotAPerson":
      "这看起来不像是真人操作。请重试；如果仍然如此，请等几分钟后再来。",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "请输入电子邮件地址。",
    "EmailAddress.NoAt": "电子邮件地址中要有 @。",
    "EmailAddress.MoreThanOneAt": "电子邮件地址中只能有一个 @。",
    "EmailAddress.NoDomain":
      "电子邮件地址的 @ 后面要有域名，例如 example.com。",

    "welcome.title": "请查收邮件",
    "welcome.checkEmail":
      "一封邮件正在发往您提供的地址。请点击邮件中的链接继续。",
    "welcome.nothingArrived": "如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "welcome.home": "返回 {siteName}",
    "newConfirmationLink.title": "获取新链接",
    "newConfirmationLink.explanation":
      "确认电子邮件地址的链接已过期。请申请新链接，它会发送到您注册时使用的地址。",
    "newConfirmationLink.send": "给我发送新链接",
    "newConfirmationLink.home": "返回 {siteName}",
    "newConfirmationLink.signIn": "登录",
    "newConfirmationLink.sent.title": "请查收邮件",
    "newConfirmationLink.sent.explanation":
      "新链接正在发送。请点击它来确认您的电子邮件地址。如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "newConfirmationLink.alreadyConfirmed.title": "该电子邮件地址已确认",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "无需再确认。请使用确认时设置的密码登录。",
    "newConfirmationLink.noLongerWorks.title": "该链接已失效",
    "newConfirmationLink.noLongerWorks.explanation":
      "请检查您是否点击了邮件中的完整链接，末尾没有缺失任何内容。如果仍然无效，请重新注册，我们会发送新链接。",
    "newConfirmationLink.tooMany.title": "请稍后再试",
    "newConfirmationLink.tooMany.explanation":
      "最近已向该地址发送了多个链接。请等待一小时后再申请，期间请留意垃圾邮件文件夹。",

    "forgotPassword.title": "忘记密码了？",
    "forgotPassword.emailAddress": "电子邮件地址",
    "forgotPassword.submit": "给我发送重新登录的方式",
    "forgotPassword.home": "返回 {siteName}",
    "forgotPassword.sent.title": "请查收邮件",
    "forgotPassword.sent.explanation":
      "如果该地址有账户，设置新密码的链接正在发送。请在一小时内点击。如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "forgotPassword.tryAgainLater":
      "最近从这里申请重新登录的次数过多。请等待一小时后再试。",

    "setNewPassword.title": "设置新密码",
    "setNewPassword.password": "密码",
    "setNewPassword.confirmPassword": "确认密码",
    "setNewPassword.submit": "设置我的新密码",
    "setNewPassword.home": "返回 {siteName}",
    "setNewPassword.signIn": "登录",
    "setNewPassword.askAgain": "申请新链接",
    "setNewPassword.changed.title": "您的密码已修改",
    "setNewPassword.changed.explanation":
      "您在所有地方的登录都已退出。请使用新密码登录。",
    "setNewPassword.expired.title": "该链接已过期",
    "setNewPassword.expired.explanation":
      "设置新密码的链接有效期为一小时。请再申请一个，它会发送到同一地址。",
    "setNewPassword.noLongerWorks.title": "该链接已失效",
    "setNewPassword.noLongerWorks.explanation":
      "它可能已被使用过，或者末尾缺失了内容。如果仍需要，请再申请一个。",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "暂时无法检查您的密码，因此密码尚未修改。请几分钟后重试；您的链接在过期前仍然有效。",

    "forgetAccount.title": "抹除您的账户",
    "forgetAccount.explanation":
      "您的姓名和电子邮件地址可以被永久抹除为不可读，账户也会被关闭。为确认是您本人，我们会先向账户地址发送一封带链接的邮件，在您点击链接之前不会抹除任何内容。",
    "forgetAccount.submit": "给我发送链接",
    "forgetAccount.sent.title": "请查收邮件",
    "forgetAccount.sent.explanation":
      "我们已向您的账户地址发送了一个链接。它的有效期为 15 分钟，并且只在您登录此账户时有效。",
    "forgetAccount.confirm.title": "永久抹除您的账户？",
    "forgetAccount.confirm.explanation":
      "一旦抹除，任何人都再也无法读取您的姓名和电子邮件地址，该账户也无法再登录。此操作无法撤销。",
    "forgetAccount.confirm.submit": "抹除我的账户",
    "forgetAccount.forgotten.title": "您的账户已被抹除",
    "forgetAccount.forgotten.explanation":
      "您的姓名和电子邮件地址已无法读取，您在所有地方的登录也都已退出。",
    "forgetAccount.noLongerWorks.title": "该链接已失效",
    "forgetAccount.noLongerWorks.explanation":
      "它可能已过期、已被使用，或属于您当前未登录的账户。如果仍想抹除账户，请从您的账户中重新申请。",
    "forgetAccount.lastAdministrator.title": "无法抹除您的账户",
    "forgetAccount.lastAdministrator.explanation":
      "您是本网站唯一的管理员。请先把管理员角色授予其他人，然后才能抹除您的账户。",
    "forgetAccount.askAgain": "重新申请",
    "forgetAccount.home": "返回 {siteName}",

    "registrationsSuspended.title": "暂时无法注册",
    "registrationsSuspended.explanation":
      "注册所需的某项服务暂时无法连接，在其恢复之前没有人能够注册。您输入的内容均未保存。",
    "registrationsSuspended.tryAgainLater":
      "请稍后再试。网站管理员已收到通知。",
    "registrationsSuspended.home": "返回 {siteName}",

    "signIn.title": "登录",
    "signIn.emailAddress": "电子邮件地址",
    "signIn.password": "密码",
    "signIn.submit": "登录",
    "signIn.forgotPassword": "忘记密码？",
    "signIn.register": "注册",
    "signIn.withGoogle": "使用 Google 登录",
    "signIn.or": "或",
    "signIn.tryAgainLater": "最近尝试的次数过多。请等待一小时后再试。",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed": "电子邮件地址或密码不正确。请重试。",

    "profile.title": "个人资料",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "姓名：",
    "profile.emailAddress": "电子邮件地址：",

    "changeName.title": "修改姓名",
    "changeName.name": "姓名",
    "changeName.submit": "修改姓名",

    "setPassword.title": "设置密码",
    "setPassword.explanation":
      "您的账户没有密码：您是通过 Google 登录的。如果还想用密码登录，我们会向 {emailAddress} 发送一个设置密码的链接。",
    "setPassword.submit": "给我发送链接",
    "setPassword.sent.title": "请查收邮件",
    "setPassword.sent.explanation":
      "我们已给您发送了设置密码的链接。它的有效期为一小时。",
    "setPassword.profile": "返回个人资料",

    "changePassword.title": "修改密码",
    "changePassword.currentPassword": "当前密码",
    "changePassword.password": "新密码",
    "changePassword.passwordConfirmation": "确认密码",
    "changePassword.forgotPassword": "忘记密码？",
    "changePassword.submit": "修改密码",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "这不是您的密码。",

    "changeEmailAddress.title": "修改电子邮件地址",
    "changeEmailAddress.emailAddress": "新的电子邮件地址",
    "changeEmailAddress.currentPassword": "当前密码",
    "changeEmailAddress.submit": "发送确认链接",
    "changeEmailAddress.sent.title": "请查收邮件",
    "changeEmailAddress.sent.explanation":
      "确认迁移的链接已发送到新的电子邮件地址。请在登录状态下点击它，把您的账户迁移过去。",
    "changeEmailAddress.confirm.title": "迁移您的账户",
    "changeEmailAddress.confirm.explanation":
      "您的账户将迁移到 {emailAddress}。今后您将使用该地址登录。",
    "changeEmailAddress.confirm.submit": "迁移我的账户",
    "changeEmailAddress.noLongerWorks.title": "该链接已失效",
    "changeEmailAddress.noLongerWorks.explanation":
      "它已过期、已被使用，或不是为您当前登录的账户发送的。请从您的个人资料中重新申请。",
    "changeEmailAddress.taken.title": "您的账户尚未迁移",
    "changeEmailAddress.profile": "返回个人资料",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "这不是您的密码。",
    "ChangeEmailAddress.Unchanged": "您的账户已经使用这个地址。",
    "ChangeEmailAddress.Taken":
      "该电子邮件地址现在已有自己的账户，因此您的账户无法迁移过去。",

    "confirmEmailAddress.title": "确认您的电子邮件地址",
    "confirmEmailAddress.name": "姓名",
    "confirmEmailAddress.password": "密码",
    "confirmEmailAddress.confirmPassword": "确认密码",
    "confirmEmailAddress.submit": "确认我的电子邮件地址",
    "confirmEmailAddress.signIn": "登录",
    "confirmEmailAddress.home": "返回 {siteName}",
    "confirmEmailAddress.confirmed.title": "您的电子邮件地址已确认",
    "confirmEmailAddress.confirmed.explanation":
      "您的账户已就绪。请使用您刚才提供的电子邮件地址和密码登录。",
    "confirmEmailAddress.expired.title": "该链接已过期",
    "confirmEmailAddress.expired.explanation":
      "确认电子邮件地址的链接有效期为 24 小时。请申请新链接，它会发送到同一地址。",
    "confirmEmailAddress.expired.newLink": "给我发送新链接",
    "confirmEmailAddress.noLongerWorks.title": "该链接已失效",
    "confirmEmailAddress.noLongerWorks.explanation":
      "请检查您是否点击了邮件中的完整链接，末尾没有缺失任何内容。如果仍然无效，请重新注册，我们会发送新链接。",
    "confirmEmailAddress.alreadyConfirmed.title": "该电子邮件地址已确认",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "无需再做任何事。请使用确认时设置的密码登录。",

    // A rule broken, keyed by its code. Said to whoever typed it, beneath the
    // field it reads.
    "PersonName.Missing": "请输入姓名。",
    "PersonName.TooShort": "姓名至少要有 3 个字符。",
    "PersonName.TooLong": "姓名最多可以有 254 个字符。",
    "WorldRankingName.TooShort": "世界排名姓名至少要有 3 个字符。",
    "WorldRankingName.TooLong": "世界排名姓名最多可以有 254 个字符。",
    "Password.Missing": "请输入密码。",
    "Password.TooShort": "密码至少要有 12 个字符。",
    "Password.ConfirmationDiffers": "这与上面的密码不一致。请再输入一遍。",
    "Password.Breached":
      "这个密码曾在别处的数据泄露中出现过，在这里使用不安全。请换一个。",

    "javaScriptRequired.title": "需要启用脚本",
    "javaScriptRequired.explanation":
      "注册需要为本网站启用脚本，以便确认注册的是真人。请启用后重新注册。",
    "javaScriptRequired.register": "返回注册",
    "javaScriptRequired.home": "返回 {siteName}",

    "errors.backHome": "返回 {siteName}",
    "errors.notFound": "未找到",
    "errors.refused": "无法完成该操作",
    "errors.refusedDetail": "所发送的内容有些地方不对。",
    "errors.sorry": "抱歉",
    "errors.sorryDetail": "无法处理该请求。",
    "errors.failed": "出错了",
    "errors.reference": "参考编号 {reference}。",
    "errors.recorded":
      "该错误已记录，并已向管理员发送邮件。给管理员发邮件时，请附上参考编号，并说明您当时在做什么，这会有所帮助。",
    "errors.message": "给管理员发邮件",
    "errors.messageSubject": "{siteName} 上的错误 {reference}",
    "errors.messageBody": "发生这个错误时我正在做的事：\n\n",
    "errors.unavailable": "网站暂时无法使用",
    "errors.unavailableDetail": "网站暂时无法连接所需的服务。请稍后再试。",
    "errors.maintenance": "网站正在维护中。",
    "errors.maintenanceMinutes": "预计 {minutes} 分钟后恢复。",
    "errors.maintenanceMinute": "预计 1 分钟后恢复。",
    "errors.maintenanceLonger": "耗时比预期更长，很快就会恢复。",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "最新成绩",
    "home.recentResults.none": "过去七天内没有新增的比赛。",
    "home.upcomingTournaments": "即将举行的赛事",
    "home.upcomingTournaments.none": "未来六十天内没有赛事开始。",
    "home.allTournaments": "{year} 年的所有赛事",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "{year} 年的赛事",
    "year.none": "{year} 年没有赛事开始。",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "{year} 年的{sport}赛事",
    "yearSport.none": "{year} 年没有{sport}赛事开始。",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "最新",
    "tournament.summary": "汇总",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "每场比赛采用{count}局制。",
    "test.vs": "对",
    "test.matches": "场次",
    "test.games": "局数",
    "test.hoops": "球门",
    "teamSummary.tests": "对抗赛",
    "teamSummary.matches": "场次",
    "teamSummary.games": "局数",
    "teamSummary.hoops": "球门",
    "teamSummary.wins": "胜",
    "teamSummary.losses": "负",
    "teamSummary.draws": "平",
    "teamSummary.for": "得",
    "teamSummary.against": "失",
    "teamSummary.net": "净值",
    "tournament.players": "选手",
    "search.label": "搜索",
    "search.tournaments": "赛事",
    "search.competitions": "项目",
    "search.nothingFound": "没有找到任何内容。",
    "players.search.label": "搜索选手",
    "players.search.prompt": "输入选手姓名来查找。",
    "players.search.none": "没有找到选手。",
    "search.more": "只显示前 {count} 个。请多输入一些姓名来缩小搜索范围。",
    "websitePlayer.tournament": "赛事",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} 对 {second}",
    "tournament.notes": "通知",
    "tournament.commentary": "评论",
    "tournament.beat": "胜",
    "tournament.drewWith": "平",
    "tournament.ago.seconds": "{count} 秒",
    "tournament.ago.minutes": "{count} 分钟",
    "tournament.ago.hour": "1 小时",
    "tournament.ago.hours": "{count} 小时",
    "tournament.none": "还没有进行任何比赛。",
    // A tournament's players' page, when it has none.
    "players.none": "还没有添加任何选手。",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "作者：",
    "commentaries.start": "发起新评论",
    // The page that starts a commentary.
    "startCommentary.title": "发起新评论",
    "startCommentary.titleField": "标题",
    "startCommentary.submit": "发起评论",
    // "New" is said to a screen reader in place of the red asterisk.
    "marks.new": "新",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "管理者还没有写任何通知。",
    "note.edited": "已编辑",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "还没有任何留言。",
    "commentary.edited": "已编辑",
    "commentary.edit": "编辑",
    "commentary.delete": "删除",
    "commentary.comment": "留言",
    "commentary.add": "添加留言",
    "commentary.notSent": "留言未能发送。请重新加载页面，看看是否已保存。",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "修改标题",
    "changeCommentaryTitle.submit": "保存",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "编辑留言",
    "editComment.save": "保存",
    "deleteComment.title": "删除留言",
    "deleteComment.question": "删除这条留言？此操作无法撤销。",
    "deleteComment.confirm": "删除留言",
    "deleteComment.keep": "保留",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "比赛",
    "player.competitions": "项目",
    "player.beat": "胜",
    "player.lostTo": "负于",
    "player.drewWith": "平",
    "player.score": "{score} 比 {opponent}",
    "player.noGames": "还没有进行任何比赛。",
    "player.noCompetitions": "还没有参加任何项目。",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "胜",
    "block.matches": "场次",
    "block.netGames": "净胜局",
    "block.games": "局数",
    "block.netHoops": "净胜球门",
    "block.won": "胜",
    "block.lost": "负",
    "block.drawn": "平",
    "block.withdrawn": "已退赛",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "已撤销",
    "block.losses": "负",
    // The three views of a block, offered beneath its heading.
    "competition.views": "视图",
    "competition.view.grid": "表格",
    "competition.view.summary": "汇总",
    "competition.view.orderOfPlay": "比赛顺序",
    "competition.print": "打印",
    "competition.playedTo": "打到 {hoops} 门",
    "blockSummary.ranking":
      "按获胜场次的比例排名，其次按净胜球门。赛事自己的规程可能会对选手作出不同的排名。",
    "orderOfPlay.none": "还没有进行任何比赛。",
    "orderOfPlay.column.game": "比赛",
    "orderOfPlay.column.date": "日期",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "决赛",
    "knockout.round.semis": "半决赛",
    "knockout.round.quarters": "四分之一决赛",
    "knockout.round.number": "第 {number} 轮",
    "knockout.bye": "轮空",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "局数",
    "swiss.wins": "胜",
    "swiss.winShare": "胜率",
    "swiss.results": "成绩",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "后面的轮次",
    "knockout.back": "前面的轮次",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "日期",
    "tournamentList.column.name": "名称",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "仅显示{country}的赛事",
    "tournamentList.usualOrder": "恢复通常的顺序",
    "tournamentList.filter.country": "国家",
    "tournamentList.filter.anyCountry": "所有国家",
    "tournamentList.filter.region": "地区",
    "tournamentList.filter.anyRegion": "所有地区",
    "tournamentList.filter.noRegionsBefore":
      "2026 年 11 月之前的赛事没有地区信息。",
    "tournamentList.filter.sport": "运动",
    "tournamentList.filter.anySport": "所有运动",
    "tournamentList.filter.submit": "筛选",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "年份",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "更早的年份",

    // The admin's words.
    "admin.newerBuild.message": "本网站有新版本可用。",
    "admin.newerBuild.reload": "重新加载",
    "admin.title": "管理",
    "admin.tournaments.new": "新建赛事",
    "admin.tournaments.none": "没有赛事",
    "admin.tournaments.filter.none": "没有符合条件的赛事",
    "admin.tournaments.show": "显示",
    "admin.tournaments.managerScorer": "管理员/记分员",
    "admin.tournaments.worldRanking": "世界排名",
    "admin.tournaments.notWorldRanking": "非世界排名",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "已归档",
    "admin.tournaments.manage": "管理",
    "admin.tournaments.edit": "编辑",
    "admin.tournaments.archive": "归档",
    "admin.tournaments.restore": "恢复",
    "admin.tournaments.scores": "成绩",
    "admin.tournaments.players": "选手",
    "admin.years.label": "年份",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "更早的年份",
    "admin.tournament.name": "名称",
    "admin.tournament.starts": "开始",
    "admin.tournament.finishes": "结束",
    "admin.tournament.format": "赛制",
    "admin.tournament.sport": "运动",
    "admin.tournament.country": "国家",
    "admin.tournament.region": "地区",
    "admin.tournament.subtitle": "副标题",
    "admin.rules.handicap": "使用差点",
    "admin.rules.drawsAllowed": "允许平局",
    "admin.tournament.levelTestsDrawn": "对抗赛打平算平局",
    "admin.rules.worldRankings": "计入世界排名",
    "admin.rules.maximumHoops": "最大门数",
    "admin.tournament.national": "国家级赛事",
    "admin.tournament.international": "国际级赛事",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "无法按现状接受。",
    "admin.newTournament.title": "新建赛事",
    "admin.newTournament.submit": "创建赛事",
    "admin.editTournament.title": "编辑赛事",
    "admin.editTournament.submit": "更新赛事",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "无法修改这个赛事。",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "赛事",
    "admin.view.players": "选手",
    "admin.view.competitions": "项目",
    "admin.view.managers": "管理者",
    "admin.view.notes": "通知",
    "admin.view.scorers": "记分员",
    "admin.view.rankings": "排名",
    "admin.rankings.file":
      "世界排名将使用该赛事的成绩，并通过此功能获取，管理者无需进行任何操作。",
    "admin.rankings.download": "下载用于世界排名的比赛",
    "rankings.notAvailable": "无法提供排名",
    "rankings.notAvailable.sport":
      "该赛事的运动没有世界排名，所以没有可发送的排名。",
    "rankings.notAvailable.notCounted": "该赛事的所有项目都不计入世界排名。",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "无法从这里管理这个赛事。",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "项目",
    "admin.competitionView.players": "选手",
    "admin.competitionView.scores": "成绩",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "赛事及其项目",
    "admin.sections.tournament": "赛事",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "管理员页面",
    "admin.administrator.sections.tournaments": "赛事",
    "admin.administrator.sections.accounts": "账户",
    "admin.administrator.sections.worldRankings": "世界排名",
    "admin.administrator.sections.importErrors": "导入错误",
    "admin.administrator.sections.logs": "日志",
    "admin.administrator.sections.databaseStatus": "数据库访问",
    "admin.administrator.sections.countries": "国家",
    "admin.databaseStatus.title": "数据库访问",
    "admin.databaseStatus.on": "数据库访问已开启。",
    "admin.databaseStatus.off": "数据库访问已关闭。",
    "admin.databaseStatus.expected": "预计网站将在 {minutes} 分钟后恢复。",
    "admin.databaseStatus.expectedOne": "预计网站将在 1 分钟后恢复。",
    "admin.databaseStatus.longer": "耗时比预期更长。",
    "admin.databaseStatus.told": "向读者显示的说明：{words}",
    "admin.databaseStatus.toldUsual": "向读者显示的是通常的说明。",
    "admin.databaseStatus.minutes": "预计分钟数",
    "admin.databaseStatus.words": "给读者的说明",
    "admin.databaseStatus.turnOff": "关闭",
    "admin.databaseStatus.change": "修改",
    "admin.databaseStatus.turnOn": "开启",
    "admin.databaseStatus.minutesNeeded": "需要填写分钟数。",
    "admin.databaseStatus.otherwise": "网站出了点问题。",
    "DatabaseAccess.MinutesNotWhole": "分钟数必须是整数。",
    "DatabaseAccess.MinutesOutOfRange": "分钟数必须在 1 到 1440 之间。",
    "DatabaseAccess.WordsTooLong": "说明不得超过 500 个字符。",
    "DatabaseAccess.NotOff": "数据库访问并未关闭。",
    "admin.administrator.title": "管理员",
    // The accounts page, a section for each role.
    "admin.accounts.title": "账户",
    "admin.roles.add": "添加",
    "admin.roles.administrator.heading": "管理员",
    "admin.roles.administrator.none": "没有其他管理员",
    "admin.roles.administrator.removeTitle": "移除管理员",
    "admin.roles.administrator.removeExplanation":
      "{name} 将不再是本网站的管理员。",
    "admin.roles.ac-world-ranking-officer.heading": "协会槌球世界排名负责人",
    "admin.roles.ac-world-ranking-officer.none": "没有协会槌球世界排名负责人",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "移除协会槌球世界排名负责人",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} 将不再是协会槌球世界排名负责人。",
    "admin.roles.gc-world-ranking-officer.heading": "高尔夫槌球世界排名负责人",
    "admin.roles.gc-world-ranking-officer.none": "没有高尔夫槌球世界排名负责人",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "移除高尔夫槌球世界排名负责人",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} 将不再是高尔夫槌球世界排名负责人。",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon.
    "admin.worldRankings.title": "导入世界排名选手",
    "admin.worldRankings.import": "导入",
    "admin.worldRankings.log": "导入情况",
    "admin.worldRankings.ac.reading": "正在读取协会槌球名单",
    "admin.worldRankings.ac.read": "已读取的协会槌球选手：{players}",
    "admin.worldRankings.ac.kept": "已保留的协会槌球选手：{players}",
    "admin.worldRankings.ac.refused":
      "无法读取协会槌球名单，因此其中的选手保持原样。",
    "admin.worldRankings.gc.reading": "正在读取高尔夫槌球名单",
    "admin.worldRankings.gc.read": "已读取的高尔夫槌球选手：{players}",
    "admin.worldRankings.gc.kept": "已保留的高尔夫槌球选手：{players}",
    "admin.worldRankings.gc.refused":
      "无法读取高尔夫槌球名单，因此其中的选手保持原样。",
    "admin.worldRankings.finished": "已完成",
    "admin.worldRankings.failed": "导入未能完成。",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "网站出了点问题。",
    "WorldRankingLists.Unreachable": "无法连接世界排名的网站。",
    "WorldRankingLists.Unreadable":
      "名单的格式与世界排名网站的格式不一致：其中有一行无法读取、名单里没有任何人，或者不是 UTF-8 编码。",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "导入错误",
    "admin.importErrors.none": "没有导入错误",
    "admin.importErrors.otherwise": "网站出了点问题。",
    "admin.countries.title": "国家",
    "admin.countries.none": "没有在名单未列出的国家举办的赛事",
    "admin.countries.oldSite": "旧网站",
    "admin.countries.otherwise": "网站出了点问题。",
    "admin.logs.title": "日志",
    "admin.logs.severity": "严重程度",
    "admin.logs.text": "查找",
    "admin.logs.show": "显示",
    "admin.logs.prune": "清理",
    "admin.logs.pruneAsk": "删除一小时之前的日志？删除后无法找回。",
    "admin.logs.removed": "已删除 {count} 条记录",
    "admin.logs.none": "没有日志记录",
    "admin.logs.otherwise": "网站出了点问题。",
    "admin.hover.logs.show": "显示符合条件的记录",
    "admin.hover.logs.prune": "删除一小时之前的日志",
    "admin.hover.logs.pruneAgree": "删除一小时之前的日志",
    "admin.importError.title": "导入错误",
    "admin.importError.documentId": "文档编号",
    "admin.importError.tournament": "赛事",
    "admin.importError.competition": "项目",
    "admin.importError.newSite": "新网站",
    "admin.importError.oldSite": "旧网站",
    "ImportErrorKept.NotFound": "导入没有为该文档保留任何错误。",
    "admin.competitionView.otherwise": "无法从这里管理这个项目。",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "小组赛",
    "admin.competitions.knockout": "淘汰赛",
    "admin.competitions.swiss": "瑞士制",
    "admin.competitions.view": "查看",
    "admin.competitions.edit": "编辑",
    "admin.competitions.up": "上移",
    "admin.competitions.down": "下移",
    "admin.competitions.archive": "归档",
    "admin.competitions.restore": "恢复",
    "admin.competitions.archived": "已归档的项目",
    "admin.competitions.none": "没有项目",
    "admin.competitions.add": "添加项目",
    // The competition dialog.
    "admin.competition.addTitle": "添加项目",
    "admin.competition.editTitle": "编辑项目",
    "admin.competition.name": "名称",
    "admin.competition.kind": "类型",
    "admin.competition.bestOf": "几局制",
    "admin.competition.rounds": "轮数",
    "admin.competition.places": "名额",
    "admin.competition.round": "第 {number} 轮",
    "admin.competition.bestOfs": "各轮几局制",
    "admin.competition.quarters": "四分之一决赛",
    "admin.competition.semis": "半决赛",
    "admin.competition.final": "决赛",
    "admin.competition.add": "添加",
    "admin.competition.save": "保存",
    "admin.competition.added": "已添加 {name}。",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise": "无法按现状保存这个项目。",
    "CompetitionName.Missing": "请输入名称。",
    "CompetitionName.TooLong": "名称最多可以有 254 个字符。",
    "CompetitionName.NoLetterOrDigit": "名称中要有文字或数字。",
    "Tournament.KnockoutPlayerHasGames":
      "这个签表中的选手已有比赛，因此名额不能更改。",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "已有分出胜负的比赛的轮次，不能改为更少的局数。",
    "Tournament.KnockoutLaterRoundHasGames":
      "后面的轮次一旦已有比赛，这一轮就不能再更改。",
    "Tournament.CompetitionNameTaken": "本赛事中已有另一个项目使用这个名称。",
    "Tournament.MaximumHoopsInvalid":
      "请输入至少为 1 的整数门数，留空表示没有上限。",
    "BestOf.NotWhole": "请输入整数局数。",
    "BestOf.TooSmall": "一场比赛至少要采用 1 局制。",
    "Rounds.NotWhole": "请输入整数轮数。",
    "Rounds.TooSmall": "小组赛至少要进行 1 轮。",
    "KnockoutDraw.EvenBestOf":
      "淘汰赛的每场比赛必须分出胜负，因此局数必须是奇数。",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "创建新赛事",
    "admin.hover.tournaments.manage": "管理这个赛事的选手、队伍、项目和成绩",
    "admin.hover.tournaments.edit": "修改这个赛事的详情",
    "admin.hover.tournaments.scores": "录入这个赛事的成绩",
    "admin.hover.tournaments.players": "管理这个赛事的选手",
    "admin.hover.competitions.view": "打开这个项目，查看并录入选手和成绩",
    "admin.hover.tests.view": "打开这场对抗赛，查看并录入成绩",
    "admin.hover.teams.view": "打开这支队伍，查看并管理队员",
    "admin.hover.dialog.player.add": "把这位选手添加到赛事",
    "admin.hover.dialog.player.save": "保存对这位选手的修改",
    "admin.hover.dialog.team.add": "把这支队伍添加到赛事",
    "admin.hover.dialog.team.save": "保存对这支队伍的修改",
    "admin.hover.dialog.test.add": "把这场对抗赛添加到赛事",
    "admin.hover.dialog.test.save": "保存对这场对抗赛的修改",
    "admin.hover.dialog.competition.add": "把这个项目添加到赛事",
    "admin.hover.dialog.competition.save": "保存对这个项目的修改",
    "admin.hover.dialog.score.add": "把这个成绩添加到项目",
    "admin.hover.dialog.score.save": "保存对这个成绩的更正",
    "admin.hover.dialog.carryForward.save": "结转这位选手的成绩",
    "admin.hover.dialog.tournament.new": "创建这个赛事",
    "admin.hover.dialog.tournament.edit": "保存对这个赛事的修改",
    "admin.hover.modal.cancel": "关闭，不保存任何内容",
    "admin.hover.modal.ok": "关闭此消息",
    "admin.hover.tab": "显示“{name}”标签页",
    "admin.hover.tournaments.archive": "归档这个赛事；可以恢复",
    "admin.hover.tournaments.restore": "恢复这个已归档的赛事",
    "admin.hover.players.add": "向这个赛事添加选手",
    "admin.hover.players.addMany": "一次向这个赛事添加多位选手",
    "admin.hover.dialog.players.add": "把这些选手添加到赛事",
    "admin.hover.players.edit": "修改这位选手的详情",
    "admin.hover.players.up": "把这位选手在列表中上移",
    "admin.hover.players.down": "把这位选手在列表中下移",
    "admin.hover.players.archive": "归档这位选手；可以恢复",
    "admin.hover.players.restore": "恢复这位已归档的选手",
    "admin.hover.teams.add": "向这个赛事添加队伍",
    "admin.hover.teams.edit": "修改这支队伍的详情",
    "admin.hover.teams.up": "把这支队伍在列表中上移",
    "admin.hover.teams.down": "把这支队伍在列表中下移",
    "admin.hover.teams.archive": "归档这支队伍；可以恢复",
    "admin.hover.teams.restore": "恢复这支已归档的队伍",
    "admin.hover.competitions.add": "向这个赛事添加项目",
    "admin.hover.competitions.edit": "修改这个项目的详情",
    "admin.hover.competitions.up": "把这个项目在列表中上移",
    "admin.hover.competitions.down": "把这个项目在列表中下移",
    "admin.hover.competitions.archive": "归档这个项目；可以恢复",
    "admin.hover.competitions.restore": "恢复这个已归档的项目",
    "admin.hover.tests.add": "添加两支队伍之间的对抗赛",
    "admin.hover.tests.edit": "修改这场对抗赛的详情",
    "admin.hover.tests.up": "把这场对抗赛在列表中上移",
    "admin.hover.tests.down": "把这场对抗赛在列表中下移",
    "admin.hover.tests.archive": "归档这场对抗赛；可以恢复",
    "admin.hover.tests.restore": "恢复这场已归档的对抗赛",
    "admin.hover.tests.toTeams": "前往“队伍”标签页，添加对抗赛所需的队伍",
    "admin.hover.scores.add": "向这个项目添加一局的成绩",
    "admin.hover.scores.edit": "更正这个成绩",
    "admin.hover.scores.archive": "归档这个成绩，使其不再计入；可以恢复",
    "admin.hover.scores.restore": "恢复这个已归档的成绩，使其重新计入",
    "admin.hover.scores.withdraw": "把这个成绩留在列表中，但不再计入",
    "admin.hover.scores.unwithdraw": "让这个已撤销的成绩重新计入",
    "admin.hover.scores.up": "把这个成绩在列表中前移",
    "admin.hover.scores.down": "把这个成绩在列表中后移",
    "admin.hover.competitionPlayers.add": "把所选的选手加入这个项目",
    "admin.hover.competitionPlayers.up": "把这位选手在列表中上移",
    "admin.hover.competitionPlayers.down": "把这位选手在列表中下移",
    "admin.hover.competitionPlayers.remove": "把这位选手移出项目",
    "admin.hover.competitionPlayers.withdraw": "让这位选手退出项目",
    "admin.hover.competitionPlayers.unwithdraw": "让这位已退赛的选手回到项目中",
    "admin.hover.competitionPlayers.carryForward":
      "从另一个项目结转这位选手的成绩",
    "admin.hover.notes.add": "为这个赛事写一条新通知",
    "admin.hover.notes.edit": "修改这条通知",
    "admin.hover.notes.delete": "删除这条通知",
    "admin.hover.note.add": "保存这条通知并添加到赛事",
    "admin.hover.note.save": "保存对这条通知的修改",
    "admin.hover.people.add": "授予此人该角色",
    "admin.hover.people.remove": "收回此人的该角色",
    "admin.hover.worldRankings.import": "获取世界排名并添加其中的选手",
    "admin.modal.cancel": "取消",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "确定",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "电子邮件地址",
    "admin.people.remove": "移除",
    "admin.people.otherwise": "无法完成该操作。",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "您",
    "admin.managers.add": "添加管理者",
    "admin.managers.email": "给管理者发邮件",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "没有管理者",
    "admin.managers.removeTitle": "移除管理者",
    "admin.managers.removeExplanation": "{name} 将不能再管理这个赛事。",
    "admin.managers.removeYourself.explanation":
      "您将不能再管理这个赛事，而且这里没有人能为您撤销。只有其他管理者才能让您重新成为管理者。",
    "admin.managers.otherwise": "无法把该地址设为管理者。",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "添加选手",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "无法添加这位选手。",
    "admin.competitionPlayers.choose": "要添加的选手",
    "admin.competitionPlayers.nobody": "选择选手",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "所有选手都已在项目中",
    "admin.competitionPlayers.none": "没有选手",
    "admin.competitionPlayers.up": "上移",
    "admin.competitionPlayers.down": "下移",
    "admin.competitionPlayers.remove": "移除",
    "admin.competitionPlayers.withdraw": "退赛",
    "admin.competitionPlayers.unwithdraw": "取消退赛",
    "admin.competitionPlayers.withdrawn": "已退赛的选手",
    "admin.competitionPlayers.removeTitle": "移除选手",
    "admin.competitionPlayers.removeQuestion":
      "{name} 将被移出项目。此操作无法撤销。",
    "admin.competitionPlayers.withdrawTitle": "让选手退赛",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} 将不再参加该项目的比赛，尚未进行的比赛将在没有该选手的情况下判定。",
    "admin.competitionPlayers.carryForward": "结转",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "结转 - {name}",
    "admin.carryForward.save": "保存",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "无法保存这次结转。",
    "admin.carryForward.matchWins": "胜场",
    "admin.carryForward.matchLosses": "负场",
    "admin.carryForward.gameWins": "胜局",
    "admin.carryForward.gameLosses": "负局",
    "admin.carryForward.hoopsFor": "得球门",
    "admin.carryForward.hoopsAgainst": "失球门",
    "CarryForward.MatchWinsNotWhole": "请为胜场输入整数。",
    "CarryForward.MatchWinsBelowZero": "胜场请输入 0 或更大的数。",
    "CarryForward.MatchLossesNotWhole": "请为负场输入整数。",
    "CarryForward.MatchLossesBelowZero": "负场请输入 0 或更大的数。",
    "CarryForward.GameWinsNotWhole": "请为胜局输入整数。",
    "CarryForward.GameWinsBelowZero": "胜局请输入 0 或更大的数。",
    "CarryForward.GameLossesNotWhole": "请为负局输入整数。",
    "CarryForward.GameLossesBelowZero": "负局请输入 0 或更大的数。",
    "CarryForward.HoopsForNotWhole": "请为得球门输入整数。",
    "CarryForward.HoopsForBelowZero": "得球门请输入 0 或更大的数。",
    "CarryForward.HoopsAgainstNotWhole": "请为失球门输入整数。",
    "CarryForward.HoopsAgainstBelowZero": "失球门请输入 0 或更大的数。",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "添加成绩",
    "admin.scores.none": "没有成绩",
    "admin.scores.edit": "编辑",
    "admin.scores.drawNotFilledTitle": "签表尚未排满",
    "admin.scores.archive": "归档",
    "admin.scores.up": "上移",
    "admin.scores.down": "下移",
    "admin.scores.restore": "恢复",
    "admin.scores.archived": "已归档的成绩",
    "admin.scores.archivedSaid": "已归档",
    "admin.scores.withdraw": "撤销",
    "admin.scores.unwithdraw": "取消撤销",
    "admin.scores.withdrawnSaid": "已撤销",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "无法完成该操作。",
    "admin.score.title": "添加成绩",
    "admin.score.add": "添加一局",
    "admin.score.winner": "胜者",
    "admin.score.winnerScore": "胜者得分",
    "admin.score.loser": "负者",
    "admin.score.loserScore": "负者得分",
    "admin.score.beat": "胜",
    "admin.score.added": "已添加{winner}战胜{loser}的一局。",
    "admin.score.otherwise": "无法添加这一局。",
    "admin.score.correctTitle": "编辑成绩",
    "admin.score.save": "保存",
    "admin.score.notCorrected": "无法更正这个成绩。",
    "Game.WinnerMissing": "请选择胜者。",
    "Game.WinnerScoreMissing": "请输入胜者的得分。",
    "Game.LoserMissing": "请选择负者。",
    "Game.LoserScoreMissing": "请输入负者的得分。",
    "Score.NoPoints": "成绩要以得分的数字开头。",
    "Game.SamePlayer": "选手不能和自己比赛。",
    "Game.WinnerNotAhead": "胜者的得分必须高于负者，或标记为获胜。",
    "Game.LoserMarked": "负者的得分不能标记为获胜。",
    "Game.ResultChanged": "更正不能改变结果：胜的仍是胜，平的仍是平。",
    "Competition.MatchDecided": "他们的比赛已经分出胜负。",
    "Competition.DrawFull": "无法添加该选手，因为淘汰赛的名额已满。",
    "Competition.DrawNotFilled":
      "在淘汰赛的每个位置都排上选手或轮空之前，不能添加成绩。",
    "Competition.ByeOutsideKnockout": "只有淘汰赛才能有轮空。",
    "Competition.NotDrawnToMeet": "这两位选手目前没有在淘汰赛中被抽到对阵。",
    "Competition.WinnerHasPlayedOn":
      "这场比赛的胜者已经打过下一场，因此不能再更改谁获胜。",
    "CompetitionPlayer.Withdrawn": "已退赛的选手不再比赛。",
    "admin.players.add": "添加选手",
    "admin.players.addMany": "批量添加选手",
    "admin.players.none": "没有选手",
    "admin.players.edit": "编辑",
    "admin.players.archive": "归档",
    "admin.players.restore": "恢复",
    "admin.players.up": "上移",
    "admin.players.down": "下移",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "归档选手",
    "admin.players.archiveQuestion": "{name} 将被移出以下项目：",
    "admin.players.archive.explanation": "恢复该选手不会让其回到这些项目中。",
    "admin.players.archived": "已归档的选手",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "已归档",
    // The player dialog.
    "admin.player.addTitle": "添加选手",
    "admin.player.editTitle": "编辑选手",
    "admin.player.name": "姓名",
    "admin.player.handicap": "差点",
    "admin.player.representing": "代表",
    "admin.player.worldRankingName": "世界排名选手姓名",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "世界排名中有这个姓名。",
    "admin.player.worldRankingQuestioned":
      "世界排名中没有这个姓名的选手。可能是拼写有误，也可能这位选手是新加入排名的。",
    "admin.player.flag": "旗帜",
    "admin.player.add": "添加",
    "admin.player.save": "保存",
    "admin.player.added": "已添加 {name}。",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "批量添加选手",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "帮助",
    "admin.players.many": "选手",
    "admin.players.line": "第 {line} 行：{words}",
    "AddPlayers.FieldsMissing": "请在第一行写出各字段的名称。",
    "AddPlayers.NameMissing": "字段必须包含 Name。",
    "AddPlayers.FieldNotAllowed":
      "字段可以是 Name、Representing、Flag、Handicap 或 WorldRankingPlayerName。",
    "AddPlayers.FieldRepeated": "每个字段只能出现一次。",
    "AddPlayers.PlayersMissing": "请在第一行之后，每行写一位选手。",
    "AddPlayers.TooManyPlayers":
      "一个列表最多可包含 500 位选手。其余的请放到另一个列表中添加。",
    "AddPlayers.ValuesMismatched":
      "每位选手对第一行所列的每个字段都需要有一个值，或者留空。",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "无法按现状保存这位选手。",
    "Tournament.PlayerNameTaken": "本赛事中已有另一位选手使用这个姓名。",
    "TournamentPlayer.NoSuchFlag": "请从现有的旗帜中选择。",
    "TournamentPlayer.HandicapMalformed":
      "请把差点写成数字。例如：-1.5、-1、0、1、2.5、24。",
    "TournamentPlayer.NamedBye": "选手不能取名为“Bye”。",
    "TournamentPlayer.NoLetterOrDigit": "姓名中要有文字或数字。",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "无需添加 Bye",
    "admin.player.byes":
      "Bye 不是赛事的选手。淘汰赛在添加选手时会提供“Bye”这个选项，签表需要多少个就可以选多少次。",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "队伍",
    "admin.view.tests": "对抗赛",
    "admin.teams.add": "添加队伍",
    "admin.teams.none": "没有队伍",
    "admin.teams.edit": "编辑",
    "admin.teams.view": "查看",
    "admin.teams.archive": "归档",
    "admin.teams.restore": "恢复",
    "admin.teams.up": "上移",
    "admin.teams.down": "下移",
    "admin.teams.archived": "已归档的队伍",
    "admin.teams.archivedSaid": "已归档",
    "admin.team.addTitle": "添加队伍",
    "admin.team.editTitle": "编辑队伍",
    "admin.team.name": "名称",
    "admin.team.shortName": "简称",
    "admin.team.shortName.explanation":
      "对抗赛中用来称呼这支队伍的名字，如 AUS v ENG。",
    "admin.team.flag": "旗帜",
    "admin.team.add": "添加",
    "admin.team.save": "保存",
    "admin.team.added": "已添加 {name}。",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "无法按现状保存这支队伍。",
    "admin.teamView.otherwise": "无法从这里查看这支队伍。",
    "admin.teamView.players": "选手",
    "TeamName.Missing": "请填写队伍的名称。",
    "TeamName.TooLong": "这个名称太长了。",
    "admin.notes.add": "添加通知",
    "admin.notes.none": "没有通知",
    "admin.notes.edit": "编辑",
    "admin.notes.delete": "删除",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "删除通知",
    "admin.notes.deleteQuestion": "删除通知“{title}”？",
    "admin.notes.delete.explanation": "通知一旦删除就永远消失，无法找回。",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "无法完成该操作。",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "添加通知",
    "admin.note.editTitle": "编辑通知",
    "admin.note.title": "标题",
    "admin.note.description": "说明",
    "admin.note.write": "编写",
    "admin.note.preview": "预览",
    "admin.note.toolbar": "格式",
    "admin.note.tool.heading": "标题",
    "admin.note.tool.bold": "粗体",
    "admin.note.tool.italic": "斜体",
    "admin.note.tool.quote": "引用",
    "admin.note.tool.code": "代码",
    "admin.note.tool.link": "链接",
    "admin.note.tool.numberedList": "编号列表",
    "admin.note.tool.bulletedList": "项目符号列表",
    "admin.note.tool.taskList": "任务列表",
    "admin.note.add": "添加",
    "admin.note.save": "保存",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "无法按现状保存这条通知。",
    "ManagerNoteTitle.Missing": "请给通知起个标题。",
    "ManagerNoteTitle.TooLong": "这个标题太长了。",
    "ManagerNoteTitle.NoLetterOrDigit": "标题中要有文字或数字。",
    "ManagerNoteDescription.TooLong": "这段说明太长了。",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "这条通知已不存在。可能是其他管理者删除了它。",
    "EditManagerNote.NoSuchManagerNote":
      "这条通知已不存在。可能是其他管理者删除了它。",
    "DeleteManagerNote.NoSuchManagerNote":
      "这条通知已不存在。可能是其他管理者删除了它。",
    "ManagerNote.Deleted": "这条通知已被删除。可能是其他管理者删除了它。",
    "CommentaryTitle.Missing": "请给评论起个标题。",
    "CommentaryTitle.TooLong": "这个标题太长了。",
    "CommentaryTitle.NoLetterOrDigit": "标题中要有文字或数字。",
    "Commentary.TitleTaken": "已有另一条评论使用这个标题。",
    "CommentText.Missing": "请在留言中写点内容。",
    "CommentText.TooLong": "这条留言太长了。",
    "TeamShortName.Missing": "请给队伍起个简称。",
    "TeamShortName.TooLong": "简称最多可以有 10 个字符。",
    "TeamShortName.NoLetterOrDigit": "简称中要有文字或数字。",
    "Team.ShortNameLongerThanName": "简称不能比队伍的名称长。",
    "Team.NoSuchFlag": "请从现有的旗帜中选择。",
    "Team.Archived": "这支队伍已归档，需要先恢复。",
    "Team.InATest": "这支队伍参加了对抗赛，不能归档。",
    "Team.PlayerNameTaken": "本队中已有另一位队员使用这个姓名。",
    "TeamPlayer.NamedBye": "选手不能取名为“Bye”。",
    "TeamPlayer.Archived": "这位选手已归档，需要先恢复。",
    "TeamPlayer.HasGames": "这位选手已经比过赛，不能归档。",
    "Tournament.TeamNameTaken": "本赛事中已有另一支队伍使用这个名称。",
    "Tournament.TeamShortNameTaken": "本赛事中已有另一支队伍使用这个简称。",
    "Tournament.NoSuchTeam": "本赛事在这个地址没有队伍。",
    "Tournament.TeamArchived": "这支队伍已归档，只能从“队伍”标签页恢复。",
    "admin.tests.add": "添加对抗赛",
    "admin.tests.none": "没有对抗赛",
    "admin.tests.edit": "编辑",
    "admin.tests.view": "查看",
    "admin.tests.archive": "归档",
    "admin.tests.restore": "恢复",
    "admin.tests.up": "上移",
    "admin.tests.down": "下移",
    "admin.tests.archived": "已归档的对抗赛",
    "admin.tests.twoTeamsNeeded":
      "对抗赛在两支队伍之间进行，所以要先有两支队伍。",
    "admin.tests.toTeams": "前往队伍",
    "admin.tests.matches.one": "{count} 场比赛",
    "admin.tests.matches.other": "{count} 场比赛",
    "admin.tests.bestOf": "{games}局制",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "无法完成该操作。",
    "admin.test.addTitle": "添加对抗赛",
    "admin.test.editTitle": "编辑对抗赛",
    "admin.test.firstTeam": "A 队",
    "admin.test.secondTeam": "B 队",
    "admin.test.versus": "对",
    "admin.test.starts": "开始",
    "admin.test.finishes": "结束",
    "admin.test.expectedMatches": "预计场次",
    "admin.test.bestOf": "几局制",
    "admin.test.group": "分组",
    "admin.test.add": "添加",
    "admin.test.save": "保存",
    "admin.test.added": "已添加 {name}。",
    "admin.test.otherwise": "无法按现状保存这场对抗赛。",
    "admin.testView.otherwise": "无法从这里查看这场对抗赛。",
    "AddTest.FirstTeamMissing": "请选择第一支队伍。",
    "AddTest.SecondTeamMissing": "请选择第二支队伍。",
    "UpdateTest.FirstTeamMissing": "请选择第一支队伍。",
    "UpdateTest.SecondTeamMissing": "请选择第二支队伍。",
    "ExpectedMatches.NotWhole": "请输入整数场次。",
    "ExpectedMatches.TooSmall": "一场对抗赛预计至少要有 1 场比赛。",
    "TestGroup.TooLong": "这个分组名称太长了。",
    "Tournament.TestAgainstItself": "一支队伍不能和自己进行对抗赛。",
    "Tournament.FormatHasNoGroups": "此赛制的对抗赛不分组。",
    "Tournament.TestFinishesBeforeStarts": "对抗赛不能在开始之前结束。",
    "Tournament.TestStartsBeforeTournament": "对抗赛不能早于所属赛事开始。",
    "Tournament.TestFinishesAfterTournament": "对抗赛不能晚于所属赛事结束。",
    "Tournament.TestHasGamesInUse":
      "这场对抗赛已有比赛，所以要等这些比赛都归档之后才能归档。",
    "Tournament.TestHasGames": "这场对抗赛现在已有比赛，因此不能再更改其队伍。",
    "Tournament.ExpectedMatchesBelowStarted": "已开始的比赛场次比这个数更多。",
    "Tournament.BestOfBelowGamesPlayed": "已有两位选手打了比这更多的局数。",
    "Competition.ExpectedMatchesReached":
      "这场对抗赛已开始的比赛场次已达到预计场次。",
    "Competition.SameTeam": "同一队的两位选手之间不进行比赛。",
    "AddManager.NoSuchAccount": "该地址没有可以设为管理者的账户。",
    "admin.scorers.add": "添加记分员",
    "admin.scorers.none": "没有记分员",
    "admin.scorers.removeTitle": "移除记分员",
    "admin.scorers.removeExplanation": "{name} 将不能再录入这个赛事的成绩。",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "无法把该地址设为记分员。",
    "AddScorer.NoSuchAccount": "该地址没有可以设为记分员的账户。",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "只有管理员才能这样做。",
    "AddRole.NoSuchAccount": "该地址没有可以授予该角色的账户。",
    "AddRole.NoSuchRole": "没有这个角色。",
    "RemoveRole.NoSuchAccount": "没有这个账户。",
    "RemoveRole.NoSuchRole": "没有这个角色。",
    "RemoveRole.Yourself": "您不能收回自己的管理员角色。",
    "AccountsWithRole.NoSuchRole": "没有这个角色。",
    "Tournament.AlreadyAManager":
      "该账户已经在管理这个赛事，并且可以做记分员能做的一切。",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    "TournamentName.Missing": "请填写赛事的名称。",
    "TournamentName.TooShort": "这个名称太短了。",
    "TournamentName.TooLong": "这个名称太长了。",
    "TournamentName.AllLowerCase": "名称不能全部是小写。",
    "TournamentName.AllCapitals": "名称不能全部是大写。",
    "TournamentName.NoLetterOrDigit": "名称中要有文字或数字。",
    "ReadOnlyDate.Unreadable": "请填写日期。",
    "Tournament.FinishesBeforeStarts": "赛事不能在开始之前结束。",
    "Tournament.StartsAfterNextYear": "赛事不能晚于明年开始。",
    "Tournament.FinishesAfterNextYear": "赛事不能晚于明年结束。",
    "CreateTournament.NoSuchCountry": "请选择国家。",
    "TournamentSubtitle.TooLong": "副标题不能超过 2000 个字符。",
    "Tournament.NotAManager": "只有这个赛事的管理者才能修改它。",
    "Tournament.NotAManagerOrScorer":
      "只有这个赛事的管理者或记分员才能查看它。",
    "Tournament.Archived": "这个赛事已归档，需要先恢复才能修改。",
    "UpdateTournament.NoSuchTournament": "这个地址没有赛事。",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form.
    "sport.ac": "协会槌球",
    "sport.gc": "高尔夫槌球",
    "sport.a6w": "美式六门槌球",
    "sport.rc": "回弹槌球",
    "sport.gb": "门球",
    "format.standard": "标准赛制",
    "format.teams": "团体赛",
    "format.eire-cup": "爱尔兰杯",
    "format.interstate-shield": "州际盾杯",
    "format.gc-world-team-championship": "高尔夫槌球世界团体锦标赛",

    "country.ad": "安道尔",
    "country.ae": "阿拉伯联合酋长国",
    "country.af": "阿富汗",
    "country.ag": "安提瓜和巴布达",
    "country.ai": "安圭拉",
    "country.al": "阿尔巴尼亚",
    "country.am": "亚美尼亚",
    "country.ao": "安哥拉",
    "country.ar": "阿根廷",
    "country.as": "美属萨摩亚",
    "country.at": "奥地利",
    "country.au": "澳大利亚",
    "country.aw": "阿鲁巴",
    "country.ax": "奥兰群岛",
    "country.az": "阿塞拜疆",
    "country.ba": "波斯尼亚和黑塞哥维那",
    "country.bb": "巴巴多斯",
    "country.bd": "孟加拉国",
    "country.be": "比利时",
    "country.bf": "布基纳法索",
    "country.bg": "保加利亚",
    "country.bh": "巴林",
    "country.bi": "布隆迪",
    "country.bj": "贝宁",
    "country.bm": "百慕大",
    "country.bn": "文莱",
    "country.bo": "玻利维亚",
    "country.br": "巴西",
    "country.bs": "巴哈马",
    "country.bt": "不丹",
    "country.bv": "布韦岛",
    "country.bw": "博茨瓦纳",
    "country.by": "白俄罗斯",
    "country.bz": "伯利兹",
    "country.ca": "加拿大",
    "country.catalonia": "加泰罗尼亚",
    "country.cc": "科科斯（基林）群岛",
    "country.cd": "刚果民主共和国",
    "country.cf": "中非共和国",
    "country.cg": "刚果共和国",
    "country.ch": "瑞士",
    "country.ci": "科特迪瓦",
    "country.ck": "库克群岛",
    "country.cl": "智利",
    "country.cm": "喀麦隆",
    "country.cn": "中国",
    "country.co": "哥伦比亚",
    "country.cr": "哥斯达黎加",
    "country.cu": "古巴",
    "country.cv": "佛得角",
    "country.cx": "圣诞岛",
    "country.cy": "塞浦路斯",
    "country.cz": "捷克",
    "country.de": "德国",
    "country.dj": "吉布提",
    "country.dk": "丹麦",
    "country.dm": "多米尼克",
    "country.do": "多米尼加共和国",
    "country.dz": "阿尔及利亚",
    "country.ec": "厄瓜多尔",
    "country.ee": "爱沙尼亚",
    "country.eg": "埃及",
    "country.eh": "西撒哈拉",
    "country.england": "英格兰",
    "country.er": "厄立特里亚",
    "country.es": "西班牙",
    "country.et": "埃塞俄比亚",
    "country.fi": "芬兰",
    "country.fj": "斐济",
    "country.fk": "福克兰群岛",
    "country.fm": "密克罗尼西亚",
    "country.fo": "法罗群岛",
    "country.fr": "法国",
    "country.ga": "加蓬",
    "country.gb": "英国",
    "country.gd": "格林纳达",
    "country.ge": "格鲁吉亚",
    "country.gf": "法属圭亚那",
    "country.gh": "加纳",
    "country.gi": "直布罗陀",
    "country.gl": "格陵兰",
    "country.gm": "冈比亚",
    "country.gn": "几内亚",
    "country.gp": "瓜德罗普",
    "country.gq": "赤道几内亚",
    "country.gr": "希腊",
    "country.gs": "南乔治亚岛和南桑威奇群岛",
    "country.gt": "危地马拉",
    "country.gu": "关岛",
    "country.gw": "几内亚比绍",
    "country.gy": "圭亚那",
    "country.hk": "中国香港",
    "country.hm": "赫德岛和麦克唐纳群岛",
    "country.hn": "洪都拉斯",
    "country.hr": "克罗地亚",
    "country.ht": "海地",
    "country.hu": "匈牙利",
    "country.id": "印度尼西亚",
    "country.ie": "爱尔兰",
    "country.il": "以色列",
    "country.im": "马恩岛",
    "country.in": "印度",
    "country.io": "英属印度洋领地",
    "country.iq": "伊拉克",
    "country.ir": "伊朗",
    "country.is": "冰岛",
    "country.it": "意大利",
    "country.je": "泽西岛",
    "country.jm": "牙买加",
    "country.jo": "约旦",
    "country.jp": "日本",
    "country.ke": "肯尼亚",
    "country.kg": "吉尔吉斯斯坦",
    "country.kh": "柬埔寨",
    "country.ki": "基里巴斯",
    "country.km": "科摩罗",
    "country.kn": "圣基茨和尼维斯",
    "country.kp": "朝鲜",
    "country.kr": "韩国",
    "country.kw": "科威特",
    "country.ky": "开曼群岛",
    "country.kz": "哈萨克斯坦",
    "country.la": "老挝",
    "country.lb": "黎巴嫩",
    "country.lc": "圣卢西亚",
    "country.li": "列支敦士登",
    "country.lk": "斯里兰卡",
    "country.lr": "利比里亚",
    "country.ls": "莱索托",
    "country.lt": "立陶宛",
    "country.lu": "卢森堡",
    "country.lv": "拉脱维亚",
    "country.ly": "利比亚",
    "country.ma": "摩洛哥",
    "country.mc": "摩纳哥",
    "country.md": "摩尔多瓦",
    "country.me": "黑山",
    "country.mg": "马达加斯加",
    "country.mh": "马绍尔群岛",
    "country.mk": "北马其顿",
    "country.ml": "马里",
    "country.mm": "缅甸",
    "country.mn": "蒙古",
    "country.mo": "中国澳门",
    "country.mp": "北马里亚纳群岛",
    "country.mq": "马提尼克",
    "country.mr": "毛里塔尼亚",
    "country.ms": "蒙特塞拉特",
    "country.mt": "马耳他",
    "country.mu": "毛里求斯",
    "country.mv": "马尔代夫",
    "country.mw": "马拉维",
    "country.mx": "墨西哥",
    "country.my": "马来西亚",
    "country.mz": "莫桑比克",
    "country.na": "纳米比亚",
    "country.nc": "新喀里多尼亚",
    "country.ne": "尼日尔",
    "country.nf": "诺福克岛",
    "country.ng": "尼日利亚",
    "country.ni": "尼加拉瓜",
    "country.nl": "荷兰",
    "country.no": "挪威",
    "country.np": "尼泊尔",
    "country.nr": "瑙鲁",
    "country.nu": "纽埃",
    "country.nz": "新西兰",
    "country.om": "阿曼",
    "country.pa": "巴拿马",
    "country.pe": "秘鲁",
    "country.pf": "法属波利尼西亚",
    "country.pg": "巴布亚新几内亚",
    "country.ph": "菲律宾",
    "country.pk": "巴基斯坦",
    "country.pl": "波兰",
    "country.pm": "圣皮埃尔和密克隆",
    "country.pn": "皮特凯恩群岛",
    "country.pr": "波多黎各",
    "country.ps": "巴勒斯坦",
    "country.pt": "葡萄牙",
    "country.pw": "帕劳",
    "country.py": "巴拉圭",
    "country.qa": "卡塔尔",
    "country.re": "留尼汪",
    "country.ro": "罗马尼亚",
    "country.rs": "塞尔维亚",
    "country.ru": "俄罗斯",
    "country.rw": "卢旺达",
    "country.sa": "沙特阿拉伯",
    "country.sb": "所罗门群岛",
    "country.sc": "塞舌尔",
    "country.scotland": "苏格兰",
    "country.sd": "苏丹",
    "country.se": "瑞典",
    "country.sg": "新加坡",
    "country.sh": "圣赫勒拿",
    "country.si": "斯洛文尼亚",
    "country.sj": "斯瓦尔巴和扬马延",
    "country.sk": "斯洛伐克",
    "country.sl": "塞拉利昂",
    "country.sm": "圣马力诺",
    "country.sn": "塞内加尔",
    "country.so": "索马里",
    "country.sr": "苏里南",
    "country.st": "圣多美和普林西比",
    "country.sv": "萨尔瓦多",
    "country.sy": "叙利亚",
    "country.sz": "斯威士兰",
    "country.tc": "特克斯和凯科斯群岛",
    "country.td": "乍得",
    "country.tf": "法属南部领地",
    "country.tg": "多哥",
    "country.th": "泰国",
    "country.tj": "塔吉克斯坦",
    "country.tk": "托克劳",
    "country.tl": "东帝汶",
    "country.tm": "土库曼斯坦",
    "country.tn": "突尼斯",
    "country.to": "汤加",
    "country.tr": "土耳其",
    "country.tt": "特立尼达和多巴哥",
    "country.tv": "图瓦卢",
    "country.tw": "中国台湾",
    "country.tz": "坦桑尼亚",
    "country.ua": "乌克兰",
    "country.ug": "乌干达",
    "country.um": "美国本土外小岛屿",
    "country.us": "美国",
    "country.uy": "乌拉圭",
    "country.uz": "乌兹别克斯坦",
    "country.va": "梵蒂冈",
    "country.vc": "圣文森特和格林纳丁斯",
    "country.ve": "委内瑞拉",
    "country.vg": "英属维尔京群岛",
    "country.vi": "美属维尔京群岛",
    "country.vn": "越南",
    "country.vu": "瓦努阿图",
    "country.wales": "威尔士",
    "country.wf": "瓦利斯和富图纳",
    "country.ws": "萨摩亚",
    "country.ye": "也门",
    "country.yt": "马约特",
    "country.za": "南非",
    "country.zm": "赞比亚",
    "country.zw": "津巴布韦",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. Only what fills an email in is escaped; the
    // markup here is the site's own. `{link}` is the link the email carries,
    // `{site}` the site's address, `{buttonBackgroundColour}` and
    // `{buttonTextColour}` what a button is painted with, `{emailFromName}`
    // the name each email is signed off with, and `{siteName}` what the site
    // is called. None greets its reader by name.

    "Email.ConfirmAddress.subject": "请确认您在 {siteName} 的电子邮件地址",
    "Email.ConfirmAddress.body": `
<p>您好，</p>

<p>
    感谢您在 <strong>{siteName}</strong> 创建账户。<br />
    在开始使用账户之前，请点击下方按钮确认您的电子邮件地址：
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
        确认我的电子邮件地址
    </a>
</p>

<p>
    如果按钮无法使用，您也可以在浏览器中打开下面的链接来确认电子邮件地址：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    如果您没有创建过这个账户，可以放心忽略这封邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "确认您在 {siteName} 的电子邮件地址的新链接",
    "Email.ConfirmAddressAgain.body": `
<p>您好，</p>

<p>
    您最近申请了一封新邮件，用于确认您在 <strong>{siteName}</strong> 的电子邮件地址。<br />
    请点击下方按钮确认您的电子邮件地址：
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
        确认我的电子邮件地址
    </a>
</p>

<p>
    如果按钮无法使用，您也可以在浏览器中打开下面的链接来确认电子邮件地址：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    确认之后，您就可以不受打扰地继续使用账户。
</p>

<p>
    如果您没有申请这封邮件，可以放心忽略它。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject": "有人尝试用您的电子邮件地址注册",
    "Email.AlreadyRegistered.body": `
<p>您好，</p>

<p>
    有人尝试用这个电子邮件地址在 <strong>{siteName}</strong> 注册，
    而这个地址已经有账户了。您的账户没有任何变化。<br />
    如果是您本人，说明您已有账户，可以直接登录：
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
        登录
    </a>
</p>

<p>
    如果您忘记了密码，可以在这里重置：
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
        忘记密码
    </a>
</p>

<p>
    如果不是您本人，则无需做任何事。没有人获得进入您账户的途径。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "请确认把您的 {siteName} 账户迁移到这个地址",
    "Email.ConfirmNewEmailAddress.body": `
<p>您好，</p>

<p>
    有人登录了一个 <strong>{siteName}</strong> 账户，并申请把它迁移到这个电子邮件地址。
    如果是您本人，请在登录该账户的状态下在这里确认。链接的有效期为 24 小时。
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
        迁移我的账户
    </a>
</p>

<p>
    或者把下面的地址复制到浏览器中：<br />
    {link}
</p>

<p>
    如果不是您本人，则无需做任何事。不会有账户迁移到这里。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "有人申请把一个账户迁移到您的电子邮件地址",
    "Email.AlreadyHasAnAccount.body": `
<p>您好，</p>

<p>
    有人登录了一个 <strong>{siteName}</strong> 账户，并申请把它迁移到这个电子邮件地址，
    而这个地址已经有自己的账户了。没有任何账户被迁移，
    您的账户也没有任何变化。
</p>

<p>
    如果是您本人，说明您在这个地址上已有账户，可以直接登录。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "您的 {siteName} 账户已迁移",
    "Email.EmailAddressChanged.body": `
<p>您好，</p>

<p>
    您的 <strong>{siteName}</strong> 账户刚刚被迁移到另一个电子邮件地址
    {emailAddress}，今后将使用该地址登录。
</p>

<p>
    如果不是您本人，说明别人掌握了您的账户。请回复这封邮件告诉我们。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "您的 {siteName} 密码已修改",
    "Email.PasswordChanged.body": `
<p>您好，</p>

<p>
    您的 <strong>{siteName}</strong> 账户的密码刚刚被修改，
    其他已登录该账户的浏览器都已退出登录。<br />
    如果是您本人，则无需做任何事。
</p>

<p>
    如果不是您本人，说明别人掌握了您的密码。请在这里设置新密码，
    对方将被退出登录：
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
        忘记密码
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "设置 {siteName} 的新密码",
    "Email.SetNewPassword.body": `
<p>您好，</p>

<p>
    您最近申请重置 <strong>{siteName}</strong> 的密码。<br />
    您可以点击下方按钮重置密码：
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
        重置密码
    </a>
</p>

<p>
    如果按钮无法使用，您也可以在浏览器中打开下面的链接来重置密码：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    如果您没有申请重置密码，可以放心忽略这封邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "设置 {siteName} 的密码",
    "Email.SetPassword.body": `
<p>您好，</p>

<p>
    您的 <strong>{siteName}</strong> 账户没有密码：您是通过 Google 登录的。<br />
    您申请设置密码，以便也能用电子邮件地址和密码登录。
    您可以点击下方按钮来设置：
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
        设置密码
    </a>
</p>

<p>
    如果按钮无法使用，您也可以在浏览器中打开下面的链接来设置密码：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    链接的有效期为一小时。如果您没有申请设置密码，可以放心忽略这封邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject": "这个电子邮件地址在 {siteName} 没有账户",
    "Email.RegisterInstead.body": `
<p>您好，</p>

<p>
    有人为一个在 <strong>{siteName}</strong> 上没有关联账户的电子邮件地址
    申请了重置密码。
</p>

<p>
    如果您想使用我们的服务，可以访问下面的地址创建新账户：<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    如果这不是您的请求，可以放心忽略这封邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject": "请确认要抹除您的 {siteName} 账户",
    "Email.ConfirmForgetting.body": `
<p>您好，</p>

<p>
    您申请抹除您的 <strong>{siteName}</strong> 账户。<br />
    请点击下方按钮，了解这意味着什么，并明确表示您确实要这样做：
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
        抹除我的账户
    </a>
</p>

<p>
    如果按钮无法使用，您也可以在浏览器中打开下面的链接：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    一旦抹除，任何人都再也无法读取您的姓名和电子邮件地址，该账户也无法再登录。此操作无法撤销。
</p>

<p>
    该链接只能使用一次，有效期到您申请后 15 分钟为止，并且只在您登录此账户时有效。
    过期后，请从您的账户中重新申请。
</p>

<p>
    如果不是您申请的，只要没有人点击这个链接，就不会发生任何事。
    不过，是有人登录了您的账户才提出申请的，所以请在“忘记密码”页面设置新密码，
    以确保对方无法再次登录。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject": "注册已暂停：无法连接 {service}",
    "Email.RegistrationsSuspended.body": `
<p>您好，</p>

<p>
    {siteName} 在 {when} 无法连接 {service}。在它恢复响应之前，
    需要用到它的读者（注册或设置新密码）会被告知稍后再试。
</p>

<p>
    您无需解除任何设置。每次尝试都会重新向 {service} 发出请求，
    一旦它恢复响应，这些页面就会立即恢复正常。
</p>

<p>
    在 {service} 持续不可用期间，我们最多每小时给您发送一封相关邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject": "{siteName} 无法连接数据库",
    "Email.DatabaseUnreachable.body": `
<p>您好，</p>

<p>
    {siteName} 在 {when} 无法连接数据库。在数据库恢复响应之前，每个需要它的页面都会告知读者网站不可用，请稍后再试。
</p>

<p>
    您无需解除任何设置。每个请求都会重新申请连接，数据库一旦恢复响应，网站就会立即恢复正常。
</p>

<p>
    在数据库持续不可用期间，我们最多每 {minutes} 分钟给您发送一封相关邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} 处理请求时失败",
    "Email.UnhandledError.body": `
<p>您好，</p>

<p>
    {siteName} 在 {when} 处理对 {asked} 的请求时失败。读者看到的参考编号是 {reference}，日志中其下记录了原因。
</p>

<p>
    出了故障的网站往往每个请求都会失败，所以我们每小时最多给您发送 4 封关于故障的邮件。之后的故障同样会记录在日志中。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
