// The site's words in Brazilian Portuguese.
// The reader is addressed as "você", in the plain, friendly register of a
// club's website. Buttons, menu items, tabs and headings are written in
// sentence case ("Alterar endereço de e-mail"), as Portuguese writes them, not
// with every word capitalised. The email address is "endereço de e-mail" in
// full and "e-mail" for the message itself. "Bye" stays as English says it
// because the site checks for that word in a player's name. Sports and
// countries are named as Brazilian Portuguese usually names them.
import type { Language } from "../common/language.js";

export const portuguese: Language = {
  tag: "pt",
  name: "Português",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Ir para o conteúdo",
    "navigation.menu": "Menu",
    "navigation.label": "Principal",
    "navigation.home": "Início",
    "navigation.help": "Ajuda",
    "navigation.admin": "Administração",
    "sections.label": "Seções",
    "theme.label": "Tema",
    "theme.light": "Claro",
    "theme.dark": "Escuro",
    "theme.system": "Sistema",
    "footer.donate": "Doar",
    "footer.plea":
      "Está gostando do {siteName}? Faça uma doação para ajudar no desenvolvimento.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacidade",
    "footer.termsOfUse": "Termos de uso",
    "footer.reportBug": "Relatar um erro",
    "beta.banner":
      "Este é um site beta. Os dados podem ser apagados a qualquer momento.",
    "privacy.contact":
      "Dúvidas sobre esta página ou sobre o que é guardado a seu respeito: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "Concordo com os termos de uso",
    "termsOfUse.link": "termos de uso",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "Denuncie o que foi escrito ou tire dúvidas sobre estes termos: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Marque a caixa para concordar com os termos de uso.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Este é um lugar seguro para aprender a usar o {siteName}. Tudo o que for digitado aqui pode ser removido a qualquer momento.",

    "language.label": "Idioma",
    "language.choose": "Alterar",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Há novidades para ler.",
    "whatsNew.admin.message": "Há novidades para quem organiza torneios.",
    "whatsNew.view": "Ver as novidades",
    "whatsNew.later": "Lembrar na próxima vez",
    "whatsNew.never": "Nunca mais mostrar este aviso",

    "form.otherwise":
      "Algo não está certo. Confira o que foi digitado e tente de novo.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "Conta",
    "account.register": "Cadastrar-se",
    "account.signIn": "Entrar",
    "account.forgotPassword": "Esqueci a senha",
    "account.signOut": "Sair",
    "account.profile": "Perfil",
    "account.changePassword": "Alterar senha",
    "account.changeEmailAddress": "Alterar endereço de e-mail",
    "account.changeName": "Alterar nome",
    "account.setPassword": "Definir senha",
    "account.forgetAccount": "Esquecer conta",

    "register.title": "Cadastre-se",
    "register.emailAddress": "Endereço de e-mail",
    "register.submit": "Cadastrar-se",
    "register.withGoogle": "Cadastrar-se com o Google",
    "register.or": "ou",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "O Google não confirmou que esse endereço de e-mail é seu, por isso ele não pode ser usado com o Google aqui. Use o seu endereço de e-mail abaixo.",
    "SignInWithGoogle.LinkedToAnother":
      "Esse endereço de e-mail já tem uma conta, vinculada a outra conta do Google. Entre com essa conta do Google ou com o seu endereço de e-mail e senha.",
    "SignInWithGoogle.NameMissing":
      "O Google não nos informou o seu nome, e uma conta precisa de um. Use o seu endereço de e-mail abaixo.",
    "Google.Unreachable":
      "Não foi possível acessar o Google agora. Tente de novo em alguns minutos ou use o seu endereço de e-mail abaixo.",
    "Registration.NotAPerson":
      "Isto não parece ter vindo de uma pessoa. Tente de novo e, se continuar acontecendo, espere alguns minutos e volte.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Digite um endereço de e-mail.",
    "EmailAddress.NoAt": "Um endereço de e-mail tem um @.",
    "EmailAddress.MoreThanOneAt": "Um endereço de e-mail tem um único @.",
    "EmailAddress.NoDomain":
      "Um endereço de e-mail tem um domínio depois do @, como exemplo.com.br.",

    "welcome.title": "Verifique seu e-mail",
    "welcome.checkEmail":
      "Um e-mail está a caminho do endereço que você informou. Siga o link dele para continuar.",
    "welcome.nothingArrived":
      "Se nada chegar em alguns minutos, olhe na pasta de lixo eletrônico ou spam.",
    "welcome.home": "Voltar ao {siteName}",
    "newConfirmationLink.title": "Receber um novo link",
    "newConfirmationLink.explanation":
      "O link para confirmar o seu endereço de e-mail expirou. Peça um novo e ele será enviado ao endereço com o qual você se cadastrou.",
    "newConfirmationLink.send": "Enviar um novo link",
    "newConfirmationLink.home": "Voltar ao {siteName}",
    "newConfirmationLink.signIn": "Entrar",
    "newConfirmationLink.sent.title": "Verifique seu e-mail",
    "newConfirmationLink.sent.explanation":
      "Um novo link está a caminho. Siga-o para confirmar o seu endereço de e-mail. Se nada chegar em alguns minutos, olhe na pasta de lixo eletrônico ou spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Esse endereço de e-mail já está confirmado",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Não há mais nada a confirmar. Entre com a senha que você informou ao confirmá-lo.",
    "newConfirmationLink.noLongerWorks.title": "Esse link não funciona mais",
    "newConfirmationLink.noLongerWorks.explanation":
      "Confira se você seguiu o link inteiro do e-mail, sem faltar nada no final. Se ainda assim não funcionar, cadastre-se de novo e um novo link será enviado.",
    "newConfirmationLink.tooMany.title": "Tente de novo mais tarde",
    "newConfirmationLink.tooMany.explanation":
      "Vários links foram enviados a este endereço recentemente. Espere uma hora e peça de novo, e olhe na pasta de lixo eletrônico ou spam enquanto isso.",

    "forgotPassword.title": "Esqueceu a senha?",
    "forgotPassword.emailAddress": "Endereço de e-mail",
    "forgotPassword.submit": "Enviar um jeito de voltar a entrar",
    "forgotPassword.home": "Voltar ao {siteName}",
    "forgotPassword.sent.title": "Verifique seu e-mail",
    "forgotPassword.sent.explanation":
      "Se esse endereço tiver uma conta, um link para definir uma nova senha está a caminho. Siga-o dentro de uma hora. Se nada chegar em alguns minutos, olhe na pasta de lixo eletrônico ou spam.",
    "forgotPassword.tryAgainLater":
      "Foram pedidos muitos links de acesso a partir daqui recentemente. Espere uma hora e tente de novo.",

    "setNewPassword.title": "Defina uma nova senha",
    "setNewPassword.password": "Senha",
    "setNewPassword.confirmPassword": "Confirmar senha",
    "setNewPassword.submit": "Definir minha nova senha",
    "setNewPassword.home": "Voltar ao {siteName}",
    "setNewPassword.signIn": "Entrar",
    "setNewPassword.askAgain": "Pedir um novo link",
    "setNewPassword.changed.title": "Sua senha foi alterada",
    "setNewPassword.changed.explanation":
      "Você foi desconectado de todos os lugares onde estava conectado. Entre com a sua nova senha.",
    "setNewPassword.expired.title": "Esse link expirou",
    "setNewPassword.expired.explanation":
      "Um link para definir uma nova senha vale por uma hora. Peça outro e ele será enviado ao mesmo endereço.",
    "setNewPassword.noLongerWorks.title": "Esse link não funciona mais",
    "setNewPassword.noLongerWorks.explanation":
      "Ele pode já ter sido usado, ou pode faltar algo no final. Peça outro se ainda precisar.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Não foi possível verificar a sua senha agora, então ela não foi alterada. Tente de novo em alguns minutos; o seu link continua valendo até expirar.",

    "forgetAccount.title": "Esquecer a sua conta",
    "forgetAccount.explanation":
      "O seu nome e endereço de e-mail podem ser tornados ilegíveis para sempre, e a sua conta encerrada. Para termos certeza de que é você, primeiro enviaremos por e-mail um link ao endereço da sua conta, e nada será esquecido até que você o siga.",
    "forgetAccount.submit": "Enviar o link por e-mail",
    "forgetAccount.sent.title": "Verifique seu e-mail",
    "forgetAccount.sent.explanation":
      "Enviamos um link por e-mail ao endereço da sua conta. Ele vale por 15 minutos, e só enquanto você estiver conectado a esta conta.",
    "forgetAccount.confirm.title": "Esquecer a sua conta para sempre?",
    "forgetAccount.confirm.explanation":
      "Depois de esquecidos, o seu nome e endereço de e-mail nunca mais poderão ser lidos, por ninguém, e não será possível entrar na sua conta. Isso não pode ser desfeito.",
    "forgetAccount.confirm.submit": "Esquecer a minha conta",
    "forgetAccount.forgotten.title": "Sua conta foi esquecida",
    "forgetAccount.forgotten.explanation":
      "O seu nome e endereço de e-mail não podem mais ser lidos, e você foi desconectado de todos os lugares onde estava conectado.",
    "forgetAccount.noLongerWorks.title": "Esse link não funciona mais",
    "forgetAccount.noLongerWorks.explanation":
      "Ele pode ter expirado, já ter sido usado ou ser de uma conta na qual você não está conectado. Peça de novo a partir da sua conta se ainda quiser que ela seja esquecida.",
    "forgetAccount.lastAdministrator.title": "Sua conta não pode ser esquecida",
    "forgetAccount.lastAdministrator.explanation":
      "Você é o único administrador deste site. Dê o papel de administrador a outra pessoa e então a sua conta poderá ser esquecida.",
    "forgetAccount.askAgain": "Pedir de novo",
    "forgetAccount.home": "Voltar ao {siteName}",

    "registrationsSuspended.title": "Os cadastros estão suspensos por ora",
    "registrationsSuspended.explanation":
      "Um serviço de que o cadastro precisa não está acessível agora, então ninguém pode se cadastrar até que ele volte a responder. Nada do que você digitou foi guardado.",
    "registrationsSuspended.tryAgainLater":
      "Tente de novo daqui a pouco. O administrador do site já foi avisado.",
    "registrationsSuspended.home": "Voltar ao {siteName}",

    "signIn.title": "Entrar",
    "signIn.emailAddress": "Endereço de e-mail",
    "signIn.password": "Senha",
    "signIn.submit": "Entrar",
    "signIn.forgotPassword": "Esqueci a senha",
    "signIn.register": "Cadastrar-se",
    "signIn.withGoogle": "Entrar com o Google",
    "signIn.or": "ou",
    "signIn.tryAgainLater":
      "Houve tentativas demais recentemente. Espere uma hora e tente de novo.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "O endereço de e-mail ou a senha está incorreto. Tente de novo.",

    "profile.title": "Perfil",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Nome:",
    "profile.emailAddress": "Endereço de e-mail:",

    "changeName.title": "Alterar nome",
    "changeName.name": "Nome",
    "changeName.submit": "Alterar nome",

    "setPassword.title": "Definir uma senha",
    "setPassword.explanation":
      "A sua conta não tem senha: você entra com o Google. Para entrar também com uma senha, enviaremos por e-mail um link para defini-la a {emailAddress}.",
    "setPassword.submit": "Enviar um link por e-mail",
    "setPassword.sent.title": "Verifique seu e-mail",
    "setPassword.sent.explanation":
      "Enviamos por e-mail um link para você definir uma senha. Ele vale por uma hora.",
    "setPassword.profile": "Voltar ao seu perfil",

    "changePassword.title": "Alterar senha",
    "changePassword.currentPassword": "Senha atual",
    "changePassword.password": "Nova senha",
    "changePassword.passwordConfirmation": "Confirmar senha",
    "changePassword.forgotPassword": "Esqueci a senha",
    "changePassword.submit": "Alterar senha",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Essa não é a sua senha.",

    "changeEmailAddress.title": "Alterar endereço de e-mail",
    "changeEmailAddress.emailAddress": "Novo endereço de e-mail",
    "changeEmailAddress.currentPassword": "Senha atual",
    "changeEmailAddress.submit": "Enviar um link de confirmação",
    "changeEmailAddress.sent.title": "Verifique seu e-mail",
    "changeEmailAddress.sent.explanation":
      "Um link para confirmar a mudança foi enviado ao novo endereço de e-mail. Siga-o, estando conectado, para mover a sua conta para lá.",
    "changeEmailAddress.confirm.title": "Mover a sua conta",
    "changeEmailAddress.confirm.explanation":
      "A sua conta será movida para {emailAddress}. A partir de agora você entrará com esse endereço.",
    "changeEmailAddress.confirm.submit": "Mover a minha conta",
    "changeEmailAddress.noLongerWorks.title": "Este link não funciona mais",
    "changeEmailAddress.noLongerWorks.explanation":
      "Ele expirou, já foi usado ou não foi enviado para a conta na qual você está conectado. Peça de novo a partir do seu perfil.",
    "changeEmailAddress.taken.title": "Sua conta não foi movida",
    "changeEmailAddress.profile": "Voltar ao seu perfil",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Essa não é a sua senha.",
    "ChangeEmailAddress.Unchanged": "A sua conta já está neste endereço.",
    "ChangeEmailAddress.Taken":
      "Esse endereço de e-mail agora tem uma conta própria, então a sua não pode ser movida para lá.",

    "confirmEmailAddress.title": "Confirme o seu endereço de e-mail",
    "confirmEmailAddress.name": "Nome",
    "confirmEmailAddress.password": "Senha",
    "confirmEmailAddress.confirmPassword": "Confirmar senha",
    "confirmEmailAddress.submit": "Confirmar o meu endereço de e-mail",
    "confirmEmailAddress.signIn": "Entrar",
    "confirmEmailAddress.home": "Voltar ao {siteName}",
    "confirmEmailAddress.confirmed.title":
      "O seu endereço de e-mail está confirmado",
    "confirmEmailAddress.confirmed.explanation":
      "A sua conta está pronta. Entre com o endereço de e-mail e a senha que você acabou de informar.",
    "confirmEmailAddress.expired.title": "Esse link expirou",
    "confirmEmailAddress.expired.explanation":
      "Um link para confirmar um endereço de e-mail vale por 24 horas. Peça um novo e ele será enviado ao mesmo endereço.",
    "confirmEmailAddress.expired.newLink": "Enviar um novo link",
    "confirmEmailAddress.noLongerWorks.title": "Esse link não funciona mais",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Confira se você seguiu o link inteiro do e-mail, sem faltar nada no final. Se ainda assim não funcionar, cadastre-se de novo e um novo link será enviado.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Esse endereço de e-mail já está confirmado",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Não há mais nada a fazer. Entre com a senha que você informou ao confirmá-lo.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Digite um nome.",
    "PersonName.TooShort": "Um nome precisa ter pelo menos 3 caracteres.",
    "PersonName.TooLong": "Um nome pode ter no máximo 254 caracteres.",
    "WorldRankingName.TooShort":
      "Um nome do ranking mundial precisa ter pelo menos 3 caracteres.",
    "WorldRankingName.TooLong":
      "Um nome do ranking mundial pode ter no máximo 254 caracteres.",
    "Password.Missing": "Digite uma senha.",
    "Password.TooShort": "Uma senha precisa ter pelo menos 12 caracteres.",
    "Password.ConfirmationDiffers":
      "Isto não é igual à senha acima. Digite de novo.",
    "Password.Breached":
      "Esta senha já apareceu em um vazamento de dados em outro lugar, por isso não é segura para usar aqui. Escolha outra.",

    "javaScriptRequired.title": "É preciso ativar o JavaScript",
    "javaScriptRequired.explanation":
      "Para se cadastrar é preciso ter o JavaScript ativado neste site, para que ele possa verificar que quem está se cadastrando é uma pessoa. Ative-o e cadastre-se de novo.",
    "javaScriptRequired.register": "Voltar ao cadastro",
    "javaScriptRequired.home": "Voltar ao {siteName}",

    "errors.backHome": "Voltar ao {siteName}",
    "errors.notFound": "Não encontrado",
    "errors.refused": "Não foi possível fazer isso",
    "errors.refusedDetail": "Algo no que foi enviado não estava certo.",
    "errors.sorry": "Desculpe",
    "errors.sorryDetail": "Não foi possível atender a esse pedido.",
    "errors.failed": "Algo deu errado",
    "errors.reference": "Referência {reference}.",
    "errors.recorded":
      "O erro foi registrado e um e-mail foi enviado ao administrador. Ajuda enviar um e-mail ao administrador com a referência e uma descrição do que você estava fazendo.",
    "errors.message": "Enviar e-mail ao administrador",
    "errors.messageSubject": "Erro {reference} no {siteName}",
    "errors.messageBody": "O que eu estava fazendo quando isto aconteceu:\n\n",
    "errors.unavailable": "O site está indisponível",
    "errors.unavailableDetail":
      "O site não consegue acessar o que precisa agora. Tente de novo mais tarde.",
    "errors.maintenance": "O site está fora do ar para manutenção.",
    "errors.maintenanceMinutes": "A previsão é que volte em {minutes} minutos.",
    "errors.maintenanceMinute": "A previsão é que volte em 1 minuto.",
    "errors.maintenanceLonger":
      "Está demorando mais que o previsto e voltará em breve.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Resultados recentes",
    "home.recentResults.none":
      "Nenhuma partida foi adicionada nos últimos sete dias.",
    "home.upcomingTournaments": "Próximos torneios",
    "home.upcomingTournaments.none":
      "Nenhum torneio começa nos próximos sessenta dias.",
    "home.allTournaments": "Todos os torneios de {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Torneios de {year}",
    "year.none": "Nenhum torneio começa em {year}.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "Torneios de {sport} de {year}",
    "yearSport.none": "Nenhum torneio de {sport} começa em {year}.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Recentes",
    "tournament.summary": "Resumo",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "Cada partida é melhor de {count}.",
    "test.vs": "x",
    "test.matches": "Partidas",
    "test.games": "Jogos",
    "test.hoops": "Arcos",
    "teamSummary.tests": "Testes",
    "teamSummary.matches": "Partidas",
    "teamSummary.games": "Jogos",
    "teamSummary.hoops": "Arcos",
    "teamSummary.wins": "Vitórias",
    "teamSummary.losses": "Derrotas",
    "teamSummary.draws": "Empates",
    "teamSummary.for": "A favor",
    "teamSummary.against": "Contra",
    "teamSummary.net": "Saldo",
    "tournament.players": "Jogadores",
    "search.label": "Buscar",
    "search.tournaments": "Torneios",
    "search.competitions": "Competições",
    "search.nothingFound": "Nada foi encontrado.",
    "players.search.label": "Buscar jogadores",
    "players.search.prompt": "Digite o nome de um jogador para encontrá-lo.",
    "players.search.none": "Nenhum jogador foi encontrado.",
    "search.more":
      "Só os primeiros {count} são mostrados. Digite mais do nome para refinar a busca.",
    "websitePlayer.tournament": "Torneio",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} x {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Comentários",
    "tournament.beat": "venceu",
    "tournament.drewWith": "empatou com",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 hora",
    "tournament.ago.hours": "{count} horas",
    "tournament.none": "Nenhuma partida foi jogada ainda.",
    // A tournament's players' page, when it has none.
    "players.none": "Nenhum jogador foi adicionado ainda.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "por",
    "commentaries.start": "Iniciar novo comentário",
    // The page that starts a commentary.
    "startCommentary.title": "Iniciar novo comentário",
    "startCommentary.titleField": "Título",
    "startCommentary.submit": "Iniciar comentário",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "novo",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Os organizadores ainda não escreveram nenhuma nota.",
    "note.edited": "editada",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "Nenhum comentário foi escrito ainda.",
    "commentary.edited": "editado",
    "commentary.edit": "Editar",
    "commentary.delete": "Excluir",
    "commentary.comment": "Comentário",
    "commentary.add": "Adicionar comentário",
    "commentary.notSent":
      "Não foi possível enviar o comentário. Carregue a página de novo para ver se ele foi guardado.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Alterar título",
    "changeCommentaryTitle.submit": "Salvar",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "Editar comentário",
    "editComment.save": "Salvar",
    "deleteComment.title": "Excluir comentário",
    "deleteComment.question":
      "Excluir este comentário? Isso não pode ser desfeito.",
    "deleteComment.confirm": "Excluir comentário",
    "deleteComment.keep": "Manter",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "Jogos",
    "player.competitions": "Competições",
    "player.beat": "venceu",
    "player.lostTo": "perdeu para",
    "player.drewWith": "empatou com",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Nenhuma partida foi jogada ainda.",
    "player.noCompetitions": "Ainda não está inscrito em nenhuma competição.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "Vitórias",
    "block.matches": "Partidas",
    "block.netGames": "Saldo de jogos",
    "block.games": "Jogos",
    "block.netHoops": "Saldo de arcos",
    "block.won": "vitória",
    "block.lost": "derrota",
    "block.drawn": "empate",
    "block.withdrawn": "desistente",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "desistência",
    "block.losses": "Derrotas",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Visualizações",
    "competition.view.grid": "Grade",
    "competition.view.summary": "Resumo",
    "competition.view.orderOfPlay": "Ordem de jogo",
    "competition.print": "Imprimir",
    "blockSummary.ranking":
      "Classificados pela proporção de partidas vencidas e, depois, pelo saldo de arcos. O regulamento do próprio torneio pode classificar os jogadores de outro modo.",
    "orderOfPlay.none": "Nenhuma partida foi jogada ainda.",
    "orderOfPlay.column.game": "Jogo",
    "orderOfPlay.column.date": "Data",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinais",
    "knockout.round.quarters": "Quartas de final",
    "knockout.round.number": "Rodada {number}",
    "knockout.bye": "Bye",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "Jogos",
    "swiss.wins": "Vitórias",
    "swiss.winShare": "% de vitórias",
    "swiss.results": "Resultados",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "Rodadas seguintes",
    "knockout.back": "Rodadas anteriores",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nome",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Só torneios em {country}",
    "tournamentList.usualOrder": "Voltar à ordem habitual",
    "tournamentList.filter.country": "País",
    "tournamentList.filter.anyCountry": "Qualquer país",
    "tournamentList.filter.region": "Região",
    "tournamentList.filter.anyRegion": "Qualquer região",
    "tournamentList.filter.noRegionsBefore":
      "Torneios anteriores a novembro de 2026 não têm região.",
    "tournamentList.filter.sport": "Esporte",
    "tournamentList.filter.anySport": "Qualquer esporte",
    "tournamentList.filter.submit": "Filtrar",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "Anos",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Anos anteriores",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message":
      "Há uma versão mais nova deste site disponível.",
    "admin.newerBuild.reload": "Recarregar",
    "admin.title": "Administração",
    "admin.tournaments.new": "Novo torneio",
    "admin.tournaments.none": "Nenhum torneio",
    "admin.tournaments.filter.none": "Nenhum torneio corresponde",
    "admin.tournaments.show": "Mostrar",
    "admin.tournaments.managerScorer": "Gestor/Marcador",
    "admin.tournaments.worldRanking": "Ranking mundial",
    "admin.tournaments.notWorldRanking": "Fora do ranking mundial",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Arquivado",
    "admin.tournaments.manage": "Gerenciar",
    "admin.tournaments.edit": "Editar",
    "admin.tournaments.archive": "Arquivar",
    "admin.tournaments.restore": "Restaurar",
    "admin.tournaments.scores": "Resultados",
    "admin.tournaments.players": "Jogadores",
    "admin.years.label": "Anos",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Anos anteriores",
    "admin.tournament.name": "Nome",
    "admin.tournament.starts": "Início",
    "admin.tournament.finishes": "Término",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Esporte",
    "admin.tournament.country": "País",
    "admin.tournament.region": "Região",
    "admin.tournament.subtitle": "Subtítulo",
    "admin.rules.handicap": "Jogado com handicaps",
    "admin.rules.drawsAllowed": "Permite empates",
    "admin.tournament.levelTestsDrawn": "Testes igualados são empates",
    "admin.rules.worldRankings": "Conta para o ranking mundial",
    "admin.tournament.national": "Evento de nível nacional",
    "admin.tournament.international": "Evento de nível internacional",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Isto não pode ser aceito como está.",
    "admin.newTournament.title": "Novo torneio",
    "admin.newTournament.submit": "Criar torneio",
    "admin.editTournament.title": "Editar torneio",
    "admin.editTournament.submit": "Atualizar torneio",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "Este torneio não pode ser alterado.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Torneio",
    "admin.view.players": "Jogadores",
    "admin.view.competitions": "Competições",
    "admin.view.managers": "Organizadores",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Anotadores",
    "admin.view.rankings": "Rankings",
    "admin.rankings.file":
      "O ranking mundial usará os resultados do torneio por meio desta função, e os organizadores não precisam fazer nada.",
    "admin.rankings.download": "Baixar jogos para o ranking mundial",
    "rankings.notAvailable": "Os rankings não estão disponíveis",
    "rankings.notAvailable.sport":
      "O esporte deste torneio não tem ranking mundial, então não há rankings a enviar.",
    "rankings.notAvailable.notCounted":
      "Nenhuma das competições deste torneio conta para o ranking mundial.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "Este torneio não pode ser gerenciado daqui.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Competição",
    "admin.competitionView.players": "Jogadores",
    "admin.competitionView.scores": "Resultados",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "O torneio e suas competições",
    "admin.sections.tournament": "Torneio",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Páginas do administrador",
    "admin.administrator.sections.tournaments": "Torneios",
    "admin.administrator.sections.accounts": "Contas",
    "admin.administrator.sections.worldRankings": "Ranking mundial",
    "admin.administrator.sections.importErrors": "Erros de importação",
    "admin.administrator.sections.logs": "Registros",
    "admin.administrator.sections.databaseStatus": "Acesso ao banco de dados",
    "admin.administrator.sections.countries": "Países",
    "admin.databaseStatus.title": "Acesso ao banco de dados",
    "admin.databaseStatus.on": "O acesso ao banco de dados está ativado.",
    "admin.databaseStatus.off": "O acesso ao banco de dados está desativado.",
    "admin.databaseStatus.expected":
      "A previsão é que o site volte em {minutes} minutos.",
    "admin.databaseStatus.expectedOne":
      "A previsão é que o site volte em 1 minuto.",
    "admin.databaseStatus.longer": "Está demorando mais que o previsto.",
    "admin.databaseStatus.told": "Os leitores veem: {words}",
    "admin.databaseStatus.toldUsual": "Os leitores veem a frase de costume.",
    "admin.databaseStatus.minutes": "Minutos previstos",
    "admin.databaseStatus.words": "Texto para os leitores",
    "admin.databaseStatus.turnOff": "Desativar",
    "admin.databaseStatus.change": "Alterar",
    "admin.databaseStatus.turnOn": "Ativar",
    "admin.databaseStatus.minutesNeeded": "Os minutos são obrigatórios.",
    "admin.databaseStatus.otherwise": "Algo deu errado no site.",
    "DatabaseAccess.MinutesNotWhole": "Os minutos devem ser um número inteiro.",
    "DatabaseAccess.MinutesOutOfRange": "Os minutos devem ser de 1 a 1440.",
    "DatabaseAccess.WordsTooLong": "O texto deve ter no máximo 500 caracteres.",
    "DatabaseAccess.NotOff": "O acesso ao banco de dados não está desativado.",
    "admin.administrator.title": "Administrador",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Contas",
    "admin.roles.add": "Adicionar",
    "admin.roles.administrator.heading": "Administradores",
    "admin.roles.administrator.none": "Nenhum outro administrador",
    "admin.roles.administrator.removeTitle": "Remover administrador",
    "admin.roles.administrator.removeExplanation":
      "{name} deixará de ser administrador deste site.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Responsáveis pelo ranking mundial de Croquet de Associação",
    "admin.roles.ac-world-ranking-officer.none":
      "Nenhum responsável pelo ranking mundial de Croquet de Associação",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Remover responsável pelo ranking mundial de Croquet de Associação",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} deixará de ser responsável pelo ranking mundial de Croquet de Associação.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Responsáveis pelo ranking mundial de Croquet de Golfe",
    "admin.roles.gc-world-ranking-officer.none":
      "Nenhum responsável pelo ranking mundial de Croquet de Golfe",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Remover responsável pelo ranking mundial de Croquet de Golfe",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} deixará de ser responsável pelo ranking mundial de Croquet de Golfe.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "Importar jogadores do ranking mundial",
    "admin.worldRankings.import": "Importar",
    "admin.worldRankings.log": "Como foi a importação",
    "admin.worldRankings.ac.reading": "Lendo a lista de Croquet de Associação",
    "admin.worldRankings.ac.read":
      "Jogadores de Croquet de Associação lidos: {players}",
    "admin.worldRankings.ac.kept":
      "Jogadores de Croquet de Associação mantidos: {players}",
    "admin.worldRankings.ac.refused":
      "Não foi possível ler a lista de Croquet de Associação, então os jogadores foram deixados como estavam.",
    "admin.worldRankings.gc.reading": "Lendo a lista de Croquet de Golfe",
    "admin.worldRankings.gc.read":
      "Jogadores de Croquet de Golfe lidos: {players}",
    "admin.worldRankings.gc.kept":
      "Jogadores de Croquet de Golfe mantidos: {players}",
    "admin.worldRankings.gc.refused":
      "Não foi possível ler a lista de Croquet de Golfe, então os jogadores foram deixados como estavam.",
    "admin.worldRankings.finished": "Concluído",
    "admin.worldRankings.failed": "A importação não terminou.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Algo deu errado no site.",
    "WorldRankingLists.Unreachable":
      "Não foi possível acessar o site do ranking mundial.",
    "WorldRankingLists.Unreadable":
      "A lista não está no formato usado pelo ranking mundial: uma linha dela não pôde ser lida, ela não tem ninguém ou não está escrita em UTF-8.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Erros de importação",
    "admin.importErrors.none": "Nenhum erro de importação",
    "admin.importErrors.otherwise": "Algo deu errado no site.",
    "admin.countries.title": "Países",
    "admin.countries.none":
      "Nenhum torneio é jogado num país que as listas não citam",
    "admin.countries.oldSite": "Site antigo",
    "admin.countries.otherwise": "Algo deu errado no site.",
    "admin.logs.title": "Registros",
    "admin.logs.severity": "Gravidade",
    "admin.logs.text": "Procurar",
    "admin.logs.show": "Mostrar",
    "admin.logs.prune": "Limpar",
    "admin.logs.pruneAsk":
      "Remover o registro anterior à última hora? Nada o traz de volta.",
    "admin.logs.removed": "{count} entradas foram removidas",
    "admin.logs.none": "Nenhuma entrada no registro",
    "admin.logs.otherwise": "Algo deu errado no site.",
    "admin.hover.logs.show": "Mostrar as entradas correspondentes",
    "admin.hover.logs.prune": "Remover o registro anterior à última hora",
    "admin.hover.logs.pruneAgree": "Remover o registro anterior à última hora",
    "admin.importError.title": "Erro de importação",
    "admin.importError.documentId": "ID do documento",
    "admin.importError.tournament": "Torneio",
    "admin.importError.competition": "Competição",
    "admin.importError.newSite": "Site novo",
    "admin.importError.oldSite": "Site antigo",
    "ImportErrorKept.NotFound":
      "A importação não guardou nenhum erro para esse documento.",
    "admin.competitionView.otherwise":
      "Esta competição não pode ser gerenciada daqui.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "Grupo",
    "admin.competitions.knockout": "Mata-mata",
    "admin.competitions.swiss": "Suíço",
    "admin.competitions.view": "Ver",
    "admin.competitions.edit": "Editar",
    "admin.competitions.up": "Subir",
    "admin.competitions.down": "Descer",
    "admin.competitions.archive": "Arquivar",
    "admin.competitions.restore": "Restaurar",
    "admin.competitions.archived": "Competições arquivadas",
    "admin.competitions.none": "Nenhuma competição",
    "admin.competitions.add": "Adicionar competição",
    // The competition dialog.
    "admin.competition.addTitle": "Adicionar competição",
    "admin.competition.editTitle": "Editar competição",
    "admin.competition.name": "Nome",
    "admin.competition.kind": "Tipo",
    "admin.competition.bestOf": "Melhor de",
    "admin.competition.rounds": "Rodadas",
    "admin.competition.places": "Vagas",
    "admin.competition.round": "Rodada {number}",
    "admin.competition.bestOfs": "Melhor de, por fase",
    "admin.competition.quarters": "Quartas",
    "admin.competition.semis": "Semifinais",
    "admin.competition.final": "Final",
    "admin.competition.add": "Adicionar",
    "admin.competition.save": "Salvar",
    "admin.competition.added": "{name} foi adicionada.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Esta competição não pode ser guardada como está.",
    "CompetitionName.Missing": "Digite um nome.",
    "CompetitionName.TooLong": "Um nome pode ter no máximo 254 caracteres.",
    "CompetitionName.NoLetterOrDigit":
      "Um nome precisa ter uma letra ou um dígito.",
    "Tournament.KnockoutPlayerHasGames":
      "Há jogadores deste chaveamento com jogos, então as vagas não podem mudar.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Uma rodada com uma partida decidida não pode passar a ser um melhor de menos jogos.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Uma rodada não pode ser alterada depois que um jogo foi disputado em uma rodada posterior.",
    "Tournament.CompetitionNameTaken":
      "Outra competição deste torneio já tem esse nome.",
    "BestOf.NotWhole": "Digite um número inteiro de jogos.",
    "BestOf.TooSmall": "Uma partida deve ser o melhor de pelo menos 1 jogo.",
    "Rounds.NotWhole": "Digite um número inteiro de rodadas.",
    "Rounds.TooSmall": "Um grupo deve ser disputado em pelo menos 1 rodada.",
    "KnockoutDraw.EvenBestOf":
      "Uma partida de mata-mata precisa ter um vencedor, então é o melhor de um número ímpar de jogos.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Criar um novo torneio",
    "admin.hover.tournaments.manage":
      "Gerenciar os jogadores, equipes, competições e resultados deste torneio",
    "admin.hover.tournaments.edit": "Alterar os dados deste torneio",
    "admin.hover.tournaments.scores": "Lançar os resultados deste torneio",
    "admin.hover.tournaments.players": "Cuidar dos jogadores deste torneio",
    "admin.hover.competitions.view":
      "Abrir esta competição para ver e lançar seus jogadores e resultados",
    "admin.hover.tests.view":
      "Abrir este teste para ver e lançar seus resultados",
    "admin.hover.teams.view":
      "Abrir esta equipe para ver e gerenciar seus jogadores",
    "admin.hover.dialog.player.add": "Adicionar este jogador ao torneio",
    "admin.hover.dialog.player.save": "Guardar as alterações deste jogador",
    "admin.hover.dialog.team.add": "Adicionar esta equipe ao torneio",
    "admin.hover.dialog.team.save": "Guardar as alterações desta equipe",
    "admin.hover.dialog.test.add": "Adicionar este teste ao torneio",
    "admin.hover.dialog.test.save": "Guardar as alterações deste teste",
    "admin.hover.dialog.competition.add":
      "Adicionar esta competição ao torneio",
    "admin.hover.dialog.competition.save":
      "Guardar as alterações desta competição",
    "admin.hover.dialog.score.add": "Adicionar este resultado à competição",
    "admin.hover.dialog.score.save": "Guardar a correção deste resultado",
    "admin.hover.dialog.carryForward.save":
      "Transferir os resultados deste jogador",
    "admin.hover.dialog.tournament.new": "Criar este torneio",
    "admin.hover.dialog.tournament.edit": "Guardar as alterações deste torneio",
    "admin.hover.modal.cancel": "Fechar sem guardar nada",
    "admin.hover.modal.ok": "Fechar esta mensagem",
    "admin.hover.tab": "Mostrar a aba {name}",
    "admin.hover.tournaments.archive":
      "Arquivar este torneio; ele pode ser restaurado",
    "admin.hover.tournaments.restore": "Trazer de volta este torneio arquivado",
    "admin.hover.players.add": "Adicionar um jogador a este torneio",
    "admin.hover.players.edit": "Alterar os dados deste jogador",
    "admin.hover.players.up": "Subir este jogador na lista",
    "admin.hover.players.down": "Descer este jogador na lista",
    "admin.hover.players.archive":
      "Arquivar este jogador; ele pode ser restaurado",
    "admin.hover.players.restore": "Trazer de volta este jogador arquivado",
    "admin.hover.teams.add": "Adicionar uma equipe a este torneio",
    "admin.hover.teams.edit": "Alterar os dados desta equipe",
    "admin.hover.teams.up": "Subir esta equipe na lista",
    "admin.hover.teams.down": "Descer esta equipe na lista",
    "admin.hover.teams.archive":
      "Arquivar esta equipe; ela pode ser restaurada",
    "admin.hover.teams.restore": "Trazer de volta esta equipe arquivada",
    "admin.hover.competitions.add": "Adicionar uma competição a este torneio",
    "admin.hover.competitions.edit": "Alterar os dados desta competição",
    "admin.hover.competitions.up": "Subir esta competição na lista",
    "admin.hover.competitions.down": "Descer esta competição na lista",
    "admin.hover.competitions.archive":
      "Arquivar esta competição; ela pode ser restaurada",
    "admin.hover.competitions.restore":
      "Trazer de volta esta competição arquivada",
    "admin.hover.tests.add": "Adicionar um teste entre duas equipes",
    "admin.hover.tests.edit": "Alterar os dados deste teste",
    "admin.hover.tests.up": "Subir este teste na lista",
    "admin.hover.tests.down": "Descer este teste na lista",
    "admin.hover.tests.archive": "Arquivar este teste; ele pode ser restaurado",
    "admin.hover.tests.restore": "Trazer de volta este teste arquivado",
    "admin.hover.tests.toTeams":
      "Ir para a aba Equipes para adicionar as equipes de que um teste precisa",
    "admin.hover.scores.add":
      "Adicionar o resultado de um jogo a esta competição",
    "admin.hover.scores.edit": "Corrigir este resultado",
    "admin.hover.scores.archive":
      "Arquivar este resultado para que deixe de contar; ele pode ser restaurado",
    "admin.hover.scores.restore":
      "Trazer de volta este resultado arquivado, para que volte a contar",
    "admin.hover.scores.withdraw":
      "Manter este resultado na lista, mas fazer com que deixe de contar",
    "admin.hover.scores.unwithdraw":
      "Fazer este resultado anulado voltar a contar",
    "admin.hover.scores.up": "Mover este resultado para mais cedo na lista",
    "admin.hover.scores.down": "Mover este resultado para mais tarde na lista",
    "admin.hover.competitionPlayers.add":
      "Colocar o jogador escolhido nesta competição",
    "admin.hover.competitionPlayers.up": "Subir este jogador na lista",
    "admin.hover.competitionPlayers.down": "Descer este jogador na lista",
    "admin.hover.competitionPlayers.remove": "Tirar este jogador da competição",
    "admin.hover.competitionPlayers.withdraw":
      "Retirar este jogador da competição",
    "admin.hover.competitionPlayers.unwithdraw":
      "Recolocar na competição este jogador que desistiu",
    "admin.hover.competitionPlayers.carryForward":
      "Transferir os resultados deste jogador de outra competição",
    "admin.hover.notes.add": "Escrever uma nova nota para este torneio",
    "admin.hover.notes.edit": "Alterar esta nota",
    "admin.hover.notes.delete": "Excluir esta nota",
    "admin.hover.note.add": "Guardar esta nota e adicioná-la ao torneio",
    "admin.hover.note.save": "Guardar as alterações desta nota",
    "admin.hover.people.add": "Dar o papel a esta pessoa",
    "admin.hover.people.remove": "Tirar o papel desta pessoa",
    "admin.hover.worldRankings.import":
      "Buscar o ranking mundial e adicionar seus jogadores",
    "admin.modal.cancel": "Cancelar",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "Endereço de e-mail",
    "admin.people.remove": "Remover",
    "admin.people.otherwise": "Não foi possível fazer isso.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Você",
    "admin.managers.add": "Adicionar organizador",
    "admin.managers.email": "Enviar e-mail aos organizadores",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "Nenhum organizador",
    "admin.managers.removeTitle": "Remover organizador",
    "admin.managers.removeExplanation":
      "{name} não poderá mais organizar este torneio.",
    "admin.managers.removeYourself.explanation":
      "Você não poderá mais organizar este torneio, e ninguém aqui pode desfazer isso por você. Outro organizador pode torná-lo organizador de novo.",
    "admin.managers.otherwise": "Esse endereço não pode virar organizador.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Adicionar jogador",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Este jogador não pode ser adicionado.",
    "admin.competitionPlayers.choose": "Jogador a adicionar",
    "admin.competitionPlayers.nobody": "Escolha um jogador",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Todos os jogadores estão na competição",
    "admin.competitionPlayers.none": "Nenhum jogador",
    "admin.competitionPlayers.up": "Subir",
    "admin.competitionPlayers.down": "Descer",
    "admin.competitionPlayers.remove": "Remover",
    "admin.competitionPlayers.withdraw": "Retirar",
    "admin.competitionPlayers.unwithdraw": "Recolocar",
    "admin.competitionPlayers.withdrawn": "Jogadores que desistiram",
    "admin.competitionPlayers.removeTitle": "Remover jogador",
    "admin.competitionPlayers.removeQuestion":
      "{name} será tirado da competição. Isso não pode ser desfeito.",
    "admin.competitionPlayers.withdrawTitle": "Retirar jogador",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} não jogará mais a competição, e os jogos que ainda não disputou serão decididos sem ele.",
    "admin.competitionPlayers.carryForward": "Transferir",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Transferir - {name}",
    "admin.carryForward.save": "Salvar",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "Esta transferência não pode ser guardada.",
    "admin.carryForward.matchWins": "Partidas vencidas",
    "admin.carryForward.matchLosses": "Partidas perdidas",
    "admin.carryForward.gameWins": "Jogos vencidos",
    "admin.carryForward.gameLosses": "Jogos perdidos",
    "admin.carryForward.hoopsFor": "Arcos a favor",
    "admin.carryForward.hoopsAgainst": "Arcos contra",
    "CarryForward.MatchWinsNotWhole":
      "Digite um número inteiro de partidas vencidas.",
    "CarryForward.MatchWinsBelowZero": "Digite 0 ou mais partidas vencidas.",
    "CarryForward.MatchLossesNotWhole":
      "Digite um número inteiro de partidas perdidas.",
    "CarryForward.MatchLossesBelowZero": "Digite 0 ou mais partidas perdidas.",
    "CarryForward.GameWinsNotWhole":
      "Digite um número inteiro de jogos vencidos.",
    "CarryForward.GameWinsBelowZero": "Digite 0 ou mais jogos vencidos.",
    "CarryForward.GameLossesNotWhole":
      "Digite um número inteiro de jogos perdidos.",
    "CarryForward.GameLossesBelowZero": "Digite 0 ou mais jogos perdidos.",
    "CarryForward.HoopsForNotWhole":
      "Digite um número inteiro de arcos a favor.",
    "CarryForward.HoopsForBelowZero": "Digite 0 ou mais arcos a favor.",
    "CarryForward.HoopsAgainstNotWhole":
      "Digite um número inteiro de arcos contra.",
    "CarryForward.HoopsAgainstBelowZero": "Digite 0 ou mais arcos contra.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Adicionar resultado",
    "admin.scores.none": "Nenhum resultado",
    "admin.scores.edit": "Editar",
    "admin.scores.drawNotFilledTitle": "Chaveamento incompleto",
    "admin.scores.archive": "Arquivar",
    "admin.scores.up": "Subir",
    "admin.scores.down": "Descer",
    "admin.scores.restore": "Restaurar",
    "admin.scores.archived": "Resultados arquivados",
    "admin.scores.archivedSaid": "Arquivado",
    "admin.scores.withdraw": "Anular",
    "admin.scores.unwithdraw": "Desfazer anulação",
    "admin.scores.withdrawnSaid": "Anulado",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "Não foi possível fazer isso.",
    "admin.score.title": "Adicionar resultado",
    "admin.score.add": "Adicionar jogo",
    "admin.score.winner": "Vencedor",
    "admin.score.winnerScore": "Pontos do vencedor",
    "admin.score.loser": "Perdedor",
    "admin.score.loserScore": "Pontos do perdedor",
    "admin.score.beat": "venceu",
    "admin.score.added":
      "O jogo em que {winner} venceu {loser} foi adicionado.",
    "admin.score.otherwise": "Não foi possível adicionar o jogo.",
    "admin.score.correctTitle": "Editar resultado",
    "admin.score.save": "Salvar",
    "admin.score.notCorrected": "Não foi possível corrigir o resultado.",
    "Game.WinnerMissing": "Escolha o vencedor.",
    "Game.WinnerScoreMissing": "Digite os pontos do vencedor.",
    "Game.LoserMissing": "Escolha o perdedor.",
    "Game.LoserScoreMissing": "Digite os pontos do perdedor.",
    "Score.NoPoints": "Um resultado começa com o seu número de pontos.",
    "Game.SamePlayer": "Ninguém joga contra si mesmo.",
    "Game.WinnerNotAhead":
      "Os pontos do vencedor precisam ser maiores que os do perdedor, ou marcados como vitória.",
    "Game.LoserMarked":
      "Os pontos do perdedor não podem ser marcados como vitória.",
    "Game.ResultChanged":
      "Uma correção mantém o resultado: um jogo vencido continua vencido, e um jogo empatado continua empatado.",
    "Competition.MatchDecided": "A partida deles já está decidida.",
    "Competition.DrawFull":
      "Não é possível adicionar o jogador porque o mata-mata está completo.",
    "Competition.DrawNotFilled":
      "Não é possível adicionar resultados até que todas as vagas do mata-mata estejam preenchidas com um jogador ou um bye.",
    "Competition.ByeOutsideKnockout": "Só um mata-mata pode ter um bye.",
    "Competition.NotDrawnToMeet":
      "Estes jogadores não estão sorteados para jogar entre si no mata-mata.",
    "Competition.WinnerHasPlayedOn":
      "O vencedor desta partida já jogou o jogo seguinte, então quem a venceu não pode mudar.",
    "CompetitionPlayer.Withdrawn": "Um jogador que desistiu não joga mais.",
    "admin.players.add": "Adicionar jogador",
    "admin.players.none": "Nenhum jogador",
    "admin.players.edit": "Editar",
    "admin.players.archive": "Arquivar",
    "admin.players.restore": "Restaurar",
    "admin.players.up": "Subir",
    "admin.players.down": "Descer",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Arquivar jogador",
    "admin.players.archiveQuestion": "{name} será removido destas competições:",
    "admin.players.archive.explanation":
      "Restaurá-lo não o colocará de volta nestas competições.",
    "admin.players.archived": "Jogadores arquivados",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Arquivado",
    // The player dialog.
    "admin.player.addTitle": "Adicionar jogador",
    "admin.player.editTitle": "Editar jogador",
    "admin.player.name": "Nome",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Representando",
    "admin.player.worldRankingName": "Nome do jogador no ranking mundial",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "O ranking mundial conhece este nome.",
    "admin.player.worldRankingQuestioned":
      "O ranking mundial não tem nenhum jogador com este nome. Ele pode estar escrito errado, ou o jogador pode ser novo no ranking.",
    "admin.player.flag": "Bandeira",
    "admin.player.add": "Adicionar",
    "admin.player.save": "Salvar",
    "admin.player.added": "{name} foi adicionado.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Este jogador não pode ser guardado como está.",
    "Tournament.PlayerNameTaken":
      "Outro jogador deste torneio já tem esse nome.",
    "TournamentPlayer.NoSuchFlag": "Escolha uma das bandeiras disponíveis.",
    "TournamentPlayer.HandicapMalformed":
      "Escreva o handicap como um número. Por exemplo: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Um jogador não pode se chamar Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Um nome precisa ter uma letra ou um dígito.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Byes não precisam ser adicionados",
    "admin.player.byes":
      "Um bye não é um dos jogadores do torneio. Um mata-mata oferece Bye sempre que seus jogadores são adicionados, quantas vezes o seu chaveamento precisar.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "Equipes",
    "admin.view.tests": "Testes",
    "admin.teams.add": "Adicionar equipe",
    "admin.teams.none": "Nenhuma equipe",
    "admin.teams.edit": "Editar",
    "admin.teams.view": "Ver",
    "admin.teams.archive": "Arquivar",
    "admin.teams.restore": "Restaurar",
    "admin.teams.up": "Subir",
    "admin.teams.down": "Descer",
    "admin.teams.archived": "Equipes arquivadas",
    "admin.teams.archivedSaid": "Arquivada",
    "admin.team.addTitle": "Adicionar equipe",
    "admin.team.editTitle": "Editar equipe",
    "admin.team.name": "Nome",
    "admin.team.shortName": "Nome curto",
    "admin.team.shortName.explanation":
      "Como os testes da equipe são chamados, por exemplo AUS x ENG.",
    "admin.team.flag": "Bandeira",
    "admin.team.add": "Adicionar",
    "admin.team.save": "Salvar",
    "admin.team.added": "{name} foi adicionada.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "Esta equipe não pode ser guardada como está.",
    "admin.teamView.otherwise": "Esta equipe não pode ser vista daqui.",
    "admin.teamView.players": "Jogadores",
    "TeamName.Missing": "Diga como a equipe se chama.",
    "TeamName.TooLong": "Esse nome é longo demais.",
    "admin.notes.add": "Adicionar nota",
    "admin.notes.none": "Nenhuma nota",
    "admin.notes.edit": "Editar",
    "admin.notes.delete": "Excluir",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Excluir nota",
    "admin.notes.deleteQuestion": "Excluir a nota “{title}”?",
    "admin.notes.delete.explanation":
      "Uma nota excluída some para sempre e não pode ser recuperada.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "Não foi possível fazer isso.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "Adicionar nota",
    "admin.note.editTitle": "Editar nota",
    "admin.note.title": "Título",
    "admin.note.description": "Descrição",
    "admin.note.write": "Escrever",
    "admin.note.preview": "Pré-visualizar",
    "admin.note.toolbar": "Formatação",
    "admin.note.tool.heading": "Título",
    "admin.note.tool.bold": "Negrito",
    "admin.note.tool.italic": "Itálico",
    "admin.note.tool.quote": "Citação",
    "admin.note.tool.code": "Código",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Lista numerada",
    "admin.note.tool.bulletedList": "Lista com marcadores",
    "admin.note.tool.taskList": "Lista de tarefas",
    "admin.note.add": "Adicionar",
    "admin.note.save": "Salvar",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "Esta nota não pode ser guardada como está.",
    "ManagerNoteTitle.Missing": "Dê um título à nota.",
    "ManagerNoteTitle.TooLong": "Esse título é longo demais.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Um título precisa ter uma letra ou um dígito.",
    "ManagerNoteDescription.TooLong": "Essa descrição é longa demais.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Essa nota não existe mais. Outro organizador pode tê-la excluído.",
    "EditManagerNote.NoSuchManagerNote":
      "Essa nota não existe mais. Outro organizador pode tê-la excluído.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Essa nota não existe mais. Outro organizador pode tê-la excluído.",
    "ManagerNote.Deleted":
      "Essa nota foi excluída. Outro organizador pode tê-la excluído.",
    "CommentaryTitle.Missing": "Dê um título ao comentário.",
    "CommentaryTitle.TooLong": "Esse título é longo demais.",
    "CommentaryTitle.NoLetterOrDigit":
      "Um título precisa ter uma letra ou um dígito.",
    "Commentary.TitleTaken": "Outro comentário já tem esse título.",
    "CommentText.Missing": "Escreva algo no comentário.",
    "CommentText.TooLong": "Esse comentário é longo demais.",
    "TeamShortName.Missing": "Dê um nome curto à equipe.",
    "TeamShortName.TooLong": "Um nome curto pode ter no máximo 10 caracteres.",
    "TeamShortName.NoLetterOrDigit":
      "Um nome curto precisa ter uma letra ou um dígito.",
    "Team.ShortNameLongerThanName":
      "Um nome curto não pode ser mais longo que o nome da equipe.",
    "Team.NoSuchFlag": "Escolha uma das bandeiras disponíveis.",
    "Team.Archived":
      "Essa equipe está arquivada e precisa ser restaurada antes.",
    "Team.InATest": "Essa equipe joga em um teste e não pode ser arquivada.",
    "Team.PlayerNameTaken": "Outro jogador desta equipe já tem esse nome.",
    "TeamPlayer.NamedBye": "Um jogador não pode se chamar Bye.",
    "TeamPlayer.Archived":
      "Esse jogador está arquivado e precisa ser restaurado antes.",
    "TeamPlayer.HasGames": "Esse jogador já jogou e não pode ser arquivado.",
    "Tournament.TeamNameTaken": "Outra equipe deste torneio já tem esse nome.",
    "Tournament.TeamShortNameTaken":
      "Outra equipe deste torneio já tem esse nome curto.",
    "Tournament.NoSuchTeam":
      "Este torneio não tem nenhuma equipe neste endereço.",
    "Tournament.TeamArchived":
      "Esta equipe está arquivada e só pode ser restaurada na aba Equipes.",
    "admin.tests.add": "Adicionar teste",
    "admin.tests.none": "Nenhum teste",
    "admin.tests.edit": "Editar",
    "admin.tests.view": "Ver",
    "admin.tests.archive": "Arquivar",
    "admin.tests.restore": "Restaurar",
    "admin.tests.up": "Subir",
    "admin.tests.down": "Descer",
    "admin.tests.archived": "Testes arquivados",
    "admin.tests.twoTeamsNeeded":
      "Um teste é entre duas equipes, então antes são necessárias duas equipes.",
    "admin.tests.toTeams": "Ir para Equipes",
    "admin.tests.matches.one": "{count} partida",
    "admin.tests.matches.other": "{count} partidas",
    "admin.tests.bestOf": "melhor de {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "Não foi possível fazer isso.",
    "admin.test.addTitle": "Adicionar teste",
    "admin.test.editTitle": "Editar teste",
    "admin.test.firstTeam": "Equipe A",
    "admin.test.secondTeam": "Equipe B",
    "admin.test.versus": "x",
    "admin.test.starts": "Início",
    "admin.test.finishes": "Término",
    "admin.test.expectedMatches": "Partidas previstas",
    "admin.test.bestOf": "Melhor de",
    "admin.test.group": "Grupo",
    "admin.test.add": "Adicionar",
    "admin.test.save": "Salvar",
    "admin.test.added": "{name} foi adicionado.",
    "admin.test.otherwise": "Este teste não pode ser guardado como está.",
    "admin.testView.otherwise": "Este teste não pode ser visto daqui.",
    "AddTest.FirstTeamMissing": "Escolha a primeira equipe.",
    "AddTest.SecondTeamMissing": "Escolha a segunda equipe.",
    "UpdateTest.FirstTeamMissing": "Escolha a primeira equipe.",
    "UpdateTest.SecondTeamMissing": "Escolha a segunda equipe.",
    "ExpectedMatches.NotWhole": "Digite um número inteiro de partidas.",
    "ExpectedMatches.TooSmall":
      "Um teste precisa ter pelo menos 1 partida prevista.",
    "TestGroup.TooLong": "Esse grupo é longo demais.",
    "Tournament.TestAgainstItself":
      "Uma equipe não joga um teste contra si mesma.",
    "Tournament.TestFinishesBeforeStarts":
      "Um teste não pode terminar antes de começar.",
    "Tournament.TestStartsBeforeTournament":
      "Um teste não pode começar antes do torneio.",
    "Tournament.TestFinishesAfterTournament":
      "Um teste não pode terminar depois do torneio.",
    "Tournament.TestHasGamesInUse":
      "Este teste tem jogos, então não pode ser arquivado até que eles sejam.",
    "Tournament.TestHasGames":
      "Este teste já tem jogos, então suas equipes não podem mais ser alteradas.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Mais partidas que isso já começaram.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dois jogadores já disputaram mais jogos que isso.",
    "Competition.ExpectedMatchesReached":
      "Este teste já começou tantas partidas quantas estão previstas.",
    "Competition.SameTeam":
      "Dois jogadores da mesma equipe não jogam entre si.",
    "AddManager.NoSuchAccount":
      "Esse endereço não tem nenhuma conta que possa virar organizador.",
    "admin.scorers.add": "Adicionar anotador",
    "admin.scorers.none": "Nenhum anotador",
    "admin.scorers.removeTitle": "Remover anotador",
    "admin.scorers.removeExplanation":
      "{name} não poderá mais lançar os resultados deste torneio.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "Esse endereço não pode virar anotador.",
    "AddScorer.NoSuchAccount":
      "Esse endereço não tem nenhuma conta que possa virar anotador.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Só um administrador pode fazer isso.",
    "AddRole.NoSuchAccount":
      "Esse endereço não tem nenhuma conta à qual o papel possa ser dado.",
    "AddRole.NoSuchRole": "Esse papel não existe.",
    "RemoveRole.NoSuchAccount": "Essa conta não existe.",
    "RemoveRole.NoSuchRole": "Esse papel não existe.",
    "RemoveRole.Yourself":
      "Você não pode tirar de si mesmo o papel de administrador.",
    "AccountsWithRole.NoSuchRole": "Esse papel não existe.",
    "Tournament.AlreadyAManager":
      "Essa conta já organiza o torneio e pode fazer tudo o que um anotador faz.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Diga como o torneio se chama.",
    "TournamentName.TooShort": "Esse nome é curto demais.",
    "TournamentName.TooLong": "Esse nome é longo demais.",
    "TournamentName.AllLowerCase": "Um nome não pode ser todo em minúsculas.",
    "TournamentName.AllCapitals": "Um nome não pode ser todo em maiúsculas.",
    "TournamentName.NoLetterOrDigit":
      "Um nome precisa ter uma letra ou um dígito.",
    "ReadOnlyDate.Unreadable": "Informe o dia.",
    "Tournament.FinishesBeforeStarts":
      "Um torneio não pode terminar antes de começar.",
    "Tournament.StartsAfterNextYear":
      "Um torneio não pode começar depois do ano que vem.",
    "Tournament.FinishesAfterNextYear":
      "Um torneio não pode terminar depois do ano que vem.",
    "CreateTournament.NoSuchCountry": "Escolha o país.",
    "TournamentSubtitle.TooLong":
      "Um subtítulo não pode ter mais de 2000 caracteres.",
    "Tournament.NotAManager": "Só um organizador deste torneio pode alterá-lo.",
    "Tournament.NotAManagerOrScorer":
      "Só um organizador ou anotador deste torneio pode vê-lo.",
    "Tournament.Archived":
      "Este torneio está arquivado e é restaurado antes de poder ser alterado.",
    "UpdateTournament.NoSuchTournament":
      "Não há nenhum torneio neste endereço.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form.
    "sport.ac": "Croquet de Associação",
    "sport.gc": "Croquet de Golfe",
    "sport.a6w": "Croquet Americano de 6 Arcos",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Padrão",
    "format.teams": "Equipes",
    "format.eire-cup": "Copa Eire",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Campeonato Mundial de Equipes de Croquet de Golfe",
    "country.ad": "Andorra",
    "country.ae": "Emirados Árabes Unidos",
    "country.af": "Afeganistão",
    "country.ag": "Antígua e Barbuda",
    "country.ai": "Anguila",
    "country.al": "Albânia",
    "country.am": "Armênia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Samoa Americana",
    "country.at": "Áustria",
    "country.au": "Austrália",
    "country.aw": "Aruba",
    "country.ax": "Ilhas Åland",
    "country.az": "Azerbaijão",
    "country.ba": "Bósnia e Herzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Bélgica",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgária",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermudas",
    "country.bn": "Brunei",
    "country.bo": "Bolívia",
    "country.br": "Brasil",
    "country.bs": "Bahamas",
    "country.bt": "Butão",
    "country.bv": "Ilha Bouvet",
    "country.bw": "Botsuana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Canadá",
    "country.catalonia": "Catalunha",
    "country.cc": "Ilhas Cocos (Keeling)",
    "country.cd": "República Democrática do Congo",
    "country.cf": "República Centro-Africana",
    "country.cg": "República do Congo",
    "country.ch": "Suíça",
    "country.ci": "Costa do Marfim",
    "country.ck": "Ilhas Cook",
    "country.cl": "Chile",
    "country.cm": "Camarões",
    "country.cn": "China",
    "country.co": "Colômbia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Cabo Verde",
    "country.cx": "Ilha Christmas",
    "country.cy": "Chipre",
    "country.cz": "Tchéquia",
    "country.de": "Alemanha",
    "country.dj": "Djibuti",
    "country.dk": "Dinamarca",
    "country.dm": "Dominica",
    "country.do": "República Dominicana",
    "country.dz": "Argélia",
    "country.ec": "Equador",
    "country.ee": "Estônia",
    "country.eg": "Egito",
    "country.eh": "Saara Ocidental",
    "country.england": "Inglaterra",
    "country.er": "Eritreia",
    "country.es": "Espanha",
    "country.et": "Etiópia",
    "country.fi": "Finlândia",
    "country.fj": "Fiji",
    "country.fk": "Ilhas Malvinas",
    "country.fm": "Micronésia",
    "country.fo": "Ilhas Faroé",
    "country.fr": "França",
    "country.ga": "Gabão",
    "country.gb": "Reino Unido",
    "country.gd": "Granada",
    "country.ge": "Geórgia",
    "country.gf": "Guiana Francesa",
    "country.gh": "Gana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenlândia",
    "country.gm": "Gâmbia",
    "country.gn": "Guiné",
    "country.gp": "Guadalupe",
    "country.gq": "Guiné Equatorial",
    "country.gr": "Grécia",
    "country.gs": "Geórgia do Sul e Ilhas Sandwich do Sul",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guiné-Bissau",
    "country.gy": "Guiana",
    "country.hk": "Hong Kong",
    "country.hm": "Ilhas Heard e McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croácia",
    "country.ht": "Haiti",
    "country.hu": "Hungria",
    "country.id": "Indonésia",
    "country.ie": "Irlanda",
    "country.il": "Israel",
    "country.im": "Ilha de Man",
    "country.in": "Índia",
    "country.io": "Território Britânico do Oceano Índico",
    "country.iq": "Iraque",
    "country.ir": "Irã",
    "country.is": "Islândia",
    "country.it": "Itália",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordânia",
    "country.jp": "Japão",
    "country.ke": "Quênia",
    "country.kg": "Quirguistão",
    "country.kh": "Camboja",
    "country.ki": "Kiribati",
    "country.km": "Comores",
    "country.kn": "São Cristóvão e Névis",
    "country.kp": "Coreia do Norte",
    "country.kr": "Coreia do Sul",
    "country.kw": "Kuwait",
    "country.ky": "Ilhas Cayman",
    "country.kz": "Cazaquistão",
    "country.la": "Laos",
    "country.lb": "Líbano",
    "country.lc": "Santa Lúcia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Libéria",
    "country.ls": "Lesoto",
    "country.lt": "Lituânia",
    "country.lu": "Luxemburgo",
    "country.lv": "Letônia",
    "country.ly": "Líbia",
    "country.ma": "Marrocos",
    "country.mc": "Mônaco",
    "country.md": "Moldávia",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Ilhas Marshall",
    "country.mk": "Macedônia do Norte",
    "country.ml": "Mali",
    "country.mm": "Mianmar",
    "country.mn": "Mongólia",
    "country.mo": "Macau",
    "country.mp": "Ilhas Marianas do Norte",
    "country.mq": "Martinica",
    "country.mr": "Mauritânia",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Maurício",
    "country.mv": "Maldivas",
    "country.mw": "Malawi",
    "country.mx": "México",
    "country.my": "Malásia",
    "country.mz": "Moçambique",
    "country.na": "Namíbia",
    "country.nc": "Nova Caledônia",
    "country.ne": "Níger",
    "country.nf": "Ilha Norfolk",
    "country.ng": "Nigéria",
    "country.ni": "Nicarágua",
    "country.nl": "Países Baixos",
    "country.no": "Noruega",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nova Zelândia",
    "country.om": "Omã",
    "country.pa": "Panamá",
    "country.pe": "Peru",
    "country.pf": "Polinésia Francesa",
    "country.pg": "Papua-Nova Guiné",
    "country.ph": "Filipinas",
    "country.pk": "Paquistão",
    "country.pl": "Polônia",
    "country.pm": "São Pedro e Miquelon",
    "country.pn": "Ilhas Pitcairn",
    "country.pr": "Porto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguai",
    "country.qa": "Catar",
    "country.re": "Reunião",
    "country.ro": "Romênia",
    "country.rs": "Sérvia",
    "country.ru": "Rússia",
    "country.rw": "Ruanda",
    "country.sa": "Arábia Saudita",
    "country.sb": "Ilhas Salomão",
    "country.sc": "Seicheles",
    "country.scotland": "Escócia",
    "country.sd": "Sudão",
    "country.se": "Suécia",
    "country.sg": "Singapura",
    "country.sh": "Santa Helena",
    "country.si": "Eslovênia",
    "country.sj": "Svalbard e Jan Mayen",
    "country.sk": "Eslováquia",
    "country.sl": "Serra Leoa",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somália",
    "country.sr": "Suriname",
    "country.st": "São Tomé e Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Síria",
    "country.sz": "Essuatíni",
    "country.tc": "Ilhas Turcas e Caicos",
    "country.td": "Chade",
    "country.tf": "Terras Austrais e Antárticas Francesas",
    "country.tg": "Togo",
    "country.th": "Tailândia",
    "country.tj": "Tadjiquistão",
    "country.tk": "Tokelau",
    "country.tl": "Timor-Leste",
    "country.tm": "Turcomenistão",
    "country.tn": "Tunísia",
    "country.to": "Tonga",
    "country.tr": "Turquia",
    "country.tt": "Trinidad e Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzânia",
    "country.ua": "Ucrânia",
    "country.ug": "Uganda",
    "country.um": "Ilhas Menores Distantes dos Estados Unidos",
    "country.us": "Estados Unidos",
    "country.uy": "Uruguai",
    "country.uz": "Uzbequistão",
    "country.va": "Cidade do Vaticano",
    "country.vc": "São Vicente e Granadinas",
    "country.ve": "Venezuela",
    "country.vg": "Ilhas Virgens Britânicas",
    "country.vi": "Ilhas Virgens Americanas",
    "country.vn": "Vietnã",
    "country.vu": "Vanuatu",
    "country.wales": "País de Gales",
    "country.wf": "Wallis e Futuna",
    "country.ws": "Samoa",
    "country.ye": "Iêmen",
    "country.yt": "Mayotte",
    "country.za": "África do Sul",
    "country.zm": "Zâmbia",
    "country.zw": "Zimbábue",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. This is the one place a catalogue holds
    // markup, and it holds it because an email is written and translated as a
    // piece of writing rather than as a list of phrases somewhere else puts in
    // order. Only what fills an email in is escaped, so nothing given to one
    // can become markup; the markup here is the site's own. `{link}` is the
    // link the email carries, `{site}` the site's address, `{buttonBackgroundColour}`
    // and `{buttonTextColour}` what a button is painted with, `{emailFromName}`
    // the name each email is signed off with, and `{siteName}` what the site is
    // called. None greets its reader by name.

    "Email.ConfirmAddress.subject":
      "Confirme o seu endereço de e-mail no {siteName}",
    "Email.ConfirmAddress.body": `
<p>Olá,</p>

<p>
    Obrigado por criar uma conta no <strong>{siteName}</strong>.<br />
    Antes de começar a usar a sua conta, confirme o seu endereço de e-mail
    clicando no botão abaixo:
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
        Confirmar o meu endereço de e-mail
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode confirmar o seu endereço de e-mail abrindo este link no navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se você não criou esta conta, pode ignorar este e-mail com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Um novo link para confirmar o seu endereço de e-mail no {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Olá,</p>

<p>
    Você pediu há pouco um novo e-mail para confirmar o seu endereço de e-mail no <strong>{siteName}</strong>.<br />
    Confirme o seu endereço de e-mail clicando no botão abaixo:
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
        Confirmar o meu endereço de e-mail
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode confirmar o seu endereço de e-mail abrindo este link no navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Depois de confirmado, você poderá continuar usando a sua conta sem interrupções.
</p>

<p>
    Se você não pediu este e-mail, pode ignorá-lo com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Alguém tentou se cadastrar com o seu endereço de e-mail",
    "Email.AlreadyRegistered.body": `
<p>Olá,</p>

<p>
    Alguém tentou se cadastrar no <strong>{siteName}</strong> usando este
    endereço de e-mail, que já tem uma conta. Nada na sua conta foi
    alterado.<br />
    Se foi você, você já tem uma conta e pode entrar nela:
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
        Entrar
    </a>
</p>

<p>
    Se você esqueceu a senha, pode redefini-la aqui:
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
        Esqueci a senha
    </a>
</p>

<p>
    Se não foi você, não precisa fazer nada. Ninguém recebeu um meio de entrar
    na sua conta.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirme a mudança da sua conta do {siteName} para este endereço",
    "Email.ConfirmNewEmailAddress.body": `
<p>Olá,</p>

<p>
    Alguém conectado a uma conta do <strong>{siteName}</strong> pediu para
    movê-la para este endereço de e-mail. Se foi você, confirme aqui, estando
    conectado a essa conta. O link vale por 24 horas.
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
        Mover a minha conta
    </a>
</p>

<p>
    Ou copie este endereço para o seu navegador:<br />
    {link}
</p>

<p>
    Se não foi você, não precisa fazer nada. Nenhuma conta será movida para cá.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Alguém pediu para mover uma conta para o seu endereço de e-mail",
    "Email.AlreadyHasAnAccount.body": `
<p>Olá,</p>

<p>
    Alguém conectado a uma conta do <strong>{siteName}</strong> pediu para
    movê-la para este endereço de e-mail, que já tem uma conta própria. Nada
    foi movido, e nada na sua conta foi alterado.
</p>

<p>
    Se foi você, você já tem uma conta neste endereço e pode entrar nela.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "A sua conta do {siteName} foi movida",
    "Email.EmailAddressChanged.body": `
<p>Olá,</p>

<p>
    A sua conta do <strong>{siteName}</strong> acabou de ser movida para outro
    endereço de e-mail, {emailAddress}, e a partir de agora o acesso é com esse
    endereço.
</p>

<p>
    Se não foi você, outra pessoa está com a sua conta. Responda a este e-mail
    e nos avise.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "A sua senha do {siteName} foi alterada",
    "Email.PasswordChanged.body": `
<p>Olá,</p>

<p>
    A senha da sua conta do <strong>{siteName}</strong> acabou de ser
    alterada, e todos os outros navegadores conectados a ela foram
    desconectados.<br />
    Se foi você, não precisa fazer nada.
</p>

<p>
    Se não foi você, outra pessoa está com a sua senha. Defina uma nova aqui, e
    essa pessoa será desconectada:
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
        Esqueci a senha
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Defina uma nova senha no {siteName}",
    "Email.SetNewPassword.body": `
<p>Olá,</p>

<p>
    Você pediu há pouco para redefinir a sua senha no <strong>{siteName}</strong>.<br />
    Você pode redefinir a senha clicando no botão abaixo:
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
        Redefinir senha
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode redefinir a senha abrindo este link no navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se você não pediu a redefinição da senha, pode ignorar este e-mail com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Defina uma senha no {siteName}",
    "Email.SetPassword.body": `
<p>Olá,</p>

<p>
    A sua conta do <strong>{siteName}</strong> não tem senha: você entra com o Google.<br />
    Você pediu para definir uma, para também poder entrar com o seu endereço de e-mail e uma senha.
    Você pode defini-la clicando no botão abaixo:
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
        Definir senha
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode definir a senha abrindo este link no navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    O link vale por uma hora. Se você não pediu para definir uma senha, pode ignorar este e-mail com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Não há conta no {siteName} para este endereço de e-mail",
    "Email.RegisterInstead.body": `
<p>Olá,</p>

<p>
    Foi feito um pedido de redefinição de senha para um endereço de e-mail que
    não está associado a nenhuma conta no <strong>{siteName}</strong>.
</p>

<p>
    Se quiser usar o nosso serviço, você pode criar uma nova conta em:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Se você não fez este pedido, pode ignorar este e-mail com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirme que a sua conta do {siteName} deve ser esquecida",
    "Email.ConfirmForgetting.body": `
<p>Olá,</p>

<p>
    Você pediu para que a sua conta do <strong>{siteName}</strong> seja
    esquecida.<br />
    Use o botão abaixo para ver o que isso significa e para dizer com certeza
    que é isso que você quer:
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
        Esquecer a minha conta
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode abrir este link no navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Depois de esquecidos, o seu nome e endereço de e-mail nunca mais poderão
    ser lidos, por ninguém, e não será possível entrar na sua conta. Isso não
    pode ser desfeito.
</p>

<p>
    O link funciona uma única vez, até 15 minutos depois do pedido, e só
    enquanto você estiver conectado a esta conta. Depois disso, peça de novo
    a partir da sua conta.
</p>

<p>
    Se você não pediu, nada acontecerá a menos que o link seja seguido. Mas
    alguém conectado à sua conta fez o pedido, então defina uma nova senha na
    página de senha esquecida para ter certeza de que essa pessoa não poderá
    entrar de novo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Os cadastros estão suspensos: não foi possível acessar {service}",
    "Email.RegistrationsSuspended.body": `
<p>Olá,</p>

<p>
    O {siteName} não conseguiu acessar {service} em {when}. Até que responda,
    os leitores que precisam dele, para se cadastrar ou definir uma nova
    senha, são orientados a tentar de novo mais tarde.
</p>

<p>
    Não é preciso liberar nada. Cada tentativa consulta {service} de novo, e
    as páginas voltam a funcionar assim que ele responder.
</p>

<p>
    Enquanto {service} continuar fora do ar, você receberá um e-mail sobre isso
    no máximo uma vez por hora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "O {siteName} não consegue acessar o banco de dados",
    "Email.DatabaseUnreachable.body": `
<p>Olá,</p>

<p>
    O {siteName} não conseguiu acessar o banco de dados em {when}. Até que ele responda, toda página que precisa dele informa aos leitores que o site está indisponível e que devem tentar de novo mais tarde.
</p>

<p>
    Não é preciso liberar nada. Cada requisição pede uma conexão de novo, e o site volta a funcionar assim que o banco de dados responder.
</p>

<p>
    Enquanto o banco de dados continuar fora do ar, você receberá um e-mail sobre isso no máximo uma vez a cada {minutes} minutos.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "O {siteName} falhou em uma requisição",
    "Email.UnhandledError.body": `
<p>Olá,</p>

<p>
    O {siteName} falhou em {when} em uma requisição de {asked}. Ao leitor foi mostrada a referência {reference}, e o registro tem a causa sob ela.
</p>

<p>
    Um site com defeito costuma falhar em todas as requisições, então você receberá e-mails sobre falhas no máximo 4 vezes por hora. As seguintes ficam no registro do mesmo modo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
