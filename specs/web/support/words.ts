// The words a page says that a step looks for by the name the site gives them,
// written out as English reads them. They are not read from the site's catalogue,
// so that a changed wording fails the scenarios that say it, which is what they
// are for. Made by listing every name the specs look up.
const words: Readonly<Record<string, string>> = {
  "Password.ConfirmationDiffers":
    "This is not the same as the password above. Type it again.",
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
