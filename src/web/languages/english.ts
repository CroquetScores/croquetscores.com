// The site's words in English, and the language every other falls back to for
// a word it has not got. Keyed by what each word is for; a rule broken is keyed
// by its code, so that every form saying it says it the same way.
import type { Language } from "../common/language.js";

export const english: Language = {
  tag: "en",
  name: "English",
  words: {
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

    "register.title": "Register",
    "register.emailAddress": "Email address",
    "register.password": "Password",
    "register.cancel": "Cancel",
    "register.submit": "Register",
    "register.notOpen": "Registering is not open yet.",

    "welcome.title": "Check your email",
    "welcome.checkEmail":
      "An email is on its way to the address you gave. Follow the link in it to carry on.",
    "welcome.nothingArrived":
      "If nothing arrives in a few minutes, look in your junk or spam folder.",
    "welcome.home": "Back to Croquet Scores",
    "newConfirmationLink.title": "Get a new link",
    "newConfirmationLink.explanation":
      "The link to confirm your email address has expired. Ask for a new one and it will be sent to the address you registered with.",
    "newConfirmationLink.send": "Send me a new link",
    "newConfirmationLink.home": "Back to Croquet Scores",
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

    "signIn.title": "Sign in",
    "signIn.emailAddress": "Email address",
    "signIn.password": "Password",
    "signIn.cancel": "Cancel",
    "signIn.submit": "Sign in",
    "signIn.elsewhere": "If you cannot sign in",
    "signIn.forgotPassword": "I have forgotten my password",
    "signIn.register": "I do not have an account yet",
    "signIn.tryAgainLater":
      "Too many attempts have been made lately. Wait an hour and try again.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "That email address and password do not sign in to anything. Check both and try again.",

    "confirmEmailAddress.title": "Confirm your email address",
    "confirmEmailAddress.name": "Name",
    "confirmEmailAddress.password": "Password",
    "confirmEmailAddress.passwordAgain": "Password again",
    "confirmEmailAddress.cancel": "Cancel",
    "confirmEmailAddress.submit": "Confirm my email address",
    "confirmEmailAddress.signIn": "Sign in",
    "confirmEmailAddress.home": "Back to Croquet Scores",
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
    "javaScriptRequired.home": "Back to Croquet Scores",

    "errors.backHome": "Back to Croquet Scores",
    "errors.notFound": "Not found",
    "errors.refused": "That could not be done",
    "errors.refusedDetail": "Something in what was sent was not right.",
    "errors.sorry": "Sorry",
    "errors.sorryDetail": "That request could not be dealt with.",
    "errors.failed": "Something went wrong",
    "errors.reference": "Reference {reference}.",

    // An email's words are keyed by its kind, one paragraph to a key, and a
    // link's words apart from where it goes, so that no catalogue holds markup.
    // None greets its reader by name, so that nothing about a person but the
    // address an email goes to need be put in the queue.
    "email.signOff": "Croquet Scores",
    "email.linkFallback":
      "If the button does not work, copy this address into your browser: {link}",

    "Email.ConfirmAddress.subject":
      "Confirm your email address for Croquet Scores",
    "Email.ConfirmAddress.intro":
      "Thank you for registering with Croquet Scores. To finish, confirm that this is your email address.",
    "Email.ConfirmAddress.action": "Confirm my email address",
    "Email.ConfirmAddress.expiry":
      "The link works for 24 hours. If it has expired by the time you follow it, you will be offered a new one.",
    "Email.ConfirmAddress.notYou":
      "If you did not register, somebody may have typed your email address by mistake. You need do nothing: nobody can sign in to the account without this link.",

    "Email.ConfirmAddressAgain.subject":
      "A new link to confirm your email address for Croquet Scores",
    "Email.ConfirmAddressAgain.intro":
      "Here is a new link to confirm your email address for Croquet Scores. Any earlier link that has not expired still works too.",
    "Email.ConfirmAddressAgain.action": "Confirm my email address",
    "Email.ConfirmAddressAgain.expiry":
      "The link works for 24 hours. If it has expired by the time you follow it, you will be offered a new one.",
    "Email.ConfirmAddressAgain.registeredAgain":
      "If you registered again to get this, nothing you gave the second time was kept. Sign in with the password you first registered with, or set a new one from the forgot password page.",
    "Email.ConfirmAddressAgain.notYou":
      "If you did not register, somebody may have typed your email address by mistake. You need do nothing: nobody can sign in to the account without this link.",

    "Email.AlreadyRegistered.subject":
      "Somebody tried to register with your email address",
    "Email.AlreadyRegistered.intro":
      "Somebody tried to register with Croquet Scores using this email address, which already has an account. Nothing about your account has changed.",
    "Email.AlreadyRegistered.ifYou":
      "If it was you, you already have an account, and can sign in to it.",
    "Email.AlreadyRegistered.action": "Sign in",
    "Email.AlreadyRegistered.forgotten":
      "If you have forgotten your password, you can set a new one.",
    "Email.AlreadyRegistered.forgottenAction": "Set a new password",
    "Email.AlreadyRegistered.notYou":
      "If it was not you, you need do nothing. Nobody has been given a way into your account.",

    "Email.SetNewPassword.subject": "Set a new password for Croquet Scores",
    "Email.SetNewPassword.intro":
      "Somebody asked for a way back in to your Croquet Scores account. Follow the link to set a new password.",
    "Email.SetNewPassword.action": "Set a new password",
    "Email.SetNewPassword.expiry":
      "The link works once, until an hour after you asked for it. After that, ask again from the forgot password page.",
    "Email.SetNewPassword.signsOut":
      "Setting a new password signs your account out on every device it is signed in on.",
    "Email.SetNewPassword.notYou":
      "If you did not ask, you need do nothing. Your password stays as it is unless this link is followed.",

    "Email.RegisterInstead.subject":
      "There is no Croquet Scores account for this email address",
    "Email.RegisterInstead.intro":
      "Somebody asked for a way back in to Croquet Scores with this email address, but there is no account for it.",
    "Email.RegisterInstead.otherAddress":
      "If you registered with another email address, ask again with that one.",
    "Email.RegisterInstead.register":
      "If you meant to make an account, you can register now.",
    "Email.RegisterInstead.action": "Register",
    "Email.RegisterInstead.notYou":
      "If you did not ask, you need do nothing. No account has been made.",

    "Email.ConfirmForgetting.subject":
      "Confirm that your Croquet Scores account is to be forgotten",
    "Email.ConfirmForgetting.intro":
      "You asked for your Croquet Scores account to be forgotten. Follow the link to see what that means, and to say for certain that you want it.",
    "Email.ConfirmForgetting.action": "Forget my account",
    "Email.ConfirmForgetting.meaning":
      "Once forgotten, your name and email address can never be read again, by anybody, and your account cannot be signed in to. It cannot be undone.",
    "Email.ConfirmForgetting.expiry":
      "The link works once, until 15 minutes after you asked for it, and only while you are signed in to this account. After that, ask again from your account.",
    "Email.ConfirmForgetting.notYou":
      "If you did not ask, nothing will happen unless the link is followed. Somebody signed in to your account asked, though, so set a new password from the forgot password page to be sure they cannot sign in again.",

    "Email.RegistrationsSuspended.subject":
      "Registering is suspended: {service} cannot be reached",
    "Email.RegistrationsSuspended.intro":
      "Croquet Scores could not reach {service} at {when}. Until it answers, readers who need it, to register or to set a new password, are told to try again later.",
    "Email.RegistrationsSuspended.lifting":
      "Nothing needs lifting. Each attempt asks {service} afresh, and the pages work again the moment it answers.",
    "Email.RegistrationsSuspended.again":
      "While {service} stays down, you will be emailed about it at most once an hour.",
  },
};
