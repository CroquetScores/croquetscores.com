// The site's words in Japanese. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written in the polite form (です・ます) and to the reader as あなた left
// unsaid, as Japanese does. The plain form would read as curt on a page
// speaking to a stranger, and the honorific form (敬語 at its fullest) would
// make a scoring site sound like a bank; the polite form is what Japanese
// websites and sports bodies use. Menu items and buttons are short nouns or
// verb phrases without a closing です, as Japanese interfaces write them.
//
// Croquet words follow what the Japanese croquet community says: フープ for
// a hoop, テストマッチ for a test, and ゲートボール for gateball, which is
// Japan's own sport and keeps its own name. Where the sport has no settled
// Japanese term the English name is written in katakana, or kept as it is
// where players write it in letters, as the rankings' own abbreviations are.
import type { Language } from "../common/language.js";

export const japanese: Language = {
  tag: "ja",
  name: "日本語",
  words: {
    "site.skipToContent": "本文へ移動",
    "navigation.menu": "メニュー",
    "navigation.label": "メイン",
    "navigation.home": "ホーム",
    "navigation.help": "ヘルプ",
    "navigation.admin": "管理",
    "sections.label": "セクション",
    "theme.label": "テーマ",
    "theme.light": "ライト",
    "theme.dark": "ダーク",
    "theme.system": "システム",
    "footer.donate": "寄付する",
    "footer.plea":
      "{siteName}をお楽しみいただけていますか？今後の開発を支えるため、ぜひご寄付をお願いします。",
    "footer.copyright": "© Copyright {years}, {owner}",
    "tryWebsite.banner":
      "ここは{siteName}を安心して試せる場所です。ここに入力した内容は、いつでも削除されることがあります。",

    "language.label": "言語",
    "language.choose": "変更",

    "form.otherwise":
      "入力内容に誤りがあります。内容を確認して、もう一度お試しください。",

    "account.menu": "アカウント",
    "account.register": "登録",
    "account.signIn": "サインイン",
    "account.forgotPassword": "パスワードをお忘れの方",
    "account.signOut": "サインアウト",
    "account.profile": "プロフィール",
    "account.changePassword": "パスワードの変更",
    "account.changeEmailAddress": "メールアドレスの変更",
    "account.changeName": "名前の変更",
    "account.setPassword": "パスワードの設定",
    "account.forgetAccount": "アカウントの削除",

    "register.title": "登録",
    "register.emailAddress": "メールアドレス",
    "register.submit": "登録",
    "register.withGoogle": "Googleで登録",
    "register.or": "または",
    "SignInWithGoogle.EmailAddressNotVerified":
      "このメールアドレスがあなたのものであることをGoogleが確認していないため、ここではGoogleで利用できません。下のメールアドレスをお使いください。",
    "SignInWithGoogle.LinkedToAnother":
      "このメールアドレスのアカウントはすでにあり、別のGoogleアカウントと連携されています。そのGoogleアカウントか、メールアドレスとパスワードでサインインしてください。",
    "SignInWithGoogle.NameMissing":
      "Googleからお名前が届かず、アカウントには名前が必要です。下のメールアドレスをお使いください。",
    "Google.Unreachable":
      "ただいまGoogleに接続できません。数分後にもう一度お試しいただくか、下のメールアドレスをお使いください。",
    "Registration.NotAPerson":
      "人による操作とは判断できませんでした。もう一度お試しください。それでも解決しない場合は、数分待ってからやり直してください。",
    "EmailAddress.Missing": "メールアドレスを入力してください。",
    "EmailAddress.NoAt": "メールアドレスには@が必要です。",
    "EmailAddress.MoreThanOneAt": "メールアドレスの@は1つだけです。",
    "EmailAddress.NoDomain":
      "メールアドレスの@のあとには、example.comのようなドメインが必要です。",

    "welcome.title": "メールをご確認ください",
    "welcome.checkEmail":
      "入力されたアドレスにメールを送りました。メール内のリンクから手続きを続けてください。",
    "welcome.nothingArrived":
      "数分たっても届かない場合は、迷惑メールフォルダーをご確認ください。",
    "welcome.home": "{siteName}に戻る",

    "newConfirmationLink.title": "新しいリンクを取得",
    "newConfirmationLink.explanation":
      "メールアドレス確認用のリンクの有効期限が切れました。新しいリンクを請求すると、登録したアドレスに送られます。",
    "newConfirmationLink.send": "新しいリンクを送る",
    "newConfirmationLink.home": "{siteName}に戻る",
    "newConfirmationLink.signIn": "サインイン",
    "newConfirmationLink.sent.title": "メールをご確認ください",
    "newConfirmationLink.sent.explanation":
      "新しいリンクを送りました。リンクを開いてメールアドレスを確認してください。数分たっても届かない場合は、迷惑メールフォルダーをご確認ください。",
    "newConfirmationLink.alreadyConfirmed.title":
      "このメールアドレスは確認済みです",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "これ以上確認することはありません。確認のときに設定したパスワードでサインインしてください。",
    "newConfirmationLink.noLongerWorks.title": "このリンクは使えません",
    "newConfirmationLink.noLongerWorks.explanation":
      "メールのリンクが最後まで正しくコピーされているかご確認ください。それでも使えない場合は、もう一度登録すると新しいリンクが送られます。",
    "newConfirmationLink.tooMany.title": "しばらくしてからお試しください",
    "newConfirmationLink.tooMany.explanation":
      "最近、このアドレスにいくつものリンクを送りました。1時間待ってからもう一度請求してください。その間は迷惑メールフォルダーもご確認ください。",

    "forgotPassword.title": "パスワードをお忘れですか？",
    "forgotPassword.emailAddress": "メールアドレス",
    "forgotPassword.submit": "再開の方法を送る",
    "forgotPassword.home": "{siteName}に戻る",
    "forgotPassword.sent.title": "メールをご確認ください",
    "forgotPassword.sent.explanation":
      "そのアドレスのアカウントがある場合、新しいパスワードを設定するリンクを送りました。1時間以内にリンクを開いてください。数分たっても届かない場合は、迷惑メールフォルダーをご確認ください。",
    "forgotPassword.tryAgainLater":
      "最近、ここから再開の方法が何度も請求されています。1時間待ってからもう一度お試しください。",

    "setNewPassword.title": "新しいパスワードの設定",
    "setNewPassword.password": "パスワード",
    "setNewPassword.confirmPassword": "パスワードの確認",
    "setNewPassword.submit": "新しいパスワードを設定",
    "setNewPassword.home": "{siteName}に戻る",
    "setNewPassword.signIn": "サインイン",
    "setNewPassword.askAgain": "新しいリンクを請求",
    "setNewPassword.changed.title": "パスワードを変更しました",
    "setNewPassword.changed.explanation":
      "サインインしていたすべての場所からサインアウトしました。新しいパスワードでサインインしてください。",
    "setNewPassword.expired.title": "リンクの有効期限が切れました",
    "setNewPassword.expired.explanation":
      "新しいパスワードを設定するリンクの有効期間は1時間です。もう一度請求すると、同じアドレスに送られます。",
    "setNewPassword.noLongerWorks.title": "このリンクは使えません",
    "setNewPassword.noLongerWorks.explanation":
      "すでに使われたか、リンクの末尾が欠けている可能性があります。まだ必要な場合は、もう一度請求してください。",
    "BreachedPasswords.Unreachable":
      "ただいまパスワードを確認できないため、変更されていません。数分後にもう一度お試しください。リンクは有効期限まで使えます。",

    "forgetAccount.title": "アカウントの削除",
    "forgetAccount.explanation":
      "お名前とメールアドレスを読めない状態にして、アカウントを閉鎖できます。ご本人であることを確かめるため、まずアカウントのアドレスにリンクをメールで送ります。そのリンクを開くまで、何も削除されません。",
    "forgetAccount.submit": "リンクをメールで送る",
    "forgetAccount.sent.title": "メールをご確認ください",
    "forgetAccount.sent.explanation":
      "アカウントのアドレスにリンクをメールで送りました。リンクの有効期間は15分で、このアカウントにサインインしている間だけ使えます。",
    "forgetAccount.confirm.title": "アカウントを完全に削除しますか？",
    "forgetAccount.confirm.explanation":
      "削除すると、お名前とメールアドレスは誰にも二度と読めなくなり、アカウントにはサインインできなくなります。元に戻すことはできません。",
    "forgetAccount.confirm.submit": "アカウントを削除する",
    "forgetAccount.forgotten.title": "アカウントを削除しました",
    "forgetAccount.forgotten.explanation":
      "お名前とメールアドレスはもう読めません。サインインしていたすべての場所からサインアウトしました。",
    "forgetAccount.noLongerWorks.title": "このリンクは使えません",
    "forgetAccount.noLongerWorks.explanation":
      "有効期限が切れたか、すでに使われたか、サインインしていないアカウント用のリンクです。それでも削除したい場合は、アカウントからもう一度請求してください。",
    "forgetAccount.lastAdministrator.title": "アカウントを削除できません",
    "forgetAccount.lastAdministrator.explanation":
      "あなたはこのサイトの唯一の管理者です。ほかの人に管理者の役割を渡すと、アカウントを削除できるようになります。",
    "forgetAccount.askAgain": "もう一度請求",
    "forgetAccount.home": "{siteName}に戻る",

    "registrationsSuspended.title": "登録を一時停止しています",
    "registrationsSuspended.explanation":
      "登録に必要なサービスにただいま接続できないため、再び応答するまで誰も登録できません。入力した内容は保存されていません。",
    "registrationsSuspended.tryAgainLater":
      "しばらくしてからもう一度お試しください。サイトの管理者には連絡済みです。",
    "registrationsSuspended.home": "{siteName}に戻る",

    "signIn.title": "サインイン",
    "signIn.emailAddress": "メールアドレス",
    "signIn.password": "パスワード",
    "signIn.submit": "サインイン",
    "signIn.forgotPassword": "パスワードをお忘れの方",
    "signIn.register": "登録",
    "signIn.withGoogle": "Googleでサインイン",
    "signIn.or": "または",
    "signIn.tryAgainLater":
      "最近、試行が多すぎます。1時間待ってからもう一度お試しください。",
    "SignIn.Failed":
      "メールアドレスかパスワードが正しくありません。もう一度お試しください。",

    "profile.title": "プロフィール",
    "profile.name": "名前：",
    "profile.emailAddress": "メールアドレス：",

    "changeName.title": "名前の変更",
    "changeName.name": "名前",
    "changeName.submit": "名前を変更",

    "setPassword.title": "パスワードの設定",
    "setPassword.explanation":
      "このアカウントにはパスワードがなく、Googleでサインインしています。パスワードでもサインインできるようにするため、設定用のリンクを{emailAddress}にメールで送ります。",
    "setPassword.submit": "リンクをメールで送る",
    "setPassword.sent.title": "メールをご確認ください",
    "setPassword.sent.explanation":
      "パスワード設定用のリンクをメールで送りました。リンクの有効期間は1時間です。",
    "setPassword.profile": "プロフィールに戻る",

    "changePassword.title": "パスワードの変更",
    "changePassword.currentPassword": "現在のパスワード",
    "changePassword.password": "新しいパスワード",
    "changePassword.passwordConfirmation": "パスワードの確認",
    "changePassword.forgotPassword": "パスワードをお忘れの方",
    "changePassword.submit": "パスワードを変更",
    "ChangePassword.WrongPassword": "パスワードが違います。",

    "changeEmailAddress.title": "メールアドレスの変更",
    "changeEmailAddress.emailAddress": "新しいメールアドレス",
    "changeEmailAddress.currentPassword": "現在のパスワード",
    "changeEmailAddress.submit": "確認用のリンクを送る",
    "changeEmailAddress.sent.title": "メールをご確認ください",
    "changeEmailAddress.sent.explanation":
      "変更を確認するリンクを新しいメールアドレスに送りました。サインインした状態でリンクを開くと、アカウントがそのアドレスに移ります。",
    "changeEmailAddress.confirm.title": "アカウントの移行",
    "changeEmailAddress.confirm.explanation":
      "アカウントを{emailAddress}に移します。今後はそのアドレスでサインインしてください。",
    "changeEmailAddress.confirm.submit": "アカウントを移行する",
    "changeEmailAddress.noLongerWorks.title": "このリンクは使えません",
    "changeEmailAddress.noLongerWorks.explanation":
      "有効期限が切れたか、すでに使われたか、サインイン中のアカウント用に送られたものではありません。プロフィールからもう一度請求してください。",
    "changeEmailAddress.taken.title": "アカウントは移行されていません",
    "changeEmailAddress.profile": "プロフィールに戻る",
    "ChangeEmailAddress.WrongPassword": "パスワードが違います。",
    "ChangeEmailAddress.Unchanged":
      "アカウントはすでにこのアドレスになっています。",
    "ChangeEmailAddress.Taken":
      "そのメールアドレスには、すでに別のアカウントができたため、移行できません。",

    "confirmEmailAddress.title": "メールアドレスの確認",
    "confirmEmailAddress.name": "名前",
    "confirmEmailAddress.password": "パスワード",
    "confirmEmailAddress.confirmPassword": "パスワードの確認",
    "confirmEmailAddress.submit": "メールアドレスを確認する",
    "confirmEmailAddress.signIn": "サインイン",
    "confirmEmailAddress.home": "{siteName}に戻る",
    "confirmEmailAddress.confirmed.title": "メールアドレスを確認しました",
    "confirmEmailAddress.confirmed.explanation":
      "アカウントの準備ができました。いま入力したメールアドレスとパスワードでサインインしてください。",
    "confirmEmailAddress.expired.title": "リンクの有効期限が切れました",
    "confirmEmailAddress.expired.explanation":
      "メールアドレス確認用のリンクの有効期間は24時間です。新しいリンクを請求すると、同じアドレスに送られます。",
    "confirmEmailAddress.expired.newLink": "新しいリンクを送る",
    "confirmEmailAddress.noLongerWorks.title": "このリンクは使えません",
    "confirmEmailAddress.noLongerWorks.explanation":
      "メールのリンクが最後まで正しくコピーされているかご確認ください。それでも使えない場合は、もう一度登録すると新しいリンクが送られます。",
    "confirmEmailAddress.alreadyConfirmed.title":
      "このメールアドレスは確認済みです",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "これ以上の手続きはありません。確認のときに設定したパスワードでサインインしてください。",

    "PersonName.Missing": "名前を入力してください。",
    "PersonName.TooShort": "名前は3文字以上にしてください。",
    "PersonName.TooLong": "名前は254文字以内にしてください。",
    "WorldRankingName.TooShort": "世界ランキング名は3文字以上にしてください。",
    "WorldRankingName.TooLong": "世界ランキング名は254文字以内にしてください。",
    "Password.Missing": "パスワードを入力してください。",
    "Password.TooShort": "パスワードは12文字以上にしてください。",
    "Password.ConfirmationDiffers":
      "上のパスワードと一致しません。もう一度入力してください。",
    "Password.Breached":
      "このパスワードは、ほかの場所で起きた情報漏えいで流出したものなので、ここでは安全に使えません。別のパスワードを選んでください。",

    "javaScriptRequired.title": "スクリプトが必要です",
    "javaScriptRequired.explanation":
      "登録する人が人間であることを確かめるため、このサイトのスクリプトを有効にする必要があります。有効にしてから、もう一度登録してください。",
    "javaScriptRequired.register": "登録に戻る",
    "javaScriptRequired.home": "{siteName}に戻る",

    "errors.backHome": "{siteName}に戻る",
    "errors.notFound": "見つかりません",
    "errors.refused": "実行できませんでした",
    "errors.refusedDetail": "送信された内容に誤りがありました。",
    "errors.sorry": "申し訳ありません",
    "errors.sorryDetail": "そのリクエストは処理できませんでした。",
    "errors.failed": "問題が発生しました",
    "errors.reference": "参照番号 {reference}。",

    "home.recentResults": "最近の結果",
    "home.recentResults.none": "過去7日間に追加された試合はありません。",
    "home.upcomingTournaments": "開催予定の大会",
    "home.upcomingTournaments.none": "今後60日間に始まる大会はありません。",
    "home.allTournaments": "{year}年のすべての大会",
    "year.heading": "{year}年の大会",
    "year.none": "{year}年に始まる大会はありません。",
    "yearSport.heading": "{year}年の{sport}大会",
    "yearSport.none": "{year}年に始まる{sport}の大会はありません。",
    "tournament.recent": "最近",
    "tournament.summary": "概要",
    "test.bestOf": "各対戦は{count}ゲーム制で、勝ち数の多い方が勝ちです。",
    "test.vs": "対",
    "test.matches": "対戦",
    "test.games": "ゲーム",
    "test.hoops": "フープ",
    "teamSummary.tests": "テスト",
    "teamSummary.matches": "対戦",
    "teamSummary.games": "ゲーム",
    "teamSummary.hoops": "フープ",
    "teamSummary.wins": "勝ち",
    "teamSummary.losses": "負け",
    "teamSummary.draws": "引き分け",
    "teamSummary.for": "得",
    "teamSummary.against": "失",
    "teamSummary.net": "差",
    "tournament.players": "選手",
    "tournament.test": "{first}対{second}",
    "tournament.notes": "お知らせ",
    "tournament.commentary": "実況",
    "tournament.beat": "勝ち",
    "tournament.drewWith": "引き分け",
    "tournament.ago.seconds": "{count}秒前",
    "tournament.ago.minutes": "{count}分前",
    "tournament.ago.hour": "1時間前",
    "tournament.ago.hours": "{count}時間前",
    "tournament.none": "まだ試合は行われていません。",
    "players.none": "まだ選手は追加されていません。",

    "commentaries.by": "投稿者：",
    "commentaries.start": "新しい実況を始める",
    "commentaries.disclaimer.heading": "免責事項",
    "commentaries.disclaimer":
      "これらの実況に述べられた見解や意見は投稿者個人のものであり、Tim Murphyや{site}の見解を表すとは限りません。",
    "commentaries.guidelines.heading": "ガイドライン",
    "commentaries.guidelines.responsible":
      "実況の内容は、投稿した本人の責任となります。",
    "commentaries.guidelines.purpose":
      "実況機能は、大会で起きていることを伝えるためのものです。応援の言葉などを伝える「ソーシャルメディア」の場としては作られていません。",
    "commentaries.guidelines.hatred":
      "暴力や憎悪をあおるおそれのある内容は投稿しないでください。人種、宗教、民族、性別、年齢、心身の障害、性的指向を理由に他人を貶めるコメントは認めません。",
    "commentaries.guidelines.abuse":
      "理由のない中傷は認めません。基本の考え方として、コメントは人ではなく話題そのものに向けてください。つまり、個人を攻撃せず、目の前の問題について書いてください。",
    "commentaries.guidelines.unlawful":
      "著作権の侵害や名誉毀損のおそれがあるなど、法的に問題のあるコメントは削除します。",
    "commentaries.guidelines.shouting":
      "実況では、汚い言葉や、すべて大文字での書き込みはお控えください。",
    "commentaries.guidelines.selling":
      "コメント欄を商用目的やスパムに使わないでください。商品やサービスの宣伝、販売促進、勧誘をするコメントは削除します。",
    "commentaries.guidelines.links":
      "コメントへのリンクの使用は控えめにしてください。不適切な内容へのリンクを含むコメントは削除します。",
    "commentaries.guidelines.impersonating":
      "コメント欄で他人になりすましたり、電話番号、住所、メールアドレスなど、うっかり誰かを危険にさらしかねない個人情報を投稿したりしないでください。",
    "commentaries.reporting.heading": "実況の報告",
    "commentaries.reporting.before":
      "このガイドラインに沿わない実況を見つけたら、",
    "commentaries.reporting.after":
      "までご報告ください。その際は、ウェブアドレスと問題のある実況を引用してください。例：",
    "commentaries.reporting.exampleComment": "「削除すべきコメント」",
    "commentaries.reporting.exampleReason":
      "このコメントは、次の理由で削除すべきです……",
    "commentaries.reporting.reviewed":
      "報告しても自動的に削除されるわけではありませんが、すべての報告を確認します。",
    "commentaries.reporting.reserved":
      "{site}は、実況を削除する権利を有します。",
    "commentaries.reporting.subject": "{site} 実況の報告",
    "commentaries.reporting.body":
      "ウェブアドレス、問題のあるコメント、削除すべき理由を書いてください。",

    "startCommentary.title": "新しい実況を始める",
    "startCommentary.titleField": "タイトル",
    "startCommentary.submit": "実況を始める",
    "marks.new": "新着",
    "notes.none": "運営からのお知らせはまだありません。",
    "note.edited": "編集済み",
    "commentary.none": "まだコメントはありません。",
    "commentary.edited": "編集済み",
    "commentary.edit": "編集",
    "commentary.delete": "削除",
    "commentary.comment": "コメント",
    "commentary.add": "コメントを追加",
    "commentary.notSent":
      "コメントを送信できませんでした。ページを読み込み直して、保存されたかどうかをご確認ください。",
    "changeCommentaryTitle.title": "タイトルの変更",
    "changeCommentaryTitle.submit": "保存",
    "editComment.title": "コメントの編集",
    "editComment.save": "保存",
    "deleteComment.title": "コメントの削除",
    "deleteComment.question":
      "このコメントを削除しますか？元に戻すことはできません。",
    "deleteComment.confirm": "コメントを削除",
    "deleteComment.keep": "残す",

    "player.games": "試合",
    "player.competitions": "部門",
    "player.beat": "勝ち",
    "player.lostTo": "負け",
    "player.drewWith": "引き分け",
    "player.score": "{score}対{opponent}",
    "player.noGames": "まだ試合は行われていません。",
    "player.noCompetitions": "まだどの部門にも出場していません。",
    "block.wins": "勝ち",
    "block.matches": "対戦",
    "block.netGames": "ゲーム得失差",
    "block.games": "ゲーム",
    "block.netHoops": "フープ得失差",
    "block.won": "勝ち",
    "block.lost": "負け",
    "block.drawn": "引き分け",
    "block.withdrawn": "棄権",
    "block.gameWithdrawn": "棄権",
    "block.losses": "負け",
    "competition.views": "表示",
    "competition.view.grid": "対戦表",
    "competition.view.summary": "概要",
    "competition.view.orderOfPlay": "試合順",
    "blockSummary.ranking":
      "対戦の勝率の高い順に並べ、同率の場合はフープ得失差の順にしています。大会独自の規定により、順位が異なる場合があります。",
    "orderOfPlay.none": "まだ試合は行われていません。",
    "knockout.round.final": "決勝",
    "knockout.round.semis": "準決勝",
    "knockout.round.quarters": "準々決勝",
    "knockout.round.number": "第{number}ラウンド",
    "knockout.bye": "不戦勝",
    "swiss.games": "ゲーム",
    "swiss.wins": "勝ち",
    "swiss.winShare": "勝率",
    "swiss.results": "結果",
    "knockout.onward": "後のラウンド",
    "knockout.back": "前のラウンド",
    "tournamentList.column.date": "日付",
    "tournamentList.column.name": "名称",
    "tournamentList.onlyIn": "{country}の大会のみ",
    "tournamentList.filter.country": "国",
    "tournamentList.filter.anyCountry": "すべての国",
    "tournamentList.filter.region": "地域",
    "tournamentList.filter.anyRegion": "すべての地域",
    "tournamentList.filter.sport": "競技",
    "tournamentList.filter.anySport": "すべての競技",
    "tournamentList.filter.submit": "絞り込む",
    "years.label": "年",
    "years.earlier": "それ以前の年",

    "admin.newerBuild.message": "このサイトの新しいバージョンがあります。",
    "admin.newerBuild.reload": "再読み込み",
    "admin.title": "管理",
    "admin.tournaments.new": "新しい大会",
    "admin.tournaments.none": "大会はありません",
    "admin.tournaments.archived": "アーカイブ済み",
    "admin.tournaments.manage": "運営",
    "admin.tournaments.edit": "編集",
    "admin.tournaments.archive": "アーカイブ",
    "admin.tournaments.restore": "復元",
    "admin.tournaments.scores": "スコア",
    "admin.tournaments.players": "選手",
    "admin.years.label": "年",
    "admin.years.earlier": "それ以前の年",
    "admin.tournament.name": "名称",
    "admin.tournament.starts": "開始日",
    "admin.tournament.finishes": "終了日",
    "admin.tournament.format": "形式",
    "admin.tournament.sport": "競技",
    "admin.tournament.country": "国",
    "admin.tournament.region": "地域",
    "admin.tournament.subtitle": "サブタイトル",
    "admin.tournament.handicap": "ハンディキャップ制",
    "admin.tournament.drawsAllowed": "引き分けを認める",
    "admin.tournament.levelTestsDrawn": "同点のテストは引き分け",
    "admin.tournament.worldRankings": "世界ランキングの対象",
    "admin.tournament.national": "全国レベルの大会",
    "admin.tournament.international": "国際レベルの大会",
    "admin.tournament.otherwise": "この内容では受け付けられません。",
    "admin.newTournament.title": "新しい大会",
    "admin.newTournament.submit": "大会を作成",
    "admin.editTournament.title": "大会の編集",
    "admin.editTournament.submit": "大会を更新",
    "admin.editTournament.otherwise": "この大会は変更できません。",
    "admin.view.tabs": "大会",
    "admin.view.players": "選手",
    "admin.view.competitions": "部門",
    "admin.view.managers": "運営者",
    "admin.view.notes": "お知らせ",
    "admin.view.scorers": "記録係",
    "admin.view.rankings": "ランキング",
    "admin.rankings.textFile":
      "大会の結果は、入力された試合からサイトが作成するテキストファイルとして世界ランキングに送られます。",
    "admin.rankings.spreadsheet":
      "大会の結果は、入力された試合からサイトが作成するスプレッドシートとして世界ランキングに送られます。",
    "admin.rankings.fillInWinners":
      "サイトは各競技の優勝者を推測することしかできません。ファイルを送る前に、それぞれの「優勝者」の行を確認してください。",
    "admin.rankings.fillInWinner":
      "サイトは大会の優勝者を知ることができません。送る前に、スプレッドシートの最下部に記入してください。",
    "admin.rankings.sendIt":
      "その後、ファイルを世界ランキングの担当者に送ってください。",
    "admin.rankings.download": "ランキングをダウンロード",
    "rankings.notAvailable": "ランキングは利用できません",
    "rankings.notAvailable.sport":
      "この大会の競技には世界ランキングがないため、送るランキングはありません。",
    "rankings.notAvailable.handicap":
      "この大会はハンディキャップ制で行われるため、世界ランキングの対象になりません。",
    "rankings.notAvailable.drawnGames":
      "この大会は引き分けを認めているため、世界ランキングの対象になりません。",
    "rankings.notAvailable.notCounted":
      "この大会の運営者が、世界ランキングの対象にしないと設定しています。",
    "admin.view.otherwise": "この大会はここから運営できません。",
    "admin.competitionView.tabs": "部門",
    "admin.competitionView.players": "選手",
    "admin.competitionView.scores": "スコア",
    "admin.sections.label": "大会とその部門",
    "admin.sections.tournament": "大会",
    "admin.administrator.sections.label": "管理者のページ",
    "admin.administrator.sections.tournaments": "大会",
    "admin.administrator.sections.accounts": "アカウント",
    "admin.administrator.sections.worldRankings": "世界ランキング",
    "admin.administrator.sections.importErrors": "インポートエラー",
    "admin.administrator.title": "管理者",
    "admin.accounts.title": "アカウント",
    "admin.roles.add": "追加",
    "admin.roles.administrator.heading": "管理者",
    "admin.roles.administrator.none": "ほかの管理者はいません",
    "admin.roles.administrator.removeTitle": "管理者の解除",
    "admin.roles.administrator.removeExplanation":
      "{name}はこのサイトの管理者ではなくなります。",
    "admin.roles.world-ranking-officer.heading": "世界ランキング担当者",
    "admin.roles.world-ranking-officer.none": "世界ランキング担当者はいません",
    "admin.roles.world-ranking-officer.removeTitle":
      "世界ランキング担当者の解除",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name}は世界ランキング担当者ではなくなります。",
    "admin.worldRankings.title": "世界ランキングの選手のインポート",
    "admin.worldRankings.import": "インポート",
    "admin.worldRankings.log": "インポートの経過",
    "admin.worldRankings.ac.reading":
      "アソシエーションクロッケーの一覧を読み込み中",
    "admin.worldRankings.ac.read":
      "読み込んだアソシエーションクロッケーの選手：{players}",
    "admin.worldRankings.ac.kept":
      "残したアソシエーションクロッケーの選手：{players}",
    "admin.worldRankings.ac.refused":
      "アソシエーションクロッケーの一覧を読み込めなかったため、その選手はそのままにしました。",
    "admin.worldRankings.gc.reading": "ゴルフクロッケーの一覧を読み込み中",
    "admin.worldRankings.gc.read":
      "読み込んだゴルフクロッケーの選手：{players}",
    "admin.worldRankings.gc.kept": "残したゴルフクロッケーの選手：{players}",
    "admin.worldRankings.gc.refused":
      "ゴルフクロッケーの一覧を読み込めなかったため、その選手はそのままにしました。",
    "admin.worldRankings.finished": "完了",
    "admin.worldRankings.failed": "インポートは完了しませんでした。",
    "admin.worldRankings.otherwise": "サイトで問題が発生しました。",
    "WorldRankingLists.Unreachable":
      "世界ランキングのサイトに接続できませんでした。",
    "WorldRankingLists.Unreadable":
      "一覧が世界ランキングの書式になっていません。読み取れない行がある、誰も載っていない、またはUTF-8で書かれていないのが原因です。",
    "admin.importErrors.title": "インポートエラー",
    "admin.importErrors.none": "インポートエラーはありません",
    "admin.importErrors.otherwise": "サイトで問題が発生しました。",
    "admin.importError.title": "インポートエラー",
    "admin.importError.documentId": "ドキュメントID",
    "admin.importError.tournament": "大会",
    "admin.importError.competition": "部門",
    "admin.importError.newSite": "新サイト",
    "admin.importError.oldSite": "旧サイト",
    "ImportErrorKept.NotFound":
      "そのドキュメントについて、インポートが残したエラーはありません。",
    "admin.competitionView.otherwise": "この部門はここから運営できません。",
    "admin.competitions.block": "ブロック戦",
    "admin.competitions.knockout": "ノックアウト戦",
    "admin.competitions.swiss": "スイスドロー",
    "admin.competitions.view": "表示",
    "admin.competitions.edit": "編集",
    "admin.competitions.up": "上へ",
    "admin.competitions.down": "下へ",
    "admin.competitions.archive": "アーカイブ",
    "admin.competitions.restore": "復元",
    "admin.competitions.archived": "アーカイブ済みの部門",
    "admin.competitions.none": "部門はありません",
    "admin.competitions.add": "部門を追加",
    "admin.competition.addTitle": "部門の追加",
    "admin.competition.editTitle": "部門の編集",
    "admin.competition.name": "名称",
    "admin.competition.kind": "種類",
    "admin.competition.bestOf": "ゲーム数",
    "admin.competition.rounds": "ラウンド数",
    "admin.competition.places": "順位数",
    "admin.competition.round": "第{number}ラウンド",
    "admin.competition.bestOfs": "各ラウンドのゲーム数",
    "admin.competition.quarters": "準々決勝",
    "admin.competition.semis": "準決勝",
    "admin.competition.final": "決勝",
    "admin.competition.add": "追加",
    "admin.competition.save": "保存",
    "admin.competition.added": "{name}を追加しました。",
    "admin.competition.otherwise": "この部門は、この内容では保存できません。",
    "CompetitionName.Missing": "名称を入力してください。",
    "CompetitionName.TooLong": "名称は254文字以内にしてください。",
    "CompetitionName.NoLetterOrDigit": "名称には文字か数字を含めてください。",
    "Tournament.KnockoutPlayerHasGames":
      "この組み合わせの選手には試合があるため、順位数は変更できません。",
    "Tournament.CompetitionNameTaken":
      "この大会のほかの部門が、すでにその名称を使っています。",
    "BestOf.NotWhole": "ゲーム数は整数で入力してください。",
    "BestOf.TooSmall": "1回の対戦は、1ゲーム以上にしてください。",
    "Rounds.NotWhole": "ラウンド数は整数で入力してください。",
    "Rounds.TooSmall": "ブロックは1ラウンド以上で行ってください。",
    "KnockoutDraw.EvenBestOf":
      "ノックアウト戦の対戦には勝者が必要なので、ゲーム数は奇数にしてください。",

    "admin.hover.tournaments.new": "新しい大会を作成します",
    "admin.hover.tournaments.manage":
      "この大会の選手、チーム、部門、スコアを運営します",
    "admin.hover.tournaments.edit": "この大会の詳細を変更します",
    "admin.hover.tournaments.scores": "この大会のスコアを入力します",
    "admin.hover.tournaments.players": "この大会の選手を管理します",
    "admin.hover.competitions.view":
      "この部門を開いて、選手とスコアを見たり入力したりします",
    "admin.hover.tests.view":
      "このテストマッチを開いて、スコアを見たり入力したりします",
    "admin.hover.teams.view": "このチームを開いて、選手を管理します",
    "admin.hover.dialog.player.add": "この選手を大会に追加します",
    "admin.hover.dialog.player.save": "この選手の変更を保存します",
    "admin.hover.dialog.team.add": "このチームを大会に追加します",
    "admin.hover.dialog.team.save": "このチームの変更を保存します",
    "admin.hover.dialog.test.add": "このテストマッチを大会に追加します",
    "admin.hover.dialog.test.save": "このテストマッチの変更を保存します",
    "admin.hover.dialog.competition.add": "この部門を大会に追加します",
    "admin.hover.dialog.competition.save": "この部門の変更を保存します",
    "admin.hover.dialog.score.add": "このスコアを部門に追加します",
    "admin.hover.dialog.score.save": "このスコアの訂正を保存します",
    "admin.hover.dialog.carryForward.save": "この選手の成績を持ち越します",
    "admin.hover.dialog.tournament.new": "この大会を作成します",
    "admin.hover.dialog.tournament.edit": "この大会の変更を保存します",
    "admin.hover.modal.cancel": "何も保存せずに閉じます",
    "admin.hover.modal.ok": "このメッセージを閉じます",
    "admin.hover.tab": "「{name}」タブを表示します",
    "admin.hover.tournaments.archive":
      "この大会をアーカイブします。復元することもできます",
    "admin.hover.tournaments.restore": "アーカイブ済みのこの大会を元に戻します",
    "admin.hover.players.add": "この大会に選手を追加します",
    "admin.hover.players.edit": "この選手の詳細を変更します",
    "admin.hover.players.up": "この選手を一覧の上へ移します",
    "admin.hover.players.down": "この選手を一覧の下へ移します",
    "admin.hover.players.archive":
      "この選手をアーカイブします。復元することもできます",
    "admin.hover.players.restore": "アーカイブ済みのこの選手を元に戻します",
    "admin.hover.teams.add": "この大会にチームを追加します",
    "admin.hover.teams.edit": "このチームの詳細を変更します",
    "admin.hover.teams.up": "このチームを一覧の上へ移します",
    "admin.hover.teams.down": "このチームを一覧の下へ移します",
    "admin.hover.teams.archive":
      "このチームをアーカイブします。復元することもできます",
    "admin.hover.teams.restore": "アーカイブ済みのこのチームを元に戻します",
    "admin.hover.competitions.add": "この大会に部門を追加します",
    "admin.hover.competitions.edit": "この部門の詳細を変更します",
    "admin.hover.competitions.up": "この部門を一覧の上へ移します",
    "admin.hover.competitions.down": "この部門を一覧の下へ移します",
    "admin.hover.competitions.archive":
      "この部門をアーカイブします。復元することもできます",
    "admin.hover.competitions.restore":
      "アーカイブ済みのこの部門を元に戻します",
    "admin.hover.tests.add": "2チーム間のテストマッチを追加します",
    "admin.hover.tests.edit": "このテストマッチの詳細を変更します",
    "admin.hover.tests.up": "このテストマッチを一覧の上へ移します",
    "admin.hover.tests.down": "このテストマッチを一覧の下へ移します",
    "admin.hover.tests.archive":
      "このテストマッチをアーカイブします。復元することもできます",
    "admin.hover.tests.restore":
      "アーカイブ済みのこのテストマッチを元に戻します",
    "admin.hover.tests.toTeams":
      "「チーム」タブへ移り、テストマッチに必要なチームを追加します",
    "admin.hover.scores.add": "この部門に試合のスコアを追加します",
    "admin.hover.scores.edit": "このスコアを訂正します",
    "admin.hover.scores.archive":
      "このスコアをアーカイブして、集計に入れないようにします。復元することもできます",
    "admin.hover.scores.restore":
      "アーカイブ済みのこのスコアを元に戻し、再び集計に入れます",
    "admin.hover.scores.withdraw":
      "このスコアを一覧に残したまま、集計に入れないようにします",
    "admin.hover.scores.unwithdraw":
      "棄権扱いにしたこのスコアを、再び集計に入れます",
    "admin.hover.scores.up": "このスコアを一覧の前へ移します",
    "admin.hover.scores.down": "このスコアを一覧の後ろへ移します",
    "admin.hover.competitionPlayers.add": "選んだ選手をこの部門に入れます",
    "admin.hover.competitionPlayers.up": "この選手を一覧の上へ移します",
    "admin.hover.competitionPlayers.down": "この選手を一覧の下へ移します",
    "admin.hover.competitionPlayers.remove": "この選手を部門から外します",
    "admin.hover.competitionPlayers.withdraw": "この選手を部門から棄権させます",
    "admin.hover.competitionPlayers.unwithdraw":
      "棄権したこの選手を部門に戻します",
    "admin.hover.competitionPlayers.carryForward":
      "別の部門でのこの選手の成績を持ち越します",
    "admin.hover.notes.add": "この大会の新しいお知らせを書きます",
    "admin.hover.notes.edit": "このお知らせを変更します",
    "admin.hover.notes.delete": "このお知らせを削除します",
    "admin.hover.note.add": "このお知らせを保存して大会に追加します",
    "admin.hover.note.save": "このお知らせの変更を保存します",
    "admin.hover.people.add": "この人に役割を与えます",
    "admin.hover.people.remove": "この人から役割を外します",
    "admin.hover.worldRankings.import":
      "世界ランキングを取得して、その選手を追加します",
    "admin.modal.cancel": "キャンセル",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "メールアドレス",
    "admin.people.remove": "外す",
    "admin.people.otherwise": "実行できませんでした。",
    "admin.managers.you": "あなた",
    "admin.managers.add": "運営者を追加",
    "admin.managers.none": "運営者はいません",
    "admin.managers.removeTitle": "運営者の解除",
    "admin.managers.removeExplanation":
      "{name}は、この大会を運営できなくなります。",
    "admin.managers.removeYourself.explanation":
      "あなたはこの大会を運営できなくなり、ここでは誰にも元に戻せません。ほかの運営者が、あなたを再び運営者にできます。",
    "admin.managers.otherwise": "そのアドレスは運営者にできません。",
    "admin.competitionPlayers.add": "選手を追加",
    "admin.competitionPlayers.otherwise": "この選手は追加できません。",
    "admin.competitionPlayers.choose": "追加する選手",
    "admin.competitionPlayers.nobody": "選手を選んでください",
    "admin.competitionPlayers.bye": "不戦勝",
    "admin.competitionPlayers.all": "全選手が部門に入っています",
    "admin.competitionPlayers.none": "選手はいません",
    "admin.competitionPlayers.up": "上へ",
    "admin.competitionPlayers.down": "下へ",
    "admin.competitionPlayers.remove": "外す",
    "admin.competitionPlayers.withdraw": "棄権",
    "admin.competitionPlayers.unwithdraw": "棄権を取り消す",
    "admin.competitionPlayers.withdrawn": "棄権した選手",
    "admin.competitionPlayers.removeTitle": "選手を外す",
    "admin.competitionPlayers.removeQuestion":
      "{name}を部門から外します。元に戻すことはできません。",
    "admin.competitionPlayers.withdrawTitle": "選手の棄権",
    "admin.competitionPlayers.withdrawQuestion":
      "{name}は部門の残りの試合に出場せず、まだ行われていない試合は不在のまま決まります。",
    "admin.competitionPlayers.carryForward": "持ち越し",
    "admin.carryForward.title": "持ち越し - {name}",
    "admin.carryForward.save": "保存",
    "admin.carryForward.otherwise": "この持ち越しは保存できません。",
    "admin.carryForward.matchWins": "対戦の勝ち",
    "admin.carryForward.matchLosses": "対戦の負け",
    "admin.carryForward.gameWins": "ゲームの勝ち",
    "admin.carryForward.gameLosses": "ゲームの負け",
    "admin.carryForward.hoopsFor": "得フープ",
    "admin.carryForward.hoopsAgainst": "失フープ",
    "CarryForward.MatchWinsNotWhole": "対戦の勝ち数は整数で入力してください。",
    "CarryForward.MatchWinsBelowZero":
      "対戦の勝ち数は0以上で入力してください。",
    "CarryForward.MatchLossesNotWhole":
      "対戦の負け数は整数で入力してください。",
    "CarryForward.MatchLossesBelowZero":
      "対戦の負け数は0以上で入力してください。",
    "CarryForward.GameWinsNotWhole": "ゲームの勝ち数は整数で入力してください。",
    "CarryForward.GameWinsBelowZero":
      "ゲームの勝ち数は0以上で入力してください。",
    "CarryForward.GameLossesNotWhole":
      "ゲームの負け数は整数で入力してください。",
    "CarryForward.GameLossesBelowZero":
      "ゲームの負け数は0以上で入力してください。",
    "CarryForward.HoopsForNotWhole": "得フープ数は整数で入力してください。",
    "CarryForward.HoopsForBelowZero": "得フープ数は0以上で入力してください。",
    "CarryForward.HoopsAgainstNotWhole": "失フープ数は整数で入力してください。",
    "CarryForward.HoopsAgainstBelowZero":
      "失フープ数は0以上で入力してください。",

    "admin.scores.add": "スコアを追加",
    "admin.scores.none": "スコアはありません",
    "admin.scores.edit": "編集",
    "admin.scores.drawNotFilledTitle": "ドローが埋まっていません",
    "admin.scores.archive": "アーカイブ",
    "admin.scores.up": "上へ",
    "admin.scores.down": "下へ",
    "admin.scores.restore": "復元",
    "admin.scores.archived": "アーカイブ済みのスコア",
    "admin.scores.archivedSaid": "アーカイブ済み",
    "admin.scores.withdraw": "棄権",
    "admin.scores.unwithdraw": "棄権を取り消す",
    "admin.scores.withdrawnSaid": "棄権",
    "admin.scores.otherwise": "実行できませんでした。",
    "admin.score.title": "スコアの追加",
    "admin.score.add": "試合を追加",
    "admin.score.winner": "勝者",
    "admin.score.winnerScore": "勝者のスコア",
    "admin.score.loser": "敗者",
    "admin.score.loserScore": "敗者のスコア",
    "admin.score.beat": "勝ち",
    "admin.score.added": "{winner}が{loser}に勝った試合を追加しました。",
    "admin.score.otherwise": "試合を追加できませんでした。",
    "admin.score.correctTitle": "スコアの編集",
    "admin.score.save": "保存",
    "admin.score.notCorrected": "スコアを訂正できませんでした。",
    "Game.WinnerMissing": "勝者を選んでください。",
    "Game.WinnerScoreMissing": "勝者のスコアを入力してください。",
    "Game.LoserMissing": "敗者を選んでください。",
    "Game.LoserScoreMissing": "敗者のスコアを入力してください。",
    "Score.NoPoints": "スコアは、まず得点から書き始めてください。",
    "Game.SamePlayer": "同じ選手どうしの試合はできません。",
    "Game.WinnerNotAhead":
      "勝者のスコアは敗者より大きいか、勝ちの印を付ける必要があります。",
    "Game.LoserMarked": "敗者のスコアに勝ちの印は付けられません。",
    "Game.ResultChanged":
      "訂正しても結果は変わりません。勝ちの試合は勝ちのまま、引き分けの試合は引き分けのままです。",
    "Competition.MatchDecided": "その対戦はすでに決まっています。",
    "Competition.DrawFull":
      "ノックアウトの枠がすべて埋まっているため、選手を追加できません。",
    "Competition.DrawNotFilled":
      "ノックアウトのすべての枠が選手か不戦勝で埋まるまで、スコアは追加できません。",
    "Competition.ByeOutsideKnockout":
      "不戦勝を置けるのはノックアウトだけです。",
    "Competition.NotDrawnToMeet":
      "この選手たちは、現在のノックアウトの組み合わせでは対戦しません。",
    "Competition.WinnerHasPlayedOn":
      "この対戦の勝者はすでに次の試合を行っているため、勝者は変更できません。",
    "CompetitionPlayer.Withdrawn": "棄権した選手は、もう試合をしません。",

    "admin.players.add": "選手を追加",
    "admin.players.none": "選手はいません",
    "admin.players.edit": "編集",
    "admin.players.archive": "アーカイブ",
    "admin.players.restore": "復元",
    "admin.players.up": "上へ",
    "admin.players.down": "下へ",
    "admin.players.archiveTitle": "選手のアーカイブ",
    "admin.players.archiveQuestion": "{name}は、次の部門から外れます。",
    "admin.players.archive.explanation":
      "復元しても、これらの部門には戻りません。",
    "admin.players.archived": "アーカイブ済みの選手",
    "admin.players.archivedSaid": "アーカイブ済み",
    "admin.player.addTitle": "選手の追加",
    "admin.player.editTitle": "選手の編集",
    "admin.player.name": "名前",
    "admin.player.representing": "所属",
    "admin.player.worldRankingName": "世界ランキングでの選手名",
    "admin.player.worldRankingKnown": "世界ランキングにこの名前があります。",
    "admin.player.worldRankingQuestioned":
      "世界ランキングにこの名前の選手はいません。綴りの誤りか、ランキングに載ったばかりの選手かもしれません。",
    "admin.player.flag": "国旗",
    "admin.player.add": "追加",
    "admin.player.save": "保存",
    "admin.player.added": "{name}を追加しました。",
    "admin.player.otherwise": "この選手は、この内容では保存できません。",
    "Tournament.PlayerNameTaken":
      "この大会のほかの選手が、すでにその名前を使っています。",
    "TournamentPlayer.NoSuchFlag": "用意されている国旗から選んでください。",
    "TournamentPlayer.NamedBye": "選手の名前を「Bye」にはできません。",
    "TournamentPlayer.NoLetterOrDigit": "名前には文字か数字を含めてください。",
    "admin.player.byesTitle": "不戦勝は追加不要です",
    "admin.player.byes":
      "不戦勝は大会の選手ではありません。ノックアウトでは、選手を追加するたびに、組み合わせに必要な数だけ「Bye」が選べます。",
    "admin.view.teams": "チーム",
    "admin.view.tests": "テストマッチ",
    "admin.teams.add": "チームを追加",
    "admin.teams.none": "チームはありません",
    "admin.teams.edit": "編集",
    "admin.teams.view": "表示",
    "admin.teams.archive": "アーカイブ",
    "admin.teams.restore": "復元",
    "admin.teams.up": "上へ",
    "admin.teams.down": "下へ",
    "admin.teams.archived": "アーカイブ済みのチーム",
    "admin.teams.archivedSaid": "アーカイブ済み",
    "admin.team.addTitle": "チームの追加",
    "admin.team.editTitle": "チームの編集",
    "admin.team.name": "名称",
    "admin.team.shortName": "略称",
    "admin.team.shortName.explanation":
      "テストマッチの呼び名に使います。例：AUS v ENG。",
    "admin.team.flag": "国旗",
    "admin.team.add": "追加",
    "admin.team.save": "保存",
    "admin.team.added": "{name}を追加しました。",
    "admin.team.otherwise": "このチームは、この内容では保存できません。",
    "admin.teamView.otherwise": "このチームはここでは表示できません。",
    "admin.teamView.players": "選手",
    "TeamName.Missing": "チーム名を入力してください。",
    "TeamName.TooLong": "その名前は長すぎます。",
    "admin.notes.add": "お知らせを追加",
    "admin.notes.none": "お知らせはありません",
    "admin.notes.edit": "編集",
    "admin.notes.delete": "削除",
    "admin.notes.deleteTitle": "お知らせの削除",
    "admin.notes.deleteQuestion": "お知らせ「{title}」を削除しますか？",
    "admin.notes.delete.explanation":
      "削除したお知らせは完全になくなり、元に戻せません。",
    "admin.notes.otherwise": "実行できませんでした。",
    "admin.note.addTitle": "お知らせの追加",
    "admin.note.editTitle": "お知らせの編集",
    "admin.note.title": "タイトル",
    "admin.note.description": "本文",
    "admin.note.write": "書く",
    "admin.note.preview": "プレビュー",
    "admin.note.toolbar": "書式",
    "admin.note.tool.heading": "見出し",
    "admin.note.tool.bold": "太字",
    "admin.note.tool.italic": "斜体",
    "admin.note.tool.quote": "引用",
    "admin.note.tool.code": "コード",
    "admin.note.tool.link": "リンク",
    "admin.note.tool.numberedList": "番号付きリスト",
    "admin.note.tool.bulletedList": "箇条書き",
    "admin.note.tool.taskList": "タスクリスト",
    "admin.note.add": "追加",
    "admin.note.save": "保存",
    "admin.note.otherwise": "このお知らせは、この内容では保存できません。",
    "ManagerNoteTitle.Missing": "お知らせのタイトルを入力してください。",
    "ManagerNoteTitle.TooLong": "そのタイトルは長すぎます。",
    "ManagerNoteTitle.NoLetterOrDigit":
      "タイトルには文字か数字を含めてください。",
    "ManagerNoteDescription.TooLong": "その本文は長すぎます。",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "EditManagerNote.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "DeleteManagerNote.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "ManagerNote.Deleted":
      "そのお知らせは削除されました。ほかの運営者が削除した可能性があります。",
    "CommentaryTitle.Missing": "実況のタイトルを入力してください。",
    "CommentaryTitle.TooLong": "そのタイトルは長すぎます。",
    "CommentaryTitle.NoLetterOrDigit":
      "タイトルには文字か数字を含めてください。",
    "Commentary.TitleTaken": "ほかの実況が、すでにそのタイトルを使っています。",
    "CommentText.Missing": "コメントを書いてください。",
    "CommentText.TooLong": "そのコメントは長すぎます。",
    "TeamShortName.Missing": "チームの略称を入力してください。",
    "TeamShortName.TooLong": "略称は10文字以内にしてください。",
    "TeamShortName.NoLetterOrDigit": "略称には文字か数字を含めてください。",
    "Team.ShortNameLongerThanName": "略称はチーム名より長くできません。",
    "Team.NoSuchFlag": "用意されている国旗から選んでください。",
    "Team.Archived": "そのチームはアーカイブ済みのため、先に復元してください。",
    "Team.InATest":
      "そのチームはテストマッチに出場するため、アーカイブできません。",
    "Team.PlayerNameTaken":
      "このチームのほかの選手が、すでにその名前を使っています。",
    "TeamPlayer.NamedBye": "選手の名前を「Bye」にはできません。",
    "TeamPlayer.Archived":
      "その選手はアーカイブ済みのため、先に復元してください。",
    "TeamPlayer.HasGames":
      "その選手は試合を行っているため、アーカイブできません。",
    "Tournament.TeamNameTaken":
      "この大会のほかのチームが、すでにその名称を使っています。",
    "Tournament.TeamShortNameTaken":
      "この大会のほかのチームが、すでにその略称を使っています。",
    "Tournament.NoSuchTeam": "この大会に、このアドレスのチームはありません。",
    "Tournament.TeamArchived":
      "このチームはアーカイブ済みです。復元できるのは「チーム」タブからだけです。",
    "admin.tests.add": "テストマッチを追加",
    "admin.tests.none": "テストマッチはありません",
    "admin.tests.edit": "編集",
    "admin.tests.view": "表示",
    "admin.tests.archive": "アーカイブ",
    "admin.tests.restore": "復元",
    "admin.tests.up": "上へ",
    "admin.tests.down": "下へ",
    "admin.tests.archived": "アーカイブ済みのテストマッチ",
    "admin.tests.twoTeamsNeeded":
      "テストマッチは2チーム間で行うため、先に2チームが必要です。",
    "admin.tests.toTeams": "チームへ移動",
    "admin.tests.matches.one": "{count}対戦",
    "admin.tests.matches.other": "{count}対戦",
    "admin.tests.bestOf": "{games}ゲーム制",
    "admin.tests.otherwise": "実行できませんでした。",
    "admin.test.addTitle": "テストマッチの追加",
    "admin.test.editTitle": "テストマッチの編集",
    "admin.test.firstTeam": "チームA",
    "admin.test.secondTeam": "チームB",
    "admin.test.versus": "対",
    "admin.test.starts": "開始日",
    "admin.test.finishes": "終了日",
    "admin.test.expectedMatches": "予定対戦数",
    "admin.test.bestOf": "ゲーム数",
    "admin.test.group": "グループ",
    "admin.test.add": "追加",
    "admin.test.save": "保存",
    "admin.test.added": "{name}を追加しました。",
    "admin.test.otherwise": "このテストマッチは、この内容では保存できません。",
    "admin.testView.otherwise": "このテストマッチはここでは表示できません。",
    "AddTest.FirstTeamMissing": "1つ目のチームを選んでください。",
    "AddTest.SecondTeamMissing": "2つ目のチームを選んでください。",
    "UpdateTest.FirstTeamMissing": "1つ目のチームを選んでください。",
    "UpdateTest.SecondTeamMissing": "2つ目のチームを選んでください。",
    "ExpectedMatches.NotWhole": "対戦数は整数で入力してください。",
    "ExpectedMatches.TooSmall":
      "テストマッチの予定対戦数は1以上にしてください。",
    "TestGroup.TooLong": "そのグループ名は長すぎます。",
    "Tournament.TestAgainstItself":
      "同じチームどうしでテストマッチは行えません。",
    "Tournament.TestFinishesBeforeStarts":
      "テストマッチの終了日を開始日より前にはできません。",
    "Tournament.TestStartsBeforeTournament":
      "テストマッチの開始日を大会の開始日より前にはできません。",
    "Tournament.TestFinishesAfterTournament":
      "テストマッチの終了日を大会の終了日より後にはできません。",
    "Tournament.TestHasGamesInUse":
      "このテストマッチには試合があるため、その試合がアーカイブされるまでアーカイブできません。",
    "Tournament.TestHasGames":
      "このテストマッチにはすでに試合があるため、チームは変更できません。",
    "Tournament.ExpectedMatchesBelowStarted":
      "それより多くの対戦がすでに始まっています。",
    "Tournament.BestOfBelowGamesPlayed":
      "2人の選手が、すでにそれより多くのゲームを行っています。",
    "Competition.ExpectedMatchesReached":
      "このテストマッチは、予定された数の対戦をすでに始めています。",
    "Competition.SameTeam": "同じチームの選手どうしは対戦しません。",
    "AddManager.NoSuchAccount":
      "そのアドレスには、運営者にできるアカウントがありません。",
    "admin.scorers.add": "記録係を追加",
    "admin.scorers.none": "記録係はいません",
    "admin.scorers.removeTitle": "記録係の解除",
    "admin.scorers.removeExplanation":
      "{name}は、この大会のスコアを入力できなくなります。",
    "admin.scorers.otherwise": "そのアドレスは記録係にできません。",
    "AddScorer.NoSuchAccount":
      "そのアドレスには、記録係にできるアカウントがありません。",
    "Account.NotAnAdministrator": "それができるのは管理者だけです。",
    "AddRole.NoSuchAccount":
      "そのアドレスには、その役割を与えられるアカウントがありません。",
    "AddRole.NoSuchRole": "そのような役割はありません。",
    "RemoveRole.NoSuchAccount": "そのようなアカウントはありません。",
    "RemoveRole.NoSuchRole": "そのような役割はありません。",
    "RemoveRole.Yourself": "自分自身から管理者の役割を外すことはできません。",
    "AccountsWithRole.NoSuchRole": "そのような役割はありません。",
    "Tournament.AlreadyAManager":
      "そのアカウントはすでにこの大会の運営者で、記録係にできることはすべてできます。",
    "TournamentName.Missing": "大会の名称を入力してください。",
    "TournamentName.TooShort": "その名称は短すぎます。",
    "TournamentName.TooLong": "その名称は長すぎます。",
    "TournamentName.AllLowerCase": "名称をすべて小文字で書くことはできません。",
    "TournamentName.AllCapitals": "名称をすべて大文字で書くことはできません。",
    "TournamentName.NoLetterOrDigit": "名称には文字か数字を含めてください。",
    "ReadOnlyDate.Unreadable": "日付を入力してください。",
    "Tournament.FinishesBeforeStarts":
      "大会の終了日を開始日より前にはできません。",
    "Tournament.StartsAfterNextYear":
      "大会の開始日を来年より後にはできません。",
    "Tournament.FinishesAfterNextYear":
      "大会の終了日を来年より後にはできません。",
    "CreateTournament.NoSuchCountry": "国を選んでください。",
    "TournamentSubtitle.TooLong": "サブタイトルは2000文字以内にしてください。",
    "Tournament.NotAManager": "この大会を変更できるのは、運営者だけです。",
    "Tournament.NotAManagerOrScorer":
      "この大会を見られるのは、運営者と記録係だけです。",
    "Tournament.Archived":
      "この大会はアーカイブ済みです。変更するには、先に復元してください。",
    "UpdateTournament.NoSuchTournament": "このアドレスに大会はありません。",

    "sport.ac": "アソシエーションクロッケー",
    "sport.gc": "ゴルフクロッケー",
    "sport.a6w": "アメリカン6ウィケット",
    "sport.rc": "リコシェ",
    "sport.gb": "ゲートボール",
    "format.standard": "標準",
    "format.teams": "チーム戦",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GCワールドチーム選手権",

    "country.ad": "アンドラ",
    "country.ae": "アラブ首長国連邦",
    "country.af": "アフガニスタン",
    "country.ag": "アンティグア・バーブーダ",
    "country.ai": "アンギラ",
    "country.al": "アルバニア",
    "country.am": "アルメニア",
    "country.ao": "アンゴラ",
    "country.ar": "アルゼンチン",
    "country.as": "アメリカ領サモア",
    "country.at": "オーストリア",
    "country.au": "オーストラリア",
    "country.aw": "アルバ",
    "country.ax": "オーランド諸島",
    "country.az": "アゼルバイジャン",
    "country.ba": "ボスニア・ヘルツェゴビナ",
    "country.bb": "バルバドス",
    "country.bd": "バングラデシュ",
    "country.be": "ベルギー",
    "country.bf": "ブルキナファソ",
    "country.bg": "ブルガリア",
    "country.bh": "バーレーン",
    "country.bi": "ブルンジ",
    "country.bj": "ベナン",
    "country.bm": "バミューダ",
    "country.bn": "ブルネイ",
    "country.bo": "ボリビア",
    "country.br": "ブラジル",
    "country.bs": "バハマ",
    "country.bt": "ブータン",
    "country.bv": "ブーベ島",
    "country.bw": "ボツワナ",
    "country.by": "ベラルーシ",
    "country.bz": "ベリーズ",
    "country.ca": "カナダ",
    "country.catalonia": "カタルーニャ",
    "country.cc": "ココス（キーリング）諸島",
    "country.cd": "コンゴ民主共和国",
    "country.cf": "中央アフリカ共和国",
    "country.cg": "コンゴ共和国",
    "country.ch": "スイス",
    "country.ci": "コートジボワール",
    "country.ck": "クック諸島",
    "country.cl": "チリ",
    "country.cm": "カメルーン",
    "country.cn": "中国",
    "country.co": "コロンビア",
    "country.cr": "コスタリカ",
    "country.cu": "キューバ",
    "country.cv": "カーボベルデ",
    "country.cx": "クリスマス島",
    "country.cy": "キプロス",
    "country.cz": "チェコ",
    "country.de": "ドイツ",
    "country.dj": "ジブチ",
    "country.dk": "デンマーク",
    "country.dm": "ドミニカ国",
    "country.do": "ドミニカ共和国",
    "country.dz": "アルジェリア",
    "country.ec": "エクアドル",
    "country.ee": "エストニア",
    "country.eg": "エジプト",
    "country.eh": "西サハラ",
    "country.england": "イングランド",
    "country.er": "エリトリア",
    "country.es": "スペイン",
    "country.et": "エチオピア",
    "country.fi": "フィンランド",
    "country.fj": "フィジー",
    "country.fk": "フォークランド諸島",
    "country.fm": "ミクロネシア連邦",
    "country.fo": "フェロー諸島",
    "country.fr": "フランス",
    "country.ga": "ガボン",
    "country.gb": "イギリス",
    "country.gd": "グレナダ",
    "country.ge": "ジョージア",
    "country.gf": "フランス領ギアナ",
    "country.gh": "ガーナ",
    "country.gi": "ジブラルタル",
    "country.gl": "グリーンランド",
    "country.gm": "ガンビア",
    "country.gn": "ギニア",
    "country.gp": "グアドループ",
    "country.gq": "赤道ギニア",
    "country.gr": "ギリシャ",
    "country.gs": "サウスジョージア・サウスサンドウィッチ諸島",
    "country.gt": "グアテマラ",
    "country.gu": "グアム",
    "country.gw": "ギニアビサウ",
    "country.gy": "ガイアナ",
    "country.hk": "香港",
    "country.hm": "ハード島・マクドナルド諸島",
    "country.hn": "ホンジュラス",
    "country.hr": "クロアチア",
    "country.ht": "ハイチ",
    "country.hu": "ハンガリー",
    "country.id": "インドネシア",
    "country.ie": "アイルランド",
    "country.il": "イスラエル",
    "country.im": "マン島",
    "country.in": "インド",
    "country.io": "イギリス領インド洋地域",
    "country.iq": "イラク",
    "country.ir": "イラン",
    "country.is": "アイスランド",
    "country.it": "イタリア",
    "country.je": "ジャージー",
    "country.jm": "ジャマイカ",
    "country.jo": "ヨルダン",
    "country.jp": "日本",
    "country.ke": "ケニア",
    "country.kg": "キルギス",
    "country.kh": "カンボジア",
    "country.ki": "キリバス",
    "country.km": "コモロ",
    "country.kn": "セントクリストファー・ネイビス",
    "country.kp": "北朝鮮",
    "country.kr": "韓国",
    "country.kw": "クウェート",
    "country.ky": "ケイマン諸島",
    "country.kz": "カザフスタン",
    "country.la": "ラオス",
    "country.lb": "レバノン",
    "country.lc": "セントルシア",
    "country.li": "リヒテンシュタイン",
    "country.lk": "スリランカ",
    "country.lr": "リベリア",
    "country.ls": "レソト",
    "country.lt": "リトアニア",
    "country.lu": "ルクセンブルク",
    "country.lv": "ラトビア",
    "country.ly": "リビア",
    "country.ma": "モロッコ",
    "country.mc": "モナコ",
    "country.md": "モルドバ",
    "country.me": "モンテネグロ",
    "country.mg": "マダガスカル",
    "country.mh": "マーシャル諸島",
    "country.mk": "北マケドニア",
    "country.ml": "マリ",
    "country.mm": "ミャンマー",
    "country.mn": "モンゴル",
    "country.mo": "マカオ",
    "country.mp": "北マリアナ諸島",
    "country.mq": "マルティニーク",
    "country.mr": "モーリタニア",
    "country.ms": "モントセラト",
    "country.mt": "マルタ",
    "country.mu": "モーリシャス",
    "country.mv": "モルディブ",
    "country.mw": "マラウイ",
    "country.mx": "メキシコ",
    "country.my": "マレーシア",
    "country.mz": "モザンビーク",
    "country.na": "ナミビア",
    "country.nc": "ニューカレドニア",
    "country.ne": "ニジェール",
    "country.nf": "ノーフォーク島",
    "country.ng": "ナイジェリア",
    "country.ni": "ニカラグア",
    "country.nl": "オランダ",
    "country.no": "ノルウェー",
    "country.np": "ネパール",
    "country.nr": "ナウル",
    "country.nu": "ニウエ",
    "country.nz": "ニュージーランド",
    "country.om": "オマーン",
    "country.pa": "パナマ",
    "country.pe": "ペルー",
    "country.pf": "フランス領ポリネシア",
    "country.pg": "パプアニューギニア",
    "country.ph": "フィリピン",
    "country.pk": "パキスタン",
    "country.pl": "ポーランド",
    "country.pm": "サンピエール島・ミクロン島",
    "country.pn": "ピトケアン諸島",
    "country.pr": "プエルトリコ",
    "country.ps": "パレスチナ",
    "country.pt": "ポルトガル",
    "country.pw": "パラオ",
    "country.py": "パラグアイ",
    "country.qa": "カタール",
    "country.re": "レユニオン",
    "country.ro": "ルーマニア",
    "country.rs": "セルビア",
    "country.ru": "ロシア",
    "country.rw": "ルワンダ",
    "country.sa": "サウジアラビア",
    "country.sb": "ソロモン諸島",
    "country.sc": "セーシェル",
    "country.scotland": "スコットランド",
    "country.sd": "スーダン",
    "country.se": "スウェーデン",
    "country.sg": "シンガポール",
    "country.sh": "セントヘレナ",
    "country.si": "スロベニア",
    "country.sj": "スヴァールバル諸島・ヤンマイエン島",
    "country.sk": "スロバキア",
    "country.sl": "シエラレオネ",
    "country.sm": "サンマリノ",
    "country.sn": "セネガル",
    "country.so": "ソマリア",
    "country.sr": "スリナム",
    "country.st": "サントメ・プリンシペ",
    "country.sv": "エルサルバドル",
    "country.sy": "シリア",
    "country.sz": "エスワティニ",
    "country.tc": "タークス・カイコス諸島",
    "country.td": "チャド",
    "country.tf": "フランス領南方・南極地域",
    "country.tg": "トーゴ",
    "country.th": "タイ",
    "country.tj": "タジキスタン",
    "country.tk": "トケラウ",
    "country.tl": "東ティモール",
    "country.tm": "トルクメニスタン",
    "country.tn": "チュニジア",
    "country.to": "トンガ",
    "country.tr": "トルコ",
    "country.tt": "トリニダード・トバゴ",
    "country.tv": "ツバル",
    "country.tw": "台湾",
    "country.tz": "タンザニア",
    "country.ua": "ウクライナ",
    "country.ug": "ウガンダ",
    "country.um": "合衆国領有小離島",
    "country.us": "アメリカ合衆国",
    "country.uy": "ウルグアイ",
    "country.uz": "ウズベキスタン",
    "country.va": "バチカン市国",
    "country.vc": "セントビンセント・グレナディーン",
    "country.ve": "ベネズエラ",
    "country.vg": "イギリス領ヴァージン諸島",
    "country.vi": "アメリカ領ヴァージン諸島",
    "country.vn": "ベトナム",
    "country.vu": "バヌアツ",
    "country.wales": "ウェールズ",
    "country.wf": "ウォリス・フツナ",
    "country.ws": "サモア",
    "country.ye": "イエメン",
    "country.yt": "マヨット",
    "country.za": "南アフリカ",
    "country.zm": "ザンビア",
    "country.zw": "ジンバブエ",

    "Email.ConfirmAddress.subject": "{siteName}のメールアドレスの確認",
    "Email.ConfirmAddress.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントをご登録いただき、ありがとうございます。<br />
    アカウントをお使いいただく前に、下のボタンを押してメールアドレスを確認してください。
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
        メールアドレスを確認する
    </a>
</p>

<p>
    ボタンが使えない場合は、次のリンクをブラウザーで開いてもメールアドレスを確認できます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    このアカウントを作成していない場合は、このメールを無視していただいて問題ありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "{siteName}のメールアドレスを確認する新しいリンク",
    "Email.ConfirmAddressAgain.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のメールアドレスを確認するための新しいメールが請求されました。<br />
    下のボタンを押してメールアドレスを確認してください。
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
        メールアドレスを確認する
    </a>
</p>

<p>
    ボタンが使えない場合は、次のリンクをブラウザーで開いてもメールアドレスを確認できます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    確認が済むと、アカウントを中断なくお使いいただけます。
</p>

<p>
    このメールを請求していない場合は、無視していただいて問題ありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "どなたかがあなたのメールアドレスで登録しようとしました",
    "Email.AlreadyRegistered.body": `
<p>こんにちは。</p>

<p>
    どなたかが<strong>{siteName}</strong>に、このメールアドレスで登録しようとしました。このメールアドレスにはすでにアカウントがあり、アカウントには何の変更もありません。<br />
    ご本人の場合は、すでにアカウントをお持ちです。次のボタンからサインインできます。
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
        サインイン
    </a>
</p>

<p>
    パスワードをお忘れの場合は、こちらから再設定できます。
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
        パスワードをお忘れの方
    </a>
</p>

<p>
    ご本人でない場合は、何もする必要はありません。アカウントに入る方法は、誰にも渡されていません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "{siteName}のアカウントをこのアドレスへ移すことの確認",
    "Email.ConfirmNewEmailAddress.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにサインインしている方が、そのアカウントをこのメールアドレスへ移すよう求めました。ご本人の場合は、そのアカウントにサインインした状態で、ここから確認してください。リンクの有効期間は24時間です。
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
        アカウントを移行する
    </a>
</p>

<p>
    または、次のアドレスをブラウザーにコピーしてください。<br />
    {link}
</p>

<p>
    ご本人でない場合は、何もする必要はありません。アカウントがここへ移ることはありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "どなたかがアカウントをあなたのメールアドレスへ移すよう求めました",
    "Email.AlreadyHasAnAccount.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにサインインしている方が、そのアカウントをこのメールアドレスへ移すよう求めましたが、このメールアドレスにはすでに別のアカウントがあります。何も移されておらず、あなたのアカウントにも変更はありません。
</p>

<p>
    ご本人の場合は、このアドレスにすでにアカウントがあり、サインインできます。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "{siteName}のアカウントが移行されました",
    "Email.EmailAddressChanged.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントが、別のメールアドレス（{emailAddress}）へ移行されました。今後はそのアドレスでサインインします。
</p>

<p>
    ご本人でない場合は、ほかの誰かがあなたのアカウントを使っています。このメールに返信して、お知らせください。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "{siteName}のパスワードが変更されました",
    "Email.PasswordChanged.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントのパスワードが変更され、ほかのブラウザーでのサインインはすべてサインアウトされました。<br />
    ご本人の場合は、何もする必要はありません。
</p>

<p>
    ご本人でない場合は、ほかの誰かがあなたのパスワードを知っています。こちらから新しいパスワードを設定すると、その人はサインアウトされます。
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
        パスワードをお忘れの方
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "{siteName}の新しいパスワードの設定",
    "Email.SetNewPassword.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のパスワードの再設定が請求されました。<br />
    下のボタンを押すと、パスワードを再設定できます。
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
        パスワードを再設定する
    </a>
</p>

<p>
    ボタンが使えない場合は、次のリンクをブラウザーで開いてもパスワードを再設定できます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    パスワードの再設定を請求していない場合は、このメールを無視していただいて問題ありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "{siteName}のパスワードの設定",
    "Email.SetPassword.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにはパスワードがなく、Googleでサインインしています。<br />
    メールアドレスとパスワードでもサインインできるように、パスワードの設定が請求されました。
    下のボタンを押すと設定できます。
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
        パスワードを設定する
    </a>
</p>

<p>
    ボタンが使えない場合は、次のリンクをブラウザーで開いてもパスワードを設定できます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    リンクの有効期間は1時間です。パスワードの設定を請求していない場合は、このメールを無視していただいて問題ありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "このメールアドレスの{siteName}のアカウントはありません",
    "Email.RegisterInstead.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントに結び付いていないメールアドレスについて、パスワードの再設定が請求されました。
</p>

<p>
    サービスをご利用になりたい場合は、次のページで新しいアカウントを作成できます。<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    この請求に心当たりがない場合は、このメールを無視していただいて問題ありません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "{siteName}のアカウントを削除することの確認",
    "Email.ConfirmForgetting.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントの削除が請求されました。<br />
    下のボタンを押すと、削除の内容を確かめたうえで、本当に削除するかどうかを選べます。
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
        アカウントを削除する
    </a>
</p>

<p>
    ボタンが使えない場合は、次のリンクをブラウザーで開くこともできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    削除すると、お名前とメールアドレスは誰にも二度と読めなくなり、アカウントにはサインインできなくなります。元に戻すことはできません。
</p>

<p>
    このリンクは1回だけ使え、請求から15分間、このアカウントにサインインしている間だけ有効です。それを過ぎたら、アカウントからもう一度請求してください。
</p>

<p>
    ご本人が請求していない場合は、リンクが開かれない限り何も起こりません。ただし、アカウントにサインインしていた誰かが請求したことになりますので、念のため「パスワードをお忘れの方」のページから新しいパスワードを設定し、その人が再びサインインできないようにしてください。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "登録を一時停止しています：{service}に接続できません",
    "Email.RegistrationsSuspended.body": `
<p>こんにちは。</p>

<p>
    {siteName}は{when}に{service}に接続できませんでした。応答が戻るまでは、登録や新しいパスワードの設定のためにそれが必要な方には、後でもう一度お試しいただくようお知らせしています。
</p>

<p>
    対応は必要ありません。試みるたびに{service}へ改めて問い合わせるため、応答が戻りしだい、ページは再び使えます。
</p>

<p>
    {service}が止まっている間は、これについてのメールは1時間に1回までです。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
