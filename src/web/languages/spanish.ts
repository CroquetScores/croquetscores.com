// The site's words in neutral international Spanish. Decisions a reader of this
// file needs:
// - The reader is addressed as "tú" (never "vos" or "usted"), with the
//   imperative in the "tú" form and no regionalisms.
// - Buttons, menu items, tabs and headings are written as Spanish writes them:
//   a capital for the first word only ("Cambiar contraseña"), not for each word.
// - "Email address" is "dirección de correo electrónico", and "email" is
//   "correo electrónico" or "correo".
// - A game is a "partida" and a match a "partido"; hoops are "aros"; "Test"
//   and "Bye" stay as croquet says them. A commentary is a "crónica" and a
//   comment a "comentario".
// - A withdrawn player is "retirado", and a withdrawn game "retirada".
import type { Language } from "../common/language.js";

export const spanish: Language = {
  tag: "es",
  name: "Español",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Saltar al contenido",
    "navigation.menu": "Menú",
    "navigation.label": "Principal",
    "navigation.home": "Inicio",
    "navigation.help": "Ayuda",
    "navigation.admin": "Administración",
    "sections.label": "Secciones",
    "theme.label": "Tema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Del sistema",
    "footer.donate": "Donar",
    "footer.plea":
      "¿Te gusta {siteName}? Por favor, haz una donación para ayudar a seguir desarrollándolo.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacidad",
    "footer.termsOfUse": "Condiciones de uso",
    "footer.reportBug": "Informar de un error",
    "beta.banner":
      "Este es un sitio beta. Los datos pueden restablecerse en cualquier momento.",
    "privacy.contact":
      "Preguntas sobre esta página o sobre lo que se guarda de ti: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "Acepto las condiciones de uso",
    "termsOfUse.link": "condiciones de uso",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "Denuncia lo que se ha escrito o consulta sobre estas condiciones: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Marca la casilla para aceptar las condiciones de uso.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Este es un lugar seguro para aprender a usar {siteName}. Todo lo que se introduzca aquí puede eliminarse en cualquier momento.",

    "language.label": "Idioma",
    "language.choose": "Cambiar",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Hay una novedad para leer.",
    "whatsNew.admin.message": "Hay una novedad para quienes organizan torneos.",
    "whatsNew.view": "Ver las novedades",
    "whatsNew.later": "Recordármelo la próxima vez",
    "whatsNew.never": "No volver a mostrarme este aviso",

    "form.otherwise":
      "Algo no está bien. Revisa lo que has introducido e inténtalo de nuevo.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "Cuenta",
    "account.register": "Registrarse",
    "account.signIn": "Iniciar sesión",
    "account.forgotPassword": "Olvidé mi contraseña",
    "account.signOut": "Cerrar sesión",
    "account.profile": "Perfil",
    "account.changePassword": "Cambiar contraseña",
    "account.changeEmailAddress": "Cambiar dirección de correo electrónico",
    "account.changeName": "Cambiar nombre",
    "account.setPassword": "Establecer contraseña",
    "account.forgetAccount": "Olvidar cuenta",

    "register.title": "Registrarse",
    "register.emailAddress": "Dirección de correo electrónico",
    "register.submit": "Registrarse",
    "register.withGoogle": "Registrarse con Google",
    "register.or": "o",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google no ha confirmado que esa dirección de correo electrónico sea tuya, así que aquí no se puede usar con Google. Usa en su lugar tu dirección de correo electrónico, más abajo.",
    "SignInWithGoogle.LinkedToAnother":
      "Esa dirección de correo electrónico ya tiene una cuenta, vinculada a otra cuenta de Google. Inicia sesión con esa cuenta de Google, o con tu dirección de correo electrónico y tu contraseña.",
    "SignInWithGoogle.NameMissing":
      "Google no nos ha dicho tu nombre, y una cuenta necesita uno. Usa en su lugar tu dirección de correo electrónico, más abajo.",
    "Google.Unreachable":
      "No se ha podido contactar con Google en este momento. Inténtalo de nuevo dentro de unos minutos, o usa tu dirección de correo electrónico, más abajo.",
    "Registration.NotAPerson":
      "Esto no parece haber sido enviado por una persona. Inténtalo de nuevo y, si sigue ocurriendo, espera unos minutos y vuelve.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Introduce una dirección de correo electrónico.",
    "EmailAddress.NoAt": "Una dirección de correo electrónico lleva una @.",
    "EmailAddress.MoreThanOneAt":
      "Una dirección de correo electrónico lleva una sola @.",
    "EmailAddress.NoDomain":
      "Una dirección de correo electrónico lleva un dominio después de la @, como example.com.",

    "welcome.title": "Revisa tu correo",
    "welcome.checkEmail":
      "Va de camino un correo a la dirección que indicaste. Sigue el enlace que contiene para continuar.",
    "welcome.nothingArrived":
      "Si no llega nada en unos minutos, mira en la carpeta de correo no deseado o spam.",
    "welcome.home": "Volver a {siteName}",
    "newConfirmationLink.title": "Obtener un enlace nuevo",
    "newConfirmationLink.explanation":
      "El enlace para confirmar tu dirección de correo electrónico ha caducado. Pide uno nuevo y se enviará a la dirección con la que te registraste.",
    "newConfirmationLink.send": "Enviarme un enlace nuevo",
    "newConfirmationLink.home": "Volver a {siteName}",
    "newConfirmationLink.signIn": "Iniciar sesión",
    "newConfirmationLink.sent.title": "Revisa tu correo",
    "newConfirmationLink.sent.explanation":
      "Va de camino un enlace nuevo. Síguelo para confirmar tu dirección de correo electrónico. Si no llega nada en unos minutos, mira en la carpeta de correo no deseado o spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Esa dirección de correo electrónico ya está confirmada",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "No hay nada más que confirmar. Inicia sesión con la contraseña que indicaste al confirmarla.",
    "newConfirmationLink.noLongerWorks.title": "Ese enlace ya no funciona",
    "newConfirmationLink.noLongerWorks.explanation":
      "Comprueba que has seguido el enlace completo del correo, sin que falte nada al final. Si sigue sin funcionar, regístrate de nuevo y se enviará un enlace nuevo.",
    "newConfirmationLink.tooMany.title": "Inténtalo más tarde",
    "newConfirmationLink.tooMany.explanation":
      "Se han enviado varios enlaces a esta dirección últimamente. Espera una hora y vuelve a pedirlo, y mientras tanto mira en la carpeta de correo no deseado o spam.",

    "forgotPassword.title": "¿Olvidaste tu contraseña?",
    "forgotPassword.emailAddress": "Dirección de correo electrónico",
    "forgotPassword.submit": "Enviarme una forma de volver a entrar",
    "forgotPassword.home": "Volver a {siteName}",
    "forgotPassword.sent.title": "Revisa tu correo",
    "forgotPassword.sent.explanation":
      "Si esa dirección tiene una cuenta, va de camino un enlace para establecer una contraseña nueva. Síguelo dentro de la próxima hora. Si no llega nada en unos minutos, mira en la carpeta de correo no deseado o spam.",
    "forgotPassword.tryAgainLater":
      "Desde aquí se han pedido demasiadas formas de volver a entrar últimamente. Espera una hora e inténtalo de nuevo.",

    "setNewPassword.title": "Establecer una contraseña nueva",
    "setNewPassword.password": "Contraseña",
    "setNewPassword.confirmPassword": "Confirmar contraseña",
    "setNewPassword.submit": "Establecer mi contraseña nueva",
    "setNewPassword.home": "Volver a {siteName}",
    "setNewPassword.signIn": "Iniciar sesión",
    "setNewPassword.askAgain": "Pedir un enlace nuevo",
    "setNewPassword.changed.title": "Tu contraseña ha cambiado",
    "setNewPassword.changed.explanation":
      "Se ha cerrado tu sesión en todos los lugares donde la tenías abierta. Inicia sesión con tu contraseña nueva.",
    "setNewPassword.expired.title": "Ese enlace ha caducado",
    "setNewPassword.expired.explanation":
      "Un enlace para establecer una contraseña nueva funciona durante una hora. Pide otro y se enviará a la misma dirección.",
    "setNewPassword.noLongerWorks.title": "Ese enlace ya no funciona",
    "setNewPassword.noLongerWorks.explanation":
      "Puede que ya se haya usado, o que falte algo al final. Pide otro si todavía lo necesitas.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Tu contraseña no se puede comprobar en este momento, así que no se ha cambiado. Inténtalo de nuevo dentro de unos minutos; tu enlace sigue funcionando hasta que caduque.",

    "forgetAccount.title": "Olvidar tu cuenta",
    "forgetAccount.explanation":
      "Tu nombre y tu dirección de correo electrónico pueden hacerse ilegibles para siempre, y tu cuenta cerrarse. Para asegurarnos de que eres tú, primero enviaremos un enlace por correo a la dirección de tu cuenta, y no se olvidará nada hasta que lo sigas.",
    "forgetAccount.submit": "Enviarme el enlace por correo",
    "forgetAccount.sent.title": "Revisa tu correo",
    "forgetAccount.sent.explanation":
      "Hemos enviado un enlace a la dirección de tu cuenta. Funciona durante 15 minutos, y solo mientras tengas la sesión iniciada en esta cuenta.",
    "forgetAccount.confirm.title": "¿Olvidar tu cuenta para siempre?",
    "forgetAccount.confirm.explanation":
      "Una vez olvidada, tu nombre y tu dirección de correo electrónico no podrán volver a leerse, por nadie, y no se podrá iniciar sesión en tu cuenta. No se puede deshacer.",
    "forgetAccount.confirm.submit": "Olvidar mi cuenta",
    "forgetAccount.forgotten.title": "Tu cuenta ha sido olvidada",
    "forgetAccount.forgotten.explanation":
      "Tu nombre y tu dirección de correo electrónico ya no pueden leerse, y se ha cerrado tu sesión en todos los lugares donde la tenías abierta.",
    "forgetAccount.noLongerWorks.title": "Ese enlace ya no funciona",
    "forgetAccount.noLongerWorks.explanation":
      "Puede que haya caducado, que ya se haya usado o que sea de una cuenta en la que no tienes la sesión iniciada. Si aún quieres que se olvide, vuelve a pedirlo desde tu cuenta.",
    "forgetAccount.lastAdministrator.title": "No se puede olvidar tu cuenta",
    "forgetAccount.lastAdministrator.explanation":
      "Eres el único administrador de este sitio. Da el rol de administrador a otra persona y entonces tu cuenta podrá olvidarse.",
    "forgetAccount.askAgain": "Pedirlo de nuevo",
    "forgetAccount.home": "Volver a {siteName}",

    "registrationsSuspended.title": "El registro está suspendido por ahora",
    "registrationsSuspended.explanation":
      "No se puede contactar en este momento con un servicio que el registro necesita, así que nadie puede registrarse hasta que vuelva a responder. No se ha guardado nada de lo que escribiste.",
    "registrationsSuspended.tryAgainLater":
      "Inténtalo de nuevo dentro de un rato. Se ha avisado al administrador del sitio.",
    "registrationsSuspended.home": "Volver a {siteName}",

    "signIn.title": "Iniciar sesión",
    "signIn.emailAddress": "Dirección de correo electrónico",
    "signIn.password": "Contraseña",
    "signIn.submit": "Iniciar sesión",
    "signIn.forgotPassword": "¿Olvidaste tu contraseña?",
    "signIn.register": "Registrarse",
    "signIn.withGoogle": "Iniciar sesión con Google",
    "signIn.or": "o",
    "signIn.tryAgainLater":
      "Se han hecho demasiados intentos últimamente. Espera una hora e inténtalo de nuevo.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "La dirección de correo electrónico o la contraseña no son correctas. Inténtalo de nuevo.",

    "profile.title": "Perfil",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Nombre:",
    "profile.emailAddress": "Dirección de correo electrónico:",

    "changeName.title": "Cambiar nombre",
    "changeName.name": "Nombre",
    "changeName.submit": "Cambiar nombre",

    "setPassword.title": "Establecer una contraseña",
    "setPassword.explanation":
      "Tu cuenta no tiene contraseña: inicias sesión con Google. Para poder iniciar sesión también con una contraseña, enviaremos a {emailAddress} un enlace para establecerla.",
    "setPassword.submit": "Enviarme un enlace por correo",
    "setPassword.sent.title": "Revisa tu correo",
    "setPassword.sent.explanation":
      "Te hemos enviado por correo un enlace para establecer una contraseña. Funciona durante una hora.",
    "setPassword.profile": "Volver a tu perfil",

    "changePassword.title": "Cambiar contraseña",
    "changePassword.currentPassword": "Contraseña actual",
    "changePassword.password": "Contraseña nueva",
    "changePassword.passwordConfirmation": "Confirmar contraseña",
    "changePassword.forgotPassword": "¿Olvidaste tu contraseña?",
    "changePassword.submit": "Cambiar contraseña",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Esa no es tu contraseña.",

    "changeEmailAddress.title": "Cambiar dirección de correo electrónico",
    "changeEmailAddress.emailAddress": "Nueva dirección de correo electrónico",
    "changeEmailAddress.currentPassword": "Contraseña actual",
    "changeEmailAddress.submit": "Enviar un enlace de confirmación",
    "changeEmailAddress.sent.title": "Revisa tu correo",
    "changeEmailAddress.sent.explanation":
      "Se ha enviado un enlace para confirmar el traslado a la nueva dirección de correo electrónico. Síguelo, con la sesión iniciada, para trasladar allí tu cuenta.",
    "changeEmailAddress.confirm.title": "Trasladar tu cuenta",
    "changeEmailAddress.confirm.explanation":
      "Tu cuenta se trasladará a {emailAddress}. A partir de ahora iniciarás sesión con esa dirección.",
    "changeEmailAddress.confirm.submit": "Trasladar mi cuenta",
    "changeEmailAddress.noLongerWorks.title": "Este enlace ya no funciona",
    "changeEmailAddress.noLongerWorks.explanation":
      "Ha caducado, ya se ha usado o no se envió para la cuenta en la que tienes la sesión iniciada. Vuelve a pedirlo desde tu perfil.",
    "changeEmailAddress.taken.title": "Tu cuenta no se ha trasladado",
    "changeEmailAddress.profile": "Volver a tu perfil",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Esa no es tu contraseña.",
    "ChangeEmailAddress.Unchanged": "Tu cuenta ya está en esta dirección.",
    "ChangeEmailAddress.Taken":
      "Esa dirección de correo electrónico ya tiene ahora una cuenta propia, así que la tuya no puede trasladarse allí.",

    "confirmEmailAddress.title": "Confirmar tu dirección de correo electrónico",
    "confirmEmailAddress.name": "Nombre",
    "confirmEmailAddress.password": "Contraseña",
    "confirmEmailAddress.confirmPassword": "Confirmar contraseña",
    "confirmEmailAddress.submit":
      "Confirmar mi dirección de correo electrónico",
    "confirmEmailAddress.signIn": "Iniciar sesión",
    "confirmEmailAddress.home": "Volver a {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Tu dirección de correo electrónico está confirmada",
    "confirmEmailAddress.confirmed.explanation":
      "Tu cuenta está lista. Inicia sesión con la dirección de correo electrónico y la contraseña que acabas de indicar.",
    "confirmEmailAddress.expired.title": "Ese enlace ha caducado",
    "confirmEmailAddress.expired.explanation":
      "Un enlace para confirmar una dirección de correo electrónico funciona durante 24 horas. Pide uno nuevo y se enviará a la misma dirección.",
    "confirmEmailAddress.expired.newLink": "Enviarme un enlace nuevo",
    "confirmEmailAddress.noLongerWorks.title": "Ese enlace ya no funciona",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Comprueba que has seguido el enlace completo del correo, sin que falte nada al final. Si sigue sin funcionar, regístrate de nuevo y se enviará un enlace nuevo.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Esa dirección de correo electrónico ya está confirmada",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "No hay nada más que hacer. Inicia sesión con la contraseña que indicaste al confirmarla.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Introduce un nombre.",
    "PersonName.TooShort": "Un nombre debe tener al menos 3 caracteres.",
    "PersonName.TooLong": "Un nombre puede tener como máximo 254 caracteres.",
    "WorldRankingName.TooShort":
      "Un nombre de ranking mundial debe tener al menos 3 caracteres.",
    "WorldRankingName.TooLong":
      "Un nombre de ranking mundial puede tener como máximo 254 caracteres.",
    "Password.Missing": "Introduce una contraseña.",
    "Password.TooShort": "Una contraseña debe tener al menos 12 caracteres.",
    "Password.ConfirmationDiffers":
      "No es igual que la contraseña de arriba. Escríbela de nuevo.",
    "Password.Breached":
      "Esta contraseña ha aparecido en una filtración de datos en otro lugar, así que no es seguro usarla aquí. Elige otra.",

    "javaScriptRequired.title": "Se necesitan scripts",
    "javaScriptRequired.explanation":
      "Para registrarse hay que tener activados los scripts en este sitio, para poder comprobar que quien se registra es una persona. Actívalos y vuelve a registrarte.",
    "javaScriptRequired.register": "Volver al registro",
    "javaScriptRequired.home": "Volver a {siteName}",

    "errors.backHome": "Volver a {siteName}",
    "errors.notFound": "No encontrado",
    "errors.refused": "No se ha podido hacer",
    "errors.refusedDetail": "Algo de lo que se envió no estaba bien.",
    "errors.sorry": "Lo sentimos",
    "errors.sorryDetail": "No se ha podido atender esa solicitud.",
    "errors.failed": "Algo ha salido mal",
    "errors.reference": "Referencia {reference}.",
    "errors.recorded":
      "El error se ha registrado y se ha enviado un correo al administrador. Ayuda escribir al administrador con la referencia y una descripción de lo que estabas haciendo.",
    "errors.message": "Escribir al administrador",
    "errors.messageSubject": "Error {reference} en {siteName}",
    "errors.messageBody": "Lo que estaba haciendo cuando ocurrió esto:\n\n",
    "errors.unavailable": "El sitio no está disponible",
    "errors.unavailableDetail":
      "El sitio no puede acceder en este momento a lo que necesita. Inténtalo de nuevo más tarde.",
    "errors.maintenance": "El sitio está en mantenimiento.",
    "errors.maintenanceMinutes": "Se espera que vuelva en {minutes} minutos.",
    "errors.maintenanceMinute": "Se espera que vuelva en 1 minuto.",
    "errors.maintenanceLonger":
      "Está tardando más de lo previsto y volverá pronto.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Resultados recientes",
    "home.recentResults.none":
      "No se ha añadido ninguna partida en los últimos siete días.",
    "home.upcomingTournaments": "Próximos torneos",
    "home.upcomingTournaments.none":
      "Ningún torneo empieza en los próximos sesenta días.",
    "home.allTournaments": "Todos los torneos de {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Torneos de {year}",
    "year.none": "Ningún torneo empieza en {year}.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "Torneos de {sport} de {year}",
    "yearSport.none": "Ningún torneo de {sport} empieza en {year}.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Recientes",
    "tournament.summary": "Resumen",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "Cada partido es al mejor de {count}.",
    "test.vs": "vs",
    "test.matches": "Partidos",
    "test.games": "Partidas",
    "test.hoops": "Aros",
    "teamSummary.tests": "Tests",
    "teamSummary.matches": "Partidos",
    "teamSummary.games": "Partidas",
    "teamSummary.hoops": "Aros",
    "teamSummary.wins": "Victorias",
    "teamSummary.losses": "Derrotas",
    "teamSummary.draws": "Empates",
    "teamSummary.for": "A favor",
    "teamSummary.against": "En contra",
    "teamSummary.net": "Neto",
    "tournament.players": "Jugadores",
    "search.label": "Buscar",
    "search.tournaments": "Torneos",
    "search.competitions": "Competiciones",
    "search.nothingFound": "No se ha encontrado nada.",
    "players.search.label": "Buscar jugadores",
    "players.search.prompt":
      "Escribe el nombre de un jugador para encontrarlo.",
    "players.search.none": "No se ha encontrado ningún jugador.",
    "search.more":
      "Solo se muestran los primeros {count}. Añade más del nombre para afinar la búsqueda.",
    "websitePlayer.tournament": "Torneo",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} vs {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Crónica",
    "tournament.beat": "ganó a",
    "tournament.drewWith": "empató con",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 hora",
    "tournament.ago.hours": "{count} horas",
    "tournament.none": "Todavía no se ha jugado ninguna partida.",
    // A tournament's players' page, when it has none.
    "players.none": "Todavía no se ha añadido ningún jugador.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "por",
    "commentaries.start": "Iniciar una crónica nueva",
    // The page that starts a commentary.
    "startCommentary.title": "Iniciar una crónica nueva",
    "startCommentary.titleField": "Título",
    "startCommentary.submit": "Iniciar crónica",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "nuevo",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Los gestores todavía no han escrito ninguna nota.",
    "note.edited": "editada",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "Todavía no se ha escrito ningún comentario.",
    "commentary.edited": "editado",
    "commentary.edit": "Editar",
    "commentary.delete": "Eliminar",
    "commentary.comment": "Comentario",
    "commentary.add": "Añadir comentario",
    "commentary.notSent":
      "No se ha podido enviar el comentario. Vuelve a cargar la página para ver si se guardó.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Cambiar título",
    "changeCommentaryTitle.submit": "Guardar",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "Editar comentario",
    "editComment.save": "Guardar",
    "deleteComment.title": "Eliminar comentario",
    "deleteComment.question":
      "¿Eliminar este comentario? No se puede deshacer.",
    "deleteComment.confirm": "Eliminar comentario",
    "deleteComment.keep": "Conservarlo",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "Partidas",
    "player.competitions": "Competiciones",
    "player.beat": "ganó a",
    "player.lostTo": "perdió con",
    "player.drewWith": "empató con",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Todavía no ha jugado ninguna partida.",
    "player.noCompetitions": "Todavía no está inscrito en ninguna competición.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "Victorias",
    "block.matches": "Partidos",
    "block.netGames": "Partidas netas",
    "block.games": "Partidas",
    "block.netHoops": "Aros netos",
    "block.won": "ganada",
    "block.lost": "perdida",
    "block.drawn": "empatada",
    "block.withdrawn": "retirado",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "retirada",
    "block.losses": "Derrotas",
    // The column of places at the end of a block's grid, summary and print,
    // and what is said beneath each about how players level on matches won
    // are told apart. Net hoops come first in the second, for a block whose
    // matches are a single game, where net games would only say again what
    // wins have.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Los desempates se deciden por las partidas netas, luego por los aros netos, luego por quién ganó a quién.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Los desempates se deciden por los aros netos, luego por quién ganó a quién.",
    "block.tieBreak.whoBeatWho":
      "Los desempates se deciden por quién ganó a quién.",
    "block.tieBreak.other": "No hay un método de desempate conocido.",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Vistas",
    "competition.view.grid": "Cuadrícula",
    "competition.view.summary": "Resumen",
    "competition.view.orderOfPlay": "Orden de juego",
    "competition.print": "Imprimir",
    "competition.playedTo": "Se juega a {hoops} aros",
    "blockSummary.ranking":
      "Ordenados por la proporción de partidos ganados. Los reglamentos propios de un torneo pueden clasificar a sus jugadores de otro modo.",
    "orderOfPlay.none": "Todavía no se ha jugado ninguna partida.",
    "orderOfPlay.column.game": "Partida",
    "orderOfPlay.column.date": "Fecha",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinales",
    "knockout.round.quarters": "Cuartos de final",
    "knockout.round.number": "Ronda {number}",
    "knockout.bye": "Bye",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "Partidas",
    "swiss.wins": "Victorias",
    "swiss.winShare": "% de victorias",
    "swiss.results": "Resultados",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "Rondas posteriores",
    "knockout.back": "Rondas anteriores",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "Fecha",
    "tournamentList.column.name": "Nombre",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Solo torneos de {country}",
    "tournamentList.usualOrder": "Volver al orden habitual",
    "tournamentList.filter.country": "País",
    "tournamentList.filter.anyCountry": "Cualquier país",
    "tournamentList.filter.region": "Región",
    "tournamentList.filter.anyRegion": "Cualquier región",
    "tournamentList.filter.noRegionsBefore":
      "Los torneos anteriores a noviembre de 2026 no tienen región.",
    "tournamentList.filter.sport": "Deporte",
    "tournamentList.filter.anySport": "Cualquier deporte",
    "tournamentList.filter.submit": "Filtrar",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "Años",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Años anteriores",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message":
      "Hay disponible una versión más reciente de este sitio.",
    "admin.newerBuild.reload": "Recargar",
    "admin.title": "Administración",
    "admin.tournaments.new": "Nuevo torneo",
    "admin.tournaments.none": "Ningún torneo",
    "admin.tournaments.filter.none": "Ningún torneo coincide",
    "admin.tournaments.show": "Mostrar",
    "admin.tournaments.managerScorer": "Gestor/Anotador",
    "admin.tournaments.worldRanking": "Ranking mundial",
    "admin.tournaments.notWorldRanking": "Fuera del ranking mundial",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Archivado",
    "admin.tournaments.manage": "Gestionar",
    "admin.tournaments.edit": "Editar",
    "admin.tournaments.archive": "Archivar",
    "admin.tournaments.restore": "Restaurar",
    "admin.tournaments.scores": "Resultados",
    "admin.tournaments.players": "Jugadores",
    "admin.years.label": "Años",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Años anteriores",
    "admin.tournament.name": "Nombre",
    "admin.tournament.starts": "Comienza",
    "admin.tournament.finishes": "Termina",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Deporte",
    "admin.tournament.country": "País",
    "admin.tournament.region": "Región",
    "admin.tournament.subtitle": "Subtítulo",
    "admin.rules.handicap": "Se juega con hándicap",
    "admin.rules.drawsAllowed": "Permite resultados con empate",
    "admin.tournament.levelTestsDrawn":
      "Los tests igualados se dan por empatados",
    "admin.rules.worldRankings": "Cuenta para los rankings mundiales",
    "admin.rules.maximumHoops": "Máximo de aros",
    "admin.tournament.national": "Evento de nivel nacional",
    "admin.tournament.international": "Evento de nivel internacional",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Esto no se puede aceptar tal como está.",
    "admin.newTournament.title": "Nuevo torneo",
    "admin.newTournament.submit": "Crear torneo",
    "admin.editTournament.title": "Editar torneo",
    "admin.editTournament.submit": "Actualizar torneo",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "Este torneo no se puede modificar.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Torneo",
    "admin.view.players": "Jugadores",
    "admin.view.competitions": "Competiciones",
    "admin.view.managers": "Gestores",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Anotadores",
    "admin.view.rankings": "Rankings",
    "admin.rankings.file":
      "Los rankings mundiales usarán los resultados del torneo mediante esta función, y los gestores no tienen que hacer nada.",
    "admin.rankings.download": "Descargar partidas para el ranking mundial",
    "rankings.notAvailable": "Los rankings no están disponibles",
    "rankings.notAvailable.sport":
      "El deporte de este torneo no tiene rankings mundiales, así que no hay rankings que enviar.",
    "rankings.notAvailable.notCounted":
      "Ninguna de las competiciones de este torneo cuenta para los rankings mundiales.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "Este torneo no se puede gestionar desde aquí.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Competición",
    "admin.competitionView.players": "Jugadores",
    "admin.competitionView.scores": "Resultados",
    "admin.competitionView.losers": "Perdedores",
    "admin.losers.add": "Añadir eliminatoria de perdedores",
    "admin.losers.round": "Perdedores de",
    "admin.losers.option": "{round} ({count} perdedores)",
    "admin.losers.name": "Nombre de la eliminatoria de perdedores",
    "admin.losers.none": "No hay eliminatorias de perdedores.",
    "admin.losers.noRounds":
      "Esta eliminatoria no tiene ninguna ronda cuyos perdedores puedan seguir jugando.",
    "admin.losers.remove": "Quitar",
    "admin.losers.readOnly":
      "Los jugadores de esta eliminatoria son los perdedores de otra eliminatoria, y se colocan aquí a medida que se decide cada partido.",
    "admin.hover.losers.add":
      "Añadir una eliminatoria para los perdedores de una ronda de esta eliminatoria",
    "Tournament.NoSuchRound":
      "La eliminatoria no tiene una ronda así que envíe perdedores.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Otra eliminatoria toma los perdedores de esta, así que sus plazas no se pueden cambiar.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Otra eliminatoria en uso toma los perdedores de esta, así que archiva primero esa otra.",
    "Tournament.LosersKnockoutSourceArchived":
      "Esta eliminatoria de perdedores toma los perdedores de una eliminatoria archivada, así que restaura primero esa otra.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Una eliminatoria de perdedores tiene tantas plazas como partidos tiene la ronda de la que toma los perdedores.",
    "Competition.PlayersSetAutomatically":
      "Los jugadores de una eliminatoria de perdedores se colocan en ella a medida que se deciden los partidos, no a mano.",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "El torneo y sus competiciones",
    "admin.sections.tournament": "Torneo",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Las páginas del administrador",
    "admin.administrator.sections.tournaments": "Torneos",
    "admin.administrator.sections.accounts": "Cuentas",
    "admin.administrator.sections.worldRankings": "Rankings mundiales",
    "admin.administrator.sections.importErrors": "Errores de importación",
    "admin.administrator.sections.logs": "Registros",
    "admin.administrator.sections.databaseStatus": "Acceso a la base de datos",
    "admin.administrator.sections.countries": "Países",
    "admin.databaseStatus.title": "Acceso a la base de datos",
    "admin.databaseStatus.on": "El acceso a la base de datos está activado.",
    "admin.databaseStatus.off":
      "El acceso a la base de datos está desactivado.",
    "admin.databaseStatus.expected":
      "Se espera que el sitio vuelva en {minutes} minutos.",
    "admin.databaseStatus.expectedOne":
      "Se espera que el sitio vuelva en 1 minuto.",
    "admin.databaseStatus.longer": "Está tardando más de lo previsto.",
    "admin.databaseStatus.told": "A los lectores se les dice: {words}",
    "admin.databaseStatus.toldUsual":
      "A los lectores se les dice la frase habitual.",
    "admin.databaseStatus.minutes": "Minutos previstos",
    "admin.databaseStatus.words": "Texto para los lectores",
    "admin.databaseStatus.turnOff": "Desactivar",
    "admin.databaseStatus.change": "Cambiar",
    "admin.databaseStatus.turnOn": "Activar",
    "admin.databaseStatus.minutesNeeded": "Hacen falta los minutos.",
    "admin.databaseStatus.otherwise": "Algo ha salido mal en el sitio.",
    "DatabaseAccess.MinutesNotWhole": "Los minutos deben ser un número entero.",
    "DatabaseAccess.MinutesOutOfRange": "Los minutos deben ir de 1 a 1440.",
    "DatabaseAccess.WordsTooLong": "El texto no debe pasar de 500 caracteres.",
    "DatabaseAccess.NotOff":
      "El acceso a la base de datos no está desactivado.",
    "admin.administrator.title": "Administrador",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Cuentas",
    "admin.roles.add": "Añadir",
    "admin.roles.administrator.heading": "Administradores",
    "admin.roles.administrator.none": "Ningún otro administrador",
    "admin.roles.administrator.removeTitle": "Quitar administrador",
    "admin.roles.administrator.removeExplanation":
      "{name} dejará de ser administrador de este sitio.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Responsables del ranking mundial de croquet de asociación",
    "admin.roles.ac-world-ranking-officer.none":
      "Ningún responsable del ranking mundial de croquet de asociación",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Quitar responsable del ranking mundial de croquet de asociación",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} dejará de ser responsable del ranking mundial de croquet de asociación.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Responsables del ranking mundial de croquet golf",
    "admin.roles.gc-world-ranking-officer.none":
      "Ningún responsable del ranking mundial de croquet golf",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Quitar responsable del ranking mundial de croquet golf",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} dejará de ser responsable del ranking mundial de croquet golf.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "Importar jugadores del ranking mundial",
    "admin.worldRankings.import": "Importar",
    "admin.worldRankings.log": "Cómo fue la importación",
    "admin.worldRankings.ac.reading":
      "Leyendo la lista de croquet de asociación",
    "admin.worldRankings.ac.read":
      "Jugadores de croquet de asociación leídos: {players}",
    "admin.worldRankings.ac.kept":
      "Jugadores de croquet de asociación conservados: {players}",
    "admin.worldRankings.ac.refused":
      "No se ha podido leer la lista de croquet de asociación, así que sus jugadores se han dejado como estaban.",
    "admin.worldRankings.gc.reading": "Leyendo la lista de croquet golf",
    "admin.worldRankings.gc.read":
      "Jugadores de croquet golf leídos: {players}",
    "admin.worldRankings.gc.kept":
      "Jugadores de croquet golf conservados: {players}",
    "admin.worldRankings.gc.refused":
      "No se ha podido leer la lista de croquet golf, así que sus jugadores se han dejado como estaban.",
    "admin.worldRankings.finished": "Terminado",
    "admin.worldRankings.failed": "La importación no terminó.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Algo ha salido mal en el sitio.",
    "WorldRankingLists.Unreachable":
      "No se ha podido contactar con el sitio de los rankings mundiales.",
    "WorldRankingLists.Unreadable":
      "La lista no tiene el formato que usan los rankings mundiales: no se ha podido leer una línea, no tiene a nadie, o no está escrita en UTF-8.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Errores de importación",
    "admin.importErrors.none": "Ningún error de importación",
    "admin.importErrors.otherwise": "Algo ha salido mal en el sitio.",
    "admin.countries.title": "Países",
    "admin.countries.none":
      "Ningún torneo se juega en un país que las listas no nombran",
    "admin.countries.oldSite": "Sitio antiguo",
    "admin.countries.otherwise": "Algo ha salido mal en el sitio.",
    "admin.logs.title": "Registros",
    "admin.logs.severity": "Gravedad",
    "admin.logs.text": "Buscar",
    "admin.logs.show": "Mostrar",
    "admin.logs.prune": "Depurar",
    "admin.logs.pruneAsk":
      "¿Eliminar el registro anterior a la última hora? Nada lo devuelve.",
    "admin.logs.removed": "Se eliminaron {count} entradas",
    "admin.logs.none": "Ninguna entrada de registro",
    "admin.logs.otherwise": "Algo ha salido mal en el sitio.",
    "admin.hover.logs.show": "Mostrar las entradas que coinciden",
    "admin.hover.logs.prune": "Eliminar el registro anterior a la última hora",
    "admin.hover.logs.pruneAgree":
      "Eliminar el registro anterior a la última hora",
    "admin.importError.title": "Error de importación",
    "admin.importError.documentId": "Id del documento",
    "admin.importError.tournament": "Torneo",
    "admin.importError.competition": "Competición",
    "admin.importError.newSite": "Sitio nuevo",
    "admin.importError.oldSite": "Sitio antiguo",
    "ImportErrorKept.NotFound":
      "La importación no guardó ningún error para ese documento.",
    "admin.competitionView.otherwise":
      "Esta competición no se puede gestionar desde aquí.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "Grupo",
    "admin.competitions.knockout": "Eliminatoria",
    "admin.competitions.swiss": "Suizo",
    "admin.competitions.view": "Ver",
    "admin.competitions.edit": "Editar",
    "admin.competitions.up": "Subir",
    "admin.competitions.down": "Bajar",
    "admin.competitions.archive": "Archivar",
    "admin.competitions.restore": "Restaurar",
    "admin.competitions.archived": "Competiciones archivadas",
    "admin.competitions.none": "Ninguna competición",
    "admin.competitions.add": "Añadir competición",
    // The competition dialog.
    "admin.competition.addTitle": "Añadir competición",
    "admin.competition.editTitle": "Editar competición",
    "admin.competition.name": "Nombre",
    "admin.competition.kind": "Tipo",
    "admin.competition.bestOf": "Al mejor de",
    "admin.competition.rounds": "Rondas",
    "admin.competition.tieBreaks": "Desempates",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Partidas netas, luego aros netos, luego quién ganó a quién",
    "admin.competition.tieBreak.who-beat-who": "Quién ganó a quién",
    "admin.competition.tieBreak.other": "Otro",
    "admin.competition.places": "Plazas",
    "admin.competition.round": "Ronda {number}",
    "admin.competition.bestOfs": "Al mejor de (por ronda)",
    "admin.competition.quarters": "Cuartos",
    "admin.competition.semis": "Semifinales",
    "admin.competition.final": "Final",
    "admin.competition.add": "Añadir",
    "admin.competition.save": "Guardar",
    "admin.competition.added": "Se añadió {name}.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Esta competición no se puede guardar tal como está.",
    "CompetitionName.Missing": "Introduce un nombre.",
    "CompetitionName.TooLong":
      "Un nombre puede tener como máximo 254 caracteres.",
    "CompetitionName.NoLetterOrDigit":
      "Un nombre necesita una letra o un dígito.",
    "Tournament.KnockoutPlayerHasGames":
      "Los jugadores de este cuadro tienen partidas, así que sus plazas no pueden cambiar.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Una ronda con un partido decidido no puede pasar a un mejor de menos partidas.",
    "Tournament.KnockoutLaterRoundHasGames":
      "No se puede cambiar una ronda una vez jugada una partida en una ronda posterior.",
    "Tournament.CompetitionNameTaken":
      "Otra competición de este torneo ya tiene ese nombre.",
    "Tournament.MaximumHoopsInvalid":
      "Introduzca un número entero de aros, al menos 1, o deje el campo vacío si no hay máximo.",
    "BestOf.NotWhole": "Introduce un número entero de partidas.",
    "BestOf.TooSmall": "Un partido debe ser al mejor de al menos 1 partida.",
    "Rounds.NotWhole": "Introduce un número entero de rondas.",
    "Rounds.TooSmall": "Un grupo debe jugarse en al menos 1 ronda.",
    "KnockoutDraw.EvenBestOf":
      "Un partido de eliminatoria debe tener un ganador, así que es al mejor de un número impar de partidas.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Crear un torneo nuevo",
    "admin.hover.tournaments.manage":
      "Gestionar los jugadores, equipos, competiciones y resultados de este torneo",
    "admin.hover.tournaments.edit": "Cambiar los datos de este torneo",
    "admin.hover.tournaments.scores":
      "Introducir los resultados de este torneo",
    "admin.hover.tournaments.players": "Gestionar los jugadores de este torneo",
    "admin.hover.competitions.view":
      "Abrir esta competición para ver e introducir sus jugadores y resultados",
    "admin.hover.tests.view":
      "Abrir este test para ver e introducir sus resultados",
    "admin.hover.teams.view":
      "Abrir este equipo para ver y gestionar sus jugadores",
    "admin.hover.dialog.player.add": "Añadir este jugador al torneo",
    "admin.hover.dialog.player.save": "Guardar los cambios de este jugador",
    "admin.hover.dialog.team.add": "Añadir este equipo al torneo",
    "admin.hover.dialog.team.save": "Guardar los cambios de este equipo",
    "admin.hover.dialog.test.add": "Añadir este test al torneo",
    "admin.hover.dialog.test.save": "Guardar los cambios de este test",
    "admin.hover.dialog.competition.add": "Añadir esta competición al torneo",
    "admin.hover.dialog.competition.save":
      "Guardar los cambios de esta competición",
    "admin.hover.dialog.score.add": "Añadir este resultado a la competición",
    "admin.hover.dialog.score.save": "Guardar la corrección de este resultado",
    "admin.hover.dialog.carryForward.save":
      "Trasladar los resultados de este jugador",
    "admin.hover.dialog.tournament.new": "Crear este torneo",
    "admin.hover.dialog.tournament.edit": "Guardar los cambios de este torneo",
    "admin.hover.modal.cancel": "Cerrar esto sin guardar nada",
    "admin.hover.modal.ok": "Cerrar este mensaje",
    "admin.hover.tab": "Mostrar la pestaña {name}",
    "admin.hover.tournaments.archive":
      "Archivar este torneo; se puede restaurar",
    "admin.hover.tournaments.restore": "Recuperar este torneo archivado",
    "admin.hover.players.add": "Añadir un jugador a este torneo",
    "admin.hover.players.addMany":
      "Añadir varios jugadores a este torneo a la vez",
    "admin.hover.dialog.players.add": "Añadir estos jugadores al torneo",
    "admin.hover.players.edit": "Cambiar los datos de este jugador",
    "admin.hover.players.up": "Subir este jugador en la lista",
    "admin.hover.players.down": "Bajar este jugador en la lista",
    "admin.hover.players.archive": "Archivar este jugador; se puede restaurar",
    "admin.hover.players.restore": "Recuperar este jugador archivado",
    "admin.hover.teams.add": "Añadir un equipo a este torneo",
    "admin.hover.teams.edit": "Cambiar los datos de este equipo",
    "admin.hover.teams.up": "Subir este equipo en la lista",
    "admin.hover.teams.down": "Bajar este equipo en la lista",
    "admin.hover.teams.archive": "Archivar este equipo; se puede restaurar",
    "admin.hover.teams.restore": "Recuperar este equipo archivado",
    "admin.hover.competitions.add": "Añadir una competición a este torneo",
    "admin.hover.competitions.edit": "Cambiar los datos de esta competición",
    "admin.hover.competitions.up": "Subir esta competición en la lista",
    "admin.hover.competitions.down": "Bajar esta competición en la lista",
    "admin.hover.competitions.archive":
      "Archivar esta competición; se puede restaurar",
    "admin.hover.competitions.restore": "Recuperar esta competición archivada",
    "admin.hover.tests.add": "Añadir un test entre dos equipos",
    "admin.hover.tests.edit": "Cambiar los datos de este test",
    "admin.hover.tests.up": "Subir este test en la lista",
    "admin.hover.tests.down": "Bajar este test en la lista",
    "admin.hover.tests.archive": "Archivar este test; se puede restaurar",
    "admin.hover.tests.restore": "Recuperar este test archivado",
    "admin.hover.tests.toTeams":
      "Ir a la pestaña Equipos para añadir los equipos que necesita un test",
    "admin.hover.scores.add":
      "Añadir el resultado de una partida a esta competición",
    "admin.hover.scores.edit": "Corregir este resultado",
    "admin.hover.scores.archive":
      "Archivar este resultado para que deje de contar; se puede restaurar",
    "admin.hover.scores.restore":
      "Recuperar este resultado archivado, para que vuelva a contar",
    "admin.hover.scores.withdraw":
      "Mantener este resultado en la lista pero dejar de contarlo",
    "admin.hover.scores.unwithdraw":
      "Hacer que este resultado retirado vuelva a contar",
    "admin.hover.scores.up": "Adelantar este resultado en la lista",
    "admin.hover.scores.down": "Retrasar este resultado en la lista",
    "admin.hover.competitionPlayers.add":
      "Incluir al jugador elegido en esta competición",
    "admin.hover.competitionPlayers.up": "Subir este jugador en la lista",
    "admin.hover.competitionPlayers.down": "Bajar este jugador en la lista",
    "admin.hover.competitionPlayers.remove":
      "Sacar a este jugador de la competición",
    "admin.hover.competitionPlayers.withdraw":
      "Retirar a este jugador de la competición",
    "admin.hover.competitionPlayers.unwithdraw":
      "Volver a incluir en la competición a este jugador retirado",
    "admin.hover.competitionPlayers.carryForward":
      "Trasladar los resultados de este jugador desde otra competición",
    "admin.hover.notes.add": "Escribir una nota nueva para este torneo",
    "admin.hover.notes.edit": "Cambiar esta nota",
    "admin.hover.notes.delete": "Eliminar esta nota",
    "admin.hover.note.add": "Guardar esta nota y añadirla al torneo",
    "admin.hover.note.save": "Guardar los cambios de esta nota",
    "admin.hover.people.add": "Dar el rol a esta persona",
    "admin.hover.people.remove": "Quitar el rol a esta persona",
    "admin.hover.worldRankings.import":
      "Obtener los rankings mundiales y añadir a sus jugadores",
    "admin.modal.cancel": "Cancelar",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "Aceptar",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "Dirección de correo electrónico",
    "admin.people.remove": "Quitar",
    "admin.people.otherwise": "No se ha podido hacer.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Tú",
    "admin.managers.add": "Añadir gestor",
    "admin.managers.email": "Escribir a los gestores",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "Ningún gestor",
    "admin.managers.removeTitle": "Quitar gestor",
    "admin.managers.removeExplanation":
      "{name} dejará de poder gestionar este torneo.",
    "admin.managers.removeYourself.explanation":
      "Dejarás de poder gestionar este torneo, y nadie aquí puede deshacerlo por ti. Otro gestor puede volver a nombrarte.",
    "admin.managers.otherwise": "Esa dirección no se puede nombrar gestor.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Añadir jugador",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "No se puede añadir este jugador.",
    "admin.competitionPlayers.choose": "Jugador que añadir",
    "admin.competitionPlayers.nobody": "Elige un jugador",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all":
      "Todos los jugadores están en la competición",
    "admin.competitionPlayers.none": "Ningún jugador",
    "admin.competitionPlayers.up": "Subir",
    "admin.competitionPlayers.down": "Bajar",
    "admin.competitionPlayers.remove": "Quitar",
    "admin.competitionPlayers.withdraw": "Retirar",
    "admin.competitionPlayers.unwithdraw": "Anular retirada",
    "admin.competitionPlayers.withdrawn": "Jugadores retirados",
    "admin.competitionPlayers.removeTitle": "Quitar jugador",
    "admin.competitionPlayers.removeQuestion":
      "{name} saldrá de la competición. No se puede deshacer.",
    "admin.competitionPlayers.withdrawTitle": "Retirar jugador",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} no jugará más en la competición, y las partidas que no haya jugado se decidirán sin él.",
    "admin.competitionPlayers.carryForward": "Trasladar",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Trasladar - {name}",
    "admin.carryForward.save": "Guardar",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "No se puede guardar este traslado.",
    "admin.carryForward.matchWins": "Partidos ganados",
    "admin.carryForward.matchLosses": "Partidos perdidos",
    "admin.carryForward.gameWins": "Partidas ganadas",
    "admin.carryForward.gameLosses": "Partidas perdidas",
    "admin.carryForward.hoopsFor": "Aros a favor",
    "admin.carryForward.hoopsAgainst": "Aros en contra",
    "CarryForward.MatchWinsNotWhole":
      "Introduce un número entero de partidos ganados.",
    "CarryForward.MatchWinsBelowZero": "Introduce 0 o más partidos ganados.",
    "CarryForward.MatchLossesNotWhole":
      "Introduce un número entero de partidos perdidos.",
    "CarryForward.MatchLossesBelowZero": "Introduce 0 o más partidos perdidos.",
    "CarryForward.GameWinsNotWhole":
      "Introduce un número entero de partidas ganadas.",
    "CarryForward.GameWinsBelowZero": "Introduce 0 o más partidas ganadas.",
    "CarryForward.GameLossesNotWhole":
      "Introduce un número entero de partidas perdidas.",
    "CarryForward.GameLossesBelowZero": "Introduce 0 o más partidas perdidas.",
    "CarryForward.HoopsForNotWhole":
      "Introduce un número entero de aros a favor.",
    "CarryForward.HoopsForBelowZero": "Introduce 0 o más aros a favor.",
    "CarryForward.HoopsAgainstNotWhole":
      "Introduce un número entero de aros en contra.",
    "CarryForward.HoopsAgainstBelowZero": "Introduce 0 o más aros en contra.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Añadir resultado",
    "admin.scores.none": "Ningún resultado",
    "admin.scores.edit": "Editar",
    "admin.scores.drawNotFilledTitle": "Cuadro sin completar",
    "admin.scores.archive": "Archivar",
    "admin.scores.up": "Subir",
    "admin.scores.down": "Bajar",
    "admin.scores.restore": "Restaurar",
    "admin.scores.archived": "Resultados archivados",
    "admin.scores.archivedSaid": "Archivado",
    "admin.scores.withdraw": "Retirar",
    "admin.scores.unwithdraw": "Anular retirada",
    "admin.scores.withdrawnSaid": "Retirado",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "No se ha podido hacer.",
    "admin.score.title": "Añadir resultado",
    "admin.score.add": "Añadir partida",
    "admin.score.winner": "Ganador",
    "admin.score.winnerScore": "Puntuación del ganador",
    "admin.score.loser": "Perdedor",
    "admin.score.loserScore": "Puntuación del perdedor",
    "admin.score.beat": "ganó a",
    "admin.score.added": "Se añadió la partida que {winner} ganó a {loser}.",
    "admin.score.otherwise": "No se ha podido añadir la partida.",
    "admin.score.correctTitle": "Editar resultado",
    "admin.score.save": "Guardar",
    "admin.score.notCorrected": "No se ha podido corregir el resultado.",
    "Game.WinnerMissing": "Elige al ganador.",
    "Game.WinnerScoreMissing": "Escribe la puntuación del ganador.",
    "Game.LoserMissing": "Elige al perdedor.",
    "Game.LoserScoreMissing": "Escribe la puntuación del perdedor.",
    "Score.NoPoints": "Una puntuación empieza por su número de puntos.",
    "Game.SamePlayer": "Nadie juega contra sí mismo.",
    "Game.WinnerNotAhead":
      "La puntuación del ganador debe ser mayor que la del perdedor, o estar marcada como ganada.",
    "Game.LoserMarked":
      "La puntuación del perdedor no puede marcarse como ganada.",
    "Game.ResultChanged":
      "Una corrección mantiene el resultado: una partida ganada sigue ganada y una empatada sigue empatada.",
    "Competition.MatchDecided": "Su partido ya está decidido.",
    "Competition.DrawFull":
      "No se puede añadir al jugador porque la eliminatoria está completa.",
    "Competition.DrawNotFilled":
      "No se pueden añadir resultados hasta que cada plaza de la eliminatoria esté ocupada por un jugador o un bye.",
    "Competition.ByeOutsideKnockout":
      "Solo una eliminatoria puede tener un bye.",
    "Competition.NotDrawnToMeet":
      "Estos jugadores no están emparejados actualmente para jugar entre sí en la eliminatoria.",
    "Competition.WinnerHasPlayedOn":
      "El ganador de este partido ya ha jugado su siguiente partida, así que quién lo ganó no puede cambiar.",
    "CompetitionPlayer.Withdrawn": "Un jugador retirado no juega más.",
    "admin.players.add": "Añadir jugador",
    "admin.players.addMany": "Añadir jugadores",
    "admin.players.none": "Ningún jugador",
    "admin.players.edit": "Editar",
    "admin.players.archive": "Archivar",
    "admin.players.restore": "Restaurar",
    "admin.players.up": "Subir",
    "admin.players.down": "Bajar",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Archivar jugador",
    "admin.players.archiveQuestion": "{name} saldrá de estas competiciones:",
    "admin.players.archive.explanation":
      "Al restaurarlo no volverá a estas competiciones.",
    "admin.players.archived": "Jugadores archivados",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Archivado",
    // The player dialog.
    "admin.player.addTitle": "Añadir jugador",
    "admin.player.editTitle": "Editar jugador",
    "admin.player.name": "Nombre",
    "admin.player.handicap": "Hándicap",
    "admin.player.representing": "Representa a",
    "admin.player.worldRankingName": "Nombre del jugador en el ranking mundial",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown":
      "Los rankings mundiales conocen este nombre.",
    "admin.player.worldRankingQuestioned":
      "Los rankings mundiales no tienen ningún jugador con este nombre. Puede estar mal escrito, o el jugador puede ser nuevo en los rankings.",
    "admin.player.flag": "Bandera",
    "admin.player.add": "Añadir",
    "admin.player.save": "Guardar",
    "admin.player.added": "Se añadió a {name}.",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "Añadir jugadores",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Ayuda",
    "admin.players.many": "Jugadores",
    "admin.players.line": "Línea {line}: {words}",
    "AddPlayers.FieldsMissing":
      "Escribe los nombres de los campos en la primera línea.",
    "AddPlayers.NameMissing": "Los campos deben incluir Name.",
    "AddPlayers.FieldNotAllowed":
      "Un campo puede ser Name, Representing, Flag, Handicap o WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Un campo solo puede nombrarse una vez.",
    "AddPlayers.PlayersMissing":
      "Escribe un jugador en cada línea después de la primera.",
    "AddPlayers.TooManyPlayers":
      "Una lista admite como máximo 500 jugadores. Añade el resto en otra lista.",
    "AddPlayers.ValuesMismatched":
      "Cada jugador necesita un valor, o nada, para cada campo nombrado en la primera línea.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Este jugador no se puede guardar tal como está.",
    "Tournament.PlayerNameTaken":
      "Otro jugador de este torneo ya tiene ese nombre.",
    "TournamentPlayer.NoSuchFlag": "Elige una de las banderas disponibles.",
    "TournamentPlayer.HandicapMalformed":
      "Escribe el hándicap como un número. Por ejemplo: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Un jugador no puede llamarse Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nombre necesita una letra o un dígito.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Los byes no hace falta añadirlos",
    "admin.player.byes":
      "Un bye no es uno de los jugadores del torneo. Una eliminatoria ofrece Bye siempre que se añaden sus jugadores, tantas veces como necesite su cuadro.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "Equipos",
    "admin.view.tests": "Tests",
    "admin.teams.add": "Añadir equipo",
    "admin.teams.none": "Ningún equipo",
    "admin.teams.edit": "Editar",
    "admin.teams.view": "Ver",
    "admin.teams.archive": "Archivar",
    "admin.teams.restore": "Restaurar",
    "admin.teams.up": "Subir",
    "admin.teams.down": "Bajar",
    "admin.teams.archived": "Equipos archivados",
    "admin.teams.archivedSaid": "Archivado",
    "admin.team.addTitle": "Añadir equipo",
    "admin.team.editTitle": "Editar equipo",
    "admin.team.name": "Nombre",
    "admin.team.shortName": "Nombre corto",
    "admin.team.shortName.explanation":
      "Con lo que se nombran los tests del equipo, como AUS v ENG.",
    "admin.team.flag": "Bandera",
    "admin.team.add": "Añadir",
    "admin.team.save": "Guardar",
    "admin.team.added": "Se añadió {name}.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "Este equipo no se puede guardar tal como está.",
    "admin.teamView.otherwise": "Este equipo no se puede ver desde aquí.",
    "admin.teamView.players": "Jugadores",
    "TeamName.Missing": "Indica cómo se llama el equipo.",
    "TeamName.TooLong": "Ese nombre es demasiado largo.",
    "admin.notes.add": "Añadir nota",
    "admin.notes.none": "Ninguna nota",
    "admin.notes.edit": "Editar",
    "admin.notes.delete": "Eliminar",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Eliminar nota",
    "admin.notes.deleteQuestion": "¿Eliminar la nota “{title}”?",
    "admin.notes.delete.explanation":
      "Una nota eliminada desaparece para siempre y no se puede recuperar.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "No se ha podido hacer.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "Añadir nota",
    "admin.note.editTitle": "Editar nota",
    "admin.note.title": "Título",
    "admin.note.description": "Descripción",
    "admin.note.write": "Escribir",
    "admin.note.preview": "Vista previa",
    "admin.note.toolbar": "Formato",
    "admin.note.tool.heading": "Encabezado",
    "admin.note.tool.bold": "Negrita",
    "admin.note.tool.italic": "Cursiva",
    "admin.note.tool.quote": "Cita",
    "admin.note.tool.code": "Código",
    "admin.note.tool.link": "Enlace",
    "admin.note.tool.numberedList": "Lista numerada",
    "admin.note.tool.bulletedList": "Lista con viñetas",
    "admin.note.tool.taskList": "Lista de tareas",
    "admin.note.add": "Añadir",
    "admin.note.save": "Guardar",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "Esta nota no se puede guardar tal como está.",
    "ManagerNoteTitle.Missing": "Pon un título a la nota.",
    "ManagerNoteTitle.TooLong": "Ese título es demasiado largo.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un título necesita una letra o un dígito.",
    "ManagerNoteDescription.TooLong": "Esa descripción es demasiado larga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro gestor la haya eliminado.",
    "EditManagerNote.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro gestor la haya eliminado.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro gestor la haya eliminado.",
    "ManagerNote.Deleted":
      "Esa nota se ha eliminado. Puede que otro gestor la haya eliminado.",
    "CommentaryTitle.Missing": "Pon un título a la crónica.",
    "CommentaryTitle.TooLong": "Ese título es demasiado largo.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un título necesita una letra o un dígito.",
    "Commentary.TitleTaken": "Otra crónica ya tiene ese título.",
    "CommentText.Missing": "Escribe algo en el comentario.",
    "CommentText.TooLong": "Ese comentario es demasiado largo.",
    "TeamShortName.Missing": "Pon un nombre corto al equipo.",
    "TeamShortName.TooLong":
      "Un nombre corto puede tener como máximo 10 caracteres.",
    "TeamShortName.NoLetterOrDigit":
      "Un nombre corto necesita una letra o un dígito.",
    "Team.ShortNameLongerThanName":
      "Un nombre corto no puede ser más largo que el nombre del equipo.",
    "Team.NoSuchFlag": "Elige una de las banderas disponibles.",
    "Team.Archived": "Ese equipo está archivado; hay que restaurarlo primero.",
    "Team.InATest": "Ese equipo juega en un test y no se puede archivar.",
    "Team.PlayerNameTaken": "Otro jugador de este equipo ya tiene ese nombre.",
    "TeamPlayer.NamedBye": "Un jugador no puede llamarse Bye.",
    "TeamPlayer.Archived":
      "Ese jugador está archivado; hay que restaurarlo primero.",
    "TeamPlayer.HasGames": "Ese jugador ha jugado y no se puede archivar.",
    "Tournament.TeamNameTaken":
      "Otro equipo de este torneo ya tiene ese nombre.",
    "Tournament.TeamShortNameTaken":
      "Otro equipo de este torneo ya tiene ese nombre corto.",
    "Tournament.NoSuchTeam":
      "Este torneo no tiene ningún equipo en esta dirección.",
    "Tournament.TeamArchived":
      "Este equipo está archivado y solo puede restaurarse desde la pestaña Equipos.",
    "admin.tests.add": "Añadir test",
    "admin.tests.none": "Ningún test",
    "admin.tests.edit": "Editar",
    "admin.tests.view": "Ver",
    "admin.tests.archive": "Archivar",
    "admin.tests.restore": "Restaurar",
    "admin.tests.up": "Subir",
    "admin.tests.down": "Bajar",
    "admin.tests.archived": "Tests archivados",
    "admin.tests.twoTeamsNeeded":
      "Un test es entre dos equipos, así que antes hacen falta dos equipos.",
    "admin.tests.toTeams": "Ir a Equipos",
    "admin.tests.matches.one": "{count} partido",
    "admin.tests.matches.other": "{count} partidos",
    "admin.tests.bestOf": "al mejor de {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "No se ha podido hacer.",
    "admin.test.addTitle": "Añadir test",
    "admin.test.editTitle": "Editar test",
    "admin.test.firstTeam": "Equipo A",
    "admin.test.secondTeam": "Equipo B",
    "admin.test.versus": "v",
    "admin.test.starts": "Comienza",
    "admin.test.finishes": "Termina",
    "admin.test.expectedMatches": "Partidos previstos",
    "admin.test.bestOf": "Al mejor de",
    "admin.test.group": "Grupo",
    "admin.test.add": "Añadir",
    "admin.test.save": "Guardar",
    "admin.test.added": "Se añadió {name}.",
    "admin.test.otherwise": "Este test no se puede guardar tal como está.",
    "admin.testView.otherwise": "Este test no se puede ver desde aquí.",
    "AddTest.FirstTeamMissing": "Elige el primer equipo.",
    "AddTest.SecondTeamMissing": "Elige el segundo equipo.",
    "UpdateTest.FirstTeamMissing": "Elige el primer equipo.",
    "UpdateTest.SecondTeamMissing": "Elige el segundo equipo.",
    "ExpectedMatches.NotWhole": "Introduce un número entero de partidos.",
    "ExpectedMatches.TooSmall":
      "Un test debe tener previsto al menos 1 partido.",
    "TestGroup.TooLong": "Ese grupo es demasiado largo.",
    "Tournament.TestAgainstItself":
      "Un equipo no juega un test contra sí mismo.",
    "Tournament.FormatHasNoGroups":
      "Un test en este formato no se pone en un grupo.",
    "Tournament.TestFinishesBeforeStarts":
      "Un test no puede terminar antes de empezar.",
    "Tournament.TestStartsBeforeTournament":
      "Un test no puede empezar antes que su torneo.",
    "Tournament.TestFinishesAfterTournament":
      "Un test no puede terminar después que su torneo.",
    "Tournament.TestHasGamesInUse":
      "Este test tiene partidas, así que no se puede archivar hasta que ellas lo estén.",
    "Tournament.TestHasGames":
      "Este test ya tiene partidas, así que sus equipos ya no se pueden cambiar.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Ya han empezado más partidos que esos.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dos jugadores ya han jugado más partidas que esas.",
    "Competition.ExpectedMatchesReached":
      "Este test ya ha empezado tantos partidos como tiene previstos.",
    "Competition.SameTeam":
      "Dos jugadores del mismo equipo no juegan entre sí.",
    "AddManager.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta que pueda nombrarse gestor.",
    "admin.scorers.add": "Añadir anotador",
    "admin.scorers.none": "Ningún anotador",
    "admin.scorers.removeTitle": "Quitar anotador",
    "admin.scorers.removeExplanation":
      "{name} dejará de poder introducir los resultados de este torneo.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "Esa dirección no se puede nombrar anotador.",
    "AddScorer.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta que pueda nombrarse anotador.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Solo un administrador puede hacer eso.",
    "AddRole.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta a la que se pueda dar el rol.",
    "AddRole.NoSuchRole": "No existe ese rol.",
    "RemoveRole.NoSuchAccount": "No existe esa cuenta.",
    "RemoveRole.NoSuchRole": "No existe ese rol.",
    "RemoveRole.Yourself":
      "No puedes quitarte a ti mismo el rol de administrador.",
    "AccountsWithRole.NoSuchRole": "No existe ese rol.",
    "Tournament.AlreadyAManager":
      "Esa cuenta ya gestiona el torneo y puede hacer todo lo que puede hacer un anotador.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Indica cómo se llama el torneo.",
    "TournamentName.TooShort": "Ese nombre es demasiado corto.",
    "TournamentName.TooLong": "Ese nombre es demasiado largo.",
    "TournamentName.AllLowerCase":
      "Un nombre no puede estar todo en minúsculas.",
    "TournamentName.AllCapitals":
      "Un nombre no puede estar todo en mayúsculas.",
    "TournamentName.NoLetterOrDigit":
      "Un nombre necesita una letra o un dígito.",
    "ReadOnlyDate.Unreadable": "Indica el día.",
    "Tournament.FinishesBeforeStarts":
      "Un torneo no puede terminar antes de empezar.",
    "Tournament.StartsAfterNextYear":
      "Un torneo no puede empezar después del año que viene.",
    "Tournament.FinishesAfterNextYear":
      "Un torneo no puede terminar después del año que viene.",
    "CreateTournament.NoSuchCountry": "Elige el país.",
    "TournamentSubtitle.TooLong":
      "Un subtítulo no puede tener más de 2000 caracteres.",
    "Tournament.NotAManager":
      "Solo un gestor de este torneo puede modificarlo.",
    "Tournament.NotAManagerOrScorer":
      "Solo un gestor o un anotador de este torneo puede verlo.",
    "Tournament.Archived":
      "Este torneo está archivado; hay que restaurarlo antes de poder modificarlo.",
    "UpdateTournament.NoSuchTournament":
      "No hay ningún torneo en esta dirección.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form. Written out here in full, since a catalogue
    // other than English's cannot take them from the domain.
    "sport.ac": "Croquet de asociación",
    "sport.gc": "Croquet golf",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Estándar",
    "format.teams": "Equipos",
    "format.eire-cup": "Copa Eire",
    "format.interstate-shield": "Escudo Interestatal",
    "format.gc-world-team-championship":
      "Campeonato Mundial por Equipos de Croquet Golf",
    "country.ad": "Andorra",
    "country.ae": "Emiratos Árabes Unidos",
    "country.af": "Afganistán",
    "country.ag": "Antigua y Barbuda",
    "country.ai": "Anguila",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Samoa Americana",
    "country.at": "Austria",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Islas Åland",
    "country.az": "Azerbaiyán",
    "country.ba": "Bosnia y Herzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladés",
    "country.be": "Bélgica",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgaria",
    "country.bh": "Baréin",
    "country.bi": "Burundi",
    "country.bj": "Benín",
    "country.bm": "Bermudas",
    "country.bn": "Brunéi",
    "country.bo": "Bolivia",
    "country.br": "Brasil",
    "country.bs": "Bahamas",
    "country.bt": "Bután",
    "country.bv": "Isla Bouvet",
    "country.bw": "Botsuana",
    "country.by": "Bielorrusia",
    "country.bz": "Belice",
    "country.ca": "Canadá",
    "country.catalonia": "Cataluña",
    "country.cc": "Islas Cocos (Keeling)",
    "country.cd": "República Democrática del Congo",
    "country.cf": "República Centroafricana",
    "country.cg": "República del Congo",
    "country.ch": "Suiza",
    "country.ci": "Costa de Marfil",
    "country.ck": "Islas Cook",
    "country.cl": "Chile",
    "country.cm": "Camerún",
    "country.cn": "China",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Cabo Verde",
    "country.cx": "Isla de Navidad",
    "country.cy": "Chipre",
    "country.cz": "Chequia",
    "country.de": "Alemania",
    "country.dj": "Yibuti",
    "country.dk": "Dinamarca",
    "country.dm": "Dominica",
    "country.do": "República Dominicana",
    "country.dz": "Argelia",
    "country.ec": "Ecuador",
    "country.ee": "Estonia",
    "country.eg": "Egipto",
    "country.eh": "Sáhara Occidental",
    "country.england": "Inglaterra",
    "country.er": "Eritrea",
    "country.es": "España",
    "country.et": "Etiopía",
    "country.fi": "Finlandia",
    "country.fj": "Fiyi",
    "country.fk": "Islas Malvinas",
    "country.fm": "Micronesia",
    "country.fo": "Islas Feroe",
    "country.fr": "Francia",
    "country.ga": "Gabón",
    "country.gb": "Reino Unido",
    "country.gd": "Granada",
    "country.ge": "Georgia",
    "country.gf": "Guayana Francesa",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenlandia",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadalupe",
    "country.gq": "Guinea Ecuatorial",
    "country.gr": "Grecia",
    "country.gs": "Islas Georgias del Sur y Sandwich del Sur",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bisáu",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Islas Heard y McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croacia",
    "country.ht": "Haití",
    "country.hu": "Hungría",
    "country.id": "Indonesia",
    "country.ie": "Irlanda",
    "country.il": "Israel",
    "country.im": "Isla de Man",
    "country.in": "India",
    "country.io": "Territorio Británico del Océano Índico",
    "country.iq": "Irak",
    "country.ir": "Irán",
    "country.is": "Islandia",
    "country.it": "Italia",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordania",
    "country.jp": "Japón",
    "country.ke": "Kenia",
    "country.kg": "Kirguistán",
    "country.kh": "Camboya",
    "country.ki": "Kiribati",
    "country.km": "Comoras",
    "country.kn": "San Cristóbal y Nieves",
    "country.kp": "Corea del Norte",
    "country.kr": "Corea del Sur",
    "country.kw": "Kuwait",
    "country.ky": "Islas Caimán",
    "country.kz": "Kazajistán",
    "country.la": "Laos",
    "country.lb": "Líbano",
    "country.lc": "Santa Lucía",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesoto",
    "country.lt": "Lituania",
    "country.lu": "Luxemburgo",
    "country.lv": "Letonia",
    "country.ly": "Libia",
    "country.ma": "Marruecos",
    "country.mc": "Mónaco",
    "country.md": "Moldavia",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Islas Marshall",
    "country.mk": "Macedonia del Norte",
    "country.ml": "Malí",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Islas Marianas del Norte",
    "country.mq": "Martinica",
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauricio",
    "country.mv": "Maldivas",
    "country.mw": "Malaui",
    "country.mx": "México",
    "country.my": "Malasia",
    "country.mz": "Mozambique",
    "country.na": "Namibia",
    "country.nc": "Nueva Caledonia",
    "country.ne": "Níger",
    "country.nf": "Isla Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Países Bajos",
    "country.no": "Noruega",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nueva Zelanda",
    "country.om": "Omán",
    "country.pa": "Panamá",
    "country.pe": "Perú",
    "country.pf": "Polinesia Francesa",
    "country.pg": "Papúa Nueva Guinea",
    "country.ph": "Filipinas",
    "country.pk": "Pakistán",
    "country.pl": "Polonia",
    "country.pm": "San Pedro y Miquelón",
    "country.pn": "Islas Pitcairn",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palaos",
    "country.py": "Paraguay",
    "country.qa": "Catar",
    "country.re": "Reunión",
    "country.ro": "Rumanía",
    "country.rs": "Serbia",
    "country.ru": "Rusia",
    "country.rw": "Ruanda",
    "country.sa": "Arabia Saudita",
    "country.sb": "Islas Salomón",
    "country.sc": "Seychelles",
    "country.scotland": "Escocia",
    "country.sd": "Sudán",
    "country.se": "Suecia",
    "country.sg": "Singapur",
    "country.sh": "Santa Elena",
    "country.si": "Eslovenia",
    "country.sj": "Svalbard y Jan Mayen",
    "country.sk": "Eslovaquia",
    "country.sl": "Sierra Leona",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Surinam",
    "country.st": "Santo Tomé y Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Siria",
    "country.sz": "Esuatini",
    "country.tc": "Islas Turcas y Caicos",
    "country.td": "Chad",
    "country.tf": "Territorios Australes Franceses",
    "country.tg": "Togo",
    "country.th": "Tailandia",
    "country.tj": "Tayikistán",
    "country.tk": "Tokelau",
    "country.tl": "Timor-Leste",
    "country.tm": "Turkmenistán",
    "country.tn": "Túnez",
    "country.to": "Tonga",
    "country.tr": "Turquía",
    "country.tt": "Trinidad y Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwán",
    "country.tz": "Tanzania",
    "country.ua": "Ucrania",
    "country.ug": "Uganda",
    "country.um": "Islas Menores Alejadas de los Estados Unidos",
    "country.us": "Estados Unidos",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistán",
    "country.va": "Ciudad del Vaticano",
    "country.vc": "San Vicente y las Granadinas",
    "country.ve": "Venezuela",
    "country.vg": "Islas Vírgenes Británicas",
    "country.vi": "Islas Vírgenes de los Estados Unidos",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Gales",
    "country.wf": "Wallis y Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yemen",
    "country.yt": "Mayotte",
    "country.za": "Sudáfrica",
    "country.zm": "Zambia",
    "country.zw": "Zimbabue",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. This is the one place a catalogue holds
    // markup, and it holds it because an email is written and translated as a
    // piece of writing rather than as a list of phrases somewhere else puts in
    // order: whoever writes one sees what its reader will see. Only what fills
    // an email in is escaped, so nothing given to one can become markup; the
    // markup here is the site's own. `{link}` is the link the email carries,
    // `{site}` the site's address, for a link to one of its own pages,
    // `{buttonBackgroundColour}` and `{buttonTextColour}` what a button is
    // painted with, `{emailFromName}` the name the site's emails are sent
    // from, which each email is signed off with, and `{siteName}` what the
    // site is called, which is the same name its pages call it. The last four
    // are the site's own and are filled in by the writer, never by what queued
    // the email. A button is painted where it stands, because a mail program
    // reads no stylesheet. None greets its reader by name, so that nothing
    // about a person but the address an email goes to need be put in the queue.

    "Email.ConfirmAddress.subject":
      "Confirma tu dirección de correo electrónico para {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hola,</p>

<p>
    Gracias por crear una cuenta en <strong>{siteName}</strong>.<br />
    Antes de poder empezar a usar tu cuenta, confirma tu dirección de correo electrónico
    haciendo clic en el botón de abajo:
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
        Confirmar mi dirección de correo electrónico
    </a>
</p>

<p>
    Si el botón no funciona, también puedes confirmar tu dirección de correo electrónico abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si no creaste esta cuenta, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un enlace nuevo para confirmar tu dirección de correo electrónico para {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hola,</p>

<p>
    Hace poco pediste un correo nuevo para confirmar tu dirección de correo electrónico en <strong>{siteName}</strong>.<br />
    Confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:
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
        Confirmar mi dirección de correo electrónico
    </a>
</p>

<p>
    Si el botón no funciona, también puedes confirmar tu dirección de correo electrónico abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una vez confirmada, podrás seguir usando tu cuenta sin interrupciones.
</p>

<p>
    Si no pediste este correo, puedes ignorarlo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Alguien intentó registrarse con tu dirección de correo electrónico",
    "Email.AlreadyRegistered.body": `
<p>Hola,</p>

<p>
    Alguien intentó registrarse en <strong>{siteName}</strong> con esta
    dirección de correo electrónico, que ya tiene una cuenta. No ha cambiado nada
    de tu cuenta.<br />
    Si fuiste tú, ya tienes una cuenta y puedes iniciar sesión en ella:
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
        Iniciar sesión
    </a>
</p>

<p>
    Si has olvidado tu contraseña, puedes restablecerla aquí:
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
        Olvidé mi contraseña
    </a>
</p>

<p>
    Si no fuiste tú, no tienes que hacer nada. Nadie ha recibido una forma de entrar
    en tu cuenta.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirma el traslado de tu cuenta de {siteName} a esta dirección",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hola,</p>

<p>
    Alguien que tenía la sesión iniciada en una cuenta de <strong>{siteName}</strong> pidió trasladarla
    a esta dirección de correo electrónico. Si fuiste tú, confírmalo aquí, con la sesión
    iniciada en esa cuenta. El enlace funciona durante 24 horas.
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
        Trasladar mi cuenta
    </a>
</p>

<p>
    O copia esta dirección en tu navegador:<br />
    {link}
</p>

<p>
    Si no fuiste tú, no tienes que hacer nada. Ninguna cuenta se trasladará aquí.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Alguien pidió trasladar una cuenta a tu dirección de correo electrónico",
    "Email.AlreadyHasAnAccount.body": `
<p>Hola,</p>

<p>
    Alguien que tenía la sesión iniciada en una cuenta de <strong>{siteName}</strong> pidió trasladarla
    a esta dirección de correo electrónico, que ya tiene una cuenta propia. No se ha
    trasladado nada, y no ha cambiado nada de tu cuenta.
</p>

<p>
    Si fuiste tú, ya tienes una cuenta en esta dirección y puedes iniciar sesión
    en ella.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Tu cuenta de {siteName} se ha trasladado",
    "Email.EmailAddressChanged.body": `
<p>Hola,</p>

<p>
    Tu cuenta de <strong>{siteName}</strong> se acaba de trasladar a otra dirección de
    correo electrónico, {emailAddress}, y a partir de ahora inicia sesión con esa dirección.
</p>

<p>
    Si no fuiste tú, otra persona tiene tu cuenta. Responde a este correo y
    cuéntanoslo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Se ha cambiado tu contraseña de {siteName}",
    "Email.PasswordChanged.body": `
<p>Hola,</p>

<p>
    La contraseña de tu cuenta de <strong>{siteName}</strong> se acaba de
    cambiar, y se cerró la sesión de todos los demás navegadores donde estaba iniciada.<br />
    Si fuiste tú, no tienes que hacer nada.
</p>

<p>
    Si no fuiste tú, otra persona tiene tu contraseña. Establece una nueva aquí y
    se cerrará su sesión:
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
        Olvidé mi contraseña
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Establece una contraseña nueva para {siteName}",
    "Email.SetNewPassword.body": `
<p>Hola,</p>

<p>
    Hace poco pediste restablecer tu contraseña de <strong>{siteName}</strong>.<br />
    Puedes restablecerla haciendo clic en el botón de abajo:
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
        Restablecer contraseña
    </a>
</p>

<p>
    Si el botón no funciona, también puedes restablecer tu contraseña abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si no pediste restablecer la contraseña, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Establece una contraseña para {siteName}",
    "Email.SetPassword.body": `
<p>Hola,</p>

<p>
    Tu cuenta de <strong>{siteName}</strong> no tiene contraseña: inicias sesión con Google.<br />
    Pediste establecer una, para poder iniciar sesión también con tu dirección de correo electrónico y una contraseña.
    Puedes establecerla haciendo clic en el botón de abajo:
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
        Establecer contraseña
    </a>
</p>

<p>
    Si el botón no funciona, también puedes establecer tu contraseña abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    El enlace funciona durante una hora. Si no pediste establecer una contraseña, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "No hay ninguna cuenta de {siteName} para esta dirección de correo electrónico",
    "Email.RegisterInstead.body": `
<p>Hola,</p>

<p>
    Se pidió restablecer la contraseña de una dirección de correo electrónico que
    no está asociada a ninguna cuenta de <strong>{siteName}</strong>.
</p>

<p>
    Si quieres usar nuestro servicio, puedes crear una cuenta nueva visitando:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Si no hiciste esta solicitud, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirma que tu cuenta de {siteName} debe olvidarse",
    "Email.ConfirmForgetting.body": `
<p>Hola,</p>

<p>
    Pediste que tu cuenta de <strong>{siteName}</strong> se olvidara.<br />
    Sigue el botón de abajo para ver qué significa eso y para confirmar sin
    lugar a dudas que lo quieres:
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
        Olvidar mi cuenta
    </a>
</p>

<p>
    Si el botón no funciona, también puedes abrir este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una vez olvidada, tu nombre y tu dirección de correo electrónico no podrán volver a leerse,
    por nadie, y no se podrá iniciar sesión en tu cuenta. No se puede deshacer.
</p>

<p>
    El enlace funciona una sola vez, hasta 15 minutos después de que lo pidieras, y solo
    mientras tengas la sesión iniciada en esta cuenta. Pasado ese tiempo, vuelve a pedirlo desde tu
    cuenta.
</p>

<p>
    Si no lo pediste, no ocurrirá nada a menos que se siga el enlace.
    Sin embargo, alguien con la sesión iniciada en tu cuenta lo pidió, así que establece una contraseña nueva
    desde la página de contraseña olvidada para estar seguro de que no pueda volver a iniciar sesión.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "El registro está suspendido: no se puede contactar con {service}",
    "Email.RegistrationsSuspended.body": `
<p>Hola,</p>

<p>
    {siteName} no pudo contactar con {service} a las {when}. Hasta que responda,
    a los lectores que lo necesitan, para registrarse o para establecer una contraseña nueva, se les dice que
    lo intenten más tarde.
</p>

<p>
    No hay nada que levantar. Cada intento consulta a {service} de nuevo, y las páginas
    vuelven a funcionar en cuanto responde.
</p>

<p>
    Mientras {service} siga caído, recibirás un correo sobre ello como máximo una vez
    por hora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} no puede contactar con su base de datos",
    "Email.DatabaseUnreachable.body": `
<p>Hola,</p>

<p>
    {siteName} no pudo contactar con su base de datos a las {when}. Hasta que responda, todas las páginas que la necesitan dicen a los lectores que el sitio no está disponible y que lo intenten más tarde.
</p>

<p>
    No hay nada que levantar. Cada solicitud pide una conexión de nuevo, y el sitio vuelve a funcionar en cuanto responde la base de datos.
</p>

<p>
    Mientras la base de datos siga caída, recibirás un correo sobre ello como máximo una vez cada {minutes} minutos.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} falló en una solicitud",
    "Email.UnhandledError.body": `
<p>Hola,</p>

<p>
    {siteName} falló a las {when} en una solicitud de {asked}. Al lector se le mostró la referencia {reference}, y el registro tiene la causa bajo ella.
</p>

<p>
    Un sitio averiado suele fallar en cada solicitud, así que recibirás correos sobre fallos como máximo 4 veces por hora. Los posteriores quedan igualmente en el registro.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
