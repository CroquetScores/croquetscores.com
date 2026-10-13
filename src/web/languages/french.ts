// The site's words in French. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as vous rather than tu: French websites speak to a
// stranger as vous, and a reader scoring or following a tournament has not
// asked to be addressed as a friend. The English is plain and direct, so the
// vous is kept plain too: short sentences and the imperative. Items in menus
// and on buttons are written in sentence case, as French writes them, where
// the English capitalises each word. An email address is an "adresse e-mail"
// throughout, and an email that is sent is an "e-mail".
// The spaces French puts before : ; ? ! and inside « » are non-breaking, so
// that a line never ends on a lone mark.
import type { Language } from "../common/language.js";

export const french: Language = {
  tag: "fr",
  name: "Français",
  words: {
    "site.skipToContent": "Aller au contenu",
    "navigation.menu": "Menu",
    "navigation.label": "Principale",
    "navigation.home": "Accueil",
    "navigation.help": "Aide",
    "navigation.admin": "Administration",
    "sections.label": "Rubriques",
    "theme.label": "Thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "footer.donate": "Faire un don",
    "footer.plea":
      "{siteName} vous plaît ? Faites un don pour aider à poursuivre son développement.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "tryWebsite.banner":
      "Ici, vous pouvez apprendre {siteName} sans risque. Tout ce que vous saisissez peut être effacé à tout moment.",

    "language.label": "Langue",
    "language.choose": "Changer",

    "form.otherwise":
      "Quelque chose ne va pas. Vérifiez ce que vous avez saisi et réessayez.",

    "account.menu": "Compte",
    "account.register": "S’inscrire",
    "account.signIn": "Se connecter",
    "account.forgotPassword": "J’ai oublié mon mot de passe",
    "account.signOut": "Se déconnecter",
    "account.profile": "Profil",
    "account.changePassword": "Changer de mot de passe",
    "account.changeEmailAddress": "Changer d’adresse e-mail",
    "account.changeName": "Changer de nom",
    "account.setPassword": "Définir un mot de passe",
    "account.forgetAccount": "Oublier le compte",

    "register.title": "S’inscrire",
    "register.emailAddress": "Adresse e-mail",
    "register.submit": "S’inscrire",
    "register.withGoogle": "S’inscrire avec Google",
    "register.or": "ou",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google n’a pas confirmé que cette adresse e-mail est la vôtre ; elle ne peut donc pas servir ici avec Google. Utilisez votre adresse e-mail ci-dessous.",
    "SignInWithGoogle.LinkedToAnother":
      "Cette adresse e-mail a déjà un compte, lié à un autre compte Google. Connectez-vous avec ce compte Google, ou avec votre adresse e-mail et votre mot de passe.",
    "SignInWithGoogle.NameMissing":
      "Google ne nous a pas donné votre nom, et un compte en a besoin. Utilisez votre adresse e-mail ci-dessous.",
    "Google.Unreachable":
      "Impossible de joindre Google pour le moment. Réessayez dans quelques minutes, ou utilisez votre adresse e-mail ci-dessous.",
    "Registration.NotAPerson":
      "Cela ne semblait pas venir d’une personne. Réessayez et, si le problème persiste, attendez quelques minutes avant de revenir.",

    "EmailAddress.Missing": "Saisissez une adresse e-mail.",
    "EmailAddress.NoAt": "Une adresse e-mail contient un @.",
    "EmailAddress.MoreThanOneAt":
      "Une adresse e-mail ne contient qu’un seul @.",
    "EmailAddress.NoDomain":
      "Une adresse e-mail contient un domaine après le @, comme example.com.",

    "welcome.title": "Consultez votre messagerie",
    "welcome.checkEmail":
      "Nous avons envoyé un e-mail à l’adresse que vous nous avez donnée. Suivez le lien qu’il contient pour continuer.",
    "welcome.nothingArrived":
      "Si rien n’arrive au bout de quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "welcome.home": "Retour à {siteName}",
    "newConfirmationLink.title": "Demandez un nouveau lien",
    "newConfirmationLink.explanation":
      "Le lien pour confirmer votre adresse e-mail a expiré. Demandez-en un nouveau : il sera envoyé à l’adresse avec laquelle vous vous êtes inscrit.",
    "newConfirmationLink.send": "Envoyez-moi un nouveau lien",
    "newConfirmationLink.home": "Retour à {siteName}",
    "newConfirmationLink.signIn": "Se connecter",
    "newConfirmationLink.sent.title": "Consultez votre messagerie",
    "newConfirmationLink.sent.explanation":
      "Nous vous avons envoyé un nouveau lien. Suivez-le pour confirmer votre adresse e-mail. Si rien n’arrive au bout de quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Cette adresse e-mail est déjà confirmée",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Il n’y a plus rien à confirmer. Connectez-vous avec le mot de passe que vous avez choisi en la confirmant.",
    "newConfirmationLink.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "newConfirmationLink.noLongerWorks.explanation":
      "Vérifiez que vous avez suivi le lien en entier, sans qu’il en manque la fin. Si cela ne marche toujours pas, inscrivez-vous de nouveau et un nouveau lien vous sera envoyé.",
    "newConfirmationLink.tooMany.title": "Réessayez plus tard",
    "newConfirmationLink.tooMany.explanation":
      "Plusieurs liens ont été envoyés à cette adresse récemment. Attendez une heure avant d’en demander un autre, et regardez en attendant dans votre dossier de courrier indésirable ou de spam.",

    "forgotPassword.title": "Mot de passe oublié ?",
    "forgotPassword.emailAddress": "Adresse e-mail",
    "forgotPassword.submit": "Envoyez-moi un moyen de me reconnecter",
    "forgotPassword.home": "Retour à {siteName}",
    "forgotPassword.sent.title": "Consultez votre messagerie",
    "forgotPassword.sent.explanation":
      "Si cette adresse a un compte, nous vous avons envoyé un lien pour définir un nouveau mot de passe. Suivez-le dans l’heure. Si rien n’arrive au bout de quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "forgotPassword.tryAgainLater":
      "Trop de moyens de se reconnecter ont été demandés d’ici récemment. Attendez une heure et réessayez.",

    "setNewPassword.title": "Définissez un nouveau mot de passe",
    "setNewPassword.password": "Mot de passe",
    "setNewPassword.confirmPassword": "Confirmer le mot de passe",
    "setNewPassword.submit": "Définir mon nouveau mot de passe",
    "setNewPassword.home": "Retour à {siteName}",
    "setNewPassword.signIn": "Se connecter",
    "setNewPassword.askAgain": "Demander un nouveau lien",
    "setNewPassword.changed.title": "Votre mot de passe a été changé",
    "setNewPassword.changed.explanation":
      "Vous avez été déconnecté de tous les endroits où vous étiez connecté. Connectez-vous avec votre nouveau mot de passe.",
    "setNewPassword.expired.title": "Ce lien a expiré",
    "setNewPassword.expired.explanation":
      "Un lien pour définir un nouveau mot de passe fonctionne pendant une heure. Demandez-en un autre : il sera envoyé à la même adresse.",
    "setNewPassword.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "setNewPassword.noLongerWorks.explanation":
      "Il a peut-être déjà servi, ou il en manque la fin. Demandez-en un autre si vous en avez encore besoin.",

    "BreachedPasswords.Unreachable":
      "Impossible de vérifier votre mot de passe pour le moment ; il n’a donc pas été changé. Réessayez dans quelques minutes ; votre lien fonctionne jusqu’à son expiration.",

    "forgetAccount.title": "Oubliez votre compte",
    "forgetAccount.explanation":
      "Votre nom et votre adresse e-mail peuvent être rendus illisibles pour toujours, et votre compte fermé. Pour nous assurer que c’est bien vous, nous enverrons d’abord un lien à l’adresse de votre compte, et rien n’est oublié tant que vous ne l’avez pas suivi.",
    "forgetAccount.submit": "Envoyez-moi le lien",
    "forgetAccount.sent.title": "Consultez votre messagerie",
    "forgetAccount.sent.explanation":
      "Nous avons envoyé un lien à l’adresse de votre compte. Il fonctionne pendant 15 minutes, et seulement tant que vous êtes connecté à ce compte.",
    "forgetAccount.confirm.title": "Oublier votre compte pour toujours ?",
    "forgetAccount.confirm.explanation":
      "Une fois oublié, plus personne ne pourra relire votre nom ni votre adresse e-mail, et il sera impossible de se connecter à votre compte. Cela ne peut pas être annulé.",
    "forgetAccount.confirm.submit": "Oublier mon compte",
    "forgetAccount.forgotten.title": "Votre compte a été oublié",
    "forgetAccount.forgotten.explanation":
      "Votre nom et votre adresse e-mail ne peuvent plus être lus, et vous avez été déconnecté de tous les endroits où vous étiez connecté.",
    "forgetAccount.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "forgetAccount.noLongerWorks.explanation":
      "Il a peut-être expiré, déjà servi, ou appartient à un compte auquel vous n’êtes pas connecté. Redemandez-le depuis votre compte si vous voulez toujours qu’il soit oublié.",
    "forgetAccount.lastAdministrator.title":
      "Votre compte ne peut pas être oublié",
    "forgetAccount.lastAdministrator.explanation":
      "Vous êtes le seul administrateur de ce site. Donnez le rôle d’administrateur à quelqu’un d’autre, et votre compte pourra ensuite être oublié.",
    "forgetAccount.askAgain": "Redemander",
    "forgetAccount.home": "Retour à {siteName}",

    "registrationsSuspended.title":
      "Les inscriptions sont suspendues pour le moment",
    "registrationsSuspended.explanation":
      "Un service dont l’inscription a besoin est actuellement injoignable ; personne ne peut donc s’inscrire tant qu’il ne répond pas de nouveau. Rien de ce que vous avez saisi n’a été conservé.",
    "registrationsSuspended.tryAgainLater":
      "Réessayez dans un moment. L’administrateur du site a été prévenu.",
    "registrationsSuspended.home": "Retour à {siteName}",

    "signIn.title": "Se connecter",
    "signIn.emailAddress": "Adresse e-mail",
    "signIn.password": "Mot de passe",
    "signIn.submit": "Se connecter",
    "signIn.forgotPassword": "Mot de passe oublié ?",
    "signIn.register": "S’inscrire",
    "signIn.withGoogle": "Se connecter avec Google",
    "signIn.or": "ou",
    "signIn.tryAgainLater":
      "Trop de tentatives ont eu lieu récemment. Attendez une heure et réessayez.",

    "SignIn.Failed":
      "L’adresse e-mail ou le mot de passe est incorrect. Réessayez.",

    "profile.title": "Profil",
    "profile.name": "Nom :",
    "profile.emailAddress": "Adresse e-mail :",

    "changeName.title": "Changer de nom",
    "changeName.name": "Nom",
    "changeName.submit": "Changer de nom",

    "setPassword.title": "Définissez un mot de passe",
    "setPassword.explanation":
      "Votre compte n’a pas de mot de passe : vous vous connectez avec Google. Pour pouvoir aussi vous connecter avec un mot de passe, nous enverrons à {emailAddress} un lien pour en définir un.",
    "setPassword.submit": "Envoyez-moi un lien",
    "setPassword.sent.title": "Consultez votre messagerie",
    "setPassword.sent.explanation":
      "Nous vous avons envoyé un lien pour définir un mot de passe. Il fonctionne pendant une heure.",
    "setPassword.profile": "Retour à votre profil",

    "changePassword.title": "Changer de mot de passe",
    "changePassword.currentPassword": "Mot de passe actuel",
    "changePassword.password": "Nouveau mot de passe",
    "changePassword.passwordConfirmation": "Confirmer le mot de passe",
    "changePassword.forgotPassword": "Mot de passe oublié ?",
    "changePassword.submit": "Changer de mot de passe",
    "ChangePassword.WrongPassword": "Ce n’est pas votre mot de passe.",

    "changeEmailAddress.title": "Changer d’adresse e-mail",
    "changeEmailAddress.emailAddress": "Nouvelle adresse e-mail",
    "changeEmailAddress.currentPassword": "Mot de passe actuel",
    "changeEmailAddress.submit": "Envoyer un lien de confirmation",
    "changeEmailAddress.sent.title": "Consultez votre messagerie",
    "changeEmailAddress.sent.explanation":
      "Un lien pour confirmer le déménagement a été envoyé à la nouvelle adresse e-mail. Suivez-le, une fois connecté, pour y déplacer votre compte.",
    "changeEmailAddress.confirm.title": "Déplacez votre compte",
    "changeEmailAddress.confirm.explanation":
      "Votre compte sera déplacé vers {emailAddress}. Désormais, vous vous connecterez avec cette adresse.",
    "changeEmailAddress.confirm.submit": "Déplacer mon compte",
    "changeEmailAddress.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "changeEmailAddress.noLongerWorks.explanation":
      "Il a expiré, a déjà servi, ou n’a pas été envoyé pour le compte auquel vous êtes connecté. Redemandez-le depuis votre profil.",
    "changeEmailAddress.taken.title": "Votre compte n’a pas été déplacé",
    "changeEmailAddress.profile": "Retour à votre profil",
    "ChangeEmailAddress.WrongPassword": "Ce n’est pas votre mot de passe.",
    "ChangeEmailAddress.Unchanged": "Votre compte est déjà à cette adresse.",
    "ChangeEmailAddress.Taken":
      "Cette adresse e-mail a déjà son propre compte ; le vôtre ne peut donc pas y être déplacé.",

    "confirmEmailAddress.title": "Confirmez votre adresse e-mail",
    "confirmEmailAddress.name": "Nom",
    "confirmEmailAddress.password": "Mot de passe",
    "confirmEmailAddress.confirmPassword": "Confirmer le mot de passe",
    "confirmEmailAddress.submit": "Confirmer mon adresse e-mail",
    "confirmEmailAddress.signIn": "Se connecter",
    "confirmEmailAddress.home": "Retour à {siteName}",
    "confirmEmailAddress.confirmed.title": "Votre adresse e-mail est confirmée",
    "confirmEmailAddress.confirmed.explanation":
      "Votre compte est prêt. Connectez-vous avec l’adresse e-mail et le mot de passe que vous venez de donner.",
    "confirmEmailAddress.expired.title": "Ce lien a expiré",
    "confirmEmailAddress.expired.explanation":
      "Un lien pour confirmer une adresse e-mail fonctionne pendant 24 heures. Demandez-en un nouveau : il sera envoyé à la même adresse.",
    "confirmEmailAddress.expired.newLink": "Envoyez-moi un nouveau lien",
    "confirmEmailAddress.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Vérifiez que vous avez suivi le lien en entier, sans qu’il en manque la fin. Si cela ne marche toujours pas, inscrivez-vous de nouveau et un nouveau lien vous sera envoyé.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Cette adresse e-mail est déjà confirmée",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Il n’y a plus rien à faire. Connectez-vous avec le mot de passe que vous avez choisi en la confirmant.",

    "PersonName.Missing": "Saisissez un nom.",
    "PersonName.TooShort": "Un nom doit comporter au moins 3 caractères.",
    "PersonName.TooLong": "Un nom peut comporter au plus 254 caractères.",
    "WorldRankingName.TooShort":
      "Le nom du classement mondial doit comporter au moins 3 caractères.",
    "WorldRankingName.TooLong":
      "Le nom du classement mondial peut comporter au plus 254 caractères.",
    "Password.Missing": "Saisissez un mot de passe.",
    "Password.TooShort":
      "Un mot de passe doit comporter au moins 12 caractères.",
    "Password.ConfirmationDiffers":
      "Il ne correspond pas au mot de passe ci-dessus. Saisissez-le de nouveau.",
    "Password.Breached":
      "Ce mot de passe est apparu dans une fuite de données ailleurs ; l’utiliser ici n’est donc pas sûr. Choisissez-en un autre.",

    "javaScriptRequired.title": "JavaScript est nécessaire",
    "javaScriptRequired.explanation":
      "Pour vous inscrire, JavaScript doit être activé sur ce site, afin de vérifier que la personne qui s’inscrit est bien une personne. Activez-le et inscrivez-vous de nouveau.",
    "javaScriptRequired.register": "Retour à l’inscription",
    "javaScriptRequired.home": "Retour à {siteName}",

    "errors.backHome": "Retour à {siteName}",
    "errors.notFound": "Introuvable",
    "errors.refused": "Impossible à faire",
    "errors.refusedDetail":
      "Quelque chose dans ce qui a été envoyé n’allait pas.",
    "errors.sorry": "Désolé",
    "errors.sorryDetail": "Cette demande n’a pas pu être traitée.",
    "errors.failed": "Quelque chose s’est mal passé",
    "errors.reference": "Référence {reference}.",

    "home.recentResults": "Résultats récents",
    "home.recentResults.none":
      "Aucune partie n’a été ajoutée ces sept derniers jours.",
    "home.upcomingTournaments": "Prochains tournois",
    "home.upcomingTournaments.none":
      "Aucun tournoi ne commence dans les soixante prochains jours.",
    "tournamentList.column.date": "Date",
    "tournamentList.column.name": "Nom",
    "tournamentList.onlyIn": "Seulement les tournois en {country}",
    "tournamentList.filter.country": "Pays",
    "tournamentList.filter.anyCountry": "Tous les pays",
    "tournamentList.filter.region": "Région",
    "tournamentList.filter.anyRegion": "Toutes les régions",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Tous les sports",
    "tournamentList.filter.submit": "Filtrer",
    "home.allTournaments": "Tous les tournois de {year}",
    "year.heading": "Tournois de {year}",
    "year.none": "Aucun tournoi ne commence en {year}.",
    "yearSport.heading": "Tournois de {sport} en {year}",
    "yearSport.none": "Aucun tournoi de {sport} ne commence en {year}.",
    "tournament.recent": "Récents",
    "tournament.summary": "Résumé",
    "test.bestOf": "Chaque rencontre se joue au meilleur des {count} parties.",
    "test.vs": "contre",
    "test.matches": "Matchs",
    "test.games": "Parties",
    "test.hoops": "Arceaux",
    "teamSummary.tests": "Tests",
    "teamSummary.matches": "Matchs",
    "teamSummary.games": "Parties",
    "teamSummary.hoops": "Arceaux",
    "teamSummary.wins": "Victoires",
    "teamSummary.losses": "Défaites",
    "teamSummary.draws": "Matchs nuls",
    "teamSummary.for": "Pour",
    "teamSummary.against": "Contre",
    "teamSummary.net": "Net",
    "tournament.players": "Joueurs",
    "tournament.test": "{first} contre {second}",
    "tournament.notes": "Notes",
    "tournament.commentary": "Commentaires",
    "tournament.beat": "a battu",
    "tournament.drewWith": "a fait match nul avec",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 heure",
    "tournament.ago.hours": "{count} heures",
    "tournament.none": "Aucune partie n’a encore été jouée.",
    "players.none": "Aucun joueur n’a encore été ajouté.",
    "commentaries.by": "par",
    "commentaries.start": "Commencer un nouveau commentaire",
    "commentaries.disclaimer.heading": "Avertissement",
    "commentaries.disclaimer":
      "Les opinions exprimées dans ces commentaires sont celles de leurs auteurs et ne reflètent pas nécessairement celles de Tim Murphy ni de {site}.",
    "commentaries.guidelines.heading": "Règles",
    "commentaries.guidelines.responsible":
      "Vous êtes responsable de vos commentaires.",
    "commentaries.guidelines.purpose":
      "Les commentaires servent à raconter ce qui se passe dans le tournoi. Ils ne sont pas conçus comme un « réseau social » où échanger des vœux, etc.",
    "commentaries.guidelines.hatred":
      "Ne publiez rien qui puisse inciter à la violence ou à la haine. Nous ne tolérerons pas les commentaires qui rabaissent autrui à cause de sa race, de sa religion, de son origine ethnique, de son genre, de son âge, d’un handicap mental ou physique, ou de son orientation sexuelle.",
    "commentaries.guidelines.abuse":
      "Les injures gratuites ne seront pas tolérées. La règle générale est de jouer la balle et non le joueur : ne vous en prenez à personne, mais traitez le sujet en question.",
    "commentaries.guidelines.unlawful":
      "Tout commentaire d’une légalité douteuse, comme une possible atteinte au droit d’auteur ou un contenu pouvant être diffamatoire, sera retiré.",
    "commentaries.guidelines.shouting":
      "Dans les commentaires, merci de ne pas être grossier ni d’écrire tout en majuscules.",
    "commentaries.guidelines.selling":
      "N’utilisez pas les commentaires à des fins commerciales ni pour du spam. Les commentaires qui font de la publicité, promeuvent ou proposent des biens ou des services seront retirés.",
    "commentaries.guidelines.links":
      "Merci de limiter les liens dans les commentaires. Les commentaires contenant des liens vers des contenus inappropriés seront retirés.",
    "commentaries.guidelines.impersonating":
      "Ne vous faites pas passer pour quelqu’un d’autre dans les commentaires, et ne publiez pas de données personnelles – numéros de téléphone, adresses postales ou adresses e-mail – qui pourraient mettre quelqu’un en danger sans le vouloir.",
    "commentaries.reporting.heading": "Signaler des commentaires",
    "commentaries.reporting.before":
      "Merci de signaler les commentaires qui ne respectent pas ces règles à",
    "commentaries.reporting.after":
      ". Indiquez l’adresse web et le commentaire en cause. Par exemple :",
    "commentaries.reporting.exampleComment":
      "« un commentaire qui devrait être retiré »",
    "commentaries.reporting.exampleReason":
      "Ce commentaire devrait être retiré parce que...",
    "commentaries.reporting.reviewed":
      "Un signalement n’entraîne pas automatiquement le retrait, mais tous les signalements seront examinés.",
    "commentaries.reporting.reserved":
      "{site} se réserve le droit de retirer des commentaires.",
    "commentaries.reporting.subject": "{site} Signalement d’un commentaire",
    "commentaries.reporting.body":
      "Merci d’indiquer l’adresse web, le commentaire en cause et pourquoi il devrait être retiré.",
    "startCommentary.title": "Commencer un nouveau commentaire",
    "startCommentary.titleField": "Titre",
    "startCommentary.submit": "Commencer le commentaire",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Les organisateurs n’ont pas encore écrit de notes.",
    "marks.new": "nouveau",
    "note.edited": "modifiée",
    "commentary.none": "Rien n’a encore été écrit.",
    "commentary.edited": "modifié",
    "commentary.edit": "Modifier",
    "commentary.delete": "Supprimer",
    "commentary.comment": "Commentaire",
    "commentary.add": "Ajouter",
    "commentary.notSent":
      "Le commentaire n’a pas pu être envoyé. Rechargez la page pour voir s’il a été enregistré.",
    "changeCommentaryTitle.title": "Changer le titre",
    "changeCommentaryTitle.submit": "Enregistrer",
    "editComment.title": "Modifier le commentaire",
    "editComment.save": "Enregistrer",
    "deleteComment.title": "Supprimer le commentaire",
    "deleteComment.question":
      "Supprimer ce commentaire ? Cela ne peut pas être annulé.",
    "deleteComment.confirm": "Supprimer le commentaire",
    "deleteComment.keep": "Le garder",
    "player.games": "Parties",
    "player.competitions": "Compétitions",
    "player.beat": "a battu",
    "player.lostTo": "a perdu contre",
    "player.drewWith": "a fait match nul avec",
    "player.score": "{score} à {opponent}",
    "player.noGames": "Aucune partie n’a encore été jouée.",
    "player.noCompetitions": "Pas encore inscrit à une compétition.",
    "block.wins": "Victoires",
    "block.matches": "Rencontres",
    "block.netGames": "Parties nettes",
    "block.games": "Parties",
    "block.netHoops": "Arceaux nets",
    "block.won": "gagnée",
    "block.lost": "perdue",
    "block.drawn": "nulle",
    "block.withdrawn": "forfait",
    "block.gameWithdrawn": "forfait",
    "block.losses": "Défaites",
    "competition.views": "Vues",
    "competition.view.grid": "Tableau",
    "competition.view.summary": "Résumé",
    "competition.view.orderOfPlay": "Ordre de jeu",
    "blockSummary.ranking":
      "Classement selon la proportion de rencontres gagnées, puis selon les arceaux nets. Le règlement d’un tournoi peut classer ses joueurs autrement.",
    "orderOfPlay.none": "Aucune partie n’a encore été jouée.",
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Demi-finales",
    "knockout.round.quarters": "Quarts de finale",
    "knockout.round.number": "Tour {number}",
    "knockout.bye": "Exempt",
    "swiss.games": "Parties",
    "swiss.wins": "Victoires",
    "swiss.winShare": "% de victoires",
    "swiss.results": "Résultats",
    "knockout.onward": "Tours suivants",
    "knockout.back": "Tours précédents",
    "years.label": "Années",
    "years.earlier": "Années précédentes",

    "admin.newerBuild.message":
      "Une version plus récente de ce site est disponible.",
    "admin.newerBuild.reload": "Recharger",
    "admin.title": "Administration",
    "admin.tournaments.new": "Nouveau tournoi",
    "admin.tournaments.none": "Aucun tournoi",
    "admin.tournaments.archived": "Archivé",
    "admin.tournaments.manage": "Gérer",
    "admin.tournaments.edit": "Modifier",
    "admin.tournaments.archive": "Archiver",
    "admin.tournaments.restore": "Restaurer",
    "admin.tournaments.scores": "Résultats",
    "admin.tournaments.players": "Joueurs",
    "admin.years.label": "Années",
    "admin.years.earlier": "Années précédentes",
    "admin.tournament.name": "Nom",
    "admin.tournament.starts": "Début",
    "admin.tournament.finishes": "Fin",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Pays",
    "admin.tournament.region": "Région",
    "admin.tournament.subtitle": "Sous-titre",
    "admin.tournament.handicap": "Joué avec handicap",
    "admin.tournament.drawsAllowed": "Matchs nuls autorisés",
    "admin.tournament.levelTestsDrawn": "Les tests à égalité sont nuls",
    "admin.tournament.worldRankings": "Compte pour le classement mondial",
    "admin.tournament.national": "Épreuve de niveau national",
    "admin.tournament.international": "Épreuve de niveau international",
    "admin.tournament.otherwise": "Cela ne peut pas être accepté en l’état.",
    "admin.newTournament.title": "Nouveau tournoi",
    "admin.newTournament.submit": "Créer le tournoi",
    "admin.editTournament.title": "Modifier le tournoi",
    "admin.editTournament.submit": "Mettre à jour le tournoi",
    "admin.editTournament.otherwise": "Ce tournoi ne peut pas être modifié.",
    "admin.view.tabs": "Tournoi",
    "admin.view.players": "Joueurs",
    "admin.view.competitions": "Compétitions",
    "admin.view.managers": "Gestionnaires",
    "admin.view.notes": "Notes",
    "admin.view.scorers": "Marqueurs",
    "admin.view.rankings": "Classements",
    "admin.rankings.textFile":
      "Les résultats du tournoi sont envoyés au classement mondial sous forme de fichier texte, que le site écrit à partir des parties saisies.",
    "admin.rankings.spreadsheet":
      "Les résultats du tournoi sont envoyés au classement mondial sous forme de tableur, que le site écrit à partir des parties saisies.",
    "admin.rankings.fillInWinners":
      "Le site ne peut que deviner qui a gagné chaque compétition ; vérifiez donc la ligne Winner de chacune avant d'envoyer le fichier.",
    "admin.rankings.fillInWinner":
      "Le site ne peut pas savoir qui a gagné le tournoi ; indiquez-le donc en bas du tableur avant de l'envoyer.",
    "admin.rankings.sendIt":
      "Envoyez ensuite le fichier aux responsables du classement mondial.",
    "admin.rankings.download": "Télécharger les classements",
    "rankings.notAvailable": "Les classements ne sont pas disponibles",
    "rankings.notAvailable.sport":
      "Le sport de ce tournoi n'a pas de classement mondial, il n'y a donc aucun classement à envoyer.",
    "rankings.notAvailable.handicap":
      "Ce tournoi se joue avec handicap, il ne compte donc pas pour le classement mondial.",
    "rankings.notAvailable.drawnGames":
      "Ce tournoi autorise les parties nulles, il ne compte donc pas pour le classement mondial.",
    "rankings.notAvailable.notCounted":
      "L'organisateur de ce tournoi a indiqué qu'il ne compte pas pour le classement mondial.",
    "admin.view.otherwise": "Ce tournoi ne peut pas être géré d’ici.",
    "admin.competitionView.tabs": "Compétition",
    "admin.competitionView.players": "Joueurs",
    "admin.competitionView.scores": "Résultats",
    "admin.sections.label": "Le tournoi et ses compétitions",
    "admin.sections.tournament": "Tournoi",
    "admin.administrator.sections.label": "Les pages de l’administrateur",
    "admin.administrator.sections.tournaments": "Tournois",
    "admin.administrator.sections.accounts": "Comptes",
    "admin.administrator.sections.worldRankings": "Classement mondial",
    "admin.administrator.sections.importErrors": "Erreurs d’importation",
    "admin.administrator.title": "Administrateur",
    "admin.accounts.title": "Comptes",
    "admin.roles.add": "Ajouter",
    "admin.roles.administrator.heading": "Administrateurs",
    "admin.roles.administrator.none": "Aucun autre administrateur",
    "admin.roles.administrator.removeTitle": "Retirer un administrateur",
    "admin.roles.administrator.removeExplanation":
      "{name} ne sera plus administrateur de ce site.",
    "admin.roles.world-ranking-officer.heading":
      "Responsables du classement mondial",
    "admin.roles.world-ranking-officer.none":
      "Aucun responsable du classement mondial",
    "admin.roles.world-ranking-officer.removeTitle":
      "Retirer un responsable du classement mondial",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} ne sera plus responsable du classement mondial.",
    "admin.worldRankings.title": "Importer les joueurs du classement mondial",
    "admin.worldRankings.import": "Importer",
    "admin.worldRankings.log": "Comment s’est passée l’importation",
    "admin.worldRankings.ac.reading":
      "Lecture de la liste du croquet association",
    "admin.worldRankings.ac.read":
      "Joueurs de croquet association lus : {players}",
    "admin.worldRankings.ac.kept":
      "Joueurs de croquet association conservés : {players}",
    "admin.worldRankings.ac.refused":
      "La liste du croquet association n’a pas pu être lue ; ses joueurs ont donc été laissés tels quels.",
    "admin.worldRankings.gc.reading": "Lecture de la liste du croquet golf",
    "admin.worldRankings.gc.read": "Joueurs de croquet golf lus : {players}",
    "admin.worldRankings.gc.kept":
      "Joueurs de croquet golf conservés : {players}",
    "admin.worldRankings.gc.refused":
      "La liste du croquet golf n’a pas pu être lue ; ses joueurs ont donc été laissés tels quels.",
    "admin.worldRankings.finished": "Terminé",
    "admin.worldRankings.failed": "L’importation ne s’est pas terminée.",
    "admin.worldRankings.otherwise": "Quelque chose a échoué sur le site.",
    "WorldRankingLists.Unreachable":
      "Le site du classement mondial est injoignable.",
    "WorldRankingLists.Unreadable":
      "La liste n’a pas la forme des listes du classement mondial : une ligne n’a pas pu être lue, ne contient personne ou n’est pas écrite en UTF-8.",
    "admin.importErrors.title": "Erreurs d’importation",
    "admin.importErrors.none": "Aucune erreur d’importation",
    "admin.importErrors.otherwise": "Quelque chose a échoué sur le site.",
    "admin.importError.title": "Erreur d’importation",
    "admin.importError.documentId": "Identifiant du document",
    "admin.importError.tournament": "Tournoi",
    "admin.importError.competition": "Compétition",
    "admin.importError.newSite": "Nouveau site",
    "admin.importError.oldSite": "Ancien site",
    "ImportErrorKept.NotFound":
      "L’importation n’a conservé aucune erreur pour ce document.",
    "admin.competitionView.otherwise":
      "Cette compétition ne peut pas être gérée d’ici.",
    "admin.competitions.block": "Poule",
    "admin.competitions.knockout": "Élimination directe",
    "admin.competitions.swiss": "Système suisse",
    "admin.competitions.view": "Voir",
    "admin.competitions.edit": "Modifier",
    "admin.competitions.up": "Monter",
    "admin.competitions.down": "Descendre",
    "admin.competitions.archive": "Archiver",
    "admin.competitions.restore": "Restaurer",
    "admin.competitions.archived": "Compétitions archivées",
    "admin.competitions.none": "Aucune compétition",
    "admin.competitions.add": "Ajouter une compétition",
    // The competition dialog.
    "admin.competition.addTitle": "Ajouter une compétition",
    "admin.competition.editTitle": "Modifier la compétition",
    "admin.competition.name": "Nom",
    "admin.competition.kind": "Type",
    "admin.competition.bestOf": "Au meilleur des",
    "admin.competition.rounds": "Tours",
    "admin.competition.places": "Places",
    "admin.competition.round": "Tour {number}",
    "admin.competition.bestOfs": "Au meilleur des",
    "admin.competition.quarters": "Quarts",
    "admin.competition.semis": "Demis",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Ajouter",
    "admin.competition.save": "Enregistrer",
    "admin.competition.added": "{name} a été ajoutée.",
    "admin.competition.otherwise":
      "Cette compétition ne peut pas être enregistrée en l’état.",
    "CompetitionName.Missing": "Saisissez un nom.",
    "CompetitionName.TooLong": "Un nom peut comporter au plus 254 caractères.",
    "CompetitionName.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    "Tournament.KnockoutPlayerHasGames":
      "Des joueurs de ce tableau ont des matchs ; leurs places ne peuvent donc pas changer.",
    "Tournament.CompetitionNameTaken":
      "Une autre compétition de ce tournoi porte déjà ce nom.",
    "BestOf.NotWhole": "Saisissez un nombre entier de parties.",
    "BestOf.TooSmall":
      "Une rencontre doit se jouer au meilleur d’au moins 1 partie.",
    "Rounds.NotWhole": "Saisissez un nombre entier de tours.",
    "Rounds.TooSmall": "Un bloc doit se jouer en au moins 1 tour.",
    "KnockoutDraw.EvenBestOf":
      "Une rencontre d’élimination directe doit avoir un vainqueur ; elle se joue donc au meilleur d’un nombre impair de parties.",
    "admin.hover.tournaments.new": "Créer un nouveau tournoi",
    "admin.hover.tournaments.manage":
      "Gérer les joueurs, les équipes, les compétitions et les résultats de ce tournoi",
    "admin.hover.tournaments.edit": "Modifier les détails de ce tournoi",
    "admin.hover.tournaments.scores": "Saisir les résultats de ce tournoi",
    "admin.hover.tournaments.players": "S’occuper des joueurs de ce tournoi",
    "admin.hover.competitions.view":
      "Ouvrir cette compétition pour voir et saisir ses joueurs et ses résultats",
    "admin.hover.tests.view":
      "Ouvrir ce test pour voir et saisir ses résultats",
    "admin.hover.teams.view":
      "Ouvrir cette équipe pour voir et gérer ses joueurs",
    "admin.hover.dialog.player.add": "Ajouter ce joueur au tournoi",
    "admin.hover.dialog.player.save":
      "Enregistrer les modifications de ce joueur",
    "admin.hover.dialog.team.add": "Ajouter cette équipe au tournoi",
    "admin.hover.dialog.team.save":
      "Enregistrer les modifications de cette équipe",
    "admin.hover.dialog.test.add": "Ajouter ce test au tournoi",
    "admin.hover.dialog.test.save": "Enregistrer les modifications de ce test",
    "admin.hover.dialog.competition.add":
      "Ajouter cette compétition au tournoi",
    "admin.hover.dialog.competition.save":
      "Enregistrer les modifications de cette compétition",
    "admin.hover.dialog.score.add": "Ajouter ce résultat à la compétition",
    "admin.hover.dialog.score.save": "Enregistrer la correction de ce résultat",
    "admin.hover.dialog.carryForward.save":
      "Reporter les résultats de ce joueur",
    "admin.hover.dialog.tournament.new": "Créer ce tournoi",
    "admin.hover.dialog.tournament.edit":
      "Enregistrer les modifications de ce tournoi",
    "admin.hover.modal.cancel": "Fermer sans rien enregistrer",
    "admin.hover.modal.ok": "Fermer ce message",
    "admin.hover.tab": "Afficher l’onglet {name}",
    "admin.hover.tournaments.archive":
      "Archiver ce tournoi ; il pourra être restauré",
    "admin.hover.tournaments.restore": "Récupérer ce tournoi archivé",
    "admin.hover.players.add": "Ajouter un joueur à ce tournoi",
    "admin.hover.players.edit": "Modifier les détails de ce joueur",
    "admin.hover.players.up": "Monter ce joueur dans la liste",
    "admin.hover.players.down": "Descendre ce joueur dans la liste",
    "admin.hover.players.archive":
      "Archiver ce joueur ; il pourra être restauré",
    "admin.hover.players.restore": "Récupérer ce joueur archivé",
    "admin.hover.teams.add": "Ajouter une équipe à ce tournoi",
    "admin.hover.teams.edit": "Modifier les détails de cette équipe",
    "admin.hover.teams.up": "Monter cette équipe dans la liste",
    "admin.hover.teams.down": "Descendre cette équipe dans la liste",
    "admin.hover.teams.archive":
      "Archiver cette équipe ; elle pourra être restaurée",
    "admin.hover.teams.restore": "Récupérer cette équipe archivée",
    "admin.hover.competitions.add": "Ajouter une compétition à ce tournoi",
    "admin.hover.competitions.edit":
      "Modifier les détails de cette compétition",
    "admin.hover.competitions.up": "Monter cette compétition dans la liste",
    "admin.hover.competitions.down":
      "Descendre cette compétition dans la liste",
    "admin.hover.competitions.archive":
      "Archiver cette compétition ; elle pourra être restaurée",
    "admin.hover.competitions.restore": "Récupérer cette compétition archivée",
    "admin.hover.tests.add": "Ajouter un test entre deux équipes",
    "admin.hover.tests.edit": "Modifier les détails de ce test",
    "admin.hover.tests.up": "Monter ce test dans la liste",
    "admin.hover.tests.down": "Descendre ce test dans la liste",
    "admin.hover.tests.archive": "Archiver ce test ; il pourra être restauré",
    "admin.hover.tests.restore": "Récupérer ce test archivé",
    "admin.hover.tests.toTeams":
      "Aller à l’onglet Équipes pour ajouter les équipes dont un test a besoin",
    "admin.hover.scores.add":
      "Ajouter le résultat d’un match à cette compétition",
    "admin.hover.scores.edit": "Corriger ce résultat",
    "admin.hover.scores.archive":
      "Archiver ce résultat pour qu’il ne compte plus ; il pourra être restauré",
    "admin.hover.scores.restore":
      "Récupérer ce résultat archivé, pour qu’il compte de nouveau",
    "admin.hover.scores.withdraw":
      "Garder ce résultat dans la liste mais sans le compter",
    "admin.hover.scores.unwithdraw":
      "Faire compter de nouveau ce résultat retiré",
    "admin.hover.scores.up": "Déplacer ce résultat plus haut dans la liste",
    "admin.hover.scores.down": "Déplacer ce résultat plus bas dans la liste",
    "admin.hover.competitionPlayers.add":
      "Mettre le joueur choisi dans cette compétition",
    "admin.hover.competitionPlayers.up": "Monter ce joueur dans la liste",
    "admin.hover.competitionPlayers.down": "Descendre ce joueur dans la liste",
    "admin.hover.competitionPlayers.remove":
      "Sortir ce joueur de la compétition",
    "admin.hover.competitionPlayers.withdraw":
      "Déclarer ce joueur forfait dans la compétition",
    "admin.hover.competitionPlayers.unwithdraw":
      "Remettre dans la compétition ce joueur déclaré forfait",
    "admin.hover.competitionPlayers.carryForward":
      "Reporter les résultats de ce joueur depuis une autre compétition",
    "admin.hover.notes.add": "Écrire une nouvelle note pour ce tournoi",
    "admin.hover.notes.edit": "Modifier cette note",
    "admin.hover.notes.delete": "Supprimer cette note",
    "admin.hover.note.add": "Enregistrer cette note et l’ajouter au tournoi",
    "admin.hover.note.save": "Enregistrer les modifications de cette note",
    "admin.hover.people.add": "Donner le rôle à cette personne",
    "admin.hover.people.remove": "Retirer le rôle à cette personne",
    "admin.hover.worldRankings.import":
      "Récupérer les classements mondiaux et ajouter leurs joueurs",
    "admin.modal.cancel": "Annuler",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "Adresse e-mail",
    "admin.people.remove": "Retirer",
    "admin.people.otherwise": "Impossible à faire.",
    "admin.managers.you": "Vous",
    "admin.managers.add": "Ajouter un gestionnaire",
    "admin.managers.none": "Aucun gestionnaire",
    "admin.managers.removeTitle": "Retirer un gestionnaire",
    "admin.managers.removeExplanation":
      "{name} ne pourra plus gérer ce tournoi.",
    "admin.managers.removeYourself.explanation":
      "Vous ne pourrez plus gérer ce tournoi, et personne ici ne peut l’annuler pour vous. Un autre gestionnaire peut vous redonner ce rôle.",
    "admin.managers.otherwise":
      "Cette adresse ne peut pas devenir gestionnaire.",
    "admin.competitionPlayers.add": "Ajouter un joueur",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "Ce joueur ne peut pas être ajouté.",
    "admin.competitionPlayers.choose": "Joueur à ajouter",
    "admin.competitionPlayers.nobody": "Choisissez un joueur",
    "admin.competitionPlayers.bye": "Exempt",
    "admin.competitionPlayers.all": "Tous les joueurs sont dans la compétition",
    "admin.competitionPlayers.none": "Aucun joueur",
    "admin.competitionPlayers.up": "Monter",
    "admin.competitionPlayers.down": "Descendre",
    "admin.competitionPlayers.remove": "Retirer",
    "admin.competitionPlayers.withdraw": "Déclarer forfait",
    "admin.competitionPlayers.unwithdraw": "Annuler le forfait",
    "admin.competitionPlayers.withdrawn": "Joueurs forfaits",
    "admin.competitionPlayers.removeTitle": "Retirer un joueur",
    "admin.competitionPlayers.removeQuestion":
      "{name} sortira de la compétition. Cela ne peut pas être annulé.",
    "admin.competitionPlayers.withdrawTitle": "Déclarer un joueur forfait",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} ne jouera plus dans la compétition, et les parties qu’il n’a pas jouées seront décidées sans lui.",
    "admin.competitionPlayers.carryForward": "Report",
    "admin.carryForward.title": "Report - {name}",
    "admin.carryForward.save": "Enregistrer",
    "admin.carryForward.otherwise": "Ce report ne peut pas être enregistré.",
    "admin.carryForward.matchWins": "Matchs gagnés",
    "admin.carryForward.matchLosses": "Matchs perdus",
    "admin.carryForward.gameWins": "Parties gagnées",
    "admin.carryForward.gameLosses": "Parties perdues",
    "admin.carryForward.hoopsFor": "Arceaux pour",
    "admin.carryForward.hoopsAgainst": "Arceaux contre",
    "CarryForward.MatchWinsNotWhole":
      "Saisissez un nombre entier de matchs gagnés.",
    "CarryForward.MatchWinsBelowZero": "Saisissez 0 match gagné ou plus.",
    "CarryForward.MatchLossesNotWhole":
      "Saisissez un nombre entier de matchs perdus.",
    "CarryForward.MatchLossesBelowZero": "Saisissez 0 match perdu ou plus.",
    "CarryForward.GameWinsNotWhole":
      "Saisissez un nombre entier de parties gagnées.",
    "CarryForward.GameWinsBelowZero": "Saisissez 0 partie gagnée ou plus.",
    "CarryForward.GameLossesNotWhole":
      "Saisissez un nombre entier de parties perdues.",
    "CarryForward.GameLossesBelowZero": "Saisissez 0 partie perdue ou plus.",
    "CarryForward.HoopsForNotWhole":
      "Saisissez un nombre entier d’arceaux pour.",
    "CarryForward.HoopsForBelowZero": "Saisissez 0 arceau pour ou plus.",
    "CarryForward.HoopsAgainstNotWhole":
      "Saisissez un nombre entier d’arceaux contre.",
    "CarryForward.HoopsAgainstBelowZero": "Saisissez 0 arceau contre ou plus.",
    "admin.scores.add": "Ajouter un résultat",
    "admin.scores.none": "Aucun résultat",
    "admin.scores.edit": "Modifier",
    "admin.scores.drawNotFilledTitle": "Tableau incomplet",
    "admin.scores.archive": "Archiver",
    "admin.scores.up": "Monter",
    "admin.scores.down": "Descendre",
    "admin.scores.restore": "Restaurer",
    "admin.scores.archived": "Résultats archivés",
    "admin.scores.archivedSaid": "Archivé",
    "admin.scores.withdraw": "Retirer",
    "admin.scores.unwithdraw": "Annuler le retrait",
    "admin.scores.withdrawnSaid": "Retiré",
    "admin.scores.otherwise": "Impossible à faire.",
    "admin.score.title": "Ajouter un résultat",
    "admin.score.add": "Ajouter la partie",
    "admin.score.winner": "Vainqueur",
    "admin.score.winnerScore": "Points du vainqueur",
    "admin.score.loser": "Perdant",
    "admin.score.loserScore": "Points du perdant",
    "admin.score.beat": "a battu",
    "admin.score.added":
      "La partie que {winner} a gagnée contre {loser} a été ajoutée.",
    "admin.score.otherwise": "La partie n’a pas pu être ajoutée.",
    "admin.score.correctTitle": "Modifier le résultat",
    "admin.score.save": "Enregistrer",
    "admin.score.notCorrected": "Le résultat n’a pas pu être corrigé.",
    "Game.WinnerMissing": "Choisissez le vainqueur.",
    "Game.WinnerScoreMissing": "Saisissez les points du vainqueur.",
    "Game.LoserMissing": "Choisissez le perdant.",
    "Game.LoserScoreMissing": "Saisissez les points du perdant.",
    "Score.NoPoints": "Les points commencent par un nombre.",
    "Game.SamePlayer": "Personne ne joue contre soi-même.",
    "Game.WinnerNotAhead":
      "Le vainqueur doit avoir plus de points que le perdant, ou être marqué comme vainqueur.",
    "Game.LoserMarked":
      "Les points du perdant ne peuvent pas être marqués comme gagnés.",
    "Game.ResultChanged":
      "Une correction conserve le résultat : une partie gagnée reste gagnée, et une partie nulle reste nulle.",
    "Competition.MatchDecided": "Leur match est déjà décidé.",
    "Competition.DrawFull":
      "Le joueur ne peut pas être ajouté car le tableau est plein.",
    "Competition.DrawNotFilled":
      "Aucun résultat ne peut être ajouté tant que chaque place du tableau n’a pas un joueur ou un exempt.",
    "Competition.ByeOutsideKnockout":
      "Seule une élimination directe peut avoir des exempts.",
    "Competition.NotDrawnToMeet": "Ils ne sont pas censés se rencontrer.",
    "Competition.WinnerHasPlayedOn":
      "Le vainqueur de ce match a déjà joué sa partie suivante ; on ne peut donc pas changer qui l’a gagné.",
    "CompetitionPlayer.Withdrawn": "Un joueur forfait ne joue plus.",
    "admin.players.add": "Ajouter un joueur",
    "admin.players.none": "Aucun joueur",
    "admin.players.edit": "Modifier",
    "admin.players.archive": "Archiver",
    "admin.players.restore": "Restaurer",
    "admin.players.up": "Monter",
    "admin.players.down": "Descendre",
    "admin.players.archiveTitle": "Archiver un joueur",
    "admin.players.archiveQuestion": "{name} sera retiré de ces compétitions :",
    "admin.players.archive.explanation":
      "Restaurer le joueur ne le remettra pas dans ces compétitions.",
    "admin.players.archived": "Joueurs archivés",
    "admin.players.archivedSaid": "Archivé",
    "admin.player.addTitle": "Ajouter un joueur",
    "admin.player.editTitle": "Modifier le joueur",
    "admin.player.name": "Nom",
    "admin.player.representing": "Représente",
    "admin.player.worldRankingName": "Nom dans le classement mondial",
    "admin.player.worldRankingKnown": "Le classement mondial connaît ce nom.",
    "admin.player.worldRankingQuestioned":
      "Le classement mondial n’a aucun joueur de ce nom. Il est peut-être mal orthographié, ou le joueur est nouveau dans le classement.",
    "admin.player.flag": "Drapeau",
    "admin.player.add": "Ajouter",
    "admin.player.save": "Enregistrer",
    "admin.player.added": "{name} a été ajouté.",
    "admin.player.otherwise":
      "Ce joueur ne peut pas être enregistré en l’état.",
    "Tournament.PlayerNameTaken":
      "Un autre joueur de ce tournoi porte déjà ce nom.",
    "TournamentPlayer.NoSuchFlag": "Choisissez l’un des drapeaux proposés.",
    "TournamentPlayer.NamedBye": "Un joueur ne peut pas s’appeler Exempt.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    "admin.player.byesTitle": "Les exempts ne s’ajoutent pas",
    "admin.player.byes":
      "Un exempt n’est pas un joueur du tournoi. Une élimination directe propose Exempt quand on ajoute ses joueurs, autant de fois que son tableau en a besoin.",
    "admin.view.teams": "Équipes",
    "admin.view.tests": "Tests",
    "admin.teams.add": "Ajouter une équipe",
    "admin.teams.none": "Aucune équipe",
    "admin.teams.edit": "Modifier",
    "admin.teams.view": "Voir",
    "admin.teams.archive": "Archiver",
    "admin.teams.restore": "Restaurer",
    "admin.teams.up": "Monter",
    "admin.teams.down": "Descendre",
    "admin.teams.archived": "Équipes archivées",
    "admin.teams.archivedSaid": "Archivée",
    "admin.team.addTitle": "Ajouter une équipe",
    "admin.team.editTitle": "Modifier l’équipe",
    "admin.team.name": "Nom",
    "admin.team.shortName": "Nom court",
    "admin.team.shortName.explanation":
      "Comment les tests de l’équipe sont nommés, comme AUS c. ENG.",
    "admin.team.flag": "Drapeau",
    "admin.team.add": "Ajouter",
    "admin.team.save": "Enregistrer",
    "admin.team.added": "{name} a été ajoutée.",
    "admin.team.otherwise":
      "Cette équipe ne peut pas être enregistrée en l’état.",
    "admin.teamView.otherwise":
      "Cette équipe ne peut pas être consultée d’ici.",
    "admin.teamView.players": "Joueurs",
    "TeamName.Missing": "Indiquez le nom de l’équipe.",
    "TeamName.TooLong": "Ce nom est trop long.",
    "admin.notes.add": "Ajouter une note",
    "admin.notes.none": "Aucune note",
    "admin.notes.edit": "Modifier",
    "admin.notes.delete": "Supprimer",
    "admin.notes.deleteTitle": "Supprimer la note",
    "admin.notes.deleteQuestion": "Supprimer la note « {title} » ?",
    "admin.notes.delete.explanation":
      "Une note supprimée disparaît pour toujours et ne peut pas être récupérée.",
    "admin.notes.otherwise": "Impossible à faire.",
    "admin.note.addTitle": "Ajouter une note",
    "admin.note.editTitle": "Modifier la note",
    "admin.note.title": "Titre",
    "admin.note.description": "Description",
    "admin.note.write": "Écrire",
    "admin.note.preview": "Aperçu",
    "admin.note.toolbar": "Mise en forme",
    "admin.note.tool.heading": "Titre de section",
    "admin.note.tool.bold": "Gras",
    "admin.note.tool.italic": "Italique",
    "admin.note.tool.quote": "Citation",
    "admin.note.tool.code": "Code",
    "admin.note.tool.link": "Lien",
    "admin.note.tool.numberedList": "Liste numérotée",
    "admin.note.tool.bulletedList": "Liste à puces",
    "admin.note.tool.taskList": "Liste de tâches",
    "admin.note.add": "Ajouter",
    "admin.note.save": "Enregistrer",
    "admin.note.otherwise": "Cette note ne peut pas être enregistrée ainsi.",
    "ManagerNoteTitle.Missing": "Donnez un titre à la note.",
    "ManagerNoteTitle.TooLong": "Ce titre est trop long.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un titre doit contenir une lettre ou un chiffre.",
    "ManagerNoteDescription.TooLong": "Cette description est trop longue.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Cette note n’existe plus. Un autre organisateur l’a peut-être supprimée.",
    "EditManagerNote.NoSuchManagerNote":
      "Cette note n’existe plus. Un autre organisateur l’a peut-être supprimée.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Cette note n’existe plus. Un autre organisateur l’a peut-être supprimée.",
    "ManagerNote.Deleted":
      "Cette note a été supprimée. Un autre organisateur l’a peut-être supprimée.",
    "CommentaryTitle.Missing": "Donnez un titre au commentaire.",
    "CommentaryTitle.TooLong": "Ce titre est trop long.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un titre doit contenir une lettre ou un chiffre.",
    "Commentary.TitleTaken": "Un autre commentaire porte déjà ce titre.",
    "CommentText.Missing": "Écrivez quelque chose dans le commentaire.",
    "CommentText.TooLong": "Ce commentaire est trop long.",
    "TeamShortName.Missing": "Donnez un nom court à l’équipe.",
    "TeamShortName.TooLong": "Un nom court comporte au plus 10 caractères.",
    "TeamShortName.NoLetterOrDigit":
      "Un nom court doit contenir une lettre ou un chiffre.",
    "Team.ShortNameLongerThanName":
      "Un nom court ne peut pas être plus long que le nom de l’équipe.",
    "Team.NoSuchFlag": "Choisissez l’un des drapeaux proposés.",
    "Team.Archived":
      "Cette équipe est archivée ; il faut d’abord la restaurer.",
    "Team.InATest":
      "Cette équipe joue dans un test et ne peut pas être archivée.",
    "Team.PlayerNameTaken":
      "Un autre joueur de cette équipe porte déjà ce nom.",
    "TeamPlayer.NamedBye": "Un joueur ne peut pas s’appeler Exempt.",
    "TeamPlayer.Archived":
      "Ce joueur est archivé ; il faut d’abord le restaurer.",
    "TeamPlayer.HasGames": "Ce joueur a joué et ne peut pas être archivé.",
    "Tournament.TeamNameTaken":
      "Une autre équipe de ce tournoi porte déjà ce nom.",
    "Tournament.TeamShortNameTaken":
      "Une autre équipe de ce tournoi porte déjà ce nom court.",
    "Tournament.NoSuchTeam": "Ce tournoi n’a aucune équipe à cette adresse.",
    "Tournament.TeamArchived":
      "Cette équipe est archivée et ne peut être restaurée que depuis l’onglet Équipes.",
    "admin.tests.add": "Ajouter un test",
    "admin.tests.none": "Aucun test",
    "admin.tests.edit": "Modifier",
    "admin.tests.view": "Voir",
    "admin.tests.archive": "Archiver",
    "admin.tests.restore": "Restaurer",
    "admin.tests.up": "Monter",
    "admin.tests.down": "Descendre",
    "admin.tests.archived": "Tests archivés",
    "admin.tests.twoTeamsNeeded":
      "Un test oppose deux équipes ; il faut donc d’abord deux équipes.",
    "admin.tests.toTeams": "Aller aux Équipes",
    "admin.tests.matches.one": "{count} match",
    "admin.tests.matches.other": "{count} matchs",
    "admin.tests.bestOf": "au meilleur des {games}",
    "admin.tests.otherwise": "Impossible à faire.",
    "admin.test.addTitle": "Ajouter un test",
    "admin.test.editTitle": "Modifier le test",
    "admin.test.firstTeam": "Équipe A",
    "admin.test.secondTeam": "Équipe B",
    "admin.test.versus": "c.",
    "admin.test.starts": "Début",
    "admin.test.finishes": "Fin",
    "admin.test.expectedMatches": "Matchs prévus",
    "admin.test.bestOf": "Au meilleur des",
    "admin.test.group": "Groupe",
    "admin.test.add": "Ajouter",
    "admin.test.save": "Enregistrer",
    "admin.test.added": "{name} a été ajouté.",
    "admin.test.otherwise": "Ce test ne peut pas être enregistré en l’état.",
    "admin.testView.otherwise": "Ce test ne peut pas être consulté d’ici.",
    "AddTest.FirstTeamMissing": "Choisissez la première équipe.",
    "AddTest.SecondTeamMissing": "Choisissez la deuxième équipe.",
    "UpdateTest.FirstTeamMissing": "Choisissez la première équipe.",
    "UpdateTest.SecondTeamMissing": "Choisissez la deuxième équipe.",
    "ExpectedMatches.NotWhole": "Saisissez un nombre entier de matchs.",
    "ExpectedMatches.TooSmall": "Un test doit prévoir au moins 1 match.",
    "TestGroup.TooLong": "Ce groupe est trop long.",
    "Tournament.TestAgainstItself":
      "Une équipe ne joue pas un test contre elle-même.",
    "Tournament.TestFinishesBeforeStarts":
      "Un test ne peut pas finir avant de commencer.",
    "Tournament.TestStartsBeforeTournament":
      "Un test ne peut pas commencer avant son tournoi.",
    "Tournament.TestFinishesAfterTournament":
      "Un test ne peut pas finir après son tournoi.",
    "Tournament.TestHasGamesInUse":
      "Ce test a des parties ; il ne peut donc pas être archivé tant qu’elles ne le sont pas.",
    "Tournament.TestHasGames":
      "Ce test a déjà des parties ; ses équipes ne peuvent donc plus être changées.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Plus de matchs que cela ont déjà commencé.",
    "Tournament.BestOfBelowGamesPlayed":
      "Deux joueurs ont déjà joué plus de parties que cela.",
    "Competition.ExpectedMatchesReached":
      "Ce test a déjà commencé tous les matchs qu’il prévoit.",
    "Competition.SameTeam":
      "Deux joueurs de la même équipe ne jouent pas l’un contre l’autre.",
    "AddManager.NoSuchAccount":
      "Cette adresse n’a aucun compte qui puisse devenir gestionnaire.",
    "Account.NotAnAdministrator": "Seul un administrateur peut faire cela.",
    "AddRole.NoSuchAccount":
      "Cette adresse n’a aucun compte à qui le rôle puisse être donné.",
    "AddRole.NoSuchRole": "Ce rôle n’existe pas.",
    "RemoveRole.NoSuchAccount": "Ce compte n’existe pas.",
    "RemoveRole.NoSuchRole": "Ce rôle n’existe pas.",
    "RemoveRole.Yourself":
      "Vous ne pouvez pas vous retirer vous-même le rôle d’administrateur.",
    "AccountsWithRole.NoSuchRole": "Ce rôle n’existe pas.",
    "admin.scorers.add": "Ajouter un marqueur",
    "admin.scorers.none": "Aucun marqueur",
    "admin.scorers.removeTitle": "Retirer un marqueur",
    "admin.scorers.removeExplanation":
      "{name} ne pourra plus saisir les résultats de ce tournoi.",
    "admin.scorers.otherwise": "Cette adresse ne peut pas devenir marqueur.",
    "AddScorer.NoSuchAccount":
      "Cette adresse n’a aucun compte qui puisse devenir marqueur.",
    "Tournament.AlreadyAManager":
      "Ce compte gère déjà le tournoi et peut faire tout ce que fait un marqueur.",

    "TournamentName.Missing": "Indiquez le nom du tournoi.",
    "TournamentName.TooShort": "Ce nom est trop court.",
    "TournamentName.TooLong": "Ce nom est trop long.",
    "TournamentName.AllLowerCase": "Un nom ne s’écrit pas tout en minuscules.",
    "TournamentName.AllCapitals": "Un nom ne s’écrit pas tout en majuscules.",
    "TournamentName.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    "ReadOnlyDate.Unreadable": "Indiquez le jour.",
    "Tournament.FinishesBeforeStarts":
      "Un tournoi ne peut pas finir avant de commencer.",
    "Tournament.StartsAfterNextYear":
      "Un tournoi ne peut pas commencer après l’année prochaine.",
    "Tournament.FinishesAfterNextYear":
      "Un tournoi ne peut pas finir après l’année prochaine.",
    "CreateTournament.NoSuchCountry": "Choisissez le pays.",
    "TournamentSubtitle.TooLong":
      "Le sous-titre peut comporter au plus 2000 caractères.",
    "Tournament.NotAManager":
      "Seul un gestionnaire de ce tournoi peut le modifier.",
    "Tournament.NotAManagerOrScorer":
      "Seul un gestionnaire ou un marqueur de ce tournoi peut le consulter.",
    "Tournament.Archived":
      "Ce tournoi est archivé ; il faut le restaurer avant de pouvoir le modifier.",
    "UpdateTournament.NoSuchTournament":
      "Il n’y a aucun tournoi à cette adresse.",

    // The sports keep the names their players use in French, and the formats
    // named for a competition keep its name, as a name is not translated.
    "sport.ac": "Croquet association",
    "sport.gc": "Croquet golf",
    "sport.a6w": "Croquet américain à 6 arceaux",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Par équipes",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorre",
    "country.ae": "Émirats arabes unis",
    "country.af": "Afghanistan",
    "country.ag": "Antigua-et-Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanie",
    "country.am": "Arménie",
    "country.ao": "Angola",
    "country.ar": "Argentine",
    "country.as": "Samoa américaines",
    "country.at": "Autriche",
    "country.au": "Australie",
    "country.aw": "Aruba",
    "country.ax": "Îles Åland",
    "country.az": "Azerbaïdjan",
    "country.ba": "Bosnie-Herzégovine",
    "country.bb": "Barbade",
    "country.bd": "Bangladesh",
    "country.be": "Belgique",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarie",
    "country.bh": "Bahreïn",
    "country.bi": "Burundi",
    "country.bj": "Bénin",
    "country.bm": "Bermudes",
    "country.bn": "Brunei",
    "country.bo": "Bolivie",
    "country.br": "Brésil",
    "country.bs": "Bahamas",
    "country.bt": "Bhoutan",
    "country.bv": "Île Bouvet",
    "country.bw": "Botswana",
    "country.by": "Biélorussie",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalogne",
    "country.cc": "Îles Cocos",
    "country.cd": "République démocratique du Congo",
    "country.cf": "République centrafricaine",
    "country.cg": "République du Congo",
    "country.ch": "Suisse",
    "country.ci": "Côte d’Ivoire",
    "country.ck": "Îles Cook",
    "country.cl": "Chili",
    "country.cm": "Cameroun",
    "country.cn": "Chine",
    "country.co": "Colombie",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Cap-Vert",
    "country.cx": "Île Christmas",
    "country.cy": "Chypre",
    "country.cz": "Tchéquie",
    "country.de": "Allemagne",
    "country.dj": "Djibouti",
    "country.dk": "Danemark",
    "country.dm": "Dominique",
    "country.do": "République dominicaine",
    "country.dz": "Algérie",
    "country.ec": "Équateur",
    "country.ee": "Estonie",
    "country.eg": "Égypte",
    "country.eh": "Sahara occidental",
    "country.england": "Angleterre",
    "country.er": "Érythrée",
    "country.es": "Espagne",
    "country.et": "Éthiopie",
    "country.fi": "Finlande",
    "country.fj": "Fidji",
    "country.fk": "Îles Malouines",
    "country.fm": "Micronésie",
    "country.fo": "Îles Féroé",
    "country.fr": "France",
    "country.ga": "Gabon",
    "country.gb": "Royaume-Uni",
    "country.gd": "Grenade",
    "country.ge": "Géorgie",
    "country.gf": "Guyane",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenland",
    "country.gm": "Gambie",
    "country.gn": "Guinée",
    "country.gp": "Guadeloupe",
    "country.gq": "Guinée équatoriale",
    "country.gr": "Grèce",
    "country.gs": "Géorgie du Sud et îles Sandwich du Sud",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinée-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Îles Heard et McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croatie",
    "country.ht": "Haïti",
    "country.hu": "Hongrie",
    "country.id": "Indonésie",
    "country.ie": "Irlande",
    "country.il": "Israël",
    "country.im": "Île de Man",
    "country.in": "Inde",
    "country.io": "Territoire britannique de l’océan Indien",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Islande",
    "country.it": "Italie",
    "country.je": "Jersey",
    "country.jm": "Jamaïque",
    "country.jo": "Jordanie",
    "country.jp": "Japon",
    "country.ke": "Kenya",
    "country.kg": "Kirghizistan",
    "country.kh": "Cambodge",
    "country.ki": "Kiribati",
    "country.km": "Comores",
    "country.kn": "Saint-Christophe-et-Niévès",
    "country.kp": "Corée du Nord",
    "country.kr": "Corée du Sud",
    "country.kw": "Koweït",
    "country.ky": "Îles Caïmans",
    "country.kz": "Kazakhstan",
    "country.la": "Laos",
    "country.lb": "Liban",
    "country.lc": "Sainte-Lucie",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Lituanie",
    "country.lu": "Luxembourg",
    "country.lv": "Lettonie",
    "country.ly": "Libye",
    "country.ma": "Maroc",
    "country.mc": "Monaco",
    "country.md": "Moldavie",
    "country.me": "Monténégro",
    "country.mg": "Madagascar",
    "country.mh": "Îles Marshall",
    "country.mk": "Macédoine du Nord",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolie",
    "country.mo": "Macao",
    "country.mp": "Îles Mariannes du Nord",
    "country.mq": "Martinique",
    "country.mr": "Mauritanie",
    "country.ms": "Montserrat",
    "country.mt": "Malte",
    "country.mu": "Maurice",
    "country.mv": "Maldives",
    "country.mw": "Malawi",
    "country.mx": "Mexique",
    "country.my": "Malaisie",
    "country.mz": "Mozambique",
    "country.na": "Namibie",
    "country.nc": "Nouvelle-Calédonie",
    "country.ne": "Niger",
    "country.nf": "Île Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Pays-Bas",
    "country.no": "Norvège",
    "country.np": "Népal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nouvelle-Zélande",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Pérou",
    "country.pf": "Polynésie française",
    "country.pg": "Papouasie-Nouvelle-Guinée",
    "country.ph": "Philippines",
    "country.pk": "Pakistan",
    "country.pl": "Pologne",
    "country.pm": "Saint-Pierre-et-Miquelon",
    "country.pn": "Îles Pitcairn",
    "country.pr": "Porto Rico",
    "country.ps": "Palestine",
    "country.pt": "Portugal",
    "country.pw": "Palaos",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "La Réunion",
    "country.ro": "Roumanie",
    "country.rs": "Serbie",
    "country.ru": "Russie",
    "country.rw": "Rwanda",
    "country.sa": "Arabie saoudite",
    "country.sb": "Îles Salomon",
    "country.sc": "Seychelles",
    "country.scotland": "Écosse",
    "country.sd": "Soudan",
    "country.se": "Suède",
    "country.sg": "Singapour",
    "country.sh": "Sainte-Hélène",
    "country.si": "Slovénie",
    "country.sj": "Svalbard et Jan Mayen",
    "country.sk": "Slovaquie",
    "country.sl": "Sierra Leone",
    "country.sm": "Saint-Marin",
    "country.sn": "Sénégal",
    "country.so": "Somalie",
    "country.sr": "Suriname",
    "country.st": "Sao Tomé-et-Principe",
    "country.sv": "Salvador",
    "country.sy": "Syrie",
    "country.sz": "Eswatini",
    "country.tc": "Îles Turks et Caïques",
    "country.td": "Tchad",
    "country.tf": "Terres australes françaises",
    "country.tg": "Togo",
    "country.th": "Thaïlande",
    "country.tj": "Tadjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor oriental",
    "country.tm": "Turkménistan",
    "country.tn": "Tunisie",
    "country.to": "Tonga",
    "country.tr": "Turquie",
    "country.tt": "Trinité-et-Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taïwan",
    "country.tz": "Tanzanie",
    "country.ua": "Ukraine",
    "country.ug": "Ouganda",
    "country.um": "Îles mineures éloignées des États-Unis",
    "country.us": "États-Unis",
    "country.uy": "Uruguay",
    "country.uz": "Ouzbékistan",
    "country.va": "Vatican",
    "country.vc": "Saint-Vincent-et-les-Grenadines",
    "country.ve": "Venezuela",
    "country.vg": "Îles Vierges britanniques",
    "country.vi": "Îles Vierges des États-Unis",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Pays de Galles",
    "country.wf": "Wallis-et-Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yémen",
    "country.yt": "Mayotte",
    "country.za": "Afrique du Sud",
    "country.zm": "Zambie",
    "country.zw": "Zimbabwe",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject":
      "Confirmez votre adresse e-mail pour {siteName}",
    "Email.ConfirmAddress.body": `
<p>Bonjour,</p>

<p>
    Merci d’avoir créé un compte sur <strong>{siteName}</strong>.<br />
    Avant de commencer à utiliser votre compte, confirmez votre adresse e-mail
    en cliquant sur le bouton ci-dessous :
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
        Confirmer mon adresse e-mail
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi confirmer votre adresse e-mail en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si vous n’avez pas créé ce compte, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un nouveau lien pour confirmer votre adresse e-mail pour {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Bonjour,</p>

<p>
    Vous avez demandé récemment un nouvel e-mail pour confirmer votre adresse e-mail pour <strong>{siteName}</strong>.<br />
    Confirmez votre adresse e-mail en cliquant sur le bouton ci-dessous :
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
        Confirmer mon adresse e-mail
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi confirmer votre adresse e-mail en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Une fois confirmée, vous pourrez continuer à utiliser votre compte sans interruption.
</p>

<p>
    Si vous n’avez pas demandé cet e-mail, vous pouvez l’ignorer sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Quelqu’un a essayé de s’inscrire avec votre adresse e-mail",
    "Email.AlreadyRegistered.body": `
<p>Bonjour,</p>

<p>
    Quelqu’un a essayé de s’inscrire sur <strong>{siteName}</strong> avec cette
    adresse e-mail, qui a déjà un compte. Rien n’a changé dans votre compte.<br />
    Si c’était vous, vous avez déjà un compte et pouvez vous y connecter :
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
        Se connecter
    </a>
</p>

<p>
    Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser ici :
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
        J’ai oublié mon mot de passe
    </a>
</p>

<p>
    Si ce n’était pas vous, vous n’avez rien à faire. Personne n’a reçu de
    moyen d’accéder à votre compte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirmez le déplacement de votre compte {siteName} vers cette adresse",
    "Email.ConfirmNewEmailAddress.body": `
<p>Bonjour,</p>

<p>
    Quelqu’un connecté à un compte <strong>{siteName}</strong> a demandé à le
    déplacer vers cette adresse e-mail. Si c’était vous, confirmez-le ici,
    en étant connecté à ce compte. Le lien fonctionne pendant 24 heures.
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
        Déplacer mon compte
    </a>
</p>

<p>
    Ou copiez cette adresse dans votre navigateur :<br />
    {link}
</p>

<p>
    Si ce n’était pas vous, vous n’avez rien à faire. Aucun compte ne sera déplacé ici.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Quelqu’un a demandé à déplacer un compte vers votre adresse e-mail",
    "Email.AlreadyHasAnAccount.body": `
<p>Bonjour,</p>

<p>
    Quelqu’un connecté à un compte <strong>{siteName}</strong> a demandé à le
    déplacer vers cette adresse e-mail, qui a déjà son propre compte. Rien n’a
    été déplacé, et rien n’a changé dans votre compte.
</p>

<p>
    Si c’était vous, vous avez déjà un compte à cette adresse et pouvez vous
    y connecter.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Votre compte {siteName} a été déplacé",
    "Email.EmailAddressChanged.body": `
<p>Bonjour,</p>

<p>
    Votre compte <strong>{siteName}</strong> vient d’être déplacé vers une autre
    adresse e-mail, {emailAddress}, et c’est désormais avec cette adresse
    qu’on s’y connecte.
</p>

<p>
    Si ce n’était pas vous, quelqu’un d’autre a accès à votre compte. Répondez à
    cet e-mail pour nous le dire.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Votre mot de passe {siteName} a été changé",
    "Email.PasswordChanged.body": `
<p>Bonjour,</p>

<p>
    Le mot de passe de votre compte <strong>{siteName}</strong> vient d’être changé,
    et vous avez été déconnecté de tous les autres navigateurs où vous étiez connecté.<br />
    Si c’était vous, vous n’avez rien à faire.
</p>

<p>
    Si ce n’était pas vous, quelqu’un d’autre a votre mot de passe. Définissez-en
    un nouveau ici et cette personne sera déconnectée :
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
        J’ai oublié mon mot de passe
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Définissez un nouveau mot de passe pour {siteName}",
    "Email.SetNewPassword.body": `
<p>Bonjour,</p>

<p>
    Vous avez demandé récemment à réinitialiser votre mot de passe <strong>{siteName}</strong>.<br />
    Vous pouvez le réinitialiser en cliquant sur le bouton ci-dessous :
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
        Réinitialiser le mot de passe
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi réinitialiser votre mot de passe en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si vous n’avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Définissez un mot de passe pour {siteName}",
    "Email.SetPassword.body": `
<p>Bonjour,</p>

<p>
    Votre compte <strong>{siteName}</strong> n’a pas de mot de passe : vous vous connectez avec Google.<br />
    Vous avez demandé à en définir un, pour pouvoir aussi vous connecter avec votre adresse e-mail et un mot de passe.
    Vous pouvez le définir en cliquant sur le bouton ci-dessous :
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
        Définir un mot de passe
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi définir votre mot de passe en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Le lien fonctionne pendant une heure. Si vous n’avez pas demandé à définir un mot de passe, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Il n’y a aucun compte {siteName} pour cette adresse e-mail",
    "Email.RegisterInstead.body": `
<p>Bonjour,</p>

<p>
    La réinitialisation du mot de passe a été demandée pour une adresse e-mail
    qui n’est associée à aucun compte <strong>{siteName}</strong>.
</p>

<p>
    Si vous souhaitez utiliser notre service, vous pouvez créer un nouveau compte ici :<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirmez que vous voulez que votre compte {siteName} soit oublié",
    "Email.ConfirmForgetting.body": `
<p>Bonjour,</p>

<p>
    Vous avez demandé que votre compte <strong>{siteName}</strong> soit oublié.<br />
    Cliquez sur le bouton ci-dessous pour voir ce que cela signifie, et pour
    confirmer en toute sécurité que c’est bien ce que vous voulez :
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
        Oublier mon compte
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi ouvrir ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Une fois oublié, plus personne ne pourra relire votre nom ni votre adresse
    e-mail, et il sera impossible de se connecter à votre compte. Cela ne peut
    pas être annulé.
</p>

<p>
    Le lien ne fonctionne qu’une seule fois, jusqu’à 15 minutes après votre
    demande, et seulement tant que vous êtes connecté à ce compte. Passé ce
    délai, redemandez-le depuis votre compte.
</p>

<p>
    Si ce n’est pas vous qui l’avez demandé, il ne se passera rien tant que
    personne ne suit le lien. Cela dit, la demande a été faite par quelqu’un
    de connecté à votre compte ; définissez donc un nouveau mot de passe depuis
    la page du mot de passe oublié pour vous assurer que cette personne ne
    puisse plus s’y connecter.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Les inscriptions sont suspendues : {service} est injoignable",
    "Email.RegistrationsSuspended.body": `
<p>Bonjour,</p>

<p>
    {siteName} n’a pas pu joindre {service} à {when}. Tant qu’il ne répond pas,
    les personnes qui en ont besoin, pour s’inscrire ou pour définir un nouveau
    mot de passe, se voient dire de réessayer plus tard.
</p>

<p>
    Il n’y a rien à débloquer. Chaque tentative interroge de nouveau {service}, et les
    pages refonctionnent dès qu’il répond.
</p>

<p>
    Tant que {service} ne répond pas, vous recevrez au plus un e-mail par
    heure à ce sujet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
