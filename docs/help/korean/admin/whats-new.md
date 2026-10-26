# 대회 운영자를 위한 새로운 소식

## 출시일 2026-10-26, 그날 늦게

오늘 앞선 출시 이후의 주요 변경 사항이에요. 각 항목은 그 변경을 만든 풀 리퀘스트로 연결돼요.

- **세계 랭킹 담당자에게 랭킹 탭이 보여요.** 담당하는 종목의 모든 대회에서, 탭 가운데 맨 끝에 나타나요. 그 대회에서 맡은 역할이 있든, 기록을 하든 마찬가지예요. 운영자가 보는 것과 같은 탭이고, 대회의 경기를 세계 랭킹용으로 내려받는 링크가 있어요. 담당자가 아닌 기록원에게는 여전히 보이지 않아요. [랭킹](../tournament-managers/standard-tournament/rankings.md)을 보세요. ([#392](https://github.com/CroquetScores/croquetscores.com/pull/392))

- **세계 랭킹 담당자를 위한 도움말이 생겼어요.** 한 페이지에서, 로그인한 독자가 누구나 보는 것 외에 담당자의 대회 목록이 무엇을 더 주는지 알려 줘요. 담당하는 종목의 모든 대회, 목록을 좁히는 버튼, 그리고 **운영** 대신 **선수**예요. [세계 랭킹 담당자를 위한 도움말](../world-ranking-officers/index.md)을 보세요. 나머지 열여섯 개 언어의 이 페이지는 아직 원어민이 읽어 보지 않았으니, 어색한 곳이 있으면 알려 주세요. ([#393](https://github.com/CroquetScores/croquetscores.com/pull/393))

- **모든 페이지에 버그를 신고하는 링크가 있어요.** **버그 신고**는 바닥글에서 **개인정보 처리**, **이용 약관** 옆에, 후원과 저작권 아래의 별도 줄에 있어요. 누르면 사이트 관리자에게 보내는 새 이메일이 열리고, 제목에는 사이트 이름과, 있는 경우 버전, 그리고 영어 단어 "Bug"가 미리 들어 있어요. 사이트에서는 아무것도 보내지 않아요. ([#387](https://github.com/CroquetScores/croquetscores.com/pull/387))

- **보이지 않는 곳의 변경.** 옛 사이트에서 가져온 대회는, 이름에 나라가 있으면, 예를 들어 Japan Open이면 그 나라에 넣고, 더 이상 치른 적 없는 나라에 넣지 않아요 ([#388](https://github.com/CroquetScores/croquetscores.com/pull/388), [#390](https://github.com/CroquetScores/croquetscores.com/pull/390)). 관리자는 세계 랭킹이 나열하지 않는 나라에서 치른 대회의 페이지를 볼 수 있고 ([#386](https://github.com/CroquetScores/croquetscores.com/pull/386)), 골프 크로케 세계 랭킹 담당자 한 분의 이메일 주소를 바로잡았어요 ([#391](https://github.com/CroquetScores/croquetscores.com/pull/391)).

## 출시일 2026-10-26

지난 출시 이후의 주요 변경 사항이에요. 각 항목은 그 변경을 만든 풀 리퀘스트로 연결돼요.

- **경기의 페이지를 인쇄할 수 있어요.** 블록, 녹아웃, 스위스, 테스트의 페이지에는 각각 경기 이름이 있는 줄의 보기 옆에 프린터 버튼이 있어요. 누르면 브라우저의 인쇄 대화상자가 열려요. 스크립트가 필요해서, 스크립트가 없으면 버튼이 보이지 않아요. 인쇄되는 것은 경기 이름 위의 대회 이름과 그 아래의 결과이고, 페이지를 찾는 데만 쓰이는 것, 즉 사이트의 막대, 보기, 버튼, 바닥글은 인쇄되지 않아요. 링크는 종이에서 밑줄을 긋지 않지만, 기권한 선수의 이름은 가운데 줄이 그대로 남아요. 블록과 녹아웃은 용지를 가로로, 스위스와 테스트는 세로로 인쇄해요. 용지보다 넓은 블록의 표나 녹아웃의 대진표는 조각으로 잘려 첫 페이지 다음부터 한 페이지씩 인쇄되고, 표의 각 조각 왼쪽에는 선수 이름이 되풀이돼요. 페이지는 프린터에 용지 너비를 물어볼 수 없어서 Letter 가로를 기준으로 여유를 두는데, 용지를 세로로 바꾸면 오른쪽 가장자리가 잘릴 수 있어요. ([#382](https://github.com/CroquetScores/croquetscores.com/pull/382))

- **랭킹 내려받기가 무엇인지 말해요.** **랭킹** 탭의 링크는 **랭킹 내려받기**였는데, 랭킹 자체를 주는 것처럼 읽혔어요. 이제는 **세계 랭킹용 경기 내려받기**예요. 대회의 경기를 랭킹 담당자들이 가져가는 파일로 주기 때문이에요. [랭킹](../tournament-managers/standard-tournament/rankings.md)을 보세요. 영어 외의 언어에서 새로 쓴 말은 아직 원어민이 읽어 보지 않았으니, 어색한 곳이 있으면 알려 주세요. ([#384](https://github.com/CroquetScores/croquetscores.com/pull/384))

- **보이지 않는 곳의 변경.** 가져오기가 실행할 때마다 덧붙이는 요약은 읽을 수 없을 때 더 이상 덮어쓰이지 않아요 ([#380](https://github.com/CroquetScores/croquetscores.com/pull/380)). 사이트가 의존하는 패키지는 허용되는 범위 안에서 최신 버전으로 올렸어요 ([#383](https://github.com/CroquetScores/croquetscores.com/pull/383)).

## 출시일 2026-10-25

지난 출시 이후의 주요 변경 사항이에요. 각 항목은 그 변경을 만든 풀 리퀘스트로 연결돼요.

- **세계 랭킹 담당자의 대회 목록을 세계 랭킹으로 좁힐 수 있어요.** 담당자의 목록에는 담당하는 종목의 모든 대회가 들어 있어서, 훑어보기에는 너무 많아요. 이제 **새 대회** 옆에 **관리자/기록원**, **세계 랭킹**, **세계 랭킹 제외** 세 개의 버튼이 있어요. 대회에 해당하는 버튼 중 하나라도 켜져 있으면 그 대회가 목록에 나와요. 그래서 각 버튼은 대회를 없애는 것이 아니라 더해 줘요. 켜진 버튼에는 체크 표시가 있고, **관리자/기록원**과 **세계 랭킹**은 처음부터 켜져 있어요. 이 버튼들은 담당자 전용이에요. 대회를 운영하거나 기록하는 분의 목록은 전과 같아요. ([#372](https://github.com/CroquetScores/croquetscores.com/pull/372), [#376](https://github.com/CroquetScores/croquetscores.com/pull/376))

- **세계 랭킹 담당자와 사이트 관리자는 대회 운영자에게 이메일을 보낼 수 있어요.** **운영자** 탭에 **운영자에게 이메일 보내기**가 나타나요. 대회의 모든 운영자에게 새 이메일을 여는 링크이고, 제목은 "Croquet Scores"예요. 사이트에서는 아무것도 보내지 않아요. 담당자는 담당하는 종목의 어느 대회에서든 이 탭을 볼 수 있어서, 운영자를 확인하고 연락할 수는 있지만 운영자를 바꿀 수는 없어요. 운영자에게는 누구의 이메일 주소도 보이지 않아요. [운영자와 기록원](../tournament-managers/standard-tournament/managers-and-scorers.md)을 보세요. ([#369](https://github.com/CroquetScores/croquetscores.com/pull/369))

- **하루짜리 대회는 랭킹 파일에 그날로 표시해요.** 하루 범위인 `3-3.10.26`으로 적던 것을 이제 `3.10.26`으로 적어요. 세계 랭킹의 목록이 하루를 적는 방식과 같아요. 이틀 이상인 대회는 전과 같이 표시해요. [랭킹](../tournament-managers/standard-tournament/rankings.md)을 보세요. ([#368](https://github.com/CroquetScores/croquetscores.com/pull/368))

- **예전 사이트에서 가져온 대회가 더 충실해졌어요.** 세계 랭킹의 어소시에이션 크로케와 골프 크로케 대회 목록에 있는 대회는, 이제 시간대가 아니라 그 목록의 국가를 써요 ([#366](https://github.com/CroquetScores/croquetscores.com/pull/366)). 두 가지 변경이 더 있고 ([#377](https://github.com/CroquetScores/croquetscores.com/pull/377)), 다음 가져오기부터 적용돼요.
  - 선수는 각 부문이 가진 자체 목록에서 가져오고, 대회의 선수 중에서 정확한 이름으로 찾아요. 예전 사이트는 대회의 선수를 각 부문에 복사하고 운영자가 그 사본을 바꿀 수 있게 했어요. 그래서 복식 부문에 "Joe Hogan & Levi Franks"로 등록한 한 쌍이 Joe Hogan 한 명과 이어졌어요. 이제는 그 쌍이 따로 한 명의 선수예요. 어느 부문에도 없는 선수는 더 이상 가져오지 않아요.
  - 어떤 부문이 선수가 무엇을 대표하는지 말하면, 그 선수가 아무것도 대표하지 않았을 때 그것으로 정해요. 그 뒤에 다르게 말하는 부문이 있어도 바꾸지 않아요. 2판 다승제로 저장된 블록, 또는 모든 쌍이 세 번째 게임까지 한 3판 다승제 블록은 이제 그대로 유지돼요. 어떤 쌍의 경기가 마지막 게임 전에 이미 결정되었을 경우에만 1판 다승제로 바꾸는데, 그대로면 사이트가 나머지를 받지 않기 때문이에요.

- **보이지 않는 곳의 변경.** 가져오기에는 두 날짜 사이에 시작한 대회만 가져오라고 시킬 수 있고 ([#374](https://github.com/CroquetScores/croquetscores.com/pull/374)), 이제 한 일을 수정 종류마다 하나의 파일, 오류용 파일 하나, 가져오기마다의 요약으로 저장소의 docs 폴더에 남겨요 ([#377](https://github.com/CroquetScores/croquetscores.com/pull/377)도 보세요). 골프 크로케 세계 랭킹 담당자 네 명이 더 지정되었고 ([#367](https://github.com/CroquetScores/croquetscores.com/pull/367)), 사이트 자신의 주소는 이제 사이트 관리자가 아니라 어소시에이션 크로케 담당자예요 ([#375](https://github.com/CroquetScores/croquetscores.com/pull/375)). 가끔 실패하거나 사이트보다 뒤처졌던 시나리오도 바로잡았어요 ([#359](https://github.com/CroquetScores/croquetscores.com/pull/359), [#373](https://github.com/CroquetScores/croquetscores.com/pull/373)).

## 출시일 2026-10-23

지난 출시 이후의 주요 변경 사항이에요. 각 항목은 그 변경을 만든 풀 리퀘스트로 연결돼요.

- **핸디캡, 무승부 결과, 세계 랭킹은 이제 부문마다 정해요.** 예전에는 대회가 정했기 때문에, 한 대회 안에 핸디캡이 있는 블록과 없는 블록을 함께 둘 수 없었고, 무승부가 가능한 테스트와 불가능한 녹아웃을 함께 둘 수도 없었어요. 이제 각 부문과 각 테스트를 추가하거나 고칠 때 세 가지를 모두 묻고, 대회 양식에서는 묻지 않아요. 마지막 항목은 그 종목에 세계 랭킹이 있을 때만 묻고, 반영하지 않는 부문은 랭킹 파일에서 빠져요. [부문](../tournament-managers/standard-tournament/competitions.md)을 보세요. ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **관리 화면의 대회 목록을 국가, 지역, 종목으로 좁힐 수 있어요.** 고른 조건이 주소에 담기므로 걸러진 목록을 링크로 공유할 수 있고, 내 목록에 있는 것만 선택지로 나와요. 지역은 국가를 고른 뒤에 고를 수 있어요. 2026년 11월 이전 대회에는 지역이 없으므로 지역을 고르면 그 대회들이 보이지 않고, 공개 목록이 그렇게 알려 줘요. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **세계 랭킹 담당자는 이제 종목마다 하나의 역할이에요.** 어소시에이션 크로케 담당자는 어소시에이션 크로케 대회를 보고 관리하고, 골프 크로케 담당자는 골프 크로케 대회를 보고 관리해요. 직접 운영하거나 기록하는 대회는 종목과 관계없이 목록에 그대로 있어요. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **랭킹 탭은 종목에 관계없이 파일을 한 단락으로 설명하고,** 그 아래에 내려받기 링크가 있어요. [랭킹](../tournament-managers/standard-tournament/rankings.md)을 보세요. ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **대회 이름을 모두 소문자나 모두 대문자로 쓸 수 없어요.** 이제 메시지도 이를 규칙으로 알려 줘요. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **제거는 휴지통 아이콘이에요.** 운영자 탭과 기록원 탭, 부문의 선수, 사이트 관리자의 계정 페이지에서 보관과 삭제처럼 아이콘으로 그려져요. 마우스를 올리면 여전히 제거라고 나오고, 화면 낭독기도 여전히 제거라고 읽어요. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **모든 언어에 새 표현이 생겼어요.** 사이트의 표현을 나머지 열여섯 개 언어 모두에서 새로 썼고, 도움말도 거기에 맞췄어요. 독자용 도움말과 계정 도움말, 이용 약관도 이제 모든 언어로 있어요. 아직 원어민이 읽어 본 곳은 없으니, 어색한 곳이 있으면 알려 주세요. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **보이지 않는 곳의 변경.** 예전 사이트 가져오기에서 일부 시간대와 한 대회에 다른 국가를 지정하고 ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), 덤프를 서버에 올리고 읽기 모델을 만드는 일을 스크립트로 해요 ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). 사이트는 이제 병합할 때마다 배포하지 않고, 컴퓨터나 GitHub에서 스크립트로 배포해요 ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## 출시일 2026-10-19

대회를 운영하는 분들께 해당하는 주요 변경 사항이에요. 자세한 내용은 [대회 운영자 도움말](../tournament-managers/index.md)에 있어요.

- **선수는 대회에 한 번만 등록해요.** 예전 사이트에서는 선수를 부문마다 추가했어요. 이제는 대회의 **선수** 탭에서 선수를 추가하고, 고치고, 순서를 정하고, 보관해요. 여기서 고친 내용은 그 선수가 속한 모든 부문과 모든 공개 페이지에 반영돼요. [선수](../tournament-managers/standard-tournament/players.md)를 보세요.

- **선수는 목록에서 골라 부문에 넣어요.** 부문 페이지에서 드롭다운으로 대회의 선수를 고르고 **선수 추가**를 누르세요. 드롭다운에는 아직 그 부문에 없는 선수만 나와요. 녹아웃에서는 남는 자리를 위해 **부전승**도 나와요. [부문에 선수 등록하기](../tournament-managers/standard-tournament/entering-players-in-a-competition.md)를 보세요.

- **버튼 하나로 부문을 추가해요.** 따로 있던 새 블록, 새 스위스, 새 녹아웃 버튼 대신 **부문 추가**를 누르세요. 대화상자에서 이름과 종류(블록, 녹아웃, 스위스)를 묻고, 이어서 그 종류에 필요한 것, 즉 각 경기가 몇 판 승부인지와 녹아웃이면 대진표의 자리 수를 물어요. 대화상자는 열린 채로 있어서 여러 개를 한꺼번에 추가할 수 있어요. 부문의 종류는 나중에 바꿀 수 없어요. 보관하고 다시 추가하세요. [부문](../tournament-managers/standard-tournament/competitions.md)을 보세요.

- **운영자 공지: 선수들이 알아야 할 내용은 해설 대신 공지로 전하세요.** 방식, 경기 순서 변경, 점심 시간 같은 내용이에요. 공지는 대회의 **공지** 탭에서 제목과 Markdown 설명을 넣어 쓰고, 추가하기 전에 미리 볼 수 있어요. 선수들은 대회의 공개 공지 페이지에서 공지를 봐요. 읽지 않은 공지와 대회 모든 페이지의 공지 섹션에는 열어 볼 때까지 별표가 붙어요. 공지를 수정하면 이미 읽은 모든 사람에게 다시 표시돼요. [공지](../tournament-managers/standard-tournament/notes.md)를 보세요.

- **예전 사이트의 대회 공지는 이제 부제예요.** 거기에 쓴 내용은 대회의 부제로 남고, 지금처럼 모든 공개 페이지의 대회 이름 아래에 보여요. Markdown으로 쓰고 2000자까지 쓸 수 있어요. 어느 페이지를 보든 독자가 알아야 할 내용을 위한 거예요. 대회가 진행되면서 바뀌는 소식에는 공지를 쓰세요.
