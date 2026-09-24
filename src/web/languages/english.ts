// The site's words in English, and the language every other falls back to for
// a word it has not got. Keyed by what each word is for; a rule broken is keyed
// by its code, so that every form saying it says it the same way.
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
    "navigation.tournaments": "Tournaments",
    "navigation.blog": "Blog",
    "navigation.help": "Help",
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

    "register.title": "Register",
    "register.emailAddress": "Email address",
    "register.submit": "Register",
    "register.withGoogle": "Register with Google",
    "register.or": "or",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google has not confirmed that email address is yours, so it cannot be used to register here. Register with it below instead, and we will email you a link to confirm it.",
    "SignInWithGoogle.LinkedToAnother":
      "That email address already has an account, linked to a different Google account. Sign in with that Google account, or with your email address and password.",
    "SignInWithGoogle.NameMissing":
      "Google did not tell us your name, and an account needs one. Register with your email address below instead.",
    "Google.Unreachable":
      "Google could not be reached just now. Try again in a few minutes, or register with your email address below.",
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
    "signIn.tryAgainLater":
      "Too many attempts have been made lately. Wait an hour and try again.",
    "signIn.failed":
      "The email address or password is incorrect. Please try again.",

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
