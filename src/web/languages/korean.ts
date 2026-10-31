// The site's words in Korean, written fresh rather than translated line by line.
// The reader is addressed politely, in the 해요 style ("입력해 주세요"), and
// never by name. Menu and button items have no capitals to give, so they are
// written plainly as nouns or short verb phrases. Terms settled on: 이메일 주소
// (email address), 비밀번호 (password), 로그인 / 로그아웃 (sign in / out), 가입
// (register), 대회 (tournament), 부문 (a competition within one), 경기 (a
// game), 매치 (a match), 후프 (hoop), 대회 운영자 (manager), 기록원 (scorer),
// 사이트 관리자 (administrator) and 부전승 (bye). The word “Bye” itself stays in
// English in the messages about naming a player, since the site checks for it.
// Emails use the more formal 합니다 style; the pages use 해요.
import type { Language } from "../common/language.js";

export const korean: Language = {
  tag: "ko",
  name: "한국어",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "본문으로 건너뛰기",
    "navigation.menu": "메뉴",
    "navigation.label": "주 메뉴",
    "navigation.home": "홈",
    "navigation.help": "도움말",
    "navigation.admin": "관리",
    "sections.label": "섹션",
    "theme.label": "테마",
    "theme.light": "밝게",
    "theme.dark": "어둡게",
    "theme.system": "시스템 설정",
    "footer.donate": "기부하기",
    "footer.plea":
      "{siteName}, 즐겁게 이용하고 계신가요? 앞으로의 개발을 위해 기부해 주세요.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "개인정보 처리",
    "footer.termsOfUse": "이용 약관",
    "footer.reportBug": "버그 신고",
    "beta.banner":
      "이곳은 베타 사이트예요. 데이터는 언제든 초기화될 수 있어요.",
    "privacy.contact":
      "이 페이지나 보관 중인 내 정보에 관한 문의: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "이용 약관에 동의합니다",
    "termsOfUse.link": "이용 약관",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "작성된 내용을 신고하거나 이 약관에 관해 문의: {emailAddress}",
    "TermsOfUse.NotAgreed": "이용 약관에 동의하려면 체크 상자를 선택해 주세요.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "이곳은 {siteName}을 안전하게 익혀 볼 수 있는 연습 공간이에요. 여기에 입력한 내용은 언제든 삭제될 수 있어요.",

    "language.label": "언어",
    "language.choose": "변경",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "새로 읽을 소식이 있어요.",
    "whatsNew.admin.message": "대회를 운영하는 분들을 위한 새 소식이 있어요.",
    "whatsNew.view": "새 소식 보기",
    "whatsNew.later": "다음에 다시 알림",
    "whatsNew.never": "이 알림을 다시 표시하지 않기",

    "form.otherwise":
      "입력한 내용에 문제가 있어요. 내용을 확인하고 다시 시도해 주세요.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "계정",
    "account.register": "가입",
    "account.signIn": "로그인",
    "account.forgotPassword": "비밀번호 찾기",
    "account.signOut": "로그아웃",
    "account.profile": "프로필",
    "account.changePassword": "비밀번호 변경",
    "account.changeEmailAddress": "이메일 주소 변경",
    "account.changeName": "이름 변경",
    "account.setPassword": "비밀번호 설정",
    "account.forgetAccount": "계정 잊기",

    "register.title": "가입",
    "register.emailAddress": "이메일 주소",
    "register.submit": "가입",
    "register.withGoogle": "Google로 가입",
    "register.or": "또는",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google이 이 이메일 주소가 본인 것임을 확인하지 않아서 여기서는 Google로 이용할 수 없어요. 아래에서 이메일 주소를 사용해 주세요.",
    "SignInWithGoogle.LinkedToAnother":
      "이 이메일 주소로 만든 계정이 이미 있고, 다른 Google 계정과 연결되어 있어요. 그 Google 계정으로 로그인하거나, 이메일 주소와 비밀번호로 로그인해 주세요.",
    "SignInWithGoogle.NameMissing":
      "Google에서 이름을 받지 못했는데, 계정에는 이름이 필요해요. 아래에서 이메일 주소를 사용해 주세요.",
    "Google.Unreachable":
      "지금은 Google에 연결할 수 없어요. 몇 분 후에 다시 시도하거나, 아래에서 이메일 주소를 사용해 주세요.",
    "Registration.NotAPerson":
      "사람이 보낸 요청으로 보이지 않아요. 다시 시도해 주세요. 계속 같은 일이 생기면 몇 분 기다렸다가 다시 와 주세요.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "이메일 주소를 입력해 주세요.",
    "EmailAddress.NoAt": "이메일 주소에는 @가 있어야 해요.",
    "EmailAddress.MoreThanOneAt": "이메일 주소에는 @가 하나만 있어야 해요.",
    "EmailAddress.NoDomain":
      "이메일 주소에는 @ 뒤에 example.com 같은 도메인이 있어야 해요.",

    "welcome.title": "이메일을 확인해 주세요",
    "welcome.checkEmail":
      "입력하신 주소로 이메일을 보냈어요. 이메일에 있는 링크를 눌러 계속 진행해 주세요.",
    "welcome.nothingArrived":
      "몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "welcome.home": "{siteName}(으)로 돌아가기",
    "newConfirmationLink.title": "새 링크 받기",
    "newConfirmationLink.explanation":
      "이메일 주소를 확인하는 링크가 만료되었어요. 새 링크를 요청하시면 가입할 때 쓴 주소로 보내 드려요.",
    "newConfirmationLink.send": "새 링크 보내기",
    "newConfirmationLink.home": "{siteName}(으)로 돌아가기",
    "newConfirmationLink.signIn": "로그인",
    "newConfirmationLink.sent.title": "이메일을 확인해 주세요",
    "newConfirmationLink.sent.explanation":
      "새 링크를 보냈어요. 링크를 눌러 이메일 주소를 확인해 주세요. 몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "newConfirmationLink.alreadyConfirmed.title": "이미 확인된 이메일 주소예요",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "더 확인할 것이 없어요. 확인할 때 정한 비밀번호로 로그인해 주세요.",
    "newConfirmationLink.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "newConfirmationLink.noLongerWorks.explanation":
      "이메일에 있는 링크를 끝까지 빠짐없이 눌렀는지 확인해 주세요. 그래도 안 되면 다시 가입해 주세요. 새 링크를 보내 드려요.",
    "newConfirmationLink.tooMany.title": "나중에 다시 시도해 주세요",
    "newConfirmationLink.tooMany.explanation":
      "최근 이 주소로 링크를 여러 번 보냈어요. 한 시간 뒤에 다시 요청해 주시고, 그동안 스팸 메일함도 확인해 보세요.",

    "forgotPassword.title": "비밀번호를 잊으셨나요?",
    "forgotPassword.emailAddress": "이메일 주소",
    "forgotPassword.submit": "다시 들어오는 방법 보내기",
    "forgotPassword.home": "{siteName}(으)로 돌아가기",
    "forgotPassword.sent.title": "이메일을 확인해 주세요",
    "forgotPassword.sent.explanation":
      "해당 주소로 만든 계정이 있다면 새 비밀번호를 설정하는 링크를 보냈어요. 한 시간 안에 링크를 눌러 주세요. 몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "forgotPassword.tryAgainLater":
      "최근 이곳에서 너무 많이 요청했어요. 한 시간 뒤에 다시 시도해 주세요.",

    "setNewPassword.title": "새 비밀번호 설정",
    "setNewPassword.password": "비밀번호",
    "setNewPassword.confirmPassword": "비밀번호 확인",
    "setNewPassword.submit": "새 비밀번호 설정",
    "setNewPassword.home": "{siteName}(으)로 돌아가기",
    "setNewPassword.signIn": "로그인",
    "setNewPassword.askAgain": "새 링크 요청",
    "setNewPassword.changed.title": "비밀번호가 변경되었어요",
    "setNewPassword.changed.explanation":
      "로그인되어 있던 모든 곳에서 로그아웃되었어요. 새 비밀번호로 로그인해 주세요.",
    "setNewPassword.expired.title": "링크가 만료되었어요",
    "setNewPassword.expired.explanation":
      "새 비밀번호를 설정하는 링크는 한 시간 동안만 쓸 수 있어요. 새 링크를 요청하시면 같은 주소로 보내 드려요.",
    "setNewPassword.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "setNewPassword.noLongerWorks.explanation":
      "이미 사용했거나 링크 끝이 일부 빠졌을 수 있어요. 아직 필요하면 새 링크를 요청해 주세요.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "지금은 비밀번호를 확인할 수 없어서 변경되지 않았어요. 몇 분 후에 다시 시도해 주세요. 링크는 만료되기 전까지 계속 쓸 수 있어요.",

    "forgetAccount.title": "계정 잊기",
    "forgetAccount.explanation":
      "이름과 이메일 주소를 영구히 읽을 수 없게 만들고 계정을 닫을 수 있어요. 본인이 맞는지 확인하기 위해 먼저 계정의 주소로 링크를 보내 드리며, 그 링크를 누르기 전에는 아무것도 지워지지 않아요.",
    "forgetAccount.submit": "링크 보내기",
    "forgetAccount.sent.title": "이메일을 확인해 주세요",
    "forgetAccount.sent.explanation":
      "계정의 주소로 링크를 보냈어요. 링크는 15분 동안, 이 계정에 로그인해 있는 동안에만 쓸 수 있어요.",
    "forgetAccount.confirm.title": "계정을 영구히 잊을까요?",
    "forgetAccount.confirm.explanation":
      "계정을 잊으면 이름과 이메일 주소는 누구도 다시 읽을 수 없고, 이 계정으로는 로그인할 수 없어요. 되돌릴 수 없어요.",
    "forgetAccount.confirm.submit": "내 계정 잊기",
    "forgetAccount.forgotten.title": "계정을 잊었어요",
    "forgetAccount.forgotten.explanation":
      "이름과 이메일 주소를 더 이상 읽을 수 없고, 로그인되어 있던 모든 곳에서 로그아웃되었어요.",
    "forgetAccount.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "forgetAccount.noLongerWorks.explanation":
      "링크가 만료되었거나, 이미 사용했거나, 지금 로그인한 계정의 링크가 아닐 수 있어요. 계정을 계속 잊고 싶다면 계정에서 다시 요청해 주세요.",
    "forgetAccount.lastAdministrator.title": "계정을 잊을 수 없어요",
    "forgetAccount.lastAdministrator.explanation":
      "회원님은 이 사이트의 유일한 사이트 관리자예요. 다른 사람에게 사이트 관리자 역할을 준 다음에 계정을 잊을 수 있어요.",
    "forgetAccount.askAgain": "다시 요청",
    "forgetAccount.home": "{siteName}(으)로 돌아가기",

    "registrationsSuspended.title": "지금은 가입을 받지 않아요",
    "registrationsSuspended.explanation":
      "가입에 필요한 서비스에 지금 연결할 수 없어서, 다시 응답할 때까지 아무도 가입할 수 없어요. 입력하신 내용은 저장되지 않았어요.",
    "registrationsSuspended.tryAgainLater":
      "잠시 후에 다시 시도해 주세요. 사이트 관리자에게 알렸어요.",
    "registrationsSuspended.home": "{siteName}(으)로 돌아가기",

    "signIn.title": "로그인",
    "signIn.emailAddress": "이메일 주소",
    "signIn.password": "비밀번호",
    "signIn.submit": "로그인",
    "signIn.forgotPassword": "비밀번호 찾기",
    "signIn.register": "가입",
    "signIn.withGoogle": "Google로 로그인",
    "signIn.or": "또는",
    "signIn.tryAgainLater":
      "최근 시도 횟수가 너무 많아요. 한 시간 뒤에 다시 시도해 주세요.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "이메일 주소 또는 비밀번호가 올바르지 않아요. 다시 시도해 주세요.",

    "profile.title": "프로필",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "이름:",
    "profile.emailAddress": "이메일 주소:",

    "changeName.title": "이름 변경",
    "changeName.name": "이름",
    "changeName.submit": "이름 변경",

    "setPassword.title": "비밀번호 설정",
    "setPassword.explanation":
      "이 계정에는 비밀번호가 없고 Google로 로그인하고 있어요. 비밀번호로도 로그인할 수 있도록, 비밀번호를 설정하는 링크를 {emailAddress}(으)로 보내 드릴게요.",
    "setPassword.submit": "링크 보내기",
    "setPassword.sent.title": "이메일을 확인해 주세요",
    "setPassword.sent.explanation":
      "비밀번호를 설정하는 링크를 보냈어요. 링크는 한 시간 동안 쓸 수 있어요.",
    "setPassword.profile": "프로필로 돌아가기",

    "changePassword.title": "비밀번호 변경",
    "changePassword.currentPassword": "현재 비밀번호",
    "changePassword.password": "새 비밀번호",
    "changePassword.passwordConfirmation": "비밀번호 확인",
    "changePassword.forgotPassword": "비밀번호 찾기",
    "changePassword.submit": "비밀번호 변경",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "비밀번호가 맞지 않아요.",

    "changeEmailAddress.title": "이메일 주소 변경",
    "changeEmailAddress.emailAddress": "새 이메일 주소",
    "changeEmailAddress.currentPassword": "현재 비밀번호",
    "changeEmailAddress.submit": "확인 링크 보내기",
    "changeEmailAddress.sent.title": "이메일을 확인해 주세요",
    "changeEmailAddress.sent.explanation":
      "계정 이전을 확인하는 링크를 새 이메일 주소로 보냈어요. 로그인한 상태에서 링크를 눌러 계정을 옮겨 주세요.",
    "changeEmailAddress.confirm.title": "계정 이전",
    "changeEmailAddress.confirm.explanation":
      "계정이 {emailAddress}(으)로 옮겨져요. 앞으로는 그 주소로 로그인하게 돼요.",
    "changeEmailAddress.confirm.submit": "내 계정 옮기기",
    "changeEmailAddress.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "changeEmailAddress.noLongerWorks.explanation":
      "링크가 만료되었거나, 이미 사용했거나, 지금 로그인한 계정을 위해 보낸 링크가 아니에요. 프로필에서 다시 요청해 주세요.",
    "changeEmailAddress.taken.title": "계정이 옮겨지지 않았어요",
    "changeEmailAddress.profile": "프로필로 돌아가기",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "비밀번호가 맞지 않아요.",
    "ChangeEmailAddress.Unchanged": "계정이 이미 이 주소로 되어 있어요.",
    "ChangeEmailAddress.Taken":
      "그 이메일 주소로 이미 다른 계정이 만들어져서, 내 계정을 옮길 수 없어요.",

    "confirmEmailAddress.title": "이메일 주소 확인",
    "confirmEmailAddress.name": "이름",
    "confirmEmailAddress.password": "비밀번호",
    "confirmEmailAddress.confirmPassword": "비밀번호 확인",
    "confirmEmailAddress.submit": "이메일 주소 확인",
    "confirmEmailAddress.signIn": "로그인",
    "confirmEmailAddress.home": "{siteName}(으)로 돌아가기",
    "confirmEmailAddress.confirmed.title": "이메일 주소가 확인되었어요",
    "confirmEmailAddress.confirmed.explanation":
      "계정이 준비되었어요. 방금 입력한 이메일 주소와 비밀번호로 로그인해 주세요.",
    "confirmEmailAddress.expired.title": "링크가 만료되었어요",
    "confirmEmailAddress.expired.explanation":
      "이메일 주소를 확인하는 링크는 24시간 동안만 쓸 수 있어요. 새 링크를 요청하시면 같은 주소로 보내 드려요.",
    "confirmEmailAddress.expired.newLink": "새 링크 보내기",
    "confirmEmailAddress.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "confirmEmailAddress.noLongerWorks.explanation":
      "이메일에 있는 링크를 끝까지 빠짐없이 눌렀는지 확인해 주세요. 그래도 안 되면 다시 가입해 주세요. 새 링크를 보내 드려요.",
    "confirmEmailAddress.alreadyConfirmed.title": "이미 확인된 이메일 주소예요",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "더 할 일은 없어요. 확인할 때 정한 비밀번호로 로그인해 주세요.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "이름을 입력해 주세요.",
    "PersonName.TooShort": "이름은 3자 이상이어야 해요.",
    "PersonName.TooLong": "이름은 254자 이하여야 해요.",
    "WorldRankingName.TooShort": "세계 랭킹 이름은 3자 이상이어야 해요.",
    "WorldRankingName.TooLong": "세계 랭킹 이름은 254자 이하여야 해요.",
    "Password.Missing": "비밀번호를 입력해 주세요.",
    "Password.TooShort": "비밀번호는 12자 이상이어야 해요.",
    "Password.ConfirmationDiffers":
      "위의 비밀번호와 같지 않아요. 다시 입력해 주세요.",
    "Password.Breached":
      "이 비밀번호는 다른 곳에서 일어난 데이터 유출에 나온 적이 있어서 여기서 쓰기에 안전하지 않아요. 다른 비밀번호를 정해 주세요.",

    "javaScriptRequired.title": "스크립트가 필요해요",
    "javaScriptRequired.explanation":
      "가입하려면 이 사이트에서 스크립트(JavaScript)를 켜야 해요. 가입하는 쪽이 사람인지 확인하기 위해서예요. 스크립트를 켠 다음 다시 가입해 주세요.",
    "javaScriptRequired.register": "가입으로 돌아가기",
    "javaScriptRequired.home": "{siteName}(으)로 돌아가기",

    "errors.backHome": "{siteName}(으)로 돌아가기",
    "errors.notFound": "찾을 수 없어요",
    "errors.refused": "처리할 수 없었어요",
    "errors.refusedDetail": "보낸 내용에 문제가 있어요.",
    "errors.sorry": "죄송해요",
    "errors.sorryDetail": "요청을 처리할 수 없었어요.",
    "errors.failed": "문제가 생겼어요",
    "errors.reference": "참조 번호 {reference}.",
    "errors.recorded":
      "오류를 기록했고 사이트 관리자에게 이메일을 보냈어요. 사이트 관리자에게 참조 번호와 어떤 작업을 하고 있었는지 적어 이메일을 보내 주시면 도움이 돼요.",
    "errors.message": "사이트 관리자에게 이메일 보내기",
    "errors.messageSubject": "{siteName}의 오류 {reference}",
    "errors.messageBody": "이 일이 생겼을 때 하고 있던 작업:\n\n",
    "errors.unavailable": "사이트를 이용할 수 없어요",
    "errors.unavailableDetail":
      "지금은 사이트가 필요한 것에 연결할 수 없어요. 나중에 다시 시도해 주세요.",
    "errors.maintenance": "사이트가 점검 중이에요.",
    "errors.maintenanceMinutes": "{minutes}분 후에 다시 열릴 예정이에요.",
    "errors.maintenanceMinute": "1분 후에 다시 열릴 예정이에요.",
    "errors.maintenanceLonger":
      "예상보다 오래 걸리고 있어요. 곧 다시 열릴 거예요.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "최근 결과",
    "home.recentResults.none": "최근 7일 동안 추가된 경기가 없어요.",
    "home.upcomingTournaments": "예정된 대회",
    "home.upcomingTournaments.none": "앞으로 60일 안에 시작하는 대회가 없어요.",
    "home.allTournaments": "{year}년 전체 대회",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "{year}년 대회",
    "year.none": "{year}년에 시작하는 대회가 없어요.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "{year}년 {sport} 대회",
    "yearSport.none": "{year}년에 시작하는 {sport} 대회가 없어요.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "최근",
    "tournament.summary": "요약",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "각 매치는 {count}판 다승제예요.",
    "test.vs": "대",
    "test.matches": "매치",
    "test.games": "게임",
    "test.hoops": "후프",
    "teamSummary.tests": "테스트",
    "teamSummary.matches": "매치",
    "teamSummary.games": "게임",
    "teamSummary.hoops": "후프",
    "teamSummary.wins": "승",
    "teamSummary.losses": "패",
    "teamSummary.draws": "무",
    "teamSummary.for": "득",
    "teamSummary.against": "실",
    "teamSummary.net": "차",
    "tournament.players": "선수",
    "search.label": "검색",
    "search.tournaments": "대회",
    "search.competitions": "부문",
    "search.nothingFound": "찾은 것이 없어요.",
    "players.search.label": "선수 검색",
    "players.search.prompt": "선수를 찾으려면 이름을 입력해 주세요.",
    "players.search.none": "찾은 선수가 없어요.",
    "search.more":
      "처음 {count}개만 표시했어요. 이름을 더 입력해서 범위를 좁혀 보세요.",
    "websitePlayer.tournament": "대회",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} 대 {second}",
    "tournament.notes": "공지",
    "tournament.commentary": "해설",
    "tournament.beat": "승",
    "tournament.drewWith": "무승부",
    "tournament.ago.seconds": "{count}초",
    "tournament.ago.minutes": "{count}분",
    "tournament.ago.hour": "1시간",
    "tournament.ago.hours": "{count}시간",
    "tournament.none": "아직 진행된 경기가 없어요.",
    // A tournament's players' page, when it has none.
    "players.none": "아직 추가된 선수가 없어요.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "작성:",
    "commentaries.start": "새 해설 시작",
    // The page that starts a commentary.
    "startCommentary.title": "새 해설 시작",
    "startCommentary.titleField": "제목",
    "startCommentary.submit": "해설 시작",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "새 글",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "운영자가 작성한 공지가 아직 없어요.",
    "note.edited": "수정됨",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "아직 작성된 댓글이 없어요.",
    "commentary.edited": "수정됨",
    "commentary.edit": "수정",
    "commentary.delete": "삭제",
    "commentary.comment": "댓글",
    "commentary.add": "댓글 추가",
    "commentary.notSent":
      "댓글을 보내지 못했어요. 페이지를 새로 불러와서 저장되었는지 확인해 주세요.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "제목 변경",
    "changeCommentaryTitle.submit": "저장",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "댓글 수정",
    "editComment.save": "저장",
    "deleteComment.title": "댓글 삭제",
    "deleteComment.question": "이 댓글을 삭제할까요? 되돌릴 수 없어요.",
    "deleteComment.confirm": "댓글 삭제",
    "deleteComment.keep": "그대로 두기",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "경기",
    "player.competitions": "부문",
    "player.beat": "승",
    "player.lostTo": "패",
    "player.drewWith": "무승부",
    "player.score": "{score} 대 {opponent}",
    "player.noGames": "아직 진행된 경기가 없어요.",
    "player.noCompetitions": "아직 참가한 부문이 없어요.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "승",
    "block.matches": "매치",
    "block.netGames": "게임 득실차",
    "block.games": "게임",
    "block.netHoops": "후프 득실차",
    "block.won": "승",
    "block.lost": "패",
    "block.drawn": "무",
    "block.withdrawn": "기권",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "기권",
    "block.losses": "패",
    // The three views of a block, offered beneath its heading.
    "competition.views": "보기",
    "competition.view.grid": "대진표",
    "competition.view.summary": "요약",
    "competition.view.orderOfPlay": "경기 순서",
    "competition.print": "인쇄",
    "blockSummary.ranking":
      "매치 승률 순으로, 같으면 후프 득실차 순으로 순위를 매겼어요. 대회 자체 규정에 따라 순위가 다를 수 있어요.",
    "orderOfPlay.none": "아직 진행된 경기가 없어요.",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "결승",
    "knockout.round.semis": "준결승",
    "knockout.round.quarters": "8강",
    "knockout.round.number": "{number}라운드",
    "knockout.bye": "부전승",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "게임",
    "swiss.wins": "승",
    "swiss.winShare": "승률",
    "swiss.results": "결과",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "이후 라운드",
    "knockout.back": "이전 라운드",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "날짜",
    "tournamentList.column.name": "이름",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "{country}의 대회만 보기",
    "tournamentList.filter.country": "국가",
    "tournamentList.filter.anyCountry": "모든 국가",
    "tournamentList.filter.region": "지역",
    "tournamentList.filter.anyRegion": "모든 지역",
    "tournamentList.filter.noRegionsBefore":
      "2026년 11월 이전 대회에는 지역 정보가 없어요.",
    "tournamentList.filter.sport": "종목",
    "tournamentList.filter.anySport": "모든 종목",
    "tournamentList.filter.submit": "적용",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "연도",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "이전 연도",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message": "이 사이트의 새 버전이 있어요.",
    "admin.newerBuild.reload": "새로고침",
    "admin.title": "관리",
    "admin.tournaments.new": "새 대회",
    "admin.tournaments.none": "대회가 없어요",
    "admin.tournaments.filter.none": "조건에 맞는 대회가 없어요",
    "admin.tournaments.show": "표시",
    "admin.tournaments.managerScorer": "관리자/기록원",
    "admin.tournaments.worldRanking": "세계 랭킹",
    "admin.tournaments.notWorldRanking": "세계 랭킹 제외",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "보관됨",
    "admin.tournaments.manage": "운영",
    "admin.tournaments.edit": "수정",
    "admin.tournaments.archive": "보관",
    "admin.tournaments.restore": "복원",
    "admin.tournaments.scores": "점수",
    "admin.tournaments.players": "선수",
    "admin.years.label": "연도",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "이전 연도",
    "admin.tournament.name": "이름",
    "admin.tournament.starts": "시작일",
    "admin.tournament.finishes": "종료일",
    "admin.tournament.format": "방식",
    "admin.tournament.sport": "종목",
    "admin.tournament.country": "국가",
    "admin.tournament.region": "지역",
    "admin.tournament.subtitle": "부제",
    "admin.rules.handicap": "핸디캡 적용",
    "admin.rules.drawsAllowed": "무승부 허용",
    "admin.tournament.levelTestsDrawn": "동점 테스트는 무승부 처리",
    "admin.rules.worldRankings": "세계 랭킹에 반영",
    "admin.tournament.national": "국내 대회",
    "admin.tournament.international": "국제 대회",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "이대로는 받아들일 수 없어요.",
    "admin.newTournament.title": "새 대회",
    "admin.newTournament.submit": "대회 만들기",
    "admin.editTournament.title": "대회 수정",
    "admin.editTournament.submit": "대회 업데이트",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "이 대회는 변경할 수 없어요.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "대회",
    "admin.view.players": "선수",
    "admin.view.competitions": "부문",
    "admin.view.managers": "운영자",
    "admin.view.notes": "공지",
    "admin.view.scorers": "기록원",
    "admin.view.rankings": "랭킹",
    "admin.rankings.file":
      "세계 랭킹은 이 대회의 결과를 이 기능으로 가져가므로, 운영자가 따로 할 일은 없어요.",
    "admin.rankings.download": "세계 랭킹용 경기 내려받기",
    "rankings.notAvailable": "랭킹을 사용할 수 없어요",
    "rankings.notAvailable.sport":
      "이 대회의 종목에는 세계 랭킹이 없어서 보낼 랭킹도 없어요.",
    "rankings.notAvailable.notCounted":
      "이 대회의 부문 중 세계 랭킹에 반영되는 것이 없어요.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "여기서는 이 대회를 운영할 수 없어요.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "부문",
    "admin.competitionView.players": "선수",
    "admin.competitionView.scores": "점수",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "대회와 그 부문",
    "admin.sections.tournament": "대회",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "사이트 관리자 페이지",
    "admin.administrator.sections.tournaments": "대회",
    "admin.administrator.sections.accounts": "계정",
    "admin.administrator.sections.worldRankings": "세계 랭킹",
    "admin.administrator.sections.importErrors": "가져오기 오류",
    "admin.administrator.sections.logs": "로그",
    "admin.administrator.sections.databaseStatus": "데이터베이스 접근",
    "admin.administrator.sections.countries": "국가",
    "admin.databaseStatus.title": "데이터베이스 접근",
    "admin.databaseStatus.on": "데이터베이스 접근이 켜져 있어요.",
    "admin.databaseStatus.off": "데이터베이스 접근이 꺼져 있어요.",
    "admin.databaseStatus.expected":
      "사이트는 {minutes}분 후에 복구될 예정이에요.",
    "admin.databaseStatus.expectedOne": "사이트는 1분 후에 복구될 예정이에요.",
    "admin.databaseStatus.longer": "예상보다 오래 걸리고 있어요.",
    "admin.databaseStatus.told": "방문자에게 표시되는 안내: {words}",
    "admin.databaseStatus.toldUsual": "방문자에게는 기본 문구가 표시돼요.",
    "admin.databaseStatus.minutes": "예상 시간(분)",
    "admin.databaseStatus.words": "방문자에게 보일 문구",
    "admin.databaseStatus.turnOff": "끄기",
    "admin.databaseStatus.change": "변경",
    "admin.databaseStatus.turnOn": "켜기",
    "admin.databaseStatus.minutesNeeded": "시간(분)을 입력해야 해요.",
    "admin.databaseStatus.otherwise": "사이트에 문제가 생겼어요.",
    "DatabaseAccess.MinutesNotWhole": "분은 정수여야 해요.",
    "DatabaseAccess.MinutesOutOfRange": "분은 1에서 1440 사이여야 해요.",
    "DatabaseAccess.WordsTooLong": "문구는 500자를 넘을 수 없어요.",
    "DatabaseAccess.NotOff": "데이터베이스 접근이 꺼져 있지 않아요.",
    "admin.administrator.title": "사이트 관리자",
    // The accounts page, a section for each role.
    "admin.accounts.title": "계정",
    "admin.roles.add": "추가",
    "admin.roles.administrator.heading": "사이트 관리자",
    "admin.roles.administrator.none": "다른 사이트 관리자가 없어요",
    "admin.roles.administrator.removeTitle": "사이트 관리자 제거",
    "admin.roles.administrator.removeExplanation":
      "{name}님은 더 이상 이 사이트의 사이트 관리자가 아니게 돼요.",
    "admin.roles.ac-world-ranking-officer.heading":
      "어소시에이션 크로케 세계 랭킹 담당자",
    "admin.roles.ac-world-ranking-officer.none":
      "어소시에이션 크로케 세계 랭킹 담당자가 없어요",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "어소시에이션 크로케 세계 랭킹 담당자 제거",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name}님은 더 이상 어소시에이션 크로케 세계 랭킹 담당자가 아니게 돼요.",
    "admin.roles.gc-world-ranking-officer.heading":
      "골프 크로케 세계 랭킹 담당자",
    "admin.roles.gc-world-ranking-officer.none":
      "골프 크로케 세계 랭킹 담당자가 없어요",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "골프 크로케 세계 랭킹 담당자 제거",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name}님은 더 이상 골프 크로케 세계 랭킹 담당자가 아니게 돼요.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "세계 랭킹 선수 가져오기",
    "admin.worldRankings.import": "가져오기",
    "admin.worldRankings.log": "가져오기 경과",
    "admin.worldRankings.ac.reading": "어소시에이션 크로케 목록을 읽는 중",
    "admin.worldRankings.ac.read": "읽은 어소시에이션 크로케 선수: {players}",
    "admin.worldRankings.ac.kept": "유지한 어소시에이션 크로케 선수: {players}",
    "admin.worldRankings.ac.refused":
      "어소시에이션 크로케 목록을 읽지 못해서 선수는 그대로 두었어요.",
    "admin.worldRankings.gc.reading": "골프 크로케 목록을 읽는 중",
    "admin.worldRankings.gc.read": "읽은 골프 크로케 선수: {players}",
    "admin.worldRankings.gc.kept": "유지한 골프 크로케 선수: {players}",
    "admin.worldRankings.gc.refused":
      "골프 크로케 목록을 읽지 못해서 선수는 그대로 두었어요.",
    "admin.worldRankings.finished": "완료",
    "admin.worldRankings.failed": "가져오기를 끝내지 못했어요.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "사이트에 문제가 생겼어요.",
    "WorldRankingLists.Unreachable": "세계 랭킹 사이트에 연결할 수 없었어요.",
    "WorldRankingLists.Unreadable":
      "목록이 세계 랭킹의 형식과 달라요. 읽을 수 없는 줄이 있거나, 선수가 한 명도 없거나, UTF-8로 작성되지 않았어요.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "가져오기 오류",
    "admin.importErrors.none": "가져오기 오류가 없어요",
    "admin.importErrors.otherwise": "사이트에 문제가 생겼어요.",
    "admin.countries.title": "국가",
    "admin.countries.none": "목록에 없는 국가에서 열린 대회가 없어요",
    "admin.countries.oldSite": "예전 사이트",
    "admin.countries.otherwise": "사이트에 문제가 생겼어요.",
    "admin.logs.title": "로그",
    "admin.logs.severity": "심각도",
    "admin.logs.text": "검색",
    "admin.logs.show": "보기",
    "admin.logs.prune": "정리",
    "admin.logs.pruneAsk":
      "최근 한 시간 이전의 로그를 삭제할까요? 되돌릴 수 없어요.",
    "admin.logs.removed": "항목 {count}개를 삭제했어요",
    "admin.logs.none": "로그 항목이 없어요",
    "admin.logs.otherwise": "사이트에 문제가 생겼어요.",
    "admin.hover.logs.show": "조건에 맞는 항목 보기",
    "admin.hover.logs.prune": "최근 한 시간 이전의 로그 삭제",
    "admin.hover.logs.pruneAgree": "최근 한 시간 이전의 로그 삭제",
    "admin.importError.title": "가져오기 오류",
    "admin.importError.documentId": "문서 ID",
    "admin.importError.tournament": "대회",
    "admin.importError.competition": "부문",
    "admin.importError.newSite": "새 사이트",
    "admin.importError.oldSite": "이전 사이트",
    "ImportErrorKept.NotFound": "그 문서에 대해 보관된 가져오기 오류가 없어요.",
    "admin.competitionView.otherwise": "여기서는 이 부문을 운영할 수 없어요.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "블록",
    "admin.competitions.knockout": "녹아웃",
    "admin.competitions.swiss": "스위스",
    "admin.competitions.view": "보기",
    "admin.competitions.edit": "수정",
    "admin.competitions.up": "위로",
    "admin.competitions.down": "아래로",
    "admin.competitions.archive": "보관",
    "admin.competitions.restore": "복원",
    "admin.competitions.archived": "보관된 부문",
    "admin.competitions.none": "부문이 없어요",
    "admin.competitions.add": "부문 추가",
    // The competition dialog.
    "admin.competition.addTitle": "부문 추가",
    "admin.competition.editTitle": "부문 수정",
    "admin.competition.name": "이름",
    "admin.competition.kind": "종류",
    "admin.competition.bestOf": "다승제(판 수)",
    "admin.competition.rounds": "라운드 수",
    "admin.competition.places": "자리 수",
    "admin.competition.round": "{number}라운드",
    "admin.competition.bestOfs": "라운드별 판 수",
    "admin.competition.quarters": "8강",
    "admin.competition.semis": "준결승",
    "admin.competition.final": "결승",
    "admin.competition.add": "추가",
    "admin.competition.save": "저장",
    "admin.competition.added": "{name}을(를) 추가했어요.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise": "이 부문은 이대로 저장할 수 없어요.",
    "CompetitionName.Missing": "이름을 입력해 주세요.",
    "CompetitionName.TooLong": "이름은 254자 이하여야 해요.",
    "CompetitionName.NoLetterOrDigit":
      "이름에는 글자나 숫자가 하나는 있어야 해요.",
    "Tournament.KnockoutPlayerHasGames":
      "이 대진의 선수에게 경기가 있어서 자리를 바꿀 수 없어요.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "승부가 난 매치가 있는 라운드는 판 수를 더 적게 바꿀 수 없어요.",
    "Tournament.KnockoutLaterRoundHasGames":
      "이후 라운드에서 경기가 진행되었다면 그 이전 라운드는 바꿀 수 없어요.",
    "Tournament.CompetitionNameTaken":
      "이 대회의 다른 부문이 이미 그 이름을 쓰고 있어요.",
    "BestOf.NotWhole": "게임 수를 정수로 입력해 주세요.",
    "BestOf.TooSmall": "매치는 최소 1게임 다승제여야 해요.",
    "Rounds.NotWhole": "라운드 수를 정수로 입력해 주세요.",
    "Rounds.TooSmall": "블록은 최소 1라운드로 진행해야 해요.",
    "KnockoutDraw.EvenBestOf":
      "녹아웃 매치에는 승자가 있어야 하므로 홀수 게임 다승제여야 해요.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "새 대회 만들기",
    "admin.hover.tournaments.manage": "이 대회의 선수, 팀, 부문, 점수 관리",
    "admin.hover.tournaments.edit": "이 대회의 세부 정보 변경",
    "admin.hover.tournaments.scores": "이 대회의 점수 입력",
    "admin.hover.tournaments.players": "이 대회의 선수 관리",
    "admin.hover.competitions.view": "이 부문을 열어 선수와 점수를 보고 입력",
    "admin.hover.tests.view": "이 테스트를 열어 점수를 보고 입력",
    "admin.hover.teams.view": "이 팀을 열어 선수를 보고 관리",
    "admin.hover.dialog.player.add": "이 선수를 대회에 추가",
    "admin.hover.dialog.player.save": "이 선수의 변경 내용 저장",
    "admin.hover.dialog.team.add": "이 팀을 대회에 추가",
    "admin.hover.dialog.team.save": "이 팀의 변경 내용 저장",
    "admin.hover.dialog.test.add": "이 테스트를 대회에 추가",
    "admin.hover.dialog.test.save": "이 테스트의 변경 내용 저장",
    "admin.hover.dialog.competition.add": "이 부문을 대회에 추가",
    "admin.hover.dialog.competition.save": "이 부문의 변경 내용 저장",
    "admin.hover.dialog.score.add": "이 점수를 부문에 추가",
    "admin.hover.dialog.score.save": "이 점수의 정정 내용 저장",
    "admin.hover.dialog.carryForward.save": "이 선수의 결과를 이월",
    "admin.hover.dialog.tournament.new": "이 대회 만들기",
    "admin.hover.dialog.tournament.edit": "이 대회의 변경 내용 저장",
    "admin.hover.modal.cancel": "아무것도 저장하지 않고 닫기",
    "admin.hover.modal.ok": "이 메시지 닫기",
    "admin.hover.tab": "{name} 탭 보기",
    "admin.hover.tournaments.archive":
      "이 대회를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.tournaments.restore": "보관된 이 대회를 되돌리기",
    "admin.hover.players.add": "이 대회에 선수 추가",
    "admin.hover.players.edit": "이 선수의 세부 정보 변경",
    "admin.hover.players.up": "이 선수를 목록에서 위로 이동",
    "admin.hover.players.down": "이 선수를 목록에서 아래로 이동",
    "admin.hover.players.archive":
      "이 선수를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.players.restore": "보관된 이 선수를 되돌리기",
    "admin.hover.teams.add": "이 대회에 팀 추가",
    "admin.hover.teams.edit": "이 팀의 세부 정보 변경",
    "admin.hover.teams.up": "이 팀을 목록에서 위로 이동",
    "admin.hover.teams.down": "이 팀을 목록에서 아래로 이동",
    "admin.hover.teams.archive": "이 팀을 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.teams.restore": "보관된 이 팀을 되돌리기",
    "admin.hover.competitions.add": "이 대회에 부문 추가",
    "admin.hover.competitions.edit": "이 부문의 세부 정보 변경",
    "admin.hover.competitions.up": "이 부문을 목록에서 위로 이동",
    "admin.hover.competitions.down": "이 부문을 목록에서 아래로 이동",
    "admin.hover.competitions.archive":
      "이 부문을 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.competitions.restore": "보관된 이 부문을 되돌리기",
    "admin.hover.tests.add": "두 팀 사이의 테스트 추가",
    "admin.hover.tests.edit": "이 테스트의 세부 정보 변경",
    "admin.hover.tests.up": "이 테스트를 목록에서 위로 이동",
    "admin.hover.tests.down": "이 테스트를 목록에서 아래로 이동",
    "admin.hover.tests.archive":
      "이 테스트를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.tests.restore": "보관된 이 테스트를 되돌리기",
    "admin.hover.tests.toTeams": "팀 탭으로 이동해서 테스트에 필요한 팀 추가",
    "admin.hover.scores.add": "이 부문에 게임 점수 추가",
    "admin.hover.scores.edit": "이 점수 정정",
    "admin.hover.scores.archive":
      "이 점수를 보관해서 집계에서 빼요. 나중에 복원할 수 있어요",
    "admin.hover.scores.restore": "보관된 이 점수를 되돌려서 다시 집계에 넣기",
    "admin.hover.scores.withdraw": "이 점수를 목록에 두되 집계에서는 빼기",
    "admin.hover.scores.unwithdraw": "기권 처리된 이 점수를 다시 집계에 넣기",
    "admin.hover.scores.up": "이 점수를 목록에서 앞으로 이동",
    "admin.hover.scores.down": "이 점수를 목록에서 뒤로 이동",
    "admin.hover.competitionPlayers.add": "선택한 선수를 이 부문에 넣기",
    "admin.hover.competitionPlayers.up": "이 선수를 목록에서 위로 이동",
    "admin.hover.competitionPlayers.down": "이 선수를 목록에서 아래로 이동",
    "admin.hover.competitionPlayers.remove": "이 선수를 부문에서 빼기",
    "admin.hover.competitionPlayers.withdraw": "이 선수를 부문에서 기권 처리",
    "admin.hover.competitionPlayers.unwithdraw":
      "기권 처리된 이 선수를 부문에 다시 넣기",
    "admin.hover.competitionPlayers.carryForward":
      "다른 부문에서 이 선수의 결과를 이월",
    "admin.hover.notes.add": "이 대회의 새 공지 작성",
    "admin.hover.notes.edit": "이 공지 수정",
    "admin.hover.notes.delete": "이 공지 삭제",
    "admin.hover.note.add": "이 공지를 저장해서 대회에 추가",
    "admin.hover.note.save": "이 공지의 변경 내용 저장",
    "admin.hover.people.add": "이 사람에게 역할 주기",
    "admin.hover.people.remove": "이 사람에게서 역할 빼기",
    "admin.hover.worldRankings.import": "세계 랭킹을 가져와서 선수 추가",
    "admin.modal.cancel": "취소",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "확인",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "이메일 주소",
    "admin.people.remove": "제거",
    "admin.people.otherwise": "처리할 수 없었어요.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "나",
    "admin.managers.add": "운영자 추가",
    "admin.managers.email": "운영자에게 이메일 보내기",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "운영자가 없어요",
    "admin.managers.removeTitle": "운영자 제거",
    "admin.managers.removeExplanation":
      "{name}님은 더 이상 이 대회를 운영할 수 없게 돼요.",
    "admin.managers.removeYourself.explanation":
      "더 이상 이 대회를 운영할 수 없게 되고, 여기서는 아무도 되돌려 줄 수 없어요. 다른 운영자가 다시 운영자로 만들어 줄 수 있어요.",
    "admin.managers.otherwise": "그 주소는 운영자로 만들 수 없어요.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "선수 추가",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "이 선수를 추가할 수 없어요.",
    "admin.competitionPlayers.choose": "추가할 선수",
    "admin.competitionPlayers.nobody": "선수 선택",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "부전승",
    "admin.competitionPlayers.all": "모든 선수가 이 부문에 있어요",
    "admin.competitionPlayers.none": "선수가 없어요",
    "admin.competitionPlayers.up": "위로",
    "admin.competitionPlayers.down": "아래로",
    "admin.competitionPlayers.remove": "제거",
    "admin.competitionPlayers.withdraw": "기권",
    "admin.competitionPlayers.unwithdraw": "기권 취소",
    "admin.competitionPlayers.withdrawn": "기권한 선수",
    "admin.competitionPlayers.removeTitle": "선수 제거",
    "admin.competitionPlayers.removeQuestion":
      "{name}님을 부문에서 뺄게요. 되돌릴 수 없어요.",
    "admin.competitionPlayers.withdrawTitle": "선수 기권",
    "admin.competitionPlayers.withdrawQuestion":
      "{name}님은 이 부문에서 더 이상 경기하지 않고, 치르지 않은 경기는 상대방 승리로 처리돼요.",
    "admin.competitionPlayers.carryForward": "이월",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "이월 - {name}",
    "admin.carryForward.save": "저장",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "이 이월은 저장할 수 없어요.",
    "admin.carryForward.matchWins": "매치 승",
    "admin.carryForward.matchLosses": "매치 패",
    "admin.carryForward.gameWins": "게임 승",
    "admin.carryForward.gameLosses": "게임 패",
    "admin.carryForward.hoopsFor": "득점 후프",
    "admin.carryForward.hoopsAgainst": "실점 후프",
    "CarryForward.MatchWinsNotWhole": "매치 승 수를 정수로 입력해 주세요.",
    "CarryForward.MatchWinsBelowZero": "매치 승 수는 0 이상이어야 해요.",
    "CarryForward.MatchLossesNotWhole": "매치 패 수를 정수로 입력해 주세요.",
    "CarryForward.MatchLossesBelowZero": "매치 패 수는 0 이상이어야 해요.",
    "CarryForward.GameWinsNotWhole": "게임 승 수를 정수로 입력해 주세요.",
    "CarryForward.GameWinsBelowZero": "게임 승 수는 0 이상이어야 해요.",
    "CarryForward.GameLossesNotWhole": "게임 패 수를 정수로 입력해 주세요.",
    "CarryForward.GameLossesBelowZero": "게임 패 수는 0 이상이어야 해요.",
    "CarryForward.HoopsForNotWhole": "득점 후프 수를 정수로 입력해 주세요.",
    "CarryForward.HoopsForBelowZero": "득점 후프 수는 0 이상이어야 해요.",
    "CarryForward.HoopsAgainstNotWhole": "실점 후프 수를 정수로 입력해 주세요.",
    "CarryForward.HoopsAgainstBelowZero": "실점 후프 수는 0 이상이어야 해요.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "점수 추가",
    "admin.scores.none": "점수가 없어요",
    "admin.scores.edit": "수정",
    "admin.scores.drawNotFilledTitle": "대진이 아직 다 채워지지 않았어요",
    "admin.scores.archive": "보관",
    "admin.scores.up": "위로",
    "admin.scores.down": "아래로",
    "admin.scores.restore": "복원",
    "admin.scores.archived": "보관된 점수",
    "admin.scores.archivedSaid": "보관됨",
    "admin.scores.withdraw": "기권 처리",
    "admin.scores.unwithdraw": "기권 취소",
    "admin.scores.withdrawnSaid": "기권",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "처리할 수 없었어요.",
    "admin.score.title": "점수 추가",
    "admin.score.add": "게임 추가",
    "admin.score.winner": "승자",
    "admin.score.winnerScore": "승자 점수",
    "admin.score.loser": "패자",
    "admin.score.loserScore": "패자 점수",
    "admin.score.beat": "승",
    "admin.score.added": "{winner}님이 {loser}님을 이긴 게임을 추가했어요.",
    "admin.score.otherwise": "게임을 추가할 수 없었어요.",
    "admin.score.correctTitle": "점수 수정",
    "admin.score.save": "저장",
    "admin.score.notCorrected": "점수를 정정할 수 없었어요.",
    "Game.WinnerMissing": "승자를 선택해 주세요.",
    "Game.WinnerScoreMissing": "승자의 점수를 입력해 주세요.",
    "Game.LoserMissing": "패자를 선택해 주세요.",
    "Game.LoserScoreMissing": "패자의 점수를 입력해 주세요.",
    "Score.NoPoints": "점수는 득점 수로 시작해야 해요.",
    "Game.SamePlayer": "자기 자신과는 경기할 수 없어요.",
    "Game.WinnerNotAhead":
      "승자의 점수는 패자보다 높아야 하고, 아니면 승리로 표시해야 해요.",
    "Game.LoserMarked": "패자의 점수는 승리로 표시할 수 없어요.",
    "Game.ResultChanged":
      "정정해도 결과는 그대로여야 해요. 이긴 경기는 이긴 채로, 비긴 경기는 비긴 채로 남아요.",
    "Competition.MatchDecided": "두 선수의 매치는 이미 승부가 났어요.",
    "Competition.DrawFull": "녹아웃이 가득 차서 선수를 추가할 수 없어요.",
    "Competition.DrawNotFilled":
      "녹아웃의 모든 자리가 선수나 부전승으로 채워지기 전에는 점수를 추가할 수 없어요.",
    "Competition.ByeOutsideKnockout": "부전승은 녹아웃에만 둘 수 있어요.",
    "Competition.NotDrawnToMeet":
      "이 선수들은 지금 녹아웃에서 서로 맞붙도록 추첨되어 있지 않아요.",
    "Competition.WinnerHasPlayedOn":
      "이 매치의 승자가 이미 다음 경기를 치러서, 누가 이겼는지는 바꿀 수 없어요.",
    "CompetitionPlayer.Withdrawn": "기권한 선수는 더 이상 경기하지 않아요.",
    "admin.players.add": "선수 추가",
    "admin.players.none": "선수가 없어요",
    "admin.players.edit": "수정",
    "admin.players.archive": "보관",
    "admin.players.restore": "복원",
    "admin.players.up": "위로",
    "admin.players.down": "아래로",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "선수 보관",
    "admin.players.archiveQuestion": "{name}님이 다음 부문에서 빠져요:",
    "admin.players.archive.explanation":
      "복원해도 이 부문들에 다시 들어가지는 않아요.",
    "admin.players.archived": "보관된 선수",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "보관됨",
    // The player dialog.
    "admin.player.addTitle": "선수 추가",
    "admin.player.editTitle": "선수 수정",
    "admin.player.name": "이름",
    "admin.player.handicap": "핸디캡",
    "admin.player.representing": "소속",
    "admin.player.worldRankingName": "세계 랭킹 선수 이름",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "세계 랭킹에 있는 이름이에요.",
    "admin.player.worldRankingQuestioned":
      "세계 랭킹에 이 이름의 선수가 없어요. 철자가 틀렸거나, 랭킹에 새로 들어온 선수일 수 있어요.",
    "admin.player.flag": "국기",
    "admin.player.add": "추가",
    "admin.player.save": "저장",
    "admin.player.added": "{name}님을 추가했어요.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "이 선수는 이대로 저장할 수 없어요.",
    "Tournament.PlayerNameTaken":
      "이 대회의 다른 선수가 이미 그 이름을 쓰고 있어요.",
    "TournamentPlayer.NoSuchFlag": "있는 국기 중에서 선택해 주세요.",
    "TournamentPlayer.HandicapMalformed":
      "핸디캡을 숫자로 적어 주세요. 예: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "선수 이름을 Bye로 할 수 없어요.",
    "TournamentPlayer.NoLetterOrDigit":
      "이름에는 글자나 숫자가 하나는 있어야 해요.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "부전승은 추가할 필요가 없어요",
    "admin.player.byes":
      "부전승은 대회의 선수가 아니에요. 녹아웃에서는 선수를 추가할 때마다 대진에 필요한 만큼 부전승을 고를 수 있어요.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "팀",
    "admin.view.tests": "테스트",
    "admin.teams.add": "팀 추가",
    "admin.teams.none": "팀이 없어요",
    "admin.teams.edit": "수정",
    "admin.teams.view": "보기",
    "admin.teams.archive": "보관",
    "admin.teams.restore": "복원",
    "admin.teams.up": "위로",
    "admin.teams.down": "아래로",
    "admin.teams.archived": "보관된 팀",
    "admin.teams.archivedSaid": "보관됨",
    "admin.team.addTitle": "팀 추가",
    "admin.team.editTitle": "팀 수정",
    "admin.team.name": "이름",
    "admin.team.shortName": "약칭",
    "admin.team.shortName.explanation":
      "팀의 테스트를 부르는 이름이에요. 예: AUS v ENG.",
    "admin.team.flag": "국기",
    "admin.team.add": "추가",
    "admin.team.save": "저장",
    "admin.team.added": "{name}을(를) 추가했어요.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "이 팀은 이대로 저장할 수 없어요.",
    "admin.teamView.otherwise": "여기서는 이 팀을 볼 수 없어요.",
    "admin.teamView.players": "선수",
    "TeamName.Missing": "팀 이름을 입력해 주세요.",
    "TeamName.TooLong": "이름이 너무 길어요.",
    "admin.notes.add": "공지 추가",
    "admin.notes.none": "공지가 없어요",
    "admin.notes.edit": "수정",
    "admin.notes.delete": "삭제",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "공지 삭제",
    "admin.notes.deleteQuestion": "“{title}” 공지를 삭제할까요?",
    "admin.notes.delete.explanation":
      "삭제한 공지는 영구히 사라지며 되돌릴 수 없어요.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "처리할 수 없었어요.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "공지 추가",
    "admin.note.editTitle": "공지 수정",
    "admin.note.title": "제목",
    "admin.note.description": "내용",
    "admin.note.write": "작성",
    "admin.note.preview": "미리보기",
    "admin.note.toolbar": "서식",
    "admin.note.tool.heading": "제목",
    "admin.note.tool.bold": "굵게",
    "admin.note.tool.italic": "기울임",
    "admin.note.tool.quote": "인용",
    "admin.note.tool.code": "코드",
    "admin.note.tool.link": "링크",
    "admin.note.tool.numberedList": "번호 목록",
    "admin.note.tool.bulletedList": "글머리 기호 목록",
    "admin.note.tool.taskList": "할 일 목록",
    "admin.note.add": "추가",
    "admin.note.save": "저장",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "이 공지는 이대로 저장할 수 없어요.",
    "ManagerNoteTitle.Missing": "공지의 제목을 입력해 주세요.",
    "ManagerNoteTitle.TooLong": "제목이 너무 길어요.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "제목에는 글자나 숫자가 하나는 있어야 해요.",
    "ManagerNoteDescription.TooLong": "내용이 너무 길어요.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "EditManagerNote.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "DeleteManagerNote.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "ManagerNote.Deleted":
      "그 공지는 삭제되었어요. 다른 운영자가 삭제했을 수 있어요.",
    "CommentaryTitle.Missing": "해설의 제목을 입력해 주세요.",
    "CommentaryTitle.TooLong": "제목이 너무 길어요.",
    "CommentaryTitle.NoLetterOrDigit":
      "제목에는 글자나 숫자가 하나는 있어야 해요.",
    "Commentary.TitleTaken": "다른 해설이 이미 그 제목을 쓰고 있어요.",
    "CommentText.Missing": "댓글에 내용을 입력해 주세요.",
    "CommentText.TooLong": "댓글이 너무 길어요.",
    "TeamShortName.Missing": "팀의 약칭을 입력해 주세요.",
    "TeamShortName.TooLong": "약칭은 10자 이하여야 해요.",
    "TeamShortName.NoLetterOrDigit":
      "약칭에는 글자나 숫자가 하나는 있어야 해요.",
    "Team.ShortNameLongerThanName": "약칭은 팀 이름보다 길 수 없어요.",
    "Team.NoSuchFlag": "있는 국기 중에서 선택해 주세요.",
    "Team.Archived": "그 팀은 보관되어 있어요. 먼저 복원해 주세요.",
    "Team.InATest": "그 팀은 테스트에 나가므로 보관할 수 없어요.",
    "Team.PlayerNameTaken": "이 팀의 다른 선수가 이미 그 이름을 쓰고 있어요.",
    "TeamPlayer.NamedBye": "선수 이름을 Bye로 할 수 없어요.",
    "TeamPlayer.Archived": "그 선수는 보관되어 있어요. 먼저 복원해 주세요.",
    "TeamPlayer.HasGames": "그 선수는 경기를 치렀으므로 보관할 수 없어요.",
    "Tournament.TeamNameTaken":
      "이 대회의 다른 팀이 이미 그 이름을 쓰고 있어요.",
    "Tournament.TeamShortNameTaken":
      "이 대회의 다른 팀이 이미 그 약칭을 쓰고 있어요.",
    "Tournament.NoSuchTeam": "이 대회에는 이 주소의 팀이 없어요.",
    "Tournament.TeamArchived":
      "이 팀은 보관되어 있어요. 팀 탭에서만 복원할 수 있어요.",
    "admin.tests.add": "테스트 추가",
    "admin.tests.none": "테스트가 없어요",
    "admin.tests.edit": "수정",
    "admin.tests.view": "보기",
    "admin.tests.archive": "보관",
    "admin.tests.restore": "복원",
    "admin.tests.up": "위로",
    "admin.tests.down": "아래로",
    "admin.tests.archived": "보관된 테스트",
    "admin.tests.twoTeamsNeeded":
      "테스트는 두 팀 사이에서 치르므로 먼저 팀이 두 개 필요해요.",
    "admin.tests.toTeams": "팀으로 이동",
    "admin.tests.matches.one": "{count}매치",
    "admin.tests.matches.other": "{count}매치",
    "admin.tests.bestOf": "{games}판 다승제",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "처리할 수 없었어요.",
    "admin.test.addTitle": "테스트 추가",
    "admin.test.editTitle": "테스트 수정",
    "admin.test.firstTeam": "A팀",
    "admin.test.secondTeam": "B팀",
    "admin.test.versus": "v",
    "admin.test.starts": "시작일",
    "admin.test.finishes": "종료일",
    "admin.test.expectedMatches": "예정 매치 수",
    "admin.test.bestOf": "다승제(판 수)",
    "admin.test.group": "그룹",
    "admin.test.add": "추가",
    "admin.test.save": "저장",
    "admin.test.added": "{name}을(를) 추가했어요.",
    "admin.test.otherwise": "이 테스트는 이대로 저장할 수 없어요.",
    "admin.testView.otherwise": "여기서는 이 테스트를 볼 수 없어요.",
    "AddTest.FirstTeamMissing": "첫 번째 팀을 선택해 주세요.",
    "AddTest.SecondTeamMissing": "두 번째 팀을 선택해 주세요.",
    "UpdateTest.FirstTeamMissing": "첫 번째 팀을 선택해 주세요.",
    "UpdateTest.SecondTeamMissing": "두 번째 팀을 선택해 주세요.",
    "ExpectedMatches.NotWhole": "매치 수를 정수로 입력해 주세요.",
    "ExpectedMatches.TooSmall": "테스트는 최소 1매치가 예정되어 있어야 해요.",
    "TestGroup.TooLong": "그룹 이름이 너무 길어요.",
    "Tournament.TestAgainstItself":
      "한 팀이 자기 팀과 테스트를 치를 수는 없어요.",
    "Tournament.FormatHasNoGroups": "이 방식의 테스트는 그룹에 넣을 수 없어요.",
    "Tournament.TestFinishesBeforeStarts":
      "테스트는 시작하기 전에 끝날 수 없어요.",
    "Tournament.TestStartsBeforeTournament":
      "테스트는 대회가 시작하기 전에 시작할 수 없어요.",
    "Tournament.TestFinishesAfterTournament":
      "테스트는 대회가 끝난 뒤에 끝날 수 없어요.",
    "Tournament.TestHasGamesInUse":
      "이 테스트에는 게임이 있어서, 그 게임을 보관하기 전에는 보관할 수 없어요.",
    "Tournament.TestHasGames":
      "이 테스트에는 이제 게임이 있어서 팀을 더는 바꿀 수 없어요.",
    "Tournament.ExpectedMatchesBelowStarted":
      "그보다 많은 매치가 이미 시작되었어요.",
    "Tournament.BestOfBelowGamesPlayed":
      "두 선수가 이미 그보다 많은 게임을 치렀어요.",
    "Competition.ExpectedMatchesReached":
      "이 테스트는 예정된 매치 수만큼 이미 시작되었어요.",
    "Competition.SameTeam": "같은 팀의 선수끼리는 경기하지 않아요.",
    "AddManager.NoSuchAccount":
      "그 주소에는 운영자로 만들 수 있는 계정이 없어요.",
    "admin.scorers.add": "기록원 추가",
    "admin.scorers.none": "기록원이 없어요",
    "admin.scorers.removeTitle": "기록원 제거",
    "admin.scorers.removeExplanation":
      "{name}님은 더 이상 이 대회의 점수를 입력할 수 없게 돼요.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "그 주소는 기록원으로 만들 수 없어요.",
    "AddScorer.NoSuchAccount":
      "그 주소에는 기록원으로 만들 수 있는 계정이 없어요.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "사이트 관리자만 할 수 있어요.",
    "AddRole.NoSuchAccount": "그 주소에는 역할을 줄 수 있는 계정이 없어요.",
    "AddRole.NoSuchRole": "그런 역할은 없어요.",
    "RemoveRole.NoSuchAccount": "그런 계정은 없어요.",
    "RemoveRole.NoSuchRole": "그런 역할은 없어요.",
    "RemoveRole.Yourself": "자신의 사이트 관리자 역할은 뺄 수 없어요.",
    "AccountsWithRole.NoSuchRole": "그런 역할은 없어요.",
    "Tournament.AlreadyAManager":
      "그 계정은 이미 이 대회의 운영자이고, 기록원이 할 수 있는 일은 모두 할 수 있어요.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "대회 이름을 입력해 주세요.",
    "TournamentName.TooShort": "이름이 너무 짧아요.",
    "TournamentName.TooLong": "이름이 너무 길어요.",
    "TournamentName.AllLowerCase": "이름을 모두 소문자로 쓸 수는 없어요.",
    "TournamentName.AllCapitals": "이름을 모두 대문자로 쓸 수는 없어요.",
    "TournamentName.NoLetterOrDigit":
      "이름에는 글자나 숫자가 하나는 있어야 해요.",
    "ReadOnlyDate.Unreadable": "날짜를 입력해 주세요.",
    "Tournament.FinishesBeforeStarts": "대회는 시작하기 전에 끝날 수 없어요.",
    "Tournament.StartsAfterNextYear":
      "대회는 내년이 지난 뒤에 시작할 수 없어요.",
    "Tournament.FinishesAfterNextYear":
      "대회는 내년이 지난 뒤에 끝날 수 없어요.",
    "CreateTournament.NoSuchCountry": "국가를 선택해 주세요.",
    "TournamentSubtitle.TooLong": "부제는 2000자 이하여야 해요.",
    "Tournament.NotAManager": "이 대회의 운영자만 바꿀 수 있어요.",
    "Tournament.NotAManagerOrScorer":
      "이 대회의 운영자나 기록원만 볼 수 있어요.",
    "Tournament.Archived":
      "이 대회는 보관되어 있어요. 복원해야 바꿀 수 있어요.",
    "UpdateTournament.NoSuchTournament": "이 주소에는 대회가 없어요.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form. English takes the names the domain knows them
    // by, rather than writing each out a second time to drift from it.
    "sport.ac": "어소시에이션 크로케",
    "sport.gc": "골프 크로케",
    "sport.a6w": "아메리칸 6 위켓",
    "sport.rc": "리코셰",
    "sport.gb": "게이트볼",
    "format.standard": "일반",
    "format.teams": "팀전",
    "format.eire-cup": "에이레 컵",
    "format.interstate-shield": "인터스테이트 실드",
    "format.gc-world-team-championship": "GC 세계 팀 선수권",
    "country.ad": "안도라",
    "country.ae": "아랍에미리트",
    "country.af": "아프가니스탄",
    "country.ag": "앤티가 바부다",
    "country.ai": "앵귈라",
    "country.al": "알바니아",
    "country.am": "아르메니아",
    "country.ao": "앙골라",
    "country.ar": "아르헨티나",
    "country.as": "아메리칸사모아",
    "country.at": "오스트리아",
    "country.au": "오스트레일리아",
    "country.aw": "아루바",
    "country.ax": "올란드 제도",
    "country.az": "아제르바이잔",
    "country.ba": "보스니아 헤르체고비나",
    "country.bb": "바베이도스",
    "country.bd": "방글라데시",
    "country.be": "벨기에",
    "country.bf": "부르키나파소",
    "country.bg": "불가리아",
    "country.bh": "바레인",
    "country.bi": "부룬디",
    "country.bj": "베냉",
    "country.bm": "버뮤다",
    "country.bn": "브루나이",
    "country.bo": "볼리비아",
    "country.br": "브라질",
    "country.bs": "바하마",
    "country.bt": "부탄",
    "country.bv": "부베 섬",
    "country.bw": "보츠와나",
    "country.by": "벨라루스",
    "country.bz": "벨리즈",
    "country.ca": "캐나다",
    "country.catalonia": "카탈루냐",
    "country.cc": "코코스 제도",
    "country.cd": "콩고민주공화국",
    "country.cf": "중앙아프리카공화국",
    "country.cg": "콩고공화국",
    "country.ch": "스위스",
    "country.ci": "코트디부아르",
    "country.ck": "쿡 제도",
    "country.cl": "칠레",
    "country.cm": "카메룬",
    "country.cn": "중국",
    "country.co": "콜롬비아",
    "country.cr": "코스타리카",
    "country.cu": "쿠바",
    "country.cv": "카보베르데",
    "country.cx": "크리스마스 섬",
    "country.cy": "키프로스",
    "country.cz": "체코",
    "country.de": "독일",
    "country.dj": "지부티",
    "country.dk": "덴마크",
    "country.dm": "도미니카 연방",
    "country.do": "도미니카공화국",
    "country.dz": "알제리",
    "country.ec": "에콰도르",
    "country.ee": "에스토니아",
    "country.eg": "이집트",
    "country.eh": "서사하라",
    "country.england": "잉글랜드",
    "country.er": "에리트레아",
    "country.es": "스페인",
    "country.et": "에티오피아",
    "country.fi": "핀란드",
    "country.fj": "피지",
    "country.fk": "포클랜드 제도",
    "country.fm": "미크로네시아",
    "country.fo": "페로 제도",
    "country.fr": "프랑스",
    "country.ga": "가봉",
    "country.gb": "영국",
    "country.gd": "그레나다",
    "country.ge": "조지아",
    "country.gf": "프랑스령 기아나",
    "country.gh": "가나",
    "country.gi": "지브롤터",
    "country.gl": "그린란드",
    "country.gm": "감비아",
    "country.gn": "기니",
    "country.gp": "과들루프",
    "country.gq": "적도 기니",
    "country.gr": "그리스",
    "country.gs": "사우스조지아 사우스샌드위치 제도",
    "country.gt": "과테말라",
    "country.gu": "괌",
    "country.gw": "기니비사우",
    "country.gy": "가이아나",
    "country.hk": "홍콩",
    "country.hm": "허드 맥도널드 제도",
    "country.hn": "온두라스",
    "country.hr": "크로아티아",
    "country.ht": "아이티",
    "country.hu": "헝가리",
    "country.id": "인도네시아",
    "country.ie": "아일랜드",
    "country.il": "이스라엘",
    "country.im": "맨 섬",
    "country.in": "인도",
    "country.io": "영국령 인도양 지역",
    "country.iq": "이라크",
    "country.ir": "이란",
    "country.is": "아이슬란드",
    "country.it": "이탈리아",
    "country.je": "저지",
    "country.jm": "자메이카",
    "country.jo": "요르단",
    "country.jp": "일본",
    "country.ke": "케냐",
    "country.kg": "키르기스스탄",
    "country.kh": "캄보디아",
    "country.ki": "키리바시",
    "country.km": "코모로",
    "country.kn": "세인트키츠 네비스",
    "country.kp": "북한",
    "country.kr": "대한민국",
    "country.kw": "쿠웨이트",
    "country.ky": "케이맨 제도",
    "country.kz": "카자흐스탄",
    "country.la": "라오스",
    "country.lb": "레바논",
    "country.lc": "세인트루시아",
    "country.li": "리히텐슈타인",
    "country.lk": "스리랑카",
    "country.lr": "라이베리아",
    "country.ls": "레소토",
    "country.lt": "리투아니아",
    "country.lu": "룩셈부르크",
    "country.lv": "라트비아",
    "country.ly": "리비아",
    "country.ma": "모로코",
    "country.mc": "모나코",
    "country.md": "몰도바",
    "country.me": "몬테네그로",
    "country.mg": "마다가스카르",
    "country.mh": "마셜 제도",
    "country.mk": "북마케도니아",
    "country.ml": "말리",
    "country.mm": "미얀마",
    "country.mn": "몽골",
    "country.mo": "마카오",
    "country.mp": "북마리아나 제도",
    "country.mq": "마르티니크",
    "country.mr": "모리타니",
    "country.ms": "몬트세랫",
    "country.mt": "몰타",
    "country.mu": "모리셔스",
    "country.mv": "몰디브",
    "country.mw": "말라위",
    "country.mx": "멕시코",
    "country.my": "말레이시아",
    "country.mz": "모잠비크",
    "country.na": "나미비아",
    "country.nc": "뉴칼레도니아",
    "country.ne": "니제르",
    "country.nf": "노퍽 섬",
    "country.ng": "나이지리아",
    "country.ni": "니카라과",
    "country.nl": "네덜란드",
    "country.no": "노르웨이",
    "country.np": "네팔",
    "country.nr": "나우루",
    "country.nu": "니우에",
    "country.nz": "뉴질랜드",
    "country.om": "오만",
    "country.pa": "파나마",
    "country.pe": "페루",
    "country.pf": "프랑스령 폴리네시아",
    "country.pg": "파푸아뉴기니",
    "country.ph": "필리핀",
    "country.pk": "파키스탄",
    "country.pl": "폴란드",
    "country.pm": "생피에르 미클롱",
    "country.pn": "핏케언 제도",
    "country.pr": "푸에르토리코",
    "country.ps": "팔레스타인",
    "country.pt": "포르투갈",
    "country.pw": "팔라우",
    "country.py": "파라과이",
    "country.qa": "카타르",
    "country.re": "레위니옹",
    "country.ro": "루마니아",
    "country.rs": "세르비아",
    "country.ru": "러시아",
    "country.rw": "르완다",
    "country.sa": "사우디아라비아",
    "country.sb": "솔로몬 제도",
    "country.sc": "세이셸",
    "country.scotland": "스코틀랜드",
    "country.sd": "수단",
    "country.se": "스웨덴",
    "country.sg": "싱가포르",
    "country.sh": "세인트헬레나",
    "country.si": "슬로베니아",
    "country.sj": "스발바르 얀마옌",
    "country.sk": "슬로바키아",
    "country.sl": "시에라리온",
    "country.sm": "산마리노",
    "country.sn": "세네갈",
    "country.so": "소말리아",
    "country.sr": "수리남",
    "country.st": "상투메 프린시페",
    "country.sv": "엘살바도르",
    "country.sy": "시리아",
    "country.sz": "에스와티니",
    "country.tc": "터크스 케이커스 제도",
    "country.td": "차드",
    "country.tf": "프랑스령 남방 지역",
    "country.tg": "토고",
    "country.th": "태국",
    "country.tj": "타지키스탄",
    "country.tk": "토켈라우",
    "country.tl": "동티모르",
    "country.tm": "투르크메니스탄",
    "country.tn": "튀니지",
    "country.to": "통가",
    "country.tr": "튀르키예",
    "country.tt": "트리니다드 토바고",
    "country.tv": "투발루",
    "country.tw": "대만",
    "country.tz": "탄자니아",
    "country.ua": "우크라이나",
    "country.ug": "우간다",
    "country.um": "미국령 군소 제도",
    "country.us": "미국",
    "country.uy": "우루과이",
    "country.uz": "우즈베키스탄",
    "country.va": "바티칸",
    "country.vc": "세인트빈센트 그레나딘",
    "country.ve": "베네수엘라",
    "country.vg": "영국령 버진아일랜드",
    "country.vi": "미국령 버진아일랜드",
    "country.vn": "베트남",
    "country.vu": "바누아투",
    "country.wales": "웨일스",
    "country.wf": "월리스 푸투나",
    "country.ws": "사모아",
    "country.ye": "예멘",
    "country.yt": "마요트",
    "country.za": "남아프리카공화국",
    "country.zm": "잠비아",
    "country.zw": "짐바브웨",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. Only what fills an email in is escaped; the
    // markup here is the site's own. `{link}` is the link the email carries,
    // `{site}` the site's address, `{buttonBackgroundColour}` and
    // `{buttonTextColour}` what a button is painted with, `{emailFromName}` the
    // name each email is signed off with, and `{siteName}` what the site is
    // called. None greets its reader by name.

    "Email.ConfirmAddress.subject": "{siteName} 이메일 주소 확인",
    "Email.ConfirmAddress.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong> 계정을 만들어 주셔서 감사합니다.<br />
    계정을 사용하시기 전에 아래 버튼을 눌러 이메일 주소를 확인해 주세요.
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
        이메일 주소 확인
    </a>
</p>

<p>
    버튼이 작동하지 않으면 아래 링크를 브라우저에서 열어 이메일 주소를 확인하실 수 있습니다.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    계정을 만든 적이 없다면 이 이메일은 무시하셔도 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "{siteName} 이메일 주소를 확인하는 새 링크",
    "Email.ConfirmAddressAgain.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong>의 이메일 주소를 확인하는 이메일을 다시 요청하셨습니다.<br />
    아래 버튼을 눌러 이메일 주소를 확인해 주세요.
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
        이메일 주소 확인
    </a>
</p>

<p>
    버튼이 작동하지 않으면 아래 링크를 브라우저에서 열어 이메일 주소를 확인하실 수 있습니다.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    확인이 끝나면 계정을 계속 불편 없이 사용하실 수 있습니다.
</p>

<p>
    이 이메일을 요청하신 적이 없다면 무시하셔도 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "누군가 회원님의 이메일 주소로 가입하려고 했습니다",
    "Email.AlreadyRegistered.body": `
<p>안녕하세요.</p>

<p>
    누군가 이 이메일 주소로 <strong>{siteName}</strong>에 가입하려고 했지만,
    이 주소로는 이미 계정이 있습니다. 회원님의 계정에는 아무 변화도 없습니다.<br />
    본인이 하신 일이라면 이미 계정이 있으니 로그인하시면 됩니다.
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
        로그인
    </a>
</p>

<p>
    비밀번호를 잊으셨다면 여기서 다시 설정하실 수 있습니다.
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
        비밀번호 찾기
    </a>
</p>

<p>
    본인이 하신 일이 아니라면 아무것도 하지 않으셔도 됩니다. 누구에게도
    회원님의 계정에 들어갈 방법이 주어지지 않았습니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "{siteName} 계정을 이 주소로 옮기는 것을 확인해 주세요",
    "Email.ConfirmNewEmailAddress.body": `
<p>안녕하세요.</p>

<p>
    누군가 <strong>{siteName}</strong> 계정에 로그인한 상태에서 그 계정을
    이 이메일 주소로 옮겨 달라고 요청했습니다. 본인이 하신 일이라면, 그
    계정에 로그인한 상태에서 여기서 확인해 주세요. 링크는 24시간 동안 쓸 수 있습니다.
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
        내 계정 옮기기
    </a>
</p>

<p>
    또는 이 주소를 브라우저에 붙여 넣으세요.<br />
    {link}
</p>

<p>
    본인이 하신 일이 아니라면 아무것도 하지 않으셔도 됩니다. 어떤 계정도 이곳으로 옮겨지지 않습니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "누군가 계정을 회원님의 이메일 주소로 옮겨 달라고 요청했습니다",
    "Email.AlreadyHasAnAccount.body": `
<p>안녕하세요.</p>

<p>
    누군가 <strong>{siteName}</strong> 계정에 로그인한 상태에서 그 계정을
    이 이메일 주소로 옮겨 달라고 요청했지만, 이 주소로는 이미 계정이
    있습니다. 아무것도 옮겨지지 않았고, 회원님의 계정에도 변화가 없습니다.
</p>

<p>
    본인이 하신 일이라면 이 주소로 이미 계정이 있으니 로그인하시면 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "{siteName} 계정이 옮겨졌습니다",
    "Email.EmailAddressChanged.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정이 방금 다른 이메일 주소인
    {emailAddress}(으)로 옮겨졌으며, 앞으로는 그 주소로 로그인하게 됩니다.
</p>

<p>
    본인이 하신 일이 아니라면 다른 사람이 회원님의 계정을 쓰고 있는 것입니다.
    이 이메일에 답장하여 알려 주세요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "{siteName} 비밀번호가 변경되었습니다",
    "Email.PasswordChanged.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정 비밀번호가 방금 변경되었으며,
    그 계정에 로그인되어 있던 다른 브라우저는 모두 로그아웃되었습니다.<br />
    본인이 하신 일이라면 아무것도 하지 않으셔도 됩니다.
</p>

<p>
    본인이 하신 일이 아니라면 다른 사람이 회원님의 비밀번호를 알고 있는
    것입니다. 여기서 새 비밀번호를 설정하면 그 사람은 로그아웃됩니다.
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
        비밀번호 찾기
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "{siteName} 새 비밀번호 설정",
    "Email.SetNewPassword.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong>의 비밀번호 재설정을 요청하셨습니다.<br />
    아래 버튼을 눌러 비밀번호를 재설정하실 수 있습니다.
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
        비밀번호 재설정
    </a>
</p>

<p>
    버튼이 작동하지 않으면 아래 링크를 브라우저에서 열어 비밀번호를 재설정하실 수 있습니다.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    비밀번호 재설정을 요청하신 적이 없다면 이 이메일은 무시하셔도 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "{siteName} 비밀번호 설정",
    "Email.SetPassword.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정에는 비밀번호가 없고 Google로 로그인하고 있습니다.<br />
    이메일 주소와 비밀번호로도 로그인할 수 있도록 비밀번호 설정을 요청하셨습니다.
    아래 버튼을 눌러 설정하실 수 있습니다.
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
        비밀번호 설정
    </a>
</p>

<p>
    버튼이 작동하지 않으면 아래 링크를 브라우저에서 열어 비밀번호를 설정하실 수 있습니다.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    링크는 한 시간 동안 쓸 수 있습니다. 비밀번호 설정을 요청하신 적이 없다면 이 이메일은 무시하셔도 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "이 이메일 주소로 만든 {siteName} 계정이 없습니다",
    "Email.RegisterInstead.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong>에 계정이 없는 이메일 주소로
    비밀번호 재설정 요청이 들어왔습니다.
</p>

<p>
    서비스를 이용하고 싶으시다면 아래 주소에서 새 계정을 만드실 수 있습니다.<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    본인이 요청하신 것이 아니라면 이 이메일은 무시하셔도 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "{siteName} 계정을 잊는 것을 확인해 주세요",
    "Email.ConfirmForgetting.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정을 잊어 달라고
    요청하셨습니다.<br />
    아래 버튼을 눌러 그것이 어떤 의미인지 확인하고, 정말 원하시는지 알려 주세요.
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
        내 계정 잊기
    </a>
</p>

<p>
    버튼이 작동하지 않으면 아래 링크를 브라우저에서 열 수도 있습니다.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    계정을 잊으면 이름과 이메일 주소는 누구도 다시 읽을 수 없고, 이 계정으로는
    로그인할 수 없습니다. 되돌릴 수 없습니다.
</p>

<p>
    링크는 요청하신 시각부터 15분 동안, 이 계정에 로그인한 상태에서 한 번만
    쓸 수 있습니다. 그 후에는 계정에서 다시 요청해 주세요.
</p>

<p>
    요청하신 적이 없다면 링크를 누르지 않는 한 아무 일도 일어나지 않습니다.
    다만 누군가 회원님의 계정에 로그인한 상태에서 요청한 것이므로, 그 사람이
    다시 로그인하지 못하도록 비밀번호 찾기 페이지에서 새 비밀번호를 설정해 주세요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "가입이 일시 중단되었습니다: {service}에 연결할 수 없습니다",
    "Email.RegistrationsSuspended.body": `
<p>안녕하세요.</p>

<p>
    {siteName}이(가) {when}에 {service}에 연결하지 못했습니다. 응답할 때까지,
    이 서비스가 필요한 가입이나 새 비밀번호 설정을 하려는 방문자에게는
    나중에 다시 시도하라고 안내됩니다.
</p>

<p>
    따로 해제할 것은 없습니다. 시도할 때마다 {service}에 새로 요청하며,
    응답하는 순간 페이지가 다시 정상 작동합니다.
</p>

<p>
    {service}이(가) 계속 중단된 동안에는 이에 관한 이메일을 한 시간에 최대 한 번만 받으시게 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName}이(가) 데이터베이스에 연결할 수 없습니다",
    "Email.DatabaseUnreachable.body": `
<p>안녕하세요.</p>

<p>
    {siteName}이(가) {when}에 데이터베이스에 연결하지 못했습니다. 응답할 때까지 데이터베이스가 필요한 모든 페이지는 방문자에게 사이트를 이용할 수 없으니 나중에 다시 시도하라고 안내합니다.
</p>

<p>
    따로 해제할 것은 없습니다. 요청할 때마다 연결을 새로 시도하며, 데이터베이스가 응답하는 순간 사이트가 다시 정상 작동합니다.
</p>

<p>
    데이터베이스가 계속 중단된 동안에는 이에 관한 이메일을 {minutes}분에 최대 한 번만 받으시게 됩니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject":
      "{siteName}이(가) 요청을 처리하지 못했습니다",
    "Email.UnhandledError.body": `
<p>안녕하세요.</p>

<p>
    {siteName}이(가) {when}에 {asked} 요청을 처리하지 못했습니다. 방문자에게는 참조 번호 {reference}이(가) 표시되었고, 로그에서 그 번호로 원인을 찾을 수 있습니다.
</p>

<p>
    사이트가 고장 나면 모든 요청에서 실패하는 경향이 있으므로, 실패에 관한 이메일은 한 시간에 최대 4번만 받으시게 됩니다. 그 이후의 실패도 로그에는 모두 남습니다.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
