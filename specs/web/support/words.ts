// The words a page says that a step looks for by the name the site gives them,
// written out as English reads them. They are not read from the site's catalogue,
// so that a changed wording fails the scenarios that say it, which is what they
// are for. Made by listing every name the specs look up.
const words: Readonly<Record<string, string>> = {
  "Account.NotAnAdministrator": "Only an administrator can do that.",
  "AddManager.NoSuchAccount":
    "That address has no account that can be made a manager.",
  "AddPlayers.FieldNotAllowed":
    "A field can be Name, Representing, Flag, Handicap or WorldRankingPlayerName.",
  "AddPlayers.FieldRepeated": "A field can be named only once.",
  "AddPlayers.FieldsMissing":
    "Write the names of the fields on the first line.",
  "AddPlayers.FirstRowNotFields":
    "First row must be field names, see {help} for more information.",
  "AddPlayers.NameMissing": "The fields must include Name.",
  "AddPlayers.PlayersMissing": "Write a player on each line after the first.",
  "AddPlayers.TooManyPlayers":
    "A list can hold at most 500 players. Add the rest in another list.",
  "AddPlayers.ValuesMismatched":
    "Each player needs a value, or nothing, for every field named on the first line.",
  "AddRole.NoSuchAccount":
    "That address has no account that can be given the role.",
  "AddScorer.NoSuchAccount":
    "That address has no account that can be made a scorer.",
  "AddTest.FirstTeamMissing": "Choose the first team.",
  "AddTest.SecondTeamMissing": "Choose the second team.",
  "BestOf.NotWhole": "Enter a whole number of games.",
  "BestOf.TooSmall": "A match has to be the best of at least 1 game.",
  "BreachedPasswords.Unreachable":
    "Your password cannot be checked just now, so it has not been changed. Try again in a few minutes; your link still works until it expires.",
  "CarryForward.GameLossesBelowZero": "Enter 0 or more game losses.",
  "CarryForward.GameWinsBelowZero": "Enter 0 or more game wins.",
  "CarryForward.GameWinsNotWhole": "Enter a whole number of game wins.",
  "CarryForward.HoopsAgainstBelowZero": "Enter 0 or more hoops against.",
  "CarryForward.HoopsForBelowZero": "Enter 0 or more hoops for.",
  "CarryForward.MatchLossesBelowZero": "Enter 0 or more match losses.",
  "CarryForward.MatchWinsBelowZero": "Enter 0 or more match wins.",
  "CarryForward.MatchWinsNotWhole": "Enter a whole number of match wins.",
  "Competition.DrawFull": "Cannot add the player because the knockout is full.",
  "Competition.DrawNotFilled":
    "Scores cannot be added until every place in the knockout is filled with a player or a bye.",
  "Competition.ExpectedMatchesReached":
    "This test has started as many matches as it is expected to have.",
  "Competition.MatchDecided": "Their match is already decided.",
  "Competition.NotDrawnToMeet":
    "These players are not currently drawn to play each other in the knockout.",
  "Competition.PlayerAlreadyEntered": "Already in the competition",
  "Competition.WinnerHasPlayedOn":
    "The winner of this match has already played their next game, so who won it cannot change.",
  "CompetitionName.Missing": "Enter a name.",
  "CompetitionName.TooLong": "A name can be at most 254 characters.",
  "CompetitionPlayer.Withdrawn": "A withdrawn player plays no more.",
  "CreateTournament.NoSuchCountry": "Choose the country.",
  "DeleteTournament.MessageMissing": "Write something to tell the managers.",
  "EmailAddress.Missing": "Enter an email address.",
  "EmailAddress.NoAt": "An email address has an @ in it.",
  "ExpectedMatches.TooSmall":
    "A test has to be expected to have at least 1 match.",
  "Game.LoserMarked": "The loser's score cannot be marked as won.",
  "Game.LoserMissing": "Choose the loser.",
  "Game.LoserScoreMissing": "Type the loser's score.",
  "Game.ResultChanged":
    "A correction keeps the result: a game won stays won, and a drawn game stays drawn.",
  "Game.SamePlayer": "Nobody plays themselves.",
  "Game.WinnerMissing": "Choose the winner.",
  "Game.WinnerNotAhead":
    "The winner's score has to be more than the loser's, or marked as won.",
  "Game.WinnerScoreMissing": "Type the winner's score.",
  "KnockoutDraw.EvenBestOf":
    "A knockout's match has to have a winner, so it is the best of an odd number of games.",
  "ManagerNote.Deleted":
    "That note has been deleted. Another manager may have deleted it.",
  "ManagerNoteDescription.TooLong": "That description is too long.",
  "ManagerNoteTitle.Missing": "Give the note a title.",
  "ManagerNoteTitle.NoLetterOrDigit":
    "A title needs a letter or a digit in it.",
  "ManagerNoteToEdit.NoSuchManagerNote":
    "That note is no longer there. Another manager may have deleted it.",
  "Password.ConfirmationDiffers":
    "This is not the same as the password above. Type it again.",
  "PersonName.Missing": "Enter a name.",
  "PersonName.TooShort": "A name has to be at least 3 characters.",
  "ReadOnlyDate.Unreadable": "Give the day.",
  "RemoveRole.Yourself":
    "You cannot take the Administrator role from yourself.",
  "Rounds.NotWhole": "Enter a whole number of rounds.",
  "Rounds.TooSmall": "A block has to be played in at least 1 round.",
  "Score.NoPoints": "A score begins with its number of points.",
  "Team.Archived": "That team is archived, and is restored first.",
  "Team.PlayerNameTaken": "Another player in this team already has that name.",
  "Team.ShortNameLongerThanName":
    "A short name cannot be longer than the team's name.",
  "TeamName.Missing": "Say what the team is called.",
  "TeamPlayer.Archived": "That player is archived, and is restored first.",
  "TeamPlayer.NamedBye": "A player cannot be called Bye.",
  "TeamShortName.Missing": "Give the team a short name.",
  "TeamShortName.NoLetterOrDigit":
    "A short name needs a letter or a digit in it.",
  "TeamShortName.TooLong": "A short name can be at most 10 characters.",
  "TestGroup.TooLong": "That group is too long.",
  "Tournament.AlreadyAManager":
    "That account manages the tournament already, and can do everything a scorer can.",
  "Tournament.Archived":
    "This tournament is archived, and is restored before it can be changed.",
  "Tournament.BestOfBelowGamesPlayed":
    "Two players have already played more games than that.",
  "Tournament.CompetitionNameTaken":
    "Another competition in this tournament already has that name.",
  "Tournament.ExpectedMatchesBelowStarted":
    "More matches than that have started already.",
  "Tournament.FinishesAfterNextYear":
    "A tournament cannot finish after next year.",
  "Tournament.FinishesBeforeStarts":
    "A tournament cannot finish before it starts.",
  "Tournament.KnockoutHasLosersKnockoutsInUse":
    "Another knockout in use takes the losers of this one, so archive that one first.",
  "Tournament.KnockoutPlayerHasGames":
    "Players in this draw have games, so its places cannot change.",
  "Tournament.MaximumHoopsInvalid":
    "Enter a whole number of hoops, at least 1, or leave it empty for no maximum.",
  "Tournament.NoSuchTeam": "This tournament has no team at this address.",
  "Tournament.NotAManager": "Only a manager of this tournament can change it.",
  "Tournament.NotAManagerOrScorer":
    "Only a manager or a scorer of this tournament can see it.",
  "Tournament.PlayerNameTaken":
    "Another player in this tournament already has that name.",
  "Tournament.StartsAfterNextYear":
    "A tournament cannot start after next year.",
  "Tournament.TeamArchived":
    "This team is archived, and can only be restored from the Teams tab.",
  "Tournament.TeamNameTaken":
    "Another team in this tournament already has that name.",
  "Tournament.TeamShortNameTaken":
    "Another team in this tournament already has that short name.",
  "Tournament.TestFinishesAfterTournament":
    "A test cannot finish after its tournament does.",
  "Tournament.TestFinishesBeforeStarts":
    "A test cannot finish before it starts.",
  "Tournament.TestHasGames":
    "This test has games now, so its teams can no longer be changed.",
  "Tournament.TestStartsBeforeTournament":
    "A test cannot start before its tournament does.",
  "TournamentName.AllLowerCase": "A name may not be all lower case.",
  "TournamentName.Missing": "Say what the tournament is called.",
  "TournamentPlayer.HandicapMalformed":
    "Write the handicap as a number. For example: -1.5, -1, 0, 1, 2.5, 24.",
  "TournamentPlayer.NamedBye": "A player cannot be called Bye.",
  "TournamentPlayer.NoLetterOrDigit": "A name needs a letter or a digit in it.",
  "TournamentPlayer.NoSuchFlag": "Choose one of the flags there are.",
  "TournamentSubtitle.TooLong":
    "A subtitle can be no longer than 2000 characters.",
  "UpdateTournament.NoSuchTournament":
    "There is no tournament at this address.",
  "WorldRankingName.TooShort":
    "A world ranking name has to be at least 3 characters.",
  "admin.managers.removeYourself.explanation":
    "You will no longer be able to run this tournament, and nobody here can undo that for you. Another manager can make you one again.",
  "admin.notes.delete.explanation":
    "A note deleted is gone for good, and cannot be brought back.",
  "admin.player.byes":
    "A bye is not one of the tournament's players. A knockout offers Bye whenever its players are added, as many times as its draw needs.",
  "admin.players.archive.explanation":
    "Restoring them will not put them back in these competitions.",
  "admin.rankings.file":
    "The world rankings will use the tournament's results through this function, so managers do not need to do anything.",
  "admin.score.playersUnread":
    "The players could not be read. Close this dialog and open it again.",
  "admin.team.shortName.explanation":
    "What the team's tests are called by, as AUS v ENG.",
  "admin.tests.twoTeamsNeeded":
    "A test is between two teams, so two teams are needed first.",
  "changeEmailAddress.confirm.explanation":
    "Your account will move to {emailAddress}. You will sign in with that address from now on.",
  "changeEmailAddress.emailAddress": "New email address",
  "changeEmailAddress.noLongerWorks.title": "This link no longer works",
  "changeEmailAddress.title": "Change email address",
  "changeName.title": "Change name",
  "changePassword.currentPassword": "Current password",
  "changePassword.password": "New password",
  "changePassword.passwordConfirmation": "Confirm password",
  "changePassword.title": "Change password",
  "confirmEmailAddress.alreadyConfirmed.explanation":
    "There is nothing more to do. Sign in with the password you gave when you confirmed it.",
  "confirmEmailAddress.confirmPassword": "Confirm password",
  "confirmEmailAddress.confirmed.explanation":
    "Your account is ready. Sign in with the email address and password you have just given.",
  "confirmEmailAddress.expired.explanation":
    "A link to confirm an email address works for 24 hours. Ask for a new one, and it will be sent to the same address.",
  "confirmEmailAddress.noLongerWorks.explanation":
    "Check that you followed the whole link from the email, without anything missing from the end of it. If it still does not work, register again and a new link will be sent.",
  "confirmEmailAddress.title": "Confirm your email address",
  "forgetAccount.confirm.explanation":
    "Once forgotten, your name and email address can never be read again, by anybody, and your account cannot be signed in to. It cannot be undone.",
  "forgetAccount.forgotten.explanation":
    "Your name and email address can no longer be read, and you have been signed out everywhere you were signed in.",
  "forgetAccount.lastAdministrator.explanation":
    "You are this site's only administrator. Give the Administrator role to somebody else, and then your account can be forgotten.",
  "forgetAccount.noLongerWorks.explanation":
    "It may have expired, been used already, or be for an account you are not signed in to. Ask again from your account if you still want it forgotten.",
  "forgetAccount.title": "Forget your account",
  "forgotPassword.title": "Forgotten your password?",
  "forgotPassword.tryAgainLater":
    "Too many ways back in have been asked for from here lately. Wait an hour and try again.",
  "newConfirmationLink.alreadyConfirmed.explanation":
    "There is nothing more to confirm. Sign in with the password you gave when you confirmed it.",
  "newConfirmationLink.noLongerWorks.explanation":
    "Check that you followed the whole link from the email, without anything missing from the end of it. If it still does not work, register again and a new link will be sent.",
  "newConfirmationLink.title": "Get a new link",
  "newConfirmationLink.tooMany.explanation":
    "Several links have been sent to this address lately. Wait an hour and ask again, and look in your junk or spam folder meanwhile.",
  "profile.title": "Profile",
  "registrationsSuspended.explanation":
    "A service registering needs cannot be reached just now, so nobody can register until it answers again. Nothing you typed was kept.",
  "registrationsSuspended.title": "Registering is suspended for now",
  "registrationsSuspended.tryAgainLater":
    "Try again in a little while. The site's administrator has been told.",
  "setNewPassword.changed.explanation":
    "You have been signed out everywhere you were signed in. Sign in with your new password.",
  "setNewPassword.expired.explanation":
    "A link to set a new password works for an hour. Ask for another, and it will be sent to the same address.",
  "setNewPassword.noLongerWorks.explanation":
    "It may already have been used, or something may be missing from the end of it. Ask for another if you still need one.",
  "setPassword.title": "Set a password",
  "signIn.tryAgainLater":
    "Too many attempts have been made lately. Wait an hour and try again.",
};

/** What English says for `key`. */
export const wordsFor = (key: string): string => {
  const said = words[key];
  if (said === undefined)
    throw new Error(`The specs have no words for ${key}.`);
  return said;
};
