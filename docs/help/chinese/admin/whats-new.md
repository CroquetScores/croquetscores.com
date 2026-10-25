# 赛事管理者的新功能

## 发布于 2026-10-26

以下是自上次发布以来的主要变化。每一项都链接到做出该改动的 pull request。

- **竞赛页面现在可以打印。** 小组赛、淘汰赛、瑞士制和对抗赛的页面，在竞赛名称那一行、视图旁边，各有一个打印机按钮。按下它会打开浏览器自带的打印对话框。它需要脚本支持，所以没有脚本时不显示该按钮。打印出来的内容是赛事名称（在竞赛名称之上）和下面的结果，不包括只用来查找页面的东西：网站的栏、视图、按钮和页脚。链接在纸上不加下划线，但已撤销选手的名字仍保留贯穿的横线。小组赛和淘汰赛横向打印，瑞士制和对抗赛纵向打印。小组赛的表格或淘汰赛的对阵图比纸宽时，会被切成几块，从第二页起各占一页；表格的每一块左边都会重复选手姓名。页面无法向打印机询问纸张有多宽，所以按 Letter 纸横向来留空；如果读者把纸改成纵向，右边缘仍可能被截掉。 ([#382](https://github.com/CroquetScores/croquetscores.com/pull/382))

- **排名下载现在说明了它是什么。** **排名**标签页上的链接原来是**下载排名**，读起来像是提供排名本身。现在是**下载用于世界排名的比赛**，因为它提供的是赛事的比赛，放在排名官员取用的文件里。参见 [排名](../tournament-managers/standard-tournament/rankings.md)。英语以外各种语言的新文字还没有母语者读过，如有读起来别扭的地方，请告诉我们。 ([#384](https://github.com/CroquetScores/croquetscores.com/pull/384))

- **幕后改动。** 导入每次运行后追加的汇总，在无法读取时不再被覆盖 ([#380](https://github.com/CroquetScores/croquetscores.com/pull/380))；网站依赖的软件包也在允许的范围内更新到了最新版本 ([#383](https://github.com/CroquetScores/croquetscores.com/pull/383))。

## 发布于 2026-10-25

以下是自上次发布以来的主要变化。每一项都链接到做出该改动的 pull request。

- **世界排名负责人的赛事列表可以按世界排名缩小范围。** 负责人的列表包含他们负责的各项运动的每一个赛事，比他们想逐条阅读的多得多。现在**新建赛事**旁边有三个按钮：**管理员/记分员**、**世界排名**和**非世界排名**。只要有一个适用于某个赛事的按钮处于开启状态，该赛事就会列出，所以每个按钮是增加赛事，而不是减少。开启的按钮带有对勾，**管理员/记分员**和**世界排名**默认开启。这些按钮只给负责人使用；如果您管理或记分赛事，您的列表和以前一样。（[#372](https://github.com/CroquetScores/croquetscores.com/pull/372)、[#376](https://github.com/CroquetScores/croquetscores.com/pull/376)）

- **世界排名负责人或管理员可以给赛事的管理者发邮件。** 在**管理者**标签页上，他们会看到**给管理者发邮件**，这是一个链接，会打开一封新邮件，收件人是该赛事的每一位管理者，主题为“Croquet Scores”。网站不会发送任何内容。负责人可以查看自己负责的运动的任何赛事的这个标签页，用来查看管理者并给他们写信，但不能更改他们；管理者看不到任何人的电子邮件地址。参见[管理者和记分员](../tournament-managers/standard-tournament/managers-and-scorers.md)。（[#369](https://github.com/CroquetScores/croquetscores.com/pull/369)）

- **单日赛事在排名文件中按那一天标注日期。** 以前写成一天的范围，`3-3.10.26`，现在是 `3.10.26`，和世界排名自己的列表写单独一天的方式一样。超过一天的赛事仍按原来的方式标注日期。参见[排名](../tournament-managers/standard-tournament/rankings.md)。（[#368](https://github.com/CroquetScores/croquetscores.com/pull/368)）

- **从旧网站导入的赛事更准确。** 当世界排名的协会槌球和高尔夫槌球赛事列表里有某个赛事时，赛事的国家现在取自这些列表，而不是取自它的时区（[#366](https://github.com/CroquetScores/croquetscores.com/pull/366)）。另外两项改动（[#377](https://github.com/CroquetScores/croquetscores.com/pull/377)）将用于下一次导入：
  - 球员从每个项目自己的名单导入，并按确切的姓名在赛事的球员中查找。旧网站把赛事的球员复制到每个项目里，还允许管理者修改副本，所以在双打项目中以“Joe Hogan & Levi Franks”报名的一对，曾被并到 Joe Hogan 一个人身上。现在它是单独的一名球员。不在任何项目里的球员不再被导入。
  - 项目说明某名球员代表谁时，如果该球员原来没有代表，就按它设置；之后有项目说法不同，也不会更改。原本是2局制的小组赛，或者每对球员都打了第三局的3局制小组赛，现在保持原样。只有当某一对的比赛会在他们最后一局之前就已决出胜负（网站会拒绝其余的局）时，才改为1局制。

- **幕后改动。** 导入时可以只导入在两个日期之间开始的赛事（[#374](https://github.com/CroquetScores/croquetscores.com/pull/374)），并且现在会把所做的事写成：每种修正一个文件，错误一个文件，以及每次导入的汇总，全都放在代码仓库的 docs 文件夹中（也见[#377](https://github.com/CroquetScores/croquetscores.com/pull/377)）。导入中又加入了四名高尔夫槌球世界排名负责人（[#367](https://github.com/CroquetScores/croquetscores.com/pull/367)），网站自己的地址现在是协会槌球负责人，不再是管理员（[#375](https://github.com/CroquetScores/croquetscores.com/pull/375)）。时有时无地失败的场景，以及落后于网站的场景，已经修正（[#359](https://github.com/CroquetScores/croquetscores.com/pull/359)、[#373](https://github.com/CroquetScores/croquetscores.com/pull/373)）。

## 发布于 2026-10-23

以下是自上次发布以来的主要变化。每一项都链接到做出该改动的 pull request。

- **差点、平局和世界排名，现在在每个项目上设置。** 它们以前由赛事来定，所以一个赛事无法让差点小组赛和无差点小组赛并存，也无法让可以打平的对抗赛和不能打平的淘汰赛并存。现在，每个项目和每场对抗赛在添加或编辑时都会询问这三项，赛事表单不再询问。最后一项只在该运动有世界排名时才会询问，不计入的项目不会出现在排名文件中。参见[项目](../tournament-managers/standard-tournament/competitions.md)。（[#341](https://github.com/CroquetScores/croquetscores.com/pull/341)）

- **管理页面的赛事列表可以按国家、地区和运动筛选。** 筛选条件在网址中，所以可以链接到筛过的列表，而且只提供您的列表里有的选项。选择国家之后才会提供地区。2026 年 11 月之前的赛事没有地区，所以选择地区会把它们隐藏，公开列表也会这样说明。（[#354](https://github.com/CroquetScores/croquetscores.com/pull/354)、[#351](https://github.com/CroquetScores/croquetscores.com/pull/351)）

- **世界排名负责人现在是每项运动各有一个角色。** 协会槌球负责人查看并负责协会槌球赛事，高尔夫槌球负责人则负责高尔夫槌球赛事。您管理或记分的赛事，无论是哪项运动，仍然在您的列表中。（[#348](https://github.com/CroquetScores/croquetscores.com/pull/348)、[#356](https://github.com/CroquetScores/croquetscores.com/pull/356)）

- **无论哪项运动，“排名”标签页都用一段话说明排名文件，**下载链接在它下面。参见[排名](../tournament-managers/standard-tournament/rankings.md)。（[#346](https://github.com/CroquetScores/croquetscores.com/pull/346)）

- **赛事名称不能全部是小写或全部是大写，**现在提示信息也把它作为一条规则说明。（[#345](https://github.com/CroquetScores/croquetscores.com/pull/345)）

- **“移除”现在是一个垃圾桶图标，**出现在管理者和记分员标签页、项目的选手列表以及管理员的账户页面上，和“归档”“删除”原来一样。鼠标指向它时仍然叫“移除”，屏幕阅读器仍然读作“移除”。（[#353](https://github.com/CroquetScores/croquetscores.com/pull/353)）

- **每种语言都有了新的用词。** 网站在其余十六种语言中的用词都重新写过，帮助也已与之对齐。面向读者和账户的帮助以及使用条款，现在也有每种语言的版本。还没有以该语言为母语的人读过，所以请告诉我们哪里读起来不顺。（[#355](https://github.com/CroquetScores/croquetscores.com/pull/355)、[#349](https://github.com/CroquetScores/croquetscores.com/pull/349)、[#350](https://github.com/CroquetScores/croquetscores.com/pull/350)）

- **幕后改动。** 导入旧网站时，为一些时区和一个赛事指定了不同的国家（[#344](https://github.com/CroquetScores/croquetscores.com/pull/344)），并用脚本把转储文件加载到服务器并生成读取模型（[#340](https://github.com/CroquetScores/croquetscores.com/pull/340)）。网站现在用脚本部署，可以从电脑或 GitHub 运行，不再在每次合并时部署（[#352](https://github.com/CroquetScores/croquetscores.com/pull/352)）。

## 发布于 2026-10-19

以下是对举办赛事的人影响最大的变化。[赛事管理者帮助](../tournament-managers/index.md)里有全部细节。

- **选手只需录入一次，录入到赛事中。** 在旧网站上，选手是在每个项目里添加的。现在，赛事的**选手**标签页是添加、更正、排序和归档选手的地方，在这里更正的选手，会在他参加的每个项目和每个公开页面上同时更正。参见[选手](../tournament-managers/standard-tournament/players.md)。

- **从列表中把选手放进项目。** 在项目页面，从下拉列表中选择赛事的一名选手，然后按**添加选手**。下拉列表只提供尚未在该项目中的选手。在淘汰赛中，剩下的位置还可以选择**Bye**。参见[把选手录入项目](../tournament-managers/standard-tournament/entering-players-in-a-competition.md)。

- **一个按钮添加项目。** 以前有单独的新建小组赛、新建瑞士制和新建淘汰赛按钮，现在只需按**添加项目**。对话框会询问名称和类型（小组赛、淘汰赛或瑞士制），然后询问该类型所需的内容：每场比赛是几局制，淘汰赛还要问签表有多少个位置。对话框会保持打开，方便您一次添加多个。项目的类型之后不能更改：请归档它，再重新添加。参见[项目](../tournament-managers/standard-tournament/competitions.md)。

- **管理者通知：想告诉选手需要知道的事，请用它来代替评论。** 比如赛制、比赛顺序的变动、午餐的时间。通知写在赛事的**通知**标签页上，包含标题和用 Markdown 写的说明，添加之前可以预览。选手在赛事公开的“通知”页面上查看通知。他们没读过的通知，以及赛事每个页面上的“通知”栏目，都会带星号，直到他们打开为止。您修改过的通知，会对所有读过它的人重新标记。参见[通知](../tournament-managers/standard-tournament/notes.md)。

- **旧网站赛事的“通知”现在是副标题。** 您在那里写的内容会保留为赛事的副标题，并仍显示在每个公开页面上赛事名称的下方。它用 Markdown 书写，最多 2000 个字符，用来放读者无论在哪个页面都应该知道的内容。随着比赛进行而变化的消息，请用通知。
