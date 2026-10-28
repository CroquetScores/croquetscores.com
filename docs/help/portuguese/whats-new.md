# Novidades

## Lançado em 2026-10-28

### Encontrar as coisas

- **Os resultados da busca são tabelas.** Os torneios e as competições que uma busca encontra agora aparecem como as listas da página inicial: os dias em que cada um foi disputado, o tipo de esporte, a bandeira do país e o nome. Uma competição mostra os dias, o tipo de esporte e a bandeira do seu torneio, e o torneio em que ela está. As datas e os nomes podem ser ordenados, cada tabela por conta própria, e a ordenação fica no endereço da página, ao lado do que você digitou. A ordenação reorganiza apenas os cem resultados exibidos, que são os que melhor combinam com suas palavras, não todos os resultados.
- **Os países mais movimentados vêm primeiro.** Onde quer que você escolha um país, a lista agora começa com Austrália, Egito, Inglaterra, Nova Zelândia, Espanha e Estados Unidos, depois os outros países em que houve torneios desde 2025, depois todos os demais, com uma linha entre os três grupos.
- **Cada torneio mostra seu esporte.** Em um tablet ou numa tela maior, as listas de torneios da página inicial e da página de um ano mostram o esporte do torneio como um código curto, como GC ou AC, numa cor própria para cada esporte, depois das datas. Em um celular o código é omitido para dar espaço aos nomes.
- **Página inicial.** Os próximos torneios da página inicial agora ficam abaixo dos resultados recentes em qualquer largura de tela.
- **As bandeiras não apertam mais o celular.** Em um celular, a coluna de bandeiras é omitida de todas as listas de torneios, para os nomes terem mais espaço.
- **A lista de países fica aberta no Chrome do Linux.** Antes, ao tocar no campo de país da página inicial, a lista abria e fechava logo em seguida. Agora ela fica aberta e rola.

### Acompanhar um torneio

- **Handicaps.** Os organizadores de um torneio agora podem dar um handicap a um jogador, como 4, +4 ou -1.5. Ele aparece depois do nome do jogador, com o que ele representa, se houver algo, como em Tim Murphy (4, Australia).
- **Pontos de peeling no grid suíço.** O resultado de um jogo no grid suíço agora termina com o peeling do jogo, como o arquivo de texto do ranking já fazia. Um jogo vencido por 26tp a 17 aparece como +9tp para o vencedor e -9tp para o perdedor. Um jogo sem peeling aparece como antes.

### Torneios trazidos dos sites antigos

- **Mais deles estão no país certo.** Muitos torneios vieram para o país errado, porque os sites antigos só conheciam o fuso horário. Agora o site lê o país no nome do torneio quando consegue, como Irish, Welsh, Bayfield ou CroqCan, e põe cada partida Inglaterra x Escócia no país que sediou o jogo naquele ano. Obrigado a Chris Williams pela ajuda com isso.
- **Torneios que ainda vão acontecer são trazidos** mesmo que seus organizadores ainda não tenham adicionado uma competição, para você poder ver quando e onde serão.
- **Um handicap depois do nome do jogador** nos sites antigos, como em Tim Murphy 1, não é mais tomado como parte do nome ao procurar o ranking mundial dele.

## Lançado em 2026-10-27

O Croquet Scores foi totalmente reescrito com IA, em TypeScript. Veja o que você vai notar.

### Encontrar as coisas

- **Buscar.** Toda página tem uma caixa de pesquisa no alto. Digite um nome e pressione Buscar para encontrar torneios, competições e jogadores. Os resultados vêm em três listas, e uma lista vazia é omitida. Se houver mais de cem de um mesmo tipo, a página avisa, e acrescentar uma palavra à pesquisa a restringe.
- **Restrinja os torneios por país, região e esporte.** Na página inicial, escolha um país para ver só os torneios disputados nele. Depois de escolher um país, você pode escolher um estado ou província dele, e também um esporte. O que você escolheu fica no endereço da página, então você pode salvá-lo nos favoritos ou enviá-lo a alguém, e o botão de voltar desfaz a escolha. **Escolher um estado ou província só encontra torneios novos.** Os mais antigos não receberam estado nem província, então escolher um deixa esses de fora.

### Acompanhar um torneio

- **Notas dos organizadores.** Os organizadores de um torneio agora podem escrever notas para dizer aos jogadores o que eles precisam saber enquanto o torneio é disputado: o formato, uma mudança na ordem de jogo, o horário do almoço. Elas ficam na nova seção Notas do torneio, com as mais recentes primeiro e há quanto tempo cada uma foi escrita.
- **Um asterisco (\*) marca o que você não leu.** Uma nota tem um até você abri-la, e de novo se for alterada depois de você lê-la. Enquanto houver alguma nota não lida, a seção Notas também tem um, em todas as páginas do torneio, então você vê que há novidades sem precisar ir olhar. Os comentários são marcados do mesmo modo. Seu navegador lembra o que você leu, então você não precisa entrar na sua conta. Outro celular ou computador começa sem nada lido.
- **Os comentários ficaram mais fáceis de acompanhar.** No site antigo, cada comentário novo jogava a página para o final, e quem relia comentários anteriores perdia o lugar. Agora a página só desce até um novo comentário se você já estiver no final, lendo o mais recente. Se você voltou para ler comentários anteriores, ela deixa você onde está.

### O site

- **Seu idioma.** O site agora está em dezessete idiomas: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska e Cymraeg. É mostrado a você o primeiro idioma pedido pelo seu navegador que o site tem, ou o inglês se não tiver nenhum. Para escolher outro, use a lista no rodapé, no fim de qualquer página, e pressione o botão ao lado. Se quiser que um idioma seja adicionado, escreva para <croquetscores@gmail.com>.
- **Claro ou escuro.** Também no rodapé: escolha Claro, Escuro ou Sistema. Sistema acompanha o seu celular ou computador. O site lembra a sua escolha em todas as páginas e a cada visita.
- **Qual versão você está usando.** O rodapé agora mostra a versão do site que você está vendo, como v234. Se for relatar um problema, diga por favor qual era a versão.

### Código aberto

O código agora é de código aberto, sob a Licença Pública Geral GNU Affero versão 3 (AGPL-3.0). Qualquer pessoa pode ler, usar e alterar o código, e quem executar uma versão alterada como site deve compartilhar suas alterações sob a mesma licença.
