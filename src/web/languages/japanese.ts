// The site's words in Japanese, written fresh from the English.
// The reader is addressed politely (です・ます), with no "あなた": a sentence
// that would say "you" says nothing, as Japanese does. Menu, button and tab
// items are plain noun or verb phrases with no spaces and no capitals, as
// Japanese writes them ("パスワードを変更"). A label's colon is the full-width
// "：". "Email address" is always メールアドレス and "email" alone is メール.
// A tournament is 大会, a competition within it 部門, a sport 競技, a game
// ゲーム, a match 試合 or 対戦, a test テストマッチ, a hoop フープ. "Bye" and the
// name a player may not be given are kept as "Bye", since the site checks it.
import type { Language } from "../common/language.js";

export const japanese: Language = {
  tag: "ja",
  name: "日本語",
  words: {
    // The site's own bars.
    "site.skipToContent": "本文へスキップ",
    "navigation.menu": "メニュー",
    "navigation.label": "メインナビゲーション",
    "navigation.home": "ホーム",
    "navigation.help": "ヘルプ",
    "navigation.admin": "管理",
    "sections.label": "セクション",
    "theme.label": "テーマ",
    "theme.light": "ライト",
    "theme.dark": "ダーク",
    "theme.system": "システム",
    "footer.donate": "寄付",
    "footer.plea":
      "{siteName}を気に入っていただけましたか？ 今後の開発のため、ぜひ寄付をお願いします。",
    "footer.copyright": "© {years} {owner}",
    "footer.privacy": "プライバシー",
    "footer.termsOfUse": "利用規約",
    "footer.reportBug": "不具合を報告",
    "beta.banner":
      "これはベータ版のサイトです。データはいつリセットされるかわかりません。",
    "privacy.contact":
      "このページや、保存されているあなたの情報についてのお問い合わせ：{emailAddress}",
    // The link's words must be written exactly as they are in the box's.
    "termsOfUse.agree": "利用規約に同意します",
    "termsOfUse.link": "利用規約",
    "termsOfUse.report":
      "書き込まれた内容の報告や、この規約についてのお問い合わせ：{emailAddress}",
    "TermsOfUse.NotAgreed":
      "利用規約に同意するには、ボックスにチェックを入れてください。",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "ここは{siteName}を安心して試せる場所です。入力した内容は、いつ削除されるかわかりません。",

    "language.label": "言語",
    "language.choose": "変更",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "新しいお知らせがあります。",
    "whatsNew.admin.message": "大会を運営する方への新しいお知らせがあります。",
    "whatsNew.view": "新着情報を見る",
    "whatsNew.later": "次回に通知する",
    "whatsNew.never": "このお知らせを今後表示しない",

    "form.otherwise":
      "入力内容に問題があります。内容を確認して、もう一度お試しください。",

    // The account menu in the header.
    "account.menu": "アカウント",
    "account.register": "新規登録",
    "account.signIn": "サインイン",
    "account.forgotPassword": "パスワードをお忘れの方",
    "account.signOut": "サインアウト",
    "account.profile": "プロフィール",
    "account.changePassword": "パスワードを変更",
    "account.changeEmailAddress": "メールアドレスを変更",
    "account.changeName": "名前を変更",
    "account.setPassword": "パスワードを設定",
    "account.forgetAccount": "アカウントを削除",

    "register.title": "新規登録",
    "register.emailAddress": "メールアドレス",
    "register.submit": "登録する",
    "register.withGoogle": "Googleで登録",
    "register.or": "または",
    // Said above the form when Google sent the reader back without them being
    // let in.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Googleがこのメールアドレスをあなたのものと確認していないため、ここではGoogleで利用できません。下のメールアドレスでお試しください。",
    "SignInWithGoogle.LinkedToAnother":
      "このメールアドレスのアカウントはすでにあり、別のGoogleアカウントと連携されています。そのGoogleアカウントでサインインするか、メールアドレスとパスワードでサインインしてください。",
    "SignInWithGoogle.NameMissing":
      "Googleから名前を受け取れませんでしたが、アカウントには名前が必要です。下のメールアドレスでお試しください。",
    "Google.Unreachable":
      "現在Googleに接続できません。数分後にもう一度お試しいただくか、下のメールアドレスをご利用ください。",
    "Registration.NotAPerson":
      "人による操作と判断できませんでした。もう一度お試しください。何度も起こる場合は、数分待ってからやり直してください。",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "メールアドレスを入力してください。",
    "EmailAddress.NoAt": "メールアドレスには @ が必要です。",
    "EmailAddress.MoreThanOneAt": "メールアドレスの @ は1つだけです。",
    "EmailAddress.NoDomain":
      "メールアドレスの @ の後ろには、example.com のようなドメインが必要です。",

    "welcome.title": "メールをご確認ください",
    "welcome.checkEmail":
      "入力されたアドレスにメールを送信しました。メール内のリンクから手続きを進めてください。",
    "welcome.nothingArrived":
      "数分たってもメールが届かない場合は、迷惑メールフォルダを確認してください。",
    "welcome.home": "{siteName}に戻る",
    "newConfirmationLink.title": "新しいリンクを取得",
    "newConfirmationLink.explanation":
      "メールアドレス確認用のリンクの有効期限が切れました。新しいリンクを依頼すると、登録したアドレスに送信されます。",
    "newConfirmationLink.send": "新しいリンクを送る",
    "newConfirmationLink.home": "{siteName}に戻る",
    "newConfirmationLink.signIn": "サインイン",
    "newConfirmationLink.sent.title": "メールをご確認ください",
    "newConfirmationLink.sent.explanation":
      "新しいリンクを送信しました。リンクを開いてメールアドレスを確認してください。数分たっても届かない場合は、迷惑メールフォルダを確認してください。",
    "newConfirmationLink.alreadyConfirmed.title":
      "このメールアドレスは確認済みです",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "これ以上の確認は必要ありません。確認時に設定したパスワードでサインインしてください。",
    "newConfirmationLink.noLongerWorks.title": "このリンクは使えなくなりました",
    "newConfirmationLink.noLongerWorks.explanation":
      "メールのリンクを末尾まで欠けることなく開いたか確認してください。それでも使えない場合は、もう一度登録すると新しいリンクが送信されます。",
    "newConfirmationLink.tooMany.title": "しばらくしてからお試しください",
    "newConfirmationLink.tooMany.explanation":
      "最近、このアドレスに何通ものリンクを送信しました。1時間待ってからもう一度依頼してください。その間、迷惑メールフォルダも確認してください。",

    "forgotPassword.title": "パスワードをお忘れですか？",
    "forgotPassword.emailAddress": "メールアドレス",
    "forgotPassword.submit": "再設定の方法を送る",
    "forgotPassword.home": "{siteName}に戻る",
    "forgotPassword.sent.title": "メールをご確認ください",
    "forgotPassword.sent.explanation":
      "このアドレスのアカウントがある場合、新しいパスワードを設定するためのリンクを送信しました。1時間以内にリンクを開いてください。数分たっても届かない場合は、迷惑メールフォルダを確認してください。",
    "forgotPassword.tryAgainLater":
      "ここから再設定の依頼が最近多すぎます。1時間待ってからもう一度お試しください。",

    "setNewPassword.title": "新しいパスワードを設定",
    "setNewPassword.password": "パスワード",
    "setNewPassword.confirmPassword": "パスワード（確認）",
    "setNewPassword.submit": "新しいパスワードを設定する",
    "setNewPassword.home": "{siteName}に戻る",
    "setNewPassword.signIn": "サインイン",
    "setNewPassword.askAgain": "新しいリンクを依頼",
    "setNewPassword.changed.title": "パスワードを変更しました",
    "setNewPassword.changed.explanation":
      "サインインしていたすべての場所からサインアウトしました。新しいパスワードでサインインしてください。",
    "setNewPassword.expired.title": "このリンクは期限切れです",
    "setNewPassword.expired.explanation":
      "新しいパスワードを設定するリンクは1時間有効です。もう一度依頼すると、同じアドレスに送信されます。",
    "setNewPassword.noLongerWorks.title": "このリンクは使えなくなりました",
    "setNewPassword.noLongerWorks.explanation":
      "すでに使用済みか、リンクの末尾が欠けている可能性があります。必要であれば、もう一度依頼してください。",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "現在パスワードを確認できないため、変更されていません。数分後にもう一度お試しください。リンクは期限が切れるまで使えます。",

    "forgetAccount.title": "アカウントを削除",
    "forgetAccount.explanation":
      "お名前とメールアドレスを読み取れない状態にし、アカウントを閉鎖できます。ご本人確認のため、まずアカウントのアドレスにリンクを送信します。そのリンクを開くまで、何も削除されません。",
    "forgetAccount.submit": "リンクをメールで送る",
    "forgetAccount.sent.title": "メールをご確認ください",
    "forgetAccount.sent.explanation":
      "アカウントのアドレスにリンクを送信しました。リンクは15分間有効で、このアカウントにサインインしている間だけ使えます。",
    "forgetAccount.confirm.title": "アカウントを完全に削除しますか？",
    "forgetAccount.confirm.explanation":
      "削除すると、お名前とメールアドレスは誰にも二度と読み取れなくなり、アカウントにサインインできなくなります。元に戻すことはできません。",
    "forgetAccount.confirm.submit": "アカウントを削除する",
    "forgetAccount.forgotten.title": "アカウントを削除しました",
    "forgetAccount.forgotten.explanation":
      "お名前とメールアドレスは読み取れなくなり、サインインしていたすべての場所からサインアウトしました。",
    "forgetAccount.noLongerWorks.title": "このリンクは使えなくなりました",
    "forgetAccount.noLongerWorks.explanation":
      "期限切れか使用済みか、サインインしていないアカウントのリンクである可能性があります。それでも削除したい場合は、アカウントからもう一度依頼してください。",
    "forgetAccount.lastAdministrator.title": "このアカウントは削除できません",
    "forgetAccount.lastAdministrator.explanation":
      "あなたはこのサイトの唯一の管理者です。ほかの方に管理者の役割を渡せば、アカウントを削除できます。",
    "forgetAccount.askAgain": "もう一度依頼",
    "forgetAccount.home": "{siteName}に戻る",

    "registrationsSuspended.title": "現在、新規登録を停止しています",
    "registrationsSuspended.explanation":
      "登録に必要なサービスに現在接続できないため、応答が戻るまで誰も登録できません。入力した内容は保存されていません。",
    "registrationsSuspended.tryAgainLater":
      "しばらくしてからもう一度お試しください。サイトの管理者には連絡済みです。",
    "registrationsSuspended.home": "{siteName}に戻る",

    "signIn.title": "サインイン",
    "signIn.emailAddress": "メールアドレス",
    "signIn.password": "パスワード",
    "signIn.submit": "サインインする",
    "signIn.forgotPassword": "パスワードをお忘れの方",
    "signIn.register": "新規登録",
    "signIn.withGoogle": "Googleでサインイン",
    "signIn.or": "または",
    "signIn.tryAgainLater":
      "最近、試行回数が多すぎます。1時間待ってからもう一度お試しください。",

    // The one answer to a wrong password and to an address nobody registered.
    "SignIn.Failed":
      "メールアドレスまたはパスワードが正しくありません。もう一度お試しください。",

    "profile.title": "プロフィール",
    // A label's colon is its words'.
    "profile.name": "名前：",
    "profile.emailAddress": "メールアドレス：",

    "changeName.title": "名前を変更",
    "changeName.name": "名前",
    "changeName.submit": "名前を変更する",

    "setPassword.title": "パスワードを設定",
    "setPassword.explanation":
      "このアカウントにはパスワードがなく、Googleでサインインしています。パスワードでもサインインできるように、設定用のリンクを{emailAddress}に送信します。",
    "setPassword.submit": "リンクをメールで送る",
    "setPassword.sent.title": "メールをご確認ください",
    "setPassword.sent.explanation":
      "パスワード設定用のリンクを送信しました。リンクは1時間有効です。",
    "setPassword.profile": "プロフィールに戻る",

    "changePassword.title": "パスワードを変更",
    "changePassword.currentPassword": "現在のパスワード",
    "changePassword.password": "新しいパスワード",
    "changePassword.passwordConfirmation": "パスワード（確認）",
    "changePassword.forgotPassword": "パスワードをお忘れの方",
    "changePassword.submit": "パスワードを変更する",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "パスワードが正しくありません。",

    "changeEmailAddress.title": "メールアドレスを変更",
    "changeEmailAddress.emailAddress": "新しいメールアドレス",
    "changeEmailAddress.currentPassword": "現在のパスワード",
    "changeEmailAddress.submit": "確認用リンクを送る",
    "changeEmailAddress.sent.title": "メールをご確認ください",
    "changeEmailAddress.sent.explanation":
      "アカウントの移行を確認するリンクを、新しいメールアドレスに送信しました。サインインした状態でリンクを開くと、アカウントが移行します。",
    "changeEmailAddress.confirm.title": "アカウントを移行",
    "changeEmailAddress.confirm.explanation":
      "アカウントを{emailAddress}に移行します。今後はそのアドレスでサインインします。",
    "changeEmailAddress.confirm.submit": "アカウントを移行する",
    "changeEmailAddress.noLongerWorks.title": "このリンクは使えなくなりました",
    "changeEmailAddress.noLongerWorks.explanation":
      "期限切れか使用済みか、サインイン中のアカウント用に送られたリンクではない可能性があります。プロフィールからもう一度依頼してください。",
    "changeEmailAddress.taken.title": "アカウントは移行されていません",
    "changeEmailAddress.profile": "プロフィールに戻る",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "パスワードが正しくありません。",
    "ChangeEmailAddress.Unchanged": "アカウントはすでにこのアドレスです。",
    "ChangeEmailAddress.Taken":
      "そのメールアドレスには別のアカウントができたため、移行できません。",

    "confirmEmailAddress.title": "メールアドレスの確認",
    "confirmEmailAddress.name": "名前",
    "confirmEmailAddress.password": "パスワード",
    "confirmEmailAddress.confirmPassword": "パスワード（確認）",
    "confirmEmailAddress.submit": "メールアドレスを確認する",
    "confirmEmailAddress.signIn": "サインイン",
    "confirmEmailAddress.home": "{siteName}に戻る",
    "confirmEmailAddress.confirmed.title": "メールアドレスを確認しました",
    "confirmEmailAddress.confirmed.explanation":
      "アカウントの準備ができました。今入力したメールアドレスとパスワードでサインインしてください。",
    "confirmEmailAddress.expired.title": "このリンクは期限切れです",
    "confirmEmailAddress.expired.explanation":
      "メールアドレス確認用のリンクは24時間有効です。新しいリンクを依頼すると、同じアドレスに送信されます。",
    "confirmEmailAddress.expired.newLink": "新しいリンクを送る",
    "confirmEmailAddress.noLongerWorks.title": "このリンクは使えなくなりました",
    "confirmEmailAddress.noLongerWorks.explanation":
      "メールのリンクを末尾まで欠けることなく開いたか確認してください。それでも使えない場合は、もう一度登録すると新しいリンクが送信されます。",
    "confirmEmailAddress.alreadyConfirmed.title":
      "このメールアドレスは確認済みです",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "これ以上の手続きは必要ありません。確認時に設定したパスワードでサインインしてください。",

    // A rule broken, keyed by its code. Said beneath the field it reads.
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
      "このパスワードは、ほかで起きたデータ漏えいで流出したことがあるため、安全に使えません。別のものを選んでください。",

    "javaScriptRequired.title": "スクリプトが必要です",
    "javaScriptRequired.explanation":
      "登録するには、このサイトでスクリプトを有効にする必要があります。登録しようとしているのが人であることを確認するためです。有効にしてから、もう一度登録してください。",
    "javaScriptRequired.register": "登録に戻る",
    "javaScriptRequired.home": "{siteName}に戻る",

    "errors.backHome": "{siteName}に戻る",
    "errors.notFound": "見つかりません",
    "errors.refused": "実行できませんでした",
    "errors.refusedDetail": "送信された内容に問題があります。",
    "errors.sorry": "申し訳ありません",
    "errors.sorryDetail": "このリクエストは処理できませんでした。",
    "errors.failed": "問題が発生しました",
    "errors.reference": "参照番号 {reference}",
    "errors.recorded":
      "エラーを記録し、管理者にメールを送信しました。参照番号と、そのとき行っていた操作を管理者にメールでお知らせいただけると助かります。",
    "errors.message": "管理者にメールする",
    "errors.messageSubject": "{siteName}でのエラー {reference}",
    "errors.messageBody": "問題が起きたときに行っていた操作：\n\n",
    "errors.unavailable": "サイトを利用できません",
    "errors.unavailableDetail":
      "現在、サイトに必要なものに接続できません。しばらくしてからもう一度お試しください。",
    "errors.maintenance": "サイトはメンテナンス中です。",
    "errors.maintenanceMinutes": "{minutes}分後に復旧する見込みです。",
    "errors.maintenanceMinute": "1分後に復旧する見込みです。",
    "errors.maintenanceLonger":
      "予定より時間がかかっています。まもなく復旧します。",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "最近の結果",
    "home.recentResults.none": "過去7日間に追加されたゲームはありません。",
    "home.upcomingTournaments": "今後の大会",
    "home.upcomingTournaments.none": "60日以内に始まる大会はありません。",
    "home.allTournaments": "{year}年のすべての大会",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "{year}年の大会",
    "year.none": "{year}年に始まる大会はありません。",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "{year}年の{sport}の大会",
    "yearSport.none": "{year}年に始まる{sport}の大会はありません。",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "最近",
    "tournament.summary": "サマリー",
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "各試合は{count}ゲーム先取制です。",
    "test.vs": "対",
    "test.matches": "試合",
    "test.games": "ゲーム",
    "test.hoops": "フープ",
    "teamSummary.tests": "テストマッチ",
    "teamSummary.matches": "試合",
    "teamSummary.games": "ゲーム",
    "teamSummary.hoops": "フープ",
    "teamSummary.wins": "勝ち",
    "teamSummary.losses": "負け",
    "teamSummary.draws": "引き分け",
    "teamSummary.for": "得",
    "teamSummary.against": "失",
    "teamSummary.net": "差",
    "tournament.players": "選手",
    "search.label": "検索",
    "search.tournaments": "大会",
    "search.competitions": "部門",
    "search.nothingFound": "見つかりませんでした。",
    "players.search.label": "選手を検索",
    "players.search.prompt": "選手の名前を入力して探します。",
    "players.search.none": "選手が見つかりませんでした。",
    "search.more":
      "最初の{count}件だけを表示しています。名前をもっと入力して絞り込んでください。",
    "websitePlayer.tournament": "大会",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} 対 {second}",
    "tournament.notes": "お知らせ",
    "tournament.commentary": "実況",
    "tournament.beat": "勝ち",
    "tournament.drewWith": "引き分け",
    "tournament.ago.seconds": "{count}秒",
    "tournament.ago.minutes": "{count}分",
    "tournament.ago.hour": "1時間",
    "tournament.ago.hours": "{count}時間",
    "tournament.none": "まだゲームは行われていません。",
    // A tournament's players' page, when it has none.
    "players.none": "まだ選手が追加されていません。",
    // A tournament's commentaries page.
    "commentaries.by": "投稿者：",
    "commentaries.start": "新しい実況を始める",
    // The page that starts a commentary.
    "startCommentary.title": "新しい実況を始める",
    "startCommentary.titleField": "タイトル",
    "startCommentary.submit": "実況を始める",
    // "New" is said to a screen reader in place of the red asterisk.
    "marks.new": "新着",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "運営者はまだお知らせを書いていません。",
    "note.edited": "編集済み",
    // A commentary's page.
    "commentary.none": "まだコメントはありません。",
    "commentary.edited": "編集済み",
    "commentary.edit": "編集",
    "commentary.delete": "削除",
    "commentary.comment": "コメント",
    "commentary.add": "コメントを追加",
    "commentary.notSent":
      "コメントを送信できませんでした。ページを読み込み直して、保存されたか確認してください。",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "タイトルを変更",
    "changeCommentaryTitle.submit": "保存",
    // A comment's own page, and the page that asks before it is deleted.
    "editComment.title": "コメントを編集",
    "editComment.save": "保存",
    "deleteComment.title": "コメントを削除",
    "deleteComment.question": "このコメントを削除しますか？ 元に戻せません。",
    "deleteComment.confirm": "コメントを削除",
    "deleteComment.keep": "削除しない",
    // A player's page.
    "player.games": "ゲーム",
    "player.competitions": "部門",
    "player.beat": "勝ち",
    "player.lostTo": "負け",
    "player.drewWith": "引き分け",
    "player.score": "{score}対{opponent}",
    "player.noGames": "まだゲームは行われていません。",
    "player.noCompetitions": "まだどの部門にも参加していません。",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "勝ち",
    "block.matches": "試合",
    "block.netGames": "ゲーム差",
    "block.games": "ゲーム",
    "block.netHoops": "フープ差",
    "block.playedTo": "{hoops} ゲートまで",
    "block.won": "勝ち",
    "block.lost": "負け",
    "block.drawn": "引き分け",
    "block.withdrawn": "棄権",
    // A game withdrawn.
    "block.gameWithdrawn": "棄権",
    "block.losses": "負け",
    // The three views of a block, offered beneath its heading.
    "competition.views": "表示",
    "competition.view.grid": "対戦表",
    "competition.view.summary": "サマリー",
    "competition.view.orderOfPlay": "試合順",
    "competition.print": "印刷",
    "blockSummary.ranking":
      "試合の勝率、次にフープ差の順に並べています。大会独自の規定では、選手の順位が異なる場合があります。",
    "orderOfPlay.none": "まだゲームは行われていません。",
    "orderOfPlay.column.game": "試合",
    "orderOfPlay.column.date": "日付",
    // A knockout's rounds, counted back from the last, and a bye.
    "knockout.round.final": "決勝",
    "knockout.round.semis": "準決勝",
    "knockout.round.quarters": "準々決勝",
    "knockout.round.number": "第{number}ラウンド",
    "knockout.bye": "Bye",
    // A Swiss's table.
    "swiss.games": "ゲーム",
    "swiss.wins": "勝ち",
    "swiss.winShare": "勝率",
    "swiss.results": "結果",
    // The arrows that scroll a knockout's grid.
    "knockout.onward": "後のラウンド",
    "knockout.back": "前のラウンド",
    // What every list of tournaments shares.
    "tournamentList.column.date": "日付",
    "tournamentList.column.name": "名称",
    // A flag, which narrows the lists to its country.
    "tournamentList.onlyIn": "{country}の大会のみ",
    "tournamentList.usualOrder": "いつもの順序に戻す",
    "tournamentList.filter.country": "国",
    "tournamentList.filter.anyCountry": "すべての国",
    "tournamentList.filter.region": "地域",
    "tournamentList.filter.anyRegion": "すべての地域",
    "tournamentList.filter.noRegionsBefore":
      "2026年11月より前の大会には地域がありません。",
    "tournamentList.filter.sport": "競技",
    "tournamentList.filter.anySport": "すべての競技",
    "tournamentList.filter.submit": "絞り込む",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "年",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "以前の年",

    // The admin's words.
    "admin.newerBuild.message": "このサイトの新しいバージョンがあります。",
    "admin.newerBuild.reload": "再読み込み",
    "admin.title": "管理",
    "admin.tournaments.new": "新しい大会",
    "admin.tournaments.none": "大会がありません",
    "admin.tournaments.filter.none": "該当する大会がありません",
    "admin.tournaments.show": "表示",
    "admin.tournaments.managerScorer": "運営者/記録係",
    "admin.tournaments.worldRanking": "世界ランキング",
    "admin.tournaments.notWorldRanking": "世界ランキング対象外",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "アーカイブ済み",
    "admin.tournaments.manage": "運営",
    "admin.tournaments.edit": "編集",
    "admin.tournaments.archive": "アーカイブ",
    "admin.tournaments.restore": "復元",
    "admin.tournaments.scores": "スコア",
    "admin.tournaments.players": "選手",
    "admin.years.label": "年",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "以前の年",
    "admin.tournament.name": "名称",
    "admin.tournament.starts": "開始日",
    "admin.tournament.finishes": "終了日",
    "admin.tournament.format": "形式",
    "admin.tournament.sport": "競技",
    "admin.tournament.country": "国",
    "admin.tournament.region": "地域",
    "admin.tournament.subtitle": "サブタイトル",
    "admin.rules.handicap": "ハンディキャップあり",
    "admin.rules.drawsAllowed": "引き分けを認める",
    "admin.tournament.levelTestsDrawn": "同点のテストマッチは引き分け",
    "admin.rules.worldRankings": "世界ランキングの対象",
    "admin.rules.maximumHoops": "最大ゲート数",
    "admin.tournament.national": "全国レベルの大会",
    "admin.tournament.international": "国際レベルの大会",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "この内容では受け付けられません。",
    "admin.newTournament.title": "新しい大会",
    "admin.newTournament.submit": "大会を作成",
    "admin.editTournament.title": "大会を編集",
    "admin.editTournament.submit": "大会を更新",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "この大会は変更できません。",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "大会",
    "admin.view.players": "選手",
    "admin.view.competitions": "部門",
    "admin.view.managers": "運営者",
    "admin.view.notes": "お知らせ",
    "admin.view.scorers": "記録係",
    "admin.view.rankings": "ランキング",
    "admin.rankings.file":
      "世界ランキングにはこの大会の結果が使われます。この機能を使うため、運営者が何かを行う必要はありません。",
    "admin.rankings.download": "世界ランキング用のゲームをダウンロード",
    "rankings.notAvailable": "ランキングは利用できません",
    "rankings.notAvailable.sport":
      "この大会の競技には世界ランキングがないため、送信するランキングはありません。",
    "rankings.notAvailable.notCounted":
      "この大会のどの部門も世界ランキングの対象ではありません。",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "この大会はここからは運営できません。",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "部門",
    "admin.competitionView.players": "選手",
    "admin.competitionView.scores": "スコア",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "大会とその部門",
    "admin.sections.tournament": "大会",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "管理者のページ",
    "admin.administrator.sections.tournaments": "大会",
    "admin.administrator.sections.accounts": "アカウント",
    "admin.administrator.sections.worldRankings": "世界ランキング",
    "admin.administrator.sections.importErrors": "インポートエラー",
    "admin.administrator.sections.logs": "ログ",
    "admin.administrator.sections.databaseStatus": "データベースへの接続",
    "admin.administrator.sections.countries": "国",
    "admin.databaseStatus.title": "データベースへの接続",
    "admin.databaseStatus.on": "データベースへの接続はオンです。",
    "admin.databaseStatus.off": "データベースへの接続はオフです。",
    "admin.databaseStatus.expected":
      "サイトは{minutes}分後に復旧する見込みです。",
    "admin.databaseStatus.expectedOne": "サイトは1分後に復旧する見込みです。",
    "admin.databaseStatus.longer": "予定より時間がかかっています。",
    "admin.databaseStatus.told": "閲覧者への案内：{words}",
    "admin.databaseStatus.toldUsual": "閲覧者には通常の文言を案内しています。",
    "admin.databaseStatus.minutes": "見込み時間（分）",
    "admin.databaseStatus.words": "閲覧者への案内文",
    "admin.databaseStatus.turnOff": "オフにする",
    "admin.databaseStatus.change": "変更",
    "admin.databaseStatus.turnOn": "オンにする",
    "admin.databaseStatus.minutesNeeded": "分数を入力してください。",
    "admin.databaseStatus.otherwise": "サイトで問題が発生しました。",
    "DatabaseAccess.MinutesNotWhole": "分数は整数で入力してください。",
    "DatabaseAccess.MinutesOutOfRange": "分数は1から1440までにしてください。",
    "DatabaseAccess.WordsTooLong": "案内文は500文字以内にしてください。",
    "DatabaseAccess.NotOff": "データベースへの接続はオフではありません。",
    "admin.administrator.title": "管理者",
    // The accounts page, a section for each role.
    "admin.accounts.title": "アカウント",
    "admin.roles.add": "追加",
    "admin.roles.administrator.heading": "管理者",
    "admin.roles.administrator.none": "ほかの管理者はいません",
    "admin.roles.administrator.removeTitle": "管理者を外す",
    "admin.roles.administrator.removeExplanation":
      "{name}さんはこのサイトの管理者ではなくなります。",
    "admin.roles.ac-world-ranking-officer.heading":
      "アソシエーションクロッケー世界ランキング担当者",
    "admin.roles.ac-world-ranking-officer.none":
      "アソシエーションクロッケー世界ランキング担当者はいません",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "アソシエーションクロッケー世界ランキング担当者を外す",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name}さんはアソシエーションクロッケー世界ランキング担当者ではなくなります。",
    "admin.roles.gc-world-ranking-officer.heading":
      "ゴルフクロッケー世界ランキング担当者",
    "admin.roles.gc-world-ranking-officer.none":
      "ゴルフクロッケー世界ランキング担当者はいません",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "ゴルフクロッケー世界ランキング担当者を外す",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name}さんはゴルフクロッケー世界ランキング担当者ではなくなります。",
    // The page where the world ranking players are imported, and its log.
    "admin.worldRankings.title": "世界ランキングの選手をインポート",
    "admin.worldRankings.import": "インポート",
    "admin.worldRankings.log": "インポートの経過",
    "admin.worldRankings.ac.reading":
      "アソシエーションクロッケーの一覧を読み込み中",
    "admin.worldRankings.ac.read":
      "読み込んだアソシエーションクロッケーの選手：{players}",
    "admin.worldRankings.ac.kept":
      "残したアソシエーションクロッケーの選手：{players}",
    "admin.worldRankings.ac.refused":
      "アソシエーションクロッケーの一覧を読み込めなかったため、その選手は変更しませんでした。",
    "admin.worldRankings.gc.reading": "ゴルフクロッケーの一覧を読み込み中",
    "admin.worldRankings.gc.read":
      "読み込んだゴルフクロッケーの選手：{players}",
    "admin.worldRankings.gc.kept": "残したゴルフクロッケーの選手：{players}",
    "admin.worldRankings.gc.refused":
      "ゴルフクロッケーの一覧を読み込めなかったため、その選手は変更しませんでした。",
    "admin.worldRankings.finished": "完了",
    "admin.worldRankings.failed": "インポートは完了しませんでした。",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "サイトで問題が発生しました。",
    "WorldRankingLists.Unreachable":
      "世界ランキングのサイトに接続できませんでした。",
    "WorldRankingLists.Unreadable":
      "一覧が世界ランキングの書式になっていません。読み取れない行がある、選手が1人もいない、またはUTF-8で書かれていない可能性があります。",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "インポートエラー",
    "admin.importErrors.none": "インポートエラーはありません",
    "admin.importErrors.otherwise": "サイトで問題が発生しました。",
    "admin.countries.title": "国",
    "admin.countries.none":
      "リストにない国で開催されたトーナメントはありません",
    "admin.countries.oldSite": "旧サイト",
    "admin.countries.otherwise": "サイトで問題が発生しました。",
    "admin.logs.title": "ログ",
    "admin.logs.severity": "重大度",
    "admin.logs.text": "検索",
    "admin.logs.show": "表示",
    "admin.logs.prune": "整理",
    "admin.logs.pruneAsk":
      "直近1時間より前のログを削除しますか？ 元に戻せません。",
    "admin.logs.removed": "{count}件のエントリを削除しました",
    "admin.logs.none": "ログのエントリはありません",
    "admin.logs.otherwise": "サイトで問題が発生しました。",
    "admin.hover.logs.show": "一致するエントリを表示します",
    "admin.hover.logs.prune": "直近1時間より前のログを削除します",
    "admin.hover.logs.pruneAgree": "直近1時間より前のログを削除します",
    "admin.importError.title": "インポートエラー",
    "admin.importError.documentId": "ドキュメントID",
    "admin.importError.tournament": "大会",
    "admin.importError.competition": "部門",
    "admin.importError.newSite": "新サイト",
    "admin.importError.oldSite": "旧サイト",
    "ImportErrorKept.NotFound":
      "そのドキュメントについて、インポートが保存したエラーはありません。",
    "admin.competitionView.otherwise": "この部門はここからは運営できません。",
    // The Competitions tab.
    "admin.competitions.block": "ブロック",
    "admin.competitions.knockout": "ノックアウト",
    "admin.competitions.swiss": "スイス式",
    "admin.competitions.view": "表示",
    "admin.competitions.edit": "編集",
    "admin.competitions.up": "上へ",
    "admin.competitions.down": "下へ",
    "admin.competitions.archive": "アーカイブ",
    "admin.competitions.restore": "復元",
    "admin.competitions.archived": "アーカイブ済みの部門",
    "admin.competitions.none": "部門がありません",
    "admin.competitions.add": "部門を追加",
    // The competition dialog.
    "admin.competition.addTitle": "部門を追加",
    "admin.competition.editTitle": "部門を編集",
    "admin.competition.name": "名称",
    "admin.competition.kind": "種類",
    "admin.competition.bestOf": "先取ゲーム数",
    "admin.competition.rounds": "ラウンド数",
    "admin.competition.places": "枠数",
    "admin.competition.round": "第{number}ラウンド",
    "admin.competition.bestOfs": "各ラウンドの先取ゲーム数",
    "admin.competition.quarters": "準々決勝",
    "admin.competition.semis": "準決勝",
    "admin.competition.final": "決勝",
    "admin.competition.add": "追加",
    "admin.competition.save": "保存",
    "admin.competition.added": "{name}を追加しました。",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise": "この部門はこの内容では保存できません。",
    "CompetitionName.Missing": "名称を入力してください。",
    "CompetitionName.TooLong": "名称は254文字以内にしてください。",
    "CompetitionName.NoLetterOrDigit": "名称には文字か数字が必要です。",
    "Tournament.KnockoutPlayerHasGames":
      "この組み合わせの選手にはゲームがあるため、枠は変更できません。",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "勝敗が決まった試合があるラウンドは、先取ゲーム数を減らせません。",
    "Tournament.KnockoutLaterRoundHasGames":
      "後のラウンドでゲームが行われたあとは、ラウンドを変更できません。",
    "Tournament.CompetitionNameTaken":
      "この大会のほかの部門がすでにその名称を使っています。",
    "Tournament.MaximumHoopsInvalid":
      "1 以上の整数でゲート数を入力してください。上限がない場合は空欄にします。",
    "BestOf.NotWhole": "ゲーム数は整数で入力してください。",
    "BestOf.TooSmall": "1試合は1ゲーム以上の先取制にしてください。",
    "Rounds.NotWhole": "ラウンド数は整数で入力してください。",
    "Rounds.TooSmall": "ブロックは1ラウンド以上で行ってください。",
    "KnockoutDraw.EvenBestOf":
      "ノックアウトの試合には勝者が必要なため、ゲーム数は奇数の先取制にしてください。",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "新しい大会を作成します",
    "admin.hover.tournaments.manage":
      "この大会の選手、チーム、部門、スコアを運営します",
    "admin.hover.tournaments.edit": "この大会の詳細を変更します",
    "admin.hover.tournaments.scores": "この大会のスコアを入力します",
    "admin.hover.tournaments.players": "この大会の選手を管理します",
    "admin.hover.competitions.view":
      "この部門を開いて、選手とスコアを確認・入力します",
    "admin.hover.tests.view":
      "このテストマッチを開いて、スコアを確認・入力します",
    "admin.hover.teams.view": "このチームを開いて、選手を確認・管理します",
    "admin.hover.dialog.player.add": "この選手を大会に追加します",
    "admin.hover.dialog.player.save": "この選手への変更を保存します",
    "admin.hover.dialog.team.add": "このチームを大会に追加します",
    "admin.hover.dialog.team.save": "このチームへの変更を保存します",
    "admin.hover.dialog.test.add": "このテストマッチを大会に追加します",
    "admin.hover.dialog.test.save": "このテストマッチへの変更を保存します",
    "admin.hover.dialog.competition.add": "この部門を大会に追加します",
    "admin.hover.dialog.competition.save": "この部門への変更を保存します",
    "admin.hover.dialog.score.add": "このスコアを部門に追加します",
    "admin.hover.dialog.score.save": "このスコアの訂正を保存します",
    "admin.hover.dialog.carryForward.save": "この選手の成績を繰り越します",
    "admin.hover.dialog.tournament.new": "この大会を作成します",
    "admin.hover.dialog.tournament.edit": "この大会への変更を保存します",
    "admin.hover.modal.cancel": "何も保存せずに閉じます",
    "admin.hover.modal.ok": "このメッセージを閉じます",
    "admin.hover.tab": "「{name}」タブを表示します",
    "admin.hover.tournaments.archive":
      "この大会をアーカイブします。あとで復元できます",
    "admin.hover.tournaments.restore": "アーカイブした大会を元に戻します",
    "admin.hover.players.add": "この大会に選手を追加します",
    "admin.hover.players.addMany": "この大会に複数の選手をまとめて追加します",
    "admin.hover.dialog.players.add": "これらの選手を大会に追加します",
    "admin.hover.players.edit": "この選手の詳細を変更します",
    "admin.hover.players.up": "この選手を一覧の上へ移動します",
    "admin.hover.players.down": "この選手を一覧の下へ移動します",
    "admin.hover.players.archive":
      "この選手をアーカイブします。あとで復元できます",
    "admin.hover.players.restore": "アーカイブした選手を元に戻します",
    "admin.hover.teams.add": "この大会にチームを追加します",
    "admin.hover.teams.edit": "このチームの詳細を変更します",
    "admin.hover.teams.up": "このチームを一覧の上へ移動します",
    "admin.hover.teams.down": "このチームを一覧の下へ移動します",
    "admin.hover.teams.archive":
      "このチームをアーカイブします。あとで復元できます",
    "admin.hover.teams.restore": "アーカイブしたチームを元に戻します",
    "admin.hover.competitions.add": "この大会に部門を追加します",
    "admin.hover.competitions.edit": "この部門の詳細を変更します",
    "admin.hover.competitions.up": "この部門を一覧の上へ移動します",
    "admin.hover.competitions.down": "この部門を一覧の下へ移動します",
    "admin.hover.competitions.archive":
      "この部門をアーカイブします。あとで復元できます",
    "admin.hover.competitions.restore": "アーカイブした部門を元に戻します",
    "admin.hover.tests.add": "2チーム間のテストマッチを追加します",
    "admin.hover.tests.edit": "このテストマッチの詳細を変更します",
    "admin.hover.tests.up": "このテストマッチを一覧の上へ移動します",
    "admin.hover.tests.down": "このテストマッチを一覧の下へ移動します",
    "admin.hover.tests.archive":
      "このテストマッチをアーカイブします。あとで復元できます",
    "admin.hover.tests.restore": "アーカイブしたテストマッチを元に戻します",
    "admin.hover.tests.toTeams":
      "チームタブに移動して、テストマッチに必要なチームを追加します",
    "admin.hover.scores.add": "この部門にゲームのスコアを追加します",
    "admin.hover.scores.edit": "このスコアを訂正します",
    "admin.hover.scores.archive":
      "このスコアをアーカイブして集計から外します。あとで復元できます",
    "admin.hover.scores.restore":
      "アーカイブしたスコアを元に戻し、再び集計に含めます",
    "admin.hover.scores.withdraw":
      "このスコアを一覧に残したまま、集計から外します",
    "admin.hover.scores.unwithdraw": "棄権にしたスコアを再び集計に含めます",
    "admin.hover.scores.up": "このスコアを一覧の前へ移動します",
    "admin.hover.scores.down": "このスコアを一覧の後ろへ移動します",
    "admin.hover.competitionPlayers.add": "選んだ選手をこの部門に入れます",
    "admin.hover.competitionPlayers.up": "この選手を一覧の上へ移動します",
    "admin.hover.competitionPlayers.down": "この選手を一覧の下へ移動します",
    "admin.hover.competitionPlayers.remove": "この選手を部門から外します",
    "admin.hover.competitionPlayers.withdraw": "この選手を部門から棄権させます",
    "admin.hover.competitionPlayers.unwithdraw":
      "棄権にした選手を部門に戻します",
    "admin.hover.competitionPlayers.carryForward":
      "ほかの部門からこの選手の成績を繰り越します",
    "admin.hover.notes.add": "この大会の新しいお知らせを書きます",
    "admin.hover.notes.edit": "このお知らせを変更します",
    "admin.hover.notes.delete": "このお知らせを削除します",
    "admin.hover.note.add": "このお知らせを保存して大会に追加します",
    "admin.hover.note.save": "このお知らせへの変更を保存します",
    "admin.hover.people.add": "この方に役割を与えます",
    "admin.hover.people.remove": "この方から役割を外します",
    "admin.hover.worldRankings.import":
      "世界ランキングを取得して、その選手を追加します",
    "admin.modal.cancel": "キャンセル",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs.
    "admin.people.emailAddress": "メールアドレス",
    "admin.people.remove": "外す",
    "admin.people.otherwise": "実行できませんでした。",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "あなた",
    "admin.managers.add": "運営者を追加",
    "admin.managers.email": "運営者にメールする",
    "admin.managers.none": "運営者がいません",
    "admin.managers.removeTitle": "運営者を外す",
    "admin.managers.removeExplanation":
      "{name}さんはこの大会を運営できなくなります。",
    "admin.managers.removeYourself.explanation":
      "あなたはこの大会を運営できなくなり、ここでは誰も元に戻せません。ほかの運営者が再び運営者にすることはできます。",
    "admin.managers.otherwise": "そのアドレスは運営者にできません。",
    // A competition's Players tab.
    "admin.competitionPlayers.add": "選手を追加",
    "admin.competitionPlayers.otherwise": "この選手は追加できません。",
    "admin.competitionPlayers.choose": "追加する選手",
    "admin.competitionPlayers.nobody": "選手を選択",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "全選手がこの部門に入っています",
    "admin.competitionPlayers.none": "選手がいません",
    "admin.competitionPlayers.up": "上へ",
    "admin.competitionPlayers.down": "下へ",
    "admin.competitionPlayers.remove": "外す",
    "admin.competitionPlayers.withdraw": "棄権",
    "admin.competitionPlayers.unwithdraw": "棄権を取り消す",
    "admin.competitionPlayers.withdrawn": "棄権した選手",
    "admin.competitionPlayers.removeTitle": "選手を外す",
    "admin.competitionPlayers.removeQuestion":
      "{name}さんを部門から外します。元に戻せません。",
    "admin.competitionPlayers.withdrawTitle": "選手を棄権させる",
    "admin.competitionPlayers.withdrawQuestion":
      "{name}さんは部門の残りの試合に出場せず、未実施のゲームは不戦で決着します。",
    "admin.competitionPlayers.carryForward": "繰り越し",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "繰り越し - {name}",
    "admin.carryForward.save": "保存",
    "admin.carryForward.otherwise": "この繰り越しは保存できません。",
    "admin.carryForward.matchWins": "試合の勝ち",
    "admin.carryForward.matchLosses": "試合の負け",
    "admin.carryForward.gameWins": "ゲームの勝ち",
    "admin.carryForward.gameLosses": "ゲームの負け",
    "admin.carryForward.hoopsFor": "得フープ",
    "admin.carryForward.hoopsAgainst": "失フープ",
    "CarryForward.MatchWinsNotWhole": "試合の勝ち数は整数で入力してください。",
    "CarryForward.MatchWinsBelowZero":
      "試合の勝ち数は0以上で入力してください。",
    "CarryForward.MatchLossesNotWhole":
      "試合の負け数は整数で入力してください。",
    "CarryForward.MatchLossesBelowZero":
      "試合の負け数は0以上で入力してください。",
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
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "スコアを追加",
    "admin.scores.none": "スコアがありません",
    "admin.scores.edit": "編集",
    "admin.scores.drawNotFilledTitle": "組み合わせが未完成です",
    "admin.scores.archive": "アーカイブ",
    "admin.scores.up": "上へ",
    "admin.scores.down": "下へ",
    "admin.scores.restore": "復元",
    "admin.scores.archived": "アーカイブ済みのスコア",
    "admin.scores.archivedSaid": "アーカイブ済み",
    "admin.scores.withdraw": "棄権",
    "admin.scores.unwithdraw": "棄権を取り消す",
    "admin.scores.withdrawnSaid": "棄権",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "実行できませんでした。",
    "admin.score.title": "スコアを追加",
    "admin.score.add": "ゲームを追加",
    "admin.score.winner": "勝者",
    "admin.score.winnerScore": "勝者のスコア",
    "admin.score.loser": "敗者",
    "admin.score.loserScore": "敗者のスコア",
    "admin.score.beat": "勝ち",
    "admin.score.added":
      "{winner}さんが{loser}さんに勝ったゲームを追加しました。",
    "admin.score.otherwise": "ゲームを追加できませんでした。",
    "admin.score.correctTitle": "スコアを編集",
    "admin.score.save": "保存",
    "admin.score.notCorrected": "スコアを訂正できませんでした。",
    "Game.WinnerMissing": "勝者を選択してください。",
    "Game.WinnerScoreMissing": "勝者のスコアを入力してください。",
    "Game.LoserMissing": "敗者を選択してください。",
    "Game.LoserScoreMissing": "敗者のスコアを入力してください。",
    "Score.NoPoints": "スコアは点数から書き始めてください。",
    "Game.SamePlayer": "同じ選手同士は対戦できません。",
    "Game.WinnerNotAhead":
      "勝者のスコアは敗者より大きいか、勝ちと記す必要があります。",
    "Game.LoserMarked": "敗者のスコアを勝ちと記すことはできません。",
    "Game.ResultChanged":
      "訂正では結果を変えられません。勝ちは勝ちのまま、引き分けは引き分けのままです。",
    "Competition.MatchDecided": "この対戦の勝敗はすでに決まっています。",
    "Competition.DrawFull":
      "ノックアウトが埋まっているため、選手を追加できません。",
    "Competition.DrawNotFilled":
      "ノックアウトのすべての枠が選手かByeで埋まるまで、スコアは追加できません。",
    "Competition.ByeOutsideKnockout": "Byeを置けるのはノックアウトだけです。",
    "Competition.NotDrawnToMeet":
      "この選手たちは、ノックアウトで現在対戦する組み合わせになっていません。",
    "Competition.WinnerHasPlayedOn":
      "この試合の勝者はすでに次のゲームを行っているため、勝者は変更できません。",
    "CompetitionPlayer.Withdrawn": "棄権した選手はこれ以上出場しません。",
    "admin.players.add": "選手を追加",
    "admin.players.addMany": "選手をまとめて追加",
    "admin.players.none": "選手がいません",
    "admin.players.edit": "編集",
    "admin.players.archive": "アーカイブ",
    "admin.players.restore": "復元",
    "admin.players.up": "上へ",
    "admin.players.down": "下へ",
    // Asked before archiving a player who is in competitions.
    "admin.players.archiveTitle": "選手をアーカイブ",
    "admin.players.archiveQuestion": "{name}さんを次の部門から外します：",
    "admin.players.archive.explanation":
      "復元しても、これらの部門には戻りません。",
    "admin.players.archived": "アーカイブ済みの選手",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "アーカイブ済み",
    // The player dialog.
    "admin.player.addTitle": "選手を追加",
    "admin.player.editTitle": "選手を編集",
    "admin.player.name": "名前",
    "admin.player.handicap": "ハンディキャップ",
    "admin.player.representing": "代表",
    "admin.player.worldRankingName": "世界ランキングの選手名",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "世界ランキングにこの名前があります。",
    "admin.player.worldRankingQuestioned":
      "世界ランキングにこの名前の選手はいません。綴りが違うか、ランキングに登場したばかりの選手かもしれません。",
    "admin.player.flag": "国旗",
    "admin.player.add": "追加",
    "admin.player.save": "保存",
    "admin.player.added": "{name}を追加しました。",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "選手をまとめて追加",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "ヘルプ",
    "admin.players.many": "選手",
    "admin.players.line": "{line}行目：{words}",
    "AddPlayers.FieldsMissing": "1行目に項目名を書いてください。",
    "AddPlayers.NameMissing": "項目にはNameを含めてください。",
    "AddPlayers.FieldNotAllowed":
      "項目に指定できるのは、Name、Representing、Flag、Handicap、WorldRankingPlayerNameです。",
    "AddPlayers.FieldRepeated": "同じ項目名は1回しか指定できません。",
    "AddPlayers.PlayersMissing":
      "2行目以降の各行に選手を1人ずつ書いてください。",
    "AddPlayers.TooManyPlayers":
      "1つのリストに入れられる選手は最大500人です。残りは別のリストで追加してください。",
    "AddPlayers.ValuesMismatched":
      "1行目に書いた項目すべてについて、選手ごとに値を書いてください。値がない場合は空にしてください。",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "この選手はこの内容では保存できません。",
    "Tournament.PlayerNameTaken":
      "この大会のほかの選手がすでにその名前を使っています。",
    "TournamentPlayer.NoSuchFlag": "一覧にある国旗から選んでください。",
    "TournamentPlayer.HandicapMalformed":
      "ハンディキャップは数字で書いてください。例：-1.5、-1、0、1、2.5、24。",
    "TournamentPlayer.NamedBye": "選手に「Bye」という名前は付けられません。",
    "TournamentPlayer.NoLetterOrDigit": "名前には文字か数字が必要です。",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Byeを追加する必要はありません",
    "admin.player.byes":
      "Byeは大会の選手ではありません。ノックアウトでは、選手を追加するたびに、組み合わせに必要な数だけByeを選べます。",
    // A tournament played by teams: its Teams and Tests tabs, a team's page,
    // and their dialogs.
    "admin.view.teams": "チーム",
    "admin.view.tests": "テストマッチ",
    "admin.teams.add": "チームを追加",
    "admin.teams.none": "チームがありません",
    "admin.teams.edit": "編集",
    "admin.teams.view": "表示",
    "admin.teams.archive": "アーカイブ",
    "admin.teams.restore": "復元",
    "admin.teams.up": "上へ",
    "admin.teams.down": "下へ",
    "admin.teams.archived": "アーカイブ済みのチーム",
    "admin.teams.archivedSaid": "アーカイブ済み",
    "admin.team.addTitle": "チームを追加",
    "admin.team.editTitle": "チームを編集",
    "admin.team.name": "名称",
    "admin.team.shortName": "略称",
    "admin.team.shortName.explanation":
      "テストマッチで使うチームの呼び名です（例：AUS v ENG）。",
    "admin.team.flag": "国旗",
    "admin.team.add": "追加",
    "admin.team.save": "保存",
    "admin.team.added": "{name}を追加しました。",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "このチームはこの内容では保存できません。",
    "admin.teamView.otherwise": "このチームはここからは表示できません。",
    "admin.teamView.players": "選手",
    "TeamName.Missing": "チーム名を入力してください。",
    "TeamName.TooLong": "名称が長すぎます。",
    "admin.notes.add": "お知らせを追加",
    "admin.notes.none": "お知らせがありません",
    "admin.notes.edit": "編集",
    "admin.notes.delete": "削除",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "お知らせを削除",
    "admin.notes.deleteQuestion": "お知らせ「{title}」を削除しますか？",
    "admin.notes.delete.explanation":
      "削除したお知らせは完全に失われ、元に戻せません。",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "実行できませんでした。",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "お知らせを追加",
    "admin.note.editTitle": "お知らせを編集",
    "admin.note.title": "タイトル",
    "admin.note.description": "内容",
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
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "このお知らせはこの内容では保存できません。",
    "ManagerNoteTitle.Missing": "お知らせのタイトルを入力してください。",
    "ManagerNoteTitle.TooLong": "タイトルが長すぎます。",
    "ManagerNoteTitle.NoLetterOrDigit": "タイトルには文字か数字が必要です。",
    "ManagerNoteDescription.TooLong": "内容が長すぎます。",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "EditManagerNote.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "DeleteManagerNote.NoSuchManagerNote":
      "そのお知らせはもうありません。ほかの運営者が削除した可能性があります。",
    "ManagerNote.Deleted":
      "そのお知らせは削除されました。ほかの運営者が削除した可能性があります。",
    "CommentaryTitle.Missing": "実況のタイトルを入力してください。",
    "CommentaryTitle.TooLong": "タイトルが長すぎます。",
    "CommentaryTitle.NoLetterOrDigit": "タイトルには文字か数字が必要です。",
    "Commentary.TitleTaken": "ほかの実況がすでにそのタイトルを使っています。",
    "CommentText.Missing": "コメントの内容を入力してください。",
    "CommentText.TooLong": "コメントが長すぎます。",
    "TeamShortName.Missing": "チームの略称を入力してください。",
    "TeamShortName.TooLong": "略称は10文字以内にしてください。",
    "TeamShortName.NoLetterOrDigit": "略称には文字か数字が必要です。",
    "Team.ShortNameLongerThanName": "略称はチーム名より長くできません。",
    "Team.NoSuchFlag": "一覧にある国旗から選んでください。",
    "Team.Archived":
      "そのチームはアーカイブされています。先に復元してください。",
    "Team.InATest":
      "そのチームはテストマッチに出場するため、アーカイブできません。",
    "Team.PlayerNameTaken":
      "このチームのほかの選手がすでにその名前を使っています。",
    "TeamPlayer.NamedBye": "選手に「Bye」という名前は付けられません。",
    "TeamPlayer.Archived":
      "その選手はアーカイブされています。先に復元してください。",
    "TeamPlayer.HasGames": "その選手は出場済みのため、アーカイブできません。",
    "Tournament.TeamNameTaken":
      "この大会のほかのチームがすでにその名称を使っています。",
    "Tournament.TeamShortNameTaken":
      "この大会のほかのチームがすでにその略称を使っています。",
    "Tournament.NoSuchTeam": "この大会には、このアドレスのチームがありません。",
    "Tournament.TeamArchived":
      "このチームはアーカイブされています。チームタブからのみ復元できます。",
    "admin.tests.add": "テストマッチを追加",
    "admin.tests.none": "テストマッチがありません",
    "admin.tests.edit": "編集",
    "admin.tests.view": "表示",
    "admin.tests.archive": "アーカイブ",
    "admin.tests.restore": "復元",
    "admin.tests.up": "上へ",
    "admin.tests.down": "下へ",
    "admin.tests.archived": "アーカイブ済みのテストマッチ",
    "admin.tests.twoTeamsNeeded":
      "テストマッチは2チーム間で行うため、先に2チーム必要です。",
    "admin.tests.toTeams": "チームへ移動",
    "admin.tests.matches.one": "{count}試合",
    "admin.tests.matches.other": "{count}試合",
    "admin.tests.bestOf": "{games}ゲーム先取",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "実行できませんでした。",
    "admin.test.addTitle": "テストマッチを追加",
    "admin.test.editTitle": "テストマッチを編集",
    "admin.test.firstTeam": "チームA",
    "admin.test.secondTeam": "チームB",
    "admin.test.versus": "対",
    "admin.test.starts": "開始日",
    "admin.test.finishes": "終了日",
    "admin.test.expectedMatches": "予定試合数",
    "admin.test.bestOf": "先取ゲーム数",
    "admin.test.group": "グループ",
    "admin.test.add": "追加",
    "admin.test.save": "保存",
    "admin.test.added": "{name}を追加しました。",
    "admin.test.otherwise": "このテストマッチはこの内容では保存できません。",
    "admin.testView.otherwise": "このテストマッチはここからは表示できません。",
    "AddTest.FirstTeamMissing": "最初のチームを選択してください。",
    "AddTest.SecondTeamMissing": "2番目のチームを選択してください。",
    "UpdateTest.FirstTeamMissing": "最初のチームを選択してください。",
    "UpdateTest.SecondTeamMissing": "2番目のチームを選択してください。",
    "ExpectedMatches.NotWhole": "試合数は整数で入力してください。",
    "ExpectedMatches.TooSmall":
      "テストマッチの予定試合数は1試合以上にしてください。",
    "TestGroup.TooLong": "グループ名が長すぎます。",
    "Tournament.TestAgainstItself":
      "同じチーム同士でテストマッチは行えません。",
    "Tournament.FormatHasNoGroups":
      "この形式のテストマッチはグループに分けられません。",
    "Tournament.TestFinishesBeforeStarts":
      "テストマッチは開始前に終了できません。",
    "Tournament.TestStartsBeforeTournament":
      "テストマッチは大会の開始前に始められません。",
    "Tournament.TestFinishesAfterTournament":
      "テストマッチは大会の終了後に終えられません。",
    "Tournament.TestHasGamesInUse":
      "このテストマッチにはゲームがあるため、ゲームがなくなるまでアーカイブできません。",
    "Tournament.TestHasGames":
      "このテストマッチにはすでにゲームがあるため、チームは変更できません。",
    "Tournament.ExpectedMatchesBelowStarted":
      "それより多くの試合がすでに始まっています。",
    "Tournament.BestOfBelowGamesPlayed":
      "それより多くのゲームを、2人の選手がすでに行っています。",
    "Competition.ExpectedMatchesReached":
      "このテストマッチは、予定した数の試合をすでに始めています。",
    "Competition.SameTeam": "同じチームの選手同士は対戦しません。",
    "AddManager.NoSuchAccount":
      "そのアドレスには、運営者にできるアカウントがありません。",
    "admin.scorers.add": "記録係を追加",
    "admin.scorers.none": "記録係がいません",
    "admin.scorers.removeTitle": "記録係を外す",
    "admin.scorers.removeExplanation":
      "{name}さんはこの大会のスコアを入力できなくなります。",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "そのアドレスは記録係にできません。",
    "AddScorer.NoSuchAccount":
      "そのアドレスには、記録係にできるアカウントがありません。",
    // Giving, taking and listing roles, which only an administrator can do.
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

    // A tournament's refusals, keyed by their codes as every rule broken is.
    "TournamentName.Missing": "大会の名称を入力してください。",
    "TournamentName.TooShort": "名称が短すぎます。",
    "TournamentName.TooLong": "名称が長すぎます。",
    "TournamentName.AllLowerCase": "名称をすべて小文字にすることはできません。",
    "TournamentName.AllCapitals": "名称をすべて大文字にすることはできません。",
    "TournamentName.NoLetterOrDigit": "名称には文字か数字が必要です。",
    "ReadOnlyDate.Unreadable": "日付を入力してください。",
    "Tournament.FinishesBeforeStarts": "大会は開始前に終了できません。",
    "Tournament.StartsAfterNextYear": "大会の開始は来年までにしてください。",
    "Tournament.FinishesAfterNextYear": "大会の終了は来年までにしてください。",
    "CreateTournament.NoSuchCountry": "国を選択してください。",
    "TournamentSubtitle.TooLong": "サブタイトルは2000文字以内にしてください。",
    "Tournament.NotAManager": "この大会を変更できるのは、運営者だけです。",
    "Tournament.NotAManagerOrScorer":
      "この大会を見られるのは、運営者か記録係だけです。",
    "Tournament.Archived":
      "この大会はアーカイブされています。変更する前に復元してください。",
    "UpdateTournament.NoSuchTournament": "このアドレスの大会はありません。",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form.
    "sport.ac": "アソシエーションクロッケー",
    "sport.gc": "ゴルフクロッケー",
    "sport.a6w": "アメリカン6ウィケット",
    "sport.rc": "リコシェ",
    "sport.gb": "ゲートボール",
    "format.standard": "標準",
    "format.teams": "チーム戦",
    "format.eire-cup": "エイレカップ",
    "format.interstate-shield": "インターステートシールド",
    "format.gc-world-team-championship": "GC世界チーム選手権",
    "country.ad": "アンドラ",
    "country.ae": "アラブ首長国連邦",
    "country.af": "アフガニスタン",
    "country.ag": "アンティグア・バーブーダ",
    "country.ai": "アンギラ",
    "country.al": "アルバニア",
    "country.am": "アルメニア",
    "country.ao": "アンゴラ",
    "country.ar": "アルゼンチン",
    "country.as": "米領サモア",
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
    "country.fm": "ミクロネシア",
    "country.fo": "フェロー諸島",
    "country.fr": "フランス",
    "country.ga": "ガボン",
    "country.gb": "イギリス",
    "country.gd": "グレナダ",
    "country.ge": "ジョージア",
    "country.gf": "仏領ギアナ",
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
    "country.io": "英領インド洋地域",
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
    "country.kn": "セントクリストファー・ネーヴィス",
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
    "country.pf": "仏領ポリネシア",
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
    "country.tf": "仏領南方・南極地域",
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
    "country.vg": "英領ヴァージン諸島",
    "country.vi": "米領ヴァージン諸島",
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

    // Emails: each is a subject and the whole of its markup body. Placeholders
    // such as {link}, {site}, {siteName}, {emailFromName} and the button colours
    // are kept exactly.

    "Email.ConfirmAddress.subject":
      "{siteName}のメールアドレスを確認してください",
    "Email.ConfirmAddress.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントを作成していただき、ありがとうございます。<br />
    アカウントをご利用になる前に、下のボタンを押してメールアドレスを確認してください。
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
    ボタンが使えない場合は、次のリンクをブラウザで開いてメールアドレスを確認することもできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    このアカウントを作成した覚えがない場合は、このメールを無視してかまいません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "{siteName}のメールアドレス確認用の新しいリンク",
    "Email.ConfirmAddressAgain.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のメールアドレス確認メールの再送を依頼されました。<br />
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
    ボタンが使えない場合は、次のリンクをブラウザで開いてメールアドレスを確認することもできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    確認が済むと、アカウントを中断なくご利用いただけます。
</p>

<p>
    このメールを依頼した覚えがない場合は、無視してかまいません。
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
    どなたかが、このメールアドレスで<strong>{siteName}</strong>に登録しようとしました。このアドレスにはすでにアカウントがあります。アカウントの内容は何も変わっていません。<br />
    ご本人の場合は、すでにアカウントがありますので、サインインできます。
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
    ご本人でない場合は、何もする必要はありません。アカウントに入る手段は誰にも与えられていません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "{siteName}のアカウントをこのアドレスへ移行する確認",
    "Email.ConfirmNewEmailAddress.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにサインインしている方が、そのアカウントをこのメールアドレスに移行するよう依頼しました。ご本人の場合は、そのアカウントにサインインした状態で、ここから確認してください。リンクは24時間有効です。
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
    または、次のアドレスをブラウザにコピーしてください。<br />
    {link}
</p>

<p>
    ご本人でない場合は、何もする必要はありません。このアドレスにアカウントは移行されません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "どなたかがあなたのメールアドレスへのアカウント移行を依頼しました",
    "Email.AlreadyHasAnAccount.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにサインインしている方が、そのアカウントをこのメールアドレスに移行するよう依頼しましたが、このアドレスにはすでに別のアカウントがあります。何も移行されておらず、あなたのアカウントの内容も変わっていません。
</p>

<p>
    ご本人の場合は、このアドレスにすでにアカウントがありますので、サインインできます。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "{siteName}のアカウントを移行しました",
    "Email.EmailAddressChanged.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントを、別のメールアドレス（{emailAddress}）に移行しました。今後はそのアドレスでサインインします。
</p>

<p>
    ご本人でない場合は、ほかの誰かがあなたのアカウントを使っています。このメールに返信してお知らせください。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "{siteName}のパスワードを変更しました",
    "Email.PasswordChanged.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントのパスワードを変更しました。サインインしていたほかのブラウザはすべてサインアウトされました。<br />
    ご本人の場合は、何もする必要はありません。
</p>

<p>
    ご本人でない場合は、ほかの誰かがあなたのパスワードを知っています。ここから新しいパスワードを設定すると、その人はサインアウトされます。
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

    "Email.SetNewPassword.subject": "{siteName}の新しいパスワードを設定",
    "Email.SetNewPassword.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のパスワードの再設定が依頼されました。<br />
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
    ボタンが使えない場合は、次のリンクをブラウザで開いてパスワードを再設定することもできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    パスワードの再設定を依頼した覚えがない場合は、このメールを無視してかまいません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "{siteName}のパスワードを設定",
    "Email.SetPassword.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントにはパスワードがなく、Googleでサインインしています。<br />
    メールアドレスとパスワードでもサインインできるように、パスワードの設定を依頼されました。
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
    ボタンが使えない場合は、次のリンクをブラウザで開いてパスワードを設定することもできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    リンクは1時間有効です。パスワードの設定を依頼した覚えがない場合は、このメールを無視してかまいません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "このメールアドレスの{siteName}アカウントはありません",
    "Email.RegisterInstead.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントに関連付けられていないメールアドレスについて、パスワードの再設定が依頼されました。
</p>

<p>
    サービスをご利用になりたい場合は、次のページから新しいアカウントを作成できます。<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    この依頼をした覚えがない場合は、このメールを無視してかまいません。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject": "{siteName}のアカウント削除の確認",
    "Email.ConfirmForgetting.body": `
<p>こんにちは。</p>

<p>
    <strong>{siteName}</strong>のアカウントの削除が依頼されました。<br />
    下のボタンを押すと、削除の内容を確認し、本当に削除するかどうかを選べます。
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
    ボタンが使えない場合は、次のリンクをブラウザで開くこともできます。<br />
    <a href="{link}">{link}</a>
</p>

<p>
    削除すると、お名前とメールアドレスは誰にも二度と読み取れなくなり、アカウントにサインインできなくなります。元に戻すことはできません。
</p>

<p>
    リンクは1回だけ使え、依頼から15分間有効で、このアカウントにサインインしている間だけ使えます。それ以降は、アカウントからもう一度依頼してください。
</p>

<p>
    依頼した覚えがない場合は、リンクを開かない限り何も起こりません。ただし、あなたのアカウントにサインインしている方が依頼したことになりますので、パスワードをお忘れの方のページから新しいパスワードを設定し、その人が再びサインインできないようにしてください。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "新規登録を停止中：{service}に接続できません",
    "Email.RegistrationsSuspended.body": `
<p>こんにちは。</p>

<p>
    {siteName}は{when}に{service}に接続できませんでした。応答が戻るまで、登録や新しいパスワードの設定にそれが必要な閲覧者には、しばらくしてからもう一度お試しいただくよう案内しています。
</p>

<p>
    対応は必要ありません。試行のたびに{service}へ改めて問い合わせるため、応答が戻りしだい各ページは再び使えるようになります。
</p>

<p>
    {service}が停止している間、これについてのメールは1時間に1通までです。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName}がデータベースに接続できません",
    "Email.DatabaseUnreachable.body": `
<p>こんにちは。</p>

<p>
    {siteName}は{when}にデータベースに接続できませんでした。応答が戻るまで、データベースが必要なページはすべて、サイトが利用できないのでしばらくしてからもう一度お試しいただくよう閲覧者に案内します。
</p>

<p>
    対応は必要ありません。リクエストのたびに接続を改めて試みるため、データベースの応答が戻りしだいサイトは再び使えるようになります。
</p>

<p>
    データベースが停止している間、これについてのメールは{minutes}分に1通までです。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName}でリクエストが失敗しました",
    "Email.UnhandledError.body": `
<p>こんにちは。</p>

<p>
    {siteName}は{when}に、{asked}へのリクエストで失敗しました。閲覧者には参照番号{reference}を表示しており、原因はログのその番号の下にあります。
</p>

<p>
    サイトが壊れていると、ほぼすべてのリクエストが失敗しがちです。そのため、失敗についてのメールは1時間に4通までです。それ以降の失敗も、ログには記録されます。
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
