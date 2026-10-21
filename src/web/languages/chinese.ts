// The site's words in Chinese. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Simplified rather than Traditional characters: they are what is read in
// mainland China and Singapore, which is most of the people who read Chinese,
// and a reader of Traditional characters is not left without, since the two
// are close enough to be followed. The tag is the bare "zh" so that a browser
// asking for zh-CN or zh-SG gets this; one asking for zh-TW or zh-HK also
// gets it, as no Traditional catalogue is offered to prefer.
//
// Written to the reader as 你 rather than the courteous 您: the site talks to
// people scoring and following croquet, and the English it is written from is
// plain and direct rather than formal. Chinese has no capitals, so the
// English's capitalised menu items need nothing done to them. Punctuation is
// the full-width kind Chinese is set in, except inside the addresses and
// numbers it sits next to.
import type { Language } from "../common/language.js";

export const chinese: Language = {
  tag: "zh",
  name: "中文",
  words: {
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
    "footer.plea": "喜欢 {siteName} 吗？请捐赠，帮助我们继续开发。",
    "footer.copyright": "© 版权所有 {years}，{owner}",
    "footer.privacy": "隐私",
    "beta.banner": "这是测试版网站，数据可能随时被重置。",
    "privacy.contact":
      "关于本页，或关于我们保存的您的信息，如有疑问请联系：{emailAddress}",
    "tryWebsite.banner":
      "这里是学习 {siteName} 的安全场所。在这里输入的任何内容都可能随时被删除。",

    "language.label": "语言",
    "language.choose": "更改",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "有新内容可以阅读。",
    "whatsNew.admin.message": "有适用于赛事管理者的新内容。",
    "whatsNew.view": "查看新内容",
    "whatsNew.later": "下次再提醒我",
    "whatsNew.never": "不再显示此提示",

    "form.otherwise": "有些地方不对。请检查输入的内容，然后再试一次。",

    "account.menu": "账户",
    "account.register": "注册",
    "account.signIn": "登录",
    "account.forgotPassword": "忘记密码",
    "account.signOut": "退出登录",
    "account.profile": "个人资料",
    "account.changePassword": "更改密码",
    "account.changeEmailAddress": "更改电子邮件地址",
    "account.changeName": "更改姓名",
    "account.setPassword": "设置密码",
    "account.forgetAccount": "注销账户",

    "register.title": "注册",
    "register.emailAddress": "电子邮件地址",
    "register.submit": "注册",
    "register.withGoogle": "使用 Google 注册",
    "register.or": "或",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google 没有确认该电子邮件地址属于你，所以不能在这里通过 Google 使用。请改用下面的电子邮件地址。",
    "SignInWithGoogle.LinkedToAnother":
      "该电子邮件地址已经有一个账户，并且关联着另一个 Google 账号。请使用那个 Google 账号登录，或使用你的电子邮件地址和密码登录。",
    "SignInWithGoogle.NameMissing":
      "Google 没有告诉我们你的姓名，而账户需要姓名。请改用下面的电子邮件地址。",
    "Google.Unreachable":
      "暂时无法连接 Google。请几分钟后再试，或使用下面的电子邮件地址。",
    "Registration.NotAPerson":
      "这看起来不像是真人操作。请再试一次；如果仍然如此，请等几分钟后再来。",

    "EmailAddress.Missing": "请输入电子邮件地址。",
    "EmailAddress.NoAt": "电子邮件地址中要有 @。",
    "EmailAddress.MoreThanOneAt": "电子邮件地址中只能有一个 @。",
    "EmailAddress.NoDomain":
      "电子邮件地址的 @ 后面要有域名，例如 example.com。",

    "welcome.title": "请查收电子邮件",
    "welcome.checkEmail":
      "一封电子邮件正在发往你填写的地址。请点击其中的链接继续。",
    "welcome.nothingArrived": "如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "welcome.home": "返回 {siteName}",
    "newConfirmationLink.title": "获取新链接",
    "newConfirmationLink.explanation":
      "用于确认你的电子邮件地址的链接已过期。请申请一个新的，它会发送到你注册时使用的地址。",
    "newConfirmationLink.send": "给我发一个新链接",
    "newConfirmationLink.home": "返回 {siteName}",
    "newConfirmationLink.signIn": "登录",
    "newConfirmationLink.sent.title": "请查收电子邮件",
    "newConfirmationLink.sent.explanation":
      "新链接正在发送中。请点击它来确认你的电子邮件地址。如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "newConfirmationLink.alreadyConfirmed.title": "该电子邮件地址已经确认过了",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "没有需要再确认的了。请使用你确认时设置的密码登录。",
    "newConfirmationLink.noLongerWorks.title": "该链接已失效",
    "newConfirmationLink.noLongerWorks.explanation":
      "请检查你点击的是电子邮件中的完整链接，结尾没有缺少任何内容。如果仍然无效，请重新注册，我们会发送一个新链接。",
    "newConfirmationLink.tooMany.title": "请稍后再试",
    "newConfirmationLink.tooMany.explanation":
      "最近已向这个地址发送了多个链接。请等一小时后再申请，期间请查看垃圾邮件文件夹。",

    "forgotPassword.title": "忘记密码了？",
    "forgotPassword.emailAddress": "电子邮件地址",
    "forgotPassword.submit": "给我发一个重新登录的方法",
    "forgotPassword.home": "返回 {siteName}",
    "forgotPassword.sent.title": "请查收电子邮件",
    "forgotPassword.sent.explanation":
      "如果该地址有账户，设置新密码的链接正在发送中。请在一小时内点击它。如果几分钟后仍未收到，请查看垃圾邮件文件夹。",
    "forgotPassword.tryAgainLater":
      "最近从这里申请重新登录的次数太多。请等一小时后再试。",

    "setNewPassword.title": "设置新密码",
    "setNewPassword.password": "密码",
    "setNewPassword.confirmPassword": "确认密码",
    "setNewPassword.submit": "设置我的新密码",
    "setNewPassword.home": "返回 {siteName}",
    "setNewPassword.signIn": "登录",
    "setNewPassword.askAgain": "申请新链接",
    "setNewPassword.changed.title": "你的密码已更改",
    "setNewPassword.changed.explanation":
      "你已在所有登录过的地方退出登录。请使用新密码登录。",
    "setNewPassword.expired.title": "该链接已过期",
    "setNewPassword.expired.explanation":
      "设置新密码的链接有效期为一小时。请再申请一个，它会发送到同一个地址。",
    "setNewPassword.noLongerWorks.title": "该链接已失效",
    "setNewPassword.noLongerWorks.explanation":
      "它可能已被使用过，或者结尾缺少了内容。如果仍需要，请再申请一个。",

    "BreachedPasswords.Unreachable":
      "暂时无法检查你的密码，所以密码没有更改。请几分钟后再试；你的链接在过期之前仍然有效。",

    "forgetAccount.title": "注销你的账户",
    "forgetAccount.explanation":
      "你的姓名和电子邮件地址可以被永久抹去，账户也会被关闭。为确认是你本人，我们会先向你账户的地址发送一封带链接的电子邮件，在你点击链接之前不会抹去任何内容。",
    "forgetAccount.submit": "给我发送链接",
    "forgetAccount.sent.title": "请查收电子邮件",
    "forgetAccount.sent.explanation":
      "我们已向你账户的地址发送了一个链接。它的有效期为 15 分钟，并且只有在你登录此账户时才有效。",
    "forgetAccount.confirm.title": "永久注销你的账户吗？",
    "forgetAccount.confirm.explanation":
      "一旦注销，任何人都再也无法读取你的姓名和电子邮件地址，你的账户也无法再登录。此操作无法撤销。",
    "forgetAccount.confirm.submit": "注销我的账户",
    "forgetAccount.forgotten.title": "你的账户已注销",
    "forgetAccount.forgotten.explanation":
      "你的姓名和电子邮件地址已无法再被读取，你也已在所有登录过的地方退出登录。",
    "forgetAccount.noLongerWorks.title": "该链接已失效",
    "forgetAccount.noLongerWorks.explanation":
      "它可能已过期、已被使用，或者属于你当前未登录的账户。如果你仍想注销，请从你的账户中重新申请。",
    "forgetAccount.lastAdministrator.title": "你的账户无法注销",
    "forgetAccount.lastAdministrator.explanation":
      "你是本站唯一的管理员。请先把管理员角色交给其他人，然后才能注销你的账户。",
    "forgetAccount.askAgain": "重新申请",
    "forgetAccount.home": "返回 {siteName}",

    "registrationsSuspended.title": "注册暂时停止",
    "registrationsSuspended.explanation":
      "注册所需的某项服务暂时无法连接，在它恢复之前，任何人都无法注册。你输入的内容没有被保存。",
    "registrationsSuspended.tryAgainLater":
      "请稍后再试。本站管理员已经收到通知。",
    "registrationsSuspended.home": "返回 {siteName}",

    "signIn.title": "登录",
    "signIn.emailAddress": "电子邮件地址",
    "signIn.password": "密码",
    "signIn.submit": "登录",
    "signIn.forgotPassword": "忘记密码？",
    "signIn.register": "注册",
    "signIn.withGoogle": "使用 Google 登录",
    "signIn.or": "或",
    "signIn.tryAgainLater": "最近尝试的次数太多。请等一小时后再试。",

    "SignIn.Failed": "电子邮件地址或密码不正确。请再试一次。",

    "profile.title": "个人资料",
    "profile.name": "姓名：",
    "profile.emailAddress": "电子邮件地址：",

    "changeName.title": "更改姓名",
    "changeName.name": "姓名",
    "changeName.submit": "更改姓名",

    "setPassword.title": "设置密码",
    "setPassword.explanation":
      "你的账户没有密码：你是通过 Google 登录的。若想同时也能用密码登录，我们会向 {emailAddress} 发送一封电子邮件，其中有设置密码的链接。",
    "setPassword.submit": "给我发送链接",
    "setPassword.sent.title": "请查收电子邮件",
    "setPassword.sent.explanation":
      "我们已给你发送了设置密码的链接。它的有效期为一小时。",
    "setPassword.profile": "返回你的个人资料",

    "changePassword.title": "更改密码",
    "changePassword.currentPassword": "当前密码",
    "changePassword.password": "新密码",
    "changePassword.passwordConfirmation": "确认密码",
    "changePassword.forgotPassword": "忘记密码？",
    "changePassword.submit": "更改密码",
    "ChangePassword.WrongPassword": "这不是你的密码。",

    "changeEmailAddress.title": "更改电子邮件地址",
    "changeEmailAddress.emailAddress": "新的电子邮件地址",
    "changeEmailAddress.currentPassword": "当前密码",
    "changeEmailAddress.submit": "发送确认链接",
    "changeEmailAddress.sent.title": "请查收电子邮件",
    "changeEmailAddress.sent.explanation":
      "确认迁移的链接已发送到新的电子邮件地址。请在登录状态下点击它，把你的账户迁移到那里。",
    "changeEmailAddress.confirm.title": "迁移你的账户",
    "changeEmailAddress.confirm.explanation":
      "你的账户将迁移到 {emailAddress}。从现在起，你将使用该地址登录。",
    "changeEmailAddress.confirm.submit": "迁移我的账户",
    "changeEmailAddress.noLongerWorks.title": "该链接已失效",
    "changeEmailAddress.noLongerWorks.explanation":
      "它已过期、已被使用，或者不是为你当前登录的账户发送的。请从你的个人资料中重新申请。",
    "changeEmailAddress.taken.title": "你的账户没有迁移",
    "changeEmailAddress.profile": "返回你的个人资料",
    "ChangeEmailAddress.WrongPassword": "这不是你的密码。",
    "ChangeEmailAddress.Unchanged": "你的账户已经在这个地址了。",
    "ChangeEmailAddress.Taken":
      "该电子邮件地址现在已有自己的账户，所以你的账户无法迁移到那里。",

    "confirmEmailAddress.title": "确认你的电子邮件地址",
    "confirmEmailAddress.name": "姓名",
    "confirmEmailAddress.password": "密码",
    "confirmEmailAddress.confirmPassword": "确认密码",
    "confirmEmailAddress.submit": "确认我的电子邮件地址",
    "confirmEmailAddress.signIn": "登录",
    "confirmEmailAddress.home": "返回 {siteName}",
    "confirmEmailAddress.confirmed.title": "你的电子邮件地址已确认",
    "confirmEmailAddress.confirmed.explanation":
      "你的账户已就绪。请使用你刚才填写的电子邮件地址和密码登录。",
    "confirmEmailAddress.expired.title": "该链接已过期",
    "confirmEmailAddress.expired.explanation":
      "确认电子邮件地址的链接有效期为 24 小时。请申请一个新的，它会发送到同一个地址。",
    "confirmEmailAddress.expired.newLink": "给我发一个新链接",
    "confirmEmailAddress.noLongerWorks.title": "该链接已失效",
    "confirmEmailAddress.noLongerWorks.explanation":
      "请检查你点击的是电子邮件中的完整链接，结尾没有缺少任何内容。如果仍然无效，请重新注册，我们会发送一个新链接。",
    "confirmEmailAddress.alreadyConfirmed.title": "该电子邮件地址已经确认过了",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "没有需要再做的了。请使用你确认时设置的密码登录。",

    "PersonName.Missing": "请输入姓名。",
    "PersonName.TooShort": "姓名至少要有 3 个字符。",
    "PersonName.TooLong": "姓名最多只能有 254 个字符。",
    "WorldRankingName.TooShort": "世界排名用名至少要有 3 个字符。",
    "WorldRankingName.TooLong": "世界排名用名最多只能有 254 个字符。",
    "Password.Missing": "请输入密码。",
    "Password.TooShort": "密码至少要有 12 个字符。",
    "Password.ConfirmationDiffers": "这与上面的密码不一致。请再输入一次。",
    "Password.Breached":
      "这个密码曾在别处的数据泄露事件中出现过，所以在这里使用不安全。请换一个。",

    "javaScriptRequired.title": "需要启用脚本",
    "javaScriptRequired.explanation":
      "注册需要为本站启用脚本，以便确认注册的是真人。请启用脚本，然后重新注册。",
    "javaScriptRequired.register": "返回注册",
    "javaScriptRequired.home": "返回 {siteName}",

    "errors.backHome": "返回 {siteName}",
    "errors.notFound": "未找到",
    "errors.refused": "无法完成该操作",
    "errors.refusedDetail": "发送的内容有些地方不对。",
    "errors.sorry": "抱歉",
    "errors.sorryDetail": "无法处理该请求。",
    "errors.failed": "出了点问题",
    "errors.reference": "参考编号 {reference}。",
    "errors.recorded":
      "该错误已记录，并已向管理员发送电子邮件。建议您携带参考编号，给管理员发一封电子邮件，说明您当时在做什么。",
    "errors.message": "给管理员发电子邮件",
    "errors.messageSubject": "{siteName} 上的错误 {reference}",
    "errors.messageBody": "出现问题时我正在做的事：\n\n",
    "errors.unavailable": "网站暂时无法使用",
    "errors.unavailableDetail": "网站暂时无法连接到所需的内容。请稍后再试。",
    "errors.maintenance": "网站正在维护中。",
    "errors.maintenanceMinutes": "预计 {minutes} 分钟后恢复。",
    "errors.maintenanceMinute": "预计 1 分钟后恢复。",
    "errors.maintenanceLonger": "耗时比预期更长，很快就会恢复。",

    "home.recentResults": "近期结果",
    "home.recentResults.none": "最近七天没有添加任何比赛。",
    "home.upcomingTournaments": "即将举行的锦标赛",
    "home.upcomingTournaments.none": "未来六十天内没有锦标赛开始。",
    "home.allTournaments": "{year} 年的所有锦标赛",
    "year.heading": "{year} 年的锦标赛",
    "year.none": "{year} 年没有锦标赛开始。",
    "yearSport.heading": "{year} 年的{sport}锦标赛",
    "yearSport.none": "{year} 年没有{sport}锦标赛开始。",
    "tournament.recent": "近期",
    "tournament.summary": "概要",
    "test.bestOf": "每场比赛为 {count} 局决胜制。",
    "test.vs": "对",
    "test.matches": "比赛",
    "test.games": "局",
    "test.hoops": "球门",
    "teamSummary.tests": "对抗赛",
    "teamSummary.matches": "比赛",
    "teamSummary.games": "局",
    "teamSummary.hoops": "球门",
    "teamSummary.wins": "胜",
    "teamSummary.losses": "负",
    "teamSummary.draws": "平",
    "teamSummary.for": "得",
    "teamSummary.against": "失",
    "teamSummary.net": "净胜",
    "tournament.players": "选手",
    "search.label": "搜索",
    "search.tournaments": "锦标赛",
    "search.competitions": "比赛项目",
    "search.nothingFound": "没有找到任何内容。",
    "players.search.label": "搜索球员",
    "players.search.prompt": "输入球员姓名以查找。",
    "players.search.none": "没有找到球员。",
    "search.more": "仅显示前 {count} 项。请输入更多名称以缩小搜索范围。",
    "websitePlayer.tournament": "锦标赛",
    "tournament.test": "{first} 对 {second}",
    "tournament.notes": "备注",
    "tournament.commentary": "评论",
    "tournament.beat": "击败",
    "tournament.drewWith": "战平",
    "tournament.ago.seconds": "{count} 秒",
    "tournament.ago.minutes": "{count} 分钟",
    "tournament.ago.hour": "1 小时",
    "tournament.ago.hours": "{count} 小时",
    "tournament.none": "还没有进行任何比赛。",
    "players.none": "还没有添加任何选手。",
    "commentaries.by": "作者：",
    "commentaries.start": "发起新评论",
    "commentaries.disclaimer.heading": "免责声明",
    "commentaries.disclaimer":
      "这些评论中表达的观点和意见仅代表作者本人，不一定代表 Tim Murphy 或 {site} 的观点。",
    "commentaries.guidelines.heading": "准则",
    "commentaries.guidelines.responsible": "你要对自己的评论负责。",
    "commentaries.guidelines.purpose":
      "评论功能是用来传达锦标赛现场情况的，并非用来传达问候等内容的“社交媒体”场所。",
    "commentaries.guidelines.hatred":
      "请勿发布可能煽动暴力或仇恨的内容。我们不容忍基于种族、宗教、族裔、性别、年龄、精神或身体残疾或性取向而羞辱他人的评论。",
    "commentaries.guidelines.abuse":
      "无端的辱骂不会被容忍。这里的一般原则是评论应对事不对人，即不要对某人进行人身攻击，而是围绕手头的话题。",
    "commentaries.guidelines.unlawful":
      "任何在法律上存疑的评论，例如可能侵犯版权或可能构成诽谤的内容，都将被删除。",
    "commentaries.guidelines.shouting":
      "请勿在评论中说脏话，也不要全部使用大写字母。",
    "commentaries.guidelines.selling":
      "请勿将评论区用于商业目的或发送垃圾信息。宣传、推广或招揽任何商品或服务的评论将被删除。",
    "commentaries.guidelines.links":
      "请尽量少在评论中使用链接。含有不当内容链接的评论将被删除。",
    "commentaries.guidelines.impersonating":
      "请勿在评论区冒充他人，也不要发布可能无意中使他人陷入危险的个人信息，例如电话号码、邮寄地址或电子邮件地址。",
    "commentaries.reporting.heading": "举报评论",
    "commentaries.reporting.before": "如果评论不符合这些准则，请举报至",
    "commentaries.reporting.after": "。请写明网址和有问题的评论。例如：",
    "commentaries.reporting.exampleComment": "“应该删除的评论”",
    "commentaries.reporting.exampleReason": "应该删除这条评论，因为……",
    "commentaries.reporting.reviewed":
      "举报问题并不意味着会自动删除，但所有举报都会被审核。",
    "commentaries.reporting.reserved": "{site} 保留删除评论的权利。",
    "commentaries.reporting.subject": "{site} 评论举报",
    "commentaries.reporting.body":
      "请写明网址、有问题的评论以及为什么应该删除。",
    "startCommentary.title": "发起新评论",
    "startCommentary.titleField": "标题",
    "startCommentary.submit": "发起评论",
    "marks.new": "新",
    "notes.none": "管理员还没有写任何备注。",
    "note.edited": "已编辑",
    "commentary.none": "还没有人写评论。",
    "commentary.edited": "已编辑",
    "commentary.edit": "编辑",
    "commentary.delete": "删除",
    "commentary.comment": "评论",
    "commentary.add": "添加评论",
    "commentary.notSent": "评论无法发送。请重新加载页面，查看它是否已保存。",
    "changeCommentaryTitle.title": "更改标题",
    "changeCommentaryTitle.submit": "保存",
    "editComment.title": "编辑评论",
    "editComment.save": "保存",
    "deleteComment.title": "删除评论",
    "deleteComment.question": "删除这条评论吗？此操作无法撤销。",
    "deleteComment.confirm": "删除评论",
    "deleteComment.keep": "保留",
    "player.games": "比赛",
    "player.competitions": "赛事",
    "player.beat": "击败",
    "player.lostTo": "负于",
    "player.drewWith": "战平",
    "player.score": "{score} 比 {opponent}",
    "player.noGames": "还没有进行任何比赛。",
    "player.noCompetitions": "还没有参加任何赛事。",
    "block.wins": "胜",
    "block.matches": "比赛",
    "block.netGames": "净胜局",
    "block.games": "局",
    "block.netHoops": "净胜球门",
    "block.won": "胜",
    "block.lost": "负",
    "block.drawn": "平",
    "block.withdrawn": "已退赛",
    "block.gameWithdrawn": "已退赛",
    "block.losses": "负",
    "competition.views": "视图",
    "competition.view.grid": "表格",
    "competition.view.summary": "概要",
    "competition.view.orderOfPlay": "比赛顺序",
    "blockSummary.ranking":
      "按胜场比例排名，其次按净胜球门排名。锦标赛自己的规程可能会以其他方式排定选手的名次。",
    "orderOfPlay.none": "还没有进行任何比赛。",
    "knockout.round.final": "决赛",
    "knockout.round.semis": "半决赛",
    "knockout.round.quarters": "四分之一决赛",
    "knockout.round.number": "第 {number} 轮",
    "knockout.bye": "轮空",
    "swiss.games": "局",
    "swiss.wins": "胜",
    "swiss.winShare": "胜率",
    "swiss.results": "结果",
    "knockout.onward": "后面的轮次",
    "knockout.back": "前面的轮次",
    "tournamentList.column.date": "日期",
    "tournamentList.column.name": "名称",
    "tournamentList.onlyIn": "仅显示{country}的锦标赛",
    "tournamentList.filter.country": "国家或地区",
    "tournamentList.filter.anyCountry": "任何国家或地区",
    "tournamentList.filter.region": "地区",
    "tournamentList.filter.anyRegion": "任何地区",
    "tournamentList.filter.sport": "项目",
    "tournamentList.filter.anySport": "任何项目",
    "tournamentList.filter.submit": "筛选",
    "years.label": "年份",
    "years.earlier": "更早的年份",

    "admin.newerBuild.message": "本站有了较新的版本。",
    "admin.newerBuild.reload": "重新加载",
    "admin.title": "管理",
    "admin.tournaments.new": "新建锦标赛",
    "admin.tournaments.none": "没有锦标赛",
    "admin.tournaments.archived": "已归档",
    "admin.tournaments.manage": "管理",
    "admin.tournaments.edit": "编辑",
    "admin.tournaments.archive": "归档",
    "admin.tournaments.restore": "恢复",
    "admin.tournaments.scores": "比分",
    "admin.tournaments.players": "选手",
    "admin.years.label": "年份",
    "admin.years.earlier": "更早的年份",
    "admin.tournament.name": "名称",
    "admin.tournament.starts": "开始",
    "admin.tournament.finishes": "结束",
    "admin.tournament.format": "赛制",
    "admin.tournament.sport": "项目",
    "admin.tournament.country": "国家或地区",
    "admin.tournament.region": "地区",
    "admin.tournament.subtitle": "副标题",
    "admin.tournament.handicap": "采用让分",
    "admin.tournament.drawsAllowed": "允许平局",
    "admin.tournament.levelTestsDrawn": "打平的对抗赛算平局",
    "admin.tournament.worldRankings": "计入世界排名",
    "admin.tournament.national": "全国级赛事",
    "admin.tournament.international": "国际级赛事",
    "admin.tournament.otherwise": "无法按现在的样子接受。",
    "admin.newTournament.title": "新建锦标赛",
    "admin.newTournament.submit": "创建锦标赛",
    "admin.editTournament.title": "编辑锦标赛",
    "admin.editTournament.submit": "更新锦标赛",
    "admin.editTournament.otherwise": "无法更改这个锦标赛。",
    "admin.view.tabs": "锦标赛",
    "admin.view.players": "选手",
    "admin.view.competitions": "赛事",
    "admin.view.managers": "管理员",
    "admin.view.notes": "备注",
    "admin.view.scorers": "记分员",
    "admin.view.rankings": "排名",
    "admin.rankings.textFile":
      "世界排名收到的是以文本文件形式发送的比赛结果，由网站根据已录入的比赛生成。",
    "admin.rankings.spreadsheet":
      "世界排名收到的是以电子表格形式发送的比赛结果，由网站根据已录入的比赛生成。",
    "admin.rankings.fillInWinners":
      "网站只能推测每项比赛的获胜者，因此发送文件前请检查每项比赛的“Winner”一行。",
    "admin.rankings.fillInWinner":
      "网站无法知道谁赢得了锦标赛，因此发送前请在电子表格底部填写。",
    "admin.rankings.sendIt": "然后将文件发送给世界排名负责人。",
    "admin.rankings.download": "下载排名",
    "rankings.notAvailable": "排名不可用",
    "rankings.notAvailable.sport":
      "本赛事的运动项目没有世界排名，因此没有可发送的排名。",
    "rankings.notAvailable.handicap":
      "本赛事按让分制进行，因此不计入世界排名。",
    "rankings.notAvailable.drawnGames": "本赛事允许平局，因此不计入世界排名。",
    "rankings.notAvailable.notCounted":
      "本赛事的管理员已声明其不计入世界排名。",
    "admin.view.otherwise": "无法在这里管理这个锦标赛。",
    "admin.competitionView.tabs": "赛事",
    "admin.competitionView.players": "选手",
    "admin.competitionView.scores": "比分",
    "admin.sections.label": "锦标赛及其赛事",
    "admin.sections.tournament": "锦标赛",
    "admin.administrator.sections.label": "站点管理员的页面",
    "admin.administrator.sections.tournaments": "锦标赛",
    "admin.administrator.sections.accounts": "账户",
    "admin.administrator.sections.worldRankings": "世界排名",
    "admin.administrator.sections.importErrors": "导入错误",
    "admin.administrator.sections.logs": "日志",
    "admin.administrator.sections.databaseStatus": "数据库访问",
    "admin.databaseStatus.title": "数据库访问",
    "admin.databaseStatus.on": "数据库访问已开启。",
    "admin.databaseStatus.off": "数据库访问已关闭。",
    "admin.databaseStatus.expected": "预计网站将在 {minutes} 分钟后恢复。",
    "admin.databaseStatus.expectedOne": "预计网站将在 1 分钟后恢复。",
    "admin.databaseStatus.longer": "耗时比预期更长。",
    "admin.databaseStatus.told": "访客看到：{words}",
    "admin.databaseStatus.toldUsual": "访客看到的是通常的提示语。",
    "admin.databaseStatus.minutes": "预计分钟数",
    "admin.databaseStatus.words": "给访客的文字",
    "admin.databaseStatus.turnOff": "关闭",
    "admin.databaseStatus.change": "更改",
    "admin.databaseStatus.turnOn": "开启",
    "admin.databaseStatus.minutesNeeded": "需要填写分钟数。",
    "admin.databaseStatus.otherwise": "网站出了点问题。",
    "DatabaseAccess.MinutesNotWhole": "分钟数必须是整数。",
    "DatabaseAccess.MinutesOutOfRange": "分钟数必须在 1 到 1440 之间。",
    "DatabaseAccess.WordsTooLong": "文字不能超过 500 个字符。",
    "DatabaseAccess.NotOff": "数据库访问并未关闭。",
    "admin.administrator.title": "站点管理员",
    "admin.accounts.title": "账户",
    "admin.roles.add": "添加",
    "admin.roles.administrator.heading": "站点管理员",
    "admin.roles.administrator.none": "没有其他站点管理员",
    "admin.roles.administrator.removeTitle": "移除站点管理员",
    "admin.roles.administrator.removeExplanation":
      "{name} 将不再是本站的站点管理员。",
    "admin.roles.world-ranking-officer.heading": "世界排名负责人",
    "admin.roles.world-ranking-officer.none": "没有世界排名负责人",
    "admin.roles.world-ranking-officer.removeTitle": "移除世界排名负责人",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} 将不再是世界排名负责人。",
    "admin.worldRankings.title": "导入世界排名选手",
    "admin.worldRankings.import": "导入",
    "admin.worldRankings.log": "导入的过程",
    "admin.worldRankings.ac.reading": "正在读取协会槌球名单",
    "admin.worldRankings.ac.read": "已读取的协会槌球选手：{players}",
    "admin.worldRankings.ac.kept": "保留的协会槌球选手：{players}",
    "admin.worldRankings.ac.refused":
      "无法读取协会槌球名单，所以其中的选手保持原样。",
    "admin.worldRankings.gc.reading": "正在读取高尔夫槌球名单",
    "admin.worldRankings.gc.read": "已读取的高尔夫槌球选手：{players}",
    "admin.worldRankings.gc.kept": "保留的高尔夫槌球选手：{players}",
    "admin.worldRankings.gc.refused":
      "无法读取高尔夫槌球名单，所以其中的选手保持原样。",
    "admin.worldRankings.finished": "已完成",
    "admin.worldRankings.failed": "导入没有完成。",
    "admin.worldRankings.otherwise": "本站出了点问题。",
    "WorldRankingLists.Unreachable": "无法连接世界排名的网站。",
    "WorldRankingLists.Unreadable":
      "该名单的排版与世界排名网站的不一致：其中某一行无法读取、名单里没有任何人，或者不是 UTF-8 编码。",
    "admin.importErrors.title": "导入错误",
    "admin.importErrors.none": "没有导入错误",
    "admin.importErrors.otherwise": "本站出了点问题。",
    "admin.logs.title": "日志",
    "admin.logs.severity": "严重程度",
    "admin.logs.text": "查找",
    "admin.logs.show": "显示",
    "admin.logs.prune": "清理",
    "admin.logs.pruneAsk": "删除最近一小时之前的日志?删除后无法恢复。",
    "admin.logs.removed": "已删除 {count} 条记录",
    "admin.logs.none": "没有日志记录",
    "admin.logs.otherwise": "本站出了点问题。",
    "admin.hover.logs.show": "显示匹配的记录",
    "admin.hover.logs.prune": "删除最近一小时之前的日志",
    "admin.hover.logs.pruneAgree": "删除最近一小时之前的日志",
    "admin.importError.title": "导入错误",
    "admin.importError.documentId": "文档编号",
    "admin.importError.tournament": "锦标赛",
    "admin.importError.competition": "赛事",
    "admin.importError.newSite": "新站点",
    "admin.importError.oldSite": "旧站点",
    "ImportErrorKept.NotFound": "导入没有为该文档保留任何错误。",
    "admin.competitionView.otherwise": "无法在这里管理这个赛事。",
    "admin.competitions.block": "小组赛",
    "admin.competitions.knockout": "淘汰赛",
    "admin.competitions.swiss": "瑞士制",
    "admin.competitions.view": "查看",
    "admin.competitions.edit": "编辑",
    "admin.competitions.up": "上移",
    "admin.competitions.down": "下移",
    "admin.competitions.archive": "归档",
    "admin.competitions.restore": "恢复",
    "admin.competitions.archived": "已归档的赛事",
    "admin.competitions.none": "没有赛事",
    "admin.competitions.add": "添加赛事",
    "admin.competition.addTitle": "添加赛事",
    "admin.competition.editTitle": "编辑赛事",
    "admin.competition.name": "名称",
    "admin.competition.kind": "类型",
    "admin.competition.bestOf": "几局决胜",
    "admin.competition.rounds": "轮数",
    "admin.competition.places": "名额",
    "admin.competition.round": "第 {number} 轮",
    "admin.competition.bestOfs": "各轮几局决胜",
    "admin.competition.quarters": "四分之一决赛",
    "admin.competition.semis": "半决赛",
    "admin.competition.final": "决赛",
    "admin.competition.add": "添加",
    "admin.competition.save": "保存",
    "admin.competition.added": "已添加 {name}。",
    "admin.competition.otherwise": "无法按现在的样子保存这个赛事。",
    "CompetitionName.Missing": "请输入名称。",
    "CompetitionName.TooLong": "名称最多只能有 254 个字符。",
    "CompetitionName.NoLetterOrDigit": "名称中至少要有一个字母或数字。",
    "Tournament.KnockoutPlayerHasGames":
      "这个抽签中的选手已有比赛，所以不能更改名额。",
    "Tournament.CompetitionNameTaken":
      "这个锦标赛中的另一个赛事已经用了这个名称。",
    "BestOf.NotWhole": "请输入整数的局数。",
    "BestOf.TooSmall": "一场比赛至少要是 1 局决胜。",
    "Rounds.NotWhole": "请输入整数轮数。",
    "Rounds.TooSmall": "一个组至少要打 1 轮。",
    "KnockoutDraw.EvenBestOf":
      "淘汰赛的每场比赛必须分出胜负，所以局数要是奇数的决胜制。",
    "admin.hover.tournaments.new": "创建新的锦标赛",
    "admin.hover.tournaments.manage": "管理这个锦标赛的选手、队伍、赛事和比分",
    "admin.hover.tournaments.edit": "更改这个锦标赛的详情",
    "admin.hover.tournaments.scores": "录入这个锦标赛的比分",
    "admin.hover.tournaments.players": "管理这个锦标赛的选手",
    "admin.hover.competitions.view": "打开这个赛事，查看并录入其选手和比分",
    "admin.hover.tests.view": "打开这场对抗赛，查看并录入其比分",
    "admin.hover.teams.view": "打开这支队伍，查看并管理其选手",
    "admin.hover.dialog.player.add": "把这位选手添加到锦标赛",
    "admin.hover.dialog.player.save": "保存对这位选手的更改",
    "admin.hover.dialog.team.add": "把这支队伍添加到锦标赛",
    "admin.hover.dialog.team.save": "保存对这支队伍的更改",
    "admin.hover.dialog.test.add": "把这场对抗赛添加到锦标赛",
    "admin.hover.dialog.test.save": "保存对这场对抗赛的更改",
    "admin.hover.dialog.competition.add": "把这个赛事添加到锦标赛",
    "admin.hover.dialog.competition.save": "保存对这个赛事的更改",
    "admin.hover.dialog.score.add": "把这个比分添加到赛事",
    "admin.hover.dialog.score.save": "保存对这个比分的更正",
    "admin.hover.dialog.carryForward.save": "结转这位选手的成绩",
    "admin.hover.dialog.tournament.new": "创建这个锦标赛",
    "admin.hover.dialog.tournament.edit": "保存对这个锦标赛的更改",
    "admin.hover.modal.cancel": "关闭此窗口，不保存任何内容",
    "admin.hover.modal.ok": "关闭此消息",
    "admin.hover.tab": "显示“{name}”标签页",
    "admin.hover.tournaments.archive": "归档这个锦标赛；可以恢复",
    "admin.hover.tournaments.restore": "恢复这个已归档的锦标赛",
    "admin.hover.players.add": "向这个锦标赛添加选手",
    "admin.hover.players.edit": "更改这位选手的详情",
    "admin.hover.players.up": "把这位选手在列表中上移",
    "admin.hover.players.down": "把这位选手在列表中下移",
    "admin.hover.players.archive": "归档这位选手；可以恢复",
    "admin.hover.players.restore": "恢复这位已归档的选手",
    "admin.hover.teams.add": "向这个锦标赛添加队伍",
    "admin.hover.teams.edit": "更改这支队伍的详情",
    "admin.hover.teams.up": "把这支队伍在列表中上移",
    "admin.hover.teams.down": "把这支队伍在列表中下移",
    "admin.hover.teams.archive": "归档这支队伍；可以恢复",
    "admin.hover.teams.restore": "恢复这支已归档的队伍",
    "admin.hover.competitions.add": "向这个锦标赛添加赛事",
    "admin.hover.competitions.edit": "更改这个赛事的详情",
    "admin.hover.competitions.up": "把这个赛事在列表中上移",
    "admin.hover.competitions.down": "把这个赛事在列表中下移",
    "admin.hover.competitions.archive": "归档这个赛事；可以恢复",
    "admin.hover.competitions.restore": "恢复这个已归档的赛事",
    "admin.hover.tests.add": "添加两支队伍之间的对抗赛",
    "admin.hover.tests.edit": "更改这场对抗赛的详情",
    "admin.hover.tests.up": "把这场对抗赛在列表中上移",
    "admin.hover.tests.down": "把这场对抗赛在列表中下移",
    "admin.hover.tests.archive": "归档这场对抗赛；可以恢复",
    "admin.hover.tests.restore": "恢复这场已归档的对抗赛",
    "admin.hover.tests.toTeams": "前往“队伍”标签页，添加对抗赛所需的队伍",
    "admin.hover.scores.add": "向这个赛事添加一局的比分",
    "admin.hover.scores.edit": "更正这个比分",
    "admin.hover.scores.archive": "归档这个比分，使它不再计入；可以恢复",
    "admin.hover.scores.restore": "恢复这个已归档的比分，使它重新计入",
    "admin.hover.scores.withdraw": "把这个比分保留在列表中，但不再计入",
    "admin.hover.scores.unwithdraw": "让这个已作废的比分重新计入",
    "admin.hover.scores.up": "把这个比分在列表中前移",
    "admin.hover.scores.down": "把这个比分在列表中后移",
    "admin.hover.competitionPlayers.add": "把所选选手加入这个赛事",
    "admin.hover.competitionPlayers.up": "把这位选手在列表中上移",
    "admin.hover.competitionPlayers.down": "把这位选手在列表中下移",
    "admin.hover.competitionPlayers.remove": "把这位选手从赛事中移出",
    "admin.hover.competitionPlayers.withdraw": "让这位选手退出赛事",
    "admin.hover.competitionPlayers.unwithdraw":
      "让这位已退赛的选手重新回到赛事中",
    "admin.hover.competitionPlayers.carryForward":
      "从另一个赛事结转这位选手的成绩",
    "admin.hover.notes.add": "为这个锦标赛写一条新备注",
    "admin.hover.notes.edit": "更改这条备注",
    "admin.hover.notes.delete": "删除这条备注",
    "admin.hover.note.add": "保存这条备注，并添加到锦标赛",
    "admin.hover.note.save": "保存对这条备注的更改",
    "admin.hover.people.add": "给这个人该角色",
    "admin.hover.people.remove": "取消这个人的该角色",
    "admin.hover.worldRankings.import": "获取世界排名，并添加其中的选手",
    "admin.modal.cancel": "取消",
    "admin.modal.ok": "确定",
    "admin.people.emailAddress": "电子邮件地址",
    "admin.people.remove": "移除",
    "admin.people.otherwise": "无法完成该操作。",
    "admin.managers.you": "你",
    "admin.managers.add": "添加管理员",
    "admin.managers.none": "没有管理员",
    "admin.managers.removeTitle": "移除管理员",
    "admin.managers.removeExplanation": "{name} 将不再能够管理这个锦标赛。",
    "admin.managers.removeYourself.explanation":
      "你将不再能够管理这个锦标赛，这里没有人能替你撤销。其他管理员可以让你重新成为管理员。",
    "admin.managers.otherwise": "该地址无法成为管理员。",
    "admin.competitionPlayers.add": "添加选手",
    "admin.competitionPlayers.otherwise": "无法添加这位选手。",
    "admin.competitionPlayers.choose": "要添加的选手",
    "admin.competitionPlayers.nobody": "请选择一位选手",
    "admin.competitionPlayers.bye": "轮空",
    "admin.competitionPlayers.all": "所有选手都在这个赛事中",
    "admin.competitionPlayers.none": "没有选手",
    "admin.competitionPlayers.up": "上移",
    "admin.competitionPlayers.down": "下移",
    "admin.competitionPlayers.remove": "移除",
    "admin.competitionPlayers.withdraw": "退赛",
    "admin.competitionPlayers.unwithdraw": "取消退赛",
    "admin.competitionPlayers.withdrawn": "已退赛的选手",
    "admin.competitionPlayers.removeTitle": "移除选手",
    "admin.competitionPlayers.removeQuestion":
      "{name} 将被移出这个赛事。此操作无法撤销。",
    "admin.competitionPlayers.withdrawTitle": "让选手退赛",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} 将不再参加这个赛事的比赛，尚未进行的比赛将在没有他们的情况下判定。",
    "admin.competitionPlayers.carryForward": "结转",
    "admin.carryForward.title": "结转 - {name}",
    "admin.carryForward.save": "保存",
    "admin.carryForward.otherwise": "无法保存这次结转。",
    "admin.carryForward.matchWins": "比赛胜场",
    "admin.carryForward.matchLosses": "比赛负场",
    "admin.carryForward.gameWins": "胜局",
    "admin.carryForward.gameLosses": "负局",
    "admin.carryForward.hoopsFor": "得球门",
    "admin.carryForward.hoopsAgainst": "失球门",
    "CarryForward.MatchWinsNotWhole": "请输入整数的比赛胜场数。",
    "CarryForward.MatchWinsBelowZero": "比赛胜场数请输入 0 或更大的数。",
    "CarryForward.MatchLossesNotWhole": "请输入整数的比赛负场数。",
    "CarryForward.MatchLossesBelowZero": "比赛负场数请输入 0 或更大的数。",
    "CarryForward.GameWinsNotWhole": "请输入整数的胜局数。",
    "CarryForward.GameWinsBelowZero": "胜局数请输入 0 或更大的数。",
    "CarryForward.GameLossesNotWhole": "请输入整数的负局数。",
    "CarryForward.GameLossesBelowZero": "负局数请输入 0 或更大的数。",
    "CarryForward.HoopsForNotWhole": "请输入整数的得球门数。",
    "CarryForward.HoopsForBelowZero": "得球门数请输入 0 或更大的数。",
    "CarryForward.HoopsAgainstNotWhole": "请输入整数的失球门数。",
    "CarryForward.HoopsAgainstBelowZero": "失球门数请输入 0 或更大的数。",
    "admin.scores.add": "添加比分",
    "admin.scores.none": "没有比分",
    "admin.scores.edit": "编辑",
    "admin.scores.drawNotFilledTitle": "抽签未排满",
    "admin.scores.archive": "归档",
    "admin.scores.up": "上移",
    "admin.scores.down": "下移",
    "admin.scores.restore": "恢复",
    "admin.scores.archived": "已归档的比分",
    "admin.scores.archivedSaid": "已归档",
    "admin.scores.withdraw": "作废",
    "admin.scores.unwithdraw": "取消作废",
    "admin.scores.withdrawnSaid": "已作废",
    "admin.scores.otherwise": "无法完成该操作。",
    "admin.score.title": "添加比分",
    "admin.score.add": "添加这一局",
    "admin.score.winner": "胜者",
    "admin.score.winnerScore": "胜者的得分",
    "admin.score.loser": "负者",
    "admin.score.loserScore": "负者的得分",
    "admin.score.beat": "击败",
    "admin.score.added": "已添加 {winner} 战胜 {loser} 的这一局。",
    "admin.score.otherwise": "无法添加这一局。",
    "admin.score.correctTitle": "编辑比分",
    "admin.score.save": "保存",
    "admin.score.notCorrected": "无法更正这个比分。",
    "Game.WinnerMissing": "请选择胜者。",
    "Game.WinnerScoreMissing": "请输入胜者的得分。",
    "Game.LoserMissing": "请选择负者。",
    "Game.LoserScoreMissing": "请输入负者的得分。",
    "Score.NoPoints": "比分要以得分数开头。",
    "Game.SamePlayer": "选手不能和自己比赛。",
    "Game.WinnerNotAhead": "胜者的得分必须高于负者的得分，或者标记为获胜。",
    "Game.LoserMarked": "负者的得分不能标记为获胜。",
    "Game.ResultChanged":
      "更正不改变结果：获胜的一局仍是获胜，平局的一局仍是平局。",
    "Competition.MatchDecided": "他们的比赛已经分出胜负。",
    "Competition.DrawFull": "无法添加选手，因为淘汰赛已满。",
    "Competition.DrawNotFilled":
      "淘汰赛的每个名额都排上选手或轮空之前，无法添加比分。",
    "Competition.ByeOutsideKnockout": "只有淘汰赛才能有轮空。",
    "Competition.NotDrawnToMeet": "这些选手目前没有被抽到淘汰赛中相互比赛。",
    "Competition.WinnerHasPlayedOn":
      "这场比赛的胜者已经打了下一场，所以谁获胜不能再更改。",
    "CompetitionPlayer.Withdrawn": "已退赛的选手不再比赛。",
    "admin.players.add": "添加选手",
    "admin.players.none": "没有选手",
    "admin.players.edit": "编辑",
    "admin.players.archive": "归档",
    "admin.players.restore": "恢复",
    "admin.players.up": "上移",
    "admin.players.down": "下移",
    "admin.players.archiveTitle": "归档选手",
    "admin.players.archiveQuestion": "{name} 将被移出以下赛事：",
    "admin.players.archive.explanation": "恢复他们不会把他们放回这些赛事。",
    "admin.players.archived": "已归档的选手",
    "admin.players.archivedSaid": "已归档",
    "admin.player.addTitle": "添加选手",
    "admin.player.editTitle": "编辑选手",
    "admin.player.name": "姓名",
    "admin.player.representing": "代表",
    "admin.player.worldRankingName": "世界排名中的选手姓名",
    "admin.player.worldRankingKnown": "世界排名中有这个姓名。",
    "admin.player.worldRankingQuestioned":
      "世界排名中没有这个姓名的选手。可能拼写有误，也可能该选手是新进入排名的。",
    "admin.player.flag": "旗帜",
    "admin.player.add": "添加",
    "admin.player.save": "保存",
    "admin.player.added": "已添加 {name}。",
    "admin.player.otherwise": "无法按现在的样子保存这位选手。",
    "Tournament.PlayerNameTaken": "这个锦标赛中的另一位选手已经用了这个姓名。",
    "TournamentPlayer.NoSuchFlag": "请从现有的旗帜中选择一个。",
    "TournamentPlayer.NamedBye": "选手不能叫“轮空”。",
    "TournamentPlayer.NoLetterOrDigit": "姓名中至少要有一个字母或数字。",
    "admin.player.byesTitle": "轮空无需添加",
    "admin.player.byes":
      "轮空不是锦标赛的选手。每当添加选手时，淘汰赛都会提供“轮空”，抽签需要几个就有几个。",
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
      "队伍的对抗赛用它来称呼，如 AUS v ENG。",
    "admin.team.flag": "旗帜",
    "admin.team.add": "添加",
    "admin.team.save": "保存",
    "admin.team.added": "已添加 {name}。",
    "admin.team.otherwise": "无法按现在的样子保存这支队伍。",
    "admin.teamView.otherwise": "无法在这里查看这支队伍。",
    "admin.teamView.players": "选手",
    "TeamName.Missing": "请写明队伍叫什么。",
    "TeamName.TooLong": "这个名称太长。",
    "admin.notes.add": "添加备注",
    "admin.notes.none": "没有备注",
    "admin.notes.edit": "编辑",
    "admin.notes.delete": "删除",
    "admin.notes.deleteTitle": "删除备注",
    "admin.notes.deleteQuestion": "删除备注“{title}”吗？",
    "admin.notes.delete.explanation": "备注一旦删除就永远消失，无法找回。",
    "admin.notes.otherwise": "无法完成该操作。",
    "admin.note.addTitle": "添加备注",
    "admin.note.editTitle": "编辑备注",
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
    "admin.note.otherwise": "无法按现在的样子保存这条备注。",
    "ManagerNoteTitle.Missing": "请给备注写一个标题。",
    "ManagerNoteTitle.TooLong": "这个标题太长。",
    "ManagerNoteTitle.NoLetterOrDigit": "标题中至少要有一个字母或数字。",
    "ManagerNoteDescription.TooLong": "这段说明太长。",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "那条备注已经不在了。可能是其他管理员删除了它。",
    "EditManagerNote.NoSuchManagerNote":
      "那条备注已经不在了。可能是其他管理员删除了它。",
    "DeleteManagerNote.NoSuchManagerNote":
      "那条备注已经不在了。可能是其他管理员删除了它。",
    "ManagerNote.Deleted": "那条备注已被删除。可能是其他管理员删除了它。",
    "CommentaryTitle.Missing": "请给评论写一个标题。",
    "CommentaryTitle.TooLong": "这个标题太长。",
    "CommentaryTitle.NoLetterOrDigit": "标题中至少要有一个字母或数字。",
    "Commentary.TitleTaken": "另一条评论已经用了这个标题。",
    "CommentText.Missing": "请在评论中写点内容。",
    "CommentText.TooLong": "这条评论太长。",
    "TeamShortName.Missing": "请给队伍写一个简称。",
    "TeamShortName.TooLong": "简称最多只能有 10 个字符。",
    "TeamShortName.NoLetterOrDigit": "简称中至少要有一个字母或数字。",
    "Team.ShortNameLongerThanName": "简称不能比队伍的名称长。",
    "Team.NoSuchFlag": "请从现有的旗帜中选择一个。",
    "Team.Archived": "这支队伍已归档，需要先恢复。",
    "Team.InATest": "这支队伍参加了对抗赛，不能归档。",
    "Team.PlayerNameTaken": "这支队伍中的另一位选手已经用了这个姓名。",
    "TeamPlayer.NamedBye": "选手不能叫“轮空”。",
    "TeamPlayer.Archived": "这位选手已归档，需要先恢复。",
    "TeamPlayer.HasGames": "这位选手已经比过赛，不能归档。",
    "Tournament.TeamNameTaken": "这个锦标赛中的另一支队伍已经用了这个名称。",
    "Tournament.TeamShortNameTaken":
      "这个锦标赛中的另一支队伍已经用了这个简称。",
    "Tournament.NoSuchTeam": "这个锦标赛在这个地址没有队伍。",
    "Tournament.TeamArchived": "这支队伍已归档，只能在“队伍”标签页中恢复。",
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
    "admin.tests.toTeams": "前往“队伍”",
    "admin.tests.matches.one": "{count} 场比赛",
    "admin.tests.matches.other": "{count} 场比赛",
    "admin.tests.bestOf": "{games} 局决胜",
    "admin.tests.otherwise": "无法完成该操作。",
    "admin.test.addTitle": "添加对抗赛",
    "admin.test.editTitle": "编辑对抗赛",
    "admin.test.firstTeam": "A 队",
    "admin.test.secondTeam": "B 队",
    "admin.test.versus": "对",
    "admin.test.starts": "开始",
    "admin.test.finishes": "结束",
    "admin.test.expectedMatches": "预计比赛场数",
    "admin.test.bestOf": "几局决胜",
    "admin.test.group": "分组",
    "admin.test.add": "添加",
    "admin.test.save": "保存",
    "admin.test.added": "已添加 {name}。",
    "admin.test.otherwise": "无法按现在的样子保存这场对抗赛。",
    "admin.testView.otherwise": "无法在这里查看这场对抗赛。",
    "AddTest.FirstTeamMissing": "请选择第一支队伍。",
    "AddTest.SecondTeamMissing": "请选择第二支队伍。",
    "UpdateTest.FirstTeamMissing": "请选择第一支队伍。",
    "UpdateTest.SecondTeamMissing": "请选择第二支队伍。",
    "ExpectedMatches.NotWhole": "请输入整数的比赛场数。",
    "ExpectedMatches.TooSmall": "对抗赛预计至少要有 1 场比赛。",
    "TestGroup.TooLong": "这个分组太长。",
    "Tournament.TestAgainstItself": "一支队伍不和自己进行对抗赛。",
    "Tournament.TestFinishesBeforeStarts": "对抗赛不能在开始之前结束。",
    "Tournament.TestStartsBeforeTournament": "对抗赛不能早于所属锦标赛开始。",
    "Tournament.TestFinishesAfterTournament": "对抗赛不能晚于所属锦标赛结束。",
    "Tournament.TestHasGamesInUse":
      "这场对抗赛有比赛，所以在这些比赛归档之前，它无法归档。",
    "Tournament.TestHasGames": "这场对抗赛现在已有比赛，所以不能再更改其队伍。",
    "Tournament.ExpectedMatchesBelowStarted": "已经开始的比赛比这个数还多。",
    "Tournament.BestOfBelowGamesPlayed": "已经有两位选手打了比这更多的局数。",
    "Competition.ExpectedMatchesReached":
      "这场对抗赛已开始的比赛场数已达到预计的场数。",
    "Competition.SameTeam": "同一支队伍的两位选手之间不比赛。",
    "AddManager.NoSuchAccount": "该地址没有可以成为管理员的账户。",
    "admin.scorers.add": "添加记分员",
    "admin.scorers.none": "没有记分员",
    "admin.scorers.removeTitle": "移除记分员",
    "admin.scorers.removeExplanation":
      "{name} 将不再能够录入这个锦标赛的比分。",
    "admin.scorers.otherwise": "该地址无法成为记分员。",
    "AddScorer.NoSuchAccount": "该地址没有可以成为记分员的账户。",
    "Account.NotAnAdministrator": "只有站点管理员才能这样做。",
    "AddRole.NoSuchAccount": "该地址没有可以被授予该角色的账户。",
    "AddRole.NoSuchRole": "没有这个角色。",
    "RemoveRole.NoSuchAccount": "没有这个账户。",
    "RemoveRole.NoSuchRole": "没有这个角色。",
    "RemoveRole.Yourself": "你不能取消自己的站点管理员角色。",
    "AccountsWithRole.NoSuchRole": "没有这个角色。",
    "Tournament.AlreadyAManager":
      "该账户已经是这个锦标赛的管理员，并且可以做记分员能做的一切。",

    "TournamentName.Missing": "请写明锦标赛叫什么。",
    "TournamentName.TooShort": "这个名称太短。",
    "TournamentName.TooLong": "这个名称太长。",
    "TournamentName.AllLowerCase": "名称不要全部用小写字母书写。",
    "TournamentName.AllCapitals": "名称不要全部用大写字母书写。",
    "TournamentName.NoLetterOrDigit": "名称中至少要有一个字母或数字。",
    "ReadOnlyDate.Unreadable": "请给出日期。",
    "Tournament.FinishesBeforeStarts": "锦标赛不能在开始之前结束。",
    "Tournament.StartsAfterNextYear": "锦标赛不能在明年之后开始。",
    "Tournament.FinishesAfterNextYear": "锦标赛不能在明年之后结束。",
    "CreateTournament.NoSuchCountry": "请选择国家或地区。",
    "TournamentSubtitle.TooLong": "副标题最多只能有 2000 个字符。",
    "Tournament.NotAManager": "只有这个锦标赛的管理员才能更改它。",
    "Tournament.NotAManagerOrScorer":
      "只有这个锦标赛的管理员或记分员才能查看它。",
    "Tournament.Archived": "这个锦标赛已归档，需要先恢复才能更改。",
    "UpdateTournament.NoSuchTournament": "这个地址没有锦标赛。",

    "sport.ac": "协会槌球",
    "sport.gc": "高尔夫槌球",
    "sport.a6w": "美式六门槌球",
    "sport.rc": "Ricochet",
    "sport.gb": "门球",
    "format.standard": "标准",
    "format.teams": "团体",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
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
    "country.gs": "南乔治亚和南桑威奇群岛",
    "country.gt": "危地马拉",
    "country.gu": "关岛",
    "country.gw": "几内亚比绍",
    "country.gy": "圭亚那",
    "country.hk": "香港",
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
    "country.mo": "澳门",
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
    "country.tw": "台湾",
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

    "Email.ConfirmAddress.subject": "确认你在 {siteName} 的电子邮件地址",
    "Email.ConfirmAddress.body": `
<p>你好，</p>

<p>
    感谢你在 <strong>{siteName}</strong> 创建账户。<br />
    在开始使用账户之前，请点击下面的按钮确认你的电子邮件地址：
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
    如果按钮无法使用，你也可以在浏览器中打开下面的链接来确认你的电子邮件地址：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    如果你没有创建这个账户，可以放心忽略这封电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "确认你在 {siteName} 的电子邮件地址的新链接",
    "Email.ConfirmAddressAgain.body": `
<p>你好，</p>

<p>
    你最近申请了一封新的电子邮件，用来确认你在 <strong>{siteName}</strong> 的电子邮件地址。<br />
    请点击下面的按钮确认你的电子邮件地址：
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
    如果按钮无法使用，你也可以在浏览器中打开下面的链接来确认你的电子邮件地址：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    确认之后，你就可以不受打扰地继续使用你的账户。
</p>

<p>
    如果你没有申请这封电子邮件，可以放心忽略它。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject": "有人试图用你的电子邮件地址注册",
    "Email.AlreadyRegistered.body": `
<p>你好，</p>

<p>
    有人试图用这个电子邮件地址在 <strong>{siteName}</strong> 注册，
    而这个地址已经有账户了。你的账户没有任何变化。<br />
    如果是你本人，你已经有账户了，可以直接登录：
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
    如果你忘记了密码，可以在这里重置：
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
    如果不是你本人，你无需做任何事。没有人获得进入你账户的途径。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "确认把你的 {siteName} 账户迁移到这个地址",
    "Email.ConfirmNewEmailAddress.body": `
<p>你好，</p>

<p>
    有人登录了一个 <strong>{siteName}</strong> 账户，并申请把它迁移到这个电子邮件地址。
    如果是你本人，请在登录该账户的状态下在这里确认。链接 24 小时内有效。
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
    如果不是你本人，你无需做任何事。没有账户会迁移到这里。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "有人申请把一个账户迁移到你的电子邮件地址",
    "Email.AlreadyHasAnAccount.body": `
<p>你好，</p>

<p>
    有人登录了一个 <strong>{siteName}</strong> 账户，并申请把它迁移到这个电子邮件地址，
    而这个地址已经有自己的账户了。没有任何账户被迁移，你的账户也没有任何变化。
</p>

<p>
    如果是你本人，你在这个地址上已经有账户了，可以直接登录。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "你的 {siteName} 账户已迁移",
    "Email.EmailAddressChanged.body": `
<p>你好，</p>

<p>
    你的 <strong>{siteName}</strong> 账户刚刚被迁移到另一个电子邮件地址
    {emailAddress}，从现在起使用该地址登录。
</p>

<p>
    如果不是你本人，说明别人控制了你的账户。请回复这封电子邮件告诉我们。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "你的 {siteName} 密码已更改",
    "Email.PasswordChanged.body": `
<p>你好，</p>

<p>
    你的 <strong>{siteName}</strong> 账户的密码刚刚被更改，
    其他所有登录了该账户的浏览器都已退出登录。<br />
    如果是你本人，你无需做任何事。
</p>

<p>
    如果不是你本人，说明别人拿到了你的密码。请在这里设置一个新密码，他们就会被退出登录：
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

    "Email.SetNewPassword.subject": "为 {siteName} 设置新密码",
    "Email.SetNewPassword.body": `
<p>你好，</p>

<p>
    你最近申请重置你在 <strong>{siteName}</strong> 的密码。<br />
    你可以点击下面的按钮重置密码：
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
    如果按钮无法使用，你也可以在浏览器中打开下面的链接来重置密码：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    如果你没有申请重置密码，可以放心忽略这封电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "为 {siteName} 设置密码",
    "Email.SetPassword.body": `
<p>你好，</p>

<p>
    你的 <strong>{siteName}</strong> 账户没有密码：你是通过 Google 登录的。<br />
    你申请设置一个密码，这样你也可以用电子邮件地址和密码登录。
    你可以点击下面的按钮设置密码：
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
    如果按钮无法使用，你也可以在浏览器中打开下面的链接来设置密码：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    链接一小时内有效。如果你没有申请设置密码，可以放心忽略这封电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "没有使用这个电子邮件地址的 {siteName} 账户",
    "Email.RegisterInstead.body": `
<p>你好，</p>

<p>
    有人为一个在 <strong>{siteName}</strong> 上没有账户的电子邮件地址申请了重置密码。
</p>

<p>
    如果你想使用我们的服务，可以访问下面的地址创建新账户：<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    如果这不是你的申请，可以放心忽略这封电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject": "确认注销你的 {siteName} 账户",
    "Email.ConfirmForgetting.body": `
<p>你好，</p>

<p>
    你申请注销你的 <strong>{siteName}</strong> 账户。<br />
    点击下面的按钮，了解这意味着什么，并明确表示你确实要这样做：
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
        注销我的账户
    </a>
</p>

<p>
    如果按钮无法使用，你也可以在浏览器中打开下面的链接：<br />
    <a href="{link}">{link}</a>
</p>

<p>
    一旦注销，任何人都再也无法读取你的姓名和电子邮件地址，你的账户也无法再登录。此操作无法撤销。
</p>

<p>
    链接只能使用一次，在你申请后 15 分钟内有效，并且只有在你登录此账户时才有效。
    过期后，请从你的账户中重新申请。
</p>

<p>
    如果不是你申请的，只要没有人点击链接，就不会发生任何事。
    不过，有人登录了你的账户并提出了申请，所以请在忘记密码页面设置一个新密码，
    以确保他们无法再次登录。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject": "注册已暂停：无法连接 {service}",
    "Email.RegistrationsSuspended.body": `
<p>你好，</p>

<p>
    {siteName} 在 {when} 无法连接 {service}。在它恢复响应之前，
    需要它的读者（用于注册或设置新密码）会被告知稍后再试。
</p>

<p>
    无需做任何解除操作。每次尝试都会重新询问 {service}，
    它一恢复响应，页面就会重新正常工作。
</p>

<p>
    在 {service} 持续不可用期间，我们最多每小时给你发一封关于此事的电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject": "{siteName} 无法连接数据库",
    "Email.DatabaseUnreachable.body": `
<p>你好，</p>

<p>
    {siteName} 在 {when} 无法连接数据库。在数据库恢复响应之前，每个需要它的页面都会告诉读者网站暂时无法使用，请稍后再试。
</p>

<p>
    无需任何操作。每个请求都会重新申请连接，数据库一恢复响应，网站就会恢复正常。
</p>

<p>
    在数据库持续无法连接期间，每隔 {minutes} 分钟最多会就此给你发送一封电子邮件。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} 在处理请求时出错",
    "Email.UnhandledError.body": `
<p>你好，</p>

<p>
    {siteName} 在 {when} 处理对 {asked} 的请求时出错。读者看到的参考编号是 {reference}，日志中该编号下有出错原因。
</p>

<p>
    出故障的网站往往每个请求都会出错，所以每小时最多只会就出错给您发送 4 封电子邮件。之后的错误同样会记录在日志中。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
