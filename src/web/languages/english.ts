// The site's words in English, and the language every other falls back to for
// a word it has not got. Keyed by what each word is for; a rule broken is keyed
// by its code, so that every form saying it says it the same way.
import { countryNames } from "../../domain/aggregates/tournaments/value-objects/countryNames.js";
import { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentFormat } from "../../domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import type { Language } from "../common/language.js";

export const english: Language = {
  tag: "en",
  name: "English",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Skip to content",
    "navigation.menu": "Menu",
    "navigation.label": "Primary",
    "navigation.home": "Home",
    "navigation.help": "Help",
    "navigation.admin": "Admin",
    "sections.label": "Sections",
    "theme.label": "Theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "footer.donate": "Donate",
    "footer.plea":
      "Are you enjoying {siteName}? Please donate to help further development.",
    "footer.copyright": "© Copyright {years}, {owner}",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "This is a safe place to learn {siteName}. Anything entered here may be removed at any time.",

    "language.label": "Language",
    "language.choose": "Change",

    "form.otherwise":
      "Something here is not right. Check what was entered and try again.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "Account",
    "account.register": "Register",
    "account.signIn": "Sign In",
    "account.forgotPassword": "Forgot Password",
    "account.signOut": "Sign Out",
    "account.profile": "Profile",
    "account.changePassword": "Change Password",
    "account.changeEmailAddress": "Change Email Address",
    "account.changeName": "Change Name",
    "account.setPassword": "Set Password",
    "account.forgetAccount": "Forget Account",

    "register.title": "Register",
    "register.emailAddress": "Email address",
    "register.submit": "Register",
    "register.withGoogle": "Register with Google",
    "register.or": "or",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google has not confirmed that email address is yours, so it cannot be used with Google here. Use your email address below instead.",
    "SignInWithGoogle.LinkedToAnother":
      "That email address already has an account, linked to a different Google account. Sign in with that Google account, or with your email address and password.",
    "SignInWithGoogle.NameMissing":
      "Google did not tell us your name, and an account needs one. Use your email address below instead.",
    "Google.Unreachable":
      "Google could not be reached just now. Try again in a few minutes, or use your email address below.",
    "Registration.NotAPerson":
      "This did not look like it came from a person. Try again, and if it keeps happening, wait a few minutes and come back.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Enter an email address.",
    "EmailAddress.NoAt": "An email address has an @ in it.",
    "EmailAddress.MoreThanOneAt": "An email address has one @ in it.",
    "EmailAddress.NoDomain":
      "An email address has a domain after the @, such as example.com.",

    "welcome.title": "Check your email",
    "welcome.checkEmail":
      "An email is on its way to the address you gave. Follow the link in it to carry on.",
    "welcome.nothingArrived":
      "If nothing arrives in a few minutes, look in your junk or spam folder.",
    "welcome.home": "Back to {siteName}",
    "newConfirmationLink.title": "Get a new link",
    "newConfirmationLink.explanation":
      "The link to confirm your email address has expired. Ask for a new one and it will be sent to the address you registered with.",
    "newConfirmationLink.send": "Send me a new link",
    "newConfirmationLink.home": "Back to {siteName}",
    "newConfirmationLink.signIn": "Sign in",
    "newConfirmationLink.sent.title": "Check your email",
    "newConfirmationLink.sent.explanation":
      "A new link is on its way. Follow it to confirm your email address. If nothing arrives in a few minutes, look in your junk or spam folder.",
    "newConfirmationLink.alreadyConfirmed.title":
      "That email address is already confirmed",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "There is nothing more to confirm. Sign in with the password you gave when you confirmed it.",
    "newConfirmationLink.noLongerWorks.title": "That link no longer works",
    "newConfirmationLink.noLongerWorks.explanation":
      "Check that you followed the whole link from the email, without anything missing from the end of it. If it still does not work, register again and a new link will be sent.",
    "newConfirmationLink.tooMany.title": "Try again later",
    "newConfirmationLink.tooMany.explanation":
      "Several links have been sent to this address lately. Wait an hour and ask again, and look in your junk or spam folder meanwhile.",

    "forgotPassword.title": "Forgotten your password?",
    "forgotPassword.emailAddress": "Email address",
    "forgotPassword.submit": "Send me a way back in",
    "forgotPassword.home": "Back to {siteName}",
    "forgotPassword.sent.title": "Check your email",
    "forgotPassword.sent.explanation":
      "If that address has an account, a link to set a new password is on its way. Follow it within the hour. If nothing arrives in a few minutes, look in your junk or spam folder.",
    "forgotPassword.tryAgainLater":
      "Too many ways back in have been asked for from here lately. Wait an hour and try again.",

    "setNewPassword.title": "Set a new password",
    "setNewPassword.password": "Password",
    "setNewPassword.confirmPassword": "Confirm password",
    "setNewPassword.submit": "Set my new password",
    "setNewPassword.home": "Back to {siteName}",
    "setNewPassword.signIn": "Sign in",
    "setNewPassword.askAgain": "Ask for a new link",
    "setNewPassword.changed.title": "Your password has been changed",
    "setNewPassword.changed.explanation":
      "You have been signed out everywhere you were signed in. Sign in with your new password.",
    "setNewPassword.expired.title": "That link has expired",
    "setNewPassword.expired.explanation":
      "A link to set a new password works for an hour. Ask for another, and it will be sent to the same address.",
    "setNewPassword.noLongerWorks.title": "That link no longer works",
    "setNewPassword.noLongerWorks.explanation":
      "It may already have been used, or something may be missing from the end of it. Ask for another if you still need one.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Your password cannot be checked just now, so it has not been changed. Try again in a few minutes; your link still works until it expires.",

    "forgetAccount.title": "Forget your account",
    "forgetAccount.explanation":
      "Your name and email address can be made unreadable for good, and your account closed. To be sure it is you, we will email a link to your account's address first, and nothing is forgotten until you follow it.",
    "forgetAccount.submit": "Email me the link",
    "forgetAccount.sent.title": "Check your email",
    "forgetAccount.sent.explanation":
      "We have emailed a link to your account's address. It works for 15 minutes, and only while you are signed in to this account.",
    "forgetAccount.confirm.title": "Forget your account for good?",
    "forgetAccount.confirm.explanation":
      "Once forgotten, your name and email address can never be read again, by anybody, and your account cannot be signed in to. It cannot be undone.",
    "forgetAccount.confirm.submit": "Forget my account",
    "forgetAccount.forgotten.title": "Your account has been forgotten",
    "forgetAccount.forgotten.explanation":
      "Your name and email address can no longer be read, and you have been signed out everywhere you were signed in.",
    "forgetAccount.noLongerWorks.title": "That link no longer works",
    "forgetAccount.noLongerWorks.explanation":
      "It may have expired, been used already, or be for an account you are not signed in to. Ask again from your account if you still want it forgotten.",
    "forgetAccount.askAgain": "Ask again",
    "forgetAccount.home": "Back to {siteName}",

    "registrationsSuspended.title": "Registering is suspended for now",
    "registrationsSuspended.explanation":
      "A service registering needs cannot be reached just now, so nobody can register until it answers again. Nothing you typed was kept.",
    "registrationsSuspended.tryAgainLater":
      "Try again in a little while. The site's administrator has been told.",
    "registrationsSuspended.home": "Back to {siteName}",

    "signIn.title": "Sign in",
    "signIn.emailAddress": "Email address",
    "signIn.password": "Password",
    "signIn.submit": "Sign in",
    "signIn.forgotPassword": "Forgot Password?",
    "signIn.register": "Register",
    "signIn.withGoogle": "Sign in with Google",
    "signIn.or": "or",
    "signIn.tryAgainLater":
      "Too many attempts have been made lately. Wait an hour and try again.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "The email address or password is incorrect. Please try again.",

    "profile.title": "Profile",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Name:",
    "profile.emailAddress": "Email address:",

    "changeName.title": "Change name",
    "changeName.name": "Name",
    "changeName.submit": "Change name",

    "setPassword.title": "Set a password",
    "setPassword.explanation":
      "Your account has no password: you sign in with Google. To sign in with a password as well, we will email a link to set one to {emailAddress}.",
    "setPassword.submit": "Email me a link",
    "setPassword.sent.title": "Check your email",
    "setPassword.sent.explanation":
      "We have emailed you a link to set a password. It works for an hour.",
    "setPassword.profile": "Back to your profile",

    "changePassword.title": "Change password",
    "changePassword.currentPassword": "Current password",
    "changePassword.password": "New password",
    "changePassword.passwordConfirmation": "Confirm password",
    "changePassword.forgotPassword": "Forgot Password?",
    "changePassword.submit": "Change password",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "That is not your password.",

    "changeEmailAddress.title": "Change email address",
    "changeEmailAddress.emailAddress": "New email address",
    "changeEmailAddress.currentPassword": "Current password",
    "changeEmailAddress.submit": "Send a link to confirm",
    "changeEmailAddress.sent.title": "Check your email",
    "changeEmailAddress.sent.explanation":
      "A link to confirm the move has been sent to the new email address. Follow it, signed in, to move your account there.",
    "changeEmailAddress.confirm.title": "Move your account",
    "changeEmailAddress.confirm.explanation":
      "Your account will move to {emailAddress}. You will sign in with that address from now on.",
    "changeEmailAddress.confirm.submit": "Move my account",
    "changeEmailAddress.noLongerWorks.title": "This link no longer works",
    "changeEmailAddress.noLongerWorks.explanation":
      "It has expired, has been used, or was not sent for the account you are signed in to. Ask again from your profile.",
    "changeEmailAddress.taken.title": "Your account has not moved",
    "changeEmailAddress.profile": "Back to your profile",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "That is not your password.",
    "ChangeEmailAddress.Unchanged": "Your account is at this address already.",
    "ChangeEmailAddress.Taken":
      "That email address has an account of its own now, so yours cannot move there.",

    "confirmEmailAddress.title": "Confirm your email address",
    "confirmEmailAddress.name": "Name",
    "confirmEmailAddress.password": "Password",
    "confirmEmailAddress.confirmPassword": "Confirm password",
    "confirmEmailAddress.submit": "Confirm my email address",
    "confirmEmailAddress.signIn": "Sign in",
    "confirmEmailAddress.home": "Back to {siteName}",
    "confirmEmailAddress.confirmed.title": "Your email address is confirmed",
    "confirmEmailAddress.confirmed.explanation":
      "Your account is ready. Sign in with the email address and password you have just given.",
    "confirmEmailAddress.expired.title": "That link has expired",
    "confirmEmailAddress.expired.explanation":
      "A link to confirm an email address works for 24 hours. Ask for a new one, and it will be sent to the same address.",
    "confirmEmailAddress.expired.newLink": "Send me a new link",
    "confirmEmailAddress.noLongerWorks.title": "That link no longer works",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Check that you followed the whole link from the email, without anything missing from the end of it. If it still does not work, register again and a new link will be sent.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "That email address is already confirmed",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "There is nothing more to do. Sign in with the password you gave when you confirmed it.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Enter a name.",
    "PersonName.TooShort": "A name has to be at least 3 characters.",
    "PersonName.TooLong": "A name can be at most 254 characters.",
    "Password.Missing": "Enter a password.",
    "Password.TooShort": "A password has to be at least 12 characters.",
    "Password.ConfirmationDiffers":
      "This is not the same as the password above. Type it again.",
    "Password.Breached":
      "This password is one that has appeared in a data breach somewhere else, so it is not safe to use here. Choose another.",

    "javaScriptRequired.title": "Scripting needed",
    "javaScriptRequired.explanation":
      "Registering needs scripting switched on for this site, so that it can check that whoever is registering is a person. Switch it on, then register again.",
    "javaScriptRequired.register": "Back to registering",
    "javaScriptRequired.home": "Back to {siteName}",

    "errors.backHome": "Back to {siteName}",
    "errors.notFound": "Not found",
    "errors.refused": "That could not be done",
    "errors.refusedDetail": "Something in what was sent was not right.",
    "errors.sorry": "Sorry",
    "errors.sorryDetail": "That request could not be dealt with.",
    "errors.failed": "Something went wrong",
    "errors.reference": "Reference {reference}.",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.title": "Admin",
    "admin.tournaments.new": "New Tournament",
    "admin.tournaments.none": "No tournaments",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Archived",
    "admin.tournaments.manage": "Manage",
    "admin.tournaments.edit": "Edit",
    "admin.tournaments.archive": "Archive",
    "admin.tournaments.restore": "Restore",
    "admin.tournaments.scores": "Scores",
    "admin.years.label": "Years",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Earlier years",
    "admin.tournament.name": "Name",
    "admin.tournament.starts": "Starts",
    "admin.tournament.finishes": "Finishes",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Country",
    "admin.tournament.region": "Region",
    "admin.tournament.notes": "Notes",
    "admin.tournament.handicap": "Played with handicaps",
    "admin.tournament.drawsAllowed": "Allows drawn results",
    "admin.tournament.worldRankings": "Counts toward world rankings",
    "admin.tournament.national": "National‑level event",
    "admin.tournament.international": "International‑level event",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "This cannot be accepted as it is.",
    "admin.newTournament.title": "New Tournament",
    "admin.newTournament.submit": "Create Tournament",
    "admin.editTournament.title": "Edit Tournament",
    "admin.editTournament.submit": "Update Tournament",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "This tournament cannot be changed.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Tournament",
    "admin.view.players": "Players",
    "admin.view.competitions": "Competitions",
    "admin.view.managers": "Managers",
    "admin.view.scorers": "Scorers",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "This tournament cannot be run from here.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Competition",
    "admin.competitionView.players": "Players",
    "admin.competitionView.scores": "Scores",
    "admin.competitionView.otherwise":
      "This competition cannot be run from here.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "Block",
    "admin.competitions.knockout": "Knockout",
    "admin.competitions.swiss": "Swiss",
    "admin.competitions.view": "View",
    "admin.competitions.up": "Up",
    "admin.competitions.down": "Down",
    "admin.competitions.archive": "Archive",
    "admin.competitions.restore": "Restore",
    "admin.competitions.archived": "Archived competitions",
    "admin.competitions.none": "No competitions",
    "admin.competitions.add": "Add Competition",
    // The competition dialog.
    "admin.competition.addTitle": "Add Competition",
    "admin.competition.name": "Name",
    "admin.competition.kind": "Kind",
    "admin.competition.bestOf": "Best of",
    "admin.competition.places": "Places",
    "admin.competition.round": "Round {number}",
    "admin.competition.bestOfs": "Best ofs",
    "admin.competition.quarters": "Quarters",
    "admin.competition.semis": "Semis",
    "admin.competition.final": "Final",
    "admin.competition.add": "Add",
    "admin.competition.added": "{name} was added.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise": "This competition cannot be kept as it is.",
    "CompetitionName.Missing": "Enter a name.",
    "CompetitionName.TooLong": "A name can be at most 254 characters.",
    "Tournament.CompetitionNameTaken":
      "Another competition in this tournament already has that name.",
    "BestOf.NotWhole": "Enter a whole number of games.",
    "BestOf.TooSmall": "A match has to be the best of at least 1 game.",
    "KnockoutDraw.EvenBestOf":
      "A knockout's match has to have a winner, so it is the best of an odd number of games.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.modal.cancel": "Cancel",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "Email address",
    "admin.people.remove": "Remove",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "You",
    "admin.managers.add": "Add Manager",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "No managers",
    "admin.managers.removeTitle": "Remove Manager",
    "admin.managers.removeExplanation":
      "{name} will no longer be able to run this tournament.",
    "admin.managers.removeYourself.explanation":
      "You will no longer be able to run this tournament, and nobody here can undo that for you. Another manager can make you one again.",
    "admin.managers.otherwise": "That address cannot be made a manager.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Add Player",
    "admin.competitionPlayers.choose": "Player to add",
    "admin.competitionPlayers.nobody": "Choose a player",
    "admin.competitionPlayers.all": "Every player is in the competition",
    "admin.competitionPlayers.none": "No players",
    "admin.competitionPlayers.up": "Up",
    "admin.competitionPlayers.down": "Down",
    "admin.competitionPlayers.remove": "Remove",
    "admin.competitionPlayers.withdraw": "Withdraw",
    "admin.competitionPlayers.unwithdraw": "Unwithdraw",
    "admin.competitionPlayers.withdrawn": "Withdrawn players",
    "admin.competitionPlayers.removeTitle": "Remove Player",
    "admin.competitionPlayers.removeQuestion":
      "{name} will be taken out of the competition. This cannot be undone.",
    "admin.competitionPlayers.withdrawTitle": "Withdraw Player",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} will play no more of the competition, and the games they have not played will be decided without them.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Add Score",
    "admin.scores.none": "No scores",
    "admin.scores.archive": "Archive",
    "admin.scores.restore": "Restore",
    "admin.scores.archived": "Archived scores",
    "admin.scores.archivedSaid": "Archived",
    "admin.score.title": "Add Score",
    "admin.score.add": "Add Game",
    "admin.score.winner": "Winner",
    "admin.score.winnerScore": "Winner's score",
    "admin.score.loser": "Loser",
    "admin.score.loserScore": "Loser's score",
    "admin.score.beat": "beat",
    "admin.score.added": "The game {winner} won against {loser} was added.",
    "admin.score.otherwise": "The game could not be added.",
    "Game.WinnerMissing": "Choose the winner.",
    "Game.WinnerScoreMissing": "Type the winner's score.",
    "Game.LoserMissing": "Choose the loser.",
    "Game.LoserScoreMissing": "Type the loser's score.",
    "Score.NoPoints": "A score begins with its number of points.",
    "Game.SamePlayer": "Nobody plays themselves.",
    "Game.WinnerNotAhead":
      "The winner's score has to be more than the loser's, or marked as won.",
    "Game.LoserMarked": "The loser's score cannot be marked as won.",
    "Competition.MatchDecided": "Their match is already decided.",
    "Competition.NotDrawnToMeet": "They are not drawn to meet.",
    "CompetitionPlayer.Withdrawn": "A withdrawn player plays no more.",
    "admin.players.add": "Add Player",
    "admin.players.none": "No players",
    "admin.players.archive": "Archive",
    "admin.players.restore": "Restore",
    "admin.players.up": "Up",
    "admin.players.down": "Down",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Archive Player",
    "admin.players.archiveQuestion":
      "{name} will be removed from these competitions:",
    "admin.players.archive.explanation":
      "Restoring them will not put them back in these competitions.",
    "admin.players.archived": "Archived players",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Archived",
    // The player dialog.
    "admin.player.addTitle": "Add Player",
    "admin.player.editTitle": "Edit Player",
    "admin.player.name": "Name",
    "admin.player.representing": "Representing",
    "admin.player.flag": "Flag",
    "admin.player.add": "Add",
    "admin.player.save": "Save",
    "admin.player.added": "{name} was added.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "This player cannot be kept as they are.",
    "Tournament.PlayerNameTaken":
      "Another player in this tournament already has that name.",
    "TournamentPlayer.NoSuchFlag": "Choose one of the flags there are.",
    "AddManager.NoSuchAccount":
      "That address has no account that can be made a manager.",
    "admin.scorers.add": "Add Scorer",
    "admin.scorers.none": "No scorers",
    "admin.scorers.removeTitle": "Remove Scorer",
    "admin.scorers.removeExplanation":
      "{name} will no longer be able to enter the scores of this tournament.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "That address cannot be made a scorer.",
    "AddScorer.NoSuchAccount":
      "That address has no account that can be made a scorer.",
    "Tournament.AlreadyAManager":
      "That account manages the tournament already, and can do everything a scorer can.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Say what the tournament is called.",
    "TournamentName.TooShort": "That name is too short.",
    "TournamentName.TooLong": "That name is too long.",
    "TournamentName.AllLowerCase": "A name is not written all in lower case.",
    "TournamentName.AllCapitals": "A name is not written all in capitals.",
    "ReadOnlyDate.Unreadable": "Give the day.",
    "Tournament.FinishesBeforeStarts":
      "A tournament cannot finish before it starts.",
    "CreateTournament.NoSuchCountry": "Choose the country.",
    "TournamentNotes.TooLong": "Notes can be no longer than 2000 characters.",
    "Tournament.NotAManager":
      "Only a manager of this tournament can change it.",
    "Tournament.NotAManagerOrScorer":
      "Only a manager or a scorer of this tournament can see it.",
    "Tournament.Archived":
      "This tournament is archived, and is restored before it can be changed.",
    "UpdateTournament.NoSuchTournament":
      "There is no tournament at this address.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form. English takes the names the domain knows them
    // by, rather than writing each out a second time to drift from it.
    ...Object.fromEntries(
      Sport.all.map((sport) => [`sport.${sport.code}`, sport.name]),
    ),
    ...Object.fromEntries(
      TournamentFormat.all.map((format) => [
        `format.${format.code}`,
        format.name,
      ]),
    ),
    ...Object.fromEntries(
      countryNames.map(([code, name]) => [`country.${code}`, name]),
    ),

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

    "Email.ConfirmAddress.subject": "Confirm your email address for {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hi,</p>

<p>
    Thanks for creating an account with <strong>{siteName}</strong>.<br />
    Before you can start using your account, please confirm your email address by 
    clicking the button below:
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
        Confirm my email address
    </a>
</p>

<p>
    If the button doesn't work, you can also confirm your email address by opening this link in your browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    If you didn't create this account, you can safely ignore this email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "A new link to confirm your email address for {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hi,</p>

<p>
    You recently requested a new email to confirm your email address for <strong>{siteName}</strong>.<br />
    Please confirm your email address by clicking the button below:
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
        Confirm my email address
    </a>
</p>

<p>
    If the button doesn't work, you can also confirm your email address by opening this link in your browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Once confirmed, you'll be able to continue using your account without interruption.
</p>

<p>
    If you didn't request this email, you can safely ignore it.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Somebody tried to register with your email address",
    "Email.AlreadyRegistered.body": `
<p>Hi,</p>

<p>
    Somebody tried to register with <strong>{siteName}</strong> using this
    email address, which already has an account. Nothing about your account has
    changed.<br />
    If it was you, you already have an account, and can sign in to it:
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
        Sign In
    </a>
</p>

<p>
    If you have forgotten your password, you can reset it here:
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
        Forgot Password
    </a>
</p>

<p>
    If it was not you, you need do nothing. Nobody has been given a way into
    your account.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirm moving your {siteName} account to this address",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hi,</p>

<p>
    Somebody signed in to a <strong>{siteName}</strong> account asked to move it
    to this email address. If it was you, confirm it here, signed in to that
    account. The link works for 24 hours.
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
        Move My Account
    </a>
</p>

<p>
    Or copy this address into your browser:<br />
    {link}
</p>

<p>
    If it was not you, you need do nothing. No account will move here.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Somebody asked to move an account to your email address",
    "Email.AlreadyHasAnAccount.body": `
<p>Hi,</p>

<p>
    Somebody signed in to a <strong>{siteName}</strong> account asked to move it
    to this email address, which already has an account of its own. Nothing
    has moved, and nothing about your account has changed.
</p>

<p>
    If it was you, you already have an account at this address, and can sign in
    to it.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Your {siteName} account has moved",
    "Email.EmailAddressChanged.body": `
<p>Hi,</p>

<p>
    Your <strong>{siteName}</strong> account was just moved to another email
    address, {emailAddress}, and signs in with that address from now on.
</p>

<p>
    If it was not you, somebody else has your account. Reply to this email and
    tell us.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Your {siteName} password was changed",
    "Email.PasswordChanged.body": `
<p>Hi,</p>

<p>
    The password for your <strong>{siteName}</strong> account was just
    changed, and every other browser signed in to it was signed out.<br />
    If it was you, you need do nothing.
</p>

<p>
    If it was not you, somebody else has your password. Set a new one here, and
    they will be signed out:
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
        Forgot Password
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Set a new password for {siteName}",
    "Email.SetNewPassword.body": `
<p>Hi,</p>

<p>
    You recently requested to reset your password for <strong>{siteName}</strong>.<br />
    You can reset your password by clicking the button below:
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
        Reset Password
    </a>
</p>

<p>
    If the button doesn't work, you can also reset your password by opening this link in your browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    If you didn't request a password reset, you can safely ignore this email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Set a password for {siteName}",
    "Email.SetPassword.body": `
<p>Hi,</p>

<p>
    Your <strong>{siteName}</strong> account has no password: you sign in with Google.<br />
    You asked to set one, so that you can sign in with your email address and a password as well.
    You can set it by clicking the button below:
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
        Set Password
    </a>
</p>

<p>
    If the button doesn't work, you can also set your password by opening this link in your browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    The link works for an hour. If you didn't ask to set a password, you can safely ignore this email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "There is no {siteName} account for this email address",
    "Email.RegisterInstead.body": `
<p>Hi,</p>

<p>
    A request was made to reset the password for an email address that is 
    not associated with an account on <strong>{siteName}</strong>.
</p>

<p>
    If you would like to use our service, you can create a new account by visiting:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    If you did not make this request, you can safely ignore this email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirm that your {siteName} account is to be forgotten",
    "Email.ConfirmForgetting.body": `
<p>Hi,</p>

<p>
    You asked for your <strong>{siteName}</strong> account to be
    forgotten.<br />
    Follow the button below to see what that means, and to say for certain
    that you want it:
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
        Forget my account
    </a>
</p>

<p>
    If the button does not work, you can also open this link in your browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Once forgotten, your name and email address can never be read again, by
    anybody, and your account cannot be signed in to. It cannot be undone.
</p>

<p>
    The link works once, until 15 minutes after you asked for it, and only
    while you are signed in to this account. After that, ask again from your
    account.
</p>

<p>
    If you did not ask, nothing will happen unless the link is followed.
    Somebody signed in to your account asked, though, so set a new password
    from the forgot password page to be sure they cannot sign in again.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registering is suspended: {service} cannot be reached",
    "Email.RegistrationsSuspended.body": `
<p>Hi,</p>

<p>
    {siteName} could not reach {service} at {when}. Until it answers,
    readers who need it, to register or to set a new password, are told to
    try again later.
</p>

<p>
    Nothing needs lifting. Each attempt asks {service} afresh, and the pages
    work again the moment it answers.
</p>

<p>
    While {service} stays down, you will be emailed about it at most once an
    hour.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
