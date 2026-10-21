// The site's words in Korean. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written in the polite informal register (해요체) rather than the formal one
// (합니다체): the site talks to people scoring and following croquet, and the
// English it is written from is plain and direct rather than stiff. 해요체 is
// also what Korean sites and apps use for their own buttons and messages, so
// the formal register would read as a letter from an office. The reader is
// addressed without a pronoun, as Korean does, so there is no 당신 to choose.
// Items in menus and on buttons are given as nouns, or as a verb stem ending
// in 하기 where an action is meant, as Korean interfaces do, and Korean has no
// capital letters to carry over from the English.
//
// Croquet has little established vocabulary in Korean, because the sport is
// small there and gateball, a sport of the same family, is the one Koreans
// know. Terms are therefore transliterated (크로켓, 후프) where no other exists.
import type { Language } from "../common/language.js";

export const korean: Language = {
  tag: "ko",
  name: "한국어",
  words: {
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
    "theme.system": "시스템",
    "footer.donate": "후원하기",
    "footer.plea":
      "{siteName}이(가) 마음에 드시나요? 앞으로의 개발을 위해 후원해 주세요.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "개인정보",
    "beta.banner":
      "이곳은 베타 사이트예요. 데이터는 언제든 초기화될 수 있어요.",
    "privacy.contact":
      "이 페이지나 보관 중인 회원님의 정보에 대한 문의: {emailAddress}",
    "tryWebsite.banner":
      "여기는 {siteName}을(를) 안전하게 익혀 볼 수 있는 곳이에요. 여기에 입력한 내용은 언제든 지워질 수 있어요.",

    "language.label": "언어",
    "language.choose": "변경",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "읽어 볼 새 소식이 있어요.",
    "whatsNew.admin.message": "대회를 운영하는 분들을 위한 새 소식이 있어요.",
    "whatsNew.view": "새 소식 보기",
    "whatsNew.later": "다음에 다시 알림",
    "whatsNew.never": "이 알림을 다시 표시하지 않기",

    "form.otherwise":
      "무언가 잘못되었어요. 입력한 내용을 확인하고 다시 시도해 주세요.",

    "account.menu": "계정",
    "account.register": "가입하기",
    "account.signIn": "로그인",
    "account.forgotPassword": "비밀번호를 잊었어요",
    "account.signOut": "로그아웃",
    "account.profile": "프로필",
    "account.changePassword": "비밀번호 변경",
    "account.changeEmailAddress": "이메일 주소 변경",
    "account.changeName": "이름 변경",
    "account.setPassword": "비밀번호 설정",
    "account.forgetAccount": "계정 잊기",

    "register.title": "가입하기",
    "register.emailAddress": "이메일 주소",
    "register.submit": "가입하기",
    "register.withGoogle": "Google로 가입하기",
    "register.or": "또는",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google이 그 이메일 주소가 본인의 것이라고 확인해 주지 않아서, 여기서는 Google로 사용할 수 없어요. 아래에서 이메일 주소를 사용해 주세요.",
    "SignInWithGoogle.LinkedToAnother":
      "그 이메일 주소로 만든 계정이 이미 있고, 다른 Google 계정에 연결되어 있어요. 그 Google 계정으로 로그인하거나, 이메일 주소와 비밀번호로 로그인해 주세요.",
    "SignInWithGoogle.NameMissing":
      "Google이 이름을 알려 주지 않았는데, 계정에는 이름이 필요해요. 아래에서 이메일 주소를 사용해 주세요.",
    "Google.Unreachable":
      "지금은 Google에 연결할 수 없어요. 몇 분 뒤에 다시 시도하거나, 아래에서 이메일 주소를 사용해 주세요.",
    "Registration.NotAPerson":
      "사람이 보낸 것처럼 보이지 않았어요. 다시 시도해 보시고, 계속 이러면 몇 분 기다린 뒤에 다시 와 주세요.",

    "EmailAddress.Missing": "이메일 주소를 입력해 주세요.",
    "EmailAddress.NoAt": "이메일 주소에는 @가 있어야 해요.",
    "EmailAddress.MoreThanOneAt": "이메일 주소에는 @가 하나만 있어야 해요.",
    "EmailAddress.NoDomain":
      "이메일 주소에는 @ 뒤에 example.com 같은 도메인이 있어야 해요.",

    "welcome.title": "이메일을 확인하세요",
    "welcome.checkEmail":
      "알려 주신 주소로 이메일을 보냈어요. 이메일 안의 링크를 눌러 계속 진행해 주세요.",
    "welcome.nothingArrived":
      "몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "welcome.home": "{siteName}(으)로 돌아가기",
    "newConfirmationLink.title": "새 링크 받기",
    "newConfirmationLink.explanation":
      "이메일 주소를 확인하는 링크가 만료되었어요. 새 링크를 요청하면 가입할 때 사용한 주소로 보내 드려요.",
    "newConfirmationLink.send": "새 링크 보내 주세요",
    "newConfirmationLink.home": "{siteName}(으)로 돌아가기",
    "newConfirmationLink.signIn": "로그인",
    "newConfirmationLink.sent.title": "이메일을 확인하세요",
    "newConfirmationLink.sent.explanation":
      "새 링크를 보냈어요. 링크를 눌러 이메일 주소를 확인해 주세요. 몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "newConfirmationLink.alreadyConfirmed.title": "이미 확인된 이메일 주소예요",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "더 확인할 것이 없어요. 확인할 때 정한 비밀번호로 로그인해 주세요.",
    "newConfirmationLink.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "newConfirmationLink.noLongerWorks.explanation":
      "이메일에 있던 링크를 끝까지 빠짐없이 눌렀는지 확인해 주세요. 그래도 안 되면 다시 가입하세요. 새 링크를 보내 드려요.",
    "newConfirmationLink.tooMany.title": "나중에 다시 시도해 주세요",
    "newConfirmationLink.tooMany.explanation":
      "최근 이 주소로 링크를 여러 번 보냈어요. 한 시간 뒤에 다시 요청해 주시고, 그동안 스팸 메일함도 확인해 주세요.",

    "forgotPassword.title": "비밀번호를 잊으셨나요?",
    "forgotPassword.emailAddress": "이메일 주소",
    "forgotPassword.submit": "다시 들어갈 방법 보내기",
    "forgotPassword.home": "{siteName}(으)로 돌아가기",
    "forgotPassword.sent.title": "이메일을 확인하세요",
    "forgotPassword.sent.explanation":
      "그 주소로 만든 계정이 있다면, 새 비밀번호를 설정하는 링크를 보냈어요. 한 시간 안에 링크를 눌러 주세요. 몇 분이 지나도 도착하지 않으면 스팸 메일함을 확인해 주세요.",
    "forgotPassword.tryAgainLater":
      "최근 이곳에서 다시 들어갈 방법을 너무 많이 요청했어요. 한 시간 뒤에 다시 시도해 주세요.",

    "setNewPassword.title": "새 비밀번호 설정",
    "setNewPassword.password": "비밀번호",
    "setNewPassword.confirmPassword": "비밀번호 확인",
    "setNewPassword.submit": "새 비밀번호로 설정하기",
    "setNewPassword.home": "{siteName}(으)로 돌아가기",
    "setNewPassword.signIn": "로그인",
    "setNewPassword.askAgain": "새 링크 요청하기",
    "setNewPassword.changed.title": "비밀번호를 변경했어요",
    "setNewPassword.changed.explanation":
      "로그인되어 있던 모든 곳에서 로그아웃되었어요. 새 비밀번호로 로그인해 주세요.",
    "setNewPassword.expired.title": "링크가 만료되었어요",
    "setNewPassword.expired.explanation":
      "새 비밀번호를 설정하는 링크는 한 시간 동안만 쓸 수 있어요. 다시 요청하면 같은 주소로 보내 드려요.",
    "setNewPassword.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "setNewPassword.noLongerWorks.explanation":
      "이미 사용했거나 링크의 끝부분이 빠졌을 수 있어요. 아직 필요하면 다시 요청해 주세요.",

    "BreachedPasswords.Unreachable":
      "지금은 비밀번호를 확인할 수 없어서 변경하지 않았어요. 몇 분 뒤에 다시 시도해 주세요. 링크는 만료되기 전까지 계속 쓸 수 있어요.",

    "forgetAccount.title": "계정 잊기",
    "forgetAccount.explanation":
      "이름과 이메일 주소를 영구히 읽을 수 없게 만들고 계정을 닫을 수 있어요. 본인인지 확인하기 위해 먼저 계정의 주소로 링크를 이메일로 보내 드리며, 그 링크를 누르기 전에는 아무것도 잊지 않아요.",
    "forgetAccount.submit": "링크를 이메일로 받기",
    "forgetAccount.sent.title": "이메일을 확인하세요",
    "forgetAccount.sent.explanation":
      "계정의 주소로 링크를 이메일로 보냈어요. 링크는 15분 동안만, 그리고 이 계정에 로그인해 있는 동안에만 쓸 수 있어요.",
    "forgetAccount.confirm.title": "계정을 영구히 잊을까요?",
    "forgetAccount.confirm.explanation":
      "잊고 나면 이름과 이메일 주소는 누구도 다시 읽을 수 없고, 계정으로 로그인할 수도 없어요. 되돌릴 수 없어요.",
    "forgetAccount.confirm.submit": "내 계정 잊기",
    "forgetAccount.forgotten.title": "계정을 잊었어요",
    "forgetAccount.forgotten.explanation":
      "이름과 이메일 주소를 더 이상 읽을 수 없고, 로그인되어 있던 모든 곳에서 로그아웃되었어요.",
    "forgetAccount.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "forgetAccount.noLongerWorks.explanation":
      "만료되었거나, 이미 사용했거나, 로그인하지 않은 다른 계정의 링크일 수 있어요. 계속 잊고 싶다면 계정에서 다시 요청해 주세요.",
    "forgetAccount.lastAdministrator.title": "이 계정은 잊을 수 없어요",
    "forgetAccount.lastAdministrator.explanation":
      "이 사이트의 관리자는 본인뿐이에요. 다른 사람에게 관리자 역할을 준 뒤에 계정을 잊을 수 있어요.",
    "forgetAccount.askAgain": "다시 요청하기",
    "forgetAccount.home": "{siteName}(으)로 돌아가기",

    "registrationsSuspended.title": "지금은 가입을 받지 않아요",
    "registrationsSuspended.explanation":
      "가입에 필요한 서비스에 지금은 연결할 수 없어서, 다시 응답할 때까지 아무도 가입할 수 없어요. 입력한 내용은 저장되지 않았어요.",
    "registrationsSuspended.tryAgainLater":
      "잠시 뒤에 다시 시도해 주세요. 사이트 관리자에게는 알렸어요.",
    "registrationsSuspended.home": "{siteName}(으)로 돌아가기",

    "signIn.title": "로그인",
    "signIn.emailAddress": "이메일 주소",
    "signIn.password": "비밀번호",
    "signIn.submit": "로그인",
    "signIn.forgotPassword": "비밀번호를 잊으셨나요?",
    "signIn.register": "가입하기",
    "signIn.withGoogle": "Google로 로그인",
    "signIn.or": "또는",
    "signIn.tryAgainLater":
      "최근 시도가 너무 많았어요. 한 시간 뒤에 다시 시도해 주세요.",

    "SignIn.Failed":
      "이메일 주소나 비밀번호가 올바르지 않아요. 다시 시도해 주세요.",

    "profile.title": "프로필",
    "profile.name": "이름:",
    "profile.emailAddress": "이메일 주소:",

    "changeName.title": "이름 변경",
    "changeName.name": "이름",
    "changeName.submit": "이름 변경",

    "setPassword.title": "비밀번호 설정",
    "setPassword.explanation":
      "계정에 비밀번호가 없어요. Google로 로그인하고 계신 거예요. 비밀번호로도 로그인하려면, 비밀번호를 설정하는 링크를 {emailAddress}(으)로 이메일로 보내 드려요.",
    "setPassword.submit": "링크를 이메일로 받기",
    "setPassword.sent.title": "이메일을 확인하세요",
    "setPassword.sent.explanation":
      "비밀번호를 설정하는 링크를 이메일로 보냈어요. 한 시간 동안 쓸 수 있어요.",
    "setPassword.profile": "프로필로 돌아가기",

    "changePassword.title": "비밀번호 변경",
    "changePassword.currentPassword": "현재 비밀번호",
    "changePassword.password": "새 비밀번호",
    "changePassword.passwordConfirmation": "비밀번호 확인",
    "changePassword.forgotPassword": "비밀번호를 잊으셨나요?",
    "changePassword.submit": "비밀번호 변경",
    "ChangePassword.WrongPassword": "비밀번호가 맞지 않아요.",

    "changeEmailAddress.title": "이메일 주소 변경",
    "changeEmailAddress.emailAddress": "새 이메일 주소",
    "changeEmailAddress.currentPassword": "현재 비밀번호",
    "changeEmailAddress.submit": "확인 링크 보내기",
    "changeEmailAddress.sent.title": "이메일을 확인하세요",
    "changeEmailAddress.sent.explanation":
      "주소를 옮기는 것을 확인하는 링크를 새 이메일 주소로 보냈어요. 로그인한 상태에서 링크를 눌러 계정을 옮겨 주세요.",
    "changeEmailAddress.confirm.title": "계정 옮기기",
    "changeEmailAddress.confirm.explanation":
      "계정이 {emailAddress}(으)로 옮겨져요. 앞으로는 그 주소로 로그인하세요.",
    "changeEmailAddress.confirm.submit": "내 계정 옮기기",
    "changeEmailAddress.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "changeEmailAddress.noLongerWorks.explanation":
      "만료되었거나, 이미 사용했거나, 로그인한 계정을 위해 보낸 링크가 아니에요. 프로필에서 다시 요청해 주세요.",
    "changeEmailAddress.taken.title": "계정이 옮겨지지 않았어요",
    "changeEmailAddress.profile": "프로필로 돌아가기",
    "ChangeEmailAddress.WrongPassword": "비밀번호가 맞지 않아요.",
    "ChangeEmailAddress.Unchanged": "계정이 이미 이 주소로 되어 있어요.",
    "ChangeEmailAddress.Taken":
      "그 이메일 주소로 이제 다른 계정이 만들어져서, 계정을 그곳으로 옮길 수 없어요.",

    "confirmEmailAddress.title": "이메일 주소 확인",
    "confirmEmailAddress.name": "이름",
    "confirmEmailAddress.password": "비밀번호",
    "confirmEmailAddress.confirmPassword": "비밀번호 확인",
    "confirmEmailAddress.submit": "내 이메일 주소 확인",
    "confirmEmailAddress.signIn": "로그인",
    "confirmEmailAddress.home": "{siteName}(으)로 돌아가기",
    "confirmEmailAddress.confirmed.title": "이메일 주소를 확인했어요",
    "confirmEmailAddress.confirmed.explanation":
      "계정이 준비되었어요. 방금 입력한 이메일 주소와 비밀번호로 로그인해 주세요.",
    "confirmEmailAddress.expired.title": "링크가 만료되었어요",
    "confirmEmailAddress.expired.explanation":
      "이메일 주소를 확인하는 링크는 24시간 동안만 쓸 수 있어요. 새 링크를 요청하면 같은 주소로 보내 드려요.",
    "confirmEmailAddress.expired.newLink": "새 링크 보내 주세요",
    "confirmEmailAddress.noLongerWorks.title": "이 링크는 더 이상 쓸 수 없어요",
    "confirmEmailAddress.noLongerWorks.explanation":
      "이메일에 있던 링크를 끝까지 빠짐없이 눌렀는지 확인해 주세요. 그래도 안 되면 다시 가입하세요. 새 링크를 보내 드려요.",
    "confirmEmailAddress.alreadyConfirmed.title": "이미 확인된 이메일 주소예요",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "더 할 일이 없어요. 확인할 때 정한 비밀번호로 로그인해 주세요.",

    "PersonName.Missing": "이름을 입력해 주세요.",
    "PersonName.TooShort": "이름은 3자 이상이어야 해요.",
    "PersonName.TooLong": "이름은 254자까지 쓸 수 있어요.",
    "WorldRankingName.TooShort": "세계 랭킹 이름은 3자 이상이어야 해요.",
    "WorldRankingName.TooLong": "세계 랭킹 이름은 254자까지 쓸 수 있어요.",
    "Password.Missing": "비밀번호를 입력해 주세요.",
    "Password.TooShort": "비밀번호는 12자 이상이어야 해요.",
    "Password.ConfirmationDiffers":
      "위의 비밀번호와 같지 않아요. 다시 입력해 주세요.",
    "Password.Breached":
      "이 비밀번호는 다른 곳에서 일어난 정보 유출에 나온 적이 있어서 여기서 쓰기에 안전하지 않아요. 다른 것을 골라 주세요.",

    "javaScriptRequired.title": "스크립트가 필요해요",
    "javaScriptRequired.explanation":
      "가입하는 사람이 사람인지 확인하려면 이 사이트에서 스크립트를 켜야 해요. 스크립트를 켠 뒤에 다시 가입해 주세요.",
    "javaScriptRequired.register": "가입으로 돌아가기",
    "javaScriptRequired.home": "{siteName}(으)로 돌아가기",

    "errors.backHome": "{siteName}(으)로 돌아가기",
    "errors.notFound": "찾을 수 없어요",
    "errors.refused": "처리할 수 없었어요",
    "errors.refusedDetail": "보낸 내용 중에 잘못된 부분이 있어요.",
    "errors.sorry": "죄송해요",
    "errors.sorryDetail": "그 요청을 처리할 수 없었어요.",
    "errors.failed": "문제가 생겼어요",
    "errors.reference": "참조 번호 {reference}.",
    "errors.recorded":
      "오류가 기록되었고 관리자에게 이메일이 전송되었어요. 참조 번호와 그때 하고 있던 일을 적어 관리자에게 이메일을 보내 주시면 도움이 돼요.",
    "errors.message": "관리자에게 이메일 보내기",
    "errors.messageSubject": "{siteName}의 오류 {reference}",
    "errors.messageBody": "이 일이 일어났을 때 하고 있던 일:\n\n",
    "errors.unavailable": "사이트를 사용할 수 없어요",
    "errors.unavailableDetail":
      "사이트가 지금 필요한 것에 연결할 수 없어요. 나중에 다시 시도해 주세요.",
    "errors.maintenance": "사이트가 점검 중입니다.",
    "errors.maintenanceMinutes": "약 {minutes}분 후에 복구될 예정입니다.",
    "errors.maintenanceMinute": "약 1분 후에 복구될 예정입니다.",
    "errors.maintenanceLonger": "예상보다 오래 걸리고 있습니다. 곧 복구됩니다.",

    "home.recentResults": "최근 결과",
    "home.recentResults.none": "지난 7일 동안 추가된 경기가 없어요.",
    "home.upcomingTournaments": "다가오는 대회",
    "home.upcomingTournaments.none": "앞으로 60일 안에 시작하는 대회가 없어요.",
    "home.allTournaments": "{year}년의 모든 대회",
    "year.heading": "{year}년의 대회",
    "year.none": "{year}년에 시작하는 대회가 없어요.",
    "yearSport.heading": "{year}년의 {sport} 대회",
    "yearSport.none": "{year}년에 시작하는 {sport} 대회가 없어요.",
    "tournament.recent": "최근",
    "tournament.summary": "요약",
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
    "teamSummary.net": "득실차",
    "tournament.players": "선수",
    "search.label": "검색",
    "search.tournaments": "대회",
    "search.competitions": "경기 종목",
    "search.nothingFound": "아무것도 찾지 못했습니다.",
    "players.search.label": "선수 검색",
    "players.search.prompt": "선수 이름을 입력해 찾아보세요.",
    "players.search.none": "선수를 찾지 못했습니다.",
    "search.more":
      "처음 {count}개만 표시됩니다. 이름을 더 입력해 검색을 좁혀 보세요.",
    "websitePlayer.tournament": "대회",
    "tournament.test": "{first} 대 {second}",
    "tournament.notes": "공지",
    "tournament.commentary": "해설",
    "tournament.beat": "이김",
    "tournament.drewWith": "비김",
    "tournament.ago.seconds": "{count}초",
    "tournament.ago.minutes": "{count}분",
    "tournament.ago.hour": "1시간",
    "tournament.ago.hours": "{count}시간",
    "tournament.none": "아직 경기가 없어요.",
    "players.none": "아직 추가된 선수가 없어요.",
    "commentaries.by": "작성자",
    "commentaries.start": "새 해설 시작하기",
    "commentaries.disclaimer.heading": "면책 사항",
    "commentaries.disclaimer":
      "이 해설에 담긴 견해와 의견은 작성자의 것이며, Tim Murphy나 {site}의 견해를 반드시 대변하는 것은 아니에요.",
    "commentaries.guidelines.heading": "지침",
    "commentaries.guidelines.responsible":
      "해설에 대한 책임은 작성자에게 있어요.",
    "commentaries.guidelines.purpose":
      '해설 기능은 대회에서 일어나는 일을 전하기 위한 것이에요. 응원이나 덕담을 주고받는 "소셜 미디어" 공간으로 만든 것이 아니에요.',
    "commentaries.guidelines.hatred":
      "폭력이나 혐오를 부추길 수 있는 글을 올리지 마세요. 인종, 종교, 민족, 성별, 나이, 정신적 또는 신체적 장애, 성적 지향을 이유로 다른 사람을 모욕하는 글은 허용하지 않아요.",
    "commentaries.guidelines.abuse":
      "이유 없는 욕설은 허용하지 않아요. 여기서의 기본 원칙은 사람이 아니라 경기를 다루라는 거예요. 즉 누군가를 개인적으로 공격하지 말고 눈앞의 문제에 관해서 쓰세요.",
    "commentaries.guidelines.unlawful":
      "저작권 침해 가능성이 있거나 명예를 훼손할 수 있는 글처럼 법적으로 문제의 소지가 있는 댓글은 삭제해요.",
    "commentaries.guidelines.shouting":
      "해설에 욕설을 쓰거나 모두 대문자로 쓰지 말아 주세요.",
    "commentaries.guidelines.selling":
      "댓글란을 상업적 목적이나 스팸에 쓰지 마세요. 상품이나 서비스를 광고하거나 홍보하거나 권유하는 댓글은 삭제해요.",
    "commentaries.guidelines.links":
      "댓글에는 링크를 되도록 적게 써 주세요. 부적절한 내용으로 연결되는 링크가 담긴 댓글은 삭제해요.",
    "commentaries.guidelines.impersonating":
      "댓글란에서 다른 사람을 사칭하거나, 의도치 않게 누군가를 위험에 빠뜨릴 수 있는 전화번호, 우편 주소, 이메일 주소 같은 개인 정보를 올리지 마세요.",
    "commentaries.reporting.heading": "해설 신고하기",
    "commentaries.reporting.before":
      "이 지침에 맞지 않는 해설은 다음 주소로 신고해 주세요:",
    "commentaries.reporting.after":
      ". 웹 주소와 문제가 되는 해설을 함께 적어 주세요. 예:",
    "commentaries.reporting.exampleComment": '"삭제해야 할 댓글"',
    "commentaries.reporting.exampleReason":
      "이 댓글은 다음 이유로 삭제해야 해요...",
    "commentaries.reporting.reviewed":
      "신고한다고 해서 바로 삭제되는 것은 아니지만, 모든 신고는 검토해요.",
    "commentaries.reporting.reserved":
      "{site}은(는) 해설을 삭제할 권리가 있어요.",
    "commentaries.reporting.subject": "{site} 해설 신고",
    "commentaries.reporting.body":
      "웹 주소, 문제가 되는 댓글, 삭제해야 하는 이유를 적어 주세요.",
    "startCommentary.title": "새 해설 시작하기",
    "startCommentary.titleField": "제목",
    "startCommentary.submit": "해설 시작",
    "marks.new": "새 글",
    "notes.none": "운영자가 쓴 공지가 아직 없어요.",
    "note.edited": "수정됨",
    "commentary.none": "아직 작성된 댓글이 없어요.",
    "commentary.edited": "수정됨",
    "commentary.edit": "수정",
    "commentary.delete": "삭제",
    "commentary.comment": "댓글",
    "commentary.add": "댓글 달기",
    "commentary.notSent":
      "댓글을 보내지 못했어요. 페이지를 다시 불러와서 저장되었는지 확인해 주세요.",
    "changeCommentaryTitle.title": "제목 변경",
    "changeCommentaryTitle.submit": "저장",
    "editComment.title": "댓글 수정",
    "editComment.save": "저장",
    "deleteComment.title": "댓글 삭제",
    "deleteComment.question": "이 댓글을 삭제할까요? 되돌릴 수 없어요.",
    "deleteComment.confirm": "댓글 삭제",
    "deleteComment.keep": "그대로 두기",
    "player.games": "게임",
    "player.competitions": "경기 종목",
    "player.beat": "이김",
    "player.lostTo": "짐",
    "player.drewWith": "비김",
    "player.score": "{opponent}에게 {score}",
    "player.noGames": "아직 치른 게임이 없어요.",
    "player.noCompetitions": "아직 참가한 경기 종목이 없어요.",
    "block.wins": "승",
    "block.matches": "매치",
    "block.netGames": "게임 득실차",
    "block.games": "게임",
    "block.netHoops": "후프 득실차",
    "block.won": "승",
    "block.lost": "패",
    "block.drawn": "무",
    "block.withdrawn": "기권",
    "block.gameWithdrawn": "기권",
    "block.losses": "패",
    "competition.views": "보기",
    "competition.view.grid": "표",
    "competition.view.summary": "요약",
    "competition.view.orderOfPlay": "경기 순서",
    "blockSummary.ranking":
      "매치 승률 순으로, 같으면 후프 득실차 순으로 순위를 매겼어요. 대회 자체의 규정은 선수 순위를 다르게 정할 수 있어요.",
    "orderOfPlay.none": "아직 치른 게임이 없어요.",
    "knockout.round.final": "결승",
    "knockout.round.semis": "준결승",
    "knockout.round.quarters": "8강",
    "knockout.round.number": "{number}라운드",
    "knockout.bye": "부전승",
    "swiss.games": "게임",
    "swiss.wins": "승",
    "swiss.winShare": "승률",
    "swiss.results": "결과",
    "knockout.onward": "다음 라운드",
    "knockout.back": "이전 라운드",
    "tournamentList.column.date": "날짜",
    "tournamentList.column.name": "이름",
    "tournamentList.onlyIn": "{country}의 대회만",
    "tournamentList.filter.country": "나라",
    "tournamentList.filter.anyCountry": "모든 나라",
    "tournamentList.filter.region": "지역",
    "tournamentList.filter.anyRegion": "모든 지역",
    "tournamentList.filter.sport": "종목",
    "tournamentList.filter.anySport": "모든 종목",
    "tournamentList.filter.submit": "적용",
    "years.label": "연도",
    "years.earlier": "이전 연도",

    "admin.newerBuild.message": "이 사이트의 새 버전이 있어요.",
    "admin.newerBuild.reload": "새로 고침",
    "admin.title": "관리",
    "admin.tournaments.new": "새 대회",
    "admin.tournaments.none": "대회가 없어요",
    "admin.tournaments.archived": "보관됨",
    "admin.tournaments.manage": "운영",
    "admin.tournaments.edit": "수정",
    "admin.tournaments.archive": "보관",
    "admin.tournaments.restore": "복원",
    "admin.tournaments.scores": "점수",
    "admin.tournaments.players": "선수",
    "admin.years.label": "연도",
    "admin.years.earlier": "이전 연도",
    "admin.tournament.name": "이름",
    "admin.tournament.starts": "시작",
    "admin.tournament.finishes": "종료",
    "admin.tournament.format": "방식",
    "admin.tournament.sport": "종목",
    "admin.tournament.country": "나라",
    "admin.tournament.region": "지역",
    "admin.tournament.subtitle": "부제",
    "admin.tournament.handicap": "핸디캡 적용",
    "admin.tournament.drawsAllowed": "무승부 허용",
    "admin.tournament.levelTestsDrawn": "동점 테스트는 무승부",
    "admin.tournament.worldRankings": "세계 랭킹에 반영",
    "admin.tournament.national": "국내 수준 대회",
    "admin.tournament.international": "국제 수준 대회",
    "admin.tournament.otherwise": "이 내용은 그대로 받아들일 수 없어요.",
    "admin.newTournament.title": "새 대회",
    "admin.newTournament.submit": "대회 만들기",
    "admin.editTournament.title": "대회 수정",
    "admin.editTournament.submit": "대회 업데이트",
    "admin.editTournament.otherwise": "이 대회는 변경할 수 없어요.",
    "admin.view.tabs": "대회",
    "admin.view.players": "선수",
    "admin.view.competitions": "경기 종목",
    "admin.view.managers": "운영자",
    "admin.view.notes": "공지",
    "admin.view.scorers": "기록원",
    "admin.view.rankings": "랭킹",
    "admin.rankings.textFile":
      "대회 결과는 입력된 경기를 바탕으로 사이트가 작성한 텍스트 파일로 세계 랭킹에 전송됩니다.",
    "admin.rankings.spreadsheet":
      "대회 결과는 입력된 경기를 바탕으로 사이트가 작성한 스프레드시트로 세계 랭킹에 전송됩니다.",
    "admin.rankings.fillInWinners":
      "사이트는 각 경기 종목의 우승자를 추측할 수만 있으므로, 파일을 보내기 전에 각 항목의 Winner 줄을 확인하세요.",
    "admin.rankings.fillInWinner":
      "사이트는 대회 우승자를 알 수 없으므로, 보내기 전에 스프레드시트 맨 아래에 입력하세요.",
    "admin.rankings.sendIt": "그런 다음 파일을 세계 랭킹 담당자에게 보내세요.",
    "admin.rankings.download": "랭킹 다운로드",
    "rankings.notAvailable": "랭킹을 사용할 수 없습니다",
    "rankings.notAvailable.sport":
      "이 대회의 종목에는 세계 랭킹이 없으므로 보낼 랭킹이 없습니다.",
    "rankings.notAvailable.handicap":
      "이 대회는 핸디캡으로 진행되므로 세계 랭킹에 반영되지 않습니다.",
    "rankings.notAvailable.drawnGames":
      "이 대회는 무승부를 허용하므로 세계 랭킹에 반영되지 않습니다.",
    "rankings.notAvailable.notCounted":
      "이 대회의 관리자가 세계 랭킹에 반영하지 않기로 설정했습니다.",
    "admin.view.otherwise": "이 대회는 여기서 운영할 수 없어요.",
    "admin.competitionView.tabs": "경기 종목",
    "admin.competitionView.players": "선수",
    "admin.competitionView.scores": "점수",
    "admin.sections.label": "대회와 경기 종목",
    "admin.sections.tournament": "대회",
    "admin.administrator.sections.label": "관리자 페이지",
    "admin.administrator.sections.tournaments": "대회",
    "admin.administrator.sections.accounts": "계정",
    "admin.administrator.sections.worldRankings": "세계 랭킹",
    "admin.administrator.sections.importErrors": "가져오기 오류",
    "admin.administrator.sections.logs": "로그",
    "admin.administrator.sections.databaseStatus": "데이터베이스 접근",
    "admin.databaseStatus.title": "데이터베이스 접근",
    "admin.databaseStatus.on": "데이터베이스 접근이 켜져 있습니다.",
    "admin.databaseStatus.off": "데이터베이스 접근이 꺼져 있습니다.",
    "admin.databaseStatus.expected":
      "사이트는 {minutes}분 후에 복구될 예정입니다.",
    "admin.databaseStatus.expectedOne": "사이트는 1분 후에 복구될 예정입니다.",
    "admin.databaseStatus.longer": "예상보다 오래 걸리고 있습니다.",
    "admin.databaseStatus.told": "방문자에게 표시: {words}",
    "admin.databaseStatus.toldUsual": "방문자에게 평소 문구를 표시합니다.",
    "admin.databaseStatus.minutes": "예상 시간(분)",
    "admin.databaseStatus.words": "방문자용 문구",
    "admin.databaseStatus.turnOff": "끄기",
    "admin.databaseStatus.change": "변경",
    "admin.databaseStatus.turnOn": "켜기",
    "admin.databaseStatus.minutesNeeded": "분을 입력해야 합니다.",
    "admin.databaseStatus.otherwise": "사이트에서 문제가 발생했습니다.",
    "DatabaseAccess.MinutesNotWhole": "분은 정수여야 합니다.",
    "DatabaseAccess.MinutesOutOfRange": "분은 1에서 1440 사이여야 합니다.",
    "DatabaseAccess.WordsTooLong": "문구는 500자를 넘을 수 없습니다.",
    "DatabaseAccess.NotOff": "데이터베이스 접근이 꺼져 있지 않습니다.",
    "admin.administrator.title": "관리자",
    "admin.accounts.title": "계정",
    "admin.roles.add": "추가",
    "admin.roles.administrator.heading": "관리자",
    "admin.roles.administrator.none": "다른 관리자가 없어요",
    "admin.roles.administrator.removeTitle": "관리자 제외",
    "admin.roles.administrator.removeExplanation":
      "{name} 님은 더 이상 이 사이트의 관리자가 아니게 돼요.",
    "admin.roles.world-ranking-officer.heading": "세계 랭킹 담당자",
    "admin.roles.world-ranking-officer.none": "세계 랭킹 담당자가 없어요",
    "admin.roles.world-ranking-officer.removeTitle": "세계 랭킹 담당자 제외",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} 님은 더 이상 세계 랭킹 담당자가 아니게 돼요.",
    "admin.worldRankings.title": "세계 랭킹 선수 가져오기",
    "admin.worldRankings.import": "가져오기",
    "admin.worldRankings.log": "가져오기 진행 기록",
    "admin.worldRankings.ac.reading": "어소시에이션 크로켓 목록을 읽는 중",
    "admin.worldRankings.ac.read": "읽은 어소시에이션 크로켓 선수: {players}",
    "admin.worldRankings.ac.kept": "유지한 어소시에이션 크로켓 선수: {players}",
    "admin.worldRankings.ac.refused":
      "어소시에이션 크로켓 목록을 읽을 수 없어서 선수들을 그대로 두었어요.",
    "admin.worldRankings.gc.reading": "골프 크로켓 목록을 읽는 중",
    "admin.worldRankings.gc.read": "읽은 골프 크로켓 선수: {players}",
    "admin.worldRankings.gc.kept": "유지한 골프 크로켓 선수: {players}",
    "admin.worldRankings.gc.refused":
      "골프 크로켓 목록을 읽을 수 없어서 선수들을 그대로 두었어요.",
    "admin.worldRankings.finished": "완료",
    "admin.worldRankings.failed": "가져오기를 끝내지 못했어요.",
    "admin.worldRankings.otherwise": "사이트에 문제가 생겼어요.",
    "WorldRankingLists.Unreachable": "세계 랭킹 사이트에 연결할 수 없어요.",
    "WorldRankingLists.Unreadable":
      "목록이 세계 랭킹의 형식과 달라요. 읽을 수 없는 줄이 있거나, 선수가 한 명도 없거나, UTF-8로 쓰여 있지 않아요.",
    "admin.importErrors.title": "가져오기 오류",
    "admin.importErrors.none": "가져오기 오류가 없어요",
    "admin.importErrors.otherwise": "사이트에 문제가 생겼어요.",
    "admin.logs.title": "로그",
    "admin.logs.severity": "심각도",
    "admin.logs.text": "검색",
    "admin.logs.show": "표시",
    "admin.logs.prune": "정리",
    "admin.logs.pruneAsk":
      "최근 한 시간 이전의 로그를 삭제할까요? 되돌릴 수 없습니다.",
    "admin.logs.removed": "항목 {count}개를 삭제했습니다",
    "admin.logs.none": "로그 항목 없음",
    "admin.logs.otherwise": "사이트에 문제가 생겼어요.",
    "admin.hover.logs.show": "일치하는 항목 표시",
    "admin.hover.logs.prune": "최근 한 시간 이전의 로그 삭제",
    "admin.hover.logs.pruneAgree": "최근 한 시간 이전의 로그 삭제",
    "admin.importError.title": "가져오기 오류",
    "admin.importError.documentId": "문서 ID",
    "admin.importError.tournament": "대회",
    "admin.importError.competition": "경기 종목",
    "admin.importError.newSite": "새 사이트",
    "admin.importError.oldSite": "이전 사이트",
    "ImportErrorKept.NotFound":
      "가져오기가 그 문서에 대한 오류를 남기지 않았어요.",
    "admin.competitionView.otherwise":
      "이 경기 종목은 여기서 운영할 수 없어요.",
    "admin.competitions.block": "블록",
    "admin.competitions.knockout": "녹아웃",
    "admin.competitions.swiss": "스위스",
    "admin.competitions.view": "보기",
    "admin.competitions.edit": "수정",
    "admin.competitions.up": "위로",
    "admin.competitions.down": "아래로",
    "admin.competitions.archive": "보관",
    "admin.competitions.restore": "복원",
    "admin.competitions.archived": "보관된 경기 종목",
    "admin.competitions.none": "경기 종목이 없어요",
    "admin.competitions.add": "경기 종목 추가",
    "admin.competition.addTitle": "경기 종목 추가",
    "admin.competition.editTitle": "경기 종목 수정",
    "admin.competition.name": "이름",
    "admin.competition.kind": "유형",
    "admin.competition.bestOf": "다승제",
    "admin.competition.rounds": "라운드 수",
    "admin.competition.places": "자리 수",
    "admin.competition.round": "{number}라운드",
    "admin.competition.bestOfs": "라운드별 다승제",
    "admin.competition.quarters": "8강",
    "admin.competition.semis": "준결승",
    "admin.competition.final": "결승",
    "admin.competition.add": "추가",
    "admin.competition.save": "저장",
    "admin.competition.added": "{name}을(를) 추가했어요.",
    "admin.competition.otherwise": "이 경기 종목은 그대로 저장할 수 없어요.",
    "CompetitionName.Missing": "이름을 입력해 주세요.",
    "CompetitionName.TooLong": "이름은 254자까지 쓸 수 있어요.",
    "CompetitionName.NoLetterOrDigit": "이름에는 글자나 숫자가 있어야 해요.",
    "Tournament.KnockoutPlayerHasGames":
      "이 대진표의 선수들에게 게임이 있어서 자리를 바꿀 수 없어요.",
    "Tournament.CompetitionNameTaken":
      "이 대회의 다른 경기 종목이 이미 그 이름을 쓰고 있어요.",
    "BestOf.NotWhole": "게임 수를 정수로 입력해 주세요.",
    "BestOf.TooSmall": "매치는 최소 1게임 다승제여야 해요.",
    "Rounds.NotWhole": "라운드 수는 정수로 입력해 주세요.",
    "Rounds.TooSmall": "블록은 최소 1라운드는 치러야 해요.",
    "KnockoutDraw.EvenBestOf":
      "녹아웃의 매치에는 승자가 있어야 하므로, 홀수 게임 다승제여야 해요.",
    "admin.hover.tournaments.new": "새 대회 만들기",
    "admin.hover.tournaments.manage":
      "이 대회의 선수, 팀, 경기 종목, 점수를 운영해요",
    "admin.hover.tournaments.edit": "이 대회의 세부 내용을 바꿔요",
    "admin.hover.tournaments.scores": "이 대회의 점수를 입력해요",
    "admin.hover.tournaments.players": "이 대회의 선수를 관리해요",
    "admin.hover.competitions.view":
      "이 경기 종목을 열어 선수와 점수를 보고 입력해요",
    "admin.hover.tests.view": "이 테스트를 열어 점수를 보고 입력해요",
    "admin.hover.teams.view": "이 팀을 열어 선수를 보고 관리해요",
    "admin.hover.dialog.player.add": "이 선수를 대회에 추가해요",
    "admin.hover.dialog.player.save": "이 선수의 변경 내용을 저장해요",
    "admin.hover.dialog.team.add": "이 팀을 대회에 추가해요",
    "admin.hover.dialog.team.save": "이 팀의 변경 내용을 저장해요",
    "admin.hover.dialog.test.add": "이 테스트를 대회에 추가해요",
    "admin.hover.dialog.test.save": "이 테스트의 변경 내용을 저장해요",
    "admin.hover.dialog.competition.add": "이 경기 종목을 대회에 추가해요",
    "admin.hover.dialog.competition.save":
      "이 경기 종목의 변경 내용을 저장해요",
    "admin.hover.dialog.score.add": "이 점수를 경기 종목에 추가해요",
    "admin.hover.dialog.score.save": "이 점수의 정정 내용을 저장해요",
    "admin.hover.dialog.carryForward.save": "이 선수의 결과를 이월해요",
    "admin.hover.dialog.tournament.new": "이 대회를 만들어요",
    "admin.hover.dialog.tournament.edit": "이 대회의 변경 내용을 저장해요",
    "admin.hover.modal.cancel": "아무것도 저장하지 않고 닫아요",
    "admin.hover.modal.ok": "이 메시지를 닫아요",
    "admin.hover.tab": "{name} 탭을 보여 줘요",
    "admin.hover.tournaments.archive":
      "이 대회를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.tournaments.restore": "보관된 이 대회를 되돌려요",
    "admin.hover.players.add": "이 대회에 선수를 추가해요",
    "admin.hover.players.edit": "이 선수의 세부 내용을 바꿔요",
    "admin.hover.players.up": "이 선수를 목록에서 위로 옮겨요",
    "admin.hover.players.down": "이 선수를 목록에서 아래로 옮겨요",
    "admin.hover.players.archive":
      "이 선수를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.players.restore": "보관된 이 선수를 되돌려요",
    "admin.hover.teams.add": "이 대회에 팀을 추가해요",
    "admin.hover.teams.edit": "이 팀의 세부 내용을 바꿔요",
    "admin.hover.teams.up": "이 팀을 목록에서 위로 옮겨요",
    "admin.hover.teams.down": "이 팀을 목록에서 아래로 옮겨요",
    "admin.hover.teams.archive": "이 팀을 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.teams.restore": "보관된 이 팀을 되돌려요",
    "admin.hover.competitions.add": "이 대회에 경기 종목을 추가해요",
    "admin.hover.competitions.edit": "이 경기 종목의 세부 내용을 바꿔요",
    "admin.hover.competitions.up": "이 경기 종목을 목록에서 위로 옮겨요",
    "admin.hover.competitions.down": "이 경기 종목을 목록에서 아래로 옮겨요",
    "admin.hover.competitions.archive":
      "이 경기 종목을 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.competitions.restore": "보관된 이 경기 종목을 되돌려요",
    "admin.hover.tests.add": "두 팀 사이의 테스트를 추가해요",
    "admin.hover.tests.edit": "이 테스트의 세부 내용을 바꿔요",
    "admin.hover.tests.up": "이 테스트를 목록에서 위로 옮겨요",
    "admin.hover.tests.down": "이 테스트를 목록에서 아래로 옮겨요",
    "admin.hover.tests.archive":
      "이 테스트를 보관해요. 나중에 복원할 수 있어요",
    "admin.hover.tests.restore": "보관된 이 테스트를 되돌려요",
    "admin.hover.tests.toTeams": "팀 탭으로 가서 테스트에 필요한 팀을 추가해요",
    "admin.hover.scores.add": "이 경기 종목에 게임 점수를 추가해요",
    "admin.hover.scores.edit": "이 점수를 정정해요",
    "admin.hover.scores.archive":
      "이 점수를 보관해서 반영되지 않게 해요. 나중에 복원할 수 있어요",
    "admin.hover.scores.restore":
      "보관된 이 점수를 되돌려서 다시 반영되게 해요",
    "admin.hover.scores.withdraw": "이 점수를 목록에는 두되 반영되지 않게 해요",
    "admin.hover.scores.unwithdraw": "기권 처리한 이 점수를 다시 반영되게 해요",
    "admin.hover.scores.up": "이 점수를 목록에서 앞으로 옮겨요",
    "admin.hover.scores.down": "이 점수를 목록에서 뒤로 옮겨요",
    "admin.hover.competitionPlayers.add": "선택한 선수를 이 경기 종목에 넣어요",
    "admin.hover.competitionPlayers.up": "이 선수를 목록에서 위로 옮겨요",
    "admin.hover.competitionPlayers.down": "이 선수를 목록에서 아래로 옮겨요",
    "admin.hover.competitionPlayers.remove": "이 선수를 경기 종목에서 빼요",
    "admin.hover.competitionPlayers.withdraw":
      "이 선수를 경기 종목에서 기권시켜요",
    "admin.hover.competitionPlayers.unwithdraw":
      "기권한 이 선수를 경기 종목에 다시 넣어요",
    "admin.hover.competitionPlayers.carryForward":
      "다른 경기 종목에서 이 선수의 결과를 이월해 와요",
    "admin.hover.notes.add": "이 대회의 새 공지를 써요",
    "admin.hover.notes.edit": "이 공지를 바꿔요",
    "admin.hover.notes.delete": "이 공지를 삭제해요",
    "admin.hover.note.add": "이 공지를 저장해서 대회에 추가해요",
    "admin.hover.note.save": "이 공지의 변경 내용을 저장해요",
    "admin.hover.people.add": "이 사람에게 역할을 줘요",
    "admin.hover.people.remove": "이 사람에게서 역할을 거두어요",
    "admin.hover.worldRankings.import": "세계 랭킹을 가져와서 선수를 추가해요",
    "admin.modal.cancel": "취소",
    "admin.modal.ok": "확인",
    "admin.people.emailAddress": "이메일 주소",
    "admin.people.remove": "제외",
    "admin.people.otherwise": "처리할 수 없었어요.",
    "admin.managers.you": "나",
    "admin.managers.add": "운영자 추가",
    "admin.managers.none": "운영자가 없어요",
    "admin.managers.removeTitle": "운영자 제외",
    "admin.managers.removeExplanation":
      "{name} 님은 더 이상 이 대회를 운영할 수 없게 돼요.",
    "admin.managers.removeYourself.explanation":
      "더 이상 이 대회를 운영할 수 없게 되고, 여기 있는 누구도 그것을 되돌려 줄 수 없어요. 다른 운영자가 다시 운영자로 만들어 줄 수 있어요.",
    "admin.managers.otherwise": "그 주소는 운영자로 만들 수 없어요.",
    "admin.competitionPlayers.add": "선수 추가",
    "admin.competitionPlayers.otherwise": "이 선수는 추가할 수 없어요.",
    "admin.competitionPlayers.choose": "추가할 선수",
    "admin.competitionPlayers.nobody": "선수를 선택하세요",
    "admin.competitionPlayers.bye": "부전승",
    "admin.competitionPlayers.all": "모든 선수가 경기 종목에 들어 있어요",
    "admin.competitionPlayers.none": "선수가 없어요",
    "admin.competitionPlayers.up": "위로",
    "admin.competitionPlayers.down": "아래로",
    "admin.competitionPlayers.remove": "제외",
    "admin.competitionPlayers.withdraw": "기권",
    "admin.competitionPlayers.unwithdraw": "기권 취소",
    "admin.competitionPlayers.withdrawn": "기권한 선수",
    "admin.competitionPlayers.removeTitle": "선수 제외",
    "admin.competitionPlayers.removeQuestion":
      "{name} 님을 경기 종목에서 뺄 거예요. 되돌릴 수 없어요.",
    "admin.competitionPlayers.withdrawTitle": "선수 기권",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} 님은 이 경기 종목을 더 치르지 않고, 치르지 않은 게임은 상대 없이 결정돼요.",
    "admin.competitionPlayers.carryForward": "이월",
    "admin.carryForward.title": "이월 - {name}",
    "admin.carryForward.save": "저장",
    "admin.carryForward.otherwise": "이 이월은 저장할 수 없어요.",
    "admin.carryForward.matchWins": "매치 승",
    "admin.carryForward.matchLosses": "매치 패",
    "admin.carryForward.gameWins": "게임 승",
    "admin.carryForward.gameLosses": "게임 패",
    "admin.carryForward.hoopsFor": "득점 후프",
    "admin.carryForward.hoopsAgainst": "실점 후프",
    "CarryForward.MatchWinsNotWhole": "매치 승 수를 정수로 입력해 주세요.",
    "CarryForward.MatchWinsBelowZero": "매치 승 수는 0 이상으로 입력해 주세요.",
    "CarryForward.MatchLossesNotWhole": "매치 패 수를 정수로 입력해 주세요.",
    "CarryForward.MatchLossesBelowZero":
      "매치 패 수는 0 이상으로 입력해 주세요.",
    "CarryForward.GameWinsNotWhole": "게임 승 수를 정수로 입력해 주세요.",
    "CarryForward.GameWinsBelowZero": "게임 승 수는 0 이상으로 입력해 주세요.",
    "CarryForward.GameLossesNotWhole": "게임 패 수를 정수로 입력해 주세요.",
    "CarryForward.GameLossesBelowZero":
      "게임 패 수는 0 이상으로 입력해 주세요.",
    "CarryForward.HoopsForNotWhole": "득점 후프 수를 정수로 입력해 주세요.",
    "CarryForward.HoopsForBelowZero":
      "득점 후프 수는 0 이상으로 입력해 주세요.",
    "CarryForward.HoopsAgainstNotWhole": "실점 후프 수를 정수로 입력해 주세요.",
    "CarryForward.HoopsAgainstBelowZero":
      "실점 후프 수는 0 이상으로 입력해 주세요.",
    "admin.scores.add": "점수 추가",
    "admin.scores.none": "점수가 없어요",
    "admin.scores.edit": "수정",
    "admin.scores.drawNotFilledTitle": "대진표가 다 채워지지 않았어요",
    "admin.scores.archive": "보관",
    "admin.scores.up": "위로",
    "admin.scores.down": "아래로",
    "admin.scores.restore": "복원",
    "admin.scores.archived": "보관된 점수",
    "admin.scores.archivedSaid": "보관됨",
    "admin.scores.withdraw": "기권",
    "admin.scores.unwithdraw": "기권 취소",
    "admin.scores.withdrawnSaid": "기권",
    "admin.scores.otherwise": "처리할 수 없었어요.",
    "admin.score.title": "점수 추가",
    "admin.score.add": "게임 추가",
    "admin.score.winner": "승자",
    "admin.score.winnerScore": "승자의 점수",
    "admin.score.loser": "패자",
    "admin.score.loserScore": "패자의 점수",
    "admin.score.beat": "이김",
    "admin.score.added": "{winner} 님이 {loser} 님을 이긴 게임을 추가했어요.",
    "admin.score.otherwise": "게임을 추가할 수 없었어요.",
    "admin.score.correctTitle": "점수 수정",
    "admin.score.save": "저장",
    "admin.score.notCorrected": "점수를 정정할 수 없었어요.",
    "Game.WinnerMissing": "승자를 선택해 주세요.",
    "Game.WinnerScoreMissing": "승자의 점수를 입력해 주세요.",
    "Game.LoserMissing": "패자를 선택해 주세요.",
    "Game.LoserScoreMissing": "패자의 점수를 입력해 주세요.",
    "Score.NoPoints": "점수는 득점 수로 시작해야 해요.",
    "Game.SamePlayer": "자기 자신과는 겨룰 수 없어요.",
    "Game.WinnerNotAhead":
      "승자의 점수는 패자의 점수보다 높거나, 승리로 표시되어야 해요.",
    "Game.LoserMarked": "패자의 점수는 승리로 표시할 수 없어요.",
    "Game.ResultChanged":
      "정정해도 결과는 그대로예요. 이긴 게임은 이긴 채로, 비긴 게임은 비긴 채로 남아요.",
    "Competition.MatchDecided": "두 선수의 매치는 이미 결정되었어요.",
    "Competition.DrawFull": "녹아웃이 가득 차서 선수를 추가할 수 없어요.",
    "Competition.DrawNotFilled":
      "녹아웃의 모든 자리가 선수나 부전승으로 채워지기 전에는 점수를 추가할 수 없어요.",
    "Competition.ByeOutsideKnockout": "부전승은 녹아웃에만 있을 수 있어요.",
    "Competition.NotDrawnToMeet":
      "이 선수들은 지금 녹아웃에서 서로 겨루도록 대진이 짜여 있지 않아요.",
    "Competition.WinnerHasPlayedOn":
      "이 매치의 승자가 이미 다음 게임을 치렀기 때문에, 누가 이겼는지는 바꿀 수 없어요.",
    "CompetitionPlayer.Withdrawn":
      "기권한 선수는 더 이상 경기를 치르지 않아요.",
    "admin.players.add": "선수 추가",
    "admin.players.none": "선수가 없어요",
    "admin.players.edit": "수정",
    "admin.players.archive": "보관",
    "admin.players.restore": "복원",
    "admin.players.up": "위로",
    "admin.players.down": "아래로",
    "admin.players.archiveTitle": "선수 보관",
    "admin.players.archiveQuestion": "{name} 님이 다음 경기 종목에서 빠져요:",
    "admin.players.archive.explanation":
      "복원해도 이 경기 종목들에 다시 들어가지는 않아요.",
    "admin.players.archived": "보관된 선수",
    "admin.players.archivedSaid": "보관됨",
    "admin.player.addTitle": "선수 추가",
    "admin.player.editTitle": "선수 수정",
    "admin.player.name": "이름",
    "admin.player.representing": "소속",
    "admin.player.worldRankingName": "세계 랭킹 선수 이름",
    "admin.player.worldRankingKnown": "세계 랭킹에 있는 이름이에요.",
    "admin.player.worldRankingQuestioned":
      "세계 랭킹에 이 이름의 선수가 없어요. 철자가 틀렸거나, 랭킹에 새로 오른 선수일 수 있어요.",
    "admin.player.flag": "국기",
    "admin.player.add": "추가",
    "admin.player.save": "저장",
    "admin.player.added": "{name} 님을 추가했어요.",
    "admin.player.otherwise": "이 선수는 이대로 저장할 수 없어요.",
    "Tournament.PlayerNameTaken":
      "이 대회의 다른 선수가 이미 그 이름을 쓰고 있어요.",
    "TournamentPlayer.NoSuchFlag": "있는 국기 중에서 골라 주세요.",
    "TournamentPlayer.NamedBye": "선수 이름을 Bye로 할 수 없어요.",
    "TournamentPlayer.NoLetterOrDigit": "이름에는 글자나 숫자가 있어야 해요.",
    "admin.player.byesTitle": "부전승은 추가할 필요가 없어요",
    "admin.player.byes":
      "부전승은 대회의 선수가 아니에요. 녹아웃은 선수를 추가할 때마다, 대진에 필요한 만큼 부전승을 고를 수 있게 해 줘요.",
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
      "AUS v ENG처럼 팀의 테스트를 부르는 이름이에요.",
    "admin.team.flag": "국기",
    "admin.team.add": "추가",
    "admin.team.save": "저장",
    "admin.team.added": "{name}을(를) 추가했어요.",
    "admin.team.otherwise": "이 팀은 그대로 저장할 수 없어요.",
    "admin.teamView.otherwise": "이 팀은 여기서 볼 수 없어요.",
    "admin.teamView.players": "선수",
    "TeamName.Missing": "팀 이름을 입력해 주세요.",
    "TeamName.TooLong": "이름이 너무 길어요.",
    "admin.notes.add": "공지 추가",
    "admin.notes.none": "공지가 없어요",
    "admin.notes.edit": "수정",
    "admin.notes.delete": "삭제",
    "admin.notes.deleteTitle": "공지 삭제",
    "admin.notes.deleteQuestion": "“{title}” 공지를 삭제할까요?",
    "admin.notes.delete.explanation":
      "삭제한 공지는 영영 사라지고 되돌릴 수 없어요.",
    "admin.notes.otherwise": "처리할 수 없었어요.",
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
    "admin.note.otherwise": "이 공지는 그대로 저장할 수 없어요.",
    "ManagerNoteTitle.Missing": "공지에 제목을 붙여 주세요.",
    "ManagerNoteTitle.TooLong": "제목이 너무 길어요.",
    "ManagerNoteTitle.NoLetterOrDigit": "제목에는 글자나 숫자가 있어야 해요.",
    "ManagerNoteDescription.TooLong": "내용이 너무 길어요.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "EditManagerNote.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "DeleteManagerNote.NoSuchManagerNote":
      "그 공지는 더 이상 없어요. 다른 운영자가 삭제했을 수 있어요.",
    "ManagerNote.Deleted":
      "그 공지는 삭제되었어요. 다른 운영자가 삭제했을 수 있어요.",
    "CommentaryTitle.Missing": "해설에 제목을 붙여 주세요.",
    "CommentaryTitle.TooLong": "제목이 너무 길어요.",
    "CommentaryTitle.NoLetterOrDigit": "제목에는 글자나 숫자가 있어야 해요.",
    "Commentary.TitleTaken": "다른 해설이 이미 그 제목을 쓰고 있어요.",
    "CommentText.Missing": "댓글에 내용을 써 주세요.",
    "CommentText.TooLong": "댓글이 너무 길어요.",
    "TeamShortName.Missing": "팀의 약칭을 입력해 주세요.",
    "TeamShortName.TooLong": "약칭은 10자까지 쓸 수 있어요.",
    "TeamShortName.NoLetterOrDigit": "약칭에는 글자나 숫자가 있어야 해요.",
    "Team.ShortNameLongerThanName": "약칭은 팀 이름보다 길 수 없어요.",
    "Team.NoSuchFlag": "있는 국기 중에서 골라 주세요.",
    "Team.Archived": "그 팀은 보관되어 있어서, 먼저 복원해야 해요.",
    "Team.InATest": "그 팀은 테스트에 나가서 보관할 수 없어요.",
    "Team.PlayerNameTaken": "이 팀의 다른 선수가 이미 그 이름을 쓰고 있어요.",
    "TeamPlayer.NamedBye": "선수 이름을 Bye로 할 수 없어요.",
    "TeamPlayer.Archived": "그 선수는 보관되어 있어서, 먼저 복원해야 해요.",
    "TeamPlayer.HasGames": "그 선수는 경기를 치러서 보관할 수 없어요.",
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
      "테스트는 두 팀 사이에서 치르므로, 먼저 두 팀이 있어야 해요.",
    "admin.tests.toTeams": "팀으로 가기",
    "admin.tests.matches.one": "{count}매치",
    "admin.tests.matches.other": "{count}매치",
    "admin.tests.bestOf": "{games}판 다승제",
    "admin.tests.otherwise": "처리할 수 없었어요.",
    "admin.test.addTitle": "테스트 추가",
    "admin.test.editTitle": "테스트 수정",
    "admin.test.firstTeam": "A팀",
    "admin.test.secondTeam": "B팀",
    "admin.test.versus": "v",
    "admin.test.starts": "시작",
    "admin.test.finishes": "종료",
    "admin.test.expectedMatches": "예정 매치 수",
    "admin.test.bestOf": "다승제",
    "admin.test.group": "그룹",
    "admin.test.add": "추가",
    "admin.test.save": "저장",
    "admin.test.added": "{name}을(를) 추가했어요.",
    "admin.test.otherwise": "이 테스트는 그대로 저장할 수 없어요.",
    "admin.testView.otherwise": "이 테스트는 여기서 볼 수 없어요.",
    "AddTest.FirstTeamMissing": "첫 번째 팀을 선택해 주세요.",
    "AddTest.SecondTeamMissing": "두 번째 팀을 선택해 주세요.",
    "UpdateTest.FirstTeamMissing": "첫 번째 팀을 선택해 주세요.",
    "UpdateTest.SecondTeamMissing": "두 번째 팀을 선택해 주세요.",
    "ExpectedMatches.NotWhole": "매치 수를 정수로 입력해 주세요.",
    "ExpectedMatches.TooSmall": "테스트는 최소 1매치가 예정되어 있어야 해요.",
    "TestGroup.TooLong": "그룹 이름이 너무 길어요.",
    "Tournament.TestAgainstItself":
      "한 팀이 자기 팀과 테스트를 치를 수는 없어요.",
    "Tournament.TestFinishesBeforeStarts":
      "테스트는 시작하기 전에 끝날 수 없어요.",
    "Tournament.TestStartsBeforeTournament":
      "테스트는 대회보다 먼저 시작할 수 없어요.",
    "Tournament.TestFinishesAfterTournament":
      "테스트는 대회가 끝난 뒤에 끝날 수 없어요.",
    "Tournament.TestHasGamesInUse":
      "이 테스트에는 게임이 있어서, 그 게임들이 보관되기 전에는 보관할 수 없어요.",
    "Tournament.TestHasGames":
      "이 테스트에는 이제 게임이 있어서, 팀을 더 이상 바꿀 수 없어요.",
    "Tournament.ExpectedMatchesBelowStarted":
      "그보다 많은 매치가 이미 시작되었어요.",
    "Tournament.BestOfBelowGamesPlayed":
      "두 선수가 이미 그보다 많은 게임을 치렀어요.",
    "Competition.ExpectedMatchesReached":
      "이 테스트는 예정된 만큼의 매치를 이미 시작했어요.",
    "Competition.SameTeam": "같은 팀의 두 선수는 서로 겨루지 않아요.",
    "AddManager.NoSuchAccount":
      "그 주소에는 운영자로 만들 수 있는 계정이 없어요.",
    "admin.scorers.add": "기록원 추가",
    "admin.scorers.none": "기록원이 없어요",
    "admin.scorers.removeTitle": "기록원 제외",
    "admin.scorers.removeExplanation":
      "{name} 님은 더 이상 이 대회의 점수를 입력할 수 없게 돼요.",
    "admin.scorers.otherwise": "그 주소는 기록원으로 만들 수 없어요.",
    "AddScorer.NoSuchAccount":
      "그 주소에는 기록원으로 만들 수 있는 계정이 없어요.",
    "Account.NotAnAdministrator": "관리자만 할 수 있어요.",
    "AddRole.NoSuchAccount": "그 주소에는 역할을 줄 수 있는 계정이 없어요.",
    "AddRole.NoSuchRole": "그런 역할은 없어요.",
    "RemoveRole.NoSuchAccount": "그런 계정은 없어요.",
    "RemoveRole.NoSuchRole": "그런 역할은 없어요.",
    "RemoveRole.Yourself": "자신에게서 관리자 역할을 거둘 수는 없어요.",
    "AccountsWithRole.NoSuchRole": "그런 역할은 없어요.",
    "Tournament.AlreadyAManager":
      "그 계정은 이미 이 대회를 운영하고 있고, 기록원이 할 수 있는 일을 모두 할 수 있어요.",

    "TournamentName.Missing": "대회 이름을 입력해 주세요.",
    "TournamentName.TooShort": "이름이 너무 짧아요.",
    "TournamentName.TooLong": "이름이 너무 길어요.",
    "TournamentName.AllLowerCase": "이름을 모두 소문자로 쓰지 않아요.",
    "TournamentName.AllCapitals": "이름을 모두 대문자로 쓰지 않아요.",
    "TournamentName.NoLetterOrDigit": "이름에는 글자나 숫자가 있어야 해요.",
    "ReadOnlyDate.Unreadable": "날짜를 입력해 주세요.",
    "Tournament.FinishesBeforeStarts": "대회는 시작하기 전에 끝날 수 없어요.",
    "Tournament.StartsAfterNextYear":
      "대회는 내년이 지난 뒤에 시작할 수 없어요.",
    "Tournament.FinishesAfterNextYear":
      "대회는 내년이 지난 뒤에 끝날 수 없어요.",
    "CreateTournament.NoSuchCountry": "나라를 선택해 주세요.",
    "TournamentSubtitle.TooLong": "부제는 2000자까지 쓸 수 있어요.",
    "Tournament.NotAManager": "이 대회의 운영자만 바꿀 수 있어요.",
    "Tournament.NotAManagerOrScorer":
      "이 대회의 운영자나 기록원만 볼 수 있어요.",
    "Tournament.Archived":
      "이 대회는 보관되어 있어서, 바꾸려면 먼저 복원해야 해요.",
    "UpdateTournament.NoSuchTournament": "이 주소에는 대회가 없어요.",

    "sport.ac": "어소시에이션 크로켓",
    "sport.gc": "골프 크로켓",
    "sport.a6w": "아메리칸 6후프 크로켓",
    "sport.rc": "리코셰",
    "sport.gb": "게이트볼",
    "format.standard": "일반",
    "format.teams": "팀전",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
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
    "country.au": "호주",
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
    "country.bv": "부베섬",
    "country.bw": "보츠와나",
    "country.by": "벨라루스",
    "country.bz": "벨리즈",
    "country.ca": "캐나다",
    "country.catalonia": "카탈루냐",
    "country.cc": "코코스 제도",
    "country.cd": "콩고 민주 공화국",
    "country.cf": "중앙아프리카 공화국",
    "country.cg": "콩고 공화국",
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
    "country.cx": "크리스마스섬",
    "country.cy": "키프로스",
    "country.cz": "체코",
    "country.de": "독일",
    "country.dj": "지부티",
    "country.dk": "덴마크",
    "country.dm": "도미니카 연방",
    "country.do": "도미니카 공화국",
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
    "country.im": "맨섬",
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
    "country.nf": "노퍽섬",
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
    "country.tf": "프랑스령 남부 및 남극 지역",
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
    "country.wf": "왈리스 푸투나",
    "country.ws": "사모아",
    "country.ye": "예멘",
    "country.yt": "마요트",
    "country.za": "남아프리카 공화국",
    "country.zm": "잠비아",
    "country.zw": "짐바브웨",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject": "{siteName} 이메일 주소를 확인해 주세요",
    "Email.ConfirmAddress.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong> 계정을 만들어 주셔서 감사해요.<br />
    계정을 쓰기 전에 아래 버튼을 눌러 이메일 주소를 확인해 주세요.
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
        내 이메일 주소 확인
    </a>
</p>

<p>
    버튼이 작동하지 않으면 브라우저에서 이 링크를 열어 이메일 주소를 확인할 수도 있어요.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    이 계정을 만든 적이 없다면 이 이메일은 무시하셔도 괜찮아요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "{siteName} 이메일 주소를 확인할 새 링크",
    "Email.ConfirmAddressAgain.body": `
<p>안녕하세요.</p>

<p>
    얼마 전 <strong>{siteName}</strong>의 이메일 주소를 확인하는 이메일을 새로 요청하셨어요.<br />
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
        내 이메일 주소 확인
    </a>
</p>

<p>
    버튼이 작동하지 않으면 브라우저에서 이 링크를 열어 이메일 주소를 확인할 수도 있어요.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    확인이 끝나면 계정을 끊김 없이 계속 쓸 수 있어요.
</p>

<p>
    이 이메일을 요청한 적이 없다면 무시하셔도 괜찮아요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "누군가 회원님의 이메일 주소로 가입하려고 했어요",
    "Email.AlreadyRegistered.body": `
<p>안녕하세요.</p>

<p>
    누군가 이 이메일 주소로 <strong>{siteName}</strong>에 가입하려고 했어요.
    이 주소로 만든 계정이 이미 있어요. 회원님의 계정에는 달라진 것이
    없어요.<br />
    본인이 하신 일이라면 이미 계정이 있으니 로그인하실 수 있어요.
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
    비밀번호를 잊으셨다면 여기서 다시 설정할 수 있어요.
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
        비밀번호를 잊었어요
    </a>
</p>

<p>
    본인이 하신 일이 아니라면 아무것도 하지 않으셔도 돼요. 아무도 회원님의
    계정에 들어갈 방법을 얻지 못했어요.
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
    <strong>{siteName}</strong> 계정에 로그인한 누군가가 그 계정을 이 이메일
    주소로 옮겨 달라고 요청했어요. 본인이 하신 일이라면, 그 계정에 로그인한
    상태에서 여기서 확인해 주세요. 링크는 24시간 동안 쓸 수 있어요.
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
    또는 이 주소를 브라우저에 복사해 붙여 넣으세요.<br />
    {link}
</p>

<p>
    본인이 하신 일이 아니라면 아무것도 하지 않으셔도 돼요. 어떤 계정도 이
    주소로 옮겨지지 않아요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "누군가 회원님의 이메일 주소로 계정을 옮기려고 했어요",
    "Email.AlreadyHasAnAccount.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong> 계정에 로그인한 누군가가 그 계정을 이 이메일
    주소로 옮겨 달라고 요청했지만, 이 주소에는 이미 계정이 있어요. 아무것도
    옮겨지지 않았고, 회원님의 계정에는 달라진 것이 없어요.
</p>

<p>
    본인이 하신 일이라면 이 주소로 만든 계정이 이미 있으니 로그인하실 수
    있어요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "{siteName} 계정을 옮겼어요",
    "Email.EmailAddressChanged.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정이 방금 다른 이메일 주소인
    {emailAddress}(으)로 옮겨졌어요. 앞으로는 그 주소로 로그인하세요.
</p>

<p>
    본인이 하신 일이 아니라면 다른 사람이 회원님의 계정을 가지고 있는 거예요.
    이 이메일에 답장해서 알려 주세요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "{siteName} 비밀번호를 변경했어요",
    "Email.PasswordChanged.body": `
<p>안녕하세요.</p>

<p>
    회원님의 <strong>{siteName}</strong> 계정 비밀번호가 방금 변경되었고,
    그 계정에 로그인되어 있던 다른 모든 브라우저는 로그아웃되었어요.<br />
    본인이 하신 일이라면 아무것도 하지 않으셔도 돼요.
</p>

<p>
    본인이 하신 일이 아니라면 다른 사람이 회원님의 비밀번호를 알고 있는
    거예요. 여기서 새 비밀번호를 설정하면 그 사람은 로그아웃돼요.
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
        비밀번호를 잊었어요
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
    얼마 전 <strong>{siteName}</strong>의 비밀번호를 다시 설정하고 싶다고
    요청하셨어요.<br />
    아래 버튼을 눌러 비밀번호를 다시 설정하세요.
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
    버튼이 작동하지 않으면 브라우저에서 이 링크를 열어 비밀번호를 다시 설정할 수도 있어요.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    비밀번호 재설정을 요청한 적이 없다면 이 이메일은 무시하셔도 괜찮아요.
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
    회원님의 <strong>{siteName}</strong> 계정에는 비밀번호가 없어요. Google로 로그인하고 계세요.<br />
    이메일 주소와 비밀번호로도 로그인할 수 있도록 비밀번호를 설정하고 싶다고 요청하셨어요.
    아래 버튼을 눌러 설정하세요.
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
    버튼이 작동하지 않으면 브라우저에서 이 링크를 열어 비밀번호를 설정할 수도 있어요.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    링크는 한 시간 동안 쓸 수 있어요. 비밀번호 설정을 요청한 적이 없다면 이 이메일은 무시하셔도 괜찮아요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "이 이메일 주소로 만든 {siteName} 계정이 없어요",
    "Email.RegisterInstead.body": `
<p>안녕하세요.</p>

<p>
    <strong>{siteName}</strong>에 계정이 없는 이메일 주소에 대해
    비밀번호 재설정 요청이 들어왔어요.
</p>

<p>
    저희 서비스를 이용하고 싶으시다면 아래 주소에서 새 계정을 만드실 수 있어요.<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    본인이 요청한 것이 아니라면 이 이메일은 무시하셔도 괜찮아요.
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
    요청하셨어요.<br />
    아래 버튼을 눌러 그것이 무엇을 뜻하는지 살펴보고, 정말 원하는지
    확실히 알려 주세요.
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
    버튼이 작동하지 않으면 브라우저에서 이 링크를 열 수도 있어요.<br />
    <a href="{link}">{link}</a>
</p>

<p>
    잊고 나면 이름과 이메일 주소는 누구도 다시 읽을 수 없고, 계정으로
    로그인할 수도 없어요. 되돌릴 수 없어요.
</p>

<p>
    링크는 한 번만 쓸 수 있고, 요청한 지 15분 뒤까지, 그리고 이 계정에
    로그인해 있는 동안에만 쓸 수 있어요. 그 뒤에는 계정에서 다시 요청해
    주세요.
</p>

<p>
    본인이 요청한 것이 아니라면 링크를 누르지 않는 한 아무 일도 일어나지
    않아요. 다만 누군가 회원님의 계정에 로그인해서 요청한 것이니,
    비밀번호를 잊었어요 페이지에서 새 비밀번호를 설정해 그 사람이 다시
    로그인하지 못하게 해 주세요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "가입이 중단되었어요: {service}에 연결할 수 없어요",
    "Email.RegistrationsSuspended.body": `
<p>안녕하세요.</p>

<p>
    {siteName}이(가) {when}에 {service}에 연결하지 못했어요. 응답할 때까지,
    그 서비스가 필요한 방문자는 가입이나 새 비밀번호 설정을 할 때
    나중에 다시 시도하라는 안내를 받아요.
</p>

<p>
    따로 풀어 줄 것은 없어요. 시도할 때마다 {service}에 새로 요청하고,
    응답하는 즉시 페이지가 다시 작동해요.
</p>

<p>
    {service}이(가) 계속 멈춰 있는 동안, 이에 관한 이메일은 한 시간에 최대
    한 번만 보내 드려요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName}이(가) 데이터베이스에 연결할 수 없어요",
    "Email.DatabaseUnreachable.body": `
<p>안녕하세요.</p>

<p>
    {siteName}이(가) {when}에 데이터베이스에 연결하지 못했어요. 데이터베이스가 응답할 때까지, 이를 필요로 하는 모든 페이지는 방문자에게 사이트를 사용할 수 없으니 나중에 다시 시도해 달라고 안내해요.
</p>

<p>
    따로 풀어야 할 것은 없어요. 요청할 때마다 연결을 새로 요청하고, 데이터베이스가 응답하는 순간 사이트는 다시 작동해요.
</p>

<p>
    데이터베이스가 계속 멈춰 있는 동안에는 이에 대한 이메일을 {minutes}분에 최대 한 번만 보내 드려요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName}에서 요청 처리에 실패했어요",
    "Email.UnhandledError.body": `
<p>안녕하세요.</p>

<p>
    {siteName}에서 {when}에 {asked} 요청을 처리하지 못했어요. 독자에게는 참조 번호 {reference}가 표시되었고, 로그에서 이 번호 아래에 원인을 볼 수 있어요.
</p>

<p>
    고장 난 사이트는 모든 요청에서 실패하기 쉬워서, 실패에 대한 이메일은 한 시간에 최대 4통만 보내드려요. 그 뒤의 실패도 로그에는 그대로 남아요.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
