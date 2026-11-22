# Novidades

## Lançado em 2026-11-22

- **A página inicial guarda os torneios que você viu recentemente.** Ao abrir um torneio, ele passa a ser o primeiro em **Os seus torneios recentes**, entre o filtro e os resultados recentes, até cinco deles, para que você possa voltar aos que acompanha sem procurá-los nas listas. Eles ficam guardados no seu próprio aparelho, num cookie que contém apenas os endereços dos torneios, e a lista nem aparece até você abrir um. A ajuda diz o que é o cookie.

- **Os próximos torneios incluem os que começaram nos últimos dois dias.** Um torneio que já começou e ainda não terminou aparece até o dia em que termina, desde que tenha começado há no máximo dois dias, de modo que nos dias em que é jogado ele pode ser encontrado antes de alguém lançar um jogo nele. Os que começaram há mais tempo ficam nos resultados recentes quando um jogo é acrescentado.

- **Um mata-mata diz de quantos jogos são as partidas de cada rodada.** Acima de cada rodada na grade de um mata-mata, e abaixo do nome de cada rodada no seu resumo, aparece "Melhor de 3", ou o que o organizador do torneio escolheu para essa rodada.

- **Um placar cabe na sua caixa no resumo de um mata-mata, e um nome fica junto no resumo de um bloco.** Numa tela estreita, um placar Advantage escrito como "83% (5/6)" saía da sua caixa por cima dos nomes, e um nome no resumo de um bloco podia quebrar depois do primeiro nome. Uma dupla fica junta de cada lado do "&".

- **Você pode colocar o site no ecrã principal do seu telefone.** Um botão no rodapé oferece isso quando o seu navegador consegue, e **Adicionar o site ao ecrã principal** na ajuda diz como, para um iPhone e para um telefone Android. O Croquet Scores e o Gateball Scores têm um ícone cada, para que você os distinga.

- **As regiões de croquet da Nova Zelândia estão na lista.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury e as outras regiões em que os torneios nacionais da Nova Zelândia se dividem podem ser escolhidas como a região de um torneio.

### Para desenvolvedores de aplicativos

- **Há uma API pública.** Um aplicativo pode ler os torneios de um ano, um torneio com as suas competições e jogadores, os jogos e a classificação de uma competição, os torneios que mudaram de ano e os torneios que foram arquivados, como JSON, em `/api/v0`. Ela é `v0` enquanto está em desenvolvimento. Qualquer pessoa pode ler, e um aplicativo que envia uma chave criada em **Chaves de API** na sua conta tem uma cota própria, de início 60 requisições por minuto e 10.000 por dia. Um aplicativo sem chave divide uma cota pelo seu endereço, 10 por minuto e 500 por dia.

- **Uma chave deixa um aplicativo agir por você sem a sua senha.** Crie uma chave na sua conta, diga para que serve e revogue-a quando não quiser mais que seja usada. Uma chave pode ser criada só para ler, ou para ler e escrever, e pode ser limitada a um torneio. Por enquanto a API só lê. Apenas um hash da chave é guardado, então a chave é mostrada uma vez, quando você a cria.

- **Campos podem ser acrescentados a uma resposta sem uma nova versão.** Um aplicativo deve ignorar um campo que não conhece. Uma mudança que quebraria um aplicativo é feita como uma nova versão ao lado da antiga, de modo que um aplicativo escrito para a `v1` continua funcionando quando a `v2` chegar. **Ajuda para desenvolvedores de aplicativos** e **Os endpoints da API** na ajuda dizem o que cada endereço aceita e responde, em todos os idiomas.

- **Um handicap na API é um número.** É `4.5` e não `"4.5"`, e `null` onde o jogador não tem um.

### Responsáveis pelo ranking mundial

- **Uma segunda planilha de jogos de Golf Croquet tem o dia em que cada um foi lançado.** Acrescente `rankings2` ao endereço, onde está `rankings`, e a coluna I diz o dia em que cada jogo foi lançado, como uma data do Excel, no horário do lugar onde o torneio é jogado. A aba Rankings a oferece como **Baixar jogos para o ranking mundial com a data do jogo**. A primeira planilha continua como era, porque o programa dos responsáveis a lê pela posição.

## Lançado em 2026-11-15

- **Uma dupla é um único jogador na busca, seja qual for dos dois jogadores o primeiro citado.** "Sam Someone & Alex Another" e "Alex Another & Sam Someone" eram dois registros na página de jogadores, assim como "Peter & Rosie Landrebe" e "Rosie & Peter Landrebe". Agora são um só, em um só endereço, listado com o nome que o torneio mais recente escreveu.

- **Uma dupla pode ser escrita com barra, com sinal de mais ou com a palavra inglesa "and", e não só com o "&".** "Sam Someone / Alex Another", "Sam Someone + Alex Another" e "Sam Someone and Alex Another" são todos lidos como uma dupla. A palavra "and" só conta quando está sozinha, então um nome como "Sam Anderson" não é tomado por uma dupla.

- **Uma dupla é dita de forma curta nos resultados do suíço e nas tabelas dos grupos.** Um resultado do suíço dava a inicial do nome do primeiro jogador e o sobrenome do segundo. Agora diz cada jogador, como "T. Murphy & A. Sharpe", e um sobrenome que os dois compartilham é dito uma vez, como "R. & P. Landrebe". As colunas da tabela de um grupo têm como título as iniciais de cada jogador unidas por "&", como "TM&AS", ou "RL&PL" quando o sobrenome é comum.

- **A Guatemala está listada com os países onde ninguém jogou recentemente.** Antes aparecia com os países onde houve torneios desde 2025.

- **O site conta quantos leitores chegam e quais páginas leem.** Faz isso com a análise da web da Cloudflare, em todas as páginas que os leitores veem. As páginas em que os organizadores trabalham não são contadas. Não usa cookies e não identifica o usuário de nenhuma outra forma além do endereço IP.

- **Os torneios são publicados como arquivos que qualquer pessoa pode usar.** Todo torneio público, de croquet e de gateball, é escrito em um arquivo próprio, com seus jogadores e competições, ou suas equipes e testes onde é jogado por equipes, com as partidas desistidas incluídas e ditas como desistidas. Ficam em um repositório Git, `CroquetScores/data.croquetscores.com`, atualizado a cada hora, para que você possa classificar os resultados ou construir algo com eles, e uma correção apareça como uma mudança com data. Nenhuma conta, endereço de e-mail, nota ou comentário está em um arquivo, nem nada arquivado ou de um site de teste.

### Em caso de emergência

- **Há uma página para quem precisa assumir o site.** Se quem cuida do site não puder, por estar doente ou longe por muito tempo, qualquer pessoa conectada pode abrir **In case of emergency** na administração, dizer quem é e por que está assumindo, e apertar **Send**. Depois de uma confirmação, o que ela disse é enviado por e-mail às pessoas que sabem a senha da nota com tudo de que o site precisa, e as respostas vão para quem enviou. Uma conta pode pedir uma vez a cada 48 horas e é informada de quando poderá pedir de novo. A página abre com um aviso para não usá-la a menos que o administrador tenha recebido um e-mail e não tenha respondido em 48 horas, e para não testá-la. Assim que a mensagem é enviada, a página diz isso e não pede mais nada.

## Lançado em 2026-11-11

- **O menu no celular se fecha ao tocar fora dele.** O menu do botão Menu, no alto de uma tela estreita, se fecha quando você toca em qualquer outro ponto da página, além de quando você toca de novo no botão ou segue um link.

- **O menu Conta se fecha ao tocar fora dele.** A pessoa no fim do cabeçalho, que abre as opções de cadastrar-se, entrar e o resto, se fecha quando você toca em qualquer outro ponto da página, além de quando você toca nela de novo.

- **Faça o gesto de pinça para mudar o tamanho do texto.** Em uma tela sensível ao toque, junte dois dedos para diminuir o texto e afaste-os para aumentá-lo, até um tamanho entre a metade e o dobro do habitual. Ao contrário do zoom do próprio navegador, a página continua tão larga quanto a tela, então você nunca precisa rolar para o lado para ler uma linha. O tamanho é guardado, então é o mesmo em todas as páginas e em todas as visitas. Um dedo continua rolando como antes.

- **O menu no celular rola.** Numa tela baixa, o menu não passa da altura da tela e rola dentro dela, para que dê para chegar a todos os itens, e a página atrás dele fica onde estava até o menu se fechar.

- **Pedro Echeguren melhorou o espanhol.** Pedro revisou as palavras do site em espanhol e as corrigiu. Obrigado, Pedro.

## Lançado em 2026-11-10

O Croquet Scores foi totalmente reescrito. Espero que você goste da nova versão.

### Encontrar as coisas

- **Buscar.** Todas as páginas têm uma caixa de busca no alto. Digite um nome e pressione Buscar para encontrar torneios, competições e jogadores.

- **Restrinja os torneios por país, estado ou província, e esporte.** Na página inicial, escolha um país para ver só os torneios jogados nele. Depois de escolher um país, você pode escolher um estado ou uma província dele, e também pode escolher um esporte. Seu celular ou computador lembra o que você escolheu e começa a partir daí da próxima vez. **Escolher um estado ou uma província só encontra torneios novos.** Os mais antigos não receberam estado nem província, então escolher um os deixa de fora.

- **Restrinja os torneios por dias.** Informe um primeiro dia e um último dia, juntos, e só os torneios que começam entre eles são listados. Os dois dias estão incluídos.

- **A página de um ano mostra os seus meses.** Cada mês aparece fechado, dizendo quantos torneios começam nele. Pressione um mês para abrir os seus torneios, e abra quantos quiser. **+ Mostrar tudo** abre todos os meses.

- **As listas longas são divididas em páginas.** Uma lista de torneios mostra cem por vez, então uma busca ampla não carrega mais todas as linhas de uma só vez.

- **A ajuda encontra uma resposta pelo que você quer dizer.** Faça uma pergunta na caixa de busca da primeira página da ajuda, e ela encontra o artigo mesmo quando o artigo usa outras palavras de mesmo sentido. A primeira página também oferece perguntas populares e os assuntos em cartões.

### Acompanhar um torneio

- **Notas dos organizadores.** Os organizadores de um torneio agora podem escrever notas para avisar os jogadores do que precisam saber durante o torneio: o formato, uma mudança na ordem de jogo, o horário do almoço. Elas ficam na nova seção Notas do torneio, com a mais recente primeiro e há quanto tempo cada uma foi escrita.

- **Um asterisco (\*) marca o que você ainda não leu.** Uma nota o tem até você abri-la, e de novo se for alterada depois de você lê-la. Enquanto alguma nota não estiver lida, a seção Notas também o tem, em todas as páginas do torneio, para que você veja que há novidades sem precisar ir olhar. Os comentários são marcados da mesma forma. Seu navegador lembra o que você leu, então você não precisa entrar. Outro celular ou computador começa sem nada lido.

- **Os comentários ficam mais fáceis de acompanhar.** No site antigo, cada comentário novo jogava a página para o final, e quem relia comentários anteriores perdia o lugar. Agora a página só desce até um comentário novo se você já estiver no final, lendo o mais recente. Se você voltou para ler comentários anteriores, ela o deixa onde está.

- **Um bloco mostra a colocação de cada jogador.** A última coluna dá a colocação de cada jogador: 1, ou =2 quando não é possível desempatar os jogadores e eles dividem o segundo lugar. Quando jogadores estão empatados em partidas vencidas, uma linha abaixo diz como foram desempatados.

- **A ordem de jogo pode ser ordenada.** Pressione Jogo para ordenar as partidas pelo nome do vencedor, ou Data para ordenar por quando cada uma foi adicionada. Pressione de novo para inverter. O site lembra como você ordenou, em todas as competições e também nas listas de torneios, e um link abaixo da lista, Voltar à ordem habitual, esquece isso.

- **Os handicaps são mostrados.** Quando um jogador tem handicap, ele aparece depois do nome, junto com o que o jogador representa, como em Tim Murphy (4, Australia).

- **Uma competição diz a quantos arcos as suas partidas são jogadas** quando isso não é o habitual do esporte, assim: "Jogado a 14 arcos".

### O site

- **Seu idioma.** O site agora está em doze idiomas: africâner, árabe (Egito), tcheco, inglês, alemão, grego, letão, norueguês, português, espanhol, sueco e galês. Você vê o primeiro idioma que seu navegador pede e que o site tem, ou inglês se não tiver nenhum. Para escolher outro, use a lista no rodapé, no final de qualquer página, e pressione o botão ao lado dela. Se quiser que um idioma seja acrescentado, envie um e-mail para <croquetscores@gmail.com>.

- **Claro ou escuro.** Também no rodapé: escolha Claro, Escuro ou Sistema. Sistema acompanha seu celular ou computador. O site lembra sua escolha em todas as páginas e em todas as visitas.

- **Qual versão você está usando.** O rodapé agora mostra a versão do site que você está vendo, como v234. Se for relatar um problema, diga qual era a versão.

- **Seus dados.** A página /data-deletion-policy diz como fazer com que o que o site guarda a seu respeito seja apagado, o que é apagado e o que é mantido.

### Código aberto

O código agora é aberto, sob a GNU Affero General Public License versão 3 (AGPL-3.0). Qualquer pessoa pode lê-lo, usá-lo e alterá-lo, e quem executar uma versão alterada como um site deve compartilhar suas alterações sob a mesma licença.
