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
