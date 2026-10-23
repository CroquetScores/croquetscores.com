# 대회 운영자를 위한 새로운 소식

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
