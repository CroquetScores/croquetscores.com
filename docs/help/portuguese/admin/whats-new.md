# Novidades para os organizadores de torneio

## Lançado em 2026-10-23

Estas são as principais mudanças desde a última versão. Cada uma tem um link para o pull request que a fez.

- **Handicaps, resultados empatados e os rankings mundiais são definidos em cada competição.** Antes, isso cabia ao torneio, então um torneio não podia ter um grupo com handicap ao lado de um grupo sem, nem um teste que pode terminar empatado ao lado de um mata-mata que não pode. Agora cada competição, e cada teste, pergunta pelos três ao ser adicionada ou editada, e o formulário do torneio não pergunta mais. O último só é perguntado onde o esporte tem rankings mundiais, e uma competição que não conta fica fora do arquivo de rankings. Veja [Competições](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **A lista de torneios da administração pode ser filtrada por país, região e esporte.** As escolhas ficam no endereço, então dá para compartilhar o link de uma lista filtrada, e só é oferecido o que a sua lista contém. Uma região é oferecida depois que um país é escolhido. Os torneios anteriores a novembro de 2026 não têm região, então escolher uma os esconde, e as listas públicas avisam isso. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Os responsáveis pelo ranking mundial agora são um papel para cada esporte.** Um responsável pelo Croquet de Associação vê e cuida dos torneios de Croquet de Associação, e um responsável pelo Croquet de Golfe, dos de Croquet de Golfe. Um torneio que você organiza ou anota continua na sua lista, seja qual for o esporte. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **A aba Rankings explica o arquivo em um parágrafo, seja qual for o esporte,** com o link de download logo abaixo. Veja [Rankings](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **O nome de um torneio não pode ser todo em minúsculas nem todo em maiúsculas,** e a mensagem agora diz isso como uma regra. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Remover é uma lixeira** nas abas de organizadores e anotadores, nos jogadores da competição e na página de contas do administrador, como Arquivar e Excluir já eram. Ele continua se chamando Remover quando você aponta para ele, e um leitor de tela continua lendo Remover. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Todos os idiomas têm palavras novas.** O texto do site nos outros dezesseis idiomas foi escrito de novo, e a ajuda foi ajustada a ele. A ajuda para leitores e para contas, e os termos de uso, agora também estão em todos os idiomas. Nenhum deles foi lido ainda por um falante nativo, então conte para nós o que soar mal. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Nos bastidores.** A importação dos sites antigos dá alguns fusos horários e um torneio a outro país ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), e carrega um dump no servidor e cria os modelos de leitura com um script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). O site é publicado por um script, de um computador ou do GitHub, e não mais a cada merge ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Lançado em 2026-10-19

Estas são as principais mudanças para quem organiza torneios. A [ajuda para organizadores de torneio](../tournament-managers/index.md) tem todos os detalhes.

- **Os jogadores são inseridos uma só vez, no torneio.** No site antigo, os jogadores eram adicionados dentro de cada competição. Agora a aba **Jogadores** do torneio é onde você os adiciona, corrige, ordena e arquiva, e um jogador corrigido ali fica corrigido em todas as competições em que está e em todas as páginas públicas. Veja [Jogadores](../tournament-managers/standard-tournament/players.md).

- **Os jogadores são colocados em uma competição a partir de uma lista.** Na página de uma competição, escolha um jogador do torneio na lista suspensa e pressione **Adicionar jogador**. A lista oferece só os jogadores que ainda não estão na competição. Em um mata-mata, ela oferece também **Bye** para as vagas que sobram. Veja [Inserir jogadores em uma competição](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Um só botão adiciona uma competição.** No lugar dos botões separados de novo grupo, novo suíço e novo mata-mata, pressione **Adicionar competição**. A caixa de diálogo pergunta o nome e o tipo (um grupo, um mata-mata ou um suíço), e depois o que esse tipo precisa: melhor de quantos jogos é cada partida e, em um mata-mata, as vagas do seu chaveamento. Ela continua aberta para que você adicione várias de uma vez. O tipo de uma competição não pode ser mudado depois: arquive-a e adicione-a de novo. Veja [Competições](../tournament-managers/standard-tournament/competitions.md).

- **Notas dos organizadores: use-as no lugar dos comentários para dizer aos jogadores o que eles precisam saber.** O formato, uma mudança na ordem de jogo, o horário do almoço. Uma nota é escrita na aba **Notas** do torneio, com um título e uma descrição em Markdown, e você pode visualizá-la antes de adicioná-la. Os jogadores encontram as notas na página pública Notas do torneio. Uma nota que eles não leram é marcada com um asterisco, e a seção Notas em todas as páginas do torneio também, até que a abram. Uma nota que você edita é marcada de novo para todos que já a tinham lido. Veja [Notas](../tournament-managers/standard-tournament/notes.md).

- **As notas do torneio do site antigo agora são o Subtítulo.** O que você escreveu ali foi mantido como subtítulo do torneio, e continua aparecendo abaixo do nome do torneio em todas as páginas públicas. Ele é escrito em Markdown e pode ter até 2000 caracteres. Serve para o que os leitores devem saber em qualquer página em que estejam. Use uma nota para novidades que mudam ao longo do torneio.
