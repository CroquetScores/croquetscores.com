// The site's words in Portuguese. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as você rather than tu: it is how a site speaks to a
// stranger across most of the Portuguese-speaking world, and it keeps the
// English it is written from, which is plain and direct rather than formal.
// Where Brazilian and European Portuguese differ and one word cannot serve
// both (senha for a password, arquivar for archive), the Brazilian word is
// used, because most of the site's Portuguese readers are in Brazil; the verbs
// are the ones both spell alike (insira, not digite or introduza). Items in
// menus and on buttons are written in sentence case, as Portuguese writes
// them, where the English capitalises each word.
import type { Language } from "../common/language.js";

export const portuguese: Language = {
  tag: "pt",
  name: "Português",
  words: {
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
      "Está gostando do {siteName}? Faça uma doação para ajudar a continuar o desenvolvimento.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacidade",
    "beta.banner":
      "Este é um site beta. Os dados podem ser redefinidos a qualquer momento.",
    "privacy.contact":
      "Dúvidas sobre esta página, ou sobre o que é guardado sobre você: {emailAddress}",
    "tryWebsite.banner":
      "Este é um lugar seguro para aprender a usar o {siteName}. Tudo o que for inserido aqui pode ser removido a qualquer momento.",

    "language.label": "Idioma",
    "language.choose": "Alterar",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Há novidades para ler.",
    "whatsNew.admin.message": "Há novidades para quem organiza torneios.",
    "whatsNew.view": "Ver as novidades",
    "whatsNew.later": "Lembrar-me da próxima vez",
    "whatsNew.never": "Nunca mais mostrar este aviso",

    "form.otherwise":
      "Algo aqui não está certo. Confira o que foi inserido e tente novamente.",

    "account.menu": "Conta",
    "account.register": "Registrar-se",
    "account.signIn": "Entrar",
    "account.forgotPassword": "Esqueci minha senha",
    "account.signOut": "Sair",
    "account.profile": "Perfil",
    "account.changePassword": "Alterar senha",
    "account.changeEmailAddress": "Alterar endereço de email",
    "account.changeName": "Alterar nome",
    "account.setPassword": "Definir senha",
    "account.forgetAccount": "Esquecer conta",

    "register.title": "Registrar-se",
    "register.emailAddress": "Endereço de email",
    "register.submit": "Registrar-se",
    "register.withGoogle": "Registrar-se com o Google",
    "register.or": "ou",
    "SignInWithGoogle.EmailAddressNotVerified":
      "O Google não confirmou que esse endereço de email é seu, então ele não pode ser usado aqui com o Google. Use o seu endereço de email abaixo.",
    "SignInWithGoogle.LinkedToAnother":
      "Esse endereço de email já tem uma conta, vinculada a outra conta do Google. Entre com essa conta do Google, ou com o seu endereço de email e a sua senha.",
    "SignInWithGoogle.NameMissing":
      "O Google não nos informou o seu nome, e uma conta precisa de um. Use o seu endereço de email abaixo.",
    "Google.Unreachable":
      "Não foi possível acessar o Google agora. Tente novamente em alguns minutos, ou use o seu endereço de email abaixo.",
    "Registration.NotAPerson":
      "Isto não parece ter vindo de uma pessoa. Tente novamente e, se continuar acontecendo, espere alguns minutos e volte.",

    "EmailAddress.Missing": "Insira um endereço de email.",
    "EmailAddress.NoAt": "Um endereço de email tem um @.",
    "EmailAddress.MoreThanOneAt": "Um endereço de email tem apenas um @.",
    "EmailAddress.NoDomain":
      "Um endereço de email tem um domínio depois do @, como exemplo.com.",

    "welcome.title": "Verifique seu email",
    "welcome.checkEmail":
      "Um email está a caminho do endereço que você informou. Siga o link que ele traz para continuar.",
    "welcome.nothingArrived":
      "Se nada chegar em alguns minutos, olhe na sua pasta de lixo eletrônico ou de spam.",
    "welcome.home": "Voltar para {siteName}",
    "newConfirmationLink.title": "Receba um novo link",
    "newConfirmationLink.explanation":
      "O link para confirmar o seu endereço de email expirou. Peça um novo e ele será enviado ao endereço com o qual você se registrou.",
    "newConfirmationLink.send": "Enviar um novo link",
    "newConfirmationLink.home": "Voltar para {siteName}",
    "newConfirmationLink.signIn": "Entrar",
    "newConfirmationLink.sent.title": "Verifique seu email",
    "newConfirmationLink.sent.explanation":
      "Um novo link está a caminho. Siga-o para confirmar o seu endereço de email. Se nada chegar em alguns minutos, olhe na sua pasta de lixo eletrônico ou de spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Esse endereço de email já está confirmado",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Não há mais nada a confirmar. Entre com a senha que você definiu ao confirmá-lo.",
    "newConfirmationLink.noLongerWorks.title": "Esse link não funciona mais",
    "newConfirmationLink.noLongerWorks.explanation":
      "Confira se você seguiu o link inteiro do email, sem faltar nada no final dele. Se ainda assim não funcionar, registre-se novamente e um novo link será enviado.",
    "newConfirmationLink.tooMany.title": "Tente novamente mais tarde",
    "newConfirmationLink.tooMany.explanation":
      "Vários links foram enviados a este endereço recentemente. Espere uma hora e peça novamente, e olhe na sua pasta de lixo eletrônico ou de spam enquanto isso.",

    "forgotPassword.title": "Esqueceu a sua senha?",
    "forgotPassword.emailAddress": "Endereço de email",
    "forgotPassword.submit": "Enviar uma forma de voltar a entrar",
    "forgotPassword.home": "Voltar para {siteName}",
    "forgotPassword.sent.title": "Verifique seu email",
    "forgotPassword.sent.explanation":
      "Se esse endereço tiver uma conta, um link para definir uma nova senha está a caminho. Siga-o dentro de uma hora. Se nada chegar em alguns minutos, olhe na sua pasta de lixo eletrônico ou de spam.",
    "forgotPassword.tryAgainLater":
      "Foram pedidas formas demais de voltar a entrar a partir daqui recentemente. Espere uma hora e tente novamente.",

    "setNewPassword.title": "Defina uma nova senha",
    "setNewPassword.password": "Senha",
    "setNewPassword.confirmPassword": "Confirme a senha",
    "setNewPassword.submit": "Definir minha nova senha",
    "setNewPassword.home": "Voltar para {siteName}",
    "setNewPassword.signIn": "Entrar",
    "setNewPassword.askAgain": "Pedir um novo link",
    "setNewPassword.changed.title": "Sua senha foi alterada",
    "setNewPassword.changed.explanation":
      "Você saiu de todos os lugares em que estava conectado. Entre com a sua nova senha.",
    "setNewPassword.expired.title": "Esse link expirou",
    "setNewPassword.expired.explanation":
      "Um link para definir uma nova senha funciona por uma hora. Peça outro e ele será enviado ao mesmo endereço.",
    "setNewPassword.noLongerWorks.title": "Esse link não funciona mais",
    "setNewPassword.noLongerWorks.explanation":
      "Ele pode já ter sido usado, ou pode faltar algo no final dele. Peça outro se ainda precisar de um.",

    "BreachedPasswords.Unreachable":
      "Não foi possível verificar a sua senha agora, então ela não foi alterada. Tente novamente em alguns minutos; o seu link continua funcionando até expirar.",

    "forgetAccount.title": "Esquecer a sua conta",
    "forgetAccount.explanation":
      "O seu nome e o seu endereço de email podem ser tornados ilegíveis para sempre, e a sua conta encerrada. Para termos certeza de que é você, enviaremos primeiro um link por email para o endereço da sua conta, e nada será esquecido até que você o siga.",
    "forgetAccount.submit": "Enviar o link por email",
    "forgetAccount.sent.title": "Verifique seu email",
    "forgetAccount.sent.explanation":
      "Enviamos um link por email para o endereço da sua conta. Ele funciona por 15 minutos, e somente enquanto você estiver conectado a esta conta.",
    "forgetAccount.confirm.title": "Esquecer a sua conta para sempre?",
    "forgetAccount.confirm.explanation":
      "Depois de esquecidos, o seu nome e o seu endereço de email nunca mais poderão ser lidos, por ninguém, e não será possível entrar na sua conta. Isto não pode ser desfeito.",
    "forgetAccount.confirm.submit": "Esquecer minha conta",
    "forgetAccount.forgotten.title": "Sua conta foi esquecida",
    "forgetAccount.forgotten.explanation":
      "O seu nome e o seu endereço de email não podem mais ser lidos, e você saiu de todos os lugares em que estava conectado.",
    "forgetAccount.noLongerWorks.title": "Esse link não funciona mais",
    "forgetAccount.noLongerWorks.explanation":
      "Ele pode ter expirado, já ter sido usado, ou ser de uma conta à qual você não está conectado. Peça novamente a partir da sua conta se ainda quiser que ela seja esquecida.",
    "forgetAccount.lastAdministrator.title": "Sua conta não pode ser esquecida",
    "forgetAccount.lastAdministrator.explanation":
      "Você é o único administrador deste site. Dê o papel de Administrador a outra pessoa, e então a sua conta poderá ser esquecida.",
    "forgetAccount.askAgain": "Pedir novamente",
    "forgetAccount.home": "Voltar para {siteName}",

    "registrationsSuspended.title": "Os registros estão suspensos por ora",
    "registrationsSuspended.explanation":
      "Um serviço de que o registro precisa não pode ser acessado agora, então ninguém pode se registrar até que ele volte a responder. Nada do que você digitou foi salvo.",
    "registrationsSuspended.tryAgainLater":
      "Tente novamente daqui a pouco. O administrador do site foi avisado.",
    "registrationsSuspended.home": "Voltar para {siteName}",

    "signIn.title": "Entrar",
    "signIn.emailAddress": "Endereço de email",
    "signIn.password": "Senha",
    "signIn.submit": "Entrar",
    "signIn.forgotPassword": "Esqueceu a senha?",
    "signIn.register": "Registrar-se",
    "signIn.withGoogle": "Entrar com o Google",
    "signIn.or": "ou",
    "signIn.tryAgainLater":
      "Foram feitas tentativas demais recentemente. Espere uma hora e tente novamente.",

    "SignIn.Failed":
      "O endereço de email ou a senha estão incorretos. Tente novamente.",

    "profile.title": "Perfil",
    "profile.name": "Nome:",
    "profile.emailAddress": "Endereço de email:",

    "changeName.title": "Alterar nome",
    "changeName.name": "Nome",
    "changeName.submit": "Alterar nome",

    "setPassword.title": "Defina uma senha",
    "setPassword.explanation":
      "Sua conta não tem senha: você entra com o Google. Para entrar também com uma senha, enviaremos por email um link para defini-la para {emailAddress}.",
    "setPassword.submit": "Enviar um link por email",
    "setPassword.sent.title": "Verifique seu email",
    "setPassword.sent.explanation":
      "Enviamos a você por email um link para definir uma senha. Ele funciona por uma hora.",
    "setPassword.profile": "Voltar ao seu perfil",

    "changePassword.title": "Alterar senha",
    "changePassword.currentPassword": "Senha atual",
    "changePassword.password": "Nova senha",
    "changePassword.passwordConfirmation": "Confirme a senha",
    "changePassword.forgotPassword": "Esqueceu a senha?",
    "changePassword.submit": "Alterar senha",
    "ChangePassword.WrongPassword": "Essa não é a sua senha.",

    "changeEmailAddress.title": "Alterar endereço de email",
    "changeEmailAddress.emailAddress": "Novo endereço de email",
    "changeEmailAddress.currentPassword": "Senha atual",
    "changeEmailAddress.submit": "Enviar um link de confirmação",
    "changeEmailAddress.sent.title": "Verifique seu email",
    "changeEmailAddress.sent.explanation":
      "Um link para confirmar a mudança foi enviado ao novo endereço de email. Siga-o, conectado, para mover a sua conta para lá.",
    "changeEmailAddress.confirm.title": "Mover a sua conta",
    "changeEmailAddress.confirm.explanation":
      "Sua conta será movida para {emailAddress}. Daqui em diante você entrará com esse endereço.",
    "changeEmailAddress.confirm.submit": "Mover minha conta",
    "changeEmailAddress.noLongerWorks.title": "Este link não funciona mais",
    "changeEmailAddress.noLongerWorks.explanation":
      "Ele expirou, já foi usado, ou não foi enviado para a conta à qual você está conectado. Peça novamente a partir do seu perfil.",
    "changeEmailAddress.taken.title": "Sua conta não foi movida",
    "changeEmailAddress.profile": "Voltar ao seu perfil",
    "ChangeEmailAddress.WrongPassword": "Essa não é a sua senha.",
    "ChangeEmailAddress.Unchanged": "Sua conta já está neste endereço.",
    "ChangeEmailAddress.Taken":
      "Esse endereço de email agora tem uma conta própria, então a sua não pode ser movida para lá.",

    "confirmEmailAddress.title": "Confirme o seu endereço de email",
    "confirmEmailAddress.name": "Nome",
    "confirmEmailAddress.password": "Senha",
    "confirmEmailAddress.confirmPassword": "Confirme a senha",
    "confirmEmailAddress.submit": "Confirmar meu endereço de email",
    "confirmEmailAddress.signIn": "Entrar",
    "confirmEmailAddress.home": "Voltar para {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Seu endereço de email está confirmado",
    "confirmEmailAddress.confirmed.explanation":
      "Sua conta está pronta. Entre com o endereço de email e a senha que você acabou de informar.",
    "confirmEmailAddress.expired.title": "Esse link expirou",
    "confirmEmailAddress.expired.explanation":
      "Um link para confirmar um endereço de email funciona por 24 horas. Peça um novo e ele será enviado ao mesmo endereço.",
    "confirmEmailAddress.expired.newLink": "Enviar um novo link",
    "confirmEmailAddress.noLongerWorks.title": "Esse link não funciona mais",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Confira se você seguiu o link inteiro do email, sem faltar nada no final dele. Se ainda assim não funcionar, registre-se novamente e um novo link será enviado.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Esse endereço de email já está confirmado",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Não há mais nada a fazer. Entre com a senha que você definiu ao confirmá-lo.",

    "PersonName.Missing": "Insira um nome.",
    "PersonName.TooShort": "Um nome precisa ter pelo menos 3 caracteres.",
    "PersonName.TooLong": "Um nome pode ter no máximo 254 caracteres.",
    "WorldRankingName.TooShort":
      "Um nome do ranking mundial precisa ter pelo menos 3 caracteres.",
    "WorldRankingName.TooLong":
      "Um nome do ranking mundial pode ter no máximo 254 caracteres.",
    "Password.Missing": "Insira uma senha.",
    "Password.TooShort": "Uma senha precisa ter pelo menos 12 caracteres.",
    "Password.ConfirmationDiffers":
      "Isto não é igual à senha acima. Digite-a novamente.",
    "Password.Breached":
      "Esta senha já apareceu em um vazamento de dados em outro lugar, então não é segura para usar aqui. Escolha outra.",

    "javaScriptRequired.title": "É preciso ativar scripts",
    "javaScriptRequired.explanation":
      "Para se registrar, é preciso que os scripts estejam ativados neste site, para que ele possa verificar se quem está se registrando é uma pessoa. Ative-os e registre-se novamente.",
    "javaScriptRequired.register": "Voltar ao registro",
    "javaScriptRequired.home": "Voltar para {siteName}",

    "errors.backHome": "Voltar para {siteName}",
    "errors.notFound": "Não encontrado",
    "errors.refused": "Não foi possível fazer isso",
    "errors.refusedDetail": "Algo do que foi enviado não estava certo.",
    "errors.sorry": "Desculpe",
    "errors.sorryDetail": "Não foi possível atender a esse pedido.",
    "errors.failed": "Algo deu errado",
    "errors.reference": "Referência {reference}.",
    "errors.unavailable": "O site está indisponível",
    "errors.unavailableDetail":
      "O site não consegue acessar o que precisa neste momento. Tente novamente mais tarde.",
    "errors.maintenance": "O site está em manutenção.",
    "errors.maintenanceMinutes": "Deverá voltar em {minutes} minutos.",
    "errors.maintenanceMinute": "Deverá voltar em 1 minuto.",
    "errors.maintenanceLonger":
      "Está a demorar mais do que o esperado e voltará em breve.",

    "home.recentResults": "Resultados recentes",
    "home.recentResults.none":
      "Nenhum jogo foi adicionado nos últimos sete dias.",
    "home.upcomingTournaments": "Próximos torneios",
    "home.upcomingTournaments.none":
      "Nenhum torneio começa nos próximos sessenta dias.",
    "home.allTournaments": "Todos os torneios de {year}",
    "year.heading": "Torneios de {year}",
    "year.none": "Nenhum torneio começa em {year}.",
    "yearSport.heading": "Torneios de {sport} de {year}",
    "yearSport.none": "Nenhum torneio de {sport} começa em {year}.",
    "tournament.recent": "Recentes",
    "tournament.summary": "Resumo",
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
    "search.label": "Pesquisar",
    "search.tournaments": "Torneios",
    "search.competitions": "Competições",
    "search.nothingFound": "Nada foi encontrado.",
    "players.search.label": "Pesquisar jogadores",
    "players.search.prompt": "Digite o nome de um jogador para o encontrar.",
    "players.search.none": "Nenhum jogador foi encontrado.",
    "search.more":
      "Só são mostrados os primeiros {count}. Acrescente mais do nome para restringir a pesquisa.",
    "websitePlayer.tournament": "Torneio",
    "tournament.test": "{first} x {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Comentários",
    "tournament.beat": "venceu",
    "tournament.drewWith": "empatou com",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 hora",
    "tournament.ago.hours": "{count} horas",
    "tournament.none": "Nenhum jogo foi disputado ainda.",
    "players.none": "Nenhum jogador foi adicionado ainda.",
    "commentaries.by": "por",
    "commentaries.start": "Iniciar novo comentário",
    "commentaries.disclaimer.heading": "Aviso legal",
    "commentaries.disclaimer":
      "As opiniões expressas nestes comentários são as dos seus autores e não refletem necessariamente as de Tim Murphy ou do {site}.",
    "commentaries.guidelines.heading": "Diretrizes",
    "commentaries.guidelines.responsible":
      "Você é responsável pelo seu comentário.",
    "commentaries.guidelines.purpose":
      'O recurso de comentários serve para transmitir o que está acontecendo no torneio. Não foi pensado como um espaço de "rede social" para transmitir votos de boa sorte e coisas do tipo.',
    "commentaries.guidelines.hatred":
      "Não publique material que possa incitar violência ou ódio. Não toleraremos comentários que humilhem outras pessoas por raça, religião, etnia, gênero, idade, deficiência mental ou física, ou orientação sexual.",
    "commentaries.guidelines.abuse":
      "Ofensas gratuitas não serão toleradas. A regra geral aqui é que os comentários devem jogar a bola, não o jogador, isto é, não atacar alguém pessoalmente, mas tratar do assunto em questão.",
    "commentaries.guidelines.unlawful":
      "Comentários juridicamente questionáveis, como possíveis violações de direitos autorais ou material potencialmente difamatório, serão removidos.",
    "commentaries.guidelines.shouting":
      "Não xingue nem escreva tudo em maiúsculas nos comentários.",
    "commentaries.guidelines.selling":
      "Não use a seção de comentários para fins comerciais ou spam. Comentários que anunciem, promovam ou solicitem quaisquer bens ou serviços serão removidos.",
    "commentaries.guidelines.links":
      "Limite o uso de links nos comentários. Comentários com links para material inadequado serão removidos.",
    "commentaries.guidelines.impersonating":
      "Não se passe por outras pessoas na seção de comentários, nem publique dados pessoais – números de telefone, endereços postais ou de email – que possam colocar alguém em perigo sem querer.",
    "commentaries.reporting.heading": "Denunciar um comentário",
    "commentaries.reporting.before":
      "Denuncie os comentários que não cumpram estas diretrizes para",
    "commentaries.reporting.after":
      ". Cite o endereço da página e o comentário questionável. Por exemplo:",
    "commentaries.reporting.exampleComment":
      '"um comentário que deveria ser removido"',
    "commentaries.reporting.exampleReason":
      "Este comentário deveria ser removido porque...",
    "commentaries.reporting.reviewed":
      "Denunciar um problema não significa remoção automática, mas todas as denúncias serão analisadas.",
    "commentaries.reporting.reserved":
      "O {site} se reserva o direito de remover comentários.",
    "commentaries.reporting.subject": "Denúncia de comentário no {site}",
    "commentaries.reporting.body":
      "Cite o endereço da página, o comentário questionável e por que ele deveria ser removido.",
    "startCommentary.title": "Iniciar novo comentário",
    "startCommentary.titleField": "Título",
    "startCommentary.submit": "Iniciar comentário",
    "marks.new": "novo",
    "notes.none": "Os organizadores ainda não escreveram nenhuma nota.",
    "note.edited": "editada",
    "commentary.none": "Nenhum comentário foi escrito ainda.",
    "commentary.edited": "editado",
    "commentary.edit": "Editar",
    "commentary.delete": "Excluir",
    "commentary.comment": "Comentário",
    "commentary.add": "Adicionar comentário",
    "commentary.notSent":
      "O comentário não pôde ser enviado. Carregue a página novamente para ver se ele foi salvo.",
    "changeCommentaryTitle.title": "Alterar título",
    "changeCommentaryTitle.submit": "Salvar",
    "editComment.title": "Editar comentário",
    "editComment.save": "Salvar",
    "deleteComment.title": "Excluir comentário",
    "deleteComment.question":
      "Excluir este comentário? Isto não pode ser desfeito.",
    "deleteComment.confirm": "Excluir comentário",
    "deleteComment.keep": "Mantê-lo",
    "player.games": "Jogos",
    "player.competitions": "Competições",
    "player.beat": "venceu",
    "player.lostTo": "perdeu para",
    "player.drewWith": "empatou com",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Nenhum jogo foi disputado ainda.",
    "player.noCompetitions": "Ainda não está inscrito em nenhuma competição.",
    "block.wins": "Vitórias",
    "block.matches": "Partidas",
    "block.netGames": "Saldo de jogos",
    "block.games": "Jogos",
    "block.netHoops": "Saldo de arcos",
    "block.won": "ganho",
    "block.lost": "perdido",
    "block.drawn": "empatado",
    "block.withdrawn": "desistiu",
    "block.gameWithdrawn": "desistência",
    "block.losses": "Derrotas",
    "competition.views": "Visões",
    "competition.view.grid": "Grade",
    "competition.view.summary": "Resumo",
    "competition.view.orderOfPlay": "Ordem de jogo",
    "blockSummary.ranking":
      "Classificados pela proporção de partidas ganhas e, depois, pelo saldo de arcos. O regulamento de um torneio pode classificar os seus jogadores de outra forma.",
    "orderOfPlay.none": "Nenhum jogo foi disputado ainda.",
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinais",
    "knockout.round.quarters": "Quartas de final",
    "knockout.round.number": "Rodada {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Jogos",
    "swiss.wins": "Vitórias",
    "swiss.winShare": "% de vitórias",
    "swiss.results": "Resultados",
    "knockout.onward": "Rodadas seguintes",
    "knockout.back": "Rodadas anteriores",
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nome",
    "tournamentList.onlyIn": "Somente torneios em {country}",
    "tournamentList.filter.country": "País",
    "tournamentList.filter.anyCountry": "Qualquer país",
    "tournamentList.filter.region": "Região",
    "tournamentList.filter.anyRegion": "Qualquer região",
    "tournamentList.filter.sport": "Modalidade",
    "tournamentList.filter.anySport": "Qualquer modalidade",
    "tournamentList.filter.submit": "Filtrar",
    "years.label": "Anos",
    "years.earlier": "Anos anteriores",

    "admin.newerBuild.message":
      "Há uma versão mais nova deste site disponível.",
    "admin.newerBuild.reload": "Recarregar",
    "admin.title": "Administração",
    "admin.tournaments.new": "Novo torneio",
    "admin.tournaments.none": "Nenhum torneio",
    "admin.tournaments.archived": "Arquivado",
    "admin.tournaments.manage": "Gerenciar",
    "admin.tournaments.edit": "Editar",
    "admin.tournaments.archive": "Arquivar",
    "admin.tournaments.restore": "Restaurar",
    "admin.tournaments.scores": "Placares",
    "admin.tournaments.players": "Jogadores",
    "admin.years.label": "Anos",
    "admin.years.earlier": "Anos anteriores",
    "admin.tournament.name": "Nome",
    "admin.tournament.starts": "Início",
    "admin.tournament.finishes": "Término",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Modalidade",
    "admin.tournament.country": "País",
    "admin.tournament.region": "Região",
    "admin.tournament.subtitle": "Subtítulo",
    "admin.tournament.handicap": "Disputado com handicaps",
    "admin.tournament.drawsAllowed": "Permite resultados empatados",
    "admin.tournament.levelTestsDrawn":
      "Testes empatados em pontos são empates",
    "admin.tournament.worldRankings": "Vale para os rankings mundiais",
    "admin.tournament.national": "Evento de nível nacional",
    "admin.tournament.international": "Evento de nível internacional",
    "admin.tournament.otherwise": "Isto não pode ser aceito como está.",
    "admin.newTournament.title": "Novo torneio",
    "admin.newTournament.submit": "Criar torneio",
    "admin.editTournament.title": "Editar torneio",
    "admin.editTournament.submit": "Atualizar torneio",
    "admin.editTournament.otherwise": "Este torneio não pode ser alterado.",
    "admin.view.tabs": "Torneio",
    "admin.view.players": "Jogadores",
    "admin.view.competitions": "Competições",
    "admin.view.managers": "Organizadores",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Apontadores",
    "admin.view.rankings": "Rankings",
    "admin.rankings.textFile":
      "Os resultados do torneio são enviados aos rankings mundiais como um arquivo de texto, que o site escreve a partir das partidas inseridas.",
    "admin.rankings.spreadsheet":
      "Os resultados do torneio são enviados aos rankings mundiais como uma planilha, que o site escreve a partir das partidas inseridas.",
    "admin.rankings.fillInWinners":
      "O site só pode adivinhar quem ganhou cada competição, por isso verifique a linha Winner de cada uma antes de enviar o arquivo.",
    "admin.rankings.fillInWinner":
      "O site não pode saber quem ganhou o torneio, por isso preencha-o no fim da planilha antes de enviá-la.",
    "admin.rankings.sendIt":
      "Depois envie o arquivo aos responsáveis pelos rankings mundiais.",
    "admin.rankings.download": "Baixar rankings",
    "rankings.notAvailable": "Os rankings não estão disponíveis",
    "rankings.notAvailable.sport":
      "A modalidade deste torneio não tem rankings mundiais, por isso não há rankings para enviar.",
    "rankings.notAvailable.handicap":
      "Este torneio é jogado com handicap, por isso não conta para os rankings mundiais.",
    "rankings.notAvailable.drawnGames":
      "Este torneio permite jogos empatados, por isso não conta para os rankings mundiais.",
    "rankings.notAvailable.notCounted":
      "O organizador deste torneio indicou que não conta para os rankings mundiais.",
    "admin.view.otherwise": "Este torneio não pode ser gerenciado daqui.",
    "admin.competitionView.tabs": "Competição",
    "admin.competitionView.players": "Jogadores",
    "admin.competitionView.scores": "Placares",
    "admin.sections.label": "O torneio e suas competições",
    "admin.sections.tournament": "Torneio",
    "admin.administrator.sections.label": "As páginas do administrador",
    "admin.administrator.sections.tournaments": "Torneios",
    "admin.administrator.sections.accounts": "Contas",
    "admin.administrator.sections.worldRankings": "Rankings mundiais",
    "admin.administrator.sections.importErrors": "Erros de importação",
    "admin.administrator.title": "Administrador",
    "admin.accounts.title": "Contas",
    "admin.roles.add": "Adicionar",
    "admin.roles.administrator.heading": "Administradores",
    "admin.roles.administrator.none": "Nenhum outro administrador",
    "admin.roles.administrator.removeTitle": "Remover administrador",
    "admin.roles.administrator.removeExplanation":
      "{name} deixará de ser administrador deste site.",
    "admin.roles.world-ranking-officer.heading":
      "Responsáveis pelo ranking mundial",
    "admin.roles.world-ranking-officer.none":
      "Nenhum responsável pelo ranking mundial",
    "admin.roles.world-ranking-officer.removeTitle":
      "Remover responsável pelo ranking mundial",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} deixará de ser responsável pelo ranking mundial.",
    "admin.worldRankings.title": "Importar jogadores do ranking mundial",
    "admin.worldRankings.import": "Importar",
    "admin.worldRankings.log": "Como foi a importação",
    "admin.worldRankings.ac.reading": "Lendo a lista do croquet de associação",
    "admin.worldRankings.ac.read":
      "Jogadores de croquet de associação lidos: {players}",
    "admin.worldRankings.ac.kept":
      "Jogadores de croquet de associação mantidos: {players}",
    "admin.worldRankings.ac.refused":
      "A lista do croquet de associação não pôde ser lida, então os seus jogadores foram deixados como estavam.",
    "admin.worldRankings.gc.reading": "Lendo a lista do golf croquet",
    "admin.worldRankings.gc.read": "Jogadores de golf croquet lidos: {players}",
    "admin.worldRankings.gc.kept":
      "Jogadores de golf croquet mantidos: {players}",
    "admin.worldRankings.gc.refused":
      "A lista do golf croquet não pôde ser lida, então os seus jogadores foram deixados como estavam.",
    "admin.worldRankings.finished": "Concluído",
    "admin.worldRankings.failed": "A importação não foi concluída.",
    "admin.worldRankings.otherwise": "Algo deu errado no site.",
    "WorldRankingLists.Unreachable":
      "Não foi possível acessar o site dos rankings mundiais.",
    "WorldRankingLists.Unreadable":
      "A lista não está organizada como os rankings mundiais organizam a sua: uma linha dela não pôde ser lida, não há ninguém nela, ou ela não está escrita em UTF-8.",
    "admin.importErrors.title": "Erros de importação",
    "admin.importErrors.none": "Nenhum erro de importação",
    "admin.importErrors.otherwise": "Algo deu errado no site.",
    "admin.importError.title": "Erro de importação",
    "admin.importError.documentId": "Id do documento",
    "admin.importError.tournament": "Torneio",
    "admin.importError.competition": "Competição",
    "admin.importError.newSite": "Site novo",
    "admin.importError.oldSite": "Site antigo",
    "ImportErrorKept.NotFound":
      "A importação não salvou nenhum erro para esse documento.",
    "admin.competitionView.otherwise":
      "Esta competição não pode ser gerenciada daqui.",
    "admin.competitions.block": "Grupo",
    "admin.competitions.knockout": "Eliminatória",
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
    "admin.competition.otherwise":
      "Esta competição não pode ser salva como está.",
    "CompetitionName.Missing": "Insira um nome.",
    "CompetitionName.TooLong": "Um nome pode ter no máximo 254 caracteres.",
    "CompetitionName.NoLetterOrDigit":
      "Um nome precisa ter uma letra ou um dígito.",
    "Tournament.KnockoutPlayerHasGames":
      "Os jogadores deste sorteio têm jogos, então as suas vagas não podem mudar.",
    "Tournament.CompetitionNameTaken":
      "Outra competição deste torneio já tem esse nome.",
    "BestOf.NotWhole": "Insira um número inteiro de jogos.",
    "BestOf.TooSmall": "Uma partida precisa ser melhor de pelo menos 1 jogo.",
    "Rounds.NotWhole": "Digite um número inteiro de rodadas.",
    "Rounds.TooSmall": "Um bloco precisa ser jogado em pelo menos 1 rodada.",
    "KnockoutDraw.EvenBestOf":
      "A partida de uma eliminatória precisa ter um vencedor, então é melhor de um número ímpar de jogos.",
    "admin.hover.tournaments.new": "Criar um novo torneio",
    "admin.hover.tournaments.manage":
      "Gerenciar os jogadores, as equipes, as competições e os placares deste torneio",
    "admin.hover.tournaments.edit": "Alterar os detalhes deste torneio",
    "admin.hover.tournaments.scores": "Inserir os placares deste torneio",
    "admin.hover.tournaments.players": "Cuidar dos jogadores deste torneio",
    "admin.hover.competitions.view":
      "Abrir esta competição para ver e inserir os seus jogadores e placares",
    "admin.hover.tests.view":
      "Abrir este teste para ver e inserir os seus placares",
    "admin.hover.teams.view":
      "Abrir esta equipe para ver e gerenciar os seus jogadores",
    "admin.hover.dialog.player.add": "Adicionar este jogador ao torneio",
    "admin.hover.dialog.player.save": "Salvar as alterações deste jogador",
    "admin.hover.dialog.team.add": "Adicionar esta equipe ao torneio",
    "admin.hover.dialog.team.save": "Salvar as alterações desta equipe",
    "admin.hover.dialog.test.add": "Adicionar este teste ao torneio",
    "admin.hover.dialog.test.save": "Salvar as alterações deste teste",
    "admin.hover.dialog.competition.add":
      "Adicionar esta competição ao torneio",
    "admin.hover.dialog.competition.save":
      "Salvar as alterações desta competição",
    "admin.hover.dialog.score.add": "Adicionar este placar à competição",
    "admin.hover.dialog.score.save": "Salvar a correção deste placar",
    "admin.hover.dialog.carryForward.save":
      "Transportar os resultados deste jogador",
    "admin.hover.dialog.tournament.new": "Criar este torneio",
    "admin.hover.dialog.tournament.edit": "Salvar as alterações deste torneio",
    "admin.hover.modal.cancel": "Fechar sem salvar nada",
    "admin.hover.modal.ok": "Fechar esta mensagem",
    "admin.hover.tab": "Mostrar a aba {name}",
    "admin.hover.tournaments.archive":
      "Arquivar este torneio; ele pode ser restaurado",
    "admin.hover.tournaments.restore": "Trazer de volta este torneio arquivado",
    "admin.hover.players.add": "Adicionar um jogador a este torneio",
    "admin.hover.players.edit": "Alterar os detalhes deste jogador",
    "admin.hover.players.up": "Subir este jogador na lista",
    "admin.hover.players.down": "Descer este jogador na lista",
    "admin.hover.players.archive":
      "Arquivar este jogador; ele pode ser restaurado",
    "admin.hover.players.restore": "Trazer de volta este jogador arquivado",
    "admin.hover.teams.add": "Adicionar uma equipe a este torneio",
    "admin.hover.teams.edit": "Alterar os detalhes desta equipe",
    "admin.hover.teams.up": "Subir esta equipe na lista",
    "admin.hover.teams.down": "Descer esta equipe na lista",
    "admin.hover.teams.archive":
      "Arquivar esta equipe; ela pode ser restaurada",
    "admin.hover.teams.restore": "Trazer de volta esta equipe arquivada",
    "admin.hover.competitions.add": "Adicionar uma competição a este torneio",
    "admin.hover.competitions.edit": "Alterar os detalhes desta competição",
    "admin.hover.competitions.up": "Subir esta competição na lista",
    "admin.hover.competitions.down": "Descer esta competição na lista",
    "admin.hover.competitions.archive":
      "Arquivar esta competição; ela pode ser restaurada",
    "admin.hover.competitions.restore":
      "Trazer de volta esta competição arquivada",
    "admin.hover.tests.add": "Adicionar um teste entre duas equipes",
    "admin.hover.tests.edit": "Alterar os detalhes deste teste",
    "admin.hover.tests.up": "Subir este teste na lista",
    "admin.hover.tests.down": "Descer este teste na lista",
    "admin.hover.tests.archive": "Arquivar este teste; ele pode ser restaurado",
    "admin.hover.tests.restore": "Trazer de volta este teste arquivado",
    "admin.hover.tests.toTeams":
      "Ir para a aba Equipes para adicionar as equipes de que um teste precisa",
    "admin.hover.scores.add": "Adicionar o placar de um jogo a esta competição",
    "admin.hover.scores.edit": "Corrigir este placar",
    "admin.hover.scores.archive":
      "Arquivar este placar para que ele deixe de contar; ele pode ser restaurado",
    "admin.hover.scores.restore":
      "Trazer de volta este placar arquivado, para que ele volte a contar",
    "admin.hover.scores.withdraw":
      "Manter este placar na lista, mas fazer com que ele deixe de contar",
    "admin.hover.scores.unwithdraw":
      "Fazer este placar anulado voltar a contar",
    "admin.hover.scores.up": "Mover este placar para antes na lista",
    "admin.hover.scores.down": "Mover este placar para depois na lista",
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
      "Transportar os resultados deste jogador de outra competição",
    "admin.hover.notes.add": "Escrever uma nova nota para este torneio",
    "admin.hover.notes.edit": "Alterar esta nota",
    "admin.hover.notes.delete": "Excluir esta nota",
    "admin.hover.note.add": "Salvar esta nota e adicioná-la ao torneio",
    "admin.hover.note.save": "Salvar as alterações desta nota",
    "admin.hover.people.add": "Dar o papel a esta pessoa",
    "admin.hover.people.remove": "Tirar o papel desta pessoa",
    "admin.hover.worldRankings.import":
      "Buscar os rankings mundiais e adicionar os seus jogadores",
    "admin.modal.cancel": "Cancelar",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "Endereço de email",
    "admin.people.remove": "Remover",
    "admin.people.otherwise": "Não foi possível fazer isso.",
    "admin.managers.you": "Você",
    "admin.managers.add": "Adicionar organizador",
    "admin.managers.none": "Nenhum organizador",
    "admin.managers.removeTitle": "Remover organizador",
    "admin.managers.removeExplanation":
      "{name} deixará de poder administrar este torneio.",
    "admin.managers.removeYourself.explanation":
      "Você deixará de poder administrar este torneio, e ninguém aqui poderá desfazer isso por você. Outro organizador pode torná-lo organizador novamente.",
    "admin.managers.otherwise": "Esse endereço não pode ser feito organizador.",
    "admin.competitionPlayers.add": "Adicionar jogador",
    "admin.competitionPlayers.otherwise":
      "Este jogador não pode ser adicionado.",
    "admin.competitionPlayers.choose": "Jogador a adicionar",
    "admin.competitionPlayers.nobody": "Escolha um jogador",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Todos os jogadores estão na competição",
    "admin.competitionPlayers.none": "Nenhum jogador",
    "admin.competitionPlayers.up": "Subir",
    "admin.competitionPlayers.down": "Descer",
    "admin.competitionPlayers.remove": "Remover",
    "admin.competitionPlayers.withdraw": "Retirar",
    "admin.competitionPlayers.unwithdraw": "Desfazer a retirada",
    "admin.competitionPlayers.withdrawn": "Jogadores retirados",
    "admin.competitionPlayers.removeTitle": "Remover jogador",
    "admin.competitionPlayers.removeQuestion":
      "{name} será tirado da competição. Isto não pode ser desfeito.",
    "admin.competitionPlayers.withdrawTitle": "Retirar jogador",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} não jogará mais nada da competição, e os jogos que ainda não disputou serão decididos sem ele.",
    "admin.competitionPlayers.carryForward": "Transportar",
    "admin.carryForward.title": "Transportar - {name}",
    "admin.carryForward.save": "Salvar",
    "admin.carryForward.otherwise": "Este transporte não pode ser salvo.",
    "admin.carryForward.matchWins": "Partidas ganhas",
    "admin.carryForward.matchLosses": "Partidas perdidas",
    "admin.carryForward.gameWins": "Jogos ganhos",
    "admin.carryForward.gameLosses": "Jogos perdidos",
    "admin.carryForward.hoopsFor": "Arcos a favor",
    "admin.carryForward.hoopsAgainst": "Arcos contra",
    "CarryForward.MatchWinsNotWhole":
      "Insira um número inteiro de partidas ganhas.",
    "CarryForward.MatchWinsBelowZero": "Insira 0 ou mais partidas ganhas.",
    "CarryForward.MatchLossesNotWhole":
      "Insira um número inteiro de partidas perdidas.",
    "CarryForward.MatchLossesBelowZero": "Insira 0 ou mais partidas perdidas.",
    "CarryForward.GameWinsNotWhole":
      "Insira um número inteiro de jogos ganhos.",
    "CarryForward.GameWinsBelowZero": "Insira 0 ou mais jogos ganhos.",
    "CarryForward.GameLossesNotWhole":
      "Insira um número inteiro de jogos perdidos.",
    "CarryForward.GameLossesBelowZero": "Insira 0 ou mais jogos perdidos.",
    "CarryForward.HoopsForNotWhole":
      "Insira um número inteiro de arcos a favor.",
    "CarryForward.HoopsForBelowZero": "Insira 0 ou mais arcos a favor.",
    "CarryForward.HoopsAgainstNotWhole":
      "Insira um número inteiro de arcos contra.",
    "CarryForward.HoopsAgainstBelowZero": "Insira 0 ou mais arcos contra.",
    "admin.scores.add": "Adicionar placar",
    "admin.scores.none": "Nenhum placar",
    "admin.scores.edit": "Editar",
    "admin.scores.drawNotFilledTitle": "Chave incompleta",
    "admin.scores.archive": "Arquivar",
    "admin.scores.up": "Subir",
    "admin.scores.down": "Descer",
    "admin.scores.restore": "Restaurar",
    "admin.scores.archived": "Placares arquivados",
    "admin.scores.archivedSaid": "Arquivado",
    "admin.scores.withdraw": "Anular",
    "admin.scores.unwithdraw": "Desfazer a anulação",
    "admin.scores.withdrawnSaid": "Anulado",
    "admin.scores.otherwise": "Não foi possível fazer isso.",
    "admin.score.title": "Adicionar placar",
    "admin.score.add": "Adicionar jogo",
    "admin.score.winner": "Vencedor",
    "admin.score.winnerScore": "Placar do vencedor",
    "admin.score.loser": "Perdedor",
    "admin.score.loserScore": "Placar do perdedor",
    "admin.score.beat": "venceu",
    "admin.score.added":
      "O jogo que {winner} ganhou de {loser} foi adicionado.",
    "admin.score.otherwise": "Não foi possível adicionar o jogo.",
    "admin.score.correctTitle": "Editar placar",
    "admin.score.save": "Salvar",
    "admin.score.notCorrected": "Não foi possível corrigir o placar.",
    "Game.WinnerMissing": "Escolha o vencedor.",
    "Game.WinnerScoreMissing": "Digite o placar do vencedor.",
    "Game.LoserMissing": "Escolha o perdedor.",
    "Game.LoserScoreMissing": "Digite o placar do perdedor.",
    "Score.NoPoints": "Um placar começa com o seu número de pontos.",
    "Game.SamePlayer": "Ninguém joga contra si mesmo.",
    "Game.WinnerNotAhead":
      "O placar do vencedor precisa ser maior que o do perdedor, ou marcado como ganho.",
    "Game.LoserMarked": "O placar do perdedor não pode ser marcado como ganho.",
    "Game.ResultChanged":
      "Uma correção mantém o resultado: um jogo ganho continua ganho, e um jogo empatado continua empatado.",
    "Competition.MatchDecided": "A partida deles já está decidida.",
    "Competition.DrawFull":
      "Não é possível adicionar o jogador porque a eliminatória está cheia.",
    "Competition.DrawNotFilled":
      "Não é possível adicionar placares até que todas as vagas da eliminatória estejam preenchidas com um jogador ou um bye.",
    "Competition.ByeOutsideKnockout":
      "Somente uma eliminatória pode ter um bye.",
    "Competition.NotDrawnToMeet":
      "Estes jogadores não estão sorteados para se enfrentar na eliminatória.",
    "Competition.WinnerHasPlayedOn":
      "O vencedor desta partida já jogou o seu jogo seguinte, então quem a ganhou não pode mudar.",
    "CompetitionPlayer.Withdrawn": "Um jogador retirado não joga mais.",
    "admin.players.add": "Adicionar jogador",
    "admin.players.none": "Nenhum jogador",
    "admin.players.edit": "Editar",
    "admin.players.archive": "Arquivar",
    "admin.players.restore": "Restaurar",
    "admin.players.up": "Subir",
    "admin.players.down": "Descer",
    "admin.players.archiveTitle": "Arquivar jogador",
    "admin.players.archiveQuestion": "{name} será removido destas competições:",
    "admin.players.archive.explanation":
      "Restaurá-lo não o colocará de volta nestas competições.",
    "admin.players.archived": "Jogadores arquivados",
    "admin.players.archivedSaid": "Arquivado",
    "admin.player.addTitle": "Adicionar jogador",
    "admin.player.editTitle": "Editar jogador",
    "admin.player.name": "Nome",
    "admin.player.representing": "Representando",
    "admin.player.worldRankingName": "Nome do jogador no ranking mundial",
    "admin.player.worldRankingKnown":
      "Os rankings mundiais conhecem este nome.",
    "admin.player.worldRankingQuestioned":
      "Os rankings mundiais não têm nenhum jogador com este nome. Ele pode estar escrito errado, ou o jogador pode ser novo nos rankings.",
    "admin.player.flag": "Bandeira",
    "admin.player.add": "Adicionar",
    "admin.player.save": "Salvar",
    "admin.player.added": "{name} foi adicionado.",
    "admin.player.otherwise": "Este jogador não pode ser salvo como está.",
    "Tournament.PlayerNameTaken":
      "Outro jogador deste torneio já tem esse nome.",
    "TournamentPlayer.NoSuchFlag": "Escolha uma das bandeiras disponíveis.",
    "TournamentPlayer.NamedBye": "Um jogador não pode se chamar Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Um nome precisa ter uma letra ou um dígito.",
    "admin.player.byesTitle": "Byes não precisam ser adicionados",
    "admin.player.byes":
      "Um bye não é um dos jogadores do torneio. Uma eliminatória oferece Bye sempre que os seus jogadores são adicionados, quantas vezes o seu sorteio precisar.",
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
    "admin.team.shortName": "Nome abreviado",
    "admin.team.shortName.explanation":
      "Como os testes da equipe são chamados, por exemplo AUS x ENG.",
    "admin.team.flag": "Bandeira",
    "admin.team.add": "Adicionar",
    "admin.team.save": "Salvar",
    "admin.team.added": "{name} foi adicionada.",
    "admin.team.otherwise": "Esta equipe não pode ser salva como está.",
    "admin.teamView.otherwise": "Esta equipe não pode ser vista daqui.",
    "admin.teamView.players": "Jogadores",
    "TeamName.Missing": "Diga como a equipe se chama.",
    "TeamName.TooLong": "Esse nome é longo demais.",
    "admin.notes.add": "Adicionar nota",
    "admin.notes.none": "Nenhuma nota",
    "admin.notes.edit": "Editar",
    "admin.notes.delete": "Excluir",
    "admin.notes.deleteTitle": "Excluir nota",
    "admin.notes.deleteQuestion": "Excluir a nota “{title}”?",
    "admin.notes.delete.explanation":
      "Uma nota excluída desaparece para sempre e não pode ser recuperada.",
    "admin.notes.otherwise": "Não foi possível fazer isso.",
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
    "admin.note.otherwise": "Esta nota não pode ser salva como está.",
    "ManagerNoteTitle.Missing": "Dê um título à nota.",
    "ManagerNoteTitle.TooLong": "Esse título é longo demais.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Um título precisa ter uma letra ou um dígito.",
    "ManagerNoteDescription.TooLong": "Essa descrição é longa demais.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Essa nota não está mais lá. Outro organizador pode tê-la excluído.",
    "EditManagerNote.NoSuchManagerNote":
      "Essa nota não está mais lá. Outro organizador pode tê-la excluído.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Essa nota não está mais lá. Outro organizador pode tê-la excluído.",
    "ManagerNote.Deleted":
      "Essa nota foi excluída. Outro organizador pode tê-la excluído.",
    "CommentaryTitle.Missing": "Dê um título ao comentário.",
    "CommentaryTitle.TooLong": "Esse título é longo demais.",
    "CommentaryTitle.NoLetterOrDigit":
      "Um título precisa ter uma letra ou um dígito.",
    "Commentary.TitleTaken": "Outro comentário já tem esse título.",
    "CommentText.Missing": "Escreva algo no comentário.",
    "CommentText.TooLong": "Esse comentário é longo demais.",
    "TeamShortName.Missing": "Dê um nome abreviado à equipe.",
    "TeamShortName.TooLong":
      "Um nome abreviado pode ter no máximo 10 caracteres.",
    "TeamShortName.NoLetterOrDigit":
      "Um nome abreviado precisa ter uma letra ou um dígito.",
    "Team.ShortNameLongerThanName":
      "Um nome abreviado não pode ser mais longo que o nome da equipe.",
    "Team.NoSuchFlag": "Escolha uma das bandeiras disponíveis.",
    "Team.Archived": "Essa equipe está arquivada, e é restaurada antes.",
    "Team.InATest": "Essa equipe joga em um teste e não pode ser arquivada.",
    "Team.PlayerNameTaken": "Outro jogador desta equipe já tem esse nome.",
    "TeamPlayer.NamedBye": "Um jogador não pode se chamar Bye.",
    "TeamPlayer.Archived": "Esse jogador está arquivado, e é restaurado antes.",
    "TeamPlayer.HasGames": "Esse jogador já jogou e não pode ser arquivado.",
    "Tournament.TeamNameTaken": "Outra equipe deste torneio já tem esse nome.",
    "Tournament.TeamShortNameTaken":
      "Outra equipe deste torneio já tem esse nome abreviado.",
    "Tournament.NoSuchTeam":
      "Este torneio não tem nenhuma equipe neste endereço.",
    "Tournament.TeamArchived":
      "Esta equipe está arquivada, e só pode ser restaurada na aba Equipes.",
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
    "admin.test.otherwise": "Este teste não pode ser salvo como está.",
    "admin.testView.otherwise": "Este teste não pode ser visto daqui.",
    "AddTest.FirstTeamMissing": "Escolha a primeira equipe.",
    "AddTest.SecondTeamMissing": "Escolha a segunda equipe.",
    "UpdateTest.FirstTeamMissing": "Escolha a primeira equipe.",
    "UpdateTest.SecondTeamMissing": "Escolha a segunda equipe.",
    "ExpectedMatches.NotWhole": "Insira um número inteiro de partidas.",
    "ExpectedMatches.TooSmall":
      "Um teste precisa ter pelo menos 1 partida prevista.",
    "TestGroup.TooLong": "Esse grupo é longo demais.",
    "Tournament.TestAgainstItself":
      "Uma equipe não disputa um teste contra si mesma.",
    "Tournament.TestFinishesBeforeStarts":
      "Um teste não pode terminar antes de começar.",
    "Tournament.TestStartsBeforeTournament":
      "Um teste não pode começar antes do seu torneio.",
    "Tournament.TestFinishesAfterTournament":
      "Um teste não pode terminar depois do seu torneio.",
    "Tournament.TestHasGamesInUse":
      "Este teste tem jogos, então não pode ser arquivado até que eles sejam.",
    "Tournament.TestHasGames":
      "Este teste já tem jogos, então as suas equipes não podem mais ser alteradas.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Mais partidas do que isso já começaram.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dois jogadores já disputaram mais jogos do que isso.",
    "Competition.ExpectedMatchesReached":
      "Este teste já começou tantas partidas quantas se espera que ele tenha.",
    "Competition.SameTeam":
      "Dois jogadores da mesma equipe não jogam um contra o outro.",
    "AddManager.NoSuchAccount":
      "Esse endereço não tem nenhuma conta que possa ser feita organizadora.",
    "admin.scorers.add": "Adicionar apontador",
    "admin.scorers.none": "Nenhum apontador",
    "admin.scorers.removeTitle": "Remover apontador",
    "admin.scorers.removeExplanation":
      "{name} deixará de poder inserir os placares deste torneio.",
    "admin.scorers.otherwise": "Esse endereço não pode ser feito apontador.",
    "AddScorer.NoSuchAccount":
      "Esse endereço não tem nenhuma conta que possa ser feita apontadora.",
    "Account.NotAnAdministrator": "Somente um administrador pode fazer isso.",
    "AddRole.NoSuchAccount":
      "Esse endereço não tem nenhuma conta que possa receber o papel.",
    "AddRole.NoSuchRole": "Esse papel não existe.",
    "RemoveRole.NoSuchAccount": "Essa conta não existe.",
    "RemoveRole.NoSuchRole": "Esse papel não existe.",
    "RemoveRole.Yourself":
      "Você não pode tirar de si mesmo o papel de Administrador.",
    "AccountsWithRole.NoSuchRole": "Esse papel não existe.",
    "Tournament.AlreadyAManager":
      "Essa conta já organiza o torneio e pode fazer tudo o que um apontador pode.",

    "TournamentName.Missing": "Diga como o torneio se chama.",
    "TournamentName.TooShort": "Esse nome é curto demais.",
    "TournamentName.TooLong": "Esse nome é longo demais.",
    "TournamentName.AllLowerCase": "Um nome não é escrito todo em minúsculas.",
    "TournamentName.AllCapitals": "Um nome não é escrito todo em maiúsculas.",
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
    "Tournament.NotAManager":
      "Somente um organizador deste torneio pode alterá-lo.",
    "Tournament.NotAManagerOrScorer":
      "Somente um organizador ou um apontador deste torneio pode vê-lo.",
    "Tournament.Archived":
      "Este torneio está arquivado, e é restaurado antes de poder ser alterado.",
    "UpdateTournament.NoSuchTournament":
      "Não há nenhum torneio neste endereço.",

    // The sports and formats keep the names their players use in Portuguese,
    // which for most of them is the English name; the formats named for a
    // competition keep its name, as a name is not translated.
    "sport.ac": "Croquet de Associação",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Croquet Americano de 6 Arcos",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Padrão",
    "format.teams": "Por equipes",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
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
    "country.by": "Bielorrússia",
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
    "country.fk": "Ilhas Falkland (Malvinas)",
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
    "country.gs": "Ilhas Geórgia do Sul e Sandwich do Sul",
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
    "country.ki": "Quiribati",
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
    "country.mw": "Malaui",
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
    "country.pm": "São Pedro e Miquelão",
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
    "country.tf": "Territórios Franceses do Sul",
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

    "Email.ConfirmAddress.subject":
      "Confirme o seu endereço de email para o {siteName}",
    "Email.ConfirmAddress.body": `
<p>Olá,</p>

<p>
    Obrigado por criar uma conta no <strong>{siteName}</strong>.<br />
    Antes de começar a usar a sua conta, confirme o seu endereço de email
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
        Confirmar meu endereço de email
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode confirmar o seu endereço de email abrindo este link no seu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se você não criou esta conta, pode ignorar este email com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Um novo link para confirmar o seu endereço de email para o {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Olá,</p>

<p>
    Você pediu há pouco um novo email para confirmar o seu endereço de email para o <strong>{siteName}</strong>.<br />
    Confirme o seu endereço de email clicando no botão abaixo:
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
        Confirmar meu endereço de email
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode confirmar o seu endereço de email abrindo este link no seu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Depois de confirmado, você poderá continuar usando a sua conta sem interrupções.
</p>

<p>
    Se você não pediu este email, pode ignorá-lo com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Alguém tentou se registrar com o seu endereço de email",
    "Email.AlreadyRegistered.body": `
<p>Olá,</p>

<p>
    Alguém tentou se registrar no <strong>{siteName}</strong> usando este
    endereço de email, que já tem uma conta. Nada na sua conta foi
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
    Se você esqueceu a sua senha, pode redefini-la aqui:
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
        Esqueci minha senha
    </a>
</p>

<p>
    Se não foi você, não precisa fazer nada. Ninguém recebeu uma forma de
    entrar na sua conta.
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
    movê-la para este endereço de email. Se foi você, confirme aqui,
    conectado a essa conta. O link funciona por 24 horas.
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
        Mover minha conta
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
      "Alguém pediu para mover uma conta para o seu endereço de email",
    "Email.AlreadyHasAnAccount.body": `
<p>Olá,</p>

<p>
    Alguém conectado a uma conta do <strong>{siteName}</strong> pediu para
    movê-la para este endereço de email, que já tem uma conta própria. Nada
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

    "Email.EmailAddressChanged.subject": "Sua conta do {siteName} foi movida",
    "Email.EmailAddressChanged.body": `
<p>Olá,</p>

<p>
    Sua conta do <strong>{siteName}</strong> acabou de ser movida para outro
    endereço de email, {emailAddress}, e daqui em diante você entra com esse
    endereço.
</p>

<p>
    Se não foi você, outra pessoa está com a sua conta. Responda a este email
    e nos avise.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Sua senha do {siteName} foi alterada",
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
        Esqueci minha senha
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Defina uma nova senha para o {siteName}",
    "Email.SetNewPassword.body": `
<p>Olá,</p>

<p>
    Você pediu há pouco para redefinir a sua senha do <strong>{siteName}</strong>.<br />
    Você pode redefinir a sua senha clicando no botão abaixo:
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
    Se o botão não funcionar, você também pode redefinir a sua senha abrindo este link no seu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se você não pediu a redefinição da senha, pode ignorar este email com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Defina uma senha para o {siteName}",
    "Email.SetPassword.body": `
<p>Olá,</p>

<p>
    Sua conta do <strong>{siteName}</strong> não tem senha: você entra com o Google.<br />
    Você pediu para definir uma, para também poder entrar com o seu endereço de email e uma senha.
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
    Se o botão não funcionar, você também pode definir a sua senha abrindo este link no seu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    O link funciona por uma hora. Se você não pediu para definir uma senha, pode ignorar este email com tranquilidade.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Não há nenhuma conta do {siteName} para este endereço de email",
    "Email.RegisterInstead.body": `
<p>Olá,</p>

<p>
    Foi feito um pedido para redefinir a senha de um endereço de email que
    não está associado a nenhuma conta no <strong>{siteName}</strong>.
</p>

<p>
    Se você quiser usar o nosso serviço, pode criar uma nova conta em:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Se não foi você quem fez este pedido, pode ignorar este email com tranquilidade.
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
    Você pediu que a sua conta do <strong>{siteName}</strong> fosse
    esquecida.<br />
    Clique no botão abaixo para ver o que isso significa e dizer com certeza
    que você quer isso:
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
        Esquecer minha conta
    </a>
</p>

<p>
    Se o botão não funcionar, você também pode abrir este link no seu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Depois de esquecidos, o seu nome e o seu endereço de email nunca mais
    poderão ser lidos, por ninguém, e não será possível entrar na sua conta.
    Isto não pode ser desfeito.
</p>

<p>
    O link funciona uma vez só, até 15 minutos depois de você o pedir, e somente
    enquanto você estiver conectado a esta conta. Depois disso, peça novamente
    a partir da sua conta.
</p>

<p>
    Se você não pediu, nada acontecerá a menos que o link seja seguido.
    Alguém conectado à sua conta pediu, porém, então defina uma nova senha
    na página de senha esquecida para ter certeza de que essa pessoa não
    poderá entrar novamente.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Os registros estão suspensos: não foi possível acessar {service}",
    "Email.RegistrationsSuspended.body": `
<p>Olá,</p>

<p>
    O {siteName} não conseguiu acessar {service} em {when}. Até que responda,
    os leitores que precisarem dele, para se registrar ou para definir uma nova
    senha, são avisados para tentar novamente mais tarde.
</p>

<p>
    Não é preciso liberar nada. Cada tentativa consulta {service} de novo, e
    as páginas voltam a funcionar assim que ele responder.
</p>

<p>
    Enquanto {service} continuar fora do ar, você receberá um email sobre isso
    no máximo uma vez por hora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} não consegue acessar o banco de dados",
    "Email.DatabaseUnreachable.body": `
<p>Olá,</p>

<p>
    {siteName} não conseguiu acessar o banco de dados às {when}. Até que ele responda, cada página que precisa dele diz aos leitores que o site está indisponível e para tentarem novamente mais tarde.
</p>

<p>
    Não há nada a desbloquear. Cada requisição pede uma conexão de novo, e o site volta a funcionar assim que o banco de dados responde.
</p>

<p>
    Enquanto o banco de dados continuar fora do ar, você receberá no máximo um e-mail sobre isso a cada {minutes} minutos.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} falhou em uma requisição",
    "Email.UnhandledError.body": `
<p>Olá,</p>

<p>
    {siteName} falhou às {when} em uma requisição para {asked}. O leitor viu a referência {reference}, e o registro tem a causa logo abaixo dela.
</p>

<p>
    Um site quebrado costuma falhar em toda requisição, então você receberá no máximo 4 emails por hora sobre falhas. As seguintes ficam no registro do mesmo jeito.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
